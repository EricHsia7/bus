import { MapConfig } from '.';
import { Camera, latToMercY, lngToMercX } from './camera';
import { buildTileKey, PackedLabelTile, TileCoord, TileKey, WorkerResponse } from './types';

/* ------------------------------------------------------------- tile server */

/** Origin the raster + label tiles are served from. */
const TILE_SERVER_URL = 'https://erichsia7.github.io/bus-map';
/** How far outside the viewport label tiles are pre-fetched, in screen px. */
const LABEL_PREFETCH_PADDING = 128;
/** How many pyramid levels up we may borrow a parent tile as a fallback. */
const MAX_PARENT_LEVELS = 5;

/** URL of a single raster (basemap image) tile. */
const getTileUrl = (coord: TileCoord): string => `${TILE_SERVER_URL}/tiles/${coord.z}/${coord.x}/${coord.y}.webp`;

/** URL of a single gzipped GeoJSON label tile. */
const getLabelUrl = (coord: TileCoord): string => `${TILE_SERVER_URL}/labels/${coord.z}/${coord.x}/${coord.y}.geojson.gz`;

/* ---------------------------------------------------------------------- LRU */

/** A small least-recently-used cache; the oldest entry is evicted past `max`. */
export class LRU<V> {
  private map = new Map<string, V>();
  constructor(
    private max: number,
    private dispose?: (value: V) => void
  ) {}

  get(key: string): V | undefined {
    const value = this.map.get(key);
    if (value !== undefined) {
      // re-insert so this key becomes the most-recently-used
      this.map.delete(key);
      this.map.set(key, value);
    }
    return value;
  }

  peek(key: string): V | undefined {
    return this.map.get(key);
  }
  has(key: string): boolean {
    return this.map.has(key);
  }

  set(key: string, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    while (this.map.size > this.max) {
      const oldestKey = this.map.keys().next().value as string;
      const evicted = this.map.get(oldestKey)!;
      this.map.delete(oldestKey);
      this.dispose?.(evicted);
    }
  }

  get size(): number {
    return this.map.size;
  }

  clear(): void {
    if (this.dispose) for (const value of this.map.values()) this.dispose(value);
    this.map.clear();
  }
}

/* --------------------------------------------------------------- cover() */

export interface CoverOptions {
  zoom: number;
  /** mercator data box; tiles that don't intersect are skipped */
  box?: { minX: number; minY: number; maxX: number; maxY: number } | null;
  /** viewport padding in screen px (pre-load a ring around the viewport) */
  padPx?: number;
}

/** integer tile zoom for a fractional camera zoom */
export function tileZoom(camera: Camera, minZoom: number, maxZoom: number): number {
  const zoom = Math.round(camera.zoom);
  return Math.max(minZoom, Math.min(maxZoom, zoom));
}

/** tile keys covering the viewport, ordered by distance from the screen centre */
export function cover(camera: Camera, options: CoverOptions): TileCoord[] {
  const zoom = options.zoom;
  const tileCount = 1 << zoom;
  const bounds = camera.visibleBounds(options.padPx ?? 0);

  const minTileX = Math.max(0, Math.floor(bounds.minX * tileCount));
  const maxTileX = Math.min(tileCount - 1, Math.floor(bounds.maxX * tileCount));
  const minTileY = Math.max(0, Math.floor(bounds.minY * tileCount));
  const maxTileY = Math.min(tileCount - 1, Math.floor(bounds.maxY * tileCount));

  // data-box test in tile space (avoids requesting out-of-box tiles at all)
  let boxMinX = -Infinity;
  let boxMaxX = Infinity;
  let boxMinY = -Infinity;
  let boxMaxY = Infinity;
  if (options.box) {
    boxMinX = Math.floor(options.box.minX * tileCount);
    boxMaxX = Math.ceil(options.box.maxX * tileCount) - 1;
    boxMinY = Math.floor(options.box.minY * tileCount);
    boxMaxY = Math.ceil(options.box.maxY * tileCount) - 1;
  }

  // fractional centre tile, used to sort nearest-first
  const centerTileX = camera.x * tileCount - 0.5;
  const centerTileY = camera.y * tileCount - 0.5;
  const coords: TileCoord[] = [];
  for (let y = minTileY; y <= maxTileY; y++) {
    if (y < boxMinY || y > boxMaxY) continue;
    for (let x = minTileX; x <= maxTileX; x++) {
      if (x < boxMinX || x > boxMaxX) continue;
      coords.push({ z: zoom, x, y });
    }
  }
  coords.sort(
    (first, second) =>
      (first.x - centerTileX) ** 2 +
      (first.y - centerTileY) ** 2 -
      ((second.x - centerTileX) ** 2 + (second.y - centerTileY) ** 2)
  );
  return coords;
}

/** screen rect of a tile under the camera's affine transform */
export function tileScreenRect(camera: Camera, coord: TileCoord): { left: number; top: number; right: number; bottom: number } {
  const tileCount = 1 << coord.z;
  return {
    left: camera.projectX(coord.x / tileCount),
    top: camera.projectY(coord.y / tileCount),
    right: camera.projectX((coord.x + 1) / tileCount),
    bottom: camera.projectY((coord.y + 1) / tileCount)
  };
}

/* --------------------------------------------------------- worker client */

interface QueuedJob {
  message: Record<string, unknown> & { id: number };
  resolve: (response: WorkerResponse) => void;
}

/**
 * One module worker handles every job. That is enough because the worker never
 * blocks on CPU for long: fetch(), createImageBitmap() and DecompressionStream
 * all yield, so `maxConcurrent` requests overlap inside the single thread.
 * We keep the queue on this side so aborts are cheap (a queued job is dropped
 * without ever being posted) and so we never flood the worker's task queue.
 */
class WorkerClient {
  private worker: Worker;
  private inflight = new Map<number, (response: WorkerResponse) => void>();
  private queue: QueuedJob[] = [];
  private nextId = 1;

  constructor(
    worker: Worker,
    private maxConcurrent: number
  ) {
    this.worker = worker;
    this.worker.onmessage = (event: MessageEvent) => this.handleMessage(event.data as WorkerResponse);
  }

  private handleMessage(response: WorkerResponse): void {
    const resolve = this.inflight.get(response.id);
    if (resolve) {
      this.inflight.delete(response.id);
      resolve(response);
    }
    // a late reply for an aborted job lands here too: no resolver, just refill
    this.pump();
  }

  private pump(): void {
    while (this.queue.length && this.inflight.size < this.maxConcurrent) {
      const job = this.queue.shift()!;
      this.inflight.set(job.message.id, job.resolve);
      this.worker.postMessage(job.message);
    }
  }

  /** enqueue a job; returns its id so it can be aborted */
  submit(message: Record<string, unknown>, resolve: (response: WorkerResponse) => void): number {
    const id = this.nextId++;
    this.queue.push({ message: { ...message, id }, resolve });
    this.pump();
    return id;
  }

  abort(id: number): void {
    const queuedIndex = this.queue.findIndex((job) => job.message.id === id);
    if (queuedIndex >= 0) {
      this.queue.splice(queuedIndex, 1);
      return;
    }
    if (this.inflight.delete(id)) {
      // aborts jump the queue: they only touch the AbortController map
      this.worker.postMessage({ type: 'abort', id });
      this.pump();
    }
  }

  get pending(): number {
    return this.queue.length + this.inflight.size;
  }

  destroy(): void {
    this.worker.onmessage = null;
    this.worker.terminate();
    this.queue = [];
    this.inflight.clear();
  }
}

/* --------------------------------------------------------- TileManager */

const MISSING = 'missing' as const;
type RasterEntry = ImageBitmap | typeof MISSING;
type LabelEntry = PackedLabelTile | typeof MISSING;

export interface DrawTile {
  coord: TileCoord;
  bitmap: ImageBitmap;
  /** source sub-rect in bitmap pixels (parent fallback); null = whole bitmap */
  src: { x: number; y: number; w: number; h: number } | null;
  /** destination rect in CSS px */
  dst: { left: number; top: number; right: number; bottom: number };
  /** true when this is not the requested level (drawn under, lower priority) */
  fallback: boolean;
}

export interface FrameTiles {
  zoom: number;
  rasters: DrawTile[];
  labels: PackedLabelTile[];
  pending: number;
  missing: number;
}

export class TileManager {
  private io: WorkerClient;
  private rasters: LRU<RasterEntry>;
  private labels: LRU<LabelEntry>;
  private rasterJobs = new Map<TileKey, number>();
  private labelJobs = new Map<TileKey, number>();
  private box: { minX: number; minY: number; maxX: number; maxY: number } | null;

  constructor(
    private config: MapConfig,
    private onLoad: () => void,
    worker: Worker
  ) {
    this.io = new WorkerClient(worker, config.concurrency);
    this.rasters = new LRU<RasterEntry>(config.rasterCacheSize, (value) => {
      if (value !== MISSING) value.close();
    });
    this.labels = new LRU<LabelEntry>(config.labelCacheSize);
    this.box = config.bounds
      ? {
          minX: lngToMercX(config.bounds[0]),
          minY: latToMercY(config.bounds[3]),
          maxX: lngToMercX(config.bounds[2]),
          maxY: latToMercY(config.bounds[1])
        }
      : null;
  }

  get stats(): { rasters: number; labels: number; pending: number } {
    return { rasters: this.rasters.size, labels: this.labels.size, pending: this.io.pending };
  }

  /**
   * Called every frame. Cheap when nothing changed: cover() is a couple of
   * loops, and requests are deduped against the caches + in-flight maps.
   */
  update(camera: Camera): FrameTiles {
    // tiles stop at config.maxZoom; beyond that the deepest level is scaled up (overzoom)
    const zoom = tileZoom(camera, this.config.minZoom, this.config.maxZoom);
    const wantedTiles = cover(camera, { zoom, box: this.box, padPx: this.config.tileSize / 2 });

    /* ---- raster requests (centre-first) + abort what left the viewport ---- */
    const wantedKeys = new Set<TileKey>();
    for (const coord of wantedTiles) wantedKeys.add(buildTileKey(coord.z, coord.x, coord.y));
    for (const [key, id] of this.rasterJobs) {
      if (!wantedKeys.has(key)) {
        this.io.abort(id);
        this.rasterJobs.delete(key);
      }
    }
    for (const coord of wantedTiles) {
      const key = buildTileKey(coord.z, coord.x, coord.y);
      if (this.rasters.has(key) || this.rasterJobs.has(key)) continue;
      this.requestRaster(key, coord);
    }

    /* -------------------------------- draw list with parent/child fallback */
    const rasterDrawList: DrawTile[] = [];
    let missing = 0;
    for (const coord of wantedTiles) {
      const key = buildTileKey(coord.z, coord.x, coord.y);
      const dst = tileScreenRect(camera, coord);
      const entry = this.rasters.get(key);
      if (entry && entry !== MISSING) {
        rasterDrawList.push({ coord, bitmap: entry, src: null, dst, fallback: false });
        continue;
      }
      missing++;
      // note: a 404'd tile still gets a parent fallback — sparse pyramids are normal
      if (!this.pushParent(coord, dst, rasterDrawList) && entry !== MISSING) {
        this.pushChildren(camera, coord, rasterDrawList);
      }
    }
    // fallbacks first so sharp tiles paint on top
    rasterDrawList.sort((first, second) => Number(second.fallback) - Number(first.fallback));

    /* ------------------------------------------------------- label tiles */
    const labelTiles: PackedLabelTile[] = [];
    const labelZoom = Math.max(this.config.labelMinZoom, Math.min(this.config.labelMaxZoom, zoom));
    const labelCover = cover(camera, { zoom: labelZoom, box: this.box, padPx: LABEL_PREFETCH_PADDING });
    const labelWanted = new Set<TileKey>();
    for (const coord of labelCover) labelWanted.add(buildTileKey(coord.z, coord.x, coord.y));
    for (const [key, id] of this.labelJobs) {
      if (!labelWanted.has(key)) {
        this.io.abort(id);
        this.labelJobs.delete(key);
      }
    }
    for (const coord of labelCover) {
      const key = buildTileKey(coord.z, coord.x, coord.y);
      const entry = this.labels.get(key);
      if (entry === undefined) {
        if (!this.labelJobs.has(key)) this.requestLabels(key, coord);
        continue;
      }
      if (entry !== MISSING) labelTiles.push(entry);
    }

    return { zoom, rasters: rasterDrawList, labels: labelTiles, pending: this.io.pending, missing };
  }

  /** walk up the pyramid for an already-decoded ancestor and crop it */
  private pushParent(coord: TileCoord, dst: DrawTile['dst'], out: DrawTile[]): boolean {
    for (let levelsUp = 1; levelsUp <= MAX_PARENT_LEVELS && coord.z - levelsUp >= this.config.minZoom; levelsUp++) {
      const parentZoom = coord.z - levelsUp;
      const step = 1 << levelsUp;
      const parentX = coord.x >> levelsUp;
      const parentY = coord.y >> levelsUp;
      const entry = this.rasters.get(buildTileKey(parentZoom, parentX, parentY));
      if (!entry || entry === MISSING) continue;
      const sourceWidth = entry.width / step;
      const sourceHeight = entry.height / step;
      out.push({
        coord,
        bitmap: entry,
        src: {
          x: (coord.x - parentX * step) * sourceWidth,
          y: (coord.y - parentY * step) * sourceHeight,
          w: sourceWidth,
          h: sourceHeight
        },
        dst,
        fallback: true
      });
      return true;
    }
    return false;
  }

  /** zooming out: reuse the four children we already have */
  private pushChildren(camera: Camera, coord: TileCoord, out: DrawTile[]): void {
    if (coord.z + 1 > this.config.maxZoom) return;
    for (let offsetY = 0; offsetY < 2; offsetY++) {
      for (let offsetX = 0; offsetX < 2; offsetX++) {
        const child = { z: coord.z + 1, x: coord.x * 2 + offsetX, y: coord.y * 2 + offsetY };
        const entry = this.rasters.get(buildTileKey(child.z, child.x, child.y));
        if (!entry || entry === MISSING) continue;
        out.push({
          coord: child,
          bitmap: entry,
          src: null,
          dst: tileScreenRect(camera, child),
          fallback: true
        });
      }
    }
  }

  private requestRaster(key: TileKey, coord: TileCoord): void {
    const id = this.io.submit({ type: 'raster', key, url: getTileUrl(coord) }, (response) => {
      this.rasterJobs.delete(key);
      if (response.type === 'raster') {
        this.rasters.set(key, response.bitmap);
        this.onLoad();
      } else if (response.type === 'error' && !response.aborted) {
        // a permanently-missing tile is cached as MISSING so we stop retrying it
        if (response.status === 404 || response.status === 403 || response.status === 410) {
          this.rasters.set(key, MISSING);
        }
      }
    });
    this.rasterJobs.set(key, id);
  }

  private requestLabels(key: TileKey, coord: TileCoord): void {
    const id = this.io.submit({ type: 'labels', key, url: getLabelUrl(coord), z: coord.z, x: coord.x, y: coord.y }, (response) => {
      this.labelJobs.delete(key);
      if (response.type === 'labels') {
        this.labels.set(key, response.tile);
        this.onLoad();
      } else if (response.type === 'error' && !response.aborted) {
        this.labels.set(key, MISSING);
      }
    });
    this.labelJobs.set(key, id);
  }

  destroy(): void {
    this.io.destroy();
    this.rasters.clear();
    this.labels.clear();
    this.rasterJobs.clear();
    this.labelJobs.clear();
  }
}

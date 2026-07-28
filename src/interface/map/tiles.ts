import { MapConfig } from '.';
import { Camera, latToMercY, lngToMercX } from '../../tools/camera';
import { PackedLabelTile } from './labels';
import { WorkerResponse } from './worker';

/** How far outside the viewport label tiles are pre-fetched, in screen px. */
const LABEL_PREFETCH_PADDING = 128;
/** How many pyramid levels up we may borrow a parent tile as a fallback. */
const MAX_PARENT_LEVELS = 5;

/** URL of a single raster (basemap image) tile. */
function getTileUrl(coord: TileCoord): string {
  return `https://erichsia7.github.io/bus-map/tiles/${coord.z}/${coord.x}/${coord.y}.webp`;
}

/** URL of a single gzipped GeoJSON label tile. */
function getLabelUrl(coord: TileCoord): string {
  return `https://erichsia7.github.io/bus-map/labels/${coord.z}/${coord.x}/${coord.y}.gz`;
}

/**
 * Extra headroom for the runtime-sized tile caches: keep this many screens'
 * worth of tiles so the working set (current viewport + prefetch ring) never
 * evicts a still-visible tile. The spare screen also absorbs small pans and the
 * adjacent zoom level's tiles during a zoom.
 */
const CACHE_BUFFER_FACTOR = 2;

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
    this.trim();
  }

  /** Raise or lower the capacity, evicting least-recently-used entries if it shrank. */
  setMax(max: number): void {
    this.max = Math.max(1, Math.floor(max));
    this.trim();
  }

  /** Evict least-recently-used entries until the cache is within `max`. */
  private trim(): void {
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

export interface CoverOptions {
  zoom: number;
  /** mercator data box; tiles that don't intersect are skipped */
  box?: { minX: number; minY: number; maxX: number; maxY: number } | null;
  /** viewport padding in screen px (pre-load a ring around the viewport) */
  padPx?: number;
}

export interface TileCoord {
  z: number;
  x: number;
  y: number;
}

export type TileKey = string;

/** Build the canonical "z/x/y" cache key for a tile. */
export const buildTileKey = (z: number, x: number, y: number): TileKey => `${z}/${x}/${y}`;

/** Parse a "z/x/y" cache key back into its numeric coordinate. */
export const parseTileKey = (key: TileKey): TileCoord => {
  const [z, x, y] = key.split('/');
  return { z: +z, x: +x, y: +y };
};

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
  coords.sort((first, second) => (first.x - centerTileX) ** 2 + (first.y - centerTileY) ** 2 - ((second.x - centerTileX) ** 2 + (second.y - centerTileY) ** 2));
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
  // one queue per request class so labels can interleave with rasters instead of
  // waiting behind the whole raster backlog (see nextJob)
  private rasterQueue: QueuedJob[] = [];
  private labelQueue: QueuedJob[] = [];
  // round-robin bit: whether the next job should come from the label queue
  private serveLabelsNext = false;
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

  /**
   * Pick the next job, alternating between rasters and labels so both classes
   * make progress together. Without this, a frame that queues ~150 raster tiles
   * ahead of its labels would run every raster first and labels would only start
   * once that backlog cleared — popping in visibly late.
   */
  private nextJob(): QueuedJob | undefined {
    const preferred = this.serveLabelsNext ? this.labelQueue : this.rasterQueue;
    const other = this.serveLabelsNext ? this.rasterQueue : this.labelQueue;
    const job = preferred.shift() ?? other.shift();
    // only flip when we actually took a job, so an empty preferred queue doesn't
    // waste its turn while the other class still has a backlog
    if (job) this.serveLabelsNext = !this.serveLabelsNext;
    return job;
  }

  private pump(): void {
    while (this.inflight.size < this.maxConcurrent) {
      const job = this.nextJob();
      if (!job) break;
      this.inflight.set(job.message.id, job.resolve);
      this.worker.postMessage(job.message);
    }
  }

  /**
   * Enqueue a job and return its id so it can be aborted. Enqueue does NOT pump:
   * the caller submits a whole frame of raster + label jobs and then calls
   * flush() once, so the first batch is already interleaved fairly rather than
   * filled entirely from whichever class happened to be submitted first.
   */
  submit(message: Record<string, unknown>, resolve: (response: WorkerResponse) => void): number {
    const id = this.nextId++;
    const job: QueuedJob = { message: { ...message, id }, resolve };
    if (message.type === 'labels') this.labelQueue.push(job);
    else this.rasterQueue.push(job);
    return id;
  }

  /** Start as many queued jobs as the concurrency budget allows (round-robin across classes). */
  flush(): void {
    this.pump();
  }

  abort(id: number): void {
    for (const queue of [this.rasterQueue, this.labelQueue]) {
      const queuedIndex = queue.findIndex((job) => job.message.id === id);
      if (queuedIndex >= 0) {
        queue.splice(queuedIndex, 1);
        return;
      }
    }
    if (this.inflight.delete(id)) {
      // aborts jump the queue: they only touch the AbortController map
      this.worker.postMessage({ type: 'abort', id });
      this.pump();
    }
  }

  get pending(): number {
    return this.rasterQueue.length + this.labelQueue.length + this.inflight.size;
  }

  destroy(): void {
    this.worker.onmessage = null;
    this.worker.terminate();
    this.rasterQueue = [];
    this.labelQueue = [];
    this.inflight.clear();
  }
}

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
  /** fade-in alpha 0..1; fallbacks stay at 1 */
  opacity: number;
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
  // when each raster tile first became drawable, so it can fade in (keyed by
  // tile key; pruned when the tile leaves the cache)
  private tileFades = new Map<TileKey, number>();
  // tiles drawn sharp last frame (key -> coord), to spot ones that just left
  private lastDrawn = new Map<TileKey, TileCoord>();
  // tiles that left the viewport and are fading out (key -> coord)
  private retiring = new Map<TileKey, TileCoord>();
  // true while at least one tile is still fading in or out
  private fadingActive = false;
  private box: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null;

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
    return {
      rasters: this.rasters.size,
      labels: this.labels.size,
      pending: this.io.pending
    };
  }

  /** true while any tile is still fading in; keeps the render loop awake */
  get animating(): boolean {
    return this.fadingActive;
  }

  /**
   * Cache capacity for a working set of `count` tiles: a spare-screen buffer over
   * the visible-plus-prefetch set, floored at the configured size. Driven by the
   * live cover() counts in update() (not a viewport/tileSize estimate) so it
   * stays correct even though label tiles use an independently clamped zoom.
   * Below labelMinZoom the label tiles are smaller on screen and far more
   * numerous than a viewport estimate would guess, which previously under-sized
   * the label cache and thrashed it (evict + refetch every frame while nothing
   * moved).
   */
  private capFor(count: number, floor: number): number {
    return Math.max(floor, Math.ceil(count * CACHE_BUFFER_FACTOR));
  }

  /**
   * Fade alpha (0..1) for a tile, ramping over config.fadeDuration from when the
   * tile was first stamped. `forward` picks which way the ramp runs:
   *   - forward === true:  opacity = progress      (0 -> 1, fade in)
   *   - forward === false: opacity = 1 - progress  (1 -> 0, fade out)
   * The first time a tile is drawn we stamp `now`; the stamp is cleared once the
   * tile leaves the cache (see update) so a refetched tile fades in again rather
   * than popping.
   */
  private fadeOpacity(key: TileKey, now: number, forward = true): number {
    if (this.config.fadeDuration <= 0) return forward ? 1 : 0;
    let start = this.tileFades.get(key);
    if (start === undefined) {
      start = now;
      this.tileFades.set(key, now);
    }
    const raw = (now - start) / this.config.fadeDuration;
    const progress = raw >= 1 ? 1 : raw <= 0 ? 0 : raw;
    return forward ? progress : 1 - progress;
  }

  /**
   * Called every frame. Cheap when nothing changed: cover() is a couple of
   * loops, and requests are deduped against the caches + in-flight maps.
   */
  update(camera: Camera, now: number): FrameTiles {
    // tiles stop at config.maxZoom; beyond that the deepest level is scaled up (overzoom)
    const zoom = tileZoom(camera, this.config.minZoom, this.config.maxZoom);
    const wantedTiles = cover(camera, {
      zoom,
      box: this.box,
      padPx: this.config.tileSize / 2
    });
    // size the raster cache to this frame's working set before requesting, so a
    // large viewport never evicts a still-visible tile and refetches it
    this.rasters.setMax(this.capFor(wantedTiles.length, this.config.rasterCacheSize));

    // raster requests (centre-first) + abort what left the viewport
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

    // draw list: wanted tiles (fading in), their fallbacks, and any tiles that
    // just left the view (fading out)
    const rasterDrawList: DrawTile[] = [];
    let missing = 0;
    let fading = false;
    const drawnSharp = new Map<TileKey, TileCoord>();
    for (const coord of wantedTiles) {
      const key = buildTileKey(coord.z, coord.x, coord.y);
      const dst = tileScreenRect(camera, coord);
      const entry = this.rasters.get(key);
      if (entry && entry !== MISSING) {
        // a tile that was fading out is wanted again: resume a fade-in from its
        // current alpha instead of popping back to full
        if (this.retiring.delete(key)) {
          const current = this.fadeOpacity(key, now, false);
          this.tileFades.set(key, now - current * this.config.fadeDuration);
        }
        const opacity = this.fadeOpacity(key, now, true);
        if (opacity < 1) {
          fading = true;
          // keep a blurry ancestor underneath so the sharp tile crossfades in
          // rather than popping over the freshly cleared background
          this.pushParent(coord, dst, rasterDrawList);
        }
        drawnSharp.set(key, coord);
        rasterDrawList.push({
          coord,
          bitmap: entry,
          src: null,
          dst,
          fallback: false,
          opacity
        });
        continue;
      }
      missing++;
      // note: a 404'd tile still gets a parent fallback — sparse pyramids are normal
      if (!this.pushParent(coord, dst, rasterDrawList) && entry !== MISSING) {
        this.pushChildren(camera, coord, rasterDrawList);
      }
    }

    // tiles drawn last frame but no longer wanted start fading out; seed the
    // stamp so the fade-out begins at the tile's current alpha
    for (const [key, coord] of this.lastDrawn) {
      if (drawnSharp.has(key) || this.retiring.has(key)) continue;
      // only fade out tiles at the current zoom: they leave to background at the
      // viewport edge with nothing overlapping. tiles orphaned by a zoom change
      // would sit over/under the incoming level's fades and flicker, so drop them.
      if (coord.z !== zoom) continue;
      const current = this.fadeOpacity(key, now, true);
      this.tileFades.set(key, now - (1 - current) * this.config.fadeDuration);
      this.retiring.set(key, coord);
    }
    // draw the fading-out tiles beneath the sharp ones until they reach zero
    for (const [key, coord] of this.retiring) {
      const entry = this.rasters.get(key);
      // drop if evicted or orphaned by a zoom change (see fade-out note above)
      if (!entry || entry === MISSING || coord.z !== zoom) {
        this.retiring.delete(key);
        this.tileFades.delete(key);
        continue;
      }
      const opacity = this.fadeOpacity(key, now, false);
      if (opacity <= 0) {
        this.retiring.delete(key);
        this.tileFades.delete(key);
        continue;
      }
      fading = true;
      rasterDrawList.push({
        coord,
        bitmap: entry,
        src: null,
        dst: tileScreenRect(camera, coord),
        fallback: true,
        opacity
      });
    }
    this.lastDrawn = drawnSharp;

    this.fadingActive = fading;
    // drop fade stamps for tiles no longer cached so a refetch fades in again
    for (const key of this.tileFades.keys()) {
      if (!this.rasters.has(key)) this.tileFades.delete(key);
    }
    // fallbacks first so sharp tiles paint on top
    rasterDrawList.sort((first, second) => Number(second.fallback) - Number(first.fallback));

    const labelTiles: PackedLabelTile[] = [];
    const labelZoom = Math.max(this.config.labelMinZoom, Math.min(this.config.labelMaxZoom, zoom));
    const labelCover = cover(camera, {
      zoom: labelZoom,
      box: this.box,
      padPx: LABEL_PREFETCH_PADDING
    });
    // label tiles use labelZoom, clamped independently of the raster zoom; size
    // their cache from the actual cover so it can't thrash below labelMinZoom
    this.labels.setMax(this.capFor(labelCover.length, this.config.labelCacheSize));
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

    // all raster + label jobs for this frame are queued; start them together
    // (round-robin) so labels stream in alongside rasters instead of waiting for
    // the whole raster backlog to drain
    this.io.flush();

    return {
      zoom,
      rasters: rasterDrawList,
      labels: labelTiles,
      pending: this.io.pending,
      missing
    };
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
        fallback: true,
        opacity: 1
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
        const child = {
          z: coord.z + 1,
          x: coord.x * 2 + offsetX,
          y: coord.y * 2 + offsetY
        };
        const entry = this.rasters.get(buildTileKey(child.z, child.x, child.y));
        if (!entry || entry === MISSING) continue;
        out.push({
          coord: child,
          bitmap: entry,
          src: null,
          dst: tileScreenRect(camera, child),
          fallback: true,
          opacity: 1
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
    const id = this.io.submit(
      {
        type: 'labels',
        key,
        url: getLabelUrl(coord),
        z: coord.z,
        x: coord.x,
        y: coord.y
      },
      (response) => {
        this.labelJobs.delete(key);
        if (response.type === 'labels') {
          this.labels.set(key, response.tile);
          this.onLoad();
        } else if (response.type === 'error' && !response.aborted) {
          this.labels.set(key, MISSING);
        }
      }
    );
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

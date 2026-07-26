import { MapConfig } from '.';
import { Camera, latToMercY, lngToMercX } from './camera';
import { tileKey, PackedLabelTile, TileCoord, TileKey, WorkerResponse } from './types';

/* ---------------------------------------------------------------------- LRU */

export class LRU<V> {
  private map = new Map<string, V>();
  constructor(
    private max: number,
    private dispose?: (value: V) => void
  ) {}

  get(key: string): V | undefined {
    const v = this.map.get(key);
    if (v !== undefined) {
      this.map.delete(key);
      this.map.set(key, v);
    }
    return v;
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
      const oldest = this.map.keys().next().value as string;
      const victim = this.map.get(oldest)!;
      this.map.delete(oldest);
      this.dispose?.(victim);
    }
  }

  get size(): number {
    return this.map.size;
  }

  clear(): void {
    if (this.dispose) for (const v of this.map.values()) this.dispose(v);
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
  const z = Math.round(camera.zoom);
  return Math.max(minZoom, Math.min(maxZoom, z));
}

/** tile keys covering the viewport, ordered by distance from the screen centre */
export function cover(camera: Camera, opts: CoverOptions): TileCoord[] {
  const z = opts.zoom;
  const n = 1 << z;
  const b = camera.visibleBounds(opts.padPx ?? 0);

  const minX = Math.max(0, Math.floor(b.minX * n));
  const maxX = Math.min(n - 1, Math.floor(b.maxX * n));
  const minY = Math.max(0, Math.floor(b.minY * n));
  const maxY = Math.min(n - 1, Math.floor(b.maxY * n));

  // data-box test in tile space (avoids requesting out-of-box tiles at all)
  let boxMinX = -Infinity;
  let boxMaxX = Infinity;
  let boxMinY = -Infinity;
  let boxMaxY = Infinity;
  if (opts.box) {
    boxMinX = Math.floor(opts.box.minX * n);
    boxMaxX = Math.ceil(opts.box.maxX * n) - 1;
    boxMinY = Math.floor(opts.box.minY * n);
    boxMaxY = Math.ceil(opts.box.maxY * n) - 1;
  }

  const cx = camera.x * n - 0.5;
  const cy = camera.y * n - 0.5;
  const out: TileCoord[] = [];
  for (let y = minY; y <= maxY; y++) {
    if (y < boxMinY || y > boxMaxY) continue;
    for (let x = minX; x <= maxX; x++) {
      if (x < boxMinX || x > boxMaxX) continue;
      out.push({ z, x, y });
    }
  }
  out.sort((a, b2) => (a.x - cx) ** 2 + (a.y - cy) ** 2 - ((b2.x - cx) ** 2 + (b2.y - cy) ** 2));
  return out;
}

/** screen rect of a tile under the camera's affine transform */
export function tileScreenRect(camera: Camera, coord: TileCoord): { left: number; top: number; right: number; bottom: number } {
  const n = 1 << coord.z;
  return {
    left: camera.projectX(coord.x / n),
    top: camera.projectY(coord.y / n),
    right: camera.projectX((coord.x + 1) / n),
    bottom: camera.projectY((coord.y + 1) / n)
  };
}

/* --------------------------------------------------------- worker client */

interface QueuedJob {
  msg: Record<string, unknown> & { id: number };
  resolve: (res: WorkerResponse) => void;
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
  private inflight = new Map<number, (r: WorkerResponse) => void>();
  private queue: QueuedJob[] = [];
  private nextId = 1;

  constructor(
    worker: Worker,
    private maxConcurrent: number
  ) {
    this.worker = worker;
    this.worker.onmessage = (e: MessageEvent) => this.onMessage(e.data as WorkerResponse);
  }

  private onMessage(res: WorkerResponse): void {
    const resolve = this.inflight.get(res.id);
    if (resolve) {
      this.inflight.delete(res.id);
      resolve(res);
    }
    // a late reply for an aborted job lands here too: no resolver, just refill
    this.pump();
  }

  private pump(): void {
    while (this.queue.length && this.inflight.size < this.maxConcurrent) {
      const job = this.queue.shift()!;
      this.inflight.set(job.msg.id, job.resolve);
      this.worker.postMessage(job.msg);
    }
  }

  /** enqueue a job; returns its id so it can be aborted */
  submit(msg: Record<string, unknown>, resolve: (res: WorkerResponse) => void): number {
    const id = this.nextId++;
    this.queue.push({ msg: { ...msg, id }, resolve });
    this.pump();
    return id;
  }

  abort(id: number): void {
    const queuedAt = this.queue.findIndex((j) => j.msg.id === id);
    if (queuedAt >= 0) {
      this.queue.splice(queuedAt, 1);
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

const MAX_PARENT_LEVELS = 5;

export class TileManager {
  private io: WorkerClient;
  private rasters: LRU<RasterEntry>;
  private labels: LRU<LabelEntry>;
  private rasterJobs = new Map<TileKey, number>();
  private labelJobs = new Map<TileKey, number>();
  private box: { minX: number; minY: number; maxX: number; maxY: number } | null;

  constructor(
    private cfg: MapConfig,
    private onLoad: () => void,
    worker: Worker
  ) {
    this.io = new WorkerClient(worker, cfg.concurrency);
    this.rasters = new LRU<RasterEntry>(cfg.rasterCacheSize, (v) => {
      if (v !== MISSING) v.close();
    });
    this.labels = new LRU<LabelEntry>(cfg.labelCacheSize);
    this.box = cfg.bounds
      ? {
          minX: lngToMercX(cfg.bounds[0]),
          minY: latToMercY(cfg.bounds[3]),
          maxX: lngToMercX(cfg.bounds[2]),
          maxY: latToMercY(cfg.bounds[1])
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
    // tiles stop at cfg.maxZoom; beyond that the deepest level is scaled up (overzoom)
    const z = tileZoom(camera, this.cfg.minZoom, this.cfg.maxZoom);
    const wanted = cover(camera, { zoom: z, box: this.box, padPx: this.cfg.tileSize / 2 });

    /* ---- raster requests (centre-first) + abort what left the viewport ---- */
    const wantedKeys = new Set<TileKey>();
    for (const c of wanted) wantedKeys.add(tileKey(c.z, c.x, c.y));
    for (const [key, id] of this.rasterJobs) {
      if (!wantedKeys.has(key)) {
        this.io.abort(id);
        this.rasterJobs.delete(key);
      }
    }
    for (const c of wanted) {
      const key = tileKey(c.z, c.x, c.y);
      if (this.rasters.has(key) || this.rasterJobs.has(key)) continue;
      this.requestRaster(key, c);
    }

    /* -------------------------------- draw list with parent/child fallback */
    const rasters: DrawTile[] = [];
    let missing = 0;
    for (const coord of wanted) {
      const key = tileKey(coord.z, coord.x, coord.y);
      const dst = tileScreenRect(camera, coord);
      const entry = this.rasters.get(key);
      if (entry && entry !== MISSING) {
        rasters.push({ coord, bitmap: entry, src: null, dst, fallback: false });
        continue;
      }
      missing++;
      // note: a 404'd tile still gets a parent fallback — sparse pyramids are normal
      if (!this.pushParent(coord, dst, rasters) && entry !== MISSING) {
        this.pushChildren(camera, coord, rasters);
      }
    }
    // fallbacks first so sharp tiles paint on top
    rasters.sort((a, b) => Number(b.fallback) - Number(a.fallback));

    /* ------------------------------------------------------- label tiles */
    const labels: PackedLabelTile[] = [];
    const lz = Math.max(this.cfg.labelMinZoom, Math.min(this.cfg.labelMaxZoom, z));
    const labelCover = cover(camera, { zoom: lz, box: this.box, padPx: 128 });
    const labelWanted = new Set<TileKey>();
    for (const c of labelCover) labelWanted.add(tileKey(c.z, c.x, c.y));
    for (const [key, id] of this.labelJobs) {
      if (!labelWanted.has(key)) {
        this.io.abort(id);
        this.labelJobs.delete(key);
      }
    }
    for (const c of labelCover) {
      const key = tileKey(c.z, c.x, c.y);
      const entry = this.labels.get(key);
      if (entry === undefined) {
        if (!this.labelJobs.has(key)) this.requestLabels(key, c);
        continue;
      }
      if (entry !== MISSING) labels.push(entry);
    }

    return { zoom: z, rasters, labels, pending: this.io.pending, missing };
  }

  /** walk up the pyramid for an already-decoded ancestor and crop it */
  private pushParent(coord: TileCoord, dst: DrawTile['dst'], out: DrawTile[]): boolean {
    for (let up = 1; up <= MAX_PARENT_LEVELS && coord.z - up >= this.cfg.minZoom; up++) {
      const pz = coord.z - up;
      const step = 1 << up;
      const px = coord.x >> up;
      const py = coord.y >> up;
      const entry = this.rasters.get(tileKey(pz, px, py));
      if (!entry || entry === MISSING) continue;
      const sw = entry.width / step;
      const sh = entry.height / step;
      out.push({
        coord,
        bitmap: entry,
        src: { x: (coord.x - px * step) * sw, y: (coord.y - py * step) * sh, w: sw, h: sh },
        dst,
        fallback: true
      });
      return true;
    }
    return false;
  }

  /** zooming out: reuse the four children we already have */
  private pushChildren(camera: Camera, coord: TileCoord, out: DrawTile[]): void {
    if (coord.z + 1 > this.cfg.maxZoom) return;
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const child = { z: coord.z + 1, x: coord.x * 2 + dx, y: coord.y * 2 + dy };
        const entry = this.rasters.get(tileKey(child.z, child.x, child.y));
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
    const url = `https://erichsia7.github.io/bus-map/tiles/${coord.z}/${coord.x}/${coord.y}.webp`;
    const id = this.io.submit({ type: 'raster', key, url }, (res) => {
      this.rasterJobs.delete(key);
      if (res.type === 'raster') {
        this.rasters.set(key, res.bitmap);
        this.onLoad();
      } else if (res.type === 'error' && !res.aborted) {
        if (res.status === 404 || res.status === 403 || res.status === 410) {
          this.rasters.set(key, MISSING);
        }
      }
    });
    this.rasterJobs.set(key, id);
  }

  private requestLabels(key: TileKey, coord: TileCoord): void {
    const url = `https://erichsia7.github.io/bus-map/labels/${coord.z}/${coord.x}/${coord.y}.geojson.gz`;
    const id = this.io.submit({ type: 'labels', key, url, z: coord.z, x: coord.x, y: coord.y }, (res) => {
      this.labelJobs.delete(key);
      if (res.type === 'labels') {
        this.labels.set(key, res.tile);
        this.onLoad();
      } else if (res.type === 'error' && !res.aborted) {
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

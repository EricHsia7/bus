import { LabelGlyphPlan } from './label-plan';
import { RoutePlan } from './route-plan';

/**
 * - 0: pending
 * - 1: loading
 * - 2: loaded
 * - 3: missing
 * - 4: evicted
 */
export type MapLoaderTileState = 0 | 1 | 2 | 3 | 4;

export interface MapLoaderTile {
  x: number;
  y: number;
  z: number;
  state: MapLoaderTileState;
}

export interface MapLoaderResponse extends MapLoaderTile {
  bitmap: ImageBitmap | null;
  label: LabelGlyphPlan;
  route: RoutePlan;
}

export interface MapLoaderWorkerMessageData {
  type: 'data';
  response: MapLoaderResponse;
}

export interface MapLoaderWorkerMessageError {
  type: 'error';
  tile: MapLoaderTile;
  error: Error['message'];
}

export type MapLoaderWorkerMessage = MapLoaderWorkerMessageData | MapLoaderWorkerMessageError;

export interface MapLoaderCacheOptions {
  /**
   * Soft ceiling of decoded tile bytes retained by the cache. Tiles are measured as
   * `width * height * 4`, which is what an uploaded RGBA texture actually costs.
   * Defaults to 96 MB.
   */
  maxCacheBytes?: number;
  /** The cache is never trimmed below this many tiles, regardless of the byte budget. */
  minCachedTiles?: number;
  /** Nor below this multiple of the currently protected (on screen) tile count. */
  headroomFactor?: number;
  /** Delay before a deferred eviction pass runs, in milliseconds. Defaults to 200. */
  evictionDelay?: number;
  /**
   * Return `true` to postpone eviction. The renderer passes a predicate that is true
   * while a frame is pending, so trimming never competes with drawing for the frame.
   */
  shouldDeferEviction?: () => boolean;
  /** Notified after a tile is dropped, so callers can discard derived per-tile state. */
  onEvict?: (key: string, tile: MapLoaderTile) => void;
}

/** Bytes assumed for a bitmap whose dimensions are unavailable */
const fallbackTileBytes = 256 * 256 * 4;

export class MapLoader {
  tiles: Map<string, MapLoaderTile>;
  /**
   * Decoded tiles in least-recently-used order. A Map preserves insertion order, so
   * reinserting on every `get` keeps the coldest entry at the front of the iteration.
   *
   * The loader is the sole owner of these bitmaps: nothing else may call `close()` on
   * them, and in exchange eviction can free the GPU texture immediately instead of
   * waiting for a garbage collection that only sees the handle, not the texture.
   */
  cache: Map<string, MapLoaderResponse>;
  queue: Array<string>;
  processing: number;
  worker: Worker;
  batchSize: number;
  callback: (response: MapLoaderResponse) => void;

  maxCacheBytes: number;
  minCachedTiles: number;
  headroomFactor: number;
  evictionDelay: number;

  private shouldDeferEviction?: () => boolean;
  private onEvict?: (key: string, tile: MapLoaderTile) => void;
  /** Byte cost per cached tile, kept alongside the cache so the running total stays exact */
  private tileBytes: Map<string, number>;
  private cacheBytes: number;
  /** Tiles the caller is currently drawing. These are never evicted. */
  private protectedKeys: Set<string>;
  private evictionTimeoutId: ReturnType<typeof setTimeout> | null;

  constructor(batchSize: number, callback: MapLoader['callback'], options: MapLoaderCacheOptions = {}) {
    this.tiles = new Map();
    this.cache = new Map();
    this.queue = [];
    this.processing = 0;
    this.worker = new Worker(new URL('./worker.ts', import.meta.url));
    this.batchSize = batchSize;
    this.callback = callback;

    this.maxCacheBytes = options.maxCacheBytes ?? 96 * 1024 * 1024;
    this.minCachedTiles = options.minCachedTiles ?? 64;
    this.headroomFactor = options.headroomFactor ?? 3;
    this.evictionDelay = options.evictionDelay ?? 200;
    this.shouldDeferEviction = options.shouldDeferEviction;
    this.onEvict = options.onEvict;

    this.tileBytes = new Map();
    this.cacheBytes = 0;
    this.protectedKeys = new Set();
    this.evictionTimeoutId = null;

    this.worker.onmessage = this.handleWorkerMessage.bind(this);
  }

  getTileKey(x: number, y: number, z: number): string {
    return `${x}.${y}.${z}`;
  }

  enqueue(x: number, y: number, z: number): void {
    const key = this.getTileKey(x, y, z);

    const existing = this.tiles.get(key);
    if (existing) {
      // A tile that was evicted can legitimately be requested again; every other
      // state means the tile is already pending, loading, loaded or known missing.
      if (existing.state !== 4) return;
      existing.state = 0;
      this.queue.push(key);
      return;
    }

    this.tiles.set(key, {
      x,
      y,
      z,
      state: 0
    });
    this.queue.push(key);
  }

  dequeue(x: number, y: number, z: number): void {
    const key = this.getTileKey(x, y, z);
    if (!this.tiles.has(key)) return;
    const index = this.queue.indexOf(key);
    if (index < 0) return;
    const tile = this.tiles.get(key);
    if (tile?.state !== 0) return;
    this.queue.splice(index, 1);
    this.tiles.delete(key);
  }

  consume(): void {
    const amount = this.batchSize - this.processing;
    if (amount <= 0) return;
    const batch = this.queue.splice(-amount);
    const list: Array<MapLoaderTile> = [];
    if (batch.length === 0) return;
    for (let i = 0, l = batch.length; i < l; i++) {
      const tile = this.tiles.get(batch[i]);
      if (tile) {
        tile.state = 1;
        list.push(tile);
        this.processing++;
      }
    }
    this.worker.postMessage(list);
  }

  handleWorkerMessage(event: MessageEvent): void {
    this.processing--;
    const message = event.data as MapLoaderWorkerMessage;
    switch (message.type) {
      case 'data': {
        const { x, y, z } = message.response;
        const key = this.getTileKey(x, y, z);

        const existing = this.cache.get(key);
        let response = message.response;
        if (existing && existing !== response) {
          // The tile was decoded twice (a re-request raced an in-flight load). The cached bitmap stays authoritative and the duplicate is closed rather than leaked.
          if (response.bitmap) {
            response.bitmap.close?.();
            response.bitmap = null;
          }
          if (response.label.sheet) {
            response.label.sheet.close?.();
            response.label.sheet = null;
          }
          response = existing;
          this.touch(key);
        } else {
          this.store(key, response);
        }

        const tile = this.tiles.get(key);
        if (tile) tile.state = 2;
        this.callback(response);
        this.scheduleEviction();
        break;
      }
      case 'error': {
        const { x, y, z } = message.tile;
        const key = this.getTileKey(x, y, z);
        const tile = this.tiles.get(key);
        if (tile) tile.state = 3;
        break;
      }
      default:
        break;
    }
    if (this.queue.length > 0) this.consume();
  }

  /** Reads a tile and marks it as most recently used. */
  get(x: number, y: number, z: number): MapLoaderResponse | undefined {
    const key = this.getTileKey(x, y, z);
    const response = this.cache.get(key);
    if (!response) return undefined;
    this.touch(key);
    return response;
  }

  /** Reads a tile without disturbing its position in the LRU order. */
  peek(x: number, y: number, z: number): MapLoaderResponse | undefined {
    return this.cache.get(this.getTileKey(x, y, z));
  }

  /**
   * Declares the tiles that are currently on screen.
   * Protected tiles are never evicted, and they also raise the floor of the cache budget so the surrounding tiles survive a pan back and forth.
   */
  protect(keys: Iterable<string>): void {
    // Copied rather than aliased: the renderer rebuilds its set every frame, and an
    // eviction pass must never observe it half-populated.
    this.protectedKeys = new Set(keys);
    this.scheduleEviction();
  }

  protectTiles(tiles: Iterable<{ x: number; y: number; z: number }>): void {
    const keys = new Set<string>();
    for (const tile of tiles) keys.add(this.getTileKey(tile.x, tile.y, tile.z));
    this.protect(keys);
  }

  /** Drops a single tile immediately. Returns false when the tile is protected or absent. */
  release(x: number, y: number, z: number): boolean {
    return this.evictKey(this.getTileKey(x, y, z));
  }

  /** Bytes currently held by decoded tiles. */
  get bytes(): number {
    return this.cacheBytes;
  }

  /**
   * Trims the cache down to the byte budget, coldest tile first. Protected tiles and
   * the minimum tile floor are always respected, so this can return without reaching
   * the budget when everything left is still in use.
   */
  trim(): number {
    const tileFloor = Math.max(this.minCachedTiles, this.protectedKeys.size * this.headroomFactor);
    let evicted = 0;

    // Iterating the map yields least-recently-used first.
    for (const key of Array.from(this.cache.keys())) {
      if (this.cacheBytes <= this.maxCacheBytes) break;
      if (this.cache.size <= tileFloor) break;
      if (this.protectedKeys.has(key)) continue;
      if (this.evictKey(key)) evicted++;
    }

    return evicted;
  }

  /** Drops every unprotected tile, for example when the map is hidden. */
  clear(includeProtected: boolean = false): void {
    for (const key of Array.from(this.cache.keys())) {
      if (!includeProtected && this.protectedKeys.has(key)) continue;
      this.evictKey(key, includeProtected);
    }
  }

  dispose(): void {
    if (this.evictionTimeoutId !== null) {
      clearTimeout(this.evictionTimeoutId);
      this.evictionTimeoutId = null;
    }
    this.clear(true);
    this.queue.length = 0;
    this.tiles.clear();
    this.worker.terminate();
  }

  private touch(key: string): void {
    const response = this.cache.get(key);
    if (!response) return;
    this.cache.delete(key);
    this.cache.set(key, response);
  }

  private store(key: string, response: MapLoaderResponse): void {
    const previous = this.tileBytes.get(key);
    if (previous !== undefined) this.cacheBytes -= previous;

    const bitmap = response.bitmap;
    const bitmapBytes = bitmap?.width && bitmap?.height ? bitmap.width * bitmap.height * 4 : fallbackTileBytes;
    const sheet = response.label.sheet;
    const sheetBytes = sheet?.width && sheet?.height ? sheet.width * sheet.height * 4 : fallbackTileBytes;
    const totalBytes = bitmapBytes + sheetBytes;

    this.cache.delete(key);
    this.cache.set(key, response);
    this.tileBytes.set(key, totalBytes);
    this.cacheBytes += totalBytes;
  }

  private evictKey(key: string, force: boolean = false): boolean {
    if (!force && this.protectedKeys.has(key)) return false;

    const response = this.cache.get(key);
    if (!response) return false;

    this.cache.delete(key);
    this.cacheBytes -= this.tileBytes.get(key) ?? 0;
    this.tileBytes.delete(key);
    if (this.cacheBytes < 0) this.cacheBytes = 0;

    // Owning the bitmap means the texture can be released now rather than whenever a GC happens to notice a handle that looks cheap on the JS heap.
    if (response.bitmap) {
      response.bitmap.close?.();
      response.bitmap = null;
    }
    if (response.label.sheet) {
      response.label.sheet.close?.();
      response.label.sheet = null;
    }

    const tile = this.tiles.get(key);
    if (tile) {
      // Marked evicted rather than deleted, so `enqueue` can tell a re-request apart from a tile that was never seen and can refetch it.
      tile.state = 4;
      this.onEvict?.(key, tile);
    } else {
      this.onEvict?.(key, response);
    }

    return true;
  }

  /**
   * Eviction is always deferred: freeing memory is never worth a dropped frame, so the
   * pass waits for the caller to report that it is idle.
   */
  private scheduleEviction(): void {
    if (this.evictionTimeoutId !== null) return;
    this.evictionTimeoutId = setTimeout(this.runEviction, this.evictionDelay);
  }

  private runEviction = (): void => {
    this.evictionTimeoutId = null;
    if (this.shouldDeferEviction?.()) {
      this.scheduleEviction();
      return;
    }
    this.trim();
  };
}

const now = new Date();
export const MapDataVersion = `${now.getFullYear() * 100 + (now.getMonth() + 1)}`; // Monthly update
export const MapRasterVersion = `${MapDataVersion}-8`;
export const MapLabelsVersion = `${MapDataVersion}-7`;
export const MapRoutesVersion = `${MapDataVersion}-5`;

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

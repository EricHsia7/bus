import { LabelGlyphPlan } from './label-plan';
import { RoutePlan } from './route-plan';
import { VectorPlan } from './vector-plan';

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
  vector: VectorPlan;
  label: LabelGlyphPlan;
  route: RoutePlan;
}

/**
 * A rasterized tile, plus what it was rasterized from. Both halves of the provenance
 * matter: `sourceZ` says whose geometry is on screen (a stand-in ancestor while the tile
 * itself is still loading), and `frameIndex` / `deltaZoom` say which point of the shipped
 * `[zoom, zoom + 1]` scale interval it was styled for.
 */
export interface MapLoaderFrame {
  bitmap: ImageBitmap;
  /** Zoom of the plan the frame was rasterized from. Lower than the frame's own z while a coarser tile stands in for one that has not arrived yet. */
  sourceZ: number;
  /** Index into the source plan's `frameDeltaZooms`. */
  frameIndex: number;
  /** Clamped zoom offset the scale-dependent styling was sampled at. */
  deltaZoom: number;
  width: number;
  height: number;
  bytes: number;
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
   * Soft ceiling of decoded tile bytes retained by the cache.
   */
  maxCacheBytes?: number;
  /** The cache is never trimmed below this many tiles, regardless of the byte budget. */
  minCachedTiles?: number;
  /** Nor below this multiple of the currently protected (on screen) tile count. */
  headroomFactor?: number;
  /** Delay before a deferred eviction pass runs, in milliseconds. Defaults to 200. */
  evictionDelay?: number;
  /**
   * Soft ceiling of rasterized frame bytes retained by the frame buffer. Frames are
   * pure output: they can always be produced again from a cached plan, so this budget is
   * separate from (and trimmed more eagerly than) the decoded-tile budget.
   */
  maxFrameBufferBytes?: number;
  /** The frame buffer is never trimmed below this many frames, regardless of the byte budget. */
  minBufferedFrames?: number;
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
  /**
   * Rasterized frames in least-recently-used order, keyed by the tile box they are drawn
   * as rather than by the plan they came from. A stand-in frame therefore sits under the
   * key of the tile that is still loading, and is replaced in place once that tile
   * arrives and can be rasterized from its own geometry.
   *
   * As with the decoded tiles, the loader is the sole owner of these bitmaps: only
   * `evictFrame` / `trimFrameBuffer` may close them.
   */
  frameBuffer: Map<string, MapLoaderFrame>;
  frameBufferBytes: number;
  queue: Array<string>;
  processing: number;
  worker: Worker;
  batchSize: number;
  callback: (response: MapLoaderResponse) => void;

  maxCacheBytes: number;
  minCachedTiles: number;
  headroomFactor: number;
  evictionDelay: number;
  maxFrameBufferBytes: number;
  minBufferedFrames: number;

  private shouldDeferEviction?: () => boolean;
  private onEvict?: (key: string, tile: MapLoaderTile) => void;
  /** Byte cost per cached tile, kept alongside the cache so the running total stays exact */
  private tileBytes: Map<string, number>;
  private cacheBytes: number;
  /** Tiles the caller is currently drawing. These are never evicted. */
  private protectedKeys: Set<string>;
  /** Frames painted in the most recent frame. These are never trimmed. */
  private protectedFrameKeys: Set<string>;
  private evictionTimeoutId: ReturnType<typeof setTimeout> | null;

  constructor(batchSize: number, callback: MapLoader['callback'], options: MapLoaderCacheOptions = {}) {
    this.tiles = new Map();
    this.cache = new Map();
    this.frameBuffer = new Map();
    this.frameBufferBytes = 0;
    this.queue = [];
    this.processing = 0;
    this.worker = new Worker(new URL('./worker.ts', import.meta.url));
    this.batchSize = batchSize;
    this.callback = callback;

    this.maxCacheBytes = options.maxCacheBytes ?? 96 * 1024 * 1024;
    this.minCachedTiles = options.minCachedTiles ?? 16;
    this.headroomFactor = options.headroomFactor ?? 3;
    this.evictionDelay = options.evictionDelay ?? 200;
    this.maxFrameBufferBytes = options.maxFrameBufferBytes ?? 64 * 1024 * 1024;
    this.minBufferedFrames = options.minBufferedFrames ?? 16;
    this.shouldDeferEviction = options.shouldDeferEviction;
    this.onEvict = options.onEvict;

    this.tileBytes = new Map();
    this.cacheBytes = 0;
    this.protectedKeys = new Set();
    this.protectedFrameKeys = new Set();
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
    // Copied rather than aliased: the renderer rebuilds its set every frame, and an eviction pass must never observe it half-populated.
    this.protectedKeys = new Set(keys);
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
    this.clearFrameBuffer(includeProtected);
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

    const totalBytes = response.vector.size + response.label.size;

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
    if (response.label.sheet) {
      response.label.sheet.close?.();
      response.label.sheet = null;
    }

    // The frame was rasterized from this plan, so once the plan is gone the frame can no
    // longer be reproduced. It is dropped with the plan unless it is still on screen, in
    // which case it survives as its own stand-in until it leaves the viewport.
    this.dropFrame(key);

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

  public runEviction = (): void => {
    this.evictionTimeoutId = null;
    if (this.shouldDeferEviction?.()) {
      this.scheduleEviction();
      return;
    }
    this.trim();
    this.trimFrameBuffer();
  };

  /**
   * Stores the frame drawn for a tile box, replacing whatever was there before.
   *
   * Replacing is always allowed, protected or not: a new frame for a protected key is a
   * refresh of the imagery that is on screen, not an eviction of it.
   */
  public pushFrame(x: number, y: number, z: number, bitmap: ImageBitmap, source: { sourceZ: number; frameIndex: number; deltaZoom: number }): MapLoaderFrame {
    const key = this.getTileKey(x, y, z);
    this.dropFrame(key, true);

    const frame: MapLoaderFrame = {
      bitmap,
      sourceZ: source.sourceZ,
      frameIndex: source.frameIndex,
      deltaZoom: source.deltaZoom,
      width: bitmap.width,
      height: bitmap.height,
      bytes: bitmap.width * bitmap.height * 4
    };

    this.frameBuffer.set(key, frame);
    this.frameBufferBytes += frame.bytes;
    this.scheduleEviction();

    return frame;
  }

  /** Reads a frame and marks it as most recently used. */
  public getFrame(x: number, y: number, z: number): MapLoaderFrame | null {
    const key = this.getTileKey(x, y, z);
    const frame = this.frameBuffer.get(key);
    if (!frame) return null;
    // Reinserting keeps the coldest frame at the front of the iteration order, so the
    // trim pass can walk the buffer least-recently-drawn first.
    this.frameBuffer.delete(key);
    this.frameBuffer.set(key, frame);
    return frame;
  }

  /**
   * Reads a frame without disturbing the LRU order. Used when deciding whether a frame
   * still matches the viewport, which must not count as drawing it.
   */
  public peekFrame(x: number, y: number, z: number): MapLoaderFrame | null {
    return this.frameBuffer.get(this.getTileKey(x, y, z)) ?? null;
  }

  /** Drops a single frame immediately. Returns false when the frame is protected or absent. */
  public evictFrame(x: number, y: number, z: number, force: boolean = false): boolean {
    return this.dropFrame(this.getTileKey(x, y, z), force);
  }

  /**
   * Declares the frames that were painted in the last pass. Anything not in this set is a
   * candidate for trimming, which is what lets the buffer keep a ring of off-screen
   * frames for a pan back without growing without bound.
   */
  public protectFrames(keys: Iterable<string>): void {
    // Copied rather than aliased, for the same reason as `protect`.
    this.protectedFrameKeys = new Set(keys);
  }

  /** Bytes currently held by rasterized frames. */
  get frameBytes(): number {
    return this.frameBufferBytes;
  }

  /**
   * Trims the frame buffer down to its byte budget, least-recently-drawn frame first.
   * Protected frames and the minimum frame floor are always respected, so this can
   * return over budget when everything left is still on screen.
   */
  public trimFrameBuffer(): number {
    const frameFloor = Math.max(this.minBufferedFrames, this.protectedFrameKeys.size * this.headroomFactor);
    let evicted = 0;

    for (const key of Array.from(this.frameBuffer.keys())) {
      if (this.frameBufferBytes <= this.maxFrameBufferBytes) break;
      if (this.frameBuffer.size <= frameFloor) break;
      if (this.protectedFrameKeys.has(key)) continue;
      if (this.dropFrame(key)) evicted++;
    }

    return evicted;
  }

  /** Drops every unprotected frame, for example when the map is hidden. */
  public clearFrameBuffer(includeProtected: boolean = false): void {
    for (const key of Array.from(this.frameBuffer.keys())) {
      this.dropFrame(key, includeProtected);
    }
  }

  private dropFrame(key: string, force: boolean = false): boolean {
    const frame = this.frameBuffer.get(key);
    if (!frame) return false;
    if (!force && this.protectedFrameKeys.has(key)) return false;

    this.frameBuffer.delete(key);
    this.frameBufferBytes -= frame.bytes;
    if (this.frameBufferBytes < 0) this.frameBufferBytes = 0;

    // Owning the bitmap means the texture is released here rather than whenever a GC
    // happens to notice a handle that looks cheap on the JS heap.
    frame.bitmap.close();

    return true;
  }
}

const now = new Date();
export const MapDataVersion = `${now.getFullYear() * 100 + (now.getMonth() + 1)}`; // Monthly update
export const MapVectorVersion = `${MapDataVersion}-4`;
export const MapRasterVersion = `${MapDataVersion}-9`;
export const MapLabelsVersion = `${MapDataVersion}-9`;
export const MapRoutesVersion = `${MapDataVersion}-6`;

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

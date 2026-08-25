import { VectorTile, vectorTileByteLength } from './vector';
import { VectorFrame, vectorFrameByteLength } from './vector-plan';

/**
 * Two-tier tile cache.
 *
 * The flattened wire format exists precisely so these two tiers can be sized
 * independently:
 *
 *   tier 1  raw typed arrays   ~tens of KB  cheap, retained, long TTL
 *   tier 2  rendered bitmaps    4 MB each   expensive, evicted first
 *
 * Evicting a frame therefore costs a re-rasterization, not a refetch: the
 * geometry is still sitting in tier 1 as Int16Array/Int32Array, so the worker
 * can rebuild any frame of any retained tile with zero network and zero JSON.
 * That asymmetry is the whole point — be aggressive about bitmaps, patient about
 * raw data.
 */

export type TileKey = string;

export function tileKey(zoom: number, x: number, y: number): TileKey {
  return `${zoom}/${x}/${y}`;
}

interface RawEntry {
  key: TileKey;
  tile: VectorTile;
  bytes: number;
}

interface FrameEntry {
  key: TileKey;
  frameIndex: number;
  frame: VectorFrame;
  bytes: number;
}

export interface VectorCacheOptions {
  /** Byte budget for retained raw tiles. Generous: this data is cheap. */
  rawByteBudget?: number;
  /** Byte budget for rendered bitmaps. This is the one that matters. */
  frameByteBudget?: number;
}

export interface VectorCacheStats {
  rawCount: number;
  rawBytes: number;
  frameCount: number;
  frameBytes: number;
}

function frameKey(key: TileKey, frameIndex: number): string {
  return `${key}#${frameIndex}`;
}

/**
 * LRU by insertion order of a Map: re-inserting on access moves an entry to the
 * end, so the least recently used entry is always the first one iterated.
 */
export class VectorTileCache {
  private readonly raw = new Map<TileKey, RawEntry>();
  private readonly frames = new Map<string, FrameEntry>();
  private readonly rawByteBudget: number;
  private readonly frameByteBudget: number;
  private rawBytes = 0;
  private frameBytes = 0;
  /** Tiles that must survive eviction because they are on screen right now. */
  private pinned = new Set<TileKey>();

  constructor(options: VectorCacheOptions = {}) {
    this.rawByteBudget = options.rawByteBudget ?? 64 * 1024 * 1024;
    // ~24 frames of 1024x1024. Bitmaps dominate memory, so keep this modest.
    this.frameByteBudget = options.frameByteBudget ?? 96 * 1024 * 1024;
  }

  /** Mark the tiles currently needed for compositing; they are never evicted. */
  setPinned(keys: Iterable<TileKey>): void {
    this.pinned = new Set(keys);
  }

  // -- tier 1: raw typed arrays -------------------------------------------

  putTile(key: TileKey, tile: VectorTile): void {
    const existing = this.raw.get(key);
    if (existing) {
      this.rawBytes -= existing.bytes;
      this.raw.delete(key);
    }
    const bytes = vectorTileByteLength(tile);
    this.raw.set(key, { key, tile, bytes });
    this.rawBytes += bytes;
    this.evictRaw();
  }

  getTile(key: TileKey): VectorTile | undefined {
    const entry = this.raw.get(key);
    if (entry === undefined) return undefined;
    this.raw.delete(key); // touch
    this.raw.set(key, entry);
    return entry.tile;
  }

  hasTile(key: TileKey): boolean {
    return this.raw.has(key);
  }

  // -- tier 2: rendered bitmaps -------------------------------------------

  putFrame(key: TileKey, frame: VectorFrame): void {
    const composite = frameKey(key, frame.frameIndex);
    const existing = this.frames.get(composite);
    if (existing) {
      this.frameBytes -= existing.bytes;
      this.frames.delete(composite);
      closeFrame(existing.frame);
    }
    const bytes = vectorFrameByteLength(frame);
    this.frames.set(composite, { key, frameIndex: frame.frameIndex, frame, bytes });
    this.frameBytes += bytes;
    this.evictFrames();
  }

  getFrame(key: TileKey, frameIndex: number): VectorFrame | undefined {
    const composite = frameKey(key, frameIndex);
    const entry = this.frames.get(composite);
    if (entry === undefined) return undefined;
    this.frames.delete(composite); // touch
    this.frames.set(composite, entry);
    return entry.frame;
  }

  /**
   * Best frame available for a tile right now, preferring the requested index.
   *
   * Falls back to the nearest rendered frame so the compositor can always draw
   * something: a casing 2% off the ideal width for one animation frame is
   * strictly better than a hole in the map.
   */
  getNearestFrame(key: TileKey, frameIndex: number): VectorFrame | undefined {
    const exact = this.getFrame(key, frameIndex);
    if (exact !== undefined) return exact;
    let best: VectorFrame | undefined;
    let bestDistance = Infinity;
    for (const entry of this.frames.values()) {
      if (entry.key !== key) continue;
      const distance = Math.abs(entry.frameIndex - frameIndex);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = entry.frame;
      }
    }
    return best;
  }

  /**
   * Drop every bitmap for a tile but keep its geometry — the memory-pressure
   * lever. After this the tile still costs ~tens of KB and any frame can be
   * rebuilt locally.
   */
  releaseFrames(key: TileKey): void {
    for (const [composite, entry] of [...this.frames]) {
      if (entry.key !== key) continue;
      this.frames.delete(composite);
      this.frameBytes -= entry.bytes;
      closeFrame(entry.frame);
    }
  }

  /** Free bitmaps immediately, e.g. on a memory-pressure event or tab hide. */
  releaseAllFrames(): void {
    for (const entry of this.frames.values()) closeFrame(entry.frame);
    this.frames.clear();
    this.frameBytes = 0;
  }

  delete(key: TileKey): void {
    this.releaseFrames(key);
    const entry = this.raw.get(key);
    if (entry === undefined) return;
    this.raw.delete(key);
    this.rawBytes -= entry.bytes;
  }

  stats(): VectorCacheStats {
    return { rawCount: this.raw.size, rawBytes: this.rawBytes, frameCount: this.frames.size, frameBytes: this.frameBytes };
  }

  private evictFrames(): void {
    if (this.frameBytes <= this.frameByteBudget) return;
    for (const [composite, entry] of [...this.frames]) {
      if (this.frameBytes <= this.frameByteBudget) return;
      if (this.pinned.has(entry.key)) continue;
      this.frames.delete(composite);
      this.frameBytes -= entry.bytes;
      closeFrame(entry.frame);
    }
  }

  private evictRaw(): void {
    if (this.rawBytes <= this.rawByteBudget) return;
    for (const [key, entry] of [...this.raw]) {
      if (this.rawBytes <= this.rawByteBudget) return;
      if (this.pinned.has(key)) continue;
      this.releaseFrames(key);
      this.raw.delete(key);
      this.rawBytes -= entry.bytes;
    }
  }
}

function closeFrame(frame: VectorFrame): void {
  for (const bitmap of frame.bitmaps) bitmap.close();
}

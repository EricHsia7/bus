import { clamp } from '../../tools/math';
import { LineCap, LineDash, LineJoin } from './style';

/**
 * Descriptor kind codes, as emitted in `descriptorTypes`.
 */
export const VECTOR_TILE_POLYGON = 0;
export const VECTOR_TILE_LINE = 1;

export type VectorTileDescriptorType = typeof VECTOR_TILE_POLYGON | typeof VECTOR_TILE_LINE;

export type VectorTilePoint = [x: number, y: number];

export type VectorTileRing = Array<VectorTilePoint>;

export type VectorTileRings = Array<VectorTileRing>;

export type VectorTileLine = Array<VectorTilePoint>;

export type VectorTileLines = Array<VectorTileLine>;

/**
 * A shipped scale interval `[s0, s1]` covering `[z, z + 1]` — the value at this
 * tile's zoom and at the next one. Same convention as `text-scale` and
 * `marker-scale` on labels: the reference size is measured once and the client
 * interpolates the multiplier per frame.
 */
export type VectorTileScale = [s0: number, s1: number];

export interface VectorTileStyle {
  'fill'?: string;
  'fill-opacity'?: number;
  'stroke'?: string;
  'stroke-width'?: number;
  /**
   * Multiplier interval for `stroke-width` across `[zoom, zoom + 1]`.
   * Compiled from `--line-scale` (SCALE_TARGETS: `line-scale` -> `line-width`).
   */
  'stroke-width-scale'?: VectorTileScale;
  'stroke-opacity'?: number;
  'stroke-linejoin'?: LineJoin;
  'stroke-linecap'?: LineCap;
  'stroke-dasharray'?: LineDash;
  'opacity'?: number;
}

export interface VectorTile {
  type: 'Vector';
  extent: number;
  buffer: number;
  /**
   * tile zoom
   */
  zoom: number;
  /**
   * - 2n+0: x
   * - 2n+1: y
   * - -buffer <= x, y <= extent + buffer
   */
  coordinates: Array<number>;
  /**
   * Point offset where each part (ring / line) begins.
   * - `partStartIndices.length === partCount + 1`
   * - the last entry is `coordinates.length / 2`
   */
  partStartIndices: Array<number>;
  /**
   * Part offset where each descriptor begins.
   * - `descriptorStartIndices.length === descriptorCount + 1`
   * - the last entry is `partStartIndices.length - 1`
   */
  descriptorStartIndices: Array<number>;
  /**
   * Kind of each descriptor: `0` polygon, `1` line.
   * - `descriptorTypes.length === descriptorCount`
   */
  descriptorTypes: Array<number>;
  styleReferences: Array<number>;
  /**
   * Descriptor offset where each style run begins.
   * - `styleStartIndices.length === styleReferences.length + 1`
   * - the last entry is `descriptorTypes.length`
   */
  styleStartIndices: Array<number>;
  styles: Array<VectorTileStyle>;
  /**
   * Largest relative change any scaled property undergoes across
   * `[zoom, zoom + 1]`, i.e. `max(|s1 / s0 - 1|)`. `0` means nothing in this
   * tile is zoom-dependent, so one frame is valid for the whole octave.
   */
  scaleSpread: number;
  /**
   * Fractional zoom offsets the server considers worth rasterizing, computed
   * from `scaleSpread` against the perceptual tolerance. Always starts at `0`.
   * A single-entry list means the tile is scale-invariant.
   */
  frameDeltaZooms: Array<number>;
}

/**
 * Sample a shipped `[s0, s1]` interval at a fractional zoom offset.
 *
 * `deltaZoom` is `viewZoom - tile.zoom`, clamped to `[0, 1]`: the interval is
 * only defined over the octave during which this tile is on screen.
 */
export function sampleScale(scale: VectorTileScale | undefined, deltaZoom: number): number {
  if (scale === undefined) return 1;
  const t = deltaZoom < 0 ? 0 : deltaZoom > 1 ? 1 : deltaZoom;
  return (scale[0] + (scale[1] - scale[0]) * t) * Math.pow(2, -t);
}

/**
 * Effective stroke width for a style at a fractional zoom offset, before the
 * tile-space scale factor is applied.
 */
export function resolveStrokeWidth(style: VectorTileStyle, deltaZoom: number): number {
  const width = style['stroke-width'];
  if (width === undefined) return 0;
  return width * sampleScale(style['stroke-width-scale'], deltaZoom);
}

/**
 * Pick the nearest server-recommended frame for a view zoom. Returns an index
 * into `frameDeltaZooms`, which doubles as the frame cache key.
 */
export function pickFrameIndex(frameDeltaZooms: VectorTile['frameDeltaZooms'], viewZoom: number, tileZoom: number): number {
  if (frameDeltaZooms.length <= 1) return 0;
  const deltaZoom = clamp(viewZoom - tileZoom, 0, 1);
  let best = 0;
  let bestDistance = Infinity;
  for (let i = 0; i < frameDeltaZooms.length; i++) {
    const distance = Math.abs(frameDeltaZooms[i] - deltaZoom);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = i;
    }
  }
  return best;
}

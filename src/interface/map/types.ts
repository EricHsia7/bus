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

export type TextPlacement = 'point' | 'line';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

/** A resolved, render-ready text style (one per distinct symbolizer per tile). */
export interface LabelStyle {
  /** CSS font shorthand *without* the size, e.g. `italic 700` -> `italic 700 13px "Noto Sans"` */
  fontPrefix: string;
  fontFamily: string;
  size: number;
  fill: string;
  haloFill: string | null;
  haloRadius: number;
  placement: TextPlacement;
  dy: number;
  wrapWidth: number;
  letterSpacing: number;
}

/**
 * Labels for one tile, packed into transferable buffers by the worker.
 * All per-label arrays are indexed 0..count-1.
 */
export interface PackedLabelTile {
  key: TileKey;
  z: number;
  x: number;
  y: number;
  count: number;
  /** 2 * count mercator-unit coordinates (anchor point of each label) */
  anchors: Float64Array;
  /** sort key, ascending = drawn/placed first */
  priority: Float32Array;
  /** index into `styles` */
  styleIdx: Uint16Array;
  /** count + 1 offsets into `lines` (in *points*, not floats) */
  lineStart: Uint32Array;
  /** flat polyline vertices (mercator units) for line-placed labels */
  lines: Float64Array;
  /** count + 1 byte offsets into `text` */
  textStart: Uint32Array;
  /** UTF-8 label text, concatenated */
  text: Uint8Array;
  styles: LabelStyle[];
}

export type WorkerRequest = { type: 'raster'; id: number; key: TileKey; url: string } | { type: 'labels'; id: number; key: TileKey; url: string; z: number; x: number; y: number } | { type: 'abort'; id: number };

export type WorkerResponse =
  | { type: 'raster'; id: number; key: TileKey; bitmap: ImageBitmap }
  | { type: 'labels'; id: number; key: TileKey; tile: PackedLabelTile }
  | {
      type: 'error';
      id: number;
      key: TileKey;
      message: string;
      status: number;
      aborted: boolean;
    };

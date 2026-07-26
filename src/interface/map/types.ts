export interface TileCoord {
  z: number;
  x: number;
  y: number;
}

export type TileKey = string;

export const tileKey = (z: number, x: number, y: number): TileKey => `${z}/${x}/${y}`;

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

/* ---------------------------------------------------------------- worker IO */

export type WorkerRequest = { type: 'raster'; id: number; key: TileKey; url: string } | { type: 'labels'; id: number; key: TileKey; url: string; z: number; x: number; y: number } | { type: 'abort'; id: number };

export type WorkerResponse =
  | { type: 'raster'; id: number; key: TileKey; bitmap: ImageBitmap }
  | { type: 'labels'; id: number; key: TileKey; tile: PackedLabelTile }
  | {
      type: 'error';
      id: number;
      key: TileKey;
      message: string;
      status?: number;
      aborted?: boolean;
    };

/* ------------------------------------------------------------------ config */

export interface MapConfig {
  /** raster template, e.g. "tiles/{z}/{x}/{y}.webp" */
  tileUrl: string;
  /** label template, e.g. "labels/{z}/{x}/{y}.gz" (omit to disable labels) */
  labelUrl?: string | null;
  tileSize?: number;
  minZoom?: number;
  /** deepest zoom that actually has tiles */
  maxZoom?: number;
  /** how far the camera may zoom past maxZoom, scaling the deepest tiles up */
  overzoom?: number;
  /** zoom range for which label tiles exist; outside it the nearest level is reused */
  labelMinZoom?: number;
  labelMaxZoom?: number;
  /** data box [west, south, east, north]; tiles outside are never requested */
  bounds?: [number, number, number, number] | null;
  /** clamp the camera to `bounds` */
  constrainToBounds?: boolean;
  center?: [number, number];
  zoom?: number;
  attribution?: string;
  workers?: number;
  /** max concurrent in-flight requests across all workers */
  concurrency?: number;
  /** LRU sizes (tile count) */
  rasterCacheSize?: number;
  labelCacheSize?: number;
  /** label fade duration, ms */
  fadeDuration?: number;
  /** touchpad/wheel scroll: "auto" = touchpad pans + wheel zooms, or force "zoom"/"pan" */
  wheelBehavior?: 'auto' | 'zoom' | 'pan';
  debug?: boolean;
}

export type ResolvedConfig = Required<Omit<MapConfig, 'labelUrl' | 'bounds'>> & {
  labelUrl: string | null;
  bounds: [number, number, number, number] | null;
};

export const DEFAULT_CONFIG: ResolvedConfig = {
  tileUrl: 'https://erichsia7.github.io/bus-map/tiles/{z}/{x}/{y}.webp',
  labelUrl: 'https://erichsia7.github.io/bus-map/labels/{z}/{x}/{y}.geojson.gz',
  tileSize: 256,
  minZoom: 0,
  maxZoom: 18,
  overzoom: 2,
  labelMinZoom: 0,
  labelMaxZoom: 18,
  bounds: null,
  constrainToBounds: true,
  center: [121.5435, 25.0308],
  zoom: 13,
  attribution: '',
  workers: 0, // 0 -> auto
  concurrency: 16,
  rasterCacheSize: 400,
  labelCacheSize: 300,
  fadeDuration: 160,
  wheelBehavior: 'auto',
  debug: false
};

export function resolveConfig(cfg: Partial<MapConfig>): ResolvedConfig {
  return { ...DEFAULT_CONFIG, ...cfg } as ResolvedConfig;
}

export function formatUrl(template: string, z: number, x: number, y: number): string {
  return template.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
}

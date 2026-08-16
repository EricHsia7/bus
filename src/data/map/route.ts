export type RouteKind = 'line';

declare const ROUTE_STYLE_BRAND: unique symbol;

/** An index into the line style table. */
export type RouteStyleRef = number & { readonly [ROUTE_STYLE_BRAND]: 'line' };

/**
 * Scale interval [s0, s1] spanning [zoom, zoom + 1].
 * Analogous to `LabelPropertyScale` (text-scale / marker-scale).
 */
export type RoutePropertyScale = [scale0: number, scale1: number];

export type LineCap = 'butt' | 'round' | 'square';
export type LineJoin = 'bevel' | 'round' | 'miter';

export interface BaseRouteStyleProperties {
  layer: string;
  minzoom?: number;
  maxzoom?: number;
}

export interface LineStyleProperties extends BaseRouteStyleProperties {
  /** A single constant reference, in CSS pixels at the tile's own zoom. */
  'line-width'?: number;
  /**
   * Scale interval [s0, s1] spanning [zoom, zoom + 1]
   * - width(zoom) = line-width * lerp(s0, s1, zoom - collection.zoom)
   */
  'line-width-scale'?: RoutePropertyScale;
  'line-fill'?: string;
  /** Casing / halo drawn beneath the core stroke (analogue of text-halo-fill). */
  'line-casing-fill'?: string;
  /** Extra width *per side* added to the core width (analogue of text-halo-radius). */
  'line-casing-width'?: number;
  'line-opacity'?: number;
  'line-cap'?: LineCap;
  'line-join'?: LineJoin;
  /** Dash pattern in unscaled pixels; scaled with the stroke width at draw time. */
  'line-dasharray'?: Array<number>;
}

export interface RouteProperties {
  kind?: RouteKind;
  /** Stable identifier of the transit route; used by the selection filter. */
  RouteID: number;
  /** 0 = outbound, 1 = return, 2 = loop. */
  GoBack: number;
  class?: string;
  style: RouteStyleRef;
}

/**
 * A tile feature. Coordinates are tile-local integers in
 * [-buffer, extent + buffer]; values outside [0, extent] are the overlap that
 * guarantees continuity across tile seams.
 */
export interface RouteFeature {
  geometry: 'LineString';
  coordinates: Array<[number, number]>;
  properties: RouteProperties;
}

export interface RouteFeatureCollection {
  type: 'FeatureCollection';
  extent: number;
  /** Overlap kept on each side, in extent units. */
  buffer: number;
  /** The tile's own zoom (`tZ`), hoisted off every feature. Lower anchor for `line-width-scale`. */
  zoom: number;
  x: number;
  y: number;
  features: Array<RouteFeature>;
  lineStyles: Array<LineStyleProperties>;
}

export function resolveRouteStyleProperties(collection: RouteFeatureCollection, properties: RouteProperties): LineStyleProperties {
  const style = collection.lineStyles[properties.style];
  if (!style) throw new Error(`unknown route style ref: ${properties.style}`);
  return style;
}

/**
 * Interpolate a constant reference across the tile's zoom step.
 * Identical semantics to the Label `text-scale` rule.
 */
export function resolveScaledWidth(style: LineStyleProperties, tileZoom: number, zoom: number): number {
  const width = style['line-width'] ?? 1;
  const scale = style['line-width-scale'];
  if (!scale) return width;
  const t = zoom - tileZoom;
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return width * (scale[0] + (scale[1] - scale[0]) * clamped);
}

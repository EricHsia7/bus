import { Decompress } from 'fflate';

export type LabelKind = 'text' | 'marker' | 'point' | 'shield' | 'circle';
export type IconKind = 'marker' | 'point' | 'shield';

declare const STYLE_BRAND: unique symbol;

/** An index into the style table for `K`. */
export type StyleRef<K extends LabelKind> = number & { readonly [STYLE_BRAND]: K };

export interface BaseStyleProperties {
  layer: string;
}

export interface TextStyleProperties extends BaseStyleProperties {
  /**
   * a single constant reference
   */
  'text-size'?: number;
  /**
   * Scale interval [s0, s1] spanning [minzoom, minzoom + 1]
   * - size(zoom) = text-size * lerp(s0, s1, zoom - minzoom)
   */
  'text-scale'?: [scale0: number, scale1: number];
  'text-fill'?: string;
  'text-halo-fill'?: string;
  'text-halo-radius'?: number;
  'text-face-name'?: string;
  'text-placement'?: string;
  /** Placement offset, not a glyph metric: interpolate it, but do NOT multiply it by text-scale */
  'text-dy'?: number;
  'text-wrap-width'?: number;
}

export interface IconStyleProperties extends BaseStyleProperties {
  /** Sprite id: basename of `{marker,point,shield}-file` without extension. */
  'icon'?: string;
  'icon-width'?: number;
  'icon-height'?: number;
  /** Only meaningful when the referencing feature has kind 'shield'. */
  'shield-size'?: number;
}

export interface CircleStyleProperties extends BaseStyleProperties {
  'marker-fill'?: string;
  'marker-line-color'?: string;
  'marker-width'?: number;
}

export type StyleProperties = TextStyleProperties | IconStyleProperties | CircleStyleProperties;

export interface BaseLabelProperties {
  kind: LabelKind;
}

export interface TextLabelProperties extends BaseLabelProperties {
  kind: 'text';
  /** Resolved text: text-name evaluated against the feature tags. Always non-empty. */
  label: string;
  style: StyleRef<'text'>;
  chars: Array<number>;
}

export interface IconLabelProperties extends BaseLabelProperties {
  /** marker / point / shield share one table, so the kind must stay here: the
   *  table cannot recover which of the three it was. */
  kind: IconKind;
  /** Only populated if kind === 'shield' (resolved from shield-name). */
  label?: string;
  style: StyleRef<IconKind>;
  chars: Array<number>;
}

export interface CircleLabelProperties extends BaseLabelProperties {
  kind: 'circle';
  style: StyleRef<'circle'>;
}

export type LabelProperties = TextLabelProperties | IconLabelProperties | CircleLabelProperties;

/**
 * Feature id
 * - open/closed way: `w${way.id}`
 * - area relation: `r${layer.id}:${x}:${y}`
 * - node: `n${node.id}`
 */
export type LabelFeatureId = string;

export interface PointLabelFeature {
  type: 'Feature';
  id: LabelFeatureId;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: LabelProperties;
}

export interface LineStringLabelFeature {
  type: 'Feature';
  id: LabelFeatureId;
  /** From plotLineStringLabel() (open ways only). */
  geometry: {
    type: 'LineString';
    coordinates: Array<[number, number]>;
    /** Per-vertex tangent angles for along-line placement. */
    angles: Array<number>;
  };
  properties: TextLabelProperties;
}

export type LabelFeature = LineStringLabelFeature | PointLabelFeature;

export interface LabelfeatureCollectionCharset {
  table: 'textStyles' | 'iconStyles';
  style: number;
  charset: string;
}

export interface LabelFeatureCollection {
  type: 'FeatureCollection';
  extent: number;
  /** The tile's own zoom (`tZ`), hoisted off every feature. Lower anchor for the `text-scale` interval. */
  zoom: number;
  features: Array<LabelFeature>;
  textStyles: Array<TextStyleProperties>;
  iconStyles: Array<IconStyleProperties>;
  circleStyles: Array<CircleStyleProperties>;
  charsets: Array<LabelfeatureCollectionCharset>;
}

export interface LabelStylePropertiesMap {
  text: TextStyleProperties;
  marker: IconStyleProperties;
  point: IconStyleProperties;
  shield: IconStyleProperties;
  circle: CircleStyleProperties;
}

export function resolveLabelStyleProperties<P extends LabelProperties>(collection: LabelFeatureCollection, properties: P): LabelStylePropertiesMap[P['kind']] {
  switch (properties.kind) {
    case 'text':
      return collection.textStyles[properties.style];
    case 'marker':
    case 'point':
    case 'shield':
      return collection.iconStyles[properties.style];
    case 'circle':
      return collection.circleStyles[properties.style];
    default:
      throw new Error('unknown label kind');
  }
}

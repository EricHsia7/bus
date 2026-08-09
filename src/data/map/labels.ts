export type LabelKind = 'text' | 'marker' | 'point' | 'shield' | 'circle';

export interface BaseLabelProperties {
  kind: LabelKind;
  layer: string;
  minzoom: number;
}

export interface TextLabelProperties extends BaseLabelProperties {
  'kind': 'text';
  /** Resolved text: text-name evaluated against the feature tags. Always non-empty. */
  'label': string;
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
  'text-dy'?: number;
  'text-wrap-width'?: number;
  'text-transform'?: string;
}

export interface IconLabelProperties extends BaseLabelProperties {
  'kind': 'marker' | 'point' | 'shield';
  /** Sprite id: basename of `{marker,point,shield}-file` without extension. */
  'icon'?: string;
  'icon-width'?: number;
  'icon-height'?: number;
  /** Only populated if kind === 'shield' (from shield-name). */
  'label'?: string;
  /** Only populated if kind === 'shield'. */
  'shield-size'?: number;
}

export interface CircleLabelProperties extends BaseLabelProperties {
  'kind': 'circle';
  'marker-fill'?: string;
  'marker-line-color'?: string;
  'marker-width'?: number;
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

export interface LabelFeatureCollection {
  type: 'FeatureCollection';
  extent: number;
  features: Array<LabelFeature>;
}

export type LabelKind = 'text' | 'marker' | 'point' | 'shield' | 'circle';

export interface BaseLabelProperties {
  kind: LabelKind;
  layer: string;
  minzoom: number;
  /** Angle for line labels (e.g., placed along a street) */
  angle?: number;
}

export interface TextLabelProperties extends BaseLabelProperties {
  'kind': 'text';
  'label': string;
  'text-size'?: number;
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
  'icon'?: string;
  'icon-width'?: number;
  'icon-height'?: number;
  /** Only populated if kind === 'shield' */
  'label'?: string;
  /** Only populated if kind === 'shield' */
  'shield-size'?: number;
}

export interface CircleLabelProperties extends BaseLabelProperties {
  'kind': 'circle';
  'marker-fill'?: string;
  'marker-line-color'?: string;
  'marker-width'?: number;
}

export type LabelProperties = TextLabelProperties | IconLabelProperties | CircleLabelProperties;

export interface LabelFeature {
  type: 'Feature';
  /** Format: 'w{id}' for ways, 'n{id}' for nodes, 'r{layer}:{lon}:{lat}' for areas */
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: LabelProperties;
}

export interface LabelFeatureCollection {
  type: 'FeatureCollection';
  /** The local tile extent (e.g., 1024 or 4096) based on labelQuantization */
  extent: number;
  features: LabelFeature[];
}

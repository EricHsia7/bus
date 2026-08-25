import { LineCap, LineDash, LineJoin } from './style';

export type VectorTilePoint = [x: number, y: number];

export type VectorTileRing = Array<VectorTilePoint>;

export type VectorTileRings = Array<VectorTileRing>;

export type VectorTileLine = Array<VectorTilePoint>;

export type VectorTileLines = Array<VectorTileLine>;

export interface VectorTileDescriptorPolygon {
  type: 'polygon';
  geometry: VectorTileRings;
}

export interface VectorTileDescriptorLine {
  type: 'line';
  geometry: VectorTileLines;
}

export type VectorTileDescriptor = VectorTileDescriptorPolygon | VectorTileDescriptorLine;

export interface VectorTileStyle {
  'fill'?: string;
  'fill-opacity'?: number;
  'stroke'?: string;
  'stroke-width'?: number;
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
  descriptors: Array<VectorTileDescriptor>;
  styleReferences: Array<number>;
  /**
   * Descriptor offset where each run begins.
   * - styleStartIndices.length === styleReferences.length + 1
   * - The last entry is 'descriptors.length' */
  styleStartIndices: Array<number>;
  styles: Array<VectorTileStyle>;
}

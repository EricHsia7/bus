import { VectorTile, VectorTileStyle } from './vector';

export interface VectorPlan {
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
  coordinates: Int16Array;
  partStartIndices: Int32Array;
  descriptorStartIndices: Int32Array;
  descriptorTypes: Uint8Array;
  styleReferences: Int16Array;
  styleStartIndices: Int32Array;
  styles: Array<VectorTileStyle>;
  scaleSpread: number;
  frameDeltaZooms: Array<number>;
  /**
   * size in bytes
   */
  size: number;
}

export function buildVectorPlan(vectorTile: VectorTile): VectorPlan {
  const coordinates = new Int16Array(vectorTile.coordinates);
  const partStartIndices = new Int32Array(vectorTile.partStartIndices);
  const descriptorStartIndices = new Int32Array(vectorTile.descriptorStartIndices);
  const descriptorTypes = new Uint8Array(vectorTile.descriptorTypes);
  const styleReferences = new Int16Array(vectorTile.styleReferences);
  const styleStartIndices = new Int32Array(vectorTile.styleStartIndices);
  return {
    type: 'Vector',
    extent: vectorTile.extent,
    buffer: vectorTile.buffer,
    zoom: vectorTile.zoom,
    coordinates,
    partStartIndices,
    descriptorStartIndices,
    descriptorTypes,
    styleReferences,
    styleStartIndices,
    styles: vectorTile.styles,
    scaleSpread: vectorTile.scaleSpread || 0,
    frameDeltaZooms: vectorTile.frameDeltaZooms && vectorTile.frameDeltaZooms.length > 0 ? vectorTile.frameDeltaZooms : [0],
    size: coordinates.byteLength + partStartIndices.byteLength + descriptorStartIndices.byteLength + descriptorTypes.byteLength + styleReferences.byteLength + styleStartIndices.byteLength
  };
}

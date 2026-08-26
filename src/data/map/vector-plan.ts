import { VectorTile, VectorTileStyle } from './vector';

/**
 * Estimated retained cost of one path point: two f64 in the path's own coordinate
 * storage. Coordinates are shipped as Int16 but a Path2D keeps them as doubles, so the
 * path costs about 8x the geometry it was built from.
 */
const pathPointBytes = 16;

/**
 * Estimated per-subpath overhead: the verb plus its bookkeeping. Small next to the
 * points, but a tile of very short lines is nearly all subpaths.
 */
const pathSubpathBytes = 8;

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
   * One path per style run, in extent units.
   */
  paths?: Array<Path2D>;
  /**
   * Bytes of the decoded typed arrays.
   */
  geometryBytes: number;
  /**
   * Estimated bytes the built paths retain.
   *
   * Computed from the geometry rather than measured, so the figure is known before the
   * paths exist and stays stable across the `postMessage` boundary. Counted from the
   * moment the plan is created: over-reporting a not-yet-hydrated plan errs toward
   * evicting early, which is the safe direction for a budget.
   */
  pathBytes: number;
  /**
   * Total budgeted size in bytes: geometry plus the paths built from it.
   */
  size: number;
}

/**
 * Estimate what the paths for a plan's geometry will retain.
 *
 * Every point becomes two doubles and every part opens one subpath, which is the whole
 * cost model — style runs and descriptors only decide how the points are grouped, not
 * how many there are.
 */
function estimatePathBytes(pointCount: number, partCount: number): number {
  return pointCount * pathPointBytes + partCount * pathSubpathBytes;
}

/**
 * Build one path per style run.
 *
 * This is the loop that used to run per frame inside the rasterizer. Hoisting it here
 * means a tile walks its coordinates once on arrival instead of once per frame per
 * zoom step, which is what made a continuous zoom rebuild identical geometry dozens of
 * times.
 */
export function buildVectorPlanPaths(vectorPlan: VectorPlan): Array<Path2D> {
  const { coordinates, partStartIndices, descriptorStartIndices, styleReferences, styleStartIndices } = vectorPlan;
  const paths: Array<Path2D> = [];

  for (let i = 0, l = styleReferences.length; i < l; i++) {
    const path = new Path2D();

    // style run -> descriptor (batched by style) -> part (ring / line) -> point
    const descriptorStart = styleStartIndices[i];
    const descriptorEnd = styleStartIndices[i + 1];
    for (let j = descriptorStart; j < descriptorEnd; j++) {
      const partStart = descriptorStartIndices[j];
      const partEnd = descriptorStartIndices[j + 1];
      for (let p = partStart; p < partEnd; p++) {
        const pointStart = partStartIndices[p];
        const pointEnd = partStartIndices[p + 1];
        if (pointStart === pointEnd) continue;
        path.moveTo(coordinates[pointStart * 2], coordinates[pointStart * 2 + 1]);
        for (let k = pointStart + 1; k < pointEnd; k++) {
          path.lineTo(coordinates[k * 2], coordinates[k * 2 + 1]);
        }
      }
    }

    paths.push(path);
  }

  return paths;
}

export function getVectorPlanPaths(vectorPlan: VectorPlan): Array<Path2D> {
  return vectorPlan.paths || buildVectorPlanPaths(vectorPlan);
}

export function buildVectorPlan(vectorTile: VectorTile): VectorPlan {
  const coordinates = new Int16Array(vectorTile.coordinates);
  const partStartIndices = new Int32Array(vectorTile.partStartIndices);
  const descriptorStartIndices = new Int32Array(vectorTile.descriptorStartIndices);
  const descriptorTypes = new Uint8Array(vectorTile.descriptorTypes);
  const styleReferences = new Int16Array(vectorTile.styleReferences);
  const styleStartIndices = new Int32Array(vectorTile.styleStartIndices);

  const geometryBytes = coordinates.byteLength + partStartIndices.byteLength + descriptorStartIndices.byteLength + descriptorTypes.byteLength + styleReferences.byteLength + styleStartIndices.byteLength;
  const pathBytes = estimatePathBytes(coordinates.length / 2, Math.max(0, partStartIndices.length - 1));

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
    paths: [], // not clonable -> build on the main thread
    geometryBytes,
    pathBytes,
    size: geometryBytes + pathBytes
  };
}

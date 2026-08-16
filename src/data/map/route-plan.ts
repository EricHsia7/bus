import { LineStyleProperties, RouteFeatureCollection, RouteStyleRef } from './route';

export const RouteFeatureStride = 4;

export interface RoutePlan {
  extent: number;
  buffer: number;
  zoom: number;
  x: Uint16Array;
  y: Uint16Array;
  /**
   * - 4n+0: start index (inclusive)
   * - 4n+1: end index (inclusive)
   * - 4n+2: GoBack flag
   * - 4n+3: style ref
   */
  features: Uint32Array;
  /** RouteID per feature; parallel to the stride table. */
  routeIds: Uint32Array;
  /** Shared style table, indexed by the style ref in the stride table. */
  styles: Array<LineStyleProperties>;
  featureCount: number;
}

export function buildRoutePlan(collection: RouteFeatureCollection): RoutePlan {
  const featureCount = collection.features.length;
  const buffer = collection.buffer ?? 0;
  const extent = collection.extent;
  const maxStored = extent + 2 * buffer;

  let coordinateTotal = 0;
  for (let i = 0; i < featureCount; i++) coordinateTotal += collection.features[i].coordinates.length;

  const x = new Uint16Array(coordinateTotal);
  const y = new Uint16Array(coordinateTotal);
  const features = new Uint32Array(featureCount * RouteFeatureStride);
  const routeIds = new Uint32Array(featureCount);

  let coordinateIndex = 0;
  for (let featureIndex = 0; featureIndex < featureCount; featureIndex++) {
    const feature = collection.features[featureIndex];
    const coordinates = feature.coordinates;
    const startIndex = coordinateIndex;

    for (let i = 0; i < coordinates.length; i++) {
      // Offset into unsigned space and clamp: geometry never exceeds the buffer,
      // but clamping keeps a malformed tile from wrapping around.
      const storedX = coordinates[i][0] + buffer;
      const storedY = coordinates[i][1] + buffer;
      x[coordinateIndex] = storedX < 0 ? 0 : storedX > maxStored ? maxStored : storedX;
      y[coordinateIndex] = storedY < 0 ? 0 : storedY > maxStored ? maxStored : storedY;
      coordinateIndex++;
    }

    const featureOffset = RouteFeatureStride * featureIndex;
    features[featureOffset] = startIndex;
    features[featureOffset + 1] = coordinateIndex - 1;
    features[featureOffset + 2] = feature.properties.GoBack;
    features[featureOffset + 3] = feature.properties.style;
    routeIds[featureIndex] = feature.properties.RouteID;
  }

  return {
    extent,
    buffer,
    zoom: collection.zoom,
    x,
    y,
    features,
    routeIds,
    styles: collection.lineStyles,
    featureCount
  };
}

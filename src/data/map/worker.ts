/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { Decompress } from 'fflate';
import { MapLabelsVersion, MapLoaderTile, MapLoaderWorkerMessageData, MapLoaderWorkerMessageError, MapRoutesVersion, MapVectorVersion } from './index';
import { LabelFeatureCollection } from './label';
import { buildLabelGlyphPlan, LabelGlyphCache, LabelGlyphPlan } from './label-plan';
import { RouteFeatureCollection } from './route';
import { buildRoutePlan, RoutePlan } from './route-plan';
import { VectorTile } from './vector';
import { buildVectorPlan, VectorPlan } from './vector-plan';

self.onmessage = function (event: MessageEvent): void {
  const batch = event.data as Array<MapLoaderTile>;
  for (const tile of batch) {
    loadTile(tile).catch((error: Error) => {
      self.postMessage({ type: 'error', error: error.message, tile } as MapLoaderWorkerMessageError);
    });
  }
};

const decoder = new TextDecoder();
async function getJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (!response.body) throw new Error('No response body to stream');

  const inflater = new Decompress();

  let size: number = 0;
  const chunks: Array<Uint8Array> = [];
  inflater.ondata = (chunk, final) => {
    const out = chunk.slice();
    chunks.push(out);
    size += out.length;
  };

  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    inflater.push(value, false); // feed compressed bytes incrementally
  }
  inflater.push(new Uint8Array(0), true); // final = true -> flush the tail

  const buffer = new Uint8Array(size);
  let pos = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, pos);
    pos += chunk.length;
  }
  return JSON.parse(decoder.decode(buffer)) as T;
}

const cache = new LabelGlyphCache(512, 3.5);

// /** Sprite sheets are fetched once and shared by every tile that references an icon. */
// const icons = new Map<string, ImageBitmap>();

// export async function loadIconSprites(entries: Array<{ icon: string; url: string }>): Promise<void> {
//   await Promise.all(
//     entries.map(async (entry) => {
//       if (icons.has(entry.icon)) return;
//       const response = await fetch(entry.url);
//       if (!response.ok) return;
//       icons.set(entry.icon, await createImageBitmap(await response.blob()));
//     })
//   );
// }

async function loadTile(tile: MapLoaderTile) {
  const vectorURL = `https://erichsia7.github.io/bus-map/tiles/${tile.z}/${tile.x}/${tile.y}.gz?_=${MapVectorVersion}`;
  const labelsURL = `https://erichsia7.github.io/bus-map/labels/${tile.z}/${tile.x}/${tile.y}.gz?_=${MapLabelsVersion}`;
  const routesURL = `https://erichsia7.github.io/bus-map-routes/routes/${tile.z}/${tile.x}/${tile.y}.gz?_=${MapRoutesVersion}`;

  const [vector, labels, routes] = await Promise.allSettled([getJSON<VectorTile>(vectorURL), getJSON<LabelFeatureCollection>(labelsURL), getJSON<RouteFeatureCollection>(routesURL)]);
  const vectorAvailable = vector.status === 'fulfilled';
  const labelsAvailable = labels.status === 'fulfilled';
  const routesAvailable = routes.status === 'fulfilled';
  if (!vectorAvailable && !labelsAvailable && !routesAvailable) throw new Error('Error fetching tiles.');
  const transfer = [];

  const vectorPlan: VectorPlan = vectorAvailable
    ? buildVectorPlan(vector.value)
    : {
        type: 'Vector',
        extent: 1,
        buffer: 0,
        zoom: tile.z,
        polygonPositions: new Int16Array(),
        polygonStyles: new Uint16Array(),
        polygonIndices: new Uint32Array(),
        lineVertices: new Int16Array(),
        lineIndices: new Uint32Array(),
        circleVertices: new Int16Array(),
        circleIndices: new Uint32Array(),
        polygonVertexCount: 0,
        polygonIndexCount: 0,
        lineVertexCount: 0,
        lineIndexCount: 0,
        circleVertexCount: 0,
        circleIndexCount: 0,
        palette: new Uint8Array(),
        styleData: new Float32Array(),
        styleTextureWidth: 0,
        paletteCount: 0,
        size: 0
      };
  if (vectorAvailable) transfer.push(vectorPlan.lineIndices.buffer, vectorPlan.lineVertices.buffer, vectorPlan.palette.buffer, vectorPlan.polygonIndices.buffer, vectorPlan.polygonPositions.buffer, vectorPlan.polygonStyles.buffer, vectorPlan.circleVertices.buffer, vectorPlan.circleIndices.buffer);

  const labelPlan: LabelGlyphPlan = labelsAvailable
    ? buildLabelGlyphPlan(labels.value, cache)
    : {
        extent: 1,
        zoom: tile.z,
        designSize: 1,
        sheet: null,
        glyphs: new Float32Array(),
        placements: new Float32Array(),
        features: new Uint32Array(),
        bounds: new Float32Array(),
        collisions: new Float32Array(),
        scales: new Float32Array(),
        circleStyles: [],
        size: 0
      };
  if (labelsAvailable) transfer.push(labelPlan.sheet as ImageBitmap, labelPlan.bounds.buffer, labelPlan.features.buffer, labelPlan.glyphs.buffer, labelPlan.placements.buffer, labelPlan.scales.buffer, labelPlan.collisions.buffer);

  const routePlan: RoutePlan = routesAvailable
    ? buildRoutePlan(routes.value)
    : {
        extent: 1,
        buffer: 0,
        zoom: tile.z,
        x: new Uint16Array(),
        y: new Uint16Array(),
        features: new Uint32Array(),
        routeIds: new Uint32Array(),
        styles: [],
        featureCount: 0
      };
  if (routesAvailable) transfer.push(routePlan.features.buffer, routePlan.routeIds.buffer, routePlan.x.buffer, routePlan.y.buffer);

  self.postMessage(
    {
      type: 'data',
      response: {
        ...tile,
        vector: vectorPlan,
        label: labelPlan,
        route: routePlan
      }
    } as MapLoaderWorkerMessageData,
    transfer
  );
}

/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { Decompress } from 'fflate';
import { MapLabelsVersion, MapLoaderTile, MapLoaderWorkerMessageData, MapLoaderWorkerMessageError, MapRoutesVersion, MapVectorVersion } from './index';
import { LabelFeatureCollection } from './label';
import { buildLabelGlyphPlan, LabelGlyphCache } from './label-plan';
import { RouteFeatureCollection } from './route';
import { buildRoutePlan } from './route-plan';
import { VectorTile } from './vector';
import { buildVectorPlan } from './vector-plan';

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

const cache = new LabelGlyphCache(512, 3);

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
  if (vector.status !== 'fulfilled' || labels.status !== 'fulfilled') throw new Error('Error fetching tiles.');
  const vectorPlan = buildVectorPlan(vector.value);
  const labelPlan = buildLabelGlyphPlan(labels.value, cache);
  const routePlan =
    routes.status === 'fulfilled'
      ? buildRoutePlan(routes.value)
      : {
          extent: 2048,
          buffer: 64,
          zoom: tile.z,
          x: new Uint16Array(),
          y: new Uint16Array(),
          features: new Uint32Array(),
          routeIds: new Uint32Array(),
          styles: [],
          featureCount: 0
        };
  self.postMessage(
    {
      type: 'data',
      response: {
        ...tile,
        bitmap: vectorPlan.bitmaps[0],
        label: labelPlan,
        route: routePlan
      }
    } as MapLoaderWorkerMessageData,
    [...vectorPlan.bitmaps, labelPlan.sheet as ImageBitmap, labelPlan.bounds.buffer, labelPlan.features.buffer, labelPlan.glyphs.buffer, labelPlan.placements.buffer, labelPlan.scales.buffer, labelPlan.collisions.buffer]
  );
}

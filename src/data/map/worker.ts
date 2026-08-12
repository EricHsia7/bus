/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { Decompress } from 'fflate';
import { MapLoaderTile, MapLoaderWorkerMessageData, MapLoaderWorkerMessageError } from './index';
import { LabelFeatureCollection } from './label';
import { buildLabelGlyphPlan, LabelGlyphCache } from './label-plan';

self.onmessage = function (event: MessageEvent): void {
  const batch = event.data as Array<MapLoaderTile>;
  for (const tile of batch) {
    loadTile(tile).catch((error: Error) => self.postMessage({ type: 'error', error: error.message, tile } as MapLoaderWorkerMessageError));
  }
};

async function getRaster(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  return bitmap;
}

const decoder = new TextDecoder();
async function getLabels(url: string): Promise<LabelFeatureCollection> {
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
  return JSON.parse(decoder.decode(buffer)) as LabelFeatureCollection;
}

const cache = new LabelGlyphCache({
  superSample: 3,
  pageSize: 512
});

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
  const rasterURL = `https://erichsia7.github.io/bus-map/tiles/${tile.z}/${tile.x}/${tile.y}.webp?v=18`;
  const labelsURL = `https://erichsia7.github.io/bus-map/labels/${tile.z}/${tile.x}/${tile.y}.gz?v=18`;
  // TODO: version.json

  const [bitmap, labels] = await Promise.all([getRaster(rasterURL), getLabels(labelsURL)]);
  const labelPlan = buildLabelGlyphPlan(labels, tile, cache);
  self.postMessage(
    {
      type: 'data',
      response: {
        ...tile,
        bitmap,
        label: labelPlan
      }
    } as MapLoaderWorkerMessageData,
    [bitmap, labelPlan.sheet, labelPlan.bounds.buffer, labelPlan.features.buffer, labelPlan.glyphs.buffer, labelPlan.placements.buffer, labelPlan.scales.buffer, labelPlan.collisions.buffer]
  );
}

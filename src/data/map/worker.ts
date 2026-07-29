/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { Decompress } from 'fflate';
import { MapLoaderTile, MapLoaderWorkerMessageData, MapLoaderWorkerMessageError } from '.';
import { LabelFeatureCollection } from './labels';

self.onmessage = function (event: MessageEvent): void {
  const batch = event.data as Array<MapLoaderTile>;
  for (const tile of batch) {
    loadTile(tile).catch((error: Error) => self.postMessage({ type: 'error', error: error.message, tile } as MapLoaderWorkerMessageError));
  }
};

const tileSize = 512;
const decoder = new TextDecoder();

async function getRaster(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  return bitmap;
}

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

async function loadTile(tile: MapLoaderTile) {
  const rasterURL = `https://github.com/EricHsia7/bus-map/tiles/${tile.z}/${tile.x}/${tile.y}.webp`;
  const labelsURL = `https://github.com/EricHsia7/bus-map/labels/${tile.z}/${tile.x}/${tile.y}.gz`;

  const [bitmap, labels] = await Promise.all([getRaster(rasterURL), getLabels(labelsURL)]);
  const canvas = new OffscreenCanvas(tileSize, tileSize);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineJoin = 'round';
  context.miterLimit = 2;

  context.drawImage(bitmap, 0, 0, tileSize, tileSize);

  const extent = labels.extent || 1;
  for (const feature of labels.features) {
    let [labelX, labelY] = feature.geometry.coordinates;
    labelX *= tileSize / extent;
    labelY *= tileSize / extent;

    context.save();

    if (feature.properties.angle) {
      context.translate(labelX, labelY);
      context.rotate(feature.properties.angle);
      context.translate(-labelX, -labelY);
    }

    switch (feature.properties.kind) {
      case 'text': {
        if (!feature.properties['text-size']) continue;
        context.font = `${feature.properties['text-size']}px`; // TODO: font family

        if (feature.properties['text-halo-fill'] && feature.properties['text-halo-radius']) {
          context.strokeStyle = feature.properties['text-halo-fill'];
          context.lineWidth = feature.properties['text-halo-radius'] * 2;
          context.strokeText(feature.properties.label, labelX, labelY);
        }

        if (feature.properties['text-fill']) {
          context.fillStyle = feature.properties['text-fill'];
          context.fillText(feature.properties.label, labelX, labelY);
        }
        break;
      }
      case 'circle': {
        if (!feature.properties['marker-width']) continue;
        if (!feature.properties['marker-fill']) continue;
        break;
      }
      // TODO: draw other features

      default:
        break;
    }

    context.restore();
  }

  const rendered = canvas.transferToImageBitmap();
  self.postMessage(
    {
      type: 'data',
      response: {
        ...tile,
        bitmap: rendered
      }
    } as MapLoaderWorkerMessageData,
    [rendered]
  );
}

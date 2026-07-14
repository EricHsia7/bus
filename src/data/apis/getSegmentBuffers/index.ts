import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface BufferZoneItem {
  Direction: 0 | 1 | 2; // (goBack/GoBack)
  OriginStopID: number;
  DestinationStopID: number;
}

export type BufferZones = Array<BufferZoneItem>;

export interface SegmentBufferItem {
  RouteID: number;
  BufferZones: BufferZones;
}

export type SegmentBuffers = Array<SegmentBufferItem>;

export type SimplifiedSegmentBufferItem = { [g_direction: string]: BufferZones };

export type SimplifiedSegmentBuffer = { [r_id: string]: SimplifiedSegmentBufferItem };

let SegmentBuffersMemoryCache_available: boolean = false;
let SegmentBuffersMemoryCache_data: SimplifiedSegmentBuffer = {};
let SegmentBuffersMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 30 * 1000;
const cacheKey = 'bus_segment_buffers_cache';

async function extractSegmentBuffers(xml: string): Promise<SegmentBuffers> {
  const worker = new Worker(new URL('./extractSegmentBuffers-worker.ts', import.meta.url));

  // Wrap worker communication in a promise
  const result = (await new Promise((resolve, reject) => {
    worker.onmessage = function (e) {
      resolve(e.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    };

    worker.onerror = function (e) {
      reject(e.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    };

    worker.postMessage(xml); // Send data to the worker
  })) as SegmentBuffers;

  return result;
}

async function simplifySegmentBuffers(array: SegmentBuffers): Promise<SimplifiedSegmentBuffer> {
  const worker = new Worker(new URL('./simplifySegmentBuffers-worker.ts', import.meta.url));

  // Wrap worker communication in a promise
  const result = (await new Promise((resolve, reject) => {
    worker.onmessage = function (e) {
      resolve(e.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    };

    worker.onerror = function (e) {
      reject(e.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    };

    worker.postMessage(array); // Send data to the worker
  })) as SimplifiedSegmentBuffer;

  return result;
}

export async function getSegmentBuffers(progress: Progress): Promise<SimplifiedSegmentBuffer> {
  async function getData() {
    const apis = [
      [0, 15],
      [1, 15]
    ];
    let result = '';
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = decoder.decode(inflatedData); // xml
      result += data;
      // progress.timestamp(-1, -480); // UTC+8
    }
    return result;
  }

  const now = new Date().getTime();

  if (SegmentBuffersMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) SegmentBuffersMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      SegmentBuffersMemoryCache_data = JSON.parse(cache);
      SegmentBuffersMemoryCache_available = true;
    }
  }

  if (SegmentBuffersMemoryCache_available && now - SegmentBuffersMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return SegmentBuffersMemoryCache_data;
  }

  const result = await getData();
  const extractedResult = await extractSegmentBuffers(result);
  const simplifiedResult = await simplifySegmentBuffers(extractedResult);
  SegmentBuffersMemoryCache_data = simplifiedResult;
  SegmentBuffersMemoryCache_available = true;
  SegmentBuffersMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(simplifiedResult));
  return simplifiedResult;
}

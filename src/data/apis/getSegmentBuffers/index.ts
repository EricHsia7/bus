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

export type SimplifiedSegmentBufferItem = { [key: string]: BufferZones };

export type SimplifiedSegmentBuffer = { [key: string]: SimplifiedSegmentBufferItem };

let SegmentBuffersAPIVariableCache_available: boolean = false;
let SegmentBuffersAPIVariableCache_data: object = {};

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
  const result = await new Promise((resolve, reject) => {
    worker.onmessage = function (e) {
      resolve(e.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    };

    worker.onerror = function (e) {
      reject(e.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    };

    worker.postMessage(array); // Send data to the worker
  });

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
      const listenID = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(listenID, message.loaded, message.total);
      });
      const data = decoder.decode(inflatedData); // xml
      result += data;
      // progress.timestamp(-1, -480); // UTC+8
    }
    return result;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 30 * 1000;
  const cacheKey = 'bus_segment_buffers_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const extractedResult = await extractSegmentBuffers(result);
    const simplifiedResult = await simplifySegmentBuffers(extractedResult);
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(simplifiedResult));
    if (!SegmentBuffersAPIVariableCache_available) {
      SegmentBuffersAPIVariableCache_available = true;
      SegmentBuffersAPIVariableCache_data = simplifiedResult;
    }
    return simplifiedResult;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp, 10) > cacheTimeToLive) {
      const result = await getData();
      const extractedResult = await extractSegmentBuffers(result);
      const simplifiedResult = await simplifySegmentBuffers(extractedResult);
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(simplifiedResult));
      return simplifiedResult;
    } else {
      if (!SegmentBuffersAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        SegmentBuffersAPIVariableCache_available = true;
        SegmentBuffersAPIVariableCache_data = JSON.parse(cache);
      }
      progress.update(progress.listen(), 1, 1);
      progress.update(progress.listen(), 1, 1);
      return SegmentBuffersAPIVariableCache_data;
    }
  }
}

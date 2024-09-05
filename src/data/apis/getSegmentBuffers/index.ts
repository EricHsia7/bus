import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader/index';
import { lfSetItem, lfGetItem } from '../../storage/index';

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

export type SimplifiedSegmentBufferItem = { [key: string]: Array<BufferZoneItem> };

export type SimplifiedSegmentBuffer = { [key: string]: SimplifiedSegmentBufferItem };

let SegmentBuffersAPIVariableCache_available: boolean = false;
let SegmentBuffersAPIVariableCache_data: object = {};

async function extractSegmentBuffers(xml: string): Promise<SegmentBuffers> {
  const worker = new Worker(new URL('./extractSegmentBuffers-worker.ts', import.meta.url));

  // Wrap worker communication in a promise
  const result = await new Promise((resolve, reject) => {
    worker.addEventListener('message', function (event) {
      resolve(event.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    });

    worker.addEventListener('error', function (event) {
      reject(event.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    });

    worker.postMessage(xml); // Send data to the worker
  });

  return result;
}

async function simplifySegmentBuffers(array: SegmentBuffers): Promise<SimplifiedSegmentBuffer> {
  const worker = new Worker(new URL('./simplifySegmentBuffers-worker.ts', import.meta.url));

  // Wrap worker communication in a promise
  const result = await new Promise((resolve, reject) => {
    worker.addEventListener('message', function (event) {
      resolve(event.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    });

    worker.addEventListener('error', function (event) {
      reject(event.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    });

    worker.postMessage(array); // Send data to the worker
  });

  return result;
}

export async function getSegmentBuffers(requestID: string): Promise<SimplifiedSegmentBuffer> {
  async function getData() {
    var apis = [
      [0, 15],
      [1, 15]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = '';
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getSegmentBuffers_${api.e[0]}`, 'xml');
      result += data;
      setDataUpdateTime(requestID, -1);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 30 * 1000;
  var cache_key = 'bus_segment_buffers_v6_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var extractedResult = await extractSegmentBuffers(result);
    var simplifiedResult = await simplifySegmentBuffers(extractedResult);
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(simplifiedResult));
    if (!SegmentBuffersAPIVariableCache_available) {
      SegmentBuffersAPIVariableCache_available = true;
      SegmentBuffersAPIVariableCache_data = simplifiedResult;
    }
    return simplifiedResult;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var extractedResult = await extractSegmentBuffers(result);
      var simplifiedResult = await simplifySegmentBuffers(extractedResult);
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(simplifiedResult));
      return simplifiedResult;
    } else {
      if (!SegmentBuffersAPIVariableCache_available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        SegmentBuffersAPIVariableCache_available = true;
        SegmentBuffersAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getSegmentBuffers_0', 0, true);
      setDataReceivingProgress(requestID, 'getSegmentBuffers_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return SegmentBuffersAPIVariableCache_data;
    }
  }
}

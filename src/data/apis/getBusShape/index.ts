import { GenericNumberArray } from '../../../tools/math';
import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { APIData, getAPIURL } from '../getAPIURL/index';
import { Stop } from '../getStop';
import { fetchInflate } from '../loader';

export interface BusShapeItem {
  UniRouteId: string;

  /**
   * RouteID
   */
  RouteID: number;

  /**
   * PathAttributeId
   */
  SubRouteID: -1 | number;

  /**
   * coordinates
   * @example "LINESTRING (lon1 lat1, lon2 lat2, ...)"
   */
  wkt: string;

  /**
   * a timestamp representing the update time
   * @example "YYYY-MM-DD hh:mm:ss"
   */
  utime: string;

  /**
   * 0: go
   * 1: back
   * 2: unknown
   */
  GoBack: number;
}

export type BusShape = Array<BusShapeItem>;

/**
 * stop location id -> coordinate index
 */
export type SimplifiedBusShapeMarkers = {
  [l_id: string]: number;
};

export interface SimplifiedBusShapeItem {
  longtitudes: GenericNumberArray;
  latitudes: GenericNumberArray;
  markers: SimplifiedBusShapeMarkers;
  cis: boolean
}

export type SimplifiedBusShape = {
  [r_id: string]: [go: SimplifiedBusShapeItem, back: SimplifiedBusShapeItem];
};

let BusShapeMemoryCache_available: boolean = false;
let BusShapeMemoryCache_data: SimplifiedBusShape = {};
let BusShapeMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 30 * 1000;
const cacheKey = 'bus_bus_shape_v3_cache';

async function simplifyBusShape(BusShape: BusShape, Stop: Stop): Promise<SimplifiedBusShape> {
  const worker = new Worker(new URL('./simplifyBusShape-worker.ts', import.meta.url));

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

    worker.postMessage({ BusShape, Stop }); // Send data to the worker
  })) as SimplifiedBusShape;

  return result;
}

export async function getBusShape(progress: Progress): Promise<SimplifiedBusShape> {
  async function getData() {
    const apis = [
      [0, 16],
      [1, 16]
    ];
    const result: BusShape = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData)) as BusShape;
      for (let i = 0, l = data.length; i < l; i++) {
        result.push(data[i]);
      }
    }
    return result;
  }

  async function getStopData() {
    const apis = [
      [0, 11],
      [1, 11]
    ];
    const result: Stop = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData)) as APIData<Stop>;
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i]);
      }
    }
    return result;
  }

  const now = new Date().getTime();

  if (BusShapeMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) BusShapeMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      BusShapeMemoryCache_data = JSON.parse(cache);
      BusShapeMemoryCache_available = true;
    }
  }

  if (BusShapeMemoryCache_available && now - BusShapeMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return BusShapeMemoryCache_data;
  }

  const data = await getData();
  const stopData = await getStopData();
  const simplified = await simplifyBusShape(data, stopData);
  for (const key in simplified) {
    for (let i = 0; i < 2; i++) {
      if (simplified[key][i]) {
        simplified[key][i].longtitudes = Array.from(simplified[key][i].longtitudes);
        simplified[key][i].latitudes = Array.from(simplified[key][i].latitudes);
      }
    }
  }

  BusShapeMemoryCache_data = simplified;
  BusShapeMemoryCache_available = true;
  BusShapeMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(simplified));
  return simplified;
}

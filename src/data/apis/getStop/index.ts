import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface StopItem {
  /**
   * StopID
   */
  Id: number;

  /**
   * RouteID
   */
  routeId: number;

  /**
   * name in Chinese
   */
  nameZh: string;

  /**
   * name in English
   */
  nameEn: string;

  /**
   * sequence on the route
   */
  seqNo: number;

  /**
   * - -1: get off
   * - 0: get on and off
   * - 1: get on
   */
  pgp: string;

  /**
   * same as GoBack
   * - 0: go
   * - 1: back
   * - 2: unknown
   */
  goBack: '0' | '1' | '2';

  /**
   * number in string
   */
  longitude: string;

  /**
   * number in string
   */
  latitude: string;

  address: string;

  /**
   * LocationID
   */
  stopLocationId: number;

  /**
   * number in string
   */
  showLon: string;

  /**
   * number in string
   */
  showLat: string;
  vector: string;
}

export type Stop = Array<StopItem>;

export interface SimplifiedStopItem {
  /**
   * sequence on the route
   */
  seqNo: number;

  /**
   * same as GoBack
   * - 0: go
   * - 1: back
   * - 2: unknown
   */
  goBack: '0' | '1' | '2';

  /**
   * LocationID
   */
  stopLocationId: number;
}

export type SimplifiedStop = { [key: string]: SimplifiedStopItem };

let StopMemoryCache_available: boolean = false;
let StopMemoryCache_data: SimplifiedStop = {};
let StopMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 45 * 1000;
const cacheKey = 'bus_stop_cache';

async function simplifyStop(array: Stop): Promise<SimplifiedStop> {
  const worker = new Worker(new URL('./simplifyStop-worker.ts', import.meta.url));

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
  })) as SimplifiedStop;

  return result;
}

export async function getStop(progress: Progress): Promise<SimplifiedStop> {
  async function getData(): Promise<Stop> {
    const apis = [
      [0, 11],
      [1, 11]
    ];
    const result = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData));
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i] as StopItem);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const now = new Date().getTime();

  if (StopMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) StopMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      StopMemoryCache_data = JSON.parse(cache);
      StopMemoryCache_available = true;
    }
  }

  if (StopMemoryCache_available && now - StopMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return StopMemoryCache_data;
  }

  const result = await getData();
  const simplifiedResult = await simplifyStop(result);
  StopMemoryCache_data = simplifiedResult;
  StopMemoryCache_available = true;
  StopMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(simplifiedResult));
  return simplifiedResult;
}

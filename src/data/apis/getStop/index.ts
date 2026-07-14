import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface StopItem {
  Id: number; // StopID
  routeId: number; // RouteID
  nameZh: string; // name in Chinese
  nameEn: string; // name in English
  seqNo: number; // sequence on the route
  pgp: string; // pgp (-1: get off, 0: get on and off, 1: get on)
  goBack: '0' | '1' | '2'; // GoBack (0: go, 1: back, 2: unknown)
  longitude: string; // number in string
  latitude: string; // number in string
  address: string;
  stopLocationId: number; // LocationID
  showLon: string; // number in string
  showLat: string; // number in string
  vector: string;
}

export type Stop = Array<StopItem>;

export interface SimplifiedStopItem {
  seqNo: number;
  goBack: '0' | '1' | '2'; // GoBack (0: go, 1: back, 2: unknown)
  stopLocationId: number;
}

export type SimplifiedStop = { [key: string]: SimplifiedStopItem };

let StopAPIVariableCache_available: boolean = false;
let StopAPIVariableCache_data: SimplifiedStop = {};

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
  async function getData() {
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
      for (let i = 0, l = data.BusInfo.length; i < l; i += 64) {
        result.push(data.BusInfo[i]);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 45 * 1000;
  const cacheKey = 'bus_stop_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const simplified_result = await simplifyStop(result);
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(simplified_result));
    if (!StopAPIVariableCache_available) {
      StopAPIVariableCache_available = true;
      StopAPIVariableCache_data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp, 10) > cacheTimeToLive) {
      const result = await getData();
      const simplified_result = await simplifyStop(result);
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(simplified_result));
      return simplified_result;
    } else {
      if (!StopAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        StopAPIVariableCache_available = true;
        StopAPIVariableCache_data = JSON.parse(cache);
      }
      progress.update(progress.listen(), 1, 1);
      progress.update(progress.listen(), 1, 1);
      return StopAPIVariableCache_data;
    }
  }
}

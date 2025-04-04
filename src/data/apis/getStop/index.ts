import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';

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
let StopAPIVariableCache_data: object = {};

async function simplifyStop(array: Stop): Promise<SimplifiedStop> {
  const worker = new Worker(new URL('./simplifyStop-worker.ts', import.meta.url));

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

export async function getStop(requestID: string): Promise<SimplifiedStop> {
  async function getData() {
    var apis = [
      [0, 11],
      [1, 11]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getStop_${api.e[0]}`, 'json');
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 30 * 1000;
  var cache_key = 'bus_stop_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = await simplifyStop(result);
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
    if (!StopAPIVariableCache_available) {
      StopAPIVariableCache_available = true;
      StopAPIVariableCache_data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = await simplifyStop(result);
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
      return simplified_result;
    } else {
      if (!StopAPIVariableCache_available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        StopAPIVariableCache_available = true;
        StopAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getStop_0', 0, true);
      setDataReceivingProgress(requestID, 'getStop_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return StopAPIVariableCache_data;
    }
  }
}

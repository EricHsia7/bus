import { getAPIURL } from './getAPIURL';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from './loader';
import { lfSetItem, lfGetItem } from '../storage/index';
import { md5 } from '../../tools/index';
import { mergeAddressesIntoOne } from '../../tools/address';

export interface LocationItem {
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

export type Location = Array<LocationItem>;

export interface SimplifiedLocationItem {
  n: string; // name
  lo: number; // longitude
  la: number; // latitude
  r: Array<number>; // RouteIDs
  s: Array<number>; // StopIDs
  v: Array<[number, number]>; // a set of vectors
  a: Array<string>; // addresses
}

export type SimplifiedLocation = { [key: string]: SimplifiedLocationItem };

export interface MergedLocationItem {
  n: string; // name
  lo: Array<number>; // longitude
  la: Array<number>; // latitude
  r: Array<Array<number>>; // RouteIDs
  s: Array<Array<number>>; // StopIDs
  v: Array<Array<[number, number]>>; // sets of vectors
  a: Array<object | string>; // addresses
}

export type MergedLocation = { [key: string]: MergedLocationItem };

var LocationAPIVariableCache: object = {
  merged: {
    available: false,
    data: {}
  },
  simplified: {
    available: false,
    data: {}
  }
};

async function simplifyLocation(Location: Location): Promise<SimplifiedLocation> {
  const worker = new Worker(new URL('./getLocation-simplification-worker.ts', import.meta.url));

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

    worker.postMessage(Location); // Send data to the worker
  });

  return result;
}

async function mergeLocationByName(object: SimplifiedLocation): MergedLocation {
  const worker = new Worker(new URL('./getLocation-mergence-worker.ts', import.meta.url));

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

    worker.postMessage(object); // Send data to the worker
  });

  return result;
}

export async function getLocation(requestID: string, merged: boolean = false): Promise<SimplifiedLocation | MergedLocation> {
  async function getData() {
    var apis = [
      [0, 11],
      [1, 11]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getLocation_${api.e[0]}`);
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  var cache_time: number = 60 * 60 * 24 * 30 * 1000;
  var cache_type = merged ? 'merged' : 'simplified';
  var cache_key = `bus_${cache_type}_location_v14_cache`;
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var final_result = {};
    var simplified_result = await simplifyLocation(result);
    if (merged) {
      var merged_result = await mergeLocationByName(simplified_result);
      final_result = merged_result;
    } else {
      final_result = simplified_result;
    }

    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
    if (!LocationAPIVariableCache[cache_type].available) {
      LocationAPIVariableCache[cache_type].available = true;
      LocationAPIVariableCache[cache_type].data = final_result;
    }
    return final_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var final_result = {};
      var simplified_result = await simplifyLocation(result);
      if (merged) {
        var merged_result = await mergeLocationByName(simplified_result);
        final_result = merged_result;
      } else {
        final_result = simplified_result;
      }

      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
      if (!LocationAPIVariableCache[cache_type].available) {
        LocationAPIVariableCache[cache_type].available = true;
        LocationAPIVariableCache[cache_type].data = final_result;
      }
      return final_result;
    } else {
      if (!LocationAPIVariableCache[cache_type].available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        LocationAPIVariableCache[cache_type].available = true;
        LocationAPIVariableCache[cache_type].data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getLocation_0', 0, true);
      setDataReceivingProgress(requestID, 'getLocation_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return LocationAPIVariableCache[cache_type].data;
    }
  }
}

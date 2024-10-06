import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';
import { lfGetItem, lfSetItem } from '../../storage/index';

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
  id: Array<number>;
  hash: string;
}

export type MergedLocation = { [key: string]: MergedLocationItem };

let LocationAPIVariableCache: object = {
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
  const worker = new Worker(new URL('./simplifyLocation-worker.ts', import.meta.url));

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

async function mergeLocationByName(object: SimplifiedLocation): Promise<MergedLocation> {
  const worker = new Worker(new URL('./mergeLocationByName-worker.ts', import.meta.url));

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
    const apis = [
      [0, 11],
      [1, 11]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    let result = [];
    for (const api of apis) {
      const data = await fetchData(api.url, requestID, `getLocation_${api.e[0]}`, 'json');
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  const cacheTime: number = 60 * 60 * 24 * 30 * 1000;
  const cacheType = merged ? 'merged' : 'simplified';
  const cacheKey = `bus_${cacheType}_location_v14_cache`;
  const cachedTime = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cachedTime === null) {
    const result = await getData();
    let finalResult = {};
    const simplifiedResult = await simplifyLocation(result);
    if (merged) {
      const mergedResult = await mergeLocationByName(simplifiedResult);
      finalResult = mergedResult;
    } else {
      finalResult = simplifiedResult;
    }

    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cacheKey}`, JSON.stringify(finalResult));
    if (!LocationAPIVariableCache[cacheType].available) {
      LocationAPIVariableCache[cacheType].available = true;
      LocationAPIVariableCache[cacheType].data = finalResult;
    }
    return finalResult;
  } else {
    if (new Date().getTime() - parseInt(cachedTime) > cacheTime) {
      const result = await getData();
      let finalResult = {};
      const simplifiedResult = await simplifyLocation(result);
      if (merged) {
        const mergedResult = await mergeLocationByName(simplifiedResult);
        finalResult = mergedResult;
      } else {
        finalResult = simplifiedResult;
      }

      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cacheKey}`, JSON.stringify(finalResult));
      if (!LocationAPIVariableCache[cacheType].available) {
        LocationAPIVariableCache[cacheType].available = true;
        LocationAPIVariableCache[cacheType].data = finalResult;
      }
      return finalResult;
    } else {
      if (!LocationAPIVariableCache[cacheType].available) {
        const cache = await lfGetItem(0, `${cacheKey}`);
        LocationAPIVariableCache[cacheType].available = true;
        LocationAPIVariableCache[cacheType].data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getLocation_0', 0, true);
      setDataReceivingProgress(requestID, 'getLocation_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return LocationAPIVariableCache[cacheType].data;
    }
  }
}

import { ParsedAddress } from '../../../tools/address';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';

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
  g: string; // geohash
  r: Array<number>; // RouteIDs
  s: Array<number>; // StopIDs
  v: Array<[number, number]>; // a set of vectors
  a: Array<string>; // addresses
  id: number; // stopLocationId
}

export type SimplifiedLocation = { [l_id: string]: SimplifiedLocationItem };

export interface MergedLocationItem {
  n: string; // name
  lo: Array<number>; // longitude
  la: Array<number>; // latitude
  g: Array<string>; // geohash
  r: Array<Array<number>>; // RouteIDs
  s: Array<Array<number>>; // StopIDs
  v: Array<Array<[number, number]>>; // sets of vectors
  a: Array<ParsedAddress>; // addresses
  id: Array<number>; // stopLocationIds
  hash: string;
}

export type MergedLocation = { [ml_hash: string]: MergedLocationItem };

export interface IndexedLocationItem {
  lo: number; // longitude
  la: number; // latitude
  hash: string;
}

export type IndexedLocation = { [geohash: string]: Array<IndexedLocationItem> };

const LocationAPIVariableCache = {
  simplified: {
    available: false,
    data: {}
  },
  merged: {
    available: false,
    data: {}
  },
  indexed: {
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

async function indexLocationByGeohash(object: MergedLocation): Promise<IndexedLocation> {
  const worker = new Worker(new URL('./indexLocationByGeohash-worker.ts', import.meta.url));

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

/**
 * getLocation
 * @param requestID
 * @param type 0: simplified, 1: merged, 2: indexed
 * @returns SimplifiedLocation, MergedLocation, or IndexedLocation
 */

export async function getLocation(requestID: string, type: 0 | 1 | 2): Promise<SimplifiedLocation | MergedLocation | IndexedLocation> {
  async function getData() {
    const apis = [
      [0, 11],
      [1, 11]
    ];
    const result = [];
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const data = await fetchData(url, requestID, `getLocation_${api[0]}`, 'json');
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i]);
      }
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 30 * 1000;
  const cacheType = ['simplified', 'merged', 'indexed'][type];
  const cacheKey = `bus_${cacheType}_location_cache`;
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    let finalResult;
    switch (type) {
      case 0: {
        const result = await getData();
        const simplified_result = await simplifyLocation(result);
        finalResult = simplified_result;
        break;
      }
      case 1: {
        const simplified_result = await getLocation(requestID, 0);
        const merged_result = await mergeLocationByName(simplified_result);
        finalResult = merged_result;
        break;
      }
      case 2: {
        const merged_result = await getLocation(requestID, 1);
        const indexed_result = await indexLocationByGeohash(merged_result);
        finalResult = indexed_result;
        break;
      }
      default:
        break;
    }

    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(finalResult));
    if (!LocationAPIVariableCache[cacheType].available) {
      LocationAPIVariableCache[cacheType].available = true;
      LocationAPIVariableCache[cacheType].data = finalResult;
    }
    return finalResult;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      let finalResult;
      switch (type) {
        case 0: {
          const result = await getData();
          const simplified_result = await simplifyLocation(result);
          finalResult = simplified_result;
          break;
        }
        case 1: {
          const simplified_result = await getLocation(requestID, 0);
          const merged_result = await mergeLocationByName(simplified_result);
          finalResult = merged_result;
          break;
        }
        case 2: {
          const merged_result = await getLocation(requestID, 1);
          const indexed_result = await indexLocationByGeohash(merged_result);
          finalResult = indexed_result;
          break;
        }
        default:
          break;
      }

      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(finalResult));
      if (!LocationAPIVariableCache[cacheType].available) {
        LocationAPIVariableCache[cacheType].available = true;
        LocationAPIVariableCache[cacheType].data = finalResult;
      }
      return finalResult;
    } else {
      if (!LocationAPIVariableCache[cacheType].available) {
        const cache = await lfGetItem(0, cacheKey);
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

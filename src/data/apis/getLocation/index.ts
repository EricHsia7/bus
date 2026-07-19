import { ParsedAddress } from '../../../tools/address';
import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { APIData, getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface LocationItem {
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
  pgp: '-1' | '0' | '1';

  /**
   * GoBack
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

export type Location = Array<LocationItem>;

export interface SimplifiedLocationItem {
  /**
   * name
   */
  n: string;

  /**
   * longitude
   */
  lo: number;

  /**
   * latitude
   */
  la: number;

  /**
   * geohash
   */
  g: string;

  /**
   * an array of RouteIDs
   */
  r: Array<number>;

  /**
   * an array of StopIDs
   */
  s: Array<number>;

  /**
   * an array of vectors
   */
  v: Array<[number, number]>;

  /**
   * an array of addresses
   */
  a: Array<string>;

  /**
   * stopLocationId
   */
  id: number;
}

export type SimplifiedLocation = { [l_id: string]: SimplifiedLocationItem };

export interface MergedLocationItem {
  /**
   * name
   */
  n: string;

  /**
   * longitude
   */
  lo: Array<number>;

  /**
   * latitude
   */
  la: Array<number>;

  /**
   * geohash
   */
  g: Array<string>;

  /**
   * a 2D array of RouteIDs
   */
  r: Array<Array<number>>;

  /**
   * a 2D array of StopIDs
   */
  s: Array<Array<number>>;

  /**
   * a 2D array of vectors
   */
  v: Array<Array<[number, number]>>;

  /**
   * an array of addresses
   */
  a: Array<ParsedAddress>;

  /**
   * an array of stopLocationIds
   */
  id: Array<number>;

  /**
   * the hash of the deduplicated name
   */
  hash: string;
}

export type MergedLocation = { [ml_hash: string]: MergedLocationItem };

export interface IndexedLocationItem {
  /**
   * longitude
   */
  lo: number;

  /**
   * latitude
   */
  la: number;

  /**
   * the hash of the deduplicated name
   */
  hash: string;
}

export type IndexedLocation = { [geohash: string]: Array<IndexedLocationItem> };

let SimplifiedLocationMemoryCache_available: boolean = false;
let SimplifiedLocationMemoryCache_data: SimplifiedLocation = {};
let SimplifiedLocationMemoryCache_timestamp: number = -1;

let MergedLocationMemoryCache_available: boolean = false;
let MergedLocationMemoryCache_data: MergedLocation = {};
let MergedLocationMemoryCache_timestamp: number = -1;

let IndexdedLocationMemoryCache_available: boolean = false;
let IndexdedLocationMemoryCache_data: IndexedLocation = {};
let IndexdedLocationMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 30 * 1000;

async function simplifyLocation(Location: Location): Promise<SimplifiedLocation> {
  const worker = new Worker(new URL('./simplifyLocation-worker.ts', import.meta.url));

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

    worker.postMessage(Location); // Send data to the worker
  })) as SimplifiedLocation;

  return result;
}

async function mergeLocationByName(object: SimplifiedLocation): Promise<MergedLocation> {
  const worker = new Worker(new URL('./mergeLocationByName-worker.ts', import.meta.url));

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

    worker.postMessage(object); // Send data to the worker
  })) as MergedLocation;

  return result;
}

async function indexLocationByGeohash(object: MergedLocation): Promise<IndexedLocation> {
  const worker = new Worker(new URL('./indexLocationByGeohash-worker.ts', import.meta.url));

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

    worker.postMessage(object); // Send data to the worker
  })) as IndexedLocation;

  return result;
}

/**
 * getLocation
 * @param progress
 * @param type 0: simplified, 1: merged, 2: indexed
 * @returns SimplifiedLocation, MergedLocation, or IndexedLocation
 */

export async function getLocation(progress: Progress, type: 0 | 1 | 2): Promise<SimplifiedLocation | MergedLocation | IndexedLocation> {
  async function getData(): Promise<Location> {
    const apis = [
      [0, 11],
      [1, 11]
    ];
    const result: Location = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData)) as APIData<Location>;
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i] as LocationItem);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const cacheType = ['simplified', 'merged', 'indexed'][type];
  const cacheKey = `bus_${cacheType}_location_v3_cache`;
  const now = new Date().getTime();

  if (type === 0 && SimplifiedLocationMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) SimplifiedLocationMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      SimplifiedLocationMemoryCache_data = JSON.parse(cache) as SimplifiedLocation;
      SimplifiedLocationMemoryCache_available = true;
    }
  }

  if (type === 1 && MergedLocationMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) MergedLocationMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      MergedLocationMemoryCache_data = JSON.parse(cache) as MergedLocation;
      MergedLocationMemoryCache_available = true;
    }
  }

  if (type === 2 && IndexdedLocationMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) IndexdedLocationMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      IndexdedLocationMemoryCache_data = JSON.parse(cache) as IndexedLocation;
      IndexdedLocationMemoryCache_available = true;
    }
  }

  if (type === 0 && SimplifiedLocationMemoryCache_available && now - SimplifiedLocationMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return SimplifiedLocationMemoryCache_data;
  }

  if (type === 1 && MergedLocationMemoryCache_available && now - MergedLocationMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return MergedLocationMemoryCache_data;
  }

  if (type === 2 && IndexdedLocationMemoryCache_available && now - IndexdedLocationMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return IndexdedLocationMemoryCache_data;
  }

  switch (type) {
    case 0: {
      const result = await getData();
      const simplifiedResult = await simplifyLocation(result);
      SimplifiedLocationMemoryCache_data = simplifiedResult;
      SimplifiedLocationMemoryCache_available = true;
      SimplifiedLocationMemoryCache_timestamp = now;
      await lfSetItem(0, cacheKey, JSON.stringify(simplifiedResult));
      await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
      return simplifiedResult;
    }
    case 1: {
      const simplifiedResult = (await getLocation(progress, 0)) as SimplifiedLocation;
      const mergedResult = await mergeLocationByName(simplifiedResult);
      MergedLocationMemoryCache_data = mergedResult;
      MergedLocationMemoryCache_available = true;
      MergedLocationMemoryCache_timestamp = now;
      await lfSetItem(0, cacheKey, JSON.stringify(mergedResult));
      await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
      return mergedResult;
    }
    case 2: {
      const mergedResult = (await getLocation(progress, 1)) as MergedLocation;
      const indexedResult = await indexLocationByGeohash(mergedResult);
      IndexdedLocationMemoryCache_data = indexedResult;
      IndexdedLocationMemoryCache_available = true;
      IndexdedLocationMemoryCache_timestamp = now;
      await lfSetItem(0, cacheKey, JSON.stringify(indexedResult));
      await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
      return indexedResult;
    }
  }
}

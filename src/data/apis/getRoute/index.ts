import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface RouteItem {
  /**
   * a numeric identifier associated with the company
   */
  providerId: number;

  /**
   * the name of the company
   */
  providerName: string;

  /**
   * the name of the route in Chinese
   */
  nameZh: string;

  /**
   * the name of the route in English
   */
  nameEn: string;

  /**
   * one of the alternative names of the route in Chinese
   */
  aliasName: string;

  /**
   * a numeric identifier assigned to a bus on this route
   */
  pathAttributeId: number;

  pathAttributeNId: string;

  /**
   * one of the alternative names of the route in Chinese
   */
  pathAttributeName: string;

  /**
   * one of the alternative names in English
   */
  pathAttributeEname: string;

  buildPeriod: '1' | '2' | '3' | '9' | '10';

  /**
   * departure stop name in Chinese
   */
  departureZh: string;

  /**
   * destination stop name in Chinese
   */
  destinationZh: string;

  /**
   * departure stop name in English
   */
  departureEn: string;

  /**
   * destination stop name in English
   */
  destinationEn: string;

  /**
   * time code (hhmm)
   */
  goFirstBusTime: string;

  /**
   * time code (hhmm)
   */
  goLastBusTime: string;

  /**
   * time code (hhmm)
   */
  backFirstBusTime: string;

  /**
   * time code (hhmm)
   */
  backLastBusTime: string;

  /**
   * time code (hhmm or mm)
   */
  offPeakHeadway: string;

  busTimeDesc: string;

  roadMapUrl: string;

  headwayDesc: string;

  holidayGoFirstBusTime: string;

  holidayBackFirstBusTime: string;

  holidayBackLastBusTime: string;

  holidayGoLastBusTime: string;

  holidayBusTimeDesc: string;

  /**
   * number in string
   */
  realSequence: string;

  holidayHeadwayDesc: string;

  holidayOffPeakHeadway: string;

  holidayPeakHeadway: string;

  segmentBufferEn: string;

  ticketPriceDescriptionZh: string;

  ticketPriceDescriptionEn: string;

  peakHeadway: string;

  ttiaPathId: string;

  segmentBufferZh: string;

  distance: string;

  NId: string;

  /**
   * RouteID
   */
  Id: number;

  routeType: string;
}

export type Route = Array<RouteItem>;

export interface SimplifiedRouteItem {
  /**
   * providerId (a numeric identifier associated with the company)
   */
  pd: number;

  /**
   * nameZh (the name of the route in Chinese)
   */
  n: string;

  /**
   * - an array of pathAttributeIds (a list of numeric identifiers assigned to buses on this route)
   */
  pid: Array<number>;

  /**
   * departureZh (departure stop name in Chinese)
   */
  dep: string;

  /**
   * destinationZh (destination stop name in Chinese)
   */
  des: string;

  /**
   * RouteID
   */
  id: number;
}

export type SimplifiedRoute = { [r_id: string]: SimplifiedRouteItem };

let SimplifiedRouteMemoryCache_available: boolean = false;
let SimplifiedRouteMemoryCache_data: SimplifiedRoute = {};
let SimplifiedRouteMemoryCache_timestamp: number = -1;

let RawRouteMemoryCache_available: boolean = false;
let RawRouteMemoryCache_data: Route = [];
let RawRouteMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 1 * 1000;

async function simplifyRoute(Route: Route): Promise<SimplifiedRoute> {
  const worker = new Worker(new URL('./simplifyRoute-worker.ts', import.meta.url));

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

    worker.postMessage(Route); // Send data to the worker
  })) as SimplifiedRoute;

  return result;
}

export async function getRoute(progress: Progress, simplified: boolean = true): Promise<SimplifiedRoute | Route> {
  async function getData(): Promise<Route> {
    const apis = [
      [0, 10],
      [1, 10]
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
        result.push(data.BusInfo[i] as RouteItem);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const cacheType = simplified ? 'simplified' : 'raw';
  const cacheKey = `bus_${cacheType}_route_cache`;
  const now = new Date().getTime();

  if (simplified && SimplifiedRouteMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) SimplifiedRouteMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      SimplifiedRouteMemoryCache_data = JSON.parse(cache);
      SimplifiedRouteMemoryCache_available = true;
    }
  }

  if (!simplified && RawRouteMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) RawRouteMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      RawRouteMemoryCache_data = JSON.parse(cache);
      RawRouteMemoryCache_available = true;
    }
  }

  if (simplified && SimplifiedRouteMemoryCache_available && now - SimplifiedRouteMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return SimplifiedRouteMemoryCache_data;
  }

  if (!simplified && RawRouteMemoryCache_available && now - RawRouteMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return RawRouteMemoryCache_data;
  }

  if (simplified) {
    const result = (await getRoute(progress, false)) as Route;
    const simplifiedResult = await simplifyRoute(result);
    SimplifiedRouteMemoryCache_data = simplifiedResult;
    SimplifiedRouteMemoryCache_available = true;
    SimplifiedRouteMemoryCache_timestamp = now;
    await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
    await lfSetItem(0, cacheKey, JSON.stringify(simplifiedResult));
    return simplifiedResult;
  } else {
    const result = await getData();
    RawRouteMemoryCache_data = result;
    RawRouteMemoryCache_available = true;
    RawRouteMemoryCache_timestamp = now;
    await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
    await lfSetItem(0, cacheKey, JSON.stringify(result));
    return result;
  }
}

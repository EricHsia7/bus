import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';

export interface RouteItem {
  providerId: number;
  providerName: string;
  nameZh: string; // name in Chinese
  nameEn: string; // name in English
  aliasName: string; // another name in Chinese
  pathAttributeId: number;
  pathAttributeNId: string;
  pathAttributeName: string; // another name in Chinese
  pathAttributeEname: string; // another name in English
  buildPeriod: '1' | '2' | '3' | '9' | '10';
  departureZh: string; // departure stop name in Chinese
  destinationZh: string; // destination stop name in Chinese
  departureEn: string; // departure stop name in English
  destinationEn: string; // destination stop name in English
  goFirstBusTime: string; // time code (hhmm)
  goLastBusTime: string;
  backFirstBusTime: string;
  backLastBusTime: string;
  offPeakHeadway: string; // time code (hhmm or mm)
  busTimeDesc: string;
  roadMapUrl: string;
  headwayDesc: string;
  holidayGoFirstBusTime: string;
  holidayBackFirstBusTime: string;
  holidayBackLastBusTime: string;
  holidayGoLastBusTime: string;
  holidayBusTimeDesc: string;
  realSequence: string; // number in string
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
  Id: number; // RouteID
  routeType: string;
}

export type Route = Array<RouteItem>;

export interface SimplifiedRouteItem {
  pd: number;
  n: string;
  pid: Array<number>;
  dep: string;
  des: string;
  id: number;
}

export type SimplifiedRoute = { [key: string]: SimplifiedRouteItem };

let RouteAPIVariableCache_available: boolean = false;
let RouteAPIVariableCache_data: object = {};

async function simplifyRoute(Route: Route): Promise<SimplifiedRoute> {
  const worker = new Worker(new URL('./simplifyRoute-worker.ts', import.meta.url));

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

    worker.postMessage(Route); // Send data to the worker
  });

  return result;
}

export async function getRoute(requestID: string, simplify: boolean = true): Promise<SimplifiedRoute | Route> {
  async function getData() {
    const apis = [
      [0, 10],
      [1, 10]
    ];
    const result = [];
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const data = await fetchData(url, requestID, `getRoute_${api[0]}`, 'json');
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i]);
      }
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }
  if (simplify === false) {
    return await getData();
  }
  const cacheTimeToLive = 60 * 60 * 24 * 1 * 1000;
  const cacheKey = 'bus_route_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const simplified_result = await simplifyRoute(result);
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(simplified_result));
    if (!RouteAPIVariableCache_available) {
      RouteAPIVariableCache_available = true;
      RouteAPIVariableCache_data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      const simplified_result = await simplifyRoute(result);
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(simplified_result));
      if (!RouteAPIVariableCache_available) {
        RouteAPIVariableCache_available = true;
        RouteAPIVariableCache_data = simplified_result;
      }
      return simplified_result;
    } else {
      if (!RouteAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        RouteAPIVariableCache_available = true;
        RouteAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getRoute_0', 0, true);
      setDataReceivingProgress(requestID, 'getRoute_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return RouteAPIVariableCache_data;
    }
  }
}

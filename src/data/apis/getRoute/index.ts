import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader/index';
import { lfSetItem, lfGetItem } from '../../storage/index';

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
    worker.onmessage = function (event) {
      resolve(event.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    };

    worker.onerror = function (event) {
      reject(event.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    };

    worker.postMessage(Route); // Send data to the worker
  });

  return result;
}

export async function getRoute(requestID: string, simplify: boolean = true): Promise<SimplifiedRoute | Route> {
  async function getData() {
    var apis = [
      [0, 10],
      [1, 10]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getRoute_${api.e[0]}`, 'json');
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }
  if (simplify === false) {
    return await getData();
  }
  var cache_time = 60 * 60 * 24 * 1 * 1000;
  var cache_key = 'bus_route_v2_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = await simplifyRoute(result);
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
    if (!RouteAPIVariableCache_available) {
      RouteAPIVariableCache_available = true;
      RouteAPIVariableCache_data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = await simplifyRoute(result);
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
      if (!RouteAPIVariableCache_available) {
        RouteAPIVariableCache_available = true;
        RouteAPIVariableCache_data = simplified_result;
      }
      return simplified_result;
    } else {
      if (!RouteAPIVariableCache_available) {
        var cache = await lfGetItem(0, `${cache_key}`);
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

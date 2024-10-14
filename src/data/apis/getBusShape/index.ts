import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';
import { lfSetItem, lfGetItem } from '../../storage/index';

export interface BusShapeItem {
  UniRouteId: string;
  RouteID: number;
  SubRouteID: number;
  wkt: string; // coordinates of the paths
  utime: string; // update time (YYYY-MM-DD hh:mm:ss)
  GoBack: 0 | 1; // direction of the route
}

export type BusShape = Array<BusShapeItem>;

export interface SimplifiedBusShapeItem {
  r: number;
  c: Array<[number, number]>;
  g: number;
}

export type SimplifiedBusShape = { [key: string]: SimplifiedBusShapeItem };

let BusShapeAPIVariableCache_available: boolean = false;
let BusShapeAPIVariableCache_data: object = {};

async function simplifyBusShape(BusShape: BusShape): Promise<SimplifiedBusShape> {
  const worker = new Worker(new URL('./simplifyBusShape-worker.ts', import.meta.url));

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

    worker.postMessage(BusShape); // Send data to the worker
  });

  return result;
}

export async function getBusShape(requestID: string): Promise<SimplifiedBusShape> {
  async function getData() {
    var apis = [
      [0, 16],
      [1, 16]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getBusShape_${api.e[0]}`, 'json');
      result = result.concat(data);
      setDataUpdateTime(requestID, -1);
    }
    return result;
  }
  var cache_time = 60 * 60 * 24 * 60 * 1000;
  var cache_key = 'bus_bus_shape_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = await simplifyBusShape(result);
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
    if (!BusShapeAPIVariableCache_available) {
      BusShapeAPIVariableCache_available = true;
      BusShapeAPIVariableCache_data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = await simplifyBusShape(result);
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
      if (!BusShapeAPIVariableCache_available) {
        BusShapeAPIVariableCache_available = true;
        BusShapeAPIVariableCache_data = simplified_result;
      }
      return simplified_result;
    } else {
      if (!BusShapeAPIVariableCache_available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        BusShapeAPIVariableCache_available = true;
        BusShapeAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getBusShape_0', 0, true);
      setDataReceivingProgress(requestID, 'getBusShape_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return BusShapeAPIVariableCache_data;
    }
  }
}

import { getAPIURL } from './getURL.ts';
import { fetchData, setDataReceivingProgress } from './loader.ts';
const localforage = require('localforage');

var StopAPIVariableCache = { available: false, data: {} };

function simplifyStop(array: []): object {
  var result = {};
  for (var item of array) {
    var key = `s_${item.Id}`;
    var simplified_item = {};
    simplified_item.seqNo = item.seqNo;
    simplified_item.goBack = item.goBack;
    simplified_item.stopLocationId = item.stopLocationId;
    result[key] = simplified_item;
  }
  return result;
}

export async function getStop(requestID: string): object {
  async function getData() {
    var apis = [
      [0, 11],
      [1, 11]
    ].map((e) => getAPIURL(e[0], e[1], 60 * 60 * 1000));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api, requestID, 'getStop');
      result = result.concat(data.BusInfo);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 30 * 1000;
  var cache_key = 'bus_stop_cache';
  var cached_time = await localforage.getItem(`${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = simplifyStop(result);
    await localforage.setItem(`${cache_key}_timestamp`, new Date().getTime());
    await localforage.setItem(`${cache_key}`, JSON.stringify(simplified_result));
    if (!StopAPIVariableCache.available) {
      StopAPIVariableCache.available = true;
      StopAPIVariableCache.data = simplified_result;
    }
    setDataReceivingProgress(requestID, 'getStop', 0, true);
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = simplifyStop(result);
      await localforage.setItem(`${cache_key}_timestamp`, new Date().getTime());
      await localforage.setItem(`${cache_key}`, JSON.stringify(simplified_result));
      return simplified_result;
    } else {
      if (!StopAPIVariableCache.available) {
        var cache = await localforage.getItem(`${cache_key}`);
        StopAPIVariableCache.available = true;
        StopAPIVariableCache.data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getStop', 0, true);
      return StopAPIVariableCache.data;
    }
  }
}

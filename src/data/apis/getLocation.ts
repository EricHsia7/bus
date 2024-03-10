import { getAPIURL } from './getURL.ts';
import { fetchData, setDataReceivingProgress } from './loader.ts';
import { lfSetItem, lfGetItem } from '../storage/index.ts';

var LocationAPIVariableCache = { available: false, data: {} };

function simplifyLocation(array: []): object {
  var result = {};
  for (var item of array) {
    var key = `l_${item.stopLocationId}`;
    if (!result.hasOwnProperty(key)) {
      var simplified_item = {};
      simplified_item.n = item.nameZh;
      simplified_item.lo = item.longitude;
      simplified_item.la = item.latitude;
      simplified_item.r = [item.routeId];
      simplified_item.s = [item.Id];
      result[key] = simplified_item;
    } else {
      if (!(result[key].r.indexOf(item.routeId) > -1)) {
        result[key].r.push(item.routeId);
      }
      if (!(result[key].s.indexOf(item.Id) > -1)) {
        result[key].s.push(item.Id);
      }
    }
  }
  return result;
}

export async function getLocation(requestID: string): object {
  async function getData() {
    var apis = [
      [0, 11],
      [1, 11]
    ].map((e) => getAPIURL(e[0], e[1], 60 * 60 * 1000));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api, requestID, 'getLocation');
      result = result.concat(data.BusInfo);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 30 * 1000;
  var cache_key = 'bus_location_cache';
  var cached_time = await lfGetItem(`${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = simplifyLocation(result);
    await lfSetItem(`${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(`${cache_key}`, JSON.stringify(simplified_result));
    if (!LocationAPIVariableCache.available) {
      LocationAPIVariableCache.available = true;
      LocationAPIVariableCache.data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = simplifyLocation(result);
      await lfSetItem(`${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(`${cache_key}`, JSON.stringify(simplified_result));
      if (!LocationAPIVariableCache.available) {
        LocationAPIVariableCache.available = true;
        LocationAPIVariableCache.data = simplified_result;
      }
      return simplified_result;
    } else {
      if (!LocationAPIVariableCache.available) {
        var cache = await lfGetItem(`${cache_key}`);
        LocationAPIVariableCache.available = true;
        LocationAPIVariableCache.data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getLocation', 0, true);
      return LocationAPIVariableCache.data;
    }
  }
}

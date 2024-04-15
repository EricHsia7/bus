import { getAPIURL } from './getURL.ts';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from './loader.ts';
import { lfSetItem, lfGetItem } from '../storage/index.ts';

var LocationAPIVariableCache = {
  merged: {
    available: false,
    data: {}
  },
  simplified: {
    available: false,
    data: {}
  }
};

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

function mergeLocationByName(object: object): object {
  var result = {};
  for (var key in Location) {
    var nameKey = `ml_${md5(
      String(Location[key].n)
        .trim()
        .replaceAll(/\(\（\）\)\:\：\~\～/g, '')
    )}`;
    if (!result.hasOwnProperty(nameKey)) {
      result[nameKey] = {
        n: Location[key].n,
        lo: [Location[key].lo],
        la: [Location[key].la],
        r: [Location[key].r],
        s: [Location[key].s],
        id: [parseInt(key.split('_')[1])]
      };
    } else {
      result[nameKey].id.push(parseInt(key.split('_')[1]));
      result[nameKey].r.push(Location[key].r);
      result[nameKey].s.push(Location[key].s);
      result[nameKey].lo.push(Location[key].lo);
      result[nameKey].la.push(Location[key].la);
    }
  }
  return result;
}

export async function getLocation(requestID: string, merged: boolean = false): object {
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

  var cache_time = 60 * 60 * 24 * 30 * 1000;
  var cache_key = `bus_${merged ? 'merged' : 'simplified'}_location_cache`;
  var variable_cache_key = merged ? 'merged' : 'simplified';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var final_result = {};
    var simplified_result = simplifyLocation(result);
    if (merged) {
      var merged_result = mergeLocationByName(simplified_result);
      final_result = merged_result;
    } else {
      final_result = simplified_result;
    }

    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
    if (!LocationAPIVariableCache[variable_cache_key].available) {
      LocationAPIVariableCache[variable_cache_key].available = true;
      LocationAPIVariableCache[variable_cache_key].data = final_result;
    }
    return final_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var final_result = {};
      var simplified_result = simplifyLocation(result);
      if (merged) {
        var merged_result = mergeLocationByName(simplified_result);
        final_result = merged_result;
      } else {
        final_result = simplified_result;
      }

      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
      if (!LocationAPIVariableCache[variable_cache_key].available) {
        LocationAPIVariableCache[variable_cache_key].available = true;
        LocationAPIVariableCache[variable_cache_key].data = final_result;
      }
      return final_result;
    } else {
      if (!LocationAPIVariableCache[variable_cache_key].available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        LocationAPIVariableCache[variable_cache_key].available = true;
        LocationAPIVariableCache[variable_cache_key].data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getLocation_0', 0, true);
      setDataReceivingProgress(requestID, 'getLocation_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return LocationAPIVariableCache[variable_cache_key].data;
    }
  }
}

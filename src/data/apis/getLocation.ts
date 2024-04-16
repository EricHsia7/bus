import { getAPIURL } from './getURL.ts';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from './loader.ts';
import { lfSetItem, lfGetItem } from '../storage/index.ts';
import { md5 } from '../../tools/index.ts';

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
      simplified_item.a = [item.address];
      result[key] = simplified_item;
    } else {
      if (!(result[key].r.indexOf(item.routeId) > -1)) {
        result[key].r.push(item.routeId);
      }
      if (!(result[key].s.indexOf(item.Id) > -1)) {
        result[key].s.push(item.Id);
      }
      simplified_item.a.push(item.address);
    }
  }
  return result;
}

function mergeLocationByName(object: object): object {
  var result = {};
  for (var key in object) {
    var nameKey = `ml_${md5(
      String(object[key].n)
        .trim()
        .replaceAll(/[\(\（\）\)\:\：\~\～]*/gim, '')
    )}`;
    if (!result.hasOwnProperty(nameKey)) {
      result[nameKey] = {
        n: object[key].n,
        lo: [object[key].lo],
        la: [object[key].la],
        r: [object[key].r],
        s: [object[key].s],
        a: [object[key].a],
        id: [parseInt(key.split('_')[1])]
      };
    } else {
      result[nameKey].id.push(parseInt(key.split('_')[1]));
      result[nameKey].r.push(object[key].r);
      result[nameKey].s.push(object[key].s);
      result[nameKey].lo.push(object[key].lo);
      result[nameKey].la.push(object[key].la);
      result[nameKey].a.push(object[key].a);
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
  var cache_type = merged ? 'merged' : 'simplified';
  var cache_key = `bus_${cache_type}_location_v2_cache`;
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
    if (!LocationAPIVariableCache[cache_type].available) {
      LocationAPIVariableCache[cache_type].available = true;
      LocationAPIVariableCache[cache_type].data = final_result;
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
      if (!LocationAPIVariableCache[cache_type].available) {
        LocationAPIVariableCache[cache_type].available = true;
        LocationAPIVariableCache[cache_type].data = final_result;
      }
      return final_result;
    } else {
      if (!LocationAPIVariableCache[cache_type].available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        LocationAPIVariableCache[cache_type].available = true;
        LocationAPIVariableCache[cache_type].data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getLocation_0', 0, true);
      setDataReceivingProgress(requestID, 'getLocation_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return LocationAPIVariableCache[cache_type].data;
    }
  }
}

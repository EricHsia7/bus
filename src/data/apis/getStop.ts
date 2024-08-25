import { getAPIURL } from './getURL';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from './loader';
import { lfSetItem, lfGetItem } from '../storage/index';
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
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getStop_${api.e[0]}`);
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 30 * 1000;
  var cache_key = 'bus_stop_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = simplifyStop(result);
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
    if (!StopAPIVariableCache.available) {
      StopAPIVariableCache.available = true;
      StopAPIVariableCache.data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = simplifyStop(result);
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
      return simplified_result;
    } else {
      if (!StopAPIVariableCache.available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        StopAPIVariableCache.available = true;
        StopAPIVariableCache.data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getStop_0', 0, true);
      setDataReceivingProgress(requestID, 'getStop_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return StopAPIVariableCache.data;
    }
  }
}

import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';
import { lfSetItem, lfGetItem } from '../../storage/index';

let TimetableAPIVariableCache_available: boolean = false;
let TimetableAPIVariableCache_data: object = {};

export async function getTimeTable(requestID: string): Promise<object> {
  async function getData() {
    var apis = [
      [0, 14],
      [1, 14]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getTimeTable_${api.e[0]}`);
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 14 * 1000;
  var cache_key = 'bus_timetable_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(result));
    if (!TimetableAPIVariableCache_available) {
      TimetableAPIVariableCache_available = true;
      TimetableAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(result));
      return result;
    } else {
      if (!TimetableAPIVariableCache_available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        TimetableAPIVariableCache_available = true;
        TimetableAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getTimeTable_0', 0, true);
      setDataReceivingProgress(requestID, 'getTimeTable_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return TimetableAPIVariableCache_data;
    }
  }
}

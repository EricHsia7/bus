import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';

let TimetableAPIVariableCache_available: boolean = false;
let TimetableAPIVariableCache_data: object = {};

export async function getTimeTable(requestID: string): Promise<object> {
  async function getData() {
    const apis = [
      [0, 14],
      [1, 14]
    ];
    const result = [];
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const data = await fetchData(url, requestID, `getTimeTable_${api[0]}`, 'json');
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i]);
      }
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime, -480);
    }
    return result;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 14 * 1000;
  const cacheKey = 'bus_timetable_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(result));
    if (!TimetableAPIVariableCache_available) {
      TimetableAPIVariableCache_available = true;
      TimetableAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(result));
      return result;
    } else {
      if (!TimetableAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
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

import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';

let SemiTimetableAPIVariableCache_available: boolean = false;
let SemiTimetableAPIVariableCache_data: object = {};

export async function getSemiTimeTable(requestID: string): Promise<object> {
  async function getData() {
    const apis = [
      [0, 12],
      [1, 12]
    ];
    const result = [];
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const data = await fetchData(url, requestID, `getSemiTimeTable_${api[0]}`, 'json');
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i]);
      }
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 14 * 1000;
  const cacheKey = 'bus_semi_timetable_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(result));
    if (!SemiTimetableAPIVariableCache_available) {
      SemiTimetableAPIVariableCache_available = true;
      SemiTimetableAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(result));
      return result;
    } else {
      if (!SemiTimetableAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        SemiTimetableAPIVariableCache_available = true;
        SemiTimetableAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getSemiTimeTable_0', 0, true);
      setDataReceivingProgress(requestID, 'getSemiTimeTable_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return SemiTimetableAPIVariableCache_data;
    }
  }
}

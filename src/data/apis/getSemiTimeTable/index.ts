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
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    let result = [];
    for (const api of apis) {
      const data = await fetchData(api.url, requestID, `getSemiTimeTable_${api.e[0]}`, 'json');
      result = result.concat(data.BusInfo);
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

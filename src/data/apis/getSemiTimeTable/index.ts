import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface SemiTimetableItem {
  Id: number;

  PathAttributeId: number;

  /**
   * hhmm
   */
  StartTime: string;

  /**
   * hhmm
   */
  EndTime: string;

  /**
   * - shorter duration in minutes
   * - it's actually the low headway in general
   * - "long" must be interpreted as "high frequency" in this case or the name is confused
   */
  LongHeadway: string;

  /**
   * - longer duration in minutes
   * - it's actually the long headway in general
   * - "low" must be interpreted as "low frequency" in this case or the name is confused
   */
  LowHeadway: string;

  /**
   * the type of DateValue
   * - 0: weekday index
   * - 1: specific date
   */
  DateType: '0' | '1';

  /**
   * DateType == 0
   * - 1: Sun
   * - 2: Mon
   * - 3: Tue
   * - 4: Wed
   * - 5: Thu
   * - 6: Fri
   * - 7: Sat
   *
   * DateType == 1
   * - yyyymmdd (UTC+8)
   */
  DateValue: string;
}

export type SemiTimeTable = Array<SemiTimetableItem>;

let SemiTimetableMemoryCache_available: boolean = false;
let SemiTimetableMemoryCache_data: SemiTimeTable = [];
let SemiTimetableMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 14 * 1000;
const cacheKey = 'bus_semi_timetable_cache';

export async function getSemiTimeTable(progress: Progress): Promise<SemiTimeTable> {
  async function getData() {
    const apis = [
      [0, 12],
      [1, 12]
    ];
    const result: SemiTimeTable = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData));
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i] as SemiTimetableItem);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const now = new Date().getTime();

  if (SemiTimetableMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) SemiTimetableMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      SemiTimetableMemoryCache_data = JSON.parse(cache);
      SemiTimetableMemoryCache_available = true;
    }
  }

  if (SemiTimetableMemoryCache_available && now - SemiTimetableMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return SemiTimetableMemoryCache_data;
  }

  const result = await getData();
  SemiTimetableMemoryCache_data = result;
  SemiTimetableMemoryCache_available = true;
  SemiTimetableMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(result));
  return result;
}

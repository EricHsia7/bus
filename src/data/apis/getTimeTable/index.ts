import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface TimetableItem {
  Id: number;

  PathAttributeId: number;

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

  /**
   * hhmm
   */
  DepartureTime: string;

  /**
   * - 0: false
   * - 1: true
   */
  IsLastBus: string;
}

export type Timetable = Array<TimetableItem>;

let TimetableMemoryCache_available: boolean = false;
let TimetableMemoryCache_data: Timetable = [];
let TimetableMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 14 * 1000;
const cacheKey = 'bus_timetable_cache';

export async function getTimeTable(progress: Progress): Promise<Timetable> {
  async function getData(): Promise<Timetable> {
    const apis = [
      [0, 14],
      [1, 14]
    ];
    const result = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData));
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i] as TimetableItem);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const now = new Date().getTime();

  if (TimetableMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) TimetableMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      TimetableMemoryCache_data = JSON.parse(cache);
      TimetableMemoryCache_available = true;
    }
  }

  if (TimetableMemoryCache_available && now - TimetableMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return TimetableMemoryCache_data;
  }

  const result = await getData();
  TimetableMemoryCache_data = result;
  TimetableMemoryCache_available = true;
  TimetableMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(result));
  return result;
}

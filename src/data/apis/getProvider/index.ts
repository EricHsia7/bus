import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface ProviderItem {
  id: number;
  nameZn: string; // name in Chinese (Zhōngwén)
  nameEn: string; // name in English
  email: string;
  phoneInfo: string;
  stationId: string;
  stationNameZn: string;
  stationNameEn: string;
  type: '0' | '1' | '2' | '3' | '4' | '5'; // 0: city bus station, 1: coach bus station, 2: MRT station, 3: train station, 4: airport, 5: port
}

export type Provider = Array<ProviderItem>;

let ProviderMemoryCache_available: boolean = false;
let ProviderMemoryCache_data: Provider = [];
let ProviderMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 60 * 1000;
const cacheKey = 'bus_provider_cache';

export async function getProvider(progress: Progress): Promise<Provider> {
  async function getData(): Promise<Provider> {
    const apis = [
      [0, 9],
      [1, 9]
    ];
    const result: Provider = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData));
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i] as ProviderItem);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const now = new Date().getTime();

  if (ProviderMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) ProviderMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      ProviderMemoryCache_data = JSON.parse(cache) as Provider;
      ProviderMemoryCache_available = true;
    }
  }

  if (ProviderMemoryCache_available && now - ProviderMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    return ProviderMemoryCache_data;
  }

  const result = await getData();
  ProviderMemoryCache_data = result;
  ProviderMemoryCache_available = true;
  ProviderMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(result));
  return result;
}

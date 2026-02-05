import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';

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

let ProviderAPIVariableCache_available: boolean = false;
let ProviderAPIVariableCache_data: object = {};

export async function getProvider(requestID: string): Promise<Provider> {
  async function getData() {
    const apis = [
      [0, 9],
      [1, 9]
    ];
    const result = [];
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const data = await fetchData(url, requestID, `getProvider_${api[0]}`, 'json');
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i]);
      }
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime, -480);
    }
    return result;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 60 * 1000;
  const cacheKey = 'bus_provider_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(result));
    if (!ProviderAPIVariableCache_available) {
      ProviderAPIVariableCache_available = true;
      ProviderAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(result));
      return result;
    } else {
      if (!ProviderAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        ProviderAPIVariableCache_available = true;
        ProviderAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getProvider_0', 0, true);
      setDataReceivingProgress(requestID, 'getProvider_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return ProviderAPIVariableCache_data;
    }
  }
}

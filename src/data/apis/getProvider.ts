import { getAPIURL } from './getAPIURL';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from './loader';
import { lfSetItem, lfGetItem } from '../storage/index';

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
    var apis = [
      [0, 9],
      [1, 9]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getProvider_${api.e[0]}`);
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 60 * 1000;
  var cache_key = 'bus_provider_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(result));
    if (!ProviderAPIVariableCache_available) {
      ProviderAPIVariableCache_available = true;
      ProviderAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(result));
      return result;
    } else {
      if (!ProviderAPIVariableCache_available) {
        var cache = await lfGetItem(0, `${cache_key}`);
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

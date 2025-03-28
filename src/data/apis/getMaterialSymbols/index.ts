import { fetchData, setDataReceivingProgress } from '../loader';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';

let MaterialSymbolsAPIVariableCache_available: boolean = false;
let MaterialSymbolsAPIVariableCache_data: Array<string> = [];

export async function getMaterialSymbols(requestID: string): Promise<Array<string>> {
  async function getData() {
    var apiurl = getMaterialSymbolsAPIURL();
    var data = await fetchData(apiurl, requestID, 'getMaterialSymbols', 'json');
    var result = data.list.split(',');
    return result;
  }

  var cache_time: number = 60 * 60 * 24 * 30 * 1000;
  var cache_key = `bus_material_symbols_cache`;
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    const result = await getData();
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, result.join(','));
    if (!MaterialSymbolsAPIVariableCache_available) {
      MaterialSymbolsAPIVariableCache_available = true;
      MaterialSymbolsAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      const result = await getData();
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, result.join(','));
      if (!MaterialSymbolsAPIVariableCache_available) {
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = result;
      }
      return result;
    } else {
      if (!MaterialSymbolsAPIVariableCache_available) {
        const cache = await lfGetItem(0, `${cache_key}`);
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = cache.split(',');
      }
      setDataReceivingProgress(requestID, 'getMaterialSymbols', 0, true);
      return MaterialSymbolsAPIVariableCache_data;
    }
  }
}

import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress } from '../loader';

let MaterialSymbolsAPIVariableCache_available: boolean = false;
let MaterialSymbolsAPIVariableCache_data: Array<string> = [];

export async function getMaterialSymbols(requestID: string): Promise<Array<string>> {
  async function getData() {
    const apiurl = getMaterialSymbolsAPIURL();
    const data = await fetchData(apiurl, requestID, 'getMaterialSymbols', 'json');
    const result = data.list.split(',');
    return result;
  }

  const cacheTimeToLive: number = 60 * 60 * 24 * 30 * 1000;
  const cacheKey = `bus_material_symbols_cache`;
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cacheKey}`, result.join(','));
    if (!MaterialSymbolsAPIVariableCache_available) {
      MaterialSymbolsAPIVariableCache_available = true;
      MaterialSymbolsAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cacheKey}`, result.join(','));
      if (!MaterialSymbolsAPIVariableCache_available) {
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = result;
      }
      return result;
    } else {
      if (!MaterialSymbolsAPIVariableCache_available) {
        const cache = await lfGetItem(0, `${cacheKey}`);
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = cache.split(',');
      }
      setDataReceivingProgress(requestID, 'getMaterialSymbols', 0, true);
      return MaterialSymbolsAPIVariableCache_data;
    }
  }
}

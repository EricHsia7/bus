import { MaterialSymbols } from '../../../interface/icons/material-symbols-type';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress } from '../loader';

let MaterialSymbolsAPIVariableCache_available: boolean = false;
let MaterialSymbolsAPIVariableCache_data: Array<string> = [];

export interface MaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbol: MaterialSymbols]: Array<number> };
}

export async function getMaterialSymbolsSearchIndex(requestID: string): Promise<MaterialSymbolsSearchIndex> {
  async function getData() {
    const apiurl = getMaterialSymbolsAPIURL();
    const data = await fetchData(apiurl, requestID, 'getMaterialSymbolsSearchIndex', 'json');
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'bus_material_symbols_search_index_v2_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(result));
    if (!MaterialSymbolsAPIVariableCache_available) {
      MaterialSymbolsAPIVariableCache_available = true;
      MaterialSymbolsAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(result));
      if (!MaterialSymbolsAPIVariableCache_available) {
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = result;
      }
      return result;
    } else {
      if (!MaterialSymbolsAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = JSON.parse(cache)
      }
      setDataReceivingProgress(requestID, 'getMaterialSymbolsSearchIndex', 0, true);
      return MaterialSymbolsAPIVariableCache_data;
    }
  }
}

import { MaterialSymbols } from '../../../interface/icons/material-symbols-type';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress } from '../loader';

interface MaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbolKey: string]: Array<number> };
}

export interface UnpackedMaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbol: MaterialSymbols]: Array<number> };
}

let MaterialSymbolsAPIVariableCache_available: boolean = false;
let MaterialSymbolsAPIVariableCache_data: UnpackedMaterialSymbolsSearchIndex = [];

function unpackMaterialSymbolsSearchIndex(data: MaterialSymbolsSearchIndex): UnpackedMaterialSymbolsSearchIndex {
  const dictionary = data.dictionary.split(',');
  for (const symbolKey in data.symbols) {
    const symbolNameComponents = symbolKey.split('_');
    for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
      symbolNameComponents.splice(i, 1, dictionary[parseInt(symbolNameComponents[i])]);
    }
    data.symbols[symbolNameComponents.join('_')] = data.symbols[symbolKey];
    delete data.symbols[symbolKey];
  }

  return data as UnpackedMaterialSymbolsSearchIndex;
}

export async function getMaterialSymbolsSearchIndex(requestID: string): Promise<UnpackedMaterialSymbolsSearchIndex> {
  async function getData() {
    const apiurl = getMaterialSymbolsAPIURL();
    const data = await fetchData(apiurl, requestID, 'getMaterialSymbolsSearchIndex', 'json');
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'bus_material_symbols_search_index_v4_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const unpacked = unpackMaterialSymbolsSearchIndex(result);
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
    if (!MaterialSymbolsAPIVariableCache_available) {
      MaterialSymbolsAPIVariableCache_available = true;
      MaterialSymbolsAPIVariableCache_data = unpacked;
    }
    return unpacked;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      const unpacked = unpackMaterialSymbolsSearchIndex(result);
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
      if (!MaterialSymbolsAPIVariableCache_available) {
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = unpacked;
      }
      return unpacked;
    } else {
      if (!MaterialSymbolsAPIVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getMaterialSymbolsSearchIndex', 0, true);
      return MaterialSymbolsAPIVariableCache_data;
    }
  }
}

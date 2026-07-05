import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate, LoaderMessageProgress, setDataReceivingProgress } from '../loader';

interface MaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbolKey: string]: string };
}

export interface UnpackedMaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbol: string]: Array<number> };
}

let MaterialSymbolsSearchIndexVariableCache_available: boolean = false;
let MaterialSymbolsSearchIndexVariableCache_data = {} as UnpackedMaterialSymbolsSearchIndex;

function unpackMaterialSymbolsSearchIndex(data: MaterialSymbolsSearchIndex): UnpackedMaterialSymbolsSearchIndex {
  const unpackedData: UnpackedMaterialSymbolsSearchIndex = {
    dictionary: data.dictionary,
    symbols: {}
  };
  const dictionary = data.dictionary.split(',');
  for (const symbolKey in data.symbols) {
    const symbolNameComponents = symbolKey.split('_');
    for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
      symbolNameComponents.splice(i, 1, dictionary[parseInt(symbolNameComponents[i], 36)]);
    }
    unpackedData.symbols[symbolNameComponents.join('_')] = data.symbols[symbolKey].split(',').map((k) => parseInt(k, 36));
  }
  return unpackedData;
}

export async function getMaterialSymbolsSearchIndex(requestID: string): Promise<UnpackedMaterialSymbolsSearchIndex> {
  async function getData(): Promise<MaterialSymbolsSearchIndex> {
    const apiurl = getMaterialSymbolsAPIURL(0);
    const decoder = new TextDecoder();
    const inflatedData = await fetchInflate(apiurl, function (message: LoaderMessageProgress) {
      setDataReceivingProgress(requestID, 'getMaterialSymbolsSearchIndex', message.percent, false);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as MaterialSymbolsSearchIndex;
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'bus_material_symbols_search_index_v6_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const unpacked = unpackMaterialSymbolsSearchIndex(result);
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
    if (!MaterialSymbolsSearchIndexVariableCache_available) {
      MaterialSymbolsSearchIndexVariableCache_available = true;
      MaterialSymbolsSearchIndexVariableCache_data = unpacked;
    }
    return unpacked;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp, 10) > cacheTimeToLive) {
      const result = await getData();
      const unpacked = unpackMaterialSymbolsSearchIndex(result);
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
      if (!MaterialSymbolsSearchIndexVariableCache_available) {
        MaterialSymbolsSearchIndexVariableCache_available = true;
        MaterialSymbolsSearchIndexVariableCache_data = unpacked;
      }
      return unpacked;
    } else {
      if (!MaterialSymbolsSearchIndexVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        MaterialSymbolsSearchIndexVariableCache_available = true;
        MaterialSymbolsSearchIndexVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getMaterialSymbolsSearchIndex', 0, true);
      return MaterialSymbolsSearchIndexVariableCache_data;
    }
  }
}

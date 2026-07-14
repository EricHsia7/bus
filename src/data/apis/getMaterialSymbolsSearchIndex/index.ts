import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

interface MaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbolKey: string]: string };
}

export interface UnpackedMaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbol: string]: Array<number> };
}

let MaterialSymbolsSearchIndexMemoryCache_available: boolean = false;
let MaterialSymbolsSearchIndexMemoryCache_data = {} as UnpackedMaterialSymbolsSearchIndex;
let MaterialSymbolsSearchIndexMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
const cacheKey = 'bus_material_symbols_search_index_v6_cache';

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

export async function getMaterialSymbolsSearchIndex(progress: Progress): Promise<UnpackedMaterialSymbolsSearchIndex> {
  async function getData(): Promise<MaterialSymbolsSearchIndex> {
    const apiurl = getMaterialSymbolsAPIURL(0);
    const decoder = new TextDecoder();
    const sourceId = progress.listen();
    const inflatedData = await fetchInflate(apiurl, function (message) {
      progress.update(sourceId, message.loaded, message.total);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as MaterialSymbolsSearchIndex;
    return data;
  }

  const now = new Date().getTime();

  if (MaterialSymbolsSearchIndexMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) MaterialSymbolsSearchIndexMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      MaterialSymbolsSearchIndexMemoryCache_data = JSON.parse(cache) as UnpackedMaterialSymbolsSearchIndex;
      MaterialSymbolsSearchIndexMemoryCache_available = true;
    }
  }

  if (MaterialSymbolsSearchIndexMemoryCache_available && now - MaterialSymbolsSearchIndexMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    return MaterialSymbolsSearchIndexMemoryCache_data;
  }

  const result = await getData();
  const unpacked = unpackMaterialSymbolsSearchIndex(result);
  MaterialSymbolsSearchIndexMemoryCache_data = unpacked;
  MaterialSymbolsSearchIndexMemoryCache_available = true;
  MaterialSymbolsSearchIndexMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
  return unpacked;
}

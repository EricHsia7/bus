import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

/**
 * a stringified array of symbol names
 */
export type MaterialSymbolsSimilaritySymbols = string;

/**
 * a base-36 index that represents the location of the symbol name in symbols
 */
export type MaterialSymbolsSimilaritySimilarityKey = string;

/**
 * a stringified array of base-36 indices, where indices represent the location of the symbol name in symbols
 */
export type MaterialSymbolsSimilaritySimilaritySymbols = string;

export type MaterialSymbolsSimilaritySimilarity = Record<MaterialSymbolsSimilaritySimilarityKey, MaterialSymbolsSimilaritySimilaritySymbols>;

export interface MaterialSymbolsSimilarity {
  symbols: MaterialSymbolsSimilaritySymbols;
  similarity: MaterialSymbolsSimilaritySimilarity;
}

export type UnpackedMaterialSymbolsSimilaritySymbols = string;

/**
 * Symbol identifier
 */
export type UnpackedMaterialSymbolsSimilaritySimilarityKey = string;

export type UnpackedMaterialSymbolsSimilaritySimilaritySymbols = Array<number>;

export type UnpackedMaterialSymbolsSimilaritySimilarity = Record<UnpackedMaterialSymbolsSimilaritySimilarityKey, UnpackedMaterialSymbolsSimilaritySimilaritySymbols>;

export interface UnpackedMaterialSymbolsSimilarity {
  symbols: UnpackedMaterialSymbolsSimilaritySymbols;
  similarity: UnpackedMaterialSymbolsSimilaritySimilarity;
}

let MaterialSymbolsSimilarityMemoryCache_available: boolean = false;
let MaterialSymbolsSimilarityMemoryCache_data = {} as UnpackedMaterialSymbolsSimilarity;
let MaterialSymbolsSimilarityMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
const cacheKey = 'bus_material_symbols_similarity_cache';

function unpackMaterialSymbolsSimilarity(data: MaterialSymbolsSimilarity): UnpackedMaterialSymbolsSimilarity {
  const unpackedData: UnpackedMaterialSymbolsSimilarity = {
    symbols: data.symbols,
    similarity: {}
  };

  const symbols = data.symbols.split(',');
  for (const key in data.similarity) {
    const symbolName = symbols[parseInt(key, 36)];
    const indices: Array<any> = data.similarity[key].split(',');
    for (let i = indices.length - 1; i >= 0; i--) {
      indices.splice(i, 1, parseInt(indices[i], 36));
    }
    unpackedData.similarity[symbolName] = indices as Array<number>;
  }

  return unpackedData;
}

export async function getMaterialSymbolsSimilarity(progress: Progress): Promise<UnpackedMaterialSymbolsSimilarity> {
  async function getData(): Promise<MaterialSymbolsSimilarity> {
    const apiurl = getMaterialSymbolsAPIURL(2);
    const decoder = new TextDecoder();
    const sourceId = progress.listen();
    const inflatedData = await fetchInflate(apiurl, function (message) {
      progress.update(sourceId, message.loaded, message.total);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as MaterialSymbolsSimilarity;
    return data;
  }

  const now = new Date().getTime();

  if (MaterialSymbolsSimilarityMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) MaterialSymbolsSimilarityMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      MaterialSymbolsSimilarityMemoryCache_data = JSON.parse(cache) as UnpackedMaterialSymbolsSimilarity;
      MaterialSymbolsSimilarityMemoryCache_available = true;
    }
  }

  if (MaterialSymbolsSimilarityMemoryCache_available && now - MaterialSymbolsSimilarityMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    return MaterialSymbolsSimilarityMemoryCache_data;
  }

  const result = await getData();
  const unpacked = unpackMaterialSymbolsSimilarity(result);
  MaterialSymbolsSimilarityMemoryCache_data = unpacked;
  MaterialSymbolsSimilarityMemoryCache_available = true;
  MaterialSymbolsSimilarityMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
  return unpacked;
}

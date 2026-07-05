import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate, setDataReceivingProgress } from '../loader';

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

let MaterialSymbolsSimilarityVariableCache_available: boolean = false;
let MaterialSymbolsSimilarityVariableCache_data = {} as UnpackedMaterialSymbolsSimilarity;

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

export async function getMaterialSymbolsSimilarity(requestID: string): Promise<UnpackedMaterialSymbolsSimilarity> {
  async function getData(): Promise<MaterialSymbolsSimilarity> {
    const apiurl = getMaterialSymbolsAPIURL(2);
    const decoder = new TextDecoder();
    const inflatedData = await fetchInflate(apiurl, function (message) {
      setDataReceivingProgress(requestID, 'getMaterialSymbolsSimilarity', message.percent, false);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as MaterialSymbolsSimilarity;
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'bus_material_symbols_similarity_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const unpacked = unpackMaterialSymbolsSimilarity(result);
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
    if (!MaterialSymbolsSimilarityVariableCache_available) {
      MaterialSymbolsSimilarityVariableCache_available = true;
      MaterialSymbolsSimilarityVariableCache_data = unpacked;
    }
    return unpacked;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp, 10) > cacheTimeToLive) {
      const result = await getData();
      const unpacked = unpackMaterialSymbolsSimilarity(result);
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
      if (!MaterialSymbolsSimilarityVariableCache_available) {
        MaterialSymbolsSimilarityVariableCache_available = true;
        MaterialSymbolsSimilarityVariableCache_data = unpacked;
      }
      return unpacked;
    } else {
      if (!MaterialSymbolsSimilarityVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        MaterialSymbolsSimilarityVariableCache_available = true;
        MaterialSymbolsSimilarityVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getMaterialSymbolsSimilarity', 0, true);
      return MaterialSymbolsSimilarityVariableCache_data;
    }
  }
}

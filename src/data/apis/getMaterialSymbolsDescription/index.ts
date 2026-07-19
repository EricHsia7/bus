import { Progress } from '../../../tools/progress';
import { joinByDelimiters, splitByDelimiter } from '../../../tools/text';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export type MaterialSymbolsDescriptionSymbolKey = string;

export type MaterialSymbolsDescriptionSymbolDescription = string;

/**
 * Encoded descriptions
 */
export type MaterialSymbolsDescriptionSymbols = Record<MaterialSymbolsDescriptionSymbolKey, MaterialSymbolsDescriptionSymbolDescription>;

export interface MaterialSymbolsDescription {
  /**
   * a stringified array of words (word_1,word_2,word_3,...)
   */
  dictionary: string;

  /**
   * an array of delimiters
   */
  delimiters: Array<string>;
  descriptions: MaterialSymbolsDescriptionSymbols;
}

/**
 * Symbol identifier
 */
export type UnpackedMaterialSymbolsDescriptionSymbolKey = string;

/**
 * Description in plaintext
 */
export type UnpackedMaterialSymbolsDescriptionSymbolDescription = string;

export type UnpackedMaterialSymbolsDescription = Record<UnpackedMaterialSymbolsDescriptionSymbolKey, UnpackedMaterialSymbolsDescriptionSymbolDescription>;

let MaterialSymbolsDescriptionMemoryCache_available: boolean = false;
let MaterialSymbolsDescriptionMemoryCache_data = {} as UnpackedMaterialSymbolsDescription;
let MaterialSymbolsDescriptionMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
const cacheKey = 'bus_material_symbols_description_v2_cache';

function unpackMaterialSymbolsDescription(data: MaterialSymbolsDescription): UnpackedMaterialSymbolsDescription {
  const unpackedData: UnpackedMaterialSymbolsDescription = {};
  const dictionary = data.dictionary.split(',');
  for (const key in data.descriptions) {
    const symbolNameComponents = key.split('_');
    for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
      symbolNameComponents.splice(i, 1, dictionary[parseInt(symbolNameComponents[i], 36)]);
    }

    const { result, delimiters } = splitByDelimiter(data.descriptions[key], data.delimiters);
    for (let i = result.length - 1; i >= 0; i--) {
      result.splice(i, 1, dictionary[parseInt(result[i], 36)]);
    }

    unpackedData[symbolNameComponents.join('_')] = joinByDelimiters(result, delimiters);
  }

  return unpackedData;
}

export async function getMaterialSymbolsDescription(progress: Progress): Promise<UnpackedMaterialSymbolsDescription> {
  async function getData(): Promise<MaterialSymbolsDescription> {
    const apiurl = getMaterialSymbolsAPIURL(1);
    const decoder = new TextDecoder();
    const sourceId = progress.listen();
    const inflatedData = await fetchInflate(apiurl, function (message) {
      progress.update(sourceId, message.loaded, message.total);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as MaterialSymbolsDescription;
    return data;
  }

  const now = new Date().getTime();

  if (MaterialSymbolsDescriptionMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) MaterialSymbolsDescriptionMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      MaterialSymbolsDescriptionMemoryCache_data = JSON.parse(cache) as UnpackedMaterialSymbolsDescription;
      MaterialSymbolsDescriptionMemoryCache_available = true;
    }
  }

  if (MaterialSymbolsDescriptionMemoryCache_available && now - MaterialSymbolsDescriptionMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    return MaterialSymbolsDescriptionMemoryCache_data;
  }

  const result = await getData();
  const unpackedResult = unpackMaterialSymbolsDescription(result);
  MaterialSymbolsDescriptionMemoryCache_data = unpackedResult;
  MaterialSymbolsDescriptionMemoryCache_available = true;
  MaterialSymbolsDescriptionMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(unpackedResult));
  return unpackedResult;
}

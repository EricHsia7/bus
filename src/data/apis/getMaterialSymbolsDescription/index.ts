import { joinByDelimiters, splitByDelimiter } from '../../../tools/text';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate, LoaderMessageProgress, setDataReceivingProgress } from '../loader';

/**
 * a stringified array of words (word_1,word_2,word_3,...)
 */
export type MaterialSymbolsDescriptionDictionary = string;

export type MaterialSymbolsDescriptionDelimiters = Array<string>;

export type MaterialSymbolsDescriptionSymbolKey = string;

export type MaterialSymbolsDescriptionSymbolDescription = string;

export type MaterialSymbolsDescriptionSymbols = Record<MaterialSymbolsDescriptionSymbolKey, MaterialSymbolsDescriptionSymbolDescription>;

export interface MaterialSymbolsDescription {
  dictionary: MaterialSymbolsDescriptionDictionary;
  delimiters: MaterialSymbolsDescriptionDelimiters;
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

let MaterialSymbolsDescriptionVariableCache_available: boolean = false;
let MaterialSymbolsDescriptionVariableCache_data = {} as UnpackedMaterialSymbolsDescription;

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

export async function getMaterialSymbolsDescription(requestID: string): Promise<UnpackedMaterialSymbolsDescription> {
  async function getData(): Promise<MaterialSymbolsDescription> {
    const apiurl = getMaterialSymbolsAPIURL(1);
    const decoder = new TextDecoder();
    const inflatedData = await fetchInflate(apiurl, function (message: LoaderMessageProgress) {
      setDataReceivingProgress(requestID, 'getMaterialSymbolsDescription', message.percent, false);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as MaterialSymbolsDescription;
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'bus_material_symbols_description_v2_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const unpacked = unpackMaterialSymbolsDescription(result);
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
    if (!MaterialSymbolsDescriptionVariableCache_available) {
      MaterialSymbolsDescriptionVariableCache_available = true;
      MaterialSymbolsDescriptionVariableCache_data = unpacked;
    }
    return unpacked;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp, 10) > cacheTimeToLive) {
      const result = await getData();
      const unpacked = unpackMaterialSymbolsDescription(result);
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(unpacked));
      if (!MaterialSymbolsDescriptionVariableCache_available) {
        MaterialSymbolsDescriptionVariableCache_available = true;
        MaterialSymbolsDescriptionVariableCache_data = unpacked;
      }
      return unpacked;
    } else {
      if (!MaterialSymbolsDescriptionVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        MaterialSymbolsDescriptionVariableCache_available = true;
        MaterialSymbolsDescriptionVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getMaterialSymbolsDescription', 0, true);
      return MaterialSymbolsDescriptionVariableCache_data;
    }
  }
}

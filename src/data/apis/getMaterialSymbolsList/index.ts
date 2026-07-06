import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface MaterialSymbolsList {
  list: string;
}

export type UnpackedMaterialSymbolsList = Array<string>;

let MaterialSymbolsListVariableCache_available: boolean = false;
let MaterialSymbolsListVariableCache_data = [] as UnpackedMaterialSymbolsList;

export async function getMaterialSymbolsList(progress: Progress): Promise<UnpackedMaterialSymbolsList> {
  async function getData(): Promise<MaterialSymbolsList> {
    const apiurl = getMaterialSymbolsAPIURL(3);
    const decoder = new TextDecoder();
    const sourceId = progress.listen();
    const inflatedData = await fetchInflate(apiurl, function (message) {
      progress.update(sourceId, message.loaded, message.total);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as MaterialSymbolsList;
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'bus_material_symbols_list_v2_cache';
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const unpacked = result.list.split(',');
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, result.list);
    if (!MaterialSymbolsListVariableCache_available) {
      MaterialSymbolsListVariableCache_available = true;
      MaterialSymbolsListVariableCache_data = unpacked;
    }
    return unpacked;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp, 10) > cacheTimeToLive) {
      const result = await getData();
      const unpacked = result.list.split(',');
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, result.list);
      if (!MaterialSymbolsListVariableCache_available) {
        MaterialSymbolsListVariableCache_available = true;
        MaterialSymbolsListVariableCache_data = unpacked;
      }
      return unpacked;
    } else {
      if (!MaterialSymbolsListVariableCache_available) {
        const cache = await lfGetItem(0, cacheKey);
        MaterialSymbolsListVariableCache_available = true;
        MaterialSymbolsListVariableCache_data = cache.split(',');
      }
      progress.update(progress.listen(), 1, 1);
      return MaterialSymbolsListVariableCache_data;
    }
  }
}

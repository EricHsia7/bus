import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getMaterialSymbolsAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface MaterialSymbolsList {
  /**
   * a stringified array of symbols (symbol_1,symbol_2,symbol_3,...)
   */
  list: string;
}

export type UnpackedMaterialSymbolsList = Array<string>;

let MaterialSymbolsListMemoryCache_available: boolean = false;
let MaterialSymbolsListMemoryCache_data: UnpackedMaterialSymbolsList = [];
let MaterialSymbolsListMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
const cacheKey = 'bus_material_symbols_list_v2_cache';

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

  const now = new Date().getTime();

  if (MaterialSymbolsListMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) MaterialSymbolsListMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      MaterialSymbolsListMemoryCache_data = (cache as string).split(',') as UnpackedMaterialSymbolsList;
      MaterialSymbolsListMemoryCache_available = true;
    }
  }

  if (MaterialSymbolsListMemoryCache_available && now - MaterialSymbolsListMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    return MaterialSymbolsListMemoryCache_data;
  }

  const result = await getData();
  const unpacked = result.list.split(',');
  MaterialSymbolsListMemoryCache_data = unpacked;
  MaterialSymbolsListMemoryCache_available = true;
  MaterialSymbolsListMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, result.list);
  return unpacked;
}

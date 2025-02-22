import { convertBytes } from '../../tools/convert';
import { getStoreKey, getStoresLength, lfGetItem, lfListItemKeys } from '../storage/index';

interface StoreCategory {
  name: string;
  key: string;
}

interface StoreSizeInBytes {
  category: StoreCategory;
  size: number;
}

type CategorizedSizesInBytes = { [key: string]: StoreSizeInBytes };

export interface StoreSize {
  category: StoreCategory;
  size: number;
}

export type CategorizedSizes = { [key: string]: StoreSize };

export interface StoreSizeStatistics {
  categorizedSizes: CategorizedSizes;
  totalSize: number;
}

function storeIndexToCategory(store: number): StoreCategory {
  const storeKey = getStoreKey(store);
  let name = '';
  let key = '';
  switch (storeKey) {
    case 'cacheStore':
      name = '快取';
      key = 'cache';
      break;
    case 'settingsStore':
      name = '設定';
      key = 'settings';
      break;
    case 'dataUsageRecordsStore':
      name = '分析';
      key = 'analytics';
      break;
    case 'updateRateDataStore':
      name = '分析';
      key = 'analytics';
      break;
    case 'updateRateDataWriteAheadLogStore':
      name = '分析';
      key = 'analytics';
      break;
    case 'busArrivalTimeDataWriteAheadLogStore':
      name = '分析';
      key = 'analytics';
      break;
    case 'busArrivalTimeDataStore':
      name = '分析';
      key = 'analytics';
      break;
    case 'personalScheduleStore':
      name = '個人化行程';
      key = 'personalSchedule';
      break;
    case 'recentViewsStore':
      name = '最近檢視';
      key = 'recentViews';
      break;
    case 'folderListStore':
      name = '資料夾';
      key = 'folders';
      break;
    case 'folderContentIndexStore':
      name = '資料夾';
      key = 'folders';
      break;
    case 'folderContentStore':
      name = '資料夾';
      key = 'folders';
      break;
    default:
      name = '其他';
      key = 'others';
      break;
  }
  const result = {
    name,
    key
  };
  return result;
}

export async function getStoresSizeStatistics(): Promise<StoreSizeStatistics> {
  let totalSizeInBytes = 0;
  let categorizedSizesInBytes: CategorizedSizesInBytes = {};
  const storesLength = getStoresLength();

  for (let i = 0; i < storesLength; i++) {
    const keysInStore = await lfListItemKeys(i);
    let thisStoreSizeInBytes = 0;
    for (const itemKey of keysInStore) {
      const item = await lfGetItem(i, itemKey);
      const itemInString = String(item);
      const itemLength = itemInString.length + itemKey.length;
      totalSizeInBytes += itemLength;
      thisStoreSizeInBytes += itemLength;
    }
    const thisCategory = storeIndexToCategory(i);
    const thisCategoryKey = thisCategory.key;
    if (!categorizedSizesInBytes.hasOwnProperty(thisCategoryKey)) {
      categorizedSizesInBytes[thisCategoryKey] = {
        category: thisCategory,
        size: 0
      };
    }
    categorizedSizesInBytes[thisCategory.key].size = categorizedSizesInBytes[thisCategory.key].size + thisStoreSizeInBytes;
  }

  const totalSize = convertBytes(totalSizeInBytes);

  let categorizedSizes: CategorizedSizes = {};
  for (const key in categorizedSizesInBytes) {
    const thisCategory = categorizedSizesInBytes[key].category;
    const thisCategorySize = categorizedSizesInBytes[key].size;
    categorizedSizes[key] = {
      category: thisCategory,
      size: convertBytes(thisCategorySize)
    };
  }

  const result: StoreSizeStatistics = {
    totalSize,
    categorizedSizes
  };

  return result;
}

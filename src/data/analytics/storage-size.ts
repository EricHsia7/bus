import { convertBytes } from '../../tools/convert';
import { getStoresLength, lfGetItem, lfListItemKeys } from '../storage/index';

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
  size: string;
}

export type CategorizedSizes = { [key: string]: StoreSize };

export interface StoreSizeStatistics {
  categorizedSizes: CategorizedSizes;
  totalSize: number;
}

function storeIndexToCategory(store: number): StoreCategory {
  const [name, key] = [
    ['快取', 'cache'],
    ['設定', 'settings'],
    ['分析', 'analytics'],
    ['分析', 'analytics'],
    ['分析', 'analytics'],
    ['分析', 'analytics'],
    ['分析', 'analytics'],
    ['個人化行程', 'personalSchedule'],
    ['最近檢視', 'recentViews'],
    ['通知', 'notification'],
    ['通知', 'notification'],
    ['資料夾', 'folders'],
    ['資料夾', 'folders'],
    ['資料夾', 'folders']
  ][store] || ['其他', 'others'];
  const result = {
    name,
    key
  };
  return result;
}

export async function getStoresSizeStatistics(): Promise<StoreSizeStatistics> {
  let totalSizeInBytes: number = 0;
  const categorizedSizesInBytes: CategorizedSizesInBytes = {};
  const storesLength = getStoresLength();

  for (let i = 0; i < storesLength; i++) {
    const keysInStore = await lfListItemKeys(i);
    let thisStoreSizeInBytes: number = 0;
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
    categorizedSizesInBytes[thisCategory.key].size += thisStoreSizeInBytes;
  }

  const totalSize = convertBytes(totalSizeInBytes);

  const categorizedSizes: CategorizedSizes = {};
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

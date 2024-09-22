import { convertBytes } from '../../tools/index';
import { getStoreKey, getStoresLength } from '../storage/index';

function storeIndexToCategory(store: number): string {
  const storeKey = getStoreKey(store);
  let result = '';
  switch (storeKey) {
    case 'cacheStore':
      result = '快取';
      break;
    case 'settingsStore':
      result = '設定';
      break;
    case 'dataUsageRecordsStore':
      result = '分析';
      break;
    case 'updateRateRecordsStore':
      result = '分析';
      break;
    case 'folderListStore':
      result = '資料夾';
      break;
    case 'savedStopFolderStore':
      result = '資料夾';
      break;
    case 'savedRouteFolderStore':
      result = '資料夾';
      break;
    default:
      if (storeKey.startsWith('F') && storeKey.endsWith('Store')) {
        result = '資料夾';
      } else {
        result = '其他';
      }
      break;
  }
  return result;
}

export async function getStoresSizeStatistics(): Promise<object> {
  let totalSizeInByte = 0;
  let categorizedSizes: { [key: string]: string } = {};
  const storesLength = getStoresLength();

  for (let i = 0; i < storesLength; i++) {
    const keysInStore = await lfListItemKeys(i);
    let thisCategorySize = 0;
    for (const itemKey of keysInStore) {
      const item = await lfGetItem(i, itemKey);
      const itemInString = String(item);
      const itemLength = itemInString.length + itemKey.length;
      totalSizeInByte += itemLength;
      thisCategorySize += itemLength;
    }
    const categoryKey = `c_${i}`;
    categorizedSizes[categoryKey] = {
      category: storeIndexToCategory(i),
      size: convertBytes(thisCategorySize)
    };
  }
  const totalSize = convertBytes(totalSizeInByte);

  const result = {
    totalSize,
    categorizedSizes
  };

  return result;
}

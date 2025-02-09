import { createFolder, Folder, FolderContent, FolderContentBus, FolderContentRoute, FolderContentStop, saveToFolder } from '../folder/index';
import { lfGetItem, lfListItemKeys, lfSetItem, registerStore } from '../storage/index';

interface CompatibilityTag {
  timestamp: string; // timestamp in ISO format (the date after which changes will take effect)
  script: Function | null;
}

const compatibilityTags: Array<CompatibilityTag> = [
  {
    timestamp: '2025-02-08T00:00:00.000Z',
    script: null
  },
  {
    timestamp: '2025-02-09T00:00:00.000Z',
    script: async function () {
      const savedStopFolderID = await createFolder('已收藏站牌', 'location_on');
      const savedStopFolderKeys = await lfListItemKeys(12);
      for (const key of savedStopFolderKeys) {
        const contentJSON = await lfGetItem(12, key);
        const contentObject = JSON.parse(contentJSON) as Folder;
        contentObject.timestamp = new Date(contentObject.time).getTime();
        delete contentObject.default;
        delete contentObject.index;
        delete contentObject.storeIndex;
        delete contentObject.contentType;
        delete contentObject.time;
        await saveToFolder(savedStopFolderID, contentObject);
      }

      const savedRouteFolderID = await createFolder('已收藏路線', 'route');
      const savedRouteFolderKeys = await lfListItemKeys(12);
      for (const key of savedRouteFolderKeys) {
        const contentJSON = await lfGetItem(12, key);
        const contentObject = JSON.parse(contentJSON) as Folder;
        contentObject.timestamp = new Date(contentObject.time).getTime();
        delete contentObject.default;
        delete contentObject.index;
        delete contentObject.storeIndex;
        delete contentObject.contentType;
        delete contentObject.time;
        await saveToFolder(savedRouteFolderID, contentObject);
      }

      const customFolderKeys = await lfListItemKeys(9);
      for (const key of customFolderKeys) {
        const thisFolderJSON = await lfGetItem(9, key);
        const thisFolderObject = JSON.parse(thisFolderJSON) as Folder;
        const storeIndex = await registerStore(thisFolderObject.id);
        const contentKeys = await lfListItemKeys(storeIndex);
        for (const contentKey of contentKeys) {
          const contentJSON = await lfGetItem(storeIndex, contentKey);
          const contentObject = JSON.parse(contentJSON) as FolderContentStop | FolderContentRoute | FolderContentBus;
          contentObject.timestamp = new Date(contentObject.time).getTime();
          delete contentObject.time;
          delete contentObject.index;
        }
      }
    }
  }
];

const compatibilityTagQuantity = compatibilityTags.length;

export async function checkCompatibility(): Promise<boolean> {
  const now = new Date();
  const nowTime = now.getTime();
  const key = 'compatibility';
  const timestamp_key = `${key}_timestamp`;
  const currentCompatibilityTimestamp = await lfGetItem(1, timestamp_key);
  if (currentCompatibilityTimestamp) {
    const currentCompatibilityTime = new Date(currentCompatibilityTimestamp).getTime();
    let startIndex = -1;
    for (let i = compatibilityTagQuantity - 1; i >= 0; i--) {
      const thisCompatibilityTag = compatibilityTags[i];
      const thisCompatibilityTime = new Date(thisCompatibilityTag.timestamp).getTime();
      if (currentCompatibilityTime > thisCompatibilityTime) {
        startIndex = i + 1;
        break;
      }
    }
    if (startIndex !== -1) {
      for (let j = startIndex; j < compatibilityTagQuantity; j++) {
        const thisCompatibilityTag = compatibilityTags[j];
        const thisCompatibilityTagTimestamp = thisCompatibilityTag.timestamp;
        const thisCompatibilityTagTime = new Date(thisCompatibilityTagTimestamp).getTime();
        const thisCompatibilityTagScript = thisCompatibilityTag.script;
        if (thisCompatibilityTagTime > nowTime) {
          break;
        }
        if (typeof thisCompatibilityTagScript === 'function') {
          if (thisCompatibilityTagScript.constructor.name === 'AsyncFunction') {
            await thisCompatibilityTagScript();
          } else {
            thisCompatibilityTagScript();
          }
        }
      }
    }
    await lfSetItem(1, timestamp_key, now.toISOString());
    return true;
  } else {
    await lfSetItem(1, timestamp_key, now.toISOString());
    return true;
  }
}

const localforage = require('localforage');

var storage = {
  cacheStore: false,
  settingsStore: false,
  dataUsageRecordsStore: false,
  updateRateRecordsStore: false,
  personalScheduleRecordsStore: false,
  personalScheduleStore: false,
  folderListStore: false,
  savedStopFolderStore: false,
  savedRouteFolderStore: false
};

var stores = ['cacheStore', 'settingsStore', 'dataUsageRecordsStore', 'updateRateRecordsStore', 'personalScheduleRecordsStore', 'personalScheduleStore', 'folderListStore', 'savedStopFolderStore', 'savedRouteFolderStore'];

async function dropInstance(store: number): Promise<any> {
  const storeKey = stores[store];
  if (storage[storeKey] === false) {
    storage[storeKey] = await localforage.createInstance({
      name: storeKey
    });
  }
  const operation = await storage[storeKey].dropInstance();
  return operation;
}

export async function lfSetItem(store: number, key: string, value: any): Promise<any> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = await localforage.createInstance({
        name: storeKey
      });
    }
    const operation = await storage[storeKey].setItem(key, value);
    return operation;
  } catch (err) {
    console.error(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfGetItem(store: number, key: string): Promise<any> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = await localforage.createInstance({
        name: storeKey
      });
    }
    const operation = await storage[storeKey].getItem(key);
    return operation;
  } catch (err) {
    console.error(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfRemoveItem(store: number, key: string): Promise<any> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = await localforage.createInstance({
        name: storeKey
      });
    }
    const operation = await storage[storeKey].removeItem(key);
    return operation;
  } catch (err) {
    console.error(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfListItemKeys(store: number): Promise<Array<string>> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = await localforage.createInstance({
        name: storeKey
      });
    }
    const keys = await storage[storeKey].keys();
    return keys;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function getStoreKey(store: number): string {
  return stores[store];
}

export function getStoresLength(): number {
  return stores.length;
}

export async function registerStore(id: string): Promise<number> {
  const storeKey = `F${id}Store`;
  if (!storage.hasOwnProperty(storeKey) && stores.indexOf(storeKey) < 0) {
    storage[storeKey] = await localforage.createInstance({
      name: storeKey
    });
    stores.push(storeKey);
    return stores.length - 1;
  } else {
    return stores.indexOf(storeKey);
  }
}

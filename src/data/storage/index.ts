const localforage = require('localforage');

var storage = {
  cacheStore: false,
  settingsStore: false,
  dataUsageRecordsStore: false,
  updateRateRecordsStore: false,
  folderListStore: false,
  savedStopFolderStore: false,
  savedRouteFolderStore: false
};

var stores = ['cacheStore', 'settingsStore', 'dataUsageRecordsStore', 'updateRateRecordsStore', 'folderListStore', 'savedStopFolderStore', 'savedRouteFolderStore'];

async function dropInstance(store: number): Promise<any> {
  var store_key = stores[store];
  if (storage[store_key] === false) {
    storage[store_key] = await localforage.createInstance({
      name: store_key
    });
  }
  var operation = await storage[store_key].dropInstance();
  return operation;
}

export function getStoreKey(store: number): string {
  return stores[store];
}

export function getStoresLength(): number {
  return stores.length;
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
    var store_key = stores[store];
    if (storage[store_key] === false) {
      storage[store_key] = await localforage.createInstance({
        name: store_key
      });
    }
    var operation = await storage[store_key].removeItem(key);
    return operation;
  } catch (err) {
    console.error(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfListItemKeys(store: number): Promise<Array<string>> {
  try {
    var store_key = stores[store];
    if (storage[store_key] === false) {
      storage[store_key] = await localforage.createInstance({
        name: store_key
      });
    }
    var keys = await storage[store_key].keys();
    return keys;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function registerStore(id: string): Promise<number> {
  var store_key = `F${id}Store`;
  if (!storage.hasOwnProperty(store_key) && stores.indexOf(store_key) < 0) {
    storage[store_key] = await localforage.createInstance({
      name: store_key
    });
    stores.push(store_key);
    return stores.length - 1;
  } else {
    return stores.indexOf(store_key);
  }
}

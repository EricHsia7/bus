import { convertBytes } from '../../tools/index.ts';

const localforage = require('localforage');

var storage = {
  cacheStore: false,
  settingsStore: false,
  analyticsOfDataUsageStore: false,
  analyticsOfUpdateRateStore: false,
  folderListStore: false,
  savedStopFolderStore: false,
  savedRouteFolderStore: false
};

var stores = ['cacheStore', 'settingsStore', 'analyticsOfDataUsageStore', 'analyticsOfUpdateRateStore', 'folderListStore', 'savedStopFolderStore', 'savedRouteFolderStore'];

async function dropInstance(store: number): any {
  var store_key = stores[store];
  if (storage[store_key] === false) {
    storage[store_key] = await localforage.createInstance({
      name: store_key
    });
  }
  var operation = await storage[store_key].dropInstance();
  return operation;
}

export async function lfSetItem(store: number, key: string, value: any): any {
  try {
    var store_key = stores[store];
    if (storage[store_key] === false) {
      storage[store_key] = await localforage.createInstance({
        name: store_key
      });
    }
    var operation = await storage[store_key].setItem(key, value);
    return operation;
  } catch (err) {
    console.error(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfGetItem(store: number, key: string): any {
  try {
    var store_key = stores[store];
    if (storage[store_key] === false) {
      storage[store_key] = await localforage.createInstance({
        name: store_key
      });
    }
    var operation = await storage[store_key].getItem(key);
    return operation;
  } catch (err) {
    console.error(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfRemoveItem(store: number, key: string): any {
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

export async function lfListItem(store: number): [] {
  console.log('b', 0);
  try {
    console.log('b', 1);
    var store_key = stores[store];
    if (storage[store_key] === false) {
      console.log('b', 2);
      storage[store_key] = await localforage.createInstance({
        name: store_key
      });
    }
    console.log('b', 3);
    var keys = await storage[store_key].keys();
    console.log('b', 4);
    return keys;
  } catch (err) {
    console.log('b', 5);
    console.error(err);
    return [];
  }
  console.log('b', 6);
}

export async function calculateStoresSize(): string {
  var total_size = 0;
  var index = 0;
  for (var store of stores) {
    var keysInStore = await lfListItem(index);
    for (var itemKey of keysInStore) {
      var item = await lfGetItem(index, itemKey);
      var itemInString = String(item);
      total_size += itemInString.length + itemKey.length;
    }
    index += 1;
  }
  return convertBytes(total_size);
}

export async function registerStore(id: string): number {
  console.log('a', 0);
  var store_key = `F${id}Store`;
  if (!storage.hasOwnProperty(store_key) && stores.indexOf(store_key) < 0) {
    console.log('a', 1);
    storage[store_key] = await localforage.createInstance({
      name: store_key
    });
    console.log('a', 2);
    stores.push(store_key);
    console.log('a', 3);
    return stores.length - 1;
  } else {
    console.log('a', 4);

    return stores.indexOf(store_key);
  }
  console.log('a', 5);
}

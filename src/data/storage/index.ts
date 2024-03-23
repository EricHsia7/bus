const localforage = require('localforage');

const storage = {
  cacheStore: false,
  settingsStore: false,
  analyticsOfDataUsageStore: false,
  analyticsOfUpdateFrequencyStore: false
};
var stores = ['cacheStore', 'settingsStore', 'analyticsOfDataUsageStore', 'analyticsOfUpdateFrequencyStore'];

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
    console.log(err);
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
    console.log(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfListItem(store: number): [] {
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
    console.log(err);
    return [];
  }
}

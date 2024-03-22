const localforage = require('localforage');
const storage = {
  cacheStore: false,
  settingsStore: false,
  analyticsStore: false
};
var stores = ['cacheStore', 'settingsStore', 'analyticsStore'];
async function dropInstance(store: number): any {
  var key = stores[store];
  if (storage[key] === false) {
    storage[key] = localforage.createInstance({
      name: key
    });
  }
  var operation = await storage[stores[store]].dropInstance();
  return operation;
}

export async function lfSetItem(store: number, key: string, value: any): any {
  try {
    var key = stores[store];
    if (storage[key] === false) {
      storage[key] = localforage.createInstance({
        name: key
      });
    }
    var operation = await storage[key].setItem(key, value);
    return operation;
  } catch (err) {
    console.log(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfGetItem(store: number, key: string): any {
  try {
    var key = stores[store];
    if (storage[key] === false) {
      storage[key] = localforage.createInstance({
        name: key
      });
    }
    var operation = await storage[stores[store]].getItem(key);
    return operation;
  } catch (err) {
    console.log(err);
    await dropInstance(store);
    return null;
  }
}

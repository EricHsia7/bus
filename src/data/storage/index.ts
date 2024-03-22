const localforage = require('localforage');
const storage = {
  cacheStore: localforage.createInstance({
    name: 'busCache'
  }),
  settingsStore: localforage.createInstance({
    name: 'busSettings'
  }),
  analyticsStore: localforage.createInstance({
    name: 'busAnalytics'
  })
};
var stores = ['cacheStore', 'settingsStore', 'analyticsStore'];
async function dropInstance(store: number): any {
  var operation = await storage[stores[store]].dropInstance();
  return operation;
}

export async function lfSetItem(store: number, key: string, value: any): any {
  try {
    var operation = await storage[stores[store]].setItem(key, value);
    return operation;
  } catch (err) {
    console.log(err);
    await dropInstance(store);
    return null;
  }
}

export async function lfGetItem(store: number, key: string): any {
  try {
    var operation = await storage[stores[store]].getItem(key);
    return operation;
  } catch (err) {
    console.log(err);
    await dropInstance(store);
    return null;
  }
}

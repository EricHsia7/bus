const localforage = require('localforage');

let storage = {
  cacheStore: false, // 0
  settingsStore: false, // 1
  dataUsageStatsStore: false, // 2
  updateRateDataStore: false, // 3
  updateRateDataWriteAheadLogStore: false, // 4
  busArrivalTimeDataWriteAheadLogStore: false, // 5
  busArrivalTimeDataStore: false, // 6
  personalScheduleStore: false, // 7
  recentViewsStore: false, // 8
  notificationStore: false, // 9
  notificationScheduleStore: false, // 10
  folderListStore: false, // 11
  folderContentIndexStore: false, // 12
  folderContentStore: false // 13
};

const stores = ['cacheStore', 'settingsStore', 'dataUsageStatsStore', 'updateRateDataStore', 'updateRateDataWriteAheadLogStore', 'busArrivalTimeDataWriteAheadLogStore', 'busArrivalTimeDataStore', 'personalScheduleStore', 'recentViewsStore', 'notificationStore', 'notificationScheduleStore', 'folderListStore', 'folderContentIndexStore', 'folderContentStore'];

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
    // await dropInstance(store);
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
    // await dropInstance(store);
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
    // await dropInstance(store);
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

/*
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
*/

export async function isStoragePersistent(): Promise<boolean> {
  // Check if site's storage has been marked as persistent
  if (navigator.storage) {
    if (navigator.storage.persist) {
      const isPersisted = await navigator.storage.persisted();
      return isPersisted;
    }
  }
  return false;
}

export async function askForPersistentStorage(): Promise<'granted' | 'denied' | 'unsupported'> {
  // Request persistent storage for site
  if (navigator.storage) {
    if (navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      return isPersisted ? 'granted' : 'denied';
    }
  }
  return 'unsupported';
}

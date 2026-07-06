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
  folderIndexStore: false, // 11
  folderListStore: false, // 12
  folderContentIndexStore: false, // 13
  folderContentStore: false // 14
};

const stores = ['cacheStore', 'settingsStore', 'dataUsageStatsStore', 'updateRateDataStore', 'updateRateDataWriteAheadLogStore', 'busArrivalTimeDataWriteAheadLogStore', 'busArrivalTimeDataStore', 'personalScheduleStore', 'recentViewsStore', 'notificationStore', 'notificationScheduleStore', 'folderIndexStore', 'folderListStore', 'folderContentIndexStore', 'folderContentStore'];

function promiseWithTimeout<T>(p: Promise<T>, ms: number = 5000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('store timed out')), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

function lfDummyOpen() {
  localforage
    .createInstance({
      name: 'dummyStorage'
    })
    .dropInstance();
}

export async function lfSetItem(store: number, key: string, value: any): Promise<any> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = localforage.createInstance({
        name: storeKey
      });
    }
    const operation = await promiseWithTimeout<any>(storage[storeKey].setItem(key, value));
    return operation;
  } catch (err) {
    console.log(err);
    lfDummyOpen();
    return null;
  }
}

export async function lfGetItem(store: number, key: string): Promise<any> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = localforage.createInstance({
        name: storeKey
      });
    }
    const operation = await promiseWithTimeout<any>(storage[storeKey].getItem(key));
    return operation;
  } catch (err) {
    console.log(err);
    lfDummyOpen();
    return null;
  }
}

export async function lfRemoveItem(store: number, key: string): Promise<any> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = localforage.createInstance({
        name: storeKey
      });
    }
    const operation = await promiseWithTimeout<any>(storage[storeKey].removeItem(key));
    return operation;
  } catch (err) {
    console.log(err);
    lfDummyOpen();
    return null;
  }
}

export async function lfListItemKeys(store: number): Promise<Array<string>> {
  try {
    const storeKey = stores[store];
    if (storage[storeKey] === false) {
      storage[storeKey] = localforage.createInstance({
        name: storeKey
      });
    }
    const keys = await promiseWithTimeout<Array<string>>(storage[storeKey].keys());
    return keys;
  } catch (err) {
    console.log(err);
    lfDummyOpen();
    return [];
  }
}

export function getStoreKey(store: number): string {
  return stores[store];
}

export function getStoresLength(): number {
  return stores.length;
}

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

import localforage from 'localforage';

const storage = {
  cacheStore: false, // 0
  settingsStore: false, // 1
  dataUsageStatsStore: false, // 2
  updateRateDataStore: false, // 3
  updateRateDataWriteAheadLogStore: false, // 4
  busArrivalTimeStatsGroupStore: false, // 5
  personalScheduleStore: false, // 6
  recentViewsStore: false, // 7
  notificationStore: false, // 8
  notificationScheduleStore: false, // 9
  folderIndexStore: false, // 10
  folderListStore: false, // 11
  folderContentIndexStore: false, // 12
  folderContentStore: false // 13
};

const stores = ['cacheStore', 'settingsStore', 'dataUsageStatsStore', 'updateRateDataStore', 'updateRateDataWriteAheadLogStore', 'busArrivalTimeStatsGroupStore', 'personalScheduleStore', 'recentViewsStore', 'notificationStore', 'notificationScheduleStore', 'folderIndexStore', 'folderListStore', 'folderContentIndexStore', 'folderContentStore'];

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
    const operation = await storage[storeKey].setItem(key, value); // await promiseWithTimeout<any>(storage[storeKey].setItem(key, value));
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
    const operation = await storage[storeKey].getItem(key); // await promiseWithTimeout<any>(storage[storeKey].getItem(key));
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
    const operation = await storage[storeKey].removeItem(key); // promiseWithTimeout<any>(storage[storeKey].removeItem(key));
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
    const keys = await storage[storeKey].keys(); // await promiseWithTimeout<Array<string>>(storage[storeKey].keys());
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
    if (navigator.storage.persisted) {
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

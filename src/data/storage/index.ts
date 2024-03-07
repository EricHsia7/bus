const localforage = require('localforage');

export async function lfSetItem(key: string, value: any): any {
  var operation = await localforage.setItem(key, value);
  return operation;
}

export async function lfGetItem(key: string): any {
  var operation = await localforage.getItem(key);
  return operation;
}

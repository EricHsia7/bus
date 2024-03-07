const localforage = require('localforage');

async function dropInstance() {
var operation = await localforage.dropInstance();
return operation
}

export async function lfSetItem(key: string, value: any): any {
try {
  var operation = await localforage.setItem(key, value);
  return operation;
}catch(err) {
console.log(err);
await dropInstance();
return null
}
}

export async function lfGetItem(key: string): any {
try {
  var operation = await localforage.getItem(key);
  return operation;
} catch(err) {
console.log(err);
await dropInstance();
return null
}
}

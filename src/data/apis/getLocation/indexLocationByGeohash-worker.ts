import { hasOwnProperty } from '../../../tools/index';
import { IndexedLocation, IndexedLocationItem, MergedLocation } from './index';

self.onmessage = function (e) {
  const result = processWorkerTask(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function processWorkerTask(object: MergedLocation): IndexedLocation {
  const result: IndexedLocation = {};
  for (const key in object) {
    const indexedLocationItem = {} as IndexedLocationItem;
    const thisItem = object[key];
    const hash = thisItem.hash;
    const longitudes = thisItem.lo;
    const latitudes = thisItem.la;
    const groupQuantity = thisItem.s.length;
    let longitude: number = 0;
    let latitude: number = 0;
    for (let i = 0; i < groupQuantity; i++) {
      longitude += longitudes[i];
      latitude += latitudes[i];
    }
    longitude /= groupQuantity;
    latitude /= groupQuantity;
    indexedLocationItem.lo = longitude;
    indexedLocationItem.la = latitude;
    indexedLocationItem.hash = hash;
    for (const geohash of thisItem.g) {
      if (!hasOwnProperty(result, geohash)) {
        result[geohash] = [];
      }
      result[geohash].push(indexedLocationItem);
    }
  }
  return result;
}

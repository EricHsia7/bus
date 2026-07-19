/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { IndexedLocation, MergedLocation } from './index';

self.onmessage = function (e) {
  processWorkerTask(e.data);
};

function processWorkerTask(object: MergedLocation): void {
  const result: IndexedLocation = {};
  for (const key in object) {
    const thisItem = object[key];
    const groupQuantity = thisItem.s.length;
    let longitude: number = 0;
    let latitude: number = 0;
    for (let i = 0; i < groupQuantity; i++) {
      longitude += object[key].lo[i];
      latitude += object[key].la[i];
    }
    longitude /= groupQuantity;
    latitude /= groupQuantity;

    const geohashLength = object[key].g.length;
    for (let i = 0; i < geohashLength; i++) {
      const geohash = object[key].g[i];
      if (!hasOwnProperty(result, geohash)) {
        result[geohash] = [];
      }
      result[geohash].push({
        hash: thisItem.hash,
        lo: longitude,
        la: latitude
      });
    }
  }

  self.postMessage(result); // Send the result back to the main thread
}

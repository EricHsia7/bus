/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { SimplifiedStop, SimplifiedStopItem, Stop } from './index';

self.onmessage = function (event: MessageEvent) {
  processWorkerTask(event.data);
};

function processWorkerTask(array: Stop): void {
  const result: SimplifiedStop = {};
  for (const item of array) {
    const key = `s_${item.Id}`;
    const simplifiedItem = {} as SimplifiedStopItem;
    simplifiedItem.seqNo = item.seqNo;
    simplifiedItem.goBack = item.goBack;
    simplifiedItem.stopLocationId = item.stopLocationId;
    result[key] = simplifiedItem;
  }
  self.postMessage(result); // Send the result back to the main thread
}

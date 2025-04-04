import { SimplifiedStop, SimplifiedStopItem, Stop } from './index';

self.onmessage = function (e) {
  const result = processWorkerTask(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function processWorkerTask(array: Stop): SimplifiedStop {
  const result: SimplifiedStop = {};
  for (const item of array) {
    const key = `s_${item.Id}`;
    const simplifiedItem = {} as SimplifiedStopItem;
    simplifiedItem.seqNo = item.seqNo;
    simplifiedItem.goBack = item.goBack;
    simplifiedItem.stopLocationId = item.stopLocationId;
    result[key] = simplifiedItem;
  }
  return result;
}

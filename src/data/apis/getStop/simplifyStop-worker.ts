import { Stop, SimplifiedStop } from './index';

self.onmessage = function (e) {
  const result = simplifyStop_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyStop_worker(array: Stop): SimplifiedStop {
  let result: SimplifiedStop = {};
  for (const item of array) {
    const key = `s_${item.Id}`;
    const simplifiedItem = {};
    simplifiedItem.seqNo = item.seqNo;
    simplifiedItem.goBack = item.goBack;
    simplifiedItem.stopLocationId = item.stopLocationId;
    result[key] = simplifiedItem;
  }
  return result;
}

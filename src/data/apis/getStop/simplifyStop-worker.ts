import { Stop, SimplifiedStop } from './index';

self.onmessage = function (event) {
  const result = simplifyStop_worker(event.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyStop_worker(array: Stop): SimplifiedStop {
  var result: SimplifiedStop = {};
  for (var item of array) {
    var key = `s_${item.Id}`;
    var simplified_item = {};
    simplified_item.seqNo = item.seqNo;
    simplified_item.goBack = item.goBack;
    simplified_item.stopLocationId = item.stopLocationId;
    result[key] = simplified_item;
  }
  return result;
}

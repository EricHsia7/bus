import { Stop, SimplifiedStop } from './getStop';

self.onmessage = function (e) {
  const result = simplifyStopByWorker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyStopByWorker(array: Stop): SimplifiedStop {
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

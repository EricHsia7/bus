import { SegmentBuffers, SimplifiedSegmentBuffer } from './index';

self.onmessage = function (e) {
  const result = simplifySegmentBuffers_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifySegmentBuffers_worker(array: SegmentBuffers): SimplifiedSegmentBuffer {
  let result = {};
  for (const item of array) {
    if (item.hasOwnProperty('BufferZones')) {
      const routeKey = `r_${item.RouteID}`;
      result[routeKey] = item.BufferZones;
    } 
  }
  return result;
}

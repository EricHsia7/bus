import { SegmentBuffers, SimplifiedSegmentBuffer } from './index';

self.onmessage = function (event) {
  const result = simplifySegmentBuffers_worker(event.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifySegmentBuffers_worker(array: SegmentBuffers): SimplifiedSegmentBuffer {
  let result: SimplifiedSegmentBuffer = {};
  for (const item of array) {
    if (item.hasOwnProperty('BufferZones')) {
      const routeKey = `r_${item.RouteID}`;
      if (!result.hasOwnProperty(routeKey)) {
        result[routeKey] = {};
      }
      const thisBufferZones = item.BufferZones;
      for (const thisBufferZone of thisBufferZones) {
        const groupKey = `g_${thisBufferZone.Direction}`;
        if (!result[routeKey].hasOwnProperty(groupKey)) {
          result[routeKey][groupKey] = [];
        }
        result[routeKey][groupKey].push(thisBufferZone);
      }
    }
  }
  return result;
}

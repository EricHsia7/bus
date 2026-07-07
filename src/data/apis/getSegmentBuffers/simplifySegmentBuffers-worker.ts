/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { SegmentBuffers, SimplifiedSegmentBuffer } from './index';

self.onmessage = function (event: MessageEvent) {
  processWorkerTask(event.data);
};

function processWorkerTask(array: SegmentBuffers): void {
  const result: SimplifiedSegmentBuffer = {};
  for (const item of array) {
    if (hasOwnProperty(item, 'BufferZones')) {
      const routeKey = `r_${item.RouteID}`;
      if (!hasOwnProperty(result, routeKey)) {
        result[routeKey] = {};
      }
      const thisBufferZones = item.BufferZones;
      for (const thisBufferZone of thisBufferZones) {
        const groupKey = `g_${thisBufferZone.Direction}`;
        if (!hasOwnProperty(result[routeKey], groupKey)) {
          result[routeKey][groupKey] = [];
        }
        result[routeKey][groupKey].push(thisBufferZone);
      }
    }
  }

  self.postMessage(result); // Send the result back to the main thread
}

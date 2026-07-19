/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { Route, SimplifiedRoute } from './index';

self.onmessage = function (event: MessageEvent) {
  processWorkerTask(event.data);
};

function processWorkerTask(Route: Route): void {
  const result: SimplifiedRoute = {};
  for (const item of Route) {
    const routeKey = `r_${item.Id}`;
    if (!hasOwnProperty(result, routeKey)) {
      result[routeKey] = {
        pd: item.providerId,
        n: item.nameZh,
        pid: [],
        dep: item.departureZh,
        des: item.destinationZh,
        id: item.Id
      };
    }
    result[routeKey].pid.push(item.pathAttributeId);
  }
  self.postMessage(result); // Send the result back to the main thread
}

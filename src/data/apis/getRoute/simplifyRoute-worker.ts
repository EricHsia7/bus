/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { Route, SimplifiedRoute, SimplifiedRouteItem } from './index';

self.onmessage = function (event: MessageEvent) {
  processWorkerTask(event.data);
};

function processWorkerTask(Route: Route): void {
  const result: SimplifiedRoute = {};
  for (const item of Route) {
    const simplifiedItem = {} as SimplifiedRouteItem;
    simplifiedItem.pd = item.providerId;
    simplifiedItem.n = item.nameZh;
    simplifiedItem.pid = [item.pathAttributeId];
    simplifiedItem.dep = item.departureZh;
    simplifiedItem.des = item.destinationZh;
    simplifiedItem.id = item.Id;
    const routeKey = `r_${item.Id}`;
    if (!hasOwnProperty(result, routeKey)) {
      result[routeKey] = simplifiedItem;
    } else {
      result[routeKey]['pid'].push(item.pathAttributeId);
    }
  }
  self.postMessage(result); // Send the result back to the main thread
}

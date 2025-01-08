import { Route, SimplifiedRoute } from './index';

self.onmessage = function (e) {
  const result = simplifyRoute_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyRoute_worker(Route: Route): SimplifiedRoute {
  let result = {};
  for (const item of Route) {
    const simplifiedItem = {};
    simplifiedItem.pd = item.providerId;
    simplifiedItem.n = item.nameZh;
    simplifiedItem.pid = [item.pathAttributeId];
    simplifiedItem.dep = item.departureZh;
    simplifiedItem.des = item.destinationZh;
    simplifiedItem.id = item.Id;
    const routeKey = `r_${item.Id}`;
    if (!result.hasOwnProperty(routeKey)) {
      result[routeKey] = simplifiedItem;
    } else {
      result[routeKey]['pid'].push(item.pathAttributeId);
    }
  }
  return result;
}

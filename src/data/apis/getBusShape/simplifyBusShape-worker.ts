import { convertWKTToArray } from '../../../tools/convert';
import { BusShape, SimplifiedBusShape } from './index';

self.onmessage = function (e) {
  const result = simplifyBusShape_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyBusShape_worker(BusShape: BusShape): SimplifiedBusShape {
  let result: SimplifiedBusShapeItem = {};
  for (const item of BusShape) {
    const simplifiedItem = {};
    simplifiedItem.r = item.RouteID;
    simplifiedItem.c = convertWKTToArray(item.wkt);
    simplifiedItem.g = item.GoBack;
    const routeKey = `r_${item.RouteID}`;
    if (!result.hasOwnProperty(routeKey)) {
      result[routeKey] = simplifiedItem;
    }
  }
  return result;
}

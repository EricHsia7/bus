import { convertToUnitVector } from '../../../tools/math';
import { Location, SimplifiedLocation } from './index';

self.onmessage = function (e) {
  const result = simplifyLocation_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyLocation_worker(Location: Location): SimplifiedLocation {
  let locationsByRoute = {};
  for (const item of Location) {
    const thisRouteID = item.routeId;
    const thisRouteKey = `r_${thisRouteID}`;
    if (!locationsByRoute.hasOwnProperty(thisRouteKey)) {
      locationsByRoute[thisRouteKey] = [];
    }
    locationsByRoute[thisRouteKey].push(item);
  }
  for (const key in locationsByRoute) {
    locationsByRoute[key] = locationsByRoute[key].sort(function (a, b) {
      return a.seqNo - b.seqNo;
    });
  }
  let result: SimplifiedLocation = {};
  for (const item of Location) {
    let vector = [0, 0];
    const locationsOnThisRoute = locationsByRoute[`r_${item.routeId}`];
    const locationsOnThisRouteLength = locationsOnThisRoute.length;
    let nextLocation = null;
    for (let i = 0; i < locationsOnThisRouteLength; i++) {
      if (locationsOnThisRoute[i].Id === item.Id) {
        let nextIndex = 0;
        if (i < locationsOnThisRouteLength - 1) {
          nextIndex = i + 1;
        }
        nextLocation = locationsOnThisRoute[nextIndex];
      }
    }
    if (nextLocation) {
      const x = parseFloat(nextLocation.longitude) - parseFloat(item.longitude);
      const y = parseFloat(nextLocation.latitude) - parseFloat(item.latitude);
      vector = convertToUnitVector([x, y]);
    }

    const key = `l_${item.stopLocationId}`;
    if (!result.hasOwnProperty(key)) {
      let simplifiedItem: SimplifiedLocationItem = {};
      simplifiedItem.n = item.nameZh;
      simplifiedItem.lo = parseFloat(item.longitude);
      simplifiedItem.la = parseFloat(item.latitude);
      simplifiedItem.r = [item.routeId];
      simplifiedItem.s = [item.Id];
      simplifiedItem.v = [vector];
      simplifiedItem.a = [item.address];
      result[key] = simplifiedItem;
    } else {
      if (!(result[key].r.indexOf(item.routeId) > -1)) {
        result[key].r.push(item.routeId);
      }
      if (!(result[key].s.indexOf(item.Id) > -1)) {
        result[key].s.push(item.Id);
        result[key].v.push(vector);
      }
      result[key].a.push(item.address);
    }
  }
  return result;
}

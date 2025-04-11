import { geohashEncode } from '../../../tools/geohash';
import { normalizeVector } from '../../../tools/math';
import { Location, SimplifiedLocation, SimplifiedLocationItem } from './index';

self.onmessage = function (e) {
  const result = processWorkerTask(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function processWorkerTask(Location: Location): SimplifiedLocation {
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
    const thisRouteID = item.routeId;
    const thisRouteKey = `r_${thisRouteID}`;
    const thisItemLongitude = parseFloat(item.longitude);
    const thisItemLatitude = parseFloat(item.latitude);

    let vector = [0, 0];
    const locationsOnThisRoute = locationsByRoute[thisRouteKey];
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
      const x = parseFloat(nextLocation.longitude) - thisItemLongitude;
      const y = parseFloat(nextLocation.latitude) - thisItemLatitude;
      vector = normalizeVector([x, y]);
    }

    const key = `l_${item.stopLocationId}`;
    if (!result.hasOwnProperty(key)) {
      const simplifiedItem = {} as SimplifiedLocationItem;
      simplifiedItem.n = item.nameZh;
      simplifiedItem.lo = thisItemLongitude;
      simplifiedItem.la = thisItemLatitude;
      simplifiedItem.g = geohashEncode(thisItemLatitude, thisItemLongitude, 6);
      simplifiedItem.r = [item.routeId];
      simplifiedItem.s = [item.Id];
      simplifiedItem.v = [vector];
      simplifiedItem.a = [item.address];
      simplifiedItem.id = item.stopLocationId;
      result[key] = simplifiedItem;
    } else {
      if (result[key].r.indexOf(item.routeId) < 0) {
        result[key].r.push(item.routeId);
      }
      if (result[key].s.indexOf(item.Id) < 0) {
        result[key].s.push(item.Id);
        result[key].v.push(vector);
      }
      result[key].a.push(item.address);
    }
  }
  return result;
}

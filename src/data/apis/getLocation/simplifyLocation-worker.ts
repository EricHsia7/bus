/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { geohashEncode } from '../../../tools/geohash';
import { hasOwnProperty } from '../../../tools/index';
import { normalizeVector } from '../../../tools/math';
import { Location, SimplifiedLocation } from './index';

self.onmessage = function (e) {
  processWorkerTask(e.data);
};

function processWorkerTask(Location: Location): void {
  const locationsByRoute: {
    [r_id: string]: [go: Location, back: Location, unknown: Location];
  } = {};
  for (const item of Location) {
    const thisRouteID = item.routeId;
    const thisRouteKey = `r_${thisRouteID}`;
    if (!hasOwnProperty(locationsByRoute, thisRouteKey)) {
      locationsByRoute[thisRouteKey] = [[], [], []];
    }
    locationsByRoute[thisRouteKey][item.goBack].push(item);
  }
  for (const key in locationsByRoute) {
    for (let i = 0; i < 3; i++) {
      locationsByRoute[key][i].sort(function (a, b) {
        return a.seqNo - b.seqNo;
      });
    }
  }
  const result: SimplifiedLocation = {};
  for (const item of Location) {
    const thisItemLongitude = parseFloat(item.longitude);
    const thisItemLatitude = parseFloat(item.latitude);

    const key = `l_${item.stopLocationId}`;
    if (!hasOwnProperty(result, key)) {
      result[key] = {
        n: item.nameZh,
        lo: thisItemLongitude,
        la: thisItemLatitude,
        g: geohashEncode(thisItemLatitude, thisItemLongitude, 6),
        r: [],
        s: [],
        v: [],
        a: [],
        id: item.stopLocationId
      };
    }

    const thisRouteID = item.routeId;
    const thisRouteKey = `r_${thisRouteID}`;
    const locationsOnOrientedRoute = locationsByRoute[thisRouteKey][item.goBack];
    const locationsOnOrientedRouteLength = locationsOnOrientedRoute.length;
    let index0 = -1;
    let index1 = -1;
    for (let i = 0; i < locationsOnOrientedRouteLength; i++) {
      if (locationsOnOrientedRoute[i].Id === item.Id) {
        if (i < locationsOnOrientedRouteLength - 1) {
          index0 = i;
          index1 = i + 1;
        } else {
          index0 = i - 1;
          index1 = i;
        }
        break;
      }
    }

    if (result[key].r.indexOf(item.routeId) < 0) {
      result[key].r.push(item.routeId);
    }

    if (result[key].s.indexOf(item.Id) < 0) {
      result[key].s.push(item.Id);
      if (index0 > -1 && index1 > -1) {
        const location0 = locationsOnOrientedRoute[index0];
        const location1 = locationsOnOrientedRoute[index1];
        const [longitude0, latitude0, longitude1, latitude1] = [parseFloat(location0.longitude), parseFloat(location0.latitude), parseFloat(location1.longitude), parseFloat(location1.latitude)];
        const x = (longitude1 - longitude0) * Math.cos((latitude0 / 180) * Math.PI);
        const y = latitude1 - latitude0;
        result[key].v.push(Array.from(normalizeVector([x, y])) as [number, number]);
      }
    }
    result[key].a.push(item.address);
  }

  self.postMessage(result); // Send the result back to the main thread
}

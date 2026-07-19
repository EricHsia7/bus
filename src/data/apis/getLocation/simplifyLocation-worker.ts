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
    [r_id: string]: Location;
  } = {};
  for (const item of Location) {
    const thisRouteID = item.routeId;
    const thisRouteKey = `r_${thisRouteID}`;
    if (!hasOwnProperty(locationsByRoute, thisRouteKey)) {
      locationsByRoute[thisRouteKey] = [];
    }
    locationsByRoute[thisRouteKey].push(item);
  }
  for (const key in locationsByRoute) {
    locationsByRoute[key].sort(function (a, b) {
      return a.seqNo - b.seqNo;
    });
  }
  const result: SimplifiedLocation = {};
  for (const item of Location) {
    const thisRouteID = item.routeId;
    const thisRouteKey = `r_${thisRouteID}`;
    const thisItemLongitude = parseFloat(item.longitude);
    const thisItemLatitude = parseFloat(item.latitude);

    let vector;
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

    if (result[key].r.indexOf(item.routeId) < 0) {
      result[key].r.push(item.routeId);
    }
    if (result[key].s.indexOf(item.Id) < 0) {
      result[key].s.push(item.Id);
      if (vector) result[key].v.push(Array.from(vector) as [number, number]);
    }
    result[key].a.push(item.address);
  }

  self.postMessage(result); // Send the result back to the main thread
}

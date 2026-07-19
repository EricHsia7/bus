/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
import { BusShape, SimplifiedBusShape } from '.';
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { stripTopLevelModel } from '../../../tools/text';

self.onmessage = function (e) {
  processWorkerTask(e.data);
};

function parseWKTLineString(string: string): [Float32Array<ArrayBuffer>, Float32Array<ArrayBuffer>] {
  const model = stripTopLevelModel(string);
  if (model.model !== 'LINESTRING') return [new Float32Array(0), new Float32Array(0)];
  const coordinates = model.result.split(', ');
  const length = coordinates.length;
  const lon = new Float32Array(length);
  const lat = new Float32Array(length);

  let minLongitude = Infinity;
  let minLatitude = Infinity;
  for (let i = length - 1; i >= 0; i--) {
    const components = coordinates[i].split(' ');
    lon[i] = parseFloat(components[0]);
    lat[i] = parseFloat(components[1]);
    if (lon[i] < minLongitude) minLongitude = lon[i];
    if (lat[i] < minLatitude) minLatitude = lat[i];
  }

  return [lon, lat];
}

function processWorkerTask(BusShape: BusShape): void {
  const transfer: Array<ArrayBuffer> = [];
  const result: SimplifiedBusShape = {};
  for (const item of BusShape) {
    if (item.GoBack !== 0 && item.GoBack !== 1) continue;
    const routeKey = `r_${item.RouteID}`;
    if (!hasOwnProperty(result, routeKey)) {
      result[routeKey] = [[], []];
    }
    const [longtitudes, latitudes] = parseWKTLineString(item.wkt);
    result[routeKey][item.GoBack].push({
      id: item.RouteID,
      coordinates: {
        longtitudes,
        latitudes
      }
    });
    // TODO: pick or merge the paths

    transfer.push(longtitudes.buffer, latitudes.buffer);
  }
  self.postMessage(result, transfer); // Send the result back to the main thread
}

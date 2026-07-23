/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
import { BusShape, SimplifiedBusShape, SimplifiedBusShapeItem } from '.';
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { stripTopLevelModel } from '../../../tools/text';
import { Stop } from '../getStop';

type Coordinate = [longitude: number, latitude: number, stopLocationId: number, sequence: number];

self.onmessage = function (e) {
  const { BusShape, Stop } = e.data;
  processWorkerTask(BusShape, Stop);
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

const EarthRadius = 6371008.8; // metres
const degToRad = Math.PI / 180;
const cellSizes = [20, 10, 5]; // metres: primary, then tie-breakers

function processWorkerTask(BusShape: BusShape, Stop: Stop): void {
  const transfer: Array<ArrayBuffer> = [];
  const result: SimplifiedBusShape = {};

  // Collect every candidate shape per route, split by direction (go=0, back=1).
  const candidates: Record<string, [go: Array<SimplifiedBusShapeItem>, back: Array<SimplifiedBusShapeItem>]> = {};
  for (const item of BusShape) {
    if (item.GoBack !== 0 && item.GoBack !== 1) continue;
    const routeKey = `r_${item.RouteID}`;
    if (!hasOwnProperty(candidates, routeKey)) {
      candidates[routeKey] = [[], []];
    }
    const [longtitudes, latitudes] = parseWKTLineString(item.wkt);
    candidates[routeKey][item.GoBack].push({
      longtitudes,
      latitudes,
      markers: {},
      cis: true
    });
  }

  // Bucket stops per route per direction
  const stopsByRoute: Record<string, [go: Array<Coordinate>, back: Array<Coordinate>]> = {};
  for (const StopItem of Stop) {
    const direction = parseInt(StopItem.goBack, 10);
    if (direction === 2) continue;
    const routeKey = `r_${StopItem.routeId}`;
    if (!hasOwnProperty(stopsByRoute, routeKey)) {
      stopsByRoute[routeKey] = [[], []];
    }
    stopsByRoute[routeKey][direction].push([parseFloat(StopItem.longitude), parseFloat(StopItem.latitude), StopItem.stopLocationId, StopItem.seqNo]);
  }
  for (const routeKey in stopsByRoute) {
    for (let d = 0; d < 2; d++) {
      stopsByRoute[routeKey][d].sort(function (a, b) {
        return a[3] - b[3];
      });
    }
  }

  // Pick the best-covering path for each route+direction.
  for (const routeKey in candidates) {
    if (!hasOwnProperty(candidates, routeKey)) continue;
    result[routeKey] = [
      {
        latitudes: new Float32Array(0),
        longtitudes: new Float32Array(0),
        markers: {},
        cis: true
      },
      {
        latitudes: new Float32Array(0),
        longtitudes: new Float32Array(0),
        markers: {},
        cis: true
      }
    ];
    for (let d = 0; d < 2; d++) {
      const bucket = candidates[routeKey][d];
      if (bucket.length === 0) continue;
      const stops = stopsByRoute[routeKey]?.[d] ?? [];
      const chosen = bucket.length === 1 ? bucket[0] : pickByCoverage(bucket, stops);
      result[routeKey][d] = organize(chosen, stops);
      transfer.push((chosen.longtitudes as Float32Array<ArrayBuffer>).buffer, (chosen.latitudes as Float32Array<ArrayBuffer>).buffer);
    }
  }

  self.postMessage(result, transfer); // Send the result back to the main thread
}

// Choose the candidate whose grid footprint covers the most of this direction's stops.
function pickByCoverage(candidates: Array<SimplifiedBusShapeItem>, stops: Array<Coordinate>): SimplifiedBusShapeItem {
  // No stops to discriminate → fall back to the highest-resolution path.
  if (stops.length === 0) {
    return candidates.reduce((best, c) => (c.longtitudes.length > best.longtitudes.length ? c : best));
  }

  // Local equirectangular frame anchored at the stops' mean (metres, cos-lat scaled).
  let sumLon = 0;
  let sumLat = 0;
  for (const stop of stops) {
    sumLon += stop[0];
    sumLat += stop[1];
  }
  const originLon = sumLon / stops.length;
  const originLat = sumLat / stops.length;
  const kx = EarthRadius * degToRad * Math.cos(originLat * degToRad);
  const ky = EarthRadius * degToRad;

  let best: SimplifiedBusShapeItem | null = null;
  let bestScores: number[] | null = null;
  for (const candidate of candidates) {
    const scores = cellSizes.map((cell) => coverageRatio(candidate, stops, cell, originLon, originLat, kx, ky));
    if (best === null || isBetter(scores, candidate, bestScores!, best)) {
      best = candidate;
      bestScores = scores;
    }
  }
  return best!;
}

// Compare by coverage at 20 m, then 10 m, then 5 m; a full tie (near-identical
// geometry) prefers the more detailed path.
function isBetter(scores: Array<number>, candidate: SimplifiedBusShapeItem, bestScores: Array<number>, best: SimplifiedBusShapeItem): boolean {
  for (let i = 0; i < scores.length; i++) {
    if (Math.abs(scores[i] - bestScores[i]) > 1e-9) return scores[i] > bestScores[i];
  }
  return candidate.longtitudes.length > best.longtitudes.length;
}

// Fraction of stops whose quantized cell lies on the path's rasterized footprint.
function coverageRatio(item: SimplifiedBusShapeItem, stops: Array<Coordinate>, cell: number, ox: number, oy: number, kx: number, ky: number): number {
  const cells = rasterizePath(item, cell, ox, oy, kx, ky);
  let count = 0;
  for (const stop of stops) {
    const col = Math.floor(((stop[0] - ox) * kx) / cell);
    const row = Math.floor(((stop[1] - oy) * ky) / cell);
    if (cells.has(`${col},${row}`)) count++;
  }
  return count / stops.length;
}

// Rasterize a polyline into the set of grid cells it passes through
// (super-sampled at half-cell steps so no cell is skipped between vertices).
function rasterizePath(item: SimplifiedBusShapeItem, cell: number, ox: number, oy: number, kx: number, ky: number): Set<string> {
  const { longtitudes, latitudes } = item;
  const cells = new Set<string>();
  const n = longtitudes.length;
  for (let i = 0; i < n - 1; i++) {
    const ax = (longtitudes[i] - ox) * kx;
    const ay = (latitudes[i] - oy) * ky;
    const bx = (longtitudes[i + 1] - ox) * kx;
    const by = (latitudes[i + 1] - oy) * ky;
    const steps = Math.max(1, Math.ceil((Math.hypot(bx - ax, by - ay) / cell) * 2));
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      const col = Math.floor((ax + (bx - ax) * t) / cell);
      const row = Math.floor((ay + (by - ay) * t) / cell);
      cells.add(`${col},${row}`);
    }
  }
  return cells;
}

function organize(item: SimplifiedBusShapeItem, stops: Array<Coordinate>): SimplifiedBusShapeItem {
  const markers: SimplifiedBusShapeItem['markers'] = {};
  const markersSequence: Array<[sequence: number, index: number]> = [];
  const coordinatesLength = item.longtitudes.length;
  const stopsLength = stops.length;
  for (let i = 0; i < coordinatesLength; i++) {
    let minDistance = Infinity;
    let index = -1;
    for (let j = 0; j < stopsLength; j++) {
      const distance = Math.abs(stops[j][0] - item.longtitudes[i]) + Math.abs(stops[j][1] - item.latitudes[i]);
      if (distance < minDistance) {
        minDistance = distance;
        index = j;
      }
    }
    if (index > 0) {
      const stopLocationKey = `l_${stops[index][2]}`;
      markersSequence.push([stops[index][3], i]);
      markers[stopLocationKey] = i;
    }
  }
  markersSequence.sort(function (a, b) {
    return a[1] - b[1];
  });
  let sumDifference = 0;
  for (let i = 1, l = markersSequence.length; i < l; i++) {
    sumDifference += markersSequence[i][0] - markersSequence[i - 1][0];
  }
  return {
    longtitudes: item.longtitudes,
    latitudes: item.latitudes,
    markers,
    cis: sumDifference >= 0 // cis or trans coordinates
  };
}

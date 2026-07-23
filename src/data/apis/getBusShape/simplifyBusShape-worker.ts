/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
import { BusShape, SimplifiedBusShape, SimplifiedBusShapeItem } from '.';
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { stripTopLevelModel } from '../../../tools/text';
import { Stop } from '../getStop';

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
  const candidates: Record<string, [Array<SimplifiedBusShapeItem>, Array<SimplifiedBusShapeItem>]> = {};
  for (const item of BusShape) {
    if (item.GoBack !== 0 && item.GoBack !== 1) continue;
    const routeKey = `r_${item.RouteID}`;
    if (!hasOwnProperty(candidates, routeKey)) {
      candidates[routeKey] = [[], []];
    }
    const [longtitudes, latitudes] = parseWKTLineString(item.wkt);
    candidates[routeKey][item.GoBack].push({
      longtitudes,
      latitudes
    });
  }

  // Bucket stops per route per direction
  const stopsByRoute: Record<string, [Array<[number, number]>, Array<[number, number]>]> = {};
  for (const StopItem of Stop) {
    const direction = parseInt(StopItem.goBack, 10);
    if (direction === 2) continue;
    const routeKey = `r_${StopItem.routeId}`;
    if (!hasOwnProperty(stopsByRoute, routeKey)) {
      stopsByRoute[routeKey] = [[], []];
    }
    const lon = parseFloat(StopItem.longitude);
    const lat = parseFloat(StopItem.latitude);
    if (Number.isFinite(lon) && Number.isFinite(lat)) {
      stopsByRoute[routeKey][direction].push([lon, lat]);
    }
  }

  // Pick the best-covering path for each route+direction.
  for (const routeKey in candidates) {
    if (!hasOwnProperty(candidates, routeKey)) continue;
    result[routeKey] = [
      {
        latitudes: [],
        longtitudes: []
      },
      {
        latitudes: [],
        longtitudes: []
      }
    ];
    for (let dir = 0; dir < 2; dir++) {
      const bucket = candidates[routeKey][dir];
      if (bucket.length === 0) continue;
      const stops = stopsByRoute[routeKey]?.[dir] ?? [];
      const chosen = bucket.length === 1 ? bucket[0] : pickByCoverage(bucket, stops);
      result[routeKey][dir] = chosen; // keep the [go, back] shape; one element each
      transfer.push((chosen.longtitudes as Float32Array<ArrayBuffer>).buffer, (chosen.latitudes as Float32Array<ArrayBuffer>).buffer);
    }
  }

  self.postMessage(result, transfer); // Send the result back to the main thread
}

// Choose the candidate whose grid footprint covers the most of this direction's stops.
function pickByCoverage(candidates: Array<SimplifiedBusShapeItem>, stops: Array<[number, number]>): SimplifiedBusShapeItem {
  // No stops to discriminate → fall back to the highest-resolution path.
  if (stops.length === 0) {
    return candidates.reduce((best, c) => (c.longtitudes.length > best.longtitudes.length ? c : best));
  }

  // Local equirectangular frame anchored at the stops' mean (metres, cos-lat scaled).
  let sumLon = 0;
  let sumLat = 0;
  for (const [lon, lat] of stops) {
    sumLon += lon;
    sumLat += lat;
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
function coverageRatio(item: SimplifiedBusShapeItem, stops: Array<[number, number]>, cell: number, ox: number, oy: number, kx: number, ky: number): number {
  const cells = rasterizePath(item, cell, ox, oy, kx, ky);
  let on = 0;
  for (const [lon, lat] of stops) {
    const col = Math.floor(((lon - ox) * kx) / cell);
    const row = Math.floor(((lat - oy) * ky) / cell);
    if (cells.has(`${col},${row}`)) on++;
  }
  return on / stops.length;
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

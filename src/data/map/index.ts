import { mercatorProjection } from '../../tools/convert';
import { calculateAverage } from '../../tools/math';
import { getBusShape } from '../apis/getBusShape/index';
import { getLocation } from '../apis/getLocation/index';
import { getRoute } from '../apis/getRoute/index';

interface MapRouteObject {
  routeID: number;
  name: string;
  points: Array<[number, number]>;
  goBack: number;
  color: {
    r: number;
    g: number;
    b: number;
  };
  type: 'route';
}

interface MapLocationObject {
  hash: string;
  name: string;
  point: [number, number];
  color: {
    r: number;
    g: number;
    b: number;
  };
  type: 'location';
}

export type MapObject = MapLocationObject | MapRouteObject;

type MapObjects = Array<MapObject>;

type MapChunk = Array<number>;

type MapChunks = { [key: string]: MapChunk };

export interface integratedMap {
  objects: MapObjects;
  chunks: MapChunks;
  interval: number;
  boundary: {
    topLeft: {
      x: number;
      y: number;
    };
    bottomRight: {
      x: number;
      y: number;
    };
  };
}

const chunkWidthInMeters = 300; // 300 m
const chunkHeightInMeters = 300; // 300 m
const chunkWidth = 300; // 300 px
const chunkHeight = 300; // 300 px

const interval = 0.01;

export function getChunkCoordinates(longitude: number, latitude: number): { chunkX: number; chunkY: number } {
  const projection = mercatorProjection(latitude, longitude, 1);
  const chunkX = Math.floor(projection.x / chunkWidth);
  const chunkY = Math.floor(projection.y / chunkHeight);
  return { chunkX, chunkY };
}

export async function integrateMap(requestID: string): Promise<integratedMap> {
  const BusShape = await getBusShape(requestID);
  const Location = await getLocation(requestID, true);
  const Route = await getRoute(requestID, true);

  let result = {};

  // process objects and generate chunks
  let chunkX = [];
  let chunkY = [];
  let latitudes = [];
  let longitudes = [];
  let chunks = {};
  let objects = [];
  let index = 0;
  for (const routeKey in BusShape) {
    let integratedMapRouteObject: MapRouteObject = {};
    integratedMapRouteObject.type = 'route';

    // collect data from BusShape
    let thisBusShape = BusShape[routeKey];
    integratedMapRouteObject.points = thisBusShape.c;
    integratedMapRouteObject.goBack = thisBusShape.g;

    // collect data from Route
    let thisRoute = {};
    if (Route.hasOwnProperty(routeKey)) {
      thisRoute = Route[routeKey];
    } else {
      continue;
    }

    integratedMapRouteObject.name = thisRoute.n;
    integratedMapRouteObject.routeID = thisRoute.id;
    integratedMapRouteObject.color = { r: 0, g: 0, b: 0 };

    // add to chunks
    let thisLatitudes = [];
    let thisLongitudes = [];
    for (const point of integratedMapRouteObject.points) {
      thisLatitudes.push(point[1]);
      thisLongitudes.push(point[0]);
      const chunkCoordinate = getChunkCoordinates(point[0], point[1], interval);
      if (chunkX.indexOf(chunkCoordinate.chunkX) < 0) {
        chunkX.push(chunkCoordinate.chunkX);
      }
      if (chunkY.indexOf(chunkCoordinate.chunkY) < 0) {
        chunkY.push(chunkCoordinate.chunkY);
      }
      const chunkKey = `c_${chunkCoordinate.chunkX}_${chunkCoordinate.chunkY}`;
      if (!chunks.hasOwnProperty(chunkKey)) {
        chunks[chunkKey] = [];
      }
      if (chunks[chunkKey].indexOf(index) < 0) {
        chunks[chunkKey].push(index);
      }
    }

    latitudes.push(Math.min(...thisLatitudes));
    latitudes.push(Math.max(...thisLatitudes));
    longitudes.push(Math.min(...thisLongitudes));
    longitudes.push(Math.max(...thisLongitudes));

    // push to objects
    objects.push(integratedMapRouteObject);
    index += 1;
  }

  for (const hashKey in Location) {
    let integratedMapLocationObject: MapLocationObject = {};
    integratedMapLocationObject.type = 'location';
    // collect data from Location
    let thisLocation = Location[hashKey];
    integratedMapLocationObject.name = thisLocation.n;
    integratedMapLocationObject.hash = thisLocation.hash;
    integratedMapLocationObject.point = [calculateAverage(thisLocation.lo), calculateAverage(thisLocation.la)];
    integratedMapLocationObject.color = { r: 0, g: 0, b: 0 };

    // add to chunks

    const thisPoint = integratedMapLocationObject.point;
    latitudes.push(thisPoint[1]);
    longitudes.push(thisPoint[0]);
    const chunkCoordinate = getChunkCoordinates(thisPoint[0], thisPoint[1], interval);
    if (chunkX.indexOf(chunkCoordinate.chunkX) < 0) {
      chunkX.push(chunkCoordinate.chunkX);
    }
    if (chunkY.indexOf(chunkCoordinate.chunkY) < 0) {
      chunkY.push(chunkCoordinate.chunkY);
    }
    const chunkKey = `c_${chunkCoordinate.chunkX}_${chunkCoordinate.chunkY}`;
    if (!chunks.hasOwnProperty(chunkKey)) {
      chunks[chunkKey] = [];
    }
    if (chunks[chunkKey].indexOf(index) < 0) {
      chunks[chunkKey].push(index);
    }
    // push to objects
    objects.push(integratedMapLocationObject);
    index += 1;
  }

  result.objects = objects;
  result.chunks = chunks;
  result.interval = interval;

  result.boundary = {
    topLeft: {
      x: Math.min(...chunkX),
      y: Math.max(...chunkY),
      latitude: Math.max(...latitudes),
      longitude: Math.min(...longitudes)
    },
    bottomRight: {
      x: Math.max(...chunkX),
      y: Math.min(...chunkY),
      latitude: Math.min(...latitudes),
      longitude: Math.max(...longitudes)
    }
  };
  return result;
}

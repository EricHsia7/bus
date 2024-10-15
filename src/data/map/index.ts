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
  interval: {
    x: number;
    y: number;
  };
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

const intervalX = 0.01;
const intervalY = 0.01;

function getChunkCoordinate(latitude: number, longitude: number): [number, number] {
  const x = Math.floor(latitude / intervalX);
  const y = Math.floor(longitude / intervalY);
  return [x, y];
}

export async function integrateMap(requestID: string): Promise<integratedMap> {
  const BusShape = await getBusShape(requestID);
  const Location = await getLocation(requestID, true);
  const Route = await getRoute(requestID, true);

  let result = {};

  // process objects and generate chunks
  let chunkX = [];
  let chunkY = [];
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
    for (const point of integratedMapRouteObject.points) {
      const chunkCoordinate = getChunkCoordinate(point[0], point[1]);
      if (chunkX.indexOf(chunkCoordinate[0]) < 0) {
        chunkX.push(chunkCoordinate[0]);
      }
      if (chunkY.indexOf(chunkCoordinate[1]) < 0) {
        chunkY.push(chunkCoordinate[1]);
      }
      const chunkKey = `c_${chunkCoordinate[0]}_${chunkCoordinate[1]}`;
      if (!chunks.hasOwnProperty(chunkKey)) {
        chunks[chunkKey] = [];
      }
      if (chunks[chunkKey].indexOf(index) < 0) {
        chunks[chunkKey].push(index);
      }
    }

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
    integratedMapLocationObject.point = [calculateAverage(thisLocation.la), calculateAverage(thisLocation.lo)];
    integratedMapLocationObject.color = { r: 0, g: 0, b: 0 };

    // add to chunks
    const thisPoint = integratedMapLocationObject.point;
    const chunkCoordinate = getChunkCoordinate(thisPoint[0], thisPoint[1]);
    if (chunkX.indexOf(chunkCoordinate[0]) < 0) {
      chunkX.push(chunkCoordinate[0]);
    }
    if (chunkY.indexOf(chunkCoordinate[1]) < 0) {
      chunkY.push(chunkCoordinate[1]);
    }
    const chunkKey = `c_${chunkCoordinate[0]}_${chunkCoordinate[1]}`;
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
  result.interval = {
    x: intervalX,
    y: intervalY
  };
  result.boundary = {
    topLeft: {
      x: Math.min(...chunkX),
      y: Math.min(...chunkY)
    },
    bottomRight: {
      x: Math.max(...chunkX),
      y: Math.max(...chunkY)
    }
  };
  return result;
}

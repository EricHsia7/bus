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

type MapObject = MapLocationObject | MapRouteObject;

type MapObjects = Array<MapObject>;

type MapObjectIndexes = Array<number>;

interface MapChunk {
  latitude: number;
  longitude: number;
  objectIndexes: MapObjectIndexes;
}

type MapChunks = { [key: string]: MapChunk };

interface integratedMap {
  objects: [];
  chunks: MapChunks;
}

async function integrateMap(requestID: string): integratedMap {
  const BusShape = await getBusShape(requestID);
  const Location = await getLocation(requestID, true);
  const Route = await getRoute(requestID, true);

  let result = {};

  // process objects
  let objects = [];
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
    integratedMapRouteObject.routeID = thisRoute.r;
    integratedMapRouteObject.color = { r: 0, g: 0, b: 0 };

    objects.push(integratedMapRouteObject);
  }

  for (const hashKey in Location) {
    let integratedMapLocationObject: MapLocationObject = {};
    integratedMapLocationObject.type = 'location';
    // collect data from Location
    let thisLocation = Location[hashKey];
    integratedMapLocationObject.name = thisLocation.n;
    integratedMapLocationObject.hash = thisLocation.hash;
    integratedMapLocationObject.color = { r: 0, g: 0, b: 0 };
    objects.push(integratedMapLocationObject);
  }
  result.objects = objects;

  // generate chunks
  let chunks = {};

  return result;
}

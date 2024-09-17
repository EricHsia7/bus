import { getRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { getLocation } from '../apis/getLocation/index';
import { generateIdentifier } from '../../tools/index';

const Fuse = require('fuse.js/basic');

export async function searchRouteByName(query: string): Promise<Array> {
  var requestID = generateIdentifier('r');
  var Route = await getRoute(requestID, true);
  var result = [];
  for (var key in Route) {
    if (String(Route[key].n).indexOf(query) > -1) {
      result.push({
        id: parseInt(key.split('_')[1]),
        pid: Route[key].pid,
        dep: Route[key].dep,
        des: Route[key].des,
        n: Route[key].n
      });
    }
  }
  return result;
}

export async function searchRouteByRouteID(RouteID: number): Promise<Array> {
  var requestID = generateIdentifier('r');
  var Route = await getRoute(requestID, true);
  var result = [];
  for (var key in Route) {
    if (String(key) === `r_${RouteID}`) {
      result.push({
        id: parseInt(key.split('_')[1]),
        pid: Route[key].pid,
        dep: Route[key].dep,
        des: Route[key].des,
        n: Route[key].n
      });
    }
  }
  return result;
}

export async function searchRouteByPathAttributeId(PathAttributeId: Array<number>): Promise<Array<SimplifiedRouteItem>> {
  const requestID = generateIdentifier('r');
  const Route = await getRoute(requestID, true);
  let result = [];
  for (const key in Route) {
    if (String(Route[key].pid).indexOf(PathAttributeId) > -1) {
      result.push({
        id: parseInt(key.split('_')[1]),
        pid: Route[key].pid,
        dep: Route[key].dep,
        des: Route[key].des,
        n: Route[key].n
      });
    }
  }
  return result;
}

export async function prepareForSearch() {
  var requestID = generateIdentifier('r');
  var Route = await getRoute(requestID, true);
  var mergedLocation = await getLocation(requestID, true);
  var index = [];
  for (var key in Route) {
    index.push({
      id: parseInt(key.split('_')[1]),
      pid: Route[key].pid,
      dep: Route[key].dep,
      des: Route[key].des,
      n: Route[key].n,
      hash: '',
      lo: '',
      la: '',
      r: '',
      s: '',
      type: 0
    });
  }
  for (var key in mergedLocation) {
    index.push({
      id: mergedLocation[key].id,
      n: mergedLocation[key].n,
      lo: mergedLocation[key].lo,
      la: mergedLocation[key].la,
      r: mergedLocation[key].r,
      s: mergedLocation[key].s,
      hash: mergedLocation[key].hash,
      dep: '',
      des: '',
      pid: [],
      type: 1
    });
  }
  return new Fuse(index, {
    keys: [
      { name: 'n', weight: 0.65 },
      { name: 'dep', weight: 0.12 },
      { name: 'des', weight: 0.12 },
      { name: 'hash', weight: 0.055 },
      { name: 'id', weight: 0.055 }
    ]
  });
}
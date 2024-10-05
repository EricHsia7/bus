import { getRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { getLocation } from '../apis/getLocation/index';
import { generateIdentifier, getIntersection, getUnicodes } from '../../tools/index';

// const Fuse = require('fuse.js/basic');

let searchIndex = {};
let searchList = [];
let readyToSearch = false;

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

export async function prepareForSearch(): void {
  readyToSearch = false;
  const requestID = generateIdentifier('r');
  const Route = await getRoute(requestID, true);
  const mergedLocation = await getLocation(requestID, true);
  let index = {};
  let list = [];
  let i = 0;
  for (const key in Route) {
    const thisItem = {
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
    };
    list.push(thisItem);
    const unicodes = getUnicodes(thisItem.n).concat(getUnicodes(thisItem.dep)).concat(getUnicodes(thisItem.des));
    for (const unicode of unicodes) {
      const key = `u_${unicode}`;
      if (!index.hasOwnProperty(key)) {
        index[key] = [];
      }
      index[key].push(i);
    }
    i += 1;
  }
  for (const key in mergedLocation) {
    const thisItem = {
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
    };
    list.push(thisItem);
    const unicodes = getUnicodes(thisItem.n);
    for (const unicode of unicodes) {
      const key = `u_${unicode}`;
      if (!index.hasOwnProperty(key)) {
        index[key] = [];
      }
      index[key].push(i);
    }
    i += 1;
  }
  searchIndex = index;
  searchList = list;
  readyToSearch = true;
}

export function searchFor(query: string): Array {
  if (!readyToSearch) {
    return [];
  }
  const unicodes = getUnicodes(query);
  let unicodeGroups = [];
  for (const unicode of unicodes) {
    const key = `u_${unicode}`;
    if (searchIndex.hasOwnProperty(key)) {
      unicodeGroups.push(searchIndex[key]);
    }
  }
  unicodeGroups.sort(function (a, b) {
    return a.length - b.length;
  });
  const unicodeGroupsLength1 = unicodeGroups.length - 1;
  let intersection = [];
  if (unicodeGroupsLength1 === 0) {
    intersection = unicodeGroups[0];
  }
  if (unicodeGroupsLength1 > 0) {
    for (let i = 0; i < unicodeGroupsLength1; i++) {
      const currentGroup = unicodeGroups[i];
      const nextGroup = unicodeGroups[i + 1];
      if (i === 0) {
        intersection = getIntersection(currentGroup, nextGroup);
      } else {
        intersection = getIntersection(intersection, nextGroup);
      }
    }
  }
  let result = [];
  for (const j of intersection) {
    const thisItem = searchList[j];
    result.push(thisItem);
  }
  return result;
}

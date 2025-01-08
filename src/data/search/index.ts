import { getRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { getLocation } from '../apis/getLocation/index';
import { generateIdentifier } from '../../tools/index';
import { getIntersection } from '../../tools/array';
import { getUnicodes } from '../../tools/text';
import { getCarInfo } from '../apis/getCarInfo/index';

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
  const requestID = generateIdentifier('r');
  const Route = await getRoute(requestID, true);
  const mergedLocation = await getLocation(requestID, true);
  const CarInfo = await getCarInfo(requestID);
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
    const unicodes = getUnicodes(`${thisItem.n}${thisItem.dep}${thisItem.des}`, true);
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
    const unicodes = getUnicodes(thisItem.n, true);
    for (const unicode of unicodes) {
      const key = `u_${unicode}`;
      if (!index.hasOwnProperty(key)) {
        index[key] = [];
      }
      index[key].push(i);
    }
    i += 1;
  }
  for (const item of CarInfo) {
    const thisItem = {
      id: item.BusId,
      pid: [],
      dep: '',
      des: '',
      n: item.CarNum,
      hash: '',
      lo: '',
      la: '',
      r: '',
      s: '',
      type: 2
    };
    list.push(thisItem);
    const unicodes = getUnicodes(thisItem.CarNum, true);
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

function calculateSearchResultScore(queryUnicodes: Array<number>, resultUnicodes: Array<number>): number {
  let score = 0;
  let i = 0;
  for (const unicode of resultUnicodes) {
    const indexOfUnicode = queryUnicodes.indexOf(unicode, i);
    score += indexOfUnicode - i;
    i += 1;
  }
  if (queryUnicodes === resultUnicodes) {
    score = Math.abs(score) * 10;
  }
  return score;
}

export function searchFor(query: string, limit: number): Array {
  if (!readyToSearch) {
    return [];
  }
  const queryUnicodes = getUnicodes(query, true);
  const asIsQueryUnicodes = getUnicodes(query, false);
  let unicodeGroups = [];
  for (const unicode of queryUnicodes) {
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
  let quantity = 0;
  for (const j of intersection) {
    let thisItem = searchList[j];
    const score = calculateSearchResultScore(asIsQueryUnicodes, getUnicodes(thisItem.n, false));
    if (quantity < limit) {
      result.push({
        item: thisItem,
        score: score
      });
    } else {
      break;
    }
    quantity += 1;
  }
  result.sort(function (a, b) {
    return b.score - a.score;
  });
  return result;
}

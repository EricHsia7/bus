import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { getLocation, MergedLocation } from '../apis/getLocation/index';
import { generateIdentifier } from '../../tools/index';
import { getIntersection } from '../../tools/array';
import { getUnicodes } from '../../tools/text';
import { getCarInfo, SimplifiedCarInfo } from '../apis/getCarInfo/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

export async function searchRouteByName(query: string): Promise<Array<SimplifiedRouteItem>> {
  const requestID = generateIdentifier('r');
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  let result: Array<SimplifiedRouteItem> = [];
  for (const key in Route) {
    const thisRoute = Route[key];
    if (String(thisRoute.n).indexOf(query) > -1) {
      result.push(thisRoute);
    }
  }
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  return result;
}

export async function searchRouteByRouteID(RouteID: number): Promise<SimplifiedRouteItem | false> {
  const requestID = generateIdentifier('r');
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  let found: boolean = false;
  let result = {} as SimplifiedRouteItem;
  const routeKey = `r_${RouteID}`;
  if (Route.hasOwnProperty(routeKey)) {
    result = Route[routeKey];
    found = true;
  }
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  return found ? result : false;
}

export async function searchRouteByPathAttributeId(PathAttributeId: number): Promise<Array<SimplifiedRouteItem>> {
  const requestID = generateIdentifier('r');
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  let result: Array<SimplifiedRouteItem> = [];
  for (const key in Route) {
    const thisRoute = Route[key];
    if (String(thisRoute.pid).indexOf(PathAttributeId) > -1) {
      result.push(thisRoute);
    }
  }
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  return result;
}

interface SearchItem {
  id: string | number | Array<number>;
  pid: Array<number>;
  dep: string;
  des: string;
  n: string;
  hash: string;
  lo: Array<number>;
  la: Array<number>;
  r: Array<Array<number>>;
  s: Array<Array<number>>;
  type: 0 | 1 | 2; // 0: route, 1: location, 2: car info
}

export interface SearchResult {
  item: SearchItem;
  score: number;
}

type SearchIndex = { [unicodeKey: string]: number };

let searchIndex: SearchIndex = {};
let searchList: Array<SearchItem> = [];
let readyToSearch: boolean = false;

export async function prepareForSearch() {
  const requestID = generateIdentifier('r');
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  const mergedLocation = (await getLocation(requestID, true)) as MergedLocation;
  const CarInfo = (await getCarInfo(requestID, true)) as SimplifiedCarInfo;
  let index: SearchIndex = {};
  let list: Array<SearchItem> = [];
  let i: number = 0;
  for (const key in Route) {
    const thisRoute = Route[key];
    const thisItem = {
      id: thisRoute.id,
      pid: thisRoute.pid,
      dep: thisRoute.dep,
      des: thisRoute.des,
      n: thisRoute.n,
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
    const thisLocation = mergedLocation[key];
    const thisItem = {
      id: thisLocation.id,
      n: thisLocation.n,
      lo: thisLocation.lo,
      la: thisLocation.la,
      r: thisLocation.r,
      s: thisLocation.s,
      hash: thisLocation.hash,
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
  for (const key in CarInfo) {
    const thisCarInfo = CarInfo[key];
    const thisItem = {
      id: thisCarInfo.BusId,
      pid: [],
      dep: '',
      des: '',
      n: thisCarInfo.CarNum,
      hash: '',
      lo: '',
      la: '',
      r: '',
      s: '',
      type: 2
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
  searchIndex = index;
  searchList = list;
  readyToSearch = true;
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
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

export function searchFor(query: string, limit: number): Array<SearchResult> {
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

  let result: Array<SearchResult> = [];
  let quantity = 0;

  // Prioritize exact matches for buses
  const exactMatches = searchList.filter((item) => item.n === query && item.type === 2);
  const exactMatchIds = new Set(); // To track exact matches to avoid duplicates
  for (const item of exactMatches) {
    result.push({
      item: item,
      score: Infinity // Highest possible score for exact matches
    });
    exactMatchIds.add(item.id);
    quantity += 1;
    if (quantity >= limit) {
      break;
    }
  }

  if (quantity < limit) {
    for (const j of intersection) {
      let thisItem = searchList[j];
      if (!exactMatchIds.has(thisItem.id)) {
        // Check if the item is not already an exact match
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
    }
  }

  result.sort(function (a, b) {
    return b.score - a.score;
  });

  return result;
}

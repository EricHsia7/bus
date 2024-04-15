import { getRoute } from '../apis/getRoute.ts';
import { getLocation } from '../apis/getLocation.ts';
import { md5 } from '../../tools/index.ts';

const Fuse = require('fuse.js/basic');

export async function searchRouteByName(query: string): Array {
  var requestID = `r_${md5(Math.random() * new Date().getTime())}`;
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

export async function searchRouteByRouteID(query: string): Array {
  var requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var Route = await getRoute(requestID, true);
  var result = [];
  for (var key in Route) {
    if (String(key) === `r_${query}`) {
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

export async function searchRouteByPathAttributeId(PathAttributeId: [number]) {
  var requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var Route = await getRoute(requestID, true);
  var result = [];
  for (var key in Route) {
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
  var requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var Route = await getRoute(requestID, true);
  var Location = await getLocation(requestID);
  var index = [];
  for (var key in Route) {
    index.push({
      id: parseInt(key.split('_')[1]),
      pid: Route[key].pid,
      dep: Route[key].dep,
      des: Route[key].des,
      n: Route[key].n,
      lo: '',
      la: '',
      r: '',
      s: '',
      type: 0
    });
  }
  for (var key in Location) {
    index.push({
      id: parseInt(key.split('_')[1]),
      n: Location[key].n,
      lo: Route[key].lo,
      la: Location[key].la,
      r: Location[key].r,
      s: Location[key].s,
      dep: '',
      des: '',
      pid: [],
      type: 1
    });
  }
  return new Fuse(index, { keys: ['n', 'dep', 'des'] });
}

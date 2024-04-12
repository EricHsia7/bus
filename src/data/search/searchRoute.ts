import { getRoute } from '../apis/getRoute.ts';
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
    if (String(key).indexOf(query) > -1) {
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
  var index = [];
  for (var key in Route) {
    index.push({
      id: parseInt(key.split('_')[1]),
      pid: Route[key].pid,
      dep: Route[key].dep,
      des: Route[key].des,
      n: Route[key].n
    });
  }
  return new Fuse(index, { keys: ['n', 'dep', 'des'] });
}

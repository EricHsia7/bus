import { getAPIURL } from './getAPIURL';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from './loader';
import { lfSetItem, lfGetItem } from '../storage/index';
import { convertToUnitVector, md5 } from '../../tools/index';
import { mergeAddressesIntoOne } from '../../tools/address';

export interface LocationItem {
  Id: number; // StopID
  routeId: number; // RouteID
  nameZh: string; // name in Chinese
  nameEn: string; // name in English
  seqNo: number; // sequence on the route
  pgp: string; // pgp (-1: get off, 0: get on and off, 1: get on)
  goBack: '0' | '1' | '2'; // GoBack (0: go, 1: back, 2: unknown)
  longitude: string; // number in string
  latitude: string; // number in string
  address: string;
  stopLocationId: number; // LocationID
  showLon: string; // number in string
  showLat: string; // number in string
  vector: string;
}

export type Location = Array<LocationItem>;

export interface LocationStopItem {
  id: number;
  v: [number, number];
}

export interface SimplifiedLocationItem {
  n: string; // name
  lo: number; // longitude
  la: number; // latitude
  r: Array<number>; // RouteIDs
  s: Array<number>; // StopIDs
  v: Array<[number, number]>; // a set of vectors
  a: Array<string>; // addresses
}

export type SimplifiedLocation = { [key: string]: SimplifiedLocationItem };

export interface MergedLocationItem {
  n: string; // name
  lo: Array<number>; // longitude
  la: Array<number>; // latitude
  r: Array<Array<number>>; // RouteIDs
  s: Array<Array<number>>; // StopIDs
  v: Array<Array<[number, number]>>; // sets of vectors
  a: Array<object | string>; // addresses
}

export type MergedLocation = { [key: string]: MergedLocationItem };

var LocationAPIVariableCache: object = {
  merged: {
    available: false,
    data: {}
  },
  simplified: {
    available: false,
    data: {}
  }
};

function simplifyLocation(array: Location): SimplifiedLocation {
  var locationsByRoute = {};
  for (var item of array) {
    var thisRouteID = item.routeId;
    var key = `r_${thisRouteID}`;
    if (!locationsByRoute.hasOwnProperty(key)) {
      locationsByRoute[key] = [];
    }
    locationsByRoute[key].push(item);
  }
  for (var key in locationsByRoute) {
    locationsByRoute[key] = locationsByRoute[key].sort(function (a, b) {
      return a.seqNo - b.seqNo;
    });
  }
  var result: SimplifiedLocation = {};
  for (var item of array) {
    let vector = [0, 0];
    var locationsOnThisRoute = locationsByRoute[`r_${item.routeId}`];
    var locationsOnThisRouteLength = locationsOnThisRoute.length;
    var nextLocation = null;
    for (let i = 0; i < locationsOnThisRouteLength; i++) {
      if (locationsOnThisRoute[i].Id === item.Id) {
        let nextIndex = 0;
        if (i < locationsOnThisRouteLength - 1) {
          nextIndex = i + 1;
        }
        nextLocation = locationsOnThisRoute[nextIndex];
      }
    }
    if (nextLocation) {
      var x = parseFloat(nextLocation.longitude) - parseFloat(item.longitude);
      var y = parseFloat(nextLocation.latitude) - parseFloat(item.latitude);
      vector = convertToUnitVector([x, y]);
    }

    var key = `l_${item.stopLocationId}`;
    if (!result.hasOwnProperty(key)) {
      var simplified_item: SimplifiedLocationItem = {};
      simplified_item.n = item.nameZh;
      simplified_item.lo = parseFloat(item.longitude);
      simplified_item.la = parseFloat(item.latitude);
      simplified_item.r = [item.routeId];
      simplified_item.s = [item.Id];
      simplified_item.v = [vector];
      simplified_item.a = [item.address];
      result[key] = simplified_item;
    } else {
      if (!(result[key].r.indexOf(item.routeId) > -1)) {
        result[key].r.push(item.routeId);
      }
      if (!(result[key].s.indexOf(item.Id) > -1)) {
        result[key].s.push(item.Id);
        result[key].v.push(vector);
      }
      result[key].a.push(item.address);
    }
  }
  return result;
}

function mergeLocationByName(object: SimplifiedLocation): MergedLocation {
  var result: MergedLocation = {};
  for (var key in object) {
    var hash = md5(
      String(object[key].n)
        .trim()
        .replaceAll(/[\(\（\）\)\:\：\~\～]*/gim, '')
    );
    var nameKey = `ml_${hash}`;
    if (!result.hasOwnProperty(nameKey)) {
      result[nameKey] = {
        n: object[key].n,
        lo: [object[key].lo],
        la: [object[key].la],
        r: [object[key].r],
        s: [object[key].s],
        v: [object[key].v],
        a: [mergeAddressesIntoOne(object[key].a)],
        id: [parseInt(key.split('_')[1])],
        hash: hash
      };
    } else {
      result[nameKey].id.push(parseInt(key.split('_')[1]));
      result[nameKey].r.push(object[key].r);
      result[nameKey].s.push(object[key].s);
      result[nameKey].v.push(object[key].v);
      result[nameKey].lo.push(object[key].lo);
      result[nameKey].la.push(object[key].la);
      result[nameKey].a.push(mergeAddressesIntoOne(object[key].a));
    }
  }
  return result;
}

export async function getLocation(requestID: string, merged: boolean = false): Promise<SimplifiedLocation | MergedLocation> {
  async function getData() {
    var apis = [
      [0, 11],
      [1, 11]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api.url, requestID, `getLocation_${api.e[0]}`);
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  var cache_time: number = 60 * 60 * 24 * 30 * 1000;
  var cache_type = merged ? 'merged' : 'simplified';
  var cache_key = `bus_${cache_type}_location_v14_cache`;
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var final_result = {};
    var simplified_result = simplifyLocation(result);
    if (merged) {
      var merged_result = mergeLocationByName(simplified_result);
      final_result = merged_result;
    } else {
      final_result = simplified_result;
    }

    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
    if (!LocationAPIVariableCache[cache_type].available) {
      LocationAPIVariableCache[cache_type].available = true;
      LocationAPIVariableCache[cache_type].data = final_result;
    }
    return final_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var final_result = {};
      var simplified_result = simplifyLocation(result);
      if (merged) {
        var merged_result = mergeLocationByName(simplified_result);
        final_result = merged_result;
      } else {
        final_result = simplified_result;
      }

      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
      if (!LocationAPIVariableCache[cache_type].available) {
        LocationAPIVariableCache[cache_type].available = true;
        LocationAPIVariableCache[cache_type].data = final_result;
      }
      return final_result;
    } else {
      if (!LocationAPIVariableCache[cache_type].available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        LocationAPIVariableCache[cache_type].available = true;
        LocationAPIVariableCache[cache_type].data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getLocation_0', 0, true);
      setDataReceivingProgress(requestID, 'getLocation_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return LocationAPIVariableCache[cache_type].data;
    }
  }
}

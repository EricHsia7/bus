import { getAPIURL } from './getURL.ts';
import { fetchData } from '../loader.ts';
const localforage = require('localforage');

function simplifyRoute(Route: object): object {
  var result = {};
  let RouteRename = [
    { original: 'providerid', rename: false },
    { original: 'providerName', rename: false },
    { original: 'nameZh', newName: 'n', rename: true },
    { original: 'nameEn', rename: false },
    { original: 'aliasName', rename: false },
    { original: 'pathAttributeid', newName: 'pid', rename: true },
    { original: 'pathAttributeName', rename: false },
    { original: 'pathAttributeEname', rename: false },
    { original: 'buildPeriod', rename: false },
    { original: 'departureZh', newName: 'dep', rename: true },
    { original: 'destinationZh', newName: 'des', rename: true },
    { original: 'departureEn', rename: false },
    { original: 'destinationEn', rename: false },
    { original: 'goFirstBusTime', rename: false },
    { original: 'goLastBusTime', rename: false },
    { original: 'backFirstBusTime', rename: false },
    { original: 'backLastBusTime', rename: false },
    { original: 'offPeakHeadway', rename: false },
    { original: 'roadMapUrl', rename: false },
    { original: 'headwayDesc', rename: false },
    { original: 'holidayGoFirstBusTime', rename: false },
    { original: 'holidayBackFirstBusTime', rename: false },
    { original: 'holidayBackLastBusTime', rename: false },
    { original: 'holidayGoLastBusTime', rename: false },
    { original: 'holidayBusTimeDesc', rename: false },
    { original: 'realSequence', rename: false },
    { original: 'holidayHeadwayDesc', rename: false },
    { original: 'holidayOffPeakHeadway', rename: false },
    { original: 'holidayPeakHeadway', rename: false },
    { original: 'segmentBufferEn', rename: false },
    { original: 'ticketPriceDescriptionZh', rename: false },
    { original: 'ticketPriceDescriptionEn', rename: false },
    { original: 'peakHeadway', rename: false },
    { original: 'ttiaPathid', rename: false },
    { original: 'segmentBufferZh', newName: 's', rename: true },
    { original: 'busTimeDesc', rename: false },
    { original: 'distance', rename: false },
    { original: 'Nid', rename: false },
    { original: 'genus', rename: false },
    { original: 'id', rename: true, newName:'id'}
  ];

  for (var item of Route) {
    //rename the properties' key
    for (var toRename of RouteRename) {
      if (item.hasOwnProperty(toRename.original)) {
        if (toRename.rename) {
          //copy the original property to renamed path
          item[toRename.newName] = item[toRename.original];
        }
        delete item[toRename.original];
      }
    }
    item.pid = [item.pid];

    if (!result.hasOwnProperty('r_' + item.id)) {
      result['r_' + item.id] = item;
    } else {
      result['r_' + item.id]['pid'] = result['r_' + item.id]['pid'].concat(item.pid);
    }
  }
  return result;
}

export async function getRoute() {
  async function getData() {
    var apis = [
      [0, 10],
      [1, 10]
    ].map((e) => getAPIURL(e[0], e[1]));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api);
      result = result.concat(data.BusInfo);
    }
    return result;
  }
  var cache_time = 60 * 60 * 24 * 1 * 1000;
  var cache_key = 'bus_route_cache';
  var cached_time = await localforage.getItem(`${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = simplifyRoute(result);
    await localforage.setItem(`${cache_key}_timestamp`, new Date().getTime());
    await localforage.setItem(`${cache_key}`, JSON.stringify(simplified_result));
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = simplifyRoute(result);
      await localforage.setItem(`${cache_key}_timestamp`, new Date().getTime());
      await localforage.setItem(`${cache_key}`, JSON.stringify(simplified_result));
      return simplified_result;
    } else {
      var cache = await localforage.getItem(`${cache_key}`);
      return JSON.parse(cache);
    }
  }
}

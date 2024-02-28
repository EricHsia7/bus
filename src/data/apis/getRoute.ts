import { getAPIURL } from './getURL.ts';
import { fetchData } from '../loader.ts';
const localforage = require('localforage');

function simplifyRoute(Route: object): object {
  var result = {};
  let RouteShortName = [
    { original: 'providerId', shorten: false },
    { original: 'providerName', shorten: false },
    { original: 'nameZh', short: 'n', shorten: true },
    { original: 'nameEn', shorten: false },
    { original: 'aliasName', shorten: false },
    { original: 'pathAttributeId', short: 'pid', shorten: true },
    { original: 'pathAttributeName', shorten: false },
    { original: 'pathAttributeEname', shorten: false },
    { original: 'buildPeriod', shorten: false },
    { original: 'departureZh', short: 'dep', shorten: true },
    { original: 'destinationZh', short: 'des', shorten: true },
    { original: 'departureEn', shorten: false },
    { original: 'destinationEn', shorten: false },
    { original: 'goFirstBusTime', shorten: false },
    { original: 'goLastBusTime', shorten: false },
    { original: 'backFirstBusTime', shorten: false },
    { original: 'backLastBusTime', shorten: false },
    { original: 'offPeakHeadway', shorten: false },
    { original: 'roadMapUrl', shorten: false },
    { original: 'headwayDesc', shorten: false },
    { original: 'holidayGoFirstBusTime', shorten: false },
    { original: 'holidayBackFirstBusTime', shorten: false },
    { original: 'holidayBackLastBusTime', shorten: false },
    { original: 'holidayGoLastBusTime', shorten: false },
    { original: 'holidayBusTimeDesc', shorten: false },
    { original: 'realSequence', shorten: false },
    { original: 'holidayHeadwayDesc', shorten: false },
    { original: 'holidayOffPeakHeadway', shorten: false },
    { original: 'holidayPeakHeadway', shorten: false },
    { original: 'segmentBufferEn', shorten: false },
    { original: 'ticketPriceDescriptionZh', shorten: false },
    { original: 'ticketPriceDescriptionEn', shorten: false },
    { original: 'peakHeadway', shorten: false },
    { original: 'ttiaPathId', shorten: false },
    { original: 'segmentBufferZh', short: 's', shorten: true },
    { original: 'busTimeDesc', shorten: false },
    { original: 'distance', shorten: false },
    { original: 'NId', shorten: false },
    { original: 'genus', shorten: false },
    { original: 'Id', shorten: false }
  ];

  for (var item of Route) {
    //shorten the properties' key
    for (toShorten of RouteShortName) {
      if (item.hasOwnProperty(toShorten.original)) {
        if (toShorten.shorten) {
          //copy the original property to shorted path
          item[toShorten.short] = item[toShorten.original];
        }
        delete item[toShorten.original];
      }
    }

    if (!result.hasOwnProperty('r_' + item.Id)) {
      item.pid = [item.pid];
      result['r_' + item.Id] = item;
    } else {
      if (!item.pid.indexOf(result['r_' + item.Id]['pid'])) {
        result['r_' + item.Id]['pid'] = result['r_' + item.Id]['pid'].concat(item.pid);
      }
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

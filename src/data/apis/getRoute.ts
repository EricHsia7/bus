import { getAPIURL } from './getURL.ts';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from './loader.ts';
import { lfSetItem, lfGetItem } from '../storage/index.ts';

var RouteAPIVariableCache = { available: false, data: {} };

function simplifyRoute(Route: object): object {
  var result = {};
  let RouteRename = [
    { original: 'providerId', rename: true, newName: 'pd' },
    { original: 'providerName', rename: false },
    { original: 'nameZh', newName: 'n', rename: true },
    { original: 'nameEn', rename: false },
    { original: 'aliasName', rename: false },
    { original: 'pathAttributeId', newName: 'pid', rename: true },
    { original: 'pathAttributeNId', rename: false },
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
    { original: 'ttiaPathId', rename: false },
    { original: 'segmentBufferZh', newName: 's', rename: true },
    { original: 'busTimeDesc', rename: false },
    { original: 'distance', rename: false },
    { original: 'NId', rename: false },
    { original: 'genus', rename: false },
    { original: 'Id', rename: true, newName: 'id' }
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

export async function getRoute(requestID: string, simplify: boolean = true): object | [] {
  async function getData() {
    var apis = [
      [0, 10],
      [1, 10]
    ].map((e) => getAPIURL(e[0], e[1]));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api, requestID, 'getRoute');
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }
  if (simplify === false) {
    return await getData();
  }
  var cache_time = 60 * 60 * 24 * 1 * 1000;
  var cache_key = 'bus_route_cache';
  var cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    var simplified_result = simplifyRoute(result);
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
    if (!RouteAPIVariableCache.available) {
      RouteAPIVariableCache.available = true;
      RouteAPIVariableCache.data = simplified_result;
    }
    return simplified_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      var simplified_result = simplifyRoute(result);
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(simplified_result));
      if (!RouteAPIVariableCache.available) {
        RouteAPIVariableCache.available = true;
        RouteAPIVariableCache.data = simplified_result;
      }
      return simplified_result;
    } else {
      if (!RouteAPIVariableCache.available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        RouteAPIVariableCache.available = true;
        RouteAPIVariableCache.data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getRoute', 0, true);
      setDataUpdateTime(requestID, -1);
      return RouteAPIVariableCache.data;
    }
  }
}

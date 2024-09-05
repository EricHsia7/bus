import { Route, SimplifiedRoute } from './index';

self.onmessage = function (event) {
  const result = simplifyRoute_worker(event.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyRoute_worker(Route: Route): SimplifiedRoute {
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
    { original: 'segmentBufferZh', rename: false },
    { original: 'busTimeDesc', rename: false },
    { original: 'distance', rename: false },
    { original: 'NId', rename: false },
    /*{ original: 'genus', rename: false },*/
    { original: 'routeType', rename: false },
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

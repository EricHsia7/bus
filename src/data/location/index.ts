import { dataUpdateTime, deleteDataReceivingProgress, deleteDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { getEstimateTime } from '../apis/getEstimateTime/index';
import { getLocation } from '../apis/getLocation/index';
import { getBusEvent } from '../apis/getBusEvent/index';
import { getRoute } from '../apis/getRoute/index';
import { getStop } from '../apis/getStop/index';
import { getSettingOptionValue } from '../settings/index';
import { searchRouteByPathAttributeId } from '../search/searchRoute';
import { addressToString, generateLabelFromAddresses } from '../../tools/address';
import { generateDirectionLabels, generateLetterLabels } from '../../tools/index';
import { parseEstimateTime, formatBusEvent } from '../apis/index';
import { recordEstimateTime } from '../analytics/update-rate';

async function processBusEvent2(BusEvent: Array, StopIDs: Array<number>): Promise<object> {
  var result = {};
  for (var item of BusEvent) {
    var thisStopID = parseInt(item.StopID);
    var thisRouteID = parseInt(item.RouteID);
    if (StopIDs.indexOf(thisStopID) > -1) {
      item.onThisRoute = true;
      item.index = String(item.BusID).charCodeAt(0) * Math.pow(10, -5);
      var searchRouteResult = await searchRouteByPathAttributeId(thisRouteID);
      item.RouteName = searchRouteResult.length > 0 ? searchRouteResult[0].n : '';
      if (!result.hasOwnProperty('s_' + item.StopID)) {
        result['s_' + item.StopID] = [item];
      } else {
        result['s_' + item.StopID].push(item);
      }
    }
  }
  for (var key in result) {
    result[key] = result[key].sort(function (a, b) {
      return a.index - b.index;
    });
  }
  return result;
}

function processEstimateTime2(EstimateTime: Array, StopIDs: Array<number>): object {
  var result = {};
  for (var item of EstimateTime) {
    if (StopIDs.indexOf(parseInt(item.StopID)) > -1) {
      result[`s_${item.StopID}`] = item;
    }
  }
  return result;
}

export async function integrateLocation(hash: string, requestID: string): Promise<object> {
  setDataReceivingProgress(requestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(requestID, 'getStop_0', 0, false);
  setDataReceivingProgress(requestID, 'getStop_1', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_0', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_1', 0, false);
  var EstimateTime = await getEstimateTime(requestID);
  var Location = await getLocation(requestID, true);
  var Route = await getRoute(requestID, true);
  var Stop = await getStop(requestID);
  var BusEvent = await getBusEvent(requestID);
  var time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  var location_labels = getSettingOptionValue('location_labels');
  var groupedItems = {};
  var itemQuantity = {};
  var groups = {};

  var LocationKey = `ml_${hash}`;
  var thisLocation = Location[LocationKey];
  var thisLocationName = thisLocation.n;
  var stopLocationIds = thisLocation.id;
  var setsOfVectors = thisLocation.v;

  var StopIDs = [];
  var RouteIDs = [];
  var stopLocationQuantity = stopLocationIds.length;

  for (var i = 0; i < stopLocationQuantity; i++) {
    StopIDs = StopIDs.concat(thisLocation.s[i]);
    RouteIDs = RouteIDs.concat(thisLocation.r[i]);
  }
  var processedEstimateTime = processEstimateTime2(EstimateTime, StopIDs);
  var processedBusEvent = await processBusEvent2(BusEvent, StopIDs);
  var labels = [];
  switch (location_labels) {
    case 'address':
      labels = generateLabelFromAddresses(thisLocation.a);

      break;
    case 'letters':
      labels = generateLetterLabels(stopLocationQuantity);
      break;
    case 'directions':
      labels = generateDirectionLabels(setsOfVectors);
      break;
    default:
      break;
  }

  for (var i = 0; i < stopLocationQuantity; i++) {
    var groupKey = `g_${i}`;
    groupedItems[groupKey] = [];
    itemQuantity[groupKey] = 0;
    groups[groupKey] = {
      name: labels[i],
      properties: [
        {
          key: 'address',
          icon: 'personal_places',
          value: addressToString(thisLocation.a[i])
        },
        {
          key: 'exact_position',
          icon: 'location_on',
          value: `${thisLocation.la[i].toFixed(5)}, ${thisLocation.lo[i].toFixed(5)}`
        }
      ]
    };
    var stopQuantity = thisLocation.s[i].length;
    for (var o = 0; o < stopQuantity; o++) {
      var thisStopID = thisLocation.s[i][o];
      var thisStop: SimplifiedStopItem = Stop[`s_${thisStopID}`];
      var thisRouteID: number = thisLocation.r[i][o];
      var thisRoute: SimplifiedRouteItem = Route[`r_${thisRouteID}`];
      var thisProcessedEstimateTime = processedEstimateTime[`s_${thisStopID}`];
      var thisProcessedBusEvent = processedBusEvent[`s_${thisStopID}`];
      if (Stop.hasOwnProperty(`s_${thisStopID}`) && Route.hasOwnProperty(`r_${thisRouteID}`)) {
        var formattedItem = {};
        formattedItem.status = processedEstimateTime.hasOwnProperty(`s_${thisStopID}`) ? parseEstimateTime(thisProcessedEstimateTime.EstimateTime, time_formatting_mode) : null;
        formattedItem.buses = processedBusEvent.hasOwnProperty(`s_${thisStopID}`) ? formatBusEvent(thisProcessedBusEvent) : null;
        formattedItem.route_name = thisRoute.n;
        formattedItem.route_direction = `往${[thisRoute.des, thisRoute.dep, ''][parseInt(thisStop.goBack)]}`;
        formattedItem.routeId = thisRouteID;
        groupedItems[groupKey].push(formattedItem);
        itemQuantity[groupKey] = itemQuantity[groupKey] + 1;
      }
    }
  }
  for (var key in groupedItems) {
    groupedItems[key] = groupedItems[key].sort(function (a, b) {
      return a.routeId - b.routeId;
    });
  }
  var result = {
    groupedItems: groupedItems,
    groups: groups,
    groupQuantity: stopLocationQuantity,
    itemQuantity: itemQuantity,
    LocationName: thisLocationName,
    dataUpdateTime: dataUpdateTime[requestID]
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  await recordEstimateTime(EstimateTime);
  return result;
}

import { dataUpdateTime, deleteDataReceivingProgress, deleteDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { EstimateTimeItem, getEstimateTime } from '../apis/getEstimateTime/index';
import { getLocation } from '../apis/getLocation/index';
import { getBusEvent } from '../apis/getBusEvent/index';
import { getRoute } from '../apis/getRoute/index';
import { getStop } from '../apis/getStop/index';
import { getSettingOptionValue } from '../settings/index';
import { searchRouteByPathAttributeId } from '../search/index';
import { addressToString, generateLabelFromAddresses } from '../../tools/address';
import { generateDirectionLabels, generateLetterLabels } from '../../tools/index';
import { parseEstimateTime, formatBusEvent } from '../apis/index';

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
  const EstimateTime = await getEstimateTime(requestID);
  const Location = await getLocation(requestID, true);
  const Route = await getRoute(requestID, true);
  const Stop = await getStop(requestID);
  const BusEvent = await getBusEvent(requestID);
  const time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  const location_labels = getSettingOptionValue('location_labels');
  let groupedItems = {};
  let itemQuantity = {};
  let groups = {};

  const thisLocationKey = `ml_${hash}`;
  const thisLocation = Location[thisLocationKey];
  const thisLocationName = thisLocation.n;
  const stopLocationIds = thisLocation.id;
  const setsOfVectors = thisLocation.v;

  let StopIDs = [];
  let RouteIDs = [];
  const stopLocationQuantity = stopLocationIds.length;

  for (let i = 0; i < stopLocationQuantity; i++) {
    StopIDs = StopIDs.concat(thisLocation.s[i]);
    RouteIDs = RouteIDs.concat(thisLocation.r[i]);
  }

  const processedEstimateTime = processEstimateTime2(EstimateTime, StopIDs);
  const processedBusEvent = await processBusEvent2(BusEvent, StopIDs);

  let labels = [];
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

  for (let i = 0; i < stopLocationQuantity; i++) {
    const groupKey = `g_${i}`;
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
    const stopQuantity = thisLocation.s[i].length;
    for (let o = 0; o < stopQuantity; o++) {
      let integratedItem = {};
      // collect data from 'Stop'
      const thisStopID = thisLocation.s[i][o];
      const thisStopKey = `s_${thisStopID}`;
      let thisStop: SimplifiedStopItem = {};
      if (Stop.hasOwnProperty(thisStopKey)) {
        thisStop = Stop[thisStopKey];
      } else {
        continue;
      }

      // collect data from 'Route'
      const thisRouteID: number = thisLocation.r[i][o];
      const thisRouteKey = `r_${thisRouteID}`;
      let thisRoute: SimplifiedRouteItem = {};
      if (Route.hasOwnProperty(thisRouteKey)) {
        thisRoute = Route[thisRouteKey];
      } else {
        continue;
      }
      integratedItem.route_name = thisRoute.n;
      integratedItem.route_direction = `往${[thisRoute.des, thisRoute.dep, ''][parseInt(thisStop.goBack)]}`;
      integratedItem.routeId = thisRouteID;

      // collect data from 'processedEstimateTime'
      let thisProcessedEstimateTime: EstimateTimeItem = {};
      if (processedEstimateTime.hasOwnProperty(thisStopKey)) {
        thisProcessedEstimateTime = processedEstimateTime[thisStopKey];
      }
      integratedItem.status = parseEstimateTime(thisProcessedEstimateTime?.EstimateTime, time_formatting_mode);

      // collect data from 'processedBusEvent'
      let thisProcessedBusEvent = [];
      if (processedBusEvent.hasOwnProperty(thisStopKey)) {
        thisProcessedBusEvent = processedBusEvent[thisStopKey];
      }
      integratedItem.buses = formatBusEvent(thisProcessedBusEvent);

      groupedItems[groupKey].push(integratedItem);
      itemQuantity[groupKey] = itemQuantity[groupKey] + 1;
    }
  }
  for (const key in groupedItems) {
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
  //await recordEstimateTimeForUpdateRate(EstimateTime);
  return result;
}

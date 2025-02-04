import { deleteDataReceivingProgress, deleteDataUpdateTime, getDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { EstimateTimeItem, getEstimateTime } from '../apis/getEstimateTime/index';
import { getLocation } from '../apis/getLocation/index';
import { BusEvent, BusEventItem, getBusEvent } from '../apis/getBusEvent/index';
import { getRoute } from '../apis/getRoute/index';
import { getStop } from '../apis/getStop/index';
import { getSettingOptionValue } from '../settings/index';
import { searchRouteByPathAttributeId } from '../search/index';
import { addressToString, generateLabelFromAddresses } from '../../tools/address';
import { generateDirectionLabels, generateLetterLabels } from '../../tools/labels';
import { parseEstimateTime, formatBusEvent, FormattedBus, EstimateTimeStatus } from '../apis/index';
import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { AggregatedBusArrivalTime, getBusArrivalTimes } from '../analytics/bus-arrival-time';

interface processedBusEventItem2 extends BusEventItem {
  onThisRoute: boolean;
  index: number;
  RouteName: string;
}

type processedBusEvent2 = {
  [key: string]: processedBusEventItem2;
};

export interface LocationGroupProperty {
  key: string;
  icon: MaterialSymbols;
  value: string;
}

export interface LocationGroup {
  name: string;
  properties: Array<LocationGroupProperty>;
}

export interface IntegratedLocationItemRank {
  number: number;
  code: -1 | 0 | 1 | 2 | 3; // -1: not applicable 0: 0-25%, 1: 25-50%, 2: 50-75%, 3: 75-100%
}

export interface IntegratedLocationItem {
  route_name: string;
  route_direction: string;
  routeId: number;
  stopId: number;
  status: EstimateTimeStatus;
  rank: IntegratedLocationItemRank;
  buses: Array<FormattedBus>;
  busArrivalTimes: Array<AggregatedBusArrivalTime>;
}

export interface IntegratedLocation {
  groupedItems: {
    [key: string]: Array<IntegratedLocationItem>;
  };
  groups: {
    [key: string]: LocationGroup;
  };
  groupQuantity: number;
  itemQuantity: {
    [key: string]: number;
  };
  LocationName: string;
  dataUpdateTime: number;
}

async function processBusEvent2(BusEvent: BusEvent, StopIDs: Array<number>): Promise<processedBusEvent2> {
  let result: processedBusEvent2 = {};
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

export async function integrateLocation(hash: string, requestID: string): Promise<IntegratedLocation> {
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
  const BusArrivalTimes = await getBusArrivalTimes();

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  const location_labels = getSettingOptionValue('location_labels');

  let groupedItems = {} as IntegratedLocation['groupedItems'];
  let itemQuantity = {} as IntegratedLocation['itemQuantity'];
  let groups = {} as IntegratedLocation['groups'];

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

  let ranking: {
    [key: string]: Array<[number, number]>;
  } = {}; // StopID, EstimateTime

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
    ranking[groupKey] = [];
    const stopQuantity = thisLocation.s[i].length;
    for (let o = 0; o < stopQuantity; o++) {
      let integratedItem = {};
      // Collect data from 'Stop'
      const thisStopID = thisLocation.s[i][o];
      const thisStopKey = `s_${thisStopID}`;
      let thisStop: SimplifiedStopItem = {};
      if (Stop.hasOwnProperty(thisStopKey)) {
        thisStop = Stop[thisStopKey];
      } else {
        continue;
      }
      integratedItem.stopId = thisStopID;

      // Collect data from 'Route'
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

      // Collect data from 'processedEstimateTime'
      let thisProcessedEstimateTime: EstimateTimeItem = {};
      if (processedEstimateTime.hasOwnProperty(thisStopKey)) {
        thisProcessedEstimateTime = processedEstimateTime[thisStopKey];
      }
      const parsedEstimateTime = parseEstimateTime(thisProcessedEstimateTime?.EstimateTime, time_formatting_mode);
      integratedItem.status = parsedEstimateTime;
      if (parsedEstimateTime.time >= 0) {
        ranking[groupKey].push([thisStopID, parsedEstimateTime.time]);
      }

      // Collect data from 'processedBusEvent'
      let thisProcessedBusEvent = [];
      if (processedBusEvent.hasOwnProperty(thisStopKey)) {
        thisProcessedBusEvent = processedBusEvent[thisStopKey];
      }
      integratedItem.buses = formatBusEvent(thisProcessedBusEvent);

      // Collect data from 'BusArrivalTimes'
      let thisBusArrivalTimes = {};
      if (BusArrivalTimes.hasOwnProperty(thisStopKey)) {
        thisBusArrivalTimes = BusArrivalTimes[thisStopKey];
      }
      let flattenBusArrivalTimes = [];
      for (const personalScheduleID in thisBusArrivalTimes) {
        flattenBusArrivalTimes = flattenBusArrivalTimes.concat(thisBusArrivalTimes[personalScheduleID].busArrivalTimes);
      }
      integratedItem.busArrivalTimes = flattenBusArrivalTimes;

      groupedItems[groupKey].push(integratedItem);
      itemQuantity[groupKey] += 1;
    }
  }

  for (const key in groupedItems) {
    ranking[key].sort(function (a, b) {
      return a[1] - b[1];
    });
    const thisRankingLength = ranking[key].length;
    groupedItems[key] = groupedItems[key]
      .map((item: IntegratedLocationItem) => {
        const thisRankingIndex = ranking[key].findIndex((subArray) => subArray[0] === item.stopId && subArray[1] === item.status.time);
        const thisRankingRatio = (thisRankingIndex + 1) / thisRankingLength;
        let thisRankingCode = -1;
        if (0 < thisRankingRatio && thisRankingRatio <= 0.25) {
          thisRankingCode = 0;
        }
        if (0.25 < thisRankingRatio && thisRankingRatio <= 0.5) {
          thisRankingCode = 1;
        }
        if (0.5 < thisRankingRatio && thisRankingRatio <= 0.75) {
          thisRankingCode = 2;
        }
        if (0.75 < thisRankingRatio && thisRankingRatio <= 1) {
          thisRankingCode = 3;
        }
        return {
          route_name: item.route_name,
          route_direction: item.route_direction,
          routeId: item.routeId,
          stopId: item.stopId,
          status: item.status,
          rank: {
            number: thisRankingIndex + 1,
            code: thisRankingCode
          },
          buses: item.buses,
          busArrivalTimes: item.busArrivalTimes
        };
      })
      .sort(function (a, b) {
        return a.routeId - b.routeId;
      });
  }
  const result: IntegratedLocation = {
    groupedItems: groupedItems,
    groups: groups,
    groupQuantity: stopLocationQuantity,
    itemQuantity: itemQuantity,
    LocationName: thisLocationName,
    dataUpdateTime: getDataUpdateTime(requestID)
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  //await recordEstimateTimeForUpdateRate(EstimateTime);
  return result;
}

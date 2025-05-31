import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { addressToString, generateLabelFromAddresses } from '../../tools/address';
import { CardinalDirection, getCardinalDirectionFromVector } from '../../tools/cardinal-direction';
import { generateDirectionLabels, generateLetterLabels } from '../../tools/labels';
import { normalizeVector } from '../../tools/math';
import { BusArrivalTime, getBusArrivalTimes } from '../analytics/bus-arrival-time/index';
import { getBusData } from '../apis/getBusData/index';
import { getBusEvent } from '../apis/getBusEvent/index';
import { EstimateTime, EstimateTimeItem, getEstimateTime } from '../apis/getEstimateTime/index';
import { getLocation, MergedLocation } from '../apis/getLocation/index';
import { getRoute, SimplifiedRoute } from '../apis/getRoute/index';
import { getStop } from '../apis/getStop/index';
import { batchFindBusesForLocation, EstimateTimeStatus, formatBus, FormattedBus, parseEstimateTime } from '../apis/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime, getDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { getSettingOptionValue } from '../settings/index';
import { getUserOrientation } from '../user-orientation/index';

interface BatchFoundEstimateTimeItem extends EstimateTimeItem {}

type BatchFoundEstimateTime = {
  [key: string]: BatchFoundEstimateTimeItem;
};

function batchFindEstimateTime(EstimateTime: EstimateTime, StopIDList: Array<number>): BatchFoundEstimateTime {
  const result = {};
  for (const item of EstimateTime) {
    if (StopIDList.indexOf(item.StopID) > -1) {
      const thisStopKey: string = `s_${item.StopID}`;
      result[thisStopKey] = item;
    }
  }
  return result;
}

type BatchFoundEstimateTimeRanking = {
  [key: string]: IntegratedLocationItemRanking;
};

function rankBatchFoundEstimateTime(batchFoundEstimateTime: BatchFoundEstimateTime, StopIDList: Array<number>): BatchFoundEstimateTimeRanking {
  // StopIDList act as a secondary filter
  const result: BatchFoundEstimateTimeRanking = {};
  const rankingArray: Array<[number, number]> = []; // StopID, EstimateTime
  for (const thisStopKey in batchFoundEstimateTime) {
    const thisBatchFoundEstimateTimeItem = batchFoundEstimateTime[thisStopKey];
    const thisStopID = thisBatchFoundEstimateTimeItem.StopID;
    const thisEstimateTime = parseInt(thisBatchFoundEstimateTimeItem.EstimateTime);
    if (thisEstimateTime >= 0 && StopIDList.indexOf(thisStopID) > -1) {
      rankingArray.push([thisStopID, thisEstimateTime]);
    }
  }
  const rankingArrayLength = rankingArray.length;
  rankingArray.sort(function (a, b) {
    return a[1] - b[1];
  });
  let index = 1;
  for (const rankingItem of rankingArray) {
    // Classify into 4 groups and give a code
    const rankingRatio = index / rankingArrayLength;
    const rankingCode = (rankingRatio - (rankingRatio % 0.25)) / 0.25;
    const thisStopID = rankingItem[0];
    const thisStopKey = `s_${thisStopID}`;
    result[thisStopKey] = {
      number: index,
      text: index.toString(),
      code: rankingCode
    };
    index += 1;
  }
  return result;
}

export interface LocationGroupProperty {
  key: string;
  icon: MaterialSymbols;
  value: string;
}

export interface LocationGroup {
  name: string;
  properties: Array<LocationGroupProperty>;
}

export interface IntegratedLocationItemRanking {
  number: number;
  text: '--' | string;
  code: -1 | 0 | 1 | 2 | 3 | 4; // -1: not applicable, 0: 0-25%, 1: 25-50%, 2: 50-75%, 3: 75-100%, 4: 100%
}

export interface IntegratedLocationItem {
  route_name: string;
  route_direction: string;
  routeId: number;
  stopId: number;
  status: EstimateTimeStatus;
  ranking: IntegratedLocationItemRanking;
  buses: Array<FormattedBus>;
  busArrivalTimes: Array<BusArrivalTime>;
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
  hash: string
}

export async function integrateLocation(hash: string, chartWidth: number, chartHeight: number, requestID: string): Promise<IntegratedLocation> {
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
  const Location = (await getLocation(requestID, 1)) as MergedLocation;
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  const Stop = await getStop(requestID);
  const BusEvent = await getBusEvent(requestID);
  const BusData = await getBusData(requestID);
  const BusArrivalTimes = await getBusArrivalTimes(chartWidth, chartHeight);

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  const location_labels = getSettingOptionValue('location_labels');
  const display_user_orientation = getSettingOptionValue('display_user_orientation');

  const groupedItems = {} as IntegratedLocation['groupedItems'];
  const itemQuantity = {} as IntegratedLocation['itemQuantity'];
  const groups = {} as IntegratedLocation['groups'];

  const userOrientation = getUserOrientation();

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

  const batchFoundEstimateTime = batchFindEstimateTime(EstimateTime, StopIDs);
  const batchFoundBuses = batchFindBusesForLocation(BusEvent, BusData, Route, StopIDs);

  const cardinalDirections: Array<CardinalDirection> = [];
  for (const vectorSet of setsOfVectors) {
    let x: number = 0;
    let y: number = 0;
    for (const vector of vectorSet) {
      x += vector[0];
      y += vector[1];
    }
    const meanVector = normalizeVector([x, y]);
    const cardinalDirection = getCardinalDirectionFromVector(meanVector);
    cardinalDirections.push(cardinalDirection);
  }

  let labels: Array<string> = [];
  switch (location_labels) {
    case 'address':
      labels = generateLabelFromAddresses(thisLocation.a);
      break;
    case 'letters':
      labels = generateLetterLabels(stopLocationQuantity);
      break;
    case 'directions':
      labels = generateDirectionLabels(cardinalDirections);
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
        },
        {
          key: 'cardinal_direction',
          icon: cardinalDirections[i].icon,
          value: `${cardinalDirections[i].name}${display_user_orientation && userOrientation.cardinalDirection.id !== -1 && userOrientation.cardinalDirection.id === cardinalDirections[i].id ? '（目前指向）' : ''}`
        }
      ]
    };

    const thisGroupStops = thisLocation.s[i];
    const stopQuantity = thisGroupStops.length;
    const thisGroupRanking = rankBatchFoundEstimateTime(batchFoundEstimateTime, thisGroupStops);

    for (let o = 0; o < stopQuantity; o++) {
      const integratedItem = {} as IntegratedLocationItem;
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

      // Collect data from 'thisGroupRanking'
      let thisItemRanking = { number: 0, text: '--', code: -1 } as IntegratedLocationItemRanking;
      if (thisGroupRanking.hasOwnProperty(thisStopKey)) {
        thisItemRanking = thisGroupRanking[thisStopKey];
      }
      integratedItem.ranking = thisItemRanking;

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

      // Collect data from 'batchFoundEstimateTime'
      let thisEstimateTime = {} as EstimateTimeItem;
      if (batchFoundEstimateTime.hasOwnProperty(thisStopKey)) {
        thisEstimateTime = batchFoundEstimateTime[thisStopKey];
      } else {
        continue;
      }
      const parsedEstimateTime = parseEstimateTime(thisEstimateTime.EstimateTime, time_formatting_mode);
      integratedItem.status = parsedEstimateTime;

      // Collect data from 'batchFoundBuses'
      let buses = [];
      if (batchFoundBuses.hasOwnProperty(thisStopKey)) {
        buses = batchFoundBuses[thisStopKey].map((e) => formatBus(e));
      }
      integratedItem.buses = buses;

      // Collect data from 'BusArrivalTimes'
      let thisBusArrivalTimes = [];
      if (BusArrivalTimes.hasOwnProperty(thisStopKey)) {
        thisBusArrivalTimes = BusArrivalTimes[thisStopKey];
      }
      integratedItem.busArrivalTimes = thisBusArrivalTimes;

      groupedItems[groupKey].push(integratedItem);
      itemQuantity[groupKey] += 1;
    }
  }

  for (const key in groupedItems) {
    groupedItems[key].sort(function (a, b) {
      return a.routeId - b.routeId;
    });
    /*
      .map((item: IntegratedLocationItem) => {
        // accessing ranking[key] inside map callback will cause constant violations any way
        return {
          route_name: item.route_name,
          route_direction: item.route_direction,
          routeId: item.routeId,
          stopId: item.stopId,
          status: item.status,
          rank: {
            number: thisRankingIndex + 1,
            code: 0
          },
          buses: item.buses,
          busArrivalTimes: item.busArrivalTimes
        };
      })*/
  }
  const result: IntegratedLocation = {
    groupedItems: groupedItems,
    groups: groups,
    groupQuantity: stopLocationQuantity,
    itemQuantity: itemQuantity,
    LocationName: thisLocationName,
    hash: hash,
    dataUpdateTime: getDataUpdateTime(requestID)
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  //await recordEstimateTimeForUpdateRate(EstimateTime);
  return result;
}

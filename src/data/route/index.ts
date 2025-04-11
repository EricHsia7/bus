import { convertPositionsToDistance } from '../../tools/convert';
import { BusArrivalTime, getBusArrivalTimes } from '../analytics/bus-arrival-time/index';
import { getBusData } from '../apis/getBusData/index';
import { getBusEvent } from '../apis/getBusEvent/index';
import { getEstimateTime } from '../apis/getEstimateTime/index';
import { getLocation, IndexedLocation, IndexedLocationItem, MergedLocation, SimplifiedLocation, SimplifiedLocationItem } from '../apis/getLocation/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { getSegmentBuffers, SimplifiedSegmentBufferItem } from '../apis/getSegmentBuffers/index';
import { getStop, SimplifiedStopItem } from '../apis/getStop/index';
import { batchFindBusesForRoute, EstimateTimeStatus, formatBus, FormattedBus, parseEstimateTime } from '../apis/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime, getDataUpdateTime, setDataReceivingProgress } from '../apis/loader';
import { getSettingOptionValue } from '../settings/index';
import { getNearestPosition } from '../user-position/index';

interface formattedOverlappingRoute {
  name: string;
  RouteEndPoints: {
    RouteDeparture: string;
    RouteDestination: string;
    text: string;
    html: string;
  };
  RouteID: number;
  PathAttributeId: Array<number>;
}

export interface integratedStopItemPosition {
  longitude: number;
  latitude: number;
}

export interface integratedStopItemSegmentBuffer {
  isSegmentBuffer: boolean;
  isStartingPoint: boolean;
  isEndingPoint: boolean;
}

export interface integratedStopItemNearbyLocationItem {
  name: string;
  distance: number;
  hash: string;
}

export interface integratedStopItem {
  name: string;
  goBack: '0' | '1' | '2';
  status: EstimateTimeStatus;
  buses: Array<FormattedBus>;
  overlappingRoutes: Array<formattedOverlappingRoute>;
  busArrivalTimes: Array<BusArrivalTime>;
  nearbyLocations: Array<integratedStopItemNearbyLocationItem>;
  sequence: number;
  position: integratedStopItemPosition;
  nearest: boolean;
  segmentBuffer: integratedStopItemSegmentBuffer;
  progress: number;
  id: number;
}

export interface IntegratedRoute {
  groupedItems: { [key: string]: Array<integratedStopItem> };
  groupQuantity: number;
  itemQuantity: { [key: string]: number };
  RouteName: string;
  RouteEndPoints: {
    RouteDeparture: string;
    RouteDestination: string;
  };
  dataUpdateTime: number;
  RouteID: number;
  PathAttributeId: Array<number>;
}

export async function integrateRoute(RouteID: number, PathAttributeId: Array<number>, chartWidth: number, chartHeight: number, requestID: string): Promise<IntegratedRoute> {
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(requestID, 'getStop_0', 0, false);
  setDataReceivingProgress(requestID, 'getStop_1', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(requestID, 'getSegmentBuffers_0', 0, false);
  setDataReceivingProgress(requestID, 'getSegmentBuffers_1', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_0', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_1', 0, false);
  setDataReceivingProgress(requestID, 'getBusData_0', 0, false);
  setDataReceivingProgress(requestID, 'getBusData_1', 0, false);
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  const Stop = await getStop(requestID);
  const SimplifiedLocation = (await getLocation(requestID, 0)) as SimplifiedLocation;
  const MergedLocation = (await getLocation(requestID, 1)) as MergedLocation;
  const IndexedLocation = (await getLocation(requestID, 2)) as IndexedLocation;
  const SegmentBuffers = await getSegmentBuffers(requestID);
  const EstimateTime = await getEstimateTime(requestID);
  const BusEvent = await getBusEvent(requestID);
  const BusData = await getBusData(requestID);
  const BusArrivalTimes = await getBusArrivalTimes(chartWidth, chartHeight);

  const batchFoundBuses = batchFindBusesForRoute(BusEvent, BusData, Route, RouteID, PathAttributeId);

  let hasSegmentBuffers: boolean = false;
  let thisSegmentBuffers: SimplifiedSegmentBufferItem = {};
  if (SegmentBuffers.hasOwnProperty(`r_${RouteID}`)) {
    hasSegmentBuffers = true;
    thisSegmentBuffers = SegmentBuffers[`r_${RouteID}`];
  }

  const time_formatting_mode = getSettingOptionValue('time_formatting_mode') as number;

  let result = [];
  let positions = [];

  for (const item of EstimateTime) {
    let integratedStopItem = {} as integratedStopItem;

    const thisRouteID = item.RouteID;

    // Check whether this stop is on this route or not
    if ([RouteID, RouteID * 10].includes(thisRouteID) || PathAttributeId.includes(thisRouteID)) {
      // Parse estimate time
      integratedStopItem.status = parseEstimateTime(item?.EstimateTime, time_formatting_mode);

      // Collect data from 'Stop'
      const thisStopKey = `s_${item.StopID}`;
      let thisStop = {} as SimplifiedStopItem;
      if (Stop.hasOwnProperty(thisStopKey)) {
        thisStop = Stop[thisStopKey];
      } else {
        continue;
      }
      integratedStopItem.id = item.StopID;
      integratedStopItem.sequence = thisStop.seqNo;
      integratedStopItem.goBack = thisStop.goBack;

      // Collect data from 'SimplifiedLocation'
      const thisLocationKey = `l_${thisStop.stopLocationId}`;
      let thisSimplifiedLocation = {} as SimplifiedLocationItem;
      if (SimplifiedLocation.hasOwnProperty(thisLocationKey)) {
        thisSimplifiedLocation = SimplifiedLocation[thisLocationKey];
      } else {
        continue;
      }
      integratedStopItem.name = thisSimplifiedLocation.n;
      integratedStopItem.overlappingRoutes = thisSimplifiedLocation.r
        .filter((id: number) => id !== RouteID)
        .map((id: number) => {
          const overlappingRouteKey = `r_${id}`;
          if (Route.hasOwnProperty(overlappingRouteKey)) {
            const overlappingRoute = Route[overlappingRouteKey] as SimplifiedRouteItem;
            const formattedOverlappingRoute = {
              name: overlappingRoute.n,
              RouteEndPoints: {
                RouteDeparture: overlappingRoute.dep,
                RouteDestination: overlappingRoute.des,
                text: `${overlappingRoute.dep} \u2194 ${overlappingRoute.des}`, //u2194 -> '↔'
                html: `<span>${overlappingRoute.dep}</span><span>\u2194</span><span>${overlappingRoute.des}</span>`
              },
              RouteID: overlappingRoute.id,
              PathAttributeId: overlappingRoute.pid
            };
            return formattedOverlappingRoute;
          } else {
            return null;
          }
        })
        .filter((e) => {
          return e !== null;
        });
      integratedStopItem.position = {
        longitude: thisSimplifiedLocation.lo,
        latitude: thisSimplifiedLocation.la
      };
      positions.push({
        latitude: thisSimplifiedLocation.la,
        longitude: thisSimplifiedLocation.lo,
        id: item.StopID
      });

      // Collect data from 'IndexedLocation' and 'MergedLocation'
      const thisSimplifiedLocationGeohash = thisSimplifiedLocation.g;
      let thisIndexedLocationItem: Array<IndexedLocationItem> = [];
      if (IndexedLocation.hasOwnProperty(thisSimplifiedLocationGeohash)) {
        thisIndexedLocationItem = IndexedLocation[thisSimplifiedLocationGeohash];
      }
      let nearbyLocations: Array<integratedStopItemNearbyLocationItem> = [];
      for (const item of thisIndexedLocationItem) {
        const mergedLocationKey = `ml_${item.hash}`;
        if (MergedLocation.hasOwnProperty(mergedLocationKey)) {
          const thisMergedLocation = MergedLocation[mergedLocationKey];
          const nearbyLocationItem: integratedStopItemNearbyLocationItem = {
            name: thisMergedLocation.n,
            distance: convertPositionsToDistance(thisMergedLocation.la[0], thisMergedLocation.lo[0], thisSimplifiedLocation.la, thisSimplifiedLocation.lo) | 0,
            hash: thisMergedLocation.hash
          };
          nearbyLocations.push(nearbyLocationItem);
        }
      }
      nearbyLocations.sort(function (a, b) {
        return a.distance - b.distance;
      });
      integratedStopItem.nearbyLocations = nearbyLocations;

      // Collect data from 'batchFoundBuses'
      let buses = []; // as Array<FormattedBus>
      for (const overlappingStopID of thisSimplifiedLocation.s) {
        const overlappingStopKey = `s_${overlappingStopID}`;
        if (batchFoundBuses.hasOwnProperty(overlappingStopKey)) {
          buses.push(batchFoundBuses[overlappingStopKey].map((e) => formatBus(e)));
        }
      }
      integratedStopItem.buses = buses.flat().sort(function (a, b) {
        return a.index - b.index;
      });

      // Collect data from 'BusArrivalTimes'
      let thisBusArrivalTimes = [];
      if (BusArrivalTimes.hasOwnProperty(thisStopKey)) {
        thisBusArrivalTimes = BusArrivalTimes[thisStopKey];
      }
      integratedStopItem.busArrivalTimes = thisBusArrivalTimes;

      // Check whether this stop is segment buffer
      let isSegmentBuffer: boolean = false;
      let isStartingPoint: boolean = false;
      let isEndingPoint: boolean = false;
      let useReversed: boolean = false;
      if (hasSegmentBuffers) {
        const groupKey = `g_${integratedStopItem.goBack}`;
        let segmentBufferGroup = [];

        if (thisSegmentBuffers.hasOwnProperty(groupKey)) {
          segmentBufferGroup = thisSegmentBuffers[groupKey];
        } else {
          if (integratedStopItem.goBack === '1') {
            useReversed = true;
            segmentBufferGroup = thisSegmentBuffers['g_0'];
          }
        }

        for (const thisBufferZone of segmentBufferGroup) {
          if (thisBufferZone.OriginStopID === item.StopID || thisBufferZone.DestinationStopID === item.StopID) {
            isSegmentBuffer = true;
          }
          if (useReversed) {
            if (thisBufferZone.OriginStopID === item.StopID) {
              isEndingPoint = true;
            }
            if (thisBufferZone.DestinationStopID === item.StopID) {
              isStartingPoint = true;
            }
          } else {
            if (thisBufferZone.OriginStopID === item.StopID) {
              isStartingPoint = true;
            }
            if (thisBufferZone.DestinationStopID === item.StopID) {
              isEndingPoint = true;
            }
          }
        }
      }
      integratedStopItem.segmentBuffer = {
        isSegmentBuffer,
        isStartingPoint,
        isEndingPoint
      };

      result.push(integratedStopItem);
    }
  }

  result.sort(function (a, b) {
    return a.sequence - b.sequence;
  });

  const nearestPosition = getNearestPosition(positions, 450);

  let isBufferZoneOpened: boolean = false;
  let isBufferZoneClosed: boolean = false;

  let groupedItems: { [key: string]: Array<integratedStopItem> } = {};
  let groupQuantity: number = 0;
  let itemQuantity: { [key: string]: number } = {};

  const resultLength = result.length;

  for (let index = 0; index < resultLength; index++) {
    let item = result[index];
    const nextItem = result[index + 1] || item;
    let progress = 0;

    if (item.buses.length > 0) {
      if (item.buses[0].onThisRoute) {
        const [x, y] = [item.buses[0].position.longitude, item.buses[0].position.latitude];
        const [x1, y1] = [item.position.longitude, item.position.latitude];
        const [x2, y2] = [nextItem.position.longitude, nextItem.position.latitude];
        const dotProduct = (x - x1) * (x2 - x) + (y - y1) * (y2 - y);
        if (dotProduct >= 0) {
          // ensure that (x, y) is between (x1, y1) and (x2, y2)
          const distance1 = Math.hypot(x - x1, y - y1);
          const distance2 = Math.hypot(x - x2, y - y2);
          progress = Math.max(0, Math.min(distance1 / (distance1 + distance2), 1));
        }
      }
    }
    item.progress = progress;

    if (item.segmentBuffer.isStartingPoint) {
      isBufferZoneOpened = true;
    }

    if (item.segmentBuffer.isEndingPoint) {
      if (isBufferZoneOpened) {
        isBufferZoneClosed = true;
      }
    }

    if (isBufferZoneOpened && !isBufferZoneClosed) {
      item.segmentBuffer.isSegmentBuffer = true;
    }

    if (isBufferZoneOpened && isBufferZoneClosed) {
      isBufferZoneOpened = false;
      isBufferZoneClosed = false;
    }

    let isNearest = false;
    if (nearestPosition !== null) {
      if (nearestPosition.id === item.id) {
        isNearest = true;
      }
    }
    item.nearest = isNearest;

    const groupKey = `g_${item.goBack}` || 'g_0';

    if (!groupedItems.hasOwnProperty(groupKey)) {
      groupedItems[groupKey] = [];
      itemQuantity[groupKey] = 0;
      groupQuantity += 1;
    }

    groupedItems[groupKey].push(item);
    itemQuantity[groupKey] += 1;
  }

  const thisRoute = Route[`r_${RouteID}`];
  const thisRouteName = thisRoute.n;
  const thisRouteDeparture = thisRoute.dep;
  const thisRouteDestination = thisRoute.des;

  const result2: IntegratedRoute = {
    groupedItems: groupedItems,
    groupQuantity: groupQuantity,
    itemQuantity: itemQuantity,
    RouteName: thisRouteName,
    RouteEndPoints: {
      RouteDeparture: thisRouteDeparture,
      RouteDestination: thisRouteDestination
    },
    dataUpdateTime: getDataUpdateTime(requestID),
    RouteID,
    PathAttributeId
  };

  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  // await recordEstimateTimeForUpdateRate(EstimateTime);
  return result2;
}

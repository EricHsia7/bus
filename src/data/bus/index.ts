import { searchRouteByPathAttributeId } from '../search/index';
import { getBusData } from '../apis/getBusData/index';
import { getBusEvent } from '../apis/getBusEvent/index';
import { CarInfoItem, getCarInfo } from '../apis/getCarInfo/index';
import { getLocation } from '../apis/getLocation/index';
import { getStop } from '../apis/getStop/index';
import { parseBusStatus, parseCarOnStop, parseCarType } from '../apis/index';
import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

/*
export interface integratedBus {
  carNumber: string;
  type: string;
  status: {
    onStop: string;
    situation: string;
    text: string;
  };
  LocationName: string;
  PathAttributeId: number;
  RouteName: string;
  RouteID: number;
  FullPathAttributeId: Array<number>;
  RouteEndPoints: {
    RouteDeparture: string;
    RouteDestination: string;
  };
  RouteDirection: string;
}
*/

export interface integratedBus {
  properties: Array<{
    key: string;
    icon: MaterialSymbols;
    value: string;
  }>;
  RouteID: number;
  FullPathAttributeId: Array<number>;
}

export async function integrateBus(id: CarInfoItem['BusId'], requestID: string): Promise<integratedBus> {
  const carKey = `c_${id}`;
  const CarInfo = await getCarInfo(requestID, true);
  const BusData = await getBusData(requestID);
  const BusEvent = await getBusEvent(requestID);
  const Stop = await getStop(requestID);
  const Location = await getLocation(requestID, false);

  let result: integratedBus = {
    properties: [],
    LocationName: ''
  };

  // Collect data from CarInfo
  let thisCar = {};
  if (CarInfo.hasOwnProperty(carKey)) {
    thisCar = CarInfo[carKey];
  } else {
    return result;
  }

  const thisCarNumber = thisCar.CarNum;
  result.properties.push({
    key: 'car_number',
    icon: 'tag',
    value: thisCarNumber
  });

  const thisCarType = thisCar.CarType;
  const type = parseCarType(thisCarType);
  result.properties.push({
    key: 'car_type',
    icon: 'directions_bus',
    value: type
  });

  // Collect data from BusData
  let thisBusDataItem = {};
  for (const BusDataItem of BusData) {
    const thisBusDataItemBusID = BusDataItem.BusID;
    if (thisBusDataItemBusID === thisCarNumber) {
      thisBusDataItem = BusDataItem;
      break;
    }
  }
  const thisBusDataItemPathAttributeId = parseInt(thisBusDataItem.RouteID);
  // result.PathAttributeId = thisBusDataItemPathAttributeId;
  const thisBusDataItemBusStatus = thisBusDataItem.BusStatus;
  const situation = parseBusStatus(thisBusDataItemBusStatus);
  const thisBusDataItemGoBack = parseInt(thisBusDataItem.GoBack);

  // Collect data from BusEvent
  let thisBusEventItem = {};
  for (const BusEventItem of BusEvent) {
    const thisBusEventItemBusID = BusEventItem.BusID;
    if (thisBusEventItemBusID === thisCarNumber) {
      thisBusEventItem = BusEventItem;
      break;
    }
  }

  const thisBusEventItemCarOnStop = thisBusEventItem.CarOnStop;
  const onStop = parseCarOnStop(thisBusEventItemCarOnStop);
  result.properties.push({
    key: 'status',
    icon: 'vital_signs',
    value: `${onStop} | ${situation}`
  });
  const thisBusEventItemStopID = thisBusEventItem.StopID;

  // Search routes
  const searchedRoutes = await searchRouteByPathAttributeId(thisBusDataItemPathAttributeId);
  let searchedRoute = {};
  if (searchedRoutes.length > 0) {
    searchedRoute = searchedRoutes[0];
  } else {
    return result;
  }
  const thisRouteID = searchedRoute.id;
  const thisRouteFullPathAttributeId = searchedRoute.pid;
  const thisRouteName = searchedRoute.n;
  const thisRouteDeparture = searchedRoute.dep;
  const thisRouteDestination = searchedRoute.des;
  const thisRouteDirection = [thisRouteDestination, thisRouteDeparture, ''][thisBusDataItemGoBack ? thisBusDataItemGoBack : 0];
  result.properties.push({
    key: 'route',
    icon: 'route',
    value: `${thisRouteName} - 往${thisRouteDirection}`
  });

  result.RouteID = thisRouteID;
  result.FullPathAttributeId = thisRouteFullPathAttributeId;

  // Collect data from Stop
  const StopKey = `s_${thisBusEventItemStopID}`;
  let thisStopItem = {};
  if (Stop.hasOwnProperty(StopKey)) {
    thisStopItem = Stop[StopKey];
  } else {
    return result;
  }
  const thisStopItemStopLocationId = thisStopItem.stopLocationId;

  // Collect data drom Location
  const LocationKey = `l_${thisStopItemStopLocationId}`;
  const thisLocationItem = Location[LocationKey];
  const thisLocationItemName = thisLocationItem.n;
  result.properties.push({
    key: 'location_name',
    icon: 'location_on',
    value: thisLocationItemName
  });

  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  return result;
}

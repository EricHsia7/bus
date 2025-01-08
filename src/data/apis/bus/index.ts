import { searchRouteByPathAttributeId } from '../../search/index';
import { getBusData } from '../getBusData/index';
import { getBusEvent } from '../getBusEvent/index';
import { CarInfoItem, getCarInfo } from '../getCarInfo/index';
import { getLocation } from '../getLocation/index';
import { getStop } from '../getStop/index';
import { parseBusStatus, parseCarOnStop, parseCarType } from '../index';

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

export async function integrateBus(id: CarInfoItem['BusId'], requestID: string): Promise<integratedBus> {
  const carKey = `b_${id}`;
  const CarInfo = await getCarInfo(requestID, true);
  const BusData = await getBusData(requestID);
  const BusEvent = await getBusEvent(requestID);
  const Stop = await getStop(requestID);
  const Location = await getLocation(requestID, false);

  let result: integratedBus = {};

  // Collect data from CarInfo
  let thisCar = {};
  if (CarInfo.hasOwnProperty(carKey)) {
    thisCar = CarInfo[carKey];
  } else {
    return {};
  }

  const thisCarNumber = thisCar.CarNum;
  const thisCarType = thisCar.CarType;
  result.carNumber = thisCarNumber;
  const type = parseCarType(thisCarType);
  result.type = type;

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
  result.PathAttributeId = thisBusDataItemPathAttributeId;
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
  result.status = {
    onStop: onStop,
    situation: situation,
    text: `${onStop} | ${situation}`
  };

  const thisBusEventItemStopID = thisBusEventItem.StopID;

  // Search routes
  const searchedRoutes = await searchRouteByPathAttributeId(thisBusDataItemPathAttributeId);
  let searchedRoute = {};
  if (searchedRoutes.length > 0) {
    searchedRoute = searchedRoutes[0];
  } else {
    return {};
  }
  const thisRouteID = searchedRoute.id;
  const thisRouteName = searchedRoute.n;
  const thisRouteDeparture = searchedRoute.dep;
  const thisRouteDestination = searchedRoute.des;
  const thisRouteFullPathAttributeId = searchedRoute.pid;
  result.RouteName = thisRouteName;
  result.RouteID = thisRouteID;
  result.FullPathAttributeId = thisRouteFullPathAttributeId;
  result.RouteEndPoints = {
    RouteDeparture: thisRouteDeparture,
    RouteDestination: thisRouteDestination
  };
  result.RouteDirection = [thisRouteDestination, thisRouteDeparture, ''][thisBusDataItemGoBack ? thisBusDataItemGoBack : 0];

  // Collect data from Stop
  const StopKey = `s_${thisBusEventItemStopID}`;
  const thisStopItem = Stop[StopKey];
  const thisStopItemStopLocationId = thisStopItem.stopLocationId;

  // Collect data drom Location
  const LocationKey = `l_${thisStopItemStopLocationId}`;
  const thisLocationItem = Location[LocationKey];
  const thisLocationItemName = thisLocationItem.n;

  result.LocationName = thisLocationItemName;
  return result;
}

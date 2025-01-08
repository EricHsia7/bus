import { searchRouteByPathAttributeId } from '../../search/index';
import { getBusData } from '../getBusData/index';
import { getBusEvent } from '../getBusEvent/index';
import { CarInfoItem, getCarInfo } from '../getCarInfo/index';
import { parseBusStatus, parseCarOnStop, parseCarType } from '../index';

export interface integratedBus {
  carNumber: string;
  type: string;
  status: {
    onStop: string;
    situation: string;
    text: string;
  };
  PathAttributeId: number;
  RouteName: string;
  RouteID: number;
  FullPathAttributeId: Array<number>;
  RouteEndPoints: {
    RouteDeparture: string;
    RouteDestination: string;
  };
}

export async function integrateBus(id: CarInfoItem['BusId'], requestID: string): Promise<integratedBus> {
  const carKey = `b_${id}`;
  const CarInfo = await getCarInfo(requestID, true);
  const BusData = await getBusData(requestID);
  const BusEvent = await getBusEvent(requestID);

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
    }
  }
  const thisBusDataItemPathAttributeId = parseInt(thisBusEventItem.RouteID);
  result.PathAttributeId = thisBusDataItemPathAttributeId;
  const thisBusDataItemBusStatus = thisBusEventItem.BusStatus;
  const situation = parseBusStatus(thisBusDataItemBusStatus);

  // Collect data from BusEvent
  let thisBusEventItem = {};
  for (const BusEventItem of BusEvent) {
    const thisBusEventItemBusID = BusEventItem.BusID;
    if (thisBusEventItemBusID === thisCarNumber) {
      thisBusEventItem = BusEventItem;
    }
  }

  const thisBusEventItemCarOnStop = thisBusEventItem.CarOnStop;
  const onStop = parseCarOnStop(thisBusEventItemCarOnStop);

  result.status = {
    onStop: onStop,
    situation: situation,
    text: `${onStop} | ${situation}`
  };

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

  return result;
}

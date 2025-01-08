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
  console.log(0, CarInfo);
  let thisCar = {};
  if (CarInfo.hasOwnProperty(carKey)) {
    console.log(1);
    thisCar = CarInfo[carKey];
    console.log(2, thisCar, carKey);
  } else {
    console.log(3);

    return {};
  }
  console.log(4);

  const thisCarNumber = thisCar.CarNum;
  const thisCarType = thisCar.CarType;
  result.carNumber = thisCarNumber;
  console.log(5, thisCarNumber, thisCarType);
  const type = parseCarType(thisCarType);
  result.type = type;

  // Collect data from BusData
  console.log(6);
  let thisBusDataItem = {};
  for (const BusDataItem of BusData) {
    console.log(7);
    const thisBusDataItemBusID = BusDataItem.BusID;
    if (thisBusDataItemBusID === thisCarNumber) {
      thisBusDataItem = BusDataItem;
      console.log(8, BusDataItem);
      break;
    }
  }
  const thisBusDataItemPathAttributeId = parseInt(thisBusDataItem.RouteID);
  result.PathAttributeId = thisBusDataItemPathAttributeId;
  const thisBusDataItemBusStatus = thisBusDataItem.BusStatus;
  const situation = parseBusStatus(thisBusDataItemBusStatus);

  // Collect data from BusEvent
  console.log(9);
  let thisBusEventItem = {};
  for (const BusEventItem of BusEvent) {
    console.log(10);

    const thisBusEventItemBusID = BusEventItem.BusID;
    if (thisBusEventItemBusID === thisCarNumber) {
      console.log(11, BusEventItem);
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

  // Search routes
  console.log(12);
  const searchedRoutes = await searchRouteByPathAttributeId(thisBusDataItemPathAttributeId);
  console.log(13, searchedRoute);
  let searchedRoute = {};
  if (searchedRoutes.length > 0) {
    console.log(14, searchedRoutes[0]);
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
  console.log(15, result);
  return result;
}

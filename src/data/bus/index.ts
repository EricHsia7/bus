import { MaterialSymbol } from '../../interface/icons/material-symbols-type';
import { hasOwnProperty } from '../../tools/index';
import { Progress, ProgressCallback } from '../../tools/progress';
import { BusData, BusDataItem, getBusData } from '../apis/getBusData/index';
import { BusEvent, BusEventItem, getBusEvent } from '../apis/getBusEvent/index';
import { CarInfoItem, getCarInfo, SimplifiedCarInfo, SimplifiedCarInfoItem } from '../apis/getCarInfo/index';
import { getLocation, SimplifiedLocation } from '../apis/getLocation/index';
import { SimplifiedRouteItem } from '../apis/getRoute/index';
import { getStop, SimplifiedStop, SimplifiedStopItem } from '../apis/getStop/index';
import { parseBusStatus, parseCarOnStop, parseCarType } from '../apis/index';
import { searchRouteByPathAttributeId } from '../search/index';

export interface integratedBusProperty {
  icon: MaterialSymbol;
  value: string;
}

export type integratedBusPropertyArray = Array<integratedBusProperty>;

export interface integratedBus {
  properties: integratedBusPropertyArray;
  RouteID: SimplifiedRouteItem['id'];
  FullPathAttributeId: SimplifiedRouteItem['pid'];
}

export async function integrateBus(id: CarInfoItem['BusId'], progressCallback: ProgressCallback): Promise<integratedBus> {
  const carKey = `c_${id}`;
  const progress = new Progress(10, progressCallback);
  const [CarInfo, BusData, BusEvent] = (await Promise.all([getCarInfo(progress, true), getBusData(progress), getBusEvent(progress)])) as [SimplifiedCarInfo, BusData, BusEvent];
  const [Stop, Location] = (await Promise.all([getStop(progress), getLocation(progress, 0)])) as [SimplifiedStop, SimplifiedLocation];

  const result: integratedBus = { properties: [], RouteID: 0, FullPathAttributeId: [] };

  // Collect data from CarInfo
  let thisCar = {} as SimplifiedCarInfoItem;
  if (hasOwnProperty(CarInfo, carKey)) {
    thisCar = CarInfo[carKey];
  } else {
    return result;
  }

  // car number
  const thisCarNumber = thisCar.CarNum;
  result.properties.push({
    icon: 'tag',
    value: thisCarNumber
  });

  // car type
  const thisCarType = thisCar.CarType;
  const type = parseCarType(thisCarType);
  result.properties.push({
    icon: 'directions_bus',
    value: type
  });

  // Collect data from BusData
  let thisBusDataItem = {} as BusDataItem;
  for (const BusDataItem of BusData) {
    const thisBusDataItemBusID = BusDataItem.BusID;
    if (thisBusDataItemBusID === thisCarNumber) {
      thisBusDataItem = BusDataItem;
      break;
    }
  }
  const thisBusDataItemPathAttributeId = parseInt(thisBusDataItem.RouteID, 10);
  // result.PathAttributeId = thisBusDataItemPathAttributeId;
  const thisBusDataItemBusStatus = thisBusDataItem.BusStatus;
  const situation = parseBusStatus(thisBusDataItemBusStatus);
  const thisBusDataItemGoBack = parseInt(thisBusDataItem.GoBack, 10);

  // Collect data from BusEvent
  let thisBusEventItem = {} as BusEventItem;
  for (const BusEventItem of BusEvent) {
    const thisBusEventItemBusID = BusEventItem.BusID;
    if (thisBusEventItemBusID === thisCarNumber) {
      thisBusEventItem = BusEventItem;
      break;
    }
  }

  // status
  const thisBusEventItemCarOnStop = thisBusEventItem.CarOnStop;
  const onStop = parseCarOnStop(thisBusEventItemCarOnStop);
  result.properties.push({
    icon: 'vital_signs',
    value: `${onStop} | ${situation}`
  });
  const thisBusEventItemStopID = thisBusEventItem.StopID;

  // route
  const searchedRoutes = await searchRouteByPathAttributeId(thisBusDataItemPathAttributeId);
  let searchedRoute = {} as SimplifiedRouteItem;
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
    icon: 'route',
    value: `${thisRouteName} - 往${thisRouteDirection}`
  });

  result.RouteID = thisRouteID;
  result.FullPathAttributeId = thisRouteFullPathAttributeId;

  // Collect data from Stop
  const StopKey = `s_${thisBusEventItemStopID}`;
  let thisStopItem = {} as SimplifiedStopItem;
  if (hasOwnProperty(Stop, StopKey)) {
    thisStopItem = Stop[StopKey];
  } else {
    return result;
  }
  const thisStopItemStopLocationId = thisStopItem.stopLocationId;

  // Collect data from Location
  const LocationKey = `l_${thisStopItemStopLocationId}`;
  const thisLocationItem = Location[LocationKey];
  const thisLocationItemName = thisLocationItem.n;
  result.properties.push({
    icon: 'location_on',
    value: thisLocationItemName
  });

  progress.terminate();
  return result;
}

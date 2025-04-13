import { formatTime } from '../../tools/time';
import { BusData, BusDataItem } from './getBusData/index';
import { BusEvent, BusEventItem } from './getBusEvent/index';
import { SimplifiedRoute } from './getRoute/index';

export interface EstimateTimeStatus {
  code: 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // 8: loading
  text: string;
  time: number;
}

export function parseEstimateTime(EstimateTime: string, mode: number): EstimateTimeStatus {
  if (typeof EstimateTime === 'string') {
    const time = parseInt(EstimateTime);
    if (time === -3) {
      return { code: 6, text: '末班駛離', time };
    }
    if (time === -4) {
      return { code: 5, text: '今日停駛', time };
    }
    if (time === -2) {
      return { code: 4, text: '交通管制', time };
    }
    if (time === -1) {
      return { code: 3, text: '未發車', time };
    }
    if (0 <= time && time <= 10) {
      return { code: 2, text: '進站中', time };
    }
    if (10 < time && time <= 180) {
      return { code: 1, text: formatTime(time, mode), time };
    }
    if (180 < time && time <= 250) {
      return { code: 0.5, text: formatTime(time, mode), time };
    }
    if (250 < time) {
      return { code: 0, text: formatTime(time, mode), time };
    }
  }
  return { code: 7, text: '發生錯誤', time: -5 };
}

export interface TimeMoment {
  type: 'moment';
  hours: number;
  minutes: number;
}

export interface TimeRange {
  type: 'range';
  min: number;
  max: number;
}

/**
 * parseTimeCode
 * @param code 0: hhmm/mm, 1: mmMM/mm
 * @param mode 0: moment, 1: range
 * @returns 0: TimeMoment, 1: TimeRange
 */

export function parseTimeCode(code: string, mode: 0 | 1): TimeMoment | TimeRange {
  const codeLength = code.length;
  if (mode === 0) {
    let hours = 0;
    let minutes = 0;
    if (codeLength === 4) {
      hours = parseInt(code.substring(0, 2));
      minutes = parseInt(code.substring(2, 4));
    }
    if (codeLength === 2) {
      minutes = parseInt(code);
    }
    return {
      type: 'moment',
      hours: hours,
      minutes: minutes
    };
  }
  if (mode === 1) {
    let min = 0;
    let max = 0;
    if (codeLength === 4) {
      const number1 = parseInt(code.substring(0, 2));
      const number2 = parseInt(code.substring(2, 4));
      min = Math.min(number1, number2);
      max = Math.max(number1, number2);
    }
    if (codeLength === 2) {
      const number = parseInt(code);
      min = number;
      max = number;
    }
    return {
      type: 'range',
      min: min,
      max: max
    };
  }
}

export interface BatchFoundBusPosition {
  longitude: number;
  latitude: number;
}

export interface BatchFoundBus {
  CarType: BusEventItem['CarType'];
  BusStatus: BusEventItem['BusStatus'];
  BusID: string;
  CarOnStop: BusEventItem['CarOnStop'];
  onThisRoute: boolean;
  position: BatchFoundBusPosition;
  RouteName: string;
  RouteID: number;
  index: number;
}

export type BatchFoundBuses = { [key: string]: Array<BatchFoundBus> };

export function batchFindBusesForRoute(BusEvent: BusEvent, BusData: BusData, Route: SimplifiedRoute, RouteID: number, PathAttributeId: Array<number>): BatchFoundBuses {
  const result = {} as BatchFoundBuses;
  const BusDataObj: {
    [key: string]: BusDataItem;
  } = {};
  for (const BusDataItem of BusData) {
    const thisBusID = BusDataItem.BusID;
    BusDataObj[thisBusID] = BusDataItem;
  }

  for (const BusEventItem of BusEvent) {
    const processedItem = {} as BatchFoundBus;

    // collect data from 'BusEvent'
    processedItem.CarType = BusEventItem.CarType;
    processedItem.BusStatus = BusEventItem.BusStatus;
    processedItem.BusID = BusEventItem.BusID;
    processedItem.CarOnStop = BusEventItem.CarOnStop;

    // check whether this bus is on the route
    const thisRouteID = parseInt(BusEventItem.RouteID);
    const thisBusID = String(BusEventItem.BusID);
    let isOnThisRoute: boolean = false;
    let index: number = 0;
    if (thisRouteID === RouteID || PathAttributeId.indexOf(thisRouteID) > -1 || thisRouteID === RouteID * 10) {
      isOnThisRoute = true;
      index = thisBusID.charCodeAt(0) * Math.pow(10, -5);
    } else {
      isOnThisRoute = false;
      index = thisBusID.charCodeAt(0);
    }
    processedItem.onThisRoute = isOnThisRoute;
    processedItem.index = index;

    // collect data from 'BusData'
    let thisBusData = {} as BusDataItem;
    if (BusDataObj.hasOwnProperty(thisBusID)) {
      thisBusData = BusDataObj[thisBusID];
    } else {
      continue;
    }
    processedItem.position = {
      latitude: parseFloat(thisBusData.Latitude),
      longitude: parseFloat(thisBusData.Longitude)
    };

    // search data from 'Route'
    let searchedRoute = {};
    let isRouteSearched = false;
    for (const key in Route) {
      const thisRouteItem = Route[key];
      const pid = thisRouteItem.pid;
      if (pid.indexOf(thisRouteID) > -1) {
        searchedRoute = thisRouteItem;
        isRouteSearched = true;
        break;
      }
    }
    processedItem.RouteName = isRouteSearched ? searchedRoute.n : '未知路線';
    processedItem.RouteID = isRouteSearched ? searchedRoute.id : null;

    const StopKey = `s_${BusEventItem.StopID}`;
    if (!result.hasOwnProperty(StopKey)) {
      result[StopKey] = [];
    }
    result[StopKey].push(processedItem);
    // Handle multiple buses (of the same route) on a stop
  }
  /*
  for (var key in result) {
    result[key] = result[key].sort(function (a, b) {
      return a.index - b.index;
    });
  }
  */
  return result;
}

export function batchFindBusesForLocation(BusEvent: BusEvent, BusData: BusData, Route: SimplifiedRoute, StopIDList: Array<number>): BatchFoundBuses {
  let result = {} as BatchFoundBuses;
  let BusDataObj: {
    [key: string]: BusDataItem;
  } = {};
  for (const BusDataItem of BusData) {
    const thisBusID = BusDataItem.BusID;
    BusDataObj[thisBusID] = BusDataItem;
  }

  for (let BusEventItem of BusEvent) {
    let processedItem = {} as BatchFoundBus;

    const thisStopID = parseInt(BusEventItem.StopID);
    const thisRouteID = parseInt(BusEventItem.RouteID);
    const thisBusID = String(BusEventItem.BusID);

    // Check whether this bus is on one of the specified stops
    if (StopIDList.indexOf(thisStopID) < 0) {
      continue;
    }

    processedItem.index = thisBusID.charCodeAt(0);
    processedItem.onThisRoute = true; // Every entry in Location is stop-route pair

    // Collect data from 'BusEvent'
    processedItem.CarType = BusEventItem.CarType;
    processedItem.BusStatus = BusEventItem.BusStatus;
    processedItem.BusID = BusEventItem.BusID;
    processedItem.CarOnStop = BusEventItem.CarOnStop;

    // Collect data from 'BusData'
    let thisBusData = {} as BusDataItem;
    if (BusDataObj.hasOwnProperty(thisBusID)) {
      thisBusData = BusDataObj[thisBusID];
    } else {
      continue;
    }
    processedItem.position = {
      latitude: parseFloat(thisBusData.Latitude),
      longitude: parseFloat(thisBusData.Longitude)
    };

    // Search data from 'Route'
    let searchedRoute = {};
    let isRouteSearched = false;
    for (const key in Route) {
      const thisRouteItem = Route[key];
      const pid = thisRouteItem.pid;
      if (pid.indexOf(thisRouteID) > -1) {
        searchedRoute = thisRouteItem;
        isRouteSearched = true;
        break;
      }
    }
    processedItem.RouteName = isRouteSearched ? searchedRoute.n : '未知路線';
    processedItem.RouteID = isRouteSearched ? searchedRoute.id : null;

    const StopKey = `s_${thisStopID}`;
    if (!result.hasOwnProperty(StopKey)) {
      result[StopKey] = [];
    }
    result[StopKey].push(processedItem);
  }
  /*
  for (var key in result) {
    result[key] = result[key].sort(function (a, b) {
      return a.index - b.index;
    });
  }
  */
  return result;
}

interface FormattedBusStatus {
  onStop: boolean;
  situation: string;
  text: string;
}

interface FormattedBusPosition {
  longitude: number;
  latitude: number;
}

export function parseCarType(CarType: '0' | '1' | '2' | '3'): '一般' | '低底盤' | '大復康巴士' | '狗狗友善專車' | '未知類型' {
  let type = '';
  switch (CarType) {
    case '0':
      type = '一般';
      break;
    case '1':
      type = '低底盤';
      break;
    case '2':
      type = '大復康巴士';
      break;
    case '3':
      type = '狗狗友善專車';
      break;
    default:
      type = '未知類型';
  }
  return type;
}

export function parseCarOnStop(CarOnStop: '0' | '1'): string {
  let onStop = '';
  switch (CarOnStop) {
    case '0':
      onStop = '離站';
      break;
    case '1':
      onStop = '進站';
      break;
    default:
      onStop = '未知狀態'; // Handle unexpected values if necessary
  }
  return onStop;
}

export function parseBusStatus(BusStatus: '0' | '1' | '2' | '3' | '4' | '5' | '99'): string {
  let situation = '';
  switch (BusStatus) {
    case '0':
      situation = '正常';
      break;
    case '1':
      situation = '車禍';
      break;
    case '2':
      situation = '故障';
      break;
    case '3':
      situation = '塞車';
      break;
    case '4':
      situation = '緊急求援';
      break;
    case '5':
      situation = '加油';
      break;
    case '99':
      situation = '非營運狀態';
      break;
    default:
      situation = '未知狀態'; // Handle unexpected values if necessary
  }
  return situation;
}

export interface FormattedBus {
  type: '一般' | '低底盤' | '大復康巴士' | '狗狗友善專車' | '未知類型';
  carNumber: string;
  status: FormattedBusStatus;
  RouteName: string;
  onThisRoute: boolean;
  index: number;
  position: FormattedBusPosition;
}

export function formatBus(batchFoundBus: BatchFoundBus): FormattedBus {
  const result = {} as FormattedBus;

  const CarType = batchFoundBus.CarType;
  const type = parseCarType(CarType);
  result.type = type;

  const CarOnStop = batchFoundBus.CarOnStop;
  const onStop = parseCarOnStop(CarOnStop);

  const BusStatus = batchFoundBus.BusStatus;
  const situation = parseBusStatus(BusStatus);

  result.carNumber = batchFoundBus.BusID;
  result.status = {
    onStop: onStop,
    situation: situation,
    text: `${onStop} | ${situation}`
  };
  result.RouteName = batchFoundBus.RouteName;
  result.onThisRoute = batchFoundBus.onThisRoute;
  result.index = batchFoundBus.index;
  result.position = batchFoundBus.position;
  return result;
}

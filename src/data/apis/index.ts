import { BusEvent } from './getBusEvent/index';
import { BusData } from './getBusData/index';
import { SimplifiedRoute } from './getRoute/index';
import { formatTime } from '../../tools/time';

interface EstimateTimeStatus {
  code: 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  text: string;
}

export function parseEstimateTime(EstimateTime: string, mode: number): EstimateTimeStatus {
  const time = parseInt(EstimateTime);
  if (time === -3) {
    return { code: 6, text: '末班駛離' };
  }
  if (time === -4) {
    return { code: 5, text: '今日停駛' };
  }
  if (time === -2) {
    return { code: 4, text: '交通管制' };
  }
  if (time === -1) {
    return { code: 3, text: '未發車' };
  }
  if (0 <= time && time <= 10) {
    return { code: 2, text: '進站中' };
  }
  if (10 < time && time <= 180) {
    return { code: 1, text: formatTime(time, mode) };
  }
  if (180 < time && time <= 250) {
    return { code: 0.5, text: formatTime(time, mode) };
  }
  if (250 < time) {
    return { code: 0, text: formatTime(time, mode) };
  }
  return { code: 7, text: '發生錯誤' };
}

interface Moment {
  type: 'moment';
  hours: number;
  minutes: number;
}

interface Range {
  type: 'range';
  min: number;
  max: number;
}

export function parseTimeCode(code: string, mode: number): Moment | Range {
  if (mode === 0) {
    var hours = 0;
    var minutes = 0;
    if (code.length === 4) {
      hours = parseInt(code.substring(0, 2));
      minutes = parseInt(code.substring(2, 4));
    }
    if (code.length === 2) {
      minutes = parseInt(code);
    }
    return {
      type: 'moment',
      hours: hours,
      minutes: minutes
    };
  } else {
    if (mode === 1) {
      var min = 0;
      var max = 0;
      if (code.length === 4) {
        var number1 = parseInt(code.substring(0, 2));
        var number2 = parseInt(code.substring(2, 4));
        min = Math.min(number1, number2);
        max = Math.max(number1, number2);
      }
      if (code.length === 2) {
        var number = parseInt(code);
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
}

export interface ProcessedBusPosition {
  longitude: number;
  latitude: number;
}

export interface ProcessedBus {
  BusID: string;
  onThisRoute: boolean;
  position: ProcessedBusPosition;
  index: number;
}

export function processBuses(BusEvent: BusEvent, BusData: BusData, Route: SimplifiedRoute, RouteID: number, PathAttributeId: Array<number>): { [key: string]: Array<ProcessedBus> } {
  var result = {};
  var BusDataObj = {};
  for (const BusDataItem of BusData) {
    var thisBusID = BusDataItem.BusID;
    BusDataObj[thisBusID] = BusDataItem;
  }

  for (let BusEventItem of BusEvent) {
    let processedItem = {};

    // collect data from 'BusEvent'
    processedItem.CarType = BusEventItem.CarType;
    processedItem.BusStatus = BusEventItem.BusStatus;
    processedItem.BusID = BusEventItem.BusID;
    processedItem.CarOnStop = BusEventItem.CarOnStop;

    // check whether this bus is on the route
    const thisRouteID = parseInt(BusEventItem.RouteID);
    const thisBusID = BusEventItem.BusID;
    let isOnThisRoute: boolean = false;
    let index: number = 0;
    if (thisRouteID === RouteID || PathAttributeId.indexOf(thisRouteID) > -1 || thisRouteID === RouteID * 10) {
      isOnThisRoute = true;
      index = String(BusEventItem.BusID).charCodeAt(0) * Math.pow(10, -5);
    } else {
      isOnThisRoute = false;
      index = String(BusEventItem.BusID).charCodeAt(0);
    }
    processedItem.onThisRoute = isOnThisRoute;
    processedItem.index = index;

    // collect data from 'BusData'
    let thisBusData = {};
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

interface FormattedBus {
  type: '一般' | '低底盤' | '大復康巴士' | '狗狗友善專車' | '未知類型';
  carNumber: string;
  status: FormattedBusStatus;
  RouteName: string;
  onThisRoute: boolean;
  index: number;
  position: FormattedBusPosition;
}

export function formatBus(object: ProcessedBus): FormattedBus {
  let result: FormattedBus = {};

  const CarType = parseInt(object.CarType);
  let type = '';
  switch (CarType) {
    case 0:
      type = '一般';
      break;
    case 1:
      type = '低底盤';
      break;
    case 2:
      type = '大復康巴士';
      break;
    case 3:
      type = '狗狗友善專車';
      break;
    default:
      type = '未知類型';
  }

  result.type = type;

  const CarOnStop = parseInt(object.CarOnStop);
  let onStop = '';
  switch (CarOnStop) {
    case 0:
      onStop = '離站';
      break;
    case 1:
      onStop = '進站';
      break;
    default:
      onStop = '未知狀態'; // Handle unexpected values if necessary
  }

  const BusStatus = parseInt(object.BusStatus);
  let situation = '';
  switch (BusStatus) {
    case 0:
      situation = '正常';
      break;
    case 1:
      situation = '車禍';
      break;
    case 2:
      situation = '故障';
      break;
    case 3:
      situation = '塞車';
      break;
    case 4:
      situation = '緊急求援';
      break;
    case 5:
      situation = '加油';
      break;
    case 99:
      situation = '非營運狀態';
      break;
    default:
      situation = '未知狀態'; // Handle unexpected values if necessary
  }

  result.carNumber = object.BusID;
  result.status = {
    onStop: onStop,
    situation: situation,
    text: `${onStop} | ${situation}`
  };
  result.RouteName = object.RouteName;
  result.onThisRoute = object.onThisRoute;
  result.index = object.index;
  result.position = object.position;
  return result;
}

export function formatBusEvent(buses: Array<ProcessedBus>): Array<FormattedBus> | null {
  if (buses.length === 0) {
    return null;
  }
  var result = [];
  for (var bus of buses) {
    result.push(formatBus(bus));
  }
  return result;
}

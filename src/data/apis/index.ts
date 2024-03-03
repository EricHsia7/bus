import { getEstimateTime } from './getEstimateTime.ts';
import { getStop } from './getStop.ts';
import { getBusEvent } from './getBusEvent.ts';
import { getRoute } from './getRoute.ts';
import { getProvider } from './getProvider.ts';
import { getTimeTable } from './getTimeTable.ts';
import { searchRouteByPathAttributeId } from '../search/searchRoute.ts';

function processStop(Stop: object): object {
  var result = {};
  for (var item of Stop) {
    result['stop_' + item.Id] = item;
  }
  return result;
}

async function processBusEvent(BusEvent: object, RouteID: number, PathAttributeId: [number]): object {
  var result = {};
  for (var item of BusEvent) {
    var thisRouteID = parseInt(item.RouteID);
    if (thisRouteID === RouteID || PathAttributeId.indexOf(String(thisRouteID)) > -1 || thisRouteID === RouteID * 10) {
      item.onThisRoute = true;
      item.index = String(item.BusID).charCodeAt(0) * Math.pow(10, -5);
    } else {
      item.onThisRoute = false;
      item.index = String(item.BusID).charCodeAt(0);
    }
    var searchRouteResult = await searchRouteByPathAttributeId(thisRouteID);
    item.RouteName = searchRouteResult.length > 0 ? searchRouteResult[0].n : '';
    if (!result.hasOwnProperty('stop_' + item.StopID)) {
      result['stop_' + item.StopID] = [item];
    } else {
      result['stop_' + item.StopID].push(item);
    }
  }
  for (var key in result) {
    result[key] = result[key].sort(function (a, b) {
      return a.index - b.index;
    });
  }
  return result;
}

function processEstimateTime(EstimateTime: object, Stop: object, BusEvent: object, Route: object, RouteID: number, PathAttributeId: [number]): [] {
  var result = [];
  var array = [];
  for (var item of EstimateTime) {
    var thisRouteID = parseInt(item.RouteID);
    if (Stop.hasOwnProperty('stop_' + item.StopID)) {
      item['_Stop'] = Stop['stop_' + item.StopID];
    }
    if (BusEvent.hasOwnProperty('stop_' + item.StopID)) {
      item['_BusEvent'] = BusEvent['stop_' + item.StopID];
    } else {
      item['_BusEvent'] = [];
    }
    item['_overlappingRoutes'] = [];
    if (thisRouteID === RouteID || PathAttributeId.indexOf(String(thisRouteID)) > -1 || thisRouteID === RouteID * 10) {
      result.push(item);
    } else {
      array.push(item);
    }
  }
  var result2 = [];
  for (var item of result) {
    if (item.hasOwnProperty('_Stop')) {
      item._overlappingRouteStops = array.filter((e) => {
        if (e.hasOwnProperty('_Stop')) {
          if (e._Stop.stopLocationId === item._Stop.stopLocationId) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      for (var stop of item._overlappingRouteStops) {
        if (BusEvent.hasOwnProperty('stop_' + stop.StopID)) {
          item['_BusEvent'] = item['_BusEvent'].concat(BusEvent['stop_' + stop.StopID]);
        }
        if (Route.hasOwnProperty(`r_${stop.routeId}`)) {
          item['_overlappingRoutes'] = item['_overlappingRoutes'].concat(Object.assign({ id: stop.routeId }, Route[`r_${stop.routeId}`]));
        }
      }
    }
    result2.push(item);
  }

  result2 = result2.sort(function (a, b) {
    var c = 0;
    var d = 0;
    if (a.hasOwnProperty('_Stop')) {
      c = a._Stop.seqNo;
    }
    if (b.hasOwnProperty('_Stop')) {
      d = b._Stop.seqNo;
    }
    return c - d;
  });
  return result2;
}

export async function integrateRoute(RouteID: number, PathAttributeId: [number], requestID: string): object {
  var Route = await getRoute(requestID, true);
  var Stop = await getStop(requestID);
  var EstimateTime = await getEstimateTime(requestID);
  var BusEvent = await getBusEvent(requestID);
  var processedBusEvent = await processBusEvent(BusEvent, RouteID, PathAttributeId);
  var processedStop = processStop(Stop);
  var processedEstimateTime = processEstimateTime(EstimateTime, processedStop, processedBusEvent, Route, RouteID, PathAttributeId);
  var thisRoute = Route[`r_${RouteID}`];
  var thisRouteName = thisRoute.n;
  var thisRouteDeparture = thisRoute.dep;
  var thisRouteDestination = thisRoute.des;
  return {
    items: processedEstimateTime,
    RouteName: thisRouteName,
    RouteEndPoints: {
      RouteDeparture: thisRouteDeparture,
      RouteDestination: thisRouteDestination
    }
  };
}
/*
async function integrateRouteInfo(RouteID: number, PathAttributeId: number) {
  var minuteToStr = function (s) {
    return parseInt(s) + '分';
  };

  var hourWindow = function (str) {
    str = String(str);
    var length = str.length;
    if (length === 4) {
      var min = minuteToStr(str.substring(0, 2));
      var max = minuteToStr(str.substring(2, 4));
      return min + '-' + max;
    }
    if (length === 2) {
      return minuteToStr(str);
    }
    return str;
  };

  var time24hToStr = function (str) {
    str = String(str);
    var length = str.length;
    if (length === 4) {
      var hours = str.substring(0, 2);
      var minutes = str.substring(2, 4);
      return hours + ':' + minutes;
    }
    return str;
  };

  var timetableByDayType = { weekday: {}, holiday: {}, specialday: {} };
  var weekdayCount = 0;
  var holidayCount = 0;

  for (var i = 0; i < l3; i++) {
    var thisTimetable = o3[i];
    var thisPID = thisTimetable.PathAttributeId;
    if (thisPID === c_routeid_p || thisPID === c_routeid || thisPID === c_routeid * 10) {
      var dateValue = thisTimetable.DateValue;
      var departureTime = thisTimetable.DepartureTime;
      if (thisTimetable.DateType === '0') {
        if (dateValue === '1' || dateValue === '7') {
          timetableByDayType['holiday']['t_' + departureTime] = thisTimetable;
          holidayCount += 1;
        } else {
          timetableByDayType['weekday']['t_' + departureTime] = thisTimetable;
          weekdayCount += 1;
        }
      } else {
        timetableByDayType['specialday']['t_' + departureTime] = thisTimetable;
      }
    } else {
      continue;
    }
  }
  var weekdayTimetable = [];
  var holidayTimetable = [];
  var specialdayTimetable = [];
  var weekdayTimetableStr = '';
  var holidayTimetableStr = '';

  if (weekdayCount >= 1) {
    for (var f in timetableByDayType['weekday']) {
      var thisF = timetableByDayType['weekday'][f];
      weekdayTimetable.push(time24hToStr(thisF.DepartureTime));
    }
    weekdayTimetable.sort(function (a, b) {
      var timeA = a.split(':');
      var timeB = b.split(':');
      var minutesA = parseInt(timeA[0]) * 60 + parseInt(timeA[1]);
      var minutesB = parseInt(timeB[0]) * 60 + parseInt(timeB[1]);
      return minutesA - minutesB;
    });
    weekdayTimetableStr = weekdayTimetable.join('|');
  }
  if (holidayCount >= 1) {
    for (var f in timetableByDayType['holiday']) {
      var thisF = timetableByDayType['holiday'][f];
      holidayTimetable.push(time24hToStr(thisF.DepartureTime));
    }
    holidayTimetable.sort(function (a, b) {
      var timeA = a.split(':');
      var timeB = b.split(':');
      var minutesA = parseInt(timeA[0]) * 60 + parseInt(timeA[1]);
      var minutesB = parseInt(timeB[0]) * 60 + parseInt(timeB[1]);
      return minutesA - minutesB;
    });
    holidayTimetableStr = holidayTimetable.join('|');
  }
  var weekdayHeadway = '尖峰:' + hourWindow(u.peakHeadway) + '|離峰:' + hourWindow(u.offPeakHeadway);
  if (u.peakHeadway.length <= 0) {
    weekdayHeadway = undefined;
  }
  var holidayHeadway = '尖峰:' + hourWindow(u.holidayPeakHeadway) + '|離峰:' + hourWindow(u.holidayOffPeakHeadway);
  if (u.holidayPeakHeadway.length <= 0) {
    holidayHeadway = undefined;
  }
  setField('route_name', u.nameZh);
  setField('route_departure', u.departureZh);
  setField('route_destination', u.destinationZh);
  setField('route_weekday_first', time24hToStr(u.goFirstBusTime));
  setField('route_weekday_last', time24hToStr(u.goLastBusTime));
  setField('route_weekday', weekdayHeadway);
  setField('route_weekday_timetable', weekdayTimetableStr);
  setField('route_holiday_timetable', holidayTimetableStr);
  setField('route_holiday_first', time24hToStr(u.holidayGoFirstBusTime));
  setField('route_holiday_last', time24hToStr(u.holidayGoLastBusTime));
  setField('route_holiday', holidayHeadway);
  setField('route_price', u.ticketPriceDescriptionZh);
  setField('route_buffer', u.segmentBufferZh);
  setField('route_provider', u.providerName);
  setField('route_tel', u2.phoneInfo);
  setField('route_email', u2.email);
}
*/

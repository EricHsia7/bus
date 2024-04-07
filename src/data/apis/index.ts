import { getEstimateTime } from './getEstimateTime.ts';
import { getStop } from './getStop.ts';
import { getBusEvent } from './getBusEvent.ts';
import { getRoute } from './getRoute.ts';
import { getProvider } from './getProvider.ts';
import { getSemiTimeTable } from './getSemiTimeTable.ts';
import { getTimeTable } from './getTimeTable.ts';
import { getRushHour } from './getRushHour.ts';
import { searchRouteByPathAttributeId } from '../search/searchRoute.ts';
import { getLocation } from './getLocation.ts';
import { setDataReceivingProgress, deleteDataReceivingProgress, dataUpdateTime, deleteDataUpdateTime } from './loader.ts';
import { recordEstimateTime } from '../analytics/update-rate.ts';
import { formatTimeCode, dateValueToDayOfWeek } from '../../tools/format-time.ts';
import { md5 } from '../../tools/index.ts';

function processSegmentBuffer(buffer: string): object {
  const regex = /[\u4E00-\u9FFF\(\)（）]*/gm;
  const directionRegex = /[\(（]{1,3}[往去返回程]{1,3}[\)|）\:：\s]{1,3}/gm;
  var result = {};
  var current_group = 0;
  var matches = buffer.matchAll(regex);
  for (var match of matches) {
    if (!(match === null)) {
      if (directionRegex.test(match[0])) {
        if (match[0].indexOf('往') > -1 || match[0].indexOf('去') > -1) {
          current_group = 0;
        }
        if (match[0].indexOf('返') > -1 || match[0].indexOf('回') > -1) {
          current_group = 1;
        }
      }
      var key = `g_${current_group}`;
      if (!result.hasOwnProperty(key)) {
        result[key] = [];
      }
      var extratedName = String(match[0].replaceAll(directionRegex, '')).trim();
      if (extratedName.length > 0) {
        result[key].push(extratedName);
      }
    }
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
    if (!result.hasOwnProperty('s_' + item.StopID)) {
      result['s_' + item.StopID] = [item];
    } else {
      result['s_' + item.StopID].push(item);
    }
  }
  for (var key in result) {
    result[key] = result[key].sort(function (a, b) {
      return a.index - b.index;
    });
  }
  return result;
}

function processEstimateTime(EstimateTime: [], Stop: object, Location: object, BusEvent: object, Route: object, segmentBuffer: object, RouteID: number, PathAttributeId: [number]): [] {
  var result = [];
  for (var item of EstimateTime) {
    var thisRouteID = parseInt(item.RouteID);
    if (thisRouteID === RouteID || PathAttributeId.indexOf(String(thisRouteID)) > -1 || thisRouteID === RouteID * 10) {
      if (BusEvent.hasOwnProperty('s_' + item.StopID)) {
        item['_BusEvent'] = BusEvent['s_' + item.StopID];
      } else {
        item['_BusEvent'] = [];
      }
      item['_segmentBuffer'] = false; //0→starting of the range; 1→ending of the range

      if (Stop.hasOwnProperty('s_' + item.StopID)) {
        item['_Stop'] = Stop['s_' + item.StopID];
        if (Location.hasOwnProperty(`l_${item._Stop.stopLocationId}`)) {
          if (Stop.hasOwnProperty('s_' + item.StopID)) {
            item['_Stop'].nameZh = Location[`l_${item._Stop.stopLocationId}`].n;
            var segmentBufferOfThisGroup = (segmentBuffer[`g_${item._Stop.goBack}`] ? segmentBuffer[`g_${item._Stop.goBack}`] : segmentBuffer[`g_0`].reverse()) || [];
            //console.log(segmentBuffer, segmentBufferOfThisGroup, item['_Stop'].nameZh);
            if (segmentBufferOfThisGroup.indexOf(item['_Stop'].nameZh) > -1) {
              item['_segmentBuffer'] = true;
            }
            item['_overlappingRouteStops'] = Location[`l_${item._Stop.stopLocationId}`].s.filter((e) => {
              return e === item.StopID ? false : true;
            });
            item['_Stop'].la = Location[`l_${item._Stop.stopLocationId}`].la;
            item['_Stop'].lo = Location[`l_${item._Stop.stopLocationId}`].lo;
            for (var routeStopId of item['_overlappingRouteStops']) {
              item['_BusEvent'] = item['_BusEvent'].concat(BusEvent.hasOwnProperty('s_' + routeStopId) ? BusEvent['s_' + routeStopId] : []);
            }
          }
          item['_overlappingRoutes'] = Location[`l_${item._Stop.stopLocationId}`].r
            .map((routeId) => {
              return Route.hasOwnProperty('r_' + routeId) ? Route[`r_${routeId}`] : {};
            })
            .filter((e) => {
              return e.id === RouteID ? false : true;
            });
        }
      }
      if (item.hasOwnProperty('_Stop')) {
        if (item._Stop.hasOwnProperty('nameZh')) {
          result.push(item);
        }
      }
    }
  }

  result = result.sort(function (a, b) {
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
  var result2 = [];
  var endpointCount = 0;
  var multipleEndpoints = segmentBuffer['g_0'].length % 2 === 0 ? true : false;
  for (var item of result) {
    if (multipleEndpoints) {
      if (item._segmentBuffer) {
        endpointCount += 1;
      }
      if (endpointCount % 2 === 1) {
        item._segmentBuffer = true;
      }
    }
    result2.push(item);
  }
  return result2;
}

export async function integrateRoute(RouteID: number, PathAttributeId: [number], requestID: string): object {
  setDataReceivingProgress(requestID, 'getRoute', 0, false);
  setDataReceivingProgress(requestID, 'getStop', 0, false);
  setDataReceivingProgress(requestID, 'getLocation', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent', 0, false);
  var Route = await getRoute(requestID, true);
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID);
  var EstimateTime = await getEstimateTime(requestID);
  var BusEvent = await getBusEvent(requestID);
  var processedBusEvent = await processBusEvent(BusEvent, RouteID, PathAttributeId);
  var processedSegmentBuffer = processSegmentBuffer(Route[`r_${RouteID}`].s);
  var processedEstimateTime = processEstimateTime(EstimateTime, Stop, Location, processedBusEvent, Route, processedSegmentBuffer, RouteID, PathAttributeId);
  var thisRoute = Route[`r_${RouteID}`];
  var thisRouteName = thisRoute.n;
  var thisRouteDeparture = thisRoute.dep;
  var thisRouteDestination = thisRoute.des;
  var result = {
    items: processedEstimateTime,
    RouteName: thisRouteName,
    RouteEndPoints: {
      RouteDeparture: thisRouteDeparture,
      RouteDestination: thisRouteDestination
    },
    dataUpdateTime: dataUpdateTime[requestID]
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  await recordEstimateTime(EstimateTime);
  return result;
}

export async function integrateStop(StopID: number, RouteID: number): object {
  const requestID = `r_${md5(Math.random() * new Date().getTime())}`;
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID);
  var Route = await getRoute(requestID);
  var thisStop = Stop[`s_${StopID}`];
  var thisStopDirection = thisStop.goBack;
  var thisLocation = Location[`l_${thisStop.stopLocationId}`];
  var thisStopName = thisLocation.n;
  var thisRoute = Route[`r_${RouteID}`];
  var thisRouteName = thisRoute.n;
  var thisRouteDeparture = thisRoute.dep;
  var thisRouteDestination = thisRoute.des;
  return {
    thisStopName,
    thisStopDirection,
    thisRouteName,
    thisRouteDeparture,
    thisRouteDestination
  };
}

function processEstimateTime2(EstimateTime: [], StopIDs: []): {} {
  var result = {};
  for (var item of EstimateTime) {
    if (StopIDs.indexOf(item.StopID) > -1) {
      result[`s_${item.StopID}`] = item;
    }
  }
  return result;
}

export async function integrateEstimateTime2(requestID: string, StopIDs: []): object {
  setDataReceivingProgress(requestID, 'getEstimateTime', 0, false);
  var EstimateTime = await getEstimateTime(requestID);
  var processedEstimateTime2 = processEstimateTime2(EstimateTime, StopIDs);
  var result = {
    items: processedEstimateTime2,
    dataUpdateTime: dataUpdateTime[requestID]
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  return result;
}

export function preloadData(): void {
  var requestID = 'preload_data';
  getRoute(requestID, true).then((e) => {
    getStop(requestID);
    getLocation(requestID);
  });
}

export async function integrateRouteInformation(RouteID: number, PathAttributeId: [number], requestID: string): object {
  function getThisRoute(Route: [], RouteID: number): object {
    var thisRoute = {};
    for (var item of Route) {
      if (item.Id === RouteID) {
        thisRoute = item;
        break;
      }
    }
    return thisRoute;
  }

  function getTimeTableRules(thisRoute: object): object {
    var thisRouteGoFirstBusTime = formatTimeCode(thisRoute.goFirstBusTime, 0);
    var thisRouteGoLastBusTime = formatTimeCode(thisRoute.goLastBusTime, 0);

    var thisRouteBackFirstBusTime = formatTimeCode(thisRoute.backFirstBusTime, 0);
    var thisRouteBackLastBusTime = formatTimeCode(thisRoute.backLastBusTime, 0);

    var thisRouteGoFirstBusTimeOnHoliday = formatTimeCode(thisRoute.holidayGoFirstBusTime, 0);
    var thisRouteGoLastBusTimeOnHoliday = formatTimeCode(thisRoute.holidayGoLastBusTime, 0);

    var thisRouteBackFirstBusTimeOnHoliday = formatTimeCode(thisRoute.holidayBackFirstBusTime, 0);
    var thisRouteBackLastBusTimeOnHoliday = formatTimeCode(thisRoute.holidayBackLastBusTime, 0);

    var rushHourWindow = formatTimeCode(thisRoute.peakHeadway, 1);
    var offRushHourWindow = formatTimeCode(thisRoute.offPeakHeadway, 1);

    var rushHourWindowOnHoliday = formatTimeCode(thisRoute.holidayPeakHeadway, 1);
    var offRushHourWindowOnHoliday = formatTimeCode(thisRoute.holidayOffPeakHeadway, 1);
    //window → the interval/gap between arrivals of buses

    var realSequence = thisRoute.realSequence;
    return {
      go: {
        weekday: {
          first: thisRouteGoFirstBusTime,
          last: thisRouteGoLastBusTime,
          rushHourWindow: rushHourWindow,
          offRushHourWindow: offRushHourWindow
        },
        holiday: {
          first: thisRouteGoFirstBusTimeOnHoliday,
          last: thisRouteGoLastBusTimeOnHoliday,
          rushHourWindow: rushHourWindowOnHoliday,
          offRushHourWindow: offRushHourWindowOnHoliday
        }
      },
      back: {
        weekday: {
          first: thisRouteBackFirstBusTime,
          last: thisRouteBackLastBusTime,
          rushHourWindow: rushHourWindow,
          offRushHourWindow: offRushHourWindow
        },
        holiday: {
          first: thisRouteBackFirstBusTimeOnHoliday,
          last: thisRouteBackFirstBusTimeOnHoliday,
          rushHourWindow: rushHourWindowOnHoliday,
          offRushHourWindow: offRushHourWindowOnHoliday
        }
      },
      realSequence: realSequence
    };
  }

  function generateCalendarFromTimeTables(RouteID: number, PathAttributeId: [number], timeTableRules: object, SemiTimeTable: [], TimeTable: []): object {
    function getThisWeekOrigin(): Date {
      var today: Date = new Date();
      var dayOfToday: number = today.getDay();
      var originDate: number = today.getDate() - dayOfToday;
      var origin: Date = new Date();
      origin.setDate(originDate);
      origin.setHours(0);
      origin.setMinutes(0);
      origin.setSeconds(0);
      origin.setMilliseconds(0);
      return origin;
    }

    function offsetDate(origin: Date, date: number, hours: number, minutes: number): Date {
      var duplicatedOrigin = new Date();
      duplicatedOrigin.setDate(1);
      duplicatedOrigin.setMonth(0);
      duplicatedOrigin.setHours(hours);
      duplicatedOrigin.setMinutes(minutes);
      duplicatedOrigin.setSeconds(0);
      duplicatedOrigin.setMilliseconds(0);
      duplicatedOrigin.setFullYear(origin.getFullYear());
      duplicatedOrigin.setMonth(origin.getMonth());
      duplicatedOrigin.setDate(origin.getDate());
      duplicatedOrigin.setDate(duplicatedOrigin.getDate() + date);
      return duplicatedOrigin;
    }

    var calendar = {};
    var thisWeekOrigin = getThisWeekOrigin();
    for (var item of SemiTimeTable) {
      if (PathAttributeId.indexOf(item.PathAttributeId) > -1) {
        if (item.DateType === '0') {
          var dayOfWeek = dateValueToDayOfWeek(item.DateValue);

          var thisDayOrigin = offsetDate(thisWeekOrigin, dayOfWeek.day, 0, 0);

          if (!calendar.hasOwnProperty(dayOfWeek.code)) {
            calendar[dayOfWeek.code] = [];
          }

          var thisPeriodStartTime = formatTimeCode(item.StartTime, 0);
          var thisPeriodStartTimeDateObject = offsetDate(thisDayOrigin, 0, thisPeriodStartTime.hours, thisPeriodStartTime.minutes);

          var thisPeriodEndTime = formatTimeCode(item.EndTime, 0);
          var thisPeriodEndTimeDateObject = offsetDate(thisDayOrigin, 0, thisPeriodEndTime.hours, thisPeriodEndTime.minutes);

          var thisPeriodDurationInMinutes = Math.abs(thisPeriodEndTime.hours * 60 + thisPeriodEndTime.minutes - (thisPeriodStartTime.hours * 60 + thisPeriodStartTime.minutes));

          var minWindow = parseInt(item.LongHeadway);
          var maxWindow = parseInt(item.LowHeadway);
          var averageWindow = (maxWindow + minWindow) / 2;

          var headwayQuantity = thisPeriodDurationInMinutes / averageWindow;
          for (var i = 0; i < headwayQuantity; i++) {
            var violateRules = false;
            var thisHeadwayDate = offsetDate(thisDayOrigin, 0, thisPeriodStartTime.hours, thisPeriodStartTime.minutes + averageWindow * i);
            if (thisHeadwayDate.getTime() < thisPeriodStartTimeDateObject.getTime()) {
              violateRules = true;
            }
            if (thisHeadwayDate.getTime() > thisPeriodEndTimeDateObject.getTime()) {
              violateRules = true;
            }
            /*need to complete - check timeTableRules*/
            if (violateRules === false) {
              calendar[dayOfWeek.code].push({
                date: thisHeadwayDate,
                duration: maxWindow + minWindow,
                deviation: Math.abs(averageWindow - maxWindow)
              });
            }
          }
        }
      }
    }
    for (var item of TimeTable) {
      if (PathAttributeId.indexOf(item.PathAttributeId) > -1) {
        if (item.DateType === '0') {
          var violateRules = false;
          var dayOfWeek = dateValueToDayOfWeek(item.DateValue);
          var thisDayOrigin = offsetDate(thisWeekOrigin, dayOfWeek.day, 0, 0);
          if (!calendar.hasOwnProperty(dayOfWeek.code)) {
            calendar[dayOfWeek.code] = [];
          }
          var thisDepartureTime = formatTimeCode(item.DepartureTime, 0);
          var thisHeadwayDate = thisDayOrigin(thisWeekOrigin, dayOfWeek, thisDepartureTime.hours, thisDepartureTime.minutes);
          /*need to complete - check timeTableRules*/
          if (violateRules === false) {
            calendar[dayOfWeek.code].push({
              date: thisHeadwayDate,
              duration: maxWindow + minWindow,
              deviation: Math.abs(averageWindow - maxWindow)
            });
          }
        }
      }
    }
    return calendar;
  }

  var Route = await getRoute(requestID, false);
  var thisRoute = getThisRoute(Route);

  var SemiTimeTable = await getSemiTimeTable(requestID);
  var TimeTable = await getTimeTable(requestID);
  var timeTableRules = getTimeTableRules(thisRoute);
  var calendar = generateCalendarFromTimeTables(RouteID, PathAttributeId, timeTableRules, SemiTimeTable, TimeTable);

  var thisRouteName = thisRoute.nameZh;
  var thisRouteName = thisRoute.nameZh;

  var thisRouteDeparture = thisRoute.departureZh;
  var thisRouteDestination = thisRoute.destinationZh;

  var result = {
    name: thisRouteName,
    endPoints: {
      departure: thisRouteDeparture,
      destination: thisRouteDestination
    },
    timeTableRules: timeTableRules,
    calendar
  };
  return result;
}

/*
async function integrateRouteInfo(RouteID: number, PathAttributeId: [number]) {
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

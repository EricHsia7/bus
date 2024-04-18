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
import { formatTimeCode, dateValueToDayOfWeek, dateToString } from '../../tools/format-time.ts';
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
      var extractedName = String(match[0].replaceAll(directionRegex, '')).trim();
      if (extractedName.length > 0) {
        result[key].push(extractedName);
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
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(requestID, 'getStop_0', 0, false);
  setDataReceivingProgress(requestID, 'getStop_1', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_0', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_1', 0, false);
  var Route = await getRoute(requestID, true);
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID, false);
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
  var Location = await getLocation(requestID, false);
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

export async function integrateRouteDetails(RouteID: number, PathAttributeId: [number], requestID: string): object {
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

    var calendar = {
      groupedEvents: {
        d_0: [],
        d_1: [],
        d_2: [],
        d_3: [],
        d_4: [],
        d_5: [],
        d_6: []
      },
      eventGroups: {
        d_0: {
          name: '日',
          day: 0,
          code: 'd_0'
        },
        d_1: {
          name: '一',
          day: 1,
          code: 'd_1'
        },
        d_2: {
          name: '二',
          day: 2,
          code: 'd_2'
        },
        d_3: {
          name: '三',
          day: 3,
          code: 'd_3'
        },
        d_4: {
          name: '四',
          day: 4,
          code: 'd_4'
        },
        d_5: {
          name: '五',
          day: 5,
          code: 'd_5'
        },
        d_6: {
          name: '六',
          day: 6,
          code: 'd_6'
        }
      },
      eventGroupQuantity: 7,
      eventQuantity: {
        d_0: 0,
        d_1: 0,
        d_2: 0,
        d_3: 0,
        d_4: 0,
        d_5: 0,
        d_6: 0
      }
    };
    var thisWeekOrigin = getThisWeekOrigin();
    for (var item of SemiTimeTable) {
      if (PathAttributeId.indexOf(item.PathAttributeId) > -1) {
        if (item.DateType === '0') {
          var dayOfWeek = dateValueToDayOfWeek(item.DateValue);

          var thisDayOrigin = offsetDate(thisWeekOrigin, dayOfWeek.day, 0, 0);
          /*
          if (!calendar.groupedEvents.hasOwnProperty(dayOfWeek.code)) {
                      calendar.groupedEvents[dayOfWeek.code] = [];
                      calendar.eventGroups[dayOfWeek.code] = dayOfWeek;
                      calendar.eventGroupQuantity = calendar.eventGroupQuantity + 1;
                      calendar.eventQuantity[dayOfWeek.code] = 0;
            }
          */

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
            var thisHeadwayDate = offsetDate(thisDayOrigin, 0, thisPeriodStartTime.hours, thisPeriodStartTime.minutes + maxWindow * i);
            if (thisHeadwayDate.getTime() < thisPeriodStartTimeDateObject.getTime()) {
              violateRules = true;
            }
            if (thisHeadwayDate.getTime() > thisPeriodEndTimeDateObject.getTime()) {
              violateRules = true;
            }
            /*need to complete - check timeTableRules*/
            if (violateRules === false) {
              calendar.groupedEvents[dayOfWeek.code].push({
                date: thisHeadwayDate,
                dateString: dateToString(thisHeadwayDate, 'hh:mm'),
                duration: maxWindow,
                deviation: Math.abs(averageWindow - maxWindow)
              });
              calendar.eventQuantity[dayOfWeek.code] = calendar.eventQuantity[dayOfWeek.code] + 1;
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
          /*
          if (!calendar.groupedEvents.hasOwnProperty(dayOfWeek.code)) {
            calendar.groupedEvents[dayOfWeek.code] = [];
            calendar.eventGroups[dayOfWeek.code] = dayOfWeek;
            calendar.eventGroupQuantity = calendar.eventGroupQuantity + 1;
            calendar.eventQuantity[dayOfWeek.code] = 0;
          }
          */
          var thisDepartureTime = formatTimeCode(item.DepartureTime, 0);
          var thisHeadwayDate = offsetDate(thisDayOrigin, 0, thisDepartureTime.hours, thisDepartureTime.minutes);
          /*need to complete - check timeTableRules*/
          if (violateRules === false) {
            calendar.groupedEvents[dayOfWeek.code].push({
              date: thisHeadwayDate,
              dateString: dateToString(thisHeadwayDate, 'hh:mm'),
              duration: 15,
              deviation: 0
            });
            calendar.eventQuantity[dayOfWeek.code] = calendar.eventQuantity[dayOfWeek.code] + 1;
          }
        }
      }
    }
    for (var code in calendar.groupedEvents) {
      calendar.groupedEvents[code] = calendar.groupedEvents[code].sort(function (a, b) {
        return a.date.getTime() - b.date.getTime();
      });
    }
    return calendar;
  }

  function getThisProvider(Provider: [], providerId: number): object {
    var thisProvider = {};
    for (var item of Provider) {
      if (item.id === providerId) {
        thisProvider = item;
      }
    }
    return thisProvider;
  }

  var Route = await getRoute(requestID, false);
  var thisRoute = getThisRoute(Route, RouteID);

  var SemiTimeTable = await getSemiTimeTable(requestID);
  var TimeTable = await getTimeTable(requestID);
  var Provider = await getProvider(requestID);
  var timeTableRules = getTimeTableRules(thisRoute);
  var calendar = generateCalendarFromTimeTables(RouteID, PathAttributeId, timeTableRules, SemiTimeTable, TimeTable);
  var thisProviderId = thisRoute.providerId;
  var thisProvider = getThisProvider(Provider, thisProviderId);

  var result = {
    timeTableRules: timeTableRules,
    calendar: calendar,
    properties: [
      {
        key: 'route_name',
        icon: 'route',
        value: thisRoute.nameZh
      },
      {
        key: 'pricing',
        icon: 'money',
        value: thisRoute.ticketPriceDescriptionZh
      },
      {
        key: 'provider_name',
        icon: 'company',
        value: thisProvider.nameZn
      },
      {
        key: 'provider_phone',
        icon: 'phone',
        value: thisProvider.phoneInfo
      },
      {
        key: 'provider_email',
        icon: 'email',
        value: thisProvider.email
      }
    ]
  };
  return result;
}

export async function integrateLocation(hash: string, requestID: string): object {
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(requestID, 'getStop_0', 0, false);
  setDataReceivingProgress(requestID, 'getStop_1', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_0', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_1', 0, false);
  var Route = await getRoute(requestID, true);
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID, true);
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
    groupedItems: processedEstimateTime,
    LocationName: thisRouteName,
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

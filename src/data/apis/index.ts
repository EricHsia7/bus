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
import { formatEstimateTime, formatTimeCode, dateValueToDayOfWeek, dateToString } from '../../tools/format-time.ts';
import { md5 } from '../../tools/index.ts';
import { generateLabelFromAddresses, addressToString } from '../../tools/address.ts';
import { generateLetterLabels } from '../../tools/index.ts';
import { getSettingOptionValue } from '../settings/index.ts';

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

async function processBusEvent(BusEvent: [], RouteID: number, PathAttributeId: [number]): object {
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

async function processBusEvent2(BusEvent: [], StopIDs: number[]): object {
  var result = {};
  for (var item of BusEvent) {
    var thisStopID = parseInt(item.StopID);
    var thisRouteID = parseInt(item.RouteID);
    if (StopIDs.indexOf(thisStopID) > -1) {
      item.onThisRoute = true;
      item.index = String(item.BusID).charCodeAt(0) * Math.pow(10, -5);
      var searchRouteResult = await searchRouteByPathAttributeId(thisRouteID);
      item.RouteName = searchRouteResult.length > 0 ? searchRouteResult[0].n : '';
      if (!result.hasOwnProperty('s_' + item.StopID)) {
        result['s_' + item.StopID] = [item];
      } else {
        result['s_' + item.StopID].push(item);
      }
    }
  }
  for (var key in result) {
    result[key] = result[key].sort(function (a, b) {
      return a.index - b.index;
    });
  }
  return result;
}

function formatBusEvent(buses: []): [] | null {
  if (buses.length === 0) {
    return null;
  }
  var result = [];
  function formatBus(object: object): object {
    var result = {};
    var CarType = parseInt(object.CarType);
    if (CarType === 0) {
      result.type = '一般';
    }
    if (CarType === 1) {
      result.type = '低底盤';
    }
    if (CarType === 2) {
      result.type = '大復康巴士';
    }
    if (CarType === 3) {
      result.type = '狗狗友善專車';
    }
    var CarOnStop = parseInt(object.CarOnStop);
    var onStop = '';
    if (CarOnStop === 0) {
      onStop = '離站';
    }
    if (CarOnStop === 1) {
      onStop = '進站';
    }
    var BusStatus = parseInt(object.BusStatus);
    var situation = '';
    if (BusStatus === 0) {
      situation = '正常';
    }
    if (BusStatus === 1) {
      situation = '車禍';
    }
    if (BusStatus === 2) {
      situation = '故障';
    }
    if (BusStatus === 3) {
      situation = '塞車';
    }
    if (BusStatus === 4) {
      situation = '緊急求援';
    }
    if (BusStatus === 5) {
      situation = '加油';
    }
    if (BusStatus === 99) {
      situation = '非營運狀態';
    }
    result.carNumber = object.BusID;
    result.status = {
      onStop: onStop,
      situation: situation,
      text: `${onStop} | ${situation}`
    };
    result.RouteName = object.RouteName;
    result.onThisRoute = object.onThisRoute;
    return result;
  }
  for (var bus of buses) {
    result.push(formatBus(bus));
  }
  return result;
}

function formatOverlappingRoutes(array: []): [] {
  if (array.length === 0) {
    return null;
  }
  var result = [];
  for (var route of array) {
    var formattedItem = {
      name: route.n,
      RouteEndPoints: {
        RouteDeparture: route.dep,
        RouteDestination: route.des,
        text: `${route.dep} \u21CC ${route.des}`, //u21CC -> '⇌'
        html: `<span>${route.dep}</span><span>\u21CC</span><span>${route.des}</span>`
      },
      RouteID: route.id,
      PathAttributeId: route.pid ? route.pid : []
    };
    result.push(formattedItem);
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
  var time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  var thisRoute = Route[`r_${RouteID}`];

  var groupedItems = {};
  for (var item of processedEstimateTime) {
    var formattedItem = {};
    formattedItem.name = item.hasOwnProperty('_Stop') ? item._Stop.nameZh : null;
    formattedItem.status = formatEstimateTime(item.EstimateTime, time_formatting_mode);
    formattedItem.buses = item.hasOwnProperty('_BusEvent') ? formatBusEvent(item._BusEvent) : null;
    formattedItem.overlappingRoutes = item.hasOwnProperty('_overlappingRoutes') ? formatOverlappingRoutes(item._overlappingRoutes) : null;
    formattedItem.sequence = item.hasOwnProperty('_Stop') ? item._Stop.seqNo : -1;
    formattedItem.location = {
      latitude: item.hasOwnProperty('_Stop') ? item._Stop.la : null,
      longitude: item.hasOwnProperty('_Stop') ? item._Stop.lo : null
    };
    formattedItem.segmentBuffer = item._segmentBuffer;
    formattedItem.id = item.StopID || null;
    var group = item.hasOwnProperty('_Stop') ? `g_${item._Stop.goBack}` : 'g_0';
    if (!groupedItems.hasOwnProperty(group)) {
      groupedItems[group] = [];
    }
    groupedItems[group].push(formattedItem);
  }
  var groupQuantity = 0;
  var itemQuantity = {};
  for (var group in groupedItems) {
    if (!itemQuantity.hasOwnProperty(group)) {
      itemQuantity[group] = groupedItems[group].length;
    }
    groupQuantity += 1;
  }

  var thisRouteName = thisRoute.n;
  var thisRouteDeparture = thisRoute.dep;
  var thisRouteDestination = thisRoute.des;

  var result = {
    groupedItems: groupedItems,
    groupQuantity: groupQuantity,
    itemQuantity: itemQuantity,
    RouteName: thisRouteName,
    RouteEndPoints: {
      RouteDeparture: thisRouteDeparture,
      RouteDestination: thisRouteDestination
    },
    dataUpdateTime: dataUpdateTime[requestID],
    RouteID,
    PathAttributeId
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

function processEstimateTime2(EstimateTime: [], StopIDs: number[]): object {
  var result = {};
  for (var item of EstimateTime) {
    if (StopIDs.indexOf(parseInt(item.StopID)) > -1) {
      result[`s_${item.StopID}`] = item;
    }
  }
  return result;
}

export async function integrateEstimateTime2(requestID: string, StopIDs: number[]): object {
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
  setDataReceivingProgress(requestID, 'getLocation_0', 0, false);
  setDataReceivingProgress(requestID, 'getLocation_1', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_0', 0, false);
  setDataReceivingProgress(requestID, 'getRoute_1', 0, false);
  setDataReceivingProgress(requestID, 'getStop_0', 0, false);
  setDataReceivingProgress(requestID, 'getStop_1', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_0', 0, false);
  setDataReceivingProgress(requestID, 'getEstimateTime_1', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_0', 0, false);
  setDataReceivingProgress(requestID, 'getBusEvent_1', 0, false);
  var EstimateTime = await getEstimateTime(requestID);
  var Location = await getLocation(requestID, true);
  var Route = await getRoute(requestID, true);
  var Stop = await getStop(requestID);
  var BusEvent = await getBusEvent(requestID);
  var time_formatting_mode = getSettingOptionValue('time_formatting_mode');
  var use_addresses_as_location_labels = getSettingOptionValue('use_addresses_as_location_labels');
  var groupedItems = {};
  var itemQuantity = {};
  var groups = {};

  var LocationKey = `ml_${hash}`;
  var thisLocation = Location[LocationKey];
  var thisLocationName = thisLocation.n;
  var stopLocationIds = thisLocation.id;

  var StopIDs = [];
  var RouteIDs = [];
  var stopLocationQuantity = stopLocationIds.length;

  for (var i = 0; i < stopLocationQuantity; i++) {
    StopIDs = StopIDs.concat(thisLocation.s[i]);
    RouteIDs = RouteIDs.concat(thisLocation.r[i]);
  }
  var processedEstimateTime = processEstimateTime2(EstimateTime, StopIDs);
  var processedBusEvent = await processBusEvent2(BusEvent, StopIDs);
  var labels = [];
  if (use_addresses_as_location_labels) {
    labels = generateLabelFromAddresses(thisLocation.a);
  } else {
    labels = generateLetterLabels(stopLocationQuantity);
  }
  for (var i = 0; i < stopLocationQuantity; i++) {
    var groupKey = `g_${i}`;
    groupedItems[groupKey] = [];
    itemQuantity[groupKey] = 0;
    groups[groupKey] = {
      name: labels[i],
      properties: [
        {
          key: 'address',
          icon: 'personal_places',
          value: addressToString(thisLocation.a[i])
        },
        {
          key: 'exact_position',
          icon: 'location',
          value: `${thisLocation.la[i]}, ${thisLocation.lo[i]}`
        }
      ]
    };
    var stopQuantity = thisLocation.s[i].length;
    for (var o = 0; o < stopQuantity; o++) {
      var thisStopID = thisLocation.s[i][o];
      var thisStop = Stop[`s_${thisStopID}`];
      var thisRouteID = thisLocation.r[i][o];
      var thisRoute = Route[`r_${thisRouteID}`];
      var thisProcessedEstimateTime = processedEstimateTime[`s_${thisStopID}`];
      var thisProcessedBusEvent = processedBusEvent[`s_${thisStopID}`];
      if (Stop.hasOwnProperty(`s_${thisStopID}`) && Route.hasOwnProperty(`r_${thisRouteID}`)) {
        var formattedItem = {};
        formattedItem.status = processedEstimateTime.hasOwnProperty(`s_${thisStopID}`) ? formatEstimateTime(thisProcessedEstimateTime.EstimateTime, time_formatting_mode) : null;
        formattedItem.buses = processedBusEvent.hasOwnProperty(`s_${thisStopID}`) ? formatBusEvent(thisProcessedBusEvent) : null;
        formattedItem.route_name = thisRoute.n;
        formattedItem.route_direction = `往${[thisRoute.des, thisRoute.dep, ''][parseInt(thisStop.goBack)]}`;
        formattedItem.routeId = thisRouteID;
        groupedItems[groupKey].push(formattedItem);
        itemQuantity[groupKey] = itemQuantity[groupKey] + 1;
      }
    }
  }
  for (var key in groupedItems) {
    groupedItems[key] = groupedItems[key].sort(function (a, b) {
      return a.routeId - b.routeId;
    });
  }
  var result = {
    groupedItems: groupedItems,
    groups: groups,
    groupQuantity: stopLocationQuantity,
    itemQuantity: itemQuantity,
    LocationName: thisLocationName,
    dataUpdateTime: dataUpdateTime[requestID]
  };
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  await recordEstimateTime(EstimateTime);
  return result;
}

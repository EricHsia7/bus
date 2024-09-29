import { parseTimeCode } from "../apis/index";
import { getProvider } from "../apis/getProvider/index";
import { getRoute } from "../apis/getRoute/index";
import { getSemiTimeTable } from "../apis/getSemiTimeTable/index";
import { getTimeTable } from "../apis/getTimeTable/index";
import { dateToString, dateValueToDayOfWeek, getThisWeekOrigin, offsetDate } from "../../tools/time";

function findRoute(Route: Route, RouteID: number): RouteItem {
  var thisRoute: RouteItem = {};
  for (var item of Route) {
    if (item.Id === RouteID) {
      thisRoute = item;
      break;
    }
  }
  return thisRoute;
}

function findProvider(Provider: Provider, providerId: number): ProviderItem {
  var thisProvider = {};
  for (var item of Provider) {
    if (item.id === providerId) {
      thisProvider = item;
    }
  }
  return thisProvider;
}

function generateCalendarFromTimeTables(RouteID: number, PathAttributeId: Array<number>, timeTableRules: object, SemiTimeTable: Array, TimeTable: Array): object {
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
        var thisPeriodStartTime = parseTimeCode(item.StartTime, 0);
        var thisPeriodStartTimeDateObject = offsetDate(thisDayOrigin, 0, thisPeriodStartTime.hours, thisPeriodStartTime.minutes);
        var thisPeriodEndTime = parseTimeCode(item.EndTime, 0);
        var thisPeriodEndTimeDateObject = offsetDate(thisDayOrigin, 0, thisPeriodEndTime.hours, thisPeriodEndTime.minutes);
        var thisPeriodDurationInMinutes = Math.abs(thisPeriodEndTime.hours * 60 + thisPeriodEndTime.minutes - (thisPeriodStartTime.hours * 60 + thisPeriodStartTime.minutes));

        var minWindow = parseInt(item.LongHeadway);
        var maxWindow = parseInt(item.LowHeadway);
        var averageWindow = (maxWindow + minWindow) / 2;
        var headwayQuantity = thisPeriodDurationInMinutes / averageWindow;

        for (let i = 0; i < headwayQuantity; i++) {
          var violateRules = false;
          var thisHeadwayDate = offsetDate(thisDayOrigin, 0, thisPeriodStartTime.hours, thisPeriodStartTime.minutes + maxWindow * i);
          if (thisHeadwayDate.getTime() < thisPeriodStartTimeDateObject.getTime()) {
            violateRules = true;
          }
          if (thisHeadwayDate.getTime() > thisPeriodEndTimeDateObject.getTime()) {
            violateRules = true;
          }
          // TODO: check timeTableRules
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
        var thisDepartureTime = parseTimeCode(item.DepartureTime, 0);
        var thisHeadwayDate = offsetDate(thisDayOrigin, 0, thisDepartureTime.hours, thisDepartureTime.minutes);
        // TODO: check timeTableRules
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

function getTimeTableRules(thisRoute: RouteItem): object {
  var thisRouteGoFirstBusTime = parseTimeCode(thisRoute.goFirstBusTime, 0);
  var thisRouteGoLastBusTime = parseTimeCode(thisRoute.goLastBusTime, 0);

  var thisRouteBackFirstBusTime = parseTimeCode(thisRoute.backFirstBusTime, 0);
  var thisRouteBackLastBusTime = parseTimeCode(thisRoute.backLastBusTime, 0);

  var thisRouteGoFirstBusTimeOnHoliday = parseTimeCode(thisRoute.holidayGoFirstBusTime, 0);
  var thisRouteGoLastBusTimeOnHoliday = parseTimeCode(thisRoute.holidayGoLastBusTime, 0);

  var thisRouteBackFirstBusTimeOnHoliday = parseTimeCode(thisRoute.holidayBackFirstBusTime, 0);
  var thisRouteBackLastBusTimeOnHoliday = parseTimeCode(thisRoute.holidayBackLastBusTime, 0);

  var rushHourWindow = parseTimeCode(thisRoute.peakHeadway, 1);
  var offRushHourWindow = parseTimeCode(thisRoute.offPeakHeadway, 1);

  var rushHourWindowOnHoliday = parseTimeCode(thisRoute.holidayPeakHeadway, 1);
  var offRushHourWindowOnHoliday = parseTimeCode(thisRoute.holidayOffPeakHeadway, 1);
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
        last: thisRouteBackLastBusTimeOnHoliday,
        rushHourWindow: rushHourWindowOnHoliday,
        offRushHourWindow: offRushHourWindowOnHoliday
      }
    },
    realSequence: realSequence
  };
}

export async function integrateRouteDetails(RouteID: number, PathAttributeId: Array<number>, requestID: string): Promise<object> {
  var Route = await getRoute(requestID, false);
  var thisRoute = findRoute(Route, RouteID);

  var SemiTimeTable = await getSemiTimeTable(requestID);
  var TimeTable = await getTimeTable(requestID);
  var Provider = await getProvider(requestID);
  var timeTableRules = getTimeTableRules(thisRoute);
  var calendar = generateCalendarFromTimeTables(RouteID, PathAttributeId, timeTableRules, SemiTimeTable, TimeTable);
  var thisProviderId = thisRoute.providerId;
  var thisProvider = findProvider(Provider, thisProviderId);

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
        icon: 'attach_money',
        value: thisRoute.ticketPriceDescriptionZh
      },
      {
        key: 'provider_name',
        icon: 'corporate_fare',
        value: thisProvider.nameZn
      },
      {
        key: 'provider_phone',
        icon: 'call',
        value: thisProvider.phoneInfo
      },
      {
        key: 'provider_email',
        icon: 'alternate_email',
        value: thisProvider.email
      }
    ]
  };
  return result;
}

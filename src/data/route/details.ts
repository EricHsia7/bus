import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { dateToString, dateValueToDayOfWeek, getThisWeekOrigin, offsetDate } from '../../tools/time';
import { getProvider, Provider, ProviderItem } from '../apis/getProvider/index';
import { getRoute, Route, RouteItem } from '../apis/getRoute/index';
import { getSemiTimeTable } from '../apis/getSemiTimeTable/index';
import { getTimeTable } from '../apis/getTimeTable/index';
import { parseTimeCode, TimeMoment, TimeRange } from '../apis/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

function findRoute(Route: Route, RouteID: number): RouteItem {
  let thisRoute = {} as RouteItem;
  for (const item of Route) {
    if (item.Id === RouteID) {
      thisRoute = item;
      break;
    }
  }
  return thisRoute;
}

function findProvider(Provider: Provider, providerId: number): ProviderItem {
  let thisProvider = {} as ProviderItem;
  for (const item of Provider) {
    if (item.id === providerId) {
      thisProvider = item;
    }
  }
  return thisProvider;
}

export interface CalendarEvent {
  date: Date;
  dateString: string;
  duration: number;
  deviation: number;
}

export type CalendarEventGroup = Array<CalendarEvent>;

export interface CalendarDay {
  name: string;
  day: number;
  code: string;
}

export interface Calendar {
  calendarDays: {
    [key: string]: CalendarDay;
  };
  calendarDayQuantity: 7;
  calendarEventGroups: {
    [key: string]: CalendarEventGroup;
  };
  calendarEventQuantity: {
    [key: string]: number;
  };
}

function generateCalendarFromTimeTables(RouteID: number, PathAttributeId: Array<number>, timeTableRules: object, SemiTimeTable: [], TimeTable: []): Calendar {
  let calendar: Calendar = {
    calendarDays: {
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
    calendarDayQuantity: 7,
    calendarEventGroups: {
      d_0: [],
      d_1: [],
      d_2: [],
      d_3: [],
      d_4: [],
      d_5: [],
      d_6: []
    },
    calendarEventQuantity: {
      d_0: 0,
      d_1: 0,
      d_2: 0,
      d_3: 0,
      d_4: 0,
      d_5: 0,
      d_6: 0
    }
  };
  const thisWeekOrigin = getThisWeekOrigin();
  for (const item of SemiTimeTable) {
    if (PathAttributeId.indexOf(item.PathAttributeId) > -1) {
      if (item.DateType === '0') {
        const dayOfWeek = dateValueToDayOfWeek(item.DateValue);
        const thisDayOrigin = offsetDate(thisWeekOrigin, dayOfWeek.day, 0, 0);
        const thisPeriodStartTime = parseTimeCode(item.StartTime, 0);
        const thisPeriodStartTimeDateObject = offsetDate(thisDayOrigin, 0, thisPeriodStartTime.hours, thisPeriodStartTime.minutes);
        const thisPeriodEndTime = parseTimeCode(item.EndTime, 0);
        const thisPeriodEndTimeDateObject = offsetDate(thisDayOrigin, 0, thisPeriodEndTime.hours, thisPeriodEndTime.minutes);
        const thisPeriodDurationInMinutes = Math.abs(thisPeriodEndTime.hours * 60 + thisPeriodEndTime.minutes - (thisPeriodStartTime.hours * 60 + thisPeriodStartTime.minutes));

        const minWindow = parseInt(item.LongHeadway);
        const maxWindow = parseInt(item.LowHeadway);
        const averageWindow = (maxWindow + minWindow) / 2;
        const headwayQuantity = thisPeriodDurationInMinutes / averageWindow;

        for (let i = 0; i < headwayQuantity; i++) {
          let violateRules = false;
          const thisHeadwayDate = offsetDate(thisDayOrigin, 0, thisPeriodStartTime.hours, thisPeriodStartTime.minutes + maxWindow * i);
          if (thisHeadwayDate.getTime() < thisPeriodStartTimeDateObject.getTime()) {
            violateRules = true;
          }
          if (thisHeadwayDate.getTime() > thisPeriodEndTimeDateObject.getTime()) {
            violateRules = true;
          }
          // TODO: check timeTableRules
          if (violateRules === false) {
            calendar.calendarEventGroups[dayOfWeek.code].push({
              date: thisHeadwayDate,
              dateString: dateToString(thisHeadwayDate, 'hh:mm'),
              duration: maxWindow,
              deviation: Math.abs(averageWindow - maxWindow)
            });
            calendar.calendarEventQuantity[dayOfWeek.code] += 1;
          }
        }
      }
    }
  }
  for (const item of TimeTable) {
    if (PathAttributeId.indexOf(item.PathAttributeId) > -1) {
      if (item.DateType === '0') {
        let violateRules = false;
        const dayOfWeek = dateValueToDayOfWeek(item.DateValue);
        const thisDayOrigin = offsetDate(thisWeekOrigin, dayOfWeek.day, 0, 0);
        const thisDepartureTime = parseTimeCode(item.DepartureTime, 0);
        const thisHeadwayDate = offsetDate(thisDayOrigin, 0, thisDepartureTime.hours, thisDepartureTime.minutes);
        // TODO: check timeTableRules
        if (violateRules === false) {
          calendar.calendarEventGroups[dayOfWeek.code].push({
            date: thisHeadwayDate,
            dateString: dateToString(thisHeadwayDate, 'hh:mm'),
            duration: 15,
            deviation: 0
          });
          calendar.calendarEventQuantity[dayOfWeek.code] += 1;
        }
      }
    }
  }
  for (const code in calendar.calendarEventGroups) {
    calendar.calendarEventGroups[code].sort(function (a, b) {
      return a.date.getTime() - b.date.getTime();
    });
  }
  return calendar;
}

export interface TimeTableRules {
  go: {
    weekday: {
      first: TimeMoment;
      last: TimeMoment;
      rushHourWindow: TimeRange;
      offRushHourWindow: TimeRange;
    };
    holiday: {
      first: TimeMoment;
      last: TimeMoment;
      rushHourWindow: TimeRange;
      offRushHourWindow: TimeRange;
    };
  };
  back: {
    weekday: {
      first: TimeMoment;
      last: TimeMoment;
      rushHourWindow: TimeRange;
      offRushHourWindow: TimeRange;
    };
    holiday: {
      first: TimeMoment;
      last: TimeMoment;
      rushHourWindow: TimeRange;
      offRushHourWindow: TimeRange;
    };
  };
  realSequence: any;
}

function getTimeTableRules(thisRoute: RouteItem): TimeTableRules {
  const thisRouteGoFirstBusTime = parseTimeCode(thisRoute.goFirstBusTime, 0);
  const thisRouteGoLastBusTime = parseTimeCode(thisRoute.goLastBusTime, 0);

  const thisRouteBackFirstBusTime = parseTimeCode(thisRoute.backFirstBusTime, 0);
  const thisRouteBackLastBusTime = parseTimeCode(thisRoute.backLastBusTime, 0);

  const thisRouteGoFirstBusTimeOnHoliday = parseTimeCode(thisRoute.holidayGoFirstBusTime, 0);
  const thisRouteGoLastBusTimeOnHoliday = parseTimeCode(thisRoute.holidayGoLastBusTime, 0);

  const thisRouteBackFirstBusTimeOnHoliday = parseTimeCode(thisRoute.holidayBackFirstBusTime, 0);
  const thisRouteBackLastBusTimeOnHoliday = parseTimeCode(thisRoute.holidayBackLastBusTime, 0);

  const rushHourWindow = parseTimeCode(thisRoute.peakHeadway, 1);
  const offRushHourWindow = parseTimeCode(thisRoute.offPeakHeadway, 1);

  const rushHourWindowOnHoliday = parseTimeCode(thisRoute.holidayPeakHeadway, 1);
  const offRushHourWindowOnHoliday = parseTimeCode(thisRoute.holidayOffPeakHeadway, 1);
  // window → the interval/gap between arrivals of buses

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

export interface integratedRouteDetailsProperty {
  key: string;
  icon: MaterialSymbols;
  value: string;
}

export type integratedRouteDetailsProperties = Array<integratedRouteDetailsProperty>;

export interface integratedRouteDetails {
  timeTableRules: TimeTableRules;
  calendar: Calendar;
  properties: integratedRouteDetailsProperties;
}

export async function integrateRouteDetails(RouteID: number, PathAttributeId: Array<number>, requestID: string): Promise<integratedRouteDetails> {
  const Route = (await getRoute(requestID, false)) as Route;
  const thisRoute = findRoute(Route, RouteID);

  const SemiTimeTable = await getSemiTimeTable(requestID);
  const TimeTable = await getTimeTable(requestID);
  const Provider = await getProvider(requestID);
  const timeTableRules = getTimeTableRules(thisRoute);
  const calendar = generateCalendarFromTimeTables(RouteID, PathAttributeId, timeTableRules, SemiTimeTable, TimeTable);
  const thisProviderId = thisRoute.providerId;
  const thisProvider = findProvider(Provider, thisProviderId);

  const result: integratedRouteDetails = {
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
  deleteDataReceivingProgress(requestID);
  deleteDataUpdateTime(requestID);
  return result;
}

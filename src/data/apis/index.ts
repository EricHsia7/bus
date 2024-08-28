import { EstimateTime, getEstimateTime } from './getEstimateTime';
import { getStop, SimplifiedStop, SimplifiedStopItem } from './getStop';
import { BusEvent, getBusEvent } from './getBusEvent';
import { BusData, getBusData } from './getBusData';
import { getRoute, Route, RouteItem, SimplifiedRoute, SimplifiedRouteItem } from './getRoute';
import { getProvider, Provider, ProviderItem } from './getProvider';
import { getSemiTimeTable } from './getSemiTimeTable';
import { getTimeTable } from './getTimeTable';
import { getRushHour } from './getRushHour';
import { searchRouteByPathAttributeId } from '../search/searchRoute';
import { getLocation, SimplifiedLocationItem } from './getLocation';
import { setDataReceivingProgress, deleteDataReceivingProgress, dataUpdateTime, deleteDataUpdateTime } from './loader';
import { recordEstimateTime } from '../analytics/update-rate';
import { formatEstimateTime, formatTimeCode, dateValueToDayOfWeek, dateToString, Status } from '../../tools/format-time';
import { generateIdentifier, generateDirectionLabels } from '../../tools/index';
import { generateLabelFromAddresses, addressToString } from '../../tools/address';
import { generateLetterLabels } from '../../tools/index';
import { getSettingOptionValue } from '../settings/index';
import { getNearestPosition } from '../user-position/index';

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

interface ProcessedBusPosition {
  longitude: number;
  latitude: number;
}

interface ProcessedBus {
  BusID: string;
  onThisRoute: boolean;
  position: ProcessedBusPosition;
  index: number;
}

async function processBusEventWithBusData(BusEvent: BusEvent, BusData: BusData, RouteID: number, PathAttributeId: Array<number>): Promise<{ [key: string]: Array<ProcessedBus> }> {
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
    const searchRouteResult = await searchRouteByPathAttributeId(thisRouteID);
    const searchedRoute = searchRouteResult.length > 0 ? searchRouteResult[0] : null;
    processedItem.RouteName = searchedRoute ? searchedRoute.n : '';
    processedItem.RouteID = searchedRoute ? searchedRoute.id : null;

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

async function processBusEvent2(BusEvent: Array, StopIDs: Array<number>): Promise<object> {
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

function formatBus(object: ProcessedBus): FormattedBus {
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

function formatBusEvent(buses: Array<ProcessedBus>): Array<FormattedBus> | null {
  if (buses.length === 0) {
    return null;
  }
  var result = [];
  for (var bus of buses) {
    result.push(formatBus(bus));
  }
  return result;
}

interface integratedStopItemPosition {
  longitude: number;
  latitude: number;
}

interface integratedStopItem {
  name: string | null;
  goBack: '0' | '1' | '2';
  status: Status;
  buses: Array<object>;
  overlappingRoutes: Array<object>;
  sequence: number;
  position: integratedStopItemPosition;
  nearest: boolean;
  segmentBuffer: boolean;
  progress: number;
  id: number | null;
}

export interface RouteIntegration {
  groupedItems: {[key: string]: integratedStopItem},
  groupQuantity: number,
  itemQuantity:{[key:string]: number} ,
  RouteName: string,
  RouteEndPoints: {
    RouteDeparture: string,
    RouteDestination: string
  },
  dataUpdateTime: any,
  RouteID: number,
  PathAttributeId: Array<number>
}

export async function integrateRoute(RouteID: number, PathAttributeId: Array<number>, requestID: string): Promise<RouteIntegration> {
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
  setDataReceivingProgress(requestID, 'getBusData_0', 0, false);
  setDataReceivingProgress(requestID, 'getBusData_1', 0, false);
  var Route = await getRoute(requestID, true);
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID, false);
  var EstimateTime = await getEstimateTime(requestID);
  var BusEvent = await getBusEvent(requestID);
  var BusData = await getBusData(requestID);

  var processedBusEvent = await processBusEventWithBusData(BusEvent, BusData, RouteID, PathAttributeId);
  var processedSegmentBuffer = processSegmentBuffer(Route[`r_${RouteID}`].s);

  var time_formatting_mode = getSettingOptionValue('time_formatting_mode');

  let result = [];
  let positions = [];

  for (const item of EstimateTime) {
    let integratedStopItem: integratedStopItem = {};

    const thisRouteID = item.RouteID;

    // check whether this stop is on this route or not
    if ([RouteID, RouteID * 10].includes(thisRouteID) || PathAttributeId.includes(thisRouteID)) {
      // format status
      integratedStopItem.status = formatEstimateTime(item.EstimateTime, time_formatting_mode);

      // collect data from 'Stop'
      const thisStopKey = `s_${item.StopID}`;
      let thisStop: SimplifiedStopItem = {};
      if (Stop.hasOwnProperty(thisStopKey)) {
        thisStop = Stop[thisStopKey];
      } else {
        continue;
      }
      integratedStopItem.id = item.StopID;
      integratedStopItem.sequence = thisStop.seqNo;
      integratedStopItem.goBack = thisStop.goBack;

      // collect data from 'Location'
      const thisLocationKey = `l_${thisStop.stopLocationId}`;
      let thisLocation: SimplifiedLocationItem = {};
      if (Location.hasOwnProperty(thisLocationKey)) {
        thisLocation = Location[thisLocationKey];
      } else {
        continue;
      }
      integratedStopItem.name = thisLocation.n;
      integratedStopItem.overlappingRoutes = thisLocation.r
        .filter((id: number) => id !== RouteID)
        .map((id: number) => {
          const overlappingRouteKey = `r_${id}`;
          if (Route.hasOwnProperty(overlappingRouteKey)) {
            const overlappingRoute: SimplifiedRouteItem = Route[overlappingRouteKey];
            const formattedOverlappingRoute = {
              name: overlappingRoute.n,
              RouteEndPoints: {
                RouteDeparture: overlappingRoute.dep,
                RouteDestination: overlappingRoute.des,
                text: `${overlappingRoute.dep} \u21CC ${overlappingRoute.des}`, //u21CC -> '⇌'
                html: `<span>${overlappingRoute.dep}</span><span>\u21CC</span><span>${overlappingRoute.des}</span>`
              },
              RouteID: overlappingRoute.id,
              PathAttributeId: overlappingRoute.pid
            };
            return formattedOverlappingRoute;
          } else {
            return null;
          }
        })
        .filter((e) => {
          return !(e === null);
        });
      integratedStopItem.position = {
        longitude: thisLocation.lo,
        latitude: thisLocation.la
      };
      positions.push({
        latitude: thisLocation.la,
        longitude: thisLocation.lo,
        id: item.StopID
      });

      // collect data from 'processedBusEvent'
      let buses: Array<FormattedBus> = [];
      for (var overlappingStopID of thisLocation.s) {
        const overlappingStopKey = `s_${overlappingStopID}`;
        if (processedBusEvent.hasOwnProperty(overlappingStopKey)) {
          buses.push(processedBusEvent[overlappingStopKey].map((e) => formatBus(e)));
        }
      }
      integratedStopItem.buses = buses.flat().sort(function (a, b) {
        return a.index - b.index;
      });

      // check whether this stop is segment buffer
      let isSegmentBuffer: boolean = false;
      const segmentBufferGroup = processedSegmentBuffer[`g_${item.goBack}`] || processedSegmentBuffer['g_0'].reverse() || [];
      if (segmentBufferGroup.includes(thisLocation.n)) {
        isSegmentBuffer = true;
      }
      integratedStopItem.segmentBuffer = isSegmentBuffer;

      result.push(integratedStopItem);
    }
  }

  result.sort(function (a, b) {
    return a.sequence - b.sequence;
  });

  const nearestPosition = getNearestPosition(positions, 450);
  const multipleEndpoints = processedSegmentBuffer['g_0'].length % 2 === 0;
  let endpointCount = 0;

  let groupedItems: { [key: string]: Array<integratedStopItem> } = {};
  let groupQuantity: number = 0;
  let itemQuantity: { [key: string]: number } = {};

  const resultLength = result.length;

  for (let index = 0; index < resultLength; index++) {
    let item = result[index];
    const nextItem = result[index + 1] || item;
    let progress = 0;

    if (item.buses.length > 0) {
      if (item.buses[0].onThisRoute) {
        const [x, y] = [item.buses[0].position.longitude, item.buses[0].position.latitude];
        const [x1, y1] = [item.position.longitude, item.position.latitude];
        const [x2, y2] = [nextItem.position.longitude, nextItem.position.latitude];
        const dotProduct = (x - x1) * (x2 - x) + (y - y1) * (y2 - y);
        if (dotProduct >= 0) {
          // ensure that (x, y) is between (x1, y1) and (x2, y2)
          const distance1 = Math.hypot(x - x1, y - y1);
          const distance2 = Math.hypot(x - x2, y - y2);
          progress = Math.max(0, Math.min(distance1 / (distance1 + distance2), 1));
        }
      }
    }
    item.progress = progress;

    if (multipleEndpoints) {
      if (item.segmentBuffer) {
        endpointCount += 1;
      }
      if (endpointCount % 2 === 1) {
        item.segmentBuffer = true;
      }
    }

    if (!(nearestPosition === null)) {
      if (nearestPosition.id === item.id) {
        item.nearest = true;
      }
    }

    const groupKey = `g_${item.goBack}` || 'g_0';

    if (!groupedItems.hasOwnProperty(groupKey)) {
      groupedItems[groupKey] = [];
      itemQuantity[groupKey] = 0;
      groupQuantity += 1;
    }

    groupedItems[groupKey].push(item);
    itemQuantity[groupKey] += 1;
  }

  const thisRoute = Route[`r_${RouteID}`];
  const thisRouteName = thisRoute.n;
  const thisRouteDeparture = thisRoute.dep;
  const thisRouteDestination = thisRoute.des;

  const result2: RouteIntegration = {
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
  return result2;
}

export async function integrateStop(StopID: number, RouteID: number): Promise<object> {
  const requestID = `r_${generateIdentifier()}`;
  var Stop = await getStop(requestID);
  var Location = await getLocation(requestID, false);
  var Route = await getRoute(requestID);
  var thisStop: object = Stop[`s_${StopID}`];
  var thisStopDirection: number = parseInt(thisStop.goBack);
  var thisLocation: object = Location[`l_${thisStop.stopLocationId}`];
  var thisStopName: string = thisLocation.n;
  var thisRoute: object = Route[`r_${RouteID}`];
  var thisRouteName: string = thisRoute.n;
  var thisRouteDeparture: string = thisRoute.dep;
  var thisRouteDestination: string = thisRoute.des;
  return {
    thisStopName,
    thisStopDirection,
    thisRouteName,
    thisRouteDeparture,
    thisRouteDestination
  };
}

export async function integrateRouteDetails(RouteID: number, PathAttributeId: Array<number>, requestID: string): Promise<object> {
  function getThisRoute(Route: Route, RouteID: number): RouteItem {
    var thisRoute: RouteItem = {};
    for (var item of Route) {
      if (item.Id === RouteID) {
        thisRoute = item;
        break;
      }
    }
    return thisRoute;
  }

  function getTimeTableRules(thisRoute: RouteItem): object {
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
          last: thisRouteBackLastBusTimeOnHoliday,
          rushHourWindow: rushHourWindowOnHoliday,
          offRushHourWindow: offRushHourWindowOnHoliday
        }
      },
      realSequence: realSequence
    };
  }

  function generateCalendarFromTimeTables(RouteID: number, PathAttributeId: Array<number>, timeTableRules: object, SemiTimeTable: Array, TimeTable: Array): object {
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

  function getThisProvider(Provider: Provider, providerId: number): ProviderItem {
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

function processEstimateTime2(EstimateTime: Array, StopIDs: Array<number>): object {
  var result = {};
  for (var item of EstimateTime) {
    if (StopIDs.indexOf(parseInt(item.StopID)) > -1) {
      result[`s_${item.StopID}`] = item;
    }
  }
  return result;
}

export async function integrateLocation(hash: string, requestID: string): Promise<object> {
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
  var location_labels = getSettingOptionValue('location_labels');
  var groupedItems = {};
  var itemQuantity = {};
  var groups = {};

  var LocationKey = `ml_${hash}`;
  var thisLocation = Location[LocationKey];
  var thisLocationName = thisLocation.n;
  var stopLocationIds = thisLocation.id;
  var setsOfVectors = thisLocation.v;

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
  switch (location_labels) {
    case 'address':
      labels = generateLabelFromAddresses(thisLocation.a);

      break;
    case 'letters':
      labels = generateLetterLabels(stopLocationQuantity);
      break;
    case 'directions':
      labels = generateDirectionLabels(setsOfVectors);
      break;
    default:
      break;
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
          icon: 'location_on',
          value: `${thisLocation.la[i].toFixed(5)}, ${thisLocation.lo[i].toFixed(5)}`
        }
      ]
    };
    var stopQuantity = thisLocation.s[i].length;
    for (var o = 0; o < stopQuantity; o++) {
      var thisStopID = thisLocation.s[i][o];
      var thisStop: SimplifiedStopItem = Stop[`s_${thisStopID}`];
      var thisRouteID: number = thisLocation.r[i][o];
      var thisRoute: SimplifiedRouteItem = Route[`r_${thisRouteID}`];
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

import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { generateIdentifier, isValidURL } from '../../tools/index';
import { getLocation, SimplifiedLocation, SimplifiedLocationItem } from '../apis/getLocation/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { getStop, SimplifiedStop, SimplifiedStopItem } from '../apis/getStop/index';
import { deleteDataReceivingProgress, deleteDataUpdateTime, getDataUpdateTime } from '../apis/loader';
import { getSettingOptionValue } from '../settings/index';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';
import { scheduleNotification } from './apis/scheduleNotification/index';

export interface NotificationClient {
  provider: string;
  client_id: string;
  secret: string;
}

export interface NotificationSchedule {
  schedule_id: string;
  stop_id: number;
  location_name: string;
  route_id: number;
  route_name: string;
  direction: string;
  estimate_time: number;
  time_formatting_mode: number;
  time_offset: number;
  scheduled_time: number;
}

export let NotificationProvider: NotificationClient['provider'] = ''; // base url
export let NotificationClientID: NotificationClient['client_id'] = '';
export let NotificationSecret: NotificationClient['secret'] = '';

let NotifcationSchedules: Array<NotificationSchedule> = [];
let NotifcationSchedulesIndex: {
  [key: NotificationSchedule['schedule_id']]: number;
} = {};
let NotifcationSchedulesStopIDIndex: {
  [key: string]: Array<number>;
} = {};

export async function saveNotificationClient() {
  const currentClient: NotificationClient = {
    provider: NotificationProvider,
    client_id: NotificationClientID,
    secret: NotificationSecret
  };
  await lfSetItem(8, 'n_client', JSON.stringify(currentClient));
}

export async function loadNotificationClient() {
  const existingClient = await lfGetItem(8, 'n_client');
  if (existingClient) {
    const existingClientObject = JSON.parse(existingClient) as NotificationClient;
    NotificationProvider = existingClientObject.provider;
    NotificationClientID = existingClientObject.client_id;
    NotificationSecret = existingClientObject.secret;
  }
}

export function getNotificationClientStatus(): boolean {
  if (NotificationClientID === '' || NotificationSecret === '') {
    return false;
  } else {
    return true;
  }
}

export function setNotificationProvider(provider: NotificationClient['provider']): void {
  if (isValidURL(provider)) {
    const url = new URL(provider);
    NotificationProvider = `${url.protocol}//${url.hostname}`;
  } else {
    throw new Error('The provider is not valid.');
  }
}

export function getNotificationProvider(): NotificationClient['provider'] {
  return String(NotificationProvider);
}

export function setNotificationClientID(client_id: NotificationClient['client_id']): void {
  if (!(client_id === undefined)) {
    NotificationClientID = String(client_id);
  }
}

export function setNotificationSecret(secret: NotificationClient['secret']): void {
  if (!(secret === undefined)) {
    NotificationSecret = String(secret);
  }
}

export async function initializeNotificationSchedules() {
  const now = new Date().getTime();
  const keys = await lfListItemKeys(9);
  let index: number = 0;
  for (const key of keys) {
    const thisScheduleJSON = await lfGetItem(9, key);
    const thisSchedule = JSON.parse(thisScheduleJSON) as NotificationSchedule;
    const thisScheduledTime = thisSchedule.scheduled_time;
    if (thisScheduledTime > now) {
      const thisScheduleID = thisSchedule.schedule_id;
      const thisScheduleStopID = thisSchedule.stop_id;
      const thisScheduleStopKey = `s_${thisScheduleStopID}`;
      NotifcationSchedules.push(thisSchedule);
      NotifcationSchedulesIndex[thisScheduleID] = index;
      if (!NotifcationSchedulesStopIDIndex.hasOwnProperty(thisScheduleStopKey)) {
        NotifcationSchedulesStopIDIndex[thisScheduleStopKey] = [];
      }
      NotifcationSchedulesStopIDIndex[thisScheduleStopKey].push(index);
      index += 1;
    }
  }
}

export async function saveNotificationSchedule(schedule_id: NotificationSchedule['schedule_id'], stop_id: NotificationSchedule['stop_id'], location_name: NotificationSchedule['location_name'], route_id: NotificationSchedule['route_id'], route_name: NotificationSchedule['route_name'], direction: NotificationSchedule['direction'], estimate_time: NotificationSchedule['estimate_time'], time_formatting_mode: NotificationSchedule['time_formatting_mode'], time_offset: NotificationSchedule['time_offset'], scheduled_time: NotificationSchedule['scheduled_time']) {
  const thisNotificationSchedule: NotificationSchedule = {
    schedule_id: schedule_id,
    stop_id: stop_id,
    location_name: location_name,
    route_id: route_id,
    route_name: route_name,
    direction: direction,
    estimate_time: estimate_time,
    time_formatting_mode: time_formatting_mode,
    time_offset: time_offset,
    scheduled_time: scheduled_time
  };
  const thisNotificationScheduleStopKey = `s_${stop_id}`;
  const thisNotificationScheduleIndex = NotifcationSchedules.length; // length - 1 + 1
  NotifcationSchedules.push(thisNotificationSchedule);
  NotifcationSchedulesIndex[schedule_id] = thisNotificationScheduleIndex;
  if (!NotifcationSchedulesStopIDIndex.hasOwnProperty(thisNotificationScheduleStopKey)) {
    NotifcationSchedulesStopIDIndex[thisNotificationScheduleStopKey] = [];
  }
  NotifcationSchedulesStopIDIndex[thisNotificationScheduleStopKey].push(thisNotificationScheduleIndex);
  await lfSetItem(9, schedule_id, JSON.stringify(thisNotificationSchedule));
}

export function getNotificationSchedule(schedule_id: NotificationSchedule['schedule_id']): NotificationSchedule | false {
  if (NotifcationSchedulesIndex.hasOwnProperty(schedule_id)) {
    const thisScheduleIndex = NotifcationSchedulesIndex[schedule_id];
    const thisSchedule = NotifcationSchedules[thisScheduleIndex];
    const thisScheduledTime = thisSchedule.scheduled_time;
    const now = new Date().getTime();
    if (thisScheduledTime > now) {
      return thisSchedule;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export async function updateNotificationSchedule(schedule_id: NotificationSchedule['schedule_id'], estimate_time: NotificationSchedule['estimate_time'], scheduled_time: NotificationSchedule['scheduled_time']) {
  if (NotifcationSchedulesIndex.hasOwnProperty(schedule_id)) {
    const existingScheduleIndex = NotifcationSchedulesIndex[schedule_id];
    const existingSchedule = NotifcationSchedules[existingScheduleIndex];
    const updatedSchedule: NotificationSchedule = Object.assign(existingSchedule, {
      estimate_time: estimate_time,
      scheduled_time: scheduled_time
    });
    NotifcationSchedules.splice(existingScheduleIndex, 1, updatedSchedule);
    await lfSetItem(9, schedule_id, JSON.stringify(updatedSchedule));
  }
}

export async function removeNotificationSchedule(schedule_id: NotificationSchedule['schedule_id']) {
  if (NotifcationSchedulesIndex.hasOwnProperty(schedule_id)) {
    const existingScheduleIndex = NotifcationSchedulesIndex[schedule_id];
    const existingSchedule = NotifcationSchedules[existingScheduleIndex];
    const thisScheduleStopID = existingSchedule.stop_id;
    const thisScheduleStopKey = `s_${thisScheduleStopID}`;
    NotifcationSchedules.splice(existingScheduleIndex, 1, null);
    NotifcationSchedulesStopIDIndex[thisScheduleStopKey].splice(NotifcationSchedulesStopIDIndex[thisScheduleStopKey].indexOf(existingScheduleIndex), 1);
    delete NotifcationSchedulesIndex[schedule_id];
    await lfRemoveItem(9, schedule_id);
  }
}

export function listNotifcationSchedules(): Array<NotificationSchedule> {
  const now = new Date().getTime();
  let result: Array<NotificationSchedule> = [];
  for (const thisSchedule of NotifcationSchedules) {
    if (!(thisSchedule === null)) {
      const thisScheduledTime = thisSchedule.scheduled_time;
      if (thisScheduledTime > now) {
        result.push(thisSchedule);
      }
    }
  }
  return result;
}

export function listNotifcationSchedulesOfStop(StopID: NotificationSchedule['stop_id']): Array<NotificationSchedule> {
  let result: Array<NotificationSchedule> = [];
  const now = new Date().getTime();
  const thisStopKey = `s_${StopID}`;
  if (NotifcationSchedulesStopIDIndex.hasOwnProperty(thisStopKey)) {
    const indexes = NotifcationSchedulesStopIDIndex[thisStopKey];
    for (const index of indexes) {
      const thisSchedule = NotifcationSchedules[index];
      if (!(thisSchedule === null)) {
        const thisScheduledTime = thisSchedule.scheduled_time;
        if (thisScheduledTime > now) {
          result.push(thisSchedule);
        }
      }
    }
  }
  return result;
}

export function stopHasNotifcationSchedules(StopID: NotificationSchedule['stop_id']): boolean {
  const now = new Date().getTime();
  const thisStopKey = `s_${StopID}`;
  if (NotifcationSchedulesStopIDIndex.hasOwnProperty(thisStopKey)) {
    const indexes = NotifcationSchedulesStopIDIndex[thisStopKey];
    for (const index of indexes) {
      const thisSchedule = NotifcationSchedules[index];
      if (!(thisSchedule === null)) {
        const thisScheduledTime = thisSchedule.scheduled_time;
        if (thisScheduledTime > now) {
          return true;
        }
      }
    }
  }
  return false;
}

export async function discardExpiredNotificationSchedules() {
  const now = new Date().getTime();
  for (const schedule_id in NotifcationSchedulesIndex) {
    const existingScheduleIndex = NotifcationSchedulesIndex[schedule_id];
    const existingSchedule = NotifcationSchedules[existingScheduleIndex];
    const thisScheduledTime = existingSchedule.scheduled_time;
    if (thisScheduledTime <= now) {
      const thisScheduleStopID = existingSchedule.stop_id;
      const thisScheduleStopKey = `s_${thisScheduleStopID}`;
      NotifcationSchedules.splice(existingScheduleIndex, 1, null);
      NotifcationSchedulesStopIDIndex[thisScheduleStopKey].splice(NotifcationSchedulesStopIDIndex[thisScheduleStopKey].indexOf(existingScheduleIndex), 1);
      delete NotifcationSchedulesIndex[schedule_id];
      await lfRemoveItem(9, schedule_id);
    }
  }
}

export interface IntegratedNotificationScheduleItem {
  name: NotificationSchedule['location_name'];
  stop_id: NotificationSchedule['stop_id'];
  estimate_time: NotificationSchedule['estimate_time'];
  schedule_id: NotificationSchedule['schedule_id'];
  scheduled_time: NotificationSchedule['scheduled_time'];
  route: {
    name: NotificationSchedule['route_name'];
    direction: NotificationSchedule['direction'];
    id: NotificationSchedule['route_id'];
    pathAttributeId: SimplifiedRouteItem['pid'];
  };
  is_first: boolean;
  date: string;
  hours: string;
  minutes: string;
}

export interface IntegratedNotificationSchedules {
  items: Array<IntegratedNotificationScheduleItem>;
  itemQuantity: number;
  dataUpdateTime: number;
}

export async function integrateNotifcationSchedules(requestID: string): Promise<IntegratedNotificationSchedules> {
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  const notificationSchedules = listNotifcationSchedules();
  const now = new Date().getTime();

  let items: Array<IntegratedNotificationScheduleItem> = [];

  for (const item of notificationSchedules) {
    let integratedItem = {} as IntegratedNotificationScheduleItem;
    const thisItemName = item.location_name;
    integratedItem.name = thisItemName;

    const thisItemStopID = item.stop_id;
    integratedItem.stop_id = thisItemStopID;

    const thisItemEstimateTime = item.estimate_time;
    integratedItem.estimate_time = thisItemEstimateTime;

    const thisItemScheduleID = item.schedule_id;
    integratedItem.schedule_id = thisItemScheduleID;

    const thisItemScheduledTime = item.scheduled_time;
    integratedItem.scheduled_time = thisItemScheduledTime;

    const thisItemScheduledTimeDateInstance = new Date(thisItemScheduledTime);
    const thisItemDate = thisItemScheduledTimeDateInstance.getDate();
    const thisItemHours = thisItemScheduledTimeDateInstance.getHours();
    const thisItemMinutes = thisItemScheduledTimeDateInstance.getMinutes();
    integratedItem.date = String(thisItemDate).padStart(2, '0');
    integratedItem.hours = String(thisItemHours).padStart(2, '0');
    integratedItem.minutes = String(thisItemMinutes).padStart(2, '0');

    integratedItem.route = {};
    const thisRouteName = item.route_name;
    integratedItem.route.name = thisRouteName;

    const thisRouteID = item.route_id;
    integratedItem.route.id = thisRouteID;

    const thisRouteDirection = item.direction;
    integratedItem.route.direction = thisRouteDirection;

    // Collect data from Route
    const thisNotificationScheduleRouteID = item.route_id;
    const thisNotificationScheduleRouteKey = `r_${thisNotificationScheduleRouteID}`;
    let thisNotificationScheduleRoute = {} as SimplifiedRouteItem;
    if (Route.hasOwnProperty(thisNotificationScheduleRouteKey)) {
      thisNotificationScheduleRoute = Route[thisNotificationScheduleRouteKey];
    } else {
      continue;
    }
    const thisNotificationScheduleRoutePathAttributeId = thisNotificationScheduleRoute.pid;
    integratedItem.route.pathAttributeId = thisNotificationScheduleRoutePathAttributeId;

    items.push(integratedItem);
  }

  items.sort(function (a, b) {
    return a.scheduled_time - b.scheduled_time;
  });

  let items2: Array<IntegratedNotificationScheduleItem> = [];
  let itemQuantity: IntegratedNotificationSchedules['itemQuantity'] = 0;
  let groups: { [key: string]: true } = {};
  for (let item of items) {
    const groupKey = `g_${item.date}_${item.hours}`;
    if (!groups.hasOwnProperty(groupKey)) {
      groups[groupKey] = true;
      item.is_first = true;
    } else {
      item.is_first = false;
    }
    items2.push(item);
    itemQuantity += 1;
  }

  const result: IntegratedNotificationSchedules = {
    items: items2,
    itemQuantity: itemQuantity,
    dataUpdateTime: Math.max(getDataUpdateTime(requestID), now)
  };
  deleteDataUpdateTime(requestID);
  deleteDataReceivingProgress(requestID);
  return result;
}

export interface ScheduleNotificationOption {
  name: string;
  time_offset: number;
  icon: MaterialSymbols;
  index: number;
}

export type ScheduleNotificationOptions = Array<ScheduleNotificationOption>;

export const scheduleNotificationOptions: ScheduleNotificationOptions = [
  {
    name: '到站前5分鐘',
    time_offset: -5,
    icon: 'clock_loader_10',
    index: 0
  },
  {
    name: '到站前10分鐘',
    time_offset: -10,
    icon: 'clock_loader_20',
    index: 1
  },
  {
    name: '到站前15分鐘',
    time_offset: -15,
    icon: 'clock_loader_40',
    index: 2
  },
  {
    name: '到站前20分鐘',
    time_offset: -20,
    icon: 'clock_loader_60',
    index: 3
  },
  {
    name: '到站前25分鐘',
    time_offset: -25,
    icon: 'clock_loader_80',
    index: 4
  },
  {
    name: '到站前30分鐘',
    time_offset: -30,
    icon: 'clock_loader_90',
    index: 5
  }
];

export async function scheduleNotificationForStop(StopID: number, RouteID: number, EstimateTime: number, index: number): Promise<0 | 1 | 2> {
  if (getNotificationClientStatus()) {
    const time_formatting_mode = getSettingOptionValue('time_formatting_mode') as number;
    const requestID = generateIdentifier('r');
    const Stop = (await getStop(requestID)) as SimplifiedStop;
    const Location = (await getLocation(requestID, false)) as SimplifiedLocation;
    const Route = (await getRoute(requestID, true)) as SimplifiedRoute;

    deleteDataReceivingProgress(requestID);
    deleteDataUpdateTime(requestID);

    // Collect data from Stop
    const StopKey = `s_${StopID}`;
    let thisStop = {} as SimplifiedStopItem;
    if (Stop.hasOwnProperty(StopKey)) {
      thisStop = Stop[StopKey];
    } else {
      return 0;
    }
    const thisStopLocationId = thisStop.stopLocationId;
    const thisStopGoBack = thisStop.goBack;

    // Collect data from Location
    const thisLocationKey = `l_${thisStopLocationId}`;
    let thisLocation = {} as SimplifiedLocationItem;
    if (Location.hasOwnProperty(thisLocationKey)) {
      thisLocation = Location[thisLocationKey];
    } else {
      return 0;
    }
    const thisLocationName = thisLocation.n;

    // Collect data from Route
    const RouteKey = `r_${RouteID}`;
    let thisRoute = {} as SimplifiedRouteItem;
    if (Route.hasOwnProperty(RouteKey)) {
      thisRoute = Route[RouteKey];
    } else {
      return 0;
    }

    const thisRouteName = thisRoute.n;
    const thisRouteDeparture = thisRoute.dep;
    const thisRouteDestination = thisRoute.des;
    const thisRouteDirection = [thisRouteDestination, thisRouteDeparture, ''][thisStopGoBack ? parseInt(thisStopGoBack) : 0];

    // Collect data from scheduleNotificationOptions
    const thisOption = scheduleNotificationOptions[index];
    const timeOffset = thisOption.time_offset;

    const now = new Date().getTime();
    const scheduled_time = now + EstimateTime * 1000 + timeOffset * 60 * 1000;

    const scheduling = await scheduleNotification(StopID, thisLocationName, RouteID, thisRouteName, thisRouteDirection, EstimateTime, time_formatting_mode, timeOffset, scheduled_time);
    if (scheduling === false) {
      return 0; // error
    } else {
      return 1; // successful
    }
  } else {
    return 2; // no registration
  }
}

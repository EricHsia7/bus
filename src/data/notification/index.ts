import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { isValidURL } from '../../tools/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
import { dataUpdateTime, deleteDataUpdateTime } from '../apis/loader';
import { lfGetItem, lfListItemKeys, lfRemoveItem, lfSetItem } from '../storage/index';

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
  await lfSetItem(7, 'n_client', JSON.stringify(currentClient));
}

export async function loadNotificationClient() {
  const existingClient = await lfGetItem(7, 'n_client');
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
  const keys = await lfListItemKeys(8);
  let index: number = 0;
  for (const key of keys) {
    const thisScheduleJSON = await lfGetItem(8, key);
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
  await lfSetItem(8, schedule_id, JSON.stringify(thisNotificationSchedule));
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
    await lfSetItem(8, schedule_id, JSON.stringify(updatedSchedule));
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
    await lfRemoveItem(8, schedule_id);
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
      await lfRemoveItem(8, schedule_id);
    }
  }
}

export interface IntegratedNotififcationScheduleItem {
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
  date: number;
  hours: number;
  minutes: number;
}

export interface IntegratedNotififcationSchedules {
  groupedItems: { [key: string]: Array<IntegratedNotififcationScheduleItem> };
  groupQuantity: number;
  itemQuantity: { [key: string]: number };
  dataUpdateTime: any;
}

export async function integrateNotifcationSchedules(requestID: string): Promise<IntegratedNotififcationSchedules> {
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  const notificationSchedules = listNotifcationSchedules();

  let items: Array<IntegratedNotififcationScheduleItem> = [];

  for (const item of notificationSchedules) {
    let integratedItem = {} as IntegratedNotififcationScheduleItem;
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
    integratedItem.date = thisItemDate;
    integratedItem.hours = thisItemHours;
    integratedItem.minutes = thisItemMinutes;

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

    items.push(integratedNotififcationSchedule);
  }

  items.sort(function (a, b) {
    return a.scheduled_time - b.scheduled_time;
  });

  let groupedItems: IntegratedNotififcationSchedules['groupedItems'] = {};
  let itemQuantity: IntegratedNotififcationSchedules['itemQuantity'] = {};
  let groupQuantity: IntegratedNotififcationSchedules['groupQuantity'] = 0;
  let groupIndex: number = -1;
  let groups: { [key: string]: number } = {};
  for (const item of items) {
    const group = `g_${item.date}_${item.hours}`;
    if (!groups.hasOwnProperty(group)) {
      groupIndex += 1;
      groups[group] = groupIndex;
    }
    const groupKey = `g_${groups[group]}`;
    if (!groupedItems.hasOwnProperty(groupKey)) {
      groupedItems[groupKey] = [];
    }
    groupedItems[groupKey].push(item);

    if (!itemQuantity.hasOwnProperty(groupKey)) {
      itemQuantity[groupKey] = 0;
    }
    itemQuantity[groupKey] += 1;
  }
  groupQuantity = groupIndex + 1;
  const result: IntegratedNotififcationSchedules = {
    groupedItems: groupedItems,
    itemQuantity: itemQuantity,
    groupQuantity: groupQuantity,
    dataUpdateTime: dataUpdateTime[requestID]
  };
  deleteDataUpdateTime(requestID);
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

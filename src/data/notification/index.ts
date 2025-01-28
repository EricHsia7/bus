import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { isValidURL } from '../../tools/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../apis/getRoute/index';
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
    const thisScheduledTime = thisSchedule.scheduled_time;
    if (thisScheduledTime > now) {
      result.push(thisSchedule);
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
      if (thisSchedule.scheduled_time > now) {
        result.push(thisSchedule);
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
      if (thisSchedule.scheduled_time > now) {
        return true;
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

export interface IntegratedNotififcationSchedule extends NotificationSchedule {
  route_pid: SimplifiedRouteItem['pid'];
}

export type IntegratedNotififcationSchedules = Array<IntegratedNotififcationSchedule>;

export async function integrateNotifcationSchedules(requestID: string): Promise<IntegratedNotififcationSchedules> {
  const Route = (await getRoute(requestID, true)) as SimplifiedRoute;
  const notificationSchedules = listNotifcationSchedules();
  let result: IntegratedNotififcationSchedules = [];
  for (const notificationSchedule of notificationSchedules) {
    const thisNotificationScheduleRouteID = notificationSchedule.route_id;
    const thisNotificationScheduleRouteKey = `r_${thisNotificationScheduleRouteID}`;
    let thisNotificationScheduleRoute = {} as SimplifiedRouteItem;
    if (Route.hasOwnProperty(thisNotificationScheduleRouteKey)) {
      thisNotificationScheduleRoute = Route[thisNotificationScheduleRouteKey];
    } else {
      continue;
    }
    const thisNotificationScheduleRoutePathAttributeId = thisNotificationScheduleRoute.pid;
    let integratedNotififcationSchedule: IntegratedNotififcationSchedule = {
      schedule_id: notificationSchedule.schedule_id,
      direction: notificationSchedule.direction,
      estimate_time: notificationSchedule.estimate_time,
      stop_id: notificationSchedule.stop_id,
      location_name: notificationSchedule.location_name,
      route_id: notificationSchedule.route_id,
      route_pid: thisNotificationScheduleRoutePathAttributeId,
      route_name: notificationSchedule.route_name,
      time_formatting_mode: notificationSchedule.time_formatting_mode,
      time_offset: notificationSchedule.time_offset,
      scheduled_time: notificationSchedule.scheduled_time
    };
    result.push(integratedNotififcationSchedule);
  }
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

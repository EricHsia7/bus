import { getLocation, SimplifiedLocation, SimplifiedLocationItem } from '../../data/apis/getLocation/index';
import { getRoute, SimplifiedRoute, SimplifiedRouteItem } from '../../data/apis/getRoute/index';
import { getStop, SimplifiedStop, SimplifiedStopItem } from '../../data/apis/getStop/index';
import { currentNotificationAPI, ScheduleNotificationOption, scheduleNotificationOptions } from '../../data/notification/index';
import { getSettingOptionValue, SettingSelectOptionNumberValue } from '../../data/settings/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const ScheduleNotificationField = documentQuerySelector('.css_schedule_notification_field');
const ScheduleNotificationBodyElement = elementQuerySelector(ScheduleNotificationField, '.css_schedule_notification_body');
const ScheduleNotificationListElement = elementQuerySelector(ScheduleNotificationBodyElement, '.css_schedule_notification_list');

function generateElementOfItem(item: ScheduleNotificationOption, type: 'stop', parameters: Array): GeneratedElement {
  const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_schedule_notification_list_item');
  element.id = identifier;
  switch (type) {
    case 'stop':
      element.setAttribute('onclick', `bus.notification.scheduleNotificationForStopItemOnRoute('${parameters[0]}', ${parameters[1]}, ${parameters[2]}, ${parameters[3]}, ${item.index})`);
      break;
    default:
      break;
  }
  element.innerHTML = /*html*/ `<div class="css_schedule_notification_item_icon">${getIconHTML(item.icon)}</div><div class="css_schedule_notification_item_name">${item.name}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeScheduleNotificationField(type: 'stop', parameters: Array<any>) {
  ScheduleNotificationListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of scheduleNotificationOptions) {
    const newElement = generateElementOfItem(item, type, parameters);
    fragment.append(newElement.element);
  }
  ScheduleNotificationListElement.append(fragment);
}

export function openScheduleNotification(type: 'stop', parameters: Array<any>): void {
  pushPageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'true');
  initializeScheduleNotificationField(type, parameters);
}

export function closeScheduleNotification(): void {
  revokePageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'false');
}

export async function scheduleNotificationForStopItemOnRoute(itemElementID: string, StopID: number, RouteID: number, EstimateTime: number, index: number): void {
  const itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_route_group_items_track .css_route_group_item#${itemElementID}`);
  const actionButtonElement = elementQuerySelector(itemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="schedule-notification"]');
  if (currentNotificationAPI.getStatus()) {
    promptMessage('處理中', 'manufacturing');
    actionButtonElement.setAttribute('enabled', 'false');
    closeScheduleNotification();

    const time_formatting_mode = getSettingOptionValue('time_formatting_mode') as number;
    const requestID = generateIdentifier('r');
    const Stop = (await getStop(requestID)) as SimplifiedStop;
    const Location = (await getLocation(requestID, false)) as SimplifiedLocation;
    const Route = (await getRoute(requestID, true)) as SimplifiedRoute;

    // Collect data from Stop
    const StopKey = `s_${StopID}`;
    let thisStop = {} as SimplifiedStopItem;
    if (Stop.hasOwnProperty(StopKey)) {
      thisStop = Stop[StopKey];
    } else {
      return;
    }
    const thisStopLocationId = thisStop.stopLocationId;

    // Collect data from Location
    const thisLocationKey = `l_${thisStopLocationId}`;
    let thisLocation = {} as SimplifiedLocationItem;
    if (Location.hasOwnProperty(thisLocationKey)) {
      thisLocation = Location[thisLocationKey];
    } else {
      return;
    }
    const thisLocationName = thisLocation.n;

    // Collect data from Route
    const RouteKey = `r_${RouteID}`;
    let thisRoute = {} as SimplifiedRouteItem;
    if (Route.hasOwnProperty(RouteKey)) {
      thisRoute = Route[RouteKey];
    } else {
      return;
    }
    const thisRouteName = thisRoute.n;

    // Collect data from scheduleNotificationOptions
    const thisOption = scheduleNotificationOptions[index];
    const status = thisOption.status;
    const timeOffset = thisOption.timeOffset;

    const now = new Date().getTime();
    const scheduled_time = now + EstimateTime * 1000 + timeOffset * 60 * 1000;
    const scheduling = await currentNotificationAPI.schedule(StopID, thisLocationName, RouteID, thisRouteName, '方向', EstimateTime, false, time_formatting_mode, scheduled_time);
    // TODO: direction, photo
    if (scheduling === false) {
      promptMessage('設定失敗', 'error');
      return;
    } else {
      promptMessage('設定成功', 'check_circle');
      actionButtonElement.setAttribute('enabled', 'true');
      actionButtonElement.setAttribute('highlighted', 'true');
      return;
    }
  } else {
    promptMessage('在設定中註冊後才可設定到站通知', 'warning');
    closeScheduleNotification();
    return;
  }
}

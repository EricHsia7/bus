import { scheduleNotificationForStop, ScheduleNotificationOption, scheduleNotificationOptions } from '../../data/notification/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { getIconElement } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const ScheduleNotificationField = documentQuerySelector('.css_schedule_notification_field');
const ScheduleNotificationBodyElement = elementQuerySelector(ScheduleNotificationField, '.css_schedule_notification_body');
const ScheduleNotificationListElement = elementQuerySelector(ScheduleNotificationBodyElement, '.css_schedule_notification_list');

type ScheduleNotificationType = 'stop-on-route' | 'stop-on-location';

function generateElementOfItem(item: ScheduleNotificationOption, type: ScheduleNotificationType, parameters: Array<any>): GeneratedElement {
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_schedule_notification_list_item');

  // Icon element
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_schedule_notification_item_icon');
  const iconSpanElement = document.createElement('span');
  iconSpanElement.appendChild(getIconElement(item.icon));
  iconElement.appendChild(iconSpanElement);

  // Name element
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_schedule_notification_item_name');
  nameElement.appendChild(document.createTextNode(item.name));

  // Event handler
  switch (type) {
    case 'stop-on-route':
      itemElement.onclick = function () {
        scheduleNotificationForStopItemOnRoute(parameters[0], parameters[1], parameters[2], parameters[3], item.index);
      };
      break;
    case 'stop-on-location':
      itemElement.onclick = function () {
        scheduleNotificationForStopItemOnLocation(parameters[0], parameters[1], parameters[2], parameters[3], item.index);
      };
      break;
    default:
      break;
  }

  itemElement.appendChild(iconElement);
  itemElement.appendChild(nameElement);

  return {
    element: itemElement,
    id: ''
  };
}

function initializeScheduleNotificationField(type: ScheduleNotificationType, parameters: Array<any>): void {
  ScheduleNotificationListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of scheduleNotificationOptions) {
    const newElement = generateElementOfItem(item, type, parameters);
    fragment.append(newElement.element);
  }
  ScheduleNotificationListElement.append(fragment);
}

export function openScheduleNotification(type: ScheduleNotificationType, parameters: Array<any>): void {
  pushPageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'true');
  initializeScheduleNotificationField(type, parameters);
}

export function closeScheduleNotification(): void {
  revokePageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'false');
}

export function scheduleNotificationForStopItemOnRoute(itemElementID: string, StopID: number, RouteID: number, EstimateTime: number, index: number): void {
  const itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_route_group_items_track .css_route_group_item#${itemElementID}`);
  const scheduleNotificationButtonElement = elementQuerySelector(itemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="schedule-notification"]');
  promptMessage('manufacturing', '處理中');
  scheduleNotificationButtonElement.setAttribute('enabled', 'false');
  closeScheduleNotification();
  scheduleNotificationForStop(StopID, RouteID, EstimateTime, index).then((result) => {
    switch (result) {
      case 0:
        promptMessage('error', '設定失敗');
        scheduleNotificationButtonElement.setAttribute('enabled', 'true');
        break;
      case 1:
        promptMessage('check_circle', '設定成功');
        scheduleNotificationButtonElement.setAttribute('enabled', 'true');
        scheduleNotificationButtonElement.setAttribute('highlighted', 'true');
        break;
      case 2:
        promptMessage('warning', '在設定中註冊後才可設定到站通知');
        scheduleNotificationButtonElement.setAttribute('enabled', 'true');
        break;
      default:
        break;
    }
  });
}

export function scheduleNotificationForStopItemOnLocation(itemElementID: string, StopID: number, RouteID: number, EstimateTime: number, index: number): void {
  const itemElement = documentQuerySelector(`.css_location_field .css_location_groups .css_location_group .css_location_group_items .css_location_group_item#${itemElementID}`);
  const scheduleNotificationButtonElement = elementQuerySelector(itemElement, '.css_location_group_item_body .css_location_group_item_buttons .css_location_group_item_button[type="schedule-notification"]');
  promptMessage('manufacturing', '處理中');
  scheduleNotificationButtonElement.setAttribute('enabled', 'false');
  closeScheduleNotification();
  scheduleNotificationForStop(StopID, RouteID, EstimateTime, index).then((result) => {
    switch (result) {
      case 0:
        promptMessage('error', '設定失敗');
        scheduleNotificationButtonElement.setAttribute('enabled', 'true');
        break;
      case 1:
        promptMessage('check_circle', '設定成功');
        scheduleNotificationButtonElement.setAttribute('enabled', 'true');
        scheduleNotificationButtonElement.setAttribute('highlighted', 'true');
        break;
      case 2:
        promptMessage('warning', '在設定中註冊後才可設定到站通知');
        scheduleNotificationButtonElement.setAttribute('enabled', 'true');
        break;
      default:
        break;
    }
  });
}

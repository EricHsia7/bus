import { scheduleNotificationForStop, ScheduleNotificationOption, scheduleNotificationOptions } from '../../data/notification/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { getIconElement } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const ScheduleNotificationField = documentQuerySelector('.css_schedule_notification_field');
const ScheduleNotificationBodyElement = elementQuerySelector(ScheduleNotificationField, '.css_schedule_notification_body');
const ScheduleNotificationListElement = elementQuerySelector(ScheduleNotificationBodyElement, '.css_schedule_notification_list');

function generateElementOfItem(item: ScheduleNotificationOption, thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): GeneratedElement {
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
  const index = item.index;
  itemElement.onclick = function () {
    scheduleNotificationForStopItem(thisButtonElement, StopID, RouteID, EstimateTime, index);
  };

  itemElement.appendChild(iconElement);
  itemElement.appendChild(nameElement);

  return {
    element: itemElement,
    id: ''
  };
}

function initializeScheduleNotificationField(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
  ScheduleNotificationListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of scheduleNotificationOptions) {
    const newElement = generateElementOfItem(item, thisButtonElement, StopID, RouteID, EstimateTime);
    fragment.appendChild(newElement.element);
  }
  ScheduleNotificationListElement.append(fragment);
}

export function openScheduleNotification(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
  pushPageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'true');
  initializeScheduleNotificationField(thisButtonElement, StopID, RouteID, EstimateTime);
}

export function closeScheduleNotification(): void {
  revokePageHistory('ScheduleNotification');
  ScheduleNotificationField.setAttribute('displayed', 'false');
}

export function scheduleNotificationForStopItem(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number, index: number): void {
  promptMessage('manufacturing', '處理中');
  thisButtonElement.setAttribute('enabled', 'false');
  closeScheduleNotification();
  scheduleNotificationForStop(StopID, RouteID, EstimateTime, index).then((result) => {
    switch (result) {
      case 0:
        promptMessage('error', '設定失敗');
        thisButtonElement.setAttribute('enabled', 'true');
        break;
      case 1:
        promptMessage('check_circle', '設定成功');
        thisButtonElement.setAttribute('enabled', 'true');
        thisButtonElement.setAttribute('highlighted', 'true');
        break;
      case 2:
        promptMessage('warning', '在設定中註冊後才可設定到站通知');
        thisButtonElement.setAttribute('enabled', 'true');
        break;
      default:
        break;
    }
  });
}

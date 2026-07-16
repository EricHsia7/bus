import { scheduleNotificationForStop, ScheduleNotificationOption, scheduleNotificationOptions } from '../../data/notification/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { getBlankIconElement, setIcon } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const ScheduleNotificationField = documentQuerySelector('.css_schedule_notification_field');
const ScheduleNotificationBodyElement = elementQuerySelector(ScheduleNotificationField, '.css_schedule_notification_body');
const ScheduleNotificationListElement = elementQuerySelector(ScheduleNotificationBodyElement, '.css_schedule_notification_list');

const itemElements: Array<HTMLElement> = []; // div.css_schedule_notification_list_item in div.css_schedule_notification_list

let initialized: boolean = false;

function generateElementOfItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_schedule_notification_list_item');

  // Icon element
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_schedule_notification_item_icon');
  iconElement.appendChild(getBlankIconElement());

  // Name element
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_schedule_notification_item_name');

  element.appendChild(iconElement);
  element.appendChild(nameElement);

  return element;
}

function updateScheduleNotificationField(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
  function updateItem(thisElement: HTMLElement, thisItem: ScheduleNotificationOption, thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
    function updateIcon(thisElement: HTMLElement, thisItem: ScheduleNotificationOption): void {
      const iconElement = elementQuerySelector(thisElement, '.css_schedule_notification_item_icon');
      setIcon(iconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: ScheduleNotificationOption): void {
      const nameElement = elementQuerySelector(thisElement, '.css_schedule_notification_item_name');
      nameElement.textContent = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: ScheduleNotificationOption, thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
      thisElement.onclick = function () {
        const index = thisItem.index;
        scheduleNotificationForStopItem(thisButtonElement, StopID, RouteID, EstimateTime, index);
      };
    }

    if (!initialized) {
      updateIcon(thisElement, thisItem);
      updateName(thisElement, thisItem);
    }

    updateOnclick(thisElement, thisItem, thisButtonElement, StopID, RouteID, EstimateTime);
  }

  const scheduleNotificationOptionsLength = scheduleNotificationOptions.length;
  const itemElementsLength = itemElements.length;
  if (scheduleNotificationOptionsLength !== itemElementsLength) {
    const difference = itemElementsLength - scheduleNotificationOptionsLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      ScheduleNotificationListElement.append(fragment);
    } else if (difference > 0) {
      for (let p = itemElementsLength - 1, q = itemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < scheduleNotificationOptionsLength; i++) {
    const thisElement = itemElements[i];
    const thisItem = scheduleNotificationOptions[i];
    updateItem(thisElement, thisItem, thisButtonElement, StopID, RouteID, EstimateTime);
  }

  initialized = true;
}

export function showScheduleNotification(): void {
  ScheduleNotificationField.setAttribute('displayed', 'true');
}

export function hideScheduleNotification(): void {
  ScheduleNotificationField.setAttribute('displayed', 'false');
}

export function openScheduleNotification(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
  pushPageHistory('ScheduleNotification');
  showScheduleNotification();
  updateScheduleNotificationField(thisButtonElement, StopID, RouteID, EstimateTime);
  hidePreviousPage();
}

export function closeScheduleNotification(): void {
  hideScheduleNotification();
  showPreviousPage();
  revokePageHistory('ScheduleNotification');
}

async function scheduleNotificationForStopItem(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number, index: number) {
  thisButtonElement.setAttribute('enabled', 'false');
  thisButtonElement.setAttribute('processing', 'true');
  closeScheduleNotification();
  const result = await scheduleNotificationForStop(StopID, RouteID, EstimateTime, index);
  switch (result) {
    case false:
      promptMessage('error', '網路錯誤，請稍後再試');
      break;
    case -1:
      promptMessage('warning', '在設定中註冊後才可設定到站通知');
      break;
    case 0:
      promptMessage('check_circle', '設定成功');
      thisButtonElement.setAttribute('highlighted', 'true');
      break;
    case 1:
      promptMessage('error', '無效的使用者');
      break;
    case 3:
      promptMessage('error', '找不到使用者');
      break;
    case 5:
      promptMessage('error', '驗證錯誤');
      break;
    case 6:
      promptMessage('error', '只能設定至少一分鐘後的排程通知');
      break;
    default:
      promptMessage('error', '未知錯誤');
      break;
  }
  thisButtonElement.setAttribute('processing', 'false');
  thisButtonElement.setAttribute('enabled', 'true');
}

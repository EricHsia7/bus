import { scheduleNotificationForStop, ScheduleNotificationOption, scheduleNotificationOptions } from '../../data/notification/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const ScheduleNotificationField = documentQuerySelector('.css_schedule_notification_field');
const ScheduleNotificationBodyElement = elementQuerySelector(ScheduleNotificationField, '.css_schedule_notification_body');
const ScheduleNotificationListElement = elementQuerySelector(ScheduleNotificationBodyElement, '.css_schedule_notification_list');

function generateElementOfItem(item: ScheduleNotificationOption, thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): HTMLElement {
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_schedule_notification_list_item');

  // Icon element
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_schedule_notification_item_icon');
  const iconSpanElement = document.createElement('span');
  iconSpanElement.appendChild(getIconElement(item.icon));
  iconElement.appendChild(iconSpanElement);

  // Name element
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_schedule_notification_item_name');
  nameElement.innerText = item.name;

  // Event handler
  const index = item.index;
  itemElement.onclick = function () {
    scheduleNotificationForStopItem(thisButtonElement, StopID, RouteID, EstimateTime, index);
  };

  itemElement.appendChild(iconElement);
  itemElement.appendChild(nameElement);

  return itemElement;
}

function initializeScheduleNotificationField(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
  ScheduleNotificationListElement.innerHTML = '';
  const fragment = new DocumentFragment();
  for (const item of scheduleNotificationOptions) {
    const newElement = generateElementOfItem(item, thisButtonElement, StopID, RouteID, EstimateTime);
    fragment.appendChild(newElement);
  }
  ScheduleNotificationListElement.append(fragment);
}

export function showScheduleNotification(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse ? 'css_page_transition_slide_in_reverse' : 'css_page_transition_fade_in';
  ScheduleNotificationField.addEventListener(
    'animationend',
    function () {
      ScheduleNotificationField.classList.remove(className);
    },
    { once: true }
  );
  ScheduleNotificationField.classList.add(className);
  ScheduleNotificationField.setAttribute('displayed', 'true');
}

export function hideScheduleNotification(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse === 'ltr' ? 'css_page_transition_slide_out_reverse' : 'css_page_transition_fade_out';
  ScheduleNotificationField.addEventListener(
    'animationend',
    function () {
      ScheduleNotificationField.setAttribute('displayed', 'false');
      ScheduleNotificationField.classList.remove(className);
    },
    { once: true }
  );
  ScheduleNotificationField.classList.add(className);
}

export function openScheduleNotification(thisButtonElement: HTMLElement, StopID: number, RouteID: number, EstimateTime: number): void {
  pushPageHistory('ScheduleNotification');
  showScheduleNotification('rtl');
  initializeScheduleNotificationField(thisButtonElement, StopID, RouteID, EstimateTime);
  hidePreviousPage();
}

export function closeScheduleNotification(): void {
  hideScheduleNotification('ltr');
  showPreviousPage();
  revokePageHistory('ScheduleNotification');
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

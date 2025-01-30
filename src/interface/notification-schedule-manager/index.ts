import { cancelNotification } from '../../data/notification/apis/cancelNotification/index';
import { IntegratedNotififcationSchedules, integrateNotifcationSchedules, NotificationSchedule } from '../../data/notification/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const NotificationScheduleManagerField = documentQuerySelector('.css_notification_schedule_manager_field');
const NotificationScheduleManagerBody = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_body');
const NotificationScheduleList = elementQuerySelector(NotificationScheduleManagerBody, '.css_notification_schedule_manager_notification_schedule_list');

function generateElementOfItem(): GeneratedElement {
  const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_notification_schedule_manager_notification_schedule_item');
  element.id = identifier;
  element.innerHTML = /*html*/ `<div class="css_notification_schedule_manager_notification_schedule_item_hours"></div><div class="css_notification_schedule_manager_notification_schedule_item_notification_schedule"><div class="css_notification_schedule_manager_notification_schedule_item_notification_schedule_minutes"></div><div class="css_notification_schedule_manager_notification_schedule_item_notification_schedule_main"></div><div class="css_notification_schedule_manager_notification_schedule_item_notification_schedule_context"></div><div class="css_notification_schedule_manager_notification_schedule_item_notification_schedule_cancel" onclick="bus.notification.cancelNotificationOnNotificationManager('${identifier}', 'null')">${getIconHTML('delete')}</div><div class="css_notification_schedule_manager_notification_schedule_item_notification_schedule_separator"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function updateNotificationScheduleManagerField(Field: HTMLElement, integration: IntegratedNotififcationSchedules): void {
  const fragment = new DocumentFragment();
  NotificationScheduleList.innerHTML = '';
  for (const item of integration) {
    const newItemElement = generateElementOfItem();
    fragment.append(newItemElement.element);
  }
  NotificationScheduleList.append(fragment);
}

async function initializeNotificationScheduleManagerField() {
  const requestID = generateIdentifier('r');
  const integration = await integrateNotifcationSchedules(requestID);
  updateNotificationScheduleManagerField(integration);
}

export function openNotificationScheduleManager(): void {
  pushPageHistory('NotificationScheduleManager');
  NotificationScheduleManagerField.setAttribute('displayed', 'true');
  initializeNotificationScheduleManagerField();
  closePreviousPage();
}

export function closeNotificationScheduleManager(): void {
  // revokePageHistory('NotificationScheduleManager');
  NotificationScheduleManagerField.setAttribute('displayed', 'false');
  openPreviousPage();
}

export async function cancelNotificationOnNotificationManager(identifier: string, schedule_id: NotificationSchedule['schedule_id']) {
  promptMessage('處理中', 'manufacturing');
  const cancellation = await cancelNotification(schedule_id);
  if (cancellation) {
    const itemElement = elementQuerySelector(NotificationScheduleList, `.css_notification_schedule_manager_notification_schedule_item#${identifier}`);
    itemElement.remove();
    promptMessage('已取消通知', 'check_circle');
  } else {
    promptMessage('取消失敗', 'error');
  }
}

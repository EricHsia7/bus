import { cancelNotification } from '../../data/notification/apis/cancelNotification/index';
import { IntegratedNotififcationSchedule, IntegratedNotififcationSchedules, integrateNotifcationSchedules, NotificationSchedule } from '../../data/notification/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';
import { promptMessage } from '../prompt/index';

const NotificationScheduleManagerField = documentQuerySelector('.css_notification_schedule_manager_field');
const NotificationScheduleManagerBody = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_body');
const NotificationScheduleList = elementQuerySelector(NotificationScheduleManagerBody, '.css_notification_schedule_manager_notification_schedule_list');

function generateElementOfItem(item: IntegratedNotififcationSchedule): GeneratedElement {
  const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_notification_schedule_manager_notification_schedule_item');
  element.id = identifier;
  element.innerHTML = /*html*/ `<div class="css_notification_schedule_manager_notification_schedule_item_time_offset">${item.time_offset * -1}</div><div class="css_notification_schedule_manager_notification_schedule_item_context">${item.route_name} - 往${item.direction}</div><div class="css_notification_schedule_manager_notification_schedule_item_main">${item.location_name}</div><div class="css_notification_schedule_manager_notification_schedule_item_capsule"><div class="css_notification_schedule_manager_notification_schedule_item_cancel" onclick="bus.notification.cancelNotificationOnNotificationManager('${identifier}', '${item.schedule_id}')">${getIconHTML('delete')}</div><div class="css_notification_schedule_manager_notification_schedule_item_open_route" onclick="bus.route.openRoute(${item.route_id}, [${item.route_pid.join(',')}])">${getIconHTML('keyboard_arrow_right')}</div><div class="css_notification_schedule_manager_notification_schedule_item_capsule_separator"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function updateNotificationScheduleManagerField(integration: IntegratedNotififcationSchedules): void {
  const fragment = new DocumentFragment();
  NotificationScheduleList.innerHTML = '';
  for (const item of integration) {
    const newItemElement = generateElementOfItem(item);
    fragment.append(newItemElement.element);
  }
  NotificationScheduleList.append(fragment);
}

function initializeNotificationScheduleManagerField(): void {
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
  const cancellation = await cancelNotification(schedule_id);
  if (cancellation) {
    promptMessage('已取消通知', 'check_circle');
  } else {
    promptMessage('取消失敗', 'error');
  }
}

import { listNotifcationSchedules, NScheduleFrontend } from '../../data/notification/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory } from '../index';

const NotificationScheduleManagerField = documentQuerySelector('.css_notification_schedule_manager_field');
const NotificationScheduleManagerBody = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_body');
const NotificationScheduleList = elementQuerySelector(NotificationScheduleManagerBody, '.css_notification_schedule_manager_notification_schedule_list');

function generateElementOfItem(item: NScheduleFrontend): GeneratedElement {
  // const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_notification_schedule_manager_notification_schedule_item');
  // element.id = identifier;
  element.innerHTML = /*html*/ `<div class="css_notification_schedule_manager_notification_schedule_item_time_offset">${item.time_offset * -1}</div><div class="css_notification_schedule_manager_notification_schedule_item_context">${item.route_name} - 往${item.direction}</div><div class="css_notification_schedule_manager_notification_schedule_item_main">${item.location_name}</div><div class="css_notification_schedule_manager_notification_schedule_item_capsule"><div class="css_notification_schedule_manager_notification_schedule_item_cancel">${getIconHTML('delete')}</div> <div class="css_notification_schedule_manager_notification_schedule_item_open_route">${getIconHTML('keyboard_arrow_right')}</div><div class="css_notification_schedule_manager_notification_schedule_item_capsule_separator"></div></div>`;
  return {
    element: element,
    id: ''
  };
}

function updateNotificationScheduleManagerField(notificationSchedules: Array<NScheduleFrontend>): void {
  const fragment = new DocumentFragment();
  NotificationScheduleList.innerHTML = '';
  for (const notificationSchedule of notificationSchedules) {
    const newItemElement = generateElementOfItem(notificationSchedule);
    fragment.append(newItemElement.element);
  }
  NotificationScheduleList.append(fragment);
}

function initializeNotificationScheduleManagerField(): void {
  const notificationSchedules = listNotifcationSchedules();
  updateNotificationScheduleManagerField(notificationSchedules);
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

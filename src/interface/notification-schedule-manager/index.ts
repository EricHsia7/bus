import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { DataReceivingProgressEvent } from '../../data/apis/loader';
import { cancelNotification } from '../../data/notification/apis/cancelNotification/index';
import { IntegratedNotificationScheduleItem, IntegratedNotificationSchedules, integrateNotifcationSchedules, NotificationSchedule } from '../../data/notification/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { booleanToString, compareThings, generateIdentifier, hasOwnProperty } from '../../tools/index';
import { Tick } from '../../tools/tick';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';
import { promptMessage } from '../prompt/index';

const NotificationScheduleManagerField = documentQuerySelector('.css_notification_schedule_manager_field');
const NotificationScheduleManagerHeadElement = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_head');
const NotificationScheduleManagerUpdateTimerBoxElement = elementQuerySelector(NotificationScheduleManagerHeadElement, '.css_notification_schedule_manager_update_timer_box');
const NotificationScheduleManagerUpdateTimerElement = elementQuerySelector(NotificationScheduleManagerUpdateTimerBoxElement, '.css_notification_schedule_manager_update_timer');
const NotificationScheduleManagerBody = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_body');
const NotificationScheduleList = elementQuerySelector(NotificationScheduleManagerBody, '.css_notification_schedule_manager_notification_schedule_list');

let previousIntegration = {} as IntegratedNotificationSchedules;
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

const notifcationScheduleManagerTick = new Tick(refreshNotificationScheduleManager, 15 * 1000);

function animateUpdateTimer(interval: number): void {
  NotificationScheduleManagerUpdateTimerElement.style.setProperty('--b-cssvar-notification-schedule-manager-update-timer-interval', `${interval}ms`);
  NotificationScheduleManagerUpdateTimerElement.classList.add('css_notification_schedule_manager_update_timer_slide_rtl');
}

function handleDataReceivingProgressUpdates(event: Event): void {
  const CustomEvent = event as DataReceivingProgressEvent;
  const offsetRatio = CustomEvent.detail.progress - 1;
  NotificationScheduleManagerUpdateTimerElement.style.setProperty('--b-cssvar-notification-schedule-manager-update-timer-offset-ratio', offsetRatio.toString());
  if (CustomEvent.detail.stage === 'end') {
    document.removeEventListener(CustomEvent.detail.target, handleDataReceivingProgressUpdates);
  }
}

function generateElementOfItem(): HTMLElement {
  // Main item element
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_notification_schedule_manager_item');

  // Hours element
  const hoursElement = documentCreateDivElement();
  hoursElement.classList.add('css_notification_schedule_manager_item_hours');
  itemElement.appendChild(hoursElement);

  // Notification schedule container
  const notificationScheduleElement = documentCreateDivElement();
  notificationScheduleElement.classList.add('css_notification_schedule_manager_item_notification_schedule');

  // Minutes element
  const minutesElement = documentCreateDivElement();
  minutesElement.classList.add('css_notification_schedule_manager_item_notification_schedule_minutes');
  notificationScheduleElement.appendChild(minutesElement);

  // Context element
  const contextElement = documentCreateDivElement();
  contextElement.classList.add('css_notification_schedule_manager_item_notification_schedule_context');
  notificationScheduleElement.appendChild(contextElement);

  // Main element
  const mainElement = documentCreateDivElement();
  mainElement.classList.add('css_notification_schedule_manager_item_notification_schedule_main');
  notificationScheduleElement.appendChild(mainElement);

  // Cancel button element
  const cancelElement = documentCreateDivElement();
  cancelElement.classList.add('css_notification_schedule_manager_item_notification_schedule_cancel');
  const iconElement = document.createElement('span');
  iconElement.appendChild(getIconElement('close'));
  cancelElement.appendChild(iconElement);

  notificationScheduleElement.appendChild(cancelElement);

  // Assemble
  itemElement.appendChild(notificationScheduleElement);

  return itemElement;
}

function updateNotificationScheduleManagerField(integration: IntegratedNotificationSchedules, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisItemElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem, previousItem: IntegratedNotificationScheduleItem | null): void {
    function updateHours(thisItemElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const thisItemHoursElement = elementQuerySelector(thisItemElement, '.css_notification_schedule_manager_item_hours');
      thisItemHoursElement.innerText = thisItem.hours;
    }

    function updateMinutes(thisItemElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const thisItemNotificationScheduleElement = elementQuerySelector(thisItemElement, '.css_notification_schedule_manager_item_notification_schedule');
      const thisItemMinutesElement = elementQuerySelector(thisItemNotificationScheduleElement, '.css_notification_schedule_manager_item_notification_schedule_minutes');
      thisItemMinutesElement.innerText = thisItem.minutes;
    }

    function updateMain(thisItemElement: HTMLElementm, thisItem: IntegratedNotificationScheduleItem): void {
      const thisItemNotificationScheduleElement = elementQuerySelector(thisItemElement, '.css_notification_schedule_manager_item_notification_schedule');
      const thisItemMainElement = elementQuerySelector(thisItemNotificationScheduleElement, '.css_notification_schedule_manager_item_notification_schedule_main');
      thisItemMainElement.innerText = thisItem.name;
    }

    function updateContext(thisItemElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const thisItemNotificationScheduleElement = elementQuerySelector(thisItemElement, '.css_notification_schedule_manager_item_notification_schedule');
      const thisItemContextElement = elementQuerySelector(thisItemNotificationScheduleElement, '.css_notification_schedule_manager_item_notification_schedule_context');
      thisItemContextElement.innerText = `${thisItem.route.name} - 往${thisItem.route.direction}`;
    }

    function updateCancel(thisItemElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const thisItemNotificationScheduleElement = elementQuerySelector(thisItemElement, '.css_notification_schedule_manager_item_notification_schedule');
      const thisItemCancelElement = elementQuerySelector(thisItemNotificationScheduleElement, '.css_notification_schedule_manager_item_notification_schedule_cancel');
      thisItemCancelElement.onclick = function () {
        cancelNotificationOnNotificationScheduleManager(thisItemElement, thisItem.schedule_id);
      };
    }

    function updateFirst(thisItemElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      thisItemElement.setAttribute('first', booleanToString(thisItem.is_first));
    }

    function updateAnimation(thisItemElement: HTMLElement, animation: boolean): void {
      thisItemElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisItemElement: HTMLElement, skeletonScreen: boolean): void {
      thisItemElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousItem === null || previousItem === undefined) {
      updateHours(thisItemElement, thisItem);
      updateMinutes(thisItemElement, thisItem);
      updateMain(thisItemElement, thisItem);
      updateContext(thisItemElement, thisItem);
      updateCancel(thisItemElement, thisItem);
      updateFirst(thisItemElement, thisItem);
      updateAnimation(thisItemElement, animation);
      updateSkeletonScreen(thisItemElement, skeletonScreen);
    } else {
      if (thisItem.hours !== previousItem.hours) {
        updateHours(thisItemElement, thisItem);
      }
      if (thisItem.minutes !== previousItem.minutes) {
        updateMinutes(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.schedule_id, thisItem.schedule_id)) {
        updateMain(thisItemElement, thisItem);
        updateContext(thisItemElement, thisItem);
        updateCancel(thisItemElement, thisItem);
      }
      if (previousItem.is_first !== thisItem.is_first) {
        updateFirst(thisItemElement, thisItem);
      }
      if (previousAnimation !== animation) {
        updateAnimation(thisItemElement, animation);
      }
      if (previousSkeletonScreen !== skeletonScreen) {
        updateSkeletonScreen(thisItemElement, skeletonScreen);
      }
    }
  }

  const itemQuantity = integration.itemQuantity;
  const items = integration.items;

  const itemElements = Array.from(elementQuerySelectorAll(NotificationScheduleList, '.css_notification_schedule_manager_item'));
  const currentItemElementsLength = itemElements.length;
  if (itemQuantity !== currentItemElementsLength) {
    const difference = currentItemElementsLength - itemQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      NotificationScheduleList.append(fragment);
    } else if (difference > 0) {
      for (let p = currentItemElementsLength - 1, q = currentItemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  for (let j = 0; j < itemQuantity; j++) {
    const thisItemElement = itemElements[j];
    const thisItem = items[j];
    if (hasOwnProperty(previousIntegration, 'items')) {
      if (previousIntegration.items[j]) {
        const previousItem = previousIntegration.items[j];
        updateItem(thisItemElement, thisItem, previousItem);
      } else {
        updateItem(thisItemElement, thisItem, null);
      }
    } else {
      updateItem(thisItemElement, thisItem, null);
    }
  }

  previousIntegration = integration;
  previousSkeletonScreen = skeletonScreen;
}

function setupNotificationScheduleManagerFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  const defaultItemQuantity: IntegratedNotificationSchedules['itemQuantity'] = Math.floor(FieldHeight / 50) + 5;
  let items: IntegratedNotificationSchedules['items'] = [];
  for (let i = 0; i < defaultItemQuantity; i++) {
    items.push({
      name: '',
      stop_id: 0,
      estimate_time: 0,
      schedule_id: 'null',
      scheduled_time: 0,
      route: {
        name: '',
        direction: '',
        id: 0,
        pathAttributeId: []
      },
      is_first: true,
      date: '',
      hours: '',
      minutes: ''
    });
  }
  updateNotificationScheduleManagerField(
    {
      items: items,
      itemQuantity: defaultItemQuantity,
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

async function refreshNotificationScheduleManager(): Promise<number> {
  try {
    const playing_animation = getSettingOptionValue('playing_animation') as boolean;
    const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
    const requestID = generateIdentifier();
    NotificationScheduleManagerUpdateTimerElement.setAttribute('refreshing', 'true');
    NotificationScheduleManagerUpdateTimerElement.classList.remove('css_notification_schedule_manager_update_timer_slide_rtl');
    document.addEventListener(requestID, handleDataReceivingProgressUpdates);
    const integration = await integrateNotifcationSchedules(requestID);
    updateNotificationScheduleManagerField(integration, false, playing_animation);
    let updateRate = 0;
    if (refresh_interval_setting.dynamic) {
      updateRate = await getUpdateRate();
    }
    const lastUpdate = new Date().getTime();
    let nextUpdate = 0;
    if (refresh_interval_setting.dynamic) {
      nextUpdate = Math.max(lastUpdate + 5000, integration.dataUpdateTime + refresh_interval_setting.baseInterval / updateRate);
    } else {
      nextUpdate = lastUpdate + refresh_interval_setting.baseInterval;
    }
    const interval = Math.max(5000, nextUpdate - lastUpdate);
    NotificationScheduleManagerUpdateTimerElement.setAttribute('refreshing', 'false');
    animateUpdateTimer(interval);
  } catch (err) {
    const interval = 10 * 1000;
    promptMessage('error', `通知發生錯誤，將在${interval / 1000}秒後重試。`);
    animateUpdateTimer(interval);
    return interval;
  }
}

export function showNotificationScheduleManager(): void {
  NotificationScheduleManagerField.setAttribute('displayed', 'true');
}

export function hideNotificationScheduleManager(): void {
  NotificationScheduleManagerField.setAttribute('displayed', 'false');
}

export function openNotificationScheduleManager(): void {
  pushPageHistory('NotificationScheduleManager');
  showNotificationScheduleManager();
  setupNotificationScheduleManagerFieldSkeletonScreen();
  if (notifcationScheduleManagerTick.isPaused) {
    notifcationScheduleManagerTick.resume(true);
  } else {
    notifcationScheduleManagerTick.tick();
  }
  hidePreviousPage();
}

export function closeNotificationScheduleManager(): void {
  hideNotificationScheduleManager();
  notifcationScheduleManagerTick.pause();
  showPreviousPage();
  revokePageHistory('NotificationScheduleManager');
}

export async function cancelNotificationOnNotificationScheduleManager(thisItemElement: HTMLElement, schedule_id: NotificationSchedule['schedule_id']) {
  promptMessage('manufacturing', '處理中');
  const cancellation = await cancelNotification(schedule_id);
  if (cancellation) {
    thisItemElement.remove();
    promptMessage('check_circle', '已取消通知');
    // TODO: refresh
  } else {
    promptMessage('error', '取消失敗');
  }
}

import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { DataReceivingProgressEvent } from '../../data/apis/loader';
import { cancelNotification } from '../../data/notification/apis/cancelNotification/index';
import { IntegratedNotificationScheduleItem, IntegratedNotificationSchedules, integrateNotifcationSchedules, NotificationSchedule } from '../../data/notification/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { booleanToString, compareThings, generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { closePreviousPage, GeneratedElement, openPreviousPage, pushPageHistory, querySize } from '../index';
import { promptMessage } from '../prompt/index';

const NotificationScheduleManagerField = documentQuerySelector('.css_notification_schedule_manager_field');
const NotificationScheduleManagerHeadElement = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_head');
const NotificationScheduleManagerUpdateTimerBoxElement = elementQuerySelector(NotificationScheduleManagerHeadElement, '.css_notification_schedule_manager_update_timer_box');
const NotificationScheduleManagerUpdateTimerElement = elementQuerySelector(NotificationScheduleManagerUpdateTimerBoxElement, '.css_notification_schedule_manager_update_timer');
const NotificationScheduleManagerBody = elementQuerySelector(NotificationScheduleManagerField, '.css_notification_schedule_manager_body');
const NotificationScheduleList = elementQuerySelector(NotificationScheduleManagerBody, '.css_notification_schedule_manager_notification_schedule_list');

let previousIntegration = {} as IntegratedNotificationSchedules;
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

let notifcationScheduleManagerRefreshTimer_retryInterval: number = 10 * 1000;
let notifcationScheduleManagerRefreshTimer_baseInterval: number = 15 * 1000;
let notifcationScheduleManagerRefreshTimer_minInterval: number = 5 * 1000;
let notifcationScheduleManagerRefreshTimer_dynamicInterval: number = 15 * 1000;
let notifcationScheduleManagerRefreshTimer_dynamic: boolean = true;
let notifcationScheduleManagerRefreshTimer_lastUpdate: number = 0;
let notifcationScheduleManagerRefreshTimer_nextUpdate: number = 0;
let notifcationScheduleManagerRefreshTimer_currentRequestID: string = '';
let notifcationScheduleManagerRefreshTimer_refreshing: boolean = false;
let notifcationScheduleManagerRefreshTimer_streaming: boolean = false;
let notifcationScheduleManagerRefreshTimer_streamStarted: boolean = false;

function animateUpdateTimer(): void {
  NotificationScheduleManagerUpdateTimerElement.style.setProperty('--b-cssvar-notification-schedule-manager-update-timer-interval', `${notifcationScheduleManagerRefreshTimer_dynamicInterval}ms`);
  NotificationScheduleManagerUpdateTimerElement.classList.add('css_notification_schedule_manager_update_timer_slide_rtl');
}

function handleDataReceivingProgressUpdates(event: Event): void {
  const CustomEvent = event as DataReceivingProgressEvent;
  if (notifcationScheduleManagerRefreshTimer_refreshing) {
    const offsetRatio = CustomEvent.detail.progress - 1;
    NotificationScheduleManagerUpdateTimerElement.style.setProperty('--b-cssvar-notification-schedule-manager-update-timer-offset-ratio', offsetRatio.toString());
  }
  if (CustomEvent.detail.stage === 'end') {
    document.removeEventListener(CustomEvent.detail.target, handleDataReceivingProgressUpdates);
  }
}

function generateElementOfItem(): GeneratedElement {
  const identifier = generateIdentifier();

  // Main item element
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_notification_schedule_manager_item');
  itemElement.id = identifier;

  // Hours element
  const hoursElement = document.createElement('div');
  hoursElement.classList.add('css_notification_schedule_manager_item_hours');
  itemElement.appendChild(hoursElement);

  // Notification schedule container
  const notificationScheduleElement = document.createElement('div');
  notificationScheduleElement.classList.add('css_notification_schedule_manager_item_notification_schedule');

  // Minutes element
  const minutesElement = document.createElement('div');
  minutesElement.classList.add('css_notification_schedule_manager_item_notification_schedule_minutes');
  notificationScheduleElement.appendChild(minutesElement);

  // Context element
  const contextElement = document.createElement('div');
  contextElement.classList.add('css_notification_schedule_manager_item_notification_schedule_context');
  notificationScheduleElement.appendChild(contextElement);

  // Main element
  const mainElement = document.createElement('div');
  mainElement.classList.add('css_notification_schedule_manager_item_notification_schedule_main');
  notificationScheduleElement.appendChild(mainElement);

  // Cancel button element
  const cancelElement = document.createElement('div');
  cancelElement.classList.add('css_notification_schedule_manager_item_notification_schedule_cancel');
  // Set icon using DOM
  const iconElement = document.createElement('span');
  iconElement.innerHTML = getIconHTML('close');
  cancelElement.appendChild(iconElement);

  notificationScheduleElement.appendChild(cancelElement);

  // Assemble
  itemElement.appendChild(notificationScheduleElement);

  return {
    element: itemElement,
    id: identifier
  };
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
        cancelNotificationOnNotificationScheduleManager(thisItemElement.id, thisItem.schedule_id);
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

    if (previousItem === null) {
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

  const currentItemSeatQuantity = elementQuerySelectorAll(NotificationScheduleList, `.css_notification_schedule_manager_item`).length;
  if (itemQuantity !== currentItemSeatQuantity) {
    const capacity = currentItemSeatQuantity - itemQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newItemElement = generateElementOfItem();
        NotificationScheduleList.appendChild(newItemElement.element);
      }
    } else {
      const NotificationScheduleItemElements = elementQuerySelectorAll(NotificationScheduleList, '.css_notification_schedule_manager_item');
      for (let o = 0; o < Math.abs(capacity); o++) {
        const itemIndex = currentItemSeatQuantity - 1 - o;
        NotificationScheduleItemElements[itemIndex].remove();
      }
    }
  }

  const NotificationScheduleItemElements = elementQuerySelectorAll(NotificationScheduleList, '.css_notification_schedule_manager_item');
  for (let j = 0; j < itemQuantity; j++) {
    const thisItemElement = NotificationScheduleItemElements[j];
    const thisItem = items[j];
    if (previousIntegration.hasOwnProperty('items')) {
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

function setUpNotificationScheduleManagerFieldSkeletonScreen(): void {
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

async function refreshNotificationScheduleManager() {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  notifcationScheduleManagerRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  notifcationScheduleManagerRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  notifcationScheduleManagerRefreshTimer_refreshing = true;
  notifcationScheduleManagerRefreshTimer_currentRequestID = generateIdentifier();
  NotificationScheduleManagerUpdateTimerElement.setAttribute('refreshing', 'true');
  NotificationScheduleManagerUpdateTimerElement.classList.remove('css_notification_schedule_manager_update_timer_slide_rtl');
  document.addEventListener(notifcationScheduleManagerRefreshTimer_currentRequestID, handleDataReceivingProgressUpdates);
  const integration = await integrateNotifcationSchedules(notifcationScheduleManagerRefreshTimer_currentRequestID);
  updateNotificationScheduleManagerField(integration, false, playing_animation);
  let updateRate = 0;
  if (notifcationScheduleManagerRefreshTimer_dynamic) {
    updateRate = await getUpdateRate();
  }
  notifcationScheduleManagerRefreshTimer_lastUpdate = new Date().getTime();
  if (notifcationScheduleManagerRefreshTimer_dynamic) {
    notifcationScheduleManagerRefreshTimer_nextUpdate = Math.max(notifcationScheduleManagerRefreshTimer_lastUpdate + notifcationScheduleManagerRefreshTimer_minInterval, integration.dataUpdateTime + notifcationScheduleManagerRefreshTimer_baseInterval / updateRate);
  } else {
    notifcationScheduleManagerRefreshTimer_nextUpdate = notifcationScheduleManagerRefreshTimer_lastUpdate + notifcationScheduleManagerRefreshTimer_baseInterval;
  }
  notifcationScheduleManagerRefreshTimer_dynamicInterval = Math.max(notifcationScheduleManagerRefreshTimer_minInterval, notifcationScheduleManagerRefreshTimer_nextUpdate - notifcationScheduleManagerRefreshTimer_lastUpdate);
  notifcationScheduleManagerRefreshTimer_refreshing = false;
  NotificationScheduleManagerUpdateTimerElement.setAttribute('refreshing', 'false');
  animateUpdateTimer();
}

async function streamNotificationScheduleManager() {
  refreshNotificationScheduleManager()
    .then(function () {
      if (notifcationScheduleManagerRefreshTimer_streaming) {
        setTimeout(function () {
          streamNotificationScheduleManager();
        }, Math.max(notifcationScheduleManagerRefreshTimer_minInterval, notifcationScheduleManagerRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        notifcationScheduleManagerRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (notifcationScheduleManagerRefreshTimer_streaming) {
        setTimeout(function () {
          streamNotificationScheduleManager();
        }, notifcationScheduleManagerRefreshTimer_retryInterval);
      } else {
        notifcationScheduleManagerRefreshTimer_streamStarted = false;
      }
    });
}

export function openNotificationScheduleManager(): void {
  pushPageHistory('NotificationScheduleManager');
  NotificationScheduleManagerField.setAttribute('displayed', 'true');
  setUpNotificationScheduleManagerFieldSkeletonScreen();
  if (!notifcationScheduleManagerRefreshTimer_streaming) {
    notifcationScheduleManagerRefreshTimer_streaming = true;
    if (!notifcationScheduleManagerRefreshTimer_streamStarted) {
      notifcationScheduleManagerRefreshTimer_streamStarted = true;
      streamNotificationScheduleManager();
    } else {
      refreshNotificationScheduleManager();
    }
  }
  closePreviousPage();
}

export function closeNotificationScheduleManager(): void {
  // revokePageHistory('NotificationScheduleManager');
  NotificationScheduleManagerField.setAttribute('displayed', 'false');
  notifcationScheduleManagerRefreshTimer_streaming = false;
  openPreviousPage();
}

export async function cancelNotificationOnNotificationScheduleManager(identifier: string, schedule_id: NotificationSchedule['schedule_id']) {
  promptMessage('處理中', 'manufacturing');
  const cancellation = await cancelNotification(schedule_id);
  if (cancellation) {
    const itemElement = elementQuerySelector(NotificationScheduleList, `.css_notification_schedule_manager_item#${identifier}`);
    itemElement.remove();
    promptMessage('已取消通知', 'check_circle');
    if (!notifcationScheduleManagerRefreshTimer_refreshing) {
      const playing_animation = getSettingOptionValue('playing_animation') as boolean;
      const integration = await integrateNotifcationSchedules(notifcationScheduleManagerRefreshTimer_currentRequestID);
      updateNotificationScheduleManagerField(integration, false, playing_animation);
    }
  } else {
    promptMessage('取消失敗', 'error');
  }
}

import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { getDataReceivingProgress } from '../../data/apis/loader';
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
let notifcationScheduleManagerRefreshTimer_streaming: boolean = false;
let notifcationScheduleManagerRefreshTimer_lastUpdate: number = 0;
let notifcationScheduleManagerRefreshTimer_nextUpdate: number = 0;
let notifcationScheduleManagerRefreshTimer_refreshing: boolean = false;
let notifcationScheduleManagerRefreshTimer_currentRequestID: string = '';
let notifcationScheduleManagerRefreshTimer_streamStarted: boolean = false;
let notifcationScheduleManagerRefreshTimer_timer: ReturnType<typeof setTimeout>;

function updateUpdateTimer(): void {
  const time = new Date().getTime();
  let percentage = 0;
  if (notifcationScheduleManagerRefreshTimer_refreshing) {
    percentage = -1 + getDataReceivingProgress(notifcationScheduleManagerRefreshTimer_currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - notifcationScheduleManagerRefreshTimer_lastUpdate) / notifcationScheduleManagerRefreshTimer_dynamicInterval));
  }
  NotificationScheduleManagerUpdateTimerElement.style.setProperty('--b-cssvar-update-timer', percentage.toString());
  window.requestAnimationFrame(function () {
    if (notifcationScheduleManagerRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfItem(): GeneratedElement {
  const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_notification_schedule_manager_item');
  element.id = identifier;
  element.innerHTML = /*html*/ `<div class="css_notification_schedule_manager_item_hours"></div><div class="css_notification_schedule_manager_item_notification_schedule"><div class="css_notification_schedule_manager_item_notification_schedule_minutes"></div><div class="css_notification_schedule_manager_item_notification_schedule_context"></div><div class="css_notification_schedule_manager_item_notification_schedule_main"></div><div class="css_notification_schedule_manager_item_notification_schedule_cancel" onclick="bus.notification.cancelNotificationOnNotificationManager('${identifier}', 'null')">${getIconHTML('close')}</div></div>`;
  return {
    element: element,
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
      const thisItemContextElement = elementQuerySelector(thisItemNotificationScheduleElement, '.css_notification_schedule_manager_item_notification_schedule_cancel');
      thisItemContextElement.setAttribute('onclick', `bus.notification.cancelNotificationOnNotificationManager('${thisItemElement.id}', '${thisItem.schedule_id}')`);
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
      if (!(thisItem.hours === previousItem.hours)) {
        updateHours(thisItemElement, thisItem);
      }
      if (!(thisItem.minutes === previousItem.minutes)) {
        updateMinutes(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.schedule_id, thisItem.schedule_id)) {
        updateMain(thisItemElement, thisItem);
        updateContext(thisItemElement, thisItem);
        updateCancel(thisItemElement, thisItem);
      }
      if (!(previousItem.is_first === thisItem.is_first)) {
        updateFirst(thisItemElement, thisItem);
      }
      if (!(skeletonScreen === previousSkeletonScreen)) {
        updateSkeletonScreen(thisItemElement, skeletonScreen);
      }
      if (!(previousAnimation === animation)) {
        updateAnimation(thisItemElement, animation);
      }
      if (!(previousSkeletonScreen === skeletonScreen)) {
        updateSkeletonScreen(thisItemElement, skeletonScreen);
      }
    }
  }

  const itemQuantity = integration.itemQuantity;
  const items = integration.items;

  const currentItemSeatQuantity = elementQuerySelectorAll(NotificationScheduleList, `.css_notification_schedule_manager_item`).length;
  if (!(itemQuantity === currentItemSeatQuantity)) {
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

export function setUpNotificationScheduleManagerFieldSkeletonScreen(): void {
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
      dataUpdateTime: null
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
  notifcationScheduleManagerRefreshTimer_currentRequestID = generateIdentifier('r');
  // documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'true');
  const integration = await integrateNotifcationSchedules(notifcationScheduleManagerRefreshTimer_currentRequestID);
  updateNotificationScheduleManagerField(integration, false, playing_animation);
  notifcationScheduleManagerRefreshTimer_lastUpdate = new Date().getTime();
  if (notifcationScheduleManagerRefreshTimer_dynamic) {
    const updateRate = await getUpdateRate();
    notifcationScheduleManagerRefreshTimer_nextUpdate = Math.max(new Date().getTime() + notifcationScheduleManagerRefreshTimer_minInterval, integration.dataUpdateTime + notifcationScheduleManagerRefreshTimer_baseInterval / updateRate);
  } else {
    notifcationScheduleManagerRefreshTimer_nextUpdate = new Date().getTime() + notifcationScheduleManagerRefreshTimer_baseInterval;
  }
  notifcationScheduleManagerRefreshTimer_dynamicInterval = Math.max(notifcationScheduleManagerRefreshTimer_minInterval, notifcationScheduleManagerRefreshTimer_nextUpdate - new Date().getTime());
  notifcationScheduleManagerRefreshTimer_refreshing = false;
  // documentQuerySelector('.css_home_update_timer').setAttribute('refreshing', 'false');
}

async function streamNotificationScheduleManager() {
  refreshNotificationScheduleManager()
    .then(function () {
      if (notifcationScheduleManagerRefreshTimer_streaming) {
        notifcationScheduleManagerRefreshTimer_timer = setTimeout(function () {
          streamNotificationScheduleManager();
        }, Math.max(notifcationScheduleManagerRefreshTimer_minInterval, notifcationScheduleManagerRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        notifcationScheduleManagerRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (notifcationScheduleManagerRefreshTimer_streaming) {
        notifcationScheduleManagerRefreshTimer_timer = setTimeout(function () {
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
  if (!notifcationScheduleManagerRefreshTimer_streaming) {
    notifcationScheduleManagerRefreshTimer_streaming = true;
    if (!notifcationScheduleManagerRefreshTimer_streamStarted) {
      notifcationScheduleManagerRefreshTimer_streamStarted = true;
      streamNotificationScheduleManager();
    } else {
      refreshNotificationScheduleManager();
    }
    updateUpdateTimer();
  }
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
    const itemElement = elementQuerySelector(NotificationScheduleList, `.css_notification_schedule_manager_item#${identifier}`);
    itemElement.remove();
    promptMessage('已取消通知', 'check_circle');
  } else {
    promptMessage('取消失敗', 'error');
  }
}

import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { cancelNotification } from '../../data/notification/apis/cancelNotification/index';
import { IntegratedNotificationScheduleItem, IntegratedNotificationSchedules, integrateNotifcationSchedules, NotificationSchedule } from '../../data/notification/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { booleanToString, hasOwnProperty } from '../../tools/index';
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

/**
 * div.css_notification_schedule_manager_item(n) in div.css_notification_schedule_manager_notification_schedule_list(1)
 */
const itemElements: Array<HTMLElement> = [];

let previousIntegration = {} as IntegratedNotificationSchedules;
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

const notifcationScheduleManagerTick = new Tick(refreshNotificationScheduleManager, 15 * 1000);
const notificationTickRetryInterval = 10 * 1000;

function animateUpdateTimer(interval: number): void {
  NotificationScheduleManagerUpdateTimerElement.style.setProperty('--b-cssvar-notification-schedule-manager-update-timer-interval', `${interval}ms`);
  NotificationScheduleManagerUpdateTimerElement.classList.add('css_notification_schedule_manager_update_timer_scale_down');
}

function generateElementOfItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_notification_schedule_manager_item');

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_notification_schedule_manager_item_head');

  // Context
  const contextElement = documentCreateDivElement();
  contextElement.classList.add('css_notification_schedule_manager_item_context');
  headElement.appendChild(contextElement);

  // Main
  const mainElement = documentCreateDivElement();
  mainElement.classList.add('css_notification_schedule_manager_item_main');
  headElement.appendChild(mainElement);

  // Time
  const timeElement = documentCreateDivElement();
  timeElement.classList.add('css_notification_schedule_manager_item_time');
  headElement.appendChild(timeElement);

  element.appendChild(headElement);

  // Drawer
  const drawerElement = documentCreateDivElement();
  drawerElement.classList.add('css_notification_schedule_manager_item_drawer');

  // Button
  const buttonElement = documentCreateDivElement();
  buttonElement.classList.add('css_notification_schedule_manager_item_drawer_button');
  buttonElement.appendChild(getIconElement('close'));
  drawerElement.appendChild(buttonElement);

  element.appendChild(drawerElement);

  return element;
}

function updateNotificationScheduleManagerField(integration: IntegratedNotificationSchedules, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisItemElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem, previousItem: IntegratedNotificationScheduleItem | null): void {
    function updateTime(thisElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_notification_schedule_manager_item_head');
      const timeElement = elementQuerySelector(headElement, '.css_notification_schedule_manager_item_time');
      timeElement.textContent = `${thisItem.hours}:${thisItem.minutes}`;
    }

    function updateMain(thisElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_notification_schedule_manager_item_head');
      const mainElement = elementQuerySelector(headElement, '.css_notification_schedule_manager_item_main');
      mainElement.textContent = thisItem.name;
    }

    function updateContext(thisElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const headElement = elementQuerySelector(thisElement, '.css_notification_schedule_manager_item_head');
      const contextElement = elementQuerySelector(headElement, '.css_notification_schedule_manager_item_context');
      contextElement.textContent = `${thisItem.route.name} - 往${thisItem.route.direction}`;
    }

    function updateButton(thisElement: HTMLElement, thisItem: IntegratedNotificationScheduleItem): void {
      const drawerElement = elementQuerySelector(thisElement, '.css_notification_schedule_manager_item_drawer');
      const buttonElement = elementQuerySelector(drawerElement, '.css_notification_schedule_manager_item_drawer_button');
      buttonElement.onclick = function () {
        cancelNotificationOnNotificationScheduleManager(thisItemElement, thisItem.schedule_id);
      };
    }

    function updateAnimation(thisItemElement: HTMLElement, animation: boolean): void {
      thisItemElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisItemElement: HTMLElement, skeletonScreen: boolean): void {
      thisItemElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousItem === null || previousItem === undefined) {
      updateTime(thisItemElement, thisItem);
      updateMain(thisItemElement, thisItem);
      updateContext(thisItemElement, thisItem);
      updateButton(thisItemElement, thisItem);
      updateAnimation(thisItemElement, animation);
      updateSkeletonScreen(thisItemElement, skeletonScreen);
    } else {
      if (thisItem.hours !== previousItem.hours || thisItem.minutes !== previousItem.minutes) {
        updateTime(thisItemElement, thisItem);
      }

      if (previousItem.schedule_id !== thisItem.schedule_id) {
        updateTime(thisItemElement, thisItem);
        updateMain(thisItemElement, thisItem);
        updateContext(thisItemElement, thisItem);
        updateButton(thisItemElement, thisItem);
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

  const itemElementsLength = itemElements.length;
  if (itemQuantity !== itemElementsLength) {
    const difference = itemElementsLength - itemQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newItemElement = generateElementOfItem();
        fragment.appendChild(newItemElement);
        itemElements.push(newItemElement);
      }
      NotificationScheduleList.append(fragment);
    } else if (difference > 0) {
      for (let p = itemElementsLength - 1, q = itemElementsLength - difference - 1; p > q; p--) {
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
  previousAnimation = animation;
}

function setupNotificationScheduleManagerFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation');
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  const quantity: IntegratedNotificationSchedules['itemQuantity'] = Math.floor(FieldHeight / 50) + 5;
  let items: IntegratedNotificationSchedules['items'] = new Array(quantity).fill({
    name: '',
    stop_id: -1,
    estimate_time: 0,
    schedule_id: 'null',
    scheduled_time: 0,
    route: {
      name: '',
      direction: '',
      id: -1
    },
    date: '',
    hours: '',
    minutes: ''
  });
  // reuse the object (assume readonly)

  updateNotificationScheduleManagerField(
    {
      items: items,
      itemQuantity: quantity,
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

async function refreshNotificationScheduleManager(): Promise<number> {
  try {
    const playing_animation = getSettingOptionValue('playing_animation');
    const refresh_interval_setting = getSettingOptionValue('refresh_interval');
    NotificationScheduleManagerUpdateTimerElement.setAttribute('refreshing', 'true');
    NotificationScheduleManagerUpdateTimerElement.classList.remove('css_notification_schedule_manager_update_timer_scale_down');
    const integration = await integrateNotifcationSchedules(function (message) {
      NotificationScheduleManagerUpdateTimerElement.style.setProperty('--b-cssvar-notification-schedule-manager-update-timer-scale-x', message.percent.toString());
    });
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
    return interval;
  } catch (err) {
    promptMessage('error', `通知發生錯誤，將在${notificationTickRetryInterval / 1000}秒後重試。`);
    animateUpdateTimer(notificationTickRetryInterval);
    return notificationTickRetryInterval;
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
  switch (cancellation) {
    case false:
      promptMessage('error', '網路錯誤，請稍後再試');
      break;
    case 0:
      thisItemElement.remove();
      const index = itemElements.indexOf(thisItemElement);
      itemElements.splice(index, 1);
      promptMessage('check_circle', '已取消到站通知');
      // TODO: refresh
      break;
    case 1:
      promptMessage('error', '無效使用者');
      break;
    case 2:
      promptMessage('error', '無效到站通知');
      break;
    case 3:
      promptMessage('error', '未知使用者');
      break;
    case 4:
      promptMessage('error', '未知到站通知');
      break;
    case 5:
      promptMessage('error', '驗證錯誤');
      break;
    case 6:
      promptMessage('error', '無法取消已過期的到站通知');
      break;
    default:
      promptMessage('error', '未知錯誤');
      break;
  }
}

import { IntegratedRoute, integratedStopItem, integrateRoute } from '../../data/route/index';
import { getIconHTML } from '../icons/index';
import { getDataReceivingProgress } from '../../data/apis/loader';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { booleanToString, compareThings, generateIdentifier } from '../../tools/index';
import { getTextWidth } from '../../tools/graphic';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { isFolderContentSaved } from '../../data/folder/index';
import { GeneratedElement, pushPageHistory, closePreviousPage, openPreviousPage, GroupStyles, querySize } from '../index';
import { promptMessage } from '../prompt/index';
import { indexToDay, timeObjectToString } from '../../tools/time';
import { logRecentView } from '../../data/recent-views/index';
import { stopHasNotifcationSchedules } from '../../data/notification/index';

const RouteField = documentQuerySelector('.css_route_field');
const RouteHeadElement = elementQuerySelector(RouteField, '.css_route_head');
const RouteNameElement = elementQuerySelector(RouteHeadElement, '.css_route_name');
const RouteButtonRightElement = elementQuerySelector(RouteHeadElement, '.css_route_button_right');
const RouteUpdateTimerElement = elementQuerySelector(RouteHeadElement, '.css_route_update_timer_box .css_route_update_timer');
const RouteGroupTabsElement = elementQuerySelector(RouteHeadElement, '.css_route_group_tabs');
const RouteGroupTabsTrayElement = elementQuerySelector(RouteGroupTabsElement, '.css_route_group_tabs_tray');
const RouteGroupTabLineTrackElement = elementQuerySelector(RouteHeadElement, '.css_route_group_tab_line_track');
const RouteGroupTabLineElement = elementQuerySelector(RouteGroupTabLineTrackElement, '.css_route_group_tab_line');
const RouteGroupsElement = elementQuerySelector(RouteField, '.css_route_groups');

let previousIntegration = {} as IntegratedRoute;
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

let routeSliding_initialIndex: number = 0;
let routeSliding_targetIndex: number = 0;
let routeSliding_groupQuantity: number = 0;
let routeSliding_groupStyles: GroupStyles = {};
let routeSliding_fieldWidth: number = 0;
let routeSliding_fieldHeight: number = 0;
let routeSliding_sliding: boolean = false;

let routeRefreshTimer_retryInterval: number = 10 * 1000;
let routeRefreshTimer_baseInterval: number = 15 * 1000;
let routeRefreshTimer_minInterval: number = 5 * 1000;
let routeRefreshTimer_dynamicInterval: number = 15 * 1000;
let routeRefreshTimer_dynamic: boolean = true;
let routeRefreshTimer_streaming: boolean = false;
let routeRefreshTimer_lastUpdate: number = 0;
let routeRefreshTimer_nextUpdate: number = 0;
let routeRefreshTimer_refreshing: boolean = false;
let routeRefreshTimer_currentRequestID: string = '';
let routeRefreshTimer_currentProgress: number = -1;
let routeRefreshTimer_targetProgress: number = -1;
let routeRefreshTimer_streamStarted: boolean = false;
var routeRefreshTimer_timer: ReturnType<typeof setTimeout>;

let currentRouteIDSet_RouteID: number = 0;
let currentRouteIDSet_PathAttributeId: Array<number> = [];

let tabPadding: number = 20;

export function initializeRouteSliding(): void {
  RouteGroupsElement.addEventListener('touchstart', function () {
    routeSliding_initialIndex = Math.round(RouteGroupsElement.scrollLeft / routeSliding_fieldWidth);
  });

  RouteGroupsElement.addEventListener(
    'scroll',
    function (event: Event) {
      routeSliding_sliding = true;
      const target = event.target as HTMLElement;
      const currentIndex = target.scrollLeft / routeSliding_fieldWidth;
      if (currentIndex > routeSliding_initialIndex) {
        routeSliding_targetIndex = routeSliding_initialIndex + 1;
      } else {
        routeSliding_targetIndex = routeSliding_initialIndex - 1;
      }
      const initialSize = routeSliding_groupStyles[`g_${routeSliding_initialIndex}`] || { width: 0, offset: 0 };
      const targetSize = routeSliding_groupStyles[`g_${routeSliding_targetIndex}`] || { width: 0, offset: 0 };
      const tabWidth = initialSize.width + (targetSize.width - initialSize.width) * Math.abs(currentIndex - routeSliding_initialIndex);
      const offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * Math.abs(currentIndex - routeSliding_initialIndex)) * -1 + routeSliding_fieldWidth * 0.5 - tabWidth * 0.5;

      updateRouteCSS(routeSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);

      if (currentIndex === routeSliding_targetIndex) {
        routeSliding_initialIndex = Math.round(RouteGroupsElement.scrollLeft / routeSliding_fieldWidth);
        routeSliding_sliding = false;
      }
    },
    { passive: true }
  );
}

export function ResizeRouteField(): void {
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  RouteField.style.setProperty('--b-cssvar-route-field-width', `${FieldWidth}px`);
  RouteField.style.setProperty('--b-cssvar-route-field-height', `${FieldHeight}px`);
}

export function updateRouteCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  RouteField.style.setProperty('--b-cssvar-route-group-quantity', groupQuantity.toString());
  RouteGroupTabLineElement.style.setProperty('--b-cssvar-route-tab-line-width-scale', (tabLineWidth / 10).toString());
  RouteGroupTabsTrayElement.style.setProperty('--b-cssvar-route-tabs-tray-offset', `${offset.toFixed(5)}px`);
  RouteGroupTabsTrayElement.style.setProperty('--b-cssvar-route-percentage', percentage.toFixed(5));
}

function updateUpdateTimer(): void {
  const smoothingFactor = 0.1;
  const time = new Date().getTime();
  if (routeRefreshTimer_refreshing) {
    routeRefreshTimer_targetProgress = -1 + getDataReceivingProgress(routeRefreshTimer_currentRequestID);
    routeRefreshTimer_currentProgress += (routeRefreshTimer_targetProgress - routeRefreshTimer_currentProgress) * smoothingFactor;
  } else {
    routeRefreshTimer_targetProgress = -1 * Math.min(1, Math.max(0, Math.abs(time - routeRefreshTimer_lastUpdate) / routeRefreshTimer_dynamicInterval));
    routeRefreshTimer_currentProgress = routeRefreshTimer_targetProgress;
  }
  RouteUpdateTimerElement.style.setProperty('--b-cssvar-update-timer', routeRefreshTimer_currentProgress.toString());
  window.requestAnimationFrame(function () {
    if (routeRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfThreadBox(): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_route_group_thread_box');
  element.id = identifier;
  element.setAttribute('stretched', 'false');
  element.innerHTML = /*html*/ `<div class="css_route_group_thread"></div><div class="css_route_group_thread_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfItem(threadBoxIdentifier: string): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_route_group_item');
  element.id = identifier;
  element.setAttribute('stretched', 'false');
  element.innerHTML = /*html*/ `<div class="css_route_group_item_head"><div class="css_route_group_item_name"></div><div class="css_route_group_item_capsule"><div class="css_route_group_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_route_group_item_stretch" onclick="bus.route.stretchRouteItemBody('${identifier}', '${threadBoxIdentifier}')">${getIconHTML('keyboard_arrow_down')}</div><div class="css_route_group_item_capsule_separator"></div></div></div><div class="css_route_group_item_body" displayed="false"><div class="css_route_group_item_buttons"><div class="css_route_group_item_button" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab('${identifier}', 0)" code="0"><div class="css_route_group_item_button_icon">${getIconHTML('directions_bus')}</div>公車</div><div class="css_route_group_item_button" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab('${identifier}', 1)" code="1"><div class="css_route_group_item_button_icon">${getIconHTML('departure_board')}</div>抵達時間</div><div class="css_route_group_item_button" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab('${identifier}', 2)" code="2"><div class="css_route_group_item_button_icon">${getIconHTML('route')}</div>路線</div><div class="css_route_group_item_button" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder('stop-on-route', ['${identifier}', null, null])"><div class="css_route_group_item_button_icon">${getIconHTML('folder')}</div>儲存至資料夾</div><div class="css_route_group_item_button" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification('stop-on-route', ['${identifier}', null, null, null])" enabled="true"><div class="css_route_group_item_button_icon">${getIconHTML('notifications')}</div>設定到站通知</div></div><div class="css_route_group_item_buses" displayed="true"></div><div class="css_route_group_item_overlapping_routes" displayed="false"></div><div class="css_route_group_item_bus_arrival_times" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  var identifier = generateIdentifier('g');
  var element = document.createElement('div');
  element.classList.add('css_route_group');
  element.id = identifier;
  var tracksElement = document.createElement('div');
  tracksElement.classList.add('css_route_group_tracks');
  var threadTrackElement = document.createElement('div');
  threadTrackElement.classList.add('css_route_group_threads_track');
  var itemsTrackElement = document.createElement('div');
  itemsTrackElement.classList.add('css_route_group_items_track');
  tracksElement.appendChild(threadTrackElement);
  tracksElement.appendChild(itemsTrackElement);
  element.appendChild(tracksElement);
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfTab(): GeneratedElement {
  var identifier = generateIdentifier('t');
  var element = document.createElement('div');
  element.classList.add('css_route_group_tab');
  element.id = identifier;
  return {
    element: element,
    id: identifier
  };
}

function setUpRouteFieldSkeletonScreen(Field: HTMLElement): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  const defaultItemQuantity: number = Math.floor(FieldHeight / 50) + 5;
  const defaultGroupQuantity = 2;
  let groupedItems: IntegratedRoute['groupedItems'] = {};
  for (let i = 0; i < defaultGroupQuantity; i++) {
    const groupKey: string = `g_${i}`;
    groupedItems[groupKey] = [];
    for (let j = 0; j < defaultItemQuantity; j++) {
      groupedItems[groupKey].push({
        name: '',
        goBack: '0',
        status: { code: 8, text: '', time: -6 },
        buses: [],
        overlappingRoutes: [],
        busArrivalTimes: [],
        sequence: j,
        position: {
          longitude: 0,
          latitude: 0
        },
        nearest: false,
        progress: 0,
        segmentBuffer: {
          isSegmentBuffer: false,
          isStartingPoint: false,
          isEndingPoint: false
        },
        id: 0
      });
    }
  }
  updateRouteField(
    Field,
    {
      groupedItems: groupedItems,
      groupQuantity: defaultGroupQuantity,
      itemQuantity: {
        g_0: defaultItemQuantity,
        g_1: defaultItemQuantity
      },
      RouteName: '載入中',
      RouteEndPoints: {
        RouteDeparture: '載入中',
        RouteDestination: '載入中'
      },
      RouteID: 0,
      PathAttributeId: [],
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

function updateRouteField(Field: HTMLElement, integration: IntegratedRoute, skeletonScreen: boolean, animation: boolean) {
  function updateItem(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, previousItem: integratedStopItem | null): void {
    function updateStatus(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, animation: boolean): void {
      const thisItemElementRect = thisItemElement.getBoundingClientRect();
      const top = thisItemElementRect.top;
      const left = thisItemElementRect.left;
      const bottom = thisItemElementRect.bottom;
      const right = thisItemElementRect.right;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const thisThreadStatusElement = elementQuerySelector(thisThreadBoxElement, '.css_route_group_thread_status');
      const currentThreadSlideElement = elementQuerySelector(thisThreadStatusElement, '.css_current_slide');
      const nextThreadSlideElement = elementQuerySelector(thisThreadStatusElement, '.css_next_slide');

      const thisItemStatusElement = elementQuerySelector(thisItemElement, '.css_route_group_item_status');
      const currentItemSlideElement = elementQuerySelector(thisItemStatusElement, '.css_current_slide');
      const nextItemSlideElememt = elementQuerySelector(thisItemStatusElement, '.css_next_slide');

      nextThreadSlideElement.setAttribute('code', thisItem.status.code.toString());

      nextItemSlideElememt.setAttribute('code', thisItem.status.code.toString());
      nextItemSlideElememt.innerText = thisItem.status.text;

      if (animation && bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
        currentThreadSlideElement.addEventListener(
          'animationend',
          function () {
            currentThreadSlideElement.setAttribute('code', thisItem.status.code.toString());
            currentThreadSlideElement.classList.remove('css_slide_fade_out');
          },
          { once: true }
        );
        currentItemSlideElement.addEventListener(
          'animationend',
          function () {
            currentItemSlideElement.setAttribute('code', thisItem.status.code.toString());
            currentItemSlideElement.innerText = thisItem.status.text;
            currentItemSlideElement.classList.remove('css_slide_fade_out');
          },
          { once: true }
        );
        currentThreadSlideElement.classList.add('css_slide_fade_out');
        currentItemSlideElement.classList.add('css_slide_fade_out');
      } else {
        currentThreadSlideElement.setAttribute('code', thisItem.status.code.toString());

        currentItemSlideElement.setAttribute('code', thisItem.status.code.toString());
        currentItemSlideElement.innerText = thisItem.status.text;
      }
    }

    function updateSegmentBuffer(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem): void {
      thisItemElement.setAttribute('segment-buffer', booleanToString(thisItem.segmentBuffer.isSegmentBuffer));
      thisThreadBoxElement.setAttribute('segment-buffer', booleanToString(thisItem.segmentBuffer.isSegmentBuffer));
    }

    function updateName(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_name').innerText = thisItem.name;
    }

    function updateBuses(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_buses').innerHTML = thisItem.buses.length === 0 ? '<div class="css_route_group_item_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_route_group_item_bus" on-this-route="${bus.onThisRoute}"><div class="css_route_group_item_bus_title"><div class="css_route_group_item_bus_icon">${getIconHTML('directions_bus')}</div><div class="css_route_group_item_bus_car_number">${bus.carNumber}</div></div><div class="css_route_group_item_bus_attributes"><div class="css_route_group_item_bus_route">路線：${bus.RouteName}</div><div class="css_route_group_item_bus_car_status">狀態：${bus.status.text}</div><div class="css_route_group_item_bus_car_type">類型：${bus.type}</div></div></div>`).join('');
    }

    function updateOverlappingRoutes(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_overlapping_routes').innerHTML = thisItem.overlappingRoutes.length === 0 ? '<div class="css_route_group_item_overlapping_route_message">目前沒有路線可顯示</div>' : thisItem.overlappingRoutes.map((route) => `<div class="css_route_group_item_overlapping_route"><div class="css_route_group_item_overlapping_route_title"><div class="css_route_group_item_overlapping_route_icon">${getIconHTML('route')}</div><div class="css_route_group_item_overlapping_route_name">${route.name}</div></div><div class="css_route_group_item_overlapping_route_endpoints">${route.RouteEndPoints.html}</div><div class="css_route_group_item_overlapping_route_actions"><div class="css_route_group_item_overlapping_route_action_button" onclick="bus.route.switchRoute(${route.RouteID}, [${route.PathAttributeId.join(',')}])">查看路線</div><div class="css_route_group_item_overlapping_route_action_button" onclick="bus.folder.openSaveToFolder('route-on-route', [${route.RouteID}])">收藏路線</div></div></div>`).join('');
    }

    function updateBusArrivalTimes(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_bus_arrival_times').innerHTML = thisItem.busArrivalTimes.length === 0 ? '<div class="css_route_group_item_bus_arrival_message">目前沒有抵達時間可顯示</div>' : thisItem.busArrivalTimes.map((busArrivalTime) => `<div class="css_route_group_item_bus_arrival_time"><div class="css_route_group_item_bus_arrival_time_title"><div class="css_route_group_item_bus_arrival_time_icon">${getIconHTML('schedule')}</div><div class="css_route_group_item_bus_arrival_time_time">${busArrivalTime.time}</div></div><div class="css_route_group_item_bus_arrival_time_attributes"><div class="css_route_group_item_bus_arrival_time_personal_schedule_name">個人化行程：${busArrivalTime.personalSchedule.name}</div><div class="css_route_group_item_bus_arrival_time_personal_schedule_period">時段：${timeObjectToString(busArrivalTime.personalSchedule.period.start)} - ${timeObjectToString(busArrivalTime.personalSchedule.period.end)}</div><div class="css_route_group_item_bus_arrival_time_personal_schedule_days">重複：${busArrivalTime.personalSchedule.days.map((day) => indexToDay(day).name).join('、')}</div></div></div>`).join('');
    }

    function updateNearest(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem): void {
      thisItemElement.setAttribute('nearest', booleanToString(thisItem.nearest));
      thisThreadBoxElement.setAttribute('nearest', booleanToString(thisItem.nearest));
    }

    function updateThread(thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, previousItem: integratedStopItem | null, animation: boolean): void {
      const previousProgress = previousItem?.progress || 0;
      const thisProgress = thisItem?.progress || 0;
      const thisThreadElement = elementQuerySelector(thisThreadBoxElement, '.css_route_group_thread');
      if (animation && !(previousProgress === 0) && thisProgress === 0 && Math.abs(thisProgress - previousProgress) > 0) {
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-a', `${100}%`);
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-b', `${100}%`);
        thisThreadElement.addEventListener(
          'transitionend',
          function () {
            thisThreadElement.style.setProperty('--b-cssvar-thread-progress-a', `${0}%`);
            thisThreadElement.style.setProperty('--b-cssvar-thread-progress-b', `${0}%`);
          },
          { once: true }
        );
      } else {
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-a', `${0}%`);
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-b', `${thisProgress * 100}%`);
      }
    }

    function updateStretch(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        const thisItemBodyElement = elementQuerySelector(thisItemElement, '.css_route_group_item_body');
        thisItemBodyElement.setAttribute('displayed', 'false');
        thisItemElement.setAttribute('stretched', 'false');
        thisThreadBoxElement.setAttribute('stretched', 'false');
      }
    }

    function updateAnimation(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, animation: boolean): void {
      thisItemElement.setAttribute('animation', booleanToString(animation));
      thisThreadBoxElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, skeletonScreen: boolean): void {
      thisItemElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
      thisThreadBoxElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    function updateSaveToFolderButton(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const saveToFolderButtonElement = elementQuerySelector(thisItemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="save-to-folder"]');
      saveToFolderButtonElement.setAttribute('onclick', `bus.folder.openSaveToFolder('stop-on-route', ['${thisItemElement.id}', ${thisItem.id}, ${integration.RouteID}])`);
      isFolderContentSaved('stop', thisItem.id).then((e) => {
        saveToFolderButtonElement.setAttribute('highlighted', booleanToString(e));
      });
    }

    function updateScheduleNotificationButton(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const scheduleNotificationButtonElement = elementQuerySelector(thisItemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="schedule-notification"]');
      scheduleNotificationButtonElement.setAttribute('onclick', `bus.notification.openScheduleNotification('stop-on-route', ['${thisItemElement.id}', ${thisItem.id}, ${integration.RouteID}, ${thisItem.status.time}])`);
      const havingNotifcationSchedules = stopHasNotifcationSchedules(thisItem.id);
      scheduleNotificationButtonElement.setAttribute('highlighted', booleanToString(havingNotifcationSchedules));
    }

    if (previousItem === null) {
      updateStatus(thisItemElement, thisThreadBoxElement, thisItem, animation);
      updateName(thisItemElement, thisItem);
      updateBuses(thisItemElement, thisItem);
      updateOverlappingRoutes(thisItemElement, thisItem);
      updateBusArrivalTimes(thisItemElement, thisItem);
      updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
      updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      updateThread(thisThreadBoxElement, thisItem, previousItem, animation);
      updateStretch(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateAnimation(thisItemElement, thisThreadBoxElement, animation);
      updateSkeletonScreen(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSaveToFolderButton(thisItemElement, thisItem);
      updateScheduleNotificationButton(thisItemElement, thisItem);
    } else {
      if (!(thisItem.status.time === previousItem.status.time)) {
        updateStatus(thisItemElement, thisThreadBoxElement, thisItem, animation);
        updateScheduleNotificationButton(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.busArrivalTimes, thisItem.busArrivalTimes)) {
        updateBusArrivalTimes(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.segmentBuffer, thisItem.segmentBuffer)) {
        updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (!(previousItem.nearest === thisItem.nearest)) {
        updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (!(previousItem.progress === thisItem.progress)) {
        updateThread(thisThreadBoxElement, thisItem, previousItem, animation);
      }
      if (!(previousItem.id === thisItem.id)) {
        updateName(thisItemElement, thisItem);
        updateOverlappingRoutes(thisItemElement, thisItem);
        updateSaveToFolderButton(thisItemElement, thisItem);
        updateScheduleNotificationButton(thisItemElement, thisItem);
      }
      if (!(animation === previousAnimation)) {
        updateAnimation(thisItemElement, thisThreadBoxElement, animation);
      }
      if (!(skeletonScreen === previousSkeletonScreen)) {
        updateStretch(thisItemElement, thisThreadBoxElement, skeletonScreen);
        updateSkeletonScreen(thisItemElement, thisThreadBoxElement, skeletonScreen);
      }
    }
  }

  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;

  const groupQuantity = integration.groupQuantity;
  const itemQuantity = integration.itemQuantity;
  const groupedItems = integration.groupedItems;

  routeSliding_groupQuantity = groupQuantity;
  routeSliding_fieldWidth = FieldWidth;
  routeSliding_fieldHeight = FieldHeight;

  let cumulativeOffset = 0;
  for (let i = 0; i < groupQuantity; i++) {
    const width = getTextWidth([integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `往${e}`)[i], 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
    routeSliding_groupStyles[`g_${i}`] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  const offset = routeSliding_groupStyles[`g_${routeSliding_initialIndex}`].offset * -1 + routeSliding_fieldWidth * 0.5 - routeSliding_groupStyles[`g_${routeSliding_initialIndex}`].width * 0.5;
  if (!routeSliding_sliding) {
    updateRouteCSS(routeSliding_groupQuantity, offset, routeSliding_groupStyles[`g_${routeSliding_initialIndex}`].width - tabPadding, routeSliding_initialIndex);
  }

  RouteNameElement.innerHTML = /*html*/ `<span>${integration.RouteName}</span>`;
  RouteNameElement.setAttribute('animation', booleanToString(animation));
  RouteNameElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  RouteGroupTabsElement.setAttribute('animation', booleanToString(animation));
  RouteGroupTabsElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  RouteGroupTabLineTrackElement.setAttribute('animation', booleanToString(animation));
  RouteGroupTabLineTrackElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));

  RouteButtonRightElement.setAttribute('onclick', `bus.route.openRouteDetails(${integration.RouteID}, [${integration.PathAttributeId.join(',')}])`);

  const currentGroupSeatQuantity = elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    const capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newGroupElement = generateElementOfGroup();
        RouteGroupsElement.appendChild(newGroupElement.element);
        const newTabElement = generateElementOfTab();
        RouteGroupTabsTrayElement.appendChild(newTabElement.element);
      }
    } else {
      const GroupElements = elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`);
      const TabElements = elementQuerySelectorAll(Field, `.css_route_head .css_route_group_tabs .css_route_group_tabs_tray .css_route_group_tab`);
      for (let o = 0; o < Math.abs(capacity); o++) {
        const groupIndex = currentGroupSeatQuantity - 1 - o;
        GroupElements[groupIndex].remove();
        TabElements[groupIndex].remove();
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track'), `.css_route_group_item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      const capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        const RouteGroupItemsTrackElement = elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track');
        const RouteGroupThreadsTrackElement = elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_threads_track');
        for (let o = 0; o < Math.abs(capacity); o++) {
          const newThreadBoxElement = generateElementOfThreadBox();
          const newItemElement = generateElementOfItem(newThreadBoxElement.id);
          RouteGroupItemsTrackElement.appendChild(newItemElement.element);
          RouteGroupThreadsTrackElement.appendChild(newThreadBoxElement.element);
        }
      } else {
        const RouteGroupItemElements = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track'), `.css_route_group_item`);
        const RouteGroupThreadElements = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_threads_track'), `.css_route_group_thread_box`);
        for (let o = 0; o < Math.abs(capacity); o++) {
          const itemIndex = currentItemSeatQuantity - 1 - o;
          RouteGroupItemElements[itemIndex].remove();
          RouteGroupThreadElements[itemIndex].remove();
        }
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const thisTabElement = elementQuerySelectorAll(Field, `.css_route_head .css_route_group_tabs .css_route_group_tabs_tray .css_route_group_tab`)[i];
    thisTabElement.innerHTML = [integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    thisTabElement.style.setProperty('--b-cssvar-route-tab-width', `${routeSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-route-tab-index', `${i}`);

    const RouteGroupItemElements = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track'), `.css_route_group_item`);
    const RouteGroupThreadElements = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_threads_track'), `.css_route_group_thread_box`);
    for (let j = 0; j < itemQuantity[groupKey]; j++) {
      const thisItemElement = RouteGroupItemElements[j];
      const thisThreadBoxElement = RouteGroupThreadElements[j];
      const thisItem = groupedItems[groupKey][j];
      if (previousIntegration.hasOwnProperty('groupedItems')) {
        if (previousIntegration.groupedItems.hasOwnProperty(groupKey)) {
          if (previousIntegration.groupedItems[groupKey][j]) {
            const previousItem = previousIntegration.groupedItems[groupKey][j];
            updateItem(thisItemElement, thisThreadBoxElement, thisItem, previousItem);
          } else {
            updateItem(thisItemElement, thisThreadBoxElement, thisItem, null);
          }
        } else {
          updateItem(thisItemElement, thisThreadBoxElement, thisItem, null);
        }
      } else {
        updateItem(thisItemElement, thisThreadBoxElement, thisItem, null);
      }
    }
  }

  previousIntegration = integration;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

async function refreshRoute() {
  const t = new Date().getTime();
  console.log(0, new Date().getTime() - t);
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  routeRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  routeRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  routeRefreshTimer_refreshing = true;
  routeRefreshTimer_currentRequestID = generateIdentifier('r');
  RouteUpdateTimerElement.setAttribute('refreshing', 'true');
  const integration = await integrateRoute(currentRouteIDSet_RouteID, currentRouteIDSet_PathAttributeId, routeRefreshTimer_currentRequestID);
  console.log(1, new Date().getTime() - t);

  updateRouteField(RouteField, integration, false, playing_animation);
  console.log(2, new Date().getTime() - t);
  let updateRate = 0;
  if (routeRefreshTimer_dynamic) {
    updateRate = await getUpdateRate();
  }
  console.log(3, new Date().getTime() - t);
  routeRefreshTimer_lastUpdate = new Date().getTime();
  if (routeRefreshTimer_dynamic) {
    routeRefreshTimer_nextUpdate = Math.max(routeRefreshTimer_lastUpdate + routeRefreshTimer_minInterval, integration.dataUpdateTime + routeRefreshTimer_baseInterval / updateRate);
  } else {
    routeRefreshTimer_nextUpdate = routeRefreshTimer_lastUpdate + routeRefreshTimer_baseInterval;
  }
  routeRefreshTimer_dynamicInterval = Math.max(routeRefreshTimer_minInterval, routeRefreshTimer_nextUpdate - routeRefreshTimer_lastUpdate);
  routeRefreshTimer_refreshing = false;
  RouteUpdateTimerElement.setAttribute('refreshing', 'false');
  console.log(4, new Date().getTime() - t);
}

export function streamRoute(): void {
  refreshRoute()
    .then(function () {
      if (routeRefreshTimer_streaming) {
        routeRefreshTimer_timer = setTimeout(function () {
          streamRoute();
        }, Math.max(routeRefreshTimer_minInterval, routeRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        routeRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (routeRefreshTimer_streaming) {
        promptMessage(`（路線）發生網路錯誤，將在${routeRefreshTimer_retryInterval / 1000}秒後重試。`, 'error');
        routeRefreshTimer_timer = setTimeout(function () {
          streamRoute();
        }, routeRefreshTimer_retryInterval);
      } else {
        routeRefreshTimer_streamStarted = false;
      }
    });
}

export function openRoute(RouteID: number, PathAttributeId: Array<number>): void {
  pushPageHistory('Route');
  logRecentView('route', RouteID);
  currentRouteIDSet_RouteID = RouteID;
  currentRouteIDSet_PathAttributeId = PathAttributeId;
  routeSliding_initialIndex = 0;
  RouteField.setAttribute('displayed', 'true');
  elementQuerySelector(RouteField, '.css_route_groups').scrollLeft = 0;
  setUpRouteFieldSkeletonScreen(RouteField);
  if (!routeRefreshTimer_streaming) {
    routeRefreshTimer_streaming = true;
    if (!routeRefreshTimer_streamStarted) {
      routeRefreshTimer_streamStarted = true;
      streamRoute();
    } else {
      refreshRoute();
    }
    routeRefreshTimer_currentProgress = -1;
    routeRefreshTimer_targetProgress = -1;
    updateUpdateTimer();
  }
  closePreviousPage();
}

export function closeRoute(): void {
  // revokePageHistory('Route');
  RouteField.setAttribute('displayed', 'false');
  routeRefreshTimer_streaming = false;
  routeRefreshTimer_currentProgress = -1;
  routeRefreshTimer_targetProgress = -1;
  openPreviousPage();
}

export function switchRoute(RouteID: number, PathAttributeId: Array<number>): void {
  routeRefreshTimer_streaming = false;
  routeRefreshTimer_currentProgress = -1;
  routeRefreshTimer_targetProgress = -1;
  openRoute(RouteID, PathAttributeId);
}

export function stretchRouteItemBody(itemElementID: string, threadBoxElementID: string): void {
  const itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_route_group_items_track .css_route_group_item#${itemElementID}`);
  const itemBodyElement = elementQuerySelector(itemElement, '.css_route_group_item_body');
  const threadBoxElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_route_group_threads_track .css_route_group_thread_box#${threadBoxElementID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    if (itemElement.getAttribute('animation') === 'true') {
      itemBodyElement.addEventListener(
        'transitionend',
        function () {
          itemBodyElement.setAttribute('displayed', 'false');
        },
        { once: true }
      );
    } else {
      itemBodyElement.setAttribute('displayed', 'false');
    }
    itemElement.setAttribute('stretched', 'false');
    threadBoxElement.setAttribute('stretched', 'false');
  } else {
    itemBodyElement.setAttribute('displayed', 'true');
    itemElement.setAttribute('stretched', 'true');
    threadBoxElement.setAttribute('stretched', 'true');
  }
}

export function switchRouteBodyTab(itemID: string, tabCode: number): void {
  const itemElement = elementQuerySelector(RouteGroupsElement, `.css_route_group_item#${itemID}`);
  const buttons = elementQuerySelector(itemElement, '.css_route_group_item_buttons');
  const button = elementQuerySelectorAll(buttons, '.css_route_group_item_button[highlighted="true"][type="tab"]');
  for (const t of button) {
    t.setAttribute('highlighted', 'false');
  }
  elementQuerySelector(buttons, `.css_route_group_item_button[code="${tabCode}"]`).setAttribute('highlighted', 'true');
  switch (tabCode) {
    case 0:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      break;
    case 1:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'true');
      break;
    case 2:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      break;
    default:
      break;
  }
}

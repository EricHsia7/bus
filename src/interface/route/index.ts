import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { DataReceivingProgressEvent } from '../../data/apis/loader';
import { isFolderContentSaved } from '../../data/folder/index';
import { stopHasNotifcationSchedules } from '../../data/notification/index';
import { logRecentView } from '../../data/recent-views/index';
import { IntegratedRoute, integratedStopItem, integrateRoute } from '../../data/route/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll, getElementsBelow } from '../../tools/elements';
import { getTextWidth } from '../../tools/graphic';
import { booleanToString, compareThings, generateIdentifier } from '../../tools/index';
import { indexToDay, timeObjectToString } from '../../tools/time';
import { getIconElement, getIconHTML } from '../icons/index';
import { closePreviousPage, GeneratedElement, GroupStyles, openPreviousPage, pushPageHistory, querySize } from '../index';
import { promptMessage } from '../prompt/index';
import { openSaveToFolder } from '../save-to-folder/index';
import { openScheduleNotification } from '../schedule-notification/index';
import { openRouteDetails } from './details/index';

const RouteField = documentQuerySelector('.css_route_field');
const RouteHeadElement = elementQuerySelector(RouteField, '.css_route_head');
const RouteNameElement = elementQuerySelector(RouteHeadElement, '.css_route_name');
const RouteNameSpanElement = elementQuerySelector(RouteNameElement, 'span');
const RouteButtonRightElement = elementQuerySelector(RouteHeadElement, '.css_route_button_right');
const RouteUpdateTimerElement = elementQuerySelector(RouteHeadElement, '.css_route_update_timer_box .css_route_update_timer');
const RouteGroupTabsElement = elementQuerySelector(RouteHeadElement, '.css_route_group_tabs');
const RouteGroupTabsTrayElement = elementQuerySelector(RouteGroupTabsElement, '.css_route_group_tabs_tray');
const RouteGroupTabLineTrackElement = elementQuerySelector(RouteHeadElement, '.css_route_group_tab_line_track');
const RouteGroupTabLineElement = elementQuerySelector(RouteGroupTabLineTrackElement, '.css_route_group_tab_line');
const RouteGroupsElement = elementQuerySelector(RouteField, '.css_route_groups');

let previousIntegration = {} as IntegratedRoute;
let previousAnimation: boolean = false;
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
let routeRefreshTimer_lastUpdate: number = 0;
let routeRefreshTimer_nextUpdate: number = 0;
let routeRefreshTimer_currentRequestID: string = '';
let routeRefreshTimer_refreshing: boolean = false;
let routeRefreshTimer_streaming: boolean = false;
let routeRefreshTimer_streamStarted: boolean = false;

let currentRouteIDSet_RouteID: number = 0;
let currentRouteIDSet_PathAttributeId: Array<number> = [];

let tabPadding: number = 20;

export function initializeRouteSliding(): void {
  RouteGroupsElement.addEventListener(
    'touchstart',
    function () {
      routeSliding_initialIndex = Math.round(RouteGroupsElement.scrollLeft / routeSliding_fieldWidth);
    },
    { passive: true }
  );

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
      const indexDifference = currentIndex - routeSliding_initialIndex;
      let delta = Math.abs(indexDifference);
      if (delta > 1) {
        if (indexDifference > 0) {
          routeSliding_initialIndex = Math.floor(currentIndex);
          routeSliding_targetIndex = routeSliding_initialIndex + 1;
        } else {
          routeSliding_initialIndex = Math.ceil(currentIndex);
          routeSliding_targetIndex = routeSliding_initialIndex - 1;
        }
        delta = Math.abs(currentIndex - routeSliding_initialIndex);
      }
      const initialSize = routeSliding_groupStyles[`g_${routeSliding_initialIndex}`] || { width: 0, offset: 0 };
      const targetSize = routeSliding_groupStyles[`g_${routeSliding_targetIndex}`] || { width: 0, offset: 0 };
      const tabWidth = initialSize.width + (targetSize.width - initialSize.width) * delta;
      const offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * delta) * -1 + routeSliding_fieldWidth * 0.5 - tabWidth * 0.5;
      updateRouteCSS(routeSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);
      if (currentIndex === routeSliding_targetIndex) {
        routeSliding_initialIndex = Math.round(RouteGroupsElement.scrollLeft / routeSliding_fieldWidth);
        routeSliding_sliding = false;
      }
    },
    { passive: true }
  );
}

export function updateRouteCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  RouteGroupsElement.style.setProperty('--b-cssvar-route-group-quantity', groupQuantity.toString());
  RouteGroupTabLineElement.style.setProperty('--b-cssvar-route-tab-line-width-scale', tabLineWidth.toString());
  RouteGroupTabsTrayElement.style.setProperty('--b-cssvar-route-tabs-tray-offset', `${offset.toString()}px`);
  RouteGroupTabsTrayElement.style.setProperty('--b-cssvar-route-percentage', percentage.toString());
}

function animateUpdateTimer(): void {
  RouteUpdateTimerElement.style.setProperty('--b-cssvar-route-update-timer-interval', `${routeRefreshTimer_dynamicInterval}ms`);
  RouteUpdateTimerElement.classList.add('css_route_update_timer_slide_rtl');
}

function handleDataReceivingProgressUpdates(event: Event): void {
  const CustomEvent = event as DataReceivingProgressEvent;
  if (routeRefreshTimer_refreshing) {
    const offsetRatio = CustomEvent.detail.progress - 1;
    RouteUpdateTimerElement.style.setProperty('--b-cssvar-route-update-timer-offset-ratio', offsetRatio.toString());
  }
  if (CustomEvent.detail.stage === 'end') {
    document.removeEventListener(CustomEvent.detail.target, handleDataReceivingProgressUpdates);
  }
}

function generateElementOfThreadBox(): GeneratedElement {
  const identifier = generateIdentifier();

  // Main thread box element
  const threadBoxElement = document.createElement('div');
  threadBoxElement.classList.add('css_route_group_thread_box');
  threadBoxElement.id = identifier;
  threadBoxElement.setAttribute('stretched', 'false');
  threadBoxElement.setAttribute('stretching', 'false');
  threadBoxElement.setAttribute('push-direction', '0'); // 0: normal state, 1: downward, 2: upward
  threadBoxElement.setAttribute('push-state', '0'); // 0: normal state, 1: compensation , 2: transition

  // Thread container
  const threadElement = document.createElement('div');
  threadElement.classList.add('css_route_group_thread');

  // Thread progress
  const threadProgressElement = document.createElement('div');
  threadProgressElement.classList.add('css_route_group_thread_progress');
  threadProgressElement.setAttribute('displayed', 'false');
  threadElement.appendChild(threadProgressElement);

  // Thread status container
  const threadStatusElement = document.createElement('div');
  threadStatusElement.classList.add('css_route_group_thread_status');

  // Next slide
  const nextSlideElement = document.createElement('div');
  nextSlideElement.classList.add('css_next_slide');
  nextSlideElement.setAttribute('code', '0');
  nextSlideElement.setAttribute('displayed', 'false');
  threadStatusElement.appendChild(nextSlideElement);

  // Current slide
  const currentSlideElement = document.createElement('div');
  currentSlideElement.classList.add('css_current_slide');
  currentSlideElement.setAttribute('code', '0');
  currentSlideElement.setAttribute('displayed', 'true');
  threadStatusElement.appendChild(currentSlideElement);

  // Assemble
  threadBoxElement.appendChild(threadElement);
  threadBoxElement.appendChild(threadStatusElement);

  return {
    element: threadBoxElement,
    id: identifier
  };
}

function generateElementOfItem(threadBoxIdentifier: string): GeneratedElement {
  const identifier = generateIdentifier();

  // Main item element
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_route_group_item');
  itemElement.id = identifier;
  itemElement.setAttribute('stretched', 'false');
  itemElement.setAttribute('stretching', 'false');
  itemElement.setAttribute('push-direction', '0'); // 0: normal state, 1: downward, 2: upward
  itemElement.setAttribute('push-state', '0'); // 0: normal state, 1: compensation , 2: transition

  // Head
  const headElement = document.createElement('div');
  headElement.classList.add('css_route_group_item_head');

  // Name
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_route_group_item_name');
  headElement.appendChild(nameElement);

  // Capsule
  const capsuleElement = document.createElement('div');
  capsuleElement.classList.add('css_route_group_item_capsule');

  // Status
  const statusElement = document.createElement('div');
  statusElement.classList.add('css_route_group_item_status');

  const nextSlideElement = document.createElement('div');
  nextSlideElement.classList.add('css_next_slide');
  nextSlideElement.setAttribute('code', '0');
  nextSlideElement.setAttribute('displayed', 'false');
  statusElement.appendChild(nextSlideElement);

  const currentSlideElement = document.createElement('div');
  currentSlideElement.classList.add('css_current_slide');
  currentSlideElement.setAttribute('code', '0');
  currentSlideElement.setAttribute('displayed', 'true');
  statusElement.appendChild(currentSlideElement);

  capsuleElement.appendChild(statusElement);

  // Stretch button
  const stretchElement = document.createElement('div');
  stretchElement.classList.add('css_route_group_item_stretch');
  stretchElement.appendChild(getIconElement('keyboard_arrow_down'));
  stretchElement.onclick = () => {
    stretchRouteItem(identifier, threadBoxIdentifier);
  };
  capsuleElement.appendChild(stretchElement);

  // Capsule separator
  const capsuleSeparatorElement = document.createElement('div');
  capsuleSeparatorElement.classList.add('css_route_group_item_capsule_separator');
  capsuleElement.appendChild(capsuleSeparatorElement);

  headElement.appendChild(capsuleElement);

  // Body
  const bodyElement = document.createElement('div');
  bodyElement.classList.add('css_route_group_item_body');
  bodyElement.setAttribute('displayed', 'false');

  // Buttons
  const buttonsElement = document.createElement('div');
  buttonsElement.classList.add('css_route_group_item_buttons');

  // Tab: 公車
  const tabBusElement = document.createElement('div');
  tabBusElement.classList.add('css_route_group_item_button');
  tabBusElement.setAttribute('highlighted', 'true');
  tabBusElement.setAttribute('type', 'tab');
  tabBusElement.setAttribute('code', '0');
  tabBusElement.onclick = () => {
    switchRouteBodyTab(identifier, 0);
  };

  const tabBusIconElement = document.createElement('div');
  tabBusIconElement.classList.add('css_route_group_item_button_icon');
  tabBusIconElement.appendChild(getIconElement('directions_bus'));
  tabBusElement.appendChild(tabBusIconElement);
  tabBusElement.appendChild(document.createTextNode('公車'));
  buttonsElement.appendChild(tabBusElement);

  // Tab: 抵達時間
  const tabArrivalElement = document.createElement('div');
  tabArrivalElement.classList.add('css_route_group_item_button');
  tabArrivalElement.setAttribute('highlighted', 'false');
  tabArrivalElement.setAttribute('type', 'tab');
  tabArrivalElement.setAttribute('code', '1');
  tabArrivalElement.onclick = () => {
    switchRouteBodyTab(identifier, 1);
  };

  const tabArrivalIconElement = document.createElement('div');
  tabArrivalIconElement.classList.add('css_route_group_item_button_icon');
  tabArrivalIconElement.appendChild(getIconElement('departure_board'));
  tabArrivalElement.appendChild(tabArrivalIconElement);
  tabArrivalElement.appendChild(document.createTextNode('抵達時間'));
  buttonsElement.appendChild(tabArrivalElement);

  // Tab: 路線
  const tabRouteElement = document.createElement('div');
  tabRouteElement.classList.add('css_route_group_item_button');
  tabRouteElement.setAttribute('highlighted', 'false');
  tabRouteElement.setAttribute('type', 'tab');
  tabRouteElement.setAttribute('code', '2');
  tabRouteElement.onclick = () => {
    switchRouteBodyTab(identifier, 2);
  };

  const tabRouteIconElement = document.createElement('div');
  tabRouteIconElement.classList.add('css_route_group_item_button_icon');
  tabRouteIconElement.appendChild(getIconElement('route'));
  tabRouteElement.appendChild(tabRouteIconElement);
  tabRouteElement.appendChild(document.createTextNode('路線'));
  buttonsElement.appendChild(tabRouteElement);

  // Tab: 地點
  const tabLocationElement = document.createElement('div');
  tabLocationElement.classList.add('css_route_group_item_button');
  tabLocationElement.setAttribute('highlighted', 'false');
  tabLocationElement.setAttribute('type', 'tab');
  tabLocationElement.setAttribute('code', '3');
  tabLocationElement.onclick = () => {
    switchRouteBodyTab(identifier, 3);
  };

  const tabLocationIconElement = document.createElement('div');
  tabLocationIconElement.classList.add('css_route_group_item_button_icon');
  tabLocationIconElement.appendChild(getIconElement('location_on'));
  tabLocationElement.appendChild(tabLocationIconElement);
  tabLocationElement.appendChild(document.createTextNode('地點'));
  buttonsElement.appendChild(tabLocationElement);

  // Save to folder
  const saveToFolderElement = document.createElement('div');
  saveToFolderElement.classList.add('css_route_group_item_button');
  saveToFolderElement.setAttribute('highlighted', 'false');
  saveToFolderElement.setAttribute('type', 'save-to-folder');
  /*
  saveToFolderElement.onclick = () => {
    openSaveToFolder('stop-on-route', [identifier, null, null]);
  };
  */

  const saveToFolderIconElement = document.createElement('div');
  saveToFolderIconElement.classList.add('css_route_group_item_button_icon');
  saveToFolderIconElement.appendChild(getIconElement('folder'));
  saveToFolderElement.appendChild(saveToFolderIconElement);
  saveToFolderElement.appendChild(document.createTextNode('儲存'));
  buttonsElement.appendChild(saveToFolderElement);

  // Schedule notification
  const scheduleNotificationElement = document.createElement('div');
  scheduleNotificationElement.classList.add('css_route_group_item_button');
  scheduleNotificationElement.setAttribute('highlighted', 'false');
  scheduleNotificationElement.setAttribute('type', 'schedule-notification');
  scheduleNotificationElement.setAttribute('enabled', 'true');

  const scheduleNotificationIconElement = document.createElement('div');
  scheduleNotificationIconElement.classList.add('css_route_group_item_button_icon');
  scheduleNotificationIconElement.appendChild(getIconElement('notifications'));
  scheduleNotificationElement.appendChild(scheduleNotificationIconElement);
  scheduleNotificationElement.appendChild(document.createTextNode('通知'));
  buttonsElement.appendChild(scheduleNotificationElement);

  bodyElement.appendChild(buttonsElement);

  // Buses
  const busesElement = document.createElement('div');
  busesElement.classList.add('css_route_group_item_buses');
  busesElement.setAttribute('displayed', 'true');
  bodyElement.appendChild(busesElement);

  // Overlapping routes
  const overlappingRoutesElement = document.createElement('div');
  overlappingRoutesElement.classList.add('css_route_group_item_overlapping_routes');
  overlappingRoutesElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(overlappingRoutesElement);

  // Bus arrival times
  const busArrivalTimesElement = document.createElement('div');
  busArrivalTimesElement.classList.add('css_route_group_item_bus_arrival_times');
  busArrivalTimesElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(busArrivalTimesElement);

  // Nearby locations
  const nearbyLocationsElement = document.createElement('div');
  nearbyLocationsElement.classList.add('css_route_group_item_nearby_locations');
  nearbyLocationsElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(nearbyLocationsElement);

  // Assemble
  itemElement.appendChild(headElement);
  itemElement.appendChild(bodyElement);

  return {
    element: itemElement,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_route_group');

  const tracksElement = document.createElement('div');
  tracksElement.classList.add('css_route_group_tracks');

  const threadTrackElement = document.createElement('div');
  threadTrackElement.classList.add('css_route_group_threads_track');

  const threadBoxSpace = document.createElement('div');
  threadBoxSpace.classList.add('css_route_group_thread_box_space_top');

  const itemsTrackElement = document.createElement('div');
  itemsTrackElement.classList.add('css_route_group_items_track');

  const itemSpaceElement = document.createElement('div');
  itemSpaceElement.classList.add('css_route_group_item_space_top');

  itemsTrackElement.appendChild(itemSpaceElement);
  threadTrackElement.appendChild(threadBoxSpace);
  tracksElement.appendChild(threadTrackElement);
  tracksElement.appendChild(itemsTrackElement);
  element.appendChild(tracksElement);
  return {
    element: element,
    id: ''
  };
}

function generateElementOfTab(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_route_group_tab');
  return {
    element: element,
    id: ''
  };
}

function setUpRouteFieldSkeletonScreen(RouteID: IntegratedRoute['RouteID'], PathAttributeId: IntegratedRoute['PathAttributeId']): void {
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
        nearbyLocations: [],
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
      RouteID: RouteID,
      PathAttributeId: PathAttributeId,
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

function updateRouteField(integration: IntegratedRoute, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, previousItem: integratedStopItem | null, skeletonScreen: boolean, animation: boolean): void {
    function updateStatus(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, skeletonScreen: boolean, animation: boolean): void {
      const thisThreadStatusElement = elementQuerySelector(thisThreadBoxElement, '.css_route_group_thread_status');
      const currentThreadSlideElement = elementQuerySelector(thisThreadStatusElement, '.css_current_slide');
      const nextThreadSlideElement = elementQuerySelector(thisThreadStatusElement, '.css_next_slide');

      const thisItemStatusElement = elementQuerySelector(thisItemElement, '.css_route_group_item_status');
      const currentItemSlideElement = elementQuerySelector(thisItemStatusElement, '.css_current_slide');
      const nextItemSlideElement = elementQuerySelector(thisItemStatusElement, '.css_next_slide');

      nextThreadSlideElement.setAttribute('code', thisItem.status.code.toString());

      nextItemSlideElement.setAttribute('code', thisItem.status.code.toString());
      nextItemSlideElement.innerText = thisItem.status.text;

      if (!skeletonScreen) {
        if (animation) {
          const thisItemElementRect = thisItemElement.getBoundingClientRect();
          const top = thisItemElementRect.top;
          const left = thisItemElementRect.left;
          const bottom = thisItemElementRect.bottom;
          const right = thisItemElementRect.right;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          if (bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
            currentThreadSlideElement.addEventListener(
              'animationend',
              function () {
                currentThreadSlideElement.setAttribute('code', thisItem.status.code.toString());
                currentThreadSlideElement.classList.remove('css_slide_fade_out');
                nextThreadSlideElement.setAttribute('displayed', 'false');
              },
              { once: true }
            );
            currentItemSlideElement.addEventListener(
              'animationend',
              function () {
                currentItemSlideElement.setAttribute('code', thisItem.status.code.toString());
                currentItemSlideElement.innerText = thisItem.status.text;
                currentItemSlideElement.classList.remove('css_slide_fade_out');
                nextItemSlideElement.setAttribute('displayed', 'false');
              },
              { once: true }
            );
            nextItemSlideElement.setAttribute('displayed', 'true');
            nextThreadSlideElement.setAttribute('displayed', 'true');
            currentThreadSlideElement.classList.add('css_slide_fade_out');
            currentItemSlideElement.classList.add('css_slide_fade_out');
            return;
          }
        }
      }

      currentThreadSlideElement.setAttribute('code', thisItem.status.code.toString());
      currentItemSlideElement.setAttribute('code', thisItem.status.code.toString());
      currentItemSlideElement.innerText = thisItem.status.text;
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
      elementQuerySelector(thisItemElement, '.css_route_group_item_overlapping_routes').innerHTML = thisItem.overlappingRoutes.length === 0 ? '<div class="css_route_group_item_overlapping_route_message">目前沒有路線可顯示</div>' : thisItem.overlappingRoutes.map((route) => `<div class="css_route_group_item_overlapping_route"><div class="css_route_group_item_overlapping_route_title"><div class="css_route_group_item_overlapping_route_icon">${getIconHTML('route')}</div><div class="css_route_group_item_overlapping_route_name">${route.name}</div></div><div class="css_route_group_item_overlapping_route_endpoints">${route.RouteEndPoints.html}</div><div class="css_route_group_item_overlapping_route_actions"><div class="css_route_group_item_overlapping_route_action_button" onclick="bus.route.switchRoute(${route.RouteID}, [${route.PathAttributeId.join(',')}])">查看路線</div><div class="css_route_group_item_overlapping_route_action_button" onclick="bus.folder.openSaveToFolder('route-on-route', [${route.RouteID}])">儲存路線</div></div></div>`).join('');
    }

    function updateBusArrivalTimes(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_bus_arrival_times').innerHTML = thisItem.busArrivalTimes.length === 0 ? '<div class="css_route_group_item_bus_arrival_message">目前沒有抵達時間可顯示</div>' : thisItem.busArrivalTimes.map((busArrivalTime) => `<div class="css_route_group_item_bus_arrival_time"><div class="css_route_group_item_bus_arrival_time_title"><div class="css_route_group_item_bus_arrival_time_icon">${getIconHTML('calendar_view_day')}</div><div class="css_route_group_item_bus_arrival_time_personal_schedule_name">${busArrivalTime.personalSchedule.name}</div><div class="css_route_group_item_bus_arrival_time_personal_schedule_time">週${indexToDay(busArrivalTime.day).name} ${timeObjectToString(busArrivalTime.personalSchedule.period.start)} - ${timeObjectToString(busArrivalTime.personalSchedule.period.end)}</div></div><div class="css_route_group_item_bus_arrival_time_chart">${busArrivalTime.chart}</div></div>`).join('');
    }

    function updateNearbyLocations(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_nearby_locations').innerHTML = thisItem.nearbyLocations.length === 0 ? '<div class="css_route_group_item_nearby_locations_message">目前沒有地點可顯示</div>' : thisItem.nearbyLocations.map((nearbyLocation) => `<div class="css_route_group_item_nearby_location"><div class="css_route_group_item_nearby_location_title"><div class="css_route_group_item_nearby_location_icon">${getIconHTML('location_on')}</div><div class="css_route_group_item_nearby_location_name">${nearbyLocation.name}</div></div><div class="css_route_group_item_nearby_location_distance">${nearbyLocation.distance}公尺</div><div class="css_route_group_item_nearby_location_actions"><div class="css_route_group_item_nearby_location_action_button" onclick="bus.location.openLocation('${nearbyLocation.hash}')">查看地點</div><div class="css_route_group_item_nearby_location_action_button" onclick="bus.folder.openSaveToFolder('location-on-route', ['${nearbyLocation.hash}'])">儲存地點</div></div></div>`).join('');
    }

    function updateNearest(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem): void {
      thisItemElement.setAttribute('nearest', booleanToString(thisItem.nearest));
      thisThreadBoxElement.setAttribute('nearest', booleanToString(thisItem.nearest));
    }

    function updateThread(thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, previousItem: integratedStopItem | null, skeletonScreen: boolean, animation: boolean): void {
      const previousProgress = previousItem?.progress || 0;
      const thisProgress = thisItem?.progress || 0;
      const thisThreadProgressElement = elementQuerySelector(thisThreadBoxElement, '.css_route_group_thread .css_route_group_thread_progress');
      if (!skeletonScreen) {
        if (animation) {
          if (previousProgress !== 0 && thisProgress === 0 && Math.abs(thisProgress - previousProgress) > 0) {
            thisThreadProgressElement.style.setProperty('--b-cssvar-thread-progress-translate-y', '100%');
            thisThreadProgressElement.addEventListener(
              'transitionend',
              function () {
                thisThreadProgressElement.setAttribute('displayed', 'false');
                thisThreadProgressElement.style.setProperty('--b-cssvar-thread-progress-translate-y', '-100%');
              },
              { once: true }
            );
            return;
          }
        }
      }
      if (thisProgress > 0) {
        thisThreadProgressElement.setAttribute('displayed', 'true');
        thisThreadProgressElement.style.setProperty('--b-cssvar-thread-progress-translate-y', `${(thisProgress - 1) * 100}%`);
      } else {
        thisThreadProgressElement.setAttribute('displayed', 'false');
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
      saveToFolderButtonElement.onclick = function () {
        openSaveToFolder('stop-on-route', [thisItemElement.id, thisItem.id, integration.RouteID]);
      };
      isFolderContentSaved('stop', thisItem.id).then((e) => {
        saveToFolderButtonElement.setAttribute('highlighted', booleanToString(e));
      });
    }

    function updateScheduleNotificationButton(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const scheduleNotificationButtonElement = elementQuerySelector(thisItemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="schedule-notification"]');
      scheduleNotificationButtonElement.onclick = function () {
        openScheduleNotification('stop-on-route', [thisItemElement.id, thisItem.id, integration.RouteID, thisItem.status.time]);
      };
      const havingNotifcationSchedules = stopHasNotifcationSchedules(thisItem.id);
      scheduleNotificationButtonElement.setAttribute('highlighted', booleanToString(havingNotifcationSchedules));
    }

    if (previousItem === null) {
      updateStatus(thisItemElement, thisThreadBoxElement, thisItem, skeletonScreen, animation);
      updateName(thisItemElement, thisItem);
      updateBuses(thisItemElement, thisItem);
      updateOverlappingRoutes(thisItemElement, thisItem);
      updateBusArrivalTimes(thisItemElement, thisItem);
      updateNearbyLocations(thisItemElement, thisItem);
      updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
      updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      updateThread(thisThreadBoxElement, thisItem, previousItem, skeletonScreen, animation);
      updateStretch(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateAnimation(thisItemElement, thisThreadBoxElement, animation);
      updateSkeletonScreen(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSaveToFolderButton(thisItemElement, thisItem);
      updateScheduleNotificationButton(thisItemElement, thisItem);
    } else {
      if (thisItem.status.time !== previousItem.status.time) {
        updateStatus(thisItemElement, thisThreadBoxElement, thisItem, skeletonScreen, animation);
        updateScheduleNotificationButton(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.busArrivalTimes, thisItem.busArrivalTimes)) {
        updateBusArrivalTimes(thisItemElement, thisItem);
      }
      if (previousItem.nearest !== thisItem.nearest) {
        updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (previousItem.progress !== thisItem.progress) {
        updateThread(thisThreadBoxElement, thisItem, previousItem, skeletonScreen, animation);
      }
      if (previousItem.id !== thisItem.id) {
        updateName(thisItemElement, thisItem);
        updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
        updateOverlappingRoutes(thisItemElement, thisItem);
        updateNearbyLocations(thisItemElement, thisItem);
        updateSaveToFolderButton(thisItemElement, thisItem);
        updateScheduleNotificationButton(thisItemElement, thisItem);
      }
      if (previousAnimation !== animation) {
        updateAnimation(thisItemElement, thisThreadBoxElement, animation);
      }
      if (previousSkeletonScreen !== skeletonScreen) {
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
  const groupNames = [integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, '未知'].map((e) => `往${e}`);
  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const width = getTextWidth(groupNames[i], 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
    routeSliding_groupStyles[groupKey] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  routeSliding_groupStyles[`g_${groupQuantity}`] = {
    width: 0,
    offset: cumulativeOffset
  };

  if (!routeSliding_sliding) {
    const initialGroupKey = `g_${routeSliding_initialIndex}`;
    const initialGroupStyle = routeSliding_groupStyles[initialGroupKey];
    const offset = initialGroupStyle.offset * -1 + routeSliding_fieldWidth * 0.5 - initialGroupStyle.width * 0.5;
    const tabLineWidth = initialGroupStyle.width - tabPadding;
    updateRouteCSS(routeSliding_groupQuantity, offset, tabLineWidth, routeSliding_initialIndex);
  }

  if (previousSkeletonScreen !== skeletonScreen) {
    RouteNameElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    RouteGroupTabsElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    RouteGroupTabLineTrackElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  }

  if (previousAnimation !== animation) {
    RouteNameElement.setAttribute('animation', booleanToString(animation));
    RouteGroupTabsElement.setAttribute('animation', booleanToString(animation));
    RouteGroupTabLineTrackElement.setAttribute('animation', booleanToString(animation));
  }

  if (previousIntegration?.RouteID !== integration.RouteID) {
    RouteButtonRightElement.onclick = function () {
      openRouteDetails(integration.RouteID, integration.PathAttributeId);
    };
  }

  if (previousIntegration?.RouteName !== integration.RouteName) {
    RouteNameSpanElement.innerText = integration.RouteName;
  }

  const currentGroupCapacity = elementQuerySelectorAll(RouteGroupsElement, '.css_route_group').length;
  if (groupQuantity !== currentGroupCapacity) {
    const difference = currentGroupCapacity - groupQuantity;
    if (difference < 0) {
      const newGroupsFragment = new DocumentFragment();
      const newTabsFragment = new DocumentFragment();
      for (let o = 0, d = Math.abs(difference); o < d; o++) {
        const newGroupElement = generateElementOfGroup();
        newGroupsFragment.appendChild(newGroupElement.element);
        const newTabElement = generateElementOfTab();
        newTabsFragment.appendChild(newTabElement.element);
      }
      RouteGroupsElement.append(newGroupsFragment);
      RouteGroupTabsTrayElement.append(newTabsFragment);
    } else {
      const GroupElements = elementQuerySelectorAll(RouteGroupsElement, '.css_route_group');
      const TabElements = elementQuerySelectorAll(RouteGroupTabsTrayElement, '.css_route_group_tab');
      for (let o = 0, d = Math.abs(difference); o < d; o++) {
        const groupIndex = currentGroupCapacity - 1 - o;
        GroupElements[groupIndex].remove();
        TabElements[groupIndex].remove();
      }
    }
  }

  const RouteGroupElements = elementQuerySelectorAll(RouteGroupsElement, '.css_route_group');

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const thisGroupElement = RouteGroupElements[i];
    const thisGroupItemsTrackElement = elementQuerySelector(thisGroupElement, '.css_route_group_items_track');
    const thisGroupThreadsTrackElement = elementQuerySelector(thisGroupElement, '.css_route_group_threads_track');
    const currentItemCapacity = elementQuerySelectorAll(thisGroupItemsTrackElement, '.css_route_group_item').length;
    if (itemQuantity[groupKey] !== currentItemCapacity) {
      const difference = currentItemCapacity - itemQuantity[groupKey];
      if (difference < 0) {
        const newItemsFragment = new DocumentFragment();
        const newThreadsFragment = new DocumentFragment();
        for (let o = 0, d = Math.abs(difference); o < d; o++) {
          const newThreadBoxElement = generateElementOfThreadBox();
          const newItemElement = generateElementOfItem(newThreadBoxElement.id);
          newItemsFragment.appendChild(newItemElement.element);
          newThreadsFragment.appendChild(newThreadBoxElement.element);
        }
        thisGroupItemsTrackElement.append(newItemsFragment);
        thisGroupThreadsTrackElement.append(newThreadsFragment);
      } else {
        const thisGroupItemElements = elementQuerySelectorAll(thisGroupItemsTrackElement, '.css_route_group_item');
        const thisGroupThreadElements = elementQuerySelectorAll(thisGroupThreadsTrackElement, '.css_route_group_thread_box');
        for (let o = 0, d = Math.abs(difference); o < d; o++) {
          const itemIndex = currentItemCapacity - 1 - o;
          thisGroupItemElements[itemIndex].remove();
          thisGroupThreadElements[itemIndex].remove();
        }
      }
    }
  }

  const TabElements = elementQuerySelectorAll(RouteGroupTabsTrayElement, '.css_route_group_tab');
  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;

    const thisTabElement = TabElements[i];
    thisTabElement.innerHTML = [integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    thisTabElement.style.setProperty('--b-cssvar-route-tab-width', `${routeSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-route-tab-index', i.toString());

    const thisGroupElement = RouteGroupElements[i];
    if (skeletonScreen) {
      thisGroupElement.scrollTop = 0;
    }

    const thisGroupItemsTrackElement = elementQuerySelector(thisGroupElement, '.css_route_group_items_track');
    const thisGroupThreadsTrackElement = elementQuerySelector(thisGroupElement, '.css_route_group_threads_track');
    const thisGroupItemElements = elementQuerySelectorAll(thisGroupItemsTrackElement, '.css_route_group_item');
    const thisGroupThreadElements = elementQuerySelectorAll(thisGroupThreadsTrackElement, '.css_route_group_thread_box');
    for (let j = 0; j < itemQuantity[groupKey]; j++) {
      const thisItemElement = thisGroupItemElements[j];
      const thisThreadBoxElement = thisGroupThreadElements[j];
      const thisItem = groupedItems[groupKey][j];
      if (previousIntegration.hasOwnProperty('groupedItems')) {
        if (previousIntegration.groupedItems.hasOwnProperty(groupKey)) {
          if (previousIntegration.groupedItems[groupKey][j]) {
            const previousItem = previousIntegration.groupedItems[groupKey][j];
            updateItem(thisItemElement, thisThreadBoxElement, thisItem, previousItem, skeletonScreen, animation);
          } else {
            updateItem(thisItemElement, thisThreadBoxElement, thisItem, null, skeletonScreen, animation);
          }
        } else {
          updateItem(thisItemElement, thisThreadBoxElement, thisItem, null, skeletonScreen, animation);
        }
      } else {
        updateItem(thisItemElement, thisThreadBoxElement, thisItem, null, skeletonScreen, animation);
      }
    }
  }

  previousIntegration = integration;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

async function refreshRoute() {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  const busArrivalTimeChartSize = querySize('route-bus-arrival-time-chart');
  routeRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  routeRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  routeRefreshTimer_refreshing = true;
  routeRefreshTimer_currentRequestID = generateIdentifier();
  RouteUpdateTimerElement.setAttribute('refreshing', 'true');
  RouteUpdateTimerElement.classList.remove('css_route_update_timer_slide_rtl');
  document.addEventListener(routeRefreshTimer_currentRequestID, handleDataReceivingProgressUpdates);
  const integration = await integrateRoute(currentRouteIDSet_RouteID, currentRouteIDSet_PathAttributeId, busArrivalTimeChartSize.width, busArrivalTimeChartSize.height, routeRefreshTimer_currentRequestID);
  updateRouteField(integration, false, playing_animation);
  let updateRate = 0;
  if (routeRefreshTimer_dynamic) {
    updateRate = await getUpdateRate();
  }
  routeRefreshTimer_lastUpdate = new Date().getTime();
  if (routeRefreshTimer_dynamic) {
    routeRefreshTimer_nextUpdate = Math.max(routeRefreshTimer_lastUpdate + routeRefreshTimer_minInterval, integration.dataUpdateTime + routeRefreshTimer_baseInterval / updateRate);
  } else {
    routeRefreshTimer_nextUpdate = routeRefreshTimer_lastUpdate + routeRefreshTimer_baseInterval;
  }
  routeRefreshTimer_dynamicInterval = Math.max(routeRefreshTimer_minInterval, routeRefreshTimer_nextUpdate - routeRefreshTimer_lastUpdate);
  routeRefreshTimer_refreshing = false;
  RouteUpdateTimerElement.setAttribute('refreshing', 'false');
  animateUpdateTimer();
}

export function streamRoute(): void {
  refreshRoute()
    .then(function () {
      if (routeRefreshTimer_streaming) {
        setTimeout(
          function () {
            streamRoute();
          },
          Math.max(routeRefreshTimer_minInterval, routeRefreshTimer_nextUpdate - new Date().getTime())
        );
      } else {
        routeRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (routeRefreshTimer_streaming) {
        promptMessage(`路線網路連線中斷，將在${routeRefreshTimer_retryInterval / 1000}秒後重試。`, 'error');
        setTimeout(function () {
          streamRoute();
        }, routeRefreshTimer_retryInterval);
      } else {
        routeRefreshTimer_streamStarted = false;
      }
    });
}

export function openRoute(RouteID: IntegratedRoute['RouteID'], PathAttributeId: IntegratedRoute['PathAttributeId']): void {
  pushPageHistory('Route');
  logRecentView('route', RouteID);
  currentRouteIDSet_RouteID = RouteID;
  currentRouteIDSet_PathAttributeId = PathAttributeId;
  routeSliding_initialIndex = 0;
  routeSliding_groupStyles = {};
  RouteField.setAttribute('displayed', 'true');
  RouteGroupsElement.scrollLeft = 0;
  RouteGroupsElement.focus();
  setUpRouteFieldSkeletonScreen(RouteID, PathAttributeId);
  if (!routeRefreshTimer_streaming) {
    routeRefreshTimer_streaming = true;
    if (!routeRefreshTimer_streamStarted) {
      routeRefreshTimer_streamStarted = true;
      streamRoute();
    } else {
      refreshRoute();
    }
  }
  closePreviousPage();
}

export function closeRoute(): void {
  // revokePageHistory('Route');
  RouteField.setAttribute('displayed', 'false');
  routeRefreshTimer_streaming = false;
  openPreviousPage();
}

export function switchRoute(RouteID: IntegratedRoute['RouteID'], PathAttributeId: IntegratedRoute['PathAttributeId']): void {
  routeRefreshTimer_streaming = false;
  openRoute(RouteID, PathAttributeId);
}

export function stretchRouteItem(itemElementID: string, threadBoxElementID: string): void {
  const itemElement = elementQuerySelector(RouteGroupsElement, `.css_route_group .css_route_group_tracks .css_route_group_items_track .css_route_group_item#${itemElementID}`);
  const itemBodyElement = elementQuerySelector(itemElement, '.css_route_group_item_body');
  const threadBoxElement = elementQuerySelector(RouteGroupsElement, `.css_route_group .css_route_group_tracks .css_route_group_threads_track .css_route_group_thread_box#${threadBoxElementID}`);

  const itemsTrackElement = itemElement.parentElement as HTMLElement;
  const threadTrackElement = threadBoxElement.parentElement as HTMLElement;

  const elementsBelowThreadBoxElement = getElementsBelow(threadBoxElement, 'css_route_group_thread_box');
  const elementsBelowItemElement = getElementsBelow(itemElement, 'css_route_group_item');

  const elementsBelowLength = elementsBelowItemElement.length; // = elementsBelowThreadBoxElement.length

  const itemsTrackElementRect = itemsTrackElement.getBoundingClientRect();
  const itemElementRect = itemElement.getBoundingClientRect();
  const threadTrackElementRect = threadTrackElement.getBoundingClientRect();
  const threadBoxElementRect = threadBoxElement.getBoundingClientRect();

  // const threadBoxElementX = threadBoxElementRect.left - threadTrackElementRect.left;
  const threadBoxElementY = threadBoxElementRect.top - threadTrackElementRect.top;

  // const itemElementX = itemElementRect.left - itemsTrackElementRect.left;
  const itemElementY = itemElementRect.top - itemsTrackElementRect.top; // itemElementRect.top + scrollTop - (itemsTrackElementRect.top + scrollTop)

  const stretched = itemElement.getAttribute('stretched') === 'true' ? true : false;
  const animation = itemElement.getAttribute('animation') === 'true' ? true : false;

  if (animation) {
    const pushDirection = stretched ? '2' : '1';

    // Separate the elements from the document flow while keeping its position
    threadBoxElement.setAttribute('stretching', 'true');
    // threadBoxElement.style.setProperty('--b-cssvar-css-route-group-thread-box-x', `${threadBoxElementX}px`);
    threadBoxElement.style.setProperty('--b-cssvar-css-route-group-thread-box-y', `${threadBoxElementY}px`);

    itemElement.setAttribute('stretching', 'true');
    // itemElement.style.setProperty('--b-cssvar-css-route-group-item-x', `${itemElementX}px`);
    itemElement.style.setProperty('--b-cssvar-css-route-group-item-y', `${itemElementY}px`);

    // Set push direction and push state
    for (let i = 0; i < elementsBelowLength; i++) {
      const thisItemElement = elementsBelowItemElement[i];
      const thisThreadBoxElement = elementsBelowThreadBoxElement[i];
      // thisThreadBoxElement.style.setProperty('--b-cssvar-css-route-group-thread-z-index', (elementsBelowLength - i - 1).toString());
      thisThreadBoxElement.style.setProperty('--b-cssvar-css-route-group-thread-z-index', (-1 * i - 1).toString());
      thisThreadBoxElement.setAttribute('push-direction', pushDirection);
      thisThreadBoxElement.setAttribute('push-state', '1');
      thisItemElement.setAttribute('push-direction', pushDirection);
      thisItemElement.setAttribute('push-state', '1');
    }

    itemElement.addEventListener(
      'transitionend',
      function () {
        // Reset the push direction and push state
        for (let i = 0; i < elementsBelowLength; i++) {
          const thisItemElement = elementsBelowItemElement[i];
          const thisThreadBoxElement = elementsBelowThreadBoxElement[i];
          thisThreadBoxElement.setAttribute('push-direction', '0');
          thisThreadBoxElement.setAttribute('push-state', '0');
          thisItemElement.setAttribute('push-direction', '0');
          thisItemElement.setAttribute('push-state', '0');
        }
        // Deposit the element
        threadBoxElement.setAttribute('stretching', 'false');
        itemElement.setAttribute('stretching', 'false');
      },
      { once: true }
    );

    itemElement.addEventListener(
      'transitionstart',
      function () {
        // Transition the elements below
        for (let i = 0; i < elementsBelowLength; i++) {
          const thisItemElement = elementsBelowItemElement[i];
          const thisThreadBoxElement = elementsBelowThreadBoxElement[i];
          thisThreadBoxElement.setAttribute('push-state', '2');
          thisItemElement.setAttribute('push-state', '2');
        }
      },
      { once: true }
    );
  }

  // Switch the state of the stretching element
  if (stretched) {
    if (animation) {
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
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_nearby_locations').setAttribute('displayed', 'false');
      break;
    case 1:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_nearby_locations').setAttribute('displayed', 'false');
      break;
    case 2:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_route_group_item_nearby_locations').setAttribute('displayed', 'false');
      break;
    case 3:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_nearby_locations').setAttribute('displayed', 'true');
      break;
    default:
      break;
  }
}

import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { isFolderContentSaved } from '../../data/folder/index';
import { stopHasNotifcationSchedules } from '../../data/notification/index';
import { logRecentView } from '../../data/recent-views/index';
import { IntegratedRoute, integratedStopItem, integrateRoute } from '../../data/route/index';
import { getSettingOptionValue } from '../../data/settings/index';
import { BitState } from '../../tools/bit-state';
import { deepEqual } from '../../tools/deep-equal';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { getTextWidth } from '../../tools/graphic';
import { booleanToString, getSubpixelPrecision, hasOwnProperty } from '../../tools/index';
import { Tick } from '../../tools/tick';
import { indexToDay, timeObjectToString } from '../../tools/time';
import { VisibilityMonitor } from '../../tools/visibility-monitor';
import { getIconElement } from '../icons/index';
import { GroupStyles, hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';
import { openLocation } from '../location/index';
import { promptMessage } from '../prompt/index';
import { openRouteDetails } from '../route-details/index';
import { openSaveToFolder } from '../save-to-folder/index';
import { openScheduleNotification } from '../schedule-notification/index';

const Field = documentQuerySelector('.css_route_field');
const HeadElement = elementQuerySelector(Field, '.css_route_head');
const HeadNameElement = elementQuerySelector(HeadElement, '.css_route_name');
const HeadNameSpanElement = elementQuerySelector(HeadNameElement, 'span');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_route_button_right');
const UpdateTimerBoxElement = elementQuerySelector(HeadElement, '.css_route_update_timer_box');
const UpdateTimerElement = elementQuerySelector(UpdateTimerBoxElement, '.css_route_update_timer');
const GroupTabsElement = elementQuerySelector(HeadElement, '.css_route_group_tabs');
const GroupTabsTrayElement = elementQuerySelector(GroupTabsElement, '.css_route_group_tabs_tray');
const GroupTabLineTrackElement = elementQuerySelector(HeadElement, '.css_route_group_tab_line_track');
const GroupTabLineElement = elementQuerySelector(GroupTabLineTrackElement, '.css_route_group_tab_line');
const GroupsElement = elementQuerySelector(Field, '.css_route_groups');

/**
 * div.css_route_group(n) in div.css_route_groups(1)
 */
const groupElements: Array<HTMLElement> = [];

/**
 * div.css_route_group_tab(n) in div.css_route_group_tabs_tray(1)
 */
const tabElements: Array<HTMLElement> = [];

/**
 * div.css_route_group_item(m) in div.css_route_group_items_track(1) in div.css_route_group(n)
 */
const itemElements: Array<Array<HTMLElement>> = [];

/**
 * div.css_route_group_thread_box(m) in div.css_route_group_threads_track(1) in div.css_route_group(n)
 */
const threadBoxElements: Array<Array<HTMLElement>> = [];

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

let currentRouteID: number = 0;

const routeTick = new Tick(refreshRoute, 15 * 1000);
const routeTickRetryInterval = 10 * 1000;
const routeVisibilityMonitor = new VisibilityMonitor({ root: GroupsElement, threshold: 0.5 });
const decoder = new TextDecoder();

const tabPadding: number = 20;
const subpixelPrecision: number = getSubpixelPrecision();

const stretchStates: Array<BitState> = [];
const itemElementHeight = 50;
const itemElementExtraHeight = 171;

function getElementRelativeTop(groupIndex: number, index: number): number {
  return index * itemElementHeight + stretchStates[groupIndex].sum(index - 1) * itemElementExtraHeight;
}

export function initializeRouteSliding(): void {
  GroupsElement.addEventListener(
    'pointerdown',
    function () {
      routeSliding_initialIndex = Math.round(GroupsElement.scrollLeft / routeSliding_fieldWidth);
    },
    { passive: true }
  );

  GroupsElement.addEventListener(
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
      const initialSize = routeSliding_groupStyles[`gs_${routeSliding_initialIndex}`] || { width: 0, offset: 0 };
      const targetSize = routeSliding_groupStyles[`gs_${routeSliding_targetIndex}`] || { width: 0, offset: 0 };
      const tabWidth = initialSize.width + (targetSize.width - initialSize.width) * delta;
      const offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * delta) * -1 + routeSliding_fieldWidth * 0.5 - tabWidth * 0.5;
      updateRouteCSS(routeSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);
    },
    { passive: true }
  );

  GroupsElement.addEventListener(
    'scrollend',
    function (event: Event) {
      const target = event.target as HTMLElement;
      const currentIndex = target.scrollLeft / routeSliding_fieldWidth;
      const difference = currentIndex - routeSliding_targetIndex;
      if (-0.01 < difference && difference < 0.01) {
        routeSliding_initialIndex = Math.round(currentIndex);
        routeSliding_sliding = false;
      }
    },
    { passive: true }
  );
}

export function updateRouteCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  GroupsElement.style.setProperty('--b-cssvar-route-group-quantity', groupQuantity.toString());
  GroupTabLineElement.style.setProperty('--b-cssvar-route-tab-line-width-scale', tabLineWidth.toString());
  GroupTabsTrayElement.style.setProperty('--b-cssvar-route-tabs-tray-offset', `${offset.toFixed(subpixelPrecision)}px`);
  GroupTabsTrayElement.style.setProperty('--b-cssvar-route-percentage', percentage.toString());
}

function animateUpdateTimer(interval: number): void {
  UpdateTimerElement.style.setProperty('--b-cssvar-route-update-timer-interval', `${interval.toString()}ms`);
  UpdateTimerElement.classList.add('css_route_update_timer_scale_down');
}

function generateElementOfThreadBox(index: number): HTMLElement {
  // Main thread box element
  const threadBoxElement = documentCreateDivElement();
  threadBoxElement.classList.add('css_route_group_thread_box');
  threadBoxElement.setAttribute('stretched', 'false');
  threadBoxElement.setAttribute('stretching', 'false');
  threadBoxElement.setAttribute('push-direction', '0'); // 0: normal state, 1: downward, 2: upward
  threadBoxElement.setAttribute('push-state', '0'); // 0: normal state, 1: compensation , 2: transition
  threadBoxElement.style.setProperty('--b-cssvar-css-route-group-thread-z-index', index.toString());

  // Thread box background
  const threadBoxBackgroundElement = documentCreateDivElement();
  threadBoxBackgroundElement.classList.add('css_route_group_thread_box_background');

  // Thread container
  const threadElement = documentCreateDivElement();
  threadElement.classList.add('css_route_group_thread');

  // Thread progress
  const threadProgressElement = documentCreateDivElement();
  threadProgressElement.classList.add('css_route_group_thread_progress');
  threadProgressElement.setAttribute('displayed', 'false');
  threadElement.appendChild(threadProgressElement);

  // Thread status container
  const threadStatusElement = documentCreateDivElement();
  threadStatusElement.classList.add('css_route_group_thread_status');

  // Next slide
  const nextSlideElement = documentCreateDivElement();
  nextSlideElement.classList.add('css_next_slide');
  nextSlideElement.setAttribute('code', '0');
  nextSlideElement.setAttribute('displayed', 'false');
  threadStatusElement.appendChild(nextSlideElement);

  // Current slide
  const currentSlideElement = documentCreateDivElement();
  currentSlideElement.classList.add('css_current_slide');
  currentSlideElement.setAttribute('code', '0');
  currentSlideElement.setAttribute('displayed', 'true');
  threadStatusElement.appendChild(currentSlideElement);

  // Assemble
  threadBoxElement.appendChild(threadBoxBackgroundElement);
  threadBoxElement.appendChild(threadElement);
  threadBoxElement.appendChild(threadStatusElement);

  return threadBoxElement;
}

function generateElementOfItem(groupIndex: number): HTMLElement {
  // Main item element
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_route_group_item');
  itemElement.setAttribute('stretched', 'false');
  itemElement.setAttribute('stretching', 'false');
  itemElement.setAttribute('push-direction', '0'); // 0: normal state, 1: downward, 2: upward
  itemElement.setAttribute('push-state', '0'); // 0: normal state, 1: compensation , 2: transition

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_route_group_item_head');

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_route_group_item_name');
  headElement.appendChild(nameElement);

  // Capsule
  const capsuleElement = documentCreateDivElement();
  capsuleElement.classList.add('css_route_group_item_capsule');

  // Status
  const statusElement = documentCreateDivElement();
  statusElement.classList.add('css_route_group_item_status');

  const nextSlideElement = documentCreateDivElement();
  nextSlideElement.classList.add('css_next_slide');
  nextSlideElement.setAttribute('code', '0');
  nextSlideElement.setAttribute('displayed', 'false');
  statusElement.appendChild(nextSlideElement);

  const currentSlideElement = documentCreateDivElement();
  currentSlideElement.classList.add('css_current_slide');
  currentSlideElement.setAttribute('code', '0');
  currentSlideElement.setAttribute('displayed', 'true');
  statusElement.appendChild(currentSlideElement);

  capsuleElement.appendChild(statusElement);

  // Stretch button
  const stretchElement = documentCreateDivElement();
  stretchElement.classList.add('css_route_group_item_stretch');
  stretchElement.appendChild(getIconElement('keyboard_arrow_down'));
  stretchElement.onclick = function () {
    stretchRouteItem(groupIndex, itemElement);
  };
  capsuleElement.appendChild(stretchElement);

  // Capsule separator
  const capsuleSeparatorElement = documentCreateDivElement();
  capsuleSeparatorElement.classList.add('css_route_group_item_capsule_separator');
  capsuleElement.appendChild(capsuleSeparatorElement);

  headElement.appendChild(capsuleElement);

  // Body
  const bodyElement = documentCreateDivElement();
  bodyElement.classList.add('css_route_group_item_body');
  bodyElement.setAttribute('displayed', 'false');

  // Buttons
  const buttonsElement = documentCreateDivElement();
  buttonsElement.classList.add('css_route_group_item_buttons');

  // Tab: 公車
  const tabBusElement = documentCreateDivElement();
  tabBusElement.classList.add('css_route_group_item_button');
  tabBusElement.setAttribute('highlighted', 'true');
  tabBusElement.setAttribute('type', 'tab');
  tabBusElement.onclick = function () {
    switchRouteBodyTab(itemElement, 0);
  };

  const tabBusIconElement = documentCreateDivElement();
  tabBusIconElement.classList.add('css_route_group_item_button_icon');
  tabBusIconElement.appendChild(getIconElement('directions_bus'));
  tabBusElement.appendChild(tabBusIconElement);
  tabBusElement.appendChild(document.createTextNode('公車'));
  buttonsElement.appendChild(tabBusElement);

  // Tab: 抵達時間
  const tabArrivalElement = documentCreateDivElement();
  tabArrivalElement.classList.add('css_route_group_item_button');
  tabArrivalElement.setAttribute('highlighted', 'false');
  tabArrivalElement.setAttribute('type', 'tab');
  tabArrivalElement.onclick = function () {
    switchRouteBodyTab(itemElement, 1);
  };

  const tabArrivalIconElement = documentCreateDivElement();
  tabArrivalIconElement.classList.add('css_route_group_item_button_icon');
  tabArrivalIconElement.appendChild(getIconElement('departure_board'));
  tabArrivalElement.appendChild(tabArrivalIconElement);
  tabArrivalElement.appendChild(document.createTextNode('抵達時間'));
  buttonsElement.appendChild(tabArrivalElement);

  // Tab: 路線
  const tabRouteElement = documentCreateDivElement();
  tabRouteElement.classList.add('css_route_group_item_button');
  tabRouteElement.setAttribute('highlighted', 'false');
  tabRouteElement.setAttribute('type', 'tab');
  tabRouteElement.onclick = function () {
    switchRouteBodyTab(itemElement, 2);
  };

  const tabRouteIconElement = documentCreateDivElement();
  tabRouteIconElement.classList.add('css_route_group_item_button_icon');
  tabRouteIconElement.appendChild(getIconElement('route'));
  tabRouteElement.appendChild(tabRouteIconElement);
  tabRouteElement.appendChild(document.createTextNode('路線'));
  buttonsElement.appendChild(tabRouteElement);

  // Tab: 地點
  const tabLocationElement = documentCreateDivElement();
  tabLocationElement.classList.add('css_route_group_item_button');
  tabLocationElement.setAttribute('highlighted', 'false');
  tabLocationElement.setAttribute('type', 'tab');
  tabLocationElement.onclick = function () {
    switchRouteBodyTab(itemElement, 3);
  };

  const tabLocationIconElement = documentCreateDivElement();
  tabLocationIconElement.classList.add('css_route_group_item_button_icon');
  tabLocationIconElement.appendChild(getIconElement('location_on'));
  tabLocationElement.appendChild(tabLocationIconElement);
  tabLocationElement.appendChild(document.createTextNode('地點'));
  buttonsElement.appendChild(tabLocationElement);

  // Save to folder
  const saveToFolderElement = documentCreateDivElement();
  saveToFolderElement.classList.add('css_route_group_item_button');
  saveToFolderElement.setAttribute('highlighted', 'false');
  saveToFolderElement.setAttribute('type', 'save-to-folder');

  const saveToFolderIconElement = documentCreateDivElement();
  saveToFolderIconElement.classList.add('css_route_group_item_button_icon');
  saveToFolderIconElement.appendChild(getIconElement('folder'));
  saveToFolderElement.appendChild(saveToFolderIconElement);
  saveToFolderElement.appendChild(document.createTextNode('儲存'));
  buttonsElement.appendChild(saveToFolderElement);

  // Schedule notification
  const scheduleNotificationElement = documentCreateDivElement();
  scheduleNotificationElement.classList.add('css_route_group_item_button');
  scheduleNotificationElement.setAttribute('highlighted', 'false');
  scheduleNotificationElement.setAttribute('type', 'schedule-notification');
  scheduleNotificationElement.setAttribute('enabled', 'true');
  scheduleNotificationElement.setAttribute('processing', 'false');

  const scheduleNotificationIconElement = documentCreateDivElement();
  scheduleNotificationIconElement.classList.add('css_route_group_item_button_icon');
  scheduleNotificationIconElement.appendChild(getIconElement('notifications'));
  scheduleNotificationElement.appendChild(scheduleNotificationIconElement);
  scheduleNotificationElement.appendChild(document.createTextNode('通知'));
  buttonsElement.appendChild(scheduleNotificationElement);

  bodyElement.appendChild(buttonsElement);

  // Buses
  const busesElement = documentCreateDivElement();
  busesElement.classList.add('css_route_group_item_buses');
  busesElement.setAttribute('displayed', 'true');
  bodyElement.appendChild(busesElement);

  // Overlapping routes
  const overlappingRoutesElement = documentCreateDivElement();
  overlappingRoutesElement.classList.add('css_route_group_item_overlapping_routes');
  overlappingRoutesElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(overlappingRoutesElement);

  // Bus arrival times
  const busArrivalTimesElement = documentCreateDivElement();
  busArrivalTimesElement.classList.add('css_route_group_item_bus_arrival_times');
  busArrivalTimesElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(busArrivalTimesElement);

  // Nearby locations
  const nearbyLocationsElement = documentCreateDivElement();
  nearbyLocationsElement.classList.add('css_route_group_item_nearby_locations');
  nearbyLocationsElement.setAttribute('displayed', 'false');
  bodyElement.appendChild(nearbyLocationsElement);

  // Assemble
  itemElement.appendChild(headElement);
  itemElement.appendChild(bodyElement);

  return itemElement;
}

function generateElementOfGroup(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_route_group');

  const tracksElement = documentCreateDivElement();
  tracksElement.classList.add('css_route_group_tracks');

  const threadTrackElement = documentCreateDivElement();
  threadTrackElement.classList.add('css_route_group_threads_track');

  const itemsTrackElement = documentCreateDivElement();
  itemsTrackElement.classList.add('css_route_group_items_track');

  tracksElement.appendChild(threadTrackElement);
  tracksElement.appendChild(itemsTrackElement);
  element.appendChild(tracksElement);

  return element;
}

function generateElementOfTab(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_route_group_tab');
  const span = document.createElement('span');
  element.appendChild(span);
  return element;
}

function generateElementOfBus(): HTMLElement {
  const busElement = documentCreateDivElement();
  busElement.classList.add('css_route_group_item_bus');
  busElement.setAttribute('on-this-route', 'false');

  const titleElement = documentCreateDivElement();
  titleElement.classList.add('css_route_group_item_bus_title');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_route_group_item_bus_icon');
  iconElement.appendChild(getIconElement('directions_bus'));

  const carNumberElement = documentCreateDivElement();
  carNumberElement.classList.add('css_route_group_item_bus_car_number');

  const attributesElement = documentCreateDivElement();
  attributesElement.classList.add('css_route_group_item_bus_attributes');

  const routeAttributeElement = documentCreateDivElement();
  routeAttributeElement.classList.add('css_route_group_item_bus_route');

  const carStatusAttributeElement = documentCreateDivElement();
  carStatusAttributeElement.classList.add('css_route_group_item_bus_car_status');

  const carTypeAttributeElement = documentCreateDivElement();
  carTypeAttributeElement.classList.add('css_route_group_item_bus_car_type');

  titleElement.appendChild(iconElement);
  titleElement.appendChild(carNumberElement);
  busElement.appendChild(titleElement);

  attributesElement.appendChild(routeAttributeElement);
  attributesElement.appendChild(carStatusAttributeElement);
  attributesElement.appendChild(carTypeAttributeElement);
  busElement.appendChild(attributesElement);

  return busElement;
}

function generateElementOfOverlappingRoute(): HTMLElement {
  const overlappingRouteElement = documentCreateDivElement();
  overlappingRouteElement.classList.add('css_route_group_item_overlapping_route');

  const titleElement = documentCreateDivElement();
  titleElement.classList.add('css_route_group_item_overlapping_route_title');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_route_group_item_overlapping_route_icon');
  iconElement.appendChild(getIconElement('route'));

  const routeNameElement = documentCreateDivElement();
  routeNameElement.classList.add('css_route_group_item_overlapping_route_name');

  const routeEndPoindsElement = documentCreateDivElement();
  routeEndPoindsElement.classList.add('css_route_group_item_overlapping_route_endpoints');

  const actionsElement = documentCreateDivElement();
  actionsElement.classList.add('css_route_group_item_overlapping_route_actions');

  const viewRouteButtonElement = documentCreateDivElement();
  viewRouteButtonElement.classList.add('css_route_group_item_overlapping_route_action_button');
  viewRouteButtonElement.setAttribute('type', 'view-route');
  viewRouteButtonElement.textContent = '查看路線';

  const saveToFolderButtonElement = documentCreateDivElement();
  saveToFolderButtonElement.classList.add('css_route_group_item_overlapping_route_action_button');
  saveToFolderButtonElement.setAttribute('type', 'save-to-folder');
  saveToFolderButtonElement.setAttribute('highlighted', 'false');
  saveToFolderButtonElement.textContent = '儲存路線';

  titleElement.appendChild(iconElement);
  titleElement.appendChild(routeNameElement);
  overlappingRouteElement.appendChild(titleElement);

  overlappingRouteElement.appendChild(routeEndPoindsElement);

  actionsElement.appendChild(viewRouteButtonElement);
  actionsElement.appendChild(saveToFolderButtonElement);

  overlappingRouteElement.appendChild(actionsElement);

  return overlappingRouteElement;
}

function generateElementOfBusArrivalTime(): HTMLElement {
  const busArrivalTimeElement = documentCreateDivElement();
  busArrivalTimeElement.classList.add('css_route_group_item_bus_arrival_time');

  const titleElement = documentCreateDivElement();
  titleElement.classList.add('css_route_group_item_bus_arrival_time_title');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_route_group_item_bus_arrival_time_icon');
  iconElement.appendChild(getIconElement('calendar_view_day'));

  const personalScheduleNameElement = documentCreateDivElement();
  personalScheduleNameElement.classList.add('css_route_group_item_bus_arrival_time_personal_schedule_name');

  const personalScheduleTimeElement = documentCreateDivElement();
  personalScheduleTimeElement.classList.add('css_route_group_item_bus_arrival_time_personal_schedule_time');

  const chartElement = documentCreateDivElement();
  chartElement.classList.add('css_route_group_item_bus_arrival_time_chart');

  titleElement.appendChild(iconElement);
  titleElement.appendChild(personalScheduleNameElement);
  titleElement.appendChild(personalScheduleTimeElement);
  busArrivalTimeElement.appendChild(titleElement);
  busArrivalTimeElement.appendChild(chartElement);

  return busArrivalTimeElement;
}

function generateElementOfNearbyLocation(): HTMLElement {
  const nearbyLocationElement = documentCreateDivElement();
  nearbyLocationElement.classList.add('css_route_group_item_nearby_location');

  const titleElement = documentCreateDivElement();
  titleElement.classList.add('css_route_group_item_nearby_location_title');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_route_group_item_nearby_location_icon');
  iconElement.appendChild(getIconElement('location_on'));

  const locationNameElement = documentCreateDivElement();
  locationNameElement.classList.add('css_route_group_item_nearby_location_name');

  const distanceElement = documentCreateDivElement();
  distanceElement.classList.add('css_route_group_item_nearby_location_distance');

  const actionsElement = documentCreateDivElement();
  actionsElement.classList.add('css_route_group_item_nearby_location_actions');

  const viewLocationButtonElement = documentCreateDivElement();
  viewLocationButtonElement.classList.add('css_route_group_item_nearby_location_action_button');
  viewLocationButtonElement.setAttribute('type', 'view-location');
  viewLocationButtonElement.textContent = '查看地點';

  const saveToFolderButtonElement = documentCreateDivElement();
  saveToFolderButtonElement.classList.add('css_route_group_item_nearby_location_action_button');
  saveToFolderButtonElement.setAttribute('type', 'save-to-folder');
  saveToFolderButtonElement.setAttribute('highlighted', 'false');
  saveToFolderButtonElement.textContent = '儲存地點';

  titleElement.appendChild(iconElement);
  titleElement.appendChild(locationNameElement);
  nearbyLocationElement.appendChild(titleElement);

  nearbyLocationElement.appendChild(distanceElement);

  actionsElement.appendChild(viewLocationButtonElement);
  actionsElement.appendChild(saveToFolderButtonElement);

  nearbyLocationElement.appendChild(actionsElement);

  return nearbyLocationElement;
}

function setupRouteFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation');
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  const itemQuantity = Math.floor(FieldHeight / 50) + 5;
  const groupQuantity = 2;
  const items: Array<integratedStopItem> = new Array(itemQuantity).fill({
    name: '',
    goBack: '0',
    status: {
      code: 8,
      text: '',
      time: -6
    },
    buses: [],
    overlappingRoutes: [],
    busArrivalTimes: [],
    nearbyLocations: [],
    sequence: 0,
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
    id: -1
  });
  // reuse the object (assume readonly)

  updateRouteField(
    {
      groupNames: { g_0: '往載入中', g_1: '往載入中' },
      groupedItems: { g_0: items, g_1: items },
      groupQuantity: groupQuantity,
      itemQuantity: { g_0: itemQuantity, g_1: itemQuantity },
      RouteName: '載入中',
      RouteEndPoints: ['載入中', '載入中'],
      RouteID: -1,
      PathAttributeId: [],
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
      nextItemSlideElement.textContent = thisItem.status.text;

      if (!skeletonScreen) {
        if (animation) {
          if (routeVisibilityMonitor.isVisible(thisItemElement)) {
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
                currentItemSlideElement.textContent = thisItem.status.text;
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
      currentItemSlideElement.textContent = thisItem.status.text;
    }

    function updateSegmentBuffer(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem): void {
      thisItemElement.setAttribute('segment-buffer', booleanToString(thisItem.segmentBuffer.isSegmentBuffer));
      thisThreadBoxElement.setAttribute('segment-buffer', booleanToString(thisItem.segmentBuffer.isSegmentBuffer));
    }

    function updateName(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_name').textContent = thisItem.name;
    }

    function updateBuses(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const thisBusesElement = elementQuerySelector(thisItemElement, '.css_route_group_item_buses');
      const busElements = Array.from(elementQuerySelectorAll(thisBusesElement, '.css_route_group_item_bus'));
      const currentBusElementsQuantity = busElements.length;
      const busesQuantity = thisItem.buses.length;
      const difference = currentBusElementsQuantity - busesQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newBusElement = generateElementOfBus();
          fragment.appendChild(newBusElement);
          busElements.push(newBusElement);
        }
        thisBusesElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentBusElementsQuantity - 1, q = currentBusElementsQuantity - difference - 1; p > q; p--) {
          busElements[p].remove();
          busElements.splice(p, 1);
        }
      }

      for (let i = 0; i < busesQuantity; i++) {
        const busItem = thisItem.buses[i];
        const busElement = busElements[i];
        const titleElement = elementQuerySelector(busElement, '.css_route_group_item_bus_title');
        const carNumberElement = elementQuerySelector(titleElement, '.css_route_group_item_bus_car_number');
        const attributesElement = elementQuerySelector(busElement, '.css_route_group_item_bus_attributes');
        const routeAttributeElement = elementQuerySelector(attributesElement, '.css_route_group_item_bus_route');
        const carStatusAttributeElement = elementQuerySelector(attributesElement, '.css_route_group_item_bus_car_status');
        const carTypeAttributeElement = elementQuerySelector(attributesElement, '.css_route_group_item_bus_car_type');
        busElement.setAttribute('on-this-route', booleanToString(busItem.onThisRoute));
        carNumberElement.textContent = busItem.carNumber;
        routeAttributeElement.textContent = `路線：${busItem.RouteName}`;
        carStatusAttributeElement.textContent = `狀態：${busItem.status.text}`;
        carTypeAttributeElement.textContent = `類型：${busItem.type}`;
      }

      thisBusesElement.setAttribute('empty', booleanToString(busesQuantity === 0));
    }

    function updateOverlappingRoutes(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const thisOverlappingRoutesElement = elementQuerySelector(thisItemElement, '.css_route_group_item_overlapping_routes');
      const overlappingRouteElements = Array.from(elementQuerySelectorAll(thisOverlappingRoutesElement, '.css_route_group_item_overlapping_route'));
      const currentOverlappingRouteElementsLength = overlappingRouteElements.length;
      const overlappingRoutesQuantity = thisItem.overlappingRoutes.length;
      const difference = currentOverlappingRouteElementsLength - overlappingRoutesQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newOverlappingRouteElement = generateElementOfOverlappingRoute();
          fragment.appendChild(newOverlappingRouteElement);
          overlappingRouteElements.push(newOverlappingRouteElement);
        }
        thisOverlappingRoutesElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentOverlappingRouteElementsLength - 1, q = currentOverlappingRouteElementsLength - difference - 1; p > q; p--) {
          overlappingRouteElements[p].remove();
          overlappingRouteElements.splice(p, 1);
        }
      }

      for (let i = 0; i < overlappingRoutesQuantity; i++) {
        const overlappingRouteItem = thisItem.overlappingRoutes[i];
        const overlappingRouteElement = overlappingRouteElements[i];
        const titleElement = elementQuerySelector(overlappingRouteElement, '.css_route_group_item_overlapping_route_title');
        const routeNameElement = elementQuerySelector(titleElement, '.css_route_group_item_overlapping_route_name');
        const routeEndPoindsElement = elementQuerySelector(overlappingRouteElement, '.css_route_group_item_overlapping_route_endpoints');
        const actionsElement = elementQuerySelector(overlappingRouteElement, '.css_route_group_item_overlapping_route_actions');
        const viewRouteButtonElement = elementQuerySelector(actionsElement, '.css_route_group_item_overlapping_route_action_button[type="view-route"]');
        const saveToFolderButtonElement = elementQuerySelector(actionsElement, '.css_route_group_item_overlapping_route_action_button[type="save-to-folder"]');

        routeNameElement.textContent = overlappingRouteItem.name;
        routeEndPoindsElement.textContent = overlappingRouteItem.RouteEndPoints.text;

        (function (thisViewRouteButtonElement, thisOverlappingRouteID) {
          thisViewRouteButtonElement.onclick = function () {
            switchRoute(thisOverlappingRouteID);
          };
        })(viewRouteButtonElement, overlappingRouteItem.RouteID);

        (function (thisSaveToFolderButtonElement, thisOverlappingRouteID) {
          thisSaveToFolderButtonElement.onclick = function () {
            openSaveToFolder('route', [thisOverlappingRouteID], thisSaveToFolderButtonElement); // TODO: update buttons of other stop items
          };
          thisSaveToFolderButtonElement.setAttribute('highlighted', booleanToString(isFolderContentSaved('route', thisOverlappingRouteID)));
        })(saveToFolderButtonElement, overlappingRouteItem.RouteID);
      }

      thisOverlappingRoutesElement.setAttribute('empty', booleanToString(overlappingRoutesQuantity === 0));
    }

    function updateBusArrivalTimes(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const thisBusArrivalTimesElement = elementQuerySelector(thisItemElement, '.css_route_group_item_bus_arrival_times');
      const busArrivalTimeElements = Array.from(elementQuerySelectorAll(thisBusArrivalTimesElement, '.css_route_group_item_bus_arrival_time'));
      const currentBusArrivalTimeElementsLength = busArrivalTimeElements.length;
      const busArrivalTimesQuantity = thisItem.busArrivalTimes.length;
      const difference = currentBusArrivalTimeElementsLength - busArrivalTimesQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newBusArrivalTimeElement = generateElementOfBusArrivalTime();
          fragment.appendChild(newBusArrivalTimeElement);
          busArrivalTimeElements.push(newBusArrivalTimeElement);
        }
        thisBusArrivalTimesElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentBusArrivalTimeElementsLength - 1, q = currentBusArrivalTimeElementsLength - difference - 1; p > q; p--) {
          busArrivalTimeElements[p].remove();
          busArrivalTimeElements.splice(p, 1);
        }
      }

      for (let i = 0; i < busArrivalTimesQuantity; i++) {
        const busArrivalTimeItem = thisItem.busArrivalTimes[i];
        const busArrivalTimeElement = busArrivalTimeElements[i];
        const titleElement = elementQuerySelector(busArrivalTimeElement, '.css_route_group_item_bus_arrival_time_title');
        const personalScheduleNameElement = elementQuerySelector(titleElement, '.css_route_group_item_bus_arrival_time_personal_schedule_name');
        const personalScheduleTimeElement = elementQuerySelector(titleElement, '.css_route_group_item_bus_arrival_time_personal_schedule_time');
        const chartElement = elementQuerySelector(busArrivalTimeElement, '.css_route_group_item_bus_arrival_time_chart');
        personalScheduleNameElement.textContent = busArrivalTimeItem.personalSchedule.name;
        personalScheduleTimeElement.textContent = `週${indexToDay(busArrivalTimeItem.day).name} ${timeObjectToString(busArrivalTimeItem.personalSchedule.period.start)} - ${timeObjectToString(busArrivalTimeItem.personalSchedule.period.end)}`;
        chartElement.innerHTML = decoder.decode(busArrivalTimeItem.chart);
      }

      thisBusArrivalTimesElement.setAttribute('empty', booleanToString(busArrivalTimesQuantity === 0));
    }

    function updateNearbyLocations(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const thisNearbyLocationsElement = elementQuerySelector(thisItemElement, '.css_route_group_item_nearby_locations');
      const nearbyLocationElements = Array.from(elementQuerySelectorAll(thisNearbyLocationsElement, '.css_route_group_item_nearby_location'));
      const currentNearbyLocationElementsLength = nearbyLocationElements.length;
      const nearbyLocationsQuantity = thisItem.nearbyLocations.length;
      const difference = currentNearbyLocationElementsLength - nearbyLocationsQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newOverlappingRouteElement = generateElementOfNearbyLocation();
          fragment.appendChild(newOverlappingRouteElement);
          nearbyLocationElements.push(newOverlappingRouteElement);
        }
        thisNearbyLocationsElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentNearbyLocationElementsLength - 1, q = currentNearbyLocationElementsLength - difference - 1; p > q; p--) {
          nearbyLocationElements[p].remove();
          nearbyLocationElements.splice(p, 1);
        }
      }

      for (let i = 0; i < nearbyLocationsQuantity; i++) {
        const nearbyLocationItem = thisItem.nearbyLocations[i];
        const nearbyLocationElement = nearbyLocationElements[i];
        const titleElement = elementQuerySelector(nearbyLocationElement, '.css_route_group_item_nearby_location_title');
        const locationNameElement = elementQuerySelector(titleElement, '.css_route_group_item_nearby_location_name');
        const distanceElement = elementQuerySelector(nearbyLocationElement, '.css_route_group_item_nearby_location_distance');
        const actionsElement = elementQuerySelector(nearbyLocationElement, '.css_route_group_item_nearby_location_actions');
        const viewLocationButtonElement = elementQuerySelector(actionsElement, '.css_route_group_item_nearby_location_action_button[type="view-location"]');
        const saveToFolderButtonElement = elementQuerySelector(actionsElement, '.css_route_group_item_nearby_location_action_button[type="save-to-folder"]');

        locationNameElement.textContent = nearbyLocationItem.name;
        distanceElement.textContent = `${nearbyLocationItem.distance}公尺`;

        (function (thisViewLocationButtonElement, thisNearbyLocationHash) {
          thisViewLocationButtonElement.onclick = function () {
            openLocation(thisNearbyLocationHash);
          };
        })(viewLocationButtonElement, nearbyLocationItem.hash);

        (function (thisSaveToFolderButtonElement, thisNearbyLocationHash) {
          thisSaveToFolderButtonElement.onclick = function () {
            openSaveToFolder('location', [thisNearbyLocationHash], thisSaveToFolderButtonElement); // TODO: update buttons of other stop items
          };
          thisSaveToFolderButtonElement.setAttribute('highlighted', booleanToString(isFolderContentSaved('location', thisNearbyLocationHash)));
        })(saveToFolderButtonElement, nearbyLocationItem.hash);
      }

      thisNearbyLocationsElement.setAttribute('empty', booleanToString(nearbyLocationsQuantity === 0));
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
          if (routeVisibilityMonitor.isVisible(thisItemElement)) {
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
        // the states are cleared (L1137)
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
        openSaveToFolder('stop', [thisItem.id, integration.RouteID], saveToFolderButtonElement);
      };
      saveToFolderButtonElement.setAttribute('highlighted', booleanToString(isFolderContentSaved('stop', thisItem.id)));
    }

    function updateScheduleNotificationButton(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const scheduleNotificationButtonElement = elementQuerySelector(thisItemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="schedule-notification"]');
      scheduleNotificationButtonElement.onclick = function () {
        openScheduleNotification(scheduleNotificationButtonElement, thisItem.id, integration.RouteID, thisItem.status.time);
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
      if (!deepEqual(previousItem.buses, thisItem.buses)) {
        updateBuses(thisItemElement, thisItem);
      }
      if (
        !deepEqual(
          previousItem.busArrivalTimes.map((e) => e.state),
          thisItem.busArrivalTimes.map((e) => e.state)
        )
      ) {
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
  const groupNames = integration.groupNames;
  const groupKeys = [];
  for (const groupKey in itemQuantity) {
    groupKeys.push(groupKey);
  }

  routeSliding_groupQuantity = groupQuantity;
  routeSliding_fieldWidth = FieldWidth;
  routeSliding_fieldHeight = FieldHeight;

  let cumulativeOffset = 0;

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = groupKeys[i];
    const width = getTextWidth(groupNames[groupKey], 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
    routeSliding_groupStyles[`gs_${i}`] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  routeSliding_groupStyles[`gs_${groupQuantity}`] = {
    width: 0,
    offset: cumulativeOffset
  };

  if (!routeSliding_sliding) {
    const initialGroupKey = `gs_${routeSliding_initialIndex}`;
    const initialGroupStyle = routeSliding_groupStyles[initialGroupKey];
    const offset = initialGroupStyle.offset * -1 + routeSliding_fieldWidth * 0.5 - initialGroupStyle.width * 0.5;
    const tabLineWidth = initialGroupStyle.width - tabPadding;
    updateRouteCSS(routeSliding_groupQuantity, offset, tabLineWidth, routeSliding_initialIndex);
  }

  if (previousSkeletonScreen !== skeletonScreen) {
    HeadNameElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    GroupTabsElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    GroupTabLineTrackElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  }

  if (previousAnimation !== animation) {
    HeadNameElement.setAttribute('animation', booleanToString(animation));
    GroupTabsElement.setAttribute('animation', booleanToString(animation));
    GroupTabLineTrackElement.setAttribute('animation', booleanToString(animation));
  }

  if (previousIntegration?.RouteID !== integration.RouteID) {
    HeadButtonRightElement.onclick = function () {
      openRouteDetails(integration.RouteID);
    };
  }

  if (previousIntegration?.RouteName !== integration.RouteName) {
    HeadNameSpanElement.textContent = integration.RouteName;
  }

  const groupElementsLength = groupElements.length;
  if (groupQuantity !== groupElementsLength) {
    const difference = groupElementsLength - groupQuantity;
    if (difference < 0) {
      const newGroupsFragment = new DocumentFragment();
      const newTabsFragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newGroupElement = generateElementOfGroup();
        newGroupsFragment.appendChild(newGroupElement);
        groupElements.push(newGroupElement);
        const newTabElement = generateElementOfTab();
        newTabsFragment.appendChild(newTabElement);
        tabElements.push(newTabElement);
        // push an empty array to hold its children
        itemElements.push([]);
        threadBoxElements.push([]);
        stretchStates.push(new BitState(1));
      }
      GroupsElement.append(newGroupsFragment);
      GroupTabsTrayElement.append(newTabsFragment);
    } else if (difference > 0) {
      for (let p = groupElementsLength - 1, q = groupElementsLength - difference - 1; p > q; p--) {
        groupElements[p].remove();
        groupElements.splice(p, 1);
        tabElements[p].remove();
        tabElements.splice(p, 1);
        itemElements.splice(p, 1);
        threadBoxElements.splice(p, 1);
        // the children are already removed since thier parant nodes are removed
        stretchStates.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = groupKeys[i];

    const thisGroupElement = groupElements[i];
    const thisGroupItemsTrackElement = elementQuerySelector(thisGroupElement, '.css_route_group_items_track');
    const thisGroupThreadsTrackElement = elementQuerySelector(thisGroupElement, '.css_route_group_threads_track');

    const currentItemElementsLength = itemElements[i].length;
    if (itemQuantity[groupKey] !== currentItemElementsLength) {
      const difference = currentItemElementsLength - itemQuantity[groupKey];
      if (difference < 0) {
        const newItemsFragment = new DocumentFragment();
        const newThreadBoxesFragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newThreadBoxElement = generateElementOfThreadBox(-1 * currentItemElementsLength + o);
          const newItemElement = generateElementOfItem(i);
          newItemsFragment.appendChild(newItemElement);
          itemElements[i].push(newItemElement);
          newThreadBoxesFragment.appendChild(newThreadBoxElement);
          threadBoxElements[i].push(newThreadBoxElement);
        }
        thisGroupItemsTrackElement.append(newItemsFragment);
        thisGroupThreadsTrackElement.append(newThreadBoxesFragment);
        routeVisibilityMonitor.add(itemElements[i].slice(currentItemElementsLength));
        stretchStates[i].resize(itemQuantity[groupKey]);
      } else if (difference > 0) {
        for (let p = currentItemElementsLength - 1, q = currentItemElementsLength - difference - 1; p > q; p--) {
          itemElements[i][p].remove();
          itemElements[i].splice(p, 1);
          threadBoxElements[i][p].remove();
          threadBoxElements[i].splice(p, 1);
        }
        stretchStates[i].resize(itemQuantity[groupKey]);
      }
    }

    const thisTabElement = tabElements[i];
    const thisTabSpanElement = elementQuerySelector(thisTabElement, 'span');
    thisTabSpanElement.textContent = groupNames[groupKey];
    thisTabElement.style.setProperty('--b-cssvar-route-tab-offset', `${routeSliding_groupStyles[`gs_${i}`].offset}px`);
    thisTabElement.style.setProperty('--b-cssvar-route-tab-width', `${routeSliding_groupStyles[`gs_${i}`].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-route-tab-index', i.toString());

    if (skeletonScreen) {
      thisGroupElement.scrollTop = 0;
      stretchStates[i].clear(); // clear state for updateStretch()
    }

    for (let j = 0; j < itemQuantity[groupKey]; j++) {
      const thisItemElement = itemElements[i][j];
      const thisThreadBoxElement = threadBoxElements[i][j];
      const thisItem = groupedItems[groupKey][j];
      if (hasOwnProperty(previousIntegration, 'groupedItems')) {
        if (hasOwnProperty(previousIntegration.groupedItems, groupKey)) {
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

  GroupTabsTrayElement.style.setProperty('--b-cssvar-route-tabs-tray-width', `${cumulativeOffset}px`);

  previousIntegration = integration;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

async function refreshRoute(): Promise<number> {
  try {
    const playing_animation = getSettingOptionValue('playing_animation');
    const refresh_interval_setting = getSettingOptionValue('refresh_interval');
    const busArrivalTimeChartSize = querySize('route-bus-arrival-time-chart');
    UpdateTimerElement.setAttribute('refreshing', 'true');
    UpdateTimerElement.classList.remove('css_route_update_timer_scale_down');
    const integration = await integrateRoute(currentRouteID, busArrivalTimeChartSize.width, busArrivalTimeChartSize.height, function (message) {
      UpdateTimerElement.style.setProperty('--b-cssvar-route-update-timer-scale-x', message.percent.toString());
    });
    updateRouteField(integration, false, playing_animation);
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
    UpdateTimerElement.setAttribute('refreshing', 'false');
    const interval = Math.max(5000, nextUpdate - lastUpdate);
    animateUpdateTimer(interval);
    return interval;
  } catch (err) {
    promptMessage('error', `路線發生錯誤，將在${routeTickRetryInterval / 1000}秒後重試。`);
    animateUpdateTimer(routeTickRetryInterval);
    return routeTickRetryInterval;
  }
}

function initializeRouteFeild(RouteID: IntegratedRoute['RouteID']): void {
  currentRouteID = RouteID;

  routeSliding_initialIndex = 0;
  routeSliding_groupStyles = {};

  GroupsElement.scrollLeft = 0;
  GroupsElement.focus();

  setupRouteFieldSkeletonScreen();

  if (routeTick.isPaused) {
    routeTick.resume(true);
  } else {
    routeTick.tick();
  }
}

export function showRoute(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideRoute(): void {
  Field.setAttribute('displayed', 'false');
}

export function openRoute(RouteID: IntegratedRoute['RouteID']): void {
  pushPageHistory('Route');
  logRecentView('route', RouteID);
  showRoute();
  initializeRouteFeild(RouteID);
  hidePreviousPage();
}

export function closeRoute(): void {
  hideRoute();
  routeTick.pause();
  showPreviousPage();
  revokePageHistory('Route');
}

export function switchRoute(RouteID: IntegratedRoute['RouteID']): void {
  routeTick.pause();
  openRoute(RouteID);
}

export function stretchRouteItem(groupIndex: number, itemElement: HTMLElement): void {
  const index = itemElements[groupIndex].indexOf(itemElement);
  if (index < 0) return;

  const itemElementsLength = itemElements[groupIndex].length;

  const threadBoxElement = threadBoxElements[groupIndex][index];
  const itemBodyElement = elementQuerySelector(itemElement, '.css_route_group_item_body');

  const elementY = getElementRelativeTop(groupIndex, index);

  const stretched = stretchStates[groupIndex].state[index] === 1;
  const animation = previousAnimation;

  if (animation) {
    const pushDirection = stretched ? '2' : '1';

    // Separate the elements from the document flow while keeping its position
    threadBoxElement.setAttribute('stretching', 'true');
    threadBoxElement.style.setProperty('--b-cssvar-css-route-group-thread-box-y', `${elementY}px`);

    itemElement.setAttribute('stretching', 'true');
    itemElement.style.setProperty('--b-cssvar-css-route-group-item-y', `${elementY}px`);

    // Set push direction and push state
    for (let i = index + 1; i < itemElementsLength; i++) {
      const thisItemElement = itemElements[groupIndex][i];
      const thisThreadBoxElement = threadBoxElements[groupIndex][i];
      thisThreadBoxElement.setAttribute('push-direction', pushDirection);
      thisThreadBoxElement.setAttribute('push-state', '1');
      thisItemElement.setAttribute('push-direction', pushDirection);
      thisItemElement.setAttribute('push-state', '1');
    }

    itemBodyElement.addEventListener(
      'transitionend',
      function () {
        // Reset the push direction and push state
        for (let i = index + 1; i < itemElementsLength; i++) {
          const thisItemElement = itemElements[groupIndex][i];
          const thisThreadBoxElement = threadBoxElements[groupIndex][i];
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

    itemBodyElement.addEventListener(
      'transitionstart',
      function () {
        // Transition the elements below
        for (let i = index + 1; i < itemElementsLength; i++) {
          const thisItemElement = itemElements[groupIndex][i];
          const thisThreadBoxElement = threadBoxElements[groupIndex][i];
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
    stretchStates[groupIndex].set(index, 0);
  } else {
    itemBodyElement.setAttribute('displayed', 'true');
    itemElement.setAttribute('stretched', 'true');
    threadBoxElement.setAttribute('stretched', 'true');
    stretchStates[groupIndex].set(index, 1);
  }
}

export function switchRouteBodyTab(itemElement: HTMLElement, tabCode: number): void {
  const buttonsElement = elementQuerySelector(itemElement, '.css_route_group_item_buttons');
  const buttonElements = elementQuerySelectorAll(buttonsElement, '.css_route_group_item_button[type="tab"]');
  const tabElements = [elementQuerySelector(itemElement, '.css_route_group_item_buses'), elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times'), elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes'), elementQuerySelector(itemElement, '.css_route_group_item_nearby_locations')];
  const state = new Array(4).fill('false');
  state[tabCode] = 'true';
  for (let i = 0; i < 4; i++) {
    buttonElements[i].setAttribute('highlighted', state[i]);
    tabElements[i].setAttribute('displayed', state[i]);
  }
}

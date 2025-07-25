import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { DataReceivingProgressEvent } from '../../data/apis/loader';
import { isFolderContentSaved } from '../../data/folder/index';
import { IntegratedLocation, IntegratedLocationItem, integrateLocation, LocationGroupProperty } from '../../data/location/index';
import { stopHasNotifcationSchedules } from '../../data/notification/index';
import { logRecentView } from '../../data/recent-views/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { getTextWidth } from '../../tools/graphic';
import { booleanToString, compareThings, generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll, getElementsBelow } from '../../tools/query-selector';
import { indexToDay, timeObjectToString } from '../../tools/time';
import { getIconHTML } from '../icons/index';
import { closePreviousPage, GeneratedElement, GroupStyles, openPreviousPage, pushPageHistory, querySize } from '../index';
import { promptMessage } from '../prompt/index';
import { openSaveToFolder } from '../save-to-folder/index';
import { openScheduleNotification } from '../schedule-notification/index';
import { openLocationDetails } from './details/index';

const LocationField = documentQuerySelector('.css_location_field');
const LocationHeadElement = elementQuerySelector(LocationField, '.css_location_head');
const LocationNameElement = elementQuerySelector(LocationHeadElement, '.css_location_name');
const LocationButtonRightElement = elementQuerySelector(LocationHeadElement, '.css_location_button_right');
const LocationGroupsElement = elementQuerySelector(LocationField, '.css_location_groups');
const LocationGroupTabsElement = elementQuerySelector(LocationHeadElement, '.css_location_group_tabs');
const LocationGroupTabsTrayElement = elementQuerySelector(LocationGroupTabsElement, '.css_location_group_tabs_tray');
const LocationGroupTabLineTrackElement = elementQuerySelector(LocationHeadElement, '.css_location_group_tab_line_track');
const LocationGroupTabLineElement = elementQuerySelector(LocationGroupTabLineTrackElement, '.css_location_group_tab_line');
const LocationUpdateTimerElement = elementQuerySelector(LocationHeadElement, '.css_location_update_timer_box .css_location_update_timer');

let previousIntegration = {} as IntegratedLocation;
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

let locationSliding_initialIndex: number = 0;
let locationSliding_targetIndex: number = 0;
let locationSliding_groupQuantity: number = 0;
let locationSliding_groupStyles: GroupStyles = {};
let locationSliding_fieldWidth: number = 0;
let locationSliding_fieldHeight: number = 0;
let locationSliding_sliding: boolean = false;

let locationRefreshTimer_retryInterval: number = 10 * 1000;
let locationRefreshTimer_baseInterval: number = 15 * 1000;
let locationRefreshTimer_minInterval: number = 5 * 1000;
let locationRefreshTimer_dynamicInterval: number = 15 * 1000;
let locationRefreshTimer_dynamic: boolean = true;
let locationRefreshTimer_lastUpdate: number = 0;
let locationRefreshTimer_nextUpdate: number = 0;
let locationRefreshTimer_currentRequestID: string = '';
let locationRefreshTimer_refreshing: boolean = false;
let locationRefreshTimer_streaming: boolean = false;
let locationRefreshTimer_streamStarted: boolean = false;

let currentHashSet_hash: string = '';

let tabPadding: number = 20;

export function initializeLocationSliding(): void {
  LocationGroupsElement.addEventListener(
    'touchstart',
    function () {
      locationSliding_initialIndex = Math.round(LocationGroupsElement.scrollLeft / locationSliding_fieldWidth);
    },
    { passive: true }
  );

  LocationGroupsElement.addEventListener(
    'scroll',
    function (event: Event) {
      locationSliding_sliding = true;
      const target = event.target as HTMLElement;
      const currentIndex = target.scrollLeft / locationSliding_fieldWidth;
      if (currentIndex > locationSliding_initialIndex) {
        locationSliding_targetIndex = locationSliding_initialIndex + 1;
      } else {
        locationSliding_targetIndex = locationSliding_initialIndex - 1;
      }
      const initialSize = locationSliding_groupStyles[`g_${locationSliding_initialIndex}`] || { width: 0, offset: 0 };
      const targetSize = locationSliding_groupStyles[`g_${locationSliding_targetIndex}`] || { width: 0, offset: 0 };
      const tabWidth = initialSize.width + (targetSize.width - initialSize.width) * Math.abs(currentIndex - locationSliding_initialIndex);
      const offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * Math.abs(currentIndex - locationSliding_initialIndex)) * -1 + locationSliding_fieldWidth * 0.5 - tabWidth * 0.5;
      updateLocationCSS(locationSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);
      if (currentIndex === locationSliding_targetIndex) {
        locationSliding_initialIndex = Math.round(LocationGroupsElement.scrollLeft / locationSliding_fieldWidth);
        locationSliding_sliding = false;
      }
    },
    { passive: true }
  );
}

export function updateLocationCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  LocationGroupsElement.style.setProperty('--b-cssvar-location-group-quantity', groupQuantity.toString());
  LocationGroupTabLineElement.style.setProperty('--b-cssvar-location-tab-line-width-scale', tabLineWidth.toString());
  LocationGroupTabsTrayElement.style.setProperty('--b-cssvar-location-tabs-tray-offset', `${offset.toFixed(5)}px`);
  LocationGroupTabsTrayElement.style.setProperty('--b-cssvar-location-percentage', percentage.toFixed(5));
}

function animateUpdateTimer(): void {
  LocationUpdateTimerElement.style.setProperty('--b-cssvar-location-update-timer-interval', `${locationRefreshTimer_dynamicInterval}ms`);
  LocationUpdateTimerElement.classList.add('css_location_update_timer_slide_rtl');
}

function handleDataReceivingProgressUpdates(event: Event): void {
  const CustomEvent = event as DataReceivingProgressEvent;
  if (locationRefreshTimer_refreshing) {
    const offsetRatio = CustomEvent.detail.progress - 1;
    LocationUpdateTimerElement.style.setProperty('--b-cssvar-location-update-timer-offset-ratio', offsetRatio.toString());
  }
  if (CustomEvent.detail.stage === 'end') {
    document.removeEventListener(CustomEvent.detail.target, handleDataReceivingProgressUpdates);
  }
}

function generateElementOfItem(): GeneratedElement {
  const identifier = generateIdentifier();

  // Main container
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_location_group_item');
  itemElement.id = identifier;
  itemElement.setAttribute('stretched', 'false');
  itemElement.setAttribute('stretching', 'false');
  itemElement.setAttribute('push-direction', '0');
  itemElement.setAttribute('push-state', '0');

  // Head
  const headElement = document.createElement('div');
  headElement.classList.add('css_location_group_item_head');

  // Rank
  const rankElement = document.createElement('div');
  rankElement.classList.add('css_location_group_item_rank');
  const rankNextSlideElement = document.createElement('div');
  rankNextSlideElement.classList.add('css_location_group_item_rank_next_slide');
  rankNextSlideElement.setAttribute('code', '-1');
  rankNextSlideElement.setAttribute('displayed', 'false');
  const rankCurrentSlideElement = document.createElement('div');
  rankCurrentSlideElement.classList.add('css_location_group_item_rank_current_slide');
  rankCurrentSlideElement.setAttribute('code', '-1');
  rankCurrentSlideElement.setAttribute('displayed', 'true');
  rankElement.appendChild(rankNextSlideElement);
  rankElement.appendChild(rankCurrentSlideElement);

  // Route direction
  const routeDirectionElement = document.createElement('div');
  routeDirectionElement.classList.add('css_location_group_item_route_direction');

  // Route name
  const routeNameElement = document.createElement('div');
  routeNameElement.classList.add('css_location_group_item_route_name');

  // Capsule
  const capsuleElement = document.createElement('div');
  capsuleElement.classList.add('css_location_group_item_capsule');

  // Status
  const statusElement = document.createElement('div');
  statusElement.classList.add('css_location_group_item_status');
  const nextSlideElement = document.createElement('div');
  nextSlideElement.classList.add('css_next_slide');
  nextSlideElement.setAttribute('code', '0');
  nextSlideElement.setAttribute('displayed', 'false');
  const currentSlideElement = document.createElement('div');
  currentSlideElement.classList.add('css_current_slide');
  currentSlideElement.setAttribute('code', '0');
  currentSlideElement.setAttribute('displayed', 'true');
  statusElement.appendChild(nextSlideElement);
  statusElement.appendChild(currentSlideElement);

  // Stretch button
  const stretchElement = document.createElement('div');
  stretchElement.classList.add('css_location_group_item_stretch');
  stretchElement.innerHTML = getIconHTML('keyboard_arrow_down');
  stretchElement.onclick = () => {
    stretchLocationItem(identifier);
  };

  // Capsule separator
  const capsuleSeparatorElement = document.createElement('div');
  capsuleSeparatorElement.classList.add('css_location_group_item_capsule_separator');

  // Assemble capsule
  capsuleElement.appendChild(statusElement);
  capsuleElement.appendChild(stretchElement);
  capsuleElement.appendChild(capsuleSeparatorElement);

  // Assemble head
  headElement.appendChild(rankElement);
  headElement.appendChild(routeDirectionElement);
  headElement.appendChild(routeNameElement);
  headElement.appendChild(capsuleElement);

  // Body
  const bodyElement = document.createElement('div');
  bodyElement.classList.add('css_location_group_item_body');
  bodyElement.setAttribute('displayed', 'false');

  // Buttons
  const buttonsElement = document.createElement('div');
  buttonsElement.classList.add('css_location_group_item_buttons');

  // Tab: 公車
  const busTabButtonElement = document.createElement('div');
  busTabButtonElement.classList.add('css_location_group_item_button');
  busTabButtonElement.setAttribute('highlighted', 'true');
  busTabButtonElement.setAttribute('type', 'tab');
  busTabButtonElement.setAttribute('code', '0');
  const busTabIconElement = document.createElement('div');
  busTabIconElement.classList.add('css_location_group_item_button_icon');
  busTabIconElement.innerHTML = getIconHTML('directions_bus');
  busTabButtonElement.appendChild(busTabIconElement);
  busTabButtonElement.appendChild(document.createTextNode('公車'));
  busTabButtonElement.onclick = () => {
    switchLocationBodyTab(identifier, 0);
  };

  // Tab: 抵達時間
  const arrivalTabButtonElement = document.createElement('div');
  arrivalTabButtonElement.classList.add('css_location_group_item_button');
  arrivalTabButtonElement.setAttribute('highlighted', 'false');
  arrivalTabButtonElement.setAttribute('type', 'tab');
  arrivalTabButtonElement.setAttribute('code', '1');
  const arrivalTabIconElement = document.createElement('div');
  arrivalTabIconElement.classList.add('css_location_group_item_button_icon');
  arrivalTabIconElement.innerHTML = getIconHTML('departure_board');
  arrivalTabButtonElement.appendChild(arrivalTabIconElement);
  arrivalTabButtonElement.appendChild(document.createTextNode('抵達時間'));
  arrivalTabButtonElement.onclick = () => {
    switchLocationBodyTab(identifier, 1);
  };

  // Button: 儲存
  const saveButtonElement = document.createElement('div');
  saveButtonElement.classList.add('css_location_group_item_button');
  saveButtonElement.setAttribute('highlighted', 'false');
  saveButtonElement.setAttribute('type', 'save-to-folder');
  const saveButtonIconElement = document.createElement('div');
  saveButtonIconElement.classList.add('css_location_group_item_button_icon');
  saveButtonIconElement.innerHTML = getIconHTML('folder');
  saveButtonElement.appendChild(saveButtonIconElement);
  saveButtonElement.appendChild(document.createTextNode('儲存'));
  /*
  saveButtonElement.onclick = () => {
    openSaveToFolder('stop-on-location', [identifier, null, null]);
  };
  */

  // Button: 到站通知
  const notifyButtonElement = document.createElement('div');
  notifyButtonElement.classList.add('css_location_group_item_button');
  notifyButtonElement.setAttribute('highlighted', 'false');
  notifyButtonElement.setAttribute('type', 'schedule-notification');
  notifyButtonElement.setAttribute('enabled', 'true');
  const notifyButtonIconElement = document.createElement('div');
  notifyButtonIconElement.classList.add('css_location_group_item_button_icon');
  notifyButtonIconElement.innerHTML = getIconHTML('notifications');
  notifyButtonElement.appendChild(notifyButtonIconElement);
  notifyButtonElement.appendChild(document.createTextNode('到站通知'));
  /*
  notifyButtonElement.onclick = () => {
    openScheduleNotification('stop-on-location', [identifier, null, null, null]);
  };
  */

  // Assemble buttons
  buttonsElement.appendChild(busTabButtonElement);
  buttonsElement.appendChild(arrivalTabButtonElement);
  buttonsElement.appendChild(saveButtonElement);
  buttonsElement.appendChild(notifyButtonElement);

  // Buses
  const busesElement = document.createElement('div');
  busesElement.classList.add('css_location_group_item_buses');
  busesElement.setAttribute('displayed', 'true');

  // Bus arrival times
  const busArrivalTimesElement = document.createElement('div');
  busArrivalTimesElement.classList.add('css_location_group_item_bus_arrival_times');
  busArrivalTimesElement.setAttribute('displayed', 'false');

  // Assemble body
  bodyElement.appendChild(buttonsElement);
  bodyElement.appendChild(busesElement);
  bodyElement.appendChild(busArrivalTimesElement);

  // Assemble item
  itemElement.appendChild(headElement);
  itemElement.appendChild(bodyElement);

  return {
    element: itemElement,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  // Main container
  const groupElement = document.createElement('div');
  groupElement.classList.add('css_location_group');

  // Details
  const detailsElement = document.createElement('div');
  detailsElement.classList.add('css_location_group_details');

  // Details body
  const detailsBodyElement = document.createElement('div');
  detailsBodyElement.classList.add('css_location_group_details_body');
  detailsElement.appendChild(detailsBodyElement);

  // Items
  const itemsElement = document.createElement('div');
  itemsElement.classList.add('css_location_group_items');

  // Assemble group
  groupElement.appendChild(detailsElement);
  groupElement.appendChild(itemsElement);

  return {
    element: groupElement,
    id: ''
  };
}

function generateElementOfTab(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_location_group_tab');

  const span = document.createElement('span');
  element.appendChild(span);

  return {
    element: element,
    id: ''
  };
}

function generateElementOfGroupDetailsProperty(): GeneratedElement {
  // Main container
  const propertyElement = document.createElement('div');
  propertyElement.classList.add('css_location_group_details_property');

  // Icon
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_location_details_property_icon');

  // Value
  const valueElement = document.createElement('div');
  valueElement.classList.add('css_location_details_property_value');

  // Assemble
  propertyElement.appendChild(iconElement);
  propertyElement.appendChild(valueElement);

  return {
    element: propertyElement,
    id: ''
  };
}

function setUpLocationFieldSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  const defaultItemQuantity: IntegratedLocation['itemQuantity'] = { g_0: Math.floor(FieldHeight / 50) + 5, g_1: Math.floor(FieldHeight / 50) + 5 };
  const defaultGroupQuantity = 2;
  let groupedItems: IntegratedLocation['groupedItems'] = {};
  for (let i = 0; i < defaultGroupQuantity; i++) {
    const groupKey = `g_${i}`;
    groupedItems[groupKey] = [];
    for (let j = 0; j < defaultItemQuantity[groupKey]; j++) {
      groupedItems[groupKey].push({
        route_name: '',
        route_direction: '',
        routeId: 0,
        stopId: 0,
        status: {
          code: 8,
          text: '',
          time: -6
        },
        ranking: {
          number: 0,
          text: '--',
          code: -1
        },
        buses: [],
        busArrivalTimes: []
      });
    }
  }
  updateLocationField(
    {
      groupedItems: groupedItems,
      groupQuantity: defaultGroupQuantity,
      groups: {
        g_0: {
          name: '載入中',
          properties: [
            {
              key: '0',
              icon: '',
              value: ''
            },
            {
              key: '1',
              icon: '',
              value: ''
            },
            {
              key: '2',
              icon: '',
              value: ''
            }
          ]
        },
        g_1: {
          name: '載入中',
          properties: [
            {
              key: '0',
              icon: '',
              value: ''
            },
            {
              key: '1',
              icon: '',
              value: ''
            },
            {
              key: '2',
              icon: '',
              value: ''
            }
          ]
        }
      },
      itemQuantity: defaultItemQuantity,
      LocationName: '載入中',
      hash: '',
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

function updateLocationField(integration: IntegratedLocation, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedLocationItem, previousItem: IntegratedLocationItem | null): void {
    function updateStatus(thisElement: HTMLElement, thisItem: IntegratedLocationItem, animation: boolean): void {
      const thisElementRect = thisElement.getBoundingClientRect();
      const top = thisElementRect.top;
      const left = thisElementRect.left;
      const bottom = thisElementRect.bottom;
      const right = thisElementRect.right;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const thisItemStatusElement = elementQuerySelector(thisElement, '.css_location_group_item_status');
      const nextSlideElement = elementQuerySelector(thisItemStatusElement, '.css_next_slide');
      const currentSlideElement = elementQuerySelector(thisItemStatusElement, '.css_current_slide');

      nextSlideElement.setAttribute('code', thisItem.status.code.toString());
      nextSlideElement.innerText = thisItem.status.text;

      if (animation && bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
        currentSlideElement.addEventListener(
          'animationend',
          function () {
            currentSlideElement.setAttribute('code', thisItem.status.code.toString());
            currentSlideElement.innerText = thisItem.status.text;
            currentSlideElement.classList.remove('css_slide_fade_out');
            nextSlideElement.setAttribute('displayed', 'false');
          },
          { once: true }
        );
        nextSlideElement.setAttribute('displayed', 'true');
        currentSlideElement.classList.add('css_slide_fade_out');
      } else {
        currentSlideElement.setAttribute('code', thisItem.status.code.toString());
        currentSlideElement.innerText = thisItem.status.text;
      }
    }

    function updateRank(thisElement: HTMLElement, thisItem: IntegratedLocationItem, animation: boolean): void {
      const thisElementRect = thisElement.getBoundingClientRect();
      const top = thisElementRect.top;
      const left = thisElementRect.left;
      const bottom = thisElementRect.bottom;
      const right = thisElementRect.right;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const thisRankElement = elementQuerySelector(thisElement, '.css_location_group_item_rank');
      const nextSlideElement = elementQuerySelector(thisRankElement, '.css_location_group_item_rank_next_slide');
      const currentSlideElement = elementQuerySelector(thisRankElement, '.css_location_group_item_rank_current_slide');

      nextSlideElement.setAttribute('code', thisItem.ranking.code.toString());
      nextSlideElement.innerText = thisItem.ranking.text;

      if (animation && bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
        currentSlideElement.addEventListener(
          'animationend',
          function () {
            currentSlideElement.setAttribute('code', thisItem.ranking.code.toString());
            currentSlideElement.innerText = thisItem.ranking.text;
            currentSlideElement.classList.remove('css_location_group_item_rank_current_slide_fade_out');
            nextSlideElement.setAttribute('displayed', 'false');
          },
          { once: true }
        );
        nextSlideElement.setAttribute('displayed', 'true');
        currentSlideElement.classList.add('css_location_group_item_rank_current_slide_fade_out');
      } else {
        currentSlideElement.setAttribute('code', thisItem.ranking.code.toString());
        currentSlideElement.innerText = thisItem.ranking.text;
      }
    }

    function updateRouteDirection(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisRouteDirectionElement = elementQuerySelector(thisElement, '.css_location_group_item_route_direction');
      thisRouteDirectionElement.innerText = thisItem.route_direction;
    }

    function updateRouteName(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisRouteNameElement = elementQuerySelector(thisElement, '.css_location_group_item_route_name');
      thisRouteNameElement.innerText = thisItem.route_name;
      // TODO: selector
    }

    function updateBuses(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisBusesElement = elementQuerySelector(thisElement, '.css_location_group_item_buses');
      thisBusesElement.innerHTML = thisItem.buses.length === 0 ? '<div class="css_location_group_item_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_location_group_item_bus" on-this-route="${bus.onThisRoute}"><div class="css_location_group_item_bus_title"><div class="css_location_group_item_bus_icon">${getIconHTML('directions_bus')}</div><div class="css_location_group_item_bus_car_number">${bus.carNumber}</div></div><div class="css_location_group_item_bus_attributes"><div class="css_location_group_item_bus_route">路線：${bus.RouteName}</div><div class="css_location_group_item_bus_car_status">狀態：${bus.status.text}</div><div class="css_location_group_item_bus_car_type">類型：${bus.type}</div></div></div>`).join('');
    }

    function updateBusArrivalTimes(thisItemElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisBusArrivalTimesElement = elementQuerySelector(thisItemElement, '.css_location_group_item_bus_arrival_times');
      thisBusArrivalTimesElement.innerHTML = thisItem.busArrivalTimes.length === 0 ? '<div class="css_location_group_item_bus_arrival_message">目前沒有抵達時間可顯示</div>' : thisItem.busArrivalTimes.map((busArrivalTime) => `<div class="css_location_group_item_bus_arrival_time"><div class="css_location_group_item_bus_arrival_time_title"><div class="css_location_group_item_bus_arrival_time_icon">${getIconHTML('calendar_view_day')}</div><div class="css_location_group_item_bus_arrival_time_personal_schedule_name">${busArrivalTime.personalSchedule.name}</div><div class="css_location_group_item_bus_arrival_time_personal_schedule_time">週${indexToDay(busArrivalTime.day).name} ${timeObjectToString(busArrivalTime.personalSchedule.period.start)} - ${timeObjectToString(busArrivalTime.personalSchedule.period.end)}</div></div><div class="css_location_group_item_bus_arrival_time_chart">${busArrivalTime.chart}</div></div>`).join('');
    }

    function updateStretch(thisElement: HTMLElement, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        thisElement.setAttribute('stretched', 'false');
      }
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    function updateSaveToFolderButton(thisItemElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisItemBodyElement = elementQuerySelector(thisItemElement, '.css_location_group_item_body');
      const thisItemButtonsElement = elementQuerySelector(thisItemBodyElement, '.css_location_group_item_buttons');
      const saveToFolderButtonElement = elementQuerySelector(thisItemButtonsElement, '.css_location_group_item_button[type="save-to-folder"]');
      saveToFolderButtonElement.onclick = function () {
        openSaveToFolder('stop-on-location', [thisItemElement.id, thisItem.stopId, thisItem.routeId]);
      };
      isFolderContentSaved('stop', thisItem.stopId).then((e) => {
        saveToFolderButtonElement.setAttribute('highlighted', booleanToString(e));
      });
    }

    function updateScheduleNotificationButton(thisItemElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisItemBodyElement = elementQuerySelector(thisItemElement, '.css_location_group_item_body');
      const thisItemButtonsElement = elementQuerySelector(thisItemBodyElement, '.css_location_group_item_buttons');
      const scheduleNotificationButtonElement = elementQuerySelector(thisItemButtonsElement, '.css_location_group_item_button[type="schedule-notification"]');
      scheduleNotificationButtonElement.onclick = function () {
        openScheduleNotification('stop-on-location', [thisItemElement.id, thisItem.stopId, thisItem.routeId, thisItem.status.time]);
      };
      const havingNotifcationSchedules = stopHasNotifcationSchedules(thisItem.stopId);
      scheduleNotificationButtonElement.setAttribute('highlighted', booleanToString(havingNotifcationSchedules));
    }

    if (previousItem === null) {
      updateStatus(thisElement, thisItem, animation);
      updateRank(thisElement, thisItem, animation);
      updateRouteDirection(thisElement, thisItem);
      updateRouteName(thisElement, thisItem);
      updateBuses(thisElement, thisItem);
      updateBusArrivalTimes(thisElement, thisItem);
      updateStretch(thisElement, skeletonScreen);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
      updateSaveToFolderButton(thisElement, thisItem);
      updateScheduleNotificationButton(thisElement, thisItem);
    } else {
      if (thisItem.status.time !== previousItem.status.time) {
        updateStatus(thisElement, thisItem, animation);
        updateScheduleNotificationButton(thisElement, thisItem);
      }
      if (previousItem.ranking.number !== thisItem.ranking.number || previousItem.ranking.code !== thisItem.ranking.code) {
        updateRank(thisElement, thisItem, animation);
      }
      if (previousItem.stopId !== thisItem.stopId) {
        updateRouteDirection(thisElement, thisItem);
        updateRouteName(thisElement, thisItem);
        updateSaveToFolderButton(thisElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisElement, thisItem);
      }
      if (!compareThings(previousItem.busArrivalTimes, thisItem.busArrivalTimes)) {
        updateBusArrivalTimes(thisElement, thisItem);
      }
      if (animation !== previousAnimation) {
        updateAnimation(thisElement, animation);
      }
      if (skeletonScreen !== previousSkeletonScreen) {
        updateStretch(thisElement, skeletonScreen);
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  function updateProperty(thisElement: HTMLElement, thisProperty: LocationGroupProperty, previousProperty: LocationGroupProperty | null): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: LocationGroupProperty): void {
      elementQuerySelector(thisElement, '.css_location_details_property_icon').innerHTML = getIconHTML(thisProperty.icon);
    }

    function updateValue(thisElement: HTMLElement, thisProperty: LocationGroupProperty): void {
      elementQuerySelector(thisElement, '.css_location_details_property_value').innerHTML = thisProperty.value;
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousProperty === null) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (!compareThings(previousProperty.icon, thisProperty.icon)) {
        updateIcon(thisElement, thisProperty);
      }
      if (!compareThings(previousProperty.value, thisProperty.value)) {
        updateValue(thisElement, thisProperty);
      }
      if (animation !== previousAnimation) {
        updateAnimation(thisElement, animation);
      }
      if (skeletonScreen !== previousSkeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;

  const groupQuantity = integration.groupQuantity;
  const itemQuantity = integration.itemQuantity;
  const groupedItems = integration.groupedItems;
  const groups = integration.groups;

  locationSliding_groupQuantity = groupQuantity;
  locationSliding_fieldWidth = FieldWidth;
  locationSliding_fieldHeight = FieldHeight;

  let cumulativeOffset = 0;
  for (let i = 0; i < groupQuantity; i++) {
    const width = getTextWidth(groups[`g_${i}`].name, 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
    locationSliding_groupStyles[`g_${i}`] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  var offset = locationSliding_groupStyles[`g_${locationSliding_initialIndex}`].offset * -1 + locationSliding_fieldWidth * 0.5 - locationSliding_groupStyles[`g_${locationSliding_initialIndex}`].width * 0.5;
  if (!locationSliding_sliding) {
    updateLocationCSS(locationSliding_groupQuantity, offset, locationSliding_groupStyles[`g_${locationSliding_initialIndex}`].width - tabPadding, locationSliding_initialIndex);
  }

  LocationNameElement.innerHTML = /*html*/ `<span>${integration.LocationName}</span>`;
  LocationNameElement.setAttribute('animation', booleanToString(animation));
  LocationNameElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  LocationButtonRightElement.onclick = function () {
    openLocationDetails(integration.hash);
  };
  LocationGroupTabsElement.setAttribute('animation', booleanToString(animation));
  LocationGroupTabsElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  LocationGroupTabLineTrackElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  // TODO: updateTab

  const currentGroupSeatQuantity = elementQuerySelectorAll(LocationGroupsElement, '.css_location_group').length;
  if (groupQuantity !== currentGroupSeatQuantity) {
    const capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      const groupsFragment = new DocumentFragment();
      const tabsFragment = new DocumentFragment();
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newGroupElement = generateElementOfGroup();
        groupsFragment.appendChild(newGroupElement.element);
        const newTabElement = generateElementOfTab();
        tabsFragment.appendChild(newTabElement.element);
      }
      LocationGroupsElement.append(groupsFragment);
      LocationGroupTabsTrayElement.append(tabsFragment);
    } else {
      const LocationGroupElements = elementQuerySelectorAll(LocationGroupsElement, '.css_location_group');
      const LocationGroupTabElements = elementQuerySelectorAll(LocationGroupTabsTrayElement, '.css_location_group_tab');
      for (let o = 0; o < Math.abs(capacity); o++) {
        const groupIndex = currentGroupSeatQuantity - 1 - o;
        LocationGroupElements[groupIndex].remove();
        LocationGroupTabElements[groupIndex].remove();
      }
    }
  }

  const LocationGroupElements = elementQuerySelectorAll(LocationGroupsElement, '.css_location_group');
  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const thisLocationGroupElement = LocationGroupElements[i];
    const currentItemSeatQuantity = elementQuerySelectorAll(thisLocationGroupElement, '.css_location_group_items .css_location_group_item').length;
    if (itemQuantity[groupKey] !== currentItemSeatQuantity) {
      const capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        const LocationGroupItemsElement = elementQuerySelector(thisLocationGroupElement, '.css_location_group_items');
        for (let o = 0; o < Math.abs(capacity); o++) {
          const newItemElement = generateElementOfItem();
          LocationGroupItemsElement.appendChild(newItemElement.element);
        }
      } else {
        const LocationGroupItemElements = elementQuerySelectorAll(thisLocationGroupElement, '.css_location_group_items .css_location_group_item');
        for (let o = 0; o < Math.abs(capacity); o++) {
          const itemIndex = currentItemSeatQuantity - 1 - o;
          LocationGroupItemElements[itemIndex].remove();
        }
      }
    }

    const currentGroupPropertySeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(LocationGroupsElement, '.css_location_group')[i], '.css_location_group_details .css_location_group_details_body .css_location_group_details_property').length;
    const groupPropertyQuantity = groups[groupKey].properties.length;
    if (groupPropertyQuantity !== currentGroupPropertySeatQuantity) {
      const capacity = currentGroupPropertySeatQuantity - groupPropertyQuantity;
      if (capacity < 0) {
        const thisLocationGroupDetailsElement = elementQuerySelector(thisLocationGroupElement, '.css_location_group_details');
        const thisLocationGroupDetailsBodyElement = elementQuerySelector(thisLocationGroupDetailsElement, '.css_location_group_details_body');
        for (let o = 0; o < Math.abs(capacity); o++) {
          // var propertyIndex = currentGroupPropertySeatQuantity + o;
          const newPropertyElement = generateElementOfGroupDetailsProperty();
          thisLocationGroupDetailsBodyElement.appendChild(newPropertyElement.element);
        }
      } else {
        const thisLocationGroupDetailsElement = elementQuerySelector(thisLocationGroupElement, '.css_location_group_details');
        const thisLocationGroupDetailsBodyElement = elementQuerySelector(thisLocationGroupDetailsElement, '.css_location_group_details_body');
        const propertyElements = elementQuerySelectorAll(thisLocationGroupDetailsBodyElement, '.css_location_group_details_property');
        for (let o = 0; o < Math.abs(capacity); o++) {
          const propertyIndex = currentGroupPropertySeatQuantity - 1 - o;
          propertyElements[propertyIndex].remove();
        }
      }
    }
  }

  const tabElements = elementQuerySelectorAll(LocationGroupTabsTrayElement, '.css_location_group_tab');
  const groupElements = elementQuerySelectorAll(LocationGroupsElement, '.css_location_group');
  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const thisTabElement = tabElements[i];
    const thisTabSpanElement = elementQuerySelector(thisTabElement, 'span');
    thisTabSpanElement.innerText = groups[groupKey].name;
    thisTabElement.style.setProperty('--b-cssvar-location-tab-width', `${locationSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-index', i.toString());
    const thisGroupElement = groupElements[i];
    const propertyElements = elementQuerySelectorAll(thisGroupElement, `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`);
    const itemElements = elementQuerySelectorAll(thisGroupElement, `.css_location_group_items .css_location_group_item`);

    const groupPropertyQuantity = groups[groupKey].properties.length; // TODO: propertyQuantity
    for (let k = 0; k < groupPropertyQuantity; k++) {
      const thisProperty = groups[groupKey].properties[k];
      const thisElement = propertyElements[k];
      if (previousIntegration.hasOwnProperty('groups')) {
        if (previousIntegration.groups.hasOwnProperty(groupKey)) {
          if (previousIntegration.groups[groupKey].properties[k]) {
            const previousProperty = previousIntegration.groups[groupKey].properties[k];
            updateProperty(thisElement, thisProperty, previousProperty);
          } else {
            updateProperty(thisElement, thisProperty, null);
          }
        } else {
          updateProperty(thisElement, thisProperty, null);
        }
      } else {
        updateProperty(thisElement, thisProperty, null);
      }
    }

    for (let j = 0; j < itemQuantity[groupKey]; j++) {
      const thisElement = itemElements[j];
      const thisItem = groupedItems[groupKey][j];
      if (previousIntegration.hasOwnProperty('groupedItems')) {
        if (previousIntegration.groupedItems.hasOwnProperty(groupKey)) {
          if (previousIntegration.groupedItems[groupKey][j]) {
            const previousItem = previousIntegration.groupedItems[groupKey][j];
            updateItem(thisElement, thisItem, previousItem);
          } else {
            updateItem(thisElement, thisItem, null);
          }
        } else {
          updateItem(thisElement, thisItem, null);
        }
      } else {
        updateItem(thisElement, thisItem, null);
      }
    }
  }

  previousIntegration = integration;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

async function refreshLocation() {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  const busArrivalTimeChartSize = querySize('location-bus-arrival-time-chart');
  locationRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  locationRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  locationRefreshTimer_refreshing = true;
  locationRefreshTimer_currentRequestID = generateIdentifier();
  LocationUpdateTimerElement.setAttribute('refreshing', 'true');
  LocationUpdateTimerElement.classList.remove('css_location_update_timer_slide_rtl');
  document.addEventListener(locationRefreshTimer_currentRequestID, handleDataReceivingProgressUpdates);
  const integration = await integrateLocation(currentHashSet_hash, busArrivalTimeChartSize.width, busArrivalTimeChartSize.height, locationRefreshTimer_currentRequestID);
  updateLocationField(integration, false, playing_animation);
  let updateRate = 0;
  if (locationRefreshTimer_dynamic) {
    updateRate = await getUpdateRate();
  }
  locationRefreshTimer_lastUpdate = new Date().getTime();
  if (locationRefreshTimer_dynamic) {
    locationRefreshTimer_nextUpdate = Math.max(locationRefreshTimer_lastUpdate + locationRefreshTimer_minInterval, integration.dataUpdateTime + locationRefreshTimer_baseInterval / updateRate);
  } else {
    locationRefreshTimer_nextUpdate = locationRefreshTimer_lastUpdate + locationRefreshTimer_baseInterval;
  }
  locationRefreshTimer_dynamicInterval = Math.max(locationRefreshTimer_minInterval, locationRefreshTimer_nextUpdate - locationRefreshTimer_lastUpdate);
  locationRefreshTimer_refreshing = false;
  LocationUpdateTimerElement.setAttribute('refreshing', 'false');
  animateUpdateTimer();
}

export function streamLocation(): void {
  refreshLocation()
    .then(function () {
      if (locationRefreshTimer_streaming) {
        setTimeout(function () {
          streamLocation();
        }, Math.max(locationRefreshTimer_minInterval, locationRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        locationRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (locationRefreshTimer_streaming) {
        promptMessage(`地點網路連線中斷，將在${locationRefreshTimer_retryInterval / 1000}秒後重試。`, 'error');
        setTimeout(function () {
          streamLocation();
        }, locationRefreshTimer_retryInterval);
      } else {
        locationRefreshTimer_streamStarted = false;
      }
    });
}

export function openLocation(hash: string): void {
  pushPageHistory('Location');
  logRecentView('location', hash);
  currentHashSet_hash = hash;
  locationSliding_initialIndex = 0;
  LocationField.setAttribute('displayed', 'true');
  LocationGroupsElement.scrollLeft = 0;
  LocationGroupsElement.focus();
  setUpLocationFieldSkeletonScreen();
  if (!locationRefreshTimer_streaming) {
    locationRefreshTimer_streaming = true;
    if (!locationRefreshTimer_streamStarted) {
      locationRefreshTimer_streamStarted = true;
      streamLocation();
    } else {
      refreshLocation();
    }
  }
  closePreviousPage();
}

export function closeLocation(): void {
  // revokePageHistory('Location');
  LocationField.setAttribute('displayed', 'false');
  locationRefreshTimer_streaming = false;
  openPreviousPage();
}

export function stretchLocationItem(itemElementID: string): void {
  const itemElement = elementQuerySelector(LocationGroupsElement, `.css_location_group .css_location_group_items .css_location_group_item#${itemElementID}`);
  const itemBodyElement = elementQuerySelector(itemElement, '.css_location_group_item_body');

  const itemsElement = itemElement.parentElement as HTMLElement;

  const elementsBelowItemElement = getElementsBelow(itemElement, 'css_location_group_item');
  const elementsBelowLength = elementsBelowItemElement.length;

  const itemsElementRect = itemsElement.getBoundingClientRect();
  const itemElementRect = itemElement.getBoundingClientRect();

  // const itemElementX = itemElementRect.left - itemsElementRect.left;
  const itemElementY = itemElementRect.top - itemsElementRect.top;

  const stretched = itemElement.getAttribute('stretched') === 'true' ? true : false;
  const animation = itemElement.getAttribute('animation') === 'true' ? true : false;

  if (animation) {
    const pushDirection = stretched ? '2' : '1';

    // Separate the elements from the document flow while keeping its position
    itemElement.setAttribute('stretching', 'true');
    // itemElement.style.setProperty('--b-cssvar-css-location-group-item-x', `${itemElementX}px`);
    itemElement.style.setProperty('--b-cssvar-css-location-group-item-y', `${itemElementY}px`);

    // Set push direction and push state
    for (let i = 0; i < elementsBelowLength; i++) {
      const thisItemElement = elementsBelowItemElement[i];
      thisItemElement.setAttribute('push-direction', pushDirection);
      thisItemElement.setAttribute('push-state', '1');
    }

    itemElement.addEventListener(
      'transitionend',
      function () {
        // Reset the push direction and push state
        for (let i = 0; i < elementsBelowLength; i++) {
          const thisItemElement = elementsBelowItemElement[i];
          thisItemElement.setAttribute('push-direction', '0');
          thisItemElement.setAttribute('push-state', '0');
        }
        // Deposit the element
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
          thisItemElement.setAttribute('push-state', '2');
        }
      },
      { once: true }
    );
  }

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
  } else {
    itemBodyElement.setAttribute('displayed', 'true');
    itemElement.setAttribute('stretched', 'true');
  }
}

export function switchLocationBodyTab(itemID: string, tabCode: number): void {
  const itemElement = elementQuerySelector(LocationGroupsElement, `.css_location_group .css_location_group_items .css_location_group_item#${itemID}`);
  const itemBodyElement = elementQuerySelector(itemElement, '.css_location_group_item_body');
  const buttonsElement = elementQuerySelector(itemBodyElement, '.css_location_group_item_buttons');
  const buttonElements = elementQuerySelectorAll(buttonsElement, '.css_location_group_item_button[highlighted="true"][type="tab"]');
  for (const t of buttonElements) {
    t.setAttribute('highlighted', 'false');
  }
  elementQuerySelector(buttonsElement, `.css_location_group_item_button[code="${tabCode}"]`).setAttribute('highlighted', 'true');
  switch (tabCode) {
    case 0:
      elementQuerySelector(itemElement, '.css_location_group_item_buses').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_location_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      break;
    case 1:
      elementQuerySelector(itemElement, '.css_location_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_location_group_item_bus_arrival_times').setAttribute('displayed', 'true');
      break;
    default:
      break;
  }
}

import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { DataReceivingProgressEvent } from '../../data/apis/loader';
import { isFolderContentSaved } from '../../data/folder/index';
import { IntegratedLocation, IntegratedLocationItem, integrateLocation, LocationGroupProperty } from '../../data/location/index';
import { stopHasNotifcationSchedules } from '../../data/notification/index';
import { logRecentView } from '../../data/recent-views/index';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll, getElementsBelow } from '../../tools/elements';
import { getTextWidth } from '../../tools/graphic';
import { booleanToString, compareThings, generateIdentifier, hasOwnProperty } from '../../tools/index';
import { indexToDay, timeObjectToString } from '../../tools/time';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { closePreviousPage, GroupStyles, openPreviousPage, pushPageHistory, querySize } from '../index';
import { promptMessage } from '../prompt/index';
import { openSaveToFolder } from '../save-to-folder/index';
import { openScheduleNotification } from '../schedule-notification/index';
import { openLocationDetails } from './details/index';

const LocationField = documentQuerySelector('.css_location_field');
const LocationHeadElement = elementQuerySelector(LocationField, '.css_location_head');
const LocationNameElement = elementQuerySelector(LocationHeadElement, '.css_location_name');
const LocationNameSpanElement = elementQuerySelector(LocationNameElement, 'span');
const LocationButtonRightElement = elementQuerySelector(LocationHeadElement, '.css_location_button_right');
const LocationGroupsElement = elementQuerySelector(LocationField, '.css_location_groups');
const LocationGroupTabsElement = elementQuerySelector(LocationHeadElement, '.css_location_group_tabs');
const LocationGroupTabsTrayElement = elementQuerySelector(LocationGroupTabsElement, '.css_location_group_tabs_tray');
const LocationGroupTabLineTrackElement = elementQuerySelector(LocationHeadElement, '.css_location_group_tab_line_track');
const LocationGroupTabLineElement = elementQuerySelector(LocationGroupTabLineTrackElement, '.css_location_group_tab_line');
const LocationUpdateTimerElement = elementQuerySelector(LocationHeadElement, '.css_location_update_timer_box .css_location_update_timer');

let previousIntegration = {} as IntegratedLocation;
let previousAnimation: boolean = false;
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
      const indexDifference = currentIndex - locationSliding_initialIndex;
      let delta = Math.abs(indexDifference);
      if (delta > 1) {
        if (indexDifference > 0) {
          locationSliding_initialIndex = Math.floor(currentIndex);
          locationSliding_targetIndex = locationSliding_initialIndex + 1;
        } else {
          locationSliding_initialIndex = Math.ceil(currentIndex);
          locationSliding_targetIndex = locationSliding_initialIndex - 1;
        }
        delta = Math.abs(currentIndex - locationSliding_initialIndex);
      }
      const initialSize = locationSliding_groupStyles[`g_${locationSliding_initialIndex}`] || { width: 0, offset: 0 };
      const targetSize = locationSliding_groupStyles[`g_${locationSliding_targetIndex}`] || { width: 0, offset: 0 };
      const tabWidth = initialSize.width + (targetSize.width - initialSize.width) * delta;
      const offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * delta) * -1 + locationSliding_fieldWidth * 0.5 - tabWidth * 0.5;
      updateLocationCSS(locationSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);
      /*
      if (currentIndex === locationSliding_targetIndex) {
        locationSliding_initialIndex = Math.round(currentIndex);
        locationSliding_sliding = false;
      }
      */
    },
    { passive: true }
  );

  LocationGroupsElement.addEventListener(
    'scrollend',
    function (event: Event) {
      const target = event.target as HTMLElement;
      const currentIndex = target.scrollLeft / locationSliding_fieldWidth;
      locationSliding_initialIndex = Math.round(currentIndex);
      locationSliding_sliding = false;
    },
    { passive: true }
  );
}

export function updateLocationCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  LocationGroupsElement.style.setProperty('--b-cssvar-location-group-quantity', groupQuantity.toString());
  LocationGroupTabLineElement.style.setProperty('--b-cssvar-location-tab-line-width-scale', tabLineWidth.toString());
  LocationGroupTabsTrayElement.style.setProperty('--b-cssvar-location-tabs-tray-offset', `${offset.toString()}px`);
  LocationGroupTabsTrayElement.style.setProperty('--b-cssvar-location-percentage', percentage.toString());
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

function generateElementOfItem(): HTMLElement {
  // Main container
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_location_group_item');
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
  stretchElement.appendChild(getIconElement('keyboard_arrow_down'));
  stretchElement.onclick = () => {
    stretchLocationItem(itemElement);
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
  busTabIconElement.appendChild(getIconElement('directions_bus'));
  busTabButtonElement.appendChild(busTabIconElement);
  busTabButtonElement.appendChild(document.createTextNode('公車'));
  busTabButtonElement.onclick = () => {
    switchLocationBodyTab(itemElement, 0);
  };

  // Tab: 抵達時間
  const arrivalTabButtonElement = document.createElement('div');
  arrivalTabButtonElement.classList.add('css_location_group_item_button');
  arrivalTabButtonElement.setAttribute('highlighted', 'false');
  arrivalTabButtonElement.setAttribute('type', 'tab');
  arrivalTabButtonElement.setAttribute('code', '1');
  const arrivalTabIconElement = document.createElement('div');
  arrivalTabIconElement.classList.add('css_location_group_item_button_icon');
  arrivalTabIconElement.appendChild(getIconElement('departure_board'));
  arrivalTabButtonElement.appendChild(arrivalTabIconElement);
  arrivalTabButtonElement.appendChild(document.createTextNode('抵達時間'));
  arrivalTabButtonElement.onclick = () => {
    switchLocationBodyTab(itemElement, 1);
  };

  // Button: 儲存
  const saveButtonElement = document.createElement('div');
  saveButtonElement.classList.add('css_location_group_item_button');
  saveButtonElement.setAttribute('highlighted', 'false');
  saveButtonElement.setAttribute('type', 'save-to-folder');
  const saveButtonIconElement = document.createElement('div');
  saveButtonIconElement.classList.add('css_location_group_item_button_icon');
  saveButtonIconElement.appendChild(getIconElement('folder'));
  saveButtonElement.appendChild(saveButtonIconElement);
  saveButtonElement.appendChild(document.createTextNode('儲存'));

  // Button: 通知
  const notifyButtonElement = document.createElement('div');
  notifyButtonElement.classList.add('css_location_group_item_button');
  notifyButtonElement.setAttribute('highlighted', 'false');
  notifyButtonElement.setAttribute('type', 'schedule-notification');
  notifyButtonElement.setAttribute('enabled', 'true');
  const notifyButtonIconElement = document.createElement('div');
  notifyButtonIconElement.classList.add('css_location_group_item_button_icon');
  notifyButtonIconElement.appendChild(getIconElement('notifications'));
  notifyButtonElement.appendChild(notifyButtonIconElement);
  notifyButtonElement.appendChild(document.createTextNode('通知'));

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

  return itemElement;
}

function generateElementOfGroup(): HTMLElement {
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

  return groupElement;
}

function generateElementOfTab(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('css_location_group_tab');

  const span = document.createElement('span');
  element.appendChild(span);

  return element;
}

function generateElementOfGroupDetailsProperty(): HTMLElement {
  // Main container
  const propertyElement = document.createElement('div');
  propertyElement.classList.add('css_location_group_details_property');

  // Icon
  const iconElement = document.createElement('div');
  iconElement.classList.add('css_location_details_property_icon');
  iconElement.appendChild(getBlankIconElement());

  // Value
  const valueElement = document.createElement('div');
  valueElement.classList.add('css_location_details_property_value');

  // Assemble
  propertyElement.appendChild(iconElement);
  propertyElement.appendChild(valueElement);

  return propertyElement;
}

function generateElementOfBus(): HTMLElement {
  const busElement = document.createElement('div');
  busElement.classList.add('css_location_group_item_bus');
  busElement.setAttribute('on-this-route', 'false');

  const titleElement = document.createElement('div');
  titleElement.classList.add('css_location_group_item_bus_title');

  const iconElement = document.createElement('div');
  iconElement.classList.add('css_location_group_item_bus_icon');
  iconElement.appendChild(getIconElement('directions_bus'));

  const carNumberElement = document.createElement('div');
  carNumberElement.classList.add('css_location_group_item_bus_car_number');

  const attributesElement = document.createElement('div');
  attributesElement.classList.add('css_location_group_item_bus_attributes');

  const routeAttributeElement = document.createElement('div');
  routeAttributeElement.classList.add('css_location_group_item_bus_route');

  const carStatusAttributeElement = document.createElement('div');
  carStatusAttributeElement.classList.add('css_location_group_item_bus_car_status');

  const carTypeAttributeElement = document.createElement('div');
  carTypeAttributeElement.classList.add('css_location_group_item_bus_car_type');

  titleElement.appendChild(iconElement);
  titleElement.appendChild(carNumberElement);
  busElement.appendChild(titleElement);

  attributesElement.appendChild(routeAttributeElement);
  attributesElement.appendChild(carStatusAttributeElement);
  attributesElement.appendChild(carTypeAttributeElement);
  busElement.appendChild(attributesElement);

  return busElement;
}

function generateElementOfBusArrivalTime(): HTMLElement {
  const busArrivalTimeElement = document.createElement('div');
  busArrivalTimeElement.classList.add('css_location_group_item_bus_arrival_time');

  const titleElement = document.createElement('div');
  titleElement.classList.add('css_location_group_item_bus_arrival_time_title');

  const iconElement = document.createElement('div');
  iconElement.classList.add('css_location_group_item_bus_arrival_time_icon');
  iconElement.appendChild(getIconElement('calendar_view_day'));

  const personalScheduleNameElement = document.createElement('div');
  personalScheduleNameElement.classList.add('css_location_group_item_bus_arrival_time_personal_schedule_name');

  const personalScheduleTimeElement = document.createElement('div');
  personalScheduleTimeElement.classList.add('css_location_group_item_bus_arrival_time_personal_schedule_time');

  const chartElement = document.createElement('div');
  chartElement.classList.add('css_location_group_item_bus_arrival_time_chart');

  titleElement.appendChild(iconElement);
  titleElement.appendChild(personalScheduleNameElement);
  titleElement.appendChild(personalScheduleTimeElement);
  busArrivalTimeElement.appendChild(titleElement);
  busArrivalTimeElement.appendChild(chartElement);

  return busArrivalTimeElement;
}

function setUpLocationFieldSkeletonScreen(hash: IntegratedLocation['hash']): void {
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
      hash: hash,
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

function updateLocationField(integration: IntegratedLocation, skeletonScreen: boolean, animation: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: IntegratedLocationItem, previousItem: IntegratedLocationItem | null): void {
    function updateStatus(thisElement: HTMLElement, thisItem: IntegratedLocationItem, animation: boolean): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisItemStatusElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_status');
      const nextSlideElement = elementQuerySelector(thisItemStatusElement, '.css_next_slide');
      const currentSlideElement = elementQuerySelector(thisItemStatusElement, '.css_current_slide');

      nextSlideElement.setAttribute('code', thisItem.status.code.toString());
      nextSlideElement.innerText = thisItem.status.text;

      if (!skeletonScreen) {
        if (animation) {
          const thisElementRect = thisElement.getBoundingClientRect();
          const top = thisElementRect.top;
          const left = thisElementRect.left;
          const bottom = thisElementRect.bottom;
          const right = thisElementRect.right;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          if (bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
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
            return;
          }
        }
      }

      currentSlideElement.setAttribute('code', thisItem.status.code.toString());
      currentSlideElement.innerText = thisItem.status.text;
    }

    function updateRank(thisElement: HTMLElement, thisItem: IntegratedLocationItem, animation: boolean): void {
      const thisElementRect = thisElement.getBoundingClientRect();
      const top = thisElementRect.top;
      const left = thisElementRect.left;
      const bottom = thisElementRect.bottom;
      const right = thisElementRect.right;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisRankElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_rank');
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
      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisRouteDirectionElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_route_direction');
      thisRouteDirectionElement.innerText = thisItem.route_direction;
    }

    function updateRouteName(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisRouteNameElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_route_name');
      thisRouteNameElement.innerText = thisItem.route_name;
    }

    function updateBuses(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisItemBodyElement = elementQuerySelector(thisElement, '.css_location_group_item_body');
      const thisBusesElement = elementQuerySelector(thisItemBodyElement, '.css_location_group_item_buses');
      const currentBusElements = elementQuerySelectorAll(thisBusesElement, '.css_location_group_item_bus');
      const currentBusElementsQuantity = currentBusElements.length;
      const busesQuantity = thisItem.buses.length;
      const difference = currentBusElementsQuantity - busesQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newBusElement = generateElementOfBus();
          fragment.appendChild(newBusElement);
        }
        thisBusesElement.append(fragment);
      } else {
        for (let p = currentBusElementsQuantity - 1, q = currentBusElementsQuantity - difference - 1; p > q; p--) {
          currentBusElements[p].remove();
        }
      }

      const busElements = elementQuerySelectorAll(thisBusesElement, '.css_location_group_item_bus');
      for (let i = 0; i < busesQuantity; i++) {
        const busItem = thisItem.buses[i];
        const busElement = busElements[i];
        const titleElement = elementQuerySelector(busElement, '.css_location_group_item_bus_title');
        const carNumberElement = elementQuerySelector(titleElement, '.css_location_group_item_bus_car_number');
        const attributesElement = elementQuerySelector(busElement, '.css_location_group_item_bus_attributes');
        const routeAttributeElement = elementQuerySelector(attributesElement, '.css_location_group_item_bus_route');
        const carStatusAttributeElement = elementQuerySelector(attributesElement, '.css_location_group_item_bus_car_status');
        const carTypeAttributeElement = elementQuerySelector(attributesElement, '.css_location_group_item_bus_car_type');
        busElement.setAttribute('on-this-route', booleanToString(busItem.onThisRoute));
        carNumberElement.innerText = busItem.carNumber;
        routeAttributeElement.innerText = `路線：${busItem.RouteName}`;
        carStatusAttributeElement.innerText = `狀態：${busItem.status.text}`;
        carTypeAttributeElement.innerText = `類型：${busItem.type}`;
      }

      thisBusesElement.setAttribute('empty', booleanToString(busesQuantity === 0));
    }

    function updateBusArrivalTimes(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisItemBodyElement = elementQuerySelector(thisElement, '.css_location_group_item_body');
      const thisBusArrivalTimesElement = elementQuerySelector(thisItemBodyElement, '.css_location_group_item_bus_arrival_times');
      const currentBusArrivalTimeElements = elementQuerySelectorAll(thisBusArrivalTimesElement, '.css_location_group_item_bus_arrival_time');
      const currentBusArrivalTimeElementsQuantity = currentBusArrivalTimeElements.length;
      const busArrivalTimesQuantity = thisItem.busArrivalTimes.length;
      const difference = currentBusArrivalTimeElementsQuantity - busArrivalTimesQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newBusArrivalTimeElement = generateElementOfBusArrivalTime();
          fragment.appendChild(newBusArrivalTimeElement);
        }
        thisBusArrivalTimesElement.append(fragment);
      } else {
        for (let p = currentBusArrivalTimeElementsQuantity - 1, q = currentBusArrivalTimeElementsQuantity - difference - 1; p > q; p--) {
          currentBusArrivalTimeElements[p].remove();
        }
      }

      const busArrivalTimeElements = elementQuerySelectorAll(thisBusArrivalTimesElement, '.css_location_group_item_bus_arrival_time');
      for (let i = 0; i < busArrivalTimesQuantity; i++) {
        const busArrivalTimeItem = thisItem.busArrivalTimes[i];
        const busArrivalTimeElement = busArrivalTimeElements[i];
        const titleElement = elementQuerySelector(busArrivalTimeElement, '.css_location_group_item_bus_arrival_time_title');
        const personalScheduleNameElement = elementQuerySelector(titleElement, '.css_location_group_item_bus_arrival_time_personal_schedule_name');
        const personalScheduleTimeElement = elementQuerySelector(titleElement, '.css_location_group_item_bus_arrival_time_personal_schedule_time');
        const chartElement = elementQuerySelector(busArrivalTimeElement, '.css_location_group_item_bus_arrival_time_chart');
        personalScheduleNameElement.innerText = busArrivalTimeItem.personalSchedule.name;
        personalScheduleTimeElement.innerText = `週${indexToDay(busArrivalTimeItem.day).name} ${timeObjectToString(busArrivalTimeItem.personalSchedule.period.start)} - ${timeObjectToString(busArrivalTimeItem.personalSchedule.period.end)}`;
        chartElement.innerHTML = busArrivalTimeItem.chart;
      }

      thisBusArrivalTimesElement.setAttribute('empty', booleanToString(busArrivalTimesQuantity === 0));
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
        openSaveToFolder('stop', [thisItem.stopId, thisItem.routeId], saveToFolderButtonElement);
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
        openScheduleNotification(scheduleNotificationButtonElement, thisItem.stopId, thisItem.routeId, thisItem.status.time);
      };
      const havingNotifcationSchedules = stopHasNotifcationSchedules(thisItem.stopId);
      scheduleNotificationButtonElement.setAttribute('highlighted', booleanToString(havingNotifcationSchedules));
    }

    if (previousItem === null || previousItem === undefined) {
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
      const thisIconElement = elementQuerySelector(thisElement, '.css_location_details_property_icon');
      setIcon(thisIconElement, thisProperty.icon);
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

    if (previousProperty === null || previousProperty === undefined) {
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
    const groupKey = `g_${i}`;
    const width = getTextWidth(groups[groupKey].name, 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
    locationSliding_groupStyles[groupKey] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  locationSliding_groupStyles[`g_${groupQuantity}`] = {
    width: 0,
    offset: cumulativeOffset
  };

  if (!locationSliding_sliding) {
    const initialGroupKey = `g_${locationSliding_initialIndex}`;
    const initialGroupStyle = locationSliding_groupStyles[initialGroupKey];
    const offset = initialGroupStyle.offset * -1 + locationSliding_fieldWidth * 0.5 - initialGroupStyle.width * 0.5;
    const tabLineWidth = initialGroupStyle.width - tabPadding;
    updateLocationCSS(locationSliding_groupQuantity, offset, tabLineWidth, locationSliding_initialIndex);
  }

  if (previousIntegration?.hash !== integration.hash) {
    LocationButtonRightElement.onclick = function () {
      openLocationDetails(integration.hash);
    };
  }

  if (previousIntegration?.LocationName !== integration.LocationName) {
    LocationNameSpanElement.innerText = integration.LocationName;
  }

  if (previousAnimation !== animation) {
    LocationNameElement.setAttribute('animation', booleanToString(animation));
    LocationGroupTabsElement.setAttribute('animation', booleanToString(animation));
  }

  if (previousSkeletonScreen !== skeletonScreen) {
    LocationNameElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    LocationGroupTabsElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    LocationGroupTabLineTrackElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  }

  // TODO: updateTab
  const currentGroupElements = elementQuerySelectorAll(LocationGroupsElement, '.css_location_group');
  const currentGroupElementsLength = currentGroupElements.length;
  if (groupQuantity !== currentGroupElementsLength) {
    const difference = currentGroupElementsLength - groupQuantity;
    if (difference < 0) {
      const groupsFragment = new DocumentFragment();
      const tabsFragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newGroupElement = generateElementOfGroup();
        groupsFragment.appendChild(newGroupElement);
        const newTabElement = generateElementOfTab();
        tabsFragment.appendChild(newTabElement);
      }
      LocationGroupsElement.append(groupsFragment);
      LocationGroupTabsTrayElement.append(tabsFragment);
    } else {
      const currentLocationGroupTabElements = elementQuerySelectorAll(LocationGroupTabsTrayElement, '.css_location_group_tab');
      for (let p = currentGroupElementsLength - 1, q = currentGroupElementsLength - difference - 1; p > q; p--) {
        currentGroupElements[p].remove();
        currentLocationGroupTabElements[p].remove();
      }
    }
  }

  const LocationGroupElements = elementQuerySelectorAll(LocationGroupsElement, '.css_location_group');
  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;

    const thisLocationGroupElement = LocationGroupElements[i];
    const thisLocationGroupItemsElement = elementQuerySelector(thisLocationGroupElement, '.css_location_group_items');
    const currentLocationGroupItemElements = elementQuerySelectorAll(thisLocationGroupItemsElement, '.css_location_group_item');
    const currentLocationGroupItemElementsLength = currentLocationGroupItemElements.length;
    if (itemQuantity[groupKey] !== currentLocationGroupItemElementsLength) {
      const difference = currentLocationGroupItemElementsLength - itemQuantity[groupKey];
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newItemElement = generateElementOfItem();
          fragment.appendChild(newItemElement);
        }
        thisLocationGroupItemsElement.append(fragment);
      } else {
        for (let p = currentLocationGroupItemElementsLength - 1, q = currentLocationGroupItemElementsLength - difference - 1; p > q; p--) {
          currentLocationGroupItemElements[p].remove();
        }
      }
    }

    const thisLocationGroupDetailsElement = elementQuerySelector(thisLocationGroupElement, '.css_location_group_details');
    const thisLocationGroupDetailsBodyElement = elementQuerySelector(thisLocationGroupDetailsElement, '.css_location_group_details_body');
    const currentGroupPropertyElements = elementQuerySelectorAll(thisLocationGroupDetailsBodyElement, '.css_location_group_details_property');
    const currentGroupPropertyElementsLength = currentGroupPropertyElements.length;
    const groupPropertyQuantity = groups[groupKey].properties.length;
    if (groupPropertyQuantity !== currentGroupPropertyElementsLength) {
      const difference = currentGroupPropertyElementsLength - groupPropertyQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newPropertyElement = generateElementOfGroupDetailsProperty();
          fragment.appendChild(newPropertyElement);
        }
        thisLocationGroupDetailsBodyElement.append(fragment);
      } else {
        for (let p = currentGroupPropertyElementsLength - 1, q = currentGroupPropertyElementsLength - difference - 1; p > q; p--) {
          currentGroupPropertyElements[p].remove();
        }
      }
    }
  }

  const tabElements = elementQuerySelectorAll(LocationGroupTabsTrayElement, '.css_location_group_tab');
  const groupElements = elementQuerySelectorAll(LocationGroupsElement, '.css_location_group');
  LocationGroupTabsTrayElement.style.setProperty('--b-cssvar-location-tabs-tray-width', `${cumulativeOffset}px`);
  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const thisTabElement = tabElements[i];
    const thisTabSpanElement = elementQuerySelector(thisTabElement, 'span');
    thisTabSpanElement.innerText = groups[groupKey].name;
    thisTabElement.style.setProperty('--b-cssvar-location-tab-offset', `${locationSliding_groupStyles[groupKey].offset}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-width', `${locationSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-index', i.toString());
    const thisGroupElement = groupElements[i];
    const propertyElements = elementQuerySelectorAll(thisGroupElement, `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`);
    const itemElements = elementQuerySelectorAll(thisGroupElement, `.css_location_group_items .css_location_group_item`);

    const groupPropertyQuantity = groups[groupKey].properties.length; // TODO: propertyQuantity
    for (let k = 0; k < groupPropertyQuantity; k++) {
      const thisProperty = groups[groupKey].properties[k];
      const thisElement = propertyElements[k];
      if (hasOwnProperty(previousIntegration, 'groups')) {
        if (hasOwnProperty(previousIntegration.groups, groupKey)) {
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
      if (hasOwnProperty(previousIntegration, 'groupedItems')) {
        if (hasOwnProperty(previousIntegration.groupedItems, groupKey)) {
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
        setTimeout(
          function () {
            streamLocation();
          },
          Math.max(locationRefreshTimer_minInterval, locationRefreshTimer_nextUpdate - new Date().getTime())
        );
      } else {
        locationRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (locationRefreshTimer_streaming) {
        promptMessage('error', `地點網路連線中斷，將在${locationRefreshTimer_retryInterval / 1000}秒後重試。`);
        setTimeout(function () {
          streamLocation();
        }, locationRefreshTimer_retryInterval);
      } else {
        locationRefreshTimer_streamStarted = false;
      }
    });
}

export function openLocation(hash: IntegratedLocation['hash']): void {
  pushPageHistory('Location');
  logRecentView('location', hash);
  currentHashSet_hash = hash;
  locationSliding_initialIndex = 0;
  locationSliding_groupStyles = {};
  LocationField.setAttribute('displayed', 'true');
  LocationGroupsElement.scrollLeft = 0;
  LocationGroupsElement.focus();
  setUpLocationFieldSkeletonScreen(hash);
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

export function stretchLocationItem(thisItemElement: HTMLElement): void {
  const itemBodyElement = elementQuerySelector(thisItemElement, '.css_location_group_item_body');

  const itemsElement = thisItemElement.parentElement as HTMLElement;

  const elementsBelowItemElement = getElementsBelow(thisItemElement, 'css_location_group_item');
  const elementsBelowLength = elementsBelowItemElement.length;

  const itemsElementRect = itemsElement.getBoundingClientRect();
  const itemElementRect = thisItemElement.getBoundingClientRect();

  // const itemElementX = itemElementRect.left - itemsElementRect.left;
  const itemElementY = itemElementRect.top - itemsElementRect.top;

  const stretched = thisItemElement.getAttribute('stretched') === 'true' ? true : false;
  const animation = thisItemElement.getAttribute('animation') === 'true' ? true : false;

  if (animation) {
    const pushDirection = stretched ? '2' : '1';

    // Separate the elements from the document flow while keeping its position
    thisItemElement.setAttribute('stretching', 'true');
    // itemElement.style.setProperty('--b-cssvar-css-location-group-item-x', `${itemElementX}px`);
    thisItemElement.style.setProperty('--b-cssvar-css-location-group-item-y', `${itemElementY}px`);

    // Set push direction and push state
    for (let i = 0; i < elementsBelowLength; i++) {
      const thisItemElement = elementsBelowItemElement[i];
      thisItemElement.setAttribute('push-direction', pushDirection);
      thisItemElement.setAttribute('push-state', '1');
    }

    thisItemElement.addEventListener(
      'transitionend',
      function () {
        // Reset the push direction and push state
        for (let i = 0; i < elementsBelowLength; i++) {
          const thisItemElement = elementsBelowItemElement[i];
          thisItemElement.setAttribute('push-direction', '0');
          thisItemElement.setAttribute('push-state', '0');
        }
        // Deposit the element
        thisItemElement.setAttribute('stretching', 'false');
      },
      { once: true }
    );

    thisItemElement.addEventListener(
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
    thisItemElement.setAttribute('stretched', 'false');
  } else {
    itemBodyElement.setAttribute('displayed', 'true');
    thisItemElement.setAttribute('stretched', 'true');
  }
}

export function switchLocationBodyTab(itemElement: HTMLElement, tabCode: number): void {
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

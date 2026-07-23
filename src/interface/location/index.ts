import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { isFolderContentSaved } from '../../data/folder/index';
import { IntegratedLocation, IntegratedLocationItem, integrateLocation, LocationGroupProperty } from '../../data/location/index';
import { stopHasNotifcationSchedules } from '../../data/notification/index';
import { logRecentView } from '../../data/recent-views/index';
import { getSettingOptionValue } from '../../data/settings/index';
import { BitState } from '../../tools/bit-state';
import { deepEqual } from '../../tools/deep-equal';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { getTextWidth } from '../../tools/graphic';
import { booleanToString, getSubpixelPrecision, hasOwnProperty } from '../../tools/index';
import { Tick } from '../../tools/tick';
import { indexToDay, timeObjectToString } from '../../tools/time';
import { VisibilityMonitor } from '../../tools/visibility-monitor';
import { getBlankIconElement, getIconElement, setIcon } from '../icons/index';
import { GroupStyles, hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';
import { openLocationDetails } from '../location-details/index';
import { promptMessage } from '../prompt/index';
import { openSaveToFolder } from '../save-to-folder/index';
import { openScheduleNotification } from '../schedule-notification/index';

const Field = documentQuerySelector('.css_location_field');
const HeadElement = elementQuerySelector(Field, '.css_location_head');
const HeadNameElement = elementQuerySelector(HeadElement, '.css_location_name');
const HeadNameSpanElement = elementQuerySelector(HeadNameElement, 'span');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_location_button_right');
const GroupTabsElement = elementQuerySelector(HeadElement, '.css_location_group_tabs');
const GroupTabsTrayElement = elementQuerySelector(GroupTabsElement, '.css_location_group_tabs_tray');
const GroupTabLineTrackElement = elementQuerySelector(HeadElement, '.css_location_group_tab_line_track');
const GroupTabLineElement = elementQuerySelector(GroupTabLineTrackElement, '.css_location_group_tab_line');
const UpdateTimerBoxElement = elementQuerySelector(HeadElement, '.css_location_update_timer_box');
const UpdateTimerElement = elementQuerySelector(UpdateTimerBoxElement, '.css_location_update_timer_box .css_location_update_timer');
const GroupsElement = elementQuerySelector(Field, '.css_location_groups');

/**
 * div.css_location_group(n) in div.css_location_groups(1)
 */
const groupElements: Array<HTMLElement> = [];

/**
 * div.css_location_group_tab(n) in div.css_location_group_tabs_tray(1)
 */
const tabElements: Array<HTMLElement> = [];

/**
 * div.css_location_group_details_property(m) in div.css_location_group_details_body(1) in div.css_location_group_details(1) in div.css_location_group(n)
 */
const propertyElements: Array<Array<HTMLElement>> = [];

/**
 * div.css_location_group_item(m) in div.css_location_group_items(1) in div.div.css_location_group(n)
 */
const itemElements: Array<Array<HTMLElement>> = [];

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

let currentHashSet_hash: string = '';

const locationTick = new Tick(refreshLocation, 15 * 1000);
const locationTickRetryInterval = 10 * 1000;
const locationVisibilityMonitor = new VisibilityMonitor({ root: GroupsElement, threshold: 0.5 });
const decoder = new TextDecoder();

const tabPadding: number = 20;
const subpixelPrecision: number = getSubpixelPrecision();

const itemElementHeight: number = 50;
const itemElementExtraHeight: number = 171;
const stretchStates: Array<BitState> = [];

function getElementRelativeTop(groupIndex: number, index: number): number {
  return index * itemElementHeight + stretchStates[groupIndex].sum(index) * itemElementExtraHeight;
}

export function initializeLocationSliding(): void {
  GroupsElement.addEventListener(
    'pointerdown',
    function () {
      locationSliding_initialIndex = Math.round(GroupsElement.scrollLeft / locationSliding_fieldWidth);
    },
    { passive: true }
  );

  GroupsElement.addEventListener(
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
      const initialSize = locationSliding_groupStyles[`gs_${locationSliding_initialIndex}`] || { width: 0, offset: 0 };
      const targetSize = locationSliding_groupStyles[`gs_${locationSliding_targetIndex}`] || { width: 0, offset: 0 };
      const tabWidth = initialSize.width + (targetSize.width - initialSize.width) * delta;
      const offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * delta) * -1 + locationSliding_fieldWidth * 0.5 - tabWidth * 0.5;
      updateLocationCSS(locationSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);
    },
    { passive: true }
  );

  GroupsElement.addEventListener(
    'scrollend',
    function (event: Event) {
      const target = event.target as HTMLElement;
      const currentIndex = target.scrollLeft / locationSliding_fieldWidth;
      const difference = currentIndex - locationSliding_targetIndex;
      if (-0.01 < difference && difference < 0.01) {
        locationSliding_initialIndex = Math.round(currentIndex);
        locationSliding_sliding = false;
      }
    },
    { passive: true }
  );
}

export function updateLocationCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  GroupsElement.style.setProperty('--b-cssvar-location-group-quantity', groupQuantity.toString());
  GroupTabLineElement.style.setProperty('--b-cssvar-location-tab-line-width-scale', tabLineWidth.toString());
  GroupTabsTrayElement.style.setProperty('--b-cssvar-location-tabs-tray-offset', `${offset.toFixed(subpixelPrecision)}px`);
  GroupTabsTrayElement.style.setProperty('--b-cssvar-location-percentage', percentage.toString());
}

function animateUpdateTimer(interval: number): void {
  UpdateTimerElement.style.setProperty('--b-cssvar-location-update-timer-interval', `${interval}ms`);
  UpdateTimerElement.classList.add('css_location_update_timer_slide_rtl');
}

function generateElementOfItem(groupIndex: number): HTMLElement {
  // Main container
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_location_group_item');
  itemElement.setAttribute('stretched', 'false');
  itemElement.setAttribute('stretching', 'false');
  itemElement.setAttribute('push-direction', '0');
  itemElement.setAttribute('push-state', '0');

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_location_group_item_head');

  // Rank
  const rankElement = documentCreateDivElement();
  rankElement.classList.add('css_location_group_item_rank');
  const rankNextSlideElement = documentCreateDivElement();
  rankNextSlideElement.classList.add('css_location_group_item_rank_next_slide');
  rankNextSlideElement.setAttribute('code', '-1');
  rankNextSlideElement.setAttribute('displayed', 'false');
  const rankCurrentSlideElement = documentCreateDivElement();
  rankCurrentSlideElement.classList.add('css_location_group_item_rank_current_slide');
  rankCurrentSlideElement.setAttribute('code', '-1');
  rankCurrentSlideElement.setAttribute('displayed', 'true');
  rankElement.appendChild(rankNextSlideElement);
  rankElement.appendChild(rankCurrentSlideElement);

  // Route direction
  const routeDirectionElement = documentCreateDivElement();
  routeDirectionElement.classList.add('css_location_group_item_route_direction');

  // Route name
  const routeNameElement = documentCreateDivElement();
  routeNameElement.classList.add('css_location_group_item_route_name');

  // Capsule
  const capsuleElement = documentCreateDivElement();
  capsuleElement.classList.add('css_location_group_item_capsule');

  // Status
  const statusElement = documentCreateDivElement();
  statusElement.classList.add('css_location_group_item_status');
  const nextSlideElement = documentCreateDivElement();
  nextSlideElement.classList.add('css_next_slide');
  nextSlideElement.setAttribute('code', '0');
  nextSlideElement.setAttribute('displayed', 'false');
  const currentSlideElement = documentCreateDivElement();
  currentSlideElement.classList.add('css_current_slide');
  currentSlideElement.setAttribute('code', '0');
  currentSlideElement.setAttribute('displayed', 'true');
  statusElement.appendChild(nextSlideElement);
  statusElement.appendChild(currentSlideElement);

  // Stretch button
  const stretchElement = documentCreateDivElement();
  stretchElement.classList.add('css_location_group_item_stretch');
  stretchElement.appendChild(getIconElement('keyboard_arrow_down'));
  stretchElement.onclick = function () {
    stretchLocationItem(groupIndex, itemElement);
  };

  // Capsule separator
  const capsuleSeparatorElement = documentCreateDivElement();
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
  const bodyElement = documentCreateDivElement();
  bodyElement.classList.add('css_location_group_item_body');
  bodyElement.setAttribute('displayed', 'false');

  // Buttons
  const buttonsElement = documentCreateDivElement();
  buttonsElement.classList.add('css_location_group_item_buttons');

  // Tab: 公車
  const busTabButtonElement = documentCreateDivElement();
  busTabButtonElement.classList.add('css_location_group_item_button');
  busTabButtonElement.setAttribute('highlighted', 'true');
  busTabButtonElement.setAttribute('type', 'tab');
  const busTabIconElement = documentCreateDivElement();
  busTabIconElement.classList.add('css_location_group_item_button_icon');
  busTabIconElement.appendChild(getIconElement('directions_bus'));
  busTabButtonElement.appendChild(busTabIconElement);
  busTabButtonElement.appendChild(document.createTextNode('公車'));
  busTabButtonElement.onclick = function () {
    switchLocationBodyTab(itemElement, 0);
  };

  // Tab: 抵達時間
  const arrivalTabButtonElement = documentCreateDivElement();
  arrivalTabButtonElement.classList.add('css_location_group_item_button');
  arrivalTabButtonElement.setAttribute('highlighted', 'false');
  arrivalTabButtonElement.setAttribute('type', 'tab');
  const arrivalTabIconElement = documentCreateDivElement();
  arrivalTabIconElement.classList.add('css_location_group_item_button_icon');
  arrivalTabIconElement.appendChild(getIconElement('departure_board'));
  arrivalTabButtonElement.appendChild(arrivalTabIconElement);
  arrivalTabButtonElement.appendChild(document.createTextNode('抵達時間'));
  arrivalTabButtonElement.onclick = function () {
    switchLocationBodyTab(itemElement, 1);
  };

  // Button: 儲存
  const saveButtonElement = documentCreateDivElement();
  saveButtonElement.classList.add('css_location_group_item_button');
  saveButtonElement.setAttribute('highlighted', 'false');
  saveButtonElement.setAttribute('type', 'save-to-folder');
  const saveButtonIconElement = documentCreateDivElement();
  saveButtonIconElement.classList.add('css_location_group_item_button_icon');
  saveButtonIconElement.appendChild(getIconElement('folder'));
  saveButtonElement.appendChild(saveButtonIconElement);
  saveButtonElement.appendChild(document.createTextNode('儲存'));

  // Button: 通知
  const scheduleNotificationButtonElement = documentCreateDivElement();
  scheduleNotificationButtonElement.classList.add('css_location_group_item_button');
  scheduleNotificationButtonElement.setAttribute('highlighted', 'false');
  scheduleNotificationButtonElement.setAttribute('type', 'schedule-notification');
  scheduleNotificationButtonElement.setAttribute('enabled', 'true');
  scheduleNotificationButtonElement.setAttribute('processing', 'false');

  const scheduleNotificationButtonIconElement = documentCreateDivElement();
  scheduleNotificationButtonIconElement.classList.add('css_location_group_item_button_icon');
  scheduleNotificationButtonIconElement.appendChild(getIconElement('notifications'));
  scheduleNotificationButtonElement.appendChild(scheduleNotificationButtonIconElement);
  scheduleNotificationButtonElement.appendChild(document.createTextNode('通知'));

  // Assemble buttons
  buttonsElement.appendChild(busTabButtonElement);
  buttonsElement.appendChild(arrivalTabButtonElement);
  buttonsElement.appendChild(saveButtonElement);
  buttonsElement.appendChild(scheduleNotificationButtonElement);

  // Buses
  const busesElement = documentCreateDivElement();
  busesElement.classList.add('css_location_group_item_buses');
  busesElement.setAttribute('displayed', 'true');

  // Bus arrival times
  const busArrivalTimesElement = documentCreateDivElement();
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
  const groupElement = documentCreateDivElement();
  groupElement.classList.add('css_location_group');

  // Details
  const detailsElement = documentCreateDivElement();
  detailsElement.classList.add('css_location_group_details');

  // Details body
  const detailsBodyElement = documentCreateDivElement();
  detailsBodyElement.classList.add('css_location_group_details_body');
  detailsElement.appendChild(detailsBodyElement);

  // Items
  const itemsElement = documentCreateDivElement();
  itemsElement.classList.add('css_location_group_items');

  // Assemble group
  groupElement.appendChild(detailsElement);
  groupElement.appendChild(itemsElement);

  return groupElement;
}

function generateElementOfTab(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_location_group_tab');

  const span = document.createElement('span');
  element.appendChild(span);

  return element;
}

function generateElementOfGroupDetailsProperty(): HTMLElement {
  // Main container
  const propertyElement = documentCreateDivElement();
  propertyElement.classList.add('css_location_group_details_property');

  // Icon
  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_location_details_property_icon');
  iconElement.appendChild(getBlankIconElement());

  // Value
  const valueElement = documentCreateDivElement();
  valueElement.classList.add('css_location_details_property_value');

  // Assemble
  propertyElement.appendChild(iconElement);
  propertyElement.appendChild(valueElement);

  return propertyElement;
}

function generateElementOfBus(): HTMLElement {
  const busElement = documentCreateDivElement();
  busElement.classList.add('css_location_group_item_bus');
  busElement.setAttribute('on-this-route', 'false');

  const titleElement = documentCreateDivElement();
  titleElement.classList.add('css_location_group_item_bus_title');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_location_group_item_bus_icon');
  iconElement.appendChild(getIconElement('directions_bus'));

  const carNumberElement = documentCreateDivElement();
  carNumberElement.classList.add('css_location_group_item_bus_car_number');

  const attributesElement = documentCreateDivElement();
  attributesElement.classList.add('css_location_group_item_bus_attributes');

  const routeAttributeElement = documentCreateDivElement();
  routeAttributeElement.classList.add('css_location_group_item_bus_route');

  const carStatusAttributeElement = documentCreateDivElement();
  carStatusAttributeElement.classList.add('css_location_group_item_bus_car_status');

  const carTypeAttributeElement = documentCreateDivElement();
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
  const busArrivalTimeElement = documentCreateDivElement();
  busArrivalTimeElement.classList.add('css_location_group_item_bus_arrival_time');

  const titleElement = documentCreateDivElement();
  titleElement.classList.add('css_location_group_item_bus_arrival_time_title');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_location_group_item_bus_arrival_time_icon');
  iconElement.appendChild(getIconElement('calendar_view_day'));

  const personalScheduleNameElement = documentCreateDivElement();
  personalScheduleNameElement.classList.add('css_location_group_item_bus_arrival_time_personal_schedule_name');

  const personalScheduleTimeElement = documentCreateDivElement();
  personalScheduleTimeElement.classList.add('css_location_group_item_bus_arrival_time_personal_schedule_time');

  const chartElement = documentCreateDivElement();
  chartElement.classList.add('css_location_group_item_bus_arrival_time_chart');

  titleElement.appendChild(iconElement);
  titleElement.appendChild(personalScheduleNameElement);
  titleElement.appendChild(personalScheduleTimeElement);
  busArrivalTimeElement.appendChild(titleElement);
  busArrivalTimeElement.appendChild(chartElement);

  return busArrivalTimeElement;
}

function setupLocationFieldSkeletonScreen(hash: IntegratedLocation['hash']): void {
  const playing_animation = getSettingOptionValue('playing_animation');
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;

  const itemQuantity = Math.floor(FieldHeight / 50) + 5;
  const items: Array<IntegratedLocationItem> = new Array(itemQuantity).fill({
    routeName: '',
    routeDirection: '',
    routeId: -1,
    bearing: '',
    stopId: -1,
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
  const properties = new Array(3).fill({ icon: '', value: '' });
  // reuse the objects (assume readonly)

  updateLocationField(
    {
      groupedItems: { g_0: items, g_1: items },
      groupQuantity: 2,
      groups: {
        g_0: { name: '載入中', properties: properties },
        g_1: { name: '載入中', properties: properties }
      },
      itemQuantity: { g_0: itemQuantity, g_1: itemQuantity },
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
    function updateStatus(thisElement: HTMLElement, thisItem: IntegratedLocationItem, skeletonScreen: boolean, animation: boolean): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisItemStatusElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_status');
      const nextSlideElement = elementQuerySelector(thisItemStatusElement, '.css_next_slide');
      const currentSlideElement = elementQuerySelector(thisItemStatusElement, '.css_current_slide');

      nextSlideElement.setAttribute('code', thisItem.status.code.toString());
      nextSlideElement.textContent = thisItem.status.text;

      if (!skeletonScreen) {
        if (animation) {
          if (locationVisibilityMonitor.isVisible(thisElement)) {
            currentSlideElement.addEventListener(
              'animationend',
              function () {
                currentSlideElement.setAttribute('code', thisItem.status.code.toString());
                currentSlideElement.textContent = thisItem.status.text;
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
      currentSlideElement.textContent = thisItem.status.text;
    }

    function updateRank(thisElement: HTMLElement, thisItem: IntegratedLocationItem, skeletonScreen: boolean, animation: boolean): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisRankElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_rank');
      const nextSlideElement = elementQuerySelector(thisRankElement, '.css_location_group_item_rank_next_slide');
      const currentSlideElement = elementQuerySelector(thisRankElement, '.css_location_group_item_rank_current_slide');

      nextSlideElement.setAttribute('code', thisItem.ranking.code.toString());
      nextSlideElement.textContent = thisItem.ranking.text;

      if (!skeletonScreen) {
        if (animation) {
          if (locationVisibilityMonitor.isVisible(thisElement)) {
            currentSlideElement.addEventListener(
              'animationend',
              function () {
                currentSlideElement.setAttribute('code', thisItem.ranking.code.toString());
                currentSlideElement.textContent = thisItem.ranking.text;
                currentSlideElement.classList.remove('css_location_group_item_rank_current_slide_fade_out');
                nextSlideElement.setAttribute('displayed', 'false');
              },
              { once: true }
            );
            nextSlideElement.setAttribute('displayed', 'true');
            currentSlideElement.classList.add('css_location_group_item_rank_current_slide_fade_out');
            return;
          }
        }
      }

      currentSlideElement.setAttribute('code', thisItem.ranking.code.toString());
      currentSlideElement.textContent = thisItem.ranking.text;
    }

    function updateRouteDirection(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisRouteDirectionElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_route_direction');
      thisRouteDirectionElement.textContent = `${thisItem.routeDirection} | ${thisItem.bearing}`;
    }

    function updateRouteName(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisHeadElement = elementQuerySelector(thisElement, '.css_location_group_item_head');
      const thisRouteNameElement = elementQuerySelector(thisHeadElement, '.css_location_group_item_route_name');
      thisRouteNameElement.textContent = thisItem.routeName;
    }

    function updateBuses(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisItemBodyElement = elementQuerySelector(thisElement, '.css_location_group_item_body');
      const thisBusesElement = elementQuerySelector(thisItemBodyElement, '.css_location_group_item_buses');
      const busElements = Array.from(elementQuerySelectorAll(thisBusesElement, '.css_location_group_item_bus'));
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
        const titleElement = elementQuerySelector(busElement, '.css_location_group_item_bus_title');
        const carNumberElement = elementQuerySelector(titleElement, '.css_location_group_item_bus_car_number');
        const attributesElement = elementQuerySelector(busElement, '.css_location_group_item_bus_attributes');
        const routeAttributeElement = elementQuerySelector(attributesElement, '.css_location_group_item_bus_route');
        const carStatusAttributeElement = elementQuerySelector(attributesElement, '.css_location_group_item_bus_car_status');
        const carTypeAttributeElement = elementQuerySelector(attributesElement, '.css_location_group_item_bus_car_type');
        busElement.setAttribute('on-this-route', booleanToString(busItem.onThisRoute));
        carNumberElement.textContent = busItem.carNumber;
        routeAttributeElement.textContent = `路線：${busItem.RouteName}`;
        carStatusAttributeElement.textContent = `狀態：${busItem.status.text}`;
        carTypeAttributeElement.textContent = `類型：${busItem.type}`;
      }

      thisBusesElement.setAttribute('empty', booleanToString(busesQuantity === 0));
    }

    function updateBusArrivalTimes(thisElement: HTMLElement, thisItem: IntegratedLocationItem): void {
      const thisItemBodyElement = elementQuerySelector(thisElement, '.css_location_group_item_body');
      const thisBusArrivalTimesElement = elementQuerySelector(thisItemBodyElement, '.css_location_group_item_bus_arrival_times');
      const busArrivalTimeElements = Array.from(elementQuerySelectorAll(thisBusArrivalTimesElement, '.css_location_group_item_bus_arrival_time'));
      const currentBusArrivalTimeElementsQuantity = busArrivalTimeElements.length;
      const busArrivalTimesQuantity = thisItem.busArrivalTimes.length;
      const difference = currentBusArrivalTimeElementsQuantity - busArrivalTimesQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newBusArrivalTimeElement = generateElementOfBusArrivalTime();
          fragment.appendChild(newBusArrivalTimeElement);
          busArrivalTimeElements.push(newBusArrivalTimeElement);
        }
        thisBusArrivalTimesElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentBusArrivalTimeElementsQuantity - 1, q = currentBusArrivalTimeElementsQuantity - difference - 1; p > q; p--) {
          busArrivalTimeElements[p].remove();
          busArrivalTimeElements.splice(p, 1);
        }
      }

      for (let i = 0; i < busArrivalTimesQuantity; i++) {
        const busArrivalTimeItem = thisItem.busArrivalTimes[i];
        const busArrivalTimeElement = busArrivalTimeElements[i];
        const titleElement = elementQuerySelector(busArrivalTimeElement, '.css_location_group_item_bus_arrival_time_title');
        const personalScheduleNameElement = elementQuerySelector(titleElement, '.css_location_group_item_bus_arrival_time_personal_schedule_name');
        const personalScheduleTimeElement = elementQuerySelector(titleElement, '.css_location_group_item_bus_arrival_time_personal_schedule_time');
        const chartElement = elementQuerySelector(busArrivalTimeElement, '.css_location_group_item_bus_arrival_time_chart');
        personalScheduleNameElement.textContent = busArrivalTimeItem.personalSchedule.name;
        personalScheduleTimeElement.textContent = `週${indexToDay(busArrivalTimeItem.day).name} ${timeObjectToString(busArrivalTimeItem.personalSchedule.period.start)} - ${timeObjectToString(busArrivalTimeItem.personalSchedule.period.end)}`;
        chartElement.innerHTML = decoder.decode(busArrivalTimeItem.chart);
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
      saveToFolderButtonElement.setAttribute('highlighted', booleanToString(isFolderContentSaved('stop', thisItem.stopId)));
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

    if (previousItem === null) {
      updateStatus(thisElement, thisItem, skeletonScreen, animation);
      updateRank(thisElement, thisItem, skeletonScreen, animation);
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
        updateStatus(thisElement, thisItem, skeletonScreen, animation);
        updateScheduleNotificationButton(thisElement, thisItem);
      }

      if (previousItem.ranking.number !== thisItem.ranking.number || previousItem.ranking.code !== thisItem.ranking.code) {
        updateRank(thisElement, thisItem, skeletonScreen, animation);
      }

      if (previousItem.stopId !== thisItem.stopId) {
        updateRouteDirection(thisElement, thisItem);
        updateRouteName(thisElement, thisItem);
        updateSaveToFolderButton(thisElement, thisItem);
      }

      if (!deepEqual(previousItem.buses, thisItem.buses)) {
        updateBuses(thisElement, thisItem);
      }

      if (
        !deepEqual(
          previousItem.busArrivalTimes.map((e) => e.state),
          thisItem.busArrivalTimes.map((e) => e.state)
        )
      ) {
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

    if (previousProperty === null) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (previousProperty.icon !== thisProperty.icon) {
        updateIcon(thisElement, thisProperty);
      }

      if (previousProperty.value !== thisProperty.value) {
        updateValue(thisElement, thisProperty);
      }

      if (previousAnimation !== animation) {
        updateAnimation(thisElement, animation);
      }

      if (previousSkeletonScreen !== skeletonScreen) {
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
  const groupKeys = [];
  for (const groupKey in itemQuantity) {
    groupKeys.push(groupKey);
  }

  locationSliding_groupQuantity = groupQuantity;
  locationSliding_fieldWidth = FieldWidth;
  locationSliding_fieldHeight = FieldHeight;

  let cumulativeOffset = 0;
  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = groupKeys[i];
    const width = getTextWidth(groups[groupKey].name, 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
    locationSliding_groupStyles[`gs_${i}`] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  locationSliding_groupStyles[`gs_${groupQuantity}`] = {
    width: 0,
    offset: cumulativeOffset
  };

  if (!locationSliding_sliding) {
    const initialGroupKey = `gs_${locationSliding_initialIndex}`;
    const initialGroupStyle = locationSliding_groupStyles[initialGroupKey];
    const offset = initialGroupStyle.offset * -1 + locationSliding_fieldWidth * 0.5 - initialGroupStyle.width * 0.5;
    const tabLineWidth = initialGroupStyle.width - tabPadding;
    updateLocationCSS(locationSliding_groupQuantity, offset, tabLineWidth, locationSliding_initialIndex);
  }

  if (previousIntegration?.hash !== integration.hash) {
    HeadButtonRightElement.onclick = function () {
      openLocationDetails(integration.hash);
    };
  }

  if (previousIntegration?.LocationName !== integration.LocationName) {
    HeadNameSpanElement.textContent = integration.LocationName;
  }

  if (previousAnimation !== animation) {
    HeadNameElement.setAttribute('animation', booleanToString(animation));
    GroupTabsElement.setAttribute('animation', booleanToString(animation));
  }

  if (previousSkeletonScreen !== skeletonScreen) {
    HeadNameElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    GroupTabsElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    GroupTabLineTrackElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  }

  // TODO: updateTab
  const groupElementsLength = groupElements.length;
  if (groupQuantity !== groupElementsLength) {
    const difference = groupElementsLength - groupQuantity;
    if (difference < 0) {
      const groupsFragment = new DocumentFragment();
      const tabsFragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newGroupElement = generateElementOfGroup();
        groupsFragment.appendChild(newGroupElement);
        groupElements.push(newGroupElement);
        const newTabElement = generateElementOfTab();
        tabsFragment.appendChild(newTabElement);
        tabElements.push(newTabElement);
        propertyElements.push([]);
        itemElements.push([]);
        stretchStates.push(new BitState(1));
      }
      GroupsElement.append(groupsFragment);
      GroupTabsTrayElement.append(tabsFragment);
    } else if (difference > 0) {
      for (let p = groupElementsLength - 1, q = groupElementsLength - difference - 1; p > q; p--) {
        groupElements[p].remove();
        groupElements.splice(p, 1);
        tabElements[p].remove();
        tabElements.splice(p, 1);
        propertyElements.splice(p, 1);
        itemElements.splice(p, 1);
        stretchStates.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = groupKeys[i];

    const thisLocationGroupElement = groupElements[i];

    const thisLocationGroupDetailsElement = elementQuerySelector(thisLocationGroupElement, '.css_location_group_details');
    const thisLocationGroupDetailsBodyElement = elementQuerySelector(thisLocationGroupDetailsElement, '.css_location_group_details_body');

    const thisGroupPropertyElementsLength = propertyElements[i].length;
    const groupPropertyQuantity = groups[groupKey].properties.length; // TODO: groupPropertiesQuantity
    if (groupPropertyQuantity !== thisGroupPropertyElementsLength) {
      const difference = thisGroupPropertyElementsLength - groupPropertyQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newPropertyElement = generateElementOfGroupDetailsProperty();
          fragment.appendChild(newPropertyElement);
          propertyElements[i].push(newPropertyElement);
        }
        thisLocationGroupDetailsBodyElement.append(fragment);
      } else if (difference > 0) {
        for (let p = thisGroupPropertyElementsLength - 1, q = thisGroupPropertyElementsLength - difference - 1; p > q; p--) {
          propertyElements[i][p].remove();
          propertyElements[i].splice(p, 1);
        }
      }
    }

    const thisLocationGroupItemsElement = elementQuerySelector(thisLocationGroupElement, '.css_location_group_items');

    const thisGroupItemElementsLength = itemElements[i].length;
    if (itemQuantity[groupKey] !== thisGroupItemElementsLength) {
      const difference = thisGroupItemElementsLength - itemQuantity[groupKey];
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newItemElement = generateElementOfItem(i);
          fragment.appendChild(newItemElement);
          itemElements[i].push(newItemElement);
        }
        thisLocationGroupItemsElement.append(fragment);
        locationVisibilityMonitor.add(itemElements[i].slice(thisGroupItemElementsLength));
        stretchStates[i].resize(itemQuantity[groupKey]);
      } else if (difference > 0) {
        for (let p = thisGroupItemElementsLength - 1, q = thisGroupItemElementsLength - difference - 1; p > q; p--) {
          itemElements[i][p].remove();
          itemElements[i].splice(p, 1);
        }
        stretchStates[i].resize(itemQuantity[groupKey]);
      }
    }

    const thisTabElement = tabElements[i];
    const thisTabSpanElement = elementQuerySelector(thisTabElement, 'span');

    thisTabSpanElement.textContent = groups[groupKey].name;
    thisTabElement.style.setProperty('--b-cssvar-location-tab-offset', `${locationSliding_groupStyles[`gs_${i}`].offset}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-width', `${locationSliding_groupStyles[`gs_${i}`].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-index', i.toString());

    if (skeletonScreen) {
      thisLocationGroupElement.scrollTop = 0;
      stretchStates[i].clear(); // clear state for updateStretch()
    }

    for (let k = 0; k < groupPropertyQuantity; k++) {
      const thisProperty = groups[groupKey].properties[k];
      const thisElement = propertyElements[i][k];
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
      const thisElement = itemElements[i][j];
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

  GroupTabsTrayElement.style.setProperty('--b-cssvar-location-tabs-tray-width', `${cumulativeOffset}px`);

  previousIntegration = integration;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

async function refreshLocation(): Promise<number> {
  try {
    const playing_animation = getSettingOptionValue('playing_animation');
    const refresh_interval_setting = getSettingOptionValue('refresh_interval');
    const busArrivalTimeChartSize = querySize('location-bus-arrival-time-chart');
    UpdateTimerElement.setAttribute('refreshing', 'true');
    UpdateTimerElement.classList.remove('css_location_update_timer_slide_rtl');
    const integration = await integrateLocation(currentHashSet_hash, busArrivalTimeChartSize.width, busArrivalTimeChartSize.height, function (message) {
      UpdateTimerElement.style.setProperty('--b-cssvar-location-update-timer-scale-x', message.percent.toString());
    });
    updateLocationField(integration, false, playing_animation);
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
    UpdateTimerElement.setAttribute('refreshing', 'false');
    animateUpdateTimer(interval);
    return interval;
  } catch (err) {
    promptMessage('error', `地點發生錯誤，將在${locationTickRetryInterval / 1000}秒後重試。`);
    animateUpdateTimer(locationTickRetryInterval);
    return locationTickRetryInterval;
  }
}

function initializeLocation(hash: IntegratedLocation['hash']): void {
  currentHashSet_hash = hash;

  locationSliding_initialIndex = 0;
  locationSliding_groupStyles = {};

  GroupsElement.scrollLeft = 0;
  GroupsElement.focus();

  setupLocationFieldSkeletonScreen(hash);

  if (locationTick.isPaused) {
    locationTick.resume(true);
  } else {
    locationTick.tick();
  }
}

export function showLocation(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideLocation(): void {
  Field.setAttribute('displayed', 'false');
}

export function openLocation(hash: IntegratedLocation['hash']): void {
  pushPageHistory('Location');
  logRecentView('location', hash);
  showLocation();
  initializeLocation(hash);
  hidePreviousPage();
}

export function closeLocation(): void {
  hideLocation();
  locationTick.pause();
  showPreviousPage();
  revokePageHistory('Location');
}

export function stretchLocationItem(groupIndex: number, thisItemElement: HTMLElement): void {
  const index = itemElements[groupIndex].indexOf(thisItemElement);
  if (index < 0) return;

  const itemElementsLength = itemElements[groupIndex].length;

  const itemBodyElement = elementQuerySelector(thisItemElement, '.css_location_group_item_body');

  const itemElementY = getElementRelativeTop(groupIndex, index);

  const stretched = stretchStates[groupIndex].state[index] === 1;
  const animation = previousAnimation;

  if (animation) {
    const pushDirection = stretched ? '2' : '1';

    // Separate the elements from the document flow while keeping its position
    thisItemElement.setAttribute('stretching', 'true');
    thisItemElement.style.setProperty('--b-cssvar-css-location-group-item-y', `${itemElementY}px`);

    // Set push direction and push state
    for (let i = index + 1; i < itemElementsLength; i++) {
      const thisItemElement = itemElements[groupIndex][i];
      thisItemElement.setAttribute('push-direction', pushDirection);
      thisItemElement.setAttribute('push-state', '1');
    }

    itemBodyElement.addEventListener(
      'transitionend',
      function () {
        // Reset the push direction and push state
        for (let i = index + 1; i < itemElementsLength; i++) {
          const thisItemElement = itemElements[groupIndex][i];
          thisItemElement.setAttribute('push-direction', '0');
          thisItemElement.setAttribute('push-state', '0');
        }
        // Deposit the element
        thisItemElement.setAttribute('stretching', 'false');
      },
      { once: true }
    );

    itemBodyElement.addEventListener(
      'transitionstart',
      function () {
        // Transition the elements below
        for (let i = index + 1; i < itemElementsLength; i++) {
          const thisItemElement = itemElements[groupIndex][i];
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
    stretchStates[groupIndex].set(index, 0);
  } else {
    itemBodyElement.setAttribute('displayed', 'true');
    thisItemElement.setAttribute('stretched', 'true');
    stretchStates[groupIndex].set(index, 1);
  }
}

export function switchLocationBodyTab(itemElement: HTMLElement, tabCode: number): void {
  const itemBodyElement = elementQuerySelector(itemElement, '.css_location_group_item_body');
  const buttonsElement = elementQuerySelector(itemBodyElement, '.css_location_group_item_buttons');
  const buttonElements = elementQuerySelectorAll(buttonsElement, '.css_location_group_item_button[type="tab"]');
  const tabElements = [elementQuerySelector(itemElement, '.css_location_group_item_buses'), elementQuerySelector(itemElement, '.css_location_group_item_bus_arrival_times')];
  const state = new Array(2).fill('false');
  state[tabCode] = 'true';
  for (let i = 0; i < 2; i++) {
    buttonElements[i].setAttribute('highlighted', state[i]);
    tabElements[i].setAttribute('displayed', state[i]);
  }
}

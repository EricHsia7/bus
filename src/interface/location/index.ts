import { IntegratedLocation, IntegratedLocationItem, integrateLocation, LocationGroupProperty } from '../../data/location/index';
import { getIconHTML } from '../icons/index';
import { getDataReceivingProgress } from '../../data/apis/loader';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { booleanToString, compareThings, generateIdentifier } from '../../tools/index';
import { getTextWidth } from '../../tools/graphic';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { getUpdateRate } from '../../data/analytics/update-rate/index';
import { GeneratedElement, pushPageHistory, openPreviousPage, closePreviousPage, GroupStyles, querySize } from '../index';
import { promptMessage } from '../prompt/index';
import { logRecentView } from '../../data/recent-views/index';

const LocationField = documentQuerySelector('.css_location_field');
const LocationHeadElement = elementQuerySelector(LocationField, '.css_location_head');
const LocationNameElement = elementQuerySelector(LocationHeadElement, '.css_location_name');
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
let locationRefreshTimer_streaming: boolean = false;
let locationRefreshTimer_lastUpdate: number = 0;
let locationRefreshTimer_nextUpdate: number = 0;
let locationRefreshTimer_refreshing: boolean = false;
let locationRefreshTimer_currentRequestID: string = '';
let locationRefreshTimer_currentProgress: number = -1;
let locationRefreshTimer_targetProgress: number = -1;
let locationRefreshTimer_streamStarted: boolean = false;
let locationRefreshTimer_timer: ReturnType<typeof setTimeout>;

var currentHashSet_hash: string = '';

var tabPadding: number = 20;

export function initializeLocationSliding(): void {
  LocationGroupsElement.addEventListener('touchstart', function () {
    locationSliding_initialIndex = Math.round(LocationGroupsElement.scrollLeft / locationSliding_fieldWidth);
  });

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

export function ResizeLocationField(): void {
  const WindowSize = querySize('window');
  const FieldWidth = WindowSize.width;
  const FieldHeight = WindowSize.height;
  LocationField.style.setProperty('--b-cssvar-location-field-width', `${FieldWidth}px`);
  LocationField.style.setProperty('--b-cssvar-location-field-height', `${FieldHeight}px`);
}

export function updateLocationCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  LocationGroupTabLineElement.style.setProperty('--b-cssvar-location-tab-line-width-scale', (tabLineWidth / 30).toFixed(5));
  LocationGroupsElement.style.setProperty('--b-cssvar-location-group-quantity', groupQuantity.toString());
  LocationGroupTabsTrayElement.style.setProperty('--b-cssvar-location-tabs-tray-offset', `${offset.toFixed(5)}px`);
  LocationGroupTabsTrayElement.style.setProperty('--b-cssvar-location-percentage', percentage.toFixed(5));
}

function updateUpdateTimer(): void {
  const smoothingFactor = 0.7;
  const time = new Date().getTime();
  if (locationRefreshTimer_refreshing) {
    locationRefreshTimer_targetProgress = -1 + getDataReceivingProgress(locationRefreshTimer_currentRequestID);
    locationRefreshTimer_currentProgress = (locationRefreshTimer_targetProgress - locationRefreshTimer_currentProgress) * smoothingFactor;
  } else {
    locationRefreshTimer_targetProgress = -1 * Math.min(1, Math.max(0, Math.abs(time - locationRefreshTimer_lastUpdate) / locationRefreshTimer_dynamicInterval));
    locationRefreshTimer_currentProgress = locationRefreshTimer_targetProgress;
  }
  LocationUpdateTimerElement.style.setProperty('--b-cssvar-update-timer', locationRefreshTimer_currentProgress.toString());
  window.requestAnimationFrame(function () {
    if (locationRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfItem(): GeneratedElement {
  const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_location_group_item');
  element.id = identifier;
  element.setAttribute('stretched', 'false');
  element.innerHTML = /*html*/ `<div class="css_location_group_item_head"><div class="css_location_group_item_rank"><div class="css_location_group_item_rank_next_slide" code="-1"></div><div class="css_location_group_item_rank_current_slide" code="-1"></div></div><div class="css_location_group_item_route_direction"></div><div class="css_location_group_item_route_name"></div><div class="css_location_group_item_capsule"><div class="css_location_group_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_location_group_item_stretch" onclick="bus.location.stretchLocationItemBody('${identifier}')">${getIconHTML('keyboard_arrow_down')}</div><div class="css_location_group_item_capsule_separator"></div></div></div><div class="css_location_group_item_body" displayed="false"><div class="css_location_group_item_buttons"><div class="css_location_group_item_button" highlighted="true" type="tab" onclick="bus.location.switchLocationBodyTab('${identifier}', 0)" code="0"><div class="css_location_group_item_button_icon">${getIconHTML('directions_bus')}</div>公車</div><div class="css_location_group_item_button" highlighted="false" type="tab" onclick="bus.location.switchLocationBodyTab('${identifier}', 1)" code="1"><div class="css_location_group_item_button_icon">${getIconHTML('departure_board')}</div>抵達時間</div><div class="css_location_group_item_button" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder('stop', ['${identifier}', null, null])"><div class="css_location_group_item_button_icon">${getIconHTML('folder')}</div>儲存至資料夾</div><div class="css_location_group_item_button" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification('stop', ['${identifier}', null, null, null])" enabled="true"><div class="css_location_group_item_button_icon">${getIconHTML('notifications')}</div>設定到站通知</div></div><div class="css_location_group_item_buses" displayed="true"></div><div class="css_location_group_item_bus_arrival_times" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  const identifier = generateIdentifier('g');
  const element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_location_group');
  element.innerHTML = /*html*/ `<div class="css_location_group_details"><div class="css_location_group_details_body"></div></div><div class="css_location_group_items"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfTab(): GeneratedElement {
  const identifier = generateIdentifier('t');
  const element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_location_group_tab');
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroupDetailsProperty(): GeneratedElement {
  const identifier = generateIdentifier('p');
  const element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_location_group_details_property');
  element.innerHTML = /*html*/ `<div class="css_location_details_property_icon"></div><div class="css_location_details_property_value"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function setUpLocationFieldSkeletonScreen(Field: HTMLElement): void {
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
        status: { code: 8, text: '', time: -6 },
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
    Field,
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
            }
          ]
        }
      },
      itemQuantity: defaultItemQuantity,
      LocationName: '載入中',
      dataUpdateTime: 0
    },
    true,
    playing_animation
  );
}

function updateLocationField(Field: HTMLElement, integration: IntegratedLocation, skeletonScreen: boolean, animation: boolean): void {
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
      const nextSlide = elementQuerySelector(thisItemStatusElement, '.css_next_slide');
      const currentSlide = elementQuerySelector(thisItemStatusElement, '.css_current_slide');

      nextSlide.setAttribute('code', thisItem.status.code.toString());
      nextSlide.innerText = thisItem.status.text;

      if (animation && bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
        currentSlide.addEventListener(
          'animationend',
          function () {
            currentSlide.setAttribute('code', thisItem.status.code.toString());
            currentSlide.innerText = thisItem.status.text;
            currentSlide.classList.remove('css_slide_fade_out');
          },
          { once: true }
        );
        currentSlide.classList.add('css_slide_fade_out');
      } else {
        currentSlide.setAttribute('code', thisItem.status.code.toString());
        currentSlide.innerText = thisItem.status.text;
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
      const nextSlide = elementQuerySelector(thisRankElement, '.css_location_group_item_rank_next_slide');
      const currentSlide = elementQuerySelector(thisRankElement, '.css_location_group_item_rank_current_slide');

      nextSlide.setAttribute('code', thisItem.ranking.code.toString());
      nextSlide.innerText = thisItem.ranking.text;

      if (animation && bottom > 0 && top < windowHeight && right > 0 && left < windowWidth) {
        currentSlide.addEventListener(
          'animationend',
          function () {
            currentSlide.setAttribute('code', thisItem.ranking.code.toString());
            currentSlide.innerText = thisItem.ranking.text;
            currentSlide.classList.remove('css_location_group_item_rank_current_slide_fade_out');
          },
          { once: true }
        );
        currentSlide.classList.add('css_location_group_item_rank_current_slide_fade_out');
      } else {
        currentSlide.setAttribute('code', thisItem.ranking.code.toString());
        currentSlide.innerText = thisItem.ranking.text;
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
      elementQuerySelector(thisElement, '.css_location_group_item_buses').innerHTML = thisItem.buses.length === 0 ? '<div class="css_location_group_item_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_location_group_item_bus" on-this-route="${bus.onThisRoute}"><div class="css_location_group_item_bus_title"><div class="css_location_group_item_bus_icon">${getIconHTML('directions_bus')}</div><div class="css_location_group_item_bus_car_number">${bus.carNumber}</div></div><div class="css_location_group_item_bus_attributes"><div class="css_location_group_item_bus_route">路線：${bus.RouteName}</div><div class="css_location_group_item_bus_car_status">狀態：${bus.status.text}</div><div class="css_location_group_item_bus_car_type">類型：${bus.type}</div></div></div>`).join('');
    }

    // TODO: bus arrival time
    // TODO: butttons
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

    if (previousItem === null) {
      updateStatus(thisElement, thisItem, animation);
      updateRank(thisElement, thisItem, animation);
      updateRouteDirection(thisElement, thisItem);
      updateRouteName(thisElement, thisItem);
      updateBuses(thisElement, thisItem);
      updateStretch(thisElement, skeletonScreen);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (thisItem.status.time !== previousItem.status.time) {
        updateStatus(thisElement, thisItem, animation);
      }
      if (previousItem.ranking.number !== thisItem.ranking.number || previousItem.ranking.code !== thisItem.ranking.code) {
        updateRank(thisElement, thisItem, animation);
      }
      if (!compareThings(previousItem.route_direction, thisItem.route_direction)) {
        updateRouteDirection(thisElement, thisItem);
      }
      if (!compareThings(previousItem.route_name, thisItem.route_name)) {
        updateRouteName(thisElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisElement, thisItem);
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
      if (!(animation === previousAnimation)) {
        updateAnimation(thisElement, animation);
      }
      if (!(skeletonScreen === previousSkeletonScreen)) {
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
  LocationGroupTabsElement.setAttribute('animation', booleanToString(animation));
  LocationGroupTabsElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  LocationGroupTabLineTrackElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  // TODO: updateTab

  const currentGroupSeatQuantity = elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    const capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newGroupElement = generateElementOfGroup();
        elementQuerySelector(Field, `.css_location_groups`).appendChild(newGroupElement.element);
        const newTabElement = generateElementOfTab();
        elementQuerySelector(Field, `.css_location_head .css_location_group_tabs_tray`).appendChild(newTabElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const groupIndex = currentGroupSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[groupIndex].remove();
        elementQuerySelectorAll(Field, `.css_location_head .css_location_group_tabs_tray .css_location_group_tab`)[groupIndex].remove();
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items .css_location_group_item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (let o = 0; o < Math.abs(capacity); o++) {
          var thisItemElement = generateElementOfItem();
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items`).appendChild(thisItemElement.element);
        }
      } else {
        for (let o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items .css_location_group_item`)[itemIndex].remove();
        }
      }
    }

    var currentGroupPropertySeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`).length;
    var groupPropertyQuantity = groups[groupKey].properties.length;
    if (!(groupPropertyQuantity === currentGroupPropertySeatQuantity)) {
      var capacity = currentGroupPropertySeatQuantity - groupPropertyQuantity;
      if (capacity < 0) {
        for (let o = 0; o < Math.abs(capacity); o++) {
          //var propertyIndex = currentGroupPropertySeatQuantity + o;
          var thisPropertyElement = generateElementOfGroupDetailsProperty();
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_details .css_location_group_details_body`).appendChild(thisPropertyElement.element);
        }
      } else {
        for (let o = 0; o < Math.abs(capacity); o++) {
          var propertyIndex = currentGroupPropertySeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`)[propertyIndex].remove();
        }
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const thisTabElement = elementQuerySelectorAll(Field, `.css_location_head .css_location_group_tabs_tray .css_location_group_tab`)[i];
    thisTabElement.innerHTML = /*html*/ `<span>${groups[groupKey].name}</span>`;
    thisTabElement.style.setProperty('--b-cssvar-location-tab-width', `${locationSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-index', i.toString());
    const thisGroupElement = elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i];
    const groupPropertyQuantity = groups[groupKey].properties.length;

    for (let k = 0; k < groupPropertyQuantity; k++) {
      const thisProperty = groups[groupKey].properties[k];
      const thisElement = elementQuerySelectorAll(thisGroupElement, `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`)[k];
      if (previousIntegration.hasOwnProperty('groups')) {
        if (previousIntegration.groups.hasOwnProperty(groupKey)) {
          if (previousIntegration.groups[groupKey].properties[k]) {
            var previousProperty = previousIntegration.groups[groupKey].properties[k];
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
      const thisElement = elementQuerySelectorAll(thisGroupElement, `.css_location_group_items .css_location_group_item`)[j];
      const thisItem = groupedItems[groupKey][j];
      console.log(JSON.stringify(thisItem, null, 2));
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
  previousSkeletonScreen = skeletonScreen;
}

async function refreshLocation(): Promise<object> {
  const time = new Date().getTime();
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  locationRefreshTimer_dynamic = refresh_interval_setting.dynamic;
  locationRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  locationRefreshTimer_refreshing = true;
  locationRefreshTimer_currentRequestID = generateIdentifier('r');
  LocationUpdateTimerElement.setAttribute('refreshing', 'true');
  const integration = await integrateLocation(currentHashSet_hash, locationRefreshTimer_currentRequestID);
  updateLocationField(LocationField, integration, false, playing_animation);
  locationRefreshTimer_lastUpdate = time;
  if (locationRefreshTimer_dynamic) {
    const updateRate = await getUpdateRate();
    locationRefreshTimer_nextUpdate = Math.max(time + locationRefreshTimer_minInterval, integration.dataUpdateTime + locationRefreshTimer_baseInterval / updateRate);
  } else {
    locationRefreshTimer_nextUpdate = time + locationRefreshTimer_baseInterval;
  }
  locationRefreshTimer_dynamicInterval = Math.max(locationRefreshTimer_minInterval, locationRefreshTimer_nextUpdate - time);
  locationRefreshTimer_refreshing = false;
  LocationUpdateTimerElement.setAttribute('refreshing', 'false');
  return { status: 'Successfully refreshed the location.' };
}

export function streamLocation(): void {
  refreshLocation()
    .then((result) => {
      if (locationRefreshTimer_streaming) {
        locationRefreshTimer_timer = setTimeout(function () {
          streamLocation();
        }, Math.max(locationRefreshTimer_minInterval, locationRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        locationRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (locationRefreshTimer_streaming) {
        promptMessage(`（地點）發生網路錯誤，將在${locationRefreshTimer_retryInterval / 1000}秒後重試。`, 'error');
        locationRefreshTimer_timer = setTimeout(function () {
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
  elementQuerySelector(LocationField, '.css_location_groups').scrollLeft = 0;
  setUpLocationFieldSkeletonScreen(LocationField);
  if (!locationRefreshTimer_streaming) {
    locationRefreshTimer_streaming = true;
    if (!locationRefreshTimer_streamStarted) {
      locationRefreshTimer_streamStarted = true;
      streamLocation();
    } else {
      refreshLocation();
    }
    locationRefreshTimer_currentProgress = -1;
    locationRefreshTimer_targetProgress = -1;
    updateUpdateTimer();
  }
  closePreviousPage();
}

export function closeLocation(): void {
  // revokePageHistory('Location');
  LocationField.setAttribute('displayed', 'false');
  locationRefreshTimer_streaming = false;
  locationRefreshTimer_currentProgress = -1;
  locationRefreshTimer_targetProgress = -1;
  openPreviousPage();
}

export function stretchLocationItemBody(itemID: string): void {
  const itemElement = elementQuerySelector(LocationGroupsElement, `.css_location_group .css_location_group_items .css_location_group_item#${itemID}`);
  const itemBodyElement = elementQuerySelector(itemElement, '.css_location_group_item_body');
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

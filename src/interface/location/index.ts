import { integrateLocation } from '../../data/location/index';
import { getIconHTML } from '../icons/index';
import { getDataReceivingProgress } from '../../data/apis/loader';
import { getSettingOptionValue } from '../../data/settings/index';
import { compareThings, generateIdentifier } from '../../tools/index';
import { getTextWidth } from '../../tools/graphic';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { getUpdateRate } from '../../data/analytics/update-rate';
import { GeneratedElement, FieldSize, pushPageHistory, openPreviousPage, closePreviousPage } from '../index';
import { promptMessage } from '../prompt/index';
import { logRecentView } from '../../data/recent-views/index';

let previousIntegration: object = {};

let locationSliding_initialIndex: number = 0;
let locationSliding_targetIndex: number = 0;
let locationSliding_groupQuantity: number = 0;
let locationSliding_groupStyles: object = {};
let locationSliding_fieldWidth: number = 0;
let locationSliding_fieldHeight: number = 0;
let locationSliding_sliding: boolean = false;

let locationRefreshTimer_retryInterval: number = 10 * 1000;
let locationRefreshTimer_baseInterval: number = 15 * 1000;
let locationRefreshTimer_minInterval: number = 5 * 1000;
let locationRefreshTimer_dynamicInterval: number = 15 * 1000;
let locationRefreshTimer_auto: boolean = true;
let locationRefreshTimer_streaming: boolean = false;
let locationRefreshTimer_lastUpdate: number = 0;
let locationRefreshTimer_nextUpdate: number = 0;
let locationRefreshTimer_refreshing: boolean = false;
let locationRefreshTimer_currentRequestID: string = '';
let locationRefreshTimer_streamStarted: boolean = false;
let locationRefreshTimer_timer: ReturnType<typeof setTimeout>;

var currentHashSet_hash: string = '';

var tabPadding: number = 20;

export function initializeLocationSliding(): void {
  var element = documentQuerySelector('.css_location_field .css_location_groups');

  element.addEventListener('touchstart', function (event) {
    locationSliding_initialIndex = Math.round(element.scrollLeft / locationSliding_fieldWidth);
  });

  element.addEventListener('scroll', function (event) {
    locationSliding_sliding = true;
    var currentIndex = event.target.scrollLeft / locationSliding_fieldWidth;
    if (currentIndex > locationSliding_initialIndex) {
      locationSliding_targetIndex = locationSliding_initialIndex + 1;
    } else {
      locationSliding_targetIndex = locationSliding_initialIndex - 1;
    }
    var initialSize = locationSliding_groupStyles[`g_${locationSliding_initialIndex}`] || { width: 0, offset: 0 };
    var targetSize = locationSliding_groupStyles[`g_${locationSliding_targetIndex}`] || { width: 0, offset: 0 };
    var tabWidth = initialSize.width + (targetSize.width - initialSize.width) * Math.abs(currentIndex - locationSliding_initialIndex);
    var offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * Math.abs(currentIndex - locationSliding_initialIndex)) * -1 + locationSliding_fieldWidth * 0.5 - tabWidth * 0.5;
    updateLocationCSS(locationSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);
    if (currentIndex === locationSliding_targetIndex) {
      locationSliding_initialIndex = Math.round(element.scrollLeft / locationSliding_fieldWidth);
      locationSliding_sliding = false;
    }
  });
}

function queryLocationFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function ResizeLocationField(): void {
  const FieldSize = queryLocationFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  const Field = documentQuerySelector('.css_location_field');
  Field.style.setProperty('--b-cssvar-location-field-width', `${FieldWidth}px`);
  Field.style.setProperty('--b-cssvar-location-field-height', `${FieldHeight}px`);
}

export function updateLocationCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  documentQuerySelector('.css_location_field .css_location_head .css_location_group_tab_line_track .css_location_group_tab_line').style.setProperty('--b-cssvar-location-tab-line-width-scale', (tabLineWidth / 30).toFixed(5));
  documentQuerySelector('.css_location_field .css_location_groups').style.setProperty('--b-cssvar-location-group-quantity', groupQuantity);
  documentQuerySelector('.css_location_field .css_location_head .css_location_group_tabs .css_location_group_tabs_tray').style.setProperty('--b-cssvar-location-tabs-tray-offset', `${offset.toFixed(5)}px`);
  documentQuerySelector('.css_location_field .css_location_head .css_location_group_tabs .css_location_group_tabs_tray').style.setProperty('--b-cssvar-location-percentage', percentage.toFixed(5));
}

function updateUpdateTimer(): void {
  const updateTimerElement = documentQuerySelector('.css_location_update_timer');
  var time = new Date().getTime();
  var percentage = 0;
  if (locationRefreshTimer_refreshing) {
    percentage = -1 + getDataReceivingProgress(locationRefreshTimer_currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - locationRefreshTimer_lastUpdate) / locationRefreshTimer_dynamicInterval));
  }
  updateTimerElement.style.setProperty('--b-cssvar-update-timer', percentage);
  window.requestAnimationFrame(function () {
    if (locationRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfItem(): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_location_group_item');
  element.id = identifier;
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="css_location_group_item_head"><div class="css_location_group_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_location_group_item_route_direction"></div><div class="css_location_group_item_route_name"></div><div class="css_location_group_item_stretch" onclick="bus.location.stretchLocationItemBody('${identifier}')">${getIconHTML('keyboard_arrow_down')}</div></div><div class="css_location_group_item_body"><div class="css_location_group_item_buttons"><div class="css_location_group_item_button" highlighted="true" onclick="bus.location.switchLocationBodyTab('${identifier}', 0)" code="0">公車</div></div><div class="css_location_group_item_buses" displayed="true"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  var identifier = generateIdentifier('g');
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_location_group');
  element.innerHTML = `<div class="css_location_group_details"><div class="css_location_group_details_body"></div></div><div class="css_location_group_items"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfTab(): GeneratedElement {
  var identifier = generateIdentifier('t');
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_location_group_tab');
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroupDetailsProperty(): GeneratedElement {
  var identifier = generateIdentifier('p');
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_location_group_details_property');
  element.innerHTML = `<div class="css_location_details_property_icon"></div><div class="css_location_details_property_value"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function setUpLocationFieldSkeletonScreen(Field: HTMLElement): void {
  const FieldSize = queryLocationFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultItemQuantity = { g_0: Math.floor(FieldHeight / 50) + 5, g_1: Math.floor(FieldHeight / 50) + 5 };
  var defaultGroupQuantity = 2;
  var groupedItems = {};
  for (let i = 0; i < defaultGroupQuantity; i++) {
    var groupKey = `g_${i}`;
    groupedItems[groupKey] = [];
    for (let j = 0; j < defaultItemQuantity[groupKey]; j++) {
      groupedItems[groupKey].push({
        route_name: '',
        route_direction: '',
        status: { code: -1, text: '' },
        buses: []
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
              icon: 'none',
              value: ''
            },
            {
              key: '1',
              icon: 'none',
              value: ''
            }
          ]
        },
        g_1: {
          name: '載入中',
          properties: [
            {
              key: '0',
              icon: 'none',
              value: ''
            },
            {
              key: '1',
              icon: 'none',
              value: ''
            }
          ]
        }
      },
      itemQuantity: defaultItemQuantity,
      LocationName: '載入中'
    },
    true
  );
}

function updateLocationField(Field: HTMLElement, integration: object, skeletonScreen: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: object, previousItem: object): void {
    function updateStatus(thisElement: HTMLElement, thisItem: object): void {
      var nextSlide = elementQuerySelector(thisElement, '.css_location_group_item_status .css_next_slide');
      var currentSlide = elementQuerySelector(thisElement, '.css_location_group_item_status .css_current_slide');
      nextSlide.setAttribute('code', thisItem.status.code);
      nextSlide.innerText = thisItem.status.text;
      currentSlide.addEventListener(
        'animationend',
        function () {
          currentSlide.setAttribute('code', thisItem.status.code);
          currentSlide.innerText = thisItem.status.text;
          currentSlide.classList.remove('css_slide_fade_out');
        },
        { once: true }
      );
      currentSlide.classList.add('css_slide_fade_out');
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_location_group_item_route_name').innerText = thisItem.route_name;
      elementQuerySelector(thisElement, '.css_location_group_item_route_direction').innerText = thisItem.route_direction;
    }
    function updateBuses(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_location_group_item_buses').innerHTML = thisItem.buses.length === 0 ? '<div class="css_location_group_item_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_location_group_item_bus" on-this-route="${bus.onThisRoute}"><div class="css_location_group_item_bus_title"><div class="css_location_group_item_bus_icon">${getIconHTML('directions_bus')}</div><div class="css_location_group_item_bus_car_number">${bus.carNumber}</div></div><div class="css_location_group_item_bus_attributes"><div class="css_location_group_item_bus_route">路線：${bus.RouteName}</div><div class="css_location_group_item_bus_car_status">狀態：${bus.status.text}</div><div class="css_location_group_item_bus_car_type">類型：${bus.type}</div></div></div>`).join('');
    }
    function updateStretch(thisElement: HTMLElement, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        thisElement.setAttribute('stretched', false);
      }
    }
    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
    }
    if (previousItem === null) {
      updateStatus(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateBuses(thisElement, thisItem);
      updateStretch(thisElement, skeletonScreen);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
        updateStatus(thisElement, thisItem);
      }
      if (!compareThings(previousItem.route_name, thisItem.route_name) || !compareThings(previousItem.route_direction, thisItem.route_direction)) {
        updateName(thisElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisElement, thisItem);
      }
      updateStretch(thisElement, skeletonScreen);
      updateSkeletonScreen(thisElement, skeletonScreen);
    }
  }
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_location_details_property_icon').innerHTML = getIconHTML(thisProperty.icon);
    }
    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_location_details_property_value').innerHTML = thisProperty.value;
    }
    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
    }
    if (previousProperty === null) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (!compareThings(previousProperty.icon, thisProperty.icon)) {
        updateIcon(thisElement, thisProperty);
      }
      if (!compareThings(previousProperty.value, thisProperty.value)) {
        updateValue(thisElement, thisProperty);
      }
      updateSkeletonScreen(thisElement, skeletonScreen);
    }
  }

  const FieldSize = queryLocationFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousIntegration === {}) {
    previousIntegration = integration;
  }

  var groupQuantity = integration.groupQuantity;
  var itemQuantity = integration.itemQuantity;
  var groupedItems = integration.groupedItems;
  var groups = integration.groups;

  locationSliding_groupQuantity = groupQuantity;
  locationSliding_fieldWidth = FieldWidth;
  locationSliding_fieldHeight = FieldHeight;

  var cumulativeOffset = 0;
  for (let i = 0; i < groupQuantity; i++) {
    var width = getTextWidth(groups[`g_${i}`].name, 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
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
  elementQuerySelector(Field, '.css_location_name').innerHTML = `<span>${integration.LocationName}</span>`;
  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentGroupSeatQuantity = elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var thisGroupElement = generateElementOfGroup();
        elementQuerySelector(Field, `.css_location_groups`).appendChild(thisGroupElement.element);
        var thisTabElement = generateElementOfTab();
        elementQuerySelector(Field, `.css_location_head .css_location_group_tabs_tray`).appendChild(thisTabElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity - 1 - o;
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
    var groupKey = `g_${i}`;
    var thisTabElement = elementQuerySelectorAll(Field, `.css_location_head .css_location_group_tabs_tray .css_location_group_tab`)[i];
    thisTabElement.innerHTML = `<span>${groups[groupKey].name}</span>`;
    thisTabElement.style.setProperty('--b-cssvar-location-tab-width', `${locationSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-index', i);
    var groupPropertyQuantity = groups[groupKey].properties.length;
    for (let k = 0; k < groupPropertyQuantity; k++) {
      var thisProperty = groups[groupKey].properties[k];
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`)[k];
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
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items .css_location_group_item`)[j];
      var thisItem = groupedItems[groupKey][j];
      if (previousIntegration.hasOwnProperty('groupedItems')) {
        if (previousIntegration.groupedItems.hasOwnProperty(groupKey)) {
          if (previousIntegration.groupedItems[groupKey][j]) {
            var previousItem = previousIntegration.groupedItems[groupKey][j];
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
}

async function refreshLocation(): Promise<object> {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  locationRefreshTimer_auto = refresh_interval_setting.auto;
  locationRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  locationRefreshTimer_refreshing = true;
  locationRefreshTimer_currentRequestID = generateIdentifier('r');
  documentQuerySelector('.css_location_update_timer').setAttribute('refreshing', true);
  var integration = await integrateLocation(currentHashSet_hash, locationRefreshTimer_currentRequestID);
  var Field = documentQuerySelector('.css_location_field');
  updateLocationField(Field, integration, false);
  locationRefreshTimer_lastUpdate = new Date().getTime();
  if (locationRefreshTimer_auto) {
    var updateRate = await getUpdateRate();
    locationRefreshTimer_nextUpdate = Math.max(new Date().getTime() + locationRefreshTimer_minInterval, integration.dataUpdateTime + locationRefreshTimer_baseInterval / updateRate);
  } else {
    locationRefreshTimer_nextUpdate = new Date().getTime() + locationRefreshTimer_baseInterval;
  }
  locationRefreshTimer_dynamicInterval = Math.max(locationRefreshTimer_minInterval, locationRefreshTimer_nextUpdate - new Date().getTime());
  locationRefreshTimer_refreshing = false;
  documentQuerySelector('.css_location_update_timer').setAttribute('refreshing', false);
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
  var Field = documentQuerySelector('.css_location_field');
  Field.setAttribute('displayed', 'true');
  elementQuerySelector(Field, '.css_location_groups').scrollLeft = 0;
  setUpLocationFieldSkeletonScreen(Field);
  if (!locationRefreshTimer_streaming) {
    locationRefreshTimer_streaming = true;
    if (!locationRefreshTimer_streamStarted) {
      locationRefreshTimer_streamStarted = true;
      streamLocation();
    } else {
      refreshLocation();
    }
    updateUpdateTimer();
  }
  closePreviousPage();
}

export function closeLocation(): void {
  // revokePageHistory('Location');
  var Field = documentQuerySelector('.css_location_field');
  Field.setAttribute('displayed', 'false');
  locationRefreshTimer_streaming = false;
  openPreviousPage();
}

export function stretchLocationItemBody(itemID: string): void {
  var itemElement = documentQuerySelector(`.css_location_field .css_location_groups .css_location_group .css_location_group_items .css_location_group_item#${itemID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
  }
}

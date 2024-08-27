import { integrateLocation } from '../../data/apis/index';
import { getIconHTML } from '../icons/index';
import { getDataReceivingProgress } from '../../data/apis/loader';
import { getSettingOptionValue } from '../../data/settings/index';
import { compareThings, getTextWidth, calculateStandardDeviation, generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { getUpdateRate } from '../../data/analytics/update-rate';
import { GeneratedElement, FieldSize } from '../index';

var previousIntegration: object = {};

var locationSliding_currentGroup: number = 0;
var locationSliding_targetGroup: number = 0;
var locationSliding_groupQuantity: number = 0;
var locationSliding_groupStyles: object = {};
var locationSliding_scrollLog: Array = [];
var locationSliding_fieldWidth: number = 0;
var locationSliding_fieldHeight: number = 0;
var locationSliding_sliding: boolean = false;

var locationRefreshTimer_baseInterval: number = 15 * 1000;
var locationRefreshTimer_minInterval: number = 5 * 1000;
var locationRefreshTimer_dynamicInterval: number = 15 * 1000;
var locationRefreshTimer_auto: boolean = true;
var locationRefreshTimer_streaming: boolean = false;
var locationRefreshTimer_lastUpdate: number = 0;
var locationRefreshTimer_nextUpdate: number = 0;
var locationRefreshTimer_refreshing: boolean = false;
var locationRefreshTimer_currentRequestID: string = '';
var locationRefreshTimer_streamStarted: boolean = false;
var locationRefreshTimer_timer: ReturnType<typeof setTimeout>;
var locationRefreshTimer_currentPercentage: number = 0;

var currentHashSet_hash: string = '';

var tabPadding: number = 20;

export function initializeLocationSliding(): void {
  var element = documentQuerySelector('.css_location_field .css_location_groups');
  function monitorScrollLeft(element, callback) {
    locationSliding_scrollLog.push(element.scrollLeft);
    if (locationSliding_scrollLog.length > 10) {
      locationSliding_scrollLog = locationSliding_scrollLog.slice(1);
    }
    if (calculateStandardDeviation(locationSliding_scrollLog) < Math.pow(10, -10)) {
      callback();
    } else {
      window.requestAnimationFrame(function () {
        monitorScrollLeft(element, callback);
      });
    }
  }
  element.addEventListener('touchstart', function (event) {
    locationSliding_currentGroup = Math.round(element.scrollLeft / locationSliding_fieldWidth);
    locationSliding_sliding = true;
  });
  element.addEventListener('touchend', function (event) {
    monitorScrollLeft(element, function () {
      locationSliding_currentGroup = Math.round(element.scrollLeft / locationSliding_fieldWidth);
      locationSliding_sliding = false;
    });
  });
  element.addEventListener('scroll', function (event) {
    var slidingGroupIndex = event.target.scrollLeft / locationSliding_fieldWidth;
    if (slidingGroupIndex > locationSliding_currentGroup) {
      locationSliding_targetGroup = locationSliding_currentGroup + 1;
    } else {
      locationSliding_targetGroup = locationSliding_currentGroup - 1;
    }
    var current_size = locationSliding_groupStyles[`g_${locationSliding_currentGroup}`] || { width: 0, offset: 0 };
    var target_size = locationSliding_groupStyles[`g_${locationSliding_targetGroup}`] || { width: 0, offset: 0 };
    var tab_width = current_size.width + (target_size.width - current_size.width) * Math.abs(slidingGroupIndex - locationSliding_currentGroup);
    var offset = (current_size.offset + (target_size.offset - current_size.offset) * Math.abs(slidingGroupIndex - locationSliding_currentGroup)) * -1 + locationSliding_fieldWidth * 0.5 - tab_width * 0.5;
    updateLocationCSS(locationSliding_groupQuantity, offset, tab_width - tabPadding, slidingGroupIndex);
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
  documentQuerySelector('#location_field_size').innerHTML = `:root {--b-cssvar-l-fw:${FieldWidth}px;--b-cssvar-l-fh:${FieldHeight}px;}`;
}

function updateLocationCSS(groupQuantity: number, offset: number, tab_line_width: number, percentage: number): void {
  documentQuerySelector(`style#location_style`).innerHTML = `:root{--b-cssvar-location-group-quantity:${groupQuantity};--b-cssvar-location-tabs-tray-offset:${offset}px;--b-cssvar-location-tab-line-width:${tab_line_width};--b-cssvar-location-percentage:${percentage};}`;
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
  const delta = Math.abs(locationRefreshTimer_currentPercentage - percentage);
  if (delta > 0.1 || delta === 0) {
    updateTimerElement.setAttribute('transition', 'true');
  } else {
    updateTimerElement.setAttribute('transition', 'false');
  }
  updateTimerElement.style.setProperty('--b-cssvar-update-timer', percentage);
  locationRefreshTimer_currentPercentage = percentage;
  window.requestAnimationFrame(function () {
    if (locationRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfItem(): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.classList.add('css_item');
  element.id = identifier;
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="css_head"><div class="css_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_route_direction"></div><div class="css_route_name"></div><div class="css_stretch" onclick="bus.location.stretchLocationItemBody('${identifier}')">${getIconHTML('keyboard_arrow_down')}</div></div><div class="css_body"><div class="css_tabs"><div class="css_tab" selected="true" onclick="bus.location.switchLocationBodyTab('${identifier}', 0)" code="0">此路線的公車</div></div><div class="css_buses" displayed="true"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  var identifier = `g_${generateIdentifier()}`;
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
  var identifier = `t_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('css_location_group_tab');
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroupDetailsProperty(): GeneratedElement {
  var identifier = `p_${generateIdentifier()}`;
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
  var defaultItemQuantity = { g_0: Math.floor(FieldHeight / 50) + 5 };
  var defaultGroupQuantity = 1;
  var groupedItems = {};
  for (var i = 0; i < defaultGroupQuantity; i++) {
    var groupKey = `g_${i}`;
    groupedItems[groupKey] = [];
    for (var j = 0; j < defaultItemQuantity[groupKey]; j++) {
      groupedItems[groupKey].push({
        route_name: '',
        route_direction: '',
        status: { code: -1, text: '' },
        buses: null
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
      var nextSlide = elementQuerySelector(thisElement, '.css_status .css_next_slide');
      var currentSlide = elementQuerySelector(thisElement, '.css_status .css_current_slide');
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
      elementQuerySelector(thisElement, '.css_route_name').innerText = thisItem.route_name;
      elementQuerySelector(thisElement, '.css_route_direction').innerText = thisItem.route_direction;
    }
    function updateBuses(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_buses').innerHTML = thisItem.buses === null ? '<div class="css_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_bus" on-this-route="${bus.onThisRoute}"><div class="css_bus_title"><div class="css_car_icon">${getIconHTML('directions_bus')}</div><div class="css_car_number">${bus.carNumber}</div></div><div class="css_car_attributes"><div class="css_car_route">路線：${bus.RouteName}</div><div class="css_car_status">狀態：${bus.status.text}</div><div class="css_car_type">類型：${bus.type}</div></div></div>`).join('');
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
  for (var i = 0; i < groupQuantity; i++) {
    var width = getTextWidth(groups[`g_${i}`].name, 500, '17px', `"Noto Sans", sans-serif`, 100, 'normal', 'none', '1.2') + tabPadding;
    locationSliding_groupStyles[`g_${i}`] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  var offset = locationSliding_groupStyles[`g_${locationSliding_currentGroup}`].offset * -1 + locationSliding_fieldWidth * 0.5 - locationSliding_groupStyles[`g_${locationSliding_currentGroup}`].width * 0.5;
  if (!locationSliding_sliding) {
    updateLocationCSS(locationSliding_groupQuantity, offset, locationSliding_groupStyles[`g_${locationSliding_currentGroup}`].width - tabPadding, locationSliding_currentGroup);
  }
  elementQuerySelector(Field, '.css_location_name').innerHTML = `<span>${integration.LocationName}</span>`;
  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentGroupSeatQuantity = elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var thisGroupElement = generateElementOfGroup();
        elementQuerySelector(Field, `.css_location_groups`).appendChild(thisGroupElement.element);
        var thisTabElement = generateElementOfTab();
        elementQuerySelector(Field, `.css_location_head .css_location_group_tabs_tray`).appendChild(thisTabElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[groupIndex].remove();
        elementQuerySelectorAll(Field, `.css_location_head .css_location_group_tabs_tray .css_location_group_tab`)[groupIndex].remove();
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items .css_item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisItemElement = generateElementOfItem();
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items`).appendChild(thisItemElement.element);
          //ripple.__addToSingleElement(Field.QuerySelector(`.css_location_groups .css_location_group .css_location_group_items[group="${i}"] .item#${thisElement.id} .css_stretch`), 'var(--b-cssvar-333333)', 300);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items .css_item`)[itemIndex].remove();
        }
      }
    }

    var currentGroupPropertySeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`).length;
    var groupPropertyQuantity = groups[groupKey].properties.length;
    if (!(groupPropertyQuantity === currentGroupPropertySeatQuantity)) {
      var capacity = currentGroupPropertySeatQuantity - groupPropertyQuantity;
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          //var propertyIndex = currentGroupPropertySeatQuantity + o;
          var thisPropertyElement = generateElementOfGroupDetailsProperty();
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_details .css_location_group_details_body`).appendChild(thisPropertyElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var propertyIndex = currentGroupPropertySeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_details .css_location_group_details_body .css_location_group_details_property`)[propertyIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var thisTabElement = elementQuerySelectorAll(Field, `.css_location_head .css_location_group_tabs_tray .css_location_group_tab`)[i];
    thisTabElement.innerHTML = `<span>${groups[groupKey].name}</span>`;
    thisTabElement.style.setProperty('--b-cssvar-location-tab-width', `${locationSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-location-tab-index', i);
    var groupPropertyQuantity = groups[groupKey].properties.length;
    for (var k = 0; k < groupPropertyQuantity; k++) {
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

    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_location_groups .css_location_group`)[i], `.css_location_group_items .css_item`)[j];
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
  locationRefreshTimer_currentRequestID = `r_${generateIdentifier()}`;
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
        locationRefreshTimer_timer = setTimeout(function () {
          streamLocation();
        }, locationRefreshTimer_minInterval);
      } else {
        locationRefreshTimer_streamStarted = false;
      }
    });
}

export function openLocation(hash: string): void {
  currentHashSet_hash = hash;
  var Field = documentQuerySelector('.css_location_field');
  Field.setAttribute('displayed', 'true');
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
}

export function closeLocation(): void {
  var Field = documentQuerySelector('.css_location_field');
  Field.setAttribute('displayed', 'false');
  locationRefreshTimer_streaming = false;
}

export function stretchLocationItemBody(itemID: string): void {
  var itemElement = documentQuerySelector(`.css_location_field .css_location_groups .css_location_group .css_location_group_items .css_item#${itemID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
  }
}

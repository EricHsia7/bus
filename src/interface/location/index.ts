import { integrateLocation } from '../../data/apis/index.ts';
import { icons } from '../icons/index.ts';
import { getDataReceivingProgress, setDataReceivingProgress } from '../../data/apis/loader.ts';
import { getSettingOptionValue } from '../../data/settings/index.ts';
import { compareThings, getTextWidth, calculateStandardDeviation, md5 } from '../../tools/index.ts';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector.ts';
import { getUpdateRate } from '../../data/analytics/update-rate.ts';

var previousIntegration: object = {};

var locationSliding = {
  currentGroup: 0,
  targetGroup: 0,
  groupQuantity: 0,
  groupStyles: {},
  scrollLog: [],
  fieldWidth: 0,
  fieldHeight: 0
};

var locationRefreshTimer: object = {
  defaultInterval: 15 * 1000,
  minInterval: 5 * 1000,
  dynamicInterval: 15 * 1000,
  auto: true,
  streaming: false,
  lastUpdate: 0,
  nextUpdate: 0,
  refreshing: false,
  currentRequestID: '',
  streamStarted: false
};

var currentHashSet: object = {
  hash: ''
};

var tabPadding = 20;

export function initializeLocationSliding(): void {
  var element = documentQuerySelector('.location_field .location_groups');
  function monitorScrollLeft(element, callback) {
    locationSliding.scrollLog.push(element.scrollLeft);
    if (locationSliding.scrollLog.length > 10) {
      locationSliding.scrollLog = locationSliding.scrollLog.slice(1);
    }
    if (calculateStandardDeviation(locationSliding.scrollLog) < Math.pow(10, -10)) {
      callback();
    } else {
      window.requestAnimationFrame(function () {
        monitorScrollLeft(element, callback);
      });
    }
  }
  element.addEventListener('touchstart', function (event) {
    locationSliding.currentGroup = Math.round(element.scrollLeft / locationSliding.fieldWidth);
  });
  element.addEventListener('touchend', function (event) {
    monitorScrollLeft(element, function () {
      locationSliding.currentGroup = Math.round(element.scrollLeft / locationSliding.fieldWidth);
    });
  });
  element.addEventListener('scroll', function (event) {
    var slidingGroupIndex = event.target.scrollLeft / locationSliding.fieldWidth;
    if (slidingGroupIndex > locationSliding.currentGroup) {
      locationSliding.targetGroup = locationSliding.currentGroup + 1;
    } else {
      locationSliding.targetGroup = locationSliding.currentGroup - 1;
    }
    var current_size = locationSliding.groupStyles[`g_${locationSliding.currentGroup}`] || { width: 0, offset: 0 };
    var target_size = locationSliding.groupStyles[`g_${locationSliding.targetGroup}`] || { width: 0, offset: 0 };
    var tab_width = current_size.width + (target_size.width - current_size.width) * Math.abs(slidingGroupIndex - locationSliding.currentGroup);
    var offset = (current_size.offset + (target_size.offset - current_size.offset) * Math.abs(slidingGroupIndex - locationSliding.currentGroup)) * -1 + locationSliding.fieldWidth * 0.5 - tab_width * 0.5;
    updateLocationCSS(locationSliding.groupQuantity, offset, tab_width - tabPadding);
  });
}

function queryLocationFieldSize(): object {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function ResizeLocationField(): void {
  const FieldSize = queryLocationFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  documentQuerySelector('#location_field_size').innerHTML = `:root {--b-l-fw:${FieldWidth}px;--b-l-fh:${FieldHeight}px;}`;
}

function updateLocationCSS(groupQuantity: number, offset: number, tab_line_width: number): void {
  documentQuerySelector(`style#location_style`).innerHTML = `:root{--b-location-group-quantity:${groupQuantity};--b-location-tabs-tray-offset:${offset}px;--b-location-tab-line-width:${tab_line_width}}`;
}

function updateUpdateTimer() {
  var time = new Date().getTime();
  var percentage = 0;
  if (locationRefreshTimer.refreshing) {
    percentage = -1 + getDataReceivingProgress(locationRefreshTimer.currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - locationRefreshTimer.lastUpdate) / locationRefreshTimer.dynamicInterval));
  }
  documentQuerySelector('.location_update_timer').style.setProperty('--b-update-timer', percentage);
  window.requestAnimationFrame(function () {
    if (locationRefreshTimer.streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfItem(): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('item');
  element.id = identifier;
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="head"><div class="status"><div class="next_slide" code="0"></div><div class="current_slide" code="0"></div></div><div class="route_direction"></div><div class="route_name"></div><div class="stretch" onclick="bus.location.stretchLocationItemBody('${identifier}')">${icons.expand}</div></div><div class="body"><div class="tabs"><div class="tab" selected="true" onclick="bus.location.switchLocationBodyTab('${identifier}', 0)" code="0">此路線的公車</div></div><div class="buses" displayed="true"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): object {
  var identifier = `g_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('location_group');
  element.innerHTML = `<div class="location_group_details"><div class="location_group_details_body"></div></div><div class="location_group_items"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfTab(): object {
  var identifier = `t_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('location_group_tab');
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroupDetailsProperty(): object {
  var identifier = `p_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.id = identifier;
  element.classList.add('location_group_details_property');
  element.innerHTML = `<div class="location_details_property_icon"></div><div class="location_details_property_value"></div>`;
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
      var nextSlide = elementQuerySelector(thisElement, '.status .next_slide');
      var currentSlide = elementQuerySelector(thisElement, '.status .current_slide');
      nextSlide.setAttribute('code', thisItem.status.code);
      nextSlide.innerText = thisItem.status.text;
      currentSlide.addEventListener(
        'animationend',
        function () {
          currentSlide.setAttribute('code', thisItem.status.code);
          currentSlide.innerText = thisItem.status.text;
          currentSlide.classList.remove('slide_fade_out');
        },
        { once: true }
      );
      currentSlide.classList.add('slide_fade_out');
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.route_name').innerText = thisItem.route_name;
      elementQuerySelector(thisElement, '.route_direction').innerText = thisItem.route_direction;
    }
    function updateBuses(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.buses').innerHTML = thisItem.buses === null ? '<div class="buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="bus" on-this-route="${bus.onThisRoute}"><div class="bus_title"><div class="car_icon">${icons.bus}</div><div class="car_number">${bus.carNumber}</div></div><div class="car_attributes"><div class="car_route">路線：${bus.RouteName}</div><div class="car_status">狀態：${bus.status.text}</div><div class="car_type">類型：${bus.type}</div></div></div>`).join('');
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
    console.log(thisElement, thisProperty, previousProperty);
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.location_details_property_icon').innerHTML = icons[thisProperty.icon];
    }
    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.location_details_property_value').innerHTML = thisProperty.value;
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

  locationSliding.groupQuantity = groupQuantity;
  locationSliding.fieldWidth = FieldWidth;
  locationSliding.fieldHeight = FieldHeight;

  var cumulativeOffset = 0;
  for (var i = 0; i < groupQuantity; i++) {
    var width = getTextWidth(groups[`g_${i}`].name, `500 17px "Noto Sans", sans-serif`) + tabPadding;
    locationSliding.groupStyles[`g_${i}`] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  var offset = locationSliding.groupStyles[`g_${locationSliding.currentGroup}`].offset * -1 + locationSliding.fieldWidth * 0.5 - locationSliding.groupStyles[`g_${locationSliding.currentGroup}`].width * 0.5;
  updateLocationCSS(locationSliding.groupQuantity, offset, locationSliding.groupStyles[`g_${locationSliding.currentGroup}`].width - tabPadding);
  elementQuerySelector(Field, '.location_name').innerHTML = `<span>${integration.LocationName}</span>`;
  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentGroupSeatQuantity = elementQuerySelectorAll(Field, `.location_groups .location_group`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var thisGroupElement = generateElementOfGroup();
        elementQuerySelector(Field, `.location_groups`).appendChild(thisGroupElement.element);
        var thisTabElement = generateElementOfTab();
        elementQuerySelector(Field, `.location_head .location_group_tabs_tray`).appendChild(thisTabElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.location_groups .location_group`)[groupIndex].remove();
        elementQuerySelectorAll(Field, `.location_head .location_group_tabs_tray .location_group_tab`)[groupIndex].remove();
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_items .item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem();
          elementQuerySelector(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_items`).appendChild(thisElement.element);
          //ripple.__addToSingleElement(Field.querySelector(`.location_groups .location_group .location_group_items[group="${i}"] .item#${thisElement.id} .stretch`), 'var(--b-333333)', 300);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_items .item`)[itemIndex].remove();
        }
      }
    }

    var currentGroupPropertySeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_details .location_group_details_body .location_group_details_property`).length;
    var groupPropertyQuantity = groups[groupKey].properties.length;
    if (!(groupPropertyQuantity === currentGroupPropertySeatQuantity)) {
      var capacity = currentGroupPropertySeatQuantity - groupPropertyQuantity;
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var propertyIndex = currentGroupPropertySeatQuantity + o;
          var thisElement = generateElementOfGroupDetailsProperty();
          elementQuerySelector(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_details .location_group_details_body`).appendChild(thisElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var propertyIndex = currentGroupPropertySeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_details .location_group_details_body .location_group_details_property`)[propertyIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var thisTabElement = elementQuerySelectorAll(Field, `.location_head .location_group_tabs_tray .location_group_tab`)[i];
    thisTabElement.innerHTML = `<span>${groups[groupKey].name}</span>`;
    thisTabElement.style.setProperty('--b-location-tab-width', `${locationSliding.groupStyles[groupKey].width}px`);
    var groupPropertyQuantity = groups[groupKey].properties.length;
    for (var k = 0; k < groupPropertyQuantity; k++) {
      var thisProperty = groups[groupKey].properties[k];
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_details .location_group_details_body .location_group_details_property`)[k];
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
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.location_groups .location_group`)[i], `.location_group_items .item`)[j];
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

async function refreshLocation(): object {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  locationRefreshTimer.auto = refresh_interval_setting.auto;
  locationRefreshTimer.defaultInterval = refresh_interval_setting.defaultInterval;
  locationRefreshTimer.refreshing = true;
  locationRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  documentQuerySelector('.location_update_timer').setAttribute('refreshing', true);
  var integration = await integrateLocation(currentHashSet.hash, locationRefreshTimer.currentRequestID);
  var Field = documentQuerySelector('.location_field');
  updateLocationField(Field, integration, false);
  locationRefreshTimer.lastUpdate = new Date().getTime();
  if (locationRefreshTimer.auto) {
    var updateRate = await getUpdateRate();
    locationRefreshTimer.nextUpdate = Math.max(new Date().getTime() + locationRefreshTimer.minInterval, integration.dataUpdateTime + locationRefreshTimer.defaultInterval / updateRate);
  } else {
    locationRefreshTimer.nextUpdate = new Date().getTime() + locationRefreshTimer.defaultInterval;
  }
  locationRefreshTimer.dynamicInterval = Math.max(locationRefreshTimer.minInterval, locationRefreshTimer.nextUpdate - new Date().getTime());
  locationRefreshTimer.refreshing = false;
  documentQuerySelector('.location_update_timer').setAttribute('refreshing', false);
  return { status: 'Successfully refreshed the location.' };
}

export function streamLocation(): void {
  refreshLocation()
    .then((result) => {
      if (locationRefreshTimer.streaming) {
        locationRefreshTimer.timer = setTimeout(function () {
          streamLocation();
        }, Math.max(locationRefreshTimer.minInterval, locationRefreshTimer.nextUpdate - new Date().getTime()));
      } else {
        locationRefreshTimer.streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (locationRefreshTimer.streaming) {
        locationRefreshTimer.timer = setTimeout(function () {
          streamLocation();
        }, locationRefreshTimer.minInterval);
      } else {
        locationRefreshTimer.streamStarted = false;
      }
    });
}

export function openLocation(hash: string): void {
  currentHashSet.hash = hash;
  var Field = documentQuerySelector('.location_field');
  Field.setAttribute('displayed', 'true');
  setUpLocationFieldSkeletonScreen(Field);
  if (!locationRefreshTimer.streaming) {
    locationRefreshTimer.streaming = true;
    if (!locationRefreshTimer.streamStarted) {
      locationRefreshTimer.streamStarted = true;
      streamLocation();
    } else {
      refreshLocation();
    }
    updateUpdateTimer();
  }
}

export function closeLocation(): void {
  var Field = documentQuerySelector('.location_field');
  Field.setAttribute('displayed', 'false');
  locationRefreshTimer.streaming = false;
}

export function stretchLocationItemBody(itemID: string): void {
  var itemElement = documentQuerySelector(`.location_field .location_groups .location_group .location_group_items .item#${itemID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
  }
}

import { integrateLocation } from '../../data/apis/index.ts';
import { compareThings, getTextWidth, calculateStandardDeviation, md5 } from '../../tools/index.ts';
import { getSettingOptionValue } from '../../data/settings/index.ts';

var previousIntegration: object = {};

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

var locationSliding = {
  currentGroup: 0,
  targetGroup: 0,
  groupQuantity: 0,
  groupStyles: {},
  scrollLog: [],
  fieldWidth: 0,
  fieldHeight: 0
};

function queryLocationFieldSize(): object {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function ResizeRouteField(): void {
  var Field = document.querySelector('.route_field');
  const FieldSize = queryRouteFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  document.querySelector('#field_size').innerHTML = `:root {--b-fw:${FieldWidth}px;--b-fh:${FieldHeight}px;}`;
}

function updateLocationCSS(percentage: number, width: number): void {
  document.querySelector(`style#location_style`).innerHTML = `:root{--b-location-tabs-percentage:${percentage};--b-location-tabs-width:${width}px;}`;
}

function initializeLocationSliding(): void {
  var element = document.querySelector('.location_field .location_groups');
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
    var current_size = locationSliding.groupStyles[`g_${locationSliding.currentGroup}`] || { width: 0 };
    var target_size = locationSliding.groupStyles[`g_${locationSliding.targetGroup}`] || { width: 0 };
    var tab_width = current_size.width + (target_size.width - current_size.width) * Math.abs(slidingGroupIndex - locationSliding.currentGroup);
    updateLocationCSS(slidingGroupIndex, tab_width);
  });
}

function setUpLocationFieldSkeletonScreen(Field: HTMLElement): void {
  const FieldSize = queryLocationFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultItemQuantity = { g_0: Math.floor(FieldHeight / 50) + 5, g_1: Math.floor(FieldHeight / 50) + 5 };
  var defaultGroupQuantity = 2;
  var groupedItems = {};
  for (var i = 0; i < defaultGroupQuantity; i++) {
    var groupKey = `g_${i}`;
    groupedItems[groupKey] = [];
    for (var j = 0; j < defaultItemQuantity[groupKey]; j++) {
      groupedItems[groupKey].push({
        name: '',
        status: { code: -1, text: '' },
        buses: null,
        overlappingRoutes: null,
        sequence: j,
        location: {
          latitude: null,
          longitude: null
        },
        segmentBuffer: {
          endpoint: false,
          type: null
        },
        id: null
      });
    }
  }
  updateLocationField(
    Field,
    {
      groupedItems: groupedItems,
      groupQuantity: defaultGroupQuantity,
      itemQuantity: defaultItemQuantity,
      RouteName: '載入中',
      RouteEndPoints: {
        RouteDeparture: '載入中',
        RouteDestination: '載入中'
      },
      RouteID: null,
      PathAttributeId: []
    },
    true
  );
}

function updateLocationField(Field: HTMLElement, integration: object, skeletonScreen: boolean): void {
  function updateItem(thisElement: HTMLElement, thisItem: object, previousItem: object): void {
    function updateStatus(thisElement: HTMLElement, thisItem: object): void {
      var nextSlide = thisElement.querySelector('.status .next_slide');
      var currentSlide = thisElement.querySelector('.status .current_slide');
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
      thisElement.querySelector('.name').innerText = thisItem.name;
    }
    function updateBuses(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.buses').innerHTML = thisItem.buses === null ? '<div class="buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="bus" on-this-route="${bus.onThisRoute}"><div class="bus_title"><div class="car_icon">${icons.bus}</div><div class="car_number">${bus.carNumber}</div></div><div class="car_attributes"><div class="car_route">路線：${bus.RouteName}</div><div class="car_status">狀態：${bus.status.text}</div><div class="car_type">類型：${bus.type}</div></div></div>`).join('');
    }
    if (previousItem === null) {
      updateStatus(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateBuses(thisElement, thisItem);
    } else {
      if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
        updateStatus(thisElement, thisItem);
      }
      if (!compareThings(previousItem.name, thisItem.name)) {
        updateName(thisElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisElement, thisItem);
      }
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

  routeSliding.groupQuantity = groupQuantity;
  routeSliding.fieldWidth = FieldWidth;
  routeSliding.fieldHeight = FieldHeight;

  for (var i = 0; i < groupQuantity; i++) {
    routeSliding.groupStyles[`g_${i}`] = {
      width: getTextWidth([integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `往${e}`)[i], `500 17px "Noto Sans", sans-serif`)
    };
  }

  updateRouteCSS(routeSliding.groupQuantity, routeSliding.currentGroup, routeSliding.groupStyles[`g_${routeSliding.currentGroup}`].width);
  Field.querySelector('.location_name').innerHTML = `<span>${integration.LocationName}</span>`;
  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentGroupSeatQuantity = Field.querySelectorAll(`.location_groups .location_grouped_items`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity + o;
        var thisElement = document.createElement('div');
        thisElement.classList.add('route_grouped_items');
        thisElement.setAttribute('group', currentGroupSeatQuantity + o);
        var tabElement = document.createElement('div');
        tabElement.classList.add('route_group_tab');
        Field.querySelector(`.route_groups`).appendChild(thisElement);
        Field.querySelector(`.route_head .route_group_tabs`).appendChild(tabElement);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity - 1 - o;
        Field.querySelectorAll(`.route_groups .route_grouped_items`)[groupIndex].remove();
        Field.querySelectorAll(`.route_head .route_group_tabs .route_group_tab`)[groupIndex].remove();
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = Field.querySelectorAll(`.route_groups .route_grouped_items[group="${i}"] .item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem({}, true);
          Field.querySelector(`.route_groups .route_grouped_items[group="${i}"]`).appendChild(thisElement.element);
          //ripple.__addToSingleElement(Field.querySelector(`.route_groups .route_grouped_items[group="${i}"] .item#${thisElement.id} .stretch`), 'var(--b-333333)', 300);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          Field.querySelectorAll(`.route_groups .route_grouped_items[group="${i}"] .item`)[itemIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var thisTabElement = Field.querySelectorAll(`.route_head .route_group_tabs .route_group_tab`)[i];
    thisTabElement.innerHTML = [integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisElement = Field.querySelectorAll(`.route_groups .route_grouped_items[group="${i}"] .item`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
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
  //document.querySelector('.update_timer').setAttribute('refreshing', true);

  var integration = await integrateLocation(currentHashSet.hash, locationRefreshTimer.currentRequestID);
  var Field = document.querySelector('.location_field');
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
  //document.querySelector('.update_timer').setAttribute('refreshing', false);
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
  var Field = document.querySelector('.location_field');
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
    //updateUpdateTimer();
  }
}

export function closeLocation() {
  var Field = document.querySelector('.location_field');
  Field.setAttribute('displayed', 'false');
  locationRefreshTimer.streaming = false;
}

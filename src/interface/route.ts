import { integrateRoute } from '../data/apis/index.ts';
import { icons } from './icons/index.ts';
import { searchRouteByName } from '../data/search/searchRoute.ts';
import { getDataReceivingProgress, setDataReceivingProgress } from '../data/apis/loader.ts';
import { compareThings, getTextWidth, calculateStandardDeviation } from '../tools/index.ts';
import { formatEstimateTime } from '../tools/format-time.ts';
import { getUpdateRate } from '../data/analytics/update-rate.ts';
import { saveStop, isSaved } from '../data/folder/index.ts';

var md5 = require('md5');

var previousFormattedRoute = {};

var routeSliding = {
  currentGroup: 0,
  targetGroup: 0,
  groupQuantity: 0,
  groupStyles: {},
  scrollLog: [],
  fieldWidth: 0,
  fieldHeight: 0
};

var routeRefreshTimer = {
  defaultInterval: 15 * 1000,
  minInterval: 5 * 1000,
  dynamicInterval: 15 * 1000,
  streaming: false,
  lastUpdate: 0,
  nextUpdate: 0,
  refreshing: false,
  currentRequestID: '',
  streamStarted: false
};

var currentRouteIDSet = {
  RouteID: 0,
  PathAttributeId: []
};

export function initializeRouteSliding() {
  var element = document.querySelector('.route_groups');
  function monitorScrollLeft(element: HTMLElement, callback: Function): void {
    routeSliding.scrollLog.push(element.scrollLeft);
    if (routeSliding.scrollLog.length > 10) {
      routeSliding.scrollLog = routeSliding.scrollLog.slice(1);
    }
    if (calculateStandardDeviation(routeSliding.scrollLog) < Math.pow(10, -10)) {
      callback();
    } else {
      window.requestAnimationFrame(function () {
        monitorScrollLeft(element, callback);
      });
    }
  }

  element.addEventListener('touchstart', function (event) {
    routeSliding.currentGroup = Math.round(element.scrollLeft / routeSliding.fieldWidth);
  });
  element.addEventListener('touchend', function (event) {
    monitorScrollLeft(element, function () {
      routeSliding.currentGroup = Math.round(element.scrollLeft / routeSliding.fieldWidth);
    });
  });
  element.addEventListener('scroll', function (event) {
    var slidingGroupIndex = event.target.scrollLeft / routeSliding.fieldWidth;
    if (slidingGroupIndex > routeSliding.currentGroup) {
      routeSliding.targetGroup = routeSliding.currentGroup + 1;
    } else {
      routeSliding.targetGroup = routeSliding.currentGroup - 1;
    }
    var current_size = routeSliding.groupStyles[`g_${routeSliding.currentGroup}`] || { width: 0 };
    var target_size = routeSliding.groupStyles[`g_${routeSliding.targetGroup}`] || { width: 0 };
    var line_width = current_size.width + (target_size.width - current_size.width) * Math.abs(slidingGroupIndex - routeSliding.currentGroup);
    updateRouteCSS(routeSliding.groupQuantity, slidingGroupIndex, line_width);
  });
}

function queryRouteFieldSize(): object {
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

function updateRouteCSS(groupQuantity: number, percentage: number, width: number): void {
  document.querySelector(`style#route_style`).innerHTML = `:root{--b-route-group-quantity:${groupQuantity};--b-route-tab-percentage:${percentage};--b-route-tab-width:${width};}`;
}

function updateUpdateTimer() {
  var time = new Date().getTime();
  var percentage = 0;
  if (routeRefreshTimer.refreshing) {
    percentage = -1 + getDataReceivingProgress(routeRefreshTimer.currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - routeRefreshTimer.lastUpdate) / routeRefreshTimer.dynamicInterval));
  }
  document.querySelector('.update_timer').style.setProperty('--b-update-timer', percentage);
  window.requestAnimationFrame(function () {
    if (routeRefreshTimer.streaming) {
      updateUpdateTimer();
    }
  });
}

export async function formatRoute(RouteID: number, PathAttributeId: [number], requestID: string) {
  function formatBusEvent(buses: []): [] | null {
    if (buses.length === 0) {
      return null;
    }
    var result = [];
    function formatBus(object: object): object {
      var result = {};
      var CarType = parseInt(object.CarType);
      if (CarType === 0) {
        result.type = '一般';
      }
      if (CarType === 1) {
        result.type = '低底盤';
      }
      if (CarType === 2) {
        result.type = '大復康巴士';
      }
      if (CarType === 3) {
        result.type = '狗狗友善專車';
      }
      var CarOnStop = parseInt(object.CarOnStop);
      var onStop = '';
      if (CarOnStop === 0) {
        onStop = '離站';
      }
      if (CarOnStop === 1) {
        onStop = '進站';
      }
      var BusStatus = parseInt(object.BusStatus);
      var situation = '';
      if (BusStatus === 0) {
        situation = '正常';
      }
      if (BusStatus === 1) {
        situation = '車禍';
      }
      if (BusStatus === 2) {
        situation = '故障';
      }
      if (BusStatus === 3) {
        situation = '塞車';
      }
      if (BusStatus === 4) {
        situation = '緊急求援';
      }
      if (BusStatus === 5) {
        situation = '加油';
      }
      if (BusStatus === 99) {
        situation = '非營運狀態';
      }
      result.carNumber = object.BusID;
      result.status = {
        onStop: onStop,
        situation: situation,
        text: `${onStop} | ${situation}`
      };
      result.RouteName = object.RouteName;
      result.onThisRoute = object.onThisRoute;
      return result;
    }
    for (var bus of buses) {
      result.push(formatBus(bus));
    }
    return result;
  }
  function formatOverlappingRoutes(array: []): [] {
    if (array.length === 0) {
      return null;
    }
    var result = [];
    for (var route of array) {
      var formattedItem = {
        name: route.n,
        RouteEndPoints: {
          RouteDeparture: route.dep,
          RouteDestination: route.des,
          text: `${route.dep} \u21CC ${route.des}`, //u21CC -> '⇌'
          html: `<span>${route.dep}</span><span>\u21CC</span><span>${route.des}</span>`
        },
        RouteID: route.id,
        PathAttributeId: route.pid ? route.pid : []
      };
      result.push(formattedItem);
    }
    return result;
  }
  var integration = await integrateRoute(RouteID, PathAttributeId, requestID);
  var groupedItems = {};
  for (var item of integration.items) {
    var formattedItem = {};
    formattedItem.name = item.hasOwnProperty('_Stop') ? item._Stop.nameZh : null;
    formattedItem.status = formatEstimateTime(item.EstimateTime, 3);
    formattedItem.buses = item.hasOwnProperty('_BusEvent') ? formatBusEvent(item._BusEvent) : null;
    formattedItem.overlappingRoutes = item.hasOwnProperty('_overlappingRoutes') ? formatOverlappingRoutes(item._overlappingRoutes) : null;
    formattedItem.sequence = item.hasOwnProperty('_Stop') ? item._Stop.seqNo : -1;
    formattedItem.location = {
      latitude: item.hasOwnProperty('_Stop') ? item._Stop.la : null,
      longitude: item.hasOwnProperty('_Stop') ? item._Stop.lo : null
    };
    formattedItem.segmentBuffer = item._segmentBuffer;
    formattedItem.id = item.StopID || null;
    var group = item.hasOwnProperty('_Stop') ? `g_${item._Stop.goBack}` : 'g_0';
    if (!groupedItems.hasOwnProperty(group)) {
      groupedItems[group] = [];
    }
    groupedItems[group].push(formattedItem);
  }
  var groupQuantity = 0;
  var itemQuantity = {};
  for (var group in groupedItems) {
    if (!itemQuantity.hasOwnProperty(group)) {
      itemQuantity[group] = groupedItems[group].length;
    }
    groupQuantity += 1;
  }
  var RouteName = integration.RouteName;
  var RouteEndPoints = integration.RouteEndPoints;
  var dataUpdateTime = integration.dataUpdateTime;
  return {
    groupedItems,
    groupQuantity,
    itemQuantity,
    RouteName,
    RouteEndPoints,
    dataUpdateTime,
    RouteID,
    PathAttributeId
  };
}

function generateElementOfItem(item: object, skeletonScreen: boolean): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('item');
  element.id = identifier;
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="head"><div class="status"><div class="next_slide" code="${skeletonScreen ? -1 : item.status.code}">${skeletonScreen ? '' : item.status.text}</div><div class="current_slide" code="${skeletonScreen ? -1 : item.status.code}">${skeletonScreen ? '' : item.status.text}</div></div><div class="name">${skeletonScreen ? '' : item.name}</div><div class="stretch" onclick="bus.route.stretchItemBody('${identifier}')">${icons.expand}</div></div><div class="body"><div class="tabs"><div class="tab" selected="true" onclick="bus.route.switchRouteBodyTab('${identifier}', 0)" code="0">經過此站的公車</div><div class="tab" selected="false" onclick="bus.route.switchRouteBodyTab('${identifier}', 1)" code="1">經過此站的路線</div><div class="action_button" highlighted="false" type="save-stop" onclick="bus.route.saveItemAsStop('${identifier}', null, null, null)"><div class="action_button_icon">${icons['favorite']}</div>收藏此站牌</div></div><div class="buses" displayed="true"></div><div class="overlapping_routes" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function setUpRouteFieldSkeletonScreen(Field: HTMLElement) {
  const FieldSize = queryRouteFieldSize();
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
  updateRouteField(
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

export function updateRouteField(Field: HTMLElement, formattedRoute: object, skeletonScreen: boolean) {
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
    function updateSegmentBuffer(thisElement: HTMLElement, thisItem: object): void {
      thisElement.setAttribute('segment-buffer', thisItem.segmentBuffer);
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.name').innerText = thisItem.name;
    }
    function updateBuses(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.buses').innerHTML = thisItem.buses === null ? '<div class="buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="bus" on-this-route="${bus.onThisRoute}"><div class="bus_title"><div class="car_icon">${icons.bus}</div><div class="car_number">${bus.carNumber}</div></div><div class="car_attributes"><div class="car_route">路線：${bus.RouteName}</div><div class="car_status">狀態：${bus.status.text}</div><div class="car_type">類型：${bus.type}</div></div></div>`).join('');
    }
    function updateOverlappingRoutes(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.overlapping_routes').innerHTML = thisItem.overlappingRoutes === null ? '<div class="overlapping_route_message">目前沒有路線可顯示</div>' : thisItem.overlappingRoutes.map((route) => `<div class="overlapping_route"><div class="overlapping_route_title"><div class="overlapping_route_icon">${icons.route}</div><div class="overlapping_route_name">${route.name}</div></div><div class="overlapping_route_endpoints">${route.RouteEndPoints.html}</div><div class="overlapping_route_actions"><div class="overlapping_route_action_button" onclick="bus.route.switchRoute(${route.RouteID}, [${route.PathAttributeId.join(',')}])">查看路線</div><div class="overlapping_route_action_button">收藏路線</div></div></div>`).join('');
    }
    function updateStretch(thisElement: HTMLElement, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        thisElement.setAttribute('stretched', false);
      }
    }
    function updateSaveStopActionButton(thisElement: HTMLElement, thisItem: object, formattedItem: object): void {
      thisElement.querySelector('.body .tabs .action_button').setAttribute('onclick', `bus.route.saveItemAsStop('${thisElement.id}', 'saved_stop', ${thisItem.id}, ${formattedRoute.RouteID})`);
      isSaved('stop', thisItem.id).then((e) => {
        thisElement.querySelector('.body .tabs .action_button').setAttribute('highlighted', e);
      });
    }

    if (previousItem === null) {
      updateStatus(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateBuses(thisElement, thisItem);
      updateOverlappingRoutes(thisElement, thisItem);
      updateSegmentBuffer(thisElement, thisItem);
      updateStretch(thisElement, skeletonScreen);
      updateSaveStopActionButton(thisElement, thisItem, formattedRoute);
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
      if (!compareThings(previousItem.overlappingRoutes, thisItem.overlappingRoutes)) {
        updateOverlappingRoutes(thisElement, thisItem);
      }
      if (!(previousItem.segmentBuffer === thisItem.segmentBuffer)) {
        updateSegmentBuffer(thisElement, thisItem);
      }
      if (!(previousItem.id === thisItem.id)) {
        updateSaveStopActionButton(thisElement, thisItem, formattedRoute);
      }
      updateStretch(thisElement, skeletonScreen);
    }
  }
  const FieldSize = queryRouteFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousFormattedRoute === {}) {
    previousFormattedRoute = formattedRoute;
  }

  var groupQuantity = formattedRoute.groupQuantity;
  var itemQuantity = formattedRoute.itemQuantity;
  var groupedItems = formattedRoute.groupedItems;

  routeSliding.groupQuantity = groupQuantity;
  routeSliding.fieldWidth = FieldWidth;
  routeSliding.fieldHeight = FieldHeight;

  for (var i = 0; i < groupQuantity; i++) {
    routeSliding.groupStyles[`g_${i}`] = {
      width: getTextWidth([formattedRoute.RouteEndPoints.RouteDestination, formattedRoute.RouteEndPoints.RouteDeparture, ''].map((e) => `往${e}`)[i], `500 17px "Noto Sans", sans-serif`)
    };
  }

  updateRouteCSS(routeSliding.groupQuantity, routeSliding.currentGroup, routeSliding.groupStyles[`g_${routeSliding.currentGroup}`].width);
  Field.querySelector('.route_name').innerHTML = `<span>${formattedRoute.RouteName}</span>`;
  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentGroupSeatQuantity = Field.querySelectorAll(`.route_field .route_grouped_items`).length;
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
    thisTabElement.innerHTML = [formattedRoute.RouteEndPoints.RouteDestination, formattedRoute.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisElement = Field.querySelectorAll(`.route_groups .route_grouped_items[group="${i}"] .item`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      var thisItem = groupedItems[groupKey][j];
      if (previousFormattedRoute.hasOwnProperty('groupedItems')) {
        if (previousFormattedRoute.groupedItems.hasOwnProperty(groupKey)) {
          if (previousFormattedRoute.groupedItems[groupKey][j]) {
            var previousItem = previousFormattedRoute.groupedItems[groupKey][j];
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
  previousFormattedRoute = formattedRoute;
}

async function refreshRoute(): object {
  routeRefreshTimer.refreshing = true;
  routeRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  document.querySelector('.update_timer').setAttribute('refreshing', true);
  var formattedRoute = await formatRoute(currentRouteIDSet.RouteID, currentRouteIDSet.PathAttributeId, routeRefreshTimer.currentRequestID);
  var Field = document.querySelector('.route_field');
  updateRouteField(Field, formattedRoute, false);
  routeRefreshTimer.lastUpdate = new Date().getTime();
  var updateRate = await getUpdateRate();
  routeRefreshTimer.nextUpdate = Math.max(new Date().getTime() + routeRefreshTimer.minInterval, formattedRoute.dataUpdateTime + routeRefreshTimer.defaultInterval / updateRate);
  routeRefreshTimer.dynamicInterval = Math.max(routeRefreshTimer.minInterval, routeRefreshTimer.nextUpdate - new Date().getTime());
  routeRefreshTimer.refreshing = false;
  document.querySelector('.update_timer').setAttribute('refreshing', false);
  return { status: 'Successfully refreshed the route.' };
}

export function streamRoute(): void {
  refreshRoute()
    .then((result) => {
      if (routeRefreshTimer.streaming) {
        routeRefreshTimer.timer = setTimeout(function () {
          streamRoute();
        }, Math.max(routeRefreshTimer.minInterval, routeRefreshTimer.nextUpdate - new Date().getTime()));
      } else {
        routeRefreshTimer.streamStarted = false;
      }
    })
    .catch((err) => {
      console.log(err);
      if (routeRefreshTimer.streaming) {
        routeRefreshTimer.timer = setTimeout(function () {
          streamRoute();
        }, routeRefreshTimer.minInterval);
      } else {
        routeRefreshTimer.streamStarted = false;
      }
    });
}

export function openRoute(RouteID: number, PathAttributeId: [number]) {
  currentRouteIDSet.RouteID = RouteID;
  currentRouteIDSet.PathAttributeId = PathAttributeId;
  var Field = document.querySelector('.route_field');
  Field.setAttribute('displayed', 'true');
  setUpRouteFieldSkeletonScreen(Field);
  if (!routeRefreshTimer.streaming) {
    routeRefreshTimer.streaming = true;
    if (!routeRefreshTimer.streamStarted) {
      routeRefreshTimer.streamStarted = true;
      streamRoute();
    } else {
      refreshRoute();
    }
    updateUpdateTimer();
  }
}

export function closeRoute() {
  var Field = document.querySelector('.route_field');
  Field.setAttribute('displayed', 'false');
  routeRefreshTimer.streaming = false;
}

export function switchRoute(RouteID: number, PathAttributeId: [number]) {
  routeRefreshTimer.streaming = false;
  openRoute(RouteID, PathAttributeId);
}

export function openRouteByURLScheme() {
  var current_url = new URL(location.href);
  if (current_url.searchParams.get('open_route_by_name') === 'true') {
    searchRouteByName(current_url.searchParams.get('route_name')).then((e) => {
      openRoute(e[0].id, e[0].pid);
    });
  }
}

export function stretchItemBody(itemID: string): void {
  var itemElement = document.querySelector(`.route_field .route_groups .item#${itemID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
  }
}

export function switchRouteBodyTab(itemID: string, tabCode: number): void {
  var itemElement = document.querySelector(`.route_field .route_groups .item#${itemID}`);
  var tabs = itemElement.querySelector('.tabs');
  var tab = tabs.querySelectorAll('.tab[selected="true"]');
  for (var t of tab) {
    t.setAttribute('selected', 'false');
  }
  tabs.querySelector(`.tab[code="${tabCode}"]`).setAttribute('selected', 'true');
  if (tabCode === 0) {
    itemElement.querySelector('.buses').setAttribute('displayed', 'true');
    itemElement.querySelector('.overlapping_routes').setAttribute('displayed', 'flase');
  }
  if (tabCode === 1) {
    itemElement.querySelector('.buses').setAttribute('displayed', 'false');
    itemElement.querySelector('.overlapping_routes').setAttribute('displayed', 'true');
  }
}

export function saveItemAsStop(itemID: string, folderId: string, StopID: number, RouteID: number) {
  var itemElement = document.querySelector(`.route_field .route_groups .item#${itemID}`);
  var actionButtonElement = itemElement.querySelector('.action_button[type="save-stop"]');
  saveStop(folderId, StopID, RouteID).then((e) => {
    isSaved('stop', StopID).then((k) => {
      actionButtonElement.setAttribute('highlighted', k);
    });
  });
}

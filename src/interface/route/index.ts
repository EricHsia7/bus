import { integrateRoute } from '../../data/apis/index.ts';
import { icons } from '../icons/index.ts';
import { getDataReceivingProgress, setDataReceivingProgress } from '../../data/apis/loader.ts';
import { getSettingOptionValue } from '../../data/settings/index.ts';
import { compareThings, getTextWidth, calculateStandardDeviation, md5 } from '../../tools/index.ts';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector.ts';
import { getUpdateRate } from '../../data/analytics/update-rate.ts';
import { saveStop, isSaved } from '../../data/folder/index.ts';
import { prompt_message } from '../prompt/index.ts';
import { GeneratedElement, FieldSize } from '../index.ts';

//const ripple = require('@erichsia7/ripple');

var previousIntegration: object = {};

var routeSliding: object = {
  currentGroup: 0,
  targetGroup: 0,
  groupQuantity: 0,
  groupStyles: {},
  scrollLog: [],
  fieldWidth: 0,
  fieldHeight: 0,
  sliding: false,
  lineHeight: 2,
  lineColor: '#333'
};

var routeRefreshTimer: object = {
  baseInterval: 15 * 1000,
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

var currentRouteIDSet = {
  RouteID: 0,
  PathAttributeId: []
};

export function initializeRouteSliding(): void {
  var element = documentQuerySelector('.css_route_groups');
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
    routeSliding.sliding = true;
  });
  element.addEventListener('touchend', function (event) {
    monitorScrollLeft(element, function () {
      routeSliding.currentGroup = Math.round(element.scrollLeft / routeSliding.fieldWidth);
      routeSliding.sliding = false;
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
    updateRouteCanvas(routeSliding.groupQuantity, slidingGroupIndex, line_width);
  });
  var mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQueryList.addListener(updateRouteLineColor);
  updateRouteLineColor(mediaQueryList);
}

function queryRouteFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function ResizeRouteField(): void {
  const FieldSize = queryRouteFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  documentQuerySelector('#route_field_size').innerHTML = `:root {--b-cssvar-r-fw:${FieldWidth}px;--b-cssvar-r-fh:${FieldHeight}px;}`;
}

function updateRouteCSS(groupQuantity: number, percentage: number, width: number): void {
  documentQuerySelector(`style#route_style`).innerHTML = `:root{--b-cssvar-route-group-quantity:${groupQuantity};--b-cssvar-route-tab-percentage:${percentage};--b-cssvar-route-tab-width:${width};}`;
}

export function ResizeRouteCanvas() {
  const FieldSize = queryRouteFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  const canvasScale = Math.log10(window.devicePixelRatio) / 0.15904041824;
  //Math.log(Math.pow(3, 1 / 3) ≈ 0.15904041824

  const canvas: HTMLCanvasElement = documentQuerySelector('.css_route_field .css_route_head .css_route_group_tab_line_track .css_route_group_tab_line');
  canvas.width = FieldWidth * canvasScale;
  canvas.height = routeSliding.lineHeight * canvasScale;
  routeSliding.fieldWidth = FieldWidth;
  routeSliding.fieldHeight = FieldHeight;
  routeSliding.canvasScale = canvasScale;
}

function updateRouteCanvas(groupQuantity: number, percentage: number, width: number): void {
  var canvas: HTMLCanvasElement = documentQuerySelector('.css_route_field .css_route_head .css_route_group_tab_line_track .css_route_group_tab_line');
  var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  ctx.fillStyle = routeSliding.lineColor;
  window.requestAnimationFrame(function () {
    ctx.clearRect(0, 0, routeSliding.fieldWidth * routeSliding.canvasScale, routeSliding.lineHeight * routeSliding.canvasScale);
    ctx.fillRect(((routeSliding.fieldWidth / groupQuantity) * percentage + (routeSliding.fieldWidth / groupQuantity - width) / 2) * routeSliding.canvasScale, 0, width * routeSliding.canvasScale, routeSliding.lineHeight * routeSliding.canvasScale);
  });
}

function updateRouteLineColor(e): void {
  if (e.matches) {
    routeSliding.lineColor = '#f9f9fb';
  } else {
    routeSliding.lineColor = '#333';
  }
  if (!routeSliding.sliding) {
    updateRouteCanvas(routeSliding.groupQuantity, routeSliding.currentGroup, routeSliding.groupStyles[`g_${routeSliding.currentGroup}`]?.width || 1);
  }
}

function updateUpdateTimer() {
  var time = new Date().getTime();
  var percentage = 0;
  if (routeRefreshTimer.refreshing) {
    percentage = -1 + getDataReceivingProgress(routeRefreshTimer.currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - routeRefreshTimer.lastUpdate) / routeRefreshTimer.dynamicInterval));
  }
  documentQuerySelector('.css_route_update_timer').style.setProperty('--b-cssvar-update-timer', percentage);
  window.requestAnimationFrame(function () {
    if (routeRefreshTimer.streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfItem(): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_item');
  element.id = identifier;
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="css_head"><div class="css_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_name"></div><div class="css_stretch" onclick="bus.route.stretchRouteItemBody('${identifier}')">${icons.expand}</div></div><div class="css_body"><div class="css_tabs"><div class="css_tab" selected="true" onclick="bus.route.switchRouteBodyTab('${identifier}', 0)" code="0">經過此站的公車</div><div class="css_tab" selected="false" onclick="bus.route.switchRouteBodyTab('${identifier}', 1)" code="1">經過此站的路線</div><div class="css_action_button" highlighted="false" type="save-stop" onclick="bus.route.saveItemAsStop('${identifier}', null, null, null)"><div class="css_action_button_icon">${icons.favorite}</div>收藏此站牌</div></div><div class="css_buses" displayed="true"></div><div class="css_overlapping_routes" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  var identifier = `g_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_route_group');
  element.id = identifier;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfTab(): GeneratedElement {
  var identifier = `t_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_route_group_tab');
  element.id = identifier;
  return {
    element: element,
    id: identifier
  };
}

function setUpRouteFieldSkeletonScreen(Field: HTMLElement): void {
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
        nearest: false,
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

function updateRouteField(Field: HTMLElement, integration: object, skeletonScreen: boolean) {
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
    function updateSegmentBuffer(thisElement: HTMLElement, thisItem: object): void {
      thisElement.setAttribute('segment-buffer', thisItem.segmentBuffer);
    }
    function updateName(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_name').innerText = thisItem.name;
    }
    function updateBuses(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_buses').innerHTML = thisItem.buses === null ? '<div class="css_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_bus" on-this-route="${bus.onThisRoute}"><div class="css_bus_title"><div class="css_car_icon">${icons.bus}</div><div class="css_car_number">${bus.carNumber}</div></div><div class="css_car_attributes"><div class="css_car_route">路線：${bus.RouteName}</div><div class="css_car_status">狀態：${bus.status.text}</div><div class="css_car_type">類型：${bus.type}</div></div></div>`).join('');
    }
    function updateOverlappingRoutes(thisElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisElement, '.css_overlapping_routes').innerHTML = thisItem.overlappingRoutes === null ? '<div class="css_overlapping_route_message">目前沒有路線可顯示</div>' : thisItem.overlappingRoutes.map((route) => `<div class="css_overlapping_route"><div class="css_overlapping_route_title"><div class="css_overlapping_route_icon">${icons.route}</div><div class="css_overlapping_route_name">${route.name}</div></div><div class="css_overlapping_route_endpoints">${route.RouteEndPoints.html}</div><div class="css_overlapping_route_actions"><div class="css_overlapping_route_action_button" onclick="bus.route.switchRoute(${route.RouteID}, [${route.PathAttributeId.join(',')}])">查看路線</div><div class="css_overlapping_route_action_button">收藏路線</div></div></div>`).join('');
    }
    function updateNearest(thisElement: HTMLElement, thisItem: object): void {
      thisElement.setAttribute('nearest', thisItem.nearest);
    }
    function updateStretch(thisElement: HTMLElement, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        thisElement.setAttribute('stretched', false);
      }
    }
    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
    }
    function updateSaveStopActionButton(thisElement: HTMLElement, thisItem: object, formattedItem: object): void {
      elementQuerySelector(thisElement, '.css_body .css_tabs .css_action_button').setAttribute('onclick', `bus.route.saveItemAsStop('${thisElement.id}', 'saved_stop', ${thisItem.id}, ${integration.RouteID})`);
      isSaved('stop', thisItem.id).then((e) => {
        elementQuerySelector(thisElement, '.css_body .css_tabs .css_action_button').setAttribute('highlighted', e);
      });
    }

    if (previousItem === null) {
      updateStatus(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateBuses(thisElement, thisItem);
      updateOverlappingRoutes(thisElement, thisItem);
      updateSegmentBuffer(thisElement, thisItem);
      updateNearest(thisElement, thisItem);
      updateStretch(thisElement, skeletonScreen);
      updateSkeletonScreen(thisElement, skeletonScreen);
      updateSaveStopActionButton(thisElement, thisItem, integration);
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
      if (!(previousItem.nearest === thisItem.nearest)) {
        updateNearest(thisElement, thisItem);
      }
      if (!(previousItem.id === thisItem.id)) {
        updateSaveStopActionButton(thisElement, thisItem, integration);
      }
      updateStretch(thisElement, skeletonScreen);
      updateSkeletonScreen(thisElement, skeletonScreen);
    }
  }

  const FieldSize = queryRouteFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousIntegration === {}) {
    previousIntegration = integration;
  }

  var groupQuantity = integration.groupQuantity;
  var itemQuantity = integration.itemQuantity;
  var groupedItems = integration.groupedItems;

  routeSliding.groupQuantity = groupQuantity;

  for (var i = 0; i < groupQuantity; i++) {
    routeSliding.groupStyles[`g_${i}`] = {
      width: getTextWidth([integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `往${e}`)[i], 500, '17px', `"Noto Sans", sans-serif`, 100, 'normal', 'none', '1.2')
    };
  }
  if (!routeSliding.sliding) {
    updateRouteCSS(routeSliding.groupQuantity, routeSliding.currentGroup, routeSliding.groupStyles[`g_${routeSliding.currentGroup}`].width);
    updateRouteCanvas(routeSliding.groupQuantity, routeSliding.currentGroup, routeSliding.groupStyles[`g_${routeSliding.currentGroup}`].width);
  }
  elementQuerySelector(Field, '.css_route_name').innerHTML = `<span>${integration.RouteName}</span>`;
  Field.setAttribute('skeleton-screen', skeletonScreen);
  elementQuerySelector(Field, '.css_route_button_right').setAttribute('onclick', `bus.route.openRouteDetails(${integration.RouteID}, [${integration.PathAttributeId.join(',')}])`);

  var currentGroupSeatQuantity = elementQuerySelectorAll(Field, `.css_route_field .css_route_group`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var thisGroupElement = generateElementOfGroup();
        elementQuerySelector(Field, `.css_route_groups`).appendChild(thisGroupElement.element);
        var thisTabElement = generateElementOfTab();
        elementQuerySelector(Field, `.css_route_head .css_route_group_tabs`).appendChild(thisTabElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[groupIndex].remove();
        elementQuerySelectorAll(Field, `.css_route_head .css_route_group_tabs .css_route_group_tab`)[groupIndex].remove();
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], `.css_item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem();
          elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i].appendChild(thisElement.element);
          //ripple.__addToSingleElement(Field.QuerySelector(`.css_route_groups .css_route_group[group="${i}"] .item#${thisElement.id} .css_stretch`), 'var(--b-cssvar-333333)', 300);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], `.css_item`)[itemIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var thisTabElement = elementQuerySelectorAll(Field, `.css_route_head .css_route_group_tabs .css_route_group_tab`)[i];
    thisTabElement.innerHTML = [integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisElement = elementQuerySelectorAll(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], `.css_item`)[j];
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

async function refreshRoute(): object {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  routeRefreshTimer.auto = refresh_interval_setting.auto;
  routeRefreshTimer.baseInterval = refresh_interval_setting.baseInterval;
  routeRefreshTimer.refreshing = true;
  routeRefreshTimer.currentRequestID = `r_${md5(Math.random() * new Date().getTime())}`;
  documentQuerySelector('.css_route_update_timer').setAttribute('refreshing', true);
  var integration = await integrateRoute(currentRouteIDSet.RouteID, currentRouteIDSet.PathAttributeId, routeRefreshTimer.currentRequestID);
  var Field = documentQuerySelector('.css_route_field');
  updateRouteField(Field, integration, false);
  routeRefreshTimer.lastUpdate = new Date().getTime();
  if (routeRefreshTimer.auto) {
    var updateRate = await getUpdateRate();
    routeRefreshTimer.nextUpdate = Math.max(new Date().getTime() + routeRefreshTimer.minInterval, integration.dataUpdateTime + routeRefreshTimer.baseInterval / updateRate);
  } else {
    routeRefreshTimer.nextUpdate = new Date().getTime() + routeRefreshTimer.baseInterval;
  }
  routeRefreshTimer.dynamicInterval = Math.max(routeRefreshTimer.minInterval, routeRefreshTimer.nextUpdate - new Date().getTime());
  routeRefreshTimer.refreshing = false;
  documentQuerySelector('.css_route_update_timer').setAttribute('refreshing', false);
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
      console.error(err);
      if (routeRefreshTimer.streaming) {
        routeRefreshTimer.timer = setTimeout(function () {
          streamRoute();
        }, routeRefreshTimer.minInterval);
      } else {
        routeRefreshTimer.streamStarted = false;
      }
    });
}

export function openRoute(RouteID: number, PathAttributeId: [number]): void {
  currentRouteIDSet.RouteID = RouteID;
  currentRouteIDSet.PathAttributeId = PathAttributeId;
  var Field = documentQuerySelector('.css_route_field');
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

export function closeRoute(): void {
  var Field = documentQuerySelector('.css_route_field');
  Field.setAttribute('displayed', 'false');
  routeRefreshTimer.streaming = false;
}

export function switchRoute(RouteID: number, PathAttributeId: [number]) {
  routeRefreshTimer.streaming = false;
  openRoute(RouteID, PathAttributeId);
}

export function stretchRouteItemBody(itemID: string): void {
  var itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_item#${itemID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
  }
}

export function switchRouteBodyTab(itemID: string, tabCode: number): void {
  var itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_item#${itemID}`);
  var tabs = elementQuerySelector(itemElement, '.css_tabs');
  var tab = elementQuerySelectorAll(tabs, '.css_tab[selected="true"]');
  for (var t of tab) {
    t.setAttribute('selected', 'false');
  }
  elementQuerySelector(tabs, `.css_tab[code="${tabCode}"]`).setAttribute('selected', 'true');
  if (tabCode === 0) {
    elementQuerySelector(itemElement, '.css_buses').setAttribute('displayed', 'true');
    elementQuerySelector(itemElement, '.css_overlapping_routes').setAttribute('displayed', 'flase');
  }
  if (tabCode === 1) {
    elementQuerySelector(itemElement, '.css_buses').setAttribute('displayed', 'false');
    elementQuerySelector(itemElement, '.css_overlapping_routes').setAttribute('displayed', 'true');
  }
}

export function saveItemAsStop(itemID: string, folderId: string, StopID: number, RouteID: number) {
  var itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_item#${itemID}`);
  var actionButtonElement = elementQuerySelector(itemElement, '.css_action_button[type="save-stop"]');
  saveStop(folderId, StopID, RouteID).then((e) => {
    isSaved('stop', StopID).then((k) => {
      actionButtonElement.setAttribute('highlighted', k);
      prompt_message('已收藏站牌');
    });
  });
}

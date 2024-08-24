import { integrateRoute } from '../../data/apis/index.ts';
import { getIconHTML } from '../icons/index.ts';
import { getDataReceivingProgress } from '../../data/apis/loader.ts';
import { getSettingOptionValue } from '../../data/settings/index.ts';
import { compareThings, getTextWidth, calculateStandardDeviation, generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector.ts';
import { getUpdateRate } from '../../data/analytics/update-rate.ts';
import { isSaved } from '../../data/folder/index.ts';
import { GeneratedElement, FieldSize } from '../index.ts';

var previousIntegration: object = {};

var routeSliding_currentGroup: number = 0;
var routeSliding_targetGroup: number = 0;
var routeSliding_groupQuantity: number = 0;
var routeSliding_groupStyles: object = {};
var routeSliding_scrollLog: [] = [];
var routeSliding_fieldWidth: number = 0;
var routeSliding_fieldHeight: number = 0;
var routeSliding_sliding: boolean = false;
var routeSliding_lineHeight: number = 2;
var routeSliding_lineColor: string = '#333';
var routeSliding_canvasScale: number = 1;

var routeRefreshTimer_baseInterval: number = 15 * 1000;
var routeRefreshTimer_minInterval: number = 5 * 1000;
var routeRefreshTimer_dynamicInterval: number = 15 * 1000;
var routeRefreshTimer_auto: boolean = true;
var routeRefreshTimer_streaming: boolean = false;
var routeRefreshTimer_lastUpdate: number = 0;
var routeRefreshTimer_nextUpdate: number = 0;
var routeRefreshTimer_refreshing: boolean = false;
var routeRefreshTimer_currentRequestID: string = '';
var routeRefreshTimer_streamStarted: boolean = false;
var routeRefreshTimer_timer: ReturnType<typeof setTimeout>;

var currentRouteIDSet_RouteID: number = 0;
var currentRouteIDSet_PathAttributeId: [] = [];

export function initializeRouteSliding(): void {
  var element = documentQuerySelector('.css_route_groups');
  function monitorScrollLeft(element: HTMLElement, callback: Function): void {
    routeSliding_scrollLog.push(element.scrollLeft);
    if (routeSliding_scrollLog.length > 10) {
      routeSliding_scrollLog = routeSliding_scrollLog.slice(1);
    }
    if (calculateStandardDeviation(routeSliding_scrollLog) < Math.pow(10, -10)) {
      callback();
    } else {
      window.requestAnimationFrame(function () {
        monitorScrollLeft(element, callback);
      });
    }
  }

  element.addEventListener('touchstart', function (event) {
    routeSliding_currentGroup = Math.round(element.scrollLeft / routeSliding_fieldWidth);
    routeSliding_sliding = true;
  });
  element.addEventListener('touchend', function (event) {
    monitorScrollLeft(element, function () {
      routeSliding_currentGroup = Math.round(element.scrollLeft / routeSliding_fieldWidth);
      routeSliding_sliding = false;
    });
  });
  element.addEventListener('scroll', function (event) {
    var slidingGroupIndex = event.target.scrollLeft / routeSliding_fieldWidth;
    if (slidingGroupIndex > routeSliding_currentGroup) {
      routeSliding_targetGroup = routeSliding_currentGroup + 1;
    } else {
      routeSliding_targetGroup = routeSliding_currentGroup - 1;
    }
    var current_size = routeSliding_groupStyles[`g_${routeSliding_currentGroup}`] || { width: 0 };
    var target_size = routeSliding_groupStyles[`g_${routeSliding_targetGroup}`] || { width: 0 };
    var line_width = current_size.width + (target_size.width - current_size.width) * Math.abs(slidingGroupIndex - routeSliding_currentGroup);
    updateRouteCSS(routeSliding_groupQuantity, slidingGroupIndex, line_width);
    updateRouteCanvas(routeSliding_groupQuantity, slidingGroupIndex, line_width);
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
  const canvasScale = Math.round(Math.log10(window.devicePixelRatio) / 0.15904041824);
  //Math.log(Math.pow(3, 1 / 3) ≈ 0.15904041824

  const canvas: HTMLCanvasElement = documentQuerySelector('.css_route_field .css_route_head .css_route_group_tab_line_track .css_route_group_tab_line');
  canvas.width = FieldWidth * canvasScale;
  canvas.height = routeSliding_lineHeight * canvasScale;
  routeSliding_fieldWidth = FieldWidth;
  routeSliding_fieldHeight = FieldHeight;
  routeSliding_canvasScale = canvasScale;
}

function updateRouteCanvas(groupQuantity: number, percentage: number, width: number): void {
  var canvas: HTMLCanvasElement = documentQuerySelector('.css_route_field .css_route_head .css_route_group_tab_line_track .css_route_group_tab_line');
  var ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  ctx.fillStyle = routeSliding_lineColor;
  window.requestAnimationFrame(function () {
    var x: number = (routeSliding_fieldWidth / groupQuantity) * percentage + (routeSliding_fieldWidth / groupQuantity - width) / 2;
    ctx.fillRect(x * routeSliding_canvasScale, 0, routeSliding_fieldWidth * routeSliding_canvasScale, routeSliding_lineHeight * routeSliding_canvasScale);
    ctx.clearRect(0, 0, x * routeSliding_canvasScale, routeSliding_lineHeight * routeSliding_canvasScale);
    ctx.clearRect((x + width) * routeSliding_canvasScale, 0, (routeSliding_fieldWidth - (x + width)) * routeSliding_canvasScale, routeSliding_lineHeight * routeSliding_canvasScale);
  });
}

function updateRouteLineColor(e): void {
  if (e.matches) {
    routeSliding_lineColor = '#f9f9fb';
  } else {
    routeSliding_lineColor = '#333';
  }
  if (!routeSliding_sliding) {
    updateRouteCanvas(routeSliding_groupQuantity, routeSliding_currentGroup, routeSliding_groupStyles[`g_${routeSliding_currentGroup}`]?.width || 1);
  }
}

function updateUpdateTimer() {
  var time = new Date().getTime();
  var percentage = 0;
  if (routeRefreshTimer_refreshing) {
    percentage = -1 + getDataReceivingProgress(routeRefreshTimer_currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - routeRefreshTimer_lastUpdate) / routeRefreshTimer_dynamicInterval));
  }
  documentQuerySelector('.css_route_update_timer').style.setProperty('--b-cssvar-update-timer', percentage);
  window.requestAnimationFrame(function () {
    if (routeRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfThreadBox(): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.classList.add('css_thread_box');
  element.id = identifier;
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="css_thread"></div><div class="css_thread_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfItem(threadBoxIdentifier: string): GeneratedElement {
  var identifier = `i_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.classList.add('css_item');
  element.id = identifier;
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="css_head"><div class="css_name"></div><div class="css_capsule"><div class="css_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_capsule_separator"></div><div class="css_stretch" onclick="bus.route.stretchRouteItemBody('${identifier}', '${threadBoxIdentifier}')">${getIconHTML('keyboard_arrow_down')}</div></div></div><div class="css_body"><div class="css_tabs"><div class="css_tab" selected="true" onclick="bus.route.switchRouteBodyTab('${identifier}', 0)" code="0">經過此站的公車</div><div class="css_tab" selected="false" onclick="bus.route.switchRouteBodyTab('${identifier}', 1)" code="1">經過此站的路線</div><div class="css_action_button" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder('stop', [null, null, '${identifier}'])"><div class="css_action_button_icon">${getIconHTML('favorite')}</div>儲存至資料夾</div></div><div class="css_buses" displayed="true"></div><div class="css_overlapping_routes" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  var identifier = `g_${generateIdentifier()}`;
  var element = document.createElement('div');
  element.classList.add('css_route_group');
  element.id = identifier;
  var tracksElement = document.createElement('div');
  tracksElement.classList.add('css_route_group_tracks');
  var threadTrackElement = document.createElement('div');
  threadTrackElement.classList.add('css_threads_track');
  var itemsTrackElement = document.createElement('div');
  itemsTrackElement.classList.add('css_items_track');
  tracksElement.appendChild(threadTrackElement);
  tracksElement.appendChild(itemsTrackElement);
  element.appendChild(tracksElement);
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfTab(): GeneratedElement {
  var identifier = `t_${generateIdentifier()}`;
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
        progress: 0,
        segmentBuffer: false,
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
  function updateItem(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: object, previousItem: object): void {
    function updateStatus(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: object): void {
      var currentThreadSlide = elementQuerySelector(thisThreadBoxElement, '.css_thread_status .css_current_slide');
      var nextThreadSlide = elementQuerySelector(thisThreadBoxElement, '.css_thread_status .css_next_slide');

      var currentItemSlide = elementQuerySelector(thisItemElement, '.css_item_status .css_current_slide');
      var nextItemSlide = elementQuerySelector(thisItemElement, '.css_item_status .css_next_slide');

      nextThreadSlide.setAttribute('code', thisItem.status.code);

      nextItemSlide.setAttribute('code', thisItem.status.code);
      nextItemSlide.innerText = thisItem.status.text;
      currentThreadSlide.addEventListener(
        'animationend',
        function () {
          currentThreadSlide.setAttribute('code', thisItem.status.code);
          currentThreadSlide.classList.remove('css_slide_fade_out');
        },
        { once: true }
      );
      currentItemSlide.addEventListener(
        'animationend',
        function () {
          currentItemSlide.setAttribute('code', thisItem.status.code);
          currentItemSlide.innerText = thisItem.status.text;
          currentItemSlide.classList.remove('css_slide_fade_out');
        },
        { once: true }
      );
      currentThreadSlide.classList.add('css_slide_fade_out');
      currentItemSlide.classList.add('css_slide_fade_out');
    }
    function updateSegmentBuffer(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: object): void {
      thisItemElement.setAttribute('segment-buffer', thisItem.segmentBuffer);
      thisThreadBoxElement.setAttribute('segment-buffer', thisItem.segmentBuffer);
    }
    function updateName(thisItemElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisItemElement, '.css_name').innerText = thisItem.name;
    }
    function updateBuses(thisItemElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisItemElement, '.css_buses').innerHTML = thisItem.buses === null ? '<div class="css_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_bus" on-this-route="${bus.onThisRoute}"><div class="css_bus_title"><div class="css_car_icon">${getIconHTML('directions_bus')}</div><div class="css_car_number">${bus.carNumber}</div></div><div class="css_car_attributes"><div class="css_car_route">路線：${bus.RouteName}</div><div class="css_car_status">狀態：${bus.status.text}</div><div class="css_car_type">類型：${bus.type}</div></div></div>`).join('');
    }
    function updateOverlappingRoutes(thisItemElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisItemElement, '.css_overlapping_routes').innerHTML = thisItem.overlappingRoutes === null ? '<div class="css_overlapping_route_message">目前沒有路線可顯示</div>' : thisItem.overlappingRoutes.map((route) => `<div class="css_overlapping_route"><div class="css_overlapping_route_title"><div class="css_overlapping_route_icon">${getIconHTML('route')}</div><div class="css_overlapping_route_name">${route.name}</div></div><div class="css_overlapping_route_endpoints">${route.RouteEndPoints.html}</div><div class="css_overlapping_route_actions"><div class="css_overlapping_route_action_button" onclick="bus.route.switchRoute(${route.RouteID}, [${route.PathAttributeId.join(',')}])">查看路線</div><div class="css_overlapping_route_action_button">收藏路線</div></div></div>`).join('');
    }
    function updateNearest(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: object): void {
      thisItemElement.setAttribute('nearest', thisItem.nearest);
      thisThreadBoxElement.setAttribute('nearest', thisItem.nearest);
    }
    function updateThreadBox(thisThreadBoxElement: HTMLElement, thisItem: object, previousItem: object): void {
      var previousProgress = previousItem?.progress || 0;
      var thisProgress = thisItem?.progress || 0;
      if (!(previousProgress === 0) && thisProgress === 0 && Math.abs(thisProgress - previousProgress) > 0) {
        elementQuerySelector(thisThreadBoxElement, '.css_thread').style.setProperty('--b-cssvar-thread-progress-a', `${100}%`);
        elementQuerySelector(thisThreadBoxElement, '.css_thread').style.setProperty('--b-cssvar-thread-progress-b', `${100}%`);
        elementQuerySelector(thisThreadBoxElement, '.css_thread').addEventListener(
          'transitionend',
          function () {
            elementQuerySelector(thisThreadBoxElement, '.css_thread').style.setProperty('--b-cssvar-thread-progress-a', `${0}%`);
            elementQuerySelector(thisThreadBoxElement, '.css_thread').style.setProperty('--b-cssvar-thread-progress-b', `${0}%`);
          },
          { once: true }
        );
      } else {
        elementQuerySelector(thisThreadBoxElement, '.css_thread').style.setProperty('--b-cssvar-thread-progress-a', `${0}%`);
        elementQuerySelector(thisThreadBoxElement, '.css_thread').style.setProperty('--b-cssvar-thread-progress-b', `${thisProgress * 100}%`);
      }
    }
    function updateStretch(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        thisItemElement.setAttribute('stretched', false);
        thisThreadBoxElement.setAttribute('stretched', false);
      }
    }
    function updateSkeletonScreen(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, skeletonScreen: boolean): void {
      thisItemElement.setAttribute('skeleton-screen', skeletonScreen);
      thisThreadBoxElement.setAttribute('skeleton-screen', skeletonScreen);
    }
    function updateSaveStopActionButton(thisItemElement: HTMLElement, thisItem: object): void {
      elementQuerySelector(thisItemElement, '.css_body .css_tabs .css_action_button').setAttribute('onclick', `bus.folder.openSaveToFolder('stop', [${thisItem.id}, ${integration.RouteID}, '${thisItemElement.id}'])`);
      isSaved('stop', thisItem.id).then((e) => {
        elementQuerySelector(thisItemElement, '.css_body .css_tabs .css_action_button').setAttribute('highlighted', e);
      });
    }

    if (previousItem === null) {
      updateStatus(thisItemElement, thisThreadBoxElement, thisItem);
      updateName(thisItemElement, thisItem);
      updateBuses(thisItemElement, thisItem);
      updateOverlappingRoutes(thisItemElement, thisItem);
      updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
      updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      updateThreadBox(thisThreadBoxElement, thisItem, previousItem);
      updateStretch(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSkeletonScreen(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSaveStopActionButton(thisItemElement, thisItem, integration);
    } else {
      if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
        updateStatus(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (!compareThings(previousItem.name, thisItem.name)) {
        updateName(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.buses, thisItem.buses)) {
        updateBuses(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.overlappingRoutes, thisItem.overlappingRoutes)) {
        updateOverlappingRoutes(thisItemElement, thisItem);
      }
      if (!(previousItem.segmentBuffer === thisItem.segmentBuffer)) {
        updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (!(previousItem.nearest === thisItem.nearest)) {
        updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (!(previousItem.progress === thisItem.progress)) {
        updateThreadBox(thisThreadBoxElement, thisItem, previousItem);
      }
      if (!(previousItem.id === thisItem.id)) {
        updateSaveStopActionButton(thisItemElement, thisItem, integration);
      }
      updateStretch(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSkeletonScreen(thisItemElement, thisThreadBoxElement, skeletonScreen);
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

  routeSliding_groupQuantity = groupQuantity;

  for (var i = 0; i < groupQuantity; i++) {
    routeSliding_groupStyles[`g_${i}`] = {
      width: getTextWidth([integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `往${e}`)[i], 500, '17px', `"Noto Sans", sans-serif`, 100, 'normal', 'none', '1.2')
    };
  }
  if (!routeSliding_sliding) {
    updateRouteCSS(routeSliding_groupQuantity, routeSliding_currentGroup, routeSliding_groupStyles[`g_${routeSliding_currentGroup}`].width);
    updateRouteCanvas(routeSliding_groupQuantity, routeSliding_currentGroup, routeSliding_groupStyles[`g_${routeSliding_currentGroup}`].width);
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
    var currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_items_track'), `.css_item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisThreadBoxElement = generateElementOfThreadBox();
          var thisItemElement = generateElementOfItem(thisThreadBoxElement.id);
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_items_track').appendChild(thisItemElement.element);
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_threads_track').appendChild(thisThreadBoxElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_items_track'), `.css_item`)[itemIndex].remove();
          elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_threads_track'), `.css_thread_box`)[itemIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var thisTabElement = elementQuerySelectorAll(Field, `.css_route_head .css_route_group_tabs .css_route_group_tab`)[i];
    thisTabElement.innerHTML = [integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisItemElement = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_items_track'), `.css_item`)[j];
      var thisThreadBoxElement = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_threads_track'), `.css_thread_box`)[j];
      var thisItem = groupedItems[groupKey][j];
      if (previousIntegration.hasOwnProperty('groupedItems')) {
        if (previousIntegration.groupedItems.hasOwnProperty(groupKey)) {
          if (previousIntegration.groupedItems[groupKey][j]) {
            var previousItem = previousIntegration.groupedItems[groupKey][j];
            updateItem(thisItemElement, thisThreadBoxElement, thisItem, previousItem);
          } else {
            updateItem(thisItemElement, thisThreadBoxElement, thisItem, null);
          }
        } else {
          updateItem(thisItemElement, thisThreadBoxElement, thisItem, null);
        }
      } else {
        updateItem(thisItemElement, thisThreadBoxElement, thisItem, null);
      }
    }
  }
  previousIntegration = integration;
}

async function refreshRoute(): object {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval');
  routeRefreshTimer_auto = refresh_interval_setting.auto;
  routeRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  routeRefreshTimer_refreshing = true;
  routeRefreshTimer_currentRequestID = `r_${generateIdentifier()}`;
  documentQuerySelector('.css_route_update_timer').setAttribute('refreshing', true);
  var integration = await integrateRoute(currentRouteIDSet_RouteID, currentRouteIDSet_PathAttributeId, routeRefreshTimer_currentRequestID);
  var Field = documentQuerySelector('.css_route_field');
  updateRouteField(Field, integration, false);
  routeRefreshTimer_lastUpdate = new Date().getTime();
  if (routeRefreshTimer_auto) {
    var updateRate = await getUpdateRate();
    routeRefreshTimer_nextUpdate = Math.max(new Date().getTime() + routeRefreshTimer_minInterval, integration.dataUpdateTime + routeRefreshTimer_baseInterval / updateRate);
  } else {
    routeRefreshTimer_nextUpdate = new Date().getTime() + routeRefreshTimer_baseInterval;
  }
  routeRefreshTimer_dynamicInterval = Math.max(routeRefreshTimer_minInterval, routeRefreshTimer_nextUpdate - new Date().getTime());
  routeRefreshTimer_refreshing = false;
  documentQuerySelector('.css_route_update_timer').setAttribute('refreshing', false);
  return { status: 'Successfully refreshed the route.' };
}

export function streamRoute(): void {
  refreshRoute()
    .then((result) => {
      if (routeRefreshTimer_streaming) {
        routeRefreshTimer_timer = setTimeout(function () {
          streamRoute();
        }, Math.max(routeRefreshTimer_minInterval, routeRefreshTimer_nextUpdate - new Date().getTime()));
      } else {
        routeRefreshTimer_streamStarted = false;
      }
    })
    .catch((err) => {
      console.error(err);
      if (routeRefreshTimer_streaming) {
        routeRefreshTimer_timer = setTimeout(function () {
          streamRoute();
        }, routeRefreshTimer_minInterval);
      } else {
        routeRefreshTimer_streamStarted = false;
      }
    });
}

export function openRoute(RouteID: number, PathAttributeId: [number]): void {
  currentRouteIDSet_RouteID = RouteID;
  currentRouteIDSet_PathAttributeId = PathAttributeId;
  var Field = documentQuerySelector('.css_route_field');
  Field.setAttribute('displayed', 'true');
  setUpRouteFieldSkeletonScreen(Field);
  if (!routeRefreshTimer_streaming) {
    routeRefreshTimer_streaming = true;
    if (!routeRefreshTimer_streamStarted) {
      routeRefreshTimer_streamStarted = true;
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
  routeRefreshTimer_streaming = false;
}

export function switchRoute(RouteID: number, PathAttributeId: [number]) {
  routeRefreshTimer_streaming = false;
  openRoute(RouteID, PathAttributeId);
}

export function stretchRouteItemBody(itemElementID: string, threadBoxElementID: string): void {
  const itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_items_track .css_item#${itemElementID}`);
  const threadBoxElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_threads_track .css_thread_box#${threadBoxElementID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
    threadBoxElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
    threadBoxElement.setAttribute('stretched', true);
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

import { IntegratedRoute, integratedStopItem, integrateRoute } from '../../data/route/index';
import { getIconHTML } from '../icons/index';
import { getDataReceivingProgress } from '../../data/apis/loader';
import { getSettingOptionValue, SettingSelectOptionRefreshIntervalValue } from '../../data/settings/index';
import { booleanToString, compareThings, generateIdentifier } from '../../tools/index';
import { getTextWidth } from '../../tools/graphic';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { getUpdateRate } from '../../data/analytics/update-rate';
import { isSaved } from '../../data/folder/index';
import { GeneratedElement, FieldSize, pushPageHistory, closePreviousPage, openPreviousPage, GroupStyles } from '../index';
import { promptMessage } from '../prompt/index';
import { indexToDay, timeObjectToString } from '../../tools/time';
import { logRecentView } from '../../data/recent-views/index';

let previousIntegration = {} as IntegratedRoute;

let routeSliding_initialIndex: number = 0;
let routeSliding_targetIndex: number = 0;
let routeSliding_groupQuantity: number = 0;
let routeSliding_groupStyles: GroupStyles = {};
let routeSliding_fieldWidth: number = 0;
let routeSliding_fieldHeight: number = 0;
let routeSliding_sliding: boolean = false;

let routeRefreshTimer_retryInterval: number = 10 * 1000;
let routeRefreshTimer_baseInterval: number = 15 * 1000;
let routeRefreshTimer_minInterval: number = 5 * 1000;
let routeRefreshTimer_dynamicInterval: number = 15 * 1000;
let routeRefreshTimer_dynamic: boolean = true;
let routeRefreshTimer_streaming: boolean = false;
let routeRefreshTimer_lastUpdate: number = 0;
let routeRefreshTimer_nextUpdate: number = 0;
let routeRefreshTimer_refreshing: boolean = false;
let routeRefreshTimer_currentRequestID: string = '';
let routeRefreshTimer_streamStarted: boolean = false;
var routeRefreshTimer_timer: ReturnType<typeof setTimeout>;

let currentRouteIDSet_RouteID: number = 0;
let currentRouteIDSet_PathAttributeId: Array<number> = [];

let tabPadding: number = 20;

export function initializeRouteSliding(): void {
  const routeGroups = documentQuerySelector('.css_route_field .css_route_groups');

  routeGroups.addEventListener('touchstart', function (event) {
    routeSliding_initialIndex = Math.round(routeGroups.scrollLeft / routeSliding_fieldWidth);
  });

  routeGroups.addEventListener('scroll', function (event: Event) {
    routeSliding_sliding = true;
    const target = event.target as HTMLElement;
    var currentIndex = target.scrollLeft / routeSliding_fieldWidth;
    if (currentIndex > routeSliding_initialIndex) {
      routeSliding_targetIndex = routeSliding_initialIndex + 1;
    } else {
      routeSliding_targetIndex = routeSliding_initialIndex - 1;
    }
    var initialSize = routeSliding_groupStyles[`g_${routeSliding_initialIndex}`] || { width: 0, offset: 0 };
    var targetSize = routeSliding_groupStyles[`g_${routeSliding_targetIndex}`] || { width: 0, offset: 0 };
    var tabWidth = initialSize.width + (targetSize.width - initialSize.width) * Math.abs(currentIndex - routeSliding_initialIndex);
    var offset = (initialSize.offset + (targetSize.offset - initialSize.offset) * Math.abs(currentIndex - routeSliding_initialIndex)) * -1 + routeSliding_fieldWidth * 0.5 - tabWidth * 0.5;

    updateRouteCSS(routeSliding_groupQuantity, offset, tabWidth - tabPadding, currentIndex);

    if (currentIndex === routeSliding_targetIndex) {
      routeSliding_initialIndex = Math.round(routeGroups.scrollLeft / routeSliding_fieldWidth);
      routeSliding_sliding = false;
    }
  });
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
  const Field = documentQuerySelector('.css_route_field');
  Field.style.setProperty('--b-cssvar-route-field-width', `${FieldWidth}px`);
  Field.style.setProperty('--b-cssvar-route-field-height', `${FieldHeight}px`);
}

export function updateRouteCSS(groupQuantity: number, offset: number, tabLineWidth: number, percentage: number): void {
  const Field = documentQuerySelector('.css_route_field');
  const groupsTabsTrayElement = elementQuerySelector(Field, '.css_route_head .css_route_group_tabs .css_route_group_tabs_tray');
  const groupTabLineElement = elementQuerySelector(Field, '.css_route_head .css_route_group_tab_line_track .css_route_group_tab_line');
  Field.style.setProperty('--b-cssvar-route-group-quantity', groupQuantity);
  groupTabLineElement.style.setProperty('--b-cssvar-route-tab-line-width-scale', (tabLineWidth / 30).toFixed(5));
  groupsTabsTrayElement.style.setProperty('--b-cssvar-route-tabs-tray-offset', `${offset.toFixed(5)}px`);
  groupsTabsTrayElement.style.setProperty('--b-cssvar-route-percentage', percentage.toFixed(5));
}

function updateUpdateTimer(): void {
  const updateTimerElement = documentQuerySelector('.css_route_update_timer');
  var time = new Date().getTime();
  var percentage = 0;
  if (routeRefreshTimer_refreshing) {
    percentage = -1 + getDataReceivingProgress(routeRefreshTimer_currentRequestID);
  } else {
    percentage = -1 * Math.min(1, Math.max(0, Math.abs(time - routeRefreshTimer_lastUpdate) / routeRefreshTimer_dynamicInterval));
  }
  updateTimerElement.style.setProperty('--b-cssvar-update-timer', percentage.toFixed(5));
  window.requestAnimationFrame(function () {
    if (routeRefreshTimer_streaming) {
      updateUpdateTimer();
    }
  });
}

function generateElementOfThreadBox(): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_route_group_thread_box');
  element.id = identifier;
  element.setAttribute('stretched', 'false');
  element.innerHTML = `<div class="css_route_group_thread"></div><div class="css_route_group_thread_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfItem(threadBoxIdentifier: string): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_route_group_item');
  element.id = identifier;
  element.setAttribute('stretched', 'false');
  element.innerHTML = `<div class="css_route_group_item_head"><div class="css_route_group_item_name"></div><div class="css_route_group_item_capsule"><div class="css_route_group_item_status"><div class="css_next_slide" code="0"></div><div class="css_current_slide" code="0"></div></div><div class="css_route_group_item_stretch" onclick="bus.route.stretchRouteItemBody('${identifier}', '${threadBoxIdentifier}')">${getIconHTML('keyboard_arrow_down')}</div><div class="css_route_group_item_capsule_separator"></div></div></div><div class="css_route_group_item_body"><div class="css_route_group_item_buttons"><div class="css_route_group_item_button" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab('${identifier}', 0)" code="0"><div class="css_route_group_item_button_icon">${getIconHTML('directions_bus')}</div>公車</div><div class="css_route_group_item_button" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab('${identifier}', 1)" code="1"><div class="css_route_group_item_button_icon">${getIconHTML('departure_board')}</div>抵達時間</div><div class="css_route_group_item_button" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab('${identifier}', 2)" code="2"><div class="css_route_group_item_button_icon">${getIconHTML('route')}</div>路線</div><div class="css_route_group_item_button" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder('stop', ['${identifier}', null, null])"><div class="css_route_group_item_button_icon">${getIconHTML('folder')}</div>儲存至資料夾</div></div><div class="css_route_group_item_buses" displayed="true"></div><div class="css_route_group_item_overlapping_routes" displayed="false"></div><div class="css_route_group_item_bus_arrival_times" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfGroup(): GeneratedElement {
  var identifier = generateIdentifier('g');
  var element = document.createElement('div');
  element.classList.add('css_route_group');
  element.id = identifier;
  var tracksElement = document.createElement('div');
  tracksElement.classList.add('css_route_group_tracks');
  var threadTrackElement = document.createElement('div');
  threadTrackElement.classList.add('css_route_group_threads_track');
  var itemsTrackElement = document.createElement('div');
  itemsTrackElement.classList.add('css_route_group_items_track');
  tracksElement.appendChild(threadTrackElement);
  tracksElement.appendChild(itemsTrackElement);
  element.appendChild(tracksElement);
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfTab(): GeneratedElement {
  var identifier = generateIdentifier('t');
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
  const defaultItemQuantity: number = Math.floor(FieldHeight / 50) + 5;
  const defaultGroupQuantity = 2;
  let groupedItems: IntegratedRoute['groupedItems'] = {};
  for (let i = 0; i < defaultGroupQuantity; i++) {
    const groupKey: string = `g_${i}`;
    groupedItems[groupKey] = [];
    for (let j = 0; j < defaultItemQuantity; j++) {
      groupedItems[groupKey].push({
        name: '',
        goBack: '0',
        status: { code: 0, text: '' },
        buses: [],
        overlappingRoutes: [],
        busArrivalTimes: [],
        sequence: j,
        position: {
          longitude: 0,
          latitude: 0
        },
        nearest: false,
        progress: 0,
        segmentBuffer: {
          isSegmentBuffer: false,
          isStartingPoint: false,
          isEndingPoint: false
        },
        id: 0
      });
    }
  }
  updateRouteField(
    Field,
    {
      groupedItems: groupedItems,
      groupQuantity: defaultGroupQuantity,
      itemQuantity: {
        g_0: defaultItemQuantity,
        g_1: defaultItemQuantity
      },
      RouteName: '載入中',
      RouteEndPoints: {
        RouteDeparture: '載入中',
        RouteDestination: '載入中'
      },
      RouteID: 0,
      PathAttributeId: [],
      dataUpdateTime: null
    },
    true
  );
}

function updateRouteField(Field: HTMLElement, integration: IntegratedRoute, skeletonScreen: boolean) {
  function updateItem(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, previousItem: integratedStopItem | null): void {
    function updateStatus(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem): void {
      var currentThreadSlide = elementQuerySelector(thisThreadBoxElement, '.css_route_group_thread_status .css_current_slide');
      var nextThreadSlide = elementQuerySelector(thisThreadBoxElement, '.css_route_group_thread_status .css_next_slide');

      var currentItemSlide = elementQuerySelector(thisItemElement, '.css_route_group_item_status .css_current_slide');
      var nextItemSlide = elementQuerySelector(thisItemElement, '.css_route_group_item_status .css_next_slide');

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
    function updateSegmentBuffer(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem): void {
      thisItemElement.setAttribute('segment-buffer', booleanToString(thisItem.segmentBuffer.isSegmentBuffer));
      thisThreadBoxElement.setAttribute('segment-buffer', booleanToString(thisItem.segmentBuffer.isSegmentBuffer));
    }
    function updateName(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_name').innerText = thisItem.name;
    }
    function updateBuses(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_buses').innerHTML = thisItem.buses.length === 0 ? '<div class="css_route_group_item_buses_message">目前沒有公車可顯示</div>' : thisItem.buses.map((bus) => `<div class="css_route_group_item_bus" on-this-route="${bus.onThisRoute}"><div class="css_route_group_item_bus_title"><div class="css_route_group_item_bus_icon">${getIconHTML('directions_bus')}</div><div class="css_route_group_item_bus_car_number">${bus.carNumber}</div></div><div class="css_route_group_item_bus_attributes"><div class="css_route_group_item_bus_route">路線：${bus.RouteName}</div><div class="css_route_group_item_bus_car_status">狀態：${bus.status.text}</div><div class="css_route_group_item_bus_car_type">類型：${bus.type}</div></div></div>`).join('');
    }
    function updateOverlappingRoutes(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_overlapping_routes').innerHTML = thisItem.overlappingRoutes.length === 0 ? '<div class="css_route_group_item_overlapping_route_message">目前沒有路線可顯示</div>' : thisItem.overlappingRoutes.map((route) => `<div class="css_route_group_item_overlapping_route"><div class="css_route_group_item_overlapping_route_title"><div class="css_route_group_item_overlapping_route_icon">${getIconHTML('route')}</div><div class="css_route_group_item_overlapping_route_name">${route.name}</div></div><div class="css_route_group_item_overlapping_route_endpoints">${route.RouteEndPoints.html}</div><div class="css_route_group_item_overlapping_route_actions"><div class="css_route_group_item_overlapping_route_action_button" onclick="bus.route.switchRoute(${route.RouteID}, [${route.PathAttributeId.join(',')}])">查看路線</div><div class="css_route_group_item_overlapping_route_action_button" onclick="bus.folder.openSaveToFolder('route', [${route.RouteID}])">收藏路線</div></div></div>`).join('');
    }
    function updateBusArrivalTimes(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      elementQuerySelector(thisItemElement, '.css_route_group_item_bus_arrival_times').innerHTML = thisItem.busArrivalTimes.length === 0 ? '<div class="css_route_group_item_bus_arrival_message">目前沒有抵達時間可顯示</div>' : thisItem.busArrivalTimes.map((busArrivalTime) => `<div class="css_route_group_item_bus_arrival_time"><div class="css_route_group_item_bus_arrival_time_title"><div class="css_route_group_item_bus_arrival_time_icon">${getIconHTML('schedule')}</div><div class="css_route_group_item_bus_arrival_time_time">${busArrivalTime.time}</div></div><div class="css_route_group_item_bus_arrival_time_attributes"><div class="css_route_group_item_bus_arrival_time_personal_schedule_name">個人化行程：${busArrivalTime.personalSchedule.name}</div><div class="css_route_group_item_bus_arrival_time_personal_schedule_period">時段：${timeObjectToString(busArrivalTime.personalSchedule.period.start)} - ${timeObjectToString(busArrivalTime.personalSchedule.period.end)}</div><div class="css_route_group_item_bus_arrival_time_personal_schedule_days">重複：${busArrivalTime.personalSchedule.days.map((day) => indexToDay(day).name).join('、')}</div></div></div>`).join('');
    }
    function updateNearest(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem): void {
      thisItemElement.setAttribute('nearest', booleanToString(thisItem.nearest));
      thisThreadBoxElement.setAttribute('nearest', booleanToString(thisItem.nearest));
    }
    function updateThread(thisThreadBoxElement: HTMLElement, thisItem: integratedStopItem, previousItem: integratedStopItem | null): void {
      var previousProgress = previousItem?.progress || 0;
      var thisProgress = thisItem?.progress || 0;
      const thisThreadElement = elementQuerySelector(thisThreadBoxElement, '.css_route_group_thread');
      if (!(previousProgress === 0) && thisProgress === 0 && Math.abs(thisProgress - previousProgress) > 0) {
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-a', `${100}%`);
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-b', `${100}%`);
        thisThreadElement.addEventListener(
          'transitionend',
          function () {
            thisThreadElement.style.setProperty('--b-cssvar-thread-progress-a', `${0}%`);
            thisThreadElement.style.setProperty('--b-cssvar-thread-progress-b', `${0}%`);
          },
          { once: true }
        );
      } else {
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-a', `${0}%`);
        thisThreadElement.style.setProperty('--b-cssvar-thread-progress-b', `${thisProgress * 100}%`);
      }
    }
    function updateStretch(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, skeletonScreen: boolean): void {
      if (skeletonScreen) {
        thisItemElement.setAttribute('stretched', 'false');
        thisThreadBoxElement.setAttribute('stretched', 'false');
      }
    }
    function updateSkeletonScreen(thisItemElement: HTMLElement, thisThreadBoxElement: HTMLElement, skeletonScreen: boolean): void {
      thisItemElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
      thisThreadBoxElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }
    function updateSaveToFolderButton(thisItemElement: HTMLElement, thisItem: integratedStopItem): void {
      const saveToFolderButtonElement = elementQuerySelector(thisItemElement, '.css_route_group_item_body .css_route_group_item_buttons .css_route_group_item_button[type="save-to-folder"]');
      saveToFolderButtonElement.setAttribute('onclick', `bus.folder.openSaveToFolder('stop', ['${thisItemElement.id}', ${thisItem.id}, ${integration.RouteID}])`);
      isSaved('stop', thisItem.id).then((e) => {
        saveToFolderButtonElement.setAttribute('highlighted', booleanToString(e));
      });
    }

    if (previousItem === null) {
      updateStatus(thisItemElement, thisThreadBoxElement, thisItem);
      updateName(thisItemElement, thisItem);
      updateBuses(thisItemElement, thisItem);
      updateOverlappingRoutes(thisItemElement, thisItem);
      updateBusArrivalTimes(thisItemElement, thisItem);
      updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
      updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      updateThread(thisThreadBoxElement, thisItem, previousItem);
      updateStretch(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSkeletonScreen(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSaveToFolderButton(thisItemElement, thisItem);
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
      if (!compareThings(previousItem.busArrivalTimes, thisItem.busArrivalTimes)) {
        updateBusArrivalTimes(thisItemElement, thisItem);
      }
      if (!compareThings(previousItem.segmentBuffer, thisItem.segmentBuffer)) {
        updateSegmentBuffer(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (!(previousItem.nearest === thisItem.nearest)) {
        updateNearest(thisItemElement, thisThreadBoxElement, thisItem);
      }
      if (!(previousItem.progress === thisItem.progress)) {
        updateThread(thisThreadBoxElement, thisItem, previousItem);
      }
      if (!(previousItem.id === thisItem.id)) {
        updateSaveToFolderButton(thisItemElement, thisItem);
      }
      updateStretch(thisItemElement, thisThreadBoxElement, skeletonScreen);
      updateSkeletonScreen(thisItemElement, thisThreadBoxElement, skeletonScreen);
    }
  }

  const FieldSize = queryRouteFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  const groupQuantity = integration.groupQuantity;
  const itemQuantity = integration.itemQuantity;
  const groupedItems = integration.groupedItems;

  routeSliding_groupQuantity = groupQuantity;
  routeSliding_fieldWidth = FieldWidth;
  routeSliding_fieldHeight = FieldHeight;

  var cumulativeOffset = 0;
  for (let i = 0; i < groupQuantity; i++) {
    var width = getTextWidth([integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `往${e}`)[i], 500, '17px', `"Noto Sans TC", sans-serif`) + tabPadding;
    routeSliding_groupStyles[`g_${i}`] = {
      width: width,
      offset: cumulativeOffset
    };
    cumulativeOffset += width;
  }
  var offset = routeSliding_groupStyles[`g_${routeSliding_initialIndex}`].offset * -1 + routeSliding_fieldWidth * 0.5 - routeSliding_groupStyles[`g_${routeSliding_initialIndex}`].width * 0.5;
  if (!routeSliding_sliding) {
    updateRouteCSS(routeSliding_groupQuantity, offset, routeSliding_groupStyles[`g_${routeSliding_initialIndex}`].width - tabPadding, routeSliding_initialIndex);
  }
  elementQuerySelector(Field, '.css_route_name').innerHTML = `<span>${integration.RouteName}</span>`;
  Field.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  elementQuerySelector(Field, '.css_route_button_right').setAttribute('onclick', `bus.route.openRouteDetails(${integration.RouteID}, [${integration.PathAttributeId.join(',')}])`);

  var currentGroupSeatQuantity = elementQuerySelectorAll(Field, `.css_route_field .css_route_group`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newGroupElement = generateElementOfGroup();
        elementQuerySelector(Field, `.css_route_groups`).appendChild(newGroupElement.element);
        const newTabElement = generateElementOfTab();
        elementQuerySelector(Field, `.css_route_head .css_route_group_tabs .css_route_group_tabs_tray`).appendChild(newTabElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const groupIndex = currentGroupSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[groupIndex].remove();
        elementQuerySelectorAll(Field, `.css_route_head .css_route_group_tabs .css_route_group_tabs_tray .css_route_group_tab`)[groupIndex].remove();
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const currentItemSeatQuantity = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track'), `.css_route_group_item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      const capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (let o = 0; o < Math.abs(capacity); o++) {
          const thisThreadBoxElement = generateElementOfThreadBox();
          const thisItemElement = generateElementOfItem(thisThreadBoxElement.id);
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track').appendChild(thisItemElement.element);
          elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_threads_track').appendChild(thisThreadBoxElement.element);
        }
      } else {
        for (let o = 0; o < Math.abs(capacity); o++) {
          const itemIndex = currentItemSeatQuantity - 1 - o;
          elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track'), `.css_route_group_item`)[itemIndex].remove();
          elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_threads_track'), `.css_route_group_thread_box`)[itemIndex].remove();
        }
      }
    }
  }

  for (let i = 0; i < groupQuantity; i++) {
    const groupKey = `g_${i}`;
    const thisTabElement = elementQuerySelectorAll(Field, `.css_route_head .css_route_group_tabs .css_route_group_tabs_tray .css_route_group_tab`)[i];
    thisTabElement.innerHTML = [integration.RouteEndPoints.RouteDestination, integration.RouteEndPoints.RouteDeparture, ''].map((e) => `<span>往${e}</span>`)[i];
    thisTabElement.style.setProperty('--b-cssvar-route-tab-width', `${routeSliding_groupStyles[groupKey].width}px`);
    thisTabElement.style.setProperty('--b-cssvar-route-tab-index', `${i}`);
    for (let j = 0; j < itemQuantity[groupKey]; j++) {
      const thisItemElement = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_items_track'), `.css_route_group_item`)[j];
      const thisThreadBoxElement = elementQuerySelectorAll(elementQuerySelector(elementQuerySelectorAll(Field, `.css_route_groups .css_route_group`)[i], '.css_route_group_threads_track'), `.css_route_group_thread_box`)[j];
      const thisItem = groupedItems[groupKey][j];
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

async function refreshRoute(): Promise<object> {
  var refresh_interval_setting = getSettingOptionValue('refresh_interval') as SettingSelectOptionRefreshIntervalValue;
  routeRefreshTimer_dynamic = refresh_interval_setting.dynamic
  routeRefreshTimer_baseInterval = refresh_interval_setting.baseInterval;
  routeRefreshTimer_refreshing = true;
  routeRefreshTimer_currentRequestID = generateIdentifier('r');
  documentQuerySelector('.css_route_update_timer').setAttribute('refreshing', 'true');
  var integration = await integrateRoute(currentRouteIDSet_RouteID, currentRouteIDSet_PathAttributeId, routeRefreshTimer_currentRequestID);
  var Field = documentQuerySelector('.css_route_field');
  updateRouteField(Field, integration, false);
  routeRefreshTimer_lastUpdate = new Date().getTime();
  if (routeRefreshTimer_dynamic) {
    var updateRate = await getUpdateRate();
    routeRefreshTimer_nextUpdate = Math.max(new Date().getTime() + routeRefreshTimer_minInterval, integration.dataUpdateTime + routeRefreshTimer_baseInterval / updateRate);
  } else {
    routeRefreshTimer_nextUpdate = new Date().getTime() + routeRefreshTimer_baseInterval;
  }
  routeRefreshTimer_dynamicInterval = Math.max(routeRefreshTimer_minInterval, routeRefreshTimer_nextUpdate - new Date().getTime());
  routeRefreshTimer_refreshing = false;
  documentQuerySelector('.css_route_update_timer').setAttribute('refreshing', 'false');
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
        promptMessage(`（路線）發生網路錯誤，將在${routeRefreshTimer_retryInterval / 1000}秒後重試。`, 'error');
        routeRefreshTimer_timer = setTimeout(function () {
          streamRoute();
        }, routeRefreshTimer_retryInterval);
      } else {
        routeRefreshTimer_streamStarted = false;
      }
    });
}

export function openRoute(RouteID: number, PathAttributeId: Array<number>): void {
  pushPageHistory('Route');
  logRecentView('route', RouteID);
  currentRouteIDSet_RouteID = RouteID;
  currentRouteIDSet_PathAttributeId = PathAttributeId;
  routeSliding_initialIndex = 0;
  var Field = documentQuerySelector('.css_route_field');
  Field.setAttribute('displayed', 'true');
  elementQuerySelector(Field, '.css_route_groups').scrollLeft = 0;
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
  closePreviousPage();
}

export function closeRoute(): void {
  // revokePageHistory('Route');
  var Field = documentQuerySelector('.css_route_field');
  Field.setAttribute('displayed', 'false');
  routeRefreshTimer_streaming = false;
  openPreviousPage();
}

export function switchRoute(RouteID: number, PathAttributeId: Array<number>) {
  routeRefreshTimer_streaming = false;
  openRoute(RouteID, PathAttributeId);
}

export function stretchRouteItemBody(itemElementID: string, threadBoxElementID: string): void {
  const itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_route_group_items_track .css_route_group_item#${itemElementID}`);
  const threadBoxElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group .css_route_group_tracks .css_route_group_threads_track .css_route_group_thread_box#${threadBoxElementID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
    threadBoxElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
    threadBoxElement.setAttribute('stretched', true);
  }
}

export function switchRouteBodyTab(itemID: string, tabCode: number): void {
  const itemElement = documentQuerySelector(`.css_route_field .css_route_groups .css_route_group_item#${itemID}`);
  const buttons = elementQuerySelector(itemElement, '.css_route_group_item_buttons');
  const button = elementQuerySelectorAll(buttons, '.css_route_group_item_button[highlighted="true"][type="tab"]');
  for (const t of button) {
    t.setAttribute('highlighted', 'false');
  }
  elementQuerySelector(buttons, `.css_route_group_item_button[code="${tabCode}"]`).setAttribute('highlighted', 'true');
  switch (tabCode) {
    case 0:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'flase');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      break;
    case 1:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'true');
      break;
    case 2:
      elementQuerySelector(itemElement, '.css_route_group_item_buses').setAttribute('displayed', 'false');
      elementQuerySelector(itemElement, '.css_route_group_item_overlapping_routes').setAttribute('displayed', 'true');
      elementQuerySelector(itemElement, '.css_route_group_item_bus_arrival_times').setAttribute('displayed', 'false');
      break;
    default:
      break;
  }
}

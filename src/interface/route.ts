import { integrateRoute } from '../data/apis/index.ts';
import { icons } from './icons/index.ts';
var md5 = require('md5');

var currentRouteField = {};
var routeSliding = {
  currentGroup: 0,
  targetGroup: 0,
  groupQuantity: 0,
  groupStyles: {},
  scrollLog: [],
  fieldWidth: 0,
  fieldHeight: 0
};

function getTextWidth(text, font) {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function updateRouteCSS(groupQuantity: number, percentage: number, width: number): void {
  document.querySelector(`style#route_style`).innerHTML = `:root{--b-route-group-quantity:${groupQuantity};--b-route-tab-percentage:${percentage};--b-route-tab-width:${width}px;}`;
}

export function initializeRouteSliding() {
  var element = document.querySelector('.route_groups');
  function calculateStandardDeviation(arr) {
    // Step 1: Calculate the mean
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    // Step 2: Calculate the squared difference between each element and the mean
    const squaredDifferences = arr.map((val) => Math.pow(val - mean, 2));
    // Step 3: Find the mean of those squared differences
    const meanOfSquaredDifferences = squaredDifferences.reduce((acc, val) => acc + val, 0) / arr.length;
    // Step 4: Take the square root of that mean
    const standardDeviation = Math.sqrt(meanOfSquaredDifferences);
    return standardDeviation;
  }

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
      target_group = routeSliding.currentGroup + 1;
    } else {
      target_group = routeSliding.currentGroup - 1;
    }
    var current_size = routeSliding.groupStyles[`g_${routeSliding.currentGroup}`];
    var target_size = routeSliding.groupStyles[`g_${target_group}`];
    var line_width = current_size.width + (target_size.width - current_size.width) * Math.abs(slidingGroupIndex - routeSliding.currentGroup);
    updateRouteCSS(routeSliding.groupQuantity, slidingGroupIndex, line_width);
  });
}

function generateElementOfItem(item: object, skeletonScreen: boolean): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('item');
  element.id = identifier;
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.setAttribute('stretched', false);
  element.innerHTML = `<div class="head"><div class="status" code="${skeletonScreen ? -1 : item.status.code}">${skeletonScreen ? '' : item.status.text}</div><div class="name">${skeletonScreen ? '' : item.name}</div><div class="stretch" onclick="bus.route.stretchItemBody('${identifier}')">${icons.expand}</div></div><div class="body"><div class="tabs"><div class="tab" selected="true">經過此站的公車</div><div class="tab" selected="false">經過此站的路線</div></div><div class="buses" displayed="true"></div><div class="overlapping_routes" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

function setUpRouteFieldSkeletonScreen(Field: HTMLElement) {
  const FieldRect = Field.getBoundingClientRect();
  const FieldWidth = FieldRect.width;
  const FieldHeight = FieldRect.height;
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
        sequence: j,
        location: {
          latitude: null,
          longitude: null
        }
      });
    }
  }
  updateRouteField(
    Field,
    {
      groupedItems: groupedItems,
      groupQuantity: defaultGroupQuantity,
      itemQuantity: defaultItemQuantity,
      RouteName: '',
      RouteEndPoints: {
        RouteDeparture: '',
        RouteDestination: ''
      }
    },
    true
  );
}

export function updateRouteField(Field: HTMLElement, formattedRoute: object, skeletonScreen: boolean) {
  const FieldRect = Field.getBoundingClientRect();
  const FieldWidth = FieldRect.width;
  const FieldHeight = FieldRect.height;

  var groupQuantity = formattedRoute.groupQuantity;
  var itemQuantity = formattedRoute.itemQuantity;
  var groupedItems = formattedRoute.groupedItems;

  routeSliding.groupQuantity = groupQuantity;
  routeSliding.fieldWidth = FieldWidth;
  routeSliding.fieldHeight = FieldHeight;

  for (var i = 0; i < groupQuantity; i++) {
    routeSliding.groupStyles[`g_${i}`] = {
      width: getTextWidth([formattedRoute.RouteEndPoints.RouteDestination, formattedRoute.RouteEndPoints.RouteDeparture, ''].map(e=> `往${e}`)[i], `23px "Noto Sans", sans-serif`)
    };
  }

  var currentGroupSeatQuantity = Field.querySelectorAll(`.route_field .route_grouped_items`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    updateRouteCSS(routeSliding.groupQuantity, routeSliding.currentGroup, routeSliding.groupStyles[`g_${routeSliding.currentGroup}`].width);
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity + o;
        currentRouteField[`g_${groupIndex}`] = [];
        var thisElement = document.createElement('div');
        thisElement.classList.add('route_grouped_items');
        thisElement.setAttribute('group', currentGroupSeatQuantity + o);
        var tabElement = document.createElement('div');
        thisElement.classList.add('route_group_tab');
        Field.querySelector(`.route_field .route_groups`).appendChild(thisElement);
        Field.querySelector(`.route_field .route_head .route_group_tabs`).appendChild(tabElement);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity - 1 - o;
        delete currentRouteField[`g_${groupIndex}`];
        Field.querySelectorAll(`.route_field .route_groups .route_grouped_items`)[groupIndex].remove();
        Field.querySelectorAll(`.route_field .route_head .route_group_tabs`)[groupIndex].remove();
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = Field.querySelectorAll(`.route_field .route_groups .route_grouped_items[group="${i}"] .item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem({}, true);
          currentRouteField[groupKey].push(thisElement);
          Field.querySelector(`.route_field .route_groups .route_grouped_items[group="${i}"]`).appendChild(thisElement.element);
        }
      } else {
        currentRouteField[groupKey] = currentRouteField[groupKey].slice(Math.abs(capacity));
        for (var o = 0; o < Math.abs(capacity); o++) {
          Field.querySelectorAll(`.route_field .route_groups .route_grouped_items[group="${i}"] .item`)[o].remove();
        }
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var thisTabElement = Field.querySelectorAll(`.route_field .route_head .route_group_tabs .route_group_tab`)[i];
    thisTabElement.innerText = [formattedRoute.RouteEndPoints.RouteDestination, formattedRoute.RouteEndPoints.RouteDeparture, ''].map(e=> `往${e}`)[i];
    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisElement = Field.querySelectorAll(`.route_field .route_groups .route_grouped_items[group="${i}"] .item`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      var thisItem = groupedItems[groupKey][j];
      thisElement.querySelector('.status').setAttribute('code', thisItem.status.code);
      thisElement.querySelector('.status').innerText = thisItem.status.text;
      thisElement.querySelector('.name').innerText = thisItem.name;
      thisElement.querySelector('.buses').innerHTML = thisItem.buses === null ? '目前沒有公車' : thisItem.buses.map((bus) => `<div class="bus" on-this-route="${bus.onThisRoute}"><div class="bus_title"><div class="car_icon">${icons.bus}</div><div class="car_number">${bus.carNumber}</div></div><div class="car_attributes"><div class="car_route">路線：${bus.RouteName}</div><div class="car_status">狀態：${bus.status.text}</div><div class="car_type">類型：${bus.type}</div></div></div>`).join('');
    }
  }
}

export async function formatRoute(RouteID: number, PathAttributeId: number) {
  function formatEstimateTime(EstimateTime: string, mode: number = 1) {
    function formatTime(time: number, mode: number) {
      if (mode === 0) {
        return `${time}秒`;
      }
      if (mode === 1) {
        var minutes = String((time - (time % 60)) / 60);
        var seconds = String(time % 60);
        return [minutes, seconds].map((u) => u.padStart(2, '0')).join(':');
      }
      if (mode === 2) {
        var minutes = String(Math.floor(time / 60));
        return `${minutes}分`;
      }
      return '--';
    }
    var time = parseInt(EstimateTime);
    if (time === -3) {
      return { code: 6, text: '末班駛離' };
    }
    if (time === -4) {
      return { code: 5, text: '今日停駛' };
    }
    if (time === -2) {
      return { code: 4, text: '交通管制' };
    }
    if (time === -1) {
      return { code: 3, text: '未發車' };
    }

    if (0 <= time && time <= 10) {
      return { code: 2, text: '進站中' };
    }

    if (10 < time && time <= 90) {
      return { code: 2, text: formatTime(time, mode) };
    }
    if (90 < time && time <= 180) {
      return { code: 1, text: formatTime(time, mode) };
    }
    if (180 < time && time <= 250) {
      return { code: 0.5, text: formatTime(time, mode) };
    }
    if (250 < time) {
      return { code: 0, text: formatTime(time, mode) };
    }
  }
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
  var integration = await integrateRoute(RouteID, PathAttributeId);
  var groupedItems = {};
  for (var item of integration.items) {
    var formattedItem = {};
    formattedItem.name = item.hasOwnProperty('_Stop') ? item._Stop.nameZh : null;
    formattedItem.status = formatEstimateTime(item.EstimateTime);
    formattedItem.buses = item.hasOwnProperty('_BusEvent') ? formatBusEvent(item._BusEvent) : null;
    formattedItem.sequence = item.hasOwnProperty('_Stop') ? item._Stop.seqNo : -1;
    formattedItem.location = {
      latitude: item.hasOwnProperty('_Stop') ? item._Stop.latitude : null,
      longitude: item.hasOwnProperty('_Stop') ? item._Stop.longitude : null
    };
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
  return {
    groupedItems,
    groupQuantity,
    itemQuantity,
    RouteName,
    RouteEndPoints
  };
}

export async function refreshRoute(RouteID: number, PathAttributeId: number): string {
  var Field = document.querySelector('.route_field');
  var formattedRoute = await formatRoute(RouteID, PathAttributeId);
  updateRouteField(Field, formattedRoute, false);
  return 'Successfully refreshed the route.';
}

export function openRoute(RouteID: number, PathAttributeId: number) {
  var Field = document.querySelector('.route_field');
  setUpRouteFieldSkeletonScreen(Field);
  refreshRoute(RouteID, PathAttributeId)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
  setInterval(function () {
    refreshRoute(RouteID, PathAttributeId)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 2 * 1000 * 10);
}

export function stretchItemBody(itemID: string): void {
  var itemElement = document.querySelector(`.route_field .route_groups .item#${itemID}`);
  if (itemElement.getAttribute('stretched') === 'true') {
    itemElement.setAttribute('stretched', false);
  } else {
    itemElement.setAttribute('stretched', true);
  }
}

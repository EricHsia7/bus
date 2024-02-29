import { integrateRoute } from '../data/apis/index.ts';
import { icons } from './icons/index.ts';
var md5 = require('md5');

var currentRouteField = {};

function generateElementOfItem(item: object, skeletonScreen: boolean): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('item');
  element.id = identifier;
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.innerHTML = `
  <div class="status" code="${skeletonScreen ? -1 : item.status.code}">${skeletonScreen ? '' : item.status.text}</div>
  <div class="name">${skeletonScreen ? '' : item.name}</div>
  <div class="bus" is-there="${item.bus === null ? 'false' : 'true'}">${skeletonScreen ? '' : icons.bus}</div>
  `;
  return {
    element: element,
    id: identifier
  };
}
/*
function setUpRouteField(Field: HTMLElement) {
  const FieldRect = element.getBoundingClientRect();
  const FieldWidth = FieldRect.width;
  const FieldHeight = FieldRect.height;
  var defaultItemQuantity = { g_0: Math.floor(FieldHeight / 50) + 5, g_1: Math.floor(FieldHeight / 50) + 5 };
  var defaultGroupQuantity = 2;
  var elements = {};
  for (var i = 0; i < defaultGroupQuantity; i++) {
    var groupKey = `g_${i}`;
    elements[groupKey] = [];
    for (var j = 0; j < defaultItemQuantity[groupKey]; j++) {
      var thisElement = generateElementOfItem({}, true);
      elements[groupKey].push(thisElement);
    }
  }
  currentRouteField = elements;
}
*/

export function updateRouteField(Field: HTMLElement, formattedRoute: object, skeletonScreen: boolean) {
  const FieldRect = Field.getBoundingClientRect();
  const FieldWidth = FieldRect.width;
  const FieldHeight = FieldRect.height;
  var groupQuantity = 0
  var itemQuantity = 0
  var groupedItems = {}
  if (skeletonScreen) {
    var quantity = Math.floor(FieldHeight / 50) + 5
    groupQuantity = 2
    itemQuantity = { g_0: quantity, g_1: quantity }
    groupedItems = { g_0: [], g_1: [] }
  }
  else {
    groupQuantity = formattedRoute.groupQuantity;
    itemQuantity = formattedRoute.itemQuantity;
    groupedItems = formattedRoute.groupedItems;
  }
  var currentGroupSeatQuantity = Field.querySelectorAll(`.route_field .route_grouped_items`).length;
  if (!(groupQuantity === currentGroupSeatQuantity)) {
    var capacity = currentGroupSeatQuantity - groupQuantity;
    console.log('group', capacity)
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity + o;
        currentRouteField[`g_${groupIndex}`] = [];
        var thisElement = document.createElement('div');
        thisElement.classList.add('route_grouped_items');
        thisElement.setAttribute('group', currentGroupSeatQuantity + o);
        Field.querySelector(`.route_groups`).appendChild(thisElement);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var groupIndex = currentGroupSeatQuantity - 1 - o;
        delete currentRouteField[`g_${groupIndex}`];
        Field.querySelectorAll(`.route_groups .route_grouped_items`)[groupIndex].remove();
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    var currentItemSeatQuantity = Field.querySelectorAll(`.route_groups .route_grouped_items[group="${i}"] .item`).length;
    if (!(itemQuantity[groupKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[groupKey];
      console.log('item', capacity)
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem({}, true);
          currentRouteField[groupKey].push(thisElement);
          Field.querySelector(`.route_groups .route_grouped_items[group="${i}"]`).appendChild(thisElement.element);
        }
      } else {
        currentRouteField[groupKey] = currentRouteField[groupKey].slice(Math.abs(capacity));
        for (var o = 0; o < Math.abs(capacity); o++) {
          Field.querySelectorAll(`.route_groups .route_grouped_items[group="${i}"] .item`)[o].remove();
        }
      }
    }
  }

  for (var i = 0; i < groupQuantity; i++) {
    var groupKey = `g_${i}`;
    for (var j = 0; j < itemQuantity[groupKey]; j++) {
      var thisElement = Field.querySelectorAll(`.route_grouped_items[group="${i}"] .item`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      if (!skeletonScreen) {
        var thisItem = groupedItems[groupKey][j];
        thisElement.querySelector('.status').setAttribute('code', thisItem.status.code);
        thisElement.querySelector('.status').innerText = thisItem.status.text;
        thisElement.querySelector('.name').innerText = thisItem.name;
        thisElement.querySelector('.bus').setAttribute('is-there', thisItem.bus === null ? 'false' : 'true');
        thisElement.querySelector('.bus').innerHTML = thisItem.bus === null ? '' : icons.bus;
      }
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
    if (time <= 180) {
      if (time <= 100) {
        if (time <= 10) {
          return { code: 2, text: '進站中' };
        } else {
          return { code: 2, text: formatTime(time, mode) };
        }
      } else {
        return { code: 1, text: formatTime(time, mode) };
      }
    } else {
      return { code: 0, text: formatTime(time, mode) };
    }
  }
  var integration = await integrateRoute(RouteID, PathAttributeId);
  var groupedItems = {};
  for (var item of integration.items) {
    var formattedItem = {};
    formattedItem.name = item.hasOwnProperty('_Stop') ? item._Stop.nameZh : null;
    formattedItem.status = formatEstimateTime(item.EstimateTime);
    formattedItem.bus = item.hasOwnProperty('_BusEvent') ? item._BusEvent : null;
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

export async function displayRoute(RouteID: number, PathAttributeId: number): string {
  var Field = document.querySelector('.route_field');
  updateRouteField(Field, {}, true);
  var formattedRoute = await formatRoute(RouteID, PathAttributeId);
  console.log(formattedRoute);
  updateRouteField(Field, formattedRoute, false);
  return 'Successfully displayed the route.';
}

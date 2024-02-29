import { integrateRoute } from '../data/index.ts';

function setUpRouteField(Field: HTMLElement) {}

export async function formatRoute(RouteID: number, PathAttributeId: number) {
  function formatEstimateTime(EstimateTime: string, mode: number = 1) {
function formatTime(time: number, mode: number) {
if (mode === 0) {
      return `${time}秒`;
    }
    if (mode === 1) {
      var minutes = String((time - (time % 60)) / 60);
      var seconds = String(time % 60);
      return [minutes.padStart(2, '0'), ':', seconds.padStart(2, '0')];
    }
    if (mode === 2) {
      var minutes = String(Math.floor(time / 60));
      return `${minutes}分`;
    }
return 'Invaild mode'
}
    var time = parseInt(EstimateTime);
if (time === -3) {
      return { code: 6, text: '末班駛離' }
    }
    if (time === -4) {
      return { code: 5, text: '今日停駛' }
    }
    if (time === -2) {
      return { code: 4, text: '交通管制' }
    }
    if (time === -1) {
      return { code: 3, text: '未發車' }
    }
    if (time <= 180) {
      if (t <= 100) {
          if (t <= 10) {
            return { code: 2, text: '進站中' }
          }
          else {
            return { code: 2, text: formatTime(time,mode)}
          }
        }
      else {
        return { code: 1, text: formatTime(time,mode) }
      }
    }
    else {
      return { code: 0, text: formatTime(time,mode)}
    }
  }
  var integration = await integrateRoute(RouteID, PathAttributeId);
  var groupedItems = {};
  for (var item of integration.items) {
    var formattedItem = {};
    formattedItem.name = item.hasOwnProperty('_Stop') ? item._Stop.nameZh : 'No name to display';
    formattedItem.status = formatEstimateTime(item.EstimateTime);
    formattedItem.bus = item.hasOwnProperty('_BusEvent') ? item._BusEvent : null;
    formattedItem.sequence = item.hasOwnProperty('_Stop') ? item._Stop.seqNo : -1;
    formattedItem.location = {
      latitude: item.hasOwnProperty('_Stop') ? item._Stop.latitude : null,
      longitude: item.hasOwnProperty('_Stop') ? item._Stop.longitude : null
    };
    var group = item.hasOwnProperty('_Stop') ? `g_${item._Stop.goBack}` : 'g_0';
    groupedItems[group] = formattedItem;
  }
}

export function displayRoute(RouteID: number, PathAttributeId: number) {}

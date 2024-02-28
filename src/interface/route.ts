import { integrateRoute } from '../data/index.ts';

function setUpRouteField(Field: HTMLElement) {}

export async function formatRoute(Field: HTMLElement, RouteID: number, PathAttributeId: number) {
  function formatEstimateTime(EstimateTime: string, mode: number = 1) {
    var time = parseInt(EstimateTime);
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
  }
  var integration = await integrateRoute(RouteID, PathAttributeId);
  var groupedItems = {};
  for (var item of integration.items) {
    var formattedItem = {};
    formattedItem.name = item.hasOwnProperty('_Stop') ? item._Stop.nameZh : 'No name to display';
    formattedItem.time = formatEstimateTime(item.EstimateTime);
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

import { getBusData } from './apis/getBusData.ts';
import { getEstimateTime } from './apis/getEstimateTime.ts';
import { getStop } from './apis/getStop.ts';
import { getBusEvent } from './apis/getBusEvent.ts';
import { getRoute } from './apis/getRoute.ts';

function processStop(Stop: object): object {
  var result = {};
  for (var item of Stop) {
    result['stop_' + item.Id] = item;
  }
  return result;
}

function processBusEvent(BusEvent: object, RouteID: number, PathAttributeId: [number]): object {
  var result = {};
  for (var item of BusEvent) {
    var thisRouteID = parseInt(item.RouteID);
    if (thisRouteID === RouteID || PathAttributeId.indexOf(String(thisRouteID)) > -1 || thisRouteID === RouteID * 10) {
      result['stop_' + item.StopID] = item;
    }
  }
  return result;
}

function processEstimateTime(EstimateTime: object, Stop: object, BusEvent:object,RouteID: number, PathAttributeId: [number]): [] {
  var result = [];
  for (var item of EstimateTime) {
    var thisRouteID = parseInt(item.RouteID);
    if (thisRouteID === RouteID || PathAttributeId.indexOf(String(thisRouteID)) > -1 || thisRouteID === RouteID * 10) {
      if (Stop.hasOwnProperty('stop_' + item.StopID)) {
        item['_Stop'] = Stop['stop_' + item.StopID];
      }
      if(BusEvent.hasOwnProperty('stop_' + item.StopID)) {
        item['_BusEvent'] = BusEvent['stop_' + item.StopID];
      }
      result.push(item);
    }
  }

  result = result.sort(function (a, b) {
    var c = 0;
    var d = 0;
    if (a.hasOwnProperty('_Stop')) {
      c = a._Stop.seqNo;
    }
    if (b.hasOwnProperty('_Stop')) {
      d = b._Stop.seqNo;
    }
    return c - d;
  });
  return result;
}

export async function integrateRoute(RouteID: number, PathAttributeId: [number]) {
  var Route = await getRoute();
  var Stop = await getStop();
  var EstimateTime = await getEstimateTime();
  var BusData = await getBusData();
  var BusEvent = await getBusEvent();
  var processedBusEvent = processBusEvent(BusEvent, RouteID, PathAttributeId);
  var processedEstimateTime = processEstimateTime(EstimateTime, processStop(Stop), RouteID, PathAttributeId);
  return processedEstimateTime;
}

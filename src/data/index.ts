import { getBusData } from './apis/getBusData.ts';
import { getEstimateTime } from './apis/getEstimateTime.ts';
import { getStop } from './apis/getEstimateTime.ts';

function processStop(Stop: object): object {
  var result = {};
  for (var item of Stop) {
    result['stop_' + item.Id] = item;
  }
  return result;
}

function processEstimateTime(EstimateTime: object, Stop: object, RouteID: number, PathAttributeId: number) {
  var result = [];
  for (var item of EstimateTime) {
    var thisRouteID = parseInt(item.RouteID);
    if (thisRouteID === RouteID || PathAttributeId.indexOf(String(thisRouteID)) > -1 || thisRouteID === RouteID * 10) {
      result.push(item);
    }
  }

  result = result.sort(function (a, b) {
    var c = 0;
    var d = 0;
    if (Stop.hasOwnProperty('stop_' + a.StopID)) {
      c = Stop['stop_' + a.StopID].seqNo;
    }
    if (Stop.hasOwnProperty('stop_' + b.StopID)) {
      d = Stop['stop_' + b.StopID].seqNo;
    }
    return c - d;
  });
  return result;
}

export async function getRoute(RouteID: number, PathAttributeId: number) {
  var Stop = await getStop();
  var EstimateTime = await getEstimateTime();
  var BusData = await getBusData();
  var processedEstimateTime = processEstimateTime(EstimateTime, processStop(Stop), RouteID, PathAttributeId);
  return processedEstimateTime;
}

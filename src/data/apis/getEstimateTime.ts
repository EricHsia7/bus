import { getAPIURL } from './getURL';
import { fetchData, setDataUpdateTime } from './loader';

interface EstimateTimeItem {
  RouteID: number;
  StopID: number;
  EstimateTime: string | '-1' | '-2' | '-3' | '-4'; // x (>=0): remaining time to wait measured in seconds, -1: no departed bus, -2: skip stopping (due to traffic moderation), -3: the next bus will not come until tomorrow, -4: not in operation
  GoBack: '0' | '1' | '2'; // 0: go, 1: back, 2: unknown
}

export type EstimateTime = Array<EstimateTimeItem>;

export async function getEstimateTime(requestID: string): Promise<EstimateTime> {
  var apis = [
    [0, 4],
    [1, 4]
  ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api.url, requestID, `getEstimateTime_${api.e[0]}`);
    result = result.concat(data.BusInfo);
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

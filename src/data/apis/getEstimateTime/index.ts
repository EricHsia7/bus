import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataUpdateTime } from '../loader';

export interface EstimateTimeItem {
  RouteID: number;
  StopID: number;
  EstimateTime: string | '-1' | '-2' | '-3' | '-4'; // x (>=0): remaining time to wait measured in seconds, -1: no departed bus, -2: skip stopping (due to traffic moderation), -3: the next bus will not come until tomorrow, -4: not in operation
  GoBack: '0' | '1' | '2'; // 0: go, 1: back, 2: unknown
}

export type EstimateTime = Array<EstimateTimeItem>;

export async function getEstimateTime(requestID: string): Promise<EstimateTime> {
  const apis = [
    [0, 4],
    [1, 4]
  ];
  const result = [];
  for (const api of apis) {
    const url = getAPIURL(api[0], api[1]);
    const data = await fetchData(url, requestID, `getEstimateTime_${api[0]}`, 'json');
    for (let i = 0, l = data.BusInfo.length; i < l; i += 64) {
      Array.prototype.push.apply(result, data.BusInfo.slice(i, i + 64));
    }
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

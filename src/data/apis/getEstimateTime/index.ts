import { Progress } from '../../../tools/progress';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface EstimateTimeItem {
  RouteID: number;
  StopID: number;
  /**
   * @EstimateTime
   * x >= 0: remaining time to wait measured in seconds
   *
   * x = -1: no departed bus
   *
   * x = -2: skip stopping (due to traffic moderation)
   *
   * x = -3: the next bus will not come until tomorrow
   *
   * x = -4: not in operation
   * 
   * EstimateTime should be parsed as an integer and x = parseInt(EstimateTime, 10).
   */
  EstimateTime: string | '-1' | '-2' | '-3' | '-4';
  /**
   * @GoBack 0: go | 1: back | 2: unknown
   */
  GoBack: '0' | '1' | '2';
}

export type EstimateTime = Array<EstimateTimeItem>;

export async function getEstimateTime(progress: Progress): Promise<EstimateTime> {
  const apis = [
    [0, 4],
    [1, 4]
  ];
  const result = [];
  const decoder = new TextDecoder();
  for (const api of apis) {
    const url = getAPIURL(api[0], api[1]);
    const sourceId = progress.listen();
    const inflatedData = await fetchInflate(url, function (message) {
      progress.update(sourceId, message.loaded, message.total);
    });
    const data = JSON.parse(decoder.decode(inflatedData));
    for (let i = 0, l = data.BusInfo.length; i < l; i++) {
      result.push(data.BusInfo[i] as EstimateTimeItem);
    }
    progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
  }
  return result;
}

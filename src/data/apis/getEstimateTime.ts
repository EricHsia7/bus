import { getAPIURL } from './getURL.ts';
import { fetchData } from './loader.ts';

export async function getEstimateTime(requestID: string): [] {
  var apis = [
    [0, 4],
    [1, 4]
  ].map((e) => getAPIURL(e[0], e[1]));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api, requestID, 'getEstimateTime');
    result = result.concat(data.BusInfo);
  }
  return result;
}

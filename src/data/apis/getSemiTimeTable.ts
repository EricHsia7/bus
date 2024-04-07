import { getAPIURL } from './getURL.ts';
import { fetchData, setDataUpdateTime } from './loader.ts';

export async function getSemiTimeTable(requestID: string): [] {
  var apis = [
    [0, 12],
    [1, 12]
  ].map((e) => getAPIURL(e[0], e[1], 8 * 60 * 60 * 1000));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api, requestID, 'getSemiTimeTable');
    result = result.concat(data.BusInfo);
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

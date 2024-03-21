import { getAPIURL } from './getURL.ts';
import { fetchData, setDataUpdateTime } from './loader.ts';

export async function getBusEvent(requestID: string): [] {
  var apis = [
    [0, 1],
    [1, 1]
  ].map((e) => getAPIURL(e[0], e[1]));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api, requestID, 'getBusEvent');
    result = result.concat(data.BusInfo);
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

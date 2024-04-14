import { getAPIURL } from './getURL.ts';
import { fetchData, setDataUpdateTime } from './loader.ts';

export async function getBusEvent(requestID: string): [] {
  var apis = [
    [0, 1],
    [1, 1]
  ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api.url, requestID, `getBusEvent_${api.e[0]}`);
    result = result.concat(data.BusInfo);
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

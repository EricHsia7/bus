import { getAPIURL } from './getURL.ts';
import { fetchData, setDataUpdateTime } from './loader.ts';

export async function getProvider(requestID: string): [] {
  var apis = [
    [0, 9],
    [1, 9]
  ].map((e) => getAPIURL(e[0], e[1], 8 * 60 * 60 * 1000));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api, requestID, 'getProvider');
    result = result.concat(data.BusInfo);
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

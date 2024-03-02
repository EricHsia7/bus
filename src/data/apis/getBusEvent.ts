import { getAPIURL } from './getURL.ts';
import { fetchData } from './loader.ts';

export async function getBusEvent(): [] {
  var apis = [
    [0, 1],
    [1, 1]
  ].map((e) => getAPIURL(e[0], e[1]));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api);
    result = result.concat(data.BusInfo);
  }
  return result;
}

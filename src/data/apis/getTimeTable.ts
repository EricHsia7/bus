import { getAPIURL } from './getURL.ts';
import { fetchData } from './loader.ts';

export async function getTimeTable(): [] {
  var apis = [
    [0, 9],
    [1, 9]
  ].map((e) => getAPIURL(e[0], e[1], 8 * 60 * 60 * 1000));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api);
    result = result.concat(data.BusInfo);
  }
  return result;
}

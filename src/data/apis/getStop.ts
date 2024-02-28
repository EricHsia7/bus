import { getAPIURL } from './getURL.ts';
import { fetchData } from './loader.ts';

export async function getStop() {
  var apis = [
    [0, 11],
    [1, 11]
  ].map((e) => getAPIURL(e[0], e[1], 8 * 60 * 60 * 1000));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api);
    result = result.concat(data.BusInfo);
  }
  return result;
}

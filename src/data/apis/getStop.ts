import { getAPIURL } from './getURL.ts';
import { fetchData, setDataReceivingProgress } from './loader.ts';
const localforage = require('localforage');

export async function getStop(requestID: string): object {
  async function getData() {
    var apis = [
      [0, 11],
      [1, 11]
    ].map((e) => getAPIURL(e[0], e[1], 60 * 60 * 1000));
    var result = [];
    for (var api of apis) {
      var data = await fetchData(api, requestID, 'getStop');
      result = result.concat(data.BusInfo);
    }
    return result;
  }

  var cache_time = 60 * 60 * 24 * 7 * 1000;
  var cache_key = 'bus_stop_cache';
  var cached_time = await localforage.getItem(`${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    await localforage.setItem(`${cache_key}_timestamp`, new Date().getTime());
    await localforage.setItem(`${cache_key}`, JSON.stringify({ data: result }));
    return result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      await localforage.setItem(`${cache_key}_timestamp`, new Date().getTime());
      await localforage.setItem(`${cache_key}`, JSON.stringify({ data: result }));
      return result;
    } else {
      var cache = await localforage.getItem(`${cache_key}`);
      return JSON.parse(cache).data;
    }
  }
}

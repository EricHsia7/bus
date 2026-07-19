import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface BusShapeItem {
  UniRouteId: string;

  /**
   * RouteID
   */
  RouteID: number;

  /**
   * PathAttributeId
   */
  SubRouteID: -1 | number;

  /**
   * coordinates
   * @example "LINESTRING (lon1 lat1, lon2 lat2, ...)"
   */
  wkt: string;

  /**
   * a timestamp representing the update time
   * @example "YYYY-MM-DD hh:mm:ss"
   */
  utime: string;

  /**
   * 0: go
   * 1: back
   * 2: unknown
   */
  GoBack: number;
}

export type BusShape = Array<BusShapeItem>;

let BusShapeMemoryCache_available: boolean = false;
let BusShapeMemoryCache_data: BusShape = [];
let BusShapeMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 14 * 1000;
const cacheKey = 'bus_bus_shape_cache';

export async function getBusShape(progress: Progress): Promise<BusShape> {
  async function getData() {
    const apis = [
      [0, 16],
      [1, 16]
    ];
    const result: BusShape = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData)) as BusShape;
      for (let i = 0, l = data.length; i < l; i++) {
        result.push(data[i]);
      }
    }
    return result;
  }

  const now = new Date().getTime();

  if (BusShapeMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) BusShapeMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      BusShapeMemoryCache_data = JSON.parse(cache);
      BusShapeMemoryCache_available = true;
    }
  }

  if (BusShapeMemoryCache_available && now - BusShapeMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return BusShapeMemoryCache_data;
  }

  const result = await getData();
  BusShapeMemoryCache_data = result;
  BusShapeMemoryCache_available = true;
  BusShapeMemoryCache_timestamp = now;
  await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
  await lfSetItem(0, cacheKey, JSON.stringify(result));
  return result;
}

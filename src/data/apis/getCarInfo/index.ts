import { Progress } from '../../../tools/progress';
import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface CarInfoItem {
  /**
   * numeric identifier of the object (BusId ≠ BusID)
   */
  BusId: number;

  BusNId: string;

  /**
   * CarNumber = BusID = vehicle registration number
   */
  CarNum: string;

  /**
   * - 0: normal bus (一般)
   * - 1: low-floor bus (低底盤)
   * - 2: disability-friendly bus (大復康巴士)
   * - 3: dog-friendly bus (狗狗友善專車)
   */
  CarType: '0' | '1' | '2' | '3';

  IboxId: number;

  StationId: number;

  PathAttributeId: number;

  BuildPeriod: string;

  Ctime: string;
}

export type CarInfo = Array<CarInfoItem>;

export interface SimplifiedCarInfoItem {
  /**
   * numeric identifier of the object (BusId ≠ BusID)
   */
  BusId: CarInfoItem['BusId'];

  /**
   * CarNumber = BusID = vehicle registration number
   */
  CarNum: CarInfoItem['CarNum'];

  /**
   * - 0: normal bus (一般)
   * - 1: low-floor bus (低底盤)
   * - 2: disability-friendly bus (大復康巴士)
   * - 3: dog-friendly bus (狗狗友善專車)
   */
  CarType: CarInfoItem['CarType'];

  PathAttributeId: CarInfoItem['PathAttributeId'];
}

export type SimplifiedCarInfo = { [key: string]: SimplifiedCarInfoItem };

let RawCarInfoMemoryCache_available: boolean = false;
let RawCarInfoMemoryCache_data: CarInfo = [];
let RawCarInfoMemoryCache_timestamp: number = -1;

let SimplifiedCarInfoMemoryCache_available: boolean = false;
let SimplifiedCarInfoMemoryCache_data: SimplifiedCarInfo = {};
let SimplifiedCarInfoMemoryCache_timestamp: number = -1;

const cacheTimeToLive = 60 * 60 * 24 * 30 * 1000;

async function simplifyCarInfo(CarInfo: CarInfo): Promise<SimplifiedCarInfo> {
  const worker = new Worker(new URL('./simplifyCarInfo-worker.ts', import.meta.url));

  // Wrap worker communication in a promise
  const result = (await new Promise((resolve, reject) => {
    worker.onmessage = function (e) {
      resolve(e.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    };

    worker.onerror = function (e) {
      reject(e.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    };

    worker.postMessage(CarInfo); // Send data to the worker
  })) as SimplifiedCarInfo;

  return result;
}

export async function getCarInfo(progress: Progress, simplified: boolean = false): Promise<CarInfo | SimplifiedCarInfo> {
  async function getData(): Promise<CarInfo> {
    const apis = [
      [0, 2],
      [1, 2]
    ];
    const result = [];
    const decoder = new TextDecoder();
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const sourceId = progress.listen();
      const inflatedData = await fetchInflate(url, function (message) {
        progress.update(sourceId, message.loaded, message.total);
      });
      const data = JSON.parse(decoder.decode(inflatedData));
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i] as CarInfoItem);
      }
      progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
    }
    return result;
  }

  const cacheType = simplified ? 'simplified' : 'raw';
  const cacheKey = `bus_${cacheType}_car_info_cache`;
  const now = new Date().getTime();

  if (simplified && SimplifiedCarInfoMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) SimplifiedCarInfoMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      SimplifiedCarInfoMemoryCache_data = JSON.parse(cache);
      SimplifiedCarInfoMemoryCache_available = true;
    }
  }

  if (!simplified && RawCarInfoMemoryCache_timestamp === -1) {
    const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
    if (cacheTimestamp) RawCarInfoMemoryCache_timestamp = parseInt(cacheTimestamp, 10);
    const cache = await lfGetItem(0, cacheKey);
    if (cache) {
      RawCarInfoMemoryCache_data = JSON.parse(cache);
      RawCarInfoMemoryCache_available = true;
    }
  }

  if (simplified && SimplifiedCarInfoMemoryCache_available && now - SimplifiedCarInfoMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return SimplifiedCarInfoMemoryCache_data;
  }

  if (!simplified && RawCarInfoMemoryCache_available && now - RawCarInfoMemoryCache_timestamp <= cacheTimeToLive) {
    progress.update(progress.listen(), 1, 1);
    progress.update(progress.listen(), 1, 1);
    return RawCarInfoMemoryCache_data;
  }

  if (simplified) {
    const result = await getData();
    const simplifiedResult = await simplifyCarInfo(result);
    SimplifiedCarInfoMemoryCache_data = simplifiedResult;
    SimplifiedCarInfoMemoryCache_available = true;
    SimplifiedCarInfoMemoryCache_timestamp = now;
    await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
    await lfSetItem(0, cacheKey, JSON.stringify(simplifiedResult));
    return simplifiedResult;
  } else {
    const result = await getData();
    RawCarInfoMemoryCache_data = result;
    RawCarInfoMemoryCache_available = true;
    RawCarInfoMemoryCache_timestamp = now;
    await lfSetItem(0, `${cacheKey}_timestamp`, now.toString());
    await lfSetItem(0, cacheKey, JSON.stringify(result));
    return result;
  }
}

import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';
import { lfSetItem, lfGetItem } from '../../storage/index';

export interface CarInfoItem {
  BusId: number; // BusId ≠ BusID
  BusNId: string;
  CarNum: string; // CarNumber = BusID = vehicle registration number
  CarType: '0' | '1' | '2' | '3'; // 0: normal bus (一般), 1: low-floor bus (低底盤), 2: disability-friendly bus (大復康巴士), 3: dog-friendly bus (狗狗友善專車)
  IboxId: number;
  StationId: number;
  PathAttributeId: number;
  BuildPeriod: string;
  Ctime: string;
}

export type CarInfo = Array<CarInfoItem>;

export interface SimplifiedCarInfoItem {
  BusId: CarInfoItem['BusId'];
  CarNum: CarInfoItem['CarNum'];
  CarType: CarInfoItem['CarType'];
  PathAttributeId: CarInfoItem['PathAttributeId'];
}

export type SimplifiedCarInfo = { [key: string]: SimplifiedCarInfoItem };

let CarInfoAPIVariableCache: object = {
  raw: {
    data: [],
    available: false
  },
  simplified: {
    data: {},
    available: false
  }
};

async function simplifyCarInfo(CarInfo: CarInfo): Promise<SimplifiedCarInfo> {
  const worker = new Worker(new URL('./simplifyCarInfo-worker.ts', import.meta.url));

  // Wrap worker communication in a promise
  const result = await new Promise((resolve, reject) => {
    worker.onmessage = function (e) {
      resolve(e.data); // Resolve the promise with the worker's result
      worker.terminate(); // Terminate the worker when done
    };

    worker.onerror = function (e) {
      reject(e.message); // Reject the promise on error
      worker.terminate(); // Terminate the worker if an error occurs
    };

    worker.postMessage(CarInfo); // Send data to the worker
  });

  return result;
}

export async function getCarInfo(requestID: string, simplified: boolean = false): Promise<CarInfo | SimplifiedCarInfo> {
  async function getData() {
    const apis = [
      [0, 2],
      [1, 2]
    ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
    let result = [];
    for (const api of apis) {
      const data = await fetchData(api.url, requestID, `getCarInfo_${api.e[0]}`, 'json');
      result = result.concat(data.BusInfo);
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
    }
    return result;
  }

  const cache_type = simplified ? 'simplified' : 'raw';
  const cache_key = `bus_${cache_type}_car_info_v6_cache`;
  const cache_time = 60 * 60 * 24 * 30 * 1000;
  const cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    const result = await getData();
    var final_result;
    if (simplified) {
      final_result = await simplifyCarInfo(result);
    } else {
      final_result = result;
    }
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
    if (!CarInfoAPIVariableCache[cache_type].available) {
      CarInfoAPIVariableCache[cache_type].available = true;
      CarInfoAPIVariableCache[cache_type].data = final_result;
    }
    return final_result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      const result = await getData();
      var final_result;
      if (simplified) {
        final_result = await simplifyCarInfo(result);
      } else {
        final_result = result;
      }
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(final_result));
      return final_result;
    } else {
      if (!CarInfoAPIVariableCache[cache_type].available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        CarInfoAPIVariableCache[cache_type].available = true;
        CarInfoAPIVariableCache[cache_type].data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getCarInfo_0', 0, true);
      setDataReceivingProgress(requestID, 'getCarInfo_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return CarInfoAPIVariableCache[cache_type].data;
    }
  }
}

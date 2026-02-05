import { lfGetItem, lfSetItem } from '../../storage/index';
import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';

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

const CarInfoAPIVariableCache = {
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
    ];
    const result = [];
    for (const api of apis) {
      const url = getAPIURL(api[0], api[1]);
      const data = await fetchData(url, requestID, `getCarInfo_${api[0]}`, 'json');
      for (let i = 0, l = data.BusInfo.length; i < l; i++) {
        result.push(data.BusInfo[i]);
      }
      setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime, -480);
    }
    return result;
  }

  const cacheType = simplified ? 'simplified' : 'raw';
  const cacheKey = `bus_${cacheType}_car_info_cache`;
  const cacheTimeToLive = 60 * 60 * 24 * 30 * 1000;
  const cacheTimestamp = await lfGetItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    let finalResult;
    if (simplified) {
      finalResult = await simplifyCarInfo(result);
    } else {
      finalResult = result;
    }
    await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
    await lfSetItem(0, cacheKey, JSON.stringify(finalResult));
    if (!CarInfoAPIVariableCache[cacheType].available) {
      CarInfoAPIVariableCache[cacheType].available = true;
      CarInfoAPIVariableCache[cacheType].data = finalResult;
    }
    return finalResult;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      let finalResult;
      if (simplified) {
        finalResult = await simplifyCarInfo(result);
      } else {
        finalResult = result;
      }
      await lfSetItem(0, `${cacheKey}_timestamp`, new Date().getTime());
      await lfSetItem(0, cacheKey, JSON.stringify(finalResult));
      return finalResult;
    } else {
      if (!CarInfoAPIVariableCache[cacheType].available) {
        const cache = await lfGetItem(0, cacheKey);
        CarInfoAPIVariableCache[cacheType].available = true;
        CarInfoAPIVariableCache[cacheType].data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getCarInfo_0', 0, true);
      setDataReceivingProgress(requestID, 'getCarInfo_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return CarInfoAPIVariableCache[cacheType].data;
    }
  }
}

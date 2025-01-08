import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataReceivingProgress, setDataUpdateTime } from '../loader';
import { lfSetItem, lfGetItem } from '../../storage/index';

export interface CarInfoItem {
  BusId: number; // BusId ≠ BusID
  BusNId: string;
  CarNum: string; // CarNumber = BusID = vehicle registration number
  CarType: string;
  IboxId: number;
  StationId: number;
  PathAttributeId: number;
  BuildPeriod: string;
  Ctime: string;
}

export type CarInfo = Array<CarInfoItem>;

export interface SimplifiedCarInfoItem {
  id: CarInfoItem['BusId'];
  c: CarInfoItem['CarNum'];
  pid: CarInfoItem['PathAttributeId'];
}

let CarInfoAPIVariableCache_available: boolean = false;
let CarInfoAPIVariableCache_data: object = {};

export async function getCarInfo(requestID: string, simplified: boolean = false): Promise<Provider> {
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

  const cache_time = 60 * 60 * 24 * 30 * 1000;
  const cache_key = 'bus_car_info_cache';
  const cached_time = await lfGetItem(0, `${cache_key}_timestamp`);
  if (cached_time === null) {
    var result = await getData();
    await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
    await lfSetItem(0, `${cache_key}`, JSON.stringify(result));
    if (!CarInfoAPIVariableCache_available) {
      CarInfoAPIVariableCache_available = true;
      CarInfoAPIVariableCache_data = result;
    }
    return result;
  } else {
    if (new Date().getTime() - parseInt(cached_time) > cache_time) {
      var result = await getData();
      await lfSetItem(0, `${cache_key}_timestamp`, new Date().getTime());
      await lfSetItem(0, `${cache_key}`, JSON.stringify(result));
      return result;
    } else {
      if (!CarInfoAPIVariableCache_available) {
        var cache = await lfGetItem(0, `${cache_key}`);
        CarInfoAPIVariableCache_available = true;
        CarInfoAPIVariableCache_data = JSON.parse(cache);
      }
      setDataReceivingProgress(requestID, 'getCarInfo_0', 0, true);
      setDataReceivingProgress(requestID, 'getCarInfo_1', 0, true);
      setDataUpdateTime(requestID, -1);
      return CarInfoAPIVariableCache_data;
    }
  }
}

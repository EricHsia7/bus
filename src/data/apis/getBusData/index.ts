import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataUpdateTime } from '../loader';

export interface BusDataItem {
  ProviderID: number;
  StationID: number;
  BusID: string; // vehicle registration number
  CarType: '0' | '1' | '2' | '3'; // 0: normal bus (一般), 1: low-floor bus (低底盤), 2: disability-friendly bus (大復康巴士), 3: dog-friendly bus (狗狗友善專車)
  CarID: number;
  DutyStatus: '0' | '1' | '2'; // 0: normal, 1: start, 2: end
  BusStatus: '0' | '1' | '2' | '3' | '4' | '5' | '99'; // 0: 正常, 1: 車禍, 2: 故障, 3: 塞車, 4: 緊急求援, 5: 加油, 99: 非營運狀態
  RouteID: string; // number in string
  GoBack: '0' | '1' | '2'; // 0: go, 1: back, 2: unknown
  Longitude: string; // number in string
  Latitude: string; // number in string
  Speed: string; // number in string
  Azimuth: string; // number in string
  DataTime: string; // timestamp
}

export type BusData = Array<BusDataItem>;

export async function getBusData(requestID: string): Promise<BusData> {
  const apis = [
    [0, 0],
    [1, 0]
  ];
  const result = [];
  for (const api of apis) {
    const url = getAPIURL(api[0], api[1]);
    const data = await fetchData(url, requestID, `getBusData_${api[0]}`, 'json');
    for (let i = 0, l = data.BusInfo.length; i < l; i ++) {
      result.push(data.BusInfo[i]);
    }
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime, -480); // UTC+8
  }
  return result;
}

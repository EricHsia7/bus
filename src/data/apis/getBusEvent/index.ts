import { getAPIURL } from '../getAPIURL/index';
import { fetchData, setDataUpdateTime } from '../loader';

export interface BusEventItem {
  StationID: number;
  CarType: '0' | '1' | '2' | '3'; // 0: normal bus (一般), 1: low-floor bus (低底盤), 2: disability-friendly bus (大復康巴士), 3: dog-friendly bus (狗狗友善專車)
  BusID: string; // vehicle registration number
  ProviderID: number;
  CarID: number;
  DutyStatus: '0' | '1' | '2'; // 0: normal, 1: start, 2: end
  BusStatus: '0' | '1' | '2' | '3' | '4' | '5' | '99'; // 0: 正常, 1: 車禍, 2: 故障, 3: 塞車, 4: 緊急求援, 5: 加油, 99: 非營運狀態
  RouteID: string; // PathAttributeId (number in string)
  GoBack: '0' | '1' | '2'; // 0: go, 1: back, 2: unknown
  StopID: string; // number in string
  CarOnStop: '0' | '1'; // 0: leaving/left, 1: coming/came
  DataTime: string; // timestamp
}

export type BusEvent = Array<BusEventItem>;

export async function getBusEvent(requestID: string): Promise<BusEvent> {
  const apis = [
    [0, 1],
    [1, 1]
  ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
  let result = [];
  for (const api of apis) {
    const data = await fetchData(api.url, requestID, `getBusEvent_${api.e[0]}`, 'json');
    result = result.concat(data.BusInfo);
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

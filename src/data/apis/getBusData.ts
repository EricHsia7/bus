import { getAPIURL } from './getURL';
import { fetchData, setDataUpdateTime } from './loader';

interface BusDataItem {
  ProviderID: number;
  StationID: number;
  BusID: string; // vehicle registration number
  CarType: '0' | '1' | '2' | '3'; // 0: normal bus (一般), 1: low-floor bus (低底盤), 2: disability-friendly bus (大復康巴士), 3: dog-friendly bus (狗狗友善專車)  CarID: number;
  DutyStatus: '0' | '1' | '2'; // 0: normal, 1: start, 2: end  BusStatus: string; // number in string
  RouteID: string; // number in string
  GoBack: '0' | '1' | '2'; // 0: go, 1: back, 2: unknown
  Longitude: string; // number in string
  Latitude: string; // number in string
  Speed: string; // number in string
  Azimuth: string; // number in string
  DataTime: string; // timestamp
}

type BusData = Array<BusDataItem>;

export async function getBusData(requestID: string): Promise<BusData> {
  var apis = [
    [0, 0],
    [1, 0]
  ].map((e) => ({ url: getAPIURL(e[0], e[1]), e: e }));
  var result = [];
  for (var api of apis) {
    var data = await fetchData(api.url, requestID, `getBusData_${api.e[0]}`);
    result = result.concat(data.BusInfo);
    setDataUpdateTime(requestID, data.EssentialInfo.UpdateTime);
  }
  return result;
}

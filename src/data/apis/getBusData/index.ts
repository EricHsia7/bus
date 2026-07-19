import { Progress } from '../../../tools/progress';
import { APIData, getAPIURL } from '../getAPIURL/index';
import { fetchInflate } from '../loader';

export interface BusDataItem {
  ProviderID: number;

  StationID: number;

  /**
   * vehicle registration number
   */
  BusID: string;

  /**
   * - 0: normal bus (一般)
   * - 1: low-floor bus (低底盤)
   * - 2: disability-friendly bus (大復康巴士)
   * - 3: dog-friendly bus (狗狗友善專車)
   */
  CarType: '0' | '1' | '2' | '3';

  CarID: number;

  /**
   * - 0: normal
   * - 1: start
   * - 2: end
   */
  DutyStatus: '0' | '1' | '2';

  /**
   * - 0: 正常
   * - 1: 車禍
   * - 2: 故障
   * - 3: 塞車
   * - 4: 緊急求援
   * - 5: 加油
   * - 99: 非營運狀態
   */
  BusStatus: '0' | '1' | '2' | '3' | '4' | '5' | '99';

  /**
   * number in string
   */
  RouteID: string;

  /**
   * - 0: go
   * - 1: back
   * - 2: unknown
   */
  GoBack: '0' | '1' | '2';

  /**
   * number in string
   */
  Longitude: string;

  /**
   * number in string
   */
  Latitude: string;

  /**
   * number in string
   */
  Speed: string;

  /**
   * number in string
   */
  Azimuth: string;

  /**
   * timestamp
   */
  DataTime: string;
}

export type BusData = Array<BusDataItem>;

export async function getBusData(progress: Progress): Promise<BusData> {
  const apis = [
    [0, 0],
    [1, 0]
  ];
  const result: BusData = [];
  const decoder = new TextDecoder();
  for (const api of apis) {
    const url = getAPIURL(api[0], api[1]);
    const sourceId = progress.listen();
    const inflatedData = await fetchInflate(url, function (message) {
      progress.update(sourceId, message.loaded, message.total);
    });
    const data = JSON.parse(decoder.decode(inflatedData)) as APIData<BusData>;
    for (let i = 0, l = data.BusInfo.length; i < l; i++) {
      result.push(data.BusInfo[i]);
    }
    progress.timestamp(data.EssentialInfo.UpdateTime, -480); // UTC+8
  }
  return result;
}

import { getNoCacheParameter } from '../../../tools/index';
import { getSettingOptionValue } from '../../settings/index';

/**
 * Get API URL with no cache parameter (query string).
 * @param city - 0: blobbus -> Taipei City, 2: ntpcbus -> New Taipei City
 * @param api - 0: BusData, 1: BusEvent, 2: CarInfo, 3: CarUnusual, 4: EstimateTime, 5: IStop, 6: IStopPath, 7: OrgPathAttribute, 8: PathDetail, 9: Provider, 10: Route, 11: Stop, 12: SemiTimeTable, 13: StopLocation, 14: TimeTable, 15: BusRouteFareList
 * @param alternative - Whether to use alternative resources
 * @param interval - The interval for no cache parameter
 * @returns The direct link to a gzip file.
 */

export function getAPIURL(city: number, api: number, alternative: boolean = false, interval: number = 5000): string {
  const cities = ['blobbus', 'ntpcbus'];
  // blobbus → Taipei City
  // ntpcbus → New Taipei City
  const buckets = ['BusData', 'BusEvent', 'CarInfo', 'CarUnusual', 'EstimateTime', 'IStop', 'IStopPath', 'OrgPathAttribute', 'PathDetail', 'Provider', 'Route', 'Stop', 'SemiTimeTable', 'StopLocation', 'TimeTable', 'BusRouteFareList'];
  const proxy = getSettingOptionValue('proxy');
  if (alternative) {
    return `http://erichsia7.github.io/bus-alternative-static-apis/${cities[city]}/Get${buckets[api]}.gz?_=${getNoCacheParameter(interval)}`;
  } else {
    if (proxy) {
      return `https://bus-proxy.erichsia7.workers.dev?url=https://tcgbusfs.blob.core.windows.net/${cities[city]}/Get${buckets[api]}.gz&_=${getNoCacheParameter(interval)}`;
    } else {
      return `https://tcgbusfs.blob.core.windows.net/${cities[city]}/Get${buckets[api]}.gz?_=${getNoCacheParameter(interval)}`;
    }
  }
}

export function getMaterialSymbolsAPIURL(interval: number = 5000): string {
  return `https://erichsia7.github.io/material-symbols-list/search-index.gz?_=${getNoCacheParameter(interval)}`;
}

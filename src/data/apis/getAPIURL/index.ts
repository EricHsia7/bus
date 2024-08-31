import { getNoCacheParameter } from '../../../tools/index';

export function getAPIURL(city: number, api: number, interval: number = 5000): string {
  const cities = ['blobbus', 'ntpcbus'];
  //blobbus → Taipei City
  //ntpcbus → New Taipei City
  const buckets = ['BusData', 'BusEvent', 'CarInfo', 'CarUnusual', 'EstimateTime', 'IStop', 'IStopPath', 'OrgPathAttribute', 'PathDetail', 'Provider', 'Route', 'Stop', 'SemiTimeTable', 'StopLocation', 'TimeTable'];
  return `https://tcgbusfs.blob.core.windows.net/${cities[city]}/Get${buckets[api]}.gz?_=${getNoCacheParameter(interval)}`;
}

export function getMaterialSymbolsAPIURL(interval: number = 5000): string {
  return `https://erichsia7.github.io/material-symbols-list/index.gz?_=${getNoCacheParameter(interval)}`;
}

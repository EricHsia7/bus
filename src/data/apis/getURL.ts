export function getAPIURL(city: number, api: number, interval: number = 5000): string {
  function APIURLParameter(interval: number) {
    var t = new Date().getTime();
    var g = (t / interval).toFixed(0) * interval;
    var str = g.toString(36);
    return str;
  }
  const cities = ['blobbus', 'ntpcbus'];
  //blobbus → Taipei City
  //ntpcbus → New Taipei City
  const buckets = ['BusData', 'BusEvent', 'CarInfo', 'CarUnusual', 'EstimateTime', 'IStop', 'IStopPath', 'OrgPathAttribute', 'PathDetail', 'Provider', 'Route', 'Stop', 'SemiTimeTable', 'StopLocation', 'TimeTable'];
  return `https://tcgbusfs.blob.core.windows.net/${cities[city]}/Get${buckets[api]}.gz?_=${APIURLParameter(interval)}`;
}

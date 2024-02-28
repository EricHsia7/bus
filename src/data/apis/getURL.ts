export function getAPIURL(city: Number, api: Number) {
  function api_url_parameter(interval) {
    var t = new Date().getTime();
    var g = (t / interval).toFixed(0) * interval;
    var str = g.toString(36);
    return str;
  }
  const cities = ['blobbus', 'ntpcbus'];
  //blobbus → Taipei City
  //ntpcbus → New Taipei City
  const buckets = ['BusData', 'BusEvent', 'CarInfo', 'CarUnusual', 'EstimateTime', 'IStop', 'IStopPath', 'OrgPathAttribute', 'PathDetail', 'Provider', 'Route', 'Stop', 'SemiTimeTable', 'StopLocation'];
  return `https://tcgbusfs.blob.core.windows.net/${cities[city]}/${bucket[api]}.gz?_=${api_url_parameter(5000)}`;
}

import { CarInfo, SimplifiedCarInfo } from './index';

self.onmessage = function (e) {
  const result = simplifyCarInfo_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function simplifyCarInfo_worker(CarInfo: CarInfo): SimplifiedCarInfo {
  let result: SimplifiedCarInfo = {};
  for (const item of CarInfo) {
    const simplifiedItem = {};
    simplifiedItem.BusId = item.BusId;
    simplifiedItem.CarNum = item.CarNum;
    simplifiedItem.CarType = item.CarType;
    simplifiedItem.PathAttributeId = item.PathAttributeId;
    const busKey = `b_${item.BusId}`;
    if (!result.hasOwnProperty(busKey)) {
      result[busKey] = simplifiedItem;
    }
  }
  return result;
}

import { CarInfo, SimplifiedCarInfo, SimplifiedCarInfoItem } from './index';

self.onmessage = function (e) {
  const result = processWorkerTask(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function processWorkerTask(CarInfo: CarInfo): SimplifiedCarInfo {
  let result: SimplifiedCarInfo = {};
  for (const item of CarInfo) {
    const simplifiedItem: SimplifiedCarInfoItem = {};
    simplifiedItem.BusId = item.BusId;
    simplifiedItem.CarNum = item.CarNum;
    simplifiedItem.CarType = item.CarType;
    simplifiedItem.PathAttributeId = item.PathAttributeId;
    const carKey = `c_${item.BusId}`;
    if (!result.hasOwnProperty(carKey)) {
      result[carKey] = simplifiedItem;
    }
  }
  return result;
}

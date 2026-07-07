/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { hasOwnProperty } from '../../../tools/index';
import { CarInfo, SimplifiedCarInfo, SimplifiedCarInfoItem } from './index';

self.onmessage = function (e) {
  processWorkerTask(e.data);
};

function processWorkerTask(CarInfo: CarInfo): void {
  const result: SimplifiedCarInfo = {};
  for (const item of CarInfo) {
    const simplifiedItem = {} as SimplifiedCarInfoItem;
    simplifiedItem.BusId = item.BusId;
    simplifiedItem.CarNum = item.CarNum;
    simplifiedItem.CarType = item.CarType;
    simplifiedItem.PathAttributeId = item.PathAttributeId;
    const carKey = `c_${item.BusId}`;
    if (!hasOwnProperty(result, carKey)) {
      result[carKey] = simplifiedItem;
    }
  }
  self.postMessage(result); // Send the result back to the main thread
}

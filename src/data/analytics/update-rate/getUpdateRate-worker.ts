/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;
// export {}; // make a script a module if no any export or import

import { UpdateRateWorkerMessageDone, UpdateRateWorkerMessageError, UpdateRateDataGroupArray } from './index';

self.onmessage = function (event: MessageEvent): void {
  const { id, dataGroups } = event.data;
  calculateUpdateRate(id, dataGroups).catch((error: Error) => self.postMessage({ id, type: 'error', error: error.message } as UpdateRateWorkerMessageError));
};

async function calculateUpdateRate(id: number, dataGroups: UpdateRateDataGroupArray) {
  if (dataGroups.length === 0) {
    self.postMessage({ id, type: 'done', result: 0.8 } as UpdateRateWorkerMessageDone);
  } else {
    // Perform the calculation
    let weightedAverage: number = 0;
    let totalCorrelation: number = 0;
    let totalWeight: number = 0;
    for (const dataGroup of dataGroups) {
      if (typeof dataGroup.stats.correlation !== 'number' || isNaN(dataGroup.stats.correlation)) {
        continue;
      }
      const absoluteCorrelation = Math.abs(dataGroup.stats.correlation);
      if (absoluteCorrelation >= 0.5 && absoluteCorrelation <= 1) {
        totalCorrelation += absoluteCorrelation * dataGroup.stats.length;
        totalWeight += dataGroup.stats.length;
      }
    }
    weightedAverage = totalCorrelation / totalWeight;

    const result = isNaN(weightedAverage) || weightedAverage < 0.1 || weightedAverage > 1 ? 0.8 : weightedAverage;

    // Send the result back to the main thread
    self.postMessage({ id, type: 'done', result } as UpdateRateWorkerMessageDone);
  }
}

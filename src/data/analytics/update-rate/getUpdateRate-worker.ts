import { UpdateRateDataGroupArray } from './index';

interface task {
  dataGroups: UpdateRateDataGroupArray;
  taskID: string;
  port: any;
}

const taskQueue: Array<task> = [];
let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];

    port.onmessage = function (event) {
      const [dataGroups, taskID] = event.data;
      taskQueue.push({ dataGroups, taskID, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;

  self.onmessage = function (event) {
    const [dataGroups, taskID] = event.data;
    taskQueue.push({ dataGroups, taskID, port });
    processWorkerTask();
  };
}

function processWorkerTask(): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { dataGroups, taskID, port }: task = taskQueue.shift();

  if (dataGroups.length === 0) {
    port.postMessage([0.8, taskID]);
  } else {
    // Perform the calculation
    let weightedAverage: number = 0;
    let totalCorrelation: number = 0;
    let totalWeight: number = 0;
    for (const dataGroup of dataGroups) {
      if (typeof dataGroup.stats.correlation !== 'number') {
        continue;
      }
      const absoluteCorrelation = Math.abs(dataGroup.stats.correlation);
      if (absoluteCorrelation >= 0.5) {
        totalCorrelation += absoluteCorrelation * dataGroup.stats.length;
        totalWeight += dataGroup.stats.length;
      }
    }
    weightedAverage = totalCorrelation / totalWeight;

    const result = isNaN(weightedAverage) ? 0.8 : weightedAverage;

    // Send the result back to the main thread
    port.postMessage([result, taskID]);
  }
  isProcessing = false;
  processWorkerTask(); // Process next task in queue, if any
}

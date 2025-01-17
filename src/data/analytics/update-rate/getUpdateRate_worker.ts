import { splitDataByDelta } from '../../../tools/array';
import { pearsonCorrelation } from '../../../tools/math';

let taskQueue = [];
let isProcessing = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];

    port.onmessage = function (event) {
      const [collection, taskID] = event.data;
      taskQueue.push({ collection, taskID, port });
      getUpdateRate_worker();
    };
  };
} else {
  const port = self;

  self.onmessage = function (event) {
    const [collection, taskID] = event.data;
    taskQueue.push({ collection, taskID, port });
    getUpdateRate_worker();
  };
}

function getUpdateRate_worker(): number {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { collection, taskID, port } = taskQueue.shift();

  // Perform the calculation
  let weightedAverage: number = 0;
  let totalCorrelation: number = 0;
  let totalWeight: number = 0;
  for (const dataSet of collection) {
    const groups = splitDataByDelta(dataSet);
    for (const group of groups) {
      const firstColumn: Array<number> = group.map((item) => item[0]);
      const secondColumn: Array<number> = group.map((item) => item[1]);
      const correlation: number = pearsonCorrelation(firstColumn, secondColumn);
      if (!(correlation === 0) && Math.abs(correlation) > 0.2 && !isNaN(correlation)) {
        totalCorrelation += correlation * firstColumn.length;
        totalWeight += firstColumn.length;
      }
    }
  }
  weightedAverage = totalCorrelation / totalWeight;
  const result = isNaN(weightedAverage) ? 0.8 : Math.abs(weightedAverage);

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  getUpdateRate_worker(); // Process next task in queue, if any
}

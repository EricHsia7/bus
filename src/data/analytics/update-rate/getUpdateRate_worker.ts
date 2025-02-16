let taskQueue = [];

/*: Array<{
  dataGroups: Array<UpdateRateDataGroup>;
  taskID: string;
  port: any;
}>*/

let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];

    port.onmessage = function (event) {
      const [dataGroups, taskID] = event.data;
      taskQueue.push({ dataGroups, taskID, port });
      getUpdateRate_worker();
    };
  };
} else {
  const port = self;

  self.onmessage = function (event) {
    const [dataGroups, taskID] = event.data;
    taskQueue.push({ dataGroups, taskID, port });
    getUpdateRate_worker();
  };
}

function getUpdateRate_worker(): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { dataGroups, taskID, port } = taskQueue.shift();

  // Perform the calculation
  let weightedAverage: number = 0;
  let totalCorrelation: number = 0;
  let totalWeight: number = 0;
  for (const dataGroup of dataGroups) {
    totalCorrelation += dataGroup.stats.correlation * dataGroup.stats.length;
    totalWeight += dataGroup.stats.length;
  }
  weightedAverage = totalCorrelation / totalWeight;

  const result = isNaN(weightedAverage) ? 0.8 : Math.abs(weightedAverage);

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  getUpdateRate_worker(); // Process next task in queue, if any
}

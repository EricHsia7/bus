import { BusArrivalTimeData } from './index';

interface task {
  data: Array<BusArrivalTimeData>;
  taskID: string;
  port: any;
}

const taskQueue: Array<task> = [];
let isProcessing: boolean = false;

// Setup message handling (works for dedicated or shared workers)
if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const [data, taskID] = event.data;
      taskQueue.push({ data, taskID, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const [data, taskID] = event.data;
    taskQueue.push({ data, taskID, port });
    processWorkerTask();
  };
}

function processWorkerTask(): BusArrivalTimeDataGroupStats {
  if (isProcessing || taskQueue.length === 0) return;
  
  isProcessing = true;
  const { data, taskID, port }: task = taskQueue.shift();

  const statsArray = new Uint32Array(60 * 24); // one day in minutes
  const dataLength = data.length;
  for (let i = dataLength - 1; i >= 0; i--) {
    const item = data[i];
    let time = 0;
    let offset = 0;
    if (item[0] >= 0) {
      time = item[1] + item[0] * 1000;
      offset = 1;
    } else {
      time = item[1];
      offset = 0;
    }
    const date = new Date(time);
    const index = date.getHours() * 60 + date.getMinutes();
    statsArray[index] += offset;
  }
  // Send the complete HTML back to the main thread
  port.postMessage([Array.from(statsArray), taskID]);

  isProcessing = false;
  processWorkerTask(); // Process next task in the queue if any
}

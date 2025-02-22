const { inflate } = require('pako/lib/inflate');

interface task {
  buffer: ArrayBuffer;
  taskID: string;
  port: any;
}

let taskQueue: Array<task> = [];
let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const [buffer, taskID] = event.data;
      taskQueue.push({ buffer, taskID, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const [buffer, taskID] = event.data;
    taskQueue.push({ buffer, taskID, port });
    processWorkerTask();
  };
}

function processWorkerTask(): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { buffer, taskID, port }: task = taskQueue.shift();

  // Perform the inflate operation (using Pako)
  const result = inflate(buffer, { to: 'string' });

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  processWorkerTask(); // Process next task in queue, if any
}

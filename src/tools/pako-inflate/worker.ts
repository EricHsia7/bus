const { inflate } = require('pako');

interface task {
  buffer: ArrayBuffer | null;
  port: any;
}

const taskQueue: Array<task> = [];
let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const buffer = event.data;
      taskQueue.push({ buffer, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const buffer = event.data;
    taskQueue.push({ buffer, port });
    processWorkerTask();
  };
}

function processWorkerTask(): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const task = taskQueue.shift() as task;

  // Perform the inflate operation (using Pako)
  const result = inflate(task.buffer as ArrayBuffer) as Uint8Array;

  // Send the result back to the main thread
  task.port.postMessage(result.buffer, [result.buffer]);

  // Destroy the buffer
  task.buffer = null;

  isProcessing = false;
  processWorkerTask(); // Process next task in queue, if any
}

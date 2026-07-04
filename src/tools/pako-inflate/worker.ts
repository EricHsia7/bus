const { inflate } = require('pako/lib/inflate');

interface task {
  buffer: ArrayBuffer;
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
  const { buffer, port } = taskQueue.shift() as task;

  // Perform the inflate operation (using Pako)
  const result = inflate(buffer) as Uint8Array;

  // Send the result back to the main thread
  port.postMessage(result.buffer, [result.buffer]);

  isProcessing = false;
  processWorkerTask(); // Process next task in queue, if any
}

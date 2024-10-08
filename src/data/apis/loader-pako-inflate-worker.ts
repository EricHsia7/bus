const { inflate } = require('pako/lib/inflate');

const taskQueue = [];
let isProcessing = false;

self.onconnect = function (e) {
  const port = e.ports[0];

  port.onmessage = function (event) {
    const [buffer, taskID] = event.data;
    taskQueue.push({ buffer, taskID, port });
    processQueue();
  };
};

function processQueue() {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { buffer, taskID, port } = taskQueue.shift();

  // Perform the inflate operation (using Pako)
  const result = pakoInflate_worker(buffer);

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  processQueue(); // Process next task in queue, if any
}

function pakoInflate_worker(buffer: ArrayBuffer): string {
  const inflatedData = inflate(buffer, { to: 'string' });
  return inflatedData;
}

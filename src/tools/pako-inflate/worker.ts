const { inflate } = require('pako/lib/inflate');

let taskQueue = [];
let isProcessing = false;

self.onconnect = function (e) {
  const port = e.ports[0];

  port.onmessage = function (event) {
    const [buffer, taskID] = event.data;
    taskQueue.push({ buffer, taskID, port });
    pakoInflate_worker();
  };
};

function pakoInflate_worker() {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { buffer, taskID, port } = taskQueue.shift();

  // Perform the inflate operation (using Pako)
  const result = inflate(buffer, { to: 'string' });

  // Send the result back to the main thread
  port.postMessage([result, taskID]);

  isProcessing = false;
  pakoInflate_worker(); // Process next task in queue, if any
}

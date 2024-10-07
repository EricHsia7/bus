const { inflate } = require('pako/lib/inflate');

let taskQueue = []; // Queue to store tasks
let processing = false; // Flag to check if a task is being processed

self.onmessage = function (e) {
  taskQueue.push(e.data);
  processNextTask(); // Try to process the next task
};

function pakoInflate_worker(buffer: ArrayBuffer): string {
  const inflatedData = inflate(buffer, { to: 'string' }); // Inflate and convert to string using pako
  return inflatedData;
}

function processNextTask() {
  if (processing || taskQueue.length === 0) {
    return; // If already processing or no tasks, exit
  }

  processing = true; // Set the flag to processing
  const task = taskQueue.shift();
  const buffer = task[0]; // Get the next task
  const taskID = task[1];
  const result = pakoInflate_worker(buffer);
  self.postMessage([result, taskID]); // Send the result back to the main thread

  processing = false; // Reset processing flag
  processNextTask(); // Process the next task in the queue
}

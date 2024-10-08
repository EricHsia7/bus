const { inflate } = require('pako/lib/inflate');

let taskQueue = []; // Queue to store tasks
let processing = false; // Flag to check if a task is being processed

self.onmessage = function (e) {
  const task = e.data;
  const [buffer, taskID] = task;
  const result = pakoInflate_worker(buffer);
  this.self.postMessage([result, taskID]);
};

function pakoInflate_worker(buffer: ArrayBuffer): string {
  const inflatedData = inflate(buffer, { to: 'string' }); // Inflate and convert to string using pako
  return inflatedData;
}

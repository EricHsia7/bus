import { generateIdentifier } from '../index';

let pakoInflateWorkerResponses = {};
var port;

// Check if SharedWorker is supported, and fall back to Worker if not
if (typeof SharedWorker !== 'undefined') {
  const pakoInflateSharedWorker = new SharedWorker(new URL('./worker.ts', import.meta.url)); // Reusable shared worker
  port = pakoInflateSharedWorker.port; // Access the port for communication
  port.start(); // Start the port (required by some browsers)
} else {
  const pakoInflateWorker = new Worker(new URL('./worker.ts', import.meta.url)); // Fallback to standard worker
  port = pakoInflateWorker; // Use Worker directly for communication
}

// Handle messages from the worker
port.onmessage = function (e) {
  const [result, taskID] = e.data;
  if (pakoInflateWorkerResponses[taskID]) {
    pakoInflateWorkerResponses[taskID](result); // Resolve the correct promise
    delete pakoInflateWorkerResponses[taskID]; // Clean up the response handler
  }
};

// Handle errors
port.onerror = function (e) {
  console.error(e.message);
};

export async function pakoInflate(buffer: ArrayBuffer): Promise<string> {
  const taskID = generateIdentifier();

  const result = await new Promise((resolve, reject) => {
    pakoInflateWorkerResponses[taskID] = resolve; // Store the resolve function for this taskID

    port.onerror = function (e) {
      reject(e.message);
    };

    port.postMessage([buffer, taskID]); // Send the task to the worker
  });

  return result;
}
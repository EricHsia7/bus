import { generateIdentifier } from '../index';

let pakoInflateSharedWorkerResponses = {};
const pakoInflateSharedWorker = new SharedWorker(new URL('./worker.ts', import.meta.url)); // Reusable shared worker

const port = pakoInflateSharedWorker.port; // Access the port for communication
port.start(); // Start the port (required by some browsers)
port.onmessage = function (e) {
  const [result, taskID] = e.data;
  if (pakoInflateSharedWorkerResponses[taskID]) {
    pakoInflateSharedWorkerResponses[taskID](result); // Resolve the correct promise
    delete pakoInflateSharedWorkerResponses[taskID]; // Clean up the response handler
  }
};

export async function pakoInflate(buffer: ArrayBuffer): Promise<string> {
  const taskID = generateIdentifier('t');

  const result = await new Promise((resolve, reject) => {
    pakoInflateSharedWorkerResponses[taskID] = resolve; // Store the resolve function for this taskID

    port.onerror = function (e) {
      reject(e.message);
    };

    port.postMessage([buffer, taskID]); // Send the task to the worker
  });

  return result;
}

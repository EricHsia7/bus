import { BusArrivalTimeData, BusArrivalTimeDataGroupStats } from '.';

const pakoInflateWorkerCallback: Array<[resolve: Function, reject: Function]> = [];

const supportSharedWorker = typeof SharedWorker !== 'undefined'; // Check if SharedWorker is supported, and fall back to Worker if not

const worker: Worker | SharedWorker = supportSharedWorker ? new SharedWorker(new URL('./getBusArrivalTimeDataStats-worker.ts', import.meta.url)) : new Worker(new URL('./getBusArrivalTimeDataStats-worker.ts', import.meta.url));

if (supportSharedWorker) {
  (worker as SharedWorker).port.start();
  // Access the port for communication
  // Start the port (required by some browsers)

  (worker as SharedWorker).port.onmessage = function (event: MessageEvent) {
    const callback = pakoInflateWorkerCallback.shift();
    if (callback) {
      callback[0](event.data); // Resolve the promise
    }
  };

  (worker as SharedWorker).onerror = function (event: ErrorEvent) {
    const callback = pakoInflateWorkerCallback.shift();
    if (callback) {
      callback[1](event.message); // Reject the promise
    }
  };
} else {
  // Fallback to standard worker
  (worker as Worker).onmessage = function (event: MessageEvent) {
    const callback = pakoInflateWorkerCallback.shift();
    if (callback) {
      callback[0](event.data); // Resolve the promise
    }
  };

  (worker as Worker).onerror = function (event: ErrorEvent) {
    const callback = pakoInflateWorkerCallback.shift();
    if (callback) {
      callback[1](event.message); // Reject the promise
    }
  };
}

export async function getBusArrivalTimeDataStats(data: Array<BusArrivalTimeData>): Promise<BusArrivalTimeDataGroupStats> {
  const result = (await new Promise((resolve, reject) => {
    pakoInflateWorkerCallback.push([resolve, reject]); // Store the callback functions
    if (supportSharedWorker) {
      (worker as SharedWorker).port.postMessage(data); // Send the task to the worker
    } else {
      (worker as Worker).postMessage(data); // Send the task to the worker
    }
  })) as BusArrivalTimeDataGroupStats;

  return result;
}

import { decompressSync } from 'fflate';

interface task {
  data: Uint8Array;
  port: any;
}

const taskQueue: Array<task> = [];
let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (connectEvent: MessageEvent) {
    const port = connectEvent.ports[0];
    port.onmessage = function (messageEvent: MessageEvent) {
      taskQueue.push({ data: messageEvent.data, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (messageEvent: MessageEvent) {
    taskQueue.push({ data: messageEvent.data, port });
    processWorkerTask();
  };
}

function processWorkerTask(): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const { data, port } = taskQueue.shift() as task;

  // Decompress the data
  const result = decompressSync(data);

  // Send the result back to the main thread
  port.postMessage(result, [result.buffer]);

  isProcessing = false;
  processWorkerTask(); // Process next task in queue, if any
}

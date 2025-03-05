const { inflate } = require('pako/lib/inflate');

interface request {
  buffer: ArrayBuffer;
  requestID: object;
  port: any;
}

let requestQueue: Array<request> = [];
let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];
    port.onmessage = function (event) {
      const [buffer, requestID] = event.data;
      requestQueue.push({ buffer, requestID, port });
      processWorkerTask();
    };
  };
} else {
  const port = self;
  self.onmessage = function (event) {
    const [buffer, requestID] = event.data;
    requestQueue.push({ buffer, requestID, port });
    processWorkerTask();
  };
}

function processWorkerTask(): void {
  if (isProcessing || requestQueue.length === 0) return;

  isProcessing = true;
  const { buffer, requestID, port }: request = requestQueue.shift();

  // Perform the inflate operation (using Pako)
  const result = inflate(buffer, { to: 'string' });

  // Send the result back to the main thread
  port.postMessage([result, requestID]);

  isProcessing = false;
  processWorkerTask(); // Process next task in queue, if any
}

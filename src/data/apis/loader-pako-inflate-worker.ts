const { inflate } = require('pako/lib/inflate');

self.onconnect = function (e) {
  const port = e.ports[0]; // Access the port of the connected client

  port.onmessage = function (event) {
    const [buffer, taskID] = event.data;

    // Perform the inflate operation (using Pako)
  const result = pakoInflate_worker(buffer);
    // Send the result back to the main thread
    port.postMessage([result, taskID]);
  };
};

function pakoInflate_worker(buffer: ArrayBuffer): string {
  const inflatedData = inflate(buffer, { to: 'string' }); // Inflate and convert to string using pako
  return inflatedData;
}

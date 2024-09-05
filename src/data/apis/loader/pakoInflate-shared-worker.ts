const { inflate } = require('pako');

self.addEventListener('connect', function (event0) {
  const port = event0.ports[0];

  port.addEventListener('message', function (event1) {
    // Process the task
    const result = pakoInflate_sharedWorker(event1.data);

    // Send result back to the main thread
    port.postMessage(result);

    // Close the port but keep the worker alive
    port.close();
  });
});

function pakoInflate_sharedWorker(buffer: any): string {
  const result = inflate(buffer, { to: 'string' });
  return result;
}

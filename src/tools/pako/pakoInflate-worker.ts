const { inflate } = require('pako');

self.onmessage = function (e) {
  const result = pakoInflate_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function pakoInflate_worker(arrayBuffer: any): string {
  const inflatedData = inflate(arrayBuffer, { to: 'string' }); // Inflate and convert to string using pako
  return inflatedData;
}

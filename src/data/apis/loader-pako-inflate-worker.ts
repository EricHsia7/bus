const { inflate } = require('pako/lib/inflate');

self.onmessage = function (e) {
  const result = pakoInflate_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

function pakoInflate_worker(buffer: ArrayBuffer): string {
  const inflatedData = inflate(buffer, { to: 'string' }); // Inflate and convert to string using pako
  return inflatedData;
}

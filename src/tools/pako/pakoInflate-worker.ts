const { inflate } = require('pako');

self.onmessage = function (e) {
  const result = pakoInflate_worker(e.data);
  self.postMessage(result); // Send the result back to the main thread
};

async function pakoInflate_worker(uint8Array: any): string {
  // Create a blob from the concatenated Uint8Array
  const blob = new Blob([uint8Array]);
  const gzip_blob = new Blob([blob.slice(0, blob.size)], { type: 'application/gzip' });
  const buffer = await gzip_blob.arrayBuffer();
  const inflatedData = inflate(buffer, { to: 'string' }); // Inflate and convert to string using pako
  return inflatedData;
}

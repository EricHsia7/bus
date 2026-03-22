const pakoInflateWorkerResolution = [];
let port;

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
  const result = e.data;
  const resolve = pakoInflateWorkerResolution.shift();
  if (resolve) {
    resolve(result); // Resolve the correct promise
  }
};

// Handle errors
port.onerror = function (e) {
  console.error(e.message);
};

export async function pakoInflate(buffer: ArrayBuffer): Promise<string> {
  const result = await new Promise((resolve, reject) => {
    pakoInflateWorkerResolution.push(resolve); // Store the resolve function

    port.onerror = function (e) {
      reject(e.message);
    };

    port.postMessage(buffer); // Send the task to the worker
  });

  return result;
}

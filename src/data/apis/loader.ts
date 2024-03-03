const pako = require('pako');
var md5 = require('md5');

var dataReceivingProgress = {};
// Define an async function that takes a url as an argument
async function fetchData(url: string, requestID: string): object {
  if (!dataReceivingProgress.hasOwnProperty(requestID)) {
    dataReceivingProgress[requestID] = {};
  }
  // Create a new AbortController instance to abort the fetch request if needed
  const controller = new AbortController();
  // Get the signal property from the controller
  const signal = controller.signal;
  // Set a timeout to abort the request after 3 seconds
  const timeout = setTimeout(() => controller.abort(), 3000);
  // Try to fetch the data from the url using the signal option
  try {
    // Start the fetch request and get the response object
    const response = await fetch(url, { signal });
    // Check if the response is ok
    if (response.ok) {
      // Get the content length from the response headers
      const contentLength = response.headers.get('Content-Length');
      // Create a reader from the response body
      const reader = response.body.getReader();
      // Initialize an array to store the received chunks
      const chunks = [];
      // Initialize a variable to store the total bytes received
      let receivedLength = 0;
      // Loop through the reader until it is done
      while (true) {
        // Read a chunk from the reader
        const { done, value } = await reader.read();
        // If the reader is done, break the loop
        if (done) {
          break;
        }
        // Push the chunk to the array
        chunks.push(value);
        // Update the received length
        receivedLength += value.length;
        // Calculate the progress percentage
        // set the progress to the object
        dataReceivingProgress[requestID][`u_${md5(url)}`] = receivedLength / contentLength;
      }
      // Clear the timeout
      clearTimeout(timeout);
      // Concatenate the chunks into a single Uint8Array
      const data = new Uint8Array(receivedLength);
      let position = 0;
      for (let chunk of chunks) {
        data.set(chunk, position);
        position += chunk.length;
      }
      // Return the data as a resolved promise
      const blob = await response.blob();
      const gzip_blob = new Blob([blob.slice(0, blob.size)], { type: 'application/gzip' });
      const buffer = await gzip_blob.arrayBuffer();
      const inflatedData = pako.inflate(buffer, { to: 'string' }); // Inflate and convert to string
      return JSON.parse(inflatedData);
    } else {
      // Throw an error if the response is not ok
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    // Catch and rethrow any errors
    throw error;
  }
}

export function getDataReceivingProgress(requestID: string): number {
  if (dataReceivingProgress.hasOwnProperty(requestID)) {
    if (typeof dataReceivingProgress[requestID] === 'object') {
      var total = 0;
      var received = 0;
      for (var key in dataReceivingProgress[requestID]) {
        total += 1;
        received += dataReceivingProgress[requestID][key];
      }
      return received / total;
    }
  }
  return 0;
}

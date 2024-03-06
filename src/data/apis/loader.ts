const pako = require('pako');
var md5 = require('md5');

var dataReceivingProgress = {};

export async function fetchData(url: string, requestID: string, urlName: string): object {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const contentLength = response.headers.get('content-length');
  let receivedLength = 0;
  const reader = response.body.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
    receivedLength += value.length;
    setDataReceivingProgress(requestID, urlName, receivedLength / contentLength);
  }

  // Concatenate all the chunks into a single Uint8Array
  const uint8Array = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    uint8Array.set(chunk, position);
    position += chunk.length;
  }

  // Create a blob from the concatenated Uint8Array
  const blob = new Blob([uint8Array]);
  const gzip_blob = new Blob([blob.slice(0, blob.size)], { type: 'application/gzip' });
  const buffer = await gzip_blob.arrayBuffer();
  const inflatedData = pako.inflate(buffer, { to: 'string' }); // Inflate and convert to string
  return JSON.parse(inflatedData);
}

export function getDataReceivingProgress(requestID: string): number {
  if (dataReceivingProgress.hasOwnProperty(requestID)) {
    if (typeof dataReceivingProgress[requestID] === 'object') {
      var total = 0;
      var received = 0;
      for (var key in dataReceivingProgress[requestID]) {
        if (dataReceivingProgress[requestID][key] === false) {
          total += 1;
          received += 1;
        } else {
          total += 1;
          received += dataReceivingProgress[requestID][key];
        }
      }
      return received / total;
    }
  }
  return 0;
}

export function setDataReceivingProgress(requestID: string, urlName: string, progress: number | boolean): void {
  if (!dataReceivingProgress.hasOwnProperty(requestID)) {
    dataReceivingProgress[requestID] = {};
  }
  dataReceivingProgress[requestID][`u_${md5(urlName)}`] = progress;
}

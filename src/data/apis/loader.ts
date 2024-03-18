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
    setDataReceivingProgress(requestID, urlName, receivedLength / contentLength, false);
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
        if (!dataReceivingProgress[requestID][key].expel) {
          total += dataReceivingProgress[requestID][key].total;
          received += Math.max(...dataReceivingProgress[requestID][key].progress);
        }
      }
      return Math.min(Math.max(received / total, 0), 1);
    }
  }
  return 1;
}

export function setDataReceivingProgress(requestID: string, urlName: string, progress: number | boolean, expel: boolean) {
  if (!dataReceivingProgress.hasOwnProperty(requestID)) {
    dataReceivingProgress[requestID] = {};
  }
  var key = `u_${md5(urlName)}`;
  if (dataReceivingProgress[requestID].hasOwnProperty(key)) {
    if (expel) {
      dataReceivingProgress[requestID][key].expel = true;
    } else {
      dataReceivingProgress[requestID][key].expel = false;
      var change = progress - dataReceivingProgress[requestID][key].previous_progress;
      if (change < 0) {
        dataReceivingProgress[requestID][key].total = dataReceivingProgress[requestID][key].total + 1;
      }
      dataReceivingProgress[requestID][key].progress.push(dataReceivingProgress[requestID][key].progress + Math.abs(change));
      dataReceivingProgress[requestID][key].previous_progress = progress;
    }
  } else {
    dataReceivingProgress[requestID][key] = { progress: [progress], total: 1, previous_progress: 0, expel: false };
  }
}

export function deleteDataReceivingProgress(requestID): void {
  if (dataReceivingProgress.hasOwnProperty(requestID)) {
    delete dataReceivingProgress[requestID];
  }
}

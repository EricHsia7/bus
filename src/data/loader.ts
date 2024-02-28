const pako = require('pako');

export async function fetchData(url: string): object {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
  }

  const blob = await response.blob();
  const gzip_blob = new Blob([blob.slice(0, blob.size)], { type: 'application/gzip' });
  const buffer = gzip_blob.arrayBuffer();

  const inflatedData = pako.inflate(buffer, { to: 'string' }); // Inflate and convert to string

  return JSON.parse(inflatedData); // Parse JSON and type it as T
}

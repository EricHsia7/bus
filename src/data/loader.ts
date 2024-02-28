const pako = require('pako');

export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const inflatedData = pako.inflateRaw(buffer, { to: 'string' }); // Inflate and convert to string

  return JSON.parse(inflatedData) as T; // Parse JSON and type it as T
}

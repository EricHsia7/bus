const ErathRadius = 6378137;

export function convertPositionsToDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = ErathRadius * c;
  return d; // measured in meters
}

export function mercatorProjection(longitude: number, latitude: number, scale: number = 1) {
  const meterToPixelRatio = 100 / 300; // 300 meters = 100 pixels → 1 meter = (100 / 300) pixels

  // Convert degrees to radians
  const longitudeRad = (longitude * Math.PI) / 180;
  const latitudeRad = (latitude * Math.PI) / 180;

  // Mercator projection formulas
  const x = ErathRadius * longitudeRad;
  const y = ErathRadius * Math.log(Math.tan(Math.PI / 4 + latitudeRad / 2));

  // Scale based on the ratio (meters to pixels)
  const xPixels = x * meterToPixelRatio * scale;
  const yPixels = y * meterToPixelRatio * scale;

  return { x: xPixels, y: yPixels };
}

export function convertBytes(contentLength: number): string {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;

  while (contentLength >= 1024 && i < units.length - 1) {
    contentLength /= 1024;
    i++;
  }

  return `${contentLength.toFixed(2)} ${units[i]}`;
}

export function convertNumberToLetters(number: number): string {
  let result = '';
  while (number > 0) {
    let remainder = (number - 1) % 26; // Adjust for 1-based indexing
    let letter = String.fromCharCode(remainder + 65); // A=65 in ASCII
    result = letter + result;
    number = Math.floor((number - 1) / 26); // Update number for next iteration
  }
  return result;
}

export function convertWKTToArray(wkt: string): Array<[number, number]> {
  // Extract the part inside the parentheses and split by comma to get the coordinate pairs
  const coordinates = wkt
    .replace('LINESTRING (', '')
    .replace(')', '')
    .split(', ')
    .map((coord) => {
      // For each coordinate pair, split by space and parse as float
      return coord.split(' ').map(parseFloat);
    });
  return coordinates;
}

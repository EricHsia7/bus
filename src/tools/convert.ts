export function convertPositionsToDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6378.137;
  const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1000; // measured in meters
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
      const [lon, lat] = coord.split(' ').map(parseFloat);
      return [lat, lon]; // Return [lat, lon]
    });
  return coordinates;
}

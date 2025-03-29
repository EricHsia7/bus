const { encode } = require('ngeohash');

export function geohashEncode(latitude: number, longitude: number, numberOfChars: number): string {
  return encode(latitude, longitude, numberOfChars);
}

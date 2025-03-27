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

export interface CardinalDirection {
  vector: [number, number];
  name: string;
  symbol: string;
}

export function convertVectorToCardinalDirection(vector: [number, number]): CardinalDirection {
  const unknownVector = [0, 0];
  // cardinal directions
  const NorthVector = [0, 1];
  const EastVector = [1, 0];
  const WestVector = [-1, 0];
  const SouthVector = [0, -1];
  // intercardinal directions
  const NorthEastVector = [Math.SQRT1_2, Math.SQRT1_2]; // 45 degrees
  const SouthEastVector = [Math.SQRT1_2, -Math.SQRT1_2]; // 135 degrees
  const SouthWestVector = [-Math.SQRT1_2, -Math.SQRT1_2]; // 225 degrees
  const NorthWestVector = [-Math.SQRT1_2, Math.SQRT1_2]; // 315 degrees

  const directions: Array<CardinalDirection> = [
    {
      vector: unknownVector,
      name: '未知',
      symbol: '?'
    },
    {
      vector: NorthVector,
      name: '北',
      symbol: '↑'
    },
    {
      vector: EastVector,
      name: '東',
      symbol: '→'
    },
    {
      vector: SouthVector,
      name: '南',
      symbol: '↓'
    },
    {
      vector: WestVector,
      name: '西',
      symbol: '←'
    },
    {
      vector: NorthEastVector,
      name: '東北',
      symbol: '↗'
    },
    {
      vector: SouthEastVector,
      name: '東南',
      symbol: '↘'
    },
    {
      vector: SouthWestVector,
      name: '西南',
      symbol: '↙'
    },
    {
      vector: NorthWestVector,
      name: '西北',
      symbol: '↖'
    }
  ];
  const unitVector = convertToUnitVector(vector);
  let maxDotProduct = -Infinity;
  let bestMatch: CardinalDirection = directions[0];
  for (const direction of directions) {
    const dotProduct = direction.vector[0] * unitVector[0] + direction.vector[1] * unitVector[1];
    if (dotProduct > maxDotProduct) {
      maxDotProduct = dotProduct;
      bestMatch = direction;
    }
  }
  return bestMatch;
}

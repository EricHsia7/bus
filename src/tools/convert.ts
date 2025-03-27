import { MaterialSymbols } from '../interface/icons/material-symbols-type';
import { convertToUnitVector } from './math';

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
  id: number;
  name: string;
  symbol: string;
  icon: MaterialSymbols;
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
      id: -1,
      name: '未知',
      symbol: '?',
      icon: 'explore'
    },
    {
      vector: NorthVector,
      id: 0,
      name: '北',
      symbol: '↑',
      icon: 'north'
    },
    {
      vector: EastVector,
      id: 1,
      name: '東',
      symbol: '→',
      icon: 'east'
    },
    {
      vector: SouthVector,
      id: 2,
      name: '南',
      symbol: '↓',
      icon: 'south'
    },
    {
      vector: WestVector,
      id: 3,
      name: '西',
      symbol: '←',
      icon: 'west'
    },
    {
      vector: NorthEastVector,
      id: 4,
      name: '東北',
      symbol: '↗',
      icon: 'north_east'
    },
    {
      vector: SouthEastVector,
      id: 5,
      name: '東南',
      symbol: '↘',
      icon: 'south_east'
    },
    {
      vector: SouthWestVector,
      id: 6,
      name: '西南',
      symbol: '↙',
      icon: 'south_west'
    },
    {
      vector: NorthWestVector,
      id: 7,
      name: '西北',
      symbol: '↖',
      icon: 'north_west'
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

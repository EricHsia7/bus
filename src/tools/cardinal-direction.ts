import { MaterialSymbols } from '../interface/icons/material-symbols-type';
import { convertToUnitVector } from './math';

export type CardinalDirectionVector = [number, number];

export interface CardinalDirection {
  vector: CardinalDirectionVector;
  id: number;
  name: string;
  symbol: string;
  icon: MaterialSymbols;
}

export const UnknownCardinalDirection: CardinalDirection = {
  vector: [0, 0],
  id: -1,
  name: '未知',
  symbol: '?',
  icon: 'explore'
};

// cardinal directions
export const NorthCardinalDirection: CardinalDirection = {
  vector: [0, 1], // 90 degress
  id: 0,
  name: '北',
  symbol: '↑',
  icon: 'north'
};

export const WestCardinalDirection: CardinalDirection = {
  vector: [1, 0], // 0 degres
  id: 1,
  name: '東',
  symbol: '→',
  icon: 'east'
};

export const SouthCardinalDirection: CardinalDirection = {
  vector: [0, -1], // 270 degress
  id: 2,
  name: '南',
  symbol: '↓',
  icon: 'south'
};

export const EastCardinalDirection: CardinalDirection = {
  vector: [-1, 0], // 180 degress
  id: 3,
  name: '西',
  symbol: '←',
  icon: 'west'
};

// intercardinal directions
const NorthEastCardinalDirection: CardinalDirection = {
  vector: [Math.SQRT1_2, Math.SQRT1_2], // 45 degrees
  id: 4,
  name: '東北',
  symbol: '↗',
  icon: 'north_east'
};

const SouthEastCardinalDirection: CardinalDirection = {
  vector: [Math.SQRT1_2, -Math.SQRT1_2], // 135 degrees
  id: 5,
  name: '東南',
  symbol: '↘',
  icon: 'south_east'
};

export const SouthWestCardinalDirection: CardinalDirection = {
  vector: [-Math.SQRT1_2, -Math.SQRT1_2], // 225 degrees
  id: 6,
  name: '西南',
  symbol: '↙',
  icon: 'south_west'
};

export const NorthWestCardinalDirection: CardinalDirection = {
  vector: [-Math.SQRT1_2, Math.SQRT1_2], // 315 degrees
  id: 7,
  name: '西北',
  symbol: '↖',
  icon: 'north_west'
};

export function getCardinalDirectionFromVector(vector: [number, number]): CardinalDirection {
  const directions: Array<CardinalDirection> = [UnknownCardinalDirection, NorthCardinalDirection, EastCardinalDirection, SouthCardinalDirection, WestCardinalDirection, NorthEastCardinalDirection, SouthEastCardinalDirection, SouthWestCardinalDirection, NorthWestCardinalDirection];
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

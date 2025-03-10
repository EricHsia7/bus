import { convertNumberToLetters } from './convert';
import { convertToUnitVector } from './math';

export function generateLetterLabels(quantity: number): Array<string> {
  let result = [];
  for (let i = 0; i < quantity; i++) {
    result.push(`地點${convertNumberToLetters(i + 1)}`);
  }
  return result;
}

export function generateDirectionLabels(setsOfVectors: Array<Array<[number, number]>>): Array<string> {
  let result = [];
  const unknownVector = [0, 0];
  // cardinal directions
  const NorthVector = [0, 1];
  const EastVector = [1, 0];
  const WestVector = [-1, 0];
  const SouthVector = [0, -1];
  // intercardinal directions
  const NorthEastVector = [Math.sqrt(2) / 2, Math.sqrt(2) / 2]; // 45 degrees
  const SouthEastVector = [Math.sqrt(2) / 2, -Math.sqrt(2) / 2]; // 135 degrees
  const SouthWestVector = [-Math.sqrt(2) / 2, -Math.sqrt(2) / 2]; // 225 degrees
  const NorthWestVector = [-Math.sqrt(2) / 2, Math.sqrt(2) / 2]; // 315 degrees

  const directions = [
    {
      vector: unknownVector,
      label: '未知'
    },
    {
      vector: NorthVector,
      label: '北'
    },
    {
      vector: EastVector,
      label: '東'
    },
    {
      vector: SouthVector,
      label: '南'
    },
    {
      vector: WestVector,
      label: '西'
    },
    {
      vector: NorthEastVector,
      label: '東北'
    },
    {
      vector: SouthEastVector,
      label: '東南'
    },
    {
      vector: SouthWestVector,
      label: '西南'
    },
    {
      vector: NorthWestVector,
      label: '西北'
    }
  ];

  for (const vectorSet of setsOfVectors) {
    let x = 0;
    let y = 0;
    for (const vector of vectorSet) {
      x += vector[0];
      y += vector[1];
    }
    const meanVector = convertToUnitVector([x, y]);
    let result2 = [];
    for (const direction of directions) {
      const dotProduct = direction.vector[0] * meanVector[0] + direction.vector[1] * meanVector[1];
      result2.push({ label: direction.label, dotProduct: dotProduct });
    }
    result2 = result2.sort(function (a, b) {
      return b.dotProduct - a.dotProduct;
    });
    const bestMatch = result2[0];
    result.push(`向${bestMatch.label}行駛`);
  }
  return result;
}

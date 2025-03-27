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
  const NorthEastVector = [Math.SQRT1_2, Math.SQRT1_2]; // 45 degrees
  const SouthEastVector = [Math.SQRT1_2, -Math.SQRT1_2]; // 135 degrees
  const SouthWestVector = [-Math.SQRT1_2, -Math.SQRT1_2]; // 225 degrees
  const NorthWestVector = [-Math.SQRT1_2, Math.SQRT1_2]; // 315 degrees

  const directions = [
    {
      vector: unknownVector,
      label: '未知方向'
    },
    {
      vector: NorthVector,
      label: '向北↑'
    },
    {
      vector: EastVector,
      label: '向東→'
    },
    {
      vector: SouthVector,
      label: '向南↓'
    },
    {
      vector: WestVector,
      label: '向西←'
    },
    {
      vector: NorthEastVector,
      label: '向東北↗'
    },
    {
      vector: SouthEastVector,
      label: '向東南↘'
    },
    {
      vector: SouthWestVector,
      label: '向西南↙'
    },
    {
      vector: NorthWestVector,
      label: '向西北↖'
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
    let maxDotProduct = -Infinity;
    let bestMatch: string = '';
    for (const direction of directions) {
      const dotProduct = direction.vector[0] * meanVector[0] + direction.vector[1] * meanVector[1];
      if (dotProduct > maxDotProduct) {
        maxDotProduct = dotProduct;
        bestMatch = direction.label;
      }
    }
    result.push(bestMatch);
  }
  return result;
}

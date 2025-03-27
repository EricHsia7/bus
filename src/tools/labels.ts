import { convertNumberToLetters, convertVectorToCardinalDirection } from './convert';
import { convertToUnitVector } from './math';

export function generateLetterLabels(quantity: number): Array<string> {
  let result = [];
  for (let i = 0; i < quantity; i++) {
    result.push(`地點${convertNumberToLetters(i + 1)}`);
  }
  return result;
}

export function generateDirectionLabels(setsOfVectors: Array<Array<[number, number]>>): Array<string> {
  const result: Array<string> = [];
  for (const vectorSet of setsOfVectors) {
    let x: number = 0;
    let y: number = 0;
    for (const vector of vectorSet) {
      x += vector[0];
      y += vector[1];
    }
    const meanVector = convertToUnitVector([x, y]);
    const cardinalDirection = convertVectorToCardinalDirection(meanVector);
    result.push(`向${cardinalDirection.name}${cardinalDirection.symbol}`);
  }
  return result;
}

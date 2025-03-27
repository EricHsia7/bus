import { CardinalDirection, convertNumberToLetters } from './convert';

export function generateLetterLabels(quantity: number): Array<string> {
  let result: Array<string> = [];
  for (let i = 0; i < quantity; i++) {
    result.push(`地點${convertNumberToLetters(i + 1)}`);
  }
  return result;
}

export function generateDirectionLabels(cardinalDirections: Array<CardinalDirection>): Array<string> {
  const result: Array<string> = [];
  for (const cardinalDirection of cardinalDirections) {
    result.push(`向${cardinalDirection.name}${cardinalDirection.symbol}`);
  }
  return result;
}

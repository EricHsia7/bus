import { CardinalDirection, EastCardinalDirection, NorthCardinalDirection, NorthEastCardinalDirection, NorthWestCardinalDirection, SouthCardinalDirection, SouthEastCardinalDirection, SouthWestCardinalDirection, UnknownCardinalDirection, WestCardinalDirection } from './cardinal-direction';
import { convertNumberToLetters } from './convert';

export function generateLetterLabels(quantity: number): Array<string> {
  let result: Array<string> = [];
  for (let i = 0; i < quantity; i++) {
    result.push(`地點${convertNumberToLetters(i + 1)}`);
  }
  return result;
}

export function generateDirectionLabels(cardinalDirectionSets: Array<Array<CardinalDirection>>): Array<string> {
  const result: Array<string> = [];
  const directions: Array<CardinalDirection> = [UnknownCardinalDirection, NorthCardinalDirection, WestCardinalDirection, SouthCardinalDirection, EastCardinalDirection, NorthEastCardinalDirection, SouthEastCardinalDirection, SouthWestCardinalDirection, NorthWestCardinalDirection];
  for (const cardinalDirectionSet of cardinalDirectionSets) {
    const count = new Uint16Array(9);
    for (const cardinalDirection of cardinalDirectionSet) {
      count[cardinalDirection.id]++;
    }
    const texts = [];
    for (let i = 0; i < 9; i++) {
      if (count[i] > 0) {
        texts.push(`${count[i]}${directions[i].name}`);
      }
    }
    result.push(texts.join(''));
  }
  return result;
}

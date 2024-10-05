import { generateIdentifier, getIntersection, getUnicodes } from '../../tools/index';
import { getMaterialSymbols } from '../apis/getMaterialSymbols/index';

let searchIndex = {};
let searchList = [];
let readyToSearch = false;

export async function prepareForMaterialSymbolsSearch(): void {
  const requestID: string = generateIdentifier('r');
  const materialSymbols = await getMaterialSymbols(requestID);

  let index = {};
  // let list = materialSymbols;

  let i = 0;
  for (const materialSymbol of materialSymbols) {
    const unicodes = getUnicodes(materialSymbol, true);
    for (const unicode of unicodes) {
      const key = `u_${unicode}`;
      if (!index.hasOwnProperty(key)) {
        index[key] = [];
      }
      index[key].push(i);
    }
    i += 1;
  }
  searchList = materialSymbols;
  searchIndex = index;
  readyToSearch = true;
}

function calculateMaterialSymbolsSearchResultScore(queryUnicodes: Array<number>, resultUnicodes: Array<number>): number {
  let score = 0;
  let previousMatched = false;
  let i = 0;
  for (const unicode of resultUnicodes) {
    const indexOfUnicode = queryUnicodes.indexOf(unicode, i);
    score += indexOfUnicode - i + 1;
    if (previousMatched) {
      score *= 10;
    }
    if (indexOfUnicode > -1) {
      previousMatched = true;
    } else {
      previousMatched = false;
    }
    i += 1;
  }
  return score;
}

export function searchForMaterialSymbols(query: string, limit: number): Array<string> {
  if (!readyToSearch) {
    return [];
  }
  const queryUnicodes = getUnicodes(query, true);
  const asIsQueryUnicodes = getUnicodes(query, false);
  let unicodeGroups = [];
  for (const unicode of queryUnicodes) {
    const key = `u_${unicode}`;
    if (searchIndex.hasOwnProperty(key)) {
      unicodeGroups.push(searchIndex[key]);
    }
  }
  unicodeGroups.sort(function (a, b) {
    return a.length - b.length;
  });
  const unicodeGroupsLength1 = unicodeGroups.length - 1;
  let intersection = [];
  if (unicodeGroupsLength1 === 0) {
    intersection = unicodeGroups[0];
  }
  if (unicodeGroupsLength1 > 0) {
    for (let i = 0; i < unicodeGroupsLength1; i++) {
      const currentGroup = unicodeGroups[i];
      const nextGroup = unicodeGroups[i + 1];
      if (i === 0) {
        intersection = getIntersection(currentGroup, nextGroup);
      } else {
        intersection = getIntersection(intersection, nextGroup);
      }
    }
  }
  let result = [];
  let quantity = 0;
  for (const j of intersection) {
    let thisItem = searchList[j];
    if (quantity < limit) {
      const score = calculateMaterialSymbolsSearchResultScore(asIsQueryUnicodes, getUnicodes(thisItem.n, false));
      result.push({
        item: thisItem,
        score: score
      });
    } else {
      break;
    }
  }
  result.sort(function (a, b) {
    return b.score - a.score;
  });
  return result;
}

import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { getIntersection } from '../../tools/array';
import { generateIdentifier, hasOwnProperty } from '../../tools/index';
import { levenshtein } from '../../tools/levenshtein';
import { getMaterialSymbolsSearchIndex } from '../apis/getMaterialSymbolsSearchIndex/index';
import { deleteDataReceivingProgress } from '../apis/loader';

let searchStructure = {};
let readyToSearch = false;

export async function prepareForMaterialSymbolsSearch() {
  if (readyToSearch) return;

  const requestID = generateIdentifier();
  const materialSymbolsSearchIndex = await getMaterialSymbolsSearchIndex(requestID);
  deleteDataReceivingProgress(requestID);

  const dictionary = materialSymbolsSearchIndex.dictionary.split(',');
  const symbols = materialSymbolsSearchIndex.symbols;
  const names = [];
  const wordToSymbols: { [wordIndexKey: string]: Array<number> } = {};

  let nameIndex = 0;
  for (const symbol in symbols) {
    // Create list of symbol names
    names.push(symbol);
    // Build wordIndex → nameIndex mapping
    for (const wordIndex of symbols[symbol]) {
      const wordIndexKey = `w${wordIndex}`;
      if (!hasOwnProperty(wordToSymbols, wordIndexKey)) {
        wordToSymbols[wordIndexKey] = [];
      }
      wordToSymbols[wordIndexKey].push(nameIndex);
    }
    nameIndex++;
  }

  searchStructure = { dictionary, names, wordToSymbols };
  readyToSearch = true;
}

export function searchForMaterialSymbols(query: string, searchFrom: number = 0, skipBroadTerms: boolean = true, broadThreshold: number = 0.3): Array<{ item: MaterialSymbols; score: number }> {
  if (!readyToSearch) return [];

  const { dictionary, names, wordToSymbols } = searchStructure;
  const broadLength = Math.round(names.length * broadThreshold);

  // Split query
  const queryWords = Array.from(
    new Set(
      query
        .trim()
        .toLowerCase()
        .split(/[\s_-]+/)
    )
  );
  const queryWordsLength = queryWords.length;

  // Fuzzy match words to dictionary indices
  const minDistances = new Uint8Array(queryWordsLength);
  const matchedWordIndexes = new Int16Array(queryWordsLength).fill(-1);

  for (let j = searchFrom; j < queryWordsLength; j++) {
    minDistances[j] = queryWords[j].length;
    for (let i = 0, l = dictionary.length; i < l; i++) {
      const distance = levenshtein(queryWords[j], dictionary[i]);
      if (distance <= minDistances[j]) {
        minDistances[j] = distance;
        matchedWordIndexes[j] = i;
      }
    }
  }

  // Pair words with symbols
  let indexArrays = [];
  for (let i = queryWordsLength - 1; i >= 0; i--) {
    if (matchedWordIndexes[i] < 0) continue;
    const arr = wordToSymbols[`w${matchedWordIndexes[i]}`] || [];
    if (skipBroadTerms && arr.length > broadLength) continue;
    indexArrays.push(arr);
  }

  const indexArraysLength = indexArrays.length;

  if (indexArraysLength === 0) return [];

  // Sort by length (shortest → longest)
  indexArrays.sort((a, b) => a.length - b.length);

  // Intersect
  let candidates = indexArrays[0];
  for (let i = 1; i < indexArraysLength; i++) {
    candidates = getIntersection(candidates, indexArrays[i]);
  }

  // Rank candidates
  const scored = [];
  for (let i = 0, l = candidates.length; i < l; i++) {
    let score = 0;
    for (let j = queryWordsLength - 1; j >= 0; j--) {
      if (matchedWordIndexes[j] < 0) continue;
      const symbolWordIndexes = wordToSymbols[`w${matchedWordIndexes[j]}`] || [];
      if (symbolWordIndexes.indexOf(candidates[i]) > -1) {
        score -= j; // earlier query words = higher weight
      }
    }
    scored.push({
      item: names[candidates[i]],
      score: score
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

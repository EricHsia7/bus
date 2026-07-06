import { MaterialSymbol } from '../../interface/icons/material-symbols-type';
import { hasOwnProperty } from '../../tools';
import { Progress, ProgressCallback } from '../../tools/progress';
import { getMaterialSymbolsDescription } from '../apis/getMaterialSymbolsDescription';
import { getMaterialSymbolsList } from '../apis/getMaterialSymbolsList';
import { getMaterialSymbolsSearchIndex } from '../apis/getMaterialSymbolsSearchIndex';
import { getMaterialSymbolsSimilarity } from '../apis/getMaterialSymbolsSimilarity';

export interface IntegratedMaterialSymbolsItem {
  name: MaterialSymbol;
  description: string | false;
  related: Array<MaterialSymbol>;
  keywords: Array<string>;
}

export type IntegratedMaterialSymbols = Array<IntegratedMaterialSymbolsItem>;

export async function integrateMaterialSymbols(progressCallback: ProgressCallback): Promise<IntegratedMaterialSymbols> {
  const progress = new Progress(4, progressCallback);
  const [searchIndex, description, similarity, list] = await Promise.all([getMaterialSymbolsSearchIndex(progress), getMaterialSymbolsDescription(progress), getMaterialSymbolsSimilarity(progress), getMaterialSymbolsList(progress)]);

  const searchIndexDictionary = searchIndex.dictionary.split(',');
  const similaritySymbols = similarity.symbols.split(',');
  const result: IntegratedMaterialSymbols = [];

  for (const symbol of list) {
    const integratedItem = {} as IntegratedMaterialSymbolsItem;

    integratedItem.name = symbol;

    // collect data from searchIndex
    if (hasOwnProperty(searchIndex.symbols, symbol)) {
      const keywordIndices = searchIndex.symbols[symbol];
      const keywordIndicesLength = keywordIndices.length;
      const keywords = new Array(keywordIndicesLength).fill('');
      for (let i = 0; i < keywordIndicesLength; i++) {
        keywords.splice(i, 1, searchIndexDictionary[keywordIndices[i]]);
      }
      integratedItem.keywords = keywords;
    } else {
      integratedItem.keywords = [];
    }

    // collect data from description
    if (hasOwnProperty(description, symbol)) {
      integratedItem.description = description[symbol];
    } else {
      integratedItem.description = false;
    }

    // collect data from similarity
    if (hasOwnProperty(similarity.similarity, symbol)) {
      const symbolIndices = similarity.similarity[symbol];
      const symbolIndicesLength = symbolIndices.length;
      const relatedSymbols = new Array(symbolIndicesLength).fill('');
      for (let i = 0; i < symbolIndicesLength; i++) {
        relatedSymbols.splice(i, 1, similaritySymbols[symbolIndices[i]]);
      }
      integratedItem.related = relatedSymbols;
    } else {
      integratedItem.related = [];
    }

    result.push(integratedItem);
  }

  progress.terminate();

  return result;
}

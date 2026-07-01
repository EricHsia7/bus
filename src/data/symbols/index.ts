import { MaterialSymbols } from '../../interface/icons/material-symbols-type';
import { hasOwnProperty } from '../../tools';
import { getMaterialSymbolsDescription } from '../apis/getMaterialSymbolsDescription';
import { getMaterialSymbolsList } from '../apis/getMaterialSymbolsList';
import { getMaterialSymbolsSearchIndex } from '../apis/getMaterialSymbolsSearchIndex';
import { getMaterialSymbolsSimilarity } from '../apis/getMaterialSymbolsSimilarity';
import { deleteDataReceivingProgress, deleteDataUpdateTime } from '../apis/loader';

export interface IntegratedMaterialSymbolsItem {
  name: MaterialSymbols;
  description: string | false;
  related: Array<MaterialSymbols>;
  keywords: Array<string>;
}

export type IntegratedMaterialSymbols = Array<IntegratedMaterialSymbolsItem>;

export async function integrateMaterialSymbols(requestID: string): Promise<IntegratedMaterialSymbols> {
  const [searchIndex, description, similarity, list] = await Promise.all([getMaterialSymbolsSearchIndex(requestID), getMaterialSymbolsDescription(requestID), getMaterialSymbolsSimilarity(requestID), getMaterialSymbolsList(requestID)]);

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

  deleteDataReceivingProgress(requestID);

  return result;
}

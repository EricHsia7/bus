import { generateIdentifier } from '../../tools/index.ts';
import { getMaterialSymbols } from '../apis/getMaterialSymbols.ts';

const Fuse = require('fuse.js/basic');

export async function prepareForMaterialSymbolsSearch(): any {
  const requestID: string = `r_${generateIdentifier()}`;
  var materialSymbols = await getMaterialSymbols(requestID);
  return new Fuse(materialSymbols);
}

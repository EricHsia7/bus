import { generateIdentifier } from '../../tools/index';
import { getMaterialSymbols } from '../apis/getMaterialSymbols/index';

const Fuse = require('fuse.js/basic');

export async function prepareForMaterialSymbolsSearch(): Promise<any> {
  const requestID: string = `r_${generateIdentifier()}`;
  var materialSymbols = await getMaterialSymbols(requestID);
  return new Fuse(materialSymbols);
}

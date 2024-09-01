import { generateIdentifier } from '../../tools/index';
import { getMaterialSymbols } from '../apis/getMaterialSymbols/index';

const Fuse = require('fuse.js/basic');

export async function prepareForMaterialSymbolsSearch(): Promise<any> {
  const requestID: string = generateIdentifier('r');
  var materialSymbols = await getMaterialSymbols(requestID);
  return new Fuse(materialSymbols);
}

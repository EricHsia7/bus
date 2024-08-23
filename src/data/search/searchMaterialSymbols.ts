import { Fuse, generateIdentifier } from '../../tools/index.ts';
import { getMaterialSymbols } from '../apis/getMaterialSymbols.ts';

export async function prepareForMaterialSymbolsSearch(): any {
  const requestID: string = `r_${generateIdentifier()}`;
  var materialSymbols = await getMaterialSymbols(requestID);
  return new Fuse(materialSymbols);
}

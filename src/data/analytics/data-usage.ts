import { standardizeArray } from '../../tools/index.ts';

export function recordRequest(requestID: string, data: object): void {
  console.log(requestID, data);
}

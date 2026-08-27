import { GenericNumberArray } from './math';

export function deltaEncode<T extends GenericNumberArray>(array: T, stride: number = 1): T {
  const length = array.length;
  const last = new Array(stride).fill(0);

  for (let i = stride; i < length; i += stride) {
    for (let j = 0; j < stride; j++) {
      const current = array[i + j];
      array[i + j] = current - last[j];
      last[j] = current;
    }
  }
  return array;
}

export function deltaDecode<T extends GenericNumberArray>(array: T, stride: number = 1): T {
  const length = array.length;
  const last = new Array(stride).fill(0);

  for (let i = stride; i < length; i += stride) {
    for (let j = 0; j < stride; j++) {
      const delta = array[i + j];
      array[i + j] = delta + last[j];
      last[j] = array[i + j];
    }
  }
  return array;
}

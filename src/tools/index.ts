export const md5 = require('md5');
export const { sha512 } = require('js-sha512');

export function generateIdentifier(): string {
  const chars = [
    [48, 10], // 0-9: 48 - 57
    [97, 26], // a-z: 97 - 122
    [65, 26] // A-Z: 65 - 90
  ];

  let randomNumber1 = Math.floor(Math.random() * 0x10000000);
  let randomNumber2 = Math.floor(Math.random() * 0x10000000);

  const result = new Uint8Array(17);
  result[0] = 95;
  for (let i = 16; i > 0; i--) {
    const n = randomNumber2 % 3;
    const range = chars[n];
    const code = range[0] + (randomNumber1 % range[1]);
    result[i] = code;
    randomNumber1 >>>= 1;
    randomNumber2 >>>= 1;
  }

  return String.fromCharCode.apply(null, result);
}

export function getNoCacheParameter(interval: number): string {
  const time = new Date().getTime();
  const number = (time / interval) | 0;
  const string = number.toString(16);
  return string;
}

export function isRunningStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function supportTouch(): boolean {
  if ('ontouchstart' in window || navigator.maxTouchPoints) {
    // Touch events are supported
    return true;
  } else {
    // Touch events are not supported
    return false;
  }
}

export function booleanToString(x: boolean): 'true' | 'false' | 'unsupported' {
  if (typeof x === 'boolean') {
    if (x) {
      return 'true';
    } else {
      return 'false';
    }
  }
  return 'unsupported';
}

export function hasOwnProperty(x: any, property: string): boolean {
  if (x === null || x === undefined || typeof x !== 'object' || Array.isArray(x)) {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(x, property);
}

export function isValidURL(string: string): boolean {
  try {
    new URL(string);
    return true; // If no error is thrown, it's a valid URL
  } catch (_) {
    return false; // Invalid URL
  }
}

export function nearestPowerOf2(x: number): number {
  return 1 << (31 - Math.clz32(x));
}

export function getSubpixelPrecision(): number {
  return Math.ceil(Math.log2(window.devicePixelRatio || 1));
}

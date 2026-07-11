export { sha512 } from 'js-sha512';

export function generateIdentifier(): string {
  const chars = new Uint8Array([48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]);
  // 0-9: 48 - 57
  // A-Z: 65 - 90
  // a-z: 97 - 122
  let randomNumber1 = Math.floor(new Date().getTime() * Math.random() + performance.now());
  const result = new Uint8Array(17);
  result[0] = 95;
  for (let i = 16; i > 0; i--) {
    const n = randomNumber1 % 62;
    result[i] = chars[n];
    randomNumber1 >>>= 1;
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
  if (x === true) {
    return 'true';
  } else if (x === false) {
    return 'false';
  } else {
    return 'unsupported';
  }
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

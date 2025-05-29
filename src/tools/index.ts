export const md5 = require('md5');
export const sha256 = require('sha256');

export function compareThings(a: any, b: any): boolean {
  function anyToString(any: any): string {
    return JSON.stringify({ e: any });
  }
  const ax = anyToString(a);
  const bx = anyToString(b);
  const length: number = 32;
  const axLength: number = ax.length;
  const bxLength: number = bx.length;
  if (axLength === bxLength) {
    if (axLength > length || bxLength > length) {
      const hash_a: string = md5(ax);
      const hash_b: string = md5(bx);

      let equal: boolean = true;
      for (let i = 0; i < 8; i++) {
        const a_i: string = hash_a.charAt(i);
        const b_i: string = hash_b.charAt(i);
        if (a_i === b_i) {
          continue;
        } else {
          equal = false;
          break;
        }
      }
      return equal;
    } else {
      if (ax === bx) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

export function generateIdentifier(): string {
  const chars = [
    [48, 10], // 0-9: 48 - 57
    [97, 26], // a-z: 97 - 122
    [65, 26] // A-Z: 65 - 90
  ];

  let randomNumber1 = (Math.random() * 0x10000000) | 0;
  let randomNumber2 = (Math.random() * 0x10000000) | 0;

  const result = new Uint8Array(17);
  result[0] = 95;
  for (let i = 1; i < 17; i++) {
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

export function releaseFile(content: string, type: string = 'application/json', fileName: string): void {
  const blob = new Blob([content], { type: type });
  const fileObj = new File([blob], fileName, { type: type });
  if (navigator.canShare && navigator.canShare({ files: [fileObj] })) {
    navigator
      .share({
        files: [fileObj]
      })
      .catch((error) => {});
  } else {
    const blobURL = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
    }, 10 * 1000);
  }
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

export function booleanToString(x: boolean): 'true' | 'false' {
  if (typeof x === 'boolean') {
    if (x) {
      return 'true';
    } else {
      return 'false';
    }
  }
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

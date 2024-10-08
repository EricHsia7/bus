export const md5 = require('md5');

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

export function generateIdentifier(prefix: string = ''): string {
  const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = `${prefix}_`;
  const length: number = 16;
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.round(Math.random() * characterSet.length);
    result += characterSet.substring(randomNumber, randomNumber + 1);
  }
  return result;
}

export function getNoCacheParameter(interval: number): string {
  const time = new Date().getTime();
  const number = (time / interval).toFixed(0) * interval;
  const string = number.toString(36);
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

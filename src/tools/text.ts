import { getTextWidth } from './graphic';

export function getUnicodes(string: string, unique: boolean = true): Array<number> {
  let result = [];
  if (typeof string === 'string') {
    const stringLength = string.length;
    for (let i = 0; i < stringLength; i++) {
      const unicode = string.charCodeAt(i);
      if (result.indexOf(unicode) < 0 || !unique) {
        result.push(unicode);
      }
    }
  }
  return result;
}

export function containPhoneticSymbols(string: string): boolean {
  const regex = /[\u3100-\u312F\ˇ\ˋ\ˊ\˙]/gm;
  if (regex.test(string)) {
    return true;
  } else {
    return false;
  }
}

export function truncateText(text: string, weight: number, size: string, fontFamily: string, maxWidth: number): string {
  const ellipsis = '...';
  const ellipsisWidth = getTextWidth(ellipsis, weight, size, fontFamily);
  const fullTextWidth = getTextWidth(text, weight, size, fontFamily);
  const fullTextLength = text.length;
  if (fullTextLength === 0) {
    return text;
  }
  if (fullTextWidth <= maxWidth) {
    return text;
  } else {
    const averageCharacterWidth = fullTextWidth / fullTextLength;
    const truncatedLength = Math.floor(maxWidth / averageCharacterWidth) - 2;
    let lengthAdjustment = 0;
    let lastLength = 0;
    for (let i = 0; i < 5; i++) {
      const adjustedText = text.substring(0, truncatedLength + lengthAdjustment);
      const adjustedTextWidth = getTextWidth(adjustedText, weight, size, fontFamily) + ellipsisWidth;
      if (adjustedTextWidth <= maxWidth) {
        lastLength = truncatedLength + lengthAdjustment;
        lengthAdjustment += 1;
      } else {
        break;
      }
    }
    return `${text.substring(0, lastLength)}${ellipsis}`;
  }
}

export function formatNumberWithSuffix(num: number, maxLength: number = 4): string {
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q'];
  let magnitude = 0;

  while (Math.abs(num) >= 1000 && magnitude < suffixes.length - 1) {
    num /= 1000;
    magnitude++;
  }

  let numStr = num.toFixed(1).replace(/\.0$/, '');

  while (numStr.length + suffixes[magnitude].length > maxLength && numStr.includes('.')) {
    numStr = numStr.slice(0, -1);
  }

  return numStr + suffixes[magnitude];
}

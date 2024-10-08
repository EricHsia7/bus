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
  var regex = /[\u3100-\u312F\ˇ\ˋ\ˊ\˙]/gm;
  if (regex.test(string)) {
    return true;
  } else {
    return false;
  }
}

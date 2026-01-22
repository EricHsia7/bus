function shortenHex(hex) {
  const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const BASE = 62n;
  let num = BigInt('0x' + hex);
  if (num === 0n) return '0';
  let result = '';
  while (num > 0n) {
    const remainder = num % BASE;
    result = CHARSET[Number(remainder)] + result;
    num = num / BASE;
  }
  return result;
}

module.exports = {
  shortenHex
};

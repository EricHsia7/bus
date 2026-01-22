const crypto = require('crypto');
const { shortenHex } = require('./shorten-hex');

// The Hasher wrapper
class Hasher {
  constructor() {
    // Initialize the standard MD5 hash
    this.hash = crypto.createHash('md5');
  }

  update(data) {
    // Webpack passes chunks of data here
    if (data === undefined || data === null) return this;
    this.hash.update(data);
    return this;
  }

  digest() {
    // Get the standard hex result from MD5
    const hex = this.hash.digest('hex');
    // Shorten hex
    const shortened = shortenHex(hex);
    // Truncate to 8 characters
    return shortened.substring(0, 8);
  }
}

module.exports = {
  Hasher
};

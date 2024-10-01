// const FontFaceObserver = require('fontfaceobserver');

let lazyCSS = {
  noto_sans: false,
  material_symbols: false
};

export function loadCSS(url: string, identifier: string): void {
  if (!lazyCSS.hasOwnProperty(identifier)) {
    const link = document.createElement('link');
    link.setAttribute('href', url);
    link.setAttribute('rel', 'stylesheet');
    document.head.appendChild(link);
    lazyCSS[identifier] = true;
  }
}

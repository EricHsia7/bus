// const FontFaceObserver = require('fontfaceobserver');

let lazyCSS = {
  noto_sans_tc: false,
  material_symbols: false
};

export function loadCSS(url: string, identifier: string): void {
  if (lazyCSS[identifier] === false) {
    const link = document.createElement('link');
    link.setAttribute('href', url);
    link.setAttribute('rel', 'stylesheet');
    document.head.appendChild(link);
    lazyCSS[identifier] = true;
  }
}

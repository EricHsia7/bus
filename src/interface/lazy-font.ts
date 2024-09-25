const FontFaceObserver = require('fontfaceobserver');

var lazyCSS = {
  noto_sans: false,
  material_symbols: false
};

export function loadCSS(url: string, identifier: string): void {
  if (!lazyCSS[identifier]) {
    var link = document.createElement('link');
    link.setAttribute('href', url);
    link.setAttribute('rel', 'stylesheet');
    document.head.appendChild(link);
    lazyCSS[identifier] = true;
  }
}

export async function loadFont(url: string, fontName: string, identifier: string): Promise<boolean> {
  loadCSS(url, identifier);
  const observer = new FontFaceObserver(fontName);
  await observer.load();
  return true;
}

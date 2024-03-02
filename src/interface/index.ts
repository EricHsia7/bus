export function CSSResize(): void {
  document.querySelector('#bus_sizing').innerHTML = `
 :root {
 --b-ww:${window.innerWidth}px;
 --b-wh:${window.innerHeight}px;
 }
 `;
}

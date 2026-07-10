import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateRoundedQRCodeSVG } from '../../tools/qrcode';
import { rasterizeSVGPath } from '../../tools/rasterize';
import { shareFile } from '../../tools/share';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

const QRCodeField = documentQuerySelector('.css_qrcode_field');
const headElement = elementQuerySelector(QRCodeField, '.css_qrcode_head');
const rightButtonElement = elementQuerySelector(headElement, '.css_qrcode_button_right');
const bodyElement = elementQuerySelector(QRCodeField, '.css_qrcode_body');
const svgElement = elementQuerySelector(bodyElement, '.css_qrcode_svg');
const imageElement = elementQuerySelector(bodyElement, '.css_qrcode_image img') as HTMLImageElement;

export async function initializeQRCodeField(text: string) {
  const svg = generateRoundedQRCodeSVG(text, 'M', 0.5, 0.3, 0, 10);
  svgElement.innerHTML = svg[0];
  const url = await rasterizeSVGPath(svg[1], svg[1], svg[2]);
  imageElement.src = url;
  rightButtonElement.onclick = function () {
    shareFile(svg[0], 'image/svg+xml', 'qrcode.svg');
  };
}

export function showQRCode(): void {
  QRCodeField.setAttribute('displayed', 'true');
}

export function hideQRCode(): void {
  QRCodeField.setAttribute('displayed', 'false');
}

export function openQRCode(text: string): void {
  pushPageHistory('QRCode');
  showQRCode();
  initializeQRCodeField(text);
  hidePreviousPage();
}

export function closeQRCode(): void {
  hideQRCode();
  showPreviousPage();
  revokePageHistory('QRCode');
}

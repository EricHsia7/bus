import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateRoundedQRCodeSVG } from '../../tools/qrcode';
import { shareFile } from '../../tools/share';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

const QRCodeField = documentQuerySelector('.css_qrcode_field');
const headElement = elementQuerySelector(QRCodeField, '.css_qrcode_head');
const rightButtonElement = elementQuerySelector(headElement, '.css_qrcode_button_right');
const bodyElement = elementQuerySelector(QRCodeField, '.css_qrcode_body');

export function initializeQRCodeField(text: string): void {
  const svg = generateRoundedQRCodeSVG(text, 'M', 0.5, 0.3, 1, 10);
  bodyElement.innerHTML = svg;
  rightButtonElement.onclick = function () {
    shareFile(svg, 'image/svg+xml', 'qrcode.svg');
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

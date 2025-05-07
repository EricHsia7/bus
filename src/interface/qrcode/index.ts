import { generateRoundedQRCodeSVG } from '../../tools/qrcode';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { pushPageHistory, revokePageHistory } from '../index';

const QRCodeField = documentQuerySelector('.css_qrcode_field');
const QRCodeBodyElement = elementQuerySelector(QRCodeField, '.css_qrcode_body');

export function initializeQRCodeField(text: string): void {
  const svg = generateRoundedQRCodeSVG(text, 'M', 0.5, 0.3, 1, 'var(--b-cssvar-333333)', 4);
  QRCodeBodyElement.innerHTML = svg;
}

export function openQRCode(text: string): void {
  pushPageHistory('QRCode');
  QRCodeField.setAttribute('displayed', 'true');
  initializeQRCodeField(text);
  // closePreviousPage();
}

export function closeQRCode(): void {
  revokePageHistory('QRCode');
  QRCodeField.setAttribute('displayed', 'false');
  // openPreviousPage();
}

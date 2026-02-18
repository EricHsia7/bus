import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateRoundedQRCodeSVG } from '../../tools/qrcode';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

const QRCodeField = documentQuerySelector('.css_qrcode_field');
const QRCodeBodyElement = elementQuerySelector(QRCodeField, '.css_qrcode_body');

export function initializeQRCodeField(text: string): void {
  const svg = generateRoundedQRCodeSVG(text, 'M', 0.5, 0.3, 1, 4);
  QRCodeBodyElement.innerHTML = svg;
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

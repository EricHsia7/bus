import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateRoundedQRCodeSVG } from '../../tools/qrcode';
import { shareFile } from '../../tools/share';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

const Field = documentQuerySelector('.css_qrcode_field');
const HeadElement = elementQuerySelector(Field, '.css_qrcode_head');
const HeadButtonRightElement = elementQuerySelector(HeadElement, '.css_qrcode_button_right');
const BodyElement = elementQuerySelector(Field, '.css_qrcode_body');

export function initializeQRCodeField(text: string): void {
  const svg = generateRoundedQRCodeSVG(text, 'M', 0.5, 0.3, 10, 10);
  BodyElement.innerHTML = svg;
  HeadButtonRightElement.onclick = function () {
    shareFile(svg, 'image/svg+xml', 'qrcode.svg');
  };
}

export function showQRCode(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideQRCode(): void {
  Field.setAttribute('displayed', 'false');
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

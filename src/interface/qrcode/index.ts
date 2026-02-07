import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { generateRoundedQRCodeSVG } from '../../tools/qrcode';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';

const QRCodeField = documentQuerySelector('.css_qrcode_field');
const QRCodeBodyElement = elementQuerySelector(QRCodeField, '.css_qrcode_body');

export function initializeQRCodeField(text: string): void {
  const svg = generateRoundedQRCodeSVG(text, 'M', 0.5, 0.3, 1, 'var(--b-cssvar-333333)', 4);
  QRCodeBodyElement.innerHTML = svg;
}

export function showQRCode(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse ? 'css_page_transition_slide_in_reverse' : 'css_page_transition_fade_in';
  QRCodeField.addEventListener(
    'animationend',
    function () {
      QRCodeField.classList.remove(className);
    },
    { once: true }
  );
  QRCodeField.classList.add(className);
  QRCodeField.setAttribute('displayed', 'true');
}

export function hideQRCode(pageTransitionReverse: boolean): void {
  const className = pageTransitionReverse === 'ltr' ? 'css_page_transition_slide_out_reverse' : 'css_page_transition_fade_out';
  QRCodeField.addEventListener(
    'animationend',
    function () {
      QRCodeField.setAttribute('displayed', 'false');
      QRCodeField.classList.remove(className);
    },
    { once: true }
  );
  QRCodeField.classList.add(className);
}

export function openQRCode(text: string): void {
  pushPageHistory('QRCode');
  showQRCode('rtl');
  initializeQRCodeField(text);
  hidePreviousPage();
}

export function closeQRCode(): void {
  hideQRCode('ltr');
  showPreviousPage();
  revokePageHistory('QRCode');
}

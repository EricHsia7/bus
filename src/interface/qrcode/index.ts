import { generateRoundedQRCodeSVG } from '../../tools/qrcode';

export function initializeQRCodeField(text: string): void {
  const svg = generateRoundedQRCodeSVG(text, 'M', 0.45, 0.3, 'var(--b-cssvar-333333)', 4);
}

export function openQRCode(text: string): void {}

export function closeQRCode(): void {}

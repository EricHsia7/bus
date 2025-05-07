import { generateRoundedRectPath } from './graphic';

const QRCode = require('qrcode/lib/core');

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * Generate a QR code matrix (2D Boolean array)
 * @param text The input text to encode
 * @param errorCorrectionLevel L, M, Q, H
 * @returns 2D array (true = filled, false = blank)
 */

export function generateQRCodeMatrix(text: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel): Array<Array<boolean>> {
  const qrData = QRCode.create(text, {
    errorCorrectionLevel: errorCorrectionLevel
  });

  const size = qrData.modules.size;
  const matrix = [];

  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push(qrData.modules.get(x, y));
    }
    matrix.push(row);
  }

  return matrix;
}

export function generateRoundedQRCodeSVG(text: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel = 'L', outerRadius: number = 0.5, innerRadius: number = 0.3, fill: string = '#000000', scale: number = 4): string {
  const filledNeighborhood = [
    [
      [-1, 0],
      [0, -1]
    ], // top-left
    [
      [0, -1],
      [1, 0]
    ], // top-right
    [
      [1, 0],
      [0, 1]
    ], // bottom-right
    [
      [0, 1],
      [-1, 0]
    ] // bottom-left
  ];

  const blankNeighborhood = [
    [
      [-1, 0],
      [-1, -1],
      [0, -1]
    ],
    [
      [0, -1],
      [1, -1],
      [1, 0]
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1]
    ],
    [
      [0, 1],
      [-1, 1],
      [-1, 0]
    ]
  ];

  // [x, y]

  const data = generateQRCodeMatrix(text,errorCorrectionLevel);
  const size = data.length;

  let commands: Array<string> = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y][x] === true) {
        // filled
        const cornerRadius = new Uint8Array(4);
        for (let k = 0; k < 4; k++) {
          const neighbors = filledNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (data[y + neighbor[1]]?.[x + neighbor[0]] === true) {
              displayed *= 0;
            }
          }
          cornerRadius[k] = displayed;
        }
        commands = commands.concat(
          generateRoundedRectPath(
            x * scale,
            y * scale,
            1 * scale,
            1 * scale,
            {
              tl: cornerRadius[0] * outerRadius * scale,
              tr: cornerRadius[1] * outerRadius * scale,
              br: cornerRadius[2] * outerRadius * scale,
              bl: cornerRadius[3] * outerRadius * scale
            },
            false
          )
        );
      } else {
        // blank
        const cornerRadius = new Uint8Array(4);
        for (let k = 0; k < 4; k++) {
          const neighbors = blankNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (!data[y + neighbor[1]]?.[x + neighbor[0]]) {
              displayed *= 0;
            }
          }
          cornerRadius[k] = displayed;
        }
        if (cornerRadius.some((r) => r !== 0)) {
          commands = commands.concat(
            generateRoundedRectPath(
              x * scale,
              y * scale,
              1 * scale,
              1 * scale,
              {
                tl: cornerRadius[0] * innerRadius * scale,
                tr: cornerRadius[1] * innerRadius * scale,
                br: cornerRadius[2] * innerRadius * scale,
                bl: cornerRadius[3] * innerRadius * scale
              },
              true
            )
          );
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size * scale} ${size * scale}"><path d="${commands.join(' ')}" fill="${fill}" stroke="${fill}" stroke-width="0.1" stroke-linejoin="round" /></svg>`;
}

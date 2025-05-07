import { generateRoundedRectPath } from './graphic';
const { QRCodeRaw } = require('@akamfoad/qrcode');

export function generateRoundedQRCodeSVG(text: string, level: 'L' | 'M' | 'Q' | 'H' = 'L', outerRadius: number = 0.5, innerRadius: number = 0.3, fill: string = '#000000', scale: number = 4): string {
  const QRCode = new QRCodeRaw(text, {
    level: level
  });

  const data = QRCode.getData();
  const size = QRCode.getDataSize();

  // corner: 0 (top-left), 1 (top-right), 2 (bottom-right), 3 (bottom-left)
  // vectors: [[j, i], ...]

  const filledNeighborhood = [
    [
      [-1, 0],
      [0, -1]
    ], // 0
    [
      [0, -1],
      [1, 0]
    ], // 1
    [
      [1, 0],
      [0, 1]
    ], // 2
    [
      [0, 1],
      [-1, 0]
    ] // 3
  ];

  const blankNeighborhood = [
    [
      [-1, 0],
      [-1, -1],
      [0, -1]
    ], // 0
    [
      [0, -1],
      [1, -1],
      [1, 0]
    ], // 1
    [
      [1, 0],
      [1, 1],
      [0, 1]
    ], // 2
    [
      [0, 1],
      [-1, 1],
      [-1, 0]
    ] // 3
  ];

  let commands: Array<string> = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (data[i][j] === true) {
        // filled
        const cornerRadius = new Uint8Array(4);
        for (let k = 0; k < 4; k++) {
          const neighbors = filledNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (data[i + neighbor[1]]) {
              if (data[i + neighbor[1]][j + neighbor[0]] === true) {
                displayed *= 0;
              }
            }
          }
          cornerRadius[k] = displayed;
        }
        commands = commands.concat(generateRoundedRectPath(j * scale, i * scale, 1 * scale, 1 * scale, { tl: cornerRadius[0] * outerRadius * scale, tr: cornerRadius[1] * outerRadius * scale, br: cornerRadius[2] * outerRadius * scale, bl: cornerRadius[3] * outerRadius * scale }, false));
      } else {
        // blank
        const cornerRadius = new Uint8Array(4);
        for (let k = 0; k < 4; k++) {
          const neighbors = blankNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (!data[i + neighbor[1]]) {
              displayed *= 0;
            } else {
              if (!data[i + neighbor[1]][j + neighbor[0]]) {
                displayed *= 0;
              }
            }
          }
          cornerRadius[k] = displayed;
        }
        if (cornerRadius[0] !== 0 || cornerRadius[1] !== 0 || cornerRadius[2] !== 0 || cornerRadius[3] !== 0) {
          commands = commands.concat(generateRoundedRectPath(j * scale, i * scale, 1 * scale, 1 * scale, { tl: cornerRadius[0] * innerRadius * scale, tr: cornerRadius[1] * innerRadius * scale, br: cornerRadius[2] * innerRadius * scale, bl: cornerRadius[3] * innerRadius * scale }, true));
        }
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size * scale} ${size * scale}"><path d="${commands.join(' ')}" fill="${fill}" stroke="${fill}" stroke-width="0.1" stroke-linejoin="round" /></svg>`;
}
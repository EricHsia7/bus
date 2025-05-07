import { generateRoundedRectPath } from './graphic';
const QRCodeGenerator = require('qrcode-generator');

export function generateRoundedQRCodeSVG(
  text: string,
  level: 'L' | 'M' | 'Q' | 'H' = 'L',
  outerRadius: number = 0.5,
  innerRadius: number = 0.3,
  fill: string = '#000000',
  scale: number = 4,
  dataMode: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji' = 'Byte'
): string {
  const qr = QRCodeGenerator(0, level); // typeNumber = 0 (automatic)
  qr.addData(text, dataMode); // data mode added
  qr.make();

  const size = qr.getModuleCount();
  const data: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < size; col++) {
      rowData.push(qr.isDark(row, col));
    }
    data.push(rowData);
  }

  const filledNeighborhood = [
    [[-1, 0], [0, -1]], // top-left
    [[0, -1], [1, 0]],  // top-right
    [[1, 0], [0, 1]],   // bottom-right
    [[0, 1], [-1, 0]]   // bottom-left
  ];

  const blankNeighborhood = [
    [[-1, 0], [-1, -1], [0, -1]],
    [[0, -1], [1, -1], [1, 0]],
    [[1, 0], [1, 1], [0, 1]],
    [[0, 1], [-1, 1], [-1, 0]]
  ];

  // [j, i]

  let commands: Array<string> = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (data[i][j] === true) {
        const cornerRadius = new Uint8Array(4);
        for (let k = 0; k < 4; k++) {
          const neighbors = filledNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (data[i + neighbor[1]]?.[j + neighbor[0]] === true) {
              displayed *= 0;
            }
          }
          cornerRadius[k] = displayed;
        }
        commands = commands.concat(
          generateRoundedRectPath(
            j * scale,
            i * scale,
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
        const cornerRadius = new Uint8Array(4);
        for (let k = 0; k < 4; k++) {
          const neighbors = blankNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (!data[i + neighbor[1]]?.[j + neighbor[0]]) {
              displayed *= 0;
            }
          }
          cornerRadius[k] = displayed;
        }
        if (cornerRadius.some(r => r !== 0)) {
          commands = commands.concat(
            generateRoundedRectPath(
              j * scale,
              i * scale,
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
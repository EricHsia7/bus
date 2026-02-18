import { generateRoundedRectPath } from './graphic';

const QRCode = require('qrcode/lib/core/qrcode');

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * Generate a QR code matrix (2D Boolean array)
 * @param text The input text to encode
 * @param errorCorrectionLevel L, M, Q, H
 * @returns 2D array (1 = filled, 0 = blank)
 */

export function generateQRCodeMatrix(text: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel): Array<Array<0 | 1>> {
  const qrData = QRCode.create(text, {
    errorCorrectionLevel: errorCorrectionLevel
  });

  const size = qrData.modules.size;
  const matrix = [];

  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const bit = qrData.modules.get(x, y);
      row.push(bit);
    }
    matrix.push(row);
  }

  return matrix;
}

export function generateRoundedQRCodeSVG(text: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel = 'L', outerRadius: number = 0.5, innerRadius: number = 0.3, padding: number = 1, scale: number = 4): string {
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

  const data = generateQRCodeMatrix(text, errorCorrectionLevel);
  const size = data.length;

  // Helper to manage segments
  // We store directed segments. If we find a reverse segment already exists,
  // it means we have a shared edge, so we delete both (cancellation).
  const segments = new Map(); // Key: "x1,y1", Value: { endX, endY, command }

  function addSegment(x1, y1, x2, y2, command) {
    const keyForward = `${x1},${y1}:${x2},${y2}`;
    const keyReverse = `${x2},${y2}:${x1},${y1}`;

    if (segments.has(keyReverse)) {
      // Found a shared edge (internal). Remove the reverse one and don't add this one.
      segments.delete(keyReverse);
    } else {
      // New edge (external so far). Add it.
      segments.set(keyForward, { x1, y1, x2, y2, command });
    }
  }

  // Iterate grid to generate all potential segments (Clockwise Order)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = (x + padding) * scale;
      const cy = (y + padding) * scale;
      const width = scale;
      const height = scale;

      // Calculate Radii Logic (filled)
      const cornerRadius = new Uint8Array(4);
      const isFilled = data[y][x] === 1;

      if (isFilled) {
        // FILLED CELL
        for (let k = 0; k < 4; k++) {
          const neighbors = filledNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (data[y + neighbor[1]]?.[x + neighbor[0]] === 1) displayed *= 0;
          }
          cornerRadius[k] = displayed;
        }

        const tl = cornerRadius[0] * outerRadius * scale;
        const tr = cornerRadius[1] * outerRadius * scale;
        const br = cornerRadius[2] * outerRadius * scale;
        const bl = cornerRadius[3] * outerRadius * scale;

        // Generate 8 segments for a rounded rect (4 lines, 4 arcs)
        // Top Edge (Left to Right)
        if (tl > 0)
          addSegment(cx, cy + tl, cx + tl, cy, `Q${cx} ${cy} ${cx + tl} ${cy}`); // TL Corner
        else addSegment(cx, cy, cx, cy, ''); // sharp corner (0-length, logic handles this by extending lines)

        // Top Line
        addSegment(cx + tl, cy, cx + width - tr, cy, `L${cx + width - tr} ${cy}`);

        // TR Corner
        if (tr > 0) addSegment(cx + width - tr, cy, cx + width, cy + tr, `Q${cx + width} ${cy} ${cx + width} ${cy + tr}`);

        // Right Line
        addSegment(cx + width, cy + tr, cx + width, cy + height - br, `L${cx + width} ${cy + height - br}`);

        // BR Corner
        if (br > 0) addSegment(cx + width, cy + height - br, cx + width - br, cy + height, `Q${cx + width} ${cy + height} ${cx + width - br} ${cy + height}`);

        // Bottom Line
        addSegment(cx + width - br, cy + height, cx + bl, cy + height, `L${cx + bl} ${cy + height}`);

        // BL Corner
        if (bl > 0) addSegment(cx + bl, cy + height, cx, cy + height - bl, `Q${cx} ${cy + height} ${cx} ${cy + height - bl}`);

        // Left Line
        addSegment(cx, cy + height - bl, cx, cy + tl, `L${cx} ${cy + tl}`);
      } else {
        // BLANK CELL (Liquid connections)
        // We add "fillets" to the corners. To ensure they cancel with filled cells,
        // we must draw them Clockwise relative to the "ink".
        // A fillet in the top-left of an empty cell fills that corner.

        for (let k = 0; k < 4; k++) {
          const neighbors = blankNeighborhood[k];
          let displayed = 1;
          for (const neighbor of neighbors) {
            if (!data[y + neighbor[1]]?.[x + neighbor[0]]) displayed *= 0;
          }
          cornerRadius[k] = displayed;
        }

        // Inverted TL: M(x, y+r) Q(x,y, x+r,y) L(x,y) L(x, y+r) -- (CCW)
        // We need CW segments: (x, y+r) -> (x,y) -> (x+r, y) -> (x, y+r)

        const r = innerRadius * scale;

        // Top-Left Fillet
        if (cornerRadius[0]) {
          // CW: Up, Right, Curve-Back
          addSegment(cx, cy + r, cx, cy, `L${cx} ${cy}`); // Up
          addSegment(cx, cy, cx + r, cy, `L${cx + r} ${cy}`); // Right
          addSegment(cx + r, cy, cx, cy + r, `Q${cx} ${cy} ${cx} ${cy + r}`); // Curve hypotenuse
        }

        // Top-Right Fillet
        if (cornerRadius[1]) {
          addSegment(cx + width - r, cy, cx + width, cy, `L${cx + width} ${cy}`); // Right
          addSegment(cx + width, cy, cx + width, cy + r, `L${cx + width} ${cy + r}`); // Down
          addSegment(cx + width, cy + r, cx + width - r, cy, `Q${cx + width} ${cy} ${cx + width - r} ${cy}`); // Curve
        }

        // Bottom-Right Fillet
        if (cornerRadius[2]) {
          addSegment(cx + width, cy + height - r, cx + width, cy + height, `L${cx + width} ${cy + height}`); // Down
          addSegment(cx + width, cy + height, cx + width - r, cy + height, `L${cx + width - r} ${cy + height}`); // Left
          addSegment(cx + width - r, cy + height, cx + width, cy + height - r, `Q${cx + width} ${cy + height} ${cx + width} ${cy + height - r}`); // Curve
        }

        // Bottom-Left Fillet
        if (cornerRadius[3]) {
          addSegment(cx + r, cy + height, cx, cy + height, `L${cx} ${cy + height}`); // Left
          addSegment(cx, cy + height, cx, cy + height - r, `L${cx} ${cy + height - r}`); // Up
          addSegment(cx, cy + height - r, cx + r, cy + height, `Q${cx} ${cy + height} ${cx + r} ${cy + height}`); // Curve
        }
      }
    }
  }

  // Stitching Logic
  // Convert map to a more traversable format
  const adjacency = new Map(); // StartKey -> Segment
  for (const [key, val] of segments) {
    // Round coords to avoid floating point mismatch keys
    const startKey = `${Math.round(val.x1)},${Math.round(val.y1)}`;
    if (!adjacency.has(startKey)) adjacency.set(startKey, []);
    adjacency.get(startKey).push(val);
  }

  const finalPath = [];

  while (adjacency.size > 0) {
    // Pick a starting point
    let startKey = adjacency.keys().next().value;
    let currentKey = startKey;
    let pathString = '';

    // Start a new sub-path
    // Find the first segment to determine M command
    const firstSeg = adjacency.get(startKey)[0]; // naive pick
    pathString += `M${firstSeg.x1} ${firstSeg.y1}`;

    // Walk the loop
    while (true) {
      const potentialNext = adjacency.get(currentKey);
      if (!potentialNext || potentialNext.length === 0) break;

      // Consume one segment
      const segment = potentialNext.shift();
      if (potentialNext.length === 0) adjacency.delete(currentKey);

      pathString += ' ' + segment.command;

      currentKey = `${Math.round(segment.x2)},${Math.round(segment.y2)}`;
      if (currentKey === startKey && (!adjacency.has(startKey) || adjacency.get(startKey).length === 0)) {
        pathString += ' Z';
        break; // Closed loop
      }
    }
    finalPath.push(pathString);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${(size + padding * 2) * scale} ${(size + padding * 2) * scale}" shape-rendering="geometricPrecision"><path d="${finalPath.join(' ')}" stroke-linejoin="round" fill-rule="nonzero" /></svg>`;
}

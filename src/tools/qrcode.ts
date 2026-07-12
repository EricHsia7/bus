import { clamp } from './math';

const { create: QRCode_create } = require('qrcode/lib/core/qrcode');

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * Generate a QR code matrix (2D Boolean array)
 * @param text The input text to encode
 * @param errorCorrectionLevel L, M, Q, H
 * @returns 2D array (1 = filled, 0 = blank)
 */

export function generateQRCodeMatrix(text: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel): Array<Array<0 | 1>> {
  const qrData = QRCode_create(text, {
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

type BitCell = 0 | 1;
type Bitmap = ReadonlyArray<ReadonlyArray<BitCell>>;
type Offset = readonly [number, number];

type PathSegment = { x1: number; y1: number; x2: number; y2: number; command: string };

// Corner order used everywhere below.
const TL = 0,
  TR = 1,
  BR = 2,
  BL = 3;

// FILLED cell: a corner rounds outward only when BOTH its orthogonal
// neighbors are empty (the cell "touches a gap" on both sides of that corner).
const FILLED_CORNER_NEIGHBORS: ReadonlyArray<ReadonlyArray<Offset>> = [
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

// BLANK cell: gets an inward fillet ("bridge") only when all 3 cells
// wrapping that corner are filled (an L-shaped notch).
const BLANK_CORNER_NEIGHBORS: ReadonlyArray<ReadonlyArray<Offset>> = [
  [
    [-1, 0],
    [-1, -1],
    [0, -1]
  ], // top-left
  [
    [0, -1],
    [1, -1],
    [1, 0]
  ], // top-right
  [
    [1, 0],
    [1, 1],
    [0, 1]
  ], // bottom-right
  [
    [0, 1],
    [-1, 1],
    [-1, 0]
  ] // bottom-left
];

const cellAt = (data: Bitmap, x: number, y: number): BitCell | undefined => data[y]?.[x];

// Rounds coordinates so mathematically-equal edges from neighboring cells
// produce bit-identical keys (raw floats can differ by 1 ULP and silently
// break the cancellation/stitching logic).
const snap = (n: number): number => Math.round(n * 1e4) / 1e4;

export function bitmapToSVG(data: Bitmap, outerRadius = 0.5, innerRadius = 0.3, padding = 0, pixelSize = 4): string {
  const rows = data.length;
  const cols = rows > 0 ? Math.max(...data.map((row) => row.length)) : 0;

  // Clamp: a radius over half a cell would make a corner's own two
  // fillets overlap/self-intersect.

  const outerR = clamp(outerRadius, 0, 0.5) * pixelSize;
  const innerR = clamp(innerRadius, 0, 0.5) * pixelSize;

  // Emit every cell's boundary, cancel shared (interior) edges ---
  const segments = new Map<string, PathSegment>();
  const addSegment = (x1: number, y1: number, x2: number, y2: number, command: string) => {
    const [sx1, sy1, sx2, sy2] = [snap(x1), snap(y1), snap(x2), snap(y2)];
    const forwardKey = `${sx1},${sy1}:${sx2},${sy2}`;
    const reverseKey = `${sx2},${sy2}:${sx1},${sy1}`;
    if (segments.has(reverseKey))
      segments.delete(reverseKey); // shared edge -> cancels
    else segments.set(forwardKey, { x1: sx1, y1: sy1, x2: sx2, y2: sy2, command });
  };

  const cornerFlags = new Uint8Array(4); // reused scratch buffer, avoids per-cell allocation
  const computeCornerFlags = (x: number, y: number, neighborSets: ReadonlyArray<ReadonlyArray<Offset>>, satisfies: (cell: BitCell | undefined) => boolean) => {
    for (let k = 0; k < 4; k++) {
      let allSatisfy = 1;
      for (const [dx, dy] of neighborSets[k]) {
        if (!satisfies(cellAt(data, x + dx, y + dy))) allSatisfy = 0;
      }
      cornerFlags[k] = allSatisfy;
    }
  };

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = (x + padding) * pixelSize;
      const cy = (y + padding) * pixelSize;
      const s = pixelSize;

      if (cellAt(data, x, y) === 1) {
        computeCornerFlags(x, y, FILLED_CORNER_NEIGHBORS, (cell) => cell !== 1);
        const tl = cornerFlags[TL] * outerR;
        const tr = cornerFlags[TR] * outerR;
        const br = cornerFlags[BR] * outerR;
        const bl = cornerFlags[BL] * outerR;

        if (tl > 0) addSegment(cx, cy + tl, cx + tl, cy, `Q${cx} ${cy} ${cx + tl} ${cy}`);
        addSegment(cx + tl, cy, cx + s - tr, cy, `L${cx + s - tr} ${cy}`);
        if (tr > 0) addSegment(cx + s - tr, cy, cx + s, cy + tr, `Q${cx + s} ${cy} ${cx + s} ${cy + tr}`);
        addSegment(cx + s, cy + tr, cx + s, cy + s - br, `L${cx + s} ${cy + s - br}`);
        if (br > 0) addSegment(cx + s, cy + s - br, cx + s - br, cy + s, `Q${cx + s} ${cy + s} ${cx + s - br} ${cy + s}`);
        addSegment(cx + s - br, cy + s, cx + bl, cy + s, `L${cx + bl} ${cy + s}`);
        if (bl > 0) addSegment(cx + bl, cy + s, cx, cy + s - bl, `Q${cx} ${cy + s} ${cx} ${cy + s - bl}`);
        addSegment(cx, cy + s - bl, cx, cy + tl, `L${cx} ${cy + tl}`);
      } else {
        computeCornerFlags(x, y, BLANK_CORNER_NEIGHBORS, (cell) => cell === 1);
        const r = innerR;

        if (cornerFlags[TL]) {
          addSegment(cx, cy + r, cx, cy, `L${cx} ${cy}`);
          addSegment(cx, cy, cx + r, cy, `L${cx + r} ${cy}`);
          addSegment(cx + r, cy, cx, cy + r, `Q${cx} ${cy} ${cx} ${cy + r}`);
        }
        if (cornerFlags[TR]) {
          addSegment(cx + s - r, cy, cx + s, cy, `L${cx + s} ${cy}`);
          addSegment(cx + s, cy, cx + s, cy + r, `L${cx + s} ${cy + r}`);
          addSegment(cx + s, cy + r, cx + s - r, cy, `Q${cx + s} ${cy} ${cx + s - r} ${cy}`);
        }
        if (cornerFlags[BR]) {
          addSegment(cx + s, cy + s - r, cx + s, cy + s, `L${cx + s} ${cy + s}`);
          addSegment(cx + s, cy + s, cx + s - r, cy + s, `L${cx + s - r} ${cy + s}`);
          addSegment(cx + s - r, cy + s, cx + s, cy + s - r, `Q${cx + s} ${cy + s} ${cx + s} ${cy + s - r}`);
        }
        if (cornerFlags[BL]) {
          addSegment(cx + r, cy + s, cx, cy + s, `L${cx} ${cy + s}`);
          addSegment(cx, cy + s, cx, cy + s - r, `L${cx} ${cy + s - r}`);
          addSegment(cx, cy + s - r, cx + r, cy + s, `Q${cx} ${cy + s} ${cx + r} ${cy + s}`);
        }
      }
    }
  }

  // Stitch surviving segments into closed subpaths
  const adjacency = new Map<string, PathSegment[]>();
  for (const segment of segments.values()) {
    const startKey = `${segment.x1},${segment.y1}`;
    const bucket = adjacency.get(startKey);
    if (bucket) bucket.push(segment);
    else adjacency.set(startKey, [segment]);
  }

  const pathCommands: string[] = [];
  const maxSteps = segments.size + 1; // safety valve against malformed/non-manifold input

  while (adjacency.size > 0) {
    const startKey = adjacency.keys().next().value as string;
    let currentKey = startKey;

    const [firstSegment] = adjacency.get(startKey)!;
    pathCommands.push(`M${firstSegment.x1} ${firstSegment.y1}`);

    for (let step = 0; step < maxSteps; step++) {
      const bucket = adjacency.get(currentKey);
      if (!bucket || bucket.length === 0) break;

      const segment = bucket.shift()!;
      if (bucket.length === 0) adjacency.delete(currentKey);

      pathCommands.push(segment.command);
      currentKey = `${segment.x2},${segment.y2}`;

      const nextBucket = adjacency.get(currentKey);
      if (currentKey === startKey && (!nextBucket || nextBucket.length === 0)) {
        pathCommands.push('Z');
        break;
      }
    }
  }

  const width = (cols + padding * 2) * pixelSize;
  const height = (rows + padding * 2) * pixelSize;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${pathCommands.join('')}" fill-rule="nonzero" stroke="none" /></svg>`;
}

export function generateRoundedQRCodeSVG(text: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel = 'L', outerRadius: number = 0.5, innerRadius: number = 0.3, padding: number = 0, pixelSize: number = 4): string {
  const data = generateQRCodeMatrix(text, errorCorrectionLevel);
  return bitmapToSVG(data, outerRadius, innerRadius, padding, pixelSize);
}

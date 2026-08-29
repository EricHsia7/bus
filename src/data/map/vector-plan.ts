import earcut from 'earcut';
import { VectorTile, VectorTileStyle, VECTOR_TILE_LINE, VECTOR_TILE_POLYGON } from './vector';
import { deltaDecode } from '../../tools/delta';

/**
 * CPU-side vector plan plus a GPU-ready representation.
 *
 * The original tile geometry remains compact Int16/Int32 data.  The GPU plan is
 * produced once in the worker and consists only of transferable typed arrays.
 */
export interface VectorPlan {
  type: 'Vector';
  extent: number;
  buffer: number;
  zoom: number;
  coordinates: Int16Array;
  partStartIndices: Int32Array;
  descriptorStartIndices: Int32Array;
  descriptorTypes: Uint8Array;
  styleReferences: Int16Array;
  styleStartIndices: Int32Array;
  styles: Array<VectorTileStyle>;
  gpu: VectorGPUPlan;
  geometryBytes: number;
  gpuBytes: number;
  size: number;
}

/** One style record consumed by the palette data texture. */
export interface VectorGPUStyle {
  /** RGBA palette index for fill. -1 means no fill. */
  fill: number;
  /** RGBA palette index for stroke. -1 means no stroke. */
  stroke: number;
  fillOpacity: number;
  strokeOpacity: number;
  opacity: number;
  strokeWidth: number;
  strokeScale0: number;
  strokeScale1: number;
  lineCap: number;
  lineJoin: number;
}

const LINE_VERTEX_STRIDE = 9;

/** GPU-ready geometry produced in the worker. */
export interface VectorGPUPlan {
  /** x,y in tile extent units; one style index per vertex. */
  polygonPositions: Int16Array;
  polygonStyles: Uint16Array;
  polygonIndices: Uint32Array;
  /**
   * The vertex shader expands this centerline into a stroke.
   * - 9n+0: current x
   * - 9n+1: current y
   * - 9n+2: previous x
   * - 9n+3: previous y
   * - 9n+4: next x
   * - 9n+5: next y
   * - 9n+6: side
   * - 9n+7: style reference
   * - 9n+8: cap
   */
  lineVertices: Int16Array;
  lineIndices: Uint32Array;

  /** Number of vertices/indices in each geometry stream. */
  polygonVertexCount: number;
  polygonIndexCount: number;
  lineVertexCount: number;
  lineIndexCount: number;

  /** Packed RGBA palette, four bytes per entry. */
  palette: Uint8Array;

  /** Style data, four float32 values per texel. */
  styleData: Float32Array;

  /** Maximum texture width required by the style texture. */
  styleTextureWidth: number;

  /** Number of palette entries. */
  paletteCount: number;
}

const EMPTY_STYLE = -1;
const DEFAULT_BACKGROUND = '#f2f2f7';

// TODO: serve [r,g,b,a]
function parseRGBA(value: string | undefined, fallback: [number, number, number, number]): [number, number, number, number] {
  if (!value) return fallback;
  const text = value.trim().toLowerCase();

  if (text[0] === '#') {
    const hex = text.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      return [parseInt(hex[0] + hex[0], 16), parseInt(hex[1] + hex[1], 16), parseInt(hex[2] + hex[2], 16), hex.length === 4 ? parseInt(hex[3] + hex[3], 16) : 255];
    }
    if (hex.length === 6 || hex.length === 8) {
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255];
    }
  }

  const match = text.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/);
  if (match) {
    const alpha = match[4] === undefined ? 255 : match[4].endsWith('%') ? Math.round(parseFloat(match[4]) * 2.55) : Math.round(parseFloat(match[4]) * 255);
    return [Math.round(+match[1]), Math.round(+match[2]), Math.round(+match[3]), alpha];
  }

  // CSS named colors are deliberately not parsed here. Prefer compiling the palette
  // from the style compiler, where named colors can be normalized once.
  throw new Error(`Unsupported vector color: ${value}`);
}

function colorKey(value: string | undefined, fallback: [number, number, number, number]): string {
  const c = parseRGBA(value, fallback);
  return `${c[0]},${c[1]},${c[2]},${c[3]}`;
}

/**
 * - 0: butt
 * - 1: round
 * - 2: bavel
 */
function lineCapCode(cap: VectorTileStyle['stroke-linecap']): 0 | 1 | 2 {
  switch (cap) {
    case 'round':
      return 1;
    case 'square':
      return 2;
    default:
      return 0; // butt
  }
}

/**
 * - 0: miter
 * - 1: round
 * - 2: bavel
 */
function lineJoinCode(join: VectorTileStyle['stroke-linejoin']): 0 | 1 | 2 {
  switch (join) {
    case 'round':
      return 1;
    case 'bevel':
      return 2;
    default:
      return 0; // miter
  }
}

function createPalette(styles: Array<VectorTileStyle>): { palette: Uint8Array; indices: Map<string, number> } {
  const colors: number[] = [];
  const indices = new Map<string, number>();

  const add = (value: string | undefined, fallback: [number, number, number, number]): number => {
    if (!value) return EMPTY_STYLE;
    const key = colorKey(value, fallback);
    const existing = indices.get(key);
    if (existing !== undefined) return existing;
    const index = indices.size;
    indices.set(key, index);
    colors.push(...parseRGBA(value, fallback));
    return index;
  };

  for (const style of styles) {
    add(style.fill, [0, 0, 0, 255]);
    add(style.stroke, [0, 0, 0, 255]);
  }

  return { palette: Uint8Array.from(colors), indices };
}

function paletteIndex(value: string | undefined, fallback: [number, number, number, number], indices: Map<string, number>): number {
  if (!value) return EMPTY_STYLE;
  return indices.get(colorKey(value, fallback)) ?? EMPTY_STYLE;
}

function buildStyleData(styles: Array<VectorTileStyle>, paletteIndices: Map<string, number>): Float32Array {
  // Four RGBA32F texels per style:
  // 0: fill palette index, stroke palette index, fill opacity, stroke opacity
  // 1: overall opacity, reference width, scale0, scale1
  // 2: cap, join, unused, unused
  // 3: reserved for future style properties
  const data = new Float32Array(styles.length * 16);

  for (let i = 0; i < styles.length; i++) {
    const style = styles[i];
    const o = i * 16;
    data[o + 0] = paletteIndex(style.fill, [0, 0, 0, 255], paletteIndices);
    data[o + 1] = paletteIndex(style.stroke, [0, 0, 0, 255], paletteIndices);
    data[o + 2] = style['fill-opacity'] ?? 1;
    data[o + 3] = style['stroke-opacity'] ?? 1;

    data[o + 4] = style.opacity ?? 1;
    data[o + 5] = style['stroke-width'] ?? 0;
    data[o + 6] = style['stroke-width-scale']?.[0] ?? 1;
    data[o + 7] = style['stroke-width-scale']?.[1] ?? 1;

    data[o + 8] = lineCapCode(style['stroke-linecap']);
    data[o + 9] = lineJoinCode(style['stroke-linejoin']);
  }

  return data;
}

function buildPolygonGeometry(plan: VectorPlan, polygonParts: Array<number>, styleIndex: number, positions: number[], styles: number[], indices: number[]): void {
  const { coordinates, partStartIndices } = plan;
  const flat: number[] = [];
  const holes: number[] = [];
  let pointBase = positions.length / 2;

  for (let r = 0; r < polygonParts.length; r++) {
    const part = polygonParts[r];
    const start = partStartIndices[part];
    const end = partStartIndices[part + 1];
    if (end - start < 3) continue;

    if (flat.length > 0) holes.push(flat.length / 2);
    for (let p = start; p < end; p++) {
      flat.push(coordinates[p * 2], coordinates[p * 2 + 1]);
    }
  }

  if (flat.length < 6) return;

  const localIndices = earcut(flat, holes, 2);
  positions.push(...flat);
  for (let i = 0; i < flat.length / 2; i++) styles.push(styleIndex);
  for (const index of localIndices) indices.push(pointBase + index);
}

function buildLineGeometry(plan: VectorPlan, lineParts: Array<number>, styleIndex: number, vertices: number[], indices: number[]): void {
  const { coordinates, partStartIndices } = plan;

  const pushVertex = (point: number, prev: number, next: number, side: number, cap: number): number => {
    vertices.push(coordinates[point * 2], coordinates[point * 2 + 1], coordinates[prev * 2], coordinates[prev * 2 + 1], coordinates[next * 2], coordinates[next * 2 + 1], side, styleIndex, cap);
    return vertices.length / LINE_VERTEX_STRIDE - 1;
  };

  // Four vertices sharing one (point, prev, next) triple, so the shader
  // resolves has0/has1 identically at all of them and every vertex writes
  // the same v_capCenter / v_capRadius / v_capOut. That constancy is what
  // removes the dependence on which vertex is provoking.
  const pushCapQuad = (point: number, prev: number, next: number): void => {
    const bL = pushVertex(point, prev, next, -1, 1); // base, L
    const bR = pushVertex(point, prev, next, 1, 1); // base, R
    const tL = pushVertex(point, prev, next, -1, 2); // tip, L
    const tR = pushVertex(point, prev, next, 1, 2); // tip, R
    indices.push(bL, bR, tL, tL, bR, tR); // same winding pattern
  };

  for (const part of lineParts) {
    const start = partStartIndices[part];
    const end = partStartIndices[part + 1];
    const count = end - start;
    if (count < 2) continue;

    const first = start;
    const last = end - 1;

    // A ring must mitre across the seam instead of growing two caps.
    const closed = count > 2 && coordinates[first * 2] === coordinates[last * 2] && coordinates[first * 2 + 1] === coordinates[last * 2 + 1];

    const base = vertices.length / LINE_VERTEX_STRIDE;

    for (let i = 0; i < count; i++) {
      const point = start + i;
      const prev = i === 0 ? (closed ? last - 1 : point) : point - 1;
      const next = i === count - 1 ? (closed ? first + 1 : point) : point + 1;

      pushVertex(point, prev, next, -1, 0); // L
      pushVertex(point, prev, next, 1, 0); // R
    }

    for (let i = 0; i < count - 1; i++) {
      const a = base + i * 2; // L(i)
      const b = a + 1; // R(i)
      const c = a + 2; // L(i+1)
      const d = a + 3; // R(i+1)
      indices.push(a, b, c, c, b, d); // ΔL(i) R(i) L(i+1), ΔL(i+1) R(i) R(i+1)
    }

    // Appended AFTER the segment loop so the `base + i * 2` arithmetic
    // above never sees the cap vertices.
    if (!closed) {
      pushCapQuad(first, first, first + 1); // prev === point -> start
      pushCapQuad(last, last - 1, last); // next === point -> end
    }
  }
}

/**
 * Build transferable GPU geometry in the worker.
 *
 * Polygons are triangulated with earcut. Lines are converted to a reusable
 * per-point stroke representation; the vertex shader applies the current width,
 * cap and join rules, so zoom never requires rebuilding the mesh.
 */
export function buildVectorGPUPlan(vectorPlan: VectorPlan): VectorGPUPlan {
  const { palette, indices: paletteIndices } = createPalette(vectorPlan.styles);
  const styleData = buildStyleData(vectorPlan.styles, paletteIndices);

  const polygonPositions: number[] = [];
  const polygonStyles: number[] = [];
  const polygonIndices: number[] = [];
  const lineVertices: number[] = [];
  const lineIndices: number[] = [];

  for (let styleRun = 0; styleRun < vectorPlan.styleReferences.length; styleRun++) {
    const styleIndex = vectorPlan.styleReferences[styleRun];
    const descriptorStart = vectorPlan.styleStartIndices[styleRun];
    const descriptorEnd = vectorPlan.styleStartIndices[styleRun + 1];
    for (let descriptor = descriptorStart; descriptor < descriptorEnd; descriptor++) {
      const partStart = vectorPlan.descriptorStartIndices[descriptor];
      const partEnd = vectorPlan.descriptorStartIndices[descriptor + 1];
      const parts: number[] = [];
      for (let part = partStart; part < partEnd; part++) parts.push(part);

      if (vectorPlan.descriptorTypes[descriptor] === VECTOR_TILE_POLYGON) {
        buildPolygonGeometry(vectorPlan, parts, styleIndex, polygonPositions, polygonStyles, polygonIndices);
      } else if (vectorPlan.descriptorTypes[descriptor] === VECTOR_TILE_LINE) {
        buildLineGeometry(vectorPlan, parts, styleIndex, lineVertices, lineIndices);
      }
    }
  }

  const gpu: VectorGPUPlan = {
    polygonPositions: Int16Array.from(polygonPositions),
    polygonStyles: Uint16Array.from(polygonStyles),
    polygonIndices: Uint32Array.from(polygonIndices),
    lineVertices: Int16Array.from(lineVertices),
    lineIndices: Uint32Array.from(lineIndices),
    polygonVertexCount: polygonPositions.length / 2,
    polygonIndexCount: polygonIndices.length,
    lineVertexCount: lineVertices.length / LINE_VERTEX_STRIDE,
    lineIndexCount: lineIndices.length,
    palette,
    styleData,
    styleTextureWidth: Math.max(1, vectorPlan.styles.length * 4),
    paletteCount: palette.length / 4
  };

  return gpu;
}

function estimateGPUBytes(gpu: VectorGPUPlan): number {
  return gpu.polygonPositions.byteLength + gpu.polygonStyles.byteLength + gpu.polygonIndices.byteLength + gpu.lineVertices.byteLength + gpu.lineIndices.byteLength + gpu.palette.byteLength + gpu.styleData.byteLength;
}

export function buildVectorPlan(vectorTile: VectorTile): VectorPlan {
  const coordinates = new Int16Array(vectorTile.coordinates);
  const partStartIndices = new Int32Array(vectorTile.partStartIndices);
  const descriptorStartIndices = new Int32Array(vectorTile.descriptorStartIndices);
  const descriptorTypes = new Uint8Array(vectorTile.descriptorTypes);
  const styleReferences = new Int16Array(vectorTile.styleReferences);
  const styleStartIndices = new Int32Array(vectorTile.styleStartIndices);

  deltaDecode(coordinates, 2);
  deltaDecode(partStartIndices, 1);
  deltaDecode(descriptorStartIndices, 1);
  deltaDecode(styleReferences, 1);
  deltaDecode(styleStartIndices, 1);

  const geometryBytes = coordinates.byteLength + partStartIndices.byteLength + descriptorStartIndices.byteLength + descriptorTypes.byteLength + styleReferences.byteLength + styleStartIndices.byteLength;

  const base: VectorPlan = {
    type: 'Vector',
    extent: vectorTile.extent,
    buffer: vectorTile.buffer,
    zoom: vectorTile.zoom,
    coordinates,
    partStartIndices,
    descriptorStartIndices,
    descriptorTypes,
    styleReferences,
    styleStartIndices,
    styles: vectorTile.styles,
    gpu: undefined as unknown as VectorGPUPlan,
    geometryBytes,
    gpuBytes: 0,
    size: geometryBytes
  };

  base.gpu = buildVectorGPUPlan(base);
  base.gpuBytes = estimateGPUBytes(base.gpu);
  base.size = geometryBytes + base.gpuBytes;
  return base;
}

// Version 2 wire format stores ONLY on/off-curve vertices, not M/L/Q/C commands.
// Commands below are an in-memory rasterizer interface, reconstructed after fetch.
export type Command = ['M' | 'L', number, number] | ['Q', number, number, number, number] | ['C', number, number, number, number, number, number] | ['Z'];
export interface Glyph {
  id: number;
  advance: number;
  lsb: number;
  bbox: [number, number, number, number] | null;
  commands: Command[];
}
export interface GlyphFontInfo {
  faceId: string;
  unitsPerEm: number;
  glyphCount: number;
}
export interface FontIndex {
  version: 2;
  faceId: string;
  weight: 400;
  outline: 'quadratic' | 'cubic';
  coordinatePrecision: number;
  unitsPerEm: number;
  ascender: number;
  descender: number;
  lineGap: number;
  glyphCount: number;
  shardSize: number;
  codePointDeltas: number[];
  glyphIdDeltas: number[];
}
export interface GlyphShardWire {
  version: 2;
  faceId: string;
  base: number;
  contourCounts: number[];
  pointCounts: number[];
  coords: number[];
  onCurve: string;
  advances: number[];
  bearings: number[];
}
export interface GlyphShard {
  version: 2;
  faceId: string;
  base: number;
  glyphs: Glyph[];
}
interface Vertex {
  x: number;
  y: number;
  on: boolean;
}
const mid = (a: Vertex, b: Vertex): Vertex => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true });
/** Reconstruct the implicit TrueType midpoints, or CFF cubic control pairs. */
function commandsFromContour(points: Vertex[], outline: FontIndex['outline']): Command[] {
  if (!points.length) throw Error('Empty contour');
  const commands: Command[] = [];
  if (outline === 'cubic') {
    if (!points[0].on) throw Error('Cubic contour must start on-curve');
    commands.push(['M', points[0].x, points[0].y]);
    for (let i = 1; i < points.length; ) {
      const p = points[i];
      if (p.on) {
        commands.push(['L', p.x, p.y]);
        i++;
      } else {
        const b = points[i + 1],
          end = points[i + 2];
        if (!b || !end || b.on || !end.on) throw Error('Invalid cubic control sequence');
        commands.push(['C', p.x, p.y, b.x, b.y, end.x, end.y]);
        i += 3;
      }
    }
  } else {
    const first = points[0],
      last = points[points.length - 1];
    let start: Vertex, seq: Vertex[];
    if (first.on) {
      start = first;
      seq = points.slice(1);
    } else if (last.on) {
      start = last;
      seq = points.slice(0, -1);
    } else {
      start = mid(last, first);
      seq = points.slice();
    }
    commands.push(['M', start.x, start.y]);
    for (let i = 0; i < seq.length; ) {
      const p = seq[i];
      if (p.on) {
        commands.push(['L', p.x, p.y]);
        i++;
      } else {
        const next = seq[i + 1] || start;
        if (next.on) {
          commands.push(['Q', p.x, p.y, next.x, next.y]);
          i += seq[i + 1] ? 2 : 1;
        } else {
          const end = mid(p, next);
          commands.push(['Q', p.x, p.y, end.x, end.y]);
          i++;
        }
      }
    }
  }
  commands.push(['Z']);
  return commands;
}
/** Decode once per fetched shard. Coordinates are design units, y up. */
export function decodeShard(w: GlyphShardWire, index: FontIndex): GlyphShard {
  if (w.version !== 2 || w.faceId !== index.faceId || !Number.isInteger(w.base) || w.base < 0) throw Error('Glyph shard mismatch');
  const count = w.advances.length;
  if (w.bearings.length !== count || w.contourCounts.length !== count || w.base + count > index.glyphCount) throw Error('Invalid glyph arrays');
  const raw = atob(w.onCurve);
  const totalPoints = w.pointCounts.reduce((a, b) => a + b, 0),
    totalContours = w.contourCounts.reduce((a, b) => a + b, 0);
  if (!w.pointCounts.every((n) => Number.isInteger(n) && n > 0) || !w.contourCounts.every((n) => Number.isInteger(n) && n >= 0) || totalContours !== w.pointCounts.length || totalPoints * 2 !== w.coords.length || raw.length !== Math.ceil(totalPoints / 8)) throw Error('Invalid contour arrays');
  const glyphs: Glyph[] = [];
  let ci = 0,
    pi = 0,
    x = 0,
    y = 0;
  const precision = index.coordinatePrecision;
  if (!Number.isInteger(precision) || precision < 1) throw Error('Invalid precision');
  for (let g = 0; g < count; g++) {
    const commands: Command[] = [];
    let x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;
    for (let c = 0; c < w.contourCounts[g]; c++) {
      const n = w.pointCounts[ci++],
        points: Vertex[] = [];
      for (let k = 0; k < n; k++, pi++) {
        const dx = w.coords[pi * 2],
          dy = w.coords[pi * 2 + 1];
        if (!Number.isFinite(dx) || !Number.isFinite(dy)) throw Error('Invalid vertex');
        x += Math.round(dx * precision);
        y += Math.round(dy * precision);
        const vx = x / precision,
          vy = y / precision,
          on = ((raw.charCodeAt(pi >> 3) >> (pi & 7)) & 1) !== 0;
        points.push({ x: vx, y: vy, on });
        x0 = Math.min(x0, vx);
        y0 = Math.min(y0, vy);
        x1 = Math.max(x1, vx);
        y1 = Math.max(y1, vy);
      }
      commands.push(...commandsFromContour(points, index.outline));
    }
    // Control-point bounds are conservative, but never crop a Bézier curve.
    glyphs.push({ id: w.base + g, advance: w.advances[g], lsb: w.bearings[g], bbox: commands.length ? [x0, y0, x1, y1] : null, commands });
  }
  return { version: 2, faceId: w.faceId, base: w.base, glyphs };
}
export function decodeCmap(index: FontIndex): Map<number, number> {
  if (index.codePointDeltas.length !== index.glyphIdDeltas.length) throw Error('Invalid cmap');
  let cp = 0,
    gid = 0;
  const map = new Map<number, number>();
  for (let i = 0; i < index.codePointDeltas.length; i++) {
    cp += index.codePointDeltas[i];
    gid += index.glyphIdDeltas[i];
    if (!Number.isInteger(cp) || !Number.isInteger(gid) || cp < 0 || cp > 0x10ffff || gid < 1 || gid >= index.glyphCount) throw Error('Invalid cmap entry');
    map.set(cp, gid);
  }
  return map;
}
/** Fetch raw .gz assets without Content-Encoding. If your server sets Content-Encoding:gzip,
 * fetch() has already decompressed them: use response.json() instead. Never do both. */
export async function fetchGzipJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw Error(`${response.status} ${url}`);
  if (!response.body) throw Error('Missing response body');
  return JSON.parse(await new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).text()) as T;
}

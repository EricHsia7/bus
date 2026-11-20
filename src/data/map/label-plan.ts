import { CircleStyleProperties, LabelFeatureCollection, LabelKind, LineStringLabelFeature, PointLabelFeature, TextStyleProperties } from './label';
import { Glyph } from './glyph-types';
import { ContourFontSource } from './glyph-source';

export const LabelDesignSize = 256;
export const LabelLineHeight = 1.2;
export const LabelCollisionPadding = 3;
export const LabelAngleBuckets = 256;

export const LabelFeaturesStride = 6;
export const LabelBoundsStride = 7;
export const LabelCollisionStride = 4;
export const LabelScalesStride = 2;

/** Per placement: anchor x/y in extent, baseline offset x/y in design units, angle in radians. */
export const LabelPlacementStride = 5;
export const LabelKindToCode: Record<LabelKind, number> = { text: 0, marker: 1, point: 2, shield: 3, circle: 4 };
export const LabelFlagAlongLine = 1;
export const LabelFlatZoomScaled = 2;
export const LabelFlagHasGlyphs = 4;
export const LabelFlagSeam = 8;

export interface LabelGlyphPlan {
  version: 2;
  faceId: string;
  extent: number;
  zoom: number;
  designSize: number;
  glyphData: Glyph[];
  glyphIds: Uint32Array;
  placements: Float32Array;
  features: Uint32Array;
  bounds: Float32Array;
  collisions: Float32Array;
  scales: Float32Array;
  textStyles: TextStyleProperties[];
  circleStyles: CircleStyleProperties[];
  size: number;
}

interface LocalPlacement {
  glyphId: number;
  anchorX: number;
  anchorY: number;
  offsetX: number;
  offsetY: number;
  angle: number;
}

interface LocalFeature {
  kind: LabelKind;
  styleIndex: number;
  flags: number;
  scale0: number;
  scale1: number;
  dedupeHash: number;
  anchorX: number;
  anchorY: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  offsetY: number;
  placements: LocalPlacement[];
}

interface CollisionBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface PlacedFeature {
  local: LocalFeature;
  collision: CollisionBox;
}

function boxesIntersect(a: CollisionBox, b: CollisionBox): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

function hashLabel(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
function scaleFor(style: TextStyleProperties | CircleStyleProperties): [number, number] {
  const s = 'text-scale' in style ? style['text-scale'] : 'marker-scale' in style ? style['marker-scale'] : undefined;
  return s ? [s[0], s[1]] : [1, 1];
}
function glyphFor(map: Map<number, Glyph>, ch: string): Glyph {
  const glyph = map.get(ch.codePointAt(0)!);
  if (!glyph) throw Error('Glyph missing from preloaded tile');
  return glyph;
}
function measure(map: Map<number, Glyph>, text: string, size: number, upem: number): number {
  let n = 0;
  for (const c of text) n += (glyphFor(map, c).advance * size) / upem;
  return n;
}
/** Like the existing planner, this is simple codepoint layout, not a shaping engine. */
function wrap(map: Map<number, Glyph>, text: string, width: number, size: number, upem: number): string[] {
  if (!(width > 0) || measure(map, text, size, upem) <= width) return [text];
  const lines: string[] = [];
  let line = '';
  const push = () => {
    if (line) lines.push(line);
    line = '';
  };
  for (const token of text.split(/(\s+)/)) {
    if (!token) continue;
    if (/^\s+$/.test(token)) {
      if (line) line += ' ';
      continue;
    }
    if (measure(map, line + token, size, upem) <= width) {
      line += token;
      continue;
    }
    if (measure(map, token, size, upem) <= width) {
      push();
      line = token;
      continue;
    }
    for (const ch of token) {
      if (line && measure(map, line + ch, size, upem) > width) {
        push();
        line = ch;
      } else line += ch;
    }
  }
  push();
  return lines.length ? lines : [text];
}
interface Rect {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
function glyphBounds(g: Glyph, size: number, upem: number, pad: number): Rect | null {
  if (!g.bbox) return null;
  const s = size / upem,
    [x0, y0, x1, y1] = g.bbox;
  return { minX: x0 * s - pad, minY: -y1 * s - pad, maxX: x1 * s + pad, maxY: -y0 * s + pad };
}
function haloPad(style: TextStyleProperties): number {
  return (style['text-halo-fill'] ? Math.max(0, style['text-halo-radius'] ?? 0) / 2 : 0) + 1;
}
function planPoint(feature: PointLabelFeature, style: TextStyleProperties, map: Map<number, Glyph>, upem: number): LocalFeature | null {
  if (feature.properties.kind !== 'text' || !style['text-size']) return null;
  const text = feature.properties.label,
    size = style['text-size'],
    [sx, sy] = scaleFor(style),
    [x, y] = feature.geometry.coordinates,
    lines = wrap(map, text, style['text-wrap-width'] ?? 0, size, upem),
    pad = haloPad(style),
    placements: LocalPlacement[] = [];
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (let l = 0; l < lines.length; l++) {
    let pen = -measure(map, lines[l], size, upem) / 2;
    const baseline = (l - (lines.length - 1) / 2) * size * LabelLineHeight;
    for (const ch of lines[l]) {
      const g = glyphFor(map, ch),
        b = glyphBounds(g, size, upem, pad);
      if (b) {
        placements.push({ glyphId: g.id, anchorX: x, anchorY: y, offsetX: pen, offsetY: baseline, angle: 0 });
        minX = Math.min(minX, pen + b.minX);
        maxX = Math.max(maxX, pen + b.maxX);
        minY = Math.min(minY, baseline + b.minY);
        maxY = Math.max(maxY, baseline + b.maxY);
      }
      pen += (g.advance * size) / upem;
    }
  }
  if (!placements.length) return null;
  const cx = (minX + maxX) / 2,
    cy = (minY + maxY) / 2;
  for (const p of placements) {
    p.offsetX -= cx;
    p.offsetY -= cy;
  }
  return { kind: 'text', styleIndex: feature.properties.style, flags: LabelFlatZoomScaled | LabelFlagHasGlyphs, scale0: sx, scale1: sy, dedupeHash: hashLabel(`${style.layer}\0${text}`), anchorX: x, anchorY: y, minX: minX - cx, minY: minY - cy, maxX: maxX - cx, maxY: maxY - cy, offsetY: style['text-dy'] ?? 0, placements };
}
function planLine(feature: LineStringLabelFeature, style: TextStyleProperties, map: Map<number, Glyph>, upem: number, extent: number): LocalFeature | null {
  const size = style['text-size'];
  if (!size) return null;
  const [sx, sy] = scaleFor(style),
    chars = Array.from(feature.properties.label),
    { coordinates, angles } = feature.geometry,
    n = Math.min(chars.length, coordinates.length, angles.length),
    pad = haloPad(style),
    unit = extent / LabelDesignSize,
    placements: LocalPlacement[] = [];
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity,
    sumX = 0,
    sumY = 0;
  for (let i = 0; i < n; i++) {
    const g = glyphFor(map, chars[i]),
      b = glyphBounds(g, size, upem, pad);
    if (!b) continue;
    const [x, y] = coordinates[i],
      bucket = ((Math.round((angles[i] / extent) * LabelAngleBuckets) % LabelAngleBuckets) + LabelAngleBuckets) % LabelAngleBuckets,
      angle = (bucket / LabelAngleBuckets) * 2 * Math.PI;
    const ox = -(b.minX + b.maxX) / 2,
      oy = -(b.minY + b.maxY) / 2;
    placements.push({ glyphId: g.id, anchorX: x, anchorY: y, offsetX: ox, offsetY: oy, angle });
    sumX += x;
    sumY += y;
    const hw = ((b.maxX - b.minX) * sx * unit) / 2,
      hh = ((b.maxY - b.minY) * sx * unit) / 2,
      c = Math.cos(angle),
      s = Math.sin(angle),
      wx = Math.abs(hw * c) + Math.abs(hh * s),
      wy = Math.abs(hw * s) + Math.abs(hh * c);
    minX = Math.min(minX, x - wx);
    maxX = Math.max(maxX, x + wx);
    minY = Math.min(minY, y - wy);
    maxY = Math.max(maxY, y + wy);
  }
  if (!placements.length) return null;
  return { kind: 'text', styleIndex: feature.properties.style, flags: LabelFlagAlongLine | LabelFlagHasGlyphs, scale0: sx, scale1: sy, dedupeHash: hashLabel(`${style.layer}\0${feature.properties.label}`), anchorX: sumX / placements.length, anchorY: sumY / placements.length, minX, minY, maxX, maxY, offsetY: 0, placements };
}
function planCircle(feature: PointLabelFeature, style: CircleStyleProperties): LocalFeature | null {
  const width = style['marker-width'];
  if (!width || !style['marker-fill']) return null;
  const [sx, sy] = scaleFor(style),
    r = width / 2 + (style['marker-line-color'] ? 0.5 : 0),
    [x, y] = feature.geometry.coordinates;
  return { kind: 'circle', styleIndex: feature.properties.style, flags: LabelFlatZoomScaled, scale0: sx, scale1: sy, dedupeHash: 0, anchorX: x, anchorY: y, minX: -r, minY: -r, maxX: r, maxY: r, offsetY: 0, placements: [] };
}
function worstCaseScale(local: LocalFeature): number {
  // Along-line labels are STATIC.
  // The per-character anchors were baked into extent space, so the footprint only follows the tile and never grows on its own.
  // scale0 (the value the bbox was baked with) already IS the worst case.
  if (local.flags & LabelFlagAlongLine) return local.scale0;

  if (!(local.flags & LabelFlatZoomScaled)) return local.scale0;

  // Point labels are DYNAMIC.
  // The renderer draws them at f(t) = (a + bt) * 2^-t, where a = scale0, b = scale1 - scale0, t in [0, 1]
  // f(0) = (a + 0) * 1 = scale0
  // f(1) = (a + b) / 2 = scale1 / 2
  // f'(t) = b * 2^-t + (a + bt) * 2^-t * ln(2) * -1 = 2^-t * (b - (a + bt) * ln(2))
  // f'(t) = 0 -> b = (a + bt) * ln(2) -> t = 1 / ln(2) - a / b

  const delta = local.scale1 - local.scale0;
  let worst = Math.max(local.scale0, local.scale1 / 2);

  if (delta !== 0) {
    const turning = 1 / Math.LN2 - local.scale0 / delta;
    if (turning > 0 && turning < 1) {
      worst = Math.max(worst, (local.scale0 + delta * turning) * Math.pow(2, -turning));
    }
  }

  return worst;
}

/**
 * Worst-case collision box in extent space, padded.
 *
 * Mirrors the renderer's former box maths exactly, one frame of reference
 * earlier: `designToExtent * (tileWidth / extent) === tileWidth / designSize`,
 * which is precisely the renderer's `designToPixel`, so the pixel box the
 * renderer would have computed is recovered by a single multiplication.
 */
function computeCollisionBox(local: LocalFeature, extent: number): CollisionBox {
  const designToExtent = extent / LabelDesignSize;
  const padding = LabelCollisionPadding * designToExtent;

  // Along-line bounds are already absolute extent coordinates.
  if (local.flags & LabelFlagAlongLine) {
    return {
      minX: local.minX - padding,
      minY: local.minY - padding,
      maxX: local.maxX + padding,
      maxY: local.maxY + padding
    };
  }

  // Point bounds are design units relative to the anchor.
  const unit = worstCaseScale(local) * designToExtent;
  const anchorX = local.anchorX;
  // `text-dy` is a placement offset, not a glyph metric: convert it, but do NOT
  // multiply it by the text scale.
  const anchorY = local.anchorY + local.offsetY * designToExtent;

  return {
    minX: anchorX + local.minX * unit - padding,
    minY: anchorY + local.minY * unit - padding,
    maxX: anchorX + local.maxX * unit + padding,
    maxY: anchorY + local.maxY * unit + padding
  };
}

/**
 * Uniform grid over the tile and its buffer, so collision stays roughly linear.
 *
 * The grid deliberately spans one whole tile width of margin on every side.
 * Tiles are buffered, so a large share of features belong to geometry that
 * spills past the tile edge, and their boxes live in negative or beyond-extent
 * coordinates. Addressing that margin is what lets two out-of-tile boxes be
 * compared against each other; anything further out clamps into the border
 * cells, which is merely conservative because `boxesIntersect` still decides.
 */
class PlanCollisionIndex {
  private readonly cellSize: number;
  private readonly origin: number;
  private readonly columns: number;
  private readonly rows: number;
  private readonly cells: Array<Array<CollisionBox> | undefined>;

  constructor(extent: number, columnsPerTile: number = 16) {
    const perTile = Math.max(1, columnsPerTile);
    this.cellSize = Math.max(1, extent / perTile);
    this.origin = -extent;
    this.columns = perTile * 3;
    this.rows = this.columns;
    this.cells = new Array(this.columns * this.rows);
  }

  private column(value: number): number {
    const index = Math.floor((value - this.origin) / this.cellSize);
    return Math.min(this.columns - 1, Math.max(0, index));
  }

  private row(value: number): number {
    const index = Math.floor((value - this.origin) / this.cellSize);
    return Math.min(this.rows - 1, Math.max(0, index));
  }

  public collides(box: CollisionBox): boolean {
    const minColumn = this.column(box.minX);
    const maxColumn = this.column(box.maxX);
    const minRow = this.row(box.minY);
    const maxRow = this.row(box.maxY);

    for (let row = minRow; row <= maxRow; row++) {
      for (let column = minColumn; column <= maxColumn; column++) {
        const cell = this.cells[row * this.columns + column];
        if (!cell) continue;
        for (const other of cell) {
          if (boxesIntersect(box, other)) return true;
        }
      }
    }

    return false;
  }

  public insert(box: CollisionBox): void {
    const minColumn = this.column(box.minX);
    const maxColumn = this.column(box.maxX);
    const minRow = this.row(box.minY);
    const maxRow = this.row(box.maxY);

    for (let row = minRow; row <= maxRow; row++) {
      for (let column = minColumn; column <= maxColumn; column++) {
        const index = row * this.columns + column;
        const cell = this.cells[index];
        if (cell) cell.push(box);
        else this.cells[index] = [box];
      }
    }
  }
}

/**
 * Resolves collision for one tile, in feature order (earlier features win).
 *
 * Losers are dropped before the atlas is composed, so a label that can never be
 * drawn also stops costing a sprite, a placement row and sheet area.
 */
function resolveTileCollisions(locals: Array<LocalFeature>, extent: number): Array<PlacedFeature> {
  const index = new PlanCollisionIndex(extent);
  const placed: Array<PlacedFeature> = [];

  for (const local of locals) {
    const collision = computeCollisionBox(local, extent);
    if (index.collides(collision)) continue;
    index.insert(collision);
    placed.push({ local, collision });
  }

  return placed;
}

/** Build once in the worker from contours. No font file or Canvas2D text API. */
export async function buildLabelGlyphPlan(collection: LabelFeatureCollection, font: ContourFontSource): Promise<LabelGlyphPlan> {
  const extent = collection.extent || 1;
  const texts: string[] = [];
  for (const f of collection.features)
    if (f.properties.kind === 'text') {
      texts.push(f.properties.label);
      if (/\s/u.test(f.properties.label) && !f.properties.label.includes(' ')) texts.push(' ');
    }
  const map = await font.getGlyphs(texts),
    locals: LocalFeature[] = [];
  for (const f of collection.features) {
    let local: LocalFeature | null = null;
    if (f.geometry.type === 'LineString') {
      const style = collection.textStyles[f.properties.style];
      if (style) local = planLine(f as LineStringLabelFeature, style, map, font.index.unitsPerEm, extent);
    } else if (f.properties.kind === 'text') {
      const style = collection.textStyles[f.properties.style];
      if (style) local = planPoint(f as PointLabelFeature, style, map, font.index.unitsPerEm);
    } else if (f.properties.kind === 'circle') {
      const style = collection.circleStyles[f.properties.style];
      if (style) local = planCircle(f as PointLabelFeature, style);
    } // Existing planner also skips icon/shield features.
    if (local) locals.push(local);
  }
  const placed = resolveTileCollisions(locals, extent);
  let pc = 0;
  for (const x of placed) pc += x.local.placements.length;
  const glyphIds = new Uint32Array(pc),
    placements = new Float32Array(pc * LabelPlacementStride),
    features = new Uint32Array(placed.length * LabelFeaturesStride),
    bounds = new Float32Array(placed.length * LabelBoundsStride),
    collisions = new Float32Array(placed.length * LabelCollisionStride),
    scales = new Float32Array(placed.length * LabelScalesStride);
  let p = 0;
  for (let i = 0; i < placed.length; i++) {
    const { local: l, collision: c } = placed[i],
      start = p;
    for (const q of l.placements) {
      glyphIds[p] = q.glyphId;
      placements.set([q.anchorX, q.anchorY, q.offsetX, q.offsetY, q.angle], p * LabelPlacementStride);
      p++;
    }
    let flags = l.flags;
    if (c.minX < 0 || c.minY < 0 || c.maxX > extent || c.maxY > extent) flags |= LabelFlagSeam;
    features.set([LabelKindToCode[l.kind], l.styleIndex, start, p - start, l.dedupeHash, flags], i * LabelFeaturesStride);
    bounds.set([l.anchorX, l.anchorY, l.minX, l.minY, l.maxX, l.maxY, l.offsetY], i * LabelBoundsStride);
    collisions.set([c.minX, c.minY, c.maxX, c.maxY], i * LabelCollisionStride);
    scales.set([l.scale0, l.scale1], i * LabelScalesStride);
  }
  const used = new Set(glyphIds),
    glyphData: Array<Glyph> = [];
  for (const g of map.values()) if (used.delete(g.id)) glyphData.push(g);
  if (used.size) throw Error('Plan has unresolved glyph IDs');
  let glyphBytes = 0;
  for (const g of glyphData) glyphBytes += 64 + g.commands.length * 64;
  return { version: 2, faceId: font.index.faceId, extent, zoom: collection.zoom, designSize: LabelDesignSize, glyphData, glyphIds, placements, features, bounds, collisions, scales, textStyles: collection.textStyles, circleStyles: collection.circleStyles, size: glyphBytes + glyphIds.byteLength + placements.byteLength + features.byteLength + bounds.byteLength + collisions.byteLength + scales.byteLength };
}
export function emptyLabelGlyphPlan(): LabelGlyphPlan {
  return { version: 2, faceId: '', extent: 1, zoom: 0, designSize: LabelDesignSize, glyphData: [], glyphIds: new Uint32Array(), placements: new Float32Array(), features: new Uint32Array(), bounds: new Float32Array(), collisions: new Float32Array(), scales: new Float32Array(), textStyles: [], circleStyles: [], size: 0 };
}

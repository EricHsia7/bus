import { MapLoaderTile } from '.';
import { CircleStyleProperties, IconStyleProperties, LabelFeature, LabelFeatureCollection, LabelKind, LineStringLabelFeature, PointLabelFeature, TextStyleProperties } from './label';

/**
 * Font sizes, halo radii, offsets and marker widths in the label data are authored
 * against a 256x256 tile. Everything the planner emits is expressed in that space,
 * so the plan is resolution independent and survives a device pixel ratio change.
 */
export const LABEL_DESIGN_SIZE = 256;

/** Multiplier applied to the font size to get the baseline-to-baseline distance of wrapped lines. */
export const LABEL_LINE_HEIGHT_RATIO = 1.2;

/** Extra breathing room around every label box, in 256-space units. */
export const LABEL_COLLISION_PADDING = 3;

/**
 * `angles` are encoded as a fraction of `extent`, matching the coordinate encoding,
 * so a full turn is one extent. Kept as one constant because both threads decode it.
 */
export function decodeLabelAngle(angle: number, extent: number): number {
  return (angle / extent) * 2 * Math.PI || 0;
}

// Typed array strides

/** `glyphs`: [sheetX, sheetY, sheetWidth, sheetHeight] in sprite sheet pixels. */
export const GLYPH_STRIDE = 4;
/**
 * `placements`: [glyphIndex, anchorX, anchorY, offsetX, offsetY, angle, width, height].
 *
 * - `anchorX/anchorY` are tile coordinates in `extent` units. Point labels repeat the
 *   feature anchor on every glyph; along-line labels carry their own per-character anchor.
 * - `offsetX/offsetY/width/height` are 256-space units **at text-scale 1**, so the main
 *   thread only has to multiply by the scale it resolves for the current fractional zoom.
 * - `angle` is radians, applied about the anchor. 0 for everything but along-line text.
 */
export const PLACEMENT_STRIDE = 8;
/** `features`: [kind, styleIndex, placementStart, placementCount, dedupeHash, flags]. */
export const FEATURE_U32_STRIDE = 6;
/** `bounds`: [anchorX, anchorY, minX, minY, maxX, maxY, offsetY]. See `LABEL_FLAG_ALONG_LINE`. */
export const FEATURE_F32_STRIDE = 7;

export const LABEL_KIND_CODES: Record<LabelKind, number> = { text: 0, marker: 1, point: 2, shield: 3, circle: 4 };
export const LABEL_KINDS_BY_CODE: Array<LabelKind> = ['text', 'marker', 'point', 'shield', 'circle'];

/**
 * The box in `bounds` is absolute, in `extent` units, instead of anchor relative and in
 * 256-space. Along-line labels are pinned to the geometry, so their box cannot be derived
 * by scaling a single anchor relative box.
 */
export const LABEL_FLAG_ALONG_LINE = 1 << 0;
/** Sizes interpolate across `text-scale` at fractional zoom. Only point-placed text sets this. */
export const LABEL_FLAG_ZOOM_SCALED = 1 << 1;
/** The feature draws at least one sprite. Circles are the only kind that does not. */
export const LABEL_FLAG_HAS_GLYPHS = 1 << 2;

/**
 * Everything the main thread needs to draw one tile's labels at any fractional zoom,
 * with no access to fonts, styles or the feature collection.
 *
 * The plan is built once per tile off the main thread and then cached there. Placements are
 * laid out at the **worst case** (largest) size the tile can reach, so line breaking and the
 * reserved boxes never have to be recomputed while zooming inside `[zoom, zoom + 1)`.
 *
 * All bulk data is in typed arrays whose buffers are transferred, so handing a plan across
 * the thread boundary copies nothing.
 */
export interface LabelGlyphPlan {
  /** `${x}.${y}.${z}`, matching the raster tile key. */
  key: string;
  x: number;
  y: number;
  z: number;
  /** Tile coordinate extent the anchors are expressed in. */
  extent: number;
  /** The tile's own zoom (`tZ`). Lower anchor of the `text-scale` interval. */
  zoom: number;
  /** Units the 256-space metrics are authored against, carried so the consumer needs no constant. */
  designSize: number;
  /** Every glyph and icon the tile draws, pre-composited with its fill and halo. */
  sheet: ImageBitmap | null;
  /** Sprite rectangles into `sheet`, `GLYPH_STRIDE` floats each. */
  glyphs: Float32Array;
  /** Worst-case placements, `PLACEMENT_STRIDE` floats each. */
  placements: Float32Array;
  /** Feature records in server priority order, `FEATURE_U32_STRIDE` uints each. */
  features: Uint32Array;
  /** Feature anchors and worst-case boxes, `FEATURE_F32_STRIDE` floats each. */
  bounds: Float32Array;
  /**
   * The `text-scale` interval `[s0, s1]` per feature, so the renderer can resolve a size at
   * a fractional zoom without the style table. Icons and circles store `[1, 1]`.
   */
  scales: Float32Array;
  /** Circles are vectors, not sprites, so their paint stays as data. Indexed by `styleIndex`. */
  circleStyles: Array<CircleStyleProperties>;
  /** Resolved text per feature, kept for debugging. Deduping uses the hash in `features`. */
  labels: Array<string>;
}

/** The buffers whose ownership moves with the plan. Pass as `postMessage`'s transfer list. */
export function getLabelGlyphPlanTransferables(plan: LabelGlyphPlan): Array<Transferable> {
  const transferables: Array<Transferable> = [plan.glyphs.buffer, plan.placements.buffer, plan.features.buffer, plan.bounds.buffer, plan.scales.buffer];
  if (plan.sheet) transferables.push(plan.sheet);
  return transferables;
}

/** Frees a plan the main thread has evicted. Typed arrays are garbage collected, the bitmap is not. */
export function disposeLabelGlyphPlan(plan: LabelGlyphPlan): void {
  plan.sheet?.close();
  plan.sheet = null;
}

// Glyph cache

interface AtlasPage {
  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;
  /** Shelf packer cursor. */
  shelfX: number;
  shelfY: number;
  shelfHeight: number;
}

interface GlyphSprite {
  page: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  /** Offset from the pen origin to the sprite's left edge, in 256-space units at text-scale 1. */
  bearingX: number;
  /** Offset from the baseline to the sprite's top edge, in 256-space units at text-scale 1. */
  bearingY: number;
  /** Pen advance, in 256-space units at text-scale 1. */
  advance: number;
  /** Sprite size in 256-space units at text-scale 1. */
  width: number;
  height: number;
}

/**
 * A style's rasterisation parameters, resolved once and reused for every tile that
 * references an equivalent style.
 */
interface StyleRaster {
  signature: string;
  font: string;
  /** `text-size` in 256-space units. */
  size: number;
  /** Largest multiplier the style can reach, i.e. `max(text-scale)`. Glyphs are baked at this size. */
  maxScale: number;
  /** Divisor turning a raster pixel metric into a 256-space metric at text-scale 1. */
  designPerPixel: number;
  fill: string;
  haloFill: string | null;
  /** Halo radius in raster pixels. */
  haloPixels: number;
  /** Font ascent and descent in 256-space units at text-scale 1, used to centre lines. */
  ascent: number;
  descent: number;
}

export interface LabelGlyphCacheOptions {
  /** Backing store size of one atlas page, in pixels. */
  pageSize?: number;
  /**
   * Oversampling applied on top of the style's own worst-case size. Glyphs are only ever
   * scaled down from the atlas, so this is what keeps them sharp on a HiDPI display.
   */
  pixelRatio?: number;
  /** Fallback font stack when `text-face-name` names nothing installed. */
  fontFamily?: string;
  fontWeight?: number;
}

/**
 * Rasterises each glyph once per style and keeps it for the lifetime of the worker.
 *
 * Fill and halo are baked into the sprite, which is why the cache is keyed per style rather
 * than per font: two styles sharing a font but not a colour cannot share a sprite, and a
 * style shared across tiles rasterises exactly once. Drawing a label is then a run of plain
 * `drawImage` calls with no paint state changes at all.
 */
export class LabelGlyphCache {
  private readonly pageSize: number;
  private readonly pixelRatio: number;
  private readonly fontFamily: string;
  private readonly fontWeight: number;

  private readonly pages: Array<AtlasPage> = [];
  private readonly sprites = new Map<string, GlyphSprite | null>();
  private readonly styles = new Map<string, StyleRaster>();
  private readonly measureContext: OffscreenCanvasRenderingContext2D;

  constructor(options: LabelGlyphCacheOptions = {}) {
    this.pageSize = options.pageSize ?? 1024;
    this.pixelRatio = options.pixelRatio ?? 2;
    this.fontFamily = options.fontFamily ?? "'Noto Sans TC', sans-serif";
    this.fontWeight = options.fontWeight ?? 400;
    this.measureContext = new OffscreenCanvas(1, 1).getContext('2d') as OffscreenCanvasRenderingContext2D;
  }

  /** Number of glyphs currently held, for cache reporting. */
  public get size(): number {
    return this.sprites.size;
  }

  public clear(): void {
    this.sprites.clear();
    this.styles.clear();
    this.pages.length = 0;
  }

  private resolveFontFamily(faceName: string | undefined): string {
    if (!faceName) return this.fontFamily;
    // `text-face-name` is a Mapnik style face name, not a CSS family. Anything unresolved
    // falls through to the bundled stack rather than to the UA default.
    return `'${faceName.replace(/\s+(Regular|Book|Normal)$/i, '')}', ${this.fontFamily}`;
  }

  /**
   * Resolves and caches a style's rasterisation parameters. `size` and `maxScale` are passed
   * in because a shield's text size comes from `shield-size`, not from `text-size`.
   */
  public getStyleRaster(style: TextStyleProperties, size: number, maxScale: number): StyleRaster {
    const fill = style['text-fill'] ?? '#000000';
    const haloFill = style['text-halo-fill'] ?? null;
    const haloRadius = haloFill ? (style['text-halo-radius'] ?? 0) : 0;
    const family = this.resolveFontFamily(style['text-face-name']);
    const signature = `${family}|${this.fontWeight}|${size}|${maxScale}|${fill}|${haloFill ?? ''}|${haloRadius}`;

    const cached = this.styles.get(signature);
    if (cached) return cached;

    // Baked at the largest size the style can reach, so a fractional zoom only ever
    // downsamples the atlas.
    const fontPixels = size * maxScale * this.pixelRatio;
    const font = `${this.fontWeight} ${fontPixels}px ${family}`;
    const designPerPixel = 1 / (maxScale * this.pixelRatio);

    this.measureContext.font = font;
    const metrics = this.measureContext.measureText('Hg');
    const ascent = (metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent ?? fontPixels * 0.8) * designPerPixel;
    const descent = (metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent ?? fontPixels * 0.2) * designPerPixel;

    const raster: StyleRaster = {
      signature,
      font,
      size,
      maxScale,
      designPerPixel,
      fill,
      haloFill,
      haloPixels: haloRadius * maxScale * this.pixelRatio,
      ascent,
      descent
    };

    this.styles.set(signature, raster);
    return raster;
  }

  /** Advance only, for line breaking decisions that do not need a sprite. */
  public measureAdvance(raster: StyleRaster, character: string): number {
    this.measureContext.font = raster.font;
    return this.measureContext.measureText(character).width * raster.designPerPixel;
  }

  private allocatePage(): AtlasPage {
    const canvas = new OffscreenCanvas(this.pageSize, this.pageSize);
    const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.lineJoin = 'round';
    context.miterLimit = 2;
    const page: AtlasPage = { canvas, context, shelfX: 0, shelfY: 0, shelfHeight: 0 };
    this.pages.push(page);
    return page;
  }

  /** Shelf allocation. Glyphs of one style share a height, so shelves stay dense. */
  private allocate(width: number, height: number): { page: number; x: number; y: number } | null {
    if (width > this.pageSize || height > this.pageSize) return null;

    for (let index = 0; index < this.pages.length; index++) {
      const page = this.pages[index];
      if (page.shelfX + width <= this.pageSize && page.shelfY + Math.max(height, page.shelfHeight) <= this.pageSize) {
        const x = page.shelfX;
        const y = page.shelfY;
        page.shelfX += width;
        if (height > page.shelfHeight) page.shelfHeight = height;
        return { page: index, x, y };
      }
      // Close the shelf and open the next one down.
      if (page.shelfY + page.shelfHeight + height <= this.pageSize) {
        page.shelfY += page.shelfHeight;
        page.shelfX = width;
        page.shelfHeight = height;
        return { page: index, x: 0, y: page.shelfY };
      }
    }

    const page = this.allocatePage();
    page.shelfX = width;
    page.shelfHeight = height;
    return { page: this.pages.length - 1, x: 0, y: 0 };
  }

  /**
   * Returns the sprite for one character in one style, rasterising it on first use.
   * Whitespace and unrenderable characters cache as `null` so they are not measured twice.
   */
  public getGlyph(raster: StyleRaster, character: string): GlyphSprite | null {
    const key = `${raster.signature}\u0000${character}`;
    const cached = this.sprites.get(key);
    if (cached !== undefined) return cached;

    this.measureContext.font = raster.font;
    const metrics = this.measureContext.measureText(character);
    const advance = metrics.width * raster.designPerPixel;

    const left = metrics.actualBoundingBoxLeft ?? 0;
    const right = metrics.actualBoundingBoxRight ?? metrics.width;
    const ascent = metrics.actualBoundingBoxAscent ?? 0;
    const descent = metrics.actualBoundingBoxDescent ?? 0;

    const inkWidth = left + right;
    const inkHeight = ascent + descent;
    if (!(inkWidth > 0) || !(inkHeight > 0)) {
      // A space still advances the pen, so it is cached as a metrics-only entry.
      const blank: GlyphSprite | null = advance > 0 ? { page: -1, sx: 0, sy: 0, sw: 0, sh: 0, bearingX: 0, bearingY: 0, advance, width: 0, height: 0 } : null;
      this.sprites.set(key, blank);
      return blank;
    }

    // The halo is stroked centred on the outline, so half of it sits outside the ink box.
    // One extra pixel keeps bilinear sampling from pulling in the neighbouring sprite.
    const padding = Math.ceil(raster.haloPixels / 2) + 1;
    const spriteWidth = Math.ceil(inkWidth) + padding * 2;
    const spriteHeight = Math.ceil(inkHeight) + padding * 2;

    const slot = this.allocate(spriteWidth, spriteHeight);
    if (!slot) {
      this.sprites.set(key, null);
      return null;
    }

    const page = this.pages[slot.page];
    const originX = slot.x + padding + left;
    const originY = slot.y + padding + ascent;

    page.context.font = raster.font;
    page.context.clearRect(slot.x, slot.y, spriteWidth, spriteHeight);
    if (raster.haloFill && raster.haloPixels > 0) {
      page.context.strokeStyle = raster.haloFill;
      page.context.lineWidth = raster.haloPixels;
      page.context.strokeText(character, originX, originY);
    }
    page.context.fillStyle = raster.fill;
    page.context.fillText(character, originX, originY);

    const sprite: GlyphSprite = {
      page: slot.page,
      sx: slot.x,
      sy: slot.y,
      sw: spriteWidth,
      sh: spriteHeight,
      bearingX: -(left + padding) * raster.designPerPixel,
      bearingY: -(ascent + padding) * raster.designPerPixel,
      advance,
      width: spriteWidth * raster.designPerPixel,
      height: spriteHeight * raster.designPerPixel
    };

    this.sprites.set(key, sprite);
    return sprite;
  }

  /**
   * Copies a sprite out of its atlas page and into a tile sheet. The atlas stays owned by
   * the worker; only the composed sheet crosses the thread boundary.
   */
  public blit(sprite: GlyphSprite, context: OffscreenCanvasRenderingContext2D, x: number, y: number): void {
    if (sprite.page < 0) return;
    context.drawImage(this.pages[sprite.page].canvas, sprite.sx, sprite.sy, sprite.sw, sprite.sh, x, y, sprite.sw, sprite.sh);
  }
}

// Plan building

export interface BuildLabelGlyphPlanOptions {
  x: number;
  y: number;
  z: number;
  cache: LabelGlyphCache;
  /** Resolves an `icon` id to an already decoded sprite. Icons without one are skipped. */
  icons?: (icon: string) => ImageBitmap | null | undefined;
  /** Largest tile sheet edge, in pixels. */
  maxSheetSize?: number;
}

interface LocalPlacement {
  sprite: GlyphSprite | null;
  bitmap: ImageBitmap | null;
  anchorX: number;
  anchorY: number;
  offsetX: number;
  offsetY: number;
  angle: number;
  width: number;
  height: number;
  /** Sprite size in sheet pixels. Icons are packed at their natural size. */
  pixelWidth: number;
  pixelHeight: number;
}

interface LocalFeature {
  kind: LabelKind;
  styleIndex: number;
  flags: number;
  /** `text-scale`, carried through so the renderer can interpolate it per frame. */
  scale0: number;
  scale1: number;
  dedupeHash: number;
  label: string;
  anchorX: number;
  anchorY: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  offsetY: number;
  placements: Array<LocalPlacement>;
}

function hashLabel(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function getTextScale(style: TextStyleProperties): [number, number] {
  const scale = style['text-scale'];
  if (!scale) return [1, 1];
  return [scale[0], scale[1]];
}

/**
 * Pre-rasterises every character the tile can possibly draw, one style at a time.
 *
 * The server has already grouped the charsets by style, so this walks each style's font
 * exactly once instead of thrashing the canvas font state per feature, and every tile that
 * reuses a style finds the whole charset already resident.
 */
export function warmLabelGlyphCache(collection: LabelFeatureCollection, cache: LabelGlyphCache): void {
  for (const charset of collection.charsets) {
    if (charset.table === 'textStyles') {
      const style = collection.textStyles[charset.style];
      if (!style || !style['text-size']) continue;
      const scale = getTextScale(style);
      const raster = cache.getStyleRaster(style, style['text-size'], Math.max(scale[0], scale[1]));
      for (const character of charset.charset) cache.getGlyph(raster, character);
      continue;
    }

    // Icon styles only carry glyphs for shields, whose text is sized by `shield-size`.
    const style = collection.iconStyles[charset.style];
    if (!style || !style['shield-size']) continue;
    const raster = cache.getStyleRaster({ layer: style.layer }, style['shield-size'], 1);
    for (const character of charset.charset) cache.getGlyph(raster, character);
  }
}

/**
 * Breaks a label at `text-wrap-width`, falling back to per-character breaking for tokens
 * that do not fit, which is what keeps Chinese labels (no spaces) off one very long line.
 *
 * Measured at the worst-case scale on purpose: that is the size at which the label needs the
 * most lines, so the layout the main thread caches is the one that reserves the most space.
 */
function wrapLabel(cache: LabelGlyphCache, raster: StyleRaster, text: string, wrapWidth: number): Array<string> {
  if (!(wrapWidth > 0)) return [text];

  const measure = (value: string) => cache.measureAdvance(raster, value) * raster.maxScale;
  if (measure(text) <= wrapWidth) return [text];

  const lines: Array<string> = [];
  let line = '';

  const pushLine = () => {
    if (line.length > 0) lines.push(line);
    line = '';
  };

  for (const token of text.split(/(\s+)/)) {
    if (token.length === 0) continue;
    if (/^\s+$/.test(token)) {
      if (line.length > 0) line += ' ';
      continue;
    }

    const candidate = line + token;
    if (measure(candidate) <= wrapWidth) {
      line = candidate;
      continue;
    }

    if (measure(token) <= wrapWidth) {
      pushLine();
      line = token;
      continue;
    }

    for (const character of Array.from(token)) {
      const characterCandidate = line + character;
      if (line.length > 0 && measure(characterCandidate) > wrapWidth) {
        pushLine();
        line = character;
      } else {
        line = characterCandidate;
      }
    }
  }

  pushLine();
  return lines.length > 0 ? lines : [text];
}

/**
 * Lays a wrapped label out around (0, 0), centred horizontally and vertically, in 256-space
 * units at text-scale 1. `text-dy` is deliberately not folded in here: it is a placement
 * offset, so the main thread adds it after the scale multiply.
 */
function layoutCentredText(cache: LabelGlyphCache, raster: StyleRaster, lines: Array<string>, anchorX: number, anchorY: number): Array<LocalPlacement> {
  const placements: Array<LocalPlacement> = [];
  const lineHeight = raster.size * LABEL_LINE_HEIGHT_RATIO;
  const firstLineY = -((lines.length - 1) * lineHeight) / 2;
  // The block is centred on the anchor, so the baseline sits half an x-height below it.
  const baselineShift = (raster.ascent - raster.descent) / 2;

  for (let index = 0; index < lines.length; index++) {
    const characters = Array.from(lines[index]);

    let lineWidth = 0;
    for (const character of characters) {
      const sprite = cache.getGlyph(raster, character);
      if (sprite) lineWidth += sprite.advance;
    }

    let penX = -lineWidth / 2;
    const baselineY = firstLineY + index * lineHeight + baselineShift;

    for (const character of characters) {
      const sprite = cache.getGlyph(raster, character);
      if (!sprite) continue;
      if (sprite.width > 0) {
        placements.push({
          sprite,
          bitmap: null,
          anchorX,
          anchorY,
          offsetX: penX + sprite.bearingX,
          offsetY: baselineY + sprite.bearingY,
          angle: 0,
          width: sprite.width,
          height: sprite.height,
          pixelWidth: sprite.sw,
          pixelHeight: sprite.sh
        });
      }
      penX += sprite.advance;
    }
  }

  return placements;
}

/** Union of the placement boxes, in the same units the placements were laid out in. */
function measurePlacements(placements: Array<LocalPlacement>): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const placement of placements) {
    if (placement.offsetX < minX) minX = placement.offsetX;
    if (placement.offsetY < minY) minY = placement.offsetY;
    if (placement.offsetX + placement.width > maxX) maxX = placement.offsetX + placement.width;
    if (placement.offsetY + placement.height > maxY) maxY = placement.offsetY + placement.height;
  }

  if (minX > maxX) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  return { minX, minY, maxX, maxY };
}

/**
 * Along-line text. Each character keeps the anchor and tangent the server solved for it, so
 * the label stays welded to the street: the placement is fixed at the tile's own zoom and
 * only `text-scale[0]` is ever applied to the sizes.
 *
 * The reserved box is therefore absolute, in `extent` units, and is the union of the rotated
 * per-character boxes. The AABB of a rotated box over-reserves, which errs towards dropping a
 * colliding label rather than overlapping one.
 */
function planAlongLine(cache: LabelGlyphCache, feature: LineStringLabelFeature, style: TextStyleProperties, extent: number): LocalFeature | null {
  const size = style['text-size'];
  if (!size) return null;
  if (!feature.properties.label) return null;

  const scale = getTextScale(style);
  const raster = cache.getStyleRaster(style, size, Math.max(scale[0], scale[1]));
  const characters = Array.from(feature.properties.label);
  const { coordinates, angles } = feature.geometry;
  // Mismatched lengths are truncated to the shortest of the three defensively.
  const count = Math.min(characters.length, coordinates.length, angles.length);
  if (count === 0) return null;

  // The interval is defined on [z, z + 1), so the discrete placement still takes the
  // interval's lower end rather than an unscaled size.
  const fixedScale = scale[0];
  const designToExtent = extent / LABEL_DESIGN_SIZE;

  const placements: Array<LocalPlacement> = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let sumX = 0;
  let sumY = 0;

  for (let index = 0; index < count; index++) {
    const sprite = cache.getGlyph(raster, characters[index]);
    if (!sprite || sprite.width <= 0) continue;

    const anchorX = coordinates[index][0];
    const anchorY = coordinates[index][1];
    const angle = decodeLabelAngle(angles[index], extent);

    sumX += anchorX;
    sumY += anchorY;

    placements.push({
      sprite,
      bitmap: null,
      anchorX,
      anchorY,
      // Centred on its own anchor, like the per-character placement the server solved for.
      offsetX: -sprite.width / 2,
      offsetY: -sprite.height / 2,
      angle,
      width: sprite.width,
      height: sprite.height,
      pixelWidth: sprite.sw,
      pixelHeight: sprite.sh
    });

    // Rotated corners, resolved here so the main thread never has to rotate a box.
    const halfWidth = (sprite.width * fixedScale * designToExtent) / 2;
    const halfHeight = (sprite.height * fixedScale * designToExtent) / 2;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const spanX = Math.abs(halfWidth * cos) + Math.abs(halfHeight * sin);
    const spanY = Math.abs(halfWidth * sin) + Math.abs(halfHeight * cos);

    if (anchorX - spanX < minX) minX = anchorX - spanX;
    if (anchorY - spanY < minY) minY = anchorY - spanY;
    if (anchorX + spanX > maxX) maxX = anchorX + spanX;
    if (anchorY + spanY > maxY) maxY = anchorY + spanY;
  }

  if (placements.length === 0) return null;

  return {
    kind: 'text',
    styleIndex: feature.properties.style,
    flags: LABEL_FLAG_ALONG_LINE | LABEL_FLAG_HAS_GLYPHS,
    scale0: fixedScale,
    scale1: scale[1],
    dedupeHash: hashLabel(`${style.layer}\u0000${feature.properties.label}`),
    label: feature.properties.label,
    anchorX: sumX / placements.length,
    anchorY: sumY / placements.length,
    minX,
    minY,
    maxX,
    maxY,
    offsetY: 0,
    placements
  };
}

/** Point-placed text. Sizes interpolate across `text-scale`, so the box is stored at scale 1. */
function planPointText(cache: LabelGlyphCache, feature: PointLabelFeature, style: TextStyleProperties, label: string, styleIndex: number): LocalFeature | null {
  const size = style['text-size'];
  if (!size) return null;
  if (!label) return null;

  const scale = getTextScale(style);
  const raster = cache.getStyleRaster(style, size, Math.max(scale[0], scale[1]));
  const anchorX = feature.geometry.coordinates[0];
  const anchorY = feature.geometry.coordinates[1];

  const lines = wrapLabel(cache, raster, label, style['text-wrap-width'] ?? 0);
  const placements = layoutCentredText(cache, raster, lines, anchorX, anchorY);
  if (placements.length === 0) return null;

  const box = measurePlacements(placements);

  return {
    kind: 'text',
    styleIndex,
    flags: LABEL_FLAG_ZOOM_SCALED | LABEL_FLAG_HAS_GLYPHS,
    scale0: scale[0],
    scale1: scale[1],
    dedupeHash: hashLabel(`${style.layer}\u0000${label}`),
    label,
    anchorX,
    anchorY,
    ...box,
    offsetY: style['text-dy'] ?? 0,
    placements
  };
}

/**
 * Markers, points and shields. The icon is sized by `icon-width`/`icon-height`, which are
 * absolute 256-space sizes rather than glyph metrics, so icons do not take `text-scale`.
 * A shield additionally stamps its resolved text over the centre of the sprite.
 */
function planIcon(cache: LabelGlyphCache, feature: PointLabelFeature, style: IconStyleProperties, styleIndex: number, kind: 'marker' | 'point' | 'shield', icons: BuildLabelGlyphPlanOptions['icons']): LocalFeature | null {
  const anchorX = feature.geometry.coordinates[0];
  const anchorY = feature.geometry.coordinates[1];
  const label = (feature.properties as { label?: string }).label ?? '';

  const placements: Array<LocalPlacement> = [];
  const bitmap = style.icon && icons ? (icons(style.icon) ?? null) : null;

  if (bitmap) {
    const width = style['icon-width'] ?? bitmap.width;
    const height = style['icon-height'] ?? bitmap.height;
    placements.push({
      sprite: null,
      bitmap,
      anchorX,
      anchorY,
      offsetX: -width / 2,
      offsetY: -height / 2,
      angle: 0,
      width,
      height,
      pixelWidth: bitmap.width,
      pixelHeight: bitmap.height
    });
  }

  if (kind === 'shield' && label && style['shield-size']) {
    const raster = cache.getStyleRaster({ layer: style.layer }, style['shield-size'], 1);
    for (const placement of layoutCentredText(cache, raster, [label], anchorX, anchorY)) placements.push(placement);
  }

  // An icon that cannot be drawn reserves nothing, so it does not suppress a text label that can.
  if (placements.length === 0) return null;

  const box = measurePlacements(placements);

  return {
    kind,
    styleIndex,
    flags: LABEL_FLAG_HAS_GLYPHS,
    scale0: 1,
    scale1: 1,
    dedupeHash: label ? hashLabel(`${style.layer}\u0000${label}`) : 0,
    label,
    anchorX,
    anchorY,
    ...box,
    offsetY: 0,
    placements
  };
}

/** Circles are vectors, so they carry a box and a style index and no sprite at all. */
function planCircle(feature: PointLabelFeature, style: CircleStyleProperties, styleIndex: number): LocalFeature | null {
  const markerWidth = style['marker-width'];
  if (!markerWidth) return null;
  if (!style['marker-fill']) return null;

  // `marker-width` is a diameter in 256-space; the outline straddles the edge.
  const radius = markerWidth / 2 + (style['marker-line-color'] ? 0.5 : 0);

  return {
    kind: 'circle',
    styleIndex,
    flags: 0,
    scale0: 1,
    scale1: 1,
    dedupeHash: 0,
    label: '',
    anchorX: feature.geometry.coordinates[0],
    anchorY: feature.geometry.coordinates[1],
    minX: -radius,
    minY: -radius,
    maxX: radius,
    maxY: radius,
    offsetY: 0,
    placements: []
  };
}

/**
 * Packs every distinct sprite the tile references into one sheet and returns the sheet
 * rectangles. Sprites are deduplicated first, so a label repeating a character pays for it
 * once, and the sheet is only as large as the tile actually needs.
 */
function composeSheet(cache: LabelGlyphCache, features: Array<LocalFeature>, maxSheetSize: number): { sheet: ImageBitmap | null; glyphs: Float32Array; indices: Map<LocalPlacement, number> } {
  const order: Array<LocalPlacement> = [];
  const bySprite = new Map<unknown, number>();
  const indices = new Map<LocalPlacement, number>();

  for (const feature of features) {
    for (const placement of feature.placements) {
      const identity = placement.sprite ?? placement.bitmap;
      if (!identity) continue;
      const existing = bySprite.get(identity);
      if (existing !== undefined) {
        indices.set(placement, existing);
        continue;
      }
      const index = order.length;
      bySprite.set(identity, index);
      indices.set(placement, index);
      order.push(placement);
    }
  }

  if (order.length === 0) return { sheet: null, glyphs: new Float32Array(0), indices };

  // Tallest first, so the shelves stay tight.
  const sorted = order.map((placement, index) => ({ placement, index })).sort((a, b) => b.placement.pixelHeight - a.placement.pixelHeight);

  let sheetWidth = 0;
  for (const entry of sorted) sheetWidth = Math.max(sheetWidth, entry.placement.pixelWidth);
  sheetWidth = Math.min(maxSheetSize, Math.max(64, 1 << Math.ceil(Math.log2(Math.max(sheetWidth, Math.ceil(Math.sqrt(sorted.length)) * 32)))));

  const rects = new Float32Array(order.length * GLYPH_STRIDE);
  let shelfX = 0;
  let shelfY = 0;
  let shelfHeight = 0;

  for (const entry of sorted) {
    const { pixelWidth, pixelHeight } = entry.placement;
    if (shelfX + pixelWidth > sheetWidth) {
      shelfY += shelfHeight;
      shelfX = 0;
      shelfHeight = 0;
    }
    const offset = entry.index * GLYPH_STRIDE;
    rects[offset] = shelfX;
    rects[offset + 1] = shelfY;
    rects[offset + 2] = pixelWidth;
    rects[offset + 3] = pixelHeight;
    shelfX += pixelWidth;
    if (pixelHeight > shelfHeight) shelfHeight = pixelHeight;
  }

  const sheetHeight = Math.max(1, shelfY + shelfHeight);
  const canvas = new OffscreenCanvas(sheetWidth, sheetHeight);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  for (let index = 0; index < order.length; index++) {
    const placement = order[index];
    const offset = index * GLYPH_STRIDE;
    if (placement.sprite) {
      cache.blit(placement.sprite, context, rects[offset], rects[offset + 1]);
    } else if (placement.bitmap) {
      context.drawImage(placement.bitmap, rects[offset], rects[offset + 1]);
    }
  }

  return { sheet: canvas.transferToImageBitmap(), glyphs: rects, indices };
}

/**
 * Builds the drawable plan for one tile.
 *
 * Runs off the main thread: it rasterises glyphs, resolves styles, wraps and lays out every
 * label at its worst-case size, packs a sheet, and flattens the result into typed arrays.
 * The main thread then owns a self-contained tile that it can draw at any fractional zoom
 * without touching a font, a style table or the feature collection again.
 *
 * Features are kept in the order the server sent them, which is its priority order, so
 * collision resolution downstream is just "first one wins".
 */
export function buildLabelGlyphPlan(collection: LabelFeatureCollection, tile: MapLoaderTile, cache: LabelGlyphCache): LabelGlyphPlan {
  const { x, y, z } = tile;
  const extent = collection.extent || 1;

  warmLabelGlyphCache(collection, cache);

  const locals: Array<LocalFeature> = [];

  for (const feature of collection.features as Array<LabelFeature>) {
    const properties = feature.properties;
    let local: LocalFeature | null = null;

    if (feature.geometry.type === 'LineString') {
      const style = collection.textStyles[properties.style];
      if (style) local = planAlongLine(cache, feature as LineStringLabelFeature, style, extent);
    } else {
      const point = feature as PointLabelFeature;
      switch (properties.kind) {
        case 'text': {
          const style = collection.textStyles[properties.style];
          if (style) local = planPointText(cache, point, style, properties.label, properties.style);
          break;
        }
        case 'marker':
        case 'point':
        case 'shield': {
          const style = collection.iconStyles[properties.style];
          if (style) local = planIcon(cache, point, style, properties.style, properties.kind, tile.icons);
          break;
        }
        case 'circle': {
          const style = collection.circleStyles[properties.style];
          if (style) local = planCircle(point, style, properties.style);
          break;
        }
      }
    }

    if (local) locals.push(local);
  }

  const { sheet, glyphs, indices } = composeSheet(cache, locals, tile.maxSheetSize ?? 2048);

  let placementCount = 0;
  for (const local of locals) placementCount += local.placements.length;

  const placements = new Float32Array(placementCount * PLACEMENT_STRIDE);
  const features = new Uint32Array(locals.length * FEATURE_U32_STRIDE);
  const bounds = new Float32Array(locals.length * FEATURE_F32_STRIDE);
  const scales = new Float32Array(locals.length * 2);
  const labels: Array<string> = new Array(locals.length);

  let placementIndex = 0;
  for (let index = 0; index < locals.length; index++) {
    const local = locals[index];
    const start = placementIndex;

    for (const placement of local.placements) {
      const glyphIndex = indices.get(placement);
      if (glyphIndex === undefined) continue;
      const offset = placementIndex * PLACEMENT_STRIDE;
      placements[offset] = glyphIndex;
      placements[offset + 1] = placement.anchorX;
      placements[offset + 2] = placement.anchorY;
      placements[offset + 3] = placement.offsetX;
      placements[offset + 4] = placement.offsetY;
      placements[offset + 5] = placement.angle;
      placements[offset + 6] = placement.width;
      placements[offset + 7] = placement.height;
      placementIndex++;
    }

    const featureOffset = index * FEATURE_U32_STRIDE;
    features[featureOffset] = LABEL_KIND_CODES[local.kind];
    features[featureOffset + 1] = local.styleIndex;
    features[featureOffset + 2] = start;
    features[featureOffset + 3] = placementIndex - start;
    features[featureOffset + 4] = local.dedupeHash;
    features[featureOffset + 5] = local.flags;

    const boundsOffset = index * FEATURE_F32_STRIDE;
    bounds[boundsOffset] = local.anchorX;
    bounds[boundsOffset + 1] = local.anchorY;
    bounds[boundsOffset + 2] = local.minX;
    bounds[boundsOffset + 3] = local.minY;
    bounds[boundsOffset + 4] = local.maxX;
    bounds[boundsOffset + 5] = local.maxY;
    bounds[boundsOffset + 6] = local.offsetY;

    scales[index * 2] = local.scale0;
    scales[index * 2 + 1] = local.scale1;

    labels[index] = local.label;
  }

  return {
    key: `${x}.${y}.${z}`,
    x,
    y,
    z,
    extent,
    zoom: collection.zoom,
    designSize: LABEL_DESIGN_SIZE,
    sheet,
    glyphs,
    placements: placements.subarray(0, placementIndex * PLACEMENT_STRIDE).slice(),
    features,
    bounds,
    scales,
    circleStyles: collection.circleStyles,
    labels
  };
}

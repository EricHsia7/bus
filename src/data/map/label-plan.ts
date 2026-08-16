import { clamp } from '../../tools/math';
import { CircleStyleProperties, IconStyleProperties, LabelFeature, LabelFeatureCollection, LabelKind, LineStringLabelFeature, PointLabelFeature, LabelPropertyScale, TextStyleProperties } from './label';

/**
 * Width and height, in pixels, of the raster tile images produced by the tile
 * server. This is the *native* resolution of a tile bitmap and is unrelated to
 * how large the tile is drawn on screen.
 */
export const LabelNativeTileSize = 1024;

/**
 * The design space that MapInk style values (`text-size`, `text-dy`,
 * `marker-width`, `text-wrap-width`, ...) are authored in. Every value stored
 * in a `LabelGlyphPlan` is expressed in these units.
 */
export const LabelDesignSize = 256;

/**
 * Logical (CSS) size of one tile in world units. A tile drawn 1:1 covers
 * `LABEL_TILE_SIZE` logical pixels, so the raster tile image is downscaled by
 * `LABEL_NATIVE_TILE_SIZE / LABEL_TILE_SIZE` when it is drawn 1:1.
 */
export const LabelTileSize = 256;

export const LabelLineHeight = 1.2;

export const LabelCollisionPadding = 3;

export function decodeLabelAngle(angle: number, extent: number): number {
  return (angle / extent) * 2 * Math.PI || 0;
}

export const LabelGlyphStride = 4;

export const LabelPlacementStride = 7;

/**
 * Number of discrete angles a rotated glyph is baked at in the tile sheet.
 *
 * 256 buckets sit 1.4 degrees apart, which displaces a glyph corner by well
 * under a tenth of a pixel at the sizes these labels are drawn. Measurement on
 * real z=15 tiles showed a coarser table is not worth the angular error: going
 * all the way down to 32 buckets shrinks the sheet by only ~13%, because its
 * size is dominated by the area of a rotated cell rather than by duplicated
 * entries (53% of baked glyphs occur at a single angle, 24% at two).
 */
export const LabelAngleBuckets = 256;

/** Transparent margin around a baked rotated cell, in raster pixels. */
const RotatedCellPadding = 1;

export const LabelFeaturesStride = 6;
export const LabelBoundsStride = 7;

/**
 * `[minX, minY, maxX, maxY]` per surviving feature, in TILE-EXTENT space and
 * already padded by `LABEL_COLLISION_PADDING`.
 *
 * Collision is resolved once, at plan time, against the worst case (largest)
 * size the label can reach anywhere in its zoom interval, so the box is valid
 * for every frame the tile is on screen and the renderer never has to rebuild
 * it. Extent space is the only frame that is invariant to how large the tile
 * happens to be drawn: multiply by `tileWidth / extent` to get pixels.
 */
export const LabelCollisionStride = 4;

export const LabelKindToCode: Record<LabelKind, number> = { text: 0, marker: 1, point: 2, shield: 3, circle: 4 };
export const LabelCodeToKind: Array<LabelKind> = ['text', 'marker', 'point', 'shield', 'circle'];

export const LabelFlagAlongLine = 1 << 0;
export const LabelFlatZoomScaled = 1 << 1;
export const LabelFlagHasGlyphs = 1 << 2;
/**
 * The feature's reserved box leaves its own tile.
 *
 * Plan-stage collision is tile-local and cannot see into the neighbouring tile
 * a box lands in, so these -- and only these -- still need a screen-space test
 * at draw time. Interior features are already guaranteed conflict-free.
 */
export const LabelFlagSeam = 1 << 3;

export const LabelScalesStride = 2;

export interface LabelGlyphPlan {
  extent: number;
  zoom: number;
  designSize: number;
  sheet: ImageBitmap;
  /**
   * - 4n+0: shelf x
   * - 4n+1: shelf y
   * - 4n+2: pixel width
   * - 4n+3: pixel height
   */
  glyphs: Float32Array;
  /**
   * - 7n+0: glyph index
   * - 7n+1: anchor x
   * - 7n+2: anchor y
   * - 7n+3: offset x
   * - 7n+4: offset y
   * - 7n+5: width
   * - 7n+6: height
   */
  placements: Float32Array;
  /**
   * - 6n+0: kind
   * - 6n+1: style index (style reference)
   * - 6n+2: start
   * - 6n+3: end
   * - 6n+4: hash
   * - 6n+5: flags
   */
  features: Uint32Array;
  /**
   * - 7n+0: anchor x
   * - 7n+1: anchor y
   * - 7n+2: min x
   * - 7n+3: min y
   * - 7n+4: max x
   * - 7n+5: max y
   * - 7n+6: offset y
   */
  bounds: Float32Array;
  /**
   * Worst-case, padded collision boxes in extent space.
   * - 4n+0: min x
   * - 4n+1: min y
   * - 4n+3: max x
   * - 4n+4: max y
   */
  collisions: Float32Array;
  /**
   * - 2n+0: min scale
   * - 2n+1: max scale
   */
  scales: Float32Array;
  circleStyles: Array<CircleStyleProperties>;
}

export function disposeLabelGlyphPlan(plan: LabelGlyphPlan): void {
  plan.sheet?.close();
  // plan.sheet = null;
}

interface AtlasPage {
  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;
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
  bearingX: number;
  bearingY: number;
  advance: number;
  width: number;
  height: number;
}

interface StyleRaster {
  signature: string;
  font: string;
  size: number;
  maxScale: number;
  designPerPixel: number;
  fill: string;
  haloFill: string | null;
  haloPixels: number;
}

export class LabelGlyphCache {
  private readonly pageSize: number;
  private readonly fontFamily: string;
  private readonly fontWeight: number;
  private readonly superSample: number;

  private readonly pages: Array<AtlasPage> = [];
  private readonly sprites = new Map<string, GlyphSprite | null>();
  private readonly styles = new Map<string, StyleRaster>();
  private readonly measureContext: OffscreenCanvasRenderingContext2D;

  /**
   *
   * @param pageSize size of a page
   * @param superSample rasterisation over-sampling factor
   * @param defaultFontFamily
   * @param defaultFontWeight
   */
  constructor(pageSize: number = 1024, superSample: number = 1, defaultFontFamily: string = "'Noto Sans TC', sans-serif", defaultFontWeight: number = 400) {
    this.pageSize = pageSize;
    this.superSample = superSample;
    this.fontFamily = defaultFontFamily;
    this.fontWeight = defaultFontWeight;
    this.measureContext = new OffscreenCanvas(1, 1).getContext('2d') as OffscreenCanvasRenderingContext2D;
    this.measureContext.textBaseline = 'alphabetic';
  }

  /** The effective super-sampling factor, after the `>= 1` floor and any fallback. */
  get superSampleRatio(): number {
    return this.superSample;
  }

  // /**
  //  * Requested vs actually-applied font size for the most recently built raster.
  //  * These must stay equal; a divergence means the canvas rejected the font string
  //  * and is measuring/rasterising at some other size entirely.
  //  */
  // public lastFont: { requested: number; applied: number; appliedFont: string } | null = null;

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

    // A face name can arrive already quoted ("'Noto Sans TC'") or as a whole
    // comma-separated stack. Blindly wrapping either in another pair of quotes
    // produces invalid CSS such as `''Noto Sans TC', 'X''`, and assigning an
    // invalid string to `ctx.font` is a SILENT no-op -- the context keeps its
    // previous size, so every glyph is rasterised at the wrong scale and no
    // amount of super-sampling changes anything. Normalise to a clean stack.
    const stack = faceName
      .replace(/\s+(Regular|Book|Normal)$/i, '')
      .split(',')
      .map((part) =>
        part
          .trim()
          .replace(/^['"]+|['"]+$/g, '')
          .trim()
      )
      .filter((part) => part.length > 0)
      // Only identifier-safe names may go unquoted; anything with a space or
      // punctuation must be quoted exactly once.
      .map((part) => (/^[A-Za-z][A-Za-z0-9-]*$/.test(part) ? part : `'${part}'`));

    if (stack.length === 0) return this.fontFamily;
    return `${stack.join(', ')}, ${this.fontFamily}`;
  }

  public getStyleRaster(style: TextStyleProperties, size: number, maxScale: number): StyleRaster {
    const fill = style['text-fill'] ?? '#000000';
    const haloFill = style['text-halo-fill'] ?? null;
    const haloRadius = haloFill ? (style['text-halo-radius'] ?? 0) : 0;
    const family = this.resolveFontFamily(style['text-face-name']);
    const signature = `${family}|${this.fontWeight}|${size}|${maxScale}|${fill}|${haloFill ?? ''}|${haloRadius}`;

    const cached = this.styles.get(signature);
    if (cached) return cached;

    // Stage 1 — design unit to logical pixel: size / designSize * tileSize.
    const logicalPixels = (size / LabelDesignSize) * LabelTileSize;
    // Stage 2 — logical pixel to super-sampled raster pixel. `maxScale` is folded
    // in so a label that grows with zoom is still rasterised above its largest
    // on-screen size rather than being magnified from an under-sampled sprite.
    const minFontPixels = 32; // Ensure visual quality
    const maxFontPixels = 192; // Protect against GPU texture overflow and browser canvas limits
    const requestedPixels = clamp(Math.ceil(logicalPixels * maxScale * this.superSample), minFontPixels, maxFontPixels);
    const font = `${this.fontWeight} ${requestedPixels}px ${family}`;

    // Assigning an unparseable `font` is a SILENT no-op on a canvas context: the
    // context keeps its previous value (`10px sans-serif` on a fresh one) and
    // every subsequent measureText reports ink for THAT size instead. The sprite
    // box would then stay fixed at ~10px while `designPerPixel` kept shrinking as
    // `superSample` grew, making glyphs shrink as sampling got finer. So never
    // trust the requested size -- read back what the context actually applied and
    // derive the conversion from that, keeping the two exactly reciprocal.
    this.measureContext.font = font;
    const appliedFont = this.measureContext.font;
    const appliedMatch = /(\d+(?:\.\d+)?)px/.exec(appliedFont);
    const fontPixels = appliedMatch ? parseFloat(appliedMatch[1]) : requestedPixels;

    if (Math.abs(fontPixels - requestedPixels) > 0.01) {
      console.warn(`[label-plan] font not applied: requested ${requestedPixels}px, got ${fontPixels}px ` + `(font="${font}", applied="${appliedFont}"). Glyphs will be rasterised at the ` + `applied size; check that the family is loaded in this context.`);
    }

    // Exact inverse of the two stages above, including the clamp. Because every sprite metric is multiplied by this factor, the design-unit geometry the renderer consumes is invariant to `superSample` and to `maxScale`.
    const designPerPixel = size / fontPixels;

    const raster: StyleRaster = {
      signature,
      font,
      size,
      maxScale,
      designPerPixel,
      fill,
      haloFill,
      haloPixels: haloRadius * (fontPixels / size)
    };

    this.styles.set(signature, raster);
    return raster;
  }

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
    context.imageSmoothingEnabled = false;
    const page: AtlasPage = { canvas, context, shelfX: 0, shelfY: 0, shelfHeight: 0 };
    this.pages.push(page);
    return page;
  }

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
      const blank: GlyphSprite | null = advance > 0 ? { page: -1, sx: 0, sy: 0, sw: 0, sh: 0, bearingX: 0, bearingY: 0, advance, width: 0, height: 0 } : null;
      this.sprites.set(key, blank);
      return blank;
    }

    // Padding is defined in DESIGN units and only then converted to raster
    // pixels. Rounding it to whole raster pixels (as an integer sprite box would
    // require) makes the padding a superSample-dependent fraction of the box,
    // which is what made the drawn size drift with the sampling factor.
    const paddingDesign = (raster.haloPixels * raster.designPerPixel) / 2 + 1;
    const padding = paddingDesign / raster.designPerPixel;

    // Exact, unquantised source box. `inkWidth` is proportional to the raster
    // font size and `designPerPixel` is its exact inverse, so
    //   boxWidth * designPerPixel === inkDesign + 2 * paddingDesign
    // is invariant under superSample by construction.
    const boxWidth = inkWidth + padding * 2;
    const boxHeight = inkHeight + padding * 2;

    // The atlas slot is still whole pixels; only the sampled sub-rect is exact.
    const spriteWidth = Math.ceil(boxWidth);
    const spriteHeight = Math.ceil(boxHeight);

    const slot = this.allocate(spriteWidth, spriteHeight);
    if (!slot) {
      this.sprites.set(key, null);
      return null;
    }

    const page = this.pages[slot.page];
    const originX = slot.x + padding + left;
    const originY = slot.y + padding + Math.abs(ascent);

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
      sw: boxWidth,
      sh: boxHeight,
      bearingX: -(left + padding) * raster.designPerPixel,
      bearingY: -(ascent + padding) * raster.designPerPixel,
      advance,
      width: boxWidth * raster.designPerPixel,
      height: boxHeight * raster.designPerPixel
    };

    this.sprites.set(key, sprite);
    return sprite;
  }

  public blit(sprite: GlyphSprite, context: OffscreenCanvasRenderingContext2D, x: number, y: number): void {
    if (sprite.page < 0) return;
    context.drawImage(this.pages[sprite.page].canvas, sprite.sx, sprite.sy, sprite.sw, sprite.sh, x, y, sprite.sw, sprite.sh);
  }

  /**
   * Draws `sprite` rotated by `angle`, centred in the `width` x `height` cell
   * at (x, y). This is the one place a rotational transform is still paid, and
   * it runs once per (sprite, angle) pair while the tile sheet is composed.
   */
  public blitRotated(sprite: GlyphSprite, context: OffscreenCanvasRenderingContext2D, x: number, y: number, angle: number, width: number, height: number): void {
    if (sprite.page < 0) return;
    context.save();
    context.translate(x + width / 2, y + height / 2);
    context.rotate(angle);
    context.drawImage(this.pages[sprite.page].canvas, sprite.sx, sprite.sy, sprite.sw, sprite.sh, -sprite.sw / 2, -sprite.sh / 2, sprite.sw, sprite.sh);
    context.restore();
  }
}

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
  pixelWidth: number;
  pixelHeight: number;
  /**
   * Quantised angle this placement's sheet cell is baked at, or 0 (or absent)
   * for an upright cell. Two placements share a cell only when they agree on
   * both the sprite and this bucket.
   */
  bucket?: number;
}

interface LocalFeature {
  kind: LabelKind;
  styleIndex: number;
  flags: number;
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

interface CollisionBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** A feature that won its collision test, together with the box it reserved. */
interface PlacedFeature {
  local: LocalFeature;
  collision: CollisionBox;
}

function boxesIntersect(a: CollisionBox, b: CollisionBox): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

function hashLabel(text: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function getTextScale(style: TextStyleProperties): LabelPropertyScale {
  const scale = style['text-scale'];
  if (!scale) return [1, 1];
  return [scale[0], scale[1]];
}

function getMarkerScale(style: CircleStyleProperties): LabelPropertyScale {
  const scale = style['marker-scale'];
  if (!scale) return [1, 1];
  return [scale[0], scale[1]];
}

export function warmLabelGlyphCache(collection: LabelFeatureCollection, cache: LabelGlyphCache): void {
  for (const charset of collection.charsets) {
    if (charset.table === 'textStyles') {
      const style = collection.textStyles[charset.style];
      if (!style || !style['text-size']) continue;
      const scale = getTextScale(style);
      const raster = cache.getStyleRaster(style, style['text-size'], Math.max(scale[0], scale[1]));
      for (const character of charset.charset) cache.getGlyph(raster, character);
    } else if (charset.table === 'iconStyles') {
      const style = collection.iconStyles[charset.style];
      if (!style || !style['shield-size']) continue;
      const raster = cache.getStyleRaster({ layer: style.layer }, style['shield-size'], 1);
      for (const character of charset.charset) cache.getGlyph(raster, character);
    }
  }
}

function wrapLabel(cache: LabelGlyphCache, raster: StyleRaster, text: string, wrapWidth: number): Array<string> {
  if (!(wrapWidth > 0)) return [text];

  // `text-wrap-width` is authored in design units, and `measureAdvance` already returns design units, so no scale correction belongs here.
  const measure = (value: string) => cache.measureAdvance(raster, value);
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

function layoutCentredText(cache: LabelGlyphCache, raster: StyleRaster, lines: Array<string>, anchorX: number, anchorY: number): Array<LocalPlacement> {
  const placements: Array<LocalPlacement> = [];
  const lineHeight = raster.size * LabelLineHeight;
  const firstLineY = -((lines.length - 1) * lineHeight) / 2;

  for (let index = 0; index < lines.length; index++) {
    const characters = Array.from(lines[index]);

    let lineWidth = 0;
    for (const character of characters) {
      const sprite = cache.getGlyph(raster, character);
      if (sprite) lineWidth += sprite.advance;
    }

    let penX = -lineWidth / 2;
    const baselineY = firstLineY + index * lineHeight;

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

  const box = measurePlacements(placements);
  const cx = (box.minX + box.maxX) / 2;
  const cy = (box.minY + box.maxY) / 2;
  for (const placement of placements) {
    placement.offsetX -= cx;
    placement.offsetY -= cy;
  }

  return placements;
}

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
  const designToExtent = extent / LabelDesignSize;

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
    // Snap to the sheet's angle table first, then derive the angle from the
    // bucket, so the collision bounds below describe exactly the rotation that
    // gets baked rather than one a fraction of a degree away from it.
    const bucket = quantiseLabelAngle(angles[index], extent);
    const angle = (bucket / LabelAngleBuckets) * Math.PI * 2;

    sumX += anchorX;
    sumY += anchorY;

    placements.push({
      sprite,
      bitmap: null,
      anchorX,
      anchorY,
      offsetX: -sprite.width / 2,
      offsetY: -sprite.height / 2,
      angle,
      bucket,
      width: sprite.width,
      height: sprite.height,
      pixelWidth: sprite.sw,
      pixelHeight: sprite.sh
    });

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
    flags: LabelFlagAlongLine | LabelFlagHasGlyphs,
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
    flags: LabelFlatZoomScaled | LabelFlagHasGlyphs,
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

  if (placements.length === 0) return null;

  const box = measurePlacements(placements);

  return {
    kind,
    styleIndex,
    flags: LabelFlagHasGlyphs,
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

function planCircle(feature: PointLabelFeature, style: CircleStyleProperties, styleIndex: number): LocalFeature | null {
  const markerWidth = style['marker-width'];
  if (!markerWidth) return null;
  if (!style['marker-fill']) return null;
  const scale = getMarkerScale(style);

  const radius = markerWidth / 2 + (style['marker-line-color'] ? 0.5 : 0);

  return {
    kind: 'circle',
    styleIndex,
    flags: LabelFlatZoomScaled,
    scale0: scale[0],
    scale1: scale[1],
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
 * The largest scale a feature can ever be drawn at while its tile is on screen.
 *
 * This is the whole point of resolving collision at plan time: a plan outlives
 * the frame that triggered it, so a box reserved at the CURRENT size would be
 * wrong the moment the user zooms. Reserving the worst case instead makes the
 * decision monotone -- a label that is placed stays placed, and one that is
 * dropped never reappears halfway through a zoom and starts overlapping.
 */
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

function quantiseLabelAngle(angle: number, extent: number): number {
  if (!extent) return 0;
  const bucket = Math.round((angle / extent) * LabelAngleBuckets);
  return ((bucket % LabelAngleBuckets) + LabelAngleBuckets) % LabelAngleBuckets;
}

/**
 * Rewrites every rotated placement into an equivalent axis-aligned one.
 *
 * The rotation moves into the tile sheet: `composeSheet` bakes one cell per
 * (sprite, bucket) pair, so the renderer never hands the canvas a rotational
 * transform. WebKit's 2D backend has no batching layer and leaves its blit fast
 * path the moment the CTM rotates, so a rotated glyph costs far more per frame
 * than an upright one; on a dense z=15 tile 91% of glyphs are along-line, which
 * is why the cost dominates. Baking pays it once per tile in the worker instead
 * of once per glyph per frame.
 *
 * The rewrite is exact, not an approximation. A placement draws its sprite at
 * `offset` with size `width` x `height` inside a frame rotated about the anchor,
 * so the sprite's centre lands at `R(angle) * (offset + size / 2)`. Putting an
 * axis-aligned cell of the rotated bounding size on that same centre reproduces
 * the original pixels, so nothing has to be counter-rotated at draw time.
 *
 * Run this AFTER collision resolution: it rewrites per-glyph geometry only, and
 * the feature bounds the collision pass reserves already account for the
 * rotated span (`planAlongLine` computes them from the same quantised angle).
 */
function bakeRotatedPlacements(features: Array<LocalFeature>): void {
  for (const feature of features) {
    for (const placement of feature.placements) {
      const bucket = placement.bucket ?? 0;
      if (bucket === 0 || !placement.sprite) continue;

      const angle = (bucket / LabelAngleBuckets) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const absCos = Math.abs(cos);
      const absSin = Math.abs(sin);

      // Design units per raster pixel. Both axes share it by construction, so
      // carrying it through keeps the cell's design size exact.
      const perPixel = placement.pixelWidth > 0 ? placement.width / placement.pixelWidth : 0;

      // The rotated bounding box, plus one transparent pixel per side: the cell
      // is resampled at draw time and an edge sample must not be able to reach
      // into whichever cell the shelf packer puts next to it.
      const cellWidth = placement.pixelWidth * absCos + placement.pixelHeight * absSin + RotatedCellPadding * 2;
      const cellHeight = placement.pixelWidth * absSin + placement.pixelHeight * absCos + RotatedCellPadding * 2;

      const centreX = placement.offsetX + placement.width / 2;
      const centreY = placement.offsetY + placement.height / 2;
      const rotatedCentreX = centreX * cos - centreY * sin;
      const rotatedCentreY = centreX * sin + centreY * cos;

      placement.width = cellWidth * perPixel;
      placement.height = cellHeight * perPixel;
      placement.offsetX = rotatedCentreX - placement.width / 2;
      placement.offsetY = rotatedCentreY - placement.height / 2;
      placement.pixelWidth = cellWidth;
      placement.pixelHeight = cellHeight;
      placement.angle = 0;
    }
  }
}

function composeSheet(cache: LabelGlyphCache, features: Array<LocalFeature>, maxSheetSize: number): { sheet: ImageBitmap; glyphs: Float32Array; indices: Map<LocalPlacement, number> } {
  const order: Array<LocalPlacement> = [];
  // Sprite identity alone no longer identifies a cell: the same glyph baked at
  // two different angles is two cells, while the same glyph at the same angle
  // is still shared, which is what keeps the sheet from growing with the number
  // of characters drawn along a road.
  const bySprite = new Map<unknown, Map<number, number>>();
  const indices = new Map<LocalPlacement, number>();

  for (const feature of features) {
    for (const placement of feature.placements) {
      const identity = placement.sprite ?? placement.bitmap;
      if (!identity) continue;
      const bucket = placement.bucket ?? 0;

      let byBucket = bySprite.get(identity);
      if (!byBucket) {
        byBucket = new Map<number, number>();
        bySprite.set(identity, byBucket);
      }

      const existing = byBucket.get(bucket);
      if (existing !== undefined) {
        indices.set(placement, existing);
        continue;
      }

      const index = order.length;
      byBucket.set(bucket, index);
      indices.set(placement, index);
      order.push(placement);
    }
  }

  const sorted = order.map((placement, index) => ({ placement, index })).sort((a, b) => b.placement.pixelHeight - a.placement.pixelHeight);

  let sheetWidth = 0;
  for (const entry of sorted) sheetWidth = Math.max(sheetWidth, entry.placement.pixelWidth);
  sheetWidth = Math.min(maxSheetSize, Math.max(64, 1 << Math.ceil(Math.log2(Math.max(sheetWidth, Math.ceil(Math.sqrt(sorted.length)) * 32)))));

  const rects = new Float32Array(order.length * LabelGlyphStride);
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
    const offset = entry.index * LabelGlyphStride;
    rects[offset] = shelfX;
    rects[offset + 1] = shelfY;
    rects[offset + 2] = pixelWidth;
    rects[offset + 3] = pixelHeight;
    shelfX += pixelWidth;
    if (pixelHeight > shelfHeight) shelfHeight = pixelHeight;
  }

  // Sprite boxes are fractional (they carry exact design-unit sizes), so the
  // packed height is fractional too. A canvas truncates a fractional dimension,
  // which would silently clip the bottom row of the last shelf. Round up.
  const sheetHeight = Math.max(1, Math.ceil(shelfY + shelfHeight));
  const canvas = new OffscreenCanvas(sheetWidth, sheetHeight);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  for (let index = 0; index < order.length; index++) {
    const placement = order[index];
    const offset = index * LabelGlyphStride;
    if (placement.sprite) {
      const bucket = placement.bucket ?? 0;
      if (bucket !== 0) {
        // `bakeRotatedPlacements` already sized the cell to the rotated bounds,
        // so the sprite is simply centred in it at the bucket's angle.
        cache.blitRotated(placement.sprite, context, rects[offset], rects[offset + 1], (bucket / LabelAngleBuckets) * Math.PI * 2, rects[offset + 2], rects[offset + 3]);
      } else {
        cache.blit(placement.sprite, context, rects[offset], rects[offset + 1]);
      }
    } else if (placement.bitmap) {
      context.drawImage(placement.bitmap, rects[offset], rects[offset + 1]);
    }
  }

  return { sheet: canvas.transferToImageBitmap(), glyphs: rects, indices };
}

export function buildLabelGlyphPlan(collection: LabelFeatureCollection, cache: LabelGlyphCache): LabelGlyphPlan {
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
          // const style = collection.iconStyles[properties.style];
          // if (style) local = planIcon(cache, point, style, properties.style, properties.kind, tile.icons);
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

  // Collision runs HERE -- once per tile, off the main thread -- rather than
  // once per frame in the renderer, and against the worst-case size so the
  // outcome is valid for the whole life of the plan.
  const placed = resolveTileCollisions(locals, extent);
  const survivors = placed.map((entry) => entry.local);

  // Must run before the sheet is composed: it is what turns each rotated
  // placement into an axis-aligned one and resizes its cell to the rotated
  // bounds the shelf packer then allocates. Only survivors are baked, so
  // collided labels cost nothing.
  bakeRotatedPlacements(survivors);

  const { sheet, glyphs, indices } = composeSheet(cache, survivors, 2048);

  if (sheet) {
    let maxSpriteHeight = 0;
    for (let index = 3; index < glyphs.length; index += LabelGlyphStride) {
      if (glyphs[index] > maxSpriteHeight) maxSpriteHeight = glyphs[index];
    }
  }

  let placementCount = 0;
  for (const local of survivors) placementCount += local.placements.length;

  const placements = new Float32Array(placementCount * LabelPlacementStride);
  const features = new Uint32Array(survivors.length * LabelFeaturesStride);
  const bounds = new Float32Array(survivors.length * LabelBoundsStride);
  const collisions = new Float32Array(survivors.length * LabelCollisionStride);
  const scales = new Float32Array(survivors.length * 2);

  let placementIndex = 0;
  for (let index = 0; index < survivors.length; index++) {
    const local = survivors[index];
    const start = placementIndex;

    for (const placement of local.placements) {
      const glyphIndex = indices.get(placement);
      if (glyphIndex === undefined) continue;
      const offset = placementIndex * LabelPlacementStride;
      placements[offset] = glyphIndex;
      placements[offset + 1] = placement.anchorX;
      placements[offset + 2] = placement.anchorY;
      placements[offset + 3] = placement.offsetX;
      placements[offset + 4] = placement.offsetY;
      placements[offset + 5] = placement.width;
      placements[offset + 6] = placement.height;
      placementIndex++;
    }

    const featureOffset = index * LabelFeaturesStride;
    features[featureOffset] = LabelKindToCode[local.kind];
    features[featureOffset + 1] = local.styleIndex;
    features[featureOffset + 2] = start;
    features[featureOffset + 3] = placementIndex - start;
    features[featureOffset + 4] = local.dedupeHash;
    // A box that falls out of the tile is never tested against whatever occupies the neighbouring tile.
    const collision = placed[index].collision;
    const crossesSeam = collision.minX < 0 || collision.minY < 0 || collision.maxX > extent || collision.maxY > extent;
    features[featureOffset + 5] = local.flags | (crossesSeam ? LabelFlagSeam : 0);

    const boundsOffset = index * LabelBoundsStride;
    bounds[boundsOffset] = local.anchorX;
    bounds[boundsOffset + 1] = local.anchorY;
    bounds[boundsOffset + 2] = local.minX;
    bounds[boundsOffset + 3] = local.minY;
    bounds[boundsOffset + 4] = local.maxX;
    bounds[boundsOffset + 5] = local.maxY;
    bounds[boundsOffset + 6] = local.offsetY;

    const collisionOffset = index * LabelCollisionStride;
    collisions[collisionOffset] = collision.minX;
    collisions[collisionOffset + 1] = collision.minY;
    collisions[collisionOffset + 2] = collision.maxX;
    collisions[collisionOffset + 3] = collision.maxY;

    const scaleOffset = index * LabelScalesStride;
    scales[scaleOffset] = local.scale0;
    scales[scaleOffset + 1] = local.scale1;
  }

  return {
    extent,
    zoom: collection.zoom,
    designSize: LabelDesignSize,
    sheet,
    glyphs,
    placements: placements.subarray(0, placementIndex * LabelPlacementStride).slice(),
    features,
    bounds,
    collisions,
    scales,
    circleStyles: collection.circleStyles
  };
}

import type { MapLoaderTile } from './index';
import type { CircleStyleProperties, IconStyleProperties, LabelFeature, LabelFeatureCollection, LabelKind, LineStringLabelFeature, PointLabelFeature, TextStyleProperties } from './label';

/**
 * Width and height, in pixels, of the raster tile images produced by the tile
 * server. This is the *native* resolution of a tile bitmap and is unrelated to
 * how large the tile is drawn on screen.
 */
export const LABEL_NATIVE_TILE_SIZE = 1024;

/**
 * The design space that MapInk style values (`text-size`, `text-dy`,
 * `marker-width`, `text-wrap-width`, ...) are authored in. Every value stored
 * in a `LabelGlyphPlan` is expressed in these units.
 */
export const LABEL_DESIGN_SIZE = 256;

/**
 * Logical (CSS) size of one tile in world units. A tile drawn 1:1 covers
 * `LABEL_TILE_SIZE` logical pixels, so the raster tile image is downscaled by
 * `LABEL_NATIVE_TILE_SIZE / LABEL_TILE_SIZE` when it is drawn 1:1.
 */
export const LABEL_TILE_SIZE = 256;

export const LABEL_LINE_HEIGHT_RATIO = 1.2;

export const LABEL_COLLISION_PADDING = 3;

/**
 * Super-sampling factor used when rasterising glyphs into the atlas.
 *
 * Glyphs are rasterised at `logicalPixels * superSample` and then drawn back
 * down at `logicalPixels`, so the factor only buys definition — it must never
 * change the size a glyph occupies on the final canvas. Defaults to the device
 * pixel ratio when one is observable (workers do not expose `window`).
 */
export const DEFAULT_SUPER_SAMPLE_RATIO = ((): number => {
  const scope = typeof self !== 'undefined' ? (self as unknown as { devicePixelRatio?: number }) : undefined;
  const ratio = scope?.devicePixelRatio;
  return typeof ratio === 'number' && ratio > 0 ? ratio : 1;
})();

export function decodeLabelAngle(angle: number, extent: number): number {
  return (angle / extent) * 2 * Math.PI || 0;
}

export const GLYPH_STRIDE = 4;

export const PLACEMENT_STRIDE = 8;
export const FEATURE_U32_STRIDE = 6;
export const FEATURE_F32_STRIDE = 7;

export const LABEL_KIND_CODES: Record<LabelKind, number> = { text: 0, marker: 1, point: 2, shield: 3, circle: 4 };
export const LABEL_KINDS_BY_CODE: Array<LabelKind> = ['text', 'marker', 'point', 'shield', 'circle'];

export const LABEL_FLAG_ALONG_LINE = 1 << 0;
export const LABEL_FLAG_ZOOM_SCALED = 1 << 1;
export const LABEL_FLAG_HAS_GLYPHS = 1 << 2;

export interface LabelGlyphPlan {
  key: string;
  x: number;
  y: number;
  z: number;
  extent: number;
  zoom: number;
  designSize: number;
  sheet: ImageBitmap | null;
  glyphs: Float32Array;
  placements: Float32Array;
  features: Uint32Array;
  bounds: Float32Array;
  scales: Float32Array;
  circleStyles: Array<CircleStyleProperties>;
  labels: Array<string>;
}

export function getLabelGlyphPlanTransferables(plan: LabelGlyphPlan): Array<Transferable> {
  const transferables: Array<Transferable> = [plan.glyphs.buffer, plan.placements.buffer, plan.features.buffer, plan.bounds.buffer, plan.scales.buffer];
  if (plan.sheet) transferables.push(plan.sheet);
  return transferables;
}

export function disposeLabelGlyphPlan(plan: LabelGlyphPlan): void {
  plan.sheet?.close();
  plan.sheet = null;
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
  ascent: number;
  descent: number;
}

export interface LabelGlyphCacheOptions {
  pageSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  /**
   * Rasterisation over-sampling factor. Pass the main thread's
   * `window.devicePixelRatio` when constructing the cache inside a worker.
   */
  superSample?: number;
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

  constructor(options: LabelGlyphCacheOptions = {}) {
    this.pageSize = options.pageSize ?? 1024;
    this.fontFamily = options.fontFamily ?? "'Noto Sans TC', sans-serif";
    this.fontWeight = options.fontWeight ?? 400;
    this.superSample = Math.max(1, options.superSample ?? DEFAULT_SUPER_SAMPLE_RATIO);
    this.measureContext = new OffscreenCanvas(1, 1).getContext('2d') as OffscreenCanvasRenderingContext2D;
  }

  /** The effective super-sampling factor, after the `>= 1` floor and any fallback. */
  get superSampleRatio(): number {
    return this.superSample;
  }

  /**
   * Requested vs actually-applied font size for the most recently built raster.
   * These must stay equal; a divergence means the canvas rejected the font string
   * and is measuring/rasterising at some other size entirely.
   */
  public lastFont: { requested: number; applied: number; appliedFont: string } | null = null;

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
    const signature = `${family}|${this.fontWeight}|${size}|${maxScale}|${this.superSample}|${fill}|${haloFill ?? ''}|${haloRadius}`;

    const cached = this.styles.get(signature);
    if (cached) return cached;

    // Stage 1 — design unit to logical pixel: size / designSize * tileSize.
    const logicalPixels = (size / LABEL_DESIGN_SIZE) * LABEL_TILE_SIZE;
    // Stage 2 — logical pixel to super-sampled raster pixel. `maxScale` is folded
    // in so a label that grows with zoom is still rasterised above its largest
    // on-screen size rather than being magnified from an under-sampled sprite.
    const maxFontPixels = 192; // Protect against GPU texture overflow and browser canvas limits
    const requestedPixels = Math.min(maxFontPixels, logicalPixels * maxScale * this.superSample);
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

    // Exact inverse of the two stages above, including the clamp. Because every
    // sprite metric is multiplied by this factor, the design-unit geometry the
    // renderer consumes is invariant to `superSample` and to `maxScale`.
    this.lastFont = { requested: requestedPixels, applied: fontPixels, appliedFont };

    const designPerPixel = size / fontPixels;

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
      haloPixels: haloRadius * (fontPixels / size),
      ascent,
      descent
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

    const style = collection.iconStyles[charset.style];
    if (!style || !style['shield-size']) continue;
    const raster = cache.getStyleRaster({ layer: style.layer }, style['shield-size'], 1);
    for (const character of charset.charset) cache.getGlyph(raster, character);
  }
}

function wrapLabel(cache: LabelGlyphCache, raster: StyleRaster, text: string, wrapWidth: number): Array<string> {
  if (!(wrapWidth > 0)) return [text];

  // `text-wrap-width` is authored in design units, and `measureAdvance` already
  // returns design units, so no scale correction belongs here.
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
  const lineHeight = raster.size * LABEL_LINE_HEIGHT_RATIO;
  const firstLineY = -((lines.length - 1) * lineHeight) / 2;
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
      offsetX: -sprite.width / 2,
      offsetY: -sprite.height / 2,
      angle,
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

function planCircle(feature: PointLabelFeature, style: CircleStyleProperties, styleIndex: number): LocalFeature | null {
  const markerWidth = style['marker-width'];
  if (!markerWidth) return null;
  if (!style['marker-fill']) return null;

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

  // Sprite boxes are fractional (they carry exact design-unit sizes), so the
  // packed height is fractional too. A canvas truncates a fractional dimension,
  // which would silently clip the bottom row of the last shelf. Round up.
  const sheetHeight = Math.max(1, Math.ceil(shelfY + shelfHeight));
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

  const { sheet, glyphs, indices } = composeSheet(cache, locals, 2048);

  // One line per tile describing the whole super-sampling chain, so the atlas
  // resolution can be confirmed from the console instead of inferred from how
  // sharp the result looks. If `sheet` does not grow with `superSample`, the
  // problem is upstream of the renderer; if it does grow but the screen looks
  // unchanged, the problem is the downscale filtering at draw time.
  if (sheet) {
    let maxSpriteHeight = 0;
    for (let index = 3; index < glyphs.length; index += GLYPH_STRIDE) {
      if (glyphs[index] > maxSpriteHeight) maxSpriteHeight = glyphs[index];
    }
    const font = cache.lastFont;
    console.log(`[label-plan] ${tile.x}.${tile.y}.${tile.z} superSample=${cache.superSampleRatio} ` + `sheet=${sheet.width}x${sheet.height} maxSpriteHeight=${maxSpriteHeight.toFixed(1)}px ` + `font: requested=${font ? font.requested.toFixed(1) : '?'}px ` + `applied=${font ? font.applied.toFixed(1) : '?'}px ` + `(${font ? font.appliedFont : 'none'})`);
  }

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

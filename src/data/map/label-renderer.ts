import { clamp } from '../../tools/math';
import { CircleStyleProperties, LabelFeatureCollection } from './label';
import { FEATURE_F32_STRIDE, FEATURE_U32_STRIDE, GLYPH_STRIDE, LABEL_COLLISION_PADDING, LABEL_FLAG_ALONG_LINE, LABEL_FLAG_HAS_GLYPHS, LABEL_FLAG_ZOOM_SCALED, LABEL_KIND_CODES, PLACEMENT_STRIDE, disposeLabelGlyphPlan } from './label-plan';
import type { LabelGlyphPlan } from './label-plan';

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface LabelTileView {
  plan: LabelGlyphPlan;
  screenBBox: Box;
}

export interface DrawLabelTilesOptions {
  zoom: number;
  width: number;
  height: number;
  padding?: number;
  dedupe?: boolean;
}

export interface DrawLabelTilesResult {
  drawn: number;
  deduped: number;
  collided: number;
}

function intersects(a: Box, b: Box): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

class CollisionIndex {
  private readonly cellSize: number;
  private readonly columns: number;
  private readonly rows: number;
  private readonly cells: Array<Array<Box>>;
  private readonly loose: Array<Box> = [];

  constructor(width: number, height: number, cellSize: number = 64) {
    this.cellSize = cellSize;
    this.columns = Math.max(1, Math.ceil(width / cellSize));
    this.rows = Math.max(1, Math.ceil(height / cellSize));
    this.cells = new Array(this.columns * this.rows);
  }

  private range(box: Box): { minColumn: number; minRow: number; maxColumn: number; maxRow: number } | null {
    const minColumn = Math.floor(box.minX / this.cellSize);
    const maxColumn = Math.floor(box.maxX / this.cellSize);
    const minRow = Math.floor(box.minY / this.cellSize);
    const maxRow = Math.floor(box.maxY / this.cellSize);
    if (maxColumn < 0 || maxRow < 0 || minColumn >= this.columns || minRow >= this.rows) return null;
    return {
      minColumn: Math.max(0, minColumn),
      minRow: Math.max(0, minRow),
      maxColumn: Math.min(this.columns - 1, maxColumn),
      maxRow: Math.min(this.rows - 1, maxRow)
    };
  }

  public collides(box: Box): boolean {
    for (const other of this.loose) {
      if (intersects(box, other)) return true;
    }

    const range = this.range(box);
    if (!range) return false;

    for (let row = range.minRow; row <= range.maxRow; row++) {
      for (let column = range.minColumn; column <= range.maxColumn; column++) {
        const cell = this.cells[row * this.columns + column];
        if (!cell) continue;
        for (const other of cell) {
          if (intersects(box, other)) return true;
        }
      }
    }

    return false;
  }

  public insert(box: Box): void {
    const range = this.range(box);
    if (!range) {
      this.loose.push(box);
      return;
    }

    for (let row = range.minRow; row <= range.maxRow; row++) {
      for (let column = range.minColumn; column <= range.maxColumn; column++) {
        const index = row * this.columns + column;
        const cell = this.cells[index];
        if (cell) cell.push(box);
        else this.cells[index] = [box];
      }
    }
  }
}

export function resolveLabelScale(flags: number, tileZoom: number, viewZoom: number, scale0: number, scale1: number): number {
  // Along-line labels are STATIC on the tile. Their per-character anchors were
  // baked into extent space at plan time, so the spacing between characters is
  // fixed by the geometry and only follows the tile as it is scaled on screen.
  // Multiplying the glyph size by a scale the spacing does not share would make
  // the characters grow apart from (or pile into) their own baked positions.
  if (flags & LABEL_FLAG_ALONG_LINE) return scale0;

  // Point labels are DYNAMIC: nothing about their layout is baked into extent
  // space, so the whole label may be interpolated across the zoom interval.
  if (!(flags & LABEL_FLAG_ZOOM_SCALED)) return scale0;
  return scale0 + (scale1 - scale0) ** (viewZoom - tileZoom);
}

function getPlanScales(plan: LabelGlyphPlan, index: number): [number, number] {
  const scales = plan.scales;
  if (!scales) return [1, 1];
  return [scales[index * 2], scales[index * 2 + 1]];
}

function drawGlyphs(context: Context2D, plan: LabelGlyphPlan, featureIndex: number, tileX: number, tileY: number, extentToPixel: number, designToPixel: number, scale: number): void {
  const featureOffset = featureIndex * FEATURE_U32_STRIDE;
  const flags = plan.features[featureOffset + 5];

  if (!(flags & LABEL_FLAG_HAS_GLYPHS) || !plan.sheet) return;

  const start = plan.features[featureOffset + 2];
  const count = plan.features[featureOffset + 3];
  const dy = plan.bounds[featureIndex * FEATURE_F32_STRIDE + 6] * designToPixel;
  const unit = scale * designToPixel;

  for (let index = start; index < start + count; index++) {
    const offset = index * PLACEMENT_STRIDE;
    const glyphOffset = plan.placements[offset] * GLYPH_STRIDE;

    const sx = plan.glyphs[glyphOffset];
    const sy = plan.glyphs[glyphOffset + 1];
    const sw = plan.glyphs[glyphOffset + 2];
    const sh = plan.glyphs[glyphOffset + 3];
    if (sw <= 0 || sh <= 0) continue;

    const anchorX = tileX + plan.placements[offset + 1] * extentToPixel;
    const anchorY = tileY + plan.placements[offset + 2] * extentToPixel + dy;
    const offsetX = plan.placements[offset + 3] * unit;
    const offsetY = plan.placements[offset + 4] * unit;
    const angle = plan.placements[offset + 5];
    const width = plan.placements[offset + 6] * unit;
    const height = plan.placements[offset + 7] * unit;

    if (angle) {
      context.save();
      context.translate(anchorX, anchorY);
      context.rotate(angle);
      context.drawImage(plan.sheet, sx, sy, sw, sh, offsetX, offsetY, width, height);
      context.restore();
      continue;
    }

    context.drawImage(plan.sheet, sx, sy, sw, sh, anchorX + offsetX, anchorY + offsetY, width, height);
  }
}

export function drawLabelTiles(context: Context2D, tiles: Array<LabelTileView>, options: DrawLabelTilesOptions): DrawLabelTilesResult {
  const index = new CollisionIndex(options.width, options.height);
  const seen = new Set<number>();
  const dedupe = options.dedupe !== false;
  const paddingUnits = options.padding ?? LABEL_COLLISION_PADDING;

  // Super-sampling only pays off if the downscale is filtered. The 2D context
  // default is `low` quality, which for a 2-4x reduction samples too few source
  // texels and throws away most of the extra detail the larger atlas contains,
  // so raising `superSample` costs memory without visibly improving anything.
  // `high` asks for a properly filtered (mip/trilinear-class) reduction, which
  // is what turns the extra source pixels into actual definition.
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  const glyphQueue: Array<number> = [];

  let drawn = 0;
  let deduped = 0;
  let collided = 0;

  for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
    const { plan, screenBBox } = tiles[tileIndex];
    const tileWidth = screenBBox.maxX - screenBBox.minX;
    const tileHeight = screenBBox.maxY - screenBBox.minY;
    if (tileWidth <= 0 || tileHeight <= 0) continue;

    // Feature coordinates are in tile-extent space: coord / extent lands in
    // [0, 1], and multiplying by the tile's on-screen width gives the final
    // units, so labels stay aligned with the raster tile no matter what the
    // raster's native pixel size (1024) happens to be.
    const extentToPixel = tileWidth / plan.extent;
    // Design unit to logical pixel: size / designSize * tileSize, where tileSize
    // is the tile's current on-screen width. The glyph atlas is super-sampled
    // above this size, so drawImage always downscales, never magnifies.
    const designToPixel = tileWidth / plan.designSize;
    const padding = paddingUnits * designToPixel;
    const featureCount = plan.features.length / FEATURE_U32_STRIDE;

    const circles = new Map<number, Array<[x: number, y: number]>>();
    for (let featureIndex = 0; featureIndex < featureCount; featureIndex++) {
      const featureOffset = featureIndex * FEATURE_U32_STRIDE;
      const flags = plan.features[featureOffset + 5];
      const dedupeHash = plan.features[featureOffset + 4];

      if (dedupe && dedupeHash !== 0 && seen.has(dedupeHash)) {
        deduped++;
        continue;
      }

      const scales = getPlanScales(plan, featureIndex);
      const scale = resolveLabelScale(flags, plan.zoom, options.zoom, scales[0], scales[1]);
      if (scale <= 0) continue;

      const boundsOffset = featureIndex * FEATURE_F32_STRIDE;
      let box: Box;

      if (flags & LABEL_FLAG_ALONG_LINE) {
        box = {
          minX: screenBBox.minX + plan.bounds[boundsOffset + 2] * extentToPixel - padding,
          minY: screenBBox.minY + plan.bounds[boundsOffset + 3] * extentToPixel - padding,
          maxX: screenBBox.minX + plan.bounds[boundsOffset + 4] * extentToPixel + padding,
          maxY: screenBBox.minY + plan.bounds[boundsOffset + 5] * extentToPixel + padding
        };
      } else {
        const anchorX = screenBBox.minX + plan.bounds[boundsOffset] * extentToPixel;
        const anchorY = screenBBox.minY + plan.bounds[boundsOffset + 1] * extentToPixel + plan.bounds[boundsOffset + 6] * designToPixel;
        const unit = scale * designToPixel;
        box = {
          minX: anchorX + plan.bounds[boundsOffset + 2] * unit - padding,
          minY: anchorY + plan.bounds[boundsOffset + 3] * unit - padding,
          maxX: anchorX + plan.bounds[boundsOffset + 4] * unit + padding,
          maxY: anchorY + plan.bounds[boundsOffset + 5] * unit + padding
        };
      }

      if (box.maxX < 0 || box.maxY < 0 || box.minX > options.width || box.minY > options.height) continue;

      if (index.collides(box)) {
        collided++;
        continue;
      }

      index.insert(box);
      if (dedupeHash !== 0) seen.add(dedupeHash);

      if (plan.features[featureOffset] === LABEL_KIND_CODES.circle) {
        const styleReference = plan.features[featureIndex * FEATURE_U32_STRIDE + 1];
        if (!circles.has(styleReference)) circles.set(styleReference, []);
        const boundsOffset = featureIndex * FEATURE_F32_STRIDE;
        const centreX = screenBBox.minX + plan.bounds[boundsOffset] * extentToPixel;
        const centreY = screenBBox.minY + plan.bounds[boundsOffset + 1] * extentToPixel;
        circles.get(styleReference)?.push([centreX, centreY]);
      } else {
        glyphQueue.push(tileIndex, featureIndex, scale);
      }

      drawn++;
    }

    for (const [styleReference, centerCoordinates] of circles) {
      const style = plan.circleStyles[styleReference];
      if (!style['marker-width']) continue;
      const radius = (style['marker-width'] * designToPixel) / 2;
      context.beginPath();
      for (const [centerX, centerY] of centerCoordinates) {
        context.moveTo(centerX + radius, centerY);
        context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      }
      if (!style['marker-fill']) continue;
      context.fillStyle = style['marker-fill'];
      context.fill();

      if (style['marker-line-color']) {
        context.strokeStyle = style['marker-line-color'];
        context.lineWidth = Math.max(1, designToPixel);
        context.stroke();
      }
    }
  }

  for (let queueIndex = 0; queueIndex < glyphQueue.length; queueIndex += 3) {
    const { plan, screenBBox } = tiles[glyphQueue[queueIndex]];
    const tileWidth = screenBBox.maxX - screenBBox.minX;
    drawGlyphs(context, plan, glyphQueue[queueIndex + 1], screenBBox.minX, screenBBox.minY, tileWidth / plan.extent, tileWidth / plan.designSize, glyphQueue[queueIndex + 2]);
  }

  return { drawn, deduped, collided };
}

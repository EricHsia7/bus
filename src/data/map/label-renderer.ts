import { FEATURE_F32_STRIDE, FEATURE_U32_STRIDE, GLYPH_STRIDE, LABEL_COLLISION_PADDING, LABEL_FLAG_ALONG_LINE, LABEL_FLAG_HAS_GLYPHS, LABEL_FLAG_ZOOM_SCALED, LABEL_KIND_CODES, PLACEMENT_STRIDE, disposeLabelGlyphPlan } from './label-plan';
import type { LabelGlyphPlan } from './label-plan';

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** One cached plan positioned on screen, as produced by `MapTileController.getTileBoundingBox`. */
export interface LabelTileView {
  plan: LabelGlyphPlan;
  screenBBox: Box;
}

export interface DrawLabelTilesOptions {
  /** Current fractional viewport zoom. Drives the `text-scale` interpolation. */
  zoom: number;
  /** Viewport size in CSS pixels, used to reject labels that fall outside it. */
  width: number;
  height: number;
  /** Extra breathing room around every label box, in 256-space units. */
  padding?: number;
  /** Set false to keep duplicate labels that straddle a tile seam. */
  dedupe?: boolean;
}

export interface DrawLabelTilesResult {
  /** Features that survived deduping and collision and reached the canvas. */
  drawn: number;
  /** Features suppressed because an equal label had already been placed. */
  deduped: number;
  /** Features suppressed because a higher priority label already owned the space. */
  collided: number;
}

function intersects(a: Box, b: Box): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

/**
 * Uniform grid over the viewport. Labels are small relative to the screen, so bucketing the
 * placed boxes keeps collision resolution linear in the number of labels instead of
 * quadratic, which is what a full-screen pass over several tiles would otherwise cost.
 */
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
    // A label reaching past the viewport still has to block anything that overlaps the part
    // of it that is on screen, so it is kept in a list every query scans.
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

/**
 * Resolves the multiplier a feature's 256-space metrics are drawn at.
 *
 * The `text-scale` interval spans `[tZ, tZ + 1)`, so the fraction is the distance into the
 * tile's own zoom level, clamped: a tile still on screen while over- or under-zoomed keeps
 * the size at the end of its interval instead of extrapolating off it.
 *
 * - Along-line labels are laid out at the tile's discrete zoom and stay welded to the street,
 *   so they take `text-scale[0]`: the lower end of the interval, not an unscaled size.
 * - Point labels interpolate linearly across the interval, so they grow smoothly with a
 *   fractional zoom instead of stepping at every integer boundary.
 * - Icons and circles are authored at absolute 256-space sizes and do not take `text-scale`.
 */
export function resolveLabelScale(flags: number, tileZoom: number, viewZoom: number, scale0: number, scale1: number): number {
  if (flags & LABEL_FLAG_ALONG_LINE) return scale0;
  if (!(flags & LABEL_FLAG_ZOOM_SCALED)) return 1;
  const fraction = Math.min(1, Math.max(0, viewZoom - tileZoom));
  return scale0 + (scale1 - scale0) * fraction;
}

/**
 * The plan stores the interval it was built against, so the renderer does not need the style
 * table. Along-line and point features both carry it in the same slot: the ratio between the
 * worst-case layout and the size being drawn now.
 */
function getPlanScales(plan: LabelGlyphPlan, index: number): [number, number] {
  const scales = plan.scales;
  if (!scales) return [1, 1];
  return [scales[index * 2], scales[index * 2 + 1]];
}

/**
 * Draws one tile's labels that have already won their space.
 *
 * Everything is a plain `drawImage` out of the tile sheet: fills and halos were baked into
 * the sprites when they were rasterised, so a whole tile of text is drawn without touching
 * `font`, `fillStyle` or `strokeStyle` once.
 */
function drawFeature(context: Context2D, plan: LabelGlyphPlan, featureIndex: number, tileX: number, tileY: number, extentToPixel: number, designToPixel: number, scale: number): void {
  const featureOffset = featureIndex * FEATURE_U32_STRIDE;
  const kind = plan.features[featureOffset];
  const flags = plan.features[featureOffset + 5];

  if (kind === LABEL_KIND_CODES.circle) {
    drawCircle(context, plan, featureIndex, tileX, tileY, extentToPixel, designToPixel);
    return;
  }

  if (!(flags & LABEL_FLAG_HAS_GLYPHS) || !plan.sheet) return;

  const start = plan.features[featureOffset + 2];
  const count = plan.features[featureOffset + 3];
  // `text-dy` is a placement offset, not a glyph metric, so it is added after the scale
  // multiply and never takes `text-scale`.
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

/** Circles are vectors, so they are the one kind that still carries paint state. */
function drawCircle(context: Context2D, plan: LabelGlyphPlan, featureIndex: number, tileX: number, tileY: number, extentToPixel: number, designToPixel: number): void {
  const style = plan.circleStyles[plan.features[featureIndex * FEATURE_U32_STRIDE + 1]];
  if (!style || !style['marker-fill'] || !style['marker-width']) return;

  const boundsOffset = featureIndex * FEATURE_F32_STRIDE;
  const centreX = tileX + plan.bounds[boundsOffset] * extentToPixel;
  const centreY = tileY + plan.bounds[boundsOffset + 1] * extentToPixel;
  const radius = (style['marker-width'] * designToPixel) / 2;
  if (radius <= 0) return;

  context.beginPath();
  context.arc(centreX, centreY, radius, 0, Math.PI * 2);
  context.fillStyle = style['marker-fill'];
  context.fill();

  if (style['marker-line-color']) {
    context.strokeStyle = style['marker-line-color'];
    context.lineWidth = Math.max(1, designToPixel);
    context.stroke();
  }
}

/**
 * Draws every visible tile's labels onto the final canvas in one pass.
 *
 * Deduping and collision are resolved across tiles rather than inside one, which is the only
 * way a label that straddles a seam can be drawn once instead of twice, and the only way two
 * labels from neighbouring tiles can be stopped from overlapping. Tiles are consumed in the
 * order they are handed in and features in the order the server sent them, which is its
 * priority order, so whatever is already placed outranks whatever comes next.
 */
export function drawLabelTiles(context: Context2D, tiles: Array<LabelTileView>, options: DrawLabelTilesOptions): DrawLabelTilesResult {
  const index = new CollisionIndex(options.width, options.height);
  const seen = new Set<number>();
  const dedupe = options.dedupe !== false;
  const paddingUnits = options.padding ?? LABEL_COLLISION_PADDING;

  let drawn = 0;
  let deduped = 0;
  let collided = 0;

  for (const tile of tiles) {
    const { plan, screenBBox } = tile;
    const tileWidth = screenBBox.maxX - screenBBox.minX;
    const tileHeight = screenBBox.maxY - screenBBox.minY;
    if (tileWidth <= 0 || tileHeight <= 0) continue;

    const extentToPixel = tileWidth / plan.extent;
    const designToPixel = tileWidth / plan.designSize;
    const padding = paddingUnits * designToPixel;
    const featureCount = plan.features.length / FEATURE_U32_STRIDE;

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
        // Already absolute, in extent units, because a rotated run cannot be rebuilt by
        // scaling a box about a single anchor.
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

      // Off-screen labels are neither drawn nor allowed to reserve space, so a tile only
      // partly on screen does not suppress labels in the tile next to it.
      if (box.maxX < 0 || box.maxY < 0 || box.minX > options.width || box.minY > options.height) continue;

      if (index.collides(box)) {
        collided++;
        continue;
      }

      index.insert(box);
      if (dedupeHash !== 0) seen.add(dedupeHash);

      drawFeature(context, plan, featureIndex, screenBBox.minX, screenBBox.minY, extentToPixel, designToPixel, scale);
      drawn++;
    }
  }

  return { drawn, deduped, collided };
}

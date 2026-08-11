import { clamp } from '../../tools/math';
import { COLLISION_STRIDE, FEATURE_F32_STRIDE, FEATURE_U32_STRIDE, GLYPH_STRIDE, LABEL_FLAG_ALONG_LINE, LABEL_FLAG_HAS_GLYPHS, LABEL_FLAG_SEAM, LABEL_FLAG_ZOOM_SCALED, LABEL_KIND_CODES, LabelGlyphPlan, PLACEMENT_STRIDE } from './label-plan';

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
  dedupe?: boolean;
}

export interface DrawLabelTilesResult {
  drawn: number;
  deduped: number;
  /** Features skipped because their reserved box is off screen. */
  culled: number;
  /** Seam-crossing features dropped because a neighbouring tile got there first. */
  collided: number;
}

const SEAM_CELL_SIZE = 64;

function intersects(a: Box, b: Box): boolean {
  return !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
}

/**
 * Screen-space grid used ONLY to arbitrate across tile seams.
 *
 * Every drawn box is inserted, because a box poking out of tile A can land on a
 * label sitting comfortably inside tile B. Only seam-flagged features are
 * queried, so the per-frame cost is a handful of rectangle tests rather than a
 * full screen-wide placement pass.
 */
class SeamCollisionIndex {
  private readonly columns: number;
  private readonly rows: number;
  private readonly cells: Array<Array<Box> | undefined>;

  constructor(width: number, height: number) {
    this.columns = Math.max(1, Math.ceil(width / SEAM_CELL_SIZE));
    this.rows = Math.max(1, Math.ceil(height / SEAM_CELL_SIZE));
    this.cells = new Array(this.columns * this.rows);
  }

  private column(value: number): number {
    return Math.min(this.columns - 1, Math.max(0, Math.floor(value / SEAM_CELL_SIZE)));
  }

  private row(value: number): number {
    return Math.min(this.rows - 1, Math.max(0, Math.floor(value / SEAM_CELL_SIZE)));
  }

  public collides(box: Box): boolean {
    const minColumn = this.column(box.minX);
    const maxColumn = this.column(box.maxX);
    const minRow = this.row(box.minY);
    const maxRow = this.row(box.maxY);

    for (let row = minRow; row <= maxRow; row++) {
      for (let column = minColumn; column <= maxColumn; column++) {
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
  const t = clamp(viewZoom - tileZoom, 0, 1);

  // 1. The tile is stretched by 2^t across its own interval and `designToPixel` already carries that stretch.
  // 2. The interpolated design size therefore has to be divided by the same 2^t to survive the trip into pixels.
  // px = scale(t) * designToPixel(t) = lerp(scale0, scale1, t) * designToPixel(0)
  return (scale0 + (scale1 - scale0) * t) * Math.pow(2, -t);
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

/**
 * Draws already-placed labels.
 *
 * Placement is NOT decided here. `buildLabelGlyphPlan` resolves collision once
 * per tile, against the worst-case (largest) size each label can reach in its
 * zoom interval, and only the survivors reach the plan. So every feature in a
 * plan is drawable, and this loop is reduced to three cheap per-frame concerns:
 * cross-tile dedupe, viewport culling, and the zoom-interpolated draw size.
 *
 * Plan-stage collision is tile-local, so it cannot see across a tile seam. The
 * plan flags every feature whose reserved box leaves its own tile, and only
 * those are arbitrated here, against a screen-space grid. Interior features are
 * already conflict-free and skip the test entirely. Repeated names across tiles
 * are still suppressed by the dedupe hash.
 */
export function drawLabelTiles(context: Context2D, tiles: Array<LabelTileView>, options: DrawLabelTilesOptions): DrawLabelTilesResult {
  const seen = new Set<number>();
  const dedupe = options.dedupe !== false;
  const seams = new SeamCollisionIndex(options.width, options.height);

  let drawn = 0;
  let deduped = 0;
  let culled = 0;
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

      // The reserved box is already padded and already sized for the worst case,
      // so projecting it costs one multiply per edge and needs no scale at all.
      const collisionOffset = featureIndex * COLLISION_STRIDE;
      const minX = screenBBox.minX + plan.collisions[collisionOffset] * extentToPixel;
      const minY = screenBBox.minY + plan.collisions[collisionOffset + 1] * extentToPixel;
      const maxX = screenBBox.minX + plan.collisions[collisionOffset + 2] * extentToPixel;
      const maxY = screenBBox.minY + plan.collisions[collisionOffset + 3] * extentToPixel;

      if (maxX < 0 || maxY < 0 || minX > options.width || minY > options.height) {
        culled++;
        continue;
      }

      const scales = getPlanScales(plan, featureIndex);
      const scale = resolveLabelScale(flags, plan.zoom, options.zoom, scales[0], scales[1]);
      if (scale <= 0) continue;

      // Only boxes that leave their own tile can conflict with another tile's
      // labels; everything else was already resolved at plan time.
      const box: Box = { minX, minY, maxX, maxY };
      if ((flags & LABEL_FLAG_SEAM) !== 0 && seams.collides(box)) {
        collided++;
        continue;
      }
      seams.insert(box);

      if (dedupeHash !== 0) seen.add(dedupeHash);

      if (plan.features[featureOffset] === LABEL_KIND_CODES.circle) {
        const styleReference = plan.features[featureOffset + 1];
        if (!circles.has(styleReference)) circles.set(styleReference, []);
        const boundsOffset = featureIndex * FEATURE_F32_STRIDE;
        const centreX = screenBBox.minX + plan.bounds[boundsOffset] * extentToPixel;
        const centreY = screenBBox.minY + plan.bounds[boundsOffset + 1] * extentToPixel;
        circles.get(styleReference)?.push([centreX, centreY]);
      } else {
        drawGlyphs(context, plan, featureIndex, screenBBox.minX, screenBBox.minY, extentToPixel, designToPixel, scale);
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

  return { drawn, deduped, culled, collided };
}

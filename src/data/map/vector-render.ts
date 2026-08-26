import { clamp } from '../../tools/math';
import { TileInfo } from '../../tools/tile-controller';
import { pickFrameIndex, resolveStrokeWidth } from './vector';
import { VectorPlan } from './vector-plan';

const designTileSize = 256;

const canvas = new OffscreenCanvas(1, 1);
const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

/**
 * The sub-square of a plan's tile that a frame must cover, in tile units.
 *
 * A whole tile is `{ x: 0, y: 0, size: 1 }`. A coarser plan standing in for a tile that
 * has not arrived yet passes the quarter / sixteenth / ... that covers exactly the
 * missing tile's ground, which is the vector equivalent of stretching a sub-rectangle
 * of an ancestor bitmap.
 */
export interface VectorFrameRegion {
  x: number;
  y: number;
  size: number;
}

export interface VectorFrameRequest {
  /** Device-pixel width of the bitmap to produce. */
  width: number;
  /** Device-pixel height of the bitmap to produce. */
  height: number;
  /** Defaults to the whole tile. */
  region?: VectorFrameRegion | null;
  /**
   * Offset into the plan's `[zoom, zoom + 1]` scale interval. It is clamped here, so a
   * plan asked for far outside its own octave is rasterized with the widths it ships at
   * `zoom + 1` rather than with widths extrapolated past the shipped interval.
   */
  deltaZoom: number;
  /** Background painted under the geometry. Pass `null` for a transparent frame. */
  background?: string | null;
}

const defaultRegion: VectorFrameRegion = { x: 0, y: 0, size: 1 };

/**
 * Picks the frame the plan ships closest to `viewZoom` and reports the offset it is
 * styled for.
 *
 * `pickFrameIndex` clamps `viewZoom - plan.zoom` into `[0, 1]`, so the returned offset is
 * always one the server actually shipped: for a coarse plan used past its octave this
 * saturates at the last frame instead of inventing a new one.
 */
export function resolveVectorFrame(vectorPlan: VectorPlan, viewZoom: number): { frameIndex: number; deltaZoom: number } {
  const frameIndex = pickFrameIndex(vectorPlan.frameDeltaZooms, viewZoom, vectorPlan.zoom);
  const deltaZoom = clamp(vectorPlan.frameDeltaZooms[frameIndex] ?? 0, 0, 1);
  return { frameIndex, deltaZoom };
}

/**
 * Rasterizes a plan (or a sub-square of it) into a bitmap of an explicit device-pixel
 * size.
 *
 * Resolution and zoom are independent inputs on purpose. The render size follows the
 * tile's current screen box, while the styling offset is clamped to `[0, 1]`: a plan can
 * therefore be rasterized again at a new size without its widths changing, which is
 * exactly what happens once the viewport leaves the plan's own octave.
 */
export function renderVectorFrame(vectorPlan: VectorPlan, request: VectorFrameRequest): ImageBitmap {
  const region = request.region ?? defaultRegion;
  const deltaZoom = clamp(request.deltaZoom, 0, 1);

  const renderWidth = Math.max(1, Math.floor(request.width));
  const renderHeight = Math.max(1, Math.floor(request.height));

  canvas.width = renderWidth;
  canvas.height = renderHeight;

  // Resizing the backing store already resets the state, but the transform is set
  // explicitly so a same-size frame cannot inherit the previous one's mapping.
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalAlpha = 1;
  context.setLineDash([]);
  context.clearRect(0, 0, renderWidth, renderHeight);

  const background = request.background === undefined ? '#f2f2f7' : request.background; // TODO: vectorTile['background']
  if (background) {
    context.save();
    context.fillStyle = background;
    context.fillRect(0, 0, renderWidth, renderHeight);
    context.restore();
  }

  const { extent, coordinates, partStartIndices, descriptorStartIndices, styleReferences, styleStartIndices, styles } = vectorPlan;

  // Map the requested sub-square of tile space onto the whole bitmap. For a full tile
  // this is the plain `renderSize / extent` scale; for a sub-square it is that scale
  // divided by the sub-square's size, which is the stretch a stand-in tile undergoes.
  const scaleX = renderWidth / (extent * region.size);
  const scaleY = renderHeight / (extent * region.size);
  context.setTransform(scaleX, 0, 0, scaleY, -region.x * extent * scaleX, -region.y * extent * scaleY);

  // Widths are authored against a 256 px tile, so they are converted into tile units
  // once and then follow the transform above: they stretch with a stand-in tile and
  // sharpen with the device pixel ratio, without either being special-cased.
  const globalStrokeScaleFactor = extent / designTileSize;

  for (let i = 0, l = styleReferences.length; i < l; i++) {
    context.save();

    // style run -> descriptor -> part (ring / line) -> point
    const descriptorStart = styleStartIndices[i];
    const descriptorEnd = styleStartIndices[i + 1];
    context.beginPath();
    for (let j = descriptorStart; j < descriptorEnd; j++) {
      const partStart = descriptorStartIndices[j];
      const partEnd = descriptorStartIndices[j + 1];
      for (let p = partStart; p < partEnd; p++) {
        const pointStart = partStartIndices[p];
        const pointEnd = partStartIndices[p + 1];
        if (pointStart === pointEnd) continue;
        context.moveTo(coordinates[pointStart * 2], coordinates[pointStart * 2 + 1]);
        for (let k = pointStart + 1; k < pointEnd; k++) {
          context.lineTo(coordinates[k * 2], coordinates[k * 2 + 1]);
        }
      }
    }

    const style = styles[styleReferences[i]];
    const opacity = style['opacity'] || 1;
    if (style['opacity']) context.globalAlpha = opacity;
    if (style.fill) {
      context.fillStyle = style.fill;
      if (style['fill-opacity']) context.globalAlpha = opacity * style['fill-opacity'];
      context.fill();
      if (style['fill-opacity']) context.globalAlpha = opacity;
    }
    if (style.stroke) {
      // stroke-width is a reference width; stroke-width-scale is its [s0, s1]
      // multiplier across [zoom, zoom + 1], sampled at this frame's clamped deltaZoom.
      if (style['stroke-width']) context.lineWidth = resolveStrokeWidth(style, deltaZoom) * globalStrokeScaleFactor;
      if (style['stroke-linecap']) context.lineCap = style['stroke-linecap'];
      if (style['stroke-linejoin']) context.lineJoin = style['stroke-linejoin'];
      // The dash pattern is intentionally NOT scaled with zoom: the authored rhythm stays
      // put so dashes do not visibly re-phase while zooming inside one octave.
      if (style['stroke-dasharray']) context.setLineDash(style['stroke-dasharray'].map((v) => v * globalStrokeScaleFactor));
      if (style['stroke-opacity']) context.globalAlpha = opacity * style['stroke-opacity'];
      context.strokeStyle = style.stroke;
      context.stroke();
      if (style['stroke-opacity']) context.globalAlpha = opacity;
    }
    context.restore();
  }

  return canvas.transferToImageBitmap();
}

/**
 * Rasterizes a whole tile at its current screen size. Kept as the simple entry point for
 * callers that draw a plan as its own tile.
 */
export function getVectorTileFrame(vectorPlan: VectorPlan, tile: TileInfo, viewZoom: number, devicePixelRatio: number): ImageBitmap {
  const { deltaZoom } = resolveVectorFrame(vectorPlan, viewZoom);
  return renderVectorFrame(vectorPlan, {
    width: (tile.screenBBox.maxX - tile.screenBBox.minX) * devicePixelRatio,
    height: (tile.screenBBox.maxY - tile.screenBBox.minY) * devicePixelRatio,
    deltaZoom
  });
}

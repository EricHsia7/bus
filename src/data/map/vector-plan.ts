import { VectorTile, VectorTileStyle, resolveStrokeWidth } from './vector';

export interface VectorPlan {
  bitmaps: Array<ImageBitmap>;
}

/**
 * One rasterization of a tile at a fractional zoom offset.
 *
 * `deltaZoom` is `viewZoom - tile.zoom` in `[0, 1]`, the point inside the tile's
 * octave that every `[s0, s1]` interval was evaluated at. A tile whose
 * `frameDeltaZooms` is `[0]` needs exactly one of these for its whole lifetime.
 *
 * This is the *expensive, evictable* half of a cached tile: a 1024x1024 bitmap
 * is 4 MB, ~2 orders of magnitude more than the typed arrays it came from.
 */
export interface VectorFrame extends VectorPlan {
  /** Index into `tile.frameDeltaZooms`; the frame's cache key. */
  frameIndex: number;
  deltaZoom: number;
}

const renderSize = 1024;
const designTileSize = 256;

/**
 * Rasterize a tile at a fractional zoom offset.
 *
 * Geometry is identical for every frame of a tile — only the scaled properties
 * differ — so the path building below is deliberately independent of
 * `deltaZoom`. That is what makes re-rendering an evicted frame cheap: the
 * retained typed arrays are walked again, nothing is refetched or re-parsed.
 */
export function buildVectorFrame(vectorTile: VectorTile, frameIndex: number): VectorFrame {
  const frames = vectorTile.frameDeltaZooms;
  const clampedIndex = frameIndex < 0 ? 0 : frameIndex >= frames.length ? frames.length - 1 : frameIndex;
  const deltaZoom = frames[clampedIndex];

  const canvas = new OffscreenCanvas(renderSize, renderSize);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  context.save();
  context.fillStyle = '#f2f2f7'; // TODO: vectorTile['background']
  context.fillRect(0, 0, renderSize, renderSize);
  context.restore();

  context.scale(renderSize / vectorTile.extent, renderSize / vectorTile.extent);
  const globalStrokeScaleFactor = vectorTile.extent / designTileSize; // (vectorTile.extent / renderSize) * (renderSize / designTileSize);

  const { coordinates, partStartIndices, descriptorStartIndices, styleReferences, styleStartIndices, styles } = vectorTile;

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

    const style: VectorTileStyle = styles[styleReferences[i]];
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
      // multiplier across [zoom, zoom + 1], sampled at this frame's deltaZoom.
      if (style['stroke-width']) context.lineWidth = resolveStrokeWidth(style, deltaZoom) * globalStrokeScaleFactor;
      if (style['stroke-linecap']) context.lineCap = style['stroke-linecap'];
      if (style['stroke-linejoin']) context.lineJoin = style['stroke-linejoin'];
      // The dash pattern is intentionally NOT scaled: the authored rhythm stays
      // put so dashes do not visibly re-phase while zooming inside one octave.
      if (style['stroke-dasharray']) context.setLineDash(style['stroke-dasharray'].map((v) => v * globalStrokeScaleFactor));
      if (style['stroke-opacity']) context.globalAlpha = opacity * style['stroke-opacity'];
      context.strokeStyle = style.stroke;
      context.stroke();
      if (style['stroke-opacity']) context.globalAlpha = opacity;
    }
    context.restore();
  }

  return { frameIndex: clampedIndex, deltaZoom, bitmaps: [canvas.transferToImageBitmap()] };
}

/** Frame 0 (the tile's own zoom). Kept for callers that do not care about frames. */
export function buildVectorPlan(vectorTile: VectorTile): VectorPlan {
  return buildVectorFrame(vectorTile, 0);
}

/** Bytes a frame holds on the GPU/heap; the unit the frame cache budgets in. */
export function vectorFrameByteLength(frame: VectorPlan): number {
  let bytes = 0;
  for (const bitmap of frame.bitmaps) bytes += bitmap.width * bitmap.height * 4;
  return bytes;
}

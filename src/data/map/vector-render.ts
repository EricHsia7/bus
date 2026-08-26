import { TileInfo } from '../../tools/tile-controller';
import { resolveStrokeWidth } from './vector';
import { VectorPlan } from './vector-plan';

const designTileSize = 256;

const canvas = new OffscreenCanvas(1, 1);
const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

export function getVectorTileFrame(vectorPlan: VectorPlan, tile: TileInfo, viewZoom: number, devicePixelRatio: number): ImageBitmap {
  const deltaZoom = viewZoom - vectorPlan.zoom;

  const renderWidth = Math.floor((tile.screenBBox.maxX - tile.screenBBox.minX) * devicePixelRatio);
  const renderHeight = Math.floor((tile.screenBBox.maxY - tile.screenBBox.minY) * devicePixelRatio);

  canvas.width = renderWidth;
  canvas.height = renderHeight;

  context.save();
  context.fillStyle = '#f2f2f7'; // TODO: vectorTile['background']
  context.fillRect(0, 0, renderWidth, renderHeight);
  context.restore();

  context.scale(renderWidth / vectorPlan.extent, renderHeight / vectorPlan.extent);
  const globalStrokeScaleFactor = vectorPlan.extent / designTileSize; // (vectorTile.extent / renderSize) * (renderSize / designTileSize);

  const { coordinates, partStartIndices, descriptorStartIndices, styleReferences, styleStartIndices, styles } = vectorPlan;

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

  return canvas.transferToImageBitmap();
}

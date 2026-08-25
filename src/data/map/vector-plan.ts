import { VectorTile } from './vector';

export interface VectorPlan {
  bitmaps: Array<ImageBitmap>;
}

const renderSize = 1024;
const designTileSize = 256;

export function buildVectorPlan(vectorTile: VectorTile): VectorPlan {
  const canvas = new OffscreenCanvas(renderSize, renderSize);
  const context = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;

  context.save();
  context.fillStyle = '#f2f2f7'; // TODO: vectorTile['background']
  context.fillRect(0, 0, renderSize, renderSize);
  context.restore();

  context.scale(renderSize / vectorTile.extent, renderSize / vectorTile.extent);
  const globalStrokeScaleFactor = vectorTile.extent / designTileSize; // (vectorTile.extent / renderSize) * (renderSize / designTileSize);
  for (let i = 0, l = vectorTile.styleReferences.length; i < l; i++) {
    context.save();
    const start = vectorTile.styleStartIndices[i];
    const end = vectorTile.styleStartIndices[i + 1];
    context.beginPath();
    for (let j = start; j < end; j++) {
      for (let ringIndex = 0, ringsCount = vectorTile.descriptors[j].geometry.length; ringIndex < ringsCount; ringIndex++) {
        context.moveTo(vectorTile.descriptors[j].geometry[ringIndex][0][0], vectorTile.descriptors[j].geometry[ringIndex][0][1]);
        for (let pointIndex = 1, pointsCount = vectorTile.descriptors[j].geometry[ringIndex].length; pointIndex < pointsCount; pointIndex++) {
          context.lineTo(vectorTile.descriptors[j].geometry[ringIndex][pointIndex][0], vectorTile.descriptors[j].geometry[ringIndex][pointIndex][1]);
        }
      }
    }
    const style = vectorTile.styles[vectorTile.styleReferences[i]];
    const opacity = style['opacity'] || 1;
    if (style['opacity']) context.globalAlpha = opacity;
    if (style.fill) {
      context.fillStyle = style.fill;
      if (style['fill-opacity']) context.globalAlpha = opacity * style['fill-opacity'];
      context.fill();
      if (style['fill-opacity']) context.globalAlpha = opacity;
    }
    if (style.stroke) {
      if (style['stroke-width']) context.lineWidth = style['stroke-width'] * globalStrokeScaleFactor;
      if (style['stroke-linecap']) context.lineCap = style['stroke-linecap'];
      if (style['stroke-linejoin']) context.lineJoin = style['stroke-linejoin'];
      if (style['stroke-dasharray']) context.setLineDash(style['stroke-dasharray'].map((v) => v * globalStrokeScaleFactor));
      if (style['stroke-opacity']) context.globalAlpha = opacity * style['stroke-opacity'];
      context.strokeStyle = style.stroke;
      context.stroke();
      if (style['stroke-opacity']) context.globalAlpha = opacity;
    }
    context.restore();
  }

  return { bitmaps: [canvas.transferToImageBitmap()] };
  // TODO: render at fractional zooms
}

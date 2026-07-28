import { Camera } from '../../tools/camera';
import { LabelEngine, PlacedLabel } from './labels';
import { DrawTile } from './tiles';

/** size the canvas for the current devicePixelRatio; returns true if it changed */
export function resizeMapCanvas(canvas: HTMLCanvasElement, camera: Camera, maxDevicePixelRatio = 2): boolean {
  const pixelRatio = Math.min(maxDevicePixelRatio, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const pixelWidth = Math.round(width * pixelRatio);
  const pixelHeight = Math.round(height * pixelRatio);
  if (canvas.width === pixelWidth && canvas.height === pixelHeight && camera.width === width) return false;
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  camera.resize(width, height);
  return true;
}

export function clear(context: CanvasRenderingContext2D, camera: Camera, pixelRatio: number, background = '#f0f3f7'): void {
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, camera.width, camera.height);
  context.fillStyle = background;
  context.fillRect(0, 0, camera.width, camera.height);
}

export function drawRasters(context: CanvasRenderingContext2D, tiles: DrawTile[], pixelRatio: number): void {
  for (const tile of tiles) {
    // snap to whole device pixels: rounding both edges keeps tiles gap-free
    const left = Math.round(tile.dst.left * pixelRatio) / pixelRatio;
    const top = Math.round(tile.dst.top * pixelRatio) / pixelRatio;
    const right = Math.round(tile.dst.right * pixelRatio) / pixelRatio;
    const bottom = Math.round(tile.dst.bottom * pixelRatio) / pixelRatio;
    const width = right - left;
    const height = bottom - top;
    if (width <= 0 || height <= 0) continue;
    if (tile.opacity <= 0) continue;
    context.globalAlpha = tile.opacity;
    if (tile.src) {
      context.drawImage(tile.bitmap, tile.src.x, tile.src.y, tile.src.w, tile.src.h, left, top, width, height);
    } else {
      context.drawImage(tile.bitmap, left, top, width, height);
    }
  }
  // reset so subsequent label drawing starts fully opaque
  context.globalAlpha = 1;
}

export function drawLabels(context: CanvasRenderingContext2D, labels: PlacedLabel[]): void {
  for (const label of labels) {
    const { style, lines, lineHeight } = label;
    if (label.opacity <= 0) continue;

    context.save();
    context.globalAlpha = label.opacity;
    context.font = LabelEngine.fontOf(style);
    if (style.letterSpacing && 'letterSpacing' in context) {
      (context as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${style.letterSpacing}px`;
    }
    if (label.angle) {
      context.translate(label.x, label.y);
      context.rotate(label.angle);
      context.translate(-label.x, -label.y);
    }

    const firstLineY = label.y - ((lines.length - 1) * lineHeight) / 2;
    if (style.haloFill && style.haloRadius > 0) {
      context.strokeStyle = style.haloFill;
      context.lineWidth = style.haloRadius * 2;
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        context.strokeText(lines[lineIndex], label.x, firstLineY + lineIndex * lineHeight);
      }
    }
    context.fillStyle = style.fill;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      context.fillText(lines[lineIndex], label.x, firstLineY + lineIndex * lineHeight);
    }
    context.restore();
  }
}

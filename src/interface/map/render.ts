import type { Camera } from '../../tools/camera';
import { LabelEngine, type PlacedLabel } from './labels';
import type { DrawTile } from './tiles';

export interface RenderOptions {
  background?: string;
  debug?: boolean;
}

/** size the canvas for the current devicePixelRatio; returns true if it changed */
export function resizeCanvas(canvas: HTMLCanvasElement, camera: Camera, maxDevicePixelRatio = 2): boolean {
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
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  for (const tile of tiles) {
    // snap to whole device pixels: rounding both edges keeps tiles gap-free
    const left = Math.round(tile.dst.left * pixelRatio) / pixelRatio;
    const top = Math.round(tile.dst.top * pixelRatio) / pixelRatio;
    const right = Math.round(tile.dst.right * pixelRatio) / pixelRatio;
    const bottom = Math.round(tile.dst.bottom * pixelRatio) / pixelRatio;
    const width = right - left;
    const height = bottom - top;
    if (width <= 0 || height <= 0) continue;
    if (tile.src) {
      context.drawImage(tile.bitmap, tile.src.x, tile.src.y, tile.src.w, tile.src.h, left, top, width, height);
    } else {
      context.drawImage(tile.bitmap, left, top, width, height);
    }
  }
}

export function drawLabels(context: CanvasRenderingContext2D, labels: PlacedLabel[]): void {
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.lineJoin = 'round';
  context.miterLimit = 2;

  for (const label of labels) {
    const { style, lines, lineHeight } = label;
    const alpha = Math.max(0, Math.min(1, label.opacity));
    if (alpha <= 0.01) continue;

    context.save();
    context.globalAlpha = alpha;
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

/** tile grid + keys + label boxes, toggled with the `d` key */
export function drawDebug(context: CanvasRenderingContext2D, tiles: DrawTile[], labels: PlacedLabel[]): void {
  context.save();
  context.font = '11px ui-monospace, "SFMono-Regular", Menlo, monospace';
  context.textAlign = 'left';
  context.textBaseline = 'top';
  context.lineWidth = 1;
  for (const tile of tiles) {
    const { left, top, right, bottom } = tile.dst;
    context.strokeStyle = tile.fallback ? 'rgba(220,80,40,.9)' : 'rgba(30,90,220,.6)';
    context.strokeRect(left + 0.5, top + 0.5, right - left - 1, bottom - top - 1);
    const key = `${tile.coord.z}/${tile.coord.x}/${tile.coord.y}${tile.fallback ? ' \u2191' : ''}`;
    context.fillStyle = 'rgba(255,255,255,.85)';
    context.fillRect(left + 3, top + 3, context.measureText(key).width + 6, 15);
    context.fillStyle = '#222';
    context.fillText(key, left + 6, top + 5);
  }
  context.strokeStyle = 'rgba(0,160,80,.7)';
  for (const label of labels) {
    if (label.opacity <= 0.01) continue;
    context.strokeRect(label.x - label.width / 2, label.y - label.height / 2, label.width, label.height);
  }
  context.restore();
}

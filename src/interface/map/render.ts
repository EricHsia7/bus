import type { Camera } from './camera';
import { LabelEngine, type PlacedLabel } from './labels';
import type { DrawTile } from './tiles';

export interface RenderOptions {
  background?: string;
  debug?: boolean;
}

/** size the canvas for the current devicePixelRatio; returns true if it changed */
export function resizeCanvas(canvas: HTMLCanvasElement, camera: Camera, maxDpr = 2): boolean {
  const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const pxW = Math.round(width * dpr);
  const pxH = Math.round(height * dpr);
  if (canvas.width === pxW && canvas.height === pxH && camera.width === width) return false;
  canvas.width = pxW;
  canvas.height = pxH;
  camera.resize(width, height);
  return true;
}

export function clear(ctx: CanvasRenderingContext2D, camera: Camera, dpr: number, background = '#f0f3f7'): void {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, camera.width, camera.height);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, camera.width, camera.height);
}

export function drawRasters(ctx: CanvasRenderingContext2D, tiles: DrawTile[], dpr: number): void {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  for (const tile of tiles) {
    // snap to whole device pixels: rounding both edges keeps tiles gap-free
    const left = Math.round(tile.dst.left * dpr) / dpr;
    const top = Math.round(tile.dst.top * dpr) / dpr;
    const right = Math.round(tile.dst.right * dpr) / dpr;
    const bottom = Math.round(tile.dst.bottom * dpr) / dpr;
    const w = right - left;
    const h = bottom - top;
    if (w <= 0 || h <= 0) continue;
    if (tile.src) {
      ctx.drawImage(tile.bitmap, tile.src.x, tile.src.y, tile.src.w, tile.src.h, left, top, w, h);
    } else {
      ctx.drawImage(tile.bitmap, left, top, w, h);
    }
  }
}

export function drawLabels(ctx: CanvasRenderingContext2D, labels: PlacedLabel[]): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;

  for (const label of labels) {
    const { style, lines, lineHeight } = label;
    const alpha = Math.max(0, Math.min(1, label.opacity));
    if (alpha <= 0.01) continue;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = LabelEngine.fontOf(style);
    if (style.letterSpacing && 'letterSpacing' in ctx) {
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${style.letterSpacing}px`;
    }
    if (label.angle) {
      ctx.translate(label.x, label.y);
      ctx.rotate(label.angle);
      ctx.translate(-label.x, -label.y);
    }

    const firstY = label.y - ((lines.length - 1) * lineHeight) / 2;
    if (style.haloFill && style.haloRadius > 0) {
      ctx.strokeStyle = style.haloFill;
      ctx.lineWidth = style.haloRadius * 2;
      for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i], label.x, firstY + i * lineHeight);
      }
    }
    ctx.fillStyle = style.fill;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], label.x, firstY + i * lineHeight);
    }
    ctx.restore();
  }
}

/** tile grid + keys + label boxes, toggled with the `d` key */
export function drawDebug(ctx: CanvasRenderingContext2D, tiles: DrawTile[], labels: PlacedLabel[]): void {
  ctx.save();
  ctx.font = '11px ui-monospace, "SFMono-Regular", Menlo, monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.lineWidth = 1;
  for (const tile of tiles) {
    const { left, top, right, bottom } = tile.dst;
    ctx.strokeStyle = tile.fallback ? 'rgba(220,80,40,.9)' : 'rgba(30,90,220,.6)';
    ctx.strokeRect(left + 0.5, top + 0.5, right - left - 1, bottom - top - 1);
    const key = `${tile.coord.z}/${tile.coord.x}/${tile.coord.y}${tile.fallback ? ' ↑' : ''}`;
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillRect(left + 3, top + 3, ctx.measureText(key).width + 6, 15);
    ctx.fillStyle = '#222';
    ctx.fillText(key, left + 6, top + 5);
  }
  ctx.strokeStyle = 'rgba(0,160,80,.7)';
  for (const label of labels) {
    if (label.opacity <= 0.01) continue;
    ctx.strokeRect(label.x - label.width / 2, label.y - label.height / 2, label.width, label.height);
  }
  ctx.restore();
}

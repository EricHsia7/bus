/**
 * labels.ts — live label placement.
 *
 * Every frame:
 *   1. project each candidate label from the loaded label tiles,
 *   2. drop off-screen ones and de-duplicate across tile boundaries / zoom levels,
 *   3. sort by priority (already-visible labels win ties so nothing flickers),
 *   4. measure + wrap text (cached), then test the box against an R-tree,
 *   5. drive a per-label opacity towards 1 (placed) or 0 (rejected/gone) so
 *      labels fade in and out instead of popping.
 *
 * The backend already filtered/placed labels per the CartoCSS, so this stage only
 * has to resolve *screen space* conflicts, which is exactly what a raster basemap
 * with a live label layer needs.
 */

// TODO: pre-project coordinates

import type { Camera } from './camera';
import RBush, { type BBox } from 'rbush';
import type { LabelStyle, PackedLabelTile } from './types';

export interface PlacedLabel {
  id: string;
  lines: string[];
  /** screen position of the text block centre (dy already applied) */
  x: number;
  y: number;
  width: number;
  height: number;
  lineHeight: number;
  angle: number;
  opacity: number;
  style: LabelStyle;
}

interface LabelState {
  opacity: number;
  target: number;
  /** kept in mercator units so a fading-out label still tracks the map */
  mx: number;
  my: number;
  lines: string[];
  width: number;
  height: number;
  lineHeight: number;
  angle: number;
  style: LabelStyle;
  seen: number;
}

interface Box extends BBox {
  id: string;
}

export interface LabelEngineOptions {
  fadeDuration?: number;
  /** extra padding around each label box, screen px */
  padding?: number;
  /** how far outside the viewport labels may still be placed, screen px */
  viewportPadding?: number;
  maxLabels?: number;
}

const decoder = new TextDecoder();

/** CJK / full-width ranges may break between any two characters */
const CJK = /[\u1100-\u11FF\u2E80-\uA4CF\uA960-\uA97F\uAC00-\uD7FF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF9F]/;

export class LabelEngine {
  private states = new Map<string, LabelState>();
  private tree = new RBush<Box>(9);
  private measureCache = new Map<string, number>();
  private textCache = new WeakMap<PackedLabelTile, Array<string | undefined>>();
  private fade: number;
  private padding: number;
  private viewportPadding: number;
  private maxLabels: number;

  /** true while any label is mid-fade (host keeps rendering) */
  animating = false;
  enabled = true;
  lastPlaced = 0;
  lastCandidates = 0;

  constructor(opts: LabelEngineOptions = {}) {
    this.fade = opts.fadeDuration ?? 160;
    this.padding = opts.padding ?? 2;
    this.viewportPadding = opts.viewportPadding ?? 48;
    this.maxLabels = opts.maxLabels ?? 2000;
  }

  reset(): void {
    this.states.clear();
    this.tree.clear();
  }

  /** decode a label's UTF-8 slice once per tile */
  private textOf(tile: PackedLabelTile, i: number): string {
    let cache = this.textCache.get(tile);
    if (!cache) {
      cache = new Array(tile.count);
      this.textCache.set(tile, cache);
    }
    const hit = cache[i];
    if (hit !== undefined) return hit;
    const text = decoder.decode(tile.text.subarray(tile.textStart[i], tile.textStart[i + 1]));
    cache[i] = text;
    return text;
  }

  private measure(ctx: CanvasRenderingContext2D, font: string, text: string): number {
    const key = `${font}\u0000${text}`;
    const hit = this.measureCache.get(key);
    if (hit !== undefined) return hit;
    const width = ctx.measureText(text).width;
    if (this.measureCache.size > 20000) this.measureCache.clear();
    this.measureCache.set(key, width);
    return width;
  }

  /** greedy wrap; CJK breaks per character, latin on spaces */
  private wrap(ctx: CanvasRenderingContext2D, font: string, text: string, wrapWidth: number): { lines: string[]; width: number } {
    const single = this.measure(ctx, font, text);
    if (!wrapWidth || single <= wrapWidth || text.length < 2) {
      return { lines: [text], width: single };
    }
    const tokens: string[] = [];
    let buffer = '';
    for (const ch of text) {
      if (ch === ' ' || ch === '\n') {
        if (buffer) tokens.push(buffer);
        buffer = '';
      } else if (CJK.test(ch)) {
        if (buffer) tokens.push(buffer);
        buffer = '';
        tokens.push(ch);
      } else {
        buffer += ch;
      }
    }
    if (buffer) tokens.push(buffer);

    const lines: string[] = [];
    let line = '';
    let width = 0;
    for (const token of tokens) {
      const joiner = line && !CJK.test(token) && !CJK.test(line.slice(-1)) ? ' ' : '';
      const next = line + joiner + token;
      const w = this.measure(ctx, font, next);
      if (line && w > wrapWidth) {
        lines.push(line);
        width = Math.max(width, this.measure(ctx, font, line));
        line = token;
      } else {
        line = next;
      }
    }
    if (line) {
      lines.push(line);
      width = Math.max(width, this.measure(ctx, font, line));
    }
    return { lines, width };
  }

  static fontOf(style: LabelStyle): string {
    return `${style.fontPrefix} ${style.size}px ${style.fontFamily}`;
  }

  /**
   * Place labels for this frame.
   * @param dt milliseconds since the previous call (drives the fades)
   */
  update(ctx: CanvasRenderingContext2D, camera: Camera, tiles: PackedLabelTile[], dt: number, frame: number): PlacedLabel[] {
    const step = this.fade > 0 ? Math.min(1, dt / this.fade) : 1;
    for (const state of this.states.values()) state.target = 0;

    if (this.enabled) this.place(ctx, camera, tiles, frame);

    /* ---- advance fades and emit the draw list ---- */
    const out: PlacedLabel[] = [];
    this.animating = false;
    for (const [id, state] of this.states) {
      const delta = state.target - state.opacity;
      if (Math.abs(delta) < 0.01) {
        state.opacity = state.target;
      } else {
        state.opacity += delta * step;
        this.animating = true;
      }
      if (state.opacity <= 0 && state.target === 0) {
        this.states.delete(id);
        continue;
      }
      out.push({
        id,
        lines: state.lines,
        x: camera.projectX(state.mx),
        y: camera.projectY(state.my) + state.style.dy,
        width: state.width,
        height: state.height,
        lineHeight: state.lineHeight,
        angle: state.angle,
        opacity: state.opacity,
        style: state.style
      });
    }
    this.lastPlaced = out.length;
    return out;
  }

  private place(ctx: CanvasRenderingContext2D, camera: Camera, tiles: PackedLabelTile[], frame: number): void {
    const pad = this.viewportPadding;
    const minX = -pad;
    const minY = -pad;
    const maxX = camera.width + pad;
    const maxY = camera.height + pad;

    /* ---- 1. gather + dedupe candidates ---- */
    interface Candidate {
      id: string;
      tile: PackedLabelTile;
      i: number;
      sx: number;
      sy: number;
      priority: number;
      wasVisible: number;
    }
    const seen = new Set<string>();
    const candidates: Candidate[] = [];

    for (const tile of tiles) {
      for (let i = 0; i < tile.count; i++) {
        const mx = tile.anchors[i * 2];
        const my = tile.anchors[i * 2 + 1];
        const sx = camera.projectX(mx);
        if (sx < minX || sx > maxX) continue;
        const sy = camera.projectY(my);
        if (sy < minY || sy > maxY) continue;

        const text = this.textOf(tile, i);
        // same feature can appear in neighbouring tiles: identity = text + position
        const id = `${text}@${Math.round(mx * 4194304)},${Math.round(my * 4194304)}`;
        if (seen.has(id)) continue;
        seen.add(id);
        const state = this.states.get(id);
        candidates.push({
          id,
          tile,
          i,
          sx,
          sy,
          priority: tile.priority[i],
          wasVisible: state && state.opacity > 0 ? 0 : 1
        });
      }
    }
    this.lastCandidates = candidates.length;

    /* ---- 2. priority sort (sticky: visible labels keep their slot) ---- */
    candidates.sort((a, b) => a.wasVisible - b.wasVisible || a.priority - b.priority);

    /* ---- 3. collision-test in priority order ---- */
    this.tree.clear();
    let placed = 0;
    for (const c of candidates) {
      const style = c.tile.styles[c.tile.styleIdx[c.i]];
      const font = LabelEngine.fontOf(style);
      ctx.font = font;
      const text = this.textOf(c.tile, c.i);
      const { lines, width } = this.wrap(ctx, font, text, style.wrapWidth);
      const lineHeight = Math.round(style.size * 1.2);
      const height = lineHeight * lines.length;

      let angle = 0;
      if (style.placement === 'line') {
        angle = this.lineAngle(camera, c.tile, c.i);
      }

      const cy = c.sy + style.dy;
      // axis-aligned box; for rotated labels use the rotated extent
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      const halfW = (width * cos + height * sin) / 2 + this.padding;
      const halfH = (width * sin + height * cos) / 2 + this.padding;
      const box: Box = {
        id: c.id,
        minX: c.sx - halfW,
        minY: cy - halfH,
        maxX: c.sx + halfW,
        maxY: cy + halfH
      };

      const rejected = placed >= this.maxLabels || this.tree.collides(box);
      let state = this.states.get(c.id);
      if (!state) {
        state = {
          opacity: 0,
          target: 0,
          mx: c.tile.anchors[c.i * 2],
          my: c.tile.anchors[c.i * 2 + 1],
          lines,
          width,
          height,
          lineHeight,
          angle,
          style,
          seen: frame
        };
        this.states.set(c.id, state);
      }
      state.lines = lines;
      state.width = width;
      state.height = height;
      state.lineHeight = lineHeight;
      state.angle = angle;
      state.style = style;
      state.seen = frame;
      state.target = rejected ? 0 : 1;

      if (!rejected) {
        this.tree.insert(box);
        placed++;
      }
    }
  }

  /** upright angle of the longest projected segment of a line-placed label */
  private lineAngle(camera: Camera, tile: PackedLabelTile, i: number): number {
    const start = tile.lineStart[i];
    const end = tile.lineStart[i + 1];
    if (end - start < 2) return 0;
    let best = 0;
    let bestLen = -1;
    for (let p = start + 1; p < end; p++) {
      const x1 = camera.projectX(tile.lines[(p - 1) * 2]);
      const y1 = camera.projectY(tile.lines[(p - 1) * 2 + 1]);
      const x2 = camera.projectX(tile.lines[p * 2]);
      const y2 = camera.projectY(tile.lines[p * 2 + 1]);
      const len = (x2 - x1) ** 2 + (y2 - y1) ** 2;
      if (len > bestLen) {
        bestLen = len;
        best = Math.atan2(y2 - y1, x2 - x1);
      }
    }
    // keep text readable: never upside down
    if (best > Math.PI / 2) best -= Math.PI;
    if (best < -Math.PI / 2) best += Math.PI;
    return best;
  }
}

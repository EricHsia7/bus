import RBush, { type BBox } from 'rbush';
import { Camera } from '../../tools/camera';
import { TileKey } from './tiles';

export type TextPlacement = 'point' | 'line';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

/** A resolved, render-ready text style (one per distinct symbolizer per tile). */
export interface LabelStyle {
  /** CSS font shorthand *without* the size, e.g. `italic 700` -> `italic 700 13px "Noto Sans"` */
  fontPrefix: string;
  fontFamily: string;
  size: number;
  fill: string;
  haloFill: string | null;
  haloRadius: number;
  placement: TextPlacement;
  dy: number;
  wrapWidth: number;
  letterSpacing: number;
}

/**
 * Labels for one tile, packed into transferable buffers by the worker.
 * All per-label arrays are indexed 0..count-1.
 */
export interface PackedLabelTile {
  key: TileKey;
  z: number;
  x: number;
  y: number;
  count: number;
  /** 2 * count mercator-unit coordinates (anchor point of each label) */
  anchors: Float32Array;
  /** sort key, ascending = drawn/placed first */
  priority: Float32Array;
  /** index into `styles` */
  styleIdx: Uint16Array;
  /** upright text angle in radians, precomputed server-side (0 for point/area labels) */
  angles: Float32Array;
  /** count + 1 byte offsets into `text` */
  textStart: Uint32Array;
  /** UTF-8 label text, concatenated */
  text: Uint8Array;
  styles: LabelStyle[];
}

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
  mercatorX: number;
  mercatorY: number;
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
  private fadeDuration: number;
  private padding: number;
  private viewportPadding: number;
  private maxLabels: number;

  /** true while any label is mid-fade (host keeps rendering) */
  animating = false;
  enabled = true;
  lastPlaced = 0;
  lastCandidates = 0;

  constructor(options: LabelEngineOptions = {}) {
    this.fadeDuration = options.fadeDuration ?? 160;
    this.padding = options.padding ?? 2;
    this.viewportPadding = options.viewportPadding ?? 48;
    this.maxLabels = options.maxLabels ?? 2000;
  }

  reset(): void {
    this.states.clear();
    this.tree.clear();
  }

  /** decode a label's UTF-8 slice once per tile */
  private getText(tile: PackedLabelTile, index: number): string {
    let cache = this.textCache.get(tile);
    if (!cache) {
      cache = new Array(tile.count);
      this.textCache.set(tile, cache);
    }
    const cached = cache[index];
    if (cached !== undefined) return cached;
    const text = decoder.decode(tile.text.subarray(tile.textStart[index], tile.textStart[index + 1]));
    cache[index] = text;
    return text;
  }

  private measure(context: CanvasRenderingContext2D, font: string, text: string): number {
    const key = `${font}\u0000${text}`;
    const cached = this.measureCache.get(key);
    if (cached !== undefined) return cached;
    const width = context.measureText(text).width;
    if (this.measureCache.size > 20000) this.measureCache.clear();
    this.measureCache.set(key, width);
    return width;
  }

  /** greedy wrap; CJK breaks per character, latin on spaces */
  private wrap(context: CanvasRenderingContext2D, font: string, text: string, wrapWidth: number): { lines: string[]; width: number } {
    const singleLineWidth = this.measure(context, font, text);
    if (!wrapWidth || singleLineWidth <= wrapWidth || text.length < 2) {
      return { lines: [text], width: singleLineWidth };
    }
    const tokens: string[] = [];
    let buffer = '';
    for (const character of text) {
      if (character === ' ' || character === '\n') {
        if (buffer) tokens.push(buffer);
        buffer = '';
      } else if (CJK.test(character)) {
        if (buffer) tokens.push(buffer);
        buffer = '';
        tokens.push(character);
      } else {
        buffer += character;
      }
    }
    if (buffer) tokens.push(buffer);

    const lines: string[] = [];
    let line = '';
    let width = 0;
    for (const token of tokens) {
      const joiner = line && !CJK.test(token) && !CJK.test(line.slice(-1)) ? ' ' : '';
      const candidateLine = line + joiner + token;
      const candidateWidth = this.measure(context, font, candidateLine);
      if (line && candidateWidth > wrapWidth) {
        lines.push(line);
        width = Math.max(width, this.measure(context, font, line));
        line = token;
      } else {
        line = candidateLine;
      }
    }
    if (line) {
      lines.push(line);
      width = Math.max(width, this.measure(context, font, line));
    }
    return { lines, width };
  }

  /** build the CSS font shorthand for a style (prefix + size + family) */
  static fontOf(style: LabelStyle): string {
    return `${style.fontPrefix} ${style.size}px ${style.fontFamily}`;
  }

  /**
   * Place labels for this frame.
   * @param deltaTime milliseconds since the previous call (drives the fades)
   */
  update(context: CanvasRenderingContext2D, camera: Camera, tiles: PackedLabelTile[], deltaTime: number, frame: number): PlacedLabel[] {
    const step = this.fadeDuration > 0 ? Math.min(16, deltaTime / this.fadeDuration) : 16;
    for (const state of this.states.values()) state.target = 0;

    if (this.enabled) this.place(context, camera, tiles, frame);

    /* ---- advance fades and emit the draw list ---- */
    const placedLabels: PlacedLabel[] = [];
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
      placedLabels.push({
        id,
        lines: state.lines,
        x: camera.projectX(state.mercatorX),
        y: camera.projectY(state.mercatorY) + state.style.dy,
        width: state.width,
        height: state.height,
        lineHeight: state.lineHeight,
        angle: state.angle,
        opacity: state.opacity,
        style: state.style
      });
    }
    this.lastPlaced = placedLabels.length;
    return placedLabels;
  }

  private place(context: CanvasRenderingContext2D, camera: Camera, tiles: PackedLabelTile[], frame: number): void {
    const pad = this.viewportPadding;
    const minX = -pad;
    const minY = -pad;
    const maxX = camera.width + pad;
    const maxY = camera.height + pad;

    /* gather + dedupe candidates ---- */
    interface Candidate {
      id: string;
      tile: PackedLabelTile;
      index: number;
      screenX: number;
      screenY: number;
      priority: number;
      wasVisible: number;
    }
    const seen = new Set<string>();
    const candidates: Candidate[] = [];

    for (const tile of tiles) {
      for (let index = 0; index < tile.count; index++) {
        const mercatorX = tile.anchors[index * 2];
        const mercatorY = tile.anchors[index * 2 + 1];
        const screenX = camera.projectX(mercatorX);
        if (screenX < minX || screenX > maxX) continue;
        const screenY = camera.projectY(mercatorY);
        if (screenY < minY || screenY > maxY) continue;

        const text = this.getText(tile, index);
        // same feature can appear in neighbouring tiles: identity = text + position
        const id = `${text}@${Math.round(mercatorX * 256)},${Math.round(mercatorY * 256)}`;
        if (seen.has(id)) continue;
        seen.add(id);
        const state = this.states.get(id);
        candidates.push({
          id,
          tile,
          index,
          screenX,
          screenY,
          priority: tile.priority[index],
          wasVisible: state && state.opacity > 0 ? 0 : 1
        });
      }
    }
    this.lastCandidates = candidates.length;

    // priority sort (sticky: visible labels keep their slot)
    candidates.sort((first, second) => first.wasVisible - second.wasVisible || first.priority - second.priority);

    // collision-test in priority order
    this.tree.clear();
    let placed = 0;
    for (const candidate of candidates) {
      const style = candidate.tile.styles[candidate.tile.styleIdx[candidate.index]];
      const font = LabelEngine.fontOf(style);
      context.font = font;
      const text = this.getText(candidate.tile, candidate.index);
      const { lines, width } = this.wrap(context, font, text, style.wrapWidth);
      const lineHeight = Math.round(style.size * 1.2);
      const height = lineHeight * lines.length;

      // angle is precomputed server-side and packed per label (0 for point/area labels)
      const angle = candidate.tile.angles[candidate.index];

      const centerY = candidate.screenY + style.dy;
      // axis-aligned box; for rotated labels use the rotated extent
      const cos = Math.abs(Math.cos(angle));
      const sin = Math.abs(Math.sin(angle));
      const halfWidth = (width * cos + height * sin) / 2 + this.padding;
      const halfHeight = (width * sin + height * cos) / 2 + this.padding;
      const box: Box = {
        id: candidate.id,
        minX: candidate.screenX - halfWidth,
        minY: centerY - halfHeight,
        maxX: candidate.screenX + halfWidth,
        maxY: centerY + halfHeight
      };

      const rejected = placed >= this.maxLabels || this.tree.collides(box);
      let state = this.states.get(candidate.id);
      if (!state) {
        state = {
          opacity: 0,
          target: 0,
          mercatorX: candidate.tile.anchors[candidate.index * 2],
          mercatorY: candidate.tile.anchors[candidate.index * 2 + 1],
          lines,
          width,
          height,
          lineHeight,
          angle,
          style,
          seen: frame
        };
        this.states.set(candidate.id, state);
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
}

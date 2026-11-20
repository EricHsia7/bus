import { Box } from '.';
import { clamp } from '../../tools/math';
import { LabelBoundsStride, LabelCollisionStride, LabelFeaturesStride, LabelFlagAlongLine, LabelFlagSeam, LabelFlatZoomScaled, LabelGlyphPlan, LabelKindToCode, LabelPlacementStride, LabelScalesStride } from './label-plan';
import { AtlasGlyph, GlyphManager } from './glyph-manager';
import { RGBA, SdfGlyphDraw, SdfLabelRenderer } from './sdf-label-renderer';
export interface LabelTileView {
  plan: LabelGlyphPlan;
  screenBBox: Box;
  /** Optional non-overlapping CSS-pixel coverage boxes for stand-ins. */ clipBoxes?: Box[];
}
export interface DrawLabelTilesOptions {
  zoom: number;
  width: number;
  height: number;
  devicePixelRatio: number;
}
const intersects = (a: Box, b: Box) => !(a.maxX <= b.minX || a.minX >= b.maxX || a.maxY <= b.minY || a.minY >= b.maxY);
class Seams {
  private cells = new Map<string, Box[]>();
  constructor(
    private w: number,
    private h: number
  ) {}
  private keys(b: Box): string[] {
    const keys: string[] = [];
    for (let y = clamp(Math.floor(b.minY / 64), 0, Math.max(0, Math.ceil(this.h / 64) - 1)); y <= clamp(Math.floor(b.maxY / 64), 0, Math.max(0, Math.ceil(this.h / 64) - 1)); y++) for (let x = clamp(Math.floor(b.minX / 64), 0, Math.max(0, Math.ceil(this.w / 64) - 1)); x <= clamp(Math.floor(b.maxX / 64), 0, Math.max(0, Math.ceil(this.w / 64) - 1)); x++) keys.push(x + ':' + y);
    return keys;
  }
  collides(b: Box): boolean {
    return this.keys(b).some((k) => !!this.cells.get(k)?.some((a) => intersects(a, b)));
  }
  insert(b: Box): void {
    for (const k of this.keys(b)) {
      const a = this.cells.get(k) || [];
      a.push(b);
      this.cells.set(k, a);
    }
  }
}
export function resolveLabelScale(flags: number, tileZoom: number, viewZoom: number, s0: number, s1: number): number {
  if (flags & LabelFlagAlongLine) return s0;
  if (!(flags & LabelFlatZoomScaled)) return s0;
  const t = clamp(viewZoom - tileZoom, 0, 1);
  return (s0 + (s1 - s0) * t) * Math.pow(2, -t);
}
function shader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw Error('shader allocation');
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}
class CircleRenderer {
  private p: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private buffer: WebGLBuffer;
  constructor(private gl: WebGL2RenderingContext) {
    const vs = shader(gl, gl.VERTEX_SHADER, `#version 300 es\nprecision highp float;layout(location=0) in vec2 p;layout(location=1) in vec2 uv;uniform vec2 viewport;out vec2 t;void main(){t=uv;gl_Position=vec4(p.x/viewport.x*2.-1.,1.-p.y/viewport.y*2.,0.,1.);}`),
      fs = shader(gl, gl.FRAGMENT_SHADER, `#version 300 es\nprecision highp float;in vec2 t;out vec4 color;uniform vec4 fill;uniform vec4 stroke;uniform float inner;void main(){float d=length(t*2.-1.);float aa=max(fwidth(d),.001);float outer=1.-smoothstep(1.-aa,1.+aa,d);float inside=1.-smoothstep(inner-aa,inner+aa,d);float fa=fill.a*inside;float sa=stroke.a*max(outer-inside,0.)*(1.-fa);color=vec4(fill.rgb*fa+stroke.rgb*sa,fa+sa);}`);
    const p = gl.createProgram(),
      vao = gl.createVertexArray(),
      buffer = gl.createBuffer();
    if (!p || !vao || !buffer) throw Error('WebGL allocation');
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(p) || 'link');
    this.p = p;
    this.vao = vao;
    this.buffer = buffer;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindVertexArray(null);
  }
  draw(circles: Array<{ x: number; y: number; radius: number; line: number; fill: RGBA; stroke: RGBA }>, width: number, height: number): void {
    if (!circles.length) return;
    const gl = this.gl;
    gl.useProgram(this.p);
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(gl.getUniformLocation(this.p, 'viewport'), width, height);
    for (const c of circles) {
      const r = c.radius + c.line / 2;
      if (!(r > 0)) continue;
      const x = c.x - r,
        y = c.y - r,
        w = 2 * r;
      gl.uniform4fv(gl.getUniformLocation(this.p, 'fill'), c.fill);
      gl.uniform4fv(gl.getUniformLocation(this.p, 'stroke'), c.stroke);
      gl.uniform1f(gl.getUniformLocation(this.p, 'inner'), c.line ? Math.max(0, (c.radius - c.line / 2) / r) : 1);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([x, y, 0, 0, x, y + w, 0, 1, x + w, y, 1, 0, x + w, y, 1, 0, x, y + w, 0, 1, x + w, y + w, 1, 1]), gl.STREAM_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
  dispose(): void {
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteProgram(this.p);
  }
}
/** New SDF label pass. Prepare plans asynchronously before rendering. Coordinates are CSS px;
 * caller owns framebuffer and device-pixel viewport. This pass overwrites GL state. */
export class LabelRenderer {
  private sdf: SdfLabelRenderer;
  private circles: CircleRenderer;
  private ready = new WeakMap<LabelGlyphPlan, Map<number, AtlasGlyph>>();
  private pending = new WeakMap<LabelGlyphPlan, Promise<void>>();
  private epochs = new WeakMap<LabelGlyphPlan, number>();
  private colorCache = new Map<string, RGBA>();
  private colorCtx: OffscreenCanvasRenderingContext2D;
  private disposed = false;
  constructor(private manager: GlyphManager) {
    this.sdf = new SdfLabelRenderer(manager);
    this.circles = new CircleRenderer(manager.gl);
    const c = new OffscreenCanvas(1, 1).getContext('2d', { willReadFrequently: true });
    if (!c) throw Error('Cannot parse CSS colors');
    this.colorCtx = c;
  }
  private color(value: string | undefined, defaultValue: string): RGBA {
    const v = value || defaultValue,
      cached = this.colorCache.get(v);
    if (cached) return cached;
    const c = this.colorCtx;
    c.clearRect(0, 0, 1, 1);
    c.fillStyle = '#000';
    c.fillStyle = v;
    c.fillRect(0, 0, 1, 1);
    const p = c.getImageData(0, 0, 1, 1).data;
    const out: RGBA = [p[0] / 255, p[1] / 255, p[2] / 255, p[3] / 255];
    this.colorCache.set(v, out);
    return out;
  }
  /** Atlas entries are valid until manager.clear/dispose/context loss. Reject missing/stale faces. */
  async prepare(plan: LabelGlyphPlan): Promise<void> {
    if (this.disposed) throw Error('Label renderer disposed');
    if (plan.glyphIds.length && plan.faceId !== this.manager.index.faceId) throw Error('Planner/atlas font identity mismatch');
    if (this.ready.has(plan)) return;
    const existing = this.pending.get(plan);
    if (existing) return existing;
    const epoch = this.epochs.get(plan) ?? 0;
    const task = (async () => {
      const entries = new Map<number, AtlasGlyph>();
      // haloWidth/fontSize is zoom-invariant: both are multiplied by the same
      // design-to-screen scale. Reserve two atlas pixels for filtering at the edge.
      const ranges = new Map<number, number>();
      for (let i = 0; i < plan.features.length / LabelFeaturesStride; i++) {
        const f = i * LabelFeaturesStride;
        if (plan.features[f] !== LabelKindToCode.text) continue;
        const style = plan.textStyles[plan.features[f + 1]],
          size = style?.['text-size'];
        if (!size || size <= 0) continue;
        const raw = style['text-halo-fill'] ? (style['text-halo-radius'] ?? 0) : 0;
        const halo = Number.isFinite(raw) ? Math.max(0, raw) / 2 : 0;
        const required = (this.manager.emPixels * halo) / size + 2;
        for (let j = plan.features[f + 2]; j < plan.features[f + 2] + plan.features[f + 3]; j++) {
          const gid = plan.glyphIds[j];
          ranges.set(gid, Math.max(ranges.get(gid) ?? this.manager.range, required));
        }
      }
      for (const glyph of plan.glyphData) entries.set(glyph.id, this.manager.get(glyph, ranges.get(glyph.id) ?? this.manager.range));
      for (const id of plan.glyphIds) if (!entries.has(id)) throw Error(`Missing glyph data for ${id}`);
      if (this.disposed || (this.epochs.get(plan) ?? 0) !== epoch) throw Error('Plan released while preparing');
      this.ready.set(plan, entries);
    })();
    this.pending.set(plan, task);
    try {
      await task;
    } finally {
      if (this.pending.get(plan) === task) this.pending.delete(plan);
    }
  }
  isPrepared(plan: LabelGlyphPlan): boolean {
    return this.ready.has(plan);
  }
  release(plan: LabelGlyphPlan): void {
    this.ready.delete(plan);
    this.epochs.set(plan, (this.epochs.get(plan) ?? 0) + 1);
    this.pending.delete(plan);
  }
  /** Render only fully prepared plans; unprepared ones are skipped without claiming collisions. */
  draw(tiles: LabelTileView[], options: DrawLabelTilesOptions): void {
    if (this.disposed || options.width <= 0 || options.height <= 0) return;
    try {
      const seen = new Set<number>(),
        seams = new Seams(options.width, options.height);
      for (const { plan, screenBBox: b, clipBoxes } of tiles) {
        const entries = this.ready.get(plan);
        if (!entries) continue;
        const tw = b.maxX - b.minX;
        if (tw <= 0 || b.maxY <= b.minY) continue;
        const ep = tw / plan.extent,
          dp = tw / plan.designSize,
          draws: SdfGlyphDraw[] = [],
          circles: Array<{ x: number; y: number; radius: number; line: number; fill: RGBA; stroke: RGBA }> = [];
        for (let i = 0; i < plan.features.length / LabelFeaturesStride; i++) {
          const fo = i * LabelFeaturesStride,
            flags = plan.features[fo + 5],
            hash = plan.features[fo + 4];
          if (hash && seen.has(hash)) continue;
          const co = i * LabelCollisionStride,
            box = { minX: b.minX + plan.collisions[co] * ep, minY: b.minY + plan.collisions[co + 1] * ep, maxX: b.minX + plan.collisions[co + 2] * ep, maxY: b.minY + plan.collisions[co + 3] * ep };
          if (box.maxX < 0 || box.maxY < 0 || box.minX > options.width || box.minY > options.height) continue;
          const pieces = clipBoxes ? clipBoxes.map((c) => ({ minX: Math.max(box.minX, c.minX), minY: Math.max(box.minY, c.minY), maxX: Math.min(box.maxX, c.maxX), maxY: Math.min(box.maxY, c.maxY) })).filter((c) => c.minX < c.maxX && c.minY < c.maxY && c.maxX > 0 && c.maxY > 0 && c.minX < options.width && c.minY < options.height) : [box];
          if (!pieces.length) continue;
          const so = i * LabelScalesStride,
            scale = resolveLabelScale(flags, plan.zoom, options.zoom, plan.scales[so], plan.scales[so + 1]);
          if (scale <= 0 || (((flags & LabelFlagSeam) !== 0 || !!clipBoxes) && pieces.some((c) => seams.collides(c)))) continue;
          for (const piece of pieces) seams.insert(piece);
          if (hash) seen.add(hash);
          const styleId = plan.features[fo + 1];
          if (plan.features[fo] === LabelKindToCode.circle) {
            const st = plan.circleStyles[styleId],
              bo = i * LabelBoundsStride;
            if (!st?.['marker-width']) continue;
            circles.push({ x: b.minX + plan.bounds[bo] * ep, y: b.minY + plan.bounds[bo + 1] * ep, radius: (st['marker-width'] * dp * scale) / 2, line: st['marker-line-color'] ? Math.max(1, dp) : 0, fill: this.color(st['marker-fill'], 'transparent'), stroke: this.color(st['marker-line-color'], 'transparent') });
            continue;
          }
          const style = plan.textStyles[styleId];
          if (!style || !style['text-size']) continue;
          const dy = plan.bounds[i * LabelBoundsStride + 6] * dp,
            unit = scale * dp,
            fill = this.color(style['text-fill'], '#000'),
            halo = this.color(style['text-halo-fill'], 'transparent'),
            haloWidth = style['text-halo-fill'] ? (Math.max(0, style['text-halo-radius'] ?? 0) * unit) / 2 : 0;
          for (let j = plan.features[fo + 2]; j < plan.features[fo + 2] + plan.features[fo + 3]; j++) {
            const q = j * LabelPlacementStride,
              entry = entries.get(plan.glyphIds[j]);
            if (!entry) throw Error('Prepared atlas entry missing');
            const angle = plan.placements[q + 4],
              c = Math.cos(angle),
              s = Math.sin(angle),
              ox = plan.placements[q + 2] * unit,
              oy = plan.placements[q + 3] * unit;
            draws.push({ entry, x: b.minX + plan.placements[q] * ep + ox * c - oy * s, y: b.minY + plan.placements[q + 1] * ep + dy + ox * s + oy * c, fontSize: style['text-size'] * unit, angle, fill, halo, haloWidth });
          }
        }
        const gl = this.manager.gl;
        const paint = () => {
          this.sdf.draw(draws, options.width, options.height);
          this.circles.draw(circles, options.width, options.height);
        };
        if (!clipBoxes) {
          gl.disable(gl.SCISSOR_TEST);
          paint();
        } else {
          gl.enable(gl.SCISSOR_TEST);
          const sx = gl.drawingBufferWidth / options.width,
            sy = gl.drawingBufferHeight / options.height;
          for (const c of clipBoxes) {
            const x0 = Math.max(0, Math.round(c.minX * sx)),
              x1 = Math.min(gl.drawingBufferWidth, Math.round(c.maxX * sx)),
              top = Math.max(0, Math.round(c.minY * sy)),
              bottom = Math.min(gl.drawingBufferHeight, Math.round(c.maxY * sy));
            if (x1 > x0 && bottom > top) {
              gl.scissor(x0, gl.drawingBufferHeight - bottom, x1 - x0, bottom - top);
              paint();
            }
          }
        }
      }
    } finally {
      const gl = this.manager.gl;
      gl.disable(gl.SCISSOR_TEST);
      gl.bindVertexArray(null);
    }
  }
  dispose(): void {
    this.disposed = true;
    this.ready = new WeakMap();
    this.pending = new WeakMap();
    this.sdf.dispose();
    this.circles.dispose();
  }
}

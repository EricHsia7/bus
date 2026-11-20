import { Glyph } from './glyph-types';
export interface RasterizedGlyph {
  pixels: Uint8Array;
  width: number;
  height: number;
  left: number;
  top: number;
  emPixels: number;
  range: number;
}
type Pt = [number, number];
type Edge = [number, number, number, number];
const midpoint = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
function deviation(p: Pt, a: Pt, b: Pt): number {
  const x = b[0] - a[0],
    y = b[1] - a[1],
    d = x * x + y * y;
  const t = d ? Math.max(0, Math.min(1, ((p[0] - a[0]) * x + (p[1] - a[1]) * y) / d)) : 0;
  return Math.hypot(p[0] - a[0] - t * x, p[1] - a[1] - t * y);
}
/** Adaptive curve flattening: tolerance is in output pixels. Degenerate contours are harmless. */
function flatten(glyph: Glyph, scale: number, tolerance: number): Edge[] {
  const out: Edge[] = [];
  let p: Pt = [0, 0],
    start: Pt = [0, 0],
    open = false;
  const point = (x: number, y: number): Pt => [x * scale, y * scale];
  const line = (b: Pt) => {
    if (p[0] !== b[0] || p[1] !== b[1]) out.push([p[0], p[1], b[0], b[1]]);
    p = b;
  };
  const q = (a: Pt, b: Pt, c: Pt, depth: number): void => {
    if (depth >= 20 || deviation(b, a, c) <= tolerance) {
      line(c);
      return;
    }
    const ab = midpoint(a, b),
      bc = midpoint(b, c),
      m = midpoint(ab, bc);
    q(a, ab, m, depth + 1);
    q(m, bc, c, depth + 1);
  };
  const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, depth: number): void => {
    if (depth >= 20 || Math.max(deviation(b, a, d), deviation(c, a, d)) <= tolerance) {
      line(d);
      return;
    }
    const ab = midpoint(a, b),
      bc = midpoint(b, c),
      cd = midpoint(c, d),
      abc = midpoint(ab, bc),
      bcd = midpoint(bc, cd),
      m = midpoint(abc, bcd);
    cubic(a, ab, abc, m, depth + 1);
    cubic(m, bcd, cd, d, depth + 1);
  };
  for (const c of glyph.commands) {
    switch (c[0]) {
      case 'M':
        if (open) line(start);
        p = point(c[1], c[2]);
        start = p;
        open = true;
        break;
      case 'L':
        line(point(c[1], c[2]));
        break;
      case 'Q':
        q(p, point(c[1], c[2]), point(c[3], c[4]), 0);
        break;
      case 'C':
        cubic(p, point(c[1], c[2]), point(c[3], c[4]), point(c[5], c[6]), 0);
        break;
      case 'Z':
        if (open) line(start);
        open = false;
        break;
    }
  }
  if (open) line(start);
  return out;
}
function shader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw Error('createShader');
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}
/** GPU brute-force exact distance to adaptively flattened segments, nonzero winding.
 * R8 quantization and flattening bound precision; this is not analytic Bézier/MSDF.
 * Standalone WebGL2 context. Pixels are copied to the destination context; WebGL textures are not shareable. */
export class GlyphRasterizer {
  readonly canvas: OffscreenCanvas;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private edgeTexture: WebGLTexture;
  constructor() {
    this.canvas = new OffscreenCanvas(1, 1);
    const gl = this.canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
    if (!gl) throw Error('Offscreen WebGL2 unavailable');
    this.gl = gl;
    const vs = shader(gl, gl.VERTEX_SHADER, `#version 300 es\nconst vec2 p[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));void main(){gl_Position=vec4(p[gl_VertexID],0.,1.);}`);
    const fs = shader(gl, gl.FRAGMENT_SHADER, `#version 300 es\nprecision highp float;precision highp int;uniform sampler2D edges;uniform int count;uniform int texWidth;uniform vec2 origin;uniform float distRange;out vec4 color;void main(){vec2 p=origin+gl_FragCoord.xy;float md=distRange;int wind=0;for(int i=0;i<count;i++){vec4 e=texelFetch(edges,ivec2(i%texWidth,i/texWidth),0);vec2 a=e.xy,b=e.zw,v=b-a;float t=clamp(dot(p-a,v)/max(dot(v,v),1e-20),0.,1.);md=min(md,length(p-(a+t*v)));float side=(b.x-a.x)*(p.y-a.y)-(p.x-a.x)*(b.y-a.y);if(a.y<=p.y && b.y>p.y && side>0.)wind++;else if(a.y>p.y && b.y<=p.y && side<0.)wind--;}float signedD=wind!=0?md:-md;color=vec4(clamp(.5+signedD/(2.*distRange),0.,1.),0.,0.,1.);}`);
    const program = gl.createProgram(),
      vao = gl.createVertexArray(),
      tex = gl.createTexture();
    if (!program || !vao || !tex) throw Error('WebGL allocation failed');
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program) || 'link');
    this.program = program;
    this.vao = vao;
    this.edgeTexture = tex;
  }
  rasterize(g: Glyph, upem: number, emPixels = 48, range = 8, tolerance = 0.08): RasterizedGlyph | null {
    if (!(upem > 0 && emPixels > 0 && range >= 1 && tolerance > 0)) throw Error('Invalid raster parameters');
    if (!g.bbox || !g.commands.length) return null;
    const scale = emPixels / upem,
      edges = flatten(g, scale, tolerance);
    if (!edges.length) return null;
    const [x0, y0, x1, y1] = g.bbox;
    const left = Math.floor(x0 * scale - range - 1),
      bottom = Math.floor(y0 * scale - range - 1),
      right = Math.ceil(x1 * scale + range + 1),
      top = Math.ceil(y1 * scale + range + 1),
      width = right - left,
      height = top - bottom;
    const gl = this.gl,
      max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (width > max || height > max) throw Error('Glyph exceeds MAX_TEXTURE_SIZE');
    const tw = Math.min(max, edges.length),
      th = Math.ceil(edges.length / tw);
    if (th > max) throw Error('Too many edges');
    this.canvas.width = width;
    this.canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.disable(gl.BLEND);
    gl.disable(gl.SCISSOR_TEST);
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.edgeTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const data = new Float32Array(tw * th * 4);
    for (let i = 0; i < edges.length; i++) data.set(edges[i], i * 4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, tw, th, 0, gl.RGBA, gl.FLOAT, data);
    gl.uniform1i(gl.getUniformLocation(this.program, 'edges'), 0);
    gl.uniform1i(gl.getUniformLocation(this.program, 'count'), edges.length);
    gl.uniform1i(gl.getUniformLocation(this.program, 'texWidth'), tw);
    gl.uniform2f(gl.getUniformLocation(this.program, 'origin'), left, bottom);
    gl.uniform1f(gl.getUniformLocation(this.program, 'distRange'), range);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const rgba = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    const pixels = new Uint8Array(width * height);
    for (let i = 0; i < pixels.length; i++) pixels[i] = rgba[i * 4];
    return { pixels, width, height, left, top, emPixels, range };
  }
  dispose(): void {
    this.gl.deleteProgram(this.program);
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteTexture(this.edgeTexture);
    this.canvas.width = 1;
    this.canvas.height = 1;
  }
}

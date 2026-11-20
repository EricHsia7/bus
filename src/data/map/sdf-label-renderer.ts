import { AtlasGlyph, GlyphManager } from './glyph-manager';
export type RGBA = [number, number, number, number];
/** Screen coordinates, fontSize and halo in CSS px; baseline is alphabetic.
 * Rotation is clockwise in screen space, about the supplied baseline. */
export interface SdfGlyphDraw {
  entry: AtlasGlyph;
  x: number;
  y: number;
  fontSize: number;
  angle?: number;
  fill: RGBA;
  halo: RGBA;
  haloWidth: number;
}
function shader(gl: WebGL2RenderingContext, t: number, s: string): WebGLShader {
  const x = gl.createShader(t);
  if (!x) throw Error('shader allocation');
  gl.shaderSource(x, s);
  gl.compileShader(x);
  if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(x) || 'shader error');
  return x;
}
/** Draws prepared glyph quads onto the manager's rendering context, without owning the framebuffer.
 * Caller must set desired framebuffer, viewport and any clipping. This pass overwrites GL state. */
export class SdfLabelRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private buffer: WebGLBuffer;
  private warnedHaloClipped = false;
  constructor(private manager: GlyphManager) {
    const gl = (this.gl = manager.gl);
    const vs = shader(gl, gl.VERTEX_SHADER, `#version 300 es\nprecision highp float;layout(location=0) in vec2 pos;layout(location=1) in vec2 uv;uniform vec2 viewport;out vec2 tex;void main(){tex=uv;gl_Position=vec4(pos.x/viewport.x*2.-1.,1.-pos.y/viewport.y*2.,0.,1.);}`);
    const fs = shader(gl, gl.FRAGMENT_SHADER, `#version 300 es\nprecision highp float;uniform sampler2D atlas;uniform vec4 fill;uniform vec4 halo;uniform float threshold;in vec2 tex;out vec4 color;void main(){float d=texture(atlas,tex).r;float aa=max(fwidth(d),0.0001);float f=smoothstep(.5-aa,.5+aa,d);float h=smoothstep(threshold-aa,threshold+aa,d);float fa=fill.a*f,ha=halo.a*h*(1.-fa);float a=fa+ha;color=vec4(fill.rgb*fa+halo.rgb*ha,a);}`);
    const pr = gl.createProgram(),
      vao = gl.createVertexArray(),
      buf = gl.createBuffer();
    if (!pr || !vao || !buf) throw Error('WebGL allocation');
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(pr) || 'link error');
    this.program = pr;
    this.vao = vao;
    this.buffer = buf;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
    gl.bindVertexArray(null);
  }
  draw(items: SdfGlyphDraw[], width: number, height: number): void {
    const gl = this.gl;
    if (width <= 0 || height <= 0) return;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(gl.getUniformLocation(this.program, 'viewport'), width, height);
    gl.uniform1i(gl.getUniformLocation(this.program, 'atlas'), 0);
    gl.activeTexture(gl.TEXTURE0);
    for (const item of items) {
      const e = item.entry,
        r = e.raster;
      if (!r || item.fontSize <= 0) continue;
      const s = item.fontSize / r.emPixels;
      const requestedHalo = Number.isFinite(item.haloWidth) ? Math.max(0, item.haloWidth) : 0;
      const halo = Math.min(requestedHalo, Math.max(0, r.range - 1) * s);
      if (halo < requestedHalo && !this.warnedHaloClipped) {
        this.warnedHaloClipped = true;
        console.warn('[labels] Halo exceeds the maximum atlas SDF range; rendering a narrower halo. Increase GlyphManager maxRange if needed.');
      }
      const x0 = r.left * s,
        y0 = -r.top * s,
        x1 = x0 + r.width * s,
        y1 = y0 + r.height * s;
      const a = item.angle || 0,
        c = Math.cos(a),
        sn = Math.sin(a);
      const xy = (x: number, y: number, u: number, v: number) => [item.x + x * c - y * sn, item.y + x * sn + y * c, u, v];
      // readPixels and the atlas both use bottom-left row order: screen top maps to v1.
      const tl = xy(x0, y0, e.u0, e.v1),
        tr = xy(x1, y0, e.u1, e.v1),
        bl = xy(x0, y1, e.u0, e.v0),
        br = xy(x1, y1, e.u1, e.v0);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...tl, ...bl, ...tr, ...tr, ...bl, ...br]), gl.STREAM_DRAW);
      gl.bindTexture(gl.TEXTURE_2D, this.manager.texture(e.page));
      gl.uniform4fv(gl.getUniformLocation(this.program, 'fill'), item.fill);
      gl.uniform4fv(gl.getUniformLocation(this.program, 'halo'), item.halo);
      gl.uniform1f(gl.getUniformLocation(this.program, 'threshold'), 0.5 - halo / (s * 2 * r.range));
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
  dispose(): void {
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteVertexArray(this.vao);
    this.gl.deleteProgram(this.program);
  }
}

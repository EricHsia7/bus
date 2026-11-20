import { Glyph, GlyphFontInfo } from './glyph-types';
import { GlyphRasterizer, RasterizedGlyph } from './glyph-rasterizer';
export interface AtlasGlyph {
  glyph: Glyph;
  page: number;
  u0: number;
  v0: number;
  u1: number;
  v1: number;
  raster: Omit<RasterizedGlyph, 'pixels'> | null;
}
interface Page {
  texture: WebGLTexture;
  x: number;
  y: number;
  row: number;
}
/** GPU-only atlas; all .gz downloads and outline decoding happen in the worker. */
export class GlyphManager {
  readonly size: number;
  readonly emPixels: number;
  readonly range: number;
  readonly maxRange: number;
  private maxPages: number;
  private rasterizer: GlyphRasterizer;
  private pages: Page[] = [];
  private entries = new Map<string, AtlasGlyph>();
  private disposed = false;
  constructor(
    readonly gl: WebGL2RenderingContext,
    readonly index: GlyphFontInfo,
    options: { size?: number; emPixels?: number; range?: number; maxRange?: number; maxPages?: number } = {}
  ) {
    if (!index.faceId || !(index.unitsPerEm > 0) || !(index.glyphCount > 0)) throw Error('Invalid worker font initialization');
    this.size = options.size ?? 1024;
    this.emPixels = options.emPixels ?? 48;
    this.range = options.range ?? 8;
    this.maxRange = options.maxRange ?? 64;
    this.maxPages = options.maxPages ?? 8;
    if (!Number.isInteger(this.size) || this.size < 32 || this.size > gl.getParameter(gl.MAX_TEXTURE_SIZE) || this.maxPages < 1 || !Number.isInteger(this.range) || this.range < 1 || !Number.isInteger(this.maxRange) || this.maxRange < this.range || !(this.emPixels > 0)) throw Error('Invalid atlas configuration');
    this.rasterizer = new GlyphRasterizer();
  }
  texture(page: number): WebGLTexture {
    if (!this.pages[page]) throw Error('Invalid atlas page');
    return this.pages[page].texture;
  }
  /** Glyph is supplied by the worker, with face identity checked by LabelRenderer. */
  /** requestedRange is in atlas pixels, including antialiasing safety margin.
   * Four-pixel buckets bound the number of variants for one glyph. */
  get(glyph: Glyph, requestedRange: number = this.range): AtlasGlyph {
    if (this.disposed) throw Error('Glyph manager disposed');
    const gid = glyph.id;
    if (!Number.isInteger(gid) || gid < 0 || gid >= this.index.glyphCount) throw Error('Invalid glyph ID');
    if (!Number.isFinite(requestedRange) || requestedRange < 0) throw Error('Invalid SDF range');
    const range = Math.min(this.maxRange, Math.max(this.range, Math.ceil(requestedRange / 4) * 4));
    const key = `${gid}:${range}`;
    const cached = this.entries.get(key);
    if (cached) return cached;
    const raster = this.rasterizer.rasterize(glyph, this.index.unitsPerEm, this.emPixels, range);
    if (!raster) {
      const entry = { glyph, page: -1, u0: 0, v0: 0, u1: 0, v1: 0, raster: null };
      this.entries.set(key, entry);
      return entry;
    }
    const w = raster.width + 2,
      h = raster.height + 2;
    if (w > this.size || h > this.size) throw Error('Glyph too large for atlas');
    let n = this.pages.length - 1,
      p = this.pages[n];
    if (p && p.x + w > this.size) {
      p.x = 0;
      p.y += p.row;
      p.row = 0;
    }
    if (!p || p.y + h > this.size) {
      if (this.pages.length >= this.maxPages) throw Error('Glyph atlas full');
      p = this.createPage();
      n = this.pages.length - 1;
    }
    const x = p.x + 1,
      y = p.y + 1;
    p.x += w;
    p.row = Math.max(p.row, h);
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, p.texture);
    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
    gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
    gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, x, y, raster.width, raster.height, gl.RED, gl.UNSIGNED_BYTE, raster.pixels);
    const { pixels: _pixels, ...metrics } = raster;
    const entry = { glyph, page: n, u0: x / this.size, v0: y / this.size, u1: (x + raster.width) / this.size, v1: (y + raster.height) / this.size, raster: metrics };
    this.entries.set(key, entry);
    return entry;
  }
  private createPage(): Page {
    const gl = this.gl,
      t = gl.createTexture();
    if (!t) throw Error('Cannot allocate glyph texture');
    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, this.size, this.size, 0, gl.RED, gl.UNSIGNED_BYTE, null);
    const page = { texture: t, x: 0, y: 0, row: 0 };
    this.pages.push(page);
    return page;
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    for (const p of this.pages) this.gl.deleteTexture(p.texture);
    this.pages = [];
    this.entries.clear();
    this.rasterizer.dispose();
  }
}

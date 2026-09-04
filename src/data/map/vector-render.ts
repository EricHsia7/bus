import vertexShaderSource from './vector.vert';
import fragmentShaderSource from './vector.frag';
import { VectorPlan } from './vector-plan';
import { clamp } from '../../tools/math';

export interface VectorTileView {
  /** Stable tile/cache key. */
  key: string;
  plan: VectorPlan;
  /** Top-left of the tile's screen box, in DEVICE pixels. */
  x: number;
  y: number;
  /** Screen size of the tile's box, in DEVICE pixels. */
  size: number;
  /**
   * Optional sub-square of the plan used as a stand-in for this tile, in NORMALIZED plan
   * units: `x` / `y` in `[0, 1)` and `size` in `(0, 1]`. An ancestor `depth` levels
   * coarser has `size = 1 / 2 ** depth`. Never screen pixels.
   */
  region?: { x: number; y: number; size: number } | null;
}

export interface VectorRendererOptions {
  width?: number;
  height?: number;
  /** Called after the GL context is lost. Rendering is a no-op until it is restored. */
  onContextLost?: () => void;
  /**
   * Called after the context is restored and the previously visible tiles have been
   * re-uploaded. Request a repaint from here.
   */
  onContextRestored?: () => void;
}

interface GPUResource {
  extent: number;
  buffer: number;
  zoom: number;
  polygonPosition: WebGLBuffer | null;
  polygonStyle: WebGLBuffer | null;
  polygonVertexCount: number;
  polygonIndex: WebGLBuffer | null;
  polygonIndexCount: number;
  lineVertex: WebGLBuffer | null;
  lineVertexCount: number;
  lineIndex: WebGLBuffer | null;
  lineIndexCount: number;
  circleVertex: WebGLBuffer | null;
  circleVertexCount: number;
  circleIndex: WebGLBuffer | null;
  circleIndexCount: number;
  paletteTexture: WebGLTexture | null;
  styleTexture: WebGLTexture | null;
}

const DESIGN_TILE_SIZE = 256;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create WebGL shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) || 'unknown shader error';
    gl.deleteShader(shader);
    throw new Error(log);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext): WebGLProgram {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  if (!program) throw new Error('Unable to create WebGL program');
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) || 'unknown program link error';
    gl.deleteProgram(program);
    throw new Error(log);
  }
  return program;
}

function createBuffer(gl: WebGL2RenderingContext, target: number, data: ArrayBufferView): WebGLBuffer {
  const buffer = gl.createBuffer();
  if (!buffer) throw new Error('Unable to create WebGL buffer');
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, gl.STATIC_DRAW);
  return buffer;
}

function createPaletteTexture(gl: WebGL2RenderingContext, palette: Uint8Array, width: number): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture || palette.length === 0) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

function createStyleTexture(gl: WebGL2RenderingContext, styleData: Float32Array, width: number): WebGLTexture | null {
  const texture = gl.createTexture();
  if (!texture || styleData.length === 0) return null;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, 1, 0, gl.RGBA, gl.FLOAT, styleData);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

function createGPUResource(gl: WebGL2RenderingContext, plan: VectorPlan): GPUResource {
  return {
    extent: plan.extent,
    buffer: plan.buffer,
    zoom: plan.zoom,
    polygonPosition: plan.polygonVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, plan.polygonPositions) : null,
    polygonStyle: plan.polygonVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, plan.polygonStyles) : null,
    polygonVertexCount: plan.polygonVertexCount,
    polygonIndex: plan.polygonIndexCount ? createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, plan.polygonIndices) : null,
    polygonIndexCount: plan.polygonIndexCount,
    lineVertex: plan.lineVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, plan.lineVertices) : null,
    lineVertexCount: plan.lineVertexCount,
    lineIndex: plan.lineIndexCount ? createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, plan.lineIndices) : null,
    lineIndexCount: plan.lineIndexCount,
    circleVertex: plan.circleVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, plan.circleVertices) : null,
    circleVertexCount: plan.circleVertexCount,
    circleIndex: plan.circleIndexCount ? createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, plan.circleIndices) : null,
    circleIndexCount: plan.circleIndexCount,
    paletteTexture: createPaletteTexture(gl, plan.palette, Math.max(1, plan.paletteCount)),
    styleTexture: createStyleTexture(gl, plan.styleData, plan.styleTextureWidth)
  };
}

function deleteGPUResource(gl: WebGL2RenderingContext, resource: GPUResource): void {
  gl.deleteBuffer(resource.polygonPosition);
  gl.deleteBuffer(resource.polygonStyle);
  gl.deleteBuffer(resource.polygonIndex);
  gl.deleteBuffer(resource.lineVertex);
  gl.deleteBuffer(resource.lineIndex);
  gl.deleteTexture(resource.paletteTexture);
  gl.deleteTexture(resource.styleTexture);
}

export class VectorRenderer {
  readonly canvas: OffscreenCanvas | HTMLCanvasElement;
  gl: WebGL2RenderingContext;

  private program: WebGLProgram;
  private readonly resources = new Map<string, GPUResource>();
  /**
   * The last full set of views handed to `syncVectorTiles`, kept so the GPU cache can be
   * rebuilt after a context loss without waiting for the tiles to be reloaded.
   */
  private lastViews = new Map<string, VectorTileView>();
  private lastViewZoom: number = 0;
  private lastDarkMode: number = 0;
  private contextLost = false;
  private readonly options: VectorRendererOptions;
  private readonly contextLostHandler?: (event: Event) => void;
  private readonly contextRestoredHandler?: () => void;
  public width: number = 1;
  public height: number = 1;

  private uTileScale: WebGLUniformLocation | null = null;
  private uTileOffset: WebGLUniformLocation | null = null;
  private uViewport: WebGLUniformLocation | null = null;
  private uExtent: WebGLUniformLocation | null = null;
  private uDeltaZoom: WebGLUniformLocation | null = null;
  private uDesignTileSize: WebGLUniformLocation | null = null;
  private uIsLine: WebGLUniformLocation | null = null;
  private uIsCircle: WebGLUniformLocation | null = null;
  private uDarkMode: WebGLUniformLocation | null = null;
  private uPalette: WebGLUniformLocation | null = null;
  private uStyleData: WebGLUniformLocation | null = null;

  constructor(canvas: OffscreenCanvas | HTMLCanvasElement, options: VectorRendererOptions = {}) {
    this.canvas = canvas;
    this.options = options;
    this.width = options.width || 1;
    this.height = options.height || 1;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    }) as WebGL2RenderingContext | null;
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl;
    this.program = createProgram(gl);
    this.readUniformLocations();

    // A lost context silently drops every buffer and texture, which reads on screen as
    // tiles that paint once and then vanish. Recover instead of going dark.
    const target = canvas as unknown as {
      addEventListener?: (type: string, listener: (event: Event) => void) => void;
      removeEventListener?: (type: string, listener: (event: Event) => void) => void;
    };
    if (typeof target.addEventListener === 'function') {
      this.contextLostHandler = (event: Event) => {
        event.preventDefault();
        this.handleContextLost();
      };
      this.contextRestoredHandler = () => this.handleContextRestored();
      target.addEventListener('webglcontextlost', this.contextLostHandler);
      target.addEventListener('webglcontextrestored', this.contextRestoredHandler);
    }

    this.handleColorSchemeChange = this.handleColorSchemeChange.bind(this);
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', this.handleColorSchemeChange);
    this.handleColorSchemeChange(colorSchemeQuery);
  }

  /** True while the GL context is unusable. Rendering is skipped rather than half-drawn. */
  get isContextLost(): boolean {
    return this.contextLost || this.gl.isContextLost();
  }

  /** Number of tiles currently resident on the GPU. Useful as a churn assertion in tests. */
  get residentTileCount(): number {
    return this.resources.size;
  }

  hasTile(key: string): boolean {
    return this.resources.has(key);
  }

  /**
   * Synchronizes the GPU cache with the tiles that are currently visible.
   *
   * `visibleTiles` must be the COMPLETE viewport set, not the tiles that just arrived:
   * anything absent from it is released. Pass a single tile through `uploadTile` /
   * `releaseTile` instead when reacting to one loader callback.
   *
   * A tile already uploaded from the same plan is left untouched, so a steady viewport
   * costs nothing and buffers are never destroyed and re-created behind a live frame.
   */
  syncVectorTiles(visibleTiles: Iterable<VectorTileView>): void {
    if (this.isContextLost) {
      // Still record the intent so the cache can be rebuilt on restore.
      this.lastViews = new Map(Array.from(visibleTiles, (tile) => [tile.key, tile] as const));
      return;
    }

    const views = new Map<string, VectorTileView>();
    for (const tile of visibleTiles) {
      views.set(tile.key, tile);
      this.uploadTile(tile);
    }

    for (const key of Array.from(this.resources.keys())) {
      if (!views.has(key)) this.releaseTile(key);
    }

    this.lastViews = views;
  }

  /**
   * Uploads one tile, reusing the existing resource when it came from the same plan.
   * Safe to call from a per-tile loader callback: it never touches other tiles.
   */
  uploadTile(tile: VectorTileView): void {
    if (this.isContextLost) return;
    const existing = this.resources.get(tile.key);
    if (existing) {
      deleteGPUResource(this.gl, existing);
    }
    this.resources.set(tile.key, createGPUResource(this.gl, tile.plan));
    this.lastViews.set(tile.key, tile);
  }

  /**
   * Releases one tile's GPU resources. Wire this to `MapLoaderCacheOptions.onEvict` so a
   * plan dropped by the loader does not leave a stale resource holding a dead plan.
   */
  releaseTile(key: string): boolean {
    const resource = this.resources.get(key);
    if (!resource) return false;
    if (!this.isContextLost) deleteGPUResource(this.gl, resource);
    this.resources.delete(key);
    this.lastViews.delete(key);
    return true;
  }

  /** Render all currently visible vector tiles in one frame. */
  renderVectorTiles(visibleTiles: Iterable<VectorTileView>, viewZoom: number): void {
    if (this.isContextLost) return;

    const gl = this.gl;
    const width = this.width as number;
    const height = this.height as number;

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // Enabled after the clear, which must cover the whole surface.
    gl.enable(gl.SCISSOR_TEST);
    gl.useProgram(this.program);

    gl.uniform2f(this.uViewport, width, height);
    gl.uniform1f(this.uDesignTileSize, DESIGN_TILE_SIZE);
    gl.uniform1f(this.uDarkMode, this.lastDarkMode);

    for (const tile of visibleTiles) {
      const resource = this.resources.get(tile.key);
      // A missing resource means the tile was never uploaded for this frame. Uploading it
      // here keeps a tile from blinking out for one frame after a sync/render race.
      if (!resource) {
        this.uploadTile(tile);
      }
      const plan = resource ?? this.resources.get(tile.key);
      if (!plan) continue;

      // `region` is a NORMALIZED sub-square of the plan: `x` / `y` are fractions of the
      // plan's extent and `size` is the fraction of it that fills the box. It is how a
      // coarser ancestor stands in for a tile that has not arrived yet, so `size` MUST
      // divide the scale: without it the ancestor is drawn at its own native scale, which
      // puts the wrong quadrant far outside the box and reads on screen as a stand-in
      // that never appears.
      const region = tile.region ?? { x: 0, y: 0, size: 1 };
      const regionSize = region.size > 0 ? region.size : 1;
      const scale = tile.size / (plan.extent * regionSize);
      const offsetX = tile.x - region.x * plan.extent * scale;
      const offsetY = tile.y - region.y * plan.extent * scale;
      const deltaZoom = clamp(viewZoom - plan.zoom, 0, 1);
      this.lastViewZoom = viewZoom;

      // Every draw is clipped to its own box. Plans carry `buffer` worth of geometry past
      // the tile edge, and a stand-in covers only a sub-square of a much larger plan, so
      // without a scissor box that surplus lands on top of the neighbour's own copy of
      // the same features. Opaque fills conceal it; anything thin or translucent
      // composites twice and reads as doubled.
      //
      // Both edges are rounded rather than floored and ceiled, so adjacent boxes agree on
      // the integer boundary between them: no seam, and no shared column of pixels that
      // would be painted by both.
      const left = Math.round(tile.x);
      const right = Math.round(tile.x + tile.size);
      // GL's scissor origin is bottom-left, while boxes are measured from the top.
      const bottom = Math.round(height - (tile.y + tile.size));
      const top = Math.round(height - tile.y);
      gl.scissor(left, bottom, Math.max(0, right - left), Math.max(0, top - bottom));

      gl.uniform2f(this.uTileScale, scale, scale);
      gl.uniform2f(this.uTileOffset, offsetX, offsetY);
      gl.uniform1f(this.uExtent, plan.extent);
      gl.uniform1f(this.uDeltaZoom, deltaZoom);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, plan.paletteTexture);
      gl.uniform1i(this.uPalette, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, plan.styleTexture);
      gl.uniform1i(this.uStyleData, 1);

      if (plan.polygonIndexCount && plan.polygonPosition && plan.polygonStyle && plan.polygonIndex) {
        gl.uniform1f(this.uIsLine, 0);
        gl.uniform1f(this.uIsCircle, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, plan.polygonPosition);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.SHORT, false, 0, 0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.disableVertexAttribArray(3);
        gl.bindBuffer(gl.ARRAY_BUFFER, plan.polygonStyle);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.UNSIGNED_SHORT, false, 0, 0);
        gl.disableVertexAttribArray(5);
        gl.disableVertexAttribArray(6);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plan.polygonIndex);
        gl.drawElements(gl.TRIANGLES, plan.polygonIndexCount, gl.UNSIGNED_INT, 0);
      }

      if (plan.lineIndexCount && plan.lineVertex && plan.lineIndex) {
        gl.uniform1f(this.uIsLine, 1);
        gl.uniform1f(this.uIsCircle, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, plan.lineVertex);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.SHORT, false, 18, 0); // 2 * 2 = 4 bytes
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.SHORT, false, 18, 4); // 2 * 2 = 4 bytes
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.SHORT, false, 18, 8); // 2 * 2 = 4 bytes
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 1, gl.SHORT, false, 18, 12); // 2 * 1 = 2 bytes
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.UNSIGNED_SHORT, false, 18, 14); // 2 * 1 = 2 bytes
        gl.enableVertexAttribArray(5);
        gl.vertexAttribPointer(5, 1, gl.SHORT, false, 18, 16); // 2 * 1 = 2 bytes
        gl.disableVertexAttribArray(6);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plan.lineIndex);
        gl.drawElements(gl.TRIANGLES, plan.lineIndexCount, gl.UNSIGNED_INT, 0);
      }

      if (plan.circleIndexCount && plan.circleVertex && plan.circleIndex) {
        gl.uniform1f(this.uIsLine, 0);
        gl.uniform1f(this.uIsCircle, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, plan.circleVertex);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.SHORT, false, 10, 0); // 2 * 2 = 4 bytes
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.disableVertexAttribArray(3);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.UNSIGNED_SHORT, false, 10, 4); // 2 * 1 = 2 bytes
        gl.disableVertexAttribArray(5);
        gl.enableVertexAttribArray(6);
        gl.vertexAttribPointer(6, 2, gl.SHORT, false, 10, 6); // 2 * 2 = 4 bytes
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plan.circleIndex);
        gl.drawElements(gl.TRIANGLES, plan.circleIndexCount, gl.UNSIGNED_INT, 0);
      }
    }

    // Shared context state: the scissor box must not leak into whatever draws next.
    gl.disable(gl.SCISSOR_TEST);
  }

  destroy(): void {
    const target = this.canvas as unknown as {
      removeEventListener?: (type: string, listener: (event: Event) => void) => void;
    };
    if (typeof target.removeEventListener === 'function') {
      if (this.contextLostHandler) target.removeEventListener('webglcontextlost', this.contextLostHandler);
      if (this.contextRestoredHandler) target.removeEventListener('webglcontextrestored', this.contextRestoredHandler);
    }
    if (!this.isContextLost) {
      for (const resource of this.resources.values()) deleteGPUResource(this.gl, resource);
      this.gl.deleteProgram(this.program);
    }
    this.resources.clear();
    this.lastViews.clear();
  }

  private readUniformLocations(): void {
    const gl = this.gl;
    this.uTileScale = gl.getUniformLocation(this.program, 'u_tileScale');
    this.uTileOffset = gl.getUniformLocation(this.program, 'u_tileOffset');
    this.uViewport = gl.getUniformLocation(this.program, 'u_viewport');
    this.uExtent = gl.getUniformLocation(this.program, 'u_extent');
    this.uDeltaZoom = gl.getUniformLocation(this.program, 'u_deltaZoom');
    this.uDesignTileSize = gl.getUniformLocation(this.program, 'u_designTileSize');
    this.uIsLine = gl.getUniformLocation(this.program, 'u_isLine');
    this.uIsCircle = gl.getUniformLocation(this.program, 'u_isCircle');
    this.uDarkMode = gl.getUniformLocation(this.program, 'u_darkMode');
    this.uPalette = gl.getUniformLocation(this.program, 'u_palette');
    this.uStyleData = gl.getUniformLocation(this.program, 'u_styleData');
  }

  private handleContextLost(): void {
    this.contextLost = true;
    // The handles are already dead; drop them without issuing GL calls.
    this.resources.clear();
    this.options.onContextLost?.();
  }

  private handleContextRestored(): void {
    this.contextLost = false;
    this.program = createProgram(this.gl);
    this.readUniformLocations();
    const views = Array.from(this.lastViews.values());
    this.resources.clear();
    for (const view of views) this.uploadTile(view);
    this.options.onContextRestored?.();
  }

  private handleColorSchemeChange(event: MediaQueryListEvent | MediaQueryList): void {
    this.lastDarkMode = event.matches ? 1 : 0;
    const views = Array.from(this.lastViews.values());
    this.renderVectorTiles(views, this.lastViewZoom);
    console.log(12);
  }
}

export function syncVectorTiles(renderer: VectorRenderer, visibleTiles: Iterable<VectorTileView>): void {
  renderer.syncVectorTiles(visibleTiles);
}

export function renderVectorTiles(renderer: VectorRenderer, visibleTiles: Iterable<VectorTileView>, viewZoom: number): void {
  renderer.renderVectorTiles(visibleTiles, viewZoom);
}

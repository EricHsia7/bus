import vertexShaderSource from './vector.vert';
import fragmentShaderSource from './vector.frag';
import { VectorPlan } from './vector-plan';

export interface VectorTileView {
  /** Stable tile/cache key. */
  key: string;
  plan: VectorPlan;
  /** Top-left of the tile's screen box in CSS pixels. */
  x: number;
  y: number;
  /** Screen size of the tile in CSS pixels. */
  size: number;
  /** Optional sub-square of the plan used as a stand-in for this tile. */
  region?: { x: number; y: number; size: number } | null;
}

export interface VectorRendererOptions {
  /**
   * Device pixels per CSS pixel. Tile boxes arrive in CSS pixels while the drawing
   * buffer is sized in device pixels, so the two must be reconciled explicitly.
   * Defaults to `devicePixelRatio` when a window is available, otherwise 1.
   */
  pixelRatio?: number;
  /**
   * Keep the drawing buffer after compositing.
   *
   * Leave this `true` (the default) for draw-on-demand rendering: with the WebGL
   * default of `false` the buffer is discarded after every composite, so a canvas
   * that is only redrawn when a tile arrives goes blank on the next unrelated
   * repaint, resize or scroll. Set it to `false` only if `renderVectorTiles` is
   * driven from a `requestAnimationFrame` loop that repaints every frame.
   */
  preserveDrawingBuffer?: boolean;
  /** Called after the GL context is lost. Rendering is a no-op until it is restored. */
  onContextLost?: () => void;
  /**
   * Called after the context is restored and the previously visible tiles have been
   * re-uploaded. Request a repaint from here.
   */
  onContextRestored?: () => void;
}

interface GPUResource {
  /** The plan this resource was uploaded from. Identity is the upload cache key. */
  plan: VectorPlan;
  polygonPosition: WebGLBuffer | null;
  polygonStyle: WebGLBuffer | null;
  polygonIndex: WebGLBuffer | null;
  lineVertex: WebGLBuffer | null;
  lineStyle: WebGLBuffer | null;
  lineIndex: WebGLBuffer | null;
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

function createPaletteTexture(gl: WebGL2RenderingContext, palette: Uint8Array, width: number): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) throw new Error('Unable to create palette texture');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

function createStyleTexture(gl: WebGL2RenderingContext, styleData: Float32Array, width: number): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) throw new Error('Unable to create style texture');
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
  const gpu = plan.gpu;
  return {
    plan,
    polygonPosition: gpu.polygonVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, gpu.polygonPositions) : null,
    polygonStyle: gpu.polygonVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, gpu.polygonStyles) : null,
    polygonIndex: gpu.polygonIndexCount ? createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gpu.polygonIndices) : null,
    lineVertex: gpu.lineVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, gpu.lineVertices) : null,
    lineStyle: gpu.lineVertexCount ? createBuffer(gl, gl.ARRAY_BUFFER, gpu.lineStyles) : null,
    lineIndex: gpu.lineIndexCount ? createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gpu.lineIndices) : null,
    paletteTexture: createPaletteTexture(gl, gpu.palette, Math.max(1, gpu.paletteCount)),
    styleTexture: createStyleTexture(gl, gpu.styleData, gpu.styleTextureWidth)
  };
}

function deleteGPUResource(gl: WebGL2RenderingContext, resource: GPUResource): void {
  gl.deleteBuffer(resource.polygonPosition);
  gl.deleteBuffer(resource.polygonStyle);
  gl.deleteBuffer(resource.polygonIndex);
  gl.deleteBuffer(resource.lineVertex);
  gl.deleteBuffer(resource.lineStyle);
  gl.deleteBuffer(resource.lineIndex);
  gl.deleteTexture(resource.paletteTexture);
  gl.deleteTexture(resource.styleTexture);
}

function defaultPixelRatio(): number {
  return typeof globalThis !== 'undefined' && typeof (globalThis as { devicePixelRatio?: number }).devicePixelRatio === 'number' ? (globalThis as { devicePixelRatio: number }).devicePixelRatio : 1;
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
  private pixelRatio: number;
  private contextLost = false;
  private readonly options: VectorRendererOptions;
  private readonly contextLostHandler?: (event: Event) => void;
  private readonly contextRestoredHandler?: () => void;

  private uTileScale: WebGLUniformLocation | null = null;
  private uTileOffset: WebGLUniformLocation | null = null;
  private uViewport: WebGLUniformLocation | null = null;
  private uExtent: WebGLUniformLocation | null = null;
  private uDeltaZoom: WebGLUniformLocation | null = null;
  private uDesignTileSize: WebGLUniformLocation | null = null;
  private uIsLine: WebGLUniformLocation | null = null;
  private uPalette: WebGLUniformLocation | null = null;
  private uStyleData: WebGLUniformLocation | null = null;
  private uPaletteWidth: WebGLUniformLocation | null = null;
  private uStyleTexelWidth: WebGLUniformLocation | null = null;
  private uDevicePixelRatio: WebGLUniformLocation | null = null;

  constructor(canvas: OffscreenCanvas | HTMLCanvasElement, options: VectorRendererOptions = {}) {
    this.canvas = canvas;
    this.options = options;
    this.pixelRatio = options.pixelRatio || 1;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      // Draw-on-demand safe by default: see VectorRendererOptions.preserveDrawingBuffer.
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? true
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
      if (existing.plan === tile.plan) return;
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
    const width = this.canvas.width as number;
    const height = this.canvas.height as number;
    const ratio = this.pixelRatio;

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.program);

    gl.uniform2f(this.uViewport, width, height);
    gl.uniform1f(this.uDesignTileSize, DESIGN_TILE_SIZE);
    gl.uniform1f(this.uDevicePixelRatio, ratio);

    for (const tile of visibleTiles) {
      const resource = this.resources.get(tile.key);
      // A missing resource means the tile was never uploaded for this frame. Uploading it
      // here keeps a tile from blinking out for one frame after a sync/render race.
      if (!resource) {
        this.uploadTile(tile);
      }
      const ready = resource ?? this.resources.get(tile.key);
      if (!ready) continue;

      const plan = ready.plan;
      const gpu = plan.gpu;
      const region = tile.region ?? { x: 0, y: 0, size: 1 };
      // Tile boxes are CSS pixels; the drawing buffer is device pixels.
      const scale = (tile.size * ratio) / (plan.extent * region.size);
      const offsetX = tile.x * ratio - region.x * plan.extent * scale;
      const offsetY = tile.y * ratio - region.y * plan.extent * scale;
      const deltaZoom = Math.max(0, Math.min(1, viewZoom - plan.zoom));

      gl.uniform2f(this.uTileScale, scale, scale);
      gl.uniform2f(this.uTileOffset, offsetX, offsetY);
      gl.uniform1f(this.uExtent, plan.extent);
      gl.uniform1f(this.uDeltaZoom, deltaZoom);
      gl.uniform1f(this.uPaletteWidth, Math.max(1, gpu.paletteCount));
      gl.uniform1f(this.uStyleTexelWidth, gpu.styleTextureWidth);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, ready.paletteTexture);
      gl.uniform1i(this.uPalette, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, ready.styleTexture);
      gl.uniform1i(this.uStyleData, 1);

      if (gpu.polygonIndexCount && ready.polygonPosition && ready.polygonStyle && ready.polygonIndex) {
        gl.uniform1f(this.uIsLine, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, ready.polygonPosition);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.SHORT, false, 0, 0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.disableVertexAttribArray(3);
        gl.bindBuffer(gl.ARRAY_BUFFER, ready.polygonStyle);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.UNSIGNED_SHORT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ready.polygonIndex);
        gl.drawElements(gl.TRIANGLES, gpu.polygonIndexCount, gl.UNSIGNED_INT, 0);
      }

      if (gpu.lineIndexCount && ready.lineVertex && ready.lineStyle && ready.lineIndex) {
        gl.uniform1f(this.uIsLine, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, ready.lineVertex);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.SHORT, false, 14, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.SHORT, false, 14, 4);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.SHORT, false, 14, 8);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 1, gl.SHORT, false, 14, 12);
        gl.bindBuffer(gl.ARRAY_BUFFER, ready.lineStyle);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.UNSIGNED_SHORT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ready.lineIndex);
        gl.drawElements(gl.TRIANGLES, gpu.lineIndexCount, gl.UNSIGNED_INT, 0);
      }
    }
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
    this.uPalette = gl.getUniformLocation(this.program, 'u_palette');
    this.uStyleData = gl.getUniformLocation(this.program, 'u_styleData');
    this.uPaletteWidth = gl.getUniformLocation(this.program, 'u_paletteWidth');
    this.uStyleTexelWidth = gl.getUniformLocation(this.program, 'u_styleTexelWidth');
    this.uDevicePixelRatio = gl.getUniformLocation(this.program, 'u_devicePixelRatio');
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
}

export function syncVectorTiles(renderer: VectorRenderer, visibleTiles: Iterable<VectorTileView>): void {
  renderer.syncVectorTiles(visibleTiles);
}

export function renderVectorTiles(renderer: VectorRenderer, visibleTiles: Iterable<VectorTileView>, viewZoom: number): void {
  renderer.renderVectorTiles(visibleTiles, viewZoom);
}

/**
 * Coalesces repaint requests onto animation frames.
 *
 * The renderer must own the full viewport set on every pass, so the loop asks for it
 * through `collect` rather than being handed a delta by whatever happened to change.
 * `isFramePending` is meant to be passed to `MapLoaderCacheOptions.shouldDeferEviction`,
 * so trimming never closes a bitmap that the pending pass is about to draw.
 */
export class VectorRenderLoop {
  private handle: number | null = null;
  private dirty = false;

  constructor(
    private readonly renderer: VectorRenderer,
    private readonly collect: () => { tiles: Array<VectorTileView>; viewZoom: number },
    private readonly requestFrame: (callback: () => void) => number = (callback) => (globalThis as unknown as { requestAnimationFrame: (cb: () => void) => number }).requestAnimationFrame(callback),
    private readonly cancelFrame: (handle: number) => void = (handle) => (globalThis as unknown as { cancelAnimationFrame: (h: number) => void }).cancelAnimationFrame(handle)
  ) {}

  /** True while a repaint is scheduled but not yet drawn. */
  get isFramePending(): boolean {
    return this.handle !== null;
  }

  /** Marks the view dirty. Cheap to call many times per frame. */
  invalidate(): void {
    this.dirty = true;
    if (this.handle !== null) return;
    this.handle = this.requestFrame(this.run);
  }

  stop(): void {
    if (this.handle === null) return;
    this.cancelFrame(this.handle);
    this.handle = null;
  }

  private run = (): void => {
    this.handle = null;
    if (!this.dirty) return;
    this.dirty = false;
    const { tiles, viewZoom } = this.collect();
    this.renderer.syncVectorTiles(tiles);
    this.renderer.renderVectorTiles(tiles, viewZoom);
  };
}

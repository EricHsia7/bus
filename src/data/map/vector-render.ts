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

interface GPUResource {
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

export class VectorRenderer {
  readonly canvas: OffscreenCanvas | HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  private readonly program: WebGLProgram;
  private readonly resources = new Map<string, GPUResource>();

  private readonly uTileScale: WebGLUniformLocation | null;
  private readonly uTileOffset: WebGLUniformLocation | null;
  private readonly uViewport: WebGLUniformLocation | null;
  private readonly uExtent: WebGLUniformLocation | null;
  private readonly uDeltaZoom: WebGLUniformLocation | null;
  private readonly uDesignTileSize: WebGLUniformLocation | null;
  private readonly uIsLine: WebGLUniformLocation | null;
  private readonly uPalette: WebGLUniformLocation | null;
  private readonly uStyleData: WebGLUniformLocation | null;
  private readonly uPaletteWidth: WebGLUniformLocation | null;
  private readonly uStyleTexelWidth: WebGLUniformLocation | null;

  constructor(canvas: OffscreenCanvas | HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true }) as WebGL2RenderingContext;
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl;
    this.program = createProgram(gl);

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
  }

  /**
   * Synchronize the GPU cache with the currently visible vector tiles.
   * Plans already uploaded are retained; newly visible cached plans are uploaded;
   * resources no longer visible are released.
   */
  syncVectorTiles(visibleTiles: Iterable<VectorTileView>): void {
    const visible = new Set<string>();
    for (const tile of visibleTiles) {
      visible.add(tile.key);
      const existing = this.resources.get(tile.key);
      if (existing) deleteGPUResource(this.gl, existing);
      this.resources.set(tile.key, createGPUResource(this.gl, tile.plan));
    }

    for (const [key, resource] of this.resources) {
      if (!visible.has(key)) {
        deleteGPUResource(this.gl, resource);
        this.resources.delete(key);
      }
    }
  }

  /** Render all currently visible vector tiles in one frame. */
  renderVectorTiles(visibleTiles: Iterable<VectorTileView>, viewZoom: number): void {
    const gl = this.gl;
    const width = this.canvas.width as number;
    const height = this.canvas.height as number;

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.program);

    gl.uniform2f(this.uViewport, width, height);
    gl.uniform1f(this.uDesignTileSize, DESIGN_TILE_SIZE);

    for (const tile of visibleTiles) {
      const resource = this.resources.get(tile.key);
      if (!resource) continue;

      const plan = resource.plan;
      const gpu = plan.gpu;
      const region = tile.region ?? { x: 0, y: 0, size: 1 };
      const scale = tile.size / (plan.extent * region.size);
      const offsetX = tile.x - region.x * plan.extent * scale;
      const offsetY = tile.y - region.y * plan.extent * scale;
      const deltaZoom = Math.max(0, Math.min(1, viewZoom - plan.zoom));

      gl.uniform2f(this.uTileScale, scale, scale);
      gl.uniform2f(this.uTileOffset, offsetX, offsetY);
      gl.uniform1f(this.uExtent, plan.extent);
      gl.uniform1f(this.uDeltaZoom, deltaZoom);
      gl.uniform1f(this.uPaletteWidth, Math.max(1, gpu.paletteCount));
      gl.uniform1f(this.uStyleTexelWidth, gpu.styleTextureWidth);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, resource.paletteTexture);
      gl.uniform1i(this.uPalette, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, resource.styleTexture);
      gl.uniform1i(this.uStyleData, 1);

      if (gpu.polygonIndexCount && resource.polygonPosition && resource.polygonStyle && resource.polygonIndex) {
        gl.uniform1f(this.uIsLine, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, resource.polygonPosition);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.SHORT, false, 0, 0);
        gl.disableVertexAttribArray(1);
        gl.disableVertexAttribArray(2);
        gl.disableVertexAttribArray(3);
        gl.bindBuffer(gl.ARRAY_BUFFER, resource.polygonStyle);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.UNSIGNED_SHORT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resource.polygonIndex);
        gl.drawElements(gl.TRIANGLES, gpu.polygonIndexCount, gl.UNSIGNED_INT, 0);
      }

      if (gpu.lineIndexCount && resource.lineVertex && resource.lineStyle && resource.lineIndex) {
        gl.uniform1f(this.uIsLine, 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, resource.lineVertex);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.SHORT, false, 14, 0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.SHORT, false, 14, 4);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.SHORT, false, 14, 8);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 1, gl.SHORT, false, 14, 12);
        gl.bindBuffer(gl.ARRAY_BUFFER, resource.lineStyle);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 1, gl.UNSIGNED_SHORT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, resource.lineIndex);
        gl.drawElements(gl.TRIANGLES, gpu.lineIndexCount, gl.UNSIGNED_INT, 0);
      }
    }
  }

  destroy(): void {
    for (const resource of this.resources.values()) deleteGPUResource(this.gl, resource);
    this.resources.clear();
    this.gl.deleteProgram(this.program);
  }
}

export function syncVectorTiles(renderer: VectorRenderer, visibleTiles: Iterable<VectorTileView>): void {
  renderer.syncVectorTiles(visibleTiles);
}

export function renderVectorTiles(renderer: VectorRenderer, visibleTiles: Iterable<VectorTileView>, viewZoom: number): void {
  renderer.renderVectorTiles(visibleTiles, viewZoom);
}

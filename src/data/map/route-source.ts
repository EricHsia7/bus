import { Box } from './index';
import { RouteFeatureCollection } from './route';
import { buildRoutePlan, RoutePlan } from './route-plan';
import { RouteTileView } from './route-renderer';

/**
 * Tile source: resolves which tiles cover the viewport, fetches + decodes them,
 * and turns them into renderer-ready `RouteTileView`s.
 */

export interface RouteTileMetadata {
  minZoom: number;
  maxZoom: number;
  extent: number;
  buffer: number;
}

export interface RouteTileCoordinate {
  z: number;
  x: number;
  y: number;
}

export interface ViewportDescriptor {
  /** Viewport size in CSS pixels. */
  width: number;
  height: number;
  /** Map centre in degrees. */
  centerLon: number;
  centerLat: number;
  /** Fractional zoom. */
  zoom: number;
  /** Rendered size of one tile in CSS pixels at integer zoom. Usually 256 or 512. */
  tileSize?: number;
}

const DEG_TO_RAD = Math.PI / 180;
const MAX_LATITUDE = 85.0511287798066;

function lonToWorld(lon: number): number {
  return (lon + 180) / 360;
}

function latToWorld(lat: number): number {
  const clamped = Math.max(-MAX_LATITUDE, Math.min(MAX_LATITUDE, lat));
  const sin = Math.sin(clamped * DEG_TO_RAD);
  return 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI);
}

/**
 * Choose the integer tile zoom to fetch for a fractional map zoom.
 * Clamped to the metadata range so over-zooming reuses the deepest tiles
 * (`line-width-scale` keeps widths growing smoothly past maxZoom).
 */
export function resolveTileZoom(zoom: number, metadata: RouteTileMetadata): number {
  return Math.max(metadata.minZoom, Math.min(metadata.maxZoom, Math.floor(zoom)));
}

/**
 * Compute the visible tiles and their on-screen boxes.
 * The screen box is the *unbuffered* tile square; the renderer subtracts the
 * buffer offset itself, so overlap geometry simply extends past the box.
 */
export function getVisibleTiles(viewport: ViewportDescriptor, metadata: RouteTileMetadata): Array<{ coordinate: RouteTileCoordinate; screenBBox: Box }> {
  const tileSize = viewport.tileSize ?? 512;
  const tileZoom = resolveTileZoom(viewport.zoom, metadata);
  const tileCount = 2 ** tileZoom;

  // Pixels per tile at the current fractional zoom (handles over/under-zoom).
  const renderedTileSize = tileSize * 2 ** (viewport.zoom - tileZoom);

  const centerX = lonToWorld(viewport.centerLon) * tileCount;
  const centerY = latToWorld(viewport.centerLat) * tileCount;

  const halfWidthTiles = viewport.width / 2 / renderedTileSize;
  const halfHeightTiles = viewport.height / 2 / renderedTileSize;

  const minTileX = Math.floor(centerX - halfWidthTiles);
  const maxTileX = Math.floor(centerX + halfWidthTiles);
  const minTileY = Math.max(0, Math.floor(centerY - halfHeightTiles));
  const maxTileY = Math.min(tileCount - 1, Math.floor(centerY + halfHeightTiles));

  const results: Array<{ coordinate: RouteTileCoordinate; screenBBox: Box }> = [];

  for (let tx = minTileX; tx <= maxTileX; tx++) {
    for (let ty = minTileY; ty <= maxTileY; ty++) {
      // Wrap X around the antimeridian.
      const wrappedX = ((tx % tileCount) + tileCount) % tileCount;
      const minX = viewport.width / 2 + (tx - centerX) * renderedTileSize;
      const minY = viewport.height / 2 + (ty - centerY) * renderedTileSize;
      results.push({
        coordinate: { z: tileZoom, x: wrappedX, y: ty },
        // Boxes are exactly adjacent (no rounding) so seams cannot crack open.
        screenBBox: { minX, minY, maxX: minX + renderedTileSize, maxY: minY + renderedTileSize }
      });
    }
  }

  return results;
}

export interface RouteTileSourceOptions {
  /** Base URL of the generated tile tree, e.g. `/routes`. */
  baseUrl: string;
  metadata: RouteTileMetadata;
  fetchImpl?: typeof fetch;
  /** Maximum number of decoded plans kept in memory. */
  cacheSize?: number;
}

function tileKey(coordinate: RouteTileCoordinate): string {
  return `${coordinate.z}/${coordinate.x}/${coordinate.y}`;
}

/**
 * Loads `{base}/{z}/{x}/{y}.gz`, decodes it, and caches the built `RoutePlan`.
 * Gzip is undone by the browser via `DecompressionStream` when the server does
 * not already set `Content-Encoding: gzip`.
 */
export class RouteTileSource {
  private readonly options: RouteTileSourceOptions;
  private readonly cache = new Map<string, RoutePlan>();
  private readonly pending = new Map<string, Promise<RoutePlan | null>>();

  constructor(options: RouteTileSourceOptions) {
    this.options = options;
  }

  get metadata(): RouteTileMetadata {
    return this.options.metadata;
  }

  getCached(coordinate: RouteTileCoordinate): RoutePlan | null {
    return this.cache.get(tileKey(coordinate)) ?? null;
  }

  async load(coordinate: RouteTileCoordinate): Promise<RoutePlan | null> {
    const key = tileKey(coordinate);
    const cached = this.cache.get(key);
    if (cached) return cached;

    const inFlight = this.pending.get(key);
    if (inFlight) return inFlight;

    const request = this.fetchPlan(coordinate)
      .then((plan) => {
        if (plan) this.put(key, plan);
        return plan;
      })
      .finally(() => {
        this.pending.delete(key);
      });

    this.pending.set(key, request);
    return request;
  }

  private put(key: string, plan: RoutePlan): void {
    const limit = this.options.cacheSize ?? 256;
    if (this.cache.size >= limit) {
      const oldest = this.cache.keys().next();
      if (!oldest.done) this.cache.delete(oldest.value);
    }
    this.cache.set(key, plan);
  }

  private async fetchPlan(coordinate: RouteTileCoordinate): Promise<RoutePlan | null> {
    const fetchImpl = this.options.fetchImpl ?? fetch;
    const url = `${this.options.baseUrl}/${coordinate.z}/${coordinate.x}/${coordinate.y}.gz`;
    const response = await fetchImpl(url);
    if (!response.ok) return null; // 404 simply means "no routes in this tile"

    const buffer = await response.arrayBuffer();
    const collection = await decodeTile(buffer);
    return buildRoutePlan(collection);
  }

  /** Load every tile covering the viewport and return renderer-ready views. */
  async getTileViews(viewport: ViewportDescriptor): Promise<Array<RouteTileView>> {
    const visible = getVisibleTiles(viewport, this.options.metadata);
    const views = await Promise.all(
      visible.map(async ({ coordinate, screenBBox }) => {
        const plan = await this.load(coordinate);
        return plan ? { plan, screenBBox } : null;
      })
    );
    return views.filter((view): view is RouteTileView => view !== null);
  }
}

/** Decode a possibly gzipped tile payload into a `RouteFeatureCollection`. */
export async function decodeTile(buffer: ArrayBuffer): Promise<RouteFeatureCollection> {
  const bytes = new Uint8Array(buffer);
  const isGzip = bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

  let text: string;
  if (isGzip && typeof DecompressionStream !== 'undefined') {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    text = await new Response(stream).text();
  } else {
    text = new TextDecoder().decode(bytes);
  }

  return JSON.parse(text) as RouteFeatureCollection;
}

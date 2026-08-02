import { querySize } from '../index';
import { MapLoader, MapLoaderResponse } from '../../data/map';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { MapTileController, TileInfo } from '../../tools/tile-controller';
import { clamp } from '../../tools/math';

const mapField = documentQuerySelector('.css_map_field');
const mapCanvas = elementQuerySelector(mapField, '.css_map_canvas') as HTMLCanvasElement;
const mapContext = mapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function createLayerBuffer(): { canvas: OffscreenCanvas | HTMLCanvasElement; context: Context2D } {
  if (typeof OffscreenCanvas === 'function') {
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext('2d');
    if (context) return { canvas, context };
  }
  const canvas = document.createElement('canvas');
  return { canvas, context: canvas.getContext('2d') as CanvasRenderingContext2D };
}

const { canvas: layerCanvas, context: layerContext } = createLayerBuffer();

/** Integer zoom levels for which raster tiles actually exist on the server */
const minNativeZoom = 13;
const maxNativeZoom = 16;
// [minZoom, maxZoom] therefore covers under zoom + native zoom + over zoom.
// 0.99 keeps the top of the range inside the last integer layer.
const minZoom = minNativeZoom - 1;
const maxZoom = maxNativeZoom + 2;
const bounds = [120.886, 24.8, 122.004, 25.3];

let width: number = window.innerWidth;
let height: number = window.innerHeight;
let displayed: boolean = false;
const devicePixelRatio = window.devicePixelRatio;

/** Duration of the per-tile fade-in while panning, in milliseconds */
const fadeDuration = 200;
/** Duration of the zoom layer cross-fade, in milliseconds */
const crossfadeDuration = 250;
/** How long the outgoing layer may stay on screen if the incoming layer never completes */
const layerBackdropTimeout = 1200;
/** Upper bound of retained fade states before pruning */
const maxFadeStates = 1024;
/** Hard ceiling of decoded tiles kept by the LRU cache */
const maxCachedTiles = 512;
/** Floor of the LRU budget, so small viewports still keep a useful history */
const minCachedTiles = 64;
/** The cache is never trimmed below this multiple of the tiles currently on screen */
const cacheHeadroomFactor = 3;
/** Delay before an eviction pass is attempted once the map goes quiet, in milliseconds */
const evictionIdleDelay = 200;
/** Largest frame delta honoured, so returning from an idle tab does not jump a fade to the end */
const maxFrameDelta = 64;
/** Painted underneath the tiles so fade-ins read as map background rather than a black flash */
const backgroundFill = '#e9e6e1';

const mapLoader = new MapLoader(2, handleTileResponse);

interface TileFadeState {
  opacity: number;
  timestamp: number;
}

/** Fade progress per tile key, used when tiles stream in at a stable zoom level */
const tileFadeStates = new Map<string, TileFadeState>();
/**
 * Decoded tiles in least-recently-used order. A Map preserves insertion order, so
 * re-inserting on every read keeps the oldest entry at the front of the iteration.
 */
const tileCache = new Map<string, MapLoaderResponse>();
/** Tile keys painted in the most recent frame. These are never evicted. */
const protectedTileKeys = new Set<string>();
let evictionTimeoutId: ReturnType<typeof setTimeout> | null = null;
/** Tile keys already handed to the loader, used to diff visible sets between movements */
const requestedTileKeys = new Set<string>();
/** Zoom level of the outgoing layer while a cross-fade is running */
let backdropZ: number | null = null;
let backdropTimestamp = 0;
/** Linear cross-fade progress of the incoming layer, 0 to 1 */
let crossfadeProgress = 1;
let activeLayerZ: number | null = null;
let lastFrameTime = 0;
let frameId: number | null = null;

const mapTileController = new MapTileController({
  element: mapCanvas,
  centerLon: (120.886 + 122.004) / 2,
  centerLat: (24.8 + 25.3) / 2,
  zoom: 16,
  minZoom: minZoom,
  maxZoom: maxZoom,
  minNativeZoom: minNativeZoom,
  maxNativeZoom: maxNativeZoom,
  tileSize: 256,
  onMovementStart: function () {
    requestFrame();
  },
  onMovement: function () {
    // Only repaint while moving. Requests are issued once movement settles.
    requestFrame();
  },
  onMovementEnd: function () {
    synchronizeQueue();
    requestFrame();
  },
  onResize: function () {
    resizeMapCanvas();
    synchronizeQueue();
    requestFrame();
  }
});

export function openMap(lon: number = (120.886 + 122.004) / 2, lat: number = (24.8 + 25.3) / 2, zoom = 16, duration: number = 500): void {
  displayed = true;
  mapField.setAttribute('displayed', 'true');
  resizeMapCanvas();
  synchronizeQueue();
  requestFrame();
  mapTileController.focusOn(lon, lat, zoom, duration);
}

export function closeMap(): void {
  displayed = false;
  mapField.setAttribute('displayed', 'false');
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
  lastFrameTime = 0;

  // Nothing is on screen any more, so the whole cache is evictable down to the budget.
  protectedTileKeys.clear();
  if (evictionTimeoutId !== null) {
    clearTimeout(evictionTimeoutId);
    evictionTimeoutId = null;
  }
  runEviction();
}

export function resizeMapCanvas(): void {
  const size = querySize('window');
  width = size.width;
  height = size.height;

  mapCanvas.width = width * devicePixelRatio;
  mapCanvas.height = height * devicePixelRatio;
  layerCanvas.width = mapCanvas.width;
  layerCanvas.height = mapCanvas.height;

  // Resetting the backing store drops the transform, so re-apply it to both contexts here.
  mapContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  layerContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  // mapContext.imageSmoothingEnabled = true;
  // mapContext.imageSmoothingQuality = 'high';
}

function getTileKey(x: number, y: number, z: number): string {
  return `${x}.${y}.${z}`;
}

function handleTileResponse(response: MapLoaderResponse): void {
  // Decoded tiles enter the LRU cache as the most recently used entry and are
  // painted by the render loop so they can fade in.
  touchTile(getTileKey(response.x, response.y, response.z), response);
  requestFrame();
}

/** Marks a tile as most recently used by reinserting it at the tail of the map. */
function touchTile(key: string, response: MapLoaderResponse): void {
  tileCache.delete(key);
  tileCache.set(key, response);
}

/**
 * Reads a tile through the LRU cache. A miss falls back to the loader's own cache
 * (for example a tile the service worker replayed) and adopts it into the LRU.
 */
function getTile(x: number, y: number, z: number): MapLoaderResponse | null {
  const key = getTileKey(x, y, z);
  const cached = tileCache.get(key);
  if (cached) {
    touchTile(key, cached);
    return cached;
  }

  const response = mapLoader.get(x, y, z);
  if (!response) return null;
  touchTile(key, response);
  return response;
}

/**
 * Number of tiles the cache may hold: enough for the visible layer plus a few
 * screens of history, bounded by a hard ceiling.
 */
function getCacheBudget(): number {
  const visibleBudget = protectedTileKeys.size * cacheHeadroomFactor;
  return clamp(visibleBudget, minCachedTiles, maxCachedTiles);
}

/**
 * Eviction is deferred rather than run inline: rendering always wins the frame, and
 * trimming only happens once the map goes quiet.
 */
function scheduleEviction(): void {
  if (evictionTimeoutId !== null) return;
  evictionTimeoutId = setTimeout(runEviction, evictionIdleDelay);
}

function runEviction(): void {
  evictionTimeoutId = null;

  // A frame is queued, so the main thread belongs to rendering. Try again later.
  if (frameId !== null) {
    scheduleEviction();
    return;
  }

  const budget = getCacheBudget();
  if (tileCache.size <= budget) return;

  // Iterating the map yields least-recently-used first.
  for (const [key, response] of Array.from(tileCache)) {
    if (tileCache.size <= budget) break;
    // Never drop a tile that is on screen or that the settled viewport still wants.
    if (protectedTileKeys.has(key) || requestedTileKeys.has(key)) continue;

    tileCache.delete(key);
    tileFadeStates.delete(key);
    releaseTile(response);
  }
}

type ReleasableLoader = { release?: (x: number, y: number, z: number) => boolean | void };

/**
 * Hands the decoded bitmap back. The bitmap is only closed when the loader confirms
 * it dropped its own reference, otherwise a later `mapLoader.get` could return a
 * detached bitmap that can no longer be drawn.
 */
function releaseTile(response: MapLoaderResponse): void {
  const loader = mapLoader as unknown as ReleasableLoader;
  const released = typeof loader.release === 'function' ? loader.release(response.x, response.y, response.z) !== false : false;
  if (!released) return;
  const bitmap = response.bitmap as ImageBitmap;
  if (typeof bitmap?.close === 'function') bitmap.close();
}

function requestFrame(): void {
  if (frameId !== null) return;
  frameId = requestAnimationFrame(renderFrame);
}

/**
 * Compares the tiles needed for the settled viewport against the tiles already
 * requested. Only the difference is queued, and pending requests for tiles that
 * scrolled away are dropped. In-flight requests are left to finish so the
 * service worker can cache them for later.
 */
function synchronizeQueue(): void {
  if (!displayed) return;

  // Clamped into the native range, so over/under zoom never requests a layer that
  // has no raster tiles behind it.
  const z = mapTileController.getNativeZoom();
  const visibleTiles = mapTileController.getVisibleTiles(z);

  const visibleKeys = new Set<string>();
  for (const tile of visibleTiles) {
    visibleKeys.add(getTileKey(tile.x, tile.y, tile.z));
  }

  for (const key of Array.from(requestedTileKeys)) {
    if (visibleKeys.has(key)) continue;
    const [x, y, tileZ] = key.split('.').map(Number);
    // dequeue is a no-op once a tile is loading or loaded, so active requests complete naturally.
    mapLoader.dequeue(x, y, tileZ);
    requestedTileKeys.delete(key);
  }

  let enqueued = 0;
  for (const tile of visibleTiles) {
    const key = getTileKey(tile.x, tile.y, tile.z);
    if (requestedTileKeys.has(key)) continue;
    requestedTileKeys.add(key);
    if (getTile(tile.x, tile.y, tile.z)) continue;
    mapLoader.enqueue(tile.x, tile.y, tile.z);
    enqueued++;
  }

  if (enqueued > 0) mapLoader.consume();

  // The visible set just changed, so previously cached tiles may now be evictable.
  scheduleEviction();
}

/**
 * Snaps a tile to whole device pixels on every edge. Neighbouring tiles share
 * their geographic edge, so both round to the same device pixel and no seam is
 * left between them.
 */
function drawTile(context: Context2D, response: MapLoaderResponse, z: number, alpha: number): void {
  const { screenBBox } = mapTileController.getTileBoundingBox(response.x, response.y, z);

  const left = Math.round(screenBBox.minX * devicePixelRatio) / devicePixelRatio;
  const top = Math.round(screenBBox.minY * devicePixelRatio) / devicePixelRatio;
  const right = Math.round(screenBBox.maxX * devicePixelRatio) / devicePixelRatio;
  const bottom = Math.round(screenBBox.maxY * devicePixelRatio) / devicePixelRatio;

  const tileWidth = right - left;
  const tileHeight = bottom - top;
  if (tileWidth <= 0 || tileHeight <= 0) return;

  context.globalAlpha = alpha;
  context.drawImage(response.bitmap, left, top, tileWidth, tileHeight);
  context.globalAlpha = 1;
}

function easeInOut(progress: number): number {
  return progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

function pruneFadeStates(): void {
  if (tileFadeStates.size <= maxFadeStates) return;
  for (const key of Array.from(tileFadeStates.keys())) {
    if (tileFadeStates.size <= maxFadeStates / 2) break;
    if (requestedTileKeys.has(key)) continue;
    tileFadeStates.delete(key);
  }
}

function renderFrame(now: number): void {
  frameId = null;

  const delta = lastFrameTime === 0 ? 0 : Math.min(maxFrameDelta, Math.max(0, now - lastFrameTime));
  lastFrameTime = now;

  const z = mapTileController.getNativeZoom();
  // Rebuilt every frame: the tiles painted below are exactly the ones eviction must keep.
  protectedTileKeys.clear();

  if (activeLayerZ === null) {
    activeLayerZ = z;
  } else if (activeLayerZ !== z) {
    // Zoom layer swapped: cross-fade from the outgoing layer to the incoming one.
    backdropZ = activeLayerZ;
    backdropTimestamp = now;
    crossfadeProgress = 0;
    activeLayerZ = z;
  }

  mapContext.globalAlpha = 1;
  mapContext.fillStyle = backgroundFill;
  mapContext.fillRect(0, 0, width, height);

  const visibleTiles: TileInfo[] = mapTileController.getVisibleTiles(z);
  let layerComplete = visibleTiles.length > 0;
  let animating = false;

  if (backdropZ !== null) {
    // Outgoing layer is laid down opaque, then the incoming layer is composited over it
    // at the cross-fade alpha. Compositing `old * (1 - t) + new * t` this way is an exact
    // cross-fade while keeping full coverage, so the background never shows through and
    // tiles missing from the incoming layer keep showing the old imagery underneath.
    for (const tile of mapTileController.getVisibleTiles(backdropZ)) {
      protectedTileKeys.add(getTileKey(tile.x, tile.y, backdropZ));
      const cache = getTile(tile.x, tile.y, backdropZ);
      if (cache) drawTile(mapContext, cache, backdropZ, 1);
    }

    crossfadeProgress = Math.min(1, crossfadeProgress + (crossfadeDuration > 0 ? delta / crossfadeDuration : 1));

    layerContext.clearRect(0, 0, width, height);
    for (const tile of visibleTiles) {
      protectedTileKeys.add(getTileKey(tile.x, tile.y, z));
      const cache = getTile(tile.x, tile.y, z);
      if (!cache) {
        layerComplete = false;
        continue;
      }
      // The layer carries the alpha, so tiles are opaque inside the buffer. Their
      // individual fades are marked done to avoid a second fade after the swap.
      tileFadeStates.set(getTileKey(tile.x, tile.y, z), { opacity: 1, timestamp: now });
      drawTile(layerContext, cache, z, 1);
    }

    mapContext.globalAlpha = easeInOut(crossfadeProgress);
    mapContext.drawImage(layerCanvas, 0, 0, width, height);
    mapContext.globalAlpha = 1;

    if (crossfadeProgress < 1) animating = true;

    if ((crossfadeProgress >= 1 && layerComplete) || now - backdropTimestamp > layerBackdropTimeout) {
      backdropZ = null;
      crossfadeProgress = 1;
    }
  } else {
    // Stable zoom level: tiles streaming in from panning fade in individually.
    for (const tile of visibleTiles) {
      const key = getTileKey(tile.x, tile.y, z);
      protectedTileKeys.add(key);

      const cache = getTile(tile.x, tile.y, z);
      if (!cache) {
        layerComplete = false;
        continue;
      }

      let fade = tileFadeStates.get(key);
      if (!fade) {
        fade = { opacity: 0, timestamp: now };
        tileFadeStates.set(key, fade);
      }

      if (fade.opacity < 1) {
        const elapsed = Math.min(maxFrameDelta, Math.max(0, now - fade.timestamp));
        fade.opacity = Math.min(1, fade.opacity + (fadeDuration > 0 ? elapsed / fadeDuration : 1));
        animating = true;
      }
      fade.timestamp = now;

      drawTile(mapContext, cache, z, fade.opacity);
    }
  }

  pruneFadeStates();

  if (animating || backdropZ !== null) {
    // Still animating: rendering keeps priority and eviction waits for the map to settle.
    requestFrame();
  } else {
    lastFrameTime = 0;
    scheduleEviction();
  }
}

import { querySize } from '../index';
import { MapLoader, MapLoaderResponse } from '../../data/map';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { MapTileController, TileInfo, WGS84 } from '../../tools/tile-controller';
import { clamp } from '../../tools/math';

const mapField = documentQuerySelector('.css_map_field');
const mapCanvas = elementQuerySelector(mapField, '.css_map_canvas') as HTMLCanvasElement;
const mapContext = mapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

function createSnapshotBuffer(): { canvas: OffscreenCanvas | HTMLCanvasElement; context: Context2D } {
  if (typeof OffscreenCanvas === 'function') {
    const canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext('2d');
    if (context) return { canvas, context };
  }
  const canvas = document.createElement('canvas');
  return { canvas, context: canvas.getContext('2d') as CanvasRenderingContext2D };
}

/** Holds the last frame painted before a zoom layer swap, so it can be faded out afterwards */
const { canvas: snapshotCanvas, context: snapshotContext } = createSnapshotBuffer();

/** Integer zoom levels for which raster tiles actually exist on the server */
const minNativeZoom = 12;
const maxNativeZoom = 16;
// [minZoom, maxZoom] therefore covers under zoom + native zoom + over zoom.
// 0.99 keeps the top of the range inside the last integer layer.
const minZoom = 12;
const maxZoom = 18;
const bounds = [120.886, 24.8, 122.004, 25.3];

let width: number = window.innerWidth;
let height: number = window.innerHeight;
let displayed: boolean = false;
const devicePixelRatio = window.devicePixelRatio;

/** Duration of the per-tile fade-in, in milliseconds, used as tiles stream in at a stable layer */
const fadeDuration = 250;
/**
 * Duration of the cross-fade between two zoom layers, in milliseconds. Crossing an integer
 * zoom doubles the raster resolution in one step, so this runs longer than a tile fade to
 * keep that jump from reading as a pop.
 */
const layerFadeDuration = 250;
/** How many coarser zoom levels may be searched for stand-in imagery while a tile is missing */
const maxParentFallbackDepth = 5;
/** How many finer zoom levels may be searched for stand-in imagery while a tile is missing */
const maxChildFallbackDepth = 2;
/** Upper bound of retained fade states before pruning */
const maxFadeStates = 1024;
/** Decoded-tile budget handed to the loader's LRU cache, in bytes */
const maxCacheBytes = 96 * 1024 * 1024;
/** Floor of the LRU budget, so small viewports still keep a useful history */
const minCachedTiles = 64;
/** The cache is never trimmed below this multiple of the tiles currently on screen */
const cacheHeadroomFactor = 3;
/** Delay before an eviction pass is attempted once the map goes quiet, in milliseconds */
const evictionIdleDelay = 200;
/** Largest frame delta honoured, so returning from an idle tab does not jump a fade to the end */
const maxFrameDelta = 64;
/** Painted underneath the tiles so fade-ins read as map background rather than a black flash */
const backgroundFill = '#f0f2f5';

const mapLoader = new MapLoader(clamp(Math.floor(Math.log(window.navigator.hardwareConcurrency) / Math.log(2)), 1, 6), handleTileResponse, {
  maxCacheBytes,
  minCachedTiles,
  headroomFactor: cacheHeadroomFactor,
  evictionDelay: evictionIdleDelay,
  // Eviction waits while a frame is queued, so trimming never competes with drawing.
  shouldDeferEviction: () => frameId !== null,
  // The loader owns the bitmap; the renderer only drops the state derived from it.
  onEvict: (key) => {
    tileFadeStates.delete(key);
  }
});

interface TileFadeState {
  opacity: number;
  timestamp: number;
}

/** Fade progress per tile key, used when tiles stream in at a stable zoom level */
const tileFadeStates = new Map<string, TileFadeState>();
/**
 * Tile keys painted in the most recent frame. Handed to the loader after each frame
 * so its LRU never evicts imagery that is currently on screen.
 */
const protectedTileKeys = new Set<string>();
/** Tile keys already handed to the loader, used to diff visible sets between movements */
const requestedTileKeys = new Set<string>();
/** Native layer painted in the previous frame, used to detect a zoom layer swap */
let activeLayerZ: number | null = null;
/**
 * Viewport the snapshot was painted with. The snapshot is a flat image, so it has to be
 * re-projected every frame to stay locked to the ground while the gesture continues.
 * `null` means no layer cross-fade is running.
 */
let snapshotCenter: WGS84 | null = null;
let snapshotZoom = 0;
let snapshotStartTime = 0;
/** Viewport of the frame currently on the canvas, captured alongside a future snapshot */
let paintedCenter: WGS84 | null = null;
let paintedZoom = 0;
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

  // Reopening should show the current viewport straight away rather than replay a
  // cross-fade against a layer that left the screen long ago.
  activeLayerZ = null;
  snapshotCenter = null;
  paintedCenter = null;

  // Nothing is on screen any more, so nothing needs protecting and the loader can
  // trim straight down to its budget.
  protectedTileKeys.clear();
  mapLoader.protect(protectedTileKeys);
  mapLoader.trim();
}

export function resizeMapCanvas(): void {
  const size = querySize('window');
  width = size.width;
  height = size.height;

  mapCanvas.width = width * devicePixelRatio;
  mapCanvas.height = height * devicePixelRatio;
  snapshotCanvas.width = mapCanvas.width;
  snapshotCanvas.height = mapCanvas.height;

  // Resizing wiped the snapshot, and a frame painted at the old size could not be
  // re-projected onto the new one anyway, so any running layer cross-fade is dropped.
  snapshotCenter = null;
  paintedCenter = null;

  // Resetting the backing store drops the transform, so re-apply it here.
  mapContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  // mapContext.imageSmoothingEnabled = true;
  // mapContext.imageSmoothingQuality = 'high';
}

function getTileKey(x: number, y: number, z: number): string {
  return `${x}.${y}.${z}`;
}

function handleTileResponse(response: MapLoaderResponse): void {
  // The loader has already cached the decoded tile. The render loop picks it up on the
  // next frame so it can fade in.
  requestFrame();
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
    // A cached tile needs no request; `get` also marks it as recently used.
    if (mapLoader.get(tile.x, tile.y, tile.z)) continue;
    mapLoader.enqueue(tile.x, tile.y, tile.z);
    enqueued++;
  }

  if (enqueued > 0) mapLoader.consume();
}

/**
 * Paints one tile-sized rectangle, snapped to whole device pixels on every edge.
 * Neighbouring tiles share their geographic edge, so both round to the same device
 * pixel and no seam is left between them.
 *
 * `source` selects the sub-rectangle of the bitmap that should be stretched across the
 * destination box. That is how an ancestor tile stands in for a missing finer tile:
 * the destination is the missing tile's box, while the source is the quarter, sixteenth,
 * ... of the ancestor bitmap that covers exactly that ground.
 */
function drawTileRegion(context: Context2D, bitmap: MapLoaderResponse['bitmap'], destX: number, destY: number, destZ: number, source: { x: number; y: number; width: number; height: number } | null, alpha: number): void {
  const { screenBBox } = mapTileController.getTileBoundingBox(destX, destY, destZ);

  const left = Math.round(screenBBox.minX * devicePixelRatio) / devicePixelRatio;
  const top = Math.round(screenBBox.minY * devicePixelRatio) / devicePixelRatio;
  const right = Math.round(screenBBox.maxX * devicePixelRatio) / devicePixelRatio;
  const bottom = Math.round(screenBBox.maxY * devicePixelRatio) / devicePixelRatio;

  const tileWidth = right - left;
  const tileHeight = bottom - top;
  if (tileWidth <= 0 || tileHeight <= 0) return;
  // Stand-in tiles from finer layers can fall outside the viewport, so skip those draws.
  if (right < 0 || bottom < 0 || left > width || top > height) return;

  context.globalAlpha = alpha;
  if (source) {
    context.drawImage(bitmap as CanvasImageSource, source.x, source.y, source.width, source.height, left, top, tileWidth, tileHeight);
  } else {
    context.drawImage(bitmap as CanvasImageSource, left, top, tileWidth, tileHeight);
  }
  context.globalAlpha = 1;
}

function drawTile(context: Context2D, response: MapLoaderResponse, z: number, alpha: number): void {
  drawTileRegion(context, response.bitmap, response.x, response.y, z, null, alpha);
}

/**
 * Fills a tile that has not arrived yet with the closest cached imagery there is,
 * searching outwards from the requested layer (z-1, z+1, z-2, z+2, ...) and never beyond
 * the native range, where no raster exists at all.
 *
 * The nearest cached ancestor is painted first because a single ancestor always covers the
 * whole tile, then any cached descendants are painted over it, coarsest first, so the
 * sharpest imagery available ends up on top. Nothing is requested here: only tiles already
 * decoded in the loader's cache are used, so this never competes with the real queue.
 * Everything painted is registered as protected so the LRU cannot evict imagery on screen.
 */
function drawFallbackTile(context: Context2D, x: number, y: number, z: number): boolean {
  const maxUp = Math.min(maxParentFallbackDepth, z - mapTileController.minNativeZoom);
  const maxDown = Math.min(maxChildFallbackDepth, mapTileController.maxNativeZoom - z);
  let painted = false;

  for (let depth = 1; depth <= maxUp; depth++) {
    const scale = Math.pow(2, depth);
    const parentX = Math.floor(x / scale);
    const parentY = Math.floor(y / scale);
    const parent = mapLoader.get(parentX, parentY, z - depth);
    if (!parent) continue;

    protectedTileKeys.add(getTileKey(parentX, parentY, z - depth));
    const sourceWidth = parent.bitmap.width / scale;
    const sourceHeight = parent.bitmap.height / scale;
    drawTileRegion(
      context,
      parent.bitmap,
      x,
      y,
      z,
      {
        x: (x - parentX * scale) * sourceWidth,
        y: (y - parentY * scale) * sourceHeight,
        width: sourceWidth,
        height: sourceHeight
      },
      1
    );
    painted = true;
    break;
  }

  for (let depth = 1; depth <= maxDown; depth++) {
    const scale = Math.pow(2, depth);
    let covered = 0;

    for (let childX = x * scale; childX < (x + 1) * scale; childX++) {
      for (let childY = y * scale; childY < (y + 1) * scale; childY++) {
        const child = mapLoader.get(childX, childY, z + depth);
        if (!child) continue;
        protectedTileKeys.add(getTileKey(childX, childY, z + depth));
        drawTile(context, child, z + depth, 1);
        covered++;
      }
    }

    if (covered > 0) painted = true;
    // Fully covered by this level, so finer levels would only cost lookups.
    if (covered === scale * scale) break;
  }

  return painted;
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

/**
 * Freezes the frame that is still on the canvas so it can be faded out after a zoom layer
 * swap. Copying the composited frame, rather than remembering which layer was on screen,
 * captures exactly what the user is looking at: half-finished tile fades, stand-ins and all.
 * Swapping layers again mid-fade therefore stays continuous, because the new snapshot
 * already contains the previous cross-fade.
 */
function captureSnapshot(now: number): void {
  if (paintedCenter === null) return;

  // The copy is a raw device-pixel blit, so the device pixel ratio transform is dropped
  // for the duration and then restored for the projected draws.
  snapshotContext.setTransform(1, 0, 0, 1, 0, 0);
  snapshotContext.clearRect(0, 0, snapshotCanvas.width, snapshotCanvas.height);
  snapshotContext.drawImage(mapCanvas, 0, 0);
  snapshotContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

  snapshotCenter = paintedCenter;
  snapshotZoom = paintedZoom;
  snapshotStartTime = now;
}

/**
 * Draws the frozen frame locked to the ground rather than to the screen. Web Mercator screen
 * space only scales and translates when the viewport changes, so re-projecting the snapshot
 * is a single scaled `drawImage`: the ground point that sat at the snapshot's centre is
 * placed where it lives now, and the image is scaled by the zoom travelled since. The
 * outgoing imagery therefore keeps tracking the gesture instead of sitting frozen on screen.
 */
function drawSnapshot(): void {
  if (snapshotCenter === null) return;

  const scale = Math.pow(2, mapTileController.zoom - snapshotZoom);
  const center = mapTileController.wgs84ToScreen(snapshotCenter);

  mapContext.drawImage(snapshotCanvas as CanvasImageSource, center.x - (width / 2) * scale, center.y - (height / 2) * scale, width * scale, height * scale);
}

function renderFrame(now: number): void {
  frameId = null;

  const z = mapTileController.getNativeZoom();
  // Rebuilt every frame: the tiles painted below are exactly the ones eviction must keep.
  protectedTileKeys.clear();

  // Crossing an integer zoom replaces every tile on screen at once, and the incoming tiles
  // are usually already cached, so without this the whole layer would swap in a single
  // frame. The frame being replaced is grabbed before anything else is drawn over it.
  if (activeLayerZ !== null && activeLayerZ !== z) captureSnapshot(now);
  activeLayerZ = z;

  // Progress is measured against the clock rather than accumulated per frame, so a stalled
  // or backgrounded tab resumes at the right point instead of somewhere mid-fade.
  const layerFadeProgress = snapshotCenter === null || layerFadeDuration <= 0 ? 1 : Math.min(1, (now - snapshotStartTime) / layerFadeDuration);
  if (layerFadeProgress >= 1) snapshotCenter = null;
  const layerAlpha = easeInOut(layerFadeProgress);

  mapContext.globalAlpha = 1;
  mapContext.fillStyle = backgroundFill;
  mapContext.fillRect(0, 0, width, height);

  const visibleTiles: TileInfo[] = mapTileController.getVisibleTiles(z);
  let animating = snapshotCenter !== null;

  // Pass 1: stand-in imagery from the nearest zoom levels, painted underneath the requested
  // layer. A tile that has not arrived shows the closest zoom level already in cache instead
  // of the background, and a tile that is still fading has something meaningful beneath it,
  // which turns the fade into a real cross-fade between two pieces of imagery rather than a
  // fade up from a flat colour.
  //
  // While the snapshot is up it already covers the viewport, so stand-ins are only needed
  // for ground the snapshot never contained, such as edges revealed by panning mid-fade.
  // Skipping the rest also avoids blending the same imagery twice under a fading tile.
  for (const tile of visibleTiles) {
    const fade = tileFadeStates.get(getTileKey(tile.x, tile.y, z));
    const cached = mapLoader.get(tile.x, tile.y, z);
    // A tile that is present and fully faded in is opaque, so a stand-in under it is
    // invisible and only costs draw calls.
    if (cached && (snapshotCenter !== null || (fade && fade.opacity >= 1))) continue;
    drawFallbackTile(mapContext, tile.x, tile.y, z);
  }

  // Pass 2: the outgoing frame, laid down opaque so the incoming layer always has full
  // coverage to blend against.
  drawSnapshot();

  // Pass 3: the requested layer. Each tile owns its fade for tiles streaming in at a stable
  // zoom, and the layer alpha carries the zoom transition on top of it, so a late arrival
  // during a layer swap still cannot pop in at full strength.
  for (const tile of visibleTiles) {
    const key = getTileKey(tile.x, tile.y, z);
    protectedTileKeys.add(key);

    const cache = mapLoader.get(tile.x, tile.y, z);
    if (!cache) continue;

    let fade = tileFadeStates.get(key);
    if (!fade) {
      // The fade starts when the tile first becomes drawable, not when it was requested.
      fade = { opacity: 0, timestamp: now };
      tileFadeStates.set(key, fade);
    }

    if (fade.opacity < 1) {
      const elapsed = Math.min(maxFrameDelta, Math.max(0, now - fade.timestamp));
      fade.opacity = Math.min(1, fade.opacity + (fadeDuration > 0 ? elapsed / fadeDuration : 1));
      animating = true;
    }
    fade.timestamp = now;

    drawTile(mapContext, cache, z, easeInOut(fade.opacity) * layerAlpha);
  }

  pruneFadeStates();

  // Publish what was just painted, stand-ins included. The loader will not evict these, and
  // it defers its own trimming while a frame is still queued.
  mapLoader.protect(protectedTileKeys);

  // Remember the viewport this frame was painted with, so it can be re-projected correctly
  // if it turns out to be the last frame before a layer swap.
  paintedCenter = { lon: mapTileController.center.lon, lat: mapTileController.center.lat };
  paintedZoom = mapTileController.zoom;

  if (animating) requestFrame();
}

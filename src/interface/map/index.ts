import { querySize } from '..';
import { MapLoader, MapLoaderResponse } from '../../data/map';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { MapTileController, TileInfo } from '../../tools/tile-controller';

const mapField = documentQuerySelector('.css_map_field');
const mapCanvas = elementQuerySelector(mapField, '.css_map_canvas') as HTMLCanvasElement;
const mapContext = mapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

/**
 * Offscreen buffer holding the incoming zoom layer during a cross-fade. Compositing
 * the layer as a single unit keeps every tile at the same opacity, so the swap does
 * not look like a patchwork of tiles fading at different rates.
 */
const layerCanvas = document.createElement('canvas');
const layerContext = layerCanvas.getContext('2d') as CanvasRenderingContext2D;

const overzoom = 2;
const bounds = [120.886, 24.8, 122.004, 25.3];

let width = window.innerWidth;
let height = window.innerHeight;
const devicePixelRatio = window.devicePixelRatio;

/** Duration of the per-tile fade-in while panning, in milliseconds */
const fadeDuration = 200;
/** Duration of the zoom layer cross-fade, in milliseconds */
const crossfadeDuration = 250;
/** How long the outgoing layer may stay on screen if the incoming layer never completes */
const layerBackdropTimeout = 1200;
/** Upper bound of retained fade states before pruning */
const maxFadeStates = 1024;
/** Largest frame delta honoured, so returning from an idle tab does not jump a fade to the end */
const maxFrameDelta = 64;
/** Painted underneath the tiles so fade-ins read as map background rather than a black flash */
const backgroundFill = '#e9e6e1';

const mapLoader = new MapLoader(4, handleTileResponse);

interface TileFadeState {
  opacity: number;
  timestamp: number;
}

/** Fade progress per tile key, used when tiles stream in at a stable zoom level */
const tileFadeStates = new Map<string, TileFadeState>();
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
  centerLon: 121.5435,
  centerLat: 25.0308,
  zoom: 13,
  minZoom: 13,
  maxZoom: 16,
  tileSize: 256,
  onMovementStart: function () {
    requestFrame();
  },
  onMovement: function () {
    // Only repaint while moving. Requests are issued once movement settles.
    requestFrame();
  },
  onMovementEnd: function () {
    synchroniseQueue();
    requestFrame();
  },
  onResize: function () {
    resizeMapCanvas();
    synchroniseQueue();
    requestFrame();
  }
});

export function openMap(): void {
  mapField.setAttribute('displayed', 'true');
  resizeMapCanvas();
  synchroniseQueue();
  requestFrame();
}

export function closeMap(): void {
  mapField.setAttribute('displayed', 'false');
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }
  lastFrameTime = 0;
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
}

function getTileKey(x: number, y: number, z: number): string {
  return `${x}.${y}.${z}`;
}

function handleTileResponse(response: MapLoaderResponse): void {
  // Decoded tiles are painted by the render loop so they can fade in.
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
function synchroniseQueue(): void {
  const z = Math.floor(mapTileController.zoom);
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
    if (mapLoader.get(tile.x, tile.y, tile.z)) continue;
    mapLoader.enqueue(tile.x, tile.y, tile.z);
    enqueued++;
  }

  if (enqueued > 0) mapLoader.consume();
}

/**
 * Snaps a tile to whole device pixels on every edge. Neighbouring tiles share
 * their geographic edge, so both round to the same device pixel and no seam is
 * left between them.
 */
function drawTile(context: CanvasRenderingContext2D, response: MapLoaderResponse, z: number, alpha: number): void {
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

  const z = Math.floor(mapTileController.zoom);

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
      const cache = mapLoader.get(tile.x, tile.y, backdropZ);
      if (cache) drawTile(mapContext, cache, backdropZ, 1);
    }

    crossfadeProgress = Math.min(1, crossfadeProgress + (crossfadeDuration > 0 ? delta / crossfadeDuration : 1));

    layerContext.clearRect(0, 0, width, height);
    for (const tile of visibleTiles) {
      const cache = mapLoader.get(tile.x, tile.y, z);
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
      const cache = mapLoader.get(tile.x, tile.y, z);
      if (!cache) {
        layerComplete = false;
        continue;
      }

      const key = getTileKey(tile.x, tile.y, z);
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
    requestFrame();
  } else {
    lastFrameTime = 0;
  }
}

import { Camera } from '../../tools/camera';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { Gestures } from '../../tools/gestures';
import { LabelEngine } from './labels';
import { clear, drawLabels, drawRasters, resizeCanvas } from './render';
import { TileManager } from './tiles';

/*
 * Every tunable value lives here as a single const object at the top of the
 * script, so nothing downstream carries a magic number. Values are grouped by
 * concern: zoom range, the data box, cache sizes and interaction.
 */

export interface MapConfig {
  tileSize: number;
  minZoom: number;
  /** deepest zoom that actually has tiles */
  maxZoom: number;
  /** how far the camera may zoom past maxZoom, scaling the deepest tiles up */
  overzoom: number;
  /** zoom range for which label tiles exist; outside it the nearest level is reused */
  labelMinZoom: number;
  labelMaxZoom: number;
  /** data box [west, south, east, north]; tiles outside are never requested */
  bounds: [number, number, number, number] | null;
  /** clamp the camera to `bounds` */
  constrainToBounds: boolean;
  center: [number, number];
  zoom: number;
  /** max concurrent in-flight requests across the worker */
  concurrency: number;
  /** minimum raster LRU cache size in tiles; grown at runtime to fit the viewport */
  rasterCacheSize: number;
  /** minimum label LRU cache size in tiles; grown at runtime to fit the viewport */
  labelCacheSize: number;
  /** label fade duration, ms */
  fadeDuration: number;
  /** most labels the placement engine keeps on screen at once */
  maxLabels: number;
  /** cap the device pixel ratio so retina canvases stay affordable to redraw */
  maxDevicePixelRatio: number;
  /** touchpad/wheel scroll: "auto" = touchpad pans + wheel zooms, or force "zoom"/"pan" */
  wheelBehavior: 'auto' | 'zoom' | 'pan';
}

const config: MapConfig = {
  tileSize: 128,
  minZoom: 13,
  // deepest level that exists; the camera can still zoom 2 more (overzoom)
  maxZoom: 16,
  overzoom: 2,
  labelMinZoom: 14,
  labelMaxZoom: 15,
  // no requests are ever made outside this box
  bounds: [120.886, 24.8, 122.004, 25.3],
  center: [121.5435, 25.0308],
  zoom: 13,
  constrainToBounds: true,
  labelCacheSize: 16,
  rasterCacheSize: 16,
  concurrency: 8,
  fadeDuration: 160,
  maxLabels: 64,
  maxDevicePixelRatio: 2,
  wheelBehavior: 'auto'
};

/*
 * The field, canvas and drawing context are looked up once and kept constant
 * for the whole lifetime of the page. Nothing here is ever created, removed or
 * re-selected on the fly, so the map can be paused and resumed freely.
 */

const mapField = documentQuerySelector('.css_map_field');
const mapCanvas = elementQuerySelector(mapField, '.css_map_canvas') as HTMLCanvasElement;
const mapContext = mapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

// One module worker serves every tile request (see tiles.ts for why one is enough).
const worker = new Worker(new URL('./worker.ts', import.meta.url));

// Effective device pixel ratio, clamped so 3x/4x screens don't tank redraw cost.
const pixelRatio = Math.min(config.maxDevicePixelRatio, window.devicePixelRatio || 1);

// The single viewer instance. Created lazily on first open, then reused forever.
let mapViewer: MapViewerHandle | null = null;

export interface MapViewerHandle {
  camera: Camera;
  invalidate: () => void;
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  /** stop the render loop while the map is hidden; all state is retained */
  pause: () => void;
  /** restart the render loop when the map is shown again */
  resume: () => void;
}

/**
 * Build the one-and-only map viewer: wires up the camera, tile manager, label
 * engine, gestures and the requestAnimationFrame render loop. Called a single
 * time; afterwards the viewer is paused/resumed rather than rebuilt.
 */
function createMapViewer(): MapViewerHandle {
  const camera = new Camera({
    center: config.center,
    zoom: config.zoom,
    minZoom: config.minZoom,
    // the camera may go past the deepest tile level; tiles.ts scales those up
    maxZoom: config.maxZoom + config.overzoom,
    tileSize: config.tileSize,
    maxBounds: config.constrainToBounds ? config.bounds : null
  });
  camera.resize(mapField.clientWidth, mapField.clientHeight);

  // `needsRedraw` forces at least one paint; invalidate() is the single entry
  // point everything (gestures, tile loads, resizes) uses to ask for a frame.
  let needsRedraw = true;
  const invalidate = (): void => {
    needsRedraw = true;
  };

  const tiles = new TileManager(config, invalidate, worker);
  const labels = new LabelEngine({
    fadeDuration: config.fadeDuration,
    maxLabels: config.maxLabels
  });
  const gestures = new Gestures({
    camera,
    element: mapCanvas,
    onChange: invalidate,
    wheelBehavior: config.wheelBehavior
  });
  // TODO: add zoom control buttons

  let lastFrameTime = 0;
  let frameCount = 0;
  let animationFrameId = 0;
  let paused = false;

  // 'l' toggles labels
  const handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'l') {
      labels.enabled = !labels.enabled;
      invalidate();
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  const resizeObserver = new ResizeObserver(() => {
    // keep the shared viewport metrics fresh, then re-fit the canvas backing store
    if (resizeCanvas(mapCanvas, camera, config.maxDevicePixelRatio)) {
      // adapt the size of tile caches to the new viewport so a large screen never evicts still-visible tiles and re-fetches them every frame
      tiles.resizeCaches(camera);
      invalidate();
    }
  });
  resizeObserver.observe(mapField);
  resizeCanvas(mapCanvas, camera, config.maxDevicePixelRatio);
  // size the caches for the initial viewport before the first frame
  tiles.resizeCaches(camera);

  mapContext.textAlign = 'center';
  mapContext.textBaseline = 'middle';
  mapContext.lineJoin = 'round';
  mapContext.miterLimit = 2;

  const renderFrame = (now: number): void => {
    animationFrameId = requestAnimationFrame(renderFrame);
    const deltaTime = lastFrameTime ? now - lastFrameTime : 8;
    lastFrameTime = now;
    // skip the whole frame when nothing changed and nothing is animating
    const animating = gestures.update(now);
    if (!needsRedraw && !animating && !labels.animating) return;
    needsRedraw = false;
    frameCount++;

    const frameTiles = tiles.update(camera);
    clear(mapContext, camera, pixelRatio);
    drawRasters(mapContext, frameTiles.rasters, pixelRatio);
    const placedLabels = labels.update(mapContext, camera, frameTiles.labels, deltaTime, frameCount);
    drawLabels(mapContext, placedLabels);
  };
  animationFrameId = requestAnimationFrame(renderFrame);

  /*
   * The viewer is created once and kept alive. Closing the map only *pauses*
   * the render loop (and drops any momentum) so reopening is instant. The
   * canvas, worker, gestures and observer are never torn down.
   */
  const pause = (): void => {
    if (paused) return;
    paused = true;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
    gestures.stop(); // drop inertia / zoom easing so it doesn't resume mid-fling
  };

  const resume = (): void => {
    if (!paused) return;
    paused = false;
    lastFrameTime = 0;
    invalidate();
    animationFrameId = requestAnimationFrame(renderFrame);
  };

  return {
    camera,
    invalidate,
    flyTo(lng, lat, zoom) {
      camera.setCenter(lng, lat);
      if (zoom !== undefined) camera.zoomTo(zoom);
      invalidate();
    },
    pause,
    resume
  };
}

/** Show the map, creating the viewer on first open and resuming it thereafter. */
export function openMap(): void {
  mapField.setAttribute('displayed', 'true');
  if (mapViewer) mapViewer.resume();
  else mapViewer = createMapViewer();
}

/** Hide the map and pause its render loop; the viewer instance is kept for reuse. */
export function closeMap(): void {
  mapField.setAttribute('displayed', 'false');
  mapViewer?.pause();
}

import { querySize } from '..';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { Camera } from './camera';
import { Gestures } from './gestures';
import { LabelEngine, PlacedLabel } from './labels';
import { clear, drawDebug, drawLabels, drawRasters, resizeCanvas } from './render';
import { FrameTiles, TileManager } from './tiles';

const Field = documentQuerySelector('.css_map_field');
const MapCanvas = elementQuerySelector(Field, '.css_map_canvas') as HTMLCanvasElement;
const MapCanvasContext = MapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

const worker = new Worker(new URL('./worker.ts', import.meta.url));

let initialized = false;
let windowWidth = 0;
let windowHeight = 0;

const dpr = Math.min(2, window.devicePixelRatio || 1);

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
  /** max concurrent in-flight requests across all workers */
  concurrency: number;
  /** LRU sizes (tile count) */
  rasterCacheSize: number;
  labelCacheSize: number;
  /** label fade duration, ms */
  fadeDuration: number;
  /** touchpad/wheel scroll: "auto" = touchpad pans + wheel zooms, or force "zoom"/"pan" */
  wheelBehavior: 'auto' | 'zoom' | 'pan';
  debug: boolean;
}

const config: MapConfig = {
  tileSize: 128,
  minZoom: 13,
  // deepest level that exists; the camera can still zoom 2 more (overzoom)
  maxZoom: 16,
  overzoom: 2,
  labelMinZoom: 11,
  labelMaxZoom: 14,
  // no requests are ever made outside this box
  bounds: [120.886, 24.8, 122.004, 25.3],
  center: [121.5435, 25.0308],
  zoom: 13,
  constrainToBounds: true,
  labelCacheSize: 300,
  rasterCacheSize: 400,
  concurrency: 8,
  fadeDuration: 160,
  wheelBehavior: 'auto',
  debug: true
};

export interface MapViewerHandle {
  camera: Camera;
  invalidate: () => void;
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  destroy: () => void;
}

export function initializeMapViewer(): MapViewerHandle {
  const camera = new Camera({
    center: config.center,
    zoom: config.zoom,
    minZoom: config.minZoom,
    // the camera may go past the deepest tile level; tiles.ts scales those up
    maxZoom: config.maxZoom + config.overzoom,
    tileSize: config.tileSize,
    maxBounds: config.constrainToBounds ? config.bounds : null
  });
  camera.resize(Field.clientWidth, Field.clientHeight);

  let dirty = true;
  const invalidate = (): void => {
    dirty = true;
  };

  const tiles = new TileManager(config, invalidate, worker);
  const labels = new LabelEngine({ fadeDuration: config.fadeDuration });
  const gestures = new Gestures({
    camera,
    element: MapCanvas,
    onChange: invalidate,
    wheelBehavior: config.wheelBehavior
  });
  // TODO: control bu   tton

  let debug = config.debug;
  let lastTime = 0;
  let frame = 0;
  let lastFrames: FrameTiles | null = null;
  let lastLabels: PlacedLabel[] = [];
  let fps = 0;
  let raf = 0;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'd') {
      debug = !debug;
      invalidate();
    } else if (e.key === 'l') {
      labels.enabled = !labels.enabled;
      invalidate();
    }
  });

  /* --------------------------------------------------------------- resize */
  const observer = new ResizeObserver(() => {
    const size = querySize('window');
    windowWidth = size.width;
    windowHeight = size.height;
    if (resizeCanvas(MapCanvas, camera)) invalidate();
  });
  observer.observe(Field);
  resizeCanvas(MapCanvas, camera);

  /* ----------------------------------------------------------- the loop */
  const render = (now: number): void => {
    raf = requestAnimationFrame(render);
    const dt = lastTime ? now - lastTime : 16;
    lastTime = now;
    fps = fps ? fps * 0.9 + (1000 / Math.max(1, dt)) * 0.1 : 1000 / Math.max(1, dt);

    const animating = gestures.update(now);
    if (!dirty && !animating && !labels.animating) return;
    dirty = false;
    frame++;

    const frameTiles = tiles.update(camera);
    lastFrames = frameTiles;

    clear(MapCanvasContext, camera, dpr);
    drawRasters(MapCanvasContext, frameTiles.rasters, dpr);
    lastLabels = labels.update(MapCanvasContext, camera, frameTiles.labels, dt, frame);
    drawLabels(MapCanvasContext, lastLabels);
    if (debug) drawDebug(MapCanvasContext, frameTiles.rasters, lastLabels);
  };
  raf = requestAnimationFrame(render);

  return {
    camera,
    invalidate,
    flyTo(lng, lat, zoom) {
      camera.setCenter(lng, lat);
      if (zoom !== undefined) camera.zoomTo(zoom);
      invalidate();
    },
    destroy() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      gestures.destroy();
      tiles.destroy();
      MapCanvas.remove();
    }
  };
}

function initializeMap(): void {
  if (initialized) return;
  initialized = true;
  initializeMapViewer();
}

export function openMap(): void {
  Field.setAttribute('displayed', 'true');
  initializeMap();
}

export function closeMap(): void {
  Field.setAttribute('displayed', 'false');
}

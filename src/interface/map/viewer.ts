import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { Camera } from './camera';
import { Gestures } from './gestures';
import { LabelEngine, PlacedLabel } from './labels';
import { clear, drawDebug, drawLabels, drawRasters, resizeCanvas } from './render';
import { FrameTiles, TileManager } from './tiles';
import { MapConfig, resolveConfig } from './types';

const Field = documentQuerySelector('.css_map_field');
const MapCanvas = elementQuerySelector(Field, '.css_map_canvas') as HTMLCanvasElement;
const MapCanvasContext = MapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

const worker = new Worker(new URL('./worker.ts', import.meta.url));

export interface MapViewerHandle {
  camera: Camera;
  invalidate: () => void;
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  destroy: () => void;
}

export function initializeMapViewer(container: HTMLElement, userConfig: Partial<MapConfig> = {}): MapViewerHandle {
  const cfg = resolveConfig(userConfig);

  const camera = new Camera({
    center: cfg.center,
    zoom: cfg.zoom,
    minZoom: cfg.minZoom,
    // the camera may go past the deepest tile level; tiles.ts scales those up
    maxZoom: cfg.maxZoom + cfg.overzoom,
    tileSize: cfg.tileSize,
    maxBounds: cfg.constrainToBounds ? cfg.bounds : null
  });
  camera.resize(container.clientWidth, container.clientHeight);
  if (location.hash) camera.applyHash(location.hash);

  let dirty = true;
  const invalidate = (): void => {
    dirty = true;
  };

  const tiles = new TileManager(cfg, invalidate, worker);
  const labels = new LabelEngine({ fadeDuration: cfg.fadeDuration });
  const gestures = new Gestures({
    camera,
    element: MapCanvas,
    onChange: invalidate,
    wheelBehavior: cfg.wheelBehavior
  });
  // TODO: control button

  let debug = cfg.debug;
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
    if (resizeCanvas(MapCanvas, camera)) invalidate();
  });
  observer.observe(container);
  resizeCanvas(MapCanvas, camera);

  /* ------------------------------------------------------ permalink hash */
  let hashTimer = 0;
  const scheduleHash = (): void => {
    clearTimeout(hashTimer);
    hashTimer = window.setTimeout(() => {
      history.replaceState(null, '', camera.toHash());
    }, 300);
  };
  window.addEventListener('hashchange', () => {
    if (camera.applyHash(location.hash)) invalidate();
  });

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

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const frameTiles = tiles.update(camera);
    lastFrames = frameTiles;

    clear(MapCanvasContext, camera, dpr);
    drawRasters(MapCanvasContext, frameTiles.rasters, dpr);
    lastLabels = labels.update(MapCanvasContext, camera, frameTiles.labels, dt, frame);
    drawLabels(MapCanvasContext, lastLabels);
    if (debug) drawDebug(MapCanvasContext, frameTiles.rasters, lastLabels);

    scheduleHash();
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

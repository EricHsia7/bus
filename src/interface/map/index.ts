import { MapLoader, MapLoaderResponse } from '../../data/map';
import { drawLabelTiles, LabelTileView } from '../../data/map/label-renderer';
import { drawRouteTiles, RouteTileView } from '../../data/map/route-renderer';
import { VectorPlan } from '../../data/map/vector-plan';
import { renderVectorFrame, resolveVectorFrame, VectorFrameRegion } from '../../data/map/vector-render';
import { MapView, MapViews } from '../../data/map/views';
import { booleanToString } from '../../tools';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { Context2D } from '../../tools/graphic';
import { clamp } from '../../tools/math';
import { MapTileController, TileInfo } from '../../tools/tile-controller';
import { getBlankIconElement, setIcon } from '../icons';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';
import { MapOverlay, MapOverlays } from './overlays';

const Field = documentQuerySelector('.css_map_field');

const LeftButtonElement = elementQuerySelector(Field, '.css_map_button_left');
const RightButtonElement = elementQuerySelector(Field, '.css_map_button_right');

const MapCanvas = elementQuerySelector(Field, '.css_map_canvas') as HTMLCanvasElement;
const MapContext = MapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
const MapOverlayCanvas = elementQuerySelector(Field, '.css_map_overlay') as HTMLCanvasElement;
const MapOverlayContext = MapOverlayCanvas.getContext('2d') as CanvasRenderingContext2D;

const MapPanelContainerElement = elementQuerySelector(Field, '.css_map_panel_container');
const MapPanelElement = elementQuerySelector(MapPanelContainerElement, '.css_map_panel');
const OverlaysElement = elementQuerySelector(MapPanelElement, '.css_map_panel_overlays');
const ViewsElement = elementQuerySelector(MapPanelElement, '.css_map_panel_views');

/**
 * div.css_map_panel_overlay(n) in div.css_map_panel_overlays(1)
 */
const OverlayElements: Array<HTMLElement> = [];
const ViewElements: Array<HTMLElement> = [];

let previousIntegration: MapViews = [];
let currentViewIndex: number = 0;

let width: number = window.innerWidth;
let height: number = window.innerHeight;
let displayed: boolean = false;
const devicePixelRatio = window.devicePixelRatio;

/** Decoded-tile budget handed to the loader's LRU cache, in bytes */
const maxCacheBytes = 96 * 1024 * 1024;
/** Floor of the LRU budget, so small viewports still keep a useful history */
const minCachedTiles = 16;
/** The cache is never trimmed below this multiple of the tiles currently on screen */
const cacheHeadroomFactor = 2;
/** Delay before an eviction pass is attempted once the map goes quiet, in milliseconds */
const evictionIdleDelay = 200;
/** Rasterized-frame budget handed to the loader's frame buffer, in bytes */
const maxFrameBufferBytes = 96 * 1024 * 1024;
/** Floor of the frame budget, so a viewport's worth of frames always survives a trim */
const minBufferedFrames = 16;
/**
 * How many coarser layers may stand in for a tile that has not arrived yet. Three steps
 * is an eighth of the tile's ground per axis, past which the stand-in carries so little
 * detail that the background reads better than a smear.
 */
const maxAncestorFallbackDepth = 3;
/**
 * How far a cached frame's resolution may drift from the wanted one before it is
 * rasterized again. Mid-gesture, letting the compositor stretch a frame by a few percent
 * is much cheaper than re-running the vector pass every animation frame; the settle pass
 * at the end of the movement brings it back to exactly one bitmap pixel per device pixel.
 */
const frameResolutionTolerance = 1.25;
/** Largest frame delta honoured, so returning from an idle tab does not jump a fade to the end */
/** Painted underneath the tiles so fade-ins read as map background rather than a black flash */
const backgroundFill = '#f2f2f7';

const mapLoader = new MapLoader(clamp(Math.floor(Math.log(window.navigator.hardwareConcurrency) / Math.log(2)), 1, 6), handleTileResponse, {
  maxCacheBytes,
  minCachedTiles,
  headroomFactor: cacheHeadroomFactor,
  evictionDelay: evictionIdleDelay,
  maxFrameBufferBytes,
  minBufferedFrames,
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
/**
 * Frame keys painted in the most recent frame. Handed to the loader after each frame so
 * its frame buffer never trims a bitmap that is currently on screen.
 */
const protectedFrameKeys = new Set<string>();
/**
 * Boxes painted this pass, rebuilt every frame. A box is normally a visible tile, but
 * while a zoom-out is still loading it can also be one of the finer tiles left over from
 * before, each of which covers a quarter of its parent.
 */
const frameTargets: Array<TileInfo> = [];
/** Plans handed over by the label workers, cached here for the lifetime of the tile. */
/** Reused every frame so the draw pass allocates nothing. */
const labelTileViews: Array<LabelTileView> = [];
const routeTileViews: Array<RouteTileView> = [];

interface ZoomLayer {
  /** Native zoom level this layer draws its tiles from */
  z: number;
  /** Current fade progress, 0 to 1 */
  opacity: number;
  /** 1 while this layer is the one being shown, 0 while it is being abandoned */
  target: number;
  timestamp: number;
}

/**
 * Zoom layers currently on screen, ordered bottom to top. Every layer below the top is fully
 * opaque and only the topmost one animates, so the composite is always
 * `lower * (1 - alpha) + top * alpha`: a real cross-fade that cannot let the background leak
 * through, and one that is re-derived from live tiles every frame rather than from a frozen
 * copy of an earlier frame.
 */
const layerStack: ZoomLayer[] = [];
/** Native layer requested in the previous frame, used to detect a zoom layer swap */
let activeLayerZ: number | null = null;
let frameId: number | null = null;
/** Set while the next pass must produce frames at exactly the tiles' screen resolution. */
let exactFrameRequested = false;

const mapTileController = new MapTileController({
  element: MapCanvas,
  centerLon: (120.886 + 122.004) / 2,
  centerLat: (24.8 + 25.3) / 2,
  zoom: 16,
  minZoom: 12,
  maxZoom: 19,
  minNativeZoom: 12,
  maxNativeZoom: 17,
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
    // The viewport has stopped, so this is the moment to pay for exact-resolution frames.
    exactFrameRequested = true;
    requestFrame();
    mapLoader.runEviction();
  },
  onResize: function () {
    resizeMapCanvas();
    synchronizeQueue();
    exactFrameRequested = true;
    requestFrame();
  }
});

const mapOverlays = new MapOverlays(
  [
    {
      icon: 'notes',
      name: '標籤',
      visible: true
    },
    {
      icon: 'emoji_transportation',
      name: '路線',
      visible: true
    }
  ],
  OverlayElements, // pass the reference
  requestFrame
);

export function focusMapOn(lon: number, lat: number, zoom: number, duration: number = 500): void {
  mapTileController.focusOn(lon, lat, zoom, duration);
}

export function fitMapTo(west: number, south: number, east: number, north: number, duration: number = 500): void {
  mapTileController.fitTo(west, south, east, north, 50, duration);
}

export function showMapPanel(): void {
  MapPanelContainerElement.setAttribute('displayed', 'true');
  MapPanelElement.addEventListener(
    'animationend',
    function () {
      MapPanelElement.classList.add('css_map_panel_popped_in');
      MapPanelElement.classList.remove('css_map_panel_pop_in');
    },
    { once: true }
  );
  MapPanelElement.classList.add('css_map_panel_pop_in');
}

export function hideMapPanel(): void {
  MapPanelElement.addEventListener(
    'animationend',
    function () {
      MapPanelContainerElement.setAttribute('displayed', 'false');
      MapPanelElement.classList.remove('css_map_panel_pop_out');
    },
    { once: true }
  );
  MapPanelElement.classList.remove('css_map_panel_popped_in');
  MapPanelElement.classList.add('css_map_panel_pop_out');
}

export function toggleMapPanel(): void {
  const displayed = MapPanelContainerElement.getAttribute('displayed') === 'true';
  if (displayed) {
    hideMapPanel();
  } else {
    showMapPanel();
  }
}

export function initializeMapPanelEvents(): void {
  MapPanelContainerElement.addEventListener('pointerdown', function (event) {
    const target = event.target as HTMLElement;
    if (target !== MapPanelContainerElement) return;
    hideMapPanel();
  });

  LeftButtonElement.addEventListener('click', function () {
    closeMap();
  });

  RightButtonElement.addEventListener('click', function () {
    toggleMapPanel();
  });
}

export function resizeMapCanvas(): void {
  const size = querySize('window');
  width = size.width;
  height = size.height;

  MapCanvas.width = width * devicePixelRatio;
  MapCanvas.height = height * devicePixelRatio;
  MapOverlayCanvas.width = width * devicePixelRatio;
  MapOverlayCanvas.height = height * devicePixelRatio;

  // Resetting the backing store drops the transform, so re-apply it here.
  MapContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  MapOverlayContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function getTileKey(x: number, y: number, z: number): string {
  return `${x}.${y}.${z}`;
}

function handleTileResponse(response: MapLoaderResponse): void {
  // The loader has already cached the decoded tile. Rasterizing happens in the render
  // loop rather than here, so a burst of arrivals costs one vector pass per tile per
  // frame instead of one per message, and every frame is produced for the viewport that
  // is about to be drawn rather than the one that was current when the message landed.
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
function drawTileRegion(context: Context2D, bitmap: ImageBitmap, destX: number, destY: number, destZ: number, source: { x: number; y: number; width: number; height: number } | null): void {
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

  if (source) {
    context.drawImage(bitmap as CanvasImageSource, source.x, source.y, source.width, source.height, left, top, tileWidth, tileHeight);
  } else {
    context.drawImage(bitmap as CanvasImageSource, left, top, tileWidth, tileHeight);
  }
}

/** A plan standing in for a tile box, and which part of that plan covers the box. */
interface FrameSource {
  plan: VectorPlan;
  x: number;
  y: number;
  z: number;
  region: VectorFrameRegion | null;
}

/**
 * Picks the plan that should be rasterized for a tile box. The tile's own plan wins;
 * while it is still loading the nearest coarser ancestor already in the cache stands in,
 * contributing the sub-square of itself that covers exactly this box.
 */
function findFrameSource(x: number, y: number, z: number): FrameSource | null {
  // peek, not get: choosing a source is not drawing it, so the LRU order is left alone
  // until the source is actually rasterized.
  const exact = mapLoader.peek(x, y, z);
  if (exact) return { plan: exact.vector, x, y, z, region: null };

  const minZ = Math.max(mapTileController.minNativeZoom, z - maxAncestorFallbackDepth);
  for (let sourceZ = z - 1; sourceZ >= minZ; sourceZ--) {
    const step = z - sourceZ;
    const sourceX = x >> step;
    const sourceY = y >> step;
    const ancestor = mapLoader.peek(sourceX, sourceY, sourceZ);
    if (!ancestor) continue;
    const size = Math.pow(2, -step);
    return {
      plan: ancestor.vector,
      x: sourceX,
      y: sourceY,
      z: sourceZ,
      region: { x: (x - (sourceX << step)) * size, y: (y - (sourceY << step)) * size, size }
    };
  }

  return null;
}

/**
 * Rebuilds the list of boxes this pass paints. Normally one box per visible tile, but a
 * tile with nothing to stand in for it falls back the other way: right after a zoom-out
 * the finer tiles are the ones still cached, and each covers a quarter of the box.
 * Coverage can be partial there, which reads as background in the gaps.
 */
function collectFrameTargets(): void {
  frameTargets.length = 0;

  const visibleTiles = mapTileController.getVisibleTiles();
  for (const tile of visibleTiles) {
    if (findFrameSource(tile.x, tile.y, tile.z) || mapLoader.peekFrame(tile.x, tile.y, tile.z)) {
      frameTargets.push(tile);
      continue;
    }

    if (tile.z >= mapTileController.maxNativeZoom) continue;
    const childZ = tile.z + 1;
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        const childX = tile.x * 2 + dx;
        const childY = tile.y * 2 + dy;
        if (!mapLoader.peek(childX, childY, childZ) && !mapLoader.peekFrame(childX, childY, childZ)) continue;
        frameTargets.push(mapTileController.getTileBoundingBox(childX, childY, childZ));
      }
    }
  }
}

function isFrameResolutionAcceptable(frame: { width: number; height: number }, wantedWidth: number, wantedHeight: number, exact: boolean): boolean {
  if (frame.width === wantedWidth && frame.height === wantedHeight) return true;
  if (exact) return false;
  const drift = Math.max(wantedWidth / frame.width, frame.width / wantedWidth, wantedHeight / frame.height, frame.height / wantedHeight);
  return drift <= frameResolutionTolerance;
}

function updateFrame(tile: TileInfo, exact: boolean): void {
  const source = findFrameSource(tile.x, tile.y, tile.z);
  if (!source) return;

  // Whatever is painted has to survive the next eviction pass, even when the existing
  // frame is reused unchanged: the plan is what makes that frame reproducible.
  protectedTileKeys.add(getTileKey(source.x, source.y, source.z));

  const wantedWidth = Math.max(1, Math.floor((tile.screenBBox.maxX - tile.screenBBox.minX) * devicePixelRatio));
  const wantedHeight = Math.max(1, Math.floor((tile.screenBBox.maxY - tile.screenBBox.minY) * devicePixelRatio));

  // The offset is whichever one the plan ships closest to the view zoom, clamped into
  // [zoom, zoom + 1]: a stand-in ancestor used past its own octave saturates at the last
  // frame it ships instead of having its widths extrapolated beyond the interval.
  const { frameIndex, deltaZoom } = resolveVectorFrame(source.plan, mapTileController.zoom);

  const existing = mapLoader.peekFrame(tile.x, tile.y, tile.z);
  // Resolution and styling offset are compared separately, because they do not move
  // together. A changed fractional zoom always changes the render size, so the bitmap has
  // to be produced again to stay pixel-exact; but the clamped offset it was styled for can
  // legitimately be unchanged across that re-raster, once the viewport has left the plan's
  // octave. Recording both also catches what a size comparison alone would miss: a
  // stand-in ancestor being replaced by the tile's own geometry at the very same size.
  if (existing && existing.sourceZ === source.z && existing.frameIndex === frameIndex && isFrameResolutionAcceptable(existing, wantedWidth, wantedHeight, exact)) return;

  // Now the plan is really being read, so it counts as recently used.
  mapLoader.get(source.x, source.y, source.z);

  const bitmap = renderVectorFrame(source.plan, {
    width: wantedWidth,
    height: wantedHeight,
    region: source.region,
    deltaZoom
  });

  mapLoader.pushFrame(tile.x, tile.y, tile.z, bitmap, { sourceZ: source.z, frameIndex, deltaZoom });
}

function updateVisibleFrames(exact: boolean = false): void {
  for (const tile of frameTargets) {
    updateFrame(tile, exact);
  }
}

function drawTiles(): void {
  for (const tile of frameTargets) {
    const frame = mapLoader.getFrame(tile.x, tile.y, tile.z);
    if (!frame) continue;
    drawTileRegion(MapContext, frame.bitmap, tile.x, tile.y, tile.z, null);
    protectedFrameKeys.add(getTileKey(tile.x, tile.y, tile.z));
  }
}

function drawOverlay(): void {
  MapOverlayContext.clearRect(0, 0, width, height);
  labelTileViews.length = 0;
  routeTileViews.length = 0;

  const z = mapTileController.getNativeZoom();
  const visibleTiles = mapTileController.getVisibleTiles(z);
  for (const tile of visibleTiles) {
    const { x, y, z } = tile;
    const cached = mapLoader.get(x, y, z);
    if (!cached) continue;
    // Labels and routes are drawn straight from the plan, so those plans are on screen
    // just as much as the rasterized ones and must be protected too.
    protectedTileKeys.add(getTileKey(x, y, z));
    labelTileViews.push({ plan: cached.label, screenBBox: tile.screenBBox });
    routeTileViews.push({ plan: cached.route, screenBBox: tile.screenBBox });
  }

  if (routeTileViews.length > 0 && mapOverlays.overlays[1].visible) {
    drawRouteTiles(MapOverlayContext, routeTileViews, {
      zoom: mapTileController.zoom,
      devicePixelRatio,
      selectedRoutes: previousIntegration[currentViewIndex]?.selection
    });
  }

  if (labelTileViews.length > 0 && mapOverlays.overlays[0].visible) {
    drawLabelTiles(MapOverlayContext, labelTileViews, {
      zoom: mapTileController.zoom,
      width,
      height,
      devicePixelRatio
    });
  }
}

function renderFrame(now: number): void {
  frameId = null;

  const nativeZoom = mapTileController.getNativeZoom();
  // Rebuilt every frame: what is painted below is exactly what the loader must keep.
  protectedTileKeys.clear();
  protectedFrameKeys.clear();

  if (activeLayerZ !== null && activeLayerZ !== nativeZoom) synchronizeQueue();
  activeLayerZ = nativeZoom;

  // Both passes run unconditionally. Which plan stands in for which box can change
  // without the viewport moving at all (a tile finishes loading), and the render size
  // changes whenever the fractional zoom does. Each is a no-op when nothing it depends on
  // changed, so the cost of asking every frame is a peek and a size comparison per box.
  collectFrameTargets();
  updateVisibleFrames(exactFrameRequested);
  exactFrameRequested = false;

  MapContext.fillStyle = backgroundFill;
  MapContext.fillRect(0, 0, width, height);

  drawTiles();

  drawOverlay();

  mapLoader.protect(protectedTileKeys);
  mapLoader.protectFrames(protectedFrameKeys);
}

function generateItemOfOverlay(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_map_panel_overlay');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_map_panel_overlay_icon');
  iconElement.appendChild(getBlankIconElement());
  element.appendChild(iconElement);

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_map_panel_overlay_name');
  element.appendChild(nameElement);

  return element;
}

function generateItemOfView(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_map_panel_view');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_map_panel_view_icon');
  iconElement.appendChild(getBlankIconElement());
  element.appendChild(iconElement);

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_map_panel_view_name');
  element.appendChild(nameElement);

  return element;
}

function updateMapField(overlays: Array<MapOverlay>, integration: MapViews): void {
  function updateOverlay(thisElement: HTMLElement, thisItem: MapOverlay, index: number): void {
    function updateIcon(thisElement: HTMLElement, thisItem: MapOverlay): void {
      const iconElement = elementQuerySelector(thisElement, '.css_map_panel_overlay_icon');
      setIcon(iconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: MapOverlay): void {
      const nameElement = elementQuerySelector(thisElement, '.css_map_panel_overlay_name');
      nameElement.textContent = thisItem.name;
    }

    function updateHighlighted(thisElement: HTMLElement, thisItem: MapOverlay): void {
      thisElement.setAttribute('highlighted', booleanToString(thisItem.visible));
    }

    function updateOnclick(thisElement: HTMLElement, index: number): void {
      thisElement.onclick = function () {
        mapOverlays.toggle(index);
      };
    }

    updateIcon(thisElement, thisItem);
    updateName(thisElement, thisItem);
    updateHighlighted(thisElement, thisItem);
    updateOnclick(thisElement, index);
  }

  function updateView(thisElement: HTMLElement, thisItem: MapView, index: number): void {
    function updateIcon(thisElement: HTMLElement, thisItem: MapView): void {
      const iconElement = elementQuerySelector(thisElement, '.css_map_panel_view_icon');
      setIcon(iconElement, thisItem.icon);
    }

    function updateName(thisElement: HTMLElement, thisItem: MapView): void {
      const nameElement = elementQuerySelector(thisElement, '.css_map_panel_view_name');
      nameElement.textContent = thisItem.name;
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: MapView, index: number): void {
      switch (thisItem.type) {
        case 'point':
          thisElement.onclick = function () {
            mapTileController.focusOn(thisItem.centerLon, thisItem.centerLat, 17, 500);
            mapOverlays.show(thisItem.sources);
            currentViewIndex = index;
            hideMapPanel();
          };
          break;
        case 'box':
          thisElement.onclick = function () {
            mapTileController.fitTo(thisItem.minLon, thisItem.minLat, thisItem.maxLon, thisItem.maxLat, 50, 500);
            mapOverlays.show(thisItem.sources);
            currentViewIndex = index;
            hideMapPanel();
          };
          break;
        default:
          thisElement.onclick = null;
          break;
      }
    }

    updateIcon(thisElement, thisItem);
    updateName(thisElement, thisItem);
    updateOnclick(thisElement, thisItem, index);
  }

  const overlaysLength = overlays.length;
  const overlayElementsLength = OverlayElements.length;

  if (overlaysLength !== overlayElementsLength) {
    const difference = overlayElementsLength - overlaysLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newOverlayElement = generateItemOfOverlay();
        fragment.appendChild(newOverlayElement);
        OverlayElements.push(newOverlayElement);
      }
      OverlaysElement.append(fragment);
    } else if (difference > 0) {
      for (let p = overlayElementsLength - 1, q = overlayElementsLength - difference - 1; p > q; p--) {
        OverlayElements[p].remove();
        OverlayElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < overlaysLength; i++) {
    updateOverlay(OverlayElements[i], overlays[i], i);
  }

  const viewsLength = integration.length;
  const viewElementsLength = ViewElements.length;

  if (viewsLength !== viewElementsLength) {
    const difference = viewElementsLength - viewsLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newViewElement = generateItemOfView();
        fragment.appendChild(newViewElement);
        ViewElements.push(newViewElement);
      }
      ViewsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = viewElementsLength - 1, q = viewElementsLength - difference - 1; p > q; p--) {
        ViewElements[p].remove();
        ViewElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < viewsLength; i++) {
    updateView(ViewElements[i], integration[i], i);
  }

  // TODO: differential update

  previousIntegration = integration;
}

export function showMap(): void {
  Field.setAttribute('displayed', 'true');
  displayed = true;
}

export function hideMap(): void {
  Field.setAttribute('displayed', 'false');
  displayed = false;
}

function initializeMap(integration: MapViews): void {
  resizeMapCanvas();
  synchronizeQueue();
  requestFrame();
  showFirstMapView(integration);
  updateMapField(mapOverlays.overlays, integration);
}

export function openMap(integration: MapViews): void {
  pushPageHistory('Map');
  showMap();
  initializeMap(integration);
  hidePreviousPage();
}

export function closeMap(): void {
  hideMap();
  showPreviousPage();
  revokePageHistory('Map');
  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }

  // Reopening should show the current viewport straight away rather than replay a cross-fade against a layer that left the screen long ago.
  activeLayerZ = null;
  exactFrameRequested = true;
  frameTargets.length = 0;

  // Nothing is on screen any more, so nothing needs protecting and the loader can trim straight down to its budget.
  protectedTileKeys.clear();
  protectedFrameKeys.clear();
  mapLoader.protect(protectedTileKeys);
  mapLoader.protectFrames(protectedFrameKeys);
  mapLoader.trim();
  // Frames are cheap to produce again from the retained plans and are sized for a
  // viewport that is no longer visible, so the whole buffer goes rather than a trim.
  mapLoader.clearFrameBuffer(true);
  MapOverlayContext.clearRect(0, 0, width, height);
}

function showFirstMapView(integration: MapViews): void {
  if (integration.length > 0) {
    const firstView = integration[0];
    switch (firstView.type) {
      case 'point':
        mapTileController.focusOn(firstView.centerLon, firstView.centerLat, 17, 500);
        break;
      case 'box':
        mapTileController.fitTo(firstView.minLon, firstView.minLat, firstView.maxLon, firstView.maxLat, 50, 500);
        break;
      default:
        break;
    }
    currentViewIndex = 0;
    mapOverlays.show(firstView.sources);
  }
}

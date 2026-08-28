import { MapLoader, MapLoaderResponse } from '../../data/map';
import { drawLabelTiles, LabelTileView } from '../../data/map/label-renderer';
import { drawRouteTiles, RouteTileView } from '../../data/map/route-renderer';
import { VectorRenderer, VectorTileView } from '../../data/map/vector-render';
import { MapView, MapViews } from '../../data/map/views';
import { booleanToString } from '../../tools';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { MapTileController, TileInfo } from '../../tools/tile-controller';
import { getBlankIconElement, setIcon } from '../icons';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';
import { MapOverlay, MapOverlays } from './overlays';

const Field = documentQuerySelector('.css_map_field');

const LeftButtonElement = elementQuerySelector(Field, '.css_map_button_left');
const RightButtonElement = elementQuerySelector(Field, '.css_map_button_right');

const MapCanvas = elementQuerySelector(Field, '.css_map_canvas') as HTMLCanvasElement;
// const MapContext = MapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
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
const maxCacheBytes = 256 * 1024 * 1024;
/** Floor of the LRU budget, so small viewports still keep a useful history */
const minCachedTiles = 16;
/** The cache is never trimmed below this multiple of the tiles currently on screen */
const cacheHeadroomFactor = 2;
/** Delay before an eviction pass is attempted once the map goes quiet, in milliseconds */
const evictionIdleDelay = 200;

const vectorTileViews: Array<VectorTileView> = [];

// Tile boxes are handed over in device pixels; the ratio is what scale-dependent styling
// such as stroke width is measured against.
const vectorRenderer = new VectorRenderer(MapCanvas, {
  width: width * devicePixelRatio,
  height: height * devicePixelRatio
});

const mapLoader = new MapLoader(2, handleTileResponse, {
  maxCacheBytes,
  minCachedTiles,
  headroomFactor: cacheHeadroomFactor,
  evictionDelay: evictionIdleDelay,
  // Eviction waits while a frame is queued, so trimming never competes with drawing.
  shouldDeferEviction: () => frameId !== null,
  // The loader owns the bitmap; the renderer only drops the state derived from it.
  onEvict: (key) => {
    vectorRenderer.releaseTile(key);
  }
});

/**
 * Tile keys painted in the most recent frame. Handed to the loader after each frame so its LRU never evicts imagery that is currently on screen.
 */
const protectedTileKeys = new Set<string>();
/** Tile keys already handed to the loader, used to diff visible sets between movements */
const requestedTileKeys = new Set<string>();
/**
 * Frame keys painted in the most recent frame. Handed to the loader after each frame so its frame buffer never trims a bitmap that is currently on screen.
 */

interface FallbackOverlay {
  label: MapLoaderResponse['label'];
  route: MapLoaderResponse['route'];
  /** Box the plan's own geometry is laid out against, in CSS pixels. */
  screenBBox: TileInfo['screenBBox'];
  /** Boxes this plan stands in for. Drawing is clipped to their union. */
  boxes: Array<TileInfo['screenBBox']>;
}

/**
 * Stand-in plans whose labels and routes are drawn this frame, keyed by tile. A plan is
 * drawn once however many boxes it covers, and only inside those boxes.
 */
const fallbackOverlays = new Map<string, FallbackOverlay>();
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

/** Native layer requested in the previous frame, used to detect a zoom layer swap */
let activeLayerZ: number | null = null;
let frameId: number | null = null;
/** Set while the next pass must produce frames at exactly the tiles' screen resolution. */

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
    requestFrame();
    mapLoader.runEviction();
  },
  onResize: function () {
    resizeMapCanvas();
    synchronizeQueue();
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

  vectorRenderer.width = width * devicePixelRatio;
  vectorRenderer.height = height * devicePixelRatio;

  MapOverlayCanvas.width = width * devicePixelRatio;
  MapOverlayCanvas.height = height * devicePixelRatio;

  // Resetting the backing store drops the transform, so re-apply it here.
  // MapContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
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
  const nativeZoom = mapTileController.getNativeZoom();
  const visibleTiles = mapTileController.getVisibleTiles(nativeZoom);

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

  // Requests only. Building views here raced renderFrame: it published a different set to
  // the renderer (with no stand-ins, and skipping every already-requested tile), and
  // whichever ran last decided what was resident on the GPU.
  let enqueued = 0;
  for (const tile of visibleTiles) {
    const { x, y, z } = tile;
    const key = getTileKey(x, y, z);
    if (requestedTileKeys.has(key)) continue;
    requestedTileKeys.add(key);

    // A cached tile needs no request. `peek` leaves the LRU order alone, which is
    // renderFrame's business: it marks what it actually paints.
    if (mapLoader.peek(x, y, z)) continue;

    mapLoader.enqueue(x, y, z);
    enqueued++;
  }

  if (enqueued > 0) mapLoader.consume();
}

/** Deepest ancestor, and finest descendant, searched for a stand-in plan. */
const maxFallbackDepth = mapTileController.maxNativeZoom - mapTileController.minNativeZoom;

interface FallbackTile {
  key: string;
  response: MapLoaderResponse;
  /** Box the stand-in's labels and routes are drawn against, in CSS pixels. */
  screenBBox: TileInfo['screenBBox'];
  view: VectorTileView;
}

/**
 * Finds cached geometry to stand in for a tile that has not arrived yet.
 *
 * Choosing a stand-in needs the cache, not just the zoom ranges. Coarser ancestors are
 * preferred because a single one covers the whole box, drawn through `region` as a
 * sub-square of the ancestor's geometry. Failing that, finer descendants left over from a
 * zoom-out each paint their own share of the box.
 */
function resolveFallbackTiles(tile: TileInfo): Array<FallbackTile> {
  const { x, y, z } = tile;
  const boxX = tile.screenBBox.minX * devicePixelRatio;
  const boxY = tile.screenBBox.minY * devicePixelRatio;
  const boxSize = (tile.screenBBox.maxX - tile.screenBBox.minX) * devicePixelRatio;
  const fallbacks: Array<FallbackTile> = [];

  // Coarser ancestor: full coverage from one plan, so the nearest one wins outright.
  for (let depth = 1; depth <= maxFallbackDepth; depth++) {
    const ancestorZ = z - depth;
    if (ancestorZ < mapTileController.minNativeZoom) break;

    const span = Math.pow(2, depth);
    const ancestorX = Math.floor(x / span);
    const ancestorY = Math.floor(y / span);
    const cached = mapLoader.get(ancestorX, ancestorY, ancestorZ);
    if (!cached) continue;

    const key = getTileKey(ancestorX, ancestorY, ancestorZ);
    fallbacks.push({
      key,
      response: cached,
      screenBBox: mapTileController.getTileBoundingBox(ancestorX, ancestorY, ancestorZ).screenBBox,
      view: {
        key,
        plan: cached.vector,
        // The box is this tile's own, filled by the slice of the ancestor covering it.
        x: boxX,
        y: boxY,
        size: boxSize,
        region: {
          x: (x - ancestorX * span) / span,
          y: (y - ancestorY * span) / span,
          size: 1 / span
        }
      }
    });
    return fallbacks;
  }

  // Finer descendants: coverage may be partial, so take the first depth that has any.
  for (let depth = 1; depth <= maxFallbackDepth; depth++) {
    const descendantZ = z + depth;
    if (descendantZ > mapTileController.maxNativeZoom) break;

    const span = Math.pow(2, depth);
    const childSize = boxSize / span;

    for (let row = 0; row < span; row++) {
      for (let column = 0; column < span; column++) {
        const childX = x * span + column;
        const childY = y * span + row;
        const cached = mapLoader.get(childX, childY, descendantZ);
        if (!cached) continue;

        const key = getTileKey(childX, childY, descendantZ);
        fallbacks.push({
          key,
          response: cached,
          screenBBox: mapTileController.getTileBoundingBox(childX, childY, descendantZ).screenBBox,
          view: {
            key,
            plan: cached.vector,
            // A descendant is drawn whole into its own share of the box.
            x: boxX + column * childSize,
            y: boxY + row * childSize,
            size: childSize
          }
        });
      }
    }

    if (fallbacks.length > 0) return fallbacks;
  }

  return fallbacks;
}

function renderFrame(now: number): void {
  frameId = null;

  const nativeZoom = mapTileController.getNativeZoom();
  // Rebuilt every frame: what is painted below is exactly what the loader must keep.
  protectedTileKeys.clear();
  fallbackOverlays.clear();

  if (activeLayerZ !== null && activeLayerZ !== nativeZoom) synchronizeQueue();
  activeLayerZ = nativeZoom;

  // Both passes run unconditionally. Which plan stands in for which box can change
  // without the viewport moving at all (a tile finishes loading), and the render size
  // changes whenever the fractional zoom does. Each is a no-op when nothing it depends on
  // changed, so the cost of asking every frame is a peek and a size comparison per box.

  MapOverlayContext.clearRect(0, 0, width, height);

  vectorTileViews.length = 0;
  labelTileViews.length = 0;
  routeTileViews.length = 0;

  const visibleTiles = mapTileController.getVisibleTiles();
  for (const tile of visibleTiles) {
    const { x, y, z } = tile;
    const cached = mapLoader.get(x, y, z);
    if (cached) {
      // Labels and routes are drawn straight from the plan, so those plans are on screen
      // just as much as the rasterized ones and must be protected too.
      protectedTileKeys.add(getTileKey(x, y, z));
      vectorTileViews.push({
        key: getTileKey(x, y, z),
        plan: cached.vector,
        x: tile.screenBBox.minX * devicePixelRatio,
        y: tile.screenBBox.minY * devicePixelRatio,
        size: (tile.screenBBox.maxX - tile.screenBBox.minX) * devicePixelRatio
      });
      labelTileViews.push({ plan: cached.label, screenBBox: tile.screenBBox });
      routeTileViews.push({ plan: cached.route, screenBBox: tile.screenBBox });
    } else {
      for (const fallback of resolveFallbackTiles(tile)) {
        // A stand-in is on screen, so the loader must keep it as much as a native tile.
        protectedTileKeys.add(fallback.key);
        vectorTileViews.push(fallback.view);

        // Labels and routes are laid out against the stand-in's own box, which is larger
        // than the box being filled, so they have to be clipped to it: an ancestor's
        // sheet otherwise paints over neighbours that already drew their own, doubling
        // every hairline and translucent halo. One ancestor commonly stands in for
        // several boxes, so the boxes accumulate and the plan is drawn once.
        const overlay = fallbackOverlays.get(fallback.key);
        if (overlay) {
          overlay.boxes.push(tile.screenBBox);
          continue;
        }
        fallbackOverlays.set(fallback.key, {
          label: fallback.response.label,
          route: fallback.response.route,
          screenBBox: fallback.screenBBox,
          boxes: [tile.screenBBox]
        });
      }
    }
  }

  // Sync before drawing: this is the only place the full painted set is known, so it is
  // the only place that may decide what stays resident on the GPU.
  vectorRenderer.syncVectorTiles(vectorTileViews);
  vectorRenderer.renderVectorTiles(vectorTileViews, mapTileController.zoom);

  const routesVisible = mapOverlays.overlays[1].visible;
  const labelsVisible = mapOverlays.overlays[0].visible;

  // Stand-ins go down first, so where a stand-in and a native plan cover the same ground
  // the native one paints over it.
  for (const overlay of fallbackOverlays.values()) {
    MapOverlayContext.save();
    MapOverlayContext.beginPath();
    for (const box of overlay.boxes) {
      MapOverlayContext.rect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY);
    }
    MapOverlayContext.clip();

    if (routesVisible) {
      drawRouteTiles(MapOverlayContext, [{ plan: overlay.route, screenBBox: overlay.screenBBox }], {
        zoom: mapTileController.zoom,
        devicePixelRatio,
        selectedRoutes: previousIntegration[currentViewIndex]?.selection
      });
    }

    if (labelsVisible) {
      drawLabelTiles(MapOverlayContext, [{ plan: overlay.label, screenBBox: overlay.screenBBox }], {
        zoom: mapTileController.zoom,
        width,
        height,
        devicePixelRatio
      });
    }

    MapOverlayContext.restore();
  }

  if (routeTileViews.length > 0 && routesVisible) {
    drawRouteTiles(MapOverlayContext, routeTileViews, {
      zoom: mapTileController.zoom,
      devicePixelRatio,
      selectedRoutes: previousIntegration[currentViewIndex]?.selection
    });
  }

  if (labelTileViews.length > 0 && labelsVisible) {
    drawLabelTiles(MapOverlayContext, labelTileViews, {
      zoom: mapTileController.zoom,
      width,
      height,
      devicePixelRatio
    });
  }

  mapLoader.protect(protectedTileKeys);
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
  frameTargets.length = 0;

  // Nothing is on screen any more, so nothing needs protecting and the loader can trim straight down to its budget.
  protectedTileKeys.clear();
  mapLoader.protect(protectedTileKeys);
  mapLoader.trim();
  // Frames are cheap to produce again from the retained plans and are sized for a
  // viewport that is no longer visible, so the whole buffer goes rather than a trim.
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

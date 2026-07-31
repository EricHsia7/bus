export interface Point {
  x: number;
  y: number;
}

export interface WGS84 {
  lon: number;
  lat: number;
}

export interface BoundingBoxWGS84 {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export interface BoundingBoxXYZ {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  z: number;
}

export interface BoundingBoxScreen {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface TileInfo {
  x: number;
  y: number;
  z: number;
  wgs84BBox: BoundingBoxWGS84;
  xyzBBox: BoundingBoxXYZ;
  screenBBox: BoundingBoxScreen;
}

export interface MapTileControllerOptions {
  element: HTMLElement;
  centerLon?: number;
  centerLat?: number;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  tileSize?: number;
  /** Milliseconds of wheel silence before onMovementEnd fires. Defaults to 150. */
  wheelDebounceDuration?: number;
  onMovementStart?: (this: MapTileController) => void;
  onMovement?: (this: MapTileController) => void;
  onMovementEnd?: (this: MapTileController) => void;
  onResize?: (width: number, height: number) => void;
}

export class MapTileController {
  public element: HTMLElement;
  public center: WGS84;
  public zoom: number;
  public tileSize: number;
  public minZoom: number;
  public maxZoom: number;
  public wheelDebounceDuration: number;

  private width: number;
  private height: number;

  // Callbacks
  private onMovementStart?: (this: MapTileController) => void;
  private onMovement?: (this: MapTileController) => void;
  private onMovementEnd?: (this: MapTileController) => void;
  private onResize?: (width: number, height: number) => void;

  // Interaction state
  private isInteracting = false;
  private lastPointers = new Map<number, Point>();
  private velocity = { x: 0, y: 0 };
  private lastInteractionTime = 0;
  private animationFrameId: number | null = null;
  private initialPinchDistance: number | null = null;
  private initialPinchZoom: number | null = null;

  // Wheel gesture state. A wheel "gesture" is a burst of events treated as one movement.
  private wheelTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isWheeling = false;

  constructor(options: MapTileControllerOptions) {
    this.element = options.element;
    this.center = { lon: options.centerLon ?? 0, lat: options.centerLat ?? 0 };
    this.zoom = options.zoom ?? 0;
    this.tileSize = options.tileSize ?? 256;
    this.minZoom = options.minZoom ?? 0;
    this.maxZoom = options.maxZoom ?? 22;
    this.wheelDebounceDuration = options.wheelDebounceDuration ?? 150;

    this.onMovementStart = options.onMovementStart?.bind(this);
    this.onMovement = options.onMovement?.bind(this);
    this.onMovementEnd = options.onMovementEnd?.bind(this);
    this.onResize = options.onResize?.bind(this);

    const rect = this.element.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.attachEventListeners();
  }

  public dispose() {
    this.detachEventListeners();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.cancelWheelDebounce();
  }

  /** Drops a pending wheel end without firing onMovementEnd. */
  private cancelWheelDebounce() {
    if (this.wheelTimeoutId !== null) {
      clearTimeout(this.wheelTimeoutId);
      this.wheelTimeoutId = null;
    }
    this.isWheeling = false;
  }

  // Coordinate System Conversions

  public wgs84ToXYZ(wgs84: WGS84, zoomLevel: number): Point {
    const latRad = (wgs84.lat * Math.PI) / 180;
    const n = Math.pow(2, zoomLevel);
    const x = ((wgs84.lon + 180) / 360) * n;
    const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
    return { x, y };
  }

  public xyzToWGS84(x: number, y: number, zoomLevel: number): WGS84 {
    const n = Math.pow(2, zoomLevel);
    const lng = (x / n) * 360 - 180;
    const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
    const lat = (latRad * 180) / Math.PI;
    return { lon: lng, lat };
  }

  public wgs84ToScreen(wgs84: WGS84): Point {
    const targetXYZ = this.wgs84ToXYZ(wgs84, this.zoom);
    const centerXYZ = this.wgs84ToXYZ(this.center, this.zoom);

    return {
      x: this.width / 2 + (targetXYZ.x - centerXYZ.x) * this.tileSize,
      y: this.height / 2 + (targetXYZ.y - centerXYZ.y) * this.tileSize
    };
  }

  public screenToWGS84(screenX: number, screenY: number): WGS84 {
    const centerXYZ = this.wgs84ToXYZ(this.center, this.zoom);

    const targetX = centerXYZ.x + (screenX - this.width / 2) / this.tileSize;
    const targetY = centerXYZ.y + (screenY - this.height / 2) / this.tileSize;

    return this.xyzToWGS84(targetX, targetY, this.zoom);
  }

  // Tile Visibility and Intersections

  public getVisibleTiles(zoomLevel: number = Math.floor(this.zoom)): TileInfo[] {
    const baseZ = Math.floor(zoomLevel); // Request discrete integer tile layer

    const topLeftWGS = this.screenToWGS84(0, 0);
    const bottomRightWGS = this.screenToWGS84(this.width, this.height);

    const topLeftXYZ = this.wgs84ToXYZ(topLeftWGS, baseZ);
    const bottomRightXYZ = this.wgs84ToXYZ(bottomRightWGS, baseZ);

    const startX = Math.max(0, Math.floor(topLeftXYZ.x));
    const endX = Math.min(Math.pow(2, baseZ) - 1, Math.floor(bottomRightXYZ.x));

    const startY = Math.max(0, Math.floor(topLeftXYZ.y));
    const endY = Math.min(Math.pow(2, baseZ) - 1, Math.floor(bottomRightXYZ.y));

    const tiles: TileInfo[] = [];

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const nwWGS84 = this.xyzToWGS84(x, y, baseZ);
        const seWGS84 = this.xyzToWGS84(x + 1, y + 1, baseZ);

        const nwScreen = this.wgs84ToScreen(nwWGS84);
        const seScreen = this.wgs84ToScreen(seWGS84);

        const tileInfo: TileInfo = {
          x,
          y,
          z: baseZ,
          wgs84BBox: {
            minLon: nwWGS84.lon,
            maxLon: seWGS84.lon,
            minLat: seWGS84.lat,
            maxLat: nwWGS84.lat // Latitudes go down as Y goes up
          },
          xyzBBox: {
            minX: x,
            maxX: x + 1,
            minY: y,
            maxY: y + 1,
            z: baseZ
          },
          screenBBox: {
            minX: nwScreen.x,
            maxX: seScreen.x,
            minY: nwScreen.y,
            maxY: seScreen.y
          }
        };

        // Double check screen intersection
        if (this.isTileVisible(tileInfo.screenBBox)) {
          tiles.push(tileInfo);
        }
      }
    }

    return tiles;
  }

  public getTileBoundingBox(x: number, y: number, z: number, viewportZoom: number = this.zoom): TileInfo {
    // 1. Get exact geographic boundaries of this specific tile
    const nwWGS84 = this.xyzToWGS84(x, y, z);
    const seWGS84 = this.xyzToWGS84(x + 1, y + 1, z);

    // 2. Helper to project with a specific zoom (defaults to current fractional zoom)
    const toScreen = (wgs84: WGS84) => {
      const targetXYZ = this.wgs84ToXYZ(wgs84, viewportZoom);
      const centerXYZ = this.wgs84ToXYZ(this.center, viewportZoom);
      return {
        x: this.width / 2 + (targetXYZ.x - centerXYZ.x) * this.tileSize,
        y: this.height / 2 + (targetXYZ.y - centerXYZ.y) * this.tileSize
      };
    };

    const nwScreen = toScreen(nwWGS84);
    const seScreen = toScreen(seWGS84);

    return {
      x,
      y,
      z,
      xyzBBox: {
        minX: x,
        minY: y,
        maxX: x + 1,
        maxY: y + 1,
        z: z
      },
      wgs84BBox: {
        minLon: nwWGS84.lon,
        maxLon: seWGS84.lon,
        minLat: seWGS84.lat, // Latitudes decrease as tile Y increases
        maxLat: nwWGS84.lat
      },
      screenBBox: {
        minX: nwScreen.x,
        maxX: seScreen.x,
        minY: nwScreen.y,
        maxY: seScreen.y
      }
    };
  }

  public isTileVisible(screenBBox: BoundingBoxScreen): boolean {
    // Intersect bounding box of tile with screen viewport bounding box
    return !(screenBBox.maxX < 0 || screenBBox.minX > this.width || screenBBox.maxY < 0 || screenBBox.minY > this.height);
  }

  private setZoom(newZoom: number, originScreenPoint: Point = { x: this.width / 2, y: this.height / 2 }) {
    const clampedZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    if (clampedZoom === this.zoom) return;

    // Keep the origin point in the same geographic spot
    const originWGS84Before = this.screenToWGS84(originScreenPoint.x, originScreenPoint.y);

    this.zoom = clampedZoom;

    // Adjust center so the origin point matches again
    const newOriginScreen = this.wgs84ToScreen(originWGS84Before);
    const dx = newOriginScreen.x - originScreenPoint.x;
    const dy = newOriginScreen.y - originScreenPoint.y;

    this.panBy(dx, dy);
  }

  private panBy(dxScreen: number, dyScreen: number) {
    // Panning by pixels shifts the center WGS84 coordinate
    const newCenterWGS84 = this.screenToWGS84(this.width / 2 + dxScreen, this.height / 2 + dyScreen);
    this.center = newCenterWGS84;
    this.onMovement?.();
  }

  // Event Listeners and Pointer Handling

  private attachEventListeners() {
    this.element.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    this.element.addEventListener('pointermove', this.onPointerMove, { passive: false });
    this.element.addEventListener('pointerup', this.onPointerUp);
    this.element.addEventListener('pointercancel', this.onPointerUp);
    this.element.addEventListener('pointerleave', this.onPointerUp);
    this.element.addEventListener('wheel', this.onWheel, { passive: false });
    this.element.addEventListener('dblclick', this.onDoubleClick);
    this.element.addEventListener('contextmenu', this.onPointerUp);
    this.element.addEventListener('gesturestart', this.suppressEvent);
    this.element.addEventListener('gesturechange', this.suppressEvent);
    this.element.addEventListener('gestureend', this.suppressEvent);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.width = entry.contentRect.width;
        this.height = entry.contentRect.height;
        this.onResize?.(this.width, this.height);
      }
    });
    resizeObserver.observe(this.element);
  }

  private detachEventListeners() {
    this.element.removeEventListener('pointerdown', this.onPointerDown);
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerup', this.onPointerUp);
    this.element.removeEventListener('pointercancel', this.onPointerUp);
    this.element.removeEventListener('pointerleave', this.onPointerUp);
    this.element.removeEventListener('wheel', this.onWheel);
    this.element.removeEventListener('dblclick', this.onDoubleClick);
    this.element.removeEventListener('contextmenu', this.onPointerUp);
    this.element.removeEventListener('gesturestart', this.suppressEvent);
    this.element.removeEventListener('gesturechange', this.suppressEvent);
    this.element.removeEventListener('gestureend', this.suppressEvent);
  }

  private getPinchDistance(p1: Point, p2: Point): number {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  private getPinchCenter(p1: Point, p2: Point): Point {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  }

  private onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    this.element.setPointerCapture(e.pointerId);
    this.lastPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // A pointer gesture taking over from a wheel burst is still one continuous movement,
    // so the pending wheel end is dropped and no second onMovementStart is emitted.
    const continuesWheelGesture = this.isWheeling;
    this.cancelWheelDebounce();

    if (!this.isInteracting) {
      this.isInteracting = true;
      this.velocity = { x: 0, y: 0 };
      if (this.animationFrameId !== null) cancelAnimationFrame(this.animationFrameId);
      if (!continuesWheelGesture) this.onMovementStart?.();
    }

    if (this.lastPointers.size === 2) {
      const pts = Array.from(this.lastPointers.values());
      this.initialPinchDistance = this.getPinchDistance(pts[0], pts[1]);
      this.initialPinchZoom = this.zoom;
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    if (!this.lastPointers.has(e.pointerId)) return;

    const now = performance.now();
    const dt = Math.max(1, now - this.lastInteractionTime);
    this.lastInteractionTime = now;

    const prevPoint = this.lastPointers.get(e.pointerId)!;
    const currentPoint = { x: e.clientX, y: e.clientY };

    if (this.lastPointers.size === 1) {
      const dx = prevPoint.x - currentPoint.x;
      const dy = prevPoint.y - currentPoint.y;

      this.velocity = { x: dx / dt, y: dy / dt };
      this.panBy(dx, dy);
    } else if (this.lastPointers.size === 2) {
      this.lastPointers.set(e.pointerId, currentPoint);
      const pts = Array.from(this.lastPointers.values());

      const currentDistance = this.getPinchDistance(pts[0], pts[1]);
      const center = this.getPinchCenter(pts[0], pts[1]);

      if (this.initialPinchDistance && this.initialPinchZoom !== null) {
        const zoomDelta = Math.log2(currentDistance / this.initialPinchDistance);
        this.setZoom(this.initialPinchZoom + zoomDelta, center);
      }
    }

    this.lastPointers.set(e.pointerId, currentPoint);
  };

  private onPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    this.lastPointers.delete(e.pointerId);

    if (this.lastPointers.size < 2) {
      this.initialPinchDistance = null;
      this.initialPinchZoom = null;
    }

    if (this.lastPointers.size === 0) {
      this.isInteracting = false;
      this.startInertia();
    }
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
      this.velocity = { x: 0, y: 0 };
    }

    // Trackpads and smooth-scroll wheels emit a burst of events. Only the first one opens
    // the movement; the end is deferred until the burst goes quiet, so onMovementEnd fires
    // once per gesture instead of once per event.
    if (this.wheelTimeoutId !== null) {
      clearTimeout(this.wheelTimeoutId);
      this.wheelTimeoutId = null;
    }

    if (!this.isWheeling && !this.isInteracting) {
      this.isWheeling = true;
      this.onMovementStart?.();
    }

    // Typical wheel delta mappings for zoom speeds
    const zoomDelta = -e.deltaY * 0.01;
    const origin = { x: e.clientX, y: e.clientY };

    this.setZoom(this.zoom + zoomDelta, origin);

    this.wheelTimeoutId = setTimeout(this.endWheelGesture, this.wheelDebounceDuration);
  };

  private endWheelGesture = () => {
    this.wheelTimeoutId = null;
    if (!this.isWheeling) return;
    this.isWheeling = false;

    // A pointer gesture started mid-burst and owns the movement now; it will emit the end.
    if (this.isInteracting) return;

    this.onMovementEnd?.();
  };

  private onDoubleClick = (e: MouseEvent) => {
    e.preventDefault();
    const zoomOut = e.shiftKey || e.altKey;
    const delta = zoomOut ? -1 : 1;
    const origin = { x: e.clientX, y: e.clientY };
    this.zoomAround(origin, this.zoom + delta, 320);
  };

  /**
   * Zooms toward `targetZoom` while pinning the geographic coordinate currently
   * under `originScreenPoint` to that same screen position.
   */
  public zoomAround(originScreenPoint: Point, targetZoom: number, duration: number = 0) {
    const startZoom = this.zoom;
    const endZoom = Math.max(this.minZoom, Math.min(this.maxZoom, targetZoom));
    if (endZoom === startZoom) return;

    // The anchor is resolved once, before anything changes, so repeated frames
    // can't accumulate round-trip drift.
    const anchor = this.screenToWGS84(originScreenPoint.x, originScreenPoint.y);

    // Inertia, a wheel burst, or a previous zoom animation may be in flight.
    // This gesture takes over the movement rather than opening a second one.
    const continuesMovement = this.isInteracting || this.isWheeling || this.animationFrameId !== null;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.velocity = { x: 0, y: 0 };
    this.cancelWheelDebounce();

    const applyZoom = (zoomLevel: number) => {
      this.zoom = zoomLevel;
      const anchorScreen = this.wgs84ToScreen(anchor);
      // panBy emits onMovement, so every frame notifies exactly once.
      this.panBy(anchorScreen.x - originScreenPoint.x, anchorScreen.y - originScreenPoint.y);
    };

    if (duration <= 0) {
      if (!continuesMovement) this.onMovementStart?.();
      applyZoom(endZoom);
      this.onMovementEnd?.();
      return;
    }

    if (!continuesMovement) this.onMovementStart?.();

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const progress = Math.min(1, (currentTime - startTime) / duration);
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      applyZoom(startZoom + (endZoom - startZoom) * ease);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animationFrameId = null;
        this.onMovementEnd?.();
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  private suppressEvent(e: Event): void {
    e.preventDefault();
  }

  private startInertia = () => {
    const friction = 0.92; // Decay rate
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.max(1, time - lastTime);
      lastTime = time;

      if (Math.abs(this.velocity.x) > 0.05 || Math.abs(this.velocity.y) > 0.05) {
        this.panBy(this.velocity.x * dt, this.velocity.y * dt);
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.velocity = { x: 0, y: 0 };
        this.onMovementEnd?.();
        this.animationFrameId = null;
      }
    };
    this.animationFrameId = requestAnimationFrame(animate);
  };

  public focusOn(lon: number, lat: number, zoom: number, duration: number = 0) {
    // Cancel any ongoing inertia or previous animations
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    // This call owns the movement from here, so a queued wheel end must not fire into it.
    this.cancelWheelDebounce();

    const targetCenter = { lon, lat };
    const targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));

    if (duration <= 0) {
      this.center = targetCenter;
      this.zoom = targetZoom;
      this.onMovement?.();
      return;
    }

    this.onMovementStart?.();

    const startCenter = { ...this.center };
    const startZoom = this.zoom;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease in-out quadratic for smoother transition
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      this.center = {
        lon: startCenter.lon + (targetCenter.lon - startCenter.lon) * ease,
        lat: startCenter.lat + (targetCenter.lat - startCenter.lat) * ease
      };
      this.zoom = startZoom + (targetZoom - startZoom) * ease;

      this.onMovement?.();

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animationFrameId = null;
        this.onMovementEnd?.();
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}

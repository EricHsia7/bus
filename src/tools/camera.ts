/**
 *
 * Coordinate
 *  lng/lat        WGS84 degrees (what the label JSON stores)
 *  mercator unit  [0..1] x [0..1], y down, origin = NW corner of the world
 *  world px       mercator * worldSize, worldSize = tileSize * 2^zoom
 *  screen px      CSS pixels, origin = canvas top-left
 *
 * screen = mercator * scale + translate with scale = worldSize,
 * translate = size/2 - center*scale — a pure scale+translate affine matrix
 * [scale, 0, 0, scale, translateX, translateY], which is exactly what
 * ctx.setTransform() wants, so raster drawing needs no per-tile math beyond the
 * tile's own mercator rect.
 *
 */

export const MAX_MERCATOR_LAT = 85.051128779806604;

export interface ScreenPoint {
  x: number;
  y: number;
}
export interface MercPoint {
  x: number;
  y: number;
}
export interface LngLat {
  lng: number;
  lat: number;
}
export interface MercBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const lngToMercX = (lng: number): number => (lng + 180) / 360;

export function latToMercY(lat: number): number {
  const clampedLatitude = Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, lat));
  const sine = Math.sin((clampedLatitude * Math.PI) / 180);
  return 0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI);
}

export const mercXToLng = (mercatorX: number): number => mercatorX * 360 - 180;

export const mercYToLat = (mercatorY: number): number => (Math.atan(Math.sinh(Math.PI * (1 - 2 * mercatorY))) * 180) / Math.PI;

/** metres per screen pixel at a given latitude/zoom (handy for scale bars) */
export function metersPerPixel(lat: number, zoom: number, tileSize = 256): number {
  return (Math.cos((lat * Math.PI) / 180) * 2 * Math.PI * 6378137) / (tileSize * Math.pow(2, zoom));
}

export interface CameraOptions {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  tileSize?: number;
  /** [west, south, east, north] */
  maxBounds?: [number, number, number, number] | null;
}

export class Camera {
  /** center in mercator units */
  x = 0.5;
  y = 0.5;
  zoom = 0;
  minZoom = 0;
  maxZoom = 22;
  tileSize = 256;
  /** viewport size in CSS px */
  width = 1;
  height = 1;
  maxBounds: MercBounds | null = null;

  constructor(options: CameraOptions = {}) {
    this.tileSize = options.tileSize ?? 256;
    this.minZoom = options.minZoom ?? 0;
    this.maxZoom = options.maxZoom ?? 22;
    this.zoom = options.zoom ?? 0;
    if (options.center) this.setCenter(options.center[0], options.center[1]);
    if (options.maxBounds) this.setMaxBounds(options.maxBounds);
  }

  setMaxBounds(bounds: [number, number, number, number] | null): void {
    this.maxBounds = bounds
      ? {
          minX: lngToMercX(bounds[0]),
          minY: latToMercY(bounds[3]),
          maxX: lngToMercX(bounds[2]),
          maxY: latToMercY(bounds[1])
        }
      : null;
  }

  get worldSize(): number {
    return this.tileSize * Math.pow(2, this.zoom);
  }

  /** [a, b, c, d, e, f] mapping mercator units -> CSS px */
  get matrix(): [number, number, number, number, number, number] {
    const scale = this.worldSize;
    return [scale, 0, 0, scale, this.width / 2 - this.x * scale, this.height / 2 - this.y * scale];
  }

  projectX(mercatorX: number): number {
    const scale = this.worldSize;
    return (mercatorX - this.x) * scale + this.width / 2;
  }

  projectY(mercatorY: number): number {
    const scale = this.worldSize;
    return (mercatorY - this.y) * scale + this.height / 2;
  }

  project(mercatorX: number, mercatorY: number): ScreenPoint {
    return { x: this.projectX(mercatorX), y: this.projectY(mercatorY) };
  }

  unproject(screenX: number, screenY: number): MercPoint {
    const scale = this.worldSize;
    return {
      x: (screenX - this.width / 2) / scale + this.x,
      y: (screenY - this.height / 2) / scale + this.y
    };
  }

  projectLngLat(lng: number, lat: number): ScreenPoint {
    return this.project(lngToMercX(lng), latToMercY(lat));
  }

  screenToLngLat(screenX: number, screenY: number): LngLat {
    const mercator = this.unproject(screenX, screenY);
    return { lng: mercXToLng(mercator.x), lat: mercYToLat(mercator.y) };
  }

  get center(): LngLat {
    return { lng: mercXToLng(this.x), lat: mercYToLat(this.y) };
  }

  setCenter(lng: number, lat: number): this {
    this.x = lngToMercX(lng);
    this.y = latToMercY(lat);
    return this.constrain();
  }

  resize(width: number, height: number): this {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    return this.constrain();
  }

  panByPixels(deltaX: number, deltaY: number): this {
    const scale = this.worldSize;
    this.x -= deltaX / scale;
    this.y -= deltaY / scale;
    return this.constrain();
  }

  /**
   * Set zoom while keeping `anchorMerc` pinned under `anchorScreen`.
   * Passing the mercator anchor explicitly (instead of re-deriving it each frame)
   * keeps animated zooms drift-free.
   */
  zoomTo(zoom: number, anchorScreen?: ScreenPoint | null, anchorMerc?: MercPoint | null): this {
    const clampedZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    if (anchorScreen) {
      const anchorMercator = anchorMerc ?? this.unproject(anchorScreen.x, anchorScreen.y);
      this.zoom = clampedZoom;
      const scale = this.worldSize;
      // solve for center so that anchorMercator projects onto anchorScreen
      this.x = anchorMercator.x - (anchorScreen.x - this.width / 2) / scale;
      this.y = anchorMercator.y - (anchorScreen.y - this.height / 2) / scale;
    } else {
      this.zoom = clampedZoom;
    }
    return this.constrain();
  }

  zoomBy(zoomDelta: number, anchorScreen?: ScreenPoint | null): this {
    return this.zoomTo(this.zoom + zoomDelta, anchorScreen);
  }

  /** visible area in mercator units, optionally grown by `padPx` screen pixels */
  visibleBounds(padPx = 0): MercBounds {
    const scale = this.worldSize;
    const halfWidth = (this.width / 2 + padPx) / scale;
    const halfHeight = (this.height / 2 + padPx) / scale;
    return {
      minX: this.x - halfWidth,
      minY: this.y - halfHeight,
      maxX: this.x + halfWidth,
      maxY: this.y + halfHeight
    };
  }

  /** smallest zoom at which `bounds` fits the viewport */
  zoomForBounds(bounds: MercBounds, padPx = 24): number {
    const width = Math.max(1e-12, bounds.maxX - bounds.minX);
    const height = Math.max(1e-12, bounds.maxY - bounds.minY);
    const scaleX = Math.max(1, this.width - padPx * 2) / width;
    const scaleY = Math.max(1, this.height - padPx * 2) / height;
    return Math.log2(Math.min(scaleX, scaleY) / this.tileSize);
  }

  fitBounds(bounds: MercBounds, padPx = 24): this {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomForBounds(bounds, padPx)));
    this.x = (bounds.minX + bounds.maxX) / 2;
    this.y = (bounds.minY + bounds.maxY) / 2;
    return this.constrain();
  }

  /** clamp zoom, keep the world (or maxBounds) from sliding out of view */
  constrain(): this {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    const scale = this.worldSize;
    const bounds = this.maxBounds ?? { minX: 0, minY: 0, maxX: 1, maxY: 1 };
    const halfWidth = this.width / 2 / scale;
    const halfHeight = this.height / 2 / scale;

    if (bounds.maxX - bounds.minX <= halfWidth * 2) {
      this.x = (bounds.minX + bounds.maxX) / 2;
    } else {
      this.x = Math.max(bounds.minX + halfWidth, Math.min(bounds.maxX - halfWidth, this.x));
    }
    if (bounds.maxY - bounds.minY <= halfHeight * 2) {
      this.y = (bounds.minY + bounds.maxY) / 2;
    } else {
      this.y = Math.max(bounds.minY + halfHeight, Math.min(bounds.maxY - halfHeight, this.y));
    }
    return this;
  }
}

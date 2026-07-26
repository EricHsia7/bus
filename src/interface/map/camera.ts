/**
 *
 * Coordinate
 *  lng/lat        WGS84 degrees (what the label JSON stores)
 *  mercator unit  [0..1] x [0..1], y down, origin = NW corner of the world
 *  world px       mercator * worldSize, worldSize = tileSize * 2^zoom
 *  screen px      CSS pixels, origin = canvas top-left
 *
 * screen = mercator * k + t with k = worldSize, t = size/2 - center*k
 * a pure scale+translate affine matrix [k, 0, 0, k, tx, ty] — which is
 * exactly what ctx.setTransform() wants, so raster drawing needs no per-tile math
 * beyond the tile's own mercator rect.
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
  const l = Math.max(-MAX_MERCATOR_LAT, Math.min(MAX_MERCATOR_LAT, lat));
  const s = Math.sin((l * Math.PI) / 180);
  return 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI);
}

export const mercXToLng = (x: number): number => x * 360 - 180;

export const mercYToLat = (y: number): number => (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI;

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

  constructor(opts: CameraOptions = {}) {
    this.tileSize = opts.tileSize ?? 256;
    this.minZoom = opts.minZoom ?? 0;
    this.maxZoom = opts.maxZoom ?? 22;
    this.zoom = opts.zoom ?? 0;
    if (opts.center) this.setCenter(opts.center[0], opts.center[1]);
    if (opts.maxBounds) this.setMaxBounds(opts.maxBounds);
  }

  setMaxBounds(b: [number, number, number, number] | null): void {
    this.maxBounds = b
      ? {
          minX: lngToMercX(b[0]),
          minY: latToMercY(b[3]),
          maxX: lngToMercX(b[2]),
          maxY: latToMercY(b[1])
        }
      : null;
  }

  get worldSize(): number {
    return this.tileSize * Math.pow(2, this.zoom);
  }

  /** [a, b, c, d, e, f] mapping mercator units -> CSS px */
  get matrix(): [number, number, number, number, number, number] {
    const k = this.worldSize;
    return [k, 0, 0, k, this.width / 2 - this.x * k, this.height / 2 - this.y * k];
  }

  projectX(mx: number): number {
    const k = this.worldSize;
    return (mx - this.x) * k + this.width / 2;
  }

  projectY(my: number): number {
    const k = this.worldSize;
    return (my - this.y) * k + this.height / 2;
  }

  project(mx: number, my: number): ScreenPoint {
    return { x: this.projectX(mx), y: this.projectY(my) };
  }

  unproject(px: number, py: number): MercPoint {
    const k = this.worldSize;
    return {
      x: (px - this.width / 2) / k + this.x,
      y: (py - this.height / 2) / k + this.y
    };
  }

  projectLngLat(lng: number, lat: number): ScreenPoint {
    return this.project(lngToMercX(lng), latToMercY(lat));
  }

  screenToLngLat(px: number, py: number): LngLat {
    const m = this.unproject(px, py);
    return { lng: mercXToLng(m.x), lat: mercYToLat(m.y) };
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

  panByPixels(dx: number, dy: number): this {
    const k = this.worldSize;
    this.x -= dx / k;
    this.y -= dy / k;
    return this.constrain();
  }

  /**
   * Set zoom while keeping `anchorMerc` pinned under `anchorScreen`.
   * Passing the mercator anchor explicitly (instead of re-deriving it each frame)
   * keeps animated zooms drift-free.
   */
  zoomTo(zoom: number, anchorScreen?: ScreenPoint | null, anchorMerc?: MercPoint | null): this {
    const next = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    if (anchorScreen) {
      const m = anchorMerc ?? this.unproject(anchorScreen.x, anchorScreen.y);
      this.zoom = next;
      const k = this.worldSize;
      // solve for center so that m projects onto anchorScreen
      this.x = m.x - (anchorScreen.x - this.width / 2) / k;
      this.y = m.y - (anchorScreen.y - this.height / 2) / k;
    } else {
      this.zoom = next;
    }
    return this.constrain();
  }

  zoomBy(dz: number, anchorScreen?: ScreenPoint | null): this {
    return this.zoomTo(this.zoom + dz, anchorScreen);
  }

  /** visible area in mercator units, optionally grown by `padPx` screen pixels */
  visibleBounds(padPx = 0): MercBounds {
    const k = this.worldSize;
    const halfW = (this.width / 2 + padPx) / k;
    const halfH = (this.height / 2 + padPx) / k;
    return {
      minX: this.x - halfW,
      minY: this.y - halfH,
      maxX: this.x + halfW,
      maxY: this.y + halfH
    };
  }

  /** smallest zoom at which `bounds` fits the viewport */
  zoomForBounds(b: MercBounds, padPx = 24): number {
    const w = Math.max(1e-12, b.maxX - b.minX);
    const h = Math.max(1e-12, b.maxY - b.minY);
    const kx = Math.max(1, this.width - padPx * 2) / w;
    const ky = Math.max(1, this.height - padPx * 2) / h;
    return Math.log2(Math.min(kx, ky) / this.tileSize);
  }

  fitBounds(b: MercBounds, padPx = 24): this {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomForBounds(b, padPx)));
    this.x = (b.minX + b.maxX) / 2;
    this.y = (b.minY + b.maxY) / 2;
    return this.constrain();
  }

  /** clamp zoom, keep the world (or maxBounds) from sliding out of view */
  constrain(): this {
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));
    const k = this.worldSize;
    const b = this.maxBounds ?? { minX: 0, minY: 0, maxX: 1, maxY: 1 };
    const halfW = this.width / 2 / k;
    const halfH = this.height / 2 / k;

    if (b.maxX - b.minX <= halfW * 2) {
      this.x = (b.minX + b.maxX) / 2;
    } else {
      this.x = Math.max(b.minX + halfW, Math.min(b.maxX - halfW, this.x));
    }
    if (b.maxY - b.minY <= halfH * 2) {
      this.y = (b.minY + b.maxY) / 2;
    } else {
      this.y = Math.max(b.minY + halfH, Math.min(b.maxY - halfH, this.y));
    }
    return this;
  }

  /** #z/lat/lng permalink fragment */
  toHash(): string {
    const c = this.center;
    const p = Math.max(0, Math.ceil((this.zoom * Math.LN2) / Math.LN10) + 1);
    return `#${this.zoom.toFixed(2)}/${c.lat.toFixed(p)}/${c.lng.toFixed(p)}`;
  }

  applyHash(hash: string): boolean {
    const m = /^#?(-?[\d.]+)\/(-?[\d.]+)\/(-?[\d.]+)$/.exec(hash.trim());
    if (!m) return false;
    const [, z, lat, lng] = m;
    this.zoom = Number(z);
    this.setCenter(Number(lng), Number(lat));
    return true;
  }
}

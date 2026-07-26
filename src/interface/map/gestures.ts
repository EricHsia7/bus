import type { Camera, MercPoint, ScreenPoint } from './camera';

export interface GestureOptions {
  camera: Camera;
  element: HTMLElement;
  onChange: () => void;
  /** ms; wheel/dblclick zoom easing */
  zoomDuration?: number;
  /** inertia decay time constant, ms */
  inertiaTau?: number;
  maxInertiaSpeed?: number;
  /**
   * What an unmodified two-finger / wheel scroll does.
   *  "auto" (default): touchpad scroll pans, mouse wheel zooms
   *  "zoom": everything zooms (classic web-map behaviour)
   *  "pan": everything pans (pinch/ctrl/shift still zoom)
   */
  wheelBehavior?: 'auto' | 'zoom' | 'pan';
}

/** Safari-only pinch events; not in the TS DOM lib */
interface SafariGestureEvent extends MouseEvent {
  readonly scale: number;
  readonly rotation: number;
}

interface PointerState {
  x: number;
  y: number;
}

const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

export class Gestures {
  private camera: Camera;
  private el: HTMLElement;
  private onChange: () => void;
  private zoomDuration: number;
  private inertiaTau: number;
  private maxInertiaSpeed: number;
  private wheelBehavior: 'auto' | 'zoom' | 'pan';

  /** timestamp until which wheel events are assumed to come from a touchpad */
  private touchpadUntil = 0;
  private lastWheelTime = 0;
  /** Safari pinch state */
  private gesture: { zoom: number; anchorScreen: ScreenPoint; anchorMerc: MercPoint } | null = null;

  private pointers = new Map<number, PointerState>();
  private lastPointerTime = 0;
  private pinchDistance = 0;
  private vx = 0;
  private vy = 0;
  private inertia: { vx: number; vy: number } | null = null;
  private zoomAnim: {
    from: number;
    to: number;
    start: number;
    duration: number;
    anchorScreen: ScreenPoint;
    anchorMerc: MercPoint;
  } | null = null;
  private lastFrame = 0;

  constructor(opts: GestureOptions) {
    this.camera = opts.camera;
    this.el = opts.element;
    this.onChange = opts.onChange;
    this.zoomDuration = opts.zoomDuration ?? 180;
    this.inertiaTau = opts.inertiaTau ?? 180;
    this.maxInertiaSpeed = opts.maxInertiaSpeed ?? 4; // px/ms
    this.wheelBehavior = opts.wheelBehavior ?? 'auto';

    const el = this.el;
    el.style.touchAction = 'none';
    if (!el.hasAttribute('tabindex')) el.tabIndex = 0;

    el.addEventListener('pointerdown', this.onPointerDown);
    el.addEventListener('pointermove', this.onPointerMove);
    el.addEventListener('pointerup', this.onPointerUp);
    el.addEventListener('pointercancel', this.onPointerUp);
    el.addEventListener('wheel', this.onWheel, { passive: false });
    el.addEventListener('dblclick', this.onDoubleClick);
    el.addEventListener('keydown', this.onKeyDown);
    el.addEventListener('contextmenu', this.onContextMenu);
    // Safari trackpad pinch (also stops Safari's own page zoom)
    el.addEventListener('gesturestart', this.onGestureStart as EventListener);
    el.addEventListener('gesturechange', this.onGestureChange as EventListener);
    el.addEventListener('gestureend', this.onGestureEnd as EventListener);
  }

  /* ------------------------------------------------------------ helpers */

  private local(e: PointerEvent | WheelEvent | MouseEvent): ScreenPoint {
    const r = this.el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private midpoint(): ScreenPoint {
    let x = 0;
    let y = 0;
    for (const p of this.pointers.values()) {
      x += p.x;
      y += p.y;
    }
    return { x: x / this.pointers.size, y: y / this.pointers.size };
  }

  private spread(): number {
    const pts = [...this.pointers.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  /** queue an eased zoom to `target`, pinned at `anchor` */
  zoomToAnimated(target: number, anchor?: ScreenPoint | null, duration = this.zoomDuration): void {
    const a = anchor ?? { x: this.camera.width / 2, y: this.camera.height / 2 };
    const clamped = Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, target));
    this.inertia = null;
    this.zoomAnim = {
      from: this.camera.zoom,
      to: clamped,
      start: performance.now(),
      duration,
      anchorScreen: a,
      anchorMerc: this.camera.unproject(a.x, a.y)
    };
    this.onChange();
  }

  get zoomTarget(): number {
    return this.zoomAnim ? this.zoomAnim.to : this.camera.zoom;
  }

  stop(): void {
    this.inertia = null;
    this.zoomAnim = null;
  }

  /* ------------------------------------------------------------ pointers */

  private onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    this.el.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, this.local(e));
    this.lastPointerTime = e.timeStamp;
    this.vx = this.vy = 0;
    this.stop();
    if (this.pointers.size === 2) this.pinchDistance = this.spread();
    this.el.focus({ preventScroll: true });
  };

  private onPointerMove = (e: PointerEvent): void => {
    const prev = this.pointers.get(e.pointerId);
    if (!prev) return;
    e.preventDefault();

    const before = this.pointers.size >= 2 ? this.midpoint() : { ...prev };
    const next = this.local(e);
    this.pointers.set(e.pointerId, next);

    if (this.pointers.size >= 2) {
      // pinch: zoom by the distance ratio around the (moving) midpoint
      const after = this.midpoint();
      const distance = this.spread();
      if (this.pinchDistance > 0 && distance > 0) {
        const dz = Math.log2(distance / this.pinchDistance);
        this.camera.zoomTo(this.camera.zoom + dz, after);
      }
      this.pinchDistance = distance;
      this.camera.panByPixels(after.x - before.x, after.y - before.y);
      this.onChange();
      return;
    }

    const dx = next.x - before.x;
    const dy = next.y - before.y;
    const dt = Math.max(1, e.timeStamp - this.lastPointerTime);
    this.lastPointerTime = e.timeStamp;
    // low-pass filtered velocity, px/ms
    const a = 0.7;
    this.vx = this.vx * (1 - a) + (dx / dt) * a;
    this.vy = this.vy * (1 - a) + (dy / dt) * a;

    this.camera.panByPixels(dx, dy);
    this.onChange();
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.pointers.delete(e.pointerId)) return;
    if (this.el.hasPointerCapture?.(e.pointerId)) this.el.releasePointerCapture(e.pointerId);
    if (this.pointers.size === 1) {
      this.pinchDistance = 0;
      this.lastPointerTime = e.timeStamp;
      return;
    }
    if (this.pointers.size > 0) return;

    const speed = Math.hypot(this.vx, this.vy);
    const stale = e.timeStamp - this.lastPointerTime > 80;
    if (speed > 0.05 && !stale) {
      const clamp = Math.min(1, this.maxInertiaSpeed / speed);
      this.inertia = { vx: this.vx * clamp, vy: this.vy * clamp };
      this.lastFrame = 0;
      this.onChange();
    }
    this.vx = this.vy = 0;
  };

  private onContextMenu = (e: Event): void => {
    if (this.pointers.size) e.preventDefault();
  };

  /* --------------------------------------------------------------- wheel */

  /**
   * Precision-touchpad detection. Touchpads emit fractional, tiny or diagonal
   * deltas at high frequency; notched wheels emit large integer steps (or use
   * line/page deltaMode). The verdict is sticky for 800ms so the big deltas in
   * the middle of a fast two-finger flick don't get misread as a mouse wheel.
   */
  private isTouchpad(e: WheelEvent): boolean {
    if (e.deltaMode !== 0) {
      this.touchpadUntil = 0;
      return false;
    }
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    const fractional = !Number.isInteger(e.deltaY) || !Number.isInteger(e.deltaX);
    const tiny = absY > 0 && absY < 8;
    const diagonal = absX > 0 && absY > 0;
    const horizontalOnly = absX > 0 && absY === 0;
    const dt = e.timeStamp - this.lastWheelTime;
    this.lastWheelTime = e.timeStamp;

    if (fractional || tiny || diagonal || horizontalOnly) {
      this.touchpadUntil = e.timeStamp + 800;
    } else if (absY >= 50 && absX === 0 && dt > 100) {
      // an isolated big integer step is a notched wheel click: drop the sticky
      // verdict immediately so plugging in a mouse works mid-session. Events
      // inside a flick arrive every ~10ms, so they can't trip this.
      this.touchpadUntil = 0;
    }
    return e.timeStamp < this.touchpadUntil;
  }

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();

    const touchpad = this.isTouchpad(e);
    // macOS/Chrome/Firefox report a trackpad pinch as ctrl+wheel
    const pinch = e.ctrlKey;
    const wantsZoom = pinch || e.metaKey || e.shiftKey;
    const pans = !wantsZoom && (this.wheelBehavior === 'pan' || (this.wheelBehavior === 'auto' && touchpad));

    if (pans) {
      // 1:1 two-finger pan; the OS already supplies the momentum tail, so we
      // don't add our own inertia here (and we cancel any that's running).
      this.inertia = null;
      this.camera.panByPixels(-e.deltaX, -e.deltaY);
      this.onChange();
      return;
    }

    let delta = e.deltaY;
    if (e.deltaMode === 1)
      delta *= 40; // lines
    else if (e.deltaMode === 2) delta *= this.camera.height; // pages

    if (pinch) {
      // track the fingers directly — easing a pinch feels laggy
      this.stop();
      this.camera.zoomBy(-delta / 100, this.local(e));
      this.onChange();
      return;
    }

    // touchpad scroll used as zoom needs a gentler rate than a notched wheel
    const rate = touchpad ? 1 / 220 : 1 / 450;
    const duration = touchpad ? 90 : this.zoomDuration;
    this.zoomToAnimated(this.zoomTarget - delta * rate, this.local(e), duration);
  };

  /* ------------------------------------------------- Safari trackpad pinch */

  private onGestureStart = (e: SafariGestureEvent): void => {
    e.preventDefault();
    this.stop();
    const anchorScreen = this.local(e);
    this.gesture = {
      zoom: this.camera.zoom,
      anchorScreen,
      anchorMerc: this.camera.unproject(anchorScreen.x, anchorScreen.y)
    };
  };

  private onGestureChange = (e: SafariGestureEvent): void => {
    e.preventDefault();
    if (!this.gesture) return;
    const scale = Math.max(0.05, e.scale || 1);
    this.camera.zoomTo(this.gesture.zoom + Math.log2(scale), this.gesture.anchorScreen, this.gesture.anchorMerc);
    this.onChange();
  };

  private onGestureEnd = (e: SafariGestureEvent): void => {
    e.preventDefault();
    this.gesture = null;
  };

  private onDoubleClick = (e: MouseEvent): void => {
    e.preventDefault();
    const dz = e.shiftKey ? -1 : 1;
    this.zoomToAnimated(Math.round(this.zoomTarget) + dz, this.local(e), 260);
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    const step = e.shiftKey ? 200 : 80;
    switch (e.key) {
      case 'ArrowLeft':
        this.camera.panByPixels(step, 0);
        break;
      case 'ArrowRight':
        this.camera.panByPixels(-step, 0);
        break;
      case 'ArrowUp':
        this.camera.panByPixels(0, step);
        break;
      case 'ArrowDown':
        this.camera.panByPixels(0, -step);
        break;
      case '+':
      case '=':
        this.zoomToAnimated(this.zoomTarget + 1, null, 260);
        return;
      case '-':
      case '_':
        this.zoomToAnimated(this.zoomTarget - 1, null, 260);
        return;
      default:
        return;
    }
    e.preventDefault();
    this.onChange();
  };

  /* ----------------------------------------------------------- animation */

  /** advance inertia + zoom easing; returns true while something is animating */
  update(now: number): boolean {
    let animating = false;
    const dt = this.lastFrame ? Math.min(64, now - this.lastFrame) : 16;
    this.lastFrame = now;

    if (this.zoomAnim) {
      const a = this.zoomAnim;
      const t = a.duration <= 0 ? 1 : Math.min(1, (now - a.start) / a.duration);
      const zoom = a.from + (a.to - a.from) * easeOut(t);
      this.camera.zoomTo(zoom, a.anchorScreen, a.anchorMerc);
      if (t >= 1) this.zoomAnim = null;
      else animating = true;
    }

    if (this.inertia) {
      const i = this.inertia;
      this.camera.panByPixels(i.vx * dt, i.vy * dt);
      const decay = Math.exp(-dt / this.inertiaTau);
      i.vx *= decay;
      i.vy *= decay;
      if (Math.hypot(i.vx, i.vy) < 0.01) this.inertia = null;
      else animating = true;
    }

    if (this.pointers.size) animating = true;
    return animating;
  }

  destroy(): void {
    const el = this.el;
    el.removeEventListener('pointerdown', this.onPointerDown);
    el.removeEventListener('pointermove', this.onPointerMove);
    el.removeEventListener('pointerup', this.onPointerUp);
    el.removeEventListener('pointercancel', this.onPointerUp);
    el.removeEventListener('wheel', this.onWheel);
    el.removeEventListener('dblclick', this.onDoubleClick);
    el.removeEventListener('keydown', this.onKeyDown);
    el.removeEventListener('contextmenu', this.onContextMenu);
    el.removeEventListener('gesturestart', this.onGestureStart as EventListener);
    el.removeEventListener('gesturechange', this.onGestureChange as EventListener);
    el.removeEventListener('gestureend', this.onGestureEnd as EventListener);
  }
}

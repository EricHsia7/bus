import { Camera, MercPoint, ScreenPoint } from '../../tools/camera';

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
   * - What an unmodified two-finger / wheel scroll does.
   * - auto: touchpad scroll pans, mouse wheel zooms
   * - zoom: everything zooms (classic web-map behaviour)
   * - pan: everything pans (pinch/ctrl/shift still zoom)
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

/** cubic ease-out, maps linear progress 0..1 to an eased 0..1 */
const easeOut = (progress: number): number => 1 - Math.pow(1 - progress, 3);

export class Gestures {
  private camera: Camera;
  private element: HTMLElement;
  private onChange: () => void;
  private zoomDuration: number;
  private inertiaTau: number;
  private maxInertiaSpeed: number;
  private wheelBehavior: 'auto' | 'zoom' | 'pan';

  /** timestamp until which wheel events are assumed to come from a touchpad */
  private touchpadUntil = 0;
  private lastWheelTime = 0;
  /** Safari pinch state */
  private safariGesture: { zoom: number; anchorScreen: ScreenPoint; anchorMerc: MercPoint } | null = null;

  private pointers = new Map<number, PointerState>();
  private lastPointerTime = 0;
  private pinchDistance = 0;
  private velocityX = 0;
  private velocityY = 0;
  private inertia: { velocityX: number; velocityY: number } | null = null;
  private zoomAnimation: {
    from: number;
    to: number;
    start: number;
    duration: number;
    anchorScreen: ScreenPoint;
    anchorMerc: MercPoint;
  } | null = null;
  private lastFrameTime = 0;

  constructor(options: GestureOptions) {
    this.camera = options.camera;
    this.element = options.element;
    this.onChange = options.onChange;
    this.zoomDuration = options.zoomDuration ?? 180;
    this.inertiaTau = options.inertiaTau ?? 180;
    this.maxInertiaSpeed = options.maxInertiaSpeed ?? 4; // px/ms
    this.wheelBehavior = options.wheelBehavior ?? 'auto';

    const element = this.element;
    element.style.touchAction = 'none';
    if (!element.hasAttribute('tabindex')) element.tabIndex = 0;

    element.addEventListener('pointerdown', this.handlePointerDown);
    element.addEventListener('pointermove', this.handlePointerMove);
    element.addEventListener('pointerup', this.handlePointerUp);
    element.addEventListener('pointercancel', this.handlePointerUp);
    element.addEventListener('pointerleave', this.handlePointerUp);
    element.addEventListener('wheel', this.handleWheel, { passive: false });
    element.addEventListener('dblclick', this.handleDoubleClick);
    element.addEventListener('keydown', this.handleKeyDown);
    element.addEventListener('contextmenu', this.handleContextMenu);
    // Safari trackpad pinch (also stops Safari's own page zoom)
    element.addEventListener('gesturestart', this.handleGestureStart as EventListener);
    element.addEventListener('gesturechange', this.handleGestureChange as EventListener);
    element.addEventListener('gestureend', this.handleGestureEnd as EventListener);
  }

  /** event position relative to the element's top-left corner, in CSS px */
  private getLocalPoint(event: PointerEvent | WheelEvent | MouseEvent): ScreenPoint {
    const rect = this.element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  /** average screen position of all active pointers */
  private getPointerMidpoint(): ScreenPoint {
    let sumX = 0;
    let sumY = 0;
    for (const pointer of this.pointers.values()) {
      sumX += pointer.x;
      sumY += pointer.y;
    }
    return { x: sumX / this.pointers.size, y: sumY / this.pointers.size };
  }

  /** distance between the first two active pointers (0 if fewer than two) */
  private getPointerSpread(): number {
    const points = [...this.pointers.values()];
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }

  /** queue an eased zoom to `target`, pinned at `anchor` */
  zoomToAnimated(target: number, anchor?: ScreenPoint | null, duration = this.zoomDuration): void {
    const anchorScreen = anchor ?? { x: this.camera.width / 2, y: this.camera.height / 2 };
    const clampedTarget = Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, target));
    this.inertia = null;
    this.zoomAnimation = {
      from: this.camera.zoom,
      to: clampedTarget,
      start: performance.now(),
      duration,
      anchorScreen,
      anchorMerc: this.camera.unproject(anchorScreen.x, anchorScreen.y)
    };
    this.onChange();
  }

  get zoomTarget(): number {
    return this.zoomAnimation ? this.zoomAnimation.to : this.camera.zoom;
  }

  /** drop any inertia and in-flight zoom easing (used when pausing the map) */
  stop(): void {
    this.inertia = null;
    this.zoomAnimation = null;
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    this.element.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, this.getLocalPoint(event));
    this.lastPointerTime = event.timeStamp;
    this.velocityX = this.velocityY = 0;
    this.stop();
    if (this.pointers.size === 2) this.pinchDistance = this.getPointerSpread();
    this.element.focus({ preventScroll: true });
  };

  private handlePointerMove = (event: PointerEvent): void => {
    const previous = this.pointers.get(event.pointerId);
    if (!previous) return;
    event.preventDefault();

    const before = this.pointers.size >= 2 ? this.getPointerMidpoint() : { ...previous };
    const next = this.getLocalPoint(event);
    this.pointers.set(event.pointerId, next);

    if (this.pointers.size >= 2) {
      // pinch: zoom by the distance ratio around the (moving) midpoint
      const after = this.getPointerMidpoint();
      const distance = this.getPointerSpread();
      if (this.pinchDistance > 0 && distance > 0) {
        const zoomDelta = Math.log2(distance / this.pinchDistance);
        this.camera.zoomTo(this.camera.zoom + zoomDelta, after);
      }
      this.pinchDistance = distance;
      this.camera.panByPixels(after.x - before.x, after.y - before.y);
      this.onChange();
      return;
    }

    const deltaX = next.x - before.x;
    const deltaY = next.y - before.y;
    const deltaTime = Math.max(1, event.timeStamp - this.lastPointerTime);
    this.lastPointerTime = event.timeStamp;
    // low-pass filtered velocity, px/ms
    const smoothing = 0.7;
    this.velocityX = this.velocityX * (1 - smoothing) + (deltaX / deltaTime) * smoothing;
    this.velocityY = this.velocityY * (1 - smoothing) + (deltaY / deltaTime) * smoothing;

    this.camera.panByPixels(deltaX, deltaY);
    this.onChange();
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (!this.pointers.delete(event.pointerId)) return;
    if (this.element.hasPointerCapture?.(event.pointerId)) this.element.releasePointerCapture(event.pointerId);
    if (this.pointers.size === 1) {
      this.pinchDistance = 0;
      this.lastPointerTime = event.timeStamp;
      return;
    }
    if (this.pointers.size > 0) return;

    const speed = Math.hypot(this.velocityX, this.velocityY);
    const stale = event.timeStamp - this.lastPointerTime > 80;
    if (speed > 0.05 && !stale) {
      const clampFactor = Math.min(1, this.maxInertiaSpeed / speed);
      this.inertia = { velocityX: this.velocityX * clampFactor, velocityY: this.velocityY * clampFactor };
      this.lastFrameTime = 0;
      this.onChange();
    }
    this.velocityX = this.velocityY = 0;
  };

  private handleContextMenu = (event: Event): void => {
    if (this.pointers.size) event.preventDefault();
  };

  /**
   * Precision-touchpad detection. Touchpads emit fractional, tiny or diagonal
   * deltas at high frequency; notched wheels emit large integer steps (or use
   * line/page deltaMode). The verdict is sticky for 800ms so the big deltas in
   * the middle of a fast two-finger flick don't get misread as a mouse wheel.
   */
  private isTouchpad(event: WheelEvent): boolean {
    if (event.deltaMode !== 0) {
      this.touchpadUntil = 0;
      return false;
    }
    const absDeltaX = Math.abs(event.deltaX);
    const absDeltaY = Math.abs(event.deltaY);
    const fractional = !Number.isInteger(event.deltaY) || !Number.isInteger(event.deltaX);
    const tiny = absDeltaY > 0 && absDeltaY < 8;
    const diagonal = absDeltaX > 0 && absDeltaY > 0;
    const horizontalOnly = absDeltaX > 0 && absDeltaY === 0;
    const sinceLastWheel = event.timeStamp - this.lastWheelTime;
    this.lastWheelTime = event.timeStamp;

    if (fractional || tiny || diagonal || horizontalOnly) {
      this.touchpadUntil = event.timeStamp + 800;
    } else if (absDeltaY >= 50 && absDeltaX === 0 && sinceLastWheel > 100) {
      // an isolated big integer step is a notched wheel click: drop the sticky
      // verdict immediately so plugging in a mouse works mid-session. Events
      // inside a flick arrive every ~10ms, so they can't trip this.
      this.touchpadUntil = 0;
    }
    return event.timeStamp < this.touchpadUntil;
  }

  private handleWheel = (event: WheelEvent): void => {
    event.preventDefault();

    const touchpad = this.isTouchpad(event);
    // macOS/Chrome/Firefox report a trackpad pinch as ctrl+wheel
    const pinch = event.ctrlKey;
    const wantsZoom = pinch || event.metaKey || event.shiftKey;
    const pans = !wantsZoom && (this.wheelBehavior === 'pan' || (this.wheelBehavior === 'auto' && touchpad));

    if (pans) {
      // 1:1 two-finger pan; the OS already supplies the momentum tail, so we
      // don't add our own inertia here (and we cancel any that's running).
      this.inertia = null;
      this.camera.panByPixels(-event.deltaX, -event.deltaY);
      this.onChange();
      return;
    }

    let delta = event.deltaY;
    if (event.deltaMode === 1)
      delta *= 40; // lines
    else if (event.deltaMode === 2) delta *= this.camera.height; // pages

    if (pinch) {
      // track the fingers directly — easing a pinch feels laggy
      this.stop();
      this.camera.zoomBy(-delta / 100, this.getLocalPoint(event));
      this.onChange();
      return;
    }

    // touchpad scroll used as zoom needs a gentler rate than a notched wheel
    const rate = touchpad ? 1 / 220 : 1 / 450;
    const duration = touchpad ? 90 : this.zoomDuration;
    this.zoomToAnimated(this.zoomTarget - delta * rate, this.getLocalPoint(event), duration);
  };

  private handleGestureStart = (event: SafariGestureEvent): void => {
    event.preventDefault();
    this.stop();
    const anchorScreen = this.getLocalPoint(event);
    this.safariGesture = {
      zoom: this.camera.zoom,
      anchorScreen,
      anchorMerc: this.camera.unproject(anchorScreen.x, anchorScreen.y)
    };
  };

  private handleGestureChange = (event: SafariGestureEvent): void => {
    event.preventDefault();
    if (!this.safariGesture) return;
    const scale = Math.max(0.05, event.scale || 1);
    this.camera.zoomTo(this.safariGesture.zoom + Math.log2(scale), this.safariGesture.anchorScreen, this.safariGesture.anchorMerc);
    this.onChange();
  };

  private handleGestureEnd = (event: SafariGestureEvent): void => {
    event.preventDefault();
    this.safariGesture = null;
  };

  private handleDoubleClick = (event: MouseEvent): void => {
    event.preventDefault();
    const zoomDelta = event.shiftKey ? -1 : 1;
    this.zoomToAnimated(Math.round(this.zoomTarget) + zoomDelta, this.getLocalPoint(event), 260);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    const step = event.shiftKey ? 200 : 80;
    switch (event.key) {
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
    event.preventDefault();
    this.onChange();
  };

  /** advance inertia + zoom easing; returns true while something is animating */
  update(now: number): boolean {
    let animating = false;
    const deltaTime = this.lastFrameTime ? Math.min(64, now - this.lastFrameTime) : 16;
    this.lastFrameTime = now;

    if (this.zoomAnimation) {
      const animation = this.zoomAnimation;
      const progress = animation.duration <= 0 ? 1 : Math.min(1, (now - animation.start) / animation.duration);
      const zoom = animation.from + (animation.to - animation.from) * easeOut(progress);
      this.camera.zoomTo(zoom, animation.anchorScreen, animation.anchorMerc);
      if (progress >= 1) this.zoomAnimation = null;
      else animating = true;
    }

    if (this.inertia) {
      const inertia = this.inertia;
      this.camera.panByPixels(inertia.velocityX * deltaTime, inertia.velocityY * deltaTime);
      const decay = Math.exp(-deltaTime / this.inertiaTau);
      inertia.velocityX *= decay;
      inertia.velocityY *= decay;
      if (Math.hypot(inertia.velocityX, inertia.velocityY) < 0.01) this.inertia = null;
      else animating = true;
    }

    if (this.pointers.size) animating = true;
    return animating;
  }

  /**
   * Detach every listener. The map is created once and reused, so this is only
   * needed if the whole element is being thrown away — pausing uses stop().
   */
  destroy(): void {
    const element = this.element;
    element.removeEventListener('pointerdown', this.handlePointerDown);
    element.removeEventListener('pointermove', this.handlePointerMove);
    element.removeEventListener('pointerup', this.handlePointerUp);
    element.removeEventListener('pointercancel', this.handlePointerUp);
    element.removeEventListener('pointerleave', this.handlePointerUp);
    element.removeEventListener('wheel', this.handleWheel);
    element.removeEventListener('dblclick', this.handleDoubleClick);
    element.removeEventListener('keydown', this.handleKeyDown);
    element.removeEventListener('contextmenu', this.handleContextMenu);
    element.removeEventListener('gesturestart', this.handleGestureStart as EventListener);
    element.removeEventListener('gesturechange', this.handleGestureChange as EventListener);
    element.removeEventListener('gestureend', this.handleGestureEnd as EventListener);
  }
}

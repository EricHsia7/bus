import { clamp } from './math';

type Position = [x: number, y: number];

export class Viewport {
  /**
   * The viewport element
   */
  element: HTMLElement;

  /**
   * - The horizontal offset form the left of the browser viewport
   * - DOMRect.left
   */
  elementLeft: DOMRect['left'];

  /**
   * - The vertical offset form the top of the browser viewport
   * - DOMRect.top
   */
  elementTop: DOMRect['top'];

  /**
   * - The width of the viewport (in pixels)
   * - DOMRect.width
   */
  elementWidth: DOMRect['width'];

  /**
   * - The height of the viewport (in pixels)
   * - DOMRect.height
   */
  elementHeight: DOMRect['height'];

  /**
   * - scale = screen unit / world unit
   * - screen unit is pixel
   */
  scale: number;

  /**
   * - The horizontal offset from the left of the viewport (in pixels)
   * - The x coordinate of the pointer
   */
  screenX: number;

  /**
   * - The vertical offset from the top of the viewport (in pixels)
   * - The y coordinate of the pointer
   */
  screenY: number;

  /**
   * The horizontal translation (in pixels)
   */
  offsetX: number;

  /**
   * The vertical translation (in pixels)
   */
  offsetY: number;

  /**
   * - The horizontal offset from the origin of the world (in world unit)
   * - worldX = (screenX - offsetX) / scale
   */
  worldX: number;

  /**
   * - The vertical offset from the origin of the world (in world unit)
   * - worldY = (screenY - offsetY) / scale
   */
  worldY: number;

  /**
   * - 0: none
   * - 1: dragging
   * - 2: pinching
   */
  state: 0 | 1 | 2;

  pinchDistance: number;

  pointers: Map<PointerEvent['pointerId'], Position>;

  /**
   * - The function called when dragging
   * - scale or offsetX/offsetY might change when dragging
   */
  callback: Function;

  constructor(element: HTMLElement, callback: Function) {
    this.scale = 1;
    this.screenX = 0;
    this.screenY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.worldX = 0;
    this.worldY = 0;

    const elementBoundingClientRect = element.getBoundingClientRect();
    this.element = element;
    this.elementLeft = elementBoundingClientRect.left;
    this.elementTop = elementBoundingClientRect.top;
    this.elementWidth = elementBoundingClientRect.width;
    this.elementHeight = elementBoundingClientRect.height;

    this.callback = callback;
    this.state = 0;
    this.pinchDistance = 0;
    this.pointers = new Map();

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handlePointerCancel = this.handlePointerCancel.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleWheel = this.handleWheel.bind(this);

    this.element.addEventListener('pointerdown', this.handlePointerDown);
    this.element.addEventListener('pointermove', this.handlePointerMove);
    this.element.addEventListener('pointerup', this.handlePointerUp);
    this.element.addEventListener('pointerleave', this.handlePointerLeave);
    this.element.addEventListener('pointercancel', this.handlePointerCancel);
    this.element.addEventListener('contextmenu', this.handleContextMenu);
    this.element.addEventListener('wheel', this.handleWheel, { passive: false });
  }

  getScreenPosition(event: PointerEvent): Position {
    return [event.clientX - this.elementLeft, event.clientY - this.elementTop];
  }

  handlePointerDown(event: PointerEvent): void {
    this.screenX = event.clientX - this.elementLeft;
    this.screenY = event.clientY - this.elementTop;
    this.pointers.set(event.pointerId, [this.screenX, this.screenY]);
    this.worldX = (this.screenX - this.offsetX) / this.scale;
    this.worldY = (this.screenY - this.offsetY) / this.scale;
    if (this.pointers.size === 2) {
      this.state = 2;
      const pointers = Array.from(this.pointers.values());
      this.pinchDistance = Math.hypot(pointers[0][0] - pointers[1][0], pointers[0][1] - pointers[1][1]);
    } else if (this.pointers.size === 1) {
      this.state = 1;
    }
    this.element.setPointerCapture(event.pointerId);
  }

  handlePointerMove(event: PointerEvent): void {
    const currentScreenX = event.clientX - this.elementLeft;
    const currentScreenY = event.clientY - this.elementTop;
    this.pointers.set(event.pointerId, [currentScreenX, currentScreenY]);
    if (this.state === 1) {
      this.offsetX += currentScreenX - this.screenX;
      this.offsetY += currentScreenY - this.screenY;
      this.screenX = currentScreenX;
      this.screenY = currentScreenY;
      this.worldX = (this.screenX - this.offsetX) / this.scale;
      this.worldY = (this.screenY - this.offsetY) / this.scale;
      this.callback();
    }
    if (this.state === 2) {
      const pointers = Array.from(this.pointers.values());
      const midpointX = (pointers[0][0] + pointers[1][0]) / 2;
      const midpointY = (pointers[0][1] + pointers[1][1]) / 2;
      const distance = Math.hypot(pointers[0][0] - pointers[1][0], pointers[0][1] - pointers[1][1]);
      this.zoomAt(midpointX, midpointY, Math.pow(0.9987, distance / this.pinchDistance));
      this.pinchDistance = distance;
    }
  }

  handlePointerUp(event: PointerEvent): void {
    event.preventDefault();
    this.state = 0;
    this.screenX = event.clientX - this.elementLeft;
    this.screenY = event.clientY - this.elementTop;
    this.worldX = (this.screenX - this.offsetX) / this.scale;
    this.worldY = (this.screenY - this.offsetY) / this.scale;
    this.pointers.delete(event.pointerId);
    this.callback();
  }

  handlePointerLeave(event: PointerEvent): void {
    event.preventDefault();
    this.state = 0;
    this.screenX = event.clientX - this.elementLeft;
    this.screenY = event.clientY - this.elementTop;
    this.worldX = (this.screenX - this.offsetX) / this.scale;
    this.worldY = (this.screenY - this.offsetY) / this.scale;
    this.pointers.delete(event.pointerId);
    this.callback();
  }

  handlePointerCancel(event: PointerEvent): void {
    event.preventDefault();
    this.state = 0;
    this.screenX = event.clientX - this.elementLeft;
    this.screenY = event.clientY - this.elementTop;
    this.worldX = (this.screenX - this.offsetX) / this.scale;
    this.worldY = (this.screenY - this.offsetY) / this.scale;
    this.pointers.delete(event.pointerId);
    this.callback();
  }

  handleContextMenu(event: Event): void {
    event.preventDefault();
    this.state = 0;
  }

  handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const currentScreenX = event.clientX - this.elementLeft;
    const currentScreenY = event.clientY - this.elementTop;
    this.screenX = currentScreenX;
    this.screenY = currentScreenY;
    this.worldX = (this.screenX - this.offsetX) / this.scale;
    this.worldY = (this.screenY - this.offsetY) / this.scale;
    this.zoomAt(currentScreenX, currentScreenY, Math.pow(0.9987, event.deltaY));
  }

  zoomAt(screenX: number, screenY: number, factor: number): void {
    const currentWorldX = (screenX - this.offsetX) / this.scale;
    const currentWorldY = (screenY - this.offsetY) / this.scale;
    const nextScale = clamp(this.scale * factor, 0.15, 8);
    this.offsetX = screenX - currentWorldX * nextScale;
    this.offsetY = screenY - currentWorldY * nextScale;
    this.scale = nextScale;
    this.callback();
  }

  zoomTo(worldX: number, worldY: number): void {}

  toWorldCoordinate(screenX: number, screenY: number): Position {
    return [(screenX - this.offsetX) / this.scale, (screenY - this.offsetY) / this.scale];
  }

  toScreenCoordinate(worldX: number, worldY: number): Position {
    return [worldX * this.scale + this.offsetX, worldY * this.scale + this.offsetY];
  }
}

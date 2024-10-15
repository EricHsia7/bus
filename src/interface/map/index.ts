import { MapObject } from '../../data/map/index';
import { drawLine, drawPoint } from '../../tools/graphic';
import { supportTouch } from '../../tools/index';
import { FieldSize } from '../index';

let previousIntegration = {};

const mapCanvasElement = document.getElementById('map_canvas');
const ctx = mapCanvasElement.getContext('2d');

const maxScale = 5;
const minScale = 0.001;
let devicePixelRatio = window.devicePixelRatio;
let canvasWidth = window.innerWidth * devicePixelRatio;
let canvasHeight = window.innerHeight * devicePixelRatio;

const lineWidth = 5;
const strokeStyle = 'red';

let scale = 1;
let translation = { x: 0, y: 0 };

// Pan and zoom variables
let isDragging = false;
let startX, startY;
let lastTouchDist = null; // Used for pinch zoom

let objectsInViewport = [];
let objectsAtVisibleScale = [];

function queryMapFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function resizeMapField(): void {
  const size = queryMapFieldSize();
  canvasWidth = size.width;
  canvasHeight = size.height;
  mapCanvasElement.width = canvasWidth;
  mapCanvasElement.height = canvasHeight;
  updateMapCanvas();
}

// Function to draw the plane with points and paths
function updateMapCanvas() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();
  ctx.translate(translation.x * devicePixelRatio, translation.y * devicePixelRatio);
  ctx.scale(scale * devicePixelRatio, scale * devicePixelRatio);

  // Draw points
  for (const objectIndex of objectsInViewport) {
    const object: MapObject = previousIntegration.objects[objectIndex];
    switch (object.type) {
      case 'route':
        drawLine(
          ctx,
          object.points.map((point) => {
            return { x: point.x * devicePixelRatio, y: point.y * devicePixelRatio };
          }),
          strokeStyle,
          lineWidth / scale
        );
        break;
      case 'location':
        break;
      default:
        break;
    }
  }

  ctx.restore();
}

// Handle zooming with mouse wheel
function onWheel(event) {
  event.preventDefault();
  const zoomFactor = 0.1;
  const delta = event.deltaY > 0 ? 1 : -1;
  const newScale = scale - delta * zoomFactor;

  if (newScale >= minScale && newScale <= maxScale) {
    const mousePos = { x: event.offsetX - translation.x, y: event.offsetY - translation.y };
    const zoomRatio = newScale / scale;
    translation.x -= mousePos.x * (zoomRatio - 1);
    translation.y -= mousePos.y * (zoomRatio - 1);
    scale = newScale;
  }
  updateMapCanvas();
}

// Handle panning with mouse
function onMouseDown(event) {
  isDragging = true;
  startX = event.clientX - translation.x;
  startY = event.clientY - translation.y;
}

function onMouseMove(event) {
  if (isDragging) {
    translation.x = event.clientX - startX;
    translation.y = event.clientY - startY;
    updateMapCanvas();
  }
}

function onMouseUp() {
  isDragging = false;
}

// Handle touch start for panning and zooming
function onTouchStart(event) {
  event.preventDefault();
  if (event.touches.length === 1) {
    isDragging = true;
    startX = event.touches[0].clientX - translation.x;
    startY = event.touches[0].clientY - translation.y;
    lastTouchDist = null; // Reset pinch distance when only one finger is used
  } else if (event.touches.length === 2) {
    // Pinch zoom
    lastTouchDist = getTouchDistance(event.touches);
  }
}

function onTouchMove(event) {
  event.preventDefault();
  if (event.touches.length === 1 && isDragging) {
    translation.x = event.touches[0].clientX - startX;
    translation.y = event.touches[0].clientY - startY;
    updateMapCanvas();
  } else if (event.touches.length === 2 && lastTouchDist) {
    // Handle pinch zoom
    const newDist = getTouchDistance(event.touches);
    const zoomFactor = newDist / lastTouchDist;
    const newScale = scale * zoomFactor;

    if (newScale >= minScale && newScale <= maxScale) {
      // Center zoom around midpoint between two touch points
      const midpoint = {
        x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
        y: (event.touches[0].clientY + event.touches[1].clientY) / 2
      };

      const mousePos = { x: midpoint.x - translation.x, y: midpoint.y - translation.y };
      const zoomRatio = newScale / scale;
      translation.x -= mousePos.x * (zoomRatio - 1);
      translation.y -= mousePos.y * (zoomRatio - 1);

      scale = newScale;
      lastTouchDist = newDist;
      updateMapCanvas();
    }
  }
}

function onTouchEnd(event) {
  event.preventDefault();
  isDragging = false;
  lastTouchDist = null;
}

// Calculate the distance between two touch points
function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Add new points with a double-click (or tap)
function addNewPoint(x, y) {
  const worldX = (x - translation.x) / scale / devicePixelRatio;
  const worldY = (y - translation.y) / scale / devicePixelRatio;
  outsidePoints.push({ x: worldX, y: worldY });
  updateMapCanvas();
}

export function initializeMapInteraction(): void {
  // Automatically switch between touch and mouse event listeners based on device capabilities
  if (supportTouch()) {
    // Touch events for mobile
    mapCanvasElement.addEventListener('touchstart', onTouchStart, { passive: false });
    mapCanvasElement.addEventListener('touchmove', onTouchMove, { passive: false });
    mapCanvasElement.addEventListener('touchend', onTouchEnd, { passive: false });
  } else {
    // Mouse events for desktop
    mapCanvasElement.addEventListener('wheel', onWheel);
    mapCanvasElement.addEventListener('mousedown', onMouseDown);
    mapCanvasElement.addEventListener('mousemove', onMouseMove);
    mapCanvasElement.addEventListener('mouseup', onMouseUp);
    mapCanvasElement.addEventListener('mouseleave', onMouseUp);
  }
  updateMapCanvas();
}

import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, FieldSize, openPreviousPage, pushPageHistory, revokePageHistory } from '../index';
import { integrateMap, MapObject } from '../../data/map/index';
import { drawLine, drawPoint } from '../../tools/graphic';
import { generateIdentifier, supportTouch } from '../../tools/index';

let currentIntegration = {};

const MapField = documentQuerySelector('.css_map_field');
const mapCanvasElement = elementQuerySelector(MapField, '#map_canvas');
const ctx = mapCanvasElement.getContext('2d');

const devicePixelRatio = window.devicePixelRatio;
let canvasWidth = window.innerWidth * devicePixelRatio;
let canvasHeight = window.innerHeight * devicePixelRatio;
let chunkWidth = 200;
let chunkHeight = 200;

const lineWidth = 5;
const pointRadius = 3;
const strokeStyle = 'red';
const fill = 'blue';
const maxScale = 5;
const minScale = 0.001;

let scale = 1;
let translation = { x: 0, y: 0 };
let isDragging = false;
let startX, startY;
let lastTouchDist = null; // Used for pinch zoom

// Visible Objects
let objectsInViewport = [];
let objectsAtVisibleScale = [];

function queryMapFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function ResizeMapCanvas(): void {
  const size = queryMapFieldSize();
  canvasWidth = size.width;
  canvasHeight = size.height;
  mapCanvasElement.width = canvasWidth;
  mapCanvasElement.height = canvasHeight;
  updateVisibleObjects();
  updateMapCanvas();
}

// Handle zooming with mouse wheel
function onWheel(event: Event): void {
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
  updateVisibleObjects();
  updateMapCanvas();
}

function onMouseDown(event: Event): void {
  isDragging = true;
  startX = event.clientX - translation.x;
  startY = event.clientY - translation.y;
}

function onMouseMove(event: Event): void {
  if (isDragging) {
    translation.x = event.clientX - startX;
    translation.y = event.clientY - startY;
    updateVisibleObjects();
    updateMapCanvas();
  }
}

function onMouseUp(): void {
  isDragging = false;
}

function getTouchDistance(touches: TouchList): number {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function onTouchStart(event: Event): void {
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

function onTouchMove(event: Event): void {
  event.preventDefault();
  if (event.touches.length === 1 && isDragging) {
    translation.x = event.touches[0].clientX - startX;
    translation.y = event.touches[0].clientY - startY;
    updateVisibleObjects();
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
      updateVisibleObjects();
      updateMapCanvas();
    }
  }
}

function onTouchEnd(event: Event): void {
  event.preventDefault();
  isDragging = false;
  lastTouchDist = null;
}

interface ViewportCorners {
  topLeft: {
    x: number;
    y: number;
  };
  bottomRight: {
    x: number;
    y: number;
  };
}

function getViewportCorners(): ViewportCorners {
  const topLeftX = (-1 * translation.x) / scale;
  const topLeftY = (-1 * translation.y) / scale;

  const bottomRightX = (canvasWidth / devicePixelRatio - translation.x) / scale;
  const bottomRightY = (canvasHeight / devicePixelRatio - translation.y) / scale;

  return {
    topLeft: {
      x: topLeftX,
      y: topLeftY
    },
    bottomRight: {
      x: bottomRightX,
      y: bottomRightY
    }
  };
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
}

function updateMapCanvas(): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();
  ctx.translate(translation.x * devicePixelRatio, translation.y * devicePixelRatio);
  ctx.scale(scale * devicePixelRatio, scale * devicePixelRatio);

  for (const objectIndex of objectsInViewport) {
    const object: MapObject = currentIntegration.objects[objectIndex];
    switch (object.type) {
      case 'route':
        drawLine(
          ctx,
          object.points.map((point) => {
            return { x: point[0] * devicePixelRatio, y: point[1] * devicePixelRatio };
          }),
          strokeStyle,
          lineWidth / scale
        );
        break;
      case 'location':
        drawPoint(ctx, object.point[0] * devicePixelRatio, object.point[1] * devicePixelRatio, pointRadius / scale, fill, strokeStyle, lineWidth / 2 / scale);
        break;
      default:
        break;
    }
  }

  ctx.restore();
}

function updateVisibleObjects(): void {
  if (currentIntegration.hasOwnProperty('boundary')) {
    const integrationBoundary = currentIntegration.boundary;
    const integrationTopLeftChunkX = integrationBoundary.topLeft.x;
    const integrationTopLeftChunkY = integrationBoundary.topLeft.y;
    const integrationBottomRightChunkX = integrationBoundary.bottomRight.x;
    const integrationBottomRightChunkY = integrationBoundary.bottomRight.y;

    const currentViewportCorners = getViewportCorners();
    const currentTopLeftX = currentViewportCorners.topLeft.x;
    const currentTopLeftY = currentViewportCorners.topLeft.y;
    const currentBottomRightX = currentViewportCorners.bottomRight.x;
    const currentBottomRightY = currentViewportCorners.bottomRight.y;

    const currentTopLeftChunkX = Math.floor(currentTopLeftX / chunkWidth) + integrationTopLeftChunkX;
    const currentTopLeftChunkY = Math.floor(currentTopLeftY / chunkHeight) + integrationTopLeftChunkY;
    const currentBottomRightChunkX = Math.floor(currentBottomRightX / chunkWidth) + integrationBottomRightChunkX;
    const currentBottomRightChunkY = Math.floor(currentBottomRightY / chunkHeight) + integrationBottomRightChunkY;

    let objects = [];
    for (let i = currentBottomRightChunkX; i < currentTopLeftChunkX; i++) {
      for (let j = currentBottomRightChunkY; j < currentTopLeftChunkY; j++) {
        const chunkKey = `c_${i}_${j}`;
        if (currentIntegration.hasOwnProperty(chunkKey)) {
          objects = objects.concat(currentIntegration[chunkKey]);
        }
      }
    }

    objectsInViewport = objects;
  }
}

export async function initializeMapCanvas(): void {
  const requestID = generateIdentifier('r');
  const integration = await integrateMap(requestID);
  currentIntegration = integration;
  ResizeMapCanvas();
}

export function openMap(): void {
  pushPageHistory('Map');
  MapField.setAttribute('displayed', 'true');
  initializeMapCanvas();
  closePreviousPage();
}

export function closeMap(): void {
  // revokePageHistory('Map');
  MapField.setAttribute('displayed', 'false');
  openPreviousPage();
}

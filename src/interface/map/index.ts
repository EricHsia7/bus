import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, FieldSize, openPreviousPage, pushPageHistory } from '../index';
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

const chunkWidth = 300;
const chunkHeight = 300;
const interval = 0.01;

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

function queryMapFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function ResizeMapCanvas(): void {
  const size = queryMapFieldSize();
  canvasWidth = size.width * devicePixelRatio;
  canvasHeight = size.height * devicePixelRatio;
  mapCanvasElement.width = canvasWidth;
  mapCanvasElement.height = canvasHeight;
  // ctx.scale(scale * devicePixelRatio, scale * devicePixelRatio); // Ensure the context is scaled correctly.
  updateMapCanvas();
}

function onWheel(event: WheelEvent): void {
  event.preventDefault();
  const zoomFactor = 0.1;
  const delta = event.deltaY > 0 ? 1 : -1;
  const newScale = scale - delta * zoomFactor;

  if (newScale >= minScale && newScale <= maxScale) {
    // Adjust for devicePixelRatio in zoom calculations
    const mousePos = {
      x: (event.offsetX - translation.x) / devicePixelRatio,
      y: (event.offsetY - translation.y) / devicePixelRatio
    };
    const zoomRatio = newScale / scale;
    translation.x -= mousePos.x * (zoomRatio - 1) * devicePixelRatio;
    translation.y -= mousePos.y * (zoomRatio - 1) * devicePixelRatio;
    scale = newScale;
  }
  updateMapCanvas();
}

function onMouseDown(event: Event): void {
  event.preventDefault();
  isDragging = true;
  startX = event.clientX - translation.x;
  startY = event.clientY - translation.y;
}

function onMouseMove(event: Event): void {
  event.preventDefault();
  if (isDragging) {
    translation.x = event.clientX - startX;
    translation.y = event.clientY - startY;
    updateMapCanvas();
  }
}

function onMouseUp(event: Event): void {
  event.preventDefault();
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

function onTouchMove(event: TouchEvent): void {
  event.preventDefault();
  if (event.touches.length === 1 && isDragging) {
    translation.x = (event.touches[0].clientX - startX) * devicePixelRatio;
    translation.y = (event.touches[0].clientY - startY) * devicePixelRatio;
    updateMapCanvas();
  } else if (event.touches.length === 2 && lastTouchDist) {
    const newDist = getTouchDistance(event.touches);
    const zoomFactor = newDist / lastTouchDist;
    const newScale = scale * zoomFactor;

    if (newScale >= minScale && newScale <= maxScale) {
      const midpoint = {
        x: (event.touches[0].clientX + event.touches[1].clientX) / 2 / devicePixelRatio,
        y: (event.touches[0].clientY + event.touches[1].clientY) / 2 / devicePixelRatio
      };

      const mousePos = {
        x: midpoint.x - translation.x / devicePixelRatio,
        y: midpoint.y - translation.y / devicePixelRatio
      };
      const zoomRatio = newScale / scale;
      translation.x -= mousePos.x * (zoomRatio - 1) * devicePixelRatio;
      translation.y -= mousePos.y * (zoomRatio - 1) * devicePixelRatio;

      scale = newScale;
      lastTouchDist = newDist;
      updateMapCanvas();
    }
  }
}

function onTouchEnd(event: Event): void {
  event.preventDefault();
  isDragging = false;
  lastTouchDist = null;
}

function getPointInChunk(longitude: number, latitude: number): { x: number; y: number } {
  const x = (longitude / interval) * chunkWidth * devicePixelRatio // * scale
  const y = (latitude / interval) * chunkHeight * devicePixelRatio // * scale
  return { x, y };
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
  const topLeftX = (-1 * translation.x) / scale / devicePixelRatio;
  const topLeftY = (-1 * translation.y) / scale / devicePixelRatio;

  const bottomRightX = (canvasWidth - translation.x * devicePixelRatio) / scale / devicePixelRatio;
  const bottomRightY = (canvasHeight - translation.y * devicePixelRatio) / scale / devicePixelRatio;

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

function renderChunk(chunkX: number, chunkY: number): void {
  const thisChunkKey = `c_${chunkX}_${chunkY}`;
  if (currentIntegration.chunks.hasOwnProperty(thisChunkKey)) {
    const thisChunk = currentIntegration.chunks[thisChunkKey];
    for (const objectIndex of thisChunk) {
      const object: MapObject = currentIntegration.objects[objectIndex];
      switch (object.type) {
        case 'route':
          drawLine(
            ctx,
            object.points.map((point) => {
              return getPointInChunk(point[0], point[1]);
            }),
            strokeStyle,
            lineWidth / scale
          );
          break;
        case 'location':
          const pointInChunk = getPointInChunk(object.point[0], object.point[1]);
          drawPoint(ctx, pointInChunk.x, pointInChunk.y, pointRadius / scale, fill, strokeStyle, lineWidth / 2 / scale);
          break;
        default:
          break;
      }
    }
  }
}

function updateMapCanvas(): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();
  ctx.translate(translation.x, translation.y);
  ctx.scale(scale, scale);

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

    const chunkXRange = Math.abs(currentBottomRightChunkX - currentTopLeftChunkX);
    const chunkYRange = Math.abs(currentBottomRightChunkY - currentTopLeftChunkY);
    drawLine(ctx, [{ x: 0, y: 0 }, getPointInChunk(121, 24)], 'green', (6 / scale) * devicePixelRatio);

    for (let i = 0; i < chunkXRange; i++) {
      for (let j = 0; j < chunkYRange; j++) {
        renderChunk(i + currentTopLeftChunkX, j + currentTopLeftChunkY);
      }
    }
  }
  ctx.restore();
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

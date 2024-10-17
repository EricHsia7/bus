import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { closePreviousPage, FieldSize, openPreviousPage, pushPageHistory } from '../index';
import { integrateMap, MapObject } from '../../data/map/index';
import { generateSVGCircle } from '../../tools/graphic';
import { generateIdentifier, supportTouch } from '../../tools/index';
import { mercatorProjection } from '../../tools/convert';

let currentIntegration = {};

const MapField = documentQuerySelector('.css_map_field');
const MapBodyElement = elementQuerySelector(MapField, '.css_map_body');
const MapSVGElement = elementQuerySelector(MapBodyElement, 'svg#map');
const RouteLayerElement = elementQuerySelector(MapSVGElement, 'g#map-route-layer');
const LocationLayerElement = elementQuerySelector(MapSVGElement, 'g#map-location-layer');

const lineWidth = 0.001;
const pointRadius = 0.1;
const strokeStyle = 'red';
const fill = 'blue';

const chunkWidth = 60;
const chunkHeight = 60;
const interval = 0.01;
const maxScale = 5;
const minScale = 0.001;

let fieldWidth = 0;
let fieldHeight = 0;

let translateX = 0;
let translateY = 0;
let scale = 1;

let deltaTranslateX = 0;
let deltaTranslateY = 0;
let deltaScale = 1;

let pointers = {};
let initialPointers = {};

const sameSessionTime = 300; // 300 ms
let sessionStarted = false;
let sessionTime = 0;

function queryMapFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function ResizeMapField(): void {
  const size = queryMapFieldSize();
  fieldWidth = size.width;
  fieldHeight = size.height;
  MapSVGElement.setAttributeNS(null, 'width', `${fieldWidth}px`);
  MapSVGElement.setAttributeNS(null, 'height', `${fieldHeight}px`);
  MapSVGElement.setAttributeNS(null, 'viewbox', `0,0,${fieldWidth},${fieldHeight}`);
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
  const topLeftX = -1 * translateX;
  const topLeftY = -1 * translateY;

  const bottomRightX = topLeftX + fieldWidth;
  const bottomRightY = topLeftY + fieldHeight;

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

function getPointInChunk(longitude: number, latitude: number): { x: number; y: number }{
 return  mercatorProjection(latitude - currentIntegration.boundary.bottomRight.latitude, longitude - currentIntegration.boundary.topLeft.longitude, 1)
}

function renderChunk(chunkX: number, chunkY: number): void {
  const thisChunkKey = `c_${chunkX}_${chunkY}`;
  if (currentIntegration.chunks.hasOwnProperty(thisChunkKey)) {
    const thisChunk = currentIntegration.chunks[thisChunkKey];
    for (const objectIndex of thisChunk) {
      const object: MapObject = currentIntegration.objects[objectIndex];
      switch (object.type) {
        case 'route':
          /*drawLine(
            ctx,
            object.points.map((point) => {
              return getPointInChunk(point[0], point[1]);
            }),
            strokeStyle,
            lineWidth / scale
          );*/

          break;
        case 'location':
          const pointInChunk = getPointInChunk(object.point[0], object.point[1]);
          const circleElement = generateSVGCircle(pointInChunk.x, pointInChunk.y, pointRadius, strokeStyle, lineWidth / 2, fill);
          LocationLayerElement.appendChild(circleElement);
          break;
        default:
          break;
      }
    }
  }
}

function updateLayers(): void {
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

    for (let i = 0; i < chunkXRange; i++) {
      for (let j = 0; j < chunkYRange; j++) {
        renderChunk(i + currentTopLeftChunkX, j + currentTopLeftChunkY);
      }
    }
  }
}

function setLayersTransform(translateX: number, translateY: number, scale: number): void {
  const transformString = `translate(${translateX} ${translateY}) scale(${scale})`;
  // dilation (scaling) is done before translation
  RouteLayerElement.setAttributeNS(null, 'transform', transformString);
  LocationLayerElement.setAttributeNS(null, 'transform', transformString);
}

export async function initializeMapSVG(): void {
  const requestID = generateIdentifier('r');
  const integration = await integrateMap(requestID);
  currentIntegration = integration;
  updateLayers();
  ResizeMapField();
}

export function initializeMapInteraction(): void {
  if (supportTouch()) {
    MapSVGElement.addEventListener('touchstart', handleStartEvent, { passive: false });
    MapSVGElement.addEventListener('touchmove', handleMoveEvent, { passive: false });
    MapSVGElement.addEventListener('touchend', handleEndEvent, { passive: false });
  } else {
    MapSVGElement.addEventListener('mousedown', handleStartEvent);
    MapSVGElement.addEventListener('mousemove', handleMoveEvent);
    MapSVGElement.addEventListener('mouseup', handleEndEvent);
  }
}

function handleStartEvent(event: Event): void {
  event.preventDefault();
  const now = new Date().getTime();
  if (!sessionStarted || now - sessionTime <= sameSessionTime) {
    sessionStarted = true;
    sessionTime = now;
    // reset delta
    deltaTranslateX = 0;
    deltaTranslateY = 0;
    deltaScale = 1;
    // update pointers
    pointers = {};
    initialPointers = {};
    if (event.touches) {
      // touch event
      for (const touch of event.touches) {
        const pointerKey = `p_${touch.identifier}`;
        pointers[pointerKey] = { x: touch.clientX, y: touch.clientY };
        initialPointers[pointerKey] = { x: touch.clientX, y: touch.clientY };
      }
    } else {
      // other event
      const pointerKey = `p_0`;
      pointers[pointerKey] = { x: event.clientX, y: event.clientY };
      initialPointers[pointerKey] = { x: event.clientX, y: event.clientY };
    }
  }
}

function handleMoveEvent(event: Event): void {
  event.preventDefault();
  if (sessionStarted) {
    // reset delta
    deltaTranslateX = 0;
    deltaTranslateY = 0;
    deltaScale = 1;
    // update pointers
    pointers = {};
    if (event.touches) {
      // touch event
      for (const touch of event.touches) {
        const pointerKey = `p_${touch.identifier}`;
        pointers[pointerKey] = { x: touch.clientX, y: touch.clientY };
      }
    } else {
      // other event
      const pointerKey = `p_0`;
      pointers[pointerKey] = { x: event.clientX, y: event.clientY };
    }

    // match behavior
    let behavior = 'none';
    if (event.touches) {
      // touch event
      if (Object.keys(pointers).length === 1) {
        behavior = 'move';
      }
      if (Object.keys(pointers).length >= 2) {
        if ([...new Set(Object.keys(pointers))].every((value) => new Set(Object.keys(initialPointers)).has(value))) {
          behavior = 'zoom';
        } else {
          behavior = 'move';
        }
      }
    } else {
      // other event
      if (Object.keys(pointers).length === 1) {
        behavior = 'move';
      }
    }

    // do the behavior
    switch (behavior) {
      case 'move':
        // calculate delta
        for (const pointerKey in pointers) {
          if (initialPointers.hasOwnProperty(pointerKey)) {
            const pointer = pointers[pointerKey];
            const initialPointer = initialPointers[pointerKey];
            deltaTranslateX = pointer.x - initialPointer.x;
            deltaTranslateY = pointer.y - initialPointer.y;
          }
        }
        break;
      case 'zoom':
        // calculate center point
        let totalX = 0;
        let totalY = 0;
        let pointerQuantity = 0;
        for (const pointerKey in initialPointers) {
          if (initialPointers.hasOwnProperty(pointerKey)) {
            const pointer = initialPointers[pointerKey];
            totalX += pointer.x;
            totalY += pointer.y;
            pointerQuantity += 1;
          }
        }
        let centerX = totalX / pointerQuantity;
        let centerY = totalY / pointerQuantity;

        // calculate initial distance
        let initialDistance = 0;
        const thisInitialPointersValues = Object.values(initialPointers);
        if (thisInitialPointersValues.length === 2) {
          initialDistance = Math.hypot(thisInitialPointersValues[0].x - thisInitialPointersValues[1].x, thisInitialPointersValues[0].y - thisInitialPointersValues[1].y);
        }
        if (thisInitialPointersValues.length === 3) {
          initialDistance = Math.hypot(thisInitialPointersValues[0].x - centerX, thisInitialPointersValues[0].y - centerY);
        }

        // calculate distance
        let distance = 0;
        const thisPointersValues = Object.values(pointers);
        if (thisPointersValues.length === 2) {
          distance = Math.hypot(thisPointersValues[0].x - thisPointersValues[1].x, thisPointersValues[0].y - thisPointersValues[1].y);
        }
        if (thisPointersValues.length === 3) {
          distance = Math.hypot(thisPointersValues[0].x - centerX, thisPointersValues[0].y - centerY);
        }

        // calculate delta transform
        deltaScale = initialDistance === 0 ? 1 : distance / initialDistance;
        deltaTranslateX = (centerX - centerX * deltaScale) / 2;
        deltaTranslateY = (centerY - centerY * deltaScale) / 2;
        if (deltaScale === 0) {
          deltaScale = 1;
        }
        break;
      default:
        break;
    }

    // preview transform
    setLayersTransform(translateX + deltaTranslateX, translateY + deltaTranslateY, scale * deltaScale);
  }
}

function handleEndEvent(event: Event): void {
  event.preventDefault();
  if (sessionStarted) {
    // save transform
    translateX += deltaTranslateX;
    translateY += deltaTranslateY;
    scale *= deltaScale;

    // sync transform
    setLayersTransform(translateX, translateY, scale);

    // update layers
    // updateLayers();

    sessionStarted = false;
  }
}

export function openMap(): void {
  pushPageHistory('Map');
  MapField.setAttribute('displayed', 'true');
  initializeMapSVG();
  closePreviousPage();
}

export function closeMap(): void {
  // revokePageHistory('Map');
  MapField.setAttribute('displayed', 'false');
  openPreviousPage();
}

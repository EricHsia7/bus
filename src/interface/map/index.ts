import { documentQuerySelector } from '../../tools/elements';
import { initializeMapViewer } from './viewer';

const Field = documentQuerySelector('.css_map_field');

let initialized = false;

function initializeMap(): void {
  if (initialized) return;
  initialized = true;
  initializeMapViewer(Field, {
    tileUrl: 'https://erichsia7.github.io/bus-map/tiles/{z}/{x}/{y}.webp',
    labelUrl: 'https://erichsia7.github.io/bus-map/labels/{z}/{x}/{y}.geojson.gz',
    tileSize: 128,
    minZoom: 13,
    // deepest level that exists; the camera can still zoom 2 more (overzoom)
    maxZoom: 16,
    overzoom: 2,
    labelMinZoom: 11,
    labelMaxZoom: 14,
    // no requests are ever made outside this box
    bounds: [120.886, 24.8, 122.004, 25.3],
    center: [121.5435, 25.0308],
    zoom: 13,
    attribution: '\u00a9 OpenStreetMap contributors'
  });
}

export function openMap(): void {
  Field.setAttribute('displayed', 'true');
  initializeMap();
}

export function closeMap(): void {
  Field.setAttribute('displayed', 'false');
}

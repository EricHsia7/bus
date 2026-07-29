import { MapLoader, MapLoaderResponse } from '../../data/map';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { MapTileController } from '../../tools/tile-controller';

const mapField = documentQuerySelector('.css_map_field');
const mapCanvas = elementQuerySelector(mapField, '.css_map_canvas') as HTMLCanvasElement;
const mapContext = mapCanvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

const overzoom = 2;
const bounds = [120.886, 24.8, 122.004, 25.3];

let width = window.innerWidth;
let height = window.innerHeight;
const devicePixelRatio = window.devicePixelRatio;

const mapLoader = new MapLoader(4, placeTile);

const mapTileController = new MapTileController({
  element: mapCanvas,
  centerLon: 121.5435,
  centerLat: 25.0308,
  zoom: 13,
  minZoom: 13,
  maxZoom: 16,
  tileSize: 256,
  onMovementStart: function () {
    console.log(1);
  },
  onMovement: function () {
    const visibleTiles = this.getVisibleTiles();
    mapContext.clearRect(0, 0, width, height);
    for (const tile of visibleTiles) {
      mapLoader.enqueue(tile.x, tile.y, tile.z);
      const cache = mapLoader.get(tile.x, tile.y, tile.z);
      if (cache) {
        placeTile(cache);
      }
    }
  },
  onMovementEnd: function () {
    mapLoader.consume();
  },
  onResize: function () {}
});

export function openMap(): void {
  mapField.setAttribute('displayed', 'true');
  mapCanvas.width = width * devicePixelRatio;
  mapCanvas.height = height * devicePixelRatio;
  mapContext.scale(devicePixelRatio, devicePixelRatio);
}

export function closeMap(): void {
  mapField.setAttribute('displayed', 'false');
}

function placeTile(response: MapLoaderResponse): void {
  const { x, y, z } = response;
  const boundingBox = mapTileController.getTileBoundingBox(x, y, z);
  mapContext.drawImage(response.bitmap, Math.floor(boundingBox.screenBBox.minX * devicePixelRatio) / devicePixelRatio, Math.floor(boundingBox.screenBBox.minY * devicePixelRatio) / devicePixelRatio, Math.floor((boundingBox.screenBBox.maxX - boundingBox.screenBBox.minX) * devicePixelRatio) / devicePixelRatio, Math.floor((boundingBox.screenBBox.maxY - boundingBox.screenBBox.minY) * devicePixelRatio) / devicePixelRatio);
}

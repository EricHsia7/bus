import { Context2D } from '../../tools/graphic';
import { clamp } from '../../tools/math';
import { Box } from './index';
import { LineStyleProperties, RoutePropertyScale } from './route';
import { RouteFeatureStride, RoutePlan } from './route-plan';

export interface RouteTileView {
  plan: RoutePlan;
  screenBBox: Box;
}

/**
 * Render options.
 */
export interface RouteRenderOptions {
  /** Current (fractional) map zoom */
  zoom: number;
  /** Device pixel ratio. Widths and dashes are multiplied by it. Defaults to 1. */
  devicePixelRatio?: number;
  /** Draw the casing/halo pass beneath the core strokes. Defaults to true. */
  casing?: boolean;
  /**
   * RouteIDs of the visible routes.
   */
  selectedRoutes?: Iterable<number> | null;
}

interface DrawBatch {
  style: LineStyleProperties;
  /** [tileIndex, featureIndex] pairs. */
  members: Array<number>;
}

function resolveLineWidthScale(scale: RoutePropertyScale | undefined, viewZoom: number, tileZoom: number): number {
  if (!scale) return 1;
  const t = clamp(viewZoom - tileZoom, 0, 1);
  return scale[0] + (scale[1] - scale[0]) * t; // * Math.pow(2, -t);
}

/**
 * Group features by resolved style so each visual layer is a single path and a
 * single `stroke()` call, across *all* tiles. Batching by layer (rather than by
 * tile) is also what keeps seams invisible: neighbouring tiles stroke the same
 * layer with the same state in the same pass.
 */
function buildBatches(tiles: Array<RouteTileView>, selection: Set<number>): Array<DrawBatch> {
  const batches: Array<DrawBatch> = [];
  const batchIndex = new Map<string, number>();

  for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
    const { plan } = tiles[tileIndex];
    for (let featureIndex = 0; featureIndex < plan.featureCount; featureIndex++) {
      if (!selection.has(plan.routeIds[featureIndex])) continue;

      const styleRef = plan.features[RouteFeatureStride * featureIndex + 3];
      const style = plan.styles[styleRef];
      if (!style) continue;

      const key = `${style.layer}|${style['line-fill'] ?? ''}|${style['line-width'] ?? 1}|${(style['line-width-scale'] ?? []).join(',')}|${style['line-opacity'] ?? 1}|${style['line-cap'] ?? 'butt'}|${style['line-join'] ?? 'miter'}|${(style['line-dasharray'] ?? []).join(',')}|${style['line-casing-fill'] ?? ''}|${style['line-casing-width'] ?? 0}`;

      let index = batchIndex.get(key);
      if (index === undefined) {
        index = batches.length;
        batchIndex.set(key, index);
        batches.push({ style, members: [] });
      }
      batches[index].members.push(tileIndex, featureIndex);
    }
  }

  // Stable layer ordering so casing never covers a neighbouring core stroke.
  batches.sort((a, b) => a.style.layer.localeCompare(b.style.layer));
  return batches;
}

function tracePath(context: Context2D, tiles: Array<RouteTileView>, batch: DrawBatch): void {
  context.beginPath();
  const members = batch.members;

  for (let i = 0; i < members.length; i += 2) {
    const tile = tiles[members[i]];
    const featureIndex = members[i + 1];
    const { plan, screenBBox } = tile;

    const tileWidth = screenBBox.maxX - screenBBox.minX;
    const tileHeight = screenBBox.maxY - screenBBox.minY;
    if (tileWidth <= 0 || tileHeight <= 0) continue;

    // Non-square tiles are supported; X and Y scale independently.
    const scaleX = tileWidth / plan.extent;
    const scaleY = tileHeight / plan.extent;
    const buffer = plan.buffer;

    const featureOffset = featureIndex * RouteFeatureStride;
    const startIndex = plan.features[featureOffset];
    const endIndex = plan.features[featureOffset + 1];

    context.moveTo(screenBBox.minX + (plan.x[startIndex] - buffer) * scaleX, screenBBox.minY + (plan.y[startIndex] - buffer) * scaleY);
    for (let coordinateIndex = startIndex + 1; coordinateIndex <= endIndex; coordinateIndex++) {
      context.lineTo(screenBBox.minX + (plan.x[coordinateIndex] - buffer) * scaleX, screenBBox.minY + (plan.y[coordinateIndex] - buffer) * scaleY);
    }
  }
}

/**
 * Draw route tiles.
 *
 * Two passes are used so that casings never paint over a neighbouring route's
 * core stroke: every casing is drawn first, then every core stroke.
 */
export function drawRouteTiles(context: Context2D, tiles: Array<RouteTileView>, options: RouteRenderOptions): void {
  if (tiles.length === 0) return;

  const selection = new Set(options.selectedRoutes || []);
  if (selection.size === 0) return;

  const devicePixelRatio = options.devicePixelRatio ?? 1;
  const zoom = options.zoom;
  const drawCasing = options.casing !== false;

  const batches = buildBatches(tiles, selection);
  if (batches.length === 0) return;

  context.save();

  for (let pass = drawCasing ? 0 : 1; pass <= 1; pass++) {
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const style = batch.style;
      if (batch.members.length === 0) continue;

      const tileZoom = tiles[batch.members[0]].plan.zoom;
      if (style.minzoom !== undefined && zoom < style.minzoom) continue;
      if (style.maxzoom !== undefined && zoom >= style.maxzoom) continue;
      if (!style['line-width']) continue;

      const coreWidth = style['line-width'] * resolveLineWidthScale(style['line-width-scale'], zoom, tileZoom) * devicePixelRatio;
      if (coreWidth <= 0) continue;

      const casingWidth = (style['line-casing-width'] ?? 0) * devicePixelRatio;
      const casingFill = style['line-casing-fill'];
      if (pass === 0 && (!casingFill || casingWidth <= 0)) continue;

      context.lineWidth = pass === 0 ? coreWidth + 2 * casingWidth : coreWidth;
      context.strokeStyle = pass === 0 ? (casingFill as string) : (style['line-fill'] ?? '#000');
      context.globalAlpha = style['line-opacity'] ?? 1;
      context.lineCap = style['line-cap'] ?? 'butt';
      context.lineJoin = style['line-join'] ?? 'miter';

      const dashes = style['line-dasharray'];
      if (dashes && dashes.length > 0 && pass === 1) {
        context.setLineDash(dashes.map((value) => value * devicePixelRatio));
      } else {
        context.setLineDash([]);
      }

      tracePath(context, tiles, batch);
      context.stroke();
    }
  }

  context.restore();
}

import { MaterialSymbol } from '../interface/icons/material-symbols-type';

export interface BaseSelectiveView {
  icon: MaterialSymbol;
  name: string;
  description: string;
}

export interface SelectiveViewPoint extends BaseSelectiveView {
  type: 'point';
  centerLon: number;
  centerLat: number;
}

export interface SelectiveViewBox extends BaseSelectiveView {
  type: 'box';
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export type SelectiveViewItem = SelectiveViewPoint | SelectiveViewBox;

export class SelectiveView {
  sourcesVisibility: Uint8Array;
  views: Array<SelectiveViewItem>;

  constructor(sourcesVisibility: Iterable<0 | 1>) {
    this.sourcesVisibility = new Uint8Array(sourcesVisibility);
    this.views = [];
  }

  toggleVisibility(sourceIndex: number): void {
    this.sourcesVisibility[sourceIndex] = 1 - this.sourcesVisibility[sourceIndex];
  }

  addPoint(lon: number, lat: number, icon: SelectiveViewPoint['icon'], name: SelectiveViewPoint['name'], description: SelectiveViewPoint['description']): void {
    this.views.push({
      type: 'point',
      centerLon: lon,
      centerLat: lat,
      icon,
      name,
      description
    });
  }

  addBox(west: number, south: number, east: number, north: number, icon: SelectiveViewPoint['icon'], name: SelectiveViewPoint['name'], description: SelectiveViewPoint['description']): void {
    this.views.push({
      type: 'box',
      minLon: west,
      minLat: south,
      maxLon: east,
      maxLat: north,
      icon,
      name,
      description
    });
  }
}

import { MaterialSymbol } from '../../interface/icons/material-symbols-type';

export interface BaseMapView {
  /**
   * sources to show in this view
   */
  sources: Array<number>;
  /**
   * selected routes
   */
  selection: Array<number>;
  icon: MaterialSymbol;
  name: string;
}

export interface MapViewPoint extends BaseMapView {
  type: 'point';
  centerLon: number;
  centerLat: number;
}

export interface MapViewBox extends BaseMapView {
  type: 'box';
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export type MapView = MapViewPoint | MapViewBox;

export type MapViews = Array<MapView>;

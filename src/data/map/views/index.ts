import { MaterialSymbol } from '../../../interface/icons/material-symbols-type';
import { IntegratedLocationMapView } from './location-map';
import { IntegratedRouteMapView } from './route-map';

export interface BaseMapView {
  /**
   * sources to show in this view
   */
  sources: Array<number>;
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

export interface BaseIntegratedMapView {
  /**
   * selected routes
   */
  selection: Array<number>;
  views: Array<MapView>;
}

export interface IntegratedRouteMapView extends BaseIntegratedMapView {
  type: 'route';
}

export interface IntegratedLocationMapView extends BaseIntegratedMapView {
  type: 'location';
}

export type IntegratedMapView = IntegratedRouteMapView | IntegratedLocationMapView;

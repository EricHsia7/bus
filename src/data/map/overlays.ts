import { MaterialSymbol } from '../../interface/icons/material-symbols-type';

export interface MapOverlay {
  icon: MaterialSymbol;
  name: string;
  visible: boolean;
}

export class MapOverlays {
  overlays: Array<MapOverlay>;
  onToggle: (overlay: MapOverlay) => void;

  constructor(overlays: Array<MapOverlay>, onToggle: MapOverlays['onToggle']) {
    this.overlays = overlays;
    this.onToggle = onToggle;
  }

  toggle(index: number): void {
    this.overlays[index].visible = !this.overlays[index].visible;
    this.onToggle(this.overlays[index]);
  }
}

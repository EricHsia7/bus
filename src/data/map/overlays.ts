import { MaterialSymbol } from '../../interface/icons/material-symbols-type';

export interface MapOverlay {
  icon: MaterialSymbol;
  name: string;
  visible: boolean;
}

export class MapOverlays {
  overlays: Array<MapOverlay>;
  onToggle: () => void;

  constructor(overlays: Array<MapOverlay>, onToggle: MapOverlays['onToggle']) {
    this.overlays = overlays;
    this.onToggle = onToggle;
  }

  toggle(index: number): boolean {
    this.overlays[index].visible = !this.overlays[index].visible;
    this.onToggle();
    return this.overlays[index].visible;
  }

  show(sources: Array<number>): void {
    for (const source of sources) {
      this.overlays[source].visible = true;
    }
    this.onToggle();
  }
}

import { booleanToString } from '../../tools';
import { MaterialSymbol } from '../icons/material-symbols-type';

export interface MapOverlay {
  icon: MaterialSymbol;
  name: string;
  visible: boolean;
}

export class MapOverlays {
  overlays: Array<MapOverlay>;
  elements: Array<HTMLElement>;
  onToggle: () => void;

  constructor(overlays: MapOverlays['overlays'], elements: MapOverlays['elements'], onToggle: MapOverlays['onToggle']) {
    this.overlays = overlays;
    this.elements = elements;
    this.onToggle = onToggle;
  }

  toggle(index: number) {
    this.overlays[index].visible = !this.overlays[index].visible;
    this.onToggle();
    this.elements[index].setAttribute('highlighted', booleanToString(this.overlays[index].visible));
  }

  show(sources: Array<number>): void {
    for (const source of sources) {
      this.overlays[source].visible = true;
      this.elements[source]?.setAttribute('highlighted', 'true');
    }
    this.onToggle();
  }
}

import { integratedBus, integratedBusProperty, integratedBusPropertyArray } from '../../data/bus/index';
import { getSettingOptionValue } from '../../data/settings/index';
import { booleanToString } from '../../tools';
import { documentCreateDivElement, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { getBlankIconElement, setIcon } from '../icons/index';
import { BusPropertiesGroupBodyElement } from './index';

let previousProperties: integratedBusPropertyArray = [];
let previousSkeletonScreen: boolean = false;
let previousAnimation: boolean = false;

function generateElementOfBusProperty(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_bus_property');

  const iconElement = documentCreateDivElement();
  iconElement.classList.add('css_bus_property_icon');
  iconElement.appendChild(getBlankIconElement());

  const valueElement = documentCreateDivElement();
  valueElement.classList.add('css_bus_property_value');

  element.appendChild(iconElement);
  element.appendChild(valueElement);

  return element;
}

export function setupBusPropertiesFieldSkeletonScreen() {
  const playing_animation = getSettingOptionValue('playing_animation');
  const defaultPropertyQuantity = 5;
  const properties: integratedBusPropertyArray = [];
  for (let i = 0; i < defaultPropertyQuantity; i++) {
    properties.push({
      key: i.toString(),
      icon: '',
      value: ''
    });
  }
  updateBusPropertiesField(properties, true, playing_animation);
}

export function updateBusPropertiesField(properties: integratedBus['properties'], skeletonScreen: boolean, animation: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisProperty: integratedBusProperty, previousProperty: integratedBusProperty | null): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: integratedBusProperty): void {
      const thisPropertyIconElement = elementQuerySelector(thisElement, '.css_bus_property_icon');
      setIcon(thisPropertyIconElement, thisProperty.icon);
    }

    function updateValue(thisElement: HTMLElement, thisProperty: integratedBusProperty): void {
      elementQuerySelector(thisElement, '.css_bus_property_value').textContent = thisProperty.value;
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousProperty === null) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
      updateSkeletonScreen(thisElement, skeletonScreen);
      updateAnimation(thisElement, animation);
    } else {
      if (previousProperty.icon !== thisProperty.icon) {
        updateIcon(thisElement, thisProperty);
      }
      if (previousProperty.value !== thisProperty.value) {
        updateValue(thisElement, thisProperty);
      }
      if (previousSkeletonScreen !== skeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
      if (previousAnimation !== animation) {
        updateAnimation(thisElement, animation);
      }
    }
  }

  const propertyQuantity = properties.length;
  const propertyElements = Array.from(elementQuerySelectorAll(BusPropertiesGroupBodyElement, '.css_bus_property'));
  const currentPropertyElementsLength = propertyElements.length;
  if (propertyQuantity !== currentPropertyElementsLength) {
    const difference = currentPropertyElementsLength - propertyQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newPropertyElement = generateElementOfBusProperty();
        fragment.appendChild(newPropertyElement);
        propertyElements.push(newPropertyElement);
      }
      BusPropertiesGroupBodyElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentPropertyElementsLength - 1, q = currentPropertyElementsLength - difference - 1; p > q; p--) {
        propertyElements[p].remove();
        propertyElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < propertyQuantity; i++) {
    const thisPropertyElement = propertyElements[i];
    const thisProperty = properties[i];
    if (previousProperties[i]) {
      updateProperty(thisPropertyElement, thisProperty, previousProperties[i]);
    } else {
      updateProperty(thisPropertyElement, thisProperty, null);
    }
  }

  previousProperties = properties;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

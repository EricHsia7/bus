import { integratedBus } from '../../data/bus/index';
import { getSettingOptionValue } from '../../data/settings/index';
import { documentCreateDIVElement, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { compareThings } from '../../tools/index';
import { getBlankIconElement, setIcon } from '../icons/index';
import { BusPropertiesGroupBodyElement } from './index';

let previousProperties = [];
let previousSkeletonScreen: boolean = false;
let previousAnimation: boolean = false;

function generateElementOfBusProperty(): HTMLElement {
  const element = documentCreateDIVElement();
  element.classList.add('css_bus_property');

  const iconElement = documentCreateDIVElement();
  iconElement.classList.add('css_bus_property_icon');
  iconElement.appendChild(getBlankIconElement());

  const valueElement = documentCreateDIVElement();
  valueElement.classList.add('css_bus_property_value');

  element.appendChild(iconElement);
  element.appendChild(valueElement);

  return element;
}

export function setUpBusPropertiesFieldSkeletonScreen() {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const defaultPropertyQuantity = 5;
  let properties = [];
  for (let i = 0; i < defaultPropertyQuantity; i++) {
    properties.push({
      key: i,
      icon: '',
      value: ''
    });
  }
  updateBusPropertiesField(properties, true, playing_animation);
}

export function updateBusPropertiesField(properties: integratedBus['properties'], skeletonScreen: boolean, animation: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      const thisPropertyIconElement = elementQuerySelector(thisElement, '.css_bus_property_icon');
      setIcon(thisPropertyIconElement, thisProperty.icon);
    }

    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_bus_property_value').innerText = thisProperty.value;
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', animation);
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
    }

    if (previousProperty === null || previousProperty === undefined) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
      updateSkeletonScreen(thisElement, skeletonScreen);
      updateAnimation(thisElement, animation);
    } else {
      if (!compareThings(previousProperty, thisProperty)) {
        updateIcon(thisElement, thisProperty);
      }
      if (!compareThings(previousProperty, thisProperty)) {
        updateValue(thisElement, thisProperty);
      }
      if (skeletonScreen !== previousSkeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
      if (animation !== previousAnimation) {
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
        const newPropertyElement = generateElementOfBusProperty(skeletonScreen);
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

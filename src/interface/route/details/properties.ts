import { getSettingOptionValue } from '../../../data/settings/index';
import { elementQuerySelector, elementQuerySelectorAll } from '../../../tools/elements';
import { booleanToString, compareThings } from '../../../tools/index';
import { getBlankIconElement, setIcon } from '../../icons/index';
import { GeneratedElement } from '../../index';
import { PropertiesGroupBodyElement, PropertiesGroupElement } from './index';

let previousProperties = [];
let previousAnimation: boolean = false;
let previousSkeletonScreen: boolean = false;

function generateElementOfProperty(): GeneratedElement {
  const propertyElement = document.createElement('div');
  propertyElement.classList.add('css_route_details_property');

  const iconElement = document.createElement('div');
  iconElement.classList.add('css_route_details_property_icon');
  iconElement.appendChild(getBlankIconElement());
  propertyElement.appendChild(iconElement);

  const valueElement = document.createElement('div');
  valueElement.classList.add('css_route_details_property_value');
  propertyElement.appendChild(valueElement);

  return {
    element: propertyElement,
    id: ''
  };
}

export function setUppropertiesGroupSkeletonScreen(): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const defaultPropertyQuantity = 5;
  const properties = [];
  for (let i = 0; i < defaultPropertyQuantity; i++) {
    properties.push({
      key: i,
      icon: 'none',
      value: ''
    });
  }
  updatePropertiesField(properties, true, playing_animation);
}

export function updatePropertiesField(properties: Array, skeletonScreen: boolean, animation: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      const thisIconElement = elementQuerySelector(thisElement, '.css_route_details_property_icon');
      setIcon(thisIconElement, thisProperty.icon);
    }

    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_route_details_property_value').innerText = thisProperty.value;
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousProperty === null || previousProperty === undefined) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (!compareThings(previousProperty, thisProperty)) {
        updateIcon(thisElement, thisProperty);
      }
      if (!compareThings(previousProperty, thisProperty)) {
        updateValue(thisElement, thisProperty);
      }
      if (previousAnimation !== animation) {
        updateAnimation(thisElement, animation);
      }
      if (previousSkeletonScreen !== skeletonScreen) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  const propertyQuantity = properties.length;

  if (skeletonScreen !== previousSkeletonScreen) {
    PropertiesGroupElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
  }

  const currentPropertyCapacity = elementQuerySelectorAll(PropertiesGroupBodyElement, '.css_route_details_property').length;
  if (propertyQuantity !== currentPropertyCapacity) {
    const difference = currentPropertyCapacity - propertyQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0, d = Math.abs(difference); o < d; o++) {
        // const propertyIndex = currentPropertyCapacity + o;
        const newPropertyElement = generateElementOfProperty();
        fragment.appendChild(newPropertyElement.element);
      }
      PropertiesGroupBodyElement.append(fragment);
    } else {
      const propertyElements = elementQuerySelectorAll(PropertiesGroupBodyElement, '.css_route_details_property');
      for (let o = 0, d = Math.abs(difference); o < d; o++) {
        const propertyIndex = currentPropertyCapacity - 1 - o;
        propertyElements[propertyIndex].remove();
      }
    }
  }

  const propertyElements = elementQuerySelectorAll(PropertiesGroupBodyElement, '.css_route_details_property');
  for (let i = 0; i < propertyQuantity; i++) {
    const thisPropertyElement = propertyElements[i];
    const thisProperty = properties[i];
    if (previousProperties.length === 0) {
      updateProperty(thisPropertyElement, thisProperty, null);
    } else {
      updateProperty(thisPropertyElement, thisProperty, previousProperties[i]);
    }
  }

  previousProperties = properties;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

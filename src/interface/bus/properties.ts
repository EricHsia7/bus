import { getSettingOptionValue } from '../../data/settings/index';
import { compareThings } from '../../tools/index';
import { elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement } from '../index';

let previousProperties = [];
let previousSkeletonScreen: boolean = false;
let previousAnimation: boolean = true;

function generateElementOfBusProperty(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_bus_property');

  const iconElement = document.createElement('div');
  iconElement.classList.add('css_bus_property_icon');

  const valueElement = document.createElement('div');
  valueElement.classList.add('css_bus_property_value');

  element.appendChild(iconElement);
  element.appendChild(valueElement);

  return {
    element: element,
    id: ''
  };
}

export function setUpBusPropertiesFieldSkeletonScreen(Field: HTMLElement) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const defaultPropertyQuantity = 5;
  let properties = [];
  for (let i = 0; i < defaultPropertyQuantity; i++) {
    properties.push({
      key: i,
      icon: 'none',
      value: ''
    });
  }
  updateBusPropertiesField(Field, properties, true, playing_animation);
}

export function updateBusPropertiesField(Field: HTMLElement, properties: Array, skeletonScreen: boolean, animation: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_bus_property_icon').innerHTML = getIconHTML(thisProperty.icon);
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

    if (previousProperty === null) {
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

  // Field.setAttribute('skeleton-screen', skeletonScreen);

  const currentPropertySeatQuantity = elementQuerySelectorAll(Field, `.css_bus_group_body .css_bus_property`).length;
  if (propertyQuantity !== currentPropertySeatQuantity) {
    const capacity = currentPropertySeatQuantity - propertyQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        // const propertyIndex = currentPropertySeatQuantity + o;
        const newPropertyElement = generateElementOfBusProperty(skeletonScreen);
        elementQuerySelector(Field, '.css_bus_group_body').appendChild(newPropertyElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const propertyIndex = currentPropertySeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_bus_group_body .css_bus_property`)[propertyIndex].remove();
      }
    }
  }

  const propertyElements = elementQuerySelectorAll(Field, `.css_bus_group_body .css_bus_property`);
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

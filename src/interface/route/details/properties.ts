import { GeneratedElement } from '../../index';
import { booleanToString, compareThings } from '../../../tools/index';
import { getIconElement } from '../../icons/index';
import { elementQuerySelector, elementQuerySelectorAll, removeFirstChild } from '../../../tools/elements';
import { getSettingOptionValue } from '../../../data/settings/index';

let previousProperties = [];
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

function generateElementOfProperty(): GeneratedElement {
  const propertyElement = document.createElement('div');
  propertyElement.classList.add('css_route_details_property');

  const iconElement = document.createElement('div');
  iconElement.classList.add('css_route_details_property_icon');
  propertyElement.appendChild(iconElement);

  const valueElement = document.createElement('div');
  valueElement.classList.add('css_route_details_property_value');
  propertyElement.appendChild(valueElement);

  return {
    element: propertyElement,
    id: ''
  };
}

export function setUppropertiesGroupSkeletonScreen(Field: HTMLElement): void {
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
  updatePropertiesField(Field, properties, true, playing_animation);
}

export function updatePropertiesField(Field: HTMLElement, properties: Array, skeletonScreen: boolean, animation: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      const thisIconElement = elementQuerySelector(thisElement, '.css_route_details_property_icon');
      removeFirstChild(thisIconElement);
      thisIconElement.appendChild(getIconElement(thisProperty.icon));
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

  Field.setAttribute('skeleton-screen', booleanToString(skeletonScreen));

  const currentPropertySeatQuantity = elementQuerySelectorAll(Field, `.css_route_details_group_body .css_route_details_property`).length;
  if (propertyQuantity !== currentPropertySeatQuantity) {
    const capacity = currentPropertySeatQuantity - propertyQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        // const propertyIndex = currentPropertySeatQuantity + o;
        const newPropertyElement = generateElementOfProperty();
        elementQuerySelector(Field, '.css_route_details_group_body').appendChild(newPropertyElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const propertyIndex = currentPropertySeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_route_details_group_body .css_route_details_property`)[propertyIndex].remove();
      }
    }
  }

  for (let i = 0; i < propertyQuantity; i++) {
    const thisPropertyElement = elementQuerySelectorAll(Field, `.css_route_details_group_body .css_route_details_property`)[i];
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

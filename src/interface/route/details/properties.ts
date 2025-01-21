import { GeneratedElement, FieldSize } from '../../index';
import { booleanToString, compareThings } from '../../../tools/index';
import { getIconHTML } from '../../icons/index';
import { elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { getSettingOptionValue } from '../../../data/settings/index';

let previousProperties = [];
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

function queryPropertiesFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function generateElementOfProperty(): GeneratedElement {
  var element = document.createElement('div');
  element.classList.add('css_route_details_property');
  element.innerHTML = /*html*/ `<div class="css_route_details_property_icon"></div><div class="css_route_details_property_value"></div>`;
  return {
    element: element,
    id: ''
  };
}

export function setUpPropertiesFieldSkeletonScreen(Field: HTMLElement): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const FieldSize = queryPropertiesFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultPropertyQuantity = 5;
  var properties = [];
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
      elementQuerySelector(thisElement, '.css_route_details_property_icon').innerHTML = getIconHTML(thisProperty.icon);
    }

    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_route_details_property_value').innerText = thisProperty.value;
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      console.log(0, animation);
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      console.log(1, skeletonScreen);
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousProperty === null) {
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
      if (!(previousAnimation === animation)) {
        updateAnimation(thisElement, animation);
      }
      if (!(previousSkeletonScreen === skeletonScreen)) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  const FieldSize = queryPropertiesFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  var propertyQuantity = properties.length;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentPropertySeatQuantity = elementQuerySelectorAll(Field, `.css_route_details_group_body .css_route_details_property`).length;
  if (!(propertyQuantity === currentPropertySeatQuantity)) {
    var capacity = currentPropertySeatQuantity - propertyQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity + o;
        var thisPropertyElement = generateElementOfProperty(skeletonScreen);
        elementQuerySelector(Field, '.css_route_details_group_body').appendChild(thisPropertyElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity - 1 - o;
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

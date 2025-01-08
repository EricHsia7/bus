import { GeneratedElement, FieldSize } from '../index';
import { compareThings } from '../../tools/index';
import { getIconHTML } from '../icons/index';
import { elementQuerySelector, elementQuerySelectorAll } from '../../tools/query-selector';

let previousProperties = [];

function queryBusPropertiesFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function generateElementOfBusProperty(): GeneratedElement {
  const element = document.createElement('div');
  element.classList.add('css_bus_property');
  element.innerHTML = `<div class="css_bus_property_icon"></div><div class="css_bus_property_value"></div>`;
  return {
    element: element,
    id: ''
  };
}

export function setUpBusPropertiesFieldSkeletonScreen(Field: HTMLElement) {
  const FieldSize = queryBusPropertiesFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultPropertyQuantity = 4;
  var properties = [];
  for (let i = 0; i < defaultPropertyQuantity; i++) {
    properties.push({
      key: i,
      icon: 'none',
      value: ''
    });
  }
  updateBusPropertiesField(Field, properties, true);
}

export function updateBusPropertiesField(Field: HTMLElement, properties: Array, skeletonScreen: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_bus_property_icon').innerHTML = getIconHTML(thisProperty.icon);
    }
    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_bus_property_value').innerText = thisProperty.value;
    }
    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
    }
    if (previousProperty === null) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (!compareThings(previousProperty, thisProperty)) {
        updateIcon(thisElement, thisProperty);
      }
      if (!compareThings(previousProperty, thisProperty)) {
        updateValue(thisElement, thisProperty);
      }
      updateSkeletonScreen(thisElement, skeletonScreen);
    }
  }

  const FieldSize = queryPropertiesFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  var propertyQuantity = properties.length;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentPropertySeatQuantity = elementQuerySelectorAll(Field, `.css_bus_group_body .css_bus_property`).length;
  if (!(propertyQuantity === currentPropertySeatQuantity)) {
    var capacity = currentPropertySeatQuantity - propertyQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity + o;
        var thisPropertyElement = generateElementOfBusProperty(skeletonScreen);
        elementQuerySelector(Field, '.css_bus_group_body').appendChild(thisPropertyElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_bus_group_body .css_bus_property`)[propertyIndex].remove();
      }
    }
  }

  for (let i = 0; i < propertyQuantity; i++) {
    var thisPropertyElement = elementQuerySelectorAll(Field, `.css_bus_group_body .css_bus_property`)[i];
    var thisProperty = properties[i];
    if (previousProperties === []) {
      updateProperty(thisPropertyElement, thisProperty, null);
    } else {
      updateProperty(thisPropertyElement, thisProperty, previousProperties[i]);
    }
  }

  previousProperties = properties;
}

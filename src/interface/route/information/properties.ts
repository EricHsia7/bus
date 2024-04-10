import { GeneratedElement } from '../../index.ts';
import { md5 } from '../../../tools/index.ts';

var previousProperties = {};

function queryPropertiesFieldSize(): object {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function generateElementOfProperty(): GeneratedElement {
  var identifier = `l_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_property');
  element.id = identifier;
  element.innerHTML = `<div class="route_information_property_icon"></div><div class="route_information_property_value"></div>`;
  return {
    element: element,
    id: identifier
  };
}

export function setUpPropertiesFieldSkeletonScreen(Field: HTMLElement) {
  const FieldSize = queryPropertiesFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultPropertyQuantity = 5;
  var properties = [];
  for (var i = 0; i < defaultPropertyQuantity; i++) {
    properties.push({
      key: i,
      icon: 'none',
      value: ''
    });
  }
  updatePropertiesField(Field, properties, true);
}

export function updatePropertiesField(Field: HTMLElement, properties: [], skeletonScreen: boolean) {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperties: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      thisElement.querySelector('.route_information_property_icon').innerHTML = thisProperty.icon;
    }
    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      thisElement.querySelector('.route_information_property_value').innerText = thisProperty.value;
    }
    if (previousProperties === null) {
      updateProperty(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
    } else {
      if (!compareThings(previousProperties, thisProperty)) {
        updateProperty(thisElement, thisProperty);
      }
      if (!compareThings(previousProperties, thisProperty)) {
        updateValue(thisElement, thisProperty);
      }
    }
  }

  const FieldSize = queryPropertiesFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousProperties === {}) {
    previousProperties = properties;
  }

  var propertyQuantity = properties.length;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentPropertySeatQuantity = Field.querySelectorAll(`.route_information_property`).length;
  if (!(propertyQuantity === currentPropertySeatQuantity)) {
    var capacity = currentPropertySeatQuantity - propertyQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity + o;
        var thisPropertyElement = generateElementOfProperty();
        Field.appendChild(thisPropertyElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity - 1 - o;
        Field.querySelectorAll(`.route_information_property`)[propertyIndex].remove();
      }
    }
  }
}

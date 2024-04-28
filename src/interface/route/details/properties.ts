import { GeneratedElement, FieldSize } from '../../index.ts';
import { md5, compareThings } from '../../../tools/index.ts';
import { icons } from '../../icons/index.ts';
import { documentQuerySelector, documentQuerySelectorAll, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector.ts';

var previousProperties = [];

function queryPropertiesFieldSize(): FieldSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function generateElementOfProperty(skeletonScreen: boolean): GeneratedElement {
  var identifier = `l_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('css_route_details_property');
  element.setAttribute('skeleton-screen', skeletonScreen);
  element.id = identifier;
  element.innerHTML = `<div class="css_route_details_property_icon"></div><div class="css_route_details_property_value"></div>`;
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

export function updatePropertiesField(Field: HTMLElement, properties: [], skeletonScreen: boolean): void {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_route_details_property_icon').innerHTML = icons[thisProperty.icon];
    }
    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      elementQuerySelector(thisElement, '.css_route_details_property_value').innerText = thisProperty.value;
    }
    if (previousProperty === null) {
      updateIcon(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
    } else {
      if (!compareThings(previousProperty, thisProperty)) {
        updateIcon(thisElement, thisProperty);
      }
      if (!compareThings(previousProperty, thisProperty)) {
        updateValue(thisElement, thisProperty);
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
      for (var o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity + o;
        var thisPropertyElement = generateElementOfProperty(skeletonScreen);
        elementQuerySelector(Field, '.css_route_details_group_body').appendChild(thisPropertyElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_route_details_group_body .css_route_details_property`)[propertyIndex].remove();
      }
    }
  }

  for (var i = 0; i < propertyQuantity; i++) {
    var thisPropertyElement = elementQuerySelectorAll(Field, `.css_route_details_group_body .css_route_details_property`)[i];
    thisPropertyElement.setAttribute('skeleton-screen', skeletonScreen);
    var thisProperty = properties[i];
    if (previousProperties === []) {
      updateProperty(thisPropertyElement, thisProperty, null);
    } else {
      updateProperty(thisPropertyElement, thisProperty, previousProperties[i]);
    }
  }

  previousProperties = properties;
}

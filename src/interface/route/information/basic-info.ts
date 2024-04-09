import { GeneratedElement } from '../../index.ts';
import { md5 } from '../../../tools/index.ts';

function queryBasicInfoFieldSize(): object {
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

function updateBasicInfoField(Field: HTMLElement, skeletonScreen: boolean) {
  function updateProperty(thisElement: HTMLElement, thisProperty: object, previousProperty: object): void {
    function updateIcon(thisElement: HTMLElement, thisProperty: object): void {
      thisElement.querySelector('.route_information_property_icon').innerHTML = thisProperty.icon;
    }
    function updateValue(thisElement: HTMLElement, thisProperty: object): void {
      thisElement.querySelector('.route_information_property_value').innerText = thisProperty.value;
    }
    if (previousProperty === null) {
      updateProperty(thisElement, thisProperty);
      updateValue(thisElement, thisProperty);
    } else {
      if (!compareThings(previousProperty, thisProperty)) {
        updateProperty(thisElement, thisProperty);
      }
      if (!compareThings(previousProperty, thisProperty)) {
        updateValue(thisElement, thisProperty);
      }
    }
  }

  const FieldSize = queryBasicInfoFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousCalendar === {}) {
    previousCalendar = calendar;
  }

  var eventGroupQuantity = calendar.eventGroupQuantity;
  var eventQuantity = calendar.eventQuantity;
  var groupedEvents = calendar.groupedEvents;
  var eventGroups = calendar.eventGroups;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentPropertySeatQuantity = Field.querySelectorAll(`.route_information_property`).length;
  if (!(eventGroupQuantity === currentPropertySeatQuantity)) {
    var capacity = currentPropertySeatQuantity - eventGroupQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity + o;
        var thisElement = generateElementOfEventGroup();
        Field.querySelector('.route_information_calendar_events_groups').appendChild(thisElement.element);
        var thisDayElement = generateElementOfDay();
        Field.querySelector('.route_information_calendar_days').appendChild(thisDayElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var propertyIndex = currentPropertySeatQuantity - 1 - o;
        Field.querySelectorAll(`.route_information_calendar_events_groups .route_information_calendar_grouped_events`)[eventGroupIndex].remove();
        Field.querySelectorAll(`.route_information_calendar_days .route_information_calendar_day`)[eventGroupIndex].remove();
      }
    }
  }
}

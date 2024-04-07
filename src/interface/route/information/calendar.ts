import { GeneratedElement } from '../../index.ts';
import { indexToDay } from '../../tools/format-time.ts';

function generateElementOfDay(index: number): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_day');
  element.id = identifier;
  element.setAttribute('day', index);
  element.innerHTML = indexToDay(index).name;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfEvent(event: object): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_event');
  element.id = identifier;
  element.innerHTML = event.dateString;
//  element.style.setProperty('')
  return {
    element: element,
    id: identifier
  };
}

export function initializeCalendar(Field: HTMLElement, calendar: object) {
  var index = 0;
  for (var code in calendar) {
    var thisDay = calendar[code];
    var thisDayElement = generateElementOfDay(index);
    Field.querySelector('.route_information_calendar_days').appendChild(thisDayElement);
    for (var event of thisDay) {
      var thisEventElement = generateElementOfEvent(event);
      Field.querySelector('.route_information_calendar_events').appendChild(thisEventElement);
    }
    index += 1;
  }
}

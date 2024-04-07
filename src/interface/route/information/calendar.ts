import { GeneratedElement } from '../../index.ts';
import { indexToDay } from '../../../tools/format-time.ts';
import { md5 } from '../../../tools/index.ts';

function generateElementOfDay(dayOfWeek: object): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_day');
  element.id = identifier;
  element.setAttribute('day', dayOfWeek.day);
  element.innerHTML = dayOfWeek.name;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfEventsGroup(dayOfWeek: object): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_grouped_events');
  element.id = identifier;
  element.setAttribute('day', dayOfWeek.day);
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
  return {
    element: element,
    id: identifier
  };
}

export function initializeCalendar(Field: HTMLElement, calendar: object): void {
  Field.querySelector('.route_information_calendar_days').innerHTML = '';
  Field.querySelector('.route_information_calendar_events_groups').innerHTML = '';
  for (var code in calendar) {
    var thisDay = calendar[code];
    var thisDayElement: GeneratedElement = generateElementOfDay(thisDay.dayOfWeek);
    var thisEventsGroupElement: GeneratedElement = generateElementOfEventsGroup(thisDay.dayOfWeek);
    Field.querySelector('.route_information_calendar_days').appendChild(thisDayElement.element);
    Field.querySelector('.route_information_calendar_events_groups').appendChild(thisEventsGroupElement.element);
    for (var event of thisDay.events) {
      var thisEventElement: GeneratedElement = generateElementOfEvent(event, thisDay.dayOfWeek);
      Field.querySelector(`.route_information_calendar_events_groups .route_information_calendar_grouped_events[day="${thisDay.dayOfWeek.day}"]`).appendChild(thisEventElement.element);
    }
  }
}

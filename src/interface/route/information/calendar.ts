import { GeneratedElement } from '../../index.ts';
import { indexToDay } from '../../../tools/format-time.ts';
import { md5 } from '../../../tools/index.ts';

const calendar_ratio = 100;
var previousCalendar = {};

function queryCalendarFieldSize(): object {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function generateElementOfGridline(hours: number): GeneratedElement {
  var identifier = `l_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_gridline');
  element.id = identifier;
  element.style.setProperty('--b-calendar-gridline-top', `${hours * calendar_ratio - 5}px`);
  element.innerHTML = `<div class="route_information_calendar_gridline_label">${String(hours).padStart(2, '0')}:00</div><div class="route_information_calendar_gridline_line"></div>`;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfDay(dayOfWeek: object, skeletonScreen: boolean): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_day');
  element.id = identifier;
  element.setAttribute('day', dayOfWeek.day);
  element.setAttribute('selected', new Date().getDay() === dayOfWeek.day ? true : false);
  element.innerHTML = dayOfWeek.name;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfEventGroup(dayOfWeek: object, skeletonScreen: boolean): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_grouped_events');
  element.id = identifier;
  element.setAttribute('index', dayOfWeek.day);
  element.setAttribute('displayed', new Date().getDay() === dayOfWeek.day ? true : false);
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfEvent(event: object, skeleton: boolean): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_event');
  element.id = identifier;
  var thisDayStart = new Date();
  thisDayStart.setDate(1);
  thisDayStart.setMonth(0);
  thisDayStart.setFullYear(event.date.getFullYear());
  thisDayStart.setMonth(event.date.getMonth());
  thisDayStart.setDate(event.date.getDate());
  thisDayStart.setHours(0);
  thisDayStart.setMinutes(0);
  thisDayStart.setSeconds(0);
  thisDayStart.setMilliseconds(0);
  element.style.setProperty('--b-calendar-event-top', `${((event.date.getTime() - thisDayStart.getTime()) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio}px`);
  element.style.setProperty('--b-calendar-event-height', `${((event.duration * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio}px`);
  element.innerText = event.dateString;
  return {
    element: element,
    id: identifier
  };
}

export function initializeCalendarGridlines(Field: HTMLElement): void {
  Field.querySelector('.route_information_calendar_gridlines').innerHTML = '';
  for (var hours = 0; hours < 24; hours++) {
    var thisGridlineElement: GeneratedElement = generateElementOfGridline(hours);
    Field.querySelector('.route_information_calendar_gridlines').appendChild(thisGridlineElement.element);
  }
}

export function setUpeventGroupFieldSkeletonScreen(Field: HTMLElement) {
  const FieldSize = queryCalendarFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultEventQuantity = {
    d_0: 6,
    d_1: 6,
    d_2: 6,
    d_3: 6,
    d_4: 6,
    d_5: 6,
    d_6: 6
  };
  var defaultEventGroupQuantity = 7;
  var groupedEvents = {};
  var eventGroups = {};
  for (var i = 0; i < defaultEventGroupQuantity; i++) {
    var eventGroupKey = `d_${i}`;
    groupedEvents[eventGroupKey] = [];
    eventGroups[eventGroupKey] = {
      day: i,
      code: `d_{i}`,
      name: ''
    };
    for (var j = 0; j < defaultEventQuantity[eventGroupKey]; j++) {
      groupedEvents[eventGroupKey].push({
        date: new Date(),
        dateString: '',
        duration: 60
      });
    }
  }
  updateCalendarField(
    Field,
    {
      groupedEvents: groupedEvents,
      eventGroups: eventGroups,
      eventGroupQuantity: defaultEventGroupQuantity,
      eventQuantity: defaultEventQuantity
    },
    true
  );
}

export async function updateCalendarField(Field: HTMLElement, calendar: object, skeletonScreen: boolean): void {
  function updateEvent(thisElement, thisEvent, previousEvent) {
    function updateText(thisElement: HTMLElement, thisEvent: object): void {
      thisElement.innerText = thisEvent.dateString;
    }
    function updatePosition(thisElement: HTMLElement, thisEvent: object): void {
      var thisDayStart = new Date();
      thisDayStart.setDate(1);
      thisDayStart.setMonth(0);
      thisDayStart.setFullYear(thisEvent.date.getFullYear());
      thisDayStart.setMonth(thisEvent.date.getMonth());
      thisDayStart.setDate(thisEvent.date.getDate());
      thisDayStart.setHours(0);
      thisDayStart.setMinutes(0);
      thisDayStart.setSeconds(0);
      thisDayStart.setMilliseconds(0);
      thisElement.style.setProperty('--b-calendar-event-top', `${((event.date.getTime() - thisDayStart.getTime()) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio}px`);
      thisElement.style.setProperty('--b-calendar-event-height', `${((event.duration * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio}px`);
    }
    if (previousEvent === null) {
      updateText(thisElement, thisEvent);
      updatePosition(thisElement, thisEvent);
    } else {
      if (!(thisEvent.dateString === previousEvent.dateString) || !compareThings(previousEvent, thisEvent)) {
        updateText(thisElement, thisEvent);
      }
      if (!(thisEvent.dateString === previousEvent.dateString) || !compareThings(previousEvent, thisEvent)) {
        updatePosition(thisElement, thisEvent);
      }
    }
  }

  const FieldSize = queryCalendarFieldSize();
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

  var currentEventGroupSeatQuantity = Field.querySelectorAll(`.route_information_calendar_events_groups .route_information_calendar_grouped_events`).length;
  if (!(eventGroupQuantity === currentEventGroupSeatQuantity)) {
    var capacity = currentEventGroupSeatQuantity - eventGroupQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var eventGroupIndex = currentEventGroupSeatQuantity + o;
        var thisElement = generateElementOfEventGroup(eventGroups[eventGroupIndex], true);
        Field.querySelector('.route_information_calendar_events_groups').appendChild(thisElement.element);
        var thisDayElement = generateElementOfDay(eventGroupIndex[eventGroupIndex], true);
        Field.querySelector('.route_information_calendar_days').appendChild(thisDayElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var eventGroupIndex = currentEventGroupSeatQuantity - 1 - o;
        Field.querySelectorAll(`.route_information_calendar_events_groups .route_information_calendar_grouped_events`)[eventGroupIndex].remove();
        var thisDayElement = generateElementOfDay(eventGroupIndex[eventGroupIndex], true);
        Field.querySelector('.route_information_calendar_days').appendChild(thisDayElement.element);
      }
    }
  }

  for (var i = 0; i < eventGroupQuantity; i++) {
    var eventGroupKey = `d_${i}`;
    var currentEventSeatQuantity = Field.querySelectorAll(`.route_information_calendar_events_groups .route_information_calendar_grouped_events[index="${i}"] .route_information_calendar_event`).length;
    if (!(eventQuantity[eventGroupKey] === currentEventSeatQuantity)) {
      var capacity = currentEventSeatQuantity - eventQuantity[eventGroupKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfEvent(eventGroups[eventGroupKey]);
          Field.querySelector(`.route_information_calendar_events_groups .route_information_calendar_grouped_events[index="${i}"]`).appendChild(thisElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var eventIndex = currentEventSeatQuantity - 1 - o;
          Field.querySelector(`.route_information_calendar_events_groups .route_information_calendar_grouped_events[index="${i}"] .route_information_calendar_event`).remove();
        }
      }
    }
  }

  for (var i = 0; i < eventGroupQuantity; i++) {
    var eventGroupKey = `d_${i}`;
    var thisEventGroupElement = Field.querySelector(`.route_information_calendar_events_groups .route_information_calendar_grouped_events[index="${i}"]`);
    thisEventGroupElement.setAttribute('skeleton-screen', skeletonScreen);

    for (var j = 0; j < eventQuantity[eventGroupKey]; j++) {
      var thisElement = Field.querySelectorAll(`.route_information_calendar_events_groups .route_information_calendar_grouped_events[index="${i}"] .route_information_calendar_event`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      var thisEvent = groupedEvents[eventGroupKey][j];
      if (previousCalendar.hasOwnProperty('groupedEvents')) {
        if (previousCalendar.groupedEvents.hasOwnProperty(eventGroupKey)) {
          if (previousCalendar.groupedEvents[eventGroupKey][j]) {
            var previousEvent = previousCalendar.groupedEvents[eventGroupKey][j];
            updateEvent(thisElement, thisEvent, previousEvent);
          } else {
            updateEvent(thisElement, thisEvent, null);
          }
        } else {
          updateEvent(thisElement, thisEvent, null);
        }
      } else {
        updateEvent(thisElement, thisEvent, null);
      }
    }
  }
  previousCalendar = calendar;
}

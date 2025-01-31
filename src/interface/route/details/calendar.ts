import { GeneratedElement, querySize } from '../../index';
import { generateIdentifier, compareThings, booleanToString } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { getSettingOptionValue } from '../../../data/settings/index';
import { getCSSVariableValue } from '../../../tools/style';

const RouteDetailsField = documentQuerySelector('.css_route_details_field');
const RouteDetailsBodyElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body');
const RouteDetailsGroupsElement = elementQuerySelector(RouteDetailsBodyElement, '.css_route_details_groups');
const CalendarGroupElement = elementQuerySelector(RouteDetailsGroupsElement, '.css_route_details_group[group="calendar"]');
const CalendarCanvasElement = elementQuerySelector(CalendarGroupElement, '.css_route_details_calendar_canvas') as HTMLCanvasElement;
const CalendarCanvasContext = CalendarCanvasElement.getContext('2d') as CanvasRenderingContext2D;

const calendar_ratio = 100;
const hours = 24;
const gridlineBoxHeight = 10;
const gridlineWidth = 1.2;

let canvasSize = querySize('route-details-canvas');
let canvasWidth = canvasSize.width;
let canvasHeight = canvasSize.height;

let previousCalendar = {};
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

function resizeRouteDetailsCalendarCanvas(): void {
  canvasSize = querySize('route-details-canvas');
  canvasWidth = size.width;
  canvasHeight = size.height;
  CalendarCanvasElement.width = canvasWidth;
  CalendarCanvasElement.height = canvasHeight;
}

function drawGridline(hours: number): void {
  const boxX = 0;
  const boxY = hours * calendar_ratio;
  CalendarCanvasContext.fillStyle = getCSSVariableValue('--b-cssvar-ededf2');
  CalendarCanvasContext.textBaseline = 'top';
  // draw line
  CalendarCanvasContext.fillRect(boxX + 45, boxY + 5, canvasWidth - 45, gridlineWidth);
  // draw label
  const labelText = `${String(hours).padStart(2, '0')}:00`;
  const labelMeasurement = CalendarCanvasContext.measureText(labelText);
  const labelWidth = labelMeasurement.width;
  const labelHeight = labelMeasurement.actualBoundingBoxDescent;
  CalendarCanvasContext.fillText(labelText, 45 - labelWidth, boxY + (gridlineBoxHeight - labelHeight) / 2);
}

function generateElementOfDay(): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_route_details_calendar_day');
  element.id = identifier;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfEventGroup(): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_route_details_calendar_grouped_events');
  element.id = identifier;
  return {
    element: element,
    id: identifier
  };
}

function generateElementOfEvent(): GeneratedElement {
  var identifier = generateIdentifier('i');
  var element = document.createElement('div');
  element.classList.add('css_route_details_calendar_event');
  element.id = identifier;
  return {
    element: element,
    id: identifier
  };
}

export function initializeCalendarGridlines(Field: HTMLElement): void {
  elementQuerySelector(Field, '.css_route_details_calendar_gridlines').innerHTML = '';
  for (let hours = 0; hours < 24; hours++) {
    var thisGridlineElement: GeneratedElement = drawGridline(hours);
    elementQuerySelector(Field, '.css_route_details_calendar_gridlines').appendChild(thisGridlineElement.element);
  }
}

export function setUpCalendarFieldSkeletonScreen(Field: HTMLElement) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  var defaultEventQuantity = {
    d_0: 47,
    d_1: 47,
    d_2: 47,
    d_3: 47,
    d_4: 47,
    d_5: 47,
    d_6: 47
  };
  var defaultEventGroupQuantity = 7;
  var groupedEvents = {};
  var eventGroups = {};
  for (let i = 0; i < defaultEventGroupQuantity; i++) {
    var eventGroupKey = `d_${i}`;
    groupedEvents[eventGroupKey] = [];
    eventGroups[eventGroupKey] = {
      day: i,
      code: `d_{i}`,
      name: ''
    };
    for (let j = 0; j < defaultEventQuantity[eventGroupKey]; j++) {
      var date = new Date();
      date.setHours(0);
      date.setMinutes(j * 30);
      date.setSeconds(0);
      date.setMilliseconds(0);
      groupedEvents[eventGroupKey].push({
        date: date,
        dateString: '',
        duration: 15
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
    true,
    playing_animation
  );
}

export async function updateCalendarField(Field: HTMLElement, calendar: object, skeletonScreen: boolean, animation: boolean): void {
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
      thisElement.style.setProperty('--b-cssvar-calendar-event-top', `${((thisEvent.date.getTime() - thisDayStart.getTime()) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio}px`);
      thisElement.style.setProperty('--b-cssvar-calendar-event-height', `${((thisEvent.duration * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio}px`);
    }

    function updateAnimation(thisElement: HTMLElement, animation: boolean): void {
      thisElement.setAttribute('animation', booleanToString(animation));
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
    }

    if (previousEvent === null) {
      updateText(thisElement, thisEvent);
      updatePosition(thisElement, thisEvent);
      updateAnimation(thisElement, animation);
      updateSkeletonScreen(thisElement, skeletonScreen);
    } else {
      if (!(thisEvent.dateString === previousEvent.dateString) || !compareThings(previousEvent, thisEvent)) {
        updateText(thisElement, thisEvent);
      }
      if (!(thisEvent.dateString === previousEvent.dateString) || !compareThings(previousEvent, thisEvent)) {
        updatePosition(thisElement, thisEvent);
      }
      if (!(animation === previousAnimation)) {
        updateAnimation(thisElement, animation);
      }
      if (!(skeletonScreen === previousSkeletonScreen)) {
        updateSkeletonScreen(thisElement, skeletonScreen);
      }
    }
  }

  if (previousCalendar === {}) {
    previousCalendar = calendar;
  }

  var eventGroupQuantity = calendar.eventGroupQuantity;
  var eventQuantity = calendar.eventQuantity;
  var groupedEvents = calendar.groupedEvents;
  var eventGroups = calendar.eventGroups;

  // Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentEventGroupSeatQuantity = elementQuerySelectorAll(Field, `.css_route_details_calendar_events_groups .css_route_details_calendar_grouped_events`).length;
  if (!(eventGroupQuantity === currentEventGroupSeatQuantity)) {
    var capacity = currentEventGroupSeatQuantity - eventGroupQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var eventGroupIndex = currentEventGroupSeatQuantity + o;
        var thisEventGroupElement = generateElementOfEventGroup();
        elementQuerySelector(Field, '.css_route_details_calendar_events_groups').appendChild(thisEventGroupElement.element);
        var thisDayElement = generateElementOfDay();
        elementQuerySelector(Field, '.css_route_details_calendar_days').appendChild(thisDayElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        var eventGroupIndex = currentEventGroupSeatQuantity - 1 - o;
        elementQuerySelectorAll(Field, `.css_route_details_calendar_events_groups .css_route_details_calendar_grouped_events`)[eventGroupIndex].remove();
        elementQuerySelectorAll(Field, `.css_route_details_calendar_days .css_route_details_calendar_day`)[eventGroupIndex].remove();
      }
    }
  }

  for (let i = 0; i < eventGroupQuantity; i++) {
    var eventGroupKey = `d_${i}`;
    var thisEventGroupElement = elementQuerySelectorAll(Field, `.css_route_details_calendar_events_groups .css_route_details_calendar_grouped_events`)[i];
    var currentEventSeatQuantity = elementQuerySelectorAll(thisEventGroupElement, `.css_route_details_calendar_event`).length;
    if (!(eventQuantity[eventGroupKey] === currentEventSeatQuantity)) {
      var capacity = currentEventSeatQuantity - eventQuantity[eventGroupKey];
      if (capacity < 0) {
        for (let o = 0; o < Math.abs(capacity); o++) {
          var thisEventElement = generateElementOfEvent();
          thisEventGroupElement.appendChild(thisEventElement.element);
        }
      } else {
        for (let o = 0; o < Math.abs(capacity); o++) {
          var eventIndex = currentEventSeatQuantity - 1 - o;
          elementQuerySelectorAll(thisEventGroupElement, `.css_route_details_calendar_event`)[eventIndex].remove();
        }
      }
    }
  }

  for (let i = 0; i < eventGroupQuantity; i++) {
    var eventGroupKey = `d_${i}`;
    var thisDay = eventGroups[eventGroupKey];
    var thisEventGroupElement = elementQuerySelectorAll(Field, `.css_route_details_calendar_events_groups .css_route_details_calendar_grouped_events`)[i];
    var thisDayElement = elementQuerySelectorAll(Field, `.css_route_details_calendar_days .css_route_details_calendar_day`)[i];
    thisEventGroupElement.setAttribute('skeleton-screen', skeletonScreen);
    thisEventGroupElement.setAttribute('displayed', new Date().getDay() === i ? true : false);
    thisDayElement.innerText = thisDay.name;
    thisDayElement.setAttribute('highlighted', new Date().getDay() === i ? true : false);
    thisDayElement.setAttribute('animation', animation);
    thisDayElement.setAttribute('skeleton-screen', skeletonScreen);

    for (let j = 0; j < eventQuantity[eventGroupKey]; j++) {
      const thisElement = elementQuerySelectorAll(thisEventGroupElement, `.css_route_details_calendar_event`)[j];
      const thisEvent = groupedEvents[eventGroupKey][j];
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
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

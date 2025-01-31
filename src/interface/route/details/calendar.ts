import { GeneratedElement, querySize } from '../../index';
import { generateIdentifier, compareThings, booleanToString } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { getSettingOptionValue } from '../../../data/settings/index';
import { getCSSVariableValue } from '../../../tools/style';
import { drawRoundedRect } from '../../../tools/graphic';

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
const gridlineLabelWidthLimit = 45;
const fontFamily: string = '"Noto Sans TC", sans-serif';

let canvasSize = querySize('route-details-canvas');
let canvasWidth = canvasSize.width;
let canvasHeight = canvasSize.height;

let currentCalendar = {};

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

function drawGridline(hours: number): void {
  const boxX = 0;
  const boxY = hours * calendar_ratio;

  CalendarCanvasContext.fillStyle = getCSSVariableValue('--b-cssvar-ededf2');

  // draw line
  CalendarCanvasContext.fillRect(boxX + gridlineLabelWidthLimit, boxY + 5, canvasWidth - gridlineLabelWidthLimit, gridlineWidth);

  // draw label
  CalendarCanvasContext.font = `400 ${12}px ${fontFamily}`;
  CalendarCanvasContext.textBaseline = 'top';
  const labelText = `${String(hours).padStart(2, '0')}:00`;
  const labelMeasurement = CalendarCanvasContext.measureText(labelText);
  const labelWidth = labelMeasurement.width;
  const labelHeight = labelMeasurement.actualBoundingBoxDescent;
  CalendarCanvasContext.fillText(labelText, gridlineLabelWidthLimit - labelWidth, boxY + (gridlineBoxHeight - labelHeight) / 2, labelWidth);
}

function drawEvent(thisEvent: object): void {
  const thisDayStart = new Date();
  thisDayStart.setDate(1);
  thisDayStart.setMonth(0);
  thisDayStart.setFullYear(thisEvent.date.getFullYear());
  thisDayStart.setMonth(thisEvent.date.getMonth());
  thisDayStart.setDate(thisEvent.date.getDate());
  thisDayStart.setHours(0);
  thisDayStart.setMinutes(0);
  thisDayStart.setSeconds(0);
  thisDayStart.setMilliseconds(0);

  const boxX = gridlineLabelWidthLimit;
  const boxY = ((thisEvent.date.getTime() - thisDayStart.getTime()) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio;
  const boxWidth = canvasWidth - gridlineLabelWidthLimit;
  const boxHeight = ((thisEvent.duration * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio;

  // draw background
  drawRoundedRect(CalendarCanvasContext, boxX, boxY, boxWidth, boxHeight, 3, `rgba(${getCSSVariableValue('--b-cssvar-main-color-r')}, ${getCSSVariableValue('--b-cssvar-main-color-g')}, ${getCSSVariableValue('--b-cssvar-main-color-b')}, ${getCSSVariableValue('--b-cssvar-main-color-opacity-d')})`);

  // draw decoration
  drawRoundedRect(CalendarCanvasContext, boxX, boxY, 3, boxHeight, 3, getCSSVariableValue('--b-cssvar-main-color'));

  // draw text
  CalendarCanvasContext.font = `400 ${12}px ${fontFamily}`;
  CalendarCanvasContext.textBaseline = 'top';
  CalendarCanvasContext.fillStyle = getCSSVariableValue('--b-cssvar-ededf2');
  const text = thisEvent.dateString;
  const textMeasurement = CalendarCanvasContext.measureText(text);
  const textWidth = textMeasurement.width;
  const textHeight = textMeasurement.actualBoundingBoxDescent;
  CalendarCanvasContext.fillText(text, boxX + 8, boxY + (boxHeight - textHeight) / 2, textWidth);
}

export function drawEventGroup(eventGroupIndex: number): void {
  const eventGroupQuantity = currentCalendar.eventGroupQuantity;
  const eventQuantity = currentCalendar.eventQuantity;
  const groupedEvents = currentCalendar.groupedEvents;
  const eventGroups = currentCalendar.eventGroups;

  if (0 < eventGroupIndex && eventGroupIndex < eventGroupQuantity) {
    CalendarCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let hours = 0; hours < 24; hours++) {
      drawGridline(hours);
    }
    const groupKey = `d_${eventGroupIndex}`;
    const thisGroupEvents = groupedEvents[groupKey];
    const thisGroupEventQuantity = eventQuantity[groupKey];
    for (let i = 0; i < thisGroupEventQuantity; i++) {
      const thisEvent = thisGroupEvents[i];
      drawEvent(thisEvent);
    }
  }
}

export function setUpCalendarFieldSkeletonScreen(Field: HTMLElement) {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const defaultEventQuantity = {
    d_0: 47,
    d_1: 47,
    d_2: 47,
    d_3: 47,
    d_4: 47,
    d_5: 47,
    d_6: 47
  };
  const defaultEventGroupQuantity = 7;
  let groupedEvents = {};
  let eventGroups = {};
  for (let i = 0; i < defaultEventGroupQuantity; i++) {
    var eventGroupKey = `d_${i}`;
    groupedEvents[eventGroupKey] = [];
    eventGroups[eventGroupKey] = {
      day: i,
      code: `d_{i}`,
      name: ''
    };
    for (let j = 0; j < defaultEventQuantity[eventGroupKey]; j++) {
      const date = new Date();
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

export async function updateCalendarField(calendar: object, skeletonScreen: boolean, animation: boolean): void {
 
  const eventGroupQuantity = calendar.eventGroupQuantity;
  const eventQuantity = calendar.eventQuantity;
  const groupedEvents = calendar.groupedEvents;
  const eventGroups = calendar.eventGroups;

  const currentDaySeatQuantity = elementQuerySelectorAll(CalendarGroupElement, `.css_route_details_calendar_days .css_route_details_calendar_day`).length;
  if (!(eventGroupQuantity === currentDaySeatQuantity)) {
    const capacity = currentDaySeatQuantity - eventGroupQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        // const eventGroupIndex = currentEventGroupSeatQuantity + o;
        const newDayElement = generateElementOfDay();
        elementQuerySelector(CalendarGroupElement, '.css_route_details_calendar_days').appendChild(newDayElement.element);
      }
    } else {
      for (let o = 0; o < Math.abs(capacity); o++) {
        const eventGroupIndex = currentDaySeatQuantity - 1 - o;
        elementQuerySelectorAll(CalendarGroupElement, `.css_route_details_calendar_days .css_route_details_calendar_day`)[eventGroupIndex].remove();
      }
    }
  }

  var eventGroupKey = `d_${i}`;
  var thisDay = eventGroups[eventGroupKey];
  var thisDayElement = elementQuerySelectorAll(CalendarGroupElement, `.css_route_details_calendar_days .css_route_details_calendar_day`)[i];
  thisEventGroupElement.setAttribute('skeleton-screen', skeletonScreen);
  thisEventGroupElement.setAttribute('displayed', new Date().getDay() === i ? true : false);
  thisDayElement.innerText = thisDay.name;
  thisDayElement.setAttribute('highlighted', new Date().getDay() === i ? true : false);
  thisDayElement.setAttribute('animation', animation);
  thisDayElement.setAttribute('skeleton-screen', skeletonScreen);

  for (let i = 0; i < eventGroupQuantity; i++) {
   
    var thisEventGroupElement = elementQuerySelectorAll(CalendarGroupElement, `.css_route_details_calendar_events_groups .css_route_details_calendar_grouped_events`)[i];
 

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

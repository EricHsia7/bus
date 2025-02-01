import { GeneratedElement, querySize } from '../../index';
import { generateIdentifier } from '../../../tools/index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { getSettingOptionValue } from '../../../data/settings/index';
import { getCSSVariableValue } from '../../../tools/style';
import { drawRoundedRect } from '../../../tools/graphic';
import { Calendar, CalendarDay, CalendarEvent, CalendarEventGroup } from '../../../data/route/details';

const RouteDetailsField = documentQuerySelector('.css_route_details_field');
const RouteDetailsBodyElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body');
const RouteDetailsGroupsElement = elementQuerySelector(RouteDetailsBodyElement, '.css_route_details_groups');
const CalendarGroupElement = elementQuerySelector(RouteDetailsGroupsElement, '.css_route_details_group[group="calendar"]');
const CalendarGroupBodyElement = elementQuerySelector(CalendarGroupElement, '.css_route_details_group_body');
const CalendarDaysElement = elementQuerySelector(CalendarGroupBodyElement, '.css_route_details_calendar_days');
const CalendarEventGroupsElement = elementQuerySelector(CalendarGroupBodyElement, '.css_route_details_calendar_event_groups');

const calendar_ratio = 100;
const gridlineBoxHeight = 10;
const gridlineWidth = 1.2;
const gridlineLabelWidthLimit = 45;
const fontFamily: string = '"Noto Sans TC", sans-serif';

let canvasSize = querySize('route-details-canvas');
let canvasWidth = canvasSize.width;
let canvasHeight = canvasSize.height;

let previousCalendar = {} as Calendar;
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

export function setUpCalendarGroupSkeletonScreen() {
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
    const eventGroupKey = `d_${i}`;
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
  updateCalendarGroup(
    {
      calendarEventGroup: groupedEvents,
      calendarDays: eventGroups,
      calendarDayQuantity: defaultEventGroupQuantity,
      calendarEventQuantity: defaultEventQuantity
    },
    true,
    playing_animation
  );
}

export function updateCalendarGroup(calendar: Calendar, skeletonScreen: boolean, animation: boolean): void {
  function updateDay(thisDayElement: HTMLElement, thisDay: CalendarDay, index: number): void {
    thisDayElement.innerText = thisDay.name;
    thisDayElement.setAttribute('highlighted', new Date().getDay() === index ? 'true' : 'false');
    thisDayElement.setAttribute('animation', animation);
    thisDayElement.setAttribute('skeleton-screen', skeletonScreen);
  }

  function updateEventGroup(thisCalendarEventGroupElement: HTMLElement, thisCalendarEventGroup: CalendarEventGroup, index: number): void {
    function drawGridline(context: CanvasRenderingContext2D, hours: number): void {
      const boxX = 0;
      const boxY = hours * calendar_ratio;

      context.fillStyle = getCSSVariableValue('--b-cssvar-ededf2');

      // draw line
      context.fillRect(boxX + gridlineLabelWidthLimit, boxY + 5, canvasWidth - gridlineLabelWidthLimit, gridlineWidth);

      // draw label
      context.font = `400 ${12}px ${fontFamily}`;
      context.textBaseline = 'top';
      const labelText = `${String(hours).padStart(2, '0')}:00`;
      const labelMeasurement = context.measureText(labelText);
      const labelWidth = labelMeasurement.width;
      const labelHeight = labelMeasurement.actualBoundingBoxDescent;
      context.fillText(labelText, gridlineLabelWidthLimit - labelWidth, boxY + (gridlineBoxHeight - labelHeight) / 2, labelWidth);
    }

    function drawEvent(context: CanvasRenderingContext2D, thisCalendarEvent: CalendarEvent): void {
      const thisDayStart = new Date();
      thisDayStart.setDate(1);
      thisDayStart.setMonth(0);
      thisDayStart.setFullYear(thisCalendarEvent.date.getFullYear());
      thisDayStart.setMonth(thisCalendarEvent.date.getMonth());
      thisDayStart.setDate(thisCalendarEvent.date.getDate());
      thisDayStart.setHours(0);
      thisDayStart.setMinutes(0);
      thisDayStart.setSeconds(0);
      thisDayStart.setMilliseconds(0);

      const boxX = gridlineLabelWidthLimit;
      const boxY = ((thisCalendarEvent.date.getTime() - thisDayStart.getTime()) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio;
      const boxWidth = canvasWidth - gridlineLabelWidthLimit;
      const boxHeight = ((thisCalendarEvent.duration * 60 * 1000) / (24 * 60 * 60 * 1000)) * 24 * calendar_ratio;

      // draw background
      drawRoundedRect(context, boxX, boxY, boxWidth, boxHeight, 3, `rgba(${getCSSVariableValue('--b-cssvar-main-color-r')}, ${getCSSVariableValue('--b-cssvar-main-color-g')}, ${getCSSVariableValue('--b-cssvar-main-color-b')}, ${getCSSVariableValue('--b-cssvar-main-color-opacity-d')})`);

      // draw decoration
      drawRoundedRect(context, boxX, boxY, 3, boxHeight, 3, getCSSVariableValue('--b-cssvar-main-color'));

      // draw text
      context.font = `400 ${12}px ${fontFamily}`;
      context.textBaseline = 'top';
      context.fillStyle = getCSSVariableValue('--b-cssvar-ededf2');
      const text = thisCalendarEvent.dateString;
      const textMeasurement = context.measureText(text);
      const textWidth = textMeasurement.width;
      const textHeight = textMeasurement.actualBoundingBoxDescent;
      context.fillText(text, boxX + 8, boxY + (boxHeight - textHeight) / 2, textWidth);
    }

    function updateDisplayed(thisCalendarEventGroupElement: HTMLElement, index: number): void {
      thisCalendarEventGroupElement.setAttribute('displayed', new Date().getDay() === index ? 'true' : 'false');
    }

    const thisCalendarEventGroupCanvas = elementQuerySelector(thisCalendarEventGroupElement, '.css_route_details_calendar_event_group_canvas') as HTMLCanvasElement;
    const thisCalendarEventGroupCanvasContext = thisCalendarEventGroupCanvas.getContext('2d');

    updateDisplayed(thisCalendarEventGroupElement, index);

    thisCalendarEventGroupCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let hours = 0; hours < 24; hours++) {
      drawGridline(thisCalendarEventGroupCanvasContext, hours);
    }
    for (const thisCalendarEvent of thisCalendarEventGroup) {
      drawEvent(thisCalendarEventGroupCanvasContext, thisCalendarEvent);
    }
  }

  const eventGroups = calendar.calendarDays;
  const eventGroupQuantity = calendar.calendarDayQuantity;
  const groupedEvents = calendar.calendarEventGroup;
  const eventQuantity = calendar.calendarEventQuantity;

  const currentEventGroupSeatQuantity = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group').length;
  if (!(eventGroupQuantity === currentEventGroupSeatQuantity)) {
    const capacity = currentEventGroupSeatQuantity - eventGroupQuantity;
    if (capacity < 0) {
      for (let o = 0; o < Math.abs(capacity); o++) {
        // const eventGroupIndex = currentEventGroupSeatQuantity + o;
        const newDayElement = generateElementOfDay();
        CalendarDaysElement.appendChild(newDayElement.element);
        const newEventGroupElement = generateElementOfEventGroup();
        CalendarEventGroupsElement.appendChild(newEventGroupElement.element);
      }
    } else {
      const CalendarDayElements = elementQuerySelectorAll(CalendarDaysElement, '.css_route_details_calendar_day');
      const CalendarEventGroupElements = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group');
      for (let o = 0; o < Math.abs(capacity); o++) {
        const eventGroupIndex = currentEventGroupSeatQuantity - 1 - o;
        CalendarDayElements[eventGroupIndex].remove();
        CalendarEventGroupElements[eventGroupIndex].remove();
      }
    }
  }

  const CalendarDayElements = elementQuerySelectorAll(CalendarDaysElement, '.css_route_details_calendar_day');
  const CalendarEventGroupElements = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group');
  for (let i = 0; i < eventGroupQuantity; i++) {
    const eventGroupKey = `d_${i}`;
    const thisDay = eventGroups[eventGroupKey];
    const thisEventGroup = groupedEvents[eventGroupKey];

    const thisDayElement = CalendarDayElements[i];
    const thisEventGroupElement = CalendarEventGroupElements[i];

    updateDay(thisDayElement, thisDay, i);
    updateEventGroup(thisEventGroupElement, thisEventGroup, i);
  }

  previousCalendar = calendar;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

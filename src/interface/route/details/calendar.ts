import { GeneratedElement, querySize } from '../../index';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../../tools/query-selector';
import { getSettingOptionValue } from '../../../data/settings/index';
import { getCSSVariableValue } from '../../../tools/style';
import { drawRoundedRect } from '../../../tools/graphic';
import { Calendar, CalendarDay, CalendarEvent, CalendarEventGroup } from '../../../data/route/details';
import { booleanToString } from '../../../tools/index';

const RouteDetailsField = documentQuerySelector('.css_route_details_field');
const RouteDetailsBodyElement = elementQuerySelector(RouteDetailsField, '.css_route_details_body');
const RouteDetailsGroupsElement = elementQuerySelector(RouteDetailsBodyElement, '.css_route_details_groups');
const CalendarGroupElement = elementQuerySelector(RouteDetailsGroupsElement, '.css_route_details_group[group="calendar"]');
const CalendarGroupBodyElement = elementQuerySelector(CalendarGroupElement, '.css_route_details_group_body');
const CalendarDaysElement = elementQuerySelector(CalendarGroupBodyElement, '.css_route_details_calendar_days');
const CalendarEventGroupsElement = elementQuerySelector(CalendarGroupBodyElement, '.css_route_details_calendar_event_groups');

const calendar_ratio = 60;
const scaleLimit = Math.floor(4096 / (calendar_ratio * 24));
const gridlineBoxHeight = 10;
const gridlineWidth = 1.2;
const gridlineLabelWidthLimit = 45;
const fontFamily: string = '"Noto Sans TC", sans-serif';

let canvasSize = querySize('route-details-canvas');
let canvasWidth = canvasSize.width;
let canvasHeight = canvasSize.height;
let canvasScale = Math.min(window.devicePixelRatio, scaleLimit) || 1;

let previousCalendar = {} as Calendar;
let previousAnimation: boolean = true;
let previousSkeletonScreen: boolean = false;

function resizeRouteDetailsCalendarCanvas(canvas: HTMLCanvasElement): void {
  canvasSize = querySize('route-details-canvas');
  canvasWidth = canvasSize.width;
  canvasHeight = canvasSize.height;
  canvasScale = Math.min(window.devicePixelRatio, scaleLimit) || 1;

  // Set the new size
  canvas.width = canvasWidth * canvasScale;
  canvas.height = canvasHeight * canvasScale;

  // Reset transformations before scaling
  const context = canvas.getContext('2d');
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(canvasScale, canvasScale);
}

function generateElementOfDay(): GeneratedElement {
  // const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_route_details_calendar_day');
  // element.id = identifier;
  return {
    element: element,
    id: ''
  };
}

function generateElementOfEventGroup(): GeneratedElement {
  // const identifier = generateIdentifier('i');
  const element = document.createElement('div');
  element.classList.add('css_route_details_calendar_event_group');
  element.innerHTML = `<canvas class="css_route_details_calendar_event_group_canvas"></canvas>`;
  // element.id = identifier;
  return {
    element: element,
    id: ''
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
  const defaultDayQuantity = 7;
  let calendarEventGroups = {};
  let calendarDays = {};
  for (let i = 0; i < defaultDayQuantity; i++) {
    const eventGroupKey = `d_${i}`;
    calendarEventGroups[eventGroupKey] = [];
    calendarDays[eventGroupKey] = {
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
      calendarEventGroups[eventGroupKey].push({
        date: date,
        dateString: '',
        duration: 15
      });
    }
  }
  updateCalendarGroup(
    {
      calendarEventGroups: calendarEventGroups,
      calendarDays: calendarDays,
      calendarDayQuantity: defaultDayQuantity,
      calendarEventQuantity: defaultEventQuantity
    },
    true,
    playing_animation
  );
}

function updateDay(thisDayElement: HTMLElement, thisDay: CalendarDay, currentDay: number, skeletonScreen: boolean, animation: boolean, index: number): void {
  thisDayElement.innerText = thisDay.name;
  thisDayElement.setAttribute('day', index.toString());
  thisDayElement.setAttribute('onclick', `bus.route.switchCalendarDay(${index})`);
  thisDayElement.setAttribute('highlighted', currentDay === index ? 'true' : 'false');
  thisDayElement.setAttribute('animation', booleanToString(animation));
  thisDayElement.setAttribute('skeleton-screen', booleanToString(skeletonScreen));
}

function updateEventGroup(thisCalendarEventGroupElement: HTMLElement, thisCalendarEventGroup: CalendarEventGroup, currentDay: number, mainColor: string, mainColorR: string, mainColorG: string, mainColorB: string, mainColorA: string, gridColor: string, index: number): void {
  function drawGridline(thisContext: CanvasRenderingContext2D, hours: number, gridColor: string): void {
    const boxX = 0;
    const boxY = hours * calendar_ratio;

    // Cache the color value once
    thisContext.fillStyle = gridColor;

    // Draw line
    thisContext.fillRect(boxX + gridlineLabelWidthLimit, boxY + 5, canvasWidth - gridlineLabelWidthLimit, gridlineWidth);

    // Draw label
    thisContext.font = `400 ${12}px ${fontFamily}`;
    thisContext.textBaseline = 'top';
    const labelText = `${String(hours).padStart(2, '0')}:00`;
    const labelMeasurement = thisContext.measureText(labelText);
    const labelWidth = labelMeasurement.width;
    const labelHeight = labelMeasurement.actualBoundingBoxDescent;
    thisContext.fillText(labelText, (gridlineLabelWidthLimit - labelWidth) / 2, boxY + (gridlineBoxHeight - labelHeight) / 2, labelWidth);
  }

  function drawEvent(thisContext: CanvasRenderingContext2D, thisCalendarEvent: CalendarEvent, mainColor: string, mainColorR: string, mainColorG: string, mainColorB: string, mainColorA: string): void {
    // Calculate the start of the day for this event only once.
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

    // Draw background with rounded rectangle
    drawRoundedRect(thisContext, boxX, boxY, boxWidth, boxHeight, 3, `rgba(${mainColorR}, ${mainColorG}, ${mainColorB}, ${mainColorA})`);

    // Draw decoration (a thin rounded rectangle)
    drawRoundedRect(thisContext, boxX, boxY, 3, boxHeight, { tl: 3, tr: 0, bl: 3, br: 0 }, mainColor);

    // Draw event text
    thisContext.font = `400 ${14}px ${fontFamily}`;
    thisContext.textBaseline = 'top';
    thisContext.fillStyle = mainColor;
    const text = thisCalendarEvent.dateString;
    const textMeasurement = thisContext.measureText(text);
    const textWidth = textMeasurement.width;
    const textHeight = textMeasurement.actualBoundingBoxDescent;
    thisContext.fillText(text, boxX + 8, boxY + (boxHeight - textHeight) / 2, textWidth);
  }

  function updateDisplayed(thisCalendarEventGroupElement: HTMLElement, currentDay: number, index: number): void {
    // Set the displayed attribute based on whether it is the current day.
    const isDisplayed = currentDay === index;
    thisCalendarEventGroupElement.setAttribute('displayed', booleanToString(isDisplayed));
  }

  // Get the canvas and its 2D context.
  const thisCalendarEventGroupCanvas = elementQuerySelector(thisCalendarEventGroupElement, '.css_route_details_calendar_event_group_canvas') as HTMLCanvasElement;
  const thisCalendarEventGroupCanvasContext = thisCalendarEventGroupCanvas.getContext('2d');

  // Update the displayed attribute
  updateDisplayed(thisCalendarEventGroupElement, index);

  // Always resize the canvas to ensure proper dimensions.
  resizeRouteDetailsCalendarCanvas(thisCalendarEventGroupCanvas);

  const isDisplayed = currentDay === index;
  if (isDisplayed) {
    // Clear the canvas and redraw the content when displayed.
    thisCalendarEventGroupCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw the gridlines.
    for (let hours = 0; hours < 24; hours++) {
      drawGridline(thisCalendarEventGroupCanvasContext, hours, gridColor);
    }

    // Draw all events for this group.
    for (const thisCalendarEvent of thisCalendarEventGroup) {
      drawEvent(thisCalendarEventGroupCanvasContext, thisCalendarEvent, mainColor, mainColorR, mainColorG, mainColorB, mainColorA);
    }
  } else {
    // When not displayed, clear the canvas.
    thisCalendarEventGroupCanvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  }
}

export function updateCalendarGroup(calendar: Calendar, skeletonScreen: boolean, animation: boolean): void {
  // The default day to display.
  const currentDay = new Date().getDay();

  // Retrieve the CSS variable values just once
  const mainColorR = getCSSVariableValue('--b-cssvar-main-color-r');
  const mainColorG = getCSSVariableValue('--b-cssvar-main-color-g');
  const mainColorB = getCSSVariableValue('--b-cssvar-main-color-b');
  const mainColorA = getCSSVariableValue('--b-cssvar-main-color-opacity-d');
  const mainColor = getCSSVariableValue('--b-cssvar-main-color');
  const gridColor = getCSSVariableValue('--b-cssvar-ededf2');

  const eventGroups = calendar.calendarDays;
  const eventGroupQuantity = calendar.calendarDayQuantity;
  const calendarEventGroups = calendar.calendarEventGroups;
  const eventQuantity = calendar.calendarEventQuantity;

  const currentEventGroupSeatQuantity = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group').length;
  if (eventGroupQuantity !== currentEventGroupSeatQuantity) {
    const capacity = currentEventGroupSeatQuantity - eventGroupQuantity;
    if (capacity < 0) {
      // Add missing day and event group elements.
      for (let o = 0; o < Math.abs(capacity); o++) {
        const newDayElement = generateElementOfDay();
        CalendarDaysElement.appendChild(newDayElement.element);
        const newEventGroupElement = generateElementOfEventGroup();
        CalendarEventGroupsElement.appendChild(newEventGroupElement.element);
      }
    } else {
      // Remove extra elements.
      const CalendarDayElements = elementQuerySelectorAll(CalendarDaysElement, '.css_route_details_calendar_day');
      const CalendarEventGroupElements = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group');
      for (let o = 0; o < Math.abs(capacity); o++) {
        const eventGroupIndex = currentEventGroupSeatQuantity - 1 - o;
        CalendarDayElements[eventGroupIndex].remove();
        CalendarEventGroupElements[eventGroupIndex].remove();
      }
    }
  }

  // Update each day and its corresponding event group.
  const CalendarDayElements = elementQuerySelectorAll(CalendarDaysElement, '.css_route_details_calendar_day');
  const CalendarEventGroupElements = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group');
  for (let i = 0; i < eventGroupQuantity; i++) {
    const eventGroupKey = `d_${i}`;
    const thisDay = eventGroups[eventGroupKey];
    const thisEventGroup = calendarEventGroups[eventGroupKey];

    const thisDayElement = CalendarDayElements[i];
    const thisEventGroupElement = CalendarEventGroupElements[i];

    updateDay(thisDayElement, thisDay, currentDay, skeletonScreen, animation, i);
    updateEventGroup(thisEventGroupElement, thisEventGroup, currentDay, mainColor, mainColorR, mainColorG, mainColorB, mainColorA, gridColor, i);
  }

  previousCalendar = calendar;
  previousAnimation = animation;
  previousSkeletonScreen = skeletonScreen;
}

export function switchCalendarDay(day: number): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;
  const calendarDayElements = elementQuerySelectorAll(CalendarDaysElement, '.css_route_details_calendar_day');
  const CalendarEventGroupElements = elementQuerySelectorAll(CalendarEventGroupsElement, '.css_route_details_calendar_event_group');
  for (let i = 0; i < 7; i++) {
    const thisCalendarDayElement = calendarDayElements[i];
    // const thisCalendarDayElementDay = parseInt(thisCalendarDayElement.getAttribute('day'));
    const thisEventGroupElement = CalendarEventGroupElements[i];
    // if (thisCalendarDayElementDay === day) {
    /*
      thisCalendarDayElement.setAttribute('highlighted', 'true');
      thisEventGroupElement.setAttribute('displayed', 'true');
      */
    const eventGroupKey = `d_${i}`;
    const calendarEventGroup = previousCalendar?.calendarEventGroups[eventGroupKey];
    const calendarDay = previousCalendar?.calendarDays[eventGroupKey];
    if (calendarEventGroup && calendarDay) {
      // Retrieve the CSS variable values just once
      const mainColorR = getCSSVariableValue('--b-cssvar-main-color-r');
      const mainColorG = getCSSVariableValue('--b-cssvar-main-color-g');
      const mainColorB = getCSSVariableValue('--b-cssvar-main-color-b');
      const mainColorA = getCSSVariableValue('--b-cssvar-main-color-opacity-d');
      const mainColor = getCSSVariableValue('--b-cssvar-main-color');
      const gridColor = getCSSVariableValue('--b-cssvar-ededf2');

      // Reuse the drawing logic from updateEventGroup and updateDay for the visible event group.
      updateDay(thisCalendarDayElement, calendarDay, day, false, playing_animation, i);
      updateEventGroup(thisEventGroupElement, calendarEventGroup, day, mainColor, mainColorR, mainColorG, mainColorB, mainColorA, gridColor, i);
    }
    /*} else {
      thisCalendarDayElement.setAttribute('highlighted', 'false');
      thisEventGroupElement.setAttribute('displayed', 'false');

      // Clear the canvas for non-displayed elements.
      const canvas = elementQuerySelector(thisEventGroupElement, '.css_route_details_calendar_event_group_canvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }*/
  }
}

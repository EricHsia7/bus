import { SimplifiedRouteItem } from '../../data/apis/getRoute/index';
import { integratedRouteCalendar, integrateRouteCalendar } from '../../data/route/calendar';
import { documentQuerySelector, elementQuerySelector, elementQuerySelectorAll } from '../../tools/elements';
import { generateRoundedRectPath } from '../../tools/graphic';
import { generateIdentifier } from '../../tools/index';
import { dateToString, offsetDate } from '../../tools/time';
import { hidePreviousPage, pushPageHistory, querySize, revokePageHistory, showPreviousPage } from '../index';

const routeCalendarField = documentQuerySelector('.css_route_calendar_field');
const headElement = elementQuerySelector(routeCalendarField, '.css_route_calendar_head');
const dateElement = elementQuerySelector(headElement, '.css_route_calendar_date');
const timelinesElement = elementQuerySelector(routeCalendarField, '.css_route_calendar_timelines');
const timelineElements = Array.from(elementQuerySelectorAll(timelinesElement, '.css_route_calendar_timeline'));

let currentDate = new Date();
let currentIntegration = {} as integratedRouteCalendar;
const currentTimelineSVGs = ['', '', ''];

let routeCalendarSliding_fieldWidth: number = 0;
let routeCalendarSliding_initialized: boolean = false;

function generateRouteCalendarSVG(integration: integratedRouteCalendar, date: Date, width: number): string {
  const verticalPadding = 10;
  const fontFamily = "'Noto Sans TC', sans-serif";

  const gridLabelWidth = 35;
  const gridHeight = 70;
  const gridLineLabelFontWeight = 400;
  const gridLineLabelFontSize = 10;

  const borderRadius = 5;
  const decorationWidth = 3;
  const eventBoxPadding = 3;
  const eventBoxFontWeight = 500;
  const eventBoxFontSize = 15;

  const gridLinePathCommands = [];
  const gridLineLabels = [];
  for (let i = 0; i < 24; i++) {
    const text = `${i.toString().padStart(2, '0')}:00`;
    const textWidth = 30;
    const textHeight = 12;
    // TODO: measure text width and height
    const y = i * gridHeight + verticalPadding;
    gridLinePathCommands.push(`M${gridLabelWidth} ${y}`, `h${width - gridLabelWidth}`);
    gridLineLabels.push(`<text x="${gridLabelWidth - textWidth}" y="${y + 3}" font-weight="${gridLineLabelFontWeight}" font-size="${gridLineLabelFontSize}" font-family="${fontFamily}" component="gridline-label">${text}</text>`);
  }

  const gridLine = `<path d="${gridLinePathCommands.join(' ')}" fill="none" stroke-width="0.35" component="gridline"/>`;
  const height = gridHeight * 24 + verticalPadding * 2;

  const day = date.getDay();
  const events = integration.repeated[day];
  const scheduledEvents = integration.scheduled;
  const date2 = offsetDate(date, 0, 0, integration.timeZoneOffset - date.getTimezoneOffset());
  const eventDate = [date2.getFullYear(), date2.getMonth() + 1, date2.getDate()];
  for (let i = scheduledEvents.length - 1; i >= 0; i--) {
    if (eventDate[0] === scheduledEvents[i].date[0] && eventDate[1] === scheduledEvents[i].date[1] && eventDate[2] === scheduledEvents[i].date[2]) {
      events.push({
        type: 'repeated',
        time: scheduledEvents[i].time,
        interval: scheduledEvents[i].interval,
        count: scheduledEvents[i].count,
        day: day
      });
    }
  }

  const eventBoxPathCommands = [];
  const eventBoxDecorationPathCommands = [];
  const eventBoxTexts = [];
  const minutesPerDay = 24 * 60;
  for (let i = events.length - 1; i >= 0; i--) {
    const x = gridLabelWidth;
    const y = (events[i].time[0] / minutesPerDay) * height;
    const boxWidth = width - gridLabelWidth;
    const boxHeight = ((events[i].time[1] - events[i].time[0]) / minutesPerDay) * height;
    const startMinutes = events[i].time[0] % 60;
    const startHours = (events[i].time[0] - startMinutes) / 60;
    const endMinutes = events[i].time[1] % 60;
    const endHours = (events[i].time[1] - endMinutes) / 60;
    const title = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')} - ${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    const titleWidth = 30;
    const titleHeight = 17;
    const description = `每${events[i].interval[0] === events[i].interval[1] ? events[i].interval[0] : events[i].interval.join(' - ')}分鐘一班 | ${events[i].count[0] === events[i].count[1] ? events[i].count[0] : events[i].count.join(' - ')}班`;
    const descriptionWidth = 30;
    const descriptionHeight = 17;
    Array.prototype.push.apply(eventBoxPathCommands, generateRoundedRectPath(x, y, boxWidth, boxHeight, borderRadius, false));
    eventBoxDecorationPathCommands.push(`M${x + eventBoxPadding} ${y + eventBoxPadding}`, `v${boxHeight - eventBoxPadding * 2}`);
    eventBoxTexts.push(`<text x="${x + eventBoxPadding + decorationWidth + eventBoxPadding}" y="${y + eventBoxPadding + titleHeight}" font-weight="${eventBoxFontWeight}" font-size="${eventBoxFontSize}" font-family="${fontFamily}" component="event-title">${title}</text>`, `<text x="${x + eventBoxPadding + decorationWidth + eventBoxPadding}" y="${y + eventBoxPadding + titleHeight + descriptionHeight}" font-weight="${eventBoxFontWeight}" font-size="${eventBoxFontSize}" font-family="${fontFamily}" component="event-description">${description}</text>`);
  }

  const eventBoxes = `<path d="${eventBoxPathCommands.join(' ')}" stroke="none" component="event-box"/>`;
  const eventBoxDecorations = `<path d="${eventBoxDecorationPathCommands.join(' ')}" fill="none" stroke-width="${decorationWidth}" stroke-linecap="round" stroke-linejoin="round" component="event-decoration"/>`;
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${gridLine}${gridLineLabels.join('')}${eventBoxes}${eventBoxDecorations}${eventBoxTexts.join('')}</svg>`;
  return svg;
}

function initializeRouteCalendarSliding(): void {
  if (routeCalendarSliding_initialized) return;
  routeCalendarSliding_initialized = true;

  timelinesElement.addEventListener('scrollend', function () {
    const scrollLeft = timelinesElement.scrollLeft;
    const idx = Math.round(scrollLeft / routeCalendarSliding_fieldWidth);
    if (idx === 0) {
      currentDate = offsetDate(currentDate, -1, 0, 0);
      const yesterday = offsetDate(currentDate, -1, 0, 0);
      timelineElements[0].before(timelineElements[2]);
      timelinesElement.scrollTo({ left: routeCalendarSliding_fieldWidth });
      [timelineElements[0], timelineElements[1], timelineElements[2]] = [timelineElements[2], timelineElements[0], timelineElements[1]];
      [currentTimelineSVGs[0], currentTimelineSVGs[1], currentTimelineSVGs[2]] = [generateRouteCalendarSVG(currentIntegration, yesterday, routeCalendarSliding_fieldWidth), currentTimelineSVGs[0], currentTimelineSVGs[1]];
      timelineElements[0].innerHTML = currentTimelineSVGs[0];
      dateElement.innerText = dateToString(currentDate, 'YYYY-MM-DD WW');
    } else if (idx === 2) {
      currentDate = offsetDate(currentDate, 1, 0, 0);
      const tomorrow = offsetDate(currentDate, 1, 0, 0);
      timelineElements[2].after(timelineElements[0]);
      timelinesElement.scrollTo({ left: routeCalendarSliding_fieldWidth });
      [timelineElements[0], timelineElements[1], timelineElements[2]] = [timelineElements[1], timelineElements[2], timelineElements[0]];
      [currentTimelineSVGs[0], currentTimelineSVGs[1], currentTimelineSVGs[2]] = [currentTimelineSVGs[1], currentTimelineSVGs[2], generateRouteCalendarSVG(currentIntegration, tomorrow, routeCalendarSliding_fieldWidth)];
      timelineElements[2].innerHTML = currentTimelineSVGs[2];
      dateElement.innerText = dateToString(currentDate, 'YYYY-MM-DD WW');
    }
  });

  timelinesElement.scrollTo({ left: routeCalendarSliding_fieldWidth });
}

async function initializeRouteCalendar(PathAttributeId: SimplifiedRouteItem['pid']) {
  const FieldSize = querySize('window');
  routeCalendarSliding_fieldWidth = FieldSize.width;
  currentDate = new Date();
  const requestID = generateIdentifier();
  const integration = await integrateRouteCalendar(PathAttributeId, requestID);
  currentIntegration = integration;
  for (let i = 0; i < 3; i++) {
    const date = offsetDate(currentDate, i - 1, 0, 0);
    currentTimelineSVGs[i] = generateRouteCalendarSVG(integration, date, routeCalendarSliding_fieldWidth);
    timelineElements[i].innerHTML = currentTimelineSVGs[i];
  }
  dateElement.innerText = dateToString(currentDate, 'YYYY-MM-DD WW');
  initializeRouteCalendarSliding();
}

export function showRouteCalendar(): void {
  routeCalendarField.setAttribute('displayed', 'true');
}

export function hideRouteCalendar(): void {
  routeCalendarField.setAttribute('displayed', 'false');
}

export function openRouteCalendar(PathAttributeId: SimplifiedRouteItem['pid']): void {
  pushPageHistory('RouteCalendar');
  showRouteCalendar();
  initializeRouteCalendar(PathAttributeId);
  hidePreviousPage();
}

export function closeRouteCalendar(): void {
  hideRouteCalendar();
  showPreviousPage();
  revokePageHistory('RouteCalendar');
}

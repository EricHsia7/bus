import { GeneratedElement } from '../../index.ts';
import { indexToDay } from '../../../tools/format-time.ts';
import { md5 } from '../../../tools/index.ts';

const calendar_ratio = 100;

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

function generateElementOfDay(dayOfWeek: object): GeneratedElement {
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

function generateElementOfEventsGroup(dayOfWeek: object): GeneratedElement {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('route_information_calendar_grouped_events');
  element.id = identifier;
  element.setAttribute('day', dayOfWeek.day);
  element.setAttribute('displayed', new Date().getDay() === dayOfWeek.day ? true : false);
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
  element.style.setProperty('--b-calendar-event-top', `${((event.date.getTime() - thisDayStart.getTime()) / (24 * 60 * 60 * 1000))*24 * calendar_ratio}px`);
  element.style.setProperty('--b-calendar-event-height', `${((event.duration * 60 * 1000) / (24 * 60 * 60 * 1000))*24 * calendar_ratio}px`);
  element.innerHTML = event.dateString;
  return {
    element: element,
    id: identifier
  };
}

export function initializeCalendar(Field: HTMLElement, calendar: object): void {
  Field.querySelector('.route_information_calendar_days').innerHTML = '';
  Field.querySelector('.route_information_calendar_gridlines').innerHTML = '';
  Field.querySelector('.route_information_calendar_events_groups').innerHTML = '';

  for (var hours = 0; hours < 24; hours++) {
    var thisGridlineElement: GeneratedElement = generateElementOfGridline(hours);
    Field.querySelector('.route_information_calendar_gridlines').appendChild(thisGridlineElement.element);
  }

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

export function setUpFolderFieldSkeletonScreen(Field: HTMLElement) {
  const FieldSize = queryFolderFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;
  var defaultItemQuantity = { f_0: Math.floor(FieldHeight / 50 / 3) + 2, f_1: Math.floor(FieldHeight / 50 / 3) + 2, f_2: Math.floor(FieldHeight / 50 / 3) + 2 };
  var defaultFolderQuantity = 3;
  var foldedItems = {};
  var folders = {};
  for (var i = 0; i < defaultFolderQuantity; i++) {
    var folderKey = `f_${i}`;
    foldedItems[folderKey] = [];
    folders[folderKey] = {
      name: '',
      index: i,
      icon: ''
    };
    for (var j = 0; j < defaultItemQuantity[folderKey]; j++) {
      foldedItems[folderKey].push({
        type: 'stop',
        id: null,
        status: {
          code: 0,
          text: null
        },
        name: null,
        route: {
          name: null,
          endPoints: {
            departure: null,
            destination: null
          },
          id: null
        }
      });
    }
  }
  updateFolderField(
    Field,
    {
      foldedItems: foldedItems,
      folders: folders,
      folderQuantity: defaultFolderQuantity,
      itemQuantity: defaultItemQuantity,
      dataUpdateTime: null
    },
    true
  );
}

export function updateCalendarField(Field: HTMLElement, calendar: object): void {
  Field.querySelector('.route_information_calendar_days').innerHTML = '';
  Field.querySelector('.route_information_calendar_gridlines').innerHTML = '';
  Field.querySelector('.route_information_calendar_events_groups').innerHTML = '';

  for (var hours = 0; hours < 24; hours++) {
    var thisGridlineElement: GeneratedElement = generateElementOfGridline(hours);
    Field.querySelector('.route_information_calendar_gridlines').appendChild(thisGridlineElement.element);
  }

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

export async function updateCalendarField(Field: HTMLElement, calendar: object, skeletonScreen: boolean): void {
  function updateItem(thisElement, thisItem, previousItem) {
    function updateDay(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.home_page_folder_item_stop_name').innerText = thisItem.name;
    }
    function updateEvent(thisElement: HTMLElement, thisItem: object): void {
      thisElement.querySelector('.home_page_folder_item_stop_route').innerText = `${thisItem.route ? thisItem.route.name : ''} - 往${thisItem.route ? [thisItem.route.endPoints.destination, thisItem.route.endPoints.departure, ''][thisItem.direction ? thisItem.direction : 0] : ''}`;
    }
    if (previousItem === null) {
      updateStatus(thisElement, thisItem);
      updateName(thisElement, thisItem);
      updateRoute(thisElement, thisItem);
    } else {
      if (!(thisItem.status.code === previousItem.status.code) || !compareThings(previousItem.status.text, thisItem.status.text)) {
        updateStatus(thisElement, thisItem);
      }
      if (!compareThings(previousItem.name, thisItem.name)) {
        updateName(thisElement, thisItem);
      }
      if (!compareThings(previousItem.id, thisItem.id)) {
        updateRoute(thisElement, thisItem);
      }
    }
  }

  const FieldSize = queryFolderFieldSize();
  const FieldWidth = FieldSize.width;
  const FieldHeight = FieldSize.height;

  if (previousFormattedFoldersWithContent === {}) {
    previousFormattedFoldersWithContent = formattedFoldersWithContent;
  }

  var folderQuantity = formattedFoldersWithContent.folderQuantity;
  var itemQuantity = formattedFoldersWithContent.itemQuantity;
  var foldedItems = formattedFoldersWithContent.foldedItems;
  var folders = formattedFoldersWithContent.folders;

  Field.setAttribute('skeleton-screen', skeletonScreen);

  var currentFolderSeatQuantity = Field.querySelectorAll(`.home_page_folder`).length;
  if (!(folderQuantity === currentFolderSeatQuantity)) {
    var capacity = currentFolderSeatQuantity - folderQuantity;
    if (capacity < 0) {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var folderIndex = currentFolderSeatQuantity + o;
        var thisElement = generateElementOfFolder(currentFolderSeatQuantity + o, true);
        Field.appendChild(thisElement.element);
      }
    } else {
      for (var o = 0; o < Math.abs(capacity); o++) {
        var folderIndex = currentFolderSeatQuantity - 1 - o;
        Field.querySelectorAll(`.home_page_folder`)[folderIndex].remove();
      }
    }
  }

  for (var i = 0; i < folderQuantity; i++) {
    var folderKey = `f_${i}`;
    var currentItemSeatQuantity = Field.querySelectorAll(`.home_page_folder[index="${i}"] .home_page_folder_content .home_page_folder_item_stop`).length;
    if (!(itemQuantity[folderKey] === currentItemSeatQuantity)) {
      var capacity = currentItemSeatQuantity - itemQuantity[folderKey];
      if (capacity < 0) {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var thisElement = generateElementOfItem(true);
          Field.querySelector(`.home_page_folder[index="${i}"] .home_page_folder_content`).appendChild(thisElement.element);
        }
      } else {
        for (var o = 0; o < Math.abs(capacity); o++) {
          var itemIndex = currentItemSeatQuantity - 1 - o;
          Field.querySelectorAll(`.home_page_folder[index="${i}"] .home_page_folder_content .home_page_folder_item_stop`)[itemIndex].remove();
        }
      }
    }
  }

  for (var i = 0; i < folderQuantity; i++) {
    var folderKey = `f_${i}`;
    var thisFolderElement = Field.querySelector(`.home_page_folder[index="${i}"]`);
    thisFolderElement.setAttribute('skeleton-screen', skeletonScreen);
    var thisHeadElement = thisFolderElement.querySelector(`.home_page_folder_head`);
    thisHeadElement.querySelector('.home_page_folder_name').innerText = folders[folderKey].name;
    thisHeadElement.querySelector('.home_page_folder_icon').innerHTML = folders[folderKey].icon.source === 'icons' ? icons[folders[folderKey].icon.id] : '';
    for (var j = 0; j < itemQuantity[folderKey]; j++) {
      var thisElement = Field.querySelectorAll(`.home_page_folder[index="${i}"] .home_page_folder_content .home_page_folder_item_stop`)[j];
      thisElement.setAttribute('skeleton-screen', skeletonScreen);
      var thisItem = foldedItems[folderKey][j];
      if (previousFormattedFoldersWithContent.hasOwnProperty('foldedItems')) {
        if (previousFormattedFoldersWithContent.foldedItems.hasOwnProperty(folderKey)) {
          if (previousFormattedFoldersWithContent.foldedItems[folderKey][j]) {
            var previousItem = previousFormattedFoldersWithContent.foldedItems[folderKey][j];
            updateItem(thisElement, thisItem, previousItem);
          } else {
            updateItem(thisElement, thisItem, null);
          }
        } else {
          updateItem(thisElement, thisItem, null);
        }
      } else {
        updateItem(thisElement, thisItem, null);
      }
    }
  }
  previousFormattedFoldersWithContent = formattedFoldersWithContent;
}

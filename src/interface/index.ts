import { isRunningStandalone } from '../tools/index';
import { documentQuerySelector } from '../tools/query-selector';
import { closeBus, openBus } from './bus/index';
import { closeFolderCreator, openFolderCreator } from './folder-creator/index';
import { closeFolderEditor, openFolderEditor } from './folder-editor/index';
import { closeFolderManager, openFolderManager } from './folder-manager/index';
import { closePersonalScheduleEditor, openPersonalScheduleEditor } from './personal-schedule-editor/index';
import { closePersonalScheduleManager, openPersonalScheduleManager } from './personal-schedule-manager/index';
import { closeRegisterNotification, openRegisterNotification } from './register-notification/index';
import { closeSearch, openSearch } from './search/index';
import { closeSettings, openSettings } from './settings/index';

const splashScreenTimer_minimalTimeOut = 100;
const splashScreenTimer_openTime = new Date().getTime();

type Page = 'Home' | 'FolderCreator' | 'FolderEditor' | 'FolderIconSelector' | 'FolderManager' | 'Location' | 'RouteDetails' | 'Route' | 'SaveToFolder' | 'Search' | 'Settings' | 'SettingsOptions' | 'DataUsage' | 'PersonalScheduleManager' | 'PersonalScheduleCreator' | 'PersonalScheduleEditor' | 'Bus' | 'RegisterNotification' | 'ScheduleNotification' | 'NotificationScheduleManager';

let pageHistory: Array<Page> = ['Home'];

export function pushPageHistory(page: Page): void {
  const pageHistoryLength = pageHistory.length;
  const lastPage = pageHistory[pageHistoryLength - 1];
  if (lastPage !== page) {
    pageHistory.push(page);
  }
}

export function revokePageHistory(page: Page): void {
  if (pageHistory.indexOf(page) > -1) {
    const pageHistoryLength = pageHistory.length;
    if (pageHistory[pageHistoryLength - 1] === page) {
      pageHistory.pop();
    }
  }
}

export function closePreviousPage(): void {
  const pageHistoryLength = pageHistory.length;
  if (pageHistoryLength > 1) {
    const previousPage = pageHistory[pageHistoryLength - 2];
    switch (previousPage) {
      case 'Home':
        break;
      case 'FolderCreator':
        closeFolderCreator();
        break;
      case 'FolderEditor':
        closeFolderEditor();
        break;
      case 'FolderIconSelector':
        break;
      case 'FolderManager':
        closeFolderManager();
        break;
      case 'Location':
        break;
      case 'Route':
        break;
      case 'RouteDetails':
        break;
      case 'SaveToFolder':
        break;
      case 'Search':
        closeSearch();
        break;
      case 'Settings':
        closeSettings();
        break;
      case 'SettingsOptions':
        break;
      case 'DataUsage':
        break;
      case 'PersonalScheduleManager':
        closePersonalScheduleManager();
        break;
      case 'PersonalScheduleCreator':
        break;
      case 'PersonalScheduleEditor':
        closePersonalScheduleEditor();
        break;
      case 'Bus':
        closeBus();
        break;
      case 'RegisterNotification':
        closeRegisterNotification();
        break;
      case 'ScheduleNotification':
        break;
      case 'NotificationScheduleManager':
        break;
      default:
        break;
    }
  }
}

export function openPreviousPage(): void {
  const pageHistoryLength = pageHistory.length;
  if (pageHistoryLength > 1) {
    const previousPage = pageHistory[pageHistoryLength - 2];
    pageHistory.pop();
    switch (previousPage) {
      case 'Home':
        break;
      case 'FolderCreator':
        openFolderCreator();
        break;
      case 'FolderEditor':
        openFolderEditor();
        break;
      case 'FolderIconSelector':
        break;
      case 'FolderManager':
        openFolderManager();
        break;
      case 'Location':
        break;
      case 'Route':
        break;
      case 'RouteDetails':
        break;
      case 'SaveToFolder':
        break;
      case 'Search':
        openSearch();
        break;
      case 'Settings':
        openSettings();
        break;
      case 'SettingsOptions':
        break;
      case 'DataUsage':
        break;
      case 'PersonalScheduleManager':
        openPersonalScheduleManager();
        break;
      case 'PersonalScheduleCreator':
        break;
      case 'PersonalScheduleEditor':
        openPersonalScheduleEditor();
        break;
      case 'Bus':
        openBus();
        break;
      case 'RegisterNotification':
        openRegisterNotification();
        break;
      case 'ScheduleNotification':
        break;
      case 'NotificationScheduleManager':
        break;
      default:
        break;
    }
  }
}

export function setSplashScreenIconOffsetY(): void {
  let offset = 0;
  if (isRunningStandalone()) {
    offset = (-1 * (window.outerHeight - window.innerHeight)) / 2;
  }
  documentQuerySelector('.css_splash_screen svg.css_splash_screen_icon').style.setProperty('--b-cssvar-splash-screen-icon-offset-y', `${offset}px`);
}

export function fadeOutSplashScreen(callback: Function): void {
  function fadeOut() {
    var element: HTMLElement = documentQuerySelector('.css_splash_screen');
    element.classList.add('css_splash_screen_fade_out');
    element.addEventListener(
      'animationend',
      function () {
        element.setAttribute('displayed', 'false');
        element.classList.remove('css_splash_screen_fade_out');
        if (typeof callback === 'function') {
          callback();
        }
      },
      { once: true }
    );
  }
  const cureentTime = new Date().getTime();
  if (cureentTime - splashScreenTimer_openTime < splashScreenTimer_minimalTimeOut) {
    setTimeout(fadeOut, Math.max(1, cureentTime - splashScreenTimer_openTime));
  } else {
    fadeOut();
  }
}

export interface GeneratedElement {
  element: HTMLElement;
  id: string;
}

export type GroupStyles = {
  [key: string]: {
    width: number;
    offset: number;
  };
};

export interface Size {
  width: number;
  height: number;
}

type SizeType = 'window' | 'head' | 'head-one-button' | 'head-two-button' | 'route-details-canvas' | 'route-bus-arrival-time-chart' | 'location-bus-arrival-time-chart';

export function querySize(type: SizeType): Size {
  let width: number = 0;
  let height: number = 0;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  switch (type) {
    case 'window':
      width = windowWidth;
      height = windowHeight;
      break;
    case 'head':
      width = windowWidth;
      height = 55;
      break;
    case 'head-one-button':
      width = windowWidth - 55;
      height = 55;
      break;
    case 'head-two-button':
      width = windowWidth - 55 * 2;
      height = 55;
      break;
    case 'route-details-canvas':
      width = windowWidth - 10 * 2 - 10 * 2;
      height = 24 * 60;
      break;
    case 'route-bus-arrival-time-chart':
      width = windowWidth - 45 - 15 - 20;
      height = 75;
      break;
    case 'location-bus-arrival-time-chart':
      width = windowWidth - 30 - 20;
      height = 75;
      break;
    default:
      width = 0;
      height = 0;
      break;
  }
  return {
    width,
    height
  };
}

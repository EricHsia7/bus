import { isRunningStandalone } from '../tools/index';
import { documentQuerySelector } from '../tools/query-selector';
import { closeBus, openBus } from './bus/index';
import { closeFolderCreator, openFolderCreator } from './folder-creator/index';
import { closeFolderEditor, openFolderEditor } from './folder-editor/index';
import { closeFolderManager, openFolderManager } from './folder-manager/index';
import { closePersonalScheduleEditor, openPersonalScheduleEditor } from './personal-schedule-editor/index';
import { closePersonalScheduleManager, openPersonalScheduleManager } from './personal-schedule-manager/index';
import { closeSearch, openSearch } from './search/index';
import { closeSettings, openSettings } from './settings/index';

const splashScreenTimer_minimalTimeOut = 100;
const splashScreenTimer_openTime = new Date().getTime();

export type Page = 'Home' | 'FolderCreator' | 'FolderEditor' | 'FolderIconSelector' | 'FolderManager' | 'Location' | 'RouteDetails' | 'Route' | 'SaveToFolder' | 'Search' | 'Settings' | 'SettingsOptions' | 'DataUsage' | 'PersonalScheduleManager' | 'PersonalScheduleCreator' | 'PersonalScheduleEditor' | 'Bus';

let pageHistory: Array<Page> = ['Home'];

export function pushPageHistory(page: Page): void {
  const pageHistoryLength = pageHistory.length;
  const lastPage = pageHistory[pageHistoryLength - 1];
  if (!(lastPage === page)) {
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
        element.style.display = 'none';
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
  id: string | null;
}

export interface FieldSize {
  width: number;
  height: number;
}

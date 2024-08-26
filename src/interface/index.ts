import { isRunningStandalone } from '../tools/index';
import { documentQuerySelector } from '../tools/query-selector';

var splashScreenTimer = {
  minimalTimeOut: 1024,
  openTime: new Date().getTime()
};

export function setSplashScreenIconOffsetY(): void {
  let offset = 0;
  if (isRunningStandalone()) {
    offset = (-1 * (window.screen.height - window.innerHeight)) / 2;
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
  if (cureentTime - splashScreenTimer.openTime < splashScreenTimer.minimalTimeOut) {
    setTimeout(fadeOut, Math.max(1, cureentTime - splashScreenTimer.openTime));
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

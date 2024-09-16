import { generateIdentifier, supportTouch } from '../../tools/index';

export function addRippleToElement(element: HTMLElement, color: string = 'var(--b-cssvar-333333)', duration: number = 450, callback?: Function): void {
  const eventlistener = supportTouch() ? 'touchstart' : 'mousedown';
  const addedRipple = element.getAttribute('added-ripple');
  if (!(addedRipple === 'added-ripple')) {
    element.addEventListener(eventlistener, (event) => {
      const rippleID = generateIdentifier();
      const scrollX = document.documentElement.scrollLeft;
      const scrollY = document.documentElement.scrollTop;
      const x = event.pageX;
      const y = event.pageY;
      const elementRect = element.getBoundingClientRect();
      const elementX = elementRect.x + scrollX;
      const elementY = elementRect.y + scrollY;
      const elementWidth = element.clientWidth;
      const elementHeight = element.clientHeight;
      const relativeX = x - elementX;
      const relativeY = y - elementY;
      const rippleSize = Math.max(elementWidth, elementHeight);
      const rippleBoundaryX = relativeX - 0.5 * rippleSize;
      const rippleBoundaryY = relativeY - 0.5 * rippleSize;
      const distanceToTop = relativeY - 0;
      const distanceToLeft = relativeX - 0;
      const distanceToRight = elementWidth - relativeX;
      const distanceToBottom = elementHeight - relativeY;
      const distanceToTopLeftCorner = Math.hypot(distanceToTop, distanceToLeft);
      const distanceToTopRightCorner = Math.hypot(distanceToTop, distanceToRight);
      const distanceToBottomLeftCorner = Math.hypot(distanceToBottom, distanceToLeft);
      const distanceToBottomRightCorner = Math.hypot(distanceToBottom, distanceToRight);
      const rippleScale = Math.max(2, Math.max(distanceToTopLeftCorner, distanceToTopRightCorner, distanceToBottomLeftCorner, distanceToBottomRightCorner) / (rippleSize / 2));

      let elementPosition = getComputedStyle(element).getPropertyValue('position');
      if (!(elementPosition === 'absolute') && !(elementPosition === 'fixed')) {
        elementPosition = 'relative';
      }

      const css = `.css_ripple_animation_${rippleID} {position:${elementPosition};overflow:hidden;width:${elementWidth}px;height:${elementHeight}px; outline:none; -webkit-tap-highlight-color:rgba(0,0,0,0); -webkit-mask-image: -webkit-radial-gradient(white, black);mask-image: -webkit-radial-gradient(white, black);}.css_ripple_animation_${rippleID} .css_ripple_${rippleID} {background:${color};width:${rippleSize}px; height:${rippleSize}px; border-radius:50%; position:absolute; top:${rippleBoundaryY}px; left:${rippleBoundaryX}px;transform:scale(0); opacity:0;animation-duration: ${duration}ms;animation-name: css_ripple_animation_opacity_${rippleID},css_ripple_animation_zoom_${rippleID};animation-iteration-count: forward;animation-timing-function:linear;}@keyframes css_ripple_animation_opacity_${rippleID} {0% {opacity:0.15;}60% {opacity:0.15;}100% { opacity:0;} } @keyframes css_ripple_animation_zoom_${rippleID} {0% {transform:scale(0.1)}65% {  transform:scale(${rippleScale})}100% {transform:scale(${rippleScale})}}`;

      element.classList.add(`css_ripple_animation_${rippleID}`);
      element.setAttribute('added-ripple', 'added-ripple');

      const styleElement = document.createElement('style');
      styleElement.innerHTML = css;
      styleElement.id = `css_ripple_style_${rippleID}`;
      element.appendChild(styleElement);

      const rippleElement = document.createElement('div');
      rippleElement.id = `css_ripple_${rippleID}`;
      rippleElement.classList.add(`css_ripple_${rippleID}`);
      element.appendChild(rippleElement);

      if (typeof callback === 'function') {
        document.getElementById(`css_ripple_${rippleID}`)?.addEventListener(
          'animationstart',
          function () {
            setTimeout(() => {
              callback!();

              const rippleElement = document.getElementById(`css_ripple_${rippleID}`);
              const styleElement = document.getElementById(`css_ripple_style_${rippleID}`);
              if (rippleElement) {
                element.classList.remove(`css_ripple_animation_${rippleID}`);
                rippleElement.remove();
              }
              if (styleElement) {
                styleElement.remove();
              }
            }, duration * 1);
          },
          { once: true }
        );
      } else {
        document.getElementById(`css_ripple_${rippleID}`)?.addEventListener(
          'animationend',
          function () {
            const rippleElement = document.getElementById(`css_ripple_${rippleID}`);
            const styleElement = document.getElementById(`css_ripple_style_${rippleID}`);
            if (rippleElement) {
              element.classList.remove(`css_ripple_animation_${rippleID}`);
              rippleElement.remove();
            }
            if (styleElement) {
              styleElement.remove();
            }
          },
          { once: true }
        );
        setTimeout(function () {
          const rippleElement = document.getElementById(`css_ripple_${rippleID}`);
          const styleElement = document.getElementById(`css_ripple_style_${rippleID}`);
          if (rippleElement) {
            element.classList.remove(`css_ripple_animation_${rippleID}`);
            rippleElement.remove();
          }
          if (styleElement) {
            styleElement.remove();
          }
        }, duration + 50);
      }
    });
  }
}

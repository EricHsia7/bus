import { generateIdentifier, supportTouch } from '../../tools/index';

export function addRippleToElement(element: HTMLElement, color: string, duration: number, callback?: Function): void {
  const eventlistener = supportTouch() ? 'touchstart' : 'mousedown';
  element.addEventListener(eventlistener, (event) => {
    const ripple_id = generateIdentifier()
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
    const distanceToTopLeftCorner = Math.sqrt(Math.pow(distanceToTop, 2) + Math.pow(distanceToLeft, 2));
    const distanceToTopRightCorner = Math.sqrt(Math.pow(distanceToTop, 2) + Math.pow(distanceToRight, 2));
    const distanceToBottomLeftCorner = Math.sqrt(Math.pow(distanceToBottom, 2) + Math.pow(distanceToLeft, 2));
    const distanceToBottomRightCorner = Math.sqrt(Math.pow(distanceToBottom, 2) + Math.pow(distanceToRight, 2));
    const rippleScale = Math.max(2, Math.max(distanceToTopLeftCorner, distanceToTopRightCorner, distanceToBottomLeftCorner, distanceToBottomRightCorner) / (rippleSize / 2));

    let element_position = getComputedStyle(element).getPropertyValue('position');
    if (!(element_position === 'absolute') && !(element_position === 'fixed')) {
      element_position = 'relative';
    }

    const css = `.ripple-animation-${ripple_id} {position:${element_position};overflow:hidden;width:${elementWidth}px;height:${elementHeight}px; outline:none; -webkit-tap-highlight-color:rgba(0,0,0,0); -webkit-mask-image: -webkit-radial-gradient(white, black);mask-image: -webkit-radial-gradient(white, black);}.ripple-animation-${ripple_id} .ripple-${ripple_id} {background:${color};width:${rippleSize}px; height:${rippleSize}px;border-radius:50%;position:absolute; top:${rippleBoundaryY}px; left:${rippleBoundaryX}px;transform:scale(0); opacity:0;animation-duration: ${duration}ms;animation-name: ripple-animation-opacity-${ripple_id},ripple-animation-zoom-${ripple_id};animation-iteration-count: forward;animation-timing-function:linear;}@keyframes ripple-animation-opacity-${ripple_id} {0% {opacity:0.15;}60% {opacity:0.15;}100% { opacity:0;} } @keyframes ripple-animation-zoom-${ripple_id} {0% {transform:scale(0.1)}65% {  transform:scale(${rippleScale})}100% {transform:scale(${rippleScale})}}`;

    element.classList.add(`ripple-animation-${ripple_id}`);

    const styleElement = document.createElement('style');
    styleElement.innerHTML = css;
    styleElement.id = `ripple-css-${ripple_id}`;
    element.appendChild(styleElement);

    const rippleElement = document.createElement('div');
    rippleElement.id = `ripple-${ripple_id}`;
    rippleElement.classList.add(`ripple-${ripple_id}`);
    element.appendChild(rippleElement);

    if (typeof callback === 'function') {
      document.getElementById(`ripple-${ripple_id}`)?.addEventListener(
        'animationstart',
        () => {
          setTimeout(() => {
            callback!();

            const rippleElement = document.getElementById(`ripple-${ripple_id}`);
            const cssStyleElement = document.getElementById(`ripple-css-${ripple_id}`);
            if (rippleElement) {
              element.classList.remove(`ripple-animation-${ripple_id}`);
              rippleElement.remove();
            }
            if (cssStyleElement) {
              cssStyleElement.remove();
            }
          }, duration * 1);
        },
        { once: true }
      );
    } else {
      document.getElementById(`ripple-${ripple_id}`)?.addEventListener(
        'animationend',
        () => {
          const rippleElement = document.getElementById(`ripple-${ripple_id}`);
          const cssStyleElement = document.getElementById(`ripple-css-${ripple_id}`);
          if (rippleElement) {
            element.classList.remove(`ripple-animation-${ripple_id}`);
            rippleElement.remove();
          }
          if (cssStyleElement) {
            cssStyleElement.remove();
          }
        },
        { once: true }
      );
      setTimeout(() => {
        const rippleElement = document.getElementById(`ripple-${ripple_id}`);
        const cssStyleElement = document.getElementById(`ripple-css-${ripple_id}`);
        if (rippleElement) {
          element.classList.remove(`ripple-animation-${ripple_id}`);
          rippleElement.remove();
        }
        if (cssStyleElement) {
          cssStyleElement.remove();
        }
      }, duration + 50);
    }
  });
}

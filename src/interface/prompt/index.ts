import { generateIdentifier } from '../../tools/index';
import { documentQuerySelectorAll } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';

export function promptMessage(message: string, icon: string, duration: number = 1200): void {
  message = String(message);
  const all_prompt = documentQuerySelectorAll('.css_prompt');
  if (!(all_prompt === null)) {
    var all_prompt_len = all_prompt.length;
    for (var e = 0; e < all_prompt_len; e++) {
      all_prompt[e].remove();
    }
  }
  const baseDuration: number = 250;
  const translateY: number = -20;
  const promptID: string = generateIdentifier();

  const promptElement = document.createElement('div');
  promptElement.id = promptID;
  promptElement.classList.add('css_prompt');
  promptElement.classList.add('css_prompt_animation_' + promptID);

  const promptIconElement = document.createElement('div');
  promptIconElement.classList.add('css_prompt_icon');
  promptIconElement.innerHTML = getIconHTML(icon);
  promptElement.appendChild(promptIconElement);

  const promptMessageElement = document.createElement('div');
  promptMessageElement.classList.add('css_prompt_message');
  promptMessageElement.innerText = message;
  promptElement.appendChild(promptMessageElement);
  
  const prompt_css = `.css_prompt_animation_${promptID} {animation-name: css_prompt_${promptID};animation-duration: ${duration + baseDuration * 2}ms;animation-fill-mode: forwards;animation-timing-function: ease-in-out;} @keyframes css_prompt_${promptID} { 0% {opacity: 0;transform: translateX(-50%) translateY(clamp(-45px, calc(${translateY}px - var(--b-cssvar-safe-area-bottom)), -20px)) scale(0.8);} ${Math.floor((baseDuration / (duration + baseDuration + 150)) * 100)}% {opacity: 1;transform: translateX(-50%) translateY(clamp(-45px,calc(${translateY}px - var(--b-cssvar-safe-area-bottom)),-20px)) scale(1);} ${Math.floor(((baseDuration + duration) / (duration + baseDuration + 150)) * 100)}% {opacity: 1;transform: translateX(-50%) translateY(clamp(-45px, calc(${translateY}px - var(--b-cssvar-safe-area-bottom)), -20px)) scale(1);} 100%{opacity: 0;transform: translateX(-50%) translateY(clamp(-45px, calc(${translateY}px - var(--b-cssvar-safe-area-bottom)), -20px)) scale(1);}} .css_prompt_animation_${promptID} .css_prompt_icon span.css_material_symbols_rounded {animation-name: css_prompt_icon_${promptID};animation-duration: ${baseDuration * 1.5}ms;animation-fill-mode: forwards;animation-timing-function: ease-in-out;} @keyframes css_prompt_icon_${promptID} { 0% {--b-cssvar-font-variation-settings-fill: 0;} 100% {--b-cssvar-font-variation-settings-fill: 1;}}`;
  var prompt_css_element = document.createElement('style');
  prompt_css_element.innerHTML = prompt_css;
  promptElement.appendChild(prompt_css_element);
  document.body.appendChild(promptElement);
  document.getElementById(promptID).addEventListener(
    'animationend',
    function () {
      if (!(document.getElementById(promptID) === null)) {
        document.getElementById(promptID).remove();
      }
    },
    { once: true }
  );
}

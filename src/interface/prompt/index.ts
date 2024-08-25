import { generateIdentifier } from '../../tools/index.ts';
import { documentQuerySelectorAll } from '../../tools/query-selector.ts';

export function prompt_message(message: string, duration: number = 1200): void {
  message = String(message);
  const all_prompt = documentQuerySelectorAll('.css_prompt');
  if (!(all_prompt === null)) {
    var all_prompt_len = all_prompt.length;
    for (var e = 0; e < all_prompt_len; e++) {
      all_prompt[e].remove();
    }
  }
  const duration_base: number = 250;
  const translateY: number = -20;
  const prompt_id: string = generateIdentifier();
  const prompt_element = document.createElement('div');
  prompt_element.id = prompt_id;
  prompt_element.classList.add('css_prompt');
  prompt_element.classList.add('css_prompt_animation_' + prompt_id);
  const prompt_center_element = document.createElement('div');
  prompt_center_element.classList.add('css_prompt_content');
  prompt_center_element.innerText = message;
  prompt_element.appendChild(prompt_center_element);
  const prompt_css = `.css_prompt_animation_${prompt_id} {animation-timing-function:cubic-bezier(.21,.75,.1,.96);animation-name: css_prompt_${prompt_id};animation-duration: ${duration + duration_base * 2}ms;animation-fill-mode: forwards;animation-timing-function: ease-in-out} @keyframes css_prompt_${prompt_id} { 0% {opacity: 0;transform: translateX(-50%) translateY(clamp(-45px, calc(${translateY}px - var(--b-cssvar-safe-area-bottom)), -20px)) scale(0.8);} ${Math.floor((duration_base / (duration + duration_base + 150)) * 100)}% {opacity: 1;transform: translateX(-50%) translateY(clamp(-45px,calc(${translateY}px - var(--b-cssvar-safe-area-bottom)),-20px)) scale(1);} ${Math.floor(((duration_base + duration) / (duration + duration_base + 150)) * 100)}% {opacity: 1;transform: translateX(-50%) translateY(clamp(-45px, calc(${translateY}px - var(--b-cssvar-safe-area-bottom)), -20px)) scale(1);} 100%{opacity: 0;transform: translateX(-50%) translateY(clamp(-45px, calc(${translateY}px - var(--b-cssvar-safe-area-bottom)), -20px)) scale(1);}}`;
  var prompt_css_element = document.createElement('style');
  prompt_css_element.innerHTML = prompt_css;
  prompt_element.appendChild(prompt_css_element);
  document.body.appendChild(prompt_element);
  document.getElementById(prompt_id).addEventListener(
    'animationend',
    function () {
      if (!(document.getElementById(prompt_id) === null)) {
        document.getElementById(prompt_id).remove();
      }
    },
    { once: true }
  );
}

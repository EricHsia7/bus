import { md5 } from '../../tools/index.ts';

export function prompt_message(message: string, duration: number): void {
  if (isNaN(duration)) {
    duration = 1200;
  }
  message = String(message);
  var all_prompt = document.querySelectorAll('.prompt');
  if (!(all_prompt === null)) {
    var all_prompt_len = all_prompt.length;
    for (var e = 0; e < all_prompt_len; e++) {
      all_prompt[e].remove();
    }
  }
  var duration_base: number = 180;
  var translateY: number = -25;
  var prompt_id: string = md5(new Date().getTime() + Math.random());
  var prompt_element = document.createElement('div');
  prompt_element.id = prompt_id;
  prompt_element.classList.add('prompt');
  prompt_element.classList.add('prompt_animation_' + prompt_id);
  var prompt_center_element = document.createElement('div');
  prompt_center_element.classList.add('prompt_content');
  prompt_center_element.innerText = message;
  prompt_element.appendChild(prompt_center_element);
  var prompt_css = `.prompt_animation_${prompt_id}{animation-timing-function:cubic-bezier(0.080, 0.635, 0.455, 0.985);animation-name:prompt${prompt_id};animation-duration:${duration + duration_base * 2}ms;animation-fill-mode:forwards;animation-timing-function:ease-in-out}@keyframes prompt${prompt_id}{0%{opacity:0;transform:translateX(-50%) translateY(${80}px) scale(1);}${Math.floor((duration_base / (duration + duration_base + 150)) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px - var(--safe-area-bottom))) scale(1);}${Math.floor(((duration_base + duration) / (duration + duration_base + 150)) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px - var(--safe-area-bottom))) scale(1);}100%{opacity:0;transform:translateX(-50%) translateY(calc(${translateY}px - var(--safe-area-bottom))) scale(1);}}`;
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

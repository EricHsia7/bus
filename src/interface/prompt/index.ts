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

  const promptID: string = generateIdentifier();

  const promptElement = document.createElement('div');
  promptElement.id = promptID;
  promptElement.classList.add('css_prompt');
  promptElement.classList.add('css_prompt_animation');

  const promptIconElement = document.createElement('div');
  promptIconElement.classList.add('css_prompt_icon');
  promptIconElement.innerHTML = getIconHTML(icon);
  promptElement.appendChild(promptIconElement);

  const promptMessageElement = document.createElement('div');
  promptMessageElement.classList.add('css_prompt_message');
  promptMessageElement.innerText = message;
  promptElement.appendChild(promptMessageElement);

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

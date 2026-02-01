import { getSettingOptionValue } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelectorAll } from '../../tools/elements';
import { booleanToString } from '../../tools/index';
import { getIconElement } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';

export interface PromptButton {
  text: string;
  action: Function;
}

export function promptMessage(icon: MaterialSymbols, message: string, button?: PromptButton | null): void {
  const allPromptElements = documentQuerySelectorAll('.css_prompt');
  if (allPromptElements !== null) {
    for (const promptElement of allPromptElements) {
      promptElement.remove();
    }
  }

  const playing_animation = getSettingOptionValue('playing_animation') as boolean;

  const promptElement = documentCreateDivElement();
  promptElement.classList.add('css_prompt');
  promptElement.setAttribute('animation', booleanToString(playing_animation));

  const promptIconElement = documentCreateDivElement();
  promptIconElement.classList.add('css_prompt_icon');
  promptIconElement.appendChild(getIconElement(icon));
  promptElement.appendChild(promptIconElement);

  const promptMessageElement = documentCreateDivElement();
  promptMessageElement.classList.add('css_prompt_message');
  promptMessageElement.innerText = message;
  promptElement.appendChild(promptMessageElement);

  if (typeof button === 'object' && button !== null && button !== undefined) {
    if (typeof button?.action === 'function') {
      const promptButtonElement = documentCreateDivElement();
      promptButtonElement.classList.add('css_prompt_button');
      promptButtonElement.innerText = button.text;
      promptButtonElement.addEventListener(
        'click',
        function () {
          button.action();
        },
        { once: true }
      );
      promptElement.appendChild(promptButtonElement);
      promptElement.setAttribute('button', 'true');
    }
  }

  promptElement.addEventListener(
    'animationend',
    function (event) {
      if (event?.target) {
        event.target.remove();
      }
    },
    { once: true }
  );

  document.body.appendChild(promptElement);
}

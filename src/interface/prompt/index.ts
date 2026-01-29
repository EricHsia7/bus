import { getSettingOptionValue } from '../../data/settings/index';
import { documentQuerySelectorAll } from '../../tools/elements';
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

  const promptElement = document.createElement('div');
  promptElement.classList.add('css_prompt');
  promptElement.setAttribute('animation', booleanToString(playing_animation));

  const promptIconElement = document.createElement('div');
  promptIconElement.classList.add('css_prompt_icon');
  promptIconElement.appendChild(getIconElement(icon));
  promptElement.appendChild(promptIconElement);

  const promptMessageElement = document.createElement('div');
  promptMessageElement.classList.add('css_prompt_message');
  promptMessageElement.innerText = message;
  promptElement.appendChild(promptMessageElement);

  if (typeof button === 'object' && button !== null && button !== undefined) {
    if (typeof button?.action === 'function') {
      const promptButtonElement = document.createElement('div');
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

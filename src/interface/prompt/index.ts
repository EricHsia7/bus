import { getSettingOptionValue } from '../../data/settings/index';
import { documentQuerySelectorAll } from '../../tools/elements';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { getIconElement } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';

export function promptMessage(icon: MaterialSymbols, message: string): void {
  const allPromptElements = documentQuerySelectorAll('.css_prompt');
  if (allPromptElements !== null) {
    for (const promptElement of allPromptElements) {
      promptElement.remove();
    }
  }

  const playing_animation = getSettingOptionValue('playing_animation') as boolean;

  const promptID: string = generateIdentifier();

  const promptElement = document.createElement('div');
  promptElement.id = promptID;
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

  document.body.appendChild(promptElement);

  const promptElementInstance = document.getElementById(promptID);
  if (promptElementInstance !== null) {
    promptElementInstance.addEventListener(
      'animationend',
      function () {
        promptElementInstance.remove();
      },
      { once: true }
    );
  }
}

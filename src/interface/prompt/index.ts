import { getSettingOptionValue } from '../../data/settings/index';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { documentQuerySelectorAll } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';

export function promptMessage(message: string, icon: MaterialSymbols): void {
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
  promptIconElement.innerHTML = getIconHTML(icon);
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

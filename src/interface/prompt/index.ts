import { getSettingOptionValue } from '../../data/settings/index';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { documentQuerySelectorAll } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';

export function promptMessage(message: string, icon: MaterialSymbols, actionLabel?: string, action?: Function): void {
  const allPromptElements = documentQuerySelectorAll('.css_prompt');
  if (!(allPromptElements === null)) {
    for (const promptElement of allPromptElements) {
      promptElement.remove();
    }
  }

  const playing_animation = getSettingOptionValue('playing_animation') as boolean;

  let showActionButton: boolean = false;
  if (typeof actionLabel === 'string') {
    if (actionLabel.length > 0) {
      if (typeof action === 'function') {
        showActionButton = true;
      }
    }
  }

  const promptID: string = generateIdentifier();

  const promptElement = document.createElement('div');
  promptElement.id = promptID;
  promptElement.classList.add('css_prompt');
  promptElement.setAttribute('animation', booleanToString(playing_animation));
  promptElement.setAttribute('action', showActionButton);

  const promptIconElement = document.createElement('div');
  promptIconElement.classList.add('css_prompt_icon');
  promptIconElement.innerHTML = getIconHTML(icon);
  promptElement.appendChild(promptIconElement);

  const promptMessageElement = document.createElement('div');
  promptMessageElement.classList.add('css_prompt_message');
  promptMessageElement.innerText = message;
  promptElement.appendChild(promptMessageElement);

  if (showActionButton) {
    const actionButtonElement = document.createElement('div');
    actionButtonElement.classList.add('css_prompt_action_button');
    actionButtonElement.innerText = actionLabel;
    actionButtonElement.addEventListener(
      'click',
      function () {
        action();
      },
      { once: true }
    );
    promptElement.appendChild(actionButtonElement);
  }

  document.body.appendChild(promptElement);

  const promptElementInstance = document.getElementById(promptID);
  if (!(promptElementInstance === null)) {
    promptElementInstance.addEventListener(
      'animationend',
      function () {
        promptElementInstance.remove();
      },
      { once: true }
    );
  }
}

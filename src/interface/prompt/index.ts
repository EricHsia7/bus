import { getSettingOptionValue } from '../../data/settings/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { booleanToString } from '../../tools/index';
import { setIcon } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';

const promptElement = documentQuerySelector('.css_prompt');
const promptIconElement = elementQuerySelector(promptElement, '.css_prompt_icon');
const promptMessageElement = elementQuerySelector(promptElement, '.css_prompt_message');
const promptButtonElement = elementQuerySelector(promptElement, '.css_prompt_button');

export interface PromptButton {
  text: string;
  action: Function;
}

export function promptMessage(icon: MaterialSymbols, message: string, button?: PromptButton | null): void {
  const promptElementAnimations = promptElement.getAnimations();
  const promptIconElementAnimations = promptIconElement.getAnimations();

  for (const animation of promptElementAnimations) {
    animation.cancel();
    animation.play();
  }

  for (const animation of promptIconElementAnimations) {
    animation.cancel();
    animation.play();
  }

  const playing_animation = getSettingOptionValue('playing_animation') as boolean;

  promptElement.setAttribute('animation', booleanToString(playing_animation));

  setIcon(promptIconElement, icon);

  promptMessageElement.innerText = message;

  if (typeof button === 'object' && button !== null && button !== undefined) {
    if (typeof button?.action === 'function') {
      promptButtonElement.innerText = button.text;
      promptButtonElement.onclick = function () {
        button.action();
      };
      promptElement.setAttribute('button', 'true');
    }
  }

  promptElement.addEventListener(
    'animationend',
    function () {
      promptElement.setAttribute('displayed', 'false');
      promptElement.classList.remove('css_show_prompt');
      promptButtonElement.onclick = null;
    },
    { once: true }
  );

  promptElement.setAttribute('displayed', 'true');
  promptElement.classList.add('css_show_prompt');
}

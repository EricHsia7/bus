import { getSettingOptionValue } from '../../data/settings/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { booleanToString } from '../../tools/index';
import { MaterialSymbol } from '../icons/material-symbols-type';

const promptElement = documentQuerySelector('.css_prompt');
const promptIconElement = elementQuerySelector(promptElement, '.css_prompt_icon');
const promptIconSpanElement = elementQuerySelector(promptIconElement, 'span.css_material_symbols_rounded');
const promptMessageElement = elementQuerySelector(promptElement, '.css_prompt_message');
const promptButtonElement = elementQuerySelector(promptElement, '.css_prompt_button');

export interface PromptButton {
  text: string;
  action: Function;
}

export function promptMessage(icon: MaterialSymbol, message: string, button?: PromptButton | null): void {
  const playing_animation = getSettingOptionValue('playing_animation') as boolean;

  const promptElementAnimations = promptElement.getAnimations();
  const promptIconSpanElementAnimations = promptIconSpanElement.getAnimations();

  for (const animation of promptElementAnimations) {
    animation.cancel();
    animation.play();
  }

  for (const animation of promptIconSpanElementAnimations) {
    animation.cancel();
    animation.play();
  }

  promptElement.setAttribute('animation', booleanToString(playing_animation));

  promptIconSpanElement.innerText = icon;
  promptMessageElement.innerText = message;

  if (typeof button === 'object' && button !== null && button !== undefined) {
    if (typeof button?.action === 'function') {
      promptButtonElement.innerText = button.text;
      promptButtonElement.onclick = function () {
        button.action();
      };
      promptElement.setAttribute('button', 'true');
    } else {
      promptElement.setAttribute('button', 'false');
    }
  } else {
    promptElement.setAttribute('button', 'false');
  }

  promptElement.addEventListener(
    'animationend',
    function () {
      promptElement.setAttribute('displayed', 'false');
      promptButtonElement.onclick = null;
    },
    { once: true }
  );

  promptElement.setAttribute('displayed', 'true');
}

import { getSettingOptionValue } from '../../data/settings/index';
import { booleanToString, generateIdentifier } from '../../tools/index';
import { documentQuerySelector, documentQuerySelectorAll } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { MaterialSymbols } from '../icons/material-symbols-type';

// The callback component should be before action button if removeCallback is set to true
interface PromptMessageComponentCallback {
  type: 'callback';
  callback: Function;
}

interface PromptMessageComponentActionButton {
  type: 'action-button';
  label: string;
  action: Function;
  removeCallback: boolean;
}

type PromptMessageComponent = PromptMessageComponentCallback | PromptMessageComponentActionButton;

type PromptMessageComponents = Array<PromptMessageComponent>;

export function promptMessage(icon: MaterialSymbols, message: string, components: PromptMessageComponents): void {
  const allPromptElements = documentQuerySelectorAll('.css_prompt');
  if (!(allPromptElements === null)) {
    for (const promptElement of allPromptElements) {
      promptElement.remove();
    }
  }

  const playing_animation = getSettingOptionValue('playing_animation') as boolean;

  // const promptID: string = generateIdentifier();

  const promptElement = document.createElement('div');
  // promptElement.id = promptID;
  promptElement.classList.add('css_prompt');
  promptElement.setAttribute('animation', booleanToString(playing_animation));
  promptElement.setAttribute('action', 'false');

  const promptIconElement = document.createElement('div');
  promptIconElement.classList.add('css_prompt_icon');
  promptIconElement.innerHTML = getIconHTML(icon);
  promptElement.appendChild(promptIconElement);

  const promptMessageElement = document.createElement('div');
  promptMessageElement.classList.add('css_prompt_message');
  promptMessageElement.innerText = message;
  promptElement.appendChild(promptMessageElement);

  let callbackFunction: Function | null = null;

  for (const component of components) {
    switch (component.type) {
      case 'action-button':
        if (typeof component.label === 'string') {
          if (component.label.length > 0) {
            if (typeof component.action === 'function') {
              promptElement.setAttribute('action', 'true');
              const actionButtonElement = document.createElement('div');
              actionButtonElement.classList.add('css_prompt_action_button');
              actionButtonElement.innerText = component.label;
              actionButtonElement.addEventListener(
                'click',
                function () {
                  component.action();
                  if (component.removeCallback && typeof callbackFunction === 'function') {
                    promptElement.removeEventListener('animationend', callbackFunction, { once: true });
                  }
                },
                { once: true }
              );
              promptElement.appendChild(actionButtonElement);
            }
          }
        }
        break;
      case 'callback':
        if (typeof component.callback === 'function') {
          callbackFunction = component.callback;
          promptElement.addEventListener('animationend', callbackFunction, { once: true });
        }
        break;
      default:
        break;
    }
  }

  promptElement.addEventListener(
    'animationend',
    function (event: Event) {
      const target = event.target as HTMLElement;
      target.remove();
    },
    { once: true }
  );

  document.body.appendChild(promptElement);
}

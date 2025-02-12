import { getSettingOptionValue } from '../../data/settings/index';
import { booleanToString } from '../../tools/index';
import { documentQuerySelectorAll } from '../../tools/query-selector';
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
  if (allPromptElements) {
    for (const element of allPromptElements) {
      element.remove();
    }
  }

  const playing_animation = getSettingOptionValue('playing_animation') as boolean;

  // const promptID: string = generateIdentifier();

  const newPromptElement = document.createElement('div');
  // promptElement.id = promptID;
  newPromptElement.classList.add('css_prompt');
  newPromptElement.setAttribute('animation', booleanToString(playing_animation));
  newPromptElement.setAttribute('action', 'false');

  const promptIconElement = document.createElement('div');
  promptIconElement.classList.add('css_prompt_icon');
  promptIconElement.innerHTML = getIconHTML(icon);
  newPromptElement.appendChild(promptIconElement);

  const promptMessageElement = document.createElement('div');
  promptMessageElement.classList.add('css_prompt_message');
  promptMessageElement.innerText = message;
  newPromptElement.appendChild(promptMessageElement);

  let callbackFunction: Function | null = null;

  for (const component of components) {
    switch (component.type) {
      case 'action-button':
        if (typeof component.label === 'string') {
          if (component.label.length > 0) {
            if (typeof component.action === 'function') {
              newPromptElement.setAttribute('action', 'true');
              const actionButtonElement = document.createElement('div');
              actionButtonElement.classList.add('css_prompt_action_button');
              actionButtonElement.innerText = component.label;
              actionButtonElement.addEventListener(
                'click',
                function () {
                  component.action();
                  if (component.removeCallback && typeof callbackFunction === 'function') {
                    newPromptElement.removeEventListener('animationend', callbackFunction, { once: true });
                  }
                },
                { once: true }
              );
              newPromptElement.appendChild(actionButtonElement);
            }
          }
        }
        break;
      case 'callback':
        if (typeof component.callback === 'function') {
          callbackFunction = component.callback;
          newPromptElement.addEventListener('animationend', callbackFunction, { once: true });
        }
        break;
      default:
        break;
    }
  }

  newPromptElement.addEventListener(
    'animationend',
    function (event: Event) {
      const target = event.target as HTMLElement;
      target.remove();
    },
    { once: true }
  );

  document.body.appendChild(newPromptElement);
}

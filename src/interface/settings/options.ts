import { changeSettingOption, getSetting, SettingSelect, SettingSelectOption } from '../../data/settings/index';
import { documentCreateDivElement, documentQuerySelector, documentQuerySelectorAll, elementQuerySelector } from '../../tools/elements';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { initializeSettingsField } from './index';

const Field = documentQuerySelector('.css_settings_options_field');
const BodyElement = elementQuerySelector(Field, '.css_settings_options_body');
const OptionsElement = elementQuerySelector(BodyElement, '.css_settings_options');
const DescriptionElement = elementQuerySelector(BodyElement, '.css_options_description');
const HeadElement = elementQuerySelector(Field, '.css_settings_options_head');
const TitleElement = elementQuerySelector(HeadElement, '.css_settings_options_title');
const LeftButtonElement = elementQuerySelector(HeadElement, '.css_settings_options_button_left');

const optionElements: Array<HTMLElement> = [];

function generateElementOfItem(): HTMLElement {
  const svgNamespace = 'http://www.w3.org/2000/svg';

  const optionElement = document.createElement('label');
  optionElement.classList.add('css_option');

  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_option_name');

  const checkboxContainerElement = documentCreateDivElement();
  checkboxContainerElement.classList.add('css_option_checkbox');

  const checkboxElement = document.createElement('input');
  checkboxElement.type = 'checkbox';
  checkboxContainerElement.appendChild(checkboxElement);

  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', '0 0 55 55');

  const path = document.createElementNS(svgNamespace, 'path');
  path.setAttribute('d', 'M20,27.5 L25,32.5 L35,22.5');
  svg.appendChild(path);
  checkboxContainerElement.appendChild(svg);

  optionElement.appendChild(nameElement);
  optionElement.appendChild(checkboxContainerElement);

  return optionElement;
}

function initializeSettingsOptionsField(settingKey: string): void {
  const setting = getSetting(settingKey) as SettingSelect;
  updateSettingsOptionsField(setting);
}

function updateSettingsOptionsField(setting: SettingSelect): void {
  function updateItem(thisElement: HTMLElement, thisItem: SettingSelectOption, index: number): void {
    function updateName(thisElement: HTMLElement, thisItem: SettingSelectOption): void {
      const nameElement = elementQuerySelector(thisElement, '.css_option_name');
      nameElement.textContent = thisItem.name;
    }

    function updateCheckbox(thisElement: HTMLElement, setting: SettingSelect, index: number): void {
      const checkboxContainerElement = elementQuerySelector(thisElement, '.css_option_checkbox');
      const checkboxElement = elementQuerySelector(checkboxContainerElement, 'input') as HTMLInputElement;
      checkboxElement.checked = setting.option === index;
      checkboxElement.onclick = (event) => {
        settingsOptionsHandler(event, setting.key, index);
      };
    }

    updateName(thisElement, thisItem);
    updateCheckbox(thisElement, setting, index);
  }

  LeftButtonElement.onclick = function () {
    closeSettingsOptions();
    // callback
    initializeSettingsField();
  };
  TitleElement.textContent = setting.name;
  DescriptionElement.textContent = setting.description;

  const options = setting.options;
  const optionsLength = options.length;

  const optionElementsLength = optionElements.length;
  if (optionsLength !== optionElementsLength) {
    const difference = optionElementsLength - optionsLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newOptionElement = generateElementOfItem();
        fragment.appendChild(newOptionElement);
        optionElements.push(newOptionElement);
      }
      OptionsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = optionElementsLength - 1, q = optionElementsLength - difference - 1; p > q; p--) {
        optionElements[p].remove();
        optionElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < optionsLength; i++) {
    const thisElement = optionElements[i];
    const thisItem = options[i];
    updateItem(thisElement, thisItem, i);
  }
}

export function showSettingsOptions(): void {
  Field.setAttribute('displayed', 'true');
}

export function hideSettingsOptions(): void {
  Field.setAttribute('displayed', 'false');
}

export function openSettingsOptions(settingKey: string): void {
  pushPageHistory('SettingsOptions');
  showSettingsOptions();
  initializeSettingsOptionsField(settingKey);
  hidePreviousPage();
}

export function closeSettingsOptions(): void {
  hideSettingsOptions();
  showPreviousPage();
  revokePageHistory('SettingsOptions');
}

export function settingsOptionsHandler(event: Event, settingKey: string, index: number): void {
  const checkboxes = documentQuerySelectorAll('.css_settings_options_field .css_settings_options_body .css_settings_options .css_option .css_option_checkbox input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
  for (const checkbox of checkboxes) {
    checkbox.checked = false;
  }
  const target = event.target as HTMLInputElement;
  target.checked = true;
  changeSettingOption(settingKey, index);
}

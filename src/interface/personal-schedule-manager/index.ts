import { listPersonalSchedules, PersonalSchedule } from '../../data/personal-schedule/index';
import { generateIdentifier } from '../../tools/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';

const PersonalScheduleManagerField = documentQuerySelector('.css_personal_schedule_manager_field');
const PersonalScheduleManagerBodyElement = elementQuerySelector(PersonalScheduleManagerField, '.css_personal_schedule_manager_body');
const ListElement = elementQuerySelector(PersonalScheduleManagerBodyElement, '.css_personal_schedule_manager_list');

function generateElementOfItem(item: PersonalSchedule): GeneratedElement {
  const identifier = generateIdentifier();
  const element = document.createElement('div');
  element.classList.add('css_personal_schedule_manager_item');
  element.id = identifier;
  element.setAttribute('onclick', `bus.personalSchedule.openPersonalScheduleEditor('${item.id}')`);
  element.innerHTML = /*html*/ `<div class="css_personal_schedule_manager_item_name">${item.name}</div><div class="css_personal_schedule_manager_item_arrow">${getIconHTML('arrow_forward_ios')}</div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializePersonalScheduleManagerField() {
  ListElement.innerHTML = '';
  const personalSchedules = await listPersonalSchedules();
  for (const item of personalSchedules) {
    const thisElement = generateElementOfItem(item);
    ListElement.appendChild(thisElement.element);
  }
}

export function openPersonalScheduleManager(): void {
  pushPageHistory('PersonalScheduleManager');
  PersonalScheduleManagerField.setAttribute('displayed', 'true');
  initializePersonalScheduleManagerField();
}

export function closePersonalScheduleManager(): void {
  revokePageHistory('PersonalScheduleManager');
  PersonalScheduleManagerField.setAttribute('displayed', 'false');
}

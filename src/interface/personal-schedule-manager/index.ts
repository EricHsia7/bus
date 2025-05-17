import { listPersonalSchedules, PersonalSchedule } from '../../data/personal-schedule/index';
import { documentQuerySelector, elementQuerySelector } from '../../tools/query-selector';
import { getIconHTML } from '../icons/index';
import { GeneratedElement, pushPageHistory, revokePageHistory } from '../index';
import { openPersonalScheduleEditor } from '../personal-schedule-editor/index';

const PersonalScheduleManagerField = documentQuerySelector('.css_personal_schedule_manager_field');
const PersonalScheduleManagerBodyElement = elementQuerySelector(PersonalScheduleManagerField, '.css_personal_schedule_manager_body');
const ListElement = elementQuerySelector(PersonalScheduleManagerBodyElement, '.css_personal_schedule_manager_list');

function generateElementOfItem(item: PersonalSchedule): GeneratedElement {
  // const identifier = generateIdentifier();

  // Main item element
  const itemElement = document.createElement('div');
  itemElement.classList.add('css_personal_schedule_manager_item');
  // itemElement.id = identifier;
  itemElement.onclick = function () {
    openPersonalScheduleEditor(item.id);
  };

  // Name element
  const nameElement = document.createElement('div');
  nameElement.classList.add('css_personal_schedule_manager_item_name');
  nameElement.appendChild(document.createTextNode(item.name));
  itemElement.appendChild(nameElement);

  // Arrow element
  const arrowElement = document.createElement('div');
  arrowElement.classList.add('css_personal_schedule_manager_item_arrow');
  const iconElement = document.createElement('span');
  iconElement.innerHTML = getIconHTML('arrow_forward_ios');
  arrowElement.appendChild(iconElement);
  itemElement.appendChild(arrowElement);

  return {
    element: itemElement,
    id: ''
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

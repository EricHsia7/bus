import { listPersonalSchedules, PersonalSchedule, removePersonalSchedule } from '../../data/personal-schedule/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { openPersonalScheduleEditor } from '../personal-schedule-editor/index';
import { promptMessage } from '../prompt';

const PersonalScheduleManagerField = documentQuerySelector('.css_personal_schedule_manager_field');
const PersonalScheduleManagerBodyElement = elementQuerySelector(PersonalScheduleManagerField, '.css_personal_schedule_manager_body');
const ListElement = elementQuerySelector(PersonalScheduleManagerBodyElement, '.css_personal_schedule_manager_list');

function generateElementOfItem(item: PersonalSchedule): HTMLElement {
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_personal_schedule_manager_item');

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_personal_schedule_manager_item_head');
  headElement.onclick = function () {
    openPersonalScheduleEditor(item.id);
  };

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_personal_schedule_manager_item_name');
  nameElement.innerText = item.name;

  // Arrow
  const arrowElement = documentCreateDivElement();
  arrowElement.classList.add('css_personal_schedule_manager_item_arrow');
  arrowElement.appendChild(getIconElement('arrow_forward_ios'));

  // Drawer
  const drawerElement = documentCreateDivElement();
  drawerElement.classList.add('css_personal_schedule_manager_item_drawer');

  // Delete button
  const deleteElement = documentCreateDivElement();
  deleteElement.classList.add('css_personal_schedule_manager_item_drawer_button');
  deleteElement.appendChild(getIconElement('delete'));
  deleteElement.onclick = () => {
    removeItemOnPersonalScheduleManager(itemElement, item.id);
  };

  // Assemble
  headElement.appendChild(nameElement);
  headElement.appendChild(arrowElement);
  itemElement.appendChild(headElement);
  drawerElement.appendChild(deleteElement);
  itemElement.appendChild(drawerElement);

  return itemElement;
}

export async function initializePersonalScheduleManagerField() {
  ListElement.innerHTML = '';
  const personalSchedules = await listPersonalSchedules();
  const fragment = new DocumentFragment();
  for (const item of personalSchedules) {
    const thisElement = generateElementOfItem(item);
    fragment.appendChild(thisElement);
  }
  ListElement.append(fragment);
}

export function showPersonalScheduleManager(): void {
  PersonalScheduleManagerField.setAttribute('displayed', 'true');
}

export function hidePersonalScheduleManager(): void {
  PersonalScheduleManagerField.setAttribute('displayed', 'false');
}

export function openPersonalScheduleManager(): void {
  pushPageHistory('PersonalScheduleManager');
  PersonalScheduleManagerField.setAttribute('displayed', 'true');
  initializePersonalScheduleManagerField();
  hidePreviousPage();
}

export function closePersonalScheduleManager(): void {
  PersonalScheduleManagerField.setAttribute('displayed', 'false');
  showPreviousPage();
  revokePageHistory('PersonalScheduleManager');
}

export async function removeItemOnPersonalScheduleManager(itemElement: HTMLElement, personalScheduleID: PersonalSchedule['id']) {
  const removal = await removePersonalSchedule(personalScheduleID);
  if (removal) {
    itemElement.remove();
    promptMessage('delete', '已移除行程');
  } else {
    promptMessage('error', '無法移除');
  }
}

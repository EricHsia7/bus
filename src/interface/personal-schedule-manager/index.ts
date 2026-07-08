import { listPersonalSchedules, PersonalSchedule, PersonalScheduleArray, removePersonalSchedule } from '../../data/personal-schedule/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { openPersonalScheduleEditor } from '../personal-schedule-editor/index';
import { promptMessage } from '../prompt';

const Field = documentQuerySelector('.css_personal_schedule_manager_field');
const BodyElement = elementQuerySelector(Field, '.css_personal_schedule_manager_body');
const ListElement = elementQuerySelector(BodyElement, '.css_personal_schedule_manager_list');

const itemElements: Array<HTMLElement> = []; // div.css_personal_schedule_manager_item in div.css_personal_schedule_manager_list

let previousPersonalSchedules: PersonalScheduleArray = [];

function generateElementOfItem(): HTMLElement {
  const element = documentCreateDivElement();
  element.classList.add('css_personal_schedule_manager_item');

  // Head
  const headElement = documentCreateDivElement();
  headElement.classList.add('css_personal_schedule_manager_item_head');

  // Name
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_personal_schedule_manager_item_name');

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

  // Assemble
  headElement.appendChild(nameElement);
  headElement.appendChild(arrowElement);
  element.appendChild(headElement);
  drawerElement.appendChild(deleteElement);
  element.appendChild(drawerElement);

  return element;
}

export function initializePersonalScheduleManagerField(): void {
  const personalSchedules = listPersonalSchedules();
  updatePersonalScheduleManagerField(personalSchedules);
}

function updatePersonalScheduleManagerField(personalSchedules: PersonalScheduleArray): void {
  function updateItem(thisElement: HTMLElement, thisItem: PersonalSchedule, previousItem: PersonalSchedule | null): void {
    function updateName(thisElement: HTMLElement, thisItem: PersonalSchedule): void {
      const headElement = elementQuerySelector(thisElement, '.css_personal_schedule_manager_item_head');
      const nameElement = elementQuerySelector(headElement, '.css_personal_schedule_manager_item_name');
      nameElement.textContent = thisItem.name;
    }

    function updateDrawer(thisElement: HTMLElement, thisItem: PersonalSchedule): void {
      const drawerElement = elementQuerySelector(thisElement, '.css_personal_schedule_manager_item_drawer');
      const deleteElement = elementQuerySelector(drawerElement, '.css_personal_schedule_manager_item_drawer_button');
      deleteElement.onclick = function () {
        removeItemOnPersonalScheduleManager(thisElement, thisItem.id);
      };
    }

    function updateOnclick(thisElement: HTMLElement, thisItem: PersonalSchedule): void {
      const headElement = elementQuerySelector(thisElement, '.css_personal_schedule_manager_item_head');
      headElement.onclick = function () {
        openPersonalScheduleEditor(thisItem.id);
      };
    }

    if (previousItem !== null) {
      if (previousItem.name !== thisItem.name) {
        updateName(thisElement, thisItem);
      }

      if (previousItem.id !== thisItem.id) {
        updateDrawer(thisElement, thisItem);
        updateOnclick(thisElement, thisItem);
      }
    } else {
      updateName(thisElement, thisItem);
      updateDrawer(thisElement, thisItem);
      updateOnclick(thisElement, thisItem);
    }
  }

  const personalSchedulesLength = personalSchedules.length;

  const itemElementsLength = itemElements.length;
  if (personalSchedulesLength !== itemElementsLength) {
    const difference = itemElementsLength - personalSchedulesLength;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newFolderItemElement = generateElementOfItem();
        fragment.appendChild(newFolderItemElement);
        itemElements.push(newFolderItemElement);
      }
      ListElement.append(fragment);
    } else if (difference > 0) {
      for (let p = itemElementsLength - 1, q = itemElementsLength - difference - 1; p > q; p--) {
        itemElements[p].remove();
        itemElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < personalSchedulesLength; i++) {
    const thisElement = itemElements[i];
    const thisItem = personalSchedules[i];
    const previousItem = previousPersonalSchedules[i];
    if (previousItem) {
      updateItem(thisElement, thisItem, previousItem);
    } else {
      updateItem(thisElement, thisItem, null);
    }
  }

  previousPersonalSchedules = personalSchedules;
}

export function showPersonalScheduleManager(): void {
  Field.setAttribute('displayed', 'true');
}

export function hidePersonalScheduleManager(): void {
  Field.setAttribute('displayed', 'false');
}

export function openPersonalScheduleManager(): void {
  pushPageHistory('PersonalScheduleManager');
  Field.setAttribute('displayed', 'true');
  initializePersonalScheduleManagerField();
  hidePreviousPage();
}

export function closePersonalScheduleManager(): void {
  Field.setAttribute('displayed', 'false');
  showPreviousPage();
  revokePageHistory('PersonalScheduleManager');
}

export async function removeItemOnPersonalScheduleManager(itemElement: HTMLElement, personalScheduleID: PersonalSchedule['id']) {
  const removal = await removePersonalSchedule(personalScheduleID);
  if (removal) {
    itemElement.remove();
    const index = itemElements.indexOf(itemElement);
    itemElements.splice(index, 1);
    promptMessage('delete', '已移除行程');
  } else {
    promptMessage('error', '無法移除');
  }
}

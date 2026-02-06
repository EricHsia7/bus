import { listPersonalSchedules, PersonalSchedule } from '../../data/personal-schedule/index';
import { documentCreateDivElement, documentQuerySelector, elementQuerySelector } from '../../tools/elements';
import { getIconElement } from '../icons/index';
import { hidePreviousPage, PageTransitionDirection, pushPageHistory, revokePageHistory, showPreviousPage } from '../index';
import { openPersonalScheduleEditor } from '../personal-schedule-editor/index';

const PersonalScheduleManagerField = documentQuerySelector('.css_personal_schedule_manager_field');
const PersonalScheduleManagerBodyElement = elementQuerySelector(PersonalScheduleManagerField, '.css_personal_schedule_manager_body');
const ListElement = elementQuerySelector(PersonalScheduleManagerBodyElement, '.css_personal_schedule_manager_list');

function generateElementOfItem(item: PersonalSchedule): HTMLElement {
  // Main item element
  const itemElement = documentCreateDivElement();
  itemElement.classList.add('css_personal_schedule_manager_item');
  itemElement.onclick = function () {
    openPersonalScheduleEditor(item.id);
  };

  // Name element
  const nameElement = documentCreateDivElement();
  nameElement.classList.add('css_personal_schedule_manager_item_name');
  nameElement.innerText = item.name;
  itemElement.appendChild(nameElement);

  // Arrow element
  const arrowElement = documentCreateDivElement();
  arrowElement.classList.add('css_personal_schedule_manager_item_arrow');
  const iconElement = document.createElement('span');
  iconElement.appendChild(getIconElement('arrow_forward_ios'));
  arrowElement.appendChild(iconElement);
  itemElement.appendChild(arrowElement);

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

export function showPersonalScheduleManager(pageTransitionDirection: PageTransitionDirection): void {
  const className = pageTransitionDirection === 'ltr' ? 'css_page_transition_slide_in_ltr' : 'css_page_transition_slide_in_rtl';
  PersonalScheduleManagerField.addEventListener(
    'animationend',
    function () {
      PersonalScheduleManagerField.classList.remove(className);
    },
    { once: true }
  );
  PersonalScheduleManagerField.classList.add(className);
  PersonalScheduleManagerField.setAttribute('displayed', 'true');
}

export function hidePersonalScheduleManager(pageTransitionDirection: PageTransitionDirection): void {
  const className = pageTransitionDirection === 'ltr' ? 'css_page_transition_slide_out_ltr' : 'css_page_transition_slide_out_rtl';
  PersonalScheduleManagerField.addEventListener(
    'animationend',
    function () {
      PersonalScheduleManagerField.setAttribute('displayed', 'false');
      PersonalScheduleManagerField.classList.remove(className);
    },
    { once: true }
  );
  PersonalScheduleManagerField.classList.add(className);
}

export function openPersonalScheduleManager(): void {
  pushPageHistory('PersonalScheduleManager');
  showPersonalScheduleManager('rtl');
  initializePersonalScheduleManagerField();
  hidePreviousPage();
}

export function closePersonalScheduleManager(): void {
  hidePersonalScheduleManager('ltr');
  showPreviousPage();
  revokePageHistory('PersonalScheduleManager');
}

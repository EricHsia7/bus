import { md5 } from '../../tools/index.ts';
import { listSettings } from '../../data/settings/index.ts';

function generateElementOfItem(item: object): object {
  var identifier = `i_${md5(Math.random() + new Date().getTime())}`;
  var element = document.createElement('div');
  element.classList.add('setting');
  element.id = identifier;
  element.innerHTML = `<div class="head"><div class="status"><div class="next_slide" code="${skeletonScreen ? -1 : item.status.code}">${skeletonScreen ? '' : item.status.text}</div><div class="current_slide" code="${skeletonScreen ? -1 : item.status.code}">${skeletonScreen ? '' : item.status.text}</div></div><div class="name">${skeletonScreen ? '' : item.name}</div><div class="stretch" onclick="bus.route.stretchItemBody('${identifier}')">${icons.expand}</div></div><div class="body"><div class="tabs"><div class="tab" selected="true" onclick="bus.route.switchRouteBodyTab('${identifier}', 0)" code="0">經過此站的公車</div><div class="tab" selected="false" onclick="bus.route.switchRouteBodyTab('${identifier}', 1)" code="1">經過此站的路線</div><div class="action_button" highlighted="false" type="save-stop" onclick="bus.route.saveItemAsStop('${identifier}', null, null, null)"><div class="action_button_icon">${icons['favorite']}</div>收藏此站牌</div></div><div class="buses" displayed="true"></div><div class="overlapping_routes" displayed="false"></div></div>`;
  return {
    element: element,
    id: identifier
  };
}

async function initializeSettingsField(Field: HTMLElement) {
  var list = await listSettings();
  for (var item of list) {
    var thisElement = generateElementOfItem(item);
  }
}

function openSettings() {}

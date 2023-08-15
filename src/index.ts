var getUrlString = location.href;
var url = new URL(getUrlString);
function urlparams(p) {
  return url.searchParams.get(p);
}

function customurlprams(str, p) {
  var url = new URL(str);
  return url.searchParams.get(p);
}

const LS = window.localStorage;
const SS = window.sessionStorage;
let options_list = ['options_reveal_estimate_time_exact_seconds', 'options_automatic_refresh', 'options_display_user_current_position'];
var options = {
  options_reveal_estimate_time_exact_seconds: false,
  options_automatic_refresh: true,
  options_display_user_current_position: false
};
var options_pulled = 0;
let cities = ['blobbus', 'ntpcbus'];
var city = 0;
var routes_data_city = 0;
var stops_data_city = 0;

let realtime_api = function () {
  return 'https://tcgbusfs.blob.core.windows.net/' + cities[city] + '/GetEstimateTime.gz';
};
let stops_api = function () {
  return 'https://tcgbusfs.blob.core.windows.net/' + cities[stops_data_city] + '/GetStop.gz';
};
let routes_api = function (c) {
  return 'https://tcgbusfs.blob.core.windows.net/' + cities[c] + '/GetRoute.gz';
};
let busevent_api = function () {
  return 'https://tcgbusfs.blob.core.windows.net/' + cities[city] + '/GetBusEvent.gz';
};
let provider_api = function () {
  return 'https://tcgbusfs.blob.core.windows.net/' + cities[city] + '/GetProvider.gz';
};
let timetable_api = function () {
  return 'https://tcgbusfs.blob.core.windows.net/' + cities[city] + '/GetTimeTable.gz';
};

let routes_keyboard_keys = [
  ['紅', '藍', '1', '2', '3'],
  ['綠', '棕', '4', '5', '6'],
  ['橘', '小', '7', '8', '9'],
  ['更多', '幹線', '清空', '0', '刪除']
];
let icon_bus = '<svg stroke-miterlimit="10" style="fill-rule:nonzero;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;" version="1.1" viewBox="0 0 64 64" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M12.5474 64C11.8175 64 11.1719 63.7895 10.6105 63.3684C10.0491 62.9474 9.76842 62.4 9.76842 61.7263L9.76842 54.6526C8.14035 53.7544 6.94737 52.4632 6.18947 50.7789C5.43158 49.0947 5.05263 47.2982 5.05263 45.3895L5.05263 11.9579C5.05263 7.80351 7.2 4.77193 11.4947 2.86316C15.7895 0.954386 22.6526 0 32.0842 0C41.4035 0 48.2105 0.954386 52.5053 2.86316C56.8 4.77193 58.9474 7.80351 58.9474 11.9579L58.9474 45.3895C58.9474 47.2982 58.5684 49.0947 57.8105 50.7789C57.0526 52.4632 55.8596 53.7544 54.2316 54.6526L54.2316 61.7263C54.2316 62.4 53.9509 62.9474 53.3895 63.3684C52.8281 63.7895 52.1825 64 51.4526 64L49.8526 64C49.0667 64 48.393 63.7895 47.8316 63.3684C47.2702 62.9474 46.9895 62.4 46.9895 61.7263L46.9895 57.0947L17.0105 57.0947L17.0105 61.7263C17.0105 62.4 16.7298 62.9474 16.1684 63.3684C15.607 63.7895 14.9333 64 14.1474 64L12.5474 64ZM10.1053 29.3895L53.8947 29.3895L53.8947 14.8211L10.1053 14.8211L10.1053 29.3895ZM19.0316 47.8316C20.3228 47.8316 21.4175 47.3825 22.3158 46.4842C23.214 45.586 23.6632 44.4912 23.6632 43.2C23.6632 41.9088 23.214 40.814 22.3158 39.9158C21.4175 39.0175 20.3228 38.5684 19.0316 38.5684C17.7404 38.5684 16.6456 39.0175 15.7474 39.9158C14.8491 40.814 14.4 41.9088 14.4 43.2C14.4 44.4912 14.8491 45.586 15.7474 46.4842C16.6456 47.3825 17.7404 47.8316 19.0316 47.8316ZM44.9684 47.8316C46.2596 47.8316 47.3544 47.3825 48.2526 46.4842C49.1509 45.586 49.6 44.4912 49.6 43.2C49.6 41.9088 49.1509 40.814 48.2526 39.9158C47.3544 39.0175 46.2596 38.5684 44.9684 38.5684C43.6772 38.5684 42.5825 39.0175 41.6842 39.9158C40.786 40.814 40.3368 41.9088 40.3368 43.2C40.3368 44.4912 40.786 45.586 41.6842 46.4842C42.5825 47.3825 43.6772 47.8316 44.9684 47.8316Z" fill="var(--g-333333)" fill-rule="nonzero" opacity="1" stroke="none"/></svg>';
var realtime_json = {};
var busevent_json = { loaded: false, c: {} };
var stops_json = { loaded: false, c: {} };
var routes_json = { loaded: false, c: {} };
var search_index = { loaded: false, c: {} };
var route_container_content = { h_0: {}, h_1: {} };
var personal_blocks_initialized = 0;
var current_route_stops = [];
var c_routeid = 0;
var c_routeid_p = 0;
var o_routeid;
var c_route_local_key = '';
var c_route_name = '';
var realtime_lo = 0;
var realtime_last_update = new Date().getTime();
var refresh_progress_l = 0;
var businfo_scroll = 0;
var routeinfo_scroll = 0;
var businfo_scroll_1 = 0;
var routeinfo_scroll_1 = 0;
var businfo_close = 0;
var routeinfo_close = 0;
var routeinfo_loaded = 0;
var refreshProgresPause = 0;
var search_page_is_open = 0;
var route_page_is_open = 0;
var route_dep_auto_scroll = 0;
var route_des_auto_scroll = 0;
var skeletonScreenStatus = 0;
var watch_position;
var watch_position_permission_requested = 0;
var route_container_scrolled = 0;
var route_container_scroll_stop = 0;
var pos_lat = 0;
var pos_lon = 0;
var route_direction = 'departure';
var route_container = document.querySelector('.route_container');
var route_container_s = document.querySelectorAll('.routes')[0];
var route_x1 = 0;
var route_y1 = 0;
var route_x2 = 0;
var route_y2 = 0;
var route_min_X = 0;
var route_min_Y = 0;
var route_max_X = 0;
var route_max_Y = 0;
var animation_speed = 0;
var offsetX = 0;
var start_offsetX = 0;
var de = document.documentElement;
var horizontal_slide = false;
var vertical_slide = false;
var route_page_is_sliding = false;
var route_tab_dep_width = 0;
var route_tab_des_width = 0;
var route_tab_color_333333_r = 0;
var route_tab_color_333333_g = 0;
var route_tab_color_333333_b = 0;
var route_tab_color_888888_r = 0;
var route_tab_color_888888_g = 0;
var route_tab_color_888888_b = 0;
let routesDataShortName = [
  { source: 'providerId', short: false },
  { source: 'providerName', short: false },
  { source: 'nameZh', short: 'n' },
  { source: 'nameEn', short: false },
  { source: 'aliasName', short: false },
  { source: 'pathAttributeId', short: 'pid' },
  { source: 'pathAttributeNId', short: false },
  { source: 'pathAttributeName', short: false },
  { source: 'pathAttributeEname', short: false },
  { source: 'buildPeriod', short: false },
  { source: 'departureZh', short: 'dep' },
  { source: 'destinationZh', short: 'des' },
  { source: 'departureEn', short: false },
  { source: 'destinationEn', short: false },
  { source: 'goFirstBusTime', short: false },
  { source: 'goLastBusTime', short: false },
  { source: 'backFirstBusTime', short: false },
  { source: 'backLastBusTime', short: false },
  { source: 'offPeakHeadway', short: false },
  { source: 'roadMapUrl', short: false },
  { source: 'headwayDesc', short: false },
  { source: 'holidayGoFirstBusTime', short: false },
  { source: 'holidayBackFirstBusTime', short: false },
  { source: 'holidayBackLastBusTime', short: false },
  { source: 'holidayGoLastBusTime', short: false },
  { source: 'holidayBusTimeDesc', short: false },
  { source: 'realSequence', short: false },
  { source: 'holidayHeadwayDesc', short: false },
  { source: 'holidayOffPeakHeadway', short: false },
  { source: 'holidayPeakHeadway', short: false },
  { source: 'segmentBufferEn', short: false },
  { source: 'ticketPriceDescriptionZh', short: false },
  { source: 'ticketPriceDescriptionEn', short: false },
  { source: 'peakHeadway', short: false },
  { source: 'ttiaPathId', short: false },
  { source: 'segmentBufferZh', short: 's' },
  { source: 'busTimeDesc', short: false },
  { source: 'distance', short: false },
  { source: 'NId', short: false },
  { source: 'genus', short: false },
  { source: 'Id', short: false }
];
var stats_chart;
let rdsn_len = routesDataShortName.length;
var update_interval = 10000;
var update_status = 0;

function ripple(Allelement, color, duration) {
  if (Allelement.length === undefined) {
    Allelement = [Allelement];
  }
  for (var k = 0; k < Allelement.length; k++) {
    rp(Allelement[k], color, duration);
  }
}
function rp(element, color, duration) {
  var eventlistener = 'mousedown';
  if (supportTouch()) {
    eventlistener = 'touchstart';
  }
  element.addEventListener(eventlistener, function (event) {
    var idchars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var ripple_id = '';
    for (var i = 0; i < 8; i++) {
      var idrandomNumber = Math.floor(Math.random() * idchars.length);
      ripple_id += idchars.substring(idrandomNumber, idrandomNumber + 1);
    }
    var scroll_x = document.documentElement.scrollLeft;
    var scroll_y = document.documentElement.scrollTop;
    var x = event.pageX;
    var y = event.pageY;
    var element_rect = element.getBoundingClientRect();
    var element_x = element_rect.x + scroll_x;
    var element_y = element_rect.y + scroll_y;
    var element_width = element.clientWidth;
    var element_height = element.clientHeight;
    var relative_x = x - element_x;
    var relative_y = y - element_y;
    var ripple_size = Math.max(element_width, element_height);
    var element_position = getComputedStyle(element).getPropertyValue('position');
    if (!(element_position === 'absolute') && !(element_position === 'fixed')) {
      element_position = 'relative';
    }
    var css = `.ripple-element-${ripple_id} {position:${element_position};overflow:hidden;width:${element_width}px;height:${element_height}px; outline:none; -webkit-tap-highlight-color:rgba(0,0,0,0); -webkit-mask-image: -webkit-radial-gradient(white, black);mask-image: -webkit-radial-gradient(white, black);}.ripple-element-ripple-${ripple_id} {background:${color};width:${ripple_size}px; height:${ripple_size}px;border-radius:50%;position:absolute; top:${relative_y - 0.5 * ripple_size}px; left:${relative_x - 0.5 * ripple_size}px;transform:scale(0); opacity:0;animation-duration: ${duration}ms;animation-name: ripple-animation-opacity-${ripple_id},ripple-animation-zoom-${ripple_id};animation-iteration-count: forward;animation-timing-function:linear;}@keyframes ripple-animation-opacity-${ripple_id} {0% {opacity:0.15;}60% {opacity:0.15;}100% { opacity:0;} } @keyframes ripple-animation-zoom-${ripple_id} {0% {transform:scale(0.1)}65% {  transform:scale(2)}100% {transform:scale(2)}}`;
    element.classList.add(`ripple-element-${ripple_id}`);
    var css_style_element = document.createElement('style');
    css_style_element.innerHTML = css;
    css_style_element.id = `ripple-css-${ripple_id}`;
    element.appendChild(css_style_element);
    var ripple_element_ripple = document.createElement('div');
    ripple_element_ripple.id = `ripple-element-ripple-${ripple_id}`;
    ripple_element_ripple.classList.add(`ripple-element-ripple-${ripple_id}`);
    element.appendChild(ripple_element_ripple);
    var ripple_evt = element.getAttribute('ripple-evt');
    if (!(ripple_evt === '')) {
      document.getElementById(`ripple-element-ripple-${ripple_id}`).addEventListener(
        'animationstart',
        function (e) {
          setTimeout(function () {
            eval(ripple_evt);
            if (!(document.getElementById(`ripple-element-ripple-${ripple_id}`) === null)) {
              element.classList.remove(`ripple-element-${ripple_id}`);
              document.getElementById(`ripple-element-ripple-${ripple_id}`).remove();
              document.getElementById(`ripple-css-${ripple_id}`).remove();
            }
          }, duration * 0.75);
        },
        { once: true }
      );
    } else {
      document.getElementById(`ripple-element-ripple-${ripple_id}`).addEventListener(
        'animationend',
        function (e) {
          if (!(document.getElementById(`ripple-element-ripple-${ripple_id}`) === null)) {
            element.classList.remove(`ripple-element-${ripple_id}`);
            document.getElementById(`ripple-element-ripple-${ripple_id}`).remove();
            document.getElementById(`ripple-css-${ripple_id}`).remove();
          }
        },
        { once: true }
      );
      setTimeout(function () {
        if (!(document.getElementById(`ripple-element-ripple-${ripple_id}`) === null)) {
          element.classList.remove(`ripple-element-${ripple_id}`);
          document.getElementById(`ripple-element-ripple-${ripple_id}`).remove();
          document.getElementById(`ripple-css-${ripple_id}`).remove();
        }
      }, duration + 50);
    }
  });
}
function fade(element, type, display, callback) {
  var idchars = '0123456789abcdefghijklmnopqrstuvwxyz';
  var fade_id = '';
  for (var i = 0; i < 8; i++) {
    var idrandomNumber = Math.floor(Math.random() * idchars.length);
    fade_id += idchars.substring(idrandomNumber, idrandomNumber + 1);
  }
  var element_display = getComputedStyle(element).getPropertyValue('display');
  if (element_display === 'none') {
    element_display = 'block';
  }
  var duration = 300;
  var class_str = element.getAttribute('class');
  element.setAttribute('class', class_str.replaceAll(/fade-display-[a-z-]*[^\s]/gm, ''));
  var style_str = element.getAttribute('style');
  element.setAttribute('style', String(style_str).replaceAll(/display[\s]*:{1,1}[\sa-z-]*;{1,1}[^\s]*/gm, ''));
  element.classList.add(`fade${type}-${fade_id}`);
  var css = `.fadeIn-${fade_id} {display:${element_display};opacity:0} .fadeIn-${fade_id}-start{transition:${duration}ms;opacity:1;transition-timing-function:ease-out;} .fadeOut-${fade_id} {display:${element_display};opacity:1} .fadeOut-${fade_id}-start{transition:${duration}ms;opacity:0;transition-timing-function:ease-out;}`;
  var css_style_element = document.createElement('style');
  css_style_element.innerHTML = css;
  css_style_element.id = `fade-css-${fade_id}`;
  element.appendChild(css_style_element);
  setTimeout(function () {
    element.classList.add(`fade${type}-${fade_id}-start`);
  }, 1);
  element.addEventListener(
    'transitionend',
    function () {
      if (!(callback === undefined)) {
        if (typeof callback === 'function') {
          callback();
        }
      }
      element.classList.remove(`fade${type}-${fade_id}-start`);
      element.classList.remove(`fade${type}-${fade_id}`);
      element.classList.add(`fade-display-${display}`);
      if (!(document.getElementById(`fade-css-${fade_id}`) === null)) {
        document.getElementById(`fade-css-${fade_id}`).remove();
      }
    },
    { once: true }
  );
}
function prompt_message(message, duration) {
  if (isNaN(duration)) {
    duration = 1200;
  }
  message = String(message);
  var all_prompt = document.querySelectorAll('.prompt');
  if (!(all_prompt === null)) {
    var all_prompt_len = all_prompt.length;
    for (var e = 0; e < all_prompt_len; e++) {
      all_prompt[e].remove();
    }
  }
  var at = 270;
  translateY = -10;
  var idchars = '0123456789abcdefghijklmnopqrstuvwxyz';
  var prompt_id = '';
  for (var i = 0; i < 8; i++) {
    var idrandomNumber = Math.floor(Math.random() * idchars.length);
    prompt_id += idchars.substring(idrandomNumber, idrandomNumber + 1);
  }
  var prompt_element = document.createElement('div');
  prompt_element.id = prompt_id;
  prompt_element.classList.add('prompt');
  prompt_element.classList.add('prompt_animation' + prompt_id);
  var prompt_center_element = document.createElement('div');
  prompt_center_element.classList.add('promptcenter');
  prompt_center_element.innerText = message;
  prompt_element.appendChild(prompt_center_element);
  var prompt_css = `.prompt_animation${prompt_id}{animation-name:prompt${prompt_id};animation-duration:${duration + at * 2}ms;animation-fill-mode:forwards;animation-timing-function:ease-in-out}@keyframes prompt${prompt_id}{0%{opacity:0;transform:translateX(-50%) translateY(${60}px) scale(1);}${Math.floor((at / (duration + at + 150)) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px - var(--o-safe-area-bottom))) scale(1);}${Math.floor(((at + duration) / (duration + at + 150)) * 100)}%{opacity:1;transform:translateX(-50%) translateY(calc(${translateY}px - var(--o-safe-area-bottom))) scale(1);}100%{opacity:0;transform:translateX(-50%) translateY(${60}px) scale(1);}}`;
  var prompt_css_element = document.createElement('style');
  prompt_css_element.innerHTML = prompt_css;
  prompt_element.appendChild(prompt_css_element);
  document.body.appendChild(prompt_element);
  document.getElementById(prompt_id).addEventListener(
    'animationend',
    function () {
      if (!(document.getElementById(prompt_id) === null)) {
        document.getElementById(prompt_id).remove();
      }
    },
    { once: true }
  );
}

function sendError(err) {
  var position = 'L' + err.line + ',C' + err.column;
  gtag('event', 'error_feedback', {
    event_category: position,
    event_label: position + ' | ' + err.message
  });
}
function sendPotentialError(label) {}
function unicode_arr(str) {
  var str_len = str.length;
  var unicode_arr = [];
  for (var t = 0; t < str_len; t++) {
    var unicode = str.charCodeAt(t);
    if (!(unicode_arr.indexOf(unicode) > -1)) {
      unicode_arr.push(unicode);
    }
  }
  return unicode_arr;
}

function StopName2ID(str, ccc) {
  if (stops_json.loaded) {
    var arr = stops_json['c_' + ccc + '_arr'];
    var arr_len = arr.length;
    for (var o = 0; o < arr_len; o++) {
      if (str === arr[o].nameZh) {
        return arr[o].Id;
      }
    }
  }
}
function getPathBuffer(str) {
  var t_match = str.match(/[\(（][往返程][\)|）]/gm);
  if (!(t_match === null)) {
    for (var w = 0; w < t_match.length; w++) {
      str = str.replaceAll(t_match[w], t_match[w] + ' ');
    }
  }
  var match = str.match(/[\u4E00-\u9FFF\(\)（）]*/gm);
  if (!(match === null)) {
    var match_len = match.length;
    var current_direction = 'all';
    var start_stop = 0;
    var pervious_stop = '';
    var buffers = { o_0: [], o_1: [] };
    for (var t = 0; t < match_len; t++) {
      if (match[t].length < 1) {
        continue;
      }
      if (match[t].indexOf('往') > -1) {
        current_direction = 'o_0';
      } else {
        if (match[t].indexOf('返') > -1) {
          current_direction = 'o_1';
        } else {
          start_stop += 1;
          if (start_stop >= 2) {
            start_stop = 0;
            if (current_direction === 'all') {
              buffers['o_0'].push({ n: pervious_stop, d: 0 });
              buffers['o_0'].push({ n: match[t], d: 1 });
              buffers['o_1'].push({ n: match[t], d: 0 });
              buffers['o_1'].push({ n: pervious_stop, d: 1 });
            } else {
              buffers[current_direction].push({ n: pervious_stop, d: 0 });
              buffers[current_direction].push({ n: match[t], d: 1 });
            }
            current_direction = 'all';
          }
          pervious_stop = match[t];
        }
      }
    }
  }
  return buffers;
}
function updateRefreshProgress() {
  var t = new Date().getTime();
  var p = Math.abs(t - realtime_last_update) / update_interval;
  if (p < 0) {
    p = 0;
  }
  if (p > 1) {
    p = 1;
  }
  $('.refresh_progress').css({ '--o-refresh-progress': (1 - p) * -100 + '%' });
  if (refreshProgresPause === 0) {
    window.requestAnimationFrame(updateRefreshProgress);
  } else {
    refreshProgresPause = 0;
  }
}
function getTextWidth(text, font) {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function skeletonScreen() {
  var j = [];
  var ll = Math.floor(window.innerHeight / 45) + 5;
  for (var y = 0; y < ll; y++) {
    j.push({ sk: true, goBack: 0 });
  }
  for (var y = 0; y < ll; y++) {
    j.push({ sk: true, goBack: 1 });
  }
  printStops(j, 'skeleton');
  skeletonScreenStatus = 1;
}

function setRouteD() {
  if (routes_json.loaded) {
    var this_route = routes_json.c['b_' + c_routeid];
    if (!routes_json.c.hasOwnProperty('b_' + c_routeid)) {
      return '';
    }
    var dep = '往' + this_route.dep;
    var des = '往' + this_route.des;
    var name = this_route.n;
    c_route_local_key = getLocalKey(name);
    c_route_name = String(name);
    var w = [];
    var font = "500 16px 'Noto Sans', sans-serif";
    route_tab_dep_width = getTextWidth(des, font);
    route_tab_des_width = getTextWidth(dep, font);
    w.push(`--tab-line-depature-width:${route_tab_dep_width}px`);
    w.push(`--tab-line-destination-width:${route_tab_des_width}px`);

    $('#routes_animation_css').html(':root{' + w.join(';') + '}');
    $('.route_container .tabs .tab[direction="departure"] span').text(des);
    $('.route_container .tabs .tab[direction="destination"] span').text(dep);
    $('.route_container .title .routename').text(name);
    $('.route_container .tabs').attr('l', '1');
    $('.route_container .title .routename').attr('l', '1');
    $('.tab-line')
      .attr('class', 'tab-line initialization')
      .css({ '--j-initialization-width': route_tab_dep_width + 'px' });
    var lk = `bus_favorite_route_${c_route_local_key}`;
    if (LS.hasOwnProperty(lk)) {
      json = JSON.parse(String(LS.getItem(lk)));
      if (!(json.local_key === c_route_local_key && !(c_route_name === json.n))) {
        $('.route_info_box .actions .action[m="favorite"]').attr('status', '1');
      } else {
        sendPotentialError('set_favorite_route_status_local_key_repeat');
      }
    } else {
      $('.route_info_box .actions .action[m="favorite"]').attr('status', '0');
    }
  }
}

function scrollToY(element, source, aim, startTime, endTime, t) {
  var f = function (x) {
    return -15.4 + 9.11 * x - 0.0285 * x * x;
  };
  var x_min = 1.7;
  var x_max = 163.02;
  var y_min = f(x_min);
  var y_max = f(x_max);
  var s = function (time) {
    var x = x_min + ((time - startTime) / (endTime - startTime)) * (x_max - x_min);
    var y = f(x);
    return source + ((y_min + y) / (y_max - y_min)) * (aim - source);
  };

  if (t < endTime) {
    var k = s(t);
    element.scrollTop = k;

    t = new Date().getTime();
    window.requestAnimationFrame(function () {
      scrollToY(element, source, aim, startTime, endTime, t);
    });
  }
}
function scrollTo(element, aim, duration) {
  var t = new Date().getTime();
  scrollToY(element, element.scrollTop, aim, t, t + duration, t);
}
function scrollToStop(seqNo, direction) {
  var selector = '.route_container .route[direction="' + direction + '"]';
  var stop_height = 50;
  var route_container_height = $(selector).height();
  var stop_offset_top = seqNo * stop_height;
  var route_content_height = document.querySelector(selector).scrollHeight;
  var scrolltop = 0;
  if (stop_offset_top > (route_container_height - stop_height) / 2 && route_content_height - stop_offset_top - stop_height > (route_container_height - stop_height) / 2) {
    scrolltop = ((route_container_height - stop_height) / 2 - stop_offset_top) * -1;
  } else {
    if (stop_offset_top > route_content_height - stop_offset_top - stop_height) {
      scrolltop = route_content_height - route_container_height;
    }
  }
  scrollTo(document.querySelector(selector), scrolltop, 555);
}

function scrollToNearestStop(direction) {
  if (route_container_scrolled === 0) {
    var selector = '.route_container .route[direction="' + direction + '"]';
    var ff = $(selector + ' .stop[nh="true"]');
    var len = ff.length;
    if (len > 0) {
      var uu = parseInt(
        $(selector + ' .stop')
          .eq(0)
          .attr('no')
      );
      route_container_scrolled = 1;
      scrollToStop(Math.abs(parseInt(ff.eq(0).attr('no')) - uu), direction);
    }
  }
}
function bString(h, u) {
  var e = '"';
  if (u === 1) {
    e = "'";
  }
  return e + h + e;
}
var realtime_last_update_a = 0;
function printStops(k, c, bp, api_update_time_ms, now_time_ms) {
  if (realtime_last_update_a === 0) {
    realtime_last_update_a = api_update_time_ms;
  }
  try {
    var pos_checkStops = function (h) {
      if (h.length <= 0) {
        return {};
      } else {
        if (h[0].distance <= 500) {
          return h[0];
        }
      }
    };
    var fg = function (b) {
      s = { goBack: b };
      displayName = '';
      bv.h = true;
    };
    var isBuffer = function (bu, str, direction) {
      if (!bu.hasOwnProperty('o_' + direction)) {
        return { g: false, j: {} };
      }
      bu = bu['o_' + direction];
      var bu_len = bu.length;
      for (var p = 0; p < bu_len; p++) {
        if (String(bu[p].n).indexOf(str) > -1 && String(str).indexOf(bu[p].n) > -1) {
          return { g: true, j: bu[p] };
        }
      }
      return { g: false, j: {} };
    };
    if (skeletonScreenStatus === 1) {
      skeletonScreenStatus = 0;
      $('.route_container .route[direction="departure"]').html('');
      $('.route_container .route[direction="destination"]').html('');
    }
    var htm = {};
    var l = k.length;
    var g = false;
    var nearest_stops_list = { o_0: [], o_1: [] };
    var nearest_stops_d = { o_0: {}, o_1: {} };
    var buffers = {};
    var buffer_closed = 0;
    if (c === 'skeleton') {
      g = true;
    }
    if (!g) {
      nearest_stops_list = getNearestStops(pos_lat, pos_lon);
      nearest_stops_d['o_0'] = pos_checkStops(nearest_stops_list.o_0);
      nearest_stops_d['o_1'] = pos_checkStops(nearest_stops_list.o_1);
      if (routes_json.loaded && stops_json.loaded) {
        buffers = getPathBuffer(routes_json.c['b_' + c_routeid].s);
      }
    }
    var ripple_selector_list = [];
    for (var w = 0; w < l; w++) {
      if (!k[w].hasOwnProperty('StopID') || !k[w].hasOwnProperty('EstimateTime')) {
        if (!g) {
          continue;
        }
      }
      var selector = '';
      var displayName = k[w].StopID;
      var s = {};
      var bv = { h: false, n: '', icon: '', l: '', ty: '', time: '', status: '' };
      var nh = false;
      var buffer_start_html = ``;
      var buffer_end_html = ``;
      if (g) {
        fg(k[w].goBack);
      } else {
        if (stops_json.loaded) {
          if (stops_json.c.hasOwnProperty('b_' + k[w].StopID)) {
            s = stops_json.c['b_' + k[w].StopID];
            displayName = s.nameZh;
            if (nearest_stops_d.hasOwnProperty('o_' + s.goBack)) {
              if (!(nearest_stops_d['o_' + s.goBack] === undefined)) {
                if (nearest_stops_d['o_' + s.goBack].StopID === k[w].StopID) {
                  nh = true;
                }
              }
            }
          } else {
            continue;
          }
        }
        if (busevent_json.loaded) {
          if (bp.hasOwnProperty('s_' + k[w].StopID)) {
            var thisbv = bp['s_' + k[w].StopID];
            bv.h = true;
            bv.n = thisbv.BusID;
            bv.icon = icon_bus;
            bv.l = thisbv.CarOnStop;
            bv.ty = thisbv.CarType;
            bv.time = thisbv.DataTime;
            bv.status = thisbv.BusStatus;
          }
        }
      }

      if (!htm.hasOwnProperty('h_' + s.goBack)) {
        htm['h_' + s.goBack] = [];
      }
      if (g) {
        var status_time_g = 0;
        var status = { status: 10, text: '', tr: false };
      } else {
        var status_time_p = false;
        var status_time_change = 0;
        if (route_container_content['h_' + s.goBack].hasOwnProperty('b_' + k[w].StopID)) {
          if (route_container_content['h_' + s.goBack]['b_' + k[w].StopID].hasOwnProperty('status_time_g')) {
            status_time_p = route_container_content['h_' + s.goBack]['b_' + k[w].StopID]['status_time_g'];
            status_time_change = route_container_content['h_' + s.goBack]['b_' + k[w].StopID]['status_time_change'];
          }
        }

        var status_time_g = parseInt(k[w].EstimateTime);
        var status = timeStatus(status_time_g);
      }
      if (!g) {
        var bf_c = isBuffer(buffers, displayName, s.goBack);
        if (bf_c.g) {
          if (buffer_closed === 0) {
            buffer_start_html = `<div class="buffer-group">`;
            buffer_closed = 1;
          } else {
            if (buffer_closed === 1) {
              buffer_end_html = `</div>`;
              buffer_closed = 0;
            }
          }
        }
      }
      var jn = { id: k[w].StopID, name: displayName, bv: bv, status: status, nh: nh };
      var hash = md5(JSON.stringify(jn));
      var bvhash = md5(JSON.stringify(bv));
      var statushash = md5(JSON.stringify(status));

      if (!route_container_content['h_' + s.goBack].hasOwnProperty('b_' + k[w].StopID) || g === true) {
        route_container_content['h_' + s.goBack]['b_' + k[w].StopID] = {};
        var bus_element_id = gid('bus');
        ripple_selector_list.push(`#${bus_element_id}`);
        htm['h_' + s.goBack].push(`${buffer_start_html}<li class="stop" l="${g}" stop-id="${k[w].StopID}" bus="${bv.h}" nh="${nh}" no="${s.seqNo}"><div class="name">${displayName}</div><div class="position" d="${nh}"><div class="position-signal"></div><div class="position-white"></div><div class="position-blue"></div></div><button class="bus" d="${bv.h}" l="${bv.l}" id="${bus_element_id}" onclick="displayBus('${bv.n}','${bv.l}','${bv.ty}','${bv.status}','${bv.time}')"><div class="busicon">${bv.icon}</div></button><div class="status" status="${status.status}" tr="${status.tr}">${status.text}</div></li>${buffer_end_html}`);
      }

      if (!(route_container_content['h_' + s.goBack]['b_' + k[w].StopID]['hash'] === hash) && !(g === true)) {
        if (s.goBack === 0) {
          selector = '.route_container .route[direction="departure"]';
        }
        if (s.goBack === 1) {
          selector = '.route_container .route[direction="destination"]';
        }
        selector += ' .stop[stop-id="' + k[w].StopID + '"]';
        var thiscontent = route_container_content['h_' + s.goBack]['b_' + k[w].StopID];
        if (!(thiscontent.bvhash === bvhash)) {
          $(selector).attr('bus', bv.h);
          $(selector + ' .bus')
            .attr('d', bv.h)
            .attr('l', bv.l)
            .attr('onclick', 'displayBus(' + bString(bv.n, 1) + ',' + bString(bv.l, 1) + ',' + bString(bv.ty, 1) + ',' + bString(bv.status, 1) + ',' + bString(bv.time, 1) + ')');
          $(selector + ' .bus .busicon').html(bv.icon);
        }
        if (!(thiscontent.statushash === statushash)) {
          var status_s = status.tr;
          if ((thiscontent.status <= 3 && status.status === 0) || 3) {
            status_s = true;
          }
          $(selector + ' .status')
            .attr('tr', status_s)
            .attr('status', status.status)
            .text(status.text);
        }
        if (!(thiscontent.nh === nh)) {
          $(selector + ' .position').attr('d', nh);
          $(selector).attr('nh', nh);
        }
        if (Math.abs(status_time_p - status_time_g) > 0) {
          status_time_change = new Date().getTime();
        }
        route_container_content['h_' + s.goBack]['b_' + k[w].StopID] = { hash: hash, bvhash: bvhash, statushash: statushash, status: status, status_time_g: status_time_g, status_time_change: status_time_change };
      }
    }
    if (!htm.hasOwnProperty('h_0')) {
      htm['h_0'] = [''];
    }
    if (!htm.hasOwnProperty('h_1')) {
      htm['h_1'] = [''];
    }

    $('.route_container .route[direction="departure"]').append(htm['h_0'].join(''));
    $('.route_container .route[direction="destination"]').append(htm['h_1'].join(''));
    if (ripple_selector_list.length > 0) {
      ripple(document.querySelectorAll(ripple_selector_list.join(',')), 'var(--g-333333)', 450);
    }
    if (route_dep_auto_scroll === 0 && !g) {
      route_dep_auto_scroll = 1;
      scrollToNearestStop('departure');
    }
    if (route_des_auto_scroll === 0 && !g) {
      route_des_auto_scroll = 1;
      scrollToNearestStop('destination');
    }
  } catch (e) {
    console.log(e);
  }
}

function timeStatus(t) {
  var padding = function (j) {
    if (j < 10) {
      return '0' + j;
    } else {
      return j;
    }
  };
  t = parseInt(t);
  var opt = getOption('options_reveal_estimate_time_exact_seconds');
  if (opt) {
    var time = padding((t - (t % 60)) / 60) + ':' + padding(t % 60);
  } else {
    var time = Math.round(t / 60) + '分';
  }
  if (t === -3) {
    return { status: 6, text: '末班駛離', tr: false };
  }
  if (t === -4) {
    return { status: 5, text: '今日停駛', tr: false };
  }
  if (t === -2) {
    return { status: 4, text: '交通管制', tr: false };
  }
  if (t === -1) {
    return { status: 3, text: '未發車', tr: false };
  }
  if (t <= 180) {
    if (t <= 100) {
      if (opt) {
        if (t <= 10) {
          return { status: 2, text: '進站中', tr: true };
        } else {
          return { status: 2, text: time, tr: true };
        }
      } else {
        return { status: 2, text: '進站中', tr: true };
      }
    } else {
      return { status: 1, text: time, tr: true };
    }
  } else {
    return { status: 0, text: time, tr: false };
  }
}
function findStop(j, id, pid) {
  var res = [];
  if (!stops_json.loaded || !(typeof pid === 'object' && Array.isArray(pid))) {
    return res;
  }
  var o = j.BusInfo;
  var l = o.length;
  for (var w = 0; w < l; w++) {
    var this_id = parseInt(o[w].RouteID);
    if (this_id === id || pid.indexOf(String(this_id)) > -1 || this_id === id * 10) {
      res.push(o[w]);
    }
  }

  res.sort(function (a, b) {
    var c = -1;
    var d = 0;
    if (stops_json.c.hasOwnProperty('b_' + a.StopID)) {
      c = stops_json.c['b_' + a.StopID].seqNo;
    }
    if (stops_json.c.hasOwnProperty('b_' + b.StopID)) {
      d = stops_json.c['b_' + b.StopID].seqNo;
    }
    return c - d;
  });
  return res;
}
function findBus(j, id, pid) {
  if (!j.loaded || !routes_json.loaded) {
    return {};
  }
  var res = {};
  var o = j.c;
  var l = o.length;
  for (var w = 0; w < l; w++) {
    var ro = parseInt(o[w].RouteID);
    if (ro === id || pid.indexOf(String(ro)) > -1 || ro === id * 10) {
      res['s_' + o[w].StopID] = o[w];
    }
  }
  return res;
}

function updateRealtimeJson(immediate_update) {
  if (update_status === 0) {
    updateBusEventJson();
    $.ajax({
      type: 'GET',
      url: realtime_api() + '?_=' + api_url_parameter(5 * 1000),
      async: true,
      cache: true,
      xhrFields: { responseType: 'blob' },
      success: function (data, statusText, xhr) {
        var b = new Blob([data.slice(0, data.size)], { type: 'application/gzip' });
        b.arrayBuffer().then((bf) => {
          var z = pako.inflate(bf, { to: 'string' });
          realtime_json = JSON.parse(z);
          var last_modified = new Date(String(xhr.getResponseHeader('last-modified')));
          var now = new Date();
          var jn = 10000;
          update_interval = Math.min(Math.max(5000, Math.abs(last_modified.getTime() + jn - now.getTime())), 15000);
          if (isNaN(update_interval)) {
            update_interval = 10000;
          }
          if (stops_json.loaded) {
            var s = findStop(realtime_json, c_routeid, c_routeid_p);
            var bb = findBus(busevent_json, c_routeid, c_routeid_p);
            current_route_stops = s;
            printStops(s, '', bb, new Date(realtime_json.EssentialInfo.UpdateTime).getTime(), now.getTime());
            realtime_last_update = new Date().getTime();
            if (refresh_progress_l === 0) {
              refresh_progress_l = 1;
              $('.refresh_progress_box').attr('l', '1');
            }
          }
          if (!(immediate_update === true)) {
            setTimeout(function () {
              updateRealtimeJson(false);
            }, update_interval);
          }
        });
      },
      error: function () {
        setTimeout(function () {
          updateRealtimeJson(false);
        }, 1000);
      }
    });
  } else {
    if (!(immediate_update === true)) {
      setTimeout(function () {
        updateRealtimeJson(false);
      }, 1000);
    }
  }
}
function updateBusEventJson() {
  $.ajax({
    type: 'GET',
    url: busevent_api() + '?_=' + api_url_parameter(5 * 1000),
    async: true,
    cache: true,
    xhrFields: { responseType: 'blob' },
    success: function (data) {
      var b = new Blob([data.slice(0, data.size)], { type: 'application/gzip' });
      b.arrayBuffer().then((bf) => {
        var z = pako.inflate(bf, { to: 'string' });
        var o = JSON.parse(z).BusInfo;
        busevent_json.c = o;
        busevent_json.loaded = true;
      });
    },
    error: function () {}
  });
}

function getStops() {
  var t = new Date().getTime();
  if (!stops_json['c_' + stops_data_city + '_loaded']) {
    $.ajax({
      type: 'GET',
      url: stops_api() + '?_=' + api_url_parameter(60 * 60 * 24 * 1000),
      async: true,
      cache: true,
      xhrFields: { responseType: 'blob' },
      success: function (data) {
        var b = new Blob([data.slice(0, data.size)], { type: 'application/gzip' });
        b.arrayBuffer().then((bf) => {
          var z = pako.inflate(bf, { to: 'string' });
          var o = JSON.parse(z).BusInfo;
          var json_processed = {};
          var pl = o.length;
          for (var j = 0; j < pl; j++) {
            var this_json_k = o[j];
            var id = o[j].Id;
            json_processed['b_' + id] = o[j];
          }
          stops_json['c_' + stops_data_city] = json_processed;
          stops_json['c_' + stops_data_city + '_loaded'] = true;
          stops_json['c_' + stops_data_city + '_arr'] = o;
          if (stops_data_city === 0) {
            stops_json.c = stops_json['c_0'];
            stops_data_city = 1;
            getStops();
          }
          if (stops_data_city === 1) {
            stops_json.c = Object.assign(stops_json['c_0'], stops_json['c_1']);
            stops_json.loaded = true;
            stops_json['c_arr'] = stops_json['c_' + 0 + '_arr'].concat(stops_json['c_' + 1 + '_arr']);
            if (realtime_lo === 0) {
              realtime_lo = 1;
              updateRealtimeJson(false);
            } else {
              updateRealtimeJson(true);
            }
          }
        });
      }
    });
  }
}

function getRoutes(immediate_update) {
  var t = new Date().getTime();
  var g = 60 * 60 * 24 * 1 * 1000;
  if (immediate_update) {
    routes_json.loaded = false;
  }
  if (LS.hasOwnProperty('bus_routes_t_' + 0) && LS.hasOwnProperty('bus_routes_t_' + 1)) {
    if (!immediate_update) {
      if (t - parseInt(String(LS.getItem('bus_routes_t_' + 0))) < g && t - parseInt(String(LS.getItem('bus_routes_t_' + 1))) < g && !(routes_json.loaded === true)) {
        var cc0 = JSON.parse(String(LS.getItem('bus_routes_' + 0)));
        var cc1 = JSON.parse(String(LS.getItem('bus_routes_' + 1)));
        routes_json['c_0'] = cc0;
        routes_json['c_1'] = cc1;
        routes_json.c = Object.assign(cc0, cc1);
        routes_json.loaded = true;
      }
    }
  }

  if (routes_json.loaded) {
    createSearchIndex(routes_json);
    initializePersonalBlocks();
    if (routes_json.c.hasOwnProperty('b_' + c_routeid)) {
      c_routeid_p = String(routes_json.c['b_' + c_routeid].pid).split(',');
    }
    setRouteD();
  } else {
    if (immediate_update) {
      prompt_message('更新路線資料中');
    }
    $.ajax({
      type: 'GET',
      url: routes_api(routes_data_city),
      async: true,
      cache: false,
      xhrFields: { responseType: 'blob' },
      success: function (data) {
        var b = new Blob([data.slice(0, data.size)], { type: 'application/gzip' });
        b.arrayBuffer().then((bf) => {
          var z = pako.inflate(bf, { to: 'string' });
          var o = JSON.parse(z).BusInfo;
          var json_processed = {};
          var pl = o.length;
          for (var j = 0; j < pl; j++) {
            var this_json_k = o[j];
            var id = o[j].Id;
            for (var g = 0; g < rdsn_len; g++) {
              var thsS = routesDataShortName[g];
              if (this_json_k.hasOwnProperty(thsS.source)) {
                if (!(thsS.short === false)) {
                  this_json_k[thsS.short] = this_json_k[thsS.source];
                }
                delete this_json_k[thsS.source];
              }
            }
            if (!json_processed.hasOwnProperty('b_' + id)) {
              json_processed['b_' + id] = this_json_k;
            } else {
              if (!(this_json_k.pid === json_processed['b_' + id]['pid']) || !(String(json_processed['b_' + id]['pid']).indexOf(',' + this_json_k.pid) > -1)) {
                json_processed['b_' + id]['pid'] = json_processed['b_' + id]['pid'] + ',' + this_json_k.pid;
              }
            }
          }

          routes_json['c_' + routes_data_city] = json_processed;
          LS.setItem('bus_routes_' + routes_data_city, JSON.stringify(json_processed));
          LS.setItem('bus_routes_t_' + routes_data_city, new Date().getTime());
          if (routes_data_city === 0) {
            routes_data_city = 1;
            getRoutes(immediate_update);
          }
          if (routes_data_city === 1) {
            routes_json.loaded = true;
            routes_json['c_1'] = json_processed;
            routes_json.c = Object.assign(routes_json['c_0'], json_processed);
            createSearchIndex(routes_json);
            if (routes_json.c.hasOwnProperty('b_' + c_routeid)) {
              c_routeid_p = String(routes_json.c['b_' + c_routeid].pid).split(',');
            }
            if (immediate_update) {
              prompt_message('路線資料更新成功');
            }
            setRouteD();
          }
        });
      }
    });
  }
}

function showRoute(id) {
  route_container_content = { h_0: {}, h_1: {} };
  skeletonScreen(false);
  c_routeid = id;
  getRoutes(false);
}

function switchDirection(d, event) {
  if (!(event === undefined) && !(event === null)) {
    if (event.type === 'click') {
      $('.routes,.tab-line-box2,.tabs').attr('slide', '0').css({ '--j-transition-p': 'transform 450ms', '--j-transition-w-p': 'width 450ms', '--j-transition-a-p': `all 450ms` });
    }
  }
  var a = 0;
  var b = 1;
  offsetX = (route_max_X - route_min_X) * 0;
  if (d === 'destination') {
    a = 1;
    b = 0;
    offsetX = (route_max_X - route_min_X) * -1;
  }
  route_direction = d;
  route_container_scrolled = 0;
  $('.route_container .routes').attr('class', 'routes ' + d);
  $('.route_container .tabs .tab[direction="departure"]').attr('g', a);
  $('.route_container .tabs .tab[direction="destination"]').attr('g', b);
  $('.tab-line-box2').attr('class', 'tab-line-box2 ' + d);
  $('.tab-line').attr('class', 'tab-line ' + d);
  document.querySelector('.routes').addEventListener(
    'transitionend',
    function () {
      $('.route_container .routes').attr('slide', '-1');
      $('.tab-line-box2,.tabs').attr('slide', '-1');
    },
    { once: true }
  );
  if (!(event === undefined) && !(event === null)) {
    if (event.type === 'click') {
      scrollToNearestStop(d);
    }
  }
}

function standaloneStatusBarColor(a) {
  var c = '#ffffff';
  var d = '#101010';
  if (a === 1) {
    c = '#7f7f7f';
    d = '#080808';
  }
  $('head meta[kji="light"]').attr('content', c);
  $('head meta[kji="dark"]').attr('content', d);
}

function closeBus() {
  if (businfo_close === 0) {
    businfo_close = 1;
    $('.bus_info_box').attr('p', '0');
    $('.bus_info_mask').css({ opacity: '0' });
    standaloneStatusBarColor(0);
    setTimeout(() => {
      $('.bus_info_mask').css({ display: 'none' });
      businfo_close = 0;
    }, 480);
  }
}
function displayBus(id, onstop, type, status, update) {
  gtag('event', 'display_bus_info', {
    event_category: onstop,
    event_label: id,
    event_callback: function () {}
  });
  businfo_scroll = 0;
  businfo_scroll_1 = 0;
  let sel = '.bus_info_box .bus_info .bus_info_list li';
  if (onstop === '0') {
    onstop = '離站';
  }
  if (onstop === '1') {
    onstop = '進站';
  }
  if (type === '0') {
    type = '一般';
  }
  if (type === '1') {
    type = '低底盤';
  }
  if (type === '2') {
    type = '大復康巴士';
  }
  if (type === '3') {
    type = '狗狗友善專車';
  }
  if (status === '0') {
    status = '正常';
  }
  if (status === '1') {
    status = '車禍';
  }
  if (status === '2') {
    status = '故障';
  }
  if (status === '3') {
    status = '塞車';
  }
  if (status === '4') {
    status = '緊急求援';
  }
  if (status === '5') {
    status = '加油';
  }
  if (status === '99') {
    status = '非營運狀態';
  }
  $(sel + '[f="bus_id"]').text(id);
  $(sel + '[f="bus_onstopstatus"]').text(onstop);
  $(sel + '[f="bus_type"]').text(type);
  $(sel + '[f="bus_status"]').text(status);
  $(sel + '[f="bus_update"]').text(update);
  $('.bus_info_box').scrollTop(50).attr('p', '1');
  $('.bus_info_title').attr('sticky', '0');
  $('.bus_info_mask').css({ display: 'block' });
  setTimeout(() => {
    $('.bus_info_mask').css({ opacity: '1' });
    standaloneStatusBarColor(1);
  }, 1);
}

function closeRouteInfo() {
  if (routeinfo_close === 0) {
    routeinfo_close = 1;
    $('.route_info_box').attr('p', '0');
    $('.route_info_mask').css({ opacity: '0' });
    standaloneStatusBarColor(0);
    setTimeout(() => {
      $('.route_info_mask').css({ display: 'none' });
      routeinfo_close = 0;
    }, 480);
  }
}
function displayRouteInfo() {
  var ct = 60 * 60 * 24 * 1000;
  routeinfo_scroll = 0;
  routeinfo_scroll_1 = 0;
  let sel = '.route_info_box .route_info .route_info_list li';
  $('.route_info_box').scrollTop(50).attr('p', '1');
  $('.route_info_title').attr('sticky', '0');
  $('.route_info_mask').css({ display: 'block' });
  setTimeout(() => {
    $('.route_info_mask').css({ opacity: '1' });
    standaloneStatusBarColor(1);
  }, 1);

  var setF = function (f, v) {
    if (v === null || v === undefined || v === '' || v === ' ') {
      v = '';
    }
    var l = String(v).length;
    if (l <= 0) {
      $(sel + '[f="' + f + '"]').attr('d', '0');
    } else {
      $(sel + '[f="' + f + '"]')
        .attr('d', '1')
        .text(v);
    }
  };
  var minute = function (s) {
    return parseInt(s) + '分';
  };
  var hw = function (str) {
    str = String(str);
    var l = str.length;
    if (l === 4) {
      var min = minute(str.substring(0, 2));
      var max = minute(str.substring(2, 4));
      return min + '-' + max;
    }
    if (l === 2) {
      return minute(str);
    }
    return str;
  };
  var time24h = function (str) {
    str = String(str);
    var l = str.length;
    if (l === 4) {
      var hh = str.substring(0, 2);
      var mm = str.substring(2, 4);
      return hh + ':' + mm;
    }
    return str;
  };

  if (routeinfo_loaded === 0) {
    routeinfoloadtime_t1 = new Date().getTime();
    $('.route_info_box').attr('l', '0');
    $(sel).attr('d', '1');
    $.ajax({
      type: 'GET',
      url: routes_api(city) + '?_=' + api_url_parameter(ct),
      async: true,
      cache: true,
      xhrFields: { responseType: 'blob' },
      success: function (data) {
        var b = new Blob([data.slice(0, data.size)], { type: 'application/gzip' });
        b.arrayBuffer().then((bf) => {
          var z = pako.inflate(bf, { to: 'string' });
          var o = JSON.parse(z).BusInfo;
          var l = o.length;
          var u;
          for (var i = 0; i < l; i++) {
            var this_route = o[i];
            if (this_route.Id === c_routeid) {
              u = this_route;
              break;
            } else {
              continue;
            }
          }

          $.ajax({
            type: 'GET',
            url: provider_api() + '?_=' + api_url_parameter(ct),
            async: true,
            cache: true,
            xhrFields: { responseType: 'blob' },
            success: function (data2) {
              var b2 = new Blob([data2.slice(0, data2.size)], { type: 'application/gzip' });
              b2.arrayBuffer().then((bf2) => {
                var z2 = pako.inflate(bf2, { to: 'string' });
                var o2 = JSON.parse(z2).BusInfo;
                var l2 = o.length;
                var u2;
                for (var i = 0; i < l; i++) {
                  var this_provider = o2[i];
                  if (this_provider.id === u.providerId) {
                    u2 = this_provider;
                    break;
                  } else {
                    continue;
                  }
                }

                $.ajax({
                  type: 'GET',
                  url: timetable_api() + '?_=' + api_url_parameter(ct),
                  async: true,
                  cache: true,
                  xhrFields: { responseType: 'blob' },
                  success: function (data3) {
                    var b3 = new Blob([data3.slice(0, data3.size)], { type: 'application/gzip' });
                    b3.arrayBuffer().then((bf3) => {
                      var z3 = pako.inflate(bf3, { to: 'string' });
                      var o3 = JSON.parse(z3).BusInfo;
                      var l3 = o3.length;
                      var u3 = { u_weekday: {}, u_specialday: {}, u_holiday: {} };
                      var u3_l_w = 0;
                      var u3_l_h = 0;

                      for (var i = 0; i < l3; i++) {
                        var this_timetable = o3[i];
                        var this_pid = this_timetable.PathAttributeId;
                        if (this_pid === c_routeid_p || this_pid === c_routeid || this_pid === c_routeid * 10) {
                          var dateval = this_timetable.DateValue;
                          var depTime = this_timetable.DepartureTime;
                          if (this_timetable.DateType === '0') {
                            if (dateval === '1' || dateval === '7') {
                              u3['u_holiday']['t_' + depTime] = this_timetable;
                              u3_l_h += 1;
                            } else {
                              u3['u_weekday']['t_' + depTime] = this_timetable;
                              u3_l_w += 1;
                            }
                          } else {
                            u3['u_specialday']['t_' + depTime] = this_timetable;
                          }
                        } else {
                          continue;
                        }
                      }
                      var weekday_timetable = [];
                      var holiday_timetable = [];
                      var specialday_timetable = [];
                      var weekday_timetable_str = '';
                      var holiday_timetable_str = '';

                      if (u3_l_w >= 1) {
                        for (var f in u3['u_weekday']) {
                          var this_f = u3['u_weekday'][f];
                          weekday_timetable.push(time24h(this_f.DepartureTime));
                        }
                        weekday_timetable.sort(function (a, b) {
                          var c = a.split(':');
                          var d = b.split(':');
                          var e = parseInt(c[0]) * 60 + parseInt(c[1]);
                          var f = parseInt(d[0]) * 60 + parseInt(d[1]);
                          return e - f;
                        });
                        weekday_timetable_str = weekday_timetable.join('|');
                      }
                      if (u3_l_h >= 1) {
                        for (var f in u3['u_holiday']) {
                          var this_f = u3['u_holiday'][f];
                          holiday_timetable.push(time24h(this_f.DepartureTime));
                        }
                        holiday_timetable.sort(function (a, b) {
                          var c = a.split(':');
                          var d = b.split(':');
                          var e = parseInt(c[0]) * 60 + parseInt(c[1]);
                          var f = parseInt(d[0]) * 60 + parseInt(d[1]);
                          return e - f;
                        });
                        holiday_timetable_str = holiday_timetable.join('|');
                      }
                      var r_weekday = '尖峰:' + hw(u.peakHeadway) + '|離峰:' + hw(u.offPeakHeadway);
                      if (u.peakHeadway.length <= 0) {
                        r_weekday = undefined;
                      }
                      var r_holiday = '尖峰:' + hw(u.holidayPeakHeadway) + '|離峰:' + hw(u.holidayOffPeakHeadway);
                      if (u.holidayPeakHeadway.length <= 0) {
                        r_holiday = undefined;
                      }
                      setF('route_name', u.nameZh);
                      setF('route_departure', u.departureZh);
                      setF('route_destination', u.destinationZh);
                      setF('route_weekday_first', time24h(u.goFirstBusTime));
                      setF('route_weekday_last', time24h(u.goLastBusTime));
                      setF('route_weekday', r_weekday);
                      setF('route_weekday_timetable', weekday_timetable_str);
                      setF('route_holiday_timetable', holiday_timetable_str);
                      setF('route_holiday_first', time24h(u.holidayGoFirstBusTime));
                      setF('route_holiday_last', time24h(u.holidayGoLastBusTime));
                      setF('route_holiday', r_holiday);
                      setF('route_price', u.ticketPriceDescriptionZh);
                      setF('route_buffer', u.segmentBufferZh);
                      setF('route_provider', u.providerName);
                      setF('route_tel', u2.phoneInfo);
                      setF('route_email', u2.email);
                      $('.route_info_box').attr('l', '1');
                      routeinfo_loaded = 1;
                      routeinfoloadtime_t2 = new Date().getTime();
                      routeinfoloadtime = routeinfoloadtime_t2 - routeinfoloadtime_t1;
                      gtag('event', 'display_route_info', {
                        event_category: c_routeid,
                        complete_time: routeinfoloadtime,
                        event_callback: function () {}
                      });
                    });
                  }
                });
              });
            }
          });
        });
      }
    });
  }
}
function closeRoute() {
  refreshProgresPause = 1;
  gtag('event', 'back_to_previous_page', {
    event_category: 'close_route',
    event_label: c_routeid,
    event_callback: function () {
      //$('.route_container').css({ 'display': 'none' })
      fade(document.querySelector('.route_container'), 'Out', 'none', function () {
        route_page_is_open = 0;
        $('.route_container .route[direction="departure"]').scrollTop(0).html('');
        $('.route_container .route[direction="destination"]').scrollTop(0).html('');
      });
    }
  });
}

function getLocalKey(str) {
  var regex = /[A-Za-z0-9\-\_\.\!\~\*\'\(\)]*/gm;
  var s = str.match(regex) || [];
  s = s.join('').replaceAll(/[\-\.\!\~\*\'\(\)]/gm, '_');
  var r = str.replaceAll(regex, '') || '';
  var e = String(encodeURIComponent(r)).split('%');
  var t = 0;
  var e_len = e.length;
  for (var w = 0; w < e_len; w++) {
    t += parseInt(e[w], 16) || 0;
  }
  t = parseInt(t).toString(36);
  return (s + '' + t).toLowerCase();
}

function createSearchIndex(j) {
  if (j.loaded) {
    j = j.c;
    var arr = [];
    for (var p in j) {
      var this_p = j[p];
      var id = String(p).replace('b_', '');
      var ct = undefined;
      this_p['id'] = id;
      this_p['unicode'] = unicode_arr(this_p.n + this_p.dep + this_p.des);
      if (routes_json['c_0'].hasOwnProperty(p)) {
        ct = 0;
      }
      if (routes_json['c_1'].hasOwnProperty(p)) {
        ct = 1;
      }
      this_p['city'] = ct;
      arr.push(this_p);
    }
    search_index.c = arr;
    search_index.loaded = true;
  }
}

function search_result(q, search_index) {
  if (!(String(q).length > 0)) {
    return [];
  }
  var res_1 = [];
  var q_u = unicode_arr(q);
  var q_u_len = q_u.length;
  var search_index_len = search_index.length;
  for (var s = 0; s < search_index_len; s++) {
    var this_s = search_index[s];
    var this_s_u = this_s.unicode;
    var res_t = false;
    for (var f = 0; f < q_u_len; f++) {
      if (this_s_u.indexOf(q_u[f]) > -1) {
        res_t = true;
        break;
      }
    }
    if (!res_t) {
      continue;
    } else {
      if (String(this_s.n).indexOf(q) > -1) {
        res_1.push(this_s);
        continue;
      } else {
        if (String(this_s.dep).indexOf(q) > -1) {
          res_1.push(this_s);
          continue;
        } else {
          if (String(this_s.des).indexOf(q) > -1) {
            res_1.push(this_s);
            continue;
          }
        }
      }
    }
  }
  return res_1;
}

function openRoute(c, i) {
  gtag('event', 'open_route', {
    event_category: c,
    event_label: i,
    event_callback: function () {
      city = c;
      routeinfo_loaded = 0;
      route_container_scrolled = 0;
      route_page_is_open = 1;
      route_dep_auto_scroll = 0;
      route_des_auto_scroll = 0;
      fade(document.querySelector('.route_container'), 'In', 'block');
      $('.route_container .tabs').attr('l', '0');
      $('.route_container .title .routename').attr('l', '0');
      switchDirection('departure');
      getStops();
      showRoute(parseInt(i));
      if (stops_json.loaded) {
        updateRealtimeJson(true);
      }
      if (refreshProgresPause === 0) {
        updateRefreshProgress();
      }
    }
  });
}

function printSearchResult(result) {
  var result_len = result.length;
  var f = [];
  var search_result_id = gid('search_result');
  for (var e = 0; e < result_len; e++) {
    var thisres = result[e];
    var htm = `<li class="search_result_r" s-id="${search_result_id}"><button onclick="openRoute(${thisres.city},${thisres.id})"><div class="search_result_r_name">${thisres.n}</div><div class="search_result_r_dep_to_des">${thisres.des} - ${thisres.dep}</div></a></li>`;
    f.push(htm);
  }
  return [f.join(''), search_result_id];
}

function update_search_result() {
  var q = $('#search_routes').val();
  var res = search_result(q, search_index.c);
  var reshtml = printSearchResult(res);
  $('.search_routes_result').html(reshtml[0]);
  ripple(document.querySelectorAll(`.search_routes_result .search_result_r[s-id="${reshtml[1]}"] button`), 'var(--g-333333)', 450);
  var font = 500 + ' ' + 18 + "px 'Noto Sans', sans-serif";
  var text_width = getTextWidth(q, font);
  $('.search').css({ '--cursor-offset': text_width + 'px' });
}

function opensearch() {
  if (search_page_is_open === 0) {
    search_page_is_open = 1;
    $('.search,.search_routes_result,.routes_keyboard').attr('p', '1');
    n_watchPosition();
  }
}

function closeopensearch() {
  if (search_page_is_open === 1) {
    search_page_is_open = 0;
    $('.search,.search_routes_result,.routes_keyboard').attr('p', '0');
  }
}


function opennetworkstats() {
  fade(document.querySelector('.network_stats_container'), 'In', 'block');
  createNetworkStatsChart();
}
function closenetworkstats() {
  fade(document.querySelector('.network_stats_container'), 'Out', 'none', function () {
    if (!(document.querySelector('.chart .chart_contents') === null)) {
      document.querySelector('.chart_contents').remove();
    }
  });
}


function setRouteSlideSize() {
  route_min_X = 0;
  route_min_Y = 95;
  route_max_X = window.innerWidth + route_min_X;
  route_max_Y = window.innerHeight - 95 + route_min_Y;
  animation_speed = (route_max_X - route_min_X) / 700;
}
function getNearestStops(lat, lon) {
  var snapshot = current_route_stops.slice(0);
  var len = snapshot.length;
  var len2 = 5;
  var res = { o_0: [], o_1: [] };
  if (len < 5) {
    len2 = 3;
  }

  if (len <= 0 || !(stops_json.loaded === true)) {
    return res;
  }

  for (var u = 0; u < len; u++) {
    var this_stop = snapshot[u];
    var lon_d, lat_d;
    if (stops_json.c.hasOwnProperty('b_' + this_stop.StopID)) {
      var s = stops_json.c['b_' + this_stop.StopID];
      lon_s = parseFloat(s.longitude);
      lat_s = parseFloat(s.latitude);
      this_stop.lon = lon_s;
      this_stop.lat = lat_s;
      this_stop.goBack_s = s.goBack;
      lon_d = Math.abs(lon_s - lon);
      lat_d = Math.abs(lat_s - lat);
    } else {
      lon_d = 0;
      lat_d = 0;
    }
    this_stop.rd = lon_d + lat_d;
  }

  snapshot = snapshot.sort(function (a, b) {
    var c = a.rd;
    var d = b.rd;
    return c - d;
  });

  for (var w = 0; w < len2; w++) {
    var this_stop = snapshot[w];
    var gb = this_stop.goBack_s;
    var distance = getDistance(this_stop.lat, this_stop.lon, lat, lon);
    this_stop.distance = distance;
    if (!res.hasOwnProperty('o_' + gb)) {
      res['o_' + gb] = [];
    }
    res['o_' + gb].push(this_stop);
  }
  return res;
}

function n_watchPosition() {
  if (watch_position_permission_requested === 0 && getOption('options_display_user_current_position')) {
    watch_position_permission_requested = 1;
    watch_position = navigator.geolocation.watchPosition(function (position) {
      pos_lat = position.coords.latitude;
      pos_lon = position.coords.longitude;
    });
  }
}

function checkSlideCoordinate(route_min, p, route_max) {
  if (p < route_min) {
    return route_min - route_min;
  }
  if (p > route_max) {
    return route_max - route_min;
  }
  return p - route_min;
}

function calcSlideScale() {
  var p1 = Math.abs(route_max_X - route_min_X) / 2;
  var f = route_x2 - route_x1;
  var s = f / p1;
  if (s < 0) {
    //route_container_s slide to right
    var w = s / (route_x1 / p1);
  }
  if (s > 0) {
    //route_container_s slide to left
    var w = s / ((route_max_X - route_min_X - route_x1) / p1);
  }
  if (w < -1) {
    w = -1;
  }
  if (w > 1) {
    w = 1;
  }
  return w;
}

function touchMove(e) {
  if (route_page_is_open === 1) {
    if (route_page_is_sliding) {
      route_x2 = checkSlideCoordinate(route_min_X, e.pageX + de.scrollLeft, route_max_X);
      route_y2 = checkSlideCoordinate(route_min_Y, e.pageY + de.scrollTop, route_max_Y);
      if (horizontal_slide && !vertical_slide) {
        var w = calcSlideScale();
        var rf = w * 1;
        var yw = route_tab_des_width * 1;
        var wy = route_tab_dep_width * 1;
        var dep_e = 0.3;
        var des_e = 0;
        var dep_color_r = 0;
        var dep_color_g = 0;
        var dep_color_b = 0;
        var des_color_r = 0;
        var des_color_g = 0;
        var des_color_b = 0;
        if (w < 0) {
          rf = w * -1;
          yw = route_tab_dep_width * 1;
          wy = route_tab_des_width * 1;
          dep_color_r = mixA(route_tab_color_888888_r, route_tab_color_333333_r, Math.abs(w));
          dep_color_g = mixA(route_tab_color_888888_g, route_tab_color_333333_g, Math.abs(w));
          dep_color_b = mixA(route_tab_color_888888_b, route_tab_color_333333_b, Math.abs(w));
          des_color_r = mixA(route_tab_color_333333_r, route_tab_color_888888_r, Math.abs(w));
          des_color_g = mixA(route_tab_color_333333_g, route_tab_color_888888_g, Math.abs(w));
          des_color_b = mixA(route_tab_color_333333_b, route_tab_color_888888_b, Math.abs(w));
          dep_e = 0.3 * (1 - Math.abs(w));
          des_e = 0.3 * Math.abs(w);
        } else {
          rf = 1 - w;
          yw = route_tab_des_width * 1;
          wy = route_tab_dep_width * 1;
          des_color_r = mixA(route_tab_color_888888_r, route_tab_color_333333_r, Math.abs(w));
          des_color_g = mixA(route_tab_color_888888_g, route_tab_color_333333_g, Math.abs(w));
          des_color_b = mixA(route_tab_color_888888_b, route_tab_color_333333_b, Math.abs(w));
          dep_color_r = mixA(route_tab_color_333333_r, route_tab_color_888888_r, Math.abs(w));
          dep_color_g = mixA(route_tab_color_333333_g, route_tab_color_888888_g, Math.abs(w));
          dep_color_b = mixA(route_tab_color_333333_b, route_tab_color_888888_b, Math.abs(w));
          dep_e = 0.3 * Math.abs(w);
          des_e = 0.3 * (1 - Math.abs(w));
        }
        $('.routes')
          .css({ '--j-translateX-p': `${route_max_X * w + offsetX}px` })
          .attr('slide', '1');
        $('.tab-line-box2')
          .css({ '--j-slide-scale-rf-p': `${rf * 100}%`, '--j-slide-scale-yu-p': `${yw + (wy - yw) * Math.abs(w)}px` })
          .attr('slide', '1');
        $('.tabs').attr('slide', '1');
        $('.tabs .tab[direction="departure"]').css({ '--j-slide-scale-c-p': `rgba(${dep_color_r},${dep_color_g},${dep_color_b},1)`, '--j-slide-scale-ts-p': dep_e + 'px' });
        $('.tabs .tab[direction="destination"]').css({ '--j-slide-scale-c-p': `rgba(${des_color_r},${des_color_g},${des_color_b},1)`, '--j-slide-scale-ts-p': des_e + 'px' });
      } else {
        var a = Math.abs((Math.atan((route_y2 - route_y1) / (route_x2 - route_x1)) * 180) / Math.PI);
        if (a <= 30) {
          horizontal_slide = true;
        } else {
          vertical_slide = true;
        }
      }
    }
  } else {
    route_page_is_sliding = false;
  }
}

function mixA(a, b, l) {
  return Math.floor(a * l + b * (1 - l));
}


function formatDataSize(sizeInKB) {
  const units = ['KB', 'MB', 'GB', 'TB'];
  let formattedSize = sizeInKB;
  let unitIndex = 0;

  while (formattedSize > 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }

  return `${formattedSize.toFixed(1)}${units[unitIndex]}`;
}
var network_stats_datas_json = {};
function createNetworkStatsChart() {
  network_stats_datas_json = {};
  var original_datas = [];
  var labels = [];
  var values = [];
  var keys = [];

  var stats_datas = searchItemsbyname('bus_network_stats_');
  for (var o = 0; o < stats_datas.length; o++) {
    if (LS.hasOwnProperty(stats_datas[o])) {
      var data = parseFloat(String(LS.getItem(stats_datas[o])));
      var date = String(stats_datas[o]).replaceAll('bus_network_stats_', '').split('_');
      date = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]), 0, 0, 0);
      var j = { d: date, v: data, k: stats_datas[o] };
      original_datas.push(j);
      network_stats_datas_json[o] = j;
    }
  }
  original_datas = original_datas.sort(function (a, b) {
    return a.d.getTime() - b.d.getTime();
  });

  for (var o = 0; o < original_datas.length; o++) {
    labels.push(`${original_datas[o].d.getMonth() + 1}/${original_datas[o].d.getDate()}`);
    values.push(original_datas[o].v);
    keys.push(original_datas[o].k);
  }
  var manufactureBars = function (labels, values, max, min) {
    var html = [];
    var identifies = [];
    var ripple_selectors = [];
    var data_length = labels.length; // labels.length === values.length

    for (var f = 0; f < data_length; f++) {
      var bar_id = gid('chart-bar');
      var bar_html = `<div class="chart_bar" original-value="${values[f]}" id="${bar_id}" onclick="displaySpecificDayNetworkStats('${bar_id}','${keys[f]}')"><div class="block" style="--chart-bar-height:${values[f] / max};"></div><div class="label">${labels[f]}</div></div>`;
      html.push(bar_html);
      identifies.push('#' + bar_id);
      ripple_selectors.push('#' + bar_id + ' .block');
    }
    return [html.join(''), ripple_selectors];
  };
  if (!(document.querySelector('.chart .chart_contents') === null)) {
    document.querySelector('.chart_contents').remove();
  }
  var chart_contents_html = manufactureBars(labels, values, Math.max(...values));
  var chart_contents = document.createElement('div');
  chart_contents.classList.add('chart_contents');
  chart_contents.style.setProperty('--chart-datas-length', chart_contents_html[1].length);
  chart_contents.innerHTML = chart_contents_html[0];
  document.querySelector('.chart').appendChild(chart_contents);
  var ripple_selectors = chart_contents_html[1];
  ripple(document.querySelectorAll(ripple_selectors.join(',')), 'var(--g-14b1ff)', 450);
}
function displaySpecificDayNetworkStats(element_id, data_key) {
  var element = $('#' + element_id);
  var select = String(element.attr('select'));
  var allBars = $('.chart .chart_contents .chart_bar');
  var chart_contents = $('.chart_contents');
  allBars.attr('select', '0');
  if (select === '1') {
    element.attr('select', '0');
    chart_contents.attr('select', '0');
  } else {
    element.attr('select', '1');
    chart_contents.attr('select', '1');
  }
}

function set_favorite_route_status() {
  var lk = `bus_favorite_route_${c_route_local_key}`;
  var json = {};
  if (LS.hasOwnProperty(lk)) {
    json = JSON.parse(String(LS.getItem(lk)));
    if (json.local_key === c_route_local_key && !(c_route_name === json.n)) {
      prompt_message('發生錯誤');
      sendPotentialError('set_favorite_route_status_local_key_repeat');
    } else {
      LS.removeItem(lk);
      prompt_message('已取消收藏路線');
    }
  } else {
    json = { local_key: c_route_local_key, n: c_route_name, t: new Date().getTime() };
    LS.setItem(lk, JSON.stringify(json));
    prompt_message('已收藏路線');
  }
}

function action_status(m) {
  var e = document.querySelectorAll('.action[m="' + m + '"]')[0];
  var s = e.getAttribute('status');
  if (s === '0') {
    e.setAttribute('status', '1');
  } else {
    e.setAttribute('status', '0');
  }
}

function composeFavoriteBlock() {
  var list_k = searchItemsbyname('bus_favorite_route');
  var list_k_len = list_k.length;
  var list = [];
  var html = [];
  var identifies = [];
  for (var e = 0; e < list_k_len; e++) {
    var j = JSON.parse(String(LS.getItem(list_k[e])));
    list.push(j);
  }
  list.sort(function (a, b) {
    return b.t - a.t;
  });
  for (var e = 0; e < list_k_len; e++) {
    var j = list[e];
    var name = j.n;
    var res = search_result(name, search_index.c);
    res = res.length > 0 ? res[0] : false;
    if (!res) {
      continue;
    }
    var id = gid('pb');
    var h = `<div class="personal_block_favorite_route" onclick="openRoute(${res.city},${res.id})" id="${id}"><div class="personal_block_favorite_route_name">${res.n}</div><div class="personal_block_favorite_route_dep_to_des">${res.des} - ${res.dep}</div></div>`;
    html.push(h);
    identifies.push(id);
  }
  return [`${html.join('')}`, '#' + identifies.join(',#')];
}

function initializePersonalBlocks() {
  if (personal_blocks_initialized === 0) {
    personal_blocks_initialized = 1;
    var container = document.querySelector('.personal_blocks');
    var b_favorite = composeFavoriteBlock();
    var b_favorite_html = b_favorite[0];
    var b_favorite_elt = document.createElement('div');
    b_favorite_elt.classList.add('personal_block');
    b_favorite_elt.innerHTML = `<div class="personal_block_title">收藏的路線</div><div class="personal_block_contents">${b_favorite_html}</div>`;
    container.appendChild(b_favorite_elt);
    var b_favorite_selector = document.querySelectorAll(b_favorite[1]);
    ripple(b_favorite_selector, 'var(--g-333333)', 450);
  }
}

/* initialize */

$('.bus_info_box').scroll(function () {
  var scrolltop = $('.bus_info_box').scrollTop();
  if ($('.bus_info').offset().top < 0) {
    if (businfo_scroll_1 === 0) {
      $('.bus_info_title').attr('sticky', '1');
      standaloneStatusBarColor(0);
      businfo_scroll_1 = 1;
    }
  } else {
    if (businfo_scroll_1 === 1) {
      $('.bus_info_title').attr('sticky', '0');
      standaloneStatusBarColor(1);
      businfo_scroll_1 = 0;
    }
  }
  if (scrolltop < 5) {
    if (businfo_scroll === 0) {
      closeBus();
      businfo_scroll = 1;
    }
  }
});
$('.bus_info_box').click(function (e) {
  e.stopPropagation();
  if (businfo_scroll === 0) {
    closeBus();
    businfo_scroll = 1;
  }
});
$('.bus_info').click(function (e) {
  e.stopPropagation();
});
$('.route_info_box').scroll(function () {
  var scrolltop = $('.route_info_box').scrollTop();

  if ($('.route_info').offset().top < 0) {
    if (routeinfo_scroll_1 === 0) {
      $('.route_info_title').attr('sticky', '1');
      standaloneStatusBarColor(0);
      routeinfo_scroll_1 = 1;
    }
  } else {
    if (routeinfo_scroll_1 === 1) {
      $('.route_info_title').attr('sticky', '0');
      standaloneStatusBarColor(1);
      routeinfo_scroll_1 = 0;
    }
  }
  if (scrolltop < 5) {
    if (routeinfo_scroll === 0) {
      closeRouteInfo();
      routeinfo_scroll = 1;
    }
  }
});
$('.route_info_box').click(function (e) {
  e.stopPropagation();
  if (routeinfo_scroll === 0) {
    closeRouteInfo();
    routeinfo_scroll = 1;
  }
});

$('.route_info').click(function (e) {
  e.stopPropagation();
});

$('#search_routes').click(function (e) {
  e.stopPropagation();
  if (!($('.search').attr('p') === '1')) {
    var n = new Date().getTime();
    opensearch();
  }
});

$(window).resize(function () {
  setRouteSlideSize();
});

document.querySelector('#search_routes').addEventListener('paste', function (e) {
  if (search_page_is_open === 1) {
    update_search_result();
  }
});
document.querySelector('#search_routes').addEventListener('cut', function (e) {
  if (search_page_is_open === 1) {
    update_search_result();
  }
});
document.querySelector('#search_routes').addEventListener('selectionchange', function (e) {
  if (search_page_is_open === 1) {
    update_search_result();
  }
});
document.addEventListener('selectionchange', function (e) {
  if (search_page_is_open === 1) {
    update_search_result();
  }
});
document.querySelector('#search_routes').addEventListener('keyup', function (e) {
  if (search_page_is_open === 1) {
    update_search_result();
  }
});

document.querySelector('.routes').addEventListener(
  'touchstart',
  function (e) {
    if (route_page_is_open === 1) {
      route_page_is_sliding = true;
      horizontal_slide = false;
      vertical_slide = false;
      route_x1 = checkSlideCoordinate(route_min_X, e.pageX + de.scrollLeft, route_max_X);
      route_y1 = checkSlideCoordinate(route_min_Y, e.pageY + de.scrollTop, route_max_Y);
      start_offsetX = offsetX;
      route_tab_color_333333_r = parseInt(getComputedStyle(de).getPropertyValue('--g-333333-r'));
      route_tab_color_333333_g = parseInt(getComputedStyle(de).getPropertyValue('--g-333333-g'));
      route_tab_color_333333_b = parseInt(getComputedStyle(de).getPropertyValue('--g-333333-b'));
      route_tab_color_888888_r = parseInt(getComputedStyle(de).getPropertyValue('--g-888888-r'));
      route_tab_color_888888_g = parseInt(getComputedStyle(de).getPropertyValue('--g-888888-g'));
      route_tab_color_888888_b = parseInt(getComputedStyle(de).getPropertyValue('--g-888888-b'));
      document.querySelector('.routes').addEventListener('touchmove', touchMove, { passive: false });
    }
  },
  { passive: false }
);

document.querySelector('.routes').addEventListener(
  'touchend',
  function (e) {
    route_page_is_sliding = false;
    if (route_page_is_open === 1) {
      if (horizontal_slide && !vertical_slide) {
        var w = calcSlideScale();
        var d = (1 - Math.abs(calcSlideScale())) * (route_max_X - route_min_X);
        var q = (1 + calcSlideScale()) / 2;
        var direction = route_direction;
        if (w < -0.35 || w > 0.35) {
          if (w < -0.35) {
            w = -1;
            offsetX = (route_max_X - route_min_X) * -1;
            direction = 'destination';
          }
          if (w > 0.35) {
            w = 0;
            offsetX = (route_max_X - route_min_X) * 0;
            direction = 'departure';
          }
          $('.routes').css({ '--j-translateX-p': `${(route_max_X - route_min_X) * w}px)` });
        } else {
          $('.routes').css({ '--j-translateX-p': `${start_offsetX}px)` });
        }
        $('.routes,.tab-line-box2,.tabs')
          .attr('slide', '0')
          .css({ '--j-transition-p': `transform ${d / animation_speed}ms`, '--j-transition-w-p': `width ${d / animation_speed}ms`, '--j-transition-a-p': `all ${d / animation_speed}ms` });
        switchDirection(direction, e);
        horizontal_slide = false;
        vertical_slide = false;
      }
      document.querySelector('.routes').addEventListener('touchmove', touchMove);
    }
  },
  { passive: false }
);

ripple(document.querySelectorAll('.tabs .tab,.back_btn,.search_back_btn,.route_container .title .info_btn,.options_btn'), 'var(--g-333333)', 450);
ripple(document.querySelectorAll('.options_content label.options_switch'), 'var(--g-14b1ff)', 450);
ripple(document.querySelectorAll('.route_info_box .actions .action'), 'var(--action-theme)', 450);
ifvisible.idle(function () {
  update_status = 3;
});

ifvisible.wakeup(function () {
  update_status = 0;
  updateRealtimeJson(true);
});

initializeAllOptions();
initializeKeyboard();
setRouteSlideSize();
getRoutes(false);
checkVersion();


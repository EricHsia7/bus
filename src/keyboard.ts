function initializeKeyboard() {
  var htm = [];
  var row_len = routes_keyboard_keys.length;
  for (var o = 0; o < row_len; o++) {
    var this_row = routes_keyboard_keys[o];
    var this_row_len = this_row.length;
    for (var w = 0; w < this_row_len; w++) {
      var this_key = this_row[w];
      var onclick = "keyboard_add('" + this_key + "')";
      if (this_key === '刪除') {
        onclick = 'keyboard_delete()';
      }
      if (this_key === '清空') {
        onclick = 'keyboard_clear()';
      }
      var onclick_event = 'onmousedown';
      if (supportTouch()) {
        onclick_event = 'ontouchstart';
      }
      htm.push(`<button class="routes_keyboard_key" ${onclick_event}="${onclick}"><div class="routes_keyboard_key_block">${this_key}</div></button>`);
    }
  }
  $('.routes_keyboard').html(htm.join(''));
  ripple(document.querySelectorAll('.routes_keyboard .routes_keyboard_key .routes_keyboard_key_block'), 'var(--g-333333)', 450);
}

function keyboard_add(k) {
  var v = $('#search_routes').val();
  v += k;
  $('#search_routes').val(v);
  if (search_page_is_open === 1) {
    update_search_result();
  }
}

function keyboard_delete() {
  var v = $('#search_routes').val();
  v = v.substring(0, v.length - 1);
  $('#search_routes').val(v);
  if (search_page_is_open === 1) {
    update_search_result();
  }
}

function keyboard_clear() {
  $('#search_routes').val('');
  if (search_page_is_open === 1) {
    update_search_result();
  }
}
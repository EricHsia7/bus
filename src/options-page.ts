function openoptions() {
  fade(document.querySelector('.options_container'), 'In', 'block');
  if (options_pulled === 0) {
    options_pulled = 1;
    pullOptionsFromLS();
  }
}
function closeoptions() {
  fade(document.querySelector('.options_container'), 'Out', 'none');
}

function saveOptions() {
  var options = $('.options_container input[type="checkbox"]');
  var options_len = options.length;
  for (var h = 0; h < options_len; h++) {
    var checked = options.eq(h).prop('checked');
    LS.setItem('bus_opt_' + options.eq(h).attr('name'), checked);
  }
  prompt_message('已儲存變更');
  initializeAllOptions();
}

function pullOptionsFromLS() {
  var options_element = $('.options_container input[type="checkbox"]');
  var options_element_len = options_element.length;

  for (var h = 0; h < options_element_len; h++) {
    var checked = LS.getItem('bus_opt_' + options_element.eq(h).attr('name'));
    if (isNaN(parseFloat(checked))) {
      if (checked === 'true') {
        checked = true;
      } else {
        if (checked === 'false') {
          checked = false;
        }
      }
    }
    options_element.eq(h).prop('checked', checked);
  }
}

function getOption(name) {
  return options[name];
}

function initializeAllOptions() {
  var initializeOption = function (name) {
    var key = 'bus_opt_' + name;
    var option = false;
    if (options_list.indexOf(name) > -1) {
      if (options.hasOwnProperty(name)) {
        option = options[name];
        if (LS.hasOwnProperty(key)) {
          option = String(LS.getItem(key));
          if (isNaN(parseFloat(option))) {
            if (option === 'true') {
              option = true;
            }
            if (option === 'false') {
              option = false;
            }
          } else {
            option = parseFloat(option);
          }
        } else {
          LS.setItem(key, option);
        }
        options[name] = option;
      }
    }
  };
  var list_len = options_list.length;
  for (var i = 0; i < list_len; i++) {
    initializeOption(options_list[i]);
  }
}
function refreshPage() {
  var current_url = new URL(location.href);
  current_url.searchParams.set('v', String(LS.getItem('bus_version')));
  location.replace(current_url.toString());
}
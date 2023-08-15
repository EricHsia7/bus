export function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches;
}

export function supportTouch() {
  if ('ontouchstart' in document.documentElement) {
    return true;
  } else {
    return false;
  }
}

export function gid(n) {
  var genidchars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
  var genid = '';
  for (var i = 0; i < 16; i++) {
    var genrandomNumber = Math.floor(Math.random() * genidchars.length);
    genid += genidchars.substring(genrandomNumber, genrandomNumber + 1);
  }
  var time = parseInt(new Date().getTime());
  var time_str = time.toString(36);
  if (!(n === undefined)) {
    n = n.replaceAll('_', '-');
    return n + '-' + genid + '-' + time_str;
  }
  return 'id-' + genid + '-' + time_str;
}

export function searchItemsbyname(name) {
  var gh = [];
  for (var t in LS) {
    if (String(t).indexOf(name) > -1) {
      gh.push(t);
    }
  }
  return gh;
}
export function api_url_parameter(cahce_time) {
  var t = new Date().getTime();
  var g = (t / cahce_time).toFixed(0) * cahce_time;
  var str = g.toString(36);
  return str;
}
export function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6378.137;
  var dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  var dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d * 1000;
}

export function rgb2hex(a, r, t) {
  var c2h = function (a) {
    var r = a.toString(16);
    return 1 == r.length ? '0' + r : r;
  };
  return '#' + c2h(a) + c2h(r) + c2h(t);
}

export function hex2rgb(a) {
  var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
  return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
}

export function rgb2hsv(a, r, t) {
  let o, h, n, M, e, s, u, m, d, f, l, c;
  return (
    (o = a / 255),
    (h = r / 255),
    (n = t / 255),
    (d = Math.max(o, h, n)),
    (l = (a) => (d - a) / 6 / f + 0.5),
    (c = (a) => Math.round(100 * a) / 100),
    0 == (f = d - Math.min(o, h, n)) ? (u = m = 0) : ((m = f / d), (M = l(o)), (e = l(h)), (s = l(n)), o === d ? (u = s - e) : h === d ? (u = 1 / 3 + M - s) : n === d && (u = 2 / 3 + e - M), u < 0 ? (u += 1) : u > 1 && (u -= 1)),
    {
      h: Math.round(360 * u),
      s: c(100 * m),
      v: c(100 * d)
    }
  );
}

export function hsv2rgb(a, r, t) {
  var o, h, n, M, e, s, u, m;
  if (((a = Math.max(0, Math.min(360, a))), (r = Math.max(0, Math.min(100, r))), (t = Math.max(0, Math.min(100, t))), (t /= 100), 0 == (r /= 100))) return (o = h = n = t), [Math.round(255 * o), Math.round(255 * h), Math.round(255 * n)];
  switch (((s = t * (1 - r)), (u = t * (1 - r * (e = (a /= 60) - (M = fl(a))))), (m = t * (1 - r * (1 - e))), M)) {
    case 0:
      (o = t), (h = m), (n = s);
      break;
    case 1:
      (o = u), (h = t), (n = s);
      break;
    case 2:
      (o = s), (h = t), (n = m);
      break;
    case 3:
      (o = s), (h = u), (n = t);
      break;
    case 4:
      (o = m), (h = s), (n = t);
      break;
    default:
      (o = t), (h = s), (n = u);
  }
  return [Math.round(255 * o), Math.round(255 * h), Math.round(255 * n)];
}
export function fl(n) {
  return Math.floor(n);
}
export function rd() {
  return Math.random();
}
export function similarColor(hex, similarity) {
  var source_color_rgb = hex2rgb(hex);
  var source_color_hsv = rgb2hsv(source_color_rgb.r, source_color_rgb.g, source_color_rgb.b);
  var color_a_h,
    color_a_s,
    color_a_v = 0;
  var color_b_h,
    color_b_s,
    color_b_v = 0;
  if (source_color_hsv.h < similarity) {
    color_a_h = source_color_hsv.h + fl(rd() * similarity);
    color_b_h = source_color_hsv.h + fl(rd() * similarity);
  }
  if (source_color_hsv.h > similarity && source_color_hsv.h < 360 - similarity) {
    color_a_h = source_color_hsv.h + fl(0 - similarity + rd() * (similarity * 2));
    color_b_h = source_color_hsv.h + fl(0 - similarity + rd() * (similarity * 2));
  }
  if (source_color_hsv.h > 360 - similarity) {
    color_a_h = source_color_hsv.h - fl(rd() * similarity);
    color_b_h = source_color_hsv.h - fl(rd() * similarity);
  }
  if (source_color_hsv.s < similarity) {
    color_a_s = source_color_hsv.s + fl(rd() * similarity);
    color_b_s = source_color_hsv.s + fl(rd() * similarity);
  }
  if (source_color_hsv.s > similarity && source_color_hsv.s < 100 - similarity) {
    color_a_s = source_color_hsv.s + fl(0 - similarity + rd() * (similarity * 2));
    color_b_s = source_color_hsv.s + fl(0 - similarity + rd() * (similarity * 2));
  }
  if (source_color_hsv.s > 100 - similarity) {
    color_a_s = source_color_hsv.s - fl(rd() * similarity);
    color_b_s = source_color_hsv.s - fl(rd() * similarity);
  }

  if (source_color_hsv.v < similarity) {
    color_a_v = source_color_hsv.v + fl(rd() * similarity);
    color_b_v = source_color_hsv.v + fl(rd() * similarity);
  }
  if (source_color_hsv.v > similarity && source_color_hsv.v < 100 - similarity) {
    color_a_v = source_color_hsv.v + fl(0 - similarity + rd() * (similarity * 2));
    color_b_v = source_color_hsv.v + fl(0 - similarity + rd() * (similarity * 2));
  }
  if (source_color_hsv.v > 100 - similarity) {
    color_a_v = source_color_hsv.v - fl(rd() * similarity);
    color_b_v = source_color_hsv.v - fl(rd() * similarity);
  }
  var color_a_rgb = hsv2rgb(color_a_h, color_a_s, color_a_v);
  var color_b_rgb = hsv2rgb(color_b_h, color_b_s, color_b_v);

  var color_a_hex = rgb2hex(color_a_rgb[0], color_a_rgb[1], color_a_rgb[2]);
  var color_b_hex = rgb2hex(color_b_rgb[0], color_b_rgb[1], color_b_rgb[2]);
  return [color_a_hex, color_b_hex];
}

export function colorScale(hex, amount, similarity) {
  var amount_n = amount;
  if (amount <= 0) {
    amount_n = 2;
  }
  if (!(amount % 2 === 0)) {
    amount_n = amount + 1;
  }
  var l = amount_n / 2;
  var list = [];
  for (var i = 0; i < l; i++) {
    var source_color;
    if (i === 0) {
      source_color = hex;
    } else {
      source_color = list[fl((list.length - 1) * rd())];
    }
    list = list.concat(similarColor(source_color, similarity));
  }
  if (amount_n - amount > 0) {
    list = list.slice(0, amount);
  }
  list = list.sort(function (a, b) {
    var a_rgb = hex2rgb(a);
    var b_rgb = hex2rgb(b);
    var a_hsv = rgb2hsv(a_rgb.r, a_rgb.g, a_rgb.b);
    var b_hsv = rgb2hsv(b_rgb.r, b_rgb.g, b_rgb.b);

    return a_hsv.h - b_hsv.h;
  });
  return list;
}

export function textcol(r, g, b) {
  var textcolrgbfy = r * 0.299 + g * 0.587 + b * 0.114;
  if (textcolrgbfy > 186) {
    return '#000000';
  } else {
    return '#ffffff';
  }
}

export function setUpDynamicColor() {
  var colorC = [];
  var c = colorScale('#14b1ff', 10, 15);
  for (var o = 0; o < c.length; o++) {
    colorC.push(`${c[o]} ${100 * (o / (c.length - 1))}%`);
  }
  var bg = `linear-gradient(${45}deg, ${colorC.join(',')})`;
  var css = `:root {--dynamic-color-s1:${bg};}`;
  document.querySelector('#dynamic-color').innerHTML = css;
}

function checkVersion() {
  if (getOption('options_automatic_refresh')) {
    var version_identification_feed_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFLTdqR4_v6EtiuDBtVqsvErHwfhJ0oVd9jSZn-3ByKTzkM31DXZiTYG2Jw5RK8HBu5T5_PGoPyk8I/pub?gid=0&single=true&output=csv';
    $.ajax({
      type: 'GET',
      url: version_identification_feed_url + '&_=' + api_url_parameter(5000),
      async: true,
      cache: true,
      xhrFields: { responseType: 'text' },
      success: function (data) {
        data = data.trim();
        if (LS.hasOwnProperty('bus_version')) {
          if (!(String(LS.getItem('bus_version')) === data)) {
            refreshPage();
          }
        }
        LS.setItem('bus_version', data);
      }
    });
  }
}
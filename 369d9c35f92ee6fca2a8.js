!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("bus",[],n):"object"==typeof exports?exports.bus=n():t.bus=n()}(self,(()=>(()=>{"use strict";var t={};function n(t,n){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=e(t))||n&&t&&"number"==typeof t.length){r&&(t=r);var o=0,a=function(){};return{s:a,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,i=!0,l=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){l=!0,c=t},f:function(){try{i||null==r.return||r.return()}finally{if(l)throw c}}}}function r(t,n){return function(t){if(Array.isArray(t))return t}(t)||function(t,n){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var e,o,a,c,i=[],l=!0,s=!1;try{if(a=(r=r.call(t)).next,0===n){if(Object(r)!==r)return;l=!1}else for(;!(l=(e=a.call(r)).done)&&(i.push(e.value),i.length!==n);l=!0);}catch(t){s=!0,o=t}finally{try{if(!l&&null!=r.return&&(c=r.return(),Object(c)!==c))return}finally{if(s)throw o}}return i}}(t,n)||e(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t,n){if(t){if("string"==typeof t)return o(t,n);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,n):void 0}}function o(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=Array(n);r<n;r++)e[r]=t[r];return e}var a=[],c=!1;if("onconnect"in self)self.onconnect=function(t){var n=t.ports[0];n.onmessage=function(t){var e=r(t.data,5),o=e[0],c=e[1],i=e[2],s=e[3],u=e[4];a.push({personalSchedules:o,busArrivalTimeDataGroups:c,chartWidth:i,chartHeight:s,taskID:u,port:n}),l()}};else{var i=self;self.onmessage=function(t){var n=r(t.data,5),e=n[0],o=n[1],c=n[2],s=n[3],u=n[4];a.push({personalSchedules:e,busArrivalTimeDataGroups:o,chartWidth:c,chartHeight:s,taskID:u,port:i}),l()}}function l(){if(!c&&0!==a.length){c=!0;var t,r=a.shift(),e=r.personalSchedules,o=r.busArrivalTimeDataGroups,i=r.chartWidth,s=r.chartHeight,u=r.taskID,f=r.port,d={},h=n(e);try{for(h.s();!(t=h.n()).done;){var p,v=t.value,y=60*v.period.start.hours+v.period.start.minutes,m=60*v.period.end.hours+v.period.end.minutes,b=i/(m-y),g=n(o);try{for(g.s();!(p=g.n()).done;){var w=p.value;if(!(v.days.indexOf(w.day)<0)){var S=w.max,A=w.stats.slice(y,m),x=A.length,j="",I=0;I=x/30<=3?10:30;for(var k=Math.floor(x/I),D=i/k,M=k-1;M>=0;M--)j+=" M".concat(M*D,",0"),j+=" L".concat(M*D,",").concat(s);var L='<path d="'.concat(j,'" fill="none" stroke-width="0.35" component="vertical-gridline"/>'),O="M0,".concat(s," L").concat(i,",").concat(s),T='<path d="'.concat(O,'" fill="none" stroke-width="0.35" component="bottom-line"/>'),G="";G+="M".concat(i,",").concat(s);for(var H=x-1;H>=0;H--){var W=(H+1)/x*i,E=(1-A[H]/S)*s;G+=" L".concat(W,",").concat(E),G+=" L".concat(W-b,",").concat(E),G+=" L".concat(W-b,",").concat(s)}var B='<path d="'.concat(G+=" Z",'" stroke="none" stroke-width="0" component="bars"/>'),C='<svg width="'.concat(i,'" height="').concat(s,'" viewBox="0 0 ').concat(i," ").concat(s,'" xmlns="http://www.w3.org/2000/svg">').concat(L).concat(T).concat(B,"</svg>"),P="s_".concat(w.id);d.hasOwnProperty(P)||(d[P]=[]),d[P].push({personalSchedule:v,chart:C,day:w.day})}}}catch(t){g.e(t)}finally{g.f()}}}catch(t){h.e(t)}finally{h.f()}f.postMessage([d,u]),c=!1,l()}}return t=t.default})()));
//# sourceMappingURL=369d9c35f92ee6fca2a8.js.map
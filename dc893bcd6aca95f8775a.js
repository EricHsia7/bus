!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("bus",[],r):"object"==typeof exports?exports.bus=r():t.bus=r()}(self,(()=>(()=>{"use strict";var t={};function r(t,r){if(t){if("string"==typeof t)return e(t,r);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,r):void 0}}function e(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}function n(t){var e=Math.hypot(t),n=[];if(e>0){var o,a=1/e,u=function(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=r(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var o=0,a=function(){};return{s:a,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var u,i=!0,f=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return i=t.done,t},e:function(t){f=!0,u=t},f:function(){try{i||null==n.return||n.return()}finally{if(f)throw u}}}}(t);try{for(u.s();!(o=u.n()).done;){var i=o.value;n.push(i*a)}}catch(t){u.e(t)}finally{u.f()}return n}return t}function o(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,r){if(t){if("string"==typeof t)return a(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?a(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var u,i=!0,f=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){f=!0,u=t},f:function(){try{i||null==e.return||e.return()}finally{if(f)throw u}}}}function a(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}return self.onmessage=function(t){var r=function(t){var r,e={},a=o(t);try{for(a.s();!(r=a.n()).done;){var u=r.value,i=u.routeId,f="r_".concat(i);e.hasOwnProperty(f)||(e[f]=[]),e[f].push(u)}}catch(t){a.e(t)}finally{a.f()}for(var l in e)e[l]=e[l].sort((function(t,r){return t.seqNo-r.seqNo}));var s,c={},d=o(t);try{for(d.s();!(s=d.n()).done;){for(var y=s.value,p=[0,0],v=e["r_".concat(y.routeId)],h=v.length,m=null,b=0;b<h;b++)if(v[b].Id===y.Id){var g=0;b<h-1&&(g=b+1),m=v[g]}if(m)p=n([parseFloat(m.longitude)-parseFloat(y.longitude),parseFloat(m.latitude)-parseFloat(y.latitude)]);var I="l_".concat(y.stopLocationId);if(c.hasOwnProperty(I))c[I].r.indexOf(y.routeId)>-1||c[I].r.push(y.routeId),c[I].s.indexOf(y.Id)>-1||(c[I].s.push(y.Id),c[I].v.push(p)),c[I].a.push(y.address);else{var A={};A.n=y.nameZh,A.lo=parseFloat(y.longitude),A.la=parseFloat(y.latitude),A.r=[y.routeId],A.s=[y.Id],A.v=[p],A.a=[y.address],c[I]=A}}}catch(t){d.e(t)}finally{d.f()}return c}(t.data);self.postMessage(r)},t=t.default})()));
//# sourceMappingURL=dc893bcd6aca95f8775a.js.map
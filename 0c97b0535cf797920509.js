!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("bus",[],r):"object"==typeof exports?exports.bus=r():t.bus=r()}(self,(()=>(()=>{var t={};function r(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,r){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var n,o,a,i,u=[],l=!0,f=!1;try{if(a=(e=e.call(t)).next,0===r){if(Object(e)!==e)return;l=!1}else for(;!(l=(n=a.call(e)).done)&&(u.push(n.value),u.length!==r);l=!0);}catch(t){f=!0,o=t}finally{try{if(!l&&null!=e.return&&(i=e.return(),Object(i)!==i))return}finally{if(f)throw o}}return u}}(t,r)||e(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t,r){if(t){if("string"==typeof t)return n(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?n(t,r):void 0}}function n(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}var o=[],a=!1;if("onconnect"in self)self.onconnect=function(t){var e=t.ports[0];e.onmessage=function(t){var n=r(t.data,2),a=n[0],i=n[1];o.push({dataGroups:a,taskID:i,port:e}),u()}};else{var i=self;self.onmessage=function(t){var e=r(t.data,2),n=e[0],a=e[1];o.push({dataGroups:n,taskID:a,port:i}),u()}}function u(){if(!a&&0!==o.length){a=!0;var t,r,n=o.shift(),i=n.dataGroups,l=n.taskID,f=n.port,s=0,c=0,y=function(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=e(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var o=0,a=function(){};return{s:a,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,l=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){l=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(l)throw i}}}}(i);try{for(y.s();!(r=y.n()).done;){var d=r.value;(d.stats.correlation<-.2||d.stats>.2)&&(s+=d.stats.correlation*d.stats.length,c+=d.stats.length)}}catch(t){y.e(t)}finally{y.f()}t=s/c;var p=isNaN(t)?.8:Math.abs(t);f.postMessage([p,l]),a=!1,u()}}return t=t.default})()));
//# sourceMappingURL=0c97b0535cf797920509.js.map
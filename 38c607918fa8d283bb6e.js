!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("bus",[],t):"object"==typeof exports?exports.bus=t():e.bus=t()}(self,(()=>(()=>{"use strict";var e={r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function r(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var o=0,a=function(){};return{s:a,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,f=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return u=e.done,e},e:function(e){f=!0,i=e},f:function(){try{u||null==r.return||r.return()}finally{if(f)throw i}}}}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}return e.r(t),self.onmessage=function(e){var t=function(e){var t,n={},o=r(e);try{for(o.s();!(t=o.n()).done;){var a=t.value,i={};i.pd=a.providerId,i.n=a.nameZh,i.pid=[a.pathAttributeId],i.dep=a.departureZh,i.des=a.destinationZh,i.id=a.Id;var u="r_".concat(a.Id);n.hasOwnProperty(u)?n[u].pid.push(a.pathAttributeId):n[u]=i}}catch(e){o.e(e)}finally{o.f()}return n}(e.data);self.postMessage(t)},t=t.default})()));
//# sourceMappingURL=38c607918fa8d283bb6e.js.map
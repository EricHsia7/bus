!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("bus",[],t):"object"==typeof exports?exports.bus=t():e.bus=t()}(self,(()=>(()=>{"use strict";var e={r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function n(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var o=0,a=function(){};return{s:a,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,f=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return u=e.done,e},e:function(e){f=!0,i=e},f:function(){try{u||null==n.return||n.return()}finally{if(f)throw i}}}}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}return e.r(t),self.onmessage=function(e){var t=function(e){var t,r={},o=n(e);try{for(o.s();!(t=o.n()).done;){var a=t.value,i="s_".concat(a.Id),u={};u.seqNo=a.seqNo,u.goBack=a.goBack,u.stopLocationId=a.stopLocationId,r[i]=u}}catch(e){o.e(e)}finally{o.f()}return r}(e.data);self.postMessage(t)},t=t.default})()));
//# sourceMappingURL=8f1798ccd3ee5b695f1c.js.map
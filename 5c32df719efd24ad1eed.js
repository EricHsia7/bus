!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("bus",[],t):"object"==typeof exports?exports.bus=t():e.bus=t()}(self,(()=>(()=>{"use strict";var e={r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function n(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var o=0,a=function(){};return{s:a,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,s=!0,i=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){i=!0,f=e},f:function(){try{s||null==n.return||n.return()}finally{if(i)throw f}}}}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}return e.r(t),self.onmessage=function(e){var t=function(e){var t,r,o=/^\s*<([a-z_]*)>/im,a=/^\s*<\/([a-z_]*)>/im,f=/^\s*<([a-z_]*)>([^<>]*)<\/([a-z_]*)>/im,s=e.split(/\n/m),i=[],u="",l=n(s);try{for(l.s();!(r=l.n()).done;){var c=r.value,h=o.test(c),p=a.test(c),g=f.test(c);if(h&&!g&&!p)switch(u=c.match(o)[1],t=null,u){case"RouteFare":i.push({});break;case"BufferZones":i[i.length-1].hasOwnProperty("BufferZones")||(i[i.length-1].BufferZones=[]);break;case"BufferZone":i[i.length-1].BufferZones.push({})}if(h&&g&&!p)switch(u=c.match(f)[1],t=c.match(f)[2],u){case"RouteID":i[i.length-1].RouteID=parseInt(c.match(f)[2]);break;case"OriginStopID":i[i.length-1].BufferZones[i[i.length-1].BufferZones.length-1].OriginStopID=parseInt(t);break;case"DestinationStopID":i[i.length-1].BufferZones[i[i.length-1].BufferZones.length-1].DestinationStopID=parseInt(t);break;case"Direction":i[i.length-1].BufferZones[i[i.length-1].BufferZones.length-1].Direction=parseInt(t)}}}catch(e){l.e(e)}finally{l.f()}return i}(e.data);self.postMessage(t)},t=t.default})()));
//# sourceMappingURL=5c32df719efd24ad1eed.js.map
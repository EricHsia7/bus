!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("bus",[],t):"object"==typeof exports?exports.bus=t():e.bus=t()}(self,(()=>(()=>{"use strict";var e={};function t(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var o=0,a=function(){};return{s:a,n:function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,s=!0,i=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return s=e.done,e},e:function(e){i=!0,f=e},f:function(){try{s||null==r.return||r.return()}finally{if(i)throw f}}}}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}return self.onmessage=function(e){var n=function(e){var n,r,o=/^\s*<([a-z_]*)>/im,a=/^\s*<\/([a-z_]*)>/im,f=/^\s*<([a-z_]*)>([^<>]*)<\/([a-z_]*)>/im,s=e.split(/\n/m),i=[],u="",l=t(s);try{for(l.s();!(r=l.n()).done;){var c=r.value,h=o.test(c),p=a.test(c),g=f.test(c);if(h&&!g&&!p)switch(u=c.match(o)[1],n=null,u){case"RouteFare":i.push({});break;case"BufferZones":i[i.length-1].hasOwnProperty("BufferZones")||(i[i.length-1].BufferZones=[]);break;case"BufferZone":i[i.length-1].BufferZones.push({})}if(h&&g&&!p)switch(u=c.match(f)[1],n=c.match(f)[2],u){case"RouteID":i[i.length-1].RouteID=parseInt(c.match(f)[2]);break;case"OriginStopID":i[i.length-1].BufferZones[i[i.length-1].BufferZones.length-1].OriginStopID=parseInt(n);break;case"DestinationStopID":i[i.length-1].BufferZones[i[i.length-1].BufferZones.length-1].DestinationStopID=parseInt(n);break;case"Direction":i[i.length-1].BufferZones[i[i.length-1].BufferZones.length-1].Direction=parseInt(n)}}}catch(e){l.e(e)}finally{l.f()}return i}(e.data);self.postMessage(n)},e=e.default})()));
//# sourceMappingURL=8f123608fa91b51f3b52.js.map
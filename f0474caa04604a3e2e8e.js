!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("bus",[],t):"object"==typeof exports?exports.bus=t():e.bus=t()}(self,(()=>(()=>{"use strict";var e,t={3648:(e,t,r)=>{function n(e){return document.querySelector(e)}function a(e){return document.querySelectorAll(e)}function o(e,t){return e.querySelector(t)}function i(e,t){return e.querySelectorAll(t)}function u(e){return document.getElementById(e)}r.d(t,{aI:()=>o,bv:()=>n,e0:()=>a,jg:()=>i,kr:()=>u})},4750:(e,t,r)=>{r.d(t,{h:()=>l});var n=r(8024);function a(e,t,r,n,a,o,i){try{var u=e[o](i),s=u.value}catch(e){return void r(e)}u.done?t(s):Promise.resolve(s).then(n,a)}function o(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o,i,u=[],s=!0,c=!1;try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;s=!1}else for(;!(s=(n=o.call(r)).done)&&(u.push(n.value),u.length!==t);s=!0);}catch(e){c=!0,a=e}finally{try{if(!s&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(c)throw a}}return u}}(e,t)||function(e,t){if(e){if("string"==typeof e)return i(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?i(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}var u,s={};if("undefined"!=typeof SharedWorker){var c=new SharedWorker(new URL(r.p+r.u(82),r.b));(u=c.port).start()}else{var f=new Worker(new URL(r.p+r.u(701),r.b));u=f}function l(e){return d.apply(this,arguments)}function d(){var e;return e=function*(e){var t=(0,n.zx)("t");return yield new Promise((function(r,n){s[t]=r,u.onerror=function(e){n(e.message)},u.postMessage([e,t])}))},d=function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function u(e){a(i,n,o,u,s,"next",e)}function s(e){a(i,n,o,u,s,"throw",e)}u(void 0)}))},d.apply(this,arguments)}u.onmessage=function(e){var t=o(e.data,2),r=t[0],n=t[1];s[n]&&(s[n](r),delete s[n])},u.onerror=function(e){console.error(e.message)}},4781:(e,t,r)=>{function n(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r=[];if("string"==typeof e)for(var n=e.length,a=0;a<n;a++){var o=e.charCodeAt(a);(r.indexOf(o)<0||!t)&&r.push(o)}return r}function a(e){return!!/[\u3100-\u312Fˇˋˊ˙]/gm.test(e)}r.d(t,{B5:()=>n,iO:()=>a})},5428:(e,t,r)=>{function n(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return a(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?a(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,s=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return u=e.done,e},e:function(e){s=!0,i=e},f:function(){try{u||null==r.return||r.return()}finally{if(s)throw i}}}}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t,r,n,a,o){var i=r+o,u=(r*e+o*n)/i,s=(r*(Math.pow(t,2)+Math.pow(e,2))+o*(Math.pow(a,2)+Math.pow(n,2)))/i-Math.pow(u,2);return Math.sqrt(s)}function i(e,t,r,n,a,i,u,s,c,f,l,d){var p=a+l;return(a*(r*n*i+e*t)+l*(c*f*d+u*s)-p*((a*e+l*u)/p)*((a*t+l*s)/p))/(p*o(e,r,a,u,c,l)*o(t,n,a,s,f,l))}function u(e){var t=Math.hypot(e),r=[];if(t>0){var a,o=1/t,i=n(e);try{for(i.s();!(a=i.n()).done;){var u=a.value;r.push(u*o)}}catch(e){i.e(e)}finally{i.f()}return r}return e}function s(e){var t=e.length;if(0===t)return[0,0];for(var r=1/0,n=-1/0,a=t-1;a>=0;a--){var o=e[a];o>n&&(n=o),o<r&&(r=o)}return[r,n]}r.d(t,{Ck:()=>u,DJ:()=>s,Hi:()=>i,VY:()=>o})},5579:(e,t,r)=>{function n(){var e=new Date,t=e.getDay(),r=e.getDate()-t,n=new Date;return n.setDate(r),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n.setMilliseconds(0),n}function a(e,t,r,n){var a=new Date;return a.setDate(1),a.setMonth(0),a.setHours(r),a.setMinutes(n),a.setSeconds(0),a.setMilliseconds(0),a.setFullYear(e.getFullYear()),a.setMonth(e.getMonth()),a.setDate(e.getDate()),a.setDate(a.getDate()+t),a}function o(e){var t=e.match(/[0-9\.]*/gm);if(t){var r=parseInt(t[0]),n=parseInt(t[2]),a=parseInt(t[4]),o=parseInt(t[6]),i=parseInt(t[8]),u=parseInt(t[10]),s=new Date;return s.setDate(1),s.setMonth(0),s.setFullYear(r),s.setMonth(n-1),s.setDate(a),s.setHours(o),s.setMinutes(i),s.setSeconds(u),s.getTime()}return 0}function i(e){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"YYYY-MM-DD hh:mm:ss").replaceAll(/Y{4,4}/g,e.getFullYear()).replaceAll(/M{2,2}/g,String(e.getMonth()+1).padStart(2,"0")).replaceAll(/D{2,2}/g,String(e.getDate()).padStart(2,"0")).replaceAll(/h{2,2}/g,String(e.getHours()).padStart(2,"0")).replaceAll(/m{2,2}/g,String(e.getMinutes()).padStart(2,"0")).replaceAll(/s{2,2}/g,String(e.getSeconds()).padStart(2,"0"))}function u(e){var t=e.getTime(),r=Math.floor(((new Date).getTime()-t)/1e3),n=Math.floor(r/31536e3);return n>=1?`${n}年前`:(n=Math.floor(r/2592e3))>=1?`${n}個月前`:(n=Math.floor(r/86400))>=1?`${n}天前`:(n=Math.floor(r/3600))>=1?`${n}小時前`:(n=Math.floor(r/60))>=1?`${n}分鐘前`:r>0?`${r}秒前`:"現在"}function s(e,t){var r=0|e;switch(t){case 0:return`${r}秒`;case 1:return[String((r-r%60)/60),String(r%60)].map((function(e){return e.padStart(2,"0")})).join(":");case 2:return`${r/60|0}分`;case 3:if(r>=3600)return`${parseFloat((r/3600).toFixed(1))}時`;if(60<=r&&r<3600)return`${r/60|0}分`;if(r<60)return`${r}秒`;break;default:return"--"}}function c(e){return[{name:"日",day:0,code:"d_0"},{name:"一",day:1,code:"d_1"},{name:"二",day:2,code:"d_2"},{name:"三",day:3,code:"d_3"},{name:"四",day:4,code:"d_4"},{name:"五",day:5,code:"d_5"},{name:"六",day:6,code:"d_6"}][e]}function f(e){return c(parseInt(e)-1)}function l(e){return`${String(e.hours).padStart(2,"0")}:${String(e.minutes).padStart(2,"0")}`}function d(e,t,r){var n=new Date;return n.setDate(1),n.setMonth(0),n.setFullYear(e),n.setMonth(t-1),n.setDate(r),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n.setMilliseconds(0),n}r.d(t,{$T:()=>i,HN:()=>u,P$:()=>n,S1:()=>a,Zn:()=>o,fU:()=>s,kd:()=>c,mr:()=>f,pn:()=>l,uP:()=>d})},6141:(e,t,r)=>{function n(e){return getComputedStyle(document.documentElement).getPropertyValue(e)}r.d(t,{t:()=>n})},7307:(e,t,r)=>{r.d(t,{O:()=>a});var n=r(2754);function a(e){return new n._k({issuer:"Bus",label:"Bus",algorithm:"SHA256",digits:8,period:10,secret:e}).generate()}},9469:(e,t,r)=>{r.d(t,{_:()=>i,i:()=>u});var n=r(8134),a=r(4690),o=r(3030);function i(){var e=new URL(location.href).searchParams.get("permalink");if(null!==e){var t=String(e);if(/^[0-1]\@(.*)(\~.*){0,1}/.test(t)){var r=t.split(/[\@\~]/);switch(parseInt(r[0])){case 0:(0,n.Rk)(parseInt(r[1],16)).then((function(e){!1!==e?(0,a.SR)(e.id,e.pid):(0,n.k9)(r[2]).then((function(e){e.length>0&&(0,a.SR)(e[0].id,e[0].pid)}))}));break;case 1:(0,o.so)(r[1])}}}}function u(e,t){var r=new URL("https://erichsia7.github.io/bus/");switch(e){case 0:r.searchParams.set("permalink",`0@${parseInt(t.id).toString(16)}~${t.name}`);break;case 1:r.searchParams.set("permalink",`1@${t.hash}`)}return decodeURIComponent(r.toString())}}},r={};function n(e){var a=r[e];if(void 0!==a)return a.exports;var o=r[e]={exports:{}};return t[e].call(o.exports,o,o.exports,n),o.exports}n.m=t,e=[],n.O=(t,r,a,o)=>{if(!r){var i=1/0;for(f=0;f<e.length;f++){for(var[r,a,o]=e[f],u=!0,s=0;s<r.length;s++)(!1&o||i>=o)&&Object.keys(n.O).every((e=>n.O[e](r[s])))?r.splice(s--,1):(u=!1,o<i&&(i=o));if(u){e.splice(f--,1);var c=a();void 0!==c&&(t=c)}}return t}o=o||0;for(var f=e.length;f>0&&e[f-1][2]>o;f--)e[f]=e[f-1];e[f]=[r,a,o]},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.u=e=>({82:"2b46b0018b863b906aed",106:"9a72447041a5d05fe13d",132:"9bba1682d701e73df680",148:"34ac83d64c50947d7280",211:"33381ff04f60863536bd",332:"8f123608fa91b51f3b52",551:"66d8e01c6acd3992036d",592:"33381ff04f60863536bd",648:"b50bdbf2bd2e61ffd859",701:"2b46b0018b863b906aed",850:"5850a92051138389042c",892:"7a660f9bb559c5ef1d84",932:"66d8e01c6acd3992036d",960:"2b36763b5f09cd785bd3"}[e]+".js"),n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.p="./",(()=>{n.b=document.baseURI||self.location.href;var e={677:0,827:0,238:0,325:0};n.O.j=t=>0===e[t];var t=(t,r)=>{var a,o,[i,u,s]=r,c=0;if(i.some((t=>0!==e[t]))){for(a in u)n.o(u,a)&&(n.m[a]=u[a]);if(s)var f=s(n)}for(t&&t(r);c<i.length;c++)o=i[c],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(f)},r=self.webpackChunkbus=self.webpackChunkbus||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var a=n.O(void 0,[790,281,754,343,799,821,327,133,806,150,827,794,238,627,704,466,325,927,687],(()=>n(7084)));return a=(a=n.O(a)).default})()));
//# sourceMappingURL=f0474caa04604a3e2e8e.js.map
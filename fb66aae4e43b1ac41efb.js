/*! For license information please see fb66aae4e43b1ac41efb.js.LICENSE.txt */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("bus",[],e):"object"==typeof exports?exports.bus=e():t.bus=e()}(self,(()=>(()=>{"use strict";var t,e={5428:(t,e,r)=>{function n(t,e){if(t){if("string"==typeof t)return o(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function a(t){var e=Math.hypot(t),r=[];if(e>0){var o,a=1/e,i=function(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=n(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var o=0,a=function(){};return{s:a,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,c=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return c=t.done,t},e:function(t){u=!0,i=t},f:function(){try{c||null==r.return||r.return()}finally{if(u)throw i}}}}(t);try{for(i.s();!(o=i.n()).done;){var c=o.value;r.push(c*a)}}catch(t){i.e(t)}finally{i.f()}return r}return t}function i(t,e){var r=t.length;if(r<3)return t;for(var n=0,o=0;o<r;o++)n+=t[o];for(var a=n/r,i=0,c=0;c<r;c++)i+=Math.pow(t[c]-a,2);for(var u=Math.sqrt(i/r),f=[],l=0,s=0;s<r;s++){var h=Math.exp(t[s]/u);l+=h,f.push(h)}for(var p=Math.pow(r,e),d={},y=0;y<r;y++){var v="k_".concat(Math.floor(f[y]/l*p));d.hasOwnProperty(v)||(d[v]={sum:0,len:0}),d[v].sum+=t[y],d[v].len+=1}var g=[];for(var m in d){var b=d[m];g.push(Math.floor(b.sum/b.len))}return g.sort((function(t,e){return t-e})),g}r.d(e,{Ck:()=>a,e5:()=>i})},4750:(t,e,r)=>{r.d(e,{h:()=>p});var n=r(8024);function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function a(){a=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",f=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),c=new D(n||[]);return i(a,"_invoke",{value:E(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var d="suspendedStart",y="suspendedYield",v="executing",g="completed",m={};function b(){}function w(){}function x(){}var S={};s(S,u,(function(){return this}));var M=Object.getPrototypeOf,L=M&&M(M(P([])));L&&L!==r&&n.call(L,u)&&(S=L);var O=x.prototype=b.prototype=Object.create(S);function j(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function k(t,e){function r(a,i,c,u){var f=p(t[a],t,i);if("throw"!==f.type){var l=f.arg,s=l.value;return s&&"object"==o(s)&&n.call(s,"__await")?e.resolve(s.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(s).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,u)}))}u(f.arg)}var a;i(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function E(e,r,n){var o=d;return function(a,i){if(o===v)throw Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=_(c,n);if(u){if(u===m)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var f=p(e,r,n);if("normal"===f.type){if(o=n.done?g:y,f.arg===m)continue;return{value:f.arg,done:n.done}}"throw"===f.type&&(o=g,n.method="throw",n.arg=f.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var a=p(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,m;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function A(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function I(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function D(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(A,this),this.reset(!0)}function P(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(o(e)+" is not iterable")}return w.prototype=x,i(O,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=s(x,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,s(t,l,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},j(k.prototype),s(k.prototype,f,(function(){return this})),e.AsyncIterator=k,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new k(h(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},j(O),s(O,l,"Generator"),s(O,u,(function(){return this})),s(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=P,D.prototype={constructor:D,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(I),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),f=n.call(i,"finallyLoc");if(u&&f){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!f)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),I(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;I(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:P(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function i(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function c(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,a,i,c=[],u=!0,f=!1;try{if(a=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=a.call(r)).done)&&(c.push(n.value),c.length!==e);u=!0);}catch(t){f=!0,o=t}finally{try{if(!u&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(f)throw o}}return c}}(t,e)||function(t,e){if(t){if("string"==typeof t)return u(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}var f,l={};if("undefined"!=typeof SharedWorker){var s=new SharedWorker(new URL(r.p+r.u(82),r.b));(f=s.port).start()}else{var h=new Worker(new URL(r.p+r.u(7701),r.b));f=h}function p(t){return d.apply(this,arguments)}function d(){var t;return t=a().mark((function t(e){var r,o;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=(0,n.zx)("t"),t.next=3,new Promise((function(t,n){l[r]=t,f.onerror=function(t){n(t.message)},f.postMessage([e,r])}));case 3:return o=t.sent,t.abrupt("return",o);case 5:case"end":return t.stop()}}),t)})),d=function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function c(t){i(a,n,o,c,u,"next",t)}function u(t){i(a,n,o,c,u,"throw",t)}c(void 0)}))},d.apply(this,arguments)}f.onmessage=function(t){var e=c(t.data,2),r=e[0],n=e[1];l[n]&&(l[n](r),delete l[n])},f.onerror=function(t){console.error(t.message)}},8141:(t,e,r)=>{function n(t,e,r){var n=r.x-e.x,o=r.y-e.y,a=n*n+o*o,i=((t.x-e.x)*n+(t.y-e.y)*o)/a;if(i<0)n=t.x-e.x,o=t.y-e.y;else if(i>1)n=t.x-r.x,o=t.y-r.y;else{var c={x:e.x+i*n,y:e.y+i*o};n=t.x-c.x,o=t.y-c.y}return Math.sqrt(n*n+o*o)}function o(t,e){if(t.length<3)return t;for(var r=0,a=0,i=1;i<t.length-1;i++){var c=n(t[i],t[0],t[t.length-1]);c>r&&(a=i,r=c)}if(r>e){var u=t.slice(0,a+1),f=t.slice(a),l=o(u,e),s=o(f,e);return l.slice(0,l.length-1).concat(s)}return[t[0],t[t.length-1]]}function a(t,e){if(t.length<1)return"";for(var r="M".concat(t[0].x*e,",").concat(t[0].y*e),n=1;n<t.length-1;n++){var o=t[n],a=t[n+1]||o;r+="Q".concat(o.x*e,",").concat(o.y*e,",").concat((o.x*e+a.x*e)/2,",").concat((o.y*e+a.y*e)/2)}var i=t[t.length-1];return r+="L".concat(i.x*e,",").concat(i.y*e)}r.d(e,{p:()=>a,z:()=>o})},9469:(t,e,r)=>{r.d(e,{_:()=>i,i:()=>c});var n=r(8134),o=r(4690),a=r(3030);function i(){var t=new URL(location.href).searchParams.get("permalink");if(null!==t){var e=String(t);if(/^[0-1]\@(.*)(\~.*){0,1}/.test(e)){var r=e.split(/[\@\~]/);switch(parseInt(r[0])){case 0:(0,n.Rk)(parseInt(r[1],16)).then((function(t){t.length>0?(0,o.SR)(t[0].id,t[0].pid):(0,n.k9)(r[2]).then((function(t){t.length>0&&(0,o.SR)(t[0].id,t[0].pid)}))}));break;case 1:var i=r[1];(0,a.so)(i)}}}}function c(t,e){var r=new URL("https://erichsia7.github.io/bus/");switch(t){case 0:r.searchParams.set("permalink","0@".concat(parseInt(e.id).toString(16),"~").concat(e.name));break;case 1:r.searchParams.set("permalink","1@".concat(e.hash))}return decodeURIComponent(r.toString())}},3648:(t,e,r)=>{function n(t){return document.querySelector(t)}function o(t){return document.querySelectorAll(t)}function a(t,e){return t.querySelector(e)}function i(t,e){return t.querySelectorAll(e)}r.d(e,{aI:()=>a,bv:()=>n,e0:()=>o,jg:()=>i})},4781:(t,e,r)=>{function n(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],r=[];if("string"==typeof t)for(var n=t.length,o=0;o<n;o++){var a=t.charCodeAt(o);(r.indexOf(a)<0||!e)&&r.push(a)}return r}function o(t){return!!/[\u3100-\u312Fˇˋˊ˙]/gm.test(t)}r.d(e,{B:()=>n,i:()=>o})},5579:(t,e,r)=>{function n(){var t=new Date,e=t.getDay(),r=t.getDate()-e,n=new Date;return n.setDate(r),n.setHours(0),n.setMinutes(0),n.setSeconds(0),n.setMilliseconds(0),n}function o(t,e,r,n){var o=new Date;return o.setDate(1),o.setMonth(0),o.setHours(r),o.setMinutes(n),o.setSeconds(0),o.setMilliseconds(0),o.setFullYear(t.getFullYear()),o.setMonth(t.getMonth()),o.setDate(t.getDate()),o.setDate(o.getDate()+e),o}function a(t){var e=t.match(/[0-9\.]*/gm);if(e){var r=parseInt(e[0]),n=parseInt(e[2]),o=parseInt(e[4]),a=parseInt(e[6]),i=parseInt(e[8]),c=parseInt(e[10]),u=new Date;return u.setDate(1),u.setMonth(0),u.setFullYear(r),u.setMonth(n-1),u.setDate(o),u.setHours(a),u.setMinutes(i),u.setSeconds(c),u.getTime()}return 0}function i(t){return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:"YYYY-MM-DD hh:mm:ss").replaceAll(/Y{4,4}/g,t.getFullYear()).replaceAll(/M{2,2}/g,String(t.getMonth()+1).padStart(2,"0")).replaceAll(/D{2,2}/g,String(t.getDate()).padStart(2,"0")).replaceAll(/h{2,2}/g,String(t.getHours()).padStart(2,"0")).replaceAll(/m{2,2}/g,String(t.getMinutes()).padStart(2,"0")).replaceAll(/s{2,2}/g,String(t.getSeconds()).padStart(2,"0"))}function c(t){var e=t.getTime(),r=Math.floor(((new Date).getTime()-e)/1e3),n=Math.floor(r/31536e3);return n>=1?"".concat(n,"年前"):(n=Math.floor(r/2592e3))>=1?"".concat(n,"個月前"):(n=Math.floor(r/86400))>=1?"".concat(n,"天前"):(n=Math.floor(r/3600))>=1?"".concat(n,"小時前"):(n=Math.floor(r/60))>=1?"".concat(n,"分鐘前"):"".concat(r,"秒前")}function u(t,e){switch(t=Math.round(t),e){case 0:return"".concat(t,"秒");case 1:return[r=String((t-t%60)/60),String(t%60)].map((function(t){return t.padStart(2,"0")})).join(":");case 2:var r=String(Math.floor(t/60));return"".concat(r,"分");case 3:if(t>=3600){var n=String(parseFloat((t/3600).toFixed(1)));return"".concat(n,"時")}if(60<=t&&t<3600){r=String(Math.floor(t/60));return"".concat(r,"分")}if(t<60)return"".concat(t,"秒");break;default:return"--"}}function f(t){return[{name:"日",day:0,code:"d_0"},{name:"一",day:1,code:"d_1"},{name:"二",day:2,code:"d_2"},{name:"三",day:3,code:"d_3"},{name:"四",day:4,code:"d_4"},{name:"五",day:5,code:"d_5"},{name:"六",day:6,code:"d_6"}][t]}function l(t){return f(parseInt(t)-1)}function s(t){return"".concat(String(t.hours).padStart(2,"0"),":").concat(String(t.minutes).padStart(2,"0"))}r.d(e,{$T:()=>i,HN:()=>c,P$:()=>n,S1:()=>o,Zn:()=>a,fU:()=>u,kd:()=>f,mr:()=>l,pn:()=>s})},7307:(t,e,r)=>{r.d(e,{O:()=>o});var n=r(2754);function o(t){return new n._k({issuer:"BusNotification",label:"BusNotification",algorithm:"SHA256",digits:8,period:10,secret:t}).generate()}}},r={};function n(t){var o=r[t];if(void 0!==o)return o.exports;var a=r[t]={id:t,loaded:!1,exports:{}};return e[t].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}n.m=e,t=[],n.O=(e,r,o,a)=>{if(!r){var i=1/0;for(l=0;l<t.length;l++){for(var[r,o,a]=t[l],c=!0,u=0;u<r.length;u++)(!1&a||i>=a)&&Object.keys(n.O).every((t=>n.O[t](r[u])))?r.splice(u--,1):(c=!1,a<i&&(i=a));if(c){t.splice(l--,1);var f=o();void 0!==f&&(e=f)}}return e}a=a||0;for(var l=t.length;l>0&&t[l-1][2]>a;l--)t[l]=t[l-1];t[l]=[r,o,a]},n.d=(t,e)=>{for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},n.u=t=>({7:"56eab314e7d65d2f603f",82:"ccc1f65c05f59c1b74ac",1132:"7732f27cfd63d88b5ce2",1850:"dc893bcd6aca95f8775a",2388:"56eab314e7d65d2f603f",3148:"d1ceb04b8f51a02e6b4b",5332:"8f123608fa91b51f3b52",5960:"b5e6c7bd5d14ef076f41",7701:"ccc1f65c05f59c1b74ac",8648:"6a2c680d7b9bf9c2a3b9",8892:"9e521ee9b22c43e13efb"}[t]+".js"),n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),n.p="./",(()=>{n.b=document.baseURI||self.location.href;var t={677:0,9827:0};n.O.j=e=>0===t[e];var e=(e,r)=>{var o,a,[i,c,u]=r,f=0;if(i.some((e=>0!==t[e]))){for(o in c)n.o(c,o)&&(n.m[o]=c[o]);if(u)var l=u(n)}for(e&&e(r);f<i.length;f++)a=i[f],n.o(t,a)&&t[a]&&t[a][0](),t[a]=0;return n.O(l)},r=self.webpackChunkbus=self.webpackChunkbus||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))})();var o=n.O(void 0,[7951,3790,2858,2754,4354,2350,2935,5799,5525,8446,8084,777,4462,1327,4180,8853,4058,5826,7133,7554,9576,2680,3998,2150,335,9827,5150,2368,3516,7794,2238,4627,1236,5541,6895,1614,3687],(()=>n(4356)));return o=(o=n.O(o)).default})()));
//# sourceMappingURL=fb66aae4e43b1ac41efb.js.map
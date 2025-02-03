/*! For license information please see fc5282f44de74ad8e1fb.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[1614],{5009:(t,e,r)=>{r.d(e,{Bb:()=>b,RC:()=>w,rf:()=>g});var n=r(9856),o=r(8134),i=r(4537),a=r(6082),c=r(9119),u=r(3648),l=r(4781),s=r(904);function f(t){return f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},f(t)}function h(){h=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new P(n||[]);return o(a,"_invoke",{value:O(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=s;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function b(){}function w(){}function x(){}var L={};l(L,a,(function(){return this}));var E=Object.getPrototypeOf,k=E&&E(E(N([])));k&&k!==r&&n.call(k,a)&&(L=k);var S=x.prototype=b.prototype=Object.create(L);function _(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(o,i,a,c){var u=p(t[o],t,i);if("throw"!==u.type){var l=u.arg,s=l.value;return s&&"object"==f(s)&&n.call(s,"__await")?e.resolve(s.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(s).then((function(t){l.value=t,a(l)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function O(e,r,n){var o=y;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=A(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var l=p(e,r,n);if("normal"===l.type){if(o=n.done?m:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function A(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function I(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(f(e)+" is not iterable")}return w.prototype=x,o(S,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,u,"GeneratorFunction")),t.prototype=Object.create(S),t},e.awrap=function(t){return{__await:t}},_(j.prototype),l(j.prototype,c,(function(){return this})),e.AsyncIterator=j,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new j(s(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},_(S),l(S,u,"Generator"),l(S,a,(function(){return this})),l(S,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(I),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),I(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;I(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function p(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return y(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?y(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function y(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function v(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}var d=(0,u.bv)(".j"),m=((0,u.bv)(".j .k .l #search_input"),(0,u.bv)(".j .ao .bo"));function g(){a.m?((0,s.WR)("Search"),d.setAttribute("displayed","true"),(0,n.El)(),(0,o.dD)()):(0,c.a)("資料還在下載中","download_for_offline")}function b(){(0,s.kr)("Search"),(0,n.k_)(),d.setAttribute("displayed","false")}function w(t){return x.apply(this,arguments)}function x(){var t;return t=h().mark((function t(e){var r,n,a,c,u,s,f,y,v;return h().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if((0,l.iO)(e)){t.next=34;break}r=["route","location_on","directions_bus"],n=[],a=(0,o.GU)(e,30),c=p(a),t.prev=5,c.s();case 7:if((u=c.n()).done){t.next=25;break}s=u.value,f=s.item.n,y=(0,i.Z)(r[s.item.type]),v="",t.t0=s.item.type,t.next=0===t.t0?15:1===t.t0?17:2===t.t0?19:21;break;case 15:return v="bus.route.openRoute(".concat(s.item.id,", [").concat(s.item.pid.join(","),"])"),t.abrupt("break",22);case 17:return v="bus.location.openLocation('".concat(s.item.hash,"')"),t.abrupt("break",22);case 19:return v="bus.bus.openBus(".concat(s.item.id,")"),t.abrupt("break",22);case 21:return t.abrupt("break",22);case 22:n.push('<div class="co" onclick="'.concat(v,'"><div class="do">').concat(y,'</div><div class="eo">').concat(f,"</div></div>"));case 23:t.next=7;break;case 25:t.next=30;break;case 27:t.prev=27,t.t1=t.catch(5),c.e(t.t1);case 30:return t.prev=30,c.f(),t.finish(30);case 33:m.innerHTML=n.join("");case 34:case"end":return t.stop()}}),t,null,[[5,27,30,33]])})),x=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){v(i,n,o,a,c,"next",t)}function c(t){v(i,n,o,a,c,"throw",t)}a(void 0)}))},x.apply(this,arguments)}},9856:(t,e,r)=>{r.d(e,{El:()=>z,Wb:()=>$,_O:()=>Y,d$:()=>Z,gn:()=>U,k_:()=>H,mr:()=>R,vp:()=>q});var n=r(5009),o=r(8024),i=r(7968),a=r(3648),c=r(4537),u=r(904),l=r(6141);function s(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return f(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}var h=[["紅","藍","1","2","3"],["綠","棕","4","5","6"],["橘","小","7","8","9"],["鍵盤","幹線","清空","0","刪除"]],p=(0,a.bv)(".j .k .l #search_input"),y=(0,a.bv)(".j .ao .fo"),v=(0,a.bv)(".j .k .l canvas"),d=v.getContext("2d"),m="搜尋路線、地點、公車",g=window.devicePixelRatio,b=15*g,w=1.8*g,x=.9*g,L=4*g,E=25*g,k=20*g,S='"Noto Sans TC", sans-serif',_=(0,l.t)("--a"),j=(0,l.t)("--mb"),O=(0,l.t)("--b"),A=0,T=0,I=0,P=!1,N=0,G=(0,u.gO)("head-one-button"),M=G.width*g,F=G.height*g,C=!1;function R(){G=(0,u.gO)("head-one-button"),M=G.width,F=G.height,v.width=M*g,v.height=F*g,U(p.value,-1,-1)}function z(){!function(){var t,e=[],r=s(h);try{for(r.s();!(t=r.n()).done;){var n,i=s(t.value);try{for(i.s();!(n=i.n()).done;){var a=n.value,u="",l="onmousedown",f="";switch(a){case"刪除":u="bus.search.deleteCharFromInout()",f=(0,c.Z)("backspace");break;case"清空":u="bus.search.emptyInput()",f=a;break;case"鍵盤":u="bus.search.openSystemKeyboard(event)",f=(0,c.Z)("keyboard");break;default:u="bus.search.typeTextIntoInput('".concat(a,"')"),f=a}(0,o.p1)()&&(l="ontouchstart"),e.push('<button class="go" '.concat(l,'="').concat(u,'">').concat(f,"</button>"))}}catch(t){i.e(t)}finally{i.f()}}}catch(t){r.e(t)}finally{r.f()}y.innerHTML=e.join("")}(),y.setAttribute("displayed","true"),C=!0,W(),U(p.value,-1,-1)}function H(){y.setAttribute("displayed","false"),C=!1}function q(t){t.preventDefault(),p.focus()}function Y(t){var e=String(p.value),r="".concat(e).concat(t);p.value=r,(0,n.RC)(r),U(r,-1,-1)}function Z(){var t=String(p.value),e=t.substring(0,t.length-1);p.value=e,(0,n.RC)(e),U(e,-1,-1)}function $(){p.value="",(0,n.RC)(""),U("",-1,-1)}function U(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1?arguments[1]:void 0,r=arguments.length>2?arguments[2]:void 0,n=!1;0===t.length?(t=m,n=!0,e=0,r=0):-1===e&&-1===r&&(r=1*(e=t.length)),G=(0,u.gO)("head-one-button"),M=G.width*g,F=G.height*g,_=(0,l.t)("--a"),j=(0,l.t)("--mb"),O=(0,l.t)("--b"),d.font="500 ".concat(k,"px ").concat(S),d.textAlign="center",d.textBaseline="middle",A=d.measureText(t).width,T=d.measureText(t.substring(0,e)).width,I=d.measureText(t.substring(e,r)).width,N=n?1:Math.max(1,T),d.clearRect(0,0,M,F),e===r?(P=!0,d.globalAlpha=1,d.fillStyle=n?j:_,d.fillText(t,A/2+(Math.min(N,M-b)-N),F/2),(0,i.wg)(d,Math.min(N,M-b),(F-E)/2,w,E,x,O)):(P=!1,d.globalAlpha=.27,(0,i.wg)(d,Math.min(N,M-b),(F-E)/2,I,E,L,O),d.globalAlpha=1,d.fillStyle=n?j:_,d.fillText(t,A/2+(Math.min(N,M-b)-N),F/2),d.globalAlpha=.08,(0,i.wg)(d,Math.min(N,M-b),(F-E)/2,I,E,L,O))}function W(){var t=(new Date).getTime()/400,e=Math.abs(Math.sin(t));P&&(d.globalAlpha=e,d.clearRect(Math.min(N,M-b)-1,0,w+2,F),(0,i.wg)(d,Math.min(N,M-b),(F-E)/2,w,E,x,O)),C&&window.requestAnimationFrame(W)}},6104:(t,e,r)=>{r.d(e,{Ow:()=>x,hP:()=>_,jk:()=>j,os:()=>L,rY:()=>S,vv:()=>E});var n=r(8024),o=r(3648),i=r(3459),a=r(5976),c=r(5427),u=r(4537),l=r(904),s=r(9119),f=r(3251),h=r(4311);function p(t){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p(t)}function y(){y=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new P(n||[]);return o(a,"_invoke",{value:O(t,r,c)}),a}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=s;var h="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function b(){}function w(){}function x(){}var L={};l(L,a,(function(){return this}));var E=Object.getPrototypeOf,k=E&&E(E(N([])));k&&k!==r&&n.call(k,a)&&(L=k);var S=x.prototype=b.prototype=Object.create(L);function _(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var l=u.arg,s=l.value;return s&&"object"==p(s)&&n.call(s,"__await")?e.resolve(s.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(s).then((function(t){l.value=t,a(l)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function O(e,r,n){var o=h;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=A(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var l=f(e,r,n);if("normal"===l.type){if(o=n.done?m:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function A(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=f(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function I(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(p(e)+" is not iterable")}return w.prototype=x,o(S,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,u,"GeneratorFunction")),t.prototype=Object.create(S),t},e.awrap=function(t){return{__await:t}},_(j.prototype),l(j.prototype,c,(function(){return this})),e.AsyncIterator=j,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new j(s(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},_(S),l(S,u,"Generator"),l(S,a,(function(){return this})),l(S,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(I),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),I(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;I(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function v(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return d(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?d(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function m(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function g(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){m(i,n,o,a,c,"next",t)}function c(t){m(i,n,o,a,c,"throw",t)}a(void 0)}))}}function b(t){var e=(0,n.zx)("i"),r=document.createElement("div");return r.classList.add("pp"),r.id=e,r.setAttribute("onclick",t.action),r.setAttribute("type",t.type),r.innerHTML='<div class="rp">'.concat((0,u.Z)(t.icon),'</div><div class="sp">').concat(t.name,'</div><div class="up">').concat(t.status,'</div><div class="vp">').concat((0,u.Z)("arrow_forward_ios"),"</div>"),{element:r,id:e}}function w(){return(w=g(y().mark((function t(e){var r,n,a,c,u;return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,i.cl)();case 2:r=t.sent,(0,o.aI)(e,".lp .np").innerHTML="",n=v(r);try{for(n.s();!(a=n.n()).done;)c=a.value,u=b(c),(0,o.aI)(e,".lp .np").appendChild(u.element)}catch(t){n.e(t)}finally{n.f()}case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(){(0,l.WR)("Settings");var t=(0,o.bv)(".bp");t.setAttribute("displayed","true"),function(t){w.apply(this,arguments)}(t)}function L(){(0,l.kr)("Settings"),(0,o.bv)(".bp").setAttribute("displayed","false")}function E(){return k.apply(this,arguments)}function k(){return(k=g(y().mark((function t(){var e;return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,a.R)();case 2:e=t.sent,(0,n.MR)(e,"application/json","bus-export.json");case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function S(){var t=(0,n.zx)("i"),e=document.createElement("input");e.setAttribute("type","file"),e.setAttribute("accept","application/json"),e.setAttribute("name",t),e.id=t,e.classList.add("_p"),e.addEventListener("change",(function(e){if(0===e.target.files.length)(0,o.bv)("body #".concat(t)).remove();else{var r=e.target.files[0],n=new FileReader;n.onload=function(e){var r=e.target.result;(0,c.Qx)(r).then((function(e){e?(0,s.a)("已匯入資料","check_circle"):(0,s.a)("無法匯入資料","error"),(0,o.bv)("body #".concat(t)).remove()}))},n.readAsText(r)}}),{once:!0}),e.addEventListener("cancel",(function(e){(0,o.bv)("body #".concat(t)).remove()}),{once:!0}),document.body.append(e),(0,o.bv)("body #".concat(t)).click()}function _(){var t=(0,f.NO)();window.open(t)}function j(){(0,h.VC)().then((function(t){switch(t){case"granted":(0,s.a)("已開啟永久儲存","check_circle");break;case"denied":(0,s.a)("永久儲存權限已被拒絕","cancel");break;case"unsupported":(0,s.a)("此瀏覽器不支援永久儲存","warning");break;default:(0,s.a)("發生錯誤","error")}}))}},6166:(t,e,r)=>{r.d(e,{Yi:()=>h,wx:()=>f,yH:()=>s});var n=r(8024),o=r(3648),i=r(3459),a=r(904);function c(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return u(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function l(t,e,r){var o=(0,n.zx)("i"),i=document.createElement("div");return i.classList.add("qp"),i.id=o,i.innerHTML='<div class="tp">'.concat(e.name,'</div><div class="wp"><input type="checkbox" onclick="bus.settings.settingsOptionsHandler(event, \'').concat(t.key,"', ").concat(r,')" ').concat(t.option===r?"checked":"","/></div>"),{element:i,id:o}}function s(t){(0,a.WR)("SettingsOptions");var e=(0,i.PL)(t),r=(0,o.bv)(".cp");r.setAttribute("displayed","true"),(0,o.aI)(r,".ep .kp").innerText=e.name,function(t,e){var r=(0,i.PL)(e),n=(0,o.aI)(t,".mp"),a=(0,o.aI)(n,".op");(0,o.aI)(n,".zp").innerText=r.description,a.innerHTML="";var u,s=0,f=c(r.options);try{for(f.s();!(u=f.n()).done;){var h=l(r,u.value,s);a.appendChild(h.element),s+=1}}catch(t){f.e(t)}finally{f.f()}}(r,t),(0,a.Z_)()}function f(){(0,o.bv)(".cp").setAttribute("displayed","false"),(0,a.l$)()}function h(t,e,r){var n,a=c((0,o.e0)('.cp .mp .op .qp .wp input[type="checkbox"]'));try{for(a.s();!(n=a.n()).done;){n.value.checked=!1}}catch(t){a.e(t)}finally{a.f()}t.target.checked=!0,(0,i.aN)(e,r).then((function(t){}))}},2994:(t,e,r)=>{r.d(e,{G:()=>p,Q:()=>y});var n=r(4225),o=r(3648);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function a(){a=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",l=c.asyncIterator||"@@asyncIterator",s=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new P(n||[]);return o(a,"_invoke",{value:O(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function b(){}function w(){}function x(){}var L={};f(L,u,(function(){return this}));var E=Object.getPrototypeOf,k=E&&E(E(N([])));k&&k!==r&&n.call(k,u)&&(L=k);var S=x.prototype=b.prototype=Object.create(L);function _(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(o,a,c,u){var l=p(t[o],t,a);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==i(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function O(e,r,n){var o=y;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=A(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var l=p(e,r,n);if("normal"===l.type){if(o=n.done?m:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function A(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function I(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(i(e)+" is not iterable")}return w.prototype=x,o(S,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,s,"GeneratorFunction")),t.prototype=Object.create(S),t},e.awrap=function(t){return{__await:t}},_(j.prototype),f(j.prototype,l,(function(){return this})),e.AsyncIterator=j,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new j(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},_(S),f(S,s,"Generator"),f(S,u,(function(){return this})),f(S,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(I),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),I(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;I(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function c(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}var u=(0,o.bv)(".sq"),l=(0,o.aI)(u,".wq"),s=(0,o.aI)(l,".xq");function f(t){var e=document.createElement("div");return e.classList.add("yq"),e.innerHTML='<div class="zq">'.concat(t.category.name,'</div><div class="_q">').concat(t.size,"</div>"),{element:e,id:""}}function h(){var t;return t=a().mark((function t(){var e,r,o,i;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,n.F)();case 2:for(r in e=t.sent,s.innerHTML="",e.categorizedSizes)o=e.categorizedSizes[r],i=f(o),s.appendChild(i.element);case 5:case"end":return t.stop()}}),t)})),h=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){c(i,n,o,a,u,"next",t)}function u(t){c(i,n,o,a,u,"throw",t)}a(void 0)}))},h.apply(this,arguments)}function p(){u.setAttribute("displayed","true"),function(){h.apply(this,arguments)}()}function y(){u.setAttribute("displayed","false")}}}]);
//# sourceMappingURL=fc5282f44de74ad8e1fb.js.map
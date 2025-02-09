/*! For license information please see 838d7e65f788e898a5c4.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[5150],{8184:(t,e,r)=>{r.d(e,{N:()=>f,e:()=>s});var n=r(8024),o=r(4537),i=r(3648),a=r(3459),c=[],u=!1,l=!0;function s(t){for(var e=(0,a.Js)("playing_animation"),r=[],n=0;n<5;n++)r.push({key:n,icon:"none",value:""});f(t,r,!0,e)}function f(t,e,r,a){function s(t,e,c){function s(t,e){(0,i.aI)(t,".ph").innerHTML=(0,o.Z)(e.icon)}function f(t,e){(0,i.aI)(t,".qh").innerText=e.value}function h(t,e){t.setAttribute("animation",e)}function d(t,e){t.setAttribute("skeleton-screen",e)}null===c?(s(t,e),f(t,e),d(t,r),h(t,a)):((0,n.hw)(c,e)||s(t,e),(0,n.hw)(c,e)||f(t,e),r!==u&&d(t,r),a!==l&&h(t,a))}var f,h=e.length,d=(0,i.jg)(t,".nh .oh").length;if(h!==d){var p=d-h;if(p<0)for(var v=0;v<Math.abs(p);v++){var y=(f=void 0,(f=document.createElement("div")).classList.add("oh"),f.innerHTML='<div class="ph"></div><div class="qh"></div>',{element:f,id:""});(0,i.aI)(t,".nh").appendChild(y.element)}else for(var m=0;m<Math.abs(p);m++){var g=d-1-m;(0,i.jg)(t,".nh .oh")[g].remove()}}for(var b=(0,i.jg)(t,".nh .oh"),w=0;w<h;w++){var x=b[w],L=e[w];0===c.length?s(x,L,null):s(x,L,c[w])}c=e,l=a,u=r}},9499:(t,e,r)=>{r.d(e,{Jv:()=>I,iH:()=>_,kp:()=>k});var n=r(7910),o=r(3648),i=r(5579),a=r(904);function c(t){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c(t)}function u(){u=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",l=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new P(n||[]);return o(a,"_invoke",{value:A(t,r,c)}),a}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var p="suspendedStart",v="suspendedYield",y="executing",m="completed",g={};function b(){}function w(){}function x(){}var L={};f(L,a,(function(){return this}));var E=Object.getPrototypeOf,j=E&&E(E(N([])));j&&j!==r&&n.call(j,a)&&(L=j);var k=x.prototype=b.prototype=Object.create(L);function _(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,i,a,u){var l=d(t[o],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==c(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,u)}),(function(t){r("throw",t,a,u)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,u)}))}u(l.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function A(e,r,n){var o=p;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=O(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===p)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var l=d(e,r,n);if("normal"===l.type){if(o=n.done?m:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function O(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,O(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=d(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(c(e)+" is not iterable")}return w.prototype=x,o(k,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,s,"GeneratorFunction")),t.prototype=Object.create(k),t},e.awrap=function(t){return{__await:t}},_(I.prototype),f(I.prototype,l,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new I(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},_(k),f(k,s,"Generator"),f(k,a,(function(){return this})),f(k,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function l(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return s(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?s(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function f(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function h(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){f(i,n,o,a,c,"next",t)}function c(t){f(i,n,o,a,c,"throw",t)}a(void 0)}))}}var d=(0,o.bv)(".rj"),p=(0,o.aI)(d,".vj"),v=(0,o.aI)(p,".wj"),y=(0,o.aI)(v,".xj"),m=(0,o.aI)(v,".yj"),g=(0,o.aI)(p,"._j"),b=(0,o.aI)(g,'.ak[name="total-data-usage"] .ck'),w=(0,o.aI)(g,'.ak[name="start-time"] .ck'),x=(0,o.aI)(g,'.ak[name="end-time"] .ck');function L(){return(L=h(u().mark((function t(e){var r,o,i,c;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=(0,a.gO)("window"),o=r.width,i=Math.min(5/18*o,.33*r.height),t.next=5,(0,n.Ti)(e,o,i,20);case 5:"string"==typeof(c=t.sent)?y.innerHTML=c:!1===c&&(y.innerText="目前資料不足，無法描繪圖表。");case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function E(){return(E=h(u().mark((function t(){var e,r;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,n.Uc)();case 2:return e=t.sent,t.next=5,(0,n.rN)();case 5:r=t.sent,b.innerText=e,w.innerText=(0,i.$T)(r.start,"YYYY-MM-DD hh:mm:ss"),x.innerText=(0,i.$T)(r.end,"YYYY-MM-DD hh:mm:ss");case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function j(){I("daily"),function(){E.apply(this,arguments)}()}function k(){(0,a.WR)("DataUsage"),d.setAttribute("displayed","true"),j(),(0,a.Z_)()}function _(){d.setAttribute("displayed","false"),(0,a.l$)()}function I(t){var e,r=l((0,o.jg)(m,".zj"));try{for(r.s();!(e=r.n()).done;){var n=e.value;n.getAttribute("period")===t?n.setAttribute("highlighted","true"):n.setAttribute("highlighted","false")}}catch(t){r.e(t)}finally{r.f()}!function(t){L.apply(this,arguments)}(t)}},6052:(t,e,r)=>{r.d(e,{c6:()=>h,pd:()=>d,z1:()=>p});var n=r(9566),o=r(3648),i=r(904),a=r(9119),c=(0,o.bv)(".zi"),u=(0,o.aI)(c,".dj"),l=(0,o.aI)(u,".ej"),s=(0,o.aI)(l,'.fj[group="folder-name"] .jj input'),f=(0,o.aI)(l,'.fj[group="folder-icon"] .jj .kj input');function h(){var t=s.value,e=f.value;(0,n.vV)(t,e).then((function(t){t?(p(),(0,a.a)("已建立資料夾","folder")):(0,a.a)("無法建立資料夾","error")}))}function d(){(0,i.WR)("FolderCreator"),c.setAttribute("displayed","true"),(0,i.Z_)()}function p(){c.setAttribute("displayed","false"),(0,i.l$)()}},9333:(t,e,r)=>{r.d(e,{Bo:()=>S,I6:()=>I,Lq:()=>O,cG:()=>A,uy:()=>_});var n=r(9566),o=r(8024),i=r(3648),a=r(904),c=r(4537),u=r(9119);function l(t){return l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},l(t)}function s(){s=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new P(n||[]);return o(a,"_invoke",{value:A(t,r,c)}),a}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var p="suspendedStart",v="suspendedYield",y="executing",m="completed",g={};function b(){}function w(){}function x(){}var L={};f(L,a,(function(){return this}));var E=Object.getPrototypeOf,j=E&&E(E(N([])));j&&j!==r&&n.call(j,a)&&(L=j);var k=x.prototype=b.prototype=Object.create(L);function _(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,i,a,c){var u=d(t[o],t,i);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==l(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function A(e,r,n){var o=p;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=O(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===p)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var l=d(e,r,n);if("normal"===l.type){if(o=n.done?m:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function O(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,O(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=d(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(l(e)+" is not iterable")}return w.prototype=x,o(k,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,u,"GeneratorFunction")),t.prototype=Object.create(k),t},e.awrap=function(t){return{__await:t}},_(I.prototype),f(I.prototype,c,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new I(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},_(k),f(k,u,"Generator"),f(k,a,(function(){return this})),f(k,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function f(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function h(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return d(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?d(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}var p=(0,i.bv)(".ci"),v=(0,i.aI)(p,".di"),y=(0,i.aI)(v,".ei"),m=(0,i.aI)(p,".gi"),g=(0,i.aI)(m,".hi"),b=(0,i.aI)(g,'.ii[group="folder-name"] .mi input'),w=(0,i.aI)(g,'.ii[group="folder-icon"] .mi .oi input'),x=(0,i.aI)(g,'.ii[group="folder-icon"] .mi .oi .pi'),L=(0,i.aI)(g,'.ii[group="folder-content"] .mi');function E(t,e){var r=(0,o.zx)("i"),n=document.createElement("div");n.id=r,n.classList.add("qi"),n.setAttribute("type",e.type);var i="",a="",u="";switch(e.type){case"stop":u="location_on",i="".concat(e.route?e.route.name:""," - 往").concat(e.route?[e.route.endPoints.destination,e.route.endPoints.departure,""][e.direction?e.direction:0]:""),a=e.name;break;case"route":u="route",i="".concat(e.endPoints.departure," ↔ ").concat(e.endPoints.destination),a=e.name;break;case"bus":i="",a=e.name;break;case"empty":u="lightbulb",i="提示",a="沒有內容";break;default:u="",i="null",a="null"}return n.innerHTML='<div class="ri">'.concat((0,c.Z)(u),'</div><div class="si">').concat(i,'</div><div class="ti">').concat(a,'</div><div class="ui"><div class="vi" onclick="bus.folder.moveItemOnFolderEditor(\'').concat(r,"', '").concat(t.id,"', '").concat(e.type,"', ").concat(e.id,", 'up')\">").concat((0,c.Z)("keyboard_arrow_down"),'</div><div class="wi" onclick="bus.folder.moveItemOnFolderEditor(\'').concat(r,"', '").concat(t.id,"', '").concat(e.type,"', ").concat(e.id,", 'down')\">").concat((0,c.Z)("keyboard_arrow_down"),'</div><div class="xi" onclick="bus.folder.removeItemOnFolderEditor(\'').concat(r,"', '").concat(t.id,"', '").concat(e.type,"', ").concat(e.id,')">').concat((0,c.Z)("delete"),'</div><div class="yi"></div><div class="yi"></div></div>'),{element:n,id:r}}function j(t,e){b.value=t.name,w.value=t.icon,t.default?(b.setAttribute("readonly","readonly"),w.setAttribute("readonly","readonly"),x.setAttribute("disabled","true")):(b.removeAttribute("readonly"),w.removeAttribute("readonly"),x.setAttribute("disabled","false")),y.setAttribute("onclick","bus.folder.saveEditedFolder('".concat(t.id,"')")),L.innerHTML="";var r,n=h(e);try{for(n.s();!(r=n.n()).done;){var o=E(t,r.value);L.appendChild(o.element)}}catch(t){n.e(t)}finally{n.f()}}function k(){var t;return t=s().mark((function t(e){var r,o;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,n.L2)(e);case 2:return r=t.sent,t.next=5,(0,n.eD)(e);case 5:o=t.sent,j(r,o);case 7:case"end":return t.stop()}}),t)})),k=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){f(i,n,o,a,c,"next",t)}function c(t){f(i,n,o,a,c,"throw",t)}a(void 0)}))},k.apply(this,arguments)}function _(t){(0,a.WR)("FolderEditor"),p.setAttribute("displayed","true"),function(t){k.apply(this,arguments)}(t),(0,a.Z_)()}function I(){p.setAttribute("displayed","false"),(0,a.l$)()}function A(t,e,r,o){var a=(0,i.aI)(p,'.gi .hi .ii[group="folder-content"] .mi .qi#'.concat(t));(0,n.NC)(e,r,o).then((function(t){if(t)switch(a.remove(),r){case"stop":(0,u.a)("已移除站牌","delete");break;case"route":(0,u.a)("已移除路線","delete")}else(0,u.a)("無法移除","error")}))}function O(t,e,r,o,a){var c=(0,i.aI)(p,'.gi .hi .ii[group="folder-content"] .mi .qi#'.concat(t));(0,n.bq)(e,r,o,a).then((function(t){if(t)switch(a){case"up":var e=c.previousElementSibling;e&&c.parentNode.insertBefore(c,e),(0,u.a)("已往上移","arrow_circle_up");break;case"down":var r=c.nextElementSibling;r&&c.parentNode.insertBefore(r,c),(0,u.a)("已往下移","arrow_circle_down")}else(0,u.a)("無法移動","error")}))}function S(t){var e=(0,n.L2)(t);e.name=b.value,e.icon=w.value,(0,n.g$)(e),I()}}}]);
//# sourceMappingURL=838d7e65f788e898a5c4.js.map
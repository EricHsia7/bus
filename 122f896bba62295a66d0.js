/*! For license information please see 122f896bba62295a66d0.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[6895],{3041:(t,r,e)=>{e.d(r,{BI:()=>d,Dh:()=>b,JL:()=>g,nS:()=>m});var n=e(3648),o=e(904),i=e(8024),a=e(9566),c=e(4537),u=e(9119);function f(t){return f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},f(t)}function s(){s=function(){return r};var t,r={},e=Object.prototype,n=e.hasOwnProperty,o=Object.defineProperty||function(t,r,e){t[r]=e.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function l(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{l({},"")}catch(t){l=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var i=r&&r.prototype instanceof b?r:b,a=Object.create(i.prototype),c=new T(n||[]);return o(a,"_invoke",{value:j(t,e,c)}),a}function p(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}r.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function b(){}function w(){}function x(){}var L={};l(L,a,(function(){return this}));var E=Object.getPrototypeOf,k=E&&E(E(N([])));k&&k!==e&&n.call(k,a)&&(L=k);var _=x.prototype=b.prototype=Object.create(L);function S(t){["next","throw","return"].forEach((function(r){l(t,r,(function(t){return this._invoke(r,t)}))}))}function O(t,r){function e(o,i,a,c){var u=p(t[o],t,i);if("throw"!==u.type){var s=u.arg,l=s.value;return l&&"object"==f(l)&&n.call(l,"__await")?r.resolve(l.__await).then((function(t){e("next",t,a,c)}),(function(t){e("throw",t,a,c)})):r.resolve(l).then((function(t){s.value=t,a(s)}),(function(t){return e("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new r((function(r,o){e(t,n,r,o)}))}return i=i?i.then(o,o):o()}})}function j(r,e,n){var o=y;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=A(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var f=p(r,e,n);if("normal"===f.type){if(o=n.done?m:v,f.arg===g)continue;return{value:f.arg,done:n.done}}"throw"===f.type&&(o=m,n.method="throw",n.arg=f.arg)}}}function A(r,e){var n=e.method,o=r.iterator[n];if(o===t)return e.delegate=null,"throw"===n&&r.iterator.return&&(e.method="return",e.arg=t,A(r,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,r.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[r.resultName]=a.value,e.next=r.nextLoc,"return"!==e.method&&(e.method="next",e.arg=t),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function I(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function P(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(I,this),this.reset(!0)}function N(r){if(r||""===r){var e=r[a];if(e)return e.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,i=function e(){for(;++o<r.length;)if(n.call(r,o))return e.value=r[o],e.done=!1,e;return e.value=t,e.done=!0,e};return i.next=i}}throw new TypeError(f(r)+" is not iterable")}return w.prototype=x,o(_,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===w||"GeneratorFunction"===(r.displayName||r.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,u,"GeneratorFunction")),t.prototype=Object.create(_),t},r.awrap=function(t){return{__await:t}},S(O.prototype),l(O.prototype,c,(function(){return this})),r.AsyncIterator=O,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new O(h(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(_),l(_,u,"Generator"),l(_,a,(function(){return this})),l(_,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=N,T.prototype={constructor:T,reset:function(r){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!r)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var e=this;function o(n,o){return c.type="throw",c.arg=r,e.next=n,o&&(e.method="next",e.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),f=n.call(a,"finallyLoc");if(u&&f){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!f)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),g},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),P(e),g}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;P(e)}return o}}throw Error("illegal catch attempt")},delegateYield:function(r,e,n){return this.delegate={iterator:N(r),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=t),g}},r}function l(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,r){if(t){if("string"==typeof t)return h(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?h(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==e.return||e.return()}finally{if(c)throw i}}}}function h(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}function p(t,r,e,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void e(t)}c.done?r(u):Promise.resolve(u).then(n,o)}function y(t,r,e){var n=(0,i.zx)("i"),o=document.createElement("div");switch(o.classList.add("sq"),o.id=n,r){case"stop":o.setAttribute("onclick","bus.folder.saveStopItemOnRoute('".concat(e[0],"', '").concat(t.folder.id,"', ").concat(e[1],", ").concat(e[2],")"));break;case"route":o.setAttribute("onclick","bus.folder.saveRouteOnDetailsPage('".concat(t.folder.id,"', ").concat(e[0],")"))}return o.innerHTML='<div class="tq">'.concat((0,c.Z)(t.folder.icon),'</div><div class="uq">').concat(t.folder.name,"</div>"),{element:o,id:n}}function v(){var t;return t=s().mark((function t(r,e){var o,i,c,u,f,h;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=(0,n.bv)(".mq"),(0,n.aI)(o,".qq .rq").innerHTML="",t.next=4,(0,a.Xi)();case 4:i=t.sent,c=l(i);try{for(c.s();!(u=c.n()).done;)f=u.value,h=y(f,r,e),(0,n.aI)(o,".qq .rq").appendChild(h.element)}catch(t){c.e(t)}finally{c.f()}case 7:case"end":return t.stop()}}),t)})),v=function(){var r=this,e=arguments;return new Promise((function(n,o){var i=t.apply(r,e);function a(t){p(i,n,o,a,c,"next",t)}function c(t){p(i,n,o,a,c,"throw",t)}a(void 0)}))},v.apply(this,arguments)}function d(t,r){(0,o.WR)("SaveToFolder"),(0,n.bv)(".mq").setAttribute("displayed","true"),function(t,r){v.apply(this,arguments)}(t,r)}function m(){(0,o.kr)("SaveToFolder"),(0,n.bv)(".mq").setAttribute("displayed","false")}function g(t,r,e,o){var i=(0,n.bv)(".dc .ec .fc .gc .hc .ic#".concat(t)),c=(0,n.aI)(i,'.yc .zc ._c[type="save-to-folder"]');(0,a.aq)(r,e,o).then((function(t){t?(0,a.Gs)("stop",e).then((function(t){t&&(c.setAttribute("highlighted",t),(0,u.a)("已儲存至資料夾","folder"),m())})):(0,u.a)("此資料夾不支援站牌類型項目","warning")}))}function b(t,r){var e=(0,n.bv)('.zh .di .ei .fi[group="actions"] .ji .ki[action="save-to-folder"]');(0,a.Fq)(t,r).then((function(t){t?(0,a.Gs)("route",r).then((function(t){t&&(e.setAttribute("highlighted","true"),(0,u.a)("已儲存至資料夾","folder"),m())})):(0,u.a)("此資料夾不支援路線類型項目","warning")}))}},752:(t,r,e)=>{e.d(r,{H9:()=>O,Ho:()=>_,b$:()=>S});var n=e(8011),o=e(4293),i=e(424),a=e(7053),c=e(77),u=e(3459),f=e(8024),s=e(3648),l=e(4537),h=e(904),p=e(9119);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function v(){v=function(){return r};var t,r={},e=Object.prototype,n=e.hasOwnProperty,o=Object.defineProperty||function(t,r,e){t[r]=e.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function f(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{f({},"")}catch(t){f=function(t,r,e){return t[r]=e}}function s(t,r,e,n){var i=r&&r.prototype instanceof b?r:b,a=Object.create(i.prototype),c=new T(n||[]);return o(a,"_invoke",{value:j(t,e,c)}),a}function l(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}r.wrap=s;var h="suspendedStart",p="suspendedYield",d="executing",m="completed",g={};function b(){}function w(){}function x(){}var L={};f(L,a,(function(){return this}));var E=Object.getPrototypeOf,k=E&&E(E(N([])));k&&k!==e&&n.call(k,a)&&(L=k);var _=x.prototype=b.prototype=Object.create(L);function S(t){["next","throw","return"].forEach((function(r){f(t,r,(function(t){return this._invoke(r,t)}))}))}function O(t,r){function e(o,i,a,c){var u=l(t[o],t,i);if("throw"!==u.type){var f=u.arg,s=f.value;return s&&"object"==y(s)&&n.call(s,"__await")?r.resolve(s.__await).then((function(t){e("next",t,a,c)}),(function(t){e("throw",t,a,c)})):r.resolve(s).then((function(t){f.value=t,a(f)}),(function(t){return e("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new r((function(r,o){e(t,n,r,o)}))}return i=i?i.then(o,o):o()}})}function j(r,e,n){var o=h;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=A(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var f=l(r,e,n);if("normal"===f.type){if(o=n.done?m:p,f.arg===g)continue;return{value:f.arg,done:n.done}}"throw"===f.type&&(o=m,n.method="throw",n.arg=f.arg)}}}function A(r,e){var n=e.method,o=r.iterator[n];if(o===t)return e.delegate=null,"throw"===n&&r.iterator.return&&(e.method="return",e.arg=t,A(r,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=l(o,r.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[r.resultName]=a.value,e.next=r.nextLoc,"return"!==e.method&&(e.method="next",e.arg=t),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function I(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function P(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(I,this),this.reset(!0)}function N(r){if(r||""===r){var e=r[a];if(e)return e.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,i=function e(){for(;++o<r.length;)if(n.call(r,o))return e.value=r[o],e.done=!1,e;return e.value=t,e.done=!0,e};return i.next=i}}throw new TypeError(y(r)+" is not iterable")}return w.prototype=x,o(_,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,u,"GeneratorFunction"),r.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===w||"GeneratorFunction"===(r.displayName||r.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,u,"GeneratorFunction")),t.prototype=Object.create(_),t},r.awrap=function(t){return{__await:t}},S(O.prototype),f(O.prototype,c,(function(){return this})),r.AsyncIterator=O,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new O(s(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(_),f(_,u,"Generator"),f(_,a,(function(){return this})),f(_,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=N,T.prototype={constructor:T,reset:function(r){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!r)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var e=this;function o(n,o){return c.type="throw",c.arg=r,e.next=n,o&&(e.method="next",e.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),f=n.call(a,"finallyLoc");if(u&&f){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!f)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),g},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),P(e),g}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;P(e)}return o}}throw Error("illegal catch attempt")},delegateYield:function(r,e,n){return this.delegate={iterator:N(r),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=t),g}},r}function d(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,r){if(t){if("string"==typeof t)return m(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?m(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==e.return||e.return()}finally{if(c)throw i}}}}function m(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}function g(t,r,e,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void e(t)}c.done?r(u):Promise.resolve(u).then(n,o)}function b(t){return function(){var r=this,e=arguments;return new Promise((function(n,o){var i=t.apply(r,e);function a(t){g(i,n,o,a,c,"next",t)}function c(t){g(i,n,o,a,c,"throw",t)}a(void 0)}))}}var w=(0,s.bv)(".vq"),x=(0,s.aI)(w,".zq"),L=(0,s.aI)(x,"._q");function E(t,r,e){var n=(0,f.zx)("i"),o=document.createElement("div");if(o.classList.add("ar"),o.id=n,"stop"===r)o.setAttribute("onclick","bus.notification.scheduleNotificationForStopItemOnRoute('".concat(e[0],"', ").concat(e[1],", ").concat(e[2],", ").concat(e[3],", ").concat(t.index,")"));return o.innerHTML='<div class="br">'.concat((0,l.Z)(t.icon),'</div><div class="cr">').concat(t.name,"</div>"),{element:o,id:n}}function k(){return(k=b(v().mark((function t(r,e){var n,o,i,a,u;return v().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:L.innerHTML="",n=new DocumentFragment,o=d(c.FX);try{for(o.s();!(i=o.n()).done;)a=i.value,u=E(a,r,e),n.append(u.element)}catch(t){o.e(t)}finally{o.f()}L.append(n);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function _(t,r){(0,h.WR)("ScheduleNotification"),w.setAttribute("displayed","true"),function(t,r){k.apply(this,arguments)}(t,r)}function S(){(0,h.kr)("ScheduleNotification"),w.setAttribute("displayed","false")}function O(t,r,e,n,o){return j.apply(this,arguments)}function j(){return(j=b(v().mark((function t(r,e,l,h,y){var d,m,g,b,w,x,L,E,k,_,O,j,A,I,P,T,N,G,q,F,z,H,M,C;return v().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(d=(0,s.bv)(".dc .ec .fc .gc .hc .ic#".concat(r)),m=(0,s.aI)(d,'.yc .zc ._c[type="schedule-notification"]'),!(0,c.hc)()){t.next=64;break}return(0,p.a)("處理中","manufacturing"),m.setAttribute("enabled","false"),S(),g=(0,u.Js)("time_formatting_mode"),b=(0,f.zx)("r"),t.next=10,(0,i.T)(b);case 10:return w=t.sent,t.next=13,(0,n.g)(b,!1);case 13:return x=t.sent,t.next=16,(0,o.a)(b,!0);case 16:if(L=t.sent,E="s_".concat(e),k={},!w.hasOwnProperty(E)){t.next=23;break}k=w[E],t.next=24;break;case 23:case 32:case 40:return t.abrupt("return");case 24:if(_=k.stopLocationId,O=k.goBack,j="l_".concat(_),A={},!x.hasOwnProperty(j)){t.next=32;break}A=x[j],t.next=33;break;case 33:if(I=A.n,P="r_".concat(l),T={},!L.hasOwnProperty(P)){t.next=40;break}T=L[P],t.next=41;break;case 41:return N=T.n,G=T.dep,q=T.des,F=[q,G,""][O?parseInt(O):0],z=c.FX[y],H=z.time_offset,M=(new Date).getTime(),C=M+1e3*h+60*H*1e3,t.next=51,(0,a.Z)(e,I,l,N,F,h,g,H,C);case 51:if(!1!==t.sent){t.next=58;break}return(0,p.a)("設定失敗","error"),m.setAttribute("enabled","true"),t.abrupt("return");case 58:return(0,p.a)("設定成功","check_circle"),m.setAttribute("enabled","true"),m.setAttribute("highlighted","true"),t.abrupt("return");case 62:t.next=67;break;case 64:return(0,p.a)("在設定中註冊後才可設定到站通知","warning"),S(),t.abrupt("return");case 67:case"end":return t.stop()}}),t)})))).apply(this,arguments)}}}]);
//# sourceMappingURL=122f896bba62295a66d0.js.map
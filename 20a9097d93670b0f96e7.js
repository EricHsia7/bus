/*! For license information please see 20a9097d93670b0f96e7.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[777],{424:(t,r,e)=>{e.d(r,{T:()=>m});var n=e(3153),o=e(6788),a=e(4311);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function c(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,r){if(t){if("string"==typeof t)return u(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?u(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw a}}}}function u(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}function s(){s=function(){return r};var t,r={},e=Object.prototype,n=e.hasOwnProperty,o=Object.defineProperty||function(t,r,e){t[r]=e.value},a="function"==typeof Symbol?Symbol:{},c=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",f=a.toStringTag||"@@toStringTag";function l(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{l({},"")}catch(t){l=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var a=r&&r.prototype instanceof w?r:w,i=Object.create(a.prototype),c=new I(n||[]);return o(i,"_invoke",{value:j(t,e,c)}),i}function p(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}r.wrap=h;var y="suspendedStart",v="suspendedYield",m="executing",d="completed",g={};function w(){}function b(){}function x(){}var L={};l(L,c,(function(){return this}));var E=Object.getPrototypeOf,_=E&&E(E(A([])));_&&_!==e&&n.call(_,c)&&(L=_);var S=x.prototype=w.prototype=Object.create(L);function k(t){["next","throw","return"].forEach((function(r){l(t,r,(function(t){return this._invoke(r,t)}))}))}function O(t,r){function e(o,a,c,u){var s=p(t[o],t,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==i(l)&&n.call(l,"__await")?r.resolve(l.__await).then((function(t){e("next",t,c,u)}),(function(t){e("throw",t,c,u)})):r.resolve(l).then((function(t){f.value=t,c(f)}),(function(t){return e("throw",t,c,u)}))}u(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new r((function(r,o){e(t,n,r,o)}))}return a=a?a.then(o,o):o()}})}function j(r,e,n){var o=y;return function(a,i){if(o===m)throw Error("Generator is already running");if(o===d){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=T(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var s=p(r,e,n);if("normal"===s.type){if(o=n.done?d:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function T(r,e){var n=e.method,o=r.iterator[n];if(o===t)return e.delegate=null,"throw"===n&&r.iterator.return&&(e.method="return",e.arg=t,T(r,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,r.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,g;var i=a.arg;return i?i.done?(e[r.resultName]=i.value,e.next=r.nextLoc,"return"!==e.method&&(e.method="next",e.arg=t),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function N(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function P(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function A(r){if(r||""===r){var e=r[c];if(e)return e.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,a=function e(){for(;++o<r.length;)if(n.call(r,o))return e.value=r[o],e.done=!1,e;return e.value=t,e.done=!0,e};return a.next=a}}throw new TypeError(i(r)+" is not iterable")}return b.prototype=x,o(S,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:b,configurable:!0}),b.displayName=l(x,f,"GeneratorFunction"),r.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===b||"GeneratorFunction"===(r.displayName||r.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,f,"GeneratorFunction")),t.prototype=Object.create(S),t},r.awrap=function(t){return{__await:t}},k(O.prototype),l(O.prototype,u,(function(){return this})),r.AsyncIterator=O,r.async=function(t,e,n,o,a){void 0===a&&(a=Promise);var i=new O(h(t,e,n,o),a);return r.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},k(S),l(S,f,"Generator"),l(S,c,(function(){return this})),l(S,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=A,I.prototype={constructor:I,reset:function(r){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!r)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var e=this;function o(n,o){return c.type="throw",c.arg=r,e.next=n,o&&(e.method="next",e.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=r&&r<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=r,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),g},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),P(e),g}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;P(e)}return o}}throw Error("illegal catch attempt")},delegateYield:function(r,e,n){return this.delegate={iterator:A(r),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=t),g}},r}function f(t,r,e,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void e(t)}c.done?r(u):Promise.resolve(u).then(n,o)}function l(t){return function(){var r=this,e=arguments;return new Promise((function(n,o){var a=t.apply(r,e);function i(t){f(a,n,o,i,c,"next",t)}function c(t){f(a,n,o,i,c,"throw",t)}i(void 0)}))}}var h=!1,p={};function y(t){return v.apply(this,arguments)}function v(){return(v=l(s().mark((function t(r){var n,o;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=new Worker(new URL(e.p+e.u(1132),e.b)),t.next=3,new Promise((function(t,e){n.onmessage=function(r){t(r.data),n.terminate()},n.onerror=function(t){e(t.message),n.terminate()},n.postMessage(r)}));case 3:return o=t.sent,t.abrupt("return",o);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function m(t){return d.apply(this,arguments)}function d(){return d=l(s().mark((function t(r){var e,i,u,f,v,m,d,g;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i=function(){return i=l(s().mark((function t(){var e,a,i,u,f,l;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=[[0,11],[1,11]].map((function(t){return{url:(0,n.y)(t[0],t[1]),e:t}})),a=[],i=c(e),t.prev=3,i.s();case 5:if((u=i.n()).done){t.next=14;break}return f=u.value,t.next=9,(0,o.Fd)(f.url,r,"getStop_".concat(f.e[0]),"json");case 9:l=t.sent,a=a.concat(l.BusInfo),(0,o.ZL)(r,l.EssentialInfo.UpdateTime);case 12:t.next=5;break;case 14:t.next=19;break;case 16:t.prev=16,t.t0=t.catch(3),i.e(t.t0);case 19:return t.prev=19,i.f(),t.finish(19);case 22:return t.abrupt("return",a);case 23:case"end":return t.stop()}}),t,null,[[3,16,19,22]])}))),i.apply(this,arguments)},e=function(){return i.apply(this,arguments)},u=2592e6,f="bus_stop_cache",t.next=6,(0,a.Ct)(0,"".concat(f,"_timestamp"));case 6:if(null!==(v=t.sent)){t.next=22;break}return t.next=10,e();case 10:return m=t.sent,t.next=13,y(m);case 13:return d=t.sent,t.next=16,(0,a.mL)(0,"".concat(f,"_timestamp"),(new Date).getTime());case 16:return t.next=18,(0,a.mL)(0,"".concat(f),JSON.stringify(d));case 18:return h||(h=!0,p=d),t.abrupt("return",d);case 22:if(!((new Date).getTime()-parseInt(v)>u)){t.next=36;break}return t.next=25,e();case 25:return m=t.sent,t.next=28,y(m);case 28:return d=t.sent,t.next=31,(0,a.mL)(0,"".concat(f,"_timestamp"),(new Date).getTime());case 31:return t.next=33,(0,a.mL)(0,"".concat(f),JSON.stringify(d));case 33:return t.abrupt("return",d);case 36:if(h){t.next=42;break}return t.next=39,(0,a.Ct)(0,"".concat(f));case 39:g=t.sent,h=!0,p=JSON.parse(g);case 42:return(0,o.Mf)(r,"getStop_0",0,!0),(0,o.Mf)(r,"getStop_1",0,!0),(0,o.ZL)(r,-1),t.abrupt("return",p);case 46:case"end":return t.stop()}}),t)}))),d.apply(this,arguments)}},8671:(t,r,e)=>{e.d(r,{s:()=>y});var n=e(3153),o=e(6788),a=e(4311);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function c(){c=function(){return r};var t,r={},e=Object.prototype,n=e.hasOwnProperty,o=Object.defineProperty||function(t,r,e){t[r]=e.value},a="function"==typeof Symbol?Symbol:{},u=a.iterator||"@@iterator",s=a.asyncIterator||"@@asyncIterator",f=a.toStringTag||"@@toStringTag";function l(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{l({},"")}catch(t){l=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var a=r&&r.prototype instanceof w?r:w,i=Object.create(a.prototype),c=new I(n||[]);return o(i,"_invoke",{value:j(t,e,c)}),i}function p(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}r.wrap=h;var y="suspendedStart",v="suspendedYield",m="executing",d="completed",g={};function w(){}function b(){}function x(){}var L={};l(L,u,(function(){return this}));var E=Object.getPrototypeOf,_=E&&E(E(A([])));_&&_!==e&&n.call(_,u)&&(L=_);var S=x.prototype=w.prototype=Object.create(L);function k(t){["next","throw","return"].forEach((function(r){l(t,r,(function(t){return this._invoke(r,t)}))}))}function O(t,r){function e(o,a,c,u){var s=p(t[o],t,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==i(l)&&n.call(l,"__await")?r.resolve(l.__await).then((function(t){e("next",t,c,u)}),(function(t){e("throw",t,c,u)})):r.resolve(l).then((function(t){f.value=t,c(f)}),(function(t){return e("throw",t,c,u)}))}u(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new r((function(r,o){e(t,n,r,o)}))}return a=a?a.then(o,o):o()}})}function j(r,e,n){var o=y;return function(a,i){if(o===m)throw Error("Generator is already running");if(o===d){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=T(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var s=p(r,e,n);if("normal"===s.type){if(o=n.done?d:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function T(r,e){var n=e.method,o=r.iterator[n];if(o===t)return e.delegate=null,"throw"===n&&r.iterator.return&&(e.method="return",e.arg=t,T(r,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,r.iterator,e.arg);if("throw"===a.type)return e.method="throw",e.arg=a.arg,e.delegate=null,g;var i=a.arg;return i?i.done?(e[r.resultName]=i.value,e.next=r.nextLoc,"return"!==e.method&&(e.method="next",e.arg=t),e.delegate=null,g):i:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function N(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function P(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function A(r){if(r||""===r){var e=r[u];if(e)return e.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,a=function e(){for(;++o<r.length;)if(n.call(r,o))return e.value=r[o],e.done=!1,e;return e.value=t,e.done=!0,e};return a.next=a}}throw new TypeError(i(r)+" is not iterable")}return b.prototype=x,o(S,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:b,configurable:!0}),b.displayName=l(x,f,"GeneratorFunction"),r.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===b||"GeneratorFunction"===(r.displayName||r.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,f,"GeneratorFunction")),t.prototype=Object.create(S),t},r.awrap=function(t){return{__await:t}},k(O.prototype),l(O.prototype,s,(function(){return this})),r.AsyncIterator=O,r.async=function(t,e,n,o,a){void 0===a&&(a=Promise);var i=new O(h(t,e,n,o),a);return r.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},k(S),l(S,f,"Generator"),l(S,u,(function(){return this})),l(S,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=A,I.prototype={constructor:I,reset:function(r){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!r)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var e=this;function o(n,o){return c.type="throw",c.arg=r,e.next=n,o&&(e.method="next",e.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=r&&r<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=r,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),g},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),P(e),g}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;P(e)}return o}}throw Error("illegal catch attempt")},delegateYield:function(r,e,n){return this.delegate={iterator:A(r),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=t),g}},r}function u(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,r){if(t){if("string"==typeof t)return s(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?s(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw a}}}}function s(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}function f(t,r,e,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void e(t)}c.done?r(u):Promise.resolve(u).then(n,o)}function l(t){return function(){var r=this,e=arguments;return new Promise((function(n,o){var a=t.apply(r,e);function i(t){f(a,n,o,i,c,"next",t)}function c(t){f(a,n,o,i,c,"throw",t)}i(void 0)}))}}var h=!1,p={};function y(t){return v.apply(this,arguments)}function v(){return v=l(c().mark((function t(r){var e,i,s,f,y,v,m;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i=function(){return i=l(c().mark((function t(){var e,a,i,s,f,l;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=[[0,14],[1,14]].map((function(t){return{url:(0,n.y)(t[0],t[1]),e:t}})),a=[],i=u(e),t.prev=3,i.s();case 5:if((s=i.n()).done){t.next=14;break}return f=s.value,t.next=9,(0,o.Fd)(f.url,r,"getTimeTable_".concat(f.e[0]),"json");case 9:l=t.sent,a=a.concat(l.BusInfo),(0,o.ZL)(r,l.EssentialInfo.UpdateTime);case 12:t.next=5;break;case 14:t.next=19;break;case 16:t.prev=16,t.t0=t.catch(3),i.e(t.t0);case 19:return t.prev=19,i.f(),t.finish(19);case 22:return t.abrupt("return",a);case 23:case"end":return t.stop()}}),t,null,[[3,16,19,22]])}))),i.apply(this,arguments)},e=function(){return i.apply(this,arguments)},s=12096e5,f="bus_timetable_cache",t.next=6,(0,a.Ct)(0,"".concat(f,"_timestamp"));case 6:if(null!==(y=t.sent)){t.next=19;break}return t.next=10,e();case 10:return v=t.sent,t.next=13,(0,a.mL)(0,"".concat(f,"_timestamp"),(new Date).getTime());case 13:return t.next=15,(0,a.mL)(0,"".concat(f),JSON.stringify(v));case 15:return h||(h=!0,p=v),t.abrupt("return",v);case 19:if(!((new Date).getTime()-parseInt(y)>s)){t.next=30;break}return t.next=22,e();case 22:return v=t.sent,t.next=25,(0,a.mL)(0,"".concat(f,"_timestamp"),(new Date).getTime());case 25:return t.next=27,(0,a.mL)(0,"".concat(f),JSON.stringify(v));case 27:return t.abrupt("return",v);case 30:if(h){t.next=36;break}return t.next=33,(0,a.Ct)(0,"".concat(f));case 33:m=t.sent,h=!0,p=JSON.parse(m);case 36:return(0,o.Mf)(r,"getTimeTable_0",0,!0),(0,o.Mf)(r,"getTimeTable_1",0,!0),(0,o.ZL)(r,-1),t.abrupt("return",p);case 40:case"end":return t.stop()}}),t)}))),v.apply(this,arguments)}}}]);
//# sourceMappingURL=20a9097d93670b0f96e7.js.map
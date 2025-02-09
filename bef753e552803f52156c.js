/*! For license information please see bef753e552803f52156c.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[8853],{5427:(t,e,r)=>{r.d(e,{Qx:()=>k});var n=r(9566),o=r(5352),a=r(5314),i=r(3459),c=r(4311);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function s(){s=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",f=a.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new A(n||[]);return o(i,"_invoke",{value:j(t,r,c)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function b(){}function x(){}function w(){}var k={};l(k,i,(function(){return this}));var L=Object.getPrototypeOf,_=L&&L(L(N([])));_&&_!==r&&n.call(_,i)&&(k=_);var E=w.prototype=b.prototype=Object.create(k);function S(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,a,i,c){var s=p(t[o],t,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==u(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(l).then((function(t){f.value=t,i(f)}),(function(t){return r("throw",t,i,c)}))}c(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function j(e,r,n){var o=y;return function(a,i){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?m:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function P(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,P(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function I(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function A(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(I,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(u(e)+" is not iterable")}return x.prototype=w,o(E,"constructor",{value:w,configurable:!0}),o(w,"constructor",{value:x,configurable:!0}),x.displayName=l(w,f,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,l(t,f,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},S(O.prototype),l(O.prototype,c,(function(){return this})),e.AsyncIterator=O,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new O(h(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},S(E),l(E,f,"Generator"),l(E,i,(function(){return this})),l(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,A.prototype={constructor:A,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function f(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return l(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?l(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw a}}}}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function h(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function p(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){h(a,n,o,i,c,"next",t)}function c(t){h(a,n,o,i,c,"throw",t)}i(void 0)}))}}function y(t){return v.apply(this,arguments)}function v(){return(v=p(s().mark((function t(e){var r,o,a,i,u,l,h,p,y,v,d,m,g;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((o=r.n()).done){t.next=59;break}return a=o.value,u=!1,l=!1,h="f_".concat((i=a).id),t.next=11,(0,c.Ct)(9,h);case 11:if(!t.sent){t.next=18;break}return t.next=15,(0,n.g$)(i.id,i.name,i.icon);case 15:u=t.sent,t.next=21;break;case 18:return t.next=20,(0,n.vV)(i.name,i.icon);case 20:l=t.sent;case 21:if(!u){t.next=39;break}p=f(a.content),t.prev=23,p.s();case 25:if((y=p.n()).done){t.next=31;break}return v=y.value,t.next=29,(0,n.z$)(a.id,v);case 29:t.next=25;break;case 31:t.next=36;break;case 33:t.prev=33,t.t0=t.catch(23),p.e(t.t0);case 36:return t.prev=36,p.f(),t.finish(36);case 39:if(!l){t.next=57;break}d=f(a.content),t.prev=41,d.s();case 43:if((m=d.n()).done){t.next=49;break}return g=m.value,t.next=47,(0,n.z$)(l,g);case 47:t.next=43;break;case 49:t.next=54;break;case 51:t.prev=51,t.t1=t.catch(41),d.e(t.t1);case 54:return t.prev=54,d.f(),t.finish(54);case 57:t.next=3;break;case 59:t.next=64;break;case 61:t.prev=61,t.t2=t.catch(1),r.e(t.t2);case 64:return t.prev=64,r.f(),t.finish(64);case 67:case"end":return t.stop()}}),t,null,[[1,61,64,67],[23,33,36,39],[41,51,54,57]])})))).apply(this,arguments)}function d(t){return m.apply(this,arguments)}function m(){return(m=p(s().mark((function t(e){var r,n,o,a;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((n=r.n()).done){t.next=12;break}if(o=n.value,!(a=(0,i.PL)(o.key))){t.next=10;break}if("select"!==a.type){t.next=10;break}return t.next=10,(0,i.aN)(o.key,o.option);case 10:t.next=3;break;case 12:t.next=17;break;case 14:t.prev=14,t.t0=t.catch(1),r.e(t.t0);case 17:return t.prev=17,r.f(),t.finish(17);case 20:return t.abrupt("return",!0);case 21:case"end":return t.stop()}}),t,null,[[1,14,17,20]])})))).apply(this,arguments)}function g(t){return b.apply(this,arguments)}function b(){return(b=p(s().mark((function t(e){var r,n,a;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((n=r.n()).done){t.next=17;break}return a=n.value,t.next=7,(0,o.qZ)(a.id);case 7:if(!t.sent){t.next=13;break}return t.next=11,(0,o.nL)(a);case 11:t.next=15;break;case 13:return t.next=15,(0,o.Qh)(a.name,a.period.start.hours,a.period.start.minutes,a.period.end.hours,a.period.end.minutes,a.days);case 15:t.next=3;break;case 17:t.next=22;break;case 19:t.prev=19,t.t0=t.catch(1),r.e(t.t0);case 22:return t.prev=22,r.f(),t.finish(22);case 25:return t.abrupt("return",!0);case 26:case"end":return t.stop()}}),t,null,[[1,19,22,25]])})))).apply(this,arguments)}function x(t){return w.apply(this,arguments)}function w(){return(w=p(s().mark((function t(e){var r,n,o;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((n=r.n()).done){t.next=32;break}o=n.value,t.t0=o.type,t.next="route"===t.t0?8:"location"===t.t0?15:"bus"===t.t0?22:29;break;case 8:return t.next=10,(0,a.DF)("route",o.id);case 10:if(t.sent){t.next=14;break}return t.next=14,(0,a.XK)(o.type,o.id);case 14:return t.abrupt("break",30);case 15:return t.next=17,(0,a.DF)("location",o.hash);case 17:if(t.sent){t.next=21;break}return t.next=21,(0,a.XK)(o.type,o.hash);case 21:return t.abrupt("break",30);case 22:return t.next=24,(0,a.DF)("bus",o.id);case 24:if(t.sent){t.next=28;break}return t.next=28,(0,a.XK)(o.type,o.id);case 28:case 29:return t.abrupt("break",30);case 30:t.next=3;break;case 32:t.next=37;break;case 34:t.prev=34,t.t1=t.catch(1),r.e(t.t1);case 37:return t.prev=37,r.f(),t.finish(37);case 40:return t.abrupt("return",!0);case 41:case"end":return t.stop()}}),t,null,[[1,34,37,40]])})))).apply(this,arguments)}function k(t){return L.apply(this,arguments)}function L(){return(L=p(s().mark((function t(e){var r;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=JSON.parse(e),t.t0=r.version,t.next=1===t.t0?4:2===t.t0?8:3===t.t0?14:4===t.t0?22:32;break;case 4:return t.next=6,y(r.folders);case 6:case 12:case 20:case 30:return t.abrupt("return",!0);case 8:return t.next=10,y(r.folders);case 10:return t.next=12,d(r.settings);case 14:return t.next=16,y(r.folders);case 16:return t.next=18,d(r.settings);case 18:return t.next=20,g(r.personal_schedules);case 22:return t.next=24,y(r.folders);case 24:return t.next=26,d(r.settings);case 26:return t.next=28,g(r.personal_schedules);case 28:return t.next=30,x(r.recent_views);case 32:return t.abrupt("return",!1);case 34:case"end":return t.stop()}}),t)})))).apply(this,arguments)}},2757:(t,e,r)=>{r.d(e,{R:()=>k});var n=r(6788),o=r(2063),a=r(8011),i=r(7810),c=r(4293),u=r(424),s=r(3459),f=r(4256),l=r(2945),h=r(2303),p=r(8932),y=r(6802);function v(t){return v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},v(t)}function d(){d=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new A(n||[]);return o(i,"_invoke",{value:j(t,r,c)}),i}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var h="suspendedStart",p="suspendedYield",y="executing",m="completed",g={};function b(){}function x(){}function w(){}var k={};s(k,i,(function(){return this}));var L=Object.getPrototypeOf,_=L&&L(L(N([])));_&&_!==r&&n.call(_,i)&&(k=_);var E=w.prototype=b.prototype=Object.create(k);function S(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,a,i,c){var u=l(t[o],t,a);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==v(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(f).then((function(t){s.value=t,i(s)}),(function(t){return r("throw",t,i,c)}))}c(u.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function j(e,r,n){var o=h;return function(a,i){if(o===y)throw Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var s=l(e,r,n);if("normal"===s.type){if(o=n.done?m:p,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function P(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,P(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=l(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function I(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function A(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(I,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(v(e)+" is not iterable")}return x.prototype=w,o(E,"constructor",{value:w,configurable:!0}),o(w,"constructor",{value:x,configurable:!0}),x.displayName=s(w,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,s(t,u,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},S(O.prototype),s(O.prototype,c,(function(){return this})),e.AsyncIterator=O,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new O(f(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},S(E),s(E,u,"Generator"),s(E,i,(function(){return this})),s(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,A.prototype={constructor:A,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function m(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function g(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return b(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?b(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw a}}}}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function x(t,e){var r,n={},o=g(t);try{for(o.s();!(r=o.n()).done;){var a=r.value;if(e.indexOf(a.StopID)>-1)n["s_".concat(a.StopID)]=a}}catch(t){o.e(t)}finally{o.f()}return n}function w(t,e){var r={},n=[];for(var o in t){var a=t[o],i=a.StopID,c=parseInt(a.EstimateTime);c>=0&&e.indexOf(i)>-1&&n.push([i,c])}var u=n.length;n.sort((function(t,e){return t[1]-e[1]}));for(var s=1,f=0,l=n;f<l.length;f++){var h=s/u,p=(h-h%.25)/.25,y=l[f][0];r["s_".concat(y)]={number:s,text:s.toString(),code:p},s+=1}return r}function k(t,e){return L.apply(this,arguments)}function L(){var t;return t=d().mark((function t(e,r){var v,m,g,b,k,L,_,E,S,O,j,P,I,T,A,N,G,F,M,D,$,C,Q,J,K,Y,B,R,U,X,q,z,V,Z,H,W,tt,et,rt,nt,ot,at,it,ct,ut,st;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(0,n.Mf)(r,"getLocation_0",0,!1),(0,n.Mf)(r,"getLocation_1",0,!1),(0,n.Mf)(r,"getRoute_0",0,!1),(0,n.Mf)(r,"getRoute_1",0,!1),(0,n.Mf)(r,"getStop_0",0,!1),(0,n.Mf)(r,"getStop_1",0,!1),(0,n.Mf)(r,"getEstimateTime_0",0,!1),(0,n.Mf)(r,"getEstimateTime_1",0,!1),(0,n.Mf)(r,"getBusEvent_0",0,!1),(0,n.Mf)(r,"getBusEvent_1",0,!1),t.next=12,(0,o.K)(r);case 12:return v=t.sent,t.next=15,(0,a.g)(r,!0);case 15:return m=t.sent,t.next=18,(0,c.a)(r,!0);case 18:return g=t.sent,t.next=21,(0,u.T)(r);case 21:return b=t.sent,t.next=24,(0,i.J)(r);case 24:return k=t.sent,t.next=27,(0,y.d)(r);case 27:return L=t.sent,t.next=30,(0,p.Io)();case 30:for(_=t.sent,E=(0,s.Js)("time_formatting_mode"),S=(0,s.Js)("location_labels"),O={},j={},P={},I="ml_".concat(e),T=m[I],A=T.n,N=T.id,G=T.v,F=[],M=[],D=N.length,$=0;$<D;$++)F=F.concat(T.s[$]),M=M.concat(T.r[$]);C=x(v,F),Q=(0,h.AS)(k,L,g,F),J=[],t.t0=S,t.next="address"===t.t0?51:"letters"===t.t0?53:"directions"===t.t0?55:57;break;case 51:return J=(0,f._q)(T.a),t.abrupt("break",58);case 53:return J=(0,l.V)(D),t.abrupt("break",58);case 55:return J=(0,l.M)(G),t.abrupt("break",58);case 57:return t.abrupt("break",58);case 58:K=0;case 59:if(!(K<D)){t.next=117;break}Y="g_".concat(K),O[Y]=[],j[Y]=0,P[Y]={name:J[K],properties:[{key:"address",icon:"personal_places",value:(0,f.pD)(T.a[K])},{key:"exact_position",icon:"location_on",value:"".concat(T.la[K].toFixed(5),", ").concat(T.lo[K].toFixed(5))}]},B=T.s[K],R=B.length,U=w(C,B),X=0;case 68:if(!(X<R)){t.next=114;break}if(q={},z=T.s[K][X],V="s_".concat(z),Z={},!b.hasOwnProperty(V)){t.next=77;break}Z=b[V],t.next=78;break;case 77:return t.abrupt("continue",111);case 78:if(q.stopId=z,H={number:0,text:"--",code:-1},U.hasOwnProperty(V)&&(H=U[V]),q.ranking=H,W=T.r[K][X],tt="r_".concat(W),et={},!g.hasOwnProperty(tt)){t.next=89;break}et=g[tt],t.next=90;break;case 89:return t.abrupt("continue",111);case 90:if(q.route_name=et.n,q.route_direction="往".concat([et.des,et.dep,""][parseInt(Z.goBack)]),q.routeId=W,rt={},!C.hasOwnProperty(V)){t.next=98;break}rt=C[V],t.next=99;break;case 98:return t.abrupt("continue",111);case 99:for(ct in nt=(0,h.$Q)(rt.EstimateTime,E),q.status=nt,ot=[],Q.hasOwnProperty(V)&&(ot=Q[V].map((function(t){return(0,h.s$)(t)}))),q.buses=ot,at={},_.hasOwnProperty(V)&&(at=_[V]),it=[],at)it=it.concat(at[ct].busArrivalTimes);q.busArrivalTimes=it,O[Y].push(q),j[Y]+=1;case 111:X++,t.next=68;break;case 114:K++,t.next=59;break;case 117:for(ut in O)O[ut].sort((function(t,e){return t.routeId-e.routeId}));return st={groupedItems:O,groups:P,groupQuantity:D,itemQuantity:j,LocationName:A,dataUpdateTime:(0,n.Zt)(r)},(0,n.LQ)(r),(0,n.gC)(r),t.abrupt("return",st);case 122:case"end":return t.stop()}}),t)})),L=function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){m(a,n,o,i,c,"next",t)}function c(t){m(a,n,o,i,c,"throw",t)}i(void 0)}))},L.apply(this,arguments)}}}]);
//# sourceMappingURL=bef753e552803f52156c.js.map
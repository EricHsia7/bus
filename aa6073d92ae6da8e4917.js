/*! For license information please see aa6073d92ae6da8e4917.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[874],{5352:(t,e,r)=>{r.r(e),r.d(e,{createPersonalSchedule:()=>l,getMergedPersonalScheduleTimeline:()=>b,getPersonalSchedule:()=>p,isInPersonalSchedule:()=>x,listPersonalSchedules:()=>d,updatePersonalSchedule:()=>v});var n=r(8024),o=r(4311);function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function i(){i=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},u="function"==typeof Symbol?Symbol:{},c=u.iterator||"@@iterator",s=u.asyncIterator||"@@asyncIterator",f=u.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),u=new P(n||[]);return o(i,"_invoke",{value:N(t,r,u)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",m="executing",d="completed",g={};function b(){}function w(){}function x(){}var k={};l(k,c,(function(){return this}));var S=Object.getPrototypeOf,L=S&&S(S(G([])));L&&L!==r&&n.call(L,c)&&(k=L);var O=x.prototype=b.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,i,u,c){var s=p(t[o],t,i);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==a(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,u,c)}),(function(t){r("throw",t,u,c)})):e.resolve(l).then((function(t){f.value=t,u(f)}),(function(t){return r("throw",t,u,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function N(e,r,n){var o=y;return function(a,i){if(o===m)throw Error("Generator is already running");if(o===d){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var u=n.delegate;if(u){var c=_(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?d:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function G(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(a(e)+" is not iterable")}return w.prototype=x,o(O,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,f,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,f,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},E(I.prototype),l(I.prototype,s,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new I(h(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(O),l(O,f,"Generator"),l(O,c,(function(){return this})),l(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=G,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(j),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],u=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),j(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:G(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function u(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return c(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){u=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw a}}}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e,r,n,o,a,i){try{var u=t[a](i),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function f(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){s(a,n,o,i,u,"next",t)}function u(t){s(a,n,o,i,u,"throw",t)}i(void 0)}))}}function l(t,e,r,n,o,a){return h.apply(this,arguments)}function h(){return(h=f(i().mark((function t(e,r,a,c,s,f){var l,h,p,y,v;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(l=(0,n.generateIdentifier)("s"),!(r<0||r>23||a<0||a>59||c<0||c>23||s<0||s>59)){t.next=3;break}return t.abrupt("return",!1);case 3:if(Number.isInteger(r)&&Number.isInteger(a)&&Number.isInteger(c)&&Number.isInteger(s)){t.next=5;break}return t.abrupt("return",!1);case 5:if(!(f.length>7)){t.next=7;break}return t.abrupt("return",!1);case 7:h=u(f),t.prev=8,h.s();case 10:if((p=h.n()).done){t.next=17;break}if("number"!=typeof(y=p.value)){t.next=15;break}if(!(y<0||y>6)&&Number.isInteger(y)){t.next=15;break}return t.abrupt("return",!1);case 15:t.next=10;break;case 17:t.next=22;break;case 19:t.prev=19,t.t0=t.catch(8),h.e(t.t0);case 22:return t.prev=22,h.f(),t.finish(22);case 25:return v={name:e,period:{start:{hours:r,minutes:a},end:{hours:c,minutes:s}},days:f,id:l},t.next=28,(0,o.lfSetItem)(5,l,JSON.stringify(v));case 28:return t.abrupt("return",!0);case 29:case"end":return t.stop()}}),t,null,[[8,19,22,25]])})))).apply(this,arguments)}function p(t){return y.apply(this,arguments)}function y(){return(y=f(i().mark((function t(e){var r,n;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,o.lfGetItem)(5,e);case 2:if(!(r=t.sent)){t.next=6;break}return n=JSON.parse(r),t.abrupt("return",n);case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function v(t){return m.apply(this,arguments)}function m(){return(m=f(i().mark((function t(e){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p(e.id);case 2:if(!t.sent){t.next=6;break}return t.next=6,(0,o.lfSetItem)(5,e.id,JSON.stringify(e));case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function d(){return g.apply(this,arguments)}function g(){return(g=f(i().mark((function t(){var e,r,n,a,c,s,f;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=[],t.next=3,(0,o.lfListItemKeys)(5);case 3:r=t.sent,n=u(r),t.prev=5,n.s();case 7:if((a=n.n()).done){t.next=15;break}return c=a.value,t.next=11,(0,o.lfGetItem)(5,c);case 11:(s=t.sent)&&(f=JSON.parse(s),e.push(f));case 13:t.next=7;break;case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(5),n.e(t.t0);case 20:return t.prev=20,n.f(),t.finish(20);case 23:return e.sort((function(t,e){return 60*t.period.end.hours+t.period.end.minutes-(60*e.period.end.hours+e.period.end.minutes)})),e.sort((function(t,e){return 60*t.period.start.hours+t.period.start.minutes-(60*e.period.start.hours+e.period.start.minutes)})),t.abrupt("return",e);case 26:case"end":return t.stop()}}),t,null,[[5,17,20,23]])})))).apply(this,arguments)}function b(){return w.apply(this,arguments)}function w(){return(w=f(i().mark((function t(){var e,r,n,o,a,c,s,f,l,h,p,y,v,m,g,b,w;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d();case 2:e=t.sent,r={},n=u(e);try{for(n.s();!(o=n.n()).done;){a=o.value,c=u(a.days);try{for(c.s();!(s=c.n()).done;)f=s.value,l="d_".concat(f),r.hasOwnProperty(l)||(r[l]=[]),h={start:a.period.start,end:a.period.end},r[l].push(h)}catch(t){c.e(t)}finally{c.f()}}}catch(t){n.e(t)}finally{n.f()}for(p in r){for(y=r[p],v=y.length,m=[],g=0;g<v;g++)b=y[g-1]||y[g],w=y[g],0===m.length?m.push(w):60*w.start.hours+w.start.minutes>=60*b.start.hours+b.start.minutes&&60*w.start.hours+w.start.minutes<=60*b.end.hours+b.end.minutes?(m[m.length-1].end.hours=w.end.hours,m[m.length-1].end.minutes=w.end.minutes):m.push(w);r[p]=m}return t.abrupt("return",r);case 8:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(t){return k.apply(this,arguments)}function k(){return(k=f(i().mark((function t(e){var r,n,o,a,c,s,f,l,h;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b();case 2:if(r=t.sent,n=e.getDay(),o="d_".concat(n),a=e.getHours(),c=e.getMinutes(),!r.hasOwnProperty(o)){t.next=26;break}s=r[o],f=u(s),t.prev=10,f.s();case 12:if((l=f.n()).done){t.next=18;break}if(h=l.value,!(60*a+c>=60*h.start.hours+h.start.minutes&&60*a+c<=60*h.end.hours+h.end.minutes)){t.next=16;break}return t.abrupt("return",!0);case 16:t.next=12;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(10),f.e(t.t0);case 23:return t.prev=23,f.f(),t.finish(23);case 26:return t.abrupt("return",!1);case 27:case"end":return t.stop()}}),t,null,[[10,20,23,26]])})))).apply(this,arguments)}},5314:(t,e,r)=>{r.r(e),r.d(e,{discardExpiredRecentViews:()=>d,getRecentView:()=>x,integrateRecentViews:()=>S,listRecentViews:()=>v,logRecentView:()=>b});var n=r(8024),o=r(5579),a=r(9734),i=r(8011),u=r(4293),c=r(4311);function s(t){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s(t)}function f(){f=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),u=new P(n||[]);return o(i,"_invoke",{value:N(t,r,u)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",m="executing",d="completed",g={};function b(){}function w(){}function x(){}var k={};l(k,i,(function(){return this}));var S=Object.getPrototypeOf,L=S&&S(S(G([])));L&&L!==r&&n.call(L,i)&&(k=L);var O=x.prototype=b.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,a,i,u){var c=p(t[o],t,a);if("throw"!==c.type){var f=c.arg,l=f.value;return l&&"object"==s(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,u)}),(function(t){r("throw",t,i,u)})):e.resolve(l).then((function(t){f.value=t,i(f)}),(function(t){return r("throw",t,i,u)}))}u(c.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function N(e,r,n){var o=y;return function(a,i){if(o===m)throw Error("Generator is already running");if(o===d){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var u=n.delegate;if(u){var c=_(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?d:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function G(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(s(e)+" is not iterable")}return w.prototype=x,o(O,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,c,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},E(I.prototype),l(I.prototype,u,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new I(h(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(O),l(O,c,"Generator"),l(O,i,(function(){return this})),l(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=G,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(j),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],u=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),j(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:G(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function l(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return h(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?h(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){u=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw a}}}}function h(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function p(t,e,r,n,o,a,i){try{var u=t[a](i),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function y(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){p(a,n,o,i,u,"next",t)}function u(t){p(a,n,o,i,u,"throw",t)}i(void 0)}))}}function v(){return m.apply(this,arguments)}function m(){return(m=y(f().mark((function t(){var e,r,n,o,a,i,u,s,h;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=[],r=(new Date).getTime(),t.next=4,(0,c.lfListItemKeys)(6);case 4:n=t.sent,o=l(n),t.prev=6,o.s();case 8:if((a=o.n()).done){t.next=18;break}return i=a.value,t.next=12,(0,c.lfGetItem)(6,i);case 12:u=t.sent,s=JSON.parse(u),h=new Date(s.time).getTime(),r-h<=12096e5&&e.push(s);case 16:t.next=8;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(6),o.e(t.t0);case 23:return t.prev=23,o.f(),t.finish(23);case 26:return 0===e.length&&e.push({type:"empty",time:(new Date).toISOString(),name:"沒有內容",id:0}),t.abrupt("return",e);case 28:case"end":return t.stop()}}),t,null,[[6,20,23,26]])})))).apply(this,arguments)}function d(){return g.apply(this,arguments)}function g(){return(g=y(f().mark((function t(){var e,r,n,o,a,i,u,s;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(new Date).getTime(),t.next=3,(0,c.lfListItemKeys)(6);case 3:r=t.sent,n=l(r),t.prev=5,n.s();case 7:if((o=n.n()).done){t.next=19;break}return a=o.value,t.next=11,(0,c.lfGetItem)(6,a);case 11:if(i=t.sent,u=JSON.parse(i),s=new Date(u.time).getTime(),!(e-s>12096e5)){t.next=17;break}return t.next=17,(0,c.lfRemoveItem)(6,a);case 17:t.next=7;break;case 19:t.next=24;break;case 21:t.prev=21,t.t0=t.catch(5),n.e(t.t0);case 24:return t.prev=24,n.f(),t.finish(24);case 27:case"end":return t.stop()}}),t,null,[[5,21,24,27]])})))).apply(this,arguments)}function b(t,e){return w.apply(this,arguments)}function w(){return(w=y(f().mark((function t(e,r){var o,s,l,h,p,y,v,m,d,g,b,w,x,k,S,L,O,E,I,N,_,T,j,P;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:o=(0,n.generateIdentifier)("r"),s="".concat(e,"_").concat(r),l=(new Date).toISOString(),t.t0=e,t.next="route"===t.t0?6:"location"===t.t0?27:"bus"===t.t0?48:69;break;case 6:return t.next=8,(0,c.lfGetItem)(6,s);case 8:if(!(h=t.sent)){t.next=16;break}return(p=JSON.parse(h)).time=l,t.next=14,(0,c.lfSetItem)(6,s,JSON.stringify(p));case 14:t.next=26;break;case 16:return t.next=18,(0,u.getRoute)(o,!0);case 18:if(y=t.sent,v="r_".concat(r),!y.hasOwnProperty(v)){t.next=26;break}return m=y[v],d=m.n,g={type:"route",time:l,name:d,id:r},t.next=26,(0,c.lfSetItem)(6,s,JSON.stringify(g));case 26:case 47:case 68:case 69:return t.abrupt("break",70);case 27:return t.next=29,(0,c.lfGetItem)(6,s);case 29:if(!(b=t.sent)){t.next=37;break}return(w=JSON.parse(b)).time=l,t.next=35,(0,c.lfSetItem)(6,s,JSON.stringify(w));case 35:t.next=47;break;case 37:return t.next=39,(0,i.getLocation)(o,!0);case 39:if(x=t.sent,k="ml_".concat(r),!x.hasOwnProperty(k)){t.next=47;break}return S=x[k],L=S.n,O={type:"location",time:l,name:L,hash:r},t.next=47,(0,c.lfSetItem)(6,s,JSON.stringify(O));case 48:return t.next=50,(0,c.lfGetItem)(6,s);case 50:if(!(E=t.sent)){t.next=58;break}return(I=JSON.parse(E)).time=l,t.next=56,(0,c.lfSetItem)(6,s,JSON.stringify(I));case 56:t.next=68;break;case 58:return t.next=60,(0,a.getCarInfo)(o,!0);case 60:if(N=t.sent,_="c_".concat(r),!N.hasOwnProperty(_)){t.next=68;break}return T=N[_],j=T.CarNum,P={type:"bus",time:l,name:j,id:r},t.next=68,(0,c.lfSetItem)(6,s,JSON.stringify(P));case 70:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(t,e){return k.apply(this,arguments)}function k(){return(k=y(f().mark((function t(e,r){var n,o;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n="".concat(e,"_").concat(r),t.next=3,(0,c.lfGetItem)(6,n);case 3:if(!(o=t.sent)){t.next=8;break}return t.abrupt("return",JSON.parse(o));case 8:return t.abrupt("return",!1);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function S(t){return L.apply(this,arguments)}function L(){return(L=y(f().mark((function t(e){var r,n,a,i,c,s,h,p,y,m,d,g,b,w,x,k,S,L,O,E,I,N,_,T,j;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,v();case 2:return r=t.sent,t.next=5,(0,u.getRoute)(e,!0);case 5:n=t.sent,a=[],i=0,c=l(r),t.prev=9,c.s();case 11:if((s=c.n()).done){t.next=65;break}h=s.value,p=h.type,y=new Date(h.time),t.t0=p,t.next="route"===t.t0?18:"location"===t.t0?32:"bus"===t.t0?42:"empty"===t.t0?52:62;break;case 18:return(m={}).type="route",d=h.name,m.name=d,g=h.id,m.id=g,b="r_".concat(g),w=n[b],x=w.pid,m.pid=x,m.time={absolute:y.getTime(),relative:(0,o.dateToRelativeTime)(y)},a.push(m),i+=1,t.abrupt("break",63);case 32:return(k={}).type="location",S=h.hash,k.hash=S,L=h.name,k.name=L,k.time={absolute:y.getTime(),relative:(0,o.dateToRelativeTime)(y)},a.push(k),i+=1,t.abrupt("break",63);case 42:return(O={}).type="bus",E=h.id,O.id=E,I=h.name,O.name=I,O.time={absolute:y.getTime(),relative:(0,o.dateToRelativeTime)(y)},a.push(O),i+=1,t.abrupt("break",63);case 52:return(N={}).type="empty",_=h.id,N.id=_,T=h.name,N.name=T,N.time={absolute:y.getTime(),relative:(0,o.dateToRelativeTime)(y)},a.push(N),i=1,t.abrupt("break",63);case 62:return t.abrupt("break",63);case 63:t.next=11;break;case 65:t.next=70;break;case 67:t.prev=67,t.t1=t.catch(9),c.e(t.t1);case 70:return t.prev=70,c.f(),t.finish(70);case 73:return a.sort((function(t,e){return e.time.absolute-t.time.absolute})),j={items:a,itemQuantity:i,dataUpdateTime:(new Date).getTime()},t.abrupt("return",j);case 76:case"end":return t.stop()}}),t,null,[[9,67,70,73]])})))).apply(this,arguments)}}}]);
//# sourceMappingURL=aa6073d92ae6da8e4917.js.map
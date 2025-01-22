/*! For license information please see 0ba7077cb21f6bd0e0eb.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[576],{8621:(t,e,r)=>{r.d(e,{p:()=>g});var n=r(2303),o=r(313),a=r(4293),i=r(8201),u=r(8671),c=r(5579);function s(t){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s(t)}function f(){f=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var a=e&&e.prototype instanceof w?e:w,i=Object.create(a.prototype),u=new j(n||[]);return o(i,"_invoke",{value:T(t,r,u)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var d="suspendedStart",y="suspendedYield",v="executing",m="completed",g={};function w(){}function b(){}function _(){}var x={};l(x,i,(function(){return this}));var L=Object.getPrototypeOf,S=L&&L(L(B([])));S&&S!==r&&n.call(S,i)&&(x=S);var E=_.prototype=w.prototype=Object.create(x);function k(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,a,i,u){var c=p(t[o],t,a);if("throw"!==c.type){var f=c.arg,l=f.value;return l&&"object"==s(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,u)}),(function(t){r("throw",t,i,u)})):e.resolve(l).then((function(t){f.value=t,i(f)}),(function(t){return r("throw",t,i,u)}))}u(c.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function T(e,r,n){var o=d;return function(a,i){if(o===v)throw Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var u=n.delegate;if(u){var c=I(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?m:y,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function I(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,I(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function D(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function B(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(s(e)+" is not iterable")}return b.prototype=_,o(E,"constructor",{value:_,configurable:!0}),o(_,"constructor",{value:b,configurable:!0}),b.displayName=l(_,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,l(t,c,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},k(O.prototype),l(O.prototype,u,(function(){return this})),e.AsyncIterator=O,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new O(h(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},k(E),l(E,c,"Generator"),l(E,i,(function(){return this})),l(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=B,j.prototype={constructor:j,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(D),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],u=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),D(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;D(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:B(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function l(t,e,r,n,o,a,i){try{var u=t[a](i),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function h(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return p(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?p(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){u=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw a}}}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function d(t,e){var r,n={},o=h(t);try{for(o.s();!(r=o.n()).done;){var a=r.value;if(a.Id===e){n=a;break}}}catch(t){o.e(t)}finally{o.f()}return n}function y(t,e){var r,n={},o=h(t);try{for(o.s();!(r=o.n()).done;){var a=r.value;a.id===e&&(n=a)}}catch(t){o.e(t)}finally{o.f()}return n}function v(t,e,r,o,a){var i,u={groupedEvents:{d_0:[],d_1:[],d_2:[],d_3:[],d_4:[],d_5:[],d_6:[]},eventGroups:{d_0:{name:"日",day:0,code:"d_0"},d_1:{name:"一",day:1,code:"d_1"},d_2:{name:"二",day:2,code:"d_2"},d_3:{name:"三",day:3,code:"d_3"},d_4:{name:"四",day:4,code:"d_4"},d_5:{name:"五",day:5,code:"d_5"},d_6:{name:"六",day:6,code:"d_6"}},eventGroupQuantity:7,eventQuantity:{d_0:0,d_1:0,d_2:0,d_3:0,d_4:0,d_5:0,d_6:0}},s=(0,c.P$)(),f=h(o);try{for(f.s();!(i=f.n()).done;){var l=i.value;if(e.indexOf(l.PathAttributeId)>-1&&"0"===l.DateType)for(var p=(0,c.mr)(l.DateValue),d=(0,c.S1)(s,p.day,0,0),y=(0,n.aU)(l.StartTime,0),v=(0,c.S1)(d,0,y.hours,y.minutes),m=(0,n.aU)(l.EndTime,0),g=(0,c.S1)(d,0,m.hours,m.minutes),w=Math.abs(60*m.hours+m.minutes-(60*y.hours+y.minutes)),b=parseInt(l.LongHeadway),_=parseInt(l.LowHeadway),x=(_+b)/2,L=w/x,S=0;S<L;S++){var E=!1;(I=(0,c.S1)(d,0,y.hours,y.minutes+_*S)).getTime()<v.getTime()&&(E=!0),I.getTime()>g.getTime()&&(E=!0),!1===E&&(u.groupedEvents[p.code].push({date:I,dateString:(0,c.$T)(I,"hh:mm"),duration:_,deviation:Math.abs(x-_)}),u.eventQuantity[p.code]=u.eventQuantity[p.code]+1)}}}catch(t){f.e(t)}finally{f.f()}var k,O=h(a);try{for(O.s();!(k=O.n()).done;){l=k.value;if(e.indexOf(l.PathAttributeId)>-1&&"0"===l.DateType){E=!1,p=(0,c.mr)(l.DateValue),d=(0,c.S1)(s,p.day,0,0);var T=(0,n.aU)(l.DepartureTime,0),I=(0,c.S1)(d,0,T.hours,T.minutes);!1===E&&(u.groupedEvents[p.code].push({date:I,dateString:(0,c.$T)(I,"hh:mm"),duration:15,deviation:0}),u.eventQuantity[p.code]=u.eventQuantity[p.code]+1)}}}catch(t){O.e(t)}finally{O.f()}for(var P in u.groupedEvents)u.groupedEvents[P]=u.groupedEvents[P].sort((function(t,e){return t.date.getTime()-e.date.getTime()}));return u}function m(t){var e=(0,n.aU)(t.goFirstBusTime,0),r=(0,n.aU)(t.goLastBusTime,0),o=(0,n.aU)(t.backFirstBusTime,0),a=(0,n.aU)(t.backLastBusTime,0),i=(0,n.aU)(t.holidayGoFirstBusTime,0),u=(0,n.aU)(t.holidayGoLastBusTime,0),c=(0,n.aU)(t.holidayBackFirstBusTime,0),s=(0,n.aU)(t.holidayBackLastBusTime,0),f=(0,n.aU)(t.peakHeadway,1),l=(0,n.aU)(t.offPeakHeadway,1),h=(0,n.aU)(t.holidayPeakHeadway,1),p=(0,n.aU)(t.holidayOffPeakHeadway,1);return{go:{weekday:{first:e,last:r,rushHourWindow:f,offRushHourWindow:l},holiday:{first:i,last:u,rushHourWindow:h,offRushHourWindow:p}},back:{weekday:{first:o,last:a,rushHourWindow:f,offRushHourWindow:l},holiday:{first:c,last:s,rushHourWindow:h,offRushHourWindow:p}},realSequence:t.realSequence}}function g(t,e,r){return w.apply(this,arguments)}function w(){var t;return t=f().mark((function t(e,r,n){var c,s,l,h,p,g,w,b,_,x;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,a.a)(n,!1);case 2:return c=t.sent,s=d(c,e),t.next=6,(0,i.Y)(n);case 6:return l=t.sent,t.next=9,(0,u.s)(n);case 9:return h=t.sent,t.next=12,(0,o.s)(n);case 12:return p=t.sent,g=m(s),w=v(0,r,0,l,h),b=s.providerId,_=y(p,b),x={timeTableRules:g,calendar:w,properties:[{key:"route_name",icon:"route",value:s.nameZh},{key:"pricing",icon:"attach_money",value:s.ticketPriceDescriptionZh},{key:"provider_name",icon:"corporate_fare",value:_.nameZn},{key:"provider_phone",icon:"call",value:_.phoneInfo},{key:"provider_email",icon:"alternate_email",value:_.email}]},t.abrupt("return",x);case 19:case"end":return t.stop()}}),t)})),w=function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){l(a,n,o,i,u,"next",t)}function u(t){l(a,n,o,i,u,"throw",t)}i(void 0)}))},w.apply(this,arguments)}},7123:(t,e,r)=>{r.d(e,{R:()=>b});var n=r(8932),o=r(6802),a=r(7810),i=r(2063),u=r(8011),c=r(4293),s=r(1932),f=r(424),l=r(2303),h=r(6788),p=r(3459),d=r(1531);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function v(){v=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var a=e&&e.prototype instanceof w?e:w,i=Object.create(a.prototype),u=new j(n||[]);return o(i,"_invoke",{value:T(t,r,u)}),i}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var h="suspendedStart",p="suspendedYield",d="executing",m="completed",g={};function w(){}function b(){}function _(){}var x={};s(x,i,(function(){return this}));var L=Object.getPrototypeOf,S=L&&L(L(B([])));S&&S!==r&&n.call(S,i)&&(x=S);var E=_.prototype=w.prototype=Object.create(x);function k(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,a,i,u){var c=l(t[o],t,a);if("throw"!==c.type){var s=c.arg,f=s.value;return f&&"object"==y(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,u)}),(function(t){r("throw",t,i,u)})):e.resolve(f).then((function(t){s.value=t,i(s)}),(function(t){return r("throw",t,i,u)}))}u(c.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function T(e,r,n){var o=h;return function(a,i){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var u=n.delegate;if(u){var c=I(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var s=l(e,r,n);if("normal"===s.type){if(o=n.done?m:p,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function I(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,I(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=l(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function D(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function j(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function B(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(y(e)+" is not iterable")}return b.prototype=_,o(E,"constructor",{value:_,configurable:!0}),o(_,"constructor",{value:b,configurable:!0}),b.displayName=s(_,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,s(t,c,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},k(O.prototype),s(O.prototype,u,(function(){return this})),e.AsyncIterator=O,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new O(f(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},k(E),s(E,c,"Generator"),s(E,i,(function(){return this})),s(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=B,j.prototype={constructor:j,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(D),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],u=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),D(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;D(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:B(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function m(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return g(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?g(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){u=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw a}}}}function g(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function w(t,e,r,n,o,a,i){try{var u=t[a](i),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function b(t,e,r){return _.apply(this,arguments)}function _(){var t;return t=v().mark((function t(e,r,y){var g,w,b,_,x,L,S,E,k,O,T,I,P,D,j,B,A,M,G,R,N,U,F,H,Q,W,$,q,C,Y,Z,J,V,K,z,X,tt,et,rt,nt,ot,at,it,ut,ct,st,ft,lt,ht,pt,dt,yt,vt,mt,gt,wt,bt,_t,xt,Lt,St,Et,kt,Ot,Tt,It,Pt,Dt,jt;return v().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(0,h.Mf)(y,"getRoute_0",0,!1),(0,h.Mf)(y,"getRoute_1",0,!1),(0,h.Mf)(y,"getStop_0",0,!1),(0,h.Mf)(y,"getStop_1",0,!1),(0,h.Mf)(y,"getLocation_0",0,!1),(0,h.Mf)(y,"getLocation_1",0,!1),(0,h.Mf)(y,"getSegmentBuffers_0",0,!1),(0,h.Mf)(y,"getSegmentBuffers_1",0,!1),(0,h.Mf)(y,"getEstimateTime_0",0,!1),(0,h.Mf)(y,"getEstimateTime_1",0,!1),(0,h.Mf)(y,"getBusEvent_0",0,!1),(0,h.Mf)(y,"getBusEvent_1",0,!1),(0,h.Mf)(y,"getBusData_0",0,!1),(0,h.Mf)(y,"getBusData_1",0,!1),t.next=16,(0,c.a)(y,!0);case 16:return g=t.sent,t.next=19,(0,f.T)(y);case 19:return w=t.sent,t.next=22,(0,u.g)(y,!1);case 22:return b=t.sent,t.next=25,(0,s.L)(y);case 25:return _=t.sent,t.next=28,(0,i.K)(y);case 28:return x=t.sent,t.next=31,(0,a.J)(y);case 31:return L=t.sent,t.next=34,(0,o.d)(y);case 34:return S=t.sent,t.next=37,(0,n.Io)();case 37:E=t.sent,k=(0,l.kL)(L,S,g,e,r),O=!1,T={},_.hasOwnProperty("r_".concat(e))&&(O=!0,T=_["r_".concat(e)]),I=(0,p.Js)("time_formatting_mode"),P=[],D=[],j=m(x),t.prev=46,j.s();case 48:if((B=j.n()).done){t.next=93;break}if(A=B.value,M={},G=A.RouteID,![e,10*e].includes(G)&&!r.includes(G)){t.next=91;break}if(M.status=(0,l.$Q)(null==A?void 0:A.EstimateTime,I),R="s_".concat(A.StopID),N={},!w.hasOwnProperty(R)){t.next=60;break}N=w[R],t.next=61;break;case 60:return t.abrupt("continue",91);case 61:if(M.id=A.StopID,M.sequence=N.seqNo,M.goBack=N.goBack,U="l_".concat(N.stopLocationId),F={},!b.hasOwnProperty(U)){t.next=70;break}F=b[U],t.next=71;break;case 70:return t.abrupt("continue",91);case 71:M.name=F.n,M.overlappingRoutes=F.r.filter((function(t){return t!==e})).map((function(t){var e="r_".concat(t);if(g.hasOwnProperty(e)){var r=g[e];return{name:r.n,RouteEndPoints:{RouteDeparture:r.dep,RouteDestination:r.des,text:"".concat(r.dep," ↔ ").concat(r.des),html:"<span>".concat(r.dep,"</span><span>↔</span><span>").concat(r.des,"</span>")},RouteID:r.id,PathAttributeId:r.pid}}return null})).filter((function(t){return!(null===t)})),M.position={longitude:F.lo,latitude:F.la},D.push({latitude:F.la,longitude:F.lo,id:A.StopID}),H=[],Q=m(F.s);try{for(Q.s();!(W=Q.n()).done;)$=W.value,q="s_".concat($),k.hasOwnProperty(q)&&H.push(k[q].map((function(t){return(0,l.s$)(t)})))}catch(t){Q.e(t)}finally{Q.f()}for(Z in M.buses=H.flat().sort((function(t,e){return t.index-e.index})),C={},E.hasOwnProperty(R)&&(C=E[R]),Y=[],C)Y=Y.concat(C[Z].busArrivalTimes);if(M.busArrivalTimes=Y,J=!1,V=!1,K=!1,z=!1,O){X="g_".concat(M.goBack),tt=[],T.hasOwnProperty(X)?tt=T[X]:"1"===M.goBack&&(z=!0,tt=T.g_0),et=m(tt);try{for(et.s();!(rt=et.n()).done;)(nt=rt.value).OriginStopID!==A.StopID&&nt.DestinationStopID!==A.StopID||(J=!0),z?(nt.OriginStopID===A.StopID&&(K=!0),nt.DestinationStopID===A.StopID&&(V=!0)):(nt.OriginStopID===A.StopID&&(V=!0),nt.DestinationStopID===A.StopID&&(K=!0))}catch(t){et.e(t)}finally{et.f()}}M.segmentBuffer={isSegmentBuffer:J,isStartingPoint:V,isEndingPoint:K},P.push(M);case 91:t.next=48;break;case 93:t.next=98;break;case 95:t.prev=95,t.t0=t.catch(46),j.e(t.t0);case 98:return t.prev=98,j.f(),t.finish(98);case 101:for(P.sort((function(t,e){return t.sequence-e.sequence})),ot=(0,d.uQ)(D,450),at=!1,it=!1,ut={},ct=0,st={},ft=P.length,lt=0;lt<ft;lt++)ht=P[lt],pt=P[lt+1]||ht,dt=0,ht.buses.length>0&&ht.buses[0].onThisRoute&&(yt=[ht.buses[0].position.longitude,ht.buses[0].position.latitude],vt=yt[0],mt=yt[1],gt=[ht.position.longitude,ht.position.latitude],wt=gt[0],bt=gt[1],_t=[pt.position.longitude,pt.position.latitude],(vt-wt)*((xt=_t[0])-vt)+(mt-bt)*((Lt=_t[1])-mt)>=0&&(St=Math.hypot(vt-wt,mt-bt),Et=Math.hypot(vt-xt,mt-Lt),dt=Math.max(0,Math.min(St/(St+Et),1)))),ht.progress=dt,ht.segmentBuffer.isStartingPoint&&(at=!0),ht.segmentBuffer.isEndingPoint&&at&&(it=!0),at&&!it&&(ht.segmentBuffer.isSegmentBuffer=!0),at&&it&&(at=!1,it=!1),kt=!1,null!==ot&&ot.id===ht.id&&(kt=!0),ht.nearest=kt,Ot="g_".concat(ht.goBack)||0,ut.hasOwnProperty(Ot)||(ut[Ot]=[],st[Ot]=0,ct+=1),ut[Ot].push(ht),st[Ot]+=1;return Tt=g["r_".concat(e)],It=Tt.n,Pt=Tt.dep,Dt=Tt.des,jt={groupedItems:ut,groupQuantity:ct,itemQuantity:st,RouteName:It,RouteEndPoints:{RouteDeparture:Pt,RouteDestination:Dt},dataUpdateTime:h.Pb[y],RouteID:e,PathAttributeId:r},(0,h.LQ)(y),(0,h.gC)(y),t.abrupt("return",jt);case 118:case"end":return t.stop()}}),t,null,[[46,95,98,101]])})),_=function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){w(a,n,o,i,u,"next",t)}function u(t){w(a,n,o,i,u,"throw",t)}i(void 0)}))},_.apply(this,arguments)}}}]);
//# sourceMappingURL=0ba7077cb21f6bd0e0eb.js.map
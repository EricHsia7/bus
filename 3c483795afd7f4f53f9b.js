/*! For license information please see 3c483795afd7f4f53f9b.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[7133],{77:(t,r,e)=>{e.d(r,{D7:()=>k,Db:()=>w,FX:()=>I,G7:()=>j,Je:()=>_,M3:()=>h,Zc:()=>P,cS:()=>S,gc:()=>L,hc:()=>x,ms:()=>m,ph:()=>l,se:()=>p,uQ:()=>E,z9:()=>G});var n=e(8024),o=e(4311);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function a(){a=function(){return r};var t,r={},e=Object.prototype,n=e.hasOwnProperty,o=Object.defineProperty||function(t,r,e){t[r]=e.value},u="function"==typeof Symbol?Symbol:{},c=u.iterator||"@@iterator",s=u.asyncIterator||"@@asyncIterator",f=u.toStringTag||"@@toStringTag";function l(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{l({},"")}catch(t){l=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var i=r&&r.prototype instanceof w?r:w,a=Object.create(i.prototype),u=new T(n||[]);return o(a,"_invoke",{value:j(t,e,u)}),a}function p(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}r.wrap=h;var y="suspendedStart",d="suspendedYield",v="executing",m="completed",g={};function w(){}function b(){}function x(){}var _={};l(_,c,(function(){return this}));var k=Object.getPrototypeOf,L=k&&k(k(I([])));L&&L!==e&&n.call(L,c)&&(_=L);var E=x.prototype=w.prototype=Object.create(_);function S(t){["next","throw","return"].forEach((function(r){l(t,r,(function(t){return this._invoke(r,t)}))}))}function O(t,r){function e(o,a,u,c){var s=p(t[o],t,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==i(l)&&n.call(l,"__await")?r.resolve(l.__await).then((function(t){e("next",t,u,c)}),(function(t){e("throw",t,u,c)})):r.resolve(l).then((function(t){f.value=t,u(f)}),(function(t){return e("throw",t,u,c)}))}c(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new r((function(r,o){e(t,n,r,o)}))}return a=a?a.then(o,o):o()}})}function j(r,e,n){var o=y;return function(i,a){if(o===v)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var u=n.delegate;if(u){var c=N(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var s=p(r,e,n);if("normal"===s.type){if(o=n.done?m:d,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function N(r,e){var n=e.method,o=r.iterator[n];if(o===t)return e.delegate=null,"throw"===n&&r.iterator.return&&(e.method="return",e.arg=t,N(r,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,r.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[r.resultName]=a.value,e.next=r.nextLoc,"return"!==e.method&&(e.method="next",e.arg=t),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function P(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function G(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function I(r){if(r||""===r){var e=r[c];if(e)return e.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,a=function e(){for(;++o<r.length;)if(n.call(r,o))return e.value=r[o],e.done=!1,e;return e.value=t,e.done=!0,e};return a.next=a}}throw new TypeError(i(r)+" is not iterable")}return b.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:b,configurable:!0}),b.displayName=l(x,f,"GeneratorFunction"),r.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===b||"GeneratorFunction"===(r.displayName||r.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,f,"GeneratorFunction")),t.prototype=Object.create(E),t},r.awrap=function(t){return{__await:t}},S(O.prototype),l(O.prototype,s,(function(){return this})),r.AsyncIterator=O,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new O(h(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(E),l(E,f,"Generator"),l(E,c,(function(){return this})),l(E,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=I,T.prototype={constructor:T,reset:function(r){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(G),!r)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var e=this;function o(n,o){return u.type="throw",u.arg=r,e.next=n,o&&(e.method="next",e.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),g},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),G(e),g}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;G(e)}return o}}throw Error("illegal catch attempt")},delegateYield:function(r,e,n){return this.delegate={iterator:I(r),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=t),g}},r}function u(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,r){if(t){if("string"==typeof t)return c(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?c(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return a=t.done,t},e:function(t){u=!0,i=t},f:function(){try{a||null==e.return||e.return()}finally{if(u)throw i}}}}function c(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}function s(t,r,e,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void e(t)}u.done?r(c):Promise.resolve(c).then(n,o)}function f(t){return function(){var r=this,e=arguments;return new Promise((function(n,o){var i=t.apply(r,e);function a(t){s(i,n,o,a,u,"next",t)}function u(t){s(i,n,o,a,u,"throw",t)}a(void 0)}))}}var l="",h="",p="",y=[],d={},v={};function m(){return g.apply(this,arguments)}function g(){return(g=f(a().mark((function t(){var r;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r={provider:l,client_id:h,secret:p},t.next=3,(0,o.mL)(7,"n_client",JSON.stringify(r));case 3:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function w(){return b.apply(this,arguments)}function b(){return(b=f(a().mark((function t(){var r,e;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,o.Ct)(7,"n_client");case 2:(r=t.sent)&&(e=JSON.parse(r),l=e.provider,h=e.client_id,p=e.secret);case 4:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(){return""!==h&&""!==p}function _(t){if(!(0,n.Gz)(t))throw new Error("The provider is not valid.");var r=new URL(t);l="".concat(r.protocol,"//").concat(r.hostname)}function k(){return String(l)}function L(t){void 0!==t&&(h=String(t))}function E(t){void 0!==t&&(p=String(t))}function S(){return O.apply(this,arguments)}function O(){return(O=f(a().mark((function t(){var r,e,n,i,c,s,f,l,h,p,m;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=(new Date).getTime(),t.next=3,(0,o.Su)(8);case 3:e=t.sent,n=0,i=u(e),t.prev=6,i.s();case 8:if((c=i.n()).done){t.next=18;break}return s=c.value,t.next=12,(0,o.Ct)(8,s);case 12:f=t.sent,l=JSON.parse(f),l.scheduled_time>r&&(h=l.schedule_id,p=l.stop_id,m="s_".concat(p),y.push(l),d[h]=n,v.hasOwnProperty(m)||(v[m]=[]),v[m].push(n),n+=1);case 16:t.next=8;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(6),i.e(t.t0);case 23:return t.prev=23,i.f(),t.finish(23);case 26:case"end":return t.stop()}}),t,null,[[6,20,23,26]])})))).apply(this,arguments)}function j(t,r,e,n,o,i,a,u,c,s){return N.apply(this,arguments)}function N(){return(N=f(a().mark((function t(r,e,n,i,u,c,s,f,l,h){var p,m,g;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return p={schedule_id:r,stop_id:e,location_name:n,route_id:i,route_name:u,direction:c,estimate_time:s,time_formatting_mode:f,time_offset:l,scheduled_time:h},m="s_".concat(e),g=y.length,y.push(p),d[r]=g,v.hasOwnProperty(m)||(v[m]=[]),v[m].push(g),t.next=9,(0,o.mL)(8,r,JSON.stringify(p));case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function P(t){var r=(new Date).getTime(),e="s_".concat(t);if(v.hasOwnProperty(e)){var n,o=u(v[e]);try{for(o.s();!(n=o.n()).done;){var i=n.value;if(y[i].scheduled_time>r)return!0}}catch(t){o.e(t)}finally{o.f()}}return!1}function G(){return T.apply(this,arguments)}function T(){return(T=f(a().mark((function t(){var r,e,n,i,u,c;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=(new Date).getTime(),t.t0=a().keys(d);case 2:if((t.t1=t.t0()).done){t.next=17;break}if(e=t.t1.value,n=d[e],i=y[n],!(i.scheduled_time<=r)){t.next=15;break}return u=i.stop_id,c="s_".concat(u),y.splice(n,1,null),v[c].splice(v[c].indexOf(n),1),delete d[e],t.next=15,(0,o.iQ)(8,e);case 15:t.next=2;break;case 17:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var I=[{name:"到站前5分鐘",time_offset:-5,icon:"clock_loader_10",index:0},{name:"到站前10分鐘",time_offset:-10,icon:"clock_loader_20",index:1},{name:"到站前15分鐘",time_offset:-15,icon:"clock_loader_40",index:2},{name:"到站前20分鐘",time_offset:-20,icon:"clock_loader_60",index:3},{name:"到站前25分鐘",time_offset:-25,icon:"clock_loader_80",index:4},{name:"到站前30分鐘",time_offset:-30,icon:"clock_loader_90",index:5}]},5352:(t,r,e)=>{e.d(r,{Qh:()=>l,nL:()=>d,qZ:()=>p,ty:()=>m,vQ:()=>x});var n=e(8024),o=e(4311);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function a(){a=function(){return r};var t,r={},e=Object.prototype,n=e.hasOwnProperty,o=Object.defineProperty||function(t,r,e){t[r]=e.value},u="function"==typeof Symbol?Symbol:{},c=u.iterator||"@@iterator",s=u.asyncIterator||"@@asyncIterator",f=u.toStringTag||"@@toStringTag";function l(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{l({},"")}catch(t){l=function(t,r,e){return t[r]=e}}function h(t,r,e,n){var i=r&&r.prototype instanceof w?r:w,a=Object.create(i.prototype),u=new T(n||[]);return o(a,"_invoke",{value:j(t,e,u)}),a}function p(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}r.wrap=h;var y="suspendedStart",d="suspendedYield",v="executing",m="completed",g={};function w(){}function b(){}function x(){}var _={};l(_,c,(function(){return this}));var k=Object.getPrototypeOf,L=k&&k(k(I([])));L&&L!==e&&n.call(L,c)&&(_=L);var E=x.prototype=w.prototype=Object.create(_);function S(t){["next","throw","return"].forEach((function(r){l(t,r,(function(t){return this._invoke(r,t)}))}))}function O(t,r){function e(o,a,u,c){var s=p(t[o],t,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==i(l)&&n.call(l,"__await")?r.resolve(l.__await).then((function(t){e("next",t,u,c)}),(function(t){e("throw",t,u,c)})):r.resolve(l).then((function(t){f.value=t,u(f)}),(function(t){return e("throw",t,u,c)}))}c(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new r((function(r,o){e(t,n,r,o)}))}return a=a?a.then(o,o):o()}})}function j(r,e,n){var o=y;return function(i,a){if(o===v)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var u=n.delegate;if(u){var c=N(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var s=p(r,e,n);if("normal"===s.type){if(o=n.done?m:d,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function N(r,e){var n=e.method,o=r.iterator[n];if(o===t)return e.delegate=null,"throw"===n&&r.iterator.return&&(e.method="return",e.arg=t,N(r,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,r.iterator,e.arg);if("throw"===i.type)return e.method="throw",e.arg=i.arg,e.delegate=null,g;var a=i.arg;return a?a.done?(e[r.resultName]=a.value,e.next=r.nextLoc,"return"!==e.method&&(e.method="next",e.arg=t),e.delegate=null,g):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,g)}function P(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function G(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function I(r){if(r||""===r){var e=r[c];if(e)return e.call(r);if("function"==typeof r.next)return r;if(!isNaN(r.length)){var o=-1,a=function e(){for(;++o<r.length;)if(n.call(r,o))return e.value=r[o],e.done=!1,e;return e.value=t,e.done=!0,e};return a.next=a}}throw new TypeError(i(r)+" is not iterable")}return b.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:b,configurable:!0}),b.displayName=l(x,f,"GeneratorFunction"),r.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===b||"GeneratorFunction"===(r.displayName||r.name))},r.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,f,"GeneratorFunction")),t.prototype=Object.create(E),t},r.awrap=function(t){return{__await:t}},S(O.prototype),l(O.prototype,s,(function(){return this})),r.AsyncIterator=O,r.async=function(t,e,n,o,i){void 0===i&&(i=Promise);var a=new O(h(t,e,n,o),i);return r.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(E),l(E,f,"Generator"),l(E,c,(function(){return this})),l(E,"toString",(function(){return"[object Generator]"})),r.keys=function(t){var r=Object(t),e=[];for(var n in r)e.push(n);return e.reverse(),function t(){for(;e.length;){var n=e.pop();if(n in r)return t.value=n,t.done=!1,t}return t.done=!0,t}},r.values=I,T.prototype={constructor:T,reset:function(r){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(G),!r)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var e=this;function o(n,o){return u.type="throw",u.arg=r,e.next=n,o&&(e.method="next",e.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var o=this.tryEntries[e];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=r&&r<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=r,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),g},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),G(e),g}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;G(e)}return o}}throw Error("illegal catch attempt")},delegateYield:function(r,e,n){return this.delegate={iterator:I(r),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=t),g}},r}function u(t,r){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,r){if(t){if("string"==typeof t)return c(t,r);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?c(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){e&&(t=e);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return a=t.done,t},e:function(t){u=!0,i=t},f:function(){try{a||null==e.return||e.return()}finally{if(u)throw i}}}}function c(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=Array(r);e<r;e++)n[e]=t[e];return n}function s(t,r,e,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void e(t)}u.done?r(c):Promise.resolve(c).then(n,o)}function f(t){return function(){var r=this,e=arguments;return new Promise((function(n,o){var i=t.apply(r,e);function a(t){s(i,n,o,a,u,"next",t)}function u(t){s(i,n,o,a,u,"throw",t)}a(void 0)}))}}function l(t,r,e,n,o,i){return h.apply(this,arguments)}function h(){return(h=f(a().mark((function t(r,e,i,c,s,f){var l,h,p,y,d;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(l=(0,n.zx)("s"),!(e<0||e>23||i<0||i>59||c<0||c>23||s<0||s>59)){t.next=3;break}return t.abrupt("return",!1);case 3:if(Number.isInteger(e)&&Number.isInteger(i)&&Number.isInteger(c)&&Number.isInteger(s)){t.next=5;break}return t.abrupt("return",!1);case 5:if(!(f.length>7)){t.next=7;break}return t.abrupt("return",!1);case 7:h=u(f),t.prev=8,h.s();case 10:if((p=h.n()).done){t.next=17;break}if("number"!=typeof(y=p.value)){t.next=15;break}if(!(y<0||y>6)&&Number.isInteger(y)){t.next=15;break}return t.abrupt("return",!1);case 15:t.next=10;break;case 17:t.next=22;break;case 19:t.prev=19,t.t0=t.catch(8),h.e(t.t0);case 22:return t.prev=22,h.f(),t.finish(22);case 25:return d={name:r,period:{start:{hours:e,minutes:i},end:{hours:c,minutes:s}},days:f,id:l},t.next=28,(0,o.mL)(5,l,JSON.stringify(d));case 28:return t.abrupt("return",!0);case 29:case"end":return t.stop()}}),t,null,[[8,19,22,25]])})))).apply(this,arguments)}function p(t){return y.apply(this,arguments)}function y(){return(y=f(a().mark((function t(r){var e,n;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,o.Ct)(5,r);case 2:if(!(e=t.sent)){t.next=6;break}return n=JSON.parse(e),t.abrupt("return",n);case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function d(t){return v.apply(this,arguments)}function v(){return(v=f(a().mark((function t(r){return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p(r.id);case 2:if(!t.sent){t.next=6;break}return t.next=6,(0,o.mL)(5,r.id,JSON.stringify(r));case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function m(){return g.apply(this,arguments)}function g(){return(g=f(a().mark((function t(){var r,e,n,i,c,s,f;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=[],t.next=3,(0,o.Su)(5);case 3:e=t.sent,n=u(e),t.prev=5,n.s();case 7:if((i=n.n()).done){t.next=15;break}return c=i.value,t.next=11,(0,o.Ct)(5,c);case 11:(s=t.sent)&&(f=JSON.parse(s),r.push(f));case 13:t.next=7;break;case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(5),n.e(t.t0);case 20:return t.prev=20,n.f(),t.finish(20);case 23:return r.sort((function(t,r){return 60*t.period.end.hours+t.period.end.minutes-(60*r.period.end.hours+r.period.end.minutes)})),r.sort((function(t,r){return 60*t.period.start.hours+t.period.start.minutes-(60*r.period.start.hours+r.period.start.minutes)})),t.abrupt("return",r);case 26:case"end":return t.stop()}}),t,null,[[5,17,20,23]])})))).apply(this,arguments)}function w(){return b.apply(this,arguments)}function b(){return(b=f(a().mark((function t(){var r,e,n,o,i,c,s,f,l,h,p,y,d,v,g,w,b;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m();case 2:r=t.sent,e={},n=u(r);try{for(n.s();!(o=n.n()).done;){i=o.value,c=u(i.days);try{for(c.s();!(s=c.n()).done;)f=s.value,l="d_".concat(f),e.hasOwnProperty(l)||(e[l]=[]),h={start:i.period.start,end:i.period.end},e[l].push(h)}catch(t){c.e(t)}finally{c.f()}}}catch(t){n.e(t)}finally{n.f()}for(p in e){for(y=e[p],d=y.length,v=[],g=0;g<d;g++)w=y[g-1]||y[g],b=y[g],0===v.length?v.push(b):60*b.start.hours+b.start.minutes>=60*w.start.hours+w.start.minutes&&60*b.start.hours+b.start.minutes<=60*w.end.hours+w.end.minutes?(v[v.length-1].end.hours=b.end.hours,v[v.length-1].end.minutes=b.end.minutes):v.push(b);e[p]=v}return t.abrupt("return",e);case 8:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(t){return _.apply(this,arguments)}function _(){return(_=f(a().mark((function t(r){var e,n,o,i,c,s,f,l,h;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,w();case 2:if(e=t.sent,n=r.getDay(),o="d_".concat(n),i=r.getHours(),c=r.getMinutes(),!e.hasOwnProperty(o)){t.next=26;break}s=e[o],f=u(s),t.prev=10,f.s();case 12:if((l=f.n()).done){t.next=18;break}if(h=l.value,!(60*i+c>=60*h.start.hours+h.start.minutes&&60*i+c<=60*h.end.hours+h.end.minutes)){t.next=16;break}return t.abrupt("return",!0);case 16:t.next=12;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(10),f.e(t.t0);case 23:return t.prev=23,f.f(),t.finish(23);case 26:return t.abrupt("return",!1);case 27:case"end":return t.stop()}}),t,null,[[10,20,23,26]])})))).apply(this,arguments)}}}]);
//# sourceMappingURL=3c483795afd7f4f53f9b.js.map
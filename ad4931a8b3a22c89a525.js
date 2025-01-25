/*! For license information please see ad4931a8b3a22c89a525.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[133],{77:(t,e,r)=>{r.d(e,{FX:()=>d,zO:()=>p});var n=r(8024),o=r(7307),i=r(4311);function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function u(){u=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},c=i.iterator||"@@iterator",s=i.asyncIterator||"@@asyncIterator",f=i.toStringTag||"@@toStringTag";function h(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{h({},"")}catch(t){h=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof g?e:g,a=Object.create(i.prototype),u=new I(n||[]);return o(a,"_invoke",{value:P(t,r,u)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var d="suspendedStart",v="suspendedYield",y="executing",m="completed",b={};function g(){}function w(){}function x(){}var k={};h(k,c,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(G([])));L&&L!==r&&n.call(L,c)&&(k=L);var O=x.prototype=g.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){h(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,i,u,c){var s=p(t[o],t,i);if("throw"!==s.type){var f=s.arg,h=f.value;return h&&"object"==a(h)&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,u,c)}),(function(t){r("throw",t,u,c)})):e.resolve(h).then((function(t){f.value=t,u(f)}),(function(t){return r("throw",t,u,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function P(e,r,n){var o=d;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var u=n.delegate;if(u){var c=j(u,n);if(c){if(c===b)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?m:v,s.arg===b)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function j(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,j(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,b;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function G(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(a(e)+" is not iterable")}return w.prototype=x,o(O,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=h(x,f,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,h(t,f,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},E(S.prototype),h(S.prototype,s,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new S(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(O),h(O,f,"Generator"),h(O,c,(function(){return this})),h(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=G,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,b):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:G(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function c(t,e,r,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function s(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){c(i,n,o,a,u,"next",t)}function u(t){c(i,n,o,a,u,"throw",t)}a(void 0)}))}}function f(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,l(n.key),n)}}function h(t,e,r){return(e=l(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function l(t){var e=function(t,e){if("object"!=a(t)||!t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,e||"default");if("object"!=a(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==a(e)?e:e+""}var p=new(function(){return t=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),h(this,"provider",""),h(this,"client_id",""),h(this,"secret","")},e=[{key:"getURL",value:function(t,e){if(""===this.provider)return!1;var r=new URL(this.provider);switch(t){case"cancel":if(""===this.client_id||""===this.secret||1!==e.length)return!1;r.searchParams.set("method","schedule"),r.searchParams.set("client_id",this.client_id),r.searchParams.set("totp_token",(0,o.O)(this.client_id,this.secret)),r.searchParams.set("schedule_id",e[0]);break;case"register":if(1!==e.length)return!1;var i=new Date;i.setMilliseconds(0),i.setSeconds(0),r.searchParams.set("method","register"),r.searchParams.set("hash",(0,n.sc)("".concat(e[0]).concat(i.getTime())));break;case"schedule":if(""===this.client_id||""===this.secret||2!==e.length)return!1;r.searchParams.set("method","schedule"),r.searchParams.set("client_id",this.client_id),r.searchParams.set("totp_token",(0,o.O)(this.client_id,this.secret)),r.searchParams.set("message",e[0]),r.searchParams.set("scheduled_time",e[1]);break;case"rotate":if(""===this.client_id||""===this.secret||0!==e.length)return!1;r.searchParams.set("method","rotate"),r.searchParams.set("client_id",this.client_id),r.searchParams.set("totp_token",(0,o.O)(this.client_id,this.secret));break;default:return!1}return r.toString()}},{key:"makeRequest",value:(b=s(u().mark((function t(e,r){var n,o,i,a;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,!1!==r){t.next=3;break}return t.abrupt("return",!1);case 3:return t.next=5,fetch(r,{method:"POST",headers:{"Content-Type":"application/json"}});case 5:if((n=t.sent).ok){t.next=12;break}return t.next=9,n.text();case 9:return o=t.sent,console.error("API request failed",{status:n.status,statusText:n.statusText,body:o}),t.abrupt("return",!1);case 12:return t.prev=12,t.next=15,n.text();case 15:i=t.sent,a=JSON.parse(i),t.t0=e,t.next="cancel"===t.t0?20:"register"===t.t0?22:"schedule"===t.t0?24:"rotate"===t.t0?26:28;break;case 20:case 22:case 24:case 26:return t.abrupt("return",a);case 28:return t.abrupt("return",!1);case 30:t.next=36;break;case 32:throw t.prev=32,t.t1=t.catch(12),console.error("Failed to parse JSON response",t.t1),new Error("Invalid JSON response from server");case 36:t.next=42;break;case 38:return t.prev=38,t.t2=t.catch(0),console.error("Error scheduling message:",t.t2),t.abrupt("return",!1);case 42:case"end":return t.stop()}}),t,null,[[0,38],[12,32]])}))),function(t,e){return b.apply(this,arguments)})},{key:"saveClient",value:(m=s(u().mark((function t(){var e;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e={provider:this.provider,client_id:this.client_id,secret:this.secret},t.next=3,(0,i.mL)(7,"n_client",JSON.stringify(e));case 3:case"end":return t.stop()}}),t,this)}))),function(){return m.apply(this,arguments)})},{key:"loadClient",value:(y=s(u().mark((function t(){var e,r;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,i.Ct)(7,"n_client");case 2:(e=t.sent)&&(r=JSON.parse(e),this.provider=r.provider,this.client_id=r.client_id,this.secret=r.secret);case 4:case"end":return t.stop()}}),t,this)}))),function(){return y.apply(this,arguments)})},{key:"getStatus",value:function(){return""!==this.client_id&&""!==this.secret}},{key:"setProvider",value:function(t){if(!(0,n.Gz)(t))throw new Error("The provider is not valid.");this.provider=t}},{key:"getProvider",value:function(){return this.provider}},{key:"register",value:(v=s(u().mark((function t(e){var r,n;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e){t.next=2;break}return t.abrupt("return",!1);case 2:return r=this.getURL("register",[e]),t.next=5,this.makeRequest("register",r);case 5:if(!1!==(n=t.sent)){t.next=10;break}return t.abrupt("return",!1);case 10:if(200!==n.code||"register"!==n.method){t.next=18;break}return this.client_id=n.client_id,this.secret=n.secret,t.next=15,this.saveClient();case 15:return t.abrupt("return",!0);case 18:return t.abrupt("return",!1);case 19:case"end":return t.stop()}}),t,this)}))),function(t){return v.apply(this,arguments)})},{key:"login",value:(d=s(u().mark((function t(e,r){return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e&&r){t.next=5;break}return t.next=3,this.loadClient();case 3:t.next=7;break;case 5:this.client_id=e,this.secret=r;case 7:case"end":return t.stop()}}),t,this)}))),function(t,e){return d.apply(this,arguments)})},{key:"schedule",value:(p=s(u().mark((function t(e,r){var n,o,i;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==this.client_id&&""!==this.secret&&e&&r){t.next=2;break}return t.abrupt("return",!1);case 2:n="",t.t0=a(r),t.next="string"===t.t0?6:"number"===t.t0?8:10;break;case 6:return n=r,t.abrupt("break",16);case 8:return n=new Date(r).toISOString(),t.abrupt("break",16);case 10:if(!(r instanceof Date)){t.next=14;break}n=r.toISOString(),t.next=15;break;case 14:case 31:return t.abrupt("return",!1);case 15:return t.abrupt("break",16);case 16:return o=this.getURL("schedule",[e,n]),t.next=19,this.makeRequest("schedule",o);case 19:if(!1!==(i=t.sent)){t.next=24;break}return t.abrupt("return",!1);case 24:if(200!==i.code||"schedule"!==i.method){t.next=31;break}if(!(Math.random()>.7)){t.next=28;break}return t.next=28,this.rotate();case 28:return t.abrupt("return",i.schedule_id);case 32:case"end":return t.stop()}}),t,this)}))),function(t,e){return p.apply(this,arguments)})},{key:"cancel",value:(l=s(u().mark((function t(e){var r,n;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==this.client_id&&""!==this.secret&&e){t.next=2;break}return t.abrupt("return",!1);case 2:return r=this.getURL("cancel",[e]),t.next=5,this.makeRequest("cancel",r);case 5:if(!1!==(n=t.sent)){t.next=10;break}return t.abrupt("return",!1);case 10:if(200!==n.code||"cancel"!==n.method){t.next=14;break}return t.abrupt("return",!0);case 14:return t.abrupt("return",!1);case 15:case"end":return t.stop()}}),t,this)}))),function(t){return l.apply(this,arguments)})},{key:"rotate",value:(c=s(u().mark((function t(){var e,r;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==this.client_id&&""!==this.secret){t.next=2;break}return t.abrupt("return",!1);case 2:return e=this.getURL("rotate",[]),t.next=5,this.makeRequest("rotate",e);case 5:if(!1!==(r=t.sent)){t.next=10;break}return t.abrupt("return",!1);case 10:if(200!==r.code||"rotate"!==r.method){t.next=17;break}return this.secret=r.secret,t.next=14,this.saveClient();case 14:return t.abrupt("return",!0);case 17:return t.abrupt("return",!1);case 18:case"end":return t.stop()}}),t,this)}))),function(){return c.apply(this,arguments)})}],e&&f(t.prototype,e),r&&f(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e,r,c,l,p,d,v,y,m,b}()),d=[{name:"到站前5分鐘",status:"公車將在5分鐘內進站",timeOffset:-5,icon:"clock_loader_10",index:0},{name:"到站前10分鐘",status:"公車將在10分鐘內進站",timeOffset:-10,icon:"clock_loader_20",index:1},{name:"到站前15分鐘",status:"公車將在15分鐘內進站",timeOffset:-15,icon:"clock_loader_40",index:2},{name:"到站前20分鐘",status:"公車將在20分鐘內進站",timeOffset:-20,icon:"clock_loader_60",index:3},{name:"到站前25分鐘",status:"公車將在25分鐘內進站",timeOffset:-25,icon:"clock_loader_80",index:4},{name:"到站前30分鐘",status:"公車將在30分鐘內進站",timeOffset:-30,icon:"clock_loader_90",index:5}]},5352:(t,e,r)=>{r.d(e,{Qh:()=>h,nL:()=>v,qZ:()=>p,ty:()=>m,vQ:()=>x});var n=r(8024),o=r(4311);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function a(){a=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},u="function"==typeof Symbol?Symbol:{},c=u.iterator||"@@iterator",s=u.asyncIterator||"@@asyncIterator",f=u.toStringTag||"@@toStringTag";function h(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{h({},"")}catch(t){h=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof g?e:g,a=Object.create(i.prototype),u=new I(n||[]);return o(a,"_invoke",{value:P(t,r,u)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var d="suspendedStart",v="suspendedYield",y="executing",m="completed",b={};function g(){}function w(){}function x(){}var k={};h(k,c,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(G([])));L&&L!==r&&n.call(L,c)&&(k=L);var O=x.prototype=g.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){h(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,a,u,c){var s=p(t[o],t,a);if("throw"!==s.type){var f=s.arg,h=f.value;return h&&"object"==i(h)&&n.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,u,c)}),(function(t){r("throw",t,u,c)})):e.resolve(h).then((function(t){f.value=t,u(f)}),(function(t){return r("throw",t,u,c)}))}c(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function P(e,r,n){var o=d;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var u=n.delegate;if(u){var c=j(u,n);if(c){if(c===b)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?m:v,s.arg===b)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function j(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,j(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,b;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function G(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(i(e)+" is not iterable")}return w.prototype=x,o(O,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=h(x,f,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,h(t,f,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},E(S.prototype),h(S.prototype,s,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new S(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(O),h(O,f,"Generator"),h(O,c,(function(){return this})),h(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=G,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],u=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,b):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:G(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function u(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return c(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw i}}}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e,r,n,o,i,a){try{var u=t[i](a),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function f(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){s(i,n,o,a,u,"next",t)}function u(t){s(i,n,o,a,u,"throw",t)}a(void 0)}))}}function h(t,e,r,n,o,i){return l.apply(this,arguments)}function l(){return(l=f(a().mark((function t(e,r,i,c,s,f){var h,l,p,d,v;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(h=(0,n.zx)("s"),!(r<0||r>23||i<0||i>59||c<0||c>23||s<0||s>59)){t.next=3;break}return t.abrupt("return",!1);case 3:if(Number.isInteger(r)&&Number.isInteger(i)&&Number.isInteger(c)&&Number.isInteger(s)){t.next=5;break}return t.abrupt("return",!1);case 5:if(!(f.length>7)){t.next=7;break}return t.abrupt("return",!1);case 7:l=u(f),t.prev=8,l.s();case 10:if((p=l.n()).done){t.next=17;break}if("number"!=typeof(d=p.value)){t.next=15;break}if(!(d<0||d>6)&&Number.isInteger(d)){t.next=15;break}return t.abrupt("return",!1);case 15:t.next=10;break;case 17:t.next=22;break;case 19:t.prev=19,t.t0=t.catch(8),l.e(t.t0);case 22:return t.prev=22,l.f(),t.finish(22);case 25:return v={name:e,period:{start:{hours:r,minutes:i},end:{hours:c,minutes:s}},days:f,id:h},t.next=28,(0,o.mL)(5,h,JSON.stringify(v));case 28:return t.abrupt("return",!0);case 29:case"end":return t.stop()}}),t,null,[[8,19,22,25]])})))).apply(this,arguments)}function p(t){return d.apply(this,arguments)}function d(){return(d=f(a().mark((function t(e){var r,n;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,o.Ct)(5,e);case 2:if(!(r=t.sent)){t.next=6;break}return n=JSON.parse(r),t.abrupt("return",n);case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function v(t){return y.apply(this,arguments)}function y(){return(y=f(a().mark((function t(e){return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p(e.id);case 2:if(!t.sent){t.next=6;break}return t.next=6,(0,o.mL)(5,e.id,JSON.stringify(e));case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function m(){return b.apply(this,arguments)}function b(){return(b=f(a().mark((function t(){var e,r,n,i,c,s,f;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=[],t.next=3,(0,o.Su)(5);case 3:r=t.sent,n=u(r),t.prev=5,n.s();case 7:if((i=n.n()).done){t.next=15;break}return c=i.value,t.next=11,(0,o.Ct)(5,c);case 11:(s=t.sent)&&(f=JSON.parse(s),e.push(f));case 13:t.next=7;break;case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(5),n.e(t.t0);case 20:return t.prev=20,n.f(),t.finish(20);case 23:return e.sort((function(t,e){return 60*t.period.end.hours+t.period.end.minutes-(60*e.period.end.hours+e.period.end.minutes)})),e.sort((function(t,e){return 60*t.period.start.hours+t.period.start.minutes-(60*e.period.start.hours+e.period.start.minutes)})),t.abrupt("return",e);case 26:case"end":return t.stop()}}),t,null,[[5,17,20,23]])})))).apply(this,arguments)}function g(){return w.apply(this,arguments)}function w(){return(w=f(a().mark((function t(){var e,r,n,o,i,c,s,f,h,l,p,d,v,y,b,g,w;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m();case 2:e=t.sent,r={},n=u(e);try{for(n.s();!(o=n.n()).done;){i=o.value,c=u(i.days);try{for(c.s();!(s=c.n()).done;)f=s.value,h="d_".concat(f),r.hasOwnProperty(h)||(r[h]=[]),l={start:i.period.start,end:i.period.end},r[h].push(l)}catch(t){c.e(t)}finally{c.f()}}}catch(t){n.e(t)}finally{n.f()}for(p in r){for(d=r[p],v=d.length,y=[],b=0;b<v;b++)g=d[b-1]||d[b],w=d[b],0===y.length?y.push(w):60*w.start.hours+w.start.minutes>=60*g.start.hours+g.start.minutes&&60*w.start.hours+w.start.minutes<=60*g.end.hours+g.end.minutes?(y[y.length-1].end.hours=w.end.hours,y[y.length-1].end.minutes=w.end.minutes):y.push(w);r[p]=y}return t.abrupt("return",r);case 8:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(t){return k.apply(this,arguments)}function k(){return(k=f(a().mark((function t(e){var r,n,o,i,c,s,f,h,l;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,g();case 2:if(r=t.sent,n=e.getDay(),o="d_".concat(n),i=e.getHours(),c=e.getMinutes(),!r.hasOwnProperty(o)){t.next=26;break}s=r[o],f=u(s),t.prev=10,f.s();case 12:if((h=f.n()).done){t.next=18;break}if(l=h.value,!(60*i+c>=60*l.start.hours+l.start.minutes&&60*i+c<=60*l.end.hours+l.end.minutes)){t.next=16;break}return t.abrupt("return",!0);case 16:t.next=12;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(10),f.e(t.t0);case 23:return t.prev=23,f.f(),t.finish(23);case 26:return t.abrupt("return",!1);case 27:case"end":return t.stop()}}),t,null,[[10,20,23,26]])})))).apply(this,arguments)}}}]);
//# sourceMappingURL=ad4931a8b3a22c89a525.js.map
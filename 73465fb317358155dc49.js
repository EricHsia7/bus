/*! For license information please see 73465fb317358155dc49.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[133],{77:(t,e,r)=>{r.d(e,{FX:()=>d,zO:()=>p});var n=r(8024),a=r(7307),i=r(4311);function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function u(){u=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},s=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",h=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof g?e:g,o=Object.create(i.prototype),u=new I(n||[]);return a(o,"_invoke",{value:S(t,r,u)}),o}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var d="suspendedStart",y="suspendedYield",v="executing",m="completed",b={};function g(){}function w(){}function x(){}var k={};f(k,s,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(C([])));L&&L!==r&&n.call(L,s)&&(k=L);var O=x.prototype=g.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function P(t,e){function r(a,i,u,s){var c=p(t[a],t,i);if("throw"!==c.type){var h=c.arg,f=h.value;return f&&"object"==o(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,u,s)}),(function(t){r("throw",t,u,s)})):e.resolve(f).then((function(t){h.value=t,u(h)}),(function(t){return r("throw",t,u,s)}))}s(c.arg)}var i;a(this,"_invoke",{value:function(t,n){function a(){return new e((function(e,a){r(t,n,e,a)}))}return i=i?i.then(a,a):a()}})}function S(e,r,n){var a=d;return function(i,o){if(a===v)throw Error("Generator is already running");if(a===m){if("throw"===i)throw o;return{value:t,done:!0}}for(n.method=i,n.arg=o;;){var u=n.delegate;if(u){var s=j(u,n);if(s){if(s===b)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===d)throw a=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=v;var c=p(e,r,n);if("normal"===c.type){if(a=n.done?m:y,c.arg===b)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(a=m,n.method="throw",n.arg=c.arg)}}}function j(e,r){var n=r.method,a=e.iterator[n];if(a===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,j(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var i=p(a,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,b;var o=i.arg;return o?o.done?(r[e.resultName]=o.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):o:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function C(e){if(e||""===e){var r=e[s];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(o(e)+" is not iterable")}return w.prototype=x,a(O,"constructor",{value:x,configurable:!0}),a(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,h,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,h,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},E(P.prototype),f(P.prototype,c,(function(){return this})),e.AsyncIterator=P,e.async=function(t,r,n,a,i){void 0===i&&(i=Promise);var o=new P(l(t,r,n,a),i);return e.isGeneratorFunction(r)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},E(O),f(O,h,"Generator"),f(O,s,(function(){return this})),f(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=C,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function a(n,a){return u.type="throw",u.arg=e,r.next=n,a&&(r.method="next",r.arg=t),!!a}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],u=o.completion;if("root"===o.tryLoc)return a("end");if(o.tryLoc<=this.prev){var s=n.call(o,"catchLoc"),c=n.call(o,"finallyLoc");if(s&&c){if(this.prev<o.catchLoc)return a(o.catchLoc,!0);if(this.prev<o.finallyLoc)return a(o.finallyLoc)}else if(s){if(this.prev<o.catchLoc)return a(o.catchLoc,!0)}else{if(!c)throw Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return a(o.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var i=a;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=t,o.arg=e,i?(this.method="next",this.next=i.finallyLoc,b):this.complete(o)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;T(r)}return a}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function s(t,e,r,n,a,i,o){try{var u=t[i](o),s=u.value}catch(t){return void r(t)}u.done?e(s):Promise.resolve(s).then(n,a)}function c(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){s(i,n,a,o,u,"next",t)}function u(t){s(i,n,a,o,u,"throw",t)}o(void 0)}))}}function h(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,l(n.key),n)}}function f(t,e,r){return(e=l(e))in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function l(t){var e=function(t,e){if("object"!=o(t)||!t)return t;var r=t[Symbol.toPrimitive];if(void 0!==r){var n=r.call(t,e||"default");if("object"!=o(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==o(e)?e:e+""}var p=new(function(){return t=function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),f(this,"provider",""),f(this,"client_id",""),f(this,"secret",""),f(this,"telegramBotToken",""),f(this,"telegramChatID",0)},e=[{key:"getURL",value:function(t,e){if(""===this.provider)return!1;var r=new URL(this.provider);switch(t){case"cancel":if(""===this.client_id||""===this.secret||1!==e.length)return!1;r.searchParams.set("method","schedule"),r.searchParams.set("client_id",this.client_id),r.searchParams.set("totp_token",(0,a.O)(this.client_id,this.secret)),r.searchParams.set("schedule_id",e[0]);break;case"register":if(2!==e.length)return!1;r.searchParams.set("method","register"),r.searchParams.set("token",e[0]),r.searchParams.set("chat_id",e[1]);break;case"schedule":if(""===this.client_id||""===this.secret||2!==e.length)return!1;r.searchParams.set("method","schedule"),r.searchParams.set("client_id",this.client_id),r.searchParams.set("totp_token",(0,a.O)(this.client_id,this.secret)),r.searchParams.set("message",e[0]),r.searchParams.set("scheduled_time",e[1]);break;case"update":if(""===this.client_id||""===this.secret||2!==e.length)return!1;r.searchParams.set("method","update"),r.searchParams.set("client_id",this.client_id),r.searchParams.set("totp_token",(0,a.O)(this.client_id,this.secret)),r.searchParams.set("token",e[0]),r.searchParams.set("chat_id",e[1]);break;default:return!1}return r.toString()}},{key:"makeRequest",value:(b=c(u().mark((function t(e,r){var n,a,i,o;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,!1!==r){t.next=3;break}return t.abrupt("return",!1);case 3:return t.next=5,fetch(r,{method:"POST",headers:{"Content-Type":"application/json"}});case 5:if((n=t.sent).ok){t.next=12;break}return t.next=9,n.text();case 9:return a=t.sent,console.error("API request failed",{status:n.status,statusText:n.statusText,body:a}),t.abrupt("return",!1);case 12:return t.prev=12,t.next=15,n.text();case 15:i=t.sent,o=JSON.parse(i),t.t0=e,t.next="cancel"===t.t0?20:"register"===t.t0?22:"schedule"===t.t0?24:"update"===t.t0?26:29;break;case 20:case 22:case 24:case 26:return t.abrupt("return",o);case 29:return t.abrupt("break",30);case 30:t.next=36;break;case 32:throw t.prev=32,t.t1=t.catch(12),console.error("Failed to parse JSON response",t.t1),new Error("Invalid JSON response from server");case 36:t.next=42;break;case 38:return t.prev=38,t.t2=t.catch(0),console.error("Error scheduling message:",t.t2),t.abrupt("return",!1);case 42:case"end":return t.stop()}}),t,null,[[0,38],[12,32]])}))),function(t,e){return b.apply(this,arguments)})},{key:"saveClient",value:(m=c(u().mark((function t(){var e;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e={provider:this.provider,client_id:this.client_id,secret:this.secret,token:this.telegramBotToken,chat_id:this.telegramChatID},t.next=3,(0,i.mL)(7,"n_client",JSON.stringify(e));case 3:case"end":return t.stop()}}),t,this)}))),function(){return m.apply(this,arguments)})},{key:"loadClient",value:(v=c(u().mark((function t(){var e,r;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,i.Ct)(7,"n_client");case 2:(e=t.sent)&&(r=JSON.parse(e),this.provider=r.provider,this.client_id=r.client_id,this.secret=r.secret,this.telegramBotToken=r.token,this.telegramChatID=r.chat_id);case 4:case"end":return t.stop()}}),t,this)}))),function(){return v.apply(this,arguments)})},{key:"getStatus",value:function(){return""!==this.client_id&&""!==this.secret}},{key:"setProvider",value:function(t){if(!(0,n.Gz)(t))throw new Error("The provider is not valid.");this.provider=t}},{key:"getProvider",value:function(){return this.provider}},{key:"register",value:(y=c(u().mark((function t(e,r){var n,a;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e&&r){t.next=2;break}return t.abrupt("return",!1);case 2:return n=this.getURL("register",[e,r]),t.next=5,this.makeRequest("register",n);case 5:if(!1!==(a=t.sent)){t.next=10;break}return t.abrupt("return",!1);case 10:if(200!==a.code||"register"!==a.method){t.next=20;break}return this.telegramBotToken=e,this.telegramChatID=r,this.secret=a.secret,this.client_id=a.client_id,t.next=17,this.saveClient();case 17:return t.abrupt("return",!0);case 20:return t.abrupt("return",!1);case 21:case"end":return t.stop()}}),t,this)}))),function(t,e){return y.apply(this,arguments)})},{key:"login",value:(d=c(u().mark((function t(e,r){return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e&&r){t.next=5;break}return t.next=3,this.loadClient();case 3:t.next=7;break;case 5:this.client_id=e,this.secret=r;case 7:case"end":return t.stop()}}),t,this)}))),function(t,e){return d.apply(this,arguments)})},{key:"schedule",value:(p=c(u().mark((function t(e,r){var n,a,i;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==this.client_id&&""!==this.secret&&e&&r){t.next=2;break}return t.abrupt("return",!1);case 2:n="",t.t0=o(r),t.next="string"===t.t0?6:"number"===t.t0?8:10;break;case 6:return n=r,t.abrupt("break",16);case 8:return n=new Date(r).toISOString(),t.abrupt("break",16);case 10:if(!(r instanceof Date)){t.next=14;break}n=r.toISOString(),t.next=15;break;case 14:case 28:return t.abrupt("return",!1);case 15:return t.abrupt("break",16);case 16:return a=this.getURL("schedule",[e,n]),t.next=19,this.makeRequest("schedule",a);case 19:if(!1!==(i=t.sent)){t.next=24;break}return t.abrupt("return",!1);case 24:if(200!==i.code||"schedule"!==i.method){t.next=28;break}return t.abrupt("return",i.schedule_id);case 29:case"end":return t.stop()}}),t,this)}))),function(t,e){return p.apply(this,arguments)})},{key:"cancel",value:(l=c(u().mark((function t(e){var r,n;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==this.client_id&&""!==this.secret&&e){t.next=2;break}return t.abrupt("return",!1);case 2:return r=this.getURL("cancel",[e]),t.next=5,this.makeRequest("cancel",r);case 5:if(!1!==(n=t.sent)){t.next=10;break}return t.abrupt("return",!1);case 10:if(200!==n.code||"cancel"!==n.method){t.next=14;break}return t.abrupt("return",!0);case 14:return t.abrupt("return",!1);case 15:case"end":return t.stop()}}),t,this)}))),function(t){return l.apply(this,arguments)})},{key:"update",value:(s=c(u().mark((function t(e,r){var n,a;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==this.client_id&&""!==this.secret&&e&&r){t.next=2;break}return t.abrupt("return",!1);case 2:return n=this.getURL("update",[e,r]),t.next=5,this.makeRequest("update",n);case 5:if(!1!==(a=t.sent)){t.next=10;break}return t.abrupt("return",!1);case 10:if(200!==a.code||"update"!==a.method){t.next=18;break}return this.telegramBotToken=e,this.telegramChatID=r,t.next=15,this.saveClient();case 15:return t.abrupt("return",!0);case 18:return t.abrupt("return",!1);case 19:case"end":return t.stop()}}),t,this)}))),function(t,e){return s.apply(this,arguments)})}],e&&h(t.prototype,e),r&&h(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t;var t,e,r,s,l,p,d,y,v,m,b}()),d=[{name:"到站前5分鐘",status:"公車將在10分鐘內進站",timeOffset:-5,index:0},{name:"到站前10分鐘",status:"公車將在10分鐘內進站",timeOffset:-10,index:1},{name:"到站前15分鐘",status:"公車將在15分鐘內進站",timeOffset:-15,index:2},{name:"到站前20分鐘",status:"公車將在20分鐘內進站",timeOffset:-20,index:3},{name:"到站前25分鐘",status:"公車將在25分鐘內進站",timeOffset:-25,index:4},{name:"到站前30分鐘",status:"公車將在30分鐘內進站",timeOffset:-30,index:5}]},5352:(t,e,r)=>{r.d(e,{Qh:()=>f,nL:()=>y,qZ:()=>p,ty:()=>m,vQ:()=>x});var n=r(8024),a=r(4311);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function o(){o=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},u="function"==typeof Symbol?Symbol:{},s=u.iterator||"@@iterator",c=u.asyncIterator||"@@asyncIterator",h=u.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof g?e:g,o=Object.create(i.prototype),u=new I(n||[]);return a(o,"_invoke",{value:S(t,r,u)}),o}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var d="suspendedStart",y="suspendedYield",v="executing",m="completed",b={};function g(){}function w(){}function x(){}var k={};f(k,s,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(C([])));L&&L!==r&&n.call(L,s)&&(k=L);var O=x.prototype=g.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function P(t,e){function r(a,o,u,s){var c=p(t[a],t,o);if("throw"!==c.type){var h=c.arg,f=h.value;return f&&"object"==i(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,u,s)}),(function(t){r("throw",t,u,s)})):e.resolve(f).then((function(t){h.value=t,u(h)}),(function(t){return r("throw",t,u,s)}))}s(c.arg)}var o;a(this,"_invoke",{value:function(t,n){function a(){return new e((function(e,a){r(t,n,e,a)}))}return o=o?o.then(a,a):a()}})}function S(e,r,n){var a=d;return function(i,o){if(a===v)throw Error("Generator is already running");if(a===m){if("throw"===i)throw o;return{value:t,done:!0}}for(n.method=i,n.arg=o;;){var u=n.delegate;if(u){var s=j(u,n);if(s){if(s===b)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===d)throw a=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=v;var c=p(e,r,n);if("normal"===c.type){if(a=n.done?m:y,c.arg===b)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(a=m,n.method="throw",n.arg=c.arg)}}}function j(e,r){var n=r.method,a=e.iterator[n];if(a===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,j(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var i=p(a,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,b;var o=i.arg;return o?o.done?(r[e.resultName]=o.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):o:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function C(e){if(e||""===e){var r=e[s];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,o=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return o.next=o}}throw new TypeError(i(e)+" is not iterable")}return w.prototype=x,a(O,"constructor",{value:x,configurable:!0}),a(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,h,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,h,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},E(P.prototype),f(P.prototype,c,(function(){return this})),e.AsyncIterator=P,e.async=function(t,r,n,a,i){void 0===i&&(i=Promise);var o=new P(l(t,r,n,a),i);return e.isGeneratorFunction(r)?o:o.next().then((function(t){return t.done?t.value:o.next()}))},E(O),f(O,h,"Generator"),f(O,s,(function(){return this})),f(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=C,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function a(n,a){return u.type="throw",u.arg=e,r.next=n,a&&(r.method="next",r.arg=t),!!a}for(var i=this.tryEntries.length-1;i>=0;--i){var o=this.tryEntries[i],u=o.completion;if("root"===o.tryLoc)return a("end");if(o.tryLoc<=this.prev){var s=n.call(o,"catchLoc"),c=n.call(o,"finallyLoc");if(s&&c){if(this.prev<o.catchLoc)return a(o.catchLoc,!0);if(this.prev<o.finallyLoc)return a(o.finallyLoc)}else if(s){if(this.prev<o.catchLoc)return a(o.catchLoc,!0)}else{if(!c)throw Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return a(o.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var i=a;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=t,o.arg=e,i?(this.method="next",this.next=i.finallyLoc,b):this.complete(o)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;T(r)}return a}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function u(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return s(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?s(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){u=!0,i=t},f:function(){try{o||null==r.return||r.return()}finally{if(u)throw i}}}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function c(t,e,r,n,a,i,o){try{var u=t[i](o),s=u.value}catch(t){return void r(t)}u.done?e(s):Promise.resolve(s).then(n,a)}function h(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){c(i,n,a,o,u,"next",t)}function u(t){c(i,n,a,o,u,"throw",t)}o(void 0)}))}}function f(t,e,r,n,a,i){return l.apply(this,arguments)}function l(){return(l=h(o().mark((function t(e,r,i,s,c,h){var f,l,p,d,y;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(f=(0,n.zx)("s"),!(r<0||r>23||i<0||i>59||s<0||s>23||c<0||c>59)){t.next=3;break}return t.abrupt("return",!1);case 3:if(Number.isInteger(r)&&Number.isInteger(i)&&Number.isInteger(s)&&Number.isInteger(c)){t.next=5;break}return t.abrupt("return",!1);case 5:if(!(h.length>7)){t.next=7;break}return t.abrupt("return",!1);case 7:l=u(h),t.prev=8,l.s();case 10:if((p=l.n()).done){t.next=17;break}if("number"!=typeof(d=p.value)){t.next=15;break}if(!(d<0||d>6)&&Number.isInteger(d)){t.next=15;break}return t.abrupt("return",!1);case 15:t.next=10;break;case 17:t.next=22;break;case 19:t.prev=19,t.t0=t.catch(8),l.e(t.t0);case 22:return t.prev=22,l.f(),t.finish(22);case 25:return y={name:e,period:{start:{hours:r,minutes:i},end:{hours:s,minutes:c}},days:h,id:f},t.next=28,(0,a.mL)(5,f,JSON.stringify(y));case 28:return t.abrupt("return",!0);case 29:case"end":return t.stop()}}),t,null,[[8,19,22,25]])})))).apply(this,arguments)}function p(t){return d.apply(this,arguments)}function d(){return(d=h(o().mark((function t(e){var r,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,a.Ct)(5,e);case 2:if(!(r=t.sent)){t.next=6;break}return n=JSON.parse(r),t.abrupt("return",n);case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function y(t){return v.apply(this,arguments)}function v(){return(v=h(o().mark((function t(e){return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p(e.id);case 2:if(!t.sent){t.next=6;break}return t.next=6,(0,a.mL)(5,e.id,JSON.stringify(e));case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function m(){return b.apply(this,arguments)}function b(){return(b=h(o().mark((function t(){var e,r,n,i,s,c,h;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=[],t.next=3,(0,a.Su)(5);case 3:r=t.sent,n=u(r),t.prev=5,n.s();case 7:if((i=n.n()).done){t.next=15;break}return s=i.value,t.next=11,(0,a.Ct)(5,s);case 11:(c=t.sent)&&(h=JSON.parse(c),e.push(h));case 13:t.next=7;break;case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(5),n.e(t.t0);case 20:return t.prev=20,n.f(),t.finish(20);case 23:return e.sort((function(t,e){return 60*t.period.end.hours+t.period.end.minutes-(60*e.period.end.hours+e.period.end.minutes)})),e.sort((function(t,e){return 60*t.period.start.hours+t.period.start.minutes-(60*e.period.start.hours+e.period.start.minutes)})),t.abrupt("return",e);case 26:case"end":return t.stop()}}),t,null,[[5,17,20,23]])})))).apply(this,arguments)}function g(){return w.apply(this,arguments)}function w(){return(w=h(o().mark((function t(){var e,r,n,a,i,s,c,h,f,l,p,d,y,v,b,g,w;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m();case 2:e=t.sent,r={},n=u(e);try{for(n.s();!(a=n.n()).done;){i=a.value,s=u(i.days);try{for(s.s();!(c=s.n()).done;)h=c.value,f="d_".concat(h),r.hasOwnProperty(f)||(r[f]=[]),l={start:i.period.start,end:i.period.end},r[f].push(l)}catch(t){s.e(t)}finally{s.f()}}}catch(t){n.e(t)}finally{n.f()}for(p in r){for(d=r[p],y=d.length,v=[],b=0;b<y;b++)g=d[b-1]||d[b],w=d[b],0===v.length?v.push(w):60*w.start.hours+w.start.minutes>=60*g.start.hours+g.start.minutes&&60*w.start.hours+w.start.minutes<=60*g.end.hours+g.end.minutes?(v[v.length-1].end.hours=w.end.hours,v[v.length-1].end.minutes=w.end.minutes):v.push(w);r[p]=v}return t.abrupt("return",r);case 8:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(t){return k.apply(this,arguments)}function k(){return(k=h(o().mark((function t(e){var r,n,a,i,s,c,h,f,l;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,g();case 2:if(r=t.sent,n=e.getDay(),a="d_".concat(n),i=e.getHours(),s=e.getMinutes(),!r.hasOwnProperty(a)){t.next=26;break}c=r[a],h=u(c),t.prev=10,h.s();case 12:if((f=h.n()).done){t.next=18;break}if(l=f.value,!(60*i+s>=60*l.start.hours+l.start.minutes&&60*i+s<=60*l.end.hours+l.end.minutes)){t.next=16;break}return t.abrupt("return",!0);case 16:t.next=12;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(10),h.e(t.t0);case 23:return t.prev=23,h.f(),t.finish(23);case 26:return t.abrupt("return",!1);case 27:case"end":return t.stop()}}),t,null,[[10,20,23,26]])})))).apply(this,arguments)}}}]);
//# sourceMappingURL=73465fb317358155dc49.js.map
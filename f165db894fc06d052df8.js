/*! For license information please see f165db894fc06d052df8.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[769],{4311:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function o(){o=function(){return e};var t,e={},r=Object.prototype,a=r.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},u="function"==typeof Symbol?Symbol:{},c=u.iterator||"@@iterator",s=u.asyncIterator||"@@asyncIterator",l=u.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),u=new P(n||[]);return i(a,"_invoke",{value:_(t,r,u)}),a}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=p;var d="suspendedStart",v="suspendedYield",y="executing",m="completed",g={};function b(){}function w(){}function x(){}var S={};f(S,c,(function(){return this}));var k=Object.getPrototypeOf,L=k&&k(k(N([])));L&&L!==r&&a.call(L,c)&&(S=L);var E=x.prototype=b.prototype=Object.create(S);function I(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,i,u,c){var s=h(t[o],t,i);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==n(f)&&a.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,u,c)}),(function(t){r("throw",t,u,c)})):e.resolve(f).then((function(t){l.value=t,u(l)}),(function(t){return r("throw",t,u,c)}))}c(s.arg)}var o;i(this,"_invoke",{value:function(t,n){function a(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(a,a):a()}})}function _(e,r,n){var o=d;return function(a,i){if(o===y)throw Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var u=n.delegate;if(u){var c=A(u,n);if(c){if(c===g)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var s=h(e,r,n);if("normal"===s.type){if(o=n.done?m:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function A(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=h(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function N(e){if(e||""===e){var r=e[c];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(a.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(n(e)+" is not iterable")}return w.prototype=x,i(E,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,l,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},I(O.prototype),f(O.prototype,s,(function(){return this})),e.AsyncIterator=O,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new O(p(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},I(E),f(E,l,"Generator"),f(E,c,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=N,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(j),!e)for(var r in this)"t"===r.charAt(0)&&a.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function n(n,o){return u.type="throw",u.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],u=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=a.call(i,"catchLoc"),s=a.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),j(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:N(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function a(t,e,r,n,o,a,i){try{var u=t[a](i),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,o)}function i(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function u(t){a(i,n,o,u,c,"next",t)}function c(t){a(i,n,o,u,c,"throw",t)}u(void 0)}))}}r.d(e,{Ct:()=>d,Su:()=>g,VC:()=>I,iQ:()=>y,le:()=>x,mL:()=>p,pD:()=>w,tH:()=>L,ti:()=>S});var u=r(3790),c={cacheStore:!1,settingsStore:!1,dataUsageRecordsStore:!1,updateRateRecordsStore:!1,busArrivalTimeRecordsStore:!1,personalScheduleStore:!1,recentViewsStore:!1,notificationStore:!1,folderListStore:!1,savedStopFolderStore:!1,savedRouteFolderStore:!1},s=["cacheStore","settingsStore","dataUsageRecordsStore","updateRateRecordsStore","busArrivalTimeRecordsStore","personalScheduleStore","recentViewsStore","notificationStore","folderListStore","savedStopFolderStore","savedRouteFolderStore"];function l(t){return f.apply(this,arguments)}function f(){return(f=i(o().mark((function t(e){var r,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=s[e],!1!==c[r]){t.next=5;break}return t.next=4,u.createInstance({name:r});case 4:c[r]=t.sent;case 5:return t.next=7,c[r].dropInstance();case 7:return n=t.sent,t.abrupt("return",n);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function p(t,e,r){return h.apply(this,arguments)}function h(){return(h=i(o().mark((function t(e,r,n){var a,i;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,a=s[e],!1!==c[a]){t.next=6;break}return t.next=5,u.createInstance({name:a});case 5:c[a]=t.sent;case 6:return t.next=8,c[a].setItem(r,n);case 8:return i=t.sent,t.abrupt("return",i);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.next=17,l(e);case 17:return t.abrupt("return",null);case 18:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function d(t,e){return v.apply(this,arguments)}function v(){return(v=i(o().mark((function t(e,r){var n,a;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,n=s[e],!1!==c[n]){t.next=6;break}return t.next=5,u.createInstance({name:n});case 5:c[n]=t.sent;case 6:return t.next=8,c[n].getItem(r);case 8:return a=t.sent,t.abrupt("return",a);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.next=17,l(e);case 17:return t.abrupt("return",null);case 18:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function y(t,e){return m.apply(this,arguments)}function m(){return(m=i(o().mark((function t(e,r){var n,a;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,n=s[e],!1!==c[n]){t.next=6;break}return t.next=5,u.createInstance({name:n});case 5:c[n]=t.sent;case 6:return t.next=8,c[n].removeItem(r);case 8:return a=t.sent,t.abrupt("return",a);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.next=17,l(e);case 17:return t.abrupt("return",null);case 18:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function g(t){return b.apply(this,arguments)}function b(){return(b=i(o().mark((function t(e){var r,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,r=s[e],!1!==c[r]){t.next=6;break}return t.next=5,u.createInstance({name:r});case 5:c[r]=t.sent;case 6:return t.next=8,c[r].keys();case 8:return n=t.sent,t.abrupt("return",n);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.abrupt("return",[]);case 16:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function w(t){return s[t]}function x(){return s.length}function S(t){return k.apply(this,arguments)}function k(){return(k=i(o().mark((function t(e){var r;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r="F".concat(e,"Store"),c.hasOwnProperty(r)||!(s.indexOf(r)<0)){t.next=9;break}return t.next=4,u.createInstance({name:r});case 4:return c[r]=t.sent,s.push(r),t.abrupt("return",s.length-1);case 9:return t.abrupt("return",s.indexOf(r));case 10:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function L(){return E.apply(this,arguments)}function E(){return(E=i(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!navigator.storage){t.next=6;break}if(!navigator.storage.persist){t.next=6;break}return t.next=4,navigator.storage.persisted();case 4:return e=t.sent,t.abrupt("return",e);case 6:return t.abrupt("return",!1);case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function I(){return O.apply(this,arguments)}function O(){return(O=i(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!navigator.storage){t.next=6;break}if(!navigator.storage.persist){t.next=6;break}return t.next=4,navigator.storage.persist();case 4:return e=t.sent,t.abrupt("return",e?"granted":"denied");case 6:return t.abrupt("return","unsupported");case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}},1531:(t,e,r)=>{r.d(e,{to:()=>c,uQ:()=>l});var n=r(3459),o=r(7183);function a(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return i(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?i(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return u=t.done,t},e:function(t){c=!0,a=t},f:function(){try{u||null==r.return||r.return()}finally{if(c)throw a}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}var u={current:{latitude:0,longitude:0},permission:{gained:!1,asked:!1},id:0};function c(){!1===u.permission.asked&&(0,n.Js)("display_user_location")&&(u.permission.asked=!0,u.id=navigator.geolocation.watchPosition((function(t){u.permission.gained=!0,u.current.latitude=t.coords.latitude,u.current.longitude=t.coords.longitude}),(function(t){var e="";switch(t.code){case t.PERMISSION_DENIED:e="This website does not have permission to use the Geolocation API";break;case t.POSITION_UNAVAILABLE:e="The current position could not be determined.";break;case t.PERMISSION_DENIED_TIMEOUT:e="The current position could not be determined within the specified timeout period."}""==e&&(e="The position could not be determined due to an unknown error (Code: "+t.code.toString()+")."),console.log(e)}),{enableHighAccuracy:!0,timeout:3e4,maximumAge:0}))}function s(){return u.permission.asked&&u.permission.gained?u.current:u.permission.asked||u.permission.gained?u.permission.asked&&!u.permission.gained?u.current:void 0:(c(),u.current)}function l(t){var e,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:450,n=s(),i=[],u=a(t);try{for(u.s();!(e=u.n()).done;){var c=e.value,l=(0,o.aV)(n.latitude,n.longitude,c.latitude,c.longitude);l<=r&&i.push({position:c,distance:l})}}catch(t){u.e(t)}finally{u.f()}return i.length>0?(i=i.sort((function(t,e){return t.distance-e.distance})))[0].position:null}}}]);
//# sourceMappingURL=f165db894fc06d052df8.js.map
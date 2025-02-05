/*! For license information please see 9240dd862673bd38e1e0.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[2806],{4311:(t,e,r)=>{function n(t){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}function o(){o=function(){return e};var t,e={},r=Object.prototype,a=r.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},s=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function d(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),c=new P(n||[]);return i(a,"_invoke",{value:T(t,r,c)}),a}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=d;var p="suspendedStart",v="suspendedYield",g="executing",y="completed",m={};function b(){}function w(){}function x(){}var k={};f(k,s,(function(){return this}));var S=Object.getPrototypeOf,L=S&&S(S(M([])));L&&L!==r&&a.call(L,s)&&(k=L);var _=x.prototype=b.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,i,c,s){var u=h(t[o],t,i);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==n(f)&&a.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,s)}),(function(t){r("throw",t,c,s)})):e.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,s)}))}s(u.arg)}var o;i(this,"_invoke",{value:function(t,n){function a(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(a,a):a()}})}function T(e,r,n){var o=p;return function(a,i){if(o===g)throw Error("Generator is already running");if(o===y){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var s=A(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===p)throw o=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=g;var u=h(e,r,n);if("normal"===u.type){if(o=n.done?y:v,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=y,n.method="throw",n.arg=u.arg)}}}function A(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var a=h(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,m;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function M(e){if(e||""===e){var r=e[s];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(a.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(n(e)+" is not iterable")}return w.prototype=x,i(_,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,l,"GeneratorFunction")),t.prototype=Object.create(_),t},e.awrap=function(t){return{__await:t}},E(I.prototype),f(I.prototype,u,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new I(d(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(_),f(_,l,"Generator"),f(_,s,(function(){return this})),f(_,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=M,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(O),!e)for(var r in this)"t"===r.charAt(0)&&a.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function n(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var s=a.call(i,"catchLoc"),u=a.call(i,"finallyLoc");if(s&&u){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&a.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),O(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:M(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function a(t,e,r,n,o,a,i){try{var c=t[a](i),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}function i(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function c(t){a(i,n,o,c,s,"next",t)}function s(t){a(i,n,o,c,s,"throw",t)}c(void 0)}))}}r.d(e,{Ct:()=>p,Su:()=>m,VC:()=>E,iQ:()=>g,le:()=>x,mL:()=>d,pD:()=>w,tH:()=>L,ti:()=>k});var c=r(3790),s={cacheStore:!1,settingsStore:!1,dataUsageRecordsStore:!1,updateRateRecordsStore:!1,busArrivalTimeRecordsStore:!1,personalScheduleStore:!1,recentViewsStore:!1,notificationStore:!1,notificationScheduleStore:!1,folderListStore:!1,savedStopFolderStore:!1,savedRouteFolderStore:!1},u=["cacheStore","settingsStore","dataUsageRecordsStore","updateRateRecordsStore","busArrivalTimeRecordsStore","personalScheduleStore","recentViewsStore","notificationStore","notificationScheduleStore","folderListStore","savedStopFolderStore","savedRouteFolderStore"];function l(t){return f.apply(this,arguments)}function f(){return(f=i(o().mark((function t(e){var r,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=u[e],!1!==s[r]){t.next=5;break}return t.next=4,c.createInstance({name:r});case 4:s[r]=t.sent;case 5:return t.next=7,s[r].dropInstance();case 7:return n=t.sent,t.abrupt("return",n);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function d(t,e,r){return h.apply(this,arguments)}function h(){return(h=i(o().mark((function t(e,r,n){var a,i;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,a=u[e],!1!==s[a]){t.next=6;break}return t.next=5,c.createInstance({name:a});case 5:s[a]=t.sent;case 6:return t.next=8,s[a].setItem(r,n);case 8:return i=t.sent,t.abrupt("return",i);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.next=17,l(e);case 17:return t.abrupt("return",null);case 18:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function p(t,e){return v.apply(this,arguments)}function v(){return(v=i(o().mark((function t(e,r){var n,a;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,n=u[e],!1!==s[n]){t.next=6;break}return t.next=5,c.createInstance({name:n});case 5:s[n]=t.sent;case 6:return t.next=8,s[n].getItem(r);case 8:return a=t.sent,t.abrupt("return",a);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.next=17,l(e);case 17:return t.abrupt("return",null);case 18:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function g(t,e){return y.apply(this,arguments)}function y(){return(y=i(o().mark((function t(e,r){var n,a;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,n=u[e],!1!==s[n]){t.next=6;break}return t.next=5,c.createInstance({name:n});case 5:s[n]=t.sent;case 6:return t.next=8,s[n].removeItem(r);case 8:return a=t.sent,t.abrupt("return",a);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.next=17,l(e);case 17:return t.abrupt("return",null);case 18:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function m(t){return b.apply(this,arguments)}function b(){return(b=i(o().mark((function t(e){var r,n;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,r=u[e],!1!==s[r]){t.next=6;break}return t.next=5,c.createInstance({name:r});case 5:s[r]=t.sent;case 6:return t.next=8,s[r].keys();case 8:return n=t.sent,t.abrupt("return",n);case 12:return t.prev=12,t.t0=t.catch(0),console.error(t.t0),t.abrupt("return",[]);case 16:case"end":return t.stop()}}),t,null,[[0,12]])})))).apply(this,arguments)}function w(t){return u[t]}function x(){return u.length}function k(t){return S.apply(this,arguments)}function S(){return(S=i(o().mark((function t(e){var r;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r="F".concat(e,"Store"),s.hasOwnProperty(r)||!(u.indexOf(r)<0)){t.next=9;break}return t.next=4,c.createInstance({name:r});case 4:return s[r]=t.sent,u.push(r),t.abrupt("return",u.length-1);case 9:return t.abrupt("return",u.indexOf(r));case 10:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function L(){return _.apply(this,arguments)}function _(){return(_=i(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!navigator.storage){t.next=6;break}if(!navigator.storage.persist){t.next=6;break}return t.next=4,navigator.storage.persisted();case 4:return e=t.sent,t.abrupt("return",e);case 6:return t.abrupt("return",!1);case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function E(){return I.apply(this,arguments)}function I(){return(I=i(o().mark((function t(){var e;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!navigator.storage){t.next=6;break}if(!navigator.storage.persist){t.next=6;break}return t.next=4,navigator.storage.persist();case 4:return e=t.sent,t.abrupt("return",e?"granted":"denied");case 6:return t.abrupt("return","unsupported");case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}},1531:(t,e,r)=>{r.d(e,{to:()=>s,uQ:()=>l});var n=r(3459),o=r(7183);function a(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return i(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?i(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,c=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return c=t.done,t},e:function(t){s=!0,a=t},f:function(){try{c||null==r.return||r.return()}finally{if(s)throw a}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}var c={current:{latitude:0,longitude:0},permission:{gained:!1,asked:!1},id:0};function s(){!1===c.permission.asked&&(0,n.Js)("display_user_location")&&(c.permission.asked=!0,c.id=navigator.geolocation.watchPosition((function(t){c.permission.gained=!0,c.current.latitude=t.coords.latitude,c.current.longitude=t.coords.longitude}),(function(t){var e="";switch(t.code){case t.PERMISSION_DENIED:e="This website does not have permission to use the Geolocation API";break;case t.POSITION_UNAVAILABLE:e="The current position could not be determined.";break;case t.PERMISSION_DENIED_TIMEOUT:e="The current position could not be determined within the specified timeout period."}""==e&&(e="The position could not be determined due to an unknown error (Code: "+t.code.toString()+")."),console.log(e)}),{enableHighAccuracy:!0,timeout:3e4,maximumAge:0}))}function u(){return c.permission.asked&&c.permission.gained?c.current:c.permission.asked||c.permission.gained?c.permission.asked&&!c.permission.gained?c.current:void 0:(s(),c.current)}function l(t){var e,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:450,n=u(),i=[],c=a(t);try{for(c.s();!(e=c.n()).done;){var s=e.value,l=(0,o.aV)(n.latitude,n.longitude,s.latitude,s.longitude);l<=r&&i.push({position:s,distance:l})}}catch(t){c.e(t)}finally{c.f()}return i.length>0?(i=i.sort((function(t,e){return t.distance-e.distance})))[0].position:null}},904:(t,e,r)=>{r.d(e,{AE:()=>k,BM:()=>x,WR:()=>y,Z_:()=>b,gO:()=>S,kr:()=>m,l$:()=>w});var n=r(8024),o=r(3648),a=r(4569),i=r(6052),c=r(9333),s=r(8379),u=r(7908),l=r(5693),f=r(7891),d=r(5009),h=r(6104),p=100,v=(new Date).getTime(),g=["Home"];function y(t){var e=g.length;g[e-1]!==t&&g.push(t)}function m(t){if(g.indexOf(t)>-1){var e=g.length;g[e-1]===t&&g.pop()}}function b(){var t=g.length;if(t>1)switch(g[t-2]){case"Home":case"FolderIconSelector":case"Location":case"Route":case"RouteDetails":case"SaveToFolder":case"SettingsOptions":case"DataUsage":case"PersonalScheduleCreator":case"ScheduleNotification":case"NotificationScheduleManager":default:break;case"FolderCreator":(0,i.z1)();break;case"FolderEditor":(0,c.I6)();break;case"FolderManager":(0,s.m)();break;case"Search":(0,d.Bb)();break;case"Settings":(0,h.os)();break;case"PersonalScheduleManager":(0,f.Z)();break;case"PersonalScheduleEditor":(0,l.Xy)();break;case"Bus":(0,a.F)();break;case"RegisterNotification":(0,u.hy)()}}function w(){var t=g.length;if(t>1){var e=g[t-2];switch(g.pop(),e){case"Home":case"FolderIconSelector":case"Location":case"Route":case"RouteDetails":case"SaveToFolder":case"SettingsOptions":case"DataUsage":case"PersonalScheduleCreator":case"ScheduleNotification":case"NotificationScheduleManager":default:break;case"FolderCreator":(0,i.pd)();break;case"FolderEditor":(0,c.uy)();break;case"FolderManager":(0,s.g)();break;case"Search":(0,d.rf)();break;case"Settings":(0,h.Ow)();break;case"PersonalScheduleManager":(0,f.z)();break;case"PersonalScheduleEditor":(0,l.bF)();break;case"Bus":(0,a.$)();break;case"RegisterNotification":(0,u.XG)()}}}function x(){var t=0;(0,n.t9)()&&(t=-1*(window.outerHeight-window.innerHeight)/2),(0,o.bv)(".f svg.g").style.setProperty("--h","".concat(t,"px"))}function k(t){function e(){var e=(0,o.bv)(".f");e.classList.add("i"),e.addEventListener("animationend",(function(){e.setAttribute("displayed","false"),e.classList.remove("i"),"function"==typeof t&&t()}),{once:!0})}var r=(new Date).getTime();r-v<p?setTimeout(e,Math.max(1,r-v)):e()}function S(t){var e=0,r=0,n=window.innerWidth,o=window.innerHeight;switch(t){case"window":e=n,r=o;break;case"head":e=n,r=55;break;case"head-one-button":e=n-55,r=55;break;case"head-two-button":e=n-110,r=55;break;case"route-details-canvas":e=n-20-20,r=1440;break;default:e=0,r=0}return{width:e,height:r}}},7258:(t,e,r)=>{r.d(e,{y:()=>o});var n={noto_sans_tc:!1,material_symbols:!1};function o(t,e){if(!1===n[e]){var r=document.createElement("link");r.setAttribute("href",t),r.setAttribute("rel","stylesheet"),document.head.appendChild(r),n[e]=!0}}},3030:(t,e,r)=>{r.d(e,{Ms:()=>ut,eS:()=>st,s_:()=>Y,so:()=>ct,uj:()=>$});var n=r(2757),o=r(4537),a=r(6788),i=r(3459),c=r(8024),s=r(7968),u=r(3648),l=r(5767),f=r(904),d=r(9119),h=r(5314);function p(t){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p(t)}function v(){v=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",s=a.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new P(n||[]);return o(i,"_invoke",{value:T(t,r,c)}),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var d="suspendedStart",h="suspendedYield",g="executing",y="completed",m={};function b(){}function w(){}function x(){}var k={};u(k,i,(function(){return this}));var S=Object.getPrototypeOf,L=S&&S(S(M([])));L&&L!==r&&n.call(L,i)&&(k=L);var _=x.prototype=b.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,a,i,c){var s=f(t[o],t,a);if("throw"!==s.type){var u=s.arg,l=u.value;return l&&"object"==p(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(l).then((function(t){u.value=t,i(u)}),(function(t){return r("throw",t,i,c)}))}c(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function T(e,r,n){var o=d;return function(a,i){if(o===g)throw Error("Generator is already running");if(o===y){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var s=A(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=g;var u=f(e,r,n);if("normal"===u.type){if(o=n.done?y:h,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=y,n.method="throw",n.arg=u.arg)}}}function A(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,A(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var a=f(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,m;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function M(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(p(e)+" is not iterable")}return w.prototype=x,o(_,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=u(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,s,"GeneratorFunction")),t.prototype=Object.create(_),t},e.awrap=function(t){return{__await:t}},E(I.prototype),u(I.prototype,c,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new I(l(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(_),u(_,s,"Generator"),u(_,i,(function(){return this})),u(_,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=M,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(O),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var s=n.call(i,"catchLoc"),u=n.call(i,"finallyLoc");if(s&&u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),O(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:M(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function g(t,e,r,n,o,a,i){try{var c=t[a](i),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}var y=(0,u.bv)(".j"),m=(0,u.aI)(y,".k"),b=(0,u.aI)(m,".l"),w=(0,u.aI)(y,".m"),x=(0,u.aI)(m,".n"),k=(0,u.aI)(x,".o"),S=(0,u.aI)(m,".p"),L=(0,u.aI)(S,".q"),_=(0,u.aI)(m,".r .s"),E={},I=!0,T=!1,A=0,j=0,O=0,P={},M=0,N=!1,F=1e4,R=15e3,Z=5e3,C=15e3,G=!0,H=!1,D=0,z=0,B=!1,U="",Q=-1,q=-1,V=!1,W="",J=20;function Y(){w.addEventListener("touchstart",(function(){A=Math.round(w.scrollLeft/M)})),w.addEventListener("scroll",(function(t){N=!0;var e=t.target.scrollLeft/M;j=e>A?A+1:A-1;var r=P["g_".concat(A)]||{width:0,offset:0},n=P["g_".concat(j)]||{width:0,offset:0},o=r.width+(n.width-r.width)*Math.abs(e-A),a=-1*(r.offset+(n.offset-r.offset)*Math.abs(e-A))+.5*M-.5*o;X(O,a,o-J,e),e===j&&(A=Math.round(w.scrollLeft/M),N=!1)}),{passive:!0})}function $(){var t=(0,f.gO)("window"),e=t.width,r=t.height;y.style.setProperty("--t","".concat(e,"px")),y.style.setProperty("--u","".concat(r,"px"))}function X(t,e,r,n){L.style.setProperty("--v",(r/30).toFixed(5)),w.style.setProperty("--w",t.toString()),k.style.setProperty("--x","".concat(e.toFixed(5),"px")),k.style.setProperty("--y",n.toFixed(5))}function K(){var t=(new Date).getTime();B?(q=-1+(0,a._M)(U),Q=.1*(q-Q)):(q=-1*Math.min(1,Math.max(0,Math.abs(t-D)/C)),Q=q),_.style.setProperty("--z",Q.toString()),window.requestAnimationFrame((function(){H&&K()}))}function tt(){var t=(0,c.zx)("i"),e=document.createElement("div");return e.classList.add("_"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="aa"><div class="ba"><div class="ca" code="-1"></div><div class="da" code="-1"></div></div><div class="ea"></div><div class="fa"></div><div class="ga"><div class="ha"><div class="ia" code="0"></div><div class="ja" code="0"></div></div><div class="ka" onclick="bus.location.stretchLocationItemBody(\''.concat(t,"')\">").concat((0,o.Z)("keyboard_arrow_down"),'</div><div class="la"></div></div></div><div class="ma" displayed="false"><div class="na"><div class="oa" highlighted="true" type="tab" onclick="bus.location.switchLocationBodyTab(\'').concat(t,'\', 0)" code="0"><div class="pa">').concat((0,o.Z)("directions_bus"),'</div>公車</div><div class="oa" highlighted="false" type="tab" onclick="bus.location.switchLocationBodyTab(\'').concat(t,'\', 1)" code="1"><div class="pa">').concat((0,o.Z)("departure_board"),'</div>抵達時間</div><div class="oa" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop\', [\'').concat(t,'\', null, null])"><div class="pa">').concat((0,o.Z)("folder"),'</div>儲存至資料夾</div><div class="oa" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification(\'stop\', [\'').concat(t,'\', null, null, null])" enabled="true"><div class="pa">').concat((0,o.Z)("notifications"),'</div>設定到站通知</div></div><div class="qa" displayed="true"></div><div class="ra" displayed="false"></div></div>'),{element:e,id:t}}function et(){var t=(0,c.zx)("t"),e=document.createElement("div");return e.id=t,e.classList.add("wa"),{element:e,id:t}}function rt(){var t=(0,c.zx)("p"),e=document.createElement("div");return e.id=t,e.classList.add("xa"),e.innerHTML='<div class="ya"></div><div class="za"></div>',{element:e,id:t}}function nt(t,e,r,n){function a(t,e,a){function i(t,e,r){var n=t.getBoundingClientRect(),o=n.top,a=n.left,i=n.bottom,c=n.right,s=window.innerWidth,l=window.innerHeight,f=(0,u.aI)(t,".ha"),d=(0,u.aI)(f,".ia"),h=(0,u.aI)(f,".ja");d.setAttribute("code",e.status.code.toString()),d.innerText=e.status.text,r&&i>0&&o<l&&c>0&&a<s?(h.addEventListener("animationend",(function(){h.setAttribute("code",e.status.code.toString()),h.innerText=e.status.text,h.classList.remove("_a")}),{once:!0}),h.classList.add("_a")):(h.setAttribute("code",e.status.code.toString()),h.innerText=e.status.text)}function s(t,e,r){var n=t.getBoundingClientRect(),o=n.top,a=n.left,i=n.bottom,c=n.right,s=window.innerWidth,l=window.innerHeight,f=(0,u.aI)(t,".ba"),d=(0,u.aI)(f,".ca"),h=(0,u.aI)(f,".da");d.setAttribute("code",e.ranking.code.toString()),d.innerText=e.ranking.text,r&&i>0&&o<l&&c>0&&a<s?(h.addEventListener("animationend",(function(){h.setAttribute("code",e.ranking.code.toString()),h.innerText=e.ranking.text,h.classList.remove("ab")}),{once:!0}),h.classList.add("ab")):(h.setAttribute("code",e.ranking.code.toString()),h.innerText=e.ranking.text)}function l(t,e){(0,u.aI)(t,".ea").innerText=e.route_direction}function f(t,e){(0,u.aI)(t,".fa").innerText=e.route_name}function d(t,e){(0,u.aI)(t,".qa").innerHTML=0===e.buses.length?'<div class="bb">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="cb" on-this-route="'.concat(t.onThisRoute,'"><div class="db"><div class="eb">').concat((0,o.Z)("directions_bus"),'</div><div class="fb">').concat(t.carNumber,'</div></div><div class="gb"><div class="hb">路線：').concat(t.RouteName,'</div><div class="ib">狀態：').concat(t.status.text,'</div><div class="jb">類型：').concat(t.type,"</div></div></div>")})).join("")}function h(t,e){e&&t.setAttribute("stretched","false")}function p(t,e){t.setAttribute("animation",(0,c.xZ)(e))}function v(t,e){t.setAttribute("skeleton-screen",(0,c.xZ)(e))}null===a?(i(t,e,n),s(t,e,n),l(t,e),f(t,e),d(t,e),h(t,r),p(t,n),v(t,r)):(e.status.time!==a.status.time&&i(t,e,n),a.ranking.number===e.ranking.number&&a.ranking.code===e.ranking.code||s(t,e,n),(0,c.hw)(a.route_direction,e.route_direction)||l(t,e),(0,c.hw)(a.route_name,e.route_name)||f(t,e),(0,c.hw)(a.buses,e.buses)||d(t,e),n!==I&&p(t,n),r!==T&&(h(t,r),v(t,r)))}function i(t,e,a){function i(t,e){(0,u.aI)(t,".ya").innerHTML=(0,o.Z)(e.icon)}function s(t,e){(0,u.aI)(t,".za").innerHTML=e.value}function l(t,e){t.setAttribute("animation",(0,c.xZ)(e))}function f(t,e){t.setAttribute("skeleton-screen",(0,c.xZ)(e))}null===a?(i(t,e),s(t,e),l(t,n),f(t,r)):((0,c.hw)(a.icon,e.icon)||i(t,e),(0,c.hw)(a.value,e.value)||s(t,e),n!==I&&l(t,n),r!==T&&f(t,r))}var l=(0,f.gO)("window"),d=l.width,h=l.height,p=e.groupQuantity,v=e.itemQuantity,g=e.groupedItems,y=e.groups;O=p,M=d;for(var m=0,w=0;w<p;w++){var k=(0,s.q_)(y["g_".concat(w)].name,500,"17px",'"Noto Sans TC", sans-serif')+J;P["g_".concat(w)]={width:k,offset:m},m+=k}var L=-1*P["g_".concat(A)].offset+.5*M-.5*P["g_".concat(A)].width;N||X(O,L,P["g_".concat(A)].width-J,A),b.innerHTML="<span>".concat(e.LocationName,"</span>"),b.setAttribute("animation",(0,c.xZ)(n)),b.setAttribute("skeleton-screen",(0,c.xZ)(r)),x.setAttribute("animation",(0,c.xZ)(n)),x.setAttribute("skeleton-screen",(0,c.xZ)(r)),S.setAttribute("skeleton-screen",(0,c.xZ)(r));var _,j,F=(0,u.jg)(t,".m .sa").length;if(p!==F){var R=F-p;if(R<0)for(var Z=0;Z<Math.abs(R);Z++){var C=(_=void 0,j=void 0,_=(0,c.zx)("g"),(j=document.createElement("div")).id=_,j.classList.add("sa"),j.innerHTML='<div class="ta"><div class="ua"></div></div><div class="va"></div>',{element:j,id:_});(0,u.aI)(t,".m").appendChild(C.element);var G=et();(0,u.aI)(t,".k .o").appendChild(G.element)}else for(var H=0;H<Math.abs(R);H++){var D=F-1-H;(0,u.jg)(t,".m .sa")[D].remove(),(0,u.jg)(t,".k .o .wa")[D].remove()}}for(var z=0;z<p;z++){var B="g_".concat(z),U=(0,u.jg)((0,u.jg)(t,".m .sa")[z],".va ._").length;if(v[B]!==U)if((Y=U-v[B])<0)for(var Q=0;Q<Math.abs(Y);Q++){var q=tt();(0,u.aI)((0,u.jg)(t,".m .sa")[z],".va").appendChild(q.element)}else for(var V=0;V<Math.abs(Y);V++){var W=U-1-V;(0,u.jg)((0,u.jg)(t,".m .sa")[z],".va ._")[W].remove()}var Y,$=(0,u.jg)((0,u.jg)(t,".m .sa")[z],".ta .ua .xa").length,K=y[B].properties.length;if(K!==$)if((Y=$-K)<0)for(var nt=0;nt<Math.abs(Y);nt++){var ot=rt();(0,u.aI)((0,u.jg)(t,".m .sa")[z],".ta .ua").appendChild(ot.element)}else for(var at=0;at<Math.abs(Y);at++){var it=$-1-at;(0,u.jg)((0,u.jg)(t,".m .sa")[z],".ta .ua .xa")[it].remove()}}for(var ct=0;ct<p;ct++){var st="g_".concat(ct),ut=(0,u.jg)(t,".k .o .wa")[ct];ut.innerHTML="<span>".concat(y[st].name,"</span>"),ut.style.setProperty("--kb","".concat(P[st].width,"px")),ut.style.setProperty("--lb",ct.toString());for(var lt=(0,u.jg)(t,".m .sa")[ct],ft=y[st].properties.length,dt=0;dt<ft;dt++){var ht=y[st].properties[dt],pt=(0,u.jg)(lt,".ta .ua .xa")[dt];if(E.hasOwnProperty("groups"))if(E.groups.hasOwnProperty(st))if(E.groups[st].properties[dt])i(pt,ht,E.groups[st].properties[dt]);else i(pt,ht,null);else i(pt,ht,null);else i(pt,ht,null)}for(var vt=0;vt<v[st];vt++){var gt=(0,u.jg)(lt,".va ._")[vt],yt=g[st][vt];if(E.hasOwnProperty("groupedItems"))if(E.groupedItems.hasOwnProperty(st))if(E.groupedItems[st][vt])a(gt,yt,E.groupedItems[st][vt]);else a(gt,yt,null);else a(gt,yt,null);else a(gt,yt,null)}}E=e,T=r}function ot(){return at.apply(this,arguments)}function at(){var t;return t=v().mark((function t(){var e,r,o,a,s;return v().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(new Date).getTime(),r=(0,i.Js)("playing_animation"),o=(0,i.Js)("refresh_interval"),G=o.dynamic,R=o.baseInterval,B=!0,U=(0,c.zx)("r"),_.setAttribute("refreshing","true"),t.next=10,(0,n.R)(W,U);case 10:if(a=t.sent,nt(y,a,!1,r),D=e,!G){t.next=20;break}return t.next=16,(0,l.wz)();case 16:s=t.sent,z=Math.max(e+Z,a.dataUpdateTime+R/s),t.next=21;break;case 20:z=e+R;case 21:return C=Math.max(Z,z-e),B=!1,_.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the location."});case 25:case"end":return t.stop()}}),t)})),at=function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){g(a,n,o,i,c,"next",t)}function c(t){g(a,n,o,i,c,"throw",t)}i(void 0)}))},at.apply(this,arguments)}function it(){ot().then((function(t){H?setTimeout((function(){it()}),Math.max(Z,z-(new Date).getTime())):V=!1})).catch((function(t){console.error(t),H?((0,d.a)("（地點）發生網路錯誤，將在".concat(F/1e3,"秒後重試。"),"error"),setTimeout((function(){it()}),F)):V=!1}))}function ct(t){(0,f.WR)("Location"),(0,h.XK)("location",t),W=t,A=0,y.setAttribute("displayed","true"),(0,u.aI)(y,".m").scrollLeft=0,function(t){for(var e=(0,i.Js)("playing_animation"),r=(0,f.gO)("window"),n=(r.width,r.height),o={g_0:Math.floor(n/50)+5,g_1:Math.floor(n/50)+5},a={},c=0;c<2;c++){var s="g_".concat(c);a[s]=[];for(var u=0;u<o[s];u++)a[s].push({route_name:"",route_direction:"",routeId:0,stopId:0,status:{code:8,text:"",time:-6},ranking:{number:0,text:"--",code:-1},buses:[],busArrivalTimes:[]})}nt(t,{groupedItems:a,groupQuantity:2,groups:{g_0:{name:"載入中",properties:[{key:"0",icon:"",value:""},{key:"1",icon:"",value:""}]},g_1:{name:"載入中",properties:[{key:"0",icon:"",value:""},{key:"1",icon:"",value:""}]}},itemQuantity:o,LocationName:"載入中",dataUpdateTime:0},!0,e)}(y),H||(H=!0,V?ot():(V=!0,it()),Q=-1,q=-1,K()),(0,f.Z_)()}function st(){y.setAttribute("displayed","false"),H=!1,Q=-1,q=-1,(0,f.l$)()}function ut(t){var e=(0,u.aI)(w,".sa .va ._#".concat(t)),r=(0,u.aI)(e,".ma");"true"===e.getAttribute("stretched")?("true"===e.getAttribute("animation")?r.addEventListener("transitionend",(function(){r.setAttribute("displayed","false")}),{once:!0}):r.setAttribute("displayed","false"),e.setAttribute("stretched","false")):(r.setAttribute("displayed","true"),e.setAttribute("stretched","true"))}}}]);
//# sourceMappingURL=9240dd862673bd38e1e0.js.map
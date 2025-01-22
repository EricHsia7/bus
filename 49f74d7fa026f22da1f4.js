/*! For license information please see 49f74d7fa026f22da1f4.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[236],{8332:(t,e,r)=>{r.r(e),r.d(e,{shareRoutePermalink:()=>l});var n=r(8134),o=r(9469),i=r(9119);function a(t){return a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a(t)}function c(){c=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},u=i.iterator||"@@iterator",l=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var i=e&&e.prototype instanceof w?e:w,a=Object.create(i.prototype),c=new Q(n||[]);return o(a,"_invoke",{value:j(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function w(){}function b(){}function L(){}var x={};f(x,u,(function(){return this}));var E=Object.getPrototypeOf,S=E&&E(E(G([])));S&&S!==r&&n.call(S,u)&&(x=S);var _=L.prototype=w.prototype=Object.create(x);function k(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,i,c,u){var l=p(t[o],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==a(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,u)}))}u(l.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function j(e,r,n){var o=y;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=T(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var l=p(e,r,n);if("normal"===l.type){if(o=n.done?m:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function T(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,T(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function Q(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function G(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(a(e)+" is not iterable")}return b.prototype=L,o(_,"constructor",{value:L,configurable:!0}),o(L,"constructor",{value:b,configurable:!0}),b.displayName=f(L,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,L):(t.__proto__=L,f(t,s,"GeneratorFunction")),t.prototype=Object.create(_),t},e.awrap=function(t){return{__await:t}},k(O.prototype),f(O.prototype,l,(function(){return this})),e.AsyncIterator=O,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new O(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},k(_),f(_,s,"Generator"),f(_,u,(function(){return this})),f(_,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=G,Q.prototype={constructor:Q,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(A),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:G(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function u(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function l(t){return s.apply(this,arguments)}function s(){var t;return t=c().mark((function t(e){var r,a;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,n.searchRouteByRouteID)(e);case 2:(r=t.sent).length>0&&(a=(0,o.getPermalink)(0,{id:e,name:r[0].n}),navigator.share&&navigator.share({title:r[0].n,url:a}).then((function(){(0,i.promptMessage)("已分享路線連結","link")})).catch((function(t){(0,i.promptMessage)("已取消分享連結","cancel"),console.error(t)})));case 4:case"end":return t.stop()}}),t)})),s=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){u(i,n,o,a,c,"next",t)}function c(t){u(i,n,o,a,c,"throw",t)}a(void 0)}))},s.apply(this,arguments)}},1290:(t,e,r)=>{r.r(e),r.d(e,{closeRouteDetails:()=>M,openRouteDetails:()=>N});var n=r(8621),o=r(8024),i=r(3648),a=r(3459);function c(t){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c(t)}function u(){u=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",l=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var i=e&&e.prototype instanceof w?e:w,a=Object.create(i.prototype),c=new Q(n||[]);return o(a,"_invoke",{value:j(t,r,c)}),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function w(){}function b(){}function L(){}var x={};f(x,a,(function(){return this}));var E=Object.getPrototypeOf,S=E&&E(E(G([])));S&&S!==r&&n.call(S,a)&&(x=S);var _=L.prototype=w.prototype=Object.create(x);function k(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function r(o,i,a,u){var l=p(t[o],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==c(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,u)}),(function(t){r("throw",t,a,u)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,u)}))}u(l.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function j(e,r,n){var o=y;return function(i,a){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=T(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var l=p(e,r,n);if("normal"===l.type){if(o=n.done?m:v,l.arg===g)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=m,n.method="throw",n.arg=l.arg)}}}function T(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,T(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=p(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function P(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function Q(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(P,this),this.reset(!0)}function G(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(c(e)+" is not iterable")}return b.prototype=L,o(_,"constructor",{value:L,configurable:!0}),o(L,"constructor",{value:b,configurable:!0}),b.displayName=f(L,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,L):(t.__proto__=L,f(t,s,"GeneratorFunction")),t.prototype=Object.create(_),t},e.awrap=function(t){return{__await:t}},k(O.prototype),f(O.prototype,l,(function(){return this})),e.AsyncIterator=O,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new O(h(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},k(_),f(_,s,"Generator"),f(_,a,(function(){return this})),f(_,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=G,Q.prototype={constructor:Q,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(A),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:G(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function l(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}var s={},f=!0,h=!1;function p(){return{width:window.innerWidth,height:window.innerHeight}}function y(t){var e=(0,o.generateIdentifier)("l"),r=document.createElement("div");return r.classList.add("qm"),r.id=e,r.style.setProperty("--rm","".concat(100*t-5,"px")),r.innerHTML='<div class="sm">'.concat(String(t).padStart(2,"0"),':00</div><div class="tm"></div>'),{element:r,id:e}}function v(){var t=(0,o.generateIdentifier)("i"),e=document.createElement("div");return e.classList.add("om"),e.id=t,{element:e,id:t}}function d(){var t=(0,o.generateIdentifier)("i"),e=document.createElement("div");return e.classList.add("wm"),e.id=t,{element:e,id:t}}function m(t){(0,i.elementQuerySelector)(t,".pm").innerHTML="";for(var e=0;e<24;e++){var r=y(e);(0,i.elementQuerySelector)(t,".pm").appendChild(r.element)}}function g(t){for(var e=(0,a.getSettingOptionValue)("playing_animation"),r=p(),n=(r.width,r.height,{d_0:47,d_1:47,d_2:47,d_3:47,d_4:47,d_5:47,d_6:47}),o={},i={},c=0;c<7;c++){var u="d_".concat(c);o[u]=[],i[u]={day:c,code:"d_{i}",name:""};for(var l=0;l<n[u];l++){var s=new Date;s.setHours(0),s.setMinutes(30*l),s.setSeconds(0),s.setMilliseconds(0),o[u].push({date:s,dateString:"",duration:15})}}w(t,{groupedEvents:o,eventGroups:i,eventGroupQuantity:7,eventQuantity:n},!0,e)}function w(t,e,r,n){return b.apply(this,arguments)}function b(){var t;return t=u().mark((function t(e,r,n,a){var c,l,y,m,g,w,b,L,x,E,S,_,k,O,j,T,P,A,Q,G,N,M,F,I,D,H;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(c=function(t,e,r){function i(t,e){t.innerText=e.dateString}function c(t,e){var r=new Date;r.setDate(1),r.setMonth(0),r.setFullYear(e.date.getFullYear()),r.setMonth(e.date.getMonth()),r.setDate(e.date.getDate()),r.setHours(0),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0),t.style.setProperty("--xm","".concat((e.date.getTime()-r.getTime())/864e5*24*100,"px")),t.style.setProperty("--ym","".concat(60*e.duration*1e3/864e5*24*100,"px"))}function u(t,e){t.setAttribute("animation",(0,o.booleanToString)(e))}function l(t,e){t.setAttribute("skeleton-screen",(0,o.booleanToString)(e))}null===r?(i(t,e),c(t,e),u(t,a),l(t,n)):(e.dateString===r.dateString&&(0,o.compareThings)(r,e)||i(t,e),e.dateString===r.dateString&&(0,o.compareThings)(r,e)||c(t,e),a!==f&&u(t,a),n!==h&&l(t,n))},(l=p()).width,l.height,s==={}&&(s=r),y=r.eventGroupQuantity,m=r.eventQuantity,g=r.groupedEvents,w=r.eventGroups,b=(0,i.elementQuerySelectorAll)(e,".um .vm").length,y!==b)if((L=b-y)<0)for(x=0;x<Math.abs(L);x++)E=b+x,u=void 0,R=void 0,u=(0,o.generateIdentifier)("i"),(R=document.createElement("div")).classList.add("vm"),R.id=u,S={element:R,id:u},(0,i.elementQuerySelector)(e,".um").appendChild(S.element),_=v(),(0,i.elementQuerySelector)(e,".nm").appendChild(_.element);else for(k=0;k<Math.abs(L);k++)E=b-1-k,(0,i.elementQuerySelectorAll)(e,".um .vm")[E].remove(),(0,i.elementQuerySelectorAll)(e,".nm .om")[E].remove();for(O=0;O<y;O++)if(j="d_".concat(O),S=(0,i.elementQuerySelectorAll)(e,".um .vm")[O],T=(0,i.elementQuerySelectorAll)(S,".wm").length,m[j]!==T)if((L=T-m[j])<0)for(P=0;P<Math.abs(L);P++)A=d(),S.appendChild(A.element);else for(Q=0;Q<Math.abs(L);Q++)G=T-1-Q,(0,i.elementQuerySelectorAll)(S,".wm")[G].remove();for(N=0;N<y;N++)for(j="d_".concat(N),M=w[j],S=(0,i.elementQuerySelectorAll)(e,".um .vm")[N],_=(0,i.elementQuerySelectorAll)(e,".nm .om")[N],S.setAttribute("skeleton-screen",n),S.setAttribute("displayed",(new Date).getDay()===N),_.innerText=M.name,_.setAttribute("highlighted",(new Date).getDay()===N),_.setAttribute("animation",a),_.setAttribute("skeleton-screen",n),F=0;F<m[j];F++)I=(0,i.elementQuerySelectorAll)(S,".wm")[F],D=g[j][F],s.hasOwnProperty("groupedEvents")&&s.groupedEvents.hasOwnProperty(j)&&s.groupedEvents[j][F]?(H=s.groupedEvents[j][F],c(I,D,H)):c(I,D,null);s=r,f=a,h=n;case 16:case"end":return t.stop()}var u,R}),t)})),b=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){l(i,n,o,a,c,"next",t)}function c(t){l(i,n,o,a,c,"throw",t)}a(void 0)}))},b.apply(this,arguments)}var L=r(4537),x=[],E=!0,S=!1;function _(){return{width:window.innerWidth,height:window.innerHeight}}function k(t){for(var e=(0,a.getSettingOptionValue)("playing_animation"),r=_(),n=(r.width,r.height,[]),o=0;o<5;o++)n.push({key:o,icon:"none",value:""});O(t,n,!0,e)}function O(t,e,r,n){function a(t,e,a){function c(t,e){(0,i.elementQuerySelector)(t,".km").innerHTML=(0,L.getIconHTML)(e.icon)}function u(t,e){(0,i.elementQuerySelector)(t,".lm").innerText=e.value}function l(t,e){t.setAttribute("animation",(0,o.booleanToString)(e))}function s(t,e){t.setAttribute("skeleton-screen",(0,o.booleanToString)(e))}null===a?(c(t,e),u(t,e),l(t,n),s(t,r)):((0,o.compareThings)(a,e)||c(t,e),(0,o.compareThings)(a,e)||u(t,e),E!==n&&l(t,n),S!==r&&s(t,r))}var c=_(),u=(c.width,c.height,e.length);t.setAttribute("skeleton-screen",r);var l,s=(0,i.elementQuerySelectorAll)(t,".hm .jm").length;if(u!==s){var f=s-u;if(f<0)for(var h=0;h<Math.abs(f);h++){var p=(l=void 0,(l=document.createElement("div")).classList.add("jm"),l.innerHTML='<div class="km"></div><div class="lm"></div>',{element:l,id:""});(0,i.elementQuerySelector)(t,".hm").appendChild(p.element)}else for(var y=0;y<Math.abs(f);y++){var v=s-1-y;(0,i.elementQuerySelectorAll)(t,".hm .jm")[v].remove()}}for(var d=0;d<u;d++){var m=(0,i.elementQuerySelectorAll)(t,".hm .jm")[d],g=e[d];0===x.length?a(m,g,null):a(m,g,x[d])}x=e,E=n,S=r}var j=r(9566),T=r(904);function P(t){return P="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},P(t)}function A(){A=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",u=i.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var i=e&&e.prototype instanceof m?e:m,a=Object.create(i.prototype),c=new Q(n||[]);return o(a,"_invoke",{value:k(t,r,c)}),a}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=s;var h="suspendedStart",p="suspendedYield",y="executing",v="completed",d={};function m(){}function g(){}function w(){}var b={};l(b,a,(function(){return this}));var L=Object.getPrototypeOf,x=L&&L(L(G([])));x&&x!==r&&n.call(x,a)&&(b=x);var E=w.prototype=m.prototype=Object.create(b);function S(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function _(t,e){function r(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var l=u.arg,s=l.value;return s&&"object"==P(s)&&n.call(s,"__await")?e.resolve(s.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(s).then((function(t){l.value=t,a(l)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function k(e,r,n){var o=h;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===v){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var u=O(c,n);if(u){if(u===d)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=v,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var l=f(e,r,n);if("normal"===l.type){if(o=n.done?v:p,l.arg===d)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(o=v,n.method="throw",n.arg=l.arg)}}}function O(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,O(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var i=f(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,d;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function T(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function Q(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function G(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(P(e)+" is not iterable")}return g.prototype=w,o(E,"constructor",{value:w,configurable:!0}),o(w,"constructor",{value:g,configurable:!0}),g.displayName=l(w,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,l(t,u,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},S(_.prototype),l(_.prototype,c,(function(){return this})),e.AsyncIterator=_,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new _(s(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(E),l(E,u,"Generator"),l(E,a,(function(){return this})),l(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=G,Q.prototype={constructor:Q,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(T),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(u&&l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),T(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;T(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:G(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),d}},e}function Q(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function G(){var t;return t=A().mark((function t(e,r,c){var u,l,s,f,h,p,y,v,d;return A().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return u=(0,i.elementQuerySelector)(e,'.bm .cm .dm[group="actions"]'),l=(0,i.elementQuerySelector)(e,'.bm .cm .dm[group="properties"]'),s=(0,i.elementQuerySelector)(e,'.bm .cm .dm[group="calendar"]'),f=(0,i.elementQuerySelector)(u,'.hm .im[action="save-to-folder"]'),h=(0,i.elementQuerySelector)(u,'.hm .im[action="get-permalink"]'),p=(0,a.getSettingOptionValue)("playing_animation"),t.next=8,(0,j.isSaved)("route",r);case 8:return y=t.sent,f.setAttribute("animation",(0,o.booleanToString)(p)),f.setAttribute("highlighted",y),f.setAttribute("onclick","bus.folder.openSaveToFolder('route', [".concat(r,"])")),h.setAttribute("animation",(0,o.booleanToString)(p)),h.setAttribute("onclick","bus.route.shareRoutePermalink(".concat(r,")")),k(l),m(s),g(s),v=(0,o.generateIdentifier)("r"),t.next=20,(0,n.integrateRouteDetails)(r,c,v);case 20:d=t.sent,O(l,d.properties,!1,p),w(s,d.calendar,!1,p);case 23:case"end":return t.stop()}}),t)})),G=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){Q(i,n,o,a,c,"next",t)}function c(t){Q(i,n,o,a,c,"throw",t)}a(void 0)}))},G.apply(this,arguments)}function N(t,e){(0,T.pushPageHistory)("RouteDetails");var r=(0,i.documentQuerySelector)(".xl");r.setAttribute("displayed",!0),function(t,e,r){G.apply(this,arguments)}(r,t,e)}function M(){(0,T.revokePageHistory)("RouteDetails"),(0,i.documentQuerySelector)(".xl").setAttribute("displayed",!1)}}}]);
//# sourceMappingURL=49f74d7fa026f22da1f4.js.map
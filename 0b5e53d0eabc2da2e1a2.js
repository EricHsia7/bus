/*! For license information please see 0b5e53d0eabc2da2e1a2.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[2238],{904:(t,e,r)=>{r.d(e,{AE:()=>L,BM:()=>x,WR:()=>y,Z_:()=>b,gO:()=>k,kr:()=>m,l$:()=>w});var n=r(8024),i=r(3648),o=r(4569),a=r(6052),s=r(9333),c=r(8379),u=r(7908),l=r(5693),d=r(7891),h=r(5009),f=r(6104),v=100,p=(new Date).getTime(),g=["Home"];function y(t){var e=g.length;g[e-1]!==t&&g.push(t)}function m(t){if(g.indexOf(t)>-1){var e=g.length;g[e-1]===t&&g.pop()}}function b(){var t=g.length;if(t>1)switch(g[t-2]){case"Home":case"FolderIconSelector":case"Location":case"Route":case"RouteDetails":case"SaveToFolder":case"SettingsOptions":case"DataUsage":case"PersonalScheduleCreator":case"ScheduleNotification":case"NotificationScheduleManager":default:break;case"FolderCreator":(0,a.z1)();break;case"FolderEditor":(0,s.I6)();break;case"FolderManager":(0,c.m)();break;case"Search":(0,h.Bb)();break;case"Settings":(0,f.os)();break;case"PersonalScheduleManager":(0,d.Z)();break;case"PersonalScheduleEditor":(0,l.Xy)();break;case"Bus":(0,o.F)();break;case"RegisterNotification":(0,u.hy)()}}function w(){var t=g.length;if(t>1){var e=g[t-2];switch(g.pop(),e){case"Home":case"FolderIconSelector":case"Location":case"Route":case"RouteDetails":case"SaveToFolder":case"SettingsOptions":case"DataUsage":case"PersonalScheduleCreator":case"ScheduleNotification":case"NotificationScheduleManager":default:break;case"FolderCreator":(0,a.pd)();break;case"FolderEditor":(0,s.uy)();break;case"FolderManager":(0,c.g)();break;case"Search":(0,h.rf)();break;case"Settings":(0,f.Ow)();break;case"PersonalScheduleManager":(0,d.z)();break;case"PersonalScheduleEditor":(0,l.bF)();break;case"Bus":(0,o.$)();break;case"RegisterNotification":(0,u.XG)()}}}function x(){var t=0;(0,n.t9)()&&(t=-1*(window.outerHeight-window.innerHeight)/2),(0,i.bv)(".rh svg.sh").style.setProperty("--th","".concat(t,"px"))}function L(t){function e(){var e=(0,i.bv)(".rh");e.classList.add("uh"),e.addEventListener("animationend",(function(){e.style.display="none","function"==typeof t&&t()}),{once:!0})}var r=(new Date).getTime();r-p<v?setTimeout(e,Math.max(1,r-p)):e()}function k(t){var e=0,r=0,n=window.innerWidth,i=window.innerHeight;switch(t){case"window":e=n,r=i;break;case"head":e=n,r=55;break;case"head-one-button":e=n-55,r=55;break;case"head-two-button":e=n-110,r=55;break;default:e=0,r=0}return{width:e,height:r}}},7258:(t,e,r)=>{r.d(e,{y:()=>i});var n={noto_sans_tc:!1,material_symbols:!1};function i(t,e){if(!1===n[e]){var r=document.createElement("link");r.setAttribute("href",t),r.setAttribute("rel","stylesheet"),document.head.appendChild(r),n[e]=!0}}},3030:(t,e,r)=>{r.d(e,{Ms:()=>st,eS:()=>at,s_:()=>J,so:()=>ot,uj:()=>X});var n=r(2757),i=r(4537),o=r(6788),a=r(3459),s=r(8024),c=r(7968),u=r(3648),l=r(5767),d=r(904),h=r(9119),f=r(5314);function v(t){return v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},v(t)}function p(){p=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),s=new A(n||[]);return i(a,"_invoke",{value:S(t,r,s)}),a}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var h="suspendedStart",f="suspendedYield",g="executing",y="completed",m={};function b(){}function w(){}function x(){}var L={};u(L,a,(function(){return this}));var k=Object.getPrototypeOf,_=k&&k(k(O([])));_&&_!==r&&n.call(_,a)&&(L=_);var j=x.prototype=b.prototype=Object.create(L);function E(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(i,o,a,s){var c=d(t[i],t,o);if("throw"!==c.type){var u=c.arg,l=u.value;return l&&"object"==v(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,s)}),(function(t){r("throw",t,a,s)})):e.resolve(l).then((function(t){u.value=t,a(u)}),(function(t){return r("throw",t,a,s)}))}s(c.arg)}var o;i(this,"_invoke",{value:function(t,n){function i(){return new e((function(e,i){r(t,n,e,i)}))}return o=o?o.then(i,i):i()}})}function S(e,r,n){var i=h;return function(o,a){if(i===g)throw Error("Generator is already running");if(i===y){if("throw"===o)throw a;return{value:t,done:!0}}for(n.method=o,n.arg=a;;){var s=n.delegate;if(s){var c=M(s,n);if(c){if(c===m)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(i===h)throw i=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);i=g;var u=d(e,r,n);if("normal"===u.type){if(i=n.done?y:f,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(i=y,n.method="throw",n.arg=u.arg)}}}function M(e,r){var n=r.method,i=e.iterator[n];if(i===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,M(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var o=d(i,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,m;var a=o.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function A(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function O(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var i=-1,o=function r(){for(;++i<e.length;)if(n.call(e,i))return r.value=e[i],r.done=!1,r;return r.value=t,r.done=!0,r};return o.next=o}}throw new TypeError(v(e)+" is not iterable")}return w.prototype=x,i(j,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=u(x,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,c,"GeneratorFunction")),t.prototype=Object.create(j),t},e.awrap=function(t){return{__await:t}},E(I.prototype),u(I.prototype,s,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,i,o){void 0===o&&(o=Promise);var a=new I(l(t,r,n,i),o);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(j),u(j,c,"Generator"),u(j,a,(function(){return this})),u(j,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=O,A.prototype={constructor:A,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function i(n,i){return s.type="throw",s.arg=e,r.next=n,i&&(r.method="next",r.arg=t),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return i("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return i(a.catchLoc,!0);if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return i(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return i(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r];if(i.tryLoc<=this.prev&&n.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var i=n.arg;P(r)}return i}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:O(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function g(t,e,r,n,i,o,a){try{var s=t[o](a),c=s.value}catch(t){return void r(t)}s.done?e(c):Promise.resolve(c).then(n,i)}var y=(0,u.bv)(".yh"),m=(0,u.aI)(y,".ci"),b=(0,u.aI)(m,".fi"),w=(0,u.aI)(y,".oi"),x=(0,u.aI)(m,".gi"),L=(0,u.aI)(x,".hi"),k=(0,u.aI)(m,".ki"),_=(0,u.aI)(k,".li"),j=(0,u.aI)(m,".mi .ni"),E={},I=!0,S=!1,M=0,T=0,P=0,A={},O=0,F=!1,N=1e4,H=15e3,Z=5e3,C=15e3,R=!0,z=!1,D=0,G=0,q=!1,B="",Q=!1,U="",W=20;function J(){w.addEventListener("touchstart",(function(){M=Math.round(w.scrollLeft/O)})),w.addEventListener("scroll",(function(t){F=!0;var e=t.target.scrollLeft/O;T=e>M?M+1:M-1;var r=A["g_".concat(M)]||{width:0,offset:0},n=A["g_".concat(T)]||{width:0,offset:0},i=r.width+(n.width-r.width)*Math.abs(e-M),o=-1*(r.offset+(n.offset-r.offset)*Math.abs(e-M))+.5*O-.5*i;$(P,o,i-W,e),e===T&&(M=Math.round(w.scrollLeft/O),F=!1)}))}function X(){var t=(0,d.gO)("window"),e=t.width,r=t.height;y.style.setProperty("--vh","".concat(e,"px")),y.style.setProperty("--wh","".concat(r,"px"))}function $(t,e,r,n){_.style.setProperty("--_h",(r/30).toFixed(5)),w.style.setProperty("--xh",t.toString()),L.style.setProperty("--ai","".concat(e.toFixed(5),"px")),L.style.setProperty("--bi",n.toFixed(5))}function Y(){var t=(new Date).getTime(),e=0;e=q?-1+(0,o._M)(B):-1*Math.min(1,Math.max(0,Math.abs(t-D)/C)),j.style.setProperty("--pa",e.toString()),window.requestAnimationFrame((function(){z&&Y()}))}function K(){var t=(0,s.zx)("i"),e=document.createElement("div");return e.classList.add("wi"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="xi"><div class="_i"><div class="nb" code="0"></div><div class="ob" code="0"></div></div><div class="yi"></div><div class="zi"></div><div class="aj" onclick="bus.location.stretchLocationItemBody(\''.concat(t,"')\">").concat((0,i.Z)("keyboard_arrow_down"),'</div></div><div class="bj"><div class="cj"><div class="dj" highlighted="true" onclick="bus.location.switchLocationBodyTab(\'').concat(t,'\', 0)" code="0">公車</div></div><div class="fj" displayed="true"></div></div>'),{element:e,id:t}}function V(){var t=(0,s.zx)("t"),e=document.createElement("div");return e.id=t,e.classList.add("ii"),{element:e,id:t}}function tt(){var t=(0,s.zx)("p"),e=document.createElement("div");return e.id=t,e.classList.add("si"),e.innerHTML='<div class="ti"></div><div class="ui"></div>',{element:e,id:t}}function et(t,e,r,n){function o(t,e,o){function a(t,e,r){var n=t.getBoundingClientRect(),i=n.top,o=n.left,a=n.bottom,s=n.right,c=window.innerWidth,l=window.innerHeight,d=(0,u.aI)(t,"._i"),h=(0,u.aI)(d,".nb"),f=(0,u.aI)(d,".ob");h.setAttribute("code",e.status.code),h.innerText=e.status.text,r&&a>0&&i<l&&s>0&&o<c?(f.addEventListener("animationend",(function(){f.setAttribute("code",e.status.code),f.innerText=e.status.text,f.classList.remove("sb")}),{once:!0}),f.classList.add("sb")):(f.setAttribute("code",e.status.code),f.innerText=e.status.text)}function c(t,e){(0,u.aI)(t,".zi").innerText=e.route_name,(0,u.aI)(t,".yi").innerText=e.route_direction}function l(t,e){(0,u.aI)(t,".fj").innerHTML=0===e.buses.length?'<div class="oj">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="gj" on-this-route="'.concat(t.onThisRoute,'"><div class="hj"><div class="ij">').concat((0,i.Z)("directions_bus"),'</div><div class="jj">').concat(t.carNumber,'</div></div><div class="kj"><div class="lj">路線：').concat(t.RouteName,'</div><div class="mj">狀態：').concat(t.status.text,'</div><div class="nj">類型：').concat(t.type,"</div></div></div>")})).join("")}function d(t,e){e&&t.setAttribute("stretched","false")}function h(t,e){t.setAttribute("animation",(0,s.xZ)(e))}function f(t,e){t.setAttribute("skeleton-screen",(0,s.xZ)(e))}null===o?(a(t,e,n),c(t,e),l(t,e),d(t,r),h(t,n),f(t,r)):(e.status.code===o.status.code&&(0,s.hw)(o.status.text,e.status.text)||a(t,e,n),(0,s.hw)(o.route_name,e.route_name)&&(0,s.hw)(o.route_direction,e.route_direction)||c(t,e),(0,s.hw)(o.buses,e.buses)||l(t,e),n!==I&&h(t,n),r!==S&&(d(t,r),f(t,r)))}function a(t,e,o){function a(t,e){(0,u.aI)(t,".ti").innerHTML=(0,i.Z)(e.icon)}function c(t,e){(0,u.aI)(t,".ui").innerHTML=e.value}function l(t,e){t.setAttribute("animation",(0,s.xZ)(e))}function d(t,e){t.setAttribute("skeleton-screen",(0,s.xZ)(e))}null===o?(a(t,e),c(t,e),l(t,n),d(t,r)):((0,s.hw)(o.icon,e.icon)||a(t,e),(0,s.hw)(o.value,e.value)||c(t,e),n!==I&&l(t,n),r!==S&&d(t,r))}var l=(0,d.gO)("window"),h=l.width,f=l.height,v=e.groupQuantity,p=e.itemQuantity,g=e.groupedItems,y=e.groups;P=v,O=h;for(var m=0,w=0;w<v;w++){var L=(0,c.q)(y["g_".concat(w)].name,500,"17px",'"Noto Sans TC", sans-serif')+W;A["g_".concat(w)]={width:L,offset:m},m+=L}var _=-1*A["g_".concat(M)].offset+.5*O-.5*A["g_".concat(M)].width;F||$(P,_,A["g_".concat(M)].width-W,M),b.innerHTML="<span>".concat(e.LocationName,"</span>"),b.setAttribute("animation",(0,s.xZ)(n)),b.setAttribute("skeleton-screen",(0,s.xZ)(r)),x.setAttribute("animation",(0,s.xZ)(n)),x.setAttribute("skeleton-screen",(0,s.xZ)(r)),k.setAttribute("skeleton-screen",(0,s.xZ)(r));var j,T,N=(0,u.jg)(t,".oi .pi").length;if(v!==N){var H=N-v;if(H<0)for(var Z=0;Z<Math.abs(H);Z++){var C=(j=void 0,T=void 0,j=(0,s.zx)("g"),(T=document.createElement("div")).id=j,T.classList.add("pi"),T.innerHTML='<div class="qi"><div class="ri"></div></div><div class="vi"></div>',{element:T,id:j});(0,u.aI)(t,".oi").appendChild(C.element);var R=V();(0,u.aI)(t,".ci .hi").appendChild(R.element)}else for(var z=0;z<Math.abs(H);z++){var D=N-1-z;(0,u.jg)(t,".oi .pi")[D].remove(),(0,u.jg)(t,".ci .hi .ii")[D].remove()}}for(var G=0;G<v;G++){var q="g_".concat(G),B=(0,u.jg)((0,u.jg)(t,".oi .pi")[G],".vi .wi").length;if(p[q]!==B)if((Y=B-p[q])<0)for(var Q=0;Q<Math.abs(Y);Q++){var U=K();(0,u.aI)((0,u.jg)(t,".oi .pi")[G],".vi").appendChild(U.element)}else for(var J=0;J<Math.abs(Y);J++){var X=B-1-J;(0,u.jg)((0,u.jg)(t,".oi .pi")[G],".vi .wi")[X].remove()}var Y,et=(0,u.jg)((0,u.jg)(t,".oi .pi")[G],".qi .ri .si").length,rt=y[q].properties.length;if(rt!==et)if((Y=et-rt)<0)for(var nt=0;nt<Math.abs(Y);nt++){var it=tt();(0,u.aI)((0,u.jg)(t,".oi .pi")[G],".qi .ri").appendChild(it.element)}else for(var ot=0;ot<Math.abs(Y);ot++){var at=et-1-ot;(0,u.jg)((0,u.jg)(t,".oi .pi")[G],".qi .ri .si")[at].remove()}}for(var st=0;st<v;st++){var ct="g_".concat(st),ut=(0,u.jg)(t,".ci .hi .ii")[st];ut.innerHTML="<span>".concat(y[ct].name,"</span>"),ut.style.setProperty("--zh","".concat(A[ct].width,"px")),ut.style.setProperty("--ji",st.toString());for(var lt=(0,u.jg)(t,".oi .pi")[st],dt=y[ct].properties.length,ht=0;ht<dt;ht++){var ft=y[ct].properties[ht],vt=(0,u.jg)(lt,".qi .ri .si")[ht];if(E.hasOwnProperty("groups"))if(E.groups.hasOwnProperty(ct))if(E.groups[ct].properties[ht])a(vt,ft,E.groups[ct].properties[ht]);else a(vt,ft,null);else a(vt,ft,null);else a(vt,ft,null)}for(var pt=0;pt<p[ct];pt++){var gt=(0,u.jg)(lt,".vi .wi")[pt],yt=g[ct][pt];if(E.hasOwnProperty("groupedItems"))if(E.groupedItems.hasOwnProperty(ct))if(E.groupedItems[ct][pt])o(gt,yt,E.groupedItems[ct][pt]);else o(gt,yt,null);else o(gt,yt,null);else o(gt,yt,null)}}E=e,S=r}function rt(){return nt.apply(this,arguments)}function nt(){var t;return t=p().mark((function t(){var e,r,i,o,c;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(new Date).getTime(),r=(0,a.Js)("playing_animation"),i=(0,a.Js)("refresh_interval"),R=i.dynamic,H=i.baseInterval,q=!0,B=(0,s.zx)("r"),j.setAttribute("refreshing","true"),t.next=10,(0,n.R)(U,B);case 10:if(o=t.sent,et(y,o,!1,r),D=e,!R){t.next=20;break}return t.next=16,(0,l.wz)();case 16:c=t.sent,G=Math.max(e+Z,o.dataUpdateTime+H/c),t.next=21;break;case 20:G=e+H;case 21:return C=Math.max(Z,G-e),q=!1,j.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the location."});case 25:case"end":return t.stop()}}),t)})),nt=function(){var e=this,r=arguments;return new Promise((function(n,i){var o=t.apply(e,r);function a(t){g(o,n,i,a,s,"next",t)}function s(t){g(o,n,i,a,s,"throw",t)}a(void 0)}))},nt.apply(this,arguments)}function it(){rt().then((function(t){z?setTimeout((function(){it()}),Math.max(Z,G-(new Date).getTime())):Q=!1})).catch((function(t){console.error(t),z?((0,h.a)("（地點）發生網路錯誤，將在".concat(N/1e3,"秒後重試。"),"error"),setTimeout((function(){it()}),N)):Q=!1}))}function ot(t){(0,d.WR)("Location"),(0,f.XK)("location",t),U=t,M=0,y.setAttribute("displayed","true"),(0,u.aI)(y,".oi").scrollLeft=0,function(t){for(var e=(0,a.Js)("playing_animation"),r=(0,d.gO)("window"),n=(r.width,r.height),i={g_0:Math.floor(n/50)+5,g_1:Math.floor(n/50)+5},o={},s=0;s<2;s++){var c="g_".concat(s);o[c]=[];for(var u=0;u<i[c];u++)o[c].push({route_name:"",route_direction:"",routeId:0,status:{code:-1,text:""},buses:[]})}et(t,{groupedItems:o,groupQuantity:2,groups:{g_0:{name:"載入中",properties:[{key:"0",icon:"",value:""},{key:"1",icon:"",value:""}]},g_1:{name:"載入中",properties:[{key:"0",icon:"",value:""},{key:"1",icon:"",value:""}]}},itemQuantity:i,LocationName:"載入中",dataUpdateTime:null},!0,e)}(y),z||(z=!0,Q?rt():(Q=!0,it()),Y()),(0,d.Z_)()}function at(){y.setAttribute("displayed","false"),z=!1,(0,d.l$)()}function st(t){var e=(0,u.aI)(w,".pi .vi .wi#".concat(t));"true"===e.getAttribute("stretched")?e.setAttribute("stretched","false"):e.setAttribute("stretched","true")}}}]);
//# sourceMappingURL=0b5e53d0eabc2da2e1a2.js.map
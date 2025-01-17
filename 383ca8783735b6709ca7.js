/*! For license information please see 383ca8783735b6709ca7.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[960],{4690:(t,e,r)=>{r.d(e,{Ch:()=>lt,S5:()=>J,SR:()=>st,U7:()=>ut,aB:()=>K,py:()=>dt,q0:()=>ft});var n=r(7123),o=r(4537),i=r(6788),a=r(3459),c=r(8024),s=r(7968),u=r(3648),l=r(5224),f=r(9566),d=r(904),h=r(9119),v=r(5314);function p(t){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},p(t)}function y(){y=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new O(n||[]);return o(a,"_invoke",{value:S(t,r,c)}),a}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var d="suspendedStart",h="suspendedYield",v="executing",g="completed",m={};function b(){}function w(){}function x(){}var L={};u(L,a,(function(){return this}));var A=Object.getPrototypeOf,I=A&&A(A(R([])));I&&I!==r&&n.call(I,a)&&(L=I);var E=x.prototype=b.prototype=Object.create(L);function j(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function k(t,e){function r(o,i,a,c){var s=f(t[o],t,i);if("throw"!==s.type){var u=s.arg,l=u.value;return l&&"object"==p(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(l).then((function(t){u.value=t,a(u)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function S(e,r,n){var o=d;return function(i,a){if(o===v)throw Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var s=_(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===d)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var u=f(e,r,n);if("normal"===u.type){if(o=n.done?g:h,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=g,n.method="throw",n.arg=u.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=f(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,m;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function R(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(p(e)+" is not iterable")}return w.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=u(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},j(k.prototype),u(k.prototype,c,(function(){return this})),e.AsyncIterator=k,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new k(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(E),u(E,s,"Generator"),u(E,a,(function(){return this})),u(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=R,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:R(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function g(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return m(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function m(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function b(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}var w=(0,u.bv)(".cc"),x=(0,u.aI)(w,"._k"),L=(0,u.aI)(x,".cl"),A=(0,u.aI)(x,".bl"),I=(0,u.aI)(x,".jl .kl"),E=(0,u.aI)(x,".dl .el"),j=(0,u.aI)(x,".hl .il"),k=(0,u.aI)(w,".dc"),S={},_=!1,T=0,P=0,O=0,R={},M=0,N=!1,F=1e4,G=15e3,z=5e3,D=15e3,B=!0,C=!1,Z=0,H=0,q=!1,U="",Q=!1,Y=0,W=[],$=20;function J(){k.addEventListener("touchstart",(function(){T=Math.round(k.scrollLeft/M)})),k.addEventListener("scroll",(function(t){N=!0;var e=t.target.scrollLeft/M;P=e>T?T+1:T-1;var r=R["g_".concat(T)]||{width:0,offset:0},n=R["g_".concat(P)]||{width:0,offset:0},o=r.width+(n.width-r.width)*Math.abs(e-T),i=-1*(r.offset+(n.offset-r.offset)*Math.abs(e-T))+.5*M-.5*o;V(O,i,o-$,e),e===P&&(T=Math.round(k.scrollLeft/M),N=!1)}))}function X(){return{width:window.innerWidth,height:window.innerHeight}}function K(){var t=X(),e=t.width,r=t.height;w.style.setProperty("--nd","".concat(e,"px")),w.style.setProperty("--uk","".concat(r,"px"))}function V(t,e,r,n){w.style.setProperty("--vk",t.toString()),j.style.setProperty("--yk",(r/30).toFixed(5)),E.style.setProperty("--fl","".concat(e.toFixed(5),"px")),E.style.setProperty("--wk",n.toFixed(5))}function tt(){var t=(new Date).getTime(),e=0;e=q?-1+(0,i._M)(U):-1*Math.min(1,Math.max(0,Math.abs(t-Z)/D)),I.style.setProperty("--pa",e.toString()),window.requestAnimationFrame((function(){C&&tt()}))}function et(){var t=(0,c.zx)("i"),e=document.createElement("div");return e.classList.add("ml"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="pl"></div><div class="ql"><div class="nb" code="0"></div><div class="ob" code="0"></div></div>',{element:e,id:t}}function rt(t){var e=(0,c.zx)("i"),r=document.createElement("div");return r.classList.add("hc"),r.id=e,r.setAttribute("stretched","false"),r.innerHTML='<div class="kc"><div class="lc"></div><div class="nc"><div class="sc"><div class="nb" code="0"></div><div class="ob" code="0"></div></div><div class="rc" onclick="bus.route.stretchRouteItemBody(\''.concat(e,"', '").concat(t,"')\">").concat((0,o.Z)("keyboard_arrow_down"),'</div><div class="qc"></div></div></div><div class="xc"><div class="yc"><div class="zc" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 0)" code="0"><div class="gd">').concat((0,o.Z)("directions_bus"),'</div>公車</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 1)" code="1"><div class="gd">').concat((0,o.Z)("departure_board"),'</div>抵達時間</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 2)" code="2"><div class="gd">').concat((0,o.Z)("route"),'</div>路線</div><div class="zc" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop\', [\'').concat(e,'\', null, null])"><div class="gd">').concat((0,o.Z)("folder"),'</div>儲存至資料夾</div></div><div class="hd" displayed="true"></div><div class="id" displayed="false"></div><div class="jd" displayed="false"></div></div>'),{element:r,id:e}}function nt(){var t=(0,c.zx)("g"),e=document.createElement("div");e.classList.add("ec"),e.id=t;var r=document.createElement("div");r.classList.add("fc");var n=document.createElement("div");n.classList.add("ll");var o=document.createElement("div");return o.classList.add("gc"),r.appendChild(n),r.appendChild(o),e.appendChild(r),{element:e,id:t}}function ot(t,e,r){function n(t,n,o,i){function a(t,e,r){var n=(0,u.aI)(e,".ql"),o=(0,u.aI)(n,".ob"),i=(0,u.aI)(n,".nb"),a=(0,u.aI)(t,".sc"),c=(0,u.aI)(a,".ob"),s=(0,u.aI)(a,".nb");i.setAttribute("code",r.status.code.toString()),s.setAttribute("code",r.status.code.toString()),s.innerText=r.status.text,o.addEventListener("animationend",(function(){o.setAttribute("code",r.status.code.toString()),o.classList.remove("sb")}),{once:!0}),c.addEventListener("animationend",(function(){c.setAttribute("code",r.status.code.toString()),c.innerText=r.status.text,c.classList.remove("sb")}),{once:!0}),o.classList.add("sb"),c.classList.add("sb")}function s(t,e,r){t.setAttribute("segment-buffer",(0,c.xZ)(r.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,c.xZ)(r.segmentBuffer.isSegmentBuffer))}function l(t,e){(0,u.aI)(t,".lc").innerText=e.name}function d(t,e){(0,u.aI)(t,".hd").innerHTML=0===e.buses.length?'<div class="xd">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="kd">'.concat(t,"</div>")})).join("")}function h(t,e){(0,u.aI)(t,".id").innerHTML=0===e.overlappingRoutes.length?'<div class="yd">目前沒有重疊路線</div>':e.overlappingRoutes.map((function(t){return'<div class="ld">'.concat(t,"</div>")})).join("")}function v(t,e){(0,u.aI)(t,".jd").innerHTML=0===e.busArrivalTimes.length?'<div class="zd">目前沒有預估到達時間</div>':e.busArrivalTimes.map((function(t){return'<div class="md">'.concat(t,"</div>")})).join("")}function p(t,e,r){t.setAttribute("nearest",(0,c.xZ)(r.nearest)),e.setAttribute("nearest",(0,c.xZ)(r.nearest))}function y(t,e,r){var n=(null==r?void 0:r.progress)||0,o=(null==e?void 0:e.progress)||0,i=(0,u.aI)(t,".pl");0!==n&&0===o&&Math.abs(o-n)>0?(i.style.setProperty("--nl","".concat(100,"%")),i.style.setProperty("--ol","".concat(100,"%")),i.addEventListener("transitionend",(function(){i.style.setProperty("--nl","".concat(0,"%")),i.style.setProperty("--ol","".concat(0,"%"))}),{once:!0})):(i.style.setProperty("--nl","".concat(0,"%")),i.style.setProperty("--ol","".concat(100*o,"%")))}function g(t,e,r){r&&(t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function m(t,e,r){t.setAttribute("skeleton-screen",(0,c.xZ)(r)),e.setAttribute("skeleton-screen",(0,c.xZ)(r))}function b(t,r){var n=(0,u.aI)(t,'.xc .yc .zc[type="save-to-folder"]');n.setAttribute("onclick","bus.folder.openSaveToFolder('stop', ['".concat(t.id,"', ").concat(r.id,", ").concat(e.RouteID,"])")),(0,f.Gs)("stop",r.id).then((function(t){n.setAttribute("highlighted",(0,c.xZ)(t))}))}null===i?(a(t,n,o),l(t,o),d(t,o),h(t,o),v(t,o),s(t,n,o),p(t,n,o),y(n,o,i),g(t,n,r),m(t,n,r),b(t,o)):(o.status.code===i.status.code&&(0,c.hw)(i.status.text,o.status.text)||a(t,n,o),(0,c.hw)(i.buses,o.buses)||d(t,o),(0,c.hw)(i.busArrivalTimes,o.busArrivalTimes)||v(t,o),(0,c.hw)(i.segmentBuffer,o.segmentBuffer)||s(t,n,o),i.nearest!==o.nearest&&p(t,n,o),i.progress!==o.progress&&y(n,o,i),i.id!==o.id&&(l(t,o),h(t,o),b(t,o)),r!==_&&(g(t,n,r),m(t,n,r)))}var o=X(),i=o.width,a=o.height,l=e.groupQuantity,d=e.itemQuantity,h=e.groupedItems;O=l,M=i;for(var v=0,p=0;p<l;p++){var y=(0,s.q)([e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"往".concat(t)}))[p],500,"17px",'"Noto Sans TC", sans-serif')+20;R["g_".concat(p)]={width:y,offset:v},v+=y}var g=-1*R["g_".concat(T)].offset+.5*M-.5*R["g_".concat(T)].width;N||V(O,g,R["g_".concat(T)].width-$,T),L.innerHTML="<span>".concat(e.RouteName,"</span>"),t.setAttribute("skeleton-screen",(0,c.xZ)(r)),A.setAttribute("onclick","bus.route.openRouteDetails(".concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),"])"));var m,b,w=(0,u.jg)(t,".dc .ec").length;if(l!==w){var x=w-l;if(x<0)for(var I=0;I<Math.abs(x);I++){var E=nt();t.appendChild(E.element);var j=(m=void 0,b=void 0,m=(0,c.zx)("t"),(b=document.createElement("div")).classList.add("gl"),b.id=m,{element:b,id:m});t.appendChild(j.element)}else for(var k=(0,u.jg)(t,".dc .ec"),P=(0,u.jg)(t,"._k .dl .el .gl"),F=0;F<Math.abs(x);F++){var G=w-1-F;k[G].remove(),P[G].remove()}}for(var z=0;z<l;z++){var D="g_".concat(z),B=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[z],".gc"),".hc").length;if(d[D]!==B){var C=B-d[D];if(C<0)for(var Z=(0,u.aI)((0,u.jg)(t,".dc .ec")[z],".gc"),H=(0,u.aI)((0,u.jg)(t,".dc .ec")[z],".ll"),q=0;q<Math.abs(C);q++){var U=et(),Q=rt(U.id);Z.appendChild(Q.element),H.appendChild(U.element)}else for(var Y=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[z],".gc"),".hc"),W=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[z],".ll"),".ml"),J=0;J<Math.abs(C);J++){var K=B-1-J;Y[K].remove(),W[K].remove()}}}for(var tt=0;tt<l;tt++){var ot="g_".concat(tt),it=(0,u.jg)(t,".dc .ec")[tt],at=it.cloneNode(!0),ct=(0,u.jg)(at,"._k .dl .el .gl")[tt];ct.innerHTML=[e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"<span>往".concat(t,"</span>")}))[tt],ct.style.setProperty("--zk","".concat(R[ot].width,"px")),ct.style.setProperty("--xk","".concat(tt));for(var st=(0,u.jg)(at,".gc .hc"),ut=(0,u.jg)(at,".ll .ml"),lt=0;lt<d[ot];lt++){var ft=st[lt],dt=ut[lt],ht=h[ot][lt];if(S.hasOwnProperty("groupedItems"))if(S.groupedItems.hasOwnProperty(ot))if(S.groupedItems[ot][lt])n(ft,dt,ht,S.groupedItems[ot][lt]);else n(ft,dt,ht,null);else n(ft,dt,ht,null);else n(ft,dt,ht,null)}t.replaceChild(at,it)}S=e,_=r}function it(){return at.apply(this,arguments)}function at(){var t;return t=y().mark((function t(){var e,r,o;return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,a.Js)("refresh_interval"),B=e.dynamic,G=e.baseInterval,q=!0,U=(0,c.zx)("r"),I.setAttribute("refreshing","true"),t.next=8,(0,n.R)(Y,W,U);case 8:if(r=t.sent,ot(w,r,!1),Z=(new Date).getTime(),!B){t.next=18;break}return t.next=14,(0,l.wz)();case 14:o=t.sent,H=Math.max((new Date).getTime()+z,r.dataUpdateTime+G/o),t.next=19;break;case 18:H=(new Date).getTime()+G;case 19:return D=Math.max(z,H-(new Date).getTime()),q=!1,I.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the route."});case 23:case"end":return t.stop()}}),t)})),at=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){b(i,n,o,a,c,"next",t)}function c(t){b(i,n,o,a,c,"throw",t)}a(void 0)}))},at.apply(this,arguments)}function ct(){it().then((function(t){C?setTimeout((function(){ct()}),Math.max(z,H-(new Date).getTime())):Q=!1})).catch((function(t){console.error(t),C?((0,h.a)("（路線）發生網路錯誤，將在".concat(F/1e3,"秒後重試。"),"error"),setTimeout((function(){ct()}),F)):Q=!1}))}function st(t,e){(0,d.WR)("Route"),(0,v.XK)("route",t),Y=t,W=e,T=0,w.setAttribute("displayed","true"),(0,u.aI)(w,".dc").scrollLeft=0,function(t){for(var e=X(),r=(e.width,e.height),n=Math.floor(r/50)+5,o={},i=0;i<2;i++){var a="g_".concat(i);o[a]=[];for(var c=0;c<n;c++)o[a].push({name:"",goBack:"0",status:{code:0,text:""},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:c,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}ot(t,{groupedItems:o,groupQuantity:2,itemQuantity:{g_0:n,g_1:n},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:null},!0)}(w),C||(C=!0,Q?it():(Q=!0,ct()),tt()),(0,d.Z_)()}function ut(){w.setAttribute("displayed","false"),C=!1,(0,d.l$)()}function lt(t,e){C=!1,st(t,e)}function ft(t,e){var r=(0,u.bv)(".cc .dc .ec .fc .gc .hc#".concat(t)),n=(0,u.bv)(".cc .dc .ec .fc .ll .ml#".concat(e));"true"===r.getAttribute("stretched")?(r.setAttribute("stretched","false"),n.setAttribute("stretched","false")):(r.setAttribute("stretched","true"),n.setAttribute("stretched","true"))}function dt(t,e){var r,n=(0,u.aI)(k,".hc#".concat(t)),o=(0,u.aI)(n,".yc"),i=g((0,u.jg)(o,'.zc[highlighted="true"][type="tab"]'));try{for(i.s();!(r=i.n()).done;){r.value.setAttribute("highlighted","false")}}catch(t){i.e(t)}finally{i.f()}switch((0,u.aI)(o,'.zc[code="'.concat(e,'"]')).setAttribute("highlighted","true"),e){case 0:(0,u.aI)(n,".hd").setAttribute("displayed","true"),(0,u.aI)(n,".id").setAttribute("displayed","flase"),(0,u.aI)(n,".jd").setAttribute("displayed","false");break;case 1:(0,u.aI)(n,".hd").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","false"),(0,u.aI)(n,".jd").setAttribute("displayed","true");break;case 2:(0,u.aI)(n,".hd").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","true"),(0,u.aI)(n,".jd").setAttribute("displayed","false")}}},3041:(t,e,r)=>{r.d(e,{BI:()=>y,Dh:()=>b,JL:()=>m,nS:()=>g});var n=r(3648),o=r(904),i=r(8024),a=r(9566),c=r(4537),s=r(9119);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function l(){l=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function d(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new O(n||[]);return o(a,"_invoke",{value:S(t,r,c)}),a}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=d;var v="suspendedStart",p="suspendedYield",y="executing",g="completed",m={};function b(){}function w(){}function x(){}var L={};f(L,a,(function(){return this}));var A=Object.getPrototypeOf,I=A&&A(A(R([])));I&&I!==r&&n.call(I,a)&&(L=I);var E=x.prototype=b.prototype=Object.create(L);function j(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function k(t,e){function r(o,i,a,c){var s=h(t[o],t,i);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==u(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(f).then((function(t){l.value=t,a(l)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function S(e,r,n){var o=v;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var s=_(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var u=h(e,r,n);if("normal"===u.type){if(o=n.done?g:p,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=g,n.method="throw",n.arg=u.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=h(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,m;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function R(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(u(e)+" is not iterable")}return w.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},j(k.prototype),f(k.prototype,c,(function(){return this})),e.AsyncIterator=k,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new k(d(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(E),f(E,s,"Generator"),f(E,a,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=R,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:R(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function f(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return d(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?d(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function h(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}function v(t,e,r){var n=(0,i.zx)("i"),o=document.createElement("div");switch(o.classList.add("yn"),o.id=n,e){case"stop":o.setAttribute("onclick","bus.folder.saveStopItemOnRoute('".concat(r[0],"', '").concat(t.folder.id,"', ").concat(r[1],", ").concat(r[2],")"));break;case"route":o.setAttribute("onclick","bus.folder.saveRouteOnDetailsPage('".concat(t.folder.id,"', ").concat(r[0],")"))}return o.innerHTML='<div class="zn">'.concat((0,c.Z)(t.folder.icon),'</div><div class="_n">').concat(t.folder.name,"</div>"),{element:o,id:n}}function p(){var t;return t=l().mark((function t(e,r){var o,i,c,s,u,d;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=(0,n.bv)(".sn"),(0,n.aI)(o,".wn .xn").innerHTML="",t.next=4,(0,a.Xi)();case 4:i=t.sent,c=f(i);try{for(c.s();!(s=c.n()).done;)u=s.value,d=v(u,e,r),(0,n.aI)(o,".wn .xn").appendChild(d.element)}catch(t){c.e(t)}finally{c.f()}case 7:case"end":return t.stop()}}),t)})),p=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){h(i,n,o,a,c,"next",t)}function c(t){h(i,n,o,a,c,"throw",t)}a(void 0)}))},p.apply(this,arguments)}function y(t,e){(0,o.WR)("SaveToFolder"),(0,n.bv)(".sn").setAttribute("displayed","true"),function(t,e){p.apply(this,arguments)}(t,e)}function g(){(0,o.kr)("SaveToFolder"),(0,n.bv)(".sn").setAttribute("displayed","false")}function m(t,e,r,o){var i=(0,n.bv)(".cc .dc .ec .fc .gc .hc#".concat(t)),c=(0,n.aI)(i,'.xc .yc .zc[type="save-to-folder"]');(0,a.aq)(e,r,o).then((function(t){t?(0,a.Gs)("stop",r).then((function(t){t&&(c.setAttribute("highlighted",t),(0,s.a)("已儲存至資料夾","folder"),g())})):(0,s.a)("此資料夾不支援站牌類型項目","warning")}))}function b(t,e){var r=(0,n.bv)('.rl .wl .xl .yl[group="actions"] .bm .cm[action="save-to-folder"]');(0,a.Fq)(t,e).then((function(t){t?(0,a.Gs)("route",e).then((function(t){t&&(r.setAttribute("highlighted","true"),(0,s.a)("已儲存至資料夾","folder"),g())})):(0,s.a)("此資料夾不支援路線類型項目","warning")}))}}}]);
//# sourceMappingURL=383ca8783735b6709ca7.js.map
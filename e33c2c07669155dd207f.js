/*! For license information please see e33c2c07669155dd207f.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[5541],{4690:(t,e,n)=>{n.d(e,{Ch:()=>ht,S5:()=>tt,SR:()=>lt,U7:()=>ft,aB:()=>et,py:()=>pt,q0:()=>vt});var r=n(7123),i=n(4537),o=n(6788),a=n(3459),c=n(8024),s=n(7968),u=n(3648),d=n(5767),l=n(9566),f=n(904),h=n(9119),v=n(5579),p=n(5314);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function g(){g=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",s=o.toStringTag||"@@toStringTag";function u(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,n){return t[e]=n}}function d(t,e,n,r){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),c=new R(r||[]);return i(a,"_invoke",{value:S(t,n,c)}),a}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=d;var f="suspendedStart",h="suspendedYield",v="executing",p="completed",m={};function b(){}function w(){}function j(){}var x={};u(x,a,(function(){return this}));var A=Object.getPrototypeOf,I=A&&A(A(M([])));I&&I!==n&&r.call(I,a)&&(x=I);var L=j.prototype=b.prototype=Object.create(x);function E(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function k(t,e){function n(i,o,a,c){var s=l(t[i],t,o);if("throw"!==s.type){var u=s.arg,d=u.value;return d&&"object"==y(d)&&r.call(d,"__await")?e.resolve(d.__await).then((function(t){n("next",t,a,c)}),(function(t){n("throw",t,a,c)})):e.resolve(d).then((function(t){u.value=t,a(u)}),(function(t){return n("throw",t,a,c)}))}c(s.arg)}var o;i(this,"_invoke",{value:function(t,r){function i(){return new e((function(e,i){n(t,r,e,i)}))}return o=o?o.then(i,i):i()}})}function S(e,n,r){var i=f;return function(o,a){if(i===v)throw Error("Generator is already running");if(i===p){if("throw"===o)throw a;return{value:t,done:!0}}for(r.method=o,r.arg=a;;){var c=r.delegate;if(c){var s=T(c,r);if(s){if(s===m)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(i===f)throw i=p,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);i=v;var u=l(e,n,r);if("normal"===u.type){if(i=r.done?p:h,u.arg===m)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(i=p,r.method="throw",r.arg=u.arg)}}}function T(e,n){var r=n.method,i=e.iterator[r];if(i===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,T(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var o=l(i,e.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,m;var a=o.arg;return a?a.done?(n[e.resultName]=a.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,m):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,m)}function _(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(_,this),this.reset(!0)}function M(e){if(e||""===e){var n=e[a];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var i=-1,o=function n(){for(;++i<e.length;)if(r.call(e,i))return n.value=e[i],n.done=!1,n;return n.value=t,n.done=!0,n};return o.next=o}}throw new TypeError(y(e)+" is not iterable")}return w.prototype=j,i(L,"constructor",{value:j,configurable:!0}),i(j,"constructor",{value:w,configurable:!0}),w.displayName=u(j,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,j):(t.__proto__=j,u(t,s,"GeneratorFunction")),t.prototype=Object.create(L),t},e.awrap=function(t){return{__await:t}},E(k.prototype),u(k.prototype,c,(function(){return this})),e.AsyncIterator=k,e.async=function(t,n,r,i,o){void 0===o&&(o=Promise);var a=new k(d(t,n,r,i),o);return e.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(L),u(L,s,"Generator"),u(L,a,(function(){return this})),u(L,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=M,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function i(r,i){return c.type="throw",c.arg=e,n.next=r,i&&(n.method="next",n.arg=t),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return i("end");if(a.tryLoc<=this.prev){var s=r.call(a,"catchLoc"),u=r.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return i(a.catchLoc,!0);if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return i(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return i(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var i=r.arg;P(n)}return i}}throw Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:M(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),m}},e}function m(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return b(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?b(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,c=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return a=t.done,t},e:function(t){c=!0,o=t},f:function(){try{a||null==n.return||n.return()}finally{if(c)throw o}}}}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function w(t,e,n,r,i,o,a){try{var c=t[o](a),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,i)}var j=(0,u.bv)(".cc"),x=(0,u.aI)(j,".fj"),A=(0,u.aI)(x,".ij"),I=(0,u.aI)(x,".hj"),L=(0,u.aI)(x,".pj .qj"),E=(0,u.aI)(x,".jj"),k=(0,u.aI)(E,".kj"),S=(0,u.aI)(x,".nj"),T=(0,u.aI)(S,".oj"),_=(0,u.aI)(j,".dc"),P={},R=!0,M=!1,Z=0,O=0,D=0,z={},B=0,N=!1,C=1e4,F=15e3,G=5e3,H=15e3,q=!0,Q=!1,U=0,J=0,W=!1,Y="",$=!1,K=0,X=[],V=20;function tt(){_.addEventListener("touchstart",(function(){Z=Math.round(_.scrollLeft/B)})),_.addEventListener("scroll",(function(t){N=!0;var e=t.target.scrollLeft/B;O=e>Z?Z+1:Z-1;var n=z["g_".concat(Z)]||{width:0,offset:0},r=z["g_".concat(O)]||{width:0,offset:0},i=n.width+(r.width-n.width)*Math.abs(e-Z),o=-1*(n.offset+(r.offset-n.offset)*Math.abs(e-Z))+.5*B-.5*i;nt(D,o,i-V,e),e===O&&(Z=Math.round(_.scrollLeft/B),N=!1)}))}function et(){var t=(0,f.gO)("window"),e=t.width,n=t.height;j.style.setProperty("--nd","".concat(e,"px")),j.style.setProperty("--_i","".concat(n,"px"))}function nt(t,e,n,r){j.style.setProperty("--aj",t.toString()),T.style.setProperty("--dj",(n/30).toFixed(5)),k.style.setProperty("--lj","".concat(e.toFixed(5),"px")),k.style.setProperty("--bj",r.toFixed(5))}function rt(){var t=(new Date).getTime(),e=0;e=W?-1+(0,o._M)(Y):-1*Math.min(1,Math.max(0,Math.abs(t-U)/H)),L.style.setProperty("--pa",e.toString()),window.requestAnimationFrame((function(){Q&&rt()}))}function it(){var t=(0,c.zx)("i"),e=document.createElement("div");return e.classList.add("sj"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="vj"></div><div class="wj"><div class="nb" code="0"></div><div class="ob" code="0"></div></div>',{element:e,id:t}}function ot(t){var e=(0,c.zx)("i"),n=document.createElement("div");return n.classList.add("hc"),n.id=e,n.setAttribute("stretched","false"),n.innerHTML='<div class="kc"><div class="lc"></div><div class="nc"><div class="sc"><div class="nb" code="0"></div><div class="ob" code="0"></div></div><div class="rc" onclick="bus.route.stretchRouteItemBody(\''.concat(e,"', '").concat(t,"')\">").concat((0,i.Z)("keyboard_arrow_down"),'</div><div class="qc"></div></div></div><div class="xc"><div class="yc"><div class="zc" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 0)" code="0"><div class="gd">').concat((0,i.Z)("directions_bus"),'</div>公車</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 1)" code="1"><div class="gd">').concat((0,i.Z)("departure_board"),'</div>抵達時間</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 2)" code="2"><div class="gd">').concat((0,i.Z)("route"),'</div>路線</div><div class="zc" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop\', [\'').concat(e,'\', null, null])"><div class="gd">').concat((0,i.Z)("folder"),'</div>儲存至資料夾</div><div class="zc" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification(\'stop\', [\'').concat(e,'\', null, null, null])"><div class="gd">').concat((0,i.Z)("notifications"),'</div>設定到站通知</div></div><div class="hd" displayed="true"></div><div class="id" displayed="false"></div><div class="jd" displayed="false"></div></div>'),{element:n,id:e}}function at(){var t=(0,c.zx)("g"),e=document.createElement("div");e.classList.add("ec"),e.id=t;var n=document.createElement("div");n.classList.add("fc");var r=document.createElement("div");r.classList.add("rj");var i=document.createElement("div");return i.classList.add("gc"),n.appendChild(r),n.appendChild(i),e.appendChild(n),{element:e,id:t}}function ct(t,e,n,r){function o(t,o,a,s){function d(t,e,n,r){var i=t.getBoundingClientRect(),o=i.top,a=i.left,c=i.bottom,s=i.right,d=window.innerWidth,l=window.innerHeight,f=(0,u.aI)(e,".wj"),h=(0,u.aI)(f,".ob"),v=(0,u.aI)(f,".nb"),p=(0,u.aI)(t,".sc"),y=(0,u.aI)(p,".ob"),g=(0,u.aI)(p,".nb");v.setAttribute("code",n.status.code.toString()),g.setAttribute("code",n.status.code.toString()),g.innerText=n.status.text,r&&c>0&&o<l&&s>0&&a<d?(h.addEventListener("animationend",(function(){h.setAttribute("code",n.status.code.toString()),h.classList.remove("sb")}),{once:!0}),y.addEventListener("animationend",(function(){y.setAttribute("code",n.status.code.toString()),y.innerText=n.status.text,y.classList.remove("sb")}),{once:!0}),h.classList.add("sb"),y.classList.add("sb")):(h.setAttribute("code",n.status.code.toString()),y.setAttribute("code",n.status.code.toString()),y.innerText=n.status.text)}function f(t,e,n){t.setAttribute("segment-buffer",(0,c.xZ)(n.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,c.xZ)(n.segmentBuffer.isSegmentBuffer))}function h(t,e){(0,u.aI)(t,".lc").innerText=e.name}function p(t,e){(0,u.aI)(t,".hd").innerHTML=0===e.buses.length?'<div class="xd">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="kd" on-this-route="'.concat(t.onThisRoute,'"><div class="_d"><div class="ce">').concat((0,i.Z)("directions_bus"),'</div><div class="fe">').concat(t.carNumber,'</div></div><div class="ie"><div class="ke">路線：').concat(t.RouteName,'</div><div class="le">狀態：').concat(t.status.text,'</div><div class="me">類型：').concat(t.type,"</div></div></div>")})).join("")}function y(t,e){(0,u.aI)(t,".id").innerHTML=0===e.overlappingRoutes.length?'<div class="yd">目前沒有路線可顯示</div>':e.overlappingRoutes.map((function(t){return'<div class="ld"><div class="ae"><div class="de">'.concat((0,i.Z)("route"),'</div><div class="ge">').concat(t.name,'</div></div><div class="qe">').concat(t.RouteEndPoints.html,'</div><div class="se"><div class="te" onclick="bus.route.switchRoute(').concat(t.RouteID,", [").concat(t.PathAttributeId.join(","),'])">查看路線</div><div class="te" onclick="bus.folder.openSaveToFolder(\'route\', [').concat(t.RouteID,'])">收藏路線</div></div></div>')})).join("")}function g(t,e){(0,u.aI)(t,".jd").innerHTML=0===e.busArrivalTimes.length?'<div class="zd">目前沒有抵達時間可顯示</div>':e.busArrivalTimes.map((function(t){return'<div class="md"><div class="be"><div class="ee">'.concat((0,i.Z)("schedule"),'</div><div class="he">').concat(t.time,'</div></div><div class="je"><div class="ne">個人化行程：').concat(t.personalSchedule.name,'</div><div class="oe">時段：').concat((0,v.pn)(t.personalSchedule.period.start)," - ").concat((0,v.pn)(t.personalSchedule.period.end),'</div><div class="pe">重複：').concat(t.personalSchedule.days.map((function(t){return(0,v.kd)(t).name})).join("、"),"</div></div></div>")})).join("")}function m(t,e,n){t.setAttribute("nearest",(0,c.xZ)(n.nearest)),e.setAttribute("nearest",(0,c.xZ)(n.nearest))}function b(t,e,n,r){var i=(null==n?void 0:n.progress)||0,o=(null==e?void 0:e.progress)||0,a=(0,u.aI)(t,".vj");r&&0!==i&&0===o&&Math.abs(o-i)>0?(a.style.setProperty("--tj","".concat(100,"%")),a.style.setProperty("--uj","".concat(100,"%")),a.addEventListener("transitionend",(function(){a.style.setProperty("--tj","".concat(0,"%")),a.style.setProperty("--uj","".concat(0,"%"))}),{once:!0})):(a.style.setProperty("--tj","".concat(0,"%")),a.style.setProperty("--uj","".concat(100*o,"%")))}function w(t,e,n){n&&(t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function j(t,e,n){t.setAttribute("animation",(0,c.xZ)(n)),e.setAttribute("animation",(0,c.xZ)(n))}function x(t,e,n){t.setAttribute("skeleton-screen",(0,c.xZ)(n)),e.setAttribute("skeleton-screen",(0,c.xZ)(n))}function A(t,n){var r=(0,u.aI)(t,'.xc .yc .zc[type="save-to-folder"]');r.setAttribute("onclick","bus.folder.openSaveToFolder('stop', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,"])")),(0,l.Gs)("stop",n.id).then((function(t){r.setAttribute("highlighted",(0,c.xZ)(t))}))}function I(t,n){(0,u.aI)(t,'.xc .yc .zc[type="schedule-notification"]').setAttribute("onclick","bus.notification.openScheduleNotification('stop', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,", ").concat(n.status.time,"])"))}null===s?(d(t,o,a,r),h(t,a),p(t,a),y(t,a),g(t,a),f(t,o,a),m(t,o,a),b(o,a,s,r),w(t,o,n),j(t,o,r),x(t,o,n),A(t,a),I(t,a)):(a.status.time!==s.status.time&&(d(t,o,a,r),I(t,a)),(0,c.hw)(s.buses,a.buses)||p(t,a),(0,c.hw)(s.busArrivalTimes,a.busArrivalTimes)||g(t,a),(0,c.hw)(s.segmentBuffer,a.segmentBuffer)||f(t,o,a),s.nearest!==a.nearest&&m(t,o,a),s.progress!==a.progress&&b(o,a,s,r),s.id!==a.id&&(h(t,a),y(t,a),A(t,a),I(t,a)),r!==R&&j(t,o,r),n!==M&&(w(t,o,n),x(t,o,n)))}var a=(0,f.gO)("window"),d=a.width,h=a.height,p=e.groupQuantity,y=e.itemQuantity,g=e.groupedItems;D=p,B=d;for(var m=0,b=0;b<p;b++){var w=(0,s.q)([e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"往".concat(t)}))[b],500,"17px",'"Noto Sans TC", sans-serif')+V;z["g_".concat(b)]={width:w,offset:m},m+=w}var j=-1*z["g_".concat(Z)].offset+.5*B-.5*z["g_".concat(Z)].width;N||nt(D,j,z["g_".concat(Z)].width-V,Z),A.innerHTML="<span>".concat(e.RouteName,"</span>"),A.setAttribute("animation",(0,c.xZ)(r)),A.setAttribute("skeleton-screen",(0,c.xZ)(n)),E.setAttribute("animation",(0,c.xZ)(r)),E.setAttribute("skeleton-screen",(0,c.xZ)(n)),S.setAttribute("animation",(0,c.xZ)(r)),S.setAttribute("skeleton-screen",(0,c.xZ)(n)),I.setAttribute("onclick","bus.route.openRouteDetails(".concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),"])"));var x,L,T=(0,u.jg)(t,".dc .ec").length;if(p!==T){var O=T-p;if(O<0)for(var C=0;C<Math.abs(O);C++){var F=at();_.appendChild(F.element);var G=(x=void 0,L=void 0,x=(0,c.zx)("t"),(L=document.createElement("div")).classList.add("mj"),L.id=x,{element:L,id:x});k.appendChild(G.element)}else for(var H=(0,u.jg)(t,".dc .ec"),q=(0,u.jg)(t,".fj .jj .kj .mj"),Q=0;Q<Math.abs(O);Q++){var U=T-1-Q;H[U].remove(),q[U].remove()}}for(var J=0;J<p;J++){var W="g_".concat(J),Y=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[J],".gc"),".hc").length;if(y[W]!==Y){var $=Y-y[W];if($<0)for(var K=(0,u.aI)((0,u.jg)(t,".dc .ec")[J],".gc"),X=(0,u.aI)((0,u.jg)(t,".dc .ec")[J],".rj"),tt=0;tt<Math.abs($);tt++){var et=it(),rt=ot(et.id);K.appendChild(rt.element),X.appendChild(et.element)}else for(var ct=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[J],".gc"),".hc"),st=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[J],".rj"),".sj"),ut=0;ut<Math.abs($);ut++){var dt=Y-1-ut;ct[dt].remove(),st[dt].remove()}}}for(var lt=0;lt<p;lt++){var ft="g_".concat(lt),ht=(0,u.jg)(t,".fj .jj .kj .mj")[lt];ht.innerHTML=[e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"<span>往".concat(t,"</span>")}))[lt],ht.style.setProperty("--ej","".concat(z[ft].width,"px")),ht.style.setProperty("--cj","".concat(lt));for(var vt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[lt],".gc"),".hc"),pt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[lt],".rj"),".sj"),yt=0;yt<y[ft];yt++){var gt=vt[yt],mt=pt[yt],bt=g[ft][yt];if(P.hasOwnProperty("groupedItems"))if(P.groupedItems.hasOwnProperty(ft))if(P.groupedItems[ft][yt])o(gt,mt,bt,P.groupedItems[ft][yt]);else o(gt,mt,bt,null);else o(gt,mt,bt,null);else o(gt,mt,bt,null)}}P=e,R=r,M=n}function st(){return ut.apply(this,arguments)}function ut(){var t;return t=g().mark((function t(){var e,n,i,o;return g().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,a.Js)("playing_animation"),n=(0,a.Js)("refresh_interval"),q=n.dynamic,F=n.baseInterval,W=!0,Y=(0,c.zx)("r"),L.setAttribute("refreshing","true"),t.next=9,(0,r.R)(K,X,Y);case 9:if(i=t.sent,ct(j,i,!1,e),U=(new Date).getTime(),!q){t.next=19;break}return t.next=15,(0,d.wz)();case 15:o=t.sent,J=Math.max((new Date).getTime()+G,i.dataUpdateTime+F/o),t.next=20;break;case 19:J=(new Date).getTime()+F;case 20:return H=Math.max(G,J-(new Date).getTime()),W=!1,L.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the route."});case 24:case"end":return t.stop()}}),t)})),ut=function(){var e=this,n=arguments;return new Promise((function(r,i){var o=t.apply(e,n);function a(t){w(o,r,i,a,c,"next",t)}function c(t){w(o,r,i,a,c,"throw",t)}a(void 0)}))},ut.apply(this,arguments)}function dt(){st().then((function(t){Q?setTimeout((function(){dt()}),Math.max(G,J-(new Date).getTime())):$=!1})).catch((function(t){console.error(t),Q?((0,h.a)("（路線）發生網路錯誤，將在".concat(C/1e3,"秒後重試。"),"error"),setTimeout((function(){dt()}),C)):$=!1}))}function lt(t,e){(0,f.WR)("Route"),(0,p.XK)("route",t),K=t,X=e,Z=0,j.setAttribute("displayed","true"),(0,u.aI)(j,".dc").scrollLeft=0,function(t){for(var e=(0,a.Js)("playing_animation"),n=(0,f.gO)("window"),r=(n.width,n.height),i=Math.floor(r/50)+5,o={},c=0;c<2;c++){var s="g_".concat(c);o[s]=[];for(var u=0;u<i;u++)o[s].push({name:"",goBack:"0",status:{code:0,text:""},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:u,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}ct(t,{groupedItems:o,groupQuantity:2,itemQuantity:{g_0:i,g_1:i},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:null},!0,e)}(j),Q||(Q=!0,$?st():($=!0,dt()),rt()),(0,f.Z_)()}function ft(){j.setAttribute("displayed","false"),Q=!1,(0,f.l$)()}function ht(t,e){Q=!1,lt(t,e)}function vt(t,e){var n=(0,u.bv)(".cc .dc .ec .fc .gc .hc#".concat(t)),r=(0,u.bv)(".cc .dc .ec .fc .rj .sj#".concat(e));"true"===n.getAttribute("stretched")?(n.setAttribute("stretched","false"),r.setAttribute("stretched","false")):(n.setAttribute("stretched","true"),r.setAttribute("stretched","true"))}function pt(t,e){var n,r=(0,u.aI)(_,".hc#".concat(t)),i=(0,u.aI)(r,".yc"),o=m((0,u.jg)(i,'.zc[highlighted="true"][type="tab"]'));try{for(o.s();!(n=o.n()).done;){n.value.setAttribute("highlighted","false")}}catch(t){o.e(t)}finally{o.f()}switch((0,u.aI)(i,'.zc[code="'.concat(e,'"]')).setAttribute("highlighted","true"),e){case 0:(0,u.aI)(r,".hd").setAttribute("displayed","true"),(0,u.aI)(r,".id").setAttribute("displayed","flase"),(0,u.aI)(r,".jd").setAttribute("displayed","false");break;case 1:(0,u.aI)(r,".hd").setAttribute("displayed","false"),(0,u.aI)(r,".id").setAttribute("displayed","false"),(0,u.aI)(r,".id").setAttribute("displayed","false"),(0,u.aI)(r,".jd").setAttribute("displayed","true");break;case 2:(0,u.aI)(r,".hd").setAttribute("displayed","false"),(0,u.aI)(r,".id").setAttribute("displayed","true"),(0,u.aI)(r,".jd").setAttribute("displayed","false")}}}}]);
//# sourceMappingURL=e33c2c07669155dd207f.js.map
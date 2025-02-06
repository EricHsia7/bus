/*! For license information please see 80649ebe8797e44a0b07.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[1960],{4690:(t,e,n)=>{n.d(e,{Ch:()=>gt,S5:()=>rt,SR:()=>ht,U7:()=>pt,aB:()=>it,py:()=>mt,q0:()=>yt});var r=n(7123),i=n(4537),o=n(6788),a=n(3459),s=n(8024),c=n(7968),u=n(3648),l=n(5767),d=n(9566),f=n(904),v=n(9119),h=n(5579),p=n(5314),g=n(77);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function m(){m=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,n){return t[e]=n}}function l(t,e,n,r){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),s=new R(r||[]);return i(a,"_invoke",{value:E(t,n,s)}),a}function d(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var f="suspendedStart",v="suspendedYield",h="executing",p="completed",g={};function b(){}function w(){}function x(){}var A={};u(A,a,(function(){return this}));var I=Object.getPrototypeOf,L=I&&I(I(Z([])));L&&L!==n&&r.call(L,a)&&(A=L);var k=x.prototype=b.prototype=Object.create(A);function j(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function _(t,e){function n(i,o,a,s){var c=d(t[i],t,o);if("throw"!==c.type){var u=c.arg,l=u.value;return l&&"object"==y(l)&&r.call(l,"__await")?e.resolve(l.__await).then((function(t){n("next",t,a,s)}),(function(t){n("throw",t,a,s)})):e.resolve(l).then((function(t){u.value=t,a(u)}),(function(t){return n("throw",t,a,s)}))}s(c.arg)}var o;i(this,"_invoke",{value:function(t,r){function i(){return new e((function(e,i){n(t,r,e,i)}))}return o=o?o.then(i,i):i()}})}function E(e,n,r){var i=f;return function(o,a){if(i===h)throw Error("Generator is already running");if(i===p){if("throw"===o)throw a;return{value:t,done:!0}}for(r.method=o,r.arg=a;;){var s=r.delegate;if(s){var c=S(s,r);if(c){if(c===g)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(i===f)throw i=p,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);i=h;var u=d(e,n,r);if("normal"===u.type){if(i=r.done?p:v,u.arg===g)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(i=p,r.method="throw",r.arg=u.arg)}}}function S(e,n){var r=n.method,i=e.iterator[r];if(i===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,S(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var o=d(i,e.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,g;var a=o.arg;return a?a.done?(n[e.resultName]=a.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,g):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function Z(e){if(e||""===e){var n=e[a];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var i=-1,o=function n(){for(;++i<e.length;)if(r.call(e,i))return n.value=e[i],n.done=!1,n;return n.value=t,n.done=!0,n};return o.next=o}}throw new TypeError(y(e)+" is not iterable")}return w.prototype=x,i(k,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=u(x,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,c,"GeneratorFunction")),t.prototype=Object.create(k),t},e.awrap=function(t){return{__await:t}},j(_.prototype),u(_.prototype,s,(function(){return this})),e.AsyncIterator=_,e.async=function(t,n,r,i,o){void 0===o&&(o=Promise);var a=new _(l(t,n,r,i),o);return e.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(k),u(k,c,"Generator"),u(k,a,(function(){return this})),u(k,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=Z,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function i(r,i){return s.type="throw",s.arg=e,n.next=r,i&&(n.method="next",n.arg=t),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return i("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),u=r.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return i(a.catchLoc,!0);if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return i(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return i(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var i=r.arg;P(n)}return i}}throw Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:Z(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),g}},e}function b(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return w(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?w(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw o}}}}function w(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function x(t,e,n,r,i,o,a){try{var s=t[o](a),c=s.value}catch(t){return void n(t)}s.done?e(c):Promise.resolve(c).then(r,i)}var A=(0,u.bv)(".pe"),I=(0,u.aI)(A,".mp"),L=(0,u.aI)(I,".pp"),k=(0,u.aI)(I,".op"),j=(0,u.aI)(I,".wp .xp"),_=(0,u.aI)(I,".qp"),E=(0,u.aI)(_,".rp"),S=(0,u.aI)(I,".up"),T=(0,u.aI)(S,".vp"),P=(0,u.aI)(A,".qe"),R={},Z=!0,q=!1,M=0,O=0,D=0,B={},N=0,C=!1,z=1e4,F=15e3,G=5e3,H=15e3,Q=!0,U=!1,J=0,W=0,Y=!1,$="",K=-1,X=-1,V=!1,tt=0,et=[],nt=20;function rt(){P.addEventListener("touchstart",(function(){M=Math.round(P.scrollLeft/N)})),P.addEventListener("scroll",(function(t){C=!0;var e=t.target.scrollLeft/N;O=e>M?M+1:M-1;var n=B["g_".concat(M)]||{width:0,offset:0},r=B["g_".concat(O)]||{width:0,offset:0},i=n.width+(r.width-n.width)*Math.abs(e-M),o=-1*(n.offset+(r.offset-n.offset)*Math.abs(e-M))+.5*N-.5*i;ot(D,o,i-nt,e),e===O&&(M=Math.round(P.scrollLeft/N),C=!1)}),{passive:!0})}function it(){var t=(0,f.gO)("window"),e=t.width,n=t.height;A.style.setProperty("--ag","".concat(e,"px")),A.style.setProperty("--dk","".concat(n,"px"))}function ot(t,e,n,r){A.style.setProperty("--ek",t.toString()),T.style.setProperty("--kp",(n/10).toString()),E.style.setProperty("--sp","".concat(e.toFixed(5),"px")),E.style.setProperty("--ip",r.toFixed(5))}function at(){var t=(new Date).getTime();Y?(X=-1+(0,o._M)($),K+=.1*(X-K)):(X=-1*Math.min(1,Math.max(0,Math.abs(t-J)/H)),K=X),j.style.setProperty("--z",K.toString()),window.requestAnimationFrame((function(){U&&at()}))}function st(){var t=(0,s.zx)("i"),e=document.createElement("div");return e.classList.add("yp"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="aq"></div><div class="bq"><div class="ia" code="0"></div><div class="ja" code="0"></div></div>',{element:e,id:t}}function ct(t){var e=(0,s.zx)("i"),n=document.createElement("div");return n.classList.add("ue"),n.id=e,n.setAttribute("stretched","false"),n.innerHTML='<div class="xe"><div class="ye"></div><div class="_e"><div class="ef"><div class="ia" code="0"></div><div class="ja" code="0"></div></div><div class="df" onclick="bus.route.stretchRouteItemBody(\''.concat(e,"', '").concat(t,"')\">").concat((0,i.Z)("keyboard_arrow_down"),'</div><div class="cf"></div></div></div><div class="jf" displayed="false"><div class="kf"><div class="lf" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 0)" code="0"><div class="uf">').concat((0,i.Z)("directions_bus"),'</div>公車</div><div class="lf" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 1)" code="1"><div class="uf">').concat((0,i.Z)("departure_board"),'</div>抵達時間</div><div class="lf" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 2)" code="2"><div class="uf">').concat((0,i.Z)("route"),'</div>路線</div><div class="lf" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop-on-route\', [\'').concat(e,'\', null, null])"><div class="uf">').concat((0,i.Z)("folder"),'</div>儲存至資料夾</div><div class="lf" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification(\'stop-on-route\', [\'').concat(e,'\', null, null, null])" enabled="true"><div class="uf">').concat((0,i.Z)("notifications"),'</div>設定到站通知</div></div><div class="vf" displayed="true"></div><div class="wf" displayed="false"></div><div class="xf" displayed="false"></div></div>'),{element:n,id:e}}function ut(){var t=(0,s.zx)("g"),e=document.createElement("div");e.classList.add("re"),e.id=t;var n=document.createElement("div");n.classList.add("se");var r=document.createElement("div");r.classList.add("fk");var i=document.createElement("div");return i.classList.add("te"),n.appendChild(r),n.appendChild(i),e.appendChild(n),{element:e,id:t}}function lt(t,e,n,r){function o(t,o,a,c){function l(t,e,n,r){var i=t.getBoundingClientRect(),o=i.top,a=i.left,s=i.bottom,c=i.right,l=window.innerWidth,d=window.innerHeight,f=(0,u.aI)(e,".bq"),v=(0,u.aI)(f,".ja"),h=(0,u.aI)(f,".ia"),p=(0,u.aI)(t,".ef"),g=(0,u.aI)(p,".ja"),y=(0,u.aI)(p,".ia");h.setAttribute("code",n.status.code.toString()),y.setAttribute("code",n.status.code.toString()),y.innerText=n.status.text,r&&s>0&&o<d&&c>0&&a<l?(v.addEventListener("animationend",(function(){v.setAttribute("code",n.status.code.toString()),v.classList.remove("_a")}),{once:!0}),g.addEventListener("animationend",(function(){g.setAttribute("code",n.status.code.toString()),g.innerText=n.status.text,g.classList.remove("_a")}),{once:!0}),v.classList.add("_a"),g.classList.add("_a")):(v.setAttribute("code",n.status.code.toString()),g.setAttribute("code",n.status.code.toString()),g.innerText=n.status.text)}function f(t,e,n){t.setAttribute("segment-buffer",(0,s.xZ)(n.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,s.xZ)(n.segmentBuffer.isSegmentBuffer))}function v(t,e){(0,u.aI)(t,".ye").innerText=e.name}function p(t,e){(0,u.aI)(t,".vf").innerHTML=0===e.buses.length?'<div class="kg">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="yf" on-this-route="'.concat(t.onThisRoute,'"><div class="ng"><div class="qg">').concat((0,i.Z)("directions_bus"),'</div><div class="tg">').concat(t.carNumber,'</div></div><div class="wg"><div class="yg">路線：').concat(t.RouteName,'</div><div class="zg">狀態：').concat(t.status.text,'</div><div class="_g">類型：').concat(t.type,"</div></div></div>")})).join("")}function y(t,e){(0,u.aI)(t,".wf").innerHTML=0===e.overlappingRoutes.length?'<div class="lg">目前沒有路線可顯示</div>':e.overlappingRoutes.map((function(t){return'<div class="zf"><div class="og"><div class="rg">'.concat((0,i.Z)("route"),'</div><div class="ug">').concat(t.name,'</div></div><div class="dh">').concat(t.RouteEndPoints.html,'</div><div class="fh"><div class="gh" onclick="bus.route.switchRoute(').concat(t.RouteID,", [").concat(t.PathAttributeId.join(","),'])">查看路線</div><div class="gh" onclick="bus.folder.openSaveToFolder(\'route-on-route\', [').concat(t.RouteID,'])">收藏路線</div></div></div>')})).join("")}function m(t,e){(0,u.aI)(t,".xf").innerHTML=0===e.busArrivalTimes.length?'<div class="mg">目前沒有抵達時間可顯示</div>':e.busArrivalTimes.map((function(t){return'<div class="_f"><div class="pg"><div class="sg">'.concat((0,i.Z)("schedule"),'</div><div class="vg">').concat(t.time,'</div></div><div class="xg"><div class="ah">個人化行程：').concat(t.personalSchedule.name,'</div><div class="bh">時段：').concat((0,h.pn)(t.personalSchedule.period.start)," - ").concat((0,h.pn)(t.personalSchedule.period.end),'</div><div class="ch">重複：').concat(t.personalSchedule.days.map((function(t){return(0,h.kd)(t).name})).join("、"),"</div></div></div>")})).join("")}function b(t,e,n){t.setAttribute("nearest",(0,s.xZ)(n.nearest)),e.setAttribute("nearest",(0,s.xZ)(n.nearest))}function w(t,e,n,r){var i=(null==n?void 0:n.progress)||0,o=(null==e?void 0:e.progress)||0,a=(0,u.aI)(t,".aq");r&&0!==i&&0===o&&Math.abs(o-i)>0?(a.style.setProperty("--zp","".concat(100,"%")),a.style.setProperty("--_p","".concat(100,"%")),a.addEventListener("transitionend",(function(){a.style.setProperty("--zp","".concat(0,"%")),a.style.setProperty("--_p","".concat(0,"%"))}),{once:!0})):(a.style.setProperty("--zp","".concat(0,"%")),a.style.setProperty("--_p","".concat(100*o,"%")))}function x(t,e,n){n&&((0,u.aI)(t,".jf").setAttribute("displayed","false"),t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function A(t,e,n){t.setAttribute("animation",(0,s.xZ)(n)),e.setAttribute("animation",(0,s.xZ)(n))}function I(t,e,n){t.setAttribute("skeleton-screen",(0,s.xZ)(n)),e.setAttribute("skeleton-screen",(0,s.xZ)(n))}function L(t,n){var r=(0,u.aI)(t,'.jf .kf .lf[type="save-to-folder"]');r.setAttribute("onclick","bus.folder.openSaveToFolder('stop-on-route', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,"])")),(0,d.Gs)("stop",n.id).then((function(t){r.setAttribute("highlighted",(0,s.xZ)(t))}))}function k(t,n){var r=(0,u.aI)(t,'.jf .kf .lf[type="schedule-notification"]');r.setAttribute("onclick","bus.notification.openScheduleNotification('stop-on-route', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,", ").concat(n.status.time,"])"));var i=(0,g.Zc)(n.id);r.setAttribute("highlighted",(0,s.xZ)(i))}null===c?(l(t,o,a,r),v(t,a),p(t,a),y(t,a),m(t,a),f(t,o,a),b(t,o,a),w(o,a,c,r),x(t,o,n),A(t,o,r),I(t,o,n),L(t,a),k(t,a)):(a.status.time!==c.status.time&&(l(t,o,a,r),k(t,a)),(0,s.hw)(c.buses,a.buses)||p(t,a),(0,s.hw)(c.busArrivalTimes,a.busArrivalTimes)||m(t,a),(0,s.hw)(c.segmentBuffer,a.segmentBuffer)||f(t,o,a),c.nearest!==a.nearest&&b(t,o,a),c.progress!==a.progress&&w(o,a,c,r),c.id!==a.id&&(v(t,a),y(t,a),L(t,a),k(t,a)),r!==Z&&A(t,o,r),n!==q&&(x(t,o,n),I(t,o,n)))}var a=(0,f.gO)("window"),l=a.width,v=a.height,p=e.groupQuantity,y=e.itemQuantity,m=e.groupedItems;D=p,N=l;for(var b=0,w=0;w<p;w++){var x=(0,c.q_)([e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"往".concat(t)}))[w],500,"17px",'"Noto Sans TC", sans-serif')+nt;B["g_".concat(w)]={width:x,offset:b},b+=x}var A=-1*B["g_".concat(M)].offset+.5*N-.5*B["g_".concat(M)].width;C||ot(D,A,B["g_".concat(M)].width-nt,M),L.innerHTML="<span>".concat(e.RouteName,"</span>"),L.setAttribute("animation",(0,s.xZ)(r)),L.setAttribute("skeleton-screen",(0,s.xZ)(n)),_.setAttribute("animation",(0,s.xZ)(r)),_.setAttribute("skeleton-screen",(0,s.xZ)(n)),S.setAttribute("animation",(0,s.xZ)(r)),S.setAttribute("skeleton-screen",(0,s.xZ)(n)),k.setAttribute("onclick","bus.route.openRouteDetails(".concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),"])"));var I,j,T=(0,u.jg)(t,".qe .re").length;if(p!==T){var O=T-p;if(O<0)for(var z=0;z<Math.abs(O);z++){var F=ut();P.appendChild(F.element);var G=(I=void 0,j=void 0,I=(0,s.zx)("t"),(j=document.createElement("div")).classList.add("tp"),j.id=I,{element:j,id:I});E.appendChild(G.element)}else for(var H=(0,u.jg)(t,".qe .re"),Q=(0,u.jg)(t,".mp .qp .rp .tp"),U=0;U<Math.abs(O);U++){var J=T-1-U;H[J].remove(),Q[J].remove()}}for(var W=0;W<p;W++){var Y="g_".concat(W),$=(0,u.jg)((0,u.aI)((0,u.jg)(t,".qe .re")[W],".te"),".ue").length;if(y[Y]!==$){var K=$-y[Y];if(K<0)for(var X=(0,u.aI)((0,u.jg)(t,".qe .re")[W],".te"),V=(0,u.aI)((0,u.jg)(t,".qe .re")[W],".fk"),tt=0;tt<Math.abs(K);tt++){var et=st(),rt=ct(et.id);X.appendChild(rt.element),V.appendChild(et.element)}else for(var it=(0,u.jg)((0,u.aI)((0,u.jg)(t,".qe .re")[W],".te"),".ue"),at=(0,u.jg)((0,u.aI)((0,u.jg)(t,".qe .re")[W],".fk"),".yp"),lt=0;lt<Math.abs(K);lt++){var dt=$-1-lt;it[dt].remove(),at[dt].remove()}}}for(var ft=0;ft<p;ft++){var vt="g_".concat(ft),ht=(0,u.jg)(t,".mp .qp .rp .tp")[ft];ht.innerHTML=[e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"<span>往".concat(t,"</span>")}))[ft],ht.style.setProperty("--lp","".concat(B[vt].width,"px")),ht.style.setProperty("--jp","".concat(ft));for(var pt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".qe .re")[ft],".te"),".ue"),gt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".qe .re")[ft],".fk"),".yp"),yt=0;yt<y[vt];yt++){var mt=pt[yt],bt=gt[yt],wt=m[vt][yt];if(R.hasOwnProperty("groupedItems"))if(R.groupedItems.hasOwnProperty(vt))if(R.groupedItems[vt][yt])o(mt,bt,wt,R.groupedItems[vt][yt]);else o(mt,bt,wt,null);else o(mt,bt,wt,null);else o(mt,bt,wt,null)}}R=e,Z=r,q=n}function dt(){return ft.apply(this,arguments)}function ft(){var t;return t=m().mark((function t(){var e,n,i,o;return m().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,a.Js)("playing_animation"),n=(0,a.Js)("refresh_interval"),Q=n.dynamic,F=n.baseInterval,Y=!0,$=(0,s.zx)("r"),j.setAttribute("refreshing","true"),t.next=9,(0,r.R)(tt,et,$);case 9:if(i=t.sent,lt(A,i,!1,e),J=(new Date).getTime(),!Q){t.next=19;break}return t.next=15,(0,l.wz)();case 15:o=t.sent,W=Math.max((new Date).getTime()+G,i.dataUpdateTime+F/o),t.next=20;break;case 19:W=(new Date).getTime()+F;case 20:return H=Math.max(G,W-(new Date).getTime()),Y=!1,j.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the route."});case 24:case"end":return t.stop()}}),t)})),ft=function(){var e=this,n=arguments;return new Promise((function(r,i){var o=t.apply(e,n);function a(t){x(o,r,i,a,s,"next",t)}function s(t){x(o,r,i,a,s,"throw",t)}a(void 0)}))},ft.apply(this,arguments)}function vt(){dt().then((function(t){U?setTimeout((function(){vt()}),Math.max(G,W-(new Date).getTime())):V=!1})).catch((function(t){console.error(t),U?((0,v.a)("（路線）發生網路錯誤，將在".concat(z/1e3,"秒後重試。"),"error"),setTimeout((function(){vt()}),z)):V=!1}))}function ht(t,e){(0,f.WR)("Route"),(0,p.XK)("route",t),tt=t,et=e,M=0,A.setAttribute("displayed","true"),(0,u.aI)(A,".qe").scrollLeft=0,function(t){for(var e=(0,a.Js)("playing_animation"),n=(0,f.gO)("window"),r=(n.width,n.height),i=Math.floor(r/50)+5,o={},s=0;s<2;s++){var c="g_".concat(s);o[c]=[];for(var u=0;u<i;u++)o[c].push({name:"",goBack:"0",status:{code:8,text:"",time:-6},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:u,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}lt(t,{groupedItems:o,groupQuantity:2,itemQuantity:{g_0:i,g_1:i},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:0},!0,e)}(A),U||(U=!0,V?dt():(V=!0,vt()),K=-1,X=-1,at()),(0,f.Z_)()}function pt(){A.setAttribute("displayed","false"),U=!1,K=-1,X=-1,(0,f.l$)()}function gt(t,e){U=!1,K=-1,X=-1,ht(t,e)}function yt(t,e){var n=(0,u.bv)(".pe .qe .re .se .te .ue#".concat(t)),r=(0,u.aI)(n,".jf"),i=(0,u.bv)(".pe .qe .re .se .fk .yp#".concat(e));"true"===n.getAttribute("stretched")?("true"===n.getAttribute("animation")?r.addEventListener("transitionend",(function(){r.setAttribute("displayed","false")}),{once:!0}):r.setAttribute("displayed","false"),n.setAttribute("stretched","false"),i.setAttribute("stretched","false")):(r.setAttribute("displayed","true"),n.setAttribute("stretched","true"),i.setAttribute("stretched","true"))}function mt(t,e){var n,r=(0,u.aI)(P,".ue#".concat(t)),i=(0,u.aI)(r,".kf"),o=b((0,u.jg)(i,'.lf[highlighted="true"][type="tab"]'));try{for(o.s();!(n=o.n()).done;){n.value.setAttribute("highlighted","false")}}catch(t){o.e(t)}finally{o.f()}switch((0,u.aI)(i,'.lf[code="'.concat(e,'"]')).setAttribute("highlighted","true"),e){case 0:(0,u.aI)(r,".vf").setAttribute("displayed","true"),(0,u.aI)(r,".wf").setAttribute("displayed","false"),(0,u.aI)(r,".xf").setAttribute("displayed","false");break;case 1:(0,u.aI)(r,".vf").setAttribute("displayed","false"),(0,u.aI)(r,".wf").setAttribute("displayed","false"),(0,u.aI)(r,".xf").setAttribute("displayed","true");break;case 2:(0,u.aI)(r,".vf").setAttribute("displayed","false"),(0,u.aI)(r,".wf").setAttribute("displayed","true"),(0,u.aI)(r,".xf").setAttribute("displayed","false")}}}}]);
//# sourceMappingURL=80649ebe8797e44a0b07.js.map
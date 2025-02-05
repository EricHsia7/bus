/*! For license information please see 591f4540f8c52515567d.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[1960],{4690:(t,e,n)=>{n.d(e,{Ch:()=>gt,S5:()=>rt,SR:()=>vt,U7:()=>pt,aB:()=>it,py:()=>mt,q0:()=>yt});var r=n(7123),i=n(4537),o=n(6788),a=n(3459),s=n(8024),c=n(7968),u=n(3648),l=n(5767),d=n(9566),f=n(904),h=n(9119),v=n(5579),p=n(5314),g=n(77);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function m(){m=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",s=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,n){return t[e]=n}}function l(t,e,n,r){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),s=new R(r||[]);return i(a,"_invoke",{value:_(t,n,s)}),a}function d(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var f="suspendedStart",h="suspendedYield",v="executing",p="completed",g={};function b(){}function w(){}function x(){}var A={};u(A,a,(function(){return this}));var I=Object.getPrototypeOf,L=I&&I(I(Z([])));L&&L!==n&&r.call(L,a)&&(A=L);var j=x.prototype=b.prototype=Object.create(A);function k(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function n(i,o,a,s){var c=d(t[i],t,o);if("throw"!==c.type){var u=c.arg,l=u.value;return l&&"object"==y(l)&&r.call(l,"__await")?e.resolve(l.__await).then((function(t){n("next",t,a,s)}),(function(t){n("throw",t,a,s)})):e.resolve(l).then((function(t){u.value=t,a(u)}),(function(t){return n("throw",t,a,s)}))}s(c.arg)}var o;i(this,"_invoke",{value:function(t,r){function i(){return new e((function(e,i){n(t,r,e,i)}))}return o=o?o.then(i,i):i()}})}function _(e,n,r){var i=f;return function(o,a){if(i===v)throw Error("Generator is already running");if(i===p){if("throw"===o)throw a;return{value:t,done:!0}}for(r.method=o,r.arg=a;;){var s=r.delegate;if(s){var c=S(s,r);if(c){if(c===g)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(i===f)throw i=p,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);i=v;var u=d(e,n,r);if("normal"===u.type){if(i=r.done?p:h,u.arg===g)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(i=p,r.method="throw",r.arg=u.arg)}}}function S(e,n){var r=n.method,i=e.iterator[r];if(i===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,S(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),g;var o=d(i,e.iterator,n.arg);if("throw"===o.type)return n.method="throw",n.arg=o.arg,n.delegate=null,g;var a=o.arg;return a?a.done?(n[e.resultName]=a.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,g):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,g)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function Z(e){if(e||""===e){var n=e[a];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var i=-1,o=function n(){for(;++i<e.length;)if(r.call(e,i))return n.value=e[i],n.done=!1,n;return n.value=t,n.done=!0,n};return o.next=o}}throw new TypeError(y(e)+" is not iterable")}return w.prototype=x,i(j,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=u(x,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,c,"GeneratorFunction")),t.prototype=Object.create(j),t},e.awrap=function(t){return{__await:t}},k(E.prototype),u(E.prototype,s,(function(){return this})),e.AsyncIterator=E,e.async=function(t,n,r,i,o){void 0===o&&(o=Promise);var a=new E(l(t,n,r,i),o);return e.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},k(j),u(j,c,"Generator"),u(j,a,(function(){return this})),u(j,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=Z,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function i(r,i){return s.type="throw",s.arg=e,n.next=r,i&&(n.method="next",n.arg=t),!!i}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],s=a.completion;if("root"===a.tryLoc)return i("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),u=r.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return i(a.catchLoc,!0);if(this.prev<a.finallyLoc)return i(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return i(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return i(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n];if(i.tryLoc<=this.prev&&r.call(i,"finallyLoc")&&this.prev<i.finallyLoc){var o=i;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,g):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var i=r.arg;P(n)}return i}}throw Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:Z(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),g}},e}function b(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return w(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?w(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,a=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return a=t.done,t},e:function(t){s=!0,o=t},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw o}}}}function w(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function x(t,e,n,r,i,o,a){try{var s=t[o](a),c=s.value}catch(t){return void n(t)}s.done?e(c):Promise.resolve(c).then(r,i)}var A=(0,u.bv)(".ge"),I=(0,u.aI)(A,".mp"),L=(0,u.aI)(I,".pp"),j=(0,u.aI)(I,".op"),k=(0,u.aI)(I,".wp .xp"),E=(0,u.aI)(I,".qp"),_=(0,u.aI)(E,".rp"),S=(0,u.aI)(I,".up"),T=(0,u.aI)(S,".vp"),P=(0,u.aI)(A,".he"),R={},Z=!0,M=!1,O=0,D=0,B=0,N={},q=0,C=!1,F=1e4,z=15e3,G=5e3,H=15e3,Q=!0,U=!1,J=0,W=0,Y=!1,$="",K=-1,X=-1,V=!1,tt=0,et=[],nt=20;function rt(){P.addEventListener("touchstart",(function(){O=Math.round(P.scrollLeft/q)})),P.addEventListener("scroll",(function(t){C=!0;var e=t.target.scrollLeft/q;D=e>O?O+1:O-1;var n=N["g_".concat(O)]||{width:0,offset:0},r=N["g_".concat(D)]||{width:0,offset:0},i=n.width+(r.width-n.width)*Math.abs(e-O),o=-1*(n.offset+(r.offset-n.offset)*Math.abs(e-O))+.5*q-.5*i;ot(B,o,i-nt,e),e===D&&(O=Math.round(P.scrollLeft/q),C=!1)}),{passive:!0})}function it(){var t=(0,f.gO)("window"),e=t.width,n=t.height;A.style.setProperty("--sf","".concat(e,"px")),A.style.setProperty("--vj","".concat(n,"px"))}function ot(t,e,n,r){A.style.setProperty("--wj",t.toString()),T.style.setProperty("--kp",(n/30).toFixed(5)),_.style.setProperty("--sp","".concat(e.toFixed(5),"px")),_.style.setProperty("--ip",r.toFixed(5))}function at(){var t=(new Date).getTime();Y?(X=-1+(0,o._M)($),K+=.1*(X-K)):(X=-1*Math.min(1,Math.max(0,Math.abs(t-J)/H)),K=X),k.style.setProperty("--z",K.toString()),window.requestAnimationFrame((function(){U&&at()}))}function st(){var t=(0,s.zx)("i"),e=document.createElement("div");return e.classList.add("yp"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="aq"></div><div class="bq"><div class="ia" code="0"></div><div class="ja" code="0"></div></div>',{element:e,id:t}}function ct(t){var e=(0,s.zx)("i"),n=document.createElement("div");return n.classList.add("le"),n.id=e,n.setAttribute("stretched","false"),n.innerHTML='<div class="oe"><div class="pe"></div><div class="re"><div class="we"><div class="ia" code="0"></div><div class="ja" code="0"></div></div><div class="ve" onclick="bus.route.stretchRouteItemBody(\''.concat(e,"', '").concat(t,"')\">").concat((0,i.Z)("keyboard_arrow_down"),'</div><div class="ue"></div></div></div><div class="af" displayed="false"><div class="bf"><div class="cf" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 0)" code="0"><div class="lf">').concat((0,i.Z)("directions_bus"),'</div>公車</div><div class="cf" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 1)" code="1"><div class="lf">').concat((0,i.Z)("departure_board"),'</div>抵達時間</div><div class="cf" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 2)" code="2"><div class="lf">').concat((0,i.Z)("route"),'</div>路線</div><div class="cf" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop\', [\'').concat(e,'\', null, null])"><div class="lf">').concat((0,i.Z)("folder"),'</div>儲存至資料夾</div><div class="cf" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification(\'stop\', [\'').concat(e,'\', null, null, null])" enabled="true"><div class="lf">').concat((0,i.Z)("notifications"),'</div>設定到站通知</div></div><div class="mf" displayed="true"></div><div class="nf" displayed="false"></div><div class="of" displayed="false"></div></div>'),{element:n,id:e}}function ut(){var t=(0,s.zx)("g"),e=document.createElement("div");e.classList.add("ie"),e.id=t;var n=document.createElement("div");n.classList.add("je");var r=document.createElement("div");r.classList.add("xj");var i=document.createElement("div");return i.classList.add("ke"),n.appendChild(r),n.appendChild(i),e.appendChild(n),{element:e,id:t}}function lt(t,e,n,r){function o(t,o,a,c){function l(t,e,n,r){var i=t.getBoundingClientRect(),o=i.top,a=i.left,s=i.bottom,c=i.right,l=window.innerWidth,d=window.innerHeight,f=(0,u.aI)(e,".bq"),h=(0,u.aI)(f,".ja"),v=(0,u.aI)(f,".ia"),p=(0,u.aI)(t,".we"),g=(0,u.aI)(p,".ja"),y=(0,u.aI)(p,".ia");v.setAttribute("code",n.status.code.toString()),y.setAttribute("code",n.status.code.toString()),y.innerText=n.status.text,r&&s>0&&o<d&&c>0&&a<l?(h.addEventListener("animationend",(function(){h.setAttribute("code",n.status.code.toString()),h.classList.remove("_a")}),{once:!0}),g.addEventListener("animationend",(function(){g.setAttribute("code",n.status.code.toString()),g.innerText=n.status.text,g.classList.remove("_a")}),{once:!0}),h.classList.add("_a"),g.classList.add("_a")):(h.setAttribute("code",n.status.code.toString()),g.setAttribute("code",n.status.code.toString()),g.innerText=n.status.text)}function f(t,e,n){t.setAttribute("segment-buffer",(0,s.xZ)(n.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,s.xZ)(n.segmentBuffer.isSegmentBuffer))}function h(t,e){(0,u.aI)(t,".pe").innerText=e.name}function p(t,e){(0,u.aI)(t,".mf").innerHTML=0===e.buses.length?'<div class="bg">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="pf" on-this-route="'.concat(t.onThisRoute,'"><div class="eg"><div class="hg">').concat((0,i.Z)("directions_bus"),'</div><div class="kg">').concat(t.carNumber,'</div></div><div class="ng"><div class="pg">路線：').concat(t.RouteName,'</div><div class="qg">狀態：').concat(t.status.text,'</div><div class="rg">類型：').concat(t.type,"</div></div></div>")})).join("")}function y(t,e){(0,u.aI)(t,".nf").innerHTML=0===e.overlappingRoutes.length?'<div class="cg">目前沒有路線可顯示</div>':e.overlappingRoutes.map((function(t){return'<div class="qf"><div class="fg"><div class="ig">'.concat((0,i.Z)("route"),'</div><div class="lg">').concat(t.name,'</div></div><div class="vg">').concat(t.RouteEndPoints.html,'</div><div class="xg"><div class="yg" onclick="bus.route.switchRoute(').concat(t.RouteID,", [").concat(t.PathAttributeId.join(","),'])">查看路線</div><div class="yg" onclick="bus.folder.openSaveToFolder(\'route\', [').concat(t.RouteID,'])">收藏路線</div></div></div>')})).join("")}function m(t,e){(0,u.aI)(t,".of").innerHTML=0===e.busArrivalTimes.length?'<div class="dg">目前沒有抵達時間可顯示</div>':e.busArrivalTimes.map((function(t){return'<div class="rf"><div class="gg"><div class="jg">'.concat((0,i.Z)("schedule"),'</div><div class="mg">').concat(t.time,'</div></div><div class="og"><div class="sg">個人化行程：').concat(t.personalSchedule.name,'</div><div class="tg">時段：').concat((0,v.pn)(t.personalSchedule.period.start)," - ").concat((0,v.pn)(t.personalSchedule.period.end),'</div><div class="ug">重複：').concat(t.personalSchedule.days.map((function(t){return(0,v.kd)(t).name})).join("、"),"</div></div></div>")})).join("")}function b(t,e,n){t.setAttribute("nearest",(0,s.xZ)(n.nearest)),e.setAttribute("nearest",(0,s.xZ)(n.nearest))}function w(t,e,n,r){var i=(null==n?void 0:n.progress)||0,o=(null==e?void 0:e.progress)||0,a=(0,u.aI)(t,".aq");r&&0!==i&&0===o&&Math.abs(o-i)>0?(a.style.setProperty("--zp","".concat(100,"%")),a.style.setProperty("--_p","".concat(100,"%")),a.addEventListener("transitionend",(function(){a.style.setProperty("--zp","".concat(0,"%")),a.style.setProperty("--_p","".concat(0,"%"))}),{once:!0})):(a.style.setProperty("--zp","".concat(0,"%")),a.style.setProperty("--_p","".concat(100*o,"%")))}function x(t,e,n){n&&((0,u.aI)(t,".af").setAttribute("displayed","false"),t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function A(t,e,n){t.setAttribute("animation",(0,s.xZ)(n)),e.setAttribute("animation",(0,s.xZ)(n))}function I(t,e,n){t.setAttribute("skeleton-screen",(0,s.xZ)(n)),e.setAttribute("skeleton-screen",(0,s.xZ)(n))}function L(t,n){var r=(0,u.aI)(t,'.af .bf .cf[type="save-to-folder"]');r.setAttribute("onclick","bus.folder.openSaveToFolder('stop', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,"])")),(0,d.Gs)("stop",n.id).then((function(t){r.setAttribute("highlighted",(0,s.xZ)(t))}))}function j(t,n){var r=(0,u.aI)(t,'.af .bf .cf[type="schedule-notification"]');r.setAttribute("onclick","bus.notification.openScheduleNotification('stop', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,", ").concat(n.status.time,"])"));var i=(0,g.Zc)(n.id);r.setAttribute("highlighted",(0,s.xZ)(i))}null===c?(l(t,o,a,r),h(t,a),p(t,a),y(t,a),m(t,a),f(t,o,a),b(t,o,a),w(o,a,c,r),x(t,o,n),A(t,o,r),I(t,o,n),L(t,a),j(t,a)):(a.status.time!==c.status.time&&(l(t,o,a,r),j(t,a)),(0,s.hw)(c.buses,a.buses)||p(t,a),(0,s.hw)(c.busArrivalTimes,a.busArrivalTimes)||m(t,a),(0,s.hw)(c.segmentBuffer,a.segmentBuffer)||f(t,o,a),c.nearest!==a.nearest&&b(t,o,a),c.progress!==a.progress&&w(o,a,c,r),c.id!==a.id&&(h(t,a),y(t,a),L(t,a),j(t,a)),r!==Z&&A(t,o,r),n!==M&&(x(t,o,n),I(t,o,n)))}var a=(0,f.gO)("window"),l=a.width,h=a.height,p=e.groupQuantity,y=e.itemQuantity,m=e.groupedItems;B=p,q=l;for(var b=0,w=0;w<p;w++){var x=(0,c.q_)([e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"往".concat(t)}))[w],500,"17px",'"Noto Sans TC", sans-serif')+nt;N["g_".concat(w)]={width:x,offset:b},b+=x}var A=-1*N["g_".concat(O)].offset+.5*q-.5*N["g_".concat(O)].width;C||ot(B,A,N["g_".concat(O)].width-nt,O),L.innerHTML="<span>".concat(e.RouteName,"</span>"),L.setAttribute("animation",(0,s.xZ)(r)),L.setAttribute("skeleton-screen",(0,s.xZ)(n)),E.setAttribute("animation",(0,s.xZ)(r)),E.setAttribute("skeleton-screen",(0,s.xZ)(n)),S.setAttribute("animation",(0,s.xZ)(r)),S.setAttribute("skeleton-screen",(0,s.xZ)(n)),j.setAttribute("onclick","bus.route.openRouteDetails(".concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),"])"));var I,k,T=(0,u.jg)(t,".he .ie").length;if(p!==T){var D=T-p;if(D<0)for(var F=0;F<Math.abs(D);F++){var z=ut();P.appendChild(z.element);var G=(I=void 0,k=void 0,I=(0,s.zx)("t"),(k=document.createElement("div")).classList.add("tp"),k.id=I,{element:k,id:I});_.appendChild(G.element)}else for(var H=(0,u.jg)(t,".he .ie"),Q=(0,u.jg)(t,".mp .qp .rp .tp"),U=0;U<Math.abs(D);U++){var J=T-1-U;H[J].remove(),Q[J].remove()}}for(var W=0;W<p;W++){var Y="g_".concat(W),$=(0,u.jg)((0,u.aI)((0,u.jg)(t,".he .ie")[W],".ke"),".le").length;if(y[Y]!==$){var K=$-y[Y];if(K<0)for(var X=(0,u.aI)((0,u.jg)(t,".he .ie")[W],".ke"),V=(0,u.aI)((0,u.jg)(t,".he .ie")[W],".xj"),tt=0;tt<Math.abs(K);tt++){var et=st(),rt=ct(et.id);X.appendChild(rt.element),V.appendChild(et.element)}else for(var it=(0,u.jg)((0,u.aI)((0,u.jg)(t,".he .ie")[W],".ke"),".le"),at=(0,u.jg)((0,u.aI)((0,u.jg)(t,".he .ie")[W],".xj"),".yp"),lt=0;lt<Math.abs(K);lt++){var dt=$-1-lt;it[dt].remove(),at[dt].remove()}}}for(var ft=0;ft<p;ft++){var ht="g_".concat(ft),vt=(0,u.jg)(t,".mp .qp .rp .tp")[ft];vt.innerHTML=[e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"<span>往".concat(t,"</span>")}))[ft],vt.style.setProperty("--lp","".concat(N[ht].width,"px")),vt.style.setProperty("--jp","".concat(ft));for(var pt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".he .ie")[ft],".ke"),".le"),gt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".he .ie")[ft],".xj"),".yp"),yt=0;yt<y[ht];yt++){var mt=pt[yt],bt=gt[yt],wt=m[ht][yt];if(R.hasOwnProperty("groupedItems"))if(R.groupedItems.hasOwnProperty(ht))if(R.groupedItems[ht][yt])o(mt,bt,wt,R.groupedItems[ht][yt]);else o(mt,bt,wt,null);else o(mt,bt,wt,null);else o(mt,bt,wt,null)}}R=e,Z=r,M=n}function dt(){return ft.apply(this,arguments)}function ft(){var t;return t=m().mark((function t(){var e,n,i,o;return m().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,a.Js)("playing_animation"),n=(0,a.Js)("refresh_interval"),Q=n.dynamic,z=n.baseInterval,Y=!0,$=(0,s.zx)("r"),k.setAttribute("refreshing","true"),t.next=9,(0,r.R)(tt,et,$);case 9:if(i=t.sent,lt(A,i,!1,e),J=(new Date).getTime(),!Q){t.next=19;break}return t.next=15,(0,l.wz)();case 15:o=t.sent,W=Math.max((new Date).getTime()+G,i.dataUpdateTime+z/o),t.next=20;break;case 19:W=(new Date).getTime()+z;case 20:return H=Math.max(G,W-(new Date).getTime()),Y=!1,k.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the route."});case 24:case"end":return t.stop()}}),t)})),ft=function(){var e=this,n=arguments;return new Promise((function(r,i){var o=t.apply(e,n);function a(t){x(o,r,i,a,s,"next",t)}function s(t){x(o,r,i,a,s,"throw",t)}a(void 0)}))},ft.apply(this,arguments)}function ht(){dt().then((function(t){U?setTimeout((function(){ht()}),Math.max(G,W-(new Date).getTime())):V=!1})).catch((function(t){console.error(t),U?((0,h.a)("（路線）發生網路錯誤，將在".concat(F/1e3,"秒後重試。"),"error"),setTimeout((function(){ht()}),F)):V=!1}))}function vt(t,e){(0,f.WR)("Route"),(0,p.XK)("route",t),tt=t,et=e,O=0,A.setAttribute("displayed","true"),(0,u.aI)(A,".he").scrollLeft=0,function(t){for(var e=(0,a.Js)("playing_animation"),n=(0,f.gO)("window"),r=(n.width,n.height),i=Math.floor(r/50)+5,o={},s=0;s<2;s++){var c="g_".concat(s);o[c]=[];for(var u=0;u<i;u++)o[c].push({name:"",goBack:"0",status:{code:8,text:"",time:-6},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:u,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}lt(t,{groupedItems:o,groupQuantity:2,itemQuantity:{g_0:i,g_1:i},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:0},!0,e)}(A),U||(U=!0,V?dt():(V=!0,ht()),K=-1,X=-1,at()),(0,f.Z_)()}function pt(){A.setAttribute("displayed","false"),U=!1,K=-1,X=-1,(0,f.l$)()}function gt(t,e){U=!1,K=-1,X=-1,vt(t,e)}function yt(t,e){var n=(0,u.bv)(".ge .he .ie .je .ke .le#".concat(t)),r=(0,u.aI)(n,".af"),i=(0,u.bv)(".ge .he .ie .je .xj .yp#".concat(e));"true"===n.getAttribute("stretched")?("true"===n.getAttribute("animation")?r.addEventListener("transitionend",(function(){r.setAttribute("displayed","false")}),{once:!0}):r.setAttribute("displayed","false"),n.setAttribute("stretched","false"),i.setAttribute("stretched","false")):(r.setAttribute("displayed","true"),n.setAttribute("stretched","true"),i.setAttribute("stretched","true"))}function mt(t,e){var n,r=(0,u.aI)(P,".le#".concat(t)),i=(0,u.aI)(r,".bf"),o=b((0,u.jg)(i,'.cf[highlighted="true"][type="tab"]'));try{for(o.s();!(n=o.n()).done;){n.value.setAttribute("highlighted","false")}}catch(t){o.e(t)}finally{o.f()}switch((0,u.aI)(i,'.cf[code="'.concat(e,'"]')).setAttribute("highlighted","true"),e){case 0:(0,u.aI)(r,".mf").setAttribute("displayed","true"),(0,u.aI)(r,".nf").setAttribute("displayed","false"),(0,u.aI)(r,".of").setAttribute("displayed","false");break;case 1:(0,u.aI)(r,".mf").setAttribute("displayed","false"),(0,u.aI)(r,".nf").setAttribute("displayed","false"),(0,u.aI)(r,".nf").setAttribute("displayed","false"),(0,u.aI)(r,".of").setAttribute("displayed","true");break;case 2:(0,u.aI)(r,".mf").setAttribute("displayed","false"),(0,u.aI)(r,".nf").setAttribute("displayed","true"),(0,u.aI)(r,".of").setAttribute("displayed","false")}}}}]);
//# sourceMappingURL=591f4540f8c52515567d.js.map
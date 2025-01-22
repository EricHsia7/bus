/*! For license information please see 4cfba39ce752687d9254.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[960],{4690:(t,e,r)=>{r.d(e,{Ch:()=>ht,S5:()=>tt,SR:()=>dt,U7:()=>ft,aB:()=>et,b1:()=>vt,fT:()=>pt,py:()=>gt,q0:()=>yt});var n=r(7123),o=r(4537),i=r(6788),a=r(3459),c=r(8024),s=r(7968),u=r(3648),l=r(5767),d=r(9566),f=r(904),h=r(9119),v=r(5579),p=r(5314);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function g(){g=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new R(n||[]);return o(a,"_invoke",{value:S(t,r,c)}),a}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var f="suspendedStart",h="suspendedYield",v="executing",p="completed",m={};function b(){}function w(){}function x(){}var L={};u(L,a,(function(){return this}));var A=Object.getPrototypeOf,I=A&&A(A(O([])));I&&I!==r&&n.call(I,a)&&(L=I);var k=x.prototype=b.prototype=Object.create(L);function E(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(o,i,a,c){var s=d(t[o],t,i);if("throw"!==s.type){var u=s.arg,l=u.value;return l&&"object"==y(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(l).then((function(t){u.value=t,a(u)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function S(e,r,n){var o=f;return function(i,a){if(o===v)throw Error("Generator is already running");if(o===p){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var s=_(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===f)throw o=p,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var u=d(e,r,n);if("normal"===u.type){if(o=n.done?p:h,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=p,n.method="throw",n.arg=u.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=d(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,m;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function O(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(y(e)+" is not iterable")}return w.prototype=x,o(k,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=u(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,s,"GeneratorFunction")),t.prototype=Object.create(k),t},e.awrap=function(t){return{__await:t}},E(j.prototype),u(j.prototype,c,(function(){return this})),e.AsyncIterator=j,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new j(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(k),u(k,s,"Generator"),u(k,a,(function(){return this})),u(k,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=O,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:O(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function m(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return b(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?b(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function w(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}var x=(0,u.bv)(".cc"),L=(0,u.aI)(x,"._k"),A=(0,u.aI)(L,".al"),I=(0,u.aI)(L,".no"),k=(0,u.aI)(L,".ro .so"),E=(0,u.aI)(L,".bl"),j=(0,u.aI)(E,".cl"),S=(0,u.aI)(L,".po"),_=(0,u.aI)(S,".qo"),T=(0,u.aI)(x,".dc"),P={},R=!0,O=!1,M=0,Z=0,N=0,D={},F=0,z=!1,G=1e4,B=15e3,C=5e3,H=15e3,q=!0,U=!1,J=0,Q=0,Y=!1,W="",$=!1,X=0,K=[],V=20;function tt(){T.addEventListener("touchstart",(function(){M=Math.round(T.scrollLeft/F)})),T.addEventListener("scroll",(function(t){z=!0;var e=t.target.scrollLeft/F;Z=e>M?M+1:M-1;var r=D["g_".concat(M)]||{width:0,offset:0},n=D["g_".concat(Z)]||{width:0,offset:0},o=r.width+(n.width-r.width)*Math.abs(e-M),i=-1*(r.offset+(n.offset-r.offset)*Math.abs(e-M))+.5*F-.5*o;rt(N,i,o-V,e),e===Z&&(M=Math.round(T.scrollLeft/F),z=!1)}))}function et(){var t=(0,f.gO)("window"),e=t.width,r=t.height;x.style.setProperty("--nd","".concat(e,"px")),x.style.setProperty("--go","".concat(r,"px"))}function rt(t,e,r,n){x.style.setProperty("--ho",t.toString()),_.style.setProperty("--ko",(r/30).toFixed(5)),j.style.setProperty("--oo","".concat(e.toFixed(5),"px")),j.style.setProperty("--io",n.toFixed(5))}function nt(){var t=(new Date).getTime(),e=0;e=Y?-1+(0,i._M)(W):-1*Math.min(1,Math.max(0,Math.abs(t-J)/H)),k.style.setProperty("--pa",e.toString()),window.requestAnimationFrame((function(){U&&nt()}))}function ot(){var t=(0,c.zx)("i"),e=document.createElement("div");return e.classList.add("vk"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="yk"></div><div class="zk"><div class="nb" code="0"></div><div class="ob" code="0"></div></div>',{element:e,id:t}}function it(t){var e=(0,c.zx)("i"),r=document.createElement("div");return r.classList.add("hc"),r.id=e,r.setAttribute("stretched","false"),r.innerHTML='<div class="kc"><div class="lc"></div><div class="nc"><div class="sc"><div class="nb" code="0"></div><div class="ob" code="0"></div></div><div class="rc" onclick="bus.route.stretchRouteItemBody(\''.concat(e,"', '").concat(t,"')\">").concat((0,o.Z)("keyboard_arrow_down"),'</div><div class="qc"></div></div></div><div class="xc"><div class="yc"><div class="zc" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 0)" code="0"><div class="gd">').concat((0,o.Z)("directions_bus"),'</div>公車</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 1)" code="1"><div class="gd">').concat((0,o.Z)("departure_board"),'</div>抵達時間</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 2)" code="2"><div class="gd">').concat((0,o.Z)("route"),'</div>路線</div><div class="zc" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop\', [\'').concat(e,'\', null, null])"><div class="gd">').concat((0,o.Z)("folder"),'</div>儲存至資料夾</div></div><div class="hd" displayed="true"></div><div class="id" displayed="false"></div><div class="jd" displayed="false"></div></div>'),{element:r,id:e}}function at(){var t=(0,c.zx)("g"),e=document.createElement("div");e.classList.add("ec"),e.id=t;var r=document.createElement("div");r.classList.add("fc");var n=document.createElement("div");n.classList.add("uk");var o=document.createElement("div");return o.classList.add("gc"),r.appendChild(n),r.appendChild(o),e.appendChild(r),{element:e,id:t}}function ct(t,e,r,n){function i(t,i,a,s){function l(t,e,r,n){var o=t.getBoundingClientRect(),i=o.top,a=o.left,c=o.bottom,s=o.right,l=window.innerWidth,d=window.innerHeight,f=(0,u.aI)(e,".zk"),h=(0,u.aI)(f,".ob"),v=(0,u.aI)(f,".nb"),p=(0,u.aI)(t,".sc"),y=(0,u.aI)(p,".ob"),g=(0,u.aI)(p,".nb");v.setAttribute("code",r.status.code.toString()),g.setAttribute("code",r.status.code.toString()),g.innerText=r.status.text,n&&c>0&&i<d&&s>0&&a<l?(h.addEventListener("animationend",(function(){h.setAttribute("code",r.status.code.toString()),h.classList.remove("sb")}),{once:!0}),y.addEventListener("animationend",(function(){y.setAttribute("code",r.status.code.toString()),y.innerText=r.status.text,y.classList.remove("sb")}),{once:!0}),h.classList.add("sb"),y.classList.add("sb")):(h.setAttribute("code",r.status.code.toString()),y.setAttribute("code",r.status.code.toString()),y.innerText=r.status.text)}function f(t,e,r){t.setAttribute("segment-buffer",(0,c.xZ)(r.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,c.xZ)(r.segmentBuffer.isSegmentBuffer))}function h(t,e){(0,u.aI)(t,".lc").innerText=e.name}function p(t,e){(0,u.aI)(t,".hd").innerHTML=0===e.buses.length?'<div class="xd">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="kd" on-this-route="'.concat(t.onThisRoute,'"><div class="_d"><div class="ce">').concat((0,o.Z)("directions_bus"),'</div><div class="fe">').concat(t.carNumber,'</div></div><div class="ie"><div class="ke">路線：').concat(t.RouteName,'</div><div class="le">狀態：').concat(t.status.text,'</div><div class="me">類型：').concat(t.type,"</div></div></div>")})).join("")}function y(t,e){(0,u.aI)(t,".id").innerHTML=0===e.overlappingRoutes.length?'<div class="yd">目前沒有路線可顯示</div>':e.overlappingRoutes.map((function(t){return'<div class="ld"><div class="ae"><div class="de">'.concat((0,o.Z)("route"),'</div><div class="ge">').concat(t.name,'</div></div><div class="qe">').concat(t.RouteEndPoints.html,'</div><div class="se"><div class="te" onclick="bus.route.switchRoute(').concat(t.RouteID,", [").concat(t.PathAttributeId.join(","),'])">查看路線</div><div class="te" onclick="bus.folder.openSaveToFolder(\'route\', [').concat(t.RouteID,'])">收藏路線</div></div></div>')})).join("")}function g(t,e){(0,u.aI)(t,".jd").innerHTML=0===e.busArrivalTimes.length?'<div class="zd">目前沒有抵達時間可顯示</div>':e.busArrivalTimes.map((function(t){return'<div class="md"><div class="be"><div class="ee">'.concat((0,o.Z)("schedule"),'</div><div class="he">').concat(t.time,'</div></div><div class="je"><div class="ne">個人化行程：').concat(t.personalSchedule.name,'</div><div class="oe">時段：').concat((0,v.pn)(t.personalSchedule.period.start)," - ").concat((0,v.pn)(t.personalSchedule.period.end),'</div><div class="pe">重複：').concat(t.personalSchedule.days.map((function(t){return(0,v.kd)(t).name})).join("、"),"</div></div></div>")})).join("")}function m(t,e,r){t.setAttribute("nearest",(0,c.xZ)(r.nearest)),e.setAttribute("nearest",(0,c.xZ)(r.nearest))}function b(t,e,r,n){var o=(null==r?void 0:r.progress)||0,i=(null==e?void 0:e.progress)||0,a=(0,u.aI)(t,".yk");n&&0!==o&&0===i&&Math.abs(i-o)>0?(a.style.setProperty("--wk","".concat(100,"%")),a.style.setProperty("--xk","".concat(100,"%")),a.addEventListener("transitionend",(function(){a.style.setProperty("--wk","".concat(0,"%")),a.style.setProperty("--xk","".concat(0,"%"))}),{once:!0})):(a.style.setProperty("--wk","".concat(0,"%")),a.style.setProperty("--xk","".concat(100*i,"%")))}function w(t,e,r){r&&(t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function x(t,e,r){t.setAttribute("animation",(0,c.xZ)(r)),e.setAttribute("animation",(0,c.xZ)(r))}function L(t,e,r){t.setAttribute("skeleton-screen",(0,c.xZ)(r)),e.setAttribute("skeleton-screen",(0,c.xZ)(r))}function A(t,r){var n=(0,u.aI)(t,'.xc .yc .zc[type="save-to-folder"]');n.setAttribute("onclick","bus.folder.openSaveToFolder('stop', ['".concat(t.id,"', ").concat(r.id,", ").concat(e.RouteID,"])")),(0,d.Gs)("stop",r.id).then((function(t){n.setAttribute("highlighted",(0,c.xZ)(t))}))}null===s?(l(t,i,a,n),h(t,a),p(t,a),y(t,a),g(t,a),f(t,i,a),m(t,i,a),b(i,a,s,n),w(t,i,r),x(t,i,n),L(t,i,r),A(t,a)):(a.status.code===s.status.code&&(0,c.hw)(s.status.text,a.status.text)||l(t,i,a,n),(0,c.hw)(s.buses,a.buses)||p(t,a),(0,c.hw)(s.busArrivalTimes,a.busArrivalTimes)||g(t,a),(0,c.hw)(s.segmentBuffer,a.segmentBuffer)||f(t,i,a),s.nearest!==a.nearest&&m(t,i,a),s.progress!==a.progress&&b(i,a,s,n),s.id!==a.id&&(h(t,a),y(t,a),A(t,a)),n!==R&&x(t,i,n),r!==O&&(w(t,i,r),L(t,i,r)))}var a=(0,f.gO)("window"),l=a.width,h=a.height,p=e.groupQuantity,y=e.itemQuantity,g=e.groupedItems;N=p,F=l;for(var m=0,b=0;b<p;b++){var w=(0,s.q)([e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"往".concat(t)}))[b],500,"17px",'"Noto Sans TC", sans-serif')+V;D["g_".concat(b)]={width:w,offset:m},m+=w}var x=-1*D["g_".concat(M)].offset+.5*F-.5*D["g_".concat(M)].width;z||rt(N,x,D["g_".concat(M)].width-V,M),A.innerHTML="<span>".concat(e.RouteName,"</span>"),A.setAttribute("animation",(0,c.xZ)(n)),A.setAttribute("skeleton-screen",(0,c.xZ)(r)),E.setAttribute("animation",(0,c.xZ)(n)),E.setAttribute("skeleton-screen",(0,c.xZ)(r)),S.setAttribute("animation",(0,c.xZ)(n)),S.setAttribute("skeleton-screen",(0,c.xZ)(r)),I.setAttribute("onclick","bus.route.openRouteDetails(".concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),"])"));var L,k,_=(0,u.jg)(t,".dc .ec").length;if(p!==_){var Z=_-p;if(Z<0)for(var G=0;G<Math.abs(Z);G++){var B=at();T.appendChild(B.element);var C=(L=void 0,k=void 0,L=(0,c.zx)("t"),(k=document.createElement("div")).classList.add("dl"),k.id=L,{element:k,id:L});j.appendChild(C.element)}else for(var H=(0,u.jg)(t,".dc .ec"),q=(0,u.jg)(t,"._k .bl .cl .dl"),U=0;U<Math.abs(Z);U++){var J=_-1-U;H[J].remove(),q[J].remove()}}for(var Q=0;Q<p;Q++){var Y="g_".concat(Q),W=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[Q],".gc"),".hc").length;if(y[Y]!==W){var $=W-y[Y];if($<0)for(var X=(0,u.aI)((0,u.jg)(t,".dc .ec")[Q],".gc"),K=(0,u.aI)((0,u.jg)(t,".dc .ec")[Q],".uk"),tt=0;tt<Math.abs($);tt++){var et=ot(),nt=it(et.id);X.appendChild(nt.element),K.appendChild(et.element)}else for(var ct=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[Q],".gc"),".hc"),st=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[Q],".uk"),".vk"),ut=0;ut<Math.abs($);ut++){var lt=W-1-ut;ct[lt].remove(),st[lt].remove()}}}for(var dt=0;dt<p;dt++){var ft="g_".concat(dt),ht=(0,u.jg)(t,"._k .bl .cl .dl")[dt];ht.innerHTML=[e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"<span>往".concat(t,"</span>")}))[dt],ht.style.setProperty("--lo","".concat(D[ft].width,"px")),ht.style.setProperty("--jo","".concat(dt));for(var vt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[dt],".gc"),".hc"),pt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[dt],".uk"),".vk"),yt=0;yt<y[ft];yt++){var gt=vt[yt],mt=pt[yt],bt=g[ft][yt];if(P.hasOwnProperty("groupedItems"))if(P.groupedItems.hasOwnProperty(ft))if(P.groupedItems[ft][yt])i(gt,mt,bt,P.groupedItems[ft][yt]);else i(gt,mt,bt,null);else i(gt,mt,bt,null);else i(gt,mt,bt,null)}}P=e,R=n,O=r}function st(){return ut.apply(this,arguments)}function ut(){var t;return t=g().mark((function t(){var e,r,o,i;return g().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,a.Js)("playing_animation"),r=(0,a.Js)("refresh_interval"),q=r.dynamic,B=r.baseInterval,Y=!0,W=(0,c.zx)("r"),k.setAttribute("refreshing","true"),t.next=9,(0,n.R)(X,K,W);case 9:if(o=t.sent,ct(x,o,!1,e),J=(new Date).getTime(),!q){t.next=19;break}return t.next=15,(0,l.wz)();case 15:i=t.sent,Q=Math.max((new Date).getTime()+C,o.dataUpdateTime+B/i),t.next=20;break;case 19:Q=(new Date).getTime()+B;case 20:return H=Math.max(C,Q-(new Date).getTime()),Y=!1,k.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the route."});case 24:case"end":return t.stop()}}),t)})),ut=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){w(i,n,o,a,c,"next",t)}function c(t){w(i,n,o,a,c,"throw",t)}a(void 0)}))},ut.apply(this,arguments)}function lt(){st().then((function(t){U?setTimeout((function(){lt()}),Math.max(C,Q-(new Date).getTime())):$=!1})).catch((function(t){console.error(t),U?((0,h.a)("（路線）發生網路錯誤，將在".concat(G/1e3,"秒後重試。"),"error"),setTimeout((function(){lt()}),G)):$=!1}))}function dt(t,e){(0,f.WR)("Route"),(0,p.XK)("route",t),X=t,K=e,M=0,x.setAttribute("displayed","true"),(0,u.aI)(x,".dc").scrollLeft=0,function(t){for(var e=(0,a.Js)("playing_animation"),r=(0,f.gO)("window"),n=(r.width,r.height),o=Math.floor(n/50)+5,i={},c=0;c<2;c++){var s="g_".concat(c);i[s]=[];for(var u=0;u<o;u++)i[s].push({name:"",goBack:"0",status:{code:0,text:""},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:u,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}ct(t,{groupedItems:i,groupQuantity:2,itemQuantity:{g_0:o,g_1:o},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:null},!0,e)}(x),U||(U=!0,$?st():($=!0,lt()),nt()),(0,f.Z_)()}function ft(){x.setAttribute("displayed","false"),U=!1,(0,f.l$)()}function ht(t,e){U=!1,dt(t,e)}function vt(){M<N-1&&T.scrollTo({left:F*(M+1),behavior:"smooth"})}function pt(){M>0&&T.scrollTo({left:F*(M-1),behavior:"smooth"})}function yt(t,e){var r=(0,u.bv)(".cc .dc .ec .fc .gc .hc#".concat(t)),n=(0,u.bv)(".cc .dc .ec .fc .uk .vk#".concat(e));"true"===r.getAttribute("stretched")?(r.setAttribute("stretched","false"),n.setAttribute("stretched","false")):(r.setAttribute("stretched","true"),n.setAttribute("stretched","true"))}function gt(t,e){var r,n=(0,u.aI)(T,".hc#".concat(t)),o=(0,u.aI)(n,".yc"),i=m((0,u.jg)(o,'.zc[highlighted="true"][type="tab"]'));try{for(i.s();!(r=i.n()).done;){r.value.setAttribute("highlighted","false")}}catch(t){i.e(t)}finally{i.f()}switch((0,u.aI)(o,'.zc[code="'.concat(e,'"]')).setAttribute("highlighted","true"),e){case 0:(0,u.aI)(n,".hd").setAttribute("displayed","true"),(0,u.aI)(n,".id").setAttribute("displayed","flase"),(0,u.aI)(n,".jd").setAttribute("displayed","false");break;case 1:(0,u.aI)(n,".hd").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","false"),(0,u.aI)(n,".jd").setAttribute("displayed","true");break;case 2:(0,u.aI)(n,".hd").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","true"),(0,u.aI)(n,".jd").setAttribute("displayed","false")}}},3041:(t,e,r)=>{r.d(e,{BI:()=>y,Dh:()=>b,JL:()=>m,nS:()=>g});var n=r(3648),o=r(904),i=r(8024),a=r(9566),c=r(4537),s=r(9119);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function l(){l=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function d(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{d({},"")}catch(t){d=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new R(n||[]);return o(a,"_invoke",{value:S(t,r,c)}),a}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var v="suspendedStart",p="suspendedYield",y="executing",g="completed",m={};function b(){}function w(){}function x(){}var L={};d(L,a,(function(){return this}));var A=Object.getPrototypeOf,I=A&&A(A(O([])));I&&I!==r&&n.call(I,a)&&(L=I);var k=x.prototype=b.prototype=Object.create(L);function E(t){["next","throw","return"].forEach((function(e){d(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(o,i,a,c){var s=h(t[o],t,i);if("throw"!==s.type){var l=s.arg,d=l.value;return d&&"object"==u(d)&&n.call(d,"__await")?e.resolve(d.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(d).then((function(t){l.value=t,a(l)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function S(e,r,n){var o=v;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var s=_(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var u=h(e,r,n);if("normal"===u.type){if(o=n.done?g:p,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=g,n.method="throw",n.arg=u.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=h(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,m;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function O(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(u(e)+" is not iterable")}return w.prototype=x,o(k,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=d(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,d(t,s,"GeneratorFunction")),t.prototype=Object.create(k),t},e.awrap=function(t){return{__await:t}},E(j.prototype),d(j.prototype,c,(function(){return this})),e.AsyncIterator=j,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new j(f(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},E(k),d(k,s,"Generator"),d(k,a,(function(){return this})),d(k,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=O,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:O(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function d(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return f(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function h(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}function v(t,e,r){var n=(0,i.zx)("i"),o=document.createElement("div");switch(o.classList.add("jm"),o.id=n,e){case"stop":o.setAttribute("onclick","bus.folder.saveStopItemOnRoute('".concat(r[0],"', '").concat(t.folder.id,"', ").concat(r[1],", ").concat(r[2],")"));break;case"route":o.setAttribute("onclick","bus.folder.saveRouteOnDetailsPage('".concat(t.folder.id,"', ").concat(r[0],")"))}return o.innerHTML='<div class="km">'.concat((0,c.Z)(t.folder.icon),'</div><div class="lm">').concat(t.folder.name,"</div>"),{element:o,id:n}}function p(){var t;return t=l().mark((function t(e,r){var o,i,c,s,u,f;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=(0,n.bv)(".dm"),(0,n.aI)(o,".hm .im").innerHTML="",t.next=4,(0,a.Xi)();case 4:i=t.sent,c=d(i);try{for(c.s();!(s=c.n()).done;)u=s.value,f=v(u,e,r),(0,n.aI)(o,".hm .im").appendChild(f.element)}catch(t){c.e(t)}finally{c.f()}case 7:case"end":return t.stop()}}),t)})),p=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){h(i,n,o,a,c,"next",t)}function c(t){h(i,n,o,a,c,"throw",t)}a(void 0)}))},p.apply(this,arguments)}function y(t,e){(0,o.WR)("SaveToFolder"),(0,n.bv)(".dm").setAttribute("displayed","true"),function(t,e){p.apply(this,arguments)}(t,e)}function g(){(0,o.kr)("SaveToFolder"),(0,n.bv)(".dm").setAttribute("displayed","false")}function m(t,e,r,o){var i=(0,n.bv)(".cc .dc .ec .fc .gc .hc#".concat(t)),c=(0,n.aI)(i,'.xc .yc .zc[type="save-to-folder"]');(0,a.aq)(e,r,o).then((function(t){t?(0,a.Gs)("stop",r).then((function(t){t&&(c.setAttribute("highlighted",t),(0,s.a)("已儲存至資料夾","folder"),g())})):(0,s.a)("此資料夾不支援站牌類型項目","warning")}))}function b(t,e){var r=(0,n.bv)('.to .yo .zo ._o[group="actions"] .dp .ep[action="save-to-folder"]');(0,a.Fq)(t,e).then((function(t){t?(0,a.Gs)("route",e).then((function(t){t&&(r.setAttribute("highlighted","true"),(0,s.a)("已儲存至資料夾","folder"),g())})):(0,s.a)("此資料夾不支援路線類型項目","warning")}))}}}]);
//# sourceMappingURL=4cfba39ce752687d9254.js.map
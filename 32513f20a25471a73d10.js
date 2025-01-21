/*! For license information please see 32513f20a25471a73d10.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[960],{4690:(t,e,r)=>{r.d(e,{Ch:()=>dt,S5:()=>X,SR:()=>ut,U7:()=>lt,aB:()=>V,py:()=>ht,q0:()=>ft});var n=r(7123),o=r(4537),i=r(6788),a=r(3459),c=r(8024),s=r(7968),u=r(3648),l=r(5767),d=r(9566),f=r(904),h=r(9119),v=r(5579),p=r(5314);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function g(){g=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new R(n||[]);return o(a,"_invoke",{value:k(t,r,c)}),a}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var f="suspendedStart",h="suspendedYield",v="executing",p="completed",m={};function b(){}function w(){}function x(){}var L={};u(L,a,(function(){return this}));var I=Object.getPrototypeOf,A=I&&I(I(O([])));A&&A!==r&&n.call(A,a)&&(L=A);var E=x.prototype=b.prototype=Object.create(L);function j(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,i,a,c){var s=d(t[o],t,i);if("throw"!==s.type){var u=s.arg,l=u.value;return l&&"object"==y(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(l).then((function(t){u.value=t,a(u)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function k(e,r,n){var o=f;return function(i,a){if(o===v)throw Error("Generator is already running");if(o===p){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var s=_(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===f)throw o=p,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var u=d(e,r,n);if("normal"===u.type){if(o=n.done?p:h,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=p,n.method="throw",n.arg=u.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=d(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,m;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function O(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(y(e)+" is not iterable")}return w.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=u(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},j(S.prototype),u(S.prototype,c,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new S(l(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(E),u(E,s,"Generator"),u(E,a,(function(){return this})),u(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=O,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:O(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function m(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return b(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?b(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function w(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}var x=(0,u.bv)(".cc"),L=(0,u.aI)(x,"._k"),I=(0,u.aI)(L,".cl"),A=(0,u.aI)(L,".bl"),E=(0,u.aI)(L,".jl .kl"),j=(0,u.aI)(L,".dl .el"),S=(0,u.aI)(L,".hl .il"),k=(0,u.aI)(x,".dc"),_={},T=!1,P=0,R=0,O=0,M={},N=0,D=!1,F=1e4,G=15e3,z=5e3,Z=15e3,B=!0,C=!1,H=0,q=0,U=!1,Q="",W=!1,Y=0,$=[],J=20;function X(){k.addEventListener("touchstart",(function(){P=Math.round(k.scrollLeft/N)})),k.addEventListener("scroll",(function(t){D=!0;var e=t.target.scrollLeft/N;R=e>P?P+1:P-1;var r=M["g_".concat(P)]||{width:0,offset:0},n=M["g_".concat(R)]||{width:0,offset:0},o=r.width+(n.width-r.width)*Math.abs(e-P),i=-1*(r.offset+(n.offset-r.offset)*Math.abs(e-P))+.5*N-.5*o;tt(O,i,o-J,e),e===R&&(P=Math.round(k.scrollLeft/N),D=!1)}))}function K(){return{width:window.innerWidth,height:window.innerHeight}}function V(){var t=K(),e=t.width,r=t.height;x.style.setProperty("--nd","".concat(e,"px")),x.style.setProperty("--uk","".concat(r,"px"))}function tt(t,e,r,n){x.style.setProperty("--vk",t.toString()),S.style.setProperty("--yk",(r/30).toFixed(5)),j.style.setProperty("--fl","".concat(e.toFixed(5),"px")),j.style.setProperty("--wk",n.toFixed(5))}function et(){var t=(new Date).getTime(),e=0;e=U?-1+(0,i._M)(Q):-1*Math.min(1,Math.max(0,Math.abs(t-H)/Z)),E.style.setProperty("--pa",e.toString()),window.requestAnimationFrame((function(){C&&et()}))}function rt(){var t=(0,c.zx)("i"),e=document.createElement("div");return e.classList.add("ml"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="pl"></div><div class="ql"><div class="nb" code="0"></div><div class="ob" code="0"></div></div>',{element:e,id:t}}function nt(t){var e=(0,c.zx)("i"),r=document.createElement("div");return r.classList.add("hc"),r.id=e,r.setAttribute("stretched","false"),r.innerHTML='<div class="kc"><div class="lc"></div><div class="nc"><div class="sc"><div class="nb" code="0"></div><div class="ob" code="0"></div></div><div class="rc" onclick="bus.route.stretchRouteItemBody(\''.concat(e,"', '").concat(t,"')\">").concat((0,o.Z)("keyboard_arrow_down"),'</div><div class="qc"></div></div></div><div class="xc"><div class="yc"><div class="zc" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 0)" code="0"><div class="gd">').concat((0,o.Z)("directions_bus"),'</div>公車</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 1)" code="1"><div class="gd">').concat((0,o.Z)("departure_board"),'</div>抵達時間</div><div class="zc" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 2)" code="2"><div class="gd">').concat((0,o.Z)("route"),'</div>路線</div><div class="zc" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop\', [\'').concat(e,'\', null, null])"><div class="gd">').concat((0,o.Z)("folder"),'</div>儲存至資料夾</div></div><div class="hd" displayed="true"></div><div class="id" displayed="false"></div><div class="jd" displayed="false"></div></div>'),{element:r,id:e}}function ot(){var t=(0,c.zx)("g"),e=document.createElement("div");e.classList.add("ec"),e.id=t;var r=document.createElement("div");r.classList.add("fc");var n=document.createElement("div");n.classList.add("ll");var o=document.createElement("div");return o.classList.add("gc"),r.appendChild(n),r.appendChild(o),e.appendChild(r),{element:e,id:t}}function it(t,e,r){function n(t,n,i,a){function s(t,e,r){var n=t.getBoundingClientRect(),o=n.top,i=n.left,a=n.bottom,c=n.right,s=window.innerWidth,l=window.innerHeight,d=(0,u.aI)(e,".ql"),f=(0,u.aI)(d,".ob"),h=(0,u.aI)(d,".nb"),v=(0,u.aI)(t,".sc"),p=(0,u.aI)(v,".ob"),y=(0,u.aI)(v,".nb");h.setAttribute("code",r.status.code.toString()),y.setAttribute("code",r.status.code.toString()),y.innerText=r.status.text,a>0&&o<l&&c>0&&i<s?(f.addEventListener("animationend",(function(){f.setAttribute("code",r.status.code.toString()),f.classList.remove("sb")}),{once:!0}),p.addEventListener("animationend",(function(){p.setAttribute("code",r.status.code.toString()),p.innerText=r.status.text,p.classList.remove("sb")}),{once:!0}),f.classList.add("sb"),p.classList.add("sb")):(f.setAttribute("code",r.status.code.toString()),p.setAttribute("code",r.status.code.toString()),p.innerText=r.status.text)}function l(t,e,r){t.setAttribute("segment-buffer",(0,c.xZ)(r.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,c.xZ)(r.segmentBuffer.isSegmentBuffer))}function f(t,e){(0,u.aI)(t,".lc").innerText=e.name}function h(t,e){(0,u.aI)(t,".hd").innerHTML=0===e.buses.length?'<div class="xd">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="kd" on-this-route="'.concat(t.onThisRoute,'"><div class="_d"><div class="ce">').concat((0,o.Z)("directions_bus"),'</div><div class="fe">').concat(t.carNumber,'</div></div><div class="ie"><div class="ke">路線：').concat(t.RouteName,'</div><div class="le">狀態：').concat(t.status.text,'</div><div class="me">類型：').concat(t.type,"</div></div></div>")})).join("")}function p(t,e){(0,u.aI)(t,".id").innerHTML=0===e.overlappingRoutes.length?'<div class="yd">目前沒有路線可顯示</div>':e.overlappingRoutes.map((function(t){return'<div class="ld"><div class="ae"><div class="de">'.concat((0,o.Z)("route"),'</div><div class="ge">').concat(t.name,'</div></div><div class="qe">').concat(t.RouteEndPoints.html,'</div><div class="se"><div class="te" onclick="bus.route.switchRoute(').concat(t.RouteID,", [").concat(t.PathAttributeId.join(","),'])">查看路線</div><div class="te" onclick="bus.folder.openSaveToFolder(\'route\', [').concat(t.RouteID,'])">收藏路線</div></div></div>')})).join("")}function y(t,e){(0,u.aI)(t,".jd").innerHTML=0===e.busArrivalTimes.length?'<div class="zd">目前沒有抵達時間可顯示</div>':e.busArrivalTimes.map((function(t){return'<div class="md"><div class="be"><div class="ee">'.concat((0,o.Z)("schedule"),'</div><div class="he">').concat(t.time,'</div></div><div class="je"><div class="ne">個人化行程：').concat(t.personalSchedule.name,'</div><div class="oe">時段：').concat((0,v.pn)(t.personalSchedule.period.start)," - ").concat((0,v.pn)(t.personalSchedule.period.end),'</div><div class="pe">重複：').concat(t.personalSchedule.days.map((function(t){return(0,v.kd)(t).name})).join("、"),"</div></div></div>")})).join("")}function g(t,e,r){t.setAttribute("nearest",(0,c.xZ)(r.nearest)),e.setAttribute("nearest",(0,c.xZ)(r.nearest))}function m(t,e,r){var n=(null==r?void 0:r.progress)||0,o=(null==e?void 0:e.progress)||0,i=(0,u.aI)(t,".pl");0!==n&&0===o&&Math.abs(o-n)>0?(i.style.setProperty("--nl","".concat(100,"%")),i.style.setProperty("--ol","".concat(100,"%")),i.addEventListener("transitionend",(function(){i.style.setProperty("--nl","".concat(0,"%")),i.style.setProperty("--ol","".concat(0,"%"))}),{once:!0})):(i.style.setProperty("--nl","".concat(0,"%")),i.style.setProperty("--ol","".concat(100*o,"%")))}function b(t,e,r){r&&(t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function w(t,e,r){t.setAttribute("skeleton-screen",(0,c.xZ)(r)),e.setAttribute("skeleton-screen",(0,c.xZ)(r))}function x(t,r){var n=(0,u.aI)(t,'.xc .yc .zc[type="save-to-folder"]');n.setAttribute("onclick","bus.folder.openSaveToFolder('stop', ['".concat(t.id,"', ").concat(r.id,", ").concat(e.RouteID,"])")),(0,d.Gs)("stop",r.id).then((function(t){n.setAttribute("highlighted",(0,c.xZ)(t))}))}null===a?(s(t,n,i),f(t,i),h(t,i),p(t,i),y(t,i),l(t,n,i),g(t,n,i),m(n,i,a),b(t,n,r),w(t,n,r),x(t,i)):(i.status.code===a.status.code&&(0,c.hw)(a.status.text,i.status.text)||s(t,n,i),(0,c.hw)(a.buses,i.buses)||h(t,i),(0,c.hw)(a.busArrivalTimes,i.busArrivalTimes)||y(t,i),(0,c.hw)(a.segmentBuffer,i.segmentBuffer)||l(t,n,i),a.nearest!==i.nearest&&g(t,n,i),a.progress!==i.progress&&m(n,i,a),a.id!==i.id&&(f(t,i),p(t,i),x(t,i)),r!==T&&(b(t,n,r),w(t,n,r)))}var i=K(),a=i.width,l=i.height,f=e.groupQuantity,h=e.itemQuantity,p=e.groupedItems;O=f,N=a;for(var y=0,g=0;g<f;g++){var m=(0,s.q)([e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"往".concat(t)}))[g],500,"17px",'"Noto Sans TC", sans-serif')+J;M["g_".concat(g)]={width:m,offset:y},y+=m}var b=-1*M["g_".concat(P)].offset+.5*N-.5*M["g_".concat(P)].width;D||tt(O,b,M["g_".concat(P)].width-J,P),I.innerHTML="<span>".concat(e.RouteName,"</span>"),t.setAttribute("skeleton-screen",(0,c.xZ)(r)),A.setAttribute("onclick","bus.route.openRouteDetails(".concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),"])"));var w,x,L=(0,u.jg)(t,".dc .ec").length;if(f!==L){var E=L-f;if(E<0)for(var S=0;S<Math.abs(E);S++){var R=ot();k.appendChild(R.element);var F=(w=void 0,x=void 0,w=(0,c.zx)("t"),(x=document.createElement("div")).classList.add("gl"),x.id=w,{element:x,id:w});j.appendChild(F.element)}else for(var G=(0,u.jg)(t,".dc .ec"),z=(0,u.jg)(t,"._k .dl .el .gl"),Z=0;Z<Math.abs(E);Z++){var B=L-1-Z;G[B].remove(),z[B].remove()}}for(var C=0;C<f;C++){var H="g_".concat(C),q=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[C],".gc"),".hc").length;if(h[H]!==q){var U=q-h[H];if(U<0)for(var Q=(0,u.aI)((0,u.jg)(t,".dc .ec")[C],".gc"),W=(0,u.aI)((0,u.jg)(t,".dc .ec")[C],".ll"),Y=0;Y<Math.abs(U);Y++){var $=rt(),X=nt($.id);Q.appendChild(X.element),W.appendChild($.element)}else for(var V=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[C],".gc"),".hc"),et=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[C],".ll"),".ml"),it=0;it<Math.abs(U);it++){var at=q-1-it;V[at].remove(),et[at].remove()}}}for(var ct=0;ct<f;ct++){var st="g_".concat(ct),ut=(0,u.jg)(t,"._k .dl .el .gl")[ct];ut.innerHTML=[e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"<span>往".concat(t,"</span>")}))[ct],ut.style.setProperty("--zk","".concat(M[st].width,"px")),ut.style.setProperty("--xk","".concat(ct));for(var lt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[ct],".gc"),".hc"),dt=(0,u.jg)((0,u.aI)((0,u.jg)(t,".dc .ec")[ct],".ll"),".ml"),ft=0;ft<h[st];ft++){var ht=lt[ft],vt=dt[ft],pt=p[st][ft];if(_.hasOwnProperty("groupedItems"))if(_.groupedItems.hasOwnProperty(st))if(_.groupedItems[st][ft])n(ht,vt,pt,_.groupedItems[st][ft]);else n(ht,vt,pt,null);else n(ht,vt,pt,null);else n(ht,vt,pt,null)}}_=e,T=r}function at(){return ct.apply(this,arguments)}function ct(){var t;return t=g().mark((function t(){var e,r,o;return g().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,a.Js)("refresh_interval"),B=e.dynamic,G=e.baseInterval,U=!0,Q=(0,c.zx)("r"),E.setAttribute("refreshing","true"),t.next=8,(0,n.R)(Y,$,Q);case 8:if(r=t.sent,it(x,r,!1),H=(new Date).getTime(),!B){t.next=18;break}return t.next=14,(0,l.wz)();case 14:o=t.sent,q=Math.max((new Date).getTime()+z,r.dataUpdateTime+G/o),t.next=19;break;case 18:q=(new Date).getTime()+G;case 19:return Z=Math.max(z,q-(new Date).getTime()),U=!1,E.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the route."});case 23:case"end":return t.stop()}}),t)})),ct=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){w(i,n,o,a,c,"next",t)}function c(t){w(i,n,o,a,c,"throw",t)}a(void 0)}))},ct.apply(this,arguments)}function st(){at().then((function(t){C?setTimeout((function(){st()}),Math.max(z,q-(new Date).getTime())):W=!1})).catch((function(t){console.error(t),C?((0,h.a)("（路線）發生網路錯誤，將在".concat(F/1e3,"秒後重試。"),"error"),setTimeout((function(){st()}),F)):W=!1}))}function ut(t,e){(0,f.WR)("Route"),(0,p.XK)("route",t),Y=t,$=e,P=0,x.setAttribute("displayed","true"),(0,u.aI)(x,".dc").scrollLeft=0,function(t){for(var e=K(),r=(e.width,e.height),n=Math.floor(r/50)+5,o={},i=0;i<2;i++){var a="g_".concat(i);o[a]=[];for(var c=0;c<n;c++)o[a].push({name:"",goBack:"0",status:{code:0,text:""},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:c,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}it(t,{groupedItems:o,groupQuantity:2,itemQuantity:{g_0:n,g_1:n},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:null},!0)}(x),C||(C=!0,W?at():(W=!0,st()),et()),(0,f.Z_)()}function lt(){x.setAttribute("displayed","false"),C=!1,(0,f.l$)()}function dt(t,e){C=!1,ut(t,e)}function ft(t,e){var r=(0,u.bv)(".cc .dc .ec .fc .gc .hc#".concat(t)),n=(0,u.bv)(".cc .dc .ec .fc .ll .ml#".concat(e));"true"===r.getAttribute("stretched")?(r.setAttribute("stretched","false"),n.setAttribute("stretched","false")):(r.setAttribute("stretched","true"),n.setAttribute("stretched","true"))}function ht(t,e){var r,n=(0,u.aI)(k,".hc#".concat(t)),o=(0,u.aI)(n,".yc"),i=m((0,u.jg)(o,'.zc[highlighted="true"][type="tab"]'));try{for(i.s();!(r=i.n()).done;){r.value.setAttribute("highlighted","false")}}catch(t){i.e(t)}finally{i.f()}switch((0,u.aI)(o,'.zc[code="'.concat(e,'"]')).setAttribute("highlighted","true"),e){case 0:(0,u.aI)(n,".hd").setAttribute("displayed","true"),(0,u.aI)(n,".id").setAttribute("displayed","flase"),(0,u.aI)(n,".jd").setAttribute("displayed","false");break;case 1:(0,u.aI)(n,".hd").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","false"),(0,u.aI)(n,".jd").setAttribute("displayed","true");break;case 2:(0,u.aI)(n,".hd").setAttribute("displayed","false"),(0,u.aI)(n,".id").setAttribute("displayed","true"),(0,u.aI)(n,".jd").setAttribute("displayed","false")}}},3041:(t,e,r)=>{r.d(e,{BI:()=>y,Dh:()=>b,JL:()=>m,nS:()=>g});var n=r(3648),o=r(904),i=r(8024),a=r(9566),c=r(4537),s=r(9119);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function l(){l=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",s=i.toStringTag||"@@toStringTag";function d(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{d({},"")}catch(t){d=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var i=e&&e.prototype instanceof b?e:b,a=Object.create(i.prototype),c=new R(n||[]);return o(a,"_invoke",{value:k(t,r,c)}),a}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var v="suspendedStart",p="suspendedYield",y="executing",g="completed",m={};function b(){}function w(){}function x(){}var L={};d(L,a,(function(){return this}));var I=Object.getPrototypeOf,A=I&&I(I(O([])));A&&A!==r&&n.call(A,a)&&(L=A);var E=x.prototype=b.prototype=Object.create(L);function j(t){["next","throw","return"].forEach((function(e){d(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,i,a,c){var s=h(t[o],t,i);if("throw"!==s.type){var l=s.arg,d=l.value;return d&&"object"==u(d)&&n.call(d,"__await")?e.resolve(d.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(d).then((function(t){l.value=t,a(l)}),(function(t){return r("throw",t,a,c)}))}c(s.arg)}var i;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return i=i?i.then(o,o):o()}})}function k(e,r,n){var o=v;return function(i,a){if(o===y)throw Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:t,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var s=_(c,n);if(s){if(s===m)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var u=h(e,r,n);if("normal"===u.type){if(o=n.done?g:p,u.arg===m)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=g,n.method="throw",n.arg=u.arg)}}}function _(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,_(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var i=h(o,e.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,m;var a=i.arg;return a?a.done?(r[e.resultName]=a.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function O(e){if(e||""===e){var r=e[a];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,i=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(u(e)+" is not iterable")}return w.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=d(x,s,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,d(t,s,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},j(S.prototype),d(S.prototype,c,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new S(f(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},j(E),d(E,s,"Generator"),d(E,a,(function(){return this})),d(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=O,R.prototype={constructor:R,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),u=n.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,m):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;P(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:O(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function d(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return f(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return a=t.done,t},e:function(t){c=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function h(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}function v(t,e,r){var n=(0,i.zx)("i"),o=document.createElement("div");switch(o.classList.add("yn"),o.id=n,e){case"stop":o.setAttribute("onclick","bus.folder.saveStopItemOnRoute('".concat(r[0],"', '").concat(t.folder.id,"', ").concat(r[1],", ").concat(r[2],")"));break;case"route":o.setAttribute("onclick","bus.folder.saveRouteOnDetailsPage('".concat(t.folder.id,"', ").concat(r[0],")"))}return o.innerHTML='<div class="zn">'.concat((0,c.Z)(t.folder.icon),'</div><div class="_n">').concat(t.folder.name,"</div>"),{element:o,id:n}}function p(){var t;return t=l().mark((function t(e,r){var o,i,c,s,u,f;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=(0,n.bv)(".sn"),(0,n.aI)(o,".wn .xn").innerHTML="",t.next=4,(0,a.Xi)();case 4:i=t.sent,c=d(i);try{for(c.s();!(s=c.n()).done;)u=s.value,f=v(u,e,r),(0,n.aI)(o,".wn .xn").appendChild(f.element)}catch(t){c.e(t)}finally{c.f()}case 7:case"end":return t.stop()}}),t)})),p=function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function a(t){h(i,n,o,a,c,"next",t)}function c(t){h(i,n,o,a,c,"throw",t)}a(void 0)}))},p.apply(this,arguments)}function y(t,e){(0,o.WR)("SaveToFolder"),(0,n.bv)(".sn").setAttribute("displayed","true"),function(t,e){p.apply(this,arguments)}(t,e)}function g(){(0,o.kr)("SaveToFolder"),(0,n.bv)(".sn").setAttribute("displayed","false")}function m(t,e,r,o){var i=(0,n.bv)(".cc .dc .ec .fc .gc .hc#".concat(t)),c=(0,n.aI)(i,'.xc .yc .zc[type="save-to-folder"]');(0,a.aq)(e,r,o).then((function(t){t?(0,a.Gs)("stop",r).then((function(t){t&&(c.setAttribute("highlighted",t),(0,s.a)("已儲存至資料夾","folder"),g())})):(0,s.a)("此資料夾不支援站牌類型項目","warning")}))}function b(t,e){var r=(0,n.bv)('.rl .wl .xl .yl[group="actions"] .bm .cm[action="save-to-folder"]');(0,a.Fq)(t,e).then((function(t){t?(0,a.Gs)("route",e).then((function(t){t&&(r.setAttribute("highlighted","true"),(0,s.a)("已儲存至資料夾","folder"),g())})):(0,s.a)("此資料夾不支援路線類型項目","warning")}))}}}]);
//# sourceMappingURL=32513f20a25471a73d10.js.map
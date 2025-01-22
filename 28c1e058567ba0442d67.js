/*! For license information please see 28c1e058567ba0442d67.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[960],{4690:(e,t,r)=>{r.r(t),r.d(t,{ResizeRouteField:()=>re,closeRoute:()=>he,initializeRouteSliding:()=>ee,openRoute:()=>fe,streamRoute:()=>de,stretchRouteItemBody:()=>ye,switchRoute:()=>ve,switchRouteBodyTab:()=>pe,updateRouteCSS:()=>ne});var n=r(7123),o=r(4537),i=r(6788),a=r(3459),c=r(8024),l=r(7968),s=r(3648),u=r(5767),d=r(9566),f=r(904),h=r(9119),v=r(5579),y=r(5314);function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}function m(){m=function(){return t};var e,t={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(e,t,r){e[t]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function s(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{s({},"")}catch(e){s=function(e,t,r){return e[t]=r}}function u(e,t,r,n){var i=t&&t.prototype instanceof b?t:b,a=Object.create(i.prototype),c=new _(n||[]);return o(a,"_invoke",{value:k(e,r,c)}),a}function d(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=u;var f="suspendedStart",h="suspendedYield",v="executing",y="completed",g={};function b(){}function S(){}function w(){}var A={};s(A,a,(function(){return this}));var L=Object.getPrototypeOf,T=L&&L(L(I([])));T&&T!==r&&n.call(T,a)&&(A=T);var x=w.prototype=b.prototype=Object.create(A);function Q(e){["next","throw","return"].forEach((function(t){s(e,t,(function(e){return this._invoke(t,e)}))}))}function E(e,t){function r(o,i,a,c){var l=d(e[o],e,i);if("throw"!==l.type){var s=l.arg,u=s.value;return u&&"object"==p(u)&&n.call(u,"__await")?t.resolve(u.__await).then((function(e){r("next",e,a,c)}),(function(e){r("throw",e,a,c)})):t.resolve(u).then((function(e){s.value=e,a(s)}),(function(e){return r("throw",e,a,c)}))}c(l.arg)}var i;o(this,"_invoke",{value:function(e,n){function o(){return new t((function(t,o){r(e,n,t,o)}))}return i=i?i.then(o,o):o()}})}function k(t,r,n){var o=f;return function(i,a){if(o===v)throw Error("Generator is already running");if(o===y){if("throw"===i)throw a;return{value:e,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var l=j(c,n);if(l){if(l===g)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===f)throw o=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=v;var s=d(t,r,n);if("normal"===s.type){if(o=n.done?y:h,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=y,n.method="throw",n.arg=s.arg)}}}function j(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,j(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=d(o,t.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function P(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function R(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function _(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(P,this),this.reset(!0)}function I(t){if(t||""===t){var r=t[a];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}throw new TypeError(p(t)+" is not iterable")}return S.prototype=w,o(x,"constructor",{value:w,configurable:!0}),o(w,"constructor",{value:S,configurable:!0}),S.displayName=s(w,l,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===S||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,s(e,l,"GeneratorFunction")),e.prototype=Object.create(x),e},t.awrap=function(e){return{__await:e}},Q(E.prototype),s(E.prototype,c,(function(){return this})),t.AsyncIterator=E,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new E(u(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},Q(x),s(x,l,"Generator"),s(x,a,(function(){return this})),s(x,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=I,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(R),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var l=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(l&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),R(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;R(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:I(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),g}},t}function g(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return b(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?b(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){c=!0,i=e},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}function S(e,t,r,n,o,i,a){try{var c=e[i](a),l=c.value}catch(e){return void r(e)}c.done?t(l):Promise.resolve(l).then(n,o)}var w=(0,s.documentQuerySelector)(".ic"),A=(0,s.elementQuerySelector)(w,".fl"),L=(0,s.elementQuerySelector)(A,".il"),T=(0,s.elementQuerySelector)(A,".hl"),x=(0,s.elementQuerySelector)(A,".pl .ql"),Q=(0,s.elementQuerySelector)(A,".jl"),E=(0,s.elementQuerySelector)(Q,".kl"),k=(0,s.elementQuerySelector)(A,".nl"),j=(0,s.elementQuerySelector)(k,".ol"),P=(0,s.elementQuerySelector)(w,".jc"),R={},_=!0,I=!1,M=0,O=0,F=0,H={},D=0,N=!1,B=1e4,C=15e3,G=5e3,q=15e3,U=!0,z=!1,V=0,W=0,Y=!1,$="",J=!1,K=0,X=[],Z=20;function ee(){P.addEventListener("touchstart",(function(){M=Math.round(P.scrollLeft/D)})),P.addEventListener("scroll",(function(e){N=!0;var t=e.target.scrollLeft/D;O=t>M?M+1:M-1;var r=H["g_".concat(M)]||{width:0,offset:0},n=H["g_".concat(O)]||{width:0,offset:0},o=r.width+(n.width-r.width)*Math.abs(t-M),i=-1*(r.offset+(n.offset-r.offset)*Math.abs(t-M))+.5*D-.5*o;ne(F,i,o-Z,t),t===O&&(M=Math.round(P.scrollLeft/D),N=!1)}))}function te(){return{width:window.innerWidth,height:window.innerHeight}}function re(){var e=te(),t=e.width,r=e.height;w.style.setProperty("--td","".concat(t,"px")),w.style.setProperty("--_k","".concat(r,"px"))}function ne(e,t,r,n){w.style.setProperty("--al",e.toString()),j.style.setProperty("--dl",(r/30).toFixed(5)),E.style.setProperty("--ll","".concat(t.toFixed(5),"px")),E.style.setProperty("--bl",n.toFixed(5))}function oe(){var e=(new Date).getTime(),t=0;t=Y?-1+(0,i.getDataReceivingProgress)($):-1*Math.min(1,Math.max(0,Math.abs(e-V)/q)),x.style.setProperty("--va",t.toString()),window.requestAnimationFrame((function(){z&&oe()}))}function ie(){var e=(0,c.generateIdentifier)("i"),t=document.createElement("div");return t.classList.add("sl"),t.id=e,t.setAttribute("stretched","false"),t.innerHTML='<div class="vl"></div><div class="wl"><div class="tb" code="0"></div><div class="ub" code="0"></div></div>',{element:t,id:e}}function ae(e){var t=(0,c.generateIdentifier)("i"),r=document.createElement("div");return r.classList.add("nc"),r.id=t,r.setAttribute("stretched","false"),r.innerHTML='<div class="qc"><div class="rc"></div><div class="tc"><div class="yc"><div class="tb" code="0"></div><div class="ub" code="0"></div></div><div class="xc" onclick="bus.route.stretchRouteItemBody(\''.concat(t,"', '").concat(e,"')\">").concat((0,o.getIconHTML)("keyboard_arrow_down"),'</div><div class="wc"></div></div></div><div class="cd"><div class="dd"><div class="ed" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(t,'\', 0)" code="0"><div class="md">').concat((0,o.getIconHTML)("directions_bus"),'</div>公車</div><div class="ed" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(t,'\', 1)" code="1"><div class="md">').concat((0,o.getIconHTML)("departure_board"),'</div>抵達時間</div><div class="ed" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(t,'\', 2)" code="2"><div class="md">').concat((0,o.getIconHTML)("route"),'</div>路線</div><div class="ed" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop\', [\'').concat(t,'\', null, null])"><div class="md">').concat((0,o.getIconHTML)("folder"),'</div>儲存至資料夾</div></div><div class="nd" displayed="true"></div><div class="od" displayed="false"></div><div class="pd" displayed="false"></div></div>'),{element:r,id:t}}function ce(){var e=(0,c.generateIdentifier)("g"),t=document.createElement("div");t.classList.add("kc"),t.id=e;var r=document.createElement("div");r.classList.add("lc");var n=document.createElement("div");n.classList.add("rl");var o=document.createElement("div");return o.classList.add("mc"),r.appendChild(n),r.appendChild(o),t.appendChild(r),{element:t,id:e}}function le(e,t,r,n){function i(e,i,a,l){function u(e,t,r,n){var o=e.getBoundingClientRect(),i=o.top,a=o.left,c=o.bottom,l=o.right,u=window.innerWidth,d=window.innerHeight,f=(0,s.elementQuerySelector)(t,".wl"),h=(0,s.elementQuerySelector)(f,".ub"),v=(0,s.elementQuerySelector)(f,".tb"),y=(0,s.elementQuerySelector)(e,".yc"),p=(0,s.elementQuerySelector)(y,".ub"),m=(0,s.elementQuerySelector)(y,".tb");v.setAttribute("code",r.status.code.toString()),m.setAttribute("code",r.status.code.toString()),m.innerText=r.status.text,n&&c>0&&i<d&&l>0&&a<u?(h.addEventListener("animationend",(function(){h.setAttribute("code",r.status.code.toString()),h.classList.remove("yb")}),{once:!0}),p.addEventListener("animationend",(function(){p.setAttribute("code",r.status.code.toString()),p.innerText=r.status.text,p.classList.remove("yb")}),{once:!0}),h.classList.add("yb"),p.classList.add("yb")):(h.setAttribute("code",r.status.code.toString()),p.setAttribute("code",r.status.code.toString()),p.innerText=r.status.text)}function f(e,t,r){e.setAttribute("segment-buffer",(0,c.booleanToString)(r.segmentBuffer.isSegmentBuffer)),t.setAttribute("segment-buffer",(0,c.booleanToString)(r.segmentBuffer.isSegmentBuffer))}function h(e,t){(0,s.elementQuerySelector)(e,".rc").innerText=t.name}function y(e,t){(0,s.elementQuerySelector)(e,".nd").innerHTML=0===t.buses.length?'<div class="ce">目前沒有公車可顯示</div>':t.buses.map((function(e){return'<div class="qd" on-this-route="'.concat(e.onThisRoute,'"><div class="fe"><div class="ie">').concat((0,o.getIconHTML)("directions_bus"),'</div><div class="le">').concat(e.carNumber,'</div></div><div class="oe"><div class="qe">路線：').concat(e.RouteName,'</div><div class="re">狀態：').concat(e.status.text,'</div><div class="se">類型：').concat(e.type,"</div></div></div>")})).join("")}function p(e,t){(0,s.elementQuerySelector)(e,".od").innerHTML=0===t.overlappingRoutes.length?'<div class="de">目前沒有路線可顯示</div>':t.overlappingRoutes.map((function(e){return'<div class="rd"><div class="ge"><div class="je">'.concat((0,o.getIconHTML)("route"),'</div><div class="me">').concat(e.name,'</div></div><div class="we">').concat(e.RouteEndPoints.html,'</div><div class="ye"><div class="ze" onclick="bus.route.switchRoute(').concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),'])">查看路線</div><div class="ze" onclick="bus.folder.openSaveToFolder(\'route\', [').concat(e.RouteID,'])">收藏路線</div></div></div>')})).join("")}function m(e,t){(0,s.elementQuerySelector)(e,".pd").innerHTML=0===t.busArrivalTimes.length?'<div class="ee">目前沒有抵達時間可顯示</div>':t.busArrivalTimes.map((function(e){return'<div class="sd"><div class="he"><div class="ke">'.concat((0,o.getIconHTML)("schedule"),'</div><div class="ne">').concat(e.time,'</div></div><div class="pe"><div class="te">個人化行程：').concat(e.personalSchedule.name,'</div><div class="ue">時段：').concat((0,v.timeObjectToString)(e.personalSchedule.period.start)," - ").concat((0,v.timeObjectToString)(e.personalSchedule.period.end),'</div><div class="ve">重複：').concat(e.personalSchedule.days.map((function(e){return(0,v.indexToDay)(e).name})).join("、"),"</div></div></div>")})).join("")}function g(e,t,r){e.setAttribute("nearest",(0,c.booleanToString)(r.nearest)),t.setAttribute("nearest",(0,c.booleanToString)(r.nearest))}function b(e,t,r,n){var o=(null==r?void 0:r.progress)||0,i=(null==t?void 0:t.progress)||0,a=(0,s.elementQuerySelector)(e,".vl");n&&0!==o&&0===i&&Math.abs(i-o)>0?(a.style.setProperty("--tl","".concat(100,"%")),a.style.setProperty("--ul","".concat(100,"%")),a.addEventListener("transitionend",(function(){a.style.setProperty("--tl","".concat(0,"%")),a.style.setProperty("--ul","".concat(0,"%"))}),{once:!0})):(a.style.setProperty("--tl","".concat(0,"%")),a.style.setProperty("--ul","".concat(100*i,"%")))}function S(e,t,r){r&&(e.setAttribute("stretched","false"),t.setAttribute("stretched","false"))}function w(e,t,r){e.setAttribute("animation",(0,c.booleanToString)(r)),t.setAttribute("animation",(0,c.booleanToString)(r))}function A(e,t,r){e.setAttribute("skeleton-screen",(0,c.booleanToString)(r)),t.setAttribute("skeleton-screen",(0,c.booleanToString)(r))}function L(e,r){var n=(0,s.elementQuerySelector)(e,'.cd .dd .ed[type="save-to-folder"]');n.setAttribute("onclick","bus.folder.openSaveToFolder('stop', ['".concat(e.id,"', ").concat(r.id,", ").concat(t.RouteID,"])")),(0,d.isSaved)("stop",r.id).then((function(e){n.setAttribute("highlighted",(0,c.booleanToString)(e))}))}null===l?(u(e,i,a,n),h(e,a),y(e,a),p(e,a),m(e,a),f(e,i,a),g(e,i,a),b(i,a,l,n),S(e,i,r),w(e,i,n),A(e,i,r),L(e,a)):(a.status.code===l.status.code&&(0,c.compareThings)(l.status.text,a.status.text)||u(e,i,a,n),(0,c.compareThings)(l.buses,a.buses)||y(e,a),(0,c.compareThings)(l.busArrivalTimes,a.busArrivalTimes)||m(e,a),(0,c.compareThings)(l.segmentBuffer,a.segmentBuffer)||f(e,i,a),l.nearest!==a.nearest&&g(e,i,a),l.progress!==a.progress&&b(i,a,l,n),l.id!==a.id&&(h(e,a),p(e,a),L(e,a)),n!==_&&w(e,i,n),r!==I&&(S(e,i,r),A(e,i,r)))}var a=te(),u=a.width,f=a.height,h=t.groupQuantity,y=t.itemQuantity,p=t.groupedItems;F=h,D=u;for(var m=0,g=0;g<h;g++){var b=(0,l.getTextWidth)([t.RouteEndPoints.RouteDestination,t.RouteEndPoints.RouteDeparture,""].map((function(e){return"往".concat(e)}))[g],500,"17px",'"Noto Sans TC", sans-serif')+Z;H["g_".concat(g)]={width:b,offset:m},m+=b}var S=-1*H["g_".concat(M)].offset+.5*D-.5*H["g_".concat(M)].width;N||ne(F,S,H["g_".concat(M)].width-Z,M),L.innerHTML="<span>".concat(t.RouteName,"</span>"),L.setAttribute("animation",(0,c.booleanToString)(n)),L.setAttribute("skeleton-screen",(0,c.booleanToString)(r)),Q.setAttribute("animation",(0,c.booleanToString)(n)),Q.setAttribute("skeleton-screen",(0,c.booleanToString)(r)),k.setAttribute("animation",(0,c.booleanToString)(n)),k.setAttribute("skeleton-screen",(0,c.booleanToString)(r)),T.setAttribute("onclick","bus.route.openRouteDetails(".concat(t.RouteID,", [").concat(t.PathAttributeId.join(","),"])"));var w,A,x=(0,s.elementQuerySelectorAll)(e,".jc .kc").length;if(h!==x){var j=x-h;if(j<0)for(var O=0;O<Math.abs(j);O++){var B=ce();P.appendChild(B.element);var C=(w=void 0,A=void 0,w=(0,c.generateIdentifier)("t"),(A=document.createElement("div")).classList.add("ml"),A.id=w,{element:A,id:w});E.appendChild(C.element)}else for(var G=(0,s.elementQuerySelectorAll)(e,".jc .kc"),q=(0,s.elementQuerySelectorAll)(e,".fl .jl .kl .ml"),U=0;U<Math.abs(j);U++){var z=x-1-U;G[z].remove(),q[z].remove()}}for(var V=0;V<h;V++){var W="g_".concat(V),Y=(0,s.elementQuerySelectorAll)((0,s.elementQuerySelector)((0,s.elementQuerySelectorAll)(e,".jc .kc")[V],".mc"),".nc").length;if(y[W]!==Y){var $=Y-y[W];if($<0)for(var J=(0,s.elementQuerySelector)((0,s.elementQuerySelectorAll)(e,".jc .kc")[V],".mc"),K=(0,s.elementQuerySelector)((0,s.elementQuerySelectorAll)(e,".jc .kc")[V],".rl"),X=0;X<Math.abs($);X++){var ee=ie(),re=ae(ee.id);J.appendChild(re.element),K.appendChild(ee.element)}else for(var oe=(0,s.elementQuerySelectorAll)((0,s.elementQuerySelector)((0,s.elementQuerySelectorAll)(e,".jc .kc")[V],".mc"),".nc"),le=(0,s.elementQuerySelectorAll)((0,s.elementQuerySelector)((0,s.elementQuerySelectorAll)(e,".jc .kc")[V],".rl"),".sl"),se=0;se<Math.abs($);se++){var ue=Y-1-se;oe[ue].remove(),le[ue].remove()}}}for(var de=0;de<h;de++){var fe="g_".concat(de),he=(0,s.elementQuerySelectorAll)(e,".fl .jl .kl .ml")[de];he.innerHTML=[t.RouteEndPoints.RouteDestination,t.RouteEndPoints.RouteDeparture,""].map((function(e){return"<span>往".concat(e,"</span>")}))[de],he.style.setProperty("--el","".concat(H[fe].width,"px")),he.style.setProperty("--cl","".concat(de));for(var ve=(0,s.elementQuerySelectorAll)((0,s.elementQuerySelector)((0,s.elementQuerySelectorAll)(e,".jc .kc")[de],".mc"),".nc"),ye=(0,s.elementQuerySelectorAll)((0,s.elementQuerySelector)((0,s.elementQuerySelectorAll)(e,".jc .kc")[de],".rl"),".sl"),pe=0;pe<y[fe];pe++){var me=ve[pe],ge=ye[pe],be=p[fe][pe];if(R.hasOwnProperty("groupedItems"))if(R.groupedItems.hasOwnProperty(fe))if(R.groupedItems[fe][pe])i(me,ge,be,R.groupedItems[fe][pe]);else i(me,ge,be,null);else i(me,ge,be,null);else i(me,ge,be,null)}}R=t,_=n,I=r}function se(){return ue.apply(this,arguments)}function ue(){var e;return e=m().mark((function e(){var t,r,o,i;return m().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=(0,a.getSettingOptionValue)("playing_animation"),r=(0,a.getSettingOptionValue)("refresh_interval"),U=r.dynamic,C=r.baseInterval,Y=!0,$=(0,c.generateIdentifier)("r"),x.setAttribute("refreshing","true"),e.next=9,(0,n.integrateRoute)(K,X,$);case 9:if(o=e.sent,le(w,o,!1,t),V=(new Date).getTime(),!U){e.next=19;break}return e.next=15,(0,u.getUpdateRate)();case 15:i=e.sent,W=Math.max((new Date).getTime()+G,o.dataUpdateTime+C/i),e.next=20;break;case 19:W=(new Date).getTime()+C;case 20:return q=Math.max(G,W-(new Date).getTime()),Y=!1,x.setAttribute("refreshing","false"),e.abrupt("return",{status:"Successfully refreshed the route."});case 24:case"end":return e.stop()}}),e)})),ue=function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){S(i,n,o,a,c,"next",e)}function c(e){S(i,n,o,a,c,"throw",e)}a(void 0)}))},ue.apply(this,arguments)}function de(){se().then((function(e){z?setTimeout((function(){de()}),Math.max(G,W-(new Date).getTime())):J=!1})).catch((function(e){console.error(e),z?((0,h.promptMessage)("（路線）發生網路錯誤，將在".concat(B/1e3,"秒後重試。"),"error"),setTimeout((function(){de()}),B)):J=!1}))}function fe(e,t){(0,f.pushPageHistory)("Route"),(0,y.logRecentView)("route",e),K=e,X=t,M=0,w.setAttribute("displayed","true"),(0,s.elementQuerySelector)(w,".jc").scrollLeft=0,function(e){for(var t=(0,a.getSettingOptionValue)("playing_animation"),r=te(),n=(r.width,r.height),o=Math.floor(n/50)+5,i={},c=0;c<2;c++){var l="g_".concat(c);i[l]=[];for(var s=0;s<o;s++)i[l].push({name:"",goBack:"0",status:{code:0,text:""},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:s,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}le(e,{groupedItems:i,groupQuantity:2,itemQuantity:{g_0:o,g_1:o},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:null},!0,t)}(w),z||(z=!0,J?se():(J=!0,de()),oe()),(0,f.closePreviousPage)()}function he(){w.setAttribute("displayed","false"),z=!1,(0,f.openPreviousPage)()}function ve(e,t){z=!1,fe(e,t)}function ye(e,t){var r=(0,s.documentQuerySelector)(".ic .jc .kc .lc .mc .nc#".concat(e)),n=(0,s.documentQuerySelector)(".ic .jc .kc .lc .rl .sl#".concat(t));"true"===r.getAttribute("stretched")?(r.setAttribute("stretched","false"),n.setAttribute("stretched","false")):(r.setAttribute("stretched","true"),n.setAttribute("stretched","true"))}function pe(e,t){var r,n=(0,s.elementQuerySelector)(P,".nc#".concat(e)),o=(0,s.elementQuerySelector)(n,".dd"),i=g((0,s.elementQuerySelectorAll)(o,'.ed[highlighted="true"][type="tab"]'));try{for(i.s();!(r=i.n()).done;){r.value.setAttribute("highlighted","false")}}catch(e){i.e(e)}finally{i.f()}switch((0,s.elementQuerySelector)(o,'.ed[code="'.concat(t,'"]')).setAttribute("highlighted","true"),t){case 0:(0,s.elementQuerySelector)(n,".nd").setAttribute("displayed","true"),(0,s.elementQuerySelector)(n,".od").setAttribute("displayed","flase"),(0,s.elementQuerySelector)(n,".pd").setAttribute("displayed","false");break;case 1:(0,s.elementQuerySelector)(n,".nd").setAttribute("displayed","false"),(0,s.elementQuerySelector)(n,".od").setAttribute("displayed","false"),(0,s.elementQuerySelector)(n,".od").setAttribute("displayed","false"),(0,s.elementQuerySelector)(n,".pd").setAttribute("displayed","true");break;case 2:(0,s.elementQuerySelector)(n,".nd").setAttribute("displayed","false"),(0,s.elementQuerySelector)(n,".od").setAttribute("displayed","true"),(0,s.elementQuerySelector)(n,".pd").setAttribute("displayed","false")}}},3041:(e,t,r)=>{r.r(t),r.d(t,{closeSaveToFolder:()=>m,openSaveToFolder:()=>p,saveRouteOnDetailsPage:()=>b,saveStopItemOnRoute:()=>g});var n=r(3648),o=r(904),i=r(8024),a=r(9566),c=r(4537),l=r(9119);function s(e){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},s(e)}function u(){u=function(){return t};var e,t={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(e,t,r){e[t]=r.value},i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function d(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{d({},"")}catch(e){d=function(e,t,r){return e[t]=r}}function f(e,t,r,n){var i=t&&t.prototype instanceof b?t:b,a=Object.create(i.prototype),c=new _(n||[]);return o(a,"_invoke",{value:k(e,r,c)}),a}function h(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=f;var v="suspendedStart",y="suspendedYield",p="executing",m="completed",g={};function b(){}function S(){}function w(){}var A={};d(A,a,(function(){return this}));var L=Object.getPrototypeOf,T=L&&L(L(I([])));T&&T!==r&&n.call(T,a)&&(A=T);var x=w.prototype=b.prototype=Object.create(A);function Q(e){["next","throw","return"].forEach((function(t){d(e,t,(function(e){return this._invoke(t,e)}))}))}function E(e,t){function r(o,i,a,c){var l=h(e[o],e,i);if("throw"!==l.type){var u=l.arg,d=u.value;return d&&"object"==s(d)&&n.call(d,"__await")?t.resolve(d.__await).then((function(e){r("next",e,a,c)}),(function(e){r("throw",e,a,c)})):t.resolve(d).then((function(e){u.value=e,a(u)}),(function(e){return r("throw",e,a,c)}))}c(l.arg)}var i;o(this,"_invoke",{value:function(e,n){function o(){return new t((function(t,o){r(e,n,t,o)}))}return i=i?i.then(o,o):o()}})}function k(t,r,n){var o=v;return function(i,a){if(o===p)throw Error("Generator is already running");if(o===m){if("throw"===i)throw a;return{value:e,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var l=j(c,n);if(l){if(l===g)continue;return l}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=p;var s=h(t,r,n);if("normal"===s.type){if(o=n.done?m:y,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function j(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,j(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var i=h(o,t.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,g;var a=i.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,g):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function P(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function R(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function _(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(P,this),this.reset(!0)}function I(t){if(t||""===t){var r=t[a];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}throw new TypeError(s(t)+" is not iterable")}return S.prototype=w,o(x,"constructor",{value:w,configurable:!0}),o(w,"constructor",{value:S,configurable:!0}),S.displayName=d(w,l,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===S||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,d(e,l,"GeneratorFunction")),e.prototype=Object.create(x),e},t.awrap=function(e){return{__await:e}},Q(E.prototype),d(E.prototype,c,(function(){return this})),t.AsyncIterator=E,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new E(f(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},Q(x),d(x,l,"Generator"),d(x,a,(function(){return this})),d(x,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=I,_.prototype={constructor:_,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(R),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var l=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(l&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(l){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,g):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),g},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),R(r),g}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;R(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:I(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),g}},t}function d(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return f(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,o=function(){};return{s:o,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,c=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return a=e.done,e},e:function(e){c=!0,i=e},f:function(){try{a||null==r.return||r.return()}finally{if(c)throw i}}}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}function h(e,t,r,n,o,i,a){try{var c=e[i](a),l=c.value}catch(e){return void r(e)}c.done?t(l):Promise.resolve(l).then(n,o)}function v(e,t,r){var n=(0,i.generateIdentifier)("i"),o=document.createElement("div");switch(o.classList.add("do"),o.id=n,t){case"stop":o.setAttribute("onclick","bus.folder.saveStopItemOnRoute('".concat(r[0],"', '").concat(e.folder.id,"', ").concat(r[1],", ").concat(r[2],")"));break;case"route":o.setAttribute("onclick","bus.folder.saveRouteOnDetailsPage('".concat(e.folder.id,"', ").concat(r[0],")"))}return o.innerHTML='<div class="eo">'.concat((0,c.getIconHTML)(e.folder.icon),'</div><div class="fo">').concat(e.folder.name,"</div>"),{element:o,id:n}}function y(){var e;return e=u().mark((function e(t,r){var o,i,c,l,s,f;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=(0,n.documentQuerySelector)(".yn"),(0,n.elementQuerySelector)(o,".bo .co").innerHTML="",e.next=4,(0,a.listFoldersWithContent)();case 4:i=e.sent,c=d(i);try{for(c.s();!(l=c.n()).done;)s=l.value,f=v(s,t,r),(0,n.elementQuerySelector)(o,".bo .co").appendChild(f.element)}catch(e){c.e(e)}finally{c.f()}case 7:case"end":return e.stop()}}),e)})),y=function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){h(i,n,o,a,c,"next",e)}function c(e){h(i,n,o,a,c,"throw",e)}a(void 0)}))},y.apply(this,arguments)}function p(e,t){(0,o.pushPageHistory)("SaveToFolder"),(0,n.documentQuerySelector)(".yn").setAttribute("displayed","true"),function(e,t){y.apply(this,arguments)}(e,t)}function m(){(0,o.revokePageHistory)("SaveToFolder"),(0,n.documentQuerySelector)(".yn").setAttribute("displayed","false")}function g(e,t,r,o){var i=(0,n.documentQuerySelector)(".ic .jc .kc .lc .mc .nc#".concat(e)),c=(0,n.elementQuerySelector)(i,'.cd .dd .ed[type="save-to-folder"]');(0,a.saveStop)(t,r,o).then((function(e){e?(0,a.isSaved)("stop",r).then((function(e){e&&(c.setAttribute("highlighted",e),(0,l.promptMessage)("已儲存至資料夾","folder"),m())})):(0,l.promptMessage)("此資料夾不支援站牌類型項目","warning")}))}function b(e,t){var r=(0,n.documentQuerySelector)('.xl .bm .cm .dm[group="actions"] .hm .im[action="save-to-folder"]');(0,a.saveRoute)(e,t).then((function(e){e?(0,a.isSaved)("route",t).then((function(e){e&&(r.setAttribute("highlighted","true"),(0,l.promptMessage)("已儲存至資料夾","folder"),m())})):(0,l.promptMessage)("此資料夾不支援路線類型項目","warning")}))}}}]);
//# sourceMappingURL=28c1e058567ba0442d67.js.map
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[466],{4690:(t,e,n)=>{n.d(e,{Ch:()=>mt,S5:()=>et,SR:()=>vt,U7:()=>ft,aB:()=>nt,py:()=>pt,q0:()=>ht});var i=n(7123),a=n(4537),s=n(6788),o=n(3459),r=n(8024),c=n(7968),d=n(3648),u=n(5767),l=n(9566),v=n(904),f=n(9119),m=n(5579),h=n(5314),p=n(4636);function g(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return b(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?b(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var i=0,a=function(){};return{s:a,n:function(){return i>=t.length?{done:!0}:{done:!1,value:t[i++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,o=!0,r=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){r=!0,s=t},f:function(){try{o||null==n.return||n.return()}finally{if(r)throw s}}}}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=Array(e);n<e;n++)i[n]=t[n];return i}function y(t,e,n,i,a,s,o){try{var r=t[s](o),c=r.value}catch(t){return void n(t)}r.done?e(c):Promise.resolve(c).then(i,a)}var k=(0,d.bv)(".jk"),A=(0,d.aI)(k,"._l"),I=(0,d.aI)(A,".cm"),w=(0,d.aI)(A,".bm"),x=(0,d.aI)(A,".jm .km"),R=(0,d.aI)(A,".dm"),_=(0,d.aI)(R,".em"),j=(0,d.aI)(A,".hm"),T=(0,d.aI)(j,".im"),P=(0,d.aI)(k,".kk"),L={},S=!0,Z=!1,M=0,E=0,D=0,B={},C=0,z=!1,F=1e4,H=15e3,q=5e3,N=15e3,O=!0,Q=!1,U=0,J=0,W=!1,$="",K=-1,X=-1,G=!1,V=0,Y=[],tt=20;function et(){P.addEventListener("touchstart",(function(){M=Math.round(P.scrollLeft/C)}),{passive:!0}),P.addEventListener("scroll",(function(t){z=!0;var e=t.target.scrollLeft/C;E=e>M?M+1:M-1;var n=B["g_".concat(M)]||{width:0,offset:0},i=B["g_".concat(E)]||{width:0,offset:0},a=n.width+(i.width-n.width)*Math.abs(e-M),s=-1*(n.offset+(i.offset-n.offset)*Math.abs(e-M))+.5*C-.5*a;it(D,s,a-tt,e),e===E&&(M=Math.round(P.scrollLeft/C),z=!1)}),{passive:!0})}function nt(){var t=(0,v.gO)("window"),e=t.width,n=t.height;k.style.setProperty("--gk","".concat(e,"px")),k.style.setProperty("--hk","".concat(n,"px"))}function it(t,e,n,i){P.style.setProperty("--ik",t.toString()),T.style.setProperty("--yl",(n/10).toString()),_.style.setProperty("--fm","".concat(e.toFixed(5),"px")),_.style.setProperty("--wl",i.toFixed(5))}function at(){var t=(new Date).getTime();W?(X=-1+(0,s._M)($),K+=.1*(X-K)):(X=-1*Math.min(1,Math.max(0,Math.abs(t-U)/N)),K=X),x.style.setProperty("--z",K.toString()),window.requestAnimationFrame((function(){Q&&at()}))}function st(){var t=(0,r.zx)("i"),e=document.createElement("div");return e.classList.add("lm"),e.id=t,e.setAttribute("stretched","false"),e.innerHTML='<div class="qm"></div><div class="tm"><div class="ia" code="0"></div><div class="ja" code="0"></div></div>',{element:e,id:t}}function ot(t){var e=(0,r.zx)("i"),n=document.createElement("div");return n.classList.add("wm"),n.id=e,n.setAttribute("stretched","false"),n.innerHTML='<div class="xm"><div class="ym"></div><div class="zm"><div class="_m"><div class="ia" code="0"></div><div class="ja" code="0"></div></div><div class="an" onclick="bus.route.stretchRouteItemBody(\''.concat(e,"', '").concat(t,"')\">").concat((0,a.Z)("keyboard_arrow_down"),'</div><div class="bn"></div></div></div><div class="cn" displayed="false"><div class="dn"><div class="en" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 0)" code="0"><div class="fn">').concat((0,a.Z)("directions_bus"),'</div>公車</div><div class="en" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 1)" code="1"><div class="fn">').concat((0,a.Z)("departure_board"),'</div>抵達時間</div><div class="en" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab(\'').concat(e,'\', 2)" code="2"><div class="fn">').concat((0,a.Z)("route"),'</div>路線</div><div class="en" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder(\'stop-on-route\', [\'').concat(e,'\', null, null])"><div class="fn">').concat((0,a.Z)("folder"),'</div>儲存至資料夾</div><div class="en" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification(\'stop-on-route\', [\'').concat(e,'\', null, null, null])" enabled="true"><div class="fn">').concat((0,a.Z)("notifications"),'</div>設定到站通知</div></div><div class="gn" displayed="true"></div><div class="hn" displayed="false"></div><div class="in" displayed="false"></div></div>'),{element:n,id:e}}function rt(){var t=document.createElement("div");t.classList.add("lk");var e=document.createElement("div");e.classList.add("mk");var n=document.createElement("div");n.classList.add("nk");var i=document.createElement("div");return i.classList.add("ok"),e.appendChild(n),e.appendChild(i),t.appendChild(e),{element:t,id:""}}function ct(t,e,n,i){function s(t,s,o,c){function u(t,e,n,i,a){var s=(0,d.aI)(e,".tm"),o=(0,d.aI)(s,".ja"),r=(0,d.aI)(s,".ia"),c=(0,d.aI)(t,"._m"),u=(0,d.aI)(c,".ja"),l=(0,d.aI)(c,".ia");if(r.setAttribute("code",n.status.code.toString()),l.setAttribute("code",n.status.code.toString()),l.innerText=n.status.text,!a){var v=t.getBoundingClientRect(),f=v.top,m=v.left,h=v.bottom,p=v.right,g=window.innerWidth,b=window.innerHeight;if(i&&h>0&&f<b&&p>0&&m<g)return o.addEventListener("animationend",(function(){o.setAttribute("code",n.status.code.toString()),o.classList.remove("_a")}),{once:!0}),u.addEventListener("animationend",(function(){u.setAttribute("code",n.status.code.toString()),u.innerText=n.status.text,u.classList.remove("_a")}),{once:!0}),o.classList.add("_a"),void u.classList.add("_a")}o.setAttribute("code",n.status.code.toString()),u.setAttribute("code",n.status.code.toString()),u.innerText=n.status.text}function v(t,e,n){t.setAttribute("segment-buffer",(0,r.xZ)(n.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,r.xZ)(n.segmentBuffer.isSegmentBuffer))}function f(t,e){(0,d.aI)(t,".ym").innerText=e.name}function h(t,e){(0,d.aI)(t,".gn").innerHTML=0===e.buses.length?'<div class="jn">目前沒有公車可顯示</div>':e.buses.map((function(t){return'<div class="kn" on-this-route="'.concat(t.onThisRoute,'"><div class="ln"><div class="mn">').concat((0,a.Z)("directions_bus"),'</div><div class="nn">').concat(t.carNumber,'</div></div><div class="on"><div class="pn">路線：').concat(t.RouteName,'</div><div class="qn">狀態：').concat(t.status.text,'</div><div class="rn">類型：').concat(t.type,"</div></div></div>")})).join("")}function g(t,e){(0,d.aI)(t,".hn").innerHTML=0===e.overlappingRoutes.length?'<div class="sn">目前沒有路線可顯示</div>':e.overlappingRoutes.map((function(t){return'<div class="tn"><div class="un"><div class="vn">'.concat((0,a.Z)("route"),'</div><div class="wn">').concat(t.name,'</div></div><div class="xn">').concat(t.RouteEndPoints.html,'</div><div class="yn"><div class="zn" onclick="bus.route.switchRoute(').concat(t.RouteID,", [").concat(t.PathAttributeId.join(","),'])">查看路線</div><div class="zn" onclick="bus.folder.openSaveToFolder(\'route-on-route\', [').concat(t.RouteID,'])">收藏路線</div></div></div>')})).join("")}function b(t,e){(0,d.aI)(t,".in").innerHTML=0===e.busArrivalTimes.length?'<div class="_n">目前沒有抵達時間可顯示</div>':e.busArrivalTimes.map((function(t){return'<div class="ao"><div class="bo"><div class="co">'.concat((0,a.Z)("calendar_view_day"),'</div><div class="do">').concat(t.personalSchedule.name,'</div><div class="eo">週').concat((0,m.kd)(t.day).name," ").concat((0,m.pn)(t.personalSchedule.period.start)," - ").concat((0,m.pn)(t.personalSchedule.period.end),'</div></div><div class="fo">').concat(t.chart,"</div></div>")})).join("")}function y(t,e,n){t.setAttribute("nearest",(0,r.xZ)(n.nearest)),e.setAttribute("nearest",(0,r.xZ)(n.nearest))}function k(t,e,n,i,a){var s=(null==n?void 0:n.progress)||0,o=(null==e?void 0:e.progress)||0,r=(0,d.aI)(t,".qm");i&&0!==s&&0===o&&Math.abs(o-s)>0?(r.style.setProperty("--om","".concat(100,"%")),r.style.setProperty("--pm","".concat(100,"%")),r.addEventListener("transitionend",(function(){r.style.setProperty("--om","".concat(0,"%")),r.style.setProperty("--pm","".concat(0,"%"))}),{once:!0})):(r.style.setProperty("--om","".concat(0,"%")),r.style.setProperty("--pm","".concat(100*o,"%")))}function A(t,e,n){n&&((0,d.aI)(t,".cn").setAttribute("displayed","false"),t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function I(t,e,n){t.setAttribute("animation",(0,r.xZ)(n)),e.setAttribute("animation",(0,r.xZ)(n))}function w(t,e,n){t.setAttribute("skeleton-screen",(0,r.xZ)(n)),e.setAttribute("skeleton-screen",(0,r.xZ)(n))}function x(t,n){var i=(0,d.aI)(t,'.cn .dn .en[type="save-to-folder"]');i.setAttribute("onclick","bus.folder.openSaveToFolder('stop-on-route', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,"])")),(0,l.LH)("stop",n.id).then((function(t){i.setAttribute("highlighted",(0,r.xZ)(t))}))}function R(t,n){var i=(0,d.aI)(t,'.cn .dn .en[type="schedule-notification"]');i.setAttribute("onclick","bus.notification.openScheduleNotification('stop-on-route', ['".concat(t.id,"', ").concat(n.id,", ").concat(e.RouteID,", ").concat(n.status.time,"])"));var a=(0,p.Zc)(n.id);i.setAttribute("highlighted",(0,r.xZ)(a))}null===c?(u(t,s,o,i,n),f(t,o),h(t,o),g(t,o),b(t,o),v(t,s,o),y(t,s,o),k(s,o,c,i),A(t,s,n),I(t,s,i),w(t,s,n),x(t,o),R(t,o)):(o.status.time!==c.status.time&&(u(t,s,o,i),R(t,o)),(0,r.hw)(c.buses,o.buses)||h(t,o),(0,r.hw)(c.busArrivalTimes,o.busArrivalTimes)||b(t,o),(0,r.hw)(c.segmentBuffer,o.segmentBuffer)||v(t,s,o),c.nearest!==o.nearest&&y(t,s,o),c.progress!==o.progress&&k(s,o,c,i),c.id!==o.id&&(f(t,o),g(t,o),x(t,o),R(t,o)),i!==S&&I(t,s,i),n!==Z&&(A(t,s,n),w(t,s,n)))}var o=(0,v.gO)("window"),u=o.width,f=o.height,h=e.groupQuantity,g=e.itemQuantity,b=e.groupedItems;D=h,C=u;for(var y=0,k=0;k<h;k++){var A=(0,c.q_)([e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"往".concat(t)}))[k],500,"17px",'"Noto Sans TC", sans-serif')+tt;B["g_".concat(k)]={width:A,offset:y},y+=A}var x=-1*B["g_".concat(M)].offset+.5*C-.5*B["g_".concat(M)].width;z||it(D,x,B["g_".concat(M)].width-tt,M),I.innerHTML="<span>".concat(e.RouteName,"</span>"),I.setAttribute("animation",(0,r.xZ)(i)),I.setAttribute("skeleton-screen",(0,r.xZ)(n)),R.setAttribute("animation",(0,r.xZ)(i)),R.setAttribute("skeleton-screen",(0,r.xZ)(n)),j.setAttribute("animation",(0,r.xZ)(i)),j.setAttribute("skeleton-screen",(0,r.xZ)(n)),w.setAttribute("onclick","bus.route.openRouteDetails(".concat(e.RouteID,", [").concat(e.PathAttributeId.join(","),"])"));var T,E,F=(0,d.jg)(t,".kk .lk").length;if(h!==F){var H=F-h;if(H<0){for(var q=new DocumentFragment,N=new DocumentFragment,O=0;O<Math.abs(H);O++){var Q=rt();q.appendChild(Q.element);var U=(T=void 0,E=void 0,T=(0,r.zx)("t"),(E=document.createElement("div")).classList.add("gm"),E.id=T,{element:E,id:T});N.appendChild(U.element)}P.append(q),_.append(N)}else for(var J=(0,d.jg)(t,".kk .lk"),W=(0,d.jg)(t,"._l .dm .em .gm"),$=0;$<Math.abs(H);$++){var K=F-1-$;J[K].remove(),W[K].remove()}}for(var X=0;X<h;X++){var G="g_".concat(X),V=(0,d.jg)((0,d.aI)((0,d.jg)(t,".kk .lk")[X],".ok"),".wm").length;if(g[G]!==V){var Y=V-g[G];if(Y<0){for(var et=(0,d.aI)((0,d.jg)(t,".kk .lk")[X],".ok"),nt=(0,d.aI)((0,d.jg)(t,".kk .lk")[X],".nk"),at=new DocumentFragment,ct=new DocumentFragment,dt=0;dt<Math.abs(Y);dt++){var ut=st(),lt=ot(ut.id);at.appendChild(lt.element),ct.appendChild(ut.element)}et.append(at),nt.append(ct)}else for(var vt=(0,d.jg)((0,d.aI)((0,d.jg)(t,".kk .lk")[X],".ok"),".wm"),ft=(0,d.jg)((0,d.aI)((0,d.jg)(t,".kk .lk")[X],".nk"),".lm"),mt=0;mt<Math.abs(Y);mt++){var ht=V-1-mt;vt[ht].remove(),ft[ht].remove()}}}for(var pt=0;pt<h;pt++){var gt="g_".concat(pt),bt=(0,d.jg)(t,"._l .dm .em .gm")[pt];bt.innerHTML=[e.RouteEndPoints.RouteDestination,e.RouteEndPoints.RouteDeparture,""].map((function(t){return"<span>往".concat(t,"</span>")}))[pt],bt.style.setProperty("--zl","".concat(B[gt].width,"px")),bt.style.setProperty("--xl","".concat(pt));for(var yt=(0,d.jg)((0,d.aI)((0,d.jg)(t,".kk .lk")[pt],".ok"),".wm"),kt=(0,d.jg)((0,d.aI)((0,d.jg)(t,".kk .lk")[pt],".nk"),".lm"),At=0;At<g[gt];At++){var It=yt[At],wt=kt[At],xt=b[gt][At];if(L.hasOwnProperty("groupedItems"))if(L.groupedItems.hasOwnProperty(gt))if(L.groupedItems[gt][At])s(It,wt,xt,L.groupedItems[gt][At]);else s(It,wt,xt,null);else s(It,wt,xt,null);else s(It,wt,xt,null)}}L=e,S=i,Z=n}function dt(){return ut.apply(this,arguments)}function ut(){var t;return t=function*(){var t=(0,o.Js)("playing_animation"),e=(0,o.Js)("refresh_interval"),n=(0,v.gO)("route-bus-arrival-time-chart");O=e.dynamic,H=e.baseInterval,W=!0,$=(0,r.zx)("r"),x.setAttribute("refreshing","true");var a=yield(0,i.R)(V,Y,n.width,n.height,$);ct(k,a,!1,t);var s=0;O&&(s=yield(0,u.wz)()),U=(new Date).getTime(),J=O?Math.max(U+q,a.dataUpdateTime+H/s):U+H,N=Math.max(q,J-U),W=!1,x.setAttribute("refreshing","false")},ut=function(){var e=this,n=arguments;return new Promise((function(i,a){var s=t.apply(e,n);function o(t){y(s,i,a,o,r,"next",t)}function r(t){y(s,i,a,o,r,"throw",t)}o(void 0)}))},ut.apply(this,arguments)}function lt(){dt().then((function(){Q?setTimeout((function(){lt()}),Math.max(q,J-(new Date).getTime())):G=!1})).catch((function(t){console.error(t),Q?((0,f.a)("（路線）發生網路錯誤，將在".concat(F/1e3,"秒後重試。"),"error"),setTimeout((function(){lt()}),F)):G=!1}))}function vt(t,e){(0,v.WR)("Route"),(0,h.XK)("route",t),V=t,Y=e,M=0,k.setAttribute("displayed","true"),(0,d.aI)(k,".kk").scrollLeft=0,function(t){for(var e=(0,o.Js)("playing_animation"),n=(0,v.gO)("window"),i=(n.width,n.height),a=Math.floor(i/50)+5,s={},r=0;r<2;r++){var c="g_".concat(r);s[c]=[];for(var d=0;d<a;d++)s[c].push({name:"",goBack:"0",status:{code:8,text:"",time:-6},buses:[],overlappingRoutes:[],busArrivalTimes:[],sequence:d,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}ct(t,{groupedItems:s,groupQuantity:2,itemQuantity:{g_0:a,g_1:a},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:0},!0,e)}(k),Q||(Q=!0,G?dt():(G=!0,lt()),K=-1,X=-1,at()),(0,v.Z_)()}function ft(){k.setAttribute("displayed","false"),Q=!1,K=-1,X=-1,(0,v.l$)()}function mt(t,e){Q=!1,K=-1,X=-1,vt(t,e)}function ht(t,e){var n=(0,d.bv)(".jk .kk .lk .mk .ok .wm#".concat(t)),i=(0,d.aI)(n,".cn"),a=(0,d.bv)(".jk .kk .lk .mk .nk .lm#".concat(e));"true"===n.getAttribute("stretched")?("true"===n.getAttribute("animation")?i.addEventListener("transitionend",(function(){i.setAttribute("displayed","false")}),{once:!0}):i.setAttribute("displayed","false"),n.setAttribute("stretched","false"),a.setAttribute("stretched","false")):(i.setAttribute("displayed","true"),n.setAttribute("stretched","true"),a.setAttribute("stretched","true"))}function pt(t,e){var n,i=(0,d.aI)(P,".wm#".concat(t)),a=(0,d.aI)(i,".dn"),s=g((0,d.jg)(a,'.en[highlighted="true"][type="tab"]'));try{for(s.s();!(n=s.n()).done;){n.value.setAttribute("highlighted","false")}}catch(t){s.e(t)}finally{s.f()}switch((0,d.aI)(a,'.en[code="'.concat(e,'"]')).setAttribute("highlighted","true"),e){case 0:(0,d.aI)(i,".gn").setAttribute("displayed","true"),(0,d.aI)(i,".hn").setAttribute("displayed","false"),(0,d.aI)(i,".in").setAttribute("displayed","false");break;case 1:(0,d.aI)(i,".gn").setAttribute("displayed","false"),(0,d.aI)(i,".hn").setAttribute("displayed","false"),(0,d.aI)(i,".in").setAttribute("displayed","true");break;case 2:(0,d.aI)(i,".gn").setAttribute("displayed","false"),(0,d.aI)(i,".hn").setAttribute("displayed","true"),(0,d.aI)(i,".in").setAttribute("displayed","false")}}}}]);
//# sourceMappingURL=580ee9a107990e29618c.js.map
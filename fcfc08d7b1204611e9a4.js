"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[466],{4690:(t,e,i)=>{i.d(e,{Ch:()=>lt,S5:()=>V,SR:()=>dt,U7:()=>ut,aU:()=>ct,py:()=>vt});var s=i(5767),n=i(9566),a=i(4636),r=i(5314),o=i(7123),d=i(3459),u=i(7968),l=i(8024),c=i(3648),v=i(5579),f=i(4537),p=i(904),h=i(9119);function m(t,e){var i="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!i){if(Array.isArray(t)||(i=function(t,e){if(t){if("string"==typeof t)return b(t,e);var i={}.toString.call(t).slice(8,-1);return"Object"===i&&t.constructor&&(i=t.constructor.name),"Map"===i||"Set"===i?Array.from(t):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?b(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){i&&(t=i);var s=0,n=function(){};return{s:n,n:function(){return s>=t.length?{done:!0}:{done:!1,value:t[s++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,r=!0,o=!1;return{s:function(){i=i.call(t)},n:function(){var t=i.next();return r=t.done,t},e:function(t){o=!0,a=t},f:function(){try{r||null==i.return||i.return()}finally{if(o)throw a}}}}function b(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,s=Array(e);i<e;i++)s[i]=t[i];return s}function g(t,e,i,s,n,a,r){try{var o=t[a](r),d=o.value}catch(t){return void i(t)}o.done?e(d):Promise.resolve(d).then(s,n)}var y=(0,c.bv)(".nk"),A=(0,c.aI)(y,".fm"),I=(0,c.aI)(A,".im"),$=(0,c.aI)(A,".hm"),w=(0,c.aI)(A,".pm .qm"),k=(0,c.aI)(A,".jm"),x=(0,c.aI)(k,".km"),L=(0,c.aI)(A,".nm"),R=(0,c.aI)(L,".om"),_=(0,c.aI)(y,".ok"),T={},S=!0,E=!1,P=0,Z=0,j=0,M={},C=0,D=!1,B=1e4,q=15e3,H=5e3,z=15e3,F=!0,N=0,O=0,U="",Q=!1,J=!1,W=!1,K=0,X=[],G=20;function V(){_.addEventListener("touchstart",(function(){P=Math.round(_.scrollLeft/C)}),{passive:!0}),_.addEventListener("scroll",(function(t){D=!0;var e=t.target.scrollLeft/C;Z=e>P?P+1:P-1;var i=M[`g_${P}`]||{width:0,offset:0},s=M[`g_${Z}`]||{width:0,offset:0},n=i.width+(s.width-i.width)*Math.abs(e-P),a=-1*(i.offset+(s.offset-i.offset)*Math.abs(e-P))+.5*C-.5*n;Y(j,a,n-G,e),e===Z&&(P=Math.round(_.scrollLeft/C),D=!1)}),{passive:!0})}function Y(t,e,i,s){_.style.setProperty("--mk",t.toString()),R.style.setProperty("--bm",i.toString()),x.style.setProperty("--lm",`${e.toFixed(5)}px`),x.style.setProperty("--_l",s.toFixed(5))}function tt(t){var e=t;if(Q){var i=e.detail.progress-1;w.style.setProperty("--dm",i.toString())}"end"===e.detail.stage&&document.removeEventListener(e.detail.target,tt)}function et(){var t=(0,l.zx)("i"),e=document.createElement("div");return e.classList.add("wm"),e.id=t,e.setAttribute("stretched","false"),e.setAttribute("stretching","false"),e.setAttribute("push-direction","0"),e.setAttribute("push-state","0"),e.innerHTML='<div class="_m"><div class="cn" displayed="true"></div></div><div class="dn"><div class="ia" code="0"></div><div class="ja" code="0"></div></div>',{element:e,id:t}}function it(t){var e=(0,l.zx)("i"),i=document.createElement("div");return i.classList.add("gn"),i.id=e,i.setAttribute("stretched","false"),i.setAttribute("stretching","false"),i.setAttribute("push-direction","0"),i.setAttribute("push-state","0"),i.innerHTML=`<div class="hn"><div class="in"></div><div class="jn"><div class="kn"><div class="ia" code="0"></div><div class="ja" code="0"></div></div><div class="ln" onclick="bus.route.stretchRouteItem('${e}', '${t}')">${(0,f.Z)("keyboard_arrow_down")}</div><div class="mn"></div></div></div><div class="nn" displayed="false"><div class="on"><div class="pn" highlighted="true" type="tab" onclick="bus.route.switchRouteBodyTab('${e}', 0)" code="0"><div class="qn">${(0,f.Z)("directions_bus")}</div>公車</div><div class="pn" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab('${e}', 1)" code="1"><div class="qn">${(0,f.Z)("departure_board")}</div>抵達時間</div><div class="pn" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab('${e}', 2)" code="2"><div class="qn">${(0,f.Z)("route")}</div>路線</div><div class="pn" highlighted="false" type="tab" onclick="bus.route.switchRouteBodyTab('${e}', 3)" code="3"><div class="qn">${(0,f.Z)("location_on")}</div>地點</div><div class="pn" highlighted="false" type="save-to-folder" onclick="bus.folder.openSaveToFolder('stop-on-route', ['${e}', null, null])"><div class="qn">${(0,f.Z)("folder")}</div>儲存至資料夾</div><div class="pn" highlighted="false" type="schedule-notification" onclick="bus.notification.openScheduleNotification('stop-on-route', ['${e}', null, null, null])" enabled="true"><div class="qn">${(0,f.Z)("notifications")}</div>設定到站通知</div></div><div class="rn" displayed="true"></div><div class="sn" displayed="false"></div><div class="tn" displayed="false"></div><div class="un" displayed="false"></div></div>`,{element:i,id:e}}function st(){var t=document.createElement("div");t.classList.add("pk");var e=document.createElement("div");e.classList.add("qk");var i=document.createElement("div");i.classList.add("rk");var s=document.createElement("div");s.classList.add("vm");var n=document.createElement("div");n.classList.add("sk");var a=document.createElement("div");return a.classList.add("vn"),n.appendChild(a),i.appendChild(s),e.appendChild(i),e.appendChild(n),t.appendChild(e),{element:t,id:""}}function nt(t,e,i){function s(e,i,s,r,o,d){function u(t,e,i,s,n){var a=(0,c.aI)(e,".dn"),r=(0,c.aI)(a,".ja"),o=(0,c.aI)(a,".ia"),d=(0,c.aI)(t,".kn"),u=(0,c.aI)(d,".ja"),l=(0,c.aI)(d,".ia");if(o.setAttribute("code",i.status.code.toString()),l.setAttribute("code",i.status.code.toString()),l.innerText=i.status.text,!s&&n){var v=t.getBoundingClientRect(),f=v.top,p=v.left,h=v.bottom,m=v.right,b=window.innerWidth,g=window.innerHeight;if(h>0&&f<g&&m>0&&p<b)return r.addEventListener("animationend",(function(){r.setAttribute("code",i.status.code.toString()),r.classList.remove("_a")}),{once:!0}),u.addEventListener("animationend",(function(){u.setAttribute("code",i.status.code.toString()),u.innerText=i.status.text,u.classList.remove("_a")}),{once:!0}),r.classList.add("_a"),void u.classList.add("_a")}r.setAttribute("code",i.status.code.toString()),u.setAttribute("code",i.status.code.toString()),u.innerText=i.status.text}function p(t,e,i){t.setAttribute("segment-buffer",(0,l.xZ)(i.segmentBuffer.isSegmentBuffer)),e.setAttribute("segment-buffer",(0,l.xZ)(i.segmentBuffer.isSegmentBuffer))}function h(t,e){(0,c.aI)(t,".in").innerText=e.name}function m(t,e){(0,c.aI)(t,".rn").innerHTML=0===e.buses.length?'<div class="wn">目前沒有公車可顯示</div>':e.buses.map((function(t){return`<div class="xn" on-this-route="${t.onThisRoute}"><div class="yn"><div class="zn">${(0,f.Z)("directions_bus")}</div><div class="_n">${t.carNumber}</div></div><div class="ao"><div class="bo">路線：${t.RouteName}</div><div class="co">狀態：${t.status.text}</div><div class="do">類型：${t.type}</div></div></div>`})).join("")}function b(t,e){(0,c.aI)(t,".sn").innerHTML=0===e.overlappingRoutes.length?'<div class="eo">目前沒有路線可顯示</div>':e.overlappingRoutes.map((function(t){return`<div class="fo"><div class="go"><div class="ho">${(0,f.Z)("route")}</div><div class="io">${t.name}</div></div><div class="jo">${t.RouteEndPoints.html}</div><div class="ko"><div class="lo" onclick="bus.route.switchRoute(${t.RouteID}, [${t.PathAttributeId.join(",")}])">查看路線</div><div class="lo" onclick="bus.folder.openSaveToFolder('route-on-route', [${t.RouteID}])">收藏路線</div></div></div>`})).join("")}function g(t,e){(0,c.aI)(t,".tn").innerHTML=0===e.busArrivalTimes.length?'<div class="mo">目前沒有抵達時間可顯示</div>':e.busArrivalTimes.map((function(t){return`<div class="no"><div class="oo"><div class="po">${(0,f.Z)("calendar_view_day")}</div><div class="qo">${t.personalSchedule.name}</div><div class="ro">週${(0,v.kd)(t.day).name} ${(0,v.pn)(t.personalSchedule.period.start)} - ${(0,v.pn)(t.personalSchedule.period.end)}</div></div><div class="so">${t.chart}</div></div>`})).join("")}function y(t,e){(0,c.aI)(t,".un").innerHTML=0===e.nearbyLocations.length?'<div class="to">目前沒有地點可顯示</div>':e.nearbyLocations.map((function(t){return`<div class="uo"><div class="vo"><div class="wo">${(0,f.Z)("location_on")}</div><div class="xo">${t.name}</div></div><div class="yo">${t.distance}公尺</div><div class="zo"><div class="_o" onclick="bus.location.openLocation('${t.hash}')">查看地點</div><div class="_o">收藏地點</div></div></div>`})).join("")}function A(t,e,i){t.setAttribute("nearest",(0,l.xZ)(i.nearest)),e.setAttribute("nearest",(0,l.xZ)(i.nearest))}function I(t,e,i,s,n){var a=(null==i?void 0:i.progress)||0,r=(null==e?void 0:e.progress)||0,o=(0,c.aI)(t,"._m .cn");if(!s&&n&&0!==a&&0===r&&Math.abs(r-a)>0)return o.style.setProperty("--zm","100%"),void o.addEventListener("transitionend",(function(){o.setAttribute("displayed","false"),o.style.setProperty("--zm","-100%")}),{once:!0});o.setAttribute("displayed","true"),o.style.setProperty("--zm",100*(r-1)+"%")}function $(t,e,i){i&&((0,c.aI)(t,".nn").setAttribute("displayed","false"),t.setAttribute("stretched","false"),e.setAttribute("stretched","false"))}function w(t,e,i){t.setAttribute("animation",(0,l.xZ)(i)),e.setAttribute("animation",(0,l.xZ)(i))}function k(t,e,i){t.setAttribute("skeleton-screen",(0,l.xZ)(i)),e.setAttribute("skeleton-screen",(0,l.xZ)(i))}function x(e,i){var s=(0,c.aI)(e,'.nn .on .pn[type="save-to-folder"]');s.setAttribute("onclick",`bus.folder.openSaveToFolder('stop-on-route', ['${e.id}', ${i.id}, ${t.RouteID}])`),(0,n.LH)("stop",i.id).then((function(t){s.setAttribute("highlighted",(0,l.xZ)(t))}))}function L(e,i){var s=(0,c.aI)(e,'.nn .on .pn[type="schedule-notification"]');s.setAttribute("onclick",`bus.notification.openScheduleNotification('stop-on-route', ['${e.id}', ${i.id}, ${t.RouteID}, ${i.status.time}])`);var n=(0,a.Zc)(i.id);s.setAttribute("highlighted",(0,l.xZ)(n))}null===r?(u(e,i,s,o,d),h(e,s),m(e,s),b(e,s),g(e,s),y(e,s),p(e,i,s),A(e,i,s),I(i,s,r,o,d),$(e,i,o),w(e,i,d),k(e,i,o),x(e,s),L(e,s)):(s.status.time!==r.status.time&&(u(e,i,s,o,d),L(e,s)),(0,l.hw)(r.buses,s.buses)||m(e,s),(0,l.hw)(r.busArrivalTimes,s.busArrivalTimes)||g(e,s),(0,l.hw)(r.segmentBuffer,s.segmentBuffer)||p(e,i,s),r.nearest!==s.nearest&&A(e,i,s),r.progress!==s.progress&&I(i,s,r,o,d),r.id!==s.id&&(h(e,s),b(e,s),y(e,s),x(e,s),L(e,s)),S!==d&&w(e,i,d),E!==o&&($(e,i,o),k(e,i,o)))}var r=(0,p.gO)("window"),o=r.width,d=r.height,h=t.groupQuantity,m=t.itemQuantity,b=t.groupedItems;j=h,C=o;for(var g=0,y=0;y<h;y++){var A=(0,u.q_)([t.RouteEndPoints.RouteDestination,t.RouteEndPoints.RouteDeparture,""].map((function(t){return`往${t}`}))[y],500,"17px",'"Noto Sans TC", sans-serif')+G;M[`g_${y}`]={width:A,offset:g},g+=A}var w=-1*M[`g_${P}`].offset+.5*C-.5*M[`g_${P}`].width;D||Y(j,w,M[`g_${P}`].width-G,P),I.innerHTML=`<span>${t.RouteName}</span>`,I.setAttribute("animation",(0,l.xZ)(i)),I.setAttribute("skeleton-screen",(0,l.xZ)(e)),k.setAttribute("animation",(0,l.xZ)(i)),k.setAttribute("skeleton-screen",(0,l.xZ)(e)),L.setAttribute("animation",(0,l.xZ)(i)),L.setAttribute("skeleton-screen",(0,l.xZ)(e)),$.setAttribute("onclick",`bus.route.openRouteDetails(${t.RouteID}, [${t.PathAttributeId.join(",")}])`);var R,Z=(0,c.jg)(_,".pk").length;if(h!==Z){var B=Z-h;if(B<0){for(var q=new DocumentFragment,H=new DocumentFragment,z=0;z<Math.abs(B);z++){var F=st();q.appendChild(F.element);var N=(R=void 0,(R=document.createElement("div")).classList.add("mm"),{element:R,id:""});H.appendChild(N.element)}_.append(q),x.append(H)}else for(var O=(0,c.jg)(_,".pk"),U=(0,c.jg)(x,".mm"),Q=0;Q<Math.abs(B);Q++){var J=Z-1-Q;O[J].remove(),U[J].remove()}}for(var W=(0,c.jg)(_,".pk"),K=0;K<h;K++){var X=`g_${K}`,V=W[K],tt=(0,c.aI)(V,".sk"),nt=(0,c.aI)(V,".rk"),at=(0,c.jg)(tt,".gn").length;if(m[X]!==at){var rt=at-m[X];if(rt<0){for(var ot=new DocumentFragment,dt=new DocumentFragment,ut=0;ut<Math.abs(rt);ut++){var lt=et(),ct=it(lt.id);ot.appendChild(ct.element),dt.appendChild(lt.element)}tt.append(ot),nt.append(dt)}else for(var vt=(0,c.jg)(tt,".gn"),ft=(0,c.jg)(nt,".wm"),pt=0;pt<Math.abs(rt);pt++){var ht=at-1-pt;vt[ht].remove(),ft[ht].remove()}}}for(var mt=(0,c.jg)(x,".mm"),bt=0;bt<h;bt++){var gt=`g_${bt}`,yt=mt[bt];yt.innerHTML=[t.RouteEndPoints.RouteDestination,t.RouteEndPoints.RouteDeparture,""].map((function(t){return`<span>往${t}</span>`}))[bt],yt.style.setProperty("--cm",`${M[gt].width}px`),yt.style.setProperty("--am",bt.toString());var At=W[bt];e&&(At.scrollTop=0);for(var It=(0,c.aI)(At,".sk"),$t=(0,c.aI)(At,".rk"),wt=(0,c.jg)(It,".gn"),kt=(0,c.jg)($t,".wm"),xt=0;xt<m[gt];xt++){var Lt=wt[xt],Rt=kt[xt],_t=b[gt][xt];if(T.hasOwnProperty("groupedItems"))if(T.groupedItems.hasOwnProperty(gt))if(T.groupedItems[gt][xt])s(Lt,Rt,_t,T.groupedItems[gt][xt],e,i);else s(Lt,Rt,_t,null,e,i);else s(Lt,Rt,_t,null,e,i);else s(Lt,Rt,_t,null,e,i)}}T=t,S=i,E=e}function at(){return rt.apply(this,arguments)}function rt(){var t;return t=function*(){var t=(0,d.Js)("playing_animation"),e=(0,d.Js)("refresh_interval"),i=(0,p.gO)("route-bus-arrival-time-chart");F=e.dynamic,q=e.baseInterval,Q=!0,U=(0,l.zx)("r"),w.setAttribute("refreshing","true"),w.classList.remove("rm"),document.addEventListener(U,tt);var n=yield(0,o.R)(K,X,i.width,i.height,U);nt(n,!1,t);var a=0;F&&(a=yield(0,s.wz)()),N=(new Date).getTime(),O=F?Math.max(N+H,n.dataUpdateTime+q/a):N+q,z=Math.max(H,O-N),Q=!1,w.setAttribute("refreshing","false"),w.style.setProperty("--em",`${z}ms`),w.classList.add("rm")},rt=function(){var e=this,i=arguments;return new Promise((function(s,n){var a=t.apply(e,i);function r(t){g(a,s,n,r,o,"next",t)}function o(t){g(a,s,n,r,o,"throw",t)}r(void 0)}))},rt.apply(this,arguments)}function ot(){at().then((function(){J?setTimeout((function(){ot()}),Math.max(H,O-(new Date).getTime())):W=!1})).catch((function(t){J?((0,h.a)(`路線網路連線中斷，將在${B/1e3}秒後重試。`,"error"),setTimeout((function(){ot()}),B)):W=!1}))}function dt(t,e){(0,p.WR)("Route"),(0,r.XK)("route",t),K=t,X=e,P=0,y.setAttribute("displayed","true"),_.scrollLeft=0,function(){for(var t=(0,d.Js)("playing_animation"),e=(0,p.gO)("window"),i=(e.width,e.height),s=Math.floor(i/50)+5,n={},a=0;a<2;a++){var r=`g_${a}`;n[r]=[];for(var o=0;o<s;o++)n[r].push({name:"",goBack:"0",status:{code:8,text:"",time:-6},buses:[],overlappingRoutes:[],busArrivalTimes:[],nearbyLocations:[],sequence:o,position:{longitude:0,latitude:0},nearest:!1,progress:0,segmentBuffer:{isSegmentBuffer:!1,isStartingPoint:!1,isEndingPoint:!1},id:0})}nt({groupedItems:n,groupQuantity:2,itemQuantity:{g_0:s,g_1:s},RouteName:"載入中",RouteEndPoints:{RouteDeparture:"載入中",RouteDestination:"載入中"},RouteID:0,PathAttributeId:[],dataUpdateTime:0},!0,t)}(),J||(J=!0,W?at():(W=!0,ot())),(0,p.Z_)()}function ut(){y.setAttribute("displayed","false"),J=!1,(0,p.l$)()}function lt(t,e){J=!1,dt(t,e)}function ct(t,e){var i=(0,c.aI)(_,`.pk .qk .sk .gn#${t}`),s=(0,c.aI)(i,".nn"),n=(0,c.aI)(_,`.pk .qk .rk .wm#${e}`),a=i.parentElement,r=n.parentElement,o=(0,c.ji)(n,"wm"),d=(0,c.ji)(i,"gn"),u=d.length,l=a.getBoundingClientRect(),v=i.getBoundingClientRect(),f=r.getBoundingClientRect(),p=n.getBoundingClientRect().top-f.top,h=v.top-l.top,m="true"===i.getAttribute("stretched"),b="true"===i.getAttribute("animation");if(b){var g=m?"2":"1";n.setAttribute("stretching","true"),n.style.setProperty("--tm",`${p}px`),i.setAttribute("stretching","true"),i.style.setProperty("--bp",`${h}px`);for(var y=0;y<u;y++){var A=d[y],I=o[y];I.style.setProperty("--um",(-1*y-1).toString()),I.setAttribute("push-direction",g),I.setAttribute("push-state","1"),A.setAttribute("push-direction",g),A.setAttribute("push-state","1")}i.addEventListener("transitionend",(function(){for(var t=0;t<u;t++){var e=d[t],s=o[t];s.setAttribute("push-direction","0"),s.setAttribute("push-state","0"),e.setAttribute("push-direction","0"),e.setAttribute("push-state","0")}n.setAttribute("stretching","false"),i.setAttribute("stretching","false")}),{once:!0}),i.addEventListener("transitionstart",(function(){for(var t=0;t<u;t++){var e=d[t];o[t].setAttribute("push-state","2"),e.setAttribute("push-state","2")}}),{once:!0})}m?(b?s.addEventListener("transitionend",(function(){s.setAttribute("displayed","false")}),{once:!0}):s.setAttribute("displayed","false"),i.setAttribute("stretched","false"),n.setAttribute("stretched","false")):(s.setAttribute("displayed","true"),i.setAttribute("stretched","true"),n.setAttribute("stretched","true"))}function vt(t,e){var i,s=(0,c.aI)(_,`.gn#${t}`),n=(0,c.aI)(s,".on"),a=m((0,c.jg)(n,'.pn[highlighted="true"][type="tab"]'));try{for(a.s();!(i=a.n()).done;){i.value.setAttribute("highlighted","false")}}catch(t){a.e(t)}finally{a.f()}switch((0,c.aI)(n,`.pn[code="${e}"]`).setAttribute("highlighted","true"),e){case 0:(0,c.aI)(s,".rn").setAttribute("displayed","true"),(0,c.aI)(s,".tn").setAttribute("displayed","false"),(0,c.aI)(s,".sn").setAttribute("displayed","false"),(0,c.aI)(s,".un").setAttribute("displayed","false");break;case 1:(0,c.aI)(s,".rn").setAttribute("displayed","false"),(0,c.aI)(s,".tn").setAttribute("displayed","true"),(0,c.aI)(s,".sn").setAttribute("displayed","false"),(0,c.aI)(s,".un").setAttribute("displayed","false");break;case 2:(0,c.aI)(s,".rn").setAttribute("displayed","false"),(0,c.aI)(s,".tn").setAttribute("displayed","false"),(0,c.aI)(s,".sn").setAttribute("displayed","true"),(0,c.aI)(s,".un").setAttribute("displayed","false");break;case 3:(0,c.aI)(s,".rn").setAttribute("displayed","false"),(0,c.aI)(s,".tn").setAttribute("displayed","false"),(0,c.aI)(s,".sn").setAttribute("displayed","false"),(0,c.aI)(s,".un").setAttribute("displayed","true")}}}}]);
//# sourceMappingURL=fcfc08d7b1204611e9a4.js.map
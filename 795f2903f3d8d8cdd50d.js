"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[627],{2174:(t,e,n)=>{n.d(e,{Gv:()=>N,Sv:()=>U,m_:()=>q});var r=n(5767),i=n(365),a=n(4636),u=n(3459),o=n(8024),l=n(3648),s=n(4537),c=n(904),d=n(9119);function f(t,e,n,r,i,a,u){try{var o=t[a](u),l=o.value}catch(t){return void n(t)}o.done?e(l):Promise.resolve(l).then(r,i)}function v(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function u(t){f(a,r,i,u,o,"next",t)}function o(t){f(a,r,i,u,o,"throw",t)}u(void 0)}))}}var h=(0,l.bv)(".rj"),p=(0,l.aI)(h,".uj"),m=(0,l.aI)(p,".yj"),y=(0,l.aI)(m,".zj"),g=(0,l.aI)(h,".ak"),b=(0,l.aI)(g,".bk"),I={},A=!0,j=!1,k=15e3,S=5e3,w=15e3,_=!0,x=0,$=0,M="",T=!1,E=!1,P=!1;function L(t){var e=t;if(T){var n=e.detail.progress-1;y.style.setProperty("--sj",n.toString())}"end"===e.detail.stage&&document.removeEventListener(e.detail.target,L)}function O(t,e,n){function r(t,r,i){function a(t,e){(0,l.aI)(t,".dk").innerText=e.hours}function u(t,e){var n=(0,l.aI)(t,".ek");(0,l.aI)(n,".fk").innerText=e.minutes}function s(t,e){var n=(0,l.aI)(t,".ek");(0,l.aI)(n,".hk").innerText=e.name}function c(t,e){var n=(0,l.aI)(t,".ek");(0,l.aI)(n,".gk").innerText=`${e.route.name} - 往${e.route.direction}`}function d(t,e){var n=(0,l.aI)(t,".ek");(0,l.aI)(n,".ik").setAttribute("onclick",`bus.notification.cancelNotificationOnNotificationScheduleManager('${t.id}', '${e.schedule_id}')`)}function f(t,e){t.setAttribute("first",(0,o.xZ)(e.is_first))}function v(t,e){t.setAttribute("animation",(0,o.xZ)(e))}function h(t,e){t.setAttribute("skeleton-screen",(0,o.xZ)(e))}null===i?(a(t,r),u(t,r),s(t,r),c(t,r),d(t,r),f(t,r),v(t,n),h(t,e)):(r.hours!==i.hours&&a(t,r),r.minutes!==i.minutes&&u(t,r),(0,o.hw)(i.schedule_id,r.schedule_id)||(s(t,r),c(t,r),d(t,r)),i.is_first!==r.is_first&&f(t,r),A!==n&&v(t,n),j!==e&&h(t,e))}var i,a,u=t.itemQuantity,c=t.items,d=(0,l.jg)(b,".ck").length;if(u!==d){var f=d-u;if(f<0)for(var v=0;v<Math.abs(f);v++){var h=(i=void 0,a=void 0,i=(0,o.zx)("i"),(a=document.createElement("div")).classList.add("ck"),a.id=i,a.innerHTML=`<div class="dk"></div><div class="ek"><div class="fk"></div><div class="gk"></div><div class="hk"></div><div class="ik" onclick="bus.notification.cancelNotificationOnNotificationScheduleManager('${i}', 'null')">${(0,s.Z)("close")}</div></div>`,{element:a,id:i});b.appendChild(h.element)}else for(var p=(0,l.jg)(b,".ck"),m=0;m<Math.abs(f);m++){p[d-1-m].remove()}}for(var y=(0,l.jg)(b,".ck"),g=0;g<u;g++){var k=y[g],S=c[g];if(I.hasOwnProperty("items"))if(I.items[g])r(k,S,I.items[g]);else r(k,S,null);else r(k,S,null)}I=t,j=e}function Z(){return C.apply(this,arguments)}function C(){return(C=v((function*(){var t=(0,u.Js)("playing_animation"),e=(0,u.Js)("refresh_interval");_=e.dynamic,k=e.baseInterval,T=!0,M=(0,o.zx)("r"),y.setAttribute("refreshing","true"),y.classList.remove("_j"),document.addEventListener(M,L);var n=yield(0,a.e3)(M);O(n,!1,t);var i=0;_&&(i=yield(0,r.wz)()),x=(new Date).getTime(),$=_?Math.max(x+S,n.dataUpdateTime+k/i):x+k,w=Math.max(S,$-x),T=!1,y.setAttribute("refreshing","false"),y.style.setProperty("--tj",`${w}ms`),y.classList.add("_j")}))).apply(this,arguments)}function z(){return J.apply(this,arguments)}function J(){return(J=v((function*(){Z().then((function(){E?setTimeout((function(){z()}),Math.max(S,$-(new Date).getTime())):P=!1})).catch((function(t){E?setTimeout((function(){z()}),1e4):P=!1}))}))).apply(this,arguments)}function U(){(0,c.WR)("NotificationScheduleManager"),h.setAttribute("displayed","true"),function(){for(var t=(0,u.Js)("playing_animation"),e=(0,c.gO)("window"),n=(e.width,e.height),r=Math.floor(n/50)+5,i=[],a=0;a<r;a++)i.push({name:"",stop_id:0,estimate_time:0,schedule_id:"null",scheduled_time:0,route:{name:"",direction:"",id:0,pathAttributeId:[]},is_first:!0,date:"",hours:"",minutes:""});O({items:i,itemQuantity:r,dataUpdateTime:0},!0,t)}(),E||(E=!0,P?Z():(P=!0,z())),(0,c.Z_)()}function q(){h.setAttribute("displayed","false"),E=!1,(0,c.l$)()}function N(t,e){return H.apply(this,arguments)}function H(){return(H=v((function*(t,e){if((0,d.a)("處理中","manufacturing"),yield(0,i.G)(e)){if((0,l.aI)(b,`.ck#${t}`).remove(),(0,d.a)("已取消通知","check_circle"),!T){var n=(0,u.Js)("playing_animation");O(yield(0,a.e3)(M),!1,n)}}else(0,d.a)("取消失敗","error")}))).apply(this,arguments)}},5693:(t,e,n)=>{n.d(e,{Dn:()=>_,Xy:()=>w,bF:()=>S,gv:()=>A});var r=n(5352),i=n(3648),a=n(5579),u=n(904);function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,i,a,u,o=[],l=!0,s=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(o.push(r.value),o.length!==e);l=!0);}catch(t){s=!0,i=t}finally{try{if(!l&&null!=n.return&&(u=n.return(),Object(u)!==u))return}finally{if(s)throw i}}return o}}(t,e)||function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e,n,r,i,a,u){try{var o=t[a](u),l=o.value}catch(t){return void n(t)}o.done?e(l):Promise.resolve(l).then(r,i)}function c(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function u(t){s(a,r,i,u,o,"next",t)}function o(t){s(a,r,i,u,o,"throw",t)}u(void 0)}))}}var d=(0,i.bv)(".ej"),f=(0,i.aI)(d,".jj"),v=(0,i.aI)(d,".fj"),h=(0,i.aI)(v,".gj"),p=(0,i.aI)(f,".kj"),m=(0,i.aI)(p,'.lj[group="schedule-name"] .pj input'),y=(0,i.aI)(p,'.lj[group="schedule-start-time"] .pj input'),g=(0,i.aI)(p,'.lj[group="schedule-end-time"] .pj input'),b=(0,i.aI)(p,'.lj[group="schedule-days"] .pj'),I=(0,i.jg)(b,".qj");function A(t){return j.apply(this,arguments)}function j(){return(j=c((function*(t){for(var e=m.value,n=y.value,i=g.value,a=o(String(n).split(":").map((function(t){return parseInt(t)})),2),u=a[0],l=a[1],s=o(String(i).split(":").map((function(t){return parseInt(t)})),2),c=s[0],d=s[1],f=[],v=0;v<7;v++){var h=I[v],p=h.getAttribute("highlighted"),b=parseInt(h.getAttribute("day"));"true"===p&&f.push(b)}var A=yield(0,r.qZ)(t);A.name=e,A.days=f,A.period.start.hours=u,A.period.start.minutes=l,A.period.end.hours=c,A.period.end.minutes=d,yield(0,r.nL)(A),w()}))).apply(this,arguments)}function k(){return(k=c((function*(t){var e=yield(0,r.qZ)(t);m.value=e.name,y.value=(0,a.pn)(e.period.start),g.value=(0,a.pn)(e.period.end);for(var n=0;n<7;n++){var i=I[n];e.days.indexOf(n)>-1?i.setAttribute("highlighted","true"):i.setAttribute("highlighted","false")}h.setAttribute("onclick",`bus.personalSchedule.saveEditedPersonalSchedule('${t}')`)}))).apply(this,arguments)}function S(t){(0,u.WR)("PersonalScheduleEditor"),d.setAttribute("displayed","true"),function(t){k.apply(this,arguments)}(t),(0,u.Z_)()}function w(){d.setAttribute("displayed","false"),(0,u.l$)()}function _(t){var e=(0,i.aI)(b,`.qj[day="${t}"]`);"true"===e.getAttribute("highlighted")?e.setAttribute("highlighted","false"):e.setAttribute("highlighted","true")}},7891:(t,e,n)=>{n.d(e,{Z:()=>y,z:()=>m});var r=n(5352),i=n(8024),a=n(3648),u=n(4537),o=n(904);function l(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return s(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,o=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){o=!0,a=t},f:function(){try{u||null==n.return||n.return()}finally{if(o)throw a}}}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function c(t,e,n,r,i,a,u){try{var o=t[a](u),l=o.value}catch(t){return void n(t)}o.done?e(l):Promise.resolve(l).then(r,i)}var d=(0,a.bv)(".ii"),f=(0,a.aI)(d,".ni"),v=(0,a.aI)(f,".oi");function h(t){var e=(0,i.zx)("i"),n=document.createElement("div");return n.classList.add("pi"),n.id=e,n.setAttribute("onclick",`bus.personalSchedule.openPersonalScheduleEditor('${t.id}')`),n.innerHTML=`<div class="qi">${t.name}</div><div class="ri">${(0,u.Z)("arrow_forward_ios")}</div>`,{element:n,id:e}}function p(){var t;return t=function*(){v.innerHTML="";var t,e=l(yield(0,r.ty)());try{for(e.s();!(t=e.n()).done;){var n=h(t.value);v.appendChild(n.element)}}catch(t){e.e(t)}finally{e.f()}},p=function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function u(t){c(a,r,i,u,o,"next",t)}function o(t){c(a,r,i,u,o,"throw",t)}u(void 0)}))},p.apply(this,arguments)}function m(){(0,o.WR)("PersonalScheduleManager"),d.setAttribute("displayed","true"),function(){p.apply(this,arguments)}()}function y(){(0,o.kr)("PersonalScheduleManager"),d.setAttribute("displayed","false")}},8380:(t,e,n)=>{n.d(e,{GJ:()=>b,I1:()=>g,Ps:()=>y,om:()=>I});var r=n(5352),i=n(3648),a=n(904),u=n(9119);function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,i,a,u,o=[],l=!0,s=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(o.push(r.value),o.length!==e);l=!0);}catch(t){s=!0,i=t}finally{try{if(!l&&null!=n.return&&(u=n.return(),Object(u)!==u))return}finally{if(s)throw i}}return o}}(t,e)||function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var s=(0,i.bv)(".si"),c=(0,i.aI)(s,".xi"),d=(0,i.aI)(c,".yi"),f=(0,i.aI)(d,'.zi[group="schedule-name"] .cj input'),v=(0,i.aI)(d,'.zi[group="schedule-start-time"] .cj input'),h=(0,i.aI)(d,'.zi[group="schedule-end-time"] .cj input'),p=(0,i.aI)(d,'.zi[group="schedule-days"] .cj'),m=(0,i.jg)(p,".dj");function y(){for(var t=f.value,e=v.value,n=h.value,i=o(String(e).split(":").map((function(t){return parseInt(t)})),2),a=i[0],l=i[1],s=o(String(n).split(":").map((function(t){return parseInt(t)})),2),c=s[0],d=s[1],p=[],y=0;y<7;y++){var g=m[y],I=g.getAttribute("highlighted"),A=parseInt(g.getAttribute("day"));"true"===I&&p.push(A)}(0,r.Qh)(t,a,l,c,d,p).then((function(t){t?(b(),(0,u.a)("已建立個人化行程","calendar_view_day")):(0,u.a)("無法建立個人化行程","error")}))}function g(){(0,a.WR)("PersonalScheduleCreator"),s.setAttribute("displayed","true"),(0,a.Z_)()}function b(){s.setAttribute("displayed","false"),(0,a.l$)()}function I(t){var e=(0,i.aI)(p,`.dj[day="${t}"]`);"true"===e.getAttribute("highlighted")?e.setAttribute("highlighted","false"):e.setAttribute("highlighted","true")}},9119:(t,e,n)=>{n.d(e,{a:()=>s});var r=n(3459),i=n(8024),a=n(3648),u=n(4537);function o(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,o=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){o=!0,a=t},f:function(){try{u||null==n.return||n.return()}finally{if(o)throw a}}}}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e){var n=(0,a.e0)(".jk");if(null!==n){var l,s=o(n);try{for(s.s();!(l=s.n()).done;){l.value.remove()}}catch(t){s.e(t)}finally{s.f()}}var c=(0,r.Js)("playing_animation"),d=(0,i.zx)(),f=document.createElement("div");f.id=d,f.classList.add("jk"),f.setAttribute("animation",(0,i.xZ)(c));var v=document.createElement("div");v.classList.add("kk"),v.innerHTML=(0,u.Z)(e),f.appendChild(v);var h=document.createElement("div");h.classList.add("lk"),h.innerText=t,f.appendChild(h),document.body.appendChild(f);var p=document.getElementById(d);null!==p&&p.addEventListener("animationend",(function(){p.remove()}),{once:!0})}}}]);
//# sourceMappingURL=795f2903f3d8d8cdd50d.js.map
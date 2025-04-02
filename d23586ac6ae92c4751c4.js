"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[627],{2174:(t,e,n)=>{n.d(e,{Gv:()=>W,Sv:()=>D,m_:()=>H});var r=n(5767),i=n(6788),a=n(365),o=n(4636),u=n(3459),l=n(8024),s=n(3648),c=n(4537),d=n(904),f=n(9119);function h(t,e,n,r,i,a,o){try{var u=t[a](o),l=u.value}catch(t){return void n(t)}u.done?e(l):Promise.resolve(l).then(r,i)}function v(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function o(t){h(a,r,i,o,u,"next",t)}function u(t){h(a,r,i,o,u,"throw",t)}o(void 0)}))}}var m=(0,s.bv)(".nj"),p=(0,s.aI)(m,".oj"),y=(0,s.aI)(p,".sj"),g=(0,s.aI)(y,".tj"),b=(0,s.aI)(m,".uj"),j=(0,s.aI)(b,".vj"),A={},I=!0,w=!1,S=15e3,_=5e3,x=15e3,M=!0,T=!1,k=0,$=0,P=!1,E="",z=-1,L=!1;function O(){var t=(new Date).getTime();z=-1*Math.min(1,Math.max(0,Math.abs(t-k)/x)),g.style.setProperty("--z",z.toString()),window.requestAnimationFrame((function(){T&&!P&&O()}))}function Z(t){var e=t;P&&(z=-1+(0,i._M)(E),g.style.setProperty("--z",z.toString())),"end"===e.detail.stage&&document.removeEventListener(e.detail.target,Z)}function C(t,e,n){function r(t,r,i){function a(t,e){(0,s.aI)(t,".xj").innerText=e.hours}function o(t,e){var n=(0,s.aI)(t,".yj");(0,s.aI)(n,".zj").innerText=e.minutes}function u(t,e){var n=(0,s.aI)(t,".yj");(0,s.aI)(n,".ak").innerText=e.name}function c(t,e){var n=(0,s.aI)(t,".yj");(0,s.aI)(n,"._j").innerText=`${e.route.name} - 往${e.route.direction}`}function d(t,e){var n=(0,s.aI)(t,".yj");(0,s.aI)(n,".bk").setAttribute("onclick",`bus.notification.cancelNotificationOnNotificationScheduleManager('${t.id}', '${e.schedule_id}')`)}function f(t,e){t.setAttribute("first",(0,l.xZ)(e.is_first))}function h(t,e){t.setAttribute("animation",(0,l.xZ)(e))}function v(t,e){t.setAttribute("skeleton-screen",(0,l.xZ)(e))}null===i?(a(t,r),o(t,r),u(t,r),c(t,r),d(t,r),f(t,r),h(t,n),v(t,e)):(r.hours!==i.hours&&a(t,r),r.minutes!==i.minutes&&o(t,r),(0,l.hw)(i.schedule_id,r.schedule_id)||(u(t,r),c(t,r),d(t,r)),i.is_first!==r.is_first&&f(t,r),e!==w&&v(t,e),I!==n&&h(t,n),w!==e&&v(t,e))}var i,a,o=t.itemQuantity,u=t.items,d=(0,s.jg)(j,".wj").length;if(o!==d){var f=d-o;if(f<0)for(var h=0;h<Math.abs(f);h++){var v=(i=void 0,a=void 0,i=(0,l.zx)("i"),(a=document.createElement("div")).classList.add("wj"),a.id=i,a.innerHTML=`<div class="xj"></div><div class="yj"><div class="zj"></div><div class="_j"></div><div class="ak"></div><div class="bk" onclick="bus.notification.cancelNotificationOnNotificationScheduleManager('${i}', 'null')">${(0,c.Z)("close")}</div></div>`,{element:a,id:i});j.appendChild(v.element)}else for(var m=(0,s.jg)(j,".wj"),p=0;p<Math.abs(f);p++){m[d-1-p].remove()}}for(var y=(0,s.jg)(j,".wj"),g=0;g<o;g++){var b=y[g],S=u[g];if(A.hasOwnProperty("items"))if(A.items[g])r(b,S,A.items[g]);else r(b,S,null);else r(b,S,null)}A=t,w=e}function J(){return R.apply(this,arguments)}function R(){return(R=v((function*(){var t=(0,u.Js)("playing_animation"),e=(0,u.Js)("refresh_interval");M=e.dynamic,S=e.baseInterval,P=!0,E=(0,l.zx)("r"),g.setAttribute("refreshing","true"),document.addEventListener(E,Z);var n=yield(0,o.e3)(E);C(n,!1,t);var i=0;M&&(i=yield(0,r.wz)()),k=(new Date).getTime(),$=M?Math.max(k+_,n.dataUpdateTime+S/i):k+S,x=Math.max(_,$-k),P=!1,g.setAttribute("refreshing","false"),O()}))).apply(this,arguments)}function U(){return N.apply(this,arguments)}function N(){return(N=v((function*(){J().then((function(){T?setTimeout((function(){U()}),Math.max(_,$-(new Date).getTime())):L=!1})).catch((function(t){console.error(t),T?setTimeout((function(){U()}),1e4):L=!1}))}))).apply(this,arguments)}function D(){(0,d.WR)("NotificationScheduleManager"),m.setAttribute("displayed","true"),function(){for(var t=(0,u.Js)("playing_animation"),e=(0,d.gO)("window"),n=(e.width,e.height),r=Math.floor(n/50)+5,i=[],a=0;a<r;a++)i.push({name:"",stop_id:0,estimate_time:0,schedule_id:"null",scheduled_time:0,route:{name:"",direction:"",id:0,pathAttributeId:[]},is_first:!0,date:"",hours:"",minutes:""});C({items:i,itemQuantity:r,dataUpdateTime:0},!0,t)}(),T||(T=!0,L?J():(L=!0,U()),z=-1,notifcationScheduleManagerRefreshTimer_targetProgress=-1,O()),(0,d.Z_)()}function H(){m.setAttribute("displayed","false"),T=!1,z=-1,notifcationScheduleManagerRefreshTimer_targetProgress=-1,(0,d.l$)()}function W(t,e){return q.apply(this,arguments)}function q(){return(q=v((function*(t,e){if((0,f.a)("處理中","manufacturing"),yield(0,a.G)(e)){if((0,s.aI)(j,`.wj#${t}`).remove(),(0,f.a)("已取消通知","check_circle"),!P){var n=(0,u.Js)("playing_animation");C(yield(0,o.e3)(E),!1,n)}}else(0,f.a)("取消失敗","error")}))).apply(this,arguments)}},5693:(t,e,n)=>{n.d(e,{Dn:()=>x,Xy:()=>_,bF:()=>S,gv:()=>A});var r=n(5352),i=n(3648),a=n(5579),o=n(904);function u(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,i,a,o,u=[],l=!0,s=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(u.push(r.value),u.length!==e);l=!0);}catch(t){s=!0,i=t}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(s)throw i}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e,n,r,i,a,o){try{var u=t[a](o),l=u.value}catch(t){return void n(t)}u.done?e(l):Promise.resolve(l).then(r,i)}function c(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function o(t){s(a,r,i,o,u,"next",t)}function u(t){s(a,r,i,o,u,"throw",t)}o(void 0)}))}}var d=(0,i.bv)(".aj"),f=(0,i.aI)(d,".fj"),h=(0,i.aI)(d,".bj"),v=(0,i.aI)(h,".cj"),m=(0,i.aI)(f,".gj"),p=(0,i.aI)(m,'.hj[group="schedule-name"] .lj input'),y=(0,i.aI)(m,'.hj[group="schedule-start-time"] .lj input'),g=(0,i.aI)(m,'.hj[group="schedule-end-time"] .lj input'),b=(0,i.aI)(m,'.hj[group="schedule-days"] .lj'),j=(0,i.jg)(b,".mj");function A(t){return I.apply(this,arguments)}function I(){return(I=c((function*(t){for(var e=p.value,n=y.value,i=g.value,a=u(String(n).split(":").map((function(t){return parseInt(t)})),2),o=a[0],l=a[1],s=u(String(i).split(":").map((function(t){return parseInt(t)})),2),c=s[0],d=s[1],f=[],h=0;h<7;h++){var v=j[h],m=v.getAttribute("highlighted"),b=parseInt(v.getAttribute("day"));"true"===m&&f.push(b)}var A=yield(0,r.qZ)(t);A.name=e,A.days=f,A.period.start.hours=o,A.period.start.minutes=l,A.period.end.hours=c,A.period.end.minutes=d,yield(0,r.nL)(A),_()}))).apply(this,arguments)}function w(){return(w=c((function*(t){var e=yield(0,r.qZ)(t);p.value=e.name,y.value=(0,a.pn)(e.period.start),g.value=(0,a.pn)(e.period.end);for(var n=0;n<7;n++){var i=j[n];e.days.indexOf(n)>-1?i.setAttribute("highlighted","true"):i.setAttribute("highlighted","false")}v.setAttribute("onclick",`bus.personalSchedule.saveEditedPersonalSchedule('${t}')`)}))).apply(this,arguments)}function S(t){(0,o.WR)("PersonalScheduleEditor"),d.setAttribute("displayed","true"),function(t){w.apply(this,arguments)}(t),(0,o.Z_)()}function _(){d.setAttribute("displayed","false"),(0,o.l$)()}function x(t){var e=(0,i.aI)(b,`.mj[day="${t}"]`);"true"===e.getAttribute("highlighted")?e.setAttribute("highlighted","false"):e.setAttribute("highlighted","true")}},7891:(t,e,n)=>{n.d(e,{Z:()=>y,z:()=>p});var r=n(5352),i=n(8024),a=n(3648),o=n(4537),u=n(904);function l(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return s(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){u=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(u)throw a}}}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function c(t,e,n,r,i,a,o){try{var u=t[a](o),l=u.value}catch(t){return void n(t)}u.done?e(l):Promise.resolve(l).then(r,i)}var d=(0,a.bv)(".ei"),f=(0,a.aI)(d,".ji"),h=(0,a.aI)(f,".ki");function v(t){var e=(0,i.zx)("i"),n=document.createElement("div");return n.classList.add("li"),n.id=e,n.setAttribute("onclick",`bus.personalSchedule.openPersonalScheduleEditor('${t.id}')`),n.innerHTML=`<div class="mi">${t.name}</div><div class="ni">${(0,o.Z)("arrow_forward_ios")}</div>`,{element:n,id:e}}function m(){var t;return t=function*(){h.innerHTML="";var t,e=l(yield(0,r.ty)());try{for(e.s();!(t=e.n()).done;){var n=v(t.value);h.appendChild(n.element)}}catch(t){e.e(t)}finally{e.f()}},m=function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function o(t){c(a,r,i,o,u,"next",t)}function u(t){c(a,r,i,o,u,"throw",t)}o(void 0)}))},m.apply(this,arguments)}function p(){(0,u.WR)("PersonalScheduleManager"),d.setAttribute("displayed","true"),function(){m.apply(this,arguments)}()}function y(){(0,u.kr)("PersonalScheduleManager"),d.setAttribute("displayed","false")}},8380:(t,e,n)=>{n.d(e,{GJ:()=>b,I1:()=>g,Ps:()=>y,om:()=>j});var r=n(5352),i=n(3648),a=n(904),o=n(9119);function u(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,i,a,o,u=[],l=!0,s=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(u.push(r.value),u.length!==e);l=!0);}catch(t){s=!0,i=t}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(s)throw i}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var s=(0,i.bv)(".oi"),c=(0,i.aI)(s,".ti"),d=(0,i.aI)(c,".ui"),f=(0,i.aI)(d,'.vi[group="schedule-name"] .zi input'),h=(0,i.aI)(d,'.vi[group="schedule-start-time"] .zi input'),v=(0,i.aI)(d,'.vi[group="schedule-end-time"] .zi input'),m=(0,i.aI)(d,'.vi[group="schedule-days"] .zi'),p=(0,i.jg)(m,"._i");function y(){for(var t=f.value,e=h.value,n=v.value,i=u(String(e).split(":").map((function(t){return parseInt(t)})),2),a=i[0],l=i[1],s=u(String(n).split(":").map((function(t){return parseInt(t)})),2),c=s[0],d=s[1],m=[],y=0;y<7;y++){var g=p[y],j=g.getAttribute("highlighted"),A=parseInt(g.getAttribute("day"));"true"===j&&m.push(A)}(0,r.Qh)(t,a,l,c,d,m).then((function(t){t?(b(),(0,o.a)("已建立個人化行程","calendar_view_day")):(0,o.a)("無法建立個人化行程","error")}))}function g(){(0,a.WR)("PersonalScheduleCreator"),s.setAttribute("displayed","true"),(0,a.Z_)()}function b(){s.setAttribute("displayed","false"),(0,a.l$)()}function j(t){var e=(0,i.aI)(m,`._i[day="${t}"]`);"true"===e.getAttribute("highlighted")?e.setAttribute("highlighted","false"):e.setAttribute("highlighted","true")}},9119:(t,e,n)=>{n.d(e,{a:()=>s});var r=n(3459),i=n(8024),a=n(3648),o=n(4537);function u(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){u=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(u)throw a}}}}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e){var n=(0,a.e0)(".ck");if(null!==n){var l,s=u(n);try{for(s.s();!(l=s.n()).done;){l.value.remove()}}catch(t){s.e(t)}finally{s.f()}}var c=(0,r.Js)("playing_animation"),d=(0,i.zx)(),f=document.createElement("div");f.id=d,f.classList.add("ck"),f.setAttribute("animation",(0,i.xZ)(c));var h=document.createElement("div");h.classList.add("dk"),h.innerHTML=(0,o.Z)(e),f.appendChild(h);var v=document.createElement("div");v.classList.add("ek"),v.innerText=t,f.appendChild(v),document.body.appendChild(f);var m=document.getElementById(d);null!==m&&m.addEventListener("animationend",(function(){m.remove()}),{once:!0})}}}]);
//# sourceMappingURL=d23586ac6ae92c4751c4.js.map
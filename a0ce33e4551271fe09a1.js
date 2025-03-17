"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[627],{2174:(t,e,n)=>{n.d(e,{Gv:()=>W,Sv:()=>H,m_:()=>R});var r=n(5767),i=n(6788),a=n(365),o=n(4636),u=n(3459),l=n(8024),c=n(3648),s=n(4537),d=n(904),f=n(9119);function h(t,e,n,r,i,a,o){try{var u=t[a](o),l=u.value}catch(t){return void n(t)}u.done?e(l):Promise.resolve(l).then(r,i)}function v(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function o(t){h(a,r,i,o,u,"next",t)}function u(t){h(a,r,i,o,u,"throw",t)}o(void 0)}))}}var p=(0,c.bv)(".nj"),m=(0,c.aI)(p,".oj"),y=(0,c.aI)(m,".sj"),g=(0,c.aI)(y,".tj"),b=(0,c.aI)(p,".uj"),j=(0,c.aI)(b,".vj"),I={},A=!0,w=!1,S=15e3,_=5e3,x=15e3,M=!0,k=!1,T=0,$=0,P=!1,E="",z=-1,O=-1,Z=!1;function C(){var t=(new Date).getTime();P?(O=-1+(0,i._M)(E),z=.1*(O-z)):(O=-1*Math.min(1,Math.max(0,Math.abs(t-T)/x)),z=O),g.style.setProperty("--z",z.toString()),window.requestAnimationFrame((function(){k&&C()}))}function L(t,e,n){function r(t,r,i){function a(t,e){(0,c.aI)(t,".xj").innerText=e.hours}function o(t,e){var n=(0,c.aI)(t,".yj");(0,c.aI)(n,".zj").innerText=e.minutes}function u(t,e){var n=(0,c.aI)(t,".yj");(0,c.aI)(n,".ak").innerText=e.name}function s(t,e){var n=(0,c.aI)(t,".yj");(0,c.aI)(n,"._j").innerText=`${e.route.name} - 往${e.route.direction}`}function d(t,e){var n=(0,c.aI)(t,".yj");(0,c.aI)(n,".bk").setAttribute("onclick",`bus.notification.cancelNotificationOnNotificationScheduleManager('${t.id}', '${e.schedule_id}')`)}function f(t,e){t.setAttribute("first",(0,l.xZ)(e.is_first))}function h(t,e){t.setAttribute("animation",(0,l.xZ)(e))}function v(t,e){t.setAttribute("skeleton-screen",(0,l.xZ)(e))}null===i?(a(t,r),o(t,r),u(t,r),s(t,r),d(t,r),f(t,r),h(t,n),v(t,e)):(r.hours!==i.hours&&a(t,r),r.minutes!==i.minutes&&o(t,r),(0,l.hw)(i.schedule_id,r.schedule_id)||(u(t,r),s(t,r),d(t,r)),i.is_first!==r.is_first&&f(t,r),e!==w&&v(t,e),A!==n&&h(t,n),w!==e&&v(t,e))}var i,a,o=t.itemQuantity,u=t.items,d=(0,c.jg)(j,".wj").length;if(o!==d){var f=d-o;if(f<0)for(var h=0;h<Math.abs(f);h++){var v=(i=void 0,a=void 0,i=(0,l.zx)("i"),(a=document.createElement("div")).classList.add("wj"),a.id=i,a.innerHTML=`<div class="xj"></div><div class="yj"><div class="zj"></div><div class="_j"></div><div class="ak"></div><div class="bk" onclick="bus.notification.cancelNotificationOnNotificationScheduleManager('${i}', 'null')">${(0,s.Z)("close")}</div></div>`,{element:a,id:i});j.appendChild(v.element)}else for(var p=(0,c.jg)(j,".wj"),m=0;m<Math.abs(f);m++){p[d-1-m].remove()}}for(var y=(0,c.jg)(j,".wj"),g=0;g<o;g++){var b=y[g],S=u[g];if(I.hasOwnProperty("items"))if(I.items[g])r(b,S,I.items[g]);else r(b,S,null);else r(b,S,null)}I=t,w=e}function J(){return U.apply(this,arguments)}function U(){return(U=v((function*(){var t=(0,u.Js)("playing_animation"),e=(0,u.Js)("refresh_interval");M=e.dynamic,S=e.baseInterval,P=!0,E=(0,l.zx)("r");var n=yield(0,o.e3)(E);L(n,!1,t);var i=0;M&&(i=yield(0,r.wz)()),T=(new Date).getTime(),$=M?Math.max(T+_,n.dataUpdateTime+S/i):T+S,x=Math.max(_,$-T),P=!1}))).apply(this,arguments)}function N(){return D.apply(this,arguments)}function D(){return(D=v((function*(){J().then((function(){k?setTimeout((function(){N()}),Math.max(_,$-(new Date).getTime())):Z=!1})).catch((function(t){console.error(t),k?setTimeout((function(){N()}),1e4):Z=!1}))}))).apply(this,arguments)}function H(){(0,d.WR)("NotificationScheduleManager"),p.setAttribute("displayed","true"),function(){for(var t=(0,u.Js)("playing_animation"),e=(0,d.gO)("window"),n=(e.width,e.height),r=Math.floor(n/50)+5,i=[],a=0;a<r;a++)i.push({name:"",stop_id:0,estimate_time:0,schedule_id:"null",scheduled_time:0,route:{name:"",direction:"",id:0,pathAttributeId:[]},is_first:!0,date:"",hours:"",minutes:""});L({items:i,itemQuantity:r,dataUpdateTime:0},!0,t)}(),k||(k=!0,Z?J():(Z=!0,N()),z=-1,O=-1,C()),(0,d.Z_)()}function R(){p.setAttribute("displayed","false"),k=!1,z=-1,O=-1,(0,d.l$)()}function W(t,e){return q.apply(this,arguments)}function q(){return(q=v((function*(t,e){if((0,f.a)("處理中","manufacturing"),yield(0,a.G)(e)){if((0,c.aI)(j,`.wj#${t}`).remove(),(0,f.a)("已取消通知","check_circle"),!P){var n=(0,u.Js)("playing_animation");L(yield(0,o.e3)(E),!1,n)}}else(0,f.a)("取消失敗","error")}))).apply(this,arguments)}},5693:(t,e,n)=>{n.d(e,{Dn:()=>x,Xy:()=>_,bF:()=>S,gv:()=>I});var r=n(5352),i=n(3648),a=n(5579),o=n(904);function u(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,i,a,o,u=[],l=!0,c=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(u.push(r.value),u.length!==e);l=!0);}catch(t){c=!0,i=t}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(c)throw i}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function c(t,e,n,r,i,a,o){try{var u=t[a](o),l=u.value}catch(t){return void n(t)}u.done?e(l):Promise.resolve(l).then(r,i)}function s(t){return function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function o(t){c(a,r,i,o,u,"next",t)}function u(t){c(a,r,i,o,u,"throw",t)}o(void 0)}))}}var d=(0,i.bv)(".aj"),f=(0,i.aI)(d,".fj"),h=(0,i.aI)(d,".bj"),v=(0,i.aI)(h,".cj"),p=(0,i.aI)(f,".gj"),m=(0,i.aI)(p,'.hj[group="schedule-name"] .lj input'),y=(0,i.aI)(p,'.hj[group="schedule-start-time"] .lj input'),g=(0,i.aI)(p,'.hj[group="schedule-end-time"] .lj input'),b=(0,i.aI)(p,'.hj[group="schedule-days"] .lj'),j=(0,i.jg)(b,".mj");function I(t){return A.apply(this,arguments)}function A(){return(A=s((function*(t){for(var e=m.value,n=y.value,i=g.value,a=u(String(n).split(":").map((function(t){return parseInt(t)})),2),o=a[0],l=a[1],c=u(String(i).split(":").map((function(t){return parseInt(t)})),2),s=c[0],d=c[1],f=[],h=0;h<7;h++){var v=j[h],p=v.getAttribute("highlighted"),b=parseInt(v.getAttribute("day"));"true"===p&&f.push(b)}var I=yield(0,r.qZ)(t);I.name=e,I.days=f,I.period.start.hours=o,I.period.start.minutes=l,I.period.end.hours=s,I.period.end.minutes=d,yield(0,r.nL)(I),_()}))).apply(this,arguments)}function w(){return(w=s((function*(t){var e=yield(0,r.qZ)(t);m.value=e.name,y.value=(0,a.pn)(e.period.start),g.value=(0,a.pn)(e.period.end);for(var n=0;n<7;n++){var i=j[n];e.days.indexOf(n)>-1?i.setAttribute("highlighted","true"):i.setAttribute("highlighted","false")}v.setAttribute("onclick",`bus.personalSchedule.saveEditedPersonalSchedule('${t}')`)}))).apply(this,arguments)}function S(t){(0,o.WR)("PersonalScheduleEditor"),d.setAttribute("displayed","true"),function(t){w.apply(this,arguments)}(t),(0,o.Z_)()}function _(){d.setAttribute("displayed","false"),(0,o.l$)()}function x(t){var e=(0,i.aI)(b,`.mj[day="${t}"]`);"true"===e.getAttribute("highlighted")?e.setAttribute("highlighted","false"):e.setAttribute("highlighted","true")}},7891:(t,e,n)=>{n.d(e,{Z:()=>y,z:()=>m});var r=n(5352),i=n(8024),a=n(3648),o=n(4537),u=n(904);function l(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return c(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){u=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(u)throw a}}}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function s(t,e,n,r,i,a,o){try{var u=t[a](o),l=u.value}catch(t){return void n(t)}u.done?e(l):Promise.resolve(l).then(r,i)}var d=(0,a.bv)(".ei"),f=(0,a.aI)(d,".ji"),h=(0,a.aI)(f,".ki");function v(t){var e=(0,i.zx)("i"),n=document.createElement("div");return n.classList.add("li"),n.id=e,n.setAttribute("onclick",`bus.personalSchedule.openPersonalScheduleEditor('${t.id}')`),n.innerHTML=`<div class="mi">${t.name}</div><div class="ni">${(0,o.Z)("arrow_forward_ios")}</div>`,{element:n,id:e}}function p(){var t;return t=function*(){h.innerHTML="";var t,e=l(yield(0,r.ty)());try{for(e.s();!(t=e.n()).done;){var n=v(t.value);h.appendChild(n.element)}}catch(t){e.e(t)}finally{e.f()}},p=function(){var e=this,n=arguments;return new Promise((function(r,i){var a=t.apply(e,n);function o(t){s(a,r,i,o,u,"next",t)}function u(t){s(a,r,i,o,u,"throw",t)}o(void 0)}))},p.apply(this,arguments)}function m(){(0,u.WR)("PersonalScheduleManager"),d.setAttribute("displayed","true"),function(){p.apply(this,arguments)}()}function y(){(0,u.kr)("PersonalScheduleManager"),d.setAttribute("displayed","false")}},8380:(t,e,n)=>{n.d(e,{GJ:()=>b,I1:()=>g,Ps:()=>y,om:()=>j});var r=n(5352),i=n(3648),a=n(904),o=n(9119);function u(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,i,a,o,u=[],l=!0,c=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(u.push(r.value),u.length!==e);l=!0);}catch(t){c=!0,i=t}finally{try{if(!l&&null!=n.return&&(o=n.return(),Object(o)!==o))return}finally{if(c)throw i}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}var c=(0,i.bv)(".oi"),s=(0,i.aI)(c,".ti"),d=(0,i.aI)(s,".ui"),f=(0,i.aI)(d,'.vi[group="schedule-name"] .zi input'),h=(0,i.aI)(d,'.vi[group="schedule-start-time"] .zi input'),v=(0,i.aI)(d,'.vi[group="schedule-end-time"] .zi input'),p=(0,i.aI)(d,'.vi[group="schedule-days"] .zi'),m=(0,i.jg)(p,"._i");function y(){for(var t=f.value,e=h.value,n=v.value,i=u(String(e).split(":").map((function(t){return parseInt(t)})),2),a=i[0],l=i[1],c=u(String(n).split(":").map((function(t){return parseInt(t)})),2),s=c[0],d=c[1],p=[],y=0;y<7;y++){var g=m[y],j=g.getAttribute("highlighted"),I=parseInt(g.getAttribute("day"));"true"===j&&p.push(I)}(0,r.Qh)(t,a,l,s,d,p).then((function(t){t?(b(),(0,o.a)("已建立個人化行程","calendar_view_day")):(0,o.a)("無法建立個人化行程","error")}))}function g(){(0,a.WR)("PersonalScheduleCreator"),c.setAttribute("displayed","true"),(0,a.Z_)()}function b(){c.setAttribute("displayed","false"),(0,a.l$)()}function j(t){var e=(0,i.aI)(p,`._i[day="${t}"]`);"true"===e.getAttribute("highlighted")?e.setAttribute("highlighted","false"):e.setAttribute("highlighted","true")}},9119:(t,e,n)=>{n.d(e,{a:()=>c});var r=n(3459),i=n(8024),a=n(3648),o=n(4537);function u(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return l(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,i=function(){};return{s:i,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,o=!0,u=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return o=t.done,t},e:function(t){u=!0,a=t},f:function(){try{o||null==n.return||n.return()}finally{if(u)throw a}}}}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function c(t,e){var n=(0,a.e0)(".ck");if(null!==n){var l,c=u(n);try{for(c.s();!(l=c.n()).done;){l.value.remove()}}catch(t){c.e(t)}finally{c.f()}}var s=(0,r.Js)("playing_animation"),d=(0,i.zx)(),f=document.createElement("div");f.id=d,f.classList.add("ck"),f.setAttribute("animation",(0,i.xZ)(s));var h=document.createElement("div");h.classList.add("dk"),h.innerHTML=(0,o.Z)(e),f.appendChild(h);var v=document.createElement("div");v.classList.add("ek"),v.innerText=t,f.appendChild(v),document.body.appendChild(f);var p=document.getElementById(d);null!==p&&p.addEventListener("animationend",(function(){p.remove()}),{once:!0})}}}]);
//# sourceMappingURL=a0ce33e4551271fe09a1.js.map
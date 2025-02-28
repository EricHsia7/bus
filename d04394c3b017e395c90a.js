"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[927],{752:(t,n,e)=>{e.d(n,{H9:()=>m,Ho:()=>p,b$:()=>y,b6:()=>g});var r=e(4636),a=e(3648),o=e(4537),i=e(904),c=e(9119);function u(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return l(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?l(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw o}}}}function l(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function s(t,n,e,r,a,o,i){try{var c=t[o](i),u=c.value}catch(t){return void e(t)}c.done?n(u):Promise.resolve(u).then(r,a)}var f=(0,a.bv)(".ir"),d=(0,a.aI)(f,".mr"),v=(0,a.aI)(d,".nr");function h(t,n,e){var r=document.createElement("div");switch(r.classList.add("or"),n){case"stop-on-route":r.setAttribute("onclick","bus.notification.scheduleNotificationForStopItemOnRoute('".concat(e[0],"', ").concat(e[1],", ").concat(e[2],", ").concat(e[3],", ").concat(t.index,")"));break;case"stop-on-location":r.setAttribute("onclick","bus.notification.scheduleNotificationForStopItemOnLocation('".concat(e[0],"', ").concat(e[1],", ").concat(e[2],", ").concat(e[3],", ").concat(t.index,")"))}return r.innerHTML='<div class="pr">'.concat((0,o.Z)(t.icon),'</div><div class="qr">').concat(t.name,"</div>"),{element:r,id:""}}function b(){var t;return t=function*(t,n){v.innerHTML="";var e,a=new DocumentFragment,o=u(r.FX);try{for(o.s();!(e=o.n()).done;){var i=h(e.value,t,n);a.append(i.element)}}catch(t){o.e(t)}finally{o.f()}v.append(a)},b=function(){var n=this,e=arguments;return new Promise((function(r,a){var o=t.apply(n,e);function i(t){s(o,r,a,i,c,"next",t)}function c(t){s(o,r,a,i,c,"throw",t)}i(void 0)}))},b.apply(this,arguments)}function p(t,n){(0,i.WR)("ScheduleNotification"),f.setAttribute("displayed","true"),function(t,n){b.apply(this,arguments)}(t,n)}function y(){(0,i.kr)("ScheduleNotification"),f.setAttribute("displayed","false")}function m(t,n,e,o,i){var u=(0,a.bv)(".jk .kk .lk .mk .ok .wm#".concat(t)),l=(0,a.aI)(u,'.cn .dn .en[type="schedule-notification"]');(0,c.a)("處理中","manufacturing"),l.setAttribute("enabled","false"),y(),(0,r.mD)(n,e,o,i).then((function(t){switch(t){case 0:(0,c.a)("設定失敗","error"),l.setAttribute("enabled","true");break;case 1:(0,c.a)("設定成功","check_circle"),l.setAttribute("enabled","true"),l.setAttribute("highlighted","true");break;case 2:(0,c.a)("在設定中註冊後才可設定到站通知","warning"),l.setAttribute("enabled","true")}}))}function g(t,n,e,o,i){var u=(0,a.bv)(".j .m .sa .va ._#".concat(t)),l=(0,a.aI)(u,'.ma .na .oa[type="schedule-notification"]');(0,c.a)("處理中","manufacturing"),l.setAttribute("enabled","false"),y(),(0,r.mD)(n,e,o,i).then((function(t){switch(t){case 0:(0,c.a)("設定失敗","error"),l.setAttribute("enabled","true");break;case 1:(0,c.a)("設定成功","check_circle"),l.setAttribute("enabled","true"),l.setAttribute("highlighted","true");break;case 2:(0,c.a)("在設定中註冊後才可設定到站通知","warning"),l.setAttribute("enabled","true")}}))}},2994:(t,n,e)=>{e.d(n,{G:()=>f,Q:()=>d});var r=e(4225),a=e(3648);function o(t,n,e,r,a,o,i){try{var c=t[o](i),u=c.value}catch(t){return void e(t)}c.done?n(u):Promise.resolve(u).then(r,a)}var i=(0,a.bv)(".rr"),c=(0,a.aI)(i,".vr"),u=(0,a.aI)(c,".wr");function l(t){var n=document.createElement("div");return n.classList.add("xr"),n.innerHTML='<div class="yr">'.concat(t.category.name,'</div><div class="zr">').concat(t.size,"</div>"),{element:n,id:""}}function s(){var t;return t=function*(){var t=yield(0,r.F)();for(var n in u.innerHTML="",t.categorizedSizes){var e=l(t.categorizedSizes[n]);u.appendChild(e.element)}},s=function(){var n=this,e=arguments;return new Promise((function(r,a){var i=t.apply(n,e);function c(t){o(i,r,a,c,u,"next",t)}function u(t){o(i,r,a,c,u,"throw",t)}c(void 0)}))},s.apply(this,arguments)}function f(){i.setAttribute("displayed","true"),function(){s.apply(this,arguments)}()}function d(){i.setAttribute("displayed","false")}},3041:(t,n,e)=>{e.d(n,{BI:()=>y,Dh:()=>w,JL:()=>g,Lb:()=>A,jD:()=>k,nS:()=>m});var r=e(3648),a=e(904),o=e(8024),i=e(9566),c=e(4537),u=e(9119);function l(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return s(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?s(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw o}}}}function s(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function f(t,n,e,r,a,o,i){try{var c=t[o](i),u=c.value}catch(t){return void e(t)}c.done?n(u):Promise.resolve(u).then(r,a)}var d=(0,r.bv)("._q"),v=(0,r.aI)(d,".dr"),h=(0,r.aI)(v,".er");function b(t,n,e){var r=document.createElement("div");switch(r.classList.add("fr"),n){case"stop-on-route":r.setAttribute("onclick","bus.folder.saveStopItemOnRoute('".concat(e[0],"', '").concat(t.id,"', ").concat(e[1],", ").concat(e[2],")"));break;case"stop-on-location":r.setAttribute("onclick","bus.folder.saveStopItemOnLocation('".concat(e[0],"', '").concat(t.id,"', ").concat(e[1],", ").concat(e[2],")"));break;case"route":r.setAttribute("onclick","bus.folder.saveRouteOnDetailsPage('".concat(t.id,"', ").concat(e[0],")"));break;case"route-on-route":r.setAttribute("onclick","bus.folder.saveRouteOnRoute('".concat(t.id,"', ").concat(e[0],")"))}return r.innerHTML='<div class="gr">'.concat((0,c.Z)(t.icon),'</div><div class="hr">').concat(t.name,"</div>"),{element:r,id:""}}function p(){var t;return t=function*(t,n){h.innerHTML="";var e,r=l(yield(0,i.Xi)());try{for(r.s();!(e=r.n()).done;){var a=b(e.value,t,n);h.appendChild(a.element)}}catch(t){r.e(t)}finally{r.f()}},p=function(){var n=this,e=arguments;return new Promise((function(r,a){var o=t.apply(n,e);function i(t){f(o,r,a,i,c,"next",t)}function c(t){f(o,r,a,i,c,"throw",t)}i(void 0)}))},p.apply(this,arguments)}function y(t,n){(0,a.WR)("SaveToFolder"),d.setAttribute("displayed","true"),function(t,n){p.apply(this,arguments)}(t,n)}function m(){(0,a.kr)("SaveToFolder"),d.setAttribute("displayed","false")}function g(t,n,e,a){var c=(0,r.bv)(".jk .kk .lk .mk .ok .wm#".concat(t)),l=(0,r.aI)(c,'.cn .dn .en[type="save-to-folder"]');(0,i.aq)(n,e,a).then((function(t){t?(0,i.LH)("stop",e).then((function(t){t&&(l.setAttribute("highlighted",(0,o.xZ)(t)),(0,u.a)("已儲存至資料夾","folder"),m())})):(0,u.a)("無法儲存","warning")}))}function A(t,n,e,a){var c=(0,r.bv)(".j .m .sa .va ._#".concat(t)),l=(0,r.aI)(c,'.ma .na .oa[type="save-to-folder"]');(0,i.aq)(n,e,a).then((function(t){t?(0,i.LH)("stop",e).then((function(t){t&&(l.setAttribute("highlighted",(0,o.xZ)(t)),(0,u.a)("已儲存至資料夾","folder"),m())})):(0,u.a)("無法儲存","warning")}))}function w(t,n){var e=(0,r.bv)('.pk .uk .vk .wk[group="actions"] ._k .al[action="save-to-folder"]');(0,i.Fq)(t,n).then((function(t){t?(0,i.LH)("route",n).then((function(t){t&&(e.setAttribute("highlighted","true"),(0,u.a)("已儲存至資料夾","folder"),m())})):(0,u.a)("無法儲存","warning")}))}function k(t,n){(0,i.Fq)(t,n).then((function(t){t?(0,i.LH)("route",n).then((function(t){t&&((0,u.a)("已儲存至資料夾","folder"),m())})):(0,u.a)("無法儲存","warning")}))}},5009:(t,n,e)=>{e.d(n,{Bb:()=>y,RC:()=>m,rf:()=>p});var r=e(9856),a=e(8134),o=e(4537),i=e(6082),c=e(9119),u=e(3648),l=e(4781),s=e(904);function f(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return d(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?d(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw o}}}}function d(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function v(t,n,e,r,a,o,i){try{var c=t[o](i),u=c.value}catch(t){return void e(t)}c.done?n(u):Promise.resolve(u).then(r,a)}var h=(0,u.bv)(".yc"),b=((0,u.bv)(".yc .zc ._c #search_input"),(0,u.bv)(".yc .up .vp"));function p(){i.m?((0,s.WR)("Search"),h.setAttribute("displayed","true"),(0,r.El)(),(0,a.dD)()):(0,c.a)("資料還在下載中","download_for_offline")}function y(){(0,s.kr)("Search"),(0,r.k_)(),h.setAttribute("displayed","false")}function m(t){return g.apply(this,arguments)}function g(){var t;return t=function*(t){if(!(0,l.iO)(t)){var n,e=["route","location_on","directions_bus"],r=[],i=f((0,a.GU)(t,30));try{for(i.s();!(n=i.n()).done;){var c=n.value,u=c.item.n,s=(0,o.Z)(e[c.item.type]),d="";switch(c.item.type){case 0:d="bus.route.openRoute(".concat(c.item.id,", [").concat(c.item.pid.join(","),"])");break;case 1:d="bus.location.openLocation('".concat(c.item.hash,"')");break;case 2:d="bus.bus.openBus(".concat(c.item.id,")")}r.push('<div class="wp" onclick="'.concat(d,'"><div class="xp">').concat(s,'</div><div class="yp">').concat(u,"</div></div>"))}}catch(t){i.e(t)}finally{i.f()}b.innerHTML=r.join("")}},g=function(){var n=this,e=arguments;return new Promise((function(r,a){var o=t.apply(n,e);function i(t){v(o,r,a,i,c,"next",t)}function c(t){v(o,r,a,i,c,"throw",t)}i(void 0)}))},g.apply(this,arguments)}},6104:(t,n,e)=>{e.d(n,{Ow:()=>g,hP:()=>I,jk:()=>x,os:()=>A,rY:()=>S,vv:()=>w});var r=e(8024),a=e(3648),o=e(3459),i=e(5976),c=e(5427),u=e(4537),l=e(904),s=e(9119),f=e(3251),d=e(4311);function v(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return h(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?h(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw o}}}}function h(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function b(t,n,e,r,a,o,i){try{var c=t[o](i),u=c.value}catch(t){return void e(t)}c.done?n(u):Promise.resolve(u).then(r,a)}function p(t){return function(){var n=this,e=arguments;return new Promise((function(r,a){var o=t.apply(n,e);function i(t){b(o,r,a,i,c,"next",t)}function c(t){b(o,r,a,i,c,"throw",t)}i(void 0)}))}}function y(t){var n=(0,r.zx)("i"),e=document.createElement("div");return e.classList.add("oq"),e.id=n,e.setAttribute("onclick",t.action),e.setAttribute("type",t.type),e.innerHTML='<div class="qq">'.concat((0,u.Z)(t.icon),'</div><div class="rq">').concat(t.name,'</div><div class="tq">').concat(t.status,'</div><div class="uq">').concat((0,u.Z)("arrow_forward_ios"),"</div>"),{element:e,id:n}}function m(){return(m=p((function*(t){var n=yield(0,o.cl)();(0,a.aI)(t,".kq .mq").innerHTML="";var e,r=v(n);try{for(r.s();!(e=r.n()).done;){var i=y(e.value);(0,a.aI)(t,".kq .mq").appendChild(i.element)}}catch(t){r.e(t)}finally{r.f()}}))).apply(this,arguments)}function g(){(0,l.WR)("Settings");var t=(0,a.bv)(".aq");t.setAttribute("displayed","true"),function(t){m.apply(this,arguments)}(t)}function A(){(0,l.kr)("Settings"),(0,a.bv)(".aq").setAttribute("displayed","false")}function w(){return k.apply(this,arguments)}function k(){return(k=p((function*(){var t=yield(0,i.R)();(0,r.MR)(t,"application/json","bus-export.json")}))).apply(this,arguments)}function S(){var t=(0,r.zx)("i"),n=document.createElement("input");n.setAttribute("type","file"),n.setAttribute("accept","application/json"),n.setAttribute("name",t),n.id=t,n.classList.add("zq"),n.addEventListener("change",(function(n){if(0===n.target.files.length)(0,a.bv)("body #".concat(t)).remove();else{var e=n.target.files[0],r=new FileReader;r.onload=function(n){var e=n.target.result;(0,c.Qx)(e).then((function(n){n?(0,s.a)("已匯入資料","check_circle"):(0,s.a)("無法匯入資料","error"),(0,a.bv)("body #".concat(t)).remove()}))},r.readAsText(e)}}),{once:!0}),n.addEventListener("cancel",(function(n){(0,a.bv)("body #".concat(t)).remove()}),{once:!0}),document.body.append(n),(0,a.bv)("body #".concat(t)).click()}function I(){var t=(0,f.NO)();window.open(t)}function x(){(0,d.VC)().then((function(t){switch(t){case"granted":(0,s.a)("已開啟永久儲存","check_circle");break;case"denied":(0,s.a)("永久儲存權限已被拒絕","cancel");break;case"unsupported":(0,s.a)("此瀏覽器不支援永久儲存","warning");break;default:(0,s.a)("發生錯誤","error")}}))}},6166:(t,n,e)=>{e.d(n,{Yi:()=>d,wx:()=>f,yH:()=>s});var r=e(8024),a=e(3648),o=e(3459),i=e(904);function c(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return u(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?u(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw o}}}}function u(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}function l(t,n,e){var a=(0,r.zx)("i"),o=document.createElement("div");return o.classList.add("pq"),o.id=a,o.innerHTML='<div class="sq">'.concat(n.name,'</div><div class="vq"><input type="checkbox" onclick="bus.settings.settingsOptionsHandler(event, \'').concat(t.key,"', ").concat(e,')" ').concat(t.option===e?"checked":"","/></div>"),{element:o,id:a}}function s(t){(0,i.WR)("SettingsOptions");var n=(0,o.PL)(t),e=(0,a.bv)(".bq");e.setAttribute("displayed","true"),(0,a.aI)(e,".dq .jq").innerText=n.name,function(t,n){var e=(0,o.PL)(n),r=(0,a.aI)(t,".lq"),i=(0,a.aI)(r,".nq");(0,a.aI)(r,".yq").innerText=e.description,i.innerHTML="";var u,s=0,f=c(e.options);try{for(f.s();!(u=f.n()).done;){var d=l(e,u.value,s);i.appendChild(d.element),s+=1}}catch(t){f.e(t)}finally{f.f()}}(e,t),(0,i.Z_)()}function f(){(0,a.bv)(".bq").setAttribute("displayed","false"),(0,i.l$)()}function d(t,n,e){var r,i=c((0,a.e0)('.bq .lq .nq .pq .vq input[type="checkbox"]'));try{for(i.s();!(r=i.n()).done;){r.value.checked=!1}}catch(t){i.e(t)}finally{i.f()}t.target.checked=!0,(0,o.aN)(n,e).then((function(t){}))}},9856:(t,n,e)=>{e.d(n,{El:()=>F,Wb:()=>U,_O:()=>$,d$:()=>N,gn:()=>W,k_:()=>Z,mr:()=>z,vp:()=>D});var r=e(5009),a=e(8024),o=e(7968),i=e(3648),c=e(4537),u=e(904),l=e(6141);function s(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=function(t,n){if(t){if("string"==typeof t)return f(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?f(t,n):void 0}}(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var r=0,a=function(){};return{s:a,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==e.return||e.return()}finally{if(c)throw o}}}}function f(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}var d=[["紅","藍","1","2","3"],["綠","棕","4","5","6"],["橘","小","7","8","9"],["鍵盤","幹線","清空","0","刪除"]],v=(0,i.bv)(".yc .zc ._c #search_input"),h=(0,i.bv)(".yc .up .zp"),b=(0,i.bv)(".yc .zc ._c canvas"),p=b.getContext("2d"),y="搜尋路線、地點、公車",m=window.devicePixelRatio,g=15*m,A=1.8*m,w=.9*m,k=4*m,S=25*m,I=20*m,x='"Noto Sans TC", sans-serif',q=(0,l.t)("--a"),L=(0,l.t)("--nf"),T=(0,l.t)("--b"),M=0,j=0,_=0,O=!1,R=0,C=(0,u.gO)("head-one-button"),H=C.width*m,E=C.height*m,P=!1;function z(){C=(0,u.gO)("head-one-button"),H=C.width,E=C.height,b.width=H*m,b.height=E*m,W(v.value,-1,-1)}function F(){!function(){var t,n=[],e=s(d);try{for(e.s();!(t=e.n()).done;){var r,o=s(t.value);try{for(o.s();!(r=o.n()).done;){var i=r.value,u="",l="onmousedown",f="";switch(i){case"刪除":u="bus.search.deleteCharFromInout()",f=(0,c.Z)("backspace");break;case"清空":u="bus.search.emptyInput()",f=i;break;case"鍵盤":u="bus.search.openSystemKeyboard(event)",f=(0,c.Z)("keyboard");break;default:u="bus.search.typeTextIntoInput('".concat(i,"')"),f=i}(0,a.p1)()&&(l="ontouchstart"),n.push('<button class="_p" '.concat(l,'="').concat(u,'">').concat(f,"</button>"))}}catch(t){o.e(t)}finally{o.f()}}}catch(t){e.e(t)}finally{e.f()}h.innerHTML=n.join("")}(),h.setAttribute("displayed","true"),P=!0,B(),W(v.value,-1,-1)}function Z(){h.setAttribute("displayed","false"),P=!1}function D(t){t.preventDefault(),v.focus()}function $(t){var n=String(v.value),e="".concat(n).concat(t);v.value=e,(0,r.RC)(e),W(e,-1,-1)}function N(){var t=String(v.value),n=t.substring(0,t.length-1);v.value=n,(0,r.RC)(n),W(n,-1,-1)}function U(){v.value="",(0,r.RC)(""),W("",-1,-1)}function W(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",n=arguments.length>1?arguments[1]:void 0,e=arguments.length>2?arguments[2]:void 0,r=!1;0===t.length?(t=y,r=!0,n=0,e=0):-1===n&&-1===e&&(e=1*(n=t.length)),C=(0,u.gO)("head-one-button"),H=C.width*m,E=C.height*m,q=(0,l.t)("--a"),L=(0,l.t)("--nf"),T=(0,l.t)("--b"),p.font="500 ".concat(I,"px ").concat(x),p.textAlign="center",p.textBaseline="middle",M=p.measureText(t).width,j=p.measureText(t.substring(0,n)).width,_=p.measureText(t.substring(n,e)).width,R=r?1:Math.max(1,j),p.clearRect(0,0,H,E),n===e?(O=!0,p.globalAlpha=1,p.fillStyle=r?L:q,p.fillText(t,M/2+(Math.min(R,H-g)-R),E/2),(0,o.wg)(p,Math.min(R,H-g),(E-S)/2,A,S,w,T)):(O=!1,p.globalAlpha=.27,(0,o.wg)(p,Math.min(R,H-g),(E-S)/2,_,S,k,T),p.globalAlpha=1,p.fillStyle=r?L:q,p.fillText(t,M/2+(Math.min(R,H-g)-R),E/2),p.globalAlpha=.08,(0,o.wg)(p,Math.min(R,H-g),(E-S)/2,_,S,k,T))}function B(){var t=(new Date).getTime()/400,n=Math.abs(Math.sin(t));O&&(p.globalAlpha=n,p.clearRect(Math.min(R,H-g)-1,0,A+2,E),(0,o.wg)(p,Math.min(R,H-g),(E-S)/2,A,S,w,T)),P&&window.requestAnimationFrame(B)}}}]);
//# sourceMappingURL=d04394c3b017e395c90a.js.map
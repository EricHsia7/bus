"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[150],{972:(e,t,n)=>{n.d(t,{L:()=>d,U:()=>m});var r=n(8024),o=n(2129),i=n(9930),a=n(4781),s=n(6788);function u(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return c(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw i}}}}function c(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function l(e,t,n,r,o,i,a){try{var s=e[i](a),u=s.value}catch(e){return void n(e)}s.done?t(u):Promise.resolve(u).then(r,o)}var p={},f=[],v=!1;function d(){return y.apply(this,arguments)}function y(){var e;return e=function*(){var e,t=(0,r.zx)("r"),n=yield(0,i.z)(t),o={},c=0,l=u(n);try{for(l.s();!(e=l.n()).done;){var d,y=e.value,h=u((0,a.B5)(y,!0));try{for(h.s();!(d=h.n()).done;){var m=`u_${d.value}`;o.hasOwnProperty(m)||(o[m]=[]),o[m].push(c)}}catch(e){h.e(e)}finally{h.f()}c+=1}}catch(e){l.e(e)}finally{l.f()}f=n,p=o,v=!0,(0,s.LQ)(t),(0,s.gC)(t)},y=function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){l(i,r,o,a,s,"next",e)}function s(e){l(i,r,o,a,s,"throw",e)}a(void 0)}))},y.apply(this,arguments)}function h(e,t){var n,r=0,o=0,i=u(t);try{for(i.s();!(n=i.n()).done;){var a=n.value,s=e.indexOf(a,o);s>-1?r+=s:r-=o,o+=1}}catch(e){i.e(e)}finally{i.f()}return e===t&&(r=10*Math.abs(r)),r}function m(e,t){if(!v)return[];var n,r=String(e).toLowerCase(),i=(0,a.B5)(r,!0),s=(0,a.B5)(r,!1),c=[],l=u(i);try{for(l.s();!(n=l.n()).done;){var d=`u_${n.value}`;p.hasOwnProperty(d)&&c.push(p[d])}}catch(e){l.e(e)}finally{l.f()}c.sort((function(e,t){return e.length-t.length}));var y=c.length-1,m=[];if(0===y&&(m=c[0]),y>0)for(var g=0;g<y;g++){var b=c[g],w=c[g+1];m=0===g?(0,o._N)(b,w):(0,o._N)(m,w)}var S,_=[],A=u(m);try{for(A.s();!(S=A.n()).done;){var I=S.value,k=f[I];if(!(0<t))break;var O=h(s,(0,a.B5)(k,!1));_.push({item:k,score:O})}}catch(e){A.e(e)}finally{A.f()}return _.sort((function(e,t){return t.score-e.score})),_}},1238:(e,t,n)=>{n.d(t,{Y:()=>s,q:()=>a});var r=n(574),o=n(3459),i={current:-1,permission:{gained:!1,asked:!1},id:0};function a(){!1===i.permission.asked&&!0===(0,o.Js)("display_user_orientation")&&(i.permission.asked=!0,"undefined"!=typeof DeviceOrientationEvent&&"function"==typeof DeviceOrientationEvent.requestPermission?DeviceOrientationEvent.requestPermission().then((function(e){"granted"===e?window.addEventListener("deviceorientation",(function(e){e.absolute?i.current=(null==e?void 0:e.alpha)||-1:e.webkitCompassHeading?i.current=e.webkitCompassHeading||-1:i.current=(null==e?void 0:e.alpha)||-1}),!0):console.error("Permission not granted for DeviceOrientation")})).catch((function(e){console.error("Error requesting DeviceOrientation permission:",e)})):console.log("DeviceOrientation isn't supported."))}function s(){var e=i.current;if(-1===e)return{degree:-1,cardinalDirection:r.AE};var t=e+90;t>360&&(t-=360),t*=Math.PI/180;var n=[Math.cos(t),Math.sin(t)];return{degree:e,cardinalDirection:(0,r.DK)(n)}}},1531:(e,t,n)=>{n.d(t,{to:()=>u,uQ:()=>l});var r=n(3459),o=n(7183);function i(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return a(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,u=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){u=!0,i=e},f:function(){try{s||null==n.return||n.return()}finally{if(u)throw i}}}}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var s={current:{latitude:0,longitude:0},permission:{gained:!1,asked:!1},id:0};function u(){!1===s.permission.asked&&(0,r.Js)("display_user_location")&&(s.permission.asked=!0,s.id=navigator.geolocation.watchPosition((function(e){s.permission.gained=!0,s.current.latitude=e.coords.latitude,s.current.longitude=e.coords.longitude}),(function(e){var t="";switch(e.code){case e.PERMISSION_DENIED:t="This website does not have permission to use the Geolocation API";break;case e.POSITION_UNAVAILABLE:t="The current position could not be determined.";break;case e.PERMISSION_DENIED_TIMEOUT:t="The current position could not be determined within the specified timeout period."}""==t&&(t="The position could not be determined due to an unknown error (Code: "+e.code.toString()+")."),console.log(t)}),{enableHighAccuracy:!0,timeout:3e4,maximumAge:0}))}function c(){return s.permission.asked&&s.permission.gained?s.current:s.permission.asked||s.permission.gained?s.permission.asked&&!s.permission.gained?s.current:void 0:(u(),s.current)}function l(e){var t,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:450,r=c(),a=[],s=i(e);try{for(s.s();!(t=s.n()).done;){var u=t.value,l=(0,o.aV)(r.latitude,r.longitude,u.latitude,u.longitude);l<=n&&a.push({position:u,distance:l})}}catch(e){s.e(e)}finally{s.f()}return a.length>0?(a=a.sort((function(e,t){return e.distance-t.distance})))[0].position:null}},3251:(e,t,n)=>{n.d(t,{A:()=>f,HL:()=>c,NO:()=>l,iJ:()=>p,kE:()=>u});var r=n(3648);function o(e,t,n,r,o,i,a){try{var s=e[i](a),u=s.value}catch(e){return void n(e)}s.done?t(u):Promise.resolve(u).then(r,o)}function i(e){return function(){var t=this,n=arguments;return new Promise((function(r,i){var a=e.apply(t,n);function s(e){o(a,r,i,s,u,"next",e)}function u(e){o(a,r,i,s,u,"throw",e)}s(void 0)}))}}function a(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new URLSearchParams(window.location.search);n.set("v",e);var r=window.location.pathname+"?"+n.toString();t?window.location.replace(r):history.replaceState(null,"",r)}function s(){return(s=i((function*(){try{var e=yield fetch(`./version.json?_=${(new Date).getTime()}`,{cache:"no-store"});if(!e.ok)throw new Error("Network response was not ok");return e.json()}catch(e){return console.error("There was a problem with the fetch operation:",e),!1}}))).apply(this,arguments)}function u(){return(0,r.bv)('head meta[name="version-hash"]').getAttribute("content")}function c(){return(0,r.bv)('head meta[name="version-branch-name"]').getAttribute("content")}function l(){return`https://github.com/EricHsia7/bus/commit/${(0,r.bv)('head meta[name="version-full-hash"]').getAttribute("content")}`}function p(){return(0,r.bv)('head meta[name="version-time-stamp"]').getAttribute("content")}function f(){return v.apply(this,arguments)}function v(){return v=i((function*(){var e=yield function(){return s.apply(this,arguments)}();return"boolean"==typeof e?!1===e?"fetchError":"unknownError":u()!==e.hash?(a(e.hash,!0),"refreshing"):(a(e.hash,!1),"ok")})),v.apply(this,arguments)}},3459:(e,t,n)=>{n.d(t,{Gn:()=>m,Js:()=>S,PL:()=>w,Yq:()=>v,aN:()=>g,cl:()=>y});var r=n(4311),o=n(5579),i=n(3251),a=n(4636);function s(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return u(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw i}}}}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function c(e,t,n,r,o,i,a){try{var s=e[i](a),u=s.value}catch(e){return void n(e)}s.done?t(u):Promise.resolve(u).then(r,o)}function l(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){c(i,r,o,a,s,"next",e)}function s(e){c(i,r,o,a,s,"throw",e)}a(void 0)}))}}var p=["time_formatting_mode","refresh_interval","display_user_location","display_user_orientation","location_labels","proxy","folder","personal_schedule","notification","playing_animation","power_saving","data_usage","storage","persistent_storage","export","import","version","branch","last_update_date","github"],f={time_formatting_mode:{key:"time_formatting_mode",name:"預估時間格式",icon:"glyphs",status:"",action:"bus.settings.openSettingsOptions('time_formatting_mode')",type:"select",default_option:0,option:0,options:[{name:`${(0,o.fU)(11,3)}/${(0,o.fU)(61,3)}/${(0,o.fU)(3661,3)}`,value:{type:1,number:3},resourceIntensive:!1,powerSavingAlternative:-1},{name:`${(0,o.fU)(11,2)}/${(0,o.fU)(61,2)}/${(0,o.fU)(3661,2)}`,value:{type:1,number:2},resourceIntensive:!1,powerSavingAlternative:-1},{name:`${(0,o.fU)(11,1)}/${(0,o.fU)(61,1)}/${(0,o.fU)(3661,1)}`,value:{type:1,number:1},resourceIntensive:!1,powerSavingAlternative:-1},{name:`${(0,o.fU)(11,0)}/${(0,o.fU)(61,0)}/${(0,o.fU)(3661,0)}`,value:{type:1,number:0},resourceIntensive:!1,powerSavingAlternative:-1}],description:"在首頁、路線頁面、地點頁面上的預估公車到站時間的顯示格式。"},refresh_interval:{key:"refresh_interval",name:"預估時間更新頻率",icon:"pace",status:"",action:"bus.settings.openSettingsOptions('refresh_interval')",type:"select",default_option:0,option:0,options:[{name:"自動",value:{baseInterval:15e3,dynamic:!0,type:3},resourceIntensive:!0,powerSavingAlternative:2},{name:"10秒",value:{baseInterval:1e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:2},{name:"20秒",value:{baseInterval:2e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:3},{name:"30秒",value:{baseInterval:3e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:4},{name:"40秒",value:{baseInterval:4e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:5},{name:"50秒",value:{baseInterval:5e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:6},{name:"60秒",value:{baseInterval:6e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:6}],description:"在首頁、路線頁面、地點頁面上的預估公車到站時間、公車等即時資料更新的頻率。"},display_user_location:{key:"display_user_location",name:"顯示所在位置",icon:"near_me",status:"",action:"bus.settings.openSettingsOptions('display_user_location')",type:"select",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!0,powerSavingAlternative:1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}],description:"是否在路線頁面上標註目前所在位置。若設為開啟，本應用程式將要求位置存取權限。"},display_user_orientation:{key:"display_user_orientation",name:"顯示裝置指向",icon:"explore",status:"",action:"bus.settings.openSettingsOptions('display_user_orientation')",type:"select",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!0,powerSavingAlternative:1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}],description:"是否在地點頁面上顯示裝置所指方向。若設為開啟，本應用程式將要求動作與方向存取權限。"},location_labels:{key:"location_labels",name:"站牌位置標籤",icon:"tag",status:"",action:"bus.settings.openSettingsOptions('location_labels')",type:"select",default_option:0,option:0,options:[{name:"行徑方向",value:{type:0,string:"directions"},resourceIntensive:!1,powerSavingAlternative:-1},{name:"地址特徵",value:{type:0,string:"address"},resourceIntensive:!1,powerSavingAlternative:-1},{name:"英文字母",value:{type:0,string:"letters"},resourceIntensive:!1,powerSavingAlternative:-1}],description:"用於區分位於同個地點的不同站牌。行徑方向表示可搭乘路線從本站到下一站的方向（與車流同向）；地址特徵表示不同站牌的地址差異處；英文字母表示按照順序以字母編號。"},proxy:{key:"proxy",name:"網路代理",icon:"router",status:"",action:"bus.settings.openSettingsOptions('proxy')",type:"select",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!1,powerSavingAlternative:-1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}],description:"使用網路代理來擷取資料。"},folder:{key:"folder",name:"資料夾",icon:"folder",status:"",type:"page",action:"bus.folder.openFolderManager()",description:""},personal_schedule:{key:"personal_schedule",name:"個人化行程",icon:"calendar_view_day",status:"",action:"bus.personalSchedule.openPersonalScheduleManager()",type:"page",description:""},notification:{key:"notification",name:"通知",icon:"notifications",status:"",action:"bus.notification.openNotificationScheduleManager()",type:"page",description:""},playing_animation:{key:"playing_animation",name:"動畫",icon:"animation",description:"是否在介面中播放動畫。",status:"",type:"select",action:"bus.settings.openSettingsOptions('playing_animation')",default_option:0,option:0,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!0,powerSavingAlternative:1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}]},power_saving:{key:"power_saving",name:"省電模式",icon:"battery_low",description:"暫停使用耗電功能來節省電力。",status:"",type:"select",action:"bus.settings.openSettingsOptions('power_saving')",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!1,powerSavingAlternative:-1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}]},data_usage:{key:"data_usage",name:"網路使用量",icon:"bigtop_updates",status:"",type:"page",action:"bus.dataUsage.openDataUsage()",description:""},storage:{key:"storage",name:"儲存空間",icon:"database",status:"",type:"page",action:"bus.storage.openStorage()",description:""},persistent_storage:{key:"persistent_storage",name:"永久儲存",icon:"storage",status:"",action:"bus.settings.showPromptToAskForPersistentStorage()",type:"action",description:"開啟此選項以避免瀏覽器自動刪除重要資料。"},export:{key:"export",name:"匯出資料",icon:"upload",status:"",type:"action",action:"bus.settings.downloadExportFile()",description:""},import:{key:"import",name:"匯入資料",icon:"download",status:"",type:"action",action:"bus.settings.openFileToImportData()",description:""},version:{key:"version",name:"版本",icon:"commit",status:"",type:"info",action:"bus.settings.viewCommitOfCurrentVersion()",description:""},branch:{key:"branch",name:"分支",icon:"rebase",status:"",type:"info",action:"",description:""},last_update_date:{key:"last_update_date",name:"更新時間",icon:"update",status:"",type:"info",action:"",description:""},github:{key:"github",name:"GitHub",icon:"book_2",status:"@EricHsia7/bus",type:"info",action:"",description:""}};function v(){return d.apply(this,arguments)}function d(){return(d=l((function*(){var e,t=s(yield(0,r.Su)(1));try{for(t.s();!(e=t.n()).done;){var n=e.value;if(p.indexOf(n)>-1){var o=yield(0,r.Ct)(1,n);if(null!==o){if("select"===f[n].type){var i=parseInt(o);f[n].option=i}}else"select"===f[n].type&&(f[n].option=f[n].default_option)}}}catch(e){t.e(e)}finally{t.f()}return!0}))).apply(this,arguments)}function y(){return h.apply(this,arguments)}function h(){return(h=l((function*(){var e=[];for(var t in f){var n=f[t];switch(n.type){case"select":n.status=n.options[n.option].name;break;case"page":if("notification"===t)n.status=(0,a.hc)()?"已註冊":"未註冊";else n.status="";break;case"action":n.status="","persistent_storage"===t&&(n.status=(yield(0,r.tH)())?"開啟":"關閉");break;case"info":if("version"===t&&(n.status=(0,i.kE)()),"branch"===t&&(n.status=(0,i.HL)()),"last_update_date"===t){var s=new Date((0,i.iJ)());n.status=(0,o.HN)(s)}}e.push(n)}return e}))).apply(this,arguments)}function m(){var e=[];for(var t in f)if(p.indexOf(t)>-1&&f.hasOwnProperty(t)&&"select"===f[t].type){var n={key:t,option:f[t].option};e.push(n)}return e}function g(e,t){return b.apply(this,arguments)}function b(){return(b=l((function*(e,t){return!!(p.indexOf(e)>-1&&f.hasOwnProperty(e)&&"select"===f[e].type&&void 0!==f[e].options[t]&&null!==f[e].options[t])&&(yield(0,r.mL)(1,e,t),f[e].option=t,!0)}))).apply(this,arguments)}function w(e){if(p.indexOf(e)>-1&&f.hasOwnProperty(e))return f[e]}function S(e){if(p.indexOf(e)>-1&&f.hasOwnProperty(e)){var t=f.power_saving,n=t.options[t.option].value.boolean,r=f[e],o=r.options[r.option];n&&o.resourceIntensive&&(o=r.options[o.powerSavingAlternative]);var i=o.value;switch(i.type){case 0:return i.string;case 1:return i.number;case 2:return i.boolean;case 3:return i;default:return""}}return""}},4311:(e,t,n)=>{function r(e,t,n,r,o,i,a){try{var s=e[i](a),u=s.value}catch(e){return void n(e)}s.done?t(u):Promise.resolve(u).then(r,o)}function o(e){return function(){var t=this,n=arguments;return new Promise((function(o,i){var a=e.apply(t,n);function s(e){r(a,o,i,s,u,"next",e)}function u(e){r(a,o,i,s,u,"throw",e)}s(void 0)}))}}n.d(t,{Ct:()=>l,Su:()=>d,VC:()=>w,iQ:()=>f,le:()=>m,mL:()=>u,pD:()=>h,tH:()=>g});var i=n(3790),a={cacheStore:!1,settingsStore:!1,dataUsageStatsStore:!1,updateRateDataStore:!1,updateRateDataWriteAheadLogStore:!1,busArrivalTimeDataWriteAheadLogStore:!1,busArrivalTimeDataStore:!1,personalScheduleStore:!1,recentViewsStore:!1,notificationStore:!1,notificationScheduleStore:!1,folderListStore:!1,folderContentIndexStore:!1,folderContentStore:!1},s=["cacheStore","settingsStore","dataUsageStatsStore","updateRateDataStore","updateRateDataWriteAheadLogStore","busArrivalTimeDataWriteAheadLogStore","busArrivalTimeDataStore","personalScheduleStore","recentViewsStore","notificationStore","notificationScheduleStore","folderListStore","folderContentIndexStore","folderContentStore"];function u(e,t,n){return c.apply(this,arguments)}function c(){return(c=o((function*(e,t,n){try{var r=s[e];return!1===a[r]&&(a[r]=yield i.createInstance({name:r})),yield a[r].setItem(t,n)}catch(e){return console.error(e),null}}))).apply(this,arguments)}function l(e,t){return p.apply(this,arguments)}function p(){return(p=o((function*(e,t){try{var n=s[e];return!1===a[n]&&(a[n]=yield i.createInstance({name:n})),yield a[n].getItem(t)}catch(e){return console.error(e),null}}))).apply(this,arguments)}function f(e,t){return v.apply(this,arguments)}function v(){return(v=o((function*(e,t){try{var n=s[e];return!1===a[n]&&(a[n]=yield i.createInstance({name:n})),yield a[n].removeItem(t)}catch(e){return console.error(e),null}}))).apply(this,arguments)}function d(e){return y.apply(this,arguments)}function y(){return(y=o((function*(e){try{var t=s[e];return!1===a[t]&&(a[t]=yield i.createInstance({name:t})),yield a[t].keys()}catch(e){return console.error(e),[]}}))).apply(this,arguments)}function h(e){return s[e]}function m(){return s.length}function g(){return b.apply(this,arguments)}function b(){return(b=o((function*(){if(navigator.storage&&navigator.storage.persist)return yield navigator.storage.persisted();return!1}))).apply(this,arguments)}function w(){return S.apply(this,arguments)}function S(){return(S=o((function*(){if(navigator.storage&&navigator.storage.persist)return(yield navigator.storage.persist())?"granted":"denied";return"unsupported"}))).apply(this,arguments)}},8134:(e,t,n)=>{n.d(t,{F6:()=>g,GU:()=>O,Rk:()=>h,dD:()=>A,k9:()=>d});var r=n(4293),o=n(8011),i=n(8024),a=n(2129),s=n(4781),u=n(9734),c=n(6788);function l(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return p(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?p(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return a=e.done,e},e:function(e){s=!0,i=e},f:function(){try{a||null==n.return||n.return()}finally{if(s)throw i}}}}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function f(e,t,n,r,o,i,a){try{var s=e[i](a),u=s.value}catch(e){return void n(e)}s.done?t(u):Promise.resolve(u).then(r,o)}function v(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var i=e.apply(t,n);function a(e){f(i,r,o,a,s,"next",e)}function s(e){f(i,r,o,a,s,"throw",e)}a(void 0)}))}}function d(e){return y.apply(this,arguments)}function y(){return(y=v((function*(e){var t=(0,i.zx)("r"),n=yield(0,r.a)(t,!0),o=[];for(var a in n){var s=n[a];String(s.n).indexOf(e)>-1&&o.push(s)}return(0,c.LQ)(t),(0,c.gC)(t),o}))).apply(this,arguments)}function h(e){return m.apply(this,arguments)}function m(){return(m=v((function*(e){var t=(0,i.zx)("r"),n=yield(0,r.a)(t,!0),o=!1,a={},s=`r_${e}`;return n.hasOwnProperty(s)&&(a=n[s],o=!0),(0,c.LQ)(t),(0,c.gC)(t),!!o&&a}))).apply(this,arguments)}function g(e){return b.apply(this,arguments)}function b(){return(b=v((function*(e){var t=(0,i.zx)("r"),n=yield(0,r.a)(t,!0),o=[];for(var a in n){var s=n[a];String(s.pid).indexOf(e)>-1&&o.push(s)}return(0,c.LQ)(t),(0,c.gC)(t),o}))).apply(this,arguments)}var w={},S=[],_=!1;function A(){return I.apply(this,arguments)}function I(){return(I=v((function*(){var e=(0,i.zx)("r"),t=yield(0,r.a)(e,!0),n=yield(0,o.g)(e,!0),a=yield(0,u.j)(e,!0),p={},f=[],v=0;for(var d in t){var y=t[d],h={id:y.id,pid:y.pid,dep:y.dep,des:y.des,n:y.n,hash:"",lo:"",la:"",r:"",s:"",type:0};f.push(h);var m,g=l((0,s.B5)(`${h.n.toLowerCase()}${h.dep.toLowerCase()}${h.des.toLowerCase()}`,!0));try{for(g.s();!(m=g.n()).done;){var b=`u_${m.value}`;p.hasOwnProperty(b)||(p[b]=[]),p[b].push(v)}}catch(e){g.e(e)}finally{g.f()}v+=1}for(var A in n){var I=n[A],k={id:I.id,n:I.n,lo:I.lo,la:I.la,r:I.r,s:I.s,hash:I.hash,dep:"",des:"",pid:[],type:1};f.push(k);var O,x=l((0,s.B5)(k.n.toLowerCase(),!0));try{for(x.s();!(O=x.n()).done;){var P=`u_${O.value}`;p.hasOwnProperty(P)||(p[P]=[]),p[P].push(v)}}catch(e){x.e(e)}finally{x.f()}v+=1}for(var C in a){var L=a[C],$={id:L.BusId,pid:[],dep:"",des:"",n:L.CarNum,hash:"",lo:"",la:"",r:"",s:"",type:2};f.push($);var D,E=l((0,s.B5)($.n.toLowerCase(),!0));try{for(E.s();!(D=E.n()).done;){var U=`u_${D.value}`;p.hasOwnProperty(U)||(p[U]=[]),p[U].push(v)}}catch(e){E.e(e)}finally{E.f()}v+=1}w=p,S=f,_=!0,(0,c.LQ)(e),(0,c.gC)(e)}))).apply(this,arguments)}function k(e,t){var n,r=0,o=0,i=l(t);try{for(i.s();!(n=i.n()).done;){var a=n.value;r+=e.indexOf(a,o)-o,o+=1}}catch(e){i.e(e)}finally{i.f()}return e===t&&(r=10*Math.abs(r)),r}function O(e,t,n){if(!_)return[];var r,o=e.toLowerCase(),i=(0,s.B5)(o,!0),u=(0,s.B5)(o,!1),c=[],p=l(i);try{for(p.s();!(r=p.n()).done;){var f=`u_${r.value}`;w.hasOwnProperty(f)&&c.push(w[f])}}catch(e){p.e(e)}finally{p.f()}c.sort((function(e,t){return e.length-t.length}));var v=c.length-1,d=[];if(0===v&&(d=c[0]),v>0)for(var y=0;y<v;y++){var h=c[y],m=c[y+1];d=0===y?(0,a._N)(h,m):(0,a._N)(d,m)}var g=[],b=0,A=new Set;if(-1===t||2===t){var I,O=S.filter((function(e){return e.n===o&&2===e.type})),x=l(O);try{for(x.s();!(I=x.n()).done;){var P=I.value;if(g.push({item:P,score:1/0}),A.add(P.id),(b+=1)>=n)break}}catch(e){x.e(e)}finally{x.f()}}if(b<n){var C,L=l(d);try{for(L.s();!(C=L.n()).done;){var $=C.value,D=S[$];if((-1===t||t===D.type)&&!A.has(D.id)){var E=k(u,(0,s.B5)(D.n,!1));if(!(b<n))break;g.push({item:D,score:E}),b+=1}}}catch(e){L.e(e)}finally{L.f()}}return g.sort((function(e,t){return t.score-e.score})),g}}}]);
//# sourceMappingURL=0686f411a0882662c24e.js.map
/*! For license information please see d3d72cec874d15cb8c80.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[998],{3459:(t,e,n)=>{n.d(e,{Gn:()=>m,Js:()=>x,PL:()=>_,Yq:()=>v,aN:()=>b,cl:()=>d});var r=n(4311),o=n(5579),a=n(3251);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function s(){s=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,o=Object.defineProperty||function(t,e,n){t[e]=n.value},a="function"==typeof Symbol?Symbol:{},c=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",l=a.toStringTag||"@@toStringTag";function p(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{p({},"")}catch(t){p=function(t,e,n){return t[e]=n}}function f(t,e,n,r){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),s=new N(r||[]);return o(i,"_invoke",{value:I(t,n,s)}),i}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var v="suspendedStart",y="suspendedYield",d="executing",g="completed",m={};function b(){}function w(){}function _(){}var x={};p(x,c,(function(){return this}));var k=Object.getPrototypeOf,S=k&&k(k(G([])));S&&S!==n&&r.call(S,c)&&(x=S);var L=_.prototype=b.prototype=Object.create(x);function E(t){["next","throw","return"].forEach((function(e){p(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function n(o,a,s,c){var u=h(t[o],t,a);if("throw"!==u.type){var l=u.arg,p=l.value;return p&&"object"==i(p)&&r.call(p,"__await")?e.resolve(p.__await).then((function(t){n("next",t,s,c)}),(function(t){n("throw",t,s,c)})):e.resolve(p).then((function(t){l.value=t,s(l)}),(function(t){return n("throw",t,s,c)}))}c(u.arg)}var a;o(this,"_invoke",{value:function(t,r){function o(){return new e((function(e,o){n(t,r,e,o)}))}return a=a?a.then(o,o):o()}})}function I(e,n,r){var o=v;return function(a,i){if(o===d)throw Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:t,done:!0}}for(r.method=a,r.arg=i;;){var s=r.delegate;if(s){var c=A(s,r);if(c){if(c===m)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===v)throw o=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=d;var u=h(e,n,r);if("normal"===u.type){if(o=r.done?g:y,u.arg===m)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(o=g,r.method="throw",r.arg=u.arg)}}}function A(e,n){var r=n.method,o=e.iterator[r];if(o===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,A(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var a=h(o,e.iterator,n.arg);if("throw"===a.type)return n.method="throw",n.arg=a.arg,n.delegate=null,m;var i=a.arg;return i?i.done?(n[e.resultName]=i.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,m):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,m)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function G(e){if(e||""===e){var n=e[c];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function n(){for(;++o<e.length;)if(r.call(e,o))return n.value=e[o],n.done=!1,n;return n.value=t,n.done=!0,n};return a.next=a}}throw new TypeError(i(e)+" is not iterable")}return w.prototype=_,o(L,"constructor",{value:_,configurable:!0}),o(_,"constructor",{value:w,configurable:!0}),w.displayName=p(_,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,p(t,l,"GeneratorFunction")),t.prototype=Object.create(L),t},e.awrap=function(t){return{__await:t}},E(O.prototype),p(O.prototype,u,(function(){return this})),e.AsyncIterator=O,e.async=function(t,n,r,o,a){void 0===a&&(a=Promise);var i=new O(f(t,n,r,o),a);return e.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(L),p(L,l,"Generator"),p(L,c,(function(){return this})),p(L,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=G,N.prototype={constructor:N,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return s.type="throw",s.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;P(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:G(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),m}},e}function c(t,e){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,e){if(t){if("string"==typeof t)return u(t,e);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){n&&(t=n);var r=0,o=function(){};return{s:o,n:function(){return r>=t.length?{done:!0}:{done:!1,value:t[r++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,s=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return i=t.done,t},e:function(t){s=!0,a=t},f:function(){try{i||null==n.return||n.return()}finally{if(s)throw a}}}}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function l(t,e,n,r,o,a,i){try{var s=t[a](i),c=s.value}catch(t){return void n(t)}s.done?e(c):Promise.resolve(c).then(r,o)}function p(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function i(t){l(a,r,o,i,s,"next",t)}function s(t){l(a,r,o,i,s,"throw",t)}i(void 0)}))}}var f=["time_formatting_mode","refresh_interval","display_user_location","location_labels","proxy","folder","personal_schedule","playing_animation","power_saving","data_usage","storage","persistent_storage","export","import","version","branch","last_update_date","github"],h={time_formatting_mode:{key:"time_formatting_mode",name:"預估時間格式",icon:"glyphs",status:"",action:"bus.settings.openSettingsOptions('time_formatting_mode')",type:"select",default_option:0,option:0,options:[{name:"".concat((0,o.fU)(11,3),"/").concat((0,o.fU)(61,3),"/").concat((0,o.fU)(3661,3)),value:{type:1,number:3},resourceIntensive:!1,powerSavingAlternative:-1},{name:"".concat((0,o.fU)(11,2),"/").concat((0,o.fU)(61,2),"/").concat((0,o.fU)(3661,2)),value:{type:1,number:2},resourceIntensive:!1,powerSavingAlternative:-1},{name:"".concat((0,o.fU)(11,1),"/").concat((0,o.fU)(61,1),"/").concat((0,o.fU)(3661,1)),value:{type:1,number:1},resourceIntensive:!1,powerSavingAlternative:-1},{name:"".concat((0,o.fU)(11,0),"/").concat((0,o.fU)(61,0),"/").concat((0,o.fU)(3661,0)),value:{type:1,number:0},resourceIntensive:!1,powerSavingAlternative:-1}],description:"在首頁、路線頁面、地點頁面上的預估公車到站時間的顯示格式。"},refresh_interval:{key:"refresh_interval",name:"預估時間更新頻率",icon:"pace",status:"",action:"bus.settings.openSettingsOptions('refresh_interval')",type:"select",default_option:3,option:3,options:[{name:"自動",value:{baseInterval:15e3,dynamic:!0,type:3},resourceIntensive:!0,powerSavingAlternative:2},{name:"10秒",value:{baseInterval:1e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:2},{name:"20秒",value:{baseInterval:2e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:3},{name:"30秒",value:{baseInterval:3e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:4},{name:"40秒",value:{baseInterval:4e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:5},{name:"50秒",value:{baseInterval:5e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:6},{name:"60秒",value:{baseInterval:6e4,dynamic:!1,type:3},resourceIntensive:!0,powerSavingAlternative:6}],description:"在首頁、路線頁面、地點頁面上的預估公車到站時間、公車等即時資料更新的頻率。"},display_user_location:{key:"display_user_location",name:"顯示所在位置",icon:"near_me",status:"",action:"bus.settings.openSettingsOptions('display_user_location')",type:"select",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!0,powerSavingAlternative:1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}],description:"是否在路線頁面上標註目前所在位置。若設為開啟，本應用程式將要求位置存取權限。"},location_labels:{key:"location_labels",name:"站牌位置標籤",icon:"tag",status:"",action:"bus.settings.openSettingsOptions('location_labels')",type:"select",default_option:0,option:0,options:[{name:"行徑方向",value:{type:0,string:"directions"},resourceIntensive:!1,powerSavingAlternative:-1},{name:"地址特徵",value:{type:0,string:"address"},resourceIntensive:!1,powerSavingAlternative:-1},{name:"英文字母",value:{type:0,string:"letters"},resourceIntensive:!1,powerSavingAlternative:-1}],description:"用於區分位於同個地點的不同站牌。行徑方向表示可搭乘路線從本站到下一站的方向；地址特徵表示不同站牌的地址差異處；英文字母表示按照順序以字母編號。"},proxy:{key:"proxy",name:"網路代理",icon:"router",status:"",action:"bus.settings.openSettingsOptions('proxy')",type:"select",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!1,powerSavingAlternative:-1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}],description:"使用網路代理來擷取資料。"},folder:{key:"folder",name:"資料夾",icon:"folder",status:"",type:"page",action:"bus.folder.openFolderManager()",description:""},personal_schedule:{key:"personal_schedule",name:"個人化行程",icon:"calendar_view_day",status:"",action:"bus.personalSchedule.openPersonalScheduleManager()",type:"page",description:""},playing_animation:{key:"playing_animation",name:"動畫",icon:"animation",description:"是否在介面中播放動畫。",status:"",type:"select",action:"bus.settings.openSettingsOptions('playing_animation')",default_option:0,option:0,options:[{name:"開啟",value:{type:2,boolean:!0},resourceIntensive:!0,powerSavingAlternative:1},{name:"關閉",value:{type:2,boolean:!1},resourceIntensive:!1,powerSavingAlternative:-1}]},power_saving:{key:"power_saving",name:"省電模式",icon:"battery_low",description:"暫停使用耗電功能來節省電力。",status:"",type:"select",action:"bus.settings.openSettingsOptions('power_saving')",default_option:0,option:0,options:[{name:"關閉",value:{type:0,string:"off"},resourceIntensive:!1,powerSavingAlternative:-1},{name:"開啟",value:{type:0,string:"on"},resourceIntensive:!1,powerSavingAlternative:-1},{name:"開啟直到下次使用",value:{type:0,string:"on_until_next_launch"},resourceIntensive:!1,powerSavingAlternative:-1}]},data_usage:{key:"data_usage",name:"網路使用量",icon:"bigtop_updates",status:"",type:"page",action:"bus.dataUsage.openDataUsage()",description:""},storage:{key:"storage",name:"儲存空間",icon:"database",status:"",type:"page",action:"bus.storage.openStorage()",description:""},persistent_storage:{key:"persistent_storage",name:"永久儲存",icon:"storage",status:"",action:"bus.settings.showPromptToAskForPersistentStorage()",type:"action",description:"開啟此選項以避免瀏覽器自動刪除重要資料。"},export:{key:"export",name:"匯出資料",icon:"upload",status:"",type:"action",action:"bus.settings.downloadExportFile()",description:""},import:{key:"import",name:"匯入資料",icon:"download",status:"",type:"action",action:"bus.settings.openFileToImportData()",description:""},version:{key:"version",name:"版本",icon:"commit",status:"",type:"info",action:"bus.settings.viewCommitOfCurrentVersion()",description:""},branch:{key:"branch",name:"分支",icon:"rebase",status:"",type:"info",action:"",description:""},last_update_date:{key:"last_update_date",name:"更新時間",icon:"update",status:"",type:"info",action:"",description:""},github:{key:"github",name:"GitHub",icon:"book_2",status:"@EricHsia7/bus",type:"info",action:"",description:""}};function v(){return y.apply(this,arguments)}function y(){return(y=p(s().mark((function t(){var e,n,o,a,i,u;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,r.Su)(1);case 2:e=t.sent,n=c(e),t.prev=4,n.s();case 6:if((o=n.n()).done){t.next=15;break}if(a=o.value,!(f.indexOf(a)>-1)){t.next=13;break}return t.next=11,(0,r.Ct)(1,a);case 11:null!==(i=t.sent)?"select"===h[a].type&&(u=parseInt(i),h[a].option=u):"select"===h[a].type&&(h[a].option=h[a].default_option);case 13:t.next=6;break;case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(4),n.e(t.t0);case 20:return t.prev=20,n.f(),t.finish(20);case 23:case"end":return t.stop()}}),t,null,[[4,17,20,23]])})))).apply(this,arguments)}function d(){return g.apply(this,arguments)}function g(){return(g=p(s().mark((function t(){var e,n,i,c;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=[],t.t0=s().keys(h);case 2:if((t.t1=t.t0()).done){t.next=31;break}n=t.t1.value,i=h[n],t.t2=i.type,t.next="select"===t.t2?8:"page"===t.t2?10:"action"===t.t2?12:"info"===t.t2?23:27;break;case 8:return i.status=i.options[i.option].name,t.abrupt("break",28);case 10:return i.status="",t.abrupt("break",28);case 12:if(i.status="","persistent_storage"!==n){t.next=22;break}return t.next=16,(0,r.tH)();case 16:if(!t.sent){t.next=20;break}t.t3="開啟",t.next=21;break;case 20:t.t3="關閉";case 21:i.status=t.t3;case 22:return t.abrupt("break",28);case 23:return"version"===n&&(i.status=(0,a.kE)()),"branch"===n&&(i.status=(0,a.HL)()),"last_update_date"===n&&(c=new Date((0,a.iJ)()),i.status=(0,o.HN)(c)),t.abrupt("break",28);case 27:return t.abrupt("break",28);case 28:e.push(i),t.next=2;break;case 31:return t.abrupt("return",e);case 32:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function m(){var t=[];for(var e in h)if(f.indexOf(e)>-1&&h.hasOwnProperty(e)&&"select"===h[e].type){var n={key:e,option:h[e].option};t.push(n)}return t}function b(t,e){return w.apply(this,arguments)}function w(){return(w=p(s().mark((function t(e,n){return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(f.indexOf(e)>-1)){t.next=8;break}if(!h.hasOwnProperty(e)){t.next=8;break}if("select"!==h[e].type){t.next=8;break}if(void 0===h[e].options[n]||null===h[e].options[n]){t.next=8;break}return t.next=6,(0,r.mL)(1,e,n);case 6:return h[e].option=n,t.abrupt("return",!0);case 8:return t.abrupt("return",!1);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function _(t){if(f.indexOf(t)>-1&&h.hasOwnProperty(t))return h[t]}function x(t){if(f.indexOf(t)>-1&&h.hasOwnProperty(t)){var e=h.power_saving,n=e.options[e.option].value.string,r=h[t],o=r.options[r.option];"on"!==n&&"on_until_next_launch"!==n||o.resourceIntensive&&(o=r.options[o.powerSavingAlternative]);var a=o.value;switch(a.type){case 0:return a.string;case 1:return a.number;case 2:return a.boolean;case 3:return a;default:return""}}return""}},3251:(t,e,n)=>{n.d(e,{A:()=>y,HL:()=>f,NO:()=>h,iJ:()=>v,kE:()=>p});var r=n(3648);function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function a(){a=function(){return e};var t,e={},n=Object.prototype,r=n.hasOwnProperty,i=Object.defineProperty||function(t,e,n){t[e]=n.value},s="function"==typeof Symbol?Symbol:{},c=s.iterator||"@@iterator",u=s.asyncIterator||"@@asyncIterator",l=s.toStringTag||"@@toStringTag";function p(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{p({},"")}catch(t){p=function(t,e,n){return t[e]=n}}function f(t,e,n,r){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),s=new N(r||[]);return i(a,"_invoke",{value:I(t,n,s)}),a}function h(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var v="suspendedStart",y="suspendedYield",d="executing",g="completed",m={};function b(){}function w(){}function _(){}var x={};p(x,c,(function(){return this}));var k=Object.getPrototypeOf,S=k&&k(k(G([])));S&&S!==n&&r.call(S,c)&&(x=S);var L=_.prototype=b.prototype=Object.create(x);function E(t){["next","throw","return"].forEach((function(e){p(t,e,(function(t){return this._invoke(e,t)}))}))}function O(t,e){function n(a,i,s,c){var u=h(t[a],t,i);if("throw"!==u.type){var l=u.arg,p=l.value;return p&&"object"==o(p)&&r.call(p,"__await")?e.resolve(p.__await).then((function(t){n("next",t,s,c)}),(function(t){n("throw",t,s,c)})):e.resolve(p).then((function(t){l.value=t,s(l)}),(function(t){return n("throw",t,s,c)}))}c(u.arg)}var a;i(this,"_invoke",{value:function(t,r){function o(){return new e((function(e,o){n(t,r,e,o)}))}return a=a?a.then(o,o):o()}})}function I(e,n,r){var o=v;return function(a,i){if(o===d)throw Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:t,done:!0}}for(r.method=a,r.arg=i;;){var s=r.delegate;if(s){var c=A(s,r);if(c){if(c===m)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(o===v)throw o=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o=d;var u=h(e,n,r);if("normal"===u.type){if(o=r.done?g:y,u.arg===m)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(o=g,r.method="throw",r.arg=u.arg)}}}function A(e,n){var r=n.method,o=e.iterator[r];if(o===t)return n.delegate=null,"throw"===r&&e.iterator.return&&(n.method="return",n.arg=t,A(e,n),"throw"===n.method)||"return"!==r&&(n.method="throw",n.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var a=h(o,e.iterator,n.arg);if("throw"===a.type)return n.method="throw",n.arg=a.arg,n.delegate=null,m;var i=a.arg;return i?i.done?(n[e.resultName]=i.value,n.next=e.nextLoc,"return"!==n.method&&(n.method="next",n.arg=t),n.delegate=null,m):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,m)}function j(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function N(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(j,this),this.reset(!0)}function G(e){if(e||""===e){var n=e[c];if(n)return n.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function n(){for(;++a<e.length;)if(r.call(e,a))return n.value=e[a],n.done=!1,n;return n.value=t,n.done=!0,n};return i.next=i}}throw new TypeError(o(e)+" is not iterable")}return w.prototype=_,i(L,"constructor",{value:_,configurable:!0}),i(_,"constructor",{value:w,configurable:!0}),w.displayName=p(_,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,_):(t.__proto__=_,p(t,l,"GeneratorFunction")),t.prototype=Object.create(L),t},e.awrap=function(t){return{__await:t}},E(O.prototype),p(O.prototype,u,(function(){return this})),e.AsyncIterator=O,e.async=function(t,n,r,o,a){void 0===a&&(a=Promise);var i=new O(f(t,n,r,o),a);return e.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(L),p(L,l,"Generator"),p(L,c,(function(){return this})),p(L,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},e.values=G,N.prototype={constructor:N,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var n in this)"t"===n.charAt(0)&&r.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var n=this;function o(r,o){return s.type="throw",s.arg=e,n.next=r,o&&(n.method="next",n.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),u=r.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),P(n),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;P(n)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,n,r){return this.delegate={iterator:G(e),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=t),m}},e}function i(t,e,n,r,o,a,i){try{var s=t[a](i),c=s.value}catch(t){return void n(t)}s.done?e(c):Promise.resolve(c).then(r,o)}function s(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function s(t){i(a,r,o,s,c,"next",t)}function c(t){i(a,r,o,s,c,"throw",t)}s(void 0)}))}}function c(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=new URLSearchParams(window.location.search);n.set("v",t);var r=window.location.pathname+"?"+n.toString();e?window.location.replace(r):history.replaceState(null,"",r)}function u(){return l.apply(this,arguments)}function l(){return(l=s(a().mark((function t(){var e;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("./version.json?_=".concat((new Date).getTime()),{cache:"no-store"});case 3:if((e=t.sent).ok){t.next=6;break}throw new Error("Network response was not ok");case 6:return t.abrupt("return",e.json());case 9:return t.prev=9,t.t0=t.catch(0),console.error("There was a problem with the fetch operation:",t.t0),t.abrupt("return",{build:null,hash:null,fullHash:null,branchName:null});case 13:case"end":return t.stop()}}),t,null,[[0,9]])})))).apply(this,arguments)}function p(){return(0,r.bv)('head meta[name="version-hash"]').getAttribute("content")}function f(){return(0,r.bv)('head meta[name="version-branch-name"]').getAttribute("content")}function h(){var t=(0,r.bv)('head meta[name="version-full-hash"]').getAttribute("content");return"https://github.com/EricHsia7/bus/commit/".concat(t)}function v(){return(0,r.bv)('head meta[name="version-time-stamp"]').getAttribute("content")}function y(){return d.apply(this,arguments)}function d(){return(d=s(a().mark((function t(){var e;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u();case 2:if(!(e=t.sent)){t.next=17;break}if(null===e.hash){t.next=14;break}if(p()===e.hash){t.next=10;break}return c(e.hash,!0),t.abrupt("return",{status:"refreshing"});case 10:return c(e.hash,!1),t.abrupt("return",{status:"ok"});case 12:t.next=15;break;case 14:return t.abrupt("return",{status:"fetchError"});case 15:t.next=18;break;case 17:return t.abrupt("return",{status:"unknownError"});case 18:case"end":return t.stop()}}),t)})))).apply(this,arguments)}}}]);
//# sourceMappingURL=d3d72cec874d15cb8c80.js.map
/*! For license information please see a9a6fea7a66e5da009b4.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[998],{3459:(t,e,r)=>{r.d(e,{Gn:()=>g,Js:()=>_,PL:()=>x,Yq:()=>y,aN:()=>b,cl:()=>d});var n=r(4311),o=r(5579),a=r(3251);function i(t){return i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i(t)}function c(){c=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},u=a.iterator||"@@iterator",s=a.asyncIterator||"@@asyncIterator",l=a.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new I(n||[]);return o(i,"_invoke",{value:j(t,r,c)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=p;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function b(){}function w(){}function x(){}var _={};f(_,u,(function(){return this}));var k=Object.getPrototypeOf,L=k&&k(k(T([])));L&&L!==r&&n.call(L,u)&&(_=L);var E=x.prototype=b.prototype=Object.create(_);function O(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(o,a,c,u){var s=h(t[o],t,a);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==i(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,u)}))}u(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function j(e,r,n){var o=y;return function(a,i){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var s=h(e,r,n);if("normal"===s.type){if(o=n.done?m:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function P(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,P(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=h(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function G(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function T(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(i(e)+" is not iterable")}return w.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,l,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},O(S.prototype),f(S.prototype,s,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new S(p(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},O(E),f(E,l,"Generator"),f(E,u,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=T,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(G),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),G(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;G(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:T(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function u(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return s(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?s(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw a}}}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function l(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function f(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){l(a,n,o,i,c,"next",t)}function c(t){l(a,n,o,i,c,"throw",t)}i(void 0)}))}}var p=["time_formatting_mode","refresh_interval","display_user_location","location_labels","proxy","folder","personal_schedule","data_usage","storage","persistent_storage","export","import","version","branch","last_update_date","github"],h={time_formatting_mode:{key:"time_formatting_mode",name:"預估時間格式",icon:"glyphs",status:"",action:"bus.settings.openSettingsOptions('time_formatting_mode')",type:"select",default_option:0,option:0,options:[{name:"".concat((0,o.fU)(11,3),"/").concat((0,o.fU)(61,3),"/").concat((0,o.fU)(3661,3)),value:{type:1,number:3}},{name:"".concat((0,o.fU)(11,2),"/").concat((0,o.fU)(61,2),"/").concat((0,o.fU)(3661,2)),value:{type:1,number:2}},{name:"".concat((0,o.fU)(11,1),"/").concat((0,o.fU)(61,1),"/").concat((0,o.fU)(3661,1)),value:{type:1,number:1}},{name:"".concat((0,o.fU)(11,0),"/").concat((0,o.fU)(61,0),"/").concat((0,o.fU)(3661,0)),value:{type:1,number:0}}],description:"在首頁、路線頁面、地點頁面上的預估公車到站時間的顯示格式。"},refresh_interval:{key:"refresh_interval",name:"預估時間更新頻率",icon:"pace",status:"",action:"bus.settings.openSettingsOptions('refresh_interval')",type:"select",default_option:3,option:3,options:[{name:"自動",value:{baseInterval:15e3,dynamic:!0,type:3}},{name:"10秒",value:{baseInterval:1e4,dynamic:!1,type:3}},{name:"20秒",value:{baseInterval:2e4,dynamic:!1,type:3}},{name:"30秒",value:{baseInterval:3e4,dynamic:!1,type:3}},{name:"40秒",value:{baseInterval:4e4,dynamic:!1,type:3}},{name:"50秒",value:{baseInterval:5e4,dynamic:!1,type:3}},{name:"60秒",value:{baseInterval:6e4,dynamic:!1,type:3}}],description:"在首頁、路線頁面、地點頁面上的預估公車到站時間、公車等即時資料更新的頻率。"},display_user_location:{key:"display_user_location",name:"顯示所在位置",icon:"near_me",status:"",action:"bus.settings.openSettingsOptions('display_user_location')",type:"select",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0}},{name:"關閉",value:{type:2,boolean:!1}}],description:"是否在路線頁面上標註目前所在位置。若設為開啟，本應用程式將要求位置存取權限。"},location_labels:{key:"location_labels",name:"站牌位置標籤",icon:"tag",status:"",action:"bus.settings.openSettingsOptions('location_labels')",type:"select",default_option:0,option:0,options:[{name:"行徑方向",value:{type:0,string:"directions"}},{name:"地址特徵",value:{type:0,string:"address"}},{name:"英文字母",value:{type:0,string:"letters"}}],description:"用於區分位於同個地點的不同站牌。行徑方向表示可搭乘路線從本站到下一站的方向；地址特徵表示不同站牌的地址差異處；英文字母表示按照順序以字母編號。"},proxy:{key:"proxy",name:"網路代理",icon:"router",status:"",action:"bus.settings.openSettingsOptions('proxy')",type:"select",default_option:1,option:1,options:[{name:"開啟",value:{type:2,boolean:!0}},{name:"關閉",value:{type:2,boolean:!1}}],description:"使用網路代理來擷取資料。"},folder:{key:"folder",name:"資料夾",icon:"folder",status:"",type:"page",action:"bus.folder.openFolderManager()",description:""},personal_schedule:{key:"personal_schedule",name:"個人化行程",icon:"calendar_view_day",status:"",action:"bus.personalSchedule.openPersonalScheduleManager()",type:"page",description:""},data_usage:{key:"data_usage",name:"網路使用量",icon:"bigtop_updates",status:"",type:"page",action:"bus.dataUsage.openDataUsage()",description:""},storage:{key:"storage",name:"儲存空間",icon:"database",status:"",type:"page",action:"bus.storage.openStorage()",description:""},persistent_storage:{key:"persistent_storage",name:"永久儲存",icon:"storage",status:"",action:"bus.settings.showPromptToAskForPersistentStorage()",type:"action",description:"開啟此選項以避免瀏覽器自動刪除重要資料。"},export:{key:"export",name:"匯出資料",icon:"upload",status:"",type:"action",action:"bus.settings.downloadExportFile()",description:""},import:{key:"import",name:"匯入資料",icon:"download",status:"",type:"action",action:"bus.settings.openFileToImportData()",description:""},version:{key:"version",name:"版本",icon:"commit",status:"",type:"info",action:"bus.settings.viewCommitOfCurrentVersion()",description:""},branch:{key:"branch",name:"分支",icon:"rebase",status:"",type:"info",action:"",description:""},last_update_date:{key:"last_update_date",name:"更新時間",icon:"update",status:"",type:"info",action:"",description:""},github:{key:"github",name:"GitHub",icon:"book_2",status:"@EricHsia7/bus",type:"info",action:"",description:""}};function y(){return v.apply(this,arguments)}function v(){return(v=f(c().mark((function t(){var e,r,o,a,i,s;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,n.Su)(1);case 2:e=t.sent,r=u(e),t.prev=4,r.s();case 6:if((o=r.n()).done){t.next=15;break}if(a=o.value,!(p.indexOf(a)>-1)){t.next=13;break}return t.next=11,(0,n.Ct)(1,a);case 11:null!==(i=t.sent)?"select"===h[a].type&&(s=parseInt(i),h[a].option=s):"select"===h[a].type&&(h[a].option=h[a].default_option);case 13:t.next=6;break;case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(4),r.e(t.t0);case 20:return t.prev=20,r.f(),t.finish(20);case 23:case"end":return t.stop()}}),t,null,[[4,17,20,23]])})))).apply(this,arguments)}function d(){return m.apply(this,arguments)}function m(){return(m=f(c().mark((function t(){var e,r,i,u;return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=[],t.t0=c().keys(h);case 2:if((t.t1=t.t0()).done){t.next=31;break}r=t.t1.value,i=h[r],t.t2=i.type,t.next="select"===t.t2?8:"page"===t.t2?10:"action"===t.t2?12:"info"===t.t2?23:27;break;case 8:return i.status=i.options[i.option].name,t.abrupt("break",28);case 10:return i.status="",t.abrupt("break",28);case 12:if(i.status="","persistent_storage"!==r){t.next=22;break}return t.next=16,(0,n.tH)();case 16:if(!t.sent){t.next=20;break}t.t3="開啟",t.next=21;break;case 20:t.t3="關閉";case 21:i.status=t.t3;case 22:return t.abrupt("break",28);case 23:return"version"===r&&(i.status=(0,a.kE)()),"branch"===r&&(i.status=(0,a.HL)()),"last_update_date"===r&&(u=new Date((0,a.iJ)()),i.status=(0,o.HN)(u)),t.abrupt("break",28);case 27:return t.abrupt("break",28);case 28:e.push(i),t.next=2;break;case 31:return t.abrupt("return",e);case 32:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function g(){var t=[];for(var e in h)if(p.indexOf(e)>-1&&h.hasOwnProperty(e)&&"select"===h[e].type){var r={key:e,option:h[e].option};t.push(r)}return t}function b(t,e){return w.apply(this,arguments)}function w(){return(w=f(c().mark((function t(e,r){return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(p.indexOf(e)>-1)){t.next=8;break}if(!h.hasOwnProperty(e)){t.next=8;break}if("select"!==h[e].type){t.next=8;break}if(void 0===h[e].options[r]||null===h[e].options[r]){t.next=8;break}return t.next=6,(0,n.mL)(1,e,r);case 6:return h[e].option=r,t.abrupt("return",!0);case 8:return t.abrupt("return",!1);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function x(t){if(p.indexOf(t)>-1&&h.hasOwnProperty(t))return h[t]}function _(t){if(p.indexOf(t)>-1&&h.hasOwnProperty(t)){var e=h[t],r=e.options[e.option].value;switch(r.type){case 0:return r.string;case 1:return r.number;case 2:return r.boolean;case 3:return r;default:return""}}return""}},3251:(t,e,r)=>{r.d(e,{A:()=>v,HL:()=>p,NO:()=>h,iJ:()=>y,kE:()=>f});var n=r(3648);function o(t){return o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o(t)}function a(){a=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,i=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},u=c.iterator||"@@iterator",s=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,a=Object.create(o.prototype),c=new I(n||[]);return i(a,"_invoke",{value:j(t,r,c)}),a}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=p;var y="suspendedStart",v="suspendedYield",d="executing",m="completed",g={};function b(){}function w(){}function x(){}var _={};f(_,u,(function(){return this}));var k=Object.getPrototypeOf,L=k&&k(k(T([])));L&&L!==r&&n.call(L,u)&&(_=L);var E=x.prototype=b.prototype=Object.create(_);function O(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function S(t,e){function r(a,i,c,u){var s=h(t[a],t,i);if("throw"!==s.type){var l=s.arg,f=l.value;return f&&"object"==o(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,c,u)}),(function(t){r("throw",t,c,u)})):e.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return r("throw",t,c,u)}))}u(s.arg)}var a;i(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function j(e,r,n){var o=y;return function(a,i){if(o===d)throw Error("Generator is already running");if(o===m){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=m,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=d;var s=h(e,r,n);if("normal"===s.type){if(o=n.done?m:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=m,n.method="throw",n.arg=s.arg)}}}function P(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,P(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=h(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function G(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function T(e){if(e||""===e){var r=e[u];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,i=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return i.next=i}}throw new TypeError(o(e)+" is not iterable")}return w.prototype=x,i(E,"constructor",{value:x,configurable:!0}),i(x,"constructor",{value:w,configurable:!0}),w.displayName=f(x,l,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,f(t,l,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},O(S.prototype),f(S.prototype,s,(function(){return this})),e.AsyncIterator=S,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new S(p(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},O(E),f(E,l,"Generator"),f(E,u,(function(){return this})),f(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=T,I.prototype={constructor:I,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(G),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),G(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;G(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:T(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function i(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function c(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function c(t){i(a,n,o,c,u,"next",t)}function u(t){i(a,n,o,c,u,"throw",t)}c(void 0)}))}}function u(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=new URLSearchParams(window.location.search);r.set("v",t);var n=window.location.pathname+"?"+r.toString();e?window.location.replace(n):history.replaceState(null,"",n)}function s(){return l.apply(this,arguments)}function l(){return(l=c(a().mark((function t(){var e;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("./version.json?_=".concat((new Date).getTime()),{cache:"no-store"});case 3:if((e=t.sent).ok){t.next=6;break}throw new Error("Network response was not ok");case 6:return t.abrupt("return",e.json());case 9:return t.prev=9,t.t0=t.catch(0),console.error("There was a problem with the fetch operation:",t.t0),t.abrupt("return",{build:null,hash:null,fullHash:null,branchName:null});case 13:case"end":return t.stop()}}),t,null,[[0,9]])})))).apply(this,arguments)}function f(){return(0,n.bv)('head meta[name="version-hash"]').getAttribute("content")}function p(){return(0,n.bv)('head meta[name="version-branch-name"]').getAttribute("content")}function h(){var t=(0,n.bv)('head meta[name="version-full-hash"]').getAttribute("content");return"https://github.com/EricHsia7/bus/commit/".concat(t)}function y(){return(0,n.bv)('head meta[name="version-time-stamp"]').getAttribute("content")}function v(){return d.apply(this,arguments)}function d(){return(d=c(a().mark((function t(){var e;return a().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,s();case 2:if(!(e=t.sent)){t.next=17;break}if(null===e.hash){t.next=14;break}if(f()===e.hash){t.next=10;break}return u(e.hash,!0),t.abrupt("return",{status:"refreshing"});case 10:return u(e.hash,!1),t.abrupt("return",{status:"ok"});case 12:t.next=15;break;case 14:return t.abrupt("return",{status:"fetchError"});case 15:t.next=18;break;case 17:return t.abrupt("return",{status:"unknownError"});case 18:case"end":return t.stop()}}),t)})))).apply(this,arguments)}}}]);
//# sourceMappingURL=a9a6fea7a66e5da009b4.js.map
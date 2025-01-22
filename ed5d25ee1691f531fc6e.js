/*! For license information please see ed5d25ee1691f531fc6e.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[335],{4356:(e,t,o)=>{o.r(t),o.d(t,{default:()=>U});var r=o(5009),n=o(5767),a=o(7910),i=o(1531),s=o(4690),c=o(1290),l=o(8332),u=o(3030),d=o(9469),p=o(9856),h=o(9566),f=o(6082),v=o(3251),y=o(6104),g=o(6166),S=o(3459),m=o(904),w=o(3648),E=o(3041),F=o(8379),b=o(9333),L=o(8570),R=o(7258),P=o(6052),I=o(540),x=o(9499),O=o(2994),k=o(7891),z=o(8380),C=o(5693),_=o(8932),T=o(4569),D=o(5314),B=o(6091);console.log(0);var M=!1,j=!1;console.log(1),window.bus={initialize:function(){console.log(2),!1===M&&(console.log(3),M=!0,(0,m.setSplashScreenIconOffsetY)(),console.log(4),(0,S.initializeSettings)().then((function(){console.log(5);var e=(0,w.documentQuerySelector)(".l .m .n");(0,B.setUpRecentViewsFieldSkeletonScreen)(e);var t=(0,w.documentQuerySelector)(".l .m .o");(0,I.setUpFolderFieldSkeletonScreen)(t),(0,v.checkAppVersion)().then((function(e){if(console.log(6),"ok"===e.status){console.log(7),(0,s.initializeRouteSliding)(),(0,u.initializeLocationSliding)(),(0,s.ResizeRouteField)(),(0,u.ResizeLocationField)(),(0,p.ResizeSearchInputCanvasSize)(),window.addEventListener("resize",(function(){(0,s.ResizeRouteField)(),(0,u.ResizeLocationField)(),(0,p.ResizeSearchInputCanvasSize)()})),screen&&screen.orientation&&screen.orientation.addEventListener("change",(function(){(0,s.ResizeRouteField)(),(0,u.ResizeLocationField)(),(0,p.ResizeSearchInputCanvasSize)()})),(0,B.initializeRecentViews)(),(0,h.initializeFolderStores)().then((function(){(0,I.initializeFolders)()}));var t=window.matchMedia("(prefers-color-scheme: dark)"),o=(0,w.documentQuerySelector)(".p .q .r #search_input");t.addEventListener("change",(function(){(0,p.updateSearchInput)(o.value,o.selectionStart)})),o.addEventListener("paste",(function(){(0,r.updateSearchResult)(o.value),(0,p.updateSearchInput)(o.value,o.selectionStart)})),o.addEventListener("cut",(function(){(0,r.updateSearchResult)(o.value),(0,p.updateSearchInput)(o.value,o.selectionStart)})),o.addEventListener("selectionchange",(function(){(0,r.updateSearchResult)(o.value),(0,p.updateSearchInput)(o.value,o.selectionStart)})),document.addEventListener("selectionchange",(function(){(0,r.updateSearchResult)(o.value),(0,p.updateSearchInput)(o.value,o.selectionStart)})),o.addEventListener("keyup",(function(){(0,r.updateSearchResult)(o.value),(0,p.updateSearchInput)(o.value,o.selectionStart)}));var n=(0,w.documentQuerySelector)(".s .t .u #search_material_symbols_input");n.addEventListener("paste",(function(){(0,L.updateMaterialSymbolsSearchResult)(n.value)})),n.addEventListener("cut",(function(){(0,L.updateMaterialSymbolsSearchResult)(n.value)})),n.addEventListener("selectionchange",(function(){(0,L.updateMaterialSymbolsSearchResult)(n.value)})),document.addEventListener("selectionchange",(function(){(0,L.updateMaterialSymbolsSearchResult)(n.value)})),n.addEventListener("keyup",(function(){(0,L.updateMaterialSymbolsSearchResult)(n.value)})),(0,d.openPermalink)(),(0,m.fadeOutSplashScreen)((function(){(0,i.askForPositioningPermission)()}))}"fetchError"!==e.status&&"unknownError"!==e.status||((0,m.fadeOutSplashScreen)(),alert(e.status))})).catch((function(e){(0,m.fadeOutSplashScreen)(),alert(e)}))})))},secondlyInitialize:function(){j||(j=!0,(0,R.loadCSS)("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&display=swap","noto_sans_tc"),(0,R.loadCSS)("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200","material_symbols"),(0,f.downloadData)(),(0,n.discardExpiredEstimateTimeRecordsForUpdateRate)(),(0,a.discardExpiredDataUsageRecords)(),(0,_.discardExpiredEstimateTimeRecordsForBusArrivalTime)(),(0,D.discardExpiredRecentViews)())},route:{stretchRouteItemBody:s.stretchRouteItemBody,openRoute:s.openRoute,closeRoute:s.closeRoute,switchRoute:s.switchRoute,switchRouteBodyTab:s.switchRouteBodyTab,openRouteDetails:c.openRouteDetails,closeRouteDetails:c.closeRouteDetails,shareRoutePermalink:l.shareRoutePermalink},location:{openLocation:u.openLocation,closeLocation:u.closeLocation,stretchLocationItemBody:u.stretchLocationItemBody},folder:{openSaveToFolder:E.openSaveToFolder,closeSaveToFolder:E.closeSaveToFolder,openFolderManager:F.openFolderManager,closeFolderManager:F.closeFolderManager,openFolderEditor:b.openFolderEditor,closeFolderEditor:b.closeFolderEditor,openFolderIconSelector:L.openFolderIconSelector,closeFolderIconSelector:L.closeFolderIconSelector,openFolderCreator:P.openFolderCreator,closeFolderCreator:P.closeFolderCreator,createFormulatedFolder:P.createFormulatedFolder,saveEditedFolder:b.saveEditedFolder,selectFolderIcon:L.selectFolderIcon,saveStopItemOnRoute:E.saveStopItemOnRoute,saveRouteOnDetailsPage:E.saveRouteOnDetailsPage,removeItemOnFolderEditor:b.removeItemOnFolderEditor,moveItemOnFolderEditor:b.moveItemOnFolderEditor},search:{openSearch:r.openSearch,closeSearch:r.closeSearch,typeTextIntoInput:p.typeTextIntoInput,deleteCharFromInout:p.deleteCharFromInout,emptyInput:p.emptyInput,openSystemKeyboard:p.openSystemKeyboard},storage:{openStorage:O.openStorage,closeStorage:O.closeStorage},dataUsage:{openDataUsage:x.openDataUsage,closeDataUsage:x.closeDataUsage,switchDataUsageGraphAggregationPeriod:x.switchDataUsageGraphAggregationPeriod},personalSchedule:{openPersonalScheduleManager:k.openPersonalScheduleManager,closePersonalScheduleManager:k.closePersonalScheduleManager,openPersonalScheduleCreator:z.openPersonalScheduleCreator,closePersonalScheduleCreator:z.closePersonalScheduleCreator,createFormulatedPersonalSchedule:z.createFormulatedPersonalSchedule,switchPersonalScheduleCreatorDay:z.switchPersonalScheduleCreatorDay,openPersonalScheduleEditor:C.openPersonalScheduleEditor,closePersonalScheduleEditor:C.closePersonalScheduleEditor,switchPersonalScheduleEditorDay:C.switchPersonalScheduleEditorDay,saveEditedPersonalSchedule:C.saveEditedPersonalSchedule},settings:{openSettings:y.openSettings,closeSettings:y.closeSettings,openSettingsOptions:g.openSettingsOptions,closeSettingsOptions:g.closeSettingsOptions,settingsOptionsHandler:g.settingsOptionsHandler,downloadExportFile:y.downloadExportFile,openFileToImportData:y.openFileToImportData,viewCommitOfCurrentVersion:y.viewCommitOfCurrentVersion,showPromptToAskForPersistentStorage:y.showPromptToAskForPersistentStorage},bus:{openBus:T.openBus,closeBus:T.closeBus}};const U=window.bus},4569:(e,t,o)=>{o.r(t),o.d(t,{closeBus:()=>S,openBus:()=>g});var r=o(6160),n=o(5314),a=o(3459),i=o(8024),s=o(3648),c=o(904),l=o(8184);function u(e){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u(e)}function d(){d=function(){return t};var e,t={},o=Object.prototype,r=o.hasOwnProperty,n=Object.defineProperty||function(e,t,o){e[t]=o.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",s=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag";function l(e,t,o){return Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{l({},"")}catch(e){l=function(e,t,o){return e[t]=o}}function p(e,t,o,r){var a=t&&t.prototype instanceof m?t:m,i=Object.create(a.prototype),s=new C(r||[]);return n(i,"_invoke",{value:x(e,o,s)}),i}function h(e,t,o){try{return{type:"normal",arg:e.call(t,o)}}catch(e){return{type:"throw",arg:e}}}t.wrap=p;var f="suspendedStart",v="suspendedYield",y="executing",g="completed",S={};function m(){}function w(){}function E(){}var F={};l(F,i,(function(){return this}));var b=Object.getPrototypeOf,L=b&&b(b(_([])));L&&L!==o&&r.call(L,i)&&(F=L);var R=E.prototype=m.prototype=Object.create(F);function P(e){["next","throw","return"].forEach((function(t){l(e,t,(function(e){return this._invoke(t,e)}))}))}function I(e,t){function o(n,a,i,s){var c=h(e[n],e,a);if("throw"!==c.type){var l=c.arg,d=l.value;return d&&"object"==u(d)&&r.call(d,"__await")?t.resolve(d.__await).then((function(e){o("next",e,i,s)}),(function(e){o("throw",e,i,s)})):t.resolve(d).then((function(e){l.value=e,i(l)}),(function(e){return o("throw",e,i,s)}))}s(c.arg)}var a;n(this,"_invoke",{value:function(e,r){function n(){return new t((function(t,n){o(e,r,t,n)}))}return a=a?a.then(n,n):n()}})}function x(t,o,r){var n=f;return function(a,i){if(n===y)throw Error("Generator is already running");if(n===g){if("throw"===a)throw i;return{value:e,done:!0}}for(r.method=a,r.arg=i;;){var s=r.delegate;if(s){var c=O(s,r);if(c){if(c===S)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===f)throw n=g,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=y;var l=h(t,o,r);if("normal"===l.type){if(n=r.done?g:v,l.arg===S)continue;return{value:l.arg,done:r.done}}"throw"===l.type&&(n=g,r.method="throw",r.arg=l.arg)}}}function O(t,o){var r=o.method,n=t.iterator[r];if(n===e)return o.delegate=null,"throw"===r&&t.iterator.return&&(o.method="return",o.arg=e,O(t,o),"throw"===o.method)||"return"!==r&&(o.method="throw",o.arg=new TypeError("The iterator does not provide a '"+r+"' method")),S;var a=h(n,t.iterator,o.arg);if("throw"===a.type)return o.method="throw",o.arg=a.arg,o.delegate=null,S;var i=a.arg;return i?i.done?(o[t.resultName]=i.value,o.next=t.nextLoc,"return"!==o.method&&(o.method="next",o.arg=e),o.delegate=null,S):i:(o.method="throw",o.arg=new TypeError("iterator result is not an object"),o.delegate=null,S)}function k(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function z(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function C(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(k,this),this.reset(!0)}function _(t){if(t||""===t){var o=t[i];if(o)return o.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,a=function o(){for(;++n<t.length;)if(r.call(t,n))return o.value=t[n],o.done=!1,o;return o.value=e,o.done=!0,o};return a.next=a}}throw new TypeError(u(t)+" is not iterable")}return w.prototype=E,n(R,"constructor",{value:E,configurable:!0}),n(E,"constructor",{value:w,configurable:!0}),w.displayName=l(E,c,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===w||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,E):(e.__proto__=E,l(e,c,"GeneratorFunction")),e.prototype=Object.create(R),e},t.awrap=function(e){return{__await:e}},P(I.prototype),l(I.prototype,s,(function(){return this})),t.AsyncIterator=I,t.async=function(e,o,r,n,a){void 0===a&&(a=Promise);var i=new I(p(e,o,r,n),a);return t.isGeneratorFunction(o)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},P(R),l(R,c,"Generator"),l(R,i,(function(){return this})),l(R,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),o=[];for(var r in t)o.push(r);return o.reverse(),function e(){for(;o.length;){var r=o.pop();if(r in t)return e.value=r,e.done=!1,e}return e.done=!0,e}},t.values=_,C.prototype={constructor:C,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(z),!t)for(var o in this)"t"===o.charAt(0)&&r.call(this,o)&&!isNaN(+o.slice(1))&&(this[o]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var o=this;function n(r,n){return s.type="throw",s.arg=t,o.next=r,n&&(o.method="next",o.arg=e),!!n}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=r.call(i,"catchLoc"),l=r.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!l)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(e,t){for(var o=this.tryEntries.length-1;o>=0;--o){var n=this.tryEntries[o];if(n.tryLoc<=this.prev&&r.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===e||"continue"===e)&&a.tryLoc<=t&&t<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=e,i.arg=t,a?(this.method="next",this.next=a.finallyLoc,S):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),S},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var o=this.tryEntries[t];if(o.finallyLoc===e)return this.complete(o.completion,o.afterLoc),z(o),S}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var o=this.tryEntries[t];if(o.tryLoc===e){var r=o.completion;if("throw"===r.type){var n=r.arg;z(o)}return n}}throw Error("illegal catch attempt")},delegateYield:function(t,o,r){return this.delegate={iterator:_(t),resultName:o,nextLoc:r},"next"===this.method&&(this.arg=e),S}},t}function p(e,t,o,r,n,a,i){try{var s=e[a](i),c=s.value}catch(e){return void o(e)}s.done?t(c):Promise.resolve(c).then(r,n)}var h=(0,s.documentQuerySelector)(".v"),f=((0,s.elementQuerySelector)(h,".w"),(0,s.elementQuerySelector)(h,".x")),v=(0,s.elementQuerySelector)(f,".y"),y=(0,s.elementQuerySelector)(v,'.z[group="properties"]');(0,s.elementQuerySelector)(v,'.z[group="location"]');function g(e){(0,c.pushPageHistory)("Bus"),(0,n.logRecentView)("bus",e),h.setAttribute("displayed","true"),function(e){m.apply(this,arguments)}(e),(0,c.closePreviousPage)()}function S(){h.setAttribute("displayed","false"),(0,c.openPreviousPage)()}function m(){var e;return e=d().mark((function e(t){var o,n,s;return d().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(0,l.setUpBusPropertiesFieldSkeletonScreen)(y),o=(0,a.getSettingOptionValue)("playing_animation"),n=(0,i.generateIdentifier)("r"),e.next=5,(0,r.integrateBus)(t,n);case 5:s=e.sent,(0,l.updateBusPropertiesField)(y,s.properties,!1,o);case 7:case"end":return e.stop()}}),e)})),m=function(){var t=this,o=arguments;return new Promise((function(r,n){var a=e.apply(t,o);function i(e){p(a,r,n,i,s,"next",e)}function s(e){p(a,r,n,i,s,"throw",e)}i(void 0)}))},m.apply(this,arguments)}}}]);
//# sourceMappingURL=ed5d25ee1691f531fc6e.js.map
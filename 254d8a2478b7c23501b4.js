/*! For license information please see 254d8a2478b7c23501b4.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[180],{9566:(e,t,r)=>{r.r(t),r.d(t,{createFolder:()=>O,getFolder:()=>P,initializeFolderStores:()=>I,integrateFolders:()=>C,isSaved:()=>M,listFolderContent:()=>j,listFolders:()=>F,listFoldersWithContent:()=>A,removeFromFolder:()=>Q,saveRoute:()=>$,saveStop:()=>z,saveToFolder:()=>U,updateFolder:()=>E,updateFolderContentIndex:()=>H});var n=r(2303),a=r(4311),o=r(8024),i=r(3459),c=r(9930),u=r(8134),s=r(6788),f=r(2063),p=r(5767),l=r(424),h=r(8011),d=r(4293),y=r(8932);function v(e){return v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},v(e)}function x(){x=function(){return t};var e,t={},r=Object.prototype,n=r.hasOwnProperty,a=Object.defineProperty||function(e,t,r){e[t]=r.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function s(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{s({},"")}catch(e){s=function(e,t,r){return e[t]=r}}function f(e,t,r,n){var o=t&&t.prototype instanceof m?t:m,i=Object.create(o.prototype),c=new N(n||[]);return a(i,"_invoke",{value:E(e,r,c)}),i}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}t.wrap=f;var l="suspendedStart",h="suspendedYield",d="executing",y="completed",b={};function m(){}function g(){}function w(){}var k={};s(k,i,(function(){return this}));var _=Object.getPrototypeOf,I=_&&_(_(j([])));I&&I!==r&&n.call(I,i)&&(k=I);var S=w.prototype=m.prototype=Object.create(k);function O(e){["next","throw","return"].forEach((function(t){s(e,t,(function(e){return this._invoke(t,e)}))}))}function L(e,t){function r(a,o,i,c){var u=p(e[a],e,o);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==v(f)&&n.call(f,"__await")?t.resolve(f.__await).then((function(e){r("next",e,i,c)}),(function(e){r("throw",e,i,c)})):t.resolve(f).then((function(e){s.value=e,i(s)}),(function(e){return r("throw",e,i,c)}))}c(u.arg)}var o;a(this,"_invoke",{value:function(e,n){function a(){return new t((function(t,a){r(e,n,t,a)}))}return o=o?o.then(a,a):a()}})}function E(t,r,n){var a=l;return function(o,i){if(a===d)throw Error("Generator is already running");if(a===y){if("throw"===o)throw i;return{value:e,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var u=T(c,n);if(u){if(u===b)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===l)throw a=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=d;var s=p(t,r,n);if("normal"===s.type){if(a=n.done?y:h,s.arg===b)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(a=y,n.method="throw",n.arg=s.arg)}}}function T(t,r){var n=r.method,a=t.iterator[n];if(a===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,T(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var o=p(a,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,b;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,b):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function P(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function F(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function N(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(P,this),this.reset(!0)}function j(t){if(t||""===t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var a=-1,o=function r(){for(;++a<t.length;)if(n.call(t,a))return r.value=t[a],r.done=!1,r;return r.value=e,r.done=!0,r};return o.next=o}}throw new TypeError(v(t)+" is not iterable")}return g.prototype=w,a(S,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:g,configurable:!0}),g.displayName=s(w,u,"GeneratorFunction"),t.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===g||"GeneratorFunction"===(t.displayName||t.name))},t.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,w):(e.__proto__=w,s(e,u,"GeneratorFunction")),e.prototype=Object.create(S),e},t.awrap=function(e){return{__await:e}},O(L.prototype),s(L.prototype,c,(function(){return this})),t.AsyncIterator=L,t.async=function(e,r,n,a,o){void 0===o&&(o=Promise);var i=new L(f(e,r,n,a),o);return t.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},O(S),s(S,u,"Generator"),s(S,i,(function(){return this})),s(S,"toString",(function(){return"[object Generator]"})),t.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=j,N.prototype={constructor:N,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(F),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function a(n,a){return c.type="throw",c.arg=t,r.next=n,a&&(r.method="next",r.arg=e),!!a}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),b},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),F(r),b}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;F(r)}return a}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:j(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),b}},t}function b(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!r){if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return m(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var n=0,a=function(){};return{s:a,n:function(){return n>=e.length?{done:!0}:{done:!1,value:e[n++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){r=r.call(e)},n:function(){var e=r.next();return i=e.done,e},e:function(e){c=!0,o=e},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw o}}}}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}function g(e,t,r,n,a,o,i){try{var c=e[o](i),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,a)}function w(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function i(e){g(o,n,a,i,c,"next",e)}function c(e){g(o,n,a,i,c,"throw",e)}i(void 0)}))}}var k=r(8055),_={f_saved_stop:{name:"已收藏站牌",icon:"location_on",default:!0,index:0,storeIndex:8,contentType:["stop"],id:"saved_stop"},f_saved_route:{name:"已收藏路線",icon:"route",default:!0,index:1,storeIndex:9,contentType:["route"],id:"saved_route"}};function I(){return S.apply(this,arguments)}function S(){return(S=w(x().mark((function e(){var t,r,n,o,i,c,u,s;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,a.lfListItemKeys)(7);case 2:t=e.sent,r=2,n=b(t),e.prev=5,n.s();case 7:if((o=n.n()).done){e.next=24;break}return i=o.value,e.next=11,(0,a.lfGetItem)(7,i);case 11:if(!(c=e.sent)){e.next=22;break}if(c.default){e.next=22;break}return u=JSON.parse(c),e.next=17,(0,a.registerStore)(u.id);case 17:s=e.sent,u.storeIndex=s,u.index=r,_.hasOwnProperty("f_".concat(u.id))||(_["f_".concat(u.id)]=u),r+=1;case 22:e.next=7;break;case 24:e.next=29;break;case 26:e.prev=26,e.t0=e.catch(5),n.e(e.t0);case 29:return e.prev=29,n.f(),e.finish(29);case 32:case"end":return e.stop()}}),e,null,[[5,26,29,32]])})))).apply(this,arguments)}function O(e,t){return L.apply(this,arguments)}function L(){return(L=w(x().mark((function e(t,r){var n,i,u,s,f;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,o.generateIdentifier)("r"),e.next=3,(0,c.getMaterialSymbols)(n);case 3:if(!(e.sent.indexOf(r)<0)){e.next=6;break}return e.abrupt("return",!1);case 6:return e.next=8,(0,a.lfListItemKeys)(7);case 8:if(i=e.sent,u=(0,o.generateIdentifier)(),_.hasOwnProperty("f_".concat(u))){e.next=28;break}return e.next=13,(0,a.lfGetItem)(7,"f_".concat(u));case 13:if(e.sent){e.next=25;break}return e.next=17,(0,a.registerStore)(u);case 17:return s=e.sent,f={name:t,icon:r,default:!1,storeIndex:s,index:i.length+2,contentType:["stop","route","bus"],id:u,time:(new Date).toISOString()},_["f_".concat(u)]=f,e.next=22,(0,a.lfSetItem)(7,"f_".concat(u),JSON.stringify(f));case 22:return e.abrupt("return",u);case 25:case 28:return e.abrupt("return",!1);case 26:e.next=29;break;case 29:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function E(e){return T.apply(this,arguments)}function T(){return(T=w(x().mark((function e(t){var r,n;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(["saved_stop","saved_route"].indexOf(t.id)<0)||t.default){e.next=23;break}return r="f_".concat(t.id),e.next=4,(0,a.lfGetItem)(7,r);case 4:if(!e.sent){e.next=20;break}return n=(0,o.generateIdentifier)("r"),e.next=9,(0,c.getMaterialSymbols)(n);case 9:if(!(e.sent.indexOf(t.icon)<0)){e.next=14;break}return e.abrupt("return",!1);case 14:return _[r]=t,e.next=17,(0,a.lfSetItem)(7,r,JSON.stringify(t));case 17:return e.abrupt("return",!0);case 18:e.next=21;break;case 20:case 23:return e.abrupt("return",!1);case 21:e.next=24;break;case 24:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function P(e){return k(_["f_".concat(e)])}function F(){return N.apply(this,arguments)}function N(){return(N=w(x().mark((function e(){var t,r;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(r in t=[],_)t.push(_[r]);return e.abrupt("return",t);case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function j(e){return R.apply(this,arguments)}function R(){return(R=w(x().mark((function e(t){var r,n,o,i,c,u,s,f;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=[],n=_["f_".concat(t)],e.next=4,(0,a.lfListItemKeys)(n.storeIndex);case 4:if(!((o=e.sent).length>0)){e.next=28;break}i=b(o),e.prev=7,i.s();case 9:if((c=i.n()).done){e.next=17;break}return u=c.value,e.next=13,(0,a.lfGetItem)(n.storeIndex,u);case 13:(s=e.sent)&&(f=JSON.parse(s),r.push(f));case 15:e.next=9;break;case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(7),i.e(e.t0);case 22:return e.prev=22,i.f(),e.finish(22);case 25:r=r.sort((function(e,t){return((null==e?void 0:e.index)||0)-((null==t?void 0:t.index)||0)})),e.next=29;break;case 28:r.push({type:"empty",id:0,index:0});case 29:return e.abrupt("return",r);case 30:case"end":return e.stop()}}),e,null,[[7,19,22,25]])})))).apply(this,arguments)}function G(e){return D.apply(this,arguments)}function D(){return(D=w(x().mark((function e(t){var r,n,o;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=P(t),e.next=3,(0,a.lfListItemKeys)(r.storeIndex);case 3:if(1!==(n=e.sent).length){e.next=16;break}return e.next=7,j(t);case 7:if(o=e.sent,"empty"!==o[0].type){e.next=13;break}return e.abrupt("return",0);case 13:return e.abrupt("return",1);case 14:e.next=17;break;case 16:return e.abrupt("return",n.length);case 17:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function A(){return J.apply(this,arguments)}function J(){return J=w(x().mark((function e(){var t,r,n,a,o,i,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F();case 2:t=e.sent,r=[],n=b(t),e.prev=5,n.s();case 7:if((a=n.n()).done){e.next=18;break}return o=a.value,e.next=11,j(o.id);case 11:return i=e.sent,e.next=14,G(o.id);case 14:c=e.sent,r.push({folder:o,content:i,contentLength:c});case 16:e.next=7;break;case 18:e.next=23;break;case 20:e.prev=20,e.t0=e.catch(5),n.e(e.t0);case 23:return e.prev=23,n.f(),e.finish(23);case 26:return e.abrupt("return",r);case 27:case"end":return e.stop()}}),e,null,[[5,20,23,26]])}))),J.apply(this,arguments)}function C(e){return K.apply(this,arguments)}function K(){return(K=w(x().mark((function e(t){var r,a,o,c,u,l,h,v,m,g,w,k,_,I,S,O,L,E,T,P,F,N,j,R,G,D,J,C,K,U,B,M;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(0,s.setDataReceivingProgress)(t,"getEstimateTime_0",0,!1),(0,s.setDataReceivingProgress)(t,"getEstimateTime_1",0,!1),(0,s.setDataReceivingProgress)(t,"getRoute_0",0,!1),(0,s.setDataReceivingProgress)(t,"getRoute_1",0,!1),e.next=6,(0,f.getEstimateTime)(t);case 6:return a=e.sent,e.next=9,(0,d.getRoute)(t,!0);case 9:return o=e.sent,e.next=12,A();case 12:c=e.sent,u=(0,i.getSettingOptionValue)("time_formatting_mode"),l=(0,i.getSettingOptionValue)("power_saving"),h=(0,i.getSettingOptionValue)("refresh_interval"),v=[],m=b(c);try{for(m.s();!(g=m.n()).done;)w=g.value,v=v.concat(w.content.filter((function(e){return"stop"===e.type})).map((function(e){return e.id})))}catch(e){m.e(e)}finally{m.f()}k={},_=b(a);try{for(_.s();!(I=_.n()).done;)S=I.value,v.indexOf(parseInt(S.StopID))>-1&&(k["s_".concat(S.StopID)]=S)}catch(e){_.e(e)}finally{_.f()}O={},L={},E=0,T={},P=b(c),e.prev=27,P.s();case 29:if((F=P.n()).done){e.next=76;break}N=F.value,j="f_".concat(N.folder.index),O.hasOwnProperty(j)||(O[j]=[],L[j]=0),R=b(N.content),e.prev=34,R.s();case 36:if((G=R.n()).done){e.next=64;break}D=G.value,J=D,C="",K={},U="",B={},e.t0=D.type,e.next="stop"===e.t0?46:"route"===e.t0?53:"bus"===e.t0?57:"empty"===e.t0?58:59;break;case 46:return C="s_".concat(D.id),k.hasOwnProperty(C)&&(K=k[C]),J.status=(0,n.parseEstimateTime)(null===(r=K)||void 0===r?void 0:r.EstimateTime,u),U="r_".concat(D.route.id),B=o[U],J.route.pathAttributeId=B.pid,e.abrupt("break",60);case 53:return U="r_".concat(D.id),B=o[U],J.pathAttributeId=B.pid,e.abrupt("break",60);case 57:case 58:case 59:return e.abrupt("break",60);case 60:O[j].push(J),L[j]=L[j]+1;case 62:e.next=36;break;case 64:e.next=69;break;case 66:e.prev=66,e.t1=e.catch(34),R.e(e.t1);case 69:return e.prev=69,R.f(),e.finish(69);case 72:T[j]=N.folder,E+=1;case 74:e.next=29;break;case 76:e.next=81;break;case 78:e.prev=78,e.t2=e.catch(27),P.e(e.t2);case 81:return e.prev=81,P.f(),e.finish(81);case 84:if(M={foldedContent:O,folders:T,folderQuantity:E,itemQuantity:L,dataUpdateTime:s.dataUpdateTime[t]},(0,s.deleteDataReceivingProgress)(t),(0,s.deleteDataUpdateTime)(t),l){e.next=93;break}if(!h.dynamic){e.next=91;break}return e.next=91,(0,p.recordEstimateTimeForUpdateRate)(a);case 91:return e.next=93,(0,y.recordEstimateTimeForBusArrivalTime)(a);case 93:return e.abrupt("return",M);case 94:case"end":return e.stop()}}),e,null,[[27,78,81,84],[34,66,69,72]])})))).apply(this,arguments)}function U(e,t){return B.apply(this,arguments)}function B(){return(B=w(x().mark((function e(t,r){var n;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!((n=_["f_".concat(t)]).contentType.indexOf(r.type)>-1)){e.next=5;break}return e.next=4,(0,a.lfSetItem)(n.storeIndex,"".concat(r.type,"_").concat(r.id),JSON.stringify(r));case 4:return e.abrupt("return",!0);case 5:return e.abrupt("return",!1);case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function M(e,t){return V.apply(this,arguments)}function V(){return(V=w(x().mark((function e(t,r){var n,o,i,c,u,s,f;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,F();case 2:n=e.sent,o=b(n),e.prev=4,o.s();case 6:if((i=o.n()).done){e.next=31;break}if(!((c=i.value).contentType.indexOf(t)>-1)){e.next=29;break}return e.next=11,(0,a.lfListItemKeys)(c.storeIndex);case 11:u=e.sent,s=b(u),e.prev=13,s.s();case 15:if((f=s.n()).done){e.next=21;break}if(!(f.value.indexOf("".concat(t,"_").concat(r))>-1)){e.next=19;break}return e.abrupt("return",!0);case 19:e.next=15;break;case 21:e.next=26;break;case 23:e.prev=23,e.t0=e.catch(13),s.e(e.t0);case 26:return e.prev=26,s.f(),e.finish(26);case 29:e.next=6;break;case 31:e.next=36;break;case 33:e.prev=33,e.t1=e.catch(4),o.e(e.t1);case 36:return e.prev=36,o.f(),e.finish(36);case 39:return e.abrupt("return",!1);case 40:case"end":return e.stop()}}),e,null,[[4,33,36,39],[13,23,26,29]])})))).apply(this,arguments)}function Q(e,t,r){return Y.apply(this,arguments)}function Y(){return(Y=w(x().mark((function e(t,r,n){var o;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o=_["f_".concat(t)],e.next=3,M(r,n);case 3:if(!e.sent){e.next=10;break}return e.next=7,(0,a.lfRemoveItem)(o.storeIndex,"".concat(r,"_").concat(n));case 7:return e.abrupt("return",!0);case 10:return e.abrupt("return",!1);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function z(e,t,r){return W.apply(this,arguments)}function W(){return(W=w(x().mark((function e(t,r,n){var a,i,c,u,s,f,p,y,v,b,m,g,w,k,_;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=(0,o.generateIdentifier)("r"),e.next=3,(0,l.getStop)(a);case 3:return i=e.sent,e.next=6,(0,h.getLocation)(a,!1);case 6:return c=e.sent,e.next=9,(0,d.getRoute)(a);case 9:return u=e.sent,s=i["s_".concat(r)],f=parseInt(s.goBack),p=c["l_".concat(s.stopLocationId)],y=p.n,v=u["r_".concat(n)],b=v.n,m=v.dep,g=v.des,e.next=20,G(t);case 20:return w=e.sent,k={type:"stop",id:r,time:(new Date).toISOString(),name:y,direction:f,route:{name:b,endPoints:{departure:m,destination:g},id:n},index:w},e.next=24,U(t,k);case 24:return _=e.sent,e.abrupt("return",_);case 26:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function $(e,t){return q.apply(this,arguments)}function q(){return(q=w(x().mark((function e(t,r){var n,a,o,i,c;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,G(t);case 2:return n=e.sent,e.next=5,(0,u.searchRouteByRouteID)(r);case 5:if(!((a=e.sent).length>0)){e.next=15;break}return o=a[0],i={type:"route",id:r,time:(new Date).toISOString(),name:o.n,endPoints:{departure:o.dep,destination:o.des},index:n},e.next=11,U(t,i);case 11:return c=e.sent,e.abrupt("return",c);case 15:return e.abrupt("return",!1);case 16:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function H(e,t,r,n){return X.apply(this,arguments)}function X(){return(X=w(x().mark((function e(t,r,n,o){var i,c,u,s,f,p,l,h,d,y;return x().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=P(t),e.next=3,j(t);case 3:return c=e.sent,u="".concat(r,"_").concat(n),e.next=7,(0,a.lfGetItem)(i.storeIndex,u);case 7:if(!(s=e.sent)){e.next=34;break}f=JSON.parse(s),p=0,e.t0=o,e.next="up"===e.t0?14:"down"===e.t0?16:18;break;case 14:return p=-1,e.abrupt("break",20);case 16:return p=1,e.abrupt("break",20);case 18:return p=0,e.abrupt("break",20);case 20:if(!(l=c[f.index+p])){e.next=32;break}return h="".concat(l.type,"_").concat(l.id),d=f.index,y=l.index,f.index=y,l.index=d,e.next=29,(0,a.lfSetItem)(i.storeIndex,u,JSON.stringify(f));case 29:return e.next=31,(0,a.lfSetItem)(i.storeIndex,h,JSON.stringify(l));case 31:return e.abrupt("return",!0);case 32:e.next=35;break;case 34:return e.abrupt("return",!1);case 35:case"end":return e.stop()}}),e)})))).apply(this,arguments)}}}]);
//# sourceMappingURL=254d8a2478b7c23501b4.js.map
/*! For license information please see b0ac7a8bdb459acb5286.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[147],{9566:(t,e,r)=>{r.d(e,{Fq:()=>V,Gs:()=>q,L2:()=>N,NC:()=>R,R_:()=>z,TH:()=>L,Xi:()=>J,aq:()=>Y,bq:()=>H,eD:()=>A,g$:()=>I,vV:()=>S,z$:()=>Q});var n=r(2303),a=r(4311),o=r(8024),i=r(3459),c=r(9930),u=r(8134),s=r(6788),f=r(2063),p=r(5767),l=r(424),h=r(8011),d=r(4293),y=r(8932);function v(t){return v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},v(t)}function x(){x=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",u=o.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var o=e&&e.prototype instanceof m?e:m,i=Object.create(o.prototype),c=new T(n||[]);return a(i,"_invoke",{value:I(t,r,c)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var l="suspendedStart",h="suspendedYield",d="executing",y="completed",b={};function m(){}function g(){}function w(){}var k={};s(k,i,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(A([])));L&&L!==r&&n.call(L,i)&&(k=L);var O=w.prototype=m.prototype=Object.create(k);function S(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(a,o,i,c){var u=p(t[a],t,o);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==v(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(f).then((function(t){s.value=t,i(s)}),(function(t){return r("throw",t,i,c)}))}c(u.arg)}var o;a(this,"_invoke",{value:function(t,n){function a(){return new e((function(e,a){r(t,n,e,a)}))}return o=o?o.then(a,a):a()}})}function I(e,r,n){var a=l;return function(o,i){if(a===d)throw Error("Generator is already running");if(a===y){if("throw"===o)throw i;return{value:t,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var u=j(c,n);if(u){if(u===b)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===l)throw a=y,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=d;var s=p(e,r,n);if("normal"===s.type){if(a=n.done?y:h,s.arg===b)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(a=y,n.method="throw",n.arg=s.arg)}}}function j(e,r){var n=r.method,a=e.iterator[n];if(a===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,j(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var o=p(a,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,b;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function A(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,o=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return o.next=o}}throw new TypeError(v(e)+" is not iterable")}return g.prototype=w,a(O,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:g,configurable:!0}),g.displayName=s(w,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,s(t,u,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},S(E.prototype),s(E.prototype,c,(function(){return this})),e.AsyncIterator=E,e.async=function(t,r,n,a,o){void 0===o&&(o=Promise);var i=new E(f(t,r,n,a),o);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},S(O),s(O,u,"Generator"),s(O,i,(function(){return this})),s(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=A,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function a(n,a){return c.type="throw",c.arg=e,r.next=n,a&&(r.method="next",r.arg=t),!!a}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;P(r)}return a}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:A(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function b(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return m(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw o}}}}function m(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function g(t,e,r,n,a,o,i){try{var c=t[o](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,a)}function w(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var o=t.apply(e,r);function i(t){g(o,n,a,i,c,"next",t)}function c(t){g(o,n,a,i,c,"throw",t)}i(void 0)}))}}var k=r(8055),_={f_saved_stop:{name:"已收藏站牌",icon:"location_on",default:!0,index:0,storeIndex:9,contentType:["stop"],id:"saved_stop"},f_saved_route:{name:"已收藏路線",icon:"route",default:!0,index:1,storeIndex:10,contentType:["route"],id:"saved_route"}};function L(){return O.apply(this,arguments)}function O(){return(O=w(x().mark((function t(){var e,r,n,o,i,c,u,s;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,a.Su)(8);case 2:e=t.sent,r=2,n=b(e),t.prev=5,n.s();case 7:if((o=n.n()).done){t.next=24;break}return i=o.value,t.next=11,(0,a.Ct)(8,i);case 11:if(!(c=t.sent)){t.next=22;break}if(c.default){t.next=22;break}return u=JSON.parse(c),t.next=17,(0,a.ti)(u.id);case 17:s=t.sent,u.storeIndex=s,u.index=r,_.hasOwnProperty("f_".concat(u.id))||(_["f_".concat(u.id)]=u),r+=1;case 22:t.next=7;break;case 24:t.next=29;break;case 26:t.prev=26,t.t0=t.catch(5),n.e(t.t0);case 29:return t.prev=29,n.f(),t.finish(29);case 32:case"end":return t.stop()}}),t,null,[[5,26,29,32]])})))).apply(this,arguments)}function S(t,e){return E.apply(this,arguments)}function E(){return(E=w(x().mark((function t(e,r){var n,i,u,s,f;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=(0,o.zx)("r"),t.next=3,(0,c.z)(n);case 3:if(!(t.sent.indexOf(r)<0)){t.next=6;break}return t.abrupt("return",!1);case 6:return t.next=8,(0,a.Su)(8);case 8:if(i=t.sent,u=(0,o.zx)(),_.hasOwnProperty("f_".concat(u))){t.next=28;break}return t.next=13,(0,a.Ct)(8,"f_".concat(u));case 13:if(t.sent){t.next=25;break}return t.next=17,(0,a.ti)(u);case 17:return s=t.sent,f={name:e,icon:r,default:!1,storeIndex:s,index:i.length+2,contentType:["stop","route","bus"],id:u,time:(new Date).toISOString()},_["f_".concat(u)]=f,t.next=22,(0,a.mL)(8,"f_".concat(u),JSON.stringify(f));case 22:return t.abrupt("return",u);case 25:case 28:return t.abrupt("return",!1);case 26:t.next=29;break;case 29:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function I(t){return j.apply(this,arguments)}function j(){return(j=w(x().mark((function t(e){var r,n;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(["saved_stop","saved_route"].indexOf(e.id)<0)||e.default){t.next=23;break}return r="f_".concat(e.id),t.next=4,(0,a.Ct)(8,r);case 4:if(!t.sent){t.next=20;break}return n=(0,o.zx)("r"),t.next=9,(0,c.z)(n);case 9:if(!(t.sent.indexOf(e.icon)<0)){t.next=14;break}return t.abrupt("return",!1);case 14:return _[r]=e,t.next=17,(0,a.mL)(8,r,JSON.stringify(e));case 17:return t.abrupt("return",!0);case 18:t.next=21;break;case 20:case 23:return t.abrupt("return",!1);case 21:t.next=24;break;case 24:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function N(t){return k(_["f_".concat(t)])}function P(){return T.apply(this,arguments)}function T(){return(T=w(x().mark((function t(){var e,r;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:for(r in e=[],_)e.push(_[r]);return t.abrupt("return",e);case 3:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function A(t){return G.apply(this,arguments)}function G(){return(G=w(x().mark((function t(e){var r,n,o,i,c,u,s,f;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=[],n=_["f_".concat(e)],t.next=4,(0,a.Su)(n.storeIndex);case 4:if(!((o=t.sent).length>0)){t.next=28;break}i=b(o),t.prev=7,i.s();case 9:if((c=i.n()).done){t.next=17;break}return u=c.value,t.next=13,(0,a.Ct)(n.storeIndex,u);case 13:(s=t.sent)&&(f=JSON.parse(s),r.push(f));case 15:t.next=9;break;case 17:t.next=22;break;case 19:t.prev=19,t.t0=t.catch(7),i.e(t.t0);case 22:return t.prev=22,i.f(),t.finish(22);case 25:r=r.sort((function(t,e){return((null==t?void 0:t.index)||0)-((null==e?void 0:e.index)||0)})),t.next=29;break;case 28:r.push({type:"empty",id:0,index:0});case 29:return t.abrupt("return",r);case 30:case"end":return t.stop()}}),t,null,[[7,19,22,25]])})))).apply(this,arguments)}function F(t){return C.apply(this,arguments)}function C(){return(C=w(x().mark((function t(e){var r,n,o;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=N(e),t.next=3,(0,a.Su)(r.storeIndex);case 3:if(1!==(n=t.sent).length){t.next=16;break}return t.next=7,A(e);case 7:if(o=t.sent,"empty"!==o[0].type){t.next=13;break}return t.abrupt("return",0);case 13:return t.abrupt("return",1);case 14:t.next=17;break;case 16:return t.abrupt("return",n.length);case 17:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function J(){return D.apply(this,arguments)}function D(){return D=w(x().mark((function t(){var e,r,n,a,o,i,c;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,P();case 2:e=t.sent,r=[],n=b(e),t.prev=5,n.s();case 7:if((a=n.n()).done){t.next=18;break}return o=a.value,t.next=11,A(o.id);case 11:return i=t.sent,t.next=14,F(o.id);case 14:c=t.sent,r.push({folder:o,content:i,contentLength:c});case 16:t.next=7;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(5),n.e(t.t0);case 23:return t.prev=23,n.f(),t.finish(23);case 26:return t.abrupt("return",r);case 27:case"end":return t.stop()}}),t,null,[[5,20,23,26]])}))),D.apply(this,arguments)}function z(t){return $.apply(this,arguments)}function $(){return($=w(x().mark((function t(e){var r,a,o,c,u,l,h,v,m,g,w,k,_,L,O,S,E,I,j,N,P,T,A,G,F,C,D,z,$,Q,M,q;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(0,s.Mf)(e,"getEstimateTime_0",0,!1),(0,s.Mf)(e,"getEstimateTime_1",0,!1),(0,s.Mf)(e,"getRoute_0",0,!1),(0,s.Mf)(e,"getRoute_1",0,!1),t.next=6,(0,f.K)(e);case 6:return a=t.sent,t.next=9,(0,d.a)(e,!0);case 9:return o=t.sent,t.next=12,J();case 12:c=t.sent,u=(0,i.Js)("time_formatting_mode"),l=(0,i.Js)("power_saving"),h=(0,i.Js)("refresh_interval"),v=[],m=b(c);try{for(m.s();!(g=m.n()).done;)w=g.value,v=v.concat(w.content.filter((function(t){return"stop"===t.type})).map((function(t){return t.id})))}catch(t){m.e(t)}finally{m.f()}k={},_=b(a);try{for(_.s();!(L=_.n()).done;)O=L.value,v.indexOf(parseInt(O.StopID))>-1&&(k["s_".concat(O.StopID)]=O)}catch(t){_.e(t)}finally{_.f()}S={},E={},I=0,j={},N=b(c),t.prev=27,N.s();case 29:if((P=N.n()).done){t.next=76;break}T=P.value,A="f_".concat(T.folder.index),S.hasOwnProperty(A)||(S[A]=[],E[A]=0),G=b(T.content),t.prev=34,G.s();case 36:if((F=G.n()).done){t.next=64;break}C=F.value,D=C,z="",$={},Q="",M={},t.t0=C.type,t.next="stop"===t.t0?46:"route"===t.t0?53:"bus"===t.t0?57:"empty"===t.t0?58:59;break;case 46:return z="s_".concat(C.id),k.hasOwnProperty(z)&&($=k[z]),D.status=(0,n.$Q)(null===(r=$)||void 0===r?void 0:r.EstimateTime,u),Q="r_".concat(C.route.id),M=o[Q],D.route.pathAttributeId=M.pid,t.abrupt("break",60);case 53:return Q="r_".concat(C.id),M=o[Q],D.pathAttributeId=M.pid,t.abrupt("break",60);case 57:case 58:case 59:return t.abrupt("break",60);case 60:S[A].push(D),E[A]=E[A]+1;case 62:t.next=36;break;case 64:t.next=69;break;case 66:t.prev=66,t.t1=t.catch(34),G.e(t.t1);case 69:return t.prev=69,G.f(),t.finish(69);case 72:j[A]=T.folder,I+=1;case 74:t.next=29;break;case 76:t.next=81;break;case 78:t.prev=78,t.t2=t.catch(27),N.e(t.t2);case 81:return t.prev=81,N.f(),t.finish(81);case 84:if(q={foldedContent:S,folders:j,folderQuantity:I,itemQuantity:E,dataUpdateTime:s.Pb[e]},(0,s.LQ)(e),(0,s.gC)(e),l){t.next=93;break}if(!h.dynamic){t.next=91;break}return t.next=91,(0,p.PD)(a);case 91:return t.next=93,(0,y.ee)(a);case 93:return t.abrupt("return",q);case 94:case"end":return t.stop()}}),t,null,[[27,78,81,84],[34,66,69,72]])})))).apply(this,arguments)}function Q(t,e){return M.apply(this,arguments)}function M(){return(M=w(x().mark((function t(e,r){var n;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!((n=_["f_".concat(e)]).contentType.indexOf(r.type)>-1)){t.next=5;break}return t.next=4,(0,a.mL)(n.storeIndex,"".concat(r.type,"_").concat(r.id),JSON.stringify(r));case 4:return t.abrupt("return",!0);case 5:return t.abrupt("return",!1);case 6:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function q(t,e){return K.apply(this,arguments)}function K(){return(K=w(x().mark((function t(e,r){var n,o,i,c,u,s,f;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,P();case 2:n=t.sent,o=b(n),t.prev=4,o.s();case 6:if((i=o.n()).done){t.next=31;break}if(!((c=i.value).contentType.indexOf(e)>-1)){t.next=29;break}return t.next=11,(0,a.Su)(c.storeIndex);case 11:u=t.sent,s=b(u),t.prev=13,s.s();case 15:if((f=s.n()).done){t.next=21;break}if(!(f.value.indexOf("".concat(e,"_").concat(r))>-1)){t.next=19;break}return t.abrupt("return",!0);case 19:t.next=15;break;case 21:t.next=26;break;case 23:t.prev=23,t.t0=t.catch(13),s.e(t.t0);case 26:return t.prev=26,s.f(),t.finish(26);case 29:t.next=6;break;case 31:t.next=36;break;case 33:t.prev=33,t.t1=t.catch(4),o.e(t.t1);case 36:return t.prev=36,o.f(),t.finish(36);case 39:return t.abrupt("return",!1);case 40:case"end":return t.stop()}}),t,null,[[4,33,36,39],[13,23,26,29]])})))).apply(this,arguments)}function R(t,e,r){return X.apply(this,arguments)}function X(){return(X=w(x().mark((function t(e,r,n){var o;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=_["f_".concat(e)],t.next=3,q(r,n);case 3:if(!t.sent){t.next=10;break}return t.next=7,(0,a.iQ)(o.storeIndex,"".concat(r,"_").concat(n));case 7:return t.abrupt("return",!0);case 10:return t.abrupt("return",!1);case 11:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function Y(t,e,r){return U.apply(this,arguments)}function U(){return(U=w(x().mark((function t(e,r,n){var a,i,c,u,s,f,p,y,v,b,m,g,w,k,_;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a=(0,o.zx)("r"),t.next=3,(0,l.T)(a);case 3:return i=t.sent,t.next=6,(0,h.g)(a,!1);case 6:return c=t.sent,t.next=9,(0,d.a)(a);case 9:return u=t.sent,s=i["s_".concat(r)],f=parseInt(s.goBack),p=c["l_".concat(s.stopLocationId)],y=p.n,v=u["r_".concat(n)],b=v.n,m=v.dep,g=v.des,t.next=20,F(e);case 20:return w=t.sent,k={type:"stop",id:r,time:(new Date).toISOString(),name:y,direction:f,route:{name:b,endPoints:{departure:m,destination:g},id:n},index:w},t.next=24,Q(e,k);case 24:return _=t.sent,t.abrupt("return",_);case 26:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function V(t,e){return B.apply(this,arguments)}function B(){return(B=w(x().mark((function t(e,r){var n,a,o,i,c;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,F(e);case 2:return n=t.sent,t.next=5,(0,u.Rk)(r);case 5:if(!((a=t.sent).length>0)){t.next=15;break}return o=a[0],i={type:"route",id:r,time:(new Date).toISOString(),name:o.n,endPoints:{departure:o.dep,destination:o.des},index:n},t.next=11,Q(e,i);case 11:return c=t.sent,t.abrupt("return",c);case 15:return t.abrupt("return",!1);case 16:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function H(t,e,r,n){return Z.apply(this,arguments)}function Z(){return(Z=w(x().mark((function t(e,r,n,o){var i,c,u,s,f,p,l,h,d,y;return x().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i=N(e),t.next=3,A(e);case 3:return c=t.sent,u="".concat(r,"_").concat(n),t.next=7,(0,a.Ct)(i.storeIndex,u);case 7:if(!(s=t.sent)){t.next=34;break}f=JSON.parse(s),p=0,t.t0=o,t.next="up"===t.t0?14:"down"===t.t0?16:18;break;case 14:return p=-1,t.abrupt("break",20);case 16:return p=1,t.abrupt("break",20);case 18:return p=0,t.abrupt("break",20);case 20:if(!(l=c[f.index+p])){t.next=32;break}return h="".concat(l.type,"_").concat(l.id),d=f.index,y=l.index,f.index=y,l.index=d,t.next=29,(0,a.mL)(i.storeIndex,u,JSON.stringify(f));case 29:return t.next=31,(0,a.mL)(i.storeIndex,h,JSON.stringify(l));case 31:return t.abrupt("return",!0);case 32:t.next=35;break;case 34:return t.abrupt("return",!1);case 35:case"end":return t.stop()}}),t)})))).apply(this,arguments)}},5427:(t,e,r)=>{r.d(e,{Qx:()=>k});var n=r(9566),a=r(5352),o=r(5314),i=r(3459),c=r(4311);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function s(){s=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",c=o.asyncIterator||"@@asyncIterator",f=o.toStringTag||"@@toStringTag";function p(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{p({},"")}catch(t){p=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof m?e:m,i=Object.create(o.prototype),c=new T(n||[]);return a(i,"_invoke",{value:I(t,r,c)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var d="suspendedStart",y="suspendedYield",v="executing",x="completed",b={};function m(){}function g(){}function w(){}var k={};p(k,i,(function(){return this}));var _=Object.getPrototypeOf,L=_&&_(_(A([])));L&&L!==r&&n.call(L,i)&&(k=L);var O=w.prototype=m.prototype=Object.create(k);function S(t){["next","throw","return"].forEach((function(e){p(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(a,o,i,c){var s=h(t[a],t,o);if("throw"!==s.type){var f=s.arg,p=f.value;return p&&"object"==u(p)&&n.call(p,"__await")?e.resolve(p.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(p).then((function(t){f.value=t,i(f)}),(function(t){return r("throw",t,i,c)}))}c(s.arg)}var o;a(this,"_invoke",{value:function(t,n){function a(){return new e((function(e,a){r(t,n,e,a)}))}return o=o?o.then(a,a):a()}})}function I(e,r,n){var a=d;return function(o,i){if(a===v)throw Error("Generator is already running");if(a===x){if("throw"===o)throw i;return{value:t,done:!0}}for(n.method=o,n.arg=i;;){var c=n.delegate;if(c){var u=j(c,n);if(u){if(u===b)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===d)throw a=x,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=v;var s=h(e,r,n);if("normal"===s.type){if(a=n.done?x:y,s.arg===b)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(a=x,n.method="throw",n.arg=s.arg)}}}function j(e,r){var n=r.method,a=e.iterator[n];if(a===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,j(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var o=h(a,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,b;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function P(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function A(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,o=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return o.next=o}}throw new TypeError(u(e)+" is not iterable")}return g.prototype=w,a(O,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:g,configurable:!0}),g.displayName=p(w,f,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,p(t,f,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},S(E.prototype),p(E.prototype,c,(function(){return this})),e.AsyncIterator=E,e.async=function(t,r,n,a,o){void 0===o&&(o=Promise);var i=new E(l(t,r,n,a),o);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},S(O),p(O,f,"Generator"),p(O,i,(function(){return this})),p(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=A,T.prototype={constructor:T,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(P),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function a(n,a){return c.type="throw",c.arg=e,r.next=n,a&&(r.method="next",r.arg=t),!!a}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],c=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),P(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;P(r)}return a}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:A(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function f(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return p(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?p(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,o=t},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw o}}}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function l(t,e,r,n,a,o,i){try{var c=t[o](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,a)}function h(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var o=t.apply(e,r);function i(t){l(o,n,a,i,c,"next",t)}function c(t){l(o,n,a,i,c,"throw",t)}i(void 0)}))}}function d(t){return y.apply(this,arguments)}function y(){return(y=h(s().mark((function t(e){var r,a,o,i,u,p,l,h,d,y,v,x,b;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((a=r.n()).done){t.next=63;break}if(o=a.value,i=o.folder,u=!1,p=!1,!(["saved_stop","saved_route"].indexOf(i.id)<0)||i.default){t.next=24;break}return l="f_".concat(i.id),t.next=12,(0,c.Ct)(8,l);case 12:if(!t.sent){t.next=19;break}return t.next=16,(0,n.g$)(i);case 16:u=t.sent,t.next=22;break;case 19:return t.next=21,(0,n.vV)(i.name,i.icon);case 21:p=t.sent;case 22:t.next=25;break;case 24:u=!0;case 25:if(!u){t.next=43;break}h=f(o.content),t.prev=27,h.s();case 29:if((d=h.n()).done){t.next=35;break}return y=d.value,t.next=33,(0,n.z$)(o.folder.id,y);case 33:t.next=29;break;case 35:t.next=40;break;case 37:t.prev=37,t.t0=t.catch(27),h.e(t.t0);case 40:return t.prev=40,h.f(),t.finish(40);case 43:if(!p){t.next=61;break}v=f(o.content),t.prev=45,v.s();case 47:if((x=v.n()).done){t.next=53;break}return b=x.value,t.next=51,(0,n.z$)(p,b);case 51:t.next=47;break;case 53:t.next=58;break;case 55:t.prev=55,t.t1=t.catch(45),v.e(t.t1);case 58:return t.prev=58,v.f(),t.finish(58);case 61:t.next=3;break;case 63:t.next=68;break;case 65:t.prev=65,t.t2=t.catch(1),r.e(t.t2);case 68:return t.prev=68,r.f(),t.finish(68);case 71:case"end":return t.stop()}}),t,null,[[1,65,68,71],[27,37,40,43],[45,55,58,61]])})))).apply(this,arguments)}function v(t){return x.apply(this,arguments)}function x(){return(x=h(s().mark((function t(e){var r,n,a,o;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((n=r.n()).done){t.next=12;break}if(a=n.value,!(o=(0,i.PL)(a.key))){t.next=10;break}if("select"!==o.type){t.next=10;break}return t.next=10,(0,i.aN)(a.key,a.option);case 10:t.next=3;break;case 12:t.next=17;break;case 14:t.prev=14,t.t0=t.catch(1),r.e(t.t0);case 17:return t.prev=17,r.f(),t.finish(17);case 20:return t.abrupt("return",!0);case 21:case"end":return t.stop()}}),t,null,[[1,14,17,20]])})))).apply(this,arguments)}function b(t){return m.apply(this,arguments)}function m(){return(m=h(s().mark((function t(e){var r,n,o;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((n=r.n()).done){t.next=17;break}return o=n.value,t.next=7,(0,a.qZ)(o.id);case 7:if(!t.sent){t.next=13;break}return t.next=11,(0,a.nL)(o);case 11:t.next=15;break;case 13:return t.next=15,(0,a.Qh)(o.name,o.period.start.hours,o.period.start.minutes,o.period.end.hours,o.period.end.minutes,o.days);case 15:t.next=3;break;case 17:t.next=22;break;case 19:t.prev=19,t.t0=t.catch(1),r.e(t.t0);case 22:return t.prev=22,r.f(),t.finish(22);case 25:return t.abrupt("return",!0);case 26:case"end":return t.stop()}}),t,null,[[1,19,22,25]])})))).apply(this,arguments)}function g(t){return w.apply(this,arguments)}function w(){return(w=h(s().mark((function t(e){var r,n,a;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=f(e),t.prev=1,r.s();case 3:if((n=r.n()).done){t.next=32;break}a=n.value,t.t0=a.type,t.next="route"===t.t0?8:"location"===t.t0?15:"bus"===t.t0?22:29;break;case 8:return t.next=10,(0,o.DF)("route",a.id);case 10:if(t.sent){t.next=14;break}return t.next=14,(0,o.XK)(a.type,a.id);case 14:return t.abrupt("break",30);case 15:return t.next=17,(0,o.DF)("location",a.hash);case 17:if(t.sent){t.next=21;break}return t.next=21,(0,o.XK)(a.type,a.hash);case 21:return t.abrupt("break",30);case 22:return t.next=24,(0,o.DF)("bus",a.id);case 24:if(t.sent){t.next=28;break}return t.next=28,(0,o.XK)(a.type,a.id);case 28:case 29:return t.abrupt("break",30);case 30:t.next=3;break;case 32:t.next=37;break;case 34:t.prev=34,t.t1=t.catch(1),r.e(t.t1);case 37:return t.prev=37,r.f(),t.finish(37);case 40:return t.abrupt("return",!0);case 41:case"end":return t.stop()}}),t,null,[[1,34,37,40]])})))).apply(this,arguments)}function k(t){return _.apply(this,arguments)}function _(){return(_=h(s().mark((function t(e){var r;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=JSON.parse(e),t.t0=r.version,t.next=1===t.t0?4:2===t.t0?8:3===t.t0?14:4===t.t0?22:32;break;case 4:return t.next=6,d(r.folders);case 6:case 12:case 20:case 30:return t.abrupt("return",!0);case 8:return t.next=10,d(r.folders);case 10:return t.next=12,v(r.settings);case 14:return t.next=16,d(r.folders);case 16:return t.next=18,v(r.settings);case 18:return t.next=20,b(r.personal_schedules);case 22:return t.next=24,d(r.folders);case 24:return t.next=26,v(r.settings);case 26:return t.next=28,b(r.personal_schedules);case 28:return t.next=30,g(r.recent_views);case 32:return t.abrupt("return",!1);case 34:case"end":return t.stop()}}),t)})))).apply(this,arguments)}}}]);
//# sourceMappingURL=b0ac7a8bdb459acb5286.js.map
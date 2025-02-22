/*! For license information please see 8e965d08c1c0dc2305ad.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[6774],{6483:(t,e,r)=>{r.d(e,{$t:()=>E,Io:()=>J,VZ:()=>L});var n=r(8024),o=r(5428),a=r(9566),i=r(5352),c=r(4311);function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}function s(){s=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",f=a.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new D(n||[]);return o(i,"_invoke",{value:_(t,r,c)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=h;var y="suspendedStart",v="suspendedYield",m="executing",d="completed",g={};function b(){}function w(){}function x(){}var k={};l(k,i,(function(){return this}));var L=Object.getPrototypeOf,S=L&&L(L(J([])));S&&S!==r&&n.call(S,i)&&(k=S);var E=x.prototype=b.prototype=Object.create(k);function O(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function j(t,e){function r(o,a,i,c){var s=p(t[o],t,a);if("throw"!==s.type){var f=s.arg,l=f.value;return l&&"object"==u(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(l).then((function(t){f.value=t,i(f)}),(function(t){return r("throw",t,i,c)}))}c(s.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function _(e,r,n){var o=y;return function(a,i){if(o===m)throw Error("Generator is already running");if(o===d){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=N(c,n);if(u){if(u===g)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===y)throw o=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var s=p(e,r,n);if("normal"===s.type){if(o=n.done?d:v,s.arg===g)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=d,n.method="throw",n.arg=s.arg)}}}function N(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,N(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),g;var a=p(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,g;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,g):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,g)}function A(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function I(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function D(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(A,this),this.reset(!0)}function J(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(u(e)+" is not iterable")}return w.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=l(x,f,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,l(t,f,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},O(j.prototype),l(j.prototype,c,(function(){return this})),e.AsyncIterator=j,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new j(h(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},O(E),l(E,f,"Generator"),l(E,i,(function(){return this})),l(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=J,D.prototype={constructor:D,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(I),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,g):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),g},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),I(r),g}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;I(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:J(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),g}},e}function f(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=h(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw a}}}}function l(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,o,a,i,c=[],u=!0,s=!1;try{if(a=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=a.call(r)).done)&&(c.push(n.value),c.length!==e);u=!0);}catch(t){s=!0,o=t}finally{try{if(!u&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(s)throw o}}return c}}(t,e)||h(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function h(t,e){if(t){if("string"==typeof t)return p(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?p(t,e):void 0}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function y(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function v(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){y(a,n,o,i,c,"next",t)}function c(t){y(a,n,o,i,c,"throw",t)}i(void 0)}))}}var m="",d=!1,g=[],b={data:{},timestamp:0,id:""},w=0;function x(t){for(var e=new Uint32Array(1440),r=t.length-1;r>=0;r--){var n=t[r],o=0,a=0;n[0]>=0?(o=n[1]+1e3*n[0],a=1):(o=n[1],a=0);var i=new Date(o);e[60*i.getHours()+i.getMinutes()]+=a}return Array.from(e)}function k(t,e){for(var r=new Uint32Array(1440),n=1439;n>=0;n--)r[n]=t[n]+e[n];return Array.from(r)}function L(t){return S.apply(this,arguments)}function S(){return(S=v(s().mark((function t(e){var r,u,l,h,p,y,v,L,S,E,O,j,_,N,A,I,D,J,P,T,G,C;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=new Date,u=r.getTime(),l=r.getDay(),h=!1,d){t.next=13;break}return d=!0,m=(0,n.zx)("b"),b={id:m,timestamp:u,data:{}},w=0,t.next=11,(0,a.$j)(["stop"]);case 11:p=t.sent,g=p.map((function(t){return t.id}));case 13:if(!(0,i.vQ)(r)){t.next=47;break}y=f(e);try{for(y.s();!(v=y.n()).done;)L=v.value,S=L.StopID,E="s_".concat(S,"_").concat(l),g.indexOf(S)>-1&&(b.data.hasOwnProperty(E)||(b.data[E]=[]),b.data[E].push([parseInt(L.EstimateTime),u]),(w+=1)>32&&(h=!0))}catch(t){y.e(t)}finally{y.f()}if(!h&&w%8!=0){t.next=19;break}return t.next=19,(0,c.mL)(5,m,JSON.stringify(b));case 19:if(!h){t.next=47;break}O=f(g),t.prev=21,O.s();case 23:if((j=O.n()).done){t.next=38;break}return _=j.value,N="s_".concat(_,"_").concat(l),A=b.data[N],I={},t.next=30,(0,c.Ct)(6,N);case 30:return(D=t.sent)?(J=JSON.parse(D),P=x(A),I.stats=k(J.stats,P),T=(0,o.DJ)(P.concat(J.max,J.min)),I.min=T[0],I.max=T[1],I.day=l,I.timestamp=J.timestamp,I.id=_):(G=x(A),I.stats=G,C=(0,o.DJ)(G),I.min=C[0],I.max=C[1],I.day=l,I.timestamp=u,I.id=_),t.next=34,(0,c.mL)(6,N,JSON.stringify(I));case 34:return t.next=36,(0,c.iQ)(5,m);case 36:t.next=23;break;case 38:t.next=43;break;case 40:t.prev=40,t.t0=t.catch(21),O.e(t.t0);case 43:return t.prev=43,O.f(),t.finish(43);case 46:d=!1;case 47:case"end":return t.stop()}}),t,null,[[21,40,43,46]])})))).apply(this,arguments)}function E(){return O.apply(this,arguments)}function O(){return(O=v(s().mark((function t(){var e,r,n,a,i,u,l,h,p,y,v,m,d,g,b,w,L,S,E;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=new Date,r=e.getTime(),n=e.getDay(),t.next=5,(0,c.Su)(5);case 5:a=t.sent,i=f(a),t.prev=7,i.s();case 9:if((u=i.n()).done){t.next=33;break}return l=u.value,t.next=13,(0,c.Ct)(5,l);case 13:h=t.sent,p=JSON.parse(h),y=p.id,t.t0=s().keys(p.data);case 17:if((t.t1=t.t0()).done){t.next=31;break}return v=t.t1.value,m=p[v],d={},t.next=23,(0,c.Ct)(6,v);case 23:return(g=t.sent)?(b=JSON.parse(g),w=x(m),d.stats=k(b.stats,w),L=(0,o.DJ)(w.concat(b.max,b.min)),d.min=L[0],d.max=L[1],d.day=b.day,d.timestamp=b.timestamp,d.id=stopID):(S=x(m),d.stats=S,E=(0,o.DJ)(S),d.min=E[0],d.max=E[1],d.day=n,d.timestamp=r,d.id=stopID),t.next=27,(0,c.mL)(6,v,JSON.stringify(d));case 27:return t.next=29,(0,c.iQ)(5,y);case 29:t.next=17;break;case 31:t.next=9;break;case 33:t.next=38;break;case 35:t.prev=35,t.t2=t.catch(7),i.e(t.t2);case 38:return t.prev=38,i.f(),t.finish(38);case 41:case"end":return t.stop()}}),t,null,[[7,35,38,41]])})))).apply(this,arguments)}function j(){return _.apply(this,arguments)}function _(){return(_=v(s().mark((function t(){var e,r,n,o,a,i,u;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,c.Su)(6);case 2:e=t.sent,r=[],n=f(e),t.prev=5,n.s();case 7:if((o=n.n()).done){t.next=15;break}return a=o.value,t.next=11,(0,c.Ct)(6,a);case 11:(i=t.sent)&&(u=JSON.parse(i),r.push(u));case 13:t.next=7;break;case 15:t.next=20;break;case 17:t.prev=17,t.t0=t.catch(5),n.e(t.t0);case 20:return t.prev=20,n.f(),t.finish(20);case 23:return t.abrupt("return",r);case 24:case"end":return t.stop()}}),t,null,[[5,17,20,23]])})))).apply(this,arguments)}var N,A={};if("undefined"!=typeof SharedWorker){var I=new SharedWorker(new URL(r.p+r.u(4818),r.b));(N=I.port).start()}else{var D=new Worker(new URL(r.p+r.u(2437),r.b));N=D}function J(t,e){return P.apply(this,arguments)}function P(){return(P=v(s().mark((function t(e,r){var o,a,c,u;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=(0,n.zx)("t"),t.next=3,(0,i.ty)();case 3:return a=t.sent,t.next=6,j();case 6:return c=t.sent,t.next=9,new Promise((function(t,n){A[o]=t,N.onerror=function(t){n(t.message)},N.postMessage([a,c,e,r,o])}));case 9:return u=t.sent,t.abrupt("return",u);case 11:case"end":return t.stop()}}),t)})))).apply(this,arguments)}N.onmessage=function(t){var e=l(t.data,2),r=e[0],n=e[1];A[n]&&(A[n](r),delete A[n])},N.onerror=function(t){console.error(t.message)}}}]);
//# sourceMappingURL=8e965d08c1c0dc2305ad.js.map
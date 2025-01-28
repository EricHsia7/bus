/*! For license information please see c78ed8f33704111bedeb.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[7554],{5314:(t,e,r)=>{r.d(e,{$i:()=>L,DF:()=>w,FU:()=>d,Qj:()=>m,XK:()=>g});var n=r(8024),a=r(5579),o=r(9734),i=r(8011),u=r(4293),c=r(4311);function s(t){return s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},s(t)}function f(){f=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",u=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function l(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,r){return t[e]=r}}function p(t,e,r,n){var o=e&&e.prototype instanceof g?e:g,i=Object.create(o.prototype),u=new P(n||[]);return a(i,"_invoke",{value:_(t,r,u)}),i}function h(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=p;var y="suspendedStart",m="suspendedYield",v="executing",d="completed",b={};function g(){}function x(){}function w(){}var k={};l(k,i,(function(){return this}));var L=Object.getPrototypeOf,S=L&&L(L(C([])));S&&S!==r&&n.call(S,i)&&(k=S);var O=w.prototype=g.prototype=Object.create(k);function N(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(a,o,i,u){var c=h(t[a],t,o);if("throw"!==c.type){var f=c.arg,l=f.value;return l&&"object"==s(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,u)}),(function(t){r("throw",t,i,u)})):e.resolve(l).then((function(t){f.value=t,i(f)}),(function(t){return r("throw",t,i,u)}))}u(c.arg)}var o;a(this,"_invoke",{value:function(t,n){function a(){return new e((function(e,a){r(t,n,e,a)}))}return o=o?o.then(a,a):a()}})}function _(e,r,n){var a=y;return function(o,i){if(a===v)throw Error("Generator is already running");if(a===d){if("throw"===o)throw i;return{value:t,done:!0}}for(n.method=o,n.arg=i;;){var u=n.delegate;if(u){var c=j(u,n);if(c){if(c===b)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(a===y)throw a=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);a=v;var s=h(e,r,n);if("normal"===s.type){if(a=n.done?d:m,s.arg===b)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(a=d,n.method="throw",n.arg=s.arg)}}}function j(e,r){var n=r.method,a=e.iterator[n];if(a===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,j(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),b;var o=h(a,e.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,b;var i=o.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,b):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,b)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function J(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function C(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,o=function r(){for(;++a<e.length;)if(n.call(e,a))return r.value=e[a],r.done=!1,r;return r.value=t,r.done=!0,r};return o.next=o}}throw new TypeError(s(e)+" is not iterable")}return x.prototype=w,a(O,"constructor",{value:w,configurable:!0}),a(w,"constructor",{value:x,configurable:!0}),x.displayName=l(w,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===x||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,w):(t.__proto__=w,l(t,c,"GeneratorFunction")),t.prototype=Object.create(O),t},e.awrap=function(t){return{__await:t}},N(E.prototype),l(E.prototype,u,(function(){return this})),e.AsyncIterator=E,e.async=function(t,r,n,a,o){void 0===o&&(o=Promise);var i=new E(p(t,r,n,a),o);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},N(O),l(O,c,"Generator"),l(O,i,(function(){return this})),l(O,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=C,P.prototype={constructor:P,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(J),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function a(n,a){return u.type="throw",u.arg=e,r.next=n,a&&(r.method="next",r.arg=t),!!a}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],u=i.completion;if("root"===i.tryLoc)return a("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(c&&s){if(this.prev<i.catchLoc)return a(i.catchLoc,!0);if(this.prev<i.finallyLoc)return a(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return a(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return a(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r];if(a.tryLoc<=this.prev&&n.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=t,i.arg=e,o?(this.method="next",this.next=o.finallyLoc,b):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),b},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),J(r),b}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var a=n.arg;J(r)}return a}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:C(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),b}},e}function l(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return p(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?p(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,i=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){u=!0,o=t},f:function(){try{i||null==r.return||r.return()}finally{if(u)throw o}}}}function p(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function h(t,e,r,n,a,o,i){try{var u=t[o](i),c=u.value}catch(t){return void r(t)}u.done?e(c):Promise.resolve(c).then(n,a)}function y(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var o=t.apply(e,r);function i(t){h(o,n,a,i,u,"next",t)}function u(t){h(o,n,a,i,u,"throw",t)}i(void 0)}))}}function m(){return v.apply(this,arguments)}function v(){return(v=y(f().mark((function t(){var e,r,n,a,o,i,u,s,p;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=[],r=(new Date).getTime(),t.next=4,(0,c.Su)(6);case 4:n=t.sent,a=l(n),t.prev=6,a.s();case 8:if((o=a.n()).done){t.next=18;break}return i=o.value,t.next=12,(0,c.Ct)(6,i);case 12:u=t.sent,s=JSON.parse(u),p=new Date(s.time).getTime(),r-p<=12096e5&&e.push(s);case 16:t.next=8;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(6),a.e(t.t0);case 23:return t.prev=23,a.f(),t.finish(23);case 26:return 0===e.length&&e.push({type:"empty",time:(new Date).toISOString(),name:"沒有內容",id:0}),t.abrupt("return",e);case 28:case"end":return t.stop()}}),t,null,[[6,20,23,26]])})))).apply(this,arguments)}function d(){return b.apply(this,arguments)}function b(){return(b=y(f().mark((function t(){var e,r,n,a,o,i,u,s;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(new Date).getTime(),t.next=3,(0,c.Su)(6);case 3:r=t.sent,n=l(r),t.prev=5,n.s();case 7:if((a=n.n()).done){t.next=19;break}return o=a.value,t.next=11,(0,c.Ct)(6,o);case 11:if(i=t.sent,u=JSON.parse(i),s=new Date(u.time).getTime(),!(e-s>12096e5)){t.next=17;break}return t.next=17,(0,c.iQ)(6,o);case 17:t.next=7;break;case 19:t.next=24;break;case 21:t.prev=21,t.t0=t.catch(5),n.e(t.t0);case 24:return t.prev=24,n.f(),t.finish(24);case 27:case"end":return t.stop()}}),t,null,[[5,21,24,27]])})))).apply(this,arguments)}function g(t,e){return x.apply(this,arguments)}function x(){return(x=y(f().mark((function t(e,r){var a,s,l,p,h,y,m,v,d,b,g,x,w,k,L,S,O,N,E,_,j,T,J,P;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=(0,n.zx)("r"),s="".concat(e,"_").concat(r),l=(new Date).toISOString(),t.t0=e,t.next="route"===t.t0?6:"location"===t.t0?27:"bus"===t.t0?48:69;break;case 6:return t.next=8,(0,c.Ct)(6,s);case 8:if(!(p=t.sent)){t.next=16;break}return(h=JSON.parse(p)).time=l,t.next=14,(0,c.mL)(6,s,JSON.stringify(h));case 14:t.next=26;break;case 16:return t.next=18,(0,u.a)(a,!0);case 18:if(y=t.sent,m="r_".concat(r),!y.hasOwnProperty(m)){t.next=26;break}return v=y[m],d=v.n,b={type:"route",time:l,name:d,id:r},t.next=26,(0,c.mL)(6,s,JSON.stringify(b));case 26:case 47:case 68:case 69:return t.abrupt("break",70);case 27:return t.next=29,(0,c.Ct)(6,s);case 29:if(!(g=t.sent)){t.next=37;break}return(x=JSON.parse(g)).time=l,t.next=35,(0,c.mL)(6,s,JSON.stringify(x));case 35:t.next=47;break;case 37:return t.next=39,(0,i.g)(a,!0);case 39:if(w=t.sent,k="ml_".concat(r),!w.hasOwnProperty(k)){t.next=47;break}return L=w[k],S=L.n,O={type:"location",time:l,name:S,hash:r},t.next=47,(0,c.mL)(6,s,JSON.stringify(O));case 48:return t.next=50,(0,c.Ct)(6,s);case 50:if(!(N=t.sent)){t.next=58;break}return(E=JSON.parse(N)).time=l,t.next=56,(0,c.mL)(6,s,JSON.stringify(E));case 56:t.next=68;break;case 58:return t.next=60,(0,o.j)(a,!0);case 60:if(_=t.sent,j="c_".concat(r),!_.hasOwnProperty(j)){t.next=68;break}return T=_[j],J=T.CarNum,P={type:"bus",time:l,name:J,id:r},t.next=68,(0,c.mL)(6,s,JSON.stringify(P));case 70:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function w(t,e){return k.apply(this,arguments)}function k(){return(k=y(f().mark((function t(e,r){var n,a;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n="".concat(e,"_").concat(r),t.next=3,(0,c.Ct)(6,n);case 3:if(!(a=t.sent)){t.next=8;break}return t.abrupt("return",JSON.parse(a));case 8:return t.abrupt("return",!1);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function L(t){return S.apply(this,arguments)}function S(){return(S=y(f().mark((function t(e){var r,n,o,i,c,s,p,h,y,v,d,b,g,x,w,k,L,S,O,N,E,_,j,T,J;return f().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m();case 2:return r=t.sent,t.next=5,(0,u.a)(e,!0);case 5:n=t.sent,o=[],i=0,c=l(r),t.prev=9,c.s();case 11:if((s=c.n()).done){t.next=65;break}p=s.value,h=p.type,y=new Date(p.time),t.t0=h,t.next="route"===t.t0?18:"location"===t.t0?32:"bus"===t.t0?42:"empty"===t.t0?52:62;break;case 18:return(v={}).type="route",d=p.name,v.name=d,b=p.id,v.id=b,g="r_".concat(b),x=n[g],w=x.pid,v.pid=w,v.time={absolute:y.getTime(),relative:(0,a.HN)(y)},o.push(v),i+=1,t.abrupt("break",63);case 32:return(k={}).type="location",L=p.hash,k.hash=L,S=p.name,k.name=S,k.time={absolute:y.getTime(),relative:(0,a.HN)(y)},o.push(k),i+=1,t.abrupt("break",63);case 42:return(O={}).type="bus",N=p.id,O.id=N,E=p.name,O.name=E,O.time={absolute:y.getTime(),relative:(0,a.HN)(y)},o.push(O),i+=1,t.abrupt("break",63);case 52:return(_={}).type="empty",j=p.id,_.id=j,T=p.name,_.name=T,_.time={absolute:y.getTime(),relative:(0,a.HN)(y)},o.push(_),i=1,t.abrupt("break",63);case 62:return t.abrupt("break",63);case 63:t.next=11;break;case 65:t.next=70;break;case 67:t.prev=67,t.t1=t.catch(9),c.e(t.t1);case 70:return t.prev=70,c.f(),t.finish(70);case 73:return o.sort((function(t,e){return e.time.absolute-t.time.absolute})),J={items:o,itemQuantity:i,dataUpdateTime:(new Date).getTime()},t.abrupt("return",J);case 76:case"end":return t.stop()}}),t,null,[[9,67,70,73]])})))).apply(this,arguments)}}}]);
//# sourceMappingURL=c78ed8f33704111bedeb.js.map
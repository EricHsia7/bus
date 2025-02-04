/*! For license information please see fb8ba800faa7b60eee99.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[7449],{2757:(t,e,r)=>{r.d(e,{R:()=>E});var n=r(6788),o=r(2063),a=r(8011),i=r(7810),c=r(4293),u=r(424),s=r(3459),f=r(8134),l=r(4256),h=r(2945),p=r(2303),y=r(8932);function v(t){return v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},v(t)}function d(){d=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function f(t,e,r,n){var a=e&&e.prototype instanceof b?e:b,i=Object.create(a.prototype),c=new M(n||[]);return o(i,"_invoke",{value:O(t,r,c)}),i}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=f;var h="suspendedStart",p="suspendedYield",y="executing",g="completed",m={};function b(){}function w(){}function x(){}var _={};s(_,i,(function(){return this}));var k=Object.getPrototypeOf,L=k&&k(k(A([])));L&&L!==r&&n.call(L,i)&&(_=L);var E=x.prototype=b.prototype=Object.create(_);function S(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,a,i,c){var u=l(t[o],t,a);if("throw"!==u.type){var s=u.arg,f=s.value;return f&&"object"==v(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(f).then((function(t){s.value=t,i(s)}),(function(t){return r("throw",t,i,c)}))}c(u.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function O(e,r,n){var o=h;return function(a,i){if(o===y)throw Error("Generator is already running");if(o===g){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===m)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===h)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var s=l(e,r,n);if("normal"===s.type){if(o=n.done?g:p,s.arg===m)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=g,n.method="throw",n.arg=s.arg)}}}function P(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,P(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var a=l(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,m;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function j(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function M(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function A(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(v(e)+" is not iterable")}return w.prototype=x,o(E,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=s(x,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,s(t,u,"GeneratorFunction")),t.prototype=Object.create(E),t},e.awrap=function(t){return{__await:t}},S(I.prototype),s(I.prototype,c,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new I(f(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},S(E),s(E,u,"Generator"),s(E,i,(function(){return this})),s(E,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=A,M.prototype={constructor:M,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(j),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),j(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;j(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:A(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function g(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return m(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,c=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return i=t.done,t},e:function(t){c=!0,a=t},f:function(){try{i||null==r.return||r.return()}finally{if(c)throw a}}}}function m(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function b(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function w(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){b(a,n,o,i,c,"next",t)}function c(t){b(a,n,o,i,c,"throw",t)}i(void 0)}))}}function x(t,e){return _.apply(this,arguments)}function _(){return(_=w(d().mark((function t(e,r){var n,o,a,i,c,u,s,l;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n={},o=g(e),t.prev=2,o.s();case 4:if((a=o.n()).done){t.next=18;break}if(i=a.value,c=parseInt(i.StopID),u=parseInt(i.RouteID),!(r.indexOf(c)>-1)){t.next=16;break}return i.onThisRoute=!0,i.index=String(i.BusID).charCodeAt(0)*Math.pow(10,-5),t.next=13,(0,f.F6)(u);case 13:s=t.sent,i.RouteName=s.length>0?s[0].n:"",n.hasOwnProperty("s_"+i.StopID)?n["s_"+i.StopID].push(i):n["s_"+i.StopID]=[i];case 16:t.next=4;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(2),o.e(t.t0);case 23:return t.prev=23,o.f(),t.finish(23);case 26:for(l in n)n[l]=n[l].sort((function(t,e){return t.index-e.index}));return t.abrupt("return",n);case 28:case"end":return t.stop()}}),t,null,[[2,20,23,26]])})))).apply(this,arguments)}function k(t,e){var r,n={},o=g(t);try{for(o.s();!(r=o.n()).done;){var a=r.value;if(e.indexOf(a.StopID)>-1)n["s_".concat(a.StopID)]=a}}catch(t){o.e(t)}finally{o.f()}return n}function L(t,e){var r={},n=[];for(var o in t){var a=t[o],i=a.StopID,c=parseInt(a.EstimateTime);c>=0&&e.indexOf(i)>-1&&n.push([i,c])}var u=n.length;n.sort((function(t,e){return t[1]-e[1]}));for(var s=0,f=n;s<f.length;s++){var l=1/u,h=(l-l%.25)/.25,p=f[s][0];r["s_".concat(p)]={number:1,code:h}}return r}function E(t,e){return S.apply(this,arguments)}function S(){return(S=w(d().mark((function t(e,r){var f,v,g,m,b,w,_,E,S,I,O,P,T,j,M,A,D,N,G,F,R,C,B,Q,J,U,Y,$,q,K,V,Z,z,H,W,X,tt,et,rt,nt,ot,at,it,ct,ut;return d().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(0,n.Mf)(r,"getLocation_0",0,!1),(0,n.Mf)(r,"getLocation_1",0,!1),(0,n.Mf)(r,"getRoute_0",0,!1),(0,n.Mf)(r,"getRoute_1",0,!1),(0,n.Mf)(r,"getStop_0",0,!1),(0,n.Mf)(r,"getStop_1",0,!1),(0,n.Mf)(r,"getEstimateTime_0",0,!1),(0,n.Mf)(r,"getEstimateTime_1",0,!1),(0,n.Mf)(r,"getBusEvent_0",0,!1),(0,n.Mf)(r,"getBusEvent_1",0,!1),t.next=12,(0,o.K)(r);case 12:return f=t.sent,t.next=15,(0,a.g)(r,!0);case 15:return v=t.sent,t.next=18,(0,c.a)(r,!0);case 18:return g=t.sent,t.next=21,(0,u.T)(r);case 21:return m=t.sent,t.next=24,(0,i.J)(r);case 24:return b=t.sent,t.next=27,(0,y.Io)();case 27:for(w=t.sent,_=(0,s.Js)("time_formatting_mode"),E=(0,s.Js)("location_labels"),S={},I={},O={},P="ml_".concat(e),T=v[P],j=T.n,M=T.id,A=T.v,D=[],N=[],G=M.length,F=0;F<G;F++)D=D.concat(T.s[F]),N=N.concat(T.r[F]);return R=k(f,D),t.next=45,x(b,D);case 45:C=t.sent,B=[],t.t0=E,t.next="address"===t.t0?50:"letters"===t.t0?52:"directions"===t.t0?54:56;break;case 50:return B=(0,l._q)(T.a),t.abrupt("break",57);case 52:return B=(0,h.V)(G),t.abrupt("break",57);case 54:return B=(0,h.M)(A),t.abrupt("break",57);case 56:return t.abrupt("break",57);case 57:Q=0;case 58:if(!(Q<G)){t.next=116;break}J="g_".concat(Q),S[J]=[],I[J]=0,O[J]={name:B[Q],properties:[{key:"address",icon:"personal_places",value:(0,l.pD)(T.a[Q])},{key:"exact_position",icon:"location_on",value:"".concat(T.la[Q].toFixed(5),", ").concat(T.lo[Q].toFixed(5))}]},U=T.s[Q],Y=U.length,$=L(R,U),q=0;case 67:if(!(q<Y)){t.next=113;break}if(K={},V=T.s[Q][q],Z="s_".concat(V),z={},!m.hasOwnProperty(Z)){t.next=76;break}z=m[Z],t.next=77;break;case 76:return t.abrupt("continue",110);case 77:if(K.stopId=V,H={number:0,code:-1},$.hasOwnProperty(Z)&&(H=$[Z]),K.ranking=H,W=T.r[Q][q],X="r_".concat(W),tt={},!g.hasOwnProperty(X)){t.next=88;break}tt=g[X],t.next=89;break;case 88:return t.abrupt("continue",110);case 89:if(K.route_name=tt.n,K.route_direction="往".concat([tt.des,tt.dep,""][parseInt(z.goBack)]),K.routeId=W,et={},!R.hasOwnProperty(Z)){t.next=97;break}et=R[Z],t.next=98;break;case 97:return t.abrupt("continue",110);case 98:for(it in rt=(0,p.$Q)(et.EstimateTime,_),K.status=rt,nt=[],C.hasOwnProperty(Z)&&(nt=C[Z]),K.buses=(0,p.G2)(nt),ot={},w.hasOwnProperty(Z)&&(ot=w[Z]),at=[],ot)at=at.concat(ot[it].busArrivalTimes);K.busArrivalTimes=at,S[J].push(K),I[J]+=1;case 110:q++,t.next=67;break;case 113:Q++,t.next=58;break;case 116:for(ct in S)S[ct].sort((function(t,e){return t.routeId-e.routeId}));return ut={groupedItems:S,groups:O,groupQuantity:G,itemQuantity:I,LocationName:j,dataUpdateTime:(0,n.Zt)(r)},(0,n.LQ)(r),(0,n.gC)(r),t.abrupt("return",ut);case 121:case"end":return t.stop()}}),t)})))).apply(this,arguments)}}}]);
//# sourceMappingURL=fb8ba800faa7b60eee99.js.map
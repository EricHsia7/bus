/*! For license information please see fb3c8503e12eba133629.js.LICENSE.txt */
"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[516],{540:(t,e,r)=>{r.d(e,{F:()=>q,a:()=>Q});var n=r(9566),o=r(4537),a=r(3459),i=r(5224),c=r(3648),u=r(8024),s=r(6788),l=r(9119);function f(t){return f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},f(t)}function h(){h=function(){return e};var t,e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(t,e,r){t[e]=r.value},a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function s(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{s({},"")}catch(t){s=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var a=e&&e.prototype instanceof g?e:g,i=Object.create(a.prototype),c=new O(n||[]);return o(i,"_invoke",{value:T(t,r,c)}),i}function d(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}e.wrap=l;var p="suspendedStart",v="suspendedYield",y="executing",b="completed",m={};function g(){}function w(){}function x(){}var k={};s(k,i,(function(){return this}));var L=Object.getPrototypeOf,_=L&&L(L(S([])));_&&_!==r&&n.call(_,i)&&(k=_);var j=x.prototype=g.prototype=Object.create(k);function E(t){["next","throw","return"].forEach((function(e){s(t,e,(function(t){return this._invoke(e,t)}))}))}function I(t,e){function r(o,a,i,c){var u=d(t[o],t,a);if("throw"!==u.type){var s=u.arg,l=s.value;return l&&"object"==f(l)&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(l).then((function(t){s.value=t,i(s)}),(function(t){return r("throw",t,i,c)}))}c(u.arg)}var a;o(this,"_invoke",{value:function(t,n){function o(){return new e((function(e,o){r(t,n,e,o)}))}return a=a?a.then(o,o):o()}})}function T(e,r,n){var o=p;return function(a,i){if(o===y)throw Error("Generator is already running");if(o===b){if("throw"===a)throw i;return{value:t,done:!0}}for(n.method=a,n.arg=i;;){var c=n.delegate;if(c){var u=P(c,n);if(u){if(u===m)continue;return u}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===p)throw o=b,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=y;var s=d(e,r,n);if("normal"===s.type){if(o=n.done?b:v,s.arg===m)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(o=b,n.method="throw",n.arg=s.arg)}}}function P(e,r){var n=r.method,o=e.iterator[n];if(o===t)return r.delegate=null,"throw"===n&&e.iterator.return&&(r.method="return",r.arg=t,P(e,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),m;var a=d(o,e.iterator,r.arg);if("throw"===a.type)return r.method="throw",r.arg=a.arg,r.delegate=null,m;var i=a.arg;return i?i.done?(r[e.resultName]=i.value,r.next=e.nextLoc,"return"!==r.method&&(r.method="next",r.arg=t),r.delegate=null,m):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,m)}function M(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(M,this),this.reset(!0)}function S(e){if(e||""===e){var r=e[i];if(r)return r.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var o=-1,a=function r(){for(;++o<e.length;)if(n.call(e,o))return r.value=e[o],r.done=!1,r;return r.value=t,r.done=!0,r};return a.next=a}}throw new TypeError(f(e)+" is not iterable")}return w.prototype=x,o(j,"constructor",{value:x,configurable:!0}),o(x,"constructor",{value:w,configurable:!0}),w.displayName=s(x,u,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,s(t,u,"GeneratorFunction")),t.prototype=Object.create(j),t},e.awrap=function(t){return{__await:t}},E(I.prototype),s(I.prototype,c,(function(){return this})),e.AsyncIterator=I,e.async=function(t,r,n,o,a){void 0===a&&(a=Promise);var i=new I(l(t,r,n,o),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(j),s(j,u,"Generator"),s(j,i,(function(){return this})),s(j,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},e.values=S,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=t,this.done=!1,this.delegate=null,this.method="next",this.arg=t,this.tryEntries.forEach(A),!e)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=t)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var r=this;function o(n,o){return c.type="throw",c.arg=e,r.next=n,o&&(r.method="next",r.arg=t),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],c=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var u=n.call(i,"catchLoc"),s=n.call(i,"finallyLoc");if(u&&s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(u){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!s)throw Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,m):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),m},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),m}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(e,r,n){return this.delegate={iterator:S(e),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=t),m}},e}function d(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function p(t){return function(){var e=this,r=arguments;return new Promise((function(n,o){var a=t.apply(e,r);function i(t){d(a,n,o,i,c,"next",t)}function c(t){d(a,n,o,i,c,"throw",t)}i(void 0)}))}}var v=(0,c.bv)(".f"),y=(0,c.aI)(v,".x"),b=(0,c.aI)(v,".g"),m=(0,c.aI)(b,".i"),g=(0,c.aI)(y,".ia .ka"),w={},x=!1,k=15e3,L=5e3,_=15e3,j=!0,E=!1,I=0,T=0,P=!1,M="",A=!1;function O(){return{width:window.innerWidth,height:window.innerHeight}}function S(){var t=document.createElement("div");return t.classList.add("eb"),t.setAttribute("type","stop"),t.innerHTML='<div class="fb"></div><div class="gb"></div><div class="hb"></div><div class="ib"><div class="mb"><div class="nb" code="0"></div><div class="ob" code="0"></div></div><div class="jb">'.concat((0,o.Z)("keyboard_arrow_right"),'</div><div class="kb"></div></div>'),{element:t,id:null}}function C(){var t=(new Date).getTime(),e=0;e=P?-1+(0,s._M)(M):-1*Math.min(1,Math.max(0,Math.abs(t-I)/_)),g.style.setProperty("--pa",e.toString()),window.requestAnimationFrame((function(){E&&C()}))}function q(t){for(var e=O(),r=(e.width,e.height),n={f_0:Math.floor(r/50/3)+2,f_1:Math.floor(r/50/3)+2,f_2:Math.floor(r/50/3)+2},o={},a={},i=0;i<3;i++){var c="f_".concat(i);o[c]=[],a[c]={name:"",index:i,icon:""};for(var u=0;u<n[c];u++)o[c].push({type:"stop",id:null,status:{code:0,text:null},name:null,route:{name:null,endPoints:{departure:null,destination:null},id:null,pathAttributeId:[]}})}D(t,{foldedContent:o,folders:a,folderQuantity:3,itemQuantity:n,dataUpdateTime:null},!0)}function D(t,e,r){return G.apply(this,arguments)}function G(){return(G=p(h().mark((function t(e,r,n){var a,i,s,l,f,d,p,v,y,b,m,g,k,L,_,j,E,I,T,P,M,A,C,q,D,G,N,F,R;return h().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(a=function(t,e,r){function a(t,e){t.setAttribute("type",e.type)}function i(t,e){var r=(0,c.aI)(t,".fb"),n="";switch(e.type){case"stop":n="location_on";break;case"route":n="route";break;case"bus":n="directions_bus";break;case"empty":n="lightbulb";break;default:n=""}r.innerHTML=(0,o.Z)(n)}function s(t,e){if("stop"===e.type){var r=(0,c.aI)(t,".ib .mb"),n=(0,c.aI)(r,".nb"),o=(0,c.aI)(r,".ob");n.setAttribute("code",e.status.code),n.innerText=e.status.text,o.addEventListener("animationend",(function(){o.setAttribute("code",e.status.code),o.innerText=e.status.text,o.classList.remove("sb")}),{once:!0}),o.classList.add("sb")}}function l(t,e){var r="";switch(e.type){case"stop":case"route":r=e.name;break;case"bus":r=e.busID;break;case"empty":r="沒有內容";break;default:r="null"}(0,c.aI)(t,".hb").innerText=r}function f(t,e){var r="";switch(e.type){case"stop":r="".concat(e.route?e.route.name:""," - 往").concat(e.route?[e.route.endPoints.destination,e.route.endPoints.departure,""][e.direction?e.direction:0]:"");break;case"route":r="".concat(e.endPoints.departure," ↔ ").concat(e.endPoints.destination);break;case"bus":r=e.currentRoute.name;break;case"empty":r="提示";break;default:r="null"}(0,c.aI)(t,".gb").innerText=r}function h(t,e){var r=(0,c.aI)(t,".ib .jb"),n="";switch(e.type){case"stop":n="bus.route.openRoute(".concat(e.route.id,", [").concat(e.route.pathAttributeId.join(","),"])");break;case"route":n="bus.route.openRoute(".concat(e.id,", [").concat(e.pathAttributeId.join(","),"])")}r.setAttribute("onclick",n)}function d(t,e){t.setAttribute("skeleton-screen",(0,u.xZ)(e))}if(null===r)a(t,e),i(t,e),s(t,e),l(t,e),f(t,e),h(t,e),d(t,n);else if(e.type!==r.type)a(t,e),i(t,e),s(t,e),l(t,e),f(t,e),h(t,e),d(t,n);else{switch(e.type){case"stop":(0,u.hw)(r.route,e.route)||(f(t,e),h(t,e)),(0,u.hw)(r.name,e.name)||l(t,e),e.status.code===r.status.code&&(0,u.hw)(r.status.text,e.status.text)||s(t,e);break;case"route":(0,u.hw)(r.id,e.id)||h(t,e),(0,u.hw)(r.endPoints,e.endPoints)||f(t,e),(0,u.hw)(r.name,e.name)||l(t,e);break;case"bus":(0,u.hw)(r.currentRoute,e.currentRoute)||f(t,e),(0,u.hw)(r.busID,e.busID)||l(t,e);break;case"empty":e.type!==r.type&&(f(t,e),l(t,e))}n!==x&&d(t,n)}},i=O(),i.width,i.height,s=r.folderQuantity,l=r.itemQuantity,f=r.foldedContent,d=r.folders,e.setAttribute("skeleton-screen",n),p=(0,c.jg)(e,".qa").length,s!==p)if((v=p-s)<0)for(y=0;y<Math.abs(v);y++)h=void 0,(h=document.createElement("div")).classList.add("qa"),h.innerHTML='<div class="sa"><div class="ta"></div><div class="va"></div></div><div class="wa"></div>',b={element:h,id:""},e.appendChild(b.element);else for(m=(0,c.jg)(e,".qa"),g=0;g<Math.abs(v);g++)m[p-1-g].remove();for(k=0;k<s;k++)if(L="f_".concat(k),_=(0,c.jg)((0,c.jg)(e,".qa")[k],".wa .eb").length,l[L]!==_)if((j=_-l[L])<0)for(E=(0,c.aI)((0,c.jg)(e,".qa")[k],".wa"),I=0;I<Math.abs(j);I++)T=S(),E.appendChild(T.element);else for(P=(0,c.jg)((0,c.jg)(e,".qa")[k],".wa .eb"),M=0;M<Math.abs(j);M++)P[_-1-M].remove();for(A=0;A<s;A++)for(C="f_".concat(A),(q=(0,c.jg)(e,".qa")[A]).setAttribute("skeleton-screen",n),D=(0,c.aI)(q,".sa"),(0,c.aI)(D,".va").innerText=d[C].name,(0,c.aI)(D,".ta").innerHTML=(0,o.Z)(d[C].icon),G=0;G<l[C];G++)N=(0,c.jg)((0,c.jg)(e,".qa")[A],".wa .eb")[G],F=f[C][G],w.hasOwnProperty("foldedContent")&&w.foldedContent.hasOwnProperty(C)&&w.foldedContent[C][G]?(R=w.foldedContent[C][G],a(N,F,R)):a(N,F,null);w=r,x=n;case 15:case"end":return t.stop()}var h}),t)})))).apply(this,arguments)}function N(){return F.apply(this,arguments)}function F(){return(F=p(h().mark((function t(){var e,r,o;return h().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=(0,a.Js)("refresh_interval"),j=e.dynamic,k=e.baseInterval,P=!0,M=(0,u.zx)("r"),g.setAttribute("refreshing","true"),t.next=8,(0,n.R_)(M);case 8:return r=t.sent,D(m,r,!1),I=(new Date).getTime(),t.next=13,(0,i.wz)();case 13:return o=t.sent,T=j?Math.max((new Date).getTime()+L,r.dataUpdateTime+k/o):(new Date).getTime()+k,_=Math.max(L,T-(new Date).getTime()),P=!1,g.setAttribute("refreshing","false"),t.abrupt("return",{status:"Successfully refreshed the folders."});case 19:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function R(){return H.apply(this,arguments)}function H(){return(H=p(h().mark((function t(){return h().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:N().then((function(t){E?setTimeout((function(){R()}),Math.max(L,T-(new Date).getTime())):A=!1})).catch((function(t){console.error(t),E?((0,l.a)("（資料夾）發生網路錯誤，將在".concat(10,"秒後重試。"),"error"),setTimeout((function(){R()}),1e4)):A=!1}));case 1:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function Q(){q((0,c.bv)(".f .g .i")),E||(E=!0,A?N():(A=!0,R()),C())}}}]);
//# sourceMappingURL=fb3c8503e12eba133629.js.map
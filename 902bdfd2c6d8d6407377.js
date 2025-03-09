"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[343],{4225:(t,e,r)=>{r.d(e,{F:()=>l});var n=r(7183),a=r(4311);function i(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return o(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return s=t.done,t},e:function(t){u=!0,i=t},f:function(){try{s||null==r.return||r.return()}finally{if(u)throw i}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e,r,n,a,i,o){try{var s=t[i](o),u=s.value}catch(t){return void r(t)}s.done?e(u):Promise.resolve(u).then(n,a)}function u(t){var e="",r="";switch((0,a.pD)(t)){case"cacheStore":e="快取",r="cache";break;case"settingsStore":e="設定",r="settings";break;case"dataUsageStatsStore":case"updateRateDataStore":case"updateRateDataWriteAheadLogStore":case"busArrivalTimeDataWriteAheadLogStore":case"busArrivalTimeDataStore":e="分析",r="analytics";break;case"personalScheduleStore":e="個人化行程",r="personalSchedule";break;case"recentViewsStore":e="最近檢視",r="recentViews";break;case"folderListStore":case"folderContentIndexStore":case"folderContentStore":e="資料夾",r="folders";break;default:e="其他",r="others"}return{name:e,key:r}}function l(){return f.apply(this,arguments)}function f(){var t;return t=function*(){for(var t=0,e={},r=(0,a.le)(),o=0;o<r;o++){var s,l=0,f=i(yield(0,a.Su)(o));try{for(f.s();!(s=f.n()).done;){var c=s.value,y=yield(0,a.Ct)(o,c),m=String(y).length+c.length;t+=m,l+=m}}catch(t){f.e(t)}finally{f.f()}var d=u(o),v=d.key;e.hasOwnProperty(v)||(e[v]={category:d,size:0}),e[d.key].size=e[d.key].size+l}var p=(0,n.tH)(t),h={};for(var g in e){var S=e[g].category,b=e[g].size;h[g]={category:S,size:(0,n.tH)(b)}}return{totalSize:p,categorizedSizes:h}},f=function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){s(i,n,a,o,u,"next",t)}function u(t){s(i,n,a,o,u,"throw",t)}o(void 0)}))},f.apply(this,arguments)}},5767:(t,e,r)=>{r.d(e,{Eu:()=>w,MN:()=>I,cy:()=>O,fV:()=>x,wz:()=>C});var n=r(8024),a=r(4311),i=r(5428);function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,a,i,o,s=[],u=!0,l=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=i.call(r)).done)&&(s.push(n.value),s.length!==e);u=!0);}catch(t){l=!0,a=t}finally{try{if(!u&&null!=r.return&&(o=r.return(),Object(o)!==o))return}finally{if(l)throw a}}return s}}(t,e)||f(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(t,e,r,n,a,i,o){try{var s=t[i](o),u=s.value}catch(t){return void r(t)}s.done?e(u):Promise.resolve(u).then(n,a)}function u(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){s(i,n,a,o,u,"next",t)}function u(t){s(i,n,a,o,u,"throw",t)}o(void 0)}))}}function l(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=f(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){s=!0,i=t},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw i}}}}function f(t,e){if(t){if("string"==typeof t)return c(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(t,e):void 0}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}var y=[],m="",d=!1,v=0,p={data:{},timestamp:0,id:""},h=[],g={};function S(t){var e,r=0,n=0,a=0,i=0,o=0,s=l(t);try{for(s.s();!(e=s.n()).done;){var u=e.value,f=u[0],c=u[1];o+=1,r+=f,a+=c,n+=Math.pow(f,2),i+=Math.pow(c,2)}}catch(t){s.e(t)}finally{s.f()}var y,m=r/o,d=a/o,v=n/o-Math.pow(m,2),p=i/o-Math.pow(d,2),h=Math.sqrt(v),g=Math.sqrt(p),S=0,b=l(t);try{for(b.s();!(y=b.n()).done;){var w=y.value;S+=(w[0]-m)*(w[1]-d)}}catch(t){b.e(t)}finally{b.f()}return{estimate_time:{average:m,stdev:h},timestamp:{average:d,stdev:g},length:o,correlation:(S/=o)/(h*g)}}function b(t,e){var r=t.length+e.length,n=(t.estimate_time.average*t.length+e.estimate_time.average*e.length)/r,a=(t.timestamp.average*t.length+e.timestamp.average*e.length)/r;return{estimate_time:{average:n,stdev:(0,i.VY)(t.estimate_time.average,t.estimate_time.stdev,t.length,e.estimate_time.average,e.estimate_time.stdev,e.length)},timestamp:{average:a,stdev:(0,i.VY)(t.timestamp.average,t.timestamp.stdev,t.length,e.timestamp.average,e.timestamp.stdev,e.length)},length:r,correlation:(0,i.Hi)(t.estimate_time.average,t.timestamp.average,t.estimate_time.stdev,t.timestamp.stdev,t.length,t.correlation,e.estimate_time.average,e.timestamp.average,e.estimate_time.stdev,e.timestamp.stdev,e.length,e.correlation)}}function w(t){return A.apply(this,arguments)}function A(){return(A=u((function*(t){var e=(new Date).getTime(),r=!1;if(!d){d=!0,y=[],m=(0,n.zx)("u"),p={data:{},timestamp:e,id:m},v=0;for(var i=t.length-1,o=0;o<32;o++){var s=t[Math.floor(Math.random()*i)];y.push(s.StopID)}}var u,f=l(t);try{for(f.s();!(u=f.n()).done;){var c=u.value,w=c.StopID,A="s_".concat(w);y.indexOf(w)>-1&&(p.data.hasOwnProperty(A)||(p.data[A]=[]),p.data[A].push([parseInt(c.EstimateTime),Math.floor((e-p.timestamp)/1e3)]))}}catch(t){f.e(t)}finally{f.f()}if(console.log(p),(v+=1)>45&&(r=!0),v%5==0&&(yield(0,a.mL)(4,m,JSON.stringify(p))),r){var O,D=l(y);try{for(D.s();!(O=D.n()).done;){var I=O.value,M="s_".concat(I),x=p.data[M],_={},J=yield(0,a.Ct)(3,M);if(J){var N=JSON.parse(J);_.stats=b(N.stats,S(x)),_.timestamp=N.timestamp,_.id=I}else _.stats=S(x),_.timestamp=e,_.id=I;if(yield(0,a.mL)(3,M,JSON.stringify(_)),g.hasOwnProperty(M)){var T=g[M];h.splice(T,1,_)}else h[M]=h.length,h.push(_);yield(0,a.iQ)(4,m)}}catch(t){D.e(t)}finally{D.f()}d=!1}}))).apply(this,arguments)}function O(){return D.apply(this,arguments)}function D(){return(D=u((function*(){var t,e=(new Date).getTime()-252e5,r=l(yield(0,a.Su)(4));try{for(r.s();!(t=r.n()).done;){var n=t.value,i=yield(0,a.Ct)(4,n);if(i){var o=JSON.parse(i),s=o.timestamp,u=o.id;if(s>e)for(var f in o.data){var c=o.data[f],y={},m=yield(0,a.Ct)(3,f);if(m){var d=JSON.parse(m);y.stats=b(d.stats,S(c)),y.timestamp=d.timestamp,y.id=d.id}else y.stats=S(c),y.timestamp=currentTimestamp,y.id=parseInt(f.split("_")[1]);if(yield(0,a.mL)(3,f,JSON.stringify(y)),g.hasOwnProperty(f)){var v=g[f];h.splice(v,1,y)}else h[f]=h.length,h.push(y)}yield(0,a.iQ)(4,u)}}}catch(t){r.e(t)}finally{r.f()}}))).apply(this,arguments)}function I(){return M.apply(this,arguments)}function M(){return(M=u((function*(){var t,e=(new Date).getTime()-252e5,r=0,n=l(yield(0,a.Su)(3));try{for(n.s();!(t=n.n()).done;){var i=t.value,o=yield(0,a.Ct)(3,i);if(o){var s=JSON.parse(o);s.timestamp>e&&(h.push(s),g[i]=r,r+=1)}}}catch(t){n.e(t)}finally{n.f()}}))).apply(this,arguments)}function x(){return _.apply(this,arguments)}function _(){return(_=u((function*(){var t,e=(new Date).getTime()-252e5,r=l(yield(0,a.Su)(3));try{for(r.s();!(t=r.n()).done;){var n=t.value,i=yield(0,a.Ct)(3,n);JSON.parse(i).timestamp<=e&&(yield(0,a.iQ)(3,n))}}catch(t){r.e(t)}finally{r.f()}}))).apply(this,arguments)}var J,N={};if("undefined"!=typeof SharedWorker){var T=new SharedWorker(new URL(r.p+r.u(932),r.b));(J=T.port).start()}else{var k=new Worker(new URL(r.p+r.u(551),r.b));J=k}function C(){return L.apply(this,arguments)}function L(){return(L=u((function*(){var t,e=yield(t=(new Date).getTime()-252e5,h.filter((function(e){return e.timestamp>t}))),r=(0,n.zx)("t"),a=yield new Promise((function(t,n){N[r]=t,J.onerror=function(t){n(t.message)},J.postMessage([e,r])}));return console.log(e.length,a),a}))).apply(this,arguments)}J.onmessage=function(t){var e=o(t.data,2),r=e[0],n=e[1];N[n]&&(N[n](r),delete N[n])},J.onerror=function(t){console.error(t.message)}},6483:(t,e,r)=>{r.d(e,{$t:()=>O,Io:()=>N,VZ:()=>w});var n=r(8024),a=r(5428),i=r(9566),o=r(5352),s=r(4311);function u(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=f(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){s=!0,i=t},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw i}}}}function l(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,a,i,o,s=[],u=!0,l=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;u=!1}else for(;!(u=(n=i.call(r)).done)&&(s.push(n.value),s.length!==e);u=!0);}catch(t){l=!0,a=t}finally{try{if(!u&&null!=r.return&&(o=r.return(),Object(o)!==o))return}finally{if(l)throw a}}return s}}(t,e)||f(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(t,e){if(t){if("string"==typeof t)return c(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?c(t,e):void 0}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function y(t,e,r,n,a,i,o){try{var s=t[i](o),u=s.value}catch(t){return void r(t)}s.done?e(u):Promise.resolve(u).then(n,a)}function m(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){y(i,n,a,o,s,"next",t)}function s(t){y(i,n,a,o,s,"throw",t)}o(void 0)}))}}var d="",v=!1,p=[],h={data:{},timestamp:0,id:""},g=0;function S(t){for(var e=new Uint32Array(1440),r=t.length-1;r>=0;r--){var n=t[r],a=0,i=0;n[0]>=0?(a=n[1]+1e3*n[0],i=1):(a=n[1],i=0);var o=new Date(a);e[60*o.getHours()+o.getMinutes()]+=i}return Array.from(e)}function b(t,e){for(var r=new Uint32Array(1440),n=1439;n>=0;n--)r[n]=t[n]+e[n];return Array.from(r)}function w(t){return A.apply(this,arguments)}function A(){return(A=m((function*(t){var e=new Date,r=e.getTime(),l=e.getDay(),f=!1;if(!v){v=!0,d=(0,n.zx)("b"),h={id:d,timestamp:r,data:{}},g=0;var c=yield(0,i.$j)(["stop"]);p=c.map((function(t){return t.id}))}if((0,o.vQ)(e)){var y,m=u(t);try{for(m.s();!(y=m.n()).done;){var w=y.value,A=w.StopID,O="s_".concat(A,"_").concat(l);p.indexOf(A)>-1&&(h.data.hasOwnProperty(O)||(h.data[O]=[]),h.data[O].push([parseInt(w.EstimateTime),r]))}}catch(t){m.e(t)}finally{m.f()}if((g+=1)>32&&(f=!0),(f||g%8==0)&&(yield(0,s.mL)(5,d,JSON.stringify(h))),f){var D,I=u(p);try{for(I.s();!(D=I.n()).done;){var M=D.value,x="s_".concat(M,"_").concat(l),_=h.data[x],J={},N=yield(0,s.Ct)(6,x);if(N){var T=JSON.parse(N),k=S(_),C=b(T.stats,k);J.stats=C;var L=(0,a.DJ)(C);J.min=L[0],J.max=L[1],J.day=l,J.timestamp=T.timestamp,J.id=M}else{var P=S(_);J.stats=P;var j=(0,a.DJ)(P);J.min=j[0],J.max=j[1],J.day=l,J.timestamp=r,J.id=M}yield(0,s.mL)(6,x,JSON.stringify(J)),yield(0,s.iQ)(5,d)}}catch(t){I.e(t)}finally{I.f()}v=!1}}}))).apply(this,arguments)}function O(){return D.apply(this,arguments)}function D(){return(D=m((function*(){var t,e=new Date,r=e.getTime(),n=e.getDay(),i=u(yield(0,s.Su)(5));try{for(i.s();!(t=i.n()).done;){var o=t.value,l=yield(0,s.Ct)(5,o),f=JSON.parse(l),c=f.id;for(var y in f.data){var m=f[y],d={},v=yield(0,s.Ct)(6,y);if(v){var p=JSON.parse(v),h=S(m);d.stats=b(p.stats,h);var g=(0,a.DJ)(h.concat(p.max,p.min));d.min=g[0],d.max=g[1],d.day=p.day,d.timestamp=p.timestamp,d.id=stopID}else{var w=S(m);d.stats=w;var A=(0,a.DJ)(w);d.min=A[0],d.max=A[1],d.day=n,d.timestamp=r,d.id=stopID}yield(0,s.mL)(6,y,JSON.stringify(d)),yield(0,s.iQ)(5,c)}}}catch(t){i.e(t)}finally{i.f()}}))).apply(this,arguments)}function I(){return(I=m((function*(){var t,e=[],r=u(yield(0,s.Su)(6));try{for(r.s();!(t=r.n()).done;){var n=t.value,a=yield(0,s.Ct)(6,n);if(a){var i=JSON.parse(a);e.push(i)}}}catch(t){r.e(t)}finally{r.f()}return e}))).apply(this,arguments)}var M,x={};if("undefined"!=typeof SharedWorker){var _=new SharedWorker(new URL(r.p+r.u(592),r.b));(M=_.port).start()}else{var J=new Worker(new URL(r.p+r.u(211),r.b));M=J}function N(t,e){return T.apply(this,arguments)}function T(){return T=m((function*(t,e){var r=(0,n.zx)("t"),a=yield(0,o.ty)(),i=yield function(){return I.apply(this,arguments)}();return yield new Promise((function(n,o){x[r]=n,M.onerror=function(t){o(t.message)},M.postMessage([a,i,t,e,r])}))})),T.apply(this,arguments)}M.onmessage=function(t){var e=l(t.data,2),r=e[0],n=e[1];x[n]&&(x[n](r),delete x[n])},M.onerror=function(t){console.error(t.message)}},8925:(t,e,r)=>{r.d(e,{Ir:()=>y,LN:()=>d,N$:()=>l});var n=r(5579),a=r(4311);function i(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return o(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,u=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return s=t.done,t},e:function(t){u=!0,i=t},f:function(){try{s||null==r.return||r.return()}finally{if(u)throw i}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e,r,n,a,i,o){try{var s=t[i](o),u=s.value}catch(t){return void r(t)}s.done?e(u):Promise.resolve(u).then(n,a)}function u(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){s(i,n,a,o,u,"next",t)}function u(t){s(i,n,a,o,u,"throw",t)}o(void 0)}))}}function l(t,e){return f.apply(this,arguments)}function f(){return(f=u((function*(t,e){var r="d_".concat((0,n.$T)(e,"YYYY_MM_DD")),i=60*e.getHours()+e.getMinutes(),o=yield(0,a.Ct)(2,r);if(o){var s=JSON.parse(o);s.stats.sum+=t,s.data[i]+=t;var u=s.data[i];u>s.stats.max&&(s.stats.max=u),u<s.stats.min&&(s.stats.min=u),yield(0,a.mL)(2,r,JSON.stringify(s))}else{var l={},f=new Uint32Array(1440);f[i]+=t,l.data=Array.from(f),l.stats={sum:t,max:t,min:0},l.date=[e.getFullYear(),e.getMonth()+1,e.getDate()],yield(0,a.mL)(2,r,JSON.stringify(l))}}))).apply(this,arguments)}function c(){return(c=u((function*(){var t=new Date;t.setHours(0),t.setMinutes(0),t.setSeconds(0),t.setMilliseconds(0);for(var e=(0,n.S1)(t,-7,0,0),r=[],i=1;i<=7;i++){var o=(0,n.S1)(e,i,0,0),s="d_".concat((0,n.$T)(o,"YYYY_MM_DD")),u=yield(0,a.Ct)(2,s);if(u){var l=JSON.parse(u);r.push(l)}else{var f={},c=new Uint32Array(1440);f.data=Array.from(c),f.stats={sum:0,max:0,min:0},f.date=[o.getFullYear(),o.getMonth()+1,o.getDate()],r.push(f)}}return r}))).apply(this,arguments)}function y(){return m.apply(this,arguments)}function m(){return(m=u((function*(){var t,e=(new Date).getTime(),r=i(yield(0,a.Su)(2));try{for(r.s();!(t=r.n()).done;){var o=t.value,s=yield(0,a.Ct)(2,o),u=JSON.parse(s);e-(0,n.uP)(u.date[0],u.date[1],u.date[2]).getTime()>6048e5&&(yield(0,a.iQ)(2,o))}}catch(t){r.e(t)}finally{r.f()}}))).apply(this,arguments)}function d(t,e,r){return v.apply(this,arguments)}function v(){return v=u((function*(t,e,n){var a=new Worker(new URL(r.p+r.u(106),r.b)),i=yield function(){return c.apply(this,arguments)}();return yield new Promise((function(r,o){a.onmessage=function(t){r(t.data),a.terminate()},a.onerror=function(t){o(t.message),a.terminate()},a.postMessage([i,t,e,n])}))})),v.apply(this,arguments)}}}]);
//# sourceMappingURL=902bdfd2c6d8d6407377.js.map
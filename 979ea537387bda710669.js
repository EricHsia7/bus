"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[343],{4225:(t,e,r)=>{r.d(e,{F:()=>c});var n=r(7183),a=r(4311);function i(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=function(t,e){if(t){if("string"==typeof t)return o(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(t,e):void 0}}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,l=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return s=t.done,t},e:function(t){l=!0,i=t},f:function(){try{s||null==r.return||r.return()}finally{if(l)throw i}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e,r,n,a,i,o){try{var s=t[i](o),l=s.value}catch(t){return void r(t)}s.done?e(l):Promise.resolve(l).then(n,a)}function l(t){var e="",r="";switch((0,a.pD)(t)){case"cacheStore":e="快取",r="cache";break;case"settingsStore":e="設定",r="settings";break;case"dataUsageRecordsStore":case"updateRateDataStore":case"updateRateDataWriteAheadLogStore":case"busArrivalTimeDataWriteAheadLogStore":case"busArrivalTimeDataStore":e="分析",r="analytics";break;case"personalScheduleStore":e="個人化行程",r="personalSchedule";break;case"recentViewsStore":e="最近檢視",r="recentViews";break;case"folderListStore":case"folderContentIndexStore":case"folderContentStore":e="資料夾",r="folders";break;default:e="其他",r="others"}return{name:e,key:r}}function c(){return u.apply(this,arguments)}function u(){var t;return t=function*(){for(var t=0,e={},r=(0,a.le)(),o=0;o<r;o++){var s,c=0,u=i(yield(0,a.Su)(o));try{for(u.s();!(s=u.n()).done;){var f=s.value,y=yield(0,a.Ct)(o,f),d=String(y).length+f.length;t+=d,c+=d}}catch(t){u.e(t)}finally{u.f()}var m=l(o),p=m.key;e.hasOwnProperty(p)||(e[p]={category:m,size:0}),e[m.key].size=e[m.key].size+c}var v=(0,n.tH)(t),h={};for(var g in e){var w=e[g].category,b=e[g].size;h[g]={category:w,size:(0,n.tH)(b)}}return{totalSize:v,categorizedSizes:h}},u=function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){s(i,n,a,o,l,"next",t)}function l(t){s(i,n,a,o,l,"throw",t)}o(void 0)}))},u.apply(this,arguments)}},5767:(t,e,r)=>{r.d(e,{Eu:()=>S,MN:()=>A,cy:()=>x,fV:()=>O,wz:()=>T});var n=r(8024),a=r(4311),i=r(5428);function o(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,a,i,o,s=[],l=!0,c=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;l=!1}else for(;!(l=(n=i.call(r)).done)&&(s.push(n.value),s.length!==e);l=!0);}catch(t){c=!0,a=t}finally{try{if(!l&&null!=r.return&&(o=r.return(),Object(o)!==o))return}finally{if(c)throw a}}return s}}(t,e)||u(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function s(t,e,r,n,a,i,o){try{var s=t[i](o),l=s.value}catch(t){return void r(t)}s.done?e(l):Promise.resolve(l).then(n,a)}function l(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){s(i,n,a,o,l,"next",t)}function l(t){s(i,n,a,o,l,"throw",t)}o(void 0)}))}}function c(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=u(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){s=!0,i=t},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw i}}}}function u(t,e){if(t){if("string"==typeof t)return f(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(t,e):void 0}}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}var y=[],d="",m=!1,p=0,v={data:{},timestamp:0,id:""},h=[],g={};function w(t){var e,r=0,n=0,a=0,i=0,o=0,s=c(t);try{for(s.s();!(e=s.n()).done;){var l=e.value,u=l[0],f=l[1];o+=1,r+=u,a+=f,n+=Math.pow(u,2),i+=Math.pow(f,2)}}catch(t){s.e(t)}finally{s.f()}var y,d=r/o,m=a/o,p=n/o-Math.pow(d,2),v=i/o-Math.pow(m,2),h=Math.sqrt(p),g=Math.sqrt(v),w=0,b=c(t);try{for(b.s();!(y=b.n()).done;){var S=y.value;w+=(S[0]-d)*(S[1]-m)}}catch(t){b.e(t)}finally{b.f()}return{estimate_time:{average:d,stdev:h},timestamp:{average:m,stdev:g},length:o,correlation:(w/=o)/(h*g)}}function b(t,e){var r=t.length+e.length,n=(t.estimate_time.average*t.length+e.estimate_time.average*e.length)/r,a=(t.timestamp.average*t.length+e.timestamp.average*e.length)/r;return{estimate_time:{average:n,stdev:(0,i.VY)(t.estimate_time.average,t.estimate_time.stdev,t.length,e.estimate_time.average,e.estimate_time.stdev,e.length)},timestamp:{average:a,stdev:(0,i.VY)(t.timestamp.average,t.timestamp.stdev,t.length,e.timestamp.average,e.timestamp.stdev,e.length)},length:r,correlation:(0,i.Hi)(t.estimate_time.average,t.timestamp.average,t.estimate_time.stdev,t.timestamp.stdev,t.length,t.correlation,e.estimate_time.average,e.timestamp.average,e.estimate_time.stdev,e.timestamp.stdev,e.length,e.correlation)}}function S(t){return _.apply(this,arguments)}function _(){return(_=l((function*(t){var e=(new Date).getTime(),r=!1;if(!m){m=!0,y=[],d=(0,n.zx)("u"),v={data:{},timestamp:e,id:d},p=0;for(var i=t.length-1,o=0;o<16;o++){var s=t[Math.floor(Math.random()*i)];y.push(s.StopID)}}var l,u=c(t);try{for(u.s();!(l=u.n()).done;){var f=l.value,S=f.StopID,_="s_".concat(S);y.indexOf(S)>-1&&(v.data.hasOwnProperty(_)||(v.data[_]=[]),v.data[_].push([parseInt(f.EstimateTime),Math.floor((e-v.timestamp)/1e3)]),(p+=1)>90&&(r=!0))}}catch(t){u.e(t)}finally{u.f()}if(p%15==0&&(yield(0,a.mL)(4,d,JSON.stringify(v))),r){var x,M=c(y);try{for(M.s();!(x=M.n()).done;){var A=x.value,D="s_".concat(A),O=v.data[D],k={},I=yield(0,a.Ct)(3,D);if(I){var J=JSON.parse(I);k.stats=b(J.stats,w(O)),k.timestamp=J.timestamp,k.id=A}else k.stats=w(O),k.timestamp=e,k.id=A;if(yield(0,a.mL)(3,D,JSON.stringify(k)),g.hasOwnProperty(D)){var C=g[D];h.splice(C,1,k)}else h[D]=h.length,h.push(k);yield(0,a.iQ)(4,d)}}catch(t){M.e(t)}finally{M.f()}m=!1}}))).apply(this,arguments)}function x(){return M.apply(this,arguments)}function M(){return(M=l((function*(){var t,e=(new Date).getTime()-252e5,r=c(yield(0,a.Su)(4));try{for(r.s();!(t=r.n()).done;){var n=t.value,i=yield(0,a.Ct)(4,n),o=JSON.parse(i),s=o.timestamp,l=o.id;if(s>e)for(var u in o.data){var f=o[u],y={},d=yield(0,a.Ct)(3,u);if(d){var m=JSON.parse(d);y.stats=b(m.stats,w(f)),y.timestamp=m.timestamp,y.id=stopID}else y.stats=w(f),y.timestamp=currentTimestamp,y.id=stopID;if(yield(0,a.mL)(3,u,JSON.stringify(y)),g.hasOwnProperty(u)){var p=g[u];h.splice(p,1,y)}else h[u]=h.length,h.push(y);yield(0,a.iQ)(4,l)}}}catch(t){r.e(t)}finally{r.f()}}))).apply(this,arguments)}function A(){return D.apply(this,arguments)}function D(){return(D=l((function*(){var t,e=(new Date).getTime()-252e5,r=0,n=c(yield(0,a.Su)(3));try{for(n.s();!(t=n.n()).done;){var i=t.value,o=yield(0,a.Ct)(3,i);if(o){var s=JSON.parse(o);s.timestamp>e&&(h.push(s),g[i]=r,r+=1)}}}catch(t){n.e(t)}finally{n.f()}}))).apply(this,arguments)}function O(){return k.apply(this,arguments)}function k(){return(k=l((function*(){var t,e=(new Date).getTime()-252e5,r=c(yield(0,a.Su)(3));try{for(r.s();!(t=r.n()).done;){var n=t.value,i=yield(0,a.Ct)(3,n);JSON.parse(i).timestamp<=e&&(yield(0,a.iQ)(3,n))}}catch(t){r.e(t)}finally{r.f()}}))).apply(this,arguments)}var I,J={};if("undefined"!=typeof SharedWorker){var C=new SharedWorker(new URL(r.p+r.u(932),r.b));(I=C.port).start()}else{var N=new Worker(new URL(r.p+r.u(551),r.b));I=N}function T(){return P.apply(this,arguments)}function P(){return(P=l((function*(){var t,e=yield(t=(new Date).getTime()-252e5,h.filter((function(e){return e.timestamp>t}))),r=(0,n.zx)("t");return yield new Promise((function(t,n){J[r]=t,I.onerror=function(t){n(t.message)},I.postMessage([e,r])}))}))).apply(this,arguments)}I.onmessage=function(t){var e=o(t.data,2),r=e[0],n=e[1];J[n]&&(J[n](r),delete J[n])},I.onerror=function(t){console.error(t.message)}},6483:(t,e,r)=>{r.d(e,{$t:()=>x,Io:()=>J,VZ:()=>S});var n=r(8024),a=r(5428),i=r(9566),o=r(5352),s=r(4311);function l(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=u(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){s=!0,i=t},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw i}}}}function c(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=r){var n,a,i,o,s=[],l=!0,c=!1;try{if(i=(r=r.call(t)).next,0===e){if(Object(r)!==r)return;l=!1}else for(;!(l=(n=i.call(r)).done)&&(s.push(n.value),s.length!==e);l=!0);}catch(t){c=!0,a=t}finally{try{if(!l&&null!=r.return&&(o=r.return(),Object(o)!==o))return}finally{if(c)throw a}}return s}}(t,e)||u(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(t,e){if(t){if("string"==typeof t)return f(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(t,e):void 0}}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function y(t,e,r,n,a,i,o){try{var s=t[i](o),l=s.value}catch(t){return void r(t)}s.done?e(l):Promise.resolve(l).then(n,a)}function d(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){y(i,n,a,o,s,"next",t)}function s(t){y(i,n,a,o,s,"throw",t)}o(void 0)}))}}var m="",p=!1,v=[],h={data:{},timestamp:0,id:""},g=0;function w(t){for(var e=new Uint32Array(1440),r=t.length-1;r>=0;r--){var n=t[r],a=0,i=0;n[0]>=0?(a=n[1]+1e3*n[0],i=1):(a=n[1],i=0);var o=new Date(a);e[60*o.getHours()+o.getMinutes()]+=i}return Array.from(e)}function b(t,e){for(var r=new Uint32Array(1440),n=1439;n>=0;n--)r[n]=t[n]+e[n];return Array.from(r)}function S(t){return _.apply(this,arguments)}function _(){return(_=d((function*(t){var e=new Date,r=e.getTime(),c=e.getDay(),u=!1;if(!p){p=!0,m=(0,n.zx)("b"),h={id:m,timestamp:r,data:{}},g=0;var f=yield(0,i.$j)(["stop"]);v=f.map((function(t){return t.id}))}if((0,o.vQ)(e)){var y,d=l(t);try{for(d.s();!(y=d.n()).done;){var S=y.value,_=S.StopID,x="s_".concat(_,"_").concat(c);v.indexOf(_)>-1&&(h.data.hasOwnProperty(x)||(h.data[x]=[]),h.data[x].push([parseInt(S.EstimateTime),r]),(g+=1)>32&&(u=!0))}}catch(t){d.e(t)}finally{d.f()}if((u||g%8==0)&&(yield(0,s.mL)(5,m,JSON.stringify(h))),u){var M,A=l(v);try{for(A.s();!(M=A.n()).done;){var D=M.value,O="s_".concat(D,"_").concat(c),k=h.data[O],I={},J=yield(0,s.Ct)(6,O);if(J){var C=JSON.parse(J),N=w(k),T=b(C.stats,N);I.stats=T;var P=(0,a.DJ)(T);I.min=P[0],I.max=P[1],I.day=c,I.timestamp=C.timestamp,I.id=D}else{var Y=w(k);I.stats=Y;var j=(0,a.DJ)(Y);I.min=j[0],I.max=j[1],I.day=c,I.timestamp=r,I.id=D}yield(0,s.mL)(6,O,JSON.stringify(I)),yield(0,s.iQ)(5,m)}}catch(t){A.e(t)}finally{A.f()}p=!1}}}))).apply(this,arguments)}function x(){return M.apply(this,arguments)}function M(){return(M=d((function*(){var t,e=new Date,r=e.getTime(),n=e.getDay(),i=l(yield(0,s.Su)(5));try{for(i.s();!(t=i.n()).done;){var o=t.value,c=yield(0,s.Ct)(5,o),u=JSON.parse(c),f=u.id;for(var y in u.data){var d=u[y],m={},p=yield(0,s.Ct)(6,y);if(p){var v=JSON.parse(p),h=w(d);m.stats=b(v.stats,h);var g=(0,a.DJ)(h.concat(v.max,v.min));m.min=g[0],m.max=g[1],m.day=v.day,m.timestamp=v.timestamp,m.id=stopID}else{var S=w(d);m.stats=S;var _=(0,a.DJ)(S);m.min=_[0],m.max=_[1],m.day=n,m.timestamp=r,m.id=stopID}yield(0,s.mL)(6,y,JSON.stringify(m)),yield(0,s.iQ)(5,f)}}}catch(t){i.e(t)}finally{i.f()}}))).apply(this,arguments)}function A(){return(A=d((function*(){var t,e=[],r=l(yield(0,s.Su)(6));try{for(r.s();!(t=r.n()).done;){var n=t.value,a=yield(0,s.Ct)(6,n);if(a){var i=JSON.parse(a);e.push(i)}}}catch(t){r.e(t)}finally{r.f()}return e}))).apply(this,arguments)}var D,O={};if("undefined"!=typeof SharedWorker){var k=new SharedWorker(new URL(r.p+r.u(592),r.b));(D=k.port).start()}else{var I=new Worker(new URL(r.p+r.u(211),r.b));D=I}function J(t,e){return C.apply(this,arguments)}function C(){return C=d((function*(t,e){var r=(0,n.zx)("t"),a=yield(0,o.ty)(),i=yield function(){return A.apply(this,arguments)}();return yield new Promise((function(n,o){O[r]=n,D.onerror=function(t){o(t.message)},D.postMessage([a,i,t,e,r])}))})),C.apply(this,arguments)}D.onmessage=function(t){var e=c(t.data,2),r=e[0],n=e[1];O[n]&&(O[n](r),delete O[n])},D.onerror=function(t){console.error(t.message)}},7910:(t,e,r)=>{r.d(e,{HJ:()=>v,Ti:()=>_,Uc:()=>b,Vi:()=>m,rN:()=>g});var n=r(7183),a=r(8141),i=r(5579),o=r(4311);function s(t){return function(t){if(Array.isArray(t))return u(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||c(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){var r="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!r){if(Array.isArray(t)||(r=c(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,a=function(){};return{s:a,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,o=!0,s=!1;return{s:function(){r=r.call(t)},n:function(){var t=r.next();return o=t.done,t},e:function(t){s=!0,i=t},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw i}}}}function c(t,e){if(t){if("string"==typeof t)return u(t,e);var r={}.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(t,e):void 0}}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=Array(e);r<e;r++)n[r]=t[r];return n}function f(t,e,r,n,a,i,o){try{var s=t[i](o),l=s.value}catch(t){return void r(t)}s.done?e(l):Promise.resolve(l).then(n,a)}function y(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function o(t){f(i,n,a,o,s,"next",t)}function s(t){f(i,n,a,o,s,"throw",t)}o(void 0)}))}}var d={};function m(t,e,r){return p.apply(this,arguments)}function p(){return(p=y((function*(t,e,r){d.hasOwnProperty(t)||(d[t]=e),d[t].end_time=e.end_time,d[t].content_length=d[t].content_length+e.content_length,r||d.hasOwnProperty(t)&&(yield(0,o.mL)(2,t,JSON.stringify(d[t])),delete d[t])}))).apply(this,arguments)}function v(){return h.apply(this,arguments)}function h(){return(h=y((function*(){var t,e=l(yield(0,o.Su)(2));try{for(e.s();!(t=e.n()).done;){var r=t.value,n=yield(0,o.Ct)(2,r),a=JSON.parse(n);(new Date).getTime()-a.timeStamp>2592e6&&(yield(0,o.iQ)(2,r))}}catch(t){e.e(t)}finally{e.f()}}))).apply(this,arguments)}function g(){return w.apply(this,arguments)}function w(){return(w=y((function*(){var t,e=[],r=[],n=l(yield(0,o.Su)(2));try{for(n.s();!(t=n.n()).done;){var a=t.value,i=yield(0,o.Ct)(2,a),s=JSON.parse(i);e.push(s.start_time),r.push(s.end_time)}}catch(t){n.e(t)}finally{n.f()}return{start:new Date(Math.min.apply(Math,e)),end:new Date(Math.max.apply(Math,r))}}))).apply(this,arguments)}function b(){return S.apply(this,arguments)}function S(){return(S=y((function*(){var t,e=0,r=l(yield(0,o.Su)(2));try{for(r.s();!(t=r.n()).done;){var a=t.value,i=yield(0,o.Ct)(2,a);e+=JSON.parse(i).content_length}}catch(t){r.e(t)}finally{r.f()}return(0,n.tH)(e)}))).apply(this,arguments)}function _(t,e,r,n){return x.apply(this,arguments)}function x(){return(x=y((function*(t,e,r,n){var c=yield(0,o.Su)(2),u="YYYY_MM_DD_hh_mm_ss";switch(t){case"minutely":u="YYYY_MM_DD_hh_mm";break;case"hourly":u="YYYY_MM_DD_hh";break;case"daily":u="YYYY_MM_DD"}var f,y={},d=l(c);try{for(d.s();!(f=d.n()).done;){var m=f.value,p=yield(0,o.Ct)(2,m),v=JSON.parse(p),h=new Date(v.start_time),g="d_".concat((0,i.$T)(h,u));y.hasOwnProperty(g)||(y[g]={start_time:v.start_time,end_time:v.end_time,content_length:0}),y[g].content_length=y[g].content_length+v.content_length,v.start_time<y[g].start_time&&(y[g].start_time=v.start_time),v.end_time>y[g].end_time&&(y[g].end_time=v.end_time)}}catch(t){d.e(t)}finally{d.f()}var w=[];for(var b in y){var S=y[b];w.push(S)}if(w.length>3){w.sort((function(t,e){return t.start_time-e.start_time}));var _,x=w.map((function(t){return t.start_time})),M=Math.min.apply(Math,s(x)),A=Math.max.apply(Math,s(x)),D=w.map((function(t){return t.content_length})),O=Math.min.apply(Math,s(D)),k=Math.max.apply(Math,s(D)),I=[],J=l(w);try{for(J.s();!(_=J.n()).done;){var C=_.value,N={x:Math.round(n+(C.start_time-M)/(A-M)*e),y:Math.round(n+(1-(C.content_length-O)/(k-O))*r)};I.push(N)}}catch(t){J.e(t)}finally{J.f()}var T='<line x1="'.concat(n,'" y1="').concat(r+n,'" x2="').concat(n+e,'" y2="').concat(r+n,'" stroke="var(--a)" stroke-width="1" />'),P='<line x1="'.concat(n,'" y1="').concat(n,'" x2="').concat(n,'" y2="').concat(r+n,'" stroke="var(--a)" stroke-width="1" />'),Y='<text x="'.concat(n+e/2,'" y="').concat(n+r+n,'" text-anchor="middle" font-size="12" fill="var(--a)">時間</text>'),j='<text x="'.concat(n/2,'" y="').concat(n+r/2,'" text-anchor="middle" font-size="12" fill="var(--a)" transform="rotate(-90, ').concat(.7*n,", ").concat(n+r/2,')">傳輸量</text>'),z=(0,a.z)(I,1.1),L=(0,a.p)(z,1),U="M".concat(n,",").concat(r+n).concat(L,"L").concat(n+e,",").concat(r+n,"L").concat(n,",").concat(r+n),E='<path d="'.concat(L,'" fill="none" stroke="var(--b)" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round" opacity="1"></path>'),W='<path d="'.concat(U,'" stroke="none" stroke-width="0" fill="url(#grad1)"></path>');return'<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(e+2*n,'px" height="').concat(r+2*n,'px" viewBox="0 0 ').concat(e+2*n," ").concat(r+2*n,'"><defs>').concat('<linearGradient id="grad1" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" style="stop-color:rgba(var(--c), var(--d), var(--e), 0.3);" /><stop offset="73%" style="stop-color:rgba(var(--c), var(--d), var(--e), 0.09);" /><stop offset="100%" style="stop-color:rgba(var(--c), var(--d), var(--e), 0);" /></linearGradient>',"</defs>").concat(W).concat(E).concat(T).concat(P).concat(Y).concat(j,"</svg>")}return!1}))).apply(this,arguments)}}}]);
//# sourceMappingURL=979ea537387bda710669.js.map
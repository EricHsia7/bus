"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[3687],{2129:(t,r,n)=>{function e(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,r){if(t){if("string"==typeof t)return o(t,r);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var e=0,a=function(){};return{s:a,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,l=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){l=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(l)throw i}}}}function o(t,r){(null==r||r>t.length)&&(r=t.length);for(var n=0,e=Array(r);n<r;n++)e[n]=t[n];return e}function a(t){for(var r=0;r<t.length;r++)for(var n=r+1;n<t.length;n++)if(t[r]===t[n])return!1;return!0}function i(t,r){var n=[];if(t.length<=r.length){var o,a=e(t);try{for(a.s();!(o=a.n()).done;){var i=o.value;r.indexOf(i)>-1&&n.push(i)}}catch(t){a.e(t)}finally{a.f()}}else{var u,l=e(r);try{for(l.s();!(u=l.n()).done;){var c=u.value;t.indexOf(c)>-1&&n.push(c)}}catch(t){l.e(t)}finally{l.f()}}return n}n.d(r,{W8:()=>a,_N:()=>i})},2945:(t,r,n)=>{n.d(r,{M:()=>l,V:()=>u});var e=n(7183),o=n(5428);function a(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,r){if(t){if("string"==typeof t)return i(t,r);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var e=0,o=function(){};return{s:o,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,u=!0,l=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){l=!0,a=t},f:function(){try{u||null==n.return||n.return()}finally{if(l)throw a}}}}function i(t,r){(null==r||r>t.length)&&(r=t.length);for(var n=0,e=Array(r);n<r;n++)e[n]=t[n];return e}function u(t){for(var r=[],n=0;n<t;n++)r.push("地點".concat((0,e.D5)(n+1)));return r}function l(t){var r,n=[],e=[{vector:[0,0],label:"未知"},{vector:[0,1],label:"北"},{vector:[1,0],label:"東"},{vector:[0,-1],label:"南"},{vector:[-1,0],label:"西"},{vector:[Math.sqrt(2)/2,Math.sqrt(2)/2],label:"東北"},{vector:[Math.sqrt(2)/2,-Math.sqrt(2)/2],label:"東南"},{vector:[-Math.sqrt(2)/2,-Math.sqrt(2)/2],label:"西南"},{vector:[-Math.sqrt(2)/2,Math.sqrt(2)/2],label:"西北"}],i=a(t);try{for(i.s();!(r=i.n()).done;){var u,l=r.value,c=0,f=0,h=a(l);try{for(h.s();!(u=h.n()).done;){var s=u.value;c+=s[0],f+=s[1]}}catch(t){h.e(t)}finally{h.f()}var v,y=(0,o.Ck)([c,f]),d=[],b=a(e);try{for(b.s();!(v=b.n()).done;){var m=v.value,p=m.vector[0]*y[0]+m.vector[1]*y[1];d.push({label:m.label,dotProduct:p})}}catch(t){b.e(t)}finally{b.f()}var g=(d=d.sort((function(t,r){return r.dotProduct-t.dotProduct})))[0];n.push(g.label)}}catch(t){i.e(t)}finally{i.f()}return n}},4256:(t,r,n)=>{n.d(r,{_q:()=>f,pD:()=>c});var e=n(2945),o=n(2129);function a(t){return function(t){if(Array.isArray(t))return l(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||u(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=u(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var e=0,o=function(){};return{s:o,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,i=!0,l=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return i=t.done,t},e:function(t){l=!0,a=t},f:function(){try{i||null==n.return||n.return()}finally{if(l)throw a}}}}function u(t,r){if(t){if("string"==typeof t)return l(t,r);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,r):void 0}}function l(t,r){(null==r||r>t.length)&&(r=t.length);for(var n=0,e=Array(r);n<r;n++)e[n]=t[n];return e}function c(t){return"".concat(t.city.join("")).concat(t.district.join("")).concat(t.road.join("、")).concat(t.road_section.sort((function(t,r){return t-r})).length>0?t.road_section.join("、")+"段":"").concat(t.alley.length>0?t.alley.sort((function(t,r){return t-r})).join("、")+"巷":"").concat(t.alley_branch.length>0?t.alley_branch.sort((function(t,r){return t-r})).join("、")+"弄":"").concat(t.doorplate.length>0?t.doorplate.sort((function(t,r){return t-r})).join("、")+"號":"").concat(t.floornumber.length>0?t.floornumber.join("、")+"樓":"").concat(t.direction.length>0?"（朝"+t.direction.join("、")+"）":"")}function f(t){var r,n=[],u={},l=i(t);try{for(l.s();!(r=l.n()).done;){var c=r.value;for(var f in c)u.hasOwnProperty(f)||(u[f]=0),c[f].length>0&&(u[f]=u[f]+1)}}catch(t){l.e(t)}finally{l.f()}var h=Object.entries(u).map((function(t){return{key:t[0],value:t[1]}})).filter((function(r){return r.value===t.length})).sort((function(t,r){return t.value-r.value}));if(h.length>0){var s,v=i(h);try{for(v.s();!(s=v.n()).done;){var y,d=s.value,b=[],m=i(t);try{for(m.s();!(y=m.n()).done;){var p=y.value;b.push(p[d.key].join(""))}}catch(t){m.e(t)}finally{m.f()}(0,o.W8)(b)&&n.push({components:b,len:Math.max.apply(Math,a(b.map((function(t){return t.length}))))})}}catch(t){v.e(t)}finally{v.f()}}if(n.length>0)return(n=n.sort((function(t,r){return t.len-r.len})))[0].components;var g=t.length;return(0,e.V)(g)}},5428:(t,r,n)=>{function e(t,r){var n="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!n){if(Array.isArray(t)||(n=function(t,r){if(t){if("string"==typeof t)return o(t,r);var n={}.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(t,r):void 0}}(t))||r&&t&&"number"==typeof t.length){n&&(t=n);var e=0,a=function(){};return{s:a,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,u=!0,l=!1;return{s:function(){n=n.call(t)},n:function(){var t=n.next();return u=t.done,t},e:function(t){l=!0,i=t},f:function(){try{u||null==n.return||n.return()}finally{if(l)throw i}}}}function o(t,r){(null==r||r>t.length)&&(r=t.length);for(var n=0,e=Array(r);n<r;n++)e[n]=t[n];return e}function a(t,r,n,e,o,a){var i=n+a,u=(n*t+a*e)/i,l=(n*(Math.pow(r,2)+Math.pow(t,2))+a*(Math.pow(o,2)+Math.pow(e,2)))/i-Math.pow(u,2);return Math.sqrt(l)}function i(t,r,n,e,o,i,u,l,c,f,h,s){var v=o+h;return(o*(n*e*i+t*r)+h*(c*f*s+u*l)-v*((o*t+h*u)/v)*((o*r+h*l)/v))/(v*a(t,n,o,u,c,h)*a(r,e,o,l,f,h))}function u(t){var r=Math.hypot(t),n=[];if(r>0){var o,a=1/r,i=e(t);try{for(i.s();!(o=i.n()).done;){var u=o.value;n.push(u*a)}}catch(t){i.e(t)}finally{i.f()}return n}return t}function l(t){var r=t.length;if(0===r)return[0,0];for(var n=1/0,e=-1/0,o=r-1;o>=0;o--){var a=t[o];a>e&&(e=a),a<n&&(n=a)}return[n,e]}n.d(r,{Ck:()=>u,DJ:()=>l,Hi:()=>i,VY:()=>a})},7183:(t,r,n)=>{function e(t,r,n,e){var o=n*Math.PI/180-t*Math.PI/180,a=e*Math.PI/180-r*Math.PI/180,i=Math.sin(o/2)*Math.sin(o/2)+Math.cos(t*Math.PI/180)*Math.cos(n*Math.PI/180)*Math.sin(a/2)*Math.sin(a/2);return 1e3*(6378.137*(2*Math.atan2(Math.sqrt(i),Math.sqrt(1-i))))}function o(t){for(var r=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],n=0;t>=1024&&n<r.length-1;)t/=1024,n++;return"".concat(t.toFixed(2)," ").concat(r[n])}function a(t){for(var r="";t>0;){var n=(t-1)%26;r=String.fromCharCode(n+65)+r,t=Math.floor((t-1)/26)}return r}n.d(r,{D5:()=>a,aV:()=>e,tH:()=>o})},7968:(t,r,n)=>{function e(t,r,n,o){var a=(e.canvas||(e.canvas=document.createElement("canvas"))).getContext("2d"),i="".concat(r," ").concat(n," ").concat(o);return a.font=i,a.measureText(t).width}function o(t,r,n,e,o,a,i){a="number"==typeof a?{tl:a,tr:a,br:a,bl:a}:{tl:a.tl||0,tr:a.tr||0,br:a.br||0,bl:a.bl||0},t.beginPath(),t.moveTo(r+a.tl,n),t.lineTo(r+e-a.tr,n),t.quadraticCurveTo(r+e,n,r+e,n+a.tr),t.lineTo(r+e,n+o-a.br),t.quadraticCurveTo(r+e,n+o,r+e-a.br,n+o),t.lineTo(r+a.bl,n+o),t.quadraticCurveTo(r,n+o,r,n+o-a.bl),t.lineTo(r,n+a.tl),t.quadraticCurveTo(r,n,r+a.tl,n),t.closePath(),t.fillStyle=i,t.fill()}n.d(r,{q_:()=>e,wg:()=>o})},8024:(t,r,n)=>{n.d(r,{FU:()=>u,Gz:()=>s,MR:()=>l,hw:()=>a,p1:()=>f,sc:()=>o,t9:()=>c,xZ:()=>h,zx:()=>i});var e=n(3503),o=n(9083);function a(t,r){function n(t){return JSON.stringify({e:t})}var o=n(t),a=n(r),i=o.length,u=a.length;if(i===u){if(i>32||u>32){for(var l=e(o),c=e(a),f=!0,h=0;h<8;h++){if(l.charAt(h)!==c.charAt(h)){f=!1;break}}return f}return o===a}return!1}function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",r=Math.random();return t.concat(r.toString(36).substring(2))}function u(t){return(((new Date).getTime()/t).toFixed(0)*t).toString(36)}function l(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"application/json",n=arguments.length>2?arguments[2]:void 0,e=new Blob([t],{type:r}),o=new File([e],n,{type:r});if(navigator.canShare&&navigator.canShare({files:[o]}))navigator.share({files:[o]}).catch((function(t){}));else{var a=URL.createObjectURL(e),i=document.createElement("a");i.href=a,i.download=n,document.body.appendChild(i),i.click(),i.remove(),setTimeout((function(){URL.revokeObjectURL(a)}),1e4)}}function c(){return window.matchMedia("(display-mode: standalone)").matches}function f(){return!(!("ontouchstart"in window)&&!navigator.maxTouchPoints)}function h(t){if("boolean"==typeof t)return t?"true":"false"}function s(t){try{return new URL(t),!0}catch(t){return!1}}}}]);
//# sourceMappingURL=0f2e60c56f243065ddec.js.map
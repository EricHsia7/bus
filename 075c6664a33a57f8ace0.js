!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("bus",[],n):"object"==typeof exports?exports.bus=n():t.bus=n()}(self,(()=>(()=>{"use strict";var t={};function n(t,n){var e="undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(!e){if(Array.isArray(t)||(e=r(t))||n&&t&&"number"==typeof t.length){e&&(t=e);var o=0,a=function(){};return{s:a,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var c,i=!0,s=!1;return{s:function(){e=e.call(t)},n:function(){var t=e.next();return i=t.done,t},e:function(t){s=!0,c=t},f:function(){try{i||null==e.return||e.return()}finally{if(s)throw c}}}}function e(t,n){return function(t){if(Array.isArray(t))return t}(t)||function(t,n){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var r,o,a,c,i=[],s=!0,l=!1;try{if(a=(e=e.call(t)).next,0===n){if(Object(e)!==e)return;s=!1}else for(;!(s=(r=a.call(e)).done)&&(i.push(r.value),i.length!==n);s=!0);}catch(t){l=!0,o=t}finally{try{if(!s&&null!=e.return&&(c=e.return(),Object(c)!==c))return}finally{if(l)throw o}}return i}}(t,n)||r(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(t,n){if(t){if("string"==typeof t)return o(t,n);var e={}.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?o(t,n):void 0}}function o(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=Array(n);e<n;e++)r[e]=t[e];return r}var a=[],c=!1;if("onconnect"in self)self.onconnect=function(t){var n=t.ports[0];n.onmessage=function(t){var r=e(t.data,5),o=r[0],c=r[1],i=r[2],s=r[3],l=r[4];a.push({personalSchedules:o,busArrivalTimeDataGroups:c,chartWidth:i,chartHeight:s,taskID:l,port:n}),p()}};else{var i=self;self.onmessage=function(t){var n=e(t.data,5),r=n[0],o=n[1],c=n[2],s=n[3],l=n[4];a.push({personalSchedules:r,busArrivalTimeDataGroups:o,chartWidth:c,chartHeight:s,taskID:l,port:i}),p()}}var s,l,f=400,u=10,d='"Noto Sans TC", sans-serif',h=!1;function p(){if(!c&&0!==a.length){c=!0;var t,e=a.shift(),r=e.personalSchedules,o=e.busArrivalTimeDataGroups,i=e.chartWidth,s=e.chartHeight,v=e.taskID,y=e.port,m={},b=n(r);try{for(b.s();!(t=b.n()).done;){var g,w=t.value,x=60*w.period.start.hours+w.period.start.minutes,S=60*w.period.end.hours+w.period.end.minutes,A=i/(S-x),j=n(o);try{for(j.s();!(g=j.n()).done;){var I=g.value;if(!(w.days.indexOf(I.day)<0)){var k=I.max,D=I.stats.slice(x,S),O=D.length,T="",M="",C=0;C=O/30<=3?10:30;for(var L=Math.floor(O/C),B=i/L,G=L-1;G>=0;G--){var H=.175+G*B;M+=" M".concat(H,",0"),M+=" L".concat(H,",").concat(s);var W=x+G*C,E=W%60,z="".concat(((W-E)/60).toString().padStart(2,"0"),":").concat(E.toString().padStart(2,"0")),N=30,P=12;if(h){var U=l.measureText(z);N=U.width,P=U.actualBoundingBoxDescent}var Z=(s-P)/2;T+='<text x="'.concat(H,'" y="').concat(Z,'" transform="rotate(-90 ').concat((H+H+N)/2," ").concat((Z+Z+P)/2,')" dominant-baseline="middle" font-weight="').concat(f,'" font-size="').concat(u,'" font-family="').concat(d,'" component="label">').concat(z,"</text>")}var $='<path d="'.concat(M,'" fill="none" stroke-width="0.35" component="vertical-gridline"/>'),_="M0,".concat(s," L").concat(i,",").concat(s-.175),q='<path d="'.concat(_,'" fill="none" stroke-width="0.35" component="bottom-line"/>'),F="";F+="M".concat(i,",").concat(s);for(var J=O-1;J>=0;J--){var K=(J+1)/O*i,Q=(1-D[J]/k)*s;F+=" L".concat(K,",").concat(Q),F+=" L".concat(K-A,",").concat(Q),F+=" L".concat(K-A,",").concat(s)}var R='<path d="'.concat(F+=" Z",'" stroke="none" stroke-width="0" component="bars"/>'),V='<svg width="'.concat(i,'" height="').concat(s,'" viewBox="0 0 ').concat(i," ").concat(s,'" xmlns="http://www.w3.org/2000/svg">').concat($).concat(T).concat(q).concat(R,"</svg>"),X="s_".concat(I.id);m.hasOwnProperty(X)||(m[X]=[]),m[X].push({personalSchedule:w,chart:V,day:I.day})}}}catch(t){j.e(t)}finally{j.f()}}}catch(t){b.e(t)}finally{b.f()}y.postMessage([m,v]),c=!1,p()}}return"OffscreenCanvas"in self&&(s=new OffscreenCanvas,(l=s.getContext("2d")).font="".concat(f," ").concat(u,"px ").concat(d),l.textBaseline="top",h=!0),t=t.default})()));
//# sourceMappingURL=075c6664a33a57f8ace0.js.map
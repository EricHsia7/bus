"use strict";(self.webpackChunkbus=self.webpackChunkbus||[]).push([[463],{187:(e,t,n)=>{n.d(t,{A:()=>o});var s=n(1354),r=n.n(s),a=n(6314),i=n.n(a)()(r());i.push([e.id,"// extracted by mini-css-extract-plugin\nexport {};","",{version:3,sources:["webpack://./src/interface/home/folders/item.css"],names:[],mappings:"AAAA;QACS,CAAA",sourcesContent:["// extracted by mini-css-extract-plugin\nexport {};"],sourceRoot:""}]);const o=i},540:(e,t,n)=>{n.d(t,{F:()=>R,a:()=>Q});var s=n(5767),r=n(9566),a=n(3459),i=n(8024),o=n(3648),c=n(4537),d=n(904),u=n(9119);function l(e,t,n,s,r,a,i){try{var o=e[a](i),c=o.value}catch(e){return void n(e)}o.done?t(c):Promise.resolve(c).then(s,r)}function p(e){return function(){var t=this,n=arguments;return new Promise((function(s,r){var a=e.apply(t,n);function i(e){l(a,s,r,i,o,"next",e)}function o(e){l(a,s,r,i,o,"throw",e)}i(void 0)}))}}var f=(0,o.bv)(".ma"),m=(0,o.aI)(f,".ub"),v=(0,o.aI)(f,".na"),b=(0,o.aI)(v,".pa"),A=(0,o.aI)(m,".dc .fc"),h={},y=!1,g=!0,x=15e3,w=5e3,k=15e3,I=!0,T=0,C=0,P="",L=!1,M=!1,S=!1;function _(){var e=document.createElement("div");return e.classList.add("_c"),e.setAttribute("type","stop"),e.innerHTML=`<div class="ad"></div><div class="bd"></div><div class="dd"></div><div class="ed"><div class="id"><div class="jd" code="0"></div><div class="kd" code="0"></div></div><div class="fd">${(0,c.Z)("keyboard_arrow_right")}</div><div class="gd"></div></div>`,{element:e,id:""}}function j(e){var t=e;if(L){var n=t.detail.progress-1;A.style.setProperty("--sb",n.toString())}"end"===t.detail.stage&&document.removeEventListener(t.detail.target,j)}function R(){for(var e=(0,a.Js)("playing_animation"),t=(0,d.gO)("window"),n=(t.width,t.height),s=Math.floor(n/50/3)+2,r=[],i=0;i<3;i++){for(var o={name:"",icon:"",id:"",timestamp:0,content:[],contentLength:s},c=0;c<s;c++){o.content.push({type:"stop",id:0,timestamp:0,name:"",status:{code:8,text:"",time:-6},direction:0,route:{name:"",endPoints:{departure:"",destination:""},id:0,pathAttributeId:[]}})}r.push(o)}$({folders:r,dataUpdateTime:0},!0,e)}function $(e,t,n){function s(e,s,r){function a(e,t){e.setAttribute("type",t.type)}function d(e,t){var n=(0,o.aI)(e,".ad"),s="";switch(t.type){case"stop":s="location_on";break;case"route":s="route";break;case"bus":s="directions_bus";break;case"empty":s="lightbulb";break;default:s=""}n.innerHTML=(0,c.Z)(s)}function u(e,t,n){if("stop"===t.type){var s=e.getBoundingClientRect(),r=s.top,a=s.left,i=s.bottom,c=s.right,d=window.innerWidth,u=window.innerHeight,l=(0,o.aI)(e,".ed .id"),p=(0,o.aI)(l,".jd"),f=(0,o.aI)(l,".kd");p.setAttribute("code",t.status.code.toString()),p.innerText=t.status.text,n&&i>0&&r<u&&c>0&&a<d?(f.addEventListener("animationend",(function(){f.setAttribute("code",t.status.code.toString()),f.innerText=t.status.text,f.classList.remove("od")}),{once:!0}),f.classList.add("od")):(f.setAttribute("code",t.status.code.toString()),f.innerText=t.status.text)}}function l(e,t){var n="";switch(t.type){case"stop":case"route":n=t.name;break;case"bus":n=t.busID;break;case"empty":n="沒有內容";break;default:n="null"}(0,o.aI)(e,".dd").innerText=n}function p(e,t){var n="";switch(t.type){case"stop":n=`${t.route?t.route.name:""} - 往${t.route?[t.route.endPoints.destination,t.route.endPoints.departure,""][t.direction?t.direction:0]:""}`;break;case"route":n=`${t.endPoints.departure} ↔ ${t.endPoints.destination}`;break;case"bus":break;case"empty":n="提示";break;default:n="null"}(0,o.aI)(e,".bd").innerText=n}function f(e,t){var n=(0,o.aI)(e,".ed .fd"),s="";switch(t.type){case"stop":s=`bus.route.openRoute(${t.route.id}, [${t.route.pathAttributeId.join(",")}])`;break;case"route":s=`bus.route.openRoute(${t.id}, [${t.pathAttributeId.join(",")}])`}n.setAttribute("onclick",s)}function m(e,t){e.setAttribute("animation",(0,i.xZ)(t))}function v(e,t){e.setAttribute("skeleton-screen",(0,i.xZ)(t))}if(null===r)a(e,s),d(e,s),u(e,s,n),l(e,s),p(e,s),f(e,s),m(e,n),v(e,t);else if(s.type!==r.type)a(e,s),d(e,s),u(e,s,n),l(e,s),p(e,s),f(e,s),m(e,n),v(e,t);else{switch(s.type){case"stop":(0,i.hw)(r.route,s.route)||(p(e,s),f(e,s)),(0,i.hw)(r.name,s.name)||l(e,s),s.status.code===r.status.code&&(0,i.hw)(r.status.text,s.status.text)||u(e,s,n);break;case"route":(0,i.hw)(r.id,s.id)||f(e,s),(0,i.hw)(r.endPoints,s.endPoints)||p(e,s),(0,i.hw)(r.name,s.name)||l(e,s);break;case"bus":(0,i.hw)(r.currentRoute,s.currentRoute)||p(e,s),(0,i.hw)(r.busID,s.busID)||l(e,s);break;case"empty":s.type!==r.type&&(p(e,s),l(e,s))}t!==y&&v(e,t),n!==g&&m(e,n)}}function r(e,s,r){function a(e,t){var n=(0,o.aI)(e,".nc");(0,o.aI)(n,".qc").innerText=t.name}function d(e,t){var n=(0,o.aI)(e,".nc");(0,o.aI)(n,".oc").innerHTML=(0,c.Z)(t.icon)}function u(e,t){e.setAttribute("animation",(0,i.xZ)(t))}function l(e,t){e.setAttribute("skeleton-screen",(0,i.xZ)(t))}null===r?(a(e,s),d(e,s),u(e,n),l(e,t)):(s.name!==r.name&&a(e,s),s.icon!==r.icon&&d(e,s),n!==g&&u(e,n),t!==y&&l(e,t))}var a,d=e.folders,u=d.length,l=(0,o.jg)(b,".lc").length;if(u!==l){var p=l-u;if(p<0){for(var f=new DocumentFragment,m=0;m<Math.abs(p);m++){var v=(a=void 0,(a=document.createElement("div")).classList.add("lc"),a.innerHTML='<div class="nc"><div class="oc"></div><div class="qc"></div></div><div class="rc"></div>',{element:a,id:""});f.appendChild(v.element)}b.append(f)}else for(var A=(0,o.jg)(b,".lc"),x=0;x<Math.abs(p);x++){A[l-1-x].remove()}}for(var w=(0,o.jg)(b,".lc"),k=0;k<u;k++){var I=d[k].content.length,T=w[k],C=(0,o.aI)(T,".rc"),P=(0,o.jg)(C,"._c").length;if(I!==P){var L=P-I;if(L<0)for(var M=0;M<Math.abs(L);M++){var S=_();C.appendChild(S.element)}else for(var j=(0,o.jg)(C,"._c"),R=0;R<Math.abs(L);R++){j[P-1-R].remove()}}}for(var $=(0,o.jg)(b,".lc"),E=0;E<u;E++){var Z=d[E],D=Z.content,H=D.length,Q=$[E],J=(0,o.aI)(Q,".rc");if(h.hasOwnProperty("folders"))if(h.folders[E])r(Q,Z,h.folders[E]);else r(Q,Z,null);else r(Q,Z,null);for(var O=(0,o.jg)(J,"._c"),q=0;q<H;q++){var z=O[q],F=D[q];if(h.hasOwnProperty("folders"))if(h.folders[E])if(h.folders[E].content[q])s(z,F,h.folders[E].content[q]);else s(z,F,null);else s(z,F,null);else s(z,F,null)}}h=e,g=n,y=t}function E(){return Z.apply(this,arguments)}function Z(){return(Z=p((function*(){var e=(0,a.Js)("playing_animation"),t=(0,a.Js)("refresh_interval");I=t.dynamic,x=t.baseInterval,L=!0,P=(0,i.zx)("r"),A.setAttribute("refreshing","true"),A.classList.remove("kc"),document.addEventListener(P,j);var n=yield(0,r.R_)(P);$(n,!1,e);var o=0;I&&(o=yield(0,s.wz)()),T=(new Date).getTime(),C=I?Math.max(T+w,n.dataUpdateTime+x/o):T+x,k=Math.max(w,C-T),L=!1,A.setAttribute("refreshing","false"),A.style.setProperty("--tb",`${k}ms`),A.classList.add("kc")}))).apply(this,arguments)}function D(){return H.apply(this,arguments)}function H(){return(H=p((function*(){E().then((function(){M?setTimeout((function(){D()}),Math.max(w,C-(new Date).getTime())):S=!1})).catch((function(e){console.error(e),M?((0,u.a)("資料夾網路連線中斷，將在10秒後重試。","error"),setTimeout((function(){D()}),1e4)):S=!1}))}))).apply(this,arguments)}function Q(){R(),M||(M=!0,S?E():(S=!0,D()))}},3575:(e,t,n)=>{n.d(t,{A:()=>o});var s=n(1354),r=n.n(s),a=n(6314),i=n.n(a)()(r());i.push([e.id,"// extracted by mini-css-extract-plugin\nexport {};","",{version:3,sources:["webpack://./src/interface/home/folders/folders.css"],names:[],mappings:"AAAA;QACS,CAAA",sourcesContent:["// extracted by mini-css-extract-plugin\nexport {};"],sourceRoot:""}]);const o=i},4242:(e,t,n)=>{var s=n(5072),r=n.n(s),a=n(7825),i=n.n(a),o=n(7659),c=n.n(o),d=n(5056),u=n.n(d),l=n(8159),p=n.n(l),f=n(1113),m=n.n(f),v=n(187),b={};b.styleTagTransform=m(),b.setAttributes=u(),b.insert=c().bind(null,"head"),b.domAPI=i(),b.insertStyleElement=p();r()(v.A,b),v.A&&v.A.locals&&v.A.locals},4480:(e,t,n)=>{n.d(t,{A:()=>o});var s=n(1354),r=n.n(s),a=n(6314),i=n.n(a)()(r());i.push([e.id,"// extracted by mini-css-extract-plugin\nexport {};","",{version:3,sources:["webpack://./src/interface/home/field.css"],names:[],mappings:"AAAA;QACS,CAAA",sourcesContent:["// extracted by mini-css-extract-plugin\nexport {};"],sourceRoot:""}]);const o=i},5415:(e,t,n)=>{var s=n(5072),r=n.n(s),a=n(7825),i=n.n(a),o=n(7659),c=n.n(o),d=n(5056),u=n.n(d),l=n(8159),p=n.n(l),f=n(1113),m=n.n(f),v=n(8530),b={};b.styleTagTransform=m(),b.setAttributes=u(),b.insert=c().bind(null,"head"),b.domAPI=i(),b.insertStyleElement=p();r()(v.A,b),v.A&&v.A.locals&&v.A.locals},7671:(e,t,n)=>{var s=n(5072),r=n.n(s),a=n(7825),i=n.n(a),o=n(7659),c=n.n(o),d=n(5056),u=n.n(d),l=n(8159),p=n.n(l),f=n(1113),m=n.n(f),v=n(4480),b={};b.styleTagTransform=m(),b.setAttributes=u(),b.insert=c().bind(null,"head"),b.domAPI=i(),b.insertStyleElement=p();r()(v.A,b),v.A&&v.A.locals&&v.A.locals},8530:(e,t,n)=>{n.d(t,{A:()=>o});var s=n(1354),r=n.n(s),a=n(6314),i=n.n(a)()(r());i.push([e.id,"// extracted by mini-css-extract-plugin\nexport {};","",{version:3,sources:["webpack://./src/interface/home/body.css"],names:[],mappings:"AAAA;QACS,CAAA",sourcesContent:["// extracted by mini-css-extract-plugin\nexport {};"],sourceRoot:""}]);const o=i},8860:(e,t,n)=>{var s=n(5072),r=n.n(s),a=n(7825),i=n.n(a),o=n(7659),c=n.n(o),d=n(5056),u=n.n(d),l=n(8159),p=n.n(l),f=n(1113),m=n.n(f),v=n(3575),b={};b.styleTagTransform=m(),b.setAttributes=u(),b.insert=c().bind(null,"head"),b.domAPI=i(),b.insertStyleElement=p();r()(v.A,b),v.A&&v.A.locals&&v.A.locals}}]);
//# sourceMappingURL=1e1b9d21f924b78d4595.js.map
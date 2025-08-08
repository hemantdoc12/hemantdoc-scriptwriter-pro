import{r as c,a as we,R as D}from"./vendor-8a332d8f.js";import{_ as je}from"./utils-34ded122.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(s){if(s.ep)return;s.ep=!0;const n=r(s);fetch(s.href,n)}})();var ce={exports:{}},V={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ee=c,Ce=Symbol.for("react.element"),Se=Symbol.for("react.fragment"),Ne=Object.prototype.hasOwnProperty,ke=Ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Pe={key:!0,ref:!0,__self:!0,__source:!0};function le(e,t,r){var o,s={},n=null,a=null;r!==void 0&&(n=""+r),t.key!==void 0&&(n=""+t.key),t.ref!==void 0&&(a=t.ref);for(o in t)Ne.call(t,o)&&!Pe.hasOwnProperty(o)&&(s[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps,t)s[o]===void 0&&(s[o]=t[o]);return{$$typeof:Ce,type:e,key:n,ref:a,props:s,_owner:ke.current}}V.Fragment=Se;V.jsx=le;V.jsxs=le;ce.exports=V;var d=ce.exports,Q={},ne=we;Q.createRoot=ne.createRoot,Q.hydrateRoot=ne.hydrateRoot;const oe=e=>{let t;const r=new Set,o=(i,u)=>{const g=typeof i=="function"?i(t):i;if(!Object.is(g,t)){const p=t;t=u??(typeof g!="object"||g===null)?g:Object.assign({},t,g),r.forEach(h=>h(t,p))}},s=()=>t,l={setState:o,getState:s,getInitialState:()=>m,subscribe:i=>(r.add(i),()=>r.delete(i))},m=t=e(o,s,l);return l},Le=e=>e?oe(e):oe,Te=e=>e;function Ae(e,t=Te){const r=D.useSyncExternalStore(e.subscribe,D.useCallback(()=>t(e.getState()),[e,t]),D.useCallback(()=>t(e.getInitialState()),[e,t]));return D.useDebugValue(r),r}const se=e=>{const t=Le(e),r=o=>Ae(t,o);return Object.assign(r,t),r},de=e=>e?se(e):se;function Re(e,t){let r;try{r=e()}catch{return}return{getItem:s=>{var n;const a=m=>m===null?null:JSON.parse(m,t==null?void 0:t.reviver),l=(n=r.getItem(s))!=null?n:null;return l instanceof Promise?l.then(a):a(l)},setItem:(s,n)=>r.setItem(s,JSON.stringify(n,t==null?void 0:t.replacer)),removeItem:s=>r.removeItem(s)}}const ee=e=>t=>{try{const r=e(t);return r instanceof Promise?r:{then(o){return ee(o)(r)},catch(o){return this}}}catch(r){return{then(o){return this},catch(o){return ee(o)(r)}}}},Oe=(e,t)=>(r,o,s)=>{let n={storage:Re(()=>localStorage),partialize:x=>x,version:0,merge:(x,C)=>({...C,...x}),...t},a=!1;const l=new Set,m=new Set;let i=n.storage;if(!i)return e((...x)=>{console.warn(`[zustand persist middleware] Unable to update item '${n.name}', the given storage is currently unavailable.`),r(...x)},o,s);const u=()=>{const x=n.partialize({...o()});return i.setItem(n.name,{state:x,version:n.version})},g=s.setState;s.setState=(x,C)=>{g(x,C),u()};const p=e((...x)=>{r(...x),u()},o,s);s.getInitialState=()=>p;let h;const v=()=>{var x,C;if(!i)return;a=!1,l.forEach(y=>{var f;return y((f=o())!=null?f:p)});const E=((C=n.onRehydrateStorage)==null?void 0:C.call(n,(x=o())!=null?x:p))||void 0;return ee(i.getItem.bind(i))(n.name).then(y=>{if(y)if(typeof y.version=="number"&&y.version!==n.version){if(n.migrate){const f=n.migrate(y.state,y.version);return f instanceof Promise?f.then(b=>[!0,b]):[!0,f]}console.error("State loaded from storage couldn't be migrated since no migrate function was provided")}else return[!1,y.state];return[!1,void 0]}).then(y=>{var f;const[b,S]=y;if(h=n.merge(S,(f=o())!=null?f:p),r(h,!0),b)return u()}).then(()=>{E==null||E(h,void 0),h=o(),a=!0,m.forEach(y=>y(h))}).catch(y=>{E==null||E(void 0,y)})};return s.persist={setOptions:x=>{n={...n,...x},x.storage&&(i=x.storage)},clearStorage:()=>{i==null||i.removeItem(n.name)},getOptions:()=>n,rehydrate:()=>v(),hasHydrated:()=>a,onHydrate:x=>(l.add(x),()=>{l.delete(x)}),onFinishHydration:x=>(m.add(x),()=>{m.delete(x)})},n.skipHydration||v(),h||p},ue=Oe,Fe=de()(ue((e,t)=>({projects:[],currentProject:null,isLoading:!1,createProject:(r,o)=>{const s={id:`project_${Date.now()}`,title:r,description:o||"",scriptContent:`FADE IN:

EXT. ${r.toUpperCase()} - DAY

A new story begins...

FADE OUT.`,createdAt:new Date,updatedAt:new Date,author:"Writer",genre:"Drama",pageCount:1,wordCount:8,characterCount:50};e(n=>({projects:[...n.projects,s],currentProject:s}))},updateProject:(r,o)=>{e(s=>{var n;return{projects:s.projects.map(a=>a.id===r?{...a,...o,updatedAt:new Date}:a),currentProject:((n=s.currentProject)==null?void 0:n.id)===r?{...s.currentProject,...o,updatedAt:new Date}:s.currentProject}})},deleteProject:r=>{e(o=>{var s;return{projects:o.projects.filter(n=>n.id!==r),currentProject:((s=o.currentProject)==null?void 0:s.id)===r?null:o.currentProject}})},setCurrentProject:r=>{e({currentProject:r})},updateScriptContent:r=>{const{currentProject:o}=t();if(!o)return;const s=r.split(/\\s+/).filter(m=>m.length>0).length,n=Math.ceil(r.split("\\n").length/55),a=r.length,l={scriptContent:r,wordCount:s,pageCount:n,characterCount:a,updatedAt:new Date};e(m=>({currentProject:{...o,...l},projects:m.projects.map(i=>i.id===o.id?{...i,...l}:i)}))},getProjectById:r=>t().projects.find(o=>o.id===r),duplicateProject:r=>{const{projects:o}=t(),s=o.find(n=>n.id===r);if(s){const n={...s,id:`project_${Date.now()}`,title:`${s.title} (Copy)`,createdAt:new Date,updatedAt:new Date};e(a=>({projects:[...a.projects,n]}))}},exportProject:(r,o)=>{const s=t().getProjectById(r);s&&console.log(`Exporting project ${s.title} as ${o}`)}}),{name:"hemantdoc-scriptwriter-projects",version:1})),$e={theme:"light",fontSize:12,fontFamily:"Courier New",autoSave:!0,spellCheck:!0,wordWrap:!0,showLineNumbers:!1,showPageBreaks:!0},Ie=de()(ue((e,t)=>({user:null,isAuthenticated:!1,isLoading:!1,setUser:r=>{e({user:r,isAuthenticated:!0,isLoading:!1})},logout:()=>{e({user:null,isAuthenticated:!1,isLoading:!1})},updateUserPreferences:r=>{const{user:o}=t();if(!o)return;const s={...o,preferences:{...o.preferences,...r}};e({user:s})},initializeUser:()=>{const{user:r}=t();r||e({user:{id:"demo-user",name:"Professional Writer",email:"writer@hemantdoc.com",preferences:$e},isAuthenticated:!0,isLoading:!1})}}),{name:"hemantdoc-scriptwriter-auth",version:1}));let De={data:""},Me=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||De,_e=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,We=/\/\*[^]*?\*\/|  +/g,ae=/\n+/g,L=(e,t)=>{let r="",o="",s="";for(let n in e){let a=e[n];n[0]=="@"?n[1]=="i"?r=n+" "+a+";":o+=n[1]=="f"?L(a,n):n+"{"+L(a,n[1]=="k"?"":t)+"}":typeof a=="object"?o+=L(a,t?t.replace(/([^,])+/g,l=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,m=>/&/.test(m)?m.replace(/&/g,l):l?l+" "+m:m)):n):a!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=L.p?L.p(n,a):n+":"+a+";")}return r+(t&&s?t+"{"+s+"}":s)+o},k={},me=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+me(e[r]);return t}return e},Be=(e,t,r,o,s)=>{let n=me(e),a=k[n]||(k[n]=(m=>{let i=0,u=11;for(;i<m.length;)u=101*u+m.charCodeAt(i++)>>>0;return"go"+u})(n));if(!k[a]){let m=n!==e?e:(i=>{let u,g,p=[{}];for(;u=_e.exec(i.replace(We,""));)u[4]?p.shift():u[3]?(g=u[3].replace(ae," ").trim(),p.unshift(p[0][g]=p[0][g]||{})):p[0][u[1]]=u[2].replace(ae," ").trim();return p[0]})(e);k[a]=L(s?{["@keyframes "+a]:m}:m,r?"":"."+a)}let l=r&&k.g?k.g:null;return r&&(k.g=k[a]),((m,i,u,g)=>{g?i.data=i.data.replace(g,m):i.data.indexOf(m)===-1&&(i.data=u?m+i.data:i.data+m)})(k[a],t,o,l),a},Ue=(e,t,r)=>e.reduce((o,s,n)=>{let a=t[n];if(a&&a.call){let l=a(r),m=l&&l.props&&l.props.className||/^go/.test(l)&&l;a=m?"."+m:l&&typeof l=="object"?l.props?"":L(l,""):l===!1?"":l}return o+s+(a??"")},"");function Y(e){let t=this||{},r=e.call?e(t.p):e;return Be(r.unshift?r.raw?Ue(r,[].slice.call(arguments,1),t.p):r.reduce((o,s)=>Object.assign(o,s&&s.call?s(t.p):s),{}):r,Me(t.target),t.g,t.o,t.k)}let pe,te,re;Y.bind({g:1});let P=Y.bind({k:1});function He(e,t,r,o){L.p=t,pe=e,te=r,re=o}function T(e,t){let r=this||{};return function(){let o=arguments;function s(n,a){let l=Object.assign({},n),m=l.className||s.className;r.p=Object.assign({theme:te&&te()},l),r.o=/ *go\d+/.test(m),l.className=Y.apply(r,o)+(m?" "+m:""),t&&(l.ref=a);let i=e;return e[0]&&(i=l.as||e,delete l.as),re&&i[0]&&re(l),pe(i,l)}return t?t(s):s}}var ze=e=>typeof e=="function",Z=(e,t)=>ze(e)?e(t):e,Ze=(()=>{let e=0;return()=>(++e).toString()})(),fe=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Ve=20,ge=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,Ve)};case 1:return{...e,toasts:e.toasts.map(n=>n.id===t.toast.id?{...n,...t.toast}:n)};case 2:let{toast:r}=t;return ge(e,{type:e.toasts.find(n=>n.id===r.id)?1:0,toast:r});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(n=>n.id===o||o===void 0?{...n,dismissed:!0,visible:!1}:n)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(n=>n.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(n=>({...n,pauseDuration:n.pauseDuration+s}))}}},z=[],R={toasts:[],pausedAt:void 0},O=e=>{R=ge(R,e),z.forEach(t=>{t(R)})},Ye={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Ke=(e={})=>{let[t,r]=c.useState(R),o=c.useRef(R);c.useEffect(()=>(o.current!==R&&r(R),z.push(r),()=>{let n=z.indexOf(r);n>-1&&z.splice(n,1)}),[]);let s=t.toasts.map(n=>{var a,l,m;return{...e,...e[n.type],...n,removeDelay:n.removeDelay||((a=e[n.type])==null?void 0:a.removeDelay)||(e==null?void 0:e.removeDelay),duration:n.duration||((l=e[n.type])==null?void 0:l.duration)||(e==null?void 0:e.duration)||Ye[n.type],style:{...e.style,...(m=e[n.type])==null?void 0:m.style,...n.style}}});return{...t,toasts:s}},Je=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||Ze()}),W=e=>(t,r)=>{let o=Je(t,e,r);return O({type:2,toast:o}),o.id},j=(e,t)=>W("blank")(e,t);j.error=W("error");j.success=W("success");j.loading=W("loading");j.custom=W("custom");j.dismiss=e=>{O({type:3,toastId:e})};j.remove=e=>O({type:4,toastId:e});j.promise=(e,t,r)=>{let o=j.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(s=>{let n=t.success?Z(t.success,s):void 0;return n?j.success(n,{id:o,...r,...r==null?void 0:r.success}):j.dismiss(o),s}).catch(s=>{let n=t.error?Z(t.error,s):void 0;n?j.error(n,{id:o,...r,...r==null?void 0:r.error}):j.dismiss(o)}),e};var Xe=(e,t)=>{O({type:1,toast:{id:e,height:t}})},qe=()=>{O({type:5,time:Date.now()})},M=new Map,Ge=1e3,Qe=(e,t=Ge)=>{if(M.has(e))return;let r=setTimeout(()=>{M.delete(e),O({type:4,toastId:e})},t);M.set(e,r)},et=e=>{let{toasts:t,pausedAt:r}=Ke(e);c.useEffect(()=>{if(r)return;let n=Date.now(),a=t.map(l=>{if(l.duration===1/0)return;let m=(l.duration||0)+l.pauseDuration-(n-l.createdAt);if(m<0){l.visible&&j.dismiss(l.id);return}return setTimeout(()=>j.dismiss(l.id),m)});return()=>{a.forEach(l=>l&&clearTimeout(l))}},[t,r]);let o=c.useCallback(()=>{r&&O({type:6,time:Date.now()})},[r]),s=c.useCallback((n,a)=>{let{reverseOrder:l=!1,gutter:m=8,defaultPosition:i}=a||{},u=t.filter(h=>(h.position||i)===(n.position||i)&&h.height),g=u.findIndex(h=>h.id===n.id),p=u.filter((h,v)=>v<g&&h.visible).length;return u.filter(h=>h.visible).slice(...l?[p+1]:[0,p]).reduce((h,v)=>h+(v.height||0)+m,0)},[t]);return c.useEffect(()=>{t.forEach(n=>{if(n.dismissed)Qe(n.id,n.removeDelay);else{let a=M.get(n.id);a&&(clearTimeout(a),M.delete(n.id))}})},[t]),{toasts:t,handlers:{updateHeight:Xe,startPause:qe,endPause:o,calculateOffset:s}}},tt=P`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,rt=P`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,nt=P`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,ot=T("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${tt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${rt} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${nt} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,st=P`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,at=T("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${st} 1s linear infinite;
`,it=P`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ct=P`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,lt=T("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${it} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ct} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,dt=T("div")`
  position: absolute;
`,ut=T("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,mt=P`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,pt=T("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${mt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ft=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?c.createElement(pt,null,t):t:r==="blank"?null:c.createElement(ut,null,c.createElement(at,{...o}),r!=="loading"&&c.createElement(dt,null,r==="error"?c.createElement(ot,{...o}):c.createElement(lt,{...o})))},gt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ht=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,xt="0%{opacity:0;} 100%{opacity:1;}",bt="0%{opacity:1;} 100%{opacity:0;}",yt=T("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,vt=T("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,wt=(e,t)=>{let r=e.includes("top")?1:-1,[o,s]=fe()?[xt,bt]:[gt(r),ht(r)];return{animation:t?`${P(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${P(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},jt=c.memo(({toast:e,position:t,style:r,children:o})=>{let s=e.height?wt(e.position||t||"top-center",e.visible):{opacity:0},n=c.createElement(ft,{toast:e}),a=c.createElement(vt,{...e.ariaProps},Z(e.message,e));return c.createElement(yt,{className:e.className,style:{...s,...r,...e.style}},typeof o=="function"?o({icon:n,message:a}):c.createElement(c.Fragment,null,n,a))});He(c.createElement);var Et=({id:e,className:t,style:r,onHeightUpdate:o,children:s})=>{let n=c.useCallback(a=>{if(a){let l=()=>{let m=a.getBoundingClientRect().height;o(e,m)};l(),new MutationObserver(l).observe(a,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return c.createElement("div",{ref:n,className:t,style:r},s)},Ct=(e,t)=>{let r=e.includes("top"),o=r?{top:0}:{bottom:0},s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:fe()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...o,...s}},St=Y`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,U=16,Nt=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:s,containerStyle:n,containerClassName:a})=>{let{toasts:l,handlers:m}=et(r);return c.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:U,left:U,right:U,bottom:U,pointerEvents:"none",...n},className:a,onMouseEnter:m.startPause,onMouseLeave:m.endPause},l.map(i=>{let u=i.position||t,g=m.calculateOffset(i,{reverseOrder:e,gutter:o,defaultPosition:t}),p=Ct(u,g);return c.createElement(Et,{id:i.id,key:i.id,onHeightUpdate:m.updateHeight,className:i.visible?St:"",style:p},i.type==="custom"?Z(i.message,i):s?s(i):c.createElement(jt,{toast:i,position:u}))}))},H=j;function kt({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"}))}const Pt=c.forwardRef(kt),Lt=Pt;function Tt({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"}),c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"}))}const At=c.forwardRef(Tt),Rt=At;function Ot({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"}))}const Ft=c.forwardRef(Ot),$t=Ft;function It({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"}))}const Dt=c.forwardRef(It),G=Dt;function Mt({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"}),c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"}))}const _t=c.forwardRef(Mt),Wt=_t;function Bt({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"}))}const Ut=c.forwardRef(Bt),Ht=Ut;function zt({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"}))}const Zt=c.forwardRef(zt),Vt=Zt;function Yt({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"}))}const Kt=c.forwardRef(Yt),Jt=Kt;function Xt({title:e,titleId:t,...r},o){return c.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:o,"aria-labelledby":t},r),e?c.createElement("title",{id:t},e):null,c.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"}))}const qt=c.forwardRef(Xt),Gt=qt,ie={scene_heading:{marginLeft:0,marginRight:60,textAlign:"left",textTransform:"uppercase",fontWeight:"bold",marginTop:24,marginBottom:0},character:{marginLeft:220,marginRight:0,textAlign:"center",textTransform:"uppercase",fontWeight:"bold",marginTop:12,marginBottom:0},dialogue:{marginLeft:100,marginRight:120,textAlign:"left",textTransform:"none",fontWeight:"normal",marginTop:0,marginBottom:0},parenthetical:{marginLeft:160,marginRight:100,textAlign:"center",textTransform:"none",fontWeight:"normal",marginTop:0,marginBottom:0},action:{marginLeft:0,marginRight:60,textAlign:"left",textTransform:"none",fontWeight:"normal",marginTop:12,marginBottom:0},transition:{marginLeft:0,marginRight:0,textAlign:"right",textTransform:"uppercase",fontWeight:"bold",marginTop:12,marginBottom:0},shot:{marginLeft:0,marginRight:60,textAlign:"left",textTransform:"uppercase",fontWeight:"bold",marginTop:12,marginBottom:0}};function _(e,t,r){var s,n;const o=e.trim();if(!o)return"action";if(/^(INT\\.|EXT\\.|FADE IN:|FADE OUT\\.|CUT TO:)/i.test(o))return"scene_heading";if(/^[A-Z\\s']{2,}$/.test(o)&&o.length<50){const a=(s=t[r+1])==null?void 0:s.trim();if(a&&!/^[A-Z\\s']{2,}$/.test(a))return"character"}if(/^\\([^)]+\\)$/.test(o))return"parenthetical";if(/^(CUT TO:|FADE TO:|DISSOLVE TO:|SMASH CUT TO:)/.test(o))return"transition";if(r>0){const a=(n=t[r-1])==null?void 0:n.trim();if(a&&/^[A-Z\\s']{2,}$/.test(a))return"dialogue"}return/^(CLOSE UP|WIDE SHOT|MEDIUM SHOT|POV|INSERT)/i.test(o)?"shot":"action"}function he(e,t){const r=e.trim();if(!r)return"";const o=ie[t]||ie.action;let s=r;o.textTransform==="uppercase"?s=s.toUpperCase():o.textTransform==="lowercase"&&(s=s.toLowerCase()),t==="parenthetical"&&!s.startsWith("(")&&(s=`(${s})`),t==="transition"&&!s.endsWith(":")&&!s.endsWith(".")&&(s=s+":");const n=Math.round(o.marginLeft/12);return" ".repeat(Math.max(0,n))+s}function Qt(e){const t=e.split("\\n");return t.map((o,s)=>{const n=_(o,t,s);return he(o,n)}).join("\\n")}const xe=c.forwardRef(({value:e,onChange:t,isPreviewMode:r,className:o="",placeholder:s},n)=>{const a=c.useRef(null);c.useImperativeHandle(n,()=>({formatCurrentLine:i=>{if(!a.current)return;const u=a.current,g=u.selectionStart,p=u.selectionEnd,h=e.substring(0,g),v=e.substring(p),x=h.lastIndexOf("\\n"),C=v.indexOf("\\n"),E=x+1,y=C===-1?e.length:p+C,f=e.substring(E,y),b=he(f,i),S=e.substring(0,E)+b+e.substring(y);t(S),setTimeout(()=>{const A=E+b.length;u.setSelectionRange(A,A),u.focus(),u.scrollIntoView({block:"nearest"})},0)},insertTextAtCursor:i=>{if(!a.current)return;const u=a.current,g=u.selectionStart,p=u.selectionEnd,h=e.substring(0,g)+i+e.substring(p);t(h),setTimeout(()=>{const v=g+i.length;u.setSelectionRange(v,v),u.focus()},0)},focus:()=>{var i;(i=a.current)==null||i.focus()},getCurrentLine:()=>{if(!a.current)return"";const i=a.current.selectionStart,u=e.substring(0,i),g=e.substring(i),p=u.lastIndexOf("\\n"),h=g.indexOf("\\n"),v=p+1,x=h===-1?e.length:i+h;return e.substring(v,x)},getCurrentElementType:()=>{if(!a.current)return"action";const i=e.split("\\n"),u=a.current.selectionStart,p=e.substring(0,u).split("\\n").length-1;return _(i[p]||"",i,p)}}));const l=c.useCallback(i=>{if(i.metaKey||i.ctrlKey){const u={1:"scene_heading",2:"action",3:"character",4:"dialogue",5:"parenthetical",6:"transition",7:"shot"};u[i.key]&&(i.preventDefault(),n&&"current"in n&&n.current&&n.current.formatCurrentLine(u[i.key]))}i.key==="Enter"&&setTimeout(()=>{const u=e.split("\\n"),g=a.current;if(!g)return;const p=g.selectionStart,v=e.substring(0,p).split("\\n").length-1,x=u[v-1]||"";_(x,u,v-1)==="character"&&x.trim()&&n&&"current"in n&&n.current&&setTimeout(()=>{var E;return(E=n.current)==null?void 0:E.formatCurrentLine("dialogue")},10)},0)},[e,n]),m=i=>{const u={scene_heading:{fontWeight:"bold",textTransform:"uppercase",marginLeft:"0in",marginTop:"24px",marginBottom:"0px",color:"#1e40af"},character:{fontWeight:"bold",textTransform:"uppercase",textAlign:"center",marginLeft:"220px",marginTop:"12px",marginBottom:"0px",color:"#dc2626"},dialogue:{marginLeft:"100px",marginRight:"120px",marginTop:"0px",marginBottom:"0px",color:"#374151"},parenthetical:{fontStyle:"italic",textAlign:"center",marginLeft:"160px",marginTop:"0px",marginBottom:"0px",color:"#6b7280"},action:{marginLeft:"0px",marginRight:"60px",marginTop:"12px",marginBottom:"0px",color:"#374151"},transition:{fontWeight:"bold",textTransform:"uppercase",textAlign:"right",marginTop:"12px",marginBottom:"0px",color:"#ec4899"},shot:{fontWeight:"bold",textTransform:"uppercase",marginLeft:"0px",marginTop:"12px",marginBottom:"0px",color:"#7c3aed"}};return u[i]||u.action};return r?d.jsx("div",{className:`flex-1 w-full p-8 overflow-y-auto bg-white ${o}`,children:e.split("\\n").map((i,u)=>{const g=e.split("\\n"),p=_(i,g,u),h=m(p);return d.jsx("div",{style:{...h,fontFamily:"Courier New, monospace",fontSize:"12pt",lineHeight:"1.2",minHeight:i.trim()?"auto":"24px",marginBottom:"0px"},title:`${p.replace("_"," ").toUpperCase()}`,children:i||"\\u00A0"},u)})}):d.jsx("div",{className:`flex-1 flex flex-col ${o}`,children:d.jsx("textarea",{ref:a,value:e,onChange:i=>t(i.target.value),onKeyDown:l,placeholder:s||`FADE IN:

EXT. YOUR STORY - DAY

Start writing your professional screenplay here...

🎬 PROFESSIONAL FEATURES:
• Industry-standard formatting with Celtx-style positioning
• Character names centered, dialogue properly indented  
• Real-time auto-save & scene numbering
• Export to PDF with professional positioning
• Full keyboard shortcuts (⌘1-7 for elements)

Begin typing to experience professional scriptwriting!

FADE OUT.`,className:"flex-1 w-full p-8 border-none outline-none resize-none bg-white",style:{fontFamily:"Courier New, monospace",fontSize:"12pt",lineHeight:"1.2",color:"#000000",backgroundColor:"#ffffff"},spellCheck:!1})})});xe.displayName="ProfessionalScriptEditor";function er(){const{currentProject:e,createProject:t,updateScriptContent:r}=Fe(),{user:o,initializeUser:s}=Ie(),[n,a]=c.useState(`FADE IN:

EXT. HEMANTDOC SCRIPTWRITER PRO - DAY

A revolutionary screenplay writing application comes to life with professional formatting, industry-standard positioning, and Celtx-style character/dialogue layout.

WRITER
(excited)
Finally! Character buttons that actually format text, cursor positioning that works, and consistent formatting across all modes!

The Writer begins typing, experiencing the seamless professional formatting system with scene numbering, enhanced PDF export, and AI script analysis.

FADE OUT.`),[l,m]=c.useState(!1),[i,u]=c.useState(0),[g,p]=c.useState(1),h=c.useRef(null);c.useEffect(()=>{s(),e||t("My First Screenplay","A professional screenplay with industry-standard formatting")},[]),c.useEffect(()=>{e&&a(e.scriptContent)},[e]);const v=[{type:"scene_heading",label:"Scene Heading",icon:Ht,shortcut:"⌘1",color:"bg-blue-500"},{type:"action",label:"Action",icon:Vt,shortcut:"⌘2",color:"bg-green-500"},{type:"character",label:"Character",icon:Gt,shortcut:"⌘3",color:"bg-red-500"},{type:"dialogue",label:"Dialogue",icon:$t,shortcut:"⌘4",color:"bg-purple-500"},{type:"parenthetical",label:"Parenthetical",icon:G,shortcut:"⌘5",color:"bg-yellow-500"},{type:"transition",label:"Transition",icon:Lt,shortcut:"⌘6",color:"bg-pink-500"},{type:"shot",label:"Shot",icon:Rt,shortcut:"⌘7",color:"bg-indigo-500"}],x=c.useCallback(f=>{a(f);const b=f.split(/\\s+/).filter(A=>A.length>0).length,S=Math.ceil(f.split("\\n").length/55);u(b),p(S),clearTimeout(window.saveTimer),window.saveTimer=setTimeout(()=>{r(f)},1e3)},[r]),C=f=>{h.current&&(h.current.formatCurrentLine(f),H.success(`🎯 Formatted as ${f.replace("_"," ").toUpperCase()}`,{duration:1e3,style:{background:"#fed7aa",color:"#9a3412",fontWeight:"600"}}))},E=()=>{const f=Qt(n);a(f),H.success("✨ Script formatted with industry standards!",{duration:3e3,style:{background:"#fed7aa",color:"#9a3412",fontWeight:"600"}})},y=async()=>{try{const{jsPDF:f}=await je(()=>import("./utils-34ded122.js").then(F=>F.j),[]),b=new f("portrait","pt","letter"),S=612,A=792,B=90,be=54,K=54,$=12;let N=K+36;b.setFont("courier","bold"),b.setFontSize(24);const J=A/2-100;b.text("PROFESSIONAL SCREENPLAY",S/2,J,{align:"center"}),b.setFont("courier","normal"),b.setFontSize(12),b.text("Written with HemantDoc ScriptWriter Pro",S/2,J+60,{align:"center"}),b.text("Professional Formatting System",S/2,J+80,{align:"center"}),b.addPage(),N=K+36;const X=n.split("\\n");for(let F=0;F<X.length;F++){const q=X[F].trim();if(!q)continue;const ye=_(q,X,F);let I=B,w=q;switch(ye){case"scene_heading":w=w.toUpperCase(),b.setFont("courier","bold"),N+=$;break;case"character":w=w.toUpperCase(),I=B+220,b.setFont("courier","bold"),N+=$/2;break;case"dialogue":I=B+100,b.setFont("courier","normal");break;case"parenthetical":w.startsWith("(")||(w="("+w),w.endsWith(")")||(w=w+")"),I=B+160,b.setFont("courier","normal");break;case"transition":w=w.toUpperCase(),w.endsWith(":")||(w=w+":");const ve=b.getTextWidth(w);I=S-be-ve,b.setFont("courier","bold"),N+=$;break;default:b.setFont("courier","normal"),N+=$/2;break}N>A-100&&(b.addPage(),N=K),b.setFontSize(12),b.text(w,I,N),N+=$}b.save("professional-screenplay.pdf"),H.success("📄 Professional PDF exported!",{duration:3e3,style:{background:"#dcfce7",color:"#166534",fontWeight:"600"}})}catch(f){console.error("PDF export failed:",f),H.error("❌ PDF export failed. Please try again.")}};return d.jsxs("div",{className:"h-screen flex flex-col",style:{background:"linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)"},children:[d.jsx(Nt,{position:"top-right"}),d.jsx("div",{className:"bg-gradient-to-r from-orange-400 to-orange-600 shadow-lg",children:d.jsx("div",{className:"max-w-7xl mx-auto px-6",children:d.jsxs("div",{className:"flex items-center justify-between h-16",children:[d.jsx("div",{className:"flex items-center space-x-4",children:d.jsxs("div",{className:"flex items-center space-x-3",children:[d.jsx("div",{className:"w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg",children:d.jsx(G,{className:"h-6 w-6 text-orange-500"})}),d.jsxs("div",{children:[d.jsx("h1",{className:"text-xl font-bold text-white drop-shadow-sm",children:"HemantDoc ScriptWriter Pro"}),d.jsx("p",{className:"text-sm text-orange-100",children:"Professional Screenplay Formatting System"})]})]})}),d.jsxs("div",{className:"hidden md:flex items-center space-x-8 text-white",children:[d.jsxs("div",{className:"text-center",children:[d.jsx("div",{className:"text-2xl font-bold",children:i}),d.jsx("div",{className:"text-xs text-orange-100",children:"WORDS"})]}),d.jsxs("div",{className:"text-center",children:[d.jsx("div",{className:"text-2xl font-bold",children:g}),d.jsx("div",{className:"text-xs text-orange-100",children:"PAGES"})]})]}),d.jsx("div",{className:"flex items-center space-x-3",children:d.jsxs("button",{onClick:()=>m(!l),className:`flex items-center px-4 py-2 rounded-lg transition-all ${l?"bg-white text-orange-600 shadow-lg":"bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"}`,children:[d.jsx(Wt,{className:"h-4 w-4 mr-2"}),l?"Edit":"Preview"]})})]})})}),d.jsxs("div",{className:"flex-1 flex",children:[d.jsx("div",{className:"w-64 bg-gradient-to-b from-orange-50 to-orange-100 border-r-2 border-orange-200 p-4 shadow-lg",children:d.jsxs("div",{className:"space-y-4",children:[d.jsxs("div",{className:"bg-white rounded-xl p-4 shadow-sm",children:[d.jsx("h3",{className:"text-sm font-semibold text-orange-800 mb-3",children:"Quick Actions"}),d.jsxs("div",{className:"space-y-2",children:[d.jsxs("button",{onClick:E,className:"w-full flex items-center px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm",children:[d.jsx(Jt,{className:"h-4 w-4 mr-2"}),"Auto-Format"]}),d.jsxs("button",{onClick:y,className:"w-full flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all",children:[d.jsx(G,{className:"h-4 w-4 mr-2"}),"Export PDF"]})]})]}),d.jsxs("div",{className:"bg-white rounded-xl p-4 shadow-sm",children:[d.jsx("h3",{className:"text-sm font-semibold text-orange-800 mb-3",children:"Format Elements"}),d.jsx("div",{className:"space-y-1",children:v.map(f=>{const b=f.icon;return d.jsxs("button",{onClick:()=>C(f.type),className:"w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-800 rounded-lg transition-all group",title:`${f.label} (${f.shortcut})`,children:[d.jsx("div",{className:`w-3 h-3 rounded-full mr-3 ${f.color} group-hover:scale-110 transition-transform`}),d.jsx(b,{className:"h-4 w-4 mr-2 text-gray-500 group-hover:text-orange-600"}),d.jsx("span",{className:"flex-1 text-left",children:f.label}),d.jsx("span",{className:"text-xs text-gray-400 group-hover:text-orange-500",children:f.shortcut})]},f.type)})})]})]})}),d.jsx("div",{className:"flex-1 flex flex-col overflow-hidden",children:d.jsx("div",{className:"flex-1 p-8 flex flex-col",children:d.jsx("div",{className:"bg-white rounded-2xl shadow-xl border-2 border-orange-200 flex-1 flex flex-col min-h-0",children:d.jsx(xe,{ref:h,value:n,onChange:x,isPreviewMode:l,className:"flex-1 rounded-2xl"})})})})]}),d.jsx("div",{className:"bg-gradient-to-r from-orange-100 to-orange-200 border-t-2 border-orange-300 px-6 py-3",children:d.jsxs("div",{className:"flex items-center justify-between text-sm",children:[d.jsxs("div",{className:"flex items-center space-x-6 text-orange-800",children:[d.jsx("span",{className:"font-semibold",children:"Format: Professional Screenplay"}),d.jsx("span",{children:"Font: Courier New 12pt"})]}),d.jsx("div",{className:"flex items-center space-x-6 text-orange-700",children:d.jsxs("span",{className:"font-bold text-orange-600 flex items-center",children:[d.jsx("div",{className:"w-2 h-2 bg-orange-500 rounded-full mr-2"}),"Professional Formatting System v3.0.0"]})})]})})]})}Q.createRoot(document.getElementById("root")).render(d.jsx(D.StrictMode,{children:d.jsx(er,{})}));
//# sourceMappingURL=index-9d88d9df.js.map

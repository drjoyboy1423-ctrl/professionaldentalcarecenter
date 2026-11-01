/* ---------- Mobile enhancements ---------- */
/* 1. The phone's Back button / swipe-back goes to the previous page (or closes an open window) instead of leaving the app. */
let MOBK='',MOBSKIP=0,MOBPOP=0;
const _go0=go;
go=function(v,id){const r=_go0.apply(this,arguments);try{
  if(innerWidth<1024){const s=$('sb');if(s&&!s.classList.contains('-translate-x-full')){s.classList.add('-translate-x-full');const o=$('ov');if(o)o.classList.add('hidden')}}
  if(!MOBPOP&&U){const k=V+'|'+(V=='patient'||V=='card'?(PID||''):'');if(k!=MOBK){try{history.pushState({k},'')}catch(e){}MOBK=k}}}catch(e){}return r};
addEventListener('popstate',e=>{if(MOBSKIP){MOBSKIP=0;return}if(!U||!C)return;
  const m=$('md');if(m&&m.classList.contains('flex')){cl();MOBSKIP=1;history.forward();return}
  const k=e.state&&e.state.k;if(!k)return;const[v,id]=k.split('|');MOBPOP=1;MOBK=k;try{_go0(v,id||undefined)}finally{MOBPOP=0}});
try{history.replaceState({k:'dash|'},'');MOBK='dash|'}catch(e){}
/* 2. Browser bar / status bar takes the clinic colour (admin: head-office colour). */
function mobTheme(){let m=document.querySelector('meta[name=theme-color]');if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m)}m.content=(C&&(isHQ()?HQ.color:C.color))||'#dc2626'}
const _st0=setTheme;setTheme=function(c){_st0(c);try{mobTheme()}catch(e){}};
/* 3. Tap a phone number to call it. */
const telA=(n,cls)=>{const d=String(n||'').replace(/[^\d+]/g,'');return d?`<a href="tel:${H(d)}" onclick="event.stopPropagation()" class="${cls||''}" style="color:inherit;text-decoration:none">${H(n)}</a>`:H(n||'')};

/* 4. Bottom navigation bar (phones): the four main pages for your role + More (opens the full menu). */
function bnavRender(){const a=$('app');if(!U||!a||a.classList.contains('hidden'))return;let b=$('bnav');if(!b){b=document.createElement('nav');b.id='bnav';b.setAttribute('aria-label','Main menu');document.body.appendChild(b)}
 const ok=RN[U.role]||RN.reception,lbl={dash:'Home',recent:'Patients',appt:'Appointments',card:'New card',rinv:'Invoices',fin:'Finance',ran:'Analytics'},
  items=['dash','recent','appt','card','rinv','fin','ran'].filter(k=>ok.includes(k)).slice(0,4).map(k=>NAV.find(n=>n[0]==k)).filter(Boolean),cur=V=='patient'?'recent':V;
 b.innerHTML=items.map(n=>`<button class="${cur==n[0]?'on':''}" onclick="go('${n[0]}')"><i class="fa ${n[2]}"></i><span>${lbl[n[0]]||n[1]}</span></button>`).join('')+`<button onclick="tgl()"><i class="fa fa-bars"></i><span>More</span></button>`;b.classList.add('on')}
const _go1=go;go=function(){const r=_go1.apply(this,arguments);try{bnavRender()}catch(e){}return r};
/* 5. Install the app on the home screen (works offline once installed) */
let INSTALL_EV=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();INSTALL_EV=e;instShow()});
addEventListener('appinstalled',()=>{INSTALL_EV=null;instShow()});
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform=='MacIntel'&&navigator.maxTouchPoints>1),isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone;
function instShow(){const el=$('instbtn');if(el)el.style.display=(INSTALL_EV||(isIOS()&&!isStandalone()))?'flex':'none'}
async function installApp(){if(INSTALL_EV){INSTALL_EV.prompt();try{await INSTALL_EV.userChoice}catch(e){}INSTALL_EV=null;instShow();return}
 $('mb').innerHTML='<h3 class="font-bold text-xl mb-3">Install on your phone</h3><p class="text-sm mb-3">'+(isIOS()?'Tap the <b>Share</b> button in Safari, then <b>Add to Home Screen</b>.':'Open the browser menu (&#8942;) and tap <b>Install app</b> or <b>Add to Home screen</b>.')+'</p><p class="text-sm text-gray-600">The app then opens full screen like any other app and keeps working when the internet is down.</p><div class="text-right mt-4"><button onclick="cl()" class="px-4 py-2 rounded bg-gray-200">Close</button></div>';md.classList.replace('hidden','flex')}
function mobInit(){const lo=document.querySelector('#sb [onclick="logout()"]');if(lo&&!$('instbtn')){lo.insertAdjacentHTML('beforebegin','<div class="nv border-t" id="instbtn" onclick="installApp()" style="display:none"><i class="fa fa-download"></i>Install app</div>')}instShow();bnavRender();mobTheme()}
const _boot0=boot;boot=function(){const r=_boot0.apply(this,arguments);try{mobInit()}catch(e){}return r};
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})});

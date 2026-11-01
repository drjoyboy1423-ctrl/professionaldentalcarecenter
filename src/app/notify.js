/* In-app notifications: new patient -> assigned doctor (or all doctors/nurses); finished lab result -> the doctor who requested it.
   Found by comparing each data refresh with what this user last saw. Stored only on this device, wiped at logout. */
const NFK=()=>'nf:'+(U&&U.id||U&&U.username||'u')+':'+(C&&C.id||'');
const nfLoad=()=>{try{return JSON.parse(localStorage.getItem(NFK())||'null')}catch(e){return null}};
const nfSave=s=>{try{localStorage.setItem(NFK(),JSON.stringify(s))}catch(e){}};
function nfScan(){if(!U||!C)return;
 const pts={},lab={},ap={};S.patients.forEach(p=>{pts[p.id]=1;(p.d&&p.d.appt||[]).forEach((x,i)=>{ap[p.id+':'+(x.ts||i)]=1});(p.d&&p.d.lab||[]).forEach((x,i)=>{lab[p.id+':'+(x.ts||i)]=x.done=='Yes'?1:0})});
 const st=nfLoad();if(!st){nfSave({pts,lab,ap,list:[]});return}
 const add=[],me=U.name,role=U.role;
 S.patients.forEach(p=>{if(!st.pts[p.id]&&p.by!=me){const mine=p.doc?p.doc==me:(role=='doctor'||role=='nurse');if(mine&&role!='reception')add.push({t:'New patient',m:p.name+(p.doc?' (assigned to you)':' was registered'),pid:p.id,sk:'rec',ts:Date.now()})}
  (p.d&&p.d.appt||[]).forEach((x,i)=>{const k=p.id+':'+(x.ts||i);if(st.ap&&!st.ap[k]&&x.doc&&x.doc==me&&x.by!=me)add.push({t:'New appointment',m:p.name+' - '+(x.date||'')+' '+(x.time||''),pid:p.id,sk:'appt',ts:Date.now()})});
  (p.d&&p.d.lab||[]).forEach((x,i)=>{const k=p.id+':'+(x.ts||i);if(lab[k]&&st.lab[k]===0){const mine=x.by?x.by==me:role=='doctor';if(mine)add.push({t:'Lab result ready',m:(x.req||'Lab request')+' - '+p.name,pid:p.id,sk:'lab',ts:Date.now()})}})});
 const list=add.map(a=>({...a,r:0})).concat(st.list||[]).slice(0,50);
 nfSave({pts,lab,ap,list});if(add.length){nfBadge();toast(add.length==1?add[0].t+': '+add[0].m:add.length+' new notifications');try{if(window.Notification&&Notification.permission=='granted'&&document.hidden)new Notification(add[0].t,{body:add[0].m})}catch(e){}}}
function nfBadge(){const b=$('nfb');if(!b)return;const n=((nfLoad()||{}).list||[]).filter(x=>!x.r).length;b.textContent=n>9?'9+':n;b.style.display=n?'':'none'}
function nfOpen(){const st=nfLoad()||{list:[]},l=st.list||[];
 $('mb').innerHTML=`<div class="flex justify-between items-center mb-3"><h3 class="font-bold text-lg">Notifications</h3>${l.length?`<button onclick="nfClear()" class="text-xs text-blue-700">Clear all</button>`:''}</div>${l.length?l.map((x,i)=>`<div onclick="nfGo(${i})" class="border rounded-lg p-3 mb-2 cursor-pointer ${x.r?'bg-white':'bg-blue-50 border-blue-300'}"><div class="flex justify-between text-sm"><b>${H(x.t)}</b><span class="text-[11px] text-gray-500">${new Date(x.ts).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span></div><div class="text-sm text-gray-700">${H(x.m)}</div></div>`).join(''):'<p class="text-sm text-gray-500 py-6 text-center">No notifications yet. You will be told here when a new patient is assigned to you or a lab result you requested is finished.</p>'}
 ${window.Notification&&Notification.permission=='default'?`<button onclick="Notification.requestPermission().then(nfOpen)" class="w-full border rounded py-2 text-sm mb-2">Also show phone alerts while the app is in the background</button>`:''}<button onclick="cl()" class="bg-gray-600 text-white px-4 py-2 rounded">Close</button>`;
 md.classList.replace('hidden','flex');l.forEach(x=>x.r=1);nfSave({...st,list:l});nfBadge()}
function nfGo(i){const l=(nfLoad()||{}).list||[],x=l[i];cl();if(!x||!S.patients.find(p=>p.id==x.pid))return;PID=x.pid;SK=x.sk;go('patient')}
function nfClear(){const st=nfLoad()||{};nfSave({...st,list:[]});nfOpen();nfBadge()}
const _ap=applyData;applyData=function(){const r=_ap.apply(this,arguments);try{nfScan();nfBadge()}catch(e){}return r};
const _hd=hdr;hdr=function(){const r=_hd.apply(this,arguments);try{if(!$('nfbtn')&&$('calbtn'))$('calbtn').insertAdjacentHTML('beforebegin','<button id="nfbtn" onclick="nfOpen()" class="relative border rounded-full w-9 h-9 bg-white text-gray-700" title="Notifications" aria-label="Notifications"><i class="fa fa-bell"></i><span id="nfb" style="display:none;position:absolute;top:-4px;right:-4px" class="bg-red-600 text-white rounded-full text-[10px] leading-none px-1 py-0.5"></span></button>');nfBadge()}catch(e){}return r};
const _lo=logout;logout=function(){try{Object.keys(localStorage).filter(k=>k.startsWith('nf:')).forEach(k=>localStorage.removeItem(k))}catch(e){}return _lo.apply(this,arguments)};

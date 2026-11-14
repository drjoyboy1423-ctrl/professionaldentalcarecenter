/* ---------- My data: every user can save a copy of what they created to this device or to their own email.
   Staff (doctor, nurse, reception): only what they created. Manager: the whole clinic (all users). Administrator: every clinic. ---------- */
const mdScope=()=>U.role=='admin'?'All clinics - everything created by every user':U.role=='manager'?'Whole clinic '+(C?C.name:'')+' - everything created by all its users':'Only what you created (patients you registered, records, invoices and other items with your name)';
const mdName=()=>'prodental-'+(U.role=='admin'?'all-clinics':U.role=='manager'?String((C&&C.code)||'clinic').toLowerCase():String(U.username||'me').toLowerCase())+'-'+isoD(Date.now())+'.json';
async function mdLocal(){const f=S.fin?{...S.fin,bk:undefined}:null;return {format:'prodental-clinic-backup',version:1,created:new Date().toISOString(),offlineCopy:true,clinic:C,patients:S.patients,lists:[],local:{dis:S.dis,proc:S.proc,fin:f,stock:S.stock}}}
async function mdBuild(){
 /* no internet: use the copy already on this device (the clinic you have open) */
 if(U.role=='admin'){try{const out=[];for(const c of CL.concat(CLA||[])){out.push(await DB.backupClinic(c.id))}return {format:'prodental-all-clinics',version:1,created:new Date().toISOString(),by:U.username,clinics:out}}catch(e){if(!isNet(e))throw e;return {format:'prodental-all-clinics',version:1,created:new Date().toISOString(),by:U.username,offlineCopy:true,note:'Made without internet: only the clinic open on this device.',clinics:[await mdLocal()]}}}
 if(U.role=='manager'){try{return await DB.backupClinic(C.id)}catch(e){if(!isNet(e))throw e;return await mdLocal()}}
 const me=U.name,P=[];
 (S.patients||[]).forEach(p=>{const secs={};Object.keys(p.d||{}).forEach(k=>{if(Array.isArray(p.d[k])){const L=p.d[k].filter(x=>x&&x.by==me);if(L.length)secs[k]=L}});const mine=p.by==me;if(mine||Object.keys(secs).length)P.push({id:p.id,card:p.card,name:p.name,phone:p.phone,registeredByMe:mine,doctor:p.doc||'',items:secs})});
 return {format:'prodental-my-data',version:1,created:new Date().toISOString(),user:{name:U.name,username:U.username,role:U.role},clinic:C?C.name:'',patients:P}}
const mdMsg=(m,bad)=>{const e=$('mdmsg');if(e){e.textContent=m;e.className='text-sm mt-3 '+(bad?'text-red-600':'text-green-700')}};
async function mdDevice(){try{mdMsg('Preparing...');const b=await mdBuild();dlJson(mdName(),b);mdMsg('Saved to this device ('+mdCount(b)+').')}catch(e){mdMsg(e.message||'Could not save.',1)}}
const mdCount=b=>b.clinics?b.clinics.length+' clinics, '+b.clinics.reduce((a,c)=>a+(c.patients||[]).length,0)+' patients':(b.patients||[]).length+' patients';
async function mdGz(t){const s=new Blob([t]).stream().pipeThrough(new CompressionStream('gzip')),buf=new Uint8Array(await new Response(s).arrayBuffer());let bin='';for(let i=0;i<buf.length;i+=0x8000)bin+=String.fromCharCode.apply(null,buf.subarray(i,i+0x8000));return btoa(bin)}
async function mdSendNow(name,t){return t.length>2e6&&window.CompressionStream?DB.emailMyData(name+'.gz',await mdGz(t),true):DB.emailMyData(name,t,false)}
async function mdEmail(){try{if(!U.email)return mdMsg('Add your email first: Profile > Edit.',1);mdMsg('Preparing...');const b=await mdBuild(),t=JSON.stringify(b),n=mdName();
 try{if(navigator.onLine===false)throw new Error('failed to fetch');const r=await mdSendNow(n,t);mdMsg('Sent ('+mdCount(b)+') to '+(r.to||'your email')+'.')}
 catch(e){if(!isNet(e))throw e;await IDB.set('mdq',{name:n,text:t,ts:Date.now()});mdMsg('No internet. The file is kept on this device and will be emailed automatically when the internet is back (keep the app installed and do not log out before then). You can also use Save to this device now.')}}catch(e){mdMsg(e.message||'Could not send.',1)}}
async function mdFlush(){try{if(!U||!navigator.onLine)return;const q=await IDB.get('mdq');if(!q)return;await mdSendNow(q.name,q.text);await IDB.del('mdq');toast('Your waiting data copy was emailed')}catch(e){}}
addEventListener('online',()=>setTimeout(mdFlush,3000));
const _bootMd=boot;boot=function(){const r=_bootMd.apply(this,arguments);setTimeout(mdFlush,6000);return r};
function myDataPage(){return hd('My data')+card('<h3 class="font-bold mb-1"><i class="fa fa-file-export mr-2"></i>Keep a copy of your data</h3>',`<p class="text-sm text-gray-600 mb-1"><b>What is included:</b> ${H(mdScope())}.</p><p class="text-sm text-gray-500 mb-3">The file may contain patient information: keep it private.</p><div class="flex flex-wrap gap-2"><button onclick="mdDevice()" class="px-4 py-2 rounded-md text-white text-sm font-semibold" style="background:var(--c)"><i class="fa fa-download mr-1"></i>Save to this device</button><button onclick="mdEmail()" class="px-4 py-2 rounded-md bg-gray-200 text-sm font-semibold"><i class="fa fa-envelope mr-1"></i>Send to my email${U.email?' ('+H(U.email)+')':''}</button></div>${U.email?'':'<p class="text-xs text-amber-700 mt-2">No email saved on your profile yet. Add it in Profile > Edit to use email.</p>'}<div id="mdmsg" class="text-sm mt-3"></div>`)}

/* ---------- Automatic copy on the manager's / administrator's own computer (backup folder), built into the app ----------
   Once a folder is chosen the app saves a fresh copy there about once a day when it is open; if the browser needs a tap to
   allow writing, a notice on the dashboard shows one button. Phones without folder support get a weekly "download a copy" reminder. */
const BKF_OK=()=>!!window.showDirectoryPicker;
const bkfLast=()=>+(localStorage.getItem('bkf_last_'+(C&&C.id))||0);
const bkfMark=()=>{try{localStorage.setItem('bkf_last_'+C.id,Date.now())}catch(e){}};
async function bkfState(){if(!bkdOk())return 'off';let h=null;try{h=await bkdIdb('get','dir')}catch(e){}
 if(h){let p='prompt';try{p=await h.queryPermission({mode:'readwrite'})}catch(e){}return p=='granted'?'ready':'ask'}
 return BKF_OK()?'none':'nofs'}
/* write a fresh copy (works offline too: uses the copy on this device) */
async function bkfSave(){const b=await mdBuild(),n=await bkdWriteFolder(b);bkfMark();return n}
const _bkdFolder=bkdFolder;bkdFolder=async function(){await _bkdFolder.apply(this,arguments);try{if(await bkdIdb('get','dir')){bkdCfg().auto=true;bkfMark();await bkfSave().catch(()=>{});syncNow().catch(()=>{});toast('Backup folder set: a copy is saved there automatically')}}catch(e){}};
bkdAuto=async function(){try{if(!bkdOk())return;const st=await bkfState();if(st=='ready'&&Date.now()-bkfLast()>864e5){await bkfSave();toast('Backup copy saved to your folder')}
 const b=bkdCfg();if(b.auto&&b.url&&Date.now()-(+(localStorage.getItem('bkd_last_'+C.id)||0))>6*864e5){try{await bkdPost(await mdBuild());localStorage.setItem('bkd_last_'+C.id,Date.now())}catch(e){}}}catch(e){}};
async function bkfNow(){try{await bkfSave();toast('Backup copy saved');go('dash')}catch(e){alert(e.message||'Could not save the backup.')}}
function bkfLater(){try{localStorage.setItem('bkf_dis_'+C.id,Date.now())}catch(e){}go('dash')}
async function bkfBanner(){const e=$('bkfban');if(e)e.remove();if(V!='dash'||!bkdOk())return;const st=await bkfState(),old=Date.now()-bkfLast(),dis=Date.now()-(+(localStorage.getItem('bkf_dis_'+C.id)||0))<3*864e5;let m='',btn='';
 if(st=='none'&&!dis){m='<b>Protect your data.</b> Keep a copy on your own computer or phone so nothing is lost even if the internet or the server fails.';btn=`<button onclick="bkfChoose()" class="px-3 py-1.5 rounded-md text-white text-sm" style="background:var(--c)">Choose where to save</button><button onclick="bkfLater()" class="px-3 py-1.5 rounded-md bg-white border text-sm">Later</button>`}
 else if(st=='ask'&&old>864e5){m='<b>Backup folder:</b> tap to let the app save today\'s copy.';btn=`<button onclick="bkfNow()" class="px-3 py-1.5 rounded-md text-white text-sm" style="background:var(--c)">Save backup now</button>`}
 else if(st=='nofs'&&old>7*864e5&&!dis){m='<b>Weekly backup:</b> save a copy of '+(U.role=='admin'?'all clinics':'your clinic')+' to this device.';btn=`<button onclick="bkfShare().then(()=>go('dash'))" class="px-3 py-1.5 rounded-md text-white text-sm" style="background:var(--c)">Save / share a copy</button><button onclick="bkfLater()" class="px-3 py-1.5 rounded-md bg-white border text-sm">Later</button>`}
 if(!m)return;const v=$('v');if(!v||V!='dash')return;v.insertAdjacentHTML('afterbegin',`<div id="bkfban" class="bg-sky-50 border border-sky-300 rounded-xl p-3 mb-4 text-sm flex flex-wrap items-center gap-2 justify-between"><span>${m}</span><span class="flex gap-2">${btn}</span></div>`)}
{const _g=go;go=function(v){const r=_g.apply(this,arguments);setTimeout(bkfBanner,150);return r}}
/* My data page also offers the folder */
{const _p=myDataPage;myDataPage=function(){let h=_p.apply(this,arguments);if(bkdOk())h+=card('<h3 class="font-bold mb-1"><i class="fa fa-folder-open mr-2"></i>Where to keep your copy</h3>',`<p class="text-sm text-gray-500 mb-3">Choose a place that suits this device: a folder on a computer (saved automatically about once a day), or the phone's share menu (Files, Drive, WhatsApp, email).</p><div class="flex flex-wrap gap-2"><button class="px-3 py-2 rounded-md text-white text-sm" style="background:var(--c)" onclick="bkfChoose()"><i class="fa fa-location-dot mr-1"></i>Choose where to save</button>${BKF_OK()?'<button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkfNow().catch(()=>{})">Save to folder now</button>':''}${BKF_SHARE()?'<button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkfShare()">Share a copy now</button>':''}</div>${BKF_OK()?'<div class="text-xs text-gray-500 mt-2">Folder: <span id="bkd_fold">none chosen</span></div>':''}`);setTimeout(bkdFill,0);return h}}

/* ---------- Choose where to keep copies: a folder on a computer, or share/save on a phone ---------- */
const BKF_SHARE=()=>{try{return !!(navigator.canShare&&navigator.canShare({files:[new File(['{}'],'t.json',{type:'application/json'})]}))}catch(e){return false}};
async function bkfShare(){try{mdMsg('Preparing...');const b=await mdBuild(),f=new File([JSON.stringify(b)],mdName(),{type:'application/json'});
 if(BKF_SHARE()){await navigator.share({files:[f],title:'ProDental Records backup'});bkfMark();mdMsg('Shared. Choose Files, Drive, WhatsApp, email or any storage app.');toast('Backup copy shared');return}
 dlJson(mdName(),b);bkfMark();mdMsg('Saved to the Downloads folder of this device.')}catch(e){if(e&&e.name=='AbortError')return mdMsg('Cancelled.');mdMsg(e.message||'Could not save.',1)}}
function bkfChoose(){const pc=BKF_OK(),sh=BKF_SHARE(),o=(ic,t,d,a)=>`<button onclick="cl();${a}" class="w-full text-left border rounded-lg p-3 mb-2 hover:bg-gray-50"><div class="font-semibold"><i class="fa ${ic} mr-2 text-sky-700"></i>${t}</div><div class="text-xs text-gray-500 mt-1">${d}</div></button>`;
 $('mb').innerHTML='<h3 class="font-bold text-xl mb-1">Where do you want to keep your backup?</h3><p class="text-sm text-gray-500 mb-3">Choose what suits this device. You can change it any time.</p>'+
 (pc?o('fa-folder-open','A folder on this computer (automatic)','Pick a folder once (for example on a flash disk or Documents). The app saves a fresh copy there about once a day.',"bkdFolder()"):'')+
 (sh?o('fa-share-nodes','Phone storage, Drive, WhatsApp or email','Opens your phone\'s share menu: choose Files / Google Drive / any app or folder. The app reminds you every week.',"bkfShare()"):'')+
 o('fa-download','Downloads folder','Saves the file in this device\'s Downloads folder.',"mdDevice().then(bkfMark)")+
 '<div class="flex justify-end mt-2"><button onclick="cl()" class="px-4 py-2 rounded bg-gray-200">Close</button></div>';md.classList.replace('hidden','flex')}

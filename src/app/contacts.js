/* ---------- Phone contacts: pick a person from the phone's contact list to fill name and phone, and save a patient to the phone's contacts ----------
   Uses the browser Contact Picker (Android Chrome and the installed app). Where the phone does not offer it the button is simply not shown. */
const CTC_OK=()=>!!(navigator.contacts&&navigator.contacts.select&&window.isSecureContext);
const CTC_MAP={f_phone:['f_name','tel'],c_phone:['c_name','tel'],cr_phone:['cr_owner','tel'],f_email:['f_name','email'],cr_email:['cr_owner','email']};
const ctcNum=t=>{let n=String(t||'').replace(/[^\d+]/g,'');return n};
async function ctcPick(pid,nid,kind){try{const r=await navigator.contacts.select(['name','tel','email'],{multiple:false});if(!r||!r.length)return;const c=r[0],nm=(c.name||[])[0]||'',pe=$(pid),ne=nid&&$(nid),val=kind=='email'?String((c.email||[])[0]||'').trim():ctcNum((c.tel||[])[0]),fire=e=>{e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))};
  if(pe&&val){pe.value=val;fire(pe)}
  if(ne&&nm&&!ne.value.trim()){ne.value=nm;fire(ne)}
  if(!val)toast(kind=='email'?'That contact has no email address':'That contact has no phone number')}catch(e){if(e&&e.name!='AbortError')toast('Could not open your contacts')}}
function ctcDecorate(){if(!CTC_OK())return;Object.keys(CTC_MAP).forEach(id=>{const e=document.getElementById(id);if(!e||e.dataset.ctc)return;e.dataset.ctc=1;const b=document.createElement('button');b.type='button';b.className='text-xs px-2 py-1 rounded-md bg-sky-100 text-sky-800 mb-3';b.style.cssText='margin-top:-8px;display:inline-block';const k=CTC_MAP[id][1];b.innerHTML='<i class="fa fa-address-book mr-1"></i>'+(k=='email'?'Choose email from phone contacts':'Choose from phone contacts');b.onclick=()=>ctcPick(id,CTC_MAP[id][0],k);e.insertAdjacentElement('afterend',b)})}
{let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(ctcDecorate,60)}).observe(document.body,{childList:true,subtree:true})}
/* save a patient into the phone's contact list (opens the phone's own "add contact" screen) */
function ctcSave(pid){const p=S.patients.find(x=>x.id==pid);if(!p||!p.phone)return alert('This patient has no phone number.');const esc=s=>String(s||'').replace(/[\;,]/g,m=>'\\'+m).replace(/\n/g,' ');
 const v='BEGIN:VCARD\nVERSION:3.0\nFN:'+esc(p.name)+'\nN:'+esc(p.name)+';;;;\nTEL;TYPE=CELL:'+ctcNum(p.phone)+(p.email?'\nEMAIL:'+esc(p.email):'')+'\nORG:'+esc(C.name)+'\nNOTE:Card '+esc(p.card)+'\nEND:VCARD\n',a=document.createElement('a');a.href=URL.createObjectURL(new Blob([v],{type:'text/vcard'}));a.download=String(p.name||'patient').replace(/[^\w-]+/g,'-')+'.vcf';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}

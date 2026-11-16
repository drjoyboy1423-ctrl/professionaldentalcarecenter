/* ---------- Signing clinical records, the 24-hour lock and addendums ----------
   A doctor, BDS, visiting specialist or dental therapist can SIGN a record. For 24 hours after signing the
   record can still be corrected. After that it is locked: the text cannot be changed or deleted by anyone;
   a dated ADDENDUM can be added instead. The database enforces the same rule (see 20261115_note_lock.sql). */
const NL_MS=864e5;
const nlSigner=()=>!!U&&(U.role=='doctor'||(U.role=='nurse'&&U.stype=='therapist'));
const nlLocked=x=>!!(x&&x.sig&&Date.now()-(+x.sig.at||0)>NL_MS);
const nlMsg='This record was signed more than 24 hours ago and is locked. The original text cannot be changed or deleted. Use "Add addendum" to add a correction or a new note.';
function nlWhen(t){return fdate(t)+' '+ft(t)}
function recSign(i){const p=gp(),x=p&&(p.d.rec||[])[i];if(!x)return;
 if(!nlSigner())return alert('Only a doctor, BDS, visiting specialist or dental therapist can sign a record.');
 if(!ptW(p,'rec')){alert(ptMsg(p));return}
 if(x.sig)return alert('This record is already signed.');
 if(!confirm('Sign this record as '+U.name+'?\n\nYou can still correct it for 24 hours. After that it is locked and only addendums can be added.'))return;
 delete x.draft;delete x.dby;x.sig={by:U.name,role:U.role,st:U.stype||'',lic:U.idcode||'',at:Date.now()};
 AUD.log('SIGN','record '+(x.no||i+1)+' - '+p.name,{pid:String(p.id)});sv();go('patient')}
function recAddendum(i){const p=gp(),x=p&&(p.d.rec||[])[i];if(!x||!x.sig)return;
 if(!ptW(p,'rec')){alert(ptMsg(p));return}
 form('Addendum - Record '+H(x.no||i+1),[['t','Addendum (it is dated and signed with your name, and cannot be changed or removed after saving)','area']],{},v=>{const t=(v.t||'').trim();if(!t)return bad('Write the addendum.');
  (x.add=x.add||[]).push({text:t,by:U.name,role:U.role,at:Date.now()});AUD.log('ADDENDUM','record '+(x.no||i+1)+' - '+p.name,{pid:String(p.id)});sv();go('patient')},'Save addendum')}
/* blocks: editing or deleting a locked record */
{const _e=recEdit;recEdit=function(i){const p=gp(),x=p&&(p.d.rec||[])[i];if(nlLocked(x)){alert(nlMsg);return}return _e.apply(this,arguments)}}
{const _d=delI;delI=function(k,i){if(k=='rec'){const p=gp(),x=p&&(p.d.rec||[])[i];if(nlLocked(x)){alert(nlMsg);return}}return _d.apply(this,arguments)}}
{const _s=rfSave;rfSave=function(){if(REC&&REC.i>=0){const p=gp(),x=p&&(p.d.rec||[])[REC.i];if(nlLocked(x)){alert(nlMsg);REC=null;go('patient');return}}return _s.apply(this,arguments)}}
/* the card in the record list */
{const _c=recCard;recCard=function(x,i){let h=_c.apply(this,arguments);const p=gp(),lk=nlLocked(x);
 if(lk)h=h.replace(/<i [^>]*onclick="(recEdit|delI)\([^"]*"[^>]*><\/i>/g,'<i class="fa fa-lock text-gray-500" title="Locked: signed more than 24 hours ago"></i>');
 const ic=(c,t,a)=>`<button class="${c} px-2 py-1 rounded text-xs mr-2 mt-1" onclick="${a}"><i class="fa ${t} mr-1"></i>`;
 let f='<div class="mt-2 pt-2 border-t text-xs">';
 if(x.sig)f+=`<div class="text-green-700"><i class="fa fa-signature mr-1"></i>Signed by <b>${H(x.sig.by)}</b>${x.sig.lic?' (ID '+H(x.sig.lic)+')':''} &middot; ${H(nlWhen(x.sig.at))} &middot; ${lk?'<b>Locked</b>':'can be corrected until '+H(nlWhen(+x.sig.at+NL_MS))}</div>`;
 else f+=x.draft?`<div class="text-amber-700"><i class="fa fa-pen-nib mr-1"></i><b>Draft</b> by ${H(x.dby||'nurse')} - waiting for a doctor's signature</div>`:'<div class="text-gray-500"><i class="fa fa-pen-nib mr-1"></i>Not signed yet</div>';
 (x.add||[]).forEach(a=>{f+=`<div class="mt-1 bg-amber-50 border border-amber-200 rounded p-2"><b>Addendum</b> &middot; ${H(a.by)} &middot; ${H(nlWhen(a.at))}<div class="whitespace-pre-wrap">${H(a.text)}</div></div>`});
 let b='';
 if(!x.sig&&nlSigner()&&p&&ptW(p,'rec'))b+=ic('bg-green-600 text-white','fa-signature',`recSign(${i})`)+'Sign</button>';
 if(x.sig&&p&&ptW(p,'rec'))b+=ic('bg-amber-500 text-white','fa-plus',`recAddendum(${i})`)+'Add addendum</button>';
 f+=b+'</div>';
 return h.replace(/<\/div>\s*$/,f+'</div>')}}
/* the printed record shows who signed it and the addendums */
{const _r=recFullHtml;recFullHtml=function(p,r,blank){let h=_r.apply(this,arguments);if(blank||!r||!r.sig)return h;
 const add=(r.add||[]).map(a=>`<p><b>Addendum</b> (${H(a.by)}, ${H(nlWhen(a.at))}): ${H(a.text)}</p>`).join('');
 return h+`<p class="muted" style="margin-top:10px">Electronically signed by <b>${H(r.sig.by)}</b>${r.sig.lic?' - ID / licence no. '+H(r.sig.lic):''} on ${H(nlWhen(r.sig.at))}.</p>`+add}}

/* Nurse notes are drafts until a doctor, BDS, specialist or dental therapist signs them. A nurse who changes a signed record removes its signature (it needs signing again). */
{const _s=rfSave;rfSave=function(){const p=gp(),a=p&&p.d.rec||[],i=REC?REC.i:-1,n=a.length,r=_s.apply(this,arguments);try{const q=gp(),b=q&&q.d.rec||[],j=i>=0?i:(b.length>n?b.length-1:-1);if(U&&U.role=='nurse'&&U.stype!='therapist'&&j>=0&&b[j]&&!nlLocked(b[j])){b[j].draft=true;b[j].dby=U.name;delete b[j].sig;sv();go('patient')}}catch(e){}return r}}
const nlDrafts=()=>S.patients.reduce((n,p)=>n+((p.doc==(U&&U.name)||(p.spec||[]).includes(U&&U.name))?(p.d.rec||[]).filter(x=>x.draft&&!x.sig).length:0),0);
{const _d=dash;dash=function(){const h=_d.apply(this,arguments);if(!U||U.role!='doctor'||typeof h!='string')return h;const n=nlDrafts();return (n?`<div class="rounded-lg border border-amber-400 bg-amber-50 p-3 mb-3 text-sm"><i class="fa fa-pen-nib mr-1"></i><b>${n}</b> nurse note${n>1?'s':''} on your patients ${n>1?'are':'is'} waiting for your signature. Open the patient's records and tap Sign.</div>`:'')+h}}

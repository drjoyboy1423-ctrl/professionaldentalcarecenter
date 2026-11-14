/* ---------- Who may change a patient file ----------
   Everyone can READ every patient file. Clinical records, orders, invoices and proformas can be
   changed by doctors and (by default) nurses; the administrator can restrict this in System settings.
   Reception keeps appointments and credit; payments are still taken by reception/manager. */
const ptDoc=p=>p&&p.doc?p.doc:'';
function ptW(p,k){p=p||(typeof gp=='function'?gp():null);if(!p||!U)return false;if(U.role=='admin')return true;if(U.role=='doctor'){const mine=(!!p.doc&&p.doc==U.name)||(p.spec||[]).includes(U.name);if(U.stype=='specialist')return mine;return mine||AS.v('acc.anyDoctor')!==false}
 if(U.role=='nurse'){if((p.nurses||[]).includes(U.name))return true;if(k=='inv')return AS.v('acc.nurseInv')!==false;return AS.v('acc.nurseRec')!==false&&!['presc','consent','plan'].includes(k)}if(U.role=='reception'||U.role=='manager')return k=='appt'||k=='cred';return false}
const ptMsg=p=>U&&U.stype=='specialist'?'You can change this patient only after the clinic invites you to this patient (reception, the doctor or the manager does that).':U&&U.role=='nurse'?'You can change this only when the patient is assigned to you by reception or the doctor.':'You do not have permission to change this for this patient.';
function wrapW(n,kf){const o=window[n];if(typeof o!='function')return;window[n]=function(){const p=gp();if(p&&!ptW(p,kf?kf.apply(null,arguments):SK)){alert(ptMsg(p));return}return o.apply(this,arguments)}}
['addI','editI','delI'].forEach(n=>wrapW(n,k=>k));
{const _dI=delI;delI=function(k){if(U&&U.role=='nurse'){alert('Nurses can add and edit, but only a doctor, manager or administrator can delete.');return}return _dI.apply(this,arguments)}}
['recNew','recEdit','recDel','fin','toothAdd','toothDel'].forEach(n=>wrapW(n,()=>'rec'));
wrapW('toInv',()=>'inv');wrapW('sp',()=>'presc');wrapW('svC',()=>'consent');
const _mkI=mkItem;mkItem=function(k,v,p){if(p&&!ptW(p,k)){alert(ptMsg(p));return null}return _mkI.apply(this,arguments)};
const _ptv=patient;patient=function(){const p=gp(),h=_ptv.apply(this,arguments);if(!p||ptW(p,SK))return h;
 const o=h.replace(/<button onclick="fin\(\)"[^>]*>[^<]*<\/button>/,'<b class="ml-2">'+(p.fin?'Yes':'No')+'</b>').replace(/<i [^>]*onclick="(editI|delI|recEdit|recDel|toInv)\([^"]*"[^>]*><\/i>/g,'').replace(/<button[^>]*onclick="(addI|recNew|ordNew|sp|svC)\([^"]*"[^>]*>[\s\S]*?<\/button>/g,'');
 return `<div class="bg-sky-50 border border-sky-300 rounded-lg p-2 text-sm mb-3 w-full"><i class="fa fa-eye mr-1"></i>Read-only. ${H(ptMsg(p))}</div>`+o};

/* ---------- Reception sees a summary of the patient (not the clinical record) ---------- */
RA.length=0;RA.push('sum','appt','inv','cred');
function recSumV(p){const inv=allInv([p]),due=sum(inv,r=>r.bal),paid=sum(inv,r=>r.paid),ap=(p.d.appt||[]).slice().sort((a,b)=>(b.ts||0)-(a.ts||0)),nx=ap.find(x=>(x.ts||0)>=NOW()-864e5),ords=p.d.ord||[],pend=ords.filter(o=>o.st=='pending').length,dn=ords.length-pend,vis=(p.d.rec||[]).length;
 const r=(k,v)=>`<div class="flex justify-between border-b py-2 text-sm"><span class="text-gray-600">${k}</span><b>${v}</b></div>`;
 return `<h3 class="text-lg font-bold mb-1">Patient summary</h3><p class="text-xs text-gray-500 mb-3">Reception sees a summary only. The clinical record is kept for the doctor and nurse.</p>`+
 r('Assigned doctor',H(p.doc||'Not assigned yet'))+r('Status',{new:'New order',doctor:'Seen by doctor',nurse:'Seen by nurse'}[p.st]||H(p.st||''))+r('Finished',p.fin?'Yes':'No')+r('Registered',fdate(p.date))+r('Visits recorded',vis)+r('Next / last appointment',ap.length?H((nx||ap[0]).date||'')+' '+H((nx||ap[0]).time||''):'None')+r('Orders',pend+' waiting, '+dn+' ready')+r('Invoices',inv.length+' ('+ETB(paid)+' paid)')+r('Balance due',`<span class="${due>0?'text-red-600':'text-green-600'}">${ETB(due)}</span>`)}
const _secRc=sec;sec=function(p){return U&&U.role=='reception'&&SK=='sum'?recSumV(p):_secRc.apply(this,arguments)};

/* ---------- Reception acts (takes payment, prints invoices / statements) only AFTER the doctor has placed an order or invoice ---------- */
const rcReady=p=>!!p&&((p.d.ord||[]).length>0||(p.d.inv||[]).length>0);
function rcGate(p,what){if(!U||U.role!='reception')return true;if(rcReady(p))return true;alert('Reception can '+what+' only after the doctor has placed an order or invoice for this patient.');return false}
const _payAt=payAt;payAt=function(pid){return rcGate(S.patients.find(q=>q.id==pid),'take payment')?_payAt.apply(this,arguments):undefined};
const _prItem=printItem;printItem=function(p){return rcGate(p,'print this')?_prItem.apply(this,arguments):undefined};
const _stmt=stmt;stmt=function(){return rcGate(S.patients.find(x=>x.id==PRP),'print the statement')?_stmt.apply(this,arguments):undefined};
const _newInvG=newInvG;newInvG=function(){if(U&&U.role=='reception'){alert('Invoices are created by the assigned doctor. Reception takes payment once the invoice exists.');return}return _newInvG.apply(this,arguments)};
const _rsp=recSummaryPrint;recSummaryPrint=function(){if(U&&U.role=='reception'){alert('The clinical summary is for the doctor and nurse. Reception sees the patient summary only.');return}return _rsp.apply(this,arguments)};

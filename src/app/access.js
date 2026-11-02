/* ---------- Who may change a patient file ----------
   Everyone can READ every patient file. Clinical records, orders, invoices and proformas can be
   changed only by the doctor the patient is assigned to (the administrator can always step in).
   Reception keeps appointments and credit; payments are still taken by reception/manager. */
const ptDoc=p=>p&&p.doc?p.doc:'';
function ptW(p,k){p=p||(typeof gp=='function'?gp():null);if(!p||!U)return false;if(U.role=='admin')return true;if(U.role=='doctor')return !!p.doc&&p.doc==U.name;if(U.role=='reception'||U.role=='manager')return k=='appt'||k=='cred';return false}
const ptMsg=p=>ptDoc(p)?'Only the assigned doctor ('+ptDoc(p)+') can do this for this patient.':'This patient has no doctor yet. Reception must assign a doctor first.';
function wrapW(n,kf){const o=window[n];if(typeof o!='function')return;window[n]=function(){const p=gp();if(p&&!ptW(p,kf?kf.apply(null,arguments):SK)){alert(ptMsg(p));return}return o.apply(this,arguments)}}
['addI','editI','delI'].forEach(n=>wrapW(n,k=>k));
['recNew','recEdit','recDel','fin','toothAdd','toothDel'].forEach(n=>wrapW(n,()=>'rec'));
wrapW('toInv',()=>'inv');wrapW('sp',()=>'presc');wrapW('svC',()=>'consent');
const _mkI=mkItem;mkItem=function(k,v,p){if(p&&!ptW(p,k)){alert(ptMsg(p));return null}return _mkI.apply(this,arguments)};
const _ptv=patient;patient=function(){const p=gp(),h=_ptv.apply(this,arguments);if(!p||ptW(p,SK))return h;
 const o=h.replace(/<button onclick="fin\(\)"[^>]*>[^<]*<\/button>/,'<b class="ml-2">'+(p.fin?'Yes':'No')+'</b>').replace(/<i [^>]*onclick="(editI|delI|recEdit|recDel|toInv)\([^"]*"[^>]*><\/i>/g,'').replace(/<button[^>]*onclick="(addI|recNew|ordNew|sp|svC)\([^"]*"[^>]*>[\s\S]*?<\/button>/g,'');
 return `<div class="bg-sky-50 border border-sky-300 rounded-lg p-2 text-sm mb-3 w-full"><i class="fa fa-eye mr-1"></i>Read-only. ${H(ptMsg(p))}</div>`+o};

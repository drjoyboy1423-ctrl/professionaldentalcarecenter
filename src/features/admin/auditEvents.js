/* ---------- Audit events: prints, exports, sign-in/out, opening a patient file, refunds, deletes, signing ----------
   Added to the Activity Log (the database triggers already record every add / change / delete).
   Rows are written append-only; the server fills in the user, role, clinic and IP address. If the phone is offline
   the events wait on the device and are sent when the internet is back. */
const AUD=(()=>{let q=[],busy=0,loaded=0,lastPid=null,seen={};
 const key=()=>'audq_'+((U&&U.id)||'');
 async function load(){if(loaded||!U)return;loaded=1;try{const s=await IDB.get(key());if(Array.isArray(s)&&s.length)q=s.concat(q)}catch(e){}}
 async function keep(){try{if(q.length)await IDB.set(key(),q);else await IDB.del(key())}catch(e){}}
 async function flush(){if(busy||!U||!q.length||(typeof navigator!='undefined'&&navigator.onLine===false))return;busy=1;
  try{await load();const n=q.length,rows=q.slice(0,n).map(r=>({action:r.action,resource:r.resource,detail:r.detail,user_name:r.user_name,clinic:r.clinic,at:r.at}));
   await DB.auditAdd(rows);q.splice(0,n);await keep()}catch(e){/* try again later */}finally{busy=0}
  if(q.length>=50)setTimeout(flush,2000)}
 function log(action,resource,detail){try{if(!U)return;load();q.push({action:String(action).slice(0,30),resource:resource==null?null:String(resource).slice(0,200),detail:detail||null,user_name:U.name||'',clinic:C&&C.id||U.clinic||null,at:new Date().toISOString()});if(q.length>500)q.shift();keep();setTimeout(flush,400)}catch(e){}}
 /* record that a patient file was opened (not more than once every 10 minutes per patient) */
 function opened(p){if(!p)return;const k=p.id,t=Date.now();if(seen[k]&&t-seen[k]<6e5)return;seen[k]=t;log('READ','patient '+p.name,{pid:String(p.id)})}
 return {log,flush,opened,pending:()=>q.length}})();
window.addEventListener('online',()=>AUD.flush());setInterval(()=>AUD.flush(),60000);

/* sign in / sign out */
{const _l=login;login=async function(){const was=U;const r=await _l.apply(this,arguments);if(U&&!was)AUD.log('LOGIN');return r}}
{const _o=logout;logout=async function(){if(U&&!LOUT){AUD.log('LOGOUT');try{await Promise.race([AUD.flush(),new Promise(r=>setTimeout(r,1500))])}catch(e){}}return _o.apply(this,arguments)}}
/* opening a patient file = READ */
{const _g=go;go=function(v){const r=_g.apply(this,arguments);try{if(V=='patient'){const p=gp();if(p&&U&&U.role!='admin')AUD.opened(p)}}catch(e){}return r}}
/* printing */
{const _p=printHtml;printHtml=function(title){try{const p=typeof gp=='function'?gp():null;AUD.log('PRINT',title,p&&V=='patient'?{pid:String(p.id)}:null)}catch(e){}return _p.apply(this,arguments)}}
/* exporting */
{const _j=dlJson;dlJson=function(name){AUD.log('EXPORT',name,{kind:'json'});return _j.apply(this,arguments)}}
{const _c=csvDl;csvDl=function(name){AUD.log('EXPORT',name,{kind:'csv'});return _c.apply(this,arguments)}}

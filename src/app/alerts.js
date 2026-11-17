/* ---------- Bell alerts for things that are not patients: announcements, staff chat (every room, including the lab specialty rooms
   and Equipment & purchases), lab messages, urgent equipment faults and regular checks that are due.
   Checked every 30 seconds while the app is open and signed in. On the first check on a device nothing is announced (so old items
   do not flood the bell). Uses the same bell, badge and phone alert as the patient notifications (notify.js). ---------- */
const NXK=()=>'nf:x:'+(U&&U.id||U&&U.username||'u')+':'+(C&&C.id||'');
const nxLoad=()=>{try{return JSON.parse(localStorage.getItem(NXK())||'null')}catch(e){return null}};
const nxSave=s=>{try{localStorage.setItem(NXK(),JSON.stringify(s))}catch(e){}};
const NX_ROOM=r=>{const x=typeof CH_ROOMS!='undefined'&&CH_ROOMS.find(q=>q[0]==r);return x?x[1].replace(/^# /,''):r};
let NX={t:0,busy:0};
function nfPush(items){if(!items.length||!U||!C)return;const st=nfLoad();if(!st)return;
 const list=items.map(a=>({...a,r:0,ts:Date.now()})).concat(st.list||[]).slice(0,50);nfSave({...st,list});nfBadge();
 toast(items.length==1?items[0].t+': '+items[0].m:items.length+' new notifications');
 try{if(window.Notification&&Notification.permission=='granted'&&document.hidden)new Notification(items[0].t,{body:items[0].m})}catch(e){}}
async function nxCheck(){if(!U||!C||NX.busy||!navigator.onLine)return;NX.busy=1;
 try{const first=!nxLoad(),st=nxLoad()||{since:new Date().toISOString(),seen:{}},seen=st.seen||{},add=[],mark=k=>{if(seen[k])return false;seen[k]=1;return true},role=U.role;let since=st.since;
  /* announcements */
  try{const [l,r]=await Promise.all([DB.bcList(),DB.bcReads()]);if(typeof BC!='undefined'){const had=BC.l&&BC.l.length;BC.l=l;BC.r=r;if(had&&V=='dash')go('dash')}
   l.filter(b=>(b.clinic==C.id||role=='admin')&&b.from_id!=U.id).forEach(b=>{const k='bc:'+b.id;if(mark(k)&&!first&&!(BC.r||[]).some(x=>x.broadcast_id==b.id&&x.user_id==U.id))add.push({t:b.urgent?'Urgent announcement':'New announcement',m:b.title,pg:'bc'})})}catch(e){}
  /* chat: one item per room */
  try{const m=await DB.chatRecent(since),by={};m.forEach(x=>{if(x.created_at>since)since=x.created_at;if(x.from_id==U.id)return;if(V=='chat'&&typeof CH!='undefined'&&CH.room==x.room&&!document.hidden)return;(by[x.room]=by[x.room]||[]).push(x)});
   if(!first)Object.keys(by).forEach(r=>{const a=by[r];add.push({t:'New chat message',m:NX_ROOM(r)+': '+(a.length==1?(a[0].from_name||'Someone')+' wrote':a.length+' new messages'),pg:'chat',room:r})})}catch(e){}
  /* lab messages (doctor, manager) - lab staff are told through the lab chat rooms */
  if(role=='doctor'||role=='manager'||role=='admin'){try{const m=await DB.labMsgsRecent(st.lsince||since),mine=m.filter(x=>x.from_id!=U.id);let ls=st.lsince||since;m.forEach(x=>{if(x.created_at>ls)ls=x.created_at});st.lsince=ls;
   if(!first&&mine.length){const inv=mine.filter(x=>x.kind=='invoice').length;add.push({t:inv?'Lab invoice / message':'Lab message',m:mine.length==1?(mine[0].from_name||'The lab')+' wrote to you':mine.length+' new lab messages',pg:'labmsg'})}}catch(e){}}
  else st.lsince=since;
  /* equipment: urgent faults and regular checks due (manager, biomedical staff) */
  if(role=='manager'||role=='admin'||(role=='support'&&U.stype=='biomed')){try{const l=await DB.mtList(),today=isoD(Date.now()),soon=isoD(Date.now()+3*864e5);
   l.filter(x=>x.status!='DONE').forEach(x=>{if(x.kind=='fault'&&x.priority=='URGENT'&&mark('mt:'+x.id)&&!first&&x.created_name!=U.name)add.push({t:'Urgent equipment fault',m:x.equipment+' - '+x.title,pg:'chairs'});
    if(x.due&&x.due<=soon&&mark('due:'+x.id+':'+x.due+':'+today)&&!first)add.push({t:x.due<today?'Check overdue':'Check due soon',m:x.equipment+' - '+x.title+' (due '+x.due+')',pg:'chairs'})})}catch(e){}}
  /* new job applications (manager) */
  if(role=='manager'||role=='admin'){try{(await DB.jobList()).filter(x=>x.clinic==C.id&&x.status=='new').forEach(x=>{if(mark('job:'+x.id)&&!first)add.push({t:'New job application',m:x.name+(x.position?' - '+x.position:''),pg:'jobs'})})}catch(e){}}
  Object.keys(seen).slice(0,-400).forEach(k=>delete seen[k]);
  nxSave({since,lsince:st.lsince,seen});nfPush(add)}
 catch(e){}finally{NX.busy=0}}
function nxStart(){clearInterval(NX.t);if(!U)return;NX.t=setInterval(()=>{if(!U){clearInterval(NX.t);return}if(!document.hidden)nxCheck()},30000);setTimeout(nxCheck,2500)}
window.addEventListener('online',()=>setTimeout(nxCheck,500));document.addEventListener('visibilitychange',()=>{if(!document.hidden)nxCheck()});
{const _a=applyData;applyData=function(){const r=_a.apply(this,arguments);if(U&&!NX.t)nxStart();return r}}
{const _lo=logout;logout=function(){clearInterval(NX.t);NX.t=0;return _lo.apply(this,arguments)}}

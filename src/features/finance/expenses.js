/* ---------- Finance: staff fees/salaries, clinic expenses, monthly profit (manager/admin only) ---------- */
const EXPCAT=['Rent','Utilities','Supplies & materials','Lab fees','Equipment','Maintenance','Marketing','Transport','Other'];
const monthKey=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')};
const monthLabel=k=>{const [y,m]=k.split('-').map(Number);return new Date(y,m-1,1).toLocaleDateString('en-US',{month:'long',year:'numeric'})};
function finRevenue(mk){let tot=0;allInv().forEach(r=>payEvents(r).forEach(ev=>{if(monthKey(ev.ts)==mk)tot+=ev.amt}));return tot}
function finAddSal(){form('Add Employee Fee / Salary',[['name','Employee name'],['role','Role','sel',['Doctor','Nurse','Reception','Manager','Admin','Other']],['amount','Amount (ETB)','number'],['date','Date','date'],['note','Note']],{date:isoD(Date.now())},v=>{
 if(!v.name||!(+v.amount>0))return bad('Enter the employee name and an amount greater than 0.');S.fin.sal.push({id:Date.now(),...v,amount:+v.amount,by:U.name,ts:Date.now()});sv();go('fin')})}
function finEditSal(id){const x=S.fin.sal.find(r=>r.id==id);if(!x)return;form('Edit Fee / Salary',[['name','Employee name'],['role','Role','sel',['Doctor','Nurse','Reception','Manager','Admin','Other']],['amount','Amount (ETB)','number'],['date','Date','date'],['note','Note']],x,v=>{
 if(!v.name||!(+v.amount>0))return bad('Enter the employee name and an amount greater than 0.');Object.assign(x,v,{amount:+v.amount});sv();go('fin')})}
function finDelSal(id){if(!confirm('Delete this record?'))return;S.fin.sal=S.fin.sal.filter(r=>r.id!=id);sv();go('fin')}
function finAddExp(){form('Add Clinic Expense',[['item','Expense','sel',EXPCAT],['desc','Description'],['amount','Amount (ETB)','number'],['date','Date','date'],['note','Note']],{item:EXPCAT[0],date:isoD(Date.now())},v=>{
 if(!(+v.amount>0))return bad('Enter an amount greater than 0.');S.fin.exp.push({id:Date.now(),...v,amount:+v.amount,by:U.name,ts:Date.now()});sv();go('fin')})}
function finEditExp(id){const x=S.fin.exp.find(r=>r.id==id);if(!x)return;form('Edit Expense',[['item','Expense','sel',EXPCAT],['desc','Description'],['amount','Amount (ETB)','number'],['date','Date','date'],['note','Note']],x,v=>{
 if(!(+v.amount>0))return bad('Enter an amount greater than 0.');Object.assign(x,v,{amount:+v.amount});sv();go('fin')})}
function finDelExp(id){if(!confirm('Delete this record?'))return;S.fin.exp=S.fin.exp.filter(r=>r.id!=id);sv();go('fin')}
function finPrintSal(){printHtml('Employee Fees & Salaries - '+C.name,docHead('Employee Fees & Salaries','Printed '+fd(Date.now()))+tbl2(['Date','Name','Role','Amount','Note'],S.fin.sal.slice().sort((a,b)=>b.ts-a.ts).map(x=>[fd(x.ts),H(x.name),H(x.role),ETB(x.amount),H(x.note||'')]),['','','Total',ETB(sum(S.fin.sal,x=>x.amount)),''],[3]))}
function finPrintExp(){printHtml('Clinic Expenses - '+C.name,docHead('Clinic Expenses','Printed '+fd(Date.now()))+tbl2(['Date','Expense','Description','Amount','Note'],S.fin.exp.slice().sort((a,b)=>b.ts-a.ts).map(x=>[fd(x.ts),H(x.item),H(x.desc||''),ETB(x.amount),H(x.note||'')]),['','','Total',ETB(sum(S.fin.exp,x=>x.amount)),''],[3]))}
function finPrintReport(mk){mk=mk||FM;const rev=finRevenue(mk),sal=S.fin.sal.filter(x=>monthKey(x.ts)==mk),exp=S.fin.exp.filter(x=>monthKey(x.ts)==mk),salT=sum(sal,x=>x.amount),expT=sum(exp,x=>x.amount),profit=rev-salT-expT;
 printHtml('Monthly Report - '+monthLabel(mk),docHead('Monthly Report',monthLabel(mk))+
  tbl2(['','Amount'],[['Revenue (payments received)',ETB(rev)],['Employee fees & salaries',ETB(salT)],['Clinic expenses',ETB(expT)]],['','']) +
  `<h2>${profit>=0?'Net Profit':'Net Loss'}: ${ETB(Math.abs(profit))}</h2>`+
  (sal.length?`<h2>Employee Fees & Salaries</h2>`+tbl2(['Date','Name','Role','Amount'],sal.map(x=>[fd(x.ts),H(x.name),H(x.role),ETB(x.amount)]),['','','Total',ETB(salT)],[3]):'')+
  (exp.length?`<h2>Clinic Expenses</h2>`+tbl2(['Date','Expense','Description','Amount'],exp.map(x=>[fd(x.ts),H(x.item),H(x.desc||''),ETB(x.amount)]),['','','Total',ETB(expT)],[3]):''))}

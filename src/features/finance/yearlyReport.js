let FY=new Date().getFullYear(),FYD=null;
const FAPI=/vercel\.app$/.test(location.hostname)?'':'https://dentalclincrecord.vercel.app';
async function finYear(csvOut){const box=$('finyr');if(!box)return;box.innerHTML='<p class="text-sm text-gray-500">Loading...</p>';
 try{const t=await DB.token();if(!t)throw new Error('Please sign in again.');
  const r=await fetch(FAPI+'/api/finance?year='+FY+(csvOut?'&format=csv':'')+(U.role=='admin'?'&clinic='+encodeURIComponent(C.id):''),{headers:{Authorization:'Bearer '+t}});
  if(r.status==404)throw new Error('The yearly server report is only available on the Vercel version of this app.');
  if(csvOut){if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||'Could not export.');const a=document.createElement('a');a.href=URL.createObjectURL(await r.blob());a.download='finance-'+FY+'.csv';document.body.appendChild(a);a.click();a.remove();box.innerHTML='';return}
  const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not load the report.');FYD=d;finYearShow()}
 catch(e){box.innerHTML='<p class="text-sm text-red-600">'+H(e.message||'Could not load the report.')+'</p>'}}
const finYearRows=d=>d.months.filter(m=>m.revenue||m.salaries||m.expenses||m.billed).map(m=>[monthLabel(m.month),ETB(m.billed),ETB(m.revenue),ETB(m.salaries),ETB(m.expenses),ETB(m.profit)]);
const finYearHtml=d=>{const rows=finYearRows(d),T=d.totals,mt=['Cash','Telebirr','CBE Birr','CBE (bank)','eBirr','Other bank','Card'].map(k=>[k,d.months.reduce((z,m)=>z+(m.byMethod[k]||0),0)]).filter(x=>x[1]);
 return `<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">${tile('Billed',ETB(T.billed))}${tile('Received',ETB(T.revenue))}${tile('Fees, salaries &amp; expenses',ETB(T.salaries+T.expenses))}${tile(T.profit>=0?'Net profit':'Net loss',ETB(Math.abs(T.profit)))}</div>
 <div>${rows.map(r=>`<div class="border rounded-lg p-3 mb-2 text-sm"><div class="font-bold mb-1">${H(r[0])}</div><div class="grid grid-cols-2 gap-x-3 gap-y-1"><span>Billed</span><b class="text-right">${r[1]}</b><span>Received</span><b class="text-right">${r[2]}</b><span>Salaries</span><b class="text-right">${r[3]}</b><span>Expenses</span><b class="text-right">${r[4]}</b><span>Profit</span><b class="text-right">${r[5]}</b></div></div>`).join('')||'<p class="p-2 text-gray-500 text-sm">No activity in '+d.year+'.</p>'}</div>
 ${mt.length?`<p class="text-xs text-gray-600 mt-3"><b>Received by method:</b> ${mt.map(x=>H(x[0])+' '+ETB(x[1])).join(' &middot; ')}</p>`:''}`};
function finYearShow(){if(FYD)$('finyr').innerHTML=finYearHtml(FYD)}
function finYearPrint(){const d=FYD;if(!d)return alert('Load the report first.');const T=d.totals;printHtml('Yearly Report '+d.year,docHead('Yearly Financial Report',String(d.year))+tbl2(['Month','Billed','Received','Salaries & fees','Expenses','Profit'],finYearRows(d),['Total',ETB(T.billed),ETB(T.revenue),ETB(T.salaries),ETB(T.expenses),ETB(T.profit)],[1,2,3,4,5]))}
function finYearSet(v){FY=+v;FYD=null;go('fin')}

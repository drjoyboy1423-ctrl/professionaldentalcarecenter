/* ---------- Watermark on printed prescriptions and clinical summaries ----------
   Every printed prescription and record summary ends with the provider's name and licence / ID number and the
   time it was printed (and by whom). The ID is saved on the prescription when it is written. */
const pmStamp=(who,lic,when)=>`<div style="margin-top:14px;padding-top:6px;border-top:1px solid #999;font-size:11px;color:#444">Provider: <b>${H(who||'')}</b>${lic?' &middot; ID / licence no. <b>'+H(lic)+'</b>':''} &middot; Printed ${H(fdate(Date.now())+' '+ft(Date.now()))} by ${H(U?U.name:'')}</div>`;
{const _sp=sp;sp=function(){const p=gp(),n=p&&(p.d.presc||[]).length;const r=_sp.apply(this,arguments);try{const a=p&&p.d.presc;if(a&&a.length>n&&U&&U.idcode)a[a.length-1].lic=U.idcode}catch(e){}return r}}
{const _p=prescHtml;prescHtml=function(p,x){const h=_p.apply(this,arguments);if(!x||!x.by)return h;return h+pmStamp(x.by,x.lic||(x.by==(U&&U.name)?U.idcode:''))}}
{const _s=recSummaryHtml;recSummaryHtml=function(p){const h=_s.apply(this,arguments);const r=(p.d.rec||[]).filter(x=>x.sig).sort((a,b)=>b.sig.at-a.sig.at)[0];return h+(r?pmStamp(r.sig.by,r.sig.lic):pmStamp(p.doc||'',p.doc==(U&&U.name)?U.idcode:''))}}

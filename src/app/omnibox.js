/* ---------- Quick search and keyboard shortcuts ----------
   Ctrl+K / Cmd+K  search patients (name, phone, card no.) and jump to any page
   Alt+N or Ctrl+N new patient (reception)      Ctrl+Shift+A today's appointments
   Up / Down move in the list, Enter opens, Esc closes any window */
let OB={q:'',i:0,L:[]};
function obItems(){const q=OB.q.trim().toLowerCase(),L=[];if(!U)return L;
 if(!q){(typeof navList=='function'?navList():[]).slice(0,8).forEach(n=>L.push({t:'page',a:n[0],l:n[1],ic:n[2]}));return L}
 const dg=q.replace(/\D/g,'');
 S.patients.filter(p=>(p.name||'').toLowerCase().includes(q)||(String(p.card||'')==q)||(dg.length>=3&&String(p.phone||'').replace(/\D/g,'').includes(dg))).slice(0,8).forEach(p=>L.push({t:'pt',a:p.id,l:p.name,s:'Card '+(p.card||'-')+(p.phone?' · '+p.phone:''),ic:'fa-user'}));
 (typeof navList=='function'?navList():[]).filter(n=>n[1].toLowerCase().includes(q)).slice(0,6).forEach(n=>L.push({t:'page',a:n[0],l:n[1],s:'Go to page',ic:n[2]}));
 return L}
function obPaint(){const e=document.getElementById('ob_l');if(!e)return;OB.L=obItems();if(OB.i>=OB.L.length)OB.i=Math.max(0,OB.L.length-1);
 e.innerHTML=OB.L.length?OB.L.map((x,i)=>`<div class="flex items-center gap-3 px-3 py-2 rounded cursor-pointer ${i==OB.i?'bg-sky-100':''}" onmouseenter="OB.i=${i};obPaint()" onclick="obGo(${i})"><i class="fa ${x.ic||'fa-circle'} w-5 text-center text-gray-500"></i><div class="min-w-0"><div class="truncate">${H(x.l)}</div>${x.s?`<div class="text-xs text-gray-500 truncate">${H(x.s)}</div>`:''}</div></div>`).join(''):'<p class="text-gray-500 text-sm p-3">Nothing found.</p>'}
function obGo(i){const x=OB.L[i];if(!x)return;cl();if(x.t=='pt')go('patient',x.a);else go(x.a)}
function obOpen(){if(!U||document.getElementById('ob_q'))return;OB={q:'',i:0,L:[]};$('mb').innerHTML=`<div class="font-bold mb-2"><i class="fa fa-magnifying-glass mr-2"></i>Search</div><input id="ob_q" class="inp mb-2" placeholder="Patient name, phone, card number, or a page..." autocomplete="off" oninput="OB.q=this.value;OB.i=0;obPaint()"><div id="ob_l" style="max-height:50vh;overflow:auto"></div><div class="text-xs text-gray-400 mt-2">Up / Down to move, Enter to open, Esc to close</div>`;md.classList.replace('hidden','flex');obPaint();setTimeout(()=>{const q=document.getElementById('ob_q');if(q)q.focus()},30)}
document.addEventListener('keydown',e=>{if(!U)return;const k=(e.key||'').toLowerCase(),mod=e.ctrlKey||e.metaKey;
 if(mod&&!e.shiftKey&&k=='k'){e.preventDefault();obOpen();return}
 if(k=='escape'&&!md.classList.contains('hidden')){cl();return}
 if(document.getElementById('ob_q')&&!md.classList.contains('hidden')){if(k=='arrowdown'){e.preventDefault();OB.i=Math.min(OB.L.length-1,OB.i+1);obPaint()}else if(k=='arrowup'){e.preventDefault();OB.i=Math.max(0,OB.i-1);obPaint()}else if(k=='enter'){e.preventDefault();obGo(OB.i)}return}
 const t=e.target&&e.target.tagName,typing=t=='INPUT'||t=='TEXTAREA'||t=='SELECT';
 if(mod&&e.shiftKey&&k=='a'){e.preventDefault();if((RN[U.role]||[]).includes('appt'))go('appt');return}
 if((mod||e.altKey)&&!e.shiftKey&&k=='n'&&!typing&&U.role=='reception'){e.preventDefault();newPat()}
});

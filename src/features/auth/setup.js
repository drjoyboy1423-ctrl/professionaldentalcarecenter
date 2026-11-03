/* ---------- First-run setup: a brand-new clinic database has no users yet, so the owner creates the clinic and the administrator account here ---------- */
function setupShow(){const ov=$('boot');ov.style.display='flex';ov.style.background='var(--cl,#e0f2fe)';ov.style.overflow='auto';
 ov.innerHTML=`<div class="bg-white rounded-2xl shadow-xl p-6 w-full" style="max-width:26rem;margin:1rem"><h2 class="text-xl font-bold mb-1">Welcome</h2><p class="text-sm text-gray-600 mb-4">Set up your clinic. You will be the owner and administrator. Nobody else has access to your data.</p>
 <label class="text-sm font-medium">Clinic name</label><input id="su_c" class="inp mb-3" placeholder="e.g. Sunrise Dental Clinic">
 <label class="text-sm font-medium">Your full name</label><input id="su_n" class="inp mb-3">
 <label class="text-sm font-medium">Clinic phone (optional)</label><input id="su_ph" class="inp mb-3" inputmode="tel">
 <label class="text-sm font-medium">Choose a username</label><input id="su_u" class="inp mb-3" autocapitalize="none" placeholder="e.g. owner">
 <label class="text-sm font-medium">Choose a password (8+ characters)</label><input id="su_p" type="password" class="inp mb-3">
 <div id="su_e" class="text-sm text-red-600 mb-2"></div>
 <button id="su_b" onclick="setupGo()" class="lg w-full text-white font-semibold py-3 rounded-xl">Create my clinic</button></div>`}
async function setupGo(){const e=$('su_e'),b=$('su_b'),v=id=>($(id).value||'').trim();e.textContent='';
 if(v('su_c').length<2||!v('su_n')||!v('su_u')||$('su_p').value.length<8){e.textContent='Fill in every field. The password needs 8 or more characters.';return}
 b.disabled=true;b.textContent='Creating...';
 try{await DB.setupOwner({clinic:v('su_c'),name:v('su_n'),phone:v('su_ph'),username:v('su_u'),password:$('su_p').value});await DB.signIn(v('su_u'),$('su_p').value,'__hq');location.reload()}
 catch(x){e.textContent=x.message||'Setup failed.';b.disabled=false;b.textContent='Create my clinic'}}

/* ---------- Assign a patient to a nurse / dental therapist (to do work such as scaling, impressions, retainers) or invite a visiting specialist ----------
   Reception assigns the doctor; reception or the doctor adds nurses, therapists, other doctors or visiting specialists. Assigned staff can edit that patient's file by role. */
const canAssign=()=>!!U&&(['reception','manager','admin'].includes(U.role)||(U.role=='doctor'&&U.stype!='specialist'));
async function assignStaff(pid){if(!canAssign())return;const p=S.patients.find(x=>x.id==pid);if(!p)return;if(U.role=='doctor'&&!ptW(p))return alert('Only a doctor this patient is assigned to can add staff to the patient.');let L=[];try{L=await DB.staff(C.id)}catch(e){return alert('Could not load the staff list. Check the internet and try again.')}
 const nm=L.filter(x=>x.role=='nurse'),sp=L.filter(x=>x.role=='doctor'&&x.name!=p.doc),lab=x=>x.name+(x.stype=='therapist'?' (dental therapist)':x.role=='nurse'?' (nurse)':'');
 if(!nm.length&&!sp.length)return alert('No nurses, dental therapists or other doctors found. Add them in Users first.');
 const N=['(no change)','(remove all)',...nm.map(lab)],P=['(no change)','(remove all)',...sp.map(x=>x.name)];
 form('Assign staff - '+p.name+((p.nurses||[]).length||(p.spec||[]).length?'  (now: '+[...(p.nurses||[]),...(p.spec||[])].join(', ')+')':''),[['n','Add a nurse / dental therapist to work on this patient','sel',N],['s','Add another doctor / BDS / visiting specialist for this patient','sel',P]],{n:'(no change)',s:'(no change)'},v=>{
  p.nurses=p.nurses||[];p.spec=p.spec||[];
  if(v.n=='(remove all)')p.nurses=[];else if(v.n!='(no change)'){const x=nm.find(y=>lab(y)==v.n);if(x&&!p.nurses.includes(x.name))p.nurses.push(x.name)}
  if(v.s=='(remove all)')p.spec=[];else if(v.s!='(no change)'&&!p.spec.includes(v.s))p.spec.push(v.s);
  sv();go(V)})}

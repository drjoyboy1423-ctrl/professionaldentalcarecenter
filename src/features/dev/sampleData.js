/* ---------- sample data ---------- */
function seedPatients(start){let sd=11;const R=()=>(sd=sd*16807%2147483647)/2147483647,pk=a=>a[Math.floor(R()*a.length)],t=NOW(),t0=sod(t),base=t,out=[];
 const N=[['Abebe Kebede','Male',34],['Tigist Alemu','Female',28],['Dawit Haile','Male',41],['Selamawit Tesfaye','Female',36],['Mulugeta Bekele','Male',52],['Hanna Girma','Female',19],['Yonas Assefa','Male',25],['Meron Tadesse','Female',31],['Biruk Solomon','Male',9],['Rahel Desta','Female',45],['Kidus Negash','Male',29],['Saron Mekonnen','Female',23],['Fikru Wolde','Male',61],['Liya Abera','Female',15],['Henok Getachew','Male',38],['Bethlehem Yilma','Female',33]];
 const docs=['Dr. Ebsa Tofik Abdulkariim'],lbs=['Addis Dental Lab','Smile Ceramics Lab'];
 N.forEach((n,k)=>{const reg=t-Math.floor(R()*75)*DAY-Math.floor(R()*8)*36e5,arr=k<5?Math.max(t0+k*6e4,t-(k+1)*2700000):reg,p={id:base+k,card:(start||1)+k,name:n[0],sex:n[1],age:n[2],phone:'+2519'+String(10000000+Math.floor(R()*89999999)),dob:String(new Date().getFullYear()-n[2]),branch:C.name,doc:docs[0],doctor:docs[0],date:Math.min(reg,arr),arr,st:k<5?['new','doctor','nurse','new','doctor'][k]:'doctor',fin:k>=5&&R()<.6,d:{},demo:true};
  p.cardNo=p.card;const D=p.d,dt=x=>isoD(x),pm=()=>{const m=pk(['Cash','Cash','Telebirr','CBE Birr','eBirr','CBE (bank)']);return {method:m,ref:m=='Cash'?'':m.replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase()+String(1e9+Math.floor(R()*9e8)).slice(1)}};
  D.rec=[{tooth:String(1+Math.floor(R()*32)),finding:pk(DIS),treat:pk(PRO)[0],note:'',date:dt(p.date),by:docs[0],ts:p.date}];
  const ni=1+Math.floor(R()*3);D.inv=[];for(let j=0;j<ni;j++){const pro=pk(PRO),qty=pro[0]=='Extraction'?1+Math.floor(R()*2):1,disc=R()<.25?100:0,total=pro[1]*qty-disc,ts=Math.min(t-6e4,p.date+R()*(t-p.date)),m=R(),paid=m<.5?total:m<.8?Math.round(total*(.4+R()*.2)/10)*10:0,pays=[];
   if(paid>0){if(paid==total&&total>1500&&R()<.4){const a=Math.round(total/2);pays.push({ts,amt:a,by:'Reception',method:'Cash'},{ts:Math.min(t,ts+2*DAY),amt:total-a,by:'Reception',method:pk(['Cash','Mobile money'])})}else pays.push({ts,amt:paid,by:'Reception',method:pk(['Cash','Mobile money','Bank transfer'])})}
   pays.forEach(y=>Object.assign(y,pm()));D.inv.push({item:pro[0],desc:'',price:pro[1],qty,disc,paid,pays,date:dt(ts),ts,by:'Reception'})}
  if(R()<.45){const pro=pk(PRO);D.prof=[{item:pro[0],desc:'Estimate',price:pro[1],qty:1,disc:0,date:dt(p.date),ts:p.date,by:'Reception'}]}
  D.appt=[];if(k%2==0||k==3){const off=k==2||k==3?0:1+Math.floor(R()*9);D.appt.push({date:isoD(t0+off*DAY+12*36e5),time:pk(['09:00','10:30','14:00','15:30','16:45']),note:pk(['Follow-up check','Scaling session','Root canal visit 2','Crown fitting','Extraction review']),date0:1,ts:t})}
  if(k%5==1)D.appt.push({date:isoD(t0-(3+k)*DAY),time:'11:00',note:'Initial consultation',ts:t});
  if(k%4==1)D.lab=[{req:pk(['Zirconia crown','Partial denture','Night guard']),lab:pk(lbs),done:k%8==1?'Yes':'No',date:dt(p.date),by:docs[0],ts:p.date}];
  if(k==3||k==10)D.cred=[{amt:500,note:'Advance payment',date:dt(p.date),by:'Reception',ts:p.date}];
  if(k%5==0)D.note=[{title:'Allergy check',note:'Confirmed no known drug allergies.',date:dt(p.date),by:docs[0],ts:p.date}];
  D.appt.forEach(a=>delete a.date0);out.push(p)});return out}
function addDemo(){if(!canAdd())return alert('Only Reception and Manager can add records.');S.patients.push(...seedPatients(nextCard()));ensureInvNos();sv();go('rpr')}
function rmDemo(){const n=S.patients.filter(p=>p.demo).length;if(n&&confirm('Remove '+n+' sample patients and all their records?')){S.patients=S.patients.filter(p=>!p.demo);sv();go('rpr')}}

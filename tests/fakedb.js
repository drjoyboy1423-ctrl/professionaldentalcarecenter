const DB=(()=>{
 const J=o=>JSON.parse(JSON.stringify(o));
 const st=JSON.parse(localStorage.getItem('__fake')||'null')||{clinics:[{id:'kal',name:'KAL SPACIALITY DENTAL CLINIC',type:'private',color:'#dc2626',icon:'tooth',logo:null}],
  users:[{id:'u-admin',username:'admin',pw:'Admin123!',role:'admin',clinic:'all',name:'System Admin',phone:'',branch:'All clinics',email:''},
         {id:'u-rec',username:'rec1',pw:'secret1',role:'reception',clinic:'kal',name:'Rec One',phone:'',branch:'KAL',email:''},
         {id:'u-doc',username:'doc1',pw:'secret1',role:'doctor',clinic:'kal',name:'Dr One',phone:'',branch:'KAL',email:''}],
  patients:{},lists:{},sess:null,log:[]};
 const save=()=>localStorage.setItem('__fake',JSON.stringify(st));
 const me=()=>st.users.find(u=>u.id==st.sess);
 const pub=u=>{const {pw,...r}=u;return J(r)};
 const need=()=>{if(!me())throw new Error('Not signed in')};
 return {
  async init(){}, async clinics(){return J(st.clinics)},
  async profile(){return me()?pub(me()):null},
  async signIn(u,p){const x=st.users.find(y=>y.username==String(u).trim().toLowerCase()&&y.pw==p);if(!x)throw new Error('Invalid username or password.');st.sess=x.id;save();return pub(x)},
  async token(){return "tok"},
  async signOut(){st.sess=null;save()},
  async loadClinicData(c){need();const l=st.lists[c]||{};return {patients:J(Object.values(st.patients[c]||{})),dis:l.dis?J(l.dis):null,proc:l.proc?J(l.proc):null}},
  async savePatients(c,ins,upd,del){need();const r=me().role;st.log.push(['save',ins.length,upd.length,del.length]);
   if(ins.length&&!['reception','manager'].includes(r))throw new Error('new row violates row-level security policy for table "patients"');
   st.patients[c]=st.patients[c]||{};ins.concat(upd).forEach(p=>st.patients[c][p.id]=J(p));del.forEach(k=>delete st.patients[c][k]);save()},
  async saveList(c,k,d){need();st.lists[c]=st.lists[c]||{};st.lists[c][k]=J(d);save()},
  async saveClinic(c){need();if(me().role!='admin')throw new Error('row-level security');const i=st.clinics.findIndex(x=>x.id==c.id);if(i<0)st.clinics.push(J(c));else st.clinics[i]=J(c);save()},
  async deleteClinic(id){st.clinics=st.clinics.filter(c=>c.id!=id);delete st.patients[id];save()},
  async users(){need();return st.users.filter(u=>me().role=='admin'||u.clinic==me().clinic).map(pub)},
  async fn(a,p){need();
   if(a=='create'){if(st.users.some(u=>u.username==p.username))throw new Error('Username already exists.');st.users.push({id:'u'+Math.random(),pw:p.password,username:p.username,role:p.role,clinic:p.role=='admin'?'all':p.clinic,name:p.name,phone:p.phone||'',email:p.email||'',branch:p.clinic});save();return {ok:true}}
   if(a=='update'){const u=st.users.find(x=>x.id==p.id);Object.assign(u,{name:p.name,username:p.username,role:p.role,phone:p.phone,title:p.title});if(p.password)u.pw=p.password;if(p.clinic)u.clinic=p.clinic;save();return {ok:true}}
   if(a=='reset'){st.users.find(x=>x.id==p.id).pw='TempPw-1234';save();return {ok:true,password:'TempPw-1234'}}
   if(a=='delete'){st.users=st.users.filter(x=>x.id!=p.id);save();return {ok:true}}
   if(a=='purge_clinic'){st.users=st.users.filter(x=>x.clinic!=p.clinic);save();return {ok:true}}},
  async updateProfile(id,f){const u=st.users.find(x=>x.id==id);Object.assign(u,f);save()},
  async changePassword(un,o,n){const u=st.users.find(x=>x.username==un);if(u.pw!=o)throw new Error('Current password is wrong.');u.pw=n;save()},
  _st:st
 }})();

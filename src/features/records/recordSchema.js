/* ---------- Comprehensive Dental Record: form definition (one source for the screen form, the print and the blank form) ----------
   Field kinds:  text | area | date | radio | multi | yn (No / Yes + details) | cond (tick box that opens sub-fields) | rows (repeatable table) | chart (FDI tooth chart)
   An option called "Other" gets its own text box (stored as <key>_other). */
const rT=(k,l)=>({t:'text',k,l}),rA=(k,l)=>({t:'area',k,l}),rD=(k,l)=>({t:'date',k,l}),rR=(k,l,o)=>({t:'radio',k,l,o}),rM=(k,l,o)=>({t:'multi',k,l,o}),rY=(k,l)=>({t:'yn',k,l}),
 rC=(k,l,subs)=>({t:'cond',k,l,subs:(subs||[]).map(s=>({...s,k:k+'_'+s.k}))}),rG=(l,fs)=>({t:'grp',l,fs}),rH=l=>({t:'h',l});
const RF_DEN=['Fillings','RCT','Extraction','Crown/Bridge','Denture','Ortho','Implant'];
const RF_STAT=['','H','C','F','Cr','RCT','I','M'];
const RF_LEG='H = Healthy · C = Caries · F = Filled · Cr = Crown · RCT = Root canal · I = Implant · M = Missing';
const FDI_U=[18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28],FDI_L=[48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

const RSEC=[
{id:'s1',n:'1',t:'CHIEF COMPLAINT & GENERAL HISTORY',fs:[
 rA('complaint','Complaint'),rT('duration','Duration'),rR('severity','Severity',['Mild','Moderate','Severe']),rT('location','Location'),
 rM('character','Character',['Throbbing','Sharp','Dull','Burning']),rT('aggr','Aggravating'),rT('reliev','Relieving'),
 rM('assoc','Associated',['Swelling','Fever','Bleeding','Limited opening']),
 rM('dhx','Dental Hx',['Fillings','RCT','Crowns','Extractions','Ortho','Implants']),rD('lastvisit','Last visit')]},
{id:'s1a',n:'1A',t:'PREVIOUS TREATMENTS / SURGERIES (Dental & Medical)',fs:[
 rM('prev','Previous treatments / surgeries',['None','Previous dental treatment','Previous dental surgery','Previous medical surgery','Previous hospitalization','Previous general anesthesia','Previous blood transfusion','Previous implant surgery','Previous orthodontic treatment','Previous orthognathic surgery','Previous periodontal surgery','Previous oral/maxillofacial surgery','Previous trauma surgery','Previous biopsy','Other']),
 rM('prevd','Previous Dental Treatments/Surgeries',[...RF_DEN,'Periodontal surgery','Oral surgery','Orthognathic surgery','Trauma surgery','Biopsy','Other']),
 rM('prevm','Previous Medical Surgeries/Procedures',['Appendectomy','Tonsillectomy','Cardiac surgery','Joint replacement','Transplant','Cesarean section','Other']),
 rY('anes','Anesthesia complications'),rY('transf','Blood transfusion history'),rY('postop','Post-operative complications'),
 {t:'rows',k:'prevrows',l:'Previous Treatment/Surgery Details',n:3,cols:[['year','Year','text'],['proc','Type/Procedure','text'],['place','Hospital/Clinic','text'],['by','Surgeon/Physician','text'],['out','Outcome/Complications','text']]}]},
{id:'s2',n:'2',t:'MEDICAL & INFECTIOUS DISEASE HISTORY (Expanded)',fs:[
 rH('2.1 Chronic Diseases & Conditions'),
 rC('none1','None'),
 rC('diab','Diabetes',[rR('type','Type',['Type 1','Type 2']),rR('ctl','Control',['Good','Fair','Poor']),rT('a1c','HbA1c %'),rM('meds','Meds',['Insulin','OHA','Diet']),rR('hypo','Hypoglycemia Hx',['Yes','No'])]),
 rC('htn','Hypertension',[rT('bp','BP (e.g. 130/85)'),rR('ctl','Controlled',['Yes','No']),rT('meds','Meds')]),
 rC('cvs','Cardiovascular',[rM('o','',['Angina','MI','Heart failure','Arrhythmia','Valve disease','Pacemaker/ICD','Stroke','Rheumatic fever','Prosthetic joint','Previous infective endocarditis','Congenital heart disease'])]),
 rC('antico','Anticoagulant/antiplatelet',[rM('o','',['Warfarin','DOAC','Aspirin','Clopidogrel']),rT('inr','INR')]),
 rC('resp','Respiratory',[rM('o','',['Asthma','COPD','Emphysema','Bronchitis','Sleep apnea','Past TB'])]),
 rC('renal','Renal',[rM('o','',['CKD','Dialysis','Transplant']),rT('ckd','CKD stage')]),
 rC('liver','Liver',[rM('o','',['Hepatitis','Cirrhosis','Alcohol use'])]),
 rC('gi','Gastrointestinal',[rM('o','',['GERD','IBD','Peptic ulcer','Other'])]),
 rC('endo','Endocrine',[rM('o','',['Thyroid','Other'])]),
 rC('neuro','Neurological',[rM('o','',['Epilepsy','Seizures','Parkinson’s','MS','Other'])]),
 rC('psych','Psychiatric',[rM('o','',['Anxiety','Depression','Other'])]),
 rC('bleed','Bleeding disorder',[rT('d','Details')]),
 rC('immuno','Immunosuppression',[rM('o','',['Chemo','Steroids','HIV','Transplant','Biologics'])]),
 rC('autoimm','Autoimmune disease',[rT('d','Details')]),
 rC('cancer','Cancer/radiotherapy',[rT('site','Site'),rT('date','Date')]),
 rC('antires','Antiresorptive',[rM('o','',['Bisphosphonate','Denosumab']),rR('route','Route',['IV','Oral']),rT('dur','Duration')]),
 rC('preg','Pregnancy',[rT('wk','Weeks'),rM('o','',['Lactation'])]),
 rC('subst','Substance use',[rM('o','',['Smoking','Alcohol','Drugs']),rT('day','Smoking per day')]),
 rC('ochr','Other chronic disease',[rT('d','Details')]),
 rH('2.2 Infectious Disease Screening'),
 rC('none2','None known'),
 rC('hbv','HBV',[rM('o','',['Active','Carrier','Vaccinated','Unknown'])]),
 rC('hcv','HCV',[rM('o','',['Active','Treated','Unknown'])]),
 rC('hiv','HIV',[rM('o','',['Positive','Unknown'])]),
 rC('tb','TB',[rM('o','',['Active','Past','Contact','Unknown'])]),
 rC('fever','Recent fever/infection',[rT('d','Details')]),
 rC('herpes','Herpes/cold sore',[rM('o','',['Active'])]),
 rC('sti','Syphilis/other STI',[rT('d','Details')]),
 rC('mrsa','MRSA/contact infection',[rT('d','Details')]),
 rC('covid','Recent respiratory infection/COVID',[rT('d','Details')]),
 rC('oinf','Other infectious disease',[rT('d','Details')]),
 rH('2.3 Allergies'),
 rC('none3','None'),
 rM('allergy','Allergic to',['Penicillin','NSAID','Latex','Local anesthetic','Other']),rA('allergyd','Details'),
 rH('2.4 Current Medications'),
 rA('meds','Current medications'),rT('phys','Physician/contact'),rT('physph','Phone'),rD('lastrev','Last medical review'),
 rH('2.5 Vital Signs'),
 {t:'line',fs:[rT('v_bp','BP'),rT('v_pulse','Pulse'),rT('v_rr','Respiratory rate'),rT('v_temp','Temperature'),rT('v_spo2','SpO₂ %'),rT('v_asa','ASA')]},
 rH('2.6 Medical Alerts & Precautions'),
 rC('alert','MEDICAL ALERT',[rT('d','Specify')]),
 rM('prec','Precautions (tick all that apply)',['BP check','Glucose check','Antibiotic prophylaxis','Consult physician','Avoid epinephrine','INR/DOAC check','Dialysis timing','Pregnancy positioning','Airborne precautions','Contact precautions','Post-exposure protocol','Local hemostatic measures','Short appointment','Morning appointment','Avoid nephrotoxic drugs','Other']),
 rT('precind','Antibiotic prophylaxis indication')]},
{id:'s3',n:'3',t:'GENERAL EXAMINATION',fs:[
 rM('extra','Extraoral',['Normal','Swelling','Lymphadenopathy','TMJ']),rM('intra','Intraoral soft tissue',['Normal','Ulcer','Redness','Swelling']),
 rM('occl','Occlusion',['Normal','Class I','Class II','Class III']),rA('assess','Assessment')]},
{id:'s4',n:'4',t:'SPECIALTY HISTORY & FINDINGS (Hx + Findings + Classification)',fs:[
 rG('4.1 Orthodontic',[rM('o_h','Hx',['Previous ortho','Thumb/digit habit','Mouth breathing','Tongue thrust','Chewing difficulty']),rM('o_f','Findings',['Crowding','Spacing','Overjet','Overbite','Crossbite','Open bite','Deep bite','Midline deviation']),rT('o_oj','Overjet (mm)'),rT('o_ob','Overbite (mm)'),rR('o_angle','Angle’s Class',['I','II div 1','II div 2','III'])]),
 rG('4.2 Periodontic',[rM('p_h','Hx',['Bleeding gums','Previous perio tx','Diabetes','Smoking','Bad breath']),rM('p_f','Findings',['Plaque','Calculus','Gingivitis','Periodontitis']),rT('p_pd','PD (mm)'),rR('p_rec','Recession',['Yes','No']),rT('p_mob','Mobility'),rR('p_fur','Furcation',['I','II','III']),rR('p_gin','Gingiva',['Healthy','Inflamed','Hyperplastic']),rR('p_stage','2017 Classification Stage',['I','II','III','IV']),rR('p_ext','Extent',['Localized (<30%)','Generalized (>30%)','Molar-incisor pattern'])]),
 rG('4.3 Maxillofacial',[rM('m_h','Hx',['Trauma','Surgery','TMJ pain/click','Swelling','Asymmetry','Limited opening']),rM('m_f','Findings',['Facial symmetry','TMJ tenderness','Click/pop','Lymphadenopathy','Swelling','Deviation on opening']),rT('m_open','Opening (mm)'),rM('m_lf','Le Fort Classification',['Le Fort I','Le Fort II','Le Fort III','ZMC fracture','Mandibular fracture'])]),
 rG('4.4 Dental Trauma',[rM('t_h','Hx',['Fall','Sports injury','RTA','Assault','Biting hard object','Previous trauma']),rM('t_f','Findings',['Fracture','Luxation','Intrusion','Extrusion','Avulsion','Subluxation','Mobile tooth','Discoloration','Pulp exposure','Root fracture','Alveolar fracture','Soft tissue injury']),rR('t_ellis','Ellis Classification',['Class I (enamel)','Class II (enamel+dentin)','Class III (pulp)','Class IV (root)','Class V (avulsion)','Class VI (root fracture)']),rM('t_and','Andreasen Classification',['Enamel infraction','Enamel fracture','Crown fracture (uncomplicated)','Crown fracture (complicated)','Crown-root fracture','Root fracture','Concussion','Subluxation','Extrusive luxation','Lateral luxation','Intrusive luxation','Avulsion'])]),
 rG('4.5 Endodontic',[rM('e_h','Hx',['Previous RCT','Sensitivity to hot/cold','Spontaneous pain','Swelling','Sinus tract']),rM('e_f','Findings',['Caries','Non-vital','Percussion tenderness','Palpation tenderness','Sinus tract','Periapical radiolucency','Fracture','Resorption'])]),
 rG('4.6 Restorative / Caries',[rM('r_h','Hx',['Previous fillings','Fractured restoration','Food impaction','Sensitivity']),rM('r_f','Findings',['Caries','Defective restoration','Marginal leakage','Fractured cusp','Wear/faceting','Discoloration','Missing tooth structure']),rR('r_black','Caries Classification (G.V. Black)',['Class I','Class II','Class III','Class IV','Class V','Class VI']),rR('r_icdas','ICDAS',['0','1','2','3','4','5','6']),rR('r_depth','Depth',['Enamel','Dentin','Pulp'])]),
 rG('4.7 Prosthodontic',[rM('x_h','Hx',['Previous crowns/bridges','Dentures','Removable partial','Implant prosthesis']),rM('x_f','Findings',['Missing teeth','Edentulous space','Defective crown/bridge','Denture fit issue','Occlusal imbalance','Abutment condition'])]),
 rG('4.8 Pediatric Dentistry',[rM('d_h','Hx',['First dental visit','Bottle/nursing','Thumb sucking','Trauma','Fluoride use']),rM('d_f','Findings',['ECC','Crowding','Delayed eruption','Space maintainer needed','Behavior management needed'])]),
 rG('4.9 Oral Medicine / Oral Pathology',[rM('a_h','Hx',['Ulcers','Dry mouth','Burning mouth','Lesions','Biopsy','Systemic disease']),rM('a_f','Findings',['Ulcer','White patch','Red patch','Swelling','Pigmentation','Mucosal lesion','Salivary gland issue','Halitosis'])]),
 rG('4.10 Oral Surgery',[rM('s_h','Hx',['Extraction','Impaction','Trauma','Surgery','Bleeding disorder','Anticoagulants']),rM('s_f','Findings',['Impacted tooth','Mobile tooth','Swelling','Infection','Limited opening','Trismus','Fracture']),rR('s_win','Impaction Classification (Winter’s)',['Mesioangular','Distoangular','Vertical','Horizontal'])]),
 rG('4.11 Implantology',[rM('i_h','Hx',['Previous implants','Bone graft','Sinus lift','Failed implant']),rM('i_f','Findings',['Missing tooth space','Bone volume','Soft tissue condition','Implant stability','Peri-implantitis','Prosthesis condition']),rT('i_bone','Bone volume'),rT('i_stab','Implant stability')])]},
{id:'s5',n:'5',t:'DENTAL CHART (FDI)',fs:[
 {t:'chart',k:'chart'},rA('invest','Investigation (X-ray, lab, vitality test... ordered / results)'),
 {t:'rows',k:'crows',l:'Tooth findings',n:3,cols:[['tooth','Tooth','text'],['finding','Finding','text'],['notes','Notes','text']]}]},
{id:'s6',n:'6',t:'DIAGNOSIS',fs:[rT('dx1','Primary'),rT('dx2','Secondary'),rT('dx3','Specialty diagnosis')]},
{id:'s7',n:'7',t:'TREATMENT PLAN',fs:[
 {t:'rows',k:'plan',l:'Treatment plan',n:3,num:true,cols:[['tooth','Tooth/Area','text'],['cat','Case type','sel',RXCAT],['proc','Procedure','text','proc'],['status','Status','sel',['Planned','Done']],['fee','Fee','number']]},
 rT('anesth','Anesthesia'),rT('today','Treatment today'),rR('postop_i','Post-op instructions',['Given','Not given'])]},
{id:'s8',n:'8',t:'FOLLOW-UP',fs:[rD('next','Next appointment'),rR('recall','Recall',['3 mo','6 mo','12 mo','PRN']),rA('fu','Notes')]}
];

/* writing space under every specialty group (4.1 - 4.11) */
RSEC.find(s=>s.id=='s4').fs.forEach((g,i)=>g.fs.push({...rA('gn'+(i+1),'Notes (write here)'),lines:4,rows:4}));

/* Section 10: clinical action guide. test() decides whether the row applies to the patient (highlighted + shown as an alert). */
const hasO=(f,k,v)=>!!f[k]&&(f[k+'_o']||[]).includes(v);
const RGUIDE=[
['Diabetes','Morning appointment, patient must eat, check glucose if needed, short appointments, monitor for hypoglycemia, infection/delayed healing risk.',f=>f.diab],
['Hypertension','Check BP. If very high — e.g. >180/110 mmHg — postpone elective care and refer/consult. Use stress reduction.',f=>f.htn||rfBpHigh(f)],
['Cardiovascular disease','Antibiotic prophylaxis only if clearly indicated — prosthetic valve, previous infective endocarditis, certain congenital heart disease, cardiac transplant valvulopathy. Not routine for joint prostheses.',f=>f.cvs],
['Anticoagulants/antiplatelets','Do not stop without physician. Check INR for warfarin; consult for DOAC. Use local hemostatic measures.',f=>f.antico],
['Asthma/COPD','Keep inhaler available, upright position, avoid triggers/aerosol if severe.',f=>f.resp&&((f.resp_o||[]).some(x=>/asthma|copd|emphysema|bronchitis/i.test(x))||!(f.resp_o||[]).length)],
['Active TB','Defer elective dental care; refer. If urgent: airborne precautions, N95, negative-pressure room.',f=>hasO(f,'tb','Active')],
['HBV/HCV/HIV','Standard precautions for all patients. Confidentiality. Staff HBV vaccination. Post-exposure prophylaxis protocol.',f=>f.hbv||f.hcv||f.hiv||hasO(f,'immuno','HIV')],
['Renal disease/dialysis','Avoid nephrotoxic drugs; adjust drug doses; coordinate timing with dialysis; bleeding risk.',f=>f.renal],
['Liver disease','Bleeding risk and altered drug metabolism; hepatitis precautions.',f=>f.liver],
['Bleeding disorder','Check INR/platelets; consult hematologist; local hemostatic measures.',f=>f.bleed],
['Immunosuppression','High infection risk; avoid elective care during active infection; no routine antibiotics without indication.',f=>f.immuno],
['Bisphosphonate/denosumab','Risk of MRONJ. Avoid unnecessary extractions; consent; consult physician if high risk.',f=>f.antires],
['Pregnancy','Elective care ideally second trimester; left lateral position; emergency care at any time; drug caution.',f=>f.preg],
['Active herpes/cold sore','Avoid elective treatment near active lesion; avoid contact; postpone if possible.',f=>hasO(f,'herpes','Active')],
['Infectious disease generally','Use standard precautions for every patient. Add airborne/contact precautions only when indicated.',f=>f.hbv||f.hcv||f.hiv||f.tb||f.fever||f.sti||f.mrsa||f.covid||f.oinf]];
const RGUIDE_RULE='Key rule: Antibiotics are not routine for caries, periodontitis, or most dental pain. Use only when there is a clear indication or medical consultation.';
function rfBpHigh(f){const m=String(f.v_bp||'').match(/(\d{2,3})\s*[\/\\]\s*(\d{2,3})/);return !!m&&(+m[1]>=180||+m[2]>=110)}
const rfAlerts=f=>RGUIDE.filter(g=>{try{return g[2](f||{})}catch(e){return false}});

/* ---------- Medicine and medical alerts by field (endo, surgery, implant, perio, prostho, ortho) ----------
   The general drug check (rxSafety.js) looks at the patient file and the medicines. This adds a layer for the FIELD of the case:
   each field has its own medicine rules (for example hypochlorite and the intracanal pastes for endo, tranexamic acid and bisphosphonates for surgery),
   its own "medical alerts" for the patient (case alerts) and a short usual-medicine guide.
   Field of a case = the field picked on the prescription page, else the doctor's own specialty, else the field of the latest specialty record, else general (no field alerts).
   Where it shows: 1) the field box on each specialty record page and on the prescription page, 2) live while a specialty record is filled
   (a medicine, irrigant or material that conflicts with the file needs a reason; it is stored on the record as rxa), 3) the prescription check (same Avoid / Caution levels, same reason window).
   Rule row: [when, level, title, text]. "when" = tag or list of tags that must all be true; "a|b" = any of; "!a" = not a. Levels: avoid, caution, info.
   It is a help for the doctor and does not replace clinical judgement. */
const RXFL={endo:'Endo',omfs:'Surgery',impl:'Implant',perio:'Perio',pros:'Prostho',ortho:'Ortho'};
const RXFK=Object.keys(RXFL);
let RXFO={pid:null,k:''},RXSP_PEND=null;
const rxFName=k=>typeof FUFLD!='undefined'&&FUFLD[k]?FUFLD[k].n:k;
function rxField(p){if(!p)return 'gen';if(RXFO.k&&RXFO.pid!=null&&RXFO.pid==p.id)return RXFO.k;return typeof fuGuess=='function'?fuGuess(p):'gen'}

/* shared wording */
const RXA_ADR='Limit adrenaline to about 0.04 mg (2 cartridges of 1:100,000). Aspirate and inject slowly. Do not use adrenaline for injections into the bone or the ligament.';
const RXA_ENDO='Antibiotic cover is advised before this treatment (follow your protocol, for example amoxicillin 2 g one hour before; if penicillin allergic, azithromycin or doxycycline). Ask the cardiologist.';
const RXA_AC='Do not stop the blood thinner yourself. Warfarin: check the INR within 24 hours (many protocols accept 4 or less). Use local measures: pressure, sutures, a haemostatic sponge, tranexamic acid 4.8% mouthwash. Avoid NSAIDs, metronidazole, fluconazole and miconazole.';
const RXAB=/amoxi\w*|ampicil\w*|augmentin|co-?amoxi\w*|penicillin\w*|clindamycin\w*|dalacin|azithro\w*|erythro\w*|clarithro\w*|metronidazole|flagyl|cef\w+|doxy\w*|cipro\w*|tetracycl\w*/i;
const RXNS=/ibuprofen|brufen|diclofenac|voltaren|naproxen|ketorolac|mefenamic\w*|ponstan|piroxicam|indometh\w*|celecoxib|etoricoxib|aceclofenac|nimesulide|ketoprofen|meloxicam/i;

const RXY={
 /* ---- every field ---- */
 all:{drug:[
  {n:'Local anesthetic',show:1,m:/lidocaine|lignocaine|xylocaine|articaine|septanest|ubistesin|mepivacaine|scandonest|prilocaine|bupivacaine|marcaine|adrenaline|epinephrine|local an(a)?esth\w*/i,r:[
   ['la','avoid','Allergic to local anesthetic. Ask which one, do not use it, and consider an allergy test.'],
   ['sulfite','avoid','Sulfite allergy - anesthetics with adrenaline contain a sulfite. Use one without adrenaline (plain mepivacaine or prilocaine).'],
   ['cvs|htn','caution','Heart disease or high blood pressure. '+RXA_ADR],
   ['mi','caution','Past heart attack or stroke - adrenaline can strain the heart. Use the smallest dose, and ask the cardiologist if it was recent.'],
   ['asthma','caution','Asthma - the sulfite in adrenaline-containing anesthetics can trigger an attack in sensitive patients.'],
   ['liver','caution','Liver disease - the liver breaks the anesthetic down. Use the smallest effective dose.'],
   ['child','caution','Child - work out the maximum dose by body weight.'],
   ['ssri','caution','Antidepressant - tricyclics such as amitriptyline increase the effect of adrenaline. Use small doses.']]},
  {n:'Chlorhexidine',m:/chlorhexidine|corsodyl|hibiscrub|hexidine|savlon/i,r:[
   ['chx','avoid','Allergic to chlorhexidine. Do not use it as a mouthwash, gel or irrigant.'],
   ['child','caution','Child - use an alcohol-free rinse and make sure the child does not swallow it.']]},
  {n:'Iodine (povidone iodine, Betadine)',m:/povidone|betadine|iodine/i,r:[['iod','avoid','Allergic to iodine. Use chlorhexidine instead (if not allergic).']]},
  {n:'Eugenol (zinc oxide eugenol, clove oil)',m:/eugenol|zoe\b|clove/i,r:[['eug','avoid','Allergic to eugenol. Use a eugenol-free cement, dressing or sealer.']]}
 ],cs:[
  ['la','avoid','Local anesthetic allergy','Do not give the anesthetic the patient reacts to. Find out which one it was; consider an allergy test or another technique.'],
  ['sulfite','avoid','Sulfite allergy','Anesthetics with adrenaline contain a sulfite. Use plain mepivacaine or prilocaine.'],
  ['chx','avoid','Chlorhexidine allergy','Do not use chlorhexidine as a mouthwash, gel or irrigant.'],
  ['iod','avoid','Iodine allergy','Do not use povidone iodine. Use chlorhexidine if the patient is not allergic to it.'],
  ['eug','avoid','Eugenol allergy','Do not use zinc oxide eugenol cements, dressings or sealers.']]},

 /* ---- Endodontic ---- */
 endo:{drug:[
  {n:'Sodium hypochlorite (NaOCl)',m:/hypochlor\w*|naocl|bleach/i,r:[
   ['naocl','avoid','Allergic to hypochlorite. Do not use it; irrigate with saline (and chlorhexidine if not allergic).'],
   ['asthma','caution','Asthma - the fumes can trigger wheezing. Use a rubber dam with good suction and keep the inhaler at hand.'],
   ['child','caution','Child or open apex - risk of pushing it through the tip. Use a side-vented needle, low pressure and stay short of the working length.'],
   ['latex','caution','Latex allergy - use a latex-free rubber dam and gloves.']]},
  {n:'Antibiotic paste (triple antibiotic paste, Ledermix, minocycline)',m:/triple antibiotic|3mix|\btap\b paste|ledermix|minocycl\w*|demeclocycl\w*/i,r:[
   ['tetra','avoid','Allergic to tetracycline (minocycline or demeclocycline in the paste).'],
   ['preg','avoid','Pregnancy - tetracyclines harm the unborn baby\'s teeth and bones. Use calcium hydroxide instead.'],
   ['young','avoid','Child under 8 - tetracyclines stain developing teeth. Use calcium hydroxide.'],
   ['pen','caution','Penicillin allergy - check every ingredient of the paste.'],
   ['child','caution','Minocycline can stain the crown grey. Seal the dentine well, or choose calcium hydroxide.']]},
  {n:'Formocresol / formaldehyde paste',m:/formocresol|formaldehyde|paraformaldehyde|\bpfa\b/i,r:[
   ['preg','avoid','Pregnancy - avoid formaldehyde pastes.'],
   ['child','caution','Child - formocresol is no longer preferred. MTA or Biodentine are safer choices.']]},
  {n:'Antibiotic for pulpitis',show:1,m:RXAB,r:[
   ['pulpitis','caution','The diagnosis is pulpitis. Antibiotics do not relieve it. Treat the tooth (remove the pulp) and give a pain killer. Use an antibiotic only for spreading swelling, fever, trismus or weak immunity.'],
   ['chronic','caution','Chronic abscess with a draining sinus - no antibiotic is needed. Clean and disinfect the canals.']]},
  {n:'Opioid pain killer',show:1,m:/tramadol|codeine\w*|dihydrocodeine|morphine|pethidine|tapentadol/i,r:[
   ['*','caution','Root canal pain usually responds to ibuprofen plus paracetamol. Opioids add side effects with little extra relief. Avoid them where possible.']]}
 ],cs:[
  ['latex','avoid','Latex allergy','Use a latex-free rubber dam and gloves. Check the cartridges, syringe stoppers and gutta-percha brand.'],
  ['naocl','avoid','Hypochlorite (bleach) allergy','Do not use sodium hypochlorite. Irrigate with saline (and chlorhexidine if not allergic).'],
  ['tetra','avoid','Tetracycline allergy','Do not use triple antibiotic paste or Ledermix (they contain a tetracycline).'],
  ['prophy','avoid','Endocarditis risk (heart valve, past endocarditis, congenital heart)',RXA_ENDO+' Do not instrument beyond the apex.'],
  ['asthma','caution','Asthma / COPD','Hypochlorite fumes and the rubber dam can trigger wheezing. Keep the inhaler at hand and use good suction.'],
  ['cvs|htn|mi','caution','Heart disease or high blood pressure',RXA_ADR],
  ['immuno|ster|dmpoor','caution','Weak immunity, long-term steroids or poorly controlled diabetes','Higher risk of infection and slow healing. Disinfect the canals well, consider antibiotic cover with the physician, and review healing early.'],
  ['anyac','caution','Blood thinner','Root canal treatment is low bleeding risk - the blood thinner is usually continued. Warfarin: check the INR within 24 hours. Avoid NSAIDs (use paracetamol).'],
  ['bleed','caution','Bleeding disorder','Ask the physician before pulpotomy, pulpectomy or apical surgery and prepare local haemostatic measures.'],
  ['preg','caution','Pregnancy','Elective work is best in the second trimester; urgent pain or infection is treated at any time. Shield and keep X-rays to a minimum. Avoid tetracycline pastes, metronidazole in the first 3 months and NSAIDs.'],
  ['child','caution','Child','Work out anesthetic and medicine doses by body weight. In immature teeth avoid pushing hypochlorite through the apex and avoid minocycline pastes.'],
  ['pulpitis','info','Pulpitis: treat the tooth','Antibiotics do not help pulpitis. Remove the pulp and give ibuprofen with paracetamol (paracetamol alone if ibuprofen does not suit).'],
  ['abscess','info','Acute apical abscess','Drain and clean the canals. Add an antibiotic only for spreading swelling, fever, trismus or weak immunity. Trouble breathing or swallowing, or swelling under the tongue or neck, is an emergency - refer to hospital.'],
  ['necrosis','info','Necrotic pulp','No antibiotic is needed without signs of spreading infection.'],
  ['retx','info','Retreatment','Use a calcium hydroxide dressing between visits. Antibiotics only for spreading infection.']
 ],tips:[
  'Pain plan: ibuprofen with paracetamol if the patient can take them; paracetamol alone for kidney disease, ulcer, blood thinners, asthma (aspirin-sensitive) or pregnancy.',
  'Antibiotics only for spreading swelling, fever, trismus or weak immunity - not for pulpitis or a draining sinus.',
  'Do not mix hypochlorite and chlorhexidine: a brown precipitate forms. Rinse with saline or EDTA between them.',
  'Calcium hydroxide is the usual dressing between visits. Avoid tetracycline-type pastes in pregnancy, children and tetracycline allergy.']},

 /* ---- Maxillofacial surgery ---- */
 omfs:{drug:[
  {n:'Tranexamic acid',m:/tranexamic\w*|cyklokapron|transamin/i,r:[
   ['mi','caution','Past heart attack, stroke or clot - tranexamic acid tablets can increase clotting. Use it as a mouthwash only.'],
   ['renal|dial','caution','Kidney disease - lower the dose of tablets (the mouthwash is safe).'],
   ['epil','caution','Seizures have been reported at high doses. Use the mouthwash form where possible.'],
   ['preg','caution','Pregnancy - use only if clearly needed.']]},
  {n:'Sedation / hypnotic',show:1,m:/midazolam|diazepam|lorazepam|propofol|ketamine|sevoflur\w*|halothane|thiopental/i,r:[
   ['osa','caution','Sleep apnea - sedatives can block the airway. Use the smallest dose with monitoring.'],
   ['epil','caution','Epilepsy - make sure the usual epilepsy medicine was taken today; avoid agents that lower the seizure threshold.'],
   ['cvs|htn','caution','Heart disease or high blood pressure - ketamine raises the pulse and the pressure. Plan with the anesthetist.'],
   ['preg','avoid','Pregnancy - avoid elective sedation or general anesthesia, especially in the first 3 months.']]},
  {n:'Steroid for swelling',show:1,m:/dexameth\w*|prednis\w*|methylpred\w*/i,r:[
   ['dmpoor','avoid','Poorly controlled diabetes - the steroid pushes the blood sugar up a lot. Avoid or check the sugar closely.'],
   ['ster','caution','Long-term steroids already - ask the physician about extra steroid cover for major surgery.']]}
 ],cs:[
  ['ivbp|dmab','avoid','IV bisphosphonate or denosumab - osteonecrosis risk','Extraction and jaw surgery can start osteonecrosis of the jaw. Ask the prescriber, avoid extraction if the tooth can be saved, use an atraumatic technique, close the wound fully and follow your referral protocol.'],
  ['antires','caution','Bisphosphonate (tablets) or denosumab','Lower but real osteonecrosis risk. Tell the patient, use an atraumatic technique, close the wound and check healing at 2-4 weeks.'],
  ['rtjaw','avoid','Radiotherapy to the head or neck','Extraction in irradiated bone can cause osteoradionecrosis. Talk to the oncologist first and follow a protocol (antibiotic cover, atraumatic technique, full closure).'],
  ['cancer','caution','Cancer or chemotherapy','Check the blood counts (white cells and platelets) before surgery and ask the oncologist about timing.'],
  ['bleed','avoid','Bleeding disorder','Ask the haematologist before surgery (factor cover or platelets may be needed). Plan local haemostasis and tranexamic acid as advised.'],
  ['warf','caution','Warfarin',RXA_AC],
  ['doac','caution','DOAC blood thinner (rivaroxaban, apixaban, dabigatran)','Ask the physician about timing - usually take the dose after the procedure. Use local haemostatic measures. Avoid NSAIDs.'],
  ['apl','caution','Aspirin or clopidogrel','Usually continue. Use local haemostatic measures and a tight suture. Avoid NSAIDs.'],
  ['liver','caution','Liver disease','Clotting may be abnormal - check PT/INR and platelets before surgery. Keep paracetamol to 2 g a day.'],
  ['renal|dial','caution','Kidney disease or dialysis','Operate on the day after dialysis (heparin on the dialysis day causes bleeding). Avoid NSAIDs and adjust antibiotic doses. Do not use the fistula arm for blood pressure or drips.'],
  ['diab','caution','Diabetes','Book in the morning after a normal meal and normal medicines. Check the blood sugar before surgery; poor control means slow healing and more infection. Dexamethasone raises the sugar.'],
  ['cvs|mi|htn','caution','Heart disease or high blood pressure','Check the blood pressure before surgery (postpone elective surgery at 180/110 or higher). '+RXA_ADR+' Heart attack or stroke in the last 6 months: no elective surgery without the cardiologist.'],
  ['prophy','avoid','Endocarditis risk',RXA_ENDO],
  ['asthma','caution','Asthma','Bring the inhaler. Avoid NSAIDs if aspirin ever caused wheezing. With sedation or general anesthesia plan with the anesthetist.'],
  ['osa','caution','Sleep apnea','Sedation and opioids can block the airway. Prefer local anesthesia; monitor with a pulse oximeter.'],
  ['epil','caution','Epilepsy','Make sure the epilepsy medicine was taken today. Avoid tramadol. Plan a short morning visit.'],
  ['preg','caution','Pregnancy','Only necessary surgery; the second trimester is safest. Shield for X-rays. Avoid tetracyclines, NSAIDs (especially after week 28) and metronidazole in the first 3 months. Lidocaine with adrenaline is considered safe.'],
  ['child','caution','Child','Work out every dose by body weight. No aspirin, no codeine, no tramadol.'],
  ['immuno|ster','caution','Weak immunity or long-term steroids','More infection and slow healing. Consider antibiotic cover with the physician. Long-term steroids: ask about extra steroid cover before major surgery.'],
  ['ga','info','General anesthesia','Needs fasting (6 hours food, 2 hours clear fluids), pre-operative blood tests and the anesthetist. Tell the patient which morning medicines to take.'],
  ['fx','caution','Fracture or open wound','Check tetanus protection: give a booster if the last dose was more than 5-10 years ago or the wound is dirty. Antibiotic cover per protocol.'],
  ['smoke|ocp','ext','caution','Dry socket risk','Smoking and contraceptive pills raise the risk. Advise no smoking, rinsing or spitting for 48 hours. Consider a chlorhexidine gel or a socket dressing.'],
  ['drysock','caution','Dry socket recorded','Irrigate and dress the socket (zinc oxide eugenol or iodoform; check the eugenol allergy). Give an NSAID for pain if it is safe. No antibiotic unless there are signs of infection.'],
  ['sinus','caution','Sinus procedure','Sinusitis, allergic rhinitis and smoking raise the risk of complications. No nose blowing for 2 weeks. Antibiotic and decongestant per protocol - check the penicillin allergy.'],
  ['absc','info','Abscess','Drain the pus first. Add an antibiotic for fever, spreading swelling or trismus (amoxicillin with metronidazole; clindamycin or azithromycin if penicillin allergic). Trouble breathing or swallowing, or swelling under the tongue or neck, is an emergency - admit.']
 ].map(c=>c.length==5?[[c[0],c[1]],c[2],c[3],c[4]]:c),tips:[
  'Pain plan: ibuprofen with paracetamol if safe; paracetamol alone for kidney disease, ulcer, blood thinners, asthma (aspirin-sensitive) or pregnancy. No aspirin.',
  'No routine antibiotic after a simple extraction in a healthy patient. Use one for infection, spreading swelling, weak immunity or per surgical protocol.',
  'Bleeding: firm pressure, sutures, tranexamic acid 4.8% mouthwash. Do not stop blood thinners yourself - check the INR (warfarin).',
  'Swelling after an impacted tooth: a single dose of dexamethasone (not for poorly controlled diabetes).',
  'Contaminated wounds and fractures: check tetanus protection.']},

 /* ---- Implant ---- */
 impl:{drug:[
  {n:'Antibiotic cover before implant surgery',show:1,m:/amoxi\w*|augmentin|co-?amoxi\w*|penicillin\w*/i,r:[
   ['pen','avoid','Penicillin allergy - use a non-penicillin cover (for example clindamycin 600 mg or azithromycin 500 mg one hour before), per your protocol.']]}
 ],cs:[
  ['u18','avoid','Under 18 years','Implants are normally placed only after the jaw has finished growing (about 18 years or older). Discuss with the orthodontist or surgeon.'],
  ['ivbp|dmab','avoid','IV bisphosphonate or denosumab','Implant surgery is a high risk for osteonecrosis of the jaw. Avoid unless the prescriber and a specialist agree.'],
  ['antires','caution','Bisphosphonate (tablets)','Lower risk, higher after 3-5 years of use or with steroids. Tell the patient about the risk and ask the prescriber.'],
  ['rtjaw','avoid','Radiotherapy to the head or neck','Implants in irradiated bone fail more and can cause osteoradionecrosis. Ask the oncologist and the maxillofacial team first.'],
  ['preg','avoid','Pregnancy','Postpone elective implant surgery (and CBCT or X-rays) until after delivery.'],
  ['bleed','avoid','Bleeding disorder','Ask the haematologist before implant surgery. Plan local haemostasis.'],
  ['dmpoor','avoid','Poorly controlled diabetes','Poor control raises implant failure and infection. Improve the control (HbA1c about 8% or lower) before surgery.'],
  ['diab','caution','Diabetes','Check the blood sugar before surgery, give antibiotic cover and review healing closely.'],
  ['smoke','caution','Smoker','Smoking raises implant failure and infection. Advise stopping before and after surgery and explain the higher risk.'],
  ['perioact','caution','Active gum disease','Treat and stabilise the periodontitis first. Implants fail more often in untreated periodontitis.'],
  ['pen','caution','Penicillin allergy','Do not give amoxicillin before surgery. Use a non-penicillin cover per your protocol (for example clindamycin 600 mg or azithromycin 500 mg one hour before).'],
  ['prophy','avoid','Endocarditis risk',RXA_ENDO],
  ['anyac','caution','Blood thinner',RXA_AC],
  ['immuno|ster','caution','Weak immunity or long-term steroids','Higher risk of failure and infection. Ask the physician and consider antibiotic cover.'],
  ['cvs|mi|htn','caution','Heart disease or high blood pressure','Check the blood pressure before surgery. '+RXA_ADR+' Heart attack or stroke in the last 6 months: no elective surgery without the cardiologist.'],
  ['renal|dial|liver','caution','Kidney or liver disease','Adjust medicine doses; avoid NSAIDs. Dialysis: operate the day after. Liver: check the clotting.'],
  ['pace','caution','Pacemaker / ICD','Avoid monopolar electrosurgery; use bipolar. Ask the cardiologist about older devices.'],
  ['sinus','caution','Sinus lift','Sinusitis, allergic rhinitis and smoking raise the risk. No nose blowing for 2 weeks. Antibiotic and decongestant per protocol - check the penicillin allergy.'],
  ['ti','caution','Metal allergy','Titanium allergy is rare. Ask which metals the patient reacts to; consider a zirconia implant.'],
  ['graft','info','Bone graft or membrane','Tell the patient what the material is made of (human, cow, pig or synthetic) because some patients object. Check collagen or gelatin allergy.']
 ],tips:[
  'Many protocols give one dose of amoxicillin (2-3 g) about one hour before surgery; routine antibiotics after surgery are usually not needed. Penicillin allergy: clindamycin 600 mg or azithromycin 500 mg.',
  'Chlorhexidine rinse for 1 minute before surgery and for 1-2 weeks after. Not longer (it stains).',
  'Pain: ibuprofen with paracetamol if safe. Dexamethasone for swelling after grafts (not for poorly controlled diabetes).',
  'Smokers, diabetics and patients with active gum disease need a clear talk about the higher failure risk.']},

 /* ---- Periodontal ---- */
 perio:{drug:[
  {n:'Adjunct antibiotic in gum disease',show:1,m:/amoxi\w*|augmentin|azithro\w*/i,r:[
   ['!severe','caution','Antibiotics are only an extra for severe or fast-progressing periodontitis (stage III-IV, grade C) after scaling. They are not routine for gingivitis or mild disease.']]}
 ],cs:[
  ['ovg','caution','Medicine that makes the gums grow','Amlodipine or nifedipine, phenytoin and ciclosporin can cause gum overgrowth. Ask the physician if another medicine is possible, and stress plaque control.'],
  ['diab','caution','Diabetes','Gum disease and diabetes affect each other. Check the control (HbA1c), book after a meal, treat infection early and watch healing after surgery.'],
  ['smoke','caution','Smoker','Smoking hides bleeding and slows healing; surgical results are poorer. Advise stopping.'],
  ['prophy','avoid','Endocarditis risk','Antibiotic cover is advised before scaling under the gum and before gum surgery (follow your protocol, ask the cardiologist).'],
  ['anyac','caution','Blood thinner','Scaling and probing bleed more. Warfarin: check the INR within 24 hours. Use pressure and local measures; avoid NSAIDs. Plan surgery with the physician.'],
  ['bleed','caution','Bleeding disorder','Ask the physician before deep scaling or gum surgery. Plan local haemostasis.'],
  ['pace','caution','Pacemaker / ICD','Use hand or piezo scalers where possible. Keep magnetic ultrasonic scalers and electrosurgery away from the device; ask the cardiologist for older devices.'],
  ['preg','caution','Pregnancy','Scaling is safe. Do surgery in the second trimester. Avoid tetracycline, doxycycline and (first 3 months) metronidazole. Pregnancy gums bleed easily.'],
  ['antires','caution','Bisphosphonate or denosumab','Surgery and extractions carry an osteonecrosis risk. Prefer non-surgical treatment and keep the gums clean.'],
  ['immuno|ster','caution','Weak immunity or long-term steroids','Gum infection can progress fast. Closer recall; discuss antibiotic cover with the physician for surgery.'],
  ['cvs|htn|mi','caution','Heart disease or high blood pressure',RXA_ADR]
 ],tips:[
  'Chlorhexidine 0.12-0.2% for 1-2 weeks only (stains the teeth, changes taste). Do not use it with an allergy to it.',
  'Adjunct antibiotics (amoxicillin with metronidazole for 7 days) only for severe or fast-progressing periodontitis after scaling.',
  'Check the medicine list for amlodipine, nifedipine, phenytoin or ciclosporin (gum overgrowth).',
  'Pain after surgery: paracetamol, or ibuprofen if safe.']},

 /* ---- Prosthodontic ---- */
 pros:{drug:[
  {n:'Acrylic (methacrylate) denture or splint material',m:/acrylic|pmma|methacrylate|denture base|resin base/i,r:[['acryl','avoid','Allergic to acrylic (methacrylate). Ask the lab for another base material.']]},
  {n:'Metal alloy (PFM, cast metal, cobalt-chrome, nickel)',m:/\bpfm\b|porcelain-fused|\bmetal\b|cobalt|chrom\w*|nickel|palladium/i,r:[
   ['nickel','avoid','Allergic to nickel. Use zirconia, ceramic, gold or titanium and tell the lab.'],
   ['metal','avoid','A metal allergy is noted in the file. Check which metal, and tell the lab.']]},
  {n:'Latex (gloves, impression materials)',m:/latex/i,r:[['latex','avoid','Allergic to latex. Use latex-free gloves and materials.']]},
  {n:'Nystatin (denture sore mouth)',m:/nystatin|mycostatin/i,r:[['diab','caution','Diabetes - nystatin suspension contains sugar. Use pastilles or gel if possible.']]}
 ],cs:[
  ['acryl','avoid','Acrylic (methacrylate) allergy','Do not use an acrylic denture base, temporary crowns or acrylic splints. Ask the lab for another material (for example nylon, composite or metal) and tell the lab about the allergy.'],
  ['nickel|metal','avoid','Metal allergy (nickel, cobalt, chromium...)','Avoid base-metal alloys (PFM, cast partial frameworks) with that metal. Use zirconia, ceramic, gold or titanium. Tell the lab.'],
  ['latex','avoid','Latex allergy','Use latex-free gloves, impression materials and rubber dam.'],
  ['cvs|htn|mi','caution','Heart disease or high blood pressure','Do not use retraction cord with adrenaline (epinephrine); use a plain cord or aluminium chloride. '+RXA_ADR],
  ['anyac|bleed','caution','Blood thinner or bleeding disorder','Gums bleed more when you prepare near the gum margin or take impressions. Use pressure and a haemostatic agent. Do not stop the blood thinner; check the INR (warfarin).'],
  ['xero','caution','Medicine that dries the mouth','Antihistamines, antidepressants, diuretics and others dry the mouth: poor denture retention, sore spots and more decay. Advise sips of water, a saliva substitute, fluoride and an adhesive.'],
  ['warf','denture','caution','Warfarin and denture sore mouth','Do not use miconazole gel or fluconazole for denture stomatitis (strong effect on the INR). Use nystatin and clean the denture.'],
  ['diab','caution','Diabetes','Dentures cause sores and thrush more easily. Check the mouth at every visit and book after a meal.'],
  ['preg','caution','Pregnancy','Do elective work in the second trimester. Do not let her lie flat on the back for long; turn to the left side.'],
  ['eug','caution','Eugenol allergy','Do not use zinc oxide eugenol impression paste, temporary cement or liners.']
 ].map(c=>c.length==5?[[c[0],c[1]],c[2],c[3],c[4]]:c),tips:[
  'Denture sore mouth: nystatin (not miconazole with warfarin), clean the denture and leave it out at night.',
  'Use eugenol-free temporary cement under resin work.',
  'Pain after tooth preparation: paracetamol, or ibuprofen if safe.']},

 /* ---- Orthodontic ---- */
 ortho:{drug:[
  {n:'NSAID pain killer in orthodontics',show:1,m:RXNS,r:[['*','caution','Braces patient - NSAIDs may slow tooth movement. Paracetamol is the usual first choice for braces pain.']]},
  {n:'Nickel-containing wire or bracket',m:/nickel|niti|nitinol|stainless/i,r:[['nickel','avoid','Allergic to nickel. Choose nickel-free brackets and wires (for example titanium-molybdenum).']]},
  {n:'Latex elastic',m:/latex|elastic|ligature|chain/i,r:[['latex','avoid','Allergic to latex. Use latex-free elastics and gloves.']]}
 ],cs:[
  ['nickel','avoid','Nickel allergy','Most stainless-steel and nickel-titanium brackets and wires release nickel. Use nickel-free brackets or titanium-molybdenum or other nickel-free wires, and tell the supplier.'],
  ['latex','avoid','Latex allergy','Use latex-free gloves and latex-free elastics (ligatures and chains).'],
  ['antires','caution','Bisphosphonate or denosumab','Tooth movement is slower and the osteonecrosis risk rises with extractions or surgery. Discuss before starting and ask the prescriber.'],
  ['diab','caution','Diabetes','Gum disease progresses faster with braces. Treat only when the sugar is controlled and check the gums at every visit.'],
  ['prophy','caution','Heart valve / endocarditis risk','Keep the mouth very clean. Ask the cardiologist about antibiotic cover before bands or separators, or when the gums bleed.'],
  ['epil','caution','Epilepsy','A seizure can injure the mouth with wires, or a loose appliance can be swallowed. Ask about seizure control and prefer fixed appliances.'],
  ['ovg','caution','Medicine that makes the gums grow','Amlodipine or nifedipine, phenytoin and ciclosporin make braces hard to keep clean. Stress plaque control and ask the physician if another medicine is possible.'],
  ['asthma','caution','Asthma','Mouth breathing and inhaled steroids raise gum inflammation and decay. Rinse after the inhaler and use fluoride. Avoid NSAIDs if aspirin ever caused wheezing.'],
  ['xero','caution','Medicine that dries the mouth','Higher risk of white-spot decay under braces. Use fluoride varnish and toothpaste.'],
  ['immuno|ster','caution','Weak immunity or long-term steroids','Higher risk of infection and poor oral hygiene. Closer review.'],
  ['preg','caution','Pregnancy','Avoid X-rays (OPG, cephalometric) unless essential. Gums bleed easily with braces.']
 ],tips:[
  'Braces pain: paracetamol first (NSAIDs may slow tooth movement; the evidence is mixed).',
  'Mouth ulcers from brackets: orthodontic wax; lidocaine gel (check the allergy) or benzydamine rinse.',
  'Chlorhexidine only for a short time (it stains).']}
};

/* ---- tags for a patient in a field ---- */
function rxSpWhen(T,w){w=Array.isArray(w)?w:[w];return w.every(x=>String(x).split('|').some(t=>t[0]=='!'?!T.has(t.slice(1)):T.has(t)))}
/* tags that come from the record of the field (the latest one, or the values being typed) */
function rxSpCtx(k,r){r=r||{};const T=[],h=(x,re)=>re.test(String(x||''));
 if(k=='endo'){h(r.pulp,/pulpitis/i)&&T.push('pulpitis');h(r.pulp,/necrosis/i)&&T.push('necrosis');h(r.apical,/Acute apical abscess/)&&T.push('abscess');h(r.apical,/Chronic apical abscess/)&&T.push('chronic');h(r.visit,/Retreatment/)&&T.push('retx')}
 if(k=='omfs'){h(r.anes,/sedation/i)&&T.push('sed');h(r.anes,/General/)&&T.push('ga');h(r.proc,/extraction|Impacted/i)&&T.push('ext');h(r.proc,/Fracture/)&&T.push('fx');h(r.proc,/Abscess/)&&T.push('absc');h(r.proc,/Sinus/)&&T.push('sinus');h(r.comp,/Dry socket/)&&T.push('drysock')}
 if(k=='impl'){h(r.graft,/Sinus/)&&T.push('sinus');(r.graft&&r.graft!='None')&&T.push('graft')}
 if(k=='perio'){h(r.risk,/Smoking/)&&T.push('smoke');h(r.stage,/III|IV/)&&T.push('severe');h(r.phase,/surgical/i)&&T.push('psurg')}
 if(k=='pros'){h(r.type,/denture/i)&&T.push('denture');h(r.type,/splint/i)&&T.push('splint')}
 return T}
function rxSpTags(p,k,r){const T=new Set(rxProf(p));T.add('*');if(!p)return T;
 const R=(p.d.rec||[]).map(x=>x.f).filter(Boolean),HL=p.d.health||[],c=p.d.consent||{},o=(f,kk,v)=>!!f[kk]&&(f[kk+'_o']||[]).includes(v),any=g=>R.some(f=>{try{return !!g(f)}catch(e){return false}});
 const al=[...HL.map(x=>x.allergy||''),...R.map(f=>(f.allergyd||'')+' '+(f.allergy_other||''))].join(' ').toLowerCase(),
  all=[c.o,...HL.map(x=>(x.allergy||'')+' '+(x.note||'')),...R.map(f=>[f.allergyd,f.allergy_other,f.meds,f.htn_meds,f.diab_meds_o&&f.diab_meds_o.join(' '),f.ochr_d,f.autoimm_d].filter(Boolean).join(' '))].join(' ').toLowerCase(),add=(t,v)=>{if(v)T.add(t)};
 add('chx',/chlorhex|hibiclens|corsodyl|hibiscrub/.test(al));add('naocl',/hypochlor|naocl|bleach|clorox/.test(al));add('nickel',/nickel/.test(al));add('acryl',/acryl|methacryl|pmma|monomer/.test(al));
 add('metal',/cobalt|chrom|palladium|\bgold\b|\bmetals?\b|titanium/.test(al));add('ti',/titanium/.test(al));add('eug',/eugenol|clove/.test(al));add('iod',/iodine|betadine|povidone/.test(al));add('sulfite',/sulfite|sulphite/.test(al));add('tetra',/tetracycl|doxycycl|minocycl/.test(al));
 add('smoke',any(f=>o(f,'subst','Smoking')));add('ocp',/contracept|\bocp\b|ethinyl|microgynon|levonorg|\bthe pill\b/.test(all));
 add('ovg',/nifedipine|amlodipine|verapamil|diltiazem|felodipine|nicardipine|phenytoin|epanutin|dilantin|cyclosporin|ciclosporin|sandimmun/.test(all));
 add('xero',T.has('ssri')||/antihistamine|chlorphen|loratadine|cetirizine|amitriptyline|oxybutynin|atropine|furosemide|hydrochlorothiazide|diuretic|antipsychotic|haloperidol|risperidone/.test(all));
 add('ster',/prednis|dexameth|steroid|cortico|hydrocort/.test(all));
 add('dmab',any(f=>o(f,'antires','Denosumab')));add('ivbp',any(f=>f.antires&&(f.antires_route=='IV')));
 add('dmpoor',any(f=>f.diab&&(f.diab_ctl=='Poor'||parseFloat(f.diab_a1c)>8)));
 add('rtjaw',any(f=>f.cancer&&/head|neck|jaw|mouth|oral|tongue|throat|larynx|face|nasophar|sinus/i.test(f.cancer_site||'')));
 add('osa',any(f=>o(f,'resp','Sleep apnea')));
 const a=+p.age;if(a>0)add('u18',a<18);
 const pr=(p.d.perio||[]).slice(-1)[0];add('perioact',!!pr&&/Stage (III|IV)/.test(pr.stage||'')&&!/Maintenance/.test(pr.phase||''));
 const rec=r||(p.d[k]||[]).slice(-1)[0];rxSpCtx(k,rec).forEach(t=>T.add(t));
 return T}

/* ---- the checks ---- */
const rxSpCap=s=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();
function rxSpRules(k){return [...((RXY[k]||{}).drug||[]),...RXY.all.drug]}
/* medicine / material text -> alerts of the field (same shape as rxCheck: {drug,sev,why,fld}) */
function rxSpDrug(p,k,text,r){if(!p||!RXY[k])return [];const T=rxSpTags(p,k,r),t=String(text||''),out=[],seen={};
 rxSpRules(k).forEach(d=>{const m=t.match(d.m);if(!m)return;const drug=d.show?rxSpCap(m[0])+' - '+d.n:d.n;
  d.r.forEach(x=>{if(!rxSpWhen(T,x[0]))return;const key=drug+'|'+x[2];if(seen[key])return;seen[key]=1;out.push({drug,sev:x[1],why:x[2],fld:RXFL[k]})})});
 const ord={avoid:0,caution:1,info:2};return out.sort((a,b)=>ord[a.sev]-ord[b.sev])}
/* patient alerts of the field (no medicine needed) */
function rxSpCase(p,k,r){if(!p||!RXY[k])return [];const T=rxSpTags(p,k,r),ord={avoid:0,caution:1,info:2};
 return [...RXY[k].cs,...RXY.all.cs].filter(c=>rxSpWhen(T,c[0])).map(c=>({sev:c[1],drug:c[2],why:c[3],fld:RXFL[k]})).sort((a,b)=>ord[a.sev]-ord[b.sev])}
const rxSpRecText=o=>Object.keys(o||{}).map(x=>o[x]).join(' ; ');
const rxSpRecDrug=(p,k,o)=>rxSpDrug(p,k,rxSpRecText(o),o);

/* prescription check: the general check plus the medicine rules of the case field */
{const _rc=rxCheck;rxCheck=function(p,text){const L=_rc.apply(this,arguments),k=rxField(p);if(k=='gen'||!RXY[k])return L;
 const seen={};L.forEach(a=>seen[a.drug+'|'+a.why]=1);const X=rxSpDrug(p,k,text).filter(a=>a.sev!='info'&&!seen[a.drug+'|'+a.why]);if(!X.length)return L;
 return L.concat(X).sort((a,b)=>(a.sev=='avoid'?0:1)-(b.sev=='avoid'?0:1))}}

/* ---- the field box ---- */
function rxSpBox(p,k){if(!RXY[k])return '';const L=rxSpCase(p,k),A=L.filter(a=>a.sev=='avoid'),C=L.filter(a=>a.sev=='caution'),I=L.filter(a=>a.sev=='info'),nm=rxFName(k),ic=typeof FUFLD!='undefined'&&FUFLD[k]?FUFLD[k].i:'fa-pills';
 const one=a=>`<div class="rounded-lg border p-2 mb-1.5 text-sm ${a.sev=='avoid'?'bg-red-50 border-red-400 text-red-900':a.sev=='caution'?'bg-amber-50 border-amber-400 text-amber-900':'bg-sky-50 border-sky-300 text-sky-900'}"><b>${a.sev=='avoid'?'<i class="fa fa-ban mr-1"></i>AVOID / CHECK':a.sev=='caution'?'<i class="fa fa-triangle-exclamation mr-1"></i>Caution':'<i class="fa fa-circle-info mr-1"></i>Guide'}: ${H(a.drug)}</b><div>${H(a.why)}</div></div>`;
 const guide=I.length+RXY[k].tips.length?`<details class="mt-1"><summary class="text-sm cursor-pointer text-gray-700"><i class="fa fa-book-medical mr-1"></i>Usual medicine guide for ${H(nm.toLowerCase())}</summary><div class="mt-1">${I.map(one).join('')}<ul class="list-disc pl-5 text-sm text-gray-700">${RXY[k].tips.map(x=>`<li>${H(x)}</li>`).join('')}</ul></div></details>`:'';
 const none=!A.length&&!C.length;
 return `<div class="rounded-lg border ${none?'border-green-300 bg-green-50':'border-red-300 bg-white'} p-2 mb-3"><b class="text-sm ${none?'text-green-800':'text-red-800'}"><i class="fa ${ic} mr-1"></i>${H(nm)}: medicine and medical alerts for this patient</b>
  ${!rxHasHx(p)?'<div class="text-sm text-gray-600 my-1"><i class="fa fa-circle-info mr-1"></i>No medical history is recorded yet, so only the general guide is shown. Ask about allergies, blood thinners, pregnancy and other illnesses.</div>':none?'<div class="text-sm text-green-800 my-1">No special '+H(nm.toLowerCase())+' medicine risk found in the file. Still check with the patient.</div>':`<div class="mt-1" style="max-height:45vh;overflow-y:auto">${A.map(one).join('')}${C.map(one).join('')}</div>`}${guide}</div>`}

/* page of a specialty record: box under the title */
{const _s=sec;sec=function(p){const h=_s.apply(this,arguments),k=SK;if(typeof h!='string'||!RXFK.includes(k))return h;
 const i=h.indexOf('</div>');return i<0?h:h.slice(0,i+6)+rxSpBox(p,k)+h.slice(i+6)}}  /* (the Ortho Follow-up page adds its own box in ortho.js) */

/* prescription page: pick the case field, then the box */
function rxSpPick(p){const au=typeof fuGuess=='function'?fuGuess(p):'gen',cur=RXFO.k&&RXFO.pid==p.id?RXFO.k:'';
 return `<div class="flex flex-wrap items-center gap-2 mb-2 text-sm"><label class="font-medium"><i class="fa fa-user-doctor mr-1"></i>Case field</label><select class="inp" style="width:auto;margin:0" onchange="rxFieldSet(this.value)"><option value="" ${cur?'':'selected'}>Automatic - ${H(rxFName(au))}</option>${['gen',...RXFK].map(x=>`<option value="${x}" ${cur==x?'selected':''}>${H(rxFName(x))}</option>`).join('')}</select><span class="text-xs text-gray-500">The medicine alerts follow the field of the case.</span></div>`}
function rxSpWrap(p){const k=rxField(p);return rxSpPick(p)+(k!='gen'?rxSpBox(p,k):'')}
function rxFieldSet(v){const p=gp();if(!p)return;RXFO={pid:p.id,k:v||''};const w=$('rxs_wrap');if(w)w.innerHTML=rxSpWrap(p);rxAlertPaint()}
{const _b=rxSafeBox;rxSafeBox=function(p){return _b.apply(this,arguments)+`<div id="rxs_wrap">${rxSpWrap(p)}</div>`}}

/* new / edited specialty record: live alerts while the form is filled; a conflicting medicine, irrigant or material needs a reason */
function rxSpLive(p,k,f){const h=document.querySelector('#mb h3');if(!h)return;
 h.insertAdjacentHTML('afterend','<div id="rxs_live" class="mb-3"><div id="rxs_list"></div><div id="rxs_whyw" class="hidden"><label class="block text-sm font-medium text-red-700 mb-1">Why do you still continue? (required)</label><input id="rxs_why" class="inp mb-2" maxlength="160" placeholder="For example: no alternative, physician agreed"></div></div>');
 const val=()=>{const o={};f.forEach(x=>{const e=$('f_'+x[0]);if(e)o[x[0]]=(e.value||'').trim()});return o};
 const row=a=>`<div class="rounded-lg border p-2 mb-1.5 text-sm ${a.sev=='avoid'?'bg-red-50 border-red-400 text-red-900':'bg-amber-50 border-amber-400 text-amber-900'}"><b><i class="fa fa-triangle-exclamation mr-1"></i>${a.sev=='avoid'?'AVOID':'Caution'}: ${H(a.drug)}</b><div>${H(a.why)}</div></div>`;
 const paint=()=>{const o=val(),D=rxSpRecDrug(p,k,o).filter(a=>a.sev!='info'),seen={};D.forEach(a=>seen[a.why]=1);const Cs=rxSpCase(p,k,o).filter(a=>a.sev!='info'&&!seen[a.why]),el=$('rxs_list');if(!el)return;
  el.innerHTML=(D.length?`<div style="max-height:30vh;overflow-y:auto">${D.map(row).join('')}</div>`:'')+(Cs.length?`<details class="mb-1"><summary class="text-sm cursor-pointer text-amber-800"><i class="fa fa-triangle-exclamation mr-1"></i>${Cs.length} medical alert${Cs.length>1?'s':''} for this patient (${H(rxFName(k).toLowerCase())}) - tap to read</summary><div class="mt-1" style="max-height:30vh;overflow-y:auto">${Cs.map(row).join('')}</div></details>`:'');
  const w=$('rxs_whyw');if(w)w.classList.toggle('hidden',!D.some(a=>a.sev=='avoid'))};
 f.forEach(x=>{const e=$('f_'+x[0]);if(e){e.addEventListener('change',paint);e.addEventListener('input',paint)}});paint()}
{const _fm=form;form=function(t,f,v,ok){const k=SK,p=typeof gp=='function'?gp():null;
 if(!(p&&RXFK.includes(k)&&SEC[k]&&Array.isArray(f)&&(t===SEC[k].b||t==='Edit')&&f.some(x=>x[0]==SEC[k].f[0][0])))return _fm.apply(this,arguments);
 const isNew=t===SEC[k].b,ok2=o=>{const L=rxSpRecDrug(p,k,o).filter(a=>a.sev!='info'),av=L.some(a=>a.sev=='avoid'),why=(($('rxs_why')||{}).value||'').trim();
  if(av&&why.length<3)return bad('A medicine, irrigant or material in this record conflicts with the patient file (see the red alert). Write the reason to continue, or change the choice.');
  RXSP_PEND=isNew&&L.length?{by:U.name,at:Date.now(),why:av?why:'',alerts:L.map(a=>(a.sev=='avoid'?'AVOID ':'Caution ')+a.drug+': '+a.why)}:null;
  try{return ok(o)}finally{RXSP_PEND=null}};
 const r=_fm.call(this,t,f,v,ok2);try{rxSpLive(p,k,f)}catch(e){}return r}}
{const _m=mkItem;mkItem=function(k,v,p){const r=_m.apply(this,arguments);try{if(r&&RXSP_PEND&&RXFK.includes(k))r.rxa=RXSP_PEND}catch(e){}return r}}
/* record card: shows that it was saved after an alert */
{const _ic=iCard;iCard=function(k,x,i){const h=_ic.apply(this,arguments);if(typeof h!='string'||!x||!x.rxa||!RXFK.includes(k))return h;
 const a=x.rxa,n=`<div class="text-xs mt-1 text-amber-700"><i class="fa fa-triangle-exclamation mr-1"></i>Saved after a medicine alert${a.why?' - reason: '+H(a.why):''}: ${(a.alerts||[]).map(H).join('; ')}</div>`,j=h.indexOf('</div><div class="space-x-3');return j<0?h:h.slice(0,j)+n+h.slice(j)}}

/* ---------- Printed blank Dental Record in English / Amharic / Afaan Oromoo / Soomaali ----------
   One line per phrase:  English | Amharic | Afaan Oromoo | Soomaali.  Anything missing falls back to English.
   Edit a line here to change a printed word. (Drug names, abbreviations and Latin terms are kept as clinicians use them.) */
const RLANGS=[['en','English'],['am','አማርኛ'],['om','Afaan Oromoo'],['so','Soomaali']];
const RLT=(()=>{const T={am:{},om:{},so:{}};`
COMPREHENSIVE DENTAL RECORD|አጠቃላይ የጥርስ ህክምና መዝገብ|QABXII YAALII ILKAANII WALIIGALAA|DIIWAANKA GUUDKA AH EE ILKAHA
Blank form|ባዶ ቅጽ|Unka duwwaa|Foom madhan
Clinic|ክሊኒክ|Kilinikii|Kiliinig
Record No.|የመዝገብ ቁጥር|Lakkoofsa galmee|Lambarka diiwaanka
Date|ቀን|Guyyaa|Taariikh
Patient|ታካሚ|Dhukkubsataa|Bukaan
ID|መታወቂያ ቁጥር|Lakk. eenyummaa (ID)|Aqoonsi (ID)
Dentist|የጥርስ ሐኪም|Hakiima ilkaanii|Dhakhtarka ilkaha
SIGNATURES|ፊርማዎች|MALLATTOO|SAXIIXYADA
Patient/Guardian|ታካሚ/አሳዳጊ|Dhukkubsataa/Eegduu|Bukaan/Ilaaliye
Legend|ማብራሪያ|Ibsa|Sharaxaad
H = Healthy · C = Caries · F = Filled · Cr = Crown · RCT = Root canal · I = Implant · M = Missing|H = ጤናማ · C = የበሰበሰ · F = የተሞላ · Cr = ዘውድ · RCT = የስር ህክምና · I = ኢምፕላንት · M = የጠፋ|H = Fayyaa · C = Bulaa'e · F = Guutame · Cr = Gonfoo · RCT = Yaalii hidda · I = Implaantii · M = Dhabame|H = Caafimaad · C = Jirid · F = Buuxsan · Cr = Taaj · RCT = Daawaynta xididka · I = Implaant · M = Maqan
Notes (write here)|ማስታወሻ (እዚህ ይጻፉ)|Yaadannoo (as irratti barreessi)|Qoraal (halkan ku qor)
CHIEF COMPLAINT & GENERAL HISTORY|ዋና ቅሬታ እና አጠቃላይ ታሪክ|KOMII QOPHAA FI HISTORIIN WALIIGALAA|CABASHADA UGU WEYN & TAARIIKHDA GUUD
Complaint|ቅሬታ|Komii|Cabasho
Duration|የቆየበት ጊዜ|Yeroo turee|Muddada
Severity|የህመሙ ጥንካሬ|Cimina dhukkubbii|Darnaanta
Mild|ቀላል|Salphaa|Fudud
Moderate|መካከለኛ|Giddu galeessa|Dhexdhexaad
Severe|ከባድ|Cimaa|Daran u xun
Location|ቦታ|Bakka|Goobta
Character|የህመሙ ባህሪ|Amala dhukkubbii|Nooca xanuunka
Throbbing|የሚመታ|Rukutaa|Garaacaya
Sharp|ስል|Qara|Af leh
Dull|ደብዛዛ|Laafaa|Aan af lahayn
Burning|የሚያቃጥል|Gubaa|Gubanaya
Aggravating|የሚያባብሰው|Kan hammeessu|Waxa sii dara
Relieving|የሚያስታግሰው|Kan salphisu|Waxa yareeya
Associated|ተጓዳኝ ምልክቶች|Mallattoo waliin dhufan|Calaamado la socda
Swelling|እብጠት|Bubbuqqee|Barar
Fever|ትኩሳት|Hoʼisa|Qandho
Bleeding|ደም መፍሰስ|Dhiigaa|Dhiig-bax
Limited opening|አፍ አለመከፈት|Afaan banuu rakkachuu|Af-furasho xaddidan
Dental Hx|የጥርስ ታሪክ|Seenaa ilkaanii|Taariikhda ilkaha
Fillings|ሙሌት|Guuttoo|Buuxin
RCT|RCT (የስር ህክምና)|RCT (Yaalii hidda)|RCT (Daawaynta xididka)
Crowns|ዘውድ|Gonfoo|Taaj
Extractions|ጥርስ ንቀላ|Ilkaan baasuu|Ka-saarid ilko
Ortho|ኦርቶ|Ortho|Ortho
Implants|ኢምፕላንት|Implaantii|Implaant
Last visit|የመጨረሻ ጉብኝት|Daawwannaa dhumaa|Booqashadii ugu dambeysay
PREVIOUS TREATMENTS / SURGERIES (Dental & Medical)|ቀደም ያሉ ህክምናዎች / ቀዶ ጥገናዎች (የጥርስና የሕክምና)|YAALII / QAXXAAMURAA DURII (Ilkaanii fi Yaalaa)|DAAWOOYIN / QALLIINADA HORE (Ilko & Caafimaad)
Previous treatments / surgeries|ቀደም ያሉ ህክምናዎች / ቀዶ ጥገናዎች|Yaalii / qaxxaamuraa durii|Daawayn / qalliin hore
None|ምንም|Hin jiru|Midna
Previous dental treatment|ቀደም የጥርስ ህክምና|Yaalii ilkaanii duraa|Daawayn ilko oo hore
Previous dental surgery|ቀደም የጥርስ ቀዶ ጥገና|Qaxxaamuraa ilkaanii duraa|Qalliin ilko oo hore
Previous medical surgery|ቀደም የሕክምና ቀዶ ጥገና|Qaxxaamuraa yaalaa duraa|Qalliin caafimaad oo hore
Previous hospitalization|ቀደም ሆስፒታል መተኛት|Hospitaala bulchuu duraa|Seexasho isbitaal oo hore
Previous general anesthesia|ቀደም አጠቃላይ ማደንዘዣ|Anesthesia guutuu duraa|Suuxdin guud oo hore
Previous blood transfusion|ቀደም ደም መቀበል|Dhiiga dabalachuu duraa|Dhiig-shub hore
Previous implant surgery|ቀደም የኢምፕላንት ቀዶ ጥገና|Qaxxaamuraa implaantii duraa|Qalliin implaant oo hore
Previous orthodontic treatment|ቀደም የጥርስ ማስተካከያ ህክምና|Yaalii ortho duraa|Daawayn ortho oo hore
Previous orthognathic surgery|ቀደም የመንጋጋ ቀዶ ጥገና (orthognathic)|Qaxxaamuraa orthognathic duraa|Qalliin orthognathic oo hore
Previous periodontal surgery|ቀደም የድድ ቀዶ ጥገና|Qaxxaamuraa ciinaa duraa|Qalliin ceeriin oo hore
Previous oral/maxillofacial surgery|ቀደም የአፍ/የፊት መንጋጋ ቀዶ ጥገና|Qaxxaamuraa afaanii/maxillofacial duraa|Qalliin af/maxillofacial oo hore
Previous trauma surgery|ቀደም የጉዳት ቀዶ ጥገና|Qaxxaamuraa miidhaa duraa|Qalliin dhaawac oo hore
Previous biopsy|ቀደም ባዮፕሲ|Biopsii duraa|Biopsy hore
Other|ሌላ|Kan biroo|Kale
Previous Dental Treatments/Surgeries|ቀደም የጥርስ ህክምናዎች/ቀዶ ጥገናዎች|Yaalii/qaxxaamuraa ilkaanii duraa|Daawayn/qalliin ilko oo hore
Extraction|ንቀላ|Baasuu|Ka-saarid
Crown/Bridge|ዘውድ/ድልድይ|Gonfoo/Riqicha|Taaj/Buundo
Denture|ሰው ሰራሽ ጥርስ|Ilkaan tolfamaa|Ilko macmal ah
Implant|ኢምፕላንት|Implaantii|Implaant
Periodontal surgery|የድድ ቀዶ ጥገና|Qaxxaamuraa ciinaa|Qalliin ceeriin
Oral surgery|የአፍ ቀዶ ጥገና|Qaxxaamuraa afaanii|Qalliin af
Orthognathic surgery|የመንጋጋ ቀዶ ጥገና (orthognathic)|Qaxxaamuraa orthognathic|Qalliin orthognathic
Trauma surgery|የጉዳት ቀዶ ጥገና|Qaxxaamuraa miidhaa|Qalliin dhaawac
Biopsy|ባዮፕሲ|Biopsii|Biopsy
Previous Medical Surgeries/Procedures|ቀደም የሕክምና ቀዶ ጥገናዎች/ሂደቶች|Qaxxaamuraa/adeemsa yaalaa duraa|Qalliin/habraacyo caafimaad oo hore
Appendectomy|አፔንዲክስ ማውጣት|Appendisii baasuu|Qaadista appendix
Tonsillectomy|ቶንሲል ማውጣት|Tonsil baasuu|Qaadista tonsil
Cardiac surgery|የልብ ቀዶ ጥገና|Qaxxaamuraa onnee|Qalliinka wadnaha
Joint replacement|መገጣጠሚያ መተካት|Wal-qabsiisaa bakka buusuu|Beddelka xubnaha
Transplant|ንቅለ ተከላ|Dhaaluu (Transplant)|Beddelka xubin (Transplant)
Cesarean section|ቄሳሪያን|Qaxxaamuraa Siizeriyaanii|Qalliin Cesarean
Anesthesia complications|የማደንዘዣ ችግሮች|Rakkoo anesthesia|Dhibaatooyin suuxdin
Blood transfusion history|የደም መቀበል ታሪክ|Seenaa dhiiga dabalachuu|Taariikhda dhiig-shubka
Post-operative complications|ከቀዶ ጥገና በኋላ ችግሮች|Rakkoo booda qaxxaamuraa|Dhibaatooyin qalliinka dabadiis
Previous Treatment/Surgery Details|ቀደም ህክምና/ቀዶ ጥገና ዝርዝር|Bal'ina yaalii/qaxxaamuraa duraa|Faahfaahinta daawayn/qalliin hore
Year|ዓመት|Waggaa|Sanad
Type/Procedure|ዓይነት/ሂደት|Gosa/Adeemsa|Nooca/Habraaca
Hospital/Clinic|ሆስፒታል/ክሊኒክ|Hospitaala/Kilinikii|Isbitaal/Kiliinig
Surgeon/Physician|ቀዶ ጠጋኝ/ሐኪም|Hakiima qaxxaamuraa/Hakiima|Dhakhtarka qalliinka/Dhakhtar
Outcome/Complications|ውጤት/ችግሮች|Bu'aa/Rakkoo|Natiijo/Dhibaatooyin
MEDICAL & INFECTIOUS DISEASE HISTORY (Expanded)|የሕክምና እና ተላላፊ በሽታዎች ታሪክ (ዝርዝር)|HISTORIIN DHUKKUBA YAALAA FI DHUKKUBA DADDARBAA (Bal'ifame)|TAARIIKHDA CUDURRADA & CUDURRADA FAAFA (La balaadhiyay)
2.1 Chronic Diseases & Conditions|2.1 ሥር የሰደዱ በሽታዎች እና ሁኔታዎች|2.1 Dhukkuboota dheeraa fi haala|2.1 Cudurrada raaga ah & Xaaladaha
Diabetes|የስኳር በሽታ|Dhibee Sukkaaraa|Sonkorowga
Type|ዓይነት|Gosa|Nooca
Type 1|ዓይነት 1|Gosa 1|Nooca 1
Type 2|ዓይነት 2|Gosa 2|Nooca 2
Control|ቁጥጥር|To'annoo|Xakamaynta
Good|ጥሩ|Gaarii|Wanaagsan
Fair|መካከለኛ|Giddu galeessa|Dhexdhexaad
Poor|ደካማ|Hamaa|Liita
Meds|መድኃኒቶች|Qoricha|Daawooyin
Insulin|ኢንሱሊን|Insuuliinii|Insuliin
OHA|OHA (የአፍ መድኃኒት)|OHA (Qoricha afaanii)|OHA (Kiniin afka)
Diet|አመጋገብ|Nyaata|Cunto-xakamayn
Hypoglycemia Hx|የስኳር መቀነስ ታሪክ|Seenaa sukkaara gadi bu'uu|Taariikhda sonkor hoos u dhac
Yes|አዎ|Eeyyee|Haa
No|አይደለም|Lakki|Maya
Hypertension|ከፍተኛ የደም ግፊት|Dhiibbaa dhiigaa ol'aanaa|Dhiig-karka
BP (e.g. 130/85)|የደም ግፊት (ለምሳሌ 130/85)|Dhiibbaa dhiigaa (fkn 130/85)|Cadaadiska dhiigga (tusaale 130/85)
Controlled|ቁጥጥር ስር ያለ|To'ataame|La xakameeyay
Cardiovascular|የልብ እና የደም ቧንቧ|Onnee fi hidda dhiigaa|Wadnaha & xididdada
Angina|የደረት ሕመም (Angina)|Dhukkubbii laphee (Angina)|Xanuunka laabta (Angina)
MI|የልብ ድካም (MI)|Onnee dhaʼuu (MI)|Wadne-xanuun (MI)
Heart failure|የልብ ድካም|Onneen hanqachuu|Wadne daciifnaan
Arrhythmia|ያልተስተካከለ የልብ ምት|Rukkina onnee dogoggoraa|Garaaca wadnaha oo aan caadi ahayn
Valve disease|የልብ ቫልቭ በሽታ|Dhukkuba valvii onnee|Cudurka valve-ka wadnaha
Stroke|ስትሮክ|Istirookii|Istaroog
Rheumatic fever|የሩማቲክ ትኩሳት|Hoʼisa rheumatic|Qandhada rheumatic
Prosthetic joint|ሰው ሰራሽ መገጣጠሚያ|Wal-qabsiisaa tolfamaa|Xubin macmal ah
Previous infective endocarditis|ቀደም የልብ ውስጠኛ ሽፋን ኢንፌክሽን|Endokaardiitisii duraa|Endocarditis hore
Congenital heart disease|ሲወለድ የነበረ የልብ በሽታ|Dhukkuba onnee dhalootaa|Cudurka wadnaha ee dhalashada
Anticoagulant/antiplatelet|ደም ማቅጠኛ|Qoricha dhiiga dadhabsiisu|Dhiig-khafiifiye
Warfarin|ዋርፋሪን|Warfaariin|Warfarin
Aspirin|አስፒሪን|Aspiriinii|Aspirin
Respiratory|የመተንፈሻ አካል|Sirna afuufaa|Neefsashada
Asthma|አስም|Asmaa|Neefta (Asthma)
Sleep apnea|የእንቅልፍ አፕኒያ|Apnea hirriba|Neef-ku-nuuxsiga hurdada
Past TB|ቀደም ቲቢ|TB duraa|TB hore
Renal|ኩላሊት|Kalee|Kelyaha
CKD|ሥር የሰደደ የኩላሊት በሽታ (CKD)|CKD|CKD
Dialysis|ዳያሊስስ|Dayaaliisisii|Dialysis
CKD stage|የCKD ደረጃ|Sadarkaa CKD|Heerka CKD
Liver|ጉበት|Tiruu|Beerka
Hepatitis|ሄፓታይተስ|Hepatitis (Dhukkuba tiruu)|Hepatitis
Alcohol use|አልኮል መጠቀም|Alkoolii fayyadamuu|Isticmaalka khamriga
Gastrointestinal|የምግብ መፍጫ አካል|Sirna nyaata hiikuu|Dheefshiidka
Peptic ulcer|የጨጓራ ቁስለት|Madaa garaa|Boogta calool (Ulcer)
Endocrine|ኢንዶክራይን|Endokriinii|Endocrine (Qanjirada)
Neurological|የነርቭ|Narvii|Neerfaha
Epilepsy|የሚጥል በሽታ|Dhukkuba kufaa|Suuxdin (Epilepsy)
Seizures|መንቀጥቀጥ/ሚጥል|Kufaa|Gariir/Suuxdin
Parkinson’s|ፓርኪንሰን|Parkinson|Parkinson
Psychiatric|የአእምሮ ጤና|Dhukkuba sammuu|Cilmi-nafsi
Anxiety|ጭንቀት|Yaaddoo|Walaac
Depression|ድብርት|Dhiphina|Murugo (Depression)
Bleeding disorder|የደም መፍሰስ ችግር|Rakkoo dhiigaa|Cudurka dhiig-baxa
Details|ዝርዝር|Bal'ina|Faahfaahin
Immunosuppression|የበሽታ መከላከል መቀነስ|Of-ittisa hir'ate|Difaaca jirka oo daciifay
Chemo|ኬሞ|Kiimoo|Kiimo
Steroids|ስቴሮይድ|Isteroyidii|Steroid
Autoimmune disease|ራስን የሚያጠቃ በሽታ|Dhukkuba of-qaama dhukkubsu|Cudurka difaaca jirka
Cancer/radiotherapy|ካንሰር/ራዲዮቴራፒ|Kaansarii/Raadiyoo-yaalii|Kansar/Shucaac-daawo
Site|ቦታ|Bakka|Goobta
Antiresorptive|ፀረ-ሪዞርፕቲቭ መድኃኒት|Qoricha antiresorptive|Daawada antiresorptive
Route|መንገድ|Karaa|Dariiqa
IV|በደም ሥር (IV)|IV (Hidda dhiigaan)|IV (Xidid)
Oral|በአፍ|Afaaniin|Afka
Pregnancy|እርግዝና|Ulfa|Uur
Weeks|ሳምንታት|Torbanoota|Toddobaadyo
Lactation|ጡት ማጥባት|Harma hoosisuu|Nuujin
Substance use|ንጥረ ነገር መጠቀም|Fayyadama wantoota|Isticmaalka maandooriyaha
Smoking|ሲጋራ ማጨስ|Sigaaraa xuuxuu|Sigaar cabbid
Alcohol|አልኮል|Alkoolii|Khamri
Drugs|አደንዛዥ ዕፅ|Dirugii|Maandooriyaha
Smoking per day|በቀን የሚጨስ ሲጋራ|Sigaaraa guyyaatti|Sigaar maalintii
Other chronic disease|ሌላ ሥር የሰደደ በሽታ|Dhukkuba dheeraa kan biroo|Cudur raaga ah oo kale
2.2 Infectious Disease Screening|2.2 የተላላፊ በሽታ ምርመራ|2.2 Ilaalcha dhukkuba daddarbaa|2.2 Baadhista cudurrada faafa
None known|የሚታወቅ የለም|Kan beekamu hin jiru|Midna lama yaqaan
Active|ንቁ|Hojii irra|Firfircoon
Carrier|ተሸካሚ|Baatuu|Qaade
Vaccinated|የተከተበ|Talaallii fudhatee|La tallaalay
Unknown|ያልታወቀ|Hin beekamne|Aan la aqoon
Treated|የታከመ|Yaalame|La daweeyay
Positive|ፖዘቲቭ|Poozitiivii|Togan
Past|ያለፈ|Darbe|Hore
Contact|ንክኪ ያለው|Wal-qunnamtii|Taabasho
Recent fever/infection|የቅርብ ጊዜ ትኩሳት/ኢንፌክሽን|Hoʼisa/infeekshiniin dhiyoo|Qandho/infekshin dhawaan
Herpes/cold sore|ሄርፒስ/የከንፈር ቁስል|Herpes/madaa funyaan|Herpes/boog bushimaha
Syphilis/other STI|ቂጥኝ/ሌላ STI|Sifiilisii/STI biroo|Syphilis/STI kale
MRSA/contact infection|MRSA/በንክኪ የሚተላለፍ|MRSA/infeekshinii wal-qunnamtii|MRSA/infekshin taabasho
Recent respiratory infection/COVID|የቅርብ ጊዜ የመተንፈሻ ኢንፌክሽን/ኮቪድ|Infeekshinii afuufaa/COVID dhiyoo|Infekshin neef-mareenka/COVID dhawaan
Other infectious disease|ሌላ ተላላፊ በሽታ|Dhukkuba daddarbaa kan biroo|Cudur faafa oo kale
2.3 Allergies|2.3 አለርጂ|2.3 Aleerjii|2.3 Xasaasiyad
Allergic to|አለርጂ ለ|Aleerjii kan|Xasaasiyad ku
Penicillin|ፔኒሲሊን|Peniisiliinii|Penicillin
NSAID|NSAID (የህመም ማስታገሻ)|NSAID (Qoricha dhukkubbii)|NSAID (Daawada xanuun jaoojiya)
Local anesthetic|የአካባቢ ማደንዘዣ|Dhibaa'insa naannoo|Suuxdin goob (Local)
2.4 Current Medications|2.4 አሁን የሚወስዳቸው መድኃኒቶች|2.4 Qoricha amma fudhatu|2.4 Daawooyinka hadda la qaato
Current medications|አሁን የሚወስዳቸው መድኃኒቶች|Qoricha amma fudhatu|Daawooyinka hadda la qaato
Physician/contact|ሐኪም/አድራሻ|Hakiima/Bilbila|Dhakhtar/La xiriirka
Phone|ስልክ|Bilbila|Taleefan
Last medical review|የመጨረሻ የሕክምና ግምገማ|Ilaalcha yaalaa dhumaa|Dib-u-eegis caafimaad ugu dambeeyay
2.5 Vital Signs|2.5 አስፈላጊ የሰውነት ምልክቶች|2.5 Mallattoo qaamaa (Vital signs)|2.5 Calaamadaha nolosha
BP|የደም ግፊት|Dhiibbaa dhiigaa|Cadaadis dhiig
Pulse|ምት|Rukkina onnee|Garaaca
Respiratory rate|የትንፋሽ መጠን|Saffisa afuufaa|Heerka neefsashada
Temperature|የሰውነት ሙቀት|Hoʼa qaamaa|Heerkulka
2.6 Medical Alerts & Precautions|2.6 የሕክምና ማስጠንቀቂያ እና ጥንቃቄዎች|2.6 Akeekkachiisa yaalaa fi of-eeggannoo|2.6 Digniino caafimaad & Taxaddar
MEDICAL ALERT|የሕክምና ማስጠንቀቂያ|AKEEKKACHIISA YAALAA|DIGNIIN CAAFIMAAD
Specify|ይግለጹ|Ibsi|Sheeg
Precautions (tick all that apply)|ጥንቃቄዎች (የሚመለከተውን ሁሉ ምልክት ያድርጉ)|Of-eeggannoo (kan ta'e hunda mallattoo godhi)|Taxaddarro (calaamadee dhammaan kuwa khuseeya)
BP check|የደም ግፊት መለካት|Dhiibbaa dhiigaa safaruu|Hubinta cadaadiska dhiigga
Glucose check|የስኳር መለካት|Sukkaara safaruu|Hubinta sonkorta
Antibiotic prophylaxis|መከላከያ አንቲባዮቲክ|Antibaayootikii of-ittisaa|Antibiyootik ka-hortag
Consult physician|ሐኪም ማማከር|Hakiima mari'achuu|La tashi dhakhtarka
Avoid epinephrine|ኤፒኔፍሪን ማስወገድ|Epinephrine of qusachuu|Ka fogow epinephrine
INR/DOAC check|INR/DOAC መለካት|INR/DOAC ilaaluu|Hubi INR/DOAC
Dialysis timing|የዳያሊስስ ጊዜ|Yeroo dayaaliisisii|Waqtiga dialysis-ka
Pregnancy positioning|የእርግዝና አቀማመጥ|Teessisa ulfaa|Qaabka fadhiga uurka
Airborne precautions|በአየር ለሚተላለፍ ጥንቃቄ|Of-eeggannoo qilleensaan|Taxaddar hawada
Contact precautions|በንክኪ ለሚተላለፍ ጥንቃቄ|Of-eeggannoo wal-qunnamtii|Taxaddar taabasho
Post-exposure protocol|ከተጋለጡ በኋላ የሚወሰድ እርምጃ|Adeemsa booda saaxilamuu|Habraaca ka dib soo-gaadhis
Local hemostatic measures|የደም ማቆሚያ እርምጃዎች|Tarkaanfii dhiigni dhaabuu naannoo|Tallaabooyin joojinta dhiigga
Short appointment|አጭር ቀጠሮ|Beellama gabaabaa|Ballan gaaban
Morning appointment|የጠዋት ቀጠሮ|Beellama ganamaa|Ballan subax
Avoid nephrotoxic drugs|ኩላሊት የሚጎዱ መድኃኒቶችን ማስወገድ|Qoricha kalee miidhu of qusachuu|Ka fogow daawooyin kelyaha waxyeeleeya
Antibiotic prophylaxis indication|የመከላከያ አንቲባዮቲክ ምክንያት|Sababa antibaayootikii of-ittisaa|Sababta antibiyootik ka-hortagga
GENERAL EXAMINATION|አጠቃላይ ምርመራ|QORANNOO WALIIGALAA|BAADHISTA GUUD
Extraoral|ከአፍ ውጭ|Afaan alaa|Af-dibadeed
Normal|መደበኛ|Idilee|Caadi
Lymphadenopathy|የሊምፍ እጢ እብጠት|Bubbuqqee lymph|Bararka qanjirada lymph
Intraoral soft tissue|የአፍ ውስጥ ለስላሳ ሕብረ ሕዋስ|Qaamaa laafaa afaan keessaa|Unugyada jilicsan ee af-gudaha
Ulcer|ቁስለት|Madaa|Boog
Redness|መቅላት|Diimaa|Casaan
Occlusion|የጥርስ አገጣጠም|Wal-qabsiisa ilkaanii|Ku-xirnaanta ilkaha
Class I|ክፍል I|Kutaa I|Fasalka I
Class II|ክፍል II|Kutaa II|Fasalka II
Class III|ክፍል III|Kutaa III|Fasalka III
Assessment|ግምገማ|Madaallii|Qiimeyn
SPECIALTY HISTORY & FINDINGS (Hx + Findings + Classification)|የልዩ ዘርፍ ታሪክ እና ግኝቶች (ታሪክ + ግኝት + ምደባ)|HISTORIIN SPEESHAALISTII FI ARGAMOOTA (Seenaa + Argaa + Garee)|TAARIIKHDA & NATIIJOOYINKA TAKHASUSKA (Taariikh + Natiijo + Qaybin)
4.1 Orthodontic|4.1 የጥርስ ማስተካከያ (Orthodontic)|4.1 Ortodontii|4.1 Orthodontic (Toosinta ilkaha)
Hx|ታሪክ|Seenaa|Taariikh
Previous ortho|ቀደም ኦርቶ|Ortho duraa|Ortho hore
Thumb/digit habit|ጣት መጥባት ልማድ|Amala quba mi'eessuu|Caado far-nuugid
Mouth breathing|በአፍ መተንፈስ|Afaaniin afuufuu|Afka ku neefsasho
Tongue thrust|ምላስ መግፋት|Arrabni dhiibuu|Carrab-riixid
Chewing difficulty|ማኘክ መቸገር|Qaruu rakkachuu|Dhib calaalin
Findings|ግኝቶች|Argamoota|Natiijooyin
Crowding|የጥርስ መጨናነቅ|Ilkaan wal-irra jiraachuu|Ilko isku-buuq
Spacing|ክፍተት|Gargar-bahuu|Meel banaan
Open bite|ክፍት ንክሻ (Open bite)|Open bite|Open bite
Deep bite|ጥልቅ ንክሻ (Deep bite)|Deep bite|Deep bite
Midline deviation|የመሃል መስመር መዛባት|Sarara giddu galeessaa jallachuu|Dhaqaaqa xariiqda dhexe
Overjet (mm)|Overjet (ሚሜ)|Overjet (mm)|Overjet (mm)
Overbite (mm)|Overbite (ሚሜ)|Overbite (mm)|Overbite (mm)
Angle’s Class|የአንግል ክፍል|Garee Angle|Fasalka Angle
4.2 Periodontic|4.2 የድድ (Periodontic)|4.2 Ciinaa (Periodontic)|4.2 Ceeriin (Periodontic)
Bleeding gums|ድድ መድማት|Ciinni dhiiguu|Ceeriin dhiig-baxa
Previous perio tx|ቀደም የድድ ህክምና|Yaalii ciinaa duraa|Daawayn ceeriin hore
Bad breath|መጥፎ ትንፋሽ|Afaan hamaa|Neef xun
Plaque|የጥርስ ንጣፍ|Plaakii|Plaque
Calculus|ታርታር|Tartaarii|Tartar
Gingivitis|ድድ እብጠት|Gingivitis (Bubbuqqee ciinaa)|Gingivitis (Barar ceeriin)
PD (mm)|PD (ሚሜ)|PD (mm)|PD (mm)
Recession|ድድ መሸሽ|Ciinni duubatti deebi'uu|Ceeriin hoos-u-dhac
Mobility|መንቀሳቀስ|Sochii|Dhaqdhaqaaq
Gingiva|ድድ|Ciinaa|Ceeriin
Healthy|ጤናማ|Fayyaa|Caafimaad qaba
Inflamed|የተቃጠለ|Bubbuqe|Barar leh
Hyperplastic|ከመጠን በላይ ያደገ|Hyperplastic (Guddate)|Hyperplastic (Ka weyn)
2017 Classification Stage|የ2017 ምደባ ደረጃ|Sadarkaa garee 2017|Heerka qaybinta 2017
Extent|ስፋት|Bal'ina|Baaxad
Localized (<30%)|በአንድ አካባቢ (<30%)|Naannoo tokkotti (<30%)|Goob gaar ah (<30%)
Generalized (>30%)|አጠቃላይ (>30%)|Waliigalaa (>30%)|Guud (>30%)
Molar-incisor pattern|የመንጋጋ-ፊት ጥርስ ቅርጽ|Qaama Molar-incisor|Qaabka Molar-incisor
4.3 Maxillofacial|4.3 የመንጋጋና ፊት (Maxillofacial)|4.3 Maxillofacial|4.3 Maxillofacial
Trauma|ጉዳት|Miidhaa|Dhaawac
Surgery|ቀዶ ጥገና|Qaxxaamuraa|Qalliin
TMJ pain/click|TMJ ህመም/ድምፅ|Dhukkubbii/sagalee TMJ|Xanuun/dhawaaq TMJ
Asymmetry|አለመመጣጠን|Walfakkaataa dhabuu|Aan sinnayn
Facial symmetry|የፊት መመጣጠን|Walfakkaatina fuulaa|Sinnaanta wejiga
TMJ tenderness|TMJ ሲነካ ህመም|Dhukkubbii tuquu TMJ|Xanuun taabasho TMJ
Click/pop|ድምፅ/ጠቅታ|Sagalee|Dhawaaq
Deviation on opening|አፍ ሲከፈት መዛባት|Afaan banuu irratti jallachuu|Gees-u-leexasho marka la furo
Opening (mm)|የአፍ መክፈት (ሚሜ)|Banaa afaanii (mm)|Furitaanka (mm)
Le Fort Classification|Le Fort ምደባ|Garee Le Fort|Qaybinta Le Fort
ZMC fracture|ZMC ስብራት|Cabiinsa ZMC|Jabka ZMC
Mandibular fracture|የታችኛው መንጋጋ ስብራት|Cabiinsa mandibula|Jabka daanka hoose
4.4 Dental Trauma|4.4 የጥርስ ጉዳት|4.4 Miidhaa ilkaanii|4.4 Dhaawaca ilkaha
Fall|መውደቅ|Kufuu|Dhicid
Sports injury|የስፖርት ጉዳት|Miidhaa ispoortii|Dhaawac isboorti
RTA|የመንገድ ትራፊክ አደጋ|Balaa daandii|Shil gaadiid
Assault|ድብደባ|Haleellaa|Weerar
Biting hard object|ጠንካራ ነገር መንከስ|Wantaa jabaa qaaluu|Qaniinid shay adag
Previous trauma|ቀደም ጉዳት|Miidhaa duraa|Dhaawac hore
Fracture|ስብራት|Cabiinsa|Jab
Luxation|መንሸራተት (Luxation)|Luxation|Luxation
Intrusion|ወደ ውስጥ መግባት|Gara keessaa seenuu|Gudaha gelid
Extrusion|ወደ ውጭ መውጣት|Gara alaa bahuu|Dibadda ka baxid
Avulsion|ሙሉ በሙሉ መውደቅ (Avulsion)|Guutummaatti bahuu (Avulsion)|Ka-baxid dhammaystiran (Avulsion)
Mobile tooth|የሚንቀሳቀስ ጥርስ|Ilkaan socho'u|Ilig dhaqdhaqaaqa
Discoloration|ቀለም መቀየር|Halluu jijjiiruu|Midab beddelid
Pulp exposure|ፐልፕ መጋለጥ|Pulpii saaxilamuu|Pulp soo-baxay
Root fracture|የስር ስብራት|Cabiinsa hidda ilkaanii|Jabka xididka
Alveolar fracture|የአልቪዮላር ስብራት|Cabiinsa alveolar|Jabka alveolar
Soft tissue injury|ለስላሳ ሕብረ ሕዋስ ጉዳት|Miidhaa qaama laafaa|Dhaawac unugyo jilicsan
Ellis Classification|Ellis ምደባ|Garee Ellis|Qaybinta Ellis
Class I (enamel)|ክፍል I (ኢናሜል)|Kutaa I (enamel)|Fasalka I (enamel)
Class II (enamel+dentin)|ክፍል II (ኢናሜል+ዴንቲን)|Kutaa II (enamel+dentin)|Fasalka II (enamel+dentin)
Class III (pulp)|ክፍል III (ፐልፕ)|Kutaa III (pulp)|Fasalka III (pulp)
Class IV (root)|ክፍል IV (ስር)|Kutaa IV (hidda)|Fasalka IV (xidid)
Class V (avulsion)|ክፍል V (ሙሉ መውደቅ)|Kutaa V (bahuu)|Fasalka V (ka-baxid)
Class VI (root fracture)|ክፍል VI (የስር ስብራት)|Kutaa VI (cabiinsa hidda)|Fasalka VI (jabka xididka)
Andreasen Classification|Andreasen ምደባ|Garee Andreasen|Qaybinta Andreasen
Enamel infraction|የኢናሜል ስንጥቅ|Dhiphina enamel|Dildilaac enamel
Enamel fracture|የኢናሜል ስብራት|Cabiinsa enamel|Jabka enamel
Crown fracture (uncomplicated)|የዘውድ ስብራት (ያልተወሳሰበ)|Cabiinsa gonfoo (hin walxaxaa)|Jabka taajka (aan adkayn)
Crown fracture (complicated)|የዘውድ ስብራት (የተወሳሰበ)|Cabiinsa gonfoo (walxaxaa)|Jabka taajka (adag)
Crown-root fracture|የዘውድ-ስር ስብራት|Cabiinsa gonfoo-hidda|Jabka taaj-xidid
Extrusive luxation|ወደ ውጭ መንሸራተት|Extrusive luxation|Extrusive luxation
Lateral luxation|ወደ ጎን መንሸራተት|Lateral luxation|Lateral luxation
Intrusive luxation|ወደ ውስጥ መንሸራተት|Intrusive luxation|Intrusive luxation
4.5 Endodontic|4.5 የጥርስ ስር ህክምና (Endodontic)|4.5 Endodontii|4.5 Endodontic (Xididka)
Previous RCT|ቀደም RCT|RCT duraa|RCT hore
Sensitivity to hot/cold|ለሞቀ/ለቀዘቀዘ ስሜታዊነት|Ho'aa/qabbanaa'aa dhaga'uu|Dareen kulayl/qabow
Spontaneous pain|ያለምክንያት ህመም|Dhukkubbii of-danda'ee|Xanuun iskiis ah
Sinus tract|የሳይነስ መንገድ (መግል መውጫ)|Karaa sinus (dhangala'aa)|Marinka sinus (malax)
Caries|የጥርስ መበስበስ|Ilkaan bulaa'uu|Ilko-jirid (Caries)
Non-vital|ሕይወት የሌለው|Hin jiraanne (Non-vital)|Aan nool ahayn
Percussion tenderness|ሲመታ ህመም|Dhukkubbii rukutuu|Xanuun garaacid
Palpation tenderness|ሲነካ ህመም|Dhukkubbii tuquu|Xanuun taabasho
Periapical radiolucency|በስር ዙሪያ ጥቁር ቦታ በኤክስሬይ|Radiolucency periapical|Radiolucency periapical
Resorption|መሟጠጥ (Resorption)|Resorption|Resorption
4.6 Restorative / Caries|4.6 ማደስ / የጥርስ መበስበስ|4.6 Deebisanii yaaluu / Ilkaan bulaa'uu|4.6 Dib-u-soo-celin / Ilko-jirid
Previous fillings|ቀደም ሙሌቶች|Guuttoo duraa|Buuxin hore
Fractured restoration|የተሰበረ ሙሌት|Guuttoon cabe|Buuxin jabay
Food impaction|ምግብ መቀረት|Nyaanni qabamuu|Cuntada ku-hakata
Sensitivity|ስሜታዊነት|Dhaga'amuu|Dareen
Defective restoration|ጉድለት ያለበት ሙሌት|Guuttoon hir'ate|Buuxin cilladaysan
Marginal leakage|የጠርዝ ፍሳሽ|Dhangala'uu cinaa|Daadasho geesaha
Fractured cusp|የተሰበረ ጫፍ|Cusp cabe|Cusp jabay
Wear/faceting|መሸርሸር|Wear/faceting|Xidid/xoq
Missing tooth structure|የጠፋ የጥርስ ክፍል|Qaama ilkaanii dhabame|Qaab-dhismeed ilko oo luntay
Caries Classification (G.V. Black)|የመበስበስ ምደባ (G.V. Black)|Garee Caries (G.V. Black)|Qaybinta Caries (G.V. Black)
Class IV|ክፍል IV|Kutaa IV|Fasalka IV
Class V|ክፍል V|Kutaa V|Fasalka V
Class VI|ክፍል VI|Kutaa VI|Fasalka VI
Depth|ጥልቀት|Gad-fageenya|Qoto-dheer
Pulp|ፐልፕ|Pulpii|Pulp
4.7 Prosthodontic|4.7 ሰው ሰራሽ ጥርስ (Prosthodontic)|4.7 Prosthodontii|4.7 Prosthodontic (Ilko macmal)
Previous crowns/bridges|ቀደም ዘውድ/ድልድይ|Gonfoo/riqicha duraa|Taaj/buundo hore
Dentures|ሰው ሰራሽ ጥርሶች|Ilkaan tolfamaa|Ilko macmal ah
Removable partial|የሚወጣ ከፊል|Qaama baasamu|Qayb la saari karo
Implant prosthesis|ኢምፕላንት ሰው ሰራሽ|Implaantii tolfamaa|Implaant macmal
Missing teeth|የጠፉ ጥርሶች|Ilkaan dhabame|Ilko maqan
Edentulous space|ጥርስ የሌለበት ቦታ|Bakka ilkaan hin qabne|Meel ilko la'aan
Defective crown/bridge|ጉድለት ያለበት ዘውድ/ድልድይ|Gonfoo/riqicha hir'ate|Taaj/buundo cillad leh
Denture fit issue|የሰው ሰራሽ ጥርስ አለመስማማት|Rakkoo ilkaan tolfamaa|Dhibaato ku-habboonaan ilko macmal
Occlusal imbalance|የንክሻ አለመመጣጠን|Wal-qixxaa'uu dhabuu|Isku-xirnaan la'aan
Abutment condition|የአባትመንት ሁኔታ|Haala abutment|Xaaladda abutment
4.8 Pediatric Dentistry|4.8 የሕፃናት ጥርስ ህክምና|4.8 Ilkaan daa'immanii|4.8 Ilkaha carruurta
First dental visit|የመጀመሪያ የጥርስ ጉብኝት|Daawwannaa ilkaanii jalqabaa|Booqasho ilko oo ugu horreysa
Bottle/nursing|ጠርሙስ/ጡት|Fuudhaa/harma|Haruur/nuujin
Thumb sucking|ጣት መጥባት|Quba mi'eessuu|Far-nuugid
Fluoride use|ፍሎራይድ መጠቀም|Fluoraayidii fayyadamuu|Isticmaalka fluoride
ECC|ECC (በልጅነት መበስበስ)|ECC|ECC
Delayed eruption|የዘገየ ጥርስ መውጣት|Ilkaan bahuu turuu|Soo-baxid dib-u-dhac
Space maintainer needed|የቦታ ጠባቂ ያስፈልጋል|Eegduun bakkaa barbaachisa|Loo baahan yahay ilaaliyaha goobta
Behavior management needed|የባህሪ አያያዝ ያስፈልጋል|To'annoo amala barbaachisa|Loo baahan yahay maaraynta dabeecadda
4.9 Oral Medicine / Oral Pathology|4.9 የአፍ ሕክምና / የአፍ በሽታ ጥናት|4.9 Yaalii afaanii / Dhukkuba afaanii|4.9 Daawada af / Cudurrada af
Ulcers|ቁስለቶች|Madaa|Boogaha
Dry mouth|ደረቅ አፍ|Afaan goggogaa|Af engegan
Burning mouth|የሚያቃጥል አፍ|Afaan gubaa|Af gubanaya
Lesions|ቁስሎች/ለውጦች|Madaa/jijjiirama|Nabarro
Systemic disease|የሰውነት ሥርዓት በሽታ|Dhukkuba qaamaa guutuu|Cudur jidhka oo dhan
White patch|ነጭ ንጣፍ|Mudaa adii|Tilmaam cad
Red patch|ቀይ ንጣፍ|Mudaa diimaa|Tilmaam cas
Pigmentation|ቀለም መቀየር|Halluu|Midabayn
Mucosal lesion|የሙከስ ሽፋን ቁስል|Madaa mukoosaa|Nabar mucosa
Salivary gland issue|የምራቅ እጢ ችግር|Rakkoo salivary gland|Dhibaato qanjirka candhuufta
Halitosis|መጥፎ የአፍ ጠረን|Urgaa afaanii|Ur xun oo af
4.10 Oral Surgery|4.10 የአፍ ቀዶ ጥገና|4.10 Qaxxaamuraa afaanii|4.10 Qalliinka af
Impaction|ተቆላልፎ መቅረት (Impaction)|Impaction (Qabamuu)|Impaction
Anticoagulants|ደም ማቅጠኛ መድኃኒት|Qoricha dhiiga dadhabsiisu|Dhiig-khafiifiyayaal
Impacted tooth|የተቆለፈ ጥርስ|Ilkaan qabame|Ilig ku-xayiran
Infection|ኢንፌክሽን|Infeekshinii|Infekshin
Impaction Classification (Winter’s)|የ Impaction ምደባ (Winter)|Garee Impaction (Winter)|Qaybinta Impaction (Winter)
Vertical|ቁመታዊ|Dhaabbataa|Toosan
Horizontal|አግድም|Utubaa|Siman
4.11 Implantology|4.11 ኢምፕላንቶሎጂ|4.11 Implaantoloojii|4.11 Implantology
Previous implants|ቀደም ኢምፕላንቶች|Implaantii duraa|Implaant hore
Bone graft|የአጥንት ንቅለ ተከላ|Lafee dhaabuu (Bone graft)|Bone graft
Failed implant|የከሸፈ ኢምፕላንት|Implaantii kufe|Implaant guuldarraystay
Missing tooth space|የጠፋ ጥርስ ቦታ|Bakka ilkaan dhabame|Meel ilig maqan
Bone volume|የአጥንት መጠን|Hamma lafee|Cabbirka lafta
Soft tissue condition|የለስላሳ ሕብረ ሕዋስ ሁኔታ|Haala qaama laafaa|Xaaladda unugyo jilicsan
Implant stability|የኢምፕላንት መረጋጋት|Tasgabbii implaantii|Xasiloonida implaant
Prosthesis condition|የሰው ሰራሽ አካል ሁኔታ|Haala qaama tolfamaa|Xaaladda macmal
DENTAL CHART (FDI)|የጥርስ ሰንጠረዥ (FDI)|KAARTAA ILKAANII (FDI)|KAARKA ILKAHA (FDI)
Investigation (X-ray, lab, vitality test... ordered / results)|ምርመራ (ኤክስሬይ፣ ላብ፣ ... የታዘዘ / ውጤት)|Qorannoo (X-ray, laabii ... ajajame / bu'aa)|Baadhis (X-ray, shaybaar ... la dalbay / natiijo)
Tooth findings|የጥርስ ግኝቶች|Argamoota ilkaanii|Natiijooyinka ilkaha
Tooth|ጥርስ|Ilkaan|Ilig
Finding|ግኝት|Argaa|Natiijo
Notes|ማስታወሻ|Yaadannoo|Qoraal
DIAGNOSIS|ምርመራ ውጤት (ዲያግኖሲስ)|DIYAAGNOOSIISII|BAADHIS-CUDUR (DIAGNOSIS)
Primary|ዋና|Isa duraa (Ijoo)|Aasaasi
Secondary|ሁለተኛ|Isa lammaffaa|Labaad
Specialty diagnosis|የልዩ ዘርፍ ዲያግኖሲስ|Diyaagnoosisii speeshaalistii|Diagnosis takhasus
TREATMENT PLAN|የህክምና ዕቅድ|PLAANII YAALII|QORSHAHA DAAWAYNTA
Treatment plan|የህክምና ዕቅድ|Plaanii yaalii|Qorshaha daawaynta
Tooth/Area|ጥርስ/አካባቢ|Ilkaan/Naannoo|Ilig/Goob
Case type|የጉዳይ ዓይነት|Gosa dhimma|Nooca xaaladda
Orthodontic|ኦርቶዶንቲክ|Ortodontii|Orthodontic
Endodontic|ኢንዶዶንቲክ|Endodontii|Endodontic
Prosthodontic|ፕሮስቶዶንቲክ|Prosthodontii|Prosthodontic
Periodontic|ፔሪዮዶንቲክ|Periodontii|Periodontic
Oral surgery (dental trauma)|የአፍ ቀዶ ጥገና (የጥርስ ጉዳት)|Qaxxaamuraa afaanii (miidhaa ilkaanii)|Qalliinka af (dhaawaca ilkaha)
Procedure|ሂደት|Adeemsa|Habraac
Status|ሁኔታ|Haala|Xaalad
Planned|የታቀደ|Karoorfame|La qorsheeyay
Done|ተከናውኗል|Raawwatame|La sameeyay
Fee|ክፍያ|Kaffaltii|Khidmad
Anesthesia|ማደንዘዣ|Anesthesia|Suuxdin
Treatment today|የዛሬ ህክምና|Yaalii har'aa|Daawaynta maanta
Post-op instructions|ከቀዶ ጥገና በኋላ መመሪያ|Qajeelfama booda qaxxaamuraa|Tilmaamaha qalliinka ka dib
Given|ተሰጥቷል|Kennameera|La bixiyay
Not given|አልተሰጠም|Hin kennamne|Lama bixin
FOLLOW-UP|ክትትል|HORDOFFII|KA-DIB-EEGIS
Next appointment|ቀጣይ ቀጠሮ|Beellama itti aanu|Ballanta xigta
Recall|ማስታወሻ ጥሪ|Deebi'ee waamuu|Dib-u-xasuusin
3 mo|3 ወር|Ji 3|3 bilood
6 mo|6 ወር|Ji 6|6 bilood
12 mo|12 ወር|Ji 12|12 bilood
PRN|እንደ አስፈላጊነቱ (PRN)|Yeroo barbaachisu|Marka loo baahdo
`.trim().split('\n').forEach(l=>{const a=l.split('|');if(a.length==4){T.am[a[0]]=a[1];T.om[a[0]]=a[2];T.so[a[0]]=a[3]}});return T})();
const rlTr=(lang,s)=>lang&&lang!='en'?((RLT[lang]||{})[s]||s):s;

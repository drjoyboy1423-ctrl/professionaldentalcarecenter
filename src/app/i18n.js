/* ---------- App language: English / አማርኛ / Afaan Oromoo / Soomaali ----------
   Translates what is on screen (menus, buttons, headings, labels, messages). Patient data, names, drug names and
   diagnoses are never changed. One line per phrase:  English | Amharic | Afaan Oromoo | Soomaali.
   Anything missing stays in English; edit a line below to correct a word.  Phrases from the printed record form are reused. */
const LANGS=[['en','English'],['am','አማርኛ'],['om','Afaan Oromoo'],['so','Soomaali']];
const UIT=(()=>{const T={am:Object.assign({},RLT.am),om:Object.assign({},RLT.om),so:Object.assign({},RLT.so)};`
Dashboard|ዳሽቦርድ|Gabatee Odeeffannoo|Dashboodhka
Appointment|ቀጠሮ|Beellama|Ballan
Appointments|ቀጠሮዎች|Beellamoota|Ballamaha
New Appointment|አዲስ ቀጠሮ|Beellama Haaraa|Ballan Cusub
New Appointment +|አዲስ ቀጠሮ +|Beellama Haaraa +|Ballan Cusub +
Recent Patient|የቅርብ ታካሚ|Dhukkubsataa Dhiyoo|Bukaan Dhawaan
Recent Patients|የቅርብ ታካሚዎች|Dhukkubsatoota Dhiyoo|Bukaanno Dhawaan
New Patient Card|አዲስ የታካሚ ካርድ|Kaardii Dhukkubsataa Haaraa|Kaarka Bukaan Cusub
New Patient +|አዲስ ታካሚ +|Dhukkubsataa Haaraa +|Bukaan Cusub +
Analytics|ትንተና|Xiinxala|Falanqeyn
Invoice Manager|የደረሰኝ አስተዳደር|Bulchiinsa Fiixee|Maamulka Biilasha
Print Center|የህትመት ማዕከል|Giddugala Maxxansaa|Xarunta Daabacaadda
Print center|የህትመት ማዕከል|Giddugala Maxxansaa|Xarunta daabacaadda
Finance|ፋይናንስ|Faayinaansii|Maaliyadda
Finished Laboratory|የተጠናቀቀ ላቦራቶሪ|Laabiraatrii Xumurame|Shaybaarka La Dhammeeyay
Procedure|ሂደት|Adeemsa|Habraac
Users|ተጠቃሚዎች|Fayyadamtoota|Isticmaalayaasha
Clinics|ክሊኒኮች|Kilinikoota|Kiliinikooyin
All Clinics Report|የሁሉም ክሊኒኮች ሪፖርት|Gabaasa Kilinikoota Hunda|Warbixinta Dhammaan Kiliinikooyinka
Disease|በሽታ|Dhibee|Cudur
Disease Information|የበሽታ መረጃ|Odeeffannoo Dhibee|Macluumaadka Cudurka
Profile|መገለጫ|Piroofaayilii|Astaanta
My Profile|የእኔ መገለጫ|Piroofaayilii Koo|Astaantayda
Daily Cash Close|የቀን ገንዘብ መዝጊያ|Cufaa Maallaqa Guyyaa|Xidhista Lacagta Maalinlaha
Activity Log|የእንቅስቃሴ መዝገብ|Galmee Sochii|Diiwaanka Dhaqdhaqaaqa
Settings|ቅንብሮች|Qindaa'ina|Dejinta
All Patients (Directory)|ሁሉም ታካሚዎች (ማውጫ)|Dhukkubsatoota Hunda (Galmee)|Dhammaan Bukaanka (Tusaale)
Finished / Inactive|የተጠናቀቁ / ንቁ ያልሆኑ|Xumuraman / Hojii Hin Qabne|La Dhammeeyay / Aan Firfircoonayn
Finished / Inactive Patients|የተጠናቀቁ / ንቁ ያልሆኑ ታካሚዎች|Dhukkubsatoota Xumuraman / Hojii Hin Qabne|Bukaanka La Dhammeeyay / Aan Firfircoonayn
Orders Inbox|የትዕዛዝ መቀበያ|Ergaa Ajaja|Sanduuqa Dalabyada
My Order Tracker|የእኔ ትዕዛዝ መከታተያ|Hordoffii Ajaja Koo|Raadraaca Dalabyadayda
Dental Materials|የጥርስ ህክምና ቁሳቁሶች|Meeshaalee Ilkaanii|Walxaha Ilkaha
Sterilization Log|የማምከን መዝገብ|Galmee Dhiqannaa Meeshaa|Diiwaanka Nadiifinta Qalabka
Reports Dashboard|የሪፖርት ዳሽቦርድ|Gabatee Gabaasaa|Dashboodhka Warbixinnada
Log out|ውጣ|Ba'i|Ka bax
Logout|ውጣ|Ba'i|Ka bax
Sign In|ግባ|Seeni|Gal
Username|የተጠቃሚ ስም|Maqaa Fayyadamaa|Magaca Isticmaalaha
Username or email|የተጠቃሚ ስም ወይም ኢሜይል|Maqaa Fayyadamaa ykn Imeelii|Magaca isticmaalaha ama iimaylka
Password|የይለፍ ቃል|Jecha Darbii|Furaha Sirta ah
Enter your password|የይለፍ ቃልዎን ያስገቡ|Jecha darbii kee galchi|Geli furahaaga sirta ah
Welcome back! Please sign in to your account.|እንኳን በደህና መጡ! እባክዎ ወደ መለያዎ ይግቡ።|Baga nagaan dhufte! Maaloo akkaawuntii kee seeni.|Soo dhawoow! Fadlan gal akoonkaaga.
Invalid username or password.|የተሳሳተ የተጠቃሚ ስም ወይም የይለፍ ቃል።|Maqaan fayyadamaa ykn jechi darbii dogoggora.|Magaca isticmaalaha ama furaha sirta ah waa khalad.
Remember my username|የተጠቃሚ ስሜን አስታውስ|Maqaa fayyadamaa koo yaadadhu|Xasuuso magacayga
Remember this clinic|ይህን ክሊኒክ አስታውስ|Kilinikii kana yaadadhu|Xasuuso kiliinikkan
Forgot your password? Send a reset link to my email|የይለፍ ቃልዎን ረሱ? ወደ ኢሜይሌ መልሶ ማስጀመሪያ አገናኝ ላክ|Jecha darbii dagatte? Hidda deebisanii qopheessuu gara imeelii koo ergi|Ma illowday furahaaga? U dir isku xirka dib u dejinta iimaylkayga
Cancel|ሰርዝ|Haqi|Jooji
Save|አስቀምጥ|Olkaa'i|Kaydi
Close|ዝጋ|Cufi|Xidh
Edit|አርትዕ|Gulaali|Wax ka beddel
Delete|ሰርዝ|Haqi|Tirtir
Add|ጨምር|Dabaali|Ku dar
Add +|ጨምር +|Dabaali +|Ku dar +
+ Add|+ ጨምር|+ Dabaali|+ Ku dar
Print|አትም|Maxxansi|Daabac
Search|ፈልግ|Barbaadi|Raadi
Search patients|ታካሚዎችን ፈልግ|Dhukkubsatoota barbaadi|Raadi bukaanka
Refresh|አድስ|Haaromsi|Cusboonaysii
Loading...|በመጫን ላይ...|Fe'aa jira...|Waa la rarayaa...
Yes|አዎ|Eeyyee|Haa
No|አይ|Lakki|Maya
All|ሁሉም|Hunda|Dhammaan
Any|ማንኛውም|Kamiyyuu|Mid kasta
Other|ሌላ|Kan biraa|Kale
Name|ስም|Maqaa|Magac
Full name|ሙሉ ስም|Maqaa guutuu|Magaca oo dhan
Phone|ስልክ|Bilbila|Taleefan
Phone Number|ስልክ ቁጥር|Lakkoofsa Bilbilaa|Lambarka Taleefanka
Email|ኢሜይል|Imeelii|Iimayl
Age|እድሜ|Umrii|Da'
Sex|ጾታ|Saala|Jinsi
Male|ወንድ|Dhiira|Lab
Female|ሴት|Dhaltuu|Dheddig
Date|ቀን|Guyyaa|Taariikh
Date of Birth|የትውልድ ቀን|Guyyaa Dhaloota|Taariikhda Dhalashada
Time|ሰዓት|Yeroo|Waqti
Today|ዛሬ|Har'a|Maanta
Day|ቀን|Guyyaa|Maalin
Month|ወር|Ji'a|Bil
Year|ዓመት|Waggaa|Sannad
Status|ሁኔታ|Haala|Xaalad
Note|ማስታወሻ|Yaada|Qoraal
Notes|ማስታወሻዎች|Yaadota|Qoraallo
Title|ርዕስ|Mata duree|Cinwaan
Type|ዓይነት|Gosa|Nooca
Total|ድምር|Waliigala|Wadarta
Paid|የተከፈለ|Kafalame|La bixiyay
Pending|በመጠባበቅ ላይ|Eegaa jira|La sugayo
Partial|ከፊል|Hamma tokko|Qayb
Completed|ተጠናቅቋል|Xumurame|La dhammeeyay
Completed today|ዛሬ የተጠናቀቁ|Har'a xumuraman|Maanta la dhammeeyay
Active|ንቁ|Hojii irra|Firfircoon
Active patients|ንቁ ታካሚዎች|Dhukkubsatoota hojii irra|Bukaan firfircoon
Doctor|ሐኪም|Hakiima|Dhakhtar
Nurse|ነርስ|Narsii|Kalkaaliye
Manager|ሥራ አስኪያጅ|Bulchaa|Maamule
Reception|መቀበያ|Simannaa|Soo dhaweyn
Admin|አስተዳዳሪ|Bulchaa|Maamule
Role|ሚና|Gahee|Doorka
Patient|ታካሚ|Dhukkubsataa|Bukaan
Patients|ታካሚዎች|Dhukkubsatoota|Bukaanka
Patient Card|የታካሚ ካርድ|Kaardii Dhukkubsataa|Kaarka Bukaanka
Patient card|የታካሚ ካርድ|Kaardii dhukkubsataa|Kaarka bukaanka
Card No|የካርድ ቁጥር|Lakkoofsa Kaardii|Lambarka Kaarka
Card number|የካርድ ቁጥር|Lakkoofsa kaardii|Lambarka kaarka
Register patient|ታካሚ መዝግብ|Dhukkubsataa galmeessi|Diiwaan geli bukaan
Register & Issue Card|መዝግብና ካርድ ስጥ|Galmeessiitii Kaardii Kenni|Diiwaan geli oo Kaar sii
New card|አዲስ ካርድ|Kaardii haaraa|Kaar cusub
Registered|የተመዘገበ|Galmaa'e|La diiwaan geliyay
New registrations|አዲስ ምዝገባዎች|Galmeewwan haaraa|Diiwaangelinno cusub
Place Order|ትዕዛዝ ስጥ|Ajaja Kenni|Dalab Samee
Send order|ትዕዛዝ ላክ|Ajaja ergi|U dir dalabka
Order|ትዕዛዝ|Ajaja|Dalab
New order|አዲስ ትዕዛዝ|Ajaja haaraa|Dalab cusub
New Order|አዲስ ትዕዛዝ|Ajaja Haaraa|Dalab Cusub
Total New Orders|አጠቃላይ አዲስ ትዕዛዞች|Ajajoota Haaraa Waliigalaa|Wadarta Dalabyada Cusub
Edit Order|ትዕዛዝ አርትዕ|Ajaja Gulaali|Wax ka beddel Dalabka
Mark Completed|እንደተጠናቀቀ ምልክት አድርግ|Akka xumurametti mallatteessi|U calaamadee La Dhammeeyay
Mark finished|እንደጨረሰ ምልክት አድርግ|Akka xumurametti mallatteessi|U calaamadee La Dhammeeyay
Assign Doctor|ሐኪም መድብ|Hakiima Ramadi|U Magacaaw Dhakhtar
Not assigned to a doctor|ለሐኪም ያልተመደቡ|Hakiimaaf kan hin ramadamne|Aan dhakhtar loo magacaabin
Priority|ቅድሚያ|Dursa|Mudnaan
Urgent|አስቸኳይ|Ariifachiisaa|Degdeg
Routine|መደበኛ|Idilee|Caadi
Ordered|ታዟል|Ajajameera|La dalbay
Orders|ትዕዛዞች|Ajajoota|Dalabyada
Dental X-Rays|የጥርስ ራጅ|Ra'ii Ilkaanii|Raajooyinka Ilkaha
Clinical Lab Tests|የክሊኒክ ላብራቶሪ ምርመራዎች|Qorannoo Laabiraatrii Kilinikaa|Baaritaannada Shaybaarka
Prosthodontic Lab|የሰው ሰራሽ ጥርስ ላብራቶሪ|Laabiraatrii Ilkaan Hojjetamaa|Shaybaarka Ilkaha Macmalka ah
Drug Prescriptions|የመድሃኒት ማዘዣዎች|Qajeelfama Qoricha|Warqadaha Dawada
Invoices / Billing|ደረሰኞች / ክፍያ|Fiixeewwan / Kaffaltii|Biilasha / Lacag bixinta
Invoices|ደረሰኞች|Fiixeewwan|Biilasha
Invoice|ደረሰኝ|Fiixee|Biil
Invoice Register|የደረሰኝ መዝገብ|Galmee Fiixee|Diiwaanka Biilasha
New Invoice|አዲስ ደረሰኝ|Fiixee Haaraa|Biil Cusub
New Invoice +|አዲስ ደረሰኝ +|Fiixee Haaraa +|Biil Cusub +
Proforma|ፕሮፎርማ|Proofoormaa|Proforma
Proforma Records|የፕሮፎርማ መዝገቦች|Galmee Proofoormaa|Diiwaanka Proforma
Payment|ክፍያ|Kaffaltii|Lacag bixin
Payments|ክፍያዎች|Kaffaltiiwwan|Lacag bixinno
Add payment|ክፍያ ጨምር|Kaffaltii dabaali|Ku dar lacag bixin
Balance|ቀሪ ሂሳብ|Hafteewwan|Haraaga
Balance:|ቀሪ፡|Hafteewwan:|Haraaga:
Billed|የተሰራ ደረሰኝ|Kan fiixeen baasame|La biilay
Collected|የተሰበሰበ|Kan walitti qabame|La ururiyay
Discount:|ቅናሽ፡|Hir'ina:|Dhimis:
Method|ዘዴ|Mala|Hab
Cash|ጥሬ ገንዘብ|Qarshii harkaa|Lacag caddaan
Refund|ተመላሽ ገንዘብ|Deebii Maallaqaa|Lacag Celin
Price|ዋጋ|Gatii|Qiimaha
Quantity|ብዛት|Baay'ina|Tirada
Item|ዕቃ|Meeshaa|Shay
Items|ዕቃዎች|Meeshaalee|Shayada
Description|መግለጫ|Ibsa|Sharaxaad
Procedure / Item|ሂደት / ዕቃ|Adeemsa / Meeshaa|Habraac / Shay
Doctor:|ሐኪም፡|Hakiima:|Dhakhtar:
Created By:|የፈጠረው፡|Kan uume:|Waxa sameeyay:
Search filters|የፍለጋ ማጣሪያዎች|Calaqqisiistota Barbaaddaa|Shaandhooyinka Raadinta
Sort by|በ ደርድር|Tartiibsi|Ku kala saar
Sort by date:|በቀን ደርድር፡|Guyyaadhaan tartiibsi:|Ku kala saar taariikhda:
Newest first|አዲሱ መጀመሪያ|Kan haaraa jalqaba|Kuwa ugu cusub marka hore
Oldest first|አሮጌው መጀመሪያ|Kan dulloomaa jalqaba|Kuwa ugu da'da weyn marka hore
Clear all|ሁሉንም አጽዳ|Hunda haqi|Tirtir dhammaan
Registered from|ከ የተመዘገበ|Irraa galmaa'e|Laga diiwaan geliyay
Registered to|እስከ የተመዘገበ|Hanga galmaa'e|Ilaa la diiwaan geliyay
Diagnosis|ምርመራ|Qorannoo|Baaritaan
Treatment Type|የህክምና ዓይነት|Gosa Yaalii|Nooca Daawaynta
Dental Record|የጥርስ መዝገብ|Galmee Ilkaanii|Diiwaanka Ilkaha
Dental Records|የጥርስ መዝገቦች|Galmeewwan Ilkaanii|Diiwaannada Ilkaha
New Record +|አዲስ መዝገብ +|Galmee Haaraa +|Diiwaan Cusub +
view Dental chart|የጥርስ ገበታ ተመልከት|Chaartii ilkaanii ilaali|Eeg jaantuska ilkaha
Tooth|ጥርስ|Ilkaan|Ilig
Images|ምስሎች|Suuraalee|Sawirro
Images & X-rays|ምስሎች እና ራጅ|Suuraa fi Ra'ii|Sawirro & Raajo
Upload Image +|ምስል ጫን +|Suuraa Olkaa'i +|Soo rar Sawir +
Credit|ብድር|Liqaa|Deyn
Credit Ledger|የብድር መዝገብ|Galmee Liqaa|Diiwaanka Deynta
New Credit +|አዲስ ብድር +|Liqaa Haaraa +|Deyn Cusub +
Consent|ፈቃድ|Hayyama|Oggolaansho
Prescriptions|ማዘዣዎች|Qajeelfama Qoricha|Warqadaha Dawada
Medical Certificate|የሕክምና ሰርተፍኬት|Ragaa Fayyaa|Shahaadada Caafimaad
Health Information|የጤና መረጃ|Odeeffannoo Fayyaa|Macluumaadka Caafimaadka
Referral|ሪፈራል|Ergaa Dabarsuu|Gudbin
Orthodontics|የጥርስ ማስተካከያ|Ilkaan Sirreessuu|Hagaajinta Ilkaha
Labratory|ላቦራቶሪ|Laabiraatrii|Shaybaar
Laboratory|ላቦራቶሪ|Laabiraatrii|Shaybaar
Laboratory Requests|የላቦራቶሪ ጥያቄዎች|Gaaffii Laabiraatrii|Codsiyada Shaybaarka
New labratory Request +|አዲስ የላቦራቶሪ ጥያቄ +|Gaaffii Laabiraatrii Haaraa +|Codsi Shaybaar Cusub +
Request|ጥያቄ|Gaaffii|Codsi
Dental record summary|የጥርስ መዝገብ ማጠቃለያ|Cuunfaa galmee ilkaanii|Soo koobka diiwaanka ilkaha
Clinical summary (print)|ክሊኒካዊ ማጠቃለያ (አትም)|Cuunfaa kilinikaa (maxxansi)|Soo koobka caafimaadka (daabac)
Print summary|ማጠቃለያ አትም|Cuunfaa maxxansi|Daabac soo koobka
Print certificate|ሰርተፍኬት አትም|Ragaa maxxansi|Daabac shahaadada
Print blank form|ባዶ ቅጽ አትም|Unka duwwaa maxxansi|Daabac foomka madhan
Basic Information|መሰረታዊ መረጃ|Odeeffannoo Bu'uuraa|Macluumaadka Aasaasiga ah
Finished:|የተጠናቀቀ፡|Xumurame:|La dhammeeyay:
History|ታሪክ|Seenaa|Taariikh
Open patient|ታካሚ ክፈት|Dhukkubsataa bani|Fur bukaanka
Today's Patient Queue|የዛሬ የታካሚ ተራ|Tarree Dhukkubsatoota Har'aa|Safka Bukaanka Maanta
Patients with Active Orders|ንቁ ትዕዛዝ ያላቸው ታካሚዎች|Dhukkubsatoota Ajaja Hojii Irra Qaban|Bukaanka Dalabyada Firfircoon
Status Legend:|የሁኔታ ማብራሪያ፡|Ibsa Haalaa:|Sharaxaadda Xaaladda:
All Patients|ሁሉም ታካሚዎች|Dhukkubsatoota Hunda|Dhammaan Bukaanka
Today's Orders|የዛሬ ትዕዛዞች|Ajajoota Har'aa|Dalabyada Maanta
Seen by Doctor|በሐኪም የታየ|Hakiimaan Ilaalame|Dhakhtar ayaa arkay
Seen by Nurse|በነርስ የታየ|Narsiin Ilaalame|Kalkaaliye ayaa arkay
Manage and monitor patient orders in real-time - First Come First Serve|የታካሚ ትዕዛዞችን በቅጽበት ያስተዳድሩ - መጀመሪያ የመጣ መጀመሪያ ይስተናገዳል|Ajajoota dhukkubsatootaa yeroo sanatti too'adhu - Kan duraan dhufe duraan tajaajilama|Maamul dalabyada bukaanka waqtiga dhabta ah - Ku hor imaada ayaa marka hore la daawadaa
Patients who arrived today, first come first served.|ዛሬ የመጡ ታካሚዎች፣ መጀመሪያ የመጣ መጀመሪያ።|Dhukkubsatoonni har'a dhufan, kan duraan dhufe duraan.|Bukaanka maanta yimid, ku hor imaada ayaa marka hore.
My Patients|የእኔ ታካሚዎች|Dhukkubsatoota Koo|Bukaankayga
Only patients assigned to you by reception are shown here.|በመቀበያ የተመደቡልዎ ታካሚዎች ብቻ እዚህ ይታያሉ።|Dhukkubsatoonni simannaadhaan siif ramadaman qofa as mul'ata.|Bukaanka soo dhaweynta kuu magacawday oo keliya ayaa halkan ka muuqda.
Waiting - needs a doctor|በመጠበቅ ላይ - ሐኪም ያስፈልጋል|Eegaa jira - Hakiima barbaada|Sugaya - u baahan dhakhtar
Today's appointments|የዛሬ ቀጠሮዎች|Beellamoota Har'aa|Ballamaha maanta
Balances due|የሚከፈሉ ቀሪዎች|Hafteewwan kaffalamuu qaban|Haraagga la bixin doono
Orders ready today|ዛሬ ዝግጁ የሆኑ ትዕዛዞች|Ajajoonni har'a qophaa'an|Dalabyada diyaar ah maanta
Take payment|ክፍያ ተቀበል|Kaffaltii fudhadhu|Qaado lacagta
Arrived|ደርሷል|Dhufeera|Yimid
Register|መዝግብ|Galmeessi|Diiwaan geli
New appointment|አዲስ ቀጠሮ|Beellama haaraa|Ballan cusub
Reports|ሪፖርቶች|Gabaasaawwan|Warbixinno
Reports & cards|ሪፖርቶች እና ካርዶች|Gabaasaawwanii fi Kaardota|Warbixinno & kaadhadh
Print Official Report|ኦፊሴላዊ ሪፖርት አትም|Gabaasa Ofiisaalaa Maxxansi|Daabac Warbixinta Rasmiga ah
Print all patient cards|የሁሉንም ታካሚ ካርዶች አትም|Kaardii dhukkubsatoota hunda maxxansi|Daabac dhammaan kaadhadhka bukaanka
New patients|አዲስ ታካሚዎች|Dhukkubsatoota haaraa|Bukaan cusub
Revenue collected|የተሰበሰበ ገቢ|Galii walitti qabame|Dakhli la ururiyay
Procedures recorded|የተመዘገቡ ሂደቶች|Adeemsawwan galmaa'an|Habraacyo la diiwaan geliyay
Lab orders|የላብራቶሪ ትዕዛዞች|Ajajoota laabiraatrii|Dalabyada shaybaarka
X-ray orders|የራጅ ትዕዛዞች|Ajajoota ra'ii|Dalabyada raajada
Monthly registrations|ወርሃዊ ምዝገባዎች|Galmeewwan ji'aa|Diiwaangelinta bishii
Yearly registrations|ዓመታዊ ምዝገባዎች|Galmeewwan waggaa|Diiwaangelinta sannadka
Monthly revenue|ወርሃዊ ገቢ|Galii ji'aa|Dakhliga bishii
Procedures per month|በወር ሂደቶች|Adeemsawwan ji'aan|Habraacyada bishiiba
Materials consumed|የተጠቀሙ ቁሳቁሶች|Meeshaalee itti fayyadaman|Walxaha la isticmaalay
Last 6 months|ያለፉት 6 ወራት|Ji'oota 6 darban|6 bilood ee ugu dambeeyay
Last 7 days|ያለፉት 7 ቀናት|Guyyoota 7 darban|7 maalmood ee ugu dambeeyay
This year|ይህ ዓመት|Waggaa kana|Sannadkan
Load 6-month sample data|የ6 ወር ናሙና ውሂብ ጫን|Daataa fakkeenyaa ji'a 6 fe'i|Soo rar xogta tusaalaha 6 bilood
Remove sample data|የናሙና ውሂብ አስወግድ|Daataa fakkeenyaa haqi|Ka saar xogta tusaalaha
Sample data|የናሙና ውሂብ|Daataa fakkeenyaa|Xogta tusaalaha
Materials|ቁሳቁሶች|Meeshaalee|Walxaha
New material +|አዲስ ቁሳቁስ +|Meeshaa haaraa +|Walxo cusub +
New material|አዲስ ቁሳቁስ|Meeshaa haaraa|Walxo cusub
Out of stock|ተጠናቋል|Kuufamaan dhume|Kaydku wuu dhammaaday
In stock|በክምችት ውስጥ|Kuufama keessa|Kayd ku jira
Low|ዝቅተኛ|Gadi aanaa|Hoose
On order|በትዕዛዝ ላይ|Ajaja irra|Dalab ku jira
Order Now|አሁን እዘዝ|Amma ajaji|Hadda dalab
Request|ጠይቅ|Gaafadhu|Codso
Use 1|1 ተጠቀም|1 fayyadami|Isticmaal 1
Use one|አንድ ተጠቀም|Tokko fayyadami|Isticmaal mid
Received|ተቀብሏል|Fudhatameera|La helay
Add Stock|ክምችት ጨምር|Kuufama dabaali|Kayd ku dar
Check-up done today|ዛሬ ቼክ ተደርጓል|Hordoffiin har'a xumurameera|Hubinta maanta waa la dhammeeyay
No check-up recorded yet|እስካሁን ቼክ አልተመዘገበም|Hanga ammaatti hordoffiin hin galmaa'in|Weli lama diiwaan gelin hubin
Recent activity|የቅርብ ጊዜ እንቅስቃሴ|Sochii dhiyoo|Dhaqdhaqaaqii dhawaa
Purchase requests|የግዢ ጥያቄዎች|Gaaffii bittaa|Codsiyada iibsiga
Supplier name|የአቅራቢ ስም|Maqaa dhiyeessaa|Magaca bixiyaha
Expected delivery|የሚጠበቅ ርክክብ|Dhiyeessii eegamu|Gaarsiinta la filayo
Note to supplier|ለአቅራቢ ማስታወሻ|Yaada dhiyeessaaf|Qoraal u socda bixiyaha
Reorder level (alert when at or below)|እንደገና የማዘዣ ደረጃ (ሲደርስ ወይም ሲያንስ ያስጠነቅቃል)|Sadarkaa deebisanii ajajuu (yeroo gahu ykn gadi bu'u akeekkachiisa)|Heerka dib u dalbashada (digniin marka gaaro ama ka hoos dhaco)
Quantity in stock|በክምችት ያለ ብዛት|Baay'ina kuufama keessa|Tirada kayd ku jirta
Sterilization tests due:|መደረግ ያለባቸው የማምከን ምርመራዎች፡|Qorannoon dhiqannaa meeshaa gaggeeffamuu qabu:|Baaritaannada nadiifinta ee la sugayo:
Record test +|ምርመራ መዝግብ +|Qorannoo galmeessi +|Diiwaan geli baaritaan +
Record sterilization test|የማምከን ምርመራ መዝግብ|Qorannoo dhiqannaa galmeessi|Diiwaan geli baaritaanka nadiifinta
Autoclave / machine|አውቶክሌቭ / ማሽን|Otoklaavii / Maashinii|Otoclaav / mashiin
Test|ምርመራ|Qorannoo|Baaritaan
Result|ውጤት|Bu'aa|Natiijo
Pass|ተሳክቷል|Darbeera|Gudbay
Fail|አልተሳካም|Kufeera|Waa fashilmay
Due now|አሁን መደረግ አለበት|Amma gaggeeffamuu qaba|Hadda waa u dhacday
Never recorded|በጭራሽ አልተመዘገበም|Gonkumaa hin galmaa'in|Weligeed lama diiwaan gelin
No tests recorded yet.|እስካሁን ምንም ምርመራ አልተመዘገበም።|Hanga ammaatti qorannoon hin galmaa'in.|Weli lama diiwaan gelin baaritaan.
Settings|ቅንብሮች|Qindaa'ina|Dejinta
Appearance|ገጽታ|Bifa|Muuqaal
Light|ብርሃን|Ifa|Iftiin
Dark|ጨለማ|Dukkana|Mugdi
Automatic|አውቶማቲክ|Ofumaan|Si toos ah
Text size|የጽሑፍ መጠን|Guddina barreeffamaa|Cabbirka qoraalka
Small|ትንሽ|Xiqqaa|Yar
Normal|መደበኛ|Idilee|Caadi
Large|ትልቅ|Guddaa|Weyn
Extra large|በጣም ትልቅ|Baay'ee guddaa|Aad u weyn
Change text size|የጽሑፍ መጠን ቀይር|Guddina barreeffamaa jijjiiri|Beddel cabbirka qoraalka
Language|ቋንቋ|Afaan|Luqad
Notifications|ማሳወቂያዎች|Beeksisaawwan|Ogeysiisyo
Clear all|ሁሉንም አጽዳ|Hunda haqi|Tirtir dhammaan
Change Password|የይለፍ ቃል ቀይር|Jecha darbii jijjiiri|Beddel furaha sirta ah
Two-step sign-in|ባለ ሁለት ደረጃ መግቢያ|Seensa sadarkaa lama|Gelitaan laba tallaabo ah
Edit Profile|መገለጫ አርትዕ|Piroofaayilii gulaali|Wax ka beddel astaanta
Switch clinic|ክሊኒክ ቀይር|Kilinikii jijjiiri|Beddel kiliinik
Sync data now|ውሂብ አሁን አመሳስል|Daataa amma wal simsiisi|Hadda isku mid ka dhig xogta
Install app|መተግበሪያ ጫን|Appii dhaabi|Rakib app-ka
Backups|ምትኬዎች|Ergaa ofii|Kaydadka
Download backup|ምትኬ አውርድ|Kuusaa buusi|Soo deji kayd
Restore backup|ምትኬ መልስ|Kuusaa deebisi|Soo celi kayd
Cash expected|የሚጠበቅ ጥሬ ገንዘብ|Qarshii eegamu|Lacagta la filayo
Cash difference|የጥሬ ገንዘብ ልዩነት|Garaagarummaa qarshii|Farqiga lacagta
Net Profit|የተጣራ ትርፍ|Bu'aa qulqulluu|Faa'iido saafi ah
Staff|ሰራተኞች|Hojjettoota|Shaqaalaha
Clinic|ክሊኒክ|Kilinikii|Kiliinik
Branch|ቅርንጫፍ|Damee|Laanta
Address|አድራሻ|Teessoo|Cinwaan
Actions|ድርጊቶች|Gochaalee|Ficillo
Everyone|ሁሉም|Hunda|Qof walba
Everything|ሁሉም ነገር|Wanti hundi|Wax walba
No data yet.|እስካሁን ምንም ውሂብ የለም።|Hanga ammaatti daataan hin jiru.|Weli xog ma jirto.
Take photo|ፎቶ አንሳ|Suuraa kaasi|Qaado sawir
Gallery|ማዕከለ ስዕል|Suuraalee|Gallery
Camera|ካሜራ|Kaameraa|Kamarad
Scan patient barcode|የታካሚ ባርኮድ ስካን አድርግ|Baarkoodii dhukkubsataa iskaan godhi|Iskaan garee barkoodhka bukaanka
Search name, card, phone or doctor|ስም፣ ካርድ፣ ስልክ ወይም ሐኪም ፈልግ|Maqaa, kaardii, bilbila ykn hakiima barbaadi|Raadi magac, kaar, taleefan ama dhakhtar
Search medications...|መድሃኒቶችን ፈልግ...|Qorichoota barbaadi...|Raadi dawooyin...
Select a medication|መድሃኒት ይምረጡ|Qoricha filadhu|Dooro dawo
Add Medication|መድሃኒት ጨምር|Qoricha dabaali|Ku dar dawo
Create Prescription|ማዘዣ ፍጠር|Qajeelfama qoricha uumi|Samee warqad dawo
Anemia|የደም ማነስ|Dhiira xiqqaachuu|Dhiig yaraan
Allergies|አለርጂዎች|Aleerjii|Xasaasiyad
Pregnancy|እርግዝና|Ulfa|Uur
Diabetes Mellitus|የስኳር በሽታ|Dhukkuba sukkaaraa|Sonkorowga
Hypertension|ከፍተኛ የደም ግፊት|Dhiibbaa dhiigaa guddaa|Dhiig-karka
Heart Disease|የልብ በሽታ|Dhukkuba onnee|Cudurka wadnaha
Asthma|አስም|Asmaa|Neefta
Epilepsy|የሚጥል በሽታ|Dhukkuba dhaan|Suuxdinta
Medications Taken|የሚወሰዱ መድሃኒቶች|Qorichoota fudhataman|Dawooyinka la qaato
Bleeding Disorder|የደም መፍሰስ ችግር|Rakkoo dhiiga dhangala'uu|Dhibaatada dhiig-socodka
Dentist|የጥርስ ሐኪም|Hakiima ilkaanii|Dhakhtarka ilkaha
booked|የተያዙ|qabame|la qabsaday
records|መዝገቦች|galmeewwan|diiwaanno
record|መዝገብ|galmee|diiwaan
invoices|ደረሰኞች|fiixeewwan|biilal
unpaid|ያልተከፈሉ|kan hin kaffalamne|aan la bixin
unpaid invoices|ያልተከፈሉ ደረሰኞች|fiixeewwan hin kaffalamne|biilal aan la bixin
waiting|በመጠበቅ ላይ|eegaa jira|sugaya
new in period|በጊዜው አዲስ|kan haaraa yeroo keessa|cusub muddada
order pending|ትዕዛዝ በመጠባበቅ ላይ|ajajni eegaa jira|dalab sugaya
orders pending|ትዕዛዞች በመጠባበቅ ላይ|ajajoonni eegaa jiru|dalabyo sugaya
7 days|7 ቀናት|guyyoota 7|7 maalmood
Account statement|የሂሳብ መግለጫ|Ibsa herregaa|Bayaanka xisaabta
Add User +|ተጠቃሚ ጨምር +|Fayyadamaa dabaali +|Ku dar isticmaale +
Add user +|ተጠቃሚ ጨምር +|Fayyadamaa dabaali +|Ku dar isticmaale +
Add receipt photo|የደረሰኝ ፎቶ ጨምር|Suuraa fiixee dabaali|Ku dar sawirka rasiidka
Add sample records|የናሙና መዝገቦች ጨምር|Galmeewwan fakkeenyaa dabaali|Ku dar diiwaanno tusaale ah
Age from|ከእድሜ|Umrii irraa|Da'da laga bilaabo
Age to|እስከ እድሜ|Umrii hanga|Da'da ilaa
Age (youngest)|እድሜ (ትንሹ መጀመሪያ)|Umrii (xiqqaan jalqaba)|Da'da (kan yar marka hore)
All clinics|ሁሉም ክሊኒኮች|Kilinikoota hunda|Dhammaan kiliinikooyinka
All payments|ሁሉም ክፍያዎች|Kaffaltiiwwan hunda|Dhammaan lacag bixinnada
All time|ሁሌም|Yeroo hunda|Waqti kasta
All types|ሁሉም ዓይነቶች|Gosoota hunda|Dhammaan noocyada
All upcoming|ሁሉም የሚመጡ|Kan dhufan hunda|Dhammaan kuwa imaanaya
Amount|መጠን|Hanga|Qadar
Any case type|ማንኛውም የጉዳይ ዓይነት|Gosa dhimma kamiyyuu|Nooc kasta
Any diagnosis|ማንኛውም ምርመራ|Qorannoo kamiyyuu|Baaritaan kasta
Any doctor|ማንኛውም ሐኪም|Hakiima kamiyyuu|Dhakhtar kasta
Any payment|ማንኛውም ክፍያ|Kaffaltii kamiyyuu|Lacag bixin kasta
Any status|ማንኛውም ሁኔታ|Haala kamiyyuu|Xaalad kasta
Any time|ማንኛውም ጊዜ|Yeroo kamiyyuu|Waqti kasta
any date|ማንኛውም ቀን|guyyaa kamiyyuu|taariikh kasta
Appointment Schedule|የቀጠሮ ፕሮግራም|Sagantaa Beellamaa|Jadwalka Ballanta
Appointment slip|የቀጠሮ ወረቀት|Waraqaa beellamaa|Warqadda ballanta
Arrived today|ዛሬ የመጡ|Har'a kan dhufan|Maanta yimid
Average invoice|አማካይ ደረሰኝ|Giddugaleessa fiixee|Celceliska biilka
Back up all clinics now|ሁሉንም ክሊኒኮች አሁን ምትኬ አስቀምጥ|Kilinikoota hunda amma kuusaa godhi|Hadda kayd ka samee dhammaan kiliinikooyinka
Billed and Collected by period|በጊዜ የተከፈለና የተሰበሰበ|Kan fiixeen baasame fi walitti qabame yeroon|La biilay oo la ururiyay muddo ahaan
Billed vs collected|የተሰራ vs የተሰበሰበ|Kan fiixeen baasame vs walitti qabame|La biilay iyo la ururiyay
Branch:|ቅርንጫፍ፡|Damee:|Laanta:
Bulk & sample data|ብዙ እና የናሙና ውሂብ|Daataa baay'ee fi fakkeenyaa|Xogta badan & tusaalaha
By payment method|በክፍያ ዘዴ|Mala kaffaltiin|Hab lacag bixineed
By who received it|በተቀባዩ|Isa fudhateen|Qofka qaatay
Calendar|የቀን መቁጠሪያ|Kaalaandarii|Kalandar
Care Center|የእንክብካቤ ማዕከል|Giddugala Kunuunsaa|Xarunta Daryeelka
Case type (Rx plan)|የጉዳይ ዓይነት (የህክምና ዕቅድ)|Gosa dhimmaa (karoora yaalii)|Nooca kiiska (qorshaha daawaynta)
Category|ምድብ|Ramaddii|Qayb
Clinic Expenses|የክሊኒክ ወጪዎች|Baasii Kilinikaa|Kharashka Kiliinikka
Clinic summary|የክሊኒክ ማጠቃለያ|Cuunfaa kilinikaa|Soo koobka kiliinikka
Collection rate|የመሰብሰብ መጠን|Sadarkaa walitti qabuu|Heerka ururinta
Counts of patients by sex, age group, diagnosis, case type and new patients per month.|የታካሚዎች ቁጥር በጾታ፣ በእድሜ ቡድን፣ በምርመራ፣ በጉዳይ ዓይነትና በወር አዲስ ታካሚዎች።|Lakkoofsa dhukkubsatootaa saala, garee umrii, qorannoo, gosa dhimmaa fi ji'aan haaraa.|Tirada bukaanka jinsi, kooxda da'da, baaritaan, nooca kiiska iyo bukaan cusub bishiiba.
Credits and advances recorded for patients.|ለታካሚዎች የተመዘገቡ ብድሮችና ቅድመ ክፍያዎች።|Liqaa fi dursa kaffaltii dhukkubsatootaaf galmaa'e.|Deymaha iyo hormaridda bukaanka loo diiwaan geliyay.
Custom item|ብጁ ዕቃ|Meeshaa addaa|Shay gaar ah
Daily Payments Report|የቀን ክፍያዎች ሪፖርት|Gabaasa Kaffaltii Guyyaa|Warbixinta Lacag bixinta Maalinlaha
Dark mode is easier on the eyes in a dim room. Automatic follows your phone setting.|ጨለማ ሁነታ በደብዘዝ ክፍል ለዓይን ቀላል ነው። አውቶማቲክ የስልክዎን ቅንብር ይከተላል።|Haalli dukkanaa kutaa dukkanaa keessatti ija irratti salphaa dha. Ofumaan bilbila keessan hordofa.|Habka mugdiga ah ayaa indhaha u fudud qol madow. Si toos ah wuxuu raacaa dejinta taleefankaaga.
Date:|ቀን፡|Guyyaa:|Taariikh:
Doctor: Dr Abel|ሐኪም፡ Dr Abel|Hakiima: Dr Abel|Dhakhtar: Dr Abel
Employee Fees & Salaries|የሰራተኛ ክፍያና ደመወዝ|Kaffaltii fi Mindaa Hojjettootaa|Mushaharka & Lacagaha Shaqaalaha
Enter the counted cash|የተቆጠረውን ጥሬ ገንዘብ ያስገቡ|Qarshii lakkaa'ame galchi|Geli lacagta la tiriyay
Type the money you counted|የቆጠሩትን ገንዘብ ይተይቡ|Qarshii lakkaa'e barreessi|Qor lacagta aad tirisay
Ethiopian (EC)|ኢትዮጵያዊ (ዓ.ም)|Itoophiyaa (E.C)|Itoobiya (EC)
Gregorian (GC)|ግሪጎሪያን (ዓ.ም)|Giriigoriyaan (G.C)|Gregorian (GC)
EC + GC|ዓ.ም + ዓ.ል|E.C + G.C|EC + GC
Every Sunday night all clinics are backed up automatically and the download links are emailed to the admin. You can also run it now.|በየእሁድ ምሽት ሁሉም ክሊኒኮች በራስ-ሰር ምትኬ ይቀመጣሉ፣ የማውረጃ አገናኞችም ለአስተዳዳሪው በኢሜይል ይላካሉ። አሁንም ማስኬድ ይችላሉ።|Dhiheessa Dilbata hunda kilinikoonni hundi ofumaan kuusamu, hidda buusuu bulchaaf imeeliin ergama. Amma illee hojjechiisuu dandeessa.|Habeen Axad kasta dhammaan kiliinikooyinka si toos ah ayaa loo kaydiyaa, isku xirayaasha soo dejintana waxaa loo iimayl gareeyaa maamulaha. Hadda sidoo kale waad ku shaqayn kartaa.
Every invoice with status, for the period you choose.|ሁሉም ደረሰኞች ከሁኔታ ጋር፣ ለመረጡት ጊዜ።|Fiixeewwan hundi haala isaanii wajjin, yeroo filattuuf.|Biil kasta iyo xaaladdiisa, muddada aad doorato.
Every registered patient with card, contact and status.|ሁሉም የተመዘገቡ ታካሚዎች ከካርድ፣ ከመገናኛና ከሁኔታ ጋር።|Dhukkubsatoonni galmaa'an hundi kaardii, qunnamtii fi haala wajjin.|Bukaan kasta oo diiwaan gashan kaar, xiriir iyo xaalad ah.
Fees, salaries & expenses|ክፍያዎች፣ ደመወዝና ወጪዎች|Kaffaltiiwwan, mindaa fi baasiiwwan|Khidmado, mushahar & kharash
Finished|የተጠናቀቀ|Xumurame|La dhammeeyay
Fully paid|ሙሉ በሙሉ የተከፈለ|Guutummaatti kaffalame|Si buuxda loo bixiyay
Has remaining balance|ቀሪ ሂሳብ አለው|Hafteen qaba|Haraag leh
Has unpaid balance|ያልተከፈለ ቀሪ አለው|Hafteen hin kaffalamne qaba|Haraag aan la bixin leh
Highest balance|ከፍተኛ ቀሪ ሂሳብ|Hafteen olaanaa|Haraaga ugu badan
Home|መነሻ|Mana|Guriga
How dates are shown and entered across the app.|ቀኖች በመተግበሪያው ውስጥ እንዴት እንደሚታዩና እንደሚገቡ።|Guyyoonni appii keessatti akkamitti agarsiifamanii fi galfaman.|Sida taariikhaha looga muujiyo loona gelinayo app-ka dhexdiisa.
Instructions / tooth numbers / dose|መመሪያ / የጥርስ ቁጥሮች / መጠን|Qajeelfama / lakkoofsa ilkaanii / hanga|Tilmaamo / tirooyinka ilkaha / qiyaasta
Lab + X-ray orders per month|የላብ + ራጅ ትዕዛዞች በወር|Ajajoota laabii + ra'ii ji'aan|Dalabyada shaybaar + raajo bishiiba
Laboratory:|ላቦራቶሪ፡|Laabiraatrii:|Shaybaar:
Last Doctor:|የመጨረሻ ሐኪም፡|Hakiima dhumaa:|Dhakhtarkii ugu dambeeyay:
Lists and finance|ዝርዝሮችና ፋይናንስ|Tarreeffamaa fi faayinaansii|Liisaska & maaliyad
Load|ጫን|Fe'i|Rar
Logging out also removes the offline copy of patient data from this device.|መውጣት የታካሚ ውሂብ ከመስመር ውጭ ቅጂንም ከዚህ መሳሪያ ያስወግዳል።|Ba'uun waraqaa daataa dhukkubsataa interneetii malee meeshaa kanarraa haqa.|Ka bixitaanku wuxuu sidoo kale ka saaraa nuqulka offline-ka ah ee xogta bukaanka qalabkan.
Main menu|ዋና ምናሌ|Menu guddaa|Menu-ga ugu muhiimsan
Make text bigger or smaller on this device. You can also tap the|በዚህ መሳሪያ ጽሑፍን ትልቅ ወይም ትንሽ ያድርጉ። እንዲሁም ይጫኑ|Meeshaa kana irratti barreeffama guddisuu ykn xiqqeessuu dandeessa. Akkasumas tuqi|Ku weynee ama yaree qoraalka qalabkan. Waxaad sidoo kale taaban kartaa
button at the top.|በላይ ያለውን አዝራር።|button gubbaa jiru.|badhanka sare.
Material|ቁሳቁስ|Meeshaa|Walax
Money position (all invoices)|የገንዘብ ሁኔታ (ሁሉም ደረሰኞች)|Haala maallaqaa (fiixeewwan hundaa)|Xaaladda lacagta (dhammaan biilasha)
Monthly Report|ወርሃዊ ሪፖርት|Gabaasa Ji'aa|Warbixinta Bishii
More|ተጨማሪ|Dabalata|Wax dheeraad ah
My Active Patients|የእኔ ንቁ ታካሚዎች|Dhukkubsatoota koo hojii irra|Bukaankayga firfircoon
My Finished Patients|የእኔ የተጠናቀቁ ታካሚዎች|Dhukkubsatoota koo xumuraman|Bukaankayga la dhammeeyay
My orders completed|የእኔ የተጠናቀቁ ትዕዛዞች|Ajajoota koo xumuraman|Dalabyadayda la dhammeeyay
My orders pending|የእኔ በመጠባበቅ ላይ ያሉ ትዕዛዞች|Ajajoota koo eegaa jiran|Dalabyadayda sugaya
My profile and password|የእኔ መገለጫና የይለፍ ቃል|Piroofaayilii fi jecha darbii koo|Astaantayda & furaha sirta ah
Name A - Z|ስም A - Z|Maqaa A - Z|Magac A - Z
Net received (after refunds)|የተጣራ ተቀባይ (ከተመላሽ በኋላ)|Kan fudhatame qulqulluu (deebii booda)|Wadarta la helay (kadib celinta)
New Certificate +|አዲስ ሰርተፍኬት +|Ragaa Haaraa +|Shahaado Cusub +
New Clinic +|አዲስ ክሊኒክ +|Kilinikii Haaraa +|Kiliinik Cusub +
+ Create clinic|+ ክሊኒክ ፍጠር|+ Kilinikii uumi|+ Samee kiliinik
New Credit|አዲስ ብድር|Liqaa Haaraa|Deyn Cusub
New Entry +|አዲስ ግቤት +|Galmee Haaraa +|Gelid Cusub +
New Note|አዲስ ማስታወሻ|Yaada Haaraa|Qoraal Cusub
New Note +|አዲስ ማስታወሻ +|Yaada Haaraa +|Qoraal Cusub +
New Ortho Record +|አዲስ የጥርስ ማስተካከያ መዝገብ +|Galmee Ortho Haaraa +|Diiwaan Ortho Cusub +
New Proforma +|አዲስ ፕሮፎርማ +|Proofoormaa Haaraa +|Proforma Cusub +
New Referral +|አዲስ ሪፈራል +|Ergaa Haaraa +|Gudbin Cusub +
New Request +|አዲስ ጥያቄ +|Gaaffii Haaraa +|Codsi Cusub +
New labratory Request|አዲስ የላቦራቶሪ ጥያቄ|Gaaffii Laabiraatrii Haaraa|Codsi Shaybaar Cusub
New patients by period|አዲስ ታካሚዎች በጊዜ|Dhukkubsatoota haaraa yeroon|Bukaan cusub muddo ahaan
Next 7 days|ቀጣዮቹ 7 ቀናት|Guyyoota 7 itti aanan|7 maalmood ee soo socda
No Credit available for this patient.|ለዚህ ታካሚ ምንም ብድር የለም።|Dhukkubsataa kanaaf liqaan hin jiru.|Bukaankan deyn ma laha.
No Proforma available for this patient.|ለዚህ ታካሚ ምንም ፕሮፎርማ የለም።|Dhukkubsataa kanaaf proofoormaan hin jiru.|Bukaankan proforma ma laha.
No VAT|ተ.እ.ታ የለም|VAT hin jiru|VAT la'aan
No activity yet. Tap "Use 1" when a material is used.|እስካሁን ምንም እንቅስቃሴ የለም። ቁሳቁስ ሲጠቀሙ «1 ተጠቀም» ይጫኑ።|Hanga ammaatti sochiin hin jiru. Meeshaan yeroo itti fayyadamamu "1 fayyadami" tuqi.|Weli dhaqdhaqaaq ma jiro. Taabo "Isticmaal 1" marka walax la isticmaalo.
No cases in this period.|በዚህ ጊዜ ምንም ጉዳይ የለም።|Yeroo kana keessa dhimmi hin jiru.|Muddadan kiis ma jiro.
No certificates issued.|ምንም ሰርተፍኬት አልተሰጠም።|Ragaan hin kennamne.|Shahaado lama bixin.
No dental record yet|እስካሁን የጥርስ መዝገብ የለም|Galmeen ilkaanii hanga ammaatti hin jiru|Weli diiwaan ilko ma jiro
No expense records yet.|እስካሁን ምንም የወጪ መዝገብ የለም።|Hanga ammaatti galmeen baasii hin jiru.|Weli diiwaan kharash ma jiro.
No fee or salary records yet.|እስካሁን ምንም የክፍያ ወይም የደመወዝ መዝገብ የለም።|Hanga ammaatti galmeen kaffaltii ykn mindaa hin jiru.|Weli diiwaan khidmad ama mushahar ma jiro.
No finished patients.|ምንም የተጠናቀቁ ታካሚዎች የሉም።|Dhukkubsatoonni xumuraman hin jiran.|Bukaan la dhammeeyay ma jiro.
No health information.|ምንም የጤና መረጃ የለም።|Odeeffannoon fayyaa hin jiru.|Macluumaad caafimaad ma jiro.
No images found for this patient.|ለዚህ ታካሚ ምንም ምስል አልተገኘም።|Dhukkubsataa kanaaf suuraan hin argamne.|Sawir bukaankan loo helin.
No material use recorded yet.|እስካሁን ምንም የቁሳቁስ አጠቃቀም አልተመዘገበም።|Hanga ammaatti itti fayyadama meeshaa hin galmaa'in.|Weli isticmaalka walxaha lama diiwaan gelin.
No notifications yet. You will be told here when a new patient is assigned to you or a lab result you requested is finished.|እስካሁን ምንም ማሳወቂያ የለም። አዲስ ታካሚ ሲመደብልዎ ወይም የጠየቁት የላብ ውጤት ሲጠናቀቅ እዚህ ይነገርዎታል።|Hanga ammaatti beeksisni hin jiru. Dhukkubsataan haaraan yeroo siif ramadamu ykn bu'aan laabii kee yeroo xumuramu as beeksifamta.|Weli ogeysiis ma jiro. Halkan lagugu ogeysiin doonaa marka bukaan cusub laguu magacaabo ama natiijada shaybaar ee aad codsatay la dhammeeyo.
No orthodontic records.|ምንም የጥርስ ማስተካከያ መዝገብ የለም።|Galmeen ortho hin jiru.|Diiwaan ortho ma jiro.
No payments on this day.|በዚህ ቀን ምንም ክፍያ የለም።|Guyyaa kana kaffaltiin hin jiru.|Maalintan lacag bixin ma jirto.
No referrals.|ምንም ሪፈራል የለም።|Ergaan hin jiru.|Gudbin ma jirto.
No requests.|ምንም ጥያቄ የለም።|Gaaffiin hin jiru.|Codsi ma jiro.
Non-cash (bank / mobile)|ጥሬ ገንዘብ ያልሆነ (ባንክ / ሞባይል)|Qarshii hin taane (baankii / mobaayilii)|Aan lacag caddaan ahayn (bangi / mobayl)
Not finished|ያልተጠናቀቀ|Hin xumuramne|Aan dhammaan
Note (load, cycle, action if failed)|ማስታወሻ (ጭነት፣ ዑደት፣ ካልተሳካ እርምጃ)|Yaada (fe'ii, marsaa, tarkaanfii yoo kufe)|Qoraal (xamuul, wareeg, tallaabo haddii fashilmo)
Note:|ማስታወሻ፡|Yaada:|Qoraal:
On credit (nothing paid yet)|በብድር (እስካሁን ምንም አልተከፈለም)|Liqaadhaan (hanga ammaatti homtu hin kaffalamne)|Deyn ah (wax lama bixin)
Other bank|ሌላ ባንክ|Baankii biraa|Bangi kale
Outstanding|ያልተከፈለ|Hafaa|Haraag
Outstanding Balances|ያልተከፈሉ ቀሪዎች|Hafteewwan hafan|Haraagga La Bixin Doono
Outstanding balance|ያልተከፈለ ቀሪ|Hafteen hafe|Haraag
Paid in cash|በጥሬ ገንዘብ የተከፈለ|Qarshiidhaan kaffalame|Lacag caddaan ah ayaa la bixiyay
Paid:|የተከፈለ፡|Kaffalame:|La bixiyay:
Part-paid (remaining)|በከፊል የተከፈለ (ቀሪ)|Hamma tokko kaffalame (hafe)|Qayb la bixiyay (haraag)
Partly paid (paid part)|በከፊል የተከፈለ (የተከፈለው)|Hamma tokko kaffalame (kan kaffalame)|Qayb la bixiyay (qaybta la bixiyay)
Patient Register|የታካሚ መዝገብ|Galmee Dhukkubsatootaa|Diiwaanka Bukaanka
Patient Summary|የታካሚ ማጠቃለያ|Cuunfaa Dhukkubsataa|Soo Koobka Bukaanka
Patient documents|የታካሚ ሰነዶች|Sanadoota dhukkubsataa|Dukumeentiyada bukaanka
Patient name|የታካሚ ስም|Maqaa dhukkubsataa|Magaca bukaanka
Patients and records|ታካሚዎችና መዝገቦች|Dhukkubsatootaa fi galmeewwan|Bukaanka & diiwaannada
Patients by age group|ታካሚዎች በእድሜ ቡድን|Dhukkubsatoota garee umriitiin|Bukaanka kooxda da'da
Patients by sex|ታካሚዎች በጾታ|Dhukkubsatoota saalaan|Bukaanka jinsiga
Payment method (for amount paid)|የክፍያ ዘዴ (ለተከፈለው መጠን)|Mala kaffaltii (hanga kaffalameef)|Habka lacag bixinta (qadarka la bixiyay)
Payments by Method|ክፍያዎች በዘዴ|Kaffaltiiwwan malaan|Lacag bixinno hab ahaan
Payments received by method|የተቀበሉ ክፍያዎች በዘዴ|Kaffaltiiwwan malaan fudhataman|Lacagaha la helay hab ahaan
Pending and finished lab work.|በመጠባበቅ ላይ ያሉና የተጠናቀቁ የላብ ስራዎች።|Hojiin laabii eegaa jiruu fi xumuraman.|Shaqada shaybaarka sugaysa iyo la dhammeeyay.
Period|ጊዜ|Yeroo|Muddo
Photo|ፎቶ|Suuraa|Sawir
Powered by|በ የሚሰራ|Kan hojjetu|Waxaa awooda
Press Load to see the whole year, month by month.|ሙሉ ዓመቱን በወር ለማየት «ጫን» ይጫኑ።|Waggaa guutuu ji'aan arguuf "Fe'i" tuqi.|Taabo "Rar" si aad u aragto sannadka oo dhan bil bil.
Print blank prescription|ባዶ ማዘዣ አትም|Qajeelfama qoricha duwwaa maxxansi|Daabac warqadda dawada madhan
Private Dental Clinic Center|የግል የጥርስ ክሊኒክ ማዕከል|Giddugala Kilinikii Ilkaanii Dhuunfaa|Xarunta Kiliinikka Ilkaha Gaarka ah
Professional Dental Care Center|ፕሮፌሽናል የጥርስ እንክብካቤ ማዕከል|Giddugala Kunuunsa Ilkaanii Ogummaa|Xarunta Daryeelka Ilkaha ee Xirfadlaha
Records|መዝገቦች|Galmeewwan|Diiwaannada
Recently issued cards|በቅርቡ የተሰጡ ካርዶች|Kaardonni dhiyeenya kennaman|Kaadhadhka dhawaan la bixiyay
Received by|የተቀበለው|Kan fudhate|Waxaa qaatay
Receipt photo (optional) - take a photo or choose from gallery|የደረሰኝ ፎቶ (አማራጭ) - ፎቶ ያንሱ ወይም ከማዕከለ ስዕል ይምረጡ|Suuraa fiixee (filannoo) - suuraa kaasi ykn galariirraa filadhu|Sawirka rasiidka (ikhtiyaari) - qaado sawir ama ka dooro gallery
Request to buy|ለመግዛት ጠይቅ|Bituuf gaafadhu|Codso iibsasho
Requested by|የጠየቀው|Kan gaafate|Waxaa codsaday
Reset password|የይለፍ ቃል መልስ|Jecha darbii deebisi|Dib u dhig furaha sirta ah
Revenue (payments received)|ገቢ (የተቀበሉ ክፍያዎች)|Galii (kaffaltiiwwan fudhataman)|Dakhli (lacagaha la helay)
Sample patients are fictional and flagged, so they can be removed without touching real records.|የናሙና ታካሚዎች ምናባዊ ናቸው፣ ምልክት ተደርጎባቸዋል፣ ስለዚህ እውነተኛ መዝገቦችን ሳይነኩ ሊወገዱ ይችላሉ።|Dhukkubsatoonni fakkeenyaa soban, mallattoo qabu, kanaaf galmee dhugaa tuquu malee haqamuu danda'u.|Bukaanka tusaalaha ah waa khayaali oo waa la calaamadeeyay, sidaa darteed waa laga saari karaa iyada oo aan la taaban diiwaannada dhabta ah.
Search invoice no, patient, card, phone|የደረሰኝ ቁጥር፣ ታካሚ፣ ካርድ፣ ስልክ ፈልግ|Lakkoofsa fiixee, dhukkubsataa, kaardii, bilbila barbaadi|Raadi lambarka biilka, bukaan, kaar, taleefan
Search name, user or action|ስም፣ ተጠቃሚ ወይም ድርጊት ፈልግ|Maqaa, fayyadamaa ykn gocha barbaadi|Raadi magac, isticmaale ama ficil
Search name, username, role...|ስም፣ የተጠቃሚ ስም፣ ሚና ፈልግ...|Maqaa, maqaa fayyadamaa, gahee barbaadi...|Raadi magac, magaca isticmaalaha, door...
Seen by doctor|በሐኪም የታየ|Hakiimaan ilaalame|Dhakhtar ayaa arkay
Seen by nurse|በነርስ የታየ|Narsiin ilaalame|Kalkaaliye ayaa arkay
Session|ክፍለ ጊዜ|Marsaa|Fadhi
Sex / Age|ጾታ / እድሜ|Saala / Umrii|Jinsi / Da'
Sex:|ጾታ፡|Saala:|Jinsi:
Signed in as|የገቡት እንደ|Akka seente|Waxaad ku gashay sida
Special case reports (sorted by clinic)|ልዩ የጉዳይ ሪፖርቶች (በክሊኒክ የተደረደሩ)|Gabaasaawwan dhimma addaa (kilinikiin tartiibfaman)|Warbixinnada kiisaska gaarka ah (loo kala saaray kiliinik)
Status:|ሁኔታ፡|Haala:|Xaalad:
Submit|አስገባ|Ergi|Gudbi
Summary charts|የማጠቃለያ ገበታዎች|Chaartii cuunfaa|Jaantusyada soo koobka
Tap to upload photo|ፎቶ ለመጫን ይጫኑ|Suuraa olkaa'uuf tuqi|Taabo si aad u soo rarto sawir
The search box above finds name, card number, phone (any format) or doctor. Use these filters to narrow further.|ከላይ ያለው የፍለጋ ሳጥን ስም፣ የካርድ ቁጥር፣ ስልክ (በማንኛውም ቅርጸት) ወይም ሐኪም ያገኛል። ለማጥበብ እነዚህን ማጣሪያዎች ይጠቀሙ።|Bakka barbaaddaa olitti maqaa, lakkoofsa kaardii, bilbila (bifa kamiyyuu) ykn hakiima argata. Calaqqisiistota kana fayyadami.|Sanduuqa raadinta kore wuxuu helaa magac, lambar kaar, taleefan (qaab kasta) ama dhakhtar. Isticmaal shaandhooyinkan si aad u soo koobto.
This clinic only|ይህ ክሊኒክ ብቻ|Kilinikii kana qofa|Kiliinikkan oo keliya
Today's queue|የዛሬ ተራ|Tarree har'aa|Safka maanta
Top procedures by billed amount|በደረሰኝ መጠን ከፍተኛ ሂደቶች|Adeemsawwan hanga fiixeen olaanoo|Habraacyada ugu sarreeya qadarka biilka
Total:|ድምር፡|Waliigala:|Wadarta:
Totals for Cash, Telebirr, CBE Birr, CBE bank, eBirr and others.|የጥሬ ገንዘብ፣ ቴሌብር፣ ሲቢኢ ብር፣ ሲቢኢ ባንክ፣ ኢብር እና ሌሎች ድምር።|Waliigala qarshii, Telebirr, CBE Birr, baankii CBE, eBirr fi kan biroo.|Wadarta Lacag caddaan, Telebirr, CBE Birr, bangiga CBE, eBirr iyo kuwa kale.
Transaction / reference no. (not needed for cash)|የግብይት / ማጣቀሻ ቁጥር (ለጥሬ ገንዘብ አያስፈልግም)|Lakkoofsa daldalaa / wabii (qarshiif hin barbaachisu)|Lambarka macaamilka / tixraaca (looma baahna lacag caddaan)
Trends & revenue|አዝማሚያዎችና ገቢ|Adeemsa fi galii|Isbeddelka & dakhliga
Unit (box, pack, bottle...)|አሃድ (ሳጥን፣ ጥቅል፣ ጠርሙስ...)|Yuunitii (sanduuqa, ukkaamsa, buusaa...)|Cutub (sanduuq, xidhmo, dhalo...)
Unpaid and partly paid invoices to follow up.|ክትትል የሚያስፈልጋቸው ያልተከፈሉና በከፊል የተከፈሉ ደረሰኞች።|Fiixeewwan hin kaffalamne fi hamma tokko kaffalaman hordofuuf.|Biilasha aan la bixin iyo qayb la bixiyay ee la daba galo.
Update your password to keep your account secure.|መለያዎን ደህንነቱ የተጠበቀ ለማድረግ የይለፍ ቃልዎን ያዘምኑ።|Akkaawuntii kee eeguuf jecha darbii kee haaromsi.|Cusboonaysii furahaaga sirta ah si akoonkaagu u ammaan ahaado.
User Management|የተጠቃሚ አስተዳደር|Bulchiinsa Fayyadamtootaa|Maamulka Isticmaalayaasha
View and manage your account details|የመለያዎን ዝርዝሮች ይመልከቱና ያስተዳድሩ|Bal'ina akkaawuntii kee ilaaliitii too'adhu|Eeg oo maamul faahfaahinta akoonkaaga
Viewing clinic:|እየታየ ያለ ክሊኒክ፡|Kilinikii ilaalamu:|Kiliinikka la eegayo:
Why / urgency|ምክንያት / አጣዳፊነት|Sababa / ariifachiisummaa|Sababta / degdegga
Yearly Summary|ዓመታዊ ማጠቃለያ|Cuunfaa Waggaa|Soo Koobka Sannadka
Read-only list of every patient in this clinic, newest registration first. Open records from your own patient list.|በዚህ ክሊኒክ ያሉ ሁሉም ታካሚዎች የንባብ-ብቻ ዝርዝር፣ አዲስ ምዝገባ መጀመሪያ።|Tarreeffama dhukkubsatoota kilinikii kanaa dubbisuu qofaaf, galmee haaraan jalqaba.|Liis akhris-oo-keliya ah ee bukaan kasta oo kiliinikkan ku jira, diiwaangelinta ugu cusub marka hore.
Read-only.|ለንባብ ብቻ።|Dubbisuuf qofa.|Akhris keliya.
Only the assigned doctor can do this for this patient.|ይህን ለዚህ ታካሚ ማድረግ የሚችለው የተመደበው ሐኪም ብቻ ነው።|Kana dhukkubsataa kanaaf hakiimni ramadame qofa hojjechuu danda'a.|Kani waxaa bukaankan u samayn kara dhakhtarka loo magacaabay oo keliya.
🟦 New order|🟦 አዲስ ትዕዛዝ|🟦 Ajaja haaraa|🟦 Dalab cusub
🟩 Seen by Doctor|🟩 በሐኪም የታየ|🟩 Hakiimaan ilaalame|🟩 Dhakhtar ayaa arkay
🟪 Seen by Nurse|🟪 በነርስ የታየ|🟪 Narsiin ilaalame|🟪 Kalkaaliye ayaa arkay
Telebirr|ቴሌብር|Telebirr|Telebirr
CBE Birr|ሲቢኢ ብር|CBE Birr|CBE Birr
Pending and|በመጠባበቅ ላይ እና|Eegaa jiruu fi|Sugaya iyo
Operative|ኦፐሬቲቭ|Opireetiivii|Operative
Endodontic|የጥርስ ስር ህክምና|Yaala hidda ilkaanii|Endodontic
Periodontic|የድድ ህክምና|Yaala ilkaanii|Periodontic
Prosthodontic|ሰው ሰራሽ ጥርስ|Ilkaan hojjetame|Prosthodontic
Orthodontic|የጥርስ ማስተካከያ|Ilkaan sirreessuu|Orthodontic
Oral surgery|የአፍ ቀዶ ጥገና|Yaalii qaruxxee afaanii|Qalliinka afka
Maxillofacial|የፊት መንጋጋ|Afaan fi fuula|Maxillofacial
due|የሚከፈል|kaffalamuu qabu|la bixin doono
Count on the shelf|በመደርደሪያ ላይ የተቆጠረ|Kan shelfii irra lakkaa'ame|Tirada khayraadka
`.trim().split('\n').forEach(l=>{const a=l.split('|');if(a.length==4){T.am[a[0]]=a[1];T.om[a[0]]=a[2];T.so[a[0]]=a[3]}});return T})();
let LG=(()=>{const v=lsGet('dental_lang');return LANGS.some(l=>l[0]==v)?v:'en'})();
/* look up one piece of text; also handles "Label (3)", "Label:" and "3 Label" style variants */
function i18n(s){if(LG=='en')return s;const D=UIT[LG],t=s.trim();if(!t)return s;let r=D[t];
 if(r==null){let m=t.match(/^(.*?)\s*(\(\d+\))$/);if(m&&D[m[1]])r=D[m[1]]+' '+m[2];
  else if(m=t.match(/^(\d+|ETB [\d,.]+)\s+(.*)$/)){if(D[m[2]])r=m[1]+' '+D[m[2]]}
  else if(m=t.match(/^(.*?)\s*([:：])$/)){if(D[m[1]])r=D[m[1]]+':'}}
 if(r==null)return s;const a=s.match(/^\s*/)[0],b=s.match(/\s*$/)[0];return a+r+b}
function i18nWalk(root){if(!root||!root.nodeType)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n,L=[];while(n=w.nextNode())L.push(n);
 L.forEach(n=>{const p=n.parentNode;if(!p||/^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(p.nodeName))return;const base=n.__o!=null&&n.data===n.__t?n.__o:n.data,t=i18n(base);if(t!==n.data){n.__o=base;n.__t=t;n.data=t}});
 if(root.querySelectorAll)root.querySelectorAll('[placeholder],[title],[aria-label],option').forEach(e=>{['placeholder','title','aria-label'].forEach(a=>{const v=e.getAttribute(a);if(v==null)return;const o=e['__o_'+a]!=null&&v===e['__t_'+a]?e['__o_'+a]:v,t=i18n(o);if(t!==v){e['__o_'+a]=o;e['__t_'+a]=t;e.setAttribute(a,t)}});
  if(e.nodeName=='OPTION'&&e.firstChild&&e.firstChild.nodeType==3){}})}
let _i18nT=0,_i18nUsed=LG!='en';const i18nSoon=()=>{if(_i18nT||(LG=='en'&&!_i18nUsed))return;_i18nT=requestAnimationFrame(()=>{_i18nT=0;try{i18nWalk(document.body)}catch(e){}})};
new MutationObserver(i18nSoon).observe(document.documentElement,{childList:true,subtree:true,characterData:true});
function langSet(l){LG=l;if(l!='en')_i18nUsed=true;lsSet('dental_lang',l);document.documentElement.lang=l=='am'?'am':l=='om'?'om':l=='so'?'so':'en';i18nWalk(document.body);if(U&&V)go(V);else i18nSoon();if(l=='en')setTimeout(()=>{i18nWalk(document.body);_i18nUsed=false},300)}
document.documentElement.lang=LG;
const _hdl=hdr;hdr=function(){const r=_hdl.apply(this,arguments);try{if(!$('lgbtn')&&$('calbtn'))$('calbtn').insertAdjacentHTML('beforebegin','<button id="lgbtn" onclick="langMenu()" class="border rounded-full w-9 h-9 bg-white text-gray-700" title="Language" aria-label="Language"><i class="fa fa-globe"></i></button>')}catch(e){}return r};
function langMenu(){$('mb').innerHTML=`<h3 class="font-bold text-lg mb-3">Language</h3>${LANGS.map(l=>`<button onclick="cl();langSet('${l[0]}')" class="w-full text-left border rounded-lg p-3 mb-2 ${l[0]==LG?'bg-red-50 border-red-400 font-semibold':'bg-white'}">${l[1]}</button>`).join('')}<p class="text-xs text-gray-500 mt-1">Menus, buttons and labels change. Patient names, drug names and diagnoses stay as entered.</p><button onclick="cl()" class="bg-gray-600 text-white px-4 py-2 rounded mt-2">Close</button>`;md.classList.replace('hidden','flex')}
const _stl=settingsPage;settingsPage=function(){return _stl.apply(this,arguments)+`<div class="bg-white rounded-xl shadow p-4 md:p-6 mb-4"><h3 class="font-bold mb-2">Language</h3><p class="text-sm text-gray-600 mb-3">Choose the language of the app on this device.</p><div class="flex flex-wrap gap-2">${LANGS.map(l=>`<button onclick="langSet('${l[0]}')" class="px-3 py-2 rounded-md border text-sm ${l[0]==LG?'bg-red-100 border-red-400 text-red-700 font-semibold':'bg-white'}">${l[1]}</button>`).join('')}</div></div>`};
/* login screen picker (before sign-in) */
document.addEventListener('DOMContentLoaded',()=>{try{const b=$('lbtn');if(b&&!$('lglogin'))b.insertAdjacentHTML('afterend','<div id="lglogin" class="flex justify-center gap-2 mt-3 flex-wrap">'+LANGS.map(l=>`<button type="button" onclick="langSet('${l[0]}')" class="text-xs px-2 py-1 rounded border bg-white">${l[1]}</button>`).join('')+'</div>')}catch(e){}i18nSoon()});

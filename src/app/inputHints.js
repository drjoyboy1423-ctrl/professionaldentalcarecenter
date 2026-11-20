/* ---------- Right keyboard on every device ----------
   Fields are created by many different screens, so this adds the keyboard hints in one place: phone fields open the number pad,
   email fields the email keyboard, money / quantity fields the decimal pad, and name / phone / email get the phone's autofill. */
function ihFix(e){if(e.dataset.ih)return;e.dataset.ih=1;const k=((e.id||'')+' '+(e.name||'')).toLowerCase(),t=e.type;
 if(t!='text'&&t!='search'&&t!='tel'&&t!='email'&&t!='')return;
 if(/phone|(^|[_ -])tel($|[_ -])|mobile/.test(k)){if(!e.getAttribute('inputmode'))e.setAttribute('inputmode','tel');if(!e.getAttribute('autocomplete'))e.setAttribute('autocomplete','tel')}
 else if(/email/.test(k)){if(!e.getAttribute('inputmode'))e.setAttribute('inputmode','email');if(!e.getAttribute('autocomplete'))e.setAttribute('autocomplete','email');e.setAttribute('autocapitalize','none')}
 else if(/(^|[_ -])(amt|amount|price|qty|quantity|disc|discount|paid|salary|pct|rate|days|total|cost)($|[_ -])/.test(k)){if(!e.getAttribute('inputmode'))e.setAttribute('inputmode','decimal')}
 else if(/(^|_)name$/.test(k)&&/^f_|^c_|^cr_/.test(k)){if(!e.getAttribute('autocomplete'))e.setAttribute('autocomplete','name')}}
function ihScan(){document.querySelectorAll('input:not([data-ih])').forEach(ihFix)}
{let t=0;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(ihScan,50)}).observe(document.body,{childList:true,subtree:true});ihScan()}

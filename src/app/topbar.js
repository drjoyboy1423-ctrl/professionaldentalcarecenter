/* ---------- Top bar: one-tap light / dark button (the same choice as Settings > Appearance) ---------- */
function thIcon(){const b=document.getElementById('thbtn');if(b){const dk=document.documentElement.classList.contains('dark');b.innerHTML='<i class="fa '+(dk?'fa-sun':'fa-moon')+'"></i>';b.title=dk?'Switch to light mode':'Switch to dark mode'}}
function thQuick(){setThemeMode(document.documentElement.classList.contains('dark')?'light':'dark');thIcon()}
{const _t=thApply;thApply=function(){_t.apply(this,arguments);thIcon()}}
thIcon();

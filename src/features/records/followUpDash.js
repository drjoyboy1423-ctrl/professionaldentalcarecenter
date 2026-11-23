/* Follow-up card on the dashboards. Loaded after recDesk.js / recQueue.js, because the wide reception desk rebuilds the top of the dashboard. */
{const _d=dash;dash=function(){const h=_d.apply(this,arguments);return typeof h=='string'?fuDashCard()+h:h}}

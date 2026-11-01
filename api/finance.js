/* Vercel serverless function: server-side finance summary.
   The browser sends the signed-in user's Supabase access token. Every database call is made WITH that token,
   so the database's own permission rules (manager/admin only for finance) apply. No secret keys are used.
   GET /api/finance?year=2026[&format=csv][&clinic=<id> (admin only)] */
const SUPA = process.env.SUPABASE_URL || 'https://qorufqosjdhefnafwfzh.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_2aGJ8SWeZBbWKtTJ8DdpeA_amjSfx39';

const METHODS = ['Cash', 'Telebirr', 'CBE Birr', 'CBE (bank)', 'eBirr', 'Other bank', 'Card'];
const net = (x) => (+x.price || 0) * (+x.qty || 1) - (+x.disc || 0);
const total = (x) => net(x) + (x.vat === 'Add 15% VAT' ? Math.round(net(x) * 15) / 100 : 0);
const tsOf = (x, p) => x.ts || Date.parse(x.date) || (p && p.date) || 0;
const sum = (a, f) => a.reduce((z, x) => z + (+f(x) || 0), 0);

/* every payment received on an invoice, as dated events (same rules the app uses) */
function payEvents(x, p) {
  const paid = +x.paid || 0;
  const ev = (x.pays || []).map((y) => ({ ts: y.ts, amt: +y.amt || 0, method: y.method || 'Cash' }));
  const rem = paid - sum(ev, (y) => y.amt);
  if (rem > 0.005) ev.push({ ts: tsOf(x, p), amt: rem, method: 'Cash' });
  return ev;
}

async function rest(path, token) {
  const r = await fetch(SUPA + '/rest/v1/' + path, { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
  if (!r.ok) throw Object.assign(new Error('Database request failed (' + r.status + ')'), { status: r.status === 401 ? 401 : 502 });
  return r.json();
}

function summarize(patients, fin, year) {
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: year + '-' + String(i + 1).padStart(2, '0'),
    revenue: 0, byMethod: Object.fromEntries(METHODS.map((m) => [m, 0])), salaries: 0, expenses: 0, billed: 0,
  }));
  const at = (ts) => { const d = new Date(ts); return d.getFullYear() === year ? months[d.getMonth()] : null; };
  for (const row of patients) {
    const p = { date: row.date };
    for (const x of row.inv || []) {
      const b = at(tsOf(x, p)); if (b) b.billed += total(x);
      for (const e of payEvents(x, p)) {
        const m = at(e.ts); if (!m) continue;
        m.revenue += e.amt; m.byMethod[METHODS.includes(e.method) ? e.method : 'Other bank'] += e.amt;
      }
    }
  }
  for (const s of (fin && fin.sal) || []) { const m = at(s.ts); if (m) m.salaries += +s.amount || 0; }
  for (const s of (fin && fin.exp) || []) { const m = at(s.ts); if (m) m.expenses += +s.amount || 0; }
  months.forEach((m) => { m.profit = m.revenue - m.salaries - m.expenses; });
  const t = {
    revenue: sum(months, (m) => m.revenue), salaries: sum(months, (m) => m.salaries),
    expenses: sum(months, (m) => m.expenses), billed: sum(months, (m) => m.billed),
  };
  t.profit = t.revenue - t.salaries - t.expenses;
  return { year, months, totals: t };
}

const csv = (s) => {
  const rows = [['Month', 'Billed', 'Revenue received', ...METHODS, 'Salaries and fees', 'Expenses', 'Profit']];
  s.months.forEach((m) => rows.push([m.month, m.billed, m.revenue, ...METHODS.map((k) => m.byMethod[k]), m.salaries, m.expenses, m.profit]));
  rows.push(['Total', s.totals.billed, s.totals.revenue, ...METHODS.map((k) => sum(s.months, (m) => m.byMethod[k])), s.totals.salaries, s.totals.expenses, s.totals.profit]);
  return rows.map((r) => r.map((v) => (typeof v === 'number' ? v.toFixed(2) : '"' + String(v).replace(/"/g, '""') + '"')).join(',')).join('\r\n');
};

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  /* token-based (no cookies), so any website may call it; the token still decides who gets data */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Please sign in again.' });
    const url = new URL(req.url, 'http://x');
    const year = Math.min(2100, Math.max(2000, parseInt(url.searchParams.get('year')) || new Date().getFullYear()));

    const u = await fetch(SUPA + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
    if (!u.ok) return res.status(401).json({ error: 'Please sign in again.' });
    const { id } = await u.json();
    const me = (await rest('profiles?select=role,clinic&id=eq.' + encodeURIComponent(id), token))[0];
    if (!me || !['manager', 'admin'].includes(me.role)) return res.status(403).json({ error: 'Only the manager or admin can view finance reports.' });

    let clinic = me.clinic;
    if (me.role === 'admin') clinic = url.searchParams.get('clinic') || (await rest('clinics?select=id&order=created_at&limit=1', token))[0]?.id;
    if (!clinic) return res.status(400).json({ error: 'No clinic found.' });
    const cq = encodeURIComponent(clinic);

    /* only the invoice list of each patient is requested - photos and X-rays are never downloaded */
    const [pts, lists] = await Promise.all([
      rest('patients?select=date:data->date,inv:data->inv&clinic=eq.' + cq + '&limit=5000', token),
      rest('clinic_lists?select=data&kind=eq.fin&clinic=eq.' + cq, token),
    ]);
    const s = summarize(pts, lists[0] && lists[0].data, year);
    s.clinic = clinic;
    if (url.searchParams.get('format') === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="finance-' + year + '.csv"');
      return res.status(200).send('﻿' + csv(s));
    }
    return res.status(200).json(s);
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || 'Something went wrong.' });
  }
};
module.exports.summarize = summarize;

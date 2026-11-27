/* Vercel serverless function: Gemini helper for clinic staff.
   The Gemini key is read from the server environment variable GEMINI_API_KEY (set in Vercel > Settings > Environment Variables).
   It is never sent to the browser and is not in the code. The browser sends the signed-in user's Supabase access token;
   only doctor, nurse, manager and admin accounts may use it. The app sends only the text the person confirmed
   (no name, phone or card number). Optional variable GEMINI_MODEL (default gemini-2.5-flash; if that model is gone the first
   available "flash" model is used instead).
   POST /api/gemini  {task:'summary'|'instructions'|'translate'|'ask', text, lang}  ->  {text, model} */
const SUPA = process.env.SUPABASE_URL || 'https://qorufqosjdhefnafwfzh.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_2aGJ8SWeZBbWKtTJ8DdpeA_amjSfx39';
const ROLES = ['doctor', 'nurse', 'manager', 'admin'];
const LANGS = ['English', 'Amharic', 'Afaan Oromo', 'Tigrinya'];
const MAX_IN = 12000;
const GURL = 'https://generativelanguage.googleapis.com/v1beta/';

const SYS = 'You help the staff of a dental clinic in Ethiopia. Be accurate, short and practical. Never invent facts that are not in the text. ' +
  'You do not diagnose and you do not replace the dentist or physician. Do not give medicine doses unless the text already contains them. ' +
  'Answer in plain text (short paragraphs or simple lists, no tables, no markdown headings).';
const PROMPT = {
  summary: (t) => 'Write a short clinical summary (at most 150 words) for the dentist from this anonymised record. Use short bullet points under: medical risks, treatment so far, current plan, follow-up. Say "not recorded" where something is missing.\n\nRECORD:\n' + t,
  instructions: (t, l) => 'Write simple home-care instructions for the patient in ' + l + ', based on the treatment described below. Use plain words a school child can follow, a short numbered list, and end with when to call the clinic. Do not give medicine doses.\n\nTREATMENT:\n' + t,
  translate: (t, l) => 'Translate the text below into ' + l + '. Keep the medical meaning exact. Reply with the translation only.\n\nTEXT:\n' + t,
  ask: (t) => 'Answer this question from a dental professional briefly and carefully. If you are not sure, say so. Remind them to use their own clinical judgement in one short sentence at the end.\n\nQUESTION:\n' + t,
};

const hits = new Map(); /* best-effort limit per user: 40 requests an hour per server instance */
function limited(id) {
  const now = Date.now(), a = (hits.get(id) || []).filter((x) => now - x < 36e5);
  if (a.length >= 40) { hits.set(id, a); return true; }
  a.push(now); hits.set(id, a); return false;
}
const fail = (status, error) => Object.assign(new Error(error), { status });

async function rest(path, token) {
  const r = await fetch(SUPA + '/rest/v1/' + path, { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
  if (!r.ok) throw fail(r.status === 401 ? 401 : 502, 'Database request failed (' + r.status + ')');
  return r.json();
}

async function generate(model, prompt) {
  const r = await fetch(GURL + 'models/' + encodeURIComponent(model) + ':generateContent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYS }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
    }),
  });
  const j = await r.json().catch(() => ({}));
  return { r, j };
}
async function firstFlash() {
  const r = await fetch(GURL + 'models?pageSize=100', { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } });
  const j = await r.json().catch(() => ({}));
  const m = (j.models || []).filter((x) => /flash/i.test(x.name) && !/(lite|image|live|tts|audio|thinking|exp|preview)/i.test(x.name) && (x.supportedGenerationMethods || []).includes('generateContent'));
  return m.length ? m[m.length - 1].name.replace(/^models\//, '') : '';
}

const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function ask(prompt) {
  let model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  let { r, j } = await generate(model, prompt);
  if (r.status === 404) { /* the model name is gone: use the newest stable "flash" model */
    const alt = await firstFlash();
    if (alt && alt !== model) { model = alt; ({ r, j } = await generate(model, prompt)); }
  }
  /* Google says 503 / 500 when the model is overloaded for a moment: try once more, then other models */
  if (r.status === 503 || r.status === 500) {
    await sleep(1200);
    ({ r, j } = await generate(model, prompt));
    for (const alt of ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-flash-latest']) {
      if (r.status !== 503 && r.status !== 500 && r.status !== 404) break;
      if (alt === model) continue;
      const g = await generate(alt, prompt);
      if (g.r.ok || (g.r.status !== 503 && g.r.status !== 500 && g.r.status !== 404)) { model = alt; r = g.r; j = g.j; }
    }
  }
  if (r.status === 503 || r.status === 500) throw fail(503, 'Google\'s AI service is busy right now. Wait a minute and press Run again.');
  if (r.status === 400 && /api key/i.test((j.error && j.error.message) || '')) throw fail(500, 'The Gemini key on the server is not valid. Check GEMINI_API_KEY in Vercel.');
  if (r.status === 403 || r.status === 401) throw fail(500, 'Gemini refused the key on the server. Check GEMINI_API_KEY in Vercel.');
  if (r.status === 429) throw fail(429, 'Gemini is busy or the free limit is used up. Try again in a minute.');
  if (!r.ok) throw fail(502, 'Gemini could not answer (' + r.status + ').');
  if (j.promptFeedback && j.promptFeedback.blockReason) throw fail(422, 'Gemini did not answer this text (' + j.promptFeedback.blockReason + '). Change the text and try again.');
  const text = ((((j.candidates || [])[0] || {}).content || {}).parts || []).map((x) => x.text || '').join('').trim();
  if (!text) throw fail(502, 'Gemini returned no text. Try again.');
  return { text, model };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Please sign in again.' });
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'The Gemini key is not set on the server (GEMINI_API_KEY in Vercel).' });
    const u = await fetch(SUPA + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + token } });
    if (!u.ok) return res.status(401).json({ error: 'Please sign in again.' });
    const { id } = await u.json();
    const me = (await rest('profiles?select=role&id=eq.' + encodeURIComponent(id), token))[0];
    if (!me || !ROLES.includes(me.role)) return res.status(403).json({ error: 'Only doctors, nurses, managers and administrators can use the AI helper.' });
    if (limited(id)) return res.status(429).json({ error: 'Too many requests. Try again in a while.' });
    let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
    b = b || {};
    const task = String(b.task || ''), text = String(b.text || '').trim(), lang = LANGS.includes(b.lang) ? b.lang : 'English';
    if (!PROMPT[task]) return res.status(400).json({ error: 'Unknown task.' });
    if (text.length < 3) return res.status(400).json({ error: 'Please write or paste some text first.' });
    if (text.length > MAX_IN) return res.status(413).json({ error: 'The text is too long (more than ' + MAX_IN + ' characters).' });
    const out = await ask(PROMPT[task](text, lang));
    return res.status(200).json(out);
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message || 'Something went wrong.' });
  }
};

// Build: turns index.html + src/** into one self-contained dist/index.html (no dependencies).
// Local <script src="src/..."> tags are inlined in the order they appear in index.html;
// the local stylesheet is inlined as <style>. CDN scripts/links are left as they are.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';

const read = (f) => readFileSync(f, 'utf8');
let html = read('index.html');

const local = (u) => !/^(https?:)?\/\//.test(u);

// stylesheet
html = html.replace(/<link rel="stylesheet" href="([^"]+)">\n?/g, (m, href) =>
  local(href) ? `<style>${read(href)}</style>\n` : m);

// merge each run of consecutive local scripts into one inline <script>
const tag = /^<script src="([^"]+)"><\/script>$/;
const out = [];
let pending = [];
const flush = () => { if (pending.length) out.push(`<script>${pending.map(read).join('')}</script>`); pending = []; };
for (const line of html.split('\n')) {
  const m = tag.exec(line);
  if (m && local(m[1])) pending.push(m[1]);
  else { flush(); out.push(line); }
}
flush();
html = out.join('\n');

// anything left that points at a local file is a mistake
const markup = html.replace(/<(script|style)>[\s\S]*?<\/\1>/g, '');
for (const m of markup.matchAll(/(?:src|href)="((?!https?:|\/\/|data:|#)[^"]+)"/g))
  if (!/^(favicon\.svg|manifest\.webmanifest|icon-192\.png|\/privacy|\/_vercel\/)/.test(m[1])) throw new Error('Unbundled local reference: ' + m[1]);

// Per-client deployment: set SB_URL and SB_KEY (public publishable key) in the host's build settings to point this build at that client's own Supabase project.
if (process.env.SB_URL && process.env.SB_KEY) {
  const re = /const SB_URL='[^']*',SB_KEY='[^']*'/;
  if (!re.test(html)) throw new Error('SB_URL line not found');
  html = html.replace(re, () => `const SB_URL=${JSON.stringify(process.env.SB_URL.replace(/\/+$/, ''))},SB_KEY=${JSON.stringify(process.env.SB_KEY)}`);
  console.log('Using Supabase project from SB_URL');
}
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);
for (const f of ['favicon.svg', 'robots.txt', 'manifest.webmanifest', 'sw.js', 'icon-192.png', 'icon-512.png', 'privacy.html']) if (existsSync(f)) copyFileSync(f, 'dist/' + f);
console.log('dist/index.html', Buffer.byteLength(html), 'bytes');
if (existsSync('well-known/assetlinks.json')) { mkdirSync('dist/.well-known', { recursive: true }); copyFileSync('well-known/assetlinks.json', 'dist/.well-known/assetlinks.json'); }

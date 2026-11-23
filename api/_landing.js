// Sign-in page shown before Microsoft: the wiki's own look, one clear action.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function landing(res, { status = 200, title = 'Вхід у базу знань', note = '', tone = '', ret = '/' } = {}) {
  const href = '/api/auth/login' + (ret && ret !== '/' ? '?r=' + encodeURIComponent(ret) : '');
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.end(`<!doctype html><html lang="uk"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>Freitty CS Wiki</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
:root{--bg:#f5f6f8;--surface:#fff;--fg:#16202c;--muted:#5a6676;--line:#d9dfe7;--accent:#1d55a6;--accent-fg:#fff;--warn:#a86200;--warn-soft:#fcefd9;--ok:#1f7a4d;--ok-soft:#e1f3e9;--hazard:#e8a317;--hazard-ink:#1b1505;
  --font:"Onest",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root{--bg:#0f141b;--surface:#161d26;--fg:#e6ebf1;--muted:#9aa6b5;--line:#2a3542;--accent:#6ea2ef;--accent-fg:#0b1220;--warn:#f0a94a;--warn-soft:#3a2a12;--ok:#5cc58f;--ok-soft:#163327;color-scheme:dark}}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:var(--bg);color:var(--fg);font-family:var(--font)}
body{display:grid;place-items:center;min-height:100vh;padding:24px max(16px,env(safe-area-inset-left,0px))}
.card{width:100%;max-width:420px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:32px 28px 26px;box-shadow:0 18px 48px rgba(10,20,40,.08)}
.stripe{height:6px;border-radius:3px;margin:-8px 0 26px;background:repeating-linear-gradient(-45deg,var(--hazard) 0 10px,var(--hazard-ink) 10px 20px);opacity:.9}
.brand{display:flex;align-items:center;gap:12px;margin-bottom:22px}
.mk{width:42px;height:42px;border-radius:10px;background:var(--accent);color:var(--accent-fg);display:grid;place-items:center;font-family:var(--mono);font-weight:500;font-size:17px}
.brand b{display:block;font-size:19px}
.brand span{color:var(--muted);font-size:14px}
h1{font-size:22px;margin:0 0 8px;text-wrap:balance}
p{color:var(--muted);line-height:1.55;margin:0 0 20px;font-size:15px}
.note{border-radius:8px;padding:10px 12px;margin:0 0 18px;font-size:14px;line-height:1.5;background:var(--warn-soft);color:var(--warn)}
.note.ok{background:var(--ok-soft);color:var(--ok)}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:12px 16px;border-radius:9px;background:var(--accent);color:var(--accent-fg);text-decoration:none;font-weight:600;font-size:15.5px}
.btn:hover{filter:brightness(1.06)}
.btn:focus-visible{outline:3px solid var(--fg);outline-offset:2px}
.ms{display:grid;grid-template-columns:8px 8px;gap:2px}
.ms i{width:8px;height:8px;display:block}
.foot{margin-top:18px;font-size:12.5px;color:var(--muted);line-height:1.5}
</style></head><body>
<main class="card">
  <div class="stripe" aria-hidden="true"></div>
  <div class="brand"><div class="mk">CS</div><div><b>Freitty CS Wiki</b><span>База знань Customer Support</span></div></div>
  <h1>${esc(title)}</h1>
  ${note ? `<div class="note ${tone === 'ok' ? 'ok' : ''}" role="status">${note}</div>` : ''}
  <p>Політики, процедури, посібник КС і робочі картки. Тут ви також відмічаєте ознайомлення з документами.</p>
  <a class="btn" href="${esc(href)}"><span class="ms" aria-hidden="true"><i style="background:#f25022"></i><i style="background:#7fba00"></i><i style="background:#00a4ef"></i><i style="background:#ffb900"></i></span>Увійти через Microsoft</a>
  <div class="foot">Лише для працівників компанії, робочим акаунтом Microsoft 365. Якщо доступу немає, зверніться до керівника CS.</div>
</main></body></html>`);
}

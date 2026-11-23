// Microsoft returns here after sign-in: exchange the code, read who signed in, open a session.
import { cfg, seal, unseal, cookies, setCookie, origin, store, SESSION, SESSION_HOURS } from '../_lib.js';

function page(res, status, text) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Freitty CS Wiki</title>
<body style="font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 16px;line-height:1.5"><h1 style="font-size:20px">Не вдалося увійти</h1><p>${text}</p><p><a href="/api/auth/login">Спробувати ще раз</a></p></body>`);
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x');
  const q = url.searchParams;
  if (q.get('error')) return page(res, 403, q.get('error') === 'access_denied'
    ? 'Доступ до вікі не надано. Якщо ви з команди CS, попросіть адміністратора Microsoft 365 додати вас до застосунку Freitty CS Wiki.'
    : 'Microsoft повернув помилку: ' + String(q.get('error_description') || q.get('error')).replace(/[<>&]/g, ''));
  const st = unseal(cookies(req).csw_oauth);
  if (!st || !q.get('state') || st.state !== q.get('state')) return page(res, 400, 'Сесія входу застаріла. Почніть вхід заново.');

  const r = await fetch(`https://login.microsoftonline.com/${cfg.tenant()}/oauth2/v2.0/token`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: cfg.clientId(), client_secret: cfg.clientSecret(), grant_type: 'authorization_code',
      code: q.get('code') || '', redirect_uri: origin(req) + '/api/auth/callback', code_verifier: st.verifier, scope: 'openid profile email',
    }),
  });
  const tok = await r.json().catch(() => ({}));
  if (!r.ok || !tok.id_token) return page(res, 502, 'Microsoft не підтвердив вхід. Спробуйте ще раз.');
  // The ID token comes straight from Microsoft's token endpoint over TLS in exchange for our client secret,
  // so its claims are trusted; we still check that it was issued for this app and this company.
  let c;
  try { c = JSON.parse(Buffer.from(tok.id_token.split('.')[1], 'base64url').toString('utf8')); } catch { return page(res, 502, 'Не вдалося прочитати відповідь Microsoft.'); }
  if (c.aud !== cfg.clientId() || c.tid !== cfg.tenant() || (c.exp && c.exp * 1000 < Date.now())) return page(res, 403, 'Цей акаунт не належить компанії.');
  const u = { id: c.oid, name: c.name || '', email: c.email || c.preferred_username || '' };
  if (!u.id) return page(res, 502, 'Microsoft не повернув ідентифікатор користувача.');
  await store.saveUser(u);
  setCookie(res, 'csw_oauth', '', 0);
  setCookie(res, SESSION, seal({ ...u, exp: Date.now() + SESSION_HOURS * 3600e3 }), SESSION_HOURS * 3600);
  res.statusCode = 302; res.setHeader('Location', st.ret || '/'); res.end();
}

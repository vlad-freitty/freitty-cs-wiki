// Start Microsoft sign-in (OAuth 2.0 authorization code flow with PKCE, single tenant).
import crypto from 'node:crypto';
import { cfg, seal, setCookie, origin, store, SESSION, SESSION_HOURS } from '../_lib.js';

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x');
  const ret = (url.searchParams.get('r') || '/').startsWith('/') && !(url.searchParams.get('r') || '').startsWith('//') ? (url.searchParams.get('r') || '/') : '/';

  if (cfg.mock()) {
    // Local tests only (AUTH_MOCK=1 and not on Vercel): sign in as a fixed test user.
    const u = { id: url.searchParams.get('as') || 'local-admin', name: url.searchParams.get('name') || 'Тестовий адмін', email: url.searchParams.get('email') || 'admin@example.test' };
    await store.saveUser(u);
    setCookie(res, SESSION, seal({ ...u, exp: Date.now() + SESSION_HOURS * 3600e3 }), SESSION_HOURS * 3600);
    res.statusCode = 302; res.setHeader('Location', ret); return res.end();
  }
  if (!cfg.tenant() || !cfg.clientId() || !cfg.clientSecret()) {
    res.statusCode = 500; res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Вхід ще не налаштовано: у Vercel немає AZURE_TENANT_ID, AZURE_CLIENT_ID або AZURE_CLIENT_SECRET.');
  }
  const state = crypto.randomBytes(16).toString('base64url');
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
  setCookie(res, 'csw_oauth', seal({ state, verifier, ret, exp: Date.now() + 10 * 60e3 }), 600);
  const auth = new URL(`https://login.microsoftonline.com/${cfg.tenant()}/oauth2/v2.0/authorize`);
  auth.search = new URLSearchParams({
    client_id: cfg.clientId(), response_type: 'code', response_mode: 'query',
    redirect_uri: origin(req) + '/api/auth/callback', scope: 'openid profile email',
    state, code_challenge: challenge, code_challenge_method: 'S256', prompt: 'select_account',
  }).toString();
  res.statusCode = 302; res.setHeader('Location', auth.toString()); res.end();
}

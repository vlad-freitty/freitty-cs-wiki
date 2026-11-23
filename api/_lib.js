// Shared helpers for the wiki's Vercel functions: Microsoft sign-in session, access rules, document store.
// Files starting with "_" are not exposed as endpoints by Vercel.
import crypto from 'node:crypto';

const env = (k) => (process.env[k] || '').trim();
export const cfg = {
  tenant: () => env('AZURE_TENANT_ID'),
  clientId: () => env('AZURE_CLIENT_ID'),
  clientSecret: () => env('AZURE_CLIENT_SECRET'),
  admins: () => env('WIKI_ADMINS').toLowerCase().split(/[,;\s]+/).filter(Boolean),
  dbUrl: () => env('DATABASE_URL') || env('POSTGRES_URL'),
  // Local test mode only: never active on Vercel.
  mock: () => env('AUTH_MOCK') === '1' && !process.env.VERCEL,
};

/* ---------------- signed cookies ---------------- */
const b64u = (buf) => Buffer.from(buf).toString('base64url');
function secret() {
  const s = env('SESSION_SECRET') || cfg.clientSecret() || (cfg.mock() ? 'local-test-secret' : '');
  if (!s) throw new Error('SESSION_SECRET or AZURE_CLIENT_SECRET is not set');
  return crypto.createHmac('sha256', s).update('freitty-cs-wiki/session/v1').digest();
}
export function seal(obj) {
  const body = b64u(JSON.stringify(obj));
  return body + '.' + b64u(crypto.createHmac('sha256', secret()).update(body).digest());
}
export function unseal(token) {
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const want = b64u(crypto.createHmac('sha256', secret()).update(body).digest());
  if (sig.length !== want.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  try {
    const obj = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (obj.exp && obj.exp < Date.now()) return null;
    return obj;
  } catch { return null; }
}
export function cookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach((p) => { const i = p.indexOf('='); if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return out;
}
export function setCookie(res, name, value, maxAgeSec) {
  const secure = cfg.mock() ? '' : '; Secure';
  const prev = res.getHeader('Set-Cookie');
  const c = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${maxAgeSec}`;
  res.setHeader('Set-Cookie', prev ? [].concat(prev, c) : c);
}

/* ---------------- session ---------------- */
export const SESSION = 'csw';
export const SESSION_HOURS = 12;
export function currentUser(req) {
  const s = unseal(cookies(req)[SESSION]);
  if (!s || !s.id) return null;
  return { id: s.id, name: s.name || '', email: s.email || '', admin: cfg.admins().includes(String(s.email || '').toLowerCase()) };
}
export function origin(req) {
  if (env('APP_URL')) return env('APP_URL').replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || (cfg.mock() ? 'http' : 'https');
  return `${proto}://${req.headers['x-forwarded-host'] || req.headers.host}`;
}

/* ---------------- access rules (same model as the page expects) ----------------
   acks/<uid>    : each person writes only their own acknowledgements; admins read all
   people/<uid>  : role assigned by an admin; the person reads their own
   assign/<uid>  : documents assigned by an admin; the person reads their own
   audit/<id>    : admin actions (journal); admins only, server stamps who and when
   config/<id>   : settings (e.g. the role matrix); everyone reads, admins write          */
const SEG = /^[A-Za-z0-9_\-.:@+]{1,200}$/;
export function parseDocPath(p) {
  const parts = String(p || '').split('/');
  if (parts.length !== 2 || !parts.every((x) => SEG.test(x))) return null;
  return { col: parts[0], id: parts[1] };
}
const COLS = ['acks', 'people', 'assign', 'audit', 'config'];
export function canRead(u, { col, id }) {
  if (col === 'config') return true;
  if (col === 'audit') return u.admin;
  if (COLS.includes(col)) return u.admin || id === u.id;
  return false;
}
export function listScope(u, col) {
  if (col === 'config') return 'all';
  if (col === 'audit') return u.admin ? 'all' : 'none';
  if (COLS.includes(col)) return u.admin ? 'all' : 'own';
  return 'none';
}
export function canWrite(u, { col, id }) {
  if (col === 'acks') return id === u.id; // nobody, admins included, writes someone else's acknowledgement
  if (['people', 'assign', 'audit', 'config'].includes(col)) return u.admin;
  return false;
}

/* ---------------- document store: Neon Postgres, or memory for local tests ---------------- */
let mem = null;
let sqlFn = null;
let ready = null;
async function sql(text, params = []) {
  if (!sqlFn) {
    const { neon } = await import('@neondatabase/serverless');
    sqlFn = neon(cfg.dbUrl());
  }
  return sqlFn(text, params);
}
async function ensure() {
  if (!cfg.dbUrl()) { mem = mem || { docs: new Map(), users: new Map() }; return; }
  if (!ready) ready = (async () => {
    await sql(`CREATE TABLE IF NOT EXISTS wiki_docs (path text PRIMARY KEY, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`);
    await sql(`CREATE TABLE IF NOT EXISTS wiki_users (id text PRIMARY KEY, name text, email text, last_login timestamptz NOT NULL DEFAULT now())`);
  })();
  return ready;
}
export const store = {
  async get(path) {
    await ensure();
    if (mem) return mem.docs.has(path) ? structuredClone(mem.docs.get(path)) : null;
    const r = await sql(`SELECT data FROM wiki_docs WHERE path = $1`, [path]);
    return r[0] ? r[0].data : null;
  },
  async list(col, own) {
    await ensure();
    let rows;
    if (mem) rows = [...mem.docs.entries()].filter(([p]) => p.startsWith(col + '/')).map(([path, data]) => ({ path, data: structuredClone(data) }));
    else rows = await sql(`SELECT path, data FROM wiki_docs WHERE path LIKE $1`, [col.replace(/[%_]/g, '\\$&') + '/%']);
    rows = rows.filter((r) => r.path.split('/').length === 2);
    if (own) rows = rows.filter((r) => r.path === col + '/' + own);
    return rows;
  },
  async set(path, data) {
    await ensure();
    if (mem) { mem.docs.set(path, structuredClone(data)); return; }
    await sql(`INSERT INTO wiki_docs (path, data, updated_at) VALUES ($1, $2::jsonb, now())
               ON CONFLICT (path) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`, [path, JSON.stringify(data)]);
  },
  async del(path) {
    await ensure();
    if (mem) { mem.docs.delete(path); return; }
    await sql(`DELETE FROM wiki_docs WHERE path = $1`, [path]);
  },
  async saveUser(u) {
    await ensure();
    if (mem) { mem.users.set(u.id, { id: u.id, name: u.name, email: u.email }); return; }
    await sql(`INSERT INTO wiki_users (id, name, email, last_login) VALUES ($1, $2, $3, now())
               ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email, last_login = now()`, [u.id, u.name, u.email]);
  },
  async users(ids) {
    await ensure();
    if (!ids.length) return [];
    if (mem) return ids.map((i) => mem.users.get(i)).filter(Boolean);
    return sql(`SELECT id, name, email FROM wiki_users WHERE id = ANY($1)`, [ids]);
  },
  async searchUsers(q) {
    await ensure();
    const needle = String(q || '').trim().toLowerCase();
    if (mem) return [...mem.users.values()].filter((u) => !needle || (u.name + ' ' + u.email).toLowerCase().includes(needle)).slice(0, 8);
    if (!needle) return sql(`SELECT id, name, email FROM wiki_users ORDER BY last_login DESC LIMIT 8`);
    return sql(`SELECT id, name, email FROM wiki_users WHERE lower(name) LIKE $1 OR lower(email) LIKE $1 ORDER BY name LIMIT 8`, ['%' + needle.replace(/[%_]/g, '\\$&') + '%']);
  },
};

export function deepMerge(a, b) {
  const out = { ...(a || {}) };
  for (const k of Object.keys(b || {})) {
    const v = b[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k])) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}
export function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
export async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const s = Buffer.concat(chunks).toString('utf8');
  return s ? JSON.parse(s) : {};
}
// Requests that change data must come from this site (the session cookie is SameSite=Lax; this is a second check).
export function sameOrigin(req) {
  const o = req.headers.origin;
  return !o || o === origin(req);
}

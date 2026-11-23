// Small document store for acknowledgements, roles, assignments, journal and settings.
// GET  /api/db?doc=acks/<id>                       one document
// GET  /api/db?col=audit&order=at&dir=desc&limit=n  a collection (what the rules let this person see)
// POST /api/db {op: set|update|delete|add, path, data}
import crypto from 'node:crypto';
import { currentUser, parseDocPath, canRead, canWrite, listScope, store, deepMerge, json, readBody, sameOrigin } from './_lib.js';

const MAX = 256 * 1024;
export default async function handler(req, res) {
  const u = currentUser(req);
  if (!u) return json(res, 401, { code: 'unauthenticated', error: 'Увійдіть знову' });
  try {
    if (req.method === 'GET') {
      const q = new URL(req.url, 'http://x').searchParams;
      if (q.get('doc')) {
        const p = parseDocPath(q.get('doc'));
        if (!p) return json(res, 400, { code: 'invalid_argument', error: 'bad path' });
        return json(res, 200, { data: canRead(u, p) ? await store.get(q.get('doc')) : null });
      }
      const col = q.get('col') || '';
      if (!/^[A-Za-z0-9_-]{1,50}$/.test(col)) return json(res, 400, { code: 'invalid_argument', error: 'bad collection' });
      const scope = listScope(u, col);
      if (scope === 'none') return json(res, 200, { docs: [] });
      let docs = await store.list(col, scope === 'own' ? u.id : null);
      const f = q.get('order');
      if (f) { const dir = q.get('dir') === 'desc' ? -1 : 1; docs.sort((a, b) => String(a.data?.[f] ?? '').localeCompare(String(b.data?.[f] ?? '')) * dir); }
      const n = Math.min(+q.get('limit') || 1000, 1000);
      return json(res, 200, { docs: docs.slice(0, n) });
    }
    if (req.method !== 'POST') return json(res, 405, { code: 'invalid_argument', error: 'method' });
    if (!sameOrigin(req)) return json(res, 403, { code: 'invalid_argument', error: 'origin' });
    const { op, path: rawPath, data } = await readBody(req);
    if (op === 'add') {
      // Only the journal is append-only from the page; the server stamps who and when.
      if (rawPath !== 'audit' || !u.admin) return json(res, 403, { code: 'invalid_argument', error: 'not allowed' });
      const id = new Date().toISOString().replace(/\D/g, '').slice(0, 17) + crypto.randomBytes(3).toString('hex');
      const doc = { ...(data || {}), by: u.id, at: new Date().toISOString() };
      if (JSON.stringify(doc).length > MAX) return json(res, 413, { code: 'invalid_argument', error: 'too large' });
      await store.set('audit/' + id, doc);
      return json(res, 200, { path: 'audit/' + id });
    }
    const p = parseDocPath(rawPath);
    if (!p || !canWrite(u, p)) return json(res, 403, { code: 'invalid_argument', error: 'not allowed' });
    if (op === 'delete') { await store.del(rawPath); return json(res, 200, { ok: true }); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return json(res, 400, { code: 'invalid_argument', error: 'body must be an object' });
    let next = data;
    if (op === 'update') {
      const cur = await store.get(rawPath);
      if (!cur) return json(res, 404, { code: 'invalid_argument', error: 'document does not exist' });
      next = deepMerge(cur, data);
    } else if (op !== 'set') return json(res, 400, { code: 'invalid_argument', error: 'op' });
    if (JSON.stringify(next).length > MAX) return json(res, 413, { code: 'invalid_argument', error: 'too large' });
    await store.set(rawPath, next);
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error('db', e);
    return json(res, 500, { code: 'unavailable', error: 'Сервер тимчасово недоступний' });
  }
}

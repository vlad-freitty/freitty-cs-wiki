// Names for people the page shows (journal, team) and a search among people who have signed in at least once.
// GET /api/users?q=text   ·   POST /api/users {ids:[...]}
import { currentUser, withAccess, store, json, readBody } from './_lib.js';

export default async function handler(req, res) {
  let u = currentUser(req);
  if (!u) return json(res, 401, { code: 'unauthenticated' });
  try {
    u = await withAccess(u);
    if (req.method === 'POST') {
      const { ids } = await readBody(req);
      const list = [...new Set((ids || []).map(String))].slice(0, 500);
      const rows = await store.users(list);
      return json(res, 200, { users: Object.fromEntries(rows.map((r) => [r.id, { id: r.id, name: r.name, email: u.manager || r.id === u.id ? r.email : null }])) });
    }
    if (!u.manager) return json(res, 200, { list: [] });
    const q = new URL(req.url, 'http://x').searchParams.get('q') || '';
    return json(res, 200, { list: (await store.searchUsers(q)).map((r) => ({ id: r.id, name: r.name, email: r.email })) });
  } catch (e) {
    console.error('users', e);
    return json(res, 500, { code: 'unavailable' });
  }
}

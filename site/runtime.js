/* Vercel runtime: connects the wiki page to its own sign-in and database (api/*).
   The page was written against the claude.use('db' | 'user' | 'downloads') interface; this file provides the same
   interface backed by /api/db and /api/users, so acknowledgements, roles, assignments and the journal work as-is. */
(function () {
  const U = window.__WIKI_USER__ = /*__WIKI_USER__*/null;
  if (!U) return; // static copy without sign-in: the page stays read-only
  const subs = new Set();
  async function api(method, url, body) {
    const r = await fetch(url, { method, credentials: 'same-origin', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined });
    if (r.status === 401) { location.href = '/api/auth/login'; throw { code: 'unavailable', message: 'signed out' }; }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw { code: j.code || 'invalid_argument', message: j.error || r.statusText };
    return j;
  }
  const meta = { fromCache: false, hasPendingWrites: false };
  const snapDoc = (path, d) => ({ id: path.split('/').pop(), exists: d != null, data: () => (d == null ? undefined : JSON.parse(JSON.stringify(d))), metadata: meta });
  const refreshAll = () => subs.forEach((f) => f());
  setInterval(() => { if (document.visibilityState === 'visible') refreshAll(); }, 30000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshAll(); });
  function docRef(path) {
    const get = () => api('GET', '/api/db?doc=' + encodeURIComponent(path)).then((j) => snapDoc(path, j.data));
    const write = (op, data) => api('POST', '/api/db', { op, path, data }).then(() => { refreshAll(); });
    return {
      id: path.split('/').pop(), path, get,
      set: (d) => write('set', d), update: (d) => write('update', d), delete: () => write('delete'),
      onSnapshot(next) { const f = () => get().then(next, () => {}); subs.add(f); f(); return () => subs.delete(f); },
      collection: (p) => colRef(path + '/' + p),
    };
  }
  function colRef(path, o = {}) {
    const fetchCol = () => api('GET', `/api/db?col=${encodeURIComponent(path)}${o.f ? `&order=${encodeURIComponent(o.f)}&dir=${o.dir || 'asc'}` : ''}${o.n ? `&limit=${o.n}` : ''}`);
    const snapCol = (j) => { const docs = (j.docs || []).map((x) => snapDoc(x.path, x.data)); return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: meta }; };
    return {
      path,
      doc: (id) => docRef(path + '/' + (id || 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6))),
      add: (d) => api('POST', '/api/db', { op: 'add', path, data: d }).then((j) => { refreshAll(); return docRef(j.path); }),
      orderBy: (f, dir) => colRef(path, { ...o, f, dir }), limit: (n) => colRef(path, { ...o, n }), where: () => colRef(path, o),
      get: () => fetchCol().then(snapCol),
      onSnapshot(next) { const f = () => fetchCol().then((j) => next(snapCol(j)), () => {}); subs.add(f); f(); return () => subs.delete(f); },
    };
  }
  const initials = (n) => String(n || '?').split(/[\s.@]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
  const avatar = (n) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" rx="24" fill="#5b6b82"/><text x="24" y="30" font-family="sans-serif" font-size="18" fill="#fff" text-anchor="middle">${initials(n).replace(/[<&>]/g, '')}</text></svg>`);
  const prof = (id, u) => ({ id, name: (u && (u.name || u.email)) || '', avatarUrl: avatar(u && (u.name || u.email)), color: '#5b6b82', email: (u && u.email) || null, isMe: id === U.id, guest: false });
  const cache = new Map([[U.id, { id: U.id, name: U.name, email: U.email }]]);
  const user = {
    id: async () => U.id, canEdit: async () => !!U.admin, isOwner: async () => !!U.admin,
    can: async (n) => (n === 'data.write' ? !!U.admin : null),
    me: async () => ({ ...prof(U.id, U), isOwner: !!U.admin, canEdit: !!U.admin }),
    async profiles(ids) {
      const list = [...new Set([].concat(ids))].filter(Boolean);
      const missing = list.filter((i) => !cache.has(i));
      if (missing.length) { try { const j = await api('POST', '/api/users', { ids: missing }); missing.forEach((i) => cache.set(i, (j.users || {})[i] || null)); } catch {} }
      return Object.fromEntries(list.map((i) => [i, prof(i, cache.get(i))]));
    },
    async search(q) { const j = await api('GET', '/api/users?q=' + encodeURIComponent(q || '')).catch(() => ({ list: [] })); (j.list || []).forEach((u) => cache.set(u.id, u)); return (j.list || []).map((u) => prof(u.id, u)); },
  };
  const downloads = {
    async save({ filename, data }) {
      const url = URL.createObjectURL(data); const a = document.createElement('a');
      a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000); return true;
    },
  };
  window.claude = { use: async (name) => ({ db: { doc: docRef, collection: (p) => colRef(p) }, user, downloads })[name] || null };
})();

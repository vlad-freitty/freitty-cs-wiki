// Local test server: runs the Vercel functions from api/ with an in-memory database and a test sign-in.
// Usage: npm run dev   (AUTH_MOCK=1 is set here; it is ignored on Vercel)
// Sign in as someone else: http://localhost:8766/api/auth/login?as=<id>&name=<name>&email=<email>
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

process.env.AUTH_MOCK = '1';
if (!process.env.WIKI_ADMINS) process.env.WIKI_ADMINS = 'admin@example.test';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
process.chdir(ROOT);
const routes = { '/api/auth/login': 'api/auth/login.js', '/api/auth/callback': 'api/auth/callback.js', '/api/auth/logout': 'api/auth/logout.js',
  '/api/db': 'api/db.js', '/api/users': 'api/users.js', '/api/page': 'api/page.js' };
const port = +process.env.PORT || 8766;
http.createServer(async (req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  try {
    if (fs.existsSync(path.join(ROOT, 'public', p)) && p !== '/') { res.end(fs.readFileSync(path.join(ROOT, 'public', p))); return; }
    const file = routes[p] || (p.startsWith('/api/') ? null : 'api/page.js');
    if (!file) { res.statusCode = 404; return res.end('not found'); }
    const mod = await import(pathToFileURL(path.join(ROOT, file)).href);
    await mod.default(req, res);
  } catch (e) { console.error(e); res.statusCode = 500; res.end(String(e)); }
}).listen(port, () => console.log(`CS wiki (local, test sign-in) on http://localhost:${port}`));

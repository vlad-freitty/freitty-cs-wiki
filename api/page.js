// Serves the wiki only to signed-in company accounts. Everything except /api/* is rewritten here (vercel.json).
import fs from 'node:fs';
import path from 'node:path';
import { currentUser } from './_lib.js';

let html = null;
export default function handler(req, res) {
  const u = currentUser(req);
  if (!u) {
    res.statusCode = 302;
    res.setHeader('Location', '/api/auth/login');
    res.setHeader('Cache-Control', 'no-store');
    return res.end();
  }
  if (!html) html = fs.readFileSync(path.join(process.cwd(), 'private', 'wiki.html'), 'utf8');
  const who = JSON.stringify({ id: u.id, name: u.name, email: u.email, admin: u.admin }).replace(/</g, '\\u003c');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.end(html.replace('/*__WIKI_USER__*/null', who));
}

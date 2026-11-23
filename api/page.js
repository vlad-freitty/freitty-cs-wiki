// Serves the wiki only to signed-in company accounts. Everything except /api/* is rewritten here (vercel.json).
// Without a session the person sees the sign-in page; Microsoft opens only after they press the button.
import fs from 'node:fs';
import path from 'node:path';
import { currentUser, withAccess } from './_lib.js';
import { landing } from './_landing.js';

let html = null;
export default async function handler(req, res) {
  let u = currentUser(req);
  if (!u) return landing(res);
  u = await withAccess(u);
  if (!html) html = fs.readFileSync(path.join(process.cwd(), 'private', 'wiki.html'), 'utf8');
  const who = JSON.stringify({ id: u.id, name: u.name, email: u.email, access: u.access, admin: u.admin, manager: u.manager }).replace(/</g, '\\u003c');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.end(html.replace('/*__WIKI_USER__*/null', who));
}

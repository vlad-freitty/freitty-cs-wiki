// End the wiki session. The Microsoft session stays, so the next sign-in is one click.
import { setCookie, SESSION } from '../_lib.js';

export default function handler(req, res) {
  setCookie(res, SESSION, '', 0);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Freitty CS Wiki</title>
<body style="font-family:system-ui,sans-serif;max-width:520px;margin:15vh auto;padding:0 16px;line-height:1.5"><h1 style="font-size:20px">Ви вийшли з вікі</h1><p><a href="/api/auth/login">Увійти знову</a></p></body>`);
}

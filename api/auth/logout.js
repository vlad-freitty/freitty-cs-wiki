// End the wiki session. The Microsoft session stays, so the next sign-in is one click.
import { setCookie, SESSION } from '../_lib.js';
import { landing } from '../_landing.js';

export default function handler(req, res) {
  setCookie(res, SESSION, '', 0);
  landing(res, { title: 'Ви вийшли з вікі', note: 'Сесію у вікі завершено. Щоб повернутися, увійдіть знову.', tone: 'ok' });
}

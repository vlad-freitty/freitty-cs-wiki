/* Restack Estimator v4 widget.
   RestackWidget.mount(rootEl, RULES, {useHash:true|false})
   - useHash: keep the form state in location.hash (standalone page). Off inside the CS Wiki, which routes by hash.
   All DOM lookups are scoped to rootEl; no global ids or inline handlers, so it can live inside another page. */
(function () {
  'use strict';
  const r5 = n => Math.round(n / 5) * 5;
  const money = n => '$' + n.toLocaleString('en-US');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtT = m => (m = r5(m)) < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ' ' + (m % 60) + 'min' : ''}`;
  const fmtTR = (a, b) => r5(a) === r5(b) ? fmtT(a) : `${fmtT(a)} – ${fmtT(b)}`;
  const EXTRA_HUBS = ['Reno', 'Fontana', 'Fremont', 'Portland', 'Flowery Branch', 'East Brunswick', 'Wood Dale', 'Detroit',
    'Greensboro', "Chicago (O'Hare)", 'Huntley', 'Arlington', 'Long Island', 'Baltimore', 'Dallas', 'Riverside', 'Other hub'];

  function mount(root, R, opts) {
    opts = opts || {};
    const HUBS = [...R.hubs.core, ...EXTRA_HUBS];
    const isCore = h => R.hubs.core.some(c => (h || '').toLowerCase().startsWith(c.toLowerCase()));
    const grp = id => R.groups.find(g => g.id === id);
    const lvl = id => R.levels.find(l => l.id === id);
    const fresh = () => ({ hub: null, grp: null, sub: null, lvl: null, codes: new Set(), h: R.height[0].id, w: R.weight.options[0].id, pal: 1 });
    let S = fresh();
    const q = sel => root.querySelector(sel);

    root.classList.add('rsk');
    root.innerHTML = `
<div class="rsk-grid">
 <div class="rsk-left">
  <section class="rsk-card"><div class="rsk-hd"><span class="rsk-step" data-st="hub">1</span><span class="rsk-title">Hub</span><span class="rsk-note">core hubs are the price reference</span></div>
   <div class="rsk-bd"><div class="rsk-hub"><select data-r="hub" aria-label="Hub"><option value="">Select hub…</option>${HUBS.map(h => `<option value="${esc(h)}">${esc(h)}${isCore(h) ? '' : '  (+$' + R.hubs.other_add + ')'}</option>`).join('')}</select><span class="rsk-muted" data-r="hubTag"></span></div></div></section>
  <section class="rsk-card"><div class="rsk-hd"><span class="rsk-step" data-st="sub">2</span><span class="rsk-title">Commodity</span><span class="rsk-note">group → subtype</span></div>
   <div class="rsk-bd"><div class="rsk-groups">${R.groups.map(g => `<button type="button" class="rsk-opt rsk-grp" data-a="grp" data-v="${g.id}"><span class="i">${g.icon}</span><span class="n">${esc(g.name)}</span><span class="p">from ${money(r5(g.base - R.range.minus))}</span></button>`).join('')}</div>
   <div class="rsk-subs" data-r="subs" hidden><div class="rsk-lbl" data-r="subLbl"></div><div class="rsk-sublist" data-r="subList"></div></div></div></section>
  <section class="rsk-card"><div class="rsk-hd"><span class="rsk-step" data-st="lvl">3</span><span class="rsk-title">Chaos level</span><span class="rsk-note">what the photo shows — the main price driver</span></div>
   <div class="rsk-bd"><div class="rsk-levels">${R.levels.map(l => `<button type="button" class="rsk-opt rsk-lvl ${l.id}" data-a="lvl" data-v="${l.id}"><span class="t"><span class="n">${esc(l.name)}</span><span class="a">+${money(l.add)}</span></span><span class="v">${esc(l.visual)}</span></button>`).join('')}</div></div></section>
  <section class="rsk-card"><div class="rsk-hd"><span class="rsk-step" data-st="codes">4</span><span class="rsk-title">Damage codes</span><span class="rsk-badge" data-r="badge">0</span><span class="rsk-note">price: ${R.codes.tiers.filter(t => t.add > 0).map(t => `${t.min}+ codes +${money(t.add)}`).join(', ')} · D01 not counted</span></div>
   <div class="rsk-bd"><div class="rsk-codes">${R.codes.list.map(d => `<button type="button" class="rsk-opt rsk-code${d.crit ? ' crit' : ''}" data-a="code" data-v="${d.code}" aria-pressed="false"><span class="c">${d.code}</span><span><span class="n">${esc(d.name)}</span><br><span class="d">${esc(d.desc)}</span></span></button>`).join('')}</div></div></section>
  <section class="rsk-card"><div class="rsk-hd"><span class="rsk-step">5</span><span class="rsk-title">Pallet</span></div>
   <div class="rsk-bd"><div class="rsk-mods">
    <div><div class="rsk-lbl">Pallet height</div><div class="rsk-seg">${R.height.map(b => `<button type="button" class="rsk-opt rsk-segb" data-a="h" data-v="${b.id}"><span class="v">${esc(b.label)}</span><span class="s">+${money(b.add)}</span></button>`).join('')}</div></div>
    <div><div class="rsk-lbl">Pallet weight</div><div class="rsk-seg">${R.weight.options.map(b => `<button type="button" class="rsk-opt rsk-segb" data-a="w" data-v="${b.id}"><span class="v">${esc(b.label)}</span><span class="s">+${money(b.add)}</span></button>`).join('')}</div>
     ${R.weight.options.every(o => !o.add) ? '<div class="rsk-hint">Info for the hub (equipment) — no price effect.</div>' : ''}</div>
    <div style="grid-column:1/-1"><div class="rsk-lbl">Number of pallets</div><div class="rsk-pal">
     <button type="button" class="rsk-opt rsk-palb" data-a="pal" data-v="-1" aria-label="Fewer pallets">−</button>
     <input type="number" min="1" max="99" value="1" data-r="pal" aria-label="Number of pallets">
     <button type="button" class="rsk-opt rsk-palb" data-a="pal" data-v="1" aria-label="More pallets">+</button><span class="rsk-muted">pallets</span></div></div>
   </div></div></section>
 </div>
 <div class="rsk-right">
  <div class="rsk-card rsk-res" data-r="res" aria-live="polite"></div>
  <div style="display:flex;gap:8px"><button type="button" class="rsk-btn" data-a="import">Paste analyzer result</button><button type="button" class="rsk-btn" data-a="reset">↺ Reset</button></div>
  <div class="rsk-src">Rules v${esc(R.version)} · ${esc(R.calibrated_on)}</div>
 </div>
</div>
<div class="rsk-dlg" data-r="dlg"><div role="dialog" aria-modal="true" aria-label="Paste analyzer result">
 <h3>Paste analyzer result</h3><p>Paste the JSON the photo analyzer returned. The form fills in; check every field against the photo before quoting.</p>
 <textarea data-r="dlgText" spellcheck="false" placeholder='{"hub":"Denver","group":"produce","subtype":"pr4","level":"L3","codes":["D01","D03"],"height":"h2","weight":"w3","pallets":4}'></textarea>
 <div class="err" data-r="dlgErr"></div>
 <div class="row"><button type="button" class="rsk-btn" data-a="dlgClose">Cancel</button><button type="button" class="rsk-btn pri" data-a="dlgApply">Fill the form</button></div>
</div></div>
<div class="rsk-toast" data-r="toast"></div>`;

    // ── estimate ─────────────────────────────────────────────────
    function estimate() {
      const g = grp(S.grp), sub = g && g.subtypes.find(s => s.id === S.sub), l = lvl(S.lvl);
      if (!g || !sub || !l) return null;
      const hubAdd = S.hub ? (isCore(S.hub) ? R.hubs.core_add : R.hubs.other_add) : 0;
      const hb = R.height.find(b => b.id === S.h), wb = R.weight.options.find(b => b.id === S.w);
      const n = [...S.codes].filter(c => !R.codes.count_excludes.includes(c)).length;
      const tier = R.codes.tiers.find(t => n >= t.min && n <= t.max);
      const point = g.base + (sub.add || 0) + l.add + hubAdd + hb.add + wb.add + tier.add;
      const plus = l.range_plus != null ? l.range_plus : R.range.plus;
      const lo = r5(point - R.range.minus), rec = r5(point), hi = r5(point + plus);
      const tExtra = n * R.codes.time_per_code + (g.time_add || 0);
      return { g, sub, l, hubAdd, hb, wb, n, tier, lo, rec, hi, tLo: l.time_lo + tExtra, tHi: l.time_hi + tExtra,
        sup: R.escalation.supervisor_levels.includes(l.id) || !!sub.supervisor,
        totLo: lo * S.pal, totRec: rec * S.pal, totHi: hi * S.pal };
    }

    // ── render ───────────────────────────────────────────────────
    const empty = (i, t) => `<div class="rsk-empty"><div class="i">${i}</div>${t}</div>`;
    function render() {
      q('[data-r=hub]').value = S.hub && HUBS.includes(S.hub) ? S.hub : (S.hub ? '__custom' : '');
      q('[data-r=hubTag]').textContent = !S.hub ? 'Not selected — priced as a core hub' :
        isCore(S.hub) ? 'Core hub · reference price' : `Other hub · +${money(R.hubs.other_add)} per pallet`;
      root.querySelectorAll('[data-a=grp]').forEach(b => b.classList.toggle('sel', b.dataset.v === S.grp));
      const g = grp(S.grp);
      q('[data-r=subs]').hidden = !g;
      if (g) {
        q('[data-r=subLbl]').textContent = g.name + ' — select subtype';
        q('[data-r=subList]').innerHTML = g.subtypes.map(s => `<button type="button" class="rsk-opt rsk-sub${s.id === S.sub ? ' sel' : ''}" data-a="sub" data-v="${s.id}"><span class="i">${s.icon}</span><span><span class="n">${esc(s.name)}${s.supervisor ? '<span class="rsk-pill sup">SUPERVISOR</span>' : ''}${s.fragile ? '<span class="rsk-pill frag">FRAGILE</span>' : ''}</span><br><span class="d">${esc(s.desc)}</span></span></button>`).join('');
      }
      root.querySelectorAll('[data-a=lvl]').forEach(b => b.classList.toggle('sel', b.dataset.v === S.lvl));
      root.querySelectorAll('[data-a=code]').forEach(b => { const on = S.codes.has(b.dataset.v); b.classList.toggle('sel', on); b.setAttribute('aria-pressed', on); });
      const badge = q('[data-r=badge]'); badge.textContent = S.codes.size; badge.classList.toggle('show', S.codes.size > 0);
      root.querySelectorAll('[data-a=h]').forEach(b => b.classList.toggle('sel', b.dataset.v === S.h));
      root.querySelectorAll('[data-a=w]').forEach(b => b.classList.toggle('sel', b.dataset.v === S.w));
      const pal = q('[data-r=pal]'); if (document.activeElement !== pal) pal.value = S.pal;
      const st = { hub: !!S.hub, sub: !!S.sub, lvl: !!S.lvl, codes: S.codes.size > 0 };
      root.querySelectorAll('[data-st]').forEach(e => e.classList.toggle('done', !!st[e.dataset.st]));

      const res = q('[data-r=res]');
      if (opts.useHash) syncHash();
      if (!S.grp) { res.innerHTML = empty('📋', 'Select the commodity<br>to start the estimate'); return; }
      if (!S.sub) { res.innerHTML = empty('👆', 'Choose a subtype<br>from the list'); return; }
      if (!S.lvl) { res.innerHTML = empty('🔍', 'Pick the chaos level<br>that matches the photo'); return; }
      const e = estimate();
      const rows = [[`${e.g.name} base`, money(e.g.base)], [`${e.l.name} level`, '+' + money(e.l.add)]];
      if (e.hubAdd) rows.push(['Other hub', '+' + money(e.hubAdd)]);
      if (e.hb.add) rows.push([`Height ${e.hb.label}`, '+' + money(e.hb.add)]);
      if (e.wb.add) rows.push([`Weight ${e.wb.label}`, '+' + money(e.wb.add)]);
      if (e.tier.add) rows.push([`${e.n} damage codes`, '+' + money(e.tier.add)]);
      const msgs = [];
      if (e.sup) msgs.push(`<div class="rsk-msg warn">⚠ ${esc(R.escalation.message_supervisor)}${e.l.id === 'L4' ? ' — Difficult+ prices vary widely, so the upper bound is wider.' : '.'}</div>`);
      if (e.sub.fragile) msgs.push('<div class="rsk-msg warn">Fragile cargo: confirm with the hub how much product is salvageable before quoting.</div>');
      if (e.totHi >= R.escalation.total_job_over) msgs.push(`<div class="rsk-msg crit">⚠ ${esc(R.escalation.message_total)}</div>`);
      if (!S.hub) msgs.push(`<div class="rsk-msg warn">Hub not selected — the price assumes a core hub. Other hubs add ${money(R.hubs.other_add)}.</div>`);
      res.innerHTML = `
        <div class="rsk-top"><div class="rsk-eye">Quote to client — per pallet</div>
          <div class="rsk-big">${money(e.lo)}<span class="dash"> – </span>${money(e.hi)}</div>
          <div class="rsk-rec">recommended <b>${money(e.rec)}</b></div><span class="rsk-chip ${e.l.id}">${esc(e.l.name)}</span></div>
        <div class="rsk-row"><span>Do not quote below</span><b>${money(e.lo)}</b></div>
        <div class="rsk-bdn">${rows.map(r => `<div><span>${esc(r[0])}</span><b>${r[1]}</b></div>`).join('')}<div class="tot"><span>Recommended per pallet</span><b>${money(e.rec)}</b></div></div>
        ${S.pal > 1 ? `<div class="rsk-total"><div><div class="l">Total · ${S.pal} pallets</div><div class="l">recommended ${money(e.totRec)}</div></div><div class="v">${money(e.totLo)} – ${money(e.totHi)}</div></div>` : ''}
        ${msgs.join('')}
        <div class="rsk-time"><div><div class="l">⏱ Per pallet</div><div class="v">${fmtTR(e.tLo, e.tHi)}</div></div>
          ${S.pal > 1 ? `<span class="sep"></span><div><div class="l">${S.pal} pallets</div><div class="v">${fmtTR(e.tLo * S.pal, e.tHi * S.pal)}</div></div>` : ''}</div>
        <div class="rsk-acts"><button type="button" class="rsk-btn pri" data-a="copyQuote">Copy quote</button>${opts.useHash ? '<button type="button" class="rsk-btn" data-a="copyLink">Copy link</button>' : ''}</div>`;
    }

    // ── state in / out ───────────────────────────────────────────
    function stateObj() { return { hub: S.hub, group: S.grp, subtype: S.sub, level: S.lvl, codes: [...S.codes].sort(), height: S.h, weight: S.w, pallets: S.pal }; }
    function syncHash() {
      const p = new URLSearchParams();
      Object.entries(stateObj()).forEach(([k, v]) => { if (v != null && v !== '' && !(Array.isArray(v) && !v.length)) p.set(k, Array.isArray(v) ? v.join(',') : v); });
      const h = p.toString(); history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
    }
    function applyState(o) {
      const errs = [];
      const g = o.group ? grp(o.group) : null;
      if (o.group && !g) errs.push(`unknown group "${o.group}"`);
      const sub = g && o.subtype ? g.subtypes.find(s => s.id === o.subtype) : null;
      if (g && o.subtype && !sub) errs.push(`unknown subtype "${o.subtype}" for ${g.id}`);
      if (o.level && !lvl(o.level)) errs.push(`unknown level "${o.level}"`);
      const codes = (Array.isArray(o.codes) ? o.codes : String(o.codes || '').split(',')).map(c => String(c).trim().toUpperCase()).filter(Boolean);
      const bad = codes.filter(c => !R.codes.list.some(d => d.code === c));
      if (bad.length) errs.push('unknown codes ' + bad.join(', '));
      if (o.height && !R.height.some(b => b.id === o.height)) errs.push(`unknown height "${o.height}"`);
      if (o.weight && !R.weight.options.some(b => b.id === o.weight)) errs.push(`unknown weight "${o.weight}"`);
      if (errs.length) return errs;
      S = fresh();
      Object.assign(S, { hub: o.hub || null, grp: g ? g.id : null, sub: sub ? sub.id : null, lvl: o.level || null, codes: new Set(codes),
        h: o.height || R.height[0].id, w: o.weight || R.weight.options[0].id, pal: Math.max(1, Math.min(99, parseInt(o.pallets, 10) || 1)) });
      if (S.hub && !HUBS.includes(S.hub)) {
        const sel = q('[data-r=hub]'); let opt = sel.querySelector('option[value="__custom"]');
        if (!opt) { opt = document.createElement('option'); opt.value = '__custom'; sel.appendChild(opt); }
        opt.textContent = S.hub + (isCore(S.hub) ? '' : '  (+$' + R.hubs.other_add + ')');
      }
      render(); return [];
    }
    function loadHash() {
      if (location.hash.length < 2) return render();
      const o = {}; new URLSearchParams(location.hash.slice(1)).forEach((v, k) => o[k] = v);
      if (applyState(o).length) render();
    }

    // ── copy ─────────────────────────────────────────────────────
    function toast(m) { const t = q('[data-r=toast]'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1700); }
    function copy(text, msg) {
      const fallback = () => {
        const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; root.appendChild(t); t.select();
        try { document.execCommand('copy') ? toast(msg) : toast('Copy blocked — select the text manually'); } catch (e) { toast('Copy blocked — select the text manually'); }
        t.remove();
      };
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => toast(msg), fallback); else fallback();
    }
    function quoteText() {
      const e = estimate(); if (!e) return '';
      return [`Restack estimate (rules v${R.version})`, `Hub: ${S.hub || 'not set (core hub price)'}`, `Commodity: ${e.g.name} / ${e.sub.name}`,
        `Chaos level: ${e.l.name}`, `Damage codes: ${[...S.codes].sort().join(', ') || 'none'}`, `Height: ${e.hb.label} · Weight: ${e.wb.label} · Pallets: ${S.pal}`,
        `Price per pallet: ${money(e.lo)} – ${money(e.hi)} (recommended ${money(e.rec)})`,
        S.pal > 1 ? `Total: ${money(e.totLo)} – ${money(e.totHi)} (recommended ${money(e.totRec)})` : null,
        `Time per pallet: ${fmtTR(e.tLo, e.tHi)}${S.pal > 1 ? ` · total ${fmtTR(e.tLo * S.pal, e.tHi * S.pal)}` : ''}`,
        e.sup ? 'Supervisor approval required.' : null].filter(Boolean).join('\n');
    }

    // ── events ───────────────────────────────────────────────────
    const dlg = q('[data-r=dlg]');
    const closeDlg = () => dlg.classList.remove('open');
    root.addEventListener('click', ev => {
      const b = ev.target.closest('[data-a]'); if (!b || !root.contains(b)) return;
      const v = b.dataset.v;
      switch (b.dataset.a) {
        case 'grp': if (S.grp !== v) S.sub = null; S.grp = v; break;
        case 'sub': S.sub = v; break;
        case 'lvl': S.lvl = v; break;
        case 'code': S.codes.has(v) ? S.codes.delete(v) : S.codes.add(v); break;
        case 'h': S.h = v; break;
        case 'w': S.w = v; break;
        case 'pal': S.pal = Math.max(1, Math.min(99, S.pal + parseInt(v, 10))); break;
        case 'reset': S = fresh(); q('[data-r=hub]').value = ''; break;
        case 'import': q('[data-r=dlgErr]').textContent = ''; dlg.classList.add('open'); q('[data-r=dlgText]').focus(); return;
        case 'dlgClose': closeDlg(); return;
        case 'dlgApply': {
          const raw = q('[data-r=dlgText]').value.trim(), m = raw.match(/\{[\s\S]*\}/); let o;
          try { o = JSON.parse(m ? m[0] : raw); } catch (e) { q('[data-r=dlgErr]').textContent = 'Not valid JSON: ' + e.message; return; }
          const errs = applyState(o);
          if (errs.length) { q('[data-r=dlgErr]').textContent = 'Could not fill: ' + errs.join('; '); return; }
          closeDlg(); toast('Form filled from analyzer — check it against the photo'); return;
        }
        case 'copyQuote': copy(quoteText(), 'Quote copied'); return;
        case 'copyLink': copy(location.href, 'Link copied'); return;
        default: return;
      }
      render();
    });
    dlg.addEventListener('click', ev => { if (ev.target === dlg) closeDlg(); });
    root.addEventListener('keydown', ev => { if (ev.key === 'Escape') closeDlg(); });
    q('[data-r=hub]').addEventListener('change', ev => { if (ev.target.value !== '__custom') S.hub = ev.target.value || null; render(); });
    q('[data-r=pal]').addEventListener('input', ev => { const n = parseInt(ev.target.value, 10); if (Number.isFinite(n)) { S.pal = Math.max(1, Math.min(99, n)); render(); } });
    q('[data-r=pal]').addEventListener('blur', () => render());

    if (opts.useHash) { loadHash(); window.addEventListener('hashchange', loadHash); } else render();
    return { applyState, estimate, state: () => stateObj() };
  }
  window.RestackWidget = { mount };
})();

"""Build the single-page wiki: template + data + situations + quizzes + old wiki (tools/methodology).
usage (from the repository root): python -I tools/build.py .   -> dist/freitty-cs-wiki.html
"""
import sys, io, json, re, os

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
OLD = os.path.join(ROOT, "inputs", "legacy", "freitty_wiki_v2.html")
OUT = os.path.join(ROOT, "dist", "freitty-cs-wiki.html")
rd = lambda p: io.open(p, encoding="utf-8").read()

tpl = rd(os.path.join(ROOT, "site", "template.html"))
data = rd(os.path.join(ROOT, "data", "wiki_data.json"))
sits = rd(os.path.join(ROOT, "site", "situations.json"))
quiz = rd(os.path.join(ROOT, "site", "quiz.json"))
# Facility prices copied from Freitty Hub (Facility Passport → Prices); shown on the warehouse map.
hub = json.dumps(json.loads(rd(os.path.join(ROOT, "inputs", "hub", "facility-prices.json"))), ensure_ascii=False)

# ---------- legacy wiki ----------
old = rd(OLD).splitlines()


def find(pat, start=0):
    for i in range(start, len(old)):
        if pat in old[i]:
            return i
    raise SystemExit("not found: " + pat)


css_a = find("/* ═══ 02-styles.css ═══ */")
css_b = find("</style>", css_a)
legacy_css = "\n".join(old[css_a:css_b])
js_a = find("/* ═══ 10-data-hubs.js ═══ */")
js_b = find("/* ═══ 40-core-router.js ═══ */", js_a)
legacy_js = "\n".join(old[js_a:js_b])
esch = next(l for l in old[js_b:] if l.startswith("function escH("))
legacy_js += "\n" + esch + "\n"
assert "</script" not in legacy_js.lower()


def scope_css(css, prefix):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j < 0:
            break
        sel = css[i:j].strip()
        # find matching brace
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == "{":
                depth += 1
            elif css[k] == "}":
                depth -= 1
            k += 1
        body = css[j + 1:k - 1]
        if sel.startswith("@media") or sel.startswith("@supports"):
            out.append(sel + "{" + scope_css(body, prefix) + "}")
        elif sel.startswith("@"):
            out.append(sel + "{" + body + "}")
        else:
            parts = []
            for s in sel.split(","):
                s = s.strip()
                if not s:
                    continue
                if s in (":root", "html", "body"):
                    continue  # the old page shell (dark ground, own palette) is replaced by the new design tokens
                elif s.startswith("html ") or s.startswith("body "):
                    parts.append(prefix + " " + s.split(" ", 1)[1])
                else:
                    parts.append(prefix + " " + s)
            if parts:
                out.append(",".join(parts) + "{" + body + "}")
        i = k
    return "\n".join(out)


# ---------- reskin: old palette and fonts -> new design tokens ----------
TINT = {"108,99,255": "--accent", "55,138,221": "--accent", "255,61,90": "--crit", "0,217,163": "--ok",
        "245,158,11": "--warn", "255,255,255": "--fg", "0,0,0": "--shadow"}
HEX = {"#6c63ff": "var(--accent)", "#ff3d5a": "var(--crit)", "#f59e0b": "var(--warn)", "#00d9a3": "var(--ok)",
       "#378add": "var(--accent)", "#0d0d10": "var(--surface)", "#09090f": "var(--bg)", "#111118": "var(--surface)",
       "#18181f": "var(--surface-2)", "#252532": "var(--line)", "#dddde8": "var(--fg)", "#777790": "var(--muted)"}


def recolor(s):
    def tint(m):
        rgb = re.sub(r"\s", "", m.group(1))
        a = float(m.group(2))
        tok = TINT.get(rgb)
        if not tok:
            return m.group(0)
        if tok == "--shadow":
            return m.group(0)
        pct = max(4, min(100, round(a * 100 * (1.6 if tok == "--fg" else 1))))
        return f"color-mix(in srgb,var({tok}) {pct}%,transparent)"
    s = re.sub(r"rgba\(\s*(\d+\s*,\s*\d+\s*,\s*\d+)\s*,\s*([\d.]+)\s*\)", tint, s)
    for h, v in HEX.items():
        s = re.sub(re.escape(h) + r"\b", v, s, flags=re.I)
    s = s.replace("'Syne'", "'Onest'").replace("'DM Sans'", "'Onest'").replace("'Space Mono'", "'IBM Plex Mono'")
    return s


legacy_css = recolor(scope_css(legacy_css, ".legacy"))
legacy_js = recolor(legacy_js)

# ---------- Restack Estimator v4 (vendored from C:\FREITTY\restack by its build_html.py) ----------
RSK = os.path.join(ROOT, "site", "restack")
rsk_css = rd(os.path.join(RSK, "widget.css"))
rsk_js = rd(os.path.join(RSK, "widget.js"))
rsk_rules = json.dumps(json.loads(rd(os.path.join(RSK, "rules.json"))), ensure_ascii=False)
assert "</script" not in rsk_js.lower()

html = (tpl.replace("__LEGACY_CSS__", legacy_css)
           .replace("__RESTACK_CSS__", rsk_css)
           .replace("__RESTACK_JS__", rsk_js)
           .replace("__RESTACK_RULES__", rsk_rules.replace("</", "<\\/"))
           .replace("__LEGACY_JS__", legacy_js)
           .replace("__SITUATIONS__", sits)
           .replace("__EXTRA__", '{"registry":[],"docs":{}}')
           .replace("__QUIZ__", quiz.replace("</", "<\\/"))
           .replace("__HUB_PRICES__", hub.replace("</", "<\\/"))
           .replace("__DATA__", data.replace("</", "<\\/")))
io.open(OUT, "w", encoding="utf-8").write(html)
# Standalone copy for static hosting (Vercel): the same page wrapped in a full document skeleton.
skeleton = ('<!doctype html><html lang="uk"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            '<meta name="robots" content="noindex,nofollow">'
            '<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
            '</head><body>')
io.open(os.path.join(ROOT, "dist", "index.html"), "w", encoding="utf-8").write(skeleton + html + "</body></html>")
# Signed-in version for Vercel: served only by api/page.js after Microsoft sign-in (never public).
# The runtime comes first so the page finds its database interface when it starts; api/page.js fills in the user.
runtime = rd(os.path.join(ROOT, "site", "runtime.js"))
assert runtime.count("/*__WIKI_USER__*/null") == 1 and "</script" not in runtime.lower()
os.makedirs(os.path.join(ROOT, "private"), exist_ok=True)
io.open(os.path.join(ROOT, "private", "wiki.html"), "w", encoding="utf-8").write(
    skeleton + "<script>" + runtime + "</script>" + html + "</body></html>")
print("built", OUT, round(len(html.encode("utf-8")) / 1024), "KB", file=sys.stderr)

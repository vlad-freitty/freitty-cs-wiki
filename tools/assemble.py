"""Assemble wiki data (registry + documents + proposals + decisions + version archive) into one JSON.
usage (from the repository root): python -I tools/assemble.py .
Every document version is snapshotted once into data/versions/<CODE>/<version>.json; older snapshots form the archive.
"""
import sys, io, json, re, os, glob, datetime
import yaml

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
PKG = os.path.join(ROOT, "inputs", "package")
DATA = os.path.join(ROOT, "data")
S = DATA  # docs_pdf.json lives in data/


def rd(p):
    return io.open(p, encoding="utf-8").read()


# ---------- markdown -> blocks ----------
def md_blocks(text):
    lines = text.splitlines()
    blocks, para = [], []

    def flush():
        if para:
            blocks.append({"t": "p", "text": " ".join(s.strip() for s in para)})
            para.clear()

    i = 0
    while i < len(lines):
        ln = lines[i]
        s = ln.strip()
        if not s:
            flush(); i += 1; continue
        if s.startswith("# "):
            flush(); i += 1; continue  # page title handled separately
        m = re.match(r"^(#{2,4})\s+(.*)", s)
        if m:
            flush()
            blocks.append({"t": "h" if len(m.group(1)) == 2 else "h3", "text": m.group(2)})
            i += 1; continue
        if s.startswith("|"):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                r = lines[i].strip().strip("|")
                cells = [c.strip() for c in r.split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
                    rows.append(cells)
                i += 1
            blocks.append({"t": "table", "rows": rows})
            continue
        m = re.match(r"^(\d+)\.\s+(.*)", s)
        if m:
            flush(); blocks.append({"t": "li", "ord": int(m.group(1)), "text": m.group(2)}); i += 1; continue
        m = re.match(r"^[-*]\s+(.*)", s)
        if m:
            flush(); blocks.append({"t": "li", "text": m.group(1)}); i += 1; continue
        if s.startswith(">"):
            flush(); blocks.append({"t": "quote", "text": s.lstrip("> ")}); i += 1; continue
        para.append(s); i += 1
    flush()
    return blocks


def front(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        return {}, text
    return yaml.safe_load(m.group(1)) or {}, m.group(2)


# ---------- registry ----------
reg = yaml.safe_load(rd(os.path.join(PKG, "registry", "registry.yaml")))["documents"]
for r in reg:
    for k in ("approved", "next_review"):
        if r.get(k) is not None:
            r[k] = str(r[k])
core = yaml.safe_load(rd(os.path.join(PKG, "core.yaml")))["core_v1"]

# ---------- PDF documents ----------
pdf = json.load(io.open(os.path.join(S, "docs_pdf.json"), encoding="utf-8"))
docs = {}
for code, d in pdf.items():
    blocks = d["blocks"]
    meta, date = {}, None
    # passport = first table with Поле|Значення header (or 2-col table right after section 1)
    for b in blocks:
        if b["t"] == "date" and not date:
            date = b["text"]
    for idx, b in enumerate(blocks):
        if b["t"] == "table" and b["rows"] and len(b["rows"][0]) == 2:
            for r in b["rows"][1:] if b["rows"][0][0].strip() == "Поле" else b["rows"]:
                if r[0].strip():
                    meta[r[0].strip()] = r[1].strip()
            b["passport"] = True
            break
    blocks = [b for b in blocks if b["t"] != "date"]
    # a line that ended with "п." made the next line look like a new numbered paragraph
    merged = []
    for b in blocks:
        prev = merged[-1] if merged else None
        if prev and prev["t"] == "p" and b["t"] == "p" and re.search(r"(\bп|\bпп|розділ)\.?$|[A-Z]-$", prev["text"]):
            prev["text"] += ("" if prev["text"].endswith("-") else " ") + b["text"]
            continue
        merged.append(b)
    blocks = merged
    # leading "Nov 16, 2026 · @name" line
    if blocks and blocks[0]["t"] == "p" and re.match(r"^[A-Z][a-z]{2} \d{1,2}, 20\d\d", blocks[0]["text"]):
        date = blocks[0]["text"].split("·")[0].strip()
        blocks = blocks[1:]
    # passport written as paragraphs ("1.1 Код: SOP-1.9. Рівень: L3 Процедура. ...")
    if not meta:
        sec1 = []
        for b in blocks:
            if b["t"] == "h" and not b["text"].startswith("1."):
                break
            if b["t"] == "p" and re.match(r"^1\.\d", b["text"]):
                sec1.append(b["text"])
        for t in sec1:
            body = re.sub(r"^1\.\d+\.?\s+", "", t)
            for part in re.split(r"\.\s+(?=[А-ЯІЇЄA-Z][^:]{1,25}:)", body):
                if ":" in part:
                    k, v = part.split(":", 1)
                    meta[k.strip()] = v.strip().rstrip(".")
        if "Версія" in meta and "Статус" not in meta:
            mv = re.match(r"([\d.]+)\s*\(([^)]+)\)", meta["Версія"])
            if mv:
                meta["Статус"] = f"{mv.group(2).capitalize()}, v{mv.group(1)}"
                del meta["Версія"]
    title = d["title"]
    tcode = title.split(" ", 1)
    status_raw = meta.get("Статус", "")
    mver = re.search(r"v\s?(\d+(?:\.\d+)?)", status_raw)
    docs[code] = {
        "code": code,
        "title": tcode[1] if len(tcode) > 1 else title,
        "source": "pdf",
        "meta": meta,
        "status": status_raw.split(",")[0].strip() or None,
        "version": mver.group(1) if mver else None,
        "date": date,
        "blocks": blocks,
    }

# ---------- markdown SOPs from the package ----------
for p in sorted(glob.glob(os.path.join(PKG, "docs", "*", "*.md"))):
    fm, body = front(rd(p))
    code = fm["code"]
    docs[code] = {
        "code": code,
        "title": fm.get("title"),
        "source": "md",
        "meta": {
            "Рівень": fm.get("level"), "Потік": fm.get("stream"), "Tier": fm.get("tier"),
            "Власник": fm.get("owner"), "Статус": f'{fm.get("status")}, v{fm.get("version")}',
            "Джерело": "Дизайн-сесія, жовтень 2026",
        },
        "status": fm.get("status"),
        "version": str(fm.get("version")),
        "related": fm.get("related") or [],
        "blocks": md_blocks(body),
    }

# ---------- proposals ----------
proposals = []
for p in sorted(glob.glob(os.path.join(PKG, "proposals", "*.md"))):
    fm, body = front(rd(p))
    pf = fm.get("proposal_for")
    targets = [x.strip() for x in str(pf).split(",")] if pf else []
    pid = os.path.splitext(os.path.basename(p))[0]
    proposals.append({
        "id": re.sub(r"[^A-Za-z0-9-]", "-", pid),
        "for": targets, "title": fm.get("title"), "status": fm.get("status"),
        "author": fm.get("author"), "date": str(fm.get("date")) if fm.get("date") else None,
        "blocks": md_blocks(body),
    })

# ---------- decisions ----------
dec_rows = []
for ln in rd(os.path.join(PKG, "decisions", "decisions.md")).splitlines():
    if ln.startswith("| ") and not ln.startswith("| #") and not ln.startswith("|---"):
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) == 5:
            dec_rows.append(dict(zip(["n", "topic", "text", "status", "date"], cells)))

# ---------- analytics + legend ----------
fm, body = front(rd(glob.glob(os.path.join(PKG, "analytics", "*.md"))[0]))
analytics = {"title": fm.get("title"), "source": fm.get("source"), "date": str(fm.get("date")), "note": fm.get("note"), "blocks": md_blocks(body)}
legend = md_blocks(rd(os.path.join(PKG, "registry", "legend.md")))

# ---------- documents written for the wiki (e.g. POL-21 draft) and their registry rows ----------
extra = json.load(io.open(os.path.join(ROOT, "site", "extra_docs.json"), encoding="utf-8"))
for r in extra.get("registry", []):
    if not any(x["code"] == r["code"] for x in reg):
        reg.append(r)
docs.update(extra.get("docs", {}))

# ---------- version archive ----------
# Each (code, version) is frozen the first time it is seen. A later build with a new version keeps the old file,
# which then appears in the wiki as an archived, no longer current version.
VER = os.path.join(DATA, "versions")
today = datetime.date.today().isoformat()
warnings = []
for code, d in docs.items():
    v = d.get("version") or "0"
    folder = os.path.join(VER, code)
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, f"{v}.json")
    snap = {"code": code, "version": v, "title": d.get("title"), "status": d.get("status"), "date": d.get("date"), "blocks": d["blocks"]}
    if os.path.exists(path):
        old = json.load(io.open(path, encoding="utf-8"))
        if old.get("blocks") != d["blocks"]:
            warnings.append(f"{code} v{v}: text changed but version number did not; snapshot kept as first seen")
        snap_saved = old.get("savedAt")
    else:
        snap["savedAt"] = today
        io.open(path, "w", encoding="utf-8").write(json.dumps(snap, ensure_ascii=False, indent=1))
versions, archive = {}, {}
vkey = lambda s: [int(x) if x.isdigit() else 0 for x in re.split(r"[.]", s)]
for folder in sorted(glob.glob(os.path.join(VER, "*"))):
    code = os.path.basename(folder)
    snaps = [json.load(io.open(p, encoding="utf-8")) for p in glob.glob(os.path.join(folder, "*.json"))]
    snaps.sort(key=lambda s: vkey(s["version"]), reverse=True)
    cur = (docs.get(code) or {}).get("version") or "0"
    versions[code] = [{"version": s["version"], "status": s.get("status"), "date": s.get("date"), "savedAt": s.get("savedAt"), "current": s["version"] == cur and code in docs} for s in snaps]
    for s in snaps:
        if not (s["version"] == cur and code in docs):
            archive.setdefault(code, {})[s["version"]] = {"title": s.get("title"), "status": s.get("status"), "date": s.get("date"), "blocks": s["blocks"]}
for w in warnings:
    print("WARNING", w, file=sys.stderr)

out = {"registry": reg, "core": core, "docs": docs, "proposals": proposals,
       "decisions": dec_rows, "analytics": analytics, "legend": legend, "versions": versions, "archive": archive}
io.open(os.path.join(DATA, "wiki_data.json"), "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
print("docs", sorted(docs), file=sys.stderr)
print("proposals", len(proposals), "decisions", len(dec_rows), file=sys.stderr)

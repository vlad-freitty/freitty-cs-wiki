"""Parse a Freitty policy PDF into structured blocks (headings, paragraphs, tables).
usage: python -I tools/parse_pdf.py data/docs_pdf.json inputs/pdf/*.pdf
Needs PyMuPDF (pip install pymupdf). If it is installed into a separate folder, set PYMUPDF_PATH to that folder.
"""
import sys, io, json, re, os, warnings
warnings.filterwarnings("ignore")
if os.environ.get("PYMUPDF_PATH"):
    sys.path.insert(0, os.environ["PYMUPDF_PATH"])
import pymupdf as fitz

NUM_RE = re.compile(r"^(\d+(?:\.\d+)+)\.?\s")
ZW = "​‌‍﻿"


def clean(s):
    for z in ZW:
        s = s.replace(z, "")
    return s.replace("\xa0", " ")


def join_text(a, b):
    if not a:
        return b
    if a.endswith("-") and len(a) > 1 and a[-2].isalnum():
        return a + b
    return a + " " + b


def page_items(page):
    tabs = page.find_tables().tables
    tboxes = [fitz.Rect(t.bbox) for t in tabs]
    lines = []
    for b in page.get_text("dict")["blocks"]:
        for l in b.get("lines", []):
            txt = clean("".join(s["text"] for s in l["spans"]))
            if not txt.strip():
                continue
            size = max(s["size"] for s in l["spans"] if s["text"].strip())
            if size < 7.5:
                continue  # running header/footer
            lines.append({"t": txt.strip(), "size": size, "bbox": fitz.Rect(l["bbox"])})
    items = []
    used = set()
    hlines = sorted({round(d["rect"].y0, 1) for d in page.get_drawings() if d["rect"].height < 2 and d["rect"].width > 50})
    for t, tb in zip(tabs, tboxes):
        rows = []
        hs = [y for y in hlines if tb.y0 - 12 <= y <= tb.y1 + 12]
        # A detected box sometimes starts with full-width "rows" that are really body text above the table
        # (a section heading and its paragraphs). The table starts at the first row with the most columns.
        ncols = [sum(c is not None for c in r.cells) for r in t.rows]
        if ncols and max(ncols) > 1 and ncols[0] < max(ncols):
            k = ncols.index(max(ncols))
            tb = fitz.Rect(tb.x0, t.rows[k].bbox[1], tb.x1, tb.y1)
            ref_cells = t.rows[k].cells
            hs = [y for y in hlines if tb.y0 - 2 <= y <= tb.y1 + 12]
        else:
            ref_cells = t.rows[0].cells
        # table text is set smaller than body text; a header row just above the detected box belongs to the table
        above = [ln["bbox"].y0 for ln in lines if abs(ln["size"] - 11.3) < 0.4 and tb.x0 - 4 <= ln["bbox"].x0 <= tb.x1 and tb.y0 - 30 <= ln["bbox"].y0 < tb.y0 - 1]
        if above and hs:
            top = min(above) - 2
            hs = [top] + [y for y in hs if y > top + 3]
        if len(hs) >= 2:
            # real row boundaries come from the drawn horizontal rules
            bounds = hs[:]
            if bounds[0] > tb.y0 + 6:
                bounds.insert(0, tb.y0)
            if bounds[-1] < tb.y1 - 6:
                bounds.append(tb.y1)
            xs = [c[0] for c in ref_cells if c is not None] + [tb.x1]
            for y0, y1 in zip(bounds, bounds[1:]):
                row = []
                for x0, x1 in zip(xs, xs[1:]):
                    parts = []
                    for i, ln in enumerate(lines):
                        cx = (ln["bbox"].x0 + ln["bbox"].x1) / 2
                        cy = (ln["bbox"].y0 + ln["bbox"].y1) / 2
                        if y0 <= cy < y1 and x0 - 2 <= cx < x1 and tb.x0 - 4 <= cx <= tb.x1 + 4:
                            parts.append(ln)
                            used.add(i)
                    parts.sort(key=lambda p: (round(p["bbox"].y0), p["bbox"].x0))
                    txt = ""
                    for p in parts:
                        txt = join_text(txt, p["t"])
                    row.append(txt)
                if any(c.strip() for c in row):
                    rows.append(row)
            items.append({"kind": "table", "y": tb.y0, "rows": rows, "top": tb.y0 < 90, "ruled": True})
            continue
        for r in t.rows:
            row = []
            for c in r.cells:
                if c is None:
                    row.append(None)
                    continue
                cr = fitz.Rect(c)
                parts = []
                for i, ln in enumerate(lines):
                    ctr = fitz.Point((ln["bbox"].x0 + ln["bbox"].x1) / 2, (ln["bbox"].y0 + ln["bbox"].y1) / 2)
                    if cr.contains(ctr):
                        parts.append(ln)
                        used.add(i)
                parts.sort(key=lambda p: (round(p["bbox"].y0), p["bbox"].x0))
                txt = ""
                for p in parts:
                    txt = join_text(txt, p["t"])
                row.append(txt)
            rows.append(row)
        # mark any line inside the table box as used
        for i, ln in enumerate(lines):
            if tb.contains(fitz.Point((ln["bbox"].x0 + ln["bbox"].x1) / 2, (ln["bbox"].y0 + ln["bbox"].y1) / 2)):
                used.add(i)
        items.append({"kind": "table", "y": tb.y0, "rows": rows, "top": tb.y0 < 90})
    for i, ln in enumerate(lines):
        if i in used:
            continue
        items.append({"kind": "line", "y": ln["bbox"].y0, **ln})
    items.sort(key=lambda it: it["y"])
    return items


def parse(path):
    doc = fitz.open(path)
    blocks = []
    title_parts = []
    cur = None  # current paragraph dict
    last_line = None

    def flush():
        nonlocal cur
        if cur and cur["text"].strip():
            blocks.append(cur)
        cur = None

    for pno, page in enumerate(doc):
        first_on_page = True
        last_line = None  # a page break is not a paragraph break
        for it in page_items(page):
            if it["kind"] == "table":
                flush()
                raw = [[(c if c is not None else "") for c in r] for r in it["rows"]]
                # merge visual wrap-lines: a row with an empty first cell continues the previous row
                rows = []
                for r in raw:
                    if rows and not r[0].strip() and len(r) > 1:
                        rows[-1] = [join_text(a, b) if b.strip() else a for a, b in zip(rows[-1], r)]
                    else:
                        rows.append(r)
                prev = blocks[-1] if blocks else None
                if first_on_page and prev and prev["t"] == "table" and len(prev["rows"][0]) == len(rows[0]):
                    if rows and rows[0] == prev["rows"][0]:
                        rows = rows[1:]
                    if rows and not rows[0][0].strip() and len(prev["rows"]) > 1:
                        prev["rows"][-1] = [join_text(a, b) if b.strip() else a for a, b in zip(prev["rows"][-1], rows[0])]
                        rows = rows[1:]
                    prev["rows"].extend(rows)
                else:
                    blocks.append({"t": "table", "rows": rows})
                first_on_page = False
                last_line = None
                continue
            first_on_page = False
            size, txt, bb = it["size"], it["t"], it["bbox"]
            if size >= 20:
                title_parts.append(txt)
                continue
            if size >= 14:
                flush()
                blocks.append({"t": "h", "text": txt})
                last_line = None
                continue
            if size < 10 and re.search(r"20\d\d", txt):
                blocks.append({"t": "date", "text": txt.strip(" ·")})
                continue
            indent = bb.x0 > 60
            new_para = (
                cur is None
                or NUM_RE.match(txt)
                or re.match(r"^[••\-–—]\s", txt)
                or (last_line is not None and (bb.y0 - last_line.y1) > 7)
                or (cur.get("indent") != indent)
            )
            if new_para:
                flush()
                cur = {"t": "p", "text": txt, "indent": indent}
            else:
                cur["text"] = join_text(cur["text"], txt)
            last_line = bb
    flush()
    return {"title": " ".join(title_parts), "blocks": blocks}


# Incremental: entries already in the output file are kept; the PDFs passed now are (re)parsed.
# The key is the document code from the title, or the file name when the title has no code.
out = json.load(io.open(sys.argv[1], encoding="utf-8")) if os.path.exists(sys.argv[1]) else {}
for p in sys.argv[2:]:
    r = parse(p)
    m = re.match(r"^((?:POL|STD|PRC|SOP|WI|TPL|REG)-[\w.]+)", r["title"])
    code = m.group(1) if m else os.path.splitext(os.path.basename(p))[0]
    r["file"] = os.path.basename(p)
    out[code] = r
    print(code, len(r["blocks"]), file=sys.stderr)
    io.open(sys.argv[1], "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False, indent=1))

"""Build the use cases page (prd/tezera-use-cases.html) from the SRS draft.

Run after you change a use case, the FR table or the use case diagrams in
report/tezera-srs-chapter-4.md, a PRD row, or the user stories:

    python tools/build-use-cases.py

Sources (the page is GENERATED; do not hand-edit it):
- report/tezera-srs-chapter-4.md: the use case list (section 4.5), the use case
  descriptions (section 4.6, one HTML table each) and the functional
  requirements (Table 17, section 4.7).
- report/figures/build-figures.js: which diagram (module) each use case is in.
- prd/tezera-prd.html: requirement rows (id, priority, text). Rows have
  id="AC-01" etc. so links land on the row.
- research/tezera-user-stories.html: stories and the PRD rows they cite.

Links are worked out from PRD IDs: a functional requirement or user story is
linked to a use case when they share at least one PRD row. Then the script runs
tools/build-site.py, which adds the shared navbar.
"""
import html
import pathlib
import re
import runpy
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRS = ROOT / "report/tezera-srs-chapter-4.md"
FIGJS = ROOT / "report/figures/build-figures.js"
PRD = ROOT / "prd/tezera-prd.html"
STORIES = ROOT / "research/tezera-user-stories.html"
OUT = ROOT / "prd/tezera-use-cases.html"

PRD_URL = "tezera-prd.html"
STORY_URL = "../research/tezera-user-stories.html"
FIG_DIR = "../report/figures"

ID_RX = re.compile(r"\b([A-Z]{2})-(\d{2})\b(?:\s+to\s+\1-(\d{2})\b)?")
warnings = []


def read(p: pathlib.Path) -> str:
    return p.read_text(encoding="utf-8").replace("\r\n", "\n")


def strip_tags(s: str) -> str:
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s))).strip()


def expand_ids(text: str, known: dict) -> list:
    """'EV-08 to EV-10, HR-01' -> ['EV-08', 'EV-09', 'EV-10', 'HR-01'] (only IDs the PRD has)."""
    out = []
    for m in ID_RX.finditer(text):
        pre, a, b = m.group(1), int(m.group(2)), m.group(3)
        for n in range(a, (int(b) if b else a) + 1):
            rid = f"{pre}-{n:02d}"
            if rid in known and rid not in out:
                out.append(rid)
            elif rid not in known and not b:
                warnings.append(f"{rid} is cited but not in the PRD")
    return out


# ---------------------------------------------------------------- sources

def load_prd() -> dict:
    t = read(PRD)
    rows = {}
    for m in re.finditer(r'<tr id="([A-Z]{2}-\d{2})"[^>]*>(.*?)</tr>', t, re.S):
        rid, body = m.group(1), m.group(2)
        cells = re.findall(r"<td[^>]*>(.*?)</td>", body, re.S)
        pri = re.search(r'class="pri (\w+)"', body)
        text = strip_tags(cells[2]) if len(cells) > 2 else ""
        rows[rid] = {"pri": pri.group(1) if pri else "", "who": strip_tags(cells[1]) if len(cells) > 1 else "",
                     "text": text}
    if not rows:
        sys.exit("No PRD rows with id= found. Rows need id=\"AC-01\" etc. on their <tr>.")
    return rows


def load_stories(prd: dict) -> list:
    t = read(STORIES)
    out = []
    for m in re.finditer(r'<article class="story" id="([^"]+)" data-role="(\w+)" data-pri="(\w+)">(.*?)</article>', t, re.S):
        sid, role, pri, body = m.groups()
        title = strip_tags(re.search(r"<h4>(.*?)</h4>", body, re.S).group(1))
        refs = re.search(r'<span class="refs">(.*?)</span>', body, re.S)
        ids = expand_ids(strip_tags(refs.group(1)), prd) if refs else []
        out.append({"id": sid, "role": role, "pri": pri, "title": title, "prd": ids})
    return out


def load_modules() -> dict:
    """UC id -> (module slug, module title), from the order of diagrams in build-figures.js."""
    js = read(FIGJS)
    mods, cur = {}, None
    for m in re.finditer(r"title: 'tezera: ([^']+)'|id: '(UC-\d{3})'", js):
        if m.group(1):
            cur = m.group(1)
        elif cur and m.group(2) not in mods:
            mods[m.group(2)] = cur
    return mods


def section(md: str, start: str, end: str) -> str:
    return md[md.index(start):md.index(end)]


def load_srs(prd: dict):
    md = read(SRS)
    # 4.5 list
    s45 = section(md, "## 4.5 ", "## 4.6 ")
    ucs = {}
    for m in re.finditer(r"^\| (UC-\d{3}) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$", s45, re.M):
        uid, name, actor, rows = (g.strip() for g in m.groups())
        ucs[uid] = {"id": uid, "name": name, "actor": actor, "prd": expand_ids(rows, prd), "prd_text": rows}
    intro = [p.strip() for p in s45.split("\n\n") if p.strip() and not p.startswith(("#", "!", "*", "|"))]
    figs = re.findall(r"!\[([^\]]*)\]\(figures/([^)]+)\.png\)\s*\n\s*\*([^*]+)\*", s45)

    # 4.6 descriptions
    s46 = section(md, "## 4.6 ", "## 4.7 ")
    for m in re.finditer(r"\*Table (16\.\d+): (UC-\d{3})[^\n]*\*\s*\n\s*<table>(.*?)</table>", s46, re.S):
        tno, uid, body = m.groups()
        if uid not in ucs:
            warnings.append(f"{uid} has a description but is not in the 4.5 list")
            continue
        fields, flows, cur, span = {}, [], None, 0
        for row in re.findall(r"<tr>(.*?)</tr>", body, re.S):
            f = re.match(r'\s*<th>([^<]+)</th><td colspan="2">(.*)</td>\s*$', row, re.S)
            h = re.match(r'\s*<th rowspan="(\d+)">([^<]+)</th><th>', row)
            s = re.findall(r"<td>(.*?)</td>", row, re.S)
            if h:
                if cur and len(cur["steps"]) != span - 1:
                    warnings.append(f"{uid} {cur['name']}: rowspan says {span - 1} steps, found {len(cur['steps'])}")
                span = int(h.group(1))
                cur = {"name": h.group(2).strip(), "steps": []}
                flows.append(cur)
            elif f:
                if cur and len(cur["steps"]) != span - 1:
                    warnings.append(f"{uid} {cur['name']}: rowspan says {span - 1} steps, found {len(cur['steps'])}")
                cur = None
                fields[f.group(1).strip()] = f.group(2).strip()
            elif len(s) == 2 and cur is not None:
                cur["steps"].append((s[0].strip(), s[1].strip()))
            else:
                warnings.append(f"{uid}: could not read a row: {row[:60]}")
        ucs[uid].update({"table": tno, "fields": fields, "flows": flows})

    # 4.7 functional requirements
    s47 = section(md, "## 4.7 ", "## 4.8 ")
    frs, group = [], ""
    for line in s47.splitlines():
        g = re.match(r"^\| \| \*\*(.+)\*\* \| \|$", line)
        r = re.match(r"^\| (FR\d+) \| (.+) \| (.+) \|$", line)
        if g:
            group = g.group(1)
        elif r:
            src = r.group(3)
            paren = re.findall(r"\(([^()]*[A-Z]{2}-\d{2}[^()]*)\)", src)
            frs.append({"id": r.group(1), "text": r.group(2).strip(), "group": group,
                        "prd": expand_ids(paren[-1], prd) if paren else []})
    return ucs, intro, figs, frs


# ---------------------------------------------------------------- rendering

PRI_ORDER = ["must", "should", "could", "later"]


def pri_class(text: str) -> str:
    w = re.match(r"\s*(\w+)", strip_tags(text))
    c = w.group(1).lower() if w else ""
    return c if c in PRI_ORDER else "could"


def pill(pri: str, label: str = "") -> str:
    return f'<span class="pri {pri}">{html.escape(label or pri.capitalize())}</span>'


def linkify(s: str, prd: dict, ucs: dict, own: str) -> str:
    """Turn UC-xxx and PRD IDs in a cell into links. Cells hold plain text with entities only."""
    def uc(m):
        u = m.group(0)
        if u == own or u not in ucs:
            return u
        return f'<a class="xref" href="#{u}" title="{html.escape(ucs[u]["name"])}">{u}</a>'
    s = re.sub(r"\bUC-\d{3}\b", uc, s)

    def pr(m):
        r = m.group(0)
        if r not in prd:
            return r
        return f'<a class="xref" href="{PRD_URL}#{r}" title="{html.escape(prd[r]["text"])}">{r}</a>'
    return re.sub(r"\b[A-Z]{2}-\d{2}\b", pr, s)


def chip(href: str, label: str, title: str, pri: str = "") -> str:
    dot = f'<i class="d {pri}" aria-hidden="true"></i>' if pri else ""
    return f'<a class="chip" href="{href}" title="{html.escape(title)}">{dot}{html.escape(label)}</a>'


def render_uc(u: dict, prd: dict, ucs: dict, frs: list, stories: list, used_by: dict, mods: dict) -> str:
    uid = u["id"]
    f = u.get("fields", {})
    lk = lambda s: linkify(s, prd, ucs, uid)
    pri_txt = f.get("Priority", "")
    pc = pri_class(pri_txt)
    mod = mods.get(uid, "")
    parts = [f'<article class="uc" id="{uid}" data-mod="{slug(mod)}" data-pri="{pc}">',
             f'<div class="uhead"><span class="sid">{uid}</span><h3>{html.escape(u["name"])}</h3>{pill(pc)}</div>']
    if "Description" in f:
        parts.append(f'<p class="udesc">{lk(f["Description"])}</p>')
    meta = []
    for k in ["Priority", "Primary Actor", "Supporting Actors", "Pre-Conditions", "Trigger"]:
        if k in f:
            meta.append(f"<dt>{html.escape(k.replace('-', ' ').capitalize() if k != 'Pre-Conditions' else 'Before it starts')}</dt><dd>{lk(f[k])}</dd>")
    if meta:
        parts.append(f'<dl class="meta">{"".join(meta)}</dl>')
    for fl in u.get("flows", []):
        kind = fl["name"].split()[0].lower()
        steps = "".join(
            f'<li><div class="a"><span class="who">Actor</span>{lk(a) or "<span class=muted>—</span>"}</div>'
            f'<div class="s"><span class="who">System</span>{lk(s) or "<span class=muted>—</span>"}</div></li>'
            for a, s in fl["steps"])
        parts.append(f'<div class="flow {kind}"><p class="lab">{html.escape(fl["name"])}</p>'
                     f'<div class="cols" aria-hidden="true"><span>Actor</span><span>System</span></div>'
                     f'<ol class="steps">{steps}</ol></div>')
    tail = []
    for k, lab in [("Exclusions", "Out of scope"), ("Post-Conditions", "After it ends")]:
        if k in f:
            tail.append(f"<dt>{lab}</dt><dd>{lk(f[k])}</dd>")
    if tail:
        parts.append(f'<dl class="meta">{"".join(tail)}</dl>')
    if not f:
        parts.append('<p class="note">No description in the SRS yet.</p>')

    # links
    ids = set(u["prd"])
    prd_chips = " ".join(chip(f"{PRD_URL}#{r}", r, prd[r]["text"], prd[r]["pri"]) for r in u["prd"])
    my_frs = [x for x in frs if ids & set(x["prd"])]
    my_st = [s for s in stories if ids & set(s["prd"])]
    rel_ucs = sorted(set(re.findall(r"\bUC-\d{3}\b", " ".join(
        [v for v in f.values()] + [a + " " + s for fl in u.get("flows", []) for a, s in fl["steps"]]))) - {uid})
    links = [f'<div class="lrow"><span class="lk">PRD rows</span><span class="chips">{prd_chips}</span></div>']
    if my_st:
        links.append('<div class="lrow"><span class="lk">User stories</span><span class="chips">' + " ".join(
            chip(f"{STORY_URL}#{s['id']}", s["id"], s["title"], s["pri"]) for s in my_st) + "</span></div>")
    if rel_ucs or used_by.get(uid):
        bits = []
        if rel_ucs:
            bits.append("Refers to " + " ".join(chip(f"#{r}", r, ucs[r]["name"]) for r in rel_ucs if r in ucs))
        if used_by.get(uid):
            bits.append("Referred to by " + " ".join(chip(f"#{r}", r, ucs[r]["name"]) for r in used_by[uid]))
        links.append(f'<div class="lrow"><span class="lk">Use cases</span><span class="chips">{" · ".join(bits)}</span></div>')
    if my_frs:
        items = "".join(f'<li><b>{x["id"]}</b> {html.escape(x["text"])}</li>' for x in my_frs)
        links.append(f'<details class="frs"><summary><span class="lk">Functional requirements</span>'
                     f'<span class="chips">{", ".join(x["id"] for x in my_frs)}</span></summary><ul>{items}</ul></details>')
    parts.append(f'<div class="links">{"".join(links)}</div>')
    if u.get("table"):
        parts.append(f'<p class="src">SRS Table {u["table"]}</p>')
    parts.append("</article>")
    return "\n".join(parts)


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


CSS = r"""
  :root {
    --paper: #F6F7F4; --card: #FFFFFF; --surface: #E9EEEB; --rule: #D2DAD7;
    --ink: #0E2A30; --ink-2: #3D5459; --muted: #6E8185;
    --marigold: #E3A21A; --marigold-soft: #F7E7BF; --marigold-ink: #7A5300;
    --teal: #1F6F78; --teal-soft: #DCEBEA; --rose: #B4493F; --rose-soft: #F6E1DD;
    --display: "Bricolage Grotesque", Georgia, serif;
    --body: "Instrument Sans", "Segoe UI", system-ui, sans-serif;
    color-scheme: light;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --paper: #0F1B1D; --card: #162528; --surface: #1D3034; --rule: #2C4246;
      --ink: #E6EEEE; --ink-2: #B3C4C5; --muted: #8DA0A2;
      --marigold: #F0B73E; --marigold-soft: #3B2F12; --marigold-ink: #F3CF7F;
      --teal: #6CC0C6; --teal-soft: #183B3E; --rose: #EE9A8F; --rose-soft: #3A2220;
      color-scheme: dark;
    }
  }
  :root[data-theme="dark"] {
    --paper: #0F1B1D; --card: #162528; --surface: #1D3034; --rule: #2C4246;
    --ink: #E6EEEE; --ink-2: #B3C4C5; --muted: #8DA0A2;
    --marigold: #F0B73E; --marigold-soft: #3B2F12; --marigold-ink: #F3CF7F;
    --teal: #6CC0C6; --teal-soft: #183B3E; --rose: #EE9A8F; --rose-soft: #3A2220;
    color-scheme: dark;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; background: var(--paper); color: var(--ink); font-family: var(--body); font-size: 16px; line-height: 1.55; }
  .doc { max-width: 960px; margin: 0 auto; padding: 40px 16px 96px; }
  .eyebrow { font-size: 13px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--teal); margin: 0 0 8px; }
  h1 { font-family: var(--display); font-weight: 600; font-size: clamp(34px, 6vw, 54px); line-height: 1.04; margin: 0; letter-spacing: -.015em; }
  .byline { color: var(--muted); font-size: 14px; margin: 18px 0 0; padding-bottom: 20px; border-bottom: 1px solid var(--rule); }
  .lead { font-size: 19px; margin: 24px 0; }
  h2 { font-family: var(--display); font-weight: 600; font-size: 28px; margin: 56px 0 12px; padding-top: 10px; border-top: 2px solid var(--ink); scroll-margin-top: 72px; }
  p { margin: 10px 0; }
  ul { padding-left: 22px; } li { margin: 4px 0; }
  a { color: var(--teal); }
  .muted { color: var(--muted); }
  .note { font-size: 14px; color: var(--ink-2); }
  b { font-weight: 600; }
  code { font-size: .9em; background: var(--surface); padding: 1px 5px; border-radius: 4px; }

  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 20px 0; }
  .stat { background: var(--card); border: 1px solid var(--rule); border-radius: 10px; padding: 14px 16px; }
  .stat .k { font-size: 13px; color: var(--ink-2); }
  .stat .v { font-weight: 600; font-size: 32px; line-height: 1.1; margin-top: 4px; font-variant-numeric: tabular-nums; }
  .stat .d { font-size: 13px; color: var(--muted); margin-top: 2px; }
  .stat.hl { border-top: 3px solid var(--marigold); }

  .pri { display: inline-block; min-width: 58px; text-align: center; padding: 2px 8px; border-radius: 999px; font-size: 12.5px; font-weight: 600; white-space: nowrap; }
  .pri.must { background: var(--ink); color: var(--paper); }
  .pri.should { background: var(--marigold); color: #0E2A30; }
  .pri.could { background: var(--teal-soft); color: var(--teal); border: 1px solid var(--teal); }
  .pri.later { background: transparent; color: var(--muted); border: 1px dashed var(--muted); }

  /* Figures */
  .figs { display: grid; gap: 14px; margin: 16px 0; }
  figure { margin: 0; background: var(--card); border: 1px solid var(--rule); border-radius: 10px; padding: 12px; }
  figure a { display: block; border-radius: 6px; overflow: hidden; background: #fff; }
  figure img { display: block; width: 100%; height: auto; }
  figcaption { font-size: 14px; color: var(--ink-2); margin-top: 8px; }
  .figs.two { grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr)); }

  /* Index table */
  .tbl { overflow-x: auto; margin: 14px 0; border: 1px solid var(--rule); border-radius: 8px; background: var(--card); }
  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  th, td { text-align: left; vertical-align: top; padding: 9px 12px; border-bottom: 1px solid var(--rule); }
  th { background: var(--surface); font-size: 12.5px; text-transform: uppercase; letter-spacing: .04em; color: var(--ink-2); font-weight: 600; }
  tr:last-child td { border-bottom: 0; }
  td.id { white-space: nowrap; font-weight: 600; font-variant-numeric: tabular-nums; }
  td.id a { text-decoration: none; }
  tbody tr:hover td { background: var(--surface); }
  td .xref { white-space: nowrap; }

  /* Filters */
  .filters { position: sticky; top: var(--tz-h, 56px); z-index: 4; background: var(--paper); padding: 10px 0; margin: 8px 0 4px; border-bottom: 1px solid var(--rule); display: flex; flex-wrap: wrap; gap: 8px 18px; align-items: center; font-size: 14px; }
  .filters .grp { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
  .filters .grp > span { color: var(--muted); font-size: 12.5px; text-transform: uppercase; letter-spacing: .05em; margin-right: 4px; }
  .filters button { font: inherit; font-size: 13.5px; min-height: 32px; padding: 4px 11px; border-radius: 999px; border: 1px solid var(--rule); background: var(--card); color: var(--ink-2); cursor: pointer; }
  .filters button[aria-pressed="true"] { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .filters .shown { margin-left: auto; color: var(--muted); font-size: 13px; }
  html:not(.tz-js) .filters { display: none; }
  @media (max-width: 640px) { .filters { position: static; } .filters .shown { margin-left: 0; width: 100%; } .doc .uc { scroll-margin-top: 72px; } }

  /* Use case cards */
  .uc { background: var(--card); border: 1px solid var(--rule); border-radius: 12px; padding: 16px 18px; margin: 14px 0; scroll-margin-top: 120px; }
  .uc:target { border-color: var(--marigold); box-shadow: 0 0 0 2px var(--marigold-soft); }
  .uc[hidden] { display: none; }
  .uhead { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .uhead h3 { margin: 0; flex: 1 1 260px; font-family: var(--display); font-size: 21px; font-weight: 600; letter-spacing: -.005em; }
  .sid { font-weight: 600; font-size: 13px; color: var(--teal); font-variant-numeric: tabular-nums; }
  .udesc { font-size: 16.5px; margin: 8px 0 12px; }
  dl.meta { display: grid; grid-template-columns: 9.5em 1fr; gap: 4px 14px; margin: 10px 0; font-size: 14.5px; }
  dl.meta dt { color: var(--muted); font-weight: 600; font-size: 12.5px; text-transform: uppercase; letter-spacing: .04em; padding-top: 2px; }
  dl.meta dd { margin: 0; }
  @media (max-width: 560px) { dl.meta { grid-template-columns: 1fr; } dl.meta dd { margin-bottom: 6px; } }

  .flow { margin: 14px 0 6px; }
  .lab { margin: 0 0 4px; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--ink-2); }
  .flow .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12px; color: var(--muted); padding: 0 12px 2px; }
  ol.steps { list-style: none; margin: 0; padding: 0; border-left: 3px solid var(--teal); border-radius: 2px; }
  .flow.exception ol.steps { border-left-color: var(--rose); }
  .flow.alternate ol.steps { border-left-color: var(--marigold); }
  ol.steps li { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0; padding: 7px 12px; font-size: 14.5px; border-bottom: 1px solid var(--rule); }
  ol.steps li:last-child { border-bottom: 0; }
  ol.steps li:nth-child(odd) { background: color-mix(in srgb, var(--surface) 45%, transparent); }
  ol.steps .who { display: none; }
  ol.steps .s { color: var(--ink-2); }
  @media (max-width: 640px) {
    .flow .cols { display: none; }
    ol.steps li { grid-template-columns: 1fr; gap: 4px; }
    ol.steps .who { display: block; font-size: 11.5px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--muted); }
  }

  .links { border-top: 1px solid var(--rule); margin-top: 14px; padding-top: 10px; display: grid; gap: 6px; font-size: 14px; }
  .lrow, .frs summary { display: grid; grid-template-columns: 11.5em 1fr; gap: 10px; align-items: baseline; }
  @media (max-width: 560px) { .lrow, .frs summary { grid-template-columns: 1fr; gap: 2px; } }
  .lk { color: var(--muted); font-weight: 600; font-size: 12.5px; text-transform: uppercase; letter-spacing: .04em; }
  .chips { display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; color: var(--muted); }
  a.chip { display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px; border-radius: 6px; border: 1px solid var(--rule); background: var(--paper); color: var(--ink); text-decoration: none; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
  a.chip:hover { border-color: var(--teal); color: var(--teal); }
  a.chip .d { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); }
  a.chip .d.must { background: var(--ink); } a.chip .d.should { background: var(--marigold); }
  a.chip .d.could { background: transparent; border: 1.5px solid var(--teal); } a.chip .d.later { background: transparent; border: 1.5px dashed var(--muted); }
  .frs summary { cursor: pointer; list-style: none; }
  .frs summary::-webkit-details-marker { display: none; }
  .frs summary .chips::after { content: "show"; margin-left: 6px; font-size: 12.5px; color: var(--teal); text-decoration: underline; }
  .frs[open] summary .chips::after { content: "hide"; }
  .frs ul { margin: 6px 0 2px; padding-left: 0; list-style: none; display: grid; gap: 4px; }
  .frs li { margin: 0; padding: 6px 10px; background: var(--surface); border-radius: 6px; font-size: 14px; }
  .frs li b { color: var(--teal); margin-right: 4px; }
  .src { margin: 8px 0 0; font-size: 12.5px; color: var(--muted); text-align: right; }
  .xref { font-weight: 600; text-decoration-thickness: 1px; text-underline-offset: 2px; }

  .callout { background: var(--card); border: 1px solid var(--rule); border-left: 4px solid var(--marigold); border-radius: 8px; padding: 12px 16px; margin: 16px 0; font-size: 15px; }
  .callout > :first-child { margin-top: 0; } .callout > :last-child { margin-bottom: 0; }

  @media print {
    @page { size: A4; margin: 15mm 13mm; }
    :root { --paper: #fff; }
    body { font-size: 10.5pt; }
    .doc { max-width: none; padding: 0; }
    .filters { display: none !important; }
    .uc, figure, tr { break-inside: avoid; }
    .frs ul { display: grid !important; }
    a { color: var(--ink); text-decoration: none; }
  }
"""

JS = r"""
(function () {
  var cards = [].slice.call(document.querySelectorAll('.uc'));
  var shown = document.querySelector('.filters .shown');
  var state = { mod: 'all', pri: 'all' };
  function apply() {
    var n = 0;
    cards.forEach(function (c) {
      var ok = (state.mod === 'all' || c.dataset.mod === state.mod) && (state.pri === 'all' || c.dataset.pri === state.pri);
      c.hidden = !ok; if (ok) n++;
    });
    if (shown) shown.textContent = n + ' of ' + cards.length + ' shown';
  }
  document.querySelectorAll('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.dataset.f;
      document.querySelectorAll('.filters button[data-f="' + f + '"]').forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      state[f] = b.dataset.v; apply();
    });
  });
  // A link to a hidden card clears the filters first.
  function reveal() {
    var t = location.hash && document.getElementById(location.hash.slice(1));
    if (t && t.classList.contains('uc') && t.hidden) {
      document.querySelectorAll('.filters button[data-v="all"]').forEach(function (b) { b.click(); });
      t.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', reveal);
  apply(); reveal();
})();
"""


def build() -> str:
    prd = load_prd()
    stories = load_stories(prd)
    mods = load_modules()
    ucs, intro, figs, frs = load_srs(prd)
    for uid, u in ucs.items():
        if "fields" not in u:
            warnings.append(f"{uid} has no description table in section 4.6")
        if uid not in mods:
            warnings.append(f"{uid} is not in any diagram in build-figures.js")

    used_by = {}
    for uid, u in ucs.items():
        txt = " ".join(list(u.get("fields", {}).values()) + [a + " " + s for fl in u.get("flows", []) for a, s in fl["steps"]])
        for r in sorted(set(re.findall(r"\bUC-\d{3}\b", txt)) - {uid}):
            used_by.setdefault(r, []).append(uid)

    # Stats
    pri_counts = {p: sum(1 for u in ucs.values() if pri_class(u.get("fields", {}).get("Priority", "")) == p) for p in PRI_ORDER}
    cited = {r for u in ucs.values() for r in u["prd"]}
    in_scope = [r for r, v in prd.items() if v["pri"] != "later"]
    uncovered = [r for r in in_scope if r not in cited]
    linked_stories = {s["id"] for s in stories for u in ucs.values() if set(s["prd"]) & set(u["prd"])}
    linked_frs = {x["id"] for x in frs for u in ucs.values() if set(x["prd"]) & set(u["prd"])}
    actors = sorted({a.strip().capitalize() for u in ucs.values() for a in re.split(r",| and ", u["actor"])})

    mod_names = []
    for m in mods.values():
        if m not in mod_names:
            mod_names.append(m)

    # Figures
    fig_html = []
    for alt, name, cap in figs:
        svg = read(ROOT / "report/figures" / f"{name}.svg")
        wh = re.search(r"width='(\d+)' height='(\d+)'", svg) or re.search(r'width="(\d+)" height="(\d+)"', svg)
        size = f' width="{wh.group(1)}" height="{wh.group(2)}"' if wh else ""
        fig_html.append(f'<figure><a href="{FIG_DIR}/{name}.svg" title="Open full size"><img src="{FIG_DIR}/{name}.svg" alt="{html.escape(alt)}"{size} loading="lazy"></a>'
                        f"<figcaption>{html.escape(cap)}</figcaption></figure>")
    actors_fig, uc_figs = fig_html[:1], fig_html[1:]

    # Index table
    rows = []
    for uid in sorted(ucs):
        u = ucs[uid]
        pc = pri_class(u.get("fields", {}).get("Priority", ""))
        rows.append(f'<tr><td class="id"><a href="#{uid}">{uid}</a></td><td><a href="#{uid}">{html.escape(u["name"])}</a></td>'
                    f'<td>{html.escape(u["actor"])}</td><td>{linkify(html.escape(u["prd_text"]), prd, ucs, uid)}</td><td>{pill(pc)}</td></tr>')

    filt_mod = "".join(f'<button type="button" data-f="mod" data-v="{slug(m)}" aria-pressed="false" title="{html.escape(m.capitalize())}">{html.escape(m.split(",")[0].capitalize())}</button>' for m in mod_names)
    filt_pri = "".join(f'<button type="button" data-f="pri" data-v="{p}" aria-pressed="false">{p.capitalize()}</button>' for p in PRI_ORDER if pri_counts[p])

    cards = [render_uc(ucs[uid], prd, ucs, frs, stories, used_by, mods) for uid in sorted(ucs)]

    unc_rows = "".join(
        f'<tr><td class="id"><a href="{PRD_URL}#{r}">{r}</a></td><td>{html.escape(prd[r]["text"])}</td><td>{pill(prd[r]["pri"])}</td></tr>'
        for r in uncovered)

    intro_html = "".join(f"<p>{html.escape(p)}</p>" for p in intro)
    pri_line = " · ".join(f"{pri_counts[p]} {p.capitalize()}" for p in PRI_ORDER if pri_counts[p])

    return f"""<!doctype html>
<!--
  tezera: Use cases. GENERATED by tools/build-use-cases.py from report/tezera-srs-chapter-4.md
  (sections 4.5 to 4.7), report/figures/build-figures.js, prd/tezera-prd.html and
  research/tezera-user-stories.html. Do not edit by hand: change the sources and run
  python tools/build-use-cases.py
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tezera Use Cases</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<main class="doc">

<header>
  <p class="eyebrow">Requirements · ATP release</p>
  <h1>Use cases</h1>
  <p class="byline">UC-001 to UC-{max(int(k[3:]) for k in ucs):03d} · from the SRS draft (report Chapter 4, sections 4.5 and 4.6) and PRD version 7 · SDGP Agile Team Project</p>
</header>

<p class="lead">What each kind of user does with Tezera, step by step: who starts it, what the system does in reply, what can go wrong, and what is out of scope. Every use case links to the PRD rows it delivers, the functional requirements in the SRS and the user stories that test it.</p>

<div class="stats">
  <div class="stat hl"><div class="k">Use cases</div><div class="v">{len(ucs)}</div><div class="d">{pri_line}</div></div>
  <div class="stat"><div class="k">Actors</div><div class="v">{len(actors)}</div><div class="d">primary actors named</div></div>
  <div class="stat"><div class="k">PRD rows cited</div><div class="v">{len(cited)}</div><div class="d">of {len(in_scope)} in the ATP release</div></div>
  <div class="stat"><div class="k">Linked</div><div class="v">{len(linked_frs)}</div><div class="d">functional requirements, and {len(linked_stories)} user stories</div></div>
</div>

<ul>
  <li><b>Priority</b> is the use case's main priority from the PRD (MoSCoW): {pill("must")} {pill("should")} {pill("could")}. Parts with a lower priority are named in the use case.</li>
  <li><b>Flows.</b> The main flow is the usual path. Exception flows (E1, E2) are where something goes wrong; alternate flows (A1, A2) are other ways to reach the goal.</li>
  <li><b>Links.</b> PRD rows open the row in the PRD. A functional requirement or user story is listed when it delivers one of the same PRD rows. Hover a link to read the row or story title.</li>
  <li><b>(proposed)</b> marks a value the team has not confirmed. Like the PRD, this page says "consumer" for someone who attends events and "provider" for vendors and freelancers together.</li>
</ul>

<h2 id="diagrams">Actors and diagrams</h2>
{intro_html}
<div class="figs">{"".join(actors_fig)}</div>
<div class="figs">{"".join(uc_figs)}</div>

<h2 id="list">All use cases</h2>
<div class="tbl"><table>
<thead><tr><th>ID</th><th>Use case</th><th>Primary actor</th><th>PRD rows</th><th>Priority</th></tr></thead>
<tbody>
{chr(10).join(rows)}
</tbody></table></div>

<h2 id="descriptions">Descriptions</h2>
<section class="ucs" aria-label="Use case descriptions">
<div class="filters" role="group" aria-label="Filter use cases">
  <div class="grp"><span>Diagram</span><button type="button" data-f="mod" data-v="all" aria-pressed="true">All</button>{filt_mod}</div>
  <div class="grp"><span>Priority</span><button type="button" data-f="pri" data-v="all" aria-pressed="true">All</button>{filt_pri}</div>
  <span class="shown" aria-live="polite"></span>
</div>
{chr(10).join(cards)}
</section>

<h2 id="coverage">PRD rows with no use case</h2>
<p>These ATP-release rows are not cited by any use case. Most are profile, settings or display details that sit inside a larger flow; they are still covered by the functional requirements and user stories. Ticketing rows (Later) are left out.</p>
<div class="tbl"><table>
<thead><tr><th>PRD row</th><th>Requirement</th><th>Priority</th></tr></thead>
<tbody>{unc_rows}</tbody></table></div>

<div class="callout">
  <p><b>Where this page comes from.</b> It is built by <code>tools/build-use-cases.py</code> from the SRS draft (<code>report/tezera-srs-chapter-4.md</code>), the diagram script, the PRD and the user stories. To change a use case, edit the SRS and run the script; do not edit this page.</p>
</div>

</main>
<script>{JS}</script>
</body>
</html>
"""


def main() -> None:
    page = build()
    OUT.write_bytes(page.encode("utf-8"))
    print("page ", OUT.relative_to(ROOT).as_posix())
    for w in warnings:
        print("warn ", w)
    runpy.run_path(str(ROOT / "tools" / "build-site.py"), run_name="__main__")


if __name__ == "__main__":
    main()

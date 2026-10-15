# CLAUDE.md — Tezera (SDGP / ATP)

Tezera = name. Write "tezera" as wordmark (logo, h1, diagram title), "Tezera" in prose + sentence starts. No acronym, no tagline. Was Eventline → REVAMP (6 Oct 2026) → Tezera (8 Oct 2026). Sri Lankan event platform: organisers, vendors, freelancers, consumers (+ admins). Mobile app + web portal. 2nd-year SDGP team project, 5 students. Repo = docs only, no code yet.

## Start every session
1. Read `HANDOFF.md` → current state, decisions, next steps.
2. Source of truth: `prd/tezera-prd.html` > `proposal/tezera-proposal.html` > `PRD Research.md`. Conflict → PRD wins, flag it.

## End every session or section of work — REQUIRED
Update `HANDOFF.md` before stop:
- "Last updated" line (date, who).
- Current state + next steps + open decisions → rewrite to match reality.
- New log entry at TOP of session log: date, changes (files), decisions + who, what unverified.
- Log >10 entries → fold oldest into one "Earlier" line each.
Docs diverge → also update README "How the proposal and the PRD differ".

## Files
| File | Edit how |
|---|---|
| `prd/tezera-prd.html` | PRD v3, hand-edited HTML. Priority pill `<span class="pri must|should|could|later">`. Changed row → `<span class="tag">vN</span>` + line in "What changed" box. Open question settled → `<li class="done">` + where settled. Section 8 = tech approach; section 14 = open questions. |
| `prd/tezera-architecture.html` | GENERATED. No hand-edit. Edit `.archify/architecture-tezera-sse-20261008-132233/candidate.json` (older dirs = history), run archify `finalize` (skill `/archify`), copy output HTML to `prd/tezera-architecture.html`, then run `python3 .archify/inject-nav.py` (re-adds doc navbar). |
| `proposal/tezera-proposal.html` | Proposal source, 8 fixed A4 pages. After edit → regen PDF (below), confirm 8 pages. |
| `Tezera Proposal.pdf` | GENERATED from proposal HTML. |
| `research/tezera-survey-analysis.html`, `research/tezera-user-stories.html` | Hand-edited HTML, generated from the 3 survey CSVs (not in repo; contain emails). Stories = title + Given/When/Then scenarios (`<div class="gwt">`), no "As a" line. |
| `PRD Research.md` | Research record for PRD v1 (30 Sep 2026) + v2/v3 notes. No rewriting findings; append. |
| `research/tezera-personas.html` | Hand-edited HTML. 8 personas (`<article class="persona">`), survey-segment based; invented details marked (assumed). Story chips + matrix at end → update both when stories change. |
| `research/tezera-work-items.html` | Hand-edited HTML. Epic `<section class="epic">` › story `<article class="item">` (US- / PG- PRD gap / EN- enabling) › task `<tr class="task" data-pts data-area>`. Story pts = sum of tasks, update header pill + epic count. R1–R12 accepted 15 Oct → tasks in backlog. Future unaccepted proposals → park in a "Waiting on a group decision" list, not backlog. |
| `research/tezera-work-items-jira.csv` | GENERATED. Page's "Download Jira CSV" button, or headless Chrome `--dump-dom ".../tezera-work-items.html#export-csv"` → `<pre id="csvout">` (dump doubles line breaks: replace `\n\n` with `\r\n`). Epics, then stories, then sub-tasks; `Issue ID` + `Parent`. |
| `brand/tezera-brand-manual.html` | Brand manual, hand-edited HTML (tiles + colour cards built by inline JS). Palettes in CSS `.org/.orgd/.ven/.vend/.att/.attd` AND JS `pal` object → change both. Vendor palette = inverse of organiser (intended). Vendor dark = (proposed). |
| `SDG Alignment.md` | SDG 8 primary, 9 secondary, 10 supporting. |

All 7 HTML docs share a navbar (`.brandbar` / `.doclinks`: PRD, Architecture, Survey analysis, Personas, User stories, Work items, Brand manual; brand manual's sits on its cover as `.docnav`). New doc → add link in all 7 (architecture via `.archify/inject-nav.py`).

Regen proposal PDF (Git Bash, Windows):
```
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$(cygpath -w "$PWD/Tezera Proposal.pdf")" "file:///C:/Users/DDC%20IIT/Documents/GitHub/ATP/proposal/tezera-proposal.html"
```
macOS:
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$PWD/Tezera Proposal.pdf" "file://$PWD/proposal/tezera-proposal.html"
```
Check pages: `pdftotext "Tezera Proposal.pdf" - | grep -c $'\f'` → 8. No pdftotext (Mac): `python3 -c "import re;print(len(re.findall(rb'/Type\s*/Page(?!s)',open('Tezera Proposal.pdf','rb').read())))"`.

## Locked decisions (details + dates in HANDOFF.md)
- Ticketing/QR entry/refunds/payment gateway OUT of ATP release → first phase after ATP. TK-* rows = Later.
- No in-app payments during ATP; hiring + stall fees paid outside app.
- Attendee reviews unlock from 'Going' mark made before event start.
- No 3D venue view (removed 15 Oct 2026, PRD v5; VM-05/06/07 IDs not reused). Interactive 2D map instead: zones as boxes, stall list + items/prices, search by item, find on map = Must (VM-08–12); stage line-up, stall-type filter = Should (VM-13/14); offline mobile = Could (VM-15).
- Survey recs R1–R12 all accepted 15 Oct 2026 (PRD v5). Accounts 16+ (proposed), parent/guardian tick under 18; events carry age rating, gate checks ID.
- Stack (recommended, team confirm): TypeScript monorepo; React Native + Expo; Next.js (+ admin panel) on Vercel; NestJS modular monolith REST + SSE (no WebSockets); PostgreSQL (Neon) + Prisma; Redis (Upstash) + BullMQ worker; Cloudinary; Expo Push, Resend, Dialog e-SMS (OTP + urgent alerts). Web portal for all roles incl. consumers. Free tiers.

## Writing rules
- British spelling (organiser, colour, licence). LKR prices.
- PRD: "consumers"; proposal: "attendees". "Providers" = vendors + freelancers.
- Unverified numbers/rules → mark "(proposed)". Research claims need source, else say not researched.
- MoSCoW: Must / Should / Could / Later.
- Scope/name change → update ALL: PRD, proposal (+PDF), README, diagram, research notes, SDG notes, HANDOFF.

## Environment gotchas
- Windows; Git Bash + PowerShell. Python 3.14 (`python3`). Only `pdftotext` from poppler (no pdftoppm) → read PDFs as text; render HTML via headless Chrome screenshots.
- Some .md files CRLF → normalise line endings in scripted replacements or matches fail.
- NEVER commit or push. User does all git (commit, push, branches, PRs). Leave changes uncommitted; list changed files at end.
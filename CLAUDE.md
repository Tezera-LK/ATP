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
| `prd/tezera-prd.html` | PRD v7, hand-edited HTML. Priority pill `<span class="pri must|should|could|later">`. Changed row → `<span class="tag">vN</span>` + line in "What changed" box. Open question settled → `<li class="done">` + where settled. Section 8 = tech approach; section 14 = open questions. |
| `prd/tezera-architecture.html` | GENERATED. No hand-edit. Edit `.archify/architecture-tezera-v7-20261120-235350/candidate.json` (PRD v7; older dirs = history), run archify `finalize` (skill `/archify`, package `tt-a1i/archify`; installed on Damian's machine 21 Nov: `npx skills add tt-a1i/archify@archify -g -y`), copy output HTML to `prd/tezera-architecture.html`, then run `.archify/inject-nav.py` with Python (re-adds doc navbar). |
| `proposal/tezera-proposal.html` | Proposal source, 8 fixed A4 pages. After edit → regen PDF (below), confirm 8 pages. |
| `Tezera Proposal.pdf` | GENERATED from proposal HTML. |
| `research/tezera-survey-analysis.html`, `research/tezera-user-stories.html` | Hand-edited HTML, generated from the 3 survey CSVs (not in repo; contain emails). Stories = title + Given/When/Then scenarios (`<div class="gwt">`), no "As a" line. |
| `PRD Research.md` | Research record for PRD v1 (30 Sep 2026) + v2/v3 notes. No rewriting findings; append. |
| `research/tezera-personas.html` | Hand-edited HTML. 8 personas (`<article class="persona">`), survey-segment based; invented details marked (assumed). Story chips + matrix at end → update both when stories change. |
| `research/tezera-research-briefs.html` | Hand-edited HTML. Desk-research briefs (question, method, findings + source links, "What the PRD did with this"). New brief → new `<section>` + TOC entry; keep (not verified) markers. 15 Oct 2026: #payments (SL payments law, gateways, tax, PDPA), #map-builder (ai-studio concept). |
| `research/tezera-work-items.html` | Hand-edited HTML. Epic `<section class="epic">` › story `<article class="item">` (US- / PG- PRD gap / EN- enabling) › task `<tr class="task" data-pts data-area>`. Story pts = sum of tasks, update header pill + epic count. R1–R12 accepted 15 Oct → tasks in backlog. Future unaccepted proposals → park in a "Waiting on a group decision" list, not backlog. |
| `research/tezera-work-items-jira.csv` | GENERATED. Page's "Download Jira CSV" button, or headless Chrome `--dump-dom ".../tezera-work-items.html#export-csv"` → `<pre id="csvout">` (dump doubles line breaks: replace `\n\n` with `\r\n`). Epics, then stories, then sub-tasks; `Issue ID` + `Parent`. Imported 22 Oct 2026 → Jira space TES (tezera.atlassian.net), classic CSV importer (steps in HANDOFF gotchas). Jira = live backlog now; re-import = duplicates. |
| `brand/tezera-brand-manual.html` | Brand manual, hand-edited HTML (tiles + colour cards built by inline JS). Palettes in CSS `.org/.orgd/.ven/.vend/.att/.attd` AND JS `pal` object → change both. Vendor palette = inverse of organiser (intended). Vendor dark = (proposed). |
| `report/tezera-srs-chapter-4.md` | Draft report ch. 4 SRS (20 Nov 2026), from PRD v7 + survey + HANDOFF. FR1–FR66, NFR1–NFR21, UC-001–UC-020, AS1–AS17. No client yet → [bracket] slots, never invent meetings. Figures: edit `report/figures/build-figures.js`, `node` it, re-export PNG via headless Chrome `--screenshot`. PRD row change → check FR/UC tables. |
| `database/*.md` + `.pdf` | Team DB/auth plans (Yevan). PDF = md via `marked` + headless Chrome print (throwaway script in scratchpad). Table plan v2 20 Nov (Cognito). |
| `SDG Alignment.md` | SDG 8 primary, 9 secondary, 10 supporting. |
| `mindmaps/tezera-<role>-map.mm` + `-outline.txt` | Account mind maps for MindMeister: organiser (19 Oct), vendor (20 Oct). FreeMind import; outline = tab-indented, for Outline-mode paste. From PRD v6; same labels; non-Must tagged "(Should)" etc. in label, PRD IDs in .mm notes. Vendor map = vendor only (freelancer = same minus Stalls + My stall on the venue map). Snapshot: once imported, MindMeister copy = live. Previews = claude.ai artifacts: organiser https://claude.ai/artifact/9VpfRaGRRvXBVWgQXPNPar, vendor https://claude.ai/artifact/PosoPp9LJxj8MsihgrnnTk. PRD row changes for a role → update its map. Consumer map lives in MindMeister only. |

All 8 HTML docs share a navbar (`.brandbar` / `.doclinks`: PRD, Architecture, Survey analysis, Personas, User stories, Work items, Research briefs, Brand manual; brand manual's sits on its cover as `.docnav`). New doc → add link in all 8 (architecture via `.archify/inject-nav.py`).

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
- Ticketing/QR entry/ticket refunds OUT of ATP release → first phase after ATP. TK-* rows = Later.
- Payments (15 Oct 2026, PRD v6): SANDBOX ONLY in ATP (PayHere test mode, no real money), Should: HR-14 instalments, HR-17 connect own merchant acct, HR-18 stall fees, HR-19 cancellation fees/refunds, HR-20 receipts + commission shown not charged. Direct to payee's own merchant acct; Tezera NEVER holds/splits funds (else CBSL MVTS registration, LKR 15m capital). PayHere behind provider interface in NestJS; PayHere notify = REST route on the API (PRD v7). No acct → pay outside + HR-15. Real money = after ATP, after legal Qs in PRD s14. Ticket refunds stay Later.
- Attendee reviews unlock from 'Going' mark made before event start.
- No 3D venue view (removed 15 Oct 2026, PRD v5; VM-05/06/07 IDs not reused). Interactive 2D map instead: zones as boxes, stall list + items/prices, search by item, find on map = Must (VM-08–12); stage line-up, stall-type filter = Should (VM-13/14); offline mobile = Could (VM-15). Map builder (15 Oct, PRD v6): web builder + mobile quick edits, snapping, scale, one standard versioned map JSON (0–1 coords, stable IDs) = Must (VM-16–18); PDF, blank grid, saved venue maps = Should (VM-19–21); AI draft via Claude on Bedrock = Could (VM-22). Concept + code from Damian's own repo EnderGuardian25/ai-studio (no LICENSE, reuse allowed).
- Survey recs R1–R12 all accepted 15 Oct 2026 (PRD v5). Accounts 16+ (proposed), parent/guardian tick under 18; events carry age rating, gate checks ID.
- Stack (20 Nov 2026, PRD v7, Damian; matches team code repo Tezera-LK/tezera; group confirm): pnpm + Turborepo monorepo (`apps/api`, `apps/web`, `amplify/` auth only, `infra/` CDK, Flutter `apps/mobile` proposed). Flutter app (Dart). Next.js on Amplify Hosting (+ admin routes). NestJS = ONE Lambda behind API Gateway HTTP API (REST), CDK, ap-south-1. Cognito via Amplify Gen 2 code, groups `attendee`/`organiser`/`vendor`/`freelancer`/`admin` (code says attendee, PRD prose says consumer); NestJS checks token (`aws-jwt-verify`), `users` row on first request. PostgreSQL 16 + Prisma 6 = main DB (host NOT chosen); DynamoDB = chat, feed, WebSocket connections. Live updates = API Gateway WebSocket API + Lambdas + DynamoDB Streams. SQS (+DLQ), EventBridge Scheduler. S3 + CloudFront. FCM push, SES, Dialog e-SMS. PayHere notify = REST route. Search = PostgreSQL full-text + pg_trgm. Secrets in Parameter Store/Secrets Manager. Superseded: Amplify Data/AppSync/GraphQL, DynamoDB-only, React Native + Expo, Expo Push (PRD v6, 15 Oct).

## Writing rules
- British spelling (organiser, colour, licence). LKR prices.
- PRD: "consumers"; proposal: "attendees". "Providers" = vendors + freelancers.
- Unverified numbers/rules → mark "(proposed)". Research claims need source, else say not researched.
- MoSCoW: Must / Should / Could / Later.
- Scope/name change → update ALL: PRD, proposal (+PDF), README, diagram, research notes, SDG notes, HANDOFF.

## Environment gotchas
- Windows; Git Bash + PowerShell. Python 3.14: in Git Bash `python3` may hit the Microsoft Store stub; use `"/c/Users/DDC IIT/AppData/Local/Python/bin/python3.14"`. Only `pdftotext` from poppler (no pdftoppm) → read PDFs as text; render HTML via headless Chrome screenshots.
- Some .md files CRLF → normalise line endings in scripted replacements or matches fail.
- NEVER commit or push. User does all git (commit, push, branches, PRs). Leave changes uncommitted; list changed files at end.
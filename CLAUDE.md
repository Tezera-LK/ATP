# CLAUDE.md — REVAMP (SDGP / ATP)

REVAMP = Retail Engagement, Vendor Activation & Marketing Platform. Core idea: Transform + Amplify. Was "Eventline" (renamed 6 Oct 2026). Sri Lankan event platform: organisers, vendors, freelancers, consumers (+ admins). Mobile app + web portal. 2nd-year SDGP team project, 5 students. Repo = docs only, no code yet.

## Start every session
1. Read `HANDOFF.md` → current state, decisions, next steps.
2. Source of truth: `prd/revamp-prd.html` > `proposal/revamp-proposal.html` > `PRD Research.md`. Conflict → PRD wins, flag it.

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
| `prd/revamp-prd.html` | PRD v2, hand-edited HTML. Priority pill `<span class="pri must|should|could|later">`. Changed row → `<span class="tag">vN</span>` + line in "What changed" box. Open question settled → `<li class="done">` + where settled. Section 8 = tech approach; section 14 = open questions. |
| `prd/revamp-architecture.html` | GENERATED. No hand-edit. Edit `.archify/architecture-revamp-3d-20261006-115638/candidate.json`, run archify `finalize` (skill `/archify`), copy output HTML to `prd/revamp-architecture.html`. |
| `proposal/revamp-proposal.html` | Proposal source, 8 fixed A4 pages. After edit → regen PDF (below), confirm 8 pages. |
| `REVAMP Proposal.pdf` | GENERATED from proposal HTML. |
| `PRD Research.md` | Research record for PRD v1 (30 Sep 2026) + v2 notes. No rewriting findings; append. |
| `SDG Alignment.md` | SDG 8 primary, 9 secondary, 10 supporting. |

Regen proposal PDF (Git Bash):
```
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$(cygpath -w "$PWD/REVAMP Proposal.pdf")" "file:///C:/Users/DDC%20IIT/Documents/GitHub/ATP/proposal/revamp-proposal.html"
```
Check pages: `pdftotext "REVAMP Proposal.pdf" - | grep -c $'\f'` → 8.

## Locked decisions (details + dates in HANDOFF.md)
- Ticketing/QR entry/refunds/payment gateway OUT of ATP release → first phase after ATP. TK-* rows = Later.
- No in-app payments during ATP; hiring + stall fees paid outside app.
- Attendee reviews unlock from 'Going' mark made before event start.
- 3D venue view = Could (VM-05/06), VM-07 GLB upload = Later. Client-side (Three.js/R3F), 2D map default.
- Stack (recommended, team confirm): TypeScript monorepo; React Native + Expo; Next.js (+ admin panel) on Vercel; NestJS modular monolith REST + Socket.IO; PostgreSQL (Neon) + Prisma; Redis (Upstash) + BullMQ worker; Cloudinary; Expo Push, Resend, SMS (Notify.lk/Twilio). Free tiers.

## Writing rules
- British spelling (organiser, colour, licence). LKR prices.
- PRD: "consumers"; proposal: "attendees". "Providers" = vendors + freelancers.
- Unverified numbers/rules → mark "(proposed)". Research claims need source, else say not researched.
- MoSCoW: Must / Should / Could / Later.
- Scope/name change → update ALL: PRD, proposal (+PDF), README, diagram, research notes, SDG notes, HANDOFF.

## Environment gotchas
- Windows; Git Bash + PowerShell. Python 3.14 (`python3`). Only `pdftotext` from poppler (no pdftoppm) → read PDFs as text; render HTML via headless Chrome screenshots.
- Some .md files CRLF → normalise line endings in scripted replacements or matches fail.
- No commit/push unless asked.
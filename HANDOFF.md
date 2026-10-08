# Tezera handoff

Where the work stands, what was decided, and what comes next. **Update this file at the end of every session or section of work** (see `CLAUDE.md` for the steps).

**Last updated:** 8 October 2026, Claude Code session on Windows (git user Damian De Cruz)

## Current state

| Document | Status |
| --- | --- |
| `prd/tezera-prd.html` | PRD version 3: renamed to Tezera, plus a section 1 callout and change-log entry pointing to the survey results. Requirements unchanged since v2. Has the shared document navbar (PRD, Architecture, Survey analysis, User stories) |
| `research/tezera-survey-analysis.html` | New. Analysis of the three discovery surveys (26 attendees, 7 organisers, 13 vendors and freelancers; 4–8 Oct 2026), the PRD's section 1 hypotheses checked, and 12 proposed PRD changes (R1–R12) |
| `research/tezera-user-stories.html` | Version 2. 48 user stories (17 consumer, 14 organiser, 13 provider, 4 admin), each a title plus Given / When / Then scenarios (the "As a… I want… so that…" line was dropped), with PRD links and survey evidence; 16 depend on R1–R12. Filter by role, priority and "PRD change" |
| `prd/tezera-architecture.html` | Redrawn from `.archify/architecture-tezera-sse-20261008-132233/candidate.json`: consumers on the web portal, web portal to Cloudinary CDN, SSE instead of Socket.IO, Dialog e-SMS for OTP and urgent alerts, and two cards with the reasons for each platform and its alternatives. Archify `finalize` passed all four gates; screenshot reviewed. Shared navbar injected by `.archify/inject-nav.py`, which must be re-run after every regeneration |
| `Tezera Proposal.pdf` + `proposal/tezera-proposal.html` | Renamed; acronym and tagline removed; PDF regenerated on the Mac, 8 pages |
| `README.md`, `PRD Research.md`, `SDG Alignment.md`, `CLAUDE.md` | Renamed throughout; README lists the research docs; CLAUDE.md has a macOS PDF command |

**Committed and pushed** on branch `docs/tezera-research-stack`; PR #2 (https://github.com/NDR-debugs/ATP/pull/2) is open into `main`. The raw survey CSVs are not in the repo because they contain respondents' email addresses.

## Decisions

| Date | Decision | Made by |
| --- | --- | --- |
| 8 Oct 2026 | Product name: **Tezera**. Written "tezera" as a wordmark (logo, h1, diagram title), "Tezera" in prose. No acronym, no tagline | User (this session) |
| 8 Oct 2026 | Stack: SSE instead of WebSockets everywhere (sending stays REST); Dialog e-SMS for OTP and urgent alerts (event cancelled or moved, booking cancelled), replacing Notify.lk; consumers get the web portal with full app parity; web portal loads media from the Cloudinary CDN | User (this session) |
| 8 Oct 2026 | User stories are survey-led and mapped to PRD IDs, rather than a full backlog of every PRD feature | User (this session) |
| 6 Oct 2026 | Product name REVAMP (superseded 8 Oct by Tezera) | Group (via Damian) |
| 6 Oct 2026 | Ticketing, QR entry, refunds and the payment gateway are out of the ATP release; ticketing is the first phase after it | Group (via Damian) |
| 6 Oct 2026 | Attendee reviews unlock from a 'Going' mark instead of a checked-in ticket | Group (via Damian) |
| 6 Oct 2026 | Add an optional 3D venue view with Three.js: VM-05/VM-06 Could, VM-07 Later | Group (via Damian) |
| 6 Oct 2026 | Recommended stack: TypeScript throughout, custom backend (NestJS + PostgreSQL), free-tier hosting. Team's main language is JS/TS | Damian chose the options; stack is Claude's recommendation |
| 6 Oct 2026 | PRD kept as editable HTML in `prd/`; architecture diagram kept next to it | Damian |

## Needs the group's review

- **Given / When / Then scenarios (8 Oct):** written from the old acceptance criteria. A few add small details the criteria did not state: a file over the size limit is rejected with a message (US-P02), admin decisions are logged with name and time (US-A01), a declined quote notifies the provider (US-P06), applications close at the deadline (US-P08), and unchosen providers are told when the job post closes (US-O06). Check these, and the example values (dates, districts, band name), are acceptable.
- **Survey recommendations R1–R12** (analysis section 7). Biggest: structured briefs (R1) and payment and cancellation terms on bookings (R2), both extending Musts; payment tracking without payments (R3, new HR-15); late cancellations on the record (R4); "Know before you go" (R5); live event status (R6). If accepted, edit the PRD rows, tag them v4, and drop the "PRD change" tags in the user stories.
- **Stack changes (8 Oct):** PRD section 8, MS-07, Platforms and the SMS dependency are tagged v3. Dialog e-SMS needs a Dialog Enterprise account and sender ID; its API docs are thin (only community clients found), so test it early.
- **Survey method:** the analysis assumes responses came from the team's own networks. Confirm how the forms were shared.
- **From 6 Oct, still open:** AC-08 verification gate, EV-01 external ticket link, 'Going' before start for reviews, and the new section 14 questions.

## Next steps

1. Group reviews the survey analysis and decides on R1–R12; update the PRD (v4) and the user stories to match.
2. Review and merge PR #2, then PR #3 (Given/When/Then stories, shared navbar).
3. Follow-up research (analysis section 9): interview 2–3 organisers, test R1–R4 with providers, reach beyond Colombo and students.
4. Confirm the recommended stack against the team's skills (PRD section 8).

## Gotchas

- `prd/tezera-architecture.html` is generated. Edit `.archify/architecture-tezera-sse-20261008-132233/candidate.json` and rebuild with archify `finalize` (see `CLAUDE.md`). Older `.archify` folders are history.
- The proposal PDF is generated from its HTML with headless Chrome (Windows and macOS commands in `CLAUDE.md`).
- `CLAUDE.md` is compressed with `/caveman-compress`. The readable backup on the Windows machine predates the rename; re-run the compressor there after editing.
- The research docs were generated once from the CSVs by a script that was not kept; edit the HTML by hand. Each chart bar is `<li style="--v:COUNT">` inside `<ol class="bars" style="--n:TOTAL">`.

## Session log

### 8 October 2026: Given / When / Then stories, shared navbar
- `research/tezera-user-stories.html` (v2): replaced each story's "As a… I want… so that…" line and acceptance-criteria checklist with named Given / When / Then scenarios (stacked lines, new `.gwt` styles); updated the intro and "How to read a story". "(proposed)" markers kept.
- Added the shared navbar (wordmark + PRD, Architecture, Survey analysis, User stories) to `prd/tezera-prd.html` (hidden in print), and an Architecture link to both research docs.
- New `.archify/inject-nav.py` adds the same navbar to the generated `prd/tezera-architecture.html` (idempotent; hidden in embed, present and print modes). `CLAUDE.md` and `README.md` updated.
- Decisions (user, via Damian): drop the story sentence, stacked Given/When/Then layout, link + inject nav into the architecture page.
- Committed on `docs/gwt-stories-navbar` and opened PR #3 (https://github.com/NDR-debugs/ATP/pull/3).
- Checked by headless Chrome screenshots at desktop, tablet and phone widths. Not verified: the architecture page already scrolled sideways on phones before this change; the navbar pills follow that.

### 8 October 2026: rename to Tezera, survey analysis, user stories
- Renamed REVAMP to Tezera across the repo: `git mv` of the PRD, architecture, proposal HTML and PDF; acronym and tagline removed everywhere; PRD bumped to v3 with a change log and settled name question.
- Regenerated `Tezera Proposal.pdf` on macOS (8 pages, cover screenshot checked).
- Wrote `research/tezera-survey-analysis.html` from the three Google Forms CSVs (charts as static HTML, light and dark themes, palette checked with the dataviz validator) and `research/tezera-user-stories.html`.
- Edited both research docs for clarity with `/no-ai-slop`; fixed one overstated claim ("several" attendees caught by fake sellers was really one).
- Decisions (user): name casing, no tagline, whole-repo rename, survey-led stories.
- Regenerated the architecture diagram from the renamed `candidate.json` with archify `finalize` (all gates passed) and checked a screenshot.
- Stack change (user): SSE instead of WebSockets, Dialog e-SMS (OTP + urgent alerts) instead of Notify.lk, consumers on the web portal, web portal linked to the Cloudinary CDN. Redrew the diagram in a new archify folder with platform reasons and alternatives as cards under the legend; one placement repair cut route crossings from 4 to 2. Updated PRD (section 7 Platforms, MS-07, section 8, SMS dependency; v3 tags and change log) and `CLAUDE.md`.
- Committed on `docs/tezera-research-stack` and opened PR #2.
- Not verified: free-tier limits and platform claims in the diagram cards are from general knowledge, not checked online; Dialog e-SMS was checked only through its product page and community API clients.
- Not verified: free-text theme counts are hand-coded; Google Fonts load only online.

### 6 October 2026: architecture, PRD v2, rename to REVAMP
- Built the architecture diagram (Archify): React Native + Expo, Next.js, NestJS, PostgreSQL, Redis/BullMQ, Cloudinary, push/email/SMS. Ticketing excluded.
- Renamed the product to REVAMP across every document; renamed the proposal files and regenerated the PDF.
- Answered: the PRD v1 didn't mention 3D maps (only a 2D layout with pins); added a 3D view plan with Three.js.
- Rewrote the PRD from the PDF as `prd/revamp-prd.html` (v2): ticketing to Later, 3D view, new section 8 Technical approach, redrawn diagrams, change log. Deleted `SDGP PRD.pdf`.
- Added the 3D viewer to the diagram; moved it to `prd/revamp-architecture.html`; deleted older diagram versions.
- Updated `README.md`, `PRD Research.md` and `SDG Alignment.md`; created `CLAUDE.md` and this file.
- Committed and pushed everything to the new branch `docs/revamp-prd-v2`.
- Compressed `CLAUDE.md` with `/caveman-compress`. Validation passed; the readable original is backed up outside the repo.
- Not verified: the PRD's Google Fonts only load online (falls back to Georgia and Segoe UI offline). The Three.js size estimate (~150 KB compressed) is from general knowledge, not measured.

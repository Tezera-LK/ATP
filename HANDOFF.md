# Tezera handoff

Where the work stands, what was decided, and what comes next. **Update this file at the end of every session or section of work** (see `CLAUDE.md` for the steps).

**Last updated:** 13 October 2026, Claude Code session on macOS (git user Samali Peiris), data design added to PRD section 8 (v4) and the architecture diagram

## Current state

| Document | Status |
| --- | --- |
| `prd/tezera-prd.html` | PRD version 4 (13 Oct): section 8 gains the data design (rank score, leaderboards, feed, trending, counters, search, database tools, upgrade paths), tagged v4. Version 3 renamed it to Tezera and pointed to the survey results. Requirements unchanged since v2. Has the shared document navbar (PRD, Architecture, Survey analysis, User stories) |
| `research/tezera-survey-analysis.html` | New. Analysis of the three discovery surveys (26 attendees, 7 organisers, 13 vendors and freelancers; 4–8 Oct 2026), the PRD's section 1 hypotheses checked, and 12 proposed PRD changes (R1–R12) |
| `research/tezera-user-stories.html` | Version 2. 48 user stories (17 consumer, 14 organiser, 13 provider, 4 admin), each a title plus Given / When / Then scenarios (the "As a… I want… so that…" line was dropped), with PRD links and survey evidence; 16 depend on R1–R12. Filter by role, priority and "PRD change" |
| `prd/tezera-architecture.html` | Redrawn from `.archify/architecture-tezera-sse-20261008-132233/candidate.json`: consumers on the web portal, web portal to Cloudinary CDN, SSE instead of Socket.IO, Dialog e-SMS for OTP and urgent alerts, and two cards with the reasons for each platform and its alternatives. 13 Oct: Redis now "jobs, pub/sub, rankings", PostgreSQL "Prisma + raw SQL", API-to-Redis and worker-to-database labels updated, and a new "Data design: ranking and feed (PRD v4)" card. Archify `finalize` passed all four gates; screenshot reviewed. Shared navbar injected by `.archify/inject-nav.py`, which must be re-run after every regeneration |
| `brand/tezera-brand-manual.html` | New. Brand manual v1.1, brought in from the team's "TESSERA Brand Manual" and renamed to Tezera. Attendee and vendor palettes swapped (attendee = coral/pink/yellow; vendor = sage/slate, the inverse of the organiser palette), personality words swapped with them, copy edited. Calmed down on 8 Oct: rotated/scattered tile grids, tile hover, attendee jiggle and the motion section's demo frames removed; the three accounts now differ by colour only; section 09 phones animate in on scroll. Linked from every doc's navbar |
| `Tezera Proposal.pdf` + `proposal/tezera-proposal.html` | Renamed; acronym and tagline removed; PDF regenerated on the Mac, 8 pages |
| `README.md`, `PRD Research.md`, `SDG Alignment.md`, `CLAUDE.md` | Renamed throughout; README lists the research docs; CLAUDE.md has a macOS PDF command |

**Committed and pushed** on branch `docs/tezera-research-stack`; PR #2 (https://github.com/NDR-debugs/ATP/pull/2) is open into `main`. The raw survey CSVs are not in the repo because they contain respondents' email addresses.

## Decisions

| Date | Decision | Made by |
| --- | --- | --- |
| 13 Oct 2026 | Data design in PRD section 8: PostgreSQL stays the only database (rank score column, materialized-view leaderboards, feed built on read with keyset pagination, text search + `pg_trgm`); Prisma for schema, raw SQL for ranking queries; Redis sorted sets for leaderboards and trending, Redis counters for likes and views; DBeaver for inspection only, never schema changes | User asked for it in the PRD; the design is Claude's recommendation |
| 8 Oct 2026 | Product name: **Tezera**. Written "tezera" as a wordmark (logo, h1, diagram title), "Tezera" in prose. No acronym, no tagline | User (this session) |
| 8 Oct 2026 | Brand manual is informational: no scattered/rotated tiles, no tile hover, no idle motion. Cover load-in, corner tile clusters and cover blobs stay. The three accounts differ by palette only. Phones in section 09 animate in on scroll (pieces drift up and settle, once) | User (this session) |
| 8 Oct 2026 | Brand: attendee takes the old vendor palette (light and dark, unchanged); vendor takes #050316 / #e9e7e2 / #70a992 / #658095 / #b6c3a7, the organiser palette inverted on purpose; the personality words move with the colours (vendor fresh and loose, attendee energetic and moving) | User (this session) |
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
- **Survey recommendations R1–R12** (analysis section 7). Biggest: structured briefs (R1) and payment and cancellation terms on bookings (R2), both extending Musts; payment tracking without payments (R3, new HR-15); late cancellations on the record (R4); "Know before you go" (R5); live event status (R6). If accepted, edit the PRD rows, tag them v5 (v4 is the data design), and drop the "PRD change" tags in the user stories.
- **Stack changes (8 Oct):** PRD section 8, MS-07, Platforms and the SMS dependency are tagged v3. Dialog e-SMS needs a Dialog Enterprise account and sender ID; its API docs are thin (only community clients found), so test it early.
- **Data design (13 Oct, PRD section 8, v4):** confirm the approach, and tune the trending score `(likes + 2·comments + 3·shares) / (age in hours + 2)^1.5` (proposed; added to the section 14 rank-weights question).
- **Survey method:** the analysis assumes responses came from the team's own networks. Confirm how the forms were shared.
- **Brand manual (8 Oct):** vendor dark mode is derived and marked (proposed): #dcdbe4 / #1d1b16 / #5a9179 / #7d97ab / #4b583c. Confirm or replace. "Tezera comes from tessera" is now in the name section; check that's the story the team wants. The tile-system section lost its Layer and Crop samples (they were rotated); its copy now names repeat, connect and crop only, so check the team is fine dropping 'layer' as a move. Button text on the vendor primary (#e9e7e2 on #70a992) is 2.2:1 contrast, below the 4.5:1 for normal text; the old attendee primary was worse (1.6:1). The logo is still a placeholder.
- **From 6 Oct, still open:** AC-08 verification gate, EV-01 external ticket link, 'Going' before start for reviews, and the new section 14 questions.

## Next steps

1. Group reviews the survey analysis and decides on R1–R12; update the PRD (v4) and the user stories to match.
2. Review and merge PR #2, then PR #3 (Given/When/Then stories, shared navbar).
3. Follow-up research (analysis section 9): interview 2–3 organisers, test R1–R4 with providers, reach beyond Colombo and students.
4. Confirm the recommended stack and the v4 data design against the team's skills (PRD section 8).

## Gotchas

- `prd/tezera-architecture.html` is generated. Edit `.archify/architecture-tezera-sse-20261008-132233/candidate.json` and rebuild with archify `finalize` (see `CLAUDE.md`). Older `.archify` folders are history.
- The proposal PDF is generated from its HTML with headless Chrome (Windows and macOS commands in `CLAUDE.md`).
- `CLAUDE.md` is compressed with `/caveman-compress`. The readable backup on the Windows machine predates the rename; re-run the compressor there after editing.
- The research docs were generated once from the CSVs by a script that was not kept; edit the HTML by hand. Each chart bar is `<li style="--v:COUNT">` inside `<ol class="bars" style="--n:TOTAL">`.

## Session log

### 13 October 2026: data design in PRD section 8
- Answered which database to use for the rank score and the promotion feed: PostgreSQL (already chosen); DBeaver is a client, not a database.
- `prd/tezera-prd.html` (v4): byline and new "What changed in version 4" box; section 8 Database row (Prisma for schema, raw SQL for ranking queries, why not MongoDB, Neon branches, Drizzle as alternative) and Background jobs row (now "and cache": Redis sorted sets, counters, Redis is cache only) rewritten; new Database tools row (DBeaver, Prisma Studio, dbdiagram.io); new "Ranking, the feed and search" and "Upgrade paths" subsections; section 14 rank-weights question now includes the trending weights. All tagged v4.
- Decision: user asked for these points in section 8; the design is Claude's recommendation for the group to confirm.
- Checked section 8 with a headless Chrome screenshot. Not verified: Upstash and Neon free-tier limits (worded without numbers); trending formula weights are a starting point (proposed). Proposal does not cover the database, so no README difference to record.
- Architecture diagram: edited `.archify/architecture-tezera-sse-20261008-132233/candidate.json` (Redis and PostgreSQL sublabels, `api-redis` and `worker-db` labels, Reviews and ranking item in API modules, new data design card; no positions moved). Archify `finalize` passed all gates (evidence in `review-v4/`); copied to `prd/tezera-architecture.html` and re-ran `inject-nav.py`. Screenshot checked. The 2 route crossings flagged by finalize are the same as in the 8 Oct layout.

### 8 October 2026: brand manual calmed down
- `brand/tezera-brand-manual.html`: removed every rotated or scattered tile grid (section 03 vendor and attendee swatches now use the same ordered grid as the organiser; section 07 Layer, Crop and Scattered samples; the attendee phone's hero; one social post, replaced by a "Find the fit." tile; the poster's corner grid). Straightened the type section's corner cluster.
- Removed the attendee grid's idle bob, the hover-to-settle on tile grids, the "Hover any scattered grid" line, the motion storyboard and the live loop frame, plus their CSS and JS. Navbar link hover kept.
- Section 03 copy and tags now say the accounts differ by palette only (Calm/Dependable, Fresh/Collaborative, Warm/Social). Section 08 motion copy drops "rotate" and points to the phones.
- New: section 09 phones animate in when 35% visible. Each piece drifts up 14 px and fades in (700 ms ease-in-out, 150 ms apart), the organiser progress bar fills to 68%, and it plays once. Skipped with reduced motion; without JavaScript the screens show complete.
- Decisions (user): the four points in the Decisions table row for this date; kept corner clusters, cover blobs and cover load-in.
- Checked with headless Chrome: section 03, colour, type, icons, tile system, motion, phones (hidden before scroll and settled after), social and applications. Not verified: the scroll animation's feel in a real browser, and phone width.

### 8 October 2026: brand manual
- New `brand/tezera-brand-manual.html` from the team's "TESSERA Brand Manual" (Downloads). Renamed to Tezera (wordmark "tezera", email hello@tezera.lk), version 1.1, cover subtitle tagline dropped.
- Colours: attendee takes the old vendor palette; vendor takes the user's new values (organiser inverted, per the user); vendor dark derived (proposed). Hardcoded colours on the cover blobs, the section 09 number, the social tile and the Do box follow the swap. Personality cards, tags and the three-experiences sentence swapped to match.
- Animations: hover-to-settle was blocked on the corner grids by full-width headings (now shrink-wrapped) and fired on touch taps (now gated to mouse); added reduced-motion handling for the tiles; the motion section's four frames all animated together, so its labels were wrong half the time. They are now a still storyboard beside a live frame that runs the stated 900 ms ease-in-out per tile, one tile after another. Offsets are now percentages so frames scale.
- Additions: cover tiles fade in as a diagonal wave on load; the attendee grid idles with a 2 px bob ("never quite sits still"); scattered tiles settle in a staggered order and spring back faster than they settle.
- Copy edited with `/no-ai-slop` (essence, name, the quote line, three-experiences sentence, vague Do items). "Ticket sales" sample became "People going" because ticketing is out of the ATP.
- Removed the logo box's "Final approved logo…" sentence (user).
- Added a Brand manual link to the navbar of the PRD, both research docs and (via `.archify/inject-nav.py`) the architecture page. README and CLAUDE.md updated.
- Checked with headless Chrome: screenshots of cover, essence, three experiences, colour and motion; a hover-reach probe (all scattered grids reachable) and keyframe sampling of the live frame. Not verified: true 390 px phone width (headless Chrome stops at 504 px; no overflow there), and hover feel in a real browser.

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

# Tezera handoff

Where the work stands, what was decided, and what comes next. **Update this file at the end of every session or section of work** (see `CLAUDE.md` for the steps).

**Last updated:** 15 October 2026, Claude Code session on Windows (git user Damian De Cruz), survey recommendations R1–R12 decided and written into every doc (PRD v5), 3D view replaced by an interactive 2D map

## Current state

| Document | Status |
| --- | --- |
| `prd/tezera-prd.html` | PRD version 5 (15 Oct): all twelve survey recommendations accepted (new HR-15, HR-16, EV-08 to EV-10, RV-08 to RV-10, VM-15; HR-03/04/05/08, EV-04, VM-02 extended); AC-01 minimum age 16 (proposed); 3D view removed (VM-05 to VM-07 deleted, IDs not reused); new interactive 2D map VM-08 to VM-14; section 8 '3D venue view' replaced by 'The interactive venue map'; section 14 age, 3D and map-extras questions settled, Google Maps directions and a later-phase sponsors question added. All tagged v5. Version 4 (13 Oct) added the data design to section 8 |
| `research/tezera-survey-analysis.html` | Analysis of the three discovery surveys (26 attendees, 7 organisers, 13 vendors and freelancers; 4–8 Oct 2026), the PRD's section 1 hypotheses checked, and 12 PRD changes (R1–R12). Section 7 table has a new 'Decision (15 Oct)' column: all accepted |
| `research/tezera-user-stories.html` | Version 3 (15 Oct), PRD v5. 53 user stories (20 consumer, 15 organiser, 14 provider, 4 admin), each a title plus Given / When / Then scenarios, with PRD links and survey evidence. 'PRD change' tags and filter removed. New: US-C18 find a stall and what it sells, US-C19 stage line-ups and stall-type filter, US-C20 age rating, US-O15 draw zones and place stalls, US-P14 list what my stall sells |
| `research/tezera-personas.html` | 8 personas from the survey segments (Tharushi, Kavindu, Ashan, Dilini, Nuwan, Fathima, Pradeep, Sanduni), with evidence, quotes, goals, frustrations and linked stories; invented details marked (assumed). 15 Oct: new story chips and matrix rows for the 5 new stories; 'pending' wording now says accepted |
| `research/tezera-work-items.html` + `research/tezera-work-items-jira.csv` | 14 epics › 87 stories › 392 tasks, 998 story points (proposed; was 850). Stories: 53 from user stories, 17 PRD gaps (PG-11 3D removed), 17 enabling. All R1–R12 work moved into the backlog (90 pts; R8 without the web service worker); 'Waiting on a group decision' replaced by an 'accepted' table. EP-07 Venue maps holds the interactive map stories. CSV re-exported: 493 rows + header, every Parent resolves |
| `prd/tezera-architecture.html` | Generated from `.archify/architecture-tezera-sse-20261008-132233/candidate.json`. 15 Oct: 3D venue viewer node and its two edges removed; '3D venue view' card replaced by 'Interactive 2D venue map'; maps module label and the out-of-scope card updated. Archify `finalize` passed all four gates; navbar re-injected with `.archify/inject-nav.py`. Earlier: SSE, Dialog e-SMS, Cloudinary CDN, platform cards (8 Oct); data design card (13 Oct) |
| `brand/tezera-brand-manual.html` | New. Brand manual v1.1, brought in from the team's "TESSERA Brand Manual" and renamed to Tezera. Attendee and vendor palettes swapped (attendee = coral/pink/yellow; vendor = sage/slate, the inverse of the organiser palette), personality words swapped with them, copy edited. Calmed down on 8 Oct: rotated/scattered tile grids, tile hover, attendee jiggle and the motion section's demo frames removed; the three accounts now differ by colour only; section 09 phones animate in on scroll. Linked from every doc's navbar |
| `Tezera Proposal.pdf` + `proposal/tezera-proposal.html` | 15 Oct: page 4 modules mention live status, 'know before you go', sharing, structured briefs and the interactive map; page 5 hiring text adds payment and cancellation terms, stall steps use zones and search; page 8 'venue map extras' became 'Google Maps directions to venues'. The proposal never mentioned 3D. PDF regenerated on Windows, 8 pages |
| `README.md`, `PRD Research.md`, `SDG Alignment.md`, `CLAUDE.md` | README: PRD v5, 3D references replaced, 'How the proposal and the PRD differ' updated, and the 6 Oct rename now says Eventline → REVAMP (it wrongly said Tezera). `PRD Research.md`: 'Added in PRD version 5' notes. `CLAUDE.md`: locked decisions now say no 3D, interactive map, R1–R12 accepted, minimum age; work-items rule updated. SDG notes needed no change. All 7 HTML docs share the navbar |

**On `main`:** PRs #2, #3 and #4 are merged. Claude does not commit or push (15 Oct decision); the team does all git work, so expect uncommitted changes after a Claude session. The raw survey CSVs are not in the repo because they contain respondents' email addresses.

## Decisions

| Date | Decision | Made by |
| --- | --- | --- |
| 15 Oct 2026 | All twelve survey recommendations accepted: R1 brief (Must, optional fields), R2 terms (Must), R3 payment tracking with public on-time share (Should), R4 late cancellations, 7 days proposed (Should), R5 'know before you go' (Should), R6 live status (Should), R7 more pins (Must), R8 offline map, mobile only (Could), R9 sharing (Must), R10 review tags and replies (Could), R11 facilities rating (Could), R12 age rating with ID checked at the gate (Should). Accounts 16+ (proposed) with a parent or guardian tick under 18. Sponsors added as a later-phase open question | Damian (this session) |
| 15 Oct 2026 | 3D venue view removed from every doc (supersedes 6 Oct). Interactive 2D map instead: zones drawn as boxes, tap a zone for its stalls, stall details (vendor, photo, number, description, items and prices per event or profile prices), vendor edits and organiser can hide, search by item, 'Find on map' (all Must); stage line-ups and stall-type filter (Should) | Damian (this session) |
| 15 Oct 2026 | Personas split by survey segment (8, with a primary per role); work items as Epic › Story › Task covering the user stories, PRD gaps and setup work; story points (Fibonacci, proposed) without sprints; work that depends on R1–R12 left out of the backlog until the group decides; HTML in `research/` plus a Jira CSV | Damian (this session) |
| 15 Oct 2026 | Claude never commits or pushes (no commits, pushes, branches or PRs); the team handles all git. Rule is in `CLAUDE.md` | Damian |
| 13 Oct 2026 | Data design in PRD section 8: PostgreSQL stays the only database (rank score column, materialized-view leaderboards, feed built on read with keyset pagination, text search + `pg_trgm`); Prisma for schema, raw SQL for ranking queries; Redis sorted sets for leaderboards and trending, Redis counters for likes and views; DBeaver for inspection only, never schema changes | User asked for it in the PRD; the design is Claude's recommendation |
| 8 Oct 2026 | Product name: **Tezera**. Written "tezera" as a wordmark (logo, h1, diagram title), "Tezera" in prose. No acronym, no tagline | User (this session) |
| 8 Oct 2026 | Brand manual is informational: no scattered/rotated tiles, no tile hover, no idle motion. Cover load-in, corner tile clusters and cover blobs stay. The three accounts differ by palette only. Phones in section 09 animate in on scroll (pieces drift up and settle, once) | User (this session) |
| 8 Oct 2026 | Brand: attendee takes the old vendor palette (light and dark, unchanged); vendor takes #050316 / #e9e7e2 / #70a992 / #658095 / #b6c3a7, the organiser palette inverted on purpose; the personality words move with the colours (vendor fresh and loose, attendee energetic and moving) | User (this session) |
| 8 Oct 2026 | Stack: SSE instead of WebSockets everywhere (sending stays REST); Dialog e-SMS for OTP and urgent alerts (event cancelled or moved, booking cancelled), replacing Notify.lk; consumers get the web portal with full app parity; web portal loads media from the Cloudinary CDN | User (this session) |
| 8 Oct 2026 | User stories are survey-led and mapped to PRD IDs, rather than a full backlog of every PRD feature | User (this session) |
| 6 Oct 2026 | Product name REVAMP (superseded 8 Oct by Tezera) | Group (via Damian) |
| 6 Oct 2026 | Ticketing, QR entry, refunds and the payment gateway are out of the ATP release; ticketing is the first phase after it | Group (via Damian) |
| 6 Oct 2026 | Attendee reviews unlock from a 'Going' mark instead of a checked-in ticket | Group (via Damian) |
| 6 Oct 2026 | Add an optional 3D venue view with Three.js: VM-05/VM-06 Could, VM-07 Later (superseded 15 Oct: removed) | Group (via Damian) |
| 6 Oct 2026 | Recommended stack: TypeScript throughout, custom backend (NestJS + PostgreSQL), free-tier hosting. Team's main language is JS/TS | Damian chose the options; stack is Claude's recommendation |
| 6 Oct 2026 | PRD kept as editable HTML in `prd/`; architecture diagram kept next to it | Damian |

## Needs the group's review

- **Given / When / Then scenarios (8 Oct):** written from the old acceptance criteria. A few add small details the criteria did not state: a file over the size limit is rejected with a message (US-P02), admin decisions are logged with name and time (US-A01), a declined quote notifies the provider (US-P06), applications close at the deadline (US-P08), and unchosen providers are told when the job post closes (US-O06). Check these, and the example values (dates, districts, band name), are acceptable.
- **PRD v5 decisions (15 Oct):** made by Damian in this session; the rest of the group should confirm them, especially: the interactive map as all Must (US-C18 is 29 pts and may need splitting), the 7-day late-cancellation window, the public on-time payment share, and the minimum age of 16. Whether the PDPA needs a parent's consent for 16- and 17-year-olds, and in what form, was not checked.
- **Proposal page 8 vs the PRD:** page 8 lists 'Attendee reviews of events' as after the ATP, but the PRD has them in the ATP (unlocked by 'Going'; RV-10 adds a facilities rating). This predates today; the proposal agent flagged it and nothing was changed.
- **Work items split calls (15 Oct):** some R tasks sit in one story and serve another (counter-terms in US-O07 for US-P05; late cancellations in US-O08 for US-P10; on-time share in US-P07 for US-P04). Must stories US-O12, US-O14, US-P12 and US-C14 now contain Should or Could parts (EV-09, HR-15, RV-09, RV-10), which the CSV imports as Must. Each newly added story got a 1-pt test task (+6 pts).
- **Stack changes (8 Oct):** PRD section 8, MS-07, Platforms and the SMS dependency are tagged v3. Dialog e-SMS needs a Dialog Enterprise account and sender ID; its API docs are thin (only community clients found), so test it early.
- **Data design (13 Oct, PRD section 8, v4):** confirm the approach, and tune the trending score `(likes + 2·comments + 3·shares) / (age in hours + 2)^1.5` (proposed; added to the section 14 rank-weights question).
- **Survey method:** the analysis assumes responses came from the team's own networks. Confirm how the forms were shared.
- **Brand manual (8 Oct):** vendor dark mode is derived and marked (proposed): #dcdbe4 / #1d1b16 / #5a9179 / #7d97ab / #4b583c. Confirm or replace. "Tezera comes from tessera" is now in the name section; check that's the story the team wants. The tile-system section lost its Layer and Crop samples (they were rotated); its copy now names repeat, connect and crop only, so check the team is fine dropping 'layer' as a move. Button text on the vendor primary (#e9e7e2 on #70a992) is 2.2:1 contrast, below the 4.5:1 for normal text; the old attendee primary was worse (1.6:1). The logo is still a placeholder.
- **Personas (15 Oct):** names, ages and some places are invented and marked (assumed). Fathima (food stall vendor) rests on thin evidence (2 caterers) and Sanduni (admin) on the PRD only; check both in the follow-up interviews. Confirm the primary personas (Tharushi, Ashan, Nuwan).
- **Work items (15 Oct):** every story point is proposed; re-estimate in planning. The 17 PG- stories have 'done when' checks, not Given / When / Then scenarios yet. Organisers can edit maps on mobile (5 pts). Jira column mapping follows Atlassian's current CSV guide but hasn't been tried in the team's Jira.
- **From 6 Oct, still open:** AC-08 verification gate, EV-01 external ticket link, 'Going' before start for reviews, and the new section 14 questions.

## Next steps

1. Group confirms the PRD v5 decisions (survey changes, interactive map, minimum age) and the open questions left in section 14 (Google Maps directions, sponsors).
2. Review the personas and the work items; re-estimate (consider splitting US-C18), then import `research/tezera-work-items-jira.csv` into Jira (needs Jira admin) and plan the first sprint around EP-00 and the first thin slice (publish and find an event).
3. Write Given / When / Then scenarios for the 17 PG- stories and add them to the user stories doc.
4. Follow-up research (survey analysis section 9): interview 2–3 organisers, test R1–R4 with providers (mock booking request with brief and terms), test the interactive map with attendees, reach beyond Colombo and students.
5. Check the PDPA on consent for under-18s; fix proposal page 8's 'Attendee reviews of events' line if the group agrees.
6. Confirm the recommended stack and the v4 data design against the team's skills (PRD section 8).

## Gotchas

- `prd/tezera-architecture.html` is generated. Edit `.archify/architecture-tezera-sse-20261008-132233/candidate.json` and rebuild with archify `finalize` (see `CLAUDE.md`). Older `.archify` folders are history.
- The proposal PDF is generated from its HTML with headless Chrome (Windows and macOS commands in `CLAUDE.md`).
- `CLAUDE.md` is compressed with `/caveman-compress`. The readable backup on the Windows machine predates the rename; re-run the compressor there after editing.
- Commit 711ba65's message says the diagram moved to Flutter, but nothing did: `candidate.json`, the architecture page and the PRD all still say React Native + Expo (checked 15 Oct). The work items assume React Native + Expo.
- The work items page is the source for the Jira CSV. After editing it, re-export with the button (or the headless Chrome command in `CLAUDE.md`) and replace the snapshot.
- The research docs were generated once from the CSVs by a script that was not kept; edit the HTML by hand. Each chart bar is `<li style="--v:COUNT">` inside `<ol class="bars" style="--n:TOTAL">`.

## Session log

### 15 October 2026: survey recommendations decided, PRD v5, interactive map
- Asked Damian about each of R1–R12 (four rounds of questions) and about the venue map; all twelve accepted, mostly as proposed (R8 mobile only). Damian also removed the 3D view and asked for an interactive 2D map, then chose its details. Decisions are in the table above.
- `prd/tezera-prd.html` → v5 (rows, section 8 map subsection, section 9, NFRs, dependencies, risks, section 14, change box). `research/tezera-survey-analysis.html`: Decision column. `README.md`, `PRD Research.md`, `CLAUDE.md`, this file.
- Helper agents (spec in the session scratchpad): proposal + PDF (8 pages, checked); architecture `candidate.json` + finalize (all gates passed, screenshot checked) + `prd/tezera-architecture.html` + `inject-nav.py`; user stories (53), work items (87 stories, 392 tasks, 998 pts), Jira CSV (493 rows, parents resolve) and personas (chips and matrix match, checked by script).
- Checked: PRD tag balance and a header screenshot; no '3D' left anywhere except PRD change-log history and settled questions (other hits are `#3D5459` colours). Not verified: PDPA wording on minors; all story points; the architecture page in dark theme and at phone width; the PRD's new map rows in a screenshot (headless Chrome did not scroll to the anchor). Committed on branch `docs/prd-v5-survey-decisions` at Damian's request (not pushed).

### 15 October 2026: user personas and work items
- New `research/tezera-personas.html`: 8 survey-segment personas with evidence, quotes, goals, frustrations, implications, linked stories, 'not designing for' and a persona × story matrix.
- New `research/tezera-work-items.html`: 14 epics, 78 stories (43 user stories, 18 PRD gaps, 17 enabling), 322 tasks, 850 pts (proposed); R1–R12 work sized separately (91 pts, not counted); PRD coverage table; filters; 'Download Jira CSV'. New `research/tezera-work-items-jira.csv` exported from the page (414 rows; Issue ID + Parent; epics, then stories, then sub-tasks; Must→High, Should→Medium, Could→Low, Later→Lowest).
- Story titles, priorities and scenario names are read from the user stories page, so they match it. The 5 stories that depend entirely on R-changes (US-C04, US-C07, US-C12, US-O03, US-P07) are only in 'Waiting on a group decision'; US-C16 and US-C17 (Later) have no tasks.
- Navbar: Personas and Work items added to the PRD, survey analysis, user stories, brand manual and `.archify/inject-nav.py` (re-run; architecture page updated). README and `CLAUDE.md` updated.
- Decisions by Damian, through questions at the start: persona split, hierarchy, scope, format, Jira, points without sprints, R1–R12 excluded.
- Checked: generator asserts (every PRD Must/Should/Could covered, dependencies resolve, every user story has a persona), CSV parent links and order, screenshots of both pages, no sideways scroll at 375px. Not verified: the Jira import itself; story points; persona details marked (assumed). Corrected last session's note: the diagram does not show Flutter. Nothing committed.

### 15 October 2026: no commits or pushes by Claude
- `CLAUDE.md`: environment rule changed from "no commit/push unless asked" to "never commit or push; the user does all git".
- `HANDOFF.md`: decision row added; current state now says PRs #2–#4 are merged into `main`; stale "merge PR #2/#3" next step replaced with the React Native vs Flutter question raised by commit 711ba65.
- Decision by Damian. Nothing committed. (The Flutter question was checked later the same day: nothing in the diagram changed to Flutter.)

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

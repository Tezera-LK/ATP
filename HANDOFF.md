# REVAMP handoff

Where the work stands, what was decided, and what comes next. **Update this file at the end of every session or section of work** (see `CLAUDE.md` for the steps).

**Last updated:** 6 October 2026, Claude Code session with Damian De Cruz

## Current state

| Document | Status |
| --- | --- |
| `prd/revamp-prd.html` | PRD version 2. Up to date with every decision below. Replaces `SDGP PRD.pdf`, which is deleted |
| `prd/revamp-architecture.html` | Architecture diagram, including the 3D venue viewer. Passed Archify's automated checks; screenshots reviewed |
| `REVAMP Proposal.pdf` + `proposal/revamp-proposal.html` | Renamed from Eventline. PDF regenerated from the HTML (8 pages) |
| `README.md` | Up to date: new file names, document list, roadmap |
| `PRD Research.md` | Updated: name, PRD v2 section numbers, a list of what v2 added that isn't from research |
| `SDG Alignment.md` | Updated: name only |
| `CLAUDE.md`, `HANDOFF.md` | New |

**Committed and pushed** on branch `docs/revamp-prd-v2` (not merged into `main` yet). `.gitignore` keeps Archify build output out of git; only the diagram source `candidate.json` is tracked.

## Decisions

| Date | Decision | Made by |
| --- | --- | --- |
| 6 Oct 2026 | Product name: **REVAMP** (Retail Engagement, Vendor Activation & Marketing Platform; core idea "Transform + Amplify") | Group (via Damian) |
| 6 Oct 2026 | Ticketing, QR entry, refunds and the payment gateway are out of the ATP release; ticketing is the first phase after it | Group (via Damian) |
| 6 Oct 2026 | Attendee reviews unlock from a 'Going' mark instead of a checked-in ticket | Group (via Damian) |
| 6 Oct 2026 | Add an optional 3D venue view with Three.js: VM-05/VM-06 Could, VM-07 Later | Group (via Damian) |
| 6 Oct 2026 | Recommended stack: TypeScript throughout, custom backend (NestJS + PostgreSQL), free-tier hosting. Team's main language is JS/TS | Damian chose the options; stack is Claude's recommendation |
| 6 Oct 2026 | PRD kept as editable HTML in `prd/`; architecture diagram kept next to it | Damian |

## Needs the group's review

Claude made these changes because moving ticketing out of the MVP required them. Nobody in the group has confirmed them yet:

- **AC-08:** organisers must be verified before opening stalls, posting jobs or sending booking requests (previously: before selling tickets).
- **EV-01:** the event page can link to external ticket sales until ticketing arrives (marked proposed).
- **Reviews:** only 'Going' marks made *before* the event starts count.
- **New open questions** in PRD section 14: can unverified organisers publish events; is 'Going' enough proof of attendance; is the 3D view built during the ATP or after it; does the group confirm the stack?

## Next steps

1. Merge `docs/revamp-prd-v2` into `main`: open a pull request at https://github.com/NDR-debugs/ATP/pull/new/docs/revamp-prd-v2, or merge directly.
2. Group reviews the PRD v2 items above and the open questions in section 14.
3. Confirm the recommended stack against the team's skills (PRD section 8).
4. Discovery phase: organiser interviews, and surveys of vendors, freelancers and consumers (PRD section 1).
5. Optional, offered but not decided: relabel "3D venue view (Could)" on the diagram as "optional, if time allows", and the viewer's "shared package" tag as "shared frontend package · runs on device".

## Gotchas

- `prd/revamp-architecture.html` is generated. Edit the JSON source in `.archify/` and rebuild (see `CLAUDE.md`).
- The proposal PDF is generated from its HTML with headless Chrome (command in `CLAUDE.md`).
- `CLAUDE.md` is compressed with `/caveman-compress` (Python 3.14 is installed). The readable original is at `%LOCALAPPDATA%\caveman-compress\backups\ATP\CLAUDE.original.md`. After editing `CLAUDE.md`, run the compressor again.

## Session log

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

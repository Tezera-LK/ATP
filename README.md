# tezera

A mobile app and web portal where Sri Lankan event organisers hire vendors and freelancers, and attendees find events and each other. Every finished job leaves a review the next organiser can read.

**Second-year Agile Team Project (SDGP)** · Project proposal, September 2026 (renamed from Eventline to REVAMP on 6 October 2026, then to Tezera on 8 October 2026)

## Documents

The code lives in a separate repository, [Tezera-LK/tezera](https://github.com/Tezera-LK/tezera) (pnpm + Turborepo monorepo: NestJS API, Next.js web portal, Cognito via Amplify Gen 2, AWS CDK). Its own README explains how to run it. These documents describe its `dev` branch, which is ahead of `main`.

| Document | What it is | Read it when |
| --- | --- | --- |
| [Tezera Proposal.pdf](Tezera%20Proposal.pdf) | The 8-page project proposal: the problem, who is involved, the four modules, key workflows, the competitor comparison, SDG alignment and the roadmap for the Agile Team Project (ATP) | You want the plan at a glance |
| [prd/tezera-prd.html](prd/tezera-prd.html) | The full product requirements document (version 7): roles, requirement tables with MoSCoW priorities, non-functional requirements, technical approach, business model, success metrics, risks and open questions. Edit this HTML file directly; print it to get a PDF | You need the detail behind a feature or decision |
| [prd/tezera-architecture.html](prd/tezera-architecture.html) | The system architecture diagram (interactive, works offline), with the reasons for each service and its alternatives | You want to see how the apps, backend and services fit together (PRD v7 stack) |
| [prd/tezera-use-cases.html](prd/tezera-use-cases.html) | All 20 use cases (UC-001 to UC-020) with the actor and use case diagrams and each step of every flow, linked to the PRD rows, functional requirements and user stories they share. Built from the SRS draft by `tools/build-use-cases.py` | You want to see what a user does step by step, or trace a use case to its requirements |
| [research/tezera-survey-analysis.html](research/tezera-survey-analysis.html) | Analysis of the discovery surveys of attendees, organisers, and vendors and freelancers (4–8 October 2026), with the twelve recommended PRD changes (R1–R12), all accepted on 15 October 2026 | You want to know what the market research found |
| [research/tezera-personas.html](research/tezera-personas.html) | Eight user personas (two consumers, two organisers, three vendors and freelancers, one admin) built from the survey segments, each with evidence, quotes and the user stories written for them | You are designing a flow and need to know who it is for |
| [research/tezera-user-stories.html](research/tezera-user-stories.html) | User stories for each role as Given / When / Then scenarios, drawn from the survey evidence and mapped to PRD requirement IDs | You are planning the backlog or a sprint |
| [research/tezera-work-items.html](research/tezera-work-items.html) | The backlog as epics, stories and tasks with proposed story points, PRD coverage, and a Jira CSV export ([snapshot](research/tezera-work-items-jira.csv)). Imported into Jira (space TES) on 22 Oct 2026; Jira is now the live backlog. Includes the work for the accepted survey changes and the interactive venue map. Since 23 Nov 2026, tasks the code already does on its `dev` branch carry a 'Built' or 'Partly built' marker | You are planning sprints or importing into Jira |
| [research/tezera-research-briefs.html](research/tezera-research-briefs.html) | Desk-research briefs with sources: whether in-app payments to vendors and freelancers are legal in Sri Lanka (Central Bank rules, gateways, tax, PDPA), and what the map builder takes from the team's ai-studio repository | You need the reasoning behind the payments model or the map builder |
| [brand/tezera-brand-manual.html](brand/tezera-brand-manual.html) | The brand manual: name story, the three account personalities, light and dark palettes for organiser, vendor and attendee, type, icons, the tile system, motion rules, voice and applications | You are designing a screen, a post or a poster |
| [mindmaps/](mindmaps/) | The [organiser](mindmaps/tezera-organiser-map.mm) and [vendor](mindmaps/tezera-vendor-map.mm) accounts as mind maps: every page, option and feature from PRD v6, with MoSCoW tags and PRD IDs. Import a `.mm` file into MindMeister, or paste its outline `.txt` into MindMeister's Outline mode | You want everything one account type can do on one page |
| [wireframes/tezera-organiser-wireframe.html](wireframes/tezera-organiser-wireframe.html) | **History since 23 Nov 2026:** the code's organiser portal follows the team's Figma file (screens O05–O103), not this wireframe (O01–O32). The organiser web portal as 32 desktop screens in the same layout as the team's consumer flow: a flow map of eight journeys, a click-through where highlighted areas are real links, and light and dark organiser palettes. Checked against the organiser mind map | You want to see or click through an organiser screen |
| [report/tezera-srs-chapter-4.md](report/tezera-srs-chapter-4.md) | Draft of report Chapter 4, the System Requirements Specification: stakeholders and onion model, elicitation methods and results, use case diagrams and all 20 use case descriptions, 67 functional and 21 non-functional requirements, assumptions and clarifications. Figures in `report/figures/` | You are writing or checking the SDGP report |
| [database/](database/) | Team plans for the database and sign-in: how to make a table (PostgreSQL or DynamoDB), a short table how-to, and the Cognito + NestJS + Prisma auth set-up, each with a PDF | You are adding a table or setting up sign-in in the code repo ([Tezera-LK/tezera](https://github.com/Tezera-LK/tezera)); each plan was checked against its `dev` branch on 23 November 2026 |
| [HANDOFF.md](HANDOFF.md) | Where the work stands, what was decided, and what comes next. Updated after every session | You're picking up the work |

Supporting files:

- [proposal/tezera-proposal.html](proposal/tezera-proposal.html) — the HTML source of the proposal. Print it from Chrome to regenerate the PDF.
- [PRD Research.md](PRD%20Research.md) — the research behind the PRD, the group's answers that shaped it, and 53 sources with how reliable each one is.
- [SDG Alignment.md](SDG%20Alignment.md) — the notes behind the proposal's SDG page.
- [CLAUDE.md](CLAUDE.md) — working rules for Claude Code in this repository.
- `.archify/architecture-tezera-v7-20261123-dev/candidate.json` — the editable source of the architecture diagram for PRD v7, checked against the code on `dev` (older `.archify` folders are history).
- `report/figures/build-figures.js` — builds the Chapter 4 onion model and use case diagrams as SVG.

## Docs site

The HTML documents work as one small website. `index.html` is the home page, and every page shares one navbar (Product, Research, Delivery, Brand). On phones the navbar becomes a "Docs" button. The site is static: no build step, no server code.

**Use cases page:** `prd/tezera-use-cases.html` is generated from the SRS draft (`report/tezera-srs-chapter-4.md`), the PRD and the user stories. After changing any of them, run `python tools/build-use-cases.py` (it also runs `build-site.py`).

**Change the navbar or add a document:** edit the `DOCS` list at the top of `tools/build-site.py`, then run `python tools/build-site.py`. The script writes the navbar into every page, links `assets/tezera-site.css` and `assets/tezera-site.js`, and regenerates `index.html`. The "Updated" dates on the home page come from git, so run it again after committing if you want fresh dates. Don't edit the navbar inside a page by hand: the next run replaces it.

**Light and dark:** the sun/moon button in the navbar switches the theme for the whole site. The choice is saved in the browser (`localStorage`); with no choice the site follows the device setting. The theme is applied before the page draws, so moving between pages never flashes the other theme. In Chrome, Edge and Safari pages fade into each other while the navbar stays still. Printing always uses the light theme. If you add colours to a page, use its colour variables (`--paper`, `--ink` and so on) so dark mode keeps working.

**Preview locally:** run `python -m http.server 8000` in the repo root and open http://localhost:8000. Opening the files directly also works.

**Publish on GitHub Pages:**

1. The repository `Tezera-LK/ATP` is private. On GitHub's free plan, Pages only works for public repositories, so either make the repository public or move the organisation to a paid plan (GitHub Team). Even from a private repository on GitHub Team, the published site is public. Only GitHub Enterprise Cloud can restrict it to members. (Plan rules checked from memory, not online.)
2. On GitHub, open the repository's **Settings › Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
3. After a minute or two the site is at `https://tezera-lk.github.io/ATP/`.

Every page carries `<meta name="robots" content="noindex, nofollow">`, so search engines should not list the site. Anyone with the link can still open it, so keep anything private (such as the survey CSVs with email addresses) out of the repository. The `.nojekyll` file tells GitHub Pages to serve the files as they are.

## The proposal, page by page

| Page | Topic | What it covers |
| --- | --- | --- |
| 1 | Cover | What Tezera is, who it is for, and the team |
| 2 | The problem | Running one event means juggling five separate channels: promoting, selling tickets, hiring, sharing the venue layout and updating attendees |
| 3 | Rich picture | Organisers, vendors, freelancers, attendees and admins: what passes between them and what each worries about |
| 4 | The solution | Four modules: events and promotion, hiring marketplace, community, and venue maps |
| 5 | Key workflows | Two routes to a hire (direct booking or job post), and how stalls are filled and pinned on the venue map |
| 6 | Why it's different | Sri Lankan and global platforms compared with Tezera on ticketing, hiring, reviews, community and venue maps |
| 7 | SDG alignment | SDG 8 (primary), SDG 9 (secondary) and SDG 10 (supporting), with how the impact will be measured |
| 8 | Roadmap | What is delivered during the ATP and what comes after it |

## The PRD, section by section

1. Problem and opportunity
2. Goals and non-goals
3. Users and roles
4. How the platform fits together
5. Competitive landscape
6. Functional requirements, in ten modules: accounts, events, ticketing (after the ATP), hiring, reviews, venue maps (an interactive 2D map with zones and stall listings, made in a map builder), community, messaging, organiser dashboard, administration
7. Non-functional requirements, including Sri Lanka's Personal Data Protection Act
8. Technical approach: the stack (Flutter app, Next.js portal, NestJS as one AWS Lambda, Cognito, PostgreSQL with DynamoDB for chat and the feed; matched to the code repo's `dev` branch on 23 November 2026), the data design across the two databases, how the interactive venue map and its builder are built, and how sandboxed payments work
9. MVP scope and priorities
10. Business model
11. Success metrics
12. Assumptions and dependencies
13. Risks and mitigations
14. Open questions

The PRD also lists what changed in each version (2 to 7) and ends with a Sources list.

## Roadmap

**During the ATP**

1. **Discovery:** interview event organisers, survey vendors, freelancers and attendees, and confirm the backlog.
2. **ATP release,** a mobile app and web portal with:
    - accounts and verification
    - events and promotion feed
    - hiring marketplace and stalls, with deposits, instalments and stall fees paid through a payment gateway's sandbox (PayHere test mode; no real money)
    - reviews and ranking
    - community and chat
    - interactive venue maps (zones, stalls and what they sell), made in a map builder that saves every map in one standard format
    - admin and moderation
    - Sinhala and Tamil, if time allows
3. **Live pilot:** one or two partner organisers and the vendors they already use run a real event through Tezera, producing the first reviews and SDG measures.

**Decision point:** after the pilot, the group decides whether to take Tezera further.

**Beyond the ATP**

1. **First — ticketing and entry:** ticket tiers and reserved seats, free RSVP events, QR tickets and gate scanning, refunds and cancellations, and attendee reviews of events.
2. **After that — real-money payments:** hiring and stall payments go live once the legal and tax questions are settled (PRD section 14), with ticket and hiring commission and Google Maps directions to venues.
3. **After that — hiring for private events:** weddings, birthdays and other private events.
4. **Later version — premium accounts:** VIP and fast-sale ticket access.

## How the proposal and the PRD differ

- **Private events:** both plan hiring for private events after the ATP, but whether to do it is still an open question in the PRD.
- **Survey changes:** the PRD (version 5) turns the twelve accepted survey recommendations into requirements, such as structured briefs, payment and cancellation terms on bookings, and live event status. The proposal stays at summary level.
- **Payments and the map builder (PRD version 6):** both documents now put sandboxed hiring and stall payments and the map builder in the ATP. Only the PRD has the detail: the requirement IDs (HR-14, HR-17 to HR-20, VM-16 to VM-22), the direct-to-provider model and why it was chosen, PayHere behind an interface, Bedrock for the AI draft, and the questions to settle before real money. Proposal page numbers are unchanged.
- **Technical approach:** only the PRD records the stack. Version 7 (20 November 2026) moved it to the team code repo's stack: Flutter, Next.js, NestJS on Lambda, Cognito, PostgreSQL and DynamoDB. On 23 November 2026 the PRD, the architecture diagram, the SRS draft, the work items and the database plans were checked against the code on the repo's `dev` branch (sign-in methods, deploy pipeline, routes, hosting), and the parts not built yet were marked "(planned, not built)". The proposal names no stack, so nothing changed there.
- **Wording:** the proposal calls consumers "attendees".

The name, ticketing, revenue, discovery and the pilot now match.

## Team

- Damian De Cruz
- Danella De Cruz
- Navindu Ranwatte
- Reshan Tennekoon
- Yevan Dewathanthriarachchi

## Repository contents

```
.
├── README.md
├── CLAUDE.md
├── HANDOFF.md
├── index.html                (docs site home page, generated by tools/build-site.py)
├── .nojekyll                 (GitHub Pages: serve files as they are)
├── assets/
│   ├── tezera-site.css       (shared navbar and screen fixes for every page)
│   └── tezera-site.js        (navbar menus, light or dark bar)
├── tools/
│   ├── build-site.py         (writes the navbar into every page and builds index.html)
│   └── build-use-cases.py    (builds prd/tezera-use-cases.html from the SRS draft)
├── Tezera Proposal.pdf
├── proposal/
│   └── tezera-proposal.html
├── brand/
│   └── tezera-brand-manual.html
├── mindmaps/
│   ├── tezera-organiser-map.mm            (FreeMind file to import into MindMeister)
│   ├── tezera-organiser-map-outline.txt   (the same map as a tab-indented outline)
│   ├── tezera-vendor-map.mm
│   └── tezera-vendor-map-outline.txt
├── wireframes/
│   └── tezera-organiser-wireframe.html   (organiser screens, drawn by the script inside the file)
├── report/
│   ├── tezera-srs-chapter-4.md   (draft report chapter 4, SRS)
│   └── figures/                  (onion model and use case diagrams: SVG, PNG and build-figures.js)
├── database/
│   ├── tezera-table-creation-plan.md + .pdf
│   ├── tezera-table-howto.md + .pdf
│   └── tezera-auth-setup-plan.md + .pdf
├── prd/
│   ├── tezera-prd.html
│   ├── tezera-architecture.html
│   └── tezera-use-cases.html     (generated by tools/build-use-cases.py)
├── research/
│   ├── tezera-survey-analysis.html
│   ├── tezera-personas.html
│   ├── tezera-user-stories.html
│   ├── tezera-work-items.html
│   ├── tezera-research-briefs.html
│   └── tezera-work-items-jira.csv   (generated from the work items page)
├── presentation/
│   ├── tezera-presentation.pptx   (final viva deck; build-deck.js writes Tezera Viva.pptx, fonts embedded by finish-deck.ps1)
│   ├── CS-26-presentation.pdf     (PDF export of the deck)
│   ├── build-deck.js
│   ├── finish-deck.ps1
│   ├── assets/               (logo, team photos, site screenshots)
│   └── fonts/                (Bricolage Grotesque, Instrument Sans: SIL OFL)
├── PRD Research.md
├── SDG Alignment.md
└── .archify/
    ├── inject-nav.py   (runs tools/build-site.py after the diagram is regenerated)
    ├── architecture-tezera-v7-20261123-dev/           (source of the page as it is now: PRD v7 checked against the code on `dev`)
    ├── architecture-tezera-v7-20261120-235350/        (PRD v7 before the code check)
    └── architecture-tezera-amplify-20261015-142128/   (PRD v6 diagram source; older folders are history)
```

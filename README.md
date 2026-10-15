# tezera

A mobile app and web portal where Sri Lankan event organisers hire vendors and freelancers, and attendees find events and each other. Every finished job leaves a review the next organiser can read.

**Second-year Agile Team Project (SDGP)** · Project proposal, September 2026 (renamed from Eventline to REVAMP on 6 October 2026, then to Tezera on 8 October 2026)

## Documents

| Document | What it is | Read it when |
| --- | --- | --- |
| [Tezera Proposal.pdf](Tezera%20Proposal.pdf) | The 8-page project proposal: the problem, who is involved, the four modules, key workflows, the competitor comparison, SDG alignment and the roadmap for the Agile Team Project (ATP) | You want the plan at a glance |
| [prd/tezera-prd.html](prd/tezera-prd.html) | The full product requirements document (version 6): roles, requirement tables with MoSCoW priorities, non-functional requirements, technical approach, business model, success metrics, risks and open questions. Edit this HTML file directly; print it to get a PDF | You need the detail behind a feature or decision |
| [prd/tezera-architecture.html](prd/tezera-architecture.html) | The system architecture diagram (interactive, works offline), serverless on AWS Amplify, with the reasons for each service and its alternatives | You want to see how the apps, backend and services fit together |
| [research/tezera-survey-analysis.html](research/tezera-survey-analysis.html) | Analysis of the discovery surveys of attendees, organisers, and vendors and freelancers (4–8 October 2026), with the twelve recommended PRD changes (R1–R12), all accepted on 15 October 2026 | You want to know what the market research found |
| [research/tezera-personas.html](research/tezera-personas.html) | Eight user personas (two consumers, two organisers, three vendors and freelancers, one admin) built from the survey segments, each with evidence, quotes and the user stories written for them | You are designing a flow and need to know who it is for |
| [research/tezera-user-stories.html](research/tezera-user-stories.html) | User stories for each role as Given / When / Then scenarios, drawn from the survey evidence and mapped to PRD requirement IDs | You are planning the backlog or a sprint |
| [research/tezera-work-items.html](research/tezera-work-items.html) | The backlog as epics, stories and tasks with proposed story points, PRD coverage, and a Jira CSV export ([snapshot](research/tezera-work-items-jira.csv)). Includes the work for the accepted survey changes and the interactive venue map | You are planning sprints or importing into Jira |
| [research/tezera-research-briefs.html](research/tezera-research-briefs.html) | Desk-research briefs with sources: whether in-app payments to vendors and freelancers are legal in Sri Lanka (Central Bank rules, gateways, tax, PDPA), and what the map builder takes from the team's ai-studio repository | You need the reasoning behind the payments model or the map builder |
| [brand/tezera-brand-manual.html](brand/tezera-brand-manual.html) | The brand manual: name story, the three account personalities, light and dark palettes for organiser, vendor and attendee, type, icons, the tile system, motion rules, voice and applications | You are designing a screen, a post or a poster |
| [HANDOFF.md](HANDOFF.md) | Where the work stands, what was decided, and what comes next. Updated after every session | You're picking up the work |

Supporting files:

- [proposal/tezera-proposal.html](proposal/tezera-proposal.html) — the HTML source of the proposal. Print it from Chrome to regenerate the PDF.
- [PRD Research.md](PRD%20Research.md) — the research behind the PRD, the group's answers that shaped it, and 53 sources with how reliable each one is.
- [SDG Alignment.md](SDG%20Alignment.md) — the notes behind the proposal's SDG page.
- [CLAUDE.md](CLAUDE.md) — working rules for Claude Code in this repository.
- `.archify/architecture-tezera-amplify-20261015-142128/candidate.json` — the editable source of the architecture diagram (older `.archify` folders are history).

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
8. Technical approach: the recommended stack (serverless on AWS Amplify), the data design on DynamoDB, how the interactive venue map and its builder are built, and how sandboxed payments work
9. MVP scope and priorities
10. Business model
11. Success metrics
12. Assumptions and dependencies
13. Risks and mitigations
14. Open questions

The PRD also lists what changed in each version (2 to 6) and ends with a Sources list.

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
- **Technical approach:** only the PRD records the recommended stack.
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
├── Tezera Proposal.pdf
├── proposal/
│   └── tezera-proposal.html
├── brand/
│   └── tezera-brand-manual.html
├── prd/
│   ├── tezera-prd.html
│   └── tezera-architecture.html
├── research/
│   ├── tezera-survey-analysis.html
│   ├── tezera-personas.html
│   ├── tezera-user-stories.html
│   ├── tezera-work-items.html
│   ├── tezera-research-briefs.html
│   └── tezera-work-items-jira.csv   (generated from the work items page)
├── PRD Research.md
├── SDG Alignment.md
└── .archify/
    ├── inject-nav.py   (adds the document navbar to the generated diagram)
    └── architecture-tezera-amplify-20261015-142128/   (current diagram source; older folders are history)
```

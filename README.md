# tezera

A mobile app and web portal where Sri Lankan event organisers hire vendors and freelancers, and attendees find events and each other. Every finished job leaves a review the next organiser can read.

**Second-year Agile Team Project (SDGP)** · Project proposal, September 2026 (renamed from Eventline to Tezera on 6 October 2026, then to Tezera on 8 October 2026)

## Documents

| Document | What it is | Read it when |
| --- | --- | --- |
| [Tezera Proposal.pdf](Tezera%20Proposal.pdf) | The 8-page project proposal: the problem, who is involved, the four modules, key workflows, the competitor comparison, SDG alignment and the roadmap for the Agile Team Project (ATP) | You want the plan at a glance |
| [prd/tezera-prd.html](prd/tezera-prd.html) | The full product requirements document (version 3): roles, requirement tables with MoSCoW priorities, non-functional requirements, technical approach, business model, success metrics, risks and open questions. Edit this HTML file directly; print it to get a PDF | You need the detail behind a feature or decision |
| [prd/tezera-architecture.html](prd/tezera-architecture.html) | The system architecture diagram (interactive, works offline), including the optional 3D venue viewer | You want to see how the apps, backend and services fit together |
| [research/tezera-survey-analysis.html](research/tezera-survey-analysis.html) | Analysis of the discovery surveys of attendees, organisers, and vendors and freelancers (4–8 October 2026), with recommended PRD changes | You want to know what the market research found |
| [research/tezera-user-stories.html](research/tezera-user-stories.html) | User stories for each role as Given / When / Then scenarios, drawn from the survey evidence and mapped to PRD requirement IDs | You are planning the backlog or a sprint |
| [HANDOFF.md](HANDOFF.md) | Where the work stands, what was decided, and what comes next. Updated after every session | You're picking up the work |

Supporting files:

- [proposal/tezera-proposal.html](proposal/tezera-proposal.html) — the HTML source of the proposal. Print it from Chrome to regenerate the PDF.
- [PRD Research.md](PRD%20Research.md) — the research behind the PRD, the group's answers that shaped it, and 53 sources with how reliable each one is.
- [SDG Alignment.md](SDG%20Alignment.md) — the notes behind the proposal's SDG page.
- [CLAUDE.md](CLAUDE.md) — working rules for Claude Code in this repository.
- `.archify/architecture-revamp-3d-20261006-115638/candidate.json` — the editable source of the architecture diagram.

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
6. Functional requirements, in ten modules: accounts, events, ticketing (after the ATP), hiring, reviews, venue maps (including an optional 3D view), community, messaging, organiser dashboard, administration
7. Non-functional requirements, including Sri Lanka's Personal Data Protection Act
8. Technical approach: the recommended stack and how the 3D venue view would work
9. MVP scope and priorities
10. Business model
11. Success metrics
12. Assumptions and dependencies
13. Risks and mitigations
14. Open questions

The PRD also lists what changed in version 2 and ends with a Sources list.

## Roadmap

**During the ATP**

1. **Discovery:** interview event organisers, survey vendors, freelancers and attendees, and confirm the backlog.
2. **ATP release,** a mobile app and web portal with:
    - accounts and verification
    - events and promotion feed
    - hiring marketplace and stalls
    - reviews and ranking
    - community and chat
    - venue maps (a 3D view if time allows)
    - admin and moderation
    - Sinhala and Tamil, if time allows
3. **Live pilot:** one or two partner organisers and the vendors they already use run a real event through Tezera, producing the first reviews and SDG measures.

**Decision point:** after the pilot, the group decides whether to take Tezera further.

**Beyond the ATP**

1. **First — ticketing and entry:** ticket tiers and reserved seats, free RSVP events, QR tickets and gate scanning, refunds and cancellations, and attendee reviews of events.
2. **After that — payments in the app:** hiring payments and deposits, stall fees, ticket and hiring commission, and venue map extras.
3. **After that — hiring for private events:** weddings, birthdays and other private events.
4. **Later version — premium accounts:** VIP and fast-sale ticket access.

## How the proposal and the PRD differ

- **Private events:** both plan hiring for private events after the ATP, but whether to do it is still an open question in the PRD.
- **3D venue view:** the PRD adds an optional 3D view of the venue map (Could). The proposal doesn't mention it.
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
├── prd/
│   ├── tezera-prd.html
│   └── tezera-architecture.html
├── research/
│   ├── tezera-survey-analysis.html
│   └── tezera-user-stories.html
├── PRD Research.md
├── SDG Alignment.md
└── .archify/
    └── architecture-revamp-3d-20261006-115638/   (diagram source and check receipts)
```

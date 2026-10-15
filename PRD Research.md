# PRD Research — Tezera

Everything that went into the Tezera PRD (written as "[Product Name]" before the name was chosen), where each piece came from, and how far each source can be trusted.

- **Research date:** 30 September 2026 (all web pages were checked on this date and may have changed since)
- **The PRD itself:** [prd/tezera-prd.html](prd/tezera-prd.html), version 3 (8 October 2026; version 2 was 6 October 2026). Version 1 was the online Claude Doc [Event Organisation Platform PRD](https://claude.ai/artifact/5t9nW3mMeL3Q7r99oCceqh).
- **Section numbers:** this file was written against PRD version 1. Version 2 added section 8 (Technical approach), so version 1 sections 8–13 are now 9–14. Section 11 below gives both numbers.
- **Prepared by:** Claude, from the chat in which the PRD was written

## Contents

1. [How the research was done](#1-how-the-research-was-done)
2. [Requirements from you: brief and answers](#2-requirements-from-you-brief-and-answers)
3. [Sri Lankan ticketing and event platforms](#3-sri-lankan-ticketing-and-event-platforms)
4. [Sri Lankan vendor directories and freelance marketplaces](#4-sri-lankan-vendor-directories-and-freelance-marketplaces)
5. [Global comparable platforms](#5-global-comparable-platforms)
6. [Gap analysis](#6-gap-analysis)
7. [Sri Lanka's Personal Data Protection Act (PDPA)](#7-sri-lankas-personal-data-protection-act-pdpa)
8. [Payment gateways that support LKR](#8-payment-gateways-that-support-lkr)
9. [Example organiser: Agastra Events](#9-example-organiser-agastra-events)
10. [Looked for but not verified](#10-looked-for-but-not-verified)
11. [How the research was used in the PRD](#11-how-the-research-was-used-in-the-prd)
12. [What in the PRD did not come from research](#12-what-in-the-prd-did-not-come-from-research)
13. [Full source list](#13-full-source-list)

---

## 1. How the research was done

The PRD draws on three kinds of input. Only the second is research in the usual sense, but all three are listed so the group can see what rests on what.

| Input | What it covered | How it was gathered |
| --- | --- | --- |
| Your brief and answers | Scope, roles, features, payments, priorities | Your original message, then 6 rounds of multiple-choice questions (24 questions) in the chat on 30 September 2026. See section 2. |
| Web research | Competitors, privacy law, payment gateways, the Agastra example | A Claude research sub-agent made about 150 tool calls, mostly web searches and page fetches, over roughly 25 minutes. Claude then re-checked the privacy-law dates by opening three of the pages again. See sections 3–10. |
| Claude's general knowledge and proposals | Standard methods (e.g., MoSCoW), proposed numbers and rules | Not researched. Every proposal is labelled "(proposed)" in the PRD. See section 12. |

**What the research agent was asked to find** (seven topics):

1. Sri Lankan online ticketing and event platforms operating today, and what they offer.
2. Sri Lankan event and wedding vendor directories, and freelance marketplaces used in Sri Lanka.
3. Global comparable platforms (Eventbrite, BookMyShow, Meetup, Facebook Events, and event-vendor marketplaces).
4. Whether any platform already combines ticketing, vendor/freelancer hiring and community.
5. The status and obligations of Sri Lanka's Personal Data Protection Act, No. 9 of 2022.
6. Sri Lankan payment gateways that accept LKR, and whether they offer a sandbox for developers.
7. Whether "Agastra", the organiser named in your brief, exists and how it is spelled.

**How to read the reliability labels in this file:**

- **Opened** — the page was fetched and read by the research agent (or by Claude, where stated).
- **Via search** — the link came back in search results, but the page itself was not opened. Treat these as leads, not sources.
- **Not verified** — looked for, but could not be confirmed.
- **"Not found"** — absent from the pages that were checked. It does not prove the feature or company does not exist.

**Two cautions before citing anything in an assessed report:**

- The fetching tool turns a page into text and extracts answers with a small AI model. Quotes in this file came through that step, so re-check an exact quote on the live page before you rely on it.
- A second Claude agent later reviewed the PRD against your answers, which led to 15 corrections. That was a quality check, not research, so its findings are not repeated here.

---

## 2. Requirements from you: brief and answers

### 2.1 Your original brief (verbatim)

> We have an idea for our sdgp group project. We want to make an application for event organiation in Sri Lanka. Our target Audience would be event organisers like Agastra and any other indivudual or group hoping to organise an events/concerts/exhibitions, basically any large scale event which require an organiser, vender and consumer.
>
> Our platform would act as a central hub for these parties where the organisers have the ability to hire vendors (eg/- freelance photographers and media agencies, food and beverage stalls, and other external parties that would be needed for their events), connect with other users (conusmers) and promote the events media and marketing material (time, place, date, reels, posts, and other material) and creates a map system for the events, where the event venue is mapped out and is supplied by the organiser to the consumers. It should also have a forum style for people to communicate and meet up as friends.  the basic idea is a BIG instagram/ reddit page, which allows ticket booking and communication between organiser and consumer. and organiser and vendor, then orgnaiser and freelancers. Also take note the freelancers and vendors should have a ranking system and an review page in their user profile. The same can be done for the organisers as well. Make sure to ask me any questions before adding anything else, ask questions if you have any doubts and ask questions where you would hallucinate.
>
> I want you create a PRD document for this idea.

### 2.2 Your answers, round by round

Options tagged "(Recommended)" were Claude's suggestions; where you picked one, you followed that suggestion. Answers you typed yourself are quoted exactly.

**Round 1 — foundations**

| Question | Your answer | What the option meant |
| --- | --- | --- |
| Which platform(s) should the product target? | Mobile app + web portal (Recommended) | Android and iOS app for all users, plus a web portal where organisers and vendors manage events, bookings and venue maps on a larger screen. |
| How are "vendors" and "freelancers" different? | Vendor = business, Freelancer = individual | Vendors are companies and stalls (F&B stalls, media agencies, sound and lighting, décor). Freelancers are individuals (photographers, videographers, DJs, MCs). |
| How should organisers hire vendors and freelancers? | Both methods (Recommended) | Organisers can search profiles and send a direct booking request, or post a requirement that providers answer with quotes. |
| Should the PRD draw on any of these? | Competitor research | Claude researches existing Sri Lankan and global platforms and cites sources. You gave no SDGP template or user research, so the PRD used a standard structure and framed problems as hypotheses. |

**Round 2 — money, stalls and reputation**

| Question | Your answer | What it means |
| --- | --- | --- |
| Which payments should happen inside the app? | "For now allow only Ticket purchases through the app, If we go in furthur with this idea lets allow the hiring payments and stall fees" | Only tickets are paid in the app for the MVP. Hiring payments and stall fees move into the app only if the group takes the idea further. |
| How do stall vendors get a spot at an event? | Both | The organiser can invite vendors directly and/or open stall applications. |
| Who should be able to review whom? | All four options | Organisers review vendors and freelancers; vendors and freelancers review organisers; consumers review organisers and events; consumers review stall vendors. |
| What should the ranking system include besides star ratings and written reviews? | All four options | Weighted rank score, category ratings, tier badges, leaderboards. |

**Round 3 — tickets, map, communication, accounts**

| Question | Your answer | What it means |
| --- | --- | --- |
| Which ticketing features should be included? | All four options | Ticket tiers, QR e-tickets and gate check-in, reserved seating, free events (RSVP). |
| What should the venue map system include? | "Upload layout + pins, We will further discuss it and see, for now leave it as Upload Layout + pins" | Only an uploaded floor plan with labelled pins for now. An in-app builder, stalls linked to vendor profiles and Google Maps directions stay under team discussion. |
| How should organisers and consumers communicate? | All three options | 1:1 chat, announcements, public Q&A on the event page. |
| Can one person hold more than one role on a single account? | No, one role per account | Separate sign-ups for organiser, vendor, freelancer and consumer. |

**Round 4 — social features and revenue**

| Question | Your answer | What it means |
| --- | --- | --- |
| Who can publish posts and reels to the main feed? | Organisers only | The feed is purely for event promotion. |
| How should the Reddit-style forum be organised? | Event boards + communities (Recommended) | Every event gets its own discussion board, plus topic and city communities. |
| How should consumers connect to "meet up as friends"? | All four options | Follow and friend requests, 1:1 direct messages (with block and report), event group chats, an opt-in "Going" list. |
| How will the platform make money? | Ticket commission, hiring commission, plus "We can have premium accounts for VIP or fast sale tickets, in a later version of the app" | Ticket commission first; hiring commission once hiring payments are in the app; premium accounts in a later version. |

**Round 5 — add-ons, gate check-in, MVP**

| Question | Your answer | What it means |
| --- | --- | --- |
| Additional features, set 1 | All four options | Admin and moderation, verified badges, notifications, organiser analytics. |
| Additional features, set 2 | All four options | Sinhala and Tamil, recommendations, refunds and cancellations, availability calendar. |
| How should an organiser's staff get access to scan QR tickets? | "The organisers should be willing to accept tickets that were bought online, we can ask the organisers to accepts a QR code or an online ticket. Some sri lankan organisers already do that" | Organisers must agree to accept the platform's QR or online tickets at the gate. How gate staff get scanner access is still an open question in the PRD. |
| Which modules must be in the SDGP prototype (MVP)? | All four options | Events and ticketing, vendor and freelancer hiring, forum and social, venue map. |

**Round 6 — final details**

| Question | Your answer | What it means |
| --- | --- | --- |
| How should the add-ons be prioritised? | Propose a MoSCoW split (Recommended) | Claude marks each add-on Must, Should or Could as a proposal for the group to review. |
| Should vendor and freelancer profiles have a portfolio gallery? | Yes, portfolio on profile (Recommended) | Photos and videos of past work on the profile, next to reviews. |
| Who can post and reply in the forum? | All roles, with role badges | Consumers, organisers, vendors and freelancers can all post; a badge shows each person's role. |
| Does the product have a name yet? | Use a placeholder | "[Product Name]" was used throughout version 1. The product was named REVAMP on 6 October 2026 and renamed Tezera on 8 October 2026. |

---

## 3. Sri Lankan ticketing and event platforms

Five local platforms were checked. **None of them offered vendor hiring, reviews of organisers or providers, or in-app community features** in the pages checked.

### MyTickets (mytickets.lk)

- Describes itself as an "Official Online Tickets Marketplace" for concerts, sports, movies, buses and trains. — [mytickets.lk](https://mytickets.lk/) (opened)
- E-tickets can be viewed, downloaded and transferred, and it also offers table reservations. — [MyTickets FAQ](https://mytickets.lk/faq) (opened)
- Its ticket policy mentions seat-specific tickets. — [MyTickets ticket policy](https://mytickets.lk/ticket-policy) (opened)
- Organisers "manage sales, reservations and check-ins in real time with M Super Console". — [MyTickets business page](https://mytickets.lk/business) (opened)
- Not found: vendor hiring, reviews, community features.
- Not verified: whether its tickets use QR codes.

### TicketsMinistry

- Organiser dashboard with ticket tiers, early-bird pricing and real-time analytics. — [TicketsMinistry for organisers](https://www.ticketsministry.com/for-organisers) (opened)
- QR entry through an iOS and Android scanner app, with signed single-use QR codes and an offline mode. — same page
- Promo and affiliate tools, and daily payouts to organisers. — same page
- "Vendor & POS-Style Add-ons": merchandise and F&B sold at checkout. This is selling extras to attendees, not hiring vendors. — same page
- Its local team sets up seat maps for organisers. — [TicketsMinistry: event ticketing in Sri Lanka guide](https://www.ticketsministry.com/blog/event-ticketing-in-sri-lanka-guide) (opened)
- Its only community channel is WhatsApp. Not found: reviews, hiring.

### ClickTickets (clicktickets.lk)

- Event discovery, a "secure digital QR ticket instantly", and seat-level tickets (for example "Block A, Seat A-12"). — [clicktickets.lk](https://clicktickets.lk/) (opened)
- Organisers can "manage online ticketing, reservations and event sales". — same page
- Social features are limited to Facebook and WhatsApp channels. — same page

### OneTicket (oneticket.lk)

- An "Event Hosting & Ticketing Platform" to "buy, sell, and manage tickets", run by Spemai (Pvt) Ltd. — [oneticket.lk](https://oneticket.lk/) (opened)
- Not verified: any features beyond this self-description.

### BookMyShow LK

- Offers "movie tickets, reviews, trailers, sports & event". — [lk.bookmyshow.com](https://lk.bookmyshow.com/) (opened)
- Entered Sri Lanka in 2016, offering organisers sales tracking and gate-entry management. — [Daily FT: BookMyShow comes to Sri Lanka](https://www.ft.lk/article/563792/BookMyShow--India-s-largest-online-entertainment-ticketing-platform--comes-to-Sri-Lanka) (opened)
- Its reviews are movie reviews only.

---

## 4. Sri Lankan vendor directories and freelance marketplaces

These cover the hiring side of the idea. They are mostly wedding-focused or general freelance sites, with no public-event ticketing.

| Platform | What the research found | Source |
| --- | --- | --- |
| WeddingArcade.lk | A "Wedding Vendor Marketplace" listing halls, photographers, salons, decorators, DJs and cars | [weddingarcade.lk](https://weddingarcade.lk/) (opened) |
| Plan A Wedding | 17 vendor categories, browsable by city, with a "Request Quote" button | [planawedding.lk/vendor-marketplace](https://planawedding.lk/vendor-marketplace) (opened) |
| Nevesta.lk | A platform "connecting couples with wedding vendors" | [nevesta.lk](https://nevesta.lk/) (opened) |
| WedMeGood (Sri Lanka section) | An Indian platform that lists Sri Lankan vendors with ratings, "Write A Review" and prices | [wedmegood.com/vendors/sri-lanka](https://www.wedmegood.com/vendors/sri-lanka/) (opened) |
| DJBooking.lk | "432 verified DJs… Compare packages and book" | [djbooking.lk](https://djbooking.lk/) (opened) |
| ikman.lk Events & Entertainment | Classified ads for photography and video, rentals and entertainers | [ikman.lk events & entertainment](https://ikman.lk/en/ads/sri-lanka/events-entertainment) (opened) |
| Fiverr, Upwork, Freelancer | LIRNEasia called Fiverr "the most popular online platform in Sri Lanka". **This is 2017 data and is old.** | [LIRNEasia, January 2017](https://lirneasia.net/2017/01/lirneasia-estimate-17000-22000-online-freelancers-in-sri-lanka/) (opened) |
| YakaWORK | A local freelancer marketplace: "From logo design to web development" | [yakawork.lk](https://www.yakawork.lk/home) (opened) |

Not verified: whether WeddingArcade and Nevesta have reviews. Wed.lk, Freelance.lk and 444.lk could not be reached when checked.

---

## 5. Global comparable platforms

| Platform | What the research found | Not found | Sources |
| --- | --- | --- | --- |
| Eventbrite | A platform to "browse, create, and promote local events", with reserved seating and seat maps | Vendor hiring, forums | [Wikipedia: Eventbrite](https://en.wikipedia.org/wiki/Eventbrite) (opened); [Eventbrite reserved seating](https://www.eventbrite.com/organizer/features/reserved-seating/) (opened) |
| BookMyShow | Ticketing for movies, events and sports (see section 3) | Vendor hiring, community | See section 3 |
| Meetup | A community platform for "hosting and organizing… events for people and communities of similar interests". Organisers on the Standard or Pro plan can charge event fees. | Seating, hiring | [Wikipedia: Meetup](https://en.wikipedia.org/wiki/Meetup_(website)) (opened); [Meetup: setting event fees](https://help.meetup.com/hc/en-us/articles/360002883891-Setting-event-fees) (opened) |
| Facebook Events | Public and private events; Page events can carry tickets; Messenger Communities chats "for up to 5,000 members to plan events" | Vendor hiring | [Facebook help: events](https://www.facebook.com/help/1769557403280350), [Page event tickets](https://www.facebook.com/help/833182653681227), [Messenger Communities](https://www.facebook.com/help/642856324190448) — **all via search, not opened** |
| Posh (US) | Social ticketing: "Follow your friends and the organizers you love", "Send an event to your group chat", a personalised feed and scannable tickets | Hiring | [Posh on the App Store](https://apps.apple.com/us/app/posh-social-experiences/id1556928106) (opened) |
| The Knot Worldwide | "Marketplaces, content, tools and resources for wedding planning" | Ticketing | [Wikipedia: The Knot Worldwide](https://en.wikipedia.org/wiki/The_Knot_Worldwide) (opened) |
| Thumbtack | A US marketplace to "locate and hire professionals for home improvement projects" | Ticketing | [Wikipedia: Thumbtack](https://en.wikipedia.org/wiki/Thumbtack_(company)) (opened) |
| Eventeny (US) | Closest match overall; see section 6 | See section 6 | See section 6 |

Not verified: whether Facebook's event ticketing is available in Sri Lanka.

---

## 6. Gap analysis

**Finding:** no platform found, Sri Lankan or global, combines ticketing, vendor and freelancer hiring, and social or community features in one product. This means none was found in the pages checked, not that none exists.

**Closest match — Eventeny (US):**

- Ticketing with QR check-in, vendor and exhibitor applications, booth assignment and a vendor marketplace. — [Why Eventeny](https://www.eventeny.com/why-eventeny/) (opened)
- Its maps let attendees "search and filter vendors, sponsors, and products". — [Eventeny mapping](https://www.eventeny.com/mapping/) (opened)
- Not found: forums, direct messages, meetups, or hiring of freelancers such as photographers or DJs.

**Partial matches** (each covers two of the three parts):

| Platform | What it combines |
| --- | --- |
| Posh | Ticketing and social features |
| TicketsMinistry | Ticketing and checkout add-ons |
| WedMeGood, DJBooking.lk | Hiring and reviews |
| Meetup, Facebook Events | Community and events |

**What the PRD concluded from this:** local rivals already offer QR entry and seat selection, so those are table stakes. The case for Tezera rests on hiring, reputation and community in one place.

---

## 7. Sri Lanka's Personal Data Protection Act (PDPA)

### 7.1 The Act and its amendment

- The Personal Data Protection Act, No. 9 of 2022 exists. — [Act text, Parliament of Sri Lanka (PDF)](https://www.parliament.lk/uploads/acts/gbills/english/6242.pdf) (opened)
- It was amended by the Personal Data Protection (Amendment) Act, No. 22 of 2025 (gazetted 31 October 2025). The amendment removed the grace periods, so the remaining Parts start on dates the Minister sets by gazette order. — [DLA Piper: data protection laws of Sri Lanka](https://www.dlapiperdataprotection.com/index.html?t=law&c=LK) (opened)

### 7.2 What is in force, and when

| Date | What happened | Source |
| --- | --- | --- |
| July 2023 | Part V (the Data Protection Authority) came into force | [Wikipedia: PDPA (Sri Lanka)](https://en.wikipedia.org/wiki/Personal_Data_Protection_Act_(Sri_Lanka)) (opened) |
| December 2023 | Parts VI and VIII–X came into force | Same |
| 18 March 2025 | An earlier planned start date, later repealed | Same |
| 31 October 2025 | Amendment Act No. 22 of 2025 gazetted; grace periods removed | DLA Piper (above) |
| 22 July 2026 | Gazette Extraordinary No. 2498/16 issued | [The Leveraged Years](https://www.theleveragedyears.com/ai-regulation-news/sri-lanka-pdpa-commencement-order-gazette-2498-16-jan-2027) (opened); [Concentric](https://concentric.ai/sri-lankas-pdpa-takes-effect-january-1-2027-what-global-enterprises-need-to-know/) (opened) |
| 1 January 2027 | Sections 2 and 3, Part I (processing of personal data) and Part III (controllers and processors) come into operation | Same two sources |
| Not yet set | Part II (rights of data subjects) and Part VII (penalties) await a further order | Same two sources |

Further points from the research agent:

- Section 2(1) also covers foreign organisations that serve people in Sri Lanka. — The Leveraged Years (above)
- The Data Protection Authority's own website still showed the superseded 2025 notice. — [DPA notice page](https://www.dpa.gov.lk/notice.php) (opened)
- The official gazette PDF could not be opened: [documents.gov.lk 2498/16](https://documents.gov.lk/view/egz/2026/7/2498-16_E.pdf) returned **404**. The dates above therefore rest on two secondary reports from August 2026.

### 7.3 Obligations relevant to an app like this

All from [DLA Piper](https://www.dlapiperdataprotection.com/index.html?t=law&c=LK) (opened):

| Topic | What the Act requires |
| --- | --- |
| Consent | One of six lawful grounds for processing. Consent must be "freely given, specific, informed and unambiguous… capable of being withdrawn at any time". Children's and biometric data need extra conditions. Marketing messages need consent. |
| Data-subject rights (not yet in force) | Access, rectification, erasure, objection, restriction, withdrawing consent, and review of automated decisions. Replies are due within 1 month (3 months at most). |
| Security | "Appropriate technical and organisational measures", a Data Protection Management Programme, and data protection impact assessments (DPIAs) where needed. |
| Breach notification | Notify the Data Protection Authority of a personal data breach within 72 hours. |
| Data Protection Officer | Required for large-scale systematic monitoring or large-scale processing of special-category data. The draft threshold is 25,000 or more data subjects in 12 months. |
| Cross-border transfers | Allowed with Part I compliance plus instruments the Authority specifies, or with explicit informed consent, contract necessity or legal claims. |
| Penalties (not yet in force) | Up to LKR 10 million per violation. |

### 7.4 Claude's own check of the key dates

Because the start date is a legal claim, Claude opened three sources again after the research agent reported back. The quotes below are as the fetching tool returned them.

**DLA Piper** — [page](https://www.dlapiperdataprotection.com/index.html?t=law&c=LK):

- "Subsequently, PDPA 2022 was amended by way of Personal Data Protection (Amendment) Act No. 22 of 2025 (the "Amendment Act")"
- "The Amendment Act removed the provisions on the grace periods for operationalization of the law."
- "thus far, only the provisions pertaining to the regulator (the Data Protection Authority) and the interpretation section of PDPA 2022 have been brought into operation, which took place in 2023."
- The remaining provisions "will now be brought into operation on a date the Minister in charge of the subject matter may appoint by Order published in the Gazette. Thus far, no such date has been pronounced by the Minister in such regard."
- "Consent under the PDPA is required to be freely given, specific, informed and unambiguous indication in writing or by affirmative action."
- A controller "must notify the Authority of such personal data breach with the requisite information set out therein, to the extent feasible, within seventy two (72) hours" of becoming aware of it.
- **Note:** this page says no start date had been set, which conflicts with the July 2026 order. It appears to have been written before that order.

**The Leveraged Years** (published and updated 3 August 2026) — [page](https://www.theleveragedyears.com/ai-regulation-news/sri-lanka-pdpa-commencement-order-gazette-2498-16-jan-2027):

- "Gazette Extraordinary No. 2498/16, July 22, 2026"
- "Section 2, Section 3, Part I and Part III of the Act shall come into operation" on "January 01st, 2027"
- "Part II, on rights of data subjects, and Part VII, on penalties, are not named in it, and no commencement date for either appears in the national sources reviewed as of August 3, 2026."
- "A separate Order could appoint one at any time."

**Concentric** (published 20 August 2026) — [page](https://concentric.ai/sri-lankas-pdpa-takes-effect-january-1-2027-what-global-enterprises-need-to-know/). The first attempt to open it timed out; the second worked.

- "Gazette Extraordinary No. 2498/16" issued on "July 22, 2026"
- "Part I (Processing of Personal Data) and Part III (Controllers and Processors)" become operational on "January 1, 2027"
- "data subject rights under Part II and the penalty regime under Part VII wait on a further order"

**Conclusion used in the PRD:** processing rules and controller duties start on 1 January 2027, according to two secondary reports. Confirm this against the official gazette before launch, and build for the full Act now to avoid rework.

---

## 8. Payment gateways that support LKR

All six have a sandbox or test environment, which matters because the prototype can then run without real money.

| Gateway | Test environment | Currencies | Developer tools | Sources |
| --- | --- | --- | --- | --- |
| PayHere | Yes: sandbox.payhere.lk, with test cards | LKR, USD | Android, iOS, Flutter and React Native SDKs | [payhere.lk](https://www.payhere.lk/); [sandbox and testing](https://support.payhere.lk/sandbox-and-testing) (opened); [checkout API and SDKs](https://support.payhere.lk/api-&-mobile-sdk/checkout-api) (opened) |
| Onepay | Yes: credentials from the merchant dashboard | LKR, USD | API documentation | [onepay.lk](https://www.onepay.lk/); [API documentation](https://docs.onepay.lk/api-documentation) (opened) |
| DirectPay | Yes | LKR, USD | Mobile SDK | [directpay.lk](https://www.directpay.lk/); [FAQ](https://www.directpay.lk/faq) (opened) |
| WEBXPAY | Yes: a staging URL | LKR, USD, GBP, AUD | Redirect integration guide | [webxpay.com](https://www.webxpay.com/); [redirect integration guide](https://developers.webxpay.com/Guides/Redirect-Integration/redirect.html) (opened) |
| PAYable | Yes | LKR (code samples) | Flutter and React Native support | [payable.lk](https://www.payable.lk/); [IPG merchant APIs on GitHub](https://github.com/payable/ipg-merchant-apis) (opened) |
| Genie Business (Dialog) | Yes: credentials on request | **LKR support not verified** on its developer page | Developer page | [geniebusiness.lk](https://geniebusiness.lk/); [developer page](https://geniebusiness.lk/developer) (opened) |

The PRD lists the first five as options. Genie Business was left out because its LKR support could not be confirmed.

---

## 9. Example organiser: Agastra Events

- The spelling in your brief is correct. The organiser is **Agastra Events**, a Sri Lankan concert and entertainment organiser whose website says "Unfolding the boundaries of entertainment". — [agastra.lk](https://agastra.lk/) (opened)
- It runs the Ultimate Band Show. The 2025 edition was on 15 November at the CH & FC Grounds with 7 bands, and tickets were sold through Graffon's GPASS system. — [ubs.agastra.lk](https://ubs.agastra.lk/) (opened)
- A YouTube video is titled "Ultimate Band Show 2022 Organized By Agastra Events". — [YouTube](https://www.youtube.com/watch?v=wO8BSzPXMzI) (**via search, not opened**)
- Not verified: Agastra's registered company name and address.

---

## 10. Looked for but not verified

- Whether MyTickets' tickets use QR codes.
- OneTicket's features beyond its own one-line description.
- Wed.lk, Freelance.lk and 444.lk: the sites could not be reached when checked.
- Whether WeddingArcade and Nevesta have reviews.
- The official PDPA gazette 2498/16 ([documents.gov.lk link](https://documents.gov.lk/view/egz/2026/7/2498-16_E.pdf) returned 404). No later order for Parts II and VII was found either.
- Whether Facebook's event ticketing works in Sri Lanka.
- LKR support on Genie Business's developer page.
- Agastra's registered company name and address.
- Every "not found" statement in this file: absence in the pages checked, not proof.

---

## 11. How the research was used in the PRD

| PRD section | What came from research | Research section here |
| --- | --- | --- |
| 3. Users and roles | "Agastra Events" name and link | 9 |
| 5. Competitive landscape | The comparison table (11 rows covering 13 platforms): MyTickets, TicketsMinistry, ClickTickets, BookMyShow LK, WeddingArcade / Plan A Wedding / WedMeGood, DJBooking.lk, ikman.lk, Eventeny, Posh, Eventbrite, Meetup. Also the conclusion that QR entry and seat selection are table stakes. | 3, 4, 5, 6 |
| 7. Non-functional requirements | The Privacy row's link to the Act, and the "PDPA status" note (1 January 2027 start, Parts II and VII pending, the 72-hour breach rule) | 7 |
| 11. Assumptions and dependencies (v2: 12) | The payment gateway row: PayHere, Onepay, DirectPay, WEBXPAY, PAYable, and PayHere's Flutter and React Native SDKs | 8 |
| 13. Open questions (v2: 14) | The note that TicketsMinistry already offers offline scanning | 3 |
| Sources | Links to every page the PRD cites | 13 |

**Researched but not used in the PRD:**

| Item | Why it was left out |
| --- | --- |
| OneTicket | Too little verified detail beyond its self-description |
| Nevesta.lk, The Knot Worldwide, Thumbtack | Covered by the WeddingArcade / Plan A Wedding / WedMeGood row, or not close enough to the product |
| Fiverr / Upwork / Freelancer (LIRNEasia) | 2017 data, too old to rely on |
| YakaWORK | General freelancing, not event-specific |
| Facebook Events | Its pages were found via search but never opened |
| Genie Business | LKR support not verified |
| PDPA details: data-subject rights, DPO threshold, cross-border transfers, penalties, the Wikipedia timeline, the DPA notice page | The PRD kept only the start date and the breach rule. The rest is in section 7 for when the group designs privacy features. |
| Agastra's Ultimate Band Show details | Not needed for the PRD |

---

## 12. What in the PRD did not come from research

So the group does not present any of these as researched facts:

**From your answers (section 2):** almost all scope decisions — roles, features, payments, what is in the MVP, and what is deferred.

**Claude's proposals, labelled "(proposed)" in the PRD:**

- The MoSCoW priority split for the eight add-ons.
- The rank score formula as a starting point: weights 0.5, 0.2, 0.2 and 0.1, and the minimum review count m = 5.
- The 14-day review window.
- The 10-minute seat hold while a consumer pays.
- A page-load target of under 3 seconds on 4G.
- Accessibility target: WCAG 2.1 AA.
- Verification documents: business registration for companies, NIC for individuals.
- Rules such as: admins create the first communities; the organiser marks a booking as completed; "Going" status is private by default; free RSVP events carry no fee.
- The success metrics. The targets are for the group to set.

**Claude's analysis based on your answers (not labelled "(proposed)", and not research):**

- The Must, Should, Could or Later priority on each requirement in PRD section 6. Most are Must because you put all four core modules in the MVP.
- Making full refunds on cancelled events a Must, which came from the review pass.
- The risks and their mitigations (PRD section 12; section 13 in version 2).
- The release-phase diagram (PRD section 8; section 9 in version 2, now redrawn to follow the proposal's roadmap).

**Standard methods and examples from Claude's general knowledge (not looked up):**

- MoSCoW prioritisation (Must / Should / Could / Won't).
- The Bayesian-average rating in the rank formula, which stops one five-star review from topping a leaderboard.
- Firebase Cloud Messaging and Apple Push Notification service, named as example push-notification services.
- General security practice: HTTPS, hashed passwords, role-based access, card data held only by the payment gateway.

**Added in PRD version 2 (6 October 2026), not from research:**

- Group decisions: the name REVAMP; ticketing and entry moved out of the ATP release to match the proposal; attendee reviews unlocked by a 'Going' mark instead of a checked-in ticket; an optional 3D venue view.
- Claude's analysis, for the group to check: organiser verification now gates stalls, job posts and booking requests (AC-08); the event page can link to external ticket sales until ticketing arrives (EV-01); only 'Going' marks made before the event count for reviews; the new risks and open questions that follow from these.
- Claude's recommendation from general engineering knowledge (not looked up): the technical approach in PRD section 8 — React Native with Expo, Next.js, NestJS, PostgreSQL, Redis with BullMQ, Cloudinary, and Three.js with React Three Fiber for the 3D view.

**Added in PRD version 3 (8 October 2026):**

- Group decision: the product is renamed Tezera (written "tezera" as a wordmark). The REVAMP acronym and the "Transform + Amplify" tagline are dropped.
- Discovery surveys ran from 4 to 8 October 2026: 26 attendees, 7 organisers, and 13 vendors and freelancers. The analysis is in [research/tezera-survey-analysis.html](research/tezera-survey-analysis.html) and the user stories in [research/tezera-user-stories.html](research/tezera-user-stories.html). The raw responses are not kept in the repository because they contain email addresses.

**Added in PRD version 5 (15 October 2026):**

- Decided by Damian, after questions on each recommendation: all twelve survey recommendations (R1–R12 in [research/tezera-survey-analysis.html](research/tezera-survey-analysis.html), section 7) are accepted, with the priorities in that table's Decision column. Their evidence is the survey; the 7-day late-cancellation window and the minimum age of 16 are proposed, not researched.
- Decided by Damian, not from research: the 3D venue view is removed, and an interactive 2D venue map replaces it (zones drawn as boxes, stall lists with items and prices, search by item, 'Find on map', stage line-ups, stall-type filter; VM-08 to VM-14). The survey's evidence that attendees could not find parking, seating and registration (R7) supports it, but the design itself was not tested with users.
- Not checked: whether Sri Lanka's PDPA requires a parent's consent for 16- and 17-year-olds, and in what form. The parent or guardian tick in AC-01 is proposed until someone reads the Act.

**Added in PRD version 6 (15 October 2026):**

- Decided by Damian, not from research: the backend moves to serverless AWS Amplify Gen 2 (AppSync GraphQL, DynamoDB, Lambda with SQS, Streams and EventBridge Scheduler, Cognito, S3 and CloudFront, SES), with Expo Push and Dialog e-SMS kept. The service choices within it are Claude's recommendations from general knowledge, chosen through questions.
- Not looked up this session: AWS free-tier terms for new accounts (changed in July 2025, from memory), Amazon Pinpoint's end of support on 30 October 2026 (from memory), SES sandbox rules, and whether the PDPA restricts storing Sri Lankan users' data in Mumbai. Check each before the pilot.
- Added later the same day: sandboxed payments and the map builder. Decided by Damian through questions; the recommendations were Claude's. Sandbox payments through the PayHere sandbox for booking instalments, stall fees, cancellation fees and refunds, with commission shown but not charged (HR-14, HR-17 to HR-20, Should). Each payee connects their own merchant account, so Tezera never holds money. A map builder with snapping, scale and one standard versioned map format (VM-16 to VM-18, Must); PDF, blank grid and saved venue maps (VM-19 to VM-21, Should); an AI first draft on Claude via Amazon Bedrock (VM-22, Could).
- Researched for these (15 October 2026, by two research agents; web research and a read of the GitHub repository): the legality of in-app payments in Sri Lanka, and what the map builder can take from the team's own ai-studio repository. Both briefs, with every source and what was not verified, are in [research/tezera-research-briefs.html](research/tezera-research-briefs.html). Key findings:
  - A platform that collects money and pays it on most likely counts as a Money or Value Transfer Service under CBSL Regulations No. 1 of 2024 (amended 2025). Registering needs a company with at least LKR 15m in capital that does only that business. This is why the payments model is direct to the provider.
  - PayHere lists multi-vendor platforms as unsupported; no Sri Lankan gateway found offers split payouts. Stripe is not available in Sri Lanka.
  - A 5% withholding tax on freelancer fees over LKR 100,000 a month has applied since June 2026. Sources disagree on the VAT threshold.
  - ai-studio is a social-post generator, not a map tool. Its image-to-template flow (AI makes a draft, and a person must fix it before saving), stable element IDs with stale-edit checks, and its revisions carry over. It has no LICENSE file, but Damian owns it and allows the code to be reused.
- Not verified: Claude on Bedrock in ap-south-1; PayHere's React Native SDK under Expo; whether PayHere allows a platform to open checkouts on its users' accounts; how PCI DSS treats in-app SDK checkouts; the commission rate.

**Hypotheses, not findings:** the problem statement in PRD section 1. It needs validating with interviews and surveys of organisers, vendors, freelancers and consumers.

**Not part of this work:** `SDG Alignment.md` was not written or researched in this chat. Check its SDG targets against the official UN SDG targets before you submit it.

---

## 13. Full source list

Status: **Opened** = fetched and read by the research agent. **Opened (also by Claude)** = re-checked by Claude. **Via search** = link from search results, not opened. **Official site** = the company's homepage, cited only for its name.

### Competitors: Sri Lankan ticketing

| # | Source | Status |
| --- | --- | --- |
| 1 | [MyTickets — home](https://mytickets.lk/) | Opened |
| 2 | [MyTickets — FAQ](https://mytickets.lk/faq) | Opened |
| 3 | [MyTickets — ticket policy](https://mytickets.lk/ticket-policy) | Opened |
| 4 | [MyTickets — business](https://mytickets.lk/business) | Opened |
| 5 | [TicketsMinistry — for organisers](https://www.ticketsministry.com/for-organisers) | Opened |
| 6 | [TicketsMinistry — event ticketing in Sri Lanka guide](https://www.ticketsministry.com/blog/event-ticketing-in-sri-lanka-guide) | Opened |
| 7 | [ClickTickets](https://clicktickets.lk/) | Opened |
| 8 | [OneTicket](https://oneticket.lk/) | Opened |
| 9 | [BookMyShow LK](https://lk.bookmyshow.com/) | Opened |
| 10 | [Daily FT — BookMyShow comes to Sri Lanka](https://www.ft.lk/article/563792/BookMyShow--India-s-largest-online-entertainment-ticketing-platform--comes-to-Sri-Lanka) | Opened |

### Vendor directories and freelance marketplaces

| # | Source | Status |
| --- | --- | --- |
| 11 | [WeddingArcade](https://weddingarcade.lk/) | Opened |
| 12 | [Plan A Wedding — vendor marketplace](https://planawedding.lk/vendor-marketplace) | Opened |
| 13 | [Nevesta](https://nevesta.lk/) | Opened |
| 14 | [WedMeGood — Sri Lanka vendors](https://www.wedmegood.com/vendors/sri-lanka/) | Opened |
| 15 | [DJBooking.lk](https://djbooking.lk/) | Opened |
| 16 | [ikman.lk — Events & Entertainment](https://ikman.lk/en/ads/sri-lanka/events-entertainment) | Opened |
| 17 | [LIRNEasia — online freelancers in Sri Lanka (2017)](https://lirneasia.net/2017/01/lirneasia-estimate-17000-22000-online-freelancers-in-sri-lanka/) | Opened (data from 2017) |
| 18 | [YakaWORK](https://www.yakawork.lk/home) | Opened |
| — | Wed.lk, Freelance.lk, 444.lk | Unreachable when checked |

### Global comparables and gap check

| # | Source | Status |
| --- | --- | --- |
| 19 | [Wikipedia — Eventbrite](https://en.wikipedia.org/wiki/Eventbrite) | Opened |
| 20 | [Eventbrite — reserved seating](https://www.eventbrite.com/organizer/features/reserved-seating/) | Opened |
| 21 | [Wikipedia — Meetup](https://en.wikipedia.org/wiki/Meetup_(website)) | Opened |
| 22 | [Meetup help — setting event fees](https://help.meetup.com/hc/en-us/articles/360002883891-Setting-event-fees) | Opened |
| 23 | [Facebook help — events](https://www.facebook.com/help/1769557403280350) | Via search |
| 24 | [Facebook help — Page event tickets](https://www.facebook.com/help/833182653681227) | Via search |
| 25 | [Facebook help — Messenger Communities](https://www.facebook.com/help/642856324190448) | Via search |
| 26 | [Posh — App Store listing](https://apps.apple.com/us/app/posh-social-experiences/id1556928106) | Opened |
| 27 | [Wikipedia — The Knot Worldwide](https://en.wikipedia.org/wiki/The_Knot_Worldwide) | Opened |
| 28 | [Wikipedia — Thumbtack](https://en.wikipedia.org/wiki/Thumbtack_(company)) | Opened |
| 29 | [Eventeny — why Eventeny](https://www.eventeny.com/why-eventeny/) | Opened |
| 30 | [Eventeny — mapping](https://www.eventeny.com/mapping/) | Opened |

### Privacy law (PDPA)

| # | Source | Status |
| --- | --- | --- |
| 31 | [Personal Data Protection Act, No. 9 of 2022 (PDF)](https://www.parliament.lk/uploads/acts/gbills/english/6242.pdf) | Opened |
| 32 | [DLA Piper — data protection laws of Sri Lanka](https://www.dlapiperdataprotection.com/index.html?t=law&c=LK) | Opened (also by Claude) — appears to predate the July 2026 order |
| 33 | [Wikipedia — PDPA (Sri Lanka)](https://en.wikipedia.org/wiki/Personal_Data_Protection_Act_(Sri_Lanka)) | Opened |
| 34 | [The Leveraged Years — commencement order 2498/16 (3 Aug 2026)](https://www.theleveragedyears.com/ai-regulation-news/sri-lanka-pdpa-commencement-order-gazette-2498-16-jan-2027) | Opened (also by Claude) |
| 35 | [Concentric — PDPA takes effect 1 January 2027 (20 Aug 2026)](https://concentric.ai/sri-lankas-pdpa-takes-effect-january-1-2027-what-global-enterprises-need-to-know/) | Opened (also by Claude, on the second attempt) |
| 36 | [Data Protection Authority — notice page](https://www.dpa.gov.lk/notice.php) | Opened — still showed the superseded 2025 notice |
| 37 | [Official gazette 2498/16 (PDF)](https://documents.gov.lk/view/egz/2026/7/2498-16_E.pdf) | 404, could not be opened |

### Payment gateways

| # | Source | Status |
| --- | --- | --- |
| 38 | [PayHere](https://www.payhere.lk/) | Official site |
| 39 | [PayHere — sandbox and testing](https://support.payhere.lk/sandbox-and-testing) | Opened |
| 40 | [PayHere — checkout API and mobile SDKs](https://support.payhere.lk/api-&-mobile-sdk/checkout-api) | Opened |
| 41 | [Onepay](https://www.onepay.lk/) | Official site |
| 42 | [Onepay — API documentation](https://docs.onepay.lk/api-documentation) | Opened |
| 43 | [DirectPay](https://www.directpay.lk/) | Official site |
| 44 | [DirectPay — FAQ](https://www.directpay.lk/faq) | Opened |
| 45 | [WEBXPAY](https://www.webxpay.com/) | Official site |
| 46 | [WEBXPAY — redirect integration guide](https://developers.webxpay.com/Guides/Redirect-Integration/redirect.html) | Opened |
| 47 | [PAYable](https://www.payable.lk/) | Official site |
| 48 | [PAYable — IPG merchant APIs (GitHub)](https://github.com/payable/ipg-merchant-apis) | Opened |
| 49 | [Genie Business](https://geniebusiness.lk/) | Official site |
| 50 | [Genie Business — developer page](https://geniebusiness.lk/developer) | Opened |

### Organiser example

| # | Source | Status |
| --- | --- | --- |
| 51 | [Agastra Events](https://agastra.lk/) | Opened |
| 52 | [Ultimate Band Show (Agastra)](https://ubs.agastra.lk/) | Opened |
| 53 | [YouTube — Ultimate Band Show 2022 Organized By Agastra Events](https://www.youtube.com/watch?v=wO8BSzPXMzI) | Via search |

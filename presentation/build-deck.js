// Builds presentation/Tezera Viva.pptx: the ATP presentation and viva deck (about 10 minutes, 5 speakers).
//
// Run (Git Bash, from the repo root), with pptxgenjs, sharp, react, react-dom and react-icons installed in
// some node_modules folder (they are not in this repo):
//   NODE_PATH=<that>/node_modules APPLY_THEME=<pptx skill>/scripts/apply_theme.js node presentation/build-deck.js
// Then run presentation/finish-deck.ps1 to embed the brand fonts and export slide PNGs for checking.
//
// Brand: brand/tezera-brand-manual.html, LIGHT palettes only (organiser, vendor, attendee), one per section.
// Fonts: Bricolage Grotesque (headings, 48pt optical size, ExtraBold) and Instrument Sans (body), files in
// presentation/fonts (SIL OFL).
// Projector rules (23 Nov 2026): labels 16pt+ (14 in dense diagrams), captions 12pt minimum; every text colour
// pair at least 7:1 (WCAG AAA), chart marks at least 4.5:1. Coral D77E70, pink F09EB4 and the pale greens never
// sit under text; text uses the darker shades and tints in PAL (ratios measured, see the comments there).
// Decluttered (23 Nov, user): one point and one diagram per slide, about 25 words a slide, diagrams drawn as
// native shapes; full sentences, extra facts and the speaker for each slide live in the notes.
// No speaker name tags and no eyebrow labels on slides.
// Facts come from the PRD v7, the proposal, the survey analysis, the personas, the work items page, the
// code repo's dev branch and a Jira dashboard export, all as of 23 Nov 2026. [Bracketed] text = the team fills in.

const path = require("path");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const React = require("react");
const RDS = require("react-dom/server");
const fa = require("react-icons/fa");

const HERE = __dirname;
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(HERE, "Tezera Viva.pptx");

// ---------- brand ----------
const HEAD = "+mj-lt"; // theme heading font
const BODY = "+mn-lt"; // theme body font
const THEME = {
  name: "Tezera",
  headFontFace: "Bricolage Grotesque 48pt ExtraBold",
  bodyFontFace: "Instrument Sans",
  colors: {
    dk1: "282829", lt1: "FFFFFF", dk2: "3E5466", lt2: "D7DFEA",
    accent1: "526C80", accent2: "70A98D", accent3: "D77E70",
    accent4: "70A992", accent5: "E5C76C", accent6: "658095",
    hlink: "3E5466", folHlink: "436555",
  },
};
// Light role palettes. Brand values: bg, text, p, a. Added for contrast (WCAG, measured):
//   muted  secondary text: ORG 7.4 on bg / 9.9 on white, VEN 8.9 / 11.0, ATT 7.8 / 8.8
//   deep   text-safe shade of the primary hue; white on it: ORG 7.9, VEN 8.2, ATT 7.8
//   tints  fills under dark text: coralTint 7.3, pinkTint 8.3, gold a 7.7, VEN p 7.5, VEN a 11.0
const PAL = {
  ORG: { bg: "D7DFEA", text: "282829", muted: "3A4450", card: "FFFFFF", tint: "EEF2F7",
    p: "526C80", deep: "3E5466", green: "436555", grey: "66727E" },
  VEN: { bg: "E9E7E2", text: "050316", muted: "3D3B46", card: "FFFFFF", tint: "F4F3F0",
    p: "70A992", deep: "385549", slate: "4A6478", a: "B6C3A7" },
  ATT: { bg: "F7F0ED", text: "392F3D", muted: "52465A", card: "FFFFFF", tint: "FBF7F5",
    p: "D77E70", deep: "76453E", coralTint: "E9B8B0", pinkTint: "F5C3D0", a: "E5C76C" },
};

const W = 13.333, H = 7.5, MX = 0.6, CW = W - 2 * MX; // content width 12.133
const TITLE_Y = 0.5;
const TOP = 1.75; // content starts here
const BOTTOM = 6.55; // content ends here (footer below)

// ---------- images ----------
const b64 = (buf) => "image/png;base64," + buf.toString("base64");
async function icon(name, color, px = 256) {
  const C = fa[name];
  if (!C) throw new Error("No icon " + name);
  const svg = RDS.renderToStaticMarkup(React.createElement(C, { color: "#" + color, size: px }));
  return b64(await sharp(Buffer.from(svg)).resize(px, px).png().toBuffer());
}
async function rounded(file, wpx, hpx, rpx, position = "top", cropRight = 0) {
  const mask = Buffer.from(`<svg width="${wpx}" height="${hpx}"><rect width="${wpx}" height="${hpx}" rx="${rpx}" ry="${rpx}"/></svg>`);
  const src = cropRight ? await sharp(file).metadata().then((m) => sharp(file).extract({ left: 0, top: 0, width: m.width - cropRight, height: m.height }).toBuffer()) : file;
  return b64(await sharp(src).resize(wpx, hpx, { fit: "cover", position }).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer());
}

// ---------- shape helpers ----------
let pres;
function box(slide, x, y, w, h, fill, opts = {}) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: opts.r ?? 0.14,
    fill: fill ? { color: fill } : { type: "none" },
    line: opts.line ? { color: opts.line, width: opts.lineW ?? 1.5, dashType: opts.dash ?? "solid" } : { type: "none" },
    shadow: opts.shadow ? { type: "outer", color: "000000", opacity: 0.14, blur: 8, offset: 2, angle: 90 } : undefined,
  });
}
function rect(slide, x, y, w, h, fill) {
  slide.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: fill }, line: { type: "none" } });
}
function text(slide, str, x, y, w, h, o = {}) {
  slide.addText(str, {
    x, y, w, h, isTextBox: true, margin: o.margin ?? 0,
    fontFace: o.head ? HEAD : BODY, fontSize: o.size ?? 16, color: o.color, bold: o.bold ?? false,
    align: o.align ?? "left", valign: o.valign ?? "top", lineSpacingMultiple: o.ls ?? 1.05,
    paraSpaceAfter: o.psa, italic: o.italic, fit: "none",
  });
}
function tile(slide, x, y, s, fill, line) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w: s, h: s, rectRadius: s * 0.24, fill: { color: fill }, line: line ? { color: line, width: 1.5 } : { type: "none" } });
}
function dot(slide, cx, cy, d, color, hollow = false) {
  slide.addShape(pres.ShapeType.ellipse, {
    x: cx - d / 2, y: cy - d / 2, w: d, h: d,
    fill: hollow ? { type: "none" } : { color }, line: { color, width: hollow ? 2.5 : 0.5 },
  });
}
function line(slide, x1, y1, x2, y2, color, o = {}) {
  slide.addShape(pres.ShapeType.line, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color, width: o.w ?? 2, dashType: o.dash ?? "solid", endArrowType: o.head ? "triangle" : undefined },
  });
}
const arrow = (slide, x1, y1, x2, y2, color, o = {}) => line(slide, x1, y1, x2, y2, color, { ...o, head: true });
async function iconTile(slide, x, y, s, fill, ic, icColor, ln) {
  tile(slide, x, y, s, fill, ln);
  const i = s * 0.54;
  slide.addImage({ data: await icon(ic, icColor), x: x + (s - i) / 2, y: y + (s - i) / 2, w: i, h: i });
}
const title = (slide, str) => slide.addText(str, { placeholder: "title" });

// ---------- build ----------
async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = "Tezera: ATP presentation and viva";
  pres.subject = "Every event in Sri Lanka, in one place.";
  pres.author = "Tezera team";
  pres.company = "Tezera";

  const logo = b64(await sharp(path.join(HERE, "assets/tezera-logo.svg"), { density: 220 }).resize(400, 400).png().toBuffer());
  const people = {};
  for (const n of ["damian", "danella", "navindu", "reshan", "yevan"]) {
    const f = path.join(HERE, "assets/team", n + ".png");
    people[n] = { big: await rounded(f, 460, 520, 52), dot: await rounded(f, 200, 200, 100), sq: await rounded(f, 240, 240, 56) };
  }
  // Screenshots keep their own aspect ratio (the sign-up capture loses a 40px scrollbar strip).
  const shot = async (n) => {
    const f = path.join(HERE, "assets/screens", n + ".png");
    const m = await sharp(f).metadata();
    const crop = n === "signup" ? 40 : 0, ratio = m.height / (m.width - crop);
    return { data: await rounded(f, 1600, Math.round(1600 * ratio), 28, "left", crop), ratio };
  };

  for (const [k, P] of Object.entries(PAL)) {
    pres.defineSlideMaster({
      title: k,
      background: { color: P.bg },
      objects: [
        { image: { x: MX, y: 6.9, w: 0.3, h: 0.3, data: logo } },
        { text: { text: "tezera", options: { x: MX + 0.4, y: 6.88, w: 1.6, h: 0.34, fontFace: HEAD, fontSize: 14, color: P.text, margin: 0, valign: "middle" } } },
        { placeholder: { options: { name: "title", type: "title", x: MX, y: TITLE_Y, w: CW, h: 0.8, fontFace: HEAD, fontSize: 36, color: P.text, valign: "top", align: "left", margin: 0, bold: false }, text: "" } },
      ],
      slideNumber: { x: W - MX - 0.8, y: 6.9, w: 0.8, h: 0.3, fontFace: BODY, fontSize: 13, color: P.muted, align: "right" },
    });
  }
  pres.defineSlideMaster({ title: "COVER", background: { color: PAL.ORG.bg }, objects: [] });

  const sec = (t) => pres.addSection({ title: t });
  const add = (master, section) => pres.addSlide({ masterName: master, sectionTitle: section });
  function cluster(slide, x0, y0, cell, s, rows) {
    rows.forEach((row, r) => row.forEach((c, i) => { if (c) tile(slide, x0 + i * cell, y0 + r * cell, s, c); }));
  }
  const TILE = { o: "526C80", od: "3E5466", v: "70A992", a: "D77E70", g: "E5C76C", k: "F09EB4", w: "FFFFFF", vs: "658095" };

  // ================= OPENING (organiser light) =================
  let S = "Opening";
  sec(S);
  {
    const s = add("COVER", S);
    const P = PAL.ORG;
    s.addImage({ data: logo, x: MX, y: 0.62, w: 0.95, h: 0.95 });
    text(s, "tezera", MX - 0.05, 2.0, 7.6, 1.9, { head: true, size: 128, color: P.text, valign: "middle" });
    text(s, "Every event in Sri Lanka, in one place.", MX, 4.0, 7.6, 0.6, { size: 28, color: P.text });
    text(s, "Agile Team Project  ·  Presentation and viva", MX, 4.75, 7.6, 0.4, { size: 18, color: P.muted });
    text(s, "Damian De Cruz   ·   Danella De Cruz   ·   Navindu Ranwatte   ·   Reshan Tennekoon   ·   Yevan Dewathanthriarachchi", MX, 6.4, CW, 0.4, { size: 16, color: P.text });
    const t = TILE;
    cluster(s, 8.45, 0.75, 1.07, 0.92, [
      [null, null, null, t.a],
      [null, null, t.o, t.w],
      [null, t.v, t.a, t.g],
      [t.w, t.od, t.k, t.v],
      [t.g, t.vs, t.o, t.a],
    ]);
    s.addNotes(
      "SPEAKER: Navindu (opening, about 15 seconds).\n" +
        "Good morning. We are Tezera: a mobile app and web portal that brings every event in Sri Lanka into one place. " +
        "Organisers hire vendors and freelancers, fill stalls and share the venue map; attendees find events and each other. " +
        "Five of us will each present one part, then we're happy to take questions."
    );
  }
  {
    const s = add("ORG", S);
    const P = PAL.ORG;
    title(s, "Five of us, five parts of the talk");
    const team = [
      ["navindu", "Navindu", "Ranwatte", "Development team", "Problem and solution"],
      ["danella", "Danella", "De Cruz", "Scrum Master", "Agile approach"],
      ["damian", "Damian", "De Cruz", "Product Owner", "Requirements"],
      ["yevan", "Yevan", "Dewathanthriarachchi", "Development team", "Architecture"],
      ["reshan", "Reshan", "Tennekoon", "Development team", "Demo and next steps"],
    ];
    const cw = 2.3, gap = (CW - 5 * cw) / 4;
    team.forEach(([id, first, last, role, part], i) => {
      const x = MX + i * (cw + gap);
      s.addImage({ data: people[id].big, x, y: TOP, w: cw, h: 2.6 });
      text(s, first, x, 4.5, cw, 0.42, { size: 22, bold: true, color: P.text });
      text(s, last, x, 4.92, cw, 0.32, { size: 15, color: P.text });
      text(s, role, x, 5.4, cw, 0.32, { size: 16, bold: true, color: P.deep });
      text(s, part, x, 5.76, cw, 0.36, { size: 16, color: P.muted });
    });
    s.addNotes(
      "SPEAKER: Navindu (about 15 seconds).\n" +
        "Damian is our Product Owner and Danella is our Scrum Master; Navindu, Reshan and Yevan are the development team. " +
        "The order on this slide is the order we'll speak in. " +
        "[Team: change the split here and in the notes if you divide the talk differently.]"
    );
  }

  // ================= 01 PROBLEM / SOLUTION / WOW (attendee light) =================
  S = "01 Problem and solution";
  sec(S);
  {
    // Broken-spoke diagram: the organiser in the middle, five channels that don't connect.
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, "One event, five separate channels");
    const cx = 3.95, cy = 4.3, rx = 2.6, ry = 1.65, ts = 1.0;
    const ch = [
      ["FaInstagram", "Instagram", -90],
      ["FaTicketAlt", "Ticket site", -18],
      ["FaHandshake", "Word of mouth", 54],
      ["FaMapMarkedAlt", "Paper layout", 126],
      ["FaWhatsapp", "WhatsApp", 198],
    ].map(([ic, l, a]) => [ic, l, cx + rx * Math.cos((a * Math.PI) / 180), cy + ry * Math.sin((a * Math.PI) / 180)]);
    for (const [, , x, y] of ch) line(s, cx, cy, x, y, P.muted, { w: 1.75, dash: "dash" });
    tile(s, cx - 0.75, cy - 0.75, 1.5, P.text);
    s.addImage({ data: await icon("FaUserTie", "FFFFFF"), x: cx - 0.3, y: cy - 0.55, w: 0.6, h: 0.6 });
    text(s, "Organiser", cx - 0.75, cy + 0.15, 1.5, 0.45, { size: 15, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
    for (const [ic, l, x, y] of ch) {
      await iconTile(s, x - ts / 2, y - ts / 2, ts, P.card, ic, P.deep, P.p);
      const above = y < cy - 1;
      text(s, l, x - 1.0, above ? y - ts / 2 - 0.4 : y + ts / 2 + 0.05, 2.0, 0.34, { size: 16, bold: true, color: P.text, align: "center" });
    }
    box(s, 8.3, 2.75, W - MX - 8.3, 3.1, P.coralTint);
    text(s, "17 of 26", 8.65, 3.0, 3.8, 1.0, { head: true, size: 60, color: P.text });
    text(s, "attendees missed an event because they heard too late", 8.65, 4.1, 3.75, 1.5, { size: 22, color: P.text });
    s.addNotes(
      "SPEAKER: Navindu (about 40 seconds).\n" +
        "Running a large event in Sri Lanka today means juggling five channels that don't talk to each other: promotion on Instagram, tickets on a separate site, hiring by word of mouth, a venue layout nobody sees before the day, and updates in WhatsApp groups.\n" +
        "Nothing carries over from one event to the next: a photographer who does great work at a festival has no record the next organiser can check.\n" +
        "Our surveys (4–8 Oct, 46 responses) backed this up: 17 of 26 attendees have missed an event because they heard too late; all 7 organisers find vendors through personal contacts; 9 of 13 vendors and freelancers name last-minute cancellations as a top problem.\n" +
        "If asked about sample size: the responses came from our own networks, so we treat them as signals, not market measurements."
    );
  }
  {
    // Hub: the four modules around one app.
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, "Four modules in one app and web portal");
    const hx = W / 2, hy = 4.15, hs = 1.6;
    const cw = 3.6, ch = 1.45;
    const mods = [
      ["FaCalendarAlt", "Events", "live status, sharing", MX + 0.4, 2.05],
      ["FaBriefcase", "Hiring", "bookings and stalls", W - MX - 0.4 - cw, 2.05],
      ["FaComments", "Community", "boards, chat, Q&A", MX + 0.4, 4.85],
      ["FaMapMarkedAlt", "Venue maps", "build, search, find", W - MX - 0.4 - cw, 4.85],
    ];
    for (const [, , , x, y] of mods) {
      const ex = x < hx ? x + cw : x, ey = y + ch / 2;
      line(s, ex, ey, hx + (x < hx ? -hs / 2 : hs / 2), hy + (y < hy ? -0.35 : 0.35), P.muted, { w: 2 });
    }
    tile(s, hx - hs / 2, hy - hs / 2, hs, P.card, P.p);
    s.addImage({ data: logo, x: hx - 0.55, y: hy - 0.65, w: 1.1, h: 1.1 });
    text(s, "App + web portal", hx - 1.5, hy + hs / 2 + 0.12, 3.0, 0.36, { size: 16, bold: true, color: P.text, align: "center" });
    for (const [ic, h, b, x, y] of mods) {
      box(s, x, y, cw, ch, P.card, { shadow: true });
      await iconTile(s, x + 0.25, y + (ch - 0.7) / 2, 0.7, P.p, ic, P.text);
      text(s, h, x + 1.15, y + 0.28, cw - 1.3, 0.45, { size: 22, bold: true, color: P.text });
      text(s, b, x + 1.15, y + 0.78, cw - 1.3, 0.4, { size: 16, color: P.muted });
    }
    s.addNotes(
      "SPEAKER: Navindu (about 35 seconds).\n" +
        "Tezera puts the four jobs in one mobile app and web portal: events and promotion (event pages with live status, a feed you can share to Instagram and WhatsApp), a hiring marketplace (booking requests or job posts with quotes, and stall slots), community (a board for every event, chat, announcements and public Q&A), and venue maps (organisers build them, attendees search them).\n" +
        "The modules feed each other: every event creates demand for photographers, DJs, stalls and sound; completed jobs create reviews on both sides; reviews let the next organiser hire on track record instead of contacts; and the event boards keep people talking until the next event.\n" +
        "Ticketing, seats and QR entry are deliberately out of the ATP release: they come first after it."
    );
  }
  {
    // Coverage grid.
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, "Others cover one part of an event");
    const cols = [["FaBriefcase", "Hiring"], ["FaStar", "Reviews"], ["FaComments", "Community"], ["FaMapMarkedAlt", "Maps"]];
    // 2 offered, 1 partly, 0 not found. Grouped from proposal page 6.
    const rows = [
      ["Social media", [1, 1, 2, 0]],
      ["Sri Lankan ticket sites", [0, 0, 1, 1]],
      ["Wedding and DJ directories", [1, 1, 0, 0]],
      ["Eventeny (US)", [1, 0, 0, 2]],
      ["Tezera", [2, 2, 2, 2]],
    ];
    const lx = MX, lw = 3.6, cwid = 1.35, gx = lx + lw, rowH = 0.62, hy = TOP, ry0 = TOP + 0.9;
    for (let c = 0; c < cols.length; c++) {
      const x = gx + c * cwid;
      s.addImage({ data: await icon(cols[c][0], P.deep), x: x + cwid / 2 - 0.18, y: hy, w: 0.36, h: 0.36 });
      text(s, cols[c][1], x, hy + 0.45, cwid, 0.36, { size: 16, bold: true, color: P.text, align: "center" });
    }
    rows.forEach(([n, v], r) => {
      const y = ry0 + r * (rowH + 0.12), us = r === rows.length - 1;
      box(s, lx, y, lw + cols.length * cwid, rowH, us ? P.a : P.card, { r: 0.1 });
      text(s, n, lx + 0.25, y, lw - 0.3, rowH, { size: 18, bold: us, color: P.text, valign: "middle" });
      v.forEach((k, c) => { if (k) dot(s, gx + c * cwid + cwid / 2, y + rowH / 2, 0.3, us ? P.text : P.deep, k === 1); });
    });
    const ly = 6.3; // grid ends at ry0 + 5 * 0.74 = 6.35 - 0.12
    dot(s, MX + 0.12, ly + 0.15, 0.22, P.deep);
    text(s, "offered", MX + 0.35, ly, 1.0, 0.3, { size: 14, color: P.text, valign: "middle" });
    dot(s, MX + 1.45, ly + 0.15, 0.22, P.deep, true);
    text(s, "partly", MX + 1.68, ly, 1.0, 0.3, { size: 14, color: P.text, valign: "middle" });
    text(s, "blank: not found", MX + 2.75, ly, 2.4, 0.3, { size: 14, color: P.muted, valign: "middle" });
    const tx = gx + cols.length * cwid + 0.45;
    box(s, tx, ry0, W - MX - tx, 5 * (rowH + 0.12) - 0.12, P.text);
    text(s, "Nobody else does all four in one place.", tx + 0.3, ry0, W - MX - tx - 0.6, 5 * (rowH + 0.12) - 0.12, { head: true, size: 26, color: "FFFFFF", valign: "middle" });
    s.addNotes(
      "SPEAKER: Navindu (about 30 seconds).\n" +
        "We checked today's workarounds and the Sri Lankan and global platforms (desk research, Sept–Oct 2026). Social media gives some community but no structured hiring or reviews. Sri Lankan ticket sites (MyTickets, TicketsMinistry, ClickTickets, BookMyShow LK) stop at tickets, with only partial community or maps. Wedding and DJ directories (WedMeGood, WeddingArcade, DJBooking.lk) stop at listings. Eventeny in the US is the closest match, but it has no provider reviews or community. Eventbrite and Meetup cover tickets or groups only.\n" +
        "Nobody combines hiring, verified reviews, community and venue maps. Ticketing is 'Later' for us on purpose: local sites already do it well."
    );
  }
  {
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, "The WOW factor: a venue map you can search");
    const mx = MX, my = TOP, mw = 6.6, mh = 4.8;
    box(s, mx, my, mw, mh, P.card, { shadow: true });
    box(s, mx + 0.3, my + 0.28, mw - 0.6, 0.6, P.bg, { r: 0.3, line: "D9CBC5", lineW: 1 });
    s.addImage({ data: await icon("FaSearch", P.text), x: mx + 0.52, y: my + 0.45, w: 0.26, h: 0.26 });
    text(s, "kottu", mx + 0.95, my + 0.28, 2, 0.6, { size: 18, bold: true, color: P.text, valign: "middle" });
    const zone = (t, x, y, w, h, fill) => {
      box(s, mx + x, my + y, w, h, fill, { r: 0.08, line: "C9B8B1", lineW: 1 });
      if (t) text(s, t, mx + x + 0.12, my + y + 0.08, w - 0.24, 0.32, { size: 14, bold: true, color: P.text });
    };
    zone("Main stage", 0.3, 1.1, 2.5, 1.45, P.pinkTint);
    zone("Craft stalls", 3.0, 1.1, 3.3, 1.45, P.tint);
    zone("Food court", 0.3, 2.75, 4.4, 1.7, P.tint);
    zone("Toilets", 4.9, 2.75, 1.4, 0.78, P.tint);
    zone("Entrance", 4.9, 3.67, 1.4, 0.78, "F6E3A8");
    for (let i = 0; i < 6; i++) {
      const x = 0.45 + i * 0.69, hit = i === 3;
      box(s, mx + x, my + 3.2, 0.58, 0.58, hit ? P.text : "FFFFFF", { r: 0.08, line: hit ? undefined : "B9A7A0", lineW: 1 });
      text(s, "F" + (i + 1), mx + x, my + 3.2, 0.58, 0.58, { size: 14, bold: true, color: hit ? "FFFFFF" : P.text, align: "center", valign: "middle" });
    }
    for (let i = 0; i < 4; i++) box(s, mx + 3.25 + i * 0.76, my + 1.6, 0.6, 0.6, "FFFFFF", { r: 0.08, line: "B9A7A0", lineW: 1 });
    box(s, mx + 1.8, my + 1.92, 2.75, 0.82, P.text, { r: 0.1 });
    text(s, "F4 · Kottu corner\nLKR 1,200", mx + 1.95, my + 1.94, 2.5, 0.78, { size: 15, bold: true, color: "FFFFFF", valign: "middle" });
    arrow(s, mx + 2.9, my + 2.74, mx + 2.9, my + 3.16, P.text);
    text(s, "Example data", mx + 0.3, my + mh - 0.32, 3, 0.26, { size: 12, color: P.muted });
    const pts = [
      ["FaKeyboard", "Type what you want"],
      ["FaStore", "See the stall and price"],
      ["FaMapMarkerAlt", "Find it on the map"],
      ["FaDraftingCompass", "Built by the organiser"],
    ];
    const px = 7.75, pw = W - MX - px;
    for (let i = 0; i < pts.length; i++) {
      const [ic, h] = pts[i];
      const y = TOP + 0.35 + i * 1.08;
      await iconTile(s, px, y, 0.7, i === 3 ? P.a : P.p, ic, P.text);
      text(s, h, px + 0.95, y, pw - 0.95, 0.7, { size: 22, bold: true, color: P.text, valign: "middle" });
    }
    s.addNotes(
      "SPEAKER: Navindu (about 35 seconds).\n" +
        "Our WOW factor is the interactive venue map. 18 of 26 attendees have struggled to find something at an event, and only 1 of 7 organisers shares a digital map.\n" +
        "On Tezera, an attendee types 'kottu', sees which stall sells it and at what price, and finds it on the map. Organisers build that map themselves: upload a floor plan, snap zones and stalls into place, to scale. An AI-drafted first version is a stretch goal (a Could).\n" +
        "Two more things make Tezera different: reviews only come from completed bookings, in both directions, so reputation is earned; and money goes straight to each payee's own merchant account, so Tezera never holds funds. In the ATP, payments run in PayHere's sandbox only.\n" +
        "Hand over to Danella."
    );
  }

  // ================= 02 AGILE (vendor light) =================
  S = "02 Agile approach";
  sec(S);
  {
    const s = add("VEN", S);
    const P = PAL.VEN;
    title(s, "Scrum, with clear roles");
    const roles = [
      ["damian", "Damian", "Product Owner"],
      ["danella", "Danella", "Scrum Master"],
      [null, "Navindu, Reshan, Yevan", "Development team"],
    ];
    roles.forEach(([id, n, r], i) => {
      const y = TOP + 0.1 + i * 1.4;
      box(s, MX, y, 5.6, 1.2, P.card, { shadow: true });
      if (id) s.addImage({ data: people[id].sq, x: MX + 0.2, y: y + 0.18, w: 0.84, h: 0.84 });
      else ["navindu", "reshan", "yevan"].forEach((p, j) => s.addImage({ data: people[p].dot, x: MX + 0.1 + j * 0.32, y: y + 0.35, w: 0.5, h: 0.5, rounding: true }));
      text(s, n, MX + 1.3, y + 0.2, 4.2, 0.42, { size: 20, bold: true, color: P.text });
      text(s, r, MX + 1.3, y + 0.64, 4.2, 0.36, { size: 17, bold: true, color: P.deep });
    });
    const cx = 9.65, cy = 3.6;
    box(s, cx - 0.98, cy - 0.62, 1.96, 1.24, P.text, { r: 0.18 });
    text(s, "Sprint\n[x] weeks", cx - 0.98, cy - 0.62, 1.96, 1.24, { size: 18, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
    const ev = [
      ["Planning", cx, cy - 1.6, P.p],
      ["Stand-up", cx + 2.05, cy, P.a],
      ["Review", cx, cy + 1.6, P.p],
      ["Retro", cx - 2.05, cy, P.a],
    ];
    ev.forEach(([t, x, y, c]) => {
      box(s, x - 0.9, y - 0.36, 1.8, 0.72, c, { r: 0.36 });
      text(s, t, x - 0.9, y - 0.36, 1.8, 0.72, { size: 18, bold: true, color: P.text, align: "center", valign: "middle" });
    });
    const k = P.deep;
    arrow(s, cx + 0.9, cy - 1.5, cx + 1.7, cy - 0.4, k);
    arrow(s, cx + 1.7, cy + 0.4, cx + 0.9, cy + 1.5, k);
    arrow(s, cx - 0.9, cy + 1.5, cx - 1.7, cy + 0.4, k);
    arrow(s, cx - 1.7, cy - 0.4, cx - 0.9, cy - 1.5, k);
    const tools = [["FaJira", "Jira", 1.35], ["FaGithub", "GitHub", 1.6], ["FaGoogleDrive", "Google Docs", 2.1], ["FaFigma", "Figma", 1.4]];
    let tx = MX;
    for (const [ic, t, w] of tools) {
      box(s, tx, 6.05, w, 0.5, P.card, { r: 0.25 });
      s.addImage({ data: await icon(ic, P.slate), x: tx + 0.16, y: 6.17, w: 0.26, h: 0.26 });
      text(s, t, tx + 0.52, 6.05, w - 0.6, 0.5, { size: 16, bold: true, color: P.text, valign: "middle" });
      tx += w + 0.15;
    }
    text(s, "[n] sprints so far", 9.6, 6.05, W - MX - 9.6, 0.5, { size: 16, color: P.muted, align: "right", valign: "middle" });
    s.addNotes(
      "SPEAKER: Danella (about 45 seconds).\n" +
        "We run Scrum. Damian is the Product Owner: he owns the PRD and decides the order of the backlog, and accepts finished work. I'm the Scrum Master: I run the sprint events and the Jira board, and clear blockers. Navindu, Reshan and Yevan form the development team: they plan, build and test each sprint's work.\n" +
        "Each sprint is [x] weeks: planning, daily stand-ups, a review and a retrospective. [Fill in: sprint length, how many sprints so far, when and where stand-ups happen.]\n" +
        "The backlog lives in Jira (space TES), code goes through GitHub pull requests into dev and then main, the report is a Google Doc whose version history we can show, and the high-fidelity screens are in Figma."
    );
  }
  {
    const s = add("VEN", S);
    const P = PAL.VEN;
    title(s, "From a brief to running code in eight weeks");
    const ms = [
      ["30 Sep", "Brief, PRD v1"],
      ["4–8 Oct", "3 surveys"],
      ["15 Oct", "Backlog, first code"],
      ["22 Oct", "Jira board"],
      ["28 Oct", "Wireframes"],
      ["20 Nov", "Sign-in built"],
      ["23 Nov", "Docs match code"],
    ];
    const ly = TOP + 0.72, seg = CW / ms.length;
    s.addShape(pres.ShapeType.line, { x: MX + seg / 2, y: ly, w: CW - seg, h: 0, line: { color: P.deep, width: 2.5 } });
    ms.forEach(([d, l], i) => {
      const x = MX + i * seg;
      text(s, d, x, TOP, seg, 0.4, { size: 17, bold: true, color: P.text, align: "center" });
      tile(s, x + seg / 2 - 0.15, ly - 0.15, 0.3, i % 2 ? P.slate : P.deep);
      text(s, l, x + 0.05, ly + 0.3, seg - 0.1, 0.7, { size: 16, color: P.muted, align: "center" });
    });
    const st = [["63", "Jira items done"], ["23", "PRs merged"], ["101", "commits on dev"]];
    st.forEach(([n, l], i) => {
      const x = MX + i * 2.15;
      box(s, x, 3.95, 1.98, 2.4, i === 0 ? P.p : P.card, { shadow: i !== 0 });
      text(s, n, x + 0.25, 4.15, 1.6, 0.95, { head: true, size: 50, color: P.text });
      text(s, l, x + 0.25, 5.2, 1.6, 0.8, { size: 17, color: P.text });
    });
    box(s, 7.2, 3.95, W - MX - 7.2, 2.4, P.card, { shadow: true });
    s.addChart(pres.ChartType.bar, [{ name: "Jira items assigned", labels: ["Yevan", "Damian", "Danella", "Reshan", "Navindu"], values: [18, 13, 11, 10, 9] }], {
      x: 7.35, y: 4.02, w: W - MX - 7.5, h: 2.26, barDir: "bar", catAxisOrientation: "maxMin",
      chartColors: [P.slate], showValue: true, dataLabelPosition: "outEnd", dataLabelColor: P.text, dataLabelFontSize: 14, dataLabelFontFace: BODY, dataLabelFontBold: true,
      showTitle: true, title: "Jira items per person", titleFontSize: 16, titleColor: P.text, titleFontFace: BODY,
      catAxisLabelColor: P.text, catAxisLabelFontSize: 14, catAxisLabelFontFace: BODY, valAxisHidden: true,
      valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 55, catAxisLineShow: false,
    });
    s.addNotes(
      "SPEAKER: Danella (about 45 seconds).\n" +
        "Here's how the work has gone. 30 Sep: project brief and PRD version 1. 4–8 Oct: three surveys, 46 responses. 15 Oct: personas, user stories and the backlog (PRD version 6), and the first code commit the same day. 22 Oct: the backlog imported into Jira. 28 Oct: organiser portal wireframes. 18–20 Nov: sign-in and the database built, and the stack fixed in PRD version 7. 23 Nov: every document checked against the code.\n" +
        "Jira shows 63 items done; the code repo has 23 merged pull requests and 101 commits on the dev branch. The chart is Jira items assigned per person (from the Jira dashboard export, 23 Nov; 646 items in all, most of the backlog not yet assigned), so the work is spread across all five of us.\n" +
        "Be ready to open: the Jira board, the Google Doc version history, and the GitHub repo. Hand over to Damian."
    );
  }

  // ================= 03 REQUIREMENTS (organiser light) =================
  S = "03 Requirements and backlog";
  sec(S);
  {
    const s = add("ORG", S);
    const P = PAL.ORG;
    title(s, "Requirements traced back to the surveys");
    const flow = [["46", "survey answers"], ["12", "changes agreed"], ["105", "requirements"], ["20", "use cases"]];
    const fw = (CW - 3 * 0.5) / 4, fy = TOP + 0.15, fh = 1.85;
    flow.forEach(([n, l], i) => {
      const x = MX + i * (fw + 0.5), last = i === 3;
      box(s, x, fy, fw, fh, last ? P.deep : P.card, { shadow: !last });
      text(s, n, x + 0.3, fy + 0.25, fw - 0.5, 0.85, { head: true, size: 48, color: last ? "FFFFFF" : P.deep, valign: "middle" });
      text(s, l, x + 0.3, fy + 1.2, fw - 0.5, 0.42, { size: 20, color: last ? "FFFFFF" : P.text });
      if (i < 3) arrow(s, x + fw + 0.08, fy + fh / 2, x + fw + 0.42, fy + fh / 2, P.deep, { w: 2.5 });
    });
    // MoSCoW as one segmented bar
    const pri = [["Must", 66, P.deep], ["Should", 21, P.green], ["Could", 6, P.p], ["Later", 12, P.grey]];
    const total = pri.reduce((a, p) => a + p[1], 0), by = 4.75, bh = 1.0;
    text(s, "Priority of the 105 requirements", MX, 4.2, 8, 0.42, { size: 18, bold: true, color: P.text });
    let bx = MX;
    pri.forEach(([n, v, c], i) => {
      const w = (CW * v) / total;
      rect(s, bx, by, w - (i < pri.length - 1 ? 0.04 : 0), bh, c);
      text(s, String(v), bx, by, w - 0.04, bh, { size: 22, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
      text(s, n, bx, by + bh + 0.1, Math.max(w, 1.0), 0.4, { size: 17, bold: true, color: P.text, align: w < 1.0 ? "left" : "center" });
      bx += w;
    });
    s.addNotes(
      "SPEAKER: Damian (about 40 seconds).\n" +
        "Every requirement traces back to evidence. 46 survey responses gave us 12 recommendations (R1 to R12), all accepted by the team on 15 October. The PRD now holds 105 requirements, each with a MoSCoW priority: 66 Must, 21 Should, 6 Could and 12 Later (mostly ticketing, after the ATP). The SRS turns them into 67 functional and 21 non-functional requirements and 20 use cases.\n" +
        "Five Musts that show the product: AC-01 one verified role per account, 16 and over; EV-02 organisers can postpone or cancel and everyone going is told; HR-03 booking requests carry the full brief and budget; RV-02 reviews open only once a booking is marked complete; VM-10 attendees search stalls by item and find them on the map."
    );
  }
  {
    const s = add("ORG", S);
    const P = PAL.ORG;
    title(s, "Eight personas; three we design for first");
    const per = [
      ["TF", "Tharushi", "Attendee", PAL.ATT.coralTint, PAL.ATT.text, "Wants live updates on the day", "17 of 26 missed an event"],
      ["AW", "Ashan", "Organiser", P.deep, "FFFFFF", "Fills stalls by phone and spreadsheet", "1 of 7 shares a map"],
      ["NS", "Nuwan", "Photographer", PAL.VEN.p, PAL.VEN.text, "Waited three months to be paid", "11 of 13 want terms first"],
    ];
    // Primary personas: larger cards.
    const pw = (CW - 2 * 0.3) / 3, y = TOP, ph = 2.8;
    per.forEach(([ini, n, r, c, tc, d, e], i) => {
      const x = MX + i * (pw + 0.3);
      box(s, x, y, pw, ph, P.card, { shadow: true });
      tile(s, x + 0.3, y + 0.3, 0.8, c);
      text(s, ini, x + 0.3, y + 0.3, 0.8, 0.8, { head: true, size: 22, color: tc, align: "center", valign: "middle" });
      text(s, n, x + 1.3, y + 0.3, pw - 1.5, 0.45, { size: 24, bold: true, color: P.text });
      text(s, r, x + 1.3, y + 0.76, pw - 1.5, 0.36, { size: 17, color: P.muted });
      text(s, d, x + 0.3, y + 1.3, pw - 0.6, 0.75, { size: 18, color: P.text });
      box(s, x + 0.2, y + 2.05, pw - 0.4, 0.55, P.tint, { r: 0.1 });
      text(s, e, x + 0.4, y + 2.05, pw - 0.8, 0.55, { size: 16, bold: true, color: P.text, valign: "middle" });
    });
    // The other five: smaller cards, one line each.
    const sec2 = [
      ["KP", "Kavindu", "Attendee", PAL.ATT.coralTint, PAL.ATT.text, "Checks events are real"],
      ["DJ", "Dilini", "Organiser", P.deep, "FFFFFF", "Needs reliable providers"],
      ["FR", "Fathima", "Vendor", PAL.VEN.p, PAL.VEN.text, "Wants terms in writing"],
      ["PR", "Pradeep", "Vendor", PAL.VEN.p, PAL.VEN.text, "Needs technical details"],
      ["SH", "Sanduni", "Admin", P.text, "FFFFFF", "Keeps accounts safe"],
    ];
    const cw = (CW - 4 * 0.2) / 5, sy = y + ph + 0.3, sh = BOTTOM - sy;
    sec2.forEach(([ini, n, r, c, tc, d], i) => {
      const x = MX + i * (cw + 0.2);
      box(s, x, sy, cw, sh, P.card, { r: 0.12 });
      tile(s, x + 0.2, sy + 0.2, 0.55, c);
      text(s, ini, x + 0.2, sy + 0.2, 0.55, 0.55, { size: 14, bold: true, color: tc, align: "center", valign: "middle" });
      text(s, n, x + 0.88, sy + 0.16, cw - 1.0, 0.34, { size: 17, bold: true, color: P.text });
      text(s, r, x + 0.88, sy + 0.48, cw - 1.0, 0.3, { size: 13, color: P.muted });
      text(s, d, x + 0.2, sy + 0.95, cw - 0.4, sh - 1.05, { size: 16, color: P.text });
    });
    s.addNotes(
      "SPEAKER: Damian (about 40 seconds).\n" +
        "We turned the survey segments into eight personas: two consumers, two organisers, three vendors and freelancers, and an admin. When needs conflict, we design for the three primaries first.\n" +
        "Tharushi Fernando, the weekend regular, finds events on Instagram, plans in WhatsApp and wants live updates when things run late; 17 of 26 attendees have missed an event by hearing too late. Ashan Wijesinghe, the festival organiser, fills stalls by phone and spreadsheet and shares the layout only through signs on the day; only 1 of 7 organisers shares a digital map. Nuwan Silva, a freelance photographer, gets work by referral and has waited three months to be paid; 11 of 13 providers want payment terms before anything else.\n" +
        "The other five, along the bottom: Kavindu Perera, the careful planner, checks an event and its organiser are real before paying. Dilini Jayawardena plans weddings and corporate events and needs reliable providers beyond her own contacts. Fathima Rizvi runs a food stall and wants stall fees and terms in writing. Pradeep Rajaratnam supplies sound and lighting and needs technical details and timings before he quotes. Sanduni Herath is the trust and safety admin: she checks verification documents and clears the report queue.\n" +
        "Names and ages are invented, marked 'assumed' in the personas document; goals and evidence are survey counts. Fathima's and Sanduni's personas rest on thin evidence (few caterers surveyed; admins not surveyed)."
    );
  }
  {
    const s = add("ORG", S);
    const P = PAL.ORG;
    title(s, "A backlog of 15 epics, Musts first");
    const ep = [
      ["Foundations", 169, "must"], ["Accounts", 85, "must"], ["Events", 123, "must"], ["Promotion feed", 47, "must"],
      ["Hiring", 166, "must"], ["Stalls", 39, "must"], ["Reviews", 73, "must"], ["Venue maps", 157, "must"],
      ["Community", 42, "must"], ["Messaging", 55, "must"], ["Dashboard", 27, "must"], ["Admin", 65, "must"],
      ["Quality", 44, "must"], ["Payments (Should)", 73, "should"],
    ];
    box(s, MX, TOP, 7.75, BOTTOM - TOP, P.card, { shadow: true });
    s.addChart(pres.ChartType.bar, [{ name: "Story points", labels: ep.map((e) => e[0]), values: ep.map((e) => e[1]) }], {
      x: MX + 0.1, y: TOP + 0.08, w: 7.55, h: BOTTOM - TOP - 0.16, barDir: "bar", catAxisOrientation: "maxMin",
      chartColors: ep.map((e) => (e[2] === "must" ? P.deep : P.green)), showValue: true, dataLabelPosition: "outEnd", dataLabelColor: P.text, dataLabelFontSize: 14, dataLabelFontFace: BODY, dataLabelFontBold: true,
      showTitle: true, title: "Story points per epic", titleFontSize: 16, titleColor: P.text, titleFontFace: BODY,
      catAxisLabelColor: P.text, catAxisLabelFontSize: 15, catAxisLabelFontFace: BODY, valAxisHidden: true,
      valGridLine: { style: "none" }, catGridLine: { style: "none" }, showLegend: false, barGapWidthPct: 35,
    });
    const rx = 8.75, rw = W - MX - rx;
    box(s, rx, TOP, rw, 2.3, P.deep);
    text(s, "1,165", rx + 0.35, TOP + 0.25, rw - 0.7, 1.0, { head: true, size: 60, color: "FFFFFF" });
    text(s, "story points", rx + 0.35, TOP + 1.35, rw - 0.7, 0.5, { size: 20, color: "FFFFFF" });
    const facts = [["FaLayerGroup", "95 stories"], ["FaTasks", "474 tasks"], ["FaJira", "Live in Jira"]];
    for (let i = 0; i < facts.length; i++) {
      const y = 4.45 + i * 0.72;
      await iconTile(s, rx, y, 0.52, P.card, facts[i][0], P.deep);
      text(s, facts[i][1], rx + 0.75, y, rw - 0.75, 0.52, { size: 20, bold: true, color: P.text, valign: "middle" });
    }
    s.addNotes(
      "SPEAKER: Damian (about 40 seconds).\n" +
        "The backlog has 15 epics, 95 stories and 474 tasks: 1,165 story points, proposed on a Fibonacci scale from 1 to 8 (a 5 is about one data model with its endpoints, checks and tests). Every user story is in it, plus the PRD requirements that had no story yet and the set-up work the features depend on.\n" +
        "Thirteen epics are Must. Sandbox payments (green) is a Should, and the ticketing epic is planned for after the ATP. We build in thin end-to-end slices: foundations first, then publish and find an event, then hiring.\n" +
        "It's been live in Jira (space TES) since 22 October; we can open the board. Hand over to Yevan."
    );
  }

  // ================= 04 ARCHITECTURE (vendor light) =================
  S = "04 Architecture and design";
  sec(S);
  {
    const s = add("VEN", S);
    const P = PAL.VEN;
    title(s, "Serverless on AWS: one API, built in slices");
    const built = { line: P.deep, lineW: 2.5 };
    const plan = { line: P.muted, lineW: 1.75, dash: "dash" };
    const node = async (x, y, w, h, ic, head, sub, o) => {
      box(s, x, y, w, h, o === plan ? null : P.card, o);
      s.addImage({ data: await icon(ic, o === plan ? P.muted : P.deep), x: x + 0.22, y: y + 0.24, w: 0.4, h: 0.4 });
      text(s, head, x + 0.75, y + 0.18, w - 0.9, 0.5, { size: 19, bold: true, color: P.text, valign: "middle" });
      text(s, sub, x + 0.22, y + 0.78, w - 0.4, h - 0.85, { size: 16, color: P.muted });
    };
    const r1 = TOP, r2 = TOP + 1.85, nh = 1.4;
    const c1 = MX, c2 = 3.8, c3 = 7.0, c4 = 10.2, nw = 2.65, nw4 = W - MX - c4;
    await node(c1, r1, nw, nh, "FaMobileAlt", "Mobile app", "Flutter · planned", plan);
    await node(c1, r2, nw, nh, "FaDesktop", "Web portal", "Next.js", built);
    await node(c2, r1, nw, nh, "FaDoorOpen", "API Gateway", "HTTP API", built);
    await node(c2, r2, nw, nh, "FaUserLock", "Cognito", "sign-in, roles", built);
    await node(c3, r1, nw, nh * 2 + 0.45, "FaServer", "NestJS API", "one Lambda\n\nchecks token and role", built);
    await node(c4, r1, nw4, nh, "FaDatabase", "PostgreSQL", "Prisma", built);
    await node(c4, r2, nw4, nh, "FaPlusCircle", "Planned", "realtime, push, payments", plan);
    const k = P.text, m1 = r1 + nh / 2, m2 = r2 + nh / 2;
    arrow(s, c1 + nw + 0.03, m1, c2 - 0.03, m1, P.muted, { dash: "dash" });
    arrow(s, c1 + nw + 0.03, r2 + 0.35, c2 - 0.03, r1 + nh - 0.3, k);
    arrow(s, c1 + nw + 0.03, m2, c2 - 0.03, m2, k);
    arrow(s, c2 + nw + 0.03, m1, c3 - 0.03, m1, k);
    arrow(s, c2 + nw + 0.03, m2, c3 - 0.03, m2, k);
    arrow(s, c3 + nw + 0.03, m1, c4 - 0.03, m1, k);
    arrow(s, c3 + nw + 0.03, m2, c4 - 0.03, m2, P.muted, { dash: "dash" });
    // Delivery pipeline
    const py = 5.4, ph = 0.6;
    const steps = [["FaGithub", "GitHub", 1.7], ["FaCheckCircle", "CI checks", 1.95], ["FaCloudUploadAlt", "AWS CDK + Amplify", 3.05], ["FaGlobe", "www + dev sites", 2.6]];
    let px = MX;
    for (let i = 0; i < steps.length; i++) {
      const [ic, t, w] = steps[i];
      box(s, px, py, w, ph, P.a, { r: 0.3 });
      s.addImage({ data: await icon(ic, P.text), x: px + 0.18, y: py + 0.16, w: 0.28, h: 0.28 });
      text(s, t, px + 0.55, py, w - 0.65, ph, { size: 16, bold: true, color: P.text, valign: "middle" });
      if (i < steps.length - 1) arrow(s, px + w + 0.04, py + ph / 2, px + w + 0.3, py + ph / 2, P.text);
      px += w + 0.34;
    }
    line(s, MX, 6.35, MX + 0.5, 6.35, P.deep, { w: 2.5 });
    text(s, "built", MX + 0.6, 6.2, 0.8, 0.3, { size: 14, color: P.text, valign: "middle" });
    line(s, MX + 1.5, 6.35, MX + 2.0, 6.35, P.muted, { w: 1.75, dash: "dash" });
    text(s, "planned", MX + 2.1, 6.2, 1.2, 0.3, { size: 14, color: P.text, valign: "middle" });
    s.addNotes(
      "SPEAKER: Yevan (about 45 seconds).\n" +
        "Tezera is serverless on AWS in the Mumbai region (ap-south-1). The web portal is Next.js 16 on Amplify Hosting; the mobile app will be Flutter. Both call one NestJS API that runs as a single Lambda (Node 24, ARM64) behind an API Gateway HTTP API. Its 5 routes today: /, /health, /health/db, /me and /organiser/ping.\n" +
        "Sign-in is Amazon Cognito: email with a password, or phone with an SMS code every time, and one Cognito group per role. The API's guards check the token and the group on every route. The main database is PostgreSQL 16 through Prisma.\n" +
        "Solid boxes are built on the dev branch; dashed ones are chosen but not built yet: DynamoDB for chat and the feed, WebSockets for live updates, SQS, S3 + CloudFront, FCM push, SES email, the PayHere sandbox and Bedrock for the AI map draft.\n" +
        "Delivery: GitHub Actions runs CI on every pull request; AWS CDK deploys the API through an OIDC role; Amplify builds each branch's own site and Cognito pool: main → www.tezera.lk, dev → dev.tezera.lk.\n" +
        "Known gap, if asked: the deployed Lambda doesn't yet get its database URL and Cognito IDs; a fix is written and waiting to merge, and the database host isn't chosen."
    );
  }
  {
    const s = add("VEN", S);
    const P = PAL.VEN;
    title(s, "20 use cases across three UML diagrams");
    const iw = 6.8, ih = iw / 1.513;
    box(s, MX, TOP, iw + 0.3, ih + 0.3, "FFFFFF", { shadow: true });
    s.addImage({ path: path.join(ROOT, "report/figures/fig-uc-hiring-stalls-payments.png"), x: MX + 0.15, y: TOP + 0.15, w: iw, h: ih });
    const rx = MX + iw + 0.75, rw = W - MX - rx;
    const d = [["Events and maps", false], ["Hiring and payments", true], ["Accounts and admin", false]];
    d.forEach(([t, on], i) => {
      const y = TOP + 0.1 + i * 0.8;
      box(s, rx, y, rw, 0.62, on ? P.deep : P.card, { r: 0.31 });
      text(s, t, rx + 0.28, y, rw - 0.5, 0.62, { size: 18, bold: on, color: on ? "FFFFFF" : P.text, valign: "middle" });
    });
    box(s, rx, 4.35, rw, 1.9, P.a, { r: 0.14 });
    text(s, "Both hiring routes end in one step: confirm a booking with terms.", rx + 0.28, 4.35, rw - 0.5, 1.9, { size: 19, bold: true, color: P.text, valign: "middle" });
    s.addNotes(
      "SPEAKER: Yevan (about 35 seconds).\n" +
        "Our SRS describes 20 use cases, drawn in three UML use case diagrams: events and venue maps; hiring, stalls and test payments (shown); and accounts, community and admin. In this one an organiser can send a direct booking request (UC-007) or post a job and compare quotes (UC-008); both include UC-019, confirm a booking with terms, so the brief, the price and the payment terms are always recorded. Making a test payment (UC-009) extends that, through the PayHere sandbox, an external system. Stall applications are UC-010.\n" +
        "Every use case has a full description in the report, Tables 16.1 to 16.20, and the use cases page links each one to its PRD rows and user stories. Other diagrams in the portfolio: the stakeholder onion model, the actor diagram and the architecture diagram.\n" +
        "The diagram's own labels are small on a projector: point to the ovals as you talk, or open report/figures/fig-uc-hiring-stalls-payments.png full screen."
    );
  }
  {
    const s = add("VEN", S);
    const P = PAL.VEN;
    title(s, "Sign-up, step by step, as it runs today");
    const lanes = [["User", 1.45], ["Web portal", 3.95], ["Cognito", 6.65], ["NestJS API", 9.35], ["PostgreSQL", 11.88]];
    const laneTop = 1.6, laneEnd = 6.62;
    lanes.forEach(([n, x]) => {
      box(s, x - 1.0, laneTop, 2.0, 0.55, P.card, { line: P.deep, lineW: 1.5 });
      text(s, n, x - 1.0, laneTop, 2.0, 0.55, { size: 16, bold: true, color: P.text, align: "center", valign: "middle" });
      s.addShape(pres.ShapeType.line, { x, y: laneTop + 0.55, w: 0, h: laneEnd - laneTop - 0.55, line: { color: "8C8A93", width: 1.25, dashType: "dash" } });
    });
    const L = Object.fromEntries(lanes.map(([n, x]) => [n, x]));
    const msg = (from, to, y, label, o = {}) => {
      const x1 = L[from], x2 = L[to];
      arrow(s, x1 + (x2 > x1 ? 0.05 : -0.05), y, x2 + (x2 > x1 ? -0.05 : 0.05), y, o.ret ? P.slate : P.deep, { dash: o.ret ? "dash" : "solid" });
      text(s, label, Math.min(x1, x2) + 0.1, y - 0.3, Math.abs(x2 - x1) - 0.2, 0.28, { size: 15, color: P.text, align: "center" });
    };
    const self = (lane, y, label, left = false, w = 2.4) => {
      const bx = left ? L[lane] - 0.1 - w : L[lane] + 0.1;
      box(s, bx, y - 0.22, w, 0.32, P.a, { r: 0.08 });
      text(s, label, bx + 0.1, y - 0.22, w - 0.2, 0.32, { size: 15, color: P.text, valign: "middle" });
    };
    let y = 2.6;
    const step = 0.44;
    msg("User", "Web portal", y, "Role, contact, birthdate"); y += step;
    msg("Web portal", "Cognito", y, "Sign up"); y += step;
    self("Cognito", y, "Check role, age 16+"); y += step;
    msg("Cognito", "User", y, "6-digit code", { ret: true }); y += step;
    msg("Web portal", "Cognito", y, "Confirm code"); y += step;
    self("Cognito", y, "Add to role group"); y += step;
    msg("Web portal", "NestJS API", y, "GET /me + token"); y += step;
    self("NestJS API", y, "Check token, group", true); y += step;
    msg("NestJS API", "PostgreSQL", y, "Create user row"); y += step;
    msg("NestJS API", "Web portal", y, "Profile and role", { ret: true });
    s.addNotes(
      "SPEAKER: Yevan (about 35 seconds).\n" +
        "This sequence diagram is sign-up as it runs in our code today. The user picks one role and gives an email or phone number and a birthdate. Cognito's pre-sign-up trigger checks the role and that the person is 16 or over. Cognito sends a six-digit code by email or SMS; once it's confirmed, the post-confirmation trigger adds the account to its role group.\n" +
        "Phone accounts have no password: Cognito sends an SMS code at every log-in. Google sign-in (AC-11, a Should) is only a button for now.\n" +
        "The portal then calls GET /me with the access token. The NestJS guard verifies the token with aws-jwt-verify, and on the first request the API creates the user's row in PostgreSQL. The role always comes from the Cognito group, never from the request body.\n" +
        "Hand over to Reshan."
    );
  }

  // ================= 05 DEMO, PROGRESS, NEXT (attendee light) =================
  S = "05 Demo and next steps";
  sec(S);
  {
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, "Live walkthrough");
    const urls = [
      ["FaGlobe", "www.tezera.lk", "Landing page"],
      ["FaLaptopCode", "dev.tezera.lk", "Sign-up and portal"],
      ["FaFigma", "Figma", "[Figma link]"],
    ];
    for (let i = 0; i < urls.length; i++) {
      const [ic, u, d] = urls[i];
      const y = TOP + 0.1 + i * 1.6;
      box(s, MX, y, 5.4, 1.38, P.card, { shadow: true });
      await iconTile(s, MX + 0.3, y + 0.33, 0.72, P.p, ic, P.text);
      text(s, u, MX + 1.3, y + 0.22, 3.9, 0.5, { size: 22, bold: true, color: P.text });
      text(s, d, MX + 1.3, y + 0.74, 3.9, 0.42, { size: 17, color: P.muted });
    }
    const steps = ["Landing page", "Sign up", "My events", "Hiring", "Figma screens"];
    const sx = 7.0;
    steps.forEach((h, i) => {
      const y = TOP + 0.1 + i * 0.93;
      if (i < steps.length - 1) line(s, sx + 0.3, y + 0.6, sx + 0.3, y + 0.93, P.muted, { w: 2 });
      tile(s, sx, y, 0.6, P.text);
      text(s, String(i + 1), sx, y, 0.6, 0.6, { size: 18, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
      text(s, h, sx + 0.85, y, 4.5, 0.6, { size: 22, bold: true, color: P.text, valign: "middle" });
    });
    s.addNotes(
      "SPEAKER: Reshan (about 2 minutes, live).\n" +
        "Switch to the browser. Have these tabs open before the viva: www.tezera.lk, dev.tezera.lk/signup, dev.tezera.lk/organiser/events, dev.tezera.lk/organiser/hiring, and the Figma file.\n" +
        "1. Landing page (www.tezera.lk, main branch): scroll through the three roles, purpose and team.\n" +
        "2. Sign-up (dev): show the role cards, the date of birth with the 16+ rule, and the Google button (say it isn't wired yet).\n" +
        "3. Organiser portal, My events: Colombo Music Fest shows 'Running late, 6:45 PM', a draft, and reviews to write. Say this is preview mode on sample data; the 'View as' box switches role.\n" +
        "4. Hiring: verified providers in rank order, the leaderboard, Post a job.\n" +
        "5. Figma: the high-fidelity screens the portal follows, including screens not built yet.\n" +
        "Landing page: the newer design (pixel-art stage, Sign up / See how it works) is on dev.tezera.lk; www.tezera.lk shows the older one until dev is merged into main. Demo whichever the team agrees on and change the first card to match.\n" +
        "Never demo preview mode on www.tezera.lk: it only exists on dev. If the network fails, the next two slides are screenshots of the same screens."
    );
  }
  for (const [ttl, a, b, ca, cb, note] of [
    ["Backup: landing page and sign-up", "landing", "signup", "Landing page", "Sign-up", "Screenshots from dev.tezera.lk, 23 Nov 2026: the new landing page ('Every event in Sri Lanka, in ONE place', sign up or see how it works) and sign-up (one role per account, 16+ check)."],
    ["Backup: organiser portal", "orgevents", "orghiring", "My events", "Hiring", "Preview mode on dev.tezera.lk with sample data, 23 Nov 2026: My events (live status, a draft, reviews to write) and Hiring (verified providers in rank order, a leaderboard)."],
  ]) {
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, ttl);
    const iw = (CW - 0.4) / 2;
    const imgs = [await shot(a), await shot(b)];
    const ihMax = Math.max(...imgs.map((m) => iw * m.ratio));
    for (const [i, c] of [[0, ca], [1, cb]]) {
      const x = MX + i * (iw + 0.4), ih = iw * imgs[i].ratio;
      s.addImage({ data: imgs[i].data, x, y: TOP + 0.2, w: iw, h: ih });
      box(s, x, TOP + 0.2, iw, ih, null, { line: P.muted, lineW: 1, r: 0.1 });
      text(s, c, x, TOP + ihMax + 0.4, iw, 0.45, { size: 20, bold: true, color: P.text });
    }
    s.addNotes("SPEAKER: Reshan. Backup only: use if the live demo can't load. " + note);
  }
  {
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, "Progress: 64 of 474 tasks are in the code");
    // Progress bar of the backlog
    const parts = [["built", 8, P.deep], ["partly built", 56, P.p], ["to do", 410, "E4D6D1"]];
    const by = TOP + 0.1, bh = 0.7;
    let bx = MX;
    const lab = [];
    parts.forEach(([n, v, c]) => {
      const w = (CW * v) / 474;
      rect(s, bx, by, w, bh, c);
      lab.push([n, v, bx, w]);
      bx += w;
    });
    text(s, [{ text: "8", options: { bold: true } }, { text: " built   ", options: {} }, { text: "56", options: { bold: true } }, { text: " partly built", options: {} }], MX, by + bh + 0.12, 6, 0.4, { size: 17, color: P.text });
    text(s, [{ text: "410", options: { bold: true } }, { text: " to do", options: {} }], W - MX - 3, by + bh + 0.12, 3, 0.4, { size: 17, color: P.text, align: "right" });
    const cols = [
      ["Built", "FaCheck", P.deep, "FFFFFF", ["Landing page", "Sign-up and sign-in", "Portal screens", "API and user table"]],
      ["Not yet", "FaHourglassHalf", P.a, P.text, ["Database host", "Real data in portal", "Mobile app", "Live updates, payments"]],
    ];
    const cw = (CW - 0.4) / 2, cy = 3.25, chh = BOTTOM - cy;
    for (let i = 0; i < 2; i++) {
      const [h, ic, c, icc, items] = cols[i];
      const x = MX + i * (cw + 0.4);
      box(s, x, cy, cw, chh, P.card, { shadow: true });
      await iconTile(s, x + 0.3, cy + 0.28, 0.6, c, ic, icc);
      text(s, h, x + 1.1, cy + 0.28, cw - 1.3, 0.6, { size: 22, bold: true, color: P.text, valign: "middle" });
      items.forEach((t, j) => {
        const r = j % 2, cc = Math.floor(j / 2);
        text(s, t, x + 0.35 + cc * (cw - 0.5) / 2, cy + 1.2 + r * 0.8, (cw - 0.6) / 2, 0.7, { size: 18, color: P.text, valign: "middle" });
      });
    }
    s.addNotes(
      "SPEAKER: Reshan (about 30 seconds).\n" +
        "In backlog terms, 64 of our 474 tasks are in the code on the dev branch (23 Nov): 8 fully built and 56 partly built, mostly screens on sample data.\n" +
        "Built: the landing page is live at www.tezera.lk; sign-up and sign-in work through Cognito (email + password, or phone + SMS code); the organiser portal screens exist on sample data; the API runs on Lambda with five routes and token and role checks, writing a users table in PostgreSQL through a Prisma migration; CI runs on every pull request and the API deploys from GitHub.\n" +
        "Not yet: the deployed Lambda still needs its settings (the fix is written and waiting to merge), we haven't chosen the database host, the portal still reads sample data, the vendor, freelancer and admin areas are empty pages, the Flutter app hasn't started, and live updates, chat, push and sandbox payments are still to build."
    );
  }
  {
    const s = add("ATT", S);
    const P = PAL.ATT;
    title(s, "Next: real data, then the first thin slice");
    const ph = [
      ["Next sprint", P.deep, "FFFFFF", ["Real data", "Start the app"]],
      ["Rest of the build", P.coralTint, P.text, ["Events", "Hiring", "Venue maps"]],
      ["End of the ATP", P.a, P.text, ["Live pilot"]],
      ["After the ATP", P.text, "FFFFFF", ["Ticketing", "Real payments"]],
    ];
    const seg = CW / ph.length, ly = 3.35;
    line(s, MX + seg / 2, ly, W - MX - seg / 2, ly, P.text, { w: 3 });
    ph.forEach(([h, c, tc, items], i) => {
      const x = MX + i * seg, cxm = x + seg / 2;
      box(s, x + 0.15, TOP + 0.1, seg - 0.3, 0.8, c, { r: 0.4 });
      text(s, h, x + 0.15, TOP + 0.1, seg - 0.3, 0.8, { size: 19, bold: true, color: tc, align: "center", valign: "middle" });
      line(s, cxm, TOP + 0.9, cxm, ly - 0.22, P.text, { w: 2 });
      dot(s, cxm, ly, 0.44, c === P.text || c === P.deep ? c : P.text);
      items.forEach((t, j) => {
        box(s, x + 0.35, ly + 0.55 + j * 0.78, seg - 0.7, 0.62, P.card, { r: 0.31, shadow: true });
        text(s, t, x + 0.35, ly + 0.55 + j * 0.78, seg - 0.7, 0.62, { size: 18, color: P.text, align: "center", valign: "middle" });
      });
    });
    s.addNotes(
      "SPEAKER: Reshan (about 30 seconds).\n" +
        "Next sprint we connect the portal to real data: merge the API settings fix, choose the database host and move the portal from sample data to the API; and we start the Flutter app.\n" +
        "Then we build in thin slices: publish and find an event first, then hiring, bookings and reviews, the venue map and map builder, sandbox payments (a Should) and admin and moderation.\n" +
        "The ATP ends with a live pilot: one or two partner organisers run a real event on Tezera with the vendors they already use, giving us our first reviews and SDG 8 measures. After the ATP, ticketing and QR entry come first, then real payments once the legal steps are done, then hiring for private events. After the pilot the group decides whether to take Tezera further.\n" +
        "Thank you. Hand back to the whole team for questions."
    );
  }

  // ================= CLOSE (organiser light) =================
  S = "Close";
  sec(S);
  {
    const s = add("COVER", S);
    const P = PAL.ORG;
    s.addImage({ data: logo, x: MX, y: 0.62, w: 0.95, h: 0.95 });
    text(s, "Thank you.", MX - 0.03, 1.9, 7.6, 1.35, { head: true, size: 88, color: P.text, valign: "middle" });
    text(s, "Questions?", MX, 3.25, 7.6, 0.8, { head: true, size: 44, color: P.deep, valign: "middle" });
    text(s, "Every event in Sri Lanka, in one place.", MX, 4.15, 7.6, 0.5, { size: 24, color: P.text });
    const pills = [["FaGoogleDrive", "Version history", 2.7], ["FaJira", "Jira board", 2.2], ["FaGithub", "GitHub", 1.85]];
    let px = MX;
    for (const [ic, t, w] of pills) {
      box(s, px, 5.5, w, 0.58, P.card, { r: 0.29 });
      s.addImage({ data: await icon(ic, P.deep), x: px + 0.2, y: 5.65, w: 0.28, h: 0.28 });
      text(s, t, px + 0.6, 5.5, w - 0.7, 0.58, { size: 18, bold: true, color: P.text, valign: "middle" });
      px += w + 0.2;
    }
    const t = TILE;
    cluster(s, 8.45, 0.75, 1.07, 0.92, [
      [t.g, t.o, t.a, t.v],
      [null, t.k, t.w, t.od],
      [null, null, t.v, t.a],
      [null, null, null, t.o],
    ]);
    s.addNotes(
      "ALL. Thank you. We're happy to take questions.\n" +
        "Each of us will be asked about our own contribution. Have open and ready: the Google Doc version history, the Jira board (space TES on tezera.atlassian.net), and the GitHub repos (Tezera-LK/tezera for code, Tezera-LK/ATP for the docs)."
    );
  }

  await pres.writeFile({ fileName: OUT });
  if (process.env.APPLY_THEME) {
    const { applyTheme } = require(process.env.APPLY_THEME);
    await applyTheme(OUT, THEME);
  } else {
    console.warn("APPLY_THEME not set: theme colours left as Office defaults (all slide colours are set directly, so the slides look the same).");
  }
  console.log("Wrote " + OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });

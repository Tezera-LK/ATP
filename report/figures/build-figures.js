// Builds the Chapter 4 figures as SVG: the onion model and the use case diagrams.
// Run from the repo root: node report/figures/build-figures.js
// Edit the data below, run again, then re-export the PNGs with headless Chrome (command in report/tezera-srs-chapter-4.md, 'About this file').
const fs = require('fs');
const path = require('path');
const OUT = __dirname;

const FONT = "font-family='Segoe UI, Helvetica, Arial, sans-serif'";
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function text(x, y, lines, opts = {}) {
  const size = opts.size || 14, lh = opts.lh || size * 1.25, anchor = opts.anchor || 'middle';
  const weight = opts.weight || 400, fill = opts.fill || '#1d1b16', style = opts.italic ? " font-style='italic'" : '';
  const arr = Array.isArray(lines) ? lines : [lines];
  const y0 = y - ((arr.length - 1) * lh) / 2;
  return arr.map((l, i) => `<text x='${x}' y='${(y0 + i * lh).toFixed(1)}' ${FONT} font-size='${size}' font-weight='${weight}' fill='${fill}' text-anchor='${anchor}' dominant-baseline='middle'${style}>${esc(l)}</text>`).join('\n');
}

// ---------- Onion model ----------
function onion() {
  const W = 1100, H = 1100, cx = 550, cy = 560;
  const rings = [
    { r: 520, fill: '#eef1ec', stroke: '#9fb3a2', title: 'Wider environment' },
    { r: 395, fill: '#e3ebe4', stroke: '#83a08a', title: 'Containing system' },
    { r: 265, fill: '#d3e2d6', stroke: '#5f8a6b', title: 'Our system' },
    { r: 130, fill: '#2f5d43', stroke: '#2f5d43', title: '' },
  ];
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' width='${W}' height='${H}'>\n<rect width='100%' height='100%' fill='#ffffff'/>\n`;
  for (const g of rings) s += `<circle cx='${cx}' cy='${cy}' r='${g.r}' fill='${g.fill}' stroke='${g.stroke}' stroke-width='2'/>\n`;
  // ring titles at the top of each band
  s += text(cx, cy - 520 + 26, 'WIDER ENVIRONMENT', { size: 15, weight: 700, fill: '#4c6652' });
  s += text(cx, cy - 395 + 24, 'CONTAINING SYSTEM', { size: 15, weight: 700, fill: '#40604a' });
  s += text(cx, cy - 265 + 24, 'OUR SYSTEM', { size: 15, weight: 700, fill: '#2f5d43' });
  s += text(cx, cy - 18, 'tezera', { size: 34, weight: 700, fill: '#ffffff' });
  s += text(cx, cy + 22, ['mobile app and', 'web portal'], { size: 14, fill: '#e9f0ea' });

  const place = (items, r, start, span) => {
    let out = '';
    items.forEach((it, i) => {
      const a = (start + (span * (i + 0.5)) / items.length) * Math.PI / 180;
      const x = cx + r * Math.sin(a), y = cy - r * Math.cos(a);
      out += text(x.toFixed(1), y.toFixed(1), it.l, { size: 13.5, weight: it.neg ? 600 : 500, fill: it.neg ? '#a3322a' : '#1d1b16', italic: !!it.neg });
    });
    return out;
  };
  // Our system: people who use or run the product
  s += place([
    { l: ['Organisers'] }, { l: ['Vendors'] }, { l: ['Freelancers'] }, { l: ['Consumers', '(attendees)'] },
    { l: ['Admins', '(platform staff)'] }, { l: ['Tezera', 'development team'] },
  ], 198, 28, 360);
  // Containing system: systems and groups that interact with the product
  s += place([
    { l: ['AWS cloud services', '(Cognito, Lambda, S3)'] }, { l: ['PayHere', '(sandbox gateway)'] }, { l: ['Dialog e-SMS'] },
    { l: ['Firebase Cloud', 'Messaging, Amazon SES'] }, { l: ['Instagram and', 'WhatsApp (sharing)'] },
    { l: ['External ticket sellers', '(linked from events)'] }, { l: ['Pilot partner', 'organisers'] }, { l: ['Venues and', 'venue staff'] },
  ], 330, 22, 360);
  // Wider environment
  s += place([
    { l: ['Central Bank', 'of Sri Lanka'] }, { l: ['Data Protection', 'Authority (PDPA)'] }, { l: ['Inland Revenue', 'Department'] },
    { l: ['Consumer Affairs', 'Authority'] }, { l: ['SDGP supervisors', 'and assessors'] }, { l: ['Lawyer and accountant', '(before real money)'] },
    { l: ['Sri Lankan event', 'industry (SDG 8)'] }, { l: ['Competing platforms', '(MyTickets, WeddingArcade)'], neg: true },
    { l: ['Fake organisers', 'and ticket scammers'], neg: true }, { l: ['Future investors', '(after the pilot)'] },
  ], 458, 18, 360);
  // legend
  s += `<rect x='20' y='${H - 74}' width='16' height='16' fill='#d3e2d6' stroke='#5f8a6b'/>` + text(44, H - 66, 'Stakeholder group', { size: 13, anchor: 'start' });
  s += text(20, H - 38, 'Red italic = negative stakeholder', { size: 13, anchor: 'start', fill: '#a3322a', italic: true });
  s += `</svg>\n`;
  return s;
}

// ---------- Use case diagrams ----------
function actor(x, y, label, opts = {}) {
  const c = opts.system ? '#3d4b5c' : '#1d1b16';
  if (opts.system) {
    return `<rect x='${x - 70}' y='${y - 30}' width='140' height='60' rx='4' fill='#f4f6f8' stroke='${c}' stroke-width='1.6'/>` +
      text(x, y - 9, '«system»', { size: 12, fill: '#5b6776' }) + text(x, y + 10, label, { size: 14, weight: 600 });
  }
  const it = opts.abstract ? " font-style='italic'" : '';
  return `<g stroke='${c}' stroke-width='2' fill='none'><circle cx='${x}' cy='${y - 34}' r='11' fill='#fff'/><line x1='${x}' y1='${y - 23}' x2='${x}' y2='${y + 6}'/><line x1='${x - 17}' y1='${y - 12}' x2='${x + 17}' y2='${y - 12}'/><line x1='${x}' y1='${y + 6}' x2='${x - 13}' y2='${y + 28}'/><line x1='${x}' y1='${y + 6}' x2='${x + 13}' y2='${y + 28}'/></g>` +
    text(x, y + 46, label, { size: 14, weight: 600, italic: !!opts.abstract });
}
function ellipseEdge(u, px, py) {
  const dx = px - u.x, dy = py - u.y;
  const t = 1 / Math.sqrt((dx * dx) / (u.rx * u.rx) + (dy * dy) / (u.ry * u.ry));
  return [u.x + dx * t, u.y + dy * t];
}
function diagram(spec) {
  const { W, H, box, title, actors, ucs, links, rels = [], gens = [] } = spec;
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' width='${W}' height='${H}'>\n<rect width='100%' height='100%' fill='#ffffff'/>\n`;
  s += `<defs><marker id='open' viewBox='0 0 10 10' refX='10' refY='5' markerWidth='9' markerHeight='9' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10' fill='none' stroke='#3d4b5c' stroke-width='1.4'/></marker>` +
    `<marker id='tri' viewBox='0 0 12 12' refX='12' refY='6' markerWidth='14' markerHeight='14' orient='auto-start-reverse'><path d='M0,0 L12,6 L0,12 Z' fill='#fff' stroke='#1d1b16' stroke-width='1.2'/></marker></defs>\n`;
  s += `<rect x='${box.x}' y='${box.y}' width='${box.w}' height='${box.h}' rx='10' fill='#fafbf9' stroke='#5f8a6b' stroke-width='2'/>\n`;
  s += text(box.x + 18, box.y + 24, title, { size: 16, weight: 700, anchor: 'start', fill: '#2f5d43' });
  const U = {};
  for (const u of ucs) { U[u.id] = { rx: 150, ry: 34, ...u }; }
  const A = {}; for (const a of actors) A[a.id] = a;
  // association lines first (under the shapes)
  for (const [aid, uid] of links) {
    const a = A[aid], u = U[uid];
    const ax = a.x + (u.x > a.x ? (a.system ? 70 : 22) : (a.system ? -70 : -22)), ay = a.y - (a.system ? 0 : 8);
    // connect to the ellipse's nearest end, so a fan layout never cuts another ellipse
    const ex = u.x > a.x ? u.x - u.rx : u.x + u.rx, ey = u.y;
    s += `<line x1='${ax}' y1='${ay}' x2='${ex.toFixed(1)}' y2='${ey.toFixed(1)}' stroke='#3d4b5c' stroke-width='1.4'/>\n`;
  }
  for (const g of gens) { // generalisation child -> parent
    const c = A[g[0]], p = A[g[1]];
    s += `<line x1='${c.x}' y1='${c.y - 50}' x2='${p.x}' y2='${p.y + 62}' stroke='#1d1b16' stroke-width='1.4' marker-end='url(#tri)'/>\n`;
  }
  for (const r of rels) { // include / extend: from -> to, dashed
    const f = U[r.from], t = U[r.to];
    const [fx, fy] = ellipseEdge(f, t.x, t.y), [tx, ty] = ellipseEdge(t, f.x, f.y);
    s += `<line x1='${fx.toFixed(1)}' y1='${fy.toFixed(1)}' x2='${tx.toFixed(1)}' y2='${ty.toFixed(1)}' stroke='#3d4b5c' stroke-width='1.4' stroke-dasharray='6 4' marker-end='url(#open)'/>\n`;
    const mx = (fx + tx) / 2 + (r.dx || 0), my = (fy + ty) / 2 + (r.dy || 0);
    s += `<rect x='${mx - 38}' y='${my - 10}' width='76' height='20' fill='#fafbf9'/>` + text(mx, my, `«${r.kind}»`, { size: 12, fill: '#3d4b5c' }) + '\n';
  }
  for (const u of Object.values(U)) {
    s += `<ellipse cx='${u.x}' cy='${u.y}' rx='${u.rx}' ry='${u.ry}' fill='#ffffff' stroke='#2f5d43' stroke-width='1.8'/>\n`;
    s += text(u.x, u.y - (u.l2 ? 18 : 9), u.id, { size: 11.5, fill: '#5f8a6b', weight: 700 });
    s += text(u.x, u.y + (u.l2 ? 14 : 8), u.l2 ? u.l.replace(' and ', ' and|').split('|') : u.l, { size: 14, lh: 17 });
  }
  for (const a of actors) s += actor(a.x, a.y, a.l, a) + '\n';
  s += `</svg>\n`;
  return s;
}

// Figure 3: actor hierarchy
function actorsFigure() {
  const W = 940, H = 520;
  let s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' width='${W}' height='${H}'>\n<rect width='100%' height='100%' fill='#ffffff'/>\n`;
  s += `<defs><marker id='tri' viewBox='0 0 12 12' refX='12' refY='6' markerWidth='14' markerHeight='14' orient='auto-start-reverse'><path d='M0,0 L12,6 L0,12 Z' fill='#fff' stroke='#1d1b16' stroke-width='1.2'/></marker></defs>\n`;
  const P = { user: [380, 90], con: [110, 290], org: [270, 290], pro: [490, 290], adm: [650, 290], ven: [420, 450], fre: [570, 450] };
  const gen = (c, p) => `<line x1='${P[c][0]}' y1='${P[c][1] - 50}' x2='${P[p][0]}' y2='${P[p][1] + 62}' stroke='#1d1b16' stroke-width='1.4' marker-end='url(#tri)'/>\n`;
  s += gen('con', 'user') + gen('org', 'user') + gen('pro', 'user') + gen('adm', 'user');
  // vendor and freelancer: shorter figures
  s += `<line x1='${P.ven[0]}' y1='${P.ven[1] - 48}' x2='${P.pro[0]}' y2='${P.pro[1] + 62}' stroke='#1d1b16' stroke-width='1.4' marker-end='url(#tri)'/>\n`;
  s += `<line x1='${P.fre[0]}' y1='${P.fre[1] - 48}' x2='${P.pro[0]}' y2='${P.pro[1] + 62}' stroke='#1d1b16' stroke-width='1.4' marker-end='url(#tri)'/>\n`;
  s += actor(P.user[0], P.user[1], 'Registered user', { abstract: true });
  s += actor(P.con[0], P.con[1], 'Consumer') + actor(P.org[0], P.org[1], 'Organiser') + actor(P.pro[0], P.pro[1], 'Provider', { abstract: true }) + actor(P.adm[0], P.adm[1], 'Admin');
  s += actor(P.ven[0], P.ven[1], 'Vendor') + actor(P.fre[0], P.fre[1], 'Freelancer');
  s += actor(830, 120, 'PayHere sandbox', { system: true }) + actor(830, 230, 'Notification services', { system: true });
  s += text(830, 300, ['Secondary actors', '(external systems)'], { size: 12.5, fill: '#5b6776' });
  s += text(380, 20, 'Italic = abstract actor (no one signs up as it directly)', { size: 12.5, fill: '#5b6776' });
  s += `</svg>\n`;
  return s;
}

// Figure 4: accounts, community and administration
// Use cases fan out from each actor (x grows with distance in y) so no line cuts an ellipse.
const fanX = (ay, x0, k) => (y) => Math.round(x0 + Math.abs(y - ay) * k);
const fanXr = (ay, x0, k) => (y) => Math.round(x0 - Math.abs(y - ay) * k);
const fa = fanX(260, 470, 0.6);
const figA = diagram({
  W: 1180, H: 800, box: { x: 230, y: 20, w: 720, h: 760 }, title: 'tezera: accounts, community and administration',
  actors: [
    { id: 'user', x: 110, y: 260, l: 'Registered user', abstract: true },
    { id: 'org', x: 100, y: 560, l: 'Organiser' }, { id: 'pro', x: 100, y: 700, l: 'Provider', abstract: true },
    { id: 'adm', x: 1070, y: 600, l: 'Admin' },
  ],
  ucs: [
    { id: 'UC-001', l: 'Register and sign in', x: fa(100), y: 100 },
    { id: 'UC-014', l: 'Join boards and communities', x: fa(180), y: 180, rx: 165 },
    { id: 'UC-015', l: 'Chat and get announcements', x: fa(260), y: 260, rx: 165 },
    { id: 'UC-013', l: 'Leave a review', x: fa(340), y: 340 },
    { id: 'UC-016', l: 'Report a user or content', x: fa(420), y: 420, rx: 160 },
    { id: 'UC-002', l: 'Get verified', x: 520, y: 640 },
    { id: 'UC-017', l: 'Moderate reports and disputes', x: 790, y: 510, rx: 140, ry: 40, l2: true },
  ],
  links: [['user', 'UC-001'], ['user', 'UC-014'], ['user', 'UC-015'], ['user', 'UC-013'], ['user', 'UC-016'],
    ['org', 'UC-002'], ['pro', 'UC-002'], ['adm', 'UC-002'], ['adm', 'UC-017']],
});

// Figure 5: events, discovery and venue maps
const fo = fanX(260, 470, 0.6), fc = fanXr(560, 720, 0.6);
const figB = diagram({
  W: 1180, H: 860, box: { x: 230, y: 20, w: 720, h: 820 }, title: 'tezera: events, discovery and venue maps',
  actors: [
    { id: 'org', x: 110, y: 260, l: 'Organiser' },
    { id: 'con', x: 1070, y: 560, l: 'Consumer' },
    { id: 'ven', x: 1070, y: 760, l: 'Vendor' },
  ],
  ucs: [
    { id: 'UC-003', l: 'Publish and manage an event', x: fo(100), y: 100, rx: 165 },
    { id: 'UC-004', l: 'Promote an event in the feed', x: fo(180), y: 180, rx: 165 },
    { id: 'UC-018', l: 'View the event dashboard', x: fo(260), y: 260 },
    { id: 'UC-011', l: 'Build the venue map', x: fo(340), y: 340 },
    { id: 'UC-005', l: 'Discover and search events', x: fc(480), y: 480, rx: 160 },
    { id: 'UC-006', l: "Mark 'Going' or 'Interested'", x: fc(560), y: 560, rx: 160 },
    { id: 'UC-012', l: 'Find a stall on the venue map', x: fc(640), y: 640, rx: 165 },
    { id: 'UC-020', l: 'List stall items and prices', x: 690, y: 760, rx: 160 },
  ],
  links: [['org', 'UC-003'], ['org', 'UC-004'], ['org', 'UC-018'], ['org', 'UC-011'], ['ven', 'UC-020'],
    ['con', 'UC-005'], ['con', 'UC-006'], ['con', 'UC-012'], ['con', 'UC-004']],
});

// Figure 6: hiring, stalls and test payments
const fh = fanX(330, 470, 0.5);
const figC = diagram({
  W: 1180, H: 780, box: { x: 230, y: 20, w: 720, h: 740 }, title: 'tezera: hiring, stalls and test payments',
  actors: [
    { id: 'org', x: 110, y: 330, l: 'Organiser' },
    { id: 'pro', x: 1070, y: 160, l: 'Provider', abstract: true },
    { id: 'ven', x: 1070, y: 650, l: 'Vendor' },
    { id: 'pay', x: 1070, y: 480, l: 'PayHere sandbox', system: true },
  ],
  ucs: [
    { id: 'UC-007', l: 'Send a direct booking request', x: 640, y: 110, rx: 165 },
    { id: 'UC-008', l: 'Post a job and compare quotes', x: 500, y: 210, rx: 165 },
    { id: 'UC-019', l: 'Confirm a booking with terms', x: 800, y: 370, rx: 145 },
    { id: 'UC-009', l: 'Make a test payment', x: fh(460), y: 460 },
    { id: 'UC-010', l: 'Run stall applications', x: fh(610), y: 610 },
  ],
  links: [['org', 'UC-007'], ['org', 'UC-008'], ['org', 'UC-010'], ['org', 'UC-009'],
    ['pro', 'UC-007'], ['pro', 'UC-008'], ['ven', 'UC-010'], ['ven', 'UC-009'], ['pay', 'UC-009']],
  rels: [
    { from: 'UC-007', to: 'UC-019', kind: 'include', dx: 56, dy: -20 },
    { from: 'UC-008', to: 'UC-019', kind: 'include', dx: -30, dy: 14 },
    { from: 'UC-009', to: 'UC-019', kind: 'extend', dx: 46, dy: 0 },
  ],
});

const files = {
  'fig-onion-model.svg': onion(),
  'fig-actors.svg': actorsFigure(),
  'fig-uc-accounts-community-admin.svg': figA,
  'fig-uc-events-maps.svg': figB,
  'fig-uc-hiring-stalls-payments.svg': figC,
};
for (const [f, svg] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), svg);
console.log('wrote', Object.keys(files).join(', '));

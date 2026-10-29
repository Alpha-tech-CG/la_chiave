// Éléments communs aux pages La Chiave : pavés pixel, dévoilement des titres,
// menu mobile et emblèmes d'Italie dessinés en arrière-plan.
(function () {
  const PASTELS = ['#DCECFF', '#FFE8A8', '#EADFFF', '#ABFFA8', '#DCFFE4', '#FFD9A8'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CELL = 20;

  // Pavés pixel pastel sur une grille de 20px : barres verticales sur les côtés,
  // pavés horizontaux en haut et en bas.
  function scatter(el, zones, count) {
    if (!el) return;
    const cols = Math.ceil(el.offsetWidth / CELL), rows = Math.ceil(el.offsetHeight / CELL);
    let html = '';
    for (let n = 0; n < count; n++) {
      const zone = zones[Math.floor(Math.random() * zones.length)];
      const side = zone === 'side';
      const w = side ? 1 + Math.floor(Math.random() * 2) : 2 + Math.floor(Math.random() * 5);
      const h = side ? 3 + Math.floor(Math.random() * 7) : 1 + Math.floor(Math.random() * 2);
      let c, r;
      if (zone === 'top') { c = Math.floor(Math.random() * cols); r = Math.floor(Math.random() * 4); }
      else if (zone === 'bottom') { c = Math.floor(Math.random() * cols); r = rows - h - Math.floor(Math.random() * 4); }
      else { const band = Math.floor(cols * .18); c = Math.random() < .5 ? Math.floor(Math.random() * band) : cols - 1 - Math.floor(Math.random() * band); r = Math.floor(Math.random() * (rows - h)); }
      const color = PASTELS[Math.floor(Math.random() * PASTELS.length)];
      html += `<i data-zone="${zone}" data-h="${h}" style="left:${c * CELL}px;top:${r * CELL}px;width:${w * CELL}px;height:${h * CELL}px;background:${color}"></i>`;
    }
    el.innerHTML = html;
  }

  // Les barres glissent verticalement vers une nouvelle case, quelques-unes à la fois.
  function shuffle(el) {
    if (!el || !el.children.length) return;
    const rows = Math.ceil(el.offsetHeight / CELL);
    [...el.children].forEach(i => {
      if (Math.random() > .35) return;
      const zone = i.dataset.zone, h = +i.dataset.h;
      let r;
      if (zone === 'side') r = Math.floor(Math.random() * (rows - h));
      else if (zone === 'top') r = Math.floor(Math.random() * 4);
      else r = rows - h - Math.floor(Math.random() * 4);
      i.style.top = `${r * CELL}px`;
    });
  }
  function animatePixels(ids) {
    if (!reduced) setInterval(() => ids.forEach(id => shuffle(document.getElementById(id))), 1100);
  }

  // Découpe un titre en lignes réelles, chacune recouverte d'une bande sombre et d'une bande menthe.
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function splitLines(el) {
    if (!el.dataset.src) el.dataset.src = el.innerHTML;
    const words = [];
    el.dataset.src.split(/<br\s*\/?>/i).forEach((seg, s) => {
      const tmp = document.createElement('div'); tmp.innerHTML = seg;
      tmp.textContent.trim().split(/\s+/).filter(Boolean).forEach((w, k) => words.push({ w, brk: s > 0 && k === 0 }));
    });
    el.innerHTML = words.map(o => (o.brk ? '<br>' : '') + `<span class="wd">${esc(o.w)}</span>`).join(' ');
    const lines = [];
    let top = null;
    el.querySelectorAll('.wd').forEach(sp => {
      if (sp.offsetTop !== top) { lines.push([]); top = sp.offsetTop; }
      lines[lines.length - 1].push(sp.textContent);
    });
    const center = getComputedStyle(el).textAlign === 'center';
    el.innerHTML = lines.map((l, i) => `<span class="ln" style="--d:${(i * 0.12).toFixed(2)}s${center ? ';margin-inline:auto' : ''}">${esc(l.join(' '))}<span class="wb"></span><span class="wa"></span></span>`).join('');
  }

  // Menu mobile.
  function initMenu() {
    const burger = document.querySelector('.burger'), mm = document.getElementById('mobileMenu');
    if (!burger || !mm) return;
    burger.onclick = () => { const open = mm.classList.toggle('open'); burger.setAttribute('aria-expanded', open); };
    mm.querySelectorAll('a').forEach(a => a.onclick = () => { mm.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  }

  // ---------- Emblèmes d'Italie (dessin au trait) ----------
  // Arcade : arcs en plein cintre posés entre deux piédroits.
  const arch = (cx, r, top, bottom) => `<path d="M${cx - r} ${bottom} V${top + r} A${r} ${r} 0 0 1 ${cx + r} ${top + r} V${bottom}"/>`;

  function pise() {
    const x0 = 46, x1 = 154, w = x1 - x0;
    let s = '', y = 400;
    const tiers = [{ h: 70, n: 5, a: 20 }, ...Array(6).fill({ h: 40, n: 6, a: 8 })];
    tiers.forEach(t => {
      const top = y - t.h, cw = w / t.n;
      s += `<rect x="${x0}" y="${top}" width="${w}" height="${t.h}"/><line x1="${x0 - 5}" y1="${top}" x2="${x1 + 5}" y2="${top}"/><line x1="${x0 - 5}" y1="${top + 3}" x2="${x1 + 5}" y2="${top + 3}"/>`;
      for (let i = 0; i < t.n; i++) {
        const cx = x0 + cw * (i + .5);
        s += arch(cx, cw * .32, top + t.a, y - 2);
        if (i) s += `<line x1="${x0 + cw * i}" y1="${top + 6}" x2="${x0 + cw * i}" y2="${y}"/>`;
      }
      y = top;
    });
    // Chambre des cloches, plus étroite, et toit.
    const b0 = 60, b1 = 140, top = y - 36, cw = (b1 - b0) / 5;
    s += `<rect x="${b0}" y="${top}" width="${b1 - b0}" height="36"/>`;
    for (let i = 0; i < 5; i++) s += arch(b0 + cw * (i + .5), cw * .3, top + 8, y - 2);
    s += `<path d="M${b0 - 4} ${top} L100 ${top - 12} L${b1 + 4} ${top}"/><line x1="100" y1="${top - 12}" x2="100" y2="${top - 22}"/>`;
    return `<svg viewBox="0 0 200 420" preserveAspectRatio="xMidYMax meet"><g transform="rotate(4 100 400)">${s}</g><line x1="0" y1="400" x2="200" y2="400"/></svg>`;
  }

  function colisee() {
    const x0 = 20, bays = 12, cw = 50, ground = 262;
    const tiers = [{ y: 200, h: 62, end: 12 }, { y: 140, h: 60, end: 11 }, { y: 82, h: 58, end: 9 }, { y: 30, h: 52, end: 7, attic: true }];
    let s = '';
    tiers.forEach(t => {
      const xe = x0 + cw * t.end;
      s += `<path d="M${x0} ${t.y + t.h} V${t.y} H${xe}"/><line x1="${x0 - 4}" y1="${t.y + 4}" x2="${xe}" y2="${t.y + 4}"/>`;
      for (let i = 0; i < t.end; i++) {
        const cx = x0 + cw * (i + .5);
        if (t.attic) {
          if (i % 2) s += `<rect x="${cx - 6}" y="${t.y + 20}" width="12" height="16"/>`;
        } else {
          s += arch(cx, 15, t.y + 14, t.y + t.h);
        }
        s += `<line x1="${x0 + cw * (i + 1)}" y1="${t.y + 6}" x2="${x0 + cw * (i + 1)}" y2="${t.y + t.h}"/>`;
      }
      // Bord en ruine : un profil irrégulier là où le mur extérieur s'arrête.
      s += `<path d="M${xe} ${t.y} l6 10 l-4 12 l8 9 l-3 ${t.h - 31}"/>`;
    });
    // Mur intérieur visible derrière la partie effondrée.
    s += `<path d="M${x0 + cw * 7 + 10} 70 H${x0 + cw * 11.6} V140 M${x0 + cw * 9 + 10} 100 H${x0 + cw * 12}"/>`;
    for (let i = 8; i < 12; i++) s += arch(x0 + cw * (i + .5) - 6, 9, 104, 140);
    s += `<line x1="0" y1="${ground}" x2="640" y2="${ground}"/>`;
    return `<svg viewBox="0 0 640 270" preserveAspectRatio="xMidYMax meet">${s}</svg>`;
  }

  function stpierre() {
    let s = '';
    // Façade à colonnes et fronton.
    s += `<rect x="40" y="200" width="280" height="90"/><line x1="34" y1="200" x2="326" y2="200"/><rect x="40" y="186" width="280" height="14"/>`;
    for (let x = 54; x < 320; x += 26) s += `<line x1="${x}" y1="204" x2="${x}" y2="290"/>`;
    for (let x = 67; x < 310; x += 52) s += arch(x, 7, 250, 290);
    s += `<path d="M138 186 L180 164 L222 186"/>`;
    // Tambour, dôme nervuré, lanterne et croix.
    s += `<rect x="118" y="118" width="124" height="46"/><line x1="112" y1="118" x2="248" y2="118"/>`;
    for (let x = 128; x < 240; x += 14) s += `<line x1="${x}" y1="122" x2="${x}" y2="164"/>`;
    s += `<path d="M118 118 C118 40 242 40 242 118"/>`;
    [[140, 'C142 70 168 52'], [160, 'C160 62 174 50'], [200, 'C200 62 186 50'], [220, 'C218 70 192 52']].forEach(([x, c]) => { s += `<path d="M${x} 118 ${c} 180 50"/>`; });
    s += `<rect x="168" y="34" width="24" height="16"/><path d="M168 34 Q180 22 192 34"/><line x1="180" y1="22" x2="180" y2="6"/><line x1="174" y1="12" x2="186" y2="12"/>`;
    // Petites coupoles latérales.
    s += `<path d="M58 186 Q76 160 94 186"/><path d="M266 186 Q284 160 302 186"/>`;
    s += `<line x1="0" y1="290" x2="360" y2="290"/>`;
    return `<svg viewBox="0 0 360 300" preserveAspectRatio="xMidYMax meet">${s}</svg>`;
  }

  const EMBLEMS = { pise, colisee, stpierre };
  // Remplit chaque [data-emblems] avec les trois monuments.
  function renderEmblems() {
    document.querySelectorAll('[data-emblems]').forEach(el => {
      el.innerHTML = `<div class="em em-stpierre">${stpierre()}</div><div class="em em-colisee">${colisee()}</div><div class="em em-pise">${pise()}</div>`;
    });
  }

  window.LaChiave = { scatter, shuffle, animatePixels, splitLines, initMenu, renderEmblems, EMBLEMS, reduced };
})();

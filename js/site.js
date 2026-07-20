/* ============================================================
   ALKABIL.audio — shared site script
   Injects the header, mobile menu, and footer from single sources
   (edit once, changes on every page); drives the artist prev/next
   navigation and the artists grid from one ordered registry; fills
   the copyright year; makes the marquees seamless; handles the
   newsletter submit.
   ============================================================ */

/* ============ ARTIST REGISTRY — EDIT ONCE ============
   The single source of truth for artists. Order here is the order used by the
   Previous/Next navigation (it wraps around) and by the grid on /artists.
   To add an artist: (1) add a line here, (2) create artists/<id>.html by
   copying an existing artist page and setting <body data-artist="<id>">.
   Nothing else needs editing — the grid and every page's prev/next update
   themselves. `id` must match the filename (artists/<id>.html, served at
   /artists/<id>) and the page's data-artist. */
const ARTISTS = [
  { id: 'yslas',       name: 'Yslas',          img: '/assets/yslas-headshot.jpg' },
  // `focus` (optional): CSS object-position for the grid photo when it's a tall
  // portrait cropped to fill — anchors the crop so the face shows. Default is
  // center; 'center 12%' pulls it near the top. See DOCUMENTATION §1.1.4.
  { id: 'jehernandez', name: 'J.E. Hernández', img: '/assets/hernandez.jpg', focus: 'center 12%' },
];

/* ============ NAV + FOOTER — EDIT ONCE ============
   [label, destination]. A destination starting with http opens in a new tab;
   anything else is an internal page. Internal links are CLEAN, root-absolute
   slugs ('/info', not 'info.html') — the host serves info.html at /info. They
   must start with "/" so they resolve the same from /artists/<slug> as from the
   root. See DOCUMENTATION §4. */
const NAV_LINKS = [
  ['Info', '/info'],
  ['Artists', '/artists'],
];
const RELEASES = ['Releases', 'https://alkabilaudio.bandcamp.com/'];

const INSTAGRAM_URL = 'https://www.instagram.com/alkabil.audio';
const IG_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.36 1.05.42 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.06 1.18-.25 1.81-.42 2.23a3.7 3.7 0 0 1-.9 1.38 3.7 3.7 0 0 1-1.38.9c-.42.17-1.05.36-2.23.42-1.27.06-1.65.07-4.86.07s-3.6 0-4.86-.07c-1.18-.06-1.81-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.36-1.05-.42-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.06-1.18.25-1.81.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.05-.36 2.23-.42C8.4 2.2 8.8 2.2 12 2.2m0-2.2C8.7 0 8.3 0 7.05.07 5.78.13 4.9.33 4.14.63c-.8.3-1.47.72-2.14 1.4A5.9 5.9 0 0 0 .63 4.13C.33 4.9.13 5.78.07 7.05 0 8.33 0 8.74 0 12s0 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.8.72 1.47 1.4 2.14a5.9 5.9 0 0 0 2.13 1.37c.77.3 1.64.5 2.91.56C8.33 24 8.74 24 12 24s3.67 0 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.14-1.37 5.9 5.9 0 0 0 1.37-2.14c.3-.77.5-1.64.56-2.91.07-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.37-2.14A5.9 5.9 0 0 0 19.86.63c-.77-.3-1.64-.5-2.91-.56C15.67 0 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84m0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 4m7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44"/></svg>';

/* Footer columns: [label, destination]. Year is filled in automatically. */
const FOOTER_LEFT = [
  ['info@alkabil.audio', 'mailto:info@alkabil.audio'],
];
const FOOTER_RIGHT = [
  ['Instagram', INSTAGRAM_URL],
  ['bandcamp', 'https://alkabilaudio.bandcamp.com/'],
];

/* ---- link helpers ---- */
function linkHTML(label, dest) {
  return dest.startsWith('http')
    ? '<a href="' + dest + '" target="_blank" rel="noopener">' + label + '</a>'
    : '<a href="' + dest + '">' + label + '</a>';
}

/* ============ HEADER SCROLL STATE ============
   The header bar is transparent at the top of EVERY page and its faint red tint
   fades in once scrolled past HEADER_SHOW_AFTER, fading back out on return to
   the very top (the CSS transition does the fading; this only toggles the
   class).

   The nav's colour while the bar is clear depends on what the page opens on, so
   we check the first section's theme: a white/bright one (info, artist pages)
   gets `.on-light`, which flips the nav to dark text until the tint arrives.
   Pages opening on the dark hero — or on photos, like the artists grid, which
   has no .page-section at all — keep white text with a soft shadow. Once
   scrolled, the tinted bar carries white text everywhere. */
const HEADER_SHOW_AFTER = 40;   // px scrolled before the bar tints in
function wireHeaderScroll(header) {
  const first = document.querySelector('main .page-section');
  if (first && (first.classList.contains('theme-white') ||
                first.classList.contains('theme-bright'))) {
    header.classList.add('on-light');
  }
  const sync = () => header.classList.toggle('scrolled', window.scrollY > HEADER_SHOW_AFTER);
  sync();
  addEventListener('scroll', sync, { passive: true });
}

/* ============ HEADER (+ mobile menu) ============ */
function buildHeader(header) {
  /* Releases sits in the LEFT nav alongside Info/Artists; the right side keeps
     just the Instagram icon and the burger. */
  header.innerHTML =
    '<div class="header-inner">' +
      '<nav class="nav-left">' +
        NAV_LINKS.map(([l, d]) => linkHTML(l, d)).join('') +
        linkHTML(RELEASES[0], RELEASES[1]) +
      '</nav>' +
      '<div class="branding"><a href="/">ALKABIL</a></div>' +
      '<div class="header-right">' +
        '<a class="social-icon" href="' + INSTAGRAM_URL + '" target="_blank" rel="noopener" aria-label="Instagram">' + IG_SVG + '</a>' +
        '<button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>' +
    '</div>';

  wireHeaderScroll(header);

  /* mobile menu — same links, built once and appended to <body> */
  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.innerHTML =
    NAV_LINKS.map(([l, d]) => linkHTML(l, d)).join('') +
    linkHTML(RELEASES[0], RELEASES[1]) +
    '<a href="' + INSTAGRAM_URL + '" target="_blank" rel="noopener">Instagram</a>';
  document.body.appendChild(menu);

  const burger = header.querySelector('.burger');
  const setOpen = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  burger.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* ============ FOOTER ============ */
function buildFooter(footer) {
  const year = new Date().getFullYear();
  footer.innerHTML =
    '<div class="footer-inner">' +
      '<div class="footer-left">' +
        FOOTER_LEFT.map(([l, d]) => '<p>' + linkHTML(l, d) + '</p>').join('') +
        '<p>a <a href="https://www.silbaca.tv" target="_blank" rel="noopener">S&iacute;lbaca</a> project. &copy; ' + year + '</p>' +
      '</div>' +
      '<div class="footer-right">' +
        FOOTER_RIGHT.map(([l, d]) => '<p>' + linkHTML(l, d) + '</p>').join('') +
      '</div>' +
    '</div>';
}

/* ============ ARTIST PREV / NEXT ============
   The artist page carries <body data-artist="<id>">; we find it in ARTISTS and
   fill <nav class="item-pagination"> with links to the previous and next
   entries (wrapping around the ends). Names come from the registry, so adding
   an artist re-links its neighbours with no page edits. */
function buildArtistNav(nav) {
  const id = document.body.dataset.artist;
  const n = ARTISTS.length;
  const i = ARTISTS.findIndex(a => a.id === id);
  if (i === -1 || n < 2) { nav.remove(); return; }   // unknown id, or nothing to page to

  /* Linear, non-wrapping: the first artist has no Previous, the last has no
     Next, interior artists get both. So with two artists each page shows a
     single link — the first (Yslas) shows only Next, the last (Hernández) only
     Previous — and it scales correctly if more artists are added. */
  const prev = i > 0 ? ARTISTS[i - 1] : null;
  const next = i < n - 1 ? ARTISTS[i + 1] : null;
  const item = (a, cls, label) => a
    ? '<a class="' + cls + '" href="/artists/' + a.id + '">' +
        '<span class="pag-label">' + label + '</span>' +
        '<span class="pag-title">' + a.name + '</span>' +
      '</a>'
    : '';

  nav.innerHTML = item(prev, 'pag-prev', 'Previous') + item(next, 'pag-next', 'Next');
}

/* ============ ARTISTS GRID ============
   Builds the portfolio grid on /artists from the registry, so a new artist
   shows up automatically. */
function buildArtistGrid(grid) {
  grid.innerHTML = ARTISTS.map(a =>
    '<a class="grid-item" href="/artists/' + a.id + '">' +
      '<img src="' + a.img + '" alt="' + a.name + '"' +
        (a.focus ? ' style="object-position:' + a.focus + '"' : '') + '>' +
      '<div class="overlay"></div>' +
      '<h3 class="portfolio-title">' + a.name + '</h3>' +
    '</a>').join('');
}

/* ============ MARQUEE — seamless ticker ============
   The 0 → -50% animation (css/style.css) only loops seamlessly if the first
   half of the track is at least as wide as the container — otherwise a gap
   opens at the wide desktop width and it snaps back. So we first repeat the
   authored content enough times to exceed the container ("one base"), then
   duplicate that base; -50% then advances exactly one base with no gap. The
   duration is derived from the base width so the scroll speed (px/sec) is the
   same at every viewport. Recomputed on font load and on resize. */
const MARQUEE_PPS = 60;   // scroll speed in pixels per second
function buildMarquees() {
  const items = [...document.querySelectorAll('.marquee')].map(m => ({
    m, track: m.querySelector('.track'), seed: m.querySelector('.track').innerHTML,
  }));
  function layout() {
    items.forEach(({ m, track, seed }) => {
      track.innerHTML = seed;                       // measure one authored set
      const one = track.scrollWidth;
      if (!one) return;
      const reps = Math.max(1, Math.ceil(m.clientWidth / one) + 1);
      const base = seed.repeat(reps);               // a base wider than the container
      track.innerHTML = base + base;                // two identical bases → seamless
      track.style.animationDuration = ((track.scrollWidth / 2) / MARQUEE_PPS) + 's';
    });
  }
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layout, 200); });
}

/* ============ HERO — concentric-ring parallax ============
   The hero image is drawn as concentric bands (an inner disc + rings radiating
   out; the outer ones run past the screen edge). Each band holds its own copy of
   the image and shifts with the pointer (touch on mobile), on both axes. The
   inner disc moves at `baseShift`; each ring outward adds `shiftPerRing`, so
   motion speeds up (and the image grows more disjointed) toward the edge. At
   rest every shift is 0 and the image is whole. The base .section-bg image is
   the fallback (JS off / reduced motion). The number of rings is computed so the
   outermost always clears the screen corner. */
const HERO = {
  innerDiv: 8.8,     // inner-disc radius = max(viewportW, viewportH) / innerDiv
  ringDiv: 15,       // each ring's width = max(viewportW, viewportH) / ringDiv
  baseShift: 14,     // px the inner disc shifts at full pointer deflection
  shiftPerRing: 10,  // extra px each ring adds outward (radiating speed-up)
  ease: 0.09,        // pointer-follow smoothing, 0–1 (smaller = laggier)
  feather: 0,        // px soft edge on the ring masks (0 = hard edges)
};
function buildHeroParallax() {
  const host = document.querySelector('.hero-parallax');
  if (!host) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const imgUrl = host.dataset.img || '';
  let rings = [];

  function build() {
    host.innerHTML = '';
    rings = [];
    const vw = host.clientWidth, vh = host.clientHeight;
    const maxDim = Math.max(vw, vh);
    const r0 = maxDim / HERO.innerDiv;         // inner-disc radius
    const rw = maxDim / HERO.ringDiv;          // outer-ring width
    const reach = Math.hypot(vw, vh) / 2 * 1.06;   // just past the screen corner
    const bands = 1 + Math.max(0, Math.ceil((reach - r0) / rw));   // disc + enough rings to cover
    const maxK = HERO.baseShift + (bands - 1) * HERO.shiftPerRing;
    const pad = maxK + 40;                     // oversize the image so shifts don't reveal edges
    const f = HERO.feather;
    for (let i = 0; i < bands; i++) {
      const rIn = i === 0 ? 0 : r0 + (i - 1) * rw;
      const rOut = i === 0 ? r0 : r0 + i * rw;
      const ring = document.createElement('div');
      ring.className = 'hero-ring';
      const mask = 'radial-gradient(circle at 50% 50%, ' +
        (rIn > 0 ? 'transparent ' + (rIn - f) + 'px, #000 ' + (rIn + f) + 'px, ' : '#000 0, ') +
        '#000 ' + (rOut - f) + 'px, transparent ' + (rOut + f) + 'px)';
      ring.style.webkitMaskImage = mask;
      ring.style.maskImage = mask;
      const im = document.createElement('div');
      im.className = 'hero-ring-img';
      im.style.backgroundImage = 'url("' + imgUrl + '")';
      im.style.inset = '-' + pad + 'px';
      ring.appendChild(im);
      host.appendChild(ring);
      rings.push({ im: im, k: HERO.baseShift + i * HERO.shiftPerRing });   // disc = baseShift; +shiftPerRing per ring out
    }
  }

  const clamp = (v) => Math.max(-1, Math.min(1, v));
  let tx = 0, ty = 0, cx = 0, cy = 0;   // pointer position, −1 … 1 on each axis
  function point(px, py) {
    const r = host.getBoundingClientRect();
    tx = clamp(((px - r.left) / r.width - 0.5) * 2);
    ty = clamp(((py - r.top) / r.height - 0.5) * 2);
  }
  addEventListener('pointermove', (e) => point(e.clientX, e.clientY));
  addEventListener('touchmove', (e) => {
    const t = e.touches[0]; if (t) point(t.clientX, t.clientY);
  }, { passive: true });

  function frame() {
    cx += (tx - cx) * HERO.ease;
    cy += (ty - cy) * HERO.ease;
    for (let i = 0; i < rings.length; i++) {
      rings[i].im.style.transform =
        'translate(' + (cx * rings[i].k) + 'px,' + (cy * rings[i].k) + 'px)';
    }
    requestAnimationFrame(frame);
  }

  build();
  frame();
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(build, 200); });
}

/* ============ NEWSLETTER ============
   Submit in the background, then show the thank-you note. A static host won't
   store it (see DOCUMENTATION §1.7). */
function wireNewsletter() {
  const box = document.querySelector('.newsletter');
  if (!box) return;
  const form = box.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new URLSearchParams(new FormData(form));
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data })
      .catch(() => { /* no form backend — ignore */ })
      .finally(() => box.classList.add('submitted'));
  });
}

/* ============ FAQ close animation ============
   Opening is pure CSS: the answer is only rendered once <details> is open, so a
   keyframe plays the moment it appears (css/style.css). Closing can't work that
   way — the browser drops the content the instant `open` is removed, so it would
   snap shut with nothing left to animate.

   So on a close click we cancel the default, keep the panel open, add `.closing`
   to play the reverse animation, and only then set open = false. Result: the
   same 0.34s slide in both directions. Under prefers-reduced-motion we don't
   intervene at all and it closes instantly. */
function wireFaq() {
  const CLOSE_MS = 500;   // safety net > the CSS animation (0.34s)
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.faq details').forEach((d) => {
    const summary = d.querySelector('summary');
    const answer = d.querySelector('.faq-answer');
    if (!summary || !answer) return;

    summary.addEventListener('click', (e) => {
      if (!d.open || reduced.matches) return;      // opening: CSS handles it
      if (d.classList.contains('closing')) return; // already animating out
      e.preventDefault();                          // hold it open while we animate
      d.classList.add('closing');

      let timer;
      const finish = (ev) => {
        if (ev && ev.animationName !== 'faq-hide') return;
        clearTimeout(timer);
        answer.removeEventListener('animationend', finish);
        d.classList.remove('closing');
        d.open = false;
      };
      answer.addEventListener('animationend', finish);
      // if the animation never fires, close anyway rather than stick open
      timer = setTimeout(finish, CLOSE_MS);
    });
  });
}

/* ============ boot ============ */
function init() {
  document.querySelectorAll('.site-header').forEach(buildHeader);
  document.querySelectorAll('.site-footer').forEach(buildFooter);
  document.querySelectorAll('[data-artist-nav]').forEach(buildArtistNav);
  document.querySelectorAll('[data-artist-grid]').forEach(buildArtistGrid);
  buildMarquees();
  buildHeroParallax();
  wireNewsletter();
  wireFaq();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

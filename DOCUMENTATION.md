# Site Documentation

The hand-coded static rebuild of **alkabil.audio**. No frameworks, no build
step: plain HTML pages, one stylesheet, one small script. Everything you'd
normally do in Squarespace's editor is a text edit here.

Contents:

1. **[Quick recipes](#1-quick-recipes)** — the edits you'll actually make
   - [1.1 Add a new artist page (the full walkthrough)](#11-add-a-new-artist-page-the-full-walkthrough)
     - [1.1.1 How the pieces connect](#111-how-the-pieces-connect)
     - [1.1.2 The two steps to add an artist](#112-the-two-steps-to-add-an-artist)
     - [1.1.3 Setting (or changing) the artist's release](#113-setting-or-changing-the-artists-release)
     - [1.1.4 Artist images — where they go and how big](#114-artist-images--where-they-go-and-how-big)
   - [1.2 Change the newest release (home page)](#12-change-the-newest-release-home-page)
   - [1.3 Edit the FAQ (Info page)](#13-edit-the-faq-info-page)
   - [1.4 Change colors](#14-change-colors)
   - [1.5 The marquees](#15-the-marquees)
   - [1.6 Fonts](#16-fonts)
   - [1.7 The newsletter form](#17-the-newsletter-form)
   - [1.8 Add a whole new top-level page](#18-add-a-whole-new-top-level-page)
   - [1.9 The header, footer, and nav are one-edit](#19-the-header-footer-and-nav-are-one-edit-jssitejs)
   - [1.10 Bring back the Merch page](#110-bring-back-the-merch-page)
   - [1.11 Change the height of things](#111-change-the-height-of-things)
   - [1.12 Artist page: bio width and name size](#112-artist-page-bio-width-and-name-size)
   - [1.13 Release-cover "window" shape (the tilted square)](#113-release-cover-window-shape-the-tilted-square)
   - [1.14 Writing HTML here — a mini style guide](#114-writing-html-here--a-mini-style-guide)
   - [1.15 The hero concentric-ring parallax](#115-the-hero-concentric-ring-parallax)
   - [1.16 The film-grain / static overlay](#116-the-film-grain--static-overlay)
2. **[How the site is organized](#2-how-the-site-is-organized)**
3. **[Deploy and local preview](#3-deploy-and-local-preview)**
4. **[Links and URLs](#4-links-and-urls)**
5. **[Troubleshooting](#5-troubleshooting)**
6. **[Changelog](#6-changelog)**

---

## 1. Quick recipes

### 1.1 Add a new artist page (the full walkthrough)

Artist pages are the **only** subpages on the site. Each artist is one HTML file
in the `artists/` folder (this mirrors the jehernandez site's `work/`):

```
artists.html              ← the portfolio grid — the list of all artists
artists/
  yslas.html              ← one artist page
  jehernandez.html        ← one artist page
```

#### 1.1.1 How the pieces connect

There is **one source of truth** for who the artists are — the `ARTISTS` array
near the top of `js/site.js`:

```js
const ARTISTS = [
  { id: 'yslas',       name: 'Yslas',          img: 'assets/yslas.jpg' },
  { id: 'jehernandez', name: 'J.E. Hernández', img: 'assets/hernandez.jpg' },
];
```

Each entry has three fields:

- **`id`** — the URL/filename slug. The page must be `artists/<id>.html` and the
  page's `<body data-artist="<id>">` must match. Lowercase, no spaces.
- **`name`** — what visitors see (in the grid tile and in the Prev/Next links).
  Accented characters are fine here (it's JS, not HTML) — `J.E. Hernández`.
- **`img`** — the photo shown in the portfolio grid, written root-relative
  (`assets/…`). `js/site.js` rewrites the path for page depth automatically, so
  you always write it as if from the site root.

This one array drives **both**:

1. the **portfolio grid** on `artists.html` (each entry becomes a tile), and
2. the **Previous / Next** navigation at the bottom of every artist page.

The **order of the array is the running order.** Paging is linear and does
**not** wrap: the first artist shows only a "Next" link, the last shows only a
"Previous", and anyone in the middle shows both. (With today's two artists,
Yslas is first → shows only Next; Hernández is last → shows only Previous.)
Reorder the array to reorder the grid and the paging; you don't touch any page
to do it.

#### 1.1.2 The two steps to add an artist

**Step 1 — register them.** Add one line to `ARTISTS` in `js/site.js`. Put it in
the position you want them to appear in the grid and the paging order:

```js
const ARTISTS = [
  { id: 'yslas',       name: 'Yslas',          img: 'assets/yslas.jpg' },
  { id: 'newartist',   name: 'New Artist',     img: 'assets/newartist.jpg' },
  { id: 'jehernandez', name: 'J.E. Hernández', img: 'assets/hernandez.jpg' },
];
```

Drop the grid photo into `assets/` first (see §1.1.4 for size/format).

**Step 2 — create the page.** Copy an existing artist file (e.g.
`artists/yslas.html`) to `artists/newartist.html` and edit it. The parts to
change, top to bottom:

- **`<title>`** in the `<head>`: `New Artist &mdash; ALKABIL`.
- **`<body … data-artist="newartist">`** — this must equal the `id`. This is how
  the page knows which artist it is (for Prev/Next). If it's wrong or missing,
  the Prev/Next bar simply won't render.
- **Bio section** (`<section>` with the `artist-bio` block):
  - `<h1>` — the artist's name. Use HTML entities for accents in HTML
    (`Hern&aacute;ndez`).
  - one or more `<p>` — the bio copy.
  - `<p class="artist-links">` — the external links (website, instagram, …),
    each a normal `<a href>`; remove or add `<a>`s freely.
- **Banner section** (`artist-banner`): swap the `<img src>` to the artist's
  wide banner photo. **Paths inside `artists/` start with `../`**, e.g.
  `../assets/newartist-banner.jpg`.
- **Release section** — covered in detail next (§1.1.3).
- **Leave** `<nav class="item-pagination" data-artist-nav></nav>` exactly as is
  — `js/site.js` fills in the Prev/Next links from the registry.
- The header (`<header class="site-header">`) and footer
  (`<footer class="site-footer">`) are empty shells filled by the script —
  don't put anything in them.

That's it. You never edit the other artists' pages, and the grid on
`artists.html` picks the new artist up automatically.

#### 1.1.3 Setting (or changing) the artist's release

The release block sits at the bottom of the artist page, before the Prev/Next
nav. It has four editable parts:

```html
<section class="page-section theme-white section-height--medium">
  <div class="fgrid">
    <!-- the cover art -->
    <div class="blk release-cover clip-diamond" style="--gd: 3/15/22/26;">
      <img src="../assets/newartist-cover.jpg" alt="Release title cover">
    </div>
    <!-- the title -->
    <div class="blk" style="--gd: 5/2/10/13;">
      <h2 class="release-title">release title here</h2>
    </div>
    <!-- the blurb -->
    <div class="blk release-desc" style="--gd: 10/2/16/13;">
      <p>A sentence or two about the release…</p>
    </div>
    <!-- the button -->
    <div class="blk" style="--gd: 16/2/18/6;">
      <a class="btn" href="https://tr.ee/…" target="_blank" rel="noopener">LISTEN/BUY</a>
    </div>
  </div>
</section>
```

To **change the release**, edit in place:

1. **Cover art** — replace the `<img src>` (drop the file in `assets/`, path
   starts with `../`). Covers are square; the `clip-diamond` class shows it
   through a tilted-square window (§1.13 — remove that class for a plain
   square).
2. **Title** — the `<h2 class="release-title">`. It's forced to lowercase by CSS
   (`text-transform`); type it however you like.
3. **Blurb** — the `<p>` inside `release-desc`. Add more `<p>`s for more
   paragraphs; wrap a phrase in `<em>…</em>` for italics; links are normal
   `<a href>`.
4. **Button** — the `.btn` link. Point `href` at the release's Linktree /
   Bandcamp / store URL. If nothing is out yet, use `href="#"` and change the
   text to e.g. `coming soon` (see Yslas' page for the "no release yet" version).

The `--gd` values position each block on the desktop grid (row/col numbers, see
§2 and §1.11); leave them unless you want to move things. On mobile the blocks
just stack in source order.

#### 1.1.4 Artist images — where they go and how big

Two images per artist, both in `assets/`:

- **Grid photo** (the `img` in the registry) — shown in the portfolio tile,
  cropped to fill (`object-fit: cover`), roughly portrait. ~800–1200 px on the
  short side is plenty.
- **Banner photo** (the `<img>` in `artist-banner`) — a wide, full-bleed strip
  ~88vh tall; use a landscape/large image, ~1500 px wide.

You can use the **same file** for both if it crops acceptably in each spot.
Keep files web-sized (long edge ~1500 px, JP\[E]G quality ~80, aim < ~350 KB) —
compress big originals before adding them. (For reference, the Hernández photo
was made from a high-res original scaled to 1500 px wide at quality 80 ≈
295 KB.)

**Crop anchoring (`object-fit: cover`).** Both the grid tile and the banner crop
the photo to fill their box, centred by default. For a tall portrait/headshot
that means the *middle* of the photo (chest) can end up framed and the face cut
off. Anchor the crop upward instead:

- **Grid tile**: add an optional **`focus`** to the artist's registry entry — a
  CSS `object-position` value. `'center 12%'` pulls the crop near the top so the
  face shows (see Hernández's entry). Omit it to keep the default centre.
- **Banner**: set it inline on that page's banner `<img>`, e.g.
  `style="object-position: center 12%;"` (Hernández's page does this).

Smaller percentage = higher anchor (nearer the top of the photo).

### 1.2 Change the newest release (home page)

In `index.html`, the last section before the footer:

- **Cover**: replace `assets/cover-2kx2k.jpg` (or add a new file and update
  the `<img src>` in the `release-cover` block). Square, ~1500–2500 px.
- **Link**: the `<a href>` around the cover — currently the release's
  Linktree (`tr.ee/...`).
- The "NEWEST ///" and "release \\\" marquees don't need touching; to change
  their words see §1.5.

### 1.3 Edit the FAQ (Info page)

`info.html`, the SOME ANSWERS section. Each Q&A is a native
`<details>` block:

```html
<details>
  <summary>THE QUESTION?</summary>
  <div class="faq-answer"><p>The answer.</p></div>
</details>
```

Add or remove whole `<details>` blocks; the +/× icon and the divider lines
come from CSS (`.faq` in `css/style.css`), no JS involved.

### 1.4 Change colors

Top of `css/style.css`:

```css
--white / --black        the two poles
--accent                 the light-gray "bright" section background (85%)
--light-accent, --dark-accent
--hero-red               dark red pulled from the hero photo, as R,G,B numbers
                         (not a hex) so it can be used as rgba(var(--hero-red), a)
```

Sections pick their palette with a theme class on the `<section>`:
`theme-black` (white on black), `theme-white` (black on white),
`theme-bright` (black on light gray) — same trio as the Squarespace themes
the original used.

**The red frosted bars.** Both the fixed desktop **header** (`.site-header`) and
the full-screen mobile **menu** (`.mobile-menu`) share the same tint —
`rgba(var(--hero-red), 0.72)` over a backdrop blur. Note the alpha is
deliberately high: they sit over the **dark** hero, and a red at low opacity
composites down to near-black there (so it *looks* black) — keep it around `0.7`
for the red to read, or change `--hero-red` itself to re-tint both at once.

### 1.5 The marquees

A marquee is:

```html
<div class="marquee" style="--speed: 26s;">
  <div class="track" aria-hidden="true">
    <span>WORD ///</span><span>WORD ///</span>...
  </div>
</div>
```

The `track` scrolls left by half its width and loops, so **the spans must
repeat enough times to fill the screen twice** (six copies is plenty).
`--speed` is the loop duration — smaller is faster. Add class `reverse` to
scroll right instead. Respects `prefers-reduced-motion`.

(The 404 page has its own inlined copy of this CSS — if you retune the
marquee look, mirror it there.)

### 1.6 Fonts

Everything is set in **Academico**, self-hosted as four woff2 files in
`assets/fonts/` (regular / bold / italics — the same files as the
jehernandez site). It's a stand-in until a proper replacement for the
original site's minerva-modern (headings) and anziano (body) is chosen.

To swap in a different font later:

1. Drop its woff2 files in `assets/fonts/`.
2. Copy the four `@font-face` blocks at the top of `css/style.css`, point
   them at the new files with a new family name.
3. Put that name in `--heading-font` and/or `--body-font` (the two fonts can
   differ, as they did on Squarespace). Headings are automatically
   uppercased (`text-transform` on the `h1–h4` rule) — remove that line if
   the new heading font shouldn't be.

Font URLs inside the CSS are relative to the CSS file, so they work at any
deploy depth; nothing else needs touching.

### 1.7 The newsletter form

`info.html`. As shipped, submitting shows "Thank you!" (handled in
`js/main.js`) and — on Netlify — is stored by Netlify Forms (the form carries
`data-netlify="true"`). **GitHub Pages has no form backend**, so on GitHub
Pages the thank-you appears but nothing is stored. To make it real there, use
a mail-in form service (e.g. Web3Forms, like the jehernandez site's contact
form): add your access key as a hidden input, point the `fetch()` in
`js/main.js` at `https://api.web3forms.com/submit`, and allow that origin in
`_headers`' `connect-src`/`form-action` if you also deploy to Netlify.

### 1.8 Add a whole new top-level page

1. Create `newpage.html` **in the root folder** (copy `info.html` for the
   scaffold — the empty `<header>`/`<footer>` shells and the `<script>` tag —
   and gut the `<main>`). Only artist pages live in a subfolder; everything
   else is a root-level `.html` file.
2. Build sections as `<section class="page-section theme-...">` containing a
   `.fgrid` with `.blk` children (see §2 for the grid).
3. Link it from the nav by adding a line to `NAV_LINKS` in `js/site.js` — that
   updates the header and mobile menu on **every** page at once (see §1.9).

### 1.9 The header, footer, and nav are one-edit (js/site.js)

The header, mobile menu, and footer are **injected by `js/site.js`** into empty
shells (`<header class="site-header">`, `<footer class="site-footer">`), so
their contents live in one place instead of being copied into every page:

- **Nav links** (header + mobile menu): the `NAV_LINKS` array.
- **Footer** columns: `FOOTER_LEFT` / `FOOTER_RIGHT`; the `© <year>` fills
  itself from the current date, so it never needs editing.
- The script also detects page depth (root vs. `artists/`) and prefixes every
  internal link/asset automatically — no per-page or `../` bookkeeping.

Edit those arrays once and every page updates. (If a page ever shows a bare
missing header/footer, its `<script src=".../site.js">` tag didn't load.)

### 1.10 Bring back the Merch page

The Merch page was deliberately left out of this rebuild. Its URL is covered
by two placeholders — replace/delete when you build the real thing:

- `merch.html` (meta-refresh → Bandcamp)
- the `/merch` line in `_redirects` (Netlify only)

Then build `merch.html` like any page (§1.8) and add "Merch" back to the
header nav and mobile menu in every page.

### 1.11 Change the height of things

Heights come from three mechanisms, depending on what you're resizing:

**a) Whole sections** use a size class on the `<section>`:

| Class                     | What it does                                   |
| ------------------------- | ---------------------------------------------- |
| `section-height--large`   | `min-height: 100vh` (full screen — the hero)   |
| `section-height--medium`  | `4rem` top/bottom padding around its content   |
| `section-height--small`   | `2rem` top/bottom padding                       |
| *(no class)*              | height is just whatever the content needs      |

Swap the class on a section to change its band of vertical space, or edit the
numbers in `css/style.css` (search `section-height--`). To make the hero *not*
full-screen, change `.section-height--large { min-height: 100vh; }` (e.g. to
`80vh`).

**b) A single block inside a section** (desktop) gets its height from how many
grid **rows** its `--gd` spans. `--gd` is `row-start / col-start / row-end /
col-end`; a bigger gap between row-start and row-end = taller. One row is
`--row-h`, currently ~2.15% of the content width (`--row-h` in the
`@media (min-width: 768px)` block of `css/style.css`) — raise that factor to
make every row (and thus the whole desktop grid) taller. On mobile the `--gd`
rows are ignored and blocks size to their content.

**c) Specific fixed-height elements** have their own rule in `css/style.css`:

- **Artist banner strip**: `.artist-banner { height: 88vh; }`
- **Portfolio grid** (artists page): `.portfolio-grid { min-height: 100vh; }`,
  and on mobile each tile is `.portfolio-grid .grid-item { min-height: 50vh; }`
- **Hero**: the `section-height--large` above.

Change the value in the rule to resize.

### 1.12 Artist page: bio width and name size

**Width of the name + bio.** On desktop, the bio block's width is set by its
grid area — the `--gd` on the `artist-bio` div in each artist page:

```html
<div class="blk artist-bio" style="--gd: 2/4/14/22;">
```

The two **column** numbers (here `4` … `22`) are the left and right edges on the
24-column grid. Columns run **1–27**, where 1 and 27 are the outer gutters, so
usable content lives in **2–26**. So:

- **Wider** → smaller col-start / larger col-end (e.g. `2/3/14/25`, or full
  content width `2/2/14/26`).
- **Narrower** → move them inward (the old value was `…/8/…/20`).

Change it on each artist page independently. (On mobile the grid areas are
ignored and the bio is full-width with gutters regardless.)

**Name size.** The artist name is deliberately about half the normal `h1`. It's
set once in `css/style.css`:

```css
.artist-bio h1 { font-size: clamp(1.8rem, 6vw, 2.5rem); }
```

`clamp(min, fluid, max)` means it scales with the viewport (`6vw`) but never
below `1.8rem` or above `2.5rem`. Raise or lower the `2.5rem` **max** to resize
the name on desktop; raise/lower the `1.8rem` **min** for the smallest screens.

### 1.13 Release-cover "window" shape (the tilted square)

Each release cover can be shown through a tilted-square **window** — a
45°-rotated square (a diamond) — instead of a plain square. It's a CSS
`clip-path`, so it's lean and needs no image editing.

**Turn it on/off per cover:** add or remove the `clip-diamond` class on the
cover's `.release-cover` div:

```html
<div class="blk release-cover clip-diamond" style="--gd: 5/8/21/20;">
  <a href="…"><img src="assets/cover.jpg" alt="…"></a>
</div>
```

Remove `clip-diamond` → the full square shows again. It's applied to **both
artist release covers** today; the home page's newest-release cover is left a
plain square on purpose.

**Change the album image:** just swap the `<img src>` inside `.release-cover`
(square art works best; the window crops the four corners).

**Change the window shape:** edit the polygon in `css/style.css`:

```css
.release-cover.clip-diamond img {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);   /* diamond */
}
```

The polygon is a list of `x% y%` corner points. Examples to drop in:

- Diamond (current): `polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)`
- Hexagon: `polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)`
- Chamfered/cut corners: `polygon(12% 0, 88% 0, 100% 12%, 100% 88%, 88% 100%, 12% 100%, 0 88%, 0 12%)`
- Circle instead: swap the whole line for `border-radius: 50%;` (and delete the
  clip-path). 

To make a **new** named window (so different covers can use different shapes),
copy the rule under a new class (e.g. `.release-cover.clip-hex img { … }`) and
put that class on the cover instead of `clip-diamond`.

### 1.14 Writing HTML here — a mini style guide

The site is plain HTML/CSS; a few conventions keep it consistent:

- **Links are relative and point at real files** — `href="info.html"`,
  `href="artists/yslas.html"`; from inside `artists/`, go up first:
  `href="../info.html"`. There are no clean slugs (see §4). Use `mailto:` for
  email and full `https://…` for off-site, always with
  `target="_blank" rel="noopener"` for external links.
- **Section skeleton** — a page's content is a stack of
  `<section class="page-section theme-…">`, each containing a `.fgrid`, each
  holding `.blk` children placed with `--gd` (§2). Reuse an existing section as
  a template rather than writing grid CSS by hand.
- **Themes** — `theme-black` (white on black), `theme-white` (black on white),
  `theme-bright` (black on light gray). Set the mood by the class on the
  section; don't set colors inline.
- **Headings** are auto-uppercased by CSS — type them normally; use
  `<h1>`…`<h4>` for scale (§1.4 / §2). Accented letters in HTML use entities
  (`&aacute;`, `&ntilde;`, `&mdash;`).
- **Images**: put files in `assets/`, keep them web-sized (§1.1.4), always give
  a meaningful `alt` (or empty `alt=""` for purely decorative ones).
- **Repeated chrome is injected, not copied** — header, mobile menu, and footer
  come from `js/site.js` (§1.9); artist grid and Prev/Next come from the
  `ARTISTS` registry (§1.1). Edit those in one place, never per page.
- **Full-bleed background photo**: a `<div class="section-bg"><img …></div>` as
  the first child of a section (see the hero and newest-release sections).
- **Keep source order = reading order** — mobile ignores the desktop `--gd`
  grid and simply stacks blocks in the order they appear in the HTML.

### 1.15 The hero concentric-ring parallax

The top image on the home page is drawn as a set of **concentric rings** — an
inner disc plus rings radiating out, the outermost running past the screen edge.
Each ring holds its own copy of the image and slides with the pointer on **both
axes** (touch on mobile): the inner disc moves at a base speed and each ring
outward moves faster, so the image breaks into rings that shear against each
other, more toward the edge. At rest (pointer centred) every shift is zero and
the image is seamless. The ring count is computed automatically so the outermost
always clears the screen corner, whatever the window's size/shape.

**Markup** (`index.html`, in the hero section):

```html
<div class="section-bg"><img src="assets/alkabil-web-1.jpg" alt=""></div>
<div class="hero-parallax" data-img="assets/alkabil-web-1.jpg" aria-hidden="true"></div>
```

The `.section-bg` image is the **fallback** shown when JavaScript is off or the
visitor has *reduce motion* set; the `.hero-parallax` div is what `js/site.js`
fills with rings. Keep `data-img` pointing at the **same** file as the base
image (change both to change the hero photo).

**Tuning** — all knobs are the `HERO` object near the middle of `js/site.js`:

| Key            | Meaning                                                        |
| -------------- | ------------------------------------------------------------- |
| `innerDiv`     | inner-disc radius = `max(viewportW, viewportH) / innerDiv`. **Bigger number = smaller inner circle.** |
| `ringDiv`      | each ring's width = `max(viewportW, viewportH) / ringDiv`. **Bigger number = thinner rings** (and, since the count is auto, more of them). |
| `baseShift`    | px the inner disc slides at full pointer deflection — the base speed all rings build on. |
| `shiftPerRing` | extra px each ring adds outward — the radiating speed-up and how disjointed the shear looks. |
| `ease`         | pointer-follow smoothing, 0–1 (smaller = laggier, dreamier).  |
| `feather`      | px softness on each ring's edge. `0` = hard edges (as now); raise it to soften/anti-alias. |

(The number of rings is derived from `innerDiv`/`ringDiv` and the viewport — you
don't set it.)

Rings, their masks, and the image size recompute on resize. The effect is
disabled automatically under `prefers-reduced-motion`. The ring look (scrim,
overflow) is in `css/style.css` under "Hero concentric-ring parallax".

### 1.16 The film-grain / static overlay

Any section with a background image can carry an animated **grain/static**
overlay. It's a `<div class="grain">` placed after the section's `.section-bg`
and before its `.fgrid`:

```html
<div class="section-bg"><img src="assets/alkabil-web-5.jpg" alt=""></div>
<div class="grain" aria-hidden="true"></div>
<div class="fgrid"> … </div>
```

It's on the newest-release section today. To add it elsewhere, drop the same
`<div class="grain">` into another image section in the same spot. The noise is
a procedural inline SVG (`feTurbulence`, desaturated to grey) — **no image
asset**. All of it lives in the `.grain` rule and the `grain-flicker`
keyframes in `css/style.css`:

- **Strength**: `opacity` (currently `0.82`) — lower for subtler.
- **Grain size**: `background-size` (`130px`) — smaller = finer.
- **How busy the static is**: the `animation` duration/steps
  (`0.5s steps(4)`) — fewer/slower steps = calmer. Set `animation: none` for a
  still grain. It already stops under `prefers-reduced-motion`.
- **Blend**: `mix-blend-mode: overlay` — try `soft-light` (gentler) or
  `screen` (brighten-only).

---

## 2. How the site is organized

```
index.html                  home
artists.html                artists portfolio grid
info.html                   info / FAQ / newsletter
merch.html                  placeholder → Bandcamp (see §1.10)
404.html                    not-found page, fully self-contained
artists/
  yslas.html                artist page
  jehernandez.html          artist page
css/style.css               the whole design system (incl. @font-face)
js/site.js                  injects header/menu/footer, artist grid +
                            prev/next (from the ARTISTS registry), the
                            copyright year, seamless marquees, newsletter
assets/                     all images
assets/favicon.png          browser-tab icon (256×256, from the label mark)
assets/fonts/               Academico woff2 (self-hosted)
tools/make-favicon.py       regenerates assets/favicon.png from logo-white.png
_source/                    reference copies of the original Squarespace
                            pages this was rebuilt from (not linked
                            anywhere — safe to delete or .gitignore)
.nojekyll                   tells GitHub Pages not to run Jekyll
_headers, _redirects        Netlify-only (ignored by GitHub Pages)
```

**Favicon.** Every page links `assets/favicon.png` as `type="image/png"`. It's
a 256×256 PNG rendered from the label mark (`assets/logo-white.png`) — white on
a black square so it reads in both light and dark browser tabs. Regenerate it
after changing the logo with `python tools/make-favicon.py` (needs Pillow).
Note: a `.png` referenced as `image/png` is deliberate — the earlier build
shipped a PNG misnamed `favicon.ico`, which browsers refused to decode as an
icon and so showed no favicon at all.

**The grid.** The original Squarespace "fluid engine" laid blocks on a
24-column grid; the rebuild keeps those exact placements. A section's content
is a `.fgrid` (24 columns + a gutter column each side, 11 px gaps, row height
~2.15% of the container). Each `.blk` child carries its desktop placement in
an inline custom property:

```html
<div class="blk" style="--gd: 10/8/26/20;">   <!-- rows 10–26, cols 8–20 -->
```

The four numbers are `row-start / col-start / row-end / col-end`, columns
1–27 (1 and 27 are the gutters, so content lives in 2–26). **On mobile
(<768 px) the grid areas are ignored** and blocks simply stack full-width in
document order — so keep the HTML in reading order.

**Header, mobile menu, and footer are injected by `js/site.js`** into empty
shells on each page (see §1.9), so the nav/footer live in one place. Pages
carry only `<header class="site-header"></header>` and
`<footer class="site-footer"></footer>`; the script fills them and prefixes
links for depth, so there's no per-page or `../` bookkeeping for those.

**The header is fixed and always on top** (`position: fixed; z-index: 1000`),
so it persists as content scrolls under it. It's a translucent frosted bar — a
semi-transparent dark backdrop (`background: rgba(0,0,0,0.55)`) with a
`backdrop-filter: blur()` — carrying white nav/brand text. The dark backdrop
gives consistent contrast over every section (dark hero, white pages, gray
accent), so no page sets its own header color; tune the bar's darkness via that
`rgba` alpha in `css/style.css`. Pages whose content begins at the very top add
`padding-top: var(--header-h)` to their first section so nothing hides under the
fixed bar.

**Section themes** (`theme-black` / `theme-white` / `theme-bright`) set
background + text color; a `section-bg` div with an `<img>` inside makes a
full-bleed background photo (home hero and newest-release sections).

---

## 3. Deploy and local preview

**GitHub Pages** (the plan): push this folder to a GitHub repo →
Settings → Pages → deploy from branch. Already in place:

- `.nojekyll` — stops Jekyll from mangling files/skipping underscored paths;
- `404.html` — picked up automatically;
- **relative paths everywhere** — the site works both as a *project* page
  (`user.github.io/repo/`) and on a custom domain at the root;
- custom domain: enter `alkabil.audio` (or `www.`) in the Pages settings —
  **GitHub writes the `CNAME` file into the repo itself**, which is why this
  repo doesn't ship one — then point the domain's DNS at GitHub Pages and
  tick "Enforce HTTPS".

**Netlify** also works as-is: drag the folder onto app.netlify.com.
`_headers` (security headers/CSP) and `_redirects` (/merch, /cart) only take
effect there, and the newsletter form gets stored by Netlify Forms.

**Local preview**: because every path is relative, double-clicking
`index.html` works. A local server is still closer to production:

```
cd alkabil-clone
python -m http.server 8000
# → http://localhost:8000
```

---

## 4. Links and URLs

**No clean slugs yet** — every link points at its `.html` file:

| Old (Squarespace)        | Here                            |
| ------------------------ | ------------------------------- |
| `/`                      | `index.html`                    |
| `/artists`               | `artists.html`                  |
| `/artists/yslas`         | `artists/yslas.html`            |
| `/artists/jehernandez`   | `artists/jehernandez.html`      |
| `/info`                  | `info.html`                     |
| `/merch`                 | `merch.html` → Bandcamp (§1.10) |

All internal links are **relative**: root pages use `info.html`,
`artists/yslas.html`; artist pages use `../info.html` and plain filenames
for siblings (`jehernandez.html`). No link or asset path starts with `/` —
that's what lets the site run from any base (project page, custom domain,
subfolder, `file://`).

If clean URLs matter later (to match the old Squarespace paths exactly):
GitHub Pages and Netlify both serve `x.html` at `/x`, so the move is simply
rewriting internal links from `x.html` to `/x` — but that reintroduces the
served-at-root requirement, so do it only once the site lives at
`alkabil.audio` proper.

---

## 5. Troubleshooting

- **Plain unstyled text and a giant Instagram icon** — the stylesheet didn't
  load. In this rebuild all paths are relative, so this shouldn't happen
  from any location; if you reintroduce root-absolute paths (`/css/...`),
  they only resolve when the site is served at a domain root.
- **Fonts look like a plain serif (Georgia)** — the Academico woff2 files
  didn't load; check `assets/fonts/` made it into the deploy.
- **A block sits in the wrong place on desktop** — check its `--gd` values;
  remember columns run 1–27 including the two gutter columns (§2).
- **Newsletter "Thank you!" but no email collected** — expected on GitHub
  Pages until a form backend is wired (§1.7).
- **Nav/footer change not showing** — those come from `js/site.js` (edit
  `NAV_LINKS` / `FOOTER_*` once, §1.9); if a page shows no header/footer at
  all, its `<script src=".../site.js">` tag didn't load.
- **A new artist doesn't appear** — add them to the `ARTISTS` array in
  `js/site.js` and make sure the page's `<body data-artist>` matches the
  `id` (§1.1).
- **merch.html shows Bandcamp** — that's the placeholder (§1.10).

---

## 6. Changelog

### 2026-07-17 — desktop header matches the red menu overlay

- The fixed desktop header bar switched from `rgba(0,0,0,0.55)` black to the same
  dark-red frosted overlay as the mobile menu (`rgba(var(--hero-red), 0.72)` +
  14px blur).

### 2026-07-17 — parallax back to both axes, redder menu, TOC subheadings

- Hero parallax restored to **both-axis** pointer displacement (the vertical-only
  experiment reverted); magnitude kept at `baseShift` 14 / `shiftPerRing` 10.
- Film-grain overlay strengthened again (`opacity` 0.62→0.82).
- Mobile-menu overlay alpha raised (0.3→0.72) so the dark red actually reads over
  the dark hero instead of compositing to black.
- Documentation: expanded the table of contents with nested links to every
  subsection (1.1–1.16, incl. 1.1.1–1.1.4).

### 2026-07-17 — vertical parallax, stronger grain, crop anchoring

- Hero parallax now displaces each ring **vertically**, driven by the pointer's
  vertical position, and more dramatically (`baseShift` 8→14, `shiftPerRing`
  5→10).
- Film-grain overlay intensity raised (`opacity` 0.4→0.62).
- `clip-diamond` removed from the home newest-release cover — the window crop is
  now **artist release covers only**.
- Artist photos can anchor their crop upward via a per-artist `focus`
  (`object-position`): grid via the registry, banner inline. Set Hernández's to
  `center 12%` so the face shows instead of the chest (§1.1.4).

### 2026-07-17 — hero parallax refinements

- Smaller rings: inner disc ~85% of before (`innerDiv`), outer rings ~half width
  (`ringDiv`); the ring count is now derived so the outermost still clears the
  screen corner (config keys changed from `rings`/`spacingDiv`).
- Hard ring edges (`feather: 0`).
- Displacement reworked so the inner disc keeps its previous speed (`baseShift`)
  and each ring adds `shiftPerRing` outward — a subtler radiating speed-up with a
  more disjointed shear between rings.

### 2026-07-17 — hero ring parallax + film-grain overlay

- **Hero concentric-ring parallax**: the home top image now renders as 8
  concentric bands (inner disc + rings past the screen edge) that slide with the
  pointer/touch, each by more the further out it is. Built by `buildHeroParallax`
  in `js/site.js` (tunable `HERO` config); base image is the reduced-motion / no-JS
  fallback. See §1.15.
- **Film-grain / static overlay**: added a reusable `<div class="grain">`
  (procedural desaturated `feTurbulence`, animated) over the newest-release
  background image. Pure CSS, no asset. See §1.16.
- Both honour `prefers-reduced-motion`.

### 2026-07-17 — red menu, diamond covers, headshot, wider bio, docs

- Mobile menu overlay recolored to a dark red drawn from the index hero image
  (`--hero-red` in `css/style.css`) at half the previous opacity (0.6 → 0.3).
- Release covers can now be shown through a tilted-square window
  (`clip-diamond` class / `clip-path`), applied to the home newest cover and
  both artist release covers; toggle/customize per §1.13.
- Replaced the Hernández photo with the headshot from the jehernandez site,
  regenerated at 1500×2000 (~295 KB) from the high-res original; used for both
  the grid tile and the banner (one file, `assets/hernandez.jpg`).
- Artist bio widened (grid area `…/8/…/20` → `…/4/…/22`) and the artist name
  shrunk to ~half (`.artist-bio h1` clamp, max 2.5rem); both are now documented
  as adjustable (§1.12).
- Mobile hero content nudged down ~15vh so it no longer sits dead-centre.
- Docs expanded: full add-an-artist walkthrough incl. the release (§1.1),
  element-height guide (§1.11), bio-width/name-size guide (§1.12), release
  window-shape guide (§1.13), and a mini HTML style guide (§1.14).

### 2026-07-17 — header frosted bar, marquee section spacing

- **Header is now a translucent frosted bar** (semi-transparent dark background
  + blur) instead of a fully transparent `mix-blend-mode: difference` element —
  the blend approach had no actual backdrop, so there was nothing behind the
  sticky top bar on desktop or mobile. White text on the dark bar stays legible
  over every section; tune via the `rgba` alpha on `.site-header`.
- Newest-release section: fixed the excess space *above* "NEWEST ///" (the prior
  spacing pass had pushed the band down, leaving empty rows at the top). NEWEST
  now sits at the top with the cover and "release \\\" pulled up beneath it, so
  the tightened text-to-cover spacing stays but the top gap is gone.

### 2026-07-17 — favicon, menu, nav, mobile hero, marquee spacing

- **Favicon fixed.** The old `favicon.ico` was a 2500×2209 PNG misnamed `.ico`,
  which browsers wouldn't render. Replaced with a proper 256×256
  `assets/favicon.png` (white mark on black) generated by
  `tools/make-favicon.py`; every page now links it as `image/png`.
- Mobile menu overlay dropped from 90% to 60% black (plus a stronger blur) so
  the translucency is actually visible — at 90% over the dark hero it read as
  solid.
- Artist paging is now linear/non-wrapping: first artist shows only Next, last
  shows only Previous (so Yslas → Next, Hernández → Previous), interior artists
  show both. Still driven by the `ARTISTS` registry.
- Mobile hero: the logo/title/tagline were bottom-parked (the desktop look) and
  sat too low; on mobile they're now vertically centered.
- Desktop newest-release section: tightened the gap under "NEWEST ///" and above
  "release \\\" by moving those marquee bands closer to the cover (grid areas
  only apply ≥768px, so mobile is untouched).

### 2026-07-17 — JS components, sticky header, ticker fix

- Header, mobile menu, and footer are now injected from single sources in a
  new `js/site.js` (replaces `js/main.js`) — edit `NAV_LINKS`/`FOOTER_*` once
  and every page updates. The copyright year fills itself from the date.
- Artist Previous/Next and the artists grid are both driven by one `ARTISTS`
  registry in `js/site.js`; adding an artist is one array line + one page file
  (with `data-artist`), no edits to sibling pages.
- Header is now `position: fixed`, `z-index: 1000` (persists on scroll, always
  in front) and uses `mix-blend-mode: difference` to stay legible over every
  section — removed the per-page header color hacks.
- Mobile menu: the burger→X now sits above the overlay (header z 1000 > menu
  z 900) and is white via the blend, so it's visible to close the menu.
- Marquees ("NEWEST", "release", "Subscribe") are now seamless infinite
  tickers — `site.js` duplicates each track so the 0→−50% loop never snaps —
  with faded edges via a CSS mask.
- Home hero: capped the logo size and moved "ALKABIL.AUDIO" to the right of it
  (was overlapping to the left).

### 2026-07-17 — flat structure, relative paths, Academico

- Fixed the broken deploy: every path and link was root-absolute
  (`/css/...`), which 404s anywhere but a domain root. All paths and links
  are now relative and point at `.html` files directly (no clean slugs).
- Restructured: top-level pages are root-level files (`artists.html`,
  `info.html`, `merch.html`); only artist pages live in a subfolder
  (`artists/<slug>.html`), mirroring the jehernandez site's `work/`.
- Replaced the Squarespace Typekit fonts (minerva-modern/anziano) with
  self-hosted Academico as a stand-in; no external requests remain, and the
  Netlify CSP in `_headers` was tightened to self-only.
- `404.html` made fully self-contained so it renders at any URL depth.

### 2026-07-17 — initial rebuild

- Cloned alkabil.audio (Squarespace) as a hand-coded static site: home,
  artists grid, two artist pages, info; Merch intentionally omitted.
- Content, images, grid placements, grayscale palette, and type system
  extracted from the live site; original page HTML kept for reference in
  `_source/`.
- CSS-only marquees, native `<details>` FAQ, burger-menu mobile nav.
- GitHub Pages deployment set: `.nojekyll`, `404.html`, `/merch`
  placeholder; Netlify extras (`_headers`, `_redirects`, Netlify Forms
  attribute) included.

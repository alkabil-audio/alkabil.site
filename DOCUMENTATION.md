# Site Documentation

The hand-coded static rebuild of **alkabil.audio**. No frameworks, no build
step: plain HTML pages, one stylesheet, one small script. Everything you'd
normally do in Squarespace's editor is a text edit here.

Contents:

1. [Quick recipes](#1-quick-recipes) — the edits you'll actually make
2. [How the site is organized](#2-how-the-site-is-organized)
3. [Deploy and local preview](#3-deploy-and-local-preview)
4. [URL parity with the old Squarespace site](#4-url-parity-with-the-old-squarespace-site)
5. [Troubleshooting](#5-troubleshooting)
6. [Changelog](#6-changelog)

---

## 1. Quick recipes

### 1.1 Add a new artist page

Each artist lives in their own subfolder under `artists/`, served at
`/artists/<slug>/`:

```
artists/
  index.html            ← the portfolio grid (all artists)
  yslas/index.html      ← one artist
  jehernandez/index.html
```

To add an artist:

1. **Copy an existing artist folder** and rename it to the new slug
   (lowercase, no spaces — it becomes the URL):

   ```
   artists/newartist/index.html
   ```

2. **Edit the copy.** The page has four zones, top to bottom:
   - the `<title>` in `<head>`;
   - the **bio section** — name in `<h1>`, bio paragraph(s), and the
     `artist-links` paragraph (website / instagram / etc.);
   - the **banner** — swap the `<img src>` for the artist's photo
     (drop the file in `/assets/` first);
   - the **release section** — cover image, release title (`release-title`),
     blurb (`release-desc`), and the LISTEN/BUY `.btn` link (point it at the
     release's Linktree/Bandcamp URL, or `href="#"` if nothing is out yet).

3. **Add the artist to the grid** in `artists/index.html` — copy one of the
   two `<a class="grid-item">` blocks and change the href, image, and
   `portfolio-title`. The grid is `grid-template-columns: 1fr 1fr`; a third
   artist starts a second row automatically. (If you'd rather have three
   across, change the column count in `.portfolio-grid` in `css/style.css`.)

4. **Update the Previous/Next chain.** Each artist page ends with an
   `item-pagination` nav. Point the last artist's "Next" at the new page and
   give the new page a "Previous" link back (copy the nav from
   `jehernandez/index.html`; the `prev` class on the nav left-aligns it).

### 1.2 Change the newest release (home page)

In `index.html`, the last section before the footer:

- **Cover**: replace `/assets/cover-2kx2k.jpg` (or add a new file and update
  the `<img src>` in the `release-cover` block). Square, ~1500–2500 px.
- **Link**: the `<a href>` around the cover — currently the release's
  Linktree (`tr.ee/...`).
- The "NEWEST ///" and "release \\\" marquees don't need touching; to change
  their words see §1.5.

### 1.3 Edit the FAQ (Info page)

`info/index.html`, the SOME ANSWERS section. Each Q&A is a native
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
```

Sections pick their palette with a theme class on the `<section>`:
`theme-black` (white on black), `theme-white` (black on white),
`theme-bright` (black on light gray) — same trio as the Squarespace themes
the original used.

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

### 1.6 Fonts

The site uses the label's Squarespace-provisioned Adobe Fonts kit
(the `use.typekit.net/ik/...` script tag in each page's `<head>`):
**minerva-modern** for headings (uppercase) and **anziano** for body text.
If that kit ever stops serving (it belongs to the Squarespace account),
either:

- create your own kit at https://fonts.adobe.com with the same two families,
  and swap the script tag's URL in every page's `<head>`, or
- self-host replacements as woff2 and `@font-face` them in `css/style.css`.

Until then nothing breaks — `--heading-font` / `--body-font` fall back to
Georgia.

### 1.7 The newsletter form

`info/index.html`. As shipped, submitting shows "Thank you!" (handled in
`js/main.js`) and — on Netlify — is stored by Netlify Forms (the form carries
`data-netlify="true"`). **GitHub Pages has no form backend**, so on GitHub
Pages the thank-you appears but nothing is stored. To make it real there, use
a mail-in form service (e.g. Web3Forms, like the jehernandez site's contact
form): add your access key as a hidden input, point the `fetch()` in
`js/main.js` at `https://api.web3forms.com/submit`, and allow that origin in
`_headers`' `connect-src`/`form-action` if you also deploy to Netlify.

### 1.8 Add a whole new top-level page

1. Create `newpage/index.html` (copy `info/index.html` for the header/footer
   scaffold and gut the `<main>`).
2. Build sections as `<section class="page-section theme-...">` containing a
   `.fgrid` with `.blk` children (see §2 for the grid).
3. Link it from the header nav and mobile menu **in every page** (the header
   is plain HTML repeated per page — there are seven: home, artists index,
   two artist pages, info, merch placeholder, 404).

### 1.9 Bring back the Merch page

The Merch page was deliberately left out of this rebuild. Its URL is covered
by two placeholders — delete both when you build the real thing:

- `merch/index.html` (meta-refresh → Bandcamp; GitHub Pages)
- the `/merch` line in `_redirects` (Netlify)

Then build `merch/index.html` like any page (§1.8) and add "Merch" back to
the header nav and mobile menu in every page.

---

## 2. How the site is organized

```
index.html                     home
artists/index.html             artists portfolio grid
artists/yslas/index.html       artist page
artists/jehernandez/index.html artist page
info/index.html                info / FAQ / newsletter
merch/index.html               placeholder → Bandcamp (see §1.9)
404.html                       not-found page (auto-used by GH Pages/Netlify)
css/style.css                  the whole design system
js/main.js                     burger menu + newsletter submit
assets/                        all images + favicon
_source/                       reference copies of the original Squarespace
                               pages this was rebuilt from (not linked
                               anywhere — safe to delete or .gitignore)
.nojekyll                      tells GitHub Pages not to run Jekyll
_headers, _redirects           Netlify-only (ignored by GitHub Pages)
```

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

**Headers/footers are repeated per page**, not injected — seven copies. A
change to the nav means editing all of them (grep for `nav-left`).

**Section themes** (`theme-black` / `theme-white` / `theme-bright`) set
background + text color; a `section-bg` div with an `<img>` inside makes a
full-bleed background photo (home hero and newest-release sections).

---

## 3. Deploy and local preview

**GitHub Pages** (the plan): push this folder to a GitHub repo →
Settings → Pages → deploy from branch. Already in place for you:

- `.nojekyll` — stops Jekyll from mangling files/skipping underscored paths;
- `404.html` — picked up automatically;
- clean URLs — every page is a `folder/index.html`;
- custom domain: enter `alkabil.audio` (or `www.`) in the Pages settings —
  **GitHub writes the `CNAME` file into the repo itself**, which is why this
  repo doesn't ship one — then point the domain's DNS at GitHub Pages and
  tick "Enforce HTTPS".

**Netlify** also works as-is: drag the folder onto app.netlify.com.
`_headers` (security headers/CSP) and `_redirects` (/merch, /cart) only take
effect there, and the newsletter form gets stored by Netlify Forms.

**Local preview** — the links are root-absolute, so serve over http rather
than double-clicking files:

```
cd alkabil-clone
python -m http.server 8000
# → http://localhost:8000
```

(Note: if the Adobe kit enforces its domain whitelist, the Typekit fonts may
not render on localhost — layout still works on the Georgia fallback.)

---

## 4. URL parity with the old Squarespace site

| Old (Squarespace)        | Here                                    |
| ------------------------ | --------------------------------------- |
| `/`                      | `index.html`                            |
| `/artists`               | `artists/index.html`                    |
| `/artists/yslas`         | `artists/yslas/index.html`              |
| `/artists/jehernandez`   | `artists/jehernandez/index.html`        |
| `/info`                  | `info/index.html`                       |
| `/merch`                 | → Bandcamp (placeholder, §1.9)          |
| `/cart`                  | → `/` on Netlify; 404 on GitHub Pages   |

Internal links are written root-absolute with a trailing slash
(`/artists/yslas/`) so they resolve identically at any depth on both hosts.

---

## 5. Troubleshooting

- **Fonts look like a plain serif (Georgia)** — the Typekit kit didn't load:
  offline, the kit's domain whitelist, or Adobe retired the Squarespace kit.
  See §1.6.
- **Clicking a nav link opens a file listing / 404 locally** — you opened the
  site via `file://`. Serve it over http (§3).
- **A block sits in the wrong place on desktop** — check its `--gd` values;
  remember columns run 1–27 including the two gutter columns (§2).
- **Newsletter "Thank you!" but no email collected** — expected on GitHub
  Pages until a form backend is wired (§1.7).
- **Changed the nav on one page but not the others** — headers are repeated
  per page; edit all seven (§2).
- **/merch shows Bandcamp** — that's the placeholder (§1.9).

---

## 6. Changelog

### 2026-07-17 — initial rebuild

- Cloned alkabil.audio (Squarespace) as a hand-coded static site: home,
  artists grid, two artist pages, info; Merch intentionally omitted.
- Content, images, grid placements, grayscale palette, and the
  minerva-modern/anziano type system extracted from the live site; original
  page HTML kept for reference in `_source/`.
- CSS-only marquees, native `<details>` FAQ, burger-menu mobile nav.
- GitHub Pages deployment set: `.nojekyll`, `404.html`, folder-per-page clean
  URLs, `/merch` meta-refresh placeholder; Netlify extras (`_headers`,
  `_redirects`, Netlify Forms attribute) included.

# alkabil — label site

A light, hand-coded static rebuild of [alkabil.audio](https://www.alkabil.audio)
(originally Squarespace), minus the Merch page for now.
**Full manual: [DOCUMENTATION.md](DOCUMENTATION.md)** — including how to add an
artist page, swap the newest release, edit the FAQ, and wire up the newsletter.

## What it is

- **Home** (`index.html`): full-height hero (logo + "ALKABIL.audio" +
  SD - HTX - VSA - CDMX over the cave photo, which fragments into
  pointer-driven concentric rings — DOCUMENTATION.md §1.15), a two-up photo
  strip, the light-gray "WE ARE A bespoke micro Label" manifesto with a CONTACT
  button, and the newest-release section — a film-grain/static overlay behind
  "NEWEST ///" and "release \\\" CSS marquees scrolling around the cover, which
  links to the release's Linktree.
- **Artists** (`artists.html`): the two-panel full-bleed portfolio grid —
  each panel an artist photo with a hover overlay and their name.
- **Artist pages** (`artists/<slug>.html`): the only subfolder with pages —
  one file per artist (like the jehernandez site's `work/`): bio + links, a
  full-width banner image, and their current release (cover with a drop shadow
  and hover grow, blurb, LISTEN/BUY button), with linear Previous/Next
  navigation between artists
  (first artist shows only Next, last only Previous).
- **Info** (`info.html`): the big "?", the label intro, the SOME ANSWERS FAQ
  (native `<details>` accordions that slide open and closed), and the
  "Subscribe" marquee + newsletter signup.
- **No frameworks, no build step, no trackers, no external requests.** One
  stylesheet (`css/style.css`), one script (`js/site.js`), plain HTML pages,
  self-hosted fonts. `site.js` injects the header/menu/footer from single
  sources, drives the artist grid + Previous/Next from one registry, fills the
  copyright year, and makes the marquees seamless — so the repeated chrome
  and the artist list are each edited in exactly one place
  (DOCUMENTATION.md §1.1, §1.9).

## Quick facts

- **Font**: Academico (self-hosted woff2, same files as the jehernandez
  site) for everything — a stand-in until a proper replacement for the
  original's minerva-modern/anziano is chosen. Headings stay uppercase like
  the original. Swapping fonts is four `@font-face` blocks + two variables
  at the top of `css/style.css` (DOCUMENTATION.md §1.6).
- **Palette**: pure grayscale — black, white, and an 85% gray "bright"
  accent. CSS variables at the top of `css/style.css`.
- **Favicon**: `assets/favicon.png` (256×256, the label mark on black),
  rendered from `logo-white.png` by `tools/make-favicon.py` — rerun it after
  changing the logo (DOCUMENTATION.md §2).
- **Layout**: no positioning coordinates anywhere — every section is a plain
  flex/grid container that sizes itself to its content, with one or two obvious
  dials (a `max-width`, a `padding`) in `css/style.css`. Editing copy never
  means adjusting a layout. Mobile collapses to document order.
  See DOCUMENTATION.md §2.
- **Clean URLs, matching the old Squarespace paths** — `/`, `/info`,
  `/artists`, `/artists/yslas`. No `.html` in any link: GitHub Pages and
  Netlify both serve `info.html` at `/info`, so there's no build step. Links
  and asset paths are root-absolute (`/css/style.css`), which means the site
  **must be served from a domain root** — a custom domain or a user page, not a
  GitHub *project* subpath, and not `file://`. Full rules: DOCUMENTATION.md §4.
- **Local preview** needs a pretty-URL server: `npx serve .` or `netlify dev`.
  `python -m http.server` won't resolve `/info` and every nav link will 404
  (DOCUMENTATION.md §3).
- **/merch**: `merch.html` is a meta-refresh forward to Bandcamp until the
  real Merch page exists; `_redirects` covers the old `/merch` URL on
  Netlify. Delete both when Merch gets built (DOCUMENTATION.md §1.10).
- **Newsletter**: the form shows "Thank you!" on submit, but a static host
  doesn't store submissions — wire it to a form backend before relying on it
  (DOCUMENTATION.md §1.7).
- **404**: `404.html` at the root — the marquee treatment scrolling
  "404 ///" / "not found \\\" around a go-back link. Fully self-contained
  (inlined CSS), since it's served at whatever URL was missed.
- **Deploy**: push to GitHub → Settings → Pages (the custom domain you enter
  there generates `CNAME`; `.nojekyll` is already in place). Or drag the
  folder onto https://app.netlify.com — security headers for Netlify live in
  `_headers`.
- **Weight**: ~4.7 MB of images (the heaviest is the 1.1 MB release cover),
  ~120 KB of fonts, a 6 KB stylesheet, and a 1 KB script.

# alkabil — label site

A light, hand-coded static rebuild of [alkabil.audio](https://www.alkabil.audio)
(originally Squarespace), minus the Merch page for now.
**Full manual: [DOCUMENTATION.md](DOCUMENTATION.md)** — including how to add an
artist page, swap the newest release, edit the FAQ, and wire up the newsletter.

## What it is

- **Home**: full-height hero (logo + "ALKABIL.audio" + SD - HTX - VSA - CDMX
  over the cave photo), a two-up photo strip, the light-gray "WE ARE A bespoke
  micro Label" manifesto with a CONTACT button, and the newest-release section —
  "NEWEST ///" and "release \\\" CSS marquees scrolling around the cover, which
  links to the release's Linktree.
- **Artists** (`/artists/`): the two-panel full-bleed portfolio grid — each
  panel an artist photo with a hover overlay and their name — linking to the
  artist pages.
- **Artist pages** (`/artists/<slug>/`): each artist lives in their own
  subfolder — bio + links, a full-width banner image, and their current
  release (cover, blurb, LISTEN/BUY button), with Previous/Next navigation
  between artists.
- **Info** (`/info/`): the big "?", the label intro, the SOME ANSWERS FAQ
  (native `<details>` accordions — no JS), and the "Subscribe" marquee +
  newsletter signup.
- **No frameworks, no build step, no trackers.** One stylesheet
  (`css/style.css`), one small script (`js/main.js` — burger menu + newsletter
  submit), plain HTML pages. The only external request is Adobe Typekit for
  the two fonts.

## Quick facts

- **Fonts**: minerva-modern (headings, uppercase) and anziano (body), loaded
  from the Adobe Fonts (Typekit) kit that Squarespace provisioned. If the kit
  stops serving off-Squarespace, see DOCUMENTATION.md §1.6 for replacing it
  with your own kit or self-hosted fonts — the CSS falls back to Georgia
  gracefully in the meantime.
- **Palette**: pure grayscale — black, white, and an 85% gray "bright" accent.
  CSS variables at the top of `css/style.css`.
- **Layout**: sections reuse the original's 24-column grid placements — each
  block carries its desktop grid area in a `--gd: row/col/row/col` custom
  property (mobile just stacks in document order). See DOCUMENTATION.md §2.
- **Clean URLs match the old Squarespace site** — `/`, `/artists`,
  `/artists/yslas`, `/artists/jehernandez`, `/info` — via `folder/index.html`,
  which both GitHub Pages and Netlify serve at `/folder/`.
- **/merch** forwards to Bandcamp until the real Merch page exists: a
  meta-refresh page at `merch/index.html` (works on GitHub Pages) plus a
  `_redirects` rule (Netlify). Delete both when Merch gets built.
- **Newsletter**: the form shows "Thank you!" on submit, but a static host
  doesn't store submissions — wire it to a form backend before relying on it
  (DOCUMENTATION.md §1.7).
- **404**: `404.html` at the root — the marquee treatment scrolling
  "404 ///" / "not found \\\" around a go-back link. Picked up automatically
  by both GitHub Pages and Netlify.
- **Serve it, don't double-click it.** Internal links are root-absolute
  (`/artists/`), which a browser can only resolve over http — use GitHub
  Pages, Netlify, or `python -m http.server` locally (DOCUMENTATION.md §3).
- **Deploy**: push to GitHub → Settings → Pages (the custom domain you enter
  there generates `CNAME`; `.nojekyll` is already in place). Or drag the
  folder onto https://app.netlify.com — security headers for Netlify live in
  `_headers`.
- **Weight**: ~4.7 MB of images (the heaviest is the 1.1 MB release cover),
  a 5 KB stylesheet, and a 1 KB script.

# Azarnoosh Hs — portfolio

Portfolio site for Azarnoosh Hs — fashion designer & artist (Tehran → Gent).
Hand-written HTML/CSS/JS, no framework, no build step. Deployable as-is on Vercel
(or any static host).

## Structure

```
index.html              home — numbered project list
about.html              intro (her own text pending), CV, contact
404.html                lost in the shadows
projects/
  01-100kolah.html      hat project (2024–2025, Tehran)
  02-tailoring.html     corsets & jackets, made-to-measure
  03-moving-pictures.html  studio video
  04-shadow-game.html   artist book — silkscreen & torn-paper collage
  05-red-thread.html    embroidery & print exhibition (Gent, 2026)
css/style.css           the whole design system
js/main.js              gallery lightbox (vanilla)
img/<project>/          web-optimized images: *-lg.jpg (≤1600px) + *-th.jpg (≤640px)
img/manifest.json       image dimensions + alt text (generated)
media/project-03.mp4    studio video
scripts/resize.py       helper to add new photos
```

## Editing copy

All editable text sits in the HTML files, marked with `<!-- EDIT: ... -->` comments:

- **About intro** — `about.html`, the `.note` block. Replace the placeholder with
  Azarnoosh's own text when it arrives.
- **Project titles/descriptions** — top of each `projects/*.html`. Titles for
  projects 03 & 04 are working titles awaiting her confirmation.
- **Hero tagline** — `index.html`.

## Adding photos

```
python scripts/resize.py path/to/photo.jpg p04 my-slug "Alt text describing the photo"
```

Then copy the printed `<a class="g">…</a>` snippet into the matching project page's
`.gallery` block.

## Design notes

Palette and motifs are extracted from the work itself: paper cream (book pages /
gallery walls), thread red (embroidery), cobalt & seafoam (silkscreen pages), ochre
(gold pages). Torn-paper chips and running-stitch dividers echo the artist book's
collage and her sewing practice. Fonts: Fraunces / Work Sans / Vazirmatn (Google Fonts).

## Deploy

Static site — on Vercel: **Add New → Project → import this repo**, framework preset
"Other", no build command, output directory `./`. Done.

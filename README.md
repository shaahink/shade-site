# Azarnoosh Hs — portfolio

Portfolio site for Azarnoosh Hs — fashion designer & artist (Tehran → Gent).
Hand-written HTML/CSS/JS, no framework, no build step. Deployable as-is on Vercel
(or any static host).

## Structure

```
index.html              home — her name (fa + en), short bio, link to Work
work.html               plain list of project titles
about.html              redirect → index.html (bio lives on the home page now)
404.html                lost in the shadows
projects/
  01-100kolah.html      hat project (2024–2025, Tehran)
  02-tailoring.html     corsets & jackets, made-to-measure
  03-moving-pictures.html  the corset film, custom video player
  04-shadow-game.html   artist book — silkscreen & torn-paper collage
  05-red-thread.html    embroidery & print exhibition (Gent, 2026)
css/style.css           the whole design system
js/main.js              home-page shadow play + video player (vanilla)
img/<project>/          web-optimized images: *-lg.jpg (≤1600px) + *-th.jpg (≤640px)
img/manifest.json       image dimensions + alt text (generated)
media/project-03.mp4    the corset film (web-encoded, faststart) + poster jpg
scripts/resize.py       helper to add new photos
```

## Editing copy

All editable text sits in the HTML files, marked with `<!-- EDIT: ... -->` comments:

- **Bio** — `index.html`, the `.bio` block. Replace with Azarnoosh's own text
  when it arrives.
- **Project descriptions** — top of each `projects/*.html`. Titles for
  projects 03 & 04 are working titles awaiting her confirmation.

## Adding photos

```
python scripts/resize.py path/to/photo.jpg p04 my-slug "Alt text describing the photo"
```

Then paste the printed `<figure>…</figure>` snippet into the matching project
page's `.stack` block.

## Design notes

White-minimal system: pure `#FFFFFF` ground, black type, square-cornered frames
lifted by a faint shadow. Type is MS Reference Sans Serif with Verdana/Tahoma
fallbacks; Vazirmatn (Google Fonts) for Persian, loaded on the home page only.
The one moving part is on the home page: the name casts a shadow that answers
the cursor — the cursor is the light, and سایه (shade) falls the other way.

## Deploy

Static site — on Vercel: **Add New → Project → import this repo**, framework preset
"Other", no build command, output directory `./`. Done.

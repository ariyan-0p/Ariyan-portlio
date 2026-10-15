# Ariyan Samal — Portfolio

Editorial-technical portfolio. React 19 + Vite, GSAP/ScrollTrigger, Lenis smooth scroll,
and a hand-written WebGL ordered-dither portrait shader (no three.js).

## Run

```bash
npm install
npm run dev        # http://localhost:5173/Ariyan-portlio/
npm run build
npm run deploy     # builds and publishes dist/ to GitHub Pages
```

## Where things live

- `src/data.js` — **all content**: projects, capabilities, experience log, contact details.
- `src/components/` — one file per section (`Hero`, `Work`, `Case`, `Capabilities`, `Log`, `Contact`, …).
- `src/lib/dither.js` — WebGL portrait shader. `src/lib/scroll.js` — Lenis + GSAP wiring.
- `src/index.css` — the whole design system (tokens at the top).
- `public/work/*.jpg` — project screenshots (1440×900). Re-capture when a site changes.

## Adding a project

Add an entry to `PROJECTS` in `src/data.js` and drop `public/work/<slug>.jpg` next to the others.

## Contact form

Submits to Web3Forms (`WEB3FORMS_ACCESS_KEY` in `Contact.jsx`, public by design).
Brevo automation is wired but off — set `BREVO_ENABLED` and `BREVO_FORM_URL` to enable.

Shortcuts: `⌘/Ctrl + K` or `/` opens the command palette.

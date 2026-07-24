# Ally Soft Solutions — Website

A fully dynamic React site built with Vite, Tailwind CSS, GSAP (ScrollTrigger)
and lucide-react. Elements animate in on the X, Y, and Z axes as you scroll,
with mouse-driven 3D tilt on cards and the hero's orbiting "Idea to
Implementation" signature scene. Fully responsive down to small phones.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

The static output lands in `dist/` — upload that folder to any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages, or your own server).

## Structure

```
src/
  components/       one file per section (Hero, Services, Stack, ...)
  lib/motion.js     shared GSAP helpers: reveal() and parallax()
  index.css         brand tokens, fonts, gradient text, reduced-motion support
tailwind.config.js  color palette + fonts pulled from the Ally Soft logo
```

## Editing content

- **Colors** — `tailwind.config.js` → `gold`, `amber`, `ink`, `void`, `panel`.
- **Copy** — each section's data lives at the top of its component file as a
  plain array (e.g. `SERVICES`, `POINTS`, `STEPS`).
- **Motion** — every `<Reveal>` wrapper accepts `x`, `y`, `z`, `rotateX`,
  `rotateY`, `delay`, `duration` props to control how a section moves in.
- **Contact form** — client-side only right now (shows a success state on
  submit). Wire `handleSubmit` in `Contact.jsx` to your email service or
  backend of choice.

## Notes

- Respects `prefers-reduced-motion` for accessibility.
- Replace placeholder team initials and the "ALLY" text logo with your real
  logo file and team photos when ready.

# IRA Designs — portfolio

Next.js 16 · React 19 · TypeScript · Tailwind 4 · GSAP + ScrollTrigger · Motion · Three.js / React Three Fiber · Lenis

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL=https://your-domain` before deploying (used for canonical URLs, sitemap, OG, JSON-LD).

## Pages
- `/` — intro → *Line to Light* 3D hero → studio → horizontal work rail → services → contact
- `/work` — editorial index with floating previews
- `/work/[slug]` — project story: intro, full-bleed art, concept + palette, drawing↔render slider, details, next project
- `/about`, `/contact`

## Editing content
- Studio facts, contact person, phone, WhatsApp: `src/data/site.ts`
- Services: `src/data/services.ts`
- Projects: `src/data/projects.ts`

## Adding the 5 Instagram posts
For each project in `src/data/projects.ts`:
1. Put the images in `public/assets/projects/<slug>/` (e.g. `render.webp`, `detail-1.webp` …).
2. Set `image` (and optionally `linework`, `details`) with real width/height + alt text.
3. Set `pending: false` and `source` to the post URL.
4. Rename `title`, `summary`, `concept` etc. to match the real project.

The concept plate disappears automatically once `image` is set. `linework` is
optional — without it the "drawing" side uses a sketch-toned version of the render.

See `docs/CREATIVE_DIRECTION.md` for the design system and motion rules.

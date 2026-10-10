# RoamX — landing page

Marketing site for RoamX: holiday packages, flights, stays and corporate travel.
Next.js (static export) + Tailwind CSS + GSAP + Lenis, deployed on Cloudflare Pages.

## Develop

```bash
npm install
npm run dev
```

All page copy lives in `lib/content.ts` (items marked `TODO` are placeholders).
The logo vectors live in `lib/logo-paths.ts`.

## Build

```bash
npm run build
```

Outputs a fully static site to `out/`. The trip enquiry endpoint (`POST /api/enquiry`) is a
Cloudflare Pages Function in `functions/api/enquiry.ts`.

Preview the production build with the Pages runtime:

```bash
npx wrangler pages dev out
```

## Deploy to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Build settings:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`
3. Environment variables (Settings → Variables and Secrets):
   - `NODE_VERSION` = `22` (also pinned in `.node-version`)
   - `ENQUIRY_WEBHOOK_URL` = where trip enquiries are forwarded (optional; without it they are only logged)
4. Save and deploy. Every push to `main` redeploys; other branches get preview URLs.
5. Custom domain: Pages project → Custom domains → add your domain, then update `site.url` in `lib/content.ts`.

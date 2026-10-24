# One-shot prompt: rebuild the RoamX landing page

Paste everything below the line into a coding agent, in an empty folder. Attach two files from the current repo, because they are hand-traced vectors that can't be described in words:

- `lib/logo-paths.ts`
- `app/icon.svg`

---

You are building **RoamX**, a single-page marketing site, from scratch. Build it exactly as specified here: same stack, files, copy, colours, layout values and scroll choreography. When this spec gives a value (a class, a timing, a clamp), use it exactly. Don't add sections, labels, badges, stats tiles, progress bars, icons or copy that aren't described. When finished, `npm run build` must produce a static site in `./out` with no type or lint errors.

## 0. What the product is (so the tone is right)

RoamX sells students a **white-label travel portal** for a one-time **₹9,999**, usable for **up to 5 years**. The student puts their own brand on it and sells flights and hotels (plus buses and holiday packages) to their own customers. They keep the **markup** they add on top of the portal price. Training is included, and a RoamX team runs the platform behind them.

The pitch is **"student → entrepreneur"**, never "travel entrepreneur". Travel is only what the portal manages. The portal is the student's first business and a stepping stone, not their last: "Your first business. Not your last." Copy reads like the RoamX team, experienced people advising a student directly. Use "we" for RoamX, never "I". Never mention setting up a company. Never claim RoamX earns nothing.

### Design rules (non-negotiable)
- **Palette:** navy and ivory, with gold used only as a *metallic* gradient. No other gradients anywhere, except the polished-navy metal background and the gold metal.
- **No "AI-looking" furniture.** No small uppercase eyebrow labels above headings, no stat counters or KPI tiles, no step numbers, no progress indicators, no emoji, no icon grids. (The only uppercase micro-labels allowed are the ones *inside the product mockups* described below: E-TICKET, HOTEL VOUCHER, and the app's status labels.)
- **Motion is slow, premium and never glitchy:** scrubbed GSAP timelines and long expo/spring easing. Nothing bounces except the notification toasts (`back.out(1.7)`).
- **Fully responsive**, from 360 px phones to 1440+ desktops, with no horizontal scroll (`overflow-x: clip` on body).

## 1. Stack and project setup

- **Framework:** Next.js **16.4.2** (App Router, TypeScript, React **19.3.0**), static export (`output: "export"`). Pin `next` and `eslint-config-next` to exactly `16.4.2`, because older 16.4.x refuse to build with a security error.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/turbopack`. Tokens go in `@theme` in `app/globals.css`. There is no tailwind.config.
- **Animation:** `gsap` ^3.15 (ScrollTrigger, DrawSVGPlugin, MotionPathPlugin — all free in 3.13+), `@gsap/react` ^2.1.2 (`useGSAP`), and `motion` ^14 (`motion/react`) for layout and spring UI.
- **Smooth scroll:** `lenis` ^1.3.
- **3D intro:** `three` ^0.186 and `@types/three`.
- **Utilities:** `clsx`, `tailwind-merge`, and `cn()` in `lib/utils.ts`.
- **Fonts** (next/font/google):
  - Sora (400, 600, 700, 800) → `--font-sora`
  - Inter → `--font-inter`
  - JetBrains Mono (400, 500) → `--font-jetbrains`
  - Josefin Sans (500) → `--font-josefin`
- **Hosting:** Cloudflare Pages. Node 22 (`.node-version` = `22`).
  - Build command `npm run build`; output folder `out`.
  - A Pages Function serves `functions/api/enquiry.ts`.

`package.json` scripts: `dev: next dev`, `build: next build`, `start: next start`, `lint: eslint`.

### `next.config.ts`

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages: `next build` writes the site to ./out.
  output: "export",
  images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};
export default nextConfig;
```

### `lib/imageLoader.ts`
This is a next/image loader for Unsplash. If the src starts with `https://images.unsplash.com/`, append `w=${width}&q=${quality ?? 80}` (using `&` if a `?` is already present). Otherwise return the src unchanged.

### `lib/gsap.ts` (`"use client"`)
- Register ScrollTrigger, DrawSVGPlugin, MotionPathPlugin and useGSAP.
- Call `ScrollTrigger.config({ ignoreMobileResize: true })`, because phone address bars resize the viewport and pinned scenes would jump.
- Export `{ gsap, ScrollTrigger, useGSAP }`.

### `public/_headers`
```
/opengraph-image
  Content-Type: image/png
```

### `app/robots.ts`, `app/sitemap.ts`
Both use `dynamic = "force-static"`.
- **Robots:** allow `/`, disallow `/api/`, and point the sitemap at `${site.url}/sitemap.xml`.
- **Sitemap:** one entry, `site.url`, changing weekly, priority 1.

### `app/opengraph-image.tsx`
`ImageResponse` at 1200×630, `force-static`, alt "RoamX — From student to entrepreneur, for ₹9,999".
- **Layout:** a column with space-between and padding 72.
- **Background:** `radial-gradient(70% 90% at 0% 0%, #22396b 0%, #0a1430 60%, #070f24 100%)`, text colour #fbf8f2.
- **Top row:** a 64 px circle with a 6 px #d4a54e border on #13254a, then "ROAMX" at 44 px, weight 800, letter-spacing 2.
- **Middle:** at 72 px, weight 700, line-height 1.02, letter-spacing −3, two lines: "From student to entrepreneur." and "₹9,999" in #e2bb6a.
- **Bottom:** "Your brand. Your customers. Your markup." at 26 px in rgba(251,248,242,0.6).

## 2. Copy: `lib/content.ts` (verbatim)

All copy lives here. Components import from it. Reproduce this file **exactly**:

```ts
// All page copy lives here so it can be edited without touching components.
// Items marked TODO are placeholders awaiting real assets/details from the client.

// width and quality are added per screen by lib/imageLoader.ts
const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop`;

export const PRICE = "₹9,999";

export const site = {
  name: "RoamX",
  tagline: "Evolve",
  url: "https://roamxevolve.pages.dev", // TODO: custom domain when ready
  title: `RoamX — From student to entrepreneur, for ${PRICE}`,
  description: `Earn while you study: sell flights and hotels under your own brand and keep the markup you add. Your first business, one-time ${PRICE} for up to 5 years, with training.`,
  // TODO: the client's Razorpay (or other gateway) payment page. Until it's set, "Start" buttons open the sign-up form.
  payUrl: "",
  // The floating "Talk to us" form. Set to false to remove it from the site entirely.
  contactForm: true,
  email: "hello@roamx.app", // TODO: real contact email
  socials: {
    instagram: "https://instagram.com/roamx", // TODO
    linkedin: "https://linkedin.com/company/roamx", // TODO
    x: "https://x.com/roamx", // TODO
  },
};

export const nav = [
  { label: "How it works", href: "#how" },
  { label: "What you sell", href: "#sell" },
  { label: "Your brand", href: "#brand" },
  { label: "Earnings", href: "#earn" },
  { label: "FAQ", href: "#faq" },
];

export const cta = {
  start: "Start earning",
  short: `Start · ${PRICE}`,
};

// Hero: a split-flap bookings board. Flights and hotels only; prices and markups are example figures.
// `book` fits 12 board cells, `price` and `markup` 7 each.
export const hero = {
  headline: ["From student to", "entrepreneur."],
  sub: `Your first step: sell flights and hotels under your own brand and keep the markup you add. One-time ${PRICE}.`,
  secondary: "See how it works",
  bookings: [
    { book: "BLR → GOI", kind: "FLIGHT", price: "₹4,550", markup: "+₹350" },
    { book: "GOA · 3N", kind: "HOTEL", price: "₹10,400", markup: "+₹800" },
    { book: "DEL → DXB", kind: "FLIGHT", price: "₹18,900", markup: "+₹1,200" },
    { book: "JAIPUR · 2N", kind: "HOTEL", price: "₹6,800", markup: "+₹600" },
    { book: "BOM → DEL", kind: "FLIGHT", price: "₹5,200", markup: "+₹400" },
    { book: "MANALI · 4N", kind: "HOTEL", price: "₹9,200", markup: "+₹900" },
    { book: "MAA → SIN", kind: "FLIGHT", price: "₹14,600", markup: "+₹1,000" },
    { book: "COCHIN · 3N", kind: "HOTEL", price: "₹7,500", markup: "+₹650" },
    { book: "HYD → BLR", kind: "FLIGHT", price: "₹3,900", markup: "+₹300" },
    { book: "UDAIPUR · 2N", kind: "HOTEL", price: "₹11,800", markup: "+₹1,000" },
    { book: "CCU → BKK", kind: "FLIGHT", price: "₹16,200", markup: "+₹1,100" },
    { book: "DEL → GOI", kind: "FLIGHT", price: "₹6,100", markup: "+₹450" },
  ],
};

export const problem = `Earning while you study used to mean tuitions and part-time shifts. Now it can mean your own travel portal, for ${PRICE}.`;
// the word whose letter becomes the logo globe, and that letter's index
export const problemGlobe = { word: "Now", at: 1 };
export const problemHighlights = [`${PRICE}.`];

// The client's flow: buy the portal → brand it → generate bookings (learning along the way).
export const steps = ["Buy", "Brand", "Book", "Earn"];
export const stepsLine = "Pay once, put your brand on it, book flights and hotels for your customers, and keep the markup you add. A shift ends when you clock out. A good customer keeps coming back.";

// Gallery: a still collage of free Unsplash photos. `ratio` = the photo's frame, mixing wide and tall.
export const sell = {
  headline: "Sell flights and hotels. And more.",
  sub: "Your friends book flights and hotels all the time, and someone earns on every one of those bookings. That someone could be you. Flights and hotels first, with buses and holiday packages too.",
  items: [
    { image: unsplash("photo-1436491865332-7a61a109cc05"), alt: "Aircraft wing above the clouds at sunrise", ratio: "4/3" },
    { image: unsplash("photo-1520250497591-112f2f40a3f4"), alt: "Resort pool among palm trees and mountains", ratio: "4/5" },
    { image: unsplash("photo-1483450388369-9ed95738483c"), alt: "Passengers seated in an aircraft cabin", ratio: "16/10" },
    { image: unsplash("photo-1543797414-a0c3ad076f7c"), alt: "Clouds through an aircraft window", ratio: "3/4" },
    { image: unsplash("photo-1625244724120-1fd1d34d00f6"), alt: "Gold chandelier in a hotel lobby", ratio: "4/5" },
    { image: unsplash("photo-1567516211940-21cc7895b2c1"), alt: "State bus on a ghat road", ratio: "4/5" },
    { image: unsplash("photo-1759328257280-28bdb3050be3"), alt: "Sunlit hotel room with sheer curtains", ratio: "3/4" },
    { image: unsplash("photo-1771868380818-ed6466a01355"), alt: "Aircraft engine and wing above the clouds at sunset", ratio: "4/5" },
    { image: unsplash("photo-1549294413-26f195200c16"), alt: "Pool lined with palm trees and sun loungers", ratio: "1/1" },
    { image: unsplash("photo-1661924326425-c14a6426d989"), alt: "Jal Mahal palace on a lake at dusk", ratio: "16/10" },
  ],
};

// Sample agency brands for the ticket mockup — the point is that it's the buyer's name, not RoamX's.
export const brand = {
  headline: ["Your name on", "every booking."],
  sub: "Tickets and bookings carry your brand's logo, not ours. Your customers remember you, and come back to you.",
  samples: [
    { name: "Nova Journeys", mark: "NJ", tint: "#1f3a6e" },
    { name: "Kiran Travels", mark: "KT", tint: "#7a3b2e" },
    { name: "Aarav Holidays", mark: "AH", tint: "#2d5a4a" },
  ],
};

// The confirmed worked example from the client: ₹1,000 ticket + ₹200 markup.
export const earn = {
  headline: ["You set the markup.", "You keep it."],
  fare: 1000,
  markup: 200,
  bookings: 20,
  note: "Example figures. Your markup is yours to set.",
};
// how many bookings at the example markup pay back the portal
export const payback = Math.ceil(9999 / earn.markup);
export const paybackLine = `About ${payback} bookings like this and your portal has paid for itself. Everything after is yours.`;

export const platform = {
  headline: "Your whole business, one dashboard.",
  sub: "Search and book, issue tickets under your brand, and see what you've earned. It opens at its own web link, on a laptop or your phone.",
  agency: "Nova Journeys",
  bookings: [
    { id: "BLR → GOI", who: "Ananya R.", kind: "Flight", fare: 4200, markup: 350 },
    { id: "Goa · 3 nights", who: "Ananya R.", kind: "Hotel", fare: 9600, markup: 800 },
    { id: "HYD → BLR", who: "Karthik S.", kind: "Bus", fare: 1100, markup: 120 },
    { id: "Kerala · 5 days", who: "Mehta family", kind: "Package", fare: 38000, markup: 2500 },
  ],
  events: [
    { t: "10:02", text: "Ticket issued under Nova Journeys", tone: "gold" },
    { t: "10:04", text: "Markup ₹350 added to your earnings", tone: "ok" },
    { t: "10:11", text: "New enquiry: Kerala trip for 4", tone: "ok" },
    { t: "10:16", text: "Hotel voucher sent to Ananya R.", tone: "gold" },
    { t: "10:21", text: "Bus HYD → BLR confirmed", tone: "ok" },
    { t: "10:30", text: "Package quote shared with Mehta family", tone: "gold" },
  ],
};

// "Student to entrepreneur": a pinned photo story. Free Unsplash photos for now.
// `pos` = object-position, so each photo keeps its subject on portrait screens too.
export const learn = {
  headline: "Learn the business by running one.",
  beats: [
    { caption: "You get your own travel portal, with your brand on it.", image: unsplash("photo-1604177091072-b7b677a077f6"), pos: "50% 40%", alt: "Student smiling on campus steps with a laptop" },
    { caption: "A friend wants to go to Goa. You book the flight from your phone.", image: unsplash("photo-1625463006115-09f08489f591"), pos: "45% 40%", alt: "Two friends laughing over a phone" },
    { caption: "The ticket goes out in your brand's name, with your markup added.", image: unsplash("photo-1667655861998-46fe4c29a4cf"), pos: "50% 35%", alt: "Young man smiling at his phone" },
    { caption: "More bookings come in: flights, hotels, and customers who come back.", image: unsplash("photo-1728141123512-87c415cecc9d"), pos: "50% 30%", alt: "Young woman smiling at her laptop" },
  ],
  end: { image: unsplash("photo-1729157661483-ed21901ed892"), pos: "50% 25%", alt: "Confident young man in a white shirt, arms crossed" },
  from: "Student",
  to: "Entrepreneur",
  agency: "Nova Journeys",
  friend: "Riya",
  enquiry: "Can you book Goa for 2 this Friday?",
  reply: "Done. Sending your tickets.",
  // the phone's "this month" figure at each beat (example figures)
  earned: [0, 0, 350, 2700],
  // notifications that pop out of the phone, per beat
  toasts: [
    [],
    ["New enquiry from Riya: Goa for 2"],
    ["+₹350 added to your earnings"],
    ["Goa · 3 nights booked · +₹800", "DEL → DXB booked · +₹1,200", "Riya booked her flight home · +₹350"],
  ],
  bookings: [
    { id: "BLR → GOI", kind: "Flight", who: "Riya", markup: 350 },
    { id: "Goa · 3 nights", kind: "Hotel", who: "Riya", markup: 800 },
    { id: "DEL → DXB", kind: "Flight", who: "Mehta family", markup: 1200 },
    { id: "GOI → BLR", kind: "Flight", who: "Riya", markup: 350 },
  ],
  training: "With training on your portal from day one.",
};

// "What this really teaches you": written as the RoamX team talking straight to a student.
export const skills = {
  headline: "What this really teaches you.",
  sub: "We'll be honest with you. The money is good, but it isn't the best part. The best part is what you learn by doing it, and nobody teaches this in a classroom.",
  items: [
    { word: "Selling", line: "Your first few enquiries will go nowhere. That's normal. By the tenth, you'll know how to turn ‘just asking’ into ‘book it’. You'll use that for the rest of your life." },
    { word: "Pricing", line: "Every markup you set is you deciding what your work is worth. Too high and they walk. Too low and you're working for free. You'll learn where the line is." },
    { word: "Customers", line: "When a flight gets delayed, pick up the phone and sort it out. That customer books with you again, and brings their friends." },
    { word: "Your brand", line: "Putting your own name out there feels strange at first. Then people start asking for you by name." },
    { word: "Money", line: "You'll see what comes in, what's yours, and what to put back in. Most people learn that much later. You'll learn it now." },
  ],
  close: ["Start here.", "Then go build something bigger."],
};

// Ordered the way a student's doubts arrive.
export const faq = [
  { q: "What do I get for ₹9,999?", a: "Your own travel business portal: one dashboard to sell flights and hotels (plus buses and holiday packages) under your own brand, with training on how to use it. It's a one-time payment for up to 5 years of use, with no hidden fees." },
  { q: "I'm a student with no experience. Can I do this?", a: "Yes, that's who RoamX is built for. The software works as a guide to the travel business, so you learn customer handling and gain real experience as you go." },
  { q: "Will it get in the way of my studies?", a: "No. There are no shifts. You take bookings when it suits you, between classes or at weekends." },
  { q: "How do I earn money?", a: "You add your own markup on top of the price in your portal and keep it. For example, if a ticket costs ₹1,000 in your portal and you sell it for ₹1,200, the ₹200 is yours." },
  { q: "How do I explain this to my parents?", a: "It's a one-time ₹9,999 for up to 5 years, with training and a RoamX team behind you. There's no stock or office to pay for, and you keep the skills whatever you do next." },
  { q: "Will I be trained?", a: "Yes. You get training on using your portal, so you can take your first booking with confidence." },
  { q: "Will my customers see my brand?", a: "Yes. Your brand's logo and name appear on the bookings you make, so your customers see your business, not ours." },
  { q: "Do I need to install anything?", a: "No. Your portal opens at its own web link, on a laptop or your phone." },
  { q: "Is it only for students?", a: "No. We focus on students, but anyone who wants to start earning on their own can join." },
  { q: "Who runs the platform?", a: "A RoamX team runs the portal behind you, so you can focus on finding and looking after your customers." },
];

export const finalCta = {
  headline: ["Take your", "first step."],
  sub: "You don't need stock, an office or a shift manager. Your phone and your name are enough to start.",
  terms: ["One-time payment", "Up to 5 years of use", "No hidden fees"],
  // ₹9,999 over 5 years (1,826 days) is ₹5.48 a day
  perDay: "Works out to under ₹6 a day over 5 years.",
  includes: [
    "Your own travel portal, live at its own link",
    "Your logo and name on every booking",
    "Flights and hotels, plus buses and packages",
    "The markup you add, kept by you",
    "Training to take your first booking",
    "The RoamX team behind you",
  ],
};

export const contact = {
  pill: "Talk to us",
  headline: "Rather talk to us first?",
  sub: "Not sure yet? Ask us anything and the RoamX team will get back to you.",
};

// TODO: the client's phone, office address and policy pages (payment gateways require the policies).
export const footer = {
  phone: "",
  address: "",
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};
```

## 3. Global styles: `app/globals.css` (verbatim)

```css
@import "tailwindcss";

@theme {
  --color-navy-950: #070f24;
  --color-navy-900: #0a1430;
  --color-navy-800: #13254a;
  --color-navy-700: #1a2f5c;
  --color-navy-600: #22396b;
  --color-navy-400: #5b6d93;
  --color-ivory-50: #fbf8f2;
  --color-ivory-100: #f5efe4;
  --color-champagne-200: #eadfcb;
  --color-champagne-300: #dccbad;
  --color-gold-200: #f6de9a;
  --color-gold-400: #d4a54e;
  --color-gold-500: #c9973f;
  --color-gold-700: #9a6e2a;

  --font-display: var(--font-sora);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);
  --font-serif: var(--font-josefin);

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

@utility text-gold {
  background: linear-gradient(100deg, #f6de9a 0%, #d4a54e 45%, #9a6e2a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@utility bg-gold {
  background: linear-gradient(100deg, #f6de9a 0%, #d4a54e 45%, #9a6e2a 100%);
}

html {
  scrollbar-gutter: stable;
  /* navy canvas: shows in the scrollbar gutter and overscroll, matching the hero and footer */
  background: #091330;
  color: var(--color-navy-800);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-stopped { overflow: hidden; }

body {
  background: var(--color-ivory-50);
  font-family: var(--font-sans), system-ui, sans-serif;
  overflow-x: clip;
}

::selection { background: var(--color-gold-200); color: var(--color-navy-900); }

:focus-visible { outline: 2px solid var(--color-gold-500); outline-offset: 3px; border-radius: 6px; }

/* film grain, used by AmbientBackground and dark stages */
.grain::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.07;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.grain-light::after { mix-blend-mode: soft-light; opacity: 0.12; }

@keyframes route-drift { to { stroke-dashoffset: -480; } }
@keyframes fill-bar { from { width: 0%; } to { width: 100%; } }

/* Polished navy metal: smooth dark navy with a soft diagonal sheen. */
.metal-dark {
  background-color: #091330;
  background-image: linear-gradient(118deg, #060e24 0%, #08112b 22%, #0c1735 36%, #121f43 43%, #16264d 45.5%, #0f1b3c 50%, #0a132e 64%, #070f26 82%, #0a1430 100%);
}

.smoke-puff { position: absolute; border-radius: 9999px; background: #c9d1df; filter: blur(6px); pointer-events: none; }

/* iOS-style glass: menu panel and contact pill share it so they read as one material. */
.glass {
  background-color: rgb(251 248 242 / 0.8);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgb(255 255 255 / 0.55);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.9), inset 0 -1px 0 rgb(10 20 48 / 0.05), 0 18px 50px -20px rgb(10 20 48 / 0.45);
}

/* footer wordmark: a polished-gold highlight sweeping slowly across */
@keyframes sheen {
  0%, 20% { transform: translateX(-420px) skewX(-18deg); }
  100% { transform: translateX(1720px) skewX(-18deg); }
}

/* Split-flap board cell (components/ui/FlapBoard.tsx): two static halves and two falling flaps. */
.flap {
  position: relative; display: inline-block; flex: none;
  width: var(--cw); height: calc(var(--cw) * 1.5);
  perspective: calc(var(--cw) * 14);
  font: 700 calc(var(--cw) * 0.86) / calc(var(--cw) * 1.5) var(--font-sora), sans-serif;
  color: var(--ink, #f3ede1); text-align: center;
}
.flap > span { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; backface-visibility: hidden; }
.flap > .t, .flap > .ft { top: 0; background: #13213f; border-radius: 3px 3px 0 0; transform-origin: 50% 100%; }
.flap > .b, .flap > .fb { bottom: 0; background: #0f1b35; border-radius: 0 0 3px 3px; transform-origin: 50% 0; }
.flap > .ft, .flap > .fb { visibility: hidden; z-index: 2; }
.flap i { display: block; height: 200%; font-style: normal; }
.flap > .b i, .flap > .fb i { transform: translateY(-50%); }
.flap::after { content: ""; position: absolute; inset: 50% 0 auto; height: 1px; background: rgb(0 0 0 / 0.6); z-index: 3; }

/* The header's glass: clearer than .glass, with a thick bevelled rim — a bright top edge, a soft inner
   glow and a darker bottom lip — so it reads as a slab of curved glass. */
.glass-thick {
  background-color: rgb(251 248 242 / 0.5);
  -webkit-backdrop-filter: blur(28px) saturate(190%) brightness(1.08);
  backdrop-filter: blur(28px) saturate(190%) brightness(1.08);
  border: 1px solid rgb(255 255 255 / 0.7);
  box-shadow:
    inset 0 2px 1px rgb(255 255 255 / 0.95),
    inset 0 0 0 4px rgb(255 255 255 / 0.18),
    inset 0 10px 18px -10px rgb(255 255 255 / 0.9),
    inset 0 -3px 6px rgb(10 20 48 / 0.1),
    0 24px 60px -24px rgb(10 20 48 / 0.5),
    0 2px 6px rgb(10 20 48 / 0.08);
}
```

## 4. Layout, metadata and page order

### `app/layout.tsx`
- Load the four fonts and put all four variables on `<html lang="en">`.
- **Metadata:**
  - `metadataBase: new URL(site.url)`, plus title and description from `site`;
  - openGraph: title, description, url, siteName "RoamX", type website;
  - twitter: `summary_large_image`.
- **Viewport:** `themeColor: "#091330"`.
- **Body:** a `<script type="application/ld+json">` holding an array of three schemas, then `<SmoothScroll />`, then children. The schemas:
  - an **Organization**: name RoamX, description, url, slogan "Evolve", `sameAs` set to the social URLs;
  - a **SoftwareApplication**: "RoamX travel business portal", BusinessApplication, OS Web, offer price "9999" INR;
  - an **FAQPage** built from `faq`.

### `app/page.tsx`
```tsx
<>
  <Arrival />
  <Navbar />
  <main>
    <DoorsHero />   {/* #top  */}
    <Story />       {/* #how  */}
    <Sell />        {/* #sell */}
    <BrandTicket /> {/* #brand */}
    <Earn />        {/* #earn */}
    <Platform />    {/* #dashboard */}
    <Learn />       {/* #learn */}
    <Skills />      {/* #skills */}
    <FAQ />         {/* #faq  */}
    <FinalCTA />    {/* #join */}
  </main>
  <Footer />
  <ContactPill />
</>
```

Every scroll-driven pinned stage is a `<section data-pin data-stops="…">`. It is tall (e.g. `h-[560svh]`) and holds a `sticky top-0 h-svh overflow-hidden` stage. Its GSAP timeline is scrubbed from `"top top"` to `"bottom bottom"`.

## 5. Smooth scroll and settling: `components/SmoothScroll.tsx`

A client component that renders `null`. On mount:
- **Lenis setup:** `new Lenis({ lerp: 0.08, wheelMultiplier: 0.85, respectReducedMotion: false })`.
  - Store it in a module variable and expose `getLenis()`.
  - `l.on("scroll", ScrollTrigger.update)`.
  - Drive it from `gsap.ticker` (`l.raf(time*1000)`) and call `gsap.ticker.lagSmoothing(0)`.
- **`glideTo(target, minDuration = 1.8)`** handles programmatic scrolls.
  - The target is a y-value or a selector, resolved to `rect.top + lenis.scroll`.
  - The duration is `min(4.5, max(minDuration, 1.2 + screensTravelled*0.6))`, with easing `t => 0.5 - 0.5*cos(πt)`.
  - Without Lenis, fall back to native smooth scrolling.
  - `scrollToTarget(t)` = `glideTo(t, 2)`.
- **Idle settling:** 1200 ms after scrolling stops (not while touching, while Lenis is stopped, or while an input is focused), compute `settleTarget(y, dir)` and glide there over 1.6 s if it's more than 2 px away.
  - **Inside a `[data-pin]` section** (progress strictly between 0.004 and 0.996), read `data-stops` (default `"0,1"`) and find the segment [a,b] containing the progress. Scrolling down: go to b if more than 15 % through the segment, else a. Scrolling up: go to a unless more than 85 % through.
  - **Otherwise**, if a section boundary next to a pinned section sits between 15 % and 85 % of the viewport, settle to that boundary (down: the next section's top; up: its top − vh).
  - Ordinary content sections are never moved.
  - Track direction from `l.direction`. Touchstart cancels the timer; touchend/touchcancel reschedule it.

## 6. Brand: `components/brand/Logo.tsx` and `lib/logo-paths.ts`

Copy the attached `lib/logo-paths.ts` verbatim. It exports SVG path strings traced from the 1600×800 logo artboard: `NAVY_FACES`, `R_LEG`, `RING`, `SWOOSH`, `SWOOSH_LINE`, `BLADE`, `PLANE` and `CONTINENTS_2X`. The continents are traced at 2×, so render them inside `scale(0.5)`. Copy `app/icon.svg` too: the emblem, viewBox `318 112 540 440`.

`Logo.tsx`:
- **`Defs({id})`:**
  - `${id}-gold`, a linearGradient 0,0→1,1 with stops #fbe4a3 0, #dcab58 .3, #f1cd80 .55, #b8833a .8, #8e6025 1;
  - `${id}-navy`, stops #14284f 0, #0b1a38 .5, #06112a 1.
- **`Globe`:**
  - RING (evenodd, gold);
  - ellipse cx 514 cy 396 rx 124 ry 118 fill #050d1e;
  - ellipse rx 119 ry 115 with the navy gradient;
  - CONTINENTS at scale .5 in gold;
  - SWOOSH in gold;
  - SWOOSH_LINE stroked #0b1a38 at 3.5 with round caps;
  - PLANE in gold, `translate(705 232) rotate(-36.9)`.
- **`Wordmark`:** viewBox `40 118 1528 456`. Draw NAVY_FACES (navy gradient fill, gold gradient stroke 3.5), then R_LEG (gold), Globe and BLADE (gold).
  - Props: `title` (default "RoamX"; an empty string makes it aria-hidden; otherwise role img plus aria-label) and `className` (block).
  - Use `useId().replace(/:/g,"")` for gradient ids.
- **`Emblem`:** viewBox `318 112 540 440`, Defs plus Globe.
- **`Lockup`:** the Wordmark over a row made of a gold hairline, "EVOLVE" (Josefin, `text-gold`, tracking .75em) and a gold hairline.

## 7. Shared UI components

- **`StartButton`:** `{label = cta.start, className, onBefore}`.
  - An `<a>` with `bg-gold flex h-13 items-center justify-center rounded-full px-8 text-base font-semibold text-navy-900 transition hover:brightness-105`.
  - If `site.payUrl` is set, it links there in a new tab.
  - Otherwise `href="#join"`, and the click calls `onBefore?.()`, prevents default, and then calls `openContact()` if `site.contactForm`, else `scrollToTarget("#join")`.
- **`ScaledScreen {width,height,className}`:** renders children at a fixed design size and scales them to the container width.
  - Outer: `relative w-full overflow-hidden`, aspect `${w} / ${h}`.
  - Inner: absolute top-left, origin-top-left, `width`×`height`, `transform: scale(clientWidth/width)`, updated by a ResizeObserver.
- **`PhoneFrame`:** the phone body shared by the Platform and Learn sections, so the phone that flies between them matches exactly.

  ```tsx
  <div className="relative rounded-[clamp(30px,3.6vw,46px)] bg-[#0b0f1c] p-[3.2%] shadow-[0_40px_80px_-30px_rgba(10,20,48,0.6),inset_0_0_0_1px_rgba(255,255,255,0.1)]">
    <span className="absolute -left-[1.5%] top-[18%] h-[6%] w-[1.5%] rounded-l bg-[#1d2438]" />
    <span className="absolute -left-[1.5%] top-[27%] h-[9%] w-[1.5%] rounded-l bg-[#1d2438]" />
    <span className="absolute -right-[1.5%] top-[24%] h-[12%] w-[1.5%] rounded-r bg-[#1d2438]" />
    <div className="relative overflow-hidden rounded-[clamp(24px,3vw,38px)]">
      <span className="absolute left-1/2 top-[1.6%] z-10 h-[3.6%] w-[32%] -translate-x-1/2 rounded-full bg-[#0b0f1c]" />
      {children}
    </div>
  </div>
  ```

- **`AmbientBackground`:** aria-hidden `grain pointer-events-none absolute inset-0 overflow-hidden`. It holds an SVG (viewBox 1440×900, `xMidYMid slice`) with three dashed gold routes: stroke #c9973f, opacity .3, width 1.2, dash `2 10`, round caps, animated with `route-drift` linear infinite. Durations are 38 s, 47 s and 56 s; the middle one runs in reverse. The paths:
  - `M-50 520 C 220 430, 380 610, 640 480 S 1060 300, 1500 380`
  - `M-50 180 C 260 260, 420 80, 720 160 S 1180 330, 1500 220`
  - `M200 900 C 360 700, 620 760, 820 560 S 1200 420, 1500 120`
- **`EnquiryForm {className, tone: "dark"|"light"}`:**
  - **Fields:** name, email, phone, city, message and kind, where kind is one of "Student", "Working professional" or "Business owner" (default Student).
  - **Kind picker:** pill buttons, h-10 rounded-full px-4 text-sm semibold. The selected one is `bg-gold text-navy-900`; the others are bordered.
  - **Inputs:** `h-13 rounded-2xl border px-4 text-[16px]`, gold-400 border on focus.
    - Light tone: `border-navy-800/10 bg-white/70`. Dark tone: `border-ivory-50/15 bg-navy-950/50 text-ivory-50`.
    - Order and placeholders: "Your name"; then "Email" and "Phone / WhatsApp" in two columns from sm; "City"; a h-24 textarea, "Anything you'd like to ask? (optional)". Each has an sr-only label.
  - **Submit:** "Get in touch" ("Sending…" while loading); light tone is `bg-navy-800 text-ivory-50`.
  - **Validation:** a name is required ("Tell us your name."), and a valid email or a phone with ≥7 digits ("Add an email or phone number so we can reach you."). The error shows in a `role=status` line beside the button.
  - **Sending:** POST `/api/enquiry` with JSON of the fields plus any `utm_*` query params.
  - **Success:** swap in (AnimatePresence) "Thank you, {first name}." and "The RoamX team will get in touch to help you get started."
  - **Failure:** "Something went wrong. Please try again."
- **`ContactPill`:** fixed `bottom-4 right-4` (sm: bottom-6 right-6), z-40. It exports `openContact()`, which dispatches `roamx:contact`.
  - **Closed:** a `glass` button with h-13, borderRadius 999, a chat-bubble icon and "Talk to us". On phones it shrinks to a 52 px icon circle with the label sr-only.
  - **Open:** it morphs (motion `layoutId="contact-shell"`, spring 340/34/0.9) into a `glass` panel with borderRadius 30, width `min(100vw-32px, 440px)`, scrollable to `max-h-[min(78svh,720px)]` with `data-lenis-prevent`, padding p-6/sm:p-7.
    - Header: h3 `contact.headline` (26 px Sora semibold) and the sub, plus a round close button.
    - Body: `EnquiryForm tone="light"`.
  - **Visibility:** shown only after the intro fires `roamx:arrived` (or when `window.__roamxArrived` is set), hidden while the nav menu is open (`roamx:menu` event), and hidden from when `#join` hits top 85 % (unless open).
  - **Behaviour:** opening stops Lenis and closing starts it. Outside pointerdown and Escape close it. Show/hide uses a 700 ms expo transition with translate-y-6 and opacity.
  - Render nothing if `site.contactForm` is false.

## 8. Sections, top to bottom

### 8.0 Intro: `components/intro/Arrival.tsx` (three.js, plays once per session)
A fixed `metal-dark inset-0 z-[70]` overlay. It holds a `[data-gl]` canvas host and a hidden `[data-drop]` Wordmark (`title=""`), the "belly logo after it leaves the plane".

**Story:** someone stands on a runway centre line at blue-hour dusk. A RoamX jet rolls straight at the camera, rotates, lifts off and climbs, and the gaze follows it up until it passes overhead, belly square to camera, with the RoamX wordmark painted across its underside. As the camera looks up, the sky fades into the site's navy. The painted logo crossfades (0.22 s) into the identical DOM Wordmark, which then grows (1.4 s, power2.inOut) into the exact rect of the hero's logo (`[data-hero-logo]`) while the jet climbs out of frame. Then the overlay drops in the same frame, so nothing visibly changes.

**Mechanics:**
- **Constants:** FOV 38, eye height 1.7 m, overhead moment at T_HAND = 4.6 s, pitch 20°, climb 17°.
- **Hero logo placement:** at the overhead moment, the belly decal's world position is solved so it projects onto the hero logo's centre. The jet spans about 0.9 × viewport width (1.15× on portrait).
- **Motion:** the jet pivots on its main gear as it rotates. Speed eases from a standstill to a slow pass overhead, then accelerates away. The gear retracts after lift-off.
- **Camera:** a subtle rumble shake while rolling. The gaze starts low with the runway in the lower 20 % and locks onto the jet near overhead.
- **`airfield.ts`:**
  - **Sky dome:** a shader sphere with zenith #0a1430 (exact navy), haze #2c3554, a warm horizon glow ahead, sparse stars and a `fade` uniform.
  - **Runway:** 45 m wide, 3240 m long, a canvas asphalt texture with rubber tracks, a 30 m centre dash and edge stripes.
  - **Lights:** warm edge lights every 60 m; centre-line lights red for the last 300 m, alternating for 600 m before that, white after; a red end bar at the viewer's feet; a sparse warm city glow on the horizon.
  - **Fog:** `FogExp2(HAZE, 0.00055)`.
  - **Environment:** a PMREM env map from the sky.
- **`takeoffScene.ts`:** a code-modelled twin-engine airliner, in metres.
  - **Fuselage:** a lathe body, radius 2, length about 46.8 m.
  - **Livery:** an ivory canvas texture with panel lines, a gold cheatline over a navy pinstripe, windows, doors, cockpit glass and the registration "VT-RMX".
  - **Wings:** lofted NACA-style wings with a canvas livery (slats, flaps, aileron), flat-bottomed inboard, with gold canted winglets.
  - **Engines:** ivory nacelles with a gold intake lip and gold spinner, titanium fan blades and a steel core.
  - **Tail:** a navy fin carrying emblem decals from `/icon.svg` on both sides.
  - **Landing gear:** twin nose wheels and four-wheel main bogies, with a `retract(k)` function.
  - **Lights:** landing, taxi, strobe, beacon and nav light sprites (`updateLights`), with the landing lights blazing while facing the viewer.
  - **Belly decal:** 13 m wide, using the wordmark texture rasterised from the hero SVG (`svgTexture`, 2048 px).
  - **Materials:** physical paint with clearcoat.
- **Renderer:** ACES tone mapping, sRGB, alpha, DPR capped at 2. Lights: hemisphere 0x7f97c8/0x161a26 at 1.1; a warm afterglow directional 0xffb27a at 1.1 from far behind; a cool fill 0xc9d6ff at 0.9; a belly light 0xfff1dc at 1.6.
- **Skip rules:** skip straight to the site if `sessionStorage["roamx-arrived"]` is "1" or WebGL fails. While playing, set `history.scrollRestoration="manual"`, scroll to 0 and stop Lenis.
- **On finish:** set the session key, start Lenis, set `window.__roamxArrived = true` and dispatch `roamx:arrived`, dispose everything and unmount. Then, only if still at the very top, glide Lenis down to the end of the hero (`#top` offsetTop + height − vh) over 4.6 s with the sine ease, so the doors open on their own.

### 8.1 Navbar: `components/sections/Navbar.tsx`
- **Wrapper:** a fixed header `inset-x-0 top-3 sm:top-4 z-50 flex justify-center px-3`, with a 700 ms `cubic-bezier(0.16,1,0.3,1)` transition on transform and opacity.
- **Visibility:** visible when `(visible && !down) || open`, else `pointer-events-none -translate-y-6 opacity-0`.
  - `visible` comes from a ScrollTrigger on `#top` starting at `"top+=45% top"` (onEnter true, onLeaveBack false).
  - `down` is set by a passive scroll listener: ignore |Δy| < 8; otherwise `down = y > last`. So scrolling down hides the bar and any scroll up brings it back.
- **The bar:** inside `relative w-full max-w-[1120px]`, a `nav.glass-thick flex h-16 w-full items-center justify-between rounded-full pl-6 pr-3`.
  - Left: the Wordmark (`h-[22px] sm:h-6`) linking to the top (glide to 0).
  - Right: from 640 px, a `StartButton label={cta.short}` at h-10 px-5 text-sm, wrapped in `motion.div layoutId="nav-cta"`. Then a 40 px round menu button: two 2 px bars that cross into an X when open, with a `motion.span layoutId="nav-shell"` tint `bg-navy-800/[0.07]` (borderRadius 20) behind it while closed.
- **Menu:** the `nav-shell` glass morphs down into a `glass` panel at `absolute right-0 top-[calc(100%+10px)] w-[min(calc(100vw-24px),340px)] p-3` (borderRadius 30), like iOS Control Center.
  - Contents: the `nav` links (Sora 19 px semibold, rounded-2xl px-4 py-3, hover `bg-navy-800/[0.06]`), staggered in at delay `0.08 + i*0.04`.
  - The `nav-cta` StartButton morphs into the panel at full width h-13, so it's never on screen twice.
  - Spring: 380/36/0.9.
- **Menu behaviour:** opening stops Lenis and dispatches `roamx:menu` (detail true/false). Outside pointerdown and Escape close it. Link clicks close the menu and call `scrollToTarget(href)`.

### 8.2 Hero: `DoorsHero.tsx` (`#top`, `data-pin`, `h-[250svh] bg-navy-950`)
- **Stage:** `metal-dark sticky top-0 isolate h-svh overflow-hidden`.
- **Content:** centred column `gap-[clamp(24px,5svh,56px)] px-5 pt-14 sm:px-10`.
  1. `[data-board]` holding the **FlapBoard**.
  2. A row (`max-w-[1100px]`, column on phones, `md:flex-row md:items-end md:justify-between`).
     - **h1** Sora bold `text-[clamp(30px,4.6vw,68px)] leading-[1] tracking-[-0.035em] text-ivory-50`. Each headline line is a masked `block overflow-hidden pb-[0.08em]` containing a `[data-line]` span; line 2 gets `text-gold`.
     - **Right column** (`md:max-w-[400px]`):
       - `[data-sub]`: hero.sub, `text-[clamp(15px,1.2vw,18px)] text-ivory-50/75`;
       - `[data-form]`: `StartButton "Start earning · ₹9,999"` plus a ghost pill "See how it works" (h-13, `border-ivory-50/30`, px-7) that glides to `#how`.
- **Doors:** two `w-1/2 overflow-hidden` doors (left at 0, right at left-1/2). Each holds a `metal-dark w-[200%]` face offset so both halves form one seamless surface, with a Wordmark `w-[min(80vw,1100px)]` dead centre. The left one carries `data-hero-logo` and the title; the right one has an empty title.
- **Timeline** (scrub 0.8):
  - doors `xPercent ∓100`, duration .55, power2.inOut, at 0;
  - board from `scale 1.1, yPercent 8` to 1/0, duration .8;
  - lines `from yPercent 110`, .18, stagger .05, power3.out, at .5;
  - sub from opacity 0 / y 20 at .64;
  - form likewise at .7;
  - a trailing .18 pad.
  - `onUpdate`: once progress > 0.2, set `active=true`, which starts the board.

**FlapBoard (`components/ui/FlapBoard.tsx`).** A Solari split-flap board.
- **Cell size:** the `--cw` var is `min(24px, calc((100vw-170px)/47))`, or `calc((100vw-80px)/22.5)` below sm.
- **Container:** `rounded-[calc(var(--cw)*0.9)] border-ivory-50/10 bg-[#060d1f] p-[calc(var(--cw)*0.9)]` with a deep shadow and an inset top highlight. `role="img"`, aria-label "Example bookings: flights and hotels sold under your own brand, with the markup you keep".
- **Header row:** "Bookings" (Sora semibold, `ivory-50/60`, 0.75 cw), then 14 brand cells in gold ink (`--ink:#e7c27a`) spelling the agency name (uppercased brand samples).
- **Column labels** (0.5 cw, `ivory-50/40`), each as wide as its cells:
  - Booking (12 cells)
  - Type (6, hidden on phones)
  - Price (7, hidden on phones)
  - Your markup (7, gold ink)
  - Status (9, hidden on phones)
- **Rows:** 5 rows (the 5th hidden on phones). Each ends with a status lamp, `ivory-50/15`, turning `#e7c27a` with a glow when `data-confirmed=true`.
- **Cell markup:** `.flap` with four spans `.t .b .ft .fb`, each containing an `<i>`.
- **Flip:** go through 1–3 random glyphs from `ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789` to the target letter. Each step drops the top flap `rotationX 0 → -90` (0.055 s, power1.in), then raises the bottom flap `90 → 0` (0.055 s, power1.out). Cells in a run are staggered by 0.035 s; cells on hidden columns are set silently.
- **Fill:** on activation, fill the rows top to bottom (delay 0.3 + i·0.35) as confirmed. For each row:
  - book at +0
  - kind at +0.15
  - price at +0.3
  - markup at +0.45
  - status ("CONFIRMED") at +0.6
- **Live updates:** every 3.6 s (first after 3.2 s), and only while on screen (IntersectionObserver) and the tab is visible:
  - replace the oldest row with the next booking as "BOOKING", with no markup and a dim lamp;
  - after 1.9 s, flip in the markup and "CONFIRMED", and light the lamp;
  - every 4th booking, flip the brand to the next sample.
- Kill all calls on cleanup.

### 8.3 Story: `Story.tsx` (`#how`, `data-pin`, `data-stops="0,0.35,0.6,0.92,1"`, `h-[560svh] bg-navy-950`)
- **Layer A** (ivory with AmbientBackground): the `problem` sentence, `max-w-[1180px]`, Sora semibold `text-[clamp(34px,5.6vw,84px)] leading-[1.06] tracking-[-0.03em] text-navy-800`.
  - Each word is an `inline-block [data-word]` starting at opacity 0. "₹9,999." gets `text-gold`.
  - In the word "Now", the "o" is replaced by an inline `[data-o]` box (`h-[0.58em] w-[0.613em] mx-[0.02em]`) holding the **GlobeMark**: the logo globe laid out by its ring, an SVG viewBox `318 112 540 440` sized and offset so the ring fills the box (width 540/294 %, height 440/278 %, left −49/294 %, top −145/278 %).
  - The globe ellipse is clipped. Continents are drawn twice, the second offset −250, so sliding them reads as the globe spinning. Swoosh, line and plane go on top; the plane sits in a group at (776.2, 178.6) rotated −36.9°, with its path translated −89.
- **Layer B** `[data-dark]`: a `metal-dark` full stage clipped to `circle(0px at 50% 50%)`, text ivory, with `--ww: min(46vw,560px,56svh)` (phones `min(72vw,38svh)`).
  - A square `w-[var(--ww)]` box holds the landing slot `[data-land]` (`aspect-[294/278] w-[60%] -translate-x-[22%] translate-y-[12%]`).
  - **Desktop:** behind the slot, a gold title row "RoamX [gap of ww+5vw] Evolve", `text-[clamp(44px,7.5vw,150px)]`, Sora extrabold, tracking −0.045em.
  - **Phones:** "RoamX" above and "Evolve" below (`text-[clamp(44px,15vw,72px)]`).
  - These titles are `[data-travel]`.
  - **Below:** the steps "Buy. Brand. Book. Earn." (each `[data-step]`, opacity 0, Sora semibold `clamp(28px,4vw,56px)`), then `stepsLine` (`max-w-[46ch] text-ivory-50/60`).
- **The flyer** `[data-flyer]` (z-10, absolute top-left) holds a second GlobeMark with refs for the plane and spin groups.
- **Timeline** (scrub 1, invalidateOnRefresh). Positions are measured in stage coordinates on refresh.
  - **A:** words from opacity 0 / yPercent 35, stagger .014, dur .05, from .01; hold until .35.
  - **B (at .37):**
    - hide the inline globe and show the flyer, sized to the land box;
    - the flyer flies from the inline "o" (scaled down to its width) to the land slot at scale 1, duration .22, power2.inOut;
    - at the same time the dark stage's clip-path circle grows to half the stage diagonal + 2 px.
  - **C:**
    - the continents slide x to 500, wrapped modulo 250 (dur .63, from .37);
    - from .62 the plane flies a MotionPath loop (autoRotate, dur .28, sine.inOut) on `M776.2 178.6 C 816 149, 690 175, 530 215 C 400 248, 345 330, 352 415 C 360 510, 470 575, 590 548 C 700 523, 728 215, 776.2 178.6`, turning about its own middle (transformOrigin from its bbox);
    - visible `[data-travel]` titles slide in from the right edge of the viewport (dur .24, power1.out, at .6);
    - each step fades up (y 14) at `.7 + i*.06`;
    - pad to .98.

### 8.4 Gallery: `Sell.tsx` (`#sell`, server component, no motion)
- **Shell:** `relative overflow-hidden bg-ivory-50 py-28 sm:py-40` plus AmbientBackground; container `max-w-[1180px] px-5 sm:px-10`.
- **Header row** (`md:flex-row md:items-end md:justify-between`):
  - h2 `max-w-[13ch]` Sora semibold `clamp(40px,6vw,88px) leading-[0.98] tracking-[-0.04em] text-navy-800`;
  - the sub `max-w-[40ch] text-[clamp(16px,1.4vw,19px)] text-navy-800/65`.
- **Collage:** an uneven masonry, `mt-14 sm:mt-20 columns-2 gap-2 md:columns-3 xl:columns-4`. Each item is `relative mb-2 break-inside-avoid overflow-hidden rounded-[14px] bg-navy-800` with `aspectRatio: item.ratio`, holding a `next/image` fill, `object-cover`, quality 82, sizes `(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw`.
- **No captions, no hover, no animation.**

### 8.5 Brand: `BrandTicket.tsx` (`#brand`, `bg-ivory-100 py-28 sm:py-40`, overflow-hidden, AmbientBackground)
- **Grid:** `lg:grid-cols-[1fr_1.1fr] gap-16 items-center`.
- **Left `[data-head]`:** h2 Sora semibold `clamp(40px,5vw,76px) leading-[0.98] tracking-[-0.04em]` in two lines (the second `text-gold`), plus the sub (`max-w-[40ch]`, navy/65).
- **Right `[data-stack]`** (`max-w-[520px] pb-16`):
  - **Ticket** (white, `rounded-[26px]`, big soft shadow):
    - Header (h 76 px, bottom border): **BrandMark** plus "E-ticket" (11 px uppercase tracking .18em, navy/45).
    - Route: "BLR / Bengaluru · 08:40" → a dashed gold arrow SVG → "GOI / Goa · 09:55" (codes Sora bold 40 px).
    - A 4-column detail row: Passenger Ananya R., Date 14 Nov, Seat 12A, PNR K7Q2MZ.
    - A dashed perforation with ivory-100 notches.
    - A footer: "Fare ₹1,200 · incl. taxes" and a 26-bar barcode (every third bar 3 px, the rest 1.5 px, h-6).
  - **Voucher** (ivory-50, `rounded-[22px]`, p-5, ring navy/5), absolutely placed `-bottom-2 right-[-4%] sm:right-[-8%] w-[62%] z-20`: a small BrandMark, "Hotel voucher", "Seaside resort, Candolim", "3 nights · Check-in 14 Nov · 2 guests".
  - **BrandMark:** a rounded-xl tile in the brand tint with its initials, plus the name in Sora semibold. It cycles through `brand.samples` every 2.8 s, swapping with AnimatePresence `mode="wait"` (in from y 10 with blur 4 px, out to y −10, 0.55 s expo).
- **Motion:**
  - head children from y 40 / opacity 0, stagger .1, 1.1 s expo.out at top 75 %;
  - ticket scrubbed from `y 120, rotate -6, opacity 0` to `y 0, rotate -2, opacity 1` (top 90 % → top 40 %);
  - voucher from `y 160, rotate 8` to `y 0, rotate 4` (top 80 % → top 30 %).

### 8.6 Earn: `Earn.tsx` (`#earn`, `data-pin`, `data-stops="0,0.36,0.72,1"`, `h-[300svh]`)
- **Stage:** a `metal-dark` sticky stage, centred column, text ivory.
- **h2:** "You set the markup. / You keep it." (the second line gold), Sora semibold `clamp(32px,4.6vw,68px)`.
- **Equation row** `[data-term]` ×5: **₹1,000** "Portal price" + **₹200** (gold) "Your markup" = **₹1,200** "Your customer pays".
  - Number style: `font-display font-bold leading-none tracking-[-0.04em] tabular-nums`, `clamp(40px,6.4vw,96px)`.
  - Operators: `clamp(28px,3.6vw,52px)`, ivory/40.
  - Labels: 13 px ivory/55.
- **Split bar** (`max-w-[720px]`, h-3, gap-1): a fare bar (ivory/80, flex 1000) and a markup bar (`bg-gold`, flex 200). Below it, "₹1,000 to the portal" (ivory/60) and "₹200 to you" (gold-200, semibold).
- **`[data-run]`:** "<count> bookings like this", then a big gold total (`clamp(48px,7vw,110px)`), "yours to keep", then `paybackLine` (`max-w-[34ch]`, ivory/85), then `earn.note` (12 px ivory/40).
- **Timeline** (scrub .8):
  - terms from y 40, stagger .07, at .02;
  - fare bar scaleX from 0 (origin left) at .4;
  - markup bar at .52;
  - splits at .56;
  - run block at .74;
  - a tally from 1 → 20 (ease none, dur .2, at .78), writing count and `inr(n*200)` (Indian locale);
  - pad .04.

### 8.7 Platform: `Platform.tsx` (`#dashboard`, `relative overflow-x-clip bg-ivory-100 pb-28 pt-28 sm:pb-40 sm:pt-36`, AmbientBackground)
- **Head:** centred `max-w-[760px]`. h2 "Your whole business, one dashboard." (Sora semibold `clamp(36px,5vw,72px)`) and the sub (navy/60).
- **Stage `[data-stage]`** (`max-w-[1000px] mt-16 sm:mt-20`):
  - **Laptop** (perspective 2200):
    - Lid `[data-lid]`: `w-[88%] origin-bottom rounded-t-[clamp(10px,1.8vw,22px)] bg-[#0b0f1c] p-[1.3%] pb-[1.6%]`, preserve-3d, with a tiny camera dot.
    - Screen: a `ScaledScreen 1000×625` running **DashboardScreen**.
    - Base: a champagne metal bar, `h-[clamp(9px,1.5vw,18px)]`, gradient `#ece7dd → #cfc8bb → #9f998c`, with a notch.
  - **Phone** `[data-phone]`: `relative z-10 mx-auto mt-10 w-[min(62vw,260px)]`; on desktop `md:absolute md:-bottom-[12%] md:-right-[4%] md:w-[21%]`.
    - Inside, `<div data-handoff className="relative z-[45] will-change-transform">` holds a PhoneFrame.
    - The PhoneFrame contains `ScaledScreen 300×620` with **AgentAppScreen**, plus an overlay `<div data-handoff-screen className="absolute inset-0 opacity-0">` holding `ScaledScreen 300×620 <PortalHome/>` (imported from Learn).
- **Motion:**
  - lid `rotateX -86 → 0`, scrubbed top 90 % → top 25 % of the stage;
  - phone from yPercent 35 / opacity 0, top 55 % → top 10 %;
  - head children from y 40, stagger .1, expo.

**DashboardScreen (1000×625, `bg-navy-950`, text ivory).**
- **Sidebar** (64 px): an "NJ" tile (#1f3a6e) and 5 icon squares (the first with a ring #c9973f).
- **Header** (58 px): "Nova Journeys / Your business · This month" on the left, "Markup earned ₹3,770" (gold-200) on the right.
- **Search card:** tabs Flights / Hotels / Buses / Packages; the active tab cycles every 2.6 s in `bg-gold`. Fields: "From  Bengaluru", "To  Goa", "14 Nov", "2 travellers". Then "Your markup on this booking + ₹350".
- **Bookings table:** columns Booking / Customer / Type / Fare / Your markup, from `platform.bookings`. Booking ids in mono; markups in gold-200 with "+".
- **Activity column** (270 px): an event stream that adds the next `platform.events` item every 1.9 s.
  - Show up to 5, newest on top, in rows `rounded-xl bg-navy-800` with a tone dot (ok = emerald-400, gold = gold-200), the text (12.5 px) and a mono time.
  - Animate with spring layout.

**AgentAppScreen (300×620, `bg-ivory-50`).**
- **Top:** status bar "9:41" plus a battery outline. Then "Good morning / Nova Journeys" and an NJ tile.
- **Navy card:** "Markup earned this month", "₹3,770" (Sora 32 px, gold-200), "4 bookings · all yours".
- **Card:** a white card cycling every 2.8 s through 4 states (spring 240/24):
  1. New enquiry: "Ananya R. · Goa, 2 people", "Flights and a beach stay, 14–17 Nov", gold button "Build a quote".
  2. Quote: "Flights BLR ⇄ GOI ₹8,400", "Resort, 3 nights ₹9,600", "Your markup + ₹1,150" (#b8862f).
  3. Ticket issued (emerald label): BLR - - - GOI, "Sent to Ananya under Nova Journeys".
  4. Booking complete: "+ ₹1,150", "Added to your earnings".
- **Bottom:** 4 page dots, the first one elongated.

### 8.8 Learn: `Learn.tsx` (`#learn`, `data-pin`, `data-stops="0,0.13,0.33,0.53,0.73,0.96,1"`, `h-[520svh] bg-navy-950 text-ivory-50`)
A pinned full-bleed **photo story**. A phone walks through the portal while notifications pop out of it, and the last frame turns "Student" into "Entrepreneur".

- **Constants:**
  - `BEATS = [0.02, 0.22, 0.42, 0.62]`
  - `END = 0.82`
  - `SWAY = [0, 7, -6, 8]` (phone rotationY in degrees per beat)
- **Photos:** the 4 beat photos plus the end photo, stacked full-bleed (`next/image fill`, `object-cover`, objectPosition from `pos`, sizes 100vw, quality 82), each inside a wrapper whose child scales. Over them sits a tint `bg-navy-950/50`.
- **Content column:** `max-w-[1180px] flex h-full flex-col px-5 sm:px-10 pt-24 pb-24 md:pb-[clamp(28px,6svh,72px)]`, text-shadow `0 2px 24px rgb(7 15 36/.6)`.
  - h2 `learn.headline`, `max-w-[16ch]`, Sora semibold `clamp(26px,3.2vw,46px)`.
  - At the bottom (`mt-auto`), a caption box `h-[3.5em] md:h-[2.4em] text-[clamp(19px,2.3vw,34px)]` with the four captions stacked absolutely at the bottom (`max-w-[26ch] md:max-w-[22ch]`, Sora semibold, leading 1.15). One plain line per beat.
- **Phone container:** `absolute left-1/2 top-[50%] w-[min(56vw,215px,27svh)] -translate-x-1/2 -translate-y-1/2 [perspective:1400px] md:left-[76%] md:w-[clamp(240px,40svh,340px)]`.
  - It holds `<div data-phone-slot className="invisible"><div data-phone><PhoneFrame><ScaledScreen 300×620>`.
  - The screen is `flex h-[620px] w-[300px] flex-col bg-ivory-100 text-navy-800`: **PortalTop**, then a `relative mt-4 flex-1 overflow-hidden` area holding the 4 `[data-screen]` layers (absolute inset-0 px-4).
- **PortalTop:**
  - status bar "9:41" plus a battery outline;
  - a row with the "NJ" mark (`size-9 rounded-[10px] bg-[#1f3a6e]`) and "Nova Journeys" (Sora 17 px);
  - a navy-900 pill "Earned this month" with a ref'd gold-200 figure (Sora 22 px) starting at ₹0.
- **The four screens:**
  1. **Home:**
     - a lock-icon pill "Your portal link";
     - a "Where to?" input;
     - a 2×2 grid: tall navy tiles "Flights" and "Hotels" (pt-12, Sora 18 px), then light tiles "Buses" and "Packages";
     - a white row with a gold play circle: "Training / Taking your first booking".
  2. **Book:**
     - a chat bubble from avatar "R" (#7a3b2e): "Can you book Goa for 2 this Friday?";
     - a flight card BLR ···(dotted gold)··· GOI, "Fri 07:40 · 2 seats · non-stop", with a gold button `[data-press]` "Book for Riya";
     - a navy reply bubble "Done. Sending your tickets.".
  3. **Ticket:** a white card with the NJ mark, "Nova Journeys", "E-ticket"; BLR → GOI at 40 px; "Riya + 1 · Fri 07:40"; dashed divider; "Fare ₹4,200"; "Your markup" plus a gold chip "+₹350".
  4. **List:** a white card listing `learn.bookings` with `{kind} · {who}` and gold chips `+₹350` etc.
  - Chip style: `rounded-full bg-[#e7c27a] px-2.5 py-1 font-display text-[13px] font-bold text-navy-900`.
  - Every element that animates in carries `data-in`.
- **Toasts:** one per entry in `learn.toasts`, flattened with their beat.
  - Style: `absolute left-1/2 z-10 w-max max-w-[78vw] -translate-x-1/2 rounded-2xl bg-ivory-50 px-4 py-3 text-[14px] font-semibold text-navy-800`, big dark shadow, a 2 px gold dot before the text. Desktop: `md:translate-x-0 md:max-w-[300px] md:text-[15px] md:left-auto`.
  - Positions by index — phones centred below the phone, desktop to the left of it:

    ```
    "top-[78%] md:right-[86%] md:top-[30%]",
    "top-[68%] md:right-[86%] md:top-[46%]",
    "top-[62%] md:right-[86%] md:top-[16%]",
    "top-[73%] md:right-[86%] md:top-[40%]",
    "top-[84%] md:right-[86%] md:top-[64%]",
    ```

- **End frame** (centred overlay):
  - `[data-from]` "Student": absolute at top, Sora bold `clamp(40px,7vw,110px)`, ivory/80.
  - `[data-to]` "Entrepreneur": `text-gold` Sora extrabold `clamp(44px,9vw,140px)`, tracking −0.045em.
  - `[data-training]`: the training line.
- **Timeline** (scrub 1, from `top top` to `bottom bottom`). `stops = [...BEATS, END]`.
  - **Initial state:** photos 1+ hidden; screens 1+ at xPercent 100; captions hidden at y 18; toasts hidden at scale .6, y 24; phone rotationY 0; from/to/training hidden (to and training also blurred 6 px).
  - **Photos:** for photo i>0, fade in (dur .06, sine.inOut) at `stops[i]-0.04`. Every photo's inner wrapper scales 1.12 → 1 over .26 from `max(0, stops[i]-0.04)`.
  - **Phone:**
    - on each beat after the first, turn rotationY to SWAY (dur .08) at `beat-0.03`;
    - at `END-0.04`, the phone leaves: autoAlpha 0, y −60, scale .92, dur .05, power2.in.
  - **Screens:** at `beat-0.02` the previous screen goes to xPercent −30 and fades, and the new one slides in to 0 (dur .05).
    - The new screen's `[data-in]` items rise from y 14 (stagger .006, dur .03) at `beat+0.03`.
    - Screen 0 is not staggered: it arrives already filled, as the dashboard phone showed it.
  - **Press:** at `BEATS[1]+0.1`, the "Book" button presses to scale .93 and back (yoyo, dur .012).
  - **Captions:** in at `beat+0.04` (dur .04); out to y −18 at `stops[i+1]-0.05`.
  - **Toasts:** the nth toast of a beat pops in at `BEATS[beat] + 0.08 + nth*0.02` (`back.out(1.7)`, dur .04) and leaves (y −20, power2.in) at `stops[beat+1] - 0.04`, so every toast is gone by the time the phone leaves.
  - **Earnings:** a tally tweens to each new `learn.earned` value at `beat+0.08` (dur .06), writing `₹` plus the Indian locale number.
  - **End:** "Student" in at END+.02, out (blur) at END+.08; "Entrepreneur" in (unblur) at END+.10; training at END+.13; pad to .98.
- **Phone handoff from the Platform section.** The dashboard phone physically flies down into this phone's spot. This is a separate ScrollTrigger on `#learn` from `"top bottom"` to `"top top"`, using `onUpdate` and `onRefresh`, and called once immediately.

  ```ts
  const from = document.querySelector<HTMLElement>("[data-handoff]");
  const slot = q("[data-phone-slot]")[0];
  if (from) {
    const box = from.parentElement!;
    const layer = from.querySelector<HTMLElement>("[data-handoff-screen]")!;
    const ease = gsap.parseEase("power2.inOut");
    const fly = (st: ScrollTrigger) => {
      const p = st.progress; const done = p >= 1;
      slot.style.visibility = done ? "visible" : "hidden";
      from.style.visibility = done ? "hidden" : "";
      if (p <= 0) { gsap.set(from, { clearProps: "transform" }); layer.style.opacity = "0"; return; }
      const a = box.getBoundingClientRect(); const b = slot.getBoundingClientRect(); const e = ease(Math.min(p, 1));
      gsap.set(from, { x: (b.left - a.left) * e, y: (b.top - a.top) * e, scale: 1 + (b.width / a.width - 1) * e, transformOrigin: "0 0" });
      layer.style.opacity = String(gsap.utils.clamp(0, 1, (p - 0.2) / 0.2));
    };
    const st = ScrollTrigger.create({ trigger: root.current, start: "top bottom", end: "top top", onUpdate: fly, onRefresh: fly });
    fly(st);
  } else slot.style.visibility = "visible";
  ```

  Both rects are read live, so the flight tracks the scroll exactly. The app screen crossfades into the portal home between 20 % and 40 % of the flight. At the top, the story's own phone (same frame, same spot) takes over, and scrolling back up hands it back. This works because Platform uses `overflow-x-clip`, not `overflow-hidden`.
- Export `PortalHome()` from this file: PortalTop plus HomeScreen in the 300×620 screen shell, used by Platform's overlay.

### 8.9 Skills: `Skills.tsx` (`#skills`, `relative bg-ivory-50 py-28 sm:py-40 text-navy-800`)
- **Grid:** `max-w-[1180px] gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20`.
- **Left** (`lg:sticky lg:top-32 lg:self-start`): h2 `skills.headline` (Sora semibold `clamp(36px,5vw,72px)`) and the sub (`max-w-[36ch]`, navy/65).
- **Right:** a `ul` with top and bottom hairlines (`border-navy-800/10`). Each `li[data-skill]` (py-8 sm:py-10) contains:
  - a word (Sora **bold** `clamp(40px,6vw,88px) leading-[1] tracking-[-0.04em]`) drawn as a muted `text-navy-800/15` copy, with an `absolute inset-0 [data-ink]` full-ink copy over it;
  - the line (`max-w-[44ch]`, navy/70) as `[data-skill-line]`.
- **Ink motion:** for each row, a scrub (.8) from `top 88%` to `top 48%`. The ink clip-path goes from `inset(-0.1em 100% -0.3em 0)` to `inset(-0.1em 0% -0.3em 0)` (ease none) — the word fills with ink as if being written; the negative insets keep descenders. The line rises from opacity 0 / y 18 on the same trigger.
- **Close** `[data-close]`: below the grid (`mt-24 sm:mt-36`, same container), Sora bold `text-[clamp(30px,4.2vw,62px)] leading-[1.04] tracking-[-0.035em]`.
  - Two masked lines: "Start here." (block) and "Then go build something bigger." (`text-gold inline-block`, because inline-block keeps the gold gradient as wide as the text).
  - They rise from yPercent 110, stagger .1, 1.2 s expo.out, at top 80 %.

### 8.10 FAQ: `FAQ.tsx` (`#faq`, `bg-ivory-100 py-28 sm:py-40`)
- **Layout:** the same two-column grid as Skills. The h2 "Questions, answered." is sticky on large screens.
- **Accordion:** one item open at a time; the first is open by default.
  - **Row:** a full-width button, py-6, question in Sora medium `clamp(18px,1.7vw,22px)`.
  - **Toggle:** a 36 px round icon, bordered when closed, `bg-navy-800` with gold-200 strokes when open; the vertical stroke scales to 0 to turn the plus into a minus.
  - **Answer:** animates height and opacity (0.45 s expo), shown as `max-w-[60ch] pb-7 pr-14 text-[16px] navy/65`.

### 8.11 Final CTA: `FinalCTA.tsx` (`#join`, `metal-dark relative overflow-hidden pt-28 sm:pt-40 text-ivory-50`)
- **Grid:** `lg:grid-cols-[1fr_1.1fr] gap-14 lg:gap-20 lg:items-center`.
- **Left:** h2 Sora bold `clamp(44px,6.2vw,96px)`, two masked lines "Take your" / "first step." (the second gold), rising from yPercent 110, stagger .08, 1.2 s expo at top 70 %. Below it, the sub (ivory/65).
- **Offer card:** `rounded-[28px] border border-[#c9973f]/35 bg-navy-950/55 p-7 sm:p-9`, containing:
  - **₹9,999** (`text-gold`, Sora bold `clamp(52px,6vw,80px)`);
  - the terms joined with " · " (15 px ivory/70);
  - `perDay` (15 px gold-200, mt-1.5);
  - a 2-column list (from sm) of `includes`, each with a gold-200 check-mark SVG;
  - a StartButton (`mt-8 w-full sm:w-auto`).
- **Sky strip `[data-sky]`** (`mt-20 sm:mt-28 h-[clamp(180px,24vw,300px)]`):
  - a gold horizon hairline at bottom 14 % (scaleX 0 → 1 from the left);
  - a navy-950 ground below it;
  - the side-view **Plane** SVG (`w-[clamp(200px,30vw,420px)]`) taking off left to right: x from −1.1× its width to sky width + 0.1×, y up to −55 % of the sky height, rotation 0 → −9, power1.in, scrubbed from top bottom → bottom 35 %.

**Plane.tsx:** a side-view airliner in ivory livery, viewBox 620×230, flying right. It has a far wing and stabiliser (#b9ae99), a tail fin #e6dccb with a navy stripe and gold edge, an ivory fuselage with a lower shade, a gold cheatline, 12 navy windows, the cockpit, a door, the near wing with gold trim, and an engine (navy with a gold-gradient lip). The Wordmark (168 wide, wordmark aspect) is centred on the fuselage at x 310, y 122.

### 8.12 Footer: `Footer.tsx` (`bg-ivory-50`)
- **Container:** `max-w-[1440px] px-6 sm:px-10 pt-14 sm:pt-20`.
- **Columns:** `grid-cols-2 md:grid-cols-[1fr_1fr_1.3fr] gap-10`. Labels are mono 12 px navy/45; links are 15 px navy, hover #9a6e2a.
  - **Explore:** the nav links (gliding).
  - **Connect:** Instagram, LinkedIn, "X / Twitter".
  - **Contact:** the mailto email, plus the phone and address only if set (they're empty for now).
- **Wordmark:** a giant full-width Wordmark (`mt-16 sm:mt-24`) with a **sheen**: an overlay SVG clipped to the logo shapes holds a 260-wide rect with a white-gold linearGradient (#fff6dc at 0 → .55 → 0) animated by `sheen 7s cubic-bezier(0.45,0,0.25,1) infinite`. The clip shapes are NAVY_FACES, R_LEG, RING, the globe ellipse, SWOOSH and BLADE.
- **Bottom row** (13 px navy/55): Privacy Policy · Terms · Refund Policy (placeholders `#`) and "© 2026 RoamX" in mono.

## 9. Enquiry endpoint: `functions/api/enquiry.ts` (Cloudflare Pages Function)
`onRequestPost`:
1. Parse the JSON (null on failure).
2. Build `{ at: ISO time }` plus the trimmed strings for `name, email, phone, city, message, kind` and `utm_source/medium/campaign/term/content`. Cap `message` at 1000 characters and everything else at 200.
3. If there's no name, or no valid email and no phone with ≥7 digits, return 400 `{ok:false, error:"Name and an email or phone number are required"}`.
4. If `env.ENQUIRY_WEBHOOK_URL` is set, POST the entry there; return 502 if that fails. Otherwise `console.log("[enquiry]", …)`.
5. Return `{ok:true}`.

## 10. README
Explain:
- `npm install` / `npm run dev`;
- that copy is in `lib/content.ts` (TODOs are placeholders);
- `npm run build` → `out/`;
- `npx wrangler pages dev out` for a local preview;
- Cloudflare Pages settings: preset None, build `npm run build`, output `out`, env `NODE_VERSION=22`, optional `ENQUIRY_WEBHOOK_URL`;
- that every push to main deploys;
- for a custom domain, also update `site.url`.

## 11. Acceptance checklist
- [ ] First visit: the jet intro plays and hands its belly logo into the hero logo with no visible jump, then the page glides down as the doors open. A reload in the same tab skips the intro.
- [ ] The split-flap board flips bookings in, confirms them with gold markups, and swaps the brand name every 4th booking.
- [ ] Story: the line appears word by word; the "o" of "Now" is the globe; it flies to centre as the navy circle opens; the globe spins; the plane loops; RoamX / Evolve slide in; Buy. Brand. Book. Earn. appears.
- [ ] The gallery is a static uneven collage: 2 columns on phones, 3 on tablets, 4 on desktop. No captions.
- [ ] The brand names cycle on the ticket and voucher.
- [ ] The Earn tally counts to 20 bookings / ₹4,000 and shows the payback line ("About 50 bookings…").
- [ ] The laptop lid opens on scroll. The phone from that section flies into the photo story and becomes its phone, morphing its screen on the way; scrolling back reverses it.
- [ ] In the photo story, every notification is gone before the "Student → Entrepreneur" frame.
- [ ] Skills words ink in on scroll; the close line is gold and readable on ivory.
- [ ] The navbar (thick curved glass) appears after 45 % of the hero, hides when scrolling down, and returns on any scroll up. The menu morphs from the pill.
- [ ] The "Talk to us" pill opens the form panel and hides over the final section. Start buttons open it while `payUrl` is empty.
- [ ] Idle scroll settles only inside or at the edges of pinned stages.
- [ ] No horizontal scroll at 360, 390, 768, 900, 1280 or 1440 px widths.
- [ ] `npx tsc --noEmit`, `npm run lint` and `npm run build` are all clean.

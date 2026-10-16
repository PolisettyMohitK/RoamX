// All page copy lives here so it can be edited without touching components.
// Items marked TODO are placeholders awaiting real assets/details from the client.
// Open client questions are tracked in the "RoamX: client questions" doc.

// width and quality are added per screen by lib/imageLoader.ts
const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop`;

export const PRICE = "₹9,999";

export const site = {
  name: "RoamX",
  tagline: "Evolve",
  url: "https://roamxevolve.pages.dev", // TODO: custom domain when ready
  title: `RoamX — Start your own travel company for ${PRICE}`,
  description: `Sell flights, hotels, buses and holiday packages under your own brand and keep the markup you add. One-time ${PRICE}, up to 5 years. Built for students, open to everyone.`,
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
  start: "Start your company",
  short: `Start · ${PRICE}`,
};

// Hero slideshow: each photo has a foreground cutout in /public/hero (made from the same photo), so the
// destination word sits between the sky and the landmark. `y` = the word's vertical centre (share of the screen); `my` = the same on portrait screens.
// Free Unsplash photos for now. TODO: replace with the client's own photos (and regenerate the cutouts).
export const hero = {
  headline: ["Your own travel company.", PRICE],
  sub: "Sell flights, hotels, buses and holidays under your own brand, and keep the markup you add. Built for students, open to everyone.",
  secondary: "See how it works",
  slides: [
    { place: "Jaipur", cutout: "jaipur", y: 0.27, my: 0.264, src: unsplash("photo-1661924326425-c14a6426d989"), alt: "Jal Mahal palace on Man Sagar lake, Jaipur" },
    { place: "Bali", cutout: "bali", y: 0.25, my: 0.312, src: unsplash("photo-1711609110590-5ad5c4599e56"), alt: "Pura Ulun Danu Bratan temple on a lake in Bali at golden hour" }, // Katarzyna Zygnerska
    { place: "Ladakh", cutout: "ladakh", y: 0.43, my: 0.44, src: unsplash("photo-1548501461-e2399cb271ee"), alt: "Mountain road in Ladakh under a blue sky" },
    { place: "Kerala", cutout: "kerala", y: 0.2, my: 0.243, src: unsplash("photo-1593693401060-9fc28cf9e368"), alt: "Houseboat on the palm-lined backwaters of Kerala" }, // Abhishek Prasad
    { place: "Santorini", cutout: "santorini", y: 0.28, my: 0.356, src: unsplash("photo-1580502304784-8985b7eb7260"), alt: "Santorini's white cliffside village lit up at dusk" }, // James Ting
  ],
};

export const problem = `Starting a travel company used to take lakhs, licences and years of contacts. Now it takes ${PRICE}.`;
export const problemHighlights = [`${PRICE}.`];

// TODO: confirm the real onboarding steps with the client (doc question 2).
export const steps = ["Buy", "Brand", "Learn", "Earn"];
export const stepsLine = "Pay once, put your name on it, learn the trade as you go, and keep every rupee of markup you add.";

// Gallery tiles: span = [columns, rows] in a 4-column grid (2 on phones). Free Unsplash photos for now.
export const sell = {
  headline: "Sell everything a trip needs.",
  sub: "One dashboard gives you flights, hotels, buses and holiday packages to sell to your own customers.",
  // ordered so the dense grid packs with no gaps at 4 and at 2 columns
  items: [
    { kind: "Holiday packages", title: "Backwater escapes", line: "Ready-made trips to resell", span: [2, 2], image: unsplash("photo-1593693411515-c20261bcad6e"), alt: "Houseboat on the Kerala backwaters" },
    { kind: "Hotels", title: "Waterside retreats", line: "Stays your customers remember", span: [2, 2], image: unsplash("photo-1766483683187-28ccf8662268"), alt: "Resort cottages on a calm backwater" },
    { kind: "Flights", title: "From the first enquiry to the boarding pass", line: "Every ticket carries your brand", span: [2, 1], image: unsplash("photo-1639616347414-b7904572cb49"), alt: "Aircraft wing over an airport at dusk" },
    { kind: "Holiday packages", title: "Mountain road trips", line: "Adventure, packaged", span: [1, 2], image: unsplash("photo-1548501461-e2399cb271ee"), alt: "Mountain road in Ladakh" },
    { kind: "Hotels", title: "Resorts for every budget", line: "From city hotels to resorts", span: [1, 1], image: unsplash("photo-1687079504254-23bac6232f46"), alt: "Resort pool surrounded by palm trees" },
    { kind: "Buses", title: "Intercity buses", line: "Routes across the country", span: [1, 2], image: unsplash("photo-1567516211940-21cc7895b2c1"), alt: "State bus on a ghat road" },
    { kind: "Hotels", title: "Stays by the sea", line: "Resorts and beach stays", span: [1, 2], image: unsplash("photo-1582719508461-905c673771fd"), alt: "Infinity pool deck at a seaside resort" },
    { kind: "Flights", title: "Tickets under your name", line: "Book flights for your customers", span: [1, 3], image: unsplash("photo-1623039541649-7cbe31b08d65"), alt: "Aircraft wing above the clouds at sunset" },
    { kind: "Buses", title: "Hill routes", line: "Buses for every kind of trip", span: [1, 2], image: unsplash("photo-1771260262905-69d9989f180e"), alt: "Bus on a winding forest road" },
    { kind: "Holiday packages", title: "Heritage holidays", line: "Palaces, forts and lakes", span: [2, 1], image: unsplash("photo-1661924326425-c14a6426d989"), alt: "Jal Mahal palace on a lake at dusk" },
  ],
  // the floating window's copy, per kind
  detail: {
    Flights: "Search and book flights for your customers from your dashboard. The ticket goes out under your company's name, and the markup you add on top is yours.",
    Hotels: "Find stays from city hotels to resorts and book them for your customers. Vouchers carry your brand, and you choose the markup on every booking.",
    Buses: "Book intercity bus seats for your customers in a few taps. A small markup on every seat adds up across many bookings.",
    "Holiday packages": "Resell ready-made holiday packages as your own. Add your markup, share the trip under your brand, and keep what you earn.",
  } as Record<string, string>,
};

// Sample agency brands for the ticket mockup — the point is that it's the buyer's name, not RoamX's.
export const brand = {
  headline: ["Your name on", "every booking."],
  sub: "Tickets and bookings carry your company's logo, not ours. Your customers remember you, and come back to you.",
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

export const platform = {
  headline: "Your whole business, one dashboard.",
  sub: "Search and book, issue tickets under your brand, and see what you've earned, from a laptop or your phone.",
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

// The "Learn" scene: a student's travel company growing, beat by beat. One caption per beat.
export const learn = {
  headline: "Learn the business by running one.",
  captions: ["Your first enquiry", "Your first booking", "Your first profit", "Your own customers"],
  from: "Student",
  to: "Entrepreneur",
  enquiry: "Goa trip for 2?",
};

// Only answers confirmed by the client. TODO: add more as the client confirms them (see the questions doc).
export const faq = [
  {
    q: "What do I get for ₹9,999?",
    a: "Your own travel business portal: one dashboard to sell flights, hotels, buses and holiday packages under your own brand. It's a one-time payment for up to 5 years of use, with no hidden fees.",
  },
  {
    q: "How do I earn money?",
    a: "You add your own markup on top of each booking and keep it. For example, if a ticket costs ₹1,000 and you sell it for ₹1,200, the ₹200 is yours.",
  },
  {
    q: "Will my customers see my brand?",
    a: "Yes. Your company's logo and name appear on the bookings you make, so your customers see your business, not ours.",
  },
  {
    q: "I'm a student with no experience. Can I do this?",
    a: "Yes, that's who RoamX is built for. The software works as a guide to the travel business, so you learn customer handling and gain real experience as you go.",
  },
  {
    q: "Is it only for students?",
    a: "No. We focus on students, but anyone who wants to start a travel business can join.",
  },
  {
    q: "Who runs the platform?",
    a: "A RoamX team runs the portal behind you, so you can focus on finding and looking after your customers.",
  },
];

export const finalCta = {
  headline: ["Start your", "travel company."],
  sub: "One payment. Your brand. Your customers. Your markup.",
  terms: ["One-time payment", "Up to 5 years of use", "No hidden fees"],
  includes: [
    "Your own travel business dashboard",
    "Your logo and name on every booking",
    "Flights, hotels, buses and holiday packages",
    "Keep 100% of the markup you add",
    "Learn the business as you go",
    "The RoamX team behind you",
  ],
};

export const contact = {
  pill: "Talk to us",
  headline: "Rather talk to us first?",
  sub: "Leave your details and the RoamX team will get in touch.",
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

// All page copy lives here so it can be edited without touching components.
// Items marked TODO are placeholders awaiting real assets/details from the client.

export const site = {
  name: "RoamX",
  tagline: "Evolve",
  url: "https://roamx.app", // TODO: final domain
  description:
    "RoamX is the corporate mobility platform that books, routes, tracks and reconciles every employee trip from one dashboard.",
  email: "hello@roamx.app", // TODO: real contact email
  instagram: "roamx", // TODO: real handle
  socials: {
    instagram: "https://instagram.com/roamx", // TODO
    linkedin: "https://linkedin.com/company/roamx", // TODO
    x: "https://x.com/roamx", // TODO
  },
};

export const nav = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Platform", href: "#platform" },
  { label: "FAQ", href: "#faq" },
];

export const hero = {
  headline: ["Your company's commute,", "handled."],
  sub: "Book, route, track and reconcile every employee trip from one dashboard.",
  image:
    "https://images.unsplash.com/photo-1543996991-8e851c2dc841?auto=format&fit=crop&w=2400&q=80", // Denys Nevozhai / Unsplash. TODO: branded photo
};

export const problem =
  "Rosters on WhatsApp. Drivers who don't show. Invoices nobody can check. Corporate transport deserves better.";
export const problemHighlights = ["better."];

export const steps = ["Request", "Route", "Ride", "Reconcile"];
export const stepsLine = "One platform runs every trip, from the first tap to the final invoice.";

export const features = {
  headline: "Everything a fleet needs. Nothing it doesn't.",
  items: [
    { key: "tracking", title: "Live tracking", line: "Every vehicle and every rider in real time, with live trips shared to your security desk." },
    { key: "pooling", title: "Smart pooling", line: "Riders are grouped by route and shift, so fewer vehicles carry more people." },
    { key: "safety", title: "Safety by default", line: "OTP boarding, in-app SOS and night-drop rules protect every employee on every trip." },
    { key: "approvals", title: "Policy & approvals", line: "Decide who travels, when and how. Trips outside policy never get booked." },
    { key: "fleet", title: "Vendors & fleet", line: "Every partner, driver and vehicle managed in one place instead of ten spreadsheets." },
    { key: "analytics", title: "Cost clarity", line: "Spend by team, route and kilometre, with vendor invoices reconciled automatically." },
  ],
};

export const platform = {
  headline: "One platform. Every seat in the company.",
  sub: "A command centre for admins and a two-tap app for every employee.",
  events: [
    { t: "08:41", text: "Route 07 picked up Priya S.", tone: "ok" },
    { t: "08:42", text: "Cab KA-01 · 4 min delay → rerouted", tone: "warn" },
    { t: "08:43", text: "Night-drop approved for Rahul M.", tone: "ok" },
    { t: "08:44", text: "Shuttle 12 reached Tech Park", tone: "ok" },
    { t: "08:45", text: "Invoice #2281 auto-matched · ₹48,200", tone: "gold" },
    { t: "08:46", text: "SOS cleared · Route 03", tone: "warn" },
  ],
  trips: [
    { id: "R-07", label: "Whitefield → Tech Park", seats: "14/18", eta: "6 min" },
    { id: "R-03", label: "Koramangala → HQ", seats: "9/12", eta: "11 min" },
    { id: "C-01", label: "Airport → Client site", seats: "1/4", eta: "24 min" },
    { id: "R-12", label: "HSR → Tech Park", seats: "16/18", eta: "Arrived" },
  ],
};

// TODO: replace with real pilot-partner quotes (with permission)
export const testimonials = [
  {
    quote: "We retired three spreadsheets and a WhatsApp group in the first week.",
    name: "Head of Admin",
    org: "IT services company",
  },
  {
    quote: "Our night-shift team finally trusts the drop. That alone was worth it.",
    name: "HR Lead",
    org: "Operations company",
  },
  {
    quote: "Vendor invoices used to take a week to check. Now they match themselves.",
    name: "Finance Manager",
    org: "Consulting firm",
  },
];

// TODO: real team names, roles and photos
export const team = [
  { name: "Founder Name", role: "Founder & CEO", image: "" },
  { name: "Co-founder Name", role: "Co-founder & CTO", image: "" },
  { name: "Team Member", role: "Head of Operations", image: "" },
  { name: "Team Member", role: "Product Design", image: "" },
];

export const faq = [
  {
    q: "Who is RoamX for?",
    a: "Companies that move employees: daily office commutes, shift transport, airport runs and client visits. If you run shuttles or book cabs for staff, RoamX is built for you.",
  },
  {
    q: "Do we need to own vehicles?",
    a: "No. RoamX works with your existing transport vendors, your own fleet, or a mix of both.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams go live in under two weeks. We import your employee roster, offices and vendors, and your people simply download the app.",
  },
  {
    q: "How does RoamX keep employees safe?",
    a: "OTP-verified boarding, live trip sharing, an in-app SOS that alerts your security desk, and configurable rules for night drops.",
  },
  {
    q: "Can it integrate with our HR systems?",
    a: "Yes. RoamX syncs rosters from your HRMS and supports single sign-on, so access follows your org chart automatically.",
  },
  {
    q: "When can we start?",
    a: "We're onboarding early partners now. Join the waitlist and we'll reach out to schedule your rollout.",
  },
];

export const finalCta = {
  headline: ["The next stop", "is yours."],
  sub: "Join the waitlist for early access.",
};

// All page copy lives here so it can be edited without touching components.
// Items marked TODO are placeholders awaiting real assets/details from the client.

// width and quality are added per screen by lib/imageLoader.ts
const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop`;

export const site = {
  name: "RoamX",
  tagline: "Evolve",
  url: "https://roamxevolve.pages.dev", // TODO: custom domain when ready
  title: "RoamX — Holidays, flights and stays, handled",
  description:
    "RoamX plans and manages every part of your trip: curated holiday packages, flights, hotels and stays, and a full travel desk for companies.",
  email: "hello@roamx.app", // TODO: real contact email
  instagram: "roamx", // TODO: real handle
  socials: {
    instagram: "https://instagram.com/roamx", // TODO
    linkedin: "https://linkedin.com/company/roamx", // TODO
    x: "https://x.com/roamx", // TODO
  },
};

export const nav = [
  { label: "Packages", href: "#packages" },
  { label: "How it works", href: "#how" },
  { label: "For business", href: "#business" },
  { label: "FAQ", href: "#faq" },
];

// Hero slideshow: free Unsplash photos for now. TODO: replace with the client's own package photos.
export const hero = {
  headline: ["Your next escape,", "handled."],
  sub: "Holiday packages, flights and stays, planned end to end by one team.",
  cta: "Plan my trip",
  slides: [
    { src: unsplash("photo-1444210971048-6130cf0c46cf"), alt: "Friends around a beach bonfire at sunset" }, // Kimson Doan
    { src: unsplash("photo-1697898109604-e06e88b15271"), alt: "Overwater villa in a turquoise lagoon in the Maldives" }, // Matheen Faiz
    { src: unsplash("photo-1598091383021-15ddea10925d"), alt: "Snow-capped mountains above a green meadow in Kashmir" }, // Praneet Kumar
    { src: unsplash("photo-1580502304784-8985b7eb7260"), alt: "Santorini's white cliffside village lit up at dusk" }, // James Ting
    { src: unsplash("photo-1711609110590-5ad5c4599e56"), alt: "Pura Ulun Danu Bratan temple on a lake in Bali at golden hour" }, // Katarzyna Zygnerska
    { src: unsplash("photo-1593693401060-9fc28cf9e368"), alt: "Houseboat on the palm-lined backwaters of Kerala" }, // Abhishek Prasad
  ],
};

export const problem =
  "Twenty open tabs. Hidden fees. Plans that fall apart at the airport. Your holiday deserves better.";
export const problemHighlights = ["better."];

export const steps = ["Plan", "Book", "Fly", "Stay"];
export const stepsLine = "One team takes your trip from the first idea to the last night's stay.";

// TODO: confirm destinations and package names with the client.
export const packages = {
  headline: "Where to next?",
  sub: "Curated packages with flights, stays and experiences included. Tell us when, we handle the rest.",
  items: [
    { name: "Goa", kind: "Beach escape", image: unsplash("photo-1614082242765-7c98ca0f3df3") }, // Sumit Sourav
    { name: "Maldives", kind: "Island villas", image: unsplash("photo-1601999705946-fbf42c3c6c66") }, // Upgraded Points
    { name: "Kashmir", kind: "Mountain retreat", image: unsplash("photo-1567601169793-64703dc5324a") }, // Nitin Karolla
    { name: "Kerala", kind: "Backwaters & houseboats", image: unsplash("photo-1593693411515-c20261bcad6e") }, // Abhishek Prasad
    { name: "Dubai", kind: "City & desert", image: unsplash("photo-1549944850-84e00be4203b") }, // Fernando Jorge
    { name: "Bali", kind: "Temples & tropics", image: unsplash("photo-1518548419970-58e3b4079ab2") }, // Harry Kessell
  ],
};

export const features = {
  headline: "Every part of the trip. One team.",
  items: [
    { key: "packages", title: "Holiday packages", line: "Curated itineraries for beaches, mountains and cities, with flights and stays already in place." },
    { key: "flights", title: "Flights", line: "Domestic and international tickets at the right fare, booked, changed and managed for you." },
    { key: "stays", title: "Stays", line: "Handpicked hotels, villas and resorts, from boutique hideaways to family-friendly favourites." },
    { key: "business", title: "Business travel", line: "A travel desk for companies: employee trips, approvals and one clean invoice." },
    { key: "visas", title: "Visas & insurance", line: "Paperwork and cover sorted well before you reach the airport." },
    { key: "support", title: "Support on the go", line: "One number to call from takeoff to check-out, wherever you are." },
  ],
};

export const business = {
  headline: "Travelling for work? We run that too.",
  sub: "A travel desk for companies: book, approve and track every employee trip, with flights, stays and one invoice.",
  events: [
    { t: "09:12", text: "Flight 6E 1432 confirmed for Priya S.", tone: "ok" },
    { t: "09:14", text: "Hotel booked · Marina Suites, Dubai", tone: "ok" },
    { t: "09:15", text: "Trip to Singapore approved by Finance", tone: "gold" },
    { t: "09:17", text: "AI 803 delayed 40 min → transfer moved", tone: "warn" },
    { t: "09:18", text: "Visa approved for Rahul M.", tone: "ok" },
    { t: "09:20", text: "Monthly invoice ready · 42 trips", tone: "gold" },
  ],
  trips: [
    { id: "BLR → DXB", label: "Sales offsite · 6 travellers", status: "Booked" },
    { id: "DEL → SIN", label: "Client visit · Rahul M.", status: "Approved" },
    { id: "BOM → GOI", label: "Team retreat · 18 travellers", status: "Planning" },
    { id: "HYD → BLR", label: "Training · Priya S.", status: "Completed" },
  ],
};

// TODO: replace with real customer quotes (with permission)
export const testimonials = [
  {
    quote: "Our Goa trip was planned down to the beach shack. We just packed and showed up.",
    name: "Ananya & Rohit",
    org: "Goa, 5 nights",
  },
  {
    quote: "Flights, villa, transfers, even the sunset cruise. One call, zero stress.",
    name: "The Mehta family",
    org: "Maldives, 6 nights",
  },
  {
    quote: "Forty people to Dubai for our offsite, and finance got a single invoice.",
    name: "HR Lead",
    org: "Technology company",
  },
];

// TODO: real team names, roles and photos
export const team = [
  { name: "Founder Name", role: "Founder & CEO", image: "" },
  { name: "Co-founder Name", role: "Co-founder", image: "" },
  { name: "Team Member", role: "Head of Travel Operations", image: "" },
  { name: "Team Member", role: "Holiday Specialist", image: "" },
];

export const faq = [
  {
    q: "What can RoamX book for me?",
    a: "Everything a trip needs: holiday packages, domestic and international flights, hotels, villas and resorts, transfers, sightseeing, visas and travel insurance.",
  },
  {
    q: "Can I customise a package?",
    a: "Always. Every package is a starting point. Change the dates, the stay, the pace or the budget and we'll rebuild the itinerary around you.",
  },
  {
    q: "How do I get a quote?",
    a: "Tell us where you'd like to go, roughly when and who's travelling. A specialist will come back with options and a clear price, usually within a day.",
  },
  {
    q: "Do you handle business travel?",
    a: "Yes. Companies use RoamX as their travel desk: employee flights and stays, approvals, offsites and team retreats, all on one invoice.",
  },
  {
    q: "What happens if my flight changes?",
    a: "We watch your bookings and handle the changes: rebooking, moving transfers and letting your hotel know. You get one number to call throughout the trip.",
  },
  {
    q: "Is my payment safe?",
    a: "Payments are made through secure, verified channels, and every booking is confirmed in writing before you travel.",
  },
];

export const finalCta = {
  headline: ["Your next stop", "starts here."],
  sub: "Tell us where you'd like to go. A RoamX specialist will plan it with you.",
};

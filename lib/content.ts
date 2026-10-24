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

// "Student to entrepreneur": a pinned photo story, one glass card per beat. Free Unsplash photos for now.
// `pos` = object-position, so each photo keeps its subject on portrait screens too.
// TODO: swap the portal card's mockup for the client's dashboard screenshots when they arrive.
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

// Only answers confirmed by the client. TODO: add more as the client confirms them (see the questions doc).
// Ordered the way a student's doubts arrive. The studies and parents answers are built from confirmed facts.
export const faq = [
  {
    q: "What do I get for ₹9,999?",
    a: "Your own travel business portal: one dashboard to sell flights and hotels (plus buses and holiday packages) under your own brand, with training on how to use it. It's a one-time payment for up to 5 years of use, with no hidden fees.",
  },
  {
    q: "I'm a student with no experience. Can I do this?",
    a: "Yes, that's who RoamX is built for. The software works as a guide to the travel business, so you learn customer handling and gain real experience as you go.",
  },
  {
    q: "Will it get in the way of my studies?",
    a: "No. There are no shifts. You take bookings when it suits you, between classes or at weekends.",
  },
  {
    q: "How do I earn money?",
    a: "You add your own markup on top of the price in your portal and keep it. For example, if a ticket costs ₹1,000 in your portal and you sell it for ₹1,200, the ₹200 is yours.",
  },
  {
    q: "How do I explain this to my parents?",
    a: "It's a one-time ₹9,999 for up to 5 years, with training and a RoamX team behind you. There's no stock or office to pay for, and you keep the skills whatever you do next.",
  },
  {
    q: "Will I be trained?",
    a: "Yes. You get training on using your portal, so you can take your first booking with confidence.",
  },
  {
    q: "Will my customers see my brand?",
    a: "Yes. Your brand's logo and name appear on the bookings you make, so your customers see your business, not ours.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Your portal opens at its own web link, on a laptop or your phone.",
  },
  {
    q: "Is it only for students?",
    a: "No. We focus on students, but anyone who wants to start earning on their own can join.",
  },
  {
    q: "Who runs the platform?",
    a: "A RoamX team runs the portal behind you, so you can focus on finding and looking after your customers.",
  },
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

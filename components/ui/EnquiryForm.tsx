"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DESTINATION_EVENT } from "@/components/sections/Packages";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";
type Fields = { name: string; email: string; phone: string; destination: string; when: string; travellers: string; kind: string };

const EMPTY: Fields = { name: "", email: "", phone: "", destination: "", when: "", travellers: "2", kind: "Holiday" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field =
  "h-13 w-full rounded-2xl border border-ivory-50/15 bg-navy-950/50 px-4 text-[16px] text-ivory-50 outline-none transition-colors placeholder:text-ivory-50/40 focus:border-gold-400";

export default function EnquiryForm({ className }: { className?: string }) {
  const [f, setF] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // "Plan this trip" on a package card pre-fills the destination.
  useEffect(() => {
    const onPick = (e: Event) => setF((v) => ({ ...v, destination: (e as CustomEvent<string>).detail, kind: "Holiday" }));
    window.addEventListener(DESTINATION_EVENT, onPick);
    return () => window.removeEventListener(DESTINATION_EVENT, onPick);
  }, []);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setF((v) => ({ ...v, [k]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return fail("Tell us your name.");
    if (!EMAIL.test(f.email) && f.phone.replace(/\D/g, "").length < 7) return fail("Add an email or phone number so we can reach you.");
    setStatus("loading");
    const utm = Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith("utm_")));
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, ...utm }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      fail("Something went wrong. Please try again.");
    }
  }

  function fail(msg: string) {
    setMessage(msg);
    setStatus("error");
  }

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-gold-400/40 bg-navy-950/50 p-7"
          >
            <p className="font-display text-2xl font-semibold">Thank you, {f.name.split(" ")[0]}.</p>
            <p className="mt-2 text-ivory-50/70">
              A RoamX specialist will get back to you{f.destination ? ` about ${f.destination}` : ""} within a day.
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="grid gap-3 sm:grid-cols-2">
            <div className="flex gap-2 sm:col-span-2">
              {["Holiday", "Business trip"].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setF((v) => ({ ...v, kind: k }))}
                  className={cn(
                    "h-10 rounded-full px-5 text-sm font-semibold transition-colors",
                    f.kind === k ? "bg-gold text-navy-900" : "border border-ivory-50/20 text-ivory-50/75 hover:border-ivory-50/50",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
            <label className="sr-only" htmlFor="q-name">Name</label>
            <input id="q-name" className={field} placeholder="Your name" autoComplete="name" value={f.name} onChange={set("name")} />
            <label className="sr-only" htmlFor="q-email">Email</label>
            <input id="q-email" className={field} placeholder="Email" type="email" autoComplete="email" value={f.email} onChange={set("email")} />
            <label className="sr-only" htmlFor="q-phone">Phone</label>
            <input id="q-phone" className={field} placeholder="Phone (optional)" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} />
            <label className="sr-only" htmlFor="q-dest">Destination</label>
            <input id="q-dest" className={field} placeholder="Where to?" value={f.destination} onChange={set("destination")} />
            <label className="sr-only" htmlFor="q-when">When</label>
            <input id="q-when" className={field} placeholder="When? (e.g. December)" value={f.when} onChange={set("when")} />
            <label className="sr-only" htmlFor="q-trav">Travellers</label>
            <select id="q-trav" className={cn(field, "appearance-none")} value={f.travellers} onChange={set("travellers")}>
              {["1", "2", "3", "4", "5", "6–10", "10+"].map((n) => (
                <option key={n} value={n} className="bg-navy-900">
                  {n === "1" ? "1 traveller" : `${n} travellers`}
                </option>
              ))}
            </select>
            <div className="flex flex-wrap items-center gap-4 pt-2 sm:col-span-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-gold h-13 rounded-full px-8 text-base font-semibold text-navy-900 transition hover:brightness-105 disabled:opacity-70"
              >
                {status === "loading" ? "Sending…" : "Plan my trip"}
              </button>
              <p role="status" className={cn("text-sm text-gold-200 transition-opacity", status === "error" ? "opacity-100" : "opacity-0")}>
                {status === "error" ? message : ""}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

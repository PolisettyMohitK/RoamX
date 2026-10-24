"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";
type Fields = { name: string; email: string; phone: string; city: string; message: string; kind: string };

const KINDS = ["Student", "Working professional", "Business owner"];
const EMPTY: Fields = { name: "", email: "", phone: "", city: "", message: "", kind: KINDS[0] };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "dark" for navy stages, "light" for the ivory glass panel.
const FIELD = {
  dark: "border-ivory-50/15 bg-navy-950/50 text-ivory-50 placeholder:text-ivory-50/40",
  light: "border-navy-800/10 bg-white/70 text-navy-800 placeholder:text-navy-800/40",
};

export default function EnquiryForm({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const field = cn("h-13 w-full rounded-2xl border px-4 text-[16px] outline-none transition-colors focus:border-gold-400", FIELD[tone]);
  const light = tone === "light";
  const [f, setF] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <div className={cn("w-full", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-3xl border border-gold-400/40 p-7", light ? "bg-white/70" : "bg-navy-950/50")}
          >
            <p className="font-display text-2xl font-semibold">Thank you, {f.name.split(" ")[0]}.</p>
            <p className={cn("mt-2", light ? "text-navy-800/70" : "text-ivory-50/70")}>The RoamX team will get in touch to help you get started.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setF((v) => ({ ...v, kind: k }))}
                  className={cn(
                    "h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                    f.kind === k
                      ? "bg-gold text-navy-900"
                      : light
                        ? "border border-navy-800/15 text-navy-800/70 hover:border-navy-800/40"
                        : "border border-ivory-50/20 text-ivory-50/75 hover:border-ivory-50/50",
                  )}
                >
                  {k}
                </button>
              ))}
            </div>
            <label className="sr-only" htmlFor="q-name">Name</label>
            <input id="q-name" className={field} placeholder="Your name" autoComplete="name" value={f.name} onChange={set("name")} />
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="sr-only" htmlFor="q-email">Email</label>
              <input id="q-email" className={field} placeholder="Email" type="email" autoComplete="email" value={f.email} onChange={set("email")} />
              <label className="sr-only" htmlFor="q-phone">Phone</label>
              <input id="q-phone" className={field} placeholder="Phone / WhatsApp" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} />
            </div>
            <label className="sr-only" htmlFor="q-city">City</label>
            <input id="q-city" className={field} placeholder="City" autoComplete="address-level2" value={f.city} onChange={set("city")} />
            <label className="sr-only" htmlFor="q-msg">Question</label>
            <textarea
              id="q-msg"
              className={cn(field, "h-24 resize-none py-3")}
              placeholder="Anything you'd like to ask? (optional)"
              value={f.message}
              onChange={set("message")}
            />
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  "h-13 rounded-full px-8 text-base font-semibold transition disabled:opacity-70",
                  light ? "bg-navy-800 text-ivory-50 hover:bg-navy-900" : "border border-ivory-50/40 text-ivory-50 hover:border-ivory-50",
                )}
              >
                {status === "loading" ? "Sending…" : "Get in touch"}
              </button>
              <p role="status" className={cn("text-sm transition-opacity", light ? "text-[#9a6e2a]" : "text-gold-200", status === "error" ? "opacity-100" : "opacity-0")}>
                {status === "error" ? message : ""}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

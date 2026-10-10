"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";

export default function WaitlistForm({
  tone = "dark",
  size = "md",
  className,
}: {
  tone?: "dark" | "light";
  size?: "md" | "lg";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Enter a valid work email.");
      return;
    }
    setStatus("loading");
    const params = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries([...params].filter(([k]) => k.startsWith("utm_")));
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...utm }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  const dark = tone === "dark";
  const lg = size === "lg";

  return (
    <div className={cn("w-full", lg ? "max-w-xl" : "max-w-md", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-3 rounded-full border px-5 font-medium",
              lg ? "h-16 text-lg" : "h-14",
              dark ? "border-gold-400/40 text-ivory-50" : "border-gold-500/50 text-navy-800",
            )}
          >
            <span className="bg-gold grid size-7 place-items-center rounded-full text-navy-900">
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M3 8.5 6.5 12 13 4.5" />
              </svg>
            </span>
            You&apos;re on board. We&apos;ll be in touch.
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -8 }}>
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border p-1.5 backdrop-blur-md transition-colors",
                dark
                  ? "border-ivory-50/20 bg-navy-950/40 focus-within:border-gold-400/70"
                  : "border-navy-800/15 bg-white/70 focus-within:border-gold-500",
              )}
            >
              <label htmlFor={`email-${tone}-${size}`} className="sr-only">
                Work email
              </label>
              <input
                id={`email-${tone}-${size}`}
                type="email"
                autoComplete="email"
                placeholder="Work email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className={cn(
                  "min-w-0 flex-1 bg-transparent px-4 outline-none",
                  lg ? "h-13 text-lg" : "h-11",
                  dark ? "text-ivory-50 placeholder:text-ivory-50/45" : "text-navy-800 placeholder:text-navy-800/40",
                )}
                style={{ outline: "none" }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  "bg-gold shrink-0 rounded-full font-semibold text-navy-900 transition-[transform,filter] hover:brightness-105 active:scale-[0.97] disabled:opacity-70",
                  lg ? "h-13 px-7 text-base" : "h-11 px-5 text-sm",
                )}
              >
                {status === "loading" ? "Joining…" : "Join waitlist"}
              </button>
            </div>
            <p
              role="status"
              className={cn(
                "mt-2 h-5 pl-5 text-sm transition-opacity",
                status === "error" ? "opacity-100" : "opacity-0",
                dark ? "text-gold-200" : "text-[#a3471f]",
              )}
            >
              {status === "error" ? message : ""}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

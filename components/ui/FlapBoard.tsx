"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { brand, hero } from "@/lib/content";

// Board columns, in cells. Kind, price and the status word drop off on phones; the lamp stays.
const COLS = [
  { key: "book", n: 12, label: "Booking", phone: true },
  { key: "kind", n: 6, label: "Type", phone: false },
  { key: "price", n: 7, label: "Price", phone: false },
  { key: "markup", n: 7, label: "Your markup", phone: true },
  { key: "status", n: 9, label: "Status", phone: false },
] as const;
const ROWS = 5; // the last one is hidden on phones
const BRAND_CELLS = 14;
const GLYPHS = "ABCDEFGHIJKLMNOPRSTUVWXYZ0123456789";
const HALF = 0.055; // seconds per half-flap
const NEXT_EVERY = 3.6; // seconds between new bookings
const CONFIRM_AFTER = 1.9;

type Booking = (typeof hero.bookings)[number];
const pad = (t: string, n: number) => t.padEnd(n).slice(0, n);
const running = new WeakMap<HTMLElement, gsap.core.Timeline>();

function write(half: Element, ch: string) {
  (half.firstElementChild as HTMLElement).textContent = ch;
}

/** Flip one cell to `to`, through a few random letters on the way, like a Solari board. */
function flip(cell: HTMLElement, to: string, delay: number) {
  running.get(cell)?.progress(1).kill();
  const from = cell.dataset.ch ?? " ";
  if (from === to) return;
  cell.dataset.ch = to;
  const [top, bottom, fallTop, fallBottom] = Array.from(cell.children);
  const steps = gsap.utils.random(1, 3, 1);
  const seq = [...Array.from({ length: steps }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]), to];
  let cur = from;
  const tl = gsap.timeline({ delay });
  seq.forEach((next) => {
    tl.add(() => {
      write(top, next);
      write(fallTop, cur);
      write(fallBottom, next);
      write(bottom, cur);
      gsap.set(fallTop, { rotationX: 0, visibility: "visible" });
      gsap.set(fallBottom, { rotationX: 90, visibility: "visible" });
    })
      .to(fallTop, { rotationX: -90, duration: HALF, ease: "power1.in" })
      .to(fallBottom, { rotationX: 0, duration: HALF, ease: "power1.out" })
      .add(() => {
        write(bottom, next);
        gsap.set([fallTop, fallBottom], { visibility: "hidden" });
        cur = next;
      });
  });
  running.set(cell, tl);
}

/** Set a run of cells to `text`; cells on a hidden column change silently. */
function setText(cells: HTMLElement[], text: string, delay = 0) {
  const t = pad(text, cells.length);
  const visible = cells[0]?.offsetParent !== null;
  cells.forEach((c, i) => {
    if (visible) flip(c, t[i], delay + i * 0.035);
    else {
      c.dataset.ch = t[i];
      Array.from(c.children).forEach((h, k) => k < 2 && write(h, t[i]));
    }
  });
}

function Cells({ n }: { n: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} data-cell className="flap">
          <span className="t">
            <i />
          </span>
          <span className="b">
            <i />
          </span>
          <span className="ft">
            <i />
          </span>
          <span className="fb">
            <i />
          </span>
        </span>
      ))}
    </>
  );
}

/*
 * A split-flap bookings board: flights and hotels arrive one by one under the seller's brand, each showing
 * the price and the markup they keep. Starts when `active` turns true, and pauses while off screen.
 */
export default function FlapBoard({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const el = root.current!;
    const cellsOf = (scope: Element, sel: string) => Array.from(scope.querySelectorAll<HTMLElement>(`${sel} [data-cell]`));
    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-row]"));
    const brandCells = cellsOf(el, "[data-brand]");
    const brands = brand.samples.map((b) => b.name.toUpperCase());
    const pool = hero.bookings;

    const fill = (row: HTMLElement, b: Booking, confirmed: boolean, delay: number) => {
      setText(cellsOf(row, '[data-col="book"]'), b.book, delay);
      setText(cellsOf(row, '[data-col="kind"]'), b.kind, delay + 0.15);
      setText(cellsOf(row, '[data-col="price"]'), b.price, delay + 0.3);
      setText(cellsOf(row, '[data-col="markup"]'), confirmed ? b.markup : "", delay + 0.45);
      setText(cellsOf(row, '[data-col="status"]'), confirmed ? "CONFIRMED" : "BOOKING", delay + 0.6);
      row.dataset.confirmed = String(confirmed);
    };

    // first fill, top to bottom
    setText(brandCells, brands[0]);
    rows.forEach((r, i) => fill(r, pool[i % pool.length], true, 0.3 + i * 0.35));

    // then a new booking every few seconds, replacing the oldest row
    let n = rows.length;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const calls: gsap.core.Tween[] = [];
    const tick = () => {
      if (visible && !document.hidden) {
        const row = rows[n % rows.length];
        const b = pool[n % pool.length];
        fill(row, b, false, 0);
        calls.push(
          gsap.delayedCall(CONFIRM_AFTER, () => {
            setText(cellsOf(row, '[data-col="markup"]'), b.markup);
            setText(cellsOf(row, '[data-col="status"]'), "CONFIRMED", 0.1);
            row.dataset.confirmed = "true";
          }),
        );
        if (n % 4 === 0) setText(brandCells, brands[(n / 4) % brands.length], 0.4);
        n++;
      }
      calls.push(gsap.delayedCall(NEXT_EVERY, tick));
    };
    calls.push(gsap.delayedCall(3.2, tick));

    return () => {
      io.disconnect();
      calls.forEach((c) => c.kill());
    };
  }, [active]);

  return (
    <div
      ref={root}
      className="rounded-[calc(var(--cw)*0.9)] border border-ivory-50/10 bg-[#060d1f] p-[calc(var(--cw)*0.9)] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7),inset_0_1px_0_rgb(255_255_255/0.08)] [--cw:min(24px,calc((100vw-170px)/47))] max-sm:[--cw:calc((100vw-80px)/22.5)]"
      aria-label="Example bookings: flights and hotels sold under your own brand, with the markup you keep"
      role="img"
    >
      <div className="flex items-center gap-[calc(var(--cw)*0.6)] pb-[calc(var(--cw)*0.7)]">
        <span className="font-display text-[calc(var(--cw)*0.75)] font-semibold text-ivory-50/60">Bookings</span>
        <span data-brand className="flex gap-[2px] [--ink:#e7c27a]">
          <Cells n={BRAND_CELLS} />
        </span>
      </div>

      <div className="flex gap-[calc(var(--cw)*0.6)] pb-[calc(var(--cw)*0.3)] text-[calc(var(--cw)*0.5)] font-semibold text-ivory-50/40">
        {COLS.map((c) => (
          <span key={c.key} className={c.phone ? "" : "max-sm:hidden"} style={{ width: `calc(var(--cw) * ${c.n} + ${(c.n - 1) * 2}px)` }}>
            {c.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-[calc(var(--cw)*0.25)]">
        {Array.from({ length: ROWS }, (_, r) => (
          <div key={r} data-row className={`group flex items-center gap-[calc(var(--cw)*0.6)] ${r === ROWS - 1 ? "max-sm:hidden" : ""}`}>
            {COLS.map((c) => (
              <span
                key={c.key}
                data-col={c.key}
                className={`flex gap-[2px] ${c.phone ? "" : "max-sm:hidden"} ${c.key === "markup" ? "[--ink:#e7c27a]" : ""}`}
              >
                <Cells n={c.n} />
              </span>
            ))}
            {/* status lamp: dim while booking, gold once confirmed */}
            <span className="size-[calc(var(--cw)*0.4)] shrink-0 rounded-full bg-ivory-50/15 transition-colors duration-500 group-data-[confirmed=true]:bg-[#e7c27a] group-data-[confirmed=true]:shadow-[0_0_10px_#e7c27a]" />
          </div>
        ))}
      </div>
    </div>
  );
}

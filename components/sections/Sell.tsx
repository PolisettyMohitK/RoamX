import Image from "next/image";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { sell } from "@/lib/content";

/*
 * A still collage: wide and tall photos packed into columns (2 on phones, 3 on tablets, 4 on desktop),
 * so the edges fall unevenly. No captions, no hover, no motion.
 */
export default function Sell() {
  return (
    <section id="sell" className="relative overflow-hidden bg-ivory-50 py-28 sm:py-40">
      <AmbientBackground />
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[13ch] font-display text-[clamp(40px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.04em] text-navy-800">
            {sell.headline}
          </h2>
          <p className="max-w-[40ch] text-[clamp(16px,1.4vw,19px)] leading-relaxed text-navy-800/65">{sell.sub}</p>
        </div>

        <div className="mt-14 columns-2 gap-2 sm:mt-20 md:columns-3 xl:columns-4">
          {sell.items.map((p) => (
            <div key={p.image} className="relative mb-2 break-inside-avoid overflow-hidden rounded-[14px] bg-navy-800" style={{ aspectRatio: p.ratio }}>
              <Image src={p.image} alt={p.alt} fill quality={82} sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

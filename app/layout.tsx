import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono, Josefin_Sans } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { site, faq } from "@/lib/content";
import "./globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });
const josefin = Josefin_Sans({ variable: "--font-josefin", subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "RoamX — Corporate mobility, handled",
  description: site.description,
  openGraph: {
    title: "RoamX — Corporate mobility, handled",
    description: site.description,
    url: site.url,
    siteName: "RoamX",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "RoamX — Corporate mobility, handled", description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#091330",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RoamX",
    url: site.url,
    slogan: "Evolve",
    sameAs: Object.values(site.socials),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrains.variable} ${josefin.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

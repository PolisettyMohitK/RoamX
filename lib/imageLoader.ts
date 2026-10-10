// next/image loader for the static export: Unsplash resizes on its CDN, so each <Image> gets a real srcset
// (phones download a small copy, large and high-DPI screens up to 3840 px wide).
export default function unsplashLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("https://images.unsplash.com/")) return src;
  return `${src}${src.includes("?") ? "&" : "?"}w=${width}&q=${quality ?? 80}`;
}

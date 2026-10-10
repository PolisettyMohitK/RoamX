import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages: `next build` writes the site to ./out.
  // The waitlist endpoint lives in ./functions (a Cloudflare Pages Function).
  output: "export",
  images: { loader: "custom", loaderFile: "./lib/imageLoader.ts" },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  // One small stylesheet: inlining it saves a render-blocking round trip.
  experimental: { inlineCss: true },
  images: {
    // Static export has no optimizer: scripts/images.mjs pre-renders AVIF and
    // WebP files and the loader maps each requested width onto them.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Must match LADDER in scripts/images.mjs.
    imageSizes: [48, 96, 160, 240, 320, 480],
    deviceSizes: [640, 800, 960, 1280, 1600, 1920, 2560, 3840],
  },
};

export default nextConfig;

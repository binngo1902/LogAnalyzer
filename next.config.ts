import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/LogAnalyzer",
  assetPrefix: '/LogAnalyzer',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

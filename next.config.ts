import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/wedding-app",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

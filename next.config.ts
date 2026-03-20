import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/preview",
        destination: "/preview.html"
      }
    ];
  }
};

export default nextConfig;

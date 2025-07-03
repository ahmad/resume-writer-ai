import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    largePageDataBytes: 128 * 1024 * 1024,
  }
};

export default nextConfig;

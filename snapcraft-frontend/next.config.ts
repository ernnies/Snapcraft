import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, 
  },
  reactStrictMode: true,
  "output": "export",
};

export default nextConfig;

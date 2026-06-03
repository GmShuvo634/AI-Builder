import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['rate-limiter-flexible'],
  output: "standalone",
};

export default nextConfig;

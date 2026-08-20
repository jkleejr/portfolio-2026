import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows opening the dev server from other devices on your network
  // (the "Network:" URL that `npm run dev` prints)
  allowedDevOrigins: ["192.168.86.152"],
};

export default nextConfig;

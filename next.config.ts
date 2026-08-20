import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows opening the dev server from other devices on your network
  // (the "Network:" URL that `npm run dev` prints)
  allowedDevOrigins: ["192.168.86.152"],

  // Next 16 only serves qualities named here. 90 keeps the small screenshot
  // thumbnails legible; 75 is the built-in default everything else uses.
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
